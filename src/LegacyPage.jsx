import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LEGACY_ASSET_ATTR = 'data-legacy-asset';

const originalMetaTags = {};
function getOriginalMetaContent(selector) {
  if (originalMetaTags[selector] !== undefined) {
    return originalMetaTags[selector];
  }
  const el = document.head.querySelector(selector);
  originalMetaTags[selector] = el ? el.getAttribute('content') : null;
  return originalMetaTags[selector];
}

function syncMetaTags(doc) {
  const tagsToSync = [
    { selector: 'meta[name="description"]', attr: 'name', value: 'description' },
    { selector: 'meta[name="keywords"]', attr: 'name', value: 'keywords' },
    { selector: 'meta[property="og:title"]', attr: 'property', value: 'og:title' },
    { selector: 'meta[property="og:description"]', attr: 'property', value: 'og:description' },
    { selector: 'meta[property="twitter:title"]', attr: 'property', value: 'twitter:title' },
    { selector: 'meta[property="twitter:description"]', attr: 'property', value: 'twitter:description' },
  ];

  tagsToSync.forEach(({ selector, attr, value }) => {
    const legacyTag = doc.querySelector(selector);
    let mainTag = document.head.querySelector(selector);
    const originalContent = getOriginalMetaContent(selector);
    
    if (legacyTag) {
      if (!mainTag) {
        mainTag = document.createElement('meta');
        mainTag.setAttribute(attr, value);
        document.head.appendChild(mainTag);
      }
      mainTag.setAttribute('content', legacyTag.getAttribute('content') || '');
    } else if (mainTag) {
      if (originalContent !== null) {
         mainTag.setAttribute('content', originalContent);
      } else {
         mainTag.remove();
      }
    }
  });
}

function clearLegacyAssets() {
  document.querySelectorAll(`[${LEGACY_ASSET_ATTR}]`).forEach((node) => node.remove());
}

function applyBodyAttributes(legacyBody) {
  document.body.className = legacyBody.className || '';

  const styleValue = legacyBody.getAttribute('style');
  if (styleValue) {
    document.body.setAttribute('style', styleValue);
  } else {
    document.body.removeAttribute('style');
  }
}

function createStylesheetNode(linkNode) {
  const href = linkNode.getAttribute('href');
  if (!href) return null;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = href;
  stylesheet.setAttribute(LEGACY_ASSET_ATTR, '1');
  return stylesheet;
}

function createScriptNode(scriptNode) {
  const script = document.createElement('script');
  script.setAttribute(LEGACY_ASSET_ATTR, '1');

  const type = scriptNode.getAttribute('type');
  if (type) script.type = type;

  const src = scriptNode.getAttribute('src');
  if (src) {
    script.src = src;

    if (!type || type === 'text/javascript') {
      script.async = false;
    }
  } else {
    script.textContent = scriptNode.textContent;
  }

  return script;
}

async function runScriptsSequentially(scriptNodes) {
  for (const scriptNode of scriptNodes) {
    const injectedScript = createScriptNode(scriptNode);
    if (!injectedScript) continue;

    const hasSrc = Boolean(injectedScript.getAttribute('src'));
    const isClassic = !injectedScript.type || injectedScript.type === 'text/javascript';

    if (hasSrc && isClassic) {
      await new Promise((resolve) => {
        injectedScript.onload = resolve;
        injectedScript.onerror = resolve;
        document.body.appendChild(injectedScript);
      });
      continue;
    }

    document.body.appendChild(injectedScript);
  }
}

export default function LegacyPage({ file }) {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const sourcePath = useMemo(() => `/legacy/${file}`, [file]);

  useEffect(() => {
    let cancelled = false;

    async function loadLegacyPage() {
      try {
        setError('');
        setIsLoading(true);
        clearLegacyAssets();

        const response = await fetch(sourcePath, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Failed to load ${sourcePath}`);
        }

        const html = await response.text();
        if (cancelled) return;

        const doc = new DOMParser().parseFromString(html, 'text/html');

        document.title = doc.title || 'TrainIQ';
        syncMetaTags(doc);
        applyBodyAttributes(doc.body);

        const stylesheetLinks = [...doc.querySelectorAll('link[rel="stylesheet"]')];
        stylesheetLinks.forEach((linkNode) => {
          const stylesheet = createStylesheetNode(linkNode);
          if (stylesheet) {
            document.head.appendChild(stylesheet);
          }
        });

        if (containerRef.current) {
          containerRef.current.innerHTML = doc.body.innerHTML;
        }

        await runScriptsSequentially([...doc.querySelectorAll('script')]);

        document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
        window.dispatchEvent(new Event('load'));
        
        if (!cancelled) {
          setIsLoading(false);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Failed to load legacy page.');
          setIsLoading(false);
        }
      }
    }

    loadLegacyPage();

    return () => {
      cancelled = true;
      clearLegacyAssets();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [sourcePath]);

  useEffect(() => {
    function handleDocumentClick(event) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a[href]');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return;

      const href = anchor.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#')) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;

      let url;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const isHtmlRoute = url.pathname === '/' || url.pathname.endsWith('.html');
      if (!isHtmlRoute) return;

      event.preventDefault();
      
      // Start fade out before navigating
      setIsLoading(true);
      setTimeout(() => {
        navigate(`${url.pathname}${url.search}${url.hash}`);
      }, 150);
    }

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [navigate]);

  if (error) {
    return (
      <main className="legacy-error" style={{ color: 'white', textAlign: 'center', paddingTop: '100px' }}>
        <h1>Unable to load page</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <div 
      ref={containerRef} 
      style={{ 
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 0.3s ease-in-out',
        minHeight: '100vh',
        backgroundColor: '#000'
      }} 
    />
  );
}
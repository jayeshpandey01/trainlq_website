// js/page-transition.js
document.addEventListener("DOMContentLoaded", () => {
    // 1. Create the overlay
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    // Use bg-[#000000] to match the elegant dark theme
    overlay.style.cssText = 'position: fixed; inset: 0; background-color: #000000; z-index: 999999; pointer-events: none; transition: opacity 0.5s ease-in-out; opacity: 1;';
    
    // Safety check - insert as first child of body
    document.body.insertBefore(overlay, document.body.firstChild);

    // 2. Fade out the overlay to reveal the page smoothly
    // A small delay ensures the browser renders the opacity: 1 state first
    setTimeout(() => {
        overlay.style.opacity = '0';
    }, 50);

    // 3. Intercept clicks across the document
    document.documentElement.addEventListener("click", (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        const target = link.getAttribute('target');
        
        // Ignore if no href, external link, or explicitly opening in new tab
        if (!href || href.startsWith('http') || target === '_blank') return;
        
        // Extract the target path to compare
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const linkPath = href.split('#')[0];
        
        // If clicking a link to the exact same page we are currently on (e.g. anchor link)
        if (linkPath === currentPath || (linkPath === '' && href.startsWith('#'))) {
            return; // Let the browser handle standard anchor scrolling
        }
        
        // Valid internal multi-page link -> intercept, fade to black, navigate
        e.preventDefault();
        
        overlay.style.opacity = '1';
        
        // Wait 500ms for transition CSS to finish, then hard navigate
        setTimeout(() => {
            window.location.href = href;
        }, 500);
    });

    // Handle back/forward cache (BFCache) for Safari/Firefox
    window.addEventListener('pageshow', (event) => {
        if (event.persisted && overlay) {
            overlay.style.opacity = '0';
        }
    });
});

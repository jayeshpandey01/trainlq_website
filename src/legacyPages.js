export const legacyFiles = new Set([
  'index.html',
  'blog.html',
  'contact.html',
  'dashboard.html',
  'login.html',
  'models.html',
  'research.html',
  'signup.html',
  'faq.html',
  'privacy.html',
  'terms.html'
]);

export function resolveLegacyFile(pathname) {
  if (!pathname || pathname === '/') return 'index.html';

  const cleanPath = pathname.replace(/^\/+/, '').split('?')[0].split('#')[0];
  if (!cleanPath) return 'index.html';

  const fileCandidate = cleanPath.endsWith('.html') ? cleanPath : `${cleanPath}.html`;
  return legacyFiles.has(fileCandidate) ? fileCandidate : null;
}
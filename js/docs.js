/**
 * TrainIQ Docs — Mobile sidebar toggle + Search overlay
 * Shared across research.html and models.html
 */
(function () {
    'use strict';

    /* ──────────────────────────────────────────────
     * 1. MOBILE SIDEBAR TOGGLE
     * ────────────────────────────────────────────── */
    const sidebar = document.querySelector('aside');
    const menuBtn = document.getElementById('sidebarToggle');
    const closeBtn = document.getElementById('sidebarClose');

    if (menuBtn && sidebar) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-30 hidden lg:hidden';
        overlay.id = 'sidebarOverlay';
        document.body.appendChild(overlay);

        function openSidebar() {
            sidebar.classList.remove('hidden');
            sidebar.classList.add('block');
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeSidebar() {
            sidebar.classList.add('hidden');
            sidebar.classList.remove('block');
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }

        menuBtn.addEventListener('click', openSidebar);
        if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);

        // Close sidebar when a nav link is clicked (mobile)
        sidebar.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', closeSidebar);
        });
    }

    /* ──────────────────────────────────────────────
     * 2. SEARCH MODAL
     * ────────────────────────────────────────────── */

    // Build search modal DOM
    const modal = document.createElement('div');
    modal.id = 'searchModal';
    modal.className = 'fixed inset-0 z-[3000] hidden';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" id="searchOverlay"></div>
        <div class="relative max-w-2xl mx-auto mt-24 px-4">
            <div class="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden">
                <div class="flex items-center gap-3 px-5 py-4 border-b border-neutral-800">
                    <svg class="w-5 h-5 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input id="searchInput" type="text" placeholder="Search documentation..." class="flex-1 bg-transparent text-white text-base outline-none placeholder-neutral-500" autocomplete="off" />
                    <kbd class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-neutral-500 border border-neutral-700 rounded bg-neutral-800">ESC</kbd>
                </div>
                <div id="searchResults" class="max-h-[60vh] overflow-y-auto p-2">
                    <div class="text-center py-10 text-neutral-500 text-sm">Type to search sections, headings, and code...</div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // Collect all searchable sections
    function buildSearchIndex() {
        const sections = document.querySelectorAll('main section[id]');
        const items = [];
        sections.forEach(section => {
            const heading = section.querySelector('h1, h2, h3');
            const text = section.textContent || '';
            const codeBlocks = section.querySelectorAll('code, pre');
            let codeText = '';
            codeBlocks.forEach(c => { codeText += ' ' + c.textContent; });

            items.push({
                id: section.id,
                title: heading ? heading.textContent.trim() : section.id,
                preview: text.substring(0, 300).replace(/\s+/g, ' ').trim(),
                code: codeText.substring(0, 500),
                el: section
            });
        });
        return items;
    }

    let searchIndex = [];

    function openSearch() {
        if (searchIndex.length === 0) searchIndex = buildSearchIndex();
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        searchInput.value = '';
        searchInput.focus();
        renderResults('');
    }

    function closeSearch() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    function renderResults(query) {
        if (!query.trim()) {
            searchResults.innerHTML = '<div class="text-center py-10 text-neutral-500 text-sm">Type to search sections, headings, and code...</div>';
            return;
        }

        const q = query.toLowerCase();
        const matches = searchIndex.filter(item => {
            return item.title.toLowerCase().includes(q)
                || item.preview.toLowerCase().includes(q)
                || item.code.toLowerCase().includes(q);
        });

        if (matches.length === 0) {
            searchResults.innerHTML = `<div class="text-center py-10 text-neutral-500 text-sm">No results found for "<span class="text-white">${escapeHtml(query)}</span>"</div>`;
            return;
        }

        searchResults.innerHTML = matches.map(item => {
            const snippet = getSnippet(item.preview, q);
            return `
                <a href="#${item.id}" class="block px-4 py-3 rounded-xl hover:bg-neutral-800/80 transition-colors group" data-search-link>
                    <div class="text-sm font-medium text-white group-hover:text-blue-400 transition-colors mb-1">${highlightMatch(item.title, q)}</div>
                    <div class="text-xs text-neutral-500 line-clamp-2">${highlightMatch(snippet, q)}</div>
                </a>
            `;
        }).join('');

        // Add click handlers to close search on selection
        searchResults.querySelectorAll('[data-search-link]').forEach(link => {
            link.addEventListener('click', () => {
                closeSearch();
            });
        });
    }

    function getSnippet(text, query) {
        const idx = text.toLowerCase().indexOf(query);
        if (idx === -1) return text.substring(0, 120);
        const start = Math.max(0, idx - 40);
        const end = Math.min(text.length, idx + query.length + 80);
        return (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
    }

    function highlightMatch(text, query) {
        if (!query) return text;
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        return escapeHtml(text).replace(regex, '<mark class="bg-blue-500/30 text-blue-300 rounded px-0.5">$1</mark>');
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Event listeners
    searchOverlay.addEventListener('click', closeSearch);

    searchInput.addEventListener('input', (e) => {
        renderResults(e.target.value);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeSearch();
        }
        // Cmd/Ctrl + K to open search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (modal.classList.contains('hidden')) {
                openSearch();
            } else {
                closeSearch();
            }
        }
    });

    // Wire up all search buttons (the magnifying glass icon in header)
    document.querySelectorAll('[data-search-trigger]').forEach(btn => {
        btn.addEventListener('click', openSearch);
    });

})();

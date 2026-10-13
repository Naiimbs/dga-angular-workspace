/* ============================================
   ICONS SHOWCASE MODULE (v3)
   DGA Design System - Icon Browser
   Sidebar packs, grid view, detail modal
   with style variants
   ============================================ */

const ICON_VARIANTS = [
    { label: 'Stroke Rounded', classes: '' },
    { label: 'Twotone Rounded', classes: 'twotone rounded' },
    { label: 'Duotone Rounded', classes: 'duotone rounded' },
    { label: 'Solid Rounded', classes: 'solid rounded' },
    { label: 'Bulk Rounded', classes: 'bulk rounded' },
    { label: 'Stroke Sharp', classes: 'stroke sharp' },
    { label: 'Solid Sharp', classes: 'solid sharp' }
];

class IconsShowcase {
    constructor(config = {}) {
        this.registry = window.DGA_ICON_REGISTRY || [];
        this.gridContainerId = config.gridContainerId || 'icons-grid-container';
        this.packsListId = config.packsListId || 'icons-packs-list';
        this.searchInputId = config.searchInputId || 'icons-search';
        this.searchClearId = config.searchClearId || 'icons-search-clear';
        this.toastId = config.toastId || 'icons-copy-toast';

        this.currentPack = 'all';
        this.currentSearch = '';
        this.currentVariantIndex = 0;
        this.debounceTimer = null;
        this.toastTimer = null;
        this.activeTab = 'html';
        this.activeIconClass = '';
        this.activeIconPack = '';
        this.activeVariantIndex = 0;

        // Build reverse lookup: iconClass -> category
        this.iconToCategory = {};
        this.registry.forEach(cat => {
            cat.icons.forEach(ic => {
                this.iconToCategory[ic] = cat;
            });
        });

        this.init();
    }

    init() {
        this.renderPacksSidebar();
        this.renderTypeFilters();
        this.renderIcons();
        this.bindEvents();
    }

    /* ------------------------------------------
       ICON PACKS SIDEBAR
       ------------------------------------------ */
    renderPacksSidebar() {
        const container = document.getElementById(this.packsListId);
        if (!container) return;
        container.innerHTML = '';

        const fragment = document.createDocumentFragment();

        // "All" item
        const allBtn = this.createPackItem('all', 'All Icons', this.getTotalCount(), null);
        if (this.currentPack === 'all') allBtn.classList.add('icons-pack-item--active');
        fragment.appendChild(allBtn);

        this.registry.forEach(cat => {
            const previewIcon = cat.icons[0] || null;
            const label = this.formatPackLabel(cat.label);
            const btn = this.createPackItem(cat.id, label, cat.icons.length, previewIcon);
            if (this.currentPack === cat.id) btn.classList.add('icons-pack-item--active');
            fragment.appendChild(btn);
        });

        container.appendChild(fragment);
    }

    createPackItem(id, label, count, previewIconClass) {
        const btn = document.createElement('button');
        btn.className = 'icons-pack-item';
        btn.dataset.pack = id;

        // Icon preview
        const iconWrap = document.createElement('span');
        iconWrap.className = 'icons-pack-icon';
        if (previewIconClass) {
            const iconEl = document.createElement('span');
            iconEl.className = 'icon ' + previewIconClass;
            iconWrap.appendChild(iconEl);
        }
        btn.appendChild(iconWrap);

        // Name
        const nameEl = document.createElement('span');
        nameEl.className = 'icons-pack-name';
        nameEl.textContent = label;
        btn.appendChild(nameEl);

        // Count
        const countEl = document.createElement('span');
        countEl.className = 'icons-pack-count';
        countEl.textContent = count;
        btn.appendChild(countEl);

        return btn;
    }

    formatPackLabel(label) {
        return label.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                    .replace(/ /g, ' + ');
    }

    getTotalCount() {
        return this.registry.reduce((sum, cat) => sum + cat.icons.length, 0);
    }

    /* ------------------------------------------
       ICON TYPE FILTERS
       ------------------------------------------ */
    renderTypeFilters() {
        const container = document.querySelector('.icons-type-filters-list');
        if (!container) return;
        container.innerHTML = '';

        const fragment = document.createDocumentFragment();

        ICON_VARIANTS.forEach((variant, i) => {
            const btn = document.createElement('button');
            btn.className = 'icons-type-filter-btn';
            if (i === this.currentVariantIndex) btn.classList.add('icons-type-filter-btn--active');
            btn.dataset.variantIndex = i;

            const label = document.createElement('span');
            label.textContent = variant.label;
            btn.appendChild(label);

            fragment.appendChild(btn);
        });

        container.appendChild(fragment);
    }

    /* ------------------------------------------
       ICONS GRID
       ------------------------------------------ */
    renderIcons() {
        const container = document.getElementById(this.gridContainerId);
        if (!container) return;
        container.innerHTML = '';

        const searchTerm = this.currentSearch.toLowerCase().trim();
        const fragment = document.createDocumentFragment();
        let totalVisible = 0;

        this.registry.forEach(cat => {
            if (this.currentPack !== 'all' && this.currentPack !== cat.id) return;

            const matchingIcons = searchTerm
                ? cat.icons.filter(ic => ic.toLowerCase().includes(searchTerm))
                : cat.icons;

            if (matchingIcons.length === 0) return;
            totalVisible += matchingIcons.length;

            const gridVariant = ICON_VARIANTS[this.currentVariantIndex] || ICON_VARIANTS[0];

            matchingIcons.forEach(iconClass => {
                const item = document.createElement('div');
                item.className = 'icons-grid-item';
                item.dataset.iconClass = iconClass;

                const iconEl = document.createElement('span');
                iconEl.className = 'icon ' + iconClass;
                if (gridVariant.classes) {
                    iconEl.className += ' ' + gridVariant.classes;
                }
                item.appendChild(iconEl);

                const nameEl = document.createElement('span');
                nameEl.className = 'icons-grid-item-name';
                nameEl.textContent = this.formatIconName(iconClass);
                item.appendChild(nameEl);

                fragment.appendChild(item);
            });
        });

        container.appendChild(fragment);

        if (totalVisible === 0) {
            container.innerHTML = '<div class="icons-no-results">' +
                'No icons found matching "<strong>' + this.escapeHtml(searchTerm) + '</strong>"' +
                '</div>';
        }

        // Update search placeholder with count
        const searchInput = document.getElementById(this.searchInputId);
        if (searchInput && !searchTerm) {
            searchInput.placeholder = 'Search ' + this.getTotalCount().toLocaleString() + ' icons...';
        }
    }

    formatIconName(iconClass) {
        return iconClass
            .replace('dga-icon-', '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    /* ------------------------------------------
       EVENT BINDING
       ------------------------------------------ */
    bindEvents() {
        const searchInput = document.getElementById(this.searchInputId);
        const searchClear = document.getElementById(this.searchClearId);

        // Search
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    this.currentSearch = e.target.value;
                    if (searchClear) {
                        searchClear.style.display = this.currentSearch ? 'block' : 'none';
                    }
                    this.renderIcons();
                }, 250);
            });
        }

        // Clear search
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                if (searchInput) { searchInput.value = ''; searchInput.focus(); }
                this.currentSearch = '';
                searchClear.style.display = 'none';
                this.renderIcons();
            });
        }

        // Pack sidebar clicks
        const packsList = document.getElementById(this.packsListId);
        if (packsList) {
            packsList.addEventListener('click', (e) => {
                const item = e.target.closest('.icons-pack-item');
                if (!item) return;
                this.currentPack = item.dataset.pack;
                packsList.querySelectorAll('.icons-pack-item').forEach(i =>
                    i.classList.remove('icons-pack-item--active'));
                item.classList.add('icons-pack-item--active');
                this.renderIcons();
            });
        }

        // Type filter clicks
        const typeFilters = document.querySelector('.icons-type-filters-list');
        if (typeFilters) {
            typeFilters.addEventListener('click', (e) => {
                const btn = e.target.closest('.icons-type-filter-btn');
                if (!btn) return;
                this.currentVariantIndex = parseInt(btn.dataset.variantIndex, 10);
                typeFilters.querySelectorAll('.icons-type-filter-btn').forEach(b =>
                    b.classList.remove('icons-type-filter-btn--active'));
                btn.classList.add('icons-type-filter-btn--active');
                this.renderIcons();
            });
        }

        // Grid icon click -> open modal
        const gridContainer = document.getElementById(this.gridContainerId);
        if (gridContainer) {
            gridContainer.addEventListener('click', (e) => {
                const item = e.target.closest('.icons-grid-item');
                if (!item) return;
                const iconClass = item.dataset.iconClass;
                if (iconClass) this.openModal(iconClass);
            });
        }

        // Modal events
        this.bindModalEvents();
    }

    /* ------------------------------------------
       MODAL
       ------------------------------------------ */
    bindModalEvents() {
        const overlay = document.getElementById('icons-modal-overlay');
        const closeBtn = document.getElementById('icons-modal-close');
        const copyBtn = document.getElementById('icons-modal-copy');
        const downloadBtn = document.getElementById('icons-modal-download');
        const copyClassBtn = document.getElementById('icons-modal-copy-class');

        // Close modal
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.closeModal();
            });
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });

        // Tab switching
        const tabContainer = document.querySelector('.icons-modal-tabs');
        if (tabContainer) {
            tabContainer.addEventListener('click', (e) => {
                const tab = e.target.closest('.icons-modal-tab');
                if (!tab) return;
                this.activeTab = tab.dataset.tab;
                tabContainer.querySelectorAll('.icons-modal-tab').forEach(t =>
                    t.classList.remove('icons-modal-tab--active'));
                tab.classList.add('icons-modal-tab--active');
                this.updateCodeContent();
            });
        }

        // Copy code
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const codeEl = document.getElementById('icons-modal-code-content');
                if (codeEl) this.copyText(codeEl.textContent);
            });
        }

        // Copy class
        if (copyClassBtn) {
            copyClassBtn.addEventListener('click', () => {
                this.copyText(this.getFullClassString());
            });
        }

        // Download SVG
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadSVG());
        }

        // Style variant clicks
        const variantsContainer = document.getElementById('icons-modal-variants');
        if (variantsContainer) {
            variantsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.icons-modal-variant-btn');
                if (!btn) return;
                const idx = parseInt(btn.dataset.variantIndex, 10);
                this.activeVariantIndex = idx;
                variantsContainer.querySelectorAll('.icons-modal-variant-btn').forEach(b =>
                    b.classList.remove('icons-modal-variant-btn--active'));
                btn.classList.add('icons-modal-variant-btn--active');
                this.updatePreviewIcon();
                this.updateCodeContent();
                this.updateClassDisplay();
            });
        }
    }

    openModal(iconClass) {
        const overlay = document.getElementById('icons-modal-overlay');
        if (!overlay) return;

        this.activeIconClass = iconClass;
        const category = this.iconToCategory[iconClass];
        this.activeIconPack = category ? category.label : '';
        this.activeVariantIndex = 0; // Default: Stroke Rounded

        // Title
        const titleEl = document.getElementById('icons-modal-title');
        if (titleEl) titleEl.textContent = this.formatIconName(iconClass);

        // Subtitle
        const subtitleEl = document.getElementById('icons-modal-subtitle');
        if (subtitleEl) subtitleEl.textContent = 'Icon Pack: ' + this.formatPackLabel(this.activeIconPack);

        // Preview icon (default variant)
        this.updatePreviewIcon();

        // Style variants
        this.renderStyleVariants(iconClass);

        // Preview label
        const previewLabel = document.getElementById('icons-modal-preview-label');
        if (previewLabel) previewLabel.textContent = ICON_VARIANTS[0].label;

        // Reset to HTML tab
        this.activeTab = 'html';
        const tabs = document.querySelectorAll('.icons-modal-tab');
        tabs.forEach(t => t.classList.remove('icons-modal-tab--active'));
        if (tabs[0]) tabs[0].classList.add('icons-modal-tab--active');

        // Code content
        this.updateCodeContent();

        // Class name
        this.updateClassDisplay();

        // Show modal
        overlay.style.display = '';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const overlay = document.getElementById('icons-modal-overlay');
        if (overlay) overlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    getActiveVariant() {
        return ICON_VARIANTS[this.activeVariantIndex] || ICON_VARIANTS[0];
    }

    getFullClassString() {
        const variant = this.getActiveVariant();
        if (variant.classes) {
            return this.activeIconClass + ' ' + variant.classes;
        }
        return this.activeIconClass;
    }

    updatePreviewIcon() {
        const display = document.getElementById('icons-modal-icon');
        if (!display) return;
        display.innerHTML = '';

        const variant = this.getActiveVariant();
        const iconEl = document.createElement('span');
        iconEl.className = 'icon ' + this.activeIconClass;
        if (variant.classes) {
            iconEl.className += ' ' + variant.classes;
        }
        display.appendChild(iconEl);

        // Update preview label
        const previewLabel = document.getElementById('icons-modal-preview-label');
        if (previewLabel) previewLabel.textContent = variant.label;
    }

    renderStyleVariants(iconClass) {
        const container = document.getElementById('icons-modal-variants');
        if (!container) return;
        container.innerHTML = '';

        ICON_VARIANTS.forEach((variant, i) => {
            const btn = document.createElement('button');
            btn.className = 'icons-modal-variant-btn';
            if (i === this.activeVariantIndex) btn.classList.add('icons-modal-variant-btn--active');
            btn.dataset.variantIndex = i;
            btn.title = variant.label;

            const iconEl = document.createElement('span');
            iconEl.className = 'icon ' + iconClass;
            if (variant.classes) {
                iconEl.className += ' ' + variant.classes;
            }
            btn.appendChild(iconEl);

            container.appendChild(btn);
        });
    }

    updateClassDisplay() {
        const classNameEl = document.getElementById('icons-modal-class-name');
        if (classNameEl) classNameEl.textContent = this.getFullClassString();
    }

    updateCodeContent() {
        const codeEl = document.getElementById('icons-modal-code-content');
        if (!codeEl) return;

        const ic = this.activeIconClass;
        const variant = this.getActiveVariant();
        const fullClass = this.getFullClassString();
        const category = this.iconToCategory[ic];
        const fontFamily = category
            ? 'dga-fonts-icons-' + category.id
            : '';

        switch (this.activeTab) {
            case 'html':
                codeEl.textContent = '<span class="icon ' + fullClass + '"></span>';
                break;
            case 'css':
                codeEl.textContent =
                    '.' + ic + ' {\n' +
                    '    font-family: \'' + fontFamily + '\' !important;\n' +
                    '}\n\n' +
                    '/* Usage */\n' +
                    '.icon.' + ic + (variant.classes ? '.' + variant.classes.replace(/ /g, '.') : '') + ' {\n' +
                    '    speak: never;\n' +
                    '    font-style: normal;\n' +
                    '    font-weight: normal;\n' +
                    '    font-variant: normal;\n' +
                    '    text-transform: none;\n' +
                    '    line-height: 1;\n' +
                    '    -webkit-font-smoothing: antialiased;\n' +
                    '    -moz-osx-font-smoothing: grayscale;\n' +
                    '}';
                break;
            case 'json':
                codeEl.textContent = JSON.stringify({
                    name: this.formatIconName(ic),
                    class: fullClass,
                    variant: variant.label,
                    pack: category ? category.label : '',
                    fontFamily: fontFamily,
                    html: '<span class="icon ' + fullClass + '"></span>'
                }, null, 2);
                break;
            case 'svg':
                codeEl.textContent =
                    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\n' +
                    '    <foreignObject width="24" height="24">\n' +
                    '        <span xmlns="http://www.w3.org/1999/xhtml"\n' +
                    '              class="icon ' + fullClass + '"\n' +
                    '              style="font-size:24px;line-height:1;">\n' +
                    '        </span>\n' +
                    '    </foreignObject>\n' +
                    '</svg>';
                break;
        }
    }

    downloadSVG() {
        const ic = this.activeIconClass;
        const fullClass = this.getFullClassString();
        const svgContent =
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\n' +
            '    <foreignObject width="24" height="24">\n' +
            '        <span xmlns="http://www.w3.org/1999/xhtml"\n' +
            '              class="icon ' + fullClass + '"\n' +
            '              style="font-size:24px;line-height:1;">\n' +
            '        </span>\n' +
            '    </foreignObject>\n' +
            '</svg>';

        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = ic + '.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('Downloaded ' + ic + '.svg');
    }

    /* ------------------------------------------
       UTILITIES
       ------------------------------------------ */
    copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('Copied to clipboard!');
            }).catch(() => this.fallbackCopy(text));
        } else {
            this.fallbackCopy(text);
        }
    }

    fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        this.showToast('Copied to clipboard!');
    }

    showToast(message) {
        const toast = document.getElementById(this.toastId);
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('is-visible');
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
            toast.classList.remove('is-visible');
        }, 2000);
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}

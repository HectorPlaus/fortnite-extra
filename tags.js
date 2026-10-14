/* Sistema global de etiquetas para cosméticos.
 * Lee tags-data.json (publicado, igual para todos), calcula las etiquetas automáticas
 * con las reglas y aplica las correcciones manuales. No usa servidor ni base de datos.
 * Añade filtros por etiqueta al catálogo y, con ?admin en la URL, carga tags-admin.js. */
(() => {
    'use strict';

    const catalog = window.fortniteCatalog;
    if (!catalog) return;

    const DATA_URL = 'tags-data.json';
    const DRAFT_KEY = 'fortnite-tags-admin-draft';
    const isAdminMode = new URLSearchParams(window.location.search).has('admin');

    const norm = (value) => String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('es')
        .trim();
    const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordRegexCache = new Map();
    const wordRegex = (term) => {
        if (!wordRegexCache.has(term)) {
            wordRegexCache.set(term, new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}($|[^a-z0-9])`));
        }
        return wordRegexCache.get(term);
    };

    const fieldGetters = {
        name: (c) => c.name,
        description: (c) => c.description,
        set: (c) => c.setValue,
        setCode: (c) => c.setCode,
        series: (c) => c.seriesLabel,
        seriesCode: (c) => c.seriesCode,
        type: (c) => `${c.typeLabel} ${c.typeValue}`
    };

    let data = null;
    let publishedData = null;
    let box = null;
    let matchAll = false;
    let unclassifiedOnly = false;
    const selected = new Set();
    const infoCache = new Map();
    const listeners = new Set();

    function sanitize(raw) {
        const source = raw && typeof raw === 'object' ? raw : {};
        const strings = (list) => (Array.isArray(list) ? list.filter((v) => typeof v === 'string') : []);
        const tags = (Array.isArray(source.tags) ? source.tags : [])
            .filter((tag) => tag && typeof tag.id === 'string' && typeof tag.name === 'string')
            .map((tag) => ({
                id: tag.id,
                name: tag.name,
                group: typeof tag.group === 'string' && tag.group ? tag.group : 'General',
                color: /^#[\da-f]{6}$/i.test(tag.color || '') ? tag.color : '#6272a4'
            }));
        const rules = (Array.isArray(source.rules) ? source.rules : [])
            .filter((rule) => rule && typeof rule.id === 'string' && typeof rule.tag === 'string')
            .map((rule) => ({
                id: rule.id,
                tag: rule.tag,
                enabled: rule.enabled !== false,
                fields: strings(rule.fields).filter((field) => fieldGetters[field]),
                mode: rule.mode === 'contains' ? 'contains' : 'word',
                any: strings(rule.any),
                none: strings(rule.none),
                kinds: strings(rule.kinds),
                types: strings(rule.types)
            }));
        const overrides = {};
        Object.entries(source.overrides && typeof source.overrides === 'object' ? source.overrides : {})
            .forEach(([id, value]) => {
                const add = strings(value?.add);
                const remove = strings(value?.remove);
                if (add.length || remove.length) overrides[id] = { add, remove };
            });
        return { version: 1, tags, rules, overrides };
    }

    function ruleMatches(rule, cosmetic) {
        const any = (rule.any || []).map(norm).filter(Boolean);
        const none = (rule.none || []).map(norm).filter(Boolean);
        const kinds = rule.kinds || [];
        const types = (rule.types || []).map(norm).filter(Boolean);
        // Una regla sin ninguna condición positiva no coincide con nada (evita etiquetar todo por error).
        if (!any.length && !kinds.length && !types.length) return false;
        if (kinds.length && !kinds.includes(cosmetic.kind)) return false;
        if (types.length && !types.includes(norm(cosmetic.typeValue))) return false;
        const fields = rule.fields && rule.fields.length ? rule.fields : ['name'];
        const texts = fields.map((field) => norm(fieldGetters[field]?.(cosmetic))).filter(Boolean);
        const hit = (term) => texts.some((text) => (rule.mode === 'contains'
            ? text.includes(term)
            : wordRegex(term).test(text)));
        if (any.length && !any.some(hit)) return false;
        if (none.some(hit)) return false;
        return true;
    }

    function getTagInfo(cosmetic) {
        const cached = infoCache.get(cosmetic.id);
        if (cached) return cached;
        const known = new Set((data?.tags || []).map((tag) => tag.id));
        const auto = new Set();
        (data?.rules || []).forEach((rule) => {
            if (rule.enabled !== false && known.has(rule.tag) && ruleMatches(rule, cosmetic)) auto.add(rule.tag);
        });
        const override = data?.overrides?.[cosmetic.id] || {};
        const manual = new Set((override.add || []).filter((id) => known.has(id)));
        const removed = new Set((override.remove || []).filter((id) => known.has(id)));
        const final = new Set([...auto].filter((id) => !removed.has(id)));
        manual.forEach((id) => final.add(id));
        const info = {
            auto: [...auto],
            manual: [...manual],
            removed: [...removed],
            final: [...final]
        };
        infoCache.set(cosmetic.id, info);
        return info;
    }

    function setData(next) {
        data = sanitize(next);
        infoCache.clear();
        if (isAdminMode) {
            try {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
            } catch {
                // El borrador es opcional; la edición sigue funcionando en memoria.
            }
        }
        listeners.forEach((listener) => listener());
        renderFilterUI();
        catalog.refresh();
    }

    function tagById(id) {
        return (data?.tags || []).find((tag) => tag.id === id) || null;
    }

    function makeChip(tag, extra = '') {
        const chip = document.createElement('span');
        chip.className = `ftag-chip ${extra}`.trim();
        chip.style.setProperty('--ftag-color', tag.color);
        chip.textContent = tag.name;
        return chip;
    }

    function renderFilterUI() {
        const anchor = document.querySelector('#cosmeticsCatalogView .catalog-filters');
        if (!anchor) return;
        if (!box) {
            box = document.createElement('div');
            box.className = 'ftag-filter';
            anchor.insertAdjacentElement('afterend', box);
        }
        const cosmetics = catalog.getCosmetics();
        if (!data || !data.tags.length || !cosmetics.length) {
            box.hidden = true;
            return;
        }

        const counts = new Map();
        let unclassified = 0;
        cosmetics.forEach((cosmetic) => {
            const { final } = getTagInfo(cosmetic);
            if (!final.length) unclassified += 1;
            final.forEach((id) => counts.set(id, (counts.get(id) || 0) + 1));
        });
        [...selected].forEach((id) => { if (!tagById(id)) selected.delete(id); });

        const fragment = document.createDocumentFragment();
        const header = document.createElement('div');
        header.className = 'ftag-filter-header';
        const title = document.createElement('strong');
        title.textContent = 'Etiquetas';
        const mode = document.createElement('button');
        mode.type = 'button';
        mode.className = 'ftag-mode';
        mode.textContent = matchAll ? 'Cumplir todas (Y)' : 'Cumplir cualquiera (O)';
        mode.title = 'Cambiar cómo se combinan varias etiquetas';
        mode.addEventListener('click', () => {
            matchAll = !matchAll;
            renderFilterUI();
            catalog.refresh();
        });
        header.append(title, mode);
        fragment.appendChild(header);

        const groups = new Map();
        data.tags.filter((tag) => counts.get(tag.id)).forEach((tag) => {
            if (!groups.has(tag.group)) groups.set(tag.group, []);
            groups.get(tag.group).push(tag);
        });
        groups.forEach((tags, group) => {
            const row = document.createElement('div');
            row.className = 'ftag-group';
            const label = document.createElement('span');
            label.className = 'ftag-group-label';
            label.textContent = group;
            row.appendChild(label);
            tags.sort((a, b) => a.name.localeCompare(b.name, 'es')).forEach((tag) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'ftag-chip ftag-chip-button';
                button.style.setProperty('--ftag-color', tag.color);
                button.setAttribute('aria-pressed', String(selected.has(tag.id)));
                button.textContent = `${tag.name} (${counts.get(tag.id).toLocaleString('es')})`;
                button.addEventListener('click', () => {
                    unclassifiedOnly = false;
                    if (selected.has(tag.id)) selected.delete(tag.id);
                    else selected.add(tag.id);
                    renderFilterUI();
                    catalog.refresh();
                });
                row.appendChild(button);
            });
            fragment.appendChild(row);
        });

        if (isAdminMode) {
            const row = document.createElement('div');
            row.className = 'ftag-group';
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'ftag-chip ftag-chip-button';
            button.setAttribute('aria-pressed', String(unclassifiedOnly));
            button.textContent = `Sin clasificar (${unclassified.toLocaleString('es')})`;
            button.addEventListener('click', () => {
                unclassifiedOnly = !unclassifiedOnly;
                if (unclassifiedOnly) selected.clear();
                renderFilterUI();
                catalog.refresh();
            });
            row.appendChild(button);
            fragment.appendChild(row);
        }

        box.replaceChildren(fragment);
        box.hidden = false;
    }

    catalog.addFilter((cosmetic) => {
        if (!data || (!selected.size && !unclassifiedOnly)) return true;
        const final = new Set(getTagInfo(cosmetic).final);
        if (unclassifiedOnly) return final.size === 0;
        const picked = [...selected];
        return matchAll ? picked.every((id) => final.has(id)) : picked.some((id) => final.has(id));
    });

    document.addEventListener('fortnite-catalog:loaded', renderFilterUI);
    document.addEventListener('fortnite-catalog:reset', () => {
        selected.clear();
        unclassifiedOnly = false;
        renderFilterUI();
    });
    document.addEventListener('fortnite-catalog:detail', (event) => {
        if (!data) return;
        const { cosmetic, content } = event.detail;
        const { final } = getTagInfo(cosmetic);
        if (!final.length && !isAdminMode) return;
        const section = document.createElement('section');
        section.className = 'cosmetic-detail-section ftag-detail';
        const heading = document.createElement('h3');
        heading.textContent = 'Etiquetas';
        const list = document.createElement('div');
        list.className = 'ftag-chip-list';
        if (final.length) {
            final.map(tagById).filter(Boolean).forEach((tag) => list.appendChild(makeChip(tag)));
        } else {
            const empty = document.createElement('span');
            empty.className = 'catalog-message';
            empty.textContent = 'Sin clasificar';
            list.appendChild(empty);
        }
        section.append(heading, list);
        content.appendChild(section);
    });

    window.FortniteTags = {
        isAdminMode,
        draftKey: DRAFT_KEY,
        getData: () => data,
        getPublishedData: () => publishedData,
        setData,
        getTagInfo,
        ruleMatches,
        sanitize,
        norm,
        fieldNames: Object.keys(fieldGetters),
        onChange: (listener) => listeners.add(listener)
    };

    async function init() {
        try {
            const response = await fetch(DATA_URL, { cache: 'no-cache' });
            if (response.ok) publishedData = sanitize(await response.json());
        } catch {
            // Sin catálogo de etiquetas el resto de la aplicación sigue funcionando igual.
        }

        let draft = null;
        if (isAdminMode) {
            try {
                draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
            } catch {
                draft = null;
            }
        }
        data = draft ? sanitize(draft) : (publishedData || (isAdminMode ? sanitize({}) : null));
        infoCache.clear();
        renderFilterUI();
        catalog.refresh();

        if (isAdminMode) {
            const script = document.createElement('script');
            script.src = 'tags-admin.js';
            document.body.appendChild(script);
        }
    }

    init();
})();
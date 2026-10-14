/* Panel de administración de etiquetas. Solo se carga con ?admin en la URL.
 * Edita un BORRADOR local; los cambios no llegan al público hasta que publicas tags-data.json.
 * La seguridad real es quién puede escribir ese archivo en tu repositorio o hosting. */
(() => {
    'use strict';

    const T = window.FortniteTags;
    const C = window.fortniteCatalog;
    if (!T || !C || document.getElementById('ftagAdminDialog')) return;

    const KINDS = [
        ['br', 'Battle Royale'], ['tracks', 'Pistas Jam'], ['instruments', 'Instrumentos'],
        ['cars', 'Coches'], ['legoKits', 'Kits LEGO'], ['lego', 'Variantes LEGO'], ['beans', 'Beans']
    ];
    const FIELD_LABELS = {
        name: 'Nombre', description: 'Descripción', set: 'Conjunto', setCode: 'Código del conjunto',
        series: 'Serie', seriesCode: 'Código de la serie', type: 'Tipo'
    };

    let draft = JSON.parse(JSON.stringify(T.getData() || T.sanitize({})));
    let tab = 'tags';
    let search = '';
    let onlyUnclassified = false;
    let searchTimer;

    function h(tag, props = {}, ...children) {
        const el = document.createElement(tag);
        let value;
        Object.entries(props).forEach(([key, val]) => {
            if (val === false || val === null || val === undefined) return;
            if (key === 'class') el.className = val;
            else if (key === 'value') value = val;
            else if (key === 'checked') el.checked = Boolean(val);
            else if (key.startsWith('on')) el.addEventListener(key.slice(2), val);
            else el.setAttribute(key, val === true ? '' : val);
        });
        children.flat().forEach((child) => {
            if (child === null || child === undefined || child === false) return;
            el.append(child instanceof Node ? child : document.createTextNode(String(child)));
        });
        if (value !== undefined) el.value = value;
        return el;
    }

    const lines = (text) => text.split(/[\n,]/).map((part) => part.trim()).filter(Boolean);
    const slug = (text) => T.norm(text).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'etiqueta';
    const uniqueId = (base, used) => {
        let id = base;
        let n = 2;
        while (used.has(id)) { id = `${base}-${n}`; n += 1; }
        return id;
    };
    const tagName = (id) => draft.tags.find((tag) => tag.id === id)?.name || id;

    // `draft` es siempre el mismo objeto que editan las tarjetas; setData guarda su propia copia
    // saneada. No hay que reasignar `draft`: las tarjetas abiertas conservan referencias a él.
    function save() {
        T.setData(draft);
    }

    // ---------- Etiquetas ----------
    function renderTags() {
        const rows = draft.tags.map((tag) => h('div', { class: 'ftag-admin-row' },
            h('input', {
                type: 'text', value: tag.name, 'aria-label': `Nombre de ${tag.name}`,
                onchange: (e) => { tag.name = e.target.value.trim() || tag.name; save(); render(); }
            }),
            h('input', {
                type: 'text', value: tag.group, 'aria-label': `Grupo de ${tag.name}`,
                onchange: (e) => { tag.group = e.target.value.trim() || 'General'; save(); render(); }
            }),
            h('input', {
                type: 'color', value: tag.color, 'aria-label': `Color de ${tag.name}`,
                onchange: (e) => { tag.color = e.target.value; save(); }
            }),
            h('button', {
                type: 'button', class: 'ftag-danger',
                onclick: () => {
                    const usedRules = draft.rules.filter((rule) => rule.tag === tag.id).length;
                    const usedManual = Object.values(draft.overrides)
                        .filter((o) => o.add.includes(tag.id) || o.remove.includes(tag.id)).length;
                    if (!window.confirm(`Eliminar «${tag.name}»? Se borrarán ${usedRules} reglas y ${usedManual} correcciones manuales que la usan.`)) return;
                    draft.tags = draft.tags.filter((t) => t.id !== tag.id);
                    draft.rules = draft.rules.filter((rule) => rule.tag !== tag.id);
                    Object.keys(draft.overrides).forEach((id) => {
                        const o = draft.overrides[id];
                        o.add = o.add.filter((t) => t !== tag.id);
                        o.remove = o.remove.filter((t) => t !== tag.id);
                        if (!o.add.length && !o.remove.length) delete draft.overrides[id];
                    });
                    save(); render();
                }
            }, 'Eliminar')));

        const nameInput = h('input', { type: 'text', placeholder: 'Nueva etiqueta', 'aria-label': 'Nombre de la nueva etiqueta' });
        const groupInput = h('input', { type: 'text', placeholder: 'Grupo (Franquicia, Temática…)', 'aria-label': 'Grupo de la nueva etiqueta' });
        const form = h('form', {
            class: 'ftag-admin-row',
            onsubmit: (e) => {
                e.preventDefault();
                const name = nameInput.value.trim();
                if (!name) return;
                const id = uniqueId(slug(name), new Set(draft.tags.map((t) => t.id)));
                draft.tags.push({ id, name, group: groupInput.value.trim() || 'General', color: '#6272a4' });
                save(); render();
            }
        }, nameInput, groupInput, h('button', { type: 'submit' }, 'Crear etiqueta'));
        return h('div', {}, h('p', { class: 'ftag-hint' }, 'Nombre · grupo · color. El grupo se usa para agrupar los filtros públicos.'), rows, form);
    }

    // ---------- Reglas ----------
    function renderRules() {
        const cards = draft.rules.map((rule) => {
            const result = h('div', { class: 'ftag-test-result', 'aria-live': 'polite' });
            const checkboxes = (items, current, onChange) => h('div', { class: 'ftag-checks' }, items.map(([value, label]) => h('label', {},
                h('input', {
                    type: 'checkbox', checked: current.includes(value),
                    onchange: (e) => {
                        const next = new Set(current);
                        if (e.target.checked) next.add(value); else next.delete(value);
                        onChange([...next]);
                    }
                }), ` ${label}`)));
            return h('div', { class: 'ftag-rule' },
                h('div', { class: 'ftag-admin-row' },
                    h('select', {
                        'aria-label': 'Etiqueta de la regla', value: rule.tag,
                        onchange: (e) => { rule.tag = e.target.value; save(); }
                    }, draft.tags.map((tag) => h('option', { value: tag.id }, tag.name))),
                    h('label', {}, h('input', {
                        type: 'checkbox', checked: rule.enabled,
                        onchange: (e) => { rule.enabled = e.target.checked; save(); }
                    }), ' Activa'),
                    h('select', {
                        'aria-label': 'Modo de coincidencia', value: rule.mode,
                        onchange: (e) => { rule.mode = e.target.value; save(); }
                    },
                    h('option', { value: 'word' }, 'Palabra completa'),
                    h('option', { value: 'contains' }, 'Contiene el texto'))),
                h('div', { class: 'ftag-label' }, 'Buscar en estos campos'),
                checkboxes(Object.entries(FIELD_LABELS), rule.fields, (next) => { rule.fields = next; save(); }),
                h('div', { class: 'ftag-admin-cols' },
                    h('label', {}, 'Palabras o franquicias (una por línea)',
                        h('textarea', {
                            rows: 3, value: rule.any.join('\n'),
                            onchange: (e) => { rule.any = lines(e.target.value); save(); }
                        })),
                    h('label', {}, 'Excluir si aparece (una por línea)',
                        h('textarea', {
                            rows: 3, value: rule.none.join('\n'),
                            onchange: (e) => { rule.none = lines(e.target.value); save(); }
                        }))),
                h('div', { class: 'ftag-label' }, 'Solo para estos orígenes (vacío = todos)'),
                checkboxes(KINDS, rule.kinds, (next) => { rule.kinds = next; save(); }),
                h('label', {}, 'Solo para estos tipos internos (separados por comas, p. ej. music)',
                    h('input', {
                        type: 'text', value: rule.types.join(', '),
                        onchange: (e) => { rule.types = lines(e.target.value); save(); }
                    })),
                h('div', { class: 'ftag-admin-row' },
                    h('button', {
                        type: 'button',
                        onclick: () => {
                            const matches = C.getCosmetics().filter((cosmetic) => T.ruleMatches(rule, cosmetic));
                            result.replaceChildren(...[
                                h('strong', {}, `${matches.length.toLocaleString('es')} coincidencias`),
                                matches.length ? h('ul', {}, matches.slice(0, 25).map((c) => h('li', {}, `${c.name} · ${c.typeLabel}${c.seriesLabel ? ` · ${c.seriesLabel}` : ''}`))) : null,
                                matches.length > 25 ? h('p', { class: 'ftag-hint' }, `…y ${matches.length - 25} más.`) : null
                            ].filter(Boolean));
                        }
                    }, 'Probar (sin aplicar)'),
                    h('button', {
                        type: 'button', class: 'ftag-danger',
                        onclick: () => {
                            if (!window.confirm('¿Eliminar esta regla?')) return;
                            draft.rules = draft.rules.filter((r) => r.id !== rule.id);
                            save(); render();
                        }
                    }, 'Eliminar regla')),
                result);
        });

        const add = h('button', {
            type: 'button',
            disabled: !draft.tags.length,
            onclick: () => {
                draft.rules.push({
                    id: uniqueId('regla', new Set(draft.rules.map((r) => r.id))),
                    tag: draft.tags[0].id, enabled: false, fields: ['name'], mode: 'word',
                    any: [], none: [], kinds: [], types: []
                });
                save(); render();
            }
        }, 'Nueva regla (empieza desactivada)');
        return h('div', {},
            h('p', { class: 'ftag-hint' }, 'Las reglas solo añaden etiquetas; el orden no importa. Una regla sin palabras, orígenes ni tipos no coincide con nada. Usa «Probar» antes de activarla.'),
            cards, add);
    }

    // ---------- Cosméticos ----------
    function renderCosmetics() {
        const results = h('div', { class: 'ftag-results' });
        const fill = () => {
            const query = T.norm(search);
            const list = C.getCosmetics().filter((cosmetic) => {
                if (onlyUnclassified && T.getTagInfo(cosmetic).final.length) return false;
                return !query || T.norm(cosmetic.name).includes(query) || T.norm(cosmetic.id).includes(query);
            });
            results.replaceChildren(
                h('p', { class: 'ftag-hint' }, `${list.length.toLocaleString('es')} cosméticos${list.length > 40 ? ' (se muestran 40; afina la búsqueda)' : ''}`),
                ...list.slice(0, 40).map((cosmetic) => cosmeticRow(cosmetic)));
        };
        const input = h('input', {
            type: 'search', value: search, placeholder: 'Nombre o identificador',
            'aria-label': 'Buscar cosmético',
            oninput: (e) => { search = e.target.value; clearTimeout(searchTimer); searchTimer = setTimeout(fill, 150); }
        });
        const toggle = h('label', {}, h('input', {
            type: 'checkbox', checked: onlyUnclassified,
            onchange: (e) => { onlyUnclassified = e.target.checked; fill(); }
        }), ' Solo sin clasificar');
        fill();
        return h('div', {}, h('div', { class: 'ftag-admin-row' }, input, toggle), results);
    }

    function setOverride(id, mutate) {
        const current = draft.overrides[id] || { add: [], remove: [] };
        mutate(current);
        if (current.add.length || current.remove.length) draft.overrides[id] = current;
        else delete draft.overrides[id];
        save();
    }

    function cosmeticRow(cosmetic) {
        const info = T.getTagInfo(cosmetic);
        const row = h('div', { class: 'ftag-cosmetic' });
        const badges = h('div', { class: 'ftag-chip-list' });
        const origin = (id, label, action, actionLabel, cls) => {
            const tag = draft.tags.find((t) => t.id === id);
            if (!tag) return;
            badges.append(h('span', { class: `ftag-chip ftag-origin-${cls}`, style: `--ftag-color:${tag.color}` },
                `${tag.name} · ${label} `,
                h('button', { type: 'button', class: 'ftag-chip-action', title: actionLabel, 'aria-label': `${actionLabel}: ${tag.name}`, onclick: action }, actionLabel)));
        };
        info.auto.filter((id) => !info.removed.includes(id)).forEach((id) => origin(id, 'auto', () => {
            setOverride(cosmetic.id, (o) => { if (!o.remove.includes(id)) o.remove.push(id); }); refreshRows();
        }, 'Excluir', 'auto'));
        info.manual.forEach((id) => origin(id, 'manual', () => {
            setOverride(cosmetic.id, (o) => { o.add = o.add.filter((t) => t !== id); }); refreshRows();
        }, 'Quitar', 'manual'));
        info.removed.forEach((id) => origin(id, 'excluida', () => {
            setOverride(cosmetic.id, (o) => { o.remove = o.remove.filter((t) => t !== id); }); refreshRows();
        }, 'Restaurar', 'removed'));

        const options = draft.tags.filter((tag) => !info.manual.includes(tag.id) && !info.auto.includes(tag.id) || info.removed.includes(tag.id));
        const select = h('select', { 'aria-label': `Añadir etiqueta a ${cosmetic.name}` },
            h('option', { value: '' }, 'Añadir etiqueta…'),
            options.map((tag) => h('option', { value: tag.id }, tag.name)));
        select.addEventListener('change', () => {
            if (!select.value) return;
            const id = select.value;
            setOverride(cosmetic.id, (o) => {
                o.remove = o.remove.filter((t) => t !== id);
                if (!o.add.includes(id) && !info.auto.includes(id)) o.add.push(id);
            });
            refreshRows();
        });
        row.append(
            h('div', {}, h('strong', {}, cosmetic.name), h('span', { class: 'ftag-hint' }, ` ${cosmetic.typeLabel} · ${cosmetic.id}`)),
            badges.childElementCount ? badges : h('span', { class: 'ftag-hint' }, 'Sin clasificar'),
            select);
        return row;
    }

    function refreshRows() {
        render();
    }

    // ---------- Publicar ----------
    function toBase64(text) {
        let binary = '';
        new TextEncoder().encode(text).forEach((byte) => { binary += String.fromCharCode(byte); });
        return btoa(binary);
    }

    async function publishToGitHub(settings, status) {
        const base = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${settings.path}`;
        const headers = { Authorization: `Bearer ${settings.token}`, Accept: 'application/vnd.github+json' };
        status.textContent = 'Comprobando el archivo actual…';
        const current = await fetch(`${base}?ref=${encodeURIComponent(settings.branch)}`, { headers });
        let sha;
        if (current.ok) sha = (await current.json()).sha;
        else if (current.status !== 404) throw new Error(`GitHub respondió ${current.status} al leer el archivo.`);
        status.textContent = 'Publicando…';
        const response = await fetch(base, {
            method: 'PUT',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Actualizar etiquetas de cosméticos',
                content: toBase64(`${JSON.stringify(T.getData(), null, 2)}\n`),
                branch: settings.branch,
                ...(sha ? { sha } : {})
            })
        });
        if (!response.ok) throw new Error(`GitHub respondió ${response.status} al publicar. Revisa el token y los permisos.`);
    }

    function renderPublish() {
        const status = h('p', { class: 'ftag-hint', role: 'status' });
        const field = (label, value, type = 'text') => {
            const input = h('input', { type, value, autocomplete: 'off' });
            return { input, el: h('label', {}, label, input) };
        };
        const owner = field('Usuario u organización', '');
        const repo = field('Repositorio', '');
        const branch = field('Rama', 'main');
        const path = field('Ruta del archivo', 'tags-data.json');
        const token = field('Token personal (no se guarda)', '', 'password');
        const manualOverrides = Object.keys(draft.overrides).length;
        return h('div', {},
            h('p', {}, `${draft.tags.length} etiquetas · ${draft.rules.length} reglas · ${manualOverrides} cosméticos con correcciones manuales.`),
            h('p', { class: 'ftag-hint' }, 'Tus cambios son un borrador en este navegador. El público solo los ve cuando publicas el archivo tags-data.json.'),
            h('div', { class: 'ftag-admin-row' },
                h('button', {
                    type: 'button',
                    onclick: () => {
                        const blob = new Blob([`${JSON.stringify(T.getData(), null, 2)}\n`], { type: 'application/json' });
                        const link = h('a', { href: URL.createObjectURL(blob), download: 'tags-data.json' });
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
                        status.textContent = 'Descargado. Sustituye tags-data.json en tu sitio por este archivo.';
                    }
                }, 'Descargar tags-data.json'),
                h('button', {
                    type: 'button', class: 'ftag-danger',
                    onclick: () => {
                        if (!window.confirm('¿Descartar el borrador y volver a lo publicado?')) return;
                        try { localStorage.removeItem(T.draftKey); } catch { /* sin almacenamiento */ }
                        window.location.reload();
                    }
                }, 'Descartar borrador')),
            h('details', {},
                h('summary', {}, 'Publicar directamente en GitHub (opcional)'),
                h('p', { class: 'ftag-hint' }, 'Necesita un token fine-grained con permiso «Contents: Read and write» solo sobre ese repositorio. Introdúcelo únicamente en un dispositivo de confianza.'),
                owner.el, repo.el, branch.el, path.el, token.el,
                h('button', {
                    type: 'button',
                    onclick: async () => {
                        const settings = {
                            owner: owner.input.value.trim(), repo: repo.input.value.trim(),
                            branch: branch.input.value.trim() || 'main',
                            path: path.input.value.trim() || 'tags-data.json', token: token.input.value.trim()
                        };
                        if (!settings.owner || !settings.repo || !settings.token) {
                            status.textContent = 'Faltan usuario, repositorio o token.';
                            return;
                        }
                        try {
                            await publishToGitHub(settings, status);
                            status.textContent = 'Publicado. Los cambios aparecerán cuando tu hosting despliegue el commit.';
                        } catch (error) {
                            status.textContent = error.message;
                        } finally {
                            token.input.value = '';
                        }
                    }
                }, 'Publicar en GitHub')),
            status);
    }

    // ---------- Estructura ----------
    const dialog = h('dialog', { id: 'ftagAdminDialog', class: 'ftag-admin', 'aria-labelledby': 'ftagAdminTitle' });
    const fab = h('button', {
        type: 'button', class: 'ftag-admin-fab',
        onclick: () => { render(); if (!dialog.open) dialog.showModal(); }
    }, '🏷️ Etiquetas (admin)');

    function render() {
        const tabs = [['tags', 'Etiquetas'], ['rules', 'Reglas'], ['cosmetics', 'Cosméticos'], ['publish', 'Publicar']];
        const body = { tags: renderTags, rules: renderRules, cosmetics: renderCosmetics, publish: renderPublish }[tab]();
        dialog.replaceChildren(
            h('div', { class: 'ftag-admin-header' },
                h('h2', { id: 'ftagAdminTitle' }, 'Administración de etiquetas'),
                h('button', { type: 'button', onclick: () => dialog.close() }, 'Cerrar')),
            h('div', { class: 'ftag-admin-tabs', role: 'tablist' }, tabs.map(([id, label]) => h('button', {
                type: 'button', role: 'tab', 'aria-selected': String(tab === id),
                onclick: () => { dialog.querySelector(':focus')?.blur(); tab = id; render(); }
            }, label))),
            h('div', { class: 'ftag-admin-body' }, body));
    }

    document.body.append(dialog, fab);
})();
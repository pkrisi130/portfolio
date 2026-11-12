/* =========================================================================
   Portfolio behaviour. Project content lives in js/projects.js, not here.
   1. Helpers  2. Header & nav  3. Work grid & filters  4. Project viewer
   5. Contact form
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const projects = (typeof PROJECTS !== 'undefined' ? PROJECTS : []).filter(p => !p.hidden);
    const filters = typeof FILTERS !== 'undefined' ? FILTERS : [];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. Helpers ---------- */

    /** Create an element: el('a', { class: 'x', href: '#', text: 'Hi' }, [children]) */
    const el = (tag, props = {}, children = []) => {
        const node = document.createElement(tag);
        for (const [key, value] of Object.entries(props)) {
            if (value === undefined || value === null || value === false) continue;
            if (key === 'class') node.className = value;
            else if (key === 'text') node.textContent = value;
            else node.setAttribute(key, value);
        }
        node.append(...children.filter(Boolean));
        return node;
    };
    const $ = id => document.getElementById(id);
    const small = base => `${base}-800.webp`;
    const large = base => `${base}-1600.webp`;

    /** All images of a project, in viewing order (first concept when there are concepts). */
    const imagesOf = p => {
        if (p.concepts && p.concepts.length) return p.concepts[0].images;
        if (p.images && p.images.length) return p.images;
        return [p.cover];
    };
    const imageCount = p => (p.concepts && p.concepts.length)
        ? p.concepts.reduce((n, c) => n + c.images.length, 0)
        : imagesOf(p).length;

    // A typo in projects.js should never blank the page: warn and carry on.
    const REQUIRED = ['slug', 'title', 'filter', 'label', 'cover', 'alt', 'width', 'height'];
    const seen = new Set();
    projects.forEach((p, i) => {
        const missing = REQUIRED.filter(k => !p[k]);
        if (missing.length) console.warn(`projects.js: "${p.title || p.slug || '#' + (i + 1)}" is missing: ${missing.join(', ')}`);
        if (p.slug && seen.has(p.slug)) console.warn(`projects.js: slug "${p.slug}" is used twice; links to it will open the first one.`);
        seen.add(p.slug);
        if (p.filter && filters.length && !filters.some(f => f.key === p.filter)) {
            console.warn(`projects.js: "${p.title}" uses filter "${p.filter}", which is not in FILTERS; it only shows under "All".`);
        }
    });

    /* ---------- 2. Header & nav ---------- */

    const header = $('site-header');
    const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const year = $('year');
    if (year) year.textContent = String(new Date().getFullYear());

    // Highlight the nav link of the section currently on screen
    const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
        const visible = new Map();
        const spy = new IntersectionObserver(entries => {
            entries.forEach(e => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
            let best = null, bestRatio = 0;
            visible.forEach((ratio, id) => { if (ratio > bestRatio) { best = id; bestRatio = ratio; } });
            navLinks.forEach(a => {
                if (best && a.getAttribute('href') === `#${best}`) a.setAttribute('aria-current', 'true');
                else a.removeAttribute('aria-current');
            });
        }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01, 0.25, 0.5, 1] });
        sections.forEach(s => spy.observe(s));
    }

    // Printing: load all lazy images first so none are missing on paper
    window.addEventListener('beforeprint', () => {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
    });

    /* ---------- 3. Work grid & filters ---------- */

    const grid = document.querySelector('.work-grid');
    const filterBar = document.querySelector('.filters');
    const filterStatus = $('filter-status');

    const markLoaded = img => {
        const done = () => img.classList.remove('is-pending');
        if (img.complete && img.naturalWidth) return;
        img.classList.add('is-pending');
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', () => {
            done();
            img.closest('.card-media')?.classList.add('is-broken');
            img.style.visibility = 'hidden';
            console.warn(`Image not found: ${img.currentSrc || img.src}. Check the file name and folder in images/projects/.`);
        }, { once: true });
    };

    if (grid) {
        grid.append(...projects.map((p, index) => {
            const isLarge = p.featured === 'large';
            const img = el('img', {
                src: small(p.cover),
                srcset: `${small(p.cover)} 800w, ${large(p.cover)} 1600w`,
                // how wide the tile is at each screen size, so the browser picks the right file
                sizes: isLarge
                    ? '(min-width: 1024px) 50vw, (min-width: 600px) 50vw, 100vw'
                    : '(min-width: 1024px) 25vw, (min-width: 600px) 50vw, 100vw',
                alt: p.alt || '',
                width: p.width,
                height: p.height,
                loading: index < 3 ? 'eager' : 'lazy',
                fetchpriority: index === 0 ? 'high' : undefined,
                decoding: 'async'
            });
            if (p.focus) img.style.objectPosition = p.focus;
            markLoaded(img);

            const count = imageCount(p);
            const media = el('div', { class: 'card-media' + (p.fit === 'contain' ? ' fit-contain' : '') }, [
                img,
                count > 1 ? el('span', { class: 'card-count', 'aria-hidden': 'true', text: `${count} images` }) : null
            ]);
            if (p.background) {
                media.style.background = p.background;
                if (/^#f{3}(f{3})?$/i.test(p.background)) media.classList.add('on-white');
            }

            const featured = isLarge ? ' featured-large' : p.featured === 'wide' ? ' featured-wide' : '';
            return el('article', { class: 'card' + featured, 'data-filter': p.filter, 'data-index': index }, [
                media,
                el('div', { class: 'card-caption' }, [
                    el('span', { class: 'card-label', text: p.label }),
                    el('h3', { class: 'card-title' }, [
                        el('button', {
                            type: 'button',
                            class: 'card-open',
                            'aria-haspopup': 'dialog',
                            'aria-label': count > 1 ? `${p.title}, ${count} images` : undefined,
                            text: p.title
                        })
                    ])
                ])
            ]);
        }));
    }

    if (filterBar && grid) {
        const used = filters.filter(f => projects.some(p => p.filter === f.key));
        if (used.length > 1) {
            filterBar.append(
                el('button', { type: 'button', class: 'filter-btn', 'data-filter': 'all', 'aria-pressed': 'true', text: 'All' }),
                ...used.map(f => el('button', { type: 'button', class: 'filter-btn', 'data-filter': f.key, 'aria-pressed': 'false', text: f.label }))
            );
        } else {
            filterBar.hidden = true;
        }

        filterBar.addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            filterBar.querySelectorAll('.filter-btn').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
            const value = btn.dataset.filter;
            let shown = 0;
            grid.querySelectorAll('.card').forEach(card => {
                card.hidden = value !== 'all' && card.dataset.filter !== value;
                if (!card.hidden) shown++;
            });
            if (filterStatus) filterStatus.textContent = `Showing ${shown} ${shown === 1 ? 'project' : 'projects'}${value === 'all' ? '' : ' in ' + btn.textContent}.`;
            btn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
        });

        // Phones: fade the right edge of the filter row while there is more to scroll
        const updateScrollHint = () => {
            const more = filterBar.scrollWidth - filterBar.clientWidth - filterBar.scrollLeft > 4;
            filterBar.classList.toggle('can-scroll', more);
        };
        filterBar.addEventListener('scroll', updateScrollHint, { passive: true });
        window.addEventListener('resize', updateScrollHint);
        updateScrollHint();
    }

    /* ---------- 4. Project viewer ---------- */

    const viewer = $('viewer');
    if (viewer && grid && typeof viewer.showModal === 'function') initViewer();

    function initViewer() {
        const vImg = $('viewer-img'), vTitle = $('viewer-title'), vLabel = $('viewer-label'),
              vDesc = $('viewer-desc'), vFacts = $('viewer-facts'), vConcepts = $('viewer-concepts'),
              vThumbs = $('viewer-thumbs'), vCount = $('viewer-count'), vLive = $('viewer-live'),
              vToast = $('viewer-toast'), vShare = $('viewer-share');
        const HASH_PREFIX = '#work/';
        let current = -1;
        let openedWithHistory = false; // true when opening added a browser history entry
        const preloaded = new Set();

        const visibleIndexes = () => [...grid.querySelectorAll('.card:not([hidden])')].map(c => Number(c.dataset.index));
        const cardOf = index => grid.querySelector(`.card[data-index="${index}"]`);
        const urlFor = p => `${location.pathname}${location.search}${HASH_PREFIX}${encodeURIComponent(p.slug)}`;

        const preload = base => {
            if (!base || preloaded.has(base)) return;
            preloaded.add(base);
            const i = new Image();
            i.decoding = 'async';
            i.src = large(base);
        };

        const showImage = (base, alt) => {
            vImg.classList.add('is-loading');
            vImg.onload = () => vImg.classList.remove('is-loading');
            vImg.onerror = () => {
                vImg.classList.remove('is-loading');
                console.warn(`Image not found: ${vImg.src}`);
            };
            vImg.src = large(base);
            vImg.alt = alt || '';
        };

        const renderThumbs = (images, alt) => {
            if (images.length < 2) { vThumbs.replaceChildren(); return; }
            const buttons = images.map((base, i) => {
                const b = el('button', { type: 'button', class: 'thumb', 'aria-label': `Image ${i + 1} of ${images.length}`, 'aria-current': String(i === 0) },
                    [el('img', { src: small(base), alt: '', width: 64, height: 64, loading: 'lazy', decoding: 'async' })]);
                b.addEventListener('click', () => {
                    showImage(base, alt);
                    buttons.forEach(x => x.setAttribute('aria-current', String(x === b)));
                });
                return b;
            });
            vThumbs.replaceChildren(...buttons);
            images.slice(1).forEach(preload);
        };

        const render = (index, { announce = false } = {}) => {
            const p = projects[index];
            if (!p) return;
            current = index;
            const order = visibleIndexes();
            const pos = Math.max(0, order.indexOf(index));
            vCount.textContent = `${pos + 1} / ${order.length}`;
            vLabel.textContent = p.label || '';
            vTitle.textContent = p.title;
            vDesc.textContent = p.description || '';
            vDesc.hidden = !p.description;

            const facts = [['Year', p.year], ['Type', p.type], ['Client', p.client], ['Role', p.role],
                ['Tools', Array.isArray(p.tools) ? p.tools.join(', ') : p.tools]].filter(([, v]) => v);
            vFacts.replaceChildren(...facts.flatMap(([k, v]) => [el('dt', { text: k }), el('dd', { text: String(v) })]));

            vConcepts.replaceChildren();
            if (p.concepts && p.concepts.length > 1) {
                const buttons = p.concepts.map((c, i) => el('button', {
                    type: 'button', class: 'concept-btn', 'aria-pressed': String(i === 0), text: c.label || `Concept ${i + 1}`
                }));
                buttons.forEach((b, i) => b.addEventListener('click', () => {
                    buttons.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
                    showImage(p.concepts[i].images[0], p.alt);
                    renderThumbs(p.concepts[i].images, p.alt);
                }));
                vConcepts.append(...buttons);
            }

            const images = imagesOf(p);
            showImage(images[0], p.alt);
            renderThumbs(images, p.alt);
            viewer.scrollTop = 0;
            // When browsing with prev/next, tell screen readers which project is now shown
            vLive.textContent = announce ? `${p.title}, project ${pos + 1} of ${order.length}` : '';
            document.title = `${p.title} — Kristina Petrova`;

            // Make the next/previous project appear instantly
            if (order.length > 1) {
                preload(imagesOf(projects[order[(pos + 1) % order.length]])[0]);
                preload(imagesOf(projects[order[(pos - 1 + order.length) % order.length]])[0]);
            }
        };

        const baseTitle = document.title;

        const open = (index, { fromHistory = false } = {}) => {
            render(index);
            if (!viewer.open) viewer.showModal();
            if (!fromHistory) {
                const state = { viewer: projects[index].slug };
                if (history.state && history.state.viewer) history.replaceState(state, '', urlFor(projects[index]));
                else { history.pushState(state, '', urlFor(projects[index])); openedWithHistory = true; }
            }
        };

        const step = dir => {
            const order = visibleIndexes();
            if (order.length < 2) return;
            const pos = order.indexOf(current);
            const next = order[(pos + dir + order.length) % order.length];
            render(next, { announce: true });
            history.replaceState({ viewer: projects[next].slug }, '', urlFor(projects[next]));
        };

        /** Close the viewer; the browser history entry it added is removed too. */
        const requestClose = () => {
            if (openedWithHistory && history.state && history.state.viewer) history.back(); // popstate closes it
            else viewer.close();
        };

        viewer.addEventListener('close', () => {
            document.title = baseTitle;
            if (history.state && history.state.viewer) {
                history.replaceState(null, '', `${location.pathname}${location.search}#work`);
            }
            openedWithHistory = false;
            // Put focus on the card of the project that was last on screen
            const card = cardOf(current);
            if (card) {
                if (card.hidden) return;
                card.scrollIntoView({ block: 'nearest', behavior: 'auto' });
                card.querySelector('.card-open')?.focus({ preventScroll: true });
            }
        });

        // Browser back/forward buttons (and Android's back gesture)
        window.addEventListener('popstate', e => {
            const slug = e.state && e.state.viewer;
            const index = slug ? projects.findIndex(p => p.slug === slug) : -1;
            if (index >= 0) open(index, { fromHistory: true });
            else if (viewer.open) { openedWithHistory = false; viewer.close(); }
        });

        grid.addEventListener('click', e => {
            const card = e.target.closest('.card');
            if (card) open(Number(card.dataset.index));
        });

        $('viewer-close').addEventListener('click', requestClose);
        $('viewer-prev').addEventListener('click', () => step(-1));
        $('viewer-next').addEventListener('click', () => step(1));

        // Esc: route through requestClose so history stays tidy
        viewer.addEventListener('cancel', e => { e.preventDefault(); requestClose(); });

        viewer.addEventListener('keydown', e => {
            if (e.altKey || e.ctrlKey || e.metaKey) return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
        });

        // Click on the empty dark area closes the viewer
        viewer.addEventListener('click', e => {
            const t = e.target;
            if (t === viewer || t.classList.contains('viewer-body') || t.classList.contains('viewer-stage')) requestClose();
        });

        // Swipe left/right on the image area to change project (phones)
        const stage = vImg.parentElement;
        let touch = null;
        stage.addEventListener('touchstart', e => {
            touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
        }, { passive: true });
        stage.addEventListener('touchend', e => {
            if (!touch) return;
            const dx = e.changedTouches[0].clientX - touch.x;
            const dy = e.changedTouches[0].clientY - touch.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
            touch = null;
        });

        // Copy / share a direct link to the project
        let toastTimer;
        const toast = msg => {
            vToast.textContent = msg;
            vToast.classList.add('is-visible');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => vToast.classList.remove('is-visible'), 2200);
        };
        vShare.addEventListener('click', async () => {
            const p = projects[current];
            const url = new URL(urlFor(p), location.href).href;
            const touchDevice = window.matchMedia('(pointer: coarse)').matches;
            try {
                if (touchDevice && navigator.share) {
                    await navigator.share({ title: `${p.title} — Kristina Petrova`, url });
                } else if (navigator.clipboard) {
                    await navigator.clipboard.writeText(url);
                    toast('Link copied');
                } else {
                    window.prompt('Copy this link:', url);
                }
            } catch (err) {
                if (err && err.name !== 'AbortError') toast('Could not copy the link');
            }
        });

        // Opening the site with a project link (…#work/goran-bakery) opens that project
        const openFromHash = () => {
            if (!location.hash.startsWith(HASH_PREFIX)) return;
            const slug = decodeURIComponent(location.hash.slice(HASH_PREFIX.length));
            const index = projects.findIndex(p => p.slug === slug);
            if (index < 0) return;
            history.replaceState({ viewer: slug }, '', urlFor(projects[index]));
            openedWithHistory = false;
            open(index, { fromHistory: true });
        };
        openFromHash();
        window.addEventListener('hashchange', () => { if (!viewer.open) openFromHash(); });
    }

    /* ---------- 5. Contact form (Formspree) ---------- */

    const form = $('contact-form');
    const status = $('form-status');
    if (form && status) {
        const fields = [...form.querySelectorAll('input[required], textarea[required]')];

        const validate = (field, showError) => {
            const ok = field.checkValidity() && field.value.trim().length > 0;
            const box = $(field.getAttribute('aria-describedby'));
            if (ok) {
                field.removeAttribute('aria-invalid');
                if (box) box.textContent = '';
            } else if (showError) {
                field.setAttribute('aria-invalid', 'true');
                if (box) box.textContent = field.dataset.error || field.validationMessage;
            }
            return ok;
        };

        fields.forEach(field => {
            field.addEventListener('blur', () => { if (field.value) validate(field, true); });
            field.addEventListener('input', () => { if (field.getAttribute('aria-invalid')) validate(field, true); });
        });

        form.addEventListener('submit', async event => {
            event.preventDefault();
            const invalid = fields.filter(f => !validate(f, true));
            if (invalid.length) {
                invalid[0].focus();
                status.className = 'form-status is-error';
                status.textContent = invalid.length === 1 ? 'Please check the highlighted field.' : 'Please check the highlighted fields.';
                return;
            }

            const button = form.querySelector('[type="submit"]');
            const label = button.textContent;
            button.disabled = true;
            button.textContent = 'Sending…';
            status.className = 'form-status';
            status.textContent = '';
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' }
                });
                if (response.ok) {
                    status.textContent = 'Thanks for your message! I will get back to you soon.';
                    status.classList.add('is-success');
                    form.reset();
                } else {
                    const data = await response.json().catch(() => ({}));
                    status.textContent = Array.isArray(data.errors) && data.errors.length
                        ? data.errors.map(e => e.message).join(', ')
                        : 'Oops! There was a problem sending your message.';
                    status.classList.add('is-error');
                }
            } catch {
                status.textContent = 'Oops! There was a problem sending your message. Please try again or reach me on Instagram.';
                status.classList.add('is-error');
            } finally {
                button.disabled = false;
                button.textContent = label;
            }
        });
    }
});

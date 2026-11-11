/* Portfolio behaviour. Project content lives in js/projects.js — not here. */
document.addEventListener('DOMContentLoaded', () => {
    const projects = (typeof PROJECTS !== 'undefined' ? PROJECTS : []).filter(p => !p.hidden);
    const filters = typeof FILTERS !== 'undefined' ? FILTERS : [];

    /* ---------- helpers ---------- */
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
    const small = base => `${base}-800.webp`;
    const large = base => `${base}-1600.webp`;
    const imagesOf = p => {
        if (p.concepts && p.concepts.length) return p.concepts[0].images;
        if (p.images && p.images.length) return p.images;
        return [p.cover];
    };

    // A typo in projects.js should never blank the page: warn and carry on.
    const REQUIRED = ['slug', 'title', 'filter', 'label', 'cover', 'alt', 'width', 'height'];
    projects.forEach((p, i) => {
        const missing = REQUIRED.filter(k => !p[k]);
        if (missing.length) console.warn(`projects.js: "${p.title || p.slug || '#' + (i + 1)}" is missing: ${missing.join(', ')}`);
    });

    /* ---------- header border on scroll ---------- */
    const header = document.getElementById('site-header');
    const onScroll = () => header && header.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- footer year ---------- */
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* ---------- work grid ---------- */
    const grid = document.querySelector('.work-grid');
    const filterBar = document.querySelector('.filters');

    if (grid) {
        grid.append(...projects.map((p, index) => {
            const img = el('img', {
                src: small(p.cover),
                srcset: `${small(p.cover)} 800w, ${large(p.cover)} 1600w`,
                sizes: '(min-width: 1024px) 400px, (min-width: 600px) 50vw, 100vw',
                alt: p.alt || '',
                width: p.width,
                height: p.height,
                loading: index < 3 ? 'eager' : 'lazy',
                decoding: 'async'
            });
            if (p.focus) img.style.objectPosition = p.focus;

            const media = el('div', { class: 'card-media' + (p.fit === 'contain' ? ' fit-contain' : '') }, [img]);
            if (p.background) {
                media.style.background = p.background;
                if (/^#f{3,6}$/i.test(p.background)) media.classList.add('on-white');
            }

            const featured = p.featured === 'large' ? ' featured-large' : p.featured === 'wide' ? ' featured-wide' : '';
            return el('article', { class: 'card' + featured, 'data-filter': p.filter, 'data-index': index, 'data-count': imagesOf(p).length }, [
                media,
                el('div', { class: 'card-caption' }, [
                    el('span', { class: 'card-label', text: p.label }),
                    el('h3', { class: 'card-title' }, [
                        el('button', { type: 'button', class: 'card-open', 'aria-haspopup': 'dialog', text: p.title })
                    ])
                ])
            ]);
        }));
    }

    if (filterBar) {
        const used = filters.filter(f => projects.some(p => p.filter === f.key));
        if (used.length > 1) {
            filterBar.append(
                el('button', { type: 'button', class: 'filter-btn', 'data-filter': 'all', 'aria-pressed': 'true', text: 'All' }),
                ...used.map(f => el('button', { type: 'button', class: 'filter-btn', 'data-filter': f.key, 'aria-pressed': 'false', text: f.label }))
            );
        }
        filterBar.addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            filterBar.querySelectorAll('.filter-btn').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
            const value = btn.dataset.filter;
            grid.querySelectorAll('.card').forEach(card => {
                card.hidden = value !== 'all' && card.dataset.filter !== value;
            });
        });
    }

    /* ---------- project viewer ---------- */
    const viewer = document.getElementById('viewer');
    if (!viewer || !grid) return;

    const $ = id => document.getElementById(id);
    const vImg = $('viewer-img'), vTitle = $('viewer-title'), vLabel = $('viewer-label'),
          vDesc = $('viewer-desc'), vFacts = $('viewer-facts'), vConcepts = $('viewer-concepts'),
          vThumbs = $('viewer-thumbs'), vCount = $('viewer-count');
    let current = -1;
    let lastTrigger = null;

    const visibleIndexes = () => [...grid.querySelectorAll('.card:not([hidden])')].map(c => Number(c.dataset.index));

    const showImage = (base, alt) => {
        vImg.classList.add('is-loading');
        vImg.onload = () => vImg.classList.remove('is-loading');
        vImg.src = large(base);
        vImg.alt = alt || '';
    };

    const renderThumbs = (images, alt) => {
        if (images.length < 2) { vThumbs.replaceChildren(); return; }
        const buttons = images.map((base, i) => {
            const b = el('button', { type: 'button', class: 'thumb', 'aria-label': `Image ${i + 1} of ${images.length}`, 'aria-current': String(i === 0) },
                [el('img', { src: small(base), alt: '', loading: 'lazy', decoding: 'async' })]);
            b.addEventListener('click', () => {
                showImage(base, alt);
                buttons.forEach(x => x.setAttribute('aria-current', String(x === b)));
            });
            return b;
        });
        vThumbs.replaceChildren(...buttons);
    };

    const render = index => {
        const p = projects[index];
        current = index;
        const order = visibleIndexes();
        vCount.textContent = `${order.indexOf(index) + 1} / ${order.length}`;
        vLabel.textContent = p.label || '';
        vTitle.textContent = p.title;
        vDesc.textContent = p.description || '';

        const facts = [['Year', p.year], ['Type', p.type], ['Role', p.role], ['Tools', Array.isArray(p.tools) ? p.tools.join(', ') : p.tools]]
            .filter(([, v]) => v);
        vFacts.replaceChildren(...facts.flatMap(([k, v]) => [el('dt', { text: k }), el('dd', { text: String(v) })]));

        vConcepts.replaceChildren();
        if (p.concepts && p.concepts.length > 1) {
            const buttons = p.concepts.map((c, i) => el('button', { type: 'button', class: 'concept-btn', 'aria-pressed': String(i === 0), text: c.label || `Concept ${i + 1}` }));
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
    };

    const step = dir => {
        const order = visibleIndexes();
        const pos = order.indexOf(current);
        render(order[(pos + dir + order.length) % order.length]);
    };

    const open = index => {
        lastTrigger = grid.querySelector(`.card[data-index="${index}"] .card-open`);
        render(index);
        viewer.showModal();
    };

    grid.addEventListener('click', e => {
        const card = e.target.closest('.card');
        if (card) open(Number(card.dataset.index));
    });

    $('viewer-close').addEventListener('click', () => viewer.close());
    $('viewer-prev').addEventListener('click', () => step(-1));
    $('viewer-next').addEventListener('click', () => step(1));

    viewer.addEventListener('keydown', e => {
        if (e.target.closest('input, textarea')) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });

    // Click on the empty dark area closes the viewer
    viewer.addEventListener('click', e => {
        if (e.target === viewer || e.target.classList.contains('viewer-body') || e.target.classList.contains('viewer-stage')) viewer.close();
    });

    // Swipe left/right on the image to change project (phones)
    let touchX = null, touchY = null;
    vImg.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY; }, { passive: true });
    vImg.addEventListener('touchend', e => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        const dy = e.changedTouches[0].clientY - touchY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
        touchX = touchY = null;
    });

    // Return focus to the card that opened the viewer
    viewer.addEventListener('close', () => { if (lastTrigger) lastTrigger.focus({ preventScroll: true }); });

    /* ---------- contact form (Formspree) ---------- */
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (form && status) {
        form.addEventListener('submit', async event => {
            event.preventDefault();
            const button = form.querySelector('[type="submit"]');
            button.disabled = true;
            status.className = 'form-status';
            status.textContent = 'Sending…';
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
                    status.textContent = Array.isArray(data.errors)
                        ? data.errors.map(e => e.message).join(', ')
                        : 'Oops! There was a problem sending your message.';
                    status.classList.add('is-error');
                }
            } catch {
                status.textContent = 'Oops! There was a problem sending your message. Please try again or reach me on Instagram.';
                status.classList.add('is-error');
            } finally {
                button.disabled = false;
            }
        });
    }
});

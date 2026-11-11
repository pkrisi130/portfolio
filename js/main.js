/* Portfolio behaviour. Project content lives in js/projects.js. */
document.documentElement.classList.replace('no-js', 'js');

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const visibleProjects = (typeof PROJECTS !== 'undefined' ? PROJECTS : []).filter(p => !p.hidden);

    /* ---------- helpers ---------- */
    const el = (tag, props = {}, children = []) => {
        const node = document.createElement(tag);
        for (const [k, v] of Object.entries(props)) {
            if (v === undefined || v === null || v === false) continue;
            if (k === 'class') node.className = v;
            else if (k === 'text') node.textContent = v;
            else if (k === 'style') Object.assign(node.style, v);
            else if (k.startsWith('data-')) node.setAttribute(k, v);
            else if (k in node) node[k] = v;
            else node.setAttribute(k, v);
        }
        children.forEach(c => c && node.appendChild(c));
        return node;
    };
    const small = base => `${base}-800.webp`;
    const large = base => `${base}-1600.webp`;

    // Warn (instead of breaking the page) when a project is missing something
    const REQUIRED = ['slug', 'title', 'filter', 'label', 'cover', 'alt'];
    visibleProjects.forEach((p, i) => {
        const missing = REQUIRED.filter(k => !p[k]);
        if (missing.length) console.warn(`projects.js: project #${i + 1} (${p.title || p.slug || '?'}) is missing: ${missing.join(', ')}`);
    });

    /* ---------- 0. Render filters + grid from data ---------- */
    const grid = document.querySelector('.portfolio-grid');
    const filterBar = document.querySelector('.portfolio-filters');

    if (filterBar && typeof FILTERS !== 'undefined') {
        filterBar.replaceChildren(
            el('button', { type: 'button', class: 'filter-btn active hover-target', 'data-filter': 'all', text: 'All' }),
            ...FILTERS
                .filter(f => visibleProjects.some(p => p.filter === f.key))
                .map(f => el('button', { type: 'button', class: 'filter-btn hover-target', 'data-filter': f.key, text: f.label }))
        );
    }

    if (grid) {
        grid.replaceChildren(...visibleProjects.map((p, index) => {
            const img = el('img', {
                src: small(p.cover),
                srcset: `${small(p.cover)} 800w, ${large(p.cover)} 1600w`,
                sizes: '(min-width: 1024px) 33vw, 100vw',
                alt: p.alt || '',
                width: p.width, height: p.height,
                loading: 'lazy', decoding: 'async'
            });
            if (p.focus) img.style.objectPosition = p.focus;
            if (p.fit === 'contain') img.style.objectFit = 'contain';
            const featured = p.featured === 'large' ? ' featured-large' : p.featured === 'wide' ? ' featured-wide' : '';
            return el('div', {
                class: `portfolio-item reveal hover-target${featured}`,
                'data-category': p.filter,
                'data-index': String(index),
                'data-count': String(projectImages(p).length)
            }, [
                el('div', { class: 'portfolio-image', style: p.background ? { background: p.background } : {} }, [img]),
                el('div', { class: 'portfolio-overlay' }, [
                    el('span', { class: 'portfolio-category', text: p.label }),
                    el('h3', { class: 'portfolio-title', text: p.title })
                ])
            ]);
        }));
    }

    function projectImages(p) {
        if (p.concepts && p.concepts.length) return p.concepts.flatMap(c => c.images);
        return p.images && p.images.length ? p.images : [];
    }

    /* ---------- 1. Custom cursor ---------- */
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    if (cursor && cursorDot) {
        document.addEventListener('mousemove', e => {
            cursorDot.style.left = cursor.style.left = e.clientX + 'px';
            cursorDot.style.top = cursor.style.top = e.clientY + 'px';
        });
        document.addEventListener('mouseover', e => {
            body.classList.toggle('hovering', !!e.target.closest('.hover-target'));
        });
    }

    /* ---------- 2. Typewriter ---------- */
    const textElement = document.getElementById('typewriter-text');
    if (textElement) {
        const phrases = ['Digital Designer', 'Illustrator', 'Visual Storyteller'];
        let phraseIndex = 0, charIndex = 0, isDeleting = false;
        const type = () => {
            const current = phrases[phraseIndex];
            charIndex += isDeleting ? -1 : 1;
            textElement.textContent = current.substring(0, charIndex);
            let delay = isDeleting ? 50 : 100;
            if (!isDeleting && charIndex === current.length) { isDeleting = true; delay = 2000; }
            else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 500; }
            setTimeout(type, delay);
        };
        setTimeout(type, 1000);
    }

    /* ---------- 3+4. Scroll progress + header ---------- */
    const progress = document.getElementById('progress-bar');
    const header = document.getElementById('main-header');
    const onScroll = () => {
        const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (progress) progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
        if (header) header.classList.toggle('scrolled', scrollY > 50);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- 5. Mobile menu ---------- */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        const setMenu = open => {
            navLinks.classList.toggle('active', open);
            menuToggle.classList.toggle('active', open);
            body.classList.toggle('nav-open', open);
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        };
        menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('active')));
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
        document.addEventListener('click', e => {
            if (body.classList.contains('nav-open') && !e.target.closest('#nav-links, #menu-toggle')) setMenu(false);
        });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && body.classList.contains('nav-open')) setMenu(false); });
    }

    /* ---------- 6. Scroll reveal ---------- */
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(node => revealObserver.observe(node));

    /* ---------- 7. Contact form (Formspree) ---------- */
    const form = document.getElementById('contact-form');
    const status = document.getElementById('my-form-status');
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
                status.textContent = 'Oops! There was a problem sending your message.';
                status.classList.add('is-error');
            } finally {
                button.disabled = false;
            }
        });
    }

    /* ---------- 8. Filters ---------- */
    if (filterBar) {
        filterBar.addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            const value = btn.dataset.filter;
            document.querySelectorAll('.portfolio-item').forEach(item => {
                item.classList.toggle('hidden', value !== 'all' && item.dataset.category !== value);
            });
        });
    }

    /* ---------- 9. Project viewer (modal) ---------- */
    const modal = document.getElementById('portfolio-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalCat = document.getElementById('modal-category');
    const modalDesc = document.getElementById('modal-description');
    const modalGallery = document.getElementById('modal-gallery');
    const closeBtn = modal && modal.querySelector('.close-modal');

    const showImage = (base, alt) => {
        modalImg.classList.remove('fade-in');
        void modalImg.offsetWidth;
        modalImg.src = large(base);
        modalImg.alt = alt || '';
        modalImg.classList.add('fade-in');
    };

    const thumbs = (images, container, alt) => {
        container.replaceChildren(...images.map(base => {
            const t = el('img', { src: small(base), alt: '', loading: 'lazy', decoding: 'async' });
            t.addEventListener('click', () => showImage(base, alt));
            return t;
        }));
    };

    const openProject = p => {
        modalTitle.textContent = p.title;
        modalCat.textContent = p.label;
        modalDesc.textContent = p.description || '';
        modalGallery.replaceChildren();

        if (p.concepts && p.concepts.length > 1) {
            const tabs = el('div', { class: 'modal-tabs' });
            const label = el('span', { class: 'concept-label' });
            const thumbBox = el('div', { class: 'modal-gallery', style: { marginTop: '0' } });
            const buttons = p.concepts.map((c, i) => el('button', { type: 'button', class: 'tab-btn', text: c.label || `Concept ${i + 1}` }));
            const render = i => {
                buttons.forEach((b, j) => b.classList.toggle('active', i === j));
                label.textContent = p.concepts[i].label || '';
                showImage(p.concepts[i].images[0], p.alt);
                thumbs(p.concepts[i].images, thumbBox, p.alt);
            };
            buttons.forEach((b, i) => b.addEventListener('click', () => render(i)));
            tabs.append(...buttons);
            modalGallery.append(tabs, label, thumbBox);
            render(0);
        } else {
            const images = projectImages(p);
            showImage(images[0] || p.cover, p.alt);
            if (images.length > 1) thumbs(images, modalGallery, p.alt);
        }
        modal.classList.add('show');
        body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('show');
        body.style.overflow = '';
    };

    if (grid && modal) {
        grid.addEventListener('click', e => {
            const item = e.target.closest('.portfolio-item');
            if (item) openProject(visibleProjects[Number(item.dataset.index)]);
        });
        closeBtn && closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('show')) closeModal(); });
    }
});

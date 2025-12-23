document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------
     * Utilities
     * -------------------------------------------------- */

    const loadHTML = (url, elementId, callback) => {
        fetch(url)
            .then(res => res.text())
            .then(html => {
                const el = document.getElementById(elementId);
                if (!el) return;
                el.innerHTML = html;
                callback?.();
            })
            .catch(err => console.error('Error loading content:', err));
    };

    /* ----------------------------------------------------
     * Light / Dark Theme
     * -------------------------------------------------- */

    const initTheme = () => {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;

        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);

        toggleBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    };

    /* ----------------------------------------------------
     * Layout Loading
     * -------------------------------------------------- */

    loadHTML('/subpages/header.html', 'header-placeholder', initTheme);
    loadHTML('/subpages/sidebar.html', 'sidebar-placeholder');
    loadHTML('/subpages/footnote.html', 'footnote-placeholder');

    /* ----------------------------------------------------
     * List Enumeration
     * -------------------------------------------------- */

    const enumerateListItems = selector => {
        const items = document.querySelectorAll(selector);
        const total = items.length;

        items.forEach((item, i) => {
            const num = item.querySelector('.list-number');
            if (num) num.textContent = `${total - i}.`;
        });
    };

    enumerateListItems('#publication-list li');
    enumerateListItems('#book-chapters-list li');
    enumerateListItems('#patents-list li');

    /* ----------------------------------------------------
     * Collapsible Sections
     * -------------------------------------------------- */

    document.querySelectorAll('.collapsed-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            if (!content) return;

            header.classList.toggle('active');
            const expanded = header.classList.contains('active');
            header.setAttribute('aria-expanded', expanded);
            content.classList.toggle('collapsed');

            if (expanded) {
                setTimeout(() => {
                    content.style.maxHeight = `${content.scrollHeight}px`;
                }, 5);
            } else {
                content.style.maxHeight = `${content.scrollHeight}px`;
                requestAnimationFrame(() => {
                    content.style.maxHeight = null;
                });
            }

            const group = header.closest('.publication-group');
            if (group?.id === 'publications-Articles' && expanded) {
                setTimeout(() => {
                    group.style.maxHeight = `${group.scrollHeight}px`;
                }, 100);
            }
        });
    });

    /* ----------------------------------------------------
     * Scroll-Driven Scene Transitions
     * -------------------------------------------------- */

    const stickyContainer = document.getElementById('sticky-container');
    const textOverlay = document.getElementById('text-overlay');
    const dynamicContent = document.getElementById('dynamic-content-container');
    const triggerSections = [...document.querySelectorAll('.trigger-section')];
    const images = document.querySelectorAll('#image-display img');

    const initialNode = dynamicContent?.querySelector('.dynamic-content-swap');
    const originalScene1 = initialNode?.innerHTML || '';

    let currentScene = 1;
    let isAnimating = false;
    let queuedScene = null;
    let t1, t2;

    const getSceneContent = scene => {
        if (scene === 1) return originalScene1;
        const trigger = triggerSections[scene - 2];
        return trigger?.querySelector('.dynamic-content-swap')?.innerHTML || '';
    };

    const updateScene = (scene, html) => {
        dynamicContent.innerHTML = `<div class="dynamic-content-swap">${html}</div>`;
        images.forEach(img => img.classList.remove('active', 'zoom-out-blur'));
        document.getElementById(`image-${scene}`)?.classList.add('active');
    };

    const transitionScene = (scene, down, html) => {
        if (scene === currentScene) return;

        clearTimeout(t1);
        clearTimeout(t2);
        isAnimating = true;

        const out = down ? 'slide-out-left' : 'slide-out-right';
        const enter = down ? 'pre-enter-left' : 'pre-enter-right';
        const duration = 1200;

        stickyContainer.classList.remove(out, enter);
        stickyContainer.classList.add(out);
        textOverlay.classList.add('fading-out');

        t1 = setTimeout(() => {
            stickyContainer.classList.remove(out);
            stickyContainer.classList.add(enter);

            currentScene = scene;
            updateScene(scene, html);

            stickyContainer.offsetHeight;
            stickyContainer.classList.remove(enter);
            textOverlay.classList.remove('fading-out');
        }, duration);

        t2 = setTimeout(() => {
            isAnimating = false;
            if (queuedScene && queuedScene !== currentScene) {
                const next = queuedScene;
                queuedScene = null;
                requestScene(next);
            }
        }, duration * 2);
    };

    const requestScene = scene => {
        if (scene === currentScene) return;
        if (isAnimating) {
            queuedScene = scene;
            return;
        }
        const html = getSceneContent(scene);
        if (html) transitionScene(scene, scene > currentScene, html);
    };

    const getDesiredScene = () => {
        let scene = 1;
        triggerSections.forEach((sec, i) => {
            if (sec.getBoundingClientRect().top <= window.innerHeight * 0.5) {
                scene = i + 2;
            }
        });
        return scene;
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            requestScene(getDesiredScene());
            ticking = false;
        });
    }, { passive: true });

    /* ----------------------------------------------------
     * Hamburger Menu
     * -------------------------------------------------- */

    document.addEventListener('click', e => {
        const btn = e.target.closest('#hamburgerbutton');
        if (!btn) return;

        document.querySelector('.sidebar')?.classList.toggle('active');
        document.getElementById('hamburgerlinks')?.classList.toggle('active');
        btn.classList.toggle('active');
    });

    /* ----------------------------------------------------
     * Header Link Hover Sync
     * -------------------------------------------------- */

    const addHover = el => el.classList.add('is-hovered');
    const removeHover = el => setTimeout(() => el.classList.remove('is-hovered'), 1);

    document.querySelectorAll('.homeheaderlinks a').forEach(link => {
        const bg = document.querySelector(`.bg-link[href="${link.getAttribute('href')}"]`);
        if (!bg) return;

        link.addEventListener('mouseenter', () => addHover(bg));
        link.addEventListener('mouseleave', () => removeHover(bg));
    });

    document.querySelectorAll('.bg-link').forEach(bg => {
        bg.addEventListener('touchstart', () => addHover(bg));
        bg.addEventListener('touchend', () => removeHover(bg));
        bg.addEventListener('touchcancel', () => removeHover(bg));
    });

    /* ----------------------------------------------------
     * Header blink
     * -------------------------------------------------- */

    const title = document.getElementById("site-title");
    const cursor = title.querySelector(".cursor");
    const html = title.dataset.typed;
    const visited = sessionStorage.getItem("homeVisited");

    if (visited) {
        title.innerHTML = html;
    } else {
        sessionStorage.setItem("homeVisited", "true");
        setTimeout(() => {
        typeHTML(title, html, 160, cursor);
        }, 1000);
    }

    function typeHTML(element, html, speed, cursor) {
        const temp = document.createElement("div");
        temp.innerHTML = html;
        const nodes = Array.from(temp.childNodes);

        element.innerHTML = "";
        element.appendChild(cursor);

        let nodeIndex = 0;

        function typeNode(node, done) {
        if (node.nodeType === Node.TEXT_NODE) {
            let i = 0;
            const textNode = document.createTextNode("");
            element.insertBefore(textNode, cursor);

            const interval = setInterval(() => {
            textNode.textContent += node.textContent[i++];
            if (i >= node.textContent.length) {
                clearInterval(interval);
                done();
            }
            }, speed);
        } else {
            const clone = node.cloneNode(false);
            element.insertBefore(clone, cursor);

            const children = Array.from(node.childNodes);
            let i = 0;

            function nextChild() {
            if (i < children.length) {
                typeNodeInto(children[i++], clone, nextChild);
            } else {
                done();
            }
            }
            nextChild();
        }
        }

        function typeNodeInto(node, parent, done) {
        let i = 0;
        const textNode = document.createTextNode("");
        parent.appendChild(textNode);

        const interval = setInterval(() => {
            textNode.textContent += node.textContent[i++];
            if (i >= node.textContent.length) {
            clearInterval(interval);
            done();
            }
        }, speed);
        }

        function proceed() {
        if (++nodeIndex < nodes.length) {
            typeNode(nodes[nodeIndex], proceed);
        } else {
            cursor.remove(); 
        }
        }

        typeNode(nodes[nodeIndex], proceed);
    }


    /* ------------------------
    Scramble reveal 
    ------------------------ */
    const CHAR_INTERVAL = 40;   
    const SCRAMBLE_FRAMES = 2;  
    const RANDOM_CHARS = "±!@£$%^&*()§€#[];':<>?,./";
  
    document.querySelectorAll(".bg-link span.scramble").forEach(panel => {
    if (!panel.dataset.original) panel.dataset.original = panel.textContent;
    });

    const triggers = [];

    document.querySelectorAll(".bg-link span.scramble").forEach(panel => {
    const trigger = panel.closest(".bg-link");
    if (trigger) triggers.push({ trigger, panel });
    });

    document.querySelectorAll(".homeheaderlinks a").forEach(link => {
    const href = link.getAttribute("href");
    const panel = document.querySelector(`.bg-link[href="${href}"] span.scramble`);
    if (panel) triggers.push({ trigger: link, panel });
    });

    triggers.forEach(({ trigger, panel }) => {
    let timers = [];   
    let intervals = [];

    const startScramble = () => {
        if (!panel.classList.contains("scrambling")) revealScramble(panel, timers, intervals);
    };

    const stopScramble = () => {
        timers.forEach(t => clearTimeout(t));
        intervals.forEach(i => clearInterval(i));
        timers.length = 0;
        intervals.length = 0;
        panel.textContent = panel.dataset.original;
        panel.classList.remove("scrambling");
    };

    trigger.addEventListener("mouseenter", startScramble);
    trigger.addEventListener("mouseleave", stopScramble);

    trigger.addEventListener("touchstart", startScramble, { passive: true });
    trigger.addEventListener("touchend", stopScramble);
    trigger.addEventListener("touchcancel", stopScramble);
    });

    function revealScramble(el, timers, intervals) {
    el.classList.add("scrambling");

    const original = el.dataset.original;
    const chars = original.split("");
    const length = chars.length;

    let revealed = Array.from(chars, c => (c === " " ? " " : ""));
    el.textContent = revealed.join("");

    let index = 0;

    function revealNext() {
        if (index >= length) {
        el.classList.remove("scrambling");
        return;
        }

        if (chars[index] === " ") {
        index++;
        const t = setTimeout(revealNext, CHAR_INTERVAL);
        timers.push(t);
        return;
        }

        let frame = 0;

        const scramble = setInterval(() => {
        revealed[index] =
            frame < SCRAMBLE_FRAMES
            ? RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)]
            : chars[index];

        el.textContent = revealed.join("");
        frame++;

        if (frame > SCRAMBLE_FRAMES) {
            clearInterval(scramble);
            const iIndex = intervals.indexOf(scramble);
            if (iIndex > -1) intervals.splice(iIndex, 1);

            index++;
            const t = setTimeout(revealNext, CHAR_INTERVAL);
            timers.push(t);
        }
        }, 30);

        intervals.push(scramble);
    }

    revealNext();
    }
});

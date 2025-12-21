document.addEventListener('DOMContentLoaded', () => {

    function loadHTML(url, elementId, callback) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = html;
                    // Run the callback if it exists
                    if (callback) callback();
                }
            })
            .catch(error => console.error('Error loading content:', error));
    }
    // ----------------------------------------------------
    // Light/Dark mode
    // ----------------------------------------------------
    function initTheme() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;

        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        toggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }


    
    // ----------------------------------------------------
    // START: Layout and Footer Loading Handlers 
    // ----------------------------------------------------
    loadHTML("/layouts/header.html", "header-placeholder",initTheme);
    loadHTML('/layouts/sidebar.html', 'sidebar-placeholder');
    loadHTML('/layouts/footnote.html', 'footnote-placeholder');
    
    function enumerateListItems(listSelector) {
        const items = document.querySelectorAll(listSelector);
        const totalItems = items.length;

        if (totalItems === 0) {
            return;
        }

        items.forEach((item, index) => {
            const reversedNumber = totalItems - index;
            const numberSpan = item.querySelector('.list-number');

            if (numberSpan) {
                numberSpan.textContent = reversedNumber + '.';
            }
        });
    }

    const collapseds = document.querySelectorAll('.collapsed-header');
    
    collapseds.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling; 

            header.classList.toggle('active');
            const isExpanded = header.classList.contains('active');
            header.setAttribute('aria-expanded', isExpanded); 

            content.classList.toggle('collapsed');

            if (isExpanded) {
                setTimeout(() => {
                    content.style.maxHeight = content.scrollHeight + "px";
                }, 5); 
            } else {
                
                content.style.maxHeight = content.scrollHeight + "px"; 
                requestAnimationFrame(() => {
                    content.style.maxHeight = null; 
                });
            }

            const parentGroup = header.closest('.publication-group');
            if (parentGroup && parentGroup.id === 'publications-Articles' && isExpanded) {
                setTimeout(() => {
                    parentGroup.style.maxHeight = parentGroup.scrollHeight + "px";
                }, 100); 
            }
        });
   

        enumerateListItems('#publication-list li');
        enumerateListItems('#book-chapters-list li');
        enumerateListItems('#patents-list li');
    });

    const stickyContainer = document.getElementById('sticky-container');
    const textOverlay = document.getElementById('text-overlay');
    const dynamicContentContainer = document.getElementById('dynamic-content-container');

    const triggerSections = Array.from(document.querySelectorAll('.trigger-section'));
    const images = document.querySelectorAll('#image-display img');

    const initialContentNode = dynamicContentContainer.querySelector('.dynamic-content-swap');
    const originalScene1Content = initialContentNode ? initialContentNode.innerHTML : '';

    let currentScene = 1;
    let isAnimating = false;
    let queuedScene = null;

    let transitionTimeout1;
    let transitionTimeout2;

    function getSceneContent(scene) {
        if (scene === 1) return originalScene1Content;

        const trigger = triggerSections[scene - 2];
        if (!trigger) return '';

        const node = trigger.querySelector('.dynamic-content-swap');
        return node ? node.innerHTML : '';
    }

    function updateContent(scene, contentHTML) {
        dynamicContentContainer.innerHTML =
            `<div class="dynamic-content-swap">${contentHTML}</div>`;

        images.forEach(img => img.classList.remove('active', 'zoom-out-blur'));

        const newImage = document.getElementById(`image-${scene}`);
        if (newImage) newImage.classList.add('active');
    }

    function transitionScene(newScene, isScrollingDown, contentHTML) {
        if (newScene === currentScene) return;

        clearTimeout(transitionTimeout1);
        clearTimeout(transitionTimeout2);

        isAnimating = true;

        const slideOutClass = isScrollingDown ? 'slide-out-left' : 'slide-out-right';
        const preEnterClass = isScrollingDown ? 'pre-enter-left' : 'pre-enter-right';
        const duration = 1200;

        stickyContainer.classList.remove(
            'slide-out-left',
            'slide-out-right',
            'pre-enter-left',
            'pre-enter-right'
        );

        stickyContainer.classList.add(slideOutClass);
        textOverlay.classList.add('fading-out');

        transitionTimeout1 = setTimeout(() => {
            stickyContainer.classList.remove(slideOutClass);
            stickyContainer.classList.add(preEnterClass);

            currentScene = newScene;
            updateContent(newScene, contentHTML);

            stickyContainer.offsetHeight; 

            stickyContainer.classList.remove(preEnterClass);
            textOverlay.classList.remove('fading-out');
        }, duration);

        transitionTimeout2 = setTimeout(() => {
            isAnimating = false;

            if (queuedScene && queuedScene !== currentScene) {
                const target = queuedScene;
                queuedScene = null;
                requestSceneChange(target);
            }
        }, duration * 2);
    }

    function requestSceneChange(targetScene) {
        if (targetScene === currentScene) return;

        if (isAnimating) {
            queuedScene = targetScene;
            return;
        }

        const isScrollingDown = targetScene > currentScene;
        const contentHTML = getSceneContent(targetScene);

        if (contentHTML) {
            transitionScene(targetScene, isScrollingDown, contentHTML);
        }
    }

    function getDesiredScene() {
        let scene = 1;

        triggerSections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.5) {
                scene = index + 2;
            }
        });

        return scene;
    }

    let ticking = false;

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const desiredScene = getDesiredScene();
                requestSceneChange(desiredScene);
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
});

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('#hamburgerbutton');
        if (!menuBtn) return;

        const sidebar = document.querySelector('.sidebar');
        const navLinks = document.getElementById('hamburgerlinks');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
        if (navLinks) {
            navLinks.classList.toggle('active');
        }
        menuBtn.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.homeheaderlinks a').forEach(headerLink => {
        const href = headerLink.getAttribute('href');
        const bgLink = document.querySelector('.bg-link[href="' + href + '"]');

        if (!bgLink) return;

        headerLink.addEventListener('mouseenter', () => {
            bgLink.classList.add('is-hovered');
        });

        headerLink.addEventListener('mouseleave', () => {
            bgLink.classList.remove('is-hovered');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const bgLinks = document.querySelectorAll('.bg-link');

    bgLinks.forEach(bgLink => {
        bgLink.addEventListener('touchstart', () => {
            bgLink.classList.add('is-hovered');
        });

        bgLink.addEventListener('touchend', () => {
            bgLink.classList.remove('is-hovered');
        });
    });
});


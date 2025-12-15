document.addEventListener('DOMContentLoaded', () => {

    function loadHTML(url, elementId) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = html;
                }
            })
            .catch(error => console.error('Error loading content:', error));
    }
    
    // ----------------------------------------------------
    // START: Layout and Footer Loading Handlers 
    // ----------------------------------------------------
    loadHTML('/layouts/head.html','head-placeholder');
    loadHTML('/layouts/header.html', 'header-placeholder');
    loadHTML('/layouts/sidebar.html', 'sidebar-placeholder');
    loadHTML('/layouts/footnote.html', 'footnote-placeholder');

    const articleItems = document.querySelectorAll('#publication-list .publication-group li');
    const totalArticleItems = articleItems.length;

    articleItems.forEach((item, index) => {
        const reversedNumber = totalArticleItems - index;

        const numberSpan = item.querySelector('.list-number');

        if (numberSpan) {
            numberSpan.textContent = reversedNumber + '.';
        }
    });

    const bookChapterItems = document.querySelectorAll('#book-chapters-list li');
    const totalBookChapterItems = bookChapterItems.length;
    
    if (totalBookChapterItems > 0) {
        bookChapterItems.forEach((item, index) => {
            const reversedNumber = totalBookChapterItems - index;
            const numberSpan = item.querySelector('.list-number');
            if (numberSpan) {
                numberSpan.textContent = reversedNumber + '.';
            }
        });
    }

    const patentItems = document.querySelectorAll('#patents-list li');
    const totalPatentItems = patentItems.length;
    
    if (totalPatentItems > 0) {
        patentItems.forEach((item, index) => {
            const reversedNumber = totalPatentItems - index; 

            const numberSpan = item.querySelector('.list-number');

            if (numberSpan) {
                numberSpan.textContent = reversedNumber + '.';
            }
        });
    }

    const triggers = document.querySelectorAll('.collapsed-header');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            
            const targetId = trigger.getAttribute('data-year');
            const targetGroup = document.getElementById(targetId);

            if (targetGroup) {
                targetGroup.classList.toggle('collapsed');

                trigger.classList.toggle('active');

                const isExpanded = !targetGroup.classList.contains('collapsed');
                trigger.setAttribute('aria-expanded', isExpanded);
            }
        });
    });
    // ----------------------------------------------------
    // collapsed Section Handlers 
    // ----------------------------------------------------
    const collapseds = document.querySelectorAll('.collapsed-header');
    collapseds.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('active');
            content.classList.toggle('collapsed');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                const parentGroup = header.closest('.publication-group');
                if (parentGroup && parentGroup.id === 'publications-Articles') {
                const parentHeader = document.querySelector(`[data-year='${parentGroup.id}']`);
                
                    if (parentHeader && parentHeader.classList.contains('active')) {
                        
                        setTimeout(() => {
                            const newParentHeight = parentGroup.scrollHeight;
                            parentGroup.style.maxHeight = newParentHeight + "px";
                        }, 50); 
                    }
                } 
            }
        });
    });

    // ----------------------------------------------------
    // Scroll-Triggered Layout Handler
    // ----------------------------------------------------
    const stickyContainer = document.getElementById('sticky-container');
    const textOverlay = document.getElementById('text-overlay');
    const dynamicContentContainer = document.getElementById('dynamic-content-container');
    
    const initialContentNode = dynamicContentContainer.querySelector('.dynamic-content-swap');
    const originalScene1Content = initialContentNode ? initialContentNode.innerHTML : '';
    
    const triggerSections = document.querySelectorAll('.trigger-section');
    const images = document.querySelectorAll('#image-display img');

    let currentScene = 1;
    let isAnimating = false; 
    let lastScrollY = window.scrollY; 

    const updateContent = (newScene, contentHTML) => {
        dynamicContentContainer.innerHTML = `<div class="dynamic-content-swap">${contentHTML}</div>`;

        images.forEach(img => img.classList.remove('active', 'zoom-out-blur'));
        
        const newImage = document.getElementById(`image-${newScene}`);
        if (newImage) {
            newImage.classList.add('active');
        }
    };

    const transitionScene = (newScene, isScrollingDown, contentHTML) => {
        if (isAnimating || newScene === currentScene) return;

        isAnimating = true;
        const oldScene = currentScene;
        currentScene = newScene;

        const slideOutClass = isScrollingDown
            ? 'slide-out-left'
            : 'slide-out-right';

        const preEnterClass = isScrollingDown
            ? 'pre-enter-left'
            : 'pre-enter-right';

        stickyContainer.classList.add(slideOutClass);
        textOverlay.classList.add('fading-out');

        const duration = 1200;

        setTimeout(() => {
            stickyContainer.classList.remove(slideOutClass);
            stickyContainer.classList.add(preEnterClass);

            updateContent(newScene, contentHTML);

            stickyContainer.offsetHeight;

            stickyContainer.classList.remove(preEnterClass);
            textOverlay.classList.remove('fading-out');

        }, duration);

        setTimeout(() => {
            isAnimating = false;
        }, duration * 2);
    };


    const observerCallback = (entries, observer) => {
        const isScrollingDown = window.scrollY > lastScrollY;
        lastScrollY = window.scrollY; 

        entries.forEach(entry => {
            const triggerIndex = Array.from(triggerSections).indexOf(entry.target);
            
            const currentTriggerScene = triggerIndex + 2;
            const previousScene = triggerIndex + 1;

            if (isAnimating) {
                return; 
            }
            if (isScrollingDown && entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                
                if (currentTriggerScene === currentScene + 1) {
                    const contentNode = entry.target.querySelector('.dynamic-content-swap');
                    transitionScene(currentTriggerScene, true, contentNode.innerHTML);
                }
            } 
            
            if (!isScrollingDown && entry.isIntersecting && entry.intersectionRatio < 0.5) {
                
                if (currentTriggerScene === currentScene) {
                    
                    let targetScene = previousScene;
                    let targetContentHTML = '';
                    
                    if (targetScene === 1) {
                        targetContentHTML = originalScene1Content;
                    } else {
                        const prevTrigger = triggerSections[triggerIndex - 1];
                        if (prevTrigger) {
                            targetContentHTML = prevTrigger.querySelector('.dynamic-content-swap').innerHTML;
                        }
                    }
                    
                    if (targetContentHTML && targetScene > 0) {
                        transitionScene(targetScene, false, targetContentHTML);
                    }
                }
            }
        });
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.5, 1.0] 
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    triggerSections.forEach(section => {
        observer.observe(section);
    });
    
});
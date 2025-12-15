document.addEventListener('DOMContentLoaded', () => {

    // Helper function to load HTML content via Fetch
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

    // ----------------------------------------------------
    // List Numbering Handlers (Left unchanged)
    // ----------------------------------------------------
    const articleItems = document.querySelectorAll('#publication-list .publication-group li');
    const totalArticleItems = articleItems.length;

    articleItems.forEach((item, index) => {
        const reversedNumber = totalArticleItems - index;
        const numberSpan = item.querySelector('.list-number');
        if (numberSpan) {
            numberSpan.textContent = reversedNumber + '.';
        }
    });

    const bookChapterItems = document.querySelectorAll('#book-chaptors-list li');
    const totalBookChapterItems = bookChapterItems.length;

    bookChapterItems.forEach((item, index) => {
        const reversedNumber = totalBookChapterItems - index;
        const numberSpan = item.querySelector('.list-number');
        if (numberSpan) {
            numberSpan.textContent = reversedNumber + '.';
        }
    });

    // ----------------------------------------------------
    // collapsed Section Handlers (Left unchanged)
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
    // Scroll-Triggered Layout Handler (Corrected)
    // ----------------------------------------------------
    const stickyContainer = document.getElementById('sticky-container');
    const textOverlay = document.getElementById('text-overlay');
    const dynamicContentContainer = document.getElementById('dynamic-content-container');
    
    const initialContentNode = dynamicContentContainer.querySelector('.dynamic-content-swap');
    const originalScene1Content = initialContentNode ? initialContentNode.innerHTML : '';
    
    const triggerSections = document.querySelectorAll('.trigger-section');
    const images = document.querySelectorAll('#image-display img');

    // State variables
    let currentScene = 1;
    let isAnimating = false;

    const updateContent = (newScene, contentHTML) => {
        dynamicContentContainer.innerHTML = `<div class="dynamic-content-swap">${contentHTML}</div>`;

        images.forEach(img => img.classList.remove('active', 'zoom-out-blur'));
        
        const newImage = document.getElementById(`image-${newScene}`);
        if (newImage) {
            newImage.classList.add('active');
        }
    };

    // Corrected Transition Function: Ensures isAnimating is true for the full duration
    const transitionScene = (newScene, isScrollingDown, contentHTML) => {
        // Prevent re-entry while animating or if trying to transition to the current scene
        if (isAnimating || newScene === currentScene) {
            return;
        }

        isAnimating = true;
        const oldScene = currentScene;
        currentScene = newScene; // State update is immediate

        const isOldImageRight = oldScene % 2 === 0;
        const isNewImageRight = newScene % 2 === 0;

        let slideOutClass = isOldImageRight ? 'slide-right' : 'slide-left';

        // 1. Setup old layout and trigger slide-out
        if (isOldImageRight) {
            stickyContainer.classList.add('image-right');
        } else {
            stickyContainer.classList.remove('image-right');
        }

        stickyContainer.classList.add(slideOutClass);
        textOverlay.classList.add('fading-out');

        // Total transition time = Slide-Out (1200ms) + Slide-In (1200ms)
        const transitionDuration = 1200; // Assuming 1200ms (1.2s) from CSS

        setTimeout(() => {
            // 2. Content Swap and Layout change while off-screen (after slide-out)
            
            // Set the new layout class
            if (isNewImageRight) {
                stickyContainer.classList.add('image-right');
            } else {
                stickyContainer.classList.remove('image-right');
            }
            
            updateContent(newScene, contentHTML);
            
            // 3. Trigger Slide-In
            // Remove the slide-out class. This triggers the 1.2s transition back to the center.
            stickyContainer.classList.remove(slideOutClass);
            textOverlay.classList.remove('fading-out');

            // NOTE: No nested setTimeout here. The slide-in transition starts now.
            
        }, transitionDuration); // Wait for Slide-Out to finish

        // 4. Reset isAnimating after the total animation duration has completed.
        setTimeout(() => {
            isAnimating = false;
        }, transitionDuration * 2); // Wait 2400ms (1.2s + 1.2s) from the start.
    };

    // Corrected Intersection Observer Callback: Uses the 0.5 threshold for both directions
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            const triggerIndex = Array.from(triggerSections).indexOf(entry.target);
            
            const nextScene = triggerIndex + 2; 
            const prevScene = triggerIndex + 1; 

            // If a transition is running, ignore new events to prevent jumps.
            if (isAnimating) {
                return; 
            }

            // --- SCROLLING DOWN (Transition to nextScene) ---
            // Condition: Entering the bottom half of the trigger (0.5 threshold met or passed)
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                // Only transition if we are trying to enter a scene ahead of the current one.
                if (nextScene > currentScene) {
                    const contentNode = entry.target.querySelector('.dynamic-content-swap');
                    transitionScene(nextScene, true, contentNode.innerHTML);
                }
            } 
            
            // --- SCROLLING UP (Transition to prevScene) ---
            // Condition: The current scene's trigger section is scrolling up and falling 
            // below the 0.5 threshold.
            if (entry.isIntersecting && entry.intersectionRatio < 0.5) {
                // Only transition if the scene we are leaving is the current active scene.
                if (nextScene === currentScene) {
                    
                    let targetScene = prevScene;
                    let targetContentHTML = '';
                    
                    if (targetScene === 1) {
                        targetContentHTML = originalScene1Content;
                    } else {
                        // Get content from the *previous* trigger section (index - 1)
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

    // Intersection Observer Setup
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        // Monitor crossing 0%, 50%, and 100%
        threshold: [0, 0.5, 1.0] 
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    triggerSections.forEach(section => {
        observer.observe(section);
    });
});
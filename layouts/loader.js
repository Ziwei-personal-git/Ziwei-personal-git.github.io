function loadHTML(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
        })
        .catch(error => console.error('Error loading content:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // START: Layout and Footer Loading Handlers
    // ----------------------------------------------------
    loadHTML('/layouts/head.html','head-placeholder');
    loadHTML('/layouts/header.html', 'header-placeholder');
    loadHTML('/layouts/sidebar.html', 'sidebar-placeholder');
    loadHTML('/layouts/footnote.html', 'footnote-placeholder');

    // ----------------------------------------------------
    // START: List Numbering Handlers
    // ----------------------------------------------------
    // Article number counting
    const articleItems = document.querySelectorAll('#publication-list .publication-group li');
    const totalArticleItems = articleItems.length;

    articleItems.forEach((item, index) => {
        const reversedNumber = totalArticleItems - index;
        const numberSpan = item.querySelector('.list-number');
        if (numberSpan) {
            numberSpan.textContent = reversedNumber + '.';
        }
    });

    // Books number counting
    const bookChapterItems = document.querySelectorAll('#book-chaptors-list li');
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

    // Patents number counting
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

    // ----------------------------------------------------
    // START: Collapsible Section Handlers
    // ----------------------------------------------------
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
    // START: Scroll-Triggered Layout Handler
    // ----------------------------------------------------
    const stickyContainer = document.getElementById('sticky-container');
    const imageDisplay = document.getElementById('image-display');
    const images = imageDisplay.querySelectorAll('img');
    const textOverlay = document.getElementById('text-overlay');
    const triggerSections = document.querySelectorAll('.trigger-section');

    const options = {
        root: null,
        rootMargin: '0px 0px -50% 0px', 
        threshold: 0
    };
    const transitionDuration = 500;
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetElement = entry.target;
                const targetImageId = targetElement.dataset.image;
                const targetSide = targetElement.dataset.side;

                if (targetSide === 'right') {
                    stickyContainer.classList.add('image-right');
                } else {
                    stickyContainer.classList.remove('image-right');
                }
                textOverlay.classList.add('fading-out');

                setTimeout(() =>{
                    if (targetSide === 'full') {
                        stickyContainer.classList.add('full-width');
                        stickyContainer.classList.remove('image-right'); 
                        
                        if (textOverlay) {
                            textOverlay.innerHTML = ''; 
                        }
                    } else {
                        stickyContainer.classList.remove('full-width');
                        
                        if (targetSide === 'right') {
                            stickyContainer.classList.add('image-right');
                        } else {
                            stickyContainer.classList.remove('image-right');
                        }
                        
                        if (textOverlay) {
                            textOverlay.innerHTML = targetElement.innerHTML;
                        }
                    }
                    
                    images.forEach(img => img.classList.remove('active'));

                    const newActiveImage = document.getElementById(`image-${targetImageId}`);
                    if (newActiveImage) {
                        newActiveImage.classList.add('active');
                    }

                    if (textOverlay) {
                        setTimeout(() => {
                            textOverlay.classList.remove('fading-out');
                        }, 10);
                    }
                    
                }, transitionDuration); 
            }
        });
    }, options);

    // Start observing all six trigger sections
    triggerSections.forEach(section => {
        observer.observe(section);
    });
});
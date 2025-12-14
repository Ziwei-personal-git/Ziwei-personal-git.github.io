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
    const initialTextContent = textOverlay.innerHTML;
    const triggerSections = document.querySelectorAll('.trigger-section');

    let currentActiveSection = null; 

    const options = {
        root: null,
        rootMargin: '0px 0px -50% 0px', 
        threshold: 0
    };
    
    const applyState = (targetElement) => {
        const targetImageId = targetElement.dataset.image;
        const targetSide = targetElement.dataset.side;

        if (targetSide === 'right') {
            stickyContainer.classList.add('image-right');
        } else {
            stickyContainer.classList.remove('image-right');
        }
        
        textOverlay.classList.add('fading-out');

        setTimeout(() => {
            textOverlay.innerHTML = targetElement.innerHTML;
            
            images.forEach(img => img.classList.remove('active'));
            const newActiveImage = document.getElementById(`image-${targetImageId}`);
            if (newActiveImage) {
                newActiveImage.classList.add('active');
            }
            
            setTimeout(() => {
                textOverlay.classList.remove('fading-out');
            }, 10);
        }, 500);
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const targetElement = entry.target;

            if (entry.isIntersecting) {
                applyState(targetElement);
                currentActiveSection = targetElement;
            } else {
                if (targetElement.dataset.image === "2" && targetElement === currentActiveSection) {
                    
                    images.forEach(img => img.classList.remove('active'));
                    const initialImage = document.getElementById('image-1');
                    if (initialImage) {
                        initialImage.classList.add('active');
                    }
                    
                    textOverlay.classList.add('fading-out');
                    setTimeout(() => {
                        textOverlay.innerHTML = initialTextContent; 
                        setTimeout(() => {
                            textOverlay.classList.remove('fading-out');
                        }, 10);
                    }, 500);

                    currentActiveSection = null; 
                    stickyContainer.classList.remove('image-right'); 
                }
            }
        });
    }, options);

    triggerSections.forEach(section => {
        observer.observe(section);
    });
});


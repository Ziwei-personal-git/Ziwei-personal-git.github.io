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
    // List Numbering Handlers
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
    // Collapsible Section Handlers
    // ----------------------------------------------------
    const collapsibles = document.querySelectorAll('.collapsible-header');
    collapsibles.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('active');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            } 
        });
    });
    
    // ----------------------------------------------------
    // Scroll-Triggered Layout Handler
    // ----------------------------------------------------
    const stickyContainer = document.getElementById('sticky-container');
    const imageDisplay = document.getElementById('image-display');
    const images = imageDisplay.querySelectorAll('img');
    const textOverlay = document.getElementById('text-overlay');
    
    const initialTextContent = textOverlay.innerHTML; 
    
    const triggerSections = document.querySelectorAll('.trigger-section');

    let currentActiveSection = null; 
    let activeImage = document.getElementById('image-1'); 
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
                activeImage = newActiveImage; 
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
                        activeImage = initialImage;
                        activeImage.style.transform = 'translateY(-7.5%)'; 
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

    // ----------------------------------------------------
    // Parallax Image Movement Handler
    // ----------------------------------------------------
    
    const parallaxScrollHandler = () => {
        if (!currentActiveSection) {
             if (activeImage) {
                activeImage.style.transform = 'translateY(-7.5%)'; 
             }
             return; 
        }

        const targetSection = currentActiveSection; 
        const rect = targetSection.getBoundingClientRect();
        const sectionHeight = targetSection.offsetHeight;
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + sectionHeight);
        const scrollProgress = Math.max(0, Math.min(1, progress));
        const totalMovement = 15; 
        const yMovement = (scrollProgress * totalMovement) * -1; 
        
        if (activeImage) {
            activeImage.style.transform = `translateY(${yMovement}%)`; 
        }
    };
    
    window.addEventListener('scroll', parallaxScrollHandler);
    
    parallaxScrollHandler();
});
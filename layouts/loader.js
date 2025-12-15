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
    // collapsed Section Handlers
    // ----------------------------------------------------
    const collapseds = document.querySelectorAll('.collapsed-header');
    collapseds.forEach(header => {
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
    const dynamicContentArea = document.getElementById('dynamic-content-container');
    const initialContent = document.querySelector('.dynamic-content-swap') ? 
                           document.querySelector('.dynamic-content-swap').innerHTML : '';

    const initialImageId = 'image-1';

    let currentImageElement = document.getElementById(initialImageId);
    let currentImageIndex = 1;
    
    if (currentImageElement) {
        currentImageElement.classList.add('active');
    }

    stickyContainer.classList.remove('slide-left', 'slide-right', 'image-right');

    const updateContentAndLayout = (targetIndex, targetContentHTML, shouldSlide) => {
        
        stickyContainer.classList.remove('slide-left', 'slide-right');

        const targetImageId = `image-${targetIndex}`;
        const targetImageElement = document.getElementById(targetImageId);
        
        if (currentImageElement) {
            currentImageElement.classList.remove('active');
        }

        const isImageRight = targetIndex % 2 === 0;
        
        if (isImageRight) {
            stickyContainer.classList.add('image-right');
        } else {
            stickyContainer.classList.remove('image-right');
        }
        
        if (shouldSlide) {
            const slideClass = isImageRight ? 'slide-right' : 'slide-left';
            stickyContainer.classList.add(slideClass);
        }
        
        setTimeout(() => {
            
            dynamicContentArea.innerHTML = `<div class="dynamic-content-swap">${targetContentHTML}</div>`;
            
            if (targetImageElement) {
                targetImageElement.classList.add('active');
                currentImageElement = targetImageElement;
            }
            currentImageIndex = targetIndex;
            currentContentHTML = targetContentHTML;

            if (shouldSlide) {
                setTimeout(() => {
                    stickyContainer.classList.remove('slide-left', 'slide-right');
                }, 50); 
            }
        }, shouldSlide ? 500 : 0); 
    };

    const triggerSections = document.querySelectorAll('.trigger-section');
    const options = {
        root: null,
        rootMargin: '0px 0px -50% 0px', 
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const targetElement = entry.target;
            const targetIndex = parseInt(targetElement.dataset.image);
            const targetContent = targetElement.querySelector('.dynamic-content-swap').innerHTML;

            if (entry.isIntersecting && targetIndex !== currentImageIndex) {
                updateContentAndLayout(targetIndex, targetContent, true);
            }
            else if (!entry.isIntersecting && targetIndex === 2 && entry.boundingClientRect.top > 0 && currentImageIndex !== 1) {
                const initialImageContent = document.querySelector('#text-overlay .dynamic-content-swap').innerHTML;
                updateContentAndLayout(1, initialImageContent, false);
                stickyContainer.classList.remove('image-right');
            }
        });
    }, options);
    triggerSections.forEach(section => {
        observer.observe(section);
    });

    // --------------------------------
    // Parallax Image Movement Handler 
    // --------------------------------
    
    const parallaxScrollHandler = () => {
        
        const scrollContainer = document.querySelector('.scroll-container');
        if (!scrollContainer || !activeImage) return;
        
        const scrollContainerRect = scrollContainer.getBoundingClientRect();
        const containerHeight = scrollContainer.offsetHeight;
        const windowHeight = window.innerHeight;
        
        const currentScroll = -scrollContainerRect.top;
        const totalScrollLength = containerHeight - windowHeight;
        
        const scrollProgress = Math.min(1, Math.max(0, currentScroll / (totalScrollLength)));
        
        const yMovement = 0;
        const zoomScale = 1 + (scrollProgress * 0.1);
        
        activeImage.style.transform = `translateY(${yMovement}%) scale(${zoomScale})`;
    };
    
    window.addEventListener('scroll', parallaxScrollHandler);
    
    parallaxScrollHandler();
});
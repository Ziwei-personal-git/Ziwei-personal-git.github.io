function loadHTML(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
        })
        .catch(error => console.error('Error loading content:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    loadHTML('/layouts/head.html','head-placeholder');
    loadHTML('/layouts/header.html', 'header-placeholder');
    loadHTML('/layouts/sidebar.html', 'sidebar-placeholder');
    loadHTML('/layouts/footnote.html', 'footnote-placeholder');

    //Article number counting
    const articleItems = document.querySelectorAll('#publication-list .publication-group li');
    const totalArticleItems = articleItems.length;

    articleItems.forEach((item, index) => {
        const reversedNumber = totalArticleItems - index;

        const numberSpan = item.querySelector('.list-number');

        if (numberSpan) {
            numberSpan.textContent = reversedNumber + '.';
        }
    });

    //Books number counting
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

    //Patents number counting
    const patentItems = document.querySelectorAll('#patents-list li');
    const totalPatentItems = patentItems.length;
    
    // Check if there are patents before looping (optional, but good practice)
    if (totalPatentItems > 0) {
        patentItems.forEach((item, index) => {
            const reversedNumber = totalPatentItems - index; // Starts patent numbering from the patent total

            const numberSpan = item.querySelector('.list-number');

            if (numberSpan) {
                numberSpan.textContent = reversedNumber + '.';
            }
        });
    }

    const triggers = document.querySelectorAll('.collapsed-header');

    triggers.forEach(trigger => {
        // Add a click listener to each year separator
        trigger.addEventListener('click', () => {
            
            // Get the ID of the content div (e.g., "pub-group-2025")
            const targetId = trigger.getAttribute('data-year');
            const targetGroup = document.getElementById(targetId);

            if (targetGroup) {
                // 1. Toggle the 'collapsed' class on the content group (shows/hides the content)
                targetGroup.classList.toggle('collapsed');

                // 2. Toggle the 'active' class on the trigger (changes the icon/styling)
                trigger.classList.toggle('active');

                // 3. Accessibility improvement (tells screen readers the state)
                const isExpanded = !targetGroup.classList.contains('collapsed');
                trigger.setAttribute('aria-expanded', isExpanded);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const stickyContainer = document.getElementById('sticky-container');
    const imageDisplay = document.getElementById('image-display');
    const images = imageDisplay.querySelectorAll('img');
    const textOverlay = document.getElementById('text-overlay');
    const triggerSections = document.querySelectorAll('.trigger-section');

    const options = {
        root: null, // relative to the viewport
        rootMargin: '0px 0px -50% 0px', // Trigger when 50% of the element is past the top
        threshold: 0
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetElement = entry.target;
                const targetImageId = targetElement.dataset.image;
                const targetSide = targetElement.dataset.side;

                // --- 1. HANDLE IMAGE SWAP ---
                // Deactivate all images
                images.forEach(img => img.classList.remove('active'));

                // Activate the new image
                const newActiveImage = document.getElementById(`image-${targetImageId}`);
                if (newActiveImage) {
                    newActiveImage.classList.add('active');
                }

                // --- 2. HANDLE TEXT CONTENT UPDATE ---
                // Update the text in the overlay with the current trigger section's content
                textOverlay.innerHTML = targetElement.innerHTML;


                // --- 3. HANDLE LAYOUT FLIP (CSS CLASS) ---
                if (targetSide === 'right') {
                    // Image on the RIGHT (Text on the LEFT)
                    stickyContainer.classList.add('image-right');
                } else {
                    // Image on the LEFT (Default)
                    stickyContainer.classList.remove('image-right');
                }
            }
        });
    }, options);

    // Start observing all six trigger sections
    triggerSections.forEach(section => {
        observer.observe(section);
    });
});



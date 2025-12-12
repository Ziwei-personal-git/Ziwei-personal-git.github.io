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



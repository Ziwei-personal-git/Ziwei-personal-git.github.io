function loadHTML(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
        })
        .catch(error => console.error('Error loading content:', error));
}
// Add click listeners to all year headers
document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
        const year = header.getAttribute('data-year');
        toggleGroup(year);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadHTML('/layouts/head.html','head-placeholder');
    loadHTML('/layouts/header.html', 'header-placeholder');
    loadHTML('/layouts/sidebar.html', 'sidebar-placeholder');
    loadHTML('/layouts/footnote.html', 'footnote-placeholder');
    
    const listItems = document.querySelectorAll('.aligned-list li');
    const totalItems = listItems.length;

    listItems.forEach((item, index) => {
        const reversedNumber = totalItems - index;

        const numberSpan = item.querySelector('.list-number');

        if (numberSpan) {
            numberSpan.textContent = reversedNumber + '.';
        }
    });
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



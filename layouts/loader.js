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
    
    const listItems = document.querySelectorAll('.aligned-list li');
    const totalItems = listItems.length;

    listItems.forEach((item, index) => {
        const reversedNumber = totalItems - index;

        const numberSpan = item.querySelector('.list-number');

        if (numberSpan) {
            numberSpan.textContent = reversedNumber + '.';
        }
    });
});

// Function to toggle visibility
function toggleGroup(year) {
    const group = document.getElementById(`publications-${year}`);
    const header = document.querySelector(`[data-year="${year}"]`);
    
    group.classList.toggle('collapsed');
    header.classList.toggle('active'); // Change color/arrow on header
}

// Add click listeners to all year headers
document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
        const year = header.getAttribute('data-year');
        toggleGroup(year);
    });
});
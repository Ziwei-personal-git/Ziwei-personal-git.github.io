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
});
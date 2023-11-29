const currentPage = window.location.pathname;
const pageName = currentPage.slice(currentPage.lastIndexOf('/') + 1);

const links = document.querySelectorAll('.nav-link');

links.forEach(link => {
    const linkUrl = link.href.slice(link.href.lastIndexOf('/') + 1);
    if (linkUrl == pageName) {
        link.classList.add('active');
    }
});
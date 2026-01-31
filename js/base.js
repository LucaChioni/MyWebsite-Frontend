document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    e.preventDefault();
    document.body.classList.add("page-leave");
    setTimeout(() => { window.location.href = link.href; }, 100);
});

function showPage() {
    document.body.classList.remove("page-leave");
    document.body.classList.add("page-loaded");
}

window.addEventListener("load", showPage);
window.addEventListener("pageshow", showPage);

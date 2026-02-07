// set speaker image
export function setFace(face) {
    const faceImg = document.getElementById("faceImg");
    if (faceImg && face) faceImg.src = face;
}

// fade-in / fade-out
document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    e.preventDefault();
    if (!link || link.target === "_blank" || e.target.className == "disabled") return;

    document.body.classList.add("page-leave");
    setTimeout(() => { window.location.href = link.href; }, 100);
});
function showPage() {
    document.body.classList.remove("page-leave");
    document.body.classList.add("page-loaded");
}
window.addEventListener("load", showPage);
window.addEventListener("pageshow", showPage);

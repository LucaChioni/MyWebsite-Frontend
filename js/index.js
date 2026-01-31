const faceImg = document.getElementById("faceImg");
const wheel = document.getElementById("wheel");
const info_icon = document.getElementById("info_icon");

const DEFAULT_FACE = "/images/speaker/neutral.png";

function setFace(face) {
    if (faceImg && face) faceImg.src = face;
}

wheel.addEventListener("mouseover", (e) => {
    const link = e.target.closest("a[data-face]");
    if (!link) return;
    setFace(link.getAttribute("data-face"));
});

info_icon.addEventListener("mouseover", () => setFace(DEFAULT_FACE));

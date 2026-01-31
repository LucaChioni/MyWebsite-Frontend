const faceImg = document.getElementById("faceImg");
const secretAccess = document.getElementById("secretAccess");

const DEFAULT_FACE = "/images/speaker/suspicious.png";
const APATIC_FACE = "/images/speaker/apatic.png";

function setFace(face) {
    if (faceImg && face) faceImg.src = face;
}

secretAccess.addEventListener("mouseover", () => setFace(APATIC_FACE));
secretAccess.addEventListener("mouseleave", () => setFace(DEFAULT_FACE));

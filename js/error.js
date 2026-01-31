// set speaker image according to the selected answer
const secretAccess = document.getElementById("secretAccess");
secretAccess.addEventListener("mouseover", () => setFace(APATIC_FACE));
secretAccess.addEventListener("mouseleave", () => setFace(SUSPICIOUS_FACE));

// set default speaker image on load
window.addEventListener("load", () => setFace(SUSPICIOUS_FACE));
window.addEventListener("pageshow", () => setFace(SUSPICIOUS_FACE));

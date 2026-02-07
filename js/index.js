import "./base.js";
import { setFace } from "./base.js";
import "./i18n/index.js";

const NEUTRAL_FACE = "/images/speaker/neutral.png";

// set speaker image according to the selected wheel item
const wheel = document.getElementById("wheel");
const info_icon = document.getElementById("info_icon");
wheel.addEventListener("mouseover", (e) => {
    const link = e.target.closest("a[data-face]");
    if (!link) return;
    setFace(link.getAttribute("data-face"));
});
info_icon.addEventListener("mouseover", () => setFace(NEUTRAL_FACE));

// set default speaker image on load
window.addEventListener("load", () => setFace(NEUTRAL_FACE));
window.addEventListener("pageshow", () => setFace(NEUTRAL_FACE));

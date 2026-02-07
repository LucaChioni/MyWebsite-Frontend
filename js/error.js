import "./base.js";
import { setFace } from "./base.js";
import "./i18n/error.js";

const SUSPICIOUS_FACE = "/images/speaker/suspicious.png";
const APATIC_FACE = "/images/speaker/apatic.png";

// set speaker image according to the selected answer
const secretAccess = document.getElementById("secretAccess");
secretAccess.addEventListener("mouseover", () => setFace(APATIC_FACE));
secretAccess.addEventListener("mouseleave", () => setFace(SUSPICIOUS_FACE));

// set default speaker image on load
window.addEventListener("load", () => setFace(SUSPICIOUS_FACE));
window.addEventListener("pageshow", () => setFace(SUSPICIOUS_FACE));

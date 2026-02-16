import "../base.js";
import "../i18n/pages/school.js";

function setBgClass(bgClass) {
    document.body.classList.forEach(c => {
        if (c.startsWith("bg-")) document.body.classList.remove(c);
    });
    document.body.classList.add(bgClass);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) setBgClass(entry.target.dataset.bg);
    });
}, { threshold: 0 });

function observeTriggers(root = document) {
    root.querySelectorAll(".bg-trigger").forEach(t => {
        if (t.dataset.bgObserved === "1") return;
        t.dataset.bgObserved = "1";
        observer.observe(t);
    });
}

observeTriggers();
const mo = new MutationObserver(() => observeTriggers());
mo.observe(document.body, { childList: true, subtree: true });

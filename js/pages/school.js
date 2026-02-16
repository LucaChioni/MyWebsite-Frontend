import "../base.js";
import "../i18n/pages/school.js";

const triggers = document.querySelectorAll(".bg-trigger");

function setBgClass(bgClass) {
    document.body.classList.forEach(c => {
        if (c.startsWith("bg-")) document.body.classList.remove(c);
    });
    document.body.classList.add(bgClass);
}

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setBgClass(entry.target.dataset.bg);
            }
        });
    },
    { threshold: 0 }
);

triggers.forEach(t => observer.observe(t));

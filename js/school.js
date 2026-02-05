const triggers = document.querySelectorAll(".bg-trigger");
const bgCache = new Map();

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
    {
        threshold: 0.4
    }
);

triggers.forEach(t => observer.observe(t));

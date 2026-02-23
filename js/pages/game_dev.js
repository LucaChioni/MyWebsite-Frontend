import "../base.js";
import "../i18n/pages/game_dev.js";

const videoTrailer = document.getElementById("video-trailer-container");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && videoTrailer.innerHTML.length == 0) {
            observer.disconnect();
            videoTrailer.innerHTML = `
                <iframe
                    class="video-trailer"
                    src="https://www.youtube.com/embed/B9sSzcop8ao?si=-54yc-u5BrJICP-M"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen>
                </iframe>
            `;
        }
    });
}, { threshold: 0 });

function observeTriggers(root = document) {
    root.querySelectorAll(".vt-trigger").forEach(t => {
        if (t.dataset.bgObserved === "1") return;
        t.dataset.bgObserved = "1";
        observer.observe(t);
    });
}

observeTriggers();
const mo = new MutationObserver(() => observeTriggers());
mo.observe(document.body, { childList: true, subtree: true });

(() => {
  const STORAGE_KEY = "preferred_language";

  const MESSAGES = { it: {}, en: {} };

  function merge(target, src) {
    Object.keys(src || {}).forEach((k) => (target[k] = src[k]));
  }

  window.i18nRegister = function i18nRegister(newMsgs) {
    if (!newMsgs) return;
    if (newMsgs.it) merge(MESSAGES.it, newMsgs.it);
    if (newMsgs.en) merge(MESSAGES.en, newMsgs.en);
  };

  function getInitialLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "it" || saved === "en") return saved;
    const nav = (navigator.language || "it").toLowerCase();
    return nav.startsWith("en") ? "en" : "it";
  }

  function applyLang(lang) {
    const dict = MESSAGES[lang] || MESSAGES.it;

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.textContent = dict[key];
    });

    const currentBtn = document.querySelector("#langSwitcher .lang-current");
    const selected = document.querySelector(`#langSwitcher [data-lang="${lang}"]`);
    if (currentBtn && selected) currentBtn.innerHTML = selected.innerHTML;
  }

  window.setLang = function setLang(lang) {
    const safe = (lang === "it" || lang === "en") ? lang : "it";
    localStorage.setItem(STORAGE_KEY, safe);
    applyLang(safe);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const initial = getInitialLang();
    applyLang(initial);

    const switcher = document.getElementById("langSwitcher");
    if (!switcher) return;

    const currentBtn = switcher.querySelector(".lang-current");
    const menu = switcher.querySelector(".lang-menu");
    if (!currentBtn || !menu) return;

    currentBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = switcher.classList.toggle("open");
      currentBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    menu.querySelectorAll("[data-lang]").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        window.setLang(item.dataset.lang);
        switcher.classList.remove("open");
        currentBtn.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", () => {
      switcher.classList.remove("open");
      currentBtn.setAttribute("aria-expanded", "false");
    });
  });
})();

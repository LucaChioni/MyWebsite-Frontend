(() => {
  const STORAGE_KEY = "preferred_language";

  const MESSAGES = {
    it: {
      title_interests: "I miei interessi",
      subtitle_todo: "Li elencherò qua quando avrò tempo",
      email_label: "Email:",
      aria_back_home: "Torna alla pagina iniziale",
      aria_linkedin: "Profilo LinkedIn",
      aria_github: "Account GitHub",
      aria_steam: "Off to Sleep",
    },
    en: {
      title_interests: "My interests",
      subtitle_todo: "I'll list them here when I have time",
      email_label: "Email:",
      aria_back_home: "Back to home",
      aria_linkedin: "LinkedIn profile",
      aria_github: "GitHub account",
      aria_steam: "Off to Sleep",
    },
  };

  function getInitialLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && MESSAGES[saved]) return saved;

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

    const backHome = document.querySelector("a.back-home");
    if (backHome && dict.aria_back_home) backHome.setAttribute("aria-label", dict.aria_back_home);

    const linkedin = document.querySelector('a[href*="linkedin.com"]');
    if (linkedin && dict.aria_linkedin) linkedin.setAttribute("aria-label", dict.aria_linkedin);

    const github = document.querySelector('a[href*="github.com"]');
    if (github && dict.aria_github) github.setAttribute("aria-label", dict.aria_github);

    const steam = document.querySelector('a[href*="store.steampowered.com"]');
    if (steam && dict.aria_steam) steam.setAttribute("aria-label", dict.aria_steam);

    // aggiorna UI switcher (bandierina/testo) in base alla lingua attuale
    const currentBtn = document.querySelector("#langSwitcher .lang-current");
    const selected = document.querySelector(`#langSwitcher [data-lang="${lang}"]`);
    if (currentBtn && selected) currentBtn.innerHTML = selected.innerHTML;
  }

  // IMPORTANT: rendila visibile anche fuori (se mai ti serve in altri script)
  window.setLang = function setLang(lang) {
    const safe = MESSAGES[lang] ? lang : "it";
    localStorage.setItem(STORAGE_KEY, safe);
    applyLang(safe);
  };

  document.addEventListener("DOMContentLoaded", () => {
    // Applica lingua iniziale
    const initial = getInitialLang();
    applyLang(initial);

    // Setup switcher custom (se presente)
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

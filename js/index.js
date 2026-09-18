import "./base.js";
import { setFace } from "./base.js";
import "./i18n/index.js";
import { t } from "./i18n/core.js";

const NEUTRAL_FACE = "/images/speaker/neutral.png";
const GENERIC_TOPIC = "generic";
const THOUGHT_INTERVAL = 10 * 1000;
const MAX_HISTORY = 10; // messages sent to the backend (5 exchanges)

const wheel = document.getElementById("wheel");
const thought = document.getElementById("thought");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

// ===== Thoughts =====
// The text under the speaker always shows a thought about the last hovered topic
// (or a generic one), rotating every 10 seconds in list order. Once a prompt has been sent, the
// answer stays there until the page changes.
let topic = GENERIC_TOPIC;
let answered = false;
let thoughtTimer = null;
const thoughtIndex = {}; // per-topic position in the list

function pickThought(forTopic) {
    const list = t(`home_thoughts_${forTopic}`);
    if (!Array.isArray(list) || list.length === 0) return "";
    return list[(thoughtIndex[forTopic] ?? 0) % list.length];
}

function renderThought() {
    if (answered) return;
    thought.textContent = pickThought(topic);
    clearTimeout(thoughtTimer);
    thoughtTimer = setTimeout(nextThought, THOUGHT_INTERVAL);
}

function nextThought() {
    thoughtIndex[topic] = (thoughtIndex[topic] ?? 0) + 1;
    renderThought();
}

function setTopic(newTopic) {
    if (answered || newTopic === topic) return;
    topic = newTopic;
    renderThought();
}

// re-render the current thought when the language changes
const originalSetLang = window.setLang;
window.setLang = (lang) => {
    originalSetLang(lang);
    renderThought();
};

// ===== Speaker face + hovered topic =====
wheel.addEventListener("mouseover", (e) => {
    const link = e.target.closest("a[data-face]");
    if (!link) return;
    setFace(link.getAttribute("data-face"));
    setTopic(link.getAttribute("data-topic"));
});

function showGeneric() {
    setFace(NEUTRAL_FACE);
    setTopic(GENERIC_TOPIC);
}
chatInput.addEventListener("focus", showGeneric);
chatInput.addEventListener("mouseenter", showGeneric);

// the textarea grows with its content (max height is capped in CSS, then it scrolls)
function resizeInput() {
    chatInput.style.height = "auto";
    const borders = chatInput.offsetHeight - chatInput.clientHeight;
    chatInput.style.height = `${chatInput.scrollHeight + borders}px`;
}
function updateSendButton() {
    chatSend.disabled = sending || !chatInput.value.trim();
}
chatInput.addEventListener("input", () => { resizeInput(); updateSendButton(); });
window.addEventListener("resize", resizeInput);
resizeInput();

// Enter sends, Shift+Enter adds a new line
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        chatForm.requestSubmit();
    }
});

// set default speaker image on load
window.addEventListener("load", () => setFace(NEUTRAL_FACE));
window.addEventListener("pageshow", () => setFace(NEUTRAL_FACE));

renderThought();

// ===== Chat =====
const history = [];
let conversationId = null; // assigned by the backend with the first reply
let sending = false;
updateSendButton();

chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = chatInput.value.trim();
    if (!text || sending) return;

    sending = true;
    chatInput.disabled = true;
    updateSendButton();
    answered = true;
    clearTimeout(thoughtTimer);
    setFace(NEUTRAL_FACE);

    // keep the last exchanges only (the backend accepts at most MAX_HISTORY messages)
    while (history.length + 1 > MAX_HISTORY) history.splice(0, 2);
    history.push({ role: "user", content: text });
    chatInput.value = "";
    resizeInput();
    updateSendButton();
    thought.innerHTML = '<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: history, lang: document.documentElement.lang, conversation_id: conversationId }),
        });
        if (response.status === 429) { throw new Error("too_many"); }
        if (!response.ok) { throw new Error(`Server error: ${response.status} ${response.statusText}`); }

        const data = await response.json();
        const reply = String(data.reply ?? "").trim();
        if (!reply) throw new Error("Empty answer");

        thought.textContent = reply;
        history.push({ role: "assistant", content: reply });
        conversationId = data.conversation_id ?? conversationId;
    } catch (error) {
        console.error("Request failed:", error);
        history.pop();
        chatInput.value = text; // give the question back so it can be retried
        resizeInput();
        thought.textContent = t(error.message === "too_many" ? "home_chat_too_many" : "home_chat_error");
    } finally {
        sending = false;
        chatInput.disabled = false;
        updateSendButton();
        chatInput.focus();
    }
});

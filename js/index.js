import "./base.js?v=20260919175025";
import { setFace } from "./base.js?v=20260919175025";
import "./i18n/index.js?v=20260919175025";
import { t } from "./i18n/core.js?v=20260919175025";

const NEUTRAL_FACE = "/images/speaker/neutral.png";
const GENERIC_TOPIC = "generic";
const THOUGHT_INTERVAL = 5 * 1000; // how long a thought stays fully written before the next one
const TYPE_DELAY = 50; // ms per character
const DOTS_MIN_DELAY = 800; // ms the loading dots stay visible before a message is typed
const MAX_HISTORY = 10; // messages sent to the backend (5 exchanges)

const wheel = document.getElementById("wheel");
const thought = document.getElementById("thought");
const thoughtBox = thought.parentElement; // the scrolling container
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

// ===== Message display =====
// Every message (thoughts, chat replies, errors) goes through showMessage: the loading dots
// are shown for at least DOTS_MIN_DELAY, then the text is typed one character at a time.
// A new message cancels whatever is being typed.
let generation = 0; // bumped whenever a new message starts, so an older typing loop stops
let dotsShownAt = null; // timestamp when the dots appeared, null when they are not visible

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// While a message is typed the box follows the newest line. Scrolling up hands the control to the
// user; scrolling back down to the end re-enables the automatic scrolling.
let autoScroll = true;
thoughtBox.addEventListener("scroll", () => {
    autoScroll = thoughtBox.scrollTop + thoughtBox.clientHeight >= thoughtBox.scrollHeight - 2;
});

function showDots() {
    generation++;
    clearTimeout(thoughtTimer);
    if (dotsShownAt !== null) return; // already visible, keep the original timestamp
    dotsShownAt = Date.now();
    thought.innerHTML = '<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
}

// returns false if another message interrupted this one
async function showMessage(text) {
    showDots();
    const current = generation;
    await sleep(Math.max(0, dotsShownAt + DOTS_MIN_DELAY - Date.now()));
    if (current !== generation) return false;

    dotsShownAt = null;
    thought.textContent = "";
    autoScroll = true;
    for (const char of text) {
        thought.textContent += char;
        if (autoScroll) thoughtBox.scrollTop = thoughtBox.scrollHeight; // keep the newest line in view
        await sleep(TYPE_DELAY);
        if (current !== generation) return false;
    }
    return true;
}

// ===== Thoughts =====
// The text under the speaker always shows a thought about the last hovered topic
// (or a generic one), rotating in list order THOUGHT_INTERVAL after each one is fully written.
// Once a prompt has been sent, the answer stays there until the page changes.
let topic = GENERIC_TOPIC;
let answered = false;
let thoughtTimer = null;
const thoughtIndex = {}; // per-topic position in the list

function thoughtList(forTopic) {
    const list = t(`home_thoughts_${forTopic}`);
    return Array.isArray(list) ? list : [];
}

function pickThought(forTopic) {
    const list = thoughtList(forTopic);
    if (list.length === 0) return "";
    return list[(thoughtIndex[forTopic] ?? 0) % list.length];
}

async function renderThought() {
    if (answered) return;
    const done = await showMessage(pickThought(topic));
    // rotate only when the topic has more than one thought
    if (done && !answered && thoughtList(topic).length > 1) thoughtTimer = setTimeout(nextThought, THOUGHT_INTERVAL);
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

// changing the language always goes back to the preset thoughts, even if a chat answer was shown
const originalSetLang = window.setLang;
window.setLang = (lang) => {
    originalSetLang(lang);
    answered = false;
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
    setFace(NEUTRAL_FACE);

    // keep the last exchanges only (the backend accepts at most MAX_HISTORY messages)
    while (history.length + 1 > MAX_HISTORY) history.splice(0, 2);
    history.push({ role: "user", content: text });
    chatInput.value = "";
    resizeInput();
    updateSendButton();
    showDots(); // stays visible while waiting for the backend
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

        answered = true; // set again: the language may have changed while waiting
        showMessage(reply);
        history.push({ role: "assistant", content: reply });
        conversationId = data.conversation_id ?? conversationId;
    } catch (error) {
        console.error("Request failed:", error);
        history.pop();
        chatInput.value = text; // give the question back so it can be retried
        resizeInput();
        answered = true;
        showMessage(t(error.message === "too_many" ? "home_chat_too_many" : "home_chat_error"));
    } finally {
        sending = false;
        chatInput.disabled = false;
        updateSendButton();
        chatInput.focus();
    }
});

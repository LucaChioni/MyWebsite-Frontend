import "./base.js";
import "./i18n/pages/secrets.js";

const form = document.getElementById("secret-form");
const apiKeyInput = document.getElementById("api-key");
const responseContainer = document.getElementById("response-container");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    responseContainer.textContent = "...";
    const response = await fetch(`/api/access_secrets?apiKey=${encodeURIComponent(apiKeyInput.value)}`);
    const data = await response.json();
    responseContainer.textContent = JSON.stringify(data, null, 2);
});

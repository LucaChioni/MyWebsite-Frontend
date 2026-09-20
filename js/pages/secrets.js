import "../base.js?v=20260920103946";
import "../i18n/pages/secrets.js?v=20260920103946";
import { t } from "../i18n/core.js?v=20260920103946";

const TIMEOUT = 500
const form = document.getElementById("secret-form");
const apiKeyInput = document.getElementById("api-key");
const responseContainer = document.getElementById("response-container");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.disabled) return;
    form.disabled = true;

    responseContainer.textContent = "...";
    try {
        const response = await fetch(`/api/access_secrets?apiKey=${encodeURIComponent(apiKeyInput.value)}`);
        if (!response.ok) { throw new Error(`Server error: ${response.status} ${response.statusText}`); }
        const data = await response.json();

        if (data.success) {
            if (data.access) responseContainer.textContent = t("secrets_access_allowed");
            else responseContainer.textContent = t("secrets_access_denied");
        } else {
            responseContainer.textContent = t("secrets_error_answer");
        }
    } catch (error) {
        console.error("Request failed:", error);
        responseContainer.textContent = t("secrets_error_answer");
    } finally {
        setTimeout(() => { form.disabled = false; }, TIMEOUT);
    }
});

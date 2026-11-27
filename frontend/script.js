// After deploying the backend on Render, paste its URL below (without a trailing slash).
const API_URL = "https://online-feedback-system-drtr.onrender.com";

const form = document.getElementById("feedbackForm");
const message = document.getElementById("message");
const list = document.getElementById("feedbackList");
const count = document.getElementById("count");

async function loadFeedback() {
  try {
    const response = await fetch(`${API_URL}/api/feedback`);
    if (!response.ok) throw new Error("Could not load feedback.");
    const items = await response.json();
    count.textContent = `${items.length} ${items.length === 1 ? "RESPONSE" : "RESPONSES"}`;
    if (!items.length) {
      list.innerHTML = '<p class="empty">No feedback submitted yet.</p>';
      return;
    }
    list.innerHTML = items.map(item => `
      <article class="response">
        <div class="response-top">
          <div><strong>${escapeHtml(item.studentName)}</strong><span class="subject">${escapeHtml(item.subject)}</span></div>
          <span class="stars">${"★".repeat(item.rating)}${"☆".repeat(5-item.rating)}</span>
        </div>
        <p>${escapeHtml(item.comments)}</p>
      </article>
    `).join("");
  } catch (error) {
    list.innerHTML = '<p class="empty">Connect the backend URL to display feedback.</p>';
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  message.textContent = "Submitting...";
  message.className = "message";
  const data = new FormData(form);
  const payload = {
    studentName: data.get("studentName"),
    subject: data.get("subject"),
    rating: Number(data.get("rating")),
    comments: data.get("comments")
  };
  try {
    const response = await fetch(`${API_URL}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Submission failed.");
    form.reset();
    message.textContent = "Thank you! Your feedback was submitted.";
    await loadFeedback();
  } catch (error) {
    message.textContent = `${error.message} Check your Render URL in script.js.`;
    message.className = "message error";
  }
});

loadFeedback();

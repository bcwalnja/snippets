function createId() {
    return crypto.randomUUID().slice(0, 8);
}

function createCard(id, title, content) {
    const cardTitle = document.createElement("div");
    cardTitle.className = "card-title";
    cardTitle.appendChild(createTitle(title));
    cardTitle.appendChild(createCopyButton(content));
    cardTitle.appendChild(createDeleteButton(title, id));
    const card = document.createElement("div");
    card.className = "card";
    card.appendChild(cardTitle);
    const cardContent = document.createElement("p");
    cardContent.textContent = content;
    card.appendChild(cardContent);
    return card;
}

function createTitle(title) {
    const titleElement = document.createElement("span");
    titleElement.className = "title";
    titleElement.textContent = title;
    return titleElement;
}

function createCopyButton(content) {
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy";
    copyBtn.innerHTML = `<img src="./icons/clip.svg" alt="Copy" />`;
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(content).catch(console.error);
    });
    return copyBtn;
}

function createDeleteButton(title, id) {
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.innerHTML = `🗑️`;
    deleteBtn.addEventListener("click", () => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
        const cached = localStorage.getItem("snippets");
        const snippets = cached ? JSON.parse(cached) : [];
        const updatedSnippets = snippets.filter(snippet => snippet.id !== id);
        localStorage.setItem("snippets", JSON.stringify(updatedSnippets));
        location.reload();
    });
    return deleteBtn;
}

const cached = localStorage.getItem("snippets");
if (!cached || JSON.parse(cached).length === 0) {
    const message = "No snippets were found in the cache. Use the controls in the footer to add some.";
    const defaultSnippet = { id: createId(), title: "Welcome!", content: message };
    localStorage.setItem("snippets", JSON.stringify([defaultSnippet]));
    location.reload();
}
const snippets = cached ? JSON.parse(cached) : [];

const container = document.querySelector(".container");
snippets.forEach(({ id, title, content }) => {
    const card = createCard(id, title, content);
    container.appendChild(card);
});

document.getElementById("new-card-form").addEventListener("submit", e => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    const content = form.content.value.trim();
    if (!title || !content) return;
    const newSnippet = { id: createId(), title, content };
    const cached = localStorage.getItem("snippets");
    const snippets = cached ? JSON.parse(cached) : [];
    snippets.push(newSnippet);
    localStorage.setItem("snippets", JSON.stringify(snippets));
    location.reload();
});

function createId() {
    return crypto.randomUUID().slice(0, 8);
}

function createCard(id, title, content) {
    const card = document.createElement("div");
    card.className = "card";

    const cardTitle = document.createElement("div");
    cardTitle.className = "card-title-row";

    const titleEl = createTitle(title);
    const copyBtn = createCopyButton(content);
    const deleteBtn = createDeleteButton(title, id);

    cardTitle.append(titleEl, copyBtn, deleteBtn);
    card.appendChild(cardTitle);

    const cardContent = document.createElement("p");
    cardContent.className = "content";
    cardContent.textContent = content;
    card.appendChild(cardContent);

    card.addEventListener("click", e => {
        if (!e.target.closest(".delete")) {
            navigator.clipboard.writeText(content).catch(console.error);
        }
    });

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

function loadCards() {
    if (JSON.parse(localStorage.getItem("snippets"))?.length === 0) {
        const message = "No snippets were found in the cache. Use the controls in the footer to add some.";
        const defaultSnippet = { id: createId(), title: "Welcome!", content: message };
        localStorage.setItem("snippets", JSON.stringify([defaultSnippet]));
    }

    refreshCards();
}

loadCards();

document.getElementById("new-card-form").addEventListener("submit", e => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    const content = form.content.value.trim();
    if (!title || !content) return;
    const snippets = JSON.parse(localStorage.getItem("snippets")) || [];
    const newSnippet = { id: createId(), title, content };
    snippets.push(newSnippet);
    localStorage.setItem("snippets", JSON.stringify(snippets));
    refreshCards();

    // also clear the title and content inputs
    form.title.value = "";
    form.content.value = "";
});

function refreshCards() {
    const container = document.querySelector(".container");
    container.innerHTML = "";
    const cached = localStorage.getItem("snippets");
    const snippets = cached ? JSON.parse(cached) : [];
    snippets.forEach(({ id, title, content }) => {
        const card = createCard(id, title, content);
        container.appendChild(card);
    });
}
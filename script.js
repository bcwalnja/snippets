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
    const deleteBtn = id ? createDeleteButton(title, id) : createWebIcon();

    cardTitle.append(titleEl, copyBtn, deleteBtn);
    card.appendChild(cardTitle);

    const cardContent = document.createElement("p");
    cardContent.className = "content";
    cardContent.textContent = content;
    card.appendChild(cardContent);

    requestAnimationFrame(() => {
        if (cardContent.scrollHeight > cardContent.clientHeight) {
            card.classList.add("fade");
        }
    });

    card.addEventListener("click", e => {
        if (!e.target.closest(".delete")) {
            navigator.clipboard.writeText(content).then(showToast).catch(console.error);
        }
    });

    return card;
}


function showToast() {
    const toast = document.getElementById("toast");
    toast.classList.remove("show");
    void toast.offsetWidth; // restart the animation on rapid clicks
    toast.classList.add("show");
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

function createWebIcon() {
    const webIcon = document.createElement("span");
    webIcon.textContent = "🌐";
    return webIcon;
}

let webSnippets = [];

async function loadWebCards() {
    const sheetUrl = localStorage.getItem("sheetUrl");
    if (!sheetUrl) return;
    try {
        const sheetId = sheetUrl.match(/\/d\/([\w-]+)/)[1];
        const response = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?headers=1`);
        const text = await response.text();
        const rows = JSON.parse(text.slice(text.indexOf("(") + 1, text.lastIndexOf(")"))).table.rows;
        webSnippets = rows.map(row => ({ title: row.c[0]?.v, content: row.c[1]?.v }));
        refreshCards();
    } catch (error) {
        console.error(error);
        document.getElementById("web-error").hidden = false;
    }
}

const webForm = document.getElementById("web-flyout");
webForm.url.value = localStorage.getItem("sheetUrl");
webForm.addEventListener("submit", e => {
    e.preventDefault();
    localStorage.setItem("sheetUrl", webForm.url.value.trim());
    location.reload();
});

function loadCards() {
    if (JSON.parse(localStorage.getItem("snippets"))?.length === 0) {
        const message = "No snippets were found in the cache. Use the controls in the footer to add some.";
        const defaultSnippet = { id: createId(), title: "Welcome!", content: message };
        localStorage.setItem("snippets", JSON.stringify([defaultSnippet]));
    }

    refreshCards();
}

loadCards();
loadWebCards();

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

const footer = document.querySelector("footer");
document.getElementById("open-form").addEventListener("click", () => footer.classList.add("open"));
document.getElementById("new-card-form").addEventListener("reset", () => footer.classList.remove("open"));

function refreshCards() {
    const container = document.querySelector(".container");
    container.innerHTML = "";
    const cached = localStorage.getItem("snippets");
    const snippets = cached ? JSON.parse(cached) : [];
    [...snippets, ...webSnippets].forEach(({ id, title, content }) => {
        const card = createCard(id, title, content);
        container.appendChild(card);
    });
}
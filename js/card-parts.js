function createTitle(title) {
    const titleElement = document.createElement("span");
    titleElement.className = "title";
    titleElement.textContent = title;
    return titleElement;
}

function createCopyButton(content) {
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy";
    copyBtn.innerHTML = `<img src="./assets/icons/clip.svg" alt="Copy" />`;
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

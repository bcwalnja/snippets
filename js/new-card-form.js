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

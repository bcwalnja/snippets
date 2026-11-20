function loadCards() {
    if (JSON.parse(localStorage.getItem("snippets"))?.length === 0) {
        const message = "No snippets were found in the cache. Use the controls in the footer to add some.";
        const defaultSnippet = { id: createId(), title: "Welcome!", content: message };
        localStorage.setItem("snippets", JSON.stringify([defaultSnippet]));
    }

    refreshCards();
}

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

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

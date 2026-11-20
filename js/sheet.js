let webSnippets = [];

async function loadWebCards() {
    const sheetUrl = localStorage.getItem("sheetUrl");
    if (!sheetUrl) return;
    const sheetLink = document.getElementById("web-link");
    sheetLink.href = sheetUrl;
    sheetLink.hidden = false;
    try {
        const sheetId = sheetUrl.match(/\/d\/([\w-]+)/)[1];
        const response = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?headers=1`);
        const text = await response.text();
        const rows = JSON.parse(text.slice(text.indexOf("(") + 1, text.lastIndexOf(")"))).table.rows;
        webSnippets = rows.map(row => ({ title: row.c[0]?.v, content: row.c[1]?.v }));
        refreshCards();
        document.getElementById("web-button").classList.add("linked");
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

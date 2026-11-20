function createId() {
    return crypto.randomUUID().slice(0, 8);
}

function showToast() {
    const toast = document.getElementById("toast");
    toast.classList.remove("show");
    void toast.offsetWidth; // restart the animation on rapid clicks
    toast.classList.add("show");
}

loadCards();
loadWebCards();

const shop = () => {
    const container = document.getElementById("container");
    container.innerHTML = `<div>내 상점 페이지</div>`;
};

if (document.location.pathname === "/shop") {
    shop();
}

document.addEventListener("click", (e) => {
    if (e.target.closest("#navMyStoreLink")) {
        shop();
    }
});

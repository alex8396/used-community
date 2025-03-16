const productAdd = () => {
    const container = document.getElementById("container");
    container.innerHTML = `<div>판매하기 페이지</div>`;
};

if (document.location.pathname === "/products/new") {
    productAdd();
}

document.addEventListener("click", (e) => {
    if (e.target.closest("#navSellLink")) {
        productAdd();
    }
});

const main = () => {
    const container = document.getElementById("container");
    container.innerHTML = `<div>메인 페이지</div>`;
};

if (document.location.pathname === "/") {
    main();
}

document.addEventListener("click", (e) => {
    if (e.target.closest("#logoLink")) {
        main();
    }
});

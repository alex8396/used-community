const updateContent = () => {
    const main_data = document.getElementById("main_data");
    if (document.location.pathname === "/products/new") {
        main_data.innerHTML = `<div>prodnew</div>`;
    }
    
};

// URL 변경 시 updateContent 실행
window.addEventListener("popstate", updateContent);

// a 태그 클릭 시 URL 변경 및 updateContent 실행
document.getElementById('navSellLink').addEventListener('click', (event) => {
    event.preventDefault();
    
    updateContent();
});
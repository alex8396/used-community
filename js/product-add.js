const productAdd = () => {
    const container = document.getElementById("container");
    container.innerHTML = `<div>판매하기 페이지</div>`;
};

// 페이지 로딩 시 URL에 맞게 상태 초기화
const initProductAdd = () => {
    if (document.location.pathname === "/products/new") {
        productAdd();
    }
};

// 초기화
window.addEventListener("DOMContentLoaded", initProductAdd);

document.addEventListener("click", (e) => {
    if (e.target.closest("#navSellLink")) {
        history.replaceState(null, null, "/products/new");  // replaceState로 URL 변경
        productAdd();  // 페이지 렌더링
    }
});

// popstate 이벤트 처리 (뒤로가기를 눌렀을 때 호출)
window.addEventListener("popstate", initProductAdd);

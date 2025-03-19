const getProduct = (productId) => {
    const main_data = document.getElementById("main_data");

    main_data.innerHTML = `
        <div>상품 ${productId}번 페이지</div>
    `;
};

// 페이지 로딩 시 URL에 맞게 상태 초기화
const initGetProduct = () => {
    const path = document.location.pathname;  // 현재 URL 경로
    const match = path.match(/\/product\/(\d+)/);  // /product/ 뒤에 숫자를 추출
    
    if (match) {
        const productId = match[1];  // 추출한 productId
        getProduct(productId);  // 상품 데이터 가져오기
    }
};

// 초기화
window.addEventListener("DOMContentLoaded", initGetProduct);

// 내상점 링크 클릭 이벤트 처리
// document.addEventListener("click", (e) => {
//     if (e.target.closest("#navMyStoreLink")) {
//         e.preventDefault();
//         history.replaceState(null, null, "/shop");  // replaceState로 URL 변경
//         getProduct();  // 페이지 렌더링
//     }
// });

// popstate 이벤트 처리 (뒤로가기를 눌렀을 때 호출)
window.addEventListener("popstate", initGetProduct);
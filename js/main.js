import { getAllProducts } from '/api/api.js';

const main = async () => {
    const main_data = document.getElementById("main_data");

    try {
        const response = await getAllProducts();
        
        if (response.data.status === "ok") {
            console.log(response.data.products);
            const products = response.data.products;
            let productHTML = ""; // 제품 리스트 HTML 문자열

            products.forEach(product => {
                productHTML += `
                    <div class="product">
                        <img src="${product.image1}" alt="${product.name}" style="width : 200px; height: 200px;"/>
                        <div>${product.name}</div>
                        <div>가격: ${product.price}원</div>
                `;
                productHTML += `</div>`;
            });

            main_data.innerHTML = productHTML; // 제품 리스트 HTML 삽입
        } else {
            main_data.innerHTML = `<p>상품 목록을 불러오는 데 실패했습니다.</p>`;
        }
    } catch (error) {
        console.error(error);
        main_data.innerHTML = `<p>오류가 발생했습니다.</p>`;
    }
};


// 페이지 로딩 시 URL에 맞게 상태 초기화
const initMain = () => {
    if (document.location.pathname === "/") {
        main();
    }
};

// 초기화
window.addEventListener("DOMContentLoaded", initMain);

document.addEventListener("click", (e) => {
    if (e.target.closest("#logoLink")) {
        history.replaceState(null, null, "/");  // replaceState로 URL 변경
        main();  // 페이지 렌더링
    }
});

// popstate 이벤트 처리 (뒤로가기를 눌렀을 때 호출)
window.addEventListener("popstate", initMain);

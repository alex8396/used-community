import { getAllProducts } from '/api/api.js';

const main = async () => {
    function timeAgo(date) {
        const now = new Date();
        const createdAt = new Date(date); // 서버에서 받은 createdAt 시간을 Date 객체로 변환
        const diffInSeconds = Math.floor((now - createdAt) / 1000); // 초 단위 차이 계산
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
    
        if (diffInMinutes < 1) {
            return "방금 전"; // 1분 이내
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes}분 전`; // 1분 이상, 1시간 미만
        } else if (diffInHours < 24) {
            return `${diffInHours}시간 전`; // 1시간 이상, 24시간 미만
        } else if (diffInDays < 30) {
            return `${diffInDays}일 전`; // 1일 이상, 30일 미만
        } else {
            return new Date(createdAt).toLocaleDateString(); // 30일 이상이면 날짜 형식으로 표시
        }
    }

    const main_data = document.getElementById("main_data");

    try {
        const response = await getAllProducts();
        
        if (response.data.status === "ok") {
            const products = response.data.products;
            let productHTML = `<div class="container">`; // 제품 리스트 HTML 문자열
            
            products.forEach(product => {
                productHTML += `
                    <div class="product-card" data-product-id="${product.id}">
                        <img src="${product.image1}" alt="${product.name}">
                        <p class="product-title">${product.name}</p>
                        <div class="product-info">
                            <div class="price-time">
                            <p class="product-price">${product.price}원</p>
                            <p class="product-time">${timeAgo(product.createdAt)}</p>
                            </div>
                            <button class="like-button" aria-label="찜하기">
                                <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        </div>
                `;
                productHTML += `</div>`; // 제품 카드 끝
            });

            productHTML += `</div>`; // 컨테이너 끝
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

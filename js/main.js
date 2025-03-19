import { getAllProducts } from '/api/api.js';

const main = async () => {
    function timeAgo(date) {
        const now = new Date();
        const createdAt = new Date(date);
        const diffInSeconds = Math.floor((now - createdAt) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
    
        if (diffInMinutes < 1) return "방금 전";
        if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
        if (diffInHours < 24) return `${diffInHours}시간 전`;
        if (diffInDays < 30) return `${diffInDays}일 전`;
        return new Date(createdAt).toLocaleDateString();
    }

    const main_data = document.getElementById("main_data");

    try {
        const response = await getAllProducts();
        
        if (response.data.status === "ok") {
            const products = response.data.products;
            let productHTML = `<div class="container">`;
            
            products.forEach(product => {
                const isLiked = JSON.parse(localStorage.getItem(`liked-${product.id}`)) || false;

                productHTML += `
                    <div class="product-card" data-product-id="${product.id}">
                        <img src="${product.image1}" alt="${product.name}" class="product-image">
                        <p class="product-title">${product.name}</p>
                        <div class="product-info">
                            <div class="price-time">
                                <p class="product-price">${product.price}원</p>
                                <p class="product-time">${timeAgo(product.createdAt)}</p>
                            </div>
                            <button class="like-button ${isLiked ? "liked" : ""}" data-product-id="${product.id}" aria-label="찜하기">
                                <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>`;
            });

            productHTML += `</div>`;
            main_data.innerHTML = productHTML;
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
        history.replaceState(null, null, "/");
        main();
    }
});

// popstate 이벤트 처리 (뒤로가기)
window.addEventListener("popstate", initMain);

// 상품 클릭 시 상세 페이지 이동 (하트 버튼 제외)
document.addEventListener("click", (e) => {
    // 하트 버튼을 클릭하면 상세 페이지로 이동하지 않음
    if (e.target.closest(".like-button")) {
        return;
    }

    const productCard = e.target.closest(".product-card");
    if (productCard) {
        const productId = productCard.dataset.productId;
        window.location.href = `/product/${productId}`;
    }
});

// 하트 버튼 클릭 시 찜 상태 변경
document.addEventListener("click", (e) => {
    const likeButton = e.target.closest(".like-button");
    if (likeButton) {
        e.stopPropagation(); // 이벤트 전파 방지 (상품 상세 페이지로 이동하는 것을 막음)
        
        const productId = likeButton.dataset.productId;
        const isLiked = JSON.parse(localStorage.getItem(`liked-${productId}`)) || false;

        if (isLiked) {
            likeButton.classList.remove("liked");
            localStorage.setItem(`liked-${productId}`, JSON.stringify(false));
        } else {
            likeButton.classList.add("liked");
            localStorage.setItem(`liked-${productId}`, JSON.stringify(true));
        }
    }
});

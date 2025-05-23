import { getAllProducts, addToWishlist, removeFromWishlist } from '/api/api.js';

const timeAgo = (date) => {
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
};

const renderProducts = (products) => {
    const main_data = document.getElementById("main_data");

    let productHTML = `<div class="container">`;
    products.forEach(product => {
        
        const isLiked = product.liked || false;
        const nickname = sessionStorage.getItem("nickname");
        
        productHTML += `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.image1}" alt="${product.name}" class="product-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="fallback-text"></span>
                <p class="product-title">${product.name}</p>
                <div class="product-info">
                    <div class="price-time">
                        <p class="product-price">${product.price}원</p>
                        <p class="product-time">${timeAgo(product.createdAt)}</p>
                    </div>
                    ${product.nickname==nickname || nickname==null ? "" : 
                        `
                            <button class="like-button ${isLiked ? "liked" : ""}" data-product-id="${product.id}" aria-label="찜하기">
                                <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        `
                    }
                    
                </div>
            </div>`;
    });
    productHTML += `</div>`;

    if(products.length == 0){
        productHTML = `<div class="container">등록된 상품이 없습니다.<div>`
    }

    main_data.innerHTML = productHTML;
};

const main = async () => {
    const main_data = document.getElementById("main_data");
    
    try {
        const response = await getAllProducts();
        if (response.data.status === "ok") {
            const products = response.data.products;

            // 최신 상품이 먼저 나오도록 정렬 (createdAt 기준 내림차순)
            products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            renderProducts(products);
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
document.addEventListener("click", async (e) => {
    const likeButton = e.target.closest(".like-button");
    if (likeButton) {
        e.stopPropagation(); // 이벤트 전파 방지 (상품 상세 페이지로 이동하는 것을 막음)

        const productId = likeButton.dataset.productId;
        const isLiked = likeButton.classList.contains("liked");

        // 기존 아이콘 저장 후 로딩 스피너로 변경
        const originalHTML = likeButton.innerHTML;
        likeButton.innerHTML = `<div class="likedSpinner"></div>`;
        likeButton.disabled = true; // 버튼 비활성화

        try {
            if (isLiked) {
                // 찜 해제 요청
                const response = await removeFromWishlist(productId);
                if (response.data.status === "ok") {
                    likeButton.classList.remove("liked");
                } else {
                    alert("찜 목록 삭제 도중 오류가 발생했습니다. 다시 시도해주세요.");
                }
            } else {
                // 찜 추가 요청
                const nickname = sessionStorage.getItem("nickname");
                const response = await addToWishlist(nickname, productId);
                if (response.data.status === "ok") {
                    likeButton.classList.add("liked");
                } else {
                    alert("찜 목록 추가 도중 오류가 발생했습니다. 다시 시도해주세요.");
                }
            }
        } catch (error) {
            alert("요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            // 원래 아이콘 복원 및 버튼 활성화
            likeButton.innerHTML = originalHTML;
            likeButton.disabled = false;
        }
    }
});


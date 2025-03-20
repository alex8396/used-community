import { getProductById, deleteProduct, addToWishlist, removeFromWishlist, buyProduct } from '/api/api.js';

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

const getProduct = async(productId) => {
    const main_data = document.getElementById("main_data");
    const nickname = sessionStorage.getItem("nickname");
    main_data.innerHTML = ``;
    try{
        const response = await getProductById(productId);
        if(response.data.status === "ok"){
            const product = response.data.product;
            console.log(product.liked)
            main_data.innerHTML += `
                <div data-product-id="${product.id}">
                    <img src="${product.image1}" alt="${product.name}" class="product-image">
                    ${product.image2 ? `<img src="${product.image2}" alt="${product.name}" class="product-image"></img>` : ``}
                    ${product.image3 ? `<img src="${product.image3}" alt="${product.name}" class="product-image"></img>` : ``}
                    <div>name : ${product.name}</div>
                    <div>price : ${product.price}</div>
                    <div>category : ${product.category}</div>
                    <div>description : ${product.description}</div>
                    <div>status : ${product.isSold}</div>
                    <div>liked : ${product.liked}</div>
                    <div>seller : ${product.nickname}</div>
                    <div>${timeAgo(product.createdAt)}</div>
                    ${nickname ? ` <!-- 로그인 되어있을 때 -->
                        ${product.nickname != nickname // 로그인 된 경우, 현재 상품의 판매자가 나와 다를 때
                            ? `
                                <button class="like-button ${product.liked ? "liked" : ""}" data-product-id="${product.id}" aria-label="찜하기">
                                    <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </button>
                                ${product.isSold == "판매중" ? `
                                    <button class="buyButton" data-product-id="${product.id}">
                                        구매하기
                                    </button>
                                `: ``}
                                
                            ` 
                            : ` <!-- 내 상품일 때 -->
                                ${product.isSold == "판매중" ? `
                                    <button class="updateButton" data-product-id="${product.id}">
                                        수정하기
                                    </button>
                                    <button class="deleteButton" data-product-id="${product.id}">
                                        삭제하기
                                    </button>
                                `: ``}
                            `
                        }    
                    ` : ``}
                    
                    
                </div>
            `;
        }else{
        main_data.innerHTML = '<div class="empty-message">상품을 불러오는 데 실패했습니다.</div>';  
        }
    }catch{
        main_data.innerHTML = '<div class="empty-message">상품을 불러오는 데 실패했습니다.</div>';
    }


    document.addEventListener("click", async (e) => {
        const updateButton = e.target.closest(".updateButton");
        if(updateButton){
            window.location.href = `/product/update/${productId}`;
        }  
        
        const deleteButton = e.target.closest(".deleteButton");
        if (deleteButton) {
            const productId = deleteButton.dataset.productId;
            const confirmDelete = confirm("삭제하시겠습니까?");

            if (confirmDelete) {
                const response = await deleteProduct(productId);
                if (response.data.status === "ok") {
                    alert("상품이 삭제되었습니다.");
                    window.location.href = "/";
                } else {
                    alert("상품 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
                }
            }
        }
        

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

        const buyButton = e.target.closest(".buyButton");
        if (buyButton) {
            e.stopPropagation(); // 이벤트 전파 방지 (상품 상세 페이지로 이동하는 것을 막음)

            const productId = buyButton.dataset.productId;
            const originalHTML = buyButton.innerHTML;  // 원래 버튼 내용을 저장

            // 버튼 내부 내용을 스피너로 변경
            buyButton.innerHTML = `<div class="likedSpinner"></div>`;
            buyButton.disabled = true;  // 버튼 비활성화

            try {
                const response = await buyProduct(productId, nickname);
                if (response.data.status === "ok") {
                    location.reload();
                } else {
                    alert("구매 중 오류가 발생했습니다. 다시 시도해주세요.");
                }
            } catch (error) {
                alert("구매 요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
            } finally {
                // 스피너를 원래 버튼 내용으로 복원
                buyButton.innerHTML = originalHTML;
                buyButton.disabled = false;  // 버튼 활성화
            }
        }
    });
    
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
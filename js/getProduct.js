import { getProductById } from '/api/api.js';

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
        console.log(response.data.product)
        if(response.data.status === "ok"){
            const product = response.data.product;
            console.log(product.nickname == nickname)
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
                    ${product.nickname != nickname ? `<button>구매하기</button>` : `<button>수정하기</button><button>삭제하기</button>`}
                </div>
            `;
        }else{
        main_data.innerHTML = '<div class="empty-message">상품을 불러오는 데 실패했습니다.</div>';  
        }
    }catch{
        main_data.innerHTML = '<div class="empty-message">상품을 불러오는 데 실패했습니다.</div>';
    }
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
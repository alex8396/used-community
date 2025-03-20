import { getProductByNickname, getWishlistByNickname, getPurchasesByNickname, removeFromWishlist } from '/api/api.js';

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

const shop = () => {
    const main_data = document.getElementById("main_data");
    const productCountElement = document.getElementById("productCount"); // 상품 수 요소
    const likeCountElement = document.getElementById("likeCount"); // 찜 수 요소
    
    // 로그인 체크
    const nickname = sessionStorage.getItem("nickname");
    if (!nickname) {
        // 로그인되지 않은 경우 메인 페이지로 리다이렉트
        window.location.href = "/";
        return;
    }
    
    // 스타일시트 동적 추가
    if (!document.querySelector('link[href="/css/shop.css"]')) {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = '/css/shop.css';
        document.head.appendChild(linkElement);
    }

    main_data.innerHTML = `
        <div class="shop-container">
            <div class="shop-header">
                <div class="shop-profile">
                    <!-- 프로필 이미지 -->
                </div>
                <div class="shop-info">
                    <h1 id="shopNickname">${nickname}</h1>
                    <p>상품 <span id="productCount">0</span> · 찜 <span id="likeCount">0</span></p>
                </div>
            </div>

            <div class="tab-buttons">
                <button class="tab-button active" data-tab="selling">판매상품</button>
                <button class="tab-button" data-tab="liked">찜한상품</button>
                <button class="tab-button" data-tab="purchase">구매상품</button>
            </div>

            <div id="sellingTab" class="tab-content active">
                <div class="product-grid" id="sellingProducts">
                    <!-- 판매 상품들이 여기에 동적으로 추가됩니다 -->
                </div>
            </div>

            <div id="likedTab" class="tab-content">
                <div class="product-grid" id="likedProducts">
                    <!-- 찜한 상품들이 여기에 동적으로 추가됩니다 -->
                </div>
            </div>

            <div id="purchaseTab" class="tab-content">
                <div class="product-grid" id="purchaseProducts">
                    <!-- 구매한 상품들이 여기에 동적으로 추가됩니다 -->
                </div>
            </div>
        </div>
    `;

    // 탭 전환 기능
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => 
                content.classList.remove('active')
            );
            button.classList.add('active');
            document.getElementById(`${tabId}Tab`).classList.add('active');

            // 탭 변경 시 해당 데이터 로드
            if (tabId === 'selling') {
                loadSellingProducts();
            } else if (tabId === 'purchase') {
                loadPurchaseHistory();
            } else if (tabId === 'liked') {
                loadLikedProducts();
            }
        });
    });

    // 데이터 로드 함수들
    const loadSellingProducts = async() => {
        const sellingProducts = document.getElementById('sellingProducts');
        sellingProducts.innerHTML = ``;
        try {
            const response = await getProductByNickname(nickname);
          if (response.data.status === "ok") {
                const products = response.data.products;
                if (products.length == 0) {
                    sellingProducts.innerHTML += '<div class="empty-message">판매 중인 상품이 없습니다.</div>';
        } else {
                    products.forEach(product => {
                        sellingProducts.innerHTML += `
                            <div class="product-card" data-product-id="${product.productId}">
                                <img src="${product.image1}" alt="${product.name}" class="product-image">
                                <div>name : ${product.name}</div>
                                <div>price : ${product.price}</div>
                                <div>status : ${product.isSold}</div>
                                <div>${timeAgo(product.createdAt)}</div>
                            </div>
                        `;
                    });
                    // 상품 수 증가
                    const currentCount = parseInt(productCountElement.textContent);
                    productCountElement.textContent = currentCount + products.length;
                }
            } else {
                sellingProducts.innerHTML = '<div class="empty-message">상품 목록을 불러오는 데 실패했습니다.</div>';
            }
        } catch {
            sellingProducts.innerHTML = '<div class="empty-message">상품 목록을 불러오는 데 실패했습니다.</div>';
        }
    };

    const loadPurchaseHistory = async() => {
        // 구매 내역 데이터 로드 로직
        const purchaseProducts = document.getElementById('purchaseProducts');
        purchaseProducts.innerHTML = '';

        try{
          const response = await getPurchasesByNickname(nickname);
          
          if(response.data.status === "ok"){
            const products = response.data.products;
            
            if(products.length==0){
              purchaseProducts.innerHTML += '<div class="empty-message">구매한 상품이 없습니다.</div>';  
          }else{
              products.forEach(product => {  
                purchaseProducts.innerHTML += `
                  <div class="product-card" data-product-id="${product.productId}">
                    <img src="${product.image1}" alt="${product.productName}" class="product-image">
                    <div>name : ${product.productName}</div>
                    <div>price : ${product.productPrice}</div>
                    <div>${timeAgo(product.purchaseDate)}에 구매함</div>
                  </div>
                `;  
              })
            }
          }else{
            purchaseProducts.innerHTML = '<div class="empty-message">구매 목록을 불러오는 데 실패했습니다.</div>';  
          }
        }catch{
          purchaseProducts.innerHTML = '<div class="empty-message">구매 목록을 불러오는 데 실패했습니다.</div>';
        }
    };

    const loadLikedProducts = async() => {
        const likedProducts = document.getElementById('likedProducts');
        likedProducts.innerHTML = ``;
        try {
            const response = await getWishlistByNickname(nickname);
            if (response.data.status === "ok") {
                const products = response.data.wishlist;
                if (products.length == 0) {
                    likedProducts.innerHTML += '<div class="empty-message">찜한 상품이 없습니다.</div>';
                } else {
                    products.forEach(product => {
                        likedProducts.innerHTML += `
                            <div class="product-card" data-product-id="${product.productId}">
                                <img src="${product.image1}" alt="${product.productName}" class="product-image">
                                <div>name : ${product.productName}</div>
                                <div>price : ${product.productPrice}</div>
                                <div>status : ${product.isSold}</div>
                                <div>${timeAgo(product.createAt)}</div>
                            </div>
                        `;
                    });
                    // 찜 수 증가
                    const currentCount = parseInt(likeCountElement.textContent);
                    likeCountElement.textContent = currentCount + products.length;
                }
            } else {
                likedProducts.innerHTML = '<div class="empty-message">찜 목록을 불러오는 데 실패했습니다.</div>';
            }
        } catch {
            likedProducts.innerHTML = '<div class="empty-message">찜 목록을 불러오는 데 실패했습니다.</div>';
        }
    };

    // 초기 데이터 로드
    loadSellingProducts();

  // 상품 카드 클릭 이벤트 처리
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.like-button')) {
        e.preventDefault();
        return;
      }
      const productId = this.getAttribute('data-product-id');
      window.location.href = `/product/detail?id=${productId}`;
    });
  });

  // 찜하기 버튼 이벤트 처리
  document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', function(e) {
            e.stopPropagation();
      this.classList.toggle('active');
      const productId = this.closest('.product-card').dataset.productId;
      const isLiked = this.classList.contains('active');
      try {
        console.log(`상품 ${productId} 찜하기 ${isLiked ? '추가' : '취소'}`);
      } catch (error) {
        console.error('찜하기 처리 중 오류 발생:', error);
        this.classList.toggle('active');
      }
    });
  });
};

// 페이지 로딩 시 URL에 맞게 상태 초기화
const initShop = () => {
    if (document.location.pathname === "/shop") {
        shop();
    }
};

// 초기화
window.addEventListener("DOMContentLoaded", initShop);

// 내상점 링크 클릭 이벤트 처리
document.addEventListener("click", (e) => {
    if (e.target.closest("#navMyStoreLink")) {
        e.preventDefault();
        history.replaceState(null, null, "/shop");  // replaceState로 URL 변경
        shop();  // 페이지 렌더링
    }
});

// popstate 이벤트 처리 (뒤로가기를 눌렀을 때 호출)
window.addEventListener("popstate", initShop);
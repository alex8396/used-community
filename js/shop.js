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
    
        <!-- 메인 컨텐츠 -->
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
        // 판매 상품 데이터 로드 로직
        const sellingProducts = document.getElementById('sellingProducts');
        sellingProducts.innerHTML = ``;
        try{
          const response = await getProductByNickname(nickname);
          
          if(response.data.status === "ok"){
            const products = response.data.products;
            
            if(products.length==0){
              sellingProducts.innerHTML += '<div class="empty-message">판매 중인 상품이 없습니다.</div>';  
            }else{
              products.forEach(product => {
                sellingProducts.innerHTML += `
                  <div class="product-card" data-product-id="${product.id}">
                    <img src="${product.image1}" alt="${product.name}" class="product-image">
                    <div>name : ${product.name}</div>
                    <div>price : ${product.price}</div>
                    <div>status : ${product.isSold}</div>
                    <div>${timeAgo(product.createdAt)}</div>
                    
                  </div>
                `;  
              })
            }
          }else{
            sellingProducts.innerHTML = '<div class="empty-message">상품 목록을 불러오는 데 실패했습니다.</div>';  
          }
        }catch{
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
        // 찜한 상품 데이터 로드 로직
        const likedProducts = document.getElementById('likedProducts');
        likedProducts.innerHTML = ``;
        try{
          const response = await getWishlistByNickname(nickname);
          const isLiked = true;
          if(response.data.status === "ok"){
            const products = response.data.wishlist;
            
            if(products.length==0){
              likedProducts.innerHTML += '<div class="empty-message">찜한 상품이 없습니다.</div>';  
            }else{
              products.forEach(product => {  
                likedProducts.innerHTML += `
                  <div class="product-card" data-product-id="${product.productId}">
                    <img src="${product.image1}" alt="${product.productName}" class="product-image">
                    <div>name : ${product.productName}</div>
                    <div>price : ${product.productPrice}</div>
                    <div>status : ${product.isSold}</div>
                    <div>${timeAgo(product.createAt)}</div>
                    <button class="like-button ${isLiked ? "liked" : ""}" data-product-id="${product.productId}" aria-label="찜하기">
                        <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                  </div>
                `;  
              })
            }
          }else{
            likedProducts.innerHTML = '<div class="empty-message">찜 목록을 불러오는 데 실패했습니다.</div>';  
          }
        }catch{
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
      console.log(productId)
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
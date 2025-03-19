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
    const loadSellingProducts = () => {
        // 판매 상품 데이터 로드 로직
        const sellingProducts = document.getElementById('sellingProducts');
        sellingProducts.innerHTML = '<div class="empty-message">판매 중인 상품이 없습니다.</div>';
    };

    const loadPurchaseHistory = () => {
        // 구매 내역 데이터 로드 로직
        const purchaseProducts = document.getElementById('purchaseProducts');
        purchaseProducts.innerHTML = '<div class="empty-message">구매 내역이 없습니다.</div>';
    };

    const loadLikedProducts = () => {
        // 찜한 상품 데이터 로드 로직
        const likedProducts = document.getElementById('likedProducts');
        likedProducts.innerHTML = '<div class="empty-message">찜한 상품이 없습니다.</div>';
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
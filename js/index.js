
window.onload = async () => {
  let response = await axios.get("http://localhost:8080/getAllProducts");
  console.log(response);
  let productList = response.data;
  let productListDiv = ``;

  productList.forEach((item) => {
    productListDiv += `<div class="card m-3" style="width: 10rem;">
        <img src="img/${item.pimg}" class="card-img-top" alt="...">
       
        <div class="card-body">
          <b class="card-title">${item.prodname}</b>
          <a href="#" class="review-link" data-product-id="${item.prodcode}" 
          data-bs-toggle="modal" data-bs-target="#commentModal"> 
            <img src="img/comment.png" alt="댓글"> 
          </a>
          <p class="card-text text-danger">${item.price}원</p>   
          <a href="#" class="btn btn-outline-info" onclick="addToCart(${item.prodcode})">찜</a>
          <a href="#" class="btn btn-outline-info" onclick="addToCart(${item.prodcode})">구매</a>
        </div>
      </div>`;
  });

  document.getElementById("productListDiv").innerHTML = productListDiv;

  // 모달 열기 이벤트 리스너
  let prodcode;
  const reviewLinks = document.querySelectorAll(".review-link");
  reviewLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      prodcode= link.getAttribute("data-product-id"); // 클릭한 제품의 ID 가져오기
      try {
        const reviewsResponse = await axios.post("http://localhost:8080/getRecentReviews", { prodcode });
        const reviews = reviewsResponse.data;
        console.log(reviews);

        // 모달 본문에 리뷰 표시
        let reviewListDiv = `<ul>`;
        reviewListDiv += reviews.map((item) => `<li>${item.review}</li>`).join("");
        reviewListDiv += `</ul>`;
        document.getElementById("commentModalBody").innerHTML = reviewListDiv;
      } catch (error) {
        console.error("댓글을 가져오는 데 오류가 발생했습니다:", error);
        document.getElementById("commentModalBody").innerHTML = "댓글을 불러오는 데 오류가 발생했습니다.";
      }
    });
  });


  window.onload = async () => {
    let response = await axios.get("http://localhost:8080/getAllProducts");
    console.log(response);
    let productList = response.data;
    let productListDiv = ``;
  
    productList.forEach((item) => {
      productListDiv += `<div class="card m-3" style="width: 10rem;">
          <img src="img/${item.pimg}" class="card-img-top" alt="...">
         
          <div class="card-body">
            <b class="card-title">${item.prodname}</b>
            <a href="#" class="review-link" data-product-id="${item.prodcode}" 
            data-bs-toggle="modal" data-bs-target="#commentModal"> 
              <img src="img/comment.png" alt="댓글"> 
            </a>
            <p class="card-text text-danger">${item.price}원</p>   
            <a href="#" class="btn btn-outline-info" onclick="addToCart(${item.prodcode})">찜</a>
            <a href="#" class="btn btn-outline-info" onclick="buyProduct(${item.prodcode})">구매</a>
          </div>
        </div>`;
    });
  
    document.getElementById("productListDiv").innerHTML = productListDiv;
  
    // 모달 열기 이벤트 리스너
    let prodcode;
    const reviewLinks = document.querySelectorAll(".review-link");
    reviewLinks.forEach((link) => {
      link.addEventListener("click", async (event) => {
        prodcode = link.getAttribute("data-product-id"); // 클릭한 제품의 ID 가져오기
        try {
          const reviewsResponse = await axios.post("http://localhost:8080/getRecentReviews", { prodcode });
          const reviews = reviewsResponse.data;
          console.log(reviews);
  
          // 모달 본문에 리뷰 표시
          let reviewListDiv = `<ul>`;
          reviewListDiv += reviews.map((item) => `<li>${item.review}</li>`).join("");
          reviewListDiv += `</ul>`;
          document.getElementById("commentModalBody").innerHTML = reviewListDiv;
        } catch (error) {
          console.error("댓글을 가져오는 데 오류가 발생했습니다:", error);
          document.getElementById("commentModalBody").innerHTML = "댓글을 불러오는 데 오류가 발생했습니다.";
        }
      });
    });
  
    // 댓글 남기기 버튼 클릭 시 처리
    document.getElementById("submitComment").addEventListener("click", async () => {
      const review = document.getElementById("commentTextarea").value;
      const nickname = sessionStorage.getItem("nickname");
      if (review && prodcode) {
        try {
          await axios.post("http://localhost:8080/insertReview", { nickname, prodcode, review });
          document.getElementById("commentTextarea").value = ""; // 댓글 입력창 초기화
          alert("댓글이 등록되었습니다!");
          // 모달 닫기
          const modal = bootstrap.Modal.getInstance(document.getElementById("commentModal"));
          modal.hide();
        } catch (error) {
          console.error("댓글을 등록하는 데 오류가 발생했습니다:", error);
          alert("댓글을 등록하는 데 오류가 발생했습니다.");
        }
      } else {
        alert("댓글을 입력해주세요.");
      }
    });
  
    // 장바구니 담기 버튼 클릭 시 처리
    const cartLinks = document.querySelectorAll("#addCartBtn");
    cartLinks.forEach((link) => {
      link.addEventListener("click", async () => {
        const prodcode = link.getAttribute("data-prodcode"); // 클릭한 제품의 ID 가져오기
        let quantity = prompt("수량을 입력하세요:");
        if (quantity != null && quantity != "") {
          await axios.post("http://localhost:8080/insertCartItem", { prodcode, quantity });
        } else {
          alert("수량이 입력되지 않았습니다.");
        }
      });
    });
  
    // 장바구니 보기 버튼 클릭 시 처리
    document.getElementById("getCartItems").addEventListener("click", async () => {
      try {
        const response = await axios.post("http://localhost:8080/getCartItems");
        const cartItems = response.data;
        let cartItemListDiv = `<ul>`;
        let totalPrice = cartItems.reduce((sum, item) => sum + (parseInt(item.price) * parseInt(item.quantity)), 0);
        cartItemListDiv += cartItems.map((item) => 
          `<li>${item.prodname} (${item.quantity}잔) - ${(parseInt(item.price) * parseInt(item.quantity)).toLocaleString()}원</li>`
        ).join("");
        cartItemListDiv += `</ul>`;
        cartItemListDiv += `<div>총 금액 : ${totalPrice.toLocaleString()}원</div>`;
        document.getElementById("cartModalBody").innerHTML = cartItemListDiv;
  
      } catch (error) {
        console.error("장바구니를 불러오는 데 오류가 발생했습니다:", error);
      }
    });
  };
  
  // 장바구니에 담기 함수
  function addToCart(prodcode) {
    alert(`${prodcode}가 장바구니에 추가되었습니다.`);
    // 추가적인 장바구니 담기 로직을 추가해야 합니다.
  }
  
  // 구매 함수
  function buyProduct(prodcode) {
    alert(`${prodcode} 제품을 구매합니다.`);
    // 추가적인 구매 로직을 추가해야 합니다.
  }
  
  document.getElementById('imgupBtn').addEventListener('click', function () {
    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    const price = document.getElementById('price').value;
    const files = document.getElementById('image').files;
    
    if (files.length === 0) {
      alert('이미지를 선택해주세요.');
      return;
    }
    
    const fileArray = Array.from(files); // FileList를 배열로 변환
    
    fileArray.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
    
        // 게시물에 여러 이미지를 추가하려면, 여러 이미지 URL을 전달하여 처리
        addPostToList(title, price,text, imageUrl, index + 1); // 순번 추가
      };
      reader.readAsDataURL(file);
    });
    
    // 모달 닫기
    $('#addModal').modal('hide');
  });
  
  // 게시물을 #productListDiv에 추가하는 함수 (여러 이미지 지원)
  function addPostToList(title,price, text, imageUrl, imageIndex) {
    const productListDiv = document.getElementById('productListDiv');
  
    const newPostDiv = document.createElement('div');
    newPostDiv.classList.add('col-md-4'); // 적당한 크기의 컬럼을 사용하여 게시물 정렬
  
    newPostDiv.innerHTML = `
      <div class="card mb-4">
        <img src="${imageUrl}" class="card-img-top" alt="게시물 이미지 ${imageIndex}">
        <div class="card-body">
          <h5 class="card-title">제목:${title}</h5>
          <p class="card-text">내용:${text}</p>
          <p class="card-text">${price}원</p>
          <a href="#" class="btn btn-outline-info" onclick="addToCart(${imageIndex})">찜</a>
          <a href="#" class="btn btn-outline-info" onclick="buyProduct(${imageIndex})">구매</a>
        </div>
      </div>
    `;
  
    productListDiv.appendChild(newPostDiv);
  }
  
  // 이미지 미리보기
  document.getElementById('image').addEventListener('change', function(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById('previewContainer');
    
    // 기존 미리보기 이미지를 지우기
    previewContainer.innerHTML = '';
    
    // 선택된 파일들을 순회하며 미리보기 생성
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // FileReader로 파일을 읽어들임
      const reader = new FileReader();
      
      reader.onload = function(e) {
        // 미리보기 이미지 추가
        const img = document.createElement('img');
        img.src = e.target.result;
        img.classList.add('img-thumbnail');
        img.style.maxWidth = '150px'; // 이미지 크기 제한 (필요에 따라 조정)
        img.style.marginRight = '10px'; // 이미지 간격 조정
    
        previewContainer.appendChild(img);
      };
    
      reader.readAsDataURL(file); // 파일을 DataURL로 읽기
    }
  });
  
  
  
  // 댓글 남기기 버튼 클릭 시 처리
  document.getElementById("submitComment").addEventListener("click", async () => {
    const review = document.getElementById("commentTextarea").value;
    const nickname = sessionStorage.getItem("nickname");
    console.log(nickname , prodcode, review );
    if (review && prodcode) {
      try {

        await axios.post("http://localhost:8080/insertReview", { nickname , prodcode, review  });
        document.getElementById("commentTextarea").value = ""; // 댓글 입력창 초기화
        alert("댓글이 등록되었습니다!");
        // 모달 닫기
        const modal = bootstrap.Modal.getInstance(document.getElementById("commentModal"));
        modal.hide();
      } catch (error) {
        console.error("댓글을 등록하는 데 오류가 발생했습니다:", error);
        alert("댓글을 등록하는 데 오류가 발생했습니다.");
      }
    } else {
      alert("댓글을 입력해주세요.");
    }
  });

  // 장바구니 담기 버튼 클릭 시 처리
  const cartLinks = document.querySelectorAll("#addCartBtn");
  cartLinks.forEach((link) => {
    link.addEventListener("click", async () => {
      const prodcode = link.getAttribute("data-prodcode"); // 클릭한 제품의 ID 가져오기
      let quantity = prompt("수량을 입력하세요:");
      if(quantity != null && quantity != ""){
        await axios.post("http://localhost:8080/insertCartItem", { prodcode, quantity});
      }else{
        alert("수량이 입력되지 않았습니다.");
      }
    });
  });

  // 장바구니 보기 버튼 클릭 시 처리
  document.getElementById("getCartItems").addEventListener("click", async () => {
    try {
      const response = await axios.post("http://localhost:8080/getCartItems");
      const cartItems = response.data;
      let cartItemListDiv = `<ul>`;
      let totalPrice = cartItems.reduce((sum, item) => sum + (parseInt(item.price) * parseInt(item.quantity)), 0);
      cartItemListDiv += cartItems.map((item) => 
        `<li>${item.prodname} (${item.quantity}잔) - ${(parseInt(item.price) * parseInt(item.quantity)).toLocaleString()}원</li>`
      ).join("");
      cartItemListDiv += `</ul>`;
      cartItemListDiv += `<div>총 금액 : ${totalPrice.toLocaleString()}원</div>`
      document.getElementById("cartModalBody").innerHTML = cartItemListDiv;

    } catch (error) {
      
    }
  });
};

function renderProductList(products) {
  const productListDiv = document.getElementById("productListDiv");
  productListDiv.innerHTML = "";

  products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "col-md-4";
      productCard.innerHTML = `
          <div class="card mb-4">
              <img src="${product.imageUrl}" class="card-img-top" alt="상품 이미지">
              <div class="card-body">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">가격: ${product.price}원</p>
                  <p class="card-text">${product.text}</p>
                  <button class="btn btn-warning btn-sm edit-btn" data-id="${product.id}" data-bs-toggle="modal" data-bs-target="#editModal">수정</button>
                  <button class="btn btn-danger btn-sm delete-btn" data-id="${product.id}">삭제</button>
              </div>
          </div>
      `;
      productListDiv.appendChild(productCard);
  });

  // 이벤트 리스너 추가 (삭제)
  document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
          const id = event.target.getAttribute("data-id");
          if (confirm("정말 삭제하시겠습니까?")) {
              try {
                  await axios.delete(`/api/products/${id}`);
                  loadProducts();
              } catch (error) {
                  console.error("삭제 중 오류 발생:", error);
              }
          }
      });
  });

  // 이벤트 리스너 추가 (수정)
  document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
          const id = event.target.getAttribute("data-id");
          try {
              const response = await axios.get(`/api/products/${id}`);
              const product = response.data;
              document.getElementById("editTitle").value = product.title;
              document.getElementById("editPrice").value = product.price;
              document.getElementById("editText").value = product.text;
              document.getElementById("editProductId").value = product.id;
          } catch (error) {
              console.error("수정 데이터 불러오기 실패:", error);
          }
      });
  });
}

// 페이지 로드 시 상품 목록 불러오기
async function loadProducts() {
  try {
      const response = await axios.get("/api/products");
      renderProductList(response.data);
  } catch (error) {
      console.error("상품 불러오기 오류:", error);
  }
}

// 로그인 상태 확인 함수
function checkLoginStatus() {
  const token = sessionStorage.getItem("authToken");
  
  if (token) {
    // 사용자가 로그인된 경우: 회원가입 링크를 숨기고, 로그인 상태 메시지 표시
    document.getElementById("signupSpan").style.display = "none";
    document.getElementById("loginSpan").style.display = "none";  // 로그인 링크도 숨기거나 로그아웃 링크로 대체 가능
    document.getElementById("effectMsg").innerText = "로그인 되었습니다.";
  } else {
    // 로그인되지 않은 경우: 회원가입 및 로그인 링크 표시
    document.getElementById("signupSpan").style.display = "block";
    document.getElementById("loginSpan").style.display = "block";
    document.getElementById("effectMsg").innerText = "안녕하세요 중고거래 플랫폼입니다.";
  }
}

// 페이지 로드 시 로그인 상태 확인
window.onload = checkLoginStatus;


loadProducts();


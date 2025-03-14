import { signup, getRecentReviews, insertReview, addToCart, getCartItems } from './api/api.js';

window.onload = async () => {
  // 모달
  const modal = document.getElementById("authModal");
  const openModalBtn = document.getElementById("authButton");
  const closeModalBtn = document.getElementById("modalCloseBtn");

  openModalBtn.onclick = () => {
    modal.style.display = "flex";
    loginBtn.style.display = "block";
  };

  closeModalBtn.onclick = () => {
    modal.style.display = "none";
    resetAuthForm();
  };

  // 로그인/회원가입
  const loginBtn = document.getElementById("modalLoginBtn");
  const signupBtn = document.getElementById("modalSignupBtn");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const nicknameInput = document.getElementById("nicknameInput");
  const emailErrorMsg = document.getElementById("emailErrorMsg");
  const passwordErrorMsg = document.getElementById("passwordErrorMsg");
  const nicknameErrorMsg = document.getElementById("nicknameErrorMsg");
  const gotoSignup = document.getElementById("gotoSignup");
  const gotoLogin = document.getElementById("gotoLogin");
  const nicknameWrapper = document.getElementById("modalNicknameWrapper");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  // 로그인 버튼 클릭
  loginBtn.onclick = () => {
    validateLoginForm();
  };

  // 회원가입 버튼 클릭
  signupBtn.onclick = () => {
    validateSignupForm();
  };

  // 회원가입 화면으로 전환
  gotoSignup.onclick = () => {
    toggleAuthForm(true);
  };

  // 로그인 화면으로 전환
  gotoLogin.onclick = () => {
    toggleAuthForm(false);
  };

  // 폼 유효성 검사 (로그인)
  const validateLoginForm = () => {
    if (!emailRegex.test(emailInput.value)) {
      emailErrorMsg.innerHTML = `<div>유효하지 않은 이메일 형식이에요</div>`;
    } else {
      emailErrorMsg.innerHTML = ``;
    }

    if (!passwordRegex.test(passwordInput.value)) {
      passwordErrorMsg.innerHTML = `<div>비밀번호는 8자리 이상, 특수문자와 숫자를 포함해요</div>`;
    } else {
      passwordErrorMsg.innerHTML = ``;
    }

    if (emailRegex.test(emailInput.value) && passwordRegex.test(passwordInput.value)) {

      console.log("로그인 이메일:", emailInput.value);
      console.log("로그인 비밀번호:", passwordInput.value);
    }
  };

  // 폼 유효성 검사 (회원가입)
  const validateSignupForm = async() => {
    if (!emailRegex.test(emailInput.value)) {
      emailErrorMsg.innerHTML = `<div>유효하지 않은 이메일 형식이에요</div>`;
    } else {
      emailErrorMsg.innerHTML = ``;
    }

    if (!passwordRegex.test(passwordInput.value)) {
      passwordErrorMsg.innerHTML = `<div>비밀번호는 8자리 이상, 특수문자와 숫자를 포함해주세요</div>`;
    } else {
      passwordErrorMsg.innerHTML = ``;
    }

    if (nicknameInput.value === "") {
      nicknameErrorMsg.innerHTML = `<div>닉네임을 입력해주세요</div>`;
    } else {
      nicknameErrorMsg.innerHTML = ``;
    }

    if (emailRegex.test(emailInput.value) && passwordRegex.test(passwordInput.value) && nicknameInput.value !== "") {
      console.log("회원가입 이메일:", emailInput.value);
      console.log("회원가입 비밀번호:", passwordInput.value);
      console.log("회원가입 닉네임:", nicknameInput.value);
      try {
        const response = await signup(emailInput.value, passwordInput.value, nicknameInput.value);
        console.log(response);
        
    } catch (error) {
        console.error("회원가입 실패:", error);
    }

    }
  };

  // 로그인/회원가입 화면 전환
  const toggleAuthForm = (isSignup) => {
    nicknameWrapper.style.display = isSignup ? "flex" : "none";
    signupBtn.style.display = isSignup ? "block" : "none";
    loginBtn.style.display = isSignup ? "none" : "block";
    gotoSignup.style.display = isSignup ? "none" : "block";
    gotoLogin.style.display = isSignup ? "block" : "none";

    resetAuthForm();
  };

  // 폼 리셋
  const resetAuthForm = () => {
    emailErrorMsg.innerHTML = ``;
    passwordErrorMsg.innerHTML = ``;
    nicknameErrorMsg.innerHTML = ``;
    emailInput.value = "";
    passwordInput.value = "";
    nicknameInput.value = "";
  };

  // 엔터키 입력 시 버튼 클릭 처리
  const handleEnterKey = (event) => {
    if (event.key === "Enter") {
      if (document.activeElement === emailInput || document.activeElement === passwordInput || document.activeElement === nicknameInput) {
        if (signupBtn.style.display === "block") {
          signupBtn.click();  // 회원가입 버튼 클릭
        } else if (loginBtn.style.display === "block") {
          loginBtn.click();  // 로그인 버튼 클릭
        }
      }
    }
  };

  // 엔터키 입력 감지
  document.addEventListener("keydown", handleEnterKey);



  // 제품 목록 및 리뷰 처리
  try {
    const productList = await getAllProducts();
    let productListDiv = ``;

    productList.forEach((item) => {
      productListDiv += `
        <div class="card m-3" style="width: 10rem;">
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
    const reviewLinks = document.querySelectorAll(".review-link");
    reviewLinks.forEach((link) => {
      link.addEventListener("click", async (event) => {
        const prodcode = link.getAttribute("data-product-id");
        try {
          const reviews = await getRecentReviews(prodcode);
          let reviewListDiv = `<ul>`;
          reviewListDiv += reviews.map((item) => `<li>${item.review}</li>`).join("");
          reviewListDiv += `</ul>`;
          document.getElementById("commentModalBody").innerHTML = reviewListDiv;
        } catch (error) {
          document.getElementById("commentModalBody").innerHTML = "댓글을 불러오는 데 오류가 발생했습니다.";
        }
      });
    });

  } catch (error) {
    console.error('Error fetching product list:', error);
  }
};

import { signup, login, logout } from '/api/api.js';

window.onload = async () => {
  
  const modal = document.getElementById("authModal");
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
  const welcomeMessage = document.getElementById("welcomeMessage");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  const toggleLoginState = (isLogin) => {
    const sessionNickname = sessionStorage.getItem("nickname");
    axios.defaults.headers.common["Authorization"] = sessionStorage.getItem("Authorization");
    axios.defaults.headers.common["nickname"] = sessionNickname;
    const headerContent = document.getElementById("headerContent");
    headerContent.innerHTML = isLogin
      ? `<div id="logoutButton">로그아웃</div><div id="nickname">${sessionNickname}</div>`
      : `<div id="authButton">로그인/회원가입</div>`;
  };

  const resetButton = (button, text) => {
    button.disabled = false;
    button.innerHTML = text;
    button.style.backgroundColor = "#ef0e0e";
    button.style.cursor = "pointer";
  };

  const validateForm = (isSignup) => {
    emailErrorMsg.innerHTML = emailRegex.test(emailInput.value) ? "" : "유효하지 않은 이메일 형식이에요";
    
    passwordErrorMsg.innerHTML = passwordRegex.test(passwordInput.value) 
        ? "" 
        : `비밀번호는 8자리 이상, 특수문자와 숫자를 포함${isSignup ? "해주세요" : "해요"}`;

    nicknameErrorMsg.innerHTML = isSignup && nicknameInput.value.trim() === "" 
        ? "닉네임을 입력해주세요" 
        : "";

    return emailErrorMsg.innerHTML === "" && passwordErrorMsg.innerHTML === "" && nicknameErrorMsg.innerHTML === "";
};


  const resetAuthForm = () => {
    emailErrorMsg.innerHTML = ``;
    passwordErrorMsg.innerHTML = ``;
    nicknameErrorMsg.innerHTML = ``;
    emailInput.value = "";
    passwordInput.value = "";
    nicknameInput.value = "";
  };

  const toggleAuthForm = (isSignup) => {
    nicknameWrapper.style.display = isSignup ? "flex" : "none";
    signupBtn.style.display = isSignup ? "block" : "none";
    loginBtn.style.display = isSignup ? "none" : "block";
    gotoSignup.style.display = isSignup ? "none" : "block";
    gotoLogin.style.display = isSignup ? "block" : "none";
    gotoLogin.style.display = isSignup ? "block" : "none";
    welcomeMessage.style.display = "none";
    resetAuthForm();
  };

  const handleAuthAction = async (event) => {
    const targetId = event.target.id;
    if (targetId === "logoutButton") {
      event.target.disabled = true;
      try {
        await logout();
        sessionStorage.clear();
        toggleLoginState(false);
      } catch (error) {
        console.error("로그아웃 오류:", error);
        alert("로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      event.target.disabled = false;
    }
    if (targetId === "authButton") modal.style.display = "flex";
    if (targetId === "authModal") {
      modal.style.display = "none";
      resetAuthForm();
    }
    if (targetId === "modalCloseBtn"){
      modal.style.display = "none";
      resetAuthForm();
    }
    if (targetId === "modalLoginBtn" || targetId === "modalSignupBtn") {
      if (!validateForm(targetId === "modalSignupBtn")) return;
      event.target.disabled = true;
      event.target.innerHTML = `<span class="spinner"></span>`;
      event.target.style.backgroundColor = "#e78787";
      try {
        if (targetId === "modalLoginBtn") {
          const response = await login(emailInput.value, passwordInput.value);
          if (response.data.status === "ok") {
            sessionStorage.setItem("Authorization", response.data.Authorization);
            sessionStorage.setItem("nickname", response.data.nickname);
            axios.defaults.headers.common["Authorization"] = response.data.Authorization;
            axios.defaults.headers.common["nickname"] = response.data.nickname;
            toggleLoginState(true);
            modal.style.display = "none";
            resetAuthForm();
          } else alert(response.data.msg);
        } else {
          const response = await signup(emailInput.value, passwordInput.value, nicknameInput.value);
          if (response.data === "회원 가입 성공") {
            welcomeMessage.style.display = "flex";
          }else if(response.data === "이메일 중복, 닉네임 중복"){
            emailErrorMsg.innerHTML = `이미 가입된 이메일입니다.`;
            nicknameErrorMsg.innerHTML = `이미 사용중인 닉네임입니다.`;
          }else if(response.data === "이메일 중복"){
            emailErrorMsg.innerHTML = `이미 가입된 이메일입니다.`;
          }else if(response.data === "닉네임 중복"){
            nicknameErrorMsg.innerHTML = `이미 사용중인 닉네임입니다.`;
            
          }else{
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
          }
        }
      } catch (error) {
        console.error("인증 오류:", error);
        alert("오류가 발생했습니다. 다시 시도해주세요.");
      }
      resetButton(event.target, targetId === "modalLoginBtn" ? "로그인" : "회원가입");
    }
    if(targetId === "gotoSignup"){
      toggleAuthForm(true);
    }
    if(targetId === "gotoLogin"){
      toggleAuthForm(false);
    }
  };

  document.addEventListener("click", handleAuthAction);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (loginBtn.style.display === "block") loginBtn.click();
      if (signupBtn.style.display === "block") signupBtn.click();
    }
    if (event.key === "Escape") {
      if (modal.style.display === "flex") {
        modalCloseBtn.click();
      }
    }
  });

  document.querySelectorAll("a").forEach(anchor => {
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      history.pushState(null, null, anchor.getAttribute("href"));
    });
  });

  toggleLoginState(sessionStorage.getItem("Authorization"));

  // 상품 카드 클릭 이벤트 처리
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // 찜하기 버튼 클릭 시 상세 페이지 이동 방지
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
      e.stopPropagation(); // 상품 카드 클릭 이벤트 전파 방지
      
      // 버튼 상태 토글
      this.classList.toggle('active');
      
      // 여기에 찜하기 API 호출 로직 추가
      const productId = this.closest('.product-card').dataset.productId;
      const isLiked = this.classList.contains('active');
      
      try {
        // API 호출 예시
        // await toggleLikeProduct(productId, isLiked);
        console.log(`상품 ${productId} 찜하기 ${isLiked ? '추가' : '취소'}`);
      } catch (error) {
        console.error('찜하기 처리 중 오류 발생:', error);
        // 에러 발생 시 토글 되돌리기
        this.classList.toggle('active');
      }
    });
  });

};

// 유틸리티 함수들
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
  
function removeCookie(cname) {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
  
const Authorization = getCookie("Authorization");
const email = getCookie("email");
if (Authorization && email) {
    document.getElementById("loginSpan").innerHTML = `${email}  
    <button class="btn btn-danger btn-sm" id="logoutBtn">Logout</button>`;
}

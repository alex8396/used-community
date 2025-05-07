import { signup, login, logout, toggleLike } from '/api/api.js';

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
  const shopNickname = document.getElementById("shopNickname");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  const toggleLoginState = (isLogin) => {
    const sessionNickname = sessionStorage.getItem("nickname");
    axios.defaults.headers.common["Authorization"] = sessionStorage.getItem("Authorization");
    const headerContent = document.getElementById("headerContent");
    
    if (isLogin && sessionNickname) {
      headerContent.innerHTML = `<div id="logoutButton">로그아웃</div><div id="nickname">${sessionNickname}</div>`;
      document.querySelector('.shop-container').style.display = 'block';
      document.getElementById("shopNickname").textContent = sessionNickname;
    } else {
      headerContent.innerHTML = `<div id="authButton">로그인/회원가입</div>`;
      document.getElementById("shopNickname").textContent = "로그인이 필요합니다";
      document.querySelector('.shop-container').style.display = 'none';
    }
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
        window.location.href = "/";
      } catch (error) {
        console.error("로그아웃 오류:", error);
        alert("로그아웃 중 오류가 발생했습니다.");
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
            toggleLoginState(true);
            modal.style.display = "none";
            resetAuthForm();
            window.location.reload();
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

  // 사용자 정보 로드 함수
  const loadUserInfo = () => {
    const sessionNickname = sessionStorage.getItem("nickname");
    
    if (sessionNickname) {
      // 로그인된 경우
      shopNickname.textContent = sessionNickname;
      document.querySelector('.shop-container').style.display = 'block';
    } else {
      // 로그인되지 않은 경우
      alert("로그인을 해주세요!");
      shopNickname.textContent = "로그인이 필요합니다";
      document.querySelector('.shop-container').style.display = 'none';
      
      // 로그인 모달 표시
      const modal = document.getElementById("authModal");
      modal.style.display = "flex";
    }
  };

  // 페이지 로드 시 초기 상태 설정
  loadUserInfo();
  toggleLoginState(sessionStorage.getItem("Authorization"));

  // 상품 카드 클릭 이벤트 처리
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.like-button')) {
        return;
      }
      const productId = this.dataset.productId;
      window.location.href = `/product-detail.html?id=${productId}`;
    });
  });

  // 찜하기 버튼 이벤트 처리
  document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', async function(e) {
      e.stopPropagation();
      
      if (!sessionStorage.getItem("Authorization")) {
        alert("로그인이 필요한 기능입니다.");
        document.getElementById("authModal").style.display = "flex";
        return;
      }
      
      const productId = this.closest('.product-card').dataset.productId;
      
      try {
        const response = await toggleLike(productId);
        if (response.data.success) {
          this.classList.toggle('active');
          
          if (document.querySelector('.tab-button[data-tab="liked"]').classList.contains('active')) {
            loadProducts('liked');
          }
        }
      } catch (error) {
        console.error('찜하기 처리 중 오류 발생:', error);
        alert('찜하기 처리에 실패했습니다.');
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

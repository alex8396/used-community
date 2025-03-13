document.getElementById("signupBtn").addEventListener("click", async ()=>{
    const email=document.getElementById("email").value;
    const pwd=document.getElementById("pwd").value;
    const nickname=document.getElementById("nickname").value;

    const data={email,pwd,nickname};

    const response=await axios.post("http://localhost:8080/insertMember" , data);

    document.getElementById("effectMsg").innerHTML = response.data;
});

// document.getElementById("loginBtn").addEventListener("click", async () => {  
//     const email = document.getElementById("loginEmail").value;
//     const pwd = document.getElementById("loginPwd").value;
//     const data = {  email, pwd };
//     const response=await axios.post("http://localhost:8080/login" , data);
//     console.log(response.data);
//     alert(response.data.nickname+"님 반갑습니다");
//   });

  document.getElementById("loginBtn").addEventListener("click", async () => {  
    const email = document.getElementById("loginEmail").value;
    const pwd = document.getElementById("loginPwd").value;
    const data = {  email, pwd };
    const response=await axios.post("http://localhost:8080/login" , data);
    
    document.getElementById("loginSpan").innerHTML=`${response.data.nickname}  
    <button class="btn btn-danger btn-sm" id="logoutBtn">Logout</button>`;
    const token = response.data.Authorization;
    console.log('Authorization:', token);
    sessionStorage.setItem('Authorization', token);
    sessionStorage.setItem('nickname', response.data.nickname);
    axios.defaults.headers.common['Authorization'] = token; // Authorization 헤더 설정
    // 모달 닫기
    const modal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
    loginModal.setAttribute("aria-hidden", "true");
    modal.hide();
  });



  const Authorization = sessionStorage.getItem("Authorization");
  const nickname = sessionStorage.getItem("nickname");
  if (Authorization && nickname) {
    axios.defaults.headers.common['Authorization'] = Authorization; // Authorization 헤더 설정
    document.getElementById("loginSpan").innerHTML = `${nickname}  
    <button class="btn btn-danger btn-sm" id="logoutBtn">Logout</button>`;
  }

  document.getElementById("loginSpan").addEventListener("click", async(event)=>{
    if(event.target.id=='logoutBtn'){       
        await axios.post("http://localhost:8080/logout");
        sessionStorage.removeItem("nickname");
        sessionStorage.removeItem("Authorization");
        axios.defaults.headers.common['Authorization'] = ''; // Authorization 헤더에서 삭제       
        window.location.reload();
    }
  });

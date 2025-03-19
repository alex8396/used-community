const shop = () => {
  const main_data = document.getElementById("main_data");
  main_data.innerHTML = `<div>내 상점2321jio;jawoiejf;oiajwef;oi 페이지</div>`;
};

// 페이지 로딩 시 URL에 맞게 상태 초기화
const initShop = () => {
  if (document.location.pathname === "/shop") {
      shop();
  }
};

// 초기화
window.addEventListener("DOMContentLoaded", initShop);

document.addEventListener("click", (e) => {
  if (e.target.closest("#navMyStoreLink")) {
      history.replaceState(null, null, "/shop");  // replaceState로 URL 변경
      shop();  // 페이지 렌더링
  }
});

// popstate 이벤트 처리 (뒤로가기를 눌렀을 때 호출)
window.addEventListener("popstate", initShop);
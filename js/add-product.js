const addProduct = () => {
    const main = document.getElementById("main");
    // main.innerHTML = `
        
    // `;

    const inputElement = document.getElementById("productNewNameInput");
    const inputCount = document.getElementById("productNewTextLimit");
    inputElement.addEventListener("input", () => {
        if (inputElement.value.length > 40) {
            inputElement.value = inputElement.value.slice(0, 40); // 40자 제한
        }
        const inputLength = inputElement.value.length;
        inputCount.innerHTML = `${inputLength}/40`;
    });

    const categories = [
        "선택", "여성의류", "남성의류", "신발", "가방/지갑", "시계", "쥬얼리", "패션 액세서리",
        "여성의류", "디지털", "가전제품", "스포츠/레저", "차량/오토바이", "스타굿즈", 
        "키덜트", "예술/희귀/수집품", "음반/악기", "도서/티켓/문구", "뷰티/미용", 
        "가구/인테리어", "생활/주방용품", "공구/산업용품", "식품", "유아동/출산", 
        "반려동물용품", "기타", "재능"
    ];
    const selectElement = document.getElementById("productNewSelect");
    categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    selectElement.appendChild(option);
    });
    let selected = "--";
    console.log("선택한 카테고리: " + selected);
    selectElement.addEventListener("change", () => {
        selected = selectElement.value
        console.log("선택한 카테고리: " + selected);
    });

    const textareaElement = document.getElementById("productNewDscrpInput");
    const textareaCount = document.getElementById("productNewDscrpLimit");
    textareaElement.addEventListener("input", () => {
        if (textareaElement.value.length > 40) {
            textareaElement.value = textareaElement.value.slice(0, 2000); // 2000자 제한
        }
        const inputLength = textareaElement.value.length;
        textareaCount.innerHTML = `${inputLength}/2000`;
    });
};

// 페이지 로딩 시 URL에 맞게 상태 초기화
const initAddProduct = () => {
    if (document.location.pathname === "/products/new") {
        addProduct();
    }
};

// 초기화
window.addEventListener("DOMContentLoaded", initAddProduct);

document.addEventListener("click", (e) => {
    if (e.target.closest("#navSellLink")) {
        history.replaceState(null, null, "/products/new");  // replaceState로 URL 변경
        addProduct();  // 페이지 렌더링
    }
});

// popstate 이벤트 처리 (뒤로가기를 눌렀을 때 호출)
window.addEventListener("popstate", initAddProduct);



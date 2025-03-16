const addProduct = () => {
    const main = document.getElementById("main");
    main.innerHTML = `
        <h2 id="productNewHeader">상품정보</h2>
            <ul class="productNewUl">
            <li class="productNewLi">
                <div class="productNewTitle" id="productNewImgTitle">
                상품이미지<small>(0/1)</small>
                </div>
                <div class="productNewContent">
                <div id="productNewImgInputWrapper">이미지 등록
                    <input type="file" accept="image/jpg, image/jpeg, image/png" multiple id="productNewImgInput">
                </div>
                <div id="productNewImgDscrp">상품 이미지는 PC에서는 1:1, 모바일에서는 1:1.23 비율로 보여져요.</div>
                </div>
            </li>
            </ul>
            <ul class="productNewUl">
            <li class="productNewLi">
                <div class="productNewTitle" id="productNewNameTitle">상품명</div>
                <div class="productNewContent" id="productNewNameContent">
                <div id="productNewNameInputWrapper">
                    <input type="text" id="productNewNameInput" placeholder="상품명을 입력해 주세요.">
                </div>
                <div id="productNewTextLimit">0/40</div>
                </div>
            </li>
        </ul>
    `;

    const inputElement = document.getElementById("productNewNameInput");
    const inputCount = document.getElementById("productNewTextLimit");
    inputElement.addEventListener("input", () => {
        if (inputElement.value.length > 40) {
            inputElement.value = inputElement.value.slice(0, 40); // 40자 제한
        }
        const inputLength = inputElement.value.length;
        inputCount.innerHTML = `${inputLength}/40`;
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



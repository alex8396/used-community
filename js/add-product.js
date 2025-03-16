const addProduct = () => {
    const main = document.getElementById("main");
    main.innerHTML = `
        <div id="productNewContainer">
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
              <li class="productNewLi" id="productNewNameLi">
                  <div class="productNewTitle" id="productNewNameTitle">상품명</div>
                  <div class="productNewContent" id="productNewNameContent">
                  <div class="productNewInputWrapper">
                      <input type="text" class="productNewInput" placeholder="상품명을 입력해 주세요." id="productNewNameInput">
                  </div>
                  <div id="productNewTextLimit">0/40</div>
                  </div>
                </li>
            </ul>
            <ul class="productNewUl">
              <li class="productNewLi" id="productNewCategoryLi">
                <div class="productNewTitle" id="productNewCategoryTitle">카테고리</div>
                <div class="productNewContent" id="productNewCategoryContent">
                  <select id="productNewSelect">
                  </select>
                </div>
              </li>
            </ul>
            <ul class="productNewUl" id="productNewDscrpUl">
              <li class="productNewLi" id="productNewDscrpLi">
                <div class="productNewTitle" id="productNewDscrpTitle">설명</div>
                <div class="productNewContent" id="productNewDscrpContent">
                    <textarea rows="6" id="productNewDscrpInput"></textarea>
                    <div id="productNewDscrpLimit">0/2000</div>
                </div>
              </li>
            </ul>

            <h2 id="productNewHeader">가격</h2>
            <ul class="productNewUl" id="productNewPriceUl">
              <li class="productNewLi">
                  <div class="productNewTitle" id="productNewPriceTitle">가격</div>
                  <div class="productNewContent" id="productNewPriceContent">
                    <div class="productNewInputWrapper" id="productNewPriceInputWrapper">
                        <input type="text" class="productNewInput" id="productNewPriceInput" placeholder="가격을 입력해 주세요.">
                        <span id="productNewSpan">원</span>
                    </div>
                  </div>
              </li>
            </ul>
          </div>
          <footer id="productNewFooter">
            <div id="productNewRegisterButtonWrapper">
              <button id="productNewRegisterButton">등록하기</button>
            </div>
          </footer>
    `;

    let selected = "--";
    console.log("선택한 카테고리: " + selected);
    const selectElement = document.getElementById("productNewSelect");
    const categories = [
        "선택", "여성의류", "남성의류", "신발", "가방/지갑", "시계", "쥬얼리", "패션 액세서리",
        "여성의류", "디지털", "가전제품", "스포츠/레저", "차량/오토바이", "스타굿즈", 
        "키덜트", "예술/희귀/수집품", "음반/악기", "도서/티켓/문구", "뷰티/미용", 
        "가구/인테리어", "생활/주방용품", "공구/산업용품", "식품", "유아동/출산", 
        "반려동물용품", "기타", "재능"
    ];

    // 카테고리 옵션 생성
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        selectElement.appendChild(option);
    });

    // select에 change 이벤트 리스너 한 번만 추가
    selectElement.addEventListener("change", () => {
        selected = selectElement.value;
        console.log("선택한 카테고리: " + selected);
    });

    // 전체 document에 click 이벤트 리스너 추가
    document.addEventListener("click", (e) => {
        // productNewNameInput을 클릭한 경우
        if (e.target.id === "productNewNameInput") {
            const inputElement = e.target;
            const inputCount = document.getElementById("productNewTextLimit");
            inputElement.addEventListener("input", () => {
                if (inputElement.value.length > 40) {
                    inputElement.value = inputElement.value.slice(0, 40); // 40자 제한
                }
                const inputLength = inputElement.value.length;
                inputCount.innerHTML = `${inputLength}/40`;
            });
        }

        // productNewDscrpInput을 클릭한 경우
        if (e.target.id === "productNewDscrpInput") {
            const textareaElement = e.target;
            const textareaCount = document.getElementById("productNewDscrpLimit");
            textareaElement.addEventListener("input", () => {
                if (textareaElement.value.length > 2000) {
                    textareaElement.value = textareaElement.value.slice(0, 2000); // 2000자 제한
                }
                const inputLength = textareaElement.value.length;
                textareaCount.innerHTML = `${inputLength}/2000`;
            });
        }

        // productNewPriceInput을 클릭한 경우
        if (e.target.id === "productNewPriceInput") {
            e.target.addEventListener("input", (e) => {
                let value = e.target.value.replace(/[^0-9,]/g, "");  // 숫자와 쉼표만 허용
                value = value.replace(/,/g, "");  // 쉼표 제거
                
                // 9자 이상 입력되지 않도록 제한
                if (value.length > 9) {
                    value = value.slice(0, 9);
                }
            
                // 숫자만 남기고 0이 앞에 여러 개 올 경우 처리
                if (value === "0") {
                    e.target.value = "0"; // 0만 입력한 경우 그대로 0
                    return;
                }
                
                // 숫자 앞에 0이 오면 제거 (ex: 000123 -> 123)
                value = value.replace(/^0+/, "");
                
                // 3자리마다 쉼표 추가
                value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                
                e.target.value = value;  // 수정된 값으로 input 업데이트
            });
        }
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

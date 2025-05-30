import { getProductById, updateProductById } from '/api/api.js';

const updateProduct = async(productId) => {
    const main_data = document.getElementById("main_data");
    
    const response = await getProductById(productId);
    const nickname = sessionStorage.getItem("nickname")
    const product = response.data.product;
    
    if(product==null){
        alert("올바르지 않은 접근입니다.")    
        location.href = "/"
    }
    if(product.nickname != nickname || product.isSold == "판매완료"){
        alert("올바르지 않은 접근입니다.")    
        location.href = "/"
    }
    
    let count = 1;
    if(product.image2) count++;
    if(product.image3) count++;

    let imageHtml = `
    <div id="productNewImgDiv" style="margin-right: 16px">
        <img src="${product.image1}" alt="미리보기 1" id="productNewImg" style="width:200px; height:200px">
        <button id="productNewImgClose" class="productNewImgClose"></button>
    </div>`;
    if (product.image2) {
        imageHtml += `
        <div id="productNewImgDiv" style="margin-right: 16px">
            <img src="${product.image2}" alt="미리보기 2" id="productNewImg" style="width:200px; height:200px">
            <button id="productNewImgClose" class="productNewImgClose"></button>
        </div>`;
    }
    if (product.image3) {
        imageHtml += `
        <div id="productNewImgDiv">
            <img src="${product.image3}" alt="미리보기 3" id="productNewImg" style="width:200px; height:200px">
            <button id="productNewImgClose" class="productNewImgClose"></button>
        </div>`;
    }

    main_data.innerHTML = `
    <main id="addProductMain">
        <div id="productNewContainer">
          <h2 id="productNewHeader">상품정보</h2>
            <ul class="productNewUl">
              <li class="productNewLi">
                  <div class="productNewTitle" id="productNewImgTitle">
                  상품이미지<small>(${count}/3)</small>
                  </div>
                  <div class="productNewContent" id="productNewImgContent">
                    <div id="productNewImgContainer">
                        <div id="productNewImgInputWrapper" style="display: none">이미지 등록
                            <input type="file" accept="image/jpg, image/jpeg, image/png" multiple id="productNewImgInput">
                        </div>
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
                      <input type="text" class="productNewInput" placeholder="상품명을 입력해 주세요." id="productNewNameInput" value="${product.name}">
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
                    <textarea rows="6" id="productNewDscrpInput">${product.description}</textarea>
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
            <div id="productUpdateRegisterButtonWrapper">
              <button id="productUpdateRegisterButton">수정하기</button>
            </div>
          </footer>
        </main>
    `;

    // 설명 input에 기본값 설정
    document.getElementById("productNewDscrpInput").value = product.description;

    // 가격 input에 기본값 설정 (쉼표 추가)
    document.getElementById("productNewPriceInput").value = product.price.toLocaleString();   

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

    // 카테고리 select 값 설정
    document.getElementById("productNewSelect").value = product.category;
    
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("productNewImgClose")) {
            const button = event.target;
            const parentDiv = button.parentElement;
            parentDiv.remove();  // 이미지 삭제
            updateImageCount();
    
            // 이미지 삭제 후 input 초기화 (새로운 이미지 추가 가능하게)
            const fileInput = document.getElementById("productNewImgInput");
            fileInput.value = "";  // 파일 input 초기화
            fileInput.dispatchEvent(new Event("change"));
        }
    });

    function updateImageCount() {
        const previewContainer = document.getElementById("productNewImgContainer");
        const smallTag = document.querySelector("small");
        const childrenCount = previewContainer.querySelectorAll("#productNewImgDiv").length;
        smallTag.innerHTML = `(${childrenCount}/3)`;
    
        // 각 이미지 div의 margin-right 업데이트
        const imageDivs = previewContainer.querySelectorAll("#productNewImgDiv");
        imageDivs.forEach((div, index) => {
            div.style.marginRight = index === imageDivs.length - 1 ? "0" : "16px";
        });
    }
    
    const setInitialImages = (product) => {
        const previewContainer = document.getElementById("productNewImgContainer");

        const files = [
            { src: product.image1 },
            { src: product.image2 },
            { src: product.image3 }
        ].filter(file => file.src);
        
        // 기존 이미지를 미리보기로 표시
        files.forEach((file, index) => {
            const div = document.createElement("div");
            div.id = "productNewImgDiv";
            
            // margin-right를 이미지 개수에 따라 결정
            div.style.marginRight = index === 2 ? "0px" : "16px";
            
            const img = document.createElement("img");
            img.src = file.src;
            img.alt = `미리보기 ${index + 1}`;
            img.id = "productNewImg";
            
            
            div.appendChild(img);
            previewContainer.appendChild(div);
        });
        
        updateImageCount();
    };
    
    // 상품 정보 로드 후 이미지 미리보기 설정
    setInitialImages(product);
    
    
    
    
    

    // 전체 document에 click 이벤트 리스너 추가
    document.addEventListener("click", async(e) => {
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

        // 등록하기 클릭한 경우
    if (e.target.id === "productUpdateRegisterButton") {
        const name = document.getElementById("productNewNameInput").value.trim();
        const category = document.getElementById("productNewSelect").value;
        const description = document.getElementById("productNewDscrpInput").value.trim();
        const price = document.getElementById("productNewPriceInput").value.trim().replace(/,/g, ""); // 쉼표 제거

        // 필수 입력 항목 검사
        if (!name) {
            alert("상품명을 입력해 주세요.");
            return;
        }
        if (category === "선택") {
            alert("카테고리를 선택해 주세요.");
            return;
        }
        if (!description) {
            alert("상품 설명을 입력해 주세요.");
            return;
        }
        if (!price || isNaN(price) || parseInt(price) <= 0) {
            alert("올바른 가격을 입력해 주세요.");
            return;
        }

        const nickname = sessionStorage.getItem("nickname");
        if (nickname === null) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }

        // 버튼을 비활성화하고 로딩 표시 추가
        const registerButton = e.target;
        registerButton.disabled = true;
        registerButton.innerHTML = `<span class="spinner"></span>`;
        registerButton.style.backgroundColor = "#e78787";  // 비활성화된 버튼 색상

        try {
            const path = document.location.pathname;
            const match = path.match(/^\/product\/update\/(\d+)$/); // 숫자 ID 추출
            const productId = match[1];
            
            const response = await updateProductById(productId,name, category, description, price, nickname);
            
            if (response.data.status === "ok") {
                alert("상품이 수정되었습니다");
                location.href = `/product/${productId}`;
            } else {
                alert("상품 수정에 실패했습니다. 다시 시도해주세요");
            }
        } catch (error) {
            alert("서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            // 작업 끝나면 버튼 활성화하고 원래 상태로 되돌리기
            registerButton.disabled = false;
            registerButton.innerHTML = "수정하기";
            registerButton.style.backgroundColor = "#ef0e0e";  // 원래 버튼 색상
        }
    }
        
        
    });
};

// 페이지 로딩 시 URL에 맞게 상태 초기화
const initUpdateProduct = () => {
    const path = document.location.pathname;
    const match = path.match(/^\/product\/update\/(\d+)$/); // 숫자 ID 추출
    if (match) {
        const productId = match[1];  // 추출한 productId
        updateProduct(productId);  // 상품 수정 함수 호출
    }
};

// 초기화
window.addEventListener("DOMContentLoaded", initUpdateProduct);

// popstate 이벤트 처리 (뒤로가기를 눌렀을 때 호출)
window.addEventListener("popstate", initUpdateProduct);

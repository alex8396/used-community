const URL = "http://localhost:8080";

export async function signup( email, pwd, nickname) {
    try {
        const response = await axios.post(`${URL}/signup`, { email, pwd, nickname});
        return response;
    } catch (error) {
        console.error('Error signup:', error);
        throw error;
    }
}
export async function login( email, pwd) {
    try {
        const response = await axios.post(`${URL}/login`, { email, pwd});
        return response;
    } catch (error) {
        console.error('Error login:', error);
        throw error;
    }
}
export async function logout() {
    try {
        await axios.post(`${URL}/logout`);
        sessionStorage.removeItem("nickname");
        sessionStorage.removeItem("Authorization");
        axios.defaults.headers.common['Authorization'] = ''; // Authorization 헤더에서 삭제       
    } catch (error) {
        console.error('Error logout:', error);
        throw error;
    }
}
export async function insertProduct(name, category, description, price, images, nickname) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("nickname", nickname);

    // 이미지들을 FormData에 추가
    Array.from(images).forEach(image => {
        formData.append("images", image);  // "images"라는 이름으로 파일을 추가
    });

    try {
        const response = await axios.post(`${URL}/products/new`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"  // 멀티파트 요청 헤더
            }
        });
        return response;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
}







// 특정 제품에 대한 리뷰를 가져오는 함수
export async function getRecentReviews(prodcode) {
    try {
        const response = await axios.post(`${URL}/getRecentReviews`, { prodcode });
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
}

// 댓글을 등록하는 함수
export async function insertReview(nickname, prodcode, review) {
    try {
        const response = await axios.post(`${URL}/insertReview`, { nickname, prodcode, review });
        return response.data;
    } catch (error) {
        console.error('Error inserting review:', error);
        throw error;
    }
}

// 장바구니에 제품 추가 함수
export async function addToCart(prodcode, quantity) {
    try {
        const response = await axios.post(`${URL}/insertCartItem`, { prodcode, quantity });
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

// 장바구니에 담긴 아이템들 가져오기
export async function getCartItems() {
    try {
        const response = await axios.post(`${URL}/getCartItems`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
}

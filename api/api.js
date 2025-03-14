const URL = "http://localhost:8080";

// 모든 제품을 가져오는 함수
export async function signup( email, pwd, nickname) {
    try {
        const response = await axios.post(`${URL}/signup`, { email, pwd, nickname});
        return response;
    } catch (error) {
        console.error('Error signup:', error);
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

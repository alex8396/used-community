const URL = "http://localhost:8080";

axios.defaults.headers.common["Authorization"] = sessionStorage.getItem("Authorization");
axios.defaults.headers.common["nickname"] = sessionStorage.getItem("nickname");

export async function signup( email, pwd, nickname) {
    try {
        const response = await axios.post(`${URL}/api/signup`, { email, pwd, nickname});
        return response;
    } catch (error) {
        console.error('Error signup:', error);
        throw error;
    }
}
export async function login( email, pwd) {
    try {
        const response = await axios.post(`${URL}/api/login`, { email, pwd});
        return response;
    } catch (error) {
        console.error('Error login:', error);
        throw error;
    }
}
export async function logout() {
    try {
        await axios.post(`${URL}/api/logout`);
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
    Array.from(images).forEach((image, index) => {
        console.log(`image${index + 1}:`, image);
        formData.append(`image${index + 1}`, image);  // image1, image2, image3으로 추가
    });

    try {
        const response = await axios.post(`${URL}/api/products/new`, formData, {
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
export async function getAllProducts() {
    try {
        const response = await axios.get(`${URL}/api/products`);
        return response;
    } catch (error) {
        console.error('Error get all products:', error);
        throw error;
    }
}
export async function getProductByNickname(nickname) {
    try {
        const response = await axios.get(`${URL}/api/products/nickname/${nickname}`);
        return response;
    } catch (error) {
        console.error('Error get products by id:', error);
        throw error;
    }
}
export async function getWishlistByNickname(nickname) {
    try {
        const response = await axios.get(`${URL}/api/wishlist/nickname/${nickname}`);
        return response;
    } catch (error) {
        console.error('Error get products by id:', error);
        throw error;
    }
}
export async function getPurchasesByNickname(nickname) {
    try {
        const response = await axios.get(`${URL}/api/purchase/nickname/${nickname}`);
        return response;
    } catch (error) {
        console.error('Error get products by id:', error);
        throw error;
    }
}
export async function addToWishlist(nickname, productId) {
    try {
        const response = await axios.post(`${URL}/api/wishlist/new`, {productId, nickname});
        return response;
    } catch (error) {
        console.error('Error add to wishlist:', error);
        throw error;
    }
}
export async function removeFromWishlist(productId) {
    try {
        const response = await axios.delete(`${URL}/api/wishlist/${productId}`);
        return response;
    } catch (error) {
        console.error('Error remove from wishlist:', error);
        throw error;
    }
}
export async function getProductById(productId) {
    try {
        const response = await axios.get(`${URL}/api/products/${productId}`);
        return response;
    } catch (error) {
        console.error('Error remove from wishlist:', error);
        throw error;
    }
}

import { toggleLike } from '/api/api.js';

window.onload = async () => {
    // URL에서 상품 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // 상품 정보 로드
    const loadProductDetail = async () => {
        try {
            const response = await axios.get(`/api/products/${productId}`);
            const product = response.data;

            document.getElementById('productImage').src = product.image;
            document.getElementById('productImage').alt = product.title;
            document.getElementById('productTitle').textContent = product.title;
            document.getElementById('productPrice').textContent = `${product.price}원`;
            document.getElementById('sellerName').textContent = product.seller;
            document.getElementById('productDescription').textContent = product.description;

            // 찜하기 상태 설정
            const likeButton = document.getElementById('likeButton');
            if (product.isLiked) {
                likeButton.classList.add('active');
            }
        } catch (error) {
            console.error('상품 정보 로드 실패:', error);
            alert('상품 정보를 불러오는데 실패했습니다.');
        }
    };

    // 찜하기 버튼 이벤트 처리
    document.getElementById('likeButton').addEventListener('click', async () => {
        try {
            const response = await toggleLike(productId);
            if (response.data.success) {
                const likeButton = document.getElementById('likeButton');
                likeButton.classList.toggle('active');
            }
        } catch (error) {
            console.error('찜하기 처리 실패:', error);
            alert('찜하기 처리에 실패했습니다.');
        }
    });

    // 초기 상품 정보 로드
    await loadProductDetail();
}; 
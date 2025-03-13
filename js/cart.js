async function addToCart(prodcode) {
    const cartResponse = await axios.post(
        "http://localhost:8080/addToCart",
        { prodcode }
      );
      const cart = cartResponse.data;
      console.log(cart);
}
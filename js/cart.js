import { addToCart } from '../api/api';

async function addToCart(prodcode) {
    const cart = await addToCart(prodcode);
    console.log(cart);
}
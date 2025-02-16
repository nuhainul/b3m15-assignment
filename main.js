const cart = [];

const productContainer = document.getElementById('product-container');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');
const cartSubtotalElement = document.getElementById('cart-subtotal');
const cartItemsElement = document.getElementById('cart-items');

// Fetch products from the Fake Store API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products in the product container
function displayProducts(products) {
    productContainer.innerHTML = ''; // Clear previous products
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Price: $<span class="price">${product.price}</span></p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productContainer.appendChild(productCard);
    });
    attachAddToCartHandlers(products);
}

// Attach click handlers to "Add to Cart" buttons
function attachAddToCartHandlers(products) {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            const product = products.find(item => item.id == productId);
            addToCart(product);
            updateCart();
        });
    });
}

// Add product to the cart
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity
    } else {
        cart.push({ ...product, quantity: 1 }); // Add new product to cart
    }
}

// Update the cart display
function updateCart() {
    cartCountElement.textContent = cart.length; // Update item count
    calculateTotal();
    displayCartItems();
}

// Calculate the total price
function calculateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotalElement.textContent = total.toFixed(2);
    cartTotalElement.textContent = total.toFixed(2); // Final total same as subtotal
}

// Display cart items to the UI
function displayCartItems() {
    cartItemsElement.innerHTML = ''; // Clear previous items
    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.textContent = `${item.title} - $${item.price} x ${item.quantity}`;
        cartItemsElement.appendChild(cartItem);
    });
}

// Function to clear the cart
function clearCart() {
    cart.length = 0; // Empty the cart array
    updateCart(); // Refresh the cart display
}

// Function to handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        const summary = cart.map(item => `${item.title} - $${item.price} x ${item.quantity}`).join('\n');
        const totalCost = `Subtotal: $${cartSubtotalElement.textContent}\nFinal Total: $${cartTotalElement.textContent}`;
        alert(`Checkout Summary:\n${summary}\n\n${totalCost}`);
    }
}

// Attach event listeners to buttons
const checkoutButton = document.getElementById('checkout-button');
checkoutButton.addEventListener('click', handleCheckout);

const clearCartButton = document.createElement('button'); // New Clear Cart Button
clearCartButton.textContent = "Clear Cart";
clearCartButton.id = "clear-cart-button"; // Set ID for styling or additional handling
clearCartButton.style.width = "100%"; // Make sure it's full width like the checkout button
clearCartButton.style.marginTop = "10px"; // Space between buttons
clearCartButton.addEventListener('click', clearCart); // Attach clear cart handler

// Append the Clear Cart button after the Checkout button
const cartElement = document.getElementById('cart');
cartElement.appendChild(clearCartButton); // Appending to the cart section

// Initial fetch of products on page load
fetchProducts();

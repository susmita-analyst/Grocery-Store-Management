let cart = JSON.parse(localStorage.getItem('cart')) || []; // Initialize the cart from localStorage, or as an empty array if no cart exists
let totalAmount = 0;
let products = []; // This will store the products fetched from the JSON

// Fetch product data from a JSON file
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json(); // Save fetched products globally
        displayProducts(products); // Display all products initially
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

// Function to display products dynamically with images
function displayProducts(productList) {
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = ''; // Clear the existing products

    productList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p><strong>Price: ₹${product.price.toFixed(2)} / per KG</strong></p>
            <p><strong>Stock: ${product.stock} KG</strong></p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(productCard);
    });
}

// Function to add products to the cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product.stock > 0) {  // Check if stock is available
        const existingProductIndex = cart.findIndex(item => item.id === productId);

        if (existingProductIndex >= 0) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        product.stock -= 1;  // Decrease the stock by 1

        // Update the cart and total amount
        totalAmount += product.price;
        updateCartDisplay();
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Re-render products to reflect the updated stock
        displayProducts(products);
    } else {
        alert('Sorry, this product is out of stock.');
    }
}

// Function to update the cart item count and total amount
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const totalAmountElement = document.getElementById('total-amount');
    const cartItems = document.getElementById('cart-items');

    // Calculate the total number of items in the cart
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalQuantity;

    // Update the total amount in the cart
    totalAmountElement.textContent = totalAmount.toFixed(2);

    // Clear and display the updated cart items
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`;
        cartItems.appendChild(listItem);
    });
}

// Function to handle search functionality
function filterProducts() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase(); // Get search input value
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery)); // Filter products
    displayProducts(filteredProducts); // Display filtered products
}

// Initialize the product display
window.onload = function () {
    fetchProducts(); // Fetch product data when the page loads
    updateCartDisplay(); // Update the cart count on page load based on localStorage
};

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const productList = document.getElementById('product-list');
    const cartButton = document.getElementById('cart-button');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // --- State ---
    // Try to load cart from localStorage, or initialize as empty array
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // --- Sample Product Data (Replace with your actual data/API call) ---
    const products = [
        { id: 1, name: "Stylish Backpack", price: 45.00, imageUrl: "images/product1.jpg" },
        { id: 2, name: "Wireless Headphones", price: 89.99, imageUrl: "images/product2.jpg" },
        { id: 3, name: "Smart Watch", price: 199.50, imageUrl: "https://via.placeholder.com/250/771796" },
        { id: 4, name: "Coffee Maker", price: 65.00, imageUrl: "https://via.placeholder.com/250/24f355" },
        { id: 5, name: "Running Shoes", price: 78.25, imageUrl: "https://via.placeholder.com/250/d32776" },
        { id: 6, name: "Yoga Mat", price: 25.00, imageUrl: "https://via.placeholder.com/250/f66b97" },
    ];

    // --- Functions ---

    // Function to render products on the page
    function renderProducts() {
        productList.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `;
            productList.appendChild(productCard);
        });
    }

    // Function to add item to cart
    function addToCart(productId) {
        const productToAdd = products.find(p => p.id === productId);
        if (!productToAdd) return; // Product not found

        const existingCartItem = cart.find(item => item.id === productId);

        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }
        saveCart(); // Save cart to localStorage
        updateCartDisplay();
        showCartNotification(productToAdd.name); // Optional: Show notification
    }

    // Function to remove item from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart(); // Save cart to localStorage
        updateCartDisplay();
    }

    // Function to update cart quantity (Optional - can be added)
    // function updateCartQuantity(productId, newQuantity) { ... }

    // Function to update the cart display (sidebar, count, total)
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ''; // Clear existing items
        let totalItems = 0;
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                cartItemDiv.innerHTML = `
                    <span>${item.name} (x${item.quantity})</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-from-cart-btn" data-id="${item.id}">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);

                totalItems += item.quantity;
                totalPrice += item.price * item.quantity;
            });
        }

        cartCountSpan.textContent = totalItems;
        cartTotalSpan.textContent = totalPrice.toFixed(2);
    }

    // Function to save cart to localStorage
    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // Function to toggle cart sidebar visibility
    function toggleCartSidebar() {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('open');
    }

    // Function to show a simple notification (Optional)
    function showCartNotification(productName) {
        // You could implement a more sophisticated notification system
        console.log(`${productName} added to cart!`);
        // Example: Briefly highlight the cart button
        cartButton.style.transform = 'scale(1.1)';
        setTimeout(() => {
             cartButton.style.transform = 'scale(1)';
        }, 300);
    }

    // --- Event Listeners ---

    // Add to Cart button clicks (using event delegation)
    productList.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });

    // Remove from Cart button clicks (using event delegation)
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart-btn')) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            removeFromCart(productId);
        }
    });

    // Open cart sidebar
    cartButton.addEventListener('click', toggleCartSidebar);

    // Close cart sidebar
    closeCartBtn.addEventListener('click', toggleCartSidebar);
    cartOverlay.addEventListener('click', toggleCartSidebar); // Close on overlay click

    // Checkout button (demo)
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert(`Thank you for your order! Total: $${cartTotalSpan.textContent}\n(This is a demo - no real transaction occurred)`);
        // Optionally clear cart after "checkout"
        cart = [];
        saveCart();
        updateCartDisplay();
        toggleCartSidebar(); // Close cart after checkout
    });


    // --- Initial Page Load ---
    renderProducts();
    updateCartDisplay(); // Update display based on loaded cart (from localStorage)
});
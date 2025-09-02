document.addEventListener('DOMContentLoaded', function () {
    // --- SELECTORS ---
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartModalEl = document.getElementById('cartModal');
    const cartModal = new bootstrap.Modal(cartModalEl);
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalEl = document.getElementById('cart-total');
    const viewCartBtn = document.getElementById('view-cart-btn');
    const cartItemCount = document.getElementById('cart-item-count');
    const deliveryModalEl = document.getElementById('deliveryInfoModal');
    const deliveryModal = new bootstrap.Modal(deliveryModalEl);
    const confirmDeliveryBtn = document.getElementById('confirm-delivery-btn');
    const isGiftCheck = document.getElementById('isGiftCheck');
    const giftMessageContainer = document.getElementById('giftMessageContainer');
    const deliveryForm = document.getElementById('delivery-form');

    // --- STATE ---
    let cartItems = [];
    let pendingCartItem = null; // To hold item details before delivery confirmation

    // --- FUNCTIONS ---

    /**
     * Loads cart items from localStorage.
     */
    function loadCartFromStorage() {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            cartItems = JSON.parse(storedCart);
            updateCartDisplay();
        }
    }

    /**
     * Saves the current cart items to localStorage.
     */
    function saveCartToStorage() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    /**
     * Updates all visible parts of the cart (item list, total, icon count).
     */
    function updateCartDisplay() {
        displayCartItems();
        updateCartTotal();
        updateCartIconCount();
    }

    /**
     * Renders the items from the cartItems array into the cart modal.
     */
    function displayCartItems() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = ''; // Clear current items

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
            return;
        }

        cartItems.forEach((item, index) => {
            const cartItemHTML = `
                <div class="cart-item d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 8px;">
                        <div>
                            <h6 class="mb-0">${item.title}</h6>
                            ${item.size ? `<small class="text-muted">Size: ${item.size}</small><br>` : ''}
                            <small class="text-muted">Qty: ${item.quantity} @ $${item.price.toFixed(2)}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="fw-bold me-3">$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="btn btn-sm btn-outline-danger remove-from-cart-btn" data-index="${index}" title="Remove item">&times;</button>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });
    }

    /**
     * Calculates and displays the total price of all items in the cart.
     */
    function updateCartTotal() {
        if (!cartTotalEl) return;
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalEl.textContent = `$${total.toFixed(2)}`;
    }

    /**
     * Updates the cart item count badge.
     */
    function updateCartIconCount() {
        if (!cartItemCount) return;
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartItemCount.textContent = totalItems;
        cartItemCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }

    /**
     * Handles removing an item from the cart using its index.
     * @param {Event} e The click event.
     */
    function handleRemoveFromCart(e) {
        if (!e.target.classList.contains('remove-from-cart-btn')) return;

        const indexToRemove = parseInt(e.target.dataset.index);
        if (!isNaN(indexToRemove) && cartItems[indexToRemove]) {
            cartItems.splice(indexToRemove, 1);
            saveCartToStorage();
            updateCartDisplay();
        }
    }

    /**
     * Opens the delivery info modal and stores the pending item's details.
     * @param {Event} e The click event from the "Add to Cart" button.
     */
    function handleOpenDeliveryModal(e) {
        const btn = e.currentTarget;
        const productModalEl = btn.closest('.modal');

        // 1. Get product details from the product modal
        const title = productModalEl.querySelector('#modal-product-title').textContent;
        const price = parseFloat(productModalEl.querySelector('#modal-product-price').textContent.replace('$', ''));
        const image = productModalEl.querySelector('#modal-product-image').src;
        const quantity = parseInt(productModalEl.querySelector('#quantity').value);
        const sizeSelector = productModalEl.querySelector('#modal-product-size');
        const size = sizeSelector ? sizeSelector.value : null;

        // 2. Store these details in our temporary state variable
        pendingCartItem = { title, price, image, quantity, size };

        // 3. Hide the current product modal
        const productModal = bootstrap.Modal.getInstance(productModalEl);
        productModal.hide();

        // 4. Reset and show the new delivery modal
        if (deliveryForm) deliveryForm.reset();
        if (giftMessageContainer) giftMessageContainer.style.display = 'none';
        deliveryModal.show();
    }

    /**
     * Reads delivery info, adds the pending item to the cart, and closes the modal.
     */
    function handleConfirmDeliveryAndAddToCart() {
        // In a real app, you would validate and save this form data to a server.
        const deliveryData = {
            fullName: document.getElementById('fullName').value,
            address: document.getElementById('address').value,
            isGift: isGiftCheck.checked,
            giftMessage: document.getElementById('giftMessage').value
        };
        console.log('Delivery Info Captured:', deliveryData);

        if (!pendingCartItem) {
            console.error("No pending item to add to cart.");
            return;
        }

        // Add the pending item to the cart using existing logic
        const { title, size } = pendingCartItem;
        const existingItem = cartItems.find(item => item.title === title && item.size === size);

        if (existingItem) {
            existingItem.quantity += pendingCartItem.quantity;
        } else {
            cartItems.push(pendingCartItem);
        }

        pendingCartItem = null; // Clear the pending item
        saveCartToStorage();
        updateCartDisplay();
        deliveryModal.hide();
    }

    // --- EVENT LISTENERS ---
    addToCartBtns.forEach(btn => btn.addEventListener('click', handleOpenDeliveryModal));
    if (viewCartBtn) viewCartBtn.addEventListener('click', () => cartModal.show());
    if (cartItemsContainer) cartItemsContainer.addEventListener('click', handleRemoveFromCart);
    if (confirmDeliveryBtn) confirmDeliveryBtn.addEventListener('click', handleConfirmDeliveryAndAddToCart);
    if (isGiftCheck && giftMessageContainer) isGiftCheck.addEventListener('change', () => giftMessageContainer.style.display = isGiftCheck.checked ? 'block' : 'none');

    // --- INITIALIZATION ---
    loadCartFromStorage();
});

class Cart {
    constructor() {
        this.items = [];
        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            // Cart UI elements
            this.cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            this.cartItemsContainer = document.getElementById('cart-items-container');
            this.cartTotalEl = document.getElementById('cart-total');
            this.cartItemCount = document.getElementById('cart-item-count');
            
            // Load saved cart items
            this.loadCartFromStorage();
            
            // Update shop now buttons
            document.querySelectorAll('.shop-now-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.handleShopNowClick(e));
            });
        });
    }

    loadCartFromStorage() {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            this.items = JSON.parse(storedCart);
            this.updateCartDisplay();
        }
    }

    saveCartToStorage() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    addItem(item) {
        this.items.push(item);
        this.saveCartToStorage();
        console.log('Item added to cart:', item);
    }

    clear() {
        this.items = [];
        this.saveCartToStorage();
        console.log('Cart cleared');
    }

    updateCartDisplay() {
        // Update cart icon count
        if (this.cartItemCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            this.cartItemCount.textContent = totalItems;
            this.cartItemCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    }

    async checkout(shippingInfo) {
        try {
            const response = await fetch('http://localhost:3000/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                body: JSON.stringify({
                    orderItems: this.items,
                    shippingInfo
                })
            });

            const data = await response.json();
            if (data.success) {
                // Close all modals first
                const productModal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
                const deliveryModal = bootstrap.Modal.getInstance(document.getElementById('deliveryInfoModal'));
                if (productModal) productModal.hide();
                if (deliveryModal) deliveryModal.hide();
                
                this.clear();
                this.showSuccessPopup(data.total);
                return { success: true };
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            return { success: false, error: error.message };
        }
    }

    showSuccessPopup(total) {
        const popupHTML = `
            <div class="success-backdrop"></div>
            <div class="success-popup">
                <i class="fas fa-check-circle success-icon"></i>
                <h3>Order Placed Successfully!</h3>
                <p>Thank you for shopping with us.</p>
                <p class="total">Total: $${total.toFixed(2)}</p>
                <button class="btn btn-dark" onclick="document.querySelector('.success-popup').remove(); document.querySelector('.success-backdrop').remove();">
                    Continue Shopping
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }

    handleShopNowClick(event) {
        const card = event.target.closest('.card');
        if (!card) return;

        const title = card.querySelector('.card-title').textContent;
        const description = card.querySelector('.card-text').textContent;
        const image = card.querySelector('.card-img-top').src;
        const priceEl = card.querySelector('[data-price]');
        const price = priceEl ? parseFloat(priceEl.dataset.price) : 99.99;

        // Update product modal
        document.getElementById('modal-product-title').textContent = title;
        document.getElementById('modal-product-description').textContent = description;
        document.getElementById('modal-product-image').src = image;
        document.querySelector('.fs-4.me-2.text-dark').textContent = `$${price}`;
    }
}

// Create single cart instance and make it globally available
const cart = new Cart();
window.cart = cart;

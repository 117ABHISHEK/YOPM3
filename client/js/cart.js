document.addEventListener("DOMContentLoaded", function () {
  // --- SELECTORS ---
  const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");
  const cartModalEl = document.getElementById("cartModal");
  const cartModal = new bootstrap.Modal(cartModalEl);
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartTotalEl = document.getElementById("cart-total");
  const viewCartBtn = document.getElementById("view-cart-btn");
  const cartItemCount = document.getElementById("cart-item-count");

  // --- STATE ---
  let cartItems = [];

  // --- FUNCTIONS ---

  /**
   * Loads cart items from localStorage.
   */
  function loadCartFromStorage() {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      cartItems = JSON.parse(storedCart);
      updateCartDisplay();
    }
  }

  /**
   * Saves the current cart items to localStorage.
   */
  function saveCartToStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
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
    cartItemsContainer.innerHTML = ""; // Clear current items

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="text-center">Your cart is empty.</p>';
      return;
    }

    cartItems.forEach((item, index) => {
      const cartItemHTML = `
                <div class="cart-item d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${
        item.title
      }" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 8px;">
                        <div>
                            <h6 class="mb-0">${item.title}</h6>
                            ${
                              item.size
                                ? `<small class="text-muted">Size: ${item.size}</small><br>`
                                : ""
                            }
                            <small class="text-muted">Qty: ${
                              item.quantity
                            } @ $${item.price.toFixed(2)}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="fw-bold me-3">$${(
                          item.price * item.quantity
                        ).toFixed(2)}</span>
                        <button class="btn btn-sm btn-outline-danger remove-from-cart-btn" data-index="${index}" title="Remove item">&times;</button>
                    </div>
                </div>
            `;
      cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);
    });
  }

  /**
   * Calculates and displays the total price of all items in the cart.
   */
  function updateCartTotal() {
    if (!cartTotalEl) return;
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  /**
   * Updates the cart item count badge.
   */
  function updateCartIconCount() {
    if (!cartItemCount) return;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCount.textContent = totalItems;
    cartItemCount.style.display = totalItems > 0 ? "inline-block" : "none";
  }

  /**
   * Handles the logic for adding an item to the cart.
   * @param {Event} e The click event.
   */
  function handleAddToCart(e) {
    const btn = e.currentTarget;
    const modal = btn.closest(".modal");
    const title = modal.querySelector("#modal-product-title").textContent;
    const price = parseFloat(
      modal.querySelector("#modal-product-price").textContent.replace("$", "")
    );
    const image = modal.querySelector("#modal-product-image").src;
    const quantity = parseInt(modal.querySelector("#quantity").value);
    const sizeSelector = modal.querySelector("#modal-product-size");
    const size = sizeSelector ? sizeSelector.value : null;

    // An item is unique by its title AND size.
    const existingItem = cartItems.find(
      (item) => item.title === title && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push({ title, price, image, quantity, size });
    }

    saveCartToStorage();
    updateCartDisplay();

    const productModal = bootstrap.Modal.getInstance(modal);
    productModal.hide();
  }

  /**
   * Handles removing an item from the cart using its index.
   * @param {Event} e The click event.
   */
  function handleRemoveFromCart(e) {
    if (!e.target.classList.contains("remove-from-cart-btn")) return;

    const indexToRemove = parseInt(e.target.dataset.index);
    if (!isNaN(indexToRemove) && cartItems[indexToRemove]) {
      cartItems.splice(indexToRemove, 1);
      saveCartToStorage();
      updateCartDisplay();
    }
  }

  // --- EVENT LISTENERS ---
  addToCartBtns.forEach((btn) =>
    btn.addEventListener("click", handleAddToCart)
  );
  if (viewCartBtn)
    viewCartBtn.addEventListener("click", () => cartModal.show());
  if (cartItemsContainer)
    cartItemsContainer.addEventListener("click", handleRemoveFromCart);

  // --- INITIALIZATION ---
  loadCartFromStorage();
});

// Filter logic (from men's.js)
document.addEventListener("DOMContentLoaded", function () {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      const filter = this.getAttribute("data-filter");
      productCards.forEach((card) => {
        if (filter === "all" || card.dataset.category === filter) {
          card.classList.remove("hide");
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  // Modal logic (adapted from men's modal.js)
  const shopNowBtns = document.querySelectorAll(".shop-now-btn");
  const modal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modal-product-title");
  const modalDesc = document.getElementById("modal-product-description");
  const modalImg = document.getElementById("modal-product-image");
  const modalPrice = document.getElementById("modal-product-price");

  shopNowBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const card = btn.closest(".product-card");
      const title = this.dataset.name;
      const price = this.dataset.price;
      const desc = this.dataset.description;
      const img = this.dataset.image;
      modalTitle.textContent = title;
      modalPrice.textContent = "$" + price;
      modalDesc.textContent = desc;
      modalImg.src = img;
      // Log product info on Shop Now click (like men's.js)
      console.log("Shop Now clicked:", { title, desc, img });
    });
  });
});

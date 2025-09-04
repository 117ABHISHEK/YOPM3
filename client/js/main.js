// Place this inside your main DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing code ...

    // --- Order History Modal Logic ---
    const orderHistoryBtn = document.getElementById('order-history-btn');
    const orderModal = document.getElementById('order-history-modal');
    const closeButton = orderModal.querySelector('.close-button');
    const orderHistoryContainer = document.getElementById('order-history-container');

    // This is an example of how you might show the button after login
    // You should integrate this with your existing login success logic
    if (localStorage.getItem('token')) {
        orderHistoryBtn.style.display = 'inline';
    }

    // Function to open the modal and fetch orders
    const showOrderHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to view your order history.');
            return;
        }

        // Show modal with loading state
        orderHistoryContainer.innerHTML = '<p>Loading...</p>';
        orderModal.style.display = 'block';

        try {
            const response = await fetch('/api/orders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch orders.');
            }

            const orders = await response.json();
            displayOrders(orders);

        } catch (error) {
            console.error('Error fetching order history:', error);
            orderHistoryContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        }
    };

    // Function to format and display orders in the modal
    const displayOrders = (orders) => {
        if (orders.length === 0) {
            orderHistoryContainer.innerHTML = '<p>You have no past orders.</p>';
            return;
        }

        const ordersHtml = orders.map(order => `
            <div class="order-item">
                <h3>Order ID: ${order._id}</h3>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <h4>Items:</h4>
                <ul>
                    ${order.orderItems.map(item => `
                        <li>${item.quantity} x ${item.name} (Size: ${item.size || 'N/A'}) - $${item.price.toFixed(2)} each</li>
                    `).join('')}
                </ul>
                <h4>Shipping To:</h4>
                <p>${order.shippingInfo.fullName}, ${order.shippingInfo.address}, ${order.shippingInfo.city}</p>
            </div>
        `).join('');

        orderHistoryContainer.innerHTML = ordersHtml;
    };

    // --- Event Listeners for Modal ---
    if (orderHistoryBtn) {
        orderHistoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showOrderHistory();
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            orderModal.style.display = 'none';
        });
    }

    // Close modal if user clicks on the background overlay
    window.addEventListener('click', (event) => {
        if (event.target == orderModal) {
            orderModal.style.display = 'none';
        }
    });
});
// Navbar: make solid after scroll
(function(){
  const nav = document.getElementById('siteNav');
  const solidClass = 'nav-solid';
  const onScroll = () => {
    const threshold = 80;
    if (window.scrollY > threshold) nav.classList.add(solidClass);
    else nav.classList.remove(solidClass);
  };
  onScroll();
  document.addEventListener('scroll', onScroll, { passive: true });
})();

// Brand intro animation
(function(){
  const intro = document.getElementById('brandIntro');
  const navBrand = document.querySelector('.navbar-brand');

  if (!intro || !navBrand) return;

  window.addEventListener('load', () => {
    // Show intro
    intro.classList.add('active');

    setTimeout(() => {
      // Animate intro to shrink and move towards navbar brand
      intro.classList.add('shrink');

      // Reveal navbar after intro shrinks
      setTimeout(() => {
        intro.style.display = 'none';
        document.body.classList.add('content-ready');
      }, 1600); // match CSS transition duration
    }, 1400); // delay before shrink
  });
})();

// Reveal on intersection (fade-up)
(function(){
  const els = document.querySelectorAll('.fade-up');


  function revealNow() {
    els.forEach(el => el.classList.add('show'));
  }

  if (!('IntersectionObserver' in window)) {
    revealNow();
    return;
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .12 });

  // Delay fade-up until intro finished
  window.addEventListener('load', () => {
    // If there's an intro, wait for it to finish. Otherwise, start right away.
    const delay = intro ? 3000 : 0;

    setTimeout(() => {
      if (document.body.classList.contains('content-ready')) {
        els.forEach(el => io.observe(el));
      }
    }, delay);
  });
})();


document.addEventListener('DOMContentLoaded', () => {
  const productModal = document.getElementById('productModal');

  productModal.addEventListener('show.bs.modal', (event) => {
    // Get the button that triggered the modal
    const button = event.relatedTarget;
    // Find the parent card element
    const card = button.closest('.product-card');

    // Get the product details from the card
    const imageSrc = card.querySelector('.card-img-top').src;
    const title = card.querySelector('.card-title').textContent;
    const description = card.querySelector('.card-text').textContent;

    // Get the modal's elements
    const modalImage = productModal.querySelector('#modal-product-image');
    const modalTitle = productModal.querySelector('#modal-product-title');
    const modalDescription = productModal.querySelector('#modal-product-description');

    // Populate the modal with the new content
    modalImage.src = imageSrc;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
  });
});

// Lookbook Modal Trigger
document.querySelectorAll('.lookbook-tile').forEach(tile => {
  tile.addEventListener('click', () => {
    const img = tile.getAttribute("data-img");
    const title = tile.getAttribute("data-title");
    const desc = tile.getAttribute("data-desc");

    document.getElementById("lookbookImg").src = img;
    document.getElementById("lookbookTitle").textContent = title;
    document.getElementById("lookbookDesc").textContent = desc;

    new bootstrap.Modal(document.getElementById("lookbookModal")).show();
  });
});

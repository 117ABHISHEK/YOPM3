class Auth {
    constructor() {
        this.token = localStorage.getItem('token');
        this.userId = localStorage.getItem('userId');
        this.userName = localStorage.getItem('userName');
        this.initializeUI();
    }

    initializeUI() {
        if (this.isLoggedIn()) {
            this.updateNavbarForUser();
        }
    }

    updateNavbarForUser() {
        const navList = document.querySelector('.navbar-nav');
        const shopNowBtn = document.querySelector('.btn-cta');
        
        if (shopNowBtn) {
            // Replace shop now button with user menu
            shopNowBtn.parentElement.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-cta dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i class="fas fa-user"></i> ${this.userName || 'Account'}
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="orders.html">Order History</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="auth.logout()">Logout</a></li>
                    </ul>
                </div>
            `;
        }
    }

    async login(email, password) {
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (data.token) {
                this.token = data.token;
                this.userId = data.userId;
                this.userName = data.name;
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userName', data.name);
                this.updateNavbarForUser();
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Login failed' };
        }
    }

    isLoggedIn() {
        return !!this.token;
    }

    logout() {
        this.token = null;
        this.userId = null;
        this.userName = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        window.location.href = '/';
    }
}

const auth = new Auth();
window.auth = auth;

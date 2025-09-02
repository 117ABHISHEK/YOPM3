class Auth {
    constructor() {
        this.token = localStorage.getItem('token');
        this.userId = localStorage.getItem('userId');
    }

    isLoggedIn() {
        return !!this.token;
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
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Login failed' };
        }
    }

    logout() {
        this.token = null;
        this.userId = null;
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    }
}

const auth = new Auth();
window.auth = auth;

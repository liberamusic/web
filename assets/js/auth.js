// ========== AUTHENTICATION MODULE ==========
const API_URL = 'https://api.liberamusic.com';
const TOKEN_KEY = 'liberia_token';
const USER_KEY = 'liberia_user';

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const modalClose = document.querySelector('.modal-close');
const loginForm = document.getElementById('loginForm');
const authButtons = document.querySelector('.auth-buttons');
const userMenu = document.getElementById('userMenu');
const userNameSpan = document.getElementById('userName');
const userInitialSpan = document.getElementById('userInitial');
const logoutBtn = document.getElementById('logoutBtn');

// ========== Helper Functions ==========
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

function saveAuthData(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}


function parseJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

// ========== Render Dynamic Menu by Role ==========
function renderDynamicMenu(role) {
    const dynamicMenuContainer = document.querySelector('.dynamic-menu-container');
    if (!dynamicMenuContainer) return;
    
    let menuHTML = '';
    
    switch(role) {
        case 'Admin':
            menuHTML = `
                <li class="dropdown">
                    <a href="#">Quản trị <i class="fas fa-chevron-down"></i></a>
                    <ul class="dropdown-menu">
                        <li><a href="quan-ly-nhan-su.html">Quản lý nhân sự</a></li>
                        <li><a href="quan-ly-hoc-sinh.html">Quản lý học sinh</a></li>
                        <li><a href="quan-ly-phu-huynh.html">Quản lý phụ huynh</a></li>
                        <li><a href="diem-danh.html">Điểm danh</a></li>
                        <li><a href="thanh-toan.html">Thanh toán</a></li>
                        <li><a href="bao-cao-doanh-thu.html">Báo cáo doanh thu</a></li>
                    </ul>
                </li>
            `;
            break;
        case 'GiaoVien':
            menuHTML = `
                <li><a href="diem-danh.html">Điểm danh</a></li>
                <li><a href="lop-cua-toi.html">Lớp của tôi</a></li>
                <li><a href="bao-cao-diem-danh.html">Báo cáo điểm danh</a></li>
            `;
            break;
        case 'LeTan':
            menuHTML = `
                <li><a href="quan-ly-hoc-sinh.html">Quản lý học sinh</a></li>
                <li><a href="diem-danh.html">Điểm danh</a></li>
                <li><a href="thanh-toan.html">Thanh toán</a></li>
            `;
            break;
        case 'PhuHuynh':
            menuHTML = `
                <li><a href="ho-so-con.html">Hồ sơ con</a></li>
                <li><a href="lich-su-thanh-toan.html">Lịch sử thanh toán</a></li>
                <li><a href="diem-danh-cua-con.html">Điểm danh của con</a></li>
            `;
            break;
        default:
            menuHTML = '';
    }
    
    dynamicMenuContainer.innerHTML = menuHTML;
}

// ========== Update UI Based on Login State ==========
function updateUIForLoggedInUser() {
    const user = getUser();
    const token = getToken();
    
    if (token && user) {
        // Hide login buttons, show user menu
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            if (userNameSpan) userNameSpan.textContent = user.name || user.username;
            if (userInitialSpan) userInitialSpan.textContent = (user.name || user.username).charAt(0).toUpperCase();
        }
        
        // Render dynamic menu based on role
        renderDynamicMenu(user.role);
    } else {
        // Show login buttons, hide user menu
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// ========== Login Function ==========
async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Đăng nhập thất bại');
        }
        
        const data = await response.json();
        
        // Parse JWT to get user info
        const decoded = parseJWT(data.token);
        
        const user = {
            username: decoded.unique_name || username,
            name: decoded.name || username,
            role: decoded.role || 'Guest',
            email: decoded.email || username
        };
        
        saveAuthData(data.token, user);
        updateUIForLoggedInUser();
        closeModal();
        showToast('Đăng nhập thành công!', 'success');
        
        // Reload page to refresh menu
        setTimeout(() => window.location.reload(), 1000);
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ========== Logout Function ==========
function logout() {
    clearAuthData();
    updateUIForLoggedInUser();
    showToast('Đã đăng xuất', 'success');
    setTimeout(() => window.location.reload(), 1000);
}

// ========== Modal Functions ==========
function openModal() {
    if (loginModal) loginModal.classList.add('show');
}

function closeModal() {
    if (loginModal) loginModal.classList.remove('show');
}

// ========== Event Listeners ==========
if (loginBtn) {
    loginBtn.addEventListener('click', openModal);
}

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        await login(username, password);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        closeModal();
    }
});

// Check token expiration on page load
function checkTokenExpiration() {
    const token = getToken();
    if (token) {
        const decoded = parseJWT(token);
        if (decoded && decoded.exp) {
            const expTime = decoded.exp * 1000;
            if (Date.now() >= expTime) {
                clearAuthData();
                showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', 'error');
                updateUIForLoggedInUser();
            }
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkTokenExpiration();
    updateUIForLoggedInUser();
});

// Export for use in other files
window.auth = { getToken, getUser, logout };
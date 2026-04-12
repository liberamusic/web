// ========== MAIN.JS - Core Functionality ==========

// ========== Lazy Loading Images (CHỈ ÁP DỤNG CHO ẢNH THƯỜNG, KHÔNG ÁP DỤNG CHO SLIDESHOW) ==========
document.addEventListener('DOMContentLoaded', function() {
    // Chỉ lazy loading cho ảnh trong course-card, product-card, gallery-item - BỎ QUA ẢNH TRONG SLIDESHOW
    const images = document.querySelectorAll('img:not([loading="eager"]):not(.slide img)');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            if (!img.hasAttribute('data-src') && img.src) {
                img.setAttribute('data-src', img.src);
                img.removeAttribute('src');
            }
            imageObserver.observe(img);
        });
    } else {
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
});

// ========== Mobile Menu Toggle ==========
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
}

// ========== Mobile Dropdown for Courses ==========
const dropdowns = document.querySelectorAll('.dropdown');
if (window.innerWidth <= 992) {
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        if (dropdownLink) {
            dropdownLink.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });
}

// ========== Gallery Tabs (Thư viện page) ==========
function initGalleryTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length && tabContents.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(`tab-${tabId}`).classList.add('active');
            });
        });
    }
}

// ========== Product Filter (Sản phẩm page) ==========
function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    if (filterBtns.length && productCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                productCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

// ========== Lightbox for Gallery ==========
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    if (galleryItems.length) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 3000;
            cursor: pointer;
            align-items: center;
            justify-content: center;
        `;
        
        const lightboxImg = document.createElement('img');
        lightboxImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        `;
        lightbox.appendChild(lightboxImg);
        document.body.appendChild(lightbox);
        
        galleryItems.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.style.display = 'flex';
            });
        });
        
        lightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }
}

// ========== Smooth Scroll ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== Header Scroll Effect ==========
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        }
    }
});

// ========== Initialize All ==========
document.addEventListener('DOMContentLoaded', () => {
    initGalleryTabs();
    initProductFilters();
    initLightbox();
});

// ========== HERO SLIDESHOW (CHỈNH SỬA: 10 ẢNH) ==========
class HeroSlideshow {
    constructor() {
        this.slides = [];
        this.currentIndex = 0;
        this.totalSlides = 10; // ĐÃ SỬA: từ 25 xuống 10 ảnh
        this.interval = null;
        this.autoPlayDelay = 5000;
        this.slideElements = [];
        this.dotElements = [];
        
        this.init();
    }
    
    init() {
        // Danh sách ảnh thực tế (bỏ qua số 4 vì không có)
        const imageNumbers = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11];
        
        for (let i = 0; i < imageNumbers.length; i++) {
            this.slides.push(`images/Hero/Hero-day-hoc-piano-tai-thai-nguyen-${imageNumbers[i]}.jpg`);
        }
        
        console.log('Đã tạo', this.slides.length, 'slide với các ảnh:', this.slides);
        
        this.renderSlides();
        this.startAutoPlay();
        this.addEventListeners();
    }
    
    renderSlides() {
        const container = document.getElementById('heroSlideshow');
        const dotsContainer = document.getElementById('slideDots');
        
        if (!container) {
            console.error('Không tìm thấy container heroSlideshow');
            return;
        }
        
        // Xóa nội dung cũ
        container.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        // Tạo các slide - DÙNG BACKGROUND-IMAGE ĐỂ TRÁNH LỖI
        this.slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
            slideDiv.style.backgroundImage = `url('${slide}')`;
            slideDiv.style.backgroundSize = 'cover';
            slideDiv.style.backgroundPosition = 'center';
            slideDiv.style.backgroundRepeat = 'no-repeat';
            
            container.appendChild(slideDiv);
        });
        
        // Tạo dấu chấm
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.dataset.index = i;
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        
        // Lưu references
        this.slideElements = document.querySelectorAll('.slide');
        this.dotElements = document.querySelectorAll('.dot');
        
        console.log('Đã tạo', this.slideElements.length, 'slide elements');
    }
    
    goToSlide(index) {
        if (index === this.currentIndex) return;
        if (!this.slideElements.length) return;
        
        this.slideElements[this.currentIndex].classList.remove('active');
        this.dotElements[this.currentIndex].classList.remove('active');
        
        this.currentIndex = index;
        
        this.slideElements[this.currentIndex].classList.add('active');
        this.dotElements[this.currentIndex].classList.add('active');
        
        this.resetAutoPlay();
    }
    
    nextSlide() {
        let nextIndex = this.currentIndex + 1;
        if (nextIndex >= this.totalSlides) {
            nextIndex = 0;
        }
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        let prevIndex = this.currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.totalSlides - 1;
        }
        this.goToSlide(prevIndex);
    }
    
    startAutoPlay() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    resetAutoPlay() {
        if (this.interval) {
            clearInterval(this.interval);
            this.startAutoPlay();
        }
    }
    
    addEventListeners() {
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        const heroSection = document.querySelector('.hero-slideshow');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                if (this.interval) clearInterval(this.interval);
            });
            
            heroSection.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }
    }
}

// Khởi tạo slideshow khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.hero-slideshow')) {
        if (!window.heroSlideshowInstance) {
            window.heroSlideshowInstance = new HeroSlideshow();
        }
    }
});
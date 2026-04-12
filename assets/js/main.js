// ========== MAIN.JS - Core Functionality ==========

// ========== Lazy Loading Images ==========
document.addEventListener('DOMContentLoaded', function() {
    // Lazy loading for images
    const images = document.querySelectorAll('img:not([loading="eager"])');
    
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
        // Create lightbox overlay
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

// ========== HERO SLIDESHOW ==========
class HeroSlideshow {
    constructor() {
        this.slides = [];
        this.currentIndex = 0;
        this.totalSlides = 25; // Từ 1 đến 25
        this.interval = null;
        this.autoPlayDelay = 5000; // 5 giây chuyển slide
        this.slideElements = [];
        this.dotElements = [];
        
        this.init();
    }
    
    init() {
        // Tạo danh sách ảnh
        for (let i = 1; i <= this.totalSlides; i++) {
            this.slides.push(`images/Hero/day-hoc-piano-tai-thai-nguyen-${i}.jpg`);
        }
        
        this.renderSlides();
        this.startAutoPlay();
        this.addEventListeners();
    }
    
    renderSlides() {
        const container = document.getElementById('heroSlideshow');
        const dotsContainer = document.getElementById('slideDots');
        
        if (!container) return;
        
        // Tạo các slide
        this.slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
            
            const img = document.createElement('img');
            img.src = slide;
            img.alt = `LIBERA Music School - Học âm nhạc tại Thái Nguyên`;
            img.loading = 'lazy';
            
            slideDiv.appendChild(img);
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
    }
    
    goToSlide(index) {
        if (index === this.currentIndex) return;
        
        // Xóa active class
        this.slideElements[this.currentIndex].classList.remove('active');
        this.dotElements[this.currentIndex].classList.remove('active');
        
        this.currentIndex = index;
        
        // Thêm active class cho slide mới
        this.slideElements[this.currentIndex].classList.add('active');
        this.dotElements[this.currentIndex].classList.add('active');
        
        // Reset timer khi chuyển slide thủ công
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
        
        // Dừng auto play khi hover vào hero
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
        new HeroSlideshow();
    }
});
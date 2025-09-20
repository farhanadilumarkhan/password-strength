// Password Security Tools - Main JavaScript File

// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        this.body.className = this.body.className.replace(/light-mode|dark-mode/g, '');
        this.body.classList.add(theme + '-mode');
        localStorage.setItem('theme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        this.init();
    }
    
    init() {
        this.mobileMenuToggle.addEventListener('click', () => this.toggleMenu());
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.mobileMenu.contains(e.target) && !this.mobileMenuToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.mobileMenu.classList.toggle('open');
        this.mobileMenuToggle.classList.toggle('active');
    }
    
    closeMenu() {
        this.mobileMenu.classList.remove('open');
        this.mobileMenuToggle.classList.remove('active');
    }
}

// Dropdown Navigation
class DropdownNavigation {
    constructor() {
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
        
        this.init();
    }
    
    init() {
        // Handle desktop dropdowns
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (toggle && menu) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleDropdown(dropdown);
                });
            }
        });
        
        // Handle mobile dropdowns
        this.mobileDropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
            const menu = dropdown.querySelector('.mobile-dropdown-menu');
            
            if (toggle && menu) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleMobileDropdown(dropdown);
                });
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown') && !e.target.closest('.mobile-dropdown')) {
                this.closeAllDropdowns();
            }
        });
        
        // Close dropdowns on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });
    }
    
    toggleDropdown(dropdown) {
        const isOpen = dropdown.classList.contains('open');
        
        // Close all other dropdowns first
        this.closeAllDropdowns();
        
        // Toggle current dropdown
        if (!isOpen) {
            dropdown.classList.add('open');
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'true');
            }
        }
    }
    
    toggleMobileDropdown(dropdown) {
        const isOpen = dropdown.classList.contains('open');
        
        // Close all other mobile dropdowns first
        this.closeAllMobileDropdowns();
        
        // Toggle current dropdown
        if (!isOpen) {
            dropdown.classList.add('open');
            const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'true');
            }
        } else {
            dropdown.classList.remove('open');
            const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
        }
    }
    
    closeAllDropdowns() {
        this.dropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    closeAllMobileDropdowns() {
        this.mobileDropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
            const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Password Strength Checker
class PasswordChecker {
    constructor() {
        this.passwordInput = document.getElementById('passwordInput');
        this.toggleVisibility = document.getElementById('toggleVisibility');
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthFeedback = document.getElementById('strengthFeedback');
        this.criteriaList = document.getElementById('criteriaList');
        
        this.criteria = {
            length: { element: document.getElementById('lengthCriteria'), test: (pwd) => pwd.length >= 8 },
            uppercase: { element: document.getElementById('uppercaseCriteria'), test: (pwd) => /[A-Z]/.test(pwd) },
            lowercase: { element: document.getElementById('lowercaseCriteria'), test: (pwd) => /[a-z]/.test(pwd) },
            number: { element: document.getElementById('numberCriteria'), test: (pwd) => /\d/.test(pwd) },
            special: { element: document.getElementById('specialCriteria'), test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd) }
        };
        
        this.init();
    }
    
    init() {
        this.passwordInput.addEventListener('input', (e) => this.checkStrength(e.target.value));
        this.toggleVisibility.addEventListener('click', () => this.togglePasswordVisibility());
    }
    
    checkStrength(password) {
        if (!password) {
            this.resetStrength();
            return;
        }
        
        const results = this.evaluatePassword(password);
        this.updateUI(results);
    }
    
    evaluatePassword(password) {
        let score = 0;
        let metCriteria = 0;
        
        // Check basic criteria
        Object.keys(this.criteria).forEach(key => {
            const criterion = this.criteria[key];
            const met = criterion.test(password);
            
            criterion.element.classList.toggle('met', met);
            criterion.element.querySelector('.criteria-icon').textContent = met ? '✓' : '×';
            
            if (met) {
                metCriteria++;
                score += 20; // Each criterion is worth 20 points
            }
        });
        
        // Bonus scoring
        if (password.length >= 12) score += 10;
        if (password.length >= 16) score += 10;
        if (/[A-Z].*[A-Z]/.test(password)) score += 5; // Multiple uppercase
        if (/\d.*\d/.test(password)) score += 5; // Multiple numbers
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 5; // Multiple specials
        
        // Penalties
        if (/(.)\1{2,}/.test(password)) score -= 15; // Repeated characters
        if (/012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) score -= 15; // Sequential characters
        if (/password|123456|qwerty|admin|login|welcome|letmein|monkey|dragon|master|hello|freedom|shadow|michael|jordan|superman|batman/i.test(password)) score -= 25; // Common words
        
        score = Math.max(0, Math.min(100, score));
        
        let strength, strengthText;
        if (score < 25) {
            strength = 'weak';
            strengthText = 'Weak - This password is easily guessable';
        } else if (score < 50) {
            strength = 'fair';
            strengthText = 'Fair - This password could be stronger';
        } else if (score < 75) {
            strength = 'good';
            strengthText = 'Good - This is a decent password';
        } else {
            strength = 'strong';
            strengthText = 'Strong - This is a very secure password';
        }
        
        return { strength, strengthText, score, metCriteria };
    }
    
    updateUI(results) {
        const { strength, strengthText, score, metCriteria } = results;
        
        // Update strength bar
        this.strengthBar.className = `strength-bar ${strength}`;
        
        // Update strength text
        const strengthTextElement = this.strengthFeedback.querySelector('.strength-text');
        strengthTextElement.textContent = strengthText;
        strengthTextElement.className = `strength-text ${strength}`;
    }
    
    resetStrength() {
        this.strengthBar.className = 'strength-bar';
        
        const strengthTextElement = this.strengthFeedback.querySelector('.strength-text');
        strengthTextElement.textContent = 'Enter a password to see its strength';
        strengthTextElement.className = 'strength-text';
        
        Object.keys(this.criteria).forEach(key => {
            const criterion = this.criteria[key];
            criterion.element.classList.remove('met');
            criterion.element.querySelector('.criteria-icon').textContent = '×';
        });
    }
    
    togglePasswordVisibility() {
        const isPassword = this.passwordInput.type === 'password';
        this.passwordInput.type = isPassword ? 'text' : 'password';
        
        const eyeOpen = this.toggleVisibility.querySelector('.eye-open');
        const eyeClosed = this.toggleVisibility.querySelector('.eye-closed');
        
        if (isPassword) {
            eyeOpen.style.display = 'none';
            eyeClosed.style.display = 'block';
        } else {
            eyeOpen.style.display = 'block';
            eyeClosed.style.display = 'none';
        }
    }
}

// Password Generator
class PasswordGenerator {
    constructor() {
        this.generatedPassword = document.getElementById('generatedPassword');
        this.copyButton = document.getElementById('copyButton');
        this.generateButton = document.getElementById('generateButton');
        this.lengthSlider = document.getElementById('lengthSlider');
        this.lengthValue = document.getElementById('lengthValue');
        
        this.options = {
            includeUppercase: document.getElementById('includeUppercase'),
            includeLowercase: document.getElementById('includeLowercase'),
            includeNumbers: document.getElementById('includeNumbers'),
            includeSymbols: document.getElementById('includeSymbols'),
            excludeAmbiguous: document.getElementById('excludeAmbiguous')
        };
        
        this.characterSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            ambiguous: '0O1lI'
        };
        
        this.init();
    }
    
    init() {
        if (!this.generatedPassword || !this.generateButton || !this.copyButton || !this.lengthSlider || !this.lengthValue) {
            console.warn('Password generator elements not found on this page');
            return;
        }

        // Check if all option elements exist
        const missingOptions = Object.keys(this.options).filter(key => !this.options[key]);
        if (missingOptions.length > 0) {
            console.warn('Missing password generator options:', missingOptions);
            return;
        }

        this.lengthSlider.addEventListener('input', (e) => this.updateLength(e.target.value));
        this.generateButton.addEventListener('click', () => this.generatePassword());
        this.copyButton.addEventListener('click', () => this.copyPassword());
        
        // Generate initial password
        this.generatePassword();
    }
    
    updateLength(value) {
        this.lengthValue.textContent = value;
    }
    
    generatePassword() {
        const length = parseInt(this.lengthSlider.value);
        let charset = '';
        
        // Build character set based on options
        if (this.options.includeUppercase.checked) charset += this.characterSets.uppercase;
        if (this.options.includeLowercase.checked) charset += this.characterSets.lowercase;
        if (this.options.includeNumbers.checked) charset += this.characterSets.numbers;
        if (this.options.includeSymbols.checked) charset += this.characterSets.symbols;
        
        // Remove ambiguous characters if excluded
        if (this.options.excludeAmbiguous.checked) {
            this.characterSets.ambiguous.split('').forEach(char => {
                charset = charset.replace(new RegExp(char, 'g'), '');
            });
        }
        
        if (charset === '') {
            alert('Please select at least one character type');
            return;
        }
        
        // Generate password using crypto API for security
        const password = this.secureRandomString(length, charset);
        this.generatedPassword.value = password;
        
        // Reset copy button state
        this.copyButton.classList.remove('copied');
    }
    
    secureRandomString(length, charset) {
        let result = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            result += charset[array[i] % charset.length];
        }
        
        return result;
    }
    
    copyPassword() {
        if (!this.generatedPassword || !this.generatedPassword.value) {
            console.warn('No password to copy');
            return;
        }

        // Show immediate feedback
        const originalText = this.copyButton.innerHTML;
        
        // Try modern clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(this.generatedPassword.value).then(() => {
                this.showCopySuccess();
            }).catch(err => {
                console.warn('Clipboard API failed, using fallback:', err);
                this.fallbackCopy();
            });
        } else {
            // Use fallback method
            this.fallbackCopy();
        }
    }

    fallbackCopy() {
        try {
            // Create a temporary textarea element
            const textArea = document.createElement('textarea');
            textArea.value = this.generatedPassword.value;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                this.showCopySuccess();
            } else {
                console.warn('Copy command failed');
                this.showCopyError();
            }
        } catch (err) {
            console.error('Copy failed:', err);
            this.showCopyError();
        }
    }

    showCopySuccess() {
        this.copyButton.classList.add('copied');
        
        // Change icon to checkmark temporarily
        const copyIcon = this.copyButton.querySelector('.copy-icon');
        const checkIcon = this.copyButton.querySelector('.check-icon');
        
        if (copyIcon && checkIcon) {
            copyIcon.style.display = 'none';
            checkIcon.style.display = 'block';
        }
        
        setTimeout(() => {
            this.copyButton.classList.remove('copied');
            if (copyIcon && checkIcon) {
                copyIcon.style.display = 'block';
                checkIcon.style.display = 'none';
            }
        }, 2000);
    }

    showCopyError() {
        // Select the text so user can manually copy
        this.generatedPassword.select();
        this.generatedPassword.setSelectionRange(0, 99999); // For mobile devices
    }
}

// FAQ Accordion
class FAQAccordion {
    constructor() {
        this.faqQuestions = document.querySelectorAll('.faq-question');
        this.init();
    }
    
    init() {
        this.faqQuestions.forEach(question => {
            question.addEventListener('click', () => this.toggleFAQ(question));
        });
    }
    
    toggleFAQ(question) {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQs
        this.faqQuestions.forEach(q => {
            if (q !== question) {
                q.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Toggle current FAQ
        question.setAttribute('aria-expanded', !isExpanded);
    }
}

// Smooth Scrolling for Navigation Links
class SmoothScrolling {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        this.init();
    }
    
    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
        
        // Update active nav link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
    }
    
    handleClick(e) {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    updateActiveLink() {
        const sections = ['home', 'generator', 'faq'];
        const scrollPosition = window.scrollY + 120;
        
        let currentSection = 'home';
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section && scrollPosition >= section.offsetTop) {
                currentSection = sectionId;
            }
        });
        
        // Update nav link active state
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Form Validation and Enhancement
class FormEnhancements {
    constructor() {
        this.inputs = document.querySelectorAll('input, textarea');
        this.init();
    }
    
    init() {
        this.inputs.forEach(input => {
            // Add focus/blur effects
            input.addEventListener('focus', () => this.handleFocus(input));
            input.addEventListener('blur', () => this.handleBlur(input));
        });
    }
    
    handleFocus(input) {
        input.parentElement.classList.add('focused');
    }
    
    handleBlur(input) {
        input.parentElement.classList.remove('focused');
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images if any
        this.lazyLoadImages();
        
        // Optimize scroll events
        this.optimizeScrollEvents();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    optimizeScrollEvents() {
        const scrollHandler = Utils.throttle(() => {
            // Handle scroll-based animations or effects
            this.handleScrollAnimations();
        }, 16); // ~60fps
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }
    
    handleScrollAnimations() {
        const cards = document.querySelectorAll('.feature-card, .faq-item');
        cards.forEach(card => {
            if (Utils.isInViewport(card)) {
                card.classList.add('animate-in');
            }
        });
    }
    
    preloadCriticalResources() {
        // Preload Google Fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.as = 'style';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
        document.head.appendChild(fontLink);
    }
}

// Accessibility Enhancements
class AccessibilityManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupKeyboardNavigation();
        this.enhanceScreenReaderSupport();
        this.setupFocusManagement();
    }
    
    setupKeyboardNavigation() {
        // Handle keyboard navigation for custom components
        document.addEventListener('keydown', (e) => {
            // Escape key closes mobile menu
            if (e.key === 'Escape') {
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu.classList.contains('open')) {
                    const nav = new MobileNavigation();
                    nav.closeMenu();
                }
            }
            
            // Space/Enter for FAQ questions
            if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('faq-question')) {
                e.preventDefault();
                e.target.click();
            }
        });
    }
    
    enhanceScreenReaderSupport() {
        // Add live regions for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'liveRegion';
        document.body.appendChild(liveRegion);
        
        // Announce password strength changes
        const passwordInput = document.getElementById('passwordInput');
        if (passwordInput) {
            passwordInput.addEventListener('input', Utils.debounce((e) => {
                const strength = document.querySelector('.strength-text').textContent;
                if (strength && strength !== 'Enter a password to see its strength') {
                    liveRegion.textContent = strength;
                }
            }, 1000));
        }
    }
    
    setupFocusManagement() {
        // Ensure proper focus management for dynamic content
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                // Focus remains on the question for screen readers
                setTimeout(() => question.focus(), 100);
            });
        });
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (!this.contactForm) return;
        
        this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        const requiredFields = this.contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }
    
    validateField(field) {
        const isValid = field.value.trim() !== '';
        const isEmail = field.type === 'email' && field.value.trim() !== '';
        
        if (field.hasAttribute('required') && !isValid) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        if (isEmail && !this.isValidEmail(field.value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = 'var(--danger)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--danger);
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    clearFieldError(field) {
        field.style.borderColor = '';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const requiredFields = this.contactForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showSubmissionMessage('Please correct the errors above and try again.', 'error');
            return;
        }
        
        // Simulate form submission
        this.showSubmissionMessage('Message sent successfully! This is a demonstration - in a live environment, your message would be sent to our support team.', 'success');
        
        // Reset form after successful submission
        setTimeout(() => {
            this.contactForm.reset();
        }, 2000);
    }
    
    showSubmissionMessage(message, type) {
        // Remove existing message
        const existingMessage = this.contactForm.querySelector('.submission-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'submission-message';
        messageDiv.textContent = message;
        
        const backgroundColor = type === 'success' ? 'var(--success-light)' : 'var(--danger-light)';
        const textColor = type === 'success' ? 'var(--success)' : 'var(--danger)';
        
        messageDiv.style.cssText = `
            background-color: ${backgroundColor};
            color: ${textColor};
            padding: 1rem;
            border-radius: 0.375rem;
            margin-bottom: 1rem;
            border: 1px solid ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
        `;
        
        // Insert at the top of the form
        this.contactForm.insertBefore(messageDiv, this.contactForm.firstChild);
        
        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }
}

// Main Application Controller
class PasswordSecurityApp {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            // Initialize core components that should always be available
            this.components.themeManager = new ThemeManager();
            this.components.mobileNav = new MobileNavigation();
            this.components.dropdownNav = new DropdownNavigation();
            this.components.smoothScrolling = new SmoothScrolling();
            this.components.formEnhancements = new FormEnhancements();
            this.components.performanceOptimizer = new PerformanceOptimizer();
            this.components.accessibilityManager = new AccessibilityManager();
            
            // Conditionally initialize PasswordChecker only if passwordInput element exists
            if (document.getElementById('passwordInput')) {
                this.components.passwordChecker = new PasswordChecker();
                console.log('PasswordChecker initialized');
            } else {
                console.log('PasswordChecker not initialized - passwordInput element not found');
            }
            
            // Conditionally initialize PasswordGenerator only if generateButton element exists
            if (document.getElementById('generateButton')) {
                this.components.passwordGenerator = new PasswordGenerator();
                console.log('PasswordGenerator initialized');
            } else {
                console.log('PasswordGenerator not initialized - generateButton element not found');
            }
            
            // Initialize page-specific components if they exist
            if (document.getElementById('faqAccordion') || document.querySelector('.faq-item')) {
                this.components.faqAccordion = new FAQAccordion();
            }
            
            if (document.getElementById('contactForm')) {
                this.components.contactForm = new ContactForm();
            }
            
            console.log('Password Security App initialized successfully');
        } catch (error) {
            console.error('Error initializing Password Security App:', error);
        }
    }
    
    // Public API methods for external use
    checkPassword(password) {
        if (this.components.passwordChecker) {
            return this.components.passwordChecker.evaluatePassword(password);
        } else {
            console.warn('PasswordChecker not initialized on this page');
            return null;
        }
    }
    
    generatePassword(options = {}) {
        if (this.components.passwordGenerator) {
            const generator = this.components.passwordGenerator;
            
            // Apply options if provided
            Object.keys(options).forEach(key => {
                if (generator.options[key]) {
                    generator.options[key].checked = options[key];
                }
            });
            
            generator.generatePassword();
            return generator.generatedPassword.value;
        } else {
            console.warn('PasswordGenerator not initialized on this page');
            return null;
        }
    }
}

// Initialize the application
const app = new PasswordSecurityApp();

// Expose app to global scope for debugging
window.PasswordSecurityApp = app;
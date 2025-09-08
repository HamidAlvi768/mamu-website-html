<!--==============================
    Search Popup Component
==============================-->
<div class="popup-search-box" id="searchPopup">
    <button class="searchClose" id="searchClose"><i class="fal fa-times"></i></button>
    <form action="#" id="searchForm">
        <input type="text" placeholder="What are you looking for?" id="searchInput" autocomplete="off">
        <button type="submit"><i class="fal fa-search"></i></button>
    </form>
</div>

<!-- Search JavaScript -->
<script>
(function() {
    'use strict';
    
    // Search functionality configuration
    const SearchConfig = {
        selectors: {
            popup: '#searchPopup',
            toggle: '.searchBoxToggler',
            close: '#searchClose',
            form: '#searchForm',
            input: '#searchInput'
        },
        classes: {
            show: 'show',
            loading: 'loading'
        },
        animation: {
            duration: 400,
            delay: 500
        }
    };

    // Search functionality class
    class SearchPopup {
        constructor(config) {
            this.config = config;
            this.popup = document.querySelector(config.selectors.popup);
            this.toggleButtons = document.querySelectorAll(config.selectors.toggle);
            this.closeButton = document.querySelector(config.selectors.close);
            this.form = document.querySelector(config.selectors.form);
            this.input = document.querySelector(config.selectors.input);
            
            this.isOpen = false;
            this.isInitialized = false;
            
            this.init();
        }

        init() {
            if (!this.popup) {
                console.warn('Search popup element not found');
                return;
            }

            this.bindEvents();
            this.isInitialized = true;
            console.log('Search popup initialized successfully');
        }

        bindEvents() {
            // Toggle search popup
            this.toggleButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.open();
                });
            });

            // Close search popup
            if (this.closeButton) {
                this.closeButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.close();
                });
            }

            // Close on popup background click
            this.popup.addEventListener('click', (e) => {
                if (e.target === this.popup) {
                    this.close();
                }
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // Handle form submission
            if (this.form) {
                this.form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleSearch();
                });
            }

            // Focus input when opened
            this.popup.addEventListener('transitionend', () => {
                if (this.isOpen && this.input) {
                    this.input.focus();
                }
            });
        }

        open() {
            if (!this.isInitialized) {
                console.warn('Search popup not initialized');
                return;
            }

            this.popup.classList.add(this.config.classes.show);
            this.isOpen = true;
            
            // Add body scroll lock
            document.body.style.overflow = 'hidden';
            
            console.log('Search popup opened');
        }

        close() {
            if (!this.isInitialized) return;

            this.popup.classList.remove(this.config.classes.show);
            this.isOpen = false;
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Clear input
            if (this.input) {
                this.input.value = '';
            }
            
            console.log('Search popup closed');
        }

        handleSearch() {
            const searchTerm = this.input ? this.input.value.trim() : '';
            
            if (!searchTerm) {
                console.log('Empty search term');
                return;
            }

            console.log('Searching for:', searchTerm);
            
            // Add loading state
            this.popup.classList.add(this.config.classes.loading);
            
            // Simulate search (replace with actual search implementation)
            setTimeout(() => {
                this.popup.classList.remove(this.config.classes.loading);
                this.close();
                
                // Here you can implement actual search functionality
                // For now, we'll just log the search term
                alert(`Search functionality would search for: "${searchTerm}"`);
            }, 1000);
        }

        // Public methods for external access
        getState() {
            return {
                isOpen: this.isOpen,
                isInitialized: this.isInitialized
            };
        }

        destroy() {
            // Clean up event listeners if needed
            this.isInitialized = false;
            console.log('Search popup destroyed');
        }
    }

    // Initialize search popup when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.searchPopup = new SearchPopup(SearchConfig);
        });
    } else {
        window.searchPopup = new SearchPopup(SearchConfig);
    }

    // Expose for debugging
    window.SearchPopup = SearchPopup;
    window.SearchConfig = SearchConfig;

})();
</script>

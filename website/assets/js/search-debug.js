/**
 * Search Popup Debug Script
 * Use this script to debug search functionality issues
 */

(function() {
    'use strict';
    
    // Debug configuration
    const DebugConfig = {
        enabled: true,
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
        showConsole: true
    };
    
    // Debug logger
    const DebugLogger = {
        debug: function(message, data) {
            if (DebugConfig.enabled && DebugConfig.logLevel === 'debug') {
                console.log(`[Search Debug] ${message}`, data || '');
            }
        },
        info: function(message, data) {
            if (DebugConfig.enabled && ['debug', 'info'].includes(DebugConfig.logLevel)) {
                console.info(`[Search Info] ${message}`, data || '');
            }
        },
        warn: function(message, data) {
            if (DebugConfig.enabled && ['debug', 'info', 'warn'].includes(DebugConfig.logLevel)) {
                console.warn(`[Search Warning] ${message}`, data || '');
            }
        },
        error: function(message, data) {
            if (DebugConfig.enabled) {
                console.error(`[Search Error] ${message}`, data || '');
            }
        }
    };
    
    // Search debugger class
    class SearchDebugger {
        constructor() {
            this.init();
        }
        
        init() {
            DebugLogger.info('Search debugger initialized');
            this.checkElements();
            this.checkJavaScript();
            this.checkCSS();
            this.setupDebugPanel();
        }
        
        checkElements() {
            const elements = {
                popup: document.querySelector('#searchPopup'),
                toggle: document.querySelectorAll('.searchBoxToggler'),
                close: document.querySelector('#searchClose'),
                form: document.querySelector('#searchForm'),
                input: document.querySelector('#searchInput')
            };
            
            DebugLogger.info('Element check results:', elements);
            
            // Check if elements exist
            Object.keys(elements).forEach(key => {
                if (elements[key]) {
                    if (elements[key].length !== undefined) {
                        DebugLogger.info(`${key} elements found:`, elements[key].length);
                    } else {
                        DebugLogger.info(`${key} element found`);
                    }
                } else {
                    DebugLogger.warn(`${key} element not found`);
                }
            });
        }
        
        checkJavaScript() {
            // Check if main.js is loaded
            if (typeof $ !== 'undefined') {
                DebugLogger.info('jQuery is loaded');
            } else {
                DebugLogger.warn('jQuery not found');
            }
            
            // Check if search popup instance exists
            if (window.searchPopup) {
                DebugLogger.info('Search popup instance found:', window.searchPopup.getState());
            } else {
                DebugLogger.warn('Search popup instance not found');
            }
        }
        
        checkCSS() {
            const popup = document.querySelector('#searchPopup');
            if (popup) {
                const styles = window.getComputedStyle(popup);
                const importantProps = {
                    position: styles.position,
                    visibility: styles.visibility,
                    opacity: styles.opacity,
                    zIndex: styles.zIndex,
                    display: styles.display
                };
                
                DebugLogger.info('Popup CSS properties:', importantProps);
            }
        }
        
        setupDebugPanel() {
            if (!DebugConfig.showConsole) return;
            
            // Create debug panel
            const panel = document.createElement('div');
            panel.id = 'searchDebugPanel';
            panel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 100000;
                max-width: 300px;
                display: none;
            `;
            
            panel.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <strong>Search Debug Panel</strong>
                    <button onclick="this.parentElement.parentElement.style.display='none'" style="float: right; background: red; color: white; border: none; padding: 2px 5px;">X</button>
                </div>
                <div id="debugContent"></div>
            `;
            
            document.body.appendChild(panel);
            
            // Show panel on triple click of search button
            document.addEventListener('click', (e) => {
                if (e.target.closest('.searchBoxToggler')) {
                    this.clickCount = (this.clickCount || 0) + 1;
                    setTimeout(() => {
                        if (this.clickCount >= 3) {
                            panel.style.display = 'block';
                            this.updateDebugPanel();
                        }
                        this.clickCount = 0;
                    }, 500);
                }
            });
        }
        
        updateDebugPanel() {
            const content = document.getElementById('debugContent');
            if (!content) return;
            
            const state = window.searchPopup ? window.searchPopup.getState() : { isOpen: 'N/A', isInitialized: 'N/A' };
            
            content.innerHTML = `
                <div>Popup State: ${JSON.stringify(state)}</div>
                <div>Elements Found: ${document.querySelectorAll('.searchBoxToggler').length} toggle(s)</div>
                <div>jQuery: ${typeof $ !== 'undefined' ? 'Loaded' : 'Not Found'}</div>
                <div>Main.js: ${typeof popupSarchBox !== 'undefined' ? 'Loaded' : 'Not Found'}</div>
                <button onclick="window.searchDebugger.testSearch()" style="background: #007cba; color: white; border: none; padding: 5px; margin-top: 5px; cursor: pointer;">Test Search</button>
            `;
        }
        
        testSearch() {
            DebugLogger.info('Testing search functionality');
            
            if (window.searchPopup) {
                window.searchPopup.open();
                setTimeout(() => {
                    window.searchPopup.close();
                    DebugLogger.info('Search test completed');
                }, 2000);
            } else {
                DebugLogger.error('Search popup not available for testing');
            }
        }
    }
    
    // Initialize debugger when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.searchDebugger = new SearchDebugger();
        });
    } else {
        window.searchDebugger = new SearchDebugger();
    }
    
    // Expose for manual debugging
    window.SearchDebugger = SearchDebugger;
    window.DebugLogger = DebugLogger;
    
})();

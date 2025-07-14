import { OverlayScrollbars } from 'overlayscrollbars'

export default () => {
    const isDarkMode = () => document.documentElement.classList.contains('dark')
    
    const initOverlayScrollbars = () => {
        // Config for different scrollbar types
        const configs = {
            'fi-scrollbar': {
                scrollbars: {
                    theme: isDarkMode() 
                        ? 'os-theme-filament-dark' 
                        : 'os-theme-filament-light',
                    autoHide: 'move',
                    autoHideDelay: 1000,
                    clickScroll: true
                }
            },
            'fi-scrollbar-thin': {
                scrollbars: {
                    theme: isDarkMode() 
                        ? 'os-theme-filament-thin-dark' 
                        : 'os-theme-filament-thin-light',
                    autoHide: 'scroll',
                    autoHideDelay: 1000,
                    clickScroll: true
                }
            },
            'fi-scrollbar-always': {
                scrollbars: {
                    theme: isDarkMode() 
                        ? 'os-theme-filament-dark' 
                        : 'os-theme-filament-light',
                    autoHide: 'never',
                    clickScroll: true
                }
            }
        }
        
        // Initialize elements with data attribute
        Object.entries(configs).forEach(([className, config]) => {
            document.querySelectorAll(`.${className}[data-overlayscrollbars-initialize]`).forEach(element => {
                const existing = OverlayScrollbars(element)
                if (!existing) {
                    OverlayScrollbars(element, config)
                } else {
                    // Update existing instance config
                    existing.options(config)
                }
            })
        })
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOverlayScrollbars)
    } else {
        initOverlayScrollbars()
    }
    
    // Re-initialize after Livewire updates
    document.addEventListener('livewire:navigated', () => {
        setTimeout(initOverlayScrollbars, 0)
    })
    
    // Handle dark mode changes
    const observer = new MutationObserver(() => {
        document.querySelectorAll('[data-overlayscrollbars]').forEach(el => {
            const instance = OverlayScrollbars(el)
            if (instance) {
                const currentOptions = instance.options()
                const currentTheme = currentOptions.scrollbars?.theme || ''
                
                let newTheme = currentTheme
                if (currentTheme.includes('filament-thin')) {
                    newTheme = isDarkMode() ? 'os-theme-filament-thin-dark' : 'os-theme-filament-thin-light'
                } else {
                    newTheme = isDarkMode() ? 'os-theme-filament-dark' : 'os-theme-filament-light'
                }
                
                instance.options({
                    scrollbars: {
                        ...currentOptions.scrollbars,
                        theme: newTheme
                    }
                })
            }
        })
    })
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    })
}
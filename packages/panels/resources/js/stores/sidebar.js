export default () => ({
    isOpen: window.Alpine.$persist(true).as('isOpen'),

    collapsedGroups: window.Alpine.$persist(null).as('collapsedGroups'),

    init() {
        let previousWidth = window.innerWidth

        const resizeObserver = new ResizeObserver(() => {
            const currentWidth = window.innerWidth
            const wasDesktop = previousWidth >= 1024
            const isMobile = currentWidth < 1024
            const isDesktop = currentWidth >= 1024

            // Resize from desktop to mobile
            if (wasDesktop && isMobile) {
                localStorage.setItem('isOpenDesktop', this.isOpen)
                if (this.isOpen) {
                    this.close()
                }
            }

            // Resize from mobile to desktop
            else if (!wasDesktop && isDesktop) {
                const desktopState = localStorage.getItem('isOpenDesktop')
                if (desktopState !== null) {
                    this.isOpen = desktopState === 'true'
                }
            }

            previousWidth = currentWidth
        })

        resizeObserver.observe(document.body)

        if (window.innerWidth < 1024) {
            if (this.isOpen) {
                localStorage.setItem('isOpenDesktop', 'true')
                this.close()
            }
        } else {
            localStorage.setItem('isOpenDesktop', this.isOpen)
        }
    },

    groupIsCollapsed(group) {
        return this.collapsedGroups.includes(group)
    },

    collapseGroup(group) {
        if (this.collapsedGroups.includes(group)) {
            return
        }

        this.collapsedGroups = this.collapsedGroups.concat(group)
    },

    toggleCollapsedGroup(group) {
        this.collapsedGroups = this.collapsedGroups.includes(group)
            ? this.collapsedGroups.filter(
                  (collapsedGroup) => collapsedGroup !== group,
              )
            : this.collapsedGroups.concat(group)
    },

    close() {
        this.isOpen = false

        if (window.innerWidth >= 1024) {
            localStorage.setItem('isOpenDesktop', 'false')
        }
    },

    open() {
        this.isOpen = true

        if (window.innerWidth >= 1024) {
            localStorage.setItem('isOpenDesktop', 'true')
        }
    },
})

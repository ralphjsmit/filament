export default () => ({
    isOpen: window.Alpine.$persist(true).as('isOpen'),
    isOpenDesktop: window.Alpine.$persist(true).as('isOpenDesktop'),

    collapsedGroups: window.Alpine.$persist(null).as('collapsedGroups'),

    init() {
        let previousWidth = window.innerWidth

        const resizeObserver = new ResizeObserver(() => {
            const currentWidth = window.innerWidth
            const wasDesktop = previousWidth >= 1024
            const isMobile = currentWidth < 1024
            const isDesktop = currentWidth >= 1024

            // Resize desktop to mobile
            if (wasDesktop && isMobile) {
                this.isOpenDesktop = this.isOpen

                if (this.isOpen) {
                    this.close()
                }
            }
            // Resize mobile to desktop
            else if (!wasDesktop && isDesktop) {
                this.isOpen = this.isOpenDesktop
            }

            previousWidth = currentWidth
        })

        resizeObserver.observe(document.body)

        if (window.innerWidth < 1024) {
            if (this.isOpen) {
                this.isOpenDesktop = true
                this.close()
            }
        } else {
            this.isOpenDesktop = this.isOpen
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
            this.isOpenDesktop = false
        }
    },

    open() {
        this.isOpen = true

        if (window.innerWidth >= 1024) {
            this.isOpenDesktop = true
        }
    },
})

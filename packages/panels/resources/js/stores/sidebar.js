export default () => ({
    isOpen: window.Alpine.$persist(true).as('isOpen'),

    init() {
        // Close on resize
        const resizeObserver = new ResizeObserver(() => {
            if (window.innerWidth < 1024 && this.isOpen) {
                this.close();
            }
        });

        resizeObserver.observe(document.body);

        // Force close on mobile
        if (window.innerWidth < 1024 && this.isOpen) {
            this.close();
        }
    },

    collapsedGroups: window.Alpine.$persist(null).as('collapsedGroups'),

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
    },

    open() {
        this.isOpen = true
    },
})

import { OverlayScrollbars } from 'overlayscrollbars'

export default () => {
    const config = {
        paddingAbsolute: false,
        showNativeOverlaidScrollbars: false,
        update: {
            elementEvents: [['img', 'load']],
            debounce: [0, 33],
            attributes: null,
            ignoreMutation: null,
        },
        overflow: {
            x: 'scroll',
            y: 'scroll',
        },
        scrollbars: {
            theme: 'os-theme-filament',
            visibility: 'visible',
            autoHide: 'never',
            autoHideSuspend: true,
            dragScroll: true,
            clickScroll: true,
            pointers: ['mouse', 'touch', 'pen'],
        },
    }

    const initOverlayScrollbars = () => {
        document
            .querySelectorAll(
                '[data-overlayscrollbars-initialize]:not([data-overlayscrollbars])',
            )
            .forEach((element) => {
                OverlayScrollbars(element, config)
            })
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOverlayScrollbars)
    } else {
        initOverlayScrollbars()
    }

    document.addEventListener('livewire:navigated', () => {
        setTimeout(initOverlayScrollbars, 0)
    })

    document.addEventListener('livewire:morph.updated', () => {
        setTimeout(initOverlayScrollbars, 0)
    })
}

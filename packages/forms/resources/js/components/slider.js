import noUiSlider from 'nouislider'

export default function sliderFormComponent({
    state,
    minValue,
    maxValue,
    step,
    margin,
    limit,
    padding,
    connect,
    isRtl,
    isVertical,
    behavior,
    tooltips,
    format,
    pips,
    ariaFormat,
}) {
    return {
        state,

        slider: null,

        init: function () {
            this.slider = noUiSlider.create(this.$el, {
                range: { min: minValue, max: maxValue },
                start: Alpine.raw(this.state || minValue),
                step,
                margin,
                limit,
                padding,
                connect,
                direction: isRtl ? 'rtl' : 'ltr',
                orientation: isVertical ? 'vertical' : 'horizontal',
                behavior,
                tooltips,
                format,
                pips,
                ariaFormat,
            })

            this.slider.on('update', (values) => {
                this.state = values.length > 1 ? values : values[0]
            })
        },
    }
}

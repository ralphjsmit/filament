import noUiSlider from 'nouislider'

export default function sliderFormComponent({
    arePipsStepped,
    behavior,
    decimalPlaces,
    fill,
    isRtl,
    isVertical,
    limit,
    margin,
    maxValue,
    minValue,
    nonLinearPoints,
    padding,
    pipsDensity,
    pipsFilter,
    pipsFormatter,
    pipsMode,
    pipsValues,
    state,
    step,
    tooltips,
}) {
    return {
        state,

        slider: null,

        init: function () {
            this.slider = noUiSlider.create(this.$el, {
                behavior,
                direction: isRtl ? 'rtl' : 'ltr',
                connect: fill,
                format: {
                    from: (value) => value,
                    to: (value) =>
                        decimalPlaces !== null
                            ? +value.toFixed(decimalPlaces)
                            : value,
                },
                limit,
                margin,
                orientation: isVertical ? 'vertical' : 'horizontal',
                padding,
                pips: pipsMode
                    ? {
                          density: pipsDensity ?? 10,
                          filter: pipsFilter,
                          format: pipsFormatter,
                          mode: pipsMode,
                          stepped: arePipsStepped,
                          values: pipsValues,
                      }
                    : null,
                range: {
                    min: minValue,
                    ...(nonLinearPoints ?? {}),
                    max: maxValue,
                },
                start: Alpine.raw(this.state),
                step,
                tooltips,
            })

            this.slider.on('change', (values) => {
                this.state = values.length > 1 ? values : values[0]
            })

            this.$watch('state', () => {
                this.slider.set(Alpine.raw(this.state))
            })
        },
    }
}

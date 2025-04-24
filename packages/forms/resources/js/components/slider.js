import noUiSlider from 'nouislider'

export default function sliderFormComponent({
    arePipsStepped,
    behavior,
    connect,
    decimalPlaces,
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
                range: {
                    min: minValue,
                    ...(nonLinearPoints ?? {}),
                    max: maxValue,
                },
                start: Alpine.raw(this.state),
                format: {
                    from: (value) => value,
                    to: (value) =>
                        decimalPlaces !== null
                            ? +value.toFixed(decimalPlaces)
                            : value,
                },
                step,
                margin,
                limit,
                padding,
                connect,
                direction: isRtl ? 'rtl' : 'ltr',
                orientation: isVertical ? 'vertical' : 'horizontal',
                behavior,
                tooltips,
                pips: pipsMode
                    ? {
                          mode: pipsMode,
                          density: pipsDensity ?? 10,
                          filter: pipsFilter,
                          format: pipsFormatter,
                          values: pipsValues,
                          stepped: arePipsStepped,
                      }
                    : null,
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

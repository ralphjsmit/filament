// node_modules/vanilla-colorful/lib/utils/math.js
var clamp = (number, min = 0, max = 1) => {
  return number > max ? max : number < min ? min : number;
};
var round = (number, digits = 0, base = Math.pow(10, digits)) => {
  return Math.round(base * number) / base;
};

// node_modules/vanilla-colorful/lib/utils/convert.js
var angleUnits = {
  grad: 360 / 400,
  turn: 360,
  rad: 360 / (Math.PI * 2)
};
var hexToHsva = (hex) => rgbaToHsva(hexToRgba(hex));
var hexToRgba = (hex) => {
  if (hex[0] === "#")
    hex = hex.substring(1);
  if (hex.length < 6) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: hex.length === 4 ? round(parseInt(hex[3] + hex[3], 16) / 255, 2) : 1
    };
  }
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
    a: hex.length === 8 ? round(parseInt(hex.substring(6, 8), 16) / 255, 2) : 1
  };
};
var parseHue = (value, unit = "deg") => {
  return Number(value) * (angleUnits[unit] || 1);
};
var hslaStringToHsva = (hslString) => {
  const matcher = /hsla?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;
  const match = matcher.exec(hslString);
  if (!match)
    return { h: 0, s: 0, v: 0, a: 1 };
  return hslaToHsva({
    h: parseHue(match[1], match[2]),
    s: Number(match[3]),
    l: Number(match[4]),
    a: match[5] === void 0 ? 1 : Number(match[5]) / (match[6] ? 100 : 1)
  });
};
var hslStringToHsva = hslaStringToHsva;
var hslaToHsva = ({ h, s, l, a }) => {
  s *= (l < 50 ? l : 100 - l) / 100;
  return {
    h,
    s: s > 0 ? 2 * s / (l + s) * 100 : 0,
    v: l + s,
    a
  };
};
var hsvaToHex = (hsva) => rgbaToHex(hsvaToRgba(hsva));
var hsvaToHsla = ({ h, s, v, a }) => {
  const hh = (200 - s) * v / 100;
  return {
    h: round(h),
    s: round(hh > 0 && hh < 200 ? s * v / 100 / (hh <= 100 ? hh : 200 - hh) * 100 : 0),
    l: round(hh / 2),
    a: round(a, 2)
  };
};
var hsvaToHslString = (hsva) => {
  const { h, s, l } = hsvaToHsla(hsva);
  return `hsl(${h}, ${s}%, ${l}%)`;
};
var hsvaToHslaString = (hsva) => {
  const { h, s, l, a } = hsvaToHsla(hsva);
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
};
var hsvaToRgba = ({ h, s, v, a }) => {
  h = h / 360 * 6;
  s = s / 100;
  v = v / 100;
  const hh = Math.floor(h), b = v * (1 - s), c = v * (1 - (h - hh) * s), d = v * (1 - (1 - h + hh) * s), module = hh % 6;
  return {
    r: round([v, c, b, b, d, v][module] * 255),
    g: round([d, v, v, c, b, b][module] * 255),
    b: round([b, b, d, v, v, c][module] * 255),
    a: round(a, 2)
  };
};
var hsvaToRgbString = (hsva) => {
  const { r, g, b } = hsvaToRgba(hsva);
  return `rgb(${r}, ${g}, ${b})`;
};
var hsvaToRgbaString = (hsva) => {
  const { r, g, b, a } = hsvaToRgba(hsva);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
var rgbaStringToHsva = (rgbaString) => {
  const matcher = /rgba?\(?\s*(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;
  const match = matcher.exec(rgbaString);
  if (!match)
    return { h: 0, s: 0, v: 0, a: 1 };
  return rgbaToHsva({
    r: Number(match[1]) / (match[2] ? 100 / 255 : 1),
    g: Number(match[3]) / (match[4] ? 100 / 255 : 1),
    b: Number(match[5]) / (match[6] ? 100 / 255 : 1),
    a: match[7] === void 0 ? 1 : Number(match[7]) / (match[8] ? 100 : 1)
  });
};
var rgbStringToHsva = rgbaStringToHsva;
var format = (number) => {
  const hex = number.toString(16);
  return hex.length < 2 ? "0" + hex : hex;
};
var rgbaToHex = ({ r, g, b, a }) => {
  const alphaHex = a < 1 ? format(round(a * 255)) : "";
  return "#" + format(r) + format(g) + format(b) + alphaHex;
};
var rgbaToHsva = ({ r, g, b, a }) => {
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  const hh = delta ? max === r ? (g - b) / delta : max === g ? 2 + (b - r) / delta : 4 + (r - g) / delta : 0;
  return {
    h: round(60 * (hh < 0 ? hh + 6 : hh)),
    s: round(max ? delta / max * 100 : 0),
    v: round(max / 255 * 100),
    a
  };
};

// node_modules/vanilla-colorful/lib/utils/compare.js
var equalColorObjects = (first, second) => {
  if (first === second)
    return true;
  for (const prop in first) {
    if (first[prop] !== second[prop])
      return false;
  }
  return true;
};
var equalColorString = (first, second) => {
  return first.replace(/\s/g, "") === second.replace(/\s/g, "");
};
var equalHex = (first, second) => {
  if (first.toLowerCase() === second.toLowerCase())
    return true;
  return equalColorObjects(hexToRgba(first), hexToRgba(second));
};

// node_modules/vanilla-colorful/lib/utils/dom.js
var cache = {};
var tpl = (html) => {
  let template = cache[html];
  if (!template) {
    template = document.createElement("template");
    template.innerHTML = html;
    cache[html] = template;
  }
  return template;
};
var fire = (target, type, detail) => {
  target.dispatchEvent(new CustomEvent(type, {
    bubbles: true,
    detail
  }));
};

// node_modules/vanilla-colorful/lib/components/slider.js
var hasTouched = false;
var isTouch = (e) => "touches" in e;
var isValid = (event) => {
  if (hasTouched && !isTouch(event))
    return false;
  if (!hasTouched)
    hasTouched = isTouch(event);
  return true;
};
var pointerMove = (target, event) => {
  const pointer = isTouch(event) ? event.touches[0] : event;
  const rect = target.el.getBoundingClientRect();
  fire(target.el, "move", target.getMove({
    x: clamp((pointer.pageX - (rect.left + window.pageXOffset)) / rect.width),
    y: clamp((pointer.pageY - (rect.top + window.pageYOffset)) / rect.height)
  }));
};
var keyMove = (target, event) => {
  const keyCode = event.keyCode;
  if (keyCode > 40 || target.xy && keyCode < 37 || keyCode < 33)
    return;
  event.preventDefault();
  fire(target.el, "move", target.getMove({
    x: keyCode === 39 ? 0.01 : keyCode === 37 ? -0.01 : keyCode === 34 ? 0.05 : keyCode === 33 ? -0.05 : keyCode === 35 ? 1 : keyCode === 36 ? -1 : 0,
    y: keyCode === 40 ? 0.01 : keyCode === 38 ? -0.01 : 0
  }, true));
};
var Slider = class {
  constructor(root, part, aria, xy) {
    const template = tpl(`<div role="slider" tabindex="0" part="${part}" ${aria}><div part="${part}-pointer"></div></div>`);
    root.appendChild(template.content.cloneNode(true));
    const el = root.querySelector(`[part=${part}]`);
    el.addEventListener("mousedown", this);
    el.addEventListener("touchstart", this);
    el.addEventListener("keydown", this);
    this.el = el;
    this.xy = xy;
    this.nodes = [el.firstChild, el];
  }
  set dragging(state) {
    const toggleEvent = state ? document.addEventListener : document.removeEventListener;
    toggleEvent(hasTouched ? "touchmove" : "mousemove", this);
    toggleEvent(hasTouched ? "touchend" : "mouseup", this);
  }
  handleEvent(event) {
    switch (event.type) {
      case "mousedown":
      case "touchstart":
        event.preventDefault();
        if (!isValid(event) || !hasTouched && event.button != 0)
          return;
        this.el.focus();
        pointerMove(this, event);
        this.dragging = true;
        break;
      case "mousemove":
      case "touchmove":
        event.preventDefault();
        pointerMove(this, event);
        break;
      case "mouseup":
      case "touchend":
        this.dragging = false;
        break;
      case "keydown":
        keyMove(this, event);
        break;
    }
  }
  style(styles) {
    styles.forEach((style, i) => {
      for (const p in style) {
        this.nodes[i].style.setProperty(p, style[p]);
      }
    });
  }
};

// node_modules/vanilla-colorful/lib/components/hue.js
var Hue = class extends Slider {
  constructor(root) {
    super(root, "hue", 'aria-label="Hue" aria-valuemin="0" aria-valuemax="360"', false);
  }
  update({ h }) {
    this.h = h;
    this.style([
      {
        left: `${h / 360 * 100}%`,
        color: hsvaToHslString({ h, s: 100, v: 100, a: 1 })
      }
    ]);
    this.el.setAttribute("aria-valuenow", `${round(h)}`);
  }
  getMove(offset, key) {
    return { h: key ? clamp(this.h + offset.x * 360, 0, 360) : 360 * offset.x };
  }
};

// node_modules/vanilla-colorful/lib/components/saturation.js
var Saturation = class extends Slider {
  constructor(root) {
    super(root, "saturation", 'aria-label="Color"', true);
  }
  update(hsva) {
    this.hsva = hsva;
    this.style([
      {
        top: `${100 - hsva.v}%`,
        left: `${hsva.s}%`,
        color: hsvaToHslString(hsva)
      },
      {
        "background-color": hsvaToHslString({ h: hsva.h, s: 100, v: 100, a: 1 })
      }
    ]);
    this.el.setAttribute("aria-valuetext", `Saturation ${round(hsva.s)}%, Brightness ${round(hsva.v)}%`);
  }
  getMove(offset, key) {
    return {
      s: key ? clamp(this.hsva.s + offset.x * 100, 0, 100) : offset.x * 100,
      v: key ? clamp(this.hsva.v - offset.y * 100, 0, 100) : Math.round(100 - offset.y * 100)
    };
  }
};

// node_modules/vanilla-colorful/lib/styles/color-picker.js
var color_picker_default = `:host{display:flex;flex-direction:column;position:relative;width:200px;height:200px;user-select:none;-webkit-user-select:none;cursor:default}:host([hidden]){display:none!important}[role=slider]{position:relative;touch-action:none;user-select:none;-webkit-user-select:none;outline:0}[role=slider]:last-child{border-radius:0 0 8px 8px}[part$=pointer]{position:absolute;z-index:1;box-sizing:border-box;width:28px;height:28px;display:flex;place-content:center center;transform:translate(-50%,-50%);background-color:#fff;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.2)}[part$=pointer]::after{content:"";width:100%;height:100%;border-radius:inherit;background-color:currentColor}[role=slider]:focus [part$=pointer]{transform:translate(-50%,-50%) scale(1.1)}`;

// node_modules/vanilla-colorful/lib/styles/hue.js
var hue_default = `[part=hue]{flex:0 0 24px;background:linear-gradient(to right,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red 100%)}[part=hue-pointer]{top:50%;z-index:2}`;

// node_modules/vanilla-colorful/lib/styles/saturation.js
var saturation_default = `[part=saturation]{flex-grow:1;border-color:transparent;border-bottom:12px solid #000;border-radius:8px 8px 0 0;background-image:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,rgba(255,255,255,0));box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}[part=saturation-pointer]{z-index:3}`;

// node_modules/vanilla-colorful/lib/components/color-picker.js
var $isSame = Symbol("same");
var $color = Symbol("color");
var $hsva = Symbol("hsva");
var $update = Symbol("update");
var $parts = Symbol("parts");
var $css = Symbol("css");
var $sliders = Symbol("sliders");
var ColorPicker = class extends HTMLElement {
  static get observedAttributes() {
    return ["color"];
  }
  get [$css]() {
    return [color_picker_default, hue_default, saturation_default];
  }
  get [$sliders]() {
    return [Saturation, Hue];
  }
  get color() {
    return this[$color];
  }
  set color(newColor) {
    if (!this[$isSame](newColor)) {
      const newHsva = this.colorModel.toHsva(newColor);
      this[$update](newHsva);
      this[$color] = newColor;
    }
  }
  constructor() {
    super();
    const template = tpl(`<style>${this[$css].join("")}</style>`);
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(template.content.cloneNode(true));
    root.addEventListener("move", this);
    this[$parts] = this[$sliders].map((slider) => new slider(root));
  }
  connectedCallback() {
    if (this.hasOwnProperty("color")) {
      const value = this.color;
      delete this["color"];
      this.color = value;
    } else if (!this.color) {
      this.color = this.colorModel.defaultColor;
    }
  }
  attributeChangedCallback(_attr, _oldVal, newVal) {
    const color = this.colorModel.fromAttr(newVal);
    if (!this[$isSame](color)) {
      this.color = color;
    }
  }
  handleEvent(event) {
    const oldHsva = this[$hsva];
    const newHsva = { ...oldHsva, ...event.detail };
    this[$update](newHsva);
    let newColor;
    if (!equalColorObjects(newHsva, oldHsva) && !this[$isSame](newColor = this.colorModel.fromHsva(newHsva))) {
      this[$color] = newColor;
      fire(this, "color-changed", { value: newColor });
    }
  }
  [$isSame](color) {
    return this.color && this.colorModel.equal(color, this.color);
  }
  [$update](hsva) {
    this[$hsva] = hsva;
    this[$parts].forEach((part) => part.update(hsva));
  }
};

// node_modules/vanilla-colorful/lib/entrypoints/hex.js
var colorModel = {
  defaultColor: "#000",
  toHsva: hexToHsva,
  fromHsva: ({ h, s, v }) => hsvaToHex({ h, s, v, a: 1 }),
  equal: equalHex,
  fromAttr: (color) => color
};
var HexBase = class extends ColorPicker {
  get colorModel() {
    return colorModel;
  }
};

// node_modules/vanilla-colorful/hex-color-picker.js
var HexColorPicker = class extends HexBase {
};
customElements.define("hex-color-picker", HexColorPicker);

// node_modules/vanilla-colorful/lib/entrypoints/hsl-string.js
var colorModel2 = {
  defaultColor: "hsl(0, 0%, 0%)",
  toHsva: hslStringToHsva,
  fromHsva: hsvaToHslString,
  equal: equalColorString,
  fromAttr: (color) => color
};
var HslStringBase = class extends ColorPicker {
  get colorModel() {
    return colorModel2;
  }
};

// node_modules/vanilla-colorful/hsl-string-color-picker.js
var HslStringColorPicker = class extends HslStringBase {
};
customElements.define("hsl-string-color-picker", HslStringColorPicker);

// node_modules/vanilla-colorful/lib/entrypoints/rgb-string.js
var colorModel3 = {
  defaultColor: "rgb(0, 0, 0)",
  toHsva: rgbStringToHsva,
  fromHsva: hsvaToRgbString,
  equal: equalColorString,
  fromAttr: (color) => color
};
var RgbStringBase = class extends ColorPicker {
  get colorModel() {
    return colorModel3;
  }
};

// node_modules/vanilla-colorful/rgb-string-color-picker.js
var RgbStringColorPicker = class extends RgbStringBase {
};
customElements.define("rgb-string-color-picker", RgbStringColorPicker);

// node_modules/vanilla-colorful/lib/components/alpha.js
var Alpha = class extends Slider {
  constructor(root) {
    super(root, "alpha", 'aria-label="Alpha" aria-valuemin="0" aria-valuemax="1"', false);
  }
  update(hsva) {
    this.hsva = hsva;
    const colorFrom = hsvaToHslaString({ ...hsva, a: 0 });
    const colorTo = hsvaToHslaString({ ...hsva, a: 1 });
    const value = hsva.a * 100;
    this.style([
      {
        left: `${value}%`,
        color: hsvaToHslaString(hsva)
      },
      {
        "--gradient": `linear-gradient(90deg, ${colorFrom}, ${colorTo}`
      }
    ]);
    const v = round(value);
    this.el.setAttribute("aria-valuenow", `${v}`);
    this.el.setAttribute("aria-valuetext", `${v}%`);
  }
  getMove(offset, key) {
    return { a: key ? clamp(this.hsva.a + offset.x) : offset.x };
  }
};

// node_modules/vanilla-colorful/lib/styles/alpha.js
var alpha_default = `[part=alpha]{flex:0 0 24px}[part=alpha]::after{display:block;content:"";position:absolute;top:0;left:0;right:0;bottom:0;border-radius:inherit;background-image:var(--gradient);box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}[part^=alpha]{background-color:#fff;background-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><rect x="8" width="8" height="8"/><rect y="8" width="8" height="8"/></svg>')}[part=alpha-pointer]{top:50%}`;

// node_modules/vanilla-colorful/lib/components/alpha-color-picker.js
var AlphaColorPicker = class extends ColorPicker {
  get [$css]() {
    return [...super[$css], alpha_default];
  }
  get [$sliders]() {
    return [...super[$sliders], Alpha];
  }
};

// node_modules/vanilla-colorful/lib/entrypoints/rgba-string.js
var colorModel4 = {
  defaultColor: "rgba(0, 0, 0, 1)",
  toHsva: rgbaStringToHsva,
  fromHsva: hsvaToRgbaString,
  equal: equalColorString,
  fromAttr: (color) => color
};
var RgbaStringBase = class extends AlphaColorPicker {
  get colorModel() {
    return colorModel4;
  }
};

// node_modules/vanilla-colorful/rgba-string-color-picker.js
var RgbaStringColorPicker = class extends RgbaStringBase {
};
customElements.define("rgba-string-color-picker", RgbaStringColorPicker);

// packages/forms/resources/js/components/color-picker.js
function colorPickerFormComponent({
  isAutofocused,
  isDisabled,
  isLive,
  isLiveDebounced,
  isLiveOnBlur,
  liveDebounce,
  state
}) {
  return {
    state,
    init() {
      if (!(this.state === null || this.state === "")) {
        this.setState(this.state);
      }
      if (isAutofocused) {
        this.togglePanelVisibility(this.$refs.input);
      }
      this.$refs.input.addEventListener("change", (event) => {
        this.setState(event.target.value);
      });
      this.$refs.panel.addEventListener("color-changed", (event) => {
        this.setState(event.detail.value);
        if (isLiveOnBlur || !(isLive || isLiveDebounced)) {
          return;
        }
        setTimeout(
          () => {
            if (this.state !== event.detail.value) {
              return;
            }
            this.commitState();
          },
          isLiveDebounced ? liveDebounce : 250
        );
      });
      if (isLive || isLiveDebounced || isLiveOnBlur) {
        new MutationObserver(
          () => this.isOpen() ? null : this.commitState()
        ).observe(this.$refs.panel, {
          attributes: true,
          childList: true
        });
      }
    },
    togglePanelVisibility() {
      if (isDisabled) {
        return;
      }
      this.$refs.panel.toggle(this.$refs.input);
    },
    setState(value) {
      this.state = value;
      this.$refs.input.value = value;
      this.$refs.panel.color = value;
    },
    isOpen() {
      return this.$refs.panel.style.display === "block";
    },
    commitState() {
      if (JSON.stringify(this.$wire.__instance.canonical) === JSON.stringify(this.$wire.__instance.ephemeral)) {
        return;
      }
      this.$wire.$commit();
    }
  };
}
export {
  colorPickerFormComponent as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ZhbmlsbGEtY29sb3JmdWwvc3JjL2xpYi91dGlscy9tYXRoLnRzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92YW5pbGxhLWNvbG9yZnVsL3NyYy9saWIvdXRpbHMvY29udmVydC50cyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdmFuaWxsYS1jb2xvcmZ1bC9zcmMvbGliL3V0aWxzL2NvbXBhcmUudHMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ZhbmlsbGEtY29sb3JmdWwvc3JjL2xpYi91dGlscy9kb20udHMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ZhbmlsbGEtY29sb3JmdWwvc3JjL2xpYi9jb21wb25lbnRzL3NsaWRlci50cyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdmFuaWxsYS1jb2xvcmZ1bC9zcmMvbGliL2NvbXBvbmVudHMvaHVlLnRzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92YW5pbGxhLWNvbG9yZnVsL3NyYy9saWIvY29tcG9uZW50cy9zYXR1cmF0aW9uLnRzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92YW5pbGxhLWNvbG9yZnVsL3NyYy9saWIvc3R5bGVzL2NvbG9yLXBpY2tlci50cyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdmFuaWxsYS1jb2xvcmZ1bC9zcmMvbGliL3N0eWxlcy9odWUudHMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ZhbmlsbGEtY29sb3JmdWwvc3JjL2xpYi9zdHlsZXMvc2F0dXJhdGlvbi50cyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdmFuaWxsYS1jb2xvcmZ1bC9zcmMvbGliL2NvbXBvbmVudHMvY29sb3ItcGlja2VyLnRzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92YW5pbGxhLWNvbG9yZnVsL3NyYy9saWIvZW50cnlwb2ludHMvaGV4LnRzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92YW5pbGxhLWNvbG9yZnVsL3NyYy9oZXgtY29sb3ItcGlja2VyLnRzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92YW5pbGxhLWNvbG9yZnVsL3NyYy9saWIvZW50cnlwb2ludHMvaHNsLXN0cmluZy50cyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdmFuaWxsYS1jb2xvcmZ1bC9zcmMvaHNsLXN0cmluZy1jb2xvci1waWNrZXIudHMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ZhbmlsbGEtY29sb3JmdWwvc3JjL2xpYi9lbnRyeXBvaW50cy9yZ2Itc3RyaW5nLnRzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92YW5pbGxhLWNvbG9yZnVsL3NyYy9yZ2Itc3RyaW5nLWNvbG9yLXBpY2tlci50cyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdmFuaWxsYS1jb2xvcmZ1bC9zcmMvbGliL2NvbXBvbmVudHMvYWxwaGEudHMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ZhbmlsbGEtY29sb3JmdWwvc3JjL2xpYi9zdHlsZXMvYWxwaGEudHMiLCAiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3ZhbmlsbGEtY29sb3JmdWwvc3JjL2xpYi9jb21wb25lbnRzL2FscGhhLWNvbG9yLXBpY2tlci50cyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvdmFuaWxsYS1jb2xvcmZ1bC9zcmMvbGliL2VudHJ5cG9pbnRzL3JnYmEtc3RyaW5nLnRzIiwgIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy92YW5pbGxhLWNvbG9yZnVsL3NyYy9yZ2JhLXN0cmluZy1jb2xvci1waWNrZXIudHMiLCAiLi4vLi4vcmVzb3VyY2VzL2pzL2NvbXBvbmVudHMvY29sb3ItcGlja2VyLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLyBDbGFtcHMgYSB2YWx1ZSBiZXR3ZWVuIGFuIHVwcGVyIGFuZCBsb3dlciBib3VuZC5cbi8vIFdlIHVzZSB0ZXJuYXJ5IG9wZXJhdG9ycyBiZWNhdXNlIGl0IG1ha2VzIHRoZSBtaW5pZmllZCBjb2RlXG4vLyAyIHRpbWVzIHNob3J0ZXIgdGhlbiBgTWF0aC5taW4oTWF0aC5tYXgoYSxiKSxjKWBcbmV4cG9ydCBjb25zdCBjbGFtcCA9IChudW1iZXI6IG51bWJlciwgbWluID0gMCwgbWF4ID0gMSk6IG51bWJlciA9PiB7XG4gIHJldHVybiBudW1iZXIgPiBtYXggPyBtYXggOiBudW1iZXIgPCBtaW4gPyBtaW4gOiBudW1iZXI7XG59O1xuXG5leHBvcnQgY29uc3Qgcm91bmQgPSAobnVtYmVyOiBudW1iZXIsIGRpZ2l0cyA9IDAsIGJhc2UgPSBNYXRoLnBvdygxMCwgZGlnaXRzKSk6IG51bWJlciA9PiB7XG4gIHJldHVybiBNYXRoLnJvdW5kKGJhc2UgKiBudW1iZXIpIC8gYmFzZTtcbn07XG4iLCAiaW1wb3J0IHsgUmdiYUNvbG9yLCBSZ2JDb2xvciwgSHNsYUNvbG9yLCBIc2xDb2xvciwgSHN2YUNvbG9yLCBIc3ZDb2xvciB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHJvdW5kIH0gZnJvbSAnLi9tYXRoLmpzJztcblxuLyoqXG4gKiBWYWxpZCBDU1MgPGFuZ2xlPiB1bml0cy5cbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9hbmdsZVxuICovXG5jb25zdCBhbmdsZVVuaXRzOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge1xuICBncmFkOiAzNjAgLyA0MDAsXG4gIHR1cm46IDM2MCxcbiAgcmFkOiAzNjAgLyAoTWF0aC5QSSAqIDIpXG59O1xuXG5leHBvcnQgY29uc3QgaGV4VG9Ic3ZhID0gKGhleDogc3RyaW5nKTogSHN2YUNvbG9yID0+IHJnYmFUb0hzdmEoaGV4VG9SZ2JhKGhleCkpO1xuXG5leHBvcnQgY29uc3QgaGV4VG9SZ2JhID0gKGhleDogc3RyaW5nKTogUmdiYUNvbG9yID0+IHtcbiAgaWYgKGhleFswXSA9PT0gJyMnKSBoZXggPSBoZXguc3Vic3RyaW5nKDEpO1xuXG4gIGlmIChoZXgubGVuZ3RoIDwgNikge1xuICAgIHJldHVybiB7XG4gICAgICByOiBwYXJzZUludChoZXhbMF0gKyBoZXhbMF0sIDE2KSxcbiAgICAgIGc6IHBhcnNlSW50KGhleFsxXSArIGhleFsxXSwgMTYpLFxuICAgICAgYjogcGFyc2VJbnQoaGV4WzJdICsgaGV4WzJdLCAxNiksXG4gICAgICBhOiBoZXgubGVuZ3RoID09PSA0ID8gcm91bmQocGFyc2VJbnQoaGV4WzNdICsgaGV4WzNdLCAxNikgLyAyNTUsIDIpIDogMVxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHI6IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMCwgMiksIDE2KSxcbiAgICBnOiBwYXJzZUludChoZXguc3Vic3RyaW5nKDIsIDQpLCAxNiksXG4gICAgYjogcGFyc2VJbnQoaGV4LnN1YnN0cmluZyg0LCA2KSwgMTYpLFxuICAgIGE6IGhleC5sZW5ndGggPT09IDggPyByb3VuZChwYXJzZUludChoZXguc3Vic3RyaW5nKDYsIDgpLCAxNikgLyAyNTUsIDIpIDogMVxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHBhcnNlSHVlID0gKHZhbHVlOiBzdHJpbmcsIHVuaXQgPSAnZGVnJyk6IG51bWJlciA9PiB7XG4gIHJldHVybiBOdW1iZXIodmFsdWUpICogKGFuZ2xlVW5pdHNbdW5pdF0gfHwgMSk7XG59O1xuXG5leHBvcnQgY29uc3QgaHNsYVN0cmluZ1RvSHN2YSA9IChoc2xTdHJpbmc6IHN0cmluZyk6IEhzdmFDb2xvciA9PiB7XG4gIGNvbnN0IG1hdGNoZXIgPVxuICAgIC9oc2xhP1xcKD9cXHMqKC0/XFxkKlxcLj9cXGQrKShkZWd8cmFkfGdyYWR8dHVybik/WyxcXHNdKygtP1xcZCpcXC4/XFxkKyklP1ssXFxzXSsoLT9cXGQqXFwuP1xcZCspJT8sP1xccypbL1xcc10qKC0/XFxkKlxcLj9cXGQrKT8oJSk/XFxzKlxcKT8vaTtcbiAgY29uc3QgbWF0Y2ggPSBtYXRjaGVyLmV4ZWMoaHNsU3RyaW5nKTtcblxuICBpZiAoIW1hdGNoKSByZXR1cm4geyBoOiAwLCBzOiAwLCB2OiAwLCBhOiAxIH07XG5cbiAgcmV0dXJuIGhzbGFUb0hzdmEoe1xuICAgIGg6IHBhcnNlSHVlKG1hdGNoWzFdLCBtYXRjaFsyXSksXG4gICAgczogTnVtYmVyKG1hdGNoWzNdKSxcbiAgICBsOiBOdW1iZXIobWF0Y2hbNF0pLFxuICAgIGE6IG1hdGNoWzVdID09PSB1bmRlZmluZWQgPyAxIDogTnVtYmVyKG1hdGNoWzVdKSAvIChtYXRjaFs2XSA/IDEwMCA6IDEpXG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGhzbFN0cmluZ1RvSHN2YSA9IGhzbGFTdHJpbmdUb0hzdmE7XG5cbmV4cG9ydCBjb25zdCBoc2xhVG9Ic3ZhID0gKHsgaCwgcywgbCwgYSB9OiBIc2xhQ29sb3IpOiBIc3ZhQ29sb3IgPT4ge1xuICBzICo9IChsIDwgNTAgPyBsIDogMTAwIC0gbCkgLyAxMDA7XG5cbiAgcmV0dXJuIHtcbiAgICBoOiBoLFxuICAgIHM6IHMgPiAwID8gKCgyICogcykgLyAobCArIHMpKSAqIDEwMCA6IDAsXG4gICAgdjogbCArIHMsXG4gICAgYVxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGhzdmFUb0hleCA9IChoc3ZhOiBIc3ZhQ29sb3IpOiBzdHJpbmcgPT4gcmdiYVRvSGV4KGhzdmFUb1JnYmEoaHN2YSkpO1xuXG5leHBvcnQgY29uc3QgaHN2YVRvSHNsYSA9ICh7IGgsIHMsIHYsIGEgfTogSHN2YUNvbG9yKTogSHNsYUNvbG9yID0+IHtcbiAgY29uc3QgaGggPSAoKDIwMCAtIHMpICogdikgLyAxMDA7XG5cbiAgcmV0dXJuIHtcbiAgICBoOiByb3VuZChoKSxcbiAgICBzOiByb3VuZChoaCA+IDAgJiYgaGggPCAyMDAgPyAoKHMgKiB2KSAvIDEwMCAvIChoaCA8PSAxMDAgPyBoaCA6IDIwMCAtIGhoKSkgKiAxMDAgOiAwKSxcbiAgICBsOiByb3VuZChoaCAvIDIpLFxuICAgIGE6IHJvdW5kKGEsIDIpXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgaHN2YVRvSHN2U3RyaW5nID0gKGhzdmE6IEhzdmFDb2xvcik6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHsgaCwgcywgdiB9ID0gcm91bmRIc3ZhKGhzdmEpO1xuICByZXR1cm4gYGhzdigke2h9LCAke3N9JSwgJHt2fSUpYDtcbn07XG5cbmV4cG9ydCBjb25zdCBoc3ZhVG9Ic3ZhU3RyaW5nID0gKGhzdmE6IEhzdmFDb2xvcik6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHsgaCwgcywgdiwgYSB9ID0gcm91bmRIc3ZhKGhzdmEpO1xuICByZXR1cm4gYGhzdmEoJHtofSwgJHtzfSUsICR7dn0lLCAke2F9KWA7XG59O1xuXG5leHBvcnQgY29uc3QgaHN2YVRvSHNsU3RyaW5nID0gKGhzdmE6IEhzdmFDb2xvcik6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHsgaCwgcywgbCB9ID0gaHN2YVRvSHNsYShoc3ZhKTtcbiAgcmV0dXJuIGBoc2woJHtofSwgJHtzfSUsICR7bH0lKWA7XG59O1xuXG5leHBvcnQgY29uc3QgaHN2YVRvSHNsYVN0cmluZyA9IChoc3ZhOiBIc3ZhQ29sb3IpOiBzdHJpbmcgPT4ge1xuICBjb25zdCB7IGgsIHMsIGwsIGEgfSA9IGhzdmFUb0hzbGEoaHN2YSk7XG4gIHJldHVybiBgaHNsYSgke2h9LCAke3N9JSwgJHtsfSUsICR7YX0pYDtcbn07XG5cbmV4cG9ydCBjb25zdCBoc3ZhVG9SZ2JhID0gKHsgaCwgcywgdiwgYSB9OiBIc3ZhQ29sb3IpOiBSZ2JhQ29sb3IgPT4ge1xuICBoID0gKGggLyAzNjApICogNjtcbiAgcyA9IHMgLyAxMDA7XG4gIHYgPSB2IC8gMTAwO1xuXG4gIGNvbnN0IGhoID0gTWF0aC5mbG9vcihoKSxcbiAgICBiID0gdiAqICgxIC0gcyksXG4gICAgYyA9IHYgKiAoMSAtIChoIC0gaGgpICogcyksXG4gICAgZCA9IHYgKiAoMSAtICgxIC0gaCArIGhoKSAqIHMpLFxuICAgIG1vZHVsZSA9IGhoICUgNjtcblxuICByZXR1cm4ge1xuICAgIHI6IHJvdW5kKFt2LCBjLCBiLCBiLCBkLCB2XVttb2R1bGVdICogMjU1KSxcbiAgICBnOiByb3VuZChbZCwgdiwgdiwgYywgYiwgYl1bbW9kdWxlXSAqIDI1NSksXG4gICAgYjogcm91bmQoW2IsIGIsIGQsIHYsIHYsIGNdW21vZHVsZV0gKiAyNTUpLFxuICAgIGE6IHJvdW5kKGEsIDIpXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgaHN2YVRvUmdiU3RyaW5nID0gKGhzdmE6IEhzdmFDb2xvcik6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHsgciwgZywgYiB9ID0gaHN2YVRvUmdiYShoc3ZhKTtcbiAgcmV0dXJuIGByZ2IoJHtyfSwgJHtnfSwgJHtifSlgO1xufTtcblxuZXhwb3J0IGNvbnN0IGhzdmFUb1JnYmFTdHJpbmcgPSAoaHN2YTogSHN2YUNvbG9yKTogc3RyaW5nID0+IHtcbiAgY29uc3QgeyByLCBnLCBiLCBhIH0gPSBoc3ZhVG9SZ2JhKGhzdmEpO1xuICByZXR1cm4gYHJnYmEoJHtyfSwgJHtnfSwgJHtifSwgJHthfSlgO1xufTtcblxuZXhwb3J0IGNvbnN0IGhzdmFTdHJpbmdUb0hzdmEgPSAoaHN2U3RyaW5nOiBzdHJpbmcpOiBIc3ZhQ29sb3IgPT4ge1xuICBjb25zdCBtYXRjaGVyID1cbiAgICAvaHN2YT9cXCg/XFxzKigtP1xcZCpcXC4/XFxkKykoZGVnfHJhZHxncmFkfHR1cm4pP1ssXFxzXSsoLT9cXGQqXFwuP1xcZCspJT9bLFxcc10rKC0/XFxkKlxcLj9cXGQrKSU/LD9cXHMqWy9cXHNdKigtP1xcZCpcXC4/XFxkKyk/KCUpP1xccypcXCk/L2k7XG4gIGNvbnN0IG1hdGNoID0gbWF0Y2hlci5leGVjKGhzdlN0cmluZyk7XG5cbiAgaWYgKCFtYXRjaCkgcmV0dXJuIHsgaDogMCwgczogMCwgdjogMCwgYTogMSB9O1xuXG4gIHJldHVybiByb3VuZEhzdmEoe1xuICAgIGg6IHBhcnNlSHVlKG1hdGNoWzFdLCBtYXRjaFsyXSksXG4gICAgczogTnVtYmVyKG1hdGNoWzNdKSxcbiAgICB2OiBOdW1iZXIobWF0Y2hbNF0pLFxuICAgIGE6IG1hdGNoWzVdID09PSB1bmRlZmluZWQgPyAxIDogTnVtYmVyKG1hdGNoWzVdKSAvIChtYXRjaFs2XSA/IDEwMCA6IDEpXG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGhzdlN0cmluZ1RvSHN2YSA9IGhzdmFTdHJpbmdUb0hzdmE7XG5cbmV4cG9ydCBjb25zdCByZ2JhU3RyaW5nVG9Ic3ZhID0gKHJnYmFTdHJpbmc6IHN0cmluZyk6IEhzdmFDb2xvciA9PiB7XG4gIGNvbnN0IG1hdGNoZXIgPVxuICAgIC9yZ2JhP1xcKD9cXHMqKC0/XFxkKlxcLj9cXGQrKSglKT9bLFxcc10rKC0/XFxkKlxcLj9cXGQrKSglKT9bLFxcc10rKC0/XFxkKlxcLj9cXGQrKSglKT8sP1xccypbL1xcc10qKC0/XFxkKlxcLj9cXGQrKT8oJSk/XFxzKlxcKT8vaTtcbiAgY29uc3QgbWF0Y2ggPSBtYXRjaGVyLmV4ZWMocmdiYVN0cmluZyk7XG5cbiAgaWYgKCFtYXRjaCkgcmV0dXJuIHsgaDogMCwgczogMCwgdjogMCwgYTogMSB9O1xuXG4gIHJldHVybiByZ2JhVG9Ic3ZhKHtcbiAgICByOiBOdW1iZXIobWF0Y2hbMV0pIC8gKG1hdGNoWzJdID8gMTAwIC8gMjU1IDogMSksXG4gICAgZzogTnVtYmVyKG1hdGNoWzNdKSAvIChtYXRjaFs0XSA/IDEwMCAvIDI1NSA6IDEpLFxuICAgIGI6IE51bWJlcihtYXRjaFs1XSkgLyAobWF0Y2hbNl0gPyAxMDAgLyAyNTUgOiAxKSxcbiAgICBhOiBtYXRjaFs3XSA9PT0gdW5kZWZpbmVkID8gMSA6IE51bWJlcihtYXRjaFs3XSkgLyAobWF0Y2hbOF0gPyAxMDAgOiAxKVxuICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCByZ2JTdHJpbmdUb0hzdmEgPSByZ2JhU3RyaW5nVG9Ic3ZhO1xuXG5jb25zdCBmb3JtYXQgPSAobnVtYmVyOiBudW1iZXIpID0+IHtcbiAgY29uc3QgaGV4ID0gbnVtYmVyLnRvU3RyaW5nKDE2KTtcbiAgcmV0dXJuIGhleC5sZW5ndGggPCAyID8gJzAnICsgaGV4IDogaGV4O1xufTtcblxuZXhwb3J0IGNvbnN0IHJnYmFUb0hleCA9ICh7IHIsIGcsIGIsIGEgfTogUmdiYUNvbG9yKTogc3RyaW5nID0+IHtcbiAgY29uc3QgYWxwaGFIZXggPSBhIDwgMSA/IGZvcm1hdChyb3VuZChhICogMjU1KSkgOiAnJztcbiAgcmV0dXJuICcjJyArIGZvcm1hdChyKSArIGZvcm1hdChnKSArIGZvcm1hdChiKSArIGFscGhhSGV4O1xufTtcblxuZXhwb3J0IGNvbnN0IHJnYmFUb0hzdmEgPSAoeyByLCBnLCBiLCBhIH06IFJnYmFDb2xvcik6IEhzdmFDb2xvciA9PiB7XG4gIGNvbnN0IG1heCA9IE1hdGgubWF4KHIsIGcsIGIpO1xuICBjb25zdCBkZWx0YSA9IG1heCAtIE1hdGgubWluKHIsIGcsIGIpO1xuXG4gIC8vIHByZXR0aWVyLWlnbm9yZVxuICBjb25zdCBoaCA9IGRlbHRhXG4gICAgPyBtYXggPT09IHJcbiAgICAgID8gKGcgLSBiKSAvIGRlbHRhXG4gICAgICA6IG1heCA9PT0gZ1xuICAgICAgICA/IDIgKyAoYiAtIHIpIC8gZGVsdGFcbiAgICAgICAgOiA0ICsgKHIgLSBnKSAvIGRlbHRhXG4gICAgOiAwO1xuXG4gIHJldHVybiB7XG4gICAgaDogcm91bmQoNjAgKiAoaGggPCAwID8gaGggKyA2IDogaGgpKSxcbiAgICBzOiByb3VuZChtYXggPyAoZGVsdGEgLyBtYXgpICogMTAwIDogMCksXG4gICAgdjogcm91bmQoKG1heCAvIDI1NSkgKiAxMDApLFxuICAgIGFcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCByb3VuZEhzdmEgPSAoaHN2YTogSHN2YUNvbG9yKTogSHN2YUNvbG9yID0+ICh7XG4gIGg6IHJvdW5kKGhzdmEuaCksXG4gIHM6IHJvdW5kKGhzdmEucyksXG4gIHY6IHJvdW5kKGhzdmEudiksXG4gIGE6IHJvdW5kKGhzdmEuYSwgMilcbn0pO1xuXG5leHBvcnQgY29uc3QgcmdiYVRvUmdiID0gKHsgciwgZywgYiB9OiBSZ2JhQ29sb3IpOiBSZ2JDb2xvciA9PiAoeyByLCBnLCBiIH0pO1xuXG5leHBvcnQgY29uc3QgaHNsYVRvSHNsID0gKHsgaCwgcywgbCB9OiBIc2xhQ29sb3IpOiBIc2xDb2xvciA9PiAoeyBoLCBzLCBsIH0pO1xuXG5leHBvcnQgY29uc3QgaHN2YVRvSHN2ID0gKGhzdmE6IEhzdmFDb2xvcik6IEhzdkNvbG9yID0+IHtcbiAgY29uc3QgeyBoLCBzLCB2IH0gPSByb3VuZEhzdmEoaHN2YSk7XG4gIHJldHVybiB7IGgsIHMsIHYgfTtcbn07XG4iLCAiaW1wb3J0IHsgaGV4VG9SZ2JhIH0gZnJvbSAnLi9jb252ZXJ0LmpzJztcbmltcG9ydCB0eXBlIHsgT2JqZWN0Q29sb3IgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjb25zdCBlcXVhbENvbG9yT2JqZWN0cyA9IChmaXJzdDogT2JqZWN0Q29sb3IsIHNlY29uZDogT2JqZWN0Q29sb3IpOiBib29sZWFuID0+IHtcbiAgaWYgKGZpcnN0ID09PSBzZWNvbmQpIHJldHVybiB0cnVlO1xuXG4gIGZvciAoY29uc3QgcHJvcCBpbiBmaXJzdCkge1xuICAgIC8vIFRoZSBmb2xsb3dpbmcgYWxsb3dzIGZvciBhIHR5cGUtc2FmZSBjYWxsaW5nIG9mIHRoaXMgZnVuY3Rpb24gKGZpcnN0ICYgc2Vjb25kIGhhdmUgdG8gYmUgSFNMLCBIU1YsIG9yIFJHQilcbiAgICAvLyB3aXRoIHR5cGUtdW5zYWZlIGl0ZXJhdGluZyBvdmVyIG9iamVjdCBrZXlzLiBUUyBkb2VzIG5vdCBhbGxvdyB0aGlzIHdpdGhvdXQgYW4gaW5kZXggKGBba2V5OiBzdHJpbmddOiBudW1iZXJgKVxuICAgIC8vIG9uIGFuIG9iamVjdCB0byBkZWZpbmUgaG93IGl0ZXJhdGlvbiBpcyBub3JtYWxseSBkb25lLiBUbyBlbnN1cmUgZXh0cmEga2V5cyBhcmUgbm90IGFsbG93ZWQgb24gb3VyIHR5cGVzLFxuICAgIC8vIHdlIG11c3QgY2FzdCBvdXIgb2JqZWN0IHRvIHVua25vd24gKGFzIFJHQiBkZW1hbmRzIGByYCBiZSBhIGtleSwgd2hpbGUgYFJlY29yZDxzdHJpbmcsIHg+YCBkb2VzIG5vdCBjYXJlIGlmXG4gICAgLy8gdGhlcmUgaXMgb3Igbm90KSwgYW5kIHRoZW4gYXMgYSB0eXBlIFRTIGNhbiBpdGVyYXRlIG92ZXIuXG4gICAgaWYgKFxuICAgICAgKGZpcnN0IGFzIHVua25vd24gYXMgUmVjb3JkPHN0cmluZywgbnVtYmVyPilbcHJvcF0gIT09XG4gICAgICAoc2Vjb25kIGFzIHVua25vd24gYXMgUmVjb3JkPHN0cmluZywgbnVtYmVyPilbcHJvcF1cbiAgICApXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBlcXVhbENvbG9yU3RyaW5nID0gKGZpcnN0OiBzdHJpbmcsIHNlY29uZDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBmaXJzdC5yZXBsYWNlKC9cXHMvZywgJycpID09PSBzZWNvbmQucmVwbGFjZSgvXFxzL2csICcnKTtcbn07XG5cbmV4cG9ydCBjb25zdCBlcXVhbEhleCA9IChmaXJzdDogc3RyaW5nLCBzZWNvbmQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICBpZiAoZmlyc3QudG9Mb3dlckNhc2UoKSA9PT0gc2Vjb25kLnRvTG93ZXJDYXNlKCkpIHJldHVybiB0cnVlO1xuXG4gIC8vIFRvIGNvbXBhcmUgY29sb3JzIGxpa2UgYCNGRkZgIGFuZCBgZmZmZmZmYCB3ZSBjb252ZXJ0IHRoZW0gaW50byBSR0Igb2JqZWN0c1xuICByZXR1cm4gZXF1YWxDb2xvck9iamVjdHMoaGV4VG9SZ2JhKGZpcnN0KSwgaGV4VG9SZ2JhKHNlY29uZCkpO1xufTtcbiIsICJjb25zdCBjYWNoZTogUmVjb3JkPHN0cmluZywgSFRNTFRlbXBsYXRlRWxlbWVudD4gPSB7fTtcblxuZXhwb3J0IGNvbnN0IHRwbCA9IChodG1sOiBzdHJpbmcpOiBIVE1MVGVtcGxhdGVFbGVtZW50ID0+IHtcbiAgbGV0IHRlbXBsYXRlID0gY2FjaGVbaHRtbF07XG4gIGlmICghdGVtcGxhdGUpIHtcbiAgICB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbDtcbiAgICBjYWNoZVtodG1sXSA9IHRlbXBsYXRlO1xuICB9XG4gIHJldHVybiB0ZW1wbGF0ZTtcbn07XG5cbmV4cG9ydCBjb25zdCBmaXJlID0gKHRhcmdldDogSFRNTEVsZW1lbnQsIHR5cGU6IHN0cmluZywgZGV0YWlsOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IHZvaWQgPT4ge1xuICB0YXJnZXQuZGlzcGF0Y2hFdmVudChcbiAgICBuZXcgQ3VzdG9tRXZlbnQodHlwZSwge1xuICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgIGRldGFpbFxuICAgIH0pXG4gICk7XG59O1xuIiwgImltcG9ydCB0eXBlIHsgSHN2YUNvbG9yIH0gZnJvbSAnLi4vdHlwZXMuanMnO1xuaW1wb3J0IHsgZmlyZSwgdHBsIH0gZnJvbSAnLi4vdXRpbHMvZG9tLmpzJztcbmltcG9ydCB7IGNsYW1wIH0gZnJvbSAnLi4vdXRpbHMvbWF0aC5qcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT2Zmc2V0IHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG59XG5cbmxldCBoYXNUb3VjaGVkID0gZmFsc2U7XG5cbi8vIENoZWNrIGlmIGFuIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnkgdG91Y2hcbmNvbnN0IGlzVG91Y2ggPSAoZTogRXZlbnQpOiBlIGlzIFRvdWNoRXZlbnQgPT4gJ3RvdWNoZXMnIGluIGU7XG5cbi8vIFByZXZlbnQgbW9iaWxlIGJyb3dzZXJzIGZyb20gaGFuZGxpbmcgbW91c2UgZXZlbnRzIChjb25mbGljdGluZyB3aXRoIHRvdWNoIG9uZXMpLlxuLy8gSWYgd2UgZGV0ZWN0ZWQgYSB0b3VjaCBpbnRlcmFjdGlvbiBiZWZvcmUsIHdlIHByZWZlciByZWFjdGluZyB0byB0b3VjaCBldmVudHMgb25seS5cbmNvbnN0IGlzVmFsaWQgPSAoZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiA9PiB7XG4gIGlmIChoYXNUb3VjaGVkICYmICFpc1RvdWNoKGV2ZW50KSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoIWhhc1RvdWNoZWQpIGhhc1RvdWNoZWQgPSBpc1RvdWNoKGV2ZW50KTtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5jb25zdCBwb2ludGVyTW92ZSA9ICh0YXJnZXQ6IFNsaWRlciwgZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XG4gIGNvbnN0IHBvaW50ZXIgPSBpc1RvdWNoKGV2ZW50KSA/IGV2ZW50LnRvdWNoZXNbMF0gOiAoZXZlbnQgYXMgTW91c2VFdmVudCk7XG4gIGNvbnN0IHJlY3QgPSB0YXJnZXQuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgZmlyZShcbiAgICB0YXJnZXQuZWwsXG4gICAgJ21vdmUnLFxuICAgIHRhcmdldC5nZXRNb3ZlKHtcbiAgICAgIHg6IGNsYW1wKChwb2ludGVyLnBhZ2VYIC0gKHJlY3QubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCkpIC8gcmVjdC53aWR0aCksXG4gICAgICB5OiBjbGFtcCgocG9pbnRlci5wYWdlWSAtIChyZWN0LnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCkpIC8gcmVjdC5oZWlnaHQpXG4gICAgfSlcbiAgKTtcbn07XG5cbmNvbnN0IGtleU1vdmUgPSAodGFyZ2V0OiBTbGlkZXIsIGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XG4gIC8vIFdlIHVzZSBga2V5Q29kZWAgaW5zdGVhZCBvZiBga2V5YCB0byByZWR1Y2UgdGhlIHNpemUgb2YgdGhlIGxpYnJhcnkuXG4gIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAvLyBJZ25vcmUgYWxsIGtleXMgZXhjZXB0IGFycm93IG9uZXMsIFBhZ2UgVXAsIFBhZ2UgRG93biwgSG9tZSBhbmQgRW5kLlxuICBpZiAoa2V5Q29kZSA+IDQwIHx8ICh0YXJnZXQueHkgJiYga2V5Q29kZSA8IDM3KSB8fCBrZXlDb2RlIDwgMzMpIHJldHVybjtcbiAgLy8gRG8gbm90IHNjcm9sbCBwYWdlIGJ5IGtleXMgd2hlbiBjb2xvciBwaWNrZXIgZWxlbWVudCBoYXMgZm9jdXMuXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIC8vIFNlbmQgcmVsYXRpdmUgb2Zmc2V0IHRvIHRoZSBwYXJlbnQgY29tcG9uZW50LlxuICBmaXJlKFxuICAgIHRhcmdldC5lbCxcbiAgICAnbW92ZScsXG4gICAgdGFyZ2V0LmdldE1vdmUoXG4gICAgICB7XG4gICAgICAgIHg6XG4gICAgICAgICAga2V5Q29kZSA9PT0gMzkgLy8gQXJyb3cgUmlnaHRcbiAgICAgICAgICAgID8gMC4wMVxuICAgICAgICAgICAgOiBrZXlDb2RlID09PSAzNyAvLyBBcnJvdyBMZWZ0XG4gICAgICAgICAgICA/IC0wLjAxXG4gICAgICAgICAgICA6IGtleUNvZGUgPT09IDM0IC8vIFBhZ2UgRG93blxuICAgICAgICAgICAgPyAwLjA1XG4gICAgICAgICAgICA6IGtleUNvZGUgPT09IDMzIC8vIFBhZ2UgVXBcbiAgICAgICAgICAgID8gLTAuMDVcbiAgICAgICAgICAgIDoga2V5Q29kZSA9PT0gMzUgLy8gRW5kXG4gICAgICAgICAgICA/IDFcbiAgICAgICAgICAgIDoga2V5Q29kZSA9PT0gMzYgLy8gSG9tZVxuICAgICAgICAgICAgPyAtMVxuICAgICAgICAgICAgOiAwLFxuICAgICAgICB5OlxuICAgICAgICAgIGtleUNvZGUgPT09IDQwIC8vIEFycm93IGRvd25cbiAgICAgICAgICAgID8gMC4wMVxuICAgICAgICAgICAgOiBrZXlDb2RlID09PSAzOCAvLyBBcnJvdyBVcFxuICAgICAgICAgICAgPyAtMC4wMVxuICAgICAgICAgICAgOiAwXG4gICAgICB9LFxuICAgICAgdHJ1ZVxuICAgIClcbiAgKTtcbn07XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTbGlkZXIge1xuICBkZWNsYXJlIG5vZGVzOiBIVE1MRWxlbWVudFtdO1xuXG4gIGRlY2xhcmUgZWw6IEhUTUxFbGVtZW50O1xuXG4gIGRlY2xhcmUgeHk6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3Iocm9vdDogU2hhZG93Um9vdCwgcGFydDogc3RyaW5nLCBhcmlhOiBzdHJpbmcsIHh5OiBib29sZWFuKSB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSB0cGwoXG4gICAgICBgPGRpdiByb2xlPVwic2xpZGVyXCIgdGFiaW5kZXg9XCIwXCIgcGFydD1cIiR7cGFydH1cIiAke2FyaWF9PjxkaXYgcGFydD1cIiR7cGFydH0tcG9pbnRlclwiPjwvZGl2PjwvZGl2PmBcbiAgICApO1xuICAgIHJvb3QuYXBwZW5kQ2hpbGQodGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuXG4gICAgY29uc3QgZWwgPSByb290LnF1ZXJ5U2VsZWN0b3IoYFtwYXJ0PSR7cGFydH1dYCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcyk7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMpO1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzKTtcbiAgICB0aGlzLmVsID0gZWw7XG5cbiAgICB0aGlzLnh5ID0geHk7XG4gICAgdGhpcy5ub2RlcyA9IFtlbC5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50LCBlbF07XG4gIH1cblxuICBzZXQgZHJhZ2dpbmcoc3RhdGU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCB0b2dnbGVFdmVudCA9IHN0YXRlID8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA6IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXI7XG4gICAgdG9nZ2xlRXZlbnQoaGFzVG91Y2hlZCA/ICd0b3VjaG1vdmUnIDogJ21vdXNlbW92ZScsIHRoaXMpO1xuICAgIHRvZ2dsZUV2ZW50KGhhc1RvdWNoZWQgPyAndG91Y2hlbmQnIDogJ21vdXNldXAnLCB0aGlzKTtcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcbiAgICAgIGNhc2UgJ3RvdWNoc3RhcnQnOlxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAvLyBldmVudC5idXR0b24gaXMgMCBpbiBtb3VzZWRvd24gZm9yIGxlZnQgYnV0dG9uIGFjdGl2YXRpb25cbiAgICAgICAgaWYgKCFpc1ZhbGlkKGV2ZW50KSB8fCAoIWhhc1RvdWNoZWQgJiYgKGV2ZW50IGFzIE1vdXNlRXZlbnQpLmJ1dHRvbiAhPSAwKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLmVsLmZvY3VzKCk7XG4gICAgICAgIHBvaW50ZXJNb3ZlKHRoaXMsIGV2ZW50KTtcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgIGNhc2UgJ3RvdWNobW92ZSc6XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHBvaW50ZXJNb3ZlKHRoaXMsIGV2ZW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgIGNhc2UgJ3RvdWNoZW5kJzpcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2tleWRvd24nOlxuICAgICAgICBrZXlNb3ZlKHRoaXMsIGV2ZW50IGFzIEtleWJvYXJkRXZlbnQpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBhYnN0cmFjdCBnZXRNb3ZlKG9mZnNldDogT2Zmc2V0LCBrZXk/OiBib29sZWFuKTogUmVjb3JkPHN0cmluZywgbnVtYmVyPjtcblxuICBhYnN0cmFjdCB1cGRhdGUoaHN2YTogSHN2YUNvbG9yKTogdm9pZDtcblxuICBzdHlsZShzdHlsZXM6IEFycmF5PFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KTogdm9pZCB7XG4gICAgc3R5bGVzLmZvckVhY2goKHN0eWxlLCBpKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHAgaW4gc3R5bGUpIHtcbiAgICAgICAgdGhpcy5ub2Rlc1tpXS5zdHlsZS5zZXRQcm9wZXJ0eShwLCBzdHlsZVtwXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBTbGlkZXIsIE9mZnNldCB9IGZyb20gJy4vc2xpZGVyLmpzJztcbmltcG9ydCB7IGhzdmFUb0hzbFN0cmluZyB9IGZyb20gJy4uL3V0aWxzL2NvbnZlcnQuanMnO1xuaW1wb3J0IHsgY2xhbXAsIHJvdW5kIH0gZnJvbSAnLi4vdXRpbHMvbWF0aC5qcyc7XG5pbXBvcnQgdHlwZSB7IEhzdmFDb2xvciB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIEh1ZSBleHRlbmRzIFNsaWRlciB7XG4gIGRlY2xhcmUgaDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHJvb3Q6IFNoYWRvd1Jvb3QpIHtcbiAgICBzdXBlcihyb290LCAnaHVlJywgJ2FyaWEtbGFiZWw9XCJIdWVcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIzNjBcIicsIGZhbHNlKTtcbiAgfVxuXG4gIHVwZGF0ZSh7IGggfTogSHN2YUNvbG9yKTogdm9pZCB7XG4gICAgdGhpcy5oID0gaDtcbiAgICB0aGlzLnN0eWxlKFtcbiAgICAgIHtcbiAgICAgICAgbGVmdDogYCR7KGggLyAzNjApICogMTAwfSVgLFxuICAgICAgICBjb2xvcjogaHN2YVRvSHNsU3RyaW5nKHsgaCwgczogMTAwLCB2OiAxMDAsIGE6IDEgfSlcbiAgICAgIH1cbiAgICBdKTtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIGAke3JvdW5kKGgpfWApO1xuICB9XG5cbiAgZ2V0TW92ZShvZmZzZXQ6IE9mZnNldCwga2V5PzogYm9vbGVhbik6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4ge1xuICAgIC8vIEh1ZSBtZWFzdXJlZCBpbiBkZWdyZWVzIG9mIHRoZSBjb2xvciBjaXJjbGUgcmFuZ2luZyBmcm9tIDAgdG8gMzYwXG4gICAgcmV0dXJuIHsgaDoga2V5ID8gY2xhbXAodGhpcy5oICsgb2Zmc2V0LnggKiAzNjAsIDAsIDM2MCkgOiAzNjAgKiBvZmZzZXQueCB9O1xuICB9XG59XG4iLCAiaW1wb3J0IHsgU2xpZGVyLCBPZmZzZXQgfSBmcm9tICcuL3NsaWRlci5qcyc7XG5pbXBvcnQgeyBoc3ZhVG9Ic2xTdHJpbmcgfSBmcm9tICcuLi91dGlscy9jb252ZXJ0LmpzJztcbmltcG9ydCB7IGNsYW1wLCByb3VuZCB9IGZyb20gJy4uL3V0aWxzL21hdGguanMnO1xuaW1wb3J0IHR5cGUgeyBIc3ZhQ29sb3IgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBTYXR1cmF0aW9uIGV4dGVuZHMgU2xpZGVyIHtcbiAgZGVjbGFyZSBoc3ZhOiBIc3ZhQ29sb3I7XG5cbiAgY29uc3RydWN0b3Iocm9vdDogU2hhZG93Um9vdCkge1xuICAgIHN1cGVyKHJvb3QsICdzYXR1cmF0aW9uJywgJ2FyaWEtbGFiZWw9XCJDb2xvclwiJywgdHJ1ZSk7XG4gIH1cblxuICB1cGRhdGUoaHN2YTogSHN2YUNvbG9yKTogdm9pZCB7XG4gICAgdGhpcy5oc3ZhID0gaHN2YTtcbiAgICB0aGlzLnN0eWxlKFtcbiAgICAgIHtcbiAgICAgICAgdG9wOiBgJHsxMDAgLSBoc3ZhLnZ9JWAsXG4gICAgICAgIGxlZnQ6IGAke2hzdmEuc30lYCxcbiAgICAgICAgY29sb3I6IGhzdmFUb0hzbFN0cmluZyhoc3ZhKVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBoc3ZhVG9Ic2xTdHJpbmcoeyBoOiBoc3ZhLmgsIHM6IDEwMCwgdjogMTAwLCBhOiAxIH0pXG4gICAgICB9XG4gICAgXSk7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXG4gICAgICAnYXJpYS12YWx1ZXRleHQnLFxuICAgICAgYFNhdHVyYXRpb24gJHtyb3VuZChoc3ZhLnMpfSUsIEJyaWdodG5lc3MgJHtyb3VuZChoc3ZhLnYpfSVgXG4gICAgKTtcbiAgfVxuXG4gIGdldE1vdmUob2Zmc2V0OiBPZmZzZXQsIGtleT86IGJvb2xlYW4pOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+IHtcbiAgICAvLyBTYXR1cmF0aW9uIGFuZCBicmlnaHRuZXNzIGFsd2F5cyBmaXQgaW50byBbMCwgMTAwXSByYW5nZVxuICAgIHJldHVybiB7XG4gICAgICBzOiBrZXkgPyBjbGFtcCh0aGlzLmhzdmEucyArIG9mZnNldC54ICogMTAwLCAwLCAxMDApIDogb2Zmc2V0LnggKiAxMDAsXG4gICAgICB2OiBrZXkgPyBjbGFtcCh0aGlzLmhzdmEudiAtIG9mZnNldC55ICogMTAwLCAwLCAxMDApIDogTWF0aC5yb3VuZCgxMDAgLSBvZmZzZXQueSAqIDEwMClcbiAgICB9O1xuICB9XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgYDpob3N0e2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6MjAwcHg7aGVpZ2h0OjIwMHB4O3VzZXItc2VsZWN0Om5vbmU7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lO2N1cnNvcjpkZWZhdWx0fTpob3N0KFtoaWRkZW5dKXtkaXNwbGF5Om5vbmUhaW1wb3J0YW50fVtyb2xlPXNsaWRlcl17cG9zaXRpb246cmVsYXRpdmU7dG91Y2gtYWN0aW9uOm5vbmU7dXNlci1zZWxlY3Q6bm9uZTstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7b3V0bGluZTowfVtyb2xlPXNsaWRlcl06bGFzdC1jaGlsZHtib3JkZXItcmFkaXVzOjAgMCA4cHggOHB4fVtwYXJ0JD1wb2ludGVyXXtwb3NpdGlvbjphYnNvbHV0ZTt6LWluZGV4OjE7Ym94LXNpemluZzpib3JkZXItYm94O3dpZHRoOjI4cHg7aGVpZ2h0OjI4cHg7ZGlzcGxheTpmbGV4O3BsYWNlLWNvbnRlbnQ6Y2VudGVyIGNlbnRlcjt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7YmFja2dyb3VuZC1jb2xvcjojZmZmO2JvcmRlcjoycHggc29saWQgI2ZmZjtib3JkZXItcmFkaXVzOjUwJTtib3gtc2hhZG93OjAgMnB4IDRweCByZ2JhKDAsMCwwLC4yKX1bcGFydCQ9cG9pbnRlcl06OmFmdGVye2NvbnRlbnQ6XCJcIjt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO2JvcmRlci1yYWRpdXM6aW5oZXJpdDtiYWNrZ3JvdW5kLWNvbG9yOmN1cnJlbnRDb2xvcn1bcm9sZT1zbGlkZXJdOmZvY3VzIFtwYXJ0JD1wb2ludGVyXXt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSkgc2NhbGUoMS4xKX1gO1xuIiwgImV4cG9ydCBkZWZhdWx0IGBbcGFydD1odWVde2ZsZXg6MCAwIDI0cHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQscmVkIDAsI2ZmMCAxNyUsIzBmMCAzMyUsIzBmZiA1MCUsIzAwZiA2NyUsI2YwZiA4MyUscmVkIDEwMCUpfVtwYXJ0PWh1ZS1wb2ludGVyXXt0b3A6NTAlO3otaW5kZXg6Mn1gO1xuIiwgImV4cG9ydCBkZWZhdWx0IGBbcGFydD1zYXR1cmF0aW9uXXtmbGV4LWdyb3c6MTtib3JkZXItY29sb3I6dHJhbnNwYXJlbnQ7Ym9yZGVyLWJvdHRvbToxMnB4IHNvbGlkICMwMDA7Ym9yZGVyLXJhZGl1czo4cHggOHB4IDAgMDtiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudCh0byB0b3AsIzAwMCx0cmFuc3BhcmVudCksbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCNmZmYscmdiYSgyNTUsMjU1LDI1NSwwKSk7Ym94LXNoYWRvdzppbnNldCAwIDAgMCAxcHggcmdiYSgwLDAsMCwuMDUpfVtwYXJ0PXNhdHVyYXRpb24tcG9pbnRlcl17ei1pbmRleDozfWA7XG4iLCAiaW1wb3J0IHsgZXF1YWxDb2xvck9iamVjdHMgfSBmcm9tICcuLi91dGlscy9jb21wYXJlLmpzJztcbmltcG9ydCB7IGZpcmUsIHRwbCB9IGZyb20gJy4uL3V0aWxzL2RvbS5qcyc7XG5pbXBvcnQgdHlwZSB7IEFueUNvbG9yLCBDb2xvck1vZGVsLCBIc3ZhQ29sb3IgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBIdWUgfSBmcm9tICcuL2h1ZS5qcyc7XG5pbXBvcnQgeyBTYXR1cmF0aW9uIH0gZnJvbSAnLi9zYXR1cmF0aW9uLmpzJztcbmltcG9ydCB0eXBlIHsgU2xpZGVyIH0gZnJvbSAnLi9zbGlkZXIuanMnO1xuaW1wb3J0IGNzcyBmcm9tICcuLi9zdHlsZXMvY29sb3ItcGlja2VyLmpzJztcbmltcG9ydCBodWVDc3MgZnJvbSAnLi4vc3R5bGVzL2h1ZS5qcyc7XG5pbXBvcnQgc2F0dXJhdGlvbkNzcyBmcm9tICcuLi9zdHlsZXMvc2F0dXJhdGlvbi5qcyc7XG5cbmNvbnN0ICRpc1NhbWUgPSBTeW1ib2woJ3NhbWUnKTtcbmNvbnN0ICRjb2xvciA9IFN5bWJvbCgnY29sb3InKTtcbmNvbnN0ICRoc3ZhID0gU3ltYm9sKCdoc3ZhJyk7XG5jb25zdCAkdXBkYXRlID0gU3ltYm9sKCd1cGRhdGUnKTtcbmNvbnN0ICRwYXJ0cyA9IFN5bWJvbCgncGFydHMnKTtcblxuZXhwb3J0IGNvbnN0ICRjc3MgPSBTeW1ib2woJ2NzcycpO1xuZXhwb3J0IGNvbnN0ICRzbGlkZXJzID0gU3ltYm9sKCdzbGlkZXJzJyk7XG5cbmV4cG9ydCB0eXBlIFNsaWRlcnMgPSBBcnJheTxuZXcgKHJvb3Q6IFNoYWRvd1Jvb3QpID0+IFNsaWRlcj47XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb2xvclBpY2tlcjxDIGV4dGVuZHMgQW55Q29sb3I+IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFsnY29sb3InXTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgWyRjc3NdKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gW2NzcywgaHVlQ3NzLCBzYXR1cmF0aW9uQ3NzXTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgWyRzbGlkZXJzXSgpOiBTbGlkZXJzIHtcbiAgICByZXR1cm4gW1NhdHVyYXRpb24sIEh1ZV07XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0IGNvbG9yTW9kZWwoKTogQ29sb3JNb2RlbDxDPjtcblxuICBwcml2YXRlIGRlY2xhcmUgWyRoc3ZhXTogSHN2YUNvbG9yO1xuXG4gIHByaXZhdGUgZGVjbGFyZSBbJGNvbG9yXTogQztcblxuICBwcml2YXRlIGRlY2xhcmUgWyRwYXJ0c106IFNsaWRlcltdO1xuXG4gIGdldCBjb2xvcigpOiBDIHtcbiAgICByZXR1cm4gdGhpc1skY29sb3JdO1xuICB9XG5cbiAgc2V0IGNvbG9yKG5ld0NvbG9yOiBDKSB7XG4gICAgaWYgKCF0aGlzWyRpc1NhbWVdKG5ld0NvbG9yKSkge1xuICAgICAgY29uc3QgbmV3SHN2YSA9IHRoaXMuY29sb3JNb2RlbC50b0hzdmEobmV3Q29sb3IpO1xuICAgICAgdGhpc1skdXBkYXRlXShuZXdIc3ZhKTtcbiAgICAgIHRoaXNbJGNvbG9yXSA9IG5ld0NvbG9yO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgY29uc3QgdGVtcGxhdGUgPSB0cGwoYDxzdHlsZT4ke3RoaXNbJGNzc10uam9pbignJyl9PC9zdHlsZT5gKTtcbiAgICBjb25zdCByb290ID0gdGhpcy5hdHRhY2hTaGFkb3coeyBtb2RlOiAnb3BlbicgfSk7XG4gICAgcm9vdC5hcHBlbmRDaGlsZCh0ZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgcm9vdC5hZGRFdmVudExpc3RlbmVyKCdtb3ZlJywgdGhpcyk7XG4gICAgdGhpc1skcGFydHNdID0gdGhpc1skc2xpZGVyc10ubWFwKChzbGlkZXIpID0+IG5ldyBzbGlkZXIocm9vdCkpO1xuICB9XG5cbiAgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XG4gICAgLy8gQSB1c2VyIG1heSBzZXQgYSBwcm9wZXJ0eSBvbiBhbiBfaW5zdGFuY2VfIG9mIGFuIGVsZW1lbnQsXG4gICAgLy8gYmVmb3JlIGl0cyBwcm90b3R5cGUgaGFzIGJlZW4gY29ubmVjdGVkIHRvIHRoaXMgY2xhc3MuXG4gICAgLy8gSWYgc28sIHdlIG5lZWQgdG8gcnVuIGl0IHRocm91Z2ggdGhlIHByb3BlciBjbGFzcyBzZXR0ZXIuXG4gICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoJ2NvbG9yJykpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jb2xvcjtcbiAgICAgIGRlbGV0ZSB0aGlzWydjb2xvcicgYXMga2V5b2YgdGhpc107XG4gICAgICB0aGlzLmNvbG9yID0gdmFsdWU7XG4gICAgfSBlbHNlIGlmICghdGhpcy5jb2xvcikge1xuICAgICAgdGhpcy5jb2xvciA9IHRoaXMuY29sb3JNb2RlbC5kZWZhdWx0Q29sb3I7XG4gICAgfVxuICB9XG5cbiAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKF9hdHRyOiBzdHJpbmcsIF9vbGRWYWw6IHN0cmluZywgbmV3VmFsOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBjb2xvciA9IHRoaXMuY29sb3JNb2RlbC5mcm9tQXR0cihuZXdWYWwpO1xuICAgIGlmICghdGhpc1skaXNTYW1lXShjb2xvcikpIHtcbiAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVFdmVudChldmVudDogQ3VzdG9tRXZlbnQpOiB2b2lkIHtcbiAgICAvLyBNZXJnZSB0aGUgY3VycmVudCBIU1YgY29sb3Igb2JqZWN0IHdpdGggdXBkYXRlZCBwYXJhbXMuXG4gICAgY29uc3Qgb2xkSHN2YSA9IHRoaXNbJGhzdmFdO1xuICAgIGNvbnN0IG5ld0hzdmEgPSB7IC4uLm9sZEhzdmEsIC4uLmV2ZW50LmRldGFpbCB9O1xuICAgIHRoaXNbJHVwZGF0ZV0obmV3SHN2YSk7XG4gICAgbGV0IG5ld0NvbG9yO1xuICAgIGlmIChcbiAgICAgICFlcXVhbENvbG9yT2JqZWN0cyhuZXdIc3ZhLCBvbGRIc3ZhKSAmJlxuICAgICAgIXRoaXNbJGlzU2FtZV0oKG5ld0NvbG9yID0gdGhpcy5jb2xvck1vZGVsLmZyb21Ic3ZhKG5ld0hzdmEpKSlcbiAgICApIHtcbiAgICAgIHRoaXNbJGNvbG9yXSA9IG5ld0NvbG9yO1xuICAgICAgZmlyZSh0aGlzLCAnY29sb3ItY2hhbmdlZCcsIHsgdmFsdWU6IG5ld0NvbG9yIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgWyRpc1NhbWVdKGNvbG9yOiBDKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29sb3IgJiYgdGhpcy5jb2xvck1vZGVsLmVxdWFsKGNvbG9yLCB0aGlzLmNvbG9yKTtcbiAgfVxuXG4gIHByaXZhdGUgWyR1cGRhdGVdKGhzdmE6IEhzdmFDb2xvcik6IHZvaWQge1xuICAgIHRoaXNbJGhzdmFdID0gaHN2YTtcbiAgICB0aGlzWyRwYXJ0c10uZm9yRWFjaCgocGFydCkgPT4gcGFydC51cGRhdGUoaHN2YSkpO1xuICB9XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBDb2xvck1vZGVsLCBDb2xvclBpY2tlckV2ZW50TGlzdGVuZXIsIENvbG9yUGlja2VyRXZlbnRNYXAgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBDb2xvclBpY2tlciB9IGZyb20gJy4uL2NvbXBvbmVudHMvY29sb3ItcGlja2VyLmpzJztcbmltcG9ydCB7IGhleFRvSHN2YSwgaHN2YVRvSGV4IH0gZnJvbSAnLi4vdXRpbHMvY29udmVydC5qcyc7XG5pbXBvcnQgeyBlcXVhbEhleCB9IGZyb20gJy4uL3V0aWxzL2NvbXBhcmUuanMnO1xuXG5jb25zdCBjb2xvck1vZGVsOiBDb2xvck1vZGVsPHN0cmluZz4gPSB7XG4gIGRlZmF1bHRDb2xvcjogJyMwMDAnLFxuICB0b0hzdmE6IGhleFRvSHN2YSxcbiAgZnJvbUhzdmE6ICh7IGgsIHMsIHYgfSkgPT4gaHN2YVRvSGV4KHsgaCwgcywgdiwgYTogMSB9KSxcbiAgZXF1YWw6IGVxdWFsSGV4LFxuICBmcm9tQXR0cjogKGNvbG9yKSA9PiBjb2xvclxufTtcblxuZXhwb3J0IGludGVyZmFjZSBIZXhCYXNlIHtcbiAgYWRkRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMga2V5b2YgQ29sb3JQaWNrZXJFdmVudE1hcDxzdHJpbmc+PihcbiAgICB0eXBlOiBULFxuICAgIGxpc3RlbmVyOiBDb2xvclBpY2tlckV2ZW50TGlzdGVuZXI8Q29sb3JQaWNrZXJFdmVudE1hcDxzdHJpbmc+W1RdPixcbiAgICBvcHRpb25zPzogYm9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zXG4gICk6IHZvaWQ7XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMga2V5b2YgQ29sb3JQaWNrZXJFdmVudE1hcDxzdHJpbmc+PihcbiAgICB0eXBlOiBULFxuICAgIGxpc3RlbmVyOiBDb2xvclBpY2tlckV2ZW50TGlzdGVuZXI8Q29sb3JQaWNrZXJFdmVudE1hcDxzdHJpbmc+W1RdPixcbiAgICBvcHRpb25zPzogYm9vbGVhbiB8IEV2ZW50TGlzdGVuZXJPcHRpb25zXG4gICk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBIZXhCYXNlIGV4dGVuZHMgQ29sb3JQaWNrZXI8c3RyaW5nPiB7XG4gIHByb3RlY3RlZCBnZXQgY29sb3JNb2RlbCgpOiBDb2xvck1vZGVsPHN0cmluZz4ge1xuICAgIHJldHVybiBjb2xvck1vZGVsO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgSGV4QmFzZSB9IGZyb20gJy4vbGliL2VudHJ5cG9pbnRzL2hleC5qcyc7XG5cbi8qKlxuICogQSBjb2xvciBwaWNrZXIgY3VzdG9tIGVsZW1lbnQgdGhhdCB1c2VzIEhFWCBmb3JtYXQuXG4gKlxuICogQGVsZW1lbnQgaGV4LWNvbG9yLXBpY2tlclxuICpcbiAqIEBwcm9wIHtzdHJpbmd9IGNvbG9yIC0gU2VsZWN0ZWQgY29sb3IgaW4gSEVYIGZvcm1hdC5cbiAqIEBhdHRyIHtzdHJpbmd9IGNvbG9yIC0gU2VsZWN0ZWQgY29sb3IgaW4gSEVYIGZvcm1hdC5cbiAqXG4gKiBAZmlyZXMgY29sb3ItY2hhbmdlZCAtIEV2ZW50IGZpcmVkIHdoZW4gY29sb3IgcHJvcGVydHkgY2hhbmdlcy5cbiAqXG4gKiBAY3NzcGFydCBodWUgLSBBIGh1ZSBzZWxlY3RvciBjb250YWluZXIuXG4gKiBAY3NzcGFydCBzYXR1cmF0aW9uIC0gQSBzYXR1cmF0aW9uIHNlbGVjdG9yIGNvbnRhaW5lclxuICogQGNzc3BhcnQgaHVlLXBvaW50ZXIgLSBBIGh1ZSBwb2ludGVyIGVsZW1lbnQuXG4gKiBAY3NzcGFydCBzYXR1cmF0aW9uLXBvaW50ZXIgLSBBIHNhdHVyYXRpb24gcG9pbnRlciBlbGVtZW50LlxuICovXG5leHBvcnQgY2xhc3MgSGV4Q29sb3JQaWNrZXIgZXh0ZW5kcyBIZXhCYXNlIHt9XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnaGV4LWNvbG9yLXBpY2tlcicsIEhleENvbG9yUGlja2VyKTtcblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgSFRNTEVsZW1lbnRUYWdOYW1lTWFwIHtcbiAgICAnaGV4LWNvbG9yLXBpY2tlcic6IEhleENvbG9yUGlja2VyO1xuICB9XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBDb2xvck1vZGVsLCBDb2xvclBpY2tlckV2ZW50TGlzdGVuZXIsIENvbG9yUGlja2VyRXZlbnRNYXAgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBDb2xvclBpY2tlciB9IGZyb20gJy4uL2NvbXBvbmVudHMvY29sb3ItcGlja2VyLmpzJztcbmltcG9ydCB7IGhzbFN0cmluZ1RvSHN2YSwgaHN2YVRvSHNsU3RyaW5nIH0gZnJvbSAnLi4vdXRpbHMvY29udmVydC5qcyc7XG5pbXBvcnQgeyBlcXVhbENvbG9yU3RyaW5nIH0gZnJvbSAnLi4vdXRpbHMvY29tcGFyZS5qcyc7XG5cbmNvbnN0IGNvbG9yTW9kZWw6IENvbG9yTW9kZWw8c3RyaW5nPiA9IHtcbiAgZGVmYXVsdENvbG9yOiAnaHNsKDAsIDAlLCAwJSknLFxuICB0b0hzdmE6IGhzbFN0cmluZ1RvSHN2YSxcbiAgZnJvbUhzdmE6IGhzdmFUb0hzbFN0cmluZyxcbiAgZXF1YWw6IGVxdWFsQ29sb3JTdHJpbmcsXG4gIGZyb21BdHRyOiAoY29sb3IpID0+IGNvbG9yXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIEhzbFN0cmluZ0Jhc2Uge1xuICBhZGRFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBrZXlvZiBDb2xvclBpY2tlckV2ZW50TWFwPHN0cmluZz4+KFxuICAgIHR5cGU6IFQsXG4gICAgbGlzdGVuZXI6IENvbG9yUGlja2VyRXZlbnRMaXN0ZW5lcjxDb2xvclBpY2tlckV2ZW50TWFwPHN0cmluZz5bVF0+LFxuICAgIG9wdGlvbnM/OiBib29sZWFuIHwgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnNcbiAgKTogdm9pZDtcblxuICByZW1vdmVFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBrZXlvZiBDb2xvclBpY2tlckV2ZW50TWFwPHN0cmluZz4+KFxuICAgIHR5cGU6IFQsXG4gICAgbGlzdGVuZXI6IENvbG9yUGlja2VyRXZlbnRMaXN0ZW5lcjxDb2xvclBpY2tlckV2ZW50TWFwPHN0cmluZz5bVF0+LFxuICAgIG9wdGlvbnM/OiBib29sZWFuIHwgRXZlbnRMaXN0ZW5lck9wdGlvbnNcbiAgKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIEhzbFN0cmluZ0Jhc2UgZXh0ZW5kcyBDb2xvclBpY2tlcjxzdHJpbmc+IHtcbiAgcHJvdGVjdGVkIGdldCBjb2xvck1vZGVsKCk6IENvbG9yTW9kZWw8c3RyaW5nPiB7XG4gICAgcmV0dXJuIGNvbG9yTW9kZWw7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBIc2xTdHJpbmdCYXNlIH0gZnJvbSAnLi9saWIvZW50cnlwb2ludHMvaHNsLXN0cmluZy5qcyc7XG5cbi8qKlxuICogQSBjb2xvciBwaWNrZXIgY3VzdG9tIGVsZW1lbnQgdGhhdCB1c2VzIEhTTCBzdHJpbmcgZm9ybWF0LlxuICpcbiAqIEBlbGVtZW50IGhzbC1zdHJpbmctY29sb3ItcGlja2VyXG4gKlxuICogQHByb3Age3N0cmluZ30gY29sb3IgLSBTZWxlY3RlZCBjb2xvciBpbiBIU0wgc3RyaW5nIGZvcm1hdC5cbiAqIEBhdHRyIHtzdHJpbmd9IGNvbG9yIC0gU2VsZWN0ZWQgY29sb3IgaW4gSFNMIHN0cmluZyBmb3JtYXQuXG4gKlxuICogQGZpcmVzIGNvbG9yLWNoYW5nZWQgLSBFdmVudCBmaXJlZCB3aGVuIGNvbG9yIHByb3BlcnR5IGNoYW5nZXMuXG4gKlxuICogQGNzc3BhcnQgaHVlIC0gQSBodWUgc2VsZWN0b3IgY29udGFpbmVyLlxuICogQGNzc3BhcnQgc2F0dXJhdGlvbiAtIEEgc2F0dXJhdGlvbiBzZWxlY3RvciBjb250YWluZXJcbiAqIEBjc3NwYXJ0IGh1ZS1wb2ludGVyIC0gQSBodWUgcG9pbnRlciBlbGVtZW50LlxuICogQGNzc3BhcnQgc2F0dXJhdGlvbi1wb2ludGVyIC0gQSBzYXR1cmF0aW9uIHBvaW50ZXIgZWxlbWVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIEhzbFN0cmluZ0NvbG9yUGlja2VyIGV4dGVuZHMgSHNsU3RyaW5nQmFzZSB7fVxuXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2hzbC1zdHJpbmctY29sb3ItcGlja2VyJywgSHNsU3RyaW5nQ29sb3JQaWNrZXIpO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIGludGVyZmFjZSBIVE1MRWxlbWVudFRhZ05hbWVNYXAge1xuICAgICdoc2wtc3RyaW5nLWNvbG9yLXBpY2tlcic6IEhzbFN0cmluZ0NvbG9yUGlja2VyO1xuICB9XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBDb2xvck1vZGVsLCBDb2xvclBpY2tlckV2ZW50TGlzdGVuZXIsIENvbG9yUGlja2VyRXZlbnRNYXAgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBDb2xvclBpY2tlciB9IGZyb20gJy4uL2NvbXBvbmVudHMvY29sb3ItcGlja2VyLmpzJztcbmltcG9ydCB7IHJnYlN0cmluZ1RvSHN2YSwgaHN2YVRvUmdiU3RyaW5nIH0gZnJvbSAnLi4vdXRpbHMvY29udmVydC5qcyc7XG5pbXBvcnQgeyBlcXVhbENvbG9yU3RyaW5nIH0gZnJvbSAnLi4vdXRpbHMvY29tcGFyZS5qcyc7XG5cbmNvbnN0IGNvbG9yTW9kZWw6IENvbG9yTW9kZWw8c3RyaW5nPiA9IHtcbiAgZGVmYXVsdENvbG9yOiAncmdiKDAsIDAsIDApJyxcbiAgdG9Ic3ZhOiByZ2JTdHJpbmdUb0hzdmEsXG4gIGZyb21Ic3ZhOiBoc3ZhVG9SZ2JTdHJpbmcsXG4gIGVxdWFsOiBlcXVhbENvbG9yU3RyaW5nLFxuICBmcm9tQXR0cjogKGNvbG9yKSA9PiBjb2xvclxufTtcblxuZXhwb3J0IGludGVyZmFjZSBSZ2JTdHJpbmdCYXNlIHtcbiAgYWRkRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMga2V5b2YgQ29sb3JQaWNrZXJFdmVudE1hcDxzdHJpbmc+PihcbiAgICB0eXBlOiBULFxuICAgIGxpc3RlbmVyOiBDb2xvclBpY2tlckV2ZW50TGlzdGVuZXI8Q29sb3JQaWNrZXJFdmVudE1hcDxzdHJpbmc+W1RdPixcbiAgICBvcHRpb25zPzogYm9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zXG4gICk6IHZvaWQ7XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMga2V5b2YgQ29sb3JQaWNrZXJFdmVudE1hcDxzdHJpbmc+PihcbiAgICB0eXBlOiBULFxuICAgIGxpc3RlbmVyOiBDb2xvclBpY2tlckV2ZW50TGlzdGVuZXI8Q29sb3JQaWNrZXJFdmVudE1hcDxzdHJpbmc+W1RdPixcbiAgICBvcHRpb25zPzogYm9vbGVhbiB8IEV2ZW50TGlzdGVuZXJPcHRpb25zXG4gICk6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBSZ2JTdHJpbmdCYXNlIGV4dGVuZHMgQ29sb3JQaWNrZXI8c3RyaW5nPiB7XG4gIHByb3RlY3RlZCBnZXQgY29sb3JNb2RlbCgpOiBDb2xvck1vZGVsPHN0cmluZz4ge1xuICAgIHJldHVybiBjb2xvck1vZGVsO1xuICB9XG59XG4iLCAiaW1wb3J0IHsgUmdiU3RyaW5nQmFzZSB9IGZyb20gJy4vbGliL2VudHJ5cG9pbnRzL3JnYi1zdHJpbmcuanMnO1xuXG4vKipcbiAqIEEgY29sb3IgcGlja2VyIGN1c3RvbSBlbGVtZW50IHRoYXQgdXNlcyBSR0Igc3RyaW5nIGZvcm1hdC5cbiAqXG4gKiBAZWxlbWVudCByZ2Itc3RyaW5nLWNvbG9yLXBpY2tlclxuICpcbiAqIEBwcm9wIHtzdHJpbmd9IGNvbG9yIC0gU2VsZWN0ZWQgY29sb3IgaW4gUkdCIHN0cmluZyBmb3JtYXQuXG4gKiBAYXR0ciB7c3RyaW5nfSBjb2xvciAtIFNlbGVjdGVkIGNvbG9yIGluIFJHQiBzdHJpbmcgZm9ybWF0LlxuICpcbiAqIEBmaXJlcyBjb2xvci1jaGFuZ2VkIC0gRXZlbnQgZmlyZWQgd2hlbiBjb2xvciBwcm9wZXJ0eSBjaGFuZ2VzLlxuICpcbiAqIEBjc3NwYXJ0IGh1ZSAtIEEgaHVlIHNlbGVjdG9yIGNvbnRhaW5lci5cbiAqIEBjc3NwYXJ0IHNhdHVyYXRpb24gLSBBIHNhdHVyYXRpb24gc2VsZWN0b3IgY29udGFpbmVyXG4gKiBAY3NzcGFydCBodWUtcG9pbnRlciAtIEEgaHVlIHBvaW50ZXIgZWxlbWVudC5cbiAqIEBjc3NwYXJ0IHNhdHVyYXRpb24tcG9pbnRlciAtIEEgc2F0dXJhdGlvbiBwb2ludGVyIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZ2JTdHJpbmdDb2xvclBpY2tlciBleHRlbmRzIFJnYlN0cmluZ0Jhc2Uge31cblxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdyZ2Itc3RyaW5nLWNvbG9yLXBpY2tlcicsIFJnYlN0cmluZ0NvbG9yUGlja2VyKTtcblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgSFRNTEVsZW1lbnRUYWdOYW1lTWFwIHtcbiAgICAncmdiLXN0cmluZy1jb2xvci1waWNrZXInOiBSZ2JTdHJpbmdDb2xvclBpY2tlcjtcbiAgfVxufVxuIiwgImltcG9ydCB7IFNsaWRlciwgT2Zmc2V0IH0gZnJvbSAnLi9zbGlkZXIuanMnO1xuaW1wb3J0IHsgaHN2YVRvSHNsYVN0cmluZyB9IGZyb20gJy4uL3V0aWxzL2NvbnZlcnQuanMnO1xuaW1wb3J0IHsgY2xhbXAsIHJvdW5kIH0gZnJvbSAnLi4vdXRpbHMvbWF0aC5qcyc7XG5pbXBvcnQgdHlwZSB7IEhzdmFDb2xvciB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIEFscGhhIGV4dGVuZHMgU2xpZGVyIHtcbiAgZGVjbGFyZSBoc3ZhOiBIc3ZhQ29sb3I7XG5cbiAgY29uc3RydWN0b3Iocm9vdDogU2hhZG93Um9vdCkge1xuICAgIHN1cGVyKHJvb3QsICdhbHBoYScsICdhcmlhLWxhYmVsPVwiQWxwaGFcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxXCInLCBmYWxzZSk7XG4gIH1cblxuICB1cGRhdGUoaHN2YTogSHN2YUNvbG9yKTogdm9pZCB7XG4gICAgdGhpcy5oc3ZhID0gaHN2YTtcbiAgICBjb25zdCBjb2xvckZyb20gPSBoc3ZhVG9Ic2xhU3RyaW5nKHsgLi4uaHN2YSwgYTogMCB9KTtcbiAgICBjb25zdCBjb2xvclRvID0gaHN2YVRvSHNsYVN0cmluZyh7IC4uLmhzdmEsIGE6IDEgfSk7XG4gICAgY29uc3QgdmFsdWUgPSBoc3ZhLmEgKiAxMDA7XG5cbiAgICB0aGlzLnN0eWxlKFtcbiAgICAgIHtcbiAgICAgICAgbGVmdDogYCR7dmFsdWV9JWAsXG4gICAgICAgIGNvbG9yOiBoc3ZhVG9Ic2xhU3RyaW5nKGhzdmEpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAnLS1ncmFkaWVudCc6IGBsaW5lYXItZ3JhZGllbnQoOTBkZWcsICR7Y29sb3JGcm9tfSwgJHtjb2xvclRvfWBcbiAgICAgIH1cbiAgICBdKTtcblxuICAgIGNvbnN0IHYgPSByb3VuZCh2YWx1ZSk7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCBgJHt2fWApO1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVldGV4dCcsIGAke3Z9JWApO1xuICB9XG5cbiAgZ2V0TW92ZShvZmZzZXQ6IE9mZnNldCwga2V5PzogYm9vbGVhbik6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4ge1xuICAgIC8vIEFscGhhIGFsd2F5cyBmaXQgaW50byBbMCwgMV0gcmFuZ2VcbiAgICByZXR1cm4geyBhOiBrZXkgPyBjbGFtcCh0aGlzLmhzdmEuYSArIG9mZnNldC54KSA6IG9mZnNldC54IH07XG4gIH1cbn1cbiIsICJleHBvcnQgZGVmYXVsdCBgW3BhcnQ9YWxwaGFde2ZsZXg6MCAwIDI0cHh9W3BhcnQ9YWxwaGFdOjphZnRlcntkaXNwbGF5OmJsb2NrO2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0OjA7cmlnaHQ6MDtib3R0b206MDtib3JkZXItcmFkaXVzOmluaGVyaXQ7YmFja2dyb3VuZC1pbWFnZTp2YXIoLS1ncmFkaWVudCk7Ym94LXNoYWRvdzppbnNldCAwIDAgMCAxcHggcmdiYSgwLDAsMCwuMDUpfVtwYXJ0Xj1hbHBoYV17YmFja2dyb3VuZC1jb2xvcjojZmZmO2JhY2tncm91bmQtaW1hZ2U6dXJsKCdkYXRhOmltYWdlL3N2Zyt4bWwsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgZmlsbC1vcGFjaXR5PVwiLjA1XCI+PHJlY3QgeD1cIjhcIiB3aWR0aD1cIjhcIiBoZWlnaHQ9XCI4XCIvPjxyZWN0IHk9XCI4XCIgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiOFwiLz48L3N2Zz4nKX1bcGFydD1hbHBoYS1wb2ludGVyXXt0b3A6NTAlfWA7XG4iLCAiaW1wb3J0IHsgQ29sb3JQaWNrZXIsIFNsaWRlcnMsICRjc3MsICRzbGlkZXJzIH0gZnJvbSAnLi9jb2xvci1waWNrZXIuanMnO1xuaW1wb3J0IHR5cGUgeyBBbnlDb2xvciB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IEFscGhhIH0gZnJvbSAnLi9hbHBoYS5qcyc7XG5pbXBvcnQgYWxwaGFDc3MgZnJvbSAnLi4vc3R5bGVzL2FscGhhLmpzJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFscGhhQ29sb3JQaWNrZXI8QyBleHRlbmRzIEFueUNvbG9yPiBleHRlbmRzIENvbG9yUGlja2VyPEM+IHtcbiAgcHJvdGVjdGVkIGdldCBbJGNzc10oKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBbLi4uc3VwZXJbJGNzc10sIGFscGhhQ3NzXTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgWyRzbGlkZXJzXSgpOiBTbGlkZXJzIHtcbiAgICByZXR1cm4gWy4uLnN1cGVyWyRzbGlkZXJzXSwgQWxwaGFdO1xuICB9XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBDb2xvck1vZGVsLCBDb2xvclBpY2tlckV2ZW50TGlzdGVuZXIsIENvbG9yUGlja2VyRXZlbnRNYXAgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBBbHBoYUNvbG9yUGlja2VyIH0gZnJvbSAnLi4vY29tcG9uZW50cy9hbHBoYS1jb2xvci1waWNrZXIuanMnO1xuaW1wb3J0IHsgcmdiYVN0cmluZ1RvSHN2YSwgaHN2YVRvUmdiYVN0cmluZyB9IGZyb20gJy4uL3V0aWxzL2NvbnZlcnQuanMnO1xuaW1wb3J0IHsgZXF1YWxDb2xvclN0cmluZyB9IGZyb20gJy4uL3V0aWxzL2NvbXBhcmUuanMnO1xuXG5jb25zdCBjb2xvck1vZGVsOiBDb2xvck1vZGVsPHN0cmluZz4gPSB7XG4gIGRlZmF1bHRDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMSknLFxuICB0b0hzdmE6IHJnYmFTdHJpbmdUb0hzdmEsXG4gIGZyb21Ic3ZhOiBoc3ZhVG9SZ2JhU3RyaW5nLFxuICBlcXVhbDogZXF1YWxDb2xvclN0cmluZyxcbiAgZnJvbUF0dHI6IChjb2xvcikgPT4gY29sb3Jcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmdiYVN0cmluZ0Jhc2Uge1xuICBhZGRFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBrZXlvZiBDb2xvclBpY2tlckV2ZW50TWFwPHN0cmluZz4+KFxuICAgIHR5cGU6IFQsXG4gICAgbGlzdGVuZXI6IENvbG9yUGlja2VyRXZlbnRMaXN0ZW5lcjxDb2xvclBpY2tlckV2ZW50TWFwPHN0cmluZz5bVF0+LFxuICAgIG9wdGlvbnM/OiBib29sZWFuIHwgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnNcbiAgKTogdm9pZDtcblxuICByZW1vdmVFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBrZXlvZiBDb2xvclBpY2tlckV2ZW50TWFwPHN0cmluZz4+KFxuICAgIHR5cGU6IFQsXG4gICAgbGlzdGVuZXI6IENvbG9yUGlja2VyRXZlbnRMaXN0ZW5lcjxDb2xvclBpY2tlckV2ZW50TWFwPHN0cmluZz5bVF0+LFxuICAgIG9wdGlvbnM/OiBib29sZWFuIHwgRXZlbnRMaXN0ZW5lck9wdGlvbnNcbiAgKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFJnYmFTdHJpbmdCYXNlIGV4dGVuZHMgQWxwaGFDb2xvclBpY2tlcjxzdHJpbmc+IHtcbiAgcHJvdGVjdGVkIGdldCBjb2xvck1vZGVsKCk6IENvbG9yTW9kZWw8c3RyaW5nPiB7XG4gICAgcmV0dXJuIGNvbG9yTW9kZWw7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBSZ2JhU3RyaW5nQmFzZSB9IGZyb20gJy4vbGliL2VudHJ5cG9pbnRzL3JnYmEtc3RyaW5nLmpzJztcblxuLyoqXG4gKiBBIGNvbG9yIHBpY2tlciBjdXN0b20gZWxlbWVudCB0aGF0IHVzZXMgUkdCQSBzdHJpbmcgZm9ybWF0LlxuICpcbiAqIEBlbGVtZW50IHJnYmEtc3RyaW5nLWNvbG9yLXBpY2tlclxuICpcbiAqIEBwcm9wIHtzdHJpbmd9IGNvbG9yIC0gU2VsZWN0ZWQgY29sb3IgaW4gUkdCQSBzdHJpbmcgZm9ybWF0LlxuICogQGF0dHIge3N0cmluZ30gY29sb3IgLSBTZWxlY3RlZCBjb2xvciBpbiBSR0JBIHN0cmluZyBmb3JtYXQuXG4gKlxuICogQGZpcmVzIGNvbG9yLWNoYW5nZWQgLSBFdmVudCBmaXJlZCB3aGVuIGNvbG9yIHByb3BlcnR5IGNoYW5nZXMuXG4gKlxuICogQGNzc3BhcnQgaHVlIC0gQSBodWUgc2VsZWN0b3IgY29udGFpbmVyLlxuICogQGNzc3BhcnQgc2F0dXJhdGlvbiAtIEEgc2F0dXJhdGlvbiBzZWxlY3RvciBjb250YWluZXJcbiAqIEBjc3NwYXJ0IGFscGhhIC0gQW4gYWxwaGEgc2VsZWN0b3IgY29udGFpbmVyLlxuICogQGNzc3BhcnQgaHVlLXBvaW50ZXIgLSBBIGh1ZSBwb2ludGVyIGVsZW1lbnQuXG4gKiBAY3NzcGFydCBzYXR1cmF0aW9uLXBvaW50ZXIgLSBBIHNhdHVyYXRpb24gcG9pbnRlciBlbGVtZW50LlxuICogQGNzc3BhcnQgYWxwaGEtcG9pbnRlciAtIEFuIGFscGhhIHBvaW50ZXIgZWxlbWVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIFJnYmFTdHJpbmdDb2xvclBpY2tlciBleHRlbmRzIFJnYmFTdHJpbmdCYXNlIHt9XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgncmdiYS1zdHJpbmctY29sb3ItcGlja2VyJywgUmdiYVN0cmluZ0NvbG9yUGlja2VyKTtcblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgSFRNTEVsZW1lbnRUYWdOYW1lTWFwIHtcbiAgICAncmdiYS1zdHJpbmctY29sb3ItcGlja2VyJzogUmdiYVN0cmluZ0NvbG9yUGlja2VyO1xuICB9XG59XG4iLCAiaW1wb3J0ICd2YW5pbGxhLWNvbG9yZnVsL2hleC1jb2xvci1waWNrZXIuanMnXG5pbXBvcnQgJ3ZhbmlsbGEtY29sb3JmdWwvaHNsLXN0cmluZy1jb2xvci1waWNrZXIuanMnXG5pbXBvcnQgJ3ZhbmlsbGEtY29sb3JmdWwvcmdiLXN0cmluZy1jb2xvci1waWNrZXIuanMnXG5pbXBvcnQgJ3ZhbmlsbGEtY29sb3JmdWwvcmdiYS1zdHJpbmctY29sb3ItcGlja2VyLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb2xvclBpY2tlckZvcm1Db21wb25lbnQoe1xuICAgIGlzQXV0b2ZvY3VzZWQsXG4gICAgaXNEaXNhYmxlZCxcbiAgICBpc0xpdmUsXG4gICAgaXNMaXZlRGVib3VuY2VkLFxuICAgIGlzTGl2ZU9uQmx1cixcbiAgICBsaXZlRGVib3VuY2UsXG4gICAgc3RhdGUsXG59KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdGUsXG5cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIGlmICghKHRoaXMuc3RhdGUgPT09IG51bGwgfHwgdGhpcy5zdGF0ZSA9PT0gJycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNBdXRvZm9jdXNlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlUGFuZWxWaXNpYmlsaXR5KHRoaXMuJHJlZnMuaW5wdXQpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuJHJlZnMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZShldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0aGlzLiRyZWZzLnBhbmVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbG9yLWNoYW5nZWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKGV2ZW50LmRldGFpbC52YWx1ZSlcblxuICAgICAgICAgICAgICAgIGlmIChpc0xpdmVPbkJsdXIgfHwgIShpc0xpdmUgfHwgaXNMaXZlRGVib3VuY2VkKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gZXZlbnQuZGV0YWlsLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tbWl0U3RhdGUoKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBpc0xpdmVEZWJvdW5jZWQgPyBsaXZlRGVib3VuY2UgOiAyNTAsXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaWYgKGlzTGl2ZSB8fCBpc0xpdmVEZWJvdW5jZWQgfHwgaXNMaXZlT25CbHVyKSB7XG4gICAgICAgICAgICAgICAgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc09wZW4oKSA/IG51bGwgOiB0aGlzLmNvbW1pdFN0YXRlKCksXG4gICAgICAgICAgICAgICAgKS5vYnNlcnZlKHRoaXMuJHJlZnMucGFuZWwsIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9nZ2xlUGFuZWxWaXNpYmlsaXR5KCkge1xuICAgICAgICAgICAgaWYgKGlzRGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kcmVmcy5wYW5lbC50b2dnbGUodGhpcy4kcmVmcy5pbnB1dClcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRTdGF0ZSh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHZhbHVlXG5cbiAgICAgICAgICAgIHRoaXMuJHJlZnMuaW5wdXQudmFsdWUgPSB2YWx1ZVxuICAgICAgICAgICAgdGhpcy4kcmVmcy5wYW5lbC5jb2xvciA9IHZhbHVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNPcGVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJHJlZnMucGFuZWwuc3R5bGUuZGlzcGxheSA9PT0gJ2Jsb2NrJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvbW1pdFN0YXRlKCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMuJHdpcmUuX19pbnN0YW5jZS5jYW5vbmljYWwpID09PVxuICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMuJHdpcmUuX19pbnN0YW5jZS5lcGhlbWVyYWwpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kd2lyZS4kY29tbWl0KClcbiAgICAgICAgfSxcbiAgICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBR08sSUFBTSxRQUFRLENBQUMsUUFBZ0IsTUFBTSxHQUFHLE1BQU0sTUFBYTtBQUNoRSxTQUFPLFNBQVMsTUFBTSxNQUFNLFNBQVMsTUFBTSxNQUFNO0FBQ25EO0FBRU8sSUFBTSxRQUFRLENBQUMsUUFBZ0IsU0FBUyxHQUFHLE9BQU8sS0FBSyxJQUFJLElBQUksTUFBTSxNQUFhO0FBQ3ZGLFNBQU8sS0FBSyxNQUFNLE9BQU8sTUFBTSxJQUFJO0FBQ3JDOzs7QUNGQSxJQUFNLGFBQXFDO0VBQ3pDLE1BQU0sTUFBTTtFQUNaLE1BQU07RUFDTixLQUFLLE9BQU8sS0FBSyxLQUFLOztBQUdqQixJQUFNLFlBQVksQ0FBQyxRQUEyQixXQUFXLFVBQVUsR0FBRyxDQUFDO0FBRXZFLElBQU0sWUFBWSxDQUFDLFFBQTBCO0FBQ2xELE1BQUksSUFBSSxDQUFDLE1BQU07QUFBSyxVQUFNLElBQUksVUFBVSxDQUFDO0FBRXpDLE1BQUksSUFBSSxTQUFTLEdBQUc7QUFDbEIsV0FBTztNQUNMLEdB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

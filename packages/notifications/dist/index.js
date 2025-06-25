(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/uuid-browser/lib/rng-browser.js
  var require_rng_browser = __commonJS({
    "node_modules/uuid-browser/lib/rng-browser.js"(exports, module) {
      var rng;
      var crypto = typeof global !== "undefined" && (global.crypto || global.msCrypto);
      if (crypto && crypto.getRandomValues) {
        rnds8 = new Uint8Array(16);
        rng = function whatwgRNG() {
          crypto.getRandomValues(rnds8);
          return rnds8;
        };
      }
      var rnds8;
      if (!rng) {
        rnds = new Array(16);
        rng = function() {
          for (var i = 0, r; i < 16; i++) {
            if ((i & 3) === 0) r = Math.random() * 4294967296;
            rnds[i] = r >>> ((i & 3) << 3) & 255;
          }
          return rnds;
        };
      }
      var rnds;
      module.exports = rng;
    }
  });

  // node_modules/uuid-browser/lib/bytesToUuid.js
  var require_bytesToUuid = __commonJS({
    "node_modules/uuid-browser/lib/bytesToUuid.js"(exports, module) {
      var byteToHex = [];
      for (i = 0; i < 256; ++i) {
        byteToHex[i] = (i + 256).toString(16).substr(1);
      }
      var i;
      function bytesToUuid(buf, offset) {
        var i2 = offset || 0;
        var bth = byteToHex;
        return bth[buf[i2++]] + bth[buf[i2++]] + bth[buf[i2++]] + bth[buf[i2++]] + "-" + bth[buf[i2++]] + bth[buf[i2++]] + "-" + bth[buf[i2++]] + bth[buf[i2++]] + "-" + bth[buf[i2++]] + bth[buf[i2++]] + "-" + bth[buf[i2++]] + bth[buf[i2++]] + bth[buf[i2++]] + bth[buf[i2++]] + bth[buf[i2++]] + bth[buf[i2++]];
      }
      module.exports = bytesToUuid;
    }
  });

  // node_modules/uuid-browser/v1.js
  var require_v1 = __commonJS({
    "node_modules/uuid-browser/v1.js"(exports, module) {
      var rng = require_rng_browser();
      var bytesToUuid = require_bytesToUuid();
      var _seedBytes = rng();
      var _nodeId = [
        _seedBytes[0] | 1,
        _seedBytes[1],
        _seedBytes[2],
        _seedBytes[3],
        _seedBytes[4],
        _seedBytes[5]
      ];
      var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 16383;
      var _lastMSecs = 0;
      var _lastNSecs = 0;
      function v1(options, buf, offset) {
        var i = buf && offset || 0;
        var b = buf || [];
        options = options || {};
        var clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
        var msecs = options.msecs !== void 0 ? options.msecs : (/* @__PURE__ */ new Date()).getTime();
        var nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
        var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
        if (dt < 0 && options.clockseq === void 0) {
          clockseq = clockseq + 1 & 16383;
        }
        if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
          nsecs = 0;
        }
        if (nsecs >= 1e4) {
          throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
        }
        _lastMSecs = msecs;
        _lastNSecs = nsecs;
        _clockseq = clockseq;
        msecs += 122192928e5;
        var tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
        b[i++] = tl >>> 24 & 255;
        b[i++] = tl >>> 16 & 255;
        b[i++] = tl >>> 8 & 255;
        b[i++] = tl & 255;
        var tmh = msecs / 4294967296 * 1e4 & 268435455;
        b[i++] = tmh >>> 8 & 255;
        b[i++] = tmh & 255;
        b[i++] = tmh >>> 24 & 15 | 16;
        b[i++] = tmh >>> 16 & 255;
        b[i++] = clockseq >>> 8 | 128;
        b[i++] = clockseq & 255;
        var node = options.node || _nodeId;
        for (var n = 0; n < 6; ++n) {
          b[i + n] = node[n];
        }
        return buf ? buf : bytesToUuid(b);
      }
      module.exports = v1;
    }
  });

  // node_modules/uuid-browser/v4.js
  var require_v4 = __commonJS({
    "node_modules/uuid-browser/v4.js"(exports, module) {
      var rng = require_rng_browser();
      var bytesToUuid = require_bytesToUuid();
      function v4(options, buf, offset) {
        var i = buf && offset || 0;
        if (typeof options == "string") {
          buf = options == "binary" ? new Array(16) : null;
          options = null;
        }
        options = options || {};
        var rnds = options.random || (options.rng || rng)();
        rnds[6] = rnds[6] & 15 | 64;
        rnds[8] = rnds[8] & 63 | 128;
        if (buf) {
          for (var ii = 0; ii < 16; ++ii) {
            buf[i + ii] = rnds[ii];
          }
        }
        return buf || bytesToUuid(rnds);
      }
      module.exports = v4;
    }
  });

  // node_modules/uuid-browser/index.js
  var require_uuid_browser = __commonJS({
    "node_modules/uuid-browser/index.js"(exports, module) {
      var v1 = require_v1();
      var v4 = require_v4();
      var uuid2 = v4;
      uuid2.v1 = v1;
      uuid2.v4 = v4;
      module.exports = uuid2;
    }
  });

  // node_modules/alpinejs/src/utils/once.js
  function once(callback, fallback = () => {
  }) {
    let called = false;
    return function() {
      if (!called) {
        called = true;
        callback.apply(this, arguments);
      } else {
        fallback.apply(this, arguments);
      }
    };
  }

  // packages/notifications/resources/js/components/notification.js
  var notification_default = (Alpine) => {
    Alpine.data("notificationComponent", ({ notification }) => ({
      isShown: false,
      computedStyle: null,
      transitionDuration: null,
      transitionEasing: null,
      init() {
        this.computedStyle = window.getComputedStyle(this.$el);
        this.transitionDuration = parseFloat(this.computedStyle.transitionDuration) * 1e3;
        this.transitionEasing = this.computedStyle.transitionTimingFunction;
        this.configureTransitions();
        this.configureAnimations();
        if (notification.duration && notification.duration !== "persistent") {
          setTimeout(() => {
            if (!this.$el.matches(":hover")) {
              this.close();
              return;
            }
            this.$el.addEventListener("mouseleave", () => this.close());
          }, notification.duration);
        }
        this.isShown = true;
      },
      configureTransitions() {
        const display = this.computedStyle.display;
        const show = () => {
          Alpine.mutateDom(() => {
            this.$el.style.setProperty("display", display);
            this.$el.style.setProperty("visibility", "visible");
          });
          this.$el._x_isShown = true;
        };
        const hide = () => {
          Alpine.mutateDom(() => {
            this.$el._x_isShown ? this.$el.style.setProperty("visibility", "hidden") : this.$el.style.setProperty("display", "none");
          });
        };
        const toggle = once(
          (value) => value ? show() : hide(),
          (value) => {
            this.$el._x_toggleAndCascadeWithTransitions(
              this.$el,
              value,
              show,
              hide
            );
          }
        );
        Alpine.effect(() => toggle(this.isShown));
      },
      configureAnimations() {
        let animation;
        Livewire.hook(
          "commit",
          ({ component, commit, succeed, fail, respond }) => {
            if (!component.snapshot.data.isFilamentNotificationsComponent) {
              return;
            }
            requestAnimationFrame(() => {
              const getTop = () => this.$el.getBoundingClientRect().top;
              const oldTop = getTop();
              respond(() => {
                animation = () => {
                  if (!this.isShown) {
                    return;
                  }
                  this.$el.animate(
                    [
                      {
                        transform: `translateY(${oldTop - getTop()}px)`
                      },
                      { transform: "translateY(0px)" }
                    ],
                    {
                      duration: this.transitionDuration,
                      easing: this.transitionEasing
                    }
                  );
                };
                this.$el.getAnimations().forEach((animation2) => animation2.finish());
              });
              succeed(({ snapshot, effect }) => {
                animation();
              });
            });
          }
        );
      },
      close() {
        this.isShown = false;
        setTimeout(
          () => window.dispatchEvent(
            new CustomEvent("notificationClosed", {
              detail: {
                id: notification.id
              }
            })
          ),
          this.transitionDuration
        );
      },
      markAsRead() {
        window.dispatchEvent(
          new CustomEvent("markedNotificationAsRead", {
            detail: {
              id: notification.id
            }
          })
        );
      },
      markAsUnread() {
        window.dispatchEvent(
          new CustomEvent("markedNotificationAsUnread", {
            detail: {
              id: notification.id
            }
          })
        );
      }
    }));
  };

  // packages/notifications/resources/js/Notification.js
  var import_uuid_browser = __toESM(require_uuid_browser(), 1);
  var Notification = class {
    constructor() {
      this.id((0, import_uuid_browser.v4)());
      return this;
    }
    id(id) {
      this.id = id;
      return this;
    }
    title(title) {
      this.title = title;
      return this;
    }
    body(body) {
      this.body = body;
      return this;
    }
    actions(actions) {
      this.actions = actions;
      return this;
    }
    status(status) {
      this.status = status;
      return this;
    }
    color(color) {
      this.color = color;
      return this;
    }
    icon(icon) {
      this.icon = icon;
      return this;
    }
    iconColor(color) {
      this.iconColor = color;
      return this;
    }
    duration(duration) {
      this.duration = duration;
      return this;
    }
    seconds(seconds) {
      this.duration(seconds * 1e3);
      return this;
    }
    persistent() {
      this.duration("persistent");
      return this;
    }
    danger() {
      this.status("danger");
      return this;
    }
    info() {
      this.status("info");
      return this;
    }
    success() {
      this.status("success");
      return this;
    }
    warning() {
      this.status("warning");
      return this;
    }
    view(view) {
      this.view = view;
      return this;
    }
    viewData(viewData) {
      this.viewData = viewData;
      return this;
    }
    send() {
      window.dispatchEvent(
        new CustomEvent("notificationSent", {
          detail: {
            notification: this
          }
        })
      );
      return this;
    }
  };
  var Action = class {
    constructor(name) {
      this.name(name);
      return this;
    }
    name(name) {
      this.name = name;
      return this;
    }
    color(color) {
      this.color = color;
      return this;
    }
    dispatch(event, data) {
      this.event(event);
      this.eventData(data);
      return this;
    }
    dispatchSelf(event, data) {
      this.dispatch(event, data);
      this.dispatchDirection = "self";
      return this;
    }
    dispatchTo(component, event, data) {
      this.dispatch(event, data);
      this.dispatchDirection = "to";
      this.dispatchToComponent = component;
      return this;
    }
    /**
     * @deprecated Use `dispatch()` instead.
     */
    emit(event, data) {
      this.dispatch(event, data);
      return this;
    }
    /**
     * @deprecated Use `dispatchSelf()` instead.
     */
    emitSelf(event, data) {
      this.dispatchSelf(event, data);
      return this;
    }
    /**
     * @deprecated Use `dispatchTo()` instead.
     */
    emitTo(component, event, data) {
      this.dispatchTo(component, event, data);
      return this;
    }
    dispatchDirection(dispatchDirection) {
      this.dispatchDirection = dispatchDirection;
      return this;
    }
    dispatchToComponent(component) {
      this.dispatchToComponent = component;
      return this;
    }
    event(event) {
      this.event = event;
      return this;
    }
    eventData(data) {
      this.eventData = data;
      return this;
    }
    extraAttributes(attributes) {
      this.extraAttributes = attributes;
      return this;
    }
    icon(icon) {
      this.icon = icon;
      return this;
    }
    iconPosition(position) {
      this.iconPosition = position;
      return this;
    }
    outlined(condition = true) {
      this.isOutlined = condition;
      return this;
    }
    disabled(condition = true) {
      this.isDisabled = condition;
      return this;
    }
    label(label) {
      this.label = label;
      return this;
    }
    close(condition = true) {
      this.shouldClose = condition;
      return this;
    }
    openUrlInNewTab(condition = true) {
      this.shouldOpenUrlInNewTab = condition;
      return this;
    }
    size(size) {
      this.size = size;
      return this;
    }
    url(url) {
      this.url = url;
      return this;
    }
    view(view) {
      this.view = view;
      return this;
    }
    button() {
      this.view("filament-actions::button-action");
      return this;
    }
    grouped() {
      this.view("filament-actions::grouped-action");
      return this;
    }
    link() {
      this.view("filament-actions::link-action");
      return this;
    }
  };
  var ActionGroup = class {
    constructor(actions) {
      this.actions(actions);
      return this;
    }
    actions(actions) {
      this.actions = actions.map((action) => action.grouped());
      return this;
    }
    color(color) {
      this.color = color;
      return this;
    }
    icon(icon) {
      this.icon = icon;
      return this;
    }
    iconPosition(position) {
      this.iconPosition = position;
      return this;
    }
    label(label) {
      this.label = label;
      return this;
    }
    tooltip(tooltip) {
      this.tooltip = tooltip;
      return this;
    }
  };

  // packages/notifications/resources/js/index.js
  window.FilamentNotificationAction = Action;
  window.FilamentNotificationActionGroup = ActionGroup;
  window.FilamentNotification = Notification;
  document.addEventListener("alpine:init", () => {
    window.Alpine.plugin(notification_default);
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3V1aWQtYnJvd3Nlci9saWIvcm5nLWJyb3dzZXIuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3V1aWQtYnJvd3Nlci9saWIvYnl0ZXNUb1V1aWQuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3V1aWQtYnJvd3Nlci92MS5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvdXVpZC1icm93c2VyL3Y0LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy91dWlkLWJyb3dzZXIvaW5kZXguanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2FscGluZWpzL3NyYy91dGlscy9vbmNlLmpzIiwgIi4uL3Jlc291cmNlcy9qcy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi5qcyIsICIuLi9yZXNvdXJjZXMvanMvTm90aWZpY2F0aW9uLmpzIiwgIi4uL3Jlc291cmNlcy9qcy9pbmRleC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gIEluIHRoZVxuLy8gYnJvd3NlciB0aGlzIGlzIGEgbGl0dGxlIGNvbXBsaWNhdGVkIGR1ZSB0byB1bmtub3duIHF1YWxpdHkgb2YgTWF0aC5yYW5kb20oKVxuLy8gYW5kIGluY29uc2lzdGVudCBzdXBwb3J0IGZvciB0aGUgYGNyeXB0b2AgQVBJLiAgV2UgZG8gdGhlIGJlc3Qgd2UgY2FuIHZpYVxuLy8gZmVhdHVyZS1kZXRlY3Rpb25cbnZhciBybmc7XG5cbnZhciBjcnlwdG8gPSB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyAmJiAoZ2xvYmFsLmNyeXB0byB8fCBnbG9iYWwubXNDcnlwdG8pOyAvLyBmb3IgSUUgMTFcbmlmIChjcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAvLyBXSEFUV0cgY3J5cHRvIFJORyAtIGh0dHA6Ly93aWtpLndoYXR3Zy5vcmcvd2lraS9DcnlwdG9cbiAgdmFyIHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4gIHJuZyA9IGZ1bmN0aW9uIHdoYXR3Z1JORygpIHtcbiAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbiAgICByZXR1cm4gcm5kczg7XG4gIH07XG59XG5cbmlmICghcm5nKSB7XG4gIC8vIE1hdGgucmFuZG9tKCktYmFzZWQgKFJORylcbiAgLy9cbiAgLy8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcbiAgLy8gcXVhbGl0eS5cbiAgdmFyIHJuZHMgPSBuZXcgQXJyYXkoMTYpO1xuICBybmcgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgcjsgaSA8IDE2OyBpKyspIHtcbiAgICAgIGlmICgoaSAmIDB4MDMpID09PSAwKSByID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwO1xuICAgICAgcm5kc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICB9XG5cbiAgICByZXR1cm4gcm5kcztcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBybmc7XG4iLCAiLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG52YXIgYnl0ZVRvSGV4ID0gW107XG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG59XG5cbmZ1bmN0aW9uIGJ5dGVzVG9VdWlkKGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gb2Zmc2V0IHx8IDA7XG4gIHZhciBidGggPSBieXRlVG9IZXg7XG4gIHJldHVybiBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnl0ZXNUb1V1aWQ7XG4iLCAidmFyIHJuZyA9IHJlcXVpcmUoJy4vbGliL3JuZy1icm93c2VyJyk7XG52YXIgYnl0ZXNUb1V1aWQgPSByZXF1aXJlKCcuL2xpYi9ieXRlc1RvVXVpZCcpO1xuXG4vLyAqKmB2MSgpYCAtIEdlbmVyYXRlIHRpbWUtYmFzZWQgVVVJRCoqXG4vL1xuLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL0xpb3NLL1VVSUQuanNcbi8vIGFuZCBodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvdXVpZC5odG1sXG5cbi8vIHJhbmRvbSAjJ3Mgd2UgbmVlZCB0byBpbml0IG5vZGUgYW5kIGNsb2Nrc2VxXG52YXIgX3NlZWRCeXRlcyA9IHJuZygpO1xuXG4vLyBQZXIgNC41LCBjcmVhdGUgYW5kIDQ4LWJpdCBub2RlIGlkLCAoNDcgcmFuZG9tIGJpdHMgKyBtdWx0aWNhc3QgYml0ID0gMSlcbnZhciBfbm9kZUlkID0gW1xuICBfc2VlZEJ5dGVzWzBdIHwgMHgwMSxcbiAgX3NlZWRCeXRlc1sxXSwgX3NlZWRCeXRlc1syXSwgX3NlZWRCeXRlc1szXSwgX3NlZWRCeXRlc1s0XSwgX3NlZWRCeXRlc1s1XVxuXTtcblxuLy8gUGVyIDQuMi4yLCByYW5kb21pemUgKDE0IGJpdCkgY2xvY2tzZXFcbnZhciBfY2xvY2tzZXEgPSAoX3NlZWRCeXRlc1s2XSA8PCA4IHwgX3NlZWRCeXRlc1s3XSkgJiAweDNmZmY7XG5cbi8vIFByZXZpb3VzIHV1aWQgY3JlYXRpb24gdGltZVxudmFyIF9sYXN0TVNlY3MgPSAwLCBfbGFzdE5TZWNzID0gMDtcblxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9icm9vZmEvbm9kZS11dWlkIGZvciBBUEkgZGV0YWlsc1xuZnVuY3Rpb24gdjEob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG4gIHZhciBiID0gYnVmIHx8IFtdO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciBjbG9ja3NlcSA9IG9wdGlvbnMuY2xvY2tzZXEgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuY2xvY2tzZXEgOiBfY2xvY2tzZXE7XG5cbiAgLy8gVVVJRCB0aW1lc3RhbXBzIGFyZSAxMDAgbmFuby1zZWNvbmQgdW5pdHMgc2luY2UgdGhlIEdyZWdvcmlhbiBlcG9jaCxcbiAgLy8gKDE1ODItMTAtMTUgMDA6MDApLiAgSlNOdW1iZXJzIGFyZW4ndCBwcmVjaXNlIGVub3VnaCBmb3IgdGhpcywgc29cbiAgLy8gdGltZSBpcyBoYW5kbGVkIGludGVybmFsbHkgYXMgJ21zZWNzJyAoaW50ZWdlciBtaWxsaXNlY29uZHMpIGFuZCAnbnNlY3MnXG4gIC8vICgxMDAtbmFub3NlY29uZHMgb2Zmc2V0IGZyb20gbXNlY3MpIHNpbmNlIHVuaXggZXBvY2gsIDE5NzAtMDEtMDEgMDA6MDAuXG4gIHZhciBtc2VjcyA9IG9wdGlvbnMubXNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubXNlY3MgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAvLyBQZXIgNC4yLjEuMiwgdXNlIGNvdW50IG9mIHV1aWQncyBnZW5lcmF0ZWQgZHVyaW5nIHRoZSBjdXJyZW50IGNsb2NrXG4gIC8vIGN5Y2xlIHRvIHNpbXVsYXRlIGhpZ2hlciByZXNvbHV0aW9uIGNsb2NrXG4gIHZhciBuc2VjcyA9IG9wdGlvbnMubnNlY3MgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubnNlY3MgOiBfbGFzdE5TZWNzICsgMTtcblxuICAvLyBUaW1lIHNpbmNlIGxhc3QgdXVpZCBjcmVhdGlvbiAoaW4gbXNlY3MpXG4gIHZhciBkdCA9IChtc2VjcyAtIF9sYXN0TVNlY3MpICsgKG5zZWNzIC0gX2xhc3ROU2VjcykvMTAwMDA7XG5cbiAgLy8gUGVyIDQuMi4xLjIsIEJ1bXAgY2xvY2tzZXEgb24gY2xvY2sgcmVncmVzc2lvblxuICBpZiAoZHQgPCAwICYmIG9wdGlvbnMuY2xvY2tzZXEgPT09IHVuZGVmaW5lZCkge1xuICAgIGNsb2Nrc2VxID0gY2xvY2tzZXEgKyAxICYgMHgzZmZmO1xuICB9XG5cbiAgLy8gUmVzZXQgbnNlY3MgaWYgY2xvY2sgcmVncmVzc2VzIChuZXcgY2xvY2tzZXEpIG9yIHdlJ3ZlIG1vdmVkIG9udG8gYSBuZXdcbiAgLy8gdGltZSBpbnRlcnZhbFxuICBpZiAoKGR0IDwgMCB8fCBtc2VjcyA+IF9sYXN0TVNlY3MpICYmIG9wdGlvbnMubnNlY3MgPT09IHVuZGVmaW5lZCkge1xuICAgIG5zZWNzID0gMDtcbiAgfVxuXG4gIC8vIFBlciA0LjIuMS4yIFRocm93IGVycm9yIGlmIHRvbyBtYW55IHV1aWRzIGFyZSByZXF1ZXN0ZWRcbiAgaWYgKG5zZWNzID49IDEwMDAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1dWlkLnYxKCk6IENhblxcJ3QgY3JlYXRlIG1vcmUgdGhhbiAxME0gdXVpZHMvc2VjJyk7XG4gIH1cblxuICBfbGFzdE1TZWNzID0gbXNlY3M7XG4gIF9sYXN0TlNlY3MgPSBuc2VjcztcbiAgX2Nsb2Nrc2VxID0gY2xvY2tzZXE7XG5cbiAgLy8gUGVyIDQuMS40IC0gQ29udmVydCBmcm9tIHVuaXggZXBvY2ggdG8gR3JlZ29yaWFuIGVwb2NoXG4gIG1zZWNzICs9IDEyMjE5MjkyODAwMDAwO1xuXG4gIC8vIGB0aW1lX2xvd2BcbiAgdmFyIHRsID0gKChtc2VjcyAmIDB4ZmZmZmZmZikgKiAxMDAwMCArIG5zZWNzKSAlIDB4MTAwMDAwMDAwO1xuICBiW2krK10gPSB0bCA+Pj4gMjQgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gMTYgJiAweGZmO1xuICBiW2krK10gPSB0bCA+Pj4gOCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsICYgMHhmZjtcblxuICAvLyBgdGltZV9taWRgXG4gIHZhciB0bWggPSAobXNlY3MgLyAweDEwMDAwMDAwMCAqIDEwMDAwKSAmIDB4ZmZmZmZmZjtcbiAgYltpKytdID0gdG1oID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdG1oICYgMHhmZjtcblxuICAvLyBgdGltZV9oaWdoX2FuZF92ZXJzaW9uYFxuICBiW2krK10gPSB0bWggPj4+IDI0ICYgMHhmIHwgMHgxMDsgLy8gaW5jbHVkZSB2ZXJzaW9uXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMTYgJiAweGZmO1xuXG4gIC8vIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYCAoUGVyIDQuMi4yIC0gaW5jbHVkZSB2YXJpYW50KVxuICBiW2krK10gPSBjbG9ja3NlcSA+Pj4gOCB8IDB4ODA7XG5cbiAgLy8gYGNsb2NrX3NlcV9sb3dgXG4gIGJbaSsrXSA9IGNsb2Nrc2VxICYgMHhmZjtcblxuICAvLyBgbm9kZWBcbiAgdmFyIG5vZGUgPSBvcHRpb25zLm5vZGUgfHwgX25vZGVJZDtcbiAgZm9yICh2YXIgbiA9IDA7IG4gPCA2OyArK24pIHtcbiAgICBiW2kgKyBuXSA9IG5vZGVbbl07XG4gIH1cblxuICByZXR1cm4gYnVmID8gYnVmIDogYnl0ZXNUb1V1aWQoYik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdjE7XG4iLCAidmFyIHJuZyA9IHJlcXVpcmUoJy4vbGliL3JuZy1icm93c2VyJyk7XG52YXIgYnl0ZXNUb1V1aWQgPSByZXF1aXJlKCcuL2xpYi9ieXRlc1RvVXVpZCcpO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcblxuICBpZiAodHlwZW9mKG9wdGlvbnMpID09ICdzdHJpbmcnKSB7XG4gICAgYnVmID0gb3B0aW9ucyA9PSAnYmluYXJ5JyA/IG5ldyBBcnJheSgxNikgOiBudWxsO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTtcblxuICAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG4gIHJuZHNbNl0gPSAocm5kc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gIC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuICBpZiAoYnVmKSB7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyArK2lpKSB7XG4gICAgICBidWZbaSArIGlpXSA9IHJuZHNbaWldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYgfHwgYnl0ZXNUb1V1aWQocm5kcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdjQ7XG4iLCAidmFyIHYxID0gcmVxdWlyZSgnLi92MScpO1xudmFyIHY0ID0gcmVxdWlyZSgnLi92NCcpO1xuXG52YXIgdXVpZCA9IHY0O1xudXVpZC52MSA9IHYxO1xudXVpZC52NCA9IHY0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV1aWQ7XG4iLCAiXG5leHBvcnQgZnVuY3Rpb24gb25jZShjYWxsYmFjaywgZmFsbGJhY2sgPSAoKSA9PiB7fSkge1xuICAgIGxldCBjYWxsZWQgPSBmYWxzZVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCEgY2FsbGVkKSB7XG4gICAgICAgICAgICBjYWxsZWQgPSB0cnVlXG5cbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsICJpbXBvcnQgeyBvbmNlIH0gZnJvbSAnYWxwaW5lanMvc3JjL3V0aWxzL29uY2UnXG5cbmV4cG9ydCBkZWZhdWx0IChBbHBpbmUpID0+IHtcbiAgICBBbHBpbmUuZGF0YSgnbm90aWZpY2F0aW9uQ29tcG9uZW50JywgKHsgbm90aWZpY2F0aW9uIH0pID0+ICh7XG4gICAgICAgIGlzU2hvd246IGZhbHNlLFxuXG4gICAgICAgIGNvbXB1dGVkU3R5bGU6IG51bGwsXG5cbiAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiBudWxsLFxuXG4gICAgICAgIHRyYW5zaXRpb25FYXNpbmc6IG51bGwsXG5cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuJGVsKVxuXG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbiA9XG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCh0aGlzLmNvbXB1dGVkU3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uKSAqIDEwMDBcblxuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uRWFzaW5nID0gdGhpcy5jb21wdXRlZFN0eWxlLnRyYW5zaXRpb25UaW1pbmdGdW5jdGlvblxuXG4gICAgICAgICAgICB0aGlzLmNvbmZpZ3VyZVRyYW5zaXRpb25zKClcbiAgICAgICAgICAgIHRoaXMuY29uZmlndXJlQW5pbWF0aW9ucygpXG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBub3RpZmljYXRpb24uZHVyYXRpb24gJiZcbiAgICAgICAgICAgICAgICBub3RpZmljYXRpb24uZHVyYXRpb24gIT09ICdwZXJzaXN0ZW50J1xuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy4kZWwubWF0Y2hlcygnOmhvdmVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB0aGlzLmNsb3NlKCkpXG4gICAgICAgICAgICAgICAgfSwgbm90aWZpY2F0aW9uLmR1cmF0aW9uKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmlzU2hvd24gPSB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgY29uZmlndXJlVHJhbnNpdGlvbnMoKSB7XG4gICAgICAgICAgICBjb25zdCBkaXNwbGF5ID0gdGhpcy5jb21wdXRlZFN0eWxlLmRpc3BsYXlcblxuICAgICAgICAgICAgY29uc3Qgc2hvdyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBBbHBpbmUubXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZWwuc3R5bGUuc2V0UHJvcGVydHkoJ2Rpc3BsYXknLCBkaXNwbGF5KVxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbC5zdHlsZS5zZXRQcm9wZXJ0eSgndmlzaWJpbGl0eScsICd2aXNpYmxlJylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHRoaXMuJGVsLl94X2lzU2hvd24gPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGhpZGUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgQWxwaW5lLm11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVsLl94X2lzU2hvd25cbiAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy4kZWwuc3R5bGUuc2V0UHJvcGVydHkoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJylcbiAgICAgICAgICAgICAgICAgICAgICAgIDogdGhpcy4kZWwuc3R5bGUuc2V0UHJvcGVydHkoJ2Rpc3BsYXknLCAnbm9uZScpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdG9nZ2xlID0gb25jZShcbiAgICAgICAgICAgICAgICAodmFsdWUpID0+ICh2YWx1ZSA/IHNob3coKSA6IGhpZGUoKSksXG4gICAgICAgICAgICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVsLl94X3RvZ2dsZUFuZENhc2NhZGVXaXRoVHJhbnNpdGlvbnMoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZGUsXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICBBbHBpbmUuZWZmZWN0KCgpID0+IHRvZ2dsZSh0aGlzLmlzU2hvd24pKVxuICAgICAgICB9LFxuXG4gICAgICAgIGNvbmZpZ3VyZUFuaW1hdGlvbnMoKSB7XG4gICAgICAgICAgICBsZXQgYW5pbWF0aW9uXG5cbiAgICAgICAgICAgIExpdmV3aXJlLmhvb2soXG4gICAgICAgICAgICAgICAgJ2NvbW1pdCcsXG4gICAgICAgICAgICAgICAgKHsgY29tcG9uZW50LCBjb21taXQsIHN1Y2NlZWQsIGZhaWwsIHJlc3BvbmQgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAhY29tcG9uZW50LnNuYXBzaG90LmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaXNGaWxhbWVudE5vdGlmaWNhdGlvbnNDb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIENhbGxpbmcgYGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpYCBmcm9tIG91dHNpZGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZSgpYCBjYW5cbiAgICAgICAgICAgICAgICAgICAgLy8gb2NjYXNpb25hbGx5IGNhdXNlIHRoZSBwYWdlIHRvIHNjcm9sbCB0byB0aGUgdG9wLlxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2V0VG9wID0gKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZFRvcCA9IGdldFRvcCgpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbmQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbiA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2hvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kZWwuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZVkoJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZFRvcCAtIGdldFRvcCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1weClgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDBweCknIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLnRyYW5zaXRpb25EdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6IHRoaXMudHJhbnNpdGlvbkVhc2luZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0QW5pbWF0aW9ucygpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKChhbmltYXRpb24pID0+IGFuaW1hdGlvbi5maW5pc2goKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2NlZWQoKHsgc25hcHNob3QsIGVmZmVjdCB9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIClcbiAgICAgICAgfSxcblxuICAgICAgICBjbG9zZSgpIHtcbiAgICAgICAgICAgIHRoaXMuaXNTaG93biA9IGZhbHNlXG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgICAgICAgICAgKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ25vdGlmaWNhdGlvbkNsb3NlZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IG5vdGlmaWNhdGlvbi5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uRHVyYXRpb24sXG4gICAgICAgICAgICApXG4gICAgICAgIH0sXG5cbiAgICAgICAgbWFya0FzUmVhZCgpIHtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgICAgICAgIG5ldyBDdXN0b21FdmVudCgnbWFya2VkTm90aWZpY2F0aW9uQXNSZWFkJywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBub3RpZmljYXRpb24uaWQsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApXG4gICAgICAgIH0sXG5cbiAgICAgICAgbWFya0FzVW5yZWFkKCkge1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgICAgICAgbmV3IEN1c3RvbUV2ZW50KCdtYXJrZWROb3RpZmljYXRpb25Bc1VucmVhZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogbm90aWZpY2F0aW9uLmlkLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgKVxuICAgICAgICB9LFxuICAgIH0pKVxufVxuIiwgImltcG9ydCB7IHY0IGFzIHV1aWQgfSBmcm9tICd1dWlkLWJyb3dzZXInXG5cbmNsYXNzIE5vdGlmaWNhdGlvbiB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaWQodXVpZCgpKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgaWQoaWQpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICB0aXRsZSh0aXRsZSkge1xuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGVcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGJvZHkoYm9keSkge1xuICAgICAgICB0aGlzLmJvZHkgPSBib2R5XG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBhY3Rpb25zKGFjdGlvbnMpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25zID0gYWN0aW9uc1xuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgc3RhdHVzKHN0YXR1cykge1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1c1xuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgY29sb3IoY29sb3IpIHtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBpY29uKGljb24pIHtcbiAgICAgICAgdGhpcy5pY29uID0gaWNvblxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgaWNvbkNvbG9yKGNvbG9yKSB7XG4gICAgICAgIHRoaXMuaWNvbkNvbG9yID0gY29sb3JcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGR1cmF0aW9uKGR1cmF0aW9uKSB7XG4gICAgICAgIHRoaXMuZHVyYXRpb24gPSBkdXJhdGlvblxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgc2Vjb25kcyhzZWNvbmRzKSB7XG4gICAgICAgIHRoaXMuZHVyYXRpb24oc2Vjb25kcyAqIDEwMDApXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBwZXJzaXN0ZW50KCkge1xuICAgICAgICB0aGlzLmR1cmF0aW9uKCdwZXJzaXN0ZW50JylcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGRhbmdlcigpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMoJ2RhbmdlcicpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBpbmZvKCkge1xuICAgICAgICB0aGlzLnN0YXR1cygnaW5mbycpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBzdWNjZXNzKCkge1xuICAgICAgICB0aGlzLnN0YXR1cygnc3VjY2VzcycpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICB3YXJuaW5nKCkge1xuICAgICAgICB0aGlzLnN0YXR1cygnd2FybmluZycpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICB2aWV3KHZpZXcpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gdmlld1xuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgdmlld0RhdGEodmlld0RhdGEpIHtcbiAgICAgICAgdGhpcy52aWV3RGF0YSA9IHZpZXdEYXRhXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBzZW5kKCkge1xuICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICAgIG5ldyBDdXN0b21FdmVudCgnbm90aWZpY2F0aW9uU2VudCcsIHtcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uOiB0aGlzLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxufVxuXG5jbGFzcyBBY3Rpb24ge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lKG5hbWUpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBuYW1lKG5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgY29sb3IoY29sb3IpIHtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBkaXNwYXRjaChldmVudCwgZGF0YSkge1xuICAgICAgICB0aGlzLmV2ZW50KGV2ZW50KVxuICAgICAgICB0aGlzLmV2ZW50RGF0YShkYXRhKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgZGlzcGF0Y2hTZWxmKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2goZXZlbnQsIGRhdGEpXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hEaXJlY3Rpb24gPSAnc2VsZidcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGRpc3BhdGNoVG8oY29tcG9uZW50LCBldmVudCwgZGF0YSkge1xuICAgICAgICB0aGlzLmRpc3BhdGNoKGV2ZW50LCBkYXRhKVxuICAgICAgICB0aGlzLmRpc3BhdGNoRGlyZWN0aW9uID0gJ3RvJ1xuICAgICAgICB0aGlzLmRpc3BhdGNoVG9Db21wb25lbnQgPSBjb21wb25lbnRcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIFVzZSBgZGlzcGF0Y2goKWAgaW5zdGVhZC5cbiAgICAgKi9cbiAgICBlbWl0KGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2goZXZlbnQsIGRhdGEpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBVc2UgYGRpc3BhdGNoU2VsZigpYCBpbnN0ZWFkLlxuICAgICAqL1xuICAgIGVtaXRTZWxmKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hTZWxmKGV2ZW50LCBkYXRhKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgVXNlIGBkaXNwYXRjaFRvKClgIGluc3RlYWQuXG4gICAgICovXG4gICAgZW1pdFRvKGNvbXBvbmVudCwgZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaFRvKGNvbXBvbmVudCwgZXZlbnQsIGRhdGEpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBkaXNwYXRjaERpcmVjdGlvbihkaXNwYXRjaERpcmVjdGlvbikge1xuICAgICAgICB0aGlzLmRpc3BhdGNoRGlyZWN0aW9uID0gZGlzcGF0Y2hEaXJlY3Rpb25cblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGRpc3BhdGNoVG9Db21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hUb0NvbXBvbmVudCA9IGNvbXBvbmVudFxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgZXZlbnQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5ldmVudCA9IGV2ZW50XG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBldmVudERhdGEoZGF0YSkge1xuICAgICAgICB0aGlzLmV2ZW50RGF0YSA9IGRhdGFcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGV4dHJhQXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHRoaXMuZXh0cmFBdHRyaWJ1dGVzID0gYXR0cmlidXRlc1xuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgaWNvbihpY29uKSB7XG4gICAgICAgIHRoaXMuaWNvbiA9IGljb25cblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGljb25Qb3NpdGlvbihwb3NpdGlvbikge1xuICAgICAgICB0aGlzLmljb25Qb3NpdGlvbiA9IHBvc2l0aW9uXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBvdXRsaW5lZChjb25kaXRpb24gPSB0cnVlKSB7XG4gICAgICAgIHRoaXMuaXNPdXRsaW5lZCA9IGNvbmRpdGlvblxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgZGlzYWJsZWQoY29uZGl0aW9uID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLmlzRGlzYWJsZWQgPSBjb25kaXRpb25cblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGxhYmVsKGxhYmVsKSB7XG4gICAgICAgIHRoaXMubGFiZWwgPSBsYWJlbFxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgY2xvc2UoY29uZGl0aW9uID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNob3VsZENsb3NlID0gY29uZGl0aW9uXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBvcGVuVXJsSW5OZXdUYWIoY29uZGl0aW9uID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNob3VsZE9wZW5VcmxJbk5ld1RhYiA9IGNvbmRpdGlvblxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgc2l6ZShzaXplKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemVcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHVybCh1cmwpIHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmxcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIHZpZXcodmlldykge1xuICAgICAgICB0aGlzLnZpZXcgPSB2aWV3XG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBidXR0b24oKSB7XG4gICAgICAgIHRoaXMudmlldygnZmlsYW1lbnQtYWN0aW9uczo6YnV0dG9uLWFjdGlvbicpXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBncm91cGVkKCkge1xuICAgICAgICB0aGlzLnZpZXcoJ2ZpbGFtZW50LWFjdGlvbnM6Omdyb3VwZWQtYWN0aW9uJylcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGxpbmsoKSB7XG4gICAgICAgIHRoaXMudmlldygnZmlsYW1lbnQtYWN0aW9uczo6bGluay1hY3Rpb24nKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxufVxuXG5jbGFzcyBBY3Rpb25Hcm91cCB7XG4gICAgY29uc3RydWN0b3IoYWN0aW9ucykge1xuICAgICAgICB0aGlzLmFjdGlvbnMoYWN0aW9ucylcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGFjdGlvbnMoYWN0aW9ucykge1xuICAgICAgICB0aGlzLmFjdGlvbnMgPSBhY3Rpb25zLm1hcCgoYWN0aW9uKSA9PiBhY3Rpb24uZ3JvdXBlZCgpKVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgY29sb3IoY29sb3IpIHtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yXG5cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBpY29uKGljb24pIHtcbiAgICAgICAgdGhpcy5pY29uID0gaWNvblxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgaWNvblBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMuaWNvblBvc2l0aW9uID0gcG9zaXRpb25cblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGxhYmVsKGxhYmVsKSB7XG4gICAgICAgIHRoaXMubGFiZWwgPSBsYWJlbFxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgdG9vbHRpcCh0b29sdGlwKSB7XG4gICAgICAgIHRoaXMudG9vbHRpcCA9IHRvb2x0aXBcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbn1cblxuZXhwb3J0IHsgQWN0aW9uLCBBY3Rpb25Hcm91cCwgTm90aWZpY2F0aW9uIH1cbiIsICJpbXBvcnQgTm90aWZpY2F0aW9uQ29tcG9uZW50QWxwaW5lUGx1Z2luIGZyb20gJy4vY29tcG9uZW50cy9ub3RpZmljYXRpb24nXG5pbXBvcnQge1xuICAgIEFjdGlvbiBhcyBOb3RpZmljYXRpb25BY3Rpb24sXG4gICAgQWN0aW9uR3JvdXAgYXMgTm90aWZpY2F0aW9uQWN0aW9uR3JvdXAsXG4gICAgTm90aWZpY2F0aW9uLFxufSBmcm9tICcuL05vdGlmaWNhdGlvbidcblxud2luZG93LkZpbGFtZW50Tm90aWZpY2F0aW9uQWN0aW9uID0gTm90aWZpY2F0aW9uQWN0aW9uXG53aW5kb3cuRmlsYW1lbnROb3RpZmljYXRpb25BY3Rpb25Hcm91cCA9IE5vdGlmaWNhdGlvbkFjdGlvbkdyb3VwXG53aW5kb3cuRmlsYW1lbnROb3RpZmljYXRpb24gPSBOb3RpZmljYXRpb25cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYWxwaW5lOmluaXQnLCAoKSA9PiB7XG4gICAgd2luZG93LkFscGluZS5wbHVnaW4oTm90aWZpY2F0aW9uQ29tcG9uZW50QWxwaW5lUGx1Z2luKVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7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O0FBQ3ZCLFdBQUssYUFBYTtBQUVsQixhQUFPO0FBQUEsSUFDWDtBQUFBLElBRUEsU0FBUyxZQUFZLE1BQU07QUFDdkIsV0FBSyxhQUFhO0FBRWxCLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFFQSxNQUFNLE9BQU87QUFDVCxXQUFLLFFBQVE7QUFFYixhQUFPO0FBQUEsSUFDWDtBQUFBLElBRUEsTUFBTSxZQUFZLE1BQU07QUFDcEIsV0FBSyxjQUFjO0FBRW5CLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFFQSxnQkFBZ0IsWUFBWSxNQUFNO0FBQzlCLFdBQUssd0JBQXdCO0FBRTdCLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFFQSxLQUFLLE1BQU07QUFDUCxXQUFLLE9BQU87QUFFWixhQUFPO0FBQUEsSUFDWDtBQUFBLElBRUEsSUFBSSxLQUFLO0FBQ0wsV0FBSyxNQUFNO0FBRVgsYUFBTztBQUFBLElBQ1g7QUFBQSxJQUVBLEtBQUssTUFBTTtBQUNQLFdBQUssT0FBTztBQUVaLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFFQSxTQUFTO0FBQ0wsV0FBSyxLQUFLLGlDQUFpQztBQUUzQyxhQUFPO0FBQUEsSUFDWDtBQUFBLElBRUEsVUFBVTtBQUNOLFdBQUssS0FBSyxrQ0FBa0M7QUFFNUMsYUFBTztBQUFBLElBQ1g7QUFBQSxJQUVBLE9BQU87QUFDSCxXQUFLLEtBQUssK0JBQStCO0FBRXpDLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQUVBLE1BQU0sY0FBTixNQUFrQjtBQUFBLElBQ2QsWUFBWSxTQUFTO0FBQ2pCLFdBQUssUUFBUSxPQUFPO0FBRXBCLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFFQSxRQUFRLFNBQVM7QUFDYixXQUFLLFVBQVUsUUFBUSxJQUFJLENBQUMsV0FBVyxPQUFPLFFBQVEsQ0FBQztBQUV2RCxhQUFPO0FBQUEsSUFDWDtBQUFBLElBRUEsTUFBTSxPQUFPO0FBQ1QsV0FBSyxRQUFRO0FBRWIsYUFBTztBQUFBLElBQ1g7QUFBQSxJQUVBLEtBQUssTUFBTTtBQUNQLFdBQUssT0FBTztBQUVaLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFFQSxhQUFhLFVBQVU7QUFDbkIsV0FBSyxlQUFlO0FBRXBCLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFFQSxNQUFNLE9BQU87QUFDVCxXQUFLLFFBQVE7QUFFYixhQUFPO0FBQUEsSUFDWDtBQUFBLElBRUEsUUFBUSxTQUFTO0FBQ2IsV0FBSyxVQUFVO0FBRWYsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNKOzs7QUNoVkEsU0FBTyw2QkFBNkI7QUFDcEMsU0FBTyxrQ0FBa0M7QUFDekMsU0FBTyx1QkFBdUI7QUFFOUIsV0FBUyxpQkFBaUIsZUFBZSxNQUFNO0FBQzNDLFdBQU8sT0FBTyxPQUFPLG9CQUFpQztBQUFBLEVBQzFELENBQUM7IiwKICAibmFtZXMiOiBbImkiLCAidXVpZCIsICJhbmltYXRpb24iLCAidXVpZCJdCn0K

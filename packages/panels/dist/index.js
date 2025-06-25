(() => {
  // node_modules/@danharrin/alpine-mousetrap/dist/module.esm.js
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = { exports: {} };
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __exportStar = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __exportStar(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
  var require_mousetrap = __commonJS((exports, module) => {
    (function(window2, document2, undefined2) {
      if (!window2) {
        return;
      }
      var _MAP = {
        8: "backspace",
        9: "tab",
        13: "enter",
        16: "shift",
        17: "ctrl",
        18: "alt",
        20: "capslock",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "ins",
        46: "del",
        91: "meta",
        93: "meta",
        224: "meta"
      };
      var _KEYCODE_MAP = {
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'"
      };
      var _SHIFT_MAP = {
        "~": "`",
        "!": "1",
        "@": "2",
        "#": "3",
        $: "4",
        "%": "5",
        "^": "6",
        "&": "7",
        "*": "8",
        "(": "9",
        ")": "0",
        _: "-",
        "+": "=",
        ":": ";",
        '"': "'",
        "<": ",",
        ">": ".",
        "?": "/",
        "|": "\\"
      };
      var _SPECIAL_ALIASES = {
        option: "alt",
        command: "meta",
        return: "enter",
        escape: "esc",
        plus: "+",
        mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
      };
      var _REVERSE_MAP;
      for (var i = 1; i < 20; ++i) {
        _MAP[111 + i] = "f" + i;
      }
      for (i = 0; i <= 9; ++i) {
        _MAP[i + 96] = i.toString();
      }
      function _addEvent(object, type, callback) {
        if (object.addEventListener) {
          object.addEventListener(type, callback, false);
          return;
        }
        object.attachEvent("on" + type, callback);
      }
      function _characterFromEvent(e) {
        if (e.type == "keypress") {
          var character = String.fromCharCode(e.which);
          if (!e.shiftKey) {
            character = character.toLowerCase();
          }
          return character;
        }
        if (_MAP[e.which]) {
          return _MAP[e.which];
        }
        if (_KEYCODE_MAP[e.which]) {
          return _KEYCODE_MAP[e.which];
        }
        return String.fromCharCode(e.which).toLowerCase();
      }
      function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(",") === modifiers2.sort().join(",");
      }
      function _eventModifiers(e) {
        var modifiers = [];
        if (e.shiftKey) {
          modifiers.push("shift");
        }
        if (e.altKey) {
          modifiers.push("alt");
        }
        if (e.ctrlKey) {
          modifiers.push("ctrl");
        }
        if (e.metaKey) {
          modifiers.push("meta");
        }
        return modifiers;
      }
      function _preventDefault(e) {
        if (e.preventDefault) {
          e.preventDefault();
          return;
        }
        e.returnValue = false;
      }
      function _stopPropagation(e) {
        if (e.stopPropagation) {
          e.stopPropagation();
          return;
        }
        e.cancelBubble = true;
      }
      function _isModifier(key) {
        return key == "shift" || key == "ctrl" || key == "alt" || key == "meta";
      }
      function _getReverseMap() {
        if (!_REVERSE_MAP) {
          _REVERSE_MAP = {};
          for (var key in _MAP) {
            if (key > 95 && key < 112) {
              continue;
            }
            if (_MAP.hasOwnProperty(key)) {
              _REVERSE_MAP[_MAP[key]] = key;
            }
          }
        }
        return _REVERSE_MAP;
      }
      function _pickBestAction(key, modifiers, action) {
        if (!action) {
          action = _getReverseMap()[key] ? "keydown" : "keypress";
        }
        if (action == "keypress" && modifiers.length) {
          action = "keydown";
        }
        return action;
      }
      function _keysFromString(combination) {
        if (combination === "+") {
          return ["+"];
        }
        combination = combination.replace(/\+{2}/g, "+plus");
        return combination.split("+");
      }
      function _getKeyInfo(combination, action) {
        var keys;
        var key;
        var i2;
        var modifiers = [];
        keys = _keysFromString(combination);
        for (i2 = 0; i2 < keys.length; ++i2) {
          key = keys[i2];
          if (_SPECIAL_ALIASES[key]) {
            key = _SPECIAL_ALIASES[key];
          }
          if (action && action != "keypress" && _SHIFT_MAP[key]) {
            key = _SHIFT_MAP[key];
            modifiers.push("shift");
          }
          if (_isModifier(key)) {
            modifiers.push(key);
          }
        }
        action = _pickBestAction(key, modifiers, action);
        return {
          key,
          modifiers,
          action
        };
      }
      function _belongsTo(element, ancestor) {
        if (element === null || element === document2) {
          return false;
        }
        if (element === ancestor) {
          return true;
        }
        return _belongsTo(element.parentNode, ancestor);
      }
      function Mousetrap3(targetElement) {
        var self = this;
        targetElement = targetElement || document2;
        if (!(self instanceof Mousetrap3)) {
          return new Mousetrap3(targetElement);
        }
        self.target = targetElement;
        self._callbacks = {};
        self._directMap = {};
        var _sequenceLevels = {};
        var _resetTimer;
        var _ignoreNextKeyup = false;
        var _ignoreNextKeypress = false;
        var _nextExpectedAction = false;
        function _resetSequences(doNotReset) {
          doNotReset = doNotReset || {};
          var activeSequences = false, key;
          for (key in _sequenceLevels) {
            if (doNotReset[key]) {
              activeSequences = true;
              continue;
            }
            _sequenceLevels[key] = 0;
          }
          if (!activeSequences) {
            _nextExpectedAction = false;
          }
        }
        function _getMatches(character, modifiers, e, sequenceName, combination, level) {
          var i2;
          var callback;
          var matches = [];
          var action = e.type;
          if (!self._callbacks[character]) {
            return [];
          }
          if (action == "keyup" && _isModifier(character)) {
            modifiers = [character];
          }
          for (i2 = 0; i2 < self._callbacks[character].length; ++i2) {
            callback = self._callbacks[character][i2];
            if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
              continue;
            }
            if (action != callback.action) {
              continue;
            }
            if (action == "keypress" && !e.metaKey && !e.ctrlKey || _modifiersMatch(modifiers, callback.modifiers)) {
              var deleteCombo = !sequenceName && callback.combo == combination;
              var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
              if (deleteCombo || deleteSequence) {
                self._callbacks[character].splice(i2, 1);
              }
              matches.push(callback);
            }
          }
          return matches;
        }
        function _fireCallback(callback, e, combo, sequence) {
          if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
            return;
          }
          if (callback(e, combo) === false) {
            _preventDefault(e);
            _stopPropagation(e);
          }
        }
        self._handleKey = function(character, modifiers, e) {
          var callbacks = _getMatches(character, modifiers, e);
          var i2;
          var doNotReset = {};
          var maxLevel = 0;
          var processedSequenceCallback = false;
          for (i2 = 0; i2 < callbacks.length; ++i2) {
            if (callbacks[i2].seq) {
              maxLevel = Math.max(maxLevel, callbacks[i2].level);
            }
          }
          for (i2 = 0; i2 < callbacks.length; ++i2) {
            if (callbacks[i2].seq) {
              if (callbacks[i2].level != maxLevel) {
                continue;
              }
              processedSequenceCallback = true;
              doNotReset[callbacks[i2].seq] = 1;
              _fireCallback(callbacks[i2].callback, e, callbacks[i2].combo, callbacks[i2].seq);
              continue;
            }
            if (!processedSequenceCallback) {
              _fireCallback(callbacks[i2].callback, e, callbacks[i2].combo);
            }
          }
          var ignoreThisKeypress = e.type == "keypress" && _ignoreNextKeypress;
          if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
            _resetSequences(doNotReset);
          }
          _ignoreNextKeypress = processedSequenceCallback && e.type == "keydown";
        };
        function _handleKeyEvent(e) {
          if (typeof e.which !== "number") {
            e.which = e.keyCode;
          }
          var character = _characterFromEvent(e);
          if (!character) {
            return;
          }
          if (e.type == "keyup" && _ignoreNextKeyup === character) {
            _ignoreNextKeyup = false;
            return;
          }
          self.handleKey(character, _eventModifiers(e), e);
        }
        function _resetSequenceTimer() {
          clearTimeout(_resetTimer);
          _resetTimer = setTimeout(_resetSequences, 1e3);
        }
        function _bindSequence(combo, keys, callback, action) {
          _sequenceLevels[combo] = 0;
          function _increaseSequence(nextAction) {
            return function() {
              _nextExpectedAction = nextAction;
              ++_sequenceLevels[combo];
              _resetSequenceTimer();
            };
          }
          function _callbackAndReset(e) {
            _fireCallback(callback, e, combo);
            if (action !== "keyup") {
              _ignoreNextKeyup = _characterFromEvent(e);
            }
            setTimeout(_resetSequences, 10);
          }
          for (var i2 = 0; i2 < keys.length; ++i2) {
            var isFinal = i2 + 1 === keys.length;
            var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i2 + 1]).action);
            _bindSingle(keys[i2], wrappedCallback, action, combo, i2);
          }
        }
        function _bindSingle(combination, callback, action, sequenceName, level) {
          self._directMap[combination + ":" + action] = callback;
          combination = combination.replace(/\s+/g, " ");
          var sequence = combination.split(" ");
          var info;
          if (sequence.length > 1) {
            _bindSequence(combination, sequence, callback, action);
            return;
          }
          info = _getKeyInfo(combination, action);
          self._callbacks[info.key] = self._callbacks[info.key] || [];
          _getMatches(info.key, info.modifiers, { type: info.action }, sequenceName, combination, level);
          self._callbacks[info.key][sequenceName ? "unshift" : "push"]({
            callback,
            modifiers: info.modifiers,
            action: info.action,
            seq: sequenceName,
            level,
            combo: combination
          });
        }
        self._bindMultiple = function(combinations, callback, action) {
          for (var i2 = 0; i2 < combinations.length; ++i2) {
            _bindSingle(combinations[i2], callback, action);
          }
        };
        _addEvent(targetElement, "keypress", _handleKeyEvent);
        _addEvent(targetElement, "keydown", _handleKeyEvent);
        _addEvent(targetElement, "keyup", _handleKeyEvent);
      }
      Mousetrap3.prototype.bind = function(keys, callback, action) {
        var self = this;
        keys = keys instanceof Array ? keys : [keys];
        self._bindMultiple.call(self, keys, callback, action);
        return self;
      };
      Mousetrap3.prototype.unbind = function(keys, action) {
        var self = this;
        return self.bind.call(self, keys, function() {
        }, action);
      };
      Mousetrap3.prototype.trigger = function(keys, action) {
        var self = this;
        if (self._directMap[keys + ":" + action]) {
          self._directMap[keys + ":" + action]({}, keys);
        }
        return self;
      };
      Mousetrap3.prototype.reset = function() {
        var self = this;
        self._callbacks = {};
        self._directMap = {};
        return self;
      };
      Mousetrap3.prototype.stopCallback = function(e, element) {
        var self = this;
        if ((" " + element.className + " ").indexOf(" mousetrap ") > -1) {
          return false;
        }
        if (_belongsTo(element, self.target)) {
          return false;
        }
        if ("composedPath" in e && typeof e.composedPath === "function") {
          var initialEventTarget = e.composedPath()[0];
          if (initialEventTarget !== e.target) {
            element = initialEventTarget;
          }
        }
        return element.tagName == "INPUT" || element.tagName == "SELECT" || element.tagName == "TEXTAREA" || element.isContentEditable;
      };
      Mousetrap3.prototype.handleKey = function() {
        var self = this;
        return self._handleKey.apply(self, arguments);
      };
      Mousetrap3.addKeycodes = function(object) {
        for (var key in object) {
          if (object.hasOwnProperty(key)) {
            _MAP[key] = object[key];
          }
        }
        _REVERSE_MAP = null;
      };
      Mousetrap3.init = function() {
        var documentMousetrap = Mousetrap3(document2);
        for (var method in documentMousetrap) {
          if (method.charAt(0) !== "_") {
            Mousetrap3[method] = /* @__PURE__ */ function(method2) {
              return function() {
                return documentMousetrap[method2].apply(documentMousetrap, arguments);
              };
            }(method);
          }
        }
      };
      Mousetrap3.init();
      window2.Mousetrap = Mousetrap3;
      if (typeof module !== "undefined" && module.exports) {
        module.exports = Mousetrap3;
      }
      if (typeof define === "function" && define.amd) {
        define(function() {
          return Mousetrap3;
        });
      }
    })(typeof window !== "undefined" ? window : null, typeof window !== "undefined" ? document : null);
  });
  var import_mousetrap = __toModule(require_mousetrap());
  (function(Mousetrap3) {
    if (!Mousetrap3) {
      return;
    }
    var _globalCallbacks = {};
    var _originalStopCallback = Mousetrap3.prototype.stopCallback;
    Mousetrap3.prototype.stopCallback = function(e, element, combo, sequence) {
      var self = this;
      if (self.paused) {
        return true;
      }
      if (_globalCallbacks[combo] || _globalCallbacks[sequence]) {
        return false;
      }
      return _originalStopCallback.call(self, e, element, combo);
    };
    Mousetrap3.prototype.bindGlobal = function(keys, callback, action) {
      var self = this;
      self.bind(keys, callback, action);
      if (keys instanceof Array) {
        for (var i = 0; i < keys.length; i++) {
          _globalCallbacks[keys[i]] = true;
        }
        return;
      }
      _globalCallbacks[keys] = true;
    };
    Mousetrap3.init();
  })(typeof Mousetrap !== "undefined" ? Mousetrap : void 0);
  var src_default = (Alpine) => {
    Alpine.directive("mousetrap", (el, { modifiers, expression }, { evaluate }) => {
      const action = () => expression ? evaluate(expression) : el.click();
      modifiers = modifiers.map((modifier) => modifier.replace(/--/g, " ").replace(/-/g, "+").replace(/\bslash\b/g, "/"));
      if (modifiers.includes("global")) {
        modifiers = modifiers.filter((modifier) => modifier !== "global");
        import_mousetrap.default.bindGlobal(modifiers, ($event) => {
          $event.preventDefault();
          action();
        });
      }
      import_mousetrap.default.bind(modifiers, ($event) => {
        $event.preventDefault();
        action();
      });
    });
  };
  var module_default = src_default;

  // packages/panels/resources/js/stores/sidebar.js
  var sidebar_default = () => ({
    isOpen: window.Alpine.$persist(false).as("isOpen"),
    collapsedGroups: window.Alpine.$persist(null).as("collapsedGroups"),
    groupIsCollapsed(group) {
      return this.collapsedGroups.includes(group);
    },
    collapseGroup(group) {
      if (this.collapsedGroups.includes(group)) {
        return;
      }
      this.collapsedGroups = this.collapsedGroups.concat(group);
    },
    toggleCollapsedGroup(group) {
      this.collapsedGroups = this.collapsedGroups.includes(group) ? this.collapsedGroups.filter(
        (collapsedGroup) => collapsedGroup !== group
      ) : this.collapsedGroups.concat(group);
    },
    close() {
      this.isOpen = false;
    },
    open() {
      this.isOpen = true;
    }
  });

  // packages/panels/resources/js/dark-mode.js
  document.addEventListener("alpine:init", () => {
    const theme = localStorage.getItem("theme") ?? getComputedStyle(document.documentElement).getPropertyValue(
      "--default-theme-mode"
    );
    window.Alpine.store(
      "theme",
      theme === "dark" || theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    );
    window.addEventListener("theme-changed", (event) => {
      let theme2 = event.detail;
      localStorage.setItem("theme", theme2);
      if (theme2 === "system") {
        theme2 = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      window.Alpine.store("theme", theme2);
    });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      if (localStorage.getItem("theme") === "system") {
        window.Alpine.store("theme", event.matches ? "dark" : "light");
      }
    });
    window.Alpine.effect(() => {
      const theme2 = window.Alpine.store("theme");
      theme2 === "dark" ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");
    });
  });

  // packages/panels/resources/js/scroll-sidebar.js
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      let activeSidebarItem = document.querySelector(
        ".fi-main-sidebar .fi-sidebar-item.fi-active"
      );
      if (!activeSidebarItem || activeSidebarItem.offsetParent === null) {
        activeSidebarItem = document.querySelector(
          ".fi-main-sidebar .fi-sidebar-group.fi-active"
        );
      }
      if (!activeSidebarItem || activeSidebarItem.offsetParent === null) {
        return;
      }
      const sidebarWrapper = document.querySelector(
        ".fi-main-sidebar .fi-sidebar-nav"
      );
      if (!sidebarWrapper) {
        return;
      }
      sidebarWrapper.scrollTo(
        0,
        activeSidebarItem.offsetTop - window.innerHeight / 2
      );
    }, 10);
  });

  // packages/panels/resources/js/unsaved-changes-alert.js
  window.setUpUnsavedDataChangesAlert = ({ body, livewireComponent, $wire }) => {
    window.addEventListener("beforeunload", (event) => {
      if (window.jsMd5(JSON.stringify($wire.data).replace(/\\/g, "")) === $wire.savedDataHash || $wire?.__instance?.effects?.redirect) {
        return;
      }
      event.preventDefault();
      event.returnValue = true;
    });
  };
  window.setUpSpaModeUnsavedDataChangesAlert = ({
    body,
    resolveLivewireComponentUsing,
    $wire
  }) => {
    const shouldPreventNavigation = () => {
      if ($wire?.__instance?.effects?.redirect) {
        return false;
      }
      return window.jsMd5(JSON.stringify($wire.data).replace(/\\/g, "")) !== $wire.savedDataHash;
    };
    const showUnsavedChangesAlert = () => {
      return confirm(body);
    };
    document.addEventListener("livewire:navigate", (event) => {
      if (typeof resolveLivewireComponentUsing() !== "undefined") {
        if (!shouldPreventNavigation()) {
          return;
        }
        if (showUnsavedChangesAlert()) {
          return;
        }
        event.preventDefault();
      }
    });
    window.addEventListener("beforeunload", (event) => {
      if (!shouldPreventNavigation()) {
        return;
      }
      event.preventDefault();
      event.returnValue = true;
    });
  };
  window.setUpUnsavedActionChangesAlert = ({
    resolveLivewireComponentUsing,
    $wire
  }) => {
    window.addEventListener("beforeunload", (event) => {
      if (typeof resolveLivewireComponentUsing() === "undefined") {
        return;
      }
      if (($wire.mountedActions?.length ?? 0) && !$wire?.__instance?.effects?.redirect) {
        event.preventDefault();
        event.returnValue = true;
        return;
      }
    });
  };

  // packages/panels/resources/js/index.js
  document.addEventListener("alpine:init", () => {
    window.Alpine.plugin(module_default);
    window.Alpine.store("sidebar", sidebar_default());
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BkYW5oYXJyaW4vYWxwaW5lLW1vdXNldHJhcC9kaXN0L21vZHVsZS5lc20uanMiLCAiLi4vcmVzb3VyY2VzL2pzL3N0b3Jlcy9zaWRlYmFyLmpzIiwgIi4uL3Jlc291cmNlcy9qcy9kYXJrLW1vZGUuanMiLCAiLi4vcmVzb3VyY2VzL2pzL3Njcm9sbC1zaWRlYmFyLmpzIiwgIi4uL3Jlc291cmNlcy9qcy91bnNhdmVkLWNoYW5nZXMtYWxlcnQuanMiLCAiLi4vcmVzb3VyY2VzL2pzL2luZGV4LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ2YXIgX19jcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xudmFyIF9fZGVmUHJvcCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbnZhciBfX2dldFByb3RvT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2dldE93blByb3BOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fbWFya0FzTW9kdWxlID0gKHRhcmdldCkgPT4gX19kZWZQcm9wKHRhcmdldCwgXCJfX2VzTW9kdWxlXCIsIHt2YWx1ZTogdHJ1ZX0pO1xudmFyIF9fY29tbW9uSlMgPSAoY2FsbGJhY2ssIG1vZHVsZSkgPT4gKCkgPT4ge1xuICBpZiAoIW1vZHVsZSkge1xuICAgIG1vZHVsZSA9IHtleHBvcnRzOiB7fX07XG4gICAgY2FsbGJhY2sobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSk7XG4gIH1cbiAgcmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufTtcbnZhciBfX2V4cG9ydFN0YXIgPSAodGFyZ2V0LCBtb2R1bGUsIGRlc2MpID0+IHtcbiAgaWYgKG1vZHVsZSAmJiB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBtb2R1bGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGZvciAobGV0IGtleSBvZiBfX2dldE93blByb3BOYW1lcyhtb2R1bGUpKVxuICAgICAgaWYgKCFfX2hhc093blByb3AuY2FsbCh0YXJnZXQsIGtleSkgJiYga2V5ICE9PSBcImRlZmF1bHRcIilcbiAgICAgICAgX19kZWZQcm9wKHRhcmdldCwga2V5LCB7Z2V0OiAoKSA9PiBtb2R1bGVba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhtb2R1bGUsIGtleSkpIHx8IGRlc2MuZW51bWVyYWJsZX0pO1xuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59O1xudmFyIF9fdG9Nb2R1bGUgPSAobW9kdWxlKSA9PiB7XG4gIHJldHVybiBfX2V4cG9ydFN0YXIoX19tYXJrQXNNb2R1bGUoX19kZWZQcm9wKG1vZHVsZSAhPSBudWxsID8gX19jcmVhdGUoX19nZXRQcm90b09mKG1vZHVsZSkpIDoge30sIFwiZGVmYXVsdFwiLCBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgJiYgXCJkZWZhdWx0XCIgaW4gbW9kdWxlID8ge2dldDogKCkgPT4gbW9kdWxlLmRlZmF1bHQsIGVudW1lcmFibGU6IHRydWV9IDoge3ZhbHVlOiBtb2R1bGUsIGVudW1lcmFibGU6IHRydWV9KSksIG1vZHVsZSk7XG59O1xuXG4vLyBub2RlX21vZHVsZXMvbW91c2V0cmFwL21vdXNldHJhcC5qc1xudmFyIHJlcXVpcmVfbW91c2V0cmFwID0gX19jb21tb25KUygoZXhwb3J0cywgbW9kdWxlKSA9PiB7XG4gIChmdW5jdGlvbih3aW5kb3cyLCBkb2N1bWVudDIsIHVuZGVmaW5lZDIpIHtcbiAgICBpZiAoIXdpbmRvdzIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIF9NQVAgPSB7XG4gICAgICA4OiBcImJhY2tzcGFjZVwiLFxuICAgICAgOTogXCJ0YWJcIixcbiAgICAgIDEzOiBcImVudGVyXCIsXG4gICAgICAxNjogXCJzaGlmdFwiLFxuICAgICAgMTc6IFwiY3RybFwiLFxuICAgICAgMTg6IFwiYWx0XCIsXG4gICAgICAyMDogXCJjYXBzbG9ja1wiLFxuICAgICAgMjc6IFwiZXNjXCIsXG4gICAgICAzMjogXCJzcGFjZVwiLFxuICAgICAgMzM6IFwicGFnZXVwXCIsXG4gICAgICAzNDogXCJwYWdlZG93blwiLFxuICAgICAgMzU6IFwiZW5kXCIsXG4gICAgICAzNjogXCJob21lXCIsXG4gICAgICAzNzogXCJsZWZ0XCIsXG4gICAgICAzODogXCJ1cFwiLFxuICAgICAgMzk6IFwicmlnaHRcIixcbiAgICAgIDQwOiBcImRvd25cIixcbiAgICAgIDQ1OiBcImluc1wiLFxuICAgICAgNDY6IFwiZGVsXCIsXG4gICAgICA5MTogXCJtZXRhXCIsXG4gICAgICA5MzogXCJtZXRhXCIsXG4gICAgICAyMjQ6IFwibWV0YVwiXG4gICAgfTtcbiAgICB2YXIgX0tFWUNPREVfTUFQID0ge1xuICAgICAgMTA2OiBcIipcIixcbiAgICAgIDEwNzogXCIrXCIsXG4gICAgICAxMDk6IFwiLVwiLFxuICAgICAgMTEwOiBcIi5cIixcbiAgICAgIDExMTogXCIvXCIsXG4gICAgICAxODY6IFwiO1wiLFxuICAgICAgMTg3OiBcIj1cIixcbiAgICAgIDE4ODogXCIsXCIsXG4gICAgICAxODk6IFwiLVwiLFxuICAgICAgMTkwOiBcIi5cIixcbiAgICAgIDE5MTogXCIvXCIsXG4gICAgICAxOTI6IFwiYFwiLFxuICAgICAgMjE5OiBcIltcIixcbiAgICAgIDIyMDogXCJcXFxcXCIsXG4gICAgICAyMjE6IFwiXVwiLFxuICAgICAgMjIyOiBcIidcIlxuICAgIH07XG4gICAgdmFyIF9TSElGVF9NQVAgPSB7XG4gICAgICBcIn5cIjogXCJgXCIsXG4gICAgICBcIiFcIjogXCIxXCIsXG4gICAgICBcIkBcIjogXCIyXCIsXG4gICAgICBcIiNcIjogXCIzXCIsXG4gICAgICAkOiBcIjRcIixcbiAgICAgIFwiJVwiOiBcIjVcIixcbiAgICAgIFwiXlwiOiBcIjZcIixcbiAgICAgIFwiJlwiOiBcIjdcIixcbiAgICAgIFwiKlwiOiBcIjhcIixcbiAgICAgIFwiKFwiOiBcIjlcIixcbiAgICAgIFwiKVwiOiBcIjBcIixcbiAgICAgIF86IFwiLVwiLFxuICAgICAgXCIrXCI6IFwiPVwiLFxuICAgICAgXCI6XCI6IFwiO1wiLFxuICAgICAgJ1wiJzogXCInXCIsXG4gICAgICBcIjxcIjogXCIsXCIsXG4gICAgICBcIj5cIjogXCIuXCIsXG4gICAgICBcIj9cIjogXCIvXCIsXG4gICAgICBcInxcIjogXCJcXFxcXCJcbiAgICB9O1xuICAgIHZhciBfU1BFQ0lBTF9BTElBU0VTID0ge1xuICAgICAgb3B0aW9uOiBcImFsdFwiLFxuICAgICAgY29tbWFuZDogXCJtZXRhXCIsXG4gICAgICByZXR1cm46IFwiZW50ZXJcIixcbiAgICAgIGVzY2FwZTogXCJlc2NcIixcbiAgICAgIHBsdXM6IFwiK1wiLFxuICAgICAgbW9kOiAvTWFjfGlQb2R8aVBob25lfGlQYWQvLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtKSA/IFwibWV0YVwiIDogXCJjdHJsXCJcbiAgICB9O1xuICAgIHZhciBfUkVWRVJTRV9NQVA7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCAyMDsgKytpKSB7XG4gICAgICBfTUFQWzExMSArIGldID0gXCJmXCIgKyBpO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDw9IDk7ICsraSkge1xuICAgICAgX01BUFtpICsgOTZdID0gaS50b1N0cmluZygpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBfYWRkRXZlbnQob2JqZWN0LCB0eXBlLCBjYWxsYmFjaykge1xuICAgICAgaWYgKG9iamVjdC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIG9iamVjdC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG9iamVjdC5hdHRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIF9jaGFyYWN0ZXJGcm9tRXZlbnQoZSkge1xuICAgICAgaWYgKGUudHlwZSA9PSBcImtleXByZXNzXCIpIHtcbiAgICAgICAgdmFyIGNoYXJhY3RlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS53aGljaCk7XG4gICAgICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgICAgIGNoYXJhY3RlciA9IGNoYXJhY3Rlci50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGFyYWN0ZXI7XG4gICAgICB9XG4gICAgICBpZiAoX01BUFtlLndoaWNoXSkge1xuICAgICAgICByZXR1cm4gX01BUFtlLndoaWNoXTtcbiAgICAgIH1cbiAgICAgIGlmIChfS0VZQ09ERV9NQVBbZS53aGljaF0pIHtcbiAgICAgICAgcmV0dXJuIF9LRVlDT0RFX01BUFtlLndoaWNoXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIF9tb2RpZmllcnNNYXRjaChtb2RpZmllcnMxLCBtb2RpZmllcnMyKSB7XG4gICAgICByZXR1cm4gbW9kaWZpZXJzMS5zb3J0KCkuam9pbihcIixcIikgPT09IG1vZGlmaWVyczIuc29ydCgpLmpvaW4oXCIsXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBfZXZlbnRNb2RpZmllcnMoZSkge1xuICAgICAgdmFyIG1vZGlmaWVycyA9IFtdO1xuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goXCJzaGlmdFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChlLmFsdEtleSkge1xuICAgICAgICBtb2RpZmllcnMucHVzaChcImFsdFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChlLmN0cmxLZXkpIHtcbiAgICAgICAgbW9kaWZpZXJzLnB1c2goXCJjdHJsXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGUubWV0YUtleSkge1xuICAgICAgICBtb2RpZmllcnMucHVzaChcIm1ldGFcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbW9kaWZpZXJzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBfcHJldmVudERlZmF1bHQoZSkge1xuICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uIF9zdG9wUHJvcGFnYXRpb24oZSkge1xuICAgICAgaWYgKGUuc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGUuY2FuY2VsQnViYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gX2lzTW9kaWZpZXIoa2V5KSB7XG4gICAgICByZXR1cm4ga2V5ID09IFwic2hpZnRcIiB8fCBrZXkgPT0gXCJjdHJsXCIgfHwga2V5ID09IFwiYWx0XCIgfHwga2V5ID09IFwibWV0YVwiO1xuICAgIH1cbiAgICBmdW5jdGlvbiBfZ2V0UmV2ZXJzZU1hcCgpIHtcbiAgICAgIGlmICghX1JFVkVSU0VfTUFQKSB7XG4gICAgICAgIF9SRVZFUlNFX01BUCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gX01BUCkge1xuICAgICAgICAgIGlmIChrZXkgPiA5NSAmJiBrZXkgPCAxMTIpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoX01BUC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBfUkVWRVJTRV9NQVBbX01BUFtrZXldXSA9IGtleTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBfUkVWRVJTRV9NQVA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIF9waWNrQmVzdEFjdGlvbihrZXksIG1vZGlmaWVycywgYWN0aW9uKSB7XG4gICAgICBpZiAoIWFjdGlvbikge1xuICAgICAgICBhY3Rpb24gPSBfZ2V0UmV2ZXJzZU1hcCgpW2tleV0gPyBcImtleWRvd25cIiA6IFwia2V5cHJlc3NcIjtcbiAgICAgIH1cbiAgICAgIGlmIChhY3Rpb24gPT0gXCJrZXlwcmVzc1wiICYmIG1vZGlmaWVycy5sZW5ndGgpIHtcbiAgICAgICAgYWN0aW9uID0gXCJrZXlkb3duXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cbiAgICBmdW5jdGlvbiBfa2V5c0Zyb21TdHJpbmcoY29tYmluYXRpb24pIHtcbiAgICAgIGlmIChjb21iaW5hdGlvbiA9PT0gXCIrXCIpIHtcbiAgICAgICAgcmV0dXJuIFtcIitcIl07XG4gICAgICB9XG4gICAgICBjb21iaW5hdGlvbiA9IGNvbWJpbmF0aW9uLnJlcGxhY2UoL1xcK3syfS9nLCBcIitwbHVzXCIpO1xuICAgICAgcmV0dXJuIGNvbWJpbmF0aW9uLnNwbGl0KFwiK1wiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gX2dldEtleUluZm8oY29tYmluYXRpb24sIGFjdGlvbikge1xuICAgICAgdmFyIGtleXM7XG4gICAgICB2YXIga2V5O1xuICAgICAgdmFyIGkyO1xuICAgICAgdmFyIG1vZGlmaWVycyA9IFtdO1xuICAgICAga2V5cyA9IF9rZXlzRnJvbVN0cmluZyhjb21iaW5hdGlvbik7XG4gICAgICBmb3IgKGkyID0gMDsgaTIgPCBrZXlzLmxlbmd0aDsgKytpMikge1xuICAgICAgICBrZXkgPSBrZXlzW2kyXTtcbiAgICAgICAgaWYgKF9TUEVDSUFMX0FMSUFTRVNba2V5XSkge1xuICAgICAgICAgIGtleSA9IF9TUEVDSUFMX0FMSUFTRVNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0aW9uICYmIGFjdGlvbiAhPSBcImtleXByZXNzXCIgJiYgX1NISUZUX01BUFtrZXldKSB7XG4gICAgICAgICAga2V5ID0gX1NISUZUX01BUFtrZXldO1xuICAgICAgICAgIG1vZGlmaWVycy5wdXNoKFwic2hpZnRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9pc01vZGlmaWVyKGtleSkpIHtcbiAgICAgICAgICBtb2RpZmllcnMucHVzaChrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhY3Rpb24gPSBfcGlja0Jlc3RBY3Rpb24oa2V5LCBtb2RpZmllcnMsIGFjdGlvbik7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXksXG4gICAgICAgIG1vZGlmaWVycyxcbiAgICAgICAgYWN0aW9uXG4gICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBfYmVsb25nc1RvKGVsZW1lbnQsIGFuY2VzdG9yKSB7XG4gICAgICBpZiAoZWxlbWVudCA9PT0gbnVsbCB8fCBlbGVtZW50ID09PSBkb2N1bWVudDIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGVsZW1lbnQgPT09IGFuY2VzdG9yKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9iZWxvbmdzVG8oZWxlbWVudC5wYXJlbnROb2RlLCBhbmNlc3Rvcik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIE1vdXNldHJhcDModGFyZ2V0RWxlbWVudCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgdGFyZ2V0RWxlbWVudCA9IHRhcmdldEVsZW1lbnQgfHwgZG9jdW1lbnQyO1xuICAgICAgaWYgKCEoc2VsZiBpbnN0YW5jZW9mIE1vdXNldHJhcDMpKSB7XG4gICAgICAgIHJldHVybiBuZXcgTW91c2V0cmFwMyh0YXJnZXRFbGVtZW50KTtcbiAgICAgIH1cbiAgICAgIHNlbGYudGFyZ2V0ID0gdGFyZ2V0RWxlbWVudDtcbiAgICAgIHNlbGYuX2NhbGxiYWNrcyA9IHt9O1xuICAgICAgc2VsZi5fZGlyZWN0TWFwID0ge307XG4gICAgICB2YXIgX3NlcXVlbmNlTGV2ZWxzID0ge307XG4gICAgICB2YXIgX3Jlc2V0VGltZXI7XG4gICAgICB2YXIgX2lnbm9yZU5leHRLZXl1cCA9IGZhbHNlO1xuICAgICAgdmFyIF9pZ25vcmVOZXh0S2V5cHJlc3MgPSBmYWxzZTtcbiAgICAgIHZhciBfbmV4dEV4cGVjdGVkQWN0aW9uID0gZmFsc2U7XG4gICAgICBmdW5jdGlvbiBfcmVzZXRTZXF1ZW5jZXMoZG9Ob3RSZXNldCkge1xuICAgICAgICBkb05vdFJlc2V0ID0gZG9Ob3RSZXNldCB8fCB7fTtcbiAgICAgICAgdmFyIGFjdGl2ZVNlcXVlbmNlcyA9IGZhbHNlLCBrZXk7XG4gICAgICAgIGZvciAoa2V5IGluIF9zZXF1ZW5jZUxldmVscykge1xuICAgICAgICAgIGlmIChkb05vdFJlc2V0W2tleV0pIHtcbiAgICAgICAgICAgIGFjdGl2ZVNlcXVlbmNlcyA9IHRydWU7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgX3NlcXVlbmNlTGV2ZWxzW2tleV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYWN0aXZlU2VxdWVuY2VzKSB7XG4gICAgICAgICAgX25leHRFeHBlY3RlZEFjdGlvbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBfZ2V0TWF0Y2hlcyhjaGFyYWN0ZXIsIG1vZGlmaWVycywgZSwgc2VxdWVuY2VOYW1lLCBjb21iaW5hdGlvbiwgbGV2ZWwpIHtcbiAgICAgICAgdmFyIGkyO1xuICAgICAgICB2YXIgY2FsbGJhY2s7XG4gICAgICAgIHZhciBtYXRjaGVzID0gW107XG4gICAgICAgIHZhciBhY3Rpb24gPSBlLnR5cGU7XG4gICAgICAgIGlmICghc2VsZi5fY2FsbGJhY2tzW2NoYXJhY3Rlcl0pIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFjdGlvbiA9PSBcImtleXVwXCIgJiYgX2lzTW9kaWZpZXIoY2hhcmFjdGVyKSkge1xuICAgICAgICAgIG1vZGlmaWVycyA9IFtjaGFyYWN0ZXJdO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaTIgPSAwOyBpMiA8IHNlbGYuX2NhbGxiYWNrc1tjaGFyYWN0ZXJdLmxlbmd0aDsgKytpMikge1xuICAgICAgICAgIGNhbGxiYWNrID0gc2VsZi5fY2FsbGJhY2tzW2NoYXJhY3Rlcl1baTJdO1xuICAgICAgICAgIGlmICghc2VxdWVuY2VOYW1lICYmIGNhbGxiYWNrLnNlcSAmJiBfc2VxdWVuY2VMZXZlbHNbY2FsbGJhY2suc2VxXSAhPSBjYWxsYmFjay5sZXZlbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhY3Rpb24gIT0gY2FsbGJhY2suYWN0aW9uKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFjdGlvbiA9PSBcImtleXByZXNzXCIgJiYgIWUubWV0YUtleSAmJiAhZS5jdHJsS2V5IHx8IF9tb2RpZmllcnNNYXRjaChtb2RpZmllcnMsIGNhbGxiYWNrLm1vZGlmaWVycykpIHtcbiAgICAgICAgICAgIHZhciBkZWxldGVDb21ibyA9ICFzZXF1ZW5jZU5hbWUgJiYgY2FsbGJhY2suY29tYm8gPT0gY29tYmluYXRpb247XG4gICAgICAgICAgICB2YXIgZGVsZXRlU2VxdWVuY2UgPSBzZXF1ZW5jZU5hbWUgJiYgY2FsbGJhY2suc2VxID09IHNlcXVlbmNlTmFtZSAmJiBjYWxsYmFjay5sZXZlbCA9PSBsZXZlbDtcbiAgICAgICAgICAgIGlmIChkZWxldGVDb21ibyB8fCBkZWxldGVTZXF1ZW5jZSkge1xuICAgICAgICAgICAgICBzZWxmLl9jYWxsYmFja3NbY2hhcmFjdGVyXS5zcGxpY2UoaTIsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdGNoZXM7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBfZmlyZUNhbGxiYWNrKGNhbGxiYWNrLCBlLCBjb21ibywgc2VxdWVuY2UpIHtcbiAgICAgICAgaWYgKHNlbGYuc3RvcENhbGxiYWNrKGUsIGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudCwgY29tYm8sIHNlcXVlbmNlKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FsbGJhY2soZSwgY29tYm8pID09PSBmYWxzZSkge1xuICAgICAgICAgIF9wcmV2ZW50RGVmYXVsdChlKTtcbiAgICAgICAgICBfc3RvcFByb3BhZ2F0aW9uKGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZWxmLl9oYW5kbGVLZXkgPSBmdW5jdGlvbihjaGFyYWN0ZXIsIG1vZGlmaWVycywgZSkge1xuICAgICAgICB2YXIgY2FsbGJhY2tzID0gX2dldE1hdGNoZXMoY2hhcmFjdGVyLCBtb2RpZmllcnMsIGUpO1xuICAgICAgICB2YXIgaTI7XG4gICAgICAgIHZhciBkb05vdFJlc2V0ID0ge307XG4gICAgICAgIHZhciBtYXhMZXZlbCA9IDA7XG4gICAgICAgIHZhciBwcm9jZXNzZWRTZXF1ZW5jZUNhbGxiYWNrID0gZmFsc2U7XG4gICAgICAgIGZvciAoaTIgPSAwOyBpMiA8IGNhbGxiYWNrcy5sZW5ndGg7ICsraTIpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2tzW2kyXS5zZXEpIHtcbiAgICAgICAgICAgIG1heExldmVsID0gTWF0aC5tYXgobWF4TGV2ZWwsIGNhbGxiYWNrc1tpMl0ubGV2ZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkyID0gMDsgaTIgPCBjYWxsYmFja3MubGVuZ3RoOyArK2kyKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrc1tpMl0uc2VxKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2tzW2kyXS5sZXZlbCAhPSBtYXhMZXZlbCkge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb2Nlc3NlZFNlcXVlbmNlQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgZG9Ob3RSZXNldFtjYWxsYmFja3NbaTJdLnNlcV0gPSAxO1xuICAgICAgICAgICAgX2ZpcmVDYWxsYmFjayhjYWxsYmFja3NbaTJdLmNhbGxiYWNrLCBlLCBjYWxsYmFja3NbaTJdLmNvbWJvLCBjYWxsYmFja3NbaTJdLnNlcSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFwcm9jZXNzZWRTZXF1ZW5jZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICBfZmlyZUNhbGxiYWNrKGNhbGxiYWNrc1tpMl0uY2FsbGJhY2ssIGUsIGNhbGxiYWNrc1tpMl0uY29tYm8pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgaWdub3JlVGhpc0tleXByZXNzID0gZS50eXBlID09IFwia2V5cHJlc3NcIiAmJiBfaWdub3JlTmV4dEtleXByZXNzO1xuICAgICAgICBpZiAoZS50eXBlID09IF9uZXh0RXhwZWN0ZWRBY3Rpb24gJiYgIV9pc01vZGlmaWVyKGNoYXJhY3RlcikgJiYgIWlnbm9yZVRoaXNLZXlwcmVzcykge1xuICAgICAgICAgIF9yZXNldFNlcXVlbmNlcyhkb05vdFJlc2V0KTtcbiAgICAgICAgfVxuICAgICAgICBfaWdub3JlTmV4dEtleXByZXNzID0gcHJvY2Vzc2VkU2VxdWVuY2VDYWxsYmFjayAmJiBlLnR5cGUgPT0gXCJrZXlkb3duXCI7XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gX2hhbmRsZUtleUV2ZW50KGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlLndoaWNoICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgZS53aGljaCA9IGUua2V5Q29kZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2hhcmFjdGVyID0gX2NoYXJhY3RlckZyb21FdmVudChlKTtcbiAgICAgICAgaWYgKCFjaGFyYWN0ZXIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUudHlwZSA9PSBcImtleXVwXCIgJiYgX2lnbm9yZU5leHRLZXl1cCA9PT0gY2hhcmFjdGVyKSB7XG4gICAgICAgICAgX2lnbm9yZU5leHRLZXl1cCA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLmhhbmRsZUtleShjaGFyYWN0ZXIsIF9ldmVudE1vZGlmaWVycyhlKSwgZSk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBfcmVzZXRTZXF1ZW5jZVRpbWVyKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoX3Jlc2V0VGltZXIpO1xuICAgICAgICBfcmVzZXRUaW1lciA9IHNldFRpbWVvdXQoX3Jlc2V0U2VxdWVuY2VzLCAxZTMpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gX2JpbmRTZXF1ZW5jZShjb21ibywga2V5cywgY2FsbGJhY2ssIGFjdGlvbikge1xuICAgICAgICBfc2VxdWVuY2VMZXZlbHNbY29tYm9dID0gMDtcbiAgICAgICAgZnVuY3Rpb24gX2luY3JlYXNlU2VxdWVuY2UobmV4dEFjdGlvbikge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF9uZXh0RXhwZWN0ZWRBY3Rpb24gPSBuZXh0QWN0aW9uO1xuICAgICAgICAgICAgKytfc2VxdWVuY2VMZXZlbHNbY29tYm9dO1xuICAgICAgICAgICAgX3Jlc2V0U2VxdWVuY2VUaW1lcigpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gX2NhbGxiYWNrQW5kUmVzZXQoZSkge1xuICAgICAgICAgIF9maXJlQ2FsbGJhY2soY2FsbGJhY2ssIGUsIGNvbWJvKTtcbiAgICAgICAgICBpZiAoYWN0aW9uICE9PSBcImtleXVwXCIpIHtcbiAgICAgICAgICAgIF9pZ25vcmVOZXh0S2V5dXAgPSBfY2hhcmFjdGVyRnJvbUV2ZW50KGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRUaW1lb3V0KF9yZXNldFNlcXVlbmNlcywgMTApO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkyID0gMDsgaTIgPCBrZXlzLmxlbmd0aDsgKytpMikge1xuICAgICAgICAgIHZhciBpc0ZpbmFsID0gaTIgKyAxID09PSBrZXlzLmxlbmd0aDtcbiAgICAgICAgICB2YXIgd3JhcHBlZENhbGxiYWNrID0gaXNGaW5hbCA/IF9jYWxsYmFja0FuZFJlc2V0IDogX2luY3JlYXNlU2VxdWVuY2UoYWN0aW9uIHx8IF9nZXRLZXlJbmZvKGtleXNbaTIgKyAxXSkuYWN0aW9uKTtcbiAgICAgICAgICBfYmluZFNpbmdsZShrZXlzW2kyXSwgd3JhcHBlZENhbGxiYWNrLCBhY3Rpb24sIGNvbWJvLCBpMik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIF9iaW5kU2luZ2xlKGNvbWJpbmF0aW9uLCBjYWxsYmFjaywgYWN0aW9uLCBzZXF1ZW5jZU5hbWUsIGxldmVsKSB7XG4gICAgICAgIHNlbGYuX2RpcmVjdE1hcFtjb21iaW5hdGlvbiArIFwiOlwiICsgYWN0aW9uXSA9IGNhbGxiYWNrO1xuICAgICAgICBjb21iaW5hdGlvbiA9IGNvbWJpbmF0aW9uLnJlcGxhY2UoL1xccysvZywgXCIgXCIpO1xuICAgICAgICB2YXIgc2VxdWVuY2UgPSBjb21iaW5hdGlvbi5zcGxpdChcIiBcIik7XG4gICAgICAgIHZhciBpbmZvO1xuICAgICAgICBpZiAoc2VxdWVuY2UubGVuZ3RoID4gMSkge1xuICAgICAgICAgIF9iaW5kU2VxdWVuY2UoY29tYmluYXRpb24sIHNlcXVlbmNlLCBjYWxsYmFjaywgYWN0aW9uKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaW5mbyA9IF9nZXRLZXlJbmZvKGNvbWJpbmF0aW9uLCBhY3Rpb24pO1xuICAgICAgICBzZWxmLl9jYWxsYmFja3NbaW5mby5rZXldID0gc2VsZi5fY2FsbGJhY2tzW2luZm8ua2V5XSB8fCBbXTtcbiAgICAgICAgX2dldE1hdGNoZXMoaW5mby5rZXksIGluZm8ubW9kaWZpZXJzLCB7dHlwZTogaW5mby5hY3Rpb259LCBzZXF1ZW5jZU5hbWUsIGNvbWJpbmF0aW9uLCBsZXZlbCk7XG4gICAgICAgIHNlbGYuX2NhbGxiYWNrc1tpbmZvLmtleV1bc2VxdWVuY2VOYW1lID8gXCJ1bnNoaWZ0XCIgOiBcInB1c2hcIl0oe1xuICAgICAgICAgIGNhbGxiYWNrLFxuICAgICAgICAgIG1vZGlmaWVyczogaW5mby5tb2RpZmllcnMsXG4gICAgICAgICAgYWN0aW9uOiBpbmZvLmFjdGlvbixcbiAgICAgICAgICBzZXE6IHNlcXVlbmNlTmFtZSxcbiAgICAgICAgICBsZXZlbCxcbiAgICAgICAgICBjb21ibzogY29tYmluYXRpb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBzZWxmLl9iaW5kTXVsdGlwbGUgPSBmdW5jdGlvbihjb21iaW5hdGlvbnMsIGNhbGxiYWNrLCBhY3Rpb24pIHtcbiAgICAgICAgZm9yICh2YXIgaTIgPSAwOyBpMiA8IGNvbWJpbmF0aW9ucy5sZW5ndGg7ICsraTIpIHtcbiAgICAgICAgICBfYmluZFNpbmdsZShjb21iaW5hdGlvbnNbaTJdLCBjYWxsYmFjaywgYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIF9hZGRFdmVudCh0YXJnZXRFbGVtZW50LCBcImtleXByZXNzXCIsIF9oYW5kbGVLZXlFdmVudCk7XG4gICAgICBfYWRkRXZlbnQodGFyZ2V0RWxlbWVudCwgXCJrZXlkb3duXCIsIF9oYW5kbGVLZXlFdmVudCk7XG4gICAgICBfYWRkRXZlbnQodGFyZ2V0RWxlbWVudCwgXCJrZXl1cFwiLCBfaGFuZGxlS2V5RXZlbnQpO1xuICAgIH1cbiAgICBNb3VzZXRyYXAzLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24oa2V5cywgY2FsbGJhY2ssIGFjdGlvbikge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAga2V5cyA9IGtleXMgaW5zdGFuY2VvZiBBcnJheSA/IGtleXMgOiBba2V5c107XG4gICAgICBzZWxmLl9iaW5kTXVsdGlwbGUuY2FsbChzZWxmLCBrZXlzLCBjYWxsYmFjaywgYWN0aW9uKTtcbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG4gICAgTW91c2V0cmFwMy5wcm90b3R5cGUudW5iaW5kID0gZnVuY3Rpb24oa2V5cywgYWN0aW9uKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICByZXR1cm4gc2VsZi5iaW5kLmNhbGwoc2VsZiwga2V5cywgZnVuY3Rpb24oKSB7XG4gICAgICB9LCBhY3Rpb24pO1xuICAgIH07XG4gICAgTW91c2V0cmFwMy5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uKGtleXMsIGFjdGlvbikge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKHNlbGYuX2RpcmVjdE1hcFtrZXlzICsgXCI6XCIgKyBhY3Rpb25dKSB7XG4gICAgICAgIHNlbGYuX2RpcmVjdE1hcFtrZXlzICsgXCI6XCIgKyBhY3Rpb25dKHt9LCBrZXlzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG4gICAgTW91c2V0cmFwMy5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuX2NhbGxiYWNrcyA9IHt9O1xuICAgICAgc2VsZi5fZGlyZWN0TWFwID0ge307XG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuICAgIE1vdXNldHJhcDMucHJvdG90eXBlLnN0b3BDYWxsYmFjayA9IGZ1bmN0aW9uKGUsIGVsZW1lbnQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGlmICgoXCIgXCIgKyBlbGVtZW50LmNsYXNzTmFtZSArIFwiIFwiKS5pbmRleE9mKFwiIG1vdXNldHJhcCBcIikgPiAtMSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoX2JlbG9uZ3NUbyhlbGVtZW50LCBzZWxmLnRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKFwiY29tcG9zZWRQYXRoXCIgaW4gZSAmJiB0eXBlb2YgZS5jb21wb3NlZFBhdGggPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB2YXIgaW5pdGlhbEV2ZW50VGFyZ2V0ID0gZS5jb21wb3NlZFBhdGgoKVswXTtcbiAgICAgICAgaWYgKGluaXRpYWxFdmVudFRhcmdldCAhPT0gZS50YXJnZXQpIHtcbiAgICAgICAgICBlbGVtZW50ID0gaW5pdGlhbEV2ZW50VGFyZ2V0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZWxlbWVudC50YWdOYW1lID09IFwiSU5QVVRcIiB8fCBlbGVtZW50LnRhZ05hbWUgPT0gXCJTRUxFQ1RcIiB8fCBlbGVtZW50LnRhZ05hbWUgPT0gXCJURVhUQVJFQVwiIHx8IGVsZW1lbnQuaXNDb250ZW50RWRpdGFibGU7XG4gICAgfTtcbiAgICBNb3VzZXRyYXAzLnByb3RvdHlwZS5oYW5kbGVLZXkgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBzZWxmLl9oYW5kbGVLZXkuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIE1vdXNldHJhcDMuYWRkS2V5Y29kZXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgX01BUFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF9SRVZFUlNFX01BUCA9IG51bGw7XG4gICAgfTtcbiAgICBNb3VzZXRyYXAzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBkb2N1bWVudE1vdXNldHJhcCA9IE1vdXNldHJhcDMoZG9jdW1lbnQyKTtcbiAgICAgIGZvciAodmFyIG1ldGhvZCBpbiBkb2N1bWVudE1vdXNldHJhcCkge1xuICAgICAgICBpZiAobWV0aG9kLmNoYXJBdCgwKSAhPT0gXCJfXCIpIHtcbiAgICAgICAgICBNb3VzZXRyYXAzW21ldGhvZF0gPSBmdW5jdGlvbihtZXRob2QyKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudE1vdXNldHJhcFttZXRob2QyXS5hcHBseShkb2N1bWVudE1vdXNldHJhcCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfShtZXRob2QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBNb3VzZXRyYXAzLmluaXQoKTtcbiAgICB3aW5kb3cyLk1vdXNldHJhcCA9IE1vdXNldHJhcDM7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIG1vZHVsZS5leHBvcnRzID0gTW91c2V0cmFwMztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBNb3VzZXRyYXAzO1xuICAgICAgfSk7XG4gICAgfVxuICB9KSh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogbnVsbCwgdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IGRvY3VtZW50IDogbnVsbCk7XG59KTtcblxuLy8gc3JjL2luZGV4LmpzXG52YXIgaW1wb3J0X21vdXNldHJhcCA9IF9fdG9Nb2R1bGUocmVxdWlyZV9tb3VzZXRyYXAoKSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9tb3VzZXRyYXAvcGx1Z2lucy9nbG9iYWwtYmluZC9tb3VzZXRyYXAtZ2xvYmFsLWJpbmQuanNcbihmdW5jdGlvbihNb3VzZXRyYXAzKSB7XG4gIGlmICghTW91c2V0cmFwMykge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgX2dsb2JhbENhbGxiYWNrcyA9IHt9O1xuICB2YXIgX29yaWdpbmFsU3RvcENhbGxiYWNrID0gTW91c2V0cmFwMy5wcm90b3R5cGUuc3RvcENhbGxiYWNrO1xuICBNb3VzZXRyYXAzLnByb3RvdHlwZS5zdG9wQ2FsbGJhY2sgPSBmdW5jdGlvbihlLCBlbGVtZW50LCBjb21ibywgc2VxdWVuY2UpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYucGF1c2VkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKF9nbG9iYWxDYWxsYmFja3NbY29tYm9dIHx8IF9nbG9iYWxDYWxsYmFja3Nbc2VxdWVuY2VdKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBfb3JpZ2luYWxTdG9wQ2FsbGJhY2suY2FsbChzZWxmLCBlLCBlbGVtZW50LCBjb21ibyk7XG4gIH07XG4gIE1vdXNldHJhcDMucHJvdG90eXBlLmJpbmRHbG9iYWwgPSBmdW5jdGlvbihrZXlzLCBjYWxsYmFjaywgYWN0aW9uKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHNlbGYuYmluZChrZXlzLCBjYWxsYmFjaywgYWN0aW9uKTtcbiAgICBpZiAoa2V5cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgX2dsb2JhbENhbGxiYWNrc1trZXlzW2ldXSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIF9nbG9iYWxDYWxsYmFja3Nba2V5c10gPSB0cnVlO1xuICB9O1xuICBNb3VzZXRyYXAzLmluaXQoKTtcbn0pKHR5cGVvZiBNb3VzZXRyYXAgIT09IFwidW5kZWZpbmVkXCIgPyBNb3VzZXRyYXAgOiB2b2lkIDApO1xuXG4vLyBzcmMvaW5kZXguanNcbnZhciBzcmNfZGVmYXVsdCA9IChBbHBpbmUpID0+IHtcbiAgQWxwaW5lLmRpcmVjdGl2ZShcIm1vdXNldHJhcFwiLCAoZWwsIHttb2RpZmllcnMsIGV4cHJlc3Npb259LCB7ZXZhbHVhdGV9KSA9PiB7XG4gICAgY29uc3QgYWN0aW9uID0gKCkgPT4gZXhwcmVzc2lvbiA/IGV2YWx1YXRlKGV4cHJlc3Npb24pIDogZWwuY2xpY2soKTtcbiAgICBtb2RpZmllcnMgPSBtb2RpZmllcnMubWFwKChtb2RpZmllcikgPT4gbW9kaWZpZXIucmVwbGFjZSgvLS0vZywgXCIgXCIpLnJlcGxhY2UoLy0vZywgXCIrXCIpLnJlcGxhY2UoL1xcYnNsYXNoXFxiL2csIFwiL1wiKSk7XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImdsb2JhbFwiKSkge1xuICAgICAgbW9kaWZpZXJzID0gbW9kaWZpZXJzLmZpbHRlcigobW9kaWZpZXIpID0+IG1vZGlmaWVyICE9PSBcImdsb2JhbFwiKTtcbiAgICAgIGltcG9ydF9tb3VzZXRyYXAuZGVmYXVsdC5iaW5kR2xvYmFsKG1vZGlmaWVycywgKCRldmVudCkgPT4ge1xuICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYWN0aW9uKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaW1wb3J0X21vdXNldHJhcC5kZWZhdWx0LmJpbmQobW9kaWZpZXJzLCAoJGV2ZW50KSA9PiB7XG4gICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGFjdGlvbigpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbi8vIGJ1aWxkcy9tb2R1bGUuanNcbnZhciBtb2R1bGVfZGVmYXVsdCA9IHNyY19kZWZhdWx0O1xuZXhwb3J0IHtcbiAgbW9kdWxlX2RlZmF1bHQgYXMgZGVmYXVsdFxufTtcbiIsICJleHBvcnQgZGVmYXVsdCAoKSA9PiAoe1xuICAgIGlzT3Blbjogd2luZG93LkFscGluZS4kcGVyc2lzdChmYWxzZSkuYXMoJ2lzT3BlbicpLFxuXG4gICAgY29sbGFwc2VkR3JvdXBzOiB3aW5kb3cuQWxwaW5lLiRwZXJzaXN0KG51bGwpLmFzKCdjb2xsYXBzZWRHcm91cHMnKSxcblxuICAgIGdyb3VwSXNDb2xsYXBzZWQoZ3JvdXApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGFwc2VkR3JvdXBzLmluY2x1ZGVzKGdyb3VwKVxuICAgIH0sXG5cbiAgICBjb2xsYXBzZUdyb3VwKGdyb3VwKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbGxhcHNlZEdyb3Vwcy5pbmNsdWRlcyhncm91cCkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb2xsYXBzZWRHcm91cHMgPSB0aGlzLmNvbGxhcHNlZEdyb3Vwcy5jb25jYXQoZ3JvdXApXG4gICAgfSxcblxuICAgIHRvZ2dsZUNvbGxhcHNlZEdyb3VwKGdyb3VwKSB7XG4gICAgICAgIHRoaXMuY29sbGFwc2VkR3JvdXBzID0gdGhpcy5jb2xsYXBzZWRHcm91cHMuaW5jbHVkZXMoZ3JvdXApXG4gICAgICAgICAgICA/IHRoaXMuY29sbGFwc2VkR3JvdXBzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgIChjb2xsYXBzZWRHcm91cCkgPT4gY29sbGFwc2VkR3JvdXAgIT09IGdyb3VwLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICA6IHRoaXMuY29sbGFwc2VkR3JvdXBzLmNvbmNhdChncm91cClcbiAgICB9LFxuXG4gICAgY2xvc2UoKSB7XG4gICAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2VcbiAgICB9LFxuXG4gICAgb3BlbigpIHtcbiAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlXG4gICAgfSxcbn0pXG4iLCAiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYWxwaW5lOmluaXQnLCAoKSA9PiB7XG4gICAgY29uc3QgdGhlbWUgPVxuICAgICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGhlbWUnKSA/P1xuICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShcbiAgICAgICAgICAgICctLWRlZmF1bHQtdGhlbWUtbW9kZScsXG4gICAgICAgIClcblxuICAgIHdpbmRvdy5BbHBpbmUuc3RvcmUoXG4gICAgICAgICd0aGVtZScsXG4gICAgICAgIHRoZW1lID09PSAnZGFyaycgfHxcbiAgICAgICAgICAgICh0aGVtZSA9PT0gJ3N5c3RlbScgJiZcbiAgICAgICAgICAgICAgICB3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXMpXG4gICAgICAgICAgICA/ICdkYXJrJ1xuICAgICAgICAgICAgOiAnbGlnaHQnLFxuICAgIClcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0aGVtZS1jaGFuZ2VkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGxldCB0aGVtZSA9IGV2ZW50LmRldGFpbFxuXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0aGVtZScsIHRoZW1lKVxuXG4gICAgICAgIGlmICh0aGVtZSA9PT0gJ3N5c3RlbScpIHtcbiAgICAgICAgICAgIHRoZW1lID0gd2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKS5tYXRjaGVzXG4gICAgICAgICAgICAgICAgPyAnZGFyaydcbiAgICAgICAgICAgICAgICA6ICdsaWdodCdcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5BbHBpbmUuc3RvcmUoJ3RoZW1lJywgdGhlbWUpXG4gICAgfSlcblxuICAgIHdpbmRvd1xuICAgICAgICAubWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpXG4gICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGhlbWUnKSA9PT0gJ3N5c3RlbScpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQWxwaW5lLnN0b3JlKCd0aGVtZScsIGV2ZW50Lm1hdGNoZXMgPyAnZGFyaycgOiAnbGlnaHQnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgd2luZG93LkFscGluZS5lZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCB0aGVtZSA9IHdpbmRvdy5BbHBpbmUuc3RvcmUoJ3RoZW1lJylcblxuICAgICAgICB0aGVtZSA9PT0gJ2RhcmsnXG4gICAgICAgICAgICA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkYXJrJylcbiAgICAgICAgICAgIDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RhcmsnKVxuICAgIH0pXG59KVxuIiwgImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGxldCBhY3RpdmVTaWRlYmFySXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAnLmZpLW1haW4tc2lkZWJhciAuZmktc2lkZWJhci1pdGVtLmZpLWFjdGl2ZScsXG4gICAgICAgIClcblxuICAgICAgICBpZiAoIWFjdGl2ZVNpZGViYXJJdGVtIHx8IGFjdGl2ZVNpZGViYXJJdGVtLm9mZnNldFBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgYWN0aXZlU2lkZWJhckl0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgICcuZmktbWFpbi1zaWRlYmFyIC5maS1zaWRlYmFyLWdyb3VwLmZpLWFjdGl2ZScsXG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWFjdGl2ZVNpZGViYXJJdGVtIHx8IGFjdGl2ZVNpZGViYXJJdGVtLm9mZnNldFBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzaWRlYmFyV3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAnLmZpLW1haW4tc2lkZWJhciAuZmktc2lkZWJhci1uYXYnLFxuICAgICAgICApXG5cbiAgICAgICAgaWYgKCFzaWRlYmFyV3JhcHBlcikge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBzaWRlYmFyV3JhcHBlci5zY3JvbGxUbyhcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICBhY3RpdmVTaWRlYmFySXRlbS5vZmZzZXRUb3AgLSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyLFxuICAgICAgICApXG4gICAgfSwgMTApXG59KVxuIiwgIndpbmRvdy5zZXRVcFVuc2F2ZWREYXRhQ2hhbmdlc0FsZXJ0ID0gKHsgYm9keSwgbGl2ZXdpcmVDb21wb25lbnQsICR3aXJlIH0pID0+IHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHdpbmRvdy5qc01kNShKU09OLnN0cmluZ2lmeSgkd2lyZS5kYXRhKS5yZXBsYWNlKC9cXFxcL2csICcnKSkgPT09XG4gICAgICAgICAgICAgICAgJHdpcmUuc2F2ZWREYXRhSGFzaCB8fFxuICAgICAgICAgICAgJHdpcmU/Ll9faW5zdGFuY2U/LmVmZmVjdHM/LnJlZGlyZWN0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gdHJ1ZVxuICAgIH0pXG59XG5cbndpbmRvdy5zZXRVcFNwYU1vZGVVbnNhdmVkRGF0YUNoYW5nZXNBbGVydCA9ICh7XG4gICAgYm9keSxcbiAgICByZXNvbHZlTGl2ZXdpcmVDb21wb25lbnRVc2luZyxcbiAgICAkd2lyZSxcbn0pID0+IHtcbiAgICBjb25zdCBzaG91bGRQcmV2ZW50TmF2aWdhdGlvbiA9ICgpID0+IHtcbiAgICAgICAgaWYgKCR3aXJlPy5fX2luc3RhbmNlPy5lZmZlY3RzPy5yZWRpcmVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgd2luZG93LmpzTWQ1KEpTT04uc3RyaW5naWZ5KCR3aXJlLmRhdGEpLnJlcGxhY2UoL1xcXFwvZywgJycpKSAhPT1cbiAgICAgICAgICAgICR3aXJlLnNhdmVkRGF0YUhhc2hcbiAgICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IHNob3dVbnNhdmVkQ2hhbmdlc0FsZXJ0ID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gY29uZmlybShib2R5KVxuICAgIH1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xpdmV3aXJlOm5hdmlnYXRlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVzb2x2ZUxpdmV3aXJlQ29tcG9uZW50VXNpbmcoKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmICghc2hvdWxkUHJldmVudE5hdmlnYXRpb24oKSkge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2hvd1Vuc2F2ZWRDaGFuZ2VzQWxlcnQoKSkge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgICBpZiAoIXNob3VsZFByZXZlbnROYXZpZ2F0aW9uKCkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IHRydWVcbiAgICB9KVxufVxuXG53aW5kb3cuc2V0VXBVbnNhdmVkQWN0aW9uQ2hhbmdlc0FsZXJ0ID0gKHtcbiAgICByZXNvbHZlTGl2ZXdpcmVDb21wb25lbnRVc2luZyxcbiAgICAkd2lyZSxcbn0pID0+IHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVzb2x2ZUxpdmV3aXJlQ29tcG9uZW50VXNpbmcoKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKCR3aXJlLm1vdW50ZWRBY3Rpb25zPy5sZW5ndGggPz8gMCkgJiZcbiAgICAgICAgICAgICEkd2lyZT8uX19pbnN0YW5jZT8uZWZmZWN0cz8ucmVkaXJlY3RcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IHRydWVcblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICB9KVxufVxuIiwgImltcG9ydCBNb3VzZXRyYXAgZnJvbSAnQGRhbmhhcnJpbi9hbHBpbmUtbW91c2V0cmFwJ1xuaW1wb3J0IHNpZGViYXIgZnJvbSAnLi9zdG9yZXMvc2lkZWJhci5qcydcbmltcG9ydCAnLi9kYXJrLW1vZGUuanMnXG5pbXBvcnQgJy4vc2Nyb2xsLXNpZGViYXIuanMnXG5pbXBvcnQgJy4vdW5zYXZlZC1jaGFuZ2VzLWFsZXJ0LmpzJ1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdhbHBpbmU6aW5pdCcsICgpID0+IHtcbiAgICB3aW5kb3cuQWxwaW5lLnBsdWdpbihNb3VzZXRyYXApXG5cbiAgICB3aW5kb3cuQWxwaW5lLnN0b3JlKCdzaWRlYmFyJywgc2lkZWJhcigpKVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7O0FBQUEsTUFBSSxXQUFXLE9BQU87QUFDdEIsTUFBSSxZQUFZLE9BQU87QUFDdkIsTUFBSSxlQUFlLE9BQU87QUFDMUIsTUFBSSxlQUFlLE9BQU8sVUFBVTtBQUNwQyxNQUFJLG9CQUFvQixPQUFPO0FBQy9CLE1BQUksbUJBQW1CLE9BQU87QUFDOUIsTUFBSSxpQkFBaUIsQ0FBQyxXQUFXLFVBQVUsUUFBUSxjQUFjLEVBQUMsT0FBTyxLQUFJLENBQUM7QUFDOUUsTUFBSSxhQUFhLENBQUMsVUFBVSxXQUFXLE1BQU07QUFDM0MsUUFBSSxDQUFDLFFBQVE7QUFDWCxlQUFTLEVBQUMsU0FBUyxDQUFDLEVBQUM7QUFDckIsZUFBUyxPQUFPLFNBQVMsTUFBTTtBQUFBLElBQ2pDO0FBQ0EsV0FBTyxPQUFPO0FBQUEsRUFDaEI7QUFDQSxNQUFJLGVBQWUsQ0FBQyxRQUFRLFFBQVEsU0FBUztBQUMzQyxRQUFJLFVBQVUsT0FBTyxXQUFXLFlBQVksT0FBTyxXQUFXLFlBQVk7QUFDeEUsZUFBUyxPQUFPLGtCQUFrQixNQUFNO0FBQ3RDLFlBQUksQ0FBQyxhQUFhLEtBQUssUUFBUSxHQUFHLEtBQUssUUFBUTtBQUM3QyxvQkFBVSxRQUFRLEtBQUssRUFBQyxLQUFLLE1BQU0sT0FBTyxHQUFHLEdBQUcsWUFBWSxFQUFFLE9BQU8saUJBQWlCLFFBQVEsR0FBRyxNQUFNLEtBQUssV0FBVSxDQUFDO0FBQUEsSUFDN0g7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUNBLE1BQUksYUFBYSxDQUFDLFdBQVc7QUFDM0IsV0FBTyxhQUFhLGVBQWUsVUFBVSxVQUFVLE9BQU8sU0FBUyxhQUFhLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFXLFVBQVUsT0FBTyxjQUFjLGFBQWEsU0FBUyxFQUFDLEtBQUssTUFBTSxPQUFPLFNBQVMsWUFBWSxLQUFJLElBQUksRUFBQyxPQUFPLFFBQVEsWUFBWSxLQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU07QUFBQSxFQUNoUTtBQUdBLE1BQUksb0JBQW9CLFdBQVcsQ0FBQyxTQUFTLFdBQVc7QUFDdEQsS0FBQyxTQUFTLFNBQVMsV0FBVyxZQUFZO0FBQ3hDLFVBQUksQ0FBQyxTQUFTO0FBQ1o7QUFBQSxNQUNGO0FBQ0EsVUFBSSxPQUFPO0FBQUEsUUFDVCxHQUFHO0FBQUEsUUFDSCxHQUFHO0FBQUEsUUFDSCxJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixJQUFJO0FBQUEsUUFDSixLQUFLO0FBQUEsTUFDUDtBQUNBLFVBQUksZUFBZTtBQUFBLFFBQ2pCLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxNQUNQO0FBQ0EsVUFBSSxhQUFhO0FBQUEsUUFDZixLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxHQUFHO0FBQUEsUUFDSCxLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxHQUFHO0FB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

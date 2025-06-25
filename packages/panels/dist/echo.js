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

  // node_modules/pusher-js/dist/web/pusher.js
  var require_pusher = __commonJS({
    "node_modules/pusher-js/dist/web/pusher.js"(exports, module) {
      (function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === "object" && typeof module === "object")
          module.exports = factory();
        else if (typeof define === "function" && define.amd)
          define([], factory);
        else if (typeof exports === "object")
          exports["Pusher"] = factory();
        else
          root["Pusher"] = factory();
      })(window, function() {
        return (
          /******/
          function(modules) {
            var installedModules = {};
            function __webpack_require__(moduleId) {
              if (installedModules[moduleId]) {
                return installedModules[moduleId].exports;
              }
              var module2 = installedModules[moduleId] = {
                /******/
                i: moduleId,
                /******/
                l: false,
                /******/
                exports: {}
                /******/
              };
              modules[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
              module2.l = true;
              return module2.exports;
            }
            __webpack_require__.m = modules;
            __webpack_require__.c = installedModules;
            __webpack_require__.d = function(exports2, name, getter) {
              if (!__webpack_require__.o(exports2, name)) {
                Object.defineProperty(exports2, name, { enumerable: true, get: getter });
              }
            };
            __webpack_require__.r = function(exports2) {
              if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
              }
              Object.defineProperty(exports2, "__esModule", { value: true });
            };
            __webpack_require__.t = function(value, mode) {
              if (mode & 1) value = __webpack_require__(value);
              if (mode & 8) return value;
              if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
              var ns = /* @__PURE__ */ Object.create(null);
              __webpack_require__.r(ns);
              Object.defineProperty(ns, "default", { enumerable: true, value });
              if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, function(key2) {
                return value[key2];
              }.bind(null, key));
              return ns;
            };
            __webpack_require__.n = function(module2) {
              var getter = module2 && module2.__esModule ? (
                /******/
                function getDefault() {
                  return module2["default"];
                }
              ) : (
                /******/
                function getModuleExports() {
                  return module2;
                }
              );
              __webpack_require__.d(getter, "a", getter);
              return getter;
            };
            __webpack_require__.o = function(object, property) {
              return Object.prototype.hasOwnProperty.call(object, property);
            };
            __webpack_require__.p = "";
            return __webpack_require__(__webpack_require__.s = 2);
          }([
            /* 0 */
            /***/
            function(module2, exports2, __webpack_require__) {
              "use strict";
              var __extends = this && this.__extends || /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              Object.defineProperty(exports2, "__esModule", { value: true });
              var INVALID_BYTE = 256;
              var Coder = (
                /** @class */
                function() {
                  function Coder2(_paddingCharacter) {
                    if (_paddingCharacter === void 0) {
                      _paddingCharacter = "=";
                    }
                    this._paddingCharacter = _paddingCharacter;
                  }
                  Coder2.prototype.encodedLength = function(length) {
                    if (!this._paddingCharacter) {
                      return (length * 8 + 5) / 6 | 0;
                    }
                    return (length + 2) / 3 * 4 | 0;
                  };
                  Coder2.prototype.encode = function(data) {
                    var out = "";
                    var i = 0;
                    for (; i < data.length - 2; i += 3) {
                      var c = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
                      out += this._encodeByte(c >>> 3 * 6 & 63);
                      out += this._encodeByte(c >>> 2 * 6 & 63);
                      out += this._encodeByte(c >>> 1 * 6 & 63);
                      out += this._encodeByte(c >>> 0 * 6 & 63);
                    }
                    var left = data.length - i;
                    if (left > 0) {
                      var c = data[i] << 16 | (left === 2 ? data[i + 1] << 8 : 0);
                      out += this._encodeByte(c >>> 3 * 6 & 63);
                      out += this._encodeByte(c >>> 2 * 6 & 63);
                      if (left === 2) {
                        out += this._encodeByte(c >>> 1 * 6 & 63);
                      } else {
                        out += this._paddingCharacter || "";
                      }
                      out += this._paddingCharacter || "";
                    }
                    return out;
                  };
                  Coder2.prototype.maxDecodedLength = function(length) {
                    if (!this._paddingCharacter) {
                      return (length * 6 + 7) / 8 | 0;
                    }
                    return length / 4 * 3 | 0;
                  };
                  Coder2.prototype.decodedLength = function(s) {
                    return this.maxDecodedLength(s.length - this._getPaddingLength(s));
                  };
                  Coder2.prototype.decode = function(s) {
                    if (s.length === 0) {
                      return new Uint8Array(0);
                    }
                    var paddingLength = this._getPaddingLength(s);
                    var length = s.length - paddingLength;
                    var out = new Uint8Array(this.maxDecodedLength(length));
                    var op = 0;
                    var i = 0;
                    var haveBad = 0;
                    var v0 = 0, v1 = 0, v2 = 0, v3 = 0;
                    for (; i < length - 4; i += 4) {
                      v0 = this._decodeChar(s.charCodeAt(i + 0));
                      v1 = this._decodeChar(s.charCodeAt(i + 1));
                      v2 = this._decodeChar(s.charCodeAt(i + 2));
                      v3 = this._decodeChar(s.charCodeAt(i + 3));
                      out[op++] = v0 << 2 | v1 >>> 4;
                      out[op++] = v1 << 4 | v2 >>> 2;
                      out[op++] = v2 << 6 | v3;
                      haveBad |= v0 & INVALID_BYTE;
                      haveBad |= v1 & INVALID_BYTE;
                      haveBad |= v2 & INVALID_BYTE;
                      haveBad |= v3 & INVALID_BYTE;
                    }
                    if (i < length - 1) {
                      v0 = this._decodeChar(s.charCodeAt(i));
                      v1 = this._decodeChar(s.charCodeAt(i + 1));
                      out[op++] = v0 << 2 | v1 >>> 4;
                      haveBad |= v0 & INVALID_BYTE;
                      haveBad |= v1 & INVALID_BYTE;
                    }
                    if (i < length - 2) {
                      v2 = this._decodeChar(s.charCodeAt(i + 2));
                      out[op++] = v1 << 4 | v2 >>> 2;
                      haveBad |= v2 & INVALID_BYTE;
                    }
                    if (i < length - 3) {
                      v3 = this._decodeChar(s.charCodeAt(i + 3));
                      out[op++] = v2 << 6 | v3;
                      haveBad |= v3 & INVALID_BYTE;
                    }
                    if (haveBad !== 0) {
                      throw new Error("Base64Coder: incorrect characters for decoding");
                    }
                    return out;
                  };
                  Coder2.prototype._encodeByte = function(b) {
                    var result = b;
                    result += 65;
                    result += 25 - b >>> 8 & 0 - 65 - 26 + 97;
                    result += 51 - b >>> 8 & 26 - 97 - 52 + 48;
                    result += 61 - b >>> 8 & 52 - 48 - 62 + 43;
                    result += 62 - b >>> 8 & 62 - 43 - 63 + 47;
                    return String.fromCharCode(result);
                  };
                  Coder2.prototype._decodeChar = function(c) {
                    var result = INVALID_BYTE;
                    result += (42 - c & c - 44) >>> 8 & -INVALID_BYTE + c - 43 + 62;
                    result += (46 - c & c - 48) >>> 8 & -INVALID_BYTE + c - 47 + 63;
                    result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
                    result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
                    result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
                    return result;
                  };
                  Coder2.prototype._getPaddingLength = function(s) {
                    var paddingLength = 0;
                    if (this._paddingCharacter) {
                      for (var i = s.length - 1; i >= 0; i--) {
                        if (s[i] !== this._paddingCharacter) {
                          break;
                        }
                        paddingLength++;
                      }
                      if (s.length < 4 || paddingLength > 2) {
                        throw new Error("Base64Coder: incorrect padding");
                      }
                    }
                    return paddingLength;
                  };
                  return Coder2;
                }()
              );
              exports2.Coder = Coder;
              var stdCoder = new Coder();
              function encode(data) {
                return stdCoder.encode(data);
              }
              exports2.encode = encode;
              function decode(s) {
                return stdCoder.decode(s);
              }
              exports2.decode = decode;
              var URLSafeCoder = (
                /** @class */
                function(_super) {
                  __extends(URLSafeCoder2, _super);
                  function URLSafeCoder2() {
                    return _super !== null && _super.apply(this, arguments) || this;
                  }
                  URLSafeCoder2.prototype._encodeByte = function(b) {
                    var result = b;
                    result += 65;
                    result += 25 - b >>> 8 & 0 - 65 - 26 + 97;
                    result += 51 - b >>> 8 & 26 - 97 - 52 + 48;
                    result += 61 - b >>> 8 & 52 - 48 - 62 + 45;
                    result += 62 - b >>> 8 & 62 - 45 - 63 + 95;
                    return String.fromCharCode(result);
                  };
                  URLSafeCoder2.prototype._decodeChar = function(c) {
                    var result = INVALID_BYTE;
                    result += (44 - c & c - 46) >>> 8 & -INVALID_BYTE + c - 45 + 62;
                    result += (94 - c & c - 96) >>> 8 & -INVALID_BYTE + c - 95 + 63;
                    result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
                    result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
                    result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
                    return result;
                  };
                  return URLSafeCoder2;
                }(Coder)
              );
              exports2.URLSafeCoder = URLSafeCoder;
              var urlSafeCoder = new URLSafeCoder();
              function encodeURLSafe(data) {
                return urlSafeCoder.encode(data);
              }
              exports2.encodeURLSafe = encodeURLSafe;
              function decodeURLSafe(s) {
                return urlSafeCoder.decode(s);
              }
              exports2.decodeURLSafe = decodeURLSafe;
              exports2.encodedLength = function(length) {
                return stdCoder.encodedLength(length);
              };
              exports2.maxDecodedLength = function(length) {
                return stdCoder.maxDecodedLength(length);
              };
              exports2.decodedLength = function(s) {
                return stdCoder.decodedLength(s);
              };
            },
            /* 1 */
            /***/
            function(module2, exports2, __webpack_require__) {
              "use strict";
              Object.defineProperty(exports2, "__esModule", { value: true });
              var INVALID_UTF16 = "utf8: invalid string";
              var INVALID_UTF8 = "utf8: invalid source encoding";
              function encode(s) {
                var arr = new Uint8Array(encodedLength(s));
                var pos = 0;
                for (var i = 0; i < s.length; i++) {
                  var c = s.charCodeAt(i);
                  if (c < 128) {
                    arr[pos++] = c;
                  } else if (c < 2048) {
                    arr[pos++] = 192 | c >> 6;
                    arr[pos++] = 128 | c & 63;
                  } else if (c < 55296) {
                    arr[pos++] = 224 | c >> 12;
                    arr[pos++] = 128 | c >> 6 & 63;
                    arr[pos++] = 128 | c & 63;
                  } else {
                    i++;
                    c = (c & 1023) << 10;
                    c |= s.charCodeAt(i) & 1023;
                    c += 65536;
                    arr[pos++] = 240 | c >> 18;
                    arr[pos++] = 128 | c >> 12 & 63;
                    arr[pos++] = 128 | c >> 6 & 63;
                    arr[pos++] = 128 | c & 63;
                  }
                }
                return arr;
              }
              exports2.encode = encode;
              function encodedLength(s) {
                var result = 0;
                for (var i = 0; i < s.length; i++) {
                  var c = s.charCodeAt(i);
                  if (c < 128) {
                    result += 1;
                  } else if (c < 2048) {
                    result += 2;
                  } else if (c < 55296) {
                    result += 3;
                  } else if (c <= 57343) {
                    if (i >= s.length - 1) {
                      throw new Error(INVALID_UTF16);
                    }
                    i++;
                    result += 4;
                  } else {
                    throw new Error(INVALID_UTF16);
                  }
                }
                return result;
              }
              exports2.encodedLength = encodedLength;
              function decode(arr) {
                var chars = [];
                for (var i = 0; i < arr.length; i++) {
                  var b = arr[i];
                  if (b & 128) {
                    var min = void 0;
                    if (b < 224) {
                      if (i >= arr.length) {
                        throw new Error(INVALID_UTF8);
                      }
                      var n1 = arr[++i];
                      if ((n1 & 192) !== 128) {
                        throw new Error(INVALID_UTF8);
                      }
                      b = (b & 31) << 6 | n1 & 63;
                      min = 128;
                    } else if (b < 240) {
                      if (i >= arr.length - 1) {
                        throw new Error(INVALID_UTF8);
                      }
                      var n1 = arr[++i];
                      var n2 = arr[++i];
                      if ((n1 & 192) !== 128 || (n2 & 192) !== 128) {
                        throw new Error(INVALID_UTF8);
                      }
                      b = (b & 15) << 12 | (n1 & 63) << 6 | n2 & 63;
                      min = 2048;
                    } else if (b < 248) {
                      if (i >= arr.length - 2) {
                        throw new Error(INVALID_UTF8);
                      }
                      var n1 = arr[++i];
                      var n2 = arr[++i];
                      var n3 = arr[++i];
                      if ((n1 & 192) !== 128 || (n2 & 192) !== 128 || (n3 & 192) !== 128) {
                        throw new Error(INVALID_UTF8);
                      }
                      b = (b & 15) << 18 | (n1 & 63) << 12 | (n2 & 63) << 6 | n3 & 63;
                      min = 65536;
                    } else {
                      throw new Error(INVALID_UTF8);
                    }
                    if (b < min || b >= 55296 && b <= 57343) {
                      throw new Error(INVALID_UTF8);
                    }
                    if (b >= 65536) {
                      if (b > 1114111) {
                        throw new Error(INVALID_UTF8);
                      }
                      b -= 65536;
                      chars.push(String.fromCharCode(55296 | b >> 10));
                      b = 56320 | b & 1023;
                    }
                  }
                  chars.push(String.fromCharCode(b));
                }
                return chars.join("");
              }
              exports2.decode = decode;
            },
            /* 2 */
            /***/
            function(module2, exports2, __webpack_require__) {
              module2.exports = __webpack_require__(3).default;
            },
            /* 3 */
            /***/
            function(module2, __webpack_exports__, __webpack_require__) {
              "use strict";
              __webpack_require__.r(__webpack_exports__);
              var ScriptReceiverFactory = function() {
                function ScriptReceiverFactory2(prefix2, name) {
                  this.lastId = 0;
                  this.prefix = prefix2;
                  this.name = name;
                }
                ScriptReceiverFactory2.prototype.create = function(callback) {
                  this.lastId++;
                  var number = this.lastId;
                  var id = this.prefix + number;
                  var name = this.name + "[" + number + "]";
                  var called = false;
                  var callbackWrapper = function() {
                    if (!called) {
                      callback.apply(null, arguments);
                      called = true;
                    }
                  };
                  this[number] = callbackWrapper;
                  return { number, id, name, callback: callbackWrapper };
                };
                ScriptReceiverFactory2.prototype.remove = function(receiver) {
                  delete this[receiver.number];
                };
                return ScriptReceiverFactory2;
              }();
              var ScriptReceivers = new ScriptReceiverFactory("_pusher_script_", "Pusher.ScriptReceivers");
              var Defaults = {
                VERSION: "7.6.0",
                PROTOCOL: 7,
                wsPort: 80,
                wssPort: 443,
                wsPath: "",
                httpHost: "sockjs.pusher.com",
                httpPort: 80,
                httpsPort: 443,
                httpPath: "/pusher",
                stats_host: "stats.pusher.com",
                authEndpoint: "/pusher/auth",
                authTransport: "ajax",
                activityTimeout: 12e4,
                pongTimeout: 3e4,
                unavailableTimeout: 1e4,
                cluster: "mt1",
                userAuthentication: {
                  endpoint: "/pusher/user-auth",
                  transport: "ajax"
                },
                channelAuthorization: {
                  endpoint: "/pusher/auth",
                  transport: "ajax"
                },
                cdn_http: "http://js.pusher.com",
                cdn_https: "https://js.pusher.com",
                dependency_suffix: ""
              };
              var defaults = Defaults;
              var dependency_loader_DependencyLoader = function() {
                function DependencyLoader(options) {
                  this.options = options;
                  this.receivers = options.receivers || ScriptReceivers;
                  this.loading = {};
                }
                DependencyLoader.prototype.load = function(name, options, callback) {
                  var self = this;
                  if (self.loading[name] && self.loading[name].length > 0) {
                    self.loading[name].push(callback);
                  } else {
                    self.loading[name] = [callback];
                    var request = runtime.createScriptRequest(self.getPath(name, options));
                    var receiver = self.receivers.create(function(error) {
                      self.receivers.remove(receiver);
                      if (self.loading[name]) {
                        var callbacks = self.loading[name];
                        delete self.loading[name];
                        var successCallback = function(wasSuccessful) {
                          if (!wasSuccessful) {
                            request.cleanup();
                          }
                        };
                        for (var i = 0; i < callbacks.length; i++) {
                          callbacks[i](error, successCallback);
                        }
                      }
                    });
                    request.send(receiver);
                  }
                };
                DependencyLoader.prototype.getRoot = function(options) {
                  var cdn;
                  var protocol = runtime.getDocument().location.protocol;
                  if (options && options.useTLS || protocol === "https:") {
                    cdn = this.options.cdn_https;
                  } else {
                    cdn = this.options.cdn_http;
                  }
                  return cdn.replace(/\/*$/, "") + "/" + this.options.version;
                };
                DependencyLoader.prototype.getPath = function(name, options) {
                  return this.getRoot(options) + "/" + name + this.options.suffix + ".js";
                };
                return DependencyLoader;
              }();
              var dependency_loader = dependency_loader_DependencyLoader;
              var DependenciesReceivers = new ScriptReceiverFactory("_pusher_dependencies", "Pusher.DependenciesReceivers");
              var Dependencies = new dependency_loader({
                cdn_http: defaults.cdn_http,
                cdn_https: defaults.cdn_https,
                version: defaults.VERSION,
                suffix: defaults.dependency_suffix,
                receivers: DependenciesReceivers
              });
              var urlStore = {
                baseUrl: "https://pusher.com",
                urls: {
                  authenticationEndpoint: {
                    path: "/docs/channels/server_api/authenticating_users"
                  },
                  authorizationEndpoint: {
                    path: "/docs/channels/server_api/authorizing-users/"
                  },
                  javascriptQuickStart: {
                    path: "/docs/javascript_quick_start"
                  },
                  triggeringClientEvents: {
                    path: "/docs/client_api_guide/client_events#trigger-events"
                  },
                  encryptedChannelSupport: {
                    fullUrl: "https://github.com/pusher/pusher-js/tree/cc491015371a4bde5743d1c87a0fbac0feb53195#encrypted-channel-support"
                  }
                }
              };
              var buildLogSuffix = function(key) {
                var urlPrefix = "See:";
                var urlObj = urlStore.urls[key];
                if (!urlObj)
                  return "";
                var url;
                if (urlObj.fullUrl) {
                  url = urlObj.fullUrl;
                } else if (urlObj.path) {
                  url = urlStore.baseUrl + urlObj.path;
                }
                if (!url)
                  return "";
                return urlPrefix + " " + url;
              };
              var url_store = { buildLogSuffix };
              var AuthRequestType;
              (function(AuthRequestType2) {
                AuthRequestType2["UserAuthentication"] = "user-authentication";
                AuthRequestType2["ChannelAuthorization"] = "channel-authorization";
              })(AuthRequestType || (AuthRequestType = {}));
              var __extends = /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              var BadEventName = function(_super) {
                __extends(BadEventName2, _super);
                function BadEventName2(msg) {
                  var _newTarget = this.constructor;
                  var _this = _super.call(this, msg) || this;
                  Object.setPrototypeOf(_this, _newTarget.prototype);
                  return _this;
                }
                return BadEventName2;
              }(Error);
              var BadChannelName = function(_super) {
                __extends(BadChannelName2, _super);
                function BadChannelName2(msg) {
                  var _newTarget = this.constructor;
                  var _this = _super.call(this, msg) || this;
                  Object.setPrototypeOf(_this, _newTarget.prototype);
                  return _this;
                }
                return BadChannelName2;
              }(Error);
              var RequestTimedOut = function(_super) {
                __extends(RequestTimedOut2, _super);
                function RequestTimedOut2(msg) {
                  var _newTarget = this.constructor;
                  var _this = _super.call(this, msg) || this;
                  Object.setPrototypeOf(_this, _newTarget.prototype);
                  return _this;
                }
                return RequestTimedOut2;
              }(Error);
              var TransportPriorityTooLow = function(_super) {
                __extends(TransportPriorityTooLow2, _super);
                function TransportPriorityTooLow2(msg) {
                  var _newTarget = this.constructor;
                  var _this = _super.call(this, msg) || this;
                  Object.setPrototypeOf(_this, _newTarget.prototype);
                  return _this;
                }
                return TransportPriorityTooLow2;
              }(Error);
              var TransportClosed = function(_super) {
                __extends(TransportClosed2, _super);
                function TransportClosed2(msg) {
                  var _newTarget = this.constructor;
                  var _this = _super.call(this, msg) || this;
                  Object.setPrototypeOf(_this, _newTarget.prototype);
                  return _this;
                }
                return TransportClosed2;
              }(Error);
              var UnsupportedFeature = function(_super) {
                __extends(UnsupportedFeature2, _super);
                function UnsupportedFeature2(msg) {
                  var _newTarget = this.constructor;
                  var _this = _super.call(this, msg) || this;
                  Object.setPrototypeOf(_this, _newTarget.prototype);
                  return _this;
                }
                return UnsupportedFeature2;
              }(Error);
              var UnsupportedTransport = function(_super) {
                __extends(UnsupportedTransport2, _super);
                function UnsupportedTransport2(msg) {
                  var _newTarget = this.constructor;
                  var _this = _super.call(this, msg) || this;
                  Object.setPrototypeOf(_this, _newTarget.prototype);
                  return _this;
                }
                return UnsupportedTransport2;
              }(Error);
              var UnsupportedStrategy = function(_super) {
                __extends(UnsupportedStrategy2, _super);
                function UnsupportedStrategy2(msg) {
                  var _newTarget = this.constructor;
                  var _this = _super.call(this, msg) || this;
                  Object.setPrototypeOf(_this, _newTarget.prototype);
                  return _this;
                }
                return UnsupportedStrategy2;
              }(Error);
              var HTTPAuthError = function(_super) {
                __extends(HTTPAuthError2, _super);
                function HTTPAuthError2(status, msg) {
                  var _newTarget = this.constructor;
                  var _this = _super.call(this, msg) || this;
                  _this.status = status;
                  Object.setPrototypeOf(_this, _newTarget.prototype);
                  return _this;
                }
                return HTTPAuthError2;
              }(Error);
              var ajax = function(context, query, authOptions, authRequestType, callback) {
                var xhr = runtime.createXHR();
                xhr.open("POST", authOptions.endpoint, true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                for (var headerName in authOptions.headers) {
                  xhr.setRequestHeader(headerName, authOptions.headers[headerName]);
                }
                if (authOptions.headersProvider != null) {
                  var dynamicHeaders = authOptions.headersProvider();
                  for (var headerName in dynamicHeaders) {
                    xhr.setRequestHeader(headerName, dynamicHeaders[headerName]);
                  }
                }
                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                      var data = void 0;
                      var parsed = false;
                      try {
                        data = JSON.parse(xhr.responseText);
                        parsed = true;
                      } catch (e) {
                        callback(new HTTPAuthError(200, "JSON returned from " + authRequestType.toString() + " endpoint was invalid, yet status code was 200. Data was: " + xhr.responseText), null);
                      }
                      if (parsed) {
                        callback(null, data);
                      }
                    } else {
                      var suffix = "";
                      switch (authRequestType) {
                        case AuthRequestType.UserAuthentication:
                          suffix = url_store.buildLogSuffix("authenticationEndpoint");
                          break;
                        case AuthRequestType.ChannelAuthorization:
                          suffix = "Clients must be authorized to join private or presence channels. " + url_store.buildLogSuffix("authorizationEndpoint");
                          break;
                      }
                      callback(new HTTPAuthError(xhr.status, "Unable to retrieve auth string from " + authRequestType.toString() + " endpoint - " + ("received status: " + xhr.status + " from " + authOptions.endpoint + ". " + suffix)), null);
                    }
                  }
                };
                xhr.send(query);
                return xhr;
              };
              var xhr_auth = ajax;
              function encode(s) {
                return btoa(utob(s));
              }
              var fromCharCode = String.fromCharCode;
              var b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
              var b64tab = {};
              for (var base64_i = 0, l = b64chars.length; base64_i < l; base64_i++) {
                b64tab[b64chars.charAt(base64_i)] = base64_i;
              }
              var cb_utob = function(c) {
                var cc = c.charCodeAt(0);
                return cc < 128 ? c : cc < 2048 ? fromCharCode(192 | cc >>> 6) + fromCharCode(128 | cc & 63) : fromCharCode(224 | cc >>> 12 & 15) + fromCharCode(128 | cc >>> 6 & 63) + fromCharCode(128 | cc & 63);
              };
              var utob = function(u) {
                return u.replace(/[^\x00-\x7F]/g, cb_utob);
              };
              var cb_encode = function(ccc) {
                var padlen = [0, 2, 1][ccc.length % 3];
                var ord = ccc.charCodeAt(0) << 16 | (ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8 | (ccc.length > 2 ? ccc.charCodeAt(2) : 0);
                var chars = [
                  b64chars.charAt(ord >>> 18),
                  b64chars.charAt(ord >>> 12 & 63),
                  padlen >= 2 ? "=" : b64chars.charAt(ord >>> 6 & 63),
                  padlen >= 1 ? "=" : b64chars.charAt(ord & 63)
                ];
                return chars.join("");
              };
              var btoa = window.btoa || function(b) {
                return b.replace(/[\s\S]{1,3}/g, cb_encode);
              };
              var Timer = function() {
                function Timer2(set, clear, delay, callback) {
                  var _this = this;
                  this.clear = clear;
                  this.timer = set(function() {
                    if (_this.timer) {
                      _this.timer = callback(_this.timer);
                    }
                  }, delay);
                }
                Timer2.prototype.isRunning = function() {
                  return this.timer !== null;
                };
                Timer2.prototype.ensureAborted = function() {
                  if (this.timer) {
                    this.clear(this.timer);
                    this.timer = null;
                  }
                };
                return Timer2;
              }();
              var abstract_timer = Timer;
              var timers_extends = /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              function timers_clearTimeout(timer) {
                window.clearTimeout(timer);
              }
              function timers_clearInterval(timer) {
                window.clearInterval(timer);
              }
              var OneOffTimer = function(_super) {
                timers_extends(OneOffTimer2, _super);
                function OneOffTimer2(delay, callback) {
                  return _super.call(this, setTimeout, timers_clearTimeout, delay, function(timer) {
                    callback();
                    return null;
                  }) || this;
                }
                return OneOffTimer2;
              }(abstract_timer);
              var PeriodicTimer = function(_super) {
                timers_extends(PeriodicTimer2, _super);
                function PeriodicTimer2(delay, callback) {
                  return _super.call(this, setInterval, timers_clearInterval, delay, function(timer) {
                    callback();
                    return timer;
                  }) || this;
                }
                return PeriodicTimer2;
              }(abstract_timer);
              var Util = {
                now: function() {
                  if (Date.now) {
                    return Date.now();
                  } else {
                    return (/* @__PURE__ */ new Date()).valueOf();
                  }
                },
                defer: function(callback) {
                  return new OneOffTimer(0, callback);
                },
                method: function(name) {
                  var args = [];
                  for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                  }
                  var boundArguments = Array.prototype.slice.call(arguments, 1);
                  return function(object) {
                    return object[name].apply(object, boundArguments.concat(arguments));
                  };
                }
              };
              var util = Util;
              function extend(target) {
                var sources = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                  sources[_i - 1] = arguments[_i];
                }
                for (var i = 0; i < sources.length; i++) {
                  var extensions = sources[i];
                  for (var property in extensions) {
                    if (extensions[property] && extensions[property].constructor && extensions[property].constructor === Object) {
                      target[property] = extend(target[property] || {}, extensions[property]);
                    } else {
                      target[property] = extensions[property];
                    }
                  }
                }
                return target;
              }
              function stringify() {
                var m = ["Pusher"];
                for (var i = 0; i < arguments.length; i++) {
                  if (typeof arguments[i] === "string") {
                    m.push(arguments[i]);
                  } else {
                    m.push(safeJSONStringify(arguments[i]));
                  }
                }
                return m.join(" : ");
              }
              function arrayIndexOf(array, item) {
                var nativeIndexOf = Array.prototype.indexOf;
                if (array === null) {
                  return -1;
                }
                if (nativeIndexOf && array.indexOf === nativeIndexOf) {
                  return array.indexOf(item);
                }
                for (var i = 0, l2 = array.length; i < l2; i++) {
                  if (array[i] === item) {
                    return i;
                  }
                }
                return -1;
              }
              function objectApply(object, f) {
                for (var key in object) {
                  if (Object.prototype.hasOwnProperty.call(object, key)) {
                    f(object[key], key, object);
                  }
                }
              }
              function keys(object) {
                var keys2 = [];
                objectApply(object, function(_, key) {
                  keys2.push(key);
                });
                return keys2;
              }
              function values(object) {
                var values2 = [];
                objectApply(object, function(value) {
                  values2.push(value);
                });
                return values2;
              }
              function apply(array, f, context) {
                for (var i = 0; i < array.length; i++) {
                  f.call(context || window, array[i], i, array);
                }
              }
              function map(array, f) {
                var result = [];
                for (var i = 0; i < array.length; i++) {
                  result.push(f(array[i], i, array, result));
                }
                return result;
              }
              function mapObject(object, f) {
                var result = {};
                objectApply(object, function(value, key) {
                  result[key] = f(value);
                });
                return result;
              }
              function filter(array, test) {
                test = test || function(value) {
                  return !!value;
                };
                var result = [];
                for (var i = 0; i < array.length; i++) {
                  if (test(array[i], i, array, result)) {
                    result.push(array[i]);
                  }
                }
                return result;
              }
              function filterObject(object, test) {
                var result = {};
                objectApply(object, function(value, key) {
                  if (test && test(value, key, object, result) || Boolean(value)) {
                    result[key] = value;
                  }
                });
                return result;
              }
              function flatten(object) {
                var result = [];
                objectApply(object, function(value, key) {
                  result.push([key, value]);
                });
                return result;
              }
              function any(array, test) {
                for (var i = 0; i < array.length; i++) {
                  if (test(array[i], i, array)) {
                    return true;
                  }
                }
                return false;
              }
              function collections_all(array, test) {
                for (var i = 0; i < array.length; i++) {
                  if (!test(array[i], i, array)) {
                    return false;
                  }
                }
                return true;
              }
              function encodeParamsObject(data) {
                return mapObject(data, function(value) {
                  if (typeof value === "object") {
                    value = safeJSONStringify(value);
                  }
                  return encodeURIComponent(encode(value.toString()));
                });
              }
              function buildQueryString(data) {
                var params = filterObject(data, function(value) {
                  return value !== void 0;
                });
                var query = map(flatten(encodeParamsObject(params)), util.method("join", "=")).join("&");
                return query;
              }
              function decycleObject(object) {
                var objects = [], paths = [];
                return function derez(value, path) {
                  var i, name, nu;
                  switch (typeof value) {
                    case "object":
                      if (!value) {
                        return null;
                      }
                      for (i = 0; i < objects.length; i += 1) {
                        if (objects[i] === value) {
                          return { $ref: paths[i] };
                        }
                      }
                      objects.push(value);
                      paths.push(path);
                      if (Object.prototype.toString.apply(value) === "[object Array]") {
                        nu = [];
                        for (i = 0; i < value.length; i += 1) {
                          nu[i] = derez(value[i], path + "[" + i + "]");
                        }
                      } else {
                        nu = {};
                        for (name in value) {
                          if (Object.prototype.hasOwnProperty.call(value, name)) {
                            nu[name] = derez(value[name], path + "[" + JSON.stringify(name) + "]");
                          }
                        }
                      }
                      return nu;
                    case "number":
                    case "string":
                    case "boolean":
                      return value;
                  }
                }(object, "$");
              }
              function safeJSONStringify(source) {
                try {
                  return JSON.stringify(source);
                } catch (e) {
                  return JSON.stringify(decycleObject(source));
                }
              }
              var logger_Logger = function() {
                function Logger() {
                  this.globalLog = function(message) {
                    if (window.console && window.console.log) {
                      window.console.log(message);
                    }
                  };
                }
                Logger.prototype.debug = function() {
                  var args = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                  }
                  this.log(this.globalLog, args);
                };
                Logger.prototype.warn = function() {
                  var args = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                  }
                  this.log(this.globalLogWarn, args);
                };
                Logger.prototype.error = function() {
                  var args = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                  }
                  this.log(this.globalLogError, args);
                };
                Logger.prototype.globalLogWarn = function(message) {
                  if (window.console && window.console.warn) {
                    window.console.warn(message);
                  } else {
                    this.globalLog(message);
                  }
                };
                Logger.prototype.globalLogError = function(message) {
                  if (window.console && window.console.error) {
                    window.console.error(message);
                  } else {
                    this.globalLogWarn(message);
                  }
                };
                Logger.prototype.log = function(defaultLoggingFunction) {
                  var args = [];
                  for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                  }
                  var message = stringify.apply(this, arguments);
                  if (core_pusher.log) {
                    core_pusher.log(message);
                  } else if (core_pusher.logToConsole) {
                    var log = defaultLoggingFunction.bind(this);
                    log(message);
                  }
                };
                return Logger;
              }();
              var logger = new logger_Logger();
              var jsonp = function(context, query, authOptions, authRequestType, callback) {
                if (authOptions.headers !== void 0 || authOptions.headersProvider != null) {
                  logger.warn("To send headers with the " + authRequestType.toString() + " request, you must use AJAX, rather than JSONP.");
                }
                var callbackName = context.nextAuthCallbackID.toString();
                context.nextAuthCallbackID++;
                var document2 = context.getDocument();
                var script = document2.createElement("script");
                context.auth_callbacks[callbackName] = function(data) {
                  callback(null, data);
                };
                var callback_name = "Pusher.auth_callbacks['" + callbackName + "']";
                script.src = authOptions.endpoint + "?callback=" + encodeURIComponent(callback_name) + "&" + query;
                var head = document2.getElementsByTagName("head")[0] || document2.documentElement;
                head.insertBefore(script, head.firstChild);
              };
              var jsonp_auth = jsonp;
              var ScriptRequest = function() {
                function ScriptRequest2(src) {
                  this.src = src;
                }
                ScriptRequest2.prototype.send = function(receiver) {
                  var self = this;
                  var errorString = "Error loading " + self.src;
                  self.script = document.createElement("script");
                  self.script.id = receiver.id;
                  self.script.src = self.src;
                  self.script.type = "text/javascript";
                  self.script.charset = "UTF-8";
                  if (self.script.addEventListener) {
                    self.script.onerror = function() {
                      receiver.callback(errorString);
                    };
                    self.script.onload = function() {
                      receiver.callback(null);
                    };
                  } else {
                    self.script.onreadystatechange = function() {
                      if (self.script.readyState === "loaded" || self.script.readyState === "complete") {
                        receiver.callback(null);
                      }
                    };
                  }
                  if (self.script.async === void 0 && document.attachEvent && /opera/i.test(navigator.userAgent)) {
                    self.errorScript = document.createElement("script");
                    self.errorScript.id = receiver.id + "_error";
                    self.errorScript.text = receiver.name + "('" + errorString + "');";
                    self.script.async = self.errorScript.async = false;
                  } else {
                    self.script.async = true;
                  }
                  var head = document.getElementsByTagName("head")[0];
                  head.insertBefore(self.script, head.firstChild);
                  if (self.errorScript) {
                    head.insertBefore(self.errorScript, self.script.nextSibling);
                  }
                };
                ScriptRequest2.prototype.cleanup = function() {
                  if (this.script) {
                    this.script.onload = this.script.onerror = null;
                    this.script.onreadystatechange = null;
                  }
                  if (this.script && this.script.parentNode) {
                    this.script.parentNode.removeChild(this.script);
                  }
                  if (this.errorScript && this.errorScript.parentNode) {
                    this.errorScript.parentNode.removeChild(this.errorScript);
                  }
                  this.script = null;
                  this.errorScript = null;
                };
                return ScriptRequest2;
              }();
              var script_request = ScriptRequest;
              var jsonp_request_JSONPRequest = function() {
                function JSONPRequest(url, data) {
                  this.url = url;
                  this.data = data;
                }
                JSONPRequest.prototype.send = function(receiver) {
                  if (this.request) {
                    return;
                  }
                  var query = buildQueryString(this.data);
                  var url = this.url + "/" + receiver.number + "?" + query;
                  this.request = runtime.createScriptRequest(url);
                  this.request.send(receiver);
                };
                JSONPRequest.prototype.cleanup = function() {
                  if (this.request) {
                    this.request.cleanup();
                  }
                };
                return JSONPRequest;
              }();
              var jsonp_request = jsonp_request_JSONPRequest;
              var getAgent = function(sender, useTLS) {
                return function(data, callback) {
                  var scheme = "http" + (useTLS ? "s" : "") + "://";
                  var url = scheme + (sender.host || sender.options.host) + sender.options.path;
                  var request = runtime.createJSONPRequest(url, data);
                  var receiver = runtime.ScriptReceivers.create(function(error, result) {
                    ScriptReceivers.remove(receiver);
                    request.cleanup();
                    if (result && result.host) {
                      sender.host = result.host;
                    }
                    if (callback) {
                      callback(error, result);
                    }
                  });
                  request.send(receiver);
                };
              };
              var jsonp_timeline_jsonp = {
                name: "jsonp",
                getAgent
              };
              var jsonp_timeline = jsonp_timeline_jsonp;
              function getGenericURL(baseScheme, params, path) {
                var scheme = baseScheme + (params.useTLS ? "s" : "");
                var host = params.useTLS ? params.hostTLS : params.hostNonTLS;
                return scheme + "://" + host + path;
              }
              function getGenericPath(key, queryString) {
                var path = "/app/" + key;
                var query = "?protocol=" + defaults.PROTOCOL + "&client=js&version=" + defaults.VERSION + (queryString ? "&" + queryString : "");
                return path + query;
              }
              var ws = {
                getInitial: function(key, params) {
                  var path = (params.httpPath || "") + getGenericPath(key, "flash=false");
                  return getGenericURL("ws", params, path);
                }
              };
              var http = {
                getInitial: function(key, params) {
                  var path = (params.httpPath || "/pusher") + getGenericPath(key);
                  return getGenericURL("http", params, path);
                }
              };
              var sockjs = {
                getInitial: function(key, params) {
                  return getGenericURL("http", params, params.httpPath || "/pusher");
                },
                getPath: function(key, params) {
                  return getGenericPath(key);
                }
              };
              var callback_registry_CallbackRegistry = function() {
                function CallbackRegistry() {
                  this._callbacks = {};
                }
                CallbackRegistry.prototype.get = function(name) {
                  return this._callbacks[prefix(name)];
                };
                CallbackRegistry.prototype.add = function(name, callback, context) {
                  var prefixedEventName = prefix(name);
                  this._callbacks[prefixedEventName] = this._callbacks[prefixedEventName] || [];
                  this._callbacks[prefixedEventName].push({
                    fn: callback,
                    context
                  });
                };
                CallbackRegistry.prototype.remove = function(name, callback, context) {
                  if (!name && !callback && !context) {
                    this._callbacks = {};
                    return;
                  }
                  var names = name ? [prefix(name)] : keys(this._callbacks);
                  if (callback || context) {
                    this.removeCallback(names, callback, context);
                  } else {
                    this.removeAllCallbacks(names);
                  }
                };
                CallbackRegistry.prototype.removeCallback = function(names, callback, context) {
                  apply(names, function(name) {
                    this._callbacks[name] = filter(this._callbacks[name] || [], function(binding) {
                      return callback && callback !== binding.fn || context && context !== binding.context;
                    });
                    if (this._callbacks[name].length === 0) {
                      delete this._callbacks[name];
                    }
                  }, this);
                };
                CallbackRegistry.prototype.removeAllCallbacks = function(names) {
                  apply(names, function(name) {
                    delete this._callbacks[name];
                  }, this);
                };
                return CallbackRegistry;
              }();
              var callback_registry = callback_registry_CallbackRegistry;
              function prefix(name) {
                return "_" + name;
              }
              var dispatcher_Dispatcher = function() {
                function Dispatcher(failThrough) {
                  this.callbacks = new callback_registry();
                  this.global_callbacks = [];
                  this.failThrough = failThrough;
                }
                Dispatcher.prototype.bind = function(eventName, callback, context) {
                  this.callbacks.add(eventName, callback, context);
                  return this;
                };
                Dispatcher.prototype.bind_global = function(callback) {
                  this.global_callbacks.push(callback);
                  return this;
                };
                Dispatcher.prototype.unbind = function(eventName, callback, context) {
                  this.callbacks.remove(eventName, callback, context);
                  return this;
                };
                Dispatcher.prototype.unbind_global = function(callback) {
                  if (!callback) {
                    this.global_callbacks = [];
                    return this;
                  }
                  this.global_callbacks = filter(this.global_callbacks || [], function(c) {
                    return c !== callback;
                  });
                  return this;
                };
                Dispatcher.prototype.unbind_all = function() {
                  this.unbind();
                  this.unbind_global();
                  return this;
                };
                Dispatcher.prototype.emit = function(eventName, data, metadata) {
                  for (var i = 0; i < this.global_callbacks.length; i++) {
                    this.global_callbacks[i](eventName, data);
                  }
                  var callbacks = this.callbacks.get(eventName);
                  var args = [];
                  if (metadata) {
                    args.push(data, metadata);
                  } else if (data) {
                    args.push(data);
                  }
                  if (callbacks && callbacks.length > 0) {
                    for (var i = 0; i < callbacks.length; i++) {
                      callbacks[i].fn.apply(callbacks[i].context || window, args);
                    }
                  } else if (this.failThrough) {
                    this.failThrough(eventName, data);
                  }
                  return this;
                };
                return Dispatcher;
              }();
              var dispatcher = dispatcher_Dispatcher;
              var transport_connection_extends = /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              var transport_connection_TransportConnection = function(_super) {
                transport_connection_extends(TransportConnection, _super);
                function TransportConnection(hooks, name, priority, key, options) {
                  var _this = _super.call(this) || this;
                  _this.initialize = runtime.transportConnectionInitializer;
                  _this.hooks = hooks;
                  _this.name = name;
                  _this.priority = priority;
                  _this.key = key;
                  _this.options = options;
                  _this.state = "new";
                  _this.timeline = options.timeline;
                  _this.activityTimeout = options.activityTimeout;
                  _this.id = _this.timeline.generateUniqueID();
                  return _this;
                }
                TransportConnection.prototype.handlesActivityChecks = function() {
                  return Boolean(this.hooks.handlesActivityChecks);
                };
                TransportConnection.prototype.supportsPing = function() {
                  return Boolean(this.hooks.supportsPing);
                };
                TransportConnection.prototype.connect = function() {
                  var _this = this;
                  if (this.socket || this.state !== "initialized") {
                    return false;
                  }
                  var url = this.hooks.urls.getInitial(this.key, this.options);
                  try {
                    this.socket = this.hooks.getSocket(url, this.options);
                  } catch (e) {
                    util.defer(function() {
                      _this.onError(e);
                      _this.changeState("closed");
                    });
                    return false;
                  }
                  this.bindListeners();
                  logger.debug("Connecting", { transport: this.name, url });
                  this.changeState("connecting");
                  return true;
                };
                TransportConnection.prototype.close = function() {
                  if (this.socket) {
                    this.socket.close();
                    return true;
                  } else {
                    return false;
                  }
                };
                TransportConnection.prototype.send = function(data) {
                  var _this = this;
                  if (this.state === "open") {
                    util.defer(function() {
                      if (_this.socket) {
                        _this.socket.send(data);
                      }
                    });
                    return true;
                  } else {
                    return false;
                  }
                };
                TransportConnection.prototype.ping = function() {
                  if (this.state === "open" && this.supportsPing()) {
                    this.socket.ping();
                  }
                };
                TransportConnection.prototype.onOpen = function() {
                  if (this.hooks.beforeOpen) {
                    this.hooks.beforeOpen(this.socket, this.hooks.urls.getPath(this.key, this.options));
                  }
                  this.changeState("open");
                  this.socket.onopen = void 0;
                };
                TransportConnection.prototype.onError = function(error) {
                  this.emit("error", { type: "WebSocketError", error });
                  this.timeline.error(this.buildTimelineMessage({ error: error.toString() }));
                };
                TransportConnection.prototype.onClose = function(closeEvent) {
                  if (closeEvent) {
                    this.changeState("closed", {
                      code: closeEvent.code,
                      reason: closeEvent.reason,
                      wasClean: closeEvent.wasClean
                    });
                  } else {
                    this.changeState("closed");
                  }
                  this.unbindListeners();
                  this.socket = void 0;
                };
                TransportConnection.prototype.onMessage = function(message) {
                  this.emit("message", message);
                };
                TransportConnection.prototype.onActivity = function() {
                  this.emit("activity");
                };
                TransportConnection.prototype.bindListeners = function() {
                  var _this = this;
                  this.socket.onopen = function() {
                    _this.onOpen();
                  };
                  this.socket.onerror = function(error) {
                    _this.onError(error);
                  };
                  this.socket.onclose = function(closeEvent) {
                    _this.onClose(closeEvent);
                  };
                  this.socket.onmessage = function(message) {
                    _this.onMessage(message);
                  };
                  if (this.supportsPing()) {
                    this.socket.onactivity = function() {
                      _this.onActivity();
                    };
                  }
                };
                TransportConnection.prototype.unbindListeners = function() {
                  if (this.socket) {
                    this.socket.onopen = void 0;
                    this.socket.onerror = void 0;
                    this.socket.onclose = void 0;
                    this.socket.onmessage = void 0;
                    if (this.supportsPing()) {
                      this.socket.onactivity = void 0;
                    }
                  }
                };
                TransportConnection.prototype.changeState = function(state2, params) {
                  this.state = state2;
                  this.timeline.info(this.buildTimelineMessage({
                    state: state2,
                    params
                  }));
                  this.emit(state2, params);
                };
                TransportConnection.prototype.buildTimelineMessage = function(message) {
                  return extend({ cid: this.id }, message);
                };
                return TransportConnection;
              }(dispatcher);
              var transport_connection = transport_connection_TransportConnection;
              var transport_Transport = function() {
                function Transport(hooks) {
                  this.hooks = hooks;
                }
                Transport.prototype.isSupported = function(environment) {
                  return this.hooks.isSupported(environment);
                };
                Transport.prototype.createConnection = function(name, priority, key, options) {
                  return new transport_connection(this.hooks, name, priority, key, options);
                };
                return Transport;
              }();
              var transports_transport = transport_Transport;
              var WSTransport = new transports_transport({
                urls: ws,
                handlesActivityChecks: false,
                supportsPing: false,
                isInitialized: function() {
                  return Boolean(runtime.getWebSocketAPI());
                },
                isSupported: function() {
                  return Boolean(runtime.getWebSocketAPI());
                },
                getSocket: function(url) {
                  return runtime.createWebSocket(url);
                }
              });
              var httpConfiguration = {
                urls: http,
                handlesActivityChecks: false,
                supportsPing: true,
                isInitialized: function() {
                  return true;
                }
              };
              var streamingConfiguration = extend({
                getSocket: function(url) {
                  return runtime.HTTPFactory.createStreamingSocket(url);
                }
              }, httpConfiguration);
              var pollingConfiguration = extend({
                getSocket: function(url) {
                  return runtime.HTTPFactory.createPollingSocket(url);
                }
              }, httpConfiguration);
              var xhrConfiguration = {
                isSupported: function() {
                  return runtime.isXHRSupported();
                }
              };
              var XHRStreamingTransport = new transports_transport(extend({}, streamingConfiguration, xhrConfiguration));
              var XHRPollingTransport = new transports_transport(extend({}, pollingConfiguration, xhrConfiguration));
              var Transports = {
                ws: WSTransport,
                xhr_streaming: XHRStreamingTransport,
                xhr_polling: XHRPollingTransport
              };
              var transports = Transports;
              var SockJSTransport = new transports_transport({
                file: "sockjs",
                urls: sockjs,
                handlesActivityChecks: true,
                supportsPing: false,
                isSupported: function() {
                  return true;
                },
                isInitialized: function() {
                  return window.SockJS !== void 0;
                },
                getSocket: function(url, options) {
                  return new window.SockJS(url, null, {
                    js_path: Dependencies.getPath("sockjs", {
                      useTLS: options.useTLS
                    }),
                    ignore_null_origin: options.ignoreNullOrigin
                  });
                },
                beforeOpen: function(socket, path) {
                  socket.send(JSON.stringify({
                    path
                  }));
                }
              });
              var xdrConfiguration = {
                isSupported: function(environment) {
                  var yes = runtime.isXDRSupported(environment.useTLS);
                  return yes;
                }
              };
              var XDRStreamingTransport = new transports_transport(extend({}, streamingConfiguration, xdrConfiguration));
              var XDRPollingTransport = new transports_transport(extend({}, pollingConfiguration, xdrConfiguration));
              transports.xdr_streaming = XDRStreamingTransport;
              transports.xdr_polling = XDRPollingTransport;
              transports.sockjs = SockJSTransport;
              var transports_transports = transports;
              var net_info_extends = /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              var NetInfo = function(_super) {
                net_info_extends(NetInfo2, _super);
                function NetInfo2() {
                  var _this = _super.call(this) || this;
                  var self = _this;
                  if (window.addEventListener !== void 0) {
                    window.addEventListener("online", function() {
                      self.emit("online");
                    }, false);
                    window.addEventListener("offline", function() {
                      self.emit("offline");
                    }, false);
                  }
                  return _this;
                }
                NetInfo2.prototype.isOnline = function() {
                  if (window.navigator.onLine === void 0) {
                    return true;
                  } else {
                    return window.navigator.onLine;
                  }
                };
                return NetInfo2;
              }(dispatcher);
              var net_info_Network = new NetInfo();
              var assistant_to_the_transport_manager_AssistantToTheTransportManager = function() {
                function AssistantToTheTransportManager(manager, transport, options) {
                  this.manager = manager;
                  this.transport = transport;
                  this.minPingDelay = options.minPingDelay;
                  this.maxPingDelay = options.maxPingDelay;
                  this.pingDelay = void 0;
                }
                AssistantToTheTransportManager.prototype.createConnection = function(name, priority, key, options) {
                  var _this = this;
                  options = extend({}, options, {
                    activityTimeout: this.pingDelay
                  });
                  var connection = this.transport.createConnection(name, priority, key, options);
                  var openTimestamp = null;
                  var onOpen = function() {
                    connection.unbind("open", onOpen);
                    connection.bind("closed", onClosed);
                    openTimestamp = util.now();
                  };
                  var onClosed = function(closeEvent) {
                    connection.unbind("closed", onClosed);
                    if (closeEvent.code === 1002 || closeEvent.code === 1003) {
                      _this.manager.reportDeath();
                    } else if (!closeEvent.wasClean && openTimestamp) {
                      var lifespan = util.now() - openTimestamp;
                      if (lifespan < 2 * _this.maxPingDelay) {
                        _this.manager.reportDeath();
                        _this.pingDelay = Math.max(lifespan / 2, _this.minPingDelay);
                      }
                    }
                  };
                  connection.bind("open", onOpen);
                  return connection;
                };
                AssistantToTheTransportManager.prototype.isSupported = function(environment) {
                  return this.manager.isAlive() && this.transport.isSupported(environment);
                };
                return AssistantToTheTransportManager;
              }();
              var assistant_to_the_transport_manager = assistant_to_the_transport_manager_AssistantToTheTransportManager;
              var Protocol = {
                decodeMessage: function(messageEvent) {
                  try {
                    var messageData = JSON.parse(messageEvent.data);
                    var pusherEventData = messageData.data;
                    if (typeof pusherEventData === "string") {
                      try {
                        pusherEventData = JSON.parse(messageData.data);
                      } catch (e) {
                      }
                    }
                    var pusherEvent = {
                      event: messageData.event,
                      channel: messageData.channel,
                      data: pusherEventData
                    };
                    if (messageData.user_id) {
                      pusherEvent.user_id = messageData.user_id;
                    }
                    return pusherEvent;
                  } catch (e) {
                    throw { type: "MessageParseError", error: e, data: messageEvent.data };
                  }
                },
                encodeMessage: function(event) {
                  return JSON.stringify(event);
                },
                processHandshake: function(messageEvent) {
                  var message = Protocol.decodeMessage(messageEvent);
                  if (message.event === "pusher:connection_established") {
                    if (!message.data.activity_timeout) {
                      throw "No activity timeout specified in handshake";
                    }
                    return {
                      action: "connected",
                      id: message.data.socket_id,
                      activityTimeout: message.data.activity_timeout * 1e3
                    };
                  } else if (message.event === "pusher:error") {
                    return {
                      action: this.getCloseAction(message.data),
                      error: this.getCloseError(message.data)
                    };
                  } else {
                    throw "Invalid handshake";
                  }
                },
                getCloseAction: function(closeEvent) {
                  if (closeEvent.code < 4e3) {
                    if (closeEvent.code >= 1002 && closeEvent.code <= 1004) {
                      return "backoff";
                    } else {
                      return null;
                    }
                  } else if (closeEvent.code === 4e3) {
                    return "tls_only";
                  } else if (closeEvent.code < 4100) {
                    return "refused";
                  } else if (closeEvent.code < 4200) {
                    return "backoff";
                  } else if (closeEvent.code < 4300) {
                    return "retry";
                  } else {
                    return "refused";
                  }
                },
                getCloseError: function(closeEvent) {
                  if (closeEvent.code !== 1e3 && closeEvent.code !== 1001) {
                    return {
                      type: "PusherError",
                      data: {
                        code: closeEvent.code,
                        message: closeEvent.reason || closeEvent.message
                      }
                    };
                  } else {
                    return null;
                  }
                }
              };
              var protocol_protocol = Protocol;
              var connection_extends = /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              var connection_Connection = function(_super) {
                connection_extends(Connection, _super);
                function Connection(id, transport) {
                  var _this = _super.call(this) || this;
                  _this.id = id;
                  _this.transport = transport;
                  _this.activityTimeout = transport.activityTimeout;
                  _this.bindListeners();
                  return _this;
                }
                Connection.prototype.handlesActivityChecks = function() {
                  return this.transport.handlesActivityChecks();
                };
                Connection.prototype.send = function(data) {
                  return this.transport.send(data);
                };
                Connection.prototype.send_event = function(name, data, channel) {
                  var event = { event: name, data };
                  if (channel) {
                    event.channel = channel;
                  }
                  logger.debug("Event sent", event);
                  return this.send(protocol_protocol.encodeMessage(event));
                };
                Connection.prototype.ping = function() {
                  if (this.transport.supportsPing()) {
                    this.transport.ping();
                  } else {
                    this.send_event("pusher:ping", {});
                  }
                };
                Connection.prototype.close = function() {
                  this.transport.close();
                };
                Connection.prototype.bindListeners = function() {
                  var _this = this;
                  var listeners = {
                    message: function(messageEvent) {
                      var pusherEvent;
                      try {
                        pusherEvent = protocol_protocol.decodeMessage(messageEvent);
                      } catch (e) {
                        _this.emit("error", {
                          type: "MessageParseError",
                          error: e,
                          data: messageEvent.data
                        });
                      }
                      if (pusherEvent !== void 0) {
                        logger.debug("Event recd", pusherEvent);
                        switch (pusherEvent.event) {
                          case "pusher:error":
                            _this.emit("error", {
                              type: "PusherError",
                              data: pusherEvent.data
                            });
                            break;
                          case "pusher:ping":
                            _this.emit("ping");
                            break;
                          case "pusher:pong":
                            _this.emit("pong");
                            break;
                        }
                        _this.emit("message", pusherEvent);
                      }
                    },
                    activity: function() {
                      _this.emit("activity");
                    },
                    error: function(error) {
                      _this.emit("error", error);
                    },
                    closed: function(closeEvent) {
                      unbindListeners();
                      if (closeEvent && closeEvent.code) {
                        _this.handleCloseEvent(closeEvent);
                      }
                      _this.transport = null;
                      _this.emit("closed");
                    }
                  };
                  var unbindListeners = function() {
                    objectApply(listeners, function(listener, event) {
                      _this.transport.unbind(event, listener);
                    });
                  };
                  objectApply(listeners, function(listener, event) {
                    _this.transport.bind(event, listener);
                  });
                };
                Connection.prototype.handleCloseEvent = function(closeEvent) {
                  var action = protocol_protocol.getCloseAction(closeEvent);
                  var error = protocol_protocol.getCloseError(closeEvent);
                  if (error) {
                    this.emit("error", error);
                  }
                  if (action) {
                    this.emit(action, { action, error });
                  }
                };
                return Connection;
              }(dispatcher);
              var connection_connection = connection_Connection;
              var handshake_Handshake = function() {
                function Handshake(transport, callback) {
                  this.transport = transport;
                  this.callback = callback;
                  this.bindListeners();
                }
                Handshake.prototype.close = function() {
                  this.unbindListeners();
                  this.transport.close();
                };
                Handshake.prototype.bindListeners = function() {
                  var _this = this;
                  this.onMessage = function(m) {
                    _this.unbindListeners();
                    var result;
                    try {
                      result = protocol_protocol.processHandshake(m);
                    } catch (e) {
                      _this.finish("error", { error: e });
                      _this.transport.close();
                      return;
                    }
                    if (result.action === "connected") {
                      _this.finish("connected", {
                        connection: new connection_connection(result.id, _this.transport),
                        activityTimeout: result.activityTimeout
                      });
                    } else {
                      _this.finish(result.action, { error: result.error });
                      _this.transport.close();
                    }
                  };
                  this.onClosed = function(closeEvent) {
                    _this.unbindListeners();
                    var action = protocol_protocol.getCloseAction(closeEvent) || "backoff";
                    var error = protocol_protocol.getCloseError(closeEvent);
                    _this.finish(action, { error });
                  };
                  this.transport.bind("message", this.onMessage);
                  this.transport.bind("closed", this.onClosed);
                };
                Handshake.prototype.unbindListeners = function() {
                  this.transport.unbind("message", this.onMessage);
                  this.transport.unbind("closed", this.onClosed);
                };
                Handshake.prototype.finish = function(action, params) {
                  this.callback(extend({ transport: this.transport, action }, params));
                };
                return Handshake;
              }();
              var connection_handshake = handshake_Handshake;
              var timeline_sender_TimelineSender = function() {
                function TimelineSender(timeline, options) {
                  this.timeline = timeline;
                  this.options = options || {};
                }
                TimelineSender.prototype.send = function(useTLS, callback) {
                  if (this.timeline.isEmpty()) {
                    return;
                  }
                  this.timeline.send(runtime.TimelineTransport.getAgent(this, useTLS), callback);
                };
                return TimelineSender;
              }();
              var timeline_sender = timeline_sender_TimelineSender;
              var channel_extends = /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              var channel_Channel = function(_super) {
                channel_extends(Channel2, _super);
                function Channel2(name, pusher) {
                  var _this = _super.call(this, function(event, data) {
                    logger.debug("No callbacks on " + name + " for " + event);
                  }) || this;
                  _this.name = name;
                  _this.pusher = pusher;
                  _this.subscribed = false;
                  _this.subscriptionPending = false;
                  _this.subscriptionCancelled = false;
                  return _this;
                }
                Channel2.prototype.authorize = function(socketId, callback) {
                  return callback(null, { auth: "" });
                };
                Channel2.prototype.trigger = function(event, data) {
                  if (event.indexOf("client-") !== 0) {
                    throw new BadEventName("Event '" + event + "' does not start with 'client-'");
                  }
                  if (!this.subscribed) {
                    var suffix = url_store.buildLogSuffix("triggeringClientEvents");
                    logger.warn("Client event triggered before channel 'subscription_succeeded' event . " + suffix);
                  }
                  return this.pusher.send_event(event, data, this.name);
                };
                Channel2.prototype.disconnect = function() {
                  this.subscribed = false;
                  this.subscriptionPending = false;
                };
                Channel2.prototype.handleEvent = function(event) {
                  var eventName = event.event;
                  var data = event.data;
                  if (eventName === "pusher_internal:subscription_succeeded") {
                    this.handleSubscriptionSucceededEvent(event);
                  } else if (eventName === "pusher_internal:subscription_count") {
                    this.handleSubscriptionCountEvent(event);
                  } else if (eventName.indexOf("pusher_internal:") !== 0) {
                    var metadata = {};
                    this.emit(eventName, data, metadata);
                  }
                };
                Channel2.prototype.handleSubscriptionSucceededEvent = function(event) {
                  this.subscriptionPending = false;
                  this.subscribed = true;
                  if (this.subscriptionCancelled) {
                    this.pusher.unsubscribe(this.name);
                  } else {
                    this.emit("pusher:subscription_succeeded", event.data);
                  }
                };
                Channel2.prototype.handleSubscriptionCountEvent = function(event) {
                  if (event.data.subscription_count) {
                    this.subscriptionCount = event.data.subscription_count;
                  }
                  this.emit("pusher:subscription_count", event.data);
                };
                Channel2.prototype.subscribe = function() {
                  var _this = this;
                  if (this.subscribed) {
                    return;
                  }
                  this.subscriptionPending = true;
                  this.subscriptionCancelled = false;
                  this.authorize(this.pusher.connection.socket_id, function(error, data) {
                    if (error) {
                      _this.subscriptionPending = false;
                      logger.error(error.toString());
                      _this.emit("pusher:subscription_error", Object.assign({}, {
                        type: "AuthError",
                        error: error.message
                      }, error instanceof HTTPAuthError ? { status: error.status } : {}));
                    } else {
                      _this.pusher.send_event("pusher:subscribe", {
                        auth: data.auth,
                        channel_data: data.channel_data,
                        channel: _this.name
                      });
                    }
                  });
                };
                Channel2.prototype.unsubscribe = function() {
                  this.subscribed = false;
                  this.pusher.send_event("pusher:unsubscribe", {
                    channel: this.name
                  });
                };
                Channel2.prototype.cancelSubscription = function() {
                  this.subscriptionCancelled = true;
                };
                Channel2.prototype.reinstateSubscription = function() {
                  this.subscriptionCancelled = false;
                };
                return Channel2;
              }(dispatcher);
              var channels_channel = channel_Channel;
              var private_channel_extends = /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              var PrivateChannel = function(_super) {
                private_channel_extends(PrivateChannel2, _super);
                function PrivateChannel2() {
                  return _super !== null && _super.apply(this, arguments) || this;
                }
                PrivateChannel2.prototype.authorize = function(socketId, callback) {
                  return this.pusher.config.channelAuthorizer({
                    channelName: this.name,
                    socketId
                  }, callback);
                };
                return PrivateChannel2;
              }(channels_channel);
              var private_channel = PrivateChannel;
              var members_Members = function() {
                function Members() {
                  this.reset();
                }
                Members.prototype.get = function(id) {
                  if (Object.prototype.hasOwnProperty.call(this.members, id)) {
                    return {
                      id,
                      info: this.members[id]
                    };
                  } else {
                    return null;
                  }
                };
                Members.prototype.each = function(callback) {
                  var _this = this;
                  objectApply(this.members, function(member, id) {
                    callback(_this.get(id));
                  });
                };
                Members.prototype.setMyID = function(id) {
                  this.myID = id;
                };
                Members.prototype.onSubscription = function(subscriptionData) {
                  this.members = subscriptionData.presence.hash;
                  this.count = subscriptionData.presence.count;
                  this.me = this.get(this.myID);
                };
                Members.prototype.addMember = function(memberData) {
                  if (this.get(memberData.user_id) === null) {
                    this.count++;
                  }
                  this.members[memberData.user_id] = memberData.user_info;
                  return this.get(memberData.user_id);
                };
                Members.prototype.removeMember = function(memberData) {
                  var member = this.get(memberData.user_id);
                  if (member) {
                    delete this.members[memberData.user_id];
                    this.count--;
                  }
                  return member;
                };
                Members.prototype.reset = function() {
                  this.members = {};
                  this.count = 0;
                  this.myID = null;
                  this.me = null;
                };
                return Members;
              }();
              var members = members_Members;
              var presence_channel_extends = /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              var __awaiter = function(thisArg, _arguments, P, generator) {
                function adopt(value) {
                  return value instanceof P ? value : new P(function(resolve) {
                    resolve(value);
                  });
                }
                return new (P || (P = Promise))(function(resolve, reject) {
                  function fulfilled(value) {
                    try {
                      step(generator.next(value));
                    } catch (e) {
                      reject(e);
                    }
                  }
                  function rejected(value) {
                    try {
                      step(generator["throw"](value));
                    } catch (e) {
                      reject(e);
                    }
                  }
                  function step(result) {
                    result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
                  }
                  step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
              };
              var __generator = function(thisArg, body) {
                var _ = { label: 0, sent: function() {
                  if (t[0] & 1) throw t[1];
                  return t[1];
                }, trys: [], ops: [] }, f, y, t, g;
                return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
                  return this;
                }), g;
                function verb(n) {
                  return function(v) {
                    return step([n, v]);
                  };
                }
                function step(op) {
                  if (f) throw new TypeError("Generator is already executing.");
                  while (_) try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                    if (y = 0, t) op = [op[0] & 2, t.value];
                    switch (op[0]) {
                      case 0:
                      case 1:
                        t = op;
                        break;
                      case 4:
                        _.label++;
                        return { value: op[1], done: false };
                      case 5:
                        _.label++;
                        y = op[1];
                        op = [0];
                        continue;
                      case 7:
                        op = _.ops.pop();
                        _.trys.pop();
                        continue;
                      default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                        }
                        if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();
                        continue;
                    }
                    op = body.call(thisArg, _);
                  } catch (e) {
                    op = [6, e];
                    y = 0;
                  } finally {
                    f = t = 0;
                  }
                  if (op[0] & 5) throw op[1];
                  return { value: op[0] ? op[1] : void 0, done: true };
                }
              };
              var presence_channel_PresenceChannel = function(_super) {
                presence_channel_extends(PresenceChannel, _super);
                function PresenceChannel(name, pusher) {
                  var _this = _super.call(this, name, pusher) || this;
                  _this.members = new members();
                  return _this;
                }
                PresenceChannel.prototype.authorize = function(socketId, callback) {
                  var _this = this;
                  _super.prototype.authorize.call(this, socketId, function(error, authData) {
                    return __awaiter(_this, void 0, void 0, function() {
                      var channelData, suffix;
                      return __generator(this, function(_a) {
                        switch (_a.label) {
                          case 0:
                            if (!!error) return [3, 3];
                            authData = authData;
                            if (!(authData.channel_data != null)) return [3, 1];
                            channelData = JSON.parse(authData.channel_data);
                            this.members.setMyID(channelData.user_id);
                            return [3, 3];
                          case 1:
                            return [4, this.pusher.user.signinDonePromise];
                          case 2:
                            _a.sent();
                            if (this.pusher.user.user_data != null) {
                              this.members.setMyID(this.pusher.user.user_data.id);
                            } else {
                              suffix = url_store.buildLogSuffix("authorizationEndpoint");
                              logger.error("Invalid auth response for channel '" + this.name + "', " + ("expected 'channel_data' field. " + suffix + ", ") + "or the user should be signed in.");
                              callback("Invalid auth response");
                              return [2];
                            }
                            _a.label = 3;
                          case 3:
                            callback(error, authData);
                            return [2];
                        }
                      });
                    });
                  });
                };
                PresenceChannel.prototype.handleEvent = function(event) {
                  var eventName = event.event;
                  if (eventName.indexOf("pusher_internal:") === 0) {
                    this.handleInternalEvent(event);
                  } else {
                    var data = event.data;
                    var metadata = {};
                    if (event.user_id) {
                      metadata.user_id = event.user_id;
                    }
                    this.emit(eventName, data, metadata);
                  }
                };
                PresenceChannel.prototype.handleInternalEvent = function(event) {
                  var eventName = event.event;
                  var data = event.data;
                  switch (eventName) {
                    case "pusher_internal:subscription_succeeded":
                      this.handleSubscriptionSucceededEvent(event);
                      break;
                    case "pusher_internal:subscription_count":
                      this.handleSubscriptionCountEvent(event);
                      break;
                    case "pusher_internal:member_added":
                      var addedMember = this.members.addMember(data);
                      this.emit("pusher:member_added", addedMember);
                      break;
                    case "pusher_internal:member_removed":
                      var removedMember = this.members.removeMember(data);
                      if (removedMember) {
                        this.emit("pusher:member_removed", removedMember);
                      }
                      break;
                  }
                };
                PresenceChannel.prototype.handleSubscriptionSucceededEvent = function(event) {
                  this.subscriptionPending = false;
                  this.subscribed = true;
                  if (this.subscriptionCancelled) {
                    this.pusher.unsubscribe(this.name);
                  } else {
                    this.members.onSubscription(event.data);
                    this.emit("pusher:subscription_succeeded", this.members);
                  }
                };
                PresenceChannel.prototype.disconnect = function() {
                  this.members.reset();
                  _super.prototype.disconnect.call(this);
                };
                return PresenceChannel;
              }(private_channel);
              var presence_channel = presence_channel_PresenceChannel;
              var utf8 = __webpack_require__(1);
              var base64 = __webpack_require__(0);
              var encrypted_channel_extends = /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              var encrypted_channel_EncryptedChannel = function(_super) {
                encrypted_channel_extends(EncryptedChannel, _super);
                function EncryptedChannel(name, pusher, nacl) {
                  var _this = _super.call(this, name, pusher) || this;
                  _this.key = null;
                  _this.nacl = nacl;
                  return _this;
                }
                EncryptedChannel.prototype.authorize = function(socketId, callback) {
                  var _this = this;
                  _super.prototype.authorize.call(this, socketId, function(error, authData) {
                    if (error) {
                      callback(error, authData);
                      return;
                    }
                    var sharedSecret = authData["shared_secret"];
                    if (!sharedSecret) {
                      callback(new Error("No shared_secret key in auth payload for encrypted channel: " + _this.name), null);
                      return;
                    }
                    _this.key = Object(base64["decode"])(sharedSecret);
                    delete authData["shared_secret"];
                    callback(null, authData);
                  });
                };
                EncryptedChannel.prototype.trigger = function(event, data) {
                  throw new UnsupportedFeature("Client events are not currently supported for encrypted channels");
                };
                EncryptedChannel.prototype.handleEvent = function(event) {
                  var eventName = event.event;
                  var data = event.data;
                  if (eventName.indexOf("pusher_internal:") === 0 || eventName.indexOf("pusher:") === 0) {
                    _super.prototype.handleEvent.call(this, event);
                    return;
                  }
                  this.handleEncryptedEvent(eventName, data);
                };
                EncryptedChannel.prototype.handleEncryptedEvent = function(event, data) {
                  var _this = this;
                  if (!this.key) {
                    logger.debug("Received encrypted event before key has been retrieved from the authEndpoint");
                    return;
                  }
                  if (!data.ciphertext || !data.nonce) {
                    logger.error("Unexpected format for encrypted event, expected object with `ciphertext` and `nonce` fields, got: " + data);
                    return;
                  }
                  var cipherText = Object(base64["decode"])(data.ciphertext);
                  if (cipherText.length < this.nacl.secretbox.overheadLength) {
                    logger.error("Expected encrypted event ciphertext length to be " + this.nacl.secretbox.overheadLength + ", got: " + cipherText.length);
                    return;
                  }
                  var nonce = Object(base64["decode"])(data.nonce);
                  if (nonce.length < this.nacl.secretbox.nonceLength) {
                    logger.error("Expected encrypted event nonce length to be " + this.nacl.secretbox.nonceLength + ", got: " + nonce.length);
                    return;
                  }
                  var bytes = this.nacl.secretbox.open(cipherText, nonce, this.key);
                  if (bytes === null) {
                    logger.debug("Failed to decrypt an event, probably because it was encrypted with a different key. Fetching a new key from the authEndpoint...");
                    this.authorize(this.pusher.connection.socket_id, function(error, authData) {
                      if (error) {
                        logger.error("Failed to make a request to the authEndpoint: " + authData + ". Unable to fetch new key, so dropping encrypted event");
                        return;
                      }
                      bytes = _this.nacl.secretbox.open(cipherText, nonce, _this.key);
                      if (bytes === null) {
                        logger.error("Failed to decrypt event with new key. Dropping encrypted event");
                        return;
                      }
                      _this.emit(event, _this.getDataToEmit(bytes));
                      return;
                    });
                    return;
                  }
                  this.emit(event, this.getDataToEmit(bytes));
                };
                EncryptedChannel.prototype.getDataToEmit = function(bytes) {
                  var raw = Object(utf8["decode"])(bytes);
                  try {
                    return JSON.parse(raw);
                  } catch (_a) {
                    return raw;
                  }
                };
                return EncryptedChannel;
              }(private_channel);
              var encrypted_channel = encrypted_channel_EncryptedChannel;
              var connection_manager_extends = /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              var connection_manager_ConnectionManager = function(_super) {
                connection_manager_extends(ConnectionManager, _super);
                function ConnectionManager(key, options) {
                  var _this = _super.call(this) || this;
                  _this.state = "initialized";
                  _this.connection = null;
                  _this.key = key;
                  _this.options = options;
                  _this.timeline = _this.options.timeline;
                  _this.usingTLS = _this.options.useTLS;
                  _this.errorCallbacks = _this.buildErrorCallbacks();
                  _this.connectionCallbacks = _this.buildConnectionCallbacks(_this.errorCallbacks);
                  _this.handshakeCallbacks = _this.buildHandshakeCallbacks(_this.errorCallbacks);
                  var Network = runtime.getNetwork();
                  Network.bind("online", function() {
                    _this.timeline.info({ netinfo: "online" });
                    if (_this.state === "connecting" || _this.state === "unavailable") {
                      _this.retryIn(0);
                    }
                  });
                  Network.bind("offline", function() {
                    _this.timeline.info({ netinfo: "offline" });
                    if (_this.connection) {
                      _this.sendActivityCheck();
                    }
                  });
                  _this.updateStrategy();
                  return _this;
                }
                ConnectionManager.prototype.connect = function() {
                  if (this.connection || this.runner) {
                    return;
                  }
                  if (!this.strategy.isSupported()) {
                    this.updateState("failed");
                    return;
                  }
                  this.updateState("connecting");
                  this.startConnecting();
                  this.setUnavailableTimer();
                };
                ConnectionManager.prototype.send = function(data) {
                  if (this.connection) {
                    return this.connection.send(data);
                  } else {
                    return false;
                  }
                };
                ConnectionManager.prototype.send_event = function(name, data, channel) {
                  if (this.connection) {
                    return this.connection.send_event(name, data, channel);
                  } else {
                    return false;
                  }
                };
                ConnectionManager.prototype.disconnect = function() {
                  this.disconnectInternally();
                  this.updateState("disconnected");
                };
                ConnectionManager.prototype.isUsingTLS = function() {
                  return this.usingTLS;
                };
                ConnectionManager.prototype.startConnecting = function() {
                  var _this = this;
                  var callback = function(error, handshake) {
                    if (error) {
                      _this.runner = _this.strategy.connect(0, callback);
                    } else {
                      if (handshake.action === "error") {
                        _this.emit("error", {
                          type: "HandshakeError",
                          error: handshake.error
                        });
                        _this.timeline.error({ handshakeError: handshake.error });
                      } else {
                        _this.abortConnecting();
                        _this.handshakeCallbacks[handshake.action](handshake);
                      }
                    }
                  };
                  this.runner = this.strategy.connect(0, callback);
                };
                ConnectionManager.prototype.abortConnecting = function() {
                  if (this.runner) {
                    this.runner.abort();
                    this.runner = null;
                  }
                };
                ConnectionManager.prototype.disconnectInternally = function() {
                  this.abortConnecting();
                  this.clearRetryTimer();
                  this.clearUnavailableTimer();
                  if (this.connection) {
                    var connection = this.abandonConnection();
                    connection.close();
                  }
                };
                ConnectionManager.prototype.updateStrategy = function() {
                  this.strategy = this.options.getStrategy({
                    key: this.key,
                    timeline: this.timeline,
                    useTLS: this.usingTLS
                  });
                };
                ConnectionManager.prototype.retryIn = function(delay) {
                  var _this = this;
                  this.timeline.info({ action: "retry", delay });
                  if (delay > 0) {
                    this.emit("connecting_in", Math.round(delay / 1e3));
                  }
                  this.retryTimer = new OneOffTimer(delay || 0, function() {
                    _this.disconnectInternally();
                    _this.connect();
                  });
                };
                ConnectionManager.prototype.clearRetryTimer = function() {
                  if (this.retryTimer) {
                    this.retryTimer.ensureAborted();
                    this.retryTimer = null;
                  }
                };
                ConnectionManager.prototype.setUnavailableTimer = function() {
                  var _this = this;
                  this.unavailableTimer = new OneOffTimer(this.options.unavailableTimeout, function() {
                    _this.updateState("unavailable");
                  });
                };
                ConnectionManager.prototype.clearUnavailableTimer = function() {
                  if (this.unavailableTimer) {
                    this.unavailableTimer.ensureAborted();
                  }
                };
                ConnectionManager.prototype.sendActivityCheck = function() {
                  var _this = this;
                  this.stopActivityCheck();
                  this.connection.ping();
                  this.activityTimer = new OneOffTimer(this.options.pongTimeout, function() {
                    _this.timeline.error({ pong_timed_out: _this.options.pongTimeout });
                    _this.retryIn(0);
                  });
                };
                ConnectionManager.prototype.resetActivityCheck = function() {
                  var _this = this;
                  this.stopActivityCheck();
                  if (this.connection && !this.connection.handlesActivityChecks()) {
                    this.activityTimer = new OneOffTimer(this.activityTimeout, function() {
                      _this.sendActivityCheck();
                    });
                  }
                };
                ConnectionManager.prototype.stopActivityCheck = function() {
                  if (this.activityTimer) {
                    this.activityTimer.ensureAborted();
                  }
                };
                ConnectionManager.prototype.buildConnectionCallbacks = function(errorCallbacks) {
                  var _this = this;
                  return extend({}, errorCallbacks, {
                    message: function(message) {
                      _this.resetActivityCheck();
                      _this.emit("message", message);
                    },
                    ping: function() {
                      _this.send_event("pusher:pong", {});
                    },
                    activity: function() {
                      _this.resetActivityCheck();
                    },
                    error: function(error) {
                      _this.emit("error", error);
                    },
                    closed: function() {
                      _this.abandonConnection();
                      if (_this.shouldRetry()) {
                        _this.retryIn(1e3);
                      }
                    }
                  });
                };
                ConnectionManager.prototype.buildHandshakeCallbacks = function(errorCallbacks) {
                  var _this = this;
                  return extend({}, errorCallbacks, {
                    connected: function(handshake) {
                      _this.activityTimeout = Math.min(_this.options.activityTimeout, handshake.activityTimeout, handshake.connection.activityTimeout || Infinity);
                      _this.clearUnavailableTimer();
                      _this.setConnection(handshake.connection);
                      _this.socket_id = _this.connection.id;
                      _this.updateState("connected", { socket_id: _this.socket_id });
                    }
                  });
                };
                ConnectionManager.prototype.buildErrorCallbacks = function() {
                  var _this = this;
                  var withErrorEmitted = function(callback) {
                    return function(result) {
                      if (result.error) {
                        _this.emit("error", { type: "WebSocketError", error: result.error });
                      }
                      callback(result);
                    };
                  };
                  return {
                    tls_only: withErrorEmitted(function() {
                      _this.usingTLS = true;
                      _this.updateStrategy();
                      _this.retryIn(0);
                    }),
                    refused: withErrorEmitted(function() {
                      _this.disconnect();
                    }),
                    backoff: withErrorEmitted(function() {
                      _this.retryIn(1e3);
                    }),
                    retry: withErrorEmitted(function() {
                      _this.retryIn(0);
                    })
                  };
                };
                ConnectionManager.prototype.setConnection = function(connection) {
                  this.connection = connection;
                  for (var event in this.connectionCallbacks) {
                    this.connection.bind(event, this.connectionCallbacks[event]);
                  }
                  this.resetActivityCheck();
                };
                ConnectionManager.prototype.abandonConnection = function() {
                  if (!this.connection) {
                    return;
                  }
                  this.stopActivityCheck();
                  for (var event in this.connectionCallbacks) {
                    this.connection.unbind(event, this.connectionCallbacks[event]);
                  }
                  var connection = this.connection;
                  this.connection = null;
                  return connection;
                };
                ConnectionManager.prototype.updateState = function(newState, data) {
                  var previousState = this.state;
                  this.state = newState;
                  if (previousState !== newState) {
                    var newStateDescription = newState;
                    if (newStateDescription === "connected") {
                      newStateDescription += " with new socket ID " + data.socket_id;
                    }
                    logger.debug("State changed", previousState + " -> " + newStateDescription);
                    this.timeline.info({ state: newState, params: data });
                    this.emit("state_change", { previous: previousState, current: newState });
                    this.emit(newState, data);
                  }
                };
                ConnectionManager.prototype.shouldRetry = function() {
                  return this.state === "connecting" || this.state === "connected";
                };
                return ConnectionManager;
              }(dispatcher);
              var connection_manager = connection_manager_ConnectionManager;
              var channels_Channels = function() {
                function Channels() {
                  this.channels = {};
                }
                Channels.prototype.add = function(name, pusher) {
                  if (!this.channels[name]) {
                    this.channels[name] = createChannel(name, pusher);
                  }
                  return this.channels[name];
                };
                Channels.prototype.all = function() {
                  return values(this.channels);
                };
                Channels.prototype.find = function(name) {
                  return this.channels[name];
                };
                Channels.prototype.remove = function(name) {
                  var channel = this.channels[name];
                  delete this.channels[name];
                  return channel;
                };
                Channels.prototype.disconnect = function() {
                  objectApply(this.channels, function(channel) {
                    channel.disconnect();
                  });
                };
                return Channels;
              }();
              var channels = channels_Channels;
              function createChannel(name, pusher) {
                if (name.indexOf("private-encrypted-") === 0) {
                  if (pusher.config.nacl) {
                    return factory.createEncryptedChannel(name, pusher, pusher.config.nacl);
                  }
                  var errMsg = "Tried to subscribe to a private-encrypted- channel but no nacl implementation available";
                  var suffix = url_store.buildLogSuffix("encryptedChannelSupport");
                  throw new UnsupportedFeature(errMsg + ". " + suffix);
                } else if (name.indexOf("private-") === 0) {
                  return factory.createPrivateChannel(name, pusher);
                } else if (name.indexOf("presence-") === 0) {
                  return factory.createPresenceChannel(name, pusher);
                } else if (name.indexOf("#") === 0) {
                  throw new BadChannelName('Cannot create a channel with name "' + name + '".');
                } else {
                  return factory.createChannel(name, pusher);
                }
              }
              var Factory = {
                createChannels: function() {
                  return new channels();
                },
                createConnectionManager: function(key, options) {
                  return new connection_manager(key, options);
                },
                createChannel: function(name, pusher) {
                  return new channels_channel(name, pusher);
                },
                createPrivateChannel: function(name, pusher) {
                  return new private_channel(name, pusher);
                },
                createPresenceChannel: function(name, pusher) {
                  return new presence_channel(name, pusher);
                },
                createEncryptedChannel: function(name, pusher, nacl) {
                  return new encrypted_channel(name, pusher, nacl);
                },
                createTimelineSender: function(timeline, options) {
                  return new timeline_sender(timeline, options);
                },
                createHandshake: function(transport, callback) {
                  return new connection_handshake(transport, callback);
                },
                createAssistantToTheTransportManager: function(manager, transport, options) {
                  return new assistant_to_the_transport_manager(manager, transport, options);
                }
              };
              var factory = Factory;
              var transport_manager_TransportManager = function() {
                function TransportManager(options) {
                  this.options = options || {};
                  this.livesLeft = this.options.lives || Infinity;
                }
                TransportManager.prototype.getAssistant = function(transport) {
                  return factory.createAssistantToTheTransportManager(this, transport, {
                    minPingDelay: this.options.minPingDelay,
                    maxPingDelay: this.options.maxPingDelay
                  });
                };
                TransportManager.prototype.isAlive = function() {
                  return this.livesLeft > 0;
                };
                TransportManager.prototype.reportDeath = function() {
                  this.livesLeft -= 1;
                };
                return TransportManager;
              }();
              var transport_manager = transport_manager_TransportManager;
              var sequential_strategy_SequentialStrategy = function() {
                function SequentialStrategy(strategies, options) {
                  this.strategies = strategies;
                  this.loop = Boolean(options.loop);
                  this.failFast = Boolean(options.failFast);
                  this.timeout = options.timeout;
                  this.timeoutLimit = options.timeoutLimit;
                }
                SequentialStrategy.prototype.isSupported = function() {
                  return any(this.strategies, util.method("isSupported"));
                };
                SequentialStrategy.prototype.connect = function(minPriority, callback) {
                  var _this = this;
                  var strategies = this.strategies;
                  var current = 0;
                  var timeout = this.timeout;
                  var runner = null;
                  var tryNextStrategy = function(error, handshake) {
                    if (handshake) {
                      callback(null, handshake);
                    } else {
                      current = current + 1;
                      if (_this.loop) {
                        current = current % strategies.length;
                      }
                      if (current < strategies.length) {
                        if (timeout) {
                          timeout = timeout * 2;
                          if (_this.timeoutLimit) {
                            timeout = Math.min(timeout, _this.timeoutLimit);
                          }
                        }
                        runner = _this.tryStrategy(strategies[current], minPriority, { timeout, failFast: _this.failFast }, tryNextStrategy);
                      } else {
                        callback(true);
                      }
                    }
                  };
                  runner = this.tryStrategy(strategies[current], minPriority, { timeout, failFast: this.failFast }, tryNextStrategy);
                  return {
                    abort: function() {
                      runner.abort();
                    },
                    forceMinPriority: function(p) {
                      minPriority = p;
                      if (runner) {
                        runner.forceMinPriority(p);
                      }
                    }
                  };
                };
                SequentialStrategy.prototype.tryStrategy = function(strategy, minPriority, options, callback) {
                  var timer = null;
                  var runner = null;
                  if (options.timeout > 0) {
                    timer = new OneOffTimer(options.timeout, function() {
                      runner.abort();
                      callback(true);
                    });
                  }
                  runner = strategy.connect(minPriority, function(error, handshake) {
                    if (error && timer && timer.isRunning() && !options.failFast) {
                      return;
                    }
                    if (timer) {
                      timer.ensureAborted();
                    }
                    callback(error, handshake);
                  });
                  return {
                    abort: function() {
                      if (timer) {
                        timer.ensureAborted();
                      }
                      runner.abort();
                    },
                    forceMinPriority: function(p) {
                      runner.forceMinPriority(p);
                    }
                  };
                };
                return SequentialStrategy;
              }();
              var sequential_strategy = sequential_strategy_SequentialStrategy;
              var best_connected_ever_strategy_BestConnectedEverStrategy = function() {
                function BestConnectedEverStrategy(strategies) {
                  this.strategies = strategies;
                }
                BestConnectedEverStrategy.prototype.isSupported = function() {
                  return any(this.strategies, util.method("isSupported"));
                };
                BestConnectedEverStrategy.prototype.connect = function(minPriority, callback) {
                  return connect(this.strategies, minPriority, function(i, runners) {
                    return function(error, handshake) {
                      runners[i].error = error;
                      if (error) {
                        if (allRunnersFailed(runners)) {
                          callback(true);
                        }
                        return;
                      }
                      apply(runners, function(runner) {
                        runner.forceMinPriority(handshake.transport.priority);
                      });
                      callback(null, handshake);
                    };
                  });
                };
                return BestConnectedEverStrategy;
              }();
              var best_connected_ever_strategy = best_connected_ever_strategy_BestConnectedEverStrategy;
              function connect(strategies, minPriority, callbackBuilder) {
                var runners = map(strategies, function(strategy, i, _, rs) {
                  return strategy.connect(minPriority, callbackBuilder(i, rs));
                });
                return {
                  abort: function() {
                    apply(runners, abortRunner);
                  },
                  forceMinPriority: function(p) {
                    apply(runners, function(runner) {
                      runner.forceMinPriority(p);
                    });
                  }
                };
              }
              function allRunnersFailed(runners) {
                return collections_all(runners, function(runner) {
                  return Boolean(runner.error);
                });
              }
              function abortRunner(runner) {
                if (!runner.error && !runner.aborted) {
                  runner.abort();
                  runner.aborted = true;
                }
              }
              var cached_strategy_CachedStrategy = function() {
                function CachedStrategy(strategy, transports2, options) {
                  this.strategy = strategy;
                  this.transports = transports2;
                  this.ttl = options.ttl || 1800 * 1e3;
                  this.usingTLS = options.useTLS;
                  this.timeline = options.timeline;
                }
                CachedStrategy.prototype.isSupported = function() {
                  return this.strategy.isSupported();
                };
                CachedStrategy.prototype.connect = function(minPriority, callback) {
                  var usingTLS = this.usingTLS;
                  var info = fetchTransportCache(usingTLS);
                  var strategies = [this.strategy];
                  if (info && info.timestamp + this.ttl >= util.now()) {
                    var transport = this.transports[info.transport];
                    if (transport) {
                      this.timeline.info({
                        cached: true,
                        transport: info.transport,
                        latency: info.latency
                      });
                      strategies.push(new sequential_strategy([transport], {
                        timeout: info.latency * 2 + 1e3,
                        failFast: true
                      }));
                    }
                  }
                  var startTimestamp = util.now();
                  var runner = strategies.pop().connect(minPriority, function cb(error, handshake) {
                    if (error) {
                      flushTransportCache(usingTLS);
                      if (strategies.length > 0) {
                        startTimestamp = util.now();
                        runner = strategies.pop().connect(minPriority, cb);
                      } else {
                        callback(error);
                      }
                    } else {
                      storeTransportCache(usingTLS, handshake.transport.name, util.now() - startTimestamp);
                      callback(null, handshake);
                    }
                  });
                  return {
                    abort: function() {
                      runner.abort();
                    },
                    forceMinPriority: function(p) {
                      minPriority = p;
                      if (runner) {
                        runner.forceMinPriority(p);
                      }
                    }
                  };
                };
                return CachedStrategy;
              }();
              var cached_strategy = cached_strategy_CachedStrategy;
              function getTransportCacheKey(usingTLS) {
                return "pusherTransport" + (usingTLS ? "TLS" : "NonTLS");
              }
              function fetchTransportCache(usingTLS) {
                var storage = runtime.getLocalStorage();
                if (storage) {
                  try {
                    var serializedCache = storage[getTransportCacheKey(usingTLS)];
                    if (serializedCache) {
                      return JSON.parse(serializedCache);
                    }
                  } catch (e) {
                    flushTransportCache(usingTLS);
                  }
                }
                return null;
              }
              function storeTransportCache(usingTLS, transport, latency) {
                var storage = runtime.getLocalStorage();
                if (storage) {
                  try {
                    storage[getTransportCacheKey(usingTLS)] = safeJSONStringify({
                      timestamp: util.now(),
                      transport,
                      latency
                    });
                  } catch (e) {
                  }
                }
              }
              function flushTransportCache(usingTLS) {
                var storage = runtime.getLocalStorage();
                if (storage) {
                  try {
                    delete storage[getTransportCacheKey(usingTLS)];
                  } catch (e) {
                  }
                }
              }
              var delayed_strategy_DelayedStrategy = function() {
                function DelayedStrategy(strategy, _a) {
                  var number = _a.delay;
                  this.strategy = strategy;
                  this.options = { delay: number };
                }
                DelayedStrategy.prototype.isSupported = function() {
                  return this.strategy.isSupported();
                };
                DelayedStrategy.prototype.connect = function(minPriority, callback) {
                  var strategy = this.strategy;
                  var runner;
                  var timer = new OneOffTimer(this.options.delay, function() {
                    runner = strategy.connect(minPriority, callback);
                  });
                  return {
                    abort: function() {
                      timer.ensureAborted();
                      if (runner) {
                        runner.abort();
                      }
                    },
                    forceMinPriority: function(p) {
                      minPriority = p;
                      if (runner) {
                        runner.forceMinPriority(p);
                      }
                    }
                  };
                };
                return DelayedStrategy;
              }();
              var delayed_strategy = delayed_strategy_DelayedStrategy;
              var IfStrategy = function() {
                function IfStrategy2(test, trueBranch, falseBranch) {
                  this.test = test;
                  this.trueBranch = trueBranch;
                  this.falseBranch = falseBranch;
                }
                IfStrategy2.prototype.isSupported = function() {
                  var branch = this.test() ? this.trueBranch : this.falseBranch;
                  return branch.isSupported();
                };
                IfStrategy2.prototype.connect = function(minPriority, callback) {
                  var branch = this.test() ? this.trueBranch : this.falseBranch;
                  return branch.connect(minPriority, callback);
                };
                return IfStrategy2;
              }();
              var if_strategy = IfStrategy;
              var FirstConnectedStrategy = function() {
                function FirstConnectedStrategy2(strategy) {
                  this.strategy = strategy;
                }
                FirstConnectedStrategy2.prototype.isSupported = function() {
                  return this.strategy.isSupported();
                };
                FirstConnectedStrategy2.prototype.connect = function(minPriority, callback) {
                  var runner = this.strategy.connect(minPriority, function(error, handshake) {
                    if (handshake) {
                      runner.abort();
                    }
                    callback(error, handshake);
                  });
                  return runner;
                };
                return FirstConnectedStrategy2;
              }();
              var first_connected_strategy = FirstConnectedStrategy;
              function testSupportsStrategy(strategy) {
                return function() {
                  return strategy.isSupported();
                };
              }
              var getDefaultStrategy = function(config, baseOptions, defineTransport) {
                var definedTransports = {};
                function defineTransportStrategy(name, type, priority, options, manager) {
                  var transport = defineTransport(config, name, type, priority, options, manager);
                  definedTransports[name] = transport;
                  return transport;
                }
                var ws_options = Object.assign({}, baseOptions, {
                  hostNonTLS: config.wsHost + ":" + config.wsPort,
                  hostTLS: config.wsHost + ":" + config.wssPort,
                  httpPath: config.wsPath
                });
                var wss_options = Object.assign({}, ws_options, {
                  useTLS: true
                });
                var sockjs_options = Object.assign({}, baseOptions, {
                  hostNonTLS: config.httpHost + ":" + config.httpPort,
                  hostTLS: config.httpHost + ":" + config.httpsPort,
                  httpPath: config.httpPath
                });
                var timeouts = {
                  loop: true,
                  timeout: 15e3,
                  timeoutLimit: 6e4
                };
                var ws_manager = new transport_manager({
                  lives: 2,
                  minPingDelay: 1e4,
                  maxPingDelay: config.activityTimeout
                });
                var streaming_manager = new transport_manager({
                  lives: 2,
                  minPingDelay: 1e4,
                  maxPingDelay: config.activityTimeout
                });
                var ws_transport = defineTransportStrategy("ws", "ws", 3, ws_options, ws_manager);
                var wss_transport = defineTransportStrategy("wss", "ws", 3, wss_options, ws_manager);
                var sockjs_transport = defineTransportStrategy("sockjs", "sockjs", 1, sockjs_options);
                var xhr_streaming_transport = defineTransportStrategy("xhr_streaming", "xhr_streaming", 1, sockjs_options, streaming_manager);
                var xdr_streaming_transport = defineTransportStrategy("xdr_streaming", "xdr_streaming", 1, sockjs_options, streaming_manager);
                var xhr_polling_transport = defineTransportStrategy("xhr_polling", "xhr_polling", 1, sockjs_options);
                var xdr_polling_transport = defineTransportStrategy("xdr_polling", "xdr_polling", 1, sockjs_options);
                var ws_loop = new sequential_strategy([ws_transport], timeouts);
                var wss_loop = new sequential_strategy([wss_transport], timeouts);
                var sockjs_loop = new sequential_strategy([sockjs_transport], timeouts);
                var streaming_loop = new sequential_strategy([
                  new if_strategy(testSupportsStrategy(xhr_streaming_transport), xhr_streaming_transport, xdr_streaming_transport)
                ], timeouts);
                var polling_loop = new sequential_strategy([
                  new if_strategy(testSupportsStrategy(xhr_polling_transport), xhr_polling_transport, xdr_polling_transport)
                ], timeouts);
                var http_loop = new sequential_strategy([
                  new if_strategy(testSupportsStrategy(streaming_loop), new best_connected_ever_strategy([
                    streaming_loop,
                    new delayed_strategy(polling_loop, { delay: 4e3 })
                  ]), polling_loop)
                ], timeouts);
                var http_fallback_loop = new if_strategy(testSupportsStrategy(http_loop), http_loop, sockjs_loop);
                var wsStrategy;
                if (baseOptions.useTLS) {
                  wsStrategy = new best_connected_ever_strategy([
                    ws_loop,
                    new delayed_strategy(http_fallback_loop, { delay: 2e3 })
                  ]);
                } else {
                  wsStrategy = new best_connected_ever_strategy([
                    ws_loop,
                    new delayed_strategy(wss_loop, { delay: 2e3 }),
                    new delayed_strategy(http_fallback_loop, { delay: 5e3 })
                  ]);
                }
                return new cached_strategy(new first_connected_strategy(new if_strategy(testSupportsStrategy(ws_transport), wsStrategy, http_fallback_loop)), definedTransports, {
                  ttl: 18e5,
                  timeline: baseOptions.timeline,
                  useTLS: baseOptions.useTLS
                });
              };
              var default_strategy = getDefaultStrategy;
              var transport_connection_initializer = function() {
                var self = this;
                self.timeline.info(self.buildTimelineMessage({
                  transport: self.name + (self.options.useTLS ? "s" : "")
                }));
                if (self.hooks.isInitialized()) {
                  self.changeState("initialized");
                } else if (self.hooks.file) {
                  self.changeState("initializing");
                  Dependencies.load(self.hooks.file, { useTLS: self.options.useTLS }, function(error, callback) {
                    if (self.hooks.isInitialized()) {
                      self.changeState("initialized");
                      callback(true);
                    } else {
                      if (error) {
                        self.onError(error);
                      }
                      self.onClose();
                      callback(false);
                    }
                  });
                } else {
                  self.onClose();
                }
              };
              var http_xdomain_request_hooks = {
                getRequest: function(socket) {
                  var xdr = new window.XDomainRequest();
                  xdr.ontimeout = function() {
                    socket.emit("error", new RequestTimedOut());
                    socket.close();
                  };
                  xdr.onerror = function(e) {
                    socket.emit("error", e);
                    socket.close();
                  };
                  xdr.onprogress = function() {
                    if (xdr.responseText && xdr.responseText.length > 0) {
                      socket.onChunk(200, xdr.responseText);
                    }
                  };
                  xdr.onload = function() {
                    if (xdr.responseText && xdr.responseText.length > 0) {
                      socket.onChunk(200, xdr.responseText);
                    }
                    socket.emit("finished", 200);
                    socket.close();
                  };
                  return xdr;
                },
                abortRequest: function(xdr) {
                  xdr.ontimeout = xdr.onerror = xdr.onprogress = xdr.onload = null;
                  xdr.abort();
                }
              };
              var http_xdomain_request = http_xdomain_request_hooks;
              var http_request_extends = /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              var MAX_BUFFER_LENGTH = 256 * 1024;
              var http_request_HTTPRequest = function(_super) {
                http_request_extends(HTTPRequest, _super);
                function HTTPRequest(hooks, method, url) {
                  var _this = _super.call(this) || this;
                  _this.hooks = hooks;
                  _this.method = method;
                  _this.url = url;
                  return _this;
                }
                HTTPRequest.prototype.start = function(payload) {
                  var _this = this;
                  this.position = 0;
                  this.xhr = this.hooks.getRequest(this);
                  this.unloader = function() {
                    _this.close();
                  };
                  runtime.addUnloadListener(this.unloader);
                  this.xhr.open(this.method, this.url, true);
                  if (this.xhr.setRequestHeader) {
                    this.xhr.setRequestHeader("Content-Type", "application/json");
                  }
                  this.xhr.send(payload);
                };
                HTTPRequest.prototype.close = function() {
                  if (this.unloader) {
                    runtime.removeUnloadListener(this.unloader);
                    this.unloader = null;
                  }
                  if (this.xhr) {
                    this.hooks.abortRequest(this.xhr);
                    this.xhr = null;
                  }
                };
                HTTPRequest.prototype.onChunk = function(status, data) {
                  while (true) {
                    var chunk = this.advanceBuffer(data);
                    if (chunk) {
                      this.emit("chunk", { status, data: chunk });
                    } else {
                      break;
                    }
                  }
                  if (this.isBufferTooLong(data)) {
                    this.emit("buffer_too_long");
                  }
                };
                HTTPRequest.prototype.advanceBuffer = function(buffer) {
                  var unreadData = buffer.slice(this.position);
                  var endOfLinePosition = unreadData.indexOf("\n");
                  if (endOfLinePosition !== -1) {
                    this.position += endOfLinePosition + 1;
                    return unreadData.slice(0, endOfLinePosition);
                  } else {
                    return null;
                  }
                };
                HTTPRequest.prototype.isBufferTooLong = function(buffer) {
                  return this.position === buffer.length && buffer.length > MAX_BUFFER_LENGTH;
                };
                return HTTPRequest;
              }(dispatcher);
              var http_request = http_request_HTTPRequest;
              var State;
              (function(State2) {
                State2[State2["CONNECTING"] = 0] = "CONNECTING";
                State2[State2["OPEN"] = 1] = "OPEN";
                State2[State2["CLOSED"] = 3] = "CLOSED";
              })(State || (State = {}));
              var state = State;
              var autoIncrement = 1;
              var http_socket_HTTPSocket = function() {
                function HTTPSocket(hooks, url) {
                  this.hooks = hooks;
                  this.session = randomNumber(1e3) + "/" + randomString(8);
                  this.location = getLocation(url);
                  this.readyState = state.CONNECTING;
                  this.openStream();
                }
                HTTPSocket.prototype.send = function(payload) {
                  return this.sendRaw(JSON.stringify([payload]));
                };
                HTTPSocket.prototype.ping = function() {
                  this.hooks.sendHeartbeat(this);
                };
                HTTPSocket.prototype.close = function(code, reason) {
                  this.onClose(code, reason, true);
                };
                HTTPSocket.prototype.sendRaw = function(payload) {
                  if (this.readyState === state.OPEN) {
                    try {
                      runtime.createSocketRequest("POST", getUniqueURL(getSendURL(this.location, this.session))).start(payload);
                      return true;
                    } catch (e) {
                      return false;
                    }
                  } else {
                    return false;
                  }
                };
                HTTPSocket.prototype.reconnect = function() {
                  this.closeStream();
                  this.openStream();
                };
                HTTPSocket.prototype.onClose = function(code, reason, wasClean) {
                  this.closeStream();
                  this.readyState = state.CLOSED;
                  if (this.onclose) {
                    this.onclose({
                      code,
                      reason,
                      wasClean
                    });
                  }
                };
                HTTPSocket.prototype.onChunk = function(chunk) {
                  if (chunk.status !== 200) {
                    return;
                  }
                  if (this.readyState === state.OPEN) {
                    this.onActivity();
                  }
                  var payload;
                  var type = chunk.data.slice(0, 1);
                  switch (type) {
                    case "o":
                      payload = JSON.parse(chunk.data.slice(1) || "{}");
                      this.onOpen(payload);
                      break;
                    case "a":
                      payload = JSON.parse(chunk.data.slice(1) || "[]");
                      for (var i = 0; i < payload.length; i++) {
                        this.onEvent(payload[i]);
                      }
                      break;
                    case "m":
                      payload = JSON.parse(chunk.data.slice(1) || "null");
                      this.onEvent(payload);
                      break;
                    case "h":
                      this.hooks.onHeartbeat(this);
                      break;
                    case "c":
                      payload = JSON.parse(chunk.data.slice(1) || "[]");
                      this.onClose(payload[0], payload[1], true);
                      break;
                  }
                };
                HTTPSocket.prototype.onOpen = function(options) {
                  if (this.readyState === state.CONNECTING) {
                    if (options && options.hostname) {
                      this.location.base = replaceHost(this.location.base, options.hostname);
                    }
                    this.readyState = state.OPEN;
                    if (this.onopen) {
                      this.onopen();
                    }
                  } else {
                    this.onClose(1006, "Server lost session", true);
                  }
                };
                HTTPSocket.prototype.onEvent = function(event) {
                  if (this.readyState === state.OPEN && this.onmessage) {
                    this.onmessage({ data: event });
                  }
                };
                HTTPSocket.prototype.onActivity = function() {
                  if (this.onactivity) {
                    this.onactivity();
                  }
                };
                HTTPSocket.prototype.onError = function(error) {
                  if (this.onerror) {
                    this.onerror(error);
                  }
                };
                HTTPSocket.prototype.openStream = function() {
                  var _this = this;
                  this.stream = runtime.createSocketRequest("POST", getUniqueURL(this.hooks.getReceiveURL(this.location, this.session)));
                  this.stream.bind("chunk", function(chunk) {
                    _this.onChunk(chunk);
                  });
                  this.stream.bind("finished", function(status) {
                    _this.hooks.onFinished(_this, status);
                  });
                  this.stream.bind("buffer_too_long", function() {
                    _this.reconnect();
                  });
                  try {
                    this.stream.start();
                  } catch (error) {
                    util.defer(function() {
                      _this.onError(error);
                      _this.onClose(1006, "Could not start streaming", false);
                    });
                  }
                };
                HTTPSocket.prototype.closeStream = function() {
                  if (this.stream) {
                    this.stream.unbind_all();
                    this.stream.close();
                    this.stream = null;
                  }
                };
                return HTTPSocket;
              }();
              function getLocation(url) {
                var parts = /([^\?]*)\/*(\??.*)/.exec(url);
                return {
                  base: parts[1],
                  queryString: parts[2]
                };
              }
              function getSendURL(url, session) {
                return url.base + "/" + session + "/xhr_send";
              }
              function getUniqueURL(url) {
                var separator = url.indexOf("?") === -1 ? "?" : "&";
                return url + separator + "t=" + +/* @__PURE__ */ new Date() + "&n=" + autoIncrement++;
              }
              function replaceHost(url, hostname) {
                var urlParts = /(https?:\/\/)([^\/:]+)((\/|:)?.*)/.exec(url);
                return urlParts[1] + hostname + urlParts[3];
              }
              function randomNumber(max) {
                return runtime.randomInt(max);
              }
              function randomString(length) {
                var result = [];
                for (var i = 0; i < length; i++) {
                  result.push(randomNumber(32).toString(32));
                }
                return result.join("");
              }
              var http_socket = http_socket_HTTPSocket;
              var http_streaming_socket_hooks = {
                getReceiveURL: function(url, session) {
                  return url.base + "/" + session + "/xhr_streaming" + url.queryString;
                },
                onHeartbeat: function(socket) {
                  socket.sendRaw("[]");
                },
                sendHeartbeat: function(socket) {
                  socket.sendRaw("[]");
                },
                onFinished: function(socket, status) {
                  socket.onClose(1006, "Connection interrupted (" + status + ")", false);
                }
              };
              var http_streaming_socket = http_streaming_socket_hooks;
              var http_polling_socket_hooks = {
                getReceiveURL: function(url, session) {
                  return url.base + "/" + session + "/xhr" + url.queryString;
                },
                onHeartbeat: function() {
                },
                sendHeartbeat: function(socket) {
                  socket.sendRaw("[]");
                },
                onFinished: function(socket, status) {
                  if (status === 200) {
                    socket.reconnect();
                  } else {
                    socket.onClose(1006, "Connection interrupted (" + status + ")", false);
                  }
                }
              };
              var http_polling_socket = http_polling_socket_hooks;
              var http_xhr_request_hooks = {
                getRequest: function(socket) {
                  var Constructor = runtime.getXHRAPI();
                  var xhr = new Constructor();
                  xhr.onreadystatechange = xhr.onprogress = function() {
                    switch (xhr.readyState) {
                      case 3:
                        if (xhr.responseText && xhr.responseText.length > 0) {
                          socket.onChunk(xhr.status, xhr.responseText);
                        }
                        break;
                      case 4:
                        if (xhr.responseText && xhr.responseText.length > 0) {
                          socket.onChunk(xhr.status, xhr.responseText);
                        }
                        socket.emit("finished", xhr.status);
                        socket.close();
                        break;
                    }
                  };
                  return xhr;
                },
                abortRequest: function(xhr) {
                  xhr.onreadystatechange = null;
                  xhr.abort();
                }
              };
              var http_xhr_request = http_xhr_request_hooks;
              var HTTP = {
                createStreamingSocket: function(url) {
                  return this.createSocket(http_streaming_socket, url);
                },
                createPollingSocket: function(url) {
                  return this.createSocket(http_polling_socket, url);
                },
                createSocket: function(hooks, url) {
                  return new http_socket(hooks, url);
                },
                createXHR: function(method, url) {
                  return this.createRequest(http_xhr_request, method, url);
                },
                createRequest: function(hooks, method, url) {
                  return new http_request(hooks, method, url);
                }
              };
              var http_http = HTTP;
              http_http.createXDR = function(method, url) {
                return this.createRequest(http_xdomain_request, method, url);
              };
              var web_http_http = http_http;
              var Runtime = {
                nextAuthCallbackID: 1,
                auth_callbacks: {},
                ScriptReceivers,
                DependenciesReceivers,
                getDefaultStrategy: default_strategy,
                Transports: transports_transports,
                transportConnectionInitializer: transport_connection_initializer,
                HTTPFactory: web_http_http,
                TimelineTransport: jsonp_timeline,
                getXHRAPI: function() {
                  return window.XMLHttpRequest;
                },
                getWebSocketAPI: function() {
                  return window.WebSocket || window.MozWebSocket;
                },
                setup: function(PusherClass) {
                  var _this = this;
                  window.Pusher = PusherClass;
                  var initializeOnDocumentBody = function() {
                    _this.onDocumentBody(PusherClass.ready);
                  };
                  if (!window.JSON) {
                    Dependencies.load("json2", {}, initializeOnDocumentBody);
                  } else {
                    initializeOnDocumentBody();
                  }
                },
                getDocument: function() {
                  return document;
                },
                getProtocol: function() {
                  return this.getDocument().location.protocol;
                },
                getAuthorizers: function() {
                  return { ajax: xhr_auth, jsonp: jsonp_auth };
                },
                onDocumentBody: function(callback) {
                  var _this = this;
                  if (document.body) {
                    callback();
                  } else {
                    setTimeout(function() {
                      _this.onDocumentBody(callback);
                    }, 0);
                  }
                },
                createJSONPRequest: function(url, data) {
                  return new jsonp_request(url, data);
                },
                createScriptRequest: function(src) {
                  return new script_request(src);
                },
                getLocalStorage: function() {
                  try {
                    return window.localStorage;
                  } catch (e) {
                    return void 0;
                  }
                },
                createXHR: function() {
                  if (this.getXHRAPI()) {
                    return this.createXMLHttpRequest();
                  } else {
                    return this.createMicrosoftXHR();
                  }
                },
                createXMLHttpRequest: function() {
                  var Constructor = this.getXHRAPI();
                  return new Constructor();
                },
                createMicrosoftXHR: function() {
                  return new ActiveXObject("Microsoft.XMLHTTP");
                },
                getNetwork: function() {
                  return net_info_Network;
                },
                createWebSocket: function(url) {
                  var Constructor = this.getWebSocketAPI();
                  return new Constructor(url);
                },
                createSocketRequest: function(method, url) {
                  if (this.isXHRSupported()) {
                    return this.HTTPFactory.createXHR(method, url);
                  } else if (this.isXDRSupported(url.indexOf("https:") === 0)) {
                    return this.HTTPFactory.createXDR(method, url);
                  } else {
                    throw "Cross-origin HTTP requests are not supported";
                  }
                },
                isXHRSupported: function() {
                  var Constructor = this.getXHRAPI();
                  return Boolean(Constructor) && new Constructor().withCredentials !== void 0;
                },
                isXDRSupported: function(useTLS) {
                  var protocol = useTLS ? "https:" : "http:";
                  var documentProtocol = this.getProtocol();
                  return Boolean(window["XDomainRequest"]) && documentProtocol === protocol;
                },
                addUnloadListener: function(listener) {
                  if (window.addEventListener !== void 0) {
                    window.addEventListener("unload", listener, false);
                  } else if (window.attachEvent !== void 0) {
                    window.attachEvent("onunload", listener);
                  }
                },
                removeUnloadListener: function(listener) {
                  if (window.addEventListener !== void 0) {
                    window.removeEventListener("unload", listener, false);
                  } else if (window.detachEvent !== void 0) {
                    window.detachEvent("onunload", listener);
                  }
                },
                randomInt: function(max) {
                  var random = function() {
                    var crypto = window.crypto || window["msCrypto"];
                    var random2 = crypto.getRandomValues(new Uint32Array(1))[0];
                    return random2 / Math.pow(2, 32);
                  };
                  return Math.floor(random() * max);
                }
              };
              var runtime = Runtime;
              var TimelineLevel;
              (function(TimelineLevel2) {
                TimelineLevel2[TimelineLevel2["ERROR"] = 3] = "ERROR";
                TimelineLevel2[TimelineLevel2["INFO"] = 6] = "INFO";
                TimelineLevel2[TimelineLevel2["DEBUG"] = 7] = "DEBUG";
              })(TimelineLevel || (TimelineLevel = {}));
              var timeline_level = TimelineLevel;
              var timeline_Timeline = function() {
                function Timeline(key, session, options) {
                  this.key = key;
                  this.session = session;
                  this.events = [];
                  this.options = options || {};
                  this.sent = 0;
                  this.uniqueID = 0;
                }
                Timeline.prototype.log = function(level, event) {
                  if (level <= this.options.level) {
                    this.events.push(extend({}, event, { timestamp: util.now() }));
                    if (this.options.limit && this.events.length > this.options.limit) {
                      this.events.shift();
                    }
                  }
                };
                Timeline.prototype.error = function(event) {
                  this.log(timeline_level.ERROR, event);
                };
                Timeline.prototype.info = function(event) {
                  this.log(timeline_level.INFO, event);
                };
                Timeline.prototype.debug = function(event) {
                  this.log(timeline_level.DEBUG, event);
                };
                Timeline.prototype.isEmpty = function() {
                  return this.events.length === 0;
                };
                Timeline.prototype.send = function(sendfn, callback) {
                  var _this = this;
                  var data = extend({
                    session: this.session,
                    bundle: this.sent + 1,
                    key: this.key,
                    lib: "js",
                    version: this.options.version,
                    cluster: this.options.cluster,
                    features: this.options.features,
                    timeline: this.events
                  }, this.options.params);
                  this.events = [];
                  sendfn(data, function(error, result) {
                    if (!error) {
                      _this.sent++;
                    }
                    if (callback) {
                      callback(error, result);
                    }
                  });
                  return true;
                };
                Timeline.prototype.generateUniqueID = function() {
                  this.uniqueID++;
                  return this.uniqueID;
                };
                return Timeline;
              }();
              var timeline_timeline = timeline_Timeline;
              var transport_strategy_TransportStrategy = function() {
                function TransportStrategy(name, priority, transport, options) {
                  this.name = name;
                  this.priority = priority;
                  this.transport = transport;
                  this.options = options || {};
                }
                TransportStrategy.prototype.isSupported = function() {
                  return this.transport.isSupported({
                    useTLS: this.options.useTLS
                  });
                };
                TransportStrategy.prototype.connect = function(minPriority, callback) {
                  var _this = this;
                  if (!this.isSupported()) {
                    return failAttempt(new UnsupportedStrategy(), callback);
                  } else if (this.priority < minPriority) {
                    return failAttempt(new TransportPriorityTooLow(), callback);
                  }
                  var connected = false;
                  var transport = this.transport.createConnection(this.name, this.priority, this.options.key, this.options);
                  var handshake = null;
                  var onInitialized = function() {
                    transport.unbind("initialized", onInitialized);
                    transport.connect();
                  };
                  var onOpen = function() {
                    handshake = factory.createHandshake(transport, function(result) {
                      connected = true;
                      unbindListeners();
                      callback(null, result);
                    });
                  };
                  var onError = function(error) {
                    unbindListeners();
                    callback(error);
                  };
                  var onClosed = function() {
                    unbindListeners();
                    var serializedTransport;
                    serializedTransport = safeJSONStringify(transport);
                    callback(new TransportClosed(serializedTransport));
                  };
                  var unbindListeners = function() {
                    transport.unbind("initialized", onInitialized);
                    transport.unbind("open", onOpen);
                    transport.unbind("error", onError);
                    transport.unbind("closed", onClosed);
                  };
                  transport.bind("initialized", onInitialized);
                  transport.bind("open", onOpen);
                  transport.bind("error", onError);
                  transport.bind("closed", onClosed);
                  transport.initialize();
                  return {
                    abort: function() {
                      if (connected) {
                        return;
                      }
                      unbindListeners();
                      if (handshake) {
                        handshake.close();
                      } else {
                        transport.close();
                      }
                    },
                    forceMinPriority: function(p) {
                      if (connected) {
                        return;
                      }
                      if (_this.priority < p) {
                        if (handshake) {
                          handshake.close();
                        } else {
                          transport.close();
                        }
                      }
                    }
                  };
                };
                return TransportStrategy;
              }();
              var transport_strategy = transport_strategy_TransportStrategy;
              function failAttempt(error, callback) {
                util.defer(function() {
                  callback(error);
                });
                return {
                  abort: function() {
                  },
                  forceMinPriority: function() {
                  }
                };
              }
              var strategy_builder_Transports = runtime.Transports;
              var strategy_builder_defineTransport = function(config, name, type, priority, options, manager) {
                var transportClass = strategy_builder_Transports[type];
                if (!transportClass) {
                  throw new UnsupportedTransport(type);
                }
                var enabled = (!config.enabledTransports || arrayIndexOf(config.enabledTransports, name) !== -1) && (!config.disabledTransports || arrayIndexOf(config.disabledTransports, name) === -1);
                var transport;
                if (enabled) {
                  options = Object.assign({ ignoreNullOrigin: config.ignoreNullOrigin }, options);
                  transport = new transport_strategy(name, priority, manager ? manager.getAssistant(transportClass) : transportClass, options);
                } else {
                  transport = strategy_builder_UnsupportedStrategy;
                }
                return transport;
              };
              var strategy_builder_UnsupportedStrategy = {
                isSupported: function() {
                  return false;
                },
                connect: function(_, callback) {
                  var deferred = util.defer(function() {
                    callback(new UnsupportedStrategy());
                  });
                  return {
                    abort: function() {
                      deferred.ensureAborted();
                    },
                    forceMinPriority: function() {
                    }
                  };
                }
              };
              var composeChannelQuery = function(params, authOptions) {
                var query = "socket_id=" + encodeURIComponent(params.socketId);
                for (var key in authOptions.params) {
                  query += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(authOptions.params[key]);
                }
                if (authOptions.paramsProvider != null) {
                  var dynamicParams = authOptions.paramsProvider();
                  for (var key in dynamicParams) {
                    query += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(dynamicParams[key]);
                  }
                }
                return query;
              };
              var UserAuthenticator = function(authOptions) {
                if (typeof runtime.getAuthorizers()[authOptions.transport] === "undefined") {
                  throw "'" + authOptions.transport + "' is not a recognized auth transport";
                }
                return function(params, callback) {
                  var query = composeChannelQuery(params, authOptions);
                  runtime.getAuthorizers()[authOptions.transport](runtime, query, authOptions, AuthRequestType.UserAuthentication, callback);
                };
              };
              var user_authenticator = UserAuthenticator;
              var channel_authorizer_composeChannelQuery = function(params, authOptions) {
                var query = "socket_id=" + encodeURIComponent(params.socketId);
                query += "&channel_name=" + encodeURIComponent(params.channelName);
                for (var key in authOptions.params) {
                  query += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(authOptions.params[key]);
                }
                if (authOptions.paramsProvider != null) {
                  var dynamicParams = authOptions.paramsProvider();
                  for (var key in dynamicParams) {
                    query += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(dynamicParams[key]);
                  }
                }
                return query;
              };
              var ChannelAuthorizer = function(authOptions) {
                if (typeof runtime.getAuthorizers()[authOptions.transport] === "undefined") {
                  throw "'" + authOptions.transport + "' is not a recognized auth transport";
                }
                return function(params, callback) {
                  var query = channel_authorizer_composeChannelQuery(params, authOptions);
                  runtime.getAuthorizers()[authOptions.transport](runtime, query, authOptions, AuthRequestType.ChannelAuthorization, callback);
                };
              };
              var channel_authorizer = ChannelAuthorizer;
              var ChannelAuthorizerProxy = function(pusher, authOptions, channelAuthorizerGenerator) {
                var deprecatedAuthorizerOptions = {
                  authTransport: authOptions.transport,
                  authEndpoint: authOptions.endpoint,
                  auth: {
                    params: authOptions.params,
                    headers: authOptions.headers
                  }
                };
                return function(params, callback) {
                  var channel = pusher.channel(params.channelName);
                  var channelAuthorizer = channelAuthorizerGenerator(channel, deprecatedAuthorizerOptions);
                  channelAuthorizer.authorize(params.socketId, callback);
                };
              };
              var __assign = function() {
                __assign = Object.assign || function(t) {
                  for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                      t[p] = s[p];
                  }
                  return t;
                };
                return __assign.apply(this, arguments);
              };
              function getConfig(opts, pusher) {
                var config = {
                  activityTimeout: opts.activityTimeout || defaults.activityTimeout,
                  cluster: opts.cluster || defaults.cluster,
                  httpPath: opts.httpPath || defaults.httpPath,
                  httpPort: opts.httpPort || defaults.httpPort,
                  httpsPort: opts.httpsPort || defaults.httpsPort,
                  pongTimeout: opts.pongTimeout || defaults.pongTimeout,
                  statsHost: opts.statsHost || defaults.stats_host,
                  unavailableTimeout: opts.unavailableTimeout || defaults.unavailableTimeout,
                  wsPath: opts.wsPath || defaults.wsPath,
                  wsPort: opts.wsPort || defaults.wsPort,
                  wssPort: opts.wssPort || defaults.wssPort,
                  enableStats: getEnableStatsConfig(opts),
                  httpHost: getHttpHost(opts),
                  useTLS: shouldUseTLS(opts),
                  wsHost: getWebsocketHost(opts),
                  userAuthenticator: buildUserAuthenticator(opts),
                  channelAuthorizer: buildChannelAuthorizer(opts, pusher)
                };
                if ("disabledTransports" in opts)
                  config.disabledTransports = opts.disabledTransports;
                if ("enabledTransports" in opts)
                  config.enabledTransports = opts.enabledTransports;
                if ("ignoreNullOrigin" in opts)
                  config.ignoreNullOrigin = opts.ignoreNullOrigin;
                if ("timelineParams" in opts)
                  config.timelineParams = opts.timelineParams;
                if ("nacl" in opts) {
                  config.nacl = opts.nacl;
                }
                return config;
              }
              function getHttpHost(opts) {
                if (opts.httpHost) {
                  return opts.httpHost;
                }
                if (opts.cluster) {
                  return "sockjs-" + opts.cluster + ".pusher.com";
                }
                return defaults.httpHost;
              }
              function getWebsocketHost(opts) {
                if (opts.wsHost) {
                  return opts.wsHost;
                }
                if (opts.cluster) {
                  return getWebsocketHostFromCluster(opts.cluster);
                }
                return getWebsocketHostFromCluster(defaults.cluster);
              }
              function getWebsocketHostFromCluster(cluster) {
                return "ws-" + cluster + ".pusher.com";
              }
              function shouldUseTLS(opts) {
                if (runtime.getProtocol() === "https:") {
                  return true;
                } else if (opts.forceTLS === false) {
                  return false;
                }
                return true;
              }
              function getEnableStatsConfig(opts) {
                if ("enableStats" in opts) {
                  return opts.enableStats;
                }
                if ("disableStats" in opts) {
                  return !opts.disableStats;
                }
                return false;
              }
              function buildUserAuthenticator(opts) {
                var userAuthentication = __assign(__assign({}, defaults.userAuthentication), opts.userAuthentication);
                if ("customHandler" in userAuthentication && userAuthentication["customHandler"] != null) {
                  return userAuthentication["customHandler"];
                }
                return user_authenticator(userAuthentication);
              }
              function buildChannelAuth(opts, pusher) {
                var channelAuthorization;
                if ("channelAuthorization" in opts) {
                  channelAuthorization = __assign(__assign({}, defaults.channelAuthorization), opts.channelAuthorization);
                } else {
                  channelAuthorization = {
                    transport: opts.authTransport || defaults.authTransport,
                    endpoint: opts.authEndpoint || defaults.authEndpoint
                  };
                  if ("auth" in opts) {
                    if ("params" in opts.auth)
                      channelAuthorization.params = opts.auth.params;
                    if ("headers" in opts.auth)
                      channelAuthorization.headers = opts.auth.headers;
                  }
                  if ("authorizer" in opts)
                    channelAuthorization.customHandler = ChannelAuthorizerProxy(pusher, channelAuthorization, opts.authorizer);
                }
                return channelAuthorization;
              }
              function buildChannelAuthorizer(opts, pusher) {
                var channelAuthorization = buildChannelAuth(opts, pusher);
                if ("customHandler" in channelAuthorization && channelAuthorization["customHandler"] != null) {
                  return channelAuthorization["customHandler"];
                }
                return channel_authorizer(channelAuthorization);
              }
              var watchlist_extends = /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              var watchlist_WatchlistFacade = function(_super) {
                watchlist_extends(WatchlistFacade, _super);
                function WatchlistFacade(pusher) {
                  var _this = _super.call(this, function(eventName, data) {
                    logger.debug("No callbacks on watchlist events for " + eventName);
                  }) || this;
                  _this.pusher = pusher;
                  _this.bindWatchlistInternalEvent();
                  return _this;
                }
                WatchlistFacade.prototype.handleEvent = function(pusherEvent) {
                  var _this = this;
                  pusherEvent.data.events.forEach(function(watchlistEvent) {
                    _this.emit(watchlistEvent.name, watchlistEvent);
                  });
                };
                WatchlistFacade.prototype.bindWatchlistInternalEvent = function() {
                  var _this = this;
                  this.pusher.connection.bind("message", function(pusherEvent) {
                    var eventName = pusherEvent.event;
                    if (eventName === "pusher_internal:watchlist_events") {
                      _this.handleEvent(pusherEvent);
                    }
                  });
                };
                return WatchlistFacade;
              }(dispatcher);
              var watchlist = watchlist_WatchlistFacade;
              function flatPromise() {
                var resolve, reject;
                var promise = new Promise(function(res, rej) {
                  resolve = res;
                  reject = rej;
                });
                return { promise, resolve, reject };
              }
              var flat_promise = flatPromise;
              var user_extends = /* @__PURE__ */ function() {
                var extendStatics = function(d, b) {
                  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
                    d2.__proto__ = b2;
                  } || function(d2, b2) {
                    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
                  };
                  return extendStatics(d, b);
                };
                return function(d, b) {
                  extendStatics(d, b);
                  function __() {
                    this.constructor = d;
                  }
                  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
              }();
              var user_UserFacade = function(_super) {
                user_extends(UserFacade, _super);
                function UserFacade(pusher) {
                  var _this = _super.call(this, function(eventName, data) {
                    logger.debug("No callbacks on user for " + eventName);
                  }) || this;
                  _this.signin_requested = false;
                  _this.user_data = null;
                  _this.serverToUserChannel = null;
                  _this.signinDonePromise = null;
                  _this._signinDoneResolve = null;
                  _this._onAuthorize = function(err, authData) {
                    if (err) {
                      logger.warn("Error during signin: " + err);
                      _this._cleanup();
                      return;
                    }
                    _this.pusher.send_event("pusher:signin", {
                      auth: authData.auth,
                      user_data: authData.user_data
                    });
                  };
                  _this.pusher = pusher;
                  _this.pusher.connection.bind("state_change", function(_a) {
                    var previous = _a.previous, current = _a.current;
                    if (previous !== "connected" && current === "connected") {
                      _this._signin();
                    }
                    if (previous === "connected" && current !== "connected") {
                      _this._cleanup();
                      _this._newSigninPromiseIfNeeded();
                    }
                  });
                  _this.watchlist = new watchlist(pusher);
                  _this.pusher.connection.bind("message", function(event) {
                    var eventName = event.event;
                    if (eventName === "pusher:signin_success") {
                      _this._onSigninSuccess(event.data);
                    }
                    if (_this.serverToUserChannel && _this.serverToUserChannel.name === event.channel) {
                      _this.serverToUserChannel.handleEvent(event);
                    }
                  });
                  return _this;
                }
                UserFacade.prototype.signin = function() {
                  if (this.signin_requested) {
                    return;
                  }
                  this.signin_requested = true;
                  this._signin();
                };
                UserFacade.prototype._signin = function() {
                  if (!this.signin_requested) {
                    return;
                  }
                  this._newSigninPromiseIfNeeded();
                  if (this.pusher.connection.state !== "connected") {
                    return;
                  }
                  this.pusher.config.userAuthenticator({
                    socketId: this.pusher.connection.socket_id
                  }, this._onAuthorize);
                };
                UserFacade.prototype._onSigninSuccess = function(data) {
                  try {
                    this.user_data = JSON.parse(data.user_data);
                  } catch (e) {
                    logger.error("Failed parsing user data after signin: " + data.user_data);
                    this._cleanup();
                    return;
                  }
                  if (typeof this.user_data.id !== "string" || this.user_data.id === "") {
                    logger.error("user_data doesn't contain an id. user_data: " + this.user_data);
                    this._cleanup();
                    return;
                  }
                  this._signinDoneResolve();
                  this._subscribeChannels();
                };
                UserFacade.prototype._subscribeChannels = function() {
                  var _this = this;
                  var ensure_subscribed = function(channel) {
                    if (channel.subscriptionPending && channel.subscriptionCancelled) {
                      channel.reinstateSubscription();
                    } else if (!channel.subscriptionPending && _this.pusher.connection.state === "connected") {
                      channel.subscribe();
                    }
                  };
                  this.serverToUserChannel = new channels_channel("#server-to-user-" + this.user_data.id, this.pusher);
                  this.serverToUserChannel.bind_global(function(eventName, data) {
                    if (eventName.indexOf("pusher_internal:") === 0 || eventName.indexOf("pusher:") === 0) {
                      return;
                    }
                    _this.emit(eventName, data);
                  });
                  ensure_subscribed(this.serverToUserChannel);
                };
                UserFacade.prototype._cleanup = function() {
                  this.user_data = null;
                  if (this.serverToUserChannel) {
                    this.serverToUserChannel.unbind_all();
                    this.serverToUserChannel.disconnect();
                    this.serverToUserChannel = null;
                  }
                  if (this.signin_requested) {
                    this._signinDoneResolve();
                  }
                };
                UserFacade.prototype._newSigninPromiseIfNeeded = function() {
                  if (!this.signin_requested) {
                    return;
                  }
                  if (this.signinDonePromise && !this.signinDonePromise.done) {
                    return;
                  }
                  var _a = flat_promise(), promise = _a.promise, resolve = _a.resolve, _ = _a.reject;
                  promise.done = false;
                  var setDone = function() {
                    promise.done = true;
                  };
                  promise.then(setDone)["catch"](setDone);
                  this.signinDonePromise = promise;
                  this._signinDoneResolve = resolve;
                };
                return UserFacade;
              }(dispatcher);
              var user = user_UserFacade;
              var pusher_Pusher = function() {
                function Pusher3(app_key, options) {
                  var _this = this;
                  checkAppKey(app_key);
                  options = options || {};
                  if (!options.cluster && !(options.wsHost || options.httpHost)) {
                    var suffix = url_store.buildLogSuffix("javascriptQuickStart");
                    logger.warn("You should always specify a cluster when connecting. " + suffix);
                  }
                  if ("disableStats" in options) {
                    logger.warn("The disableStats option is deprecated in favor of enableStats");
                  }
                  this.key = app_key;
                  this.config = getConfig(options, this);
                  this.channels = factory.createChannels();
                  this.global_emitter = new dispatcher();
                  this.sessionID = runtime.randomInt(1e9);
                  this.timeline = new timeline_timeline(this.key, this.sessionID, {
                    cluster: this.config.cluster,
                    features: Pusher3.getClientFeatures(),
                    params: this.config.timelineParams || {},
                    limit: 50,
                    level: timeline_level.INFO,
                    version: defaults.VERSION
                  });
                  if (this.config.enableStats) {
                    this.timelineSender = factory.createTimelineSender(this.timeline, {
                      host: this.config.statsHost,
                      path: "/timeline/v2/" + runtime.TimelineTransport.name
                    });
                  }
                  var getStrategy = function(options2) {
                    return runtime.getDefaultStrategy(_this.config, options2, strategy_builder_defineTransport);
                  };
                  this.connection = factory.createConnectionManager(this.key, {
                    getStrategy,
                    timeline: this.timeline,
                    activityTimeout: this.config.activityTimeout,
                    pongTimeout: this.config.pongTimeout,
                    unavailableTimeout: this.config.unavailableTimeout,
                    useTLS: Boolean(this.config.useTLS)
                  });
                  this.connection.bind("connected", function() {
                    _this.subscribeAll();
                    if (_this.timelineSender) {
                      _this.timelineSender.send(_this.connection.isUsingTLS());
                    }
                  });
                  this.connection.bind("message", function(event) {
                    var eventName = event.event;
                    var internal = eventName.indexOf("pusher_internal:") === 0;
                    if (event.channel) {
                      var channel = _this.channel(event.channel);
                      if (channel) {
                        channel.handleEvent(event);
                      }
                    }
                    if (!internal) {
                      _this.global_emitter.emit(event.event, event.data);
                    }
                  });
                  this.connection.bind("connecting", function() {
                    _this.channels.disconnect();
                  });
                  this.connection.bind("disconnected", function() {
                    _this.channels.disconnect();
                  });
                  this.connection.bind("error", function(err) {
                    logger.warn(err);
                  });
                  Pusher3.instances.push(this);
                  this.timeline.info({ instances: Pusher3.instances.length });
                  this.user = new user(this);
                  if (Pusher3.isReady) {
                    this.connect();
                  }
                }
                Pusher3.ready = function() {
                  Pusher3.isReady = true;
                  for (var i = 0, l2 = Pusher3.instances.length; i < l2; i++) {
                    Pusher3.instances[i].connect();
                  }
                };
                Pusher3.getClientFeatures = function() {
                  return keys(filterObject({ ws: runtime.Transports.ws }, function(t) {
                    return t.isSupported({});
                  }));
                };
                Pusher3.prototype.channel = function(name) {
                  return this.channels.find(name);
                };
                Pusher3.prototype.allChannels = function() {
                  return this.channels.all();
                };
                Pusher3.prototype.connect = function() {
                  this.connection.connect();
                  if (this.timelineSender) {
                    if (!this.timelineSenderTimer) {
                      var usingTLS = this.connection.isUsingTLS();
                      var timelineSender = this.timelineSender;
                      this.timelineSenderTimer = new PeriodicTimer(6e4, function() {
                        timelineSender.send(usingTLS);
                      });
                    }
                  }
                };
                Pusher3.prototype.disconnect = function() {
                  this.connection.disconnect();
                  if (this.timelineSenderTimer) {
                    this.timelineSenderTimer.ensureAborted();
                    this.timelineSenderTimer = null;
                  }
                };
                Pusher3.prototype.bind = function(event_name, callback, context) {
                  this.global_emitter.bind(event_name, callback, context);
                  return this;
                };
                Pusher3.prototype.unbind = function(event_name, callback, context) {
                  this.global_emitter.unbind(event_name, callback, context);
                  return this;
                };
                Pusher3.prototype.bind_global = function(callback) {
                  this.global_emitter.bind_global(callback);
                  return this;
                };
                Pusher3.prototype.unbind_global = function(callback) {
                  this.global_emitter.unbind_global(callback);
                  return this;
                };
                Pusher3.prototype.unbind_all = function(callback) {
                  this.global_emitter.unbind_all();
                  return this;
                };
                Pusher3.prototype.subscribeAll = function() {
                  var channelName;
                  for (channelName in this.channels.channels) {
                    if (this.channels.channels.hasOwnProperty(channelName)) {
                      this.subscribe(channelName);
                    }
                  }
                };
                Pusher3.prototype.subscribe = function(channel_name) {
                  var channel = this.channels.add(channel_name, this);
                  if (channel.subscriptionPending && channel.subscriptionCancelled) {
                    channel.reinstateSubscription();
                  } else if (!channel.subscriptionPending && this.connection.state === "connected") {
                    channel.subscribe();
                  }
                  return channel;
                };
                Pusher3.prototype.unsubscribe = function(channel_name) {
                  var channel = this.channels.find(channel_name);
                  if (channel && channel.subscriptionPending) {
                    channel.cancelSubscription();
                  } else {
                    channel = this.channels.remove(channel_name);
                    if (channel && channel.subscribed) {
                      channel.unsubscribe();
                    }
                  }
                };
                Pusher3.prototype.send_event = function(event_name, data, channel) {
                  return this.connection.send_event(event_name, data, channel);
                };
                Pusher3.prototype.shouldUseTLS = function() {
                  return this.config.useTLS;
                };
                Pusher3.prototype.signin = function() {
                  this.user.signin();
                };
                Pusher3.instances = [];
                Pusher3.isReady = false;
                Pusher3.logToConsole = false;
                Pusher3.Runtime = runtime;
                Pusher3.ScriptReceivers = runtime.ScriptReceivers;
                Pusher3.DependenciesReceivers = runtime.DependenciesReceivers;
                Pusher3.auth_callbacks = runtime.auth_callbacks;
                return Pusher3;
              }();
              var core_pusher = __webpack_exports__["default"] = pusher_Pusher;
              function checkAppKey(key) {
                if (key === null || key === void 0) {
                  throw "You must pass your app key when you instantiate Pusher.";
                }
              }
              runtime.setup(pusher_Pusher);
            }
            /******/
          ])
        );
      });
    }
  });

  // node_modules/laravel-echo/dist/echo.js
  function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
      return typeof obj2;
    } : function(obj2) {
      return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  var Channel = /* @__PURE__ */ function() {
    function Channel2() {
      _classCallCheck(this, Channel2);
    }
    _createClass(Channel2, [{
      key: "listenForWhisper",
      value: (
        /**
         * Listen for a whisper event on the channel instance.
         */
        function listenForWhisper(event, callback) {
          return this.listen(".client-" + event, callback);
        }
      )
      /**
       * Listen for an event on the channel instance.
       */
    }, {
      key: "notification",
      value: function notification(callback) {
        return this.listen(".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated", callback);
      }
      /**
       * Stop listening for a whisper event on the channel instance.
       */
    }, {
      key: "stopListeningForWhisper",
      value: function stopListeningForWhisper(event, callback) {
        return this.stopListening(".client-" + event, callback);
      }
    }]);
    return Channel2;
  }();
  var EventFormatter = /* @__PURE__ */ function() {
    function EventFormatter2(namespace) {
      _classCallCheck(this, EventFormatter2);
      this.namespace = namespace;
    }
    _createClass(EventFormatter2, [{
      key: "format",
      value: function format(event) {
        if ([".", "\\"].includes(event.charAt(0))) {
          return event.substring(1);
        } else if (this.namespace) {
          event = this.namespace + "." + event;
        }
        return event.replace(/\./g, "\\");
      }
      /**
       * Set the event namespace.
       */
    }, {
      key: "setNamespace",
      value: function setNamespace(value) {
        this.namespace = value;
      }
    }]);
    return EventFormatter2;
  }();
  function isConstructor(obj) {
    try {
      new obj();
    } catch (err) {
      if (err.message.includes("is not a constructor")) return false;
    }
    return true;
  }
  var PusherChannel = /* @__PURE__ */ function(_Channel) {
    _inherits(PusherChannel2, _Channel);
    var _super = _createSuper(PusherChannel2);
    function PusherChannel2(pusher, name, options) {
      var _this;
      _classCallCheck(this, PusherChannel2);
      _this = _super.call(this);
      _this.name = name;
      _this.pusher = pusher;
      _this.options = options;
      _this.eventFormatter = new EventFormatter(_this.options.namespace);
      _this.subscribe();
      return _this;
    }
    _createClass(PusherChannel2, [{
      key: "subscribe",
      value: function subscribe() {
        this.subscription = this.pusher.subscribe(this.name);
      }
      /**
       * Unsubscribe from a Pusher channel.
       */
    }, {
      key: "unsubscribe",
      value: function unsubscribe() {
        this.pusher.unsubscribe(this.name);
      }
      /**
       * Listen for an event on the channel instance.
       */
    }, {
      key: "listen",
      value: function listen(event, callback) {
        this.on(this.eventFormatter.format(event), callback);
        return this;
      }
      /**
       * Listen for all events on the channel instance.
       */
    }, {
      key: "listenToAll",
      value: function listenToAll(callback) {
        var _this2 = this;
        this.subscription.bind_global(function(event, data) {
          if (event.startsWith("pusher:")) {
            return;
          }
          var namespace = _this2.options.namespace.replace(/\./g, "\\");
          var formattedEvent = event.startsWith(namespace) ? event.substring(namespace.length + 1) : "." + event;
          callback(formattedEvent, data);
        });
        return this;
      }
      /**
       * Stop listening for an event on the channel instance.
       */
    }, {
      key: "stopListening",
      value: function stopListening(event, callback) {
        if (callback) {
          this.subscription.unbind(this.eventFormatter.format(event), callback);
        } else {
          this.subscription.unbind(this.eventFormatter.format(event));
        }
        return this;
      }
      /**
       * Stop listening for all events on the channel instance.
       */
    }, {
      key: "stopListeningToAll",
      value: function stopListeningToAll(callback) {
        if (callback) {
          this.subscription.unbind_global(callback);
        } else {
          this.subscription.unbind_global();
        }
        return this;
      }
      /**
       * Register a callback to be called anytime a subscription succeeds.
       */
    }, {
      key: "subscribed",
      value: function subscribed(callback) {
        this.on("pusher:subscription_succeeded", function() {
          callback();
        });
        return this;
      }
      /**
       * Register a callback to be called anytime a subscription error occurs.
       */
    }, {
      key: "error",
      value: function error(callback) {
        this.on("pusher:subscription_error", function(status) {
          callback(status);
        });
        return this;
      }
      /**
       * Bind a channel to an event.
       */
    }, {
      key: "on",
      value: function on(event, callback) {
        this.subscription.bind(event, callback);
        return this;
      }
    }]);
    return PusherChannel2;
  }(Channel);
  var PusherPrivateChannel = /* @__PURE__ */ function(_PusherChannel) {
    _inherits(PusherPrivateChannel2, _PusherChannel);
    var _super = _createSuper(PusherPrivateChannel2);
    function PusherPrivateChannel2() {
      _classCallCheck(this, PusherPrivateChannel2);
      return _super.apply(this, arguments);
    }
    _createClass(PusherPrivateChannel2, [{
      key: "whisper",
      value: (
        /**
         * Send a whisper event to other clients in the channel.
         */
        function whisper(eventName, data) {
          this.pusher.channels.channels[this.name].trigger("client-".concat(eventName), data);
          return this;
        }
      )
    }]);
    return PusherPrivateChannel2;
  }(PusherChannel);
  var PusherEncryptedPrivateChannel = /* @__PURE__ */ function(_PusherChannel) {
    _inherits(PusherEncryptedPrivateChannel2, _PusherChannel);
    var _super = _createSuper(PusherEncryptedPrivateChannel2);
    function PusherEncryptedPrivateChannel2() {
      _classCallCheck(this, PusherEncryptedPrivateChannel2);
      return _super.apply(this, arguments);
    }
    _createClass(PusherEncryptedPrivateChannel2, [{
      key: "whisper",
      value: (
        /**
         * Send a whisper event to other clients in the channel.
         */
        function whisper(eventName, data) {
          this.pusher.channels.channels[this.name].trigger("client-".concat(eventName), data);
          return this;
        }
      )
    }]);
    return PusherEncryptedPrivateChannel2;
  }(PusherChannel);
  var PusherPresenceChannel = /* @__PURE__ */ function(_PusherPrivateChannel) {
    _inherits(PusherPresenceChannel2, _PusherPrivateChannel);
    var _super = _createSuper(PusherPresenceChannel2);
    function PusherPresenceChannel2() {
      _classCallCheck(this, PusherPresenceChannel2);
      return _super.apply(this, arguments);
    }
    _createClass(PusherPresenceChannel2, [{
      key: "here",
      value: (
        /**
         * Register a callback to be called anytime the member list changes.
         */
        function here(callback) {
          this.on("pusher:subscription_succeeded", function(data) {
            callback(Object.keys(data.members).map(function(k) {
              return data.members[k];
            }));
          });
          return this;
        }
      )
      /**
       * Listen for someone joining the channel.
       */
    }, {
      key: "joining",
      value: function joining(callback) {
        this.on("pusher:member_added", function(member) {
          callback(member.info);
        });
        return this;
      }
      /**
       * Send a whisper event to other clients in the channel.
       */
    }, {
      key: "whisper",
      value: function whisper(eventName, data) {
        this.pusher.channels.channels[this.name].trigger("client-".concat(eventName), data);
        return this;
      }
      /**
       * Listen for someone leaving the channel.
       */
    }, {
      key: "leaving",
      value: function leaving(callback) {
        this.on("pusher:member_removed", function(member) {
          callback(member.info);
        });
        return this;
      }
    }]);
    return PusherPresenceChannel2;
  }(PusherPrivateChannel);
  var SocketIoChannel = /* @__PURE__ */ function(_Channel) {
    _inherits(SocketIoChannel2, _Channel);
    var _super = _createSuper(SocketIoChannel2);
    function SocketIoChannel2(socket, name, options) {
      var _this;
      _classCallCheck(this, SocketIoChannel2);
      _this = _super.call(this);
      _this.events = {};
      _this.listeners = {};
      _this.name = name;
      _this.socket = socket;
      _this.options = options;
      _this.eventFormatter = new EventFormatter(_this.options.namespace);
      _this.subscribe();
      return _this;
    }
    _createClass(SocketIoChannel2, [{
      key: "subscribe",
      value: function subscribe() {
        this.socket.emit("subscribe", {
          channel: this.name,
          auth: this.options.auth || {}
        });
      }
      /**
       * Unsubscribe from channel and ubind event callbacks.
       */
    }, {
      key: "unsubscribe",
      value: function unsubscribe() {
        this.unbind();
        this.socket.emit("unsubscribe", {
          channel: this.name,
          auth: this.options.auth || {}
        });
      }
      /**
       * Listen for an event on the channel instance.
       */
    }, {
      key: "listen",
      value: function listen(event, callback) {
        this.on(this.eventFormatter.format(event), callback);
        return this;
      }
      /**
       * Stop listening for an event on the channel instance.
       */
    }, {
      key: "stopListening",
      value: function stopListening(event, callback) {
        this.unbindEvent(this.eventFormatter.format(event), callback);
        return this;
      }
      /**
       * Register a callback to be called anytime a subscription succeeds.
       */
    }, {
      key: "subscribed",
      value: function subscribed(callback) {
        this.on("connect", function(socket) {
          callback(socket);
        });
        return this;
      }
      /**
       * Register a callback to be called anytime an error occurs.
       */
    }, {
      key: "error",
      value: function error(callback) {
        return this;
      }
      /**
       * Bind the channel's socket to an event and store the callback.
       */
    }, {
      key: "on",
      value: function on(event, callback) {
        var _this2 = this;
        this.listeners[event] = this.listeners[event] || [];
        if (!this.events[event]) {
          this.events[event] = function(channel, data) {
            if (_this2.name === channel && _this2.listeners[event]) {
              _this2.listeners[event].forEach(function(cb) {
                return cb(data);
              });
            }
          };
          this.socket.on(event, this.events[event]);
        }
        this.listeners[event].push(callback);
        return this;
      }
      /**
       * Unbind the channel's socket from all stored event callbacks.
       */
    }, {
      key: "unbind",
      value: function unbind() {
        var _this3 = this;
        Object.keys(this.events).forEach(function(event) {
          _this3.unbindEvent(event);
        });
      }
      /**
       * Unbind the listeners for the given event.
       */
    }, {
      key: "unbindEvent",
      value: function unbindEvent(event, callback) {
        this.listeners[event] = this.listeners[event] || [];
        if (callback) {
          this.listeners[event] = this.listeners[event].filter(function(cb) {
            return cb !== callback;
          });
        }
        if (!callback || this.listeners[event].length === 0) {
          if (this.events[event]) {
            this.socket.removeListener(event, this.events[event]);
            delete this.events[event];
          }
          delete this.listeners[event];
        }
      }
    }]);
    return SocketIoChannel2;
  }(Channel);
  var SocketIoPrivateChannel = /* @__PURE__ */ function(_SocketIoChannel) {
    _inherits(SocketIoPrivateChannel2, _SocketIoChannel);
    var _super = _createSuper(SocketIoPrivateChannel2);
    function SocketIoPrivateChannel2() {
      _classCallCheck(this, SocketIoPrivateChannel2);
      return _super.apply(this, arguments);
    }
    _createClass(SocketIoPrivateChannel2, [{
      key: "whisper",
      value: (
        /**
         * Send a whisper event to other clients in the channel.
         */
        function whisper(eventName, data) {
          this.socket.emit("client event", {
            channel: this.name,
            event: "client-".concat(eventName),
            data
          });
          return this;
        }
      )
    }]);
    return SocketIoPrivateChannel2;
  }(SocketIoChannel);
  var SocketIoPresenceChannel = /* @__PURE__ */ function(_SocketIoPrivateChann) {
    _inherits(SocketIoPresenceChannel2, _SocketIoPrivateChann);
    var _super = _createSuper(SocketIoPresenceChannel2);
    function SocketIoPresenceChannel2() {
      _classCallCheck(this, SocketIoPresenceChannel2);
      return _super.apply(this, arguments);
    }
    _createClass(SocketIoPresenceChannel2, [{
      key: "here",
      value: (
        /**
         * Register a callback to be called anytime the member list changes.
         */
        function here(callback) {
          this.on("presence:subscribed", function(members) {
            callback(members.map(function(m) {
              return m.user_info;
            }));
          });
          return this;
        }
      )
      /**
       * Listen for someone joining the channel.
       */
    }, {
      key: "joining",
      value: function joining(callback) {
        this.on("presence:joining", function(member) {
          return callback(member.user_info);
        });
        return this;
      }
      /**
       * Send a whisper event to other clients in the channel.
       */
    }, {
      key: "whisper",
      value: function whisper(eventName, data) {
        this.socket.emit("client event", {
          channel: this.name,
          event: "client-".concat(eventName),
          data
        });
        return this;
      }
      /**
       * Listen for someone leaving the channel.
       */
    }, {
      key: "leaving",
      value: function leaving(callback) {
        this.on("presence:leaving", function(member) {
          return callback(member.user_info);
        });
        return this;
      }
    }]);
    return SocketIoPresenceChannel2;
  }(SocketIoPrivateChannel);
  var NullChannel = /* @__PURE__ */ function(_Channel) {
    _inherits(NullChannel2, _Channel);
    var _super = _createSuper(NullChannel2);
    function NullChannel2() {
      _classCallCheck(this, NullChannel2);
      return _super.apply(this, arguments);
    }
    _createClass(NullChannel2, [{
      key: "subscribe",
      value: (
        /**
         * Subscribe to a channel.
         */
        function subscribe() {
        }
      )
      /**
       * Unsubscribe from a channel.
       */
    }, {
      key: "unsubscribe",
      value: function unsubscribe() {
      }
      /**
       * Listen for an event on the channel instance.
       */
    }, {
      key: "listen",
      value: function listen(event, callback) {
        return this;
      }
      /**
       * Listen for all events on the channel instance.
       */
    }, {
      key: "listenToAll",
      value: function listenToAll(callback) {
        return this;
      }
      /**
       * Stop listening for an event on the channel instance.
       */
    }, {
      key: "stopListening",
      value: function stopListening(event, callback) {
        return this;
      }
      /**
       * Register a callback to be called anytime a subscription succeeds.
       */
    }, {
      key: "subscribed",
      value: function subscribed(callback) {
        return this;
      }
      /**
       * Register a callback to be called anytime an error occurs.
       */
    }, {
      key: "error",
      value: function error(callback) {
        return this;
      }
      /**
       * Bind a channel to an event.
       */
    }, {
      key: "on",
      value: function on(event, callback) {
        return this;
      }
    }]);
    return NullChannel2;
  }(Channel);
  var NullPrivateChannel = /* @__PURE__ */ function(_NullChannel) {
    _inherits(NullPrivateChannel2, _NullChannel);
    var _super = _createSuper(NullPrivateChannel2);
    function NullPrivateChannel2() {
      _classCallCheck(this, NullPrivateChannel2);
      return _super.apply(this, arguments);
    }
    _createClass(NullPrivateChannel2, [{
      key: "whisper",
      value: (
        /**
         * Send a whisper event to other clients in the channel.
         */
        function whisper(eventName, data) {
          return this;
        }
      )
    }]);
    return NullPrivateChannel2;
  }(NullChannel);
  var NullEncryptedPrivateChannel = /* @__PURE__ */ function(_NullChannel) {
    _inherits(NullEncryptedPrivateChannel2, _NullChannel);
    var _super = _createSuper(NullEncryptedPrivateChannel2);
    function NullEncryptedPrivateChannel2() {
      _classCallCheck(this, NullEncryptedPrivateChannel2);
      return _super.apply(this, arguments);
    }
    _createClass(NullEncryptedPrivateChannel2, [{
      key: "whisper",
      value: (
        /**
         * Send a whisper event to other clients in the channel.
         */
        function whisper(eventName, data) {
          return this;
        }
      )
    }]);
    return NullEncryptedPrivateChannel2;
  }(NullChannel);
  var NullPresenceChannel = /* @__PURE__ */ function(_NullPrivateChannel) {
    _inherits(NullPresenceChannel2, _NullPrivateChannel);
    var _super = _createSuper(NullPresenceChannel2);
    function NullPresenceChannel2() {
      _classCallCheck(this, NullPresenceChannel2);
      return _super.apply(this, arguments);
    }
    _createClass(NullPresenceChannel2, [{
      key: "here",
      value: (
        /**
         * Register a callback to be called anytime the member list changes.
         */
        function here(callback) {
          return this;
        }
      )
      /**
       * Listen for someone joining the channel.
       */
    }, {
      key: "joining",
      value: function joining(callback) {
        return this;
      }
      /**
       * Send a whisper event to other clients in the channel.
       */
    }, {
      key: "whisper",
      value: function whisper(eventName, data) {
        return this;
      }
      /**
       * Listen for someone leaving the channel.
       */
    }, {
      key: "leaving",
      value: function leaving(callback) {
        return this;
      }
    }]);
    return NullPresenceChannel2;
  }(NullPrivateChannel);
  var Connector = /* @__PURE__ */ function() {
    function Connector2(options) {
      _classCallCheck(this, Connector2);
      this._defaultOptions = {
        auth: {
          headers: {}
        },
        authEndpoint: "/broadcasting/auth",
        userAuthentication: {
          endpoint: "/broadcasting/user-auth",
          headers: {}
        },
        broadcaster: "pusher",
        csrfToken: null,
        bearerToken: null,
        host: null,
        key: null,
        namespace: "App.Events"
      };
      this.setOptions(options);
      this.connect();
    }
    _createClass(Connector2, [{
      key: "setOptions",
      value: function setOptions(options) {
        this.options = _extends(this._defaultOptions, options);
        var token = this.csrfToken();
        if (token) {
          this.options.auth.headers["X-CSRF-TOKEN"] = token;
          this.options.userAuthentication.headers["X-CSRF-TOKEN"] = token;
        }
        token = this.options.bearerToken;
        if (token) {
          this.options.auth.headers["Authorization"] = "Bearer " + token;
          this.options.userAuthentication.headers["Authorization"] = "Bearer " + token;
        }
        return options;
      }
      /**
       * Extract the CSRF token from the page.
       */
    }, {
      key: "csrfToken",
      value: function csrfToken() {
        var selector;
        if (typeof window !== "undefined" && window["Laravel"] && window["Laravel"].csrfToken) {
          return window["Laravel"].csrfToken;
        } else if (this.options.csrfToken) {
          return this.options.csrfToken;
        } else if (typeof document !== "undefined" && typeof document.querySelector === "function" && (selector = document.querySelector('meta[name="csrf-token"]'))) {
          return selector.getAttribute("content");
        }
        return null;
      }
    }]);
    return Connector2;
  }();
  var PusherConnector = /* @__PURE__ */ function(_Connector) {
    _inherits(PusherConnector2, _Connector);
    var _super = _createSuper(PusherConnector2);
    function PusherConnector2() {
      var _this;
      _classCallCheck(this, PusherConnector2);
      _this = _super.apply(this, arguments);
      _this.channels = {};
      return _this;
    }
    _createClass(PusherConnector2, [{
      key: "connect",
      value: function connect() {
        if (typeof this.options.client !== "undefined") {
          this.pusher = this.options.client;
        } else if (this.options.Pusher) {
          this.pusher = new this.options.Pusher(this.options.key, this.options);
        } else {
          this.pusher = new Pusher(this.options.key, this.options);
        }
      }
      /**
       * Sign in the user via Pusher user authentication (https://pusher.com/docs/channels/using_channels/user-authentication/).
       */
    }, {
      key: "signin",
      value: function signin() {
        this.pusher.signin();
      }
      /**
       * Listen for an event on a channel instance.
       */
    }, {
      key: "listen",
      value: function listen(name, event, callback) {
        return this.channel(name).listen(event, callback);
      }
      /**
       * Get a channel instance by name.
       */
    }, {
      key: "channel",
      value: function channel(name) {
        if (!this.channels[name]) {
          this.channels[name] = new PusherChannel(this.pusher, name, this.options);
        }
        return this.channels[name];
      }
      /**
       * Get a private channel instance by name.
       */
    }, {
      key: "privateChannel",
      value: function privateChannel(name) {
        if (!this.channels["private-" + name]) {
          this.channels["private-" + name] = new PusherPrivateChannel(this.pusher, "private-" + name, this.options);
        }
        return this.channels["private-" + name];
      }
      /**
       * Get a private encrypted channel instance by name.
       */
    }, {
      key: "encryptedPrivateChannel",
      value: function encryptedPrivateChannel(name) {
        if (!this.channels["private-encrypted-" + name]) {
          this.channels["private-encrypted-" + name] = new PusherEncryptedPrivateChannel(this.pusher, "private-encrypted-" + name, this.options);
        }
        return this.channels["private-encrypted-" + name];
      }
      /**
       * Get a presence channel instance by name.
       */
    }, {
      key: "presenceChannel",
      value: function presenceChannel(name) {
        if (!this.channels["presence-" + name]) {
          this.channels["presence-" + name] = new PusherPresenceChannel(this.pusher, "presence-" + name, this.options);
        }
        return this.channels["presence-" + name];
      }
      /**
       * Leave the given channel, as well as its private and presence variants.
       */
    }, {
      key: "leave",
      value: function leave(name) {
        var _this2 = this;
        var channels = [name, "private-" + name, "private-encrypted-" + name, "presence-" + name];
        channels.forEach(function(name2, index) {
          _this2.leaveChannel(name2);
        });
      }
      /**
       * Leave the given channel.
       */
    }, {
      key: "leaveChannel",
      value: function leaveChannel(name) {
        if (this.channels[name]) {
          this.channels[name].unsubscribe();
          delete this.channels[name];
        }
      }
      /**
       * Get the socket ID for the connection.
       */
    }, {
      key: "socketId",
      value: function socketId() {
        return this.pusher.connection.socket_id;
      }
      /**
       * Disconnect Pusher connection.
       */
    }, {
      key: "disconnect",
      value: function disconnect() {
        this.pusher.disconnect();
      }
    }]);
    return PusherConnector2;
  }(Connector);
  var SocketIoConnector = /* @__PURE__ */ function(_Connector) {
    _inherits(SocketIoConnector2, _Connector);
    var _super = _createSuper(SocketIoConnector2);
    function SocketIoConnector2() {
      var _this;
      _classCallCheck(this, SocketIoConnector2);
      _this = _super.apply(this, arguments);
      _this.channels = {};
      return _this;
    }
    _createClass(SocketIoConnector2, [{
      key: "connect",
      value: function connect() {
        var _this2 = this;
        var io2 = this.getSocketIO();
        this.socket = io2(this.options.host, this.options);
        this.socket.on("reconnect", function() {
          Object.values(_this2.channels).forEach(function(channel) {
            channel.subscribe();
          });
        });
        return this.socket;
      }
      /**
       * Get socket.io module from global scope or options.
       */
    }, {
      key: "getSocketIO",
      value: function getSocketIO() {
        if (typeof this.options.client !== "undefined") {
          return this.options.client;
        }
        if (typeof io !== "undefined") {
          return io;
        }
        throw new Error("Socket.io client not found. Should be globally available or passed via options.client");
      }
      /**
       * Listen for an event on a channel instance.
       */
    }, {
      key: "listen",
      value: function listen(name, event, callback) {
        return this.channel(name).listen(event, callback);
      }
      /**
       * Get a channel instance by name.
       */
    }, {
      key: "channel",
      value: function channel(name) {
        if (!this.channels[name]) {
          this.channels[name] = new SocketIoChannel(this.socket, name, this.options);
        }
        return this.channels[name];
      }
      /**
       * Get a private channel instance by name.
       */
    }, {
      key: "privateChannel",
      value: function privateChannel(name) {
        if (!this.channels["private-" + name]) {
          this.channels["private-" + name] = new SocketIoPrivateChannel(this.socket, "private-" + name, this.options);
        }
        return this.channels["private-" + name];
      }
      /**
       * Get a presence channel instance by name.
       */
    }, {
      key: "presenceChannel",
      value: function presenceChannel(name) {
        if (!this.channels["presence-" + name]) {
          this.channels["presence-" + name] = new SocketIoPresenceChannel(this.socket, "presence-" + name, this.options);
        }
        return this.channels["presence-" + name];
      }
      /**
       * Leave the given channel, as well as its private and presence variants.
       */
    }, {
      key: "leave",
      value: function leave(name) {
        var _this3 = this;
        var channels = [name, "private-" + name, "presence-" + name];
        channels.forEach(function(name2) {
          _this3.leaveChannel(name2);
        });
      }
      /**
       * Leave the given channel.
       */
    }, {
      key: "leaveChannel",
      value: function leaveChannel(name) {
        if (this.channels[name]) {
          this.channels[name].unsubscribe();
          delete this.channels[name];
        }
      }
      /**
       * Get the socket ID for the connection.
       */
    }, {
      key: "socketId",
      value: function socketId() {
        return this.socket.id;
      }
      /**
       * Disconnect Socketio connection.
       */
    }, {
      key: "disconnect",
      value: function disconnect() {
        this.socket.disconnect();
      }
    }]);
    return SocketIoConnector2;
  }(Connector);
  var NullConnector = /* @__PURE__ */ function(_Connector) {
    _inherits(NullConnector2, _Connector);
    var _super = _createSuper(NullConnector2);
    function NullConnector2() {
      var _this;
      _classCallCheck(this, NullConnector2);
      _this = _super.apply(this, arguments);
      _this.channels = {};
      return _this;
    }
    _createClass(NullConnector2, [{
      key: "connect",
      value: function connect() {
      }
      /**
       * Listen for an event on a channel instance.
       */
    }, {
      key: "listen",
      value: function listen(name, event, callback) {
        return new NullChannel();
      }
      /**
       * Get a channel instance by name.
       */
    }, {
      key: "channel",
      value: function channel(name) {
        return new NullChannel();
      }
      /**
       * Get a private channel instance by name.
       */
    }, {
      key: "privateChannel",
      value: function privateChannel(name) {
        return new NullPrivateChannel();
      }
      /**
       * Get a private encrypted channel instance by name.
       */
    }, {
      key: "encryptedPrivateChannel",
      value: function encryptedPrivateChannel(name) {
        return new NullEncryptedPrivateChannel();
      }
      /**
       * Get a presence channel instance by name.
       */
    }, {
      key: "presenceChannel",
      value: function presenceChannel(name) {
        return new NullPresenceChannel();
      }
      /**
       * Leave the given channel, as well as its private and presence variants.
       */
    }, {
      key: "leave",
      value: function leave(name) {
      }
      /**
       * Leave the given channel.
       */
    }, {
      key: "leaveChannel",
      value: function leaveChannel(name) {
      }
      /**
       * Get the socket ID for the connection.
       */
    }, {
      key: "socketId",
      value: function socketId() {
        return "fake-socket-id";
      }
      /**
       * Disconnect the connection.
       */
    }, {
      key: "disconnect",
      value: function disconnect() {
      }
    }]);
    return NullConnector2;
  }(Connector);
  var Echo = /* @__PURE__ */ function() {
    function Echo2(options) {
      _classCallCheck(this, Echo2);
      this.options = options;
      this.connect();
      if (!this.options.withoutInterceptors) {
        this.registerInterceptors();
      }
    }
    _createClass(Echo2, [{
      key: "channel",
      value: function channel(_channel) {
        return this.connector.channel(_channel);
      }
      /**
       * Create a new connection.
       */
    }, {
      key: "connect",
      value: function connect() {
        if (this.options.broadcaster == "reverb") {
          this.connector = new PusherConnector(_extends(_extends({}, this.options), {
            cluster: ""
          }));
        } else if (this.options.broadcaster == "pusher") {
          this.connector = new PusherConnector(this.options);
        } else if (this.options.broadcaster == "socket.io") {
          this.connector = new SocketIoConnector(this.options);
        } else if (this.options.broadcaster == "null") {
          this.connector = new NullConnector(this.options);
        } else if (typeof this.options.broadcaster == "function" && isConstructor(this.options.broadcaster)) {
          this.connector = new this.options.broadcaster(this.options);
        } else {
          throw new Error("Broadcaster ".concat(_typeof(this.options.broadcaster), " ").concat(this.options.broadcaster, " is not supported."));
        }
      }
      /**
       * Disconnect from the Echo server.
       */
    }, {
      key: "disconnect",
      value: function disconnect() {
        this.connector.disconnect();
      }
      /**
       * Get a presence channel instance by name.
       */
    }, {
      key: "join",
      value: function join(channel) {
        return this.connector.presenceChannel(channel);
      }
      /**
       * Leave the given channel, as well as its private and presence variants.
       */
    }, {
      key: "leave",
      value: function leave(channel) {
        this.connector.leave(channel);
      }
      /**
       * Leave the given channel.
       */
    }, {
      key: "leaveChannel",
      value: function leaveChannel(channel) {
        this.connector.leaveChannel(channel);
      }
      /**
       * Leave all channels.
       */
    }, {
      key: "leaveAllChannels",
      value: function leaveAllChannels() {
        for (var channel in this.connector.channels) {
          this.leaveChannel(channel);
        }
      }
      /**
       * Listen for an event on a channel instance.
       */
    }, {
      key: "listen",
      value: function listen(channel, event, callback) {
        return this.connector.listen(channel, event, callback);
      }
      /**
       * Get a private channel instance by name.
       */
    }, {
      key: "private",
      value: function _private(channel) {
        return this.connector.privateChannel(channel);
      }
      /**
       * Get a private encrypted channel instance by name.
       */
    }, {
      key: "encryptedPrivate",
      value: function encryptedPrivate(channel) {
        if (this.connector instanceof SocketIoConnector) {
          throw new Error("Broadcaster ".concat(_typeof(this.options.broadcaster), " ").concat(this.options.broadcaster, " does not support encrypted private channels."));
        }
        return this.connector.encryptedPrivateChannel(channel);
      }
      /**
       * Get the Socket ID for the connection.
       */
    }, {
      key: "socketId",
      value: function socketId() {
        return this.connector.socketId();
      }
      /**
       * Register 3rd party request interceptiors. These are used to automatically
       * send a connections socket id to a Laravel app with a X-Socket-Id header.
       */
    }, {
      key: "registerInterceptors",
      value: function registerInterceptors() {
        if (typeof Vue === "function" && Vue.http) {
          this.registerVueRequestInterceptor();
        }
        if (typeof axios === "function") {
          this.registerAxiosRequestInterceptor();
        }
        if (typeof jQuery === "function") {
          this.registerjQueryAjaxSetup();
        }
        if ((typeof Turbo === "undefined" ? "undefined" : _typeof(Turbo)) === "object") {
          this.registerTurboRequestInterceptor();
        }
      }
      /**
       * Register a Vue HTTP interceptor to add the X-Socket-ID header.
       */
    }, {
      key: "registerVueRequestInterceptor",
      value: function registerVueRequestInterceptor() {
        var _this = this;
        Vue.http.interceptors.push(function(request, next) {
          if (_this.socketId()) {
            request.headers.set("X-Socket-ID", _this.socketId());
          }
          next();
        });
      }
      /**
       * Register an Axios HTTP interceptor to add the X-Socket-ID header.
       */
    }, {
      key: "registerAxiosRequestInterceptor",
      value: function registerAxiosRequestInterceptor() {
        var _this2 = this;
        axios.interceptors.request.use(function(config) {
          if (_this2.socketId()) {
            config.headers["X-Socket-Id"] = _this2.socketId();
          }
          return config;
        });
      }
      /**
       * Register jQuery AjaxPrefilter to add the X-Socket-ID header.
       */
    }, {
      key: "registerjQueryAjaxSetup",
      value: function registerjQueryAjaxSetup() {
        var _this3 = this;
        if (typeof jQuery.ajax != "undefined") {
          jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
            if (_this3.socketId()) {
              xhr.setRequestHeader("X-Socket-Id", _this3.socketId());
            }
          });
        }
      }
      /**
       * Register the Turbo Request interceptor to add the X-Socket-ID header.
       */
    }, {
      key: "registerTurboRequestInterceptor",
      value: function registerTurboRequestInterceptor() {
        var _this4 = this;
        document.addEventListener("turbo:before-fetch-request", function(event) {
          event.detail.fetchOptions.headers["X-Socket-Id"] = _this4.socketId();
        });
      }
    }]);
    return Echo2;
  }();

  // packages/panels/resources/js/echo.js
  var import_pusher = __toESM(require_pusher(), 1);
  window.EchoFactory = Echo;
  window.Pusher = import_pusher.default;
})();
/*! Bundled license information:

pusher-js/dist/web/pusher.js:
  (*!
   * Pusher JavaScript Library v7.6.0
   * https://pusher.com/
   *
   * Copyright 2020, Pusher
   * Released under the MIT licence.
   *)
*/
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsid2VicGFjazovL1B1c2hlci93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCAid2VicGFjazovL1B1c2hlci93ZWJwYWNrL2Jvb3RzdHJhcCIsICJ3ZWJwYWNrOi8vUHVzaGVyL25vZGVfbW9kdWxlcy9Ac3RhYmxlbGliL2Jhc2U2NC9iYXNlNjQudHMiLCAid2VicGFjazovL1B1c2hlci9ub2RlX21vZHVsZXMvQHN0YWJsZWxpYi91dGY4L3V0ZjgudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS9wdXNoZXIuanMiLCAid2VicGFjazovL1B1c2hlci9zcmMvcnVudGltZXMvd2ViL2RvbS9zY3JpcHRfcmVjZWl2ZXJfZmFjdG9yeS50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL2RlZmF1bHRzLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL3J1bnRpbWVzL3dlYi9kb20vZGVwZW5kZW5jeV9sb2FkZXIudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvcnVudGltZXMvd2ViL2RvbS9kZXBlbmRlbmNpZXMudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS91dGlscy91cmxfc3RvcmUudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS9hdXRoL29wdGlvbnMudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS9lcnJvcnMudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvcnVudGltZXMvaXNvbW9ycGhpYy9hdXRoL3hocl9hdXRoLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvYmFzZTY0LnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvdXRpbHMvdGltZXJzL2Fic3RyYWN0X3RpbWVyLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvdXRpbHMvdGltZXJzL2luZGV4LnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvdXRpbC50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL3V0aWxzL2NvbGxlY3Rpb25zLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvbG9nZ2VyLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL3J1bnRpbWVzL3dlYi9hdXRoL2pzb25wX2F1dGgudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvcnVudGltZXMvd2ViL2RvbS9zY3JpcHRfcmVxdWVzdC50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9ydW50aW1lcy93ZWIvZG9tL2pzb25wX3JlcXVlc3QudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvcnVudGltZXMvd2ViL3RpbWVsaW5lL2pzb25wX3RpbWVsaW5lLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvdHJhbnNwb3J0cy91cmxfc2NoZW1lcy50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL2V2ZW50cy9jYWxsYmFja19yZWdpc3RyeS50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL2V2ZW50cy9kaXNwYXRjaGVyLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvdHJhbnNwb3J0cy90cmFuc3BvcnRfY29ubmVjdGlvbi50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL3RyYW5zcG9ydHMvdHJhbnNwb3J0LnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL3J1bnRpbWVzL2lzb21vcnBoaWMvdHJhbnNwb3J0cy90cmFuc3BvcnRzLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL3J1bnRpbWVzL3dlYi90cmFuc3BvcnRzL3RyYW5zcG9ydHMudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvcnVudGltZXMvd2ViL25ldF9pbmZvLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvdHJhbnNwb3J0cy9hc3Npc3RhbnRfdG9fdGhlX3RyYW5zcG9ydF9tYW5hZ2VyLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvY29ubmVjdGlvbi9wcm90b2NvbC9wcm90b2NvbC50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL2Nvbm5lY3Rpb24vY29ubmVjdGlvbi50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL2Nvbm5lY3Rpb24vaGFuZHNoYWtlL2luZGV4LnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvdGltZWxpbmUvdGltZWxpbmVfc2VuZGVyLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvY2hhbm5lbHMvY2hhbm5lbC50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL2NoYW5uZWxzL3ByaXZhdGVfY2hhbm5lbC50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL2NoYW5uZWxzL21lbWJlcnMudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS9jaGFubmVscy9wcmVzZW5jZV9jaGFubmVsLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvY2hhbm5lbHMvZW5jcnlwdGVkX2NoYW5uZWwudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS9jb25uZWN0aW9uL2Nvbm5lY3Rpb25fbWFuYWdlci50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL2NoYW5uZWxzL2NoYW5uZWxzLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvdXRpbHMvZmFjdG9yeS50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL3RyYW5zcG9ydHMvdHJhbnNwb3J0X21hbmFnZXIudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS9zdHJhdGVnaWVzL3NlcXVlbnRpYWxfc3RyYXRlZ3kudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS9zdHJhdGVnaWVzL2Jlc3RfY29ubmVjdGVkX2V2ZXJfc3RyYXRlZ3kudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS9zdHJhdGVnaWVzL2NhY2hlZF9zdHJhdGVneS50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL3N0cmF0ZWdpZXMvZGVsYXllZF9zdHJhdGVneS50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL3N0cmF0ZWdpZXMvaWZfc3RyYXRlZ3kudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS9zdHJhdGVnaWVzL2ZpcnN0X2Nvbm5lY3RlZF9zdHJhdGVneS50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9ydW50aW1lcy93ZWIvZGVmYXVsdF9zdHJhdGVneS50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9ydW50aW1lcy93ZWIvdHJhbnNwb3J0cy90cmFuc3BvcnRfY29ubmVjdGlvbl9pbml0aWFsaXplci50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9ydW50aW1lcy93ZWIvaHR0cC9odHRwX3hkb21haW5fcmVxdWVzdC50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL2h0dHAvaHR0cF9yZXF1ZXN0LnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvaHR0cC9zdGF0ZS50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL2h0dHAvaHR0cF9zb2NrZXQudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS9odHRwL2h0dHBfc3RyZWFtaW5nX3NvY2tldC50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL2h0dHAvaHR0cF9wb2xsaW5nX3NvY2tldC50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9ydW50aW1lcy9pc29tb3JwaGljL2h0dHAvaHR0cF94aHJfcmVxdWVzdC50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9ydW50aW1lcy9pc29tb3JwaGljL2h0dHAvaHR0cC50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9ydW50aW1lcy93ZWIvaHR0cC9odHRwLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL3J1bnRpbWVzL3dlYi9ydW50aW1lLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvdGltZWxpbmUvbGV2ZWwudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS90aW1lbGluZS90aW1lbGluZS50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL3N0cmF0ZWdpZXMvdHJhbnNwb3J0X3N0cmF0ZWd5LnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvc3RyYXRlZ2llcy9zdHJhdGVneV9idWlsZGVyLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvYXV0aC91c2VyX2F1dGhlbnRpY2F0b3IudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS9hdXRoL2NoYW5uZWxfYXV0aG9yaXplci50cyIsICJ3ZWJwYWNrOi8vUHVzaGVyL3NyYy9jb3JlL2F1dGgvZGVwcmVjYXRlZF9jaGFubmVsX2F1dGhvcml6ZXIudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS9jb25maWcudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS93YXRjaGxpc3QudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS91dGlscy9mbGF0X3Byb21pc2UudHMiLCAid2VicGFjazovL1B1c2hlci9zcmMvY29yZS91c2VyLnRzIiwgIndlYnBhY2s6Ly9QdXNoZXIvc3JjL2NvcmUvcHVzaGVyLnRzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9sYXJhdmVsLWVjaG8vZGlzdC9lY2hvLmpzIiwgIi4uL3Jlc291cmNlcy9qcy9lY2hvLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJQdXNoZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiUHVzaGVyXCJdID0gZmFjdG9yeSgpO1xufSkod2luZG93LCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCAiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuIiwgIi8vIENvcHlyaWdodCAoQykgMjAxNiBEbWl0cnkgQ2hlc3RueWtoXG4vLyBNSVQgTGljZW5zZS4gU2VlIExJQ0VOU0UgZmlsZSBmb3IgZGV0YWlscy5cblxuLyoqXG4gKiBQYWNrYWdlIGJhc2U2NCBpbXBsZW1lbnRzIEJhc2U2NCBlbmNvZGluZyBhbmQgZGVjb2RpbmcuXG4gKi9cblxuLy8gSW52YWxpZCBjaGFyYWN0ZXIgdXNlZCBpbiBkZWNvZGluZyB0byBpbmRpY2F0ZVxuLy8gdGhhdCB0aGUgY2hhcmFjdGVyIHRvIGRlY29kZSBpcyBvdXQgb2YgcmFuZ2Ugb2Zcbi8vIGFscGhhYmV0IGFuZCBjYW5ub3QgYmUgZGVjb2RlZC5cbmNvbnN0IElOVkFMSURfQllURSA9IDI1NjtcblxuLyoqXG4gKiBJbXBsZW1lbnRzIHN0YW5kYXJkIEJhc2U2NCBlbmNvZGluZy5cbiAqXG4gKiBPcGVyYXRlcyBpbiBjb25zdGFudCB0aW1lLlxuICovXG5leHBvcnQgY2xhc3MgQ29kZXIge1xuICAgIC8vIFRPRE8oZGNoZXN0KTogbWV0aG9kcyB0byBlbmNvZGUgY2h1bmstYnktY2h1bmsuXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wYWRkaW5nQ2hhcmFjdGVyID0gXCI9XCIpIHsgfVxuXG4gICAgZW5jb2RlZExlbmd0aChsZW5ndGg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGlmICghdGhpcy5fcGFkZGluZ0NoYXJhY3Rlcikge1xuICAgICAgICAgICAgcmV0dXJuIChsZW5ndGggKiA4ICsgNSkgLyA2IHwgMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGxlbmd0aCArIDIpIC8gMyAqIDQgfCAwO1xuICAgIH1cblxuICAgIGVuY29kZShkYXRhOiBVaW50OEFycmF5KTogc3RyaW5nIHtcbiAgICAgICAgbGV0IG91dCA9IFwiXCI7XG5cbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBmb3IgKDsgaSA8IGRhdGEubGVuZ3RoIC0gMjsgaSArPSAzKSB7XG4gICAgICAgICAgICBsZXQgYyA9IChkYXRhW2ldIDw8IDE2KSB8IChkYXRhW2kgKyAxXSA8PCA4KSB8IChkYXRhW2kgKyAyXSk7XG4gICAgICAgICAgICBvdXQgKz0gdGhpcy5fZW5jb2RlQnl0ZSgoYyA+Pj4gMyAqIDYpICYgNjMpO1xuICAgICAgICAgICAgb3V0ICs9IHRoaXMuX2VuY29kZUJ5dGUoKGMgPj4+IDIgKiA2KSAmIDYzKTtcbiAgICAgICAgICAgIG91dCArPSB0aGlzLl9lbmNvZGVCeXRlKChjID4+PiAxICogNikgJiA2Myk7XG4gICAgICAgICAgICBvdXQgKz0gdGhpcy5fZW5jb2RlQnl0ZSgoYyA+Pj4gMCAqIDYpICYgNjMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGVmdCA9IGRhdGEubGVuZ3RoIC0gaTtcbiAgICAgICAgaWYgKGxlZnQgPiAwKSB7XG4gICAgICAgICAgICBsZXQgYyA9IChkYXRhW2ldIDw8IDE2KSB8IChsZWZ0ID09PSAyID8gZGF0YVtpICsgMV0gPDwgOCA6IDApO1xuICAgICAgICAgICAgb3V0ICs9IHRoaXMuX2VuY29kZUJ5dGUoKGMgPj4+IDMgKiA2KSAmIDYzKTtcbiAgICAgICAgICAgIG91dCArPSB0aGlzLl9lbmNvZGVCeXRlKChjID4+PiAyICogNikgJiA2Myk7XG4gICAgICAgICAgICBpZiAobGVmdCA9PT0gMikge1xuICAgICAgICAgICAgICAgIG91dCArPSB0aGlzLl9lbmNvZGVCeXRlKChjID4+PiAxICogNikgJiA2Myk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dCArPSB0aGlzLl9wYWRkaW5nQ2hhcmFjdGVyIHx8IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQgKz0gdGhpcy5fcGFkZGluZ0NoYXJhY3RlciB8fCBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBtYXhEZWNvZGVkTGVuZ3RoKGxlbmd0aDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCF0aGlzLl9wYWRkaW5nQ2hhcmFjdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gKGxlbmd0aCAqIDYgKyA3KSAvIDggfCAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsZW5ndGggLyA0ICogMyB8IDA7XG4gICAgfVxuXG4gICAgZGVjb2RlZExlbmd0aChzOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXhEZWNvZGVkTGVuZ3RoKHMubGVuZ3RoIC0gdGhpcy5fZ2V0UGFkZGluZ0xlbmd0aChzKSk7XG4gICAgfVxuXG4gICAgZGVjb2RlKHM6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xuICAgICAgICBpZiAocy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheSgwKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYWRkaW5nTGVuZ3RoID0gdGhpcy5fZ2V0UGFkZGluZ0xlbmd0aChzKTtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gcy5sZW5ndGggLSBwYWRkaW5nTGVuZ3RoO1xuICAgICAgICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheSh0aGlzLm1heERlY29kZWRMZW5ndGgobGVuZ3RoKSk7XG4gICAgICAgIGxldCBvcCA9IDA7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IGhhdmVCYWQgPSAwO1xuICAgICAgICBsZXQgdjAgPSAwLCB2MSA9IDAsIHYyID0gMCwgdjMgPSAwO1xuICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aCAtIDQ7IGkgKz0gNCkge1xuICAgICAgICAgICAgdjAgPSB0aGlzLl9kZWNvZGVDaGFyKHMuY2hhckNvZGVBdChpICsgMCkpO1xuICAgICAgICAgICAgdjEgPSB0aGlzLl9kZWNvZGVDaGFyKHMuY2hhckNvZGVBdChpICsgMSkpO1xuICAgICAgICAgICAgdjIgPSB0aGlzLl9kZWNvZGVDaGFyKHMuY2hhckNvZGVBdChpICsgMikpO1xuICAgICAgICAgICAgdjMgPSB0aGlzLl9kZWNvZGVDaGFyKHMuY2hhckNvZGVBdChpICsgMykpO1xuICAgICAgICAgICAgb3V0W29wKytdID0gKHYwIDw8IDIpIHwgKHYxID4+PiA0KTtcbiAgICAgICAgICAgIG91dFtvcCsrXSA9ICh2MSA8PCA0KSB8ICh2MiA+Pj4gMik7XG4gICAgICAgICAgICBvdXRbb3ArK10gPSAodjIgPDwgNikgfCB2MztcbiAgICAgICAgICAgIGhhdmVCYWQgfD0gdjAgJiBJTlZBTElEX0JZVEU7XG4gICAgICAgICAgICBoYXZlQmFkIHw9IHYxICYgSU5WQUxJRF9CWVRFO1xuICAgICAgICAgICAgaGF2ZUJhZCB8PSB2MiAmIElOVkFMSURfQllURTtcbiAgICAgICAgICAgIGhhdmVCYWQgfD0gdjMgJiBJTlZBTElEX0JZVEU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPCBsZW5ndGggLSAxKSB7XG4gICAgICAgICAgICB2MCA9IHRoaXMuX2RlY29kZUNoYXIocy5jaGFyQ29kZUF0KGkpKTtcbiAgICAgICAgICAgIHYxID0gdGhpcy5fZGVjb2RlQ2hhcihzLmNoYXJDb2RlQXQoaSArIDEpKTtcbiAgICAgICAgICAgIG91dFtvcCsrXSA9ICh2MCA8PCAyKSB8ICh2MSA+Pj4gNCk7XG4gICAgICAgICAgICBoYXZlQmFkIHw9IHYwICYgSU5WQUxJRF9CWVRFO1xuICAgICAgICAgICAgaGF2ZUJhZCB8PSB2MSAmIElOVkFMSURfQllURTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA8IGxlbmd0aCAtIDIpIHtcbiAgICAgICAgICAgIHYyID0gdGhpcy5fZGVjb2RlQ2hhcihzLmNoYXJDb2RlQXQoaSArIDIpKTtcbiAgICAgICAgICAgIG91dFtvcCsrXSA9ICh2MSA8PCA0KSB8ICh2MiA+Pj4gMik7XG4gICAgICAgICAgICBoYXZlQmFkIHw9IHYyICYgSU5WQUxJRF9CWVRFO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpIDwgbGVuZ3RoIC0gMykge1xuICAgICAgICAgICAgdjMgPSB0aGlzLl9kZWNvZGVDaGFyKHMuY2hhckNvZGVBdChpICsgMykpO1xuICAgICAgICAgICAgb3V0W29wKytdID0gKHYyIDw8IDYpIHwgdjM7XG4gICAgICAgICAgICBoYXZlQmFkIHw9IHYzICYgSU5WQUxJRF9CWVRFO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXZlQmFkICE9PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCYXNlNjRDb2RlcjogaW5jb3JyZWN0IGNoYXJhY3RlcnMgZm9yIGRlY29kaW5nXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLy8gU3RhbmRhcmQgZW5jb2RpbmcgaGF2ZSB0aGUgZm9sbG93aW5nIGVuY29kZWQvZGVjb2RlZCByYW5nZXMsXG4gICAgLy8gd2hpY2ggd2UgbmVlZCB0byBjb252ZXJ0IGJldHdlZW4uXG4gICAgLy9cbiAgICAvLyBBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWiBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eiAwMTIzNDU2Nzg5ICArICAgL1xuICAgIC8vIEluZGV4OiAgIDAgLSAyNSAgICAgICAgICAgICAgICAgICAgMjYgLSA1MSAgICAgICAgICAgICAgNTIgLSA2MSAgIDYyICA2M1xuICAgIC8vIEFTQ0lJOiAgNjUgLSA5MCAgICAgICAgICAgICAgICAgICAgOTcgLSAxMjIgICAgICAgICAgICAgNDggLSA1NyAgIDQzICA0N1xuICAgIC8vXG5cbiAgICAvLyBFbmNvZGUgNiBiaXRzIGluIGIgaW50byBhIG5ldyBjaGFyYWN0ZXIuXG4gICAgcHJvdGVjdGVkIF9lbmNvZGVCeXRlKGI6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIC8vIEVuY29kaW5nIHVzZXMgY29uc3RhbnQgdGltZSBvcGVyYXRpb25zIGFzIGZvbGxvd3M6XG4gICAgICAgIC8vXG4gICAgICAgIC8vIDEuIERlZmluZSBjb21wYXJpc29uIG9mIEEgd2l0aCBCIHVzaW5nIChBIC0gQikgPj4+IDg6XG4gICAgICAgIC8vICAgICAgICAgIGlmIEEgPiBCLCB0aGVuIHJlc3VsdCBpcyBwb3NpdGl2ZSBpbnRlZ2VyXG4gICAgICAgIC8vICAgICAgICAgIGlmIEEgPD0gQiwgdGhlbiByZXN1bHQgaXMgMFxuICAgICAgICAvL1xuICAgICAgICAvLyAyLiBEZWZpbmUgc2VsZWN0aW9uIG9mIEMgb3IgMCB1c2luZyBiaXR3aXNlIEFORDogWCAmIEM6XG4gICAgICAgIC8vICAgICAgICAgIGlmIFggPT0gMCwgdGhlbiByZXN1bHQgaXMgMFxuICAgICAgICAvLyAgICAgICAgICBpZiBYICE9IDAsIHRoZW4gcmVzdWx0IGlzIENcbiAgICAgICAgLy9cbiAgICAgICAgLy8gMy4gU3RhcnQgd2l0aCB0aGUgc21hbGxlc3QgY29tcGFyaXNvbiAoYiA+PSAwKSwgd2hpY2ggaXMgYWx3YXlzXG4gICAgICAgIC8vICAgIHRydWUsIHNvIHNldCB0aGUgcmVzdWx0IHRvIHRoZSBzdGFydGluZyBBU0NJSSB2YWx1ZSAoNjUpLlxuICAgICAgICAvL1xuICAgICAgICAvLyA0LiBDb250aW51ZSBjb21wYXJpbmcgYiB0byBoaWdoZXIgQVNDSUkgdmFsdWVzLCBhbmQgc2VsZWN0aW5nXG4gICAgICAgIC8vICAgIHplcm8gaWYgY29tcGFyaXNvbiBpc24ndCB0cnVlLCBvdGhlcndpc2Ugc2VsZWN0aW5nIGEgdmFsdWVcbiAgICAgICAgLy8gICAgdG8gYWRkIHRvIHJlc3VsdCwgd2hpY2g6XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICAgICAgIGEpIHVuZG9lcyB0aGUgcHJldmlvdXMgYWRkaXRpb25cbiAgICAgICAgLy8gICAgICAgICAgYikgcHJvdmlkZXMgbmV3IHZhbHVlIHRvIGFkZFxuICAgICAgICAvL1xuICAgICAgICBsZXQgcmVzdWx0ID0gYjtcbiAgICAgICAgLy8gYiA+PSAwXG4gICAgICAgIHJlc3VsdCArPSA2NTtcbiAgICAgICAgLy8gYiA+IDI1XG4gICAgICAgIHJlc3VsdCArPSAoKDI1IC0gYikgPj4+IDgpICYgKCgwIC0gNjUpIC0gMjYgKyA5Nyk7XG4gICAgICAgIC8vIGIgPiA1MVxuICAgICAgICByZXN1bHQgKz0gKCg1MSAtIGIpID4+PiA4KSAmICgoMjYgLSA5NykgLSA1MiArIDQ4KTtcbiAgICAgICAgLy8gYiA+IDYxXG4gICAgICAgIHJlc3VsdCArPSAoKDYxIC0gYikgPj4+IDgpICYgKCg1MiAtIDQ4KSAtIDYyICsgNDMpO1xuICAgICAgICAvLyBiID4gNjJcbiAgICAgICAgcmVzdWx0ICs9ICgoNjIgLSBiKSA+Pj4gOCkgJiAoKDYyIC0gNDMpIC0gNjMgKyA0Nyk7XG5cbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocmVzdWx0KTtcbiAgICB9XG5cbiAgICAvLyBEZWNvZGUgYSBjaGFyYWN0ZXIgY29kZSBpbnRvIGEgYnl0ZS5cbiAgICAvLyBNdXN0IHJldHVybiAyNTYgaWYgY2hhcmFjdGVyIGlzIG91dCBvZiBhbHBoYWJldCByYW5nZS5cbiAgICBwcm90ZWN0ZWQgX2RlY29kZUNoYXIoYzogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgLy8gRGVjb2Rpbmcgd29ya3Mgc2ltaWxhciB0byBlbmNvZGluZzogdXNpbmcgdGhlIHNhbWUgY29tcGFyaXNvblxuICAgICAgICAvLyBmdW5jdGlvbiwgYnV0IG5vdyBpdCB3b3JrcyBvbiByYW5nZXM6IHJlc3VsdCBpcyBhbHdheXMgaW5jcmVtZW50ZWRcbiAgICAgICAgLy8gYnkgdmFsdWUsIGJ1dCB0aGlzIHZhbHVlIGJlY29tZXMgemVybyBpZiB0aGUgcmFuZ2UgaXMgbm90XG4gICAgICAgIC8vIHNhdGlzZmllZC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gRGVjb2Rpbmcgc3RhcnRzIHdpdGggaW52YWxpZCB2YWx1ZSwgMjU2LCB3aGljaCBpcyB0aGVuXG4gICAgICAgIC8vIHN1YnRyYWN0ZWQgd2hlbiB0aGUgcmFuZ2UgaXMgc2F0aXNmaWVkLiBJZiBub25lIG9mIHRoZSByYW5nZXNcbiAgICAgICAgLy8gYXBwbHksIHRoZSBmdW5jdGlvbiByZXR1cm5zIDI1Niwgd2hpY2ggaXMgdGhlbiBjaGVja2VkIGJ5XG4gICAgICAgIC8vIHRoZSBjYWxsZXIgdG8gdGhyb3cgZXJyb3IuXG4gICAgICAgIGxldCByZXN1bHQgPSBJTlZBTElEX0JZVEU7IC8vIHN0YXJ0IHdpdGggaW52YWxpZCBjaGFyYWN0ZXJcblxuICAgICAgICAvLyBjID09IDQzIChjID4gNDIgYW5kIGMgPCA0NClcbiAgICAgICAgcmVzdWx0ICs9ICgoKDQyIC0gYykgJiAoYyAtIDQ0KSkgPj4+IDgpICYgKC1JTlZBTElEX0JZVEUgKyBjIC0gNDMgKyA2Mik7XG4gICAgICAgIC8vIGMgPT0gNDcgKGMgPiA0NiBhbmQgYyA8IDQ4KVxuICAgICAgICByZXN1bHQgKz0gKCgoNDYgLSBjKSAmIChjIC0gNDgpKSA+Pj4gOCkgJiAoLUlOVkFMSURfQllURSArIGMgLSA0NyArIDYzKTtcbiAgICAgICAgLy8gYyA+IDQ3IGFuZCBjIDwgNThcbiAgICAgICAgcmVzdWx0ICs9ICgoKDQ3IC0gYykgJiAoYyAtIDU4KSkgPj4+IDgpICYgKC1JTlZBTElEX0JZVEUgKyBjIC0gNDggKyA1Mik7XG4gICAgICAgIC8vIGMgPiA2NCBhbmQgYyA8IDkxXG4gICAgICAgIHJlc3VsdCArPSAoKCg2NCAtIGMpICYgKGMgLSA5MSkpID4+PiA4KSAmICgtSU5WQUxJRF9CWVRFICsgYyAtIDY1ICsgMCk7XG4gICAgICAgIC8vIGMgPiA5NiBhbmQgYyA8IDEyM1xuICAgICAgICByZXN1bHQgKz0gKCgoOTYgLSBjKSAmIChjIC0gMTIzKSkgPj4+IDgpICYgKC1JTlZBTElEX0JZVEUgKyBjIC0gOTcgKyAyNik7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9nZXRQYWRkaW5nTGVuZ3RoKHM6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGxldCBwYWRkaW5nTGVuZ3RoID0gMDtcbiAgICAgICAgaWYgKHRoaXMuX3BhZGRpbmdDaGFyYWN0ZXIpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNbaV0gIT09IHRoaXMuX3BhZGRpbmdDaGFyYWN0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBhZGRpbmdMZW5ndGgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLmxlbmd0aCA8IDQgfHwgcGFkZGluZ0xlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCYXNlNjRDb2RlcjogaW5jb3JyZWN0IHBhZGRpbmdcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZGRpbmdMZW5ndGg7XG4gICAgfVxuXG59XG5cbmNvbnN0IHN0ZENvZGVyID0gbmV3IENvZGVyKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNvZGUoZGF0YTogVWludDhBcnJheSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHN0ZENvZGVyLmVuY29kZShkYXRhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZShzOiBzdHJpbmcpOiBVaW50OEFycmF5IHtcbiAgICByZXR1cm4gc3RkQ29kZXIuZGVjb2RlKHMpO1xufVxuXG4vKipcbiAqIEltcGxlbWVudHMgVVJMLXNhZmUgQmFzZTY0IGVuY29kaW5nLlxuICogKFNhbWUgYXMgQmFzZTY0LCBidXQgJysnIGlzIHJlcGxhY2VkIHdpdGggJy0nLCBhbmQgJy8nIHdpdGggJ18nKS5cbiAqXG4gKiBPcGVyYXRlcyBpbiBjb25zdGFudCB0aW1lLlxuICovXG5leHBvcnQgY2xhc3MgVVJMU2FmZUNvZGVyIGV4dGVuZHMgQ29kZXIge1xuICAgIC8vIFVSTC1zYWZlIGVuY29kaW5nIGhhdmUgdGhlIGZvbGxvd2luZyBlbmNvZGVkL2RlY29kZWQgcmFuZ2VzOlxuICAgIC8vXG4gICAgLy8gQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVogYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXogMDEyMzQ1Njc4OSAgLSAgIF9cbiAgICAvLyBJbmRleDogICAwIC0gMjUgICAgICAgICAgICAgICAgICAgIDI2IC0gNTEgICAgICAgICAgICAgIDUyIC0gNjEgICA2MiAgNjNcbiAgICAvLyBBU0NJSTogIDY1IC0gOTAgICAgICAgICAgICAgICAgICAgIDk3IC0gMTIyICAgICAgICAgICAgIDQ4IC0gNTcgICA0NSAgOTVcbiAgICAvL1xuXG4gICAgcHJvdGVjdGVkIF9lbmNvZGVCeXRlKGI6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIGxldCByZXN1bHQgPSBiO1xuICAgICAgICAvLyBiID49IDBcbiAgICAgICAgcmVzdWx0ICs9IDY1O1xuICAgICAgICAvLyBiID4gMjVcbiAgICAgICAgcmVzdWx0ICs9ICgoMjUgLSBiKSA+Pj4gOCkgJiAoKDAgLSA2NSkgLSAyNiArIDk3KTtcbiAgICAgICAgLy8gYiA+IDUxXG4gICAgICAgIHJlc3VsdCArPSAoKDUxIC0gYikgPj4+IDgpICYgKCgyNiAtIDk3KSAtIDUyICsgNDgpO1xuICAgICAgICAvLyBiID4gNjFcbiAgICAgICAgcmVzdWx0ICs9ICgoNjEgLSBiKSA+Pj4gOCkgJiAoKDUyIC0gNDgpIC0gNjIgKyA0NSk7XG4gICAgICAgIC8vIGIgPiA2MlxuICAgICAgICByZXN1bHQgKz0gKCg2MiAtIGIpID4+PiA4KSAmICgoNjIgLSA0NSkgLSA2MyArIDk1KTtcblxuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShyZXN1bHQpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfZGVjb2RlQ2hhcihjOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBsZXQgcmVzdWx0ID0gSU5WQUxJRF9CWVRFO1xuXG4gICAgICAgIC8vIGMgPT0gNDUgKGMgPiA0NCBhbmQgYyA8IDQ2KVxuICAgICAgICByZXN1bHQgKz0gKCgoNDQgLSBjKSAmIChjIC0gNDYpKSA+Pj4gOCkgJiAoLUlOVkFMSURfQllURSArIGMgLSA0NSArIDYyKTtcbiAgICAgICAgLy8gYyA9PSA5NSAoYyA+IDk0IGFuZCBjIDwgOTYpXG4gICAgICAgIHJlc3VsdCArPSAoKCg5NCAtIGMpICYgKGMgLSA5NikpID4+PiA4KSAmICgtSU5WQUxJRF9CWVRFICsgYyAtIDk1ICsgNjMpO1xuICAgICAgICAvLyBjID4gNDcgYW5kIGMgPCA1OFxuICAgICAgICByZXN1bHQgKz0gKCgoNDcgLSBjKSAmIChjIC0gNTgpKSA+Pj4gOCkgJiAoLUlOVkFMSURfQllURSArIGMgLSA0OCArIDUyKTtcbiAgICAgICAgLy8gYyA+IDY0IGFuZCBjIDwgOTFcbiAgICAgICAgcmVzdWx0ICs9ICgoKDY0IC0gYykgJiAoYyAtIDkxKSkgPj4+IDgpICYgKC1JTlZBTElEX0JZVEUgKyBjIC0gNjUgKyAwKTtcbiAgICAgICAgLy8gYyA+IDk2IGFuZCBjIDwgMTIzXG4gICAgICAgIHJlc3VsdCArPSAoKCg5NiAtIGMpICYgKGMgLSAxMjMpKSA+Pj4gOCkgJiAoLUlOVkFMSURfQllURSArIGMgLSA5NyArIDI2KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cblxuY29uc3QgdXJsU2FmZUNvZGVyID0gbmV3IFVSTFNhZmVDb2RlcigpO1xuXG5leHBvcnQgZnVuY3Rpb24gZW5jb2RlVVJMU2FmZShkYXRhOiBVaW50OEFycmF5KTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXJsU2FmZUNvZGVyLmVuY29kZShkYXRhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY29kZVVSTFNhZmUoczogc3RyaW5nKTogVWludDhBcnJheSB7XG4gICAgcmV0dXJuIHVybFNhZmVDb2Rlci5kZWNvZGUocyk7XG59XG5cblxuZXhwb3J0IGNvbnN0IGVuY29kZWRMZW5ndGggPSAobGVuZ3RoOiBudW1iZXIpID0+XG4gICAgc3RkQ29kZXIuZW5jb2RlZExlbmd0aChsZW5ndGgpO1xuXG5leHBvcnQgY29uc3QgbWF4RGVjb2RlZExlbmd0aCA9IChsZW5ndGg6IG51bWJlcikgPT5cbiAgICBzdGRDb2Rlci5tYXhEZWNvZGVkTGVuZ3RoKGxlbmd0aCk7XG5cbmV4cG9ydCBjb25zdCBkZWNvZGVkTGVuZ3RoID0gKHM6IHN0cmluZykgPT5cbiAgICBzdGRDb2Rlci5kZWNvZGVkTGVuZ3RoKHMpO1xuIiwgIi8vIENvcHlyaWdodCAoQykgMjAxNiBEbWl0cnkgQ2hlc3RueWtoXG4vLyBNSVQgTGljZW5zZS4gU2VlIExJQ0VOU0UgZmlsZSBmb3IgZGV0YWlscy5cblxuLyoqXG4gKiBQYWNrYWdlIHV0ZjggaW1wbGVtZW50cyBVVEYtOCBlbmNvZGluZyBhbmQgZGVjb2RpbmcuXG4gKi9cblxuY29uc3QgSU5WQUxJRF9VVEYxNiA9IFwidXRmODogaW52YWxpZCBzdHJpbmdcIjtcbmNvbnN0IElOVkFMSURfVVRGOCA9IFwidXRmODogaW52YWxpZCBzb3VyY2UgZW5jb2RpbmdcIjtcblxuLyoqXG4gKiBFbmNvZGVzIHRoZSBnaXZlbiBzdHJpbmcgaW50byBVVEYtOCBieXRlIGFycmF5LlxuICogVGhyb3dzIGlmIHRoZSBzb3VyY2Ugc3RyaW5nIGhhcyBpbnZhbGlkIFVURi0xNiBlbmNvZGluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZShzOiBzdHJpbmcpOiBVaW50OEFycmF5IHtcbiAgICAvLyBDYWxjdWxhdGUgcmVzdWx0IGxlbmd0aCBhbmQgYWxsb2NhdGUgb3V0cHV0IGFycmF5LlxuICAgIC8vIGVuY29kZWRMZW5ndGgoKSBhbHNvIHZhbGlkYXRlcyBzdHJpbmcgYW5kIHRocm93cyBlcnJvcnMsXG4gICAgLy8gc28gd2UgZG9uJ3QgbmVlZCByZXBlYXQgdmFsaWRhdGlvbiBoZXJlLlxuICAgIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KGVuY29kZWRMZW5ndGgocykpO1xuXG4gICAgbGV0IHBvcyA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBjID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoYyA8IDB4ODApIHtcbiAgICAgICAgICAgIGFycltwb3MrK10gPSBjO1xuICAgICAgICB9IGVsc2UgaWYgKGMgPCAweDgwMCkge1xuICAgICAgICAgICAgYXJyW3BvcysrXSA9IDB4YzAgfCBjID4+IDY7XG4gICAgICAgICAgICBhcnJbcG9zKytdID0gMHg4MCB8IGMgJiAweDNmO1xuICAgICAgICB9IGVsc2UgaWYgKGMgPCAweGQ4MDApIHtcbiAgICAgICAgICAgIGFycltwb3MrK10gPSAweGUwIHwgYyA+PiAxMjtcbiAgICAgICAgICAgIGFycltwb3MrK10gPSAweDgwIHwgKGMgPj4gNikgJiAweDNmO1xuICAgICAgICAgICAgYXJyW3BvcysrXSA9IDB4ODAgfCBjICYgMHgzZjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGkrKzsgLy8gZ2V0IG9uZSBtb3JlIGNoYXJhY3RlclxuICAgICAgICAgICAgYyA9IChjICYgMHgzZmYpIDw8IDEwO1xuICAgICAgICAgICAgYyB8PSBzLmNoYXJDb2RlQXQoaSkgJiAweDNmZjtcbiAgICAgICAgICAgIGMgKz0gMHgxMDAwMDtcblxuICAgICAgICAgICAgYXJyW3BvcysrXSA9IDB4ZjAgfCBjID4+IDE4O1xuICAgICAgICAgICAgYXJyW3BvcysrXSA9IDB4ODAgfCAoYyA+PiAxMikgJiAweDNmO1xuICAgICAgICAgICAgYXJyW3BvcysrXSA9IDB4ODAgfCAoYyA+PiA2KSAmIDB4M2Y7XG4gICAgICAgICAgICBhcnJbcG9zKytdID0gMHg4MCB8IGMgJiAweDNmO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGJ5dGVzIHJlcXVpcmVkIHRvIGVuY29kZSB0aGUgZ2l2ZW4gc3RyaW5nIGludG8gVVRGLTguXG4gKiBUaHJvd3MgaWYgdGhlIHNvdXJjZSBzdHJpbmcgaGFzIGludmFsaWQgVVRGLTE2IGVuY29kaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5jb2RlZExlbmd0aChzOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIGxldCByZXN1bHQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoYyA8IDB4ODApIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKGMgPCAweDgwMCkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IDI7XG4gICAgICAgIH0gZWxzZSBpZiAoYyA8IDB4ZDgwMCkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IDM7XG4gICAgICAgIH0gZWxzZSBpZiAoYyA8PSAweGRmZmYpIHtcbiAgICAgICAgICAgIGlmIChpID49IHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihJTlZBTElEX1VURjE2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKzsgLy8gXCJlYXRcIiBuZXh0IGNoYXJhY3RlclxuICAgICAgICAgICAgcmVzdWx0ICs9IDQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5WQUxJRF9VVEYxNik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZWNvZGVzIHRoZSBnaXZlbiBieXRlIGFycmF5IGZyb20gVVRGLTggaW50byBhIHN0cmluZy5cbiAqIFRocm93cyBpZiBlbmNvZGluZyBpcyBpbnZhbGlkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVjb2RlKGFycjogVWludDhBcnJheSk6IHN0cmluZyB7XG4gICAgY29uc3QgY2hhcnM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGIgPSBhcnJbaV07XG5cbiAgICAgICAgaWYgKGIgJiAweDgwKSB7XG4gICAgICAgICAgICBsZXQgbWluO1xuICAgICAgICAgICAgaWYgKGIgPCAweGUwKSB7XG4gICAgICAgICAgICAgICAgLy8gTmVlZCAxIG1vcmUgYnl0ZS5cbiAgICAgICAgICAgICAgICBpZiAoaSA+PSBhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihJTlZBTElEX1VURjgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBuMSA9IGFyclsrK2ldO1xuICAgICAgICAgICAgICAgIGlmICgobjEgJiAweGMwKSAhPT0gMHg4MCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5WQUxJRF9VVEY4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYiA9IChiICYgMHgxZikgPDwgNiB8IChuMSAmIDB4M2YpO1xuICAgICAgICAgICAgICAgIG1pbiA9IDB4ODA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGIgPCAweGYwKSB7XG4gICAgICAgICAgICAgICAgLy8gTmVlZCAyIG1vcmUgYnl0ZXMuXG4gICAgICAgICAgICAgICAgaWYgKGkgPj0gYXJyLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKElOVkFMSURfVVRGOCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IG4xID0gYXJyWysraV07XG4gICAgICAgICAgICAgICAgY29uc3QgbjIgPSBhcnJbKytpXTtcbiAgICAgICAgICAgICAgICBpZiAoKG4xICYgMHhjMCkgIT09IDB4ODAgfHwgKG4yICYgMHhjMCkgIT09IDB4ODApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKElOVkFMSURfVVRGOCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGIgPSAoYiAmIDB4MGYpIDw8IDEyIHwgKG4xICYgMHgzZikgPDwgNiB8IChuMiAmIDB4M2YpO1xuICAgICAgICAgICAgICAgIG1pbiA9IDB4ODAwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiIDwgMHhmOCkge1xuICAgICAgICAgICAgICAgIC8vIE5lZWQgMyBtb3JlIGJ5dGVzLlxuICAgICAgICAgICAgICAgIGlmIChpID49IGFyci5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihJTlZBTElEX1VURjgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBuMSA9IGFyclsrK2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IG4yID0gYXJyWysraV07XG4gICAgICAgICAgICAgICAgY29uc3QgbjMgPSBhcnJbKytpXTtcbiAgICAgICAgICAgICAgICBpZiAoKG4xICYgMHhjMCkgIT09IDB4ODAgfHwgKG4yICYgMHhjMCkgIT09IDB4ODAgfHwgKG4zICYgMHhjMCkgIT09IDB4ODApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKElOVkFMSURfVVRGOCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGIgPSAoYiAmIDB4MGYpIDw8IDE4IHwgKG4xICYgMHgzZikgPDwgMTIgfCAobjIgJiAweDNmKSA8PCA2IHwgKG4zICYgMHgzZik7XG4gICAgICAgICAgICAgICAgbWluID0gMHgxMDAwMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKElOVkFMSURfVVRGOCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChiIDwgbWluIHx8IChiID49IDB4ZDgwMCAmJiBiIDw9IDB4ZGZmZikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSU5WQUxJRF9VVEY4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGIgPj0gMHgxMDAwMCkge1xuICAgICAgICAgICAgICAgIC8vIFN1cnJvZ2F0ZSBwYWlyLlxuICAgICAgICAgICAgICAgIGlmIChiID4gMHgxMGZmZmYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKElOVkFMSURfVVRGOCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGIgLT0gMHgxMDAwMDtcbiAgICAgICAgICAgICAgICBjaGFycy5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoMHhkODAwIHwgKGIgPj4gMTApKSk7XG4gICAgICAgICAgICAgICAgYiA9IDB4ZGMwMCB8IChiICYgMHgzZmYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2hhcnMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGIpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoYXJzLmpvaW4oXCJcIik7XG59XG4iLCAiLy8gcmVxdWlyZWQgc28gd2UgZG9uJ3QgaGF2ZSB0byBkbyByZXF1aXJlKCdwdXNoZXInKS5kZWZhdWx0IGV0Yy5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9wdXNoZXInKS5kZWZhdWx0O1xuIiwgImltcG9ydCBTY3JpcHRSZWNlaXZlciBmcm9tICcuL3NjcmlwdF9yZWNlaXZlcic7XG5cbi8qKiBCdWlsZHMgcmVjZWl2ZXJzIGZvciBKU09OUCBhbmQgU2NyaXB0IHJlcXVlc3RzLlxuICpcbiAqIEVhY2ggcmVjZWl2ZXIgaXMgYW4gb2JqZWN0IHdpdGggZm9sbG93aW5nIGZpZWxkczpcbiAqIC0gbnVtYmVyIC0gdW5pcXVlIChmb3IgdGhlIGZhY3RvcnkgaW5zdGFuY2UpLCBudW1lcmljYWwgaWQgb2YgdGhlIHJlY2VpdmVyXG4gKiAtIGlkIC0gYSBzdHJpbmcgSUQgdGhhdCBjYW4gYmUgdXNlZCBpbiBET00gYXR0cmlidXRlc1xuICogLSBuYW1lIC0gbmFtZSBvZiB0aGUgZnVuY3Rpb24gdHJpZ2dlcmluZyB0aGUgcmVjZWl2ZXJcbiAqIC0gY2FsbGJhY2sgLSBjYWxsYmFjayBmdW5jdGlvblxuICpcbiAqIFJlY2VpdmVycyBhcmUgdHJpZ2dlcmVkIG9ubHkgb25jZSwgb24gdGhlIGZpcnN0IGNhbGxiYWNrIGNhbGwuXG4gKlxuICogUmVjZWl2ZXJzIGNhbiBiZSBjYWxsZWQgYnkgdGhlaXIgbmFtZSBvciBieSBhY2Nlc3NpbmcgZmFjdG9yeSBvYmplY3RcbiAqIGJ5IHRoZSBudW1iZXIga2V5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXggdGhlIHByZWZpeCB1c2VkIGluIGlkc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgdGhlIG5hbWUgb2YgdGhlIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgU2NyaXB0UmVjZWl2ZXJGYWN0b3J5IHtcbiAgbGFzdElkOiBudW1iZXI7XG4gIHByZWZpeDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJlZml4OiBzdHJpbmcsIG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMubGFzdElkID0gMDtcbiAgICB0aGlzLnByZWZpeCA9IHByZWZpeDtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICB9XG5cbiAgY3JlYXRlKGNhbGxiYWNrOiBGdW5jdGlvbik6IFNjcmlwdFJlY2VpdmVyIHtcbiAgICB0aGlzLmxhc3RJZCsrO1xuXG4gICAgdmFyIG51bWJlciA9IHRoaXMubGFzdElkO1xuICAgIHZhciBpZCA9IHRoaXMucHJlZml4ICsgbnVtYmVyO1xuICAgIHZhciBuYW1lID0gdGhpcy5uYW1lICsgJ1snICsgbnVtYmVyICsgJ10nO1xuXG4gICAgdmFyIGNhbGxlZCA9IGZhbHNlO1xuICAgIHZhciBjYWxsYmFja1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghY2FsbGVkKSB7XG4gICAgICAgIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXNbbnVtYmVyXSA9IGNhbGxiYWNrV3JhcHBlcjtcbiAgICByZXR1cm4geyBudW1iZXI6IG51bWJlciwgaWQ6IGlkLCBuYW1lOiBuYW1lLCBjYWxsYmFjazogY2FsbGJhY2tXcmFwcGVyIH07XG4gIH1cblxuICByZW1vdmUocmVjZWl2ZXI6IFNjcmlwdFJlY2VpdmVyKSB7XG4gICAgZGVsZXRlIHRoaXNbcmVjZWl2ZXIubnVtYmVyXTtcbiAgfVxufVxuXG5leHBvcnQgdmFyIFNjcmlwdFJlY2VpdmVycyA9IG5ldyBTY3JpcHRSZWNlaXZlckZhY3RvcnkoXG4gICdfcHVzaGVyX3NjcmlwdF8nLFxuICAnUHVzaGVyLlNjcmlwdFJlY2VpdmVycydcbik7XG4iLCAiaW1wb3J0IHtcbiAgQ2hhbm5lbEF1dGhvcml6YXRpb25PcHRpb25zLFxuICBVc2VyQXV0aGVudGljYXRpb25PcHRpb25zXG59IGZyb20gJy4vYXV0aC9vcHRpb25zJztcbmltcG9ydCB7IEF1dGhUcmFuc3BvcnQgfSBmcm9tICcuL2NvbmZpZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVmYXVsdENvbmZpZyB7XG4gIFZFUlNJT046IHN0cmluZztcbiAgUFJPVE9DT0w6IG51bWJlcjtcbiAgd3NQb3J0OiBudW1iZXI7XG4gIHdzc1BvcnQ6IG51bWJlcjtcbiAgd3NQYXRoOiBzdHJpbmc7XG4gIGh0dHBIb3N0OiBzdHJpbmc7XG4gIGh0dHBQb3J0OiBudW1iZXI7XG4gIGh0dHBzUG9ydDogbnVtYmVyO1xuICBodHRwUGF0aDogc3RyaW5nO1xuICBzdGF0c19ob3N0OiBzdHJpbmc7XG4gIGF1dGhFbmRwb2ludDogc3RyaW5nO1xuICBhdXRoVHJhbnNwb3J0OiBBdXRoVHJhbnNwb3J0O1xuICBhY3Rpdml0eVRpbWVvdXQ6IG51bWJlcjtcbiAgcG9uZ1RpbWVvdXQ6IG51bWJlcjtcbiAgdW5hdmFpbGFibGVUaW1lb3V0OiBudW1iZXI7XG4gIGNsdXN0ZXI6IHN0cmluZztcbiAgdXNlckF1dGhlbnRpY2F0aW9uOiBVc2VyQXV0aGVudGljYXRpb25PcHRpb25zO1xuICBjaGFubmVsQXV0aG9yaXphdGlvbjogQ2hhbm5lbEF1dGhvcml6YXRpb25PcHRpb25zO1xuXG4gIGNkbl9odHRwPzogc3RyaW5nO1xuICBjZG5faHR0cHM/OiBzdHJpbmc7XG4gIGRlcGVuZGVuY3lfc3VmZml4Pzogc3RyaW5nO1xufVxuXG52YXIgRGVmYXVsdHM6IERlZmF1bHRDb25maWcgPSB7XG4gIFZFUlNJT046IFZFUlNJT04sXG4gIFBST1RPQ09MOiA3LFxuXG4gIHdzUG9ydDogODAsXG4gIHdzc1BvcnQ6IDQ0MyxcbiAgd3NQYXRoOiAnJyxcbiAgLy8gREVQUkVDQVRFRDogU29ja0pTIGZhbGxiYWNrIHBhcmFtZXRlcnNcbiAgaHR0cEhvc3Q6ICdzb2NranMucHVzaGVyLmNvbScsXG4gIGh0dHBQb3J0OiA4MCxcbiAgaHR0cHNQb3J0OiA0NDMsXG4gIGh0dHBQYXRoOiAnL3B1c2hlcicsXG4gIC8vIERFUFJFQ0FURUQ6IFN0YXRzXG4gIHN0YXRzX2hvc3Q6ICdzdGF0cy5wdXNoZXIuY29tJyxcbiAgLy8gREVQUkVDQVRFRDogT3RoZXIgc2V0dGluZ3NcbiAgYXV0aEVuZHBvaW50OiAnL3B1c2hlci9hdXRoJyxcbiAgYXV0aFRyYW5zcG9ydDogJ2FqYXgnLFxuICBhY3Rpdml0eVRpbWVvdXQ6IDEyMDAwMCxcbiAgcG9uZ1RpbWVvdXQ6IDMwMDAwLFxuICB1bmF2YWlsYWJsZVRpbWVvdXQ6IDEwMDAwLFxuICBjbHVzdGVyOiAnbXQxJyxcbiAgdXNlckF1dGhlbnRpY2F0aW9uOiB7XG4gICAgZW5kcG9pbnQ6ICcvcHVzaGVyL3VzZXItYXV0aCcsXG4gICAgdHJhbnNwb3J0OiAnYWpheCdcbiAgfSxcbiAgY2hhbm5lbEF1dGhvcml6YXRpb246IHtcbiAgICBlbmRwb2ludDogJy9wdXNoZXIvYXV0aCcsXG4gICAgdHJhbnNwb3J0OiAnYWpheCdcbiAgfSxcblxuICAvLyBDRE4gY29uZmlndXJhdGlvblxuICBjZG5faHR0cDogQ0ROX0hUVFAsXG4gIGNkbl9odHRwczogQ0ROX0hUVFBTLFxuICBkZXBlbmRlbmN5X3N1ZmZpeDogREVQRU5ERU5DWV9TVUZGSVhcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERlZmF1bHRzO1xuIiwgImltcG9ydCB7XG4gIFNjcmlwdFJlY2VpdmVycyxcbiAgU2NyaXB0UmVjZWl2ZXJGYWN0b3J5XG59IGZyb20gJy4vc2NyaXB0X3JlY2VpdmVyX2ZhY3RvcnknO1xuaW1wb3J0IFJ1bnRpbWUgZnJvbSAncnVudGltZSc7XG5pbXBvcnQgU2NyaXB0UmVxdWVzdCBmcm9tICcuL3NjcmlwdF9yZXF1ZXN0JztcblxuLyoqIEhhbmRsZXMgbG9hZGluZyBkZXBlbmRlbmN5IGZpbGVzLlxuICpcbiAqIERlcGVuZGVuY3kgbG9hZGVycyBkb24ndCByZW1lbWJlciB3aGV0aGVyIGEgcmVzb3VyY2UgaGFzIGJlZW4gbG9hZGVkIG9yXG4gKiBub3QuIEl0IGlzIGNhbGxlcidzIHJlc3BvbnNpYmlsaXR5IHRvIG1ha2Ugc3VyZSB0aGUgcmVzb3VyY2UgaXMgbm90IGxvYWRlZFxuICogdHdpY2UuIFRoaXMgaXMgYmVjYXVzZSBpdCdzIGltcG9zc2libGUgdG8gZGV0ZWN0IHJlc291cmNlIGxvYWRpbmcgc3RhdHVzXG4gKiB3aXRob3V0IGtub3dpbmcgaXRzIGNvbnRlbnQuXG4gKlxuICogT3B0aW9uczpcbiAqIC0gY2RuX2h0dHAgLSB1cmwgdG8gSFRUUCBDTkRcbiAqIC0gY2RuX2h0dHBzIC0gdXJsIHRvIEhUVFBTIENETlxuICogLSB2ZXJzaW9uIC0gdmVyc2lvbiBvZiBwdXNoZXItanNcbiAqIC0gc3VmZml4IC0gc3VmZml4IGFwcGVuZGVkIHRvIGFsbCBuYW1lcyBvZiBkZXBlbmRlbmN5IGZpbGVzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVwZW5kZW5jeUxvYWRlciB7XG4gIG9wdGlvbnM6IGFueTtcbiAgcmVjZWl2ZXJzOiBTY3JpcHRSZWNlaXZlckZhY3Rvcnk7XG4gIGxvYWRpbmc6IGFueTtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBhbnkpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMucmVjZWl2ZXJzID0gb3B0aW9ucy5yZWNlaXZlcnMgfHwgU2NyaXB0UmVjZWl2ZXJzO1xuICAgIHRoaXMubG9hZGluZyA9IHt9O1xuICB9XG5cbiAgLyoqIExvYWRzIHRoZSBkZXBlbmRlbmN5IGZyb20gQ0ROLlxuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBsb2FkKG5hbWU6IHN0cmluZywgb3B0aW9uczogYW55LCBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5sb2FkaW5nW25hbWVdICYmIHNlbGYubG9hZGluZ1tuYW1lXS5sZW5ndGggPiAwKSB7XG4gICAgICBzZWxmLmxvYWRpbmdbbmFtZV0ucHVzaChjYWxsYmFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYubG9hZGluZ1tuYW1lXSA9IFtjYWxsYmFja107XG5cbiAgICAgIHZhciByZXF1ZXN0ID0gUnVudGltZS5jcmVhdGVTY3JpcHRSZXF1ZXN0KHNlbGYuZ2V0UGF0aChuYW1lLCBvcHRpb25zKSk7XG4gICAgICB2YXIgcmVjZWl2ZXIgPSBzZWxmLnJlY2VpdmVycy5jcmVhdGUoZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgc2VsZi5yZWNlaXZlcnMucmVtb3ZlKHJlY2VpdmVyKTtcblxuICAgICAgICBpZiAoc2VsZi5sb2FkaW5nW25hbWVdKSB7XG4gICAgICAgICAgdmFyIGNhbGxiYWNrcyA9IHNlbGYubG9hZGluZ1tuYW1lXTtcbiAgICAgICAgICBkZWxldGUgc2VsZi5sb2FkaW5nW25hbWVdO1xuXG4gICAgICAgICAgdmFyIHN1Y2Nlc3NDYWxsYmFjayA9IGZ1bmN0aW9uKHdhc1N1Y2Nlc3NmdWwpIHtcbiAgICAgICAgICAgIGlmICghd2FzU3VjY2Vzc2Z1bCkge1xuICAgICAgICAgICAgICByZXF1ZXN0LmNsZWFudXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjYWxsYmFja3NbaV0oZXJyb3IsIHN1Y2Nlc3NDYWxsYmFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlcXVlc3Quc2VuZChyZWNlaXZlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHVybnMgYSByb290IFVSTCBmb3IgcHVzaGVyLWpzIENETi5cbiAgICpcbiAgICogQHJldHVybnMge1N0cmluZ31cbiAgICovXG4gIGdldFJvb3Qob3B0aW9uczogYW55KTogc3RyaW5nIHtcbiAgICB2YXIgY2RuO1xuICAgIHZhciBwcm90b2NvbCA9IFJ1bnRpbWUuZ2V0RG9jdW1lbnQoKS5sb2NhdGlvbi5wcm90b2NvbDtcbiAgICBpZiAoKG9wdGlvbnMgJiYgb3B0aW9ucy51c2VUTFMpIHx8IHByb3RvY29sID09PSAnaHR0cHM6Jykge1xuICAgICAgY2RuID0gdGhpcy5vcHRpb25zLmNkbl9odHRwcztcbiAgICB9IGVsc2Uge1xuICAgICAgY2RuID0gdGhpcy5vcHRpb25zLmNkbl9odHRwO1xuICAgIH1cbiAgICAvLyBtYWtlIHN1cmUgdGhlcmUgYXJlIG5vIGRvdWJsZSBzbGFzaGVzXG4gICAgcmV0dXJuIGNkbi5yZXBsYWNlKC9cXC8qJC8sICcnKSArICcvJyArIHRoaXMub3B0aW9ucy52ZXJzaW9uO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYSBmdWxsIHBhdGggdG8gYSBkZXBlbmRlbmN5IGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAqL1xuICBnZXRQYXRoKG5hbWU6IHN0cmluZywgb3B0aW9uczogYW55KTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSb290KG9wdGlvbnMpICsgJy8nICsgbmFtZSArIHRoaXMub3B0aW9ucy5zdWZmaXggKyAnLmpzJztcbiAgfVxufVxuIiwgImltcG9ydCB7IFNjcmlwdFJlY2VpdmVyRmFjdG9yeSB9IGZyb20gJy4vc2NyaXB0X3JlY2VpdmVyX2ZhY3RvcnknO1xuaW1wb3J0IERlZmF1bHRzIGZyb20gJ2NvcmUvZGVmYXVsdHMnO1xuaW1wb3J0IERlcGVuZGVuY3lMb2FkZXIgZnJvbSAnLi9kZXBlbmRlbmN5X2xvYWRlcic7XG5cbmV4cG9ydCB2YXIgRGVwZW5kZW5jaWVzUmVjZWl2ZXJzID0gbmV3IFNjcmlwdFJlY2VpdmVyRmFjdG9yeShcbiAgJ19wdXNoZXJfZGVwZW5kZW5jaWVzJyxcbiAgJ1B1c2hlci5EZXBlbmRlbmNpZXNSZWNlaXZlcnMnXG4pO1xuXG5leHBvcnQgdmFyIERlcGVuZGVuY2llcyA9IG5ldyBEZXBlbmRlbmN5TG9hZGVyKHtcbiAgY2RuX2h0dHA6IERlZmF1bHRzLmNkbl9odHRwLFxuICBjZG5faHR0cHM6IERlZmF1bHRzLmNkbl9odHRwcyxcbiAgdmVyc2lvbjogRGVmYXVsdHMuVkVSU0lPTixcbiAgc3VmZml4OiBEZWZhdWx0cy5kZXBlbmRlbmN5X3N1ZmZpeCxcbiAgcmVjZWl2ZXJzOiBEZXBlbmRlbmNpZXNSZWNlaXZlcnNcbn0pO1xuIiwgIi8qKlxuICogQSBwbGFjZSB0byBzdG9yZSBoZWxwIFVSTHMgZm9yIGVycm9yIG1lc3NhZ2VzIGV0Y1xuICovXG5cbmNvbnN0IHVybFN0b3JlID0ge1xuICBiYXNlVXJsOiAnaHR0cHM6Ly9wdXNoZXIuY29tJyxcbiAgdXJsczoge1xuICAgIGF1dGhlbnRpY2F0aW9uRW5kcG9pbnQ6IHtcbiAgICAgIHBhdGg6ICcvZG9jcy9jaGFubmVscy9zZXJ2ZXJfYXBpL2F1dGhlbnRpY2F0aW5nX3VzZXJzJ1xuICAgIH0sXG4gICAgYXV0aG9yaXphdGlvbkVuZHBvaW50OiB7XG4gICAgICBwYXRoOiAnL2RvY3MvY2hhbm5lbHMvc2VydmVyX2FwaS9hdXRob3JpemluZy11c2Vycy8nXG4gICAgfSxcbiAgICBqYXZhc2NyaXB0UXVpY2tTdGFydDoge1xuICAgICAgcGF0aDogJy9kb2NzL2phdmFzY3JpcHRfcXVpY2tfc3RhcnQnXG4gICAgfSxcbiAgICB0cmlnZ2VyaW5nQ2xpZW50RXZlbnRzOiB7XG4gICAgICBwYXRoOiAnL2RvY3MvY2xpZW50X2FwaV9ndWlkZS9jbGllbnRfZXZlbnRzI3RyaWdnZXItZXZlbnRzJ1xuICAgIH0sXG4gICAgZW5jcnlwdGVkQ2hhbm5lbFN1cHBvcnQ6IHtcbiAgICAgIGZ1bGxVcmw6XG4gICAgICAgICdodHRwczovL2dpdGh1Yi5jb20vcHVzaGVyL3B1c2hlci1qcy90cmVlL2NjNDkxMDE1MzcxYTRiZGU1NzQzZDFjODdhMGZiYWMwZmViNTMxOTUjZW5jcnlwdGVkLWNoYW5uZWwtc3VwcG9ydCdcbiAgICB9XG4gIH1cbn07XG5cbi8qKiBCdWlsZHMgYSBjb25zaXN0ZW50IHN0cmluZyB3aXRoIGxpbmtzIHRvIHB1c2hlciBkb2N1bWVudGF0aW9uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIHJlbGV2YW50IGtleSBpbiB0aGUgdXJsX3N0b3JlLnVybHMgb2JqZWN0XG4gKiBAcmV0dXJuIHtzdHJpbmd9IHN1ZmZpeCBzdHJpbmcgdG8gYXBwZW5kIHRvIGxvZyBtZXNzYWdlXG4gKi9cbmNvbnN0IGJ1aWxkTG9nU3VmZml4ID0gZnVuY3Rpb24oa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCB1cmxQcmVmaXggPSAnU2VlOic7XG4gIGNvbnN0IHVybE9iaiA9IHVybFN0b3JlLnVybHNba2V5XTtcbiAgaWYgKCF1cmxPYmopIHJldHVybiAnJztcblxuICBsZXQgdXJsO1xuICBpZiAodXJsT2JqLmZ1bGxVcmwpIHtcbiAgICB1cmwgPSB1cmxPYmouZnVsbFVybDtcbiAgfSBlbHNlIGlmICh1cmxPYmoucGF0aCkge1xuICAgIHVybCA9IHVybFN0b3JlLmJhc2VVcmwgKyB1cmxPYmoucGF0aDtcbiAgfVxuXG4gIGlmICghdXJsKSByZXR1cm4gJyc7XG4gIHJldHVybiBgJHt1cmxQcmVmaXh9ICR7dXJsfWA7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGJ1aWxkTG9nU3VmZml4IH07XG4iLCAiZXhwb3J0IGVudW0gQXV0aFJlcXVlc3RUeXBlIHtcbiAgVXNlckF1dGhlbnRpY2F0aW9uID0gJ3VzZXItYXV0aGVudGljYXRpb24nLFxuICBDaGFubmVsQXV0aG9yaXphdGlvbiA9ICdjaGFubmVsLWF1dGhvcml6YXRpb24nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhbm5lbEF1dGhvcml6YXRpb25EYXRhIHtcbiAgYXV0aDogc3RyaW5nO1xuICBjaGFubmVsX2RhdGE/OiBzdHJpbmc7XG4gIHNoYXJlZF9zZWNyZXQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIENoYW5uZWxBdXRob3JpemF0aW9uQ2FsbGJhY2sgPSAoXG4gIGVycm9yOiBFcnJvciB8IG51bGwsXG4gIGF1dGhEYXRhOiBDaGFubmVsQXV0aG9yaXphdGlvbkRhdGEgfCBudWxsXG4pID0+IHZvaWQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhbm5lbEF1dGhvcml6YXRpb25SZXF1ZXN0UGFyYW1zIHtcbiAgc29ja2V0SWQ6IHN0cmluZztcbiAgY2hhbm5lbE5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDaGFubmVsQXV0aG9yaXphdGlvbkhhbmRsZXIge1xuICAoXG4gICAgcGFyYW1zOiBDaGFubmVsQXV0aG9yaXphdGlvblJlcXVlc3RQYXJhbXMsXG4gICAgY2FsbGJhY2s6IENoYW5uZWxBdXRob3JpemF0aW9uQ2FsbGJhY2tcbiAgKTogdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVc2VyQXV0aGVudGljYXRpb25EYXRhIHtcbiAgYXV0aDogc3RyaW5nO1xuICB1c2VyX2RhdGE6IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgVXNlckF1dGhlbnRpY2F0aW9uQ2FsbGJhY2sgPSAoXG4gIGVycm9yOiBFcnJvciB8IG51bGwsXG4gIGF1dGhEYXRhOiBVc2VyQXV0aGVudGljYXRpb25EYXRhIHwgbnVsbFxuKSA9PiB2b2lkO1xuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJBdXRoZW50aWNhdGlvblJlcXVlc3RQYXJhbXMge1xuICBzb2NrZXRJZDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJBdXRoZW50aWNhdGlvbkhhbmRsZXIge1xuICAoXG4gICAgcGFyYW1zOiBVc2VyQXV0aGVudGljYXRpb25SZXF1ZXN0UGFyYW1zLFxuICAgIGNhbGxiYWNrOiBVc2VyQXV0aGVudGljYXRpb25DYWxsYmFja1xuICApOiB2b2lkO1xufVxuXG5leHBvcnQgdHlwZSBBdXRoVHJhbnNwb3J0Q2FsbGJhY2sgPVxuICB8IENoYW5uZWxBdXRob3JpemF0aW9uQ2FsbGJhY2tcbiAgfCBVc2VyQXV0aGVudGljYXRpb25DYWxsYmFjaztcblxuZXhwb3J0IGludGVyZmFjZSBBdXRoT3B0aW9uc1Q8QXV0aEhhbmRsZXI+IHtcbiAgdHJhbnNwb3J0OiAnYWpheCcgfCAnanNvbnAnO1xuICBlbmRwb2ludDogc3RyaW5nO1xuICBwYXJhbXM/OiBhbnk7XG4gIGhlYWRlcnM/OiBhbnk7XG4gIHBhcmFtc1Byb3ZpZGVyPzogKCkgPT4gYW55O1xuICBoZWFkZXJzUHJvdmlkZXI/OiAoKSA9PiBhbnk7XG4gIGN1c3RvbUhhbmRsZXI/OiBBdXRoSGFuZGxlcjtcbn1cblxuZXhwb3J0IGRlY2xhcmUgdHlwZSBVc2VyQXV0aGVudGljYXRpb25PcHRpb25zID0gQXV0aE9wdGlvbnNUPFxuICBVc2VyQXV0aGVudGljYXRpb25IYW5kbGVyXG4+O1xuZXhwb3J0IGRlY2xhcmUgdHlwZSBDaGFubmVsQXV0aG9yaXphdGlvbk9wdGlvbnMgPSBBdXRoT3B0aW9uc1Q8XG4gIENoYW5uZWxBdXRob3JpemF0aW9uSGFuZGxlclxuPjtcblxuZXhwb3J0IGludGVyZmFjZSBJbnRlcm5hbEF1dGhPcHRpb25zIHtcbiAgdHJhbnNwb3J0OiAnYWpheCcgfCAnanNvbnAnO1xuICBlbmRwb2ludDogc3RyaW5nO1xuICBwYXJhbXM/OiBhbnk7XG4gIGhlYWRlcnM/OiBhbnk7XG4gIHBhcmFtc1Byb3ZpZGVyPzogKCkgPT4gYW55O1xuICBoZWFkZXJzUHJvdmlkZXI/OiAoKSA9PiBhbnk7XG59XG4iLCAiLyoqIEVycm9yIGNsYXNzZXMgdXNlZCB0aHJvdWdob3V0IHRoZSBsaWJyYXJ5LiAqL1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0LXdpa2kvYmxvYi9tYXN0ZXIvQnJlYWtpbmctQ2hhbmdlcy5tZCNleHRlbmRpbmctYnVpbHQtaW5zLWxpa2UtZXJyb3ItYXJyYXktYW5kLW1hcC1tYXktbm8tbG9uZ2VyLXdvcmtcbmV4cG9ydCBjbGFzcyBCYWRFdmVudE5hbWUgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1zZz86IHN0cmluZykge1xuICAgIHN1cGVyKG1zZyk7XG5cbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgbmV3LnRhcmdldC5wcm90b3R5cGUpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCYWRDaGFubmVsTmFtZSBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobXNnPzogc3RyaW5nKSB7XG4gICAgc3VwZXIobXNnKTtcblxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBuZXcudGFyZ2V0LnByb3RvdHlwZSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlcXVlc3RUaW1lZE91dCBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobXNnPzogc3RyaW5nKSB7XG4gICAgc3VwZXIobXNnKTtcblxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBuZXcudGFyZ2V0LnByb3RvdHlwZSk7XG4gIH1cbn1cbmV4cG9ydCBjbGFzcyBUcmFuc3BvcnRQcmlvcml0eVRvb0xvdyBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobXNnPzogc3RyaW5nKSB7XG4gICAgc3VwZXIobXNnKTtcblxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBuZXcudGFyZ2V0LnByb3RvdHlwZSk7XG4gIH1cbn1cbmV4cG9ydCBjbGFzcyBUcmFuc3BvcnRDbG9zZWQgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1zZz86IHN0cmluZykge1xuICAgIHN1cGVyKG1zZyk7XG5cbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgbmV3LnRhcmdldC5wcm90b3R5cGUpO1xuICB9XG59XG5leHBvcnQgY2xhc3MgVW5zdXBwb3J0ZWRGZWF0dXJlIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3Rvcihtc2c/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihtc2cpO1xuXG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIG5ldy50YXJnZXQucHJvdG90eXBlKTtcbiAgfVxufVxuZXhwb3J0IGNsYXNzIFVuc3VwcG9ydGVkVHJhbnNwb3J0IGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3Rvcihtc2c/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihtc2cpO1xuXG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIG5ldy50YXJnZXQucHJvdG90eXBlKTtcbiAgfVxufVxuZXhwb3J0IGNsYXNzIFVuc3VwcG9ydGVkU3RyYXRlZ3kgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1zZz86IHN0cmluZykge1xuICAgIHN1cGVyKG1zZyk7XG5cbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgbmV3LnRhcmdldC5wcm90b3R5cGUpO1xuICB9XG59XG5leHBvcnQgY2xhc3MgSFRUUEF1dGhFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgc3RhdHVzOiBudW1iZXI7XG4gIGNvbnN0cnVjdG9yKHN0YXR1czogbnVtYmVyLCBtc2c/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihtc2cpO1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuXG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIG5ldy50YXJnZXQucHJvdG90eXBlKTtcbiAgfVxufVxuIiwgImltcG9ydCBUaW1lbGluZVNlbmRlciBmcm9tICdjb3JlL3RpbWVsaW5lL3RpbWVsaW5lX3NlbmRlcic7XG5pbXBvcnQgKiBhcyBDb2xsZWN0aW9ucyBmcm9tICdjb3JlL3V0aWxzL2NvbGxlY3Rpb25zJztcbmltcG9ydCBVdGlsIGZyb20gJ2NvcmUvdXRpbCc7XG5pbXBvcnQgUnVudGltZSBmcm9tICdydW50aW1lJztcbmltcG9ydCB7IEF1dGhUcmFuc3BvcnQgfSBmcm9tICdjb3JlL2F1dGgvYXV0aF90cmFuc3BvcnRzJztcbmltcG9ydCBBYnN0cmFjdFJ1bnRpbWUgZnJvbSAncnVudGltZXMvaW50ZXJmYWNlJztcbmltcG9ydCBVcmxTdG9yZSBmcm9tICdjb3JlL3V0aWxzL3VybF9zdG9yZSc7XG5pbXBvcnQge1xuICBBdXRoUmVxdWVzdFR5cGUsXG4gIEF1dGhUcmFuc3BvcnRDYWxsYmFjayxcbiAgSW50ZXJuYWxBdXRoT3B0aW9uc1xufSBmcm9tICdjb3JlL2F1dGgvb3B0aW9ucyc7XG5pbXBvcnQgeyBIVFRQQXV0aEVycm9yIH0gZnJvbSAnY29yZS9lcnJvcnMnO1xuXG5jb25zdCBhamF4OiBBdXRoVHJhbnNwb3J0ID0gZnVuY3Rpb24oXG4gIGNvbnRleHQ6IEFic3RyYWN0UnVudGltZSxcbiAgcXVlcnk6IHN0cmluZyxcbiAgYXV0aE9wdGlvbnM6IEludGVybmFsQXV0aE9wdGlvbnMsXG4gIGF1dGhSZXF1ZXN0VHlwZTogQXV0aFJlcXVlc3RUeXBlLFxuICBjYWxsYmFjazogQXV0aFRyYW5zcG9ydENhbGxiYWNrXG4pIHtcbiAgY29uc3QgeGhyID0gUnVudGltZS5jcmVhdGVYSFIoKTtcbiAgeGhyLm9wZW4oJ1BPU1QnLCBhdXRoT3B0aW9ucy5lbmRwb2ludCwgdHJ1ZSk7XG5cbiAgLy8gYWRkIHJlcXVlc3QgaGVhZGVyc1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuICBmb3IgKHZhciBoZWFkZXJOYW1lIGluIGF1dGhPcHRpb25zLmhlYWRlcnMpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXJOYW1lLCBhdXRoT3B0aW9ucy5oZWFkZXJzW2hlYWRlck5hbWVdKTtcbiAgfVxuICBpZiAoYXV0aE9wdGlvbnMuaGVhZGVyc1Byb3ZpZGVyICE9IG51bGwpIHtcbiAgICBsZXQgZHluYW1pY0hlYWRlcnMgPSBhdXRoT3B0aW9ucy5oZWFkZXJzUHJvdmlkZXIoKTtcbiAgICBmb3IgKHZhciBoZWFkZXJOYW1lIGluIGR5bmFtaWNIZWFkZXJzKSB7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXJOYW1lLCBkeW5hbWljSGVhZGVyc1toZWFkZXJOYW1lXSk7XG4gICAgfVxuICB9XG5cbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICBsZXQgZGF0YTtcbiAgICAgICAgbGV0IHBhcnNlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgcGFyc2VkID0gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNhbGxiYWNrKFxuICAgICAgICAgICAgbmV3IEhUVFBBdXRoRXJyb3IoXG4gICAgICAgICAgICAgIDIwMCxcbiAgICAgICAgICAgICAgYEpTT04gcmV0dXJuZWQgZnJvbSAke2F1dGhSZXF1ZXN0VHlwZS50b1N0cmluZygpfSBlbmRwb2ludCB3YXMgaW52YWxpZCwgeWV0IHN0YXR1cyBjb2RlIHdhcyAyMDAuIERhdGEgd2FzOiAke1xuICAgICAgICAgICAgICAgIHhoci5yZXNwb25zZVRleHRcbiAgICAgICAgICAgICAgfWBcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBudWxsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJzZWQpIHtcbiAgICAgICAgICAvLyBwcmV2ZW50cyBkb3VibGUgZXhlY3V0aW9uLlxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgc3VmZml4ID0gJyc7XG4gICAgICAgIHN3aXRjaCAoYXV0aFJlcXVlc3RUeXBlKSB7XG4gICAgICAgICAgY2FzZSBBdXRoUmVxdWVzdFR5cGUuVXNlckF1dGhlbnRpY2F0aW9uOlxuICAgICAgICAgICAgc3VmZml4ID0gVXJsU3RvcmUuYnVpbGRMb2dTdWZmaXgoJ2F1dGhlbnRpY2F0aW9uRW5kcG9pbnQnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgQXV0aFJlcXVlc3RUeXBlLkNoYW5uZWxBdXRob3JpemF0aW9uOlxuICAgICAgICAgICAgc3VmZml4ID0gYENsaWVudHMgbXVzdCBiZSBhdXRob3JpemVkIHRvIGpvaW4gcHJpdmF0ZSBvciBwcmVzZW5jZSBjaGFubmVscy4gJHtVcmxTdG9yZS5idWlsZExvZ1N1ZmZpeChcbiAgICAgICAgICAgICAgJ2F1dGhvcml6YXRpb25FbmRwb2ludCdcbiAgICAgICAgICAgICl9YDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKFxuICAgICAgICAgIG5ldyBIVFRQQXV0aEVycm9yKFxuICAgICAgICAgICAgeGhyLnN0YXR1cyxcbiAgICAgICAgICAgIGBVbmFibGUgdG8gcmV0cmlldmUgYXV0aCBzdHJpbmcgZnJvbSAke2F1dGhSZXF1ZXN0VHlwZS50b1N0cmluZygpfSBlbmRwb2ludCAtIGAgK1xuICAgICAgICAgICAgICBgcmVjZWl2ZWQgc3RhdHVzOiAke3hoci5zdGF0dXN9IGZyb20gJHthdXRoT3B0aW9ucy5lbmRwb2ludH0uICR7c3VmZml4fWBcbiAgICAgICAgICApLFxuICAgICAgICAgIG51bGxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgeGhyLnNlbmQocXVlcnkpO1xuICByZXR1cm4geGhyO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYWpheDtcbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbmNvZGUoczogYW55KTogc3RyaW5nIHtcbiAgcmV0dXJuIGJ0b2EodXRvYihzKSk7XG59XG5cbnZhciBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xuXG52YXIgYjY0Y2hhcnMgPVxuICAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG52YXIgYjY0dGFiID0ge307XG5cbmZvciAodmFyIGkgPSAwLCBsID0gYjY0Y2hhcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gIGI2NHRhYltiNjRjaGFycy5jaGFyQXQoaSldID0gaTtcbn1cblxudmFyIGNiX3V0b2IgPSBmdW5jdGlvbihjKSB7XG4gIHZhciBjYyA9IGMuY2hhckNvZGVBdCgwKTtcbiAgcmV0dXJuIGNjIDwgMHg4MFxuICAgID8gY1xuICAgIDogY2MgPCAweDgwMFxuICAgID8gZnJvbUNoYXJDb2RlKDB4YzAgfCAoY2MgPj4+IDYpKSArIGZyb21DaGFyQ29kZSgweDgwIHwgKGNjICYgMHgzZikpXG4gICAgOiBmcm9tQ2hhckNvZGUoMHhlMCB8ICgoY2MgPj4+IDEyKSAmIDB4MGYpKSArXG4gICAgICBmcm9tQ2hhckNvZGUoMHg4MCB8ICgoY2MgPj4+IDYpICYgMHgzZikpICtcbiAgICAgIGZyb21DaGFyQ29kZSgweDgwIHwgKGNjICYgMHgzZikpO1xufTtcblxudmFyIHV0b2IgPSBmdW5jdGlvbih1KSB7XG4gIHJldHVybiB1LnJlcGxhY2UoL1teXFx4MDAtXFx4N0ZdL2csIGNiX3V0b2IpO1xufTtcblxudmFyIGNiX2VuY29kZSA9IGZ1bmN0aW9uKGNjYykge1xuICB2YXIgcGFkbGVuID0gWzAsIDIsIDFdW2NjYy5sZW5ndGggJSAzXTtcbiAgdmFyIG9yZCA9XG4gICAgKGNjYy5jaGFyQ29kZUF0KDApIDw8IDE2KSB8XG4gICAgKChjY2MubGVuZ3RoID4gMSA/IGNjYy5jaGFyQ29kZUF0KDEpIDogMCkgPDwgOCkgfFxuICAgIChjY2MubGVuZ3RoID4gMiA/IGNjYy5jaGFyQ29kZUF0KDIpIDogMCk7XG4gIHZhciBjaGFycyA9IFtcbiAgICBiNjRjaGFycy5jaGFyQXQob3JkID4+PiAxOCksXG4gICAgYjY0Y2hhcnMuY2hhckF0KChvcmQgPj4+IDEyKSAmIDYzKSxcbiAgICBwYWRsZW4gPj0gMiA/ICc9JyA6IGI2NGNoYXJzLmNoYXJBdCgob3JkID4+PiA2KSAmIDYzKSxcbiAgICBwYWRsZW4gPj0gMSA/ICc9JyA6IGI2NGNoYXJzLmNoYXJBdChvcmQgJiA2MylcbiAgXTtcbiAgcmV0dXJuIGNoYXJzLmpvaW4oJycpO1xufTtcblxudmFyIGJ0b2EgPVxuICBnbG9iYWwuYnRvYSB8fFxuICBmdW5jdGlvbihiKSB7XG4gICAgcmV0dXJuIGIucmVwbGFjZSgvW1xcc1xcU117MSwzfS9nLCBjYl9lbmNvZGUpO1xuICB9O1xuIiwgImltcG9ydCBUaW1lZENhbGxiYWNrIGZyb20gJy4vdGltZWRfY2FsbGJhY2snO1xuaW1wb3J0IHsgRGVsYXksIFNjaGVkdWxlciwgQ2FuY2VsbGVyIH0gZnJvbSAnLi9zY2hlZHVsaW5nJztcblxuYWJzdHJhY3QgY2xhc3MgVGltZXIge1xuICBwcm90ZWN0ZWQgY2xlYXI6IENhbmNlbGxlcjtcbiAgcHJvdGVjdGVkIHRpbWVyOiBudW1iZXIgfCB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHNldDogU2NoZWR1bGVyLFxuICAgIGNsZWFyOiBDYW5jZWxsZXIsXG4gICAgZGVsYXk6IERlbGF5LFxuICAgIGNhbGxiYWNrOiBUaW1lZENhbGxiYWNrXG4gICkge1xuICAgIHRoaXMuY2xlYXIgPSBjbGVhcjtcbiAgICB0aGlzLnRpbWVyID0gc2V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnRpbWVyKSB7XG4gICAgICAgIHRoaXMudGltZXIgPSBjYWxsYmFjayh0aGlzLnRpbWVyKTtcbiAgICAgIH1cbiAgICB9LCBkZWxheSk7XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIHRoZSB0aW1lciBpcyBzdGlsbCBydW5uaW5nLlxuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNSdW5uaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRpbWVyICE9PSBudWxsO1xuICB9XG5cbiAgLyoqIEFib3J0cyBhIHRpbWVyIHdoZW4gaXQncyBydW5uaW5nLiAqL1xuICBlbnN1cmVBYm9ydGVkKCkge1xuICAgIGlmICh0aGlzLnRpbWVyKSB7XG4gICAgICB0aGlzLmNsZWFyKHRoaXMudGltZXIpO1xuICAgICAgdGhpcy50aW1lciA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVyO1xuIiwgImltcG9ydCBUaW1lciBmcm9tICcuL2Fic3RyYWN0X3RpbWVyJztcbmltcG9ydCBUaW1lZENhbGxiYWNrIGZyb20gJy4vdGltZWRfY2FsbGJhY2snO1xuaW1wb3J0IHsgRGVsYXkgfSBmcm9tICcuL3NjaGVkdWxpbmcnO1xuXG4vLyBXZSBuZWVkIHRvIGJpbmQgY2xlYXIgZnVuY3Rpb25zIHRoaXMgd2F5IHRvIGF2b2lkIGV4Y2VwdGlvbnMgb24gSUU4XG5mdW5jdGlvbiBjbGVhclRpbWVvdXQodGltZXIpIHtcbiAgZ2xvYmFsLmNsZWFyVGltZW91dCh0aW1lcik7XG59XG5mdW5jdGlvbiBjbGVhckludGVydmFsKHRpbWVyKSB7XG4gIGdsb2JhbC5jbGVhckludGVydmFsKHRpbWVyKTtcbn1cblxuLyoqIENyb3NzLWJyb3dzZXIgY29tcGF0aWJsZSBvbmUtb2ZmIHRpbWVyIGFic3RyYWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGNsYXNzIE9uZU9mZlRpbWVyIGV4dGVuZHMgVGltZXIge1xuICBjb25zdHJ1Y3RvcihkZWxheTogRGVsYXksIGNhbGxiYWNrOiBUaW1lZENhbGxiYWNrKSB7XG4gICAgc3VwZXIoc2V0VGltZW91dCwgY2xlYXJUaW1lb3V0LCBkZWxheSwgZnVuY3Rpb24odGltZXIpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgfVxufVxuXG4vKiogQ3Jvc3MtYnJvd3NlciBjb21wYXRpYmxlIHBlcmlvZGljIHRpbWVyIGFic3RyYWN0aW9uLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGNsYXNzIFBlcmlvZGljVGltZXIgZXh0ZW5kcyBUaW1lciB7XG4gIGNvbnN0cnVjdG9yKGRlbGF5OiBEZWxheSwgY2FsbGJhY2s6IFRpbWVkQ2FsbGJhY2spIHtcbiAgICBzdXBlcihzZXRJbnRlcnZhbCwgY2xlYXJJbnRlcnZhbCwgZGVsYXksIGZ1bmN0aW9uKHRpbWVyKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgICAgcmV0dXJuIHRpbWVyO1xuICAgIH0pO1xuICB9XG59XG4iLCAiaW1wb3J0ICogYXMgQ29sbGVjdGlvbnMgZnJvbSAnLi91dGlscy9jb2xsZWN0aW9ucyc7XG5pbXBvcnQgVGltZWRDYWxsYmFjayBmcm9tICcuL3V0aWxzL3RpbWVycy90aW1lZF9jYWxsYmFjayc7XG5pbXBvcnQgeyBPbmVPZmZUaW1lciwgUGVyaW9kaWNUaW1lciB9IGZyb20gJy4vdXRpbHMvdGltZXJzJztcblxudmFyIFV0aWwgPSB7XG4gIG5vdygpOiBudW1iZXIge1xuICAgIGlmIChEYXRlLm5vdykge1xuICAgICAgcmV0dXJuIERhdGUubm93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgRGF0ZSgpLnZhbHVlT2YoKTtcbiAgICB9XG4gIH0sXG5cbiAgZGVmZXIoY2FsbGJhY2s6IFRpbWVkQ2FsbGJhY2spOiBPbmVPZmZUaW1lciB7XG4gICAgcmV0dXJuIG5ldyBPbmVPZmZUaW1lcigwLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLyoqIEJ1aWxkcyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBwcm94eSBhIG1ldGhvZCBjYWxsIHRvIGl0cyBmaXJzdCBhcmd1bWVudC5cbiAgICpcbiAgICogQWxsb3dzIHBhcnRpYWwgYXBwbGljYXRpb24gb2YgYXJndW1lbnRzLCBzbyBhZGRpdGlvbmFsIGFyZ3VtZW50cyBhcmVcbiAgICogcHJlcGVuZGVkIHRvIHRoZSBhcmd1bWVudCBsaXN0LlxuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IG5hbWUgbWV0aG9kIG5hbWVcbiAgICogQHJldHVybiB7RnVuY3Rpb259IHByb3h5IGZ1bmN0aW9uXG4gICAqL1xuICBtZXRob2QobmFtZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IEZ1bmN0aW9uIHtcbiAgICB2YXIgYm91bmRBcmd1bWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHJldHVybiBvYmplY3RbbmFtZV0uYXBwbHkob2JqZWN0LCBib3VuZEFyZ3VtZW50cy5jb25jYXQoYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgVXRpbDtcbiIsICJpbXBvcnQgYmFzZTY0ZW5jb2RlIGZyb20gJy4uL2Jhc2U2NCc7XG5pbXBvcnQgVXRpbCBmcm9tICcuLi91dGlsJztcblxuLyoqIE1lcmdlcyBtdWx0aXBsZSBvYmplY3RzIGludG8gdGhlIHRhcmdldCBhcmd1bWVudC5cbiAqXG4gKiBGb3IgcHJvcGVydGllcyB0aGF0IGFyZSBwbGFpbiBPYmplY3RzLCBwZXJmb3JtcyBhIGRlZXAtbWVyZ2UuIEZvciB0aGVcbiAqIHJlc3QgaXQganVzdCBjb3BpZXMgdGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eS5cbiAqXG4gKiBUbyBleHRlbmQgcHJvdG90eXBlcyB1c2UgaXQgYXMgZm9sbG93aW5nOlxuICogICBQdXNoZXIuVXRpbC5leHRlbmQoVGFyZ2V0LnByb3RvdHlwZSwgQmFzZS5wcm90b3R5cGUpXG4gKlxuICogWW91IGNhbiBhbHNvIHVzZSBpdCB0byBtZXJnZSBvYmplY3RzIHdpdGhvdXQgYWx0ZXJpbmcgdGhlbTpcbiAqICAgUHVzaGVyLlV0aWwuZXh0ZW5kKHt9LCBvYmplY3QxLCBvYmplY3QyKVxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gdGFyZ2V0XG4gKiBAcmV0dXJuIHtPYmplY3R9IHRoZSB0YXJnZXQgYXJndW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZDxUPih0YXJnZXQ6IGFueSwgLi4uc291cmNlczogYW55W10pOiBUIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGV4dGVuc2lvbnMgPSBzb3VyY2VzW2ldO1xuICAgIGZvciAodmFyIHByb3BlcnR5IGluIGV4dGVuc2lvbnMpIHtcbiAgICAgIGlmIChcbiAgICAgICAgZXh0ZW5zaW9uc1twcm9wZXJ0eV0gJiZcbiAgICAgICAgZXh0ZW5zaW9uc1twcm9wZXJ0eV0uY29uc3RydWN0b3IgJiZcbiAgICAgICAgZXh0ZW5zaW9uc1twcm9wZXJ0eV0uY29uc3RydWN0b3IgPT09IE9iamVjdFxuICAgICAgKSB7XG4gICAgICAgIHRhcmdldFtwcm9wZXJ0eV0gPSBleHRlbmQodGFyZ2V0W3Byb3BlcnR5XSB8fCB7fSwgZXh0ZW5zaW9uc1twcm9wZXJ0eV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IGV4dGVuc2lvbnNbcHJvcGVydHldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5naWZ5KCk6IHN0cmluZyB7XG4gIHZhciBtID0gWydQdXNoZXInXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1tpXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG0ucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtLnB1c2goc2FmZUpTT05TdHJpbmdpZnkoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtLmpvaW4oJyA6ICcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlJbmRleE9mKGFycmF5OiBhbnlbXSwgaXRlbTogYW55KTogbnVtYmVyIHtcbiAgLy8gTVNJRSBkb2Vzbid0IGhhdmUgYXJyYXkuaW5kZXhPZlxuICB2YXIgbmF0aXZlSW5kZXhPZiA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mO1xuICBpZiAoYXJyYXkgPT09IG51bGwpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgaWYgKG5hdGl2ZUluZGV4T2YgJiYgYXJyYXkuaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikge1xuICAgIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pO1xuICB9XG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJyYXkubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKGFycmF5W2ldID09PSBpdGVtKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKiogQXBwbGllcyBhIGZ1bmN0aW9uIGYgdG8gYWxsIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0LlxuICpcbiAqIEZ1bmN0aW9uIGYgZ2V0cyAzIGFyZ3VtZW50cyBwYXNzZWQ6XG4gKiAtIGVsZW1lbnQgZnJvbSB0aGUgb2JqZWN0XG4gKiAtIGtleSBvZiB0aGUgZWxlbWVudFxuICogLSByZWZlcmVuY2UgdG8gdGhlIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9iamVjdEFwcGx5KG9iamVjdDogYW55LCBmOiBGdW5jdGlvbikge1xuICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgIGYob2JqZWN0W2tleV0sIGtleSwgb2JqZWN0KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqIFJldHVybiBhIGxpc3Qgb2Ygb2JqZWN0cyBvd24gcHJvZXJ0eSBrZXlzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICogQHJldHVybnMge0FycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24ga2V5cyhvYmplY3Q6IGFueSk6IHN0cmluZ1tdIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgb2JqZWN0QXBwbHkob2JqZWN0LCBmdW5jdGlvbihfLCBrZXkpIHtcbiAgICBrZXlzLnB1c2goa2V5KTtcbiAgfSk7XG4gIHJldHVybiBrZXlzO1xufVxuXG4vKiogUmV0dXJuIGEgbGlzdCBvZiBvYmplY3QncyBvd24gcHJvcGVydHkgdmFsdWVzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICogQHJldHVybnMge0FycmF5fVxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVzKG9iamVjdDogYW55KTogYW55W10ge1xuICB2YXIgdmFsdWVzID0gW107XG4gIG9iamVjdEFwcGx5KG9iamVjdCwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YWx1ZXMucHVzaCh2YWx1ZSk7XG4gIH0pO1xuICByZXR1cm4gdmFsdWVzO1xufVxuXG4vKiogQXBwbGllcyBhIGZ1bmN0aW9uIGYgdG8gYWxsIGVsZW1lbnRzIG9mIGFuIGFycmF5LlxuICpcbiAqIEZ1bmN0aW9uIGYgZ2V0cyAzIGFyZ3VtZW50cyBwYXNzZWQ6XG4gKiAtIGVsZW1lbnQgZnJvbSB0aGUgYXJyYXlcbiAqIC0gaW5kZXggb2YgdGhlIGVsZW1lbnRcbiAqIC0gcmVmZXJlbmNlIHRvIHRoZSBhcnJheVxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBseShhcnJheTogYW55W10sIGY6IEZ1bmN0aW9uLCBjb250ZXh0PzogYW55KSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBmLmNhbGwoY29udGV4dCB8fCBnbG9iYWwsIGFycmF5W2ldLCBpLCBhcnJheSk7XG4gIH1cbn1cblxuLyoqIE1hcHMgYWxsIGVsZW1lbnRzIG9mIHRoZSBhcnJheSBhbmQgcmV0dXJucyB0aGUgcmVzdWx0LlxuICpcbiAqIEZ1bmN0aW9uIGYgZ2V0cyA0IGFyZ3VtZW50cyBwYXNzZWQ6XG4gKiAtIGVsZW1lbnQgZnJvbSB0aGUgYXJyYXlcbiAqIC0gaW5kZXggb2YgdGhlIGVsZW1lbnRcbiAqIC0gcmVmZXJlbmNlIHRvIHRoZSBzb3VyY2UgYXJyYXlcbiAqIC0gcmVmZXJlbmNlIHRvIHRoZSBkZXN0aW5hdGlvbiBhcnJheVxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXAoYXJyYXk6IGFueVtdLCBmOiBGdW5jdGlvbik6IGFueVtdIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzdWx0LnB1c2goZihhcnJheVtpXSwgaSwgYXJyYXksIHJlc3VsdCkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKiBNYXBzIGFsbCBlbGVtZW50cyBvZiB0aGUgb2JqZWN0IGFuZCByZXR1cm5zIHRoZSByZXN1bHQuXG4gKlxuICogRnVuY3Rpb24gZiBnZXRzIDQgYXJndW1lbnRzIHBhc3NlZDpcbiAqIC0gZWxlbWVudCBmcm9tIHRoZSBvYmplY3RcbiAqIC0ga2V5IG9mIHRoZSBlbGVtZW50XG4gKiAtIHJlZmVyZW5jZSB0byB0aGUgc291cmNlIG9iamVjdFxuICogLSByZWZlcmVuY2UgdG8gdGhlIGRlc3RpbmF0aW9uIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcE9iamVjdChvYmplY3Q6IGFueSwgZjogRnVuY3Rpb24pOiBhbnkge1xuICB2YXIgcmVzdWx0ID0ge307XG4gIG9iamVjdEFwcGx5KG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gZih2YWx1ZSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKiogRmlsdGVycyBlbGVtZW50cyBvZiB0aGUgYXJyYXkgdXNpbmcgYSB0ZXN0IGZ1bmN0aW9uLlxuICpcbiAqIEZ1bmN0aW9uIHRlc3QgZ2V0cyA0IGFyZ3VtZW50cyBwYXNzZWQ6XG4gKiAtIGVsZW1lbnQgZnJvbSB0aGUgYXJyYXlcbiAqIC0gaW5kZXggb2YgdGhlIGVsZW1lbnRcbiAqIC0gcmVmZXJlbmNlIHRvIHRoZSBzb3VyY2UgYXJyYXlcbiAqIC0gcmVmZXJlbmNlIHRvIHRoZSBkZXN0aW5hdGlvbiBhcnJheVxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXIoYXJyYXk6IGFueVtdLCB0ZXN0OiBGdW5jdGlvbik6IGFueVtdIHtcbiAgdGVzdCA9XG4gICAgdGVzdCB8fFxuICAgIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gISF2YWx1ZTtcbiAgICB9O1xuXG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0ZXN0KGFycmF5W2ldLCBpLCBhcnJheSwgcmVzdWx0KSkge1xuICAgICAgcmVzdWx0LnB1c2goYXJyYXlbaV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKiogRmlsdGVycyBwcm9wZXJ0aWVzIG9mIHRoZSBvYmplY3QgdXNpbmcgYSB0ZXN0IGZ1bmN0aW9uLlxuICpcbiAqIEZ1bmN0aW9uIHRlc3QgZ2V0cyA0IGFyZ3VtZW50cyBwYXNzZWQ6XG4gKiAtIGVsZW1lbnQgZnJvbSB0aGUgb2JqZWN0XG4gKiAtIGtleSBvZiB0aGUgZWxlbWVudFxuICogLSByZWZlcmVuY2UgdG8gdGhlIHNvdXJjZSBvYmplY3RcbiAqIC0gcmVmZXJlbmNlIHRvIHRoZSBkZXN0aW5hdGlvbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJPYmplY3Qob2JqZWN0OiBPYmplY3QsIHRlc3Q6IEZ1bmN0aW9uKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgb2JqZWN0QXBwbHkob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgaWYgKCh0ZXN0ICYmIHRlc3QodmFsdWUsIGtleSwgb2JqZWN0LCByZXN1bHQpKSB8fCBCb29sZWFuKHZhbHVlKSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKiogRmxhdHRlbnMgYW4gb2JqZWN0IGludG8gYSB0d28tZGltZW5zaW9uYWwgYXJyYXkuXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge0FycmF5fSByZXN1bHRpbmcgYXJyYXkgb2YgW2tleSwgdmFsdWVdIHBhaXJzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuKG9iamVjdDogT2JqZWN0KTogYW55W10ge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIG9iamVjdEFwcGx5KG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIHJlc3VsdC5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgYW55IGVsZW1lbnQgb2YgdGhlIGFycmF5IHBhc3NlcyB0aGUgdGVzdC5cbiAqXG4gKiBGdW5jdGlvbiB0ZXN0IGdldHMgMyBhcmd1bWVudHMgcGFzc2VkOlxuICogLSBlbGVtZW50IGZyb20gdGhlIGFycmF5XG4gKiAtIGluZGV4IG9mIHRoZSBlbGVtZW50XG4gKiAtIHJlZmVyZW5jZSB0byB0aGUgc291cmNlIGFycmF5XG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJyYXlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFueShhcnJheTogYW55W10sIHRlc3Q6IEZ1bmN0aW9uKTogYm9vbGVhbiB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAodGVzdChhcnJheVtpXSwgaSwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKiogQ2hlY2tzIHdoZXRoZXIgYWxsIGVsZW1lbnRzIG9mIHRoZSBhcnJheSBwYXNzIHRoZSB0ZXN0LlxuICpcbiAqIEZ1bmN0aW9uIHRlc3QgZ2V0cyAzIGFyZ3VtZW50cyBwYXNzZWQ6XG4gKiAtIGVsZW1lbnQgZnJvbSB0aGUgYXJyYXlcbiAqIC0gaW5kZXggb2YgdGhlIGVsZW1lbnRcbiAqIC0gcmVmZXJlbmNlIHRvIHRoZSBzb3VyY2UgYXJyYXlcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWxsKGFycmF5OiBhbnlbXSwgdGVzdDogRnVuY3Rpb24pOiBib29sZWFuIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGlmICghdGVzdChhcnJheVtpXSwgaSwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5jb2RlUGFyYW1zT2JqZWN0KGRhdGEpOiBzdHJpbmcge1xuICByZXR1cm4gbWFwT2JqZWN0KGRhdGEsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHZhbHVlID0gc2FmZUpTT05TdHJpbmdpZnkodmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGJhc2U2NGVuY29kZSh2YWx1ZS50b1N0cmluZygpKSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRRdWVyeVN0cmluZyhkYXRhOiBhbnkpOiBzdHJpbmcge1xuICB2YXIgcGFyYW1zID0gZmlsdGVyT2JqZWN0KGRhdGEsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQ7XG4gIH0pO1xuXG4gIHZhciBxdWVyeSA9IG1hcChcbiAgICBmbGF0dGVuKGVuY29kZVBhcmFtc09iamVjdChwYXJhbXMpKSxcbiAgICBVdGlsLm1ldGhvZCgnam9pbicsICc9JylcbiAgKS5qb2luKCcmJyk7XG5cbiAgcmV0dXJuIHF1ZXJ5O1xufVxuXG4vKipcbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZG91Z2xhc2Nyb2NrZm9yZC9KU09OLWpzL2Jsb2IvbWFzdGVyL2N5Y2xlLmpzXG4gKlxuICogUmVtb3ZlIGNpcmN1bGFyIHJlZmVyZW5jZXMgZnJvbSBhbiBvYmplY3QuIFJlcXVpcmVkIGZvciBKU09OLnN0cmluZ2lmeSBpblxuICogUmVhY3QgTmF0aXZlLCB3aGljaCB0ZW5kcyB0byBibG93IHVwIGEgbG90LlxuICpcbiAqIEBwYXJhbSAge2FueX0gb2JqZWN0XG4gKiBAcmV0dXJuIHthbnl9ICAgICAgICBEZWN5Y2xlZCBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlY3ljbGVPYmplY3Qob2JqZWN0OiBhbnkpOiBhbnkge1xuICB2YXIgb2JqZWN0cyA9IFtdLFxuICAgIHBhdGhzID0gW107XG5cbiAgcmV0dXJuIChmdW5jdGlvbiBkZXJleih2YWx1ZSwgcGF0aCkge1xuICAgIHZhciBpLCBuYW1lLCBudTtcblxuICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBpZiAob2JqZWN0c1tpXSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB7ICRyZWY6IHBhdGhzW2ldIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgb2JqZWN0cy5wdXNoKHZhbHVlKTtcbiAgICAgICAgcGF0aHMucHVzaChwYXRoKTtcblxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseSh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgICBudSA9IFtdO1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgbnVbaV0gPSBkZXJleih2YWx1ZVtpXSwgcGF0aCArICdbJyArIGkgKyAnXScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBudSA9IHt9O1xuICAgICAgICAgIGZvciAobmFtZSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgbmFtZSkpIHtcbiAgICAgICAgICAgICAgbnVbbmFtZV0gPSBkZXJleihcbiAgICAgICAgICAgICAgICB2YWx1ZVtuYW1lXSxcbiAgICAgICAgICAgICAgICBwYXRoICsgJ1snICsgSlNPTi5zdHJpbmdpZnkobmFtZSkgKyAnXSdcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51O1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfSkob2JqZWN0LCAnJCcpO1xufVxuXG4vKipcbiAqIFByb3ZpZGVzIGEgY3Jvc3MtYnJvd3NlciBhbmQgY3Jvc3MtcGxhdGZvcm0gd2F5IHRvIHNhZmVseSBzdHJpbmdpZnkgb2JqZWN0c1xuICogaW50byBKU09OLiBUaGlzIGlzIHBhcnRpY3VsYXJseSBuZWNlc3NhcnkgZm9yIFJlYWN0TmF0aXZlLCB3aGVyZSBjaXJjdWxhciBKU09OXG4gKiBzdHJ1Y3R1cmVzIHRocm93IGFuIGV4Y2VwdGlvbi5cbiAqXG4gKiBAcGFyYW0gIHthbnl9ICAgIHNvdXJjZSBUaGUgb2JqZWN0IHRvIHN0cmluZ2lmeVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgVGhlIHNlcmlhbGl6ZWQgb3V0cHV0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FmZUpTT05TdHJpbmdpZnkoc291cmNlOiBhbnkpOiBzdHJpbmcge1xuICB0cnkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzb3VyY2UpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRlY3ljbGVPYmplY3Qoc291cmNlKSk7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBzdHJpbmdpZnkgfSBmcm9tICcuL3V0aWxzL2NvbGxlY3Rpb25zJztcbmltcG9ydCBQdXNoZXIgZnJvbSAnLi9wdXNoZXInO1xuXG5jbGFzcyBMb2dnZXIge1xuICBkZWJ1ZyguLi5hcmdzOiBhbnlbXSkge1xuICAgIHRoaXMubG9nKHRoaXMuZ2xvYmFsTG9nLCBhcmdzKTtcbiAgfVxuXG4gIHdhcm4oLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLmxvZyh0aGlzLmdsb2JhbExvZ1dhcm4sIGFyZ3MpO1xuICB9XG5cbiAgZXJyb3IoLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLmxvZyh0aGlzLmdsb2JhbExvZ0Vycm9yLCBhcmdzKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2xvYmFsTG9nID0gKG1lc3NhZ2U6IHN0cmluZykgPT4ge1xuICAgIGlmIChnbG9iYWwuY29uc29sZSAmJiBnbG9iYWwuY29uc29sZS5sb2cpIHtcbiAgICAgIGdsb2JhbC5jb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBnbG9iYWxMb2dXYXJuKG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGlmIChnbG9iYWwuY29uc29sZSAmJiBnbG9iYWwuY29uc29sZS53YXJuKSB7XG4gICAgICBnbG9iYWwuY29uc29sZS53YXJuKG1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdsb2JhbExvZyhtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdsb2JhbExvZ0Vycm9yKG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGlmIChnbG9iYWwuY29uc29sZSAmJiBnbG9iYWwuY29uc29sZS5lcnJvcikge1xuICAgICAgZ2xvYmFsLmNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZ2xvYmFsTG9nV2FybihtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxvZyhcbiAgICBkZWZhdWx0TG9nZ2luZ0Z1bmN0aW9uOiAobWVzc2FnZTogc3RyaW5nKSA9PiB2b2lkLFxuICAgIC4uLmFyZ3M6IGFueVtdXG4gICkge1xuICAgIHZhciBtZXNzYWdlID0gc3RyaW5naWZ5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKFB1c2hlci5sb2cpIHtcbiAgICAgIFB1c2hlci5sb2cobWVzc2FnZSk7XG4gICAgfSBlbHNlIGlmIChQdXNoZXIubG9nVG9Db25zb2xlKSB7XG4gICAgICBjb25zdCBsb2cgPSBkZWZhdWx0TG9nZ2luZ0Z1bmN0aW9uLmJpbmQodGhpcyk7XG4gICAgICBsb2cobWVzc2FnZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBMb2dnZXIoKTtcbiIsICJpbXBvcnQgQnJvd3NlciBmcm9tICcuLi9icm93c2VyJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnY29yZS9sb2dnZXInO1xuaW1wb3J0IEpTT05QUmVxdWVzdCBmcm9tICcuLi9kb20vanNvbnBfcmVxdWVzdCc7XG5pbXBvcnQgeyBTY3JpcHRSZWNlaXZlcnMgfSBmcm9tICcuLi9kb20vc2NyaXB0X3JlY2VpdmVyX2ZhY3RvcnknO1xuaW1wb3J0IHsgQXV0aFRyYW5zcG9ydCB9IGZyb20gJ2NvcmUvYXV0aC9hdXRoX3RyYW5zcG9ydHMnO1xuaW1wb3J0IHtcbiAgQXV0aFJlcXVlc3RUeXBlLFxuICBBdXRoVHJhbnNwb3J0Q2FsbGJhY2ssXG4gIEludGVybmFsQXV0aE9wdGlvbnNcbn0gZnJvbSAnY29yZS9hdXRoL29wdGlvbnMnO1xuXG52YXIganNvbnA6IEF1dGhUcmFuc3BvcnQgPSBmdW5jdGlvbihcbiAgY29udGV4dDogQnJvd3NlcixcbiAgcXVlcnk6IHN0cmluZyxcbiAgYXV0aE9wdGlvbnM6IEludGVybmFsQXV0aE9wdGlvbnMsXG4gIGF1dGhSZXF1ZXN0VHlwZTogQXV0aFJlcXVlc3RUeXBlLFxuICBjYWxsYmFjazogQXV0aFRyYW5zcG9ydENhbGxiYWNrXG4pIHtcbiAgaWYgKFxuICAgIGF1dGhPcHRpb25zLmhlYWRlcnMgIT09IHVuZGVmaW5lZCB8fFxuICAgIGF1dGhPcHRpb25zLmhlYWRlcnNQcm92aWRlciAhPSBudWxsXG4gICkge1xuICAgIExvZ2dlci53YXJuKFxuICAgICAgYFRvIHNlbmQgaGVhZGVycyB3aXRoIHRoZSAke2F1dGhSZXF1ZXN0VHlwZS50b1N0cmluZygpfSByZXF1ZXN0LCB5b3UgbXVzdCB1c2UgQUpBWCwgcmF0aGVyIHRoYW4gSlNPTlAuYFxuICAgICk7XG4gIH1cblxuICB2YXIgY2FsbGJhY2tOYW1lID0gY29udGV4dC5uZXh0QXV0aENhbGxiYWNrSUQudG9TdHJpbmcoKTtcbiAgY29udGV4dC5uZXh0QXV0aENhbGxiYWNrSUQrKztcblxuICB2YXIgZG9jdW1lbnQgPSBjb250ZXh0LmdldERvY3VtZW50KCk7XG4gIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgLy8gSGFja2VkIHdyYXBwZXIuXG4gIGNvbnRleHQuYXV0aF9jYWxsYmFja3NbY2FsbGJhY2tOYW1lXSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbiAgfTtcblxuICB2YXIgY2FsbGJhY2tfbmFtZSA9IFwiUHVzaGVyLmF1dGhfY2FsbGJhY2tzWydcIiArIGNhbGxiYWNrTmFtZSArIFwiJ11cIjtcbiAgc2NyaXB0LnNyYyA9XG4gICAgYXV0aE9wdGlvbnMuZW5kcG9pbnQgK1xuICAgICc/Y2FsbGJhY2s9JyArXG4gICAgZW5jb2RlVVJJQ29tcG9uZW50KGNhbGxiYWNrX25hbWUpICtcbiAgICAnJicgK1xuICAgIHF1ZXJ5O1xuXG4gIHZhciBoZWFkID1cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgaGVhZC5pbnNlcnRCZWZvcmUoc2NyaXB0LCBoZWFkLmZpcnN0Q2hpbGQpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQganNvbnA7XG4iLCAiaW1wb3J0IFNjcmlwdFJlY2VpdmVyIGZyb20gJy4vc2NyaXB0X3JlY2VpdmVyJztcblxuLyoqIFNlbmRzIGEgZ2VuZXJpYyBIVFRQIEdFVCByZXF1ZXN0IHVzaW5nIGEgc2NyaXB0IHRhZy5cbiAqXG4gKiBCeSBjb25zdHJ1Y3RpbmcgVVJMIGluIGEgc3BlY2lmaWMgd2F5LCBpdCBjYW4gYmUgdXNlZCBmb3IgbG9hZGluZ1xuICogSmF2YVNjcmlwdCByZXNvdXJjZXMgb3IgSlNPTlAgcmVxdWVzdHMuIEl0IGNhbiBub3RpZnkgYWJvdXQgZXJyb3JzLCBidXRcbiAqIG9ubHkgaW4gY2VydGFpbiBlbnZpcm9ubWVudHMuIFBsZWFzZSB0YWtlIGNhcmUgb2YgbW9uaXRvcmluZyB0aGUgc3RhdGUgb2ZcbiAqIHRoZSByZXF1ZXN0IHlvdXJzZWxmLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzcmNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyaXB0UmVxdWVzdCB7XG4gIHNyYzogc3RyaW5nO1xuICBzY3JpcHQ6IGFueTtcbiAgZXJyb3JTY3JpcHQ6IGFueTtcblxuICBjb25zdHJ1Y3RvcihzcmM6IHN0cmluZykge1xuICAgIHRoaXMuc3JjID0gc3JjO1xuICB9XG5cbiAgc2VuZChyZWNlaXZlcjogU2NyaXB0UmVjZWl2ZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGVycm9yU3RyaW5nID0gJ0Vycm9yIGxvYWRpbmcgJyArIHNlbGYuc3JjO1xuXG4gICAgc2VsZi5zY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICBzZWxmLnNjcmlwdC5pZCA9IHJlY2VpdmVyLmlkO1xuICAgIHNlbGYuc2NyaXB0LnNyYyA9IHNlbGYuc3JjO1xuICAgIHNlbGYuc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICBzZWxmLnNjcmlwdC5jaGFyc2V0ID0gJ1VURi04JztcblxuICAgIGlmIChzZWxmLnNjcmlwdC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICBzZWxmLnNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlY2VpdmVyLmNhbGxiYWNrKGVycm9yU3RyaW5nKTtcbiAgICAgIH07XG4gICAgICBzZWxmLnNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVjZWl2ZXIuY2FsbGJhY2sobnVsbCk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHNlbGYuc2NyaXB0LnJlYWR5U3RhdGUgPT09ICdsb2FkZWQnIHx8XG4gICAgICAgICAgc2VsZi5zY3JpcHQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJ1xuICAgICAgICApIHtcbiAgICAgICAgICByZWNlaXZlci5jYWxsYmFjayhudWxsKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBPcGVyYTwxMS42IGhhY2sgZm9yIG1pc3Npbmcgb25lcnJvciBjYWxsYmFja1xuICAgIGlmIChcbiAgICAgIHNlbGYuc2NyaXB0LmFzeW5jID09PSB1bmRlZmluZWQgJiZcbiAgICAgICg8YW55PmRvY3VtZW50KS5hdHRhY2hFdmVudCAmJlxuICAgICAgL29wZXJhL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KVxuICAgICkge1xuICAgICAgc2VsZi5lcnJvclNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgc2VsZi5lcnJvclNjcmlwdC5pZCA9IHJlY2VpdmVyLmlkICsgJ19lcnJvcic7XG4gICAgICBzZWxmLmVycm9yU2NyaXB0LnRleHQgPSByZWNlaXZlci5uYW1lICsgXCIoJ1wiICsgZXJyb3JTdHJpbmcgKyBcIicpO1wiO1xuICAgICAgc2VsZi5zY3JpcHQuYXN5bmMgPSBzZWxmLmVycm9yU2NyaXB0LmFzeW5jID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgaGVhZC5pbnNlcnRCZWZvcmUoc2VsZi5zY3JpcHQsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgaWYgKHNlbGYuZXJyb3JTY3JpcHQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHNlbGYuZXJyb3JTY3JpcHQsIHNlbGYuc2NyaXB0Lm5leHRTaWJsaW5nKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xlYW5zIHVwIHRoZSBET00gcmVtYWlucyBvZiB0aGUgc2NyaXB0IHJlcXVlc3QuICovXG4gIGNsZWFudXAoKSB7XG4gICAgaWYgKHRoaXMuc2NyaXB0KSB7XG4gICAgICB0aGlzLnNjcmlwdC5vbmxvYWQgPSB0aGlzLnNjcmlwdC5vbmVycm9yID0gbnVsbDtcbiAgICAgIHRoaXMuc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLnNjcmlwdCAmJiB0aGlzLnNjcmlwdC5wYXJlbnROb2RlKSB7XG4gICAgICB0aGlzLnNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuc2NyaXB0KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZXJyb3JTY3JpcHQgJiYgdGhpcy5lcnJvclNjcmlwdC5wYXJlbnROb2RlKSB7XG4gICAgICB0aGlzLmVycm9yU2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5lcnJvclNjcmlwdCk7XG4gICAgfVxuICAgIHRoaXMuc2NyaXB0ID0gbnVsbDtcbiAgICB0aGlzLmVycm9yU2NyaXB0ID0gbnVsbDtcbiAgfVxufVxuIiwgImltcG9ydCBTY3JpcHRSZWNlaXZlciBmcm9tICcuL3NjcmlwdF9yZWNlaXZlcic7XG5pbXBvcnQgU2NyaXB0UmVxdWVzdCBmcm9tICcuL3NjcmlwdF9yZXF1ZXN0JztcbmltcG9ydCAqIGFzIENvbGxlY3Rpb25zIGZyb20gJ2NvcmUvdXRpbHMvY29sbGVjdGlvbnMnO1xuaW1wb3J0IFV0aWwgZnJvbSAnY29yZS91dGlsJztcbmltcG9ydCBSdW50aW1lIGZyb20gJy4uL3J1bnRpbWUnO1xuXG4vKiogU2VuZHMgZGF0YSB2aWEgSlNPTlAuXG4gKlxuICogRGF0YSBpcyBhIGtleS12YWx1ZSBtYXAuIEl0cyB2YWx1ZXMgYXJlIEpTT04tZW5jb2RlZCBhbmQgdGhlbiBwYXNzZWRcbiAqIHRocm91Z2ggYmFzZTY0LiBGaW5hbGx5LCBrZXlzIGFuZCBlbmNvZGVkIHZhbHVlcyBhcmUgYXBwZW5kZWQgdG8gdGhlIHF1ZXJ5XG4gKiBzdHJpbmcuXG4gKlxuICogVGhlIGNsYXNzIGl0c2VsZiBkb2VzIG5vdCBndWFyYW50ZWUgcmFpc2luZyBlcnJvcnMgb24gZmFpbHVyZXMsIGFzIGl0J3Mgbm90XG4gKiBwb3NzaWJsZSB0byBzdXBwb3J0IHN1Y2ggZmVhdHVyZSBvbiBhbGwgYnJvd3NlcnMuIEluc3RlYWQsIEpTT05QIGVuZHBvaW50XG4gKiBzaG91bGQgY2FsbCBiYWNrIGluIGEgd2F5IHRoYXQncyBlYXN5IHRvIGRpc3Rpbmd1aXNoIGZyb20gYnJvd3NlciBjYWxscyxcbiAqIGZvciBleGFtcGxlIGJ5IHBhc3NpbmcgYSBzZWNvbmQgYXJndW1lbnQgdG8gdGhlIHJlY2VpdmVyLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIGtleS12YWx1ZSBtYXAgb2YgZGF0YSB0byBiZSBzdWJtaXR0ZWRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSlNPTlBSZXF1ZXN0IHtcbiAgdXJsOiBzdHJpbmc7XG4gIGRhdGE6IGFueTtcbiAgcmVxdWVzdDogU2NyaXB0UmVxdWVzdDtcblxuICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgfVxuXG4gIC8qKiBTZW5kcyB0aGUgYWN0dWFsIEpTT05QIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7U2NyaXB0UmVjZWl2ZXJ9IHJlY2VpdmVyXG4gICAqL1xuICBzZW5kKHJlY2VpdmVyOiBTY3JpcHRSZWNlaXZlcikge1xuICAgIGlmICh0aGlzLnJlcXVlc3QpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcXVlcnkgPSBDb2xsZWN0aW9ucy5idWlsZFF1ZXJ5U3RyaW5nKHRoaXMuZGF0YSk7XG4gICAgdmFyIHVybCA9IHRoaXMudXJsICsgJy8nICsgcmVjZWl2ZXIubnVtYmVyICsgJz8nICsgcXVlcnk7XG4gICAgdGhpcy5yZXF1ZXN0ID0gUnVudGltZS5jcmVhdGVTY3JpcHRSZXF1ZXN0KHVybCk7XG4gICAgdGhpcy5yZXF1ZXN0LnNlbmQocmVjZWl2ZXIpO1xuICB9XG5cbiAgLyoqIENsZWFucyB1cCB0aGUgRE9NIHJlbWFpbnMgb2YgdGhlIEpTT05QIHJlcXVlc3QuICovXG4gIGNsZWFudXAoKSB7XG4gICAgaWYgKHRoaXMucmVxdWVzdCkge1xuICAgICAgdGhpcy5yZXF1ZXN0LmNsZWFudXAoKTtcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgVGltZWxpbmVTZW5kZXIgZnJvbSAnY29yZS90aW1lbGluZS90aW1lbGluZV9zZW5kZXInO1xuaW1wb3J0IFRpbWVsaW5lVHJhbnNwb3J0IGZyb20gJ2NvcmUvdGltZWxpbmUvdGltZWxpbmVfdHJhbnNwb3J0JztcbmltcG9ydCBCcm93c2VyIGZyb20gJ3J1bnRpbWUnO1xuaW1wb3J0IHsgQXV0aFRyYW5zcG9ydCB9IGZyb20gJ2NvcmUvYXV0aC9hdXRoX3RyYW5zcG9ydHMnO1xuaW1wb3J0IHsgU2NyaXB0UmVjZWl2ZXJzIH0gZnJvbSAnLi4vZG9tL3NjcmlwdF9yZWNlaXZlcl9mYWN0b3J5JztcblxudmFyIGdldEFnZW50ID0gZnVuY3Rpb24oc2VuZGVyOiBUaW1lbGluZVNlbmRlciwgdXNlVExTOiBib29sZWFuKSB7XG4gIHJldHVybiBmdW5jdGlvbihkYXRhOiBhbnksIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgIHZhciBzY2hlbWUgPSAnaHR0cCcgKyAodXNlVExTID8gJ3MnIDogJycpICsgJzovLyc7XG4gICAgdmFyIHVybCA9XG4gICAgICBzY2hlbWUgKyAoc2VuZGVyLmhvc3QgfHwgc2VuZGVyLm9wdGlvbnMuaG9zdCkgKyBzZW5kZXIub3B0aW9ucy5wYXRoO1xuICAgIHZhciByZXF1ZXN0ID0gQnJvd3Nlci5jcmVhdGVKU09OUFJlcXVlc3QodXJsLCBkYXRhKTtcblxuICAgIHZhciByZWNlaXZlciA9IEJyb3dzZXIuU2NyaXB0UmVjZWl2ZXJzLmNyZWF0ZShmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICBTY3JpcHRSZWNlaXZlcnMucmVtb3ZlKHJlY2VpdmVyKTtcbiAgICAgIHJlcXVlc3QuY2xlYW51cCgpO1xuXG4gICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5ob3N0KSB7XG4gICAgICAgIHNlbmRlci5ob3N0ID0gcmVzdWx0Lmhvc3Q7XG4gICAgICB9XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIHJlc3VsdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmVxdWVzdC5zZW5kKHJlY2VpdmVyKTtcbiAgfTtcbn07XG5cbnZhciBqc29ucCA9IHtcbiAgbmFtZTogJ2pzb25wJyxcbiAgZ2V0QWdlbnRcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGpzb25wO1xuIiwgImltcG9ydCBEZWZhdWx0cyBmcm9tICcuLi9kZWZhdWx0cyc7XG5pbXBvcnQgeyBkZWZhdWx0IGFzIFVSTFNjaGVtZSwgVVJMU2NoZW1lUGFyYW1zIH0gZnJvbSAnLi91cmxfc2NoZW1lJztcblxuZnVuY3Rpb24gZ2V0R2VuZXJpY1VSTChcbiAgYmFzZVNjaGVtZTogc3RyaW5nLFxuICBwYXJhbXM6IFVSTFNjaGVtZVBhcmFtcyxcbiAgcGF0aDogc3RyaW5nXG4pOiBzdHJpbmcge1xuICB2YXIgc2NoZW1lID0gYmFzZVNjaGVtZSArIChwYXJhbXMudXNlVExTID8gJ3MnIDogJycpO1xuICB2YXIgaG9zdCA9IHBhcmFtcy51c2VUTFMgPyBwYXJhbXMuaG9zdFRMUyA6IHBhcmFtcy5ob3N0Tm9uVExTO1xuICByZXR1cm4gc2NoZW1lICsgJzovLycgKyBob3N0ICsgcGF0aDtcbn1cblxuZnVuY3Rpb24gZ2V0R2VuZXJpY1BhdGgoa2V5OiBzdHJpbmcsIHF1ZXJ5U3RyaW5nPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgdmFyIHBhdGggPSAnL2FwcC8nICsga2V5O1xuICB2YXIgcXVlcnkgPVxuICAgICc/cHJvdG9jb2w9JyArXG4gICAgRGVmYXVsdHMuUFJPVE9DT0wgK1xuICAgICcmY2xpZW50PWpzJyArXG4gICAgJyZ2ZXJzaW9uPScgK1xuICAgIERlZmF1bHRzLlZFUlNJT04gK1xuICAgIChxdWVyeVN0cmluZyA/ICcmJyArIHF1ZXJ5U3RyaW5nIDogJycpO1xuICByZXR1cm4gcGF0aCArIHF1ZXJ5O1xufVxuXG5leHBvcnQgdmFyIHdzOiBVUkxTY2hlbWUgPSB7XG4gIGdldEluaXRpYWw6IGZ1bmN0aW9uKGtleTogc3RyaW5nLCBwYXJhbXM6IFVSTFNjaGVtZVBhcmFtcyk6IHN0cmluZyB7XG4gICAgdmFyIHBhdGggPSAocGFyYW1zLmh0dHBQYXRoIHx8ICcnKSArIGdldEdlbmVyaWNQYXRoKGtleSwgJ2ZsYXNoPWZhbHNlJyk7XG4gICAgcmV0dXJuIGdldEdlbmVyaWNVUkwoJ3dzJywgcGFyYW1zLCBwYXRoKTtcbiAgfVxufTtcblxuZXhwb3J0IHZhciBodHRwOiBVUkxTY2hlbWUgPSB7XG4gIGdldEluaXRpYWw6IGZ1bmN0aW9uKGtleTogc3RyaW5nLCBwYXJhbXM6IFVSTFNjaGVtZVBhcmFtcyk6IHN0cmluZyB7XG4gICAgdmFyIHBhdGggPSAocGFyYW1zLmh0dHBQYXRoIHx8ICcvcHVzaGVyJykgKyBnZXRHZW5lcmljUGF0aChrZXkpO1xuICAgIHJldHVybiBnZXRHZW5lcmljVVJMKCdodHRwJywgcGFyYW1zLCBwYXRoKTtcbiAgfVxufTtcblxuZXhwb3J0IHZhciBzb2NranM6IFVSTFNjaGVtZSA9IHtcbiAgZ2V0SW5pdGlhbDogZnVuY3Rpb24oa2V5OiBzdHJpbmcsIHBhcmFtczogVVJMU2NoZW1lUGFyYW1zKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZ2V0R2VuZXJpY1VSTCgnaHR0cCcsIHBhcmFtcywgcGFyYW1zLmh0dHBQYXRoIHx8ICcvcHVzaGVyJyk7XG4gIH0sXG4gIGdldFBhdGg6IGZ1bmN0aW9uKGtleTogc3RyaW5nLCBwYXJhbXM6IFVSTFNjaGVtZVBhcmFtcyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldEdlbmVyaWNQYXRoKGtleSk7XG4gIH1cbn07XG4iLCAiaW1wb3J0IENhbGxiYWNrIGZyb20gJy4vY2FsbGJhY2snO1xuaW1wb3J0ICogYXMgQ29sbGVjdGlvbnMgZnJvbSAnLi4vdXRpbHMvY29sbGVjdGlvbnMnO1xuaW1wb3J0IENhbGxiYWNrVGFibGUgZnJvbSAnLi9jYWxsYmFja190YWJsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbGxiYWNrUmVnaXN0cnkge1xuICBfY2FsbGJhY2tzOiBDYWxsYmFja1RhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICB9XG5cbiAgZ2V0KG5hbWU6IHN0cmluZyk6IENhbGxiYWNrW10ge1xuICAgIHJldHVybiB0aGlzLl9jYWxsYmFja3NbcHJlZml4KG5hbWUpXTtcbiAgfVxuXG4gIGFkZChuYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgY29udGV4dDogYW55KSB7XG4gICAgdmFyIHByZWZpeGVkRXZlbnROYW1lID0gcHJlZml4KG5hbWUpO1xuICAgIHRoaXMuX2NhbGxiYWNrc1twcmVmaXhlZEV2ZW50TmFtZV0gPVxuICAgICAgdGhpcy5fY2FsbGJhY2tzW3ByZWZpeGVkRXZlbnROYW1lXSB8fCBbXTtcbiAgICB0aGlzLl9jYWxsYmFja3NbcHJlZml4ZWRFdmVudE5hbWVdLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY29udGV4dDogY29udGV4dFxuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlKG5hbWU/OiBzdHJpbmcsIGNhbGxiYWNrPzogRnVuY3Rpb24sIGNvbnRleHQ/OiBhbnkpIHtcbiAgICBpZiAoIW5hbWUgJiYgIWNhbGxiYWNrICYmICFjb250ZXh0KSB7XG4gICAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmFtZXMgPSBuYW1lID8gW3ByZWZpeChuYW1lKV0gOiBDb2xsZWN0aW9ucy5rZXlzKHRoaXMuX2NhbGxiYWNrcyk7XG5cbiAgICBpZiAoY2FsbGJhY2sgfHwgY29udGV4dCkge1xuICAgICAgdGhpcy5yZW1vdmVDYWxsYmFjayhuYW1lcywgY2FsbGJhY2ssIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZUFsbENhbGxiYWNrcyhuYW1lcyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVDYWxsYmFjayhuYW1lczogc3RyaW5nW10sIGNhbGxiYWNrOiBGdW5jdGlvbiwgY29udGV4dDogYW55KSB7XG4gICAgQ29sbGVjdGlvbnMuYXBwbHkoXG4gICAgICBuYW1lcyxcbiAgICAgIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgdGhpcy5fY2FsbGJhY2tzW25hbWVdID0gQ29sbGVjdGlvbnMuZmlsdGVyKFxuICAgICAgICAgIHRoaXMuX2NhbGxiYWNrc1tuYW1lXSB8fCBbXSxcbiAgICAgICAgICBmdW5jdGlvbihiaW5kaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAoY2FsbGJhY2sgJiYgY2FsbGJhY2sgIT09IGJpbmRpbmcuZm4pIHx8XG4gICAgICAgICAgICAgIChjb250ZXh0ICYmIGNvbnRleHQgIT09IGJpbmRpbmcuY29udGV4dClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBpZiAodGhpcy5fY2FsbGJhY2tzW25hbWVdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0aGlzXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlQWxsQ2FsbGJhY2tzKG5hbWVzOiBzdHJpbmdbXSkge1xuICAgIENvbGxlY3Rpb25zLmFwcGx5KFxuICAgICAgbmFtZXMsXG4gICAgICBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbbmFtZV07XG4gICAgICB9LFxuICAgICAgdGhpc1xuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJlZml4KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiAnXycgKyBuYW1lO1xufVxuIiwgImltcG9ydCAqIGFzIENvbGxlY3Rpb25zIGZyb20gJy4uL3V0aWxzL2NvbGxlY3Rpb25zJztcbmltcG9ydCBDYWxsYmFjayBmcm9tICcuL2NhbGxiYWNrJztcbmltcG9ydCBNZXRhZGF0YSBmcm9tICcuLi9jaGFubmVscy9tZXRhZGF0YSc7XG5pbXBvcnQgQ2FsbGJhY2tSZWdpc3RyeSBmcm9tICcuL2NhbGxiYWNrX3JlZ2lzdHJ5JztcblxuLyoqIE1hbmFnZXMgY2FsbGJhY2sgYmluZGluZ3MgYW5kIGV2ZW50IGVtaXR0aW5nLlxuICpcbiAqIEBwYXJhbSBGdW5jdGlvbiBmYWlsVGhyb3VnaCBjYWxsZWQgd2hlbiBubyBsaXN0ZW5lcnMgYXJlIGJvdW5kIHRvIGFuIGV2ZW50XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpc3BhdGNoZXIge1xuICBjYWxsYmFja3M6IENhbGxiYWNrUmVnaXN0cnk7XG4gIGdsb2JhbF9jYWxsYmFja3M6IEZ1bmN0aW9uW107XG4gIGZhaWxUaHJvdWdoOiBGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3RvcihmYWlsVGhyb3VnaD86IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5jYWxsYmFja3MgPSBuZXcgQ2FsbGJhY2tSZWdpc3RyeSgpO1xuICAgIHRoaXMuZ2xvYmFsX2NhbGxiYWNrcyA9IFtdO1xuICAgIHRoaXMuZmFpbFRocm91Z2ggPSBmYWlsVGhyb3VnaDtcbiAgfVxuXG4gIGJpbmQoZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgY29udGV4dD86IGFueSkge1xuICAgIHRoaXMuY2FsbGJhY2tzLmFkZChldmVudE5hbWUsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGJpbmRfZ2xvYmFsKGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgIHRoaXMuZ2xvYmFsX2NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVuYmluZChldmVudE5hbWU/OiBzdHJpbmcsIGNhbGxiYWNrPzogRnVuY3Rpb24sIGNvbnRleHQ/OiBhbnkpIHtcbiAgICB0aGlzLmNhbGxiYWNrcy5yZW1vdmUoZXZlbnROYW1lLCBjYWxsYmFjaywgY29udGV4dCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1bmJpbmRfZ2xvYmFsKGNhbGxiYWNrPzogRnVuY3Rpb24pIHtcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmdsb2JhbF9jYWxsYmFja3MgPSBbXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuZ2xvYmFsX2NhbGxiYWNrcyA9IENvbGxlY3Rpb25zLmZpbHRlcihcbiAgICAgIHRoaXMuZ2xvYmFsX2NhbGxiYWNrcyB8fCBbXSxcbiAgICAgIGMgPT4gYyAhPT0gY2FsbGJhY2tcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1bmJpbmRfYWxsKCkge1xuICAgIHRoaXMudW5iaW5kKCk7XG4gICAgdGhpcy51bmJpbmRfZ2xvYmFsKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBlbWl0KGV2ZW50TmFtZTogc3RyaW5nLCBkYXRhPzogYW55LCBtZXRhZGF0YT86IE1ldGFkYXRhKTogRGlzcGF0Y2hlciB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdsb2JhbF9jYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuZ2xvYmFsX2NhbGxiYWNrc1tpXShldmVudE5hbWUsIGRhdGEpO1xuICAgIH1cblxuICAgIHZhciBjYWxsYmFja3MgPSB0aGlzLmNhbGxiYWNrcy5nZXQoZXZlbnROYW1lKTtcbiAgICB2YXIgYXJncyA9IFtdO1xuXG4gICAgaWYgKG1ldGFkYXRhKSB7XG4gICAgICAvLyBpZiB0aGVyZSdzIGEgbWV0YWRhdGEgYXJndW1lbnQsIHdlIG5lZWQgdG8gY2FsbCB0aGUgY2FsbGJhY2sgd2l0aCBib3RoXG4gICAgICAvLyBkYXRhIGFuZCBtZXRhZGF0YSByZWdhcmRsZXNzIG9mIHdoZXRoZXIgZGF0YSBpcyB1bmRlZmluZWRcbiAgICAgIGFyZ3MucHVzaChkYXRhLCBtZXRhZGF0YSk7XG4gICAgfSBlbHNlIGlmIChkYXRhKSB7XG4gICAgICAvLyBtZXRhZGF0YSBpcyB1bmRlZmluZWQsIHNvIHdlIG9ubHkgbmVlZCB0byBjYWxsIHRoZSBjYWxsYmFjayB3aXRoIGRhdGFcbiAgICAgIC8vIGlmIGRhdGEgZXhpc3RzXG4gICAgICBhcmdzLnB1c2goZGF0YSk7XG4gICAgfVxuXG4gICAgaWYgKGNhbGxiYWNrcyAmJiBjYWxsYmFja3MubGVuZ3RoID4gMCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2FsbGJhY2tzW2ldLmZuLmFwcGx5KGNhbGxiYWNrc1tpXS5jb250ZXh0IHx8IGdsb2JhbCwgYXJncyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmZhaWxUaHJvdWdoKSB7XG4gICAgICB0aGlzLmZhaWxUaHJvdWdoKGV2ZW50TmFtZSwgZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiIsICJpbXBvcnQgVXRpbCBmcm9tICcuLi91dGlsJztcbmltcG9ydCAqIGFzIENvbGxlY3Rpb25zIGZyb20gJy4uL3V0aWxzL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7IGRlZmF1bHQgYXMgRXZlbnRzRGlzcGF0Y2hlciB9IGZyb20gJy4uL2V2ZW50cy9kaXNwYXRjaGVyJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vbG9nZ2VyJztcbmltcG9ydCBUcmFuc3BvcnRIb29rcyBmcm9tICcuL3RyYW5zcG9ydF9ob29rcyc7XG5pbXBvcnQgU29ja2V0IGZyb20gJy4uL3NvY2tldCc7XG5pbXBvcnQgUnVudGltZSBmcm9tICdydW50aW1lJztcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuLi90aW1lbGluZS90aW1lbGluZSc7XG5pbXBvcnQgVHJhbnNwb3J0Q29ubmVjdGlvbk9wdGlvbnMgZnJvbSAnLi90cmFuc3BvcnRfY29ubmVjdGlvbl9vcHRpb25zJztcblxuLyoqIFByb3ZpZGVzIHVuaXZlcnNhbCBBUEkgZm9yIHRyYW5zcG9ydCBjb25uZWN0aW9ucy5cbiAqXG4gKiBUcmFuc3BvcnQgY29ubmVjdGlvbiBpcyBhIGxvdy1sZXZlbCBvYmplY3QgdGhhdCB3cmFwcyBhIGNvbm5lY3Rpb24gbWV0aG9kXG4gKiBhbmQgZXhwb3NlcyBhIHNpbXBsZSBldmVudGVkIGludGVyZmFjZSBmb3IgdGhlIGNvbm5lY3Rpb24gc3RhdGUgYW5kXG4gKiBtZXNzYWdpbmcuIEl0IGRvZXMgbm90IGltcGxlbWVudCBQdXNoZXItc3BlY2lmaWMgV2ViU29ja2V0IHByb3RvY29sLlxuICpcbiAqIEFkZGl0aW9uYWxseSwgaXQgZmV0Y2hlcyByZXNvdXJjZXMgbmVlZGVkIGZvciB0cmFuc3BvcnQgdG8gd29yayBhbmQgZXhwb3Nlc1xuICogYW4gaW50ZXJmYWNlIGZvciBxdWVyeWluZyB0cmFuc3BvcnQgZmVhdHVyZXMuXG4gKlxuICogU3RhdGVzOlxuICogLSBuZXcgLSBpbml0aWFsIHN0YXRlIGFmdGVyIGNvbnN0cnVjdGluZyB0aGUgb2JqZWN0XG4gKiAtIGluaXRpYWxpemluZyAtIGR1cmluZyBpbml0aWFsaXphdGlvbiBwaGFzZSwgdXN1YWxseSBmZXRjaGluZyByZXNvdXJjZXNcbiAqIC0gaW50aWFsaXplZCAtIHJlYWR5IHRvIGVzdGFibGlzaCBhIGNvbm5lY3Rpb25cbiAqIC0gY29ubmVjdGlvbiAtIHdoZW4gY29ubmVjdGlvbiBpcyBiZWluZyBlc3RhYmxpc2hlZFxuICogLSBvcGVuIC0gd2hlbiBjb25uZWN0aW9uIHJlYWR5IHRvIGJlIHVzZWRcbiAqIC0gY2xvc2VkIC0gYWZ0ZXIgY29ubmVjdGlvbiB3YXMgY2xvc2VkIGJlIGVpdGhlciBzaWRlXG4gKlxuICogRW1pdHM6XG4gKiAtIGVycm9yIC0gYWZ0ZXIgdGhlIGNvbm5lY3Rpb24gcmFpc2VkIGFuIGVycm9yXG4gKlxuICogT3B0aW9uczpcbiAqIC0gdXNlVExTIC0gd2hldGhlciBjb25uZWN0aW9uIHNob3VsZCBiZSBvdmVyIFRMU1xuICogLSBob3N0VExTIC0gaG9zdCB0byBjb25uZWN0IHRvIHdoZW4gY29ubmVjdGlvbiBpcyBvdmVyIFRMU1xuICogLSBob3N0Tm9uVExTIC0gaG9zdCB0byBjb25uZWN0IHRvIHdoZW4gY29ubmVjdGlvbiBpcyBvdmVyIFRMU1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgYXBwbGljYXRpb24ga2V5XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFuc3BvcnRDb25uZWN0aW9uIGV4dGVuZHMgRXZlbnRzRGlzcGF0Y2hlciB7XG4gIGhvb2tzOiBUcmFuc3BvcnRIb29rcztcbiAgbmFtZTogc3RyaW5nO1xuICBwcmlvcml0eTogbnVtYmVyO1xuICBrZXk6IHN0cmluZztcbiAgb3B0aW9uczogVHJhbnNwb3J0Q29ubmVjdGlvbk9wdGlvbnM7XG4gIHN0YXRlOiBzdHJpbmc7XG4gIHRpbWVsaW5lOiBUaW1lbGluZTtcbiAgYWN0aXZpdHlUaW1lb3V0OiBudW1iZXI7XG4gIGlkOiBudW1iZXI7XG4gIHNvY2tldDogU29ja2V0O1xuICBiZWZvcmVPcGVuOiBGdW5jdGlvbjtcbiAgaW5pdGlhbGl6ZTogRnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaG9va3M6IFRyYW5zcG9ydEhvb2tzLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgIGtleTogc3RyaW5nLFxuICAgIG9wdGlvbnM6IFRyYW5zcG9ydENvbm5lY3Rpb25PcHRpb25zXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5pbml0aWFsaXplID0gUnVudGltZS50cmFuc3BvcnRDb25uZWN0aW9uSW5pdGlhbGl6ZXI7XG4gICAgdGhpcy5ob29rcyA9IGhvb2tzO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5wcmlvcml0eSA9IHByaW9yaXR5O1xuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLnN0YXRlID0gJ25ldyc7XG4gICAgdGhpcy50aW1lbGluZSA9IG9wdGlvbnMudGltZWxpbmU7XG4gICAgdGhpcy5hY3Rpdml0eVRpbWVvdXQgPSBvcHRpb25zLmFjdGl2aXR5VGltZW91dDtcbiAgICB0aGlzLmlkID0gdGhpcy50aW1lbGluZS5nZW5lcmF0ZVVuaXF1ZUlEKCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIHRyYW5zcG9ydCBoYW5kbGVzIGFjdGl2aXR5IGNoZWNrcyBieSBpdHNlbGYuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBoYW5kbGVzQWN0aXZpdHlDaGVja3MoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIEJvb2xlYW4odGhpcy5ob29rcy5oYW5kbGVzQWN0aXZpdHlDaGVja3MpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSB0cmFuc3BvcnQgc3VwcG9ydHMgdGhlIHBpbmcvcG9uZyBBUEkuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBzdXBwb3J0c1BpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIEJvb2xlYW4odGhpcy5ob29rcy5zdXBwb3J0c1BpbmcpO1xuICB9XG5cbiAgLyoqIFRyaWVzIHRvIGVzdGFibGlzaCBhIGNvbm5lY3Rpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBmYWxzZSBpZiB0cmFuc3BvcnQgaXMgaW4gaW52YWxpZCBzdGF0ZVxuICAgKi9cbiAgY29ubmVjdCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5zb2NrZXQgfHwgdGhpcy5zdGF0ZSAhPT0gJ2luaXRpYWxpemVkJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciB1cmwgPSB0aGlzLmhvb2tzLnVybHMuZ2V0SW5pdGlhbCh0aGlzLmtleSwgdGhpcy5vcHRpb25zKTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5zb2NrZXQgPSB0aGlzLmhvb2tzLmdldFNvY2tldCh1cmwsIHRoaXMub3B0aW9ucyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgVXRpbC5kZWZlcigoKSA9PiB7XG4gICAgICAgIHRoaXMub25FcnJvcihlKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VTdGF0ZSgnY2xvc2VkJyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmJpbmRMaXN0ZW5lcnMoKTtcblxuICAgIExvZ2dlci5kZWJ1ZygnQ29ubmVjdGluZycsIHsgdHJhbnNwb3J0OiB0aGlzLm5hbWUsIHVybCB9KTtcbiAgICB0aGlzLmNoYW5nZVN0YXRlKCdjb25uZWN0aW5nJyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBjb25uZWN0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZXJlIHdhcyBhIGNvbm5lY3Rpb24gdG8gY2xvc2VcbiAgICovXG4gIGNsb3NlKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnNvY2tldCkge1xuICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNlbmRzIGRhdGEgb3ZlciB0aGUgb3BlbiBjb25uZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YVxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIG9ubHkgd2hlbiBpbiB0aGUgXCJvcGVuXCIgc3RhdGVcbiAgICovXG4gIHNlbmQoZGF0YTogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuc3RhdGUgPT09ICdvcGVuJykge1xuICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgTW9iaWxlU2FmYXJpIGJ1ZyAoc2VlIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tLzIwNTIwMDYpXG4gICAgICBVdGlsLmRlZmVyKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc29ja2V0KSB7XG4gICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZW5kcyBhIHBpbmcgaWYgdGhlIGNvbm5lY3Rpb24gaXMgb3BlbiBhbmQgdHJhbnNwb3J0IHN1cHBvcnRzIGl0LiAqL1xuICBwaW5nKCkge1xuICAgIGlmICh0aGlzLnN0YXRlID09PSAnb3BlbicgJiYgdGhpcy5zdXBwb3J0c1BpbmcoKSkge1xuICAgICAgdGhpcy5zb2NrZXQucGluZygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25PcGVuKCkge1xuICAgIGlmICh0aGlzLmhvb2tzLmJlZm9yZU9wZW4pIHtcbiAgICAgIHRoaXMuaG9va3MuYmVmb3JlT3BlbihcbiAgICAgICAgdGhpcy5zb2NrZXQsXG4gICAgICAgIHRoaXMuaG9va3MudXJscy5nZXRQYXRoKHRoaXMua2V5LCB0aGlzLm9wdGlvbnMpXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmNoYW5nZVN0YXRlKCdvcGVuJyk7XG4gICAgdGhpcy5zb2NrZXQub25vcGVuID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkVycm9yKGVycm9yKSB7XG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIHsgdHlwZTogJ1dlYlNvY2tldEVycm9yJywgZXJyb3I6IGVycm9yIH0pO1xuICAgIHRoaXMudGltZWxpbmUuZXJyb3IodGhpcy5idWlsZFRpbWVsaW5lTWVzc2FnZSh7IGVycm9yOiBlcnJvci50b1N0cmluZygpIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgb25DbG9zZShjbG9zZUV2ZW50PzogYW55KSB7XG4gICAgaWYgKGNsb3NlRXZlbnQpIHtcbiAgICAgIHRoaXMuY2hhbmdlU3RhdGUoJ2Nsb3NlZCcsIHtcbiAgICAgICAgY29kZTogY2xvc2VFdmVudC5jb2RlLFxuICAgICAgICByZWFzb246IGNsb3NlRXZlbnQucmVhc29uLFxuICAgICAgICB3YXNDbGVhbjogY2xvc2VFdmVudC53YXNDbGVhblxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2hhbmdlU3RhdGUoJ2Nsb3NlZCcpO1xuICAgIH1cbiAgICB0aGlzLnVuYmluZExpc3RlbmVycygpO1xuICAgIHRoaXMuc29ja2V0ID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJpdmF0ZSBvbk1lc3NhZ2UobWVzc2FnZSkge1xuICAgIHRoaXMuZW1pdCgnbWVzc2FnZScsIG1lc3NhZ2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkFjdGl2aXR5KCkge1xuICAgIHRoaXMuZW1pdCgnYWN0aXZpdHknKTtcbiAgfVxuXG4gIHByaXZhdGUgYmluZExpc3RlbmVycygpIHtcbiAgICB0aGlzLnNvY2tldC5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICB0aGlzLm9uT3BlbigpO1xuICAgIH07XG4gICAgdGhpcy5zb2NrZXQub25lcnJvciA9IGVycm9yID0+IHtcbiAgICAgIHRoaXMub25FcnJvcihlcnJvcik7XG4gICAgfTtcbiAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gY2xvc2VFdmVudCA9PiB7XG4gICAgICB0aGlzLm9uQ2xvc2UoY2xvc2VFdmVudCk7XG4gICAgfTtcbiAgICB0aGlzLnNvY2tldC5vbm1lc3NhZ2UgPSBtZXNzYWdlID0+IHtcbiAgICAgIHRoaXMub25NZXNzYWdlKG1lc3NhZ2UpO1xuICAgIH07XG5cbiAgICBpZiAodGhpcy5zdXBwb3J0c1BpbmcoKSkge1xuICAgICAgdGhpcy5zb2NrZXQub25hY3Rpdml0eSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkFjdGl2aXR5KCk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdW5iaW5kTGlzdGVuZXJzKCkge1xuICAgIGlmICh0aGlzLnNvY2tldCkge1xuICAgICAgdGhpcy5zb2NrZXQub25vcGVuID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5zb2NrZXQub25lcnJvciA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuc29ja2V0Lm9uY2xvc2UgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLnNvY2tldC5vbm1lc3NhZ2UgPSB1bmRlZmluZWQ7XG4gICAgICBpZiAodGhpcy5zdXBwb3J0c1BpbmcoKSkge1xuICAgICAgICB0aGlzLnNvY2tldC5vbmFjdGl2aXR5ID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hhbmdlU3RhdGUoc3RhdGU6IHN0cmluZywgcGFyYW1zPzogYW55KSB7XG4gICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIHRoaXMudGltZWxpbmUuaW5mbyhcbiAgICAgIHRoaXMuYnVpbGRUaW1lbGluZU1lc3NhZ2Uoe1xuICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgIHBhcmFtczogcGFyYW1zXG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5lbWl0KHN0YXRlLCBwYXJhbXMpO1xuICB9XG5cbiAgYnVpbGRUaW1lbGluZU1lc3NhZ2UobWVzc2FnZSk6IGFueSB7XG4gICAgcmV0dXJuIENvbGxlY3Rpb25zLmV4dGVuZCh7IGNpZDogdGhpcy5pZCB9LCBtZXNzYWdlKTtcbiAgfVxufVxuIiwgImltcG9ydCBGYWN0b3J5IGZyb20gJy4uL3V0aWxzL2ZhY3RvcnknO1xuaW1wb3J0IFRyYW5zcG9ydEhvb2tzIGZyb20gJy4vdHJhbnNwb3J0X2hvb2tzJztcbmltcG9ydCBUcmFuc3BvcnRDb25uZWN0aW9uIGZyb20gJy4vdHJhbnNwb3J0X2Nvbm5lY3Rpb24nO1xuaW1wb3J0IFRyYW5zcG9ydENvbm5lY3Rpb25PcHRpb25zIGZyb20gJy4vdHJhbnNwb3J0X2Nvbm5lY3Rpb25fb3B0aW9ucyc7XG5cbi8qKiBQcm92aWRlcyBpbnRlcmZhY2UgZm9yIHRyYW5zcG9ydCBjb25uZWN0aW9uIGluc3RhbnRpYXRpb24uXG4gKlxuICogVGFrZXMgdHJhbnNwb3J0LXNwZWNpZmljIGhvb2tzIGFzIHRoZSBvbmx5IGFyZ3VtZW50LCB3aGljaCBhbGxvdyBjaGVja2luZ1xuICogZm9yIHRyYW5zcG9ydCBzdXBwb3J0IGFuZCBjcmVhdGluZyBpdHMgY29ubmVjdGlvbnMuXG4gKlxuICogU3VwcG9ydGVkIGhvb2tzOiAqIC0gZmlsZSAtIHRoZSBuYW1lIG9mIHRoZSBmaWxlIHRvIGJlIGZldGNoZWQgZHVyaW5nIGluaXRpYWxpemF0aW9uXG4gKiAtIHVybHMgLSBVUkwgc2NoZW1lIHRvIGJlIHVzZWQgYnkgdHJhbnNwb3J0XG4gKiAtIGhhbmRsZXNBY3Rpdml0eUNoZWNrIC0gdHJ1ZSB3aGVuIHRoZSB0cmFuc3BvcnQgaGFuZGxlcyBhY3Rpdml0eSBjaGVja3NcbiAqIC0gc3VwcG9ydHNQaW5nIC0gdHJ1ZSB3aGVuIHRoZSB0cmFuc3BvcnQgaGFzIGEgcGluZy9hY3Rpdml0eSBBUElcbiAqIC0gaXNTdXBwb3J0ZWQgLSB0ZWxscyB3aGV0aGVyIHRoZSB0cmFuc3BvcnQgaXMgc3VwcG9ydGVkIGluIHRoZSBlbnZpcm9ubWVudFxuICogLSBnZXRTb2NrZXQgLSBjcmVhdGVzIGEgV2ViU29ja2V0LWNvbXBhdGlibGUgdHJhbnNwb3J0IHNvY2tldFxuICpcbiAqIFNlZSB0cmFuc3BvcnRzLmpzIGZvciBzcGVjaWZpYyBpbXBsZW1lbnRhdGlvbnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGhvb2tzIG9iamVjdCBjb250YWluaW5nIGFsbCBuZWVkZWQgdHJhbnNwb3J0IGhvb2tzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYW5zcG9ydCB7XG4gIGhvb2tzOiBUcmFuc3BvcnRIb29rcztcblxuICBjb25zdHJ1Y3Rvcihob29rczogVHJhbnNwb3J0SG9va3MpIHtcbiAgICB0aGlzLmhvb2tzID0gaG9va3M7XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIHRoZSB0cmFuc3BvcnQgaXMgc3VwcG9ydGVkIGluIHRoZSBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudnJvbm1lbnQgdGUgZW52aXJvbm1lbnQgZGV0YWlscyAoZW5jcnlwdGlvbiwgc2V0dGluZ3MpXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSB0cnVlIHdoZW4gdGhlIHRyYW5zcG9ydCBpcyBzdXBwb3J0ZWRcbiAgICovXG4gIGlzU3VwcG9ydGVkKGVudmlyb25tZW50OiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5ob29rcy5pc1N1cHBvcnRlZChlbnZpcm9ubWVudCk7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIHRyYW5zcG9ydCBjb25uZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge051bWJlcn0gcHJpb3JpdHlcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSB0aGUgYXBwbGljYXRpb24ga2V5XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEByZXR1cm5zIHtUcmFuc3BvcnRDb25uZWN0aW9ufVxuICAgKi9cbiAgY3JlYXRlQ29ubmVjdGlvbihcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgcHJpb3JpdHk6IG51bWJlcixcbiAgICBrZXk6IHN0cmluZyxcbiAgICBvcHRpb25zOiBhbnlcbiAgKTogVHJhbnNwb3J0Q29ubmVjdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBUcmFuc3BvcnRDb25uZWN0aW9uKHRoaXMuaG9va3MsIG5hbWUsIHByaW9yaXR5LCBrZXksIG9wdGlvbnMpO1xuICB9XG59XG4iLCAiaW1wb3J0ICogYXMgVVJMU2NoZW1lcyBmcm9tICdjb3JlL3RyYW5zcG9ydHMvdXJsX3NjaGVtZXMnO1xuaW1wb3J0IFVSTFNjaGVtZSBmcm9tICdjb3JlL3RyYW5zcG9ydHMvdXJsX3NjaGVtZSc7XG5pbXBvcnQgVHJhbnNwb3J0IGZyb20gJ2NvcmUvdHJhbnNwb3J0cy90cmFuc3BvcnQnO1xuaW1wb3J0IFV0aWwgZnJvbSAnY29yZS91dGlsJztcbmltcG9ydCAqIGFzIENvbGxlY3Rpb25zIGZyb20gJ2NvcmUvdXRpbHMvY29sbGVjdGlvbnMnO1xuaW1wb3J0IFRyYW5zcG9ydEhvb2tzIGZyb20gJ2NvcmUvdHJhbnNwb3J0cy90cmFuc3BvcnRfaG9va3MnO1xuaW1wb3J0IFRyYW5zcG9ydHNUYWJsZSBmcm9tICdjb3JlL3RyYW5zcG9ydHMvdHJhbnNwb3J0c190YWJsZSc7XG5pbXBvcnQgUnVudGltZSBmcm9tICdydW50aW1lJztcblxuLyoqIFdlYlNvY2tldCB0cmFuc3BvcnQuXG4gKlxuICogVXNlcyBuYXRpdmUgV2ViU29ja2V0IGltcGxlbWVudGF0aW9uLCBpbmNsdWRpbmcgTW96V2ViU29ja2V0IHN1cHBvcnRlZCBieVxuICogZWFybGllciBGaXJlZm94IHZlcnNpb25zLlxuICovXG52YXIgV1NUcmFuc3BvcnQgPSBuZXcgVHJhbnNwb3J0KDxUcmFuc3BvcnRIb29rcz57XG4gIHVybHM6IFVSTFNjaGVtZXMud3MsXG4gIGhhbmRsZXNBY3Rpdml0eUNoZWNrczogZmFsc2UsXG4gIHN1cHBvcnRzUGluZzogZmFsc2UsXG5cbiAgaXNJbml0aWFsaXplZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4oUnVudGltZS5nZXRXZWJTb2NrZXRBUEkoKSk7XG4gIH0sXG4gIGlzU3VwcG9ydGVkOiBmdW5jdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gQm9vbGVhbihSdW50aW1lLmdldFdlYlNvY2tldEFQSSgpKTtcbiAgfSxcbiAgZ2V0U29ja2V0OiBmdW5jdGlvbih1cmwpIHtcbiAgICByZXR1cm4gUnVudGltZS5jcmVhdGVXZWJTb2NrZXQodXJsKTtcbiAgfVxufSk7XG5cbnZhciBodHRwQ29uZmlndXJhdGlvbiA9IHtcbiAgdXJsczogVVJMU2NoZW1lcy5odHRwLFxuICBoYW5kbGVzQWN0aXZpdHlDaGVja3M6IGZhbHNlLFxuICBzdXBwb3J0c1Bpbmc6IHRydWUsXG4gIGlzSW5pdGlhbGl6ZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5leHBvcnQgdmFyIHN0cmVhbWluZ0NvbmZpZ3VyYXRpb24gPSBDb2xsZWN0aW9ucy5leHRlbmQoXG4gIHtcbiAgICBnZXRTb2NrZXQ6IGZ1bmN0aW9uKHVybCkge1xuICAgICAgcmV0dXJuIFJ1bnRpbWUuSFRUUEZhY3RvcnkuY3JlYXRlU3RyZWFtaW5nU29ja2V0KHVybCk7XG4gICAgfVxuICB9LFxuICBodHRwQ29uZmlndXJhdGlvblxuKTtcbmV4cG9ydCB2YXIgcG9sbGluZ0NvbmZpZ3VyYXRpb24gPSBDb2xsZWN0aW9ucy5leHRlbmQoXG4gIHtcbiAgICBnZXRTb2NrZXQ6IGZ1bmN0aW9uKHVybCkge1xuICAgICAgcmV0dXJuIFJ1bnRpbWUuSFRUUEZhY3RvcnkuY3JlYXRlUG9sbGluZ1NvY2tldCh1cmwpO1xuICAgIH1cbiAgfSxcbiAgaHR0cENvbmZpZ3VyYXRpb25cbik7XG5cbnZhciB4aHJDb25maWd1cmF0aW9uID0ge1xuICBpc1N1cHBvcnRlZDogZnVuY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFJ1bnRpbWUuaXNYSFJTdXBwb3J0ZWQoKTtcbiAgfVxufTtcblxuLyoqIEhUVFAgc3RyZWFtaW5nIHRyYW5zcG9ydCB1c2luZyBDT1JTLWVuYWJsZWQgWE1MSHR0cFJlcXVlc3QuICovXG52YXIgWEhSU3RyZWFtaW5nVHJhbnNwb3J0ID0gbmV3IFRyYW5zcG9ydChcbiAgPFRyYW5zcG9ydEhvb2tzPihcbiAgICBDb2xsZWN0aW9ucy5leHRlbmQoe30sIHN0cmVhbWluZ0NvbmZpZ3VyYXRpb24sIHhockNvbmZpZ3VyYXRpb24pXG4gIClcbik7XG5cbi8qKiBIVFRQIGxvbmctcG9sbGluZyB0cmFuc3BvcnQgdXNpbmcgQ09SUy1lbmFibGVkIFhNTEh0dHBSZXF1ZXN0LiAqL1xudmFyIFhIUlBvbGxpbmdUcmFuc3BvcnQgPSBuZXcgVHJhbnNwb3J0KFxuICA8VHJhbnNwb3J0SG9va3M+Q29sbGVjdGlvbnMuZXh0ZW5kKHt9LCBwb2xsaW5nQ29uZmlndXJhdGlvbiwgeGhyQ29uZmlndXJhdGlvbilcbik7XG5cbnZhciBUcmFuc3BvcnRzOiBUcmFuc3BvcnRzVGFibGUgPSB7XG4gIHdzOiBXU1RyYW5zcG9ydCxcbiAgeGhyX3N0cmVhbWluZzogWEhSU3RyZWFtaW5nVHJhbnNwb3J0LFxuICB4aHJfcG9sbGluZzogWEhSUG9sbGluZ1RyYW5zcG9ydFxufTtcblxuZXhwb3J0IGRlZmF1bHQgVHJhbnNwb3J0cztcbiIsICJpbXBvcnQge1xuICBkZWZhdWx0IGFzIFRyYW5zcG9ydHMsXG4gIHN0cmVhbWluZ0NvbmZpZ3VyYXRpb24sXG4gIHBvbGxpbmdDb25maWd1cmF0aW9uXG59IGZyb20gJ2lzb21vcnBoaWMvdHJhbnNwb3J0cy90cmFuc3BvcnRzJztcbmltcG9ydCBUcmFuc3BvcnQgZnJvbSAnY29yZS90cmFuc3BvcnRzL3RyYW5zcG9ydCc7XG5pbXBvcnQgVHJhbnNwb3J0SG9va3MgZnJvbSAnY29yZS90cmFuc3BvcnRzL3RyYW5zcG9ydF9ob29rcyc7XG5pbXBvcnQgKiBhcyBVUkxTY2hlbWVzIGZyb20gJ2NvcmUvdHJhbnNwb3J0cy91cmxfc2NoZW1lcyc7XG5pbXBvcnQgUnVudGltZSBmcm9tICdydW50aW1lJztcbmltcG9ydCB7IERlcGVuZGVuY2llcyB9IGZyb20gJy4uL2RvbS9kZXBlbmRlbmNpZXMnO1xuaW1wb3J0ICogYXMgQ29sbGVjdGlvbnMgZnJvbSAnY29yZS91dGlscy9jb2xsZWN0aW9ucyc7XG5cbnZhciBTb2NrSlNUcmFuc3BvcnQgPSBuZXcgVHJhbnNwb3J0KDxUcmFuc3BvcnRIb29rcz57XG4gIGZpbGU6ICdzb2NranMnLFxuICB1cmxzOiBVUkxTY2hlbWVzLnNvY2tqcyxcbiAgaGFuZGxlc0FjdGl2aXR5Q2hlY2tzOiB0cnVlLFxuICBzdXBwb3J0c1Bpbmc6IGZhbHNlLFxuXG4gIGlzU3VwcG9ydGVkOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgaXNJbml0aWFsaXplZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5Tb2NrSlMgIT09IHVuZGVmaW5lZDtcbiAgfSxcbiAgZ2V0U29ja2V0OiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IHdpbmRvdy5Tb2NrSlModXJsLCBudWxsLCB7XG4gICAgICBqc19wYXRoOiBEZXBlbmRlbmNpZXMuZ2V0UGF0aCgnc29ja2pzJywge1xuICAgICAgICB1c2VUTFM6IG9wdGlvbnMudXNlVExTXG4gICAgICB9KSxcbiAgICAgIGlnbm9yZV9udWxsX29yaWdpbjogb3B0aW9ucy5pZ25vcmVOdWxsT3JpZ2luXG4gICAgfSk7XG4gIH0sXG4gIGJlZm9yZU9wZW46IGZ1bmN0aW9uKHNvY2tldCwgcGF0aCkge1xuICAgIHNvY2tldC5zZW5kKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBwYXRoOiBwYXRoXG4gICAgICB9KVxuICAgICk7XG4gIH1cbn0pO1xuXG52YXIgeGRyQ29uZmlndXJhdGlvbiA9IHtcbiAgaXNTdXBwb3J0ZWQ6IGZ1bmN0aW9uKGVudmlyb25tZW50KTogYm9vbGVhbiB7XG4gICAgdmFyIHllcyA9IFJ1bnRpbWUuaXNYRFJTdXBwb3J0ZWQoZW52aXJvbm1lbnQudXNlVExTKTtcbiAgICByZXR1cm4geWVzO1xuICB9XG59O1xuXG4vKiogSFRUUCBzdHJlYW1pbmcgdHJhbnNwb3J0IHVzaW5nIFhEb21haW5SZXF1ZXN0IChJRSA4LDkpLiAqL1xudmFyIFhEUlN0cmVhbWluZ1RyYW5zcG9ydCA9IG5ldyBUcmFuc3BvcnQoXG4gIDxUcmFuc3BvcnRIb29rcz4oXG4gICAgQ29sbGVjdGlvbnMuZXh0ZW5kKHt9LCBzdHJlYW1pbmdDb25maWd1cmF0aW9uLCB4ZHJDb25maWd1cmF0aW9uKVxuICApXG4pO1xuXG4vKiogSFRUUCBsb25nLXBvbGxpbmcgdHJhbnNwb3J0IHVzaW5nIFhEb21haW5SZXF1ZXN0IChJRSA4LDkpLiAqL1xudmFyIFhEUlBvbGxpbmdUcmFuc3BvcnQgPSBuZXcgVHJhbnNwb3J0KFxuICA8VHJhbnNwb3J0SG9va3M+Q29sbGVjdGlvbnMuZXh0ZW5kKHt9LCBwb2xsaW5nQ29uZmlndXJhdGlvbiwgeGRyQ29uZmlndXJhdGlvbilcbik7XG5cblRyYW5zcG9ydHMueGRyX3N0cmVhbWluZyA9IFhEUlN0cmVhbWluZ1RyYW5zcG9ydDtcblRyYW5zcG9ydHMueGRyX3BvbGxpbmcgPSBYRFJQb2xsaW5nVHJhbnNwb3J0O1xuVHJhbnNwb3J0cy5zb2NranMgPSBTb2NrSlNUcmFuc3BvcnQ7XG5cbmV4cG9ydCBkZWZhdWx0IFRyYW5zcG9ydHM7XG4iLCAiaW1wb3J0IFJlYWNoYWJpbGl0eSBmcm9tICdjb3JlL3JlYWNoYWJpbGl0eSc7XG5pbXBvcnQgeyBkZWZhdWx0IGFzIEV2ZW50c0Rpc3BhdGNoZXIgfSBmcm9tICdjb3JlL2V2ZW50cy9kaXNwYXRjaGVyJztcblxuLyoqIFJlYWxseSBiYXNpYyBpbnRlcmZhY2UgcHJvdmlkaW5nIG5ldHdvcmsgYXZhaWxhYmlsaXR5IGluZm8uXG4gKlxuICogRW1pdHM6XG4gKiAtIG9ubGluZSAtIHdoZW4gYnJvd3NlciBnb2VzIG9ubGluZVxuICogLSBvZmZsaW5lIC0gd2hlbiBicm93c2VyIGdvZXMgb2ZmbGluZVxuICovXG5leHBvcnQgY2xhc3MgTmV0SW5mbyBleHRlbmRzIEV2ZW50c0Rpc3BhdGNoZXIgaW1wbGVtZW50cyBSZWFjaGFiaWxpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAvLyBUaGlzIGlzIG9rYXksIGFzIElFIGRvZXNuJ3Qgc3VwcG9ydCB0aGlzIHN0dWZmIGFueXdheS5cbiAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdvbmxpbmUnLFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzZWxmLmVtaXQoJ29ubGluZScpO1xuICAgICAgICB9LFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAnb2ZmbGluZScsXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNlbGYuZW1pdCgnb2ZmbGluZScpO1xuICAgICAgICB9LFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIGJyb3dzZXIgaXMgb25saW5lIG9yIG5vdFxuICAgKlxuICAgKiBPZmZsaW5lIG1lYW5zIGRlZmluaXRlbHkgb2ZmbGluZSAobm8gY29ubmVjdGlvbiB0byByb3V0ZXIpLlxuICAgKiBJbnZlcnNlIGRvZXMgTk9UIG1lYW4gZGVmaW5pdGVseSBvbmxpbmUgKG9ubHkgY3VycmVudGx5IHN1cHBvcnRlZCBpbiBTYWZhcmlcbiAgICogYW5kIGV2ZW4gdGhlcmUgb25seSBtZWFucyB0aGUgZGV2aWNlIGhhcyBhIGNvbm5lY3Rpb24gdG8gdGhlIHJvdXRlcikuXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBpc09ubGluZSgpOiBib29sZWFuIHtcbiAgICBpZiAod2luZG93Lm5hdmlnYXRvci5vbkxpbmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHZhciBOZXR3b3JrID0gbmV3IE5ldEluZm8oKTtcbiIsICJpbXBvcnQgVXRpbCBmcm9tICcuLi91dGlsJztcbmltcG9ydCAqIGFzIENvbGxlY3Rpb25zIGZyb20gJy4uL3V0aWxzL2NvbGxlY3Rpb25zJztcbmltcG9ydCBUcmFuc3BvcnRNYW5hZ2VyIGZyb20gJy4vdHJhbnNwb3J0X21hbmFnZXInO1xuaW1wb3J0IFRyYW5zcG9ydENvbm5lY3Rpb24gZnJvbSAnLi90cmFuc3BvcnRfY29ubmVjdGlvbic7XG5pbXBvcnQgVHJhbnNwb3J0IGZyb20gJy4vdHJhbnNwb3J0JztcbmltcG9ydCBQaW5nRGVsYXlPcHRpb25zIGZyb20gJy4vcGluZ19kZWxheV9vcHRpb25zJztcblxuLyoqIENyZWF0ZXMgdHJhbnNwb3J0IGNvbm5lY3Rpb25zIG1vbml0b3JlZCBieSBhIHRyYW5zcG9ydCBtYW5hZ2VyLlxuICpcbiAqIFdoZW4gYSB0cmFuc3BvcnQgaXMgY2xvc2VkLCBpdCBtaWdodCBtZWFuIHRoZSBlbnZpcm9ubWVudCBkb2VzIG5vdCBzdXBwb3J0XG4gKiBpdC4gSXQncyBwb3NzaWJsZSB0aGF0IG1lc3NhZ2VzIGdldCBzdHVjayBpbiBhbiBpbnRlcm1lZGlhdGUgYnVmZmVyIG9yXG4gKiBwcm94aWVzIHRlcm1pbmF0ZSBpbmFjdGl2ZSBjb25uZWN0aW9ucy4gVG8gY29tYmF0IHRoZXNlIHByb2JsZW1zLFxuICogYXNzaXN0YW50cyBtb25pdG9yIHRoZSBjb25uZWN0aW9uIGxpZmV0aW1lLCByZXBvcnQgdW5jbGVhbiBleGl0cyBhbmRcbiAqIGFkanVzdCBwaW5nIHRpbWVvdXRzIHRvIGtlZXAgdGhlIGNvbm5lY3Rpb24gYWN0aXZlLiBUaGUgZGVjaXNpb24gdG8gZGlzYWJsZVxuICogYSB0cmFuc3BvcnQgaXMgdGhlIG1hbmFnZXIncyByZXNwb25zaWJpbGl0eS5cbiAqXG4gKiBAcGFyYW0ge1RyYW5zcG9ydE1hbmFnZXJ9IG1hbmFnZXJcbiAqIEBwYXJhbSB7VHJhbnNwb3J0Q29ubmVjdGlvbn0gdHJhbnNwb3J0XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3Npc3RhbnRUb1RoZVRyYW5zcG9ydE1hbmFnZXIge1xuICBtYW5hZ2VyOiBUcmFuc3BvcnRNYW5hZ2VyO1xuICB0cmFuc3BvcnQ6IFRyYW5zcG9ydDtcbiAgbWluUGluZ0RlbGF5OiBudW1iZXI7XG4gIG1heFBpbmdEZWxheTogbnVtYmVyO1xuICBwaW5nRGVsYXk6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBtYW5hZ2VyOiBUcmFuc3BvcnRNYW5hZ2VyLFxuICAgIHRyYW5zcG9ydDogVHJhbnNwb3J0LFxuICAgIG9wdGlvbnM6IFBpbmdEZWxheU9wdGlvbnNcbiAgKSB7XG4gICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICB0aGlzLnRyYW5zcG9ydCA9IHRyYW5zcG9ydDtcbiAgICB0aGlzLm1pblBpbmdEZWxheSA9IG9wdGlvbnMubWluUGluZ0RlbGF5O1xuICAgIHRoaXMubWF4UGluZ0RlbGF5ID0gb3B0aW9ucy5tYXhQaW5nRGVsYXk7XG4gICAgdGhpcy5waW5nRGVsYXkgPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIHRyYW5zcG9ydCBjb25uZWN0aW9uLlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGhhcyB0aGUgc2FtZSBBUEkgYXMgVHJhbnNwb3J0I2NyZWF0ZUNvbm5lY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwcmlvcml0eVxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IHRoZSBhcHBsaWNhdGlvbiBrZXlcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQHJldHVybnMge1RyYW5zcG9ydENvbm5lY3Rpb259XG4gICAqL1xuICBjcmVhdGVDb25uZWN0aW9uKFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgIGtleTogc3RyaW5nLFxuICAgIG9wdGlvbnM6IE9iamVjdFxuICApOiBUcmFuc3BvcnRDb25uZWN0aW9uIHtcbiAgICBvcHRpb25zID0gQ29sbGVjdGlvbnMuZXh0ZW5kKHt9LCBvcHRpb25zLCB7XG4gICAgICBhY3Rpdml0eVRpbWVvdXQ6IHRoaXMucGluZ0RlbGF5XG4gICAgfSk7XG4gICAgdmFyIGNvbm5lY3Rpb24gPSB0aGlzLnRyYW5zcG9ydC5jcmVhdGVDb25uZWN0aW9uKFxuICAgICAgbmFtZSxcbiAgICAgIHByaW9yaXR5LFxuICAgICAga2V5LFxuICAgICAgb3B0aW9uc1xuICAgICk7XG5cbiAgICB2YXIgb3BlblRpbWVzdGFtcCA9IG51bGw7XG5cbiAgICB2YXIgb25PcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25uZWN0aW9uLnVuYmluZCgnb3BlbicsIG9uT3Blbik7XG4gICAgICBjb25uZWN0aW9uLmJpbmQoJ2Nsb3NlZCcsIG9uQ2xvc2VkKTtcbiAgICAgIG9wZW5UaW1lc3RhbXAgPSBVdGlsLm5vdygpO1xuICAgIH07XG4gICAgdmFyIG9uQ2xvc2VkID0gY2xvc2VFdmVudCA9PiB7XG4gICAgICBjb25uZWN0aW9uLnVuYmluZCgnY2xvc2VkJywgb25DbG9zZWQpO1xuXG4gICAgICBpZiAoY2xvc2VFdmVudC5jb2RlID09PSAxMDAyIHx8IGNsb3NlRXZlbnQuY29kZSA9PT0gMTAwMykge1xuICAgICAgICAvLyB3ZSBkb24ndCB3YW50IHRvIHVzZSB0cmFuc3BvcnRzIG5vdCBvYmV5aW5nIHRoZSBwcm90b2NvbFxuICAgICAgICB0aGlzLm1hbmFnZXIucmVwb3J0RGVhdGgoKTtcbiAgICAgIH0gZWxzZSBpZiAoIWNsb3NlRXZlbnQud2FzQ2xlYW4gJiYgb3BlblRpbWVzdGFtcCkge1xuICAgICAgICAvLyByZXBvcnQgZGVhdGhzIG9ubHkgZm9yIHNob3J0LWxpdmluZyB0cmFuc3BvcnRcbiAgICAgICAgdmFyIGxpZmVzcGFuID0gVXRpbC5ub3coKSAtIG9wZW5UaW1lc3RhbXA7XG4gICAgICAgIGlmIChsaWZlc3BhbiA8IDIgKiB0aGlzLm1heFBpbmdEZWxheSkge1xuICAgICAgICAgIHRoaXMubWFuYWdlci5yZXBvcnREZWF0aCgpO1xuICAgICAgICAgIHRoaXMucGluZ0RlbGF5ID0gTWF0aC5tYXgobGlmZXNwYW4gLyAyLCB0aGlzLm1pblBpbmdEZWxheSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29ubmVjdGlvbi5iaW5kKCdvcGVuJywgb25PcGVuKTtcbiAgICByZXR1cm4gY29ubmVjdGlvbjtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHRyYW5zcG9ydCBpcyBzdXBwb3J0ZWQgaW4gdGhlIGVudmlyb25tZW50LlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGhhcyB0aGUgc2FtZSBBUEkgYXMgVHJhbnNwb3J0I2lzU3VwcG9ydGVkLiBNaWdodCByZXR1cm4gZmFsc2VcbiAgICogd2hlbiB0aGUgbWFuYWdlciBkZWNpZGVzIHRvIGtpbGwgdGhlIHRyYW5zcG9ydC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudmlyb25tZW50IHRoZSBlbnZpcm9ubWVudCBkZXRhaWxzIChlbmNyeXB0aW9uLCBzZXR0aW5ncylcbiAgICogQHJldHVybnMge0Jvb2xlYW59IHRydWUgd2hlbiB0aGUgdHJhbnNwb3J0IGlzIHN1cHBvcnRlZFxuICAgKi9cbiAgaXNTdXBwb3J0ZWQoZW52aXJvbm1lbnQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1hbmFnZXIuaXNBbGl2ZSgpICYmIHRoaXMudHJhbnNwb3J0LmlzU3VwcG9ydGVkKGVudmlyb25tZW50KTtcbiAgfVxufVxuIiwgImltcG9ydCBBY3Rpb24gZnJvbSAnLi9hY3Rpb24nO1xuaW1wb3J0IHsgUHVzaGVyRXZlbnQgfSBmcm9tICcuL21lc3NhZ2UtdHlwZXMnO1xuLyoqXG4gKiBQcm92aWRlcyBmdW5jdGlvbnMgZm9yIGhhbmRsaW5nIFB1c2hlciBwcm90b2NvbC1zcGVjaWZpYyBtZXNzYWdlcy5cbiAqL1xuXG5jb25zdCBQcm90b2NvbCA9IHtcbiAgLyoqXG4gICAqIERlY29kZXMgYSBtZXNzYWdlIGluIGEgUHVzaGVyIGZvcm1hdC5cbiAgICpcbiAgICogVGhlIE1lc3NhZ2VFdmVudCB3ZSByZWNlaXZlIGZyb20gdGhlIHRyYW5zcG9ydCBzaG91bGQgY29udGFpbiBhIHB1c2hlciBldmVudFxuICAgKiAoaHR0cHM6Ly9wdXNoZXIuY29tL2RvY3MvcHVzaGVyX3Byb3RvY29sI2V2ZW50cykgc2VyaWFsaXplZCBhcyBKU09OIGluIHRoZVxuICAgKiBkYXRhIGZpZWxkXG4gICAqXG4gICAqIFRoZSBwdXNoZXIgZXZlbnQgbWF5IGNvbnRhaW4gYSBkYXRhIGZpZWxkIHRvbywgYW5kIGl0IG1heSBhbHNvIGJlXG4gICAqIHNlcmlhbGlzZWQgYXMgSlNPTlxuICAgKlxuICAgKiBUaHJvd3MgZXJyb3JzIHdoZW4gbWVzc2FnZXMgYXJlIG5vdCBwYXJzZSdhYmxlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtNZXNzYWdlRXZlbnR9IG1lc3NhZ2VFdmVudFxuICAgKiBAcmV0dXJuIHtQdXNoZXJFdmVudH1cbiAgICovXG4gIGRlY29kZU1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2VFdmVudDogTWVzc2FnZUV2ZW50KTogUHVzaGVyRXZlbnQge1xuICAgIHRyeSB7XG4gICAgICB2YXIgbWVzc2FnZURhdGEgPSBKU09OLnBhcnNlKG1lc3NhZ2VFdmVudC5kYXRhKTtcbiAgICAgIHZhciBwdXNoZXJFdmVudERhdGEgPSBtZXNzYWdlRGF0YS5kYXRhO1xuICAgICAgaWYgKHR5cGVvZiBwdXNoZXJFdmVudERhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcHVzaGVyRXZlbnREYXRhID0gSlNPTi5wYXJzZShtZXNzYWdlRGF0YS5kYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cbiAgICAgIHZhciBwdXNoZXJFdmVudDogUHVzaGVyRXZlbnQgPSB7XG4gICAgICAgIGV2ZW50OiBtZXNzYWdlRGF0YS5ldmVudCxcbiAgICAgICAgY2hhbm5lbDogbWVzc2FnZURhdGEuY2hhbm5lbCxcbiAgICAgICAgZGF0YTogcHVzaGVyRXZlbnREYXRhXG4gICAgICB9O1xuICAgICAgaWYgKG1lc3NhZ2VEYXRhLnVzZXJfaWQpIHtcbiAgICAgICAgcHVzaGVyRXZlbnQudXNlcl9pZCA9IG1lc3NhZ2VEYXRhLnVzZXJfaWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gcHVzaGVyRXZlbnQ7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgeyB0eXBlOiAnTWVzc2FnZVBhcnNlRXJyb3InLCBlcnJvcjogZSwgZGF0YTogbWVzc2FnZUV2ZW50LmRhdGEgfTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEVuY29kZXMgYSBtZXNzYWdlIHRvIGJlIHNlbnQuXG4gICAqXG4gICAqIEBwYXJhbSAge1B1c2hlckV2ZW50fSBldmVudFxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBlbmNvZGVNZXNzYWdlOiBmdW5jdGlvbihldmVudDogUHVzaGVyRXZlbnQpOiBzdHJpbmcge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShldmVudCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFByb2Nlc3NlcyBhIGhhbmRzaGFrZSBtZXNzYWdlIGFuZCByZXR1cm5zIGFwcHJvcHJpYXRlIGFjdGlvbnMuXG4gICAqXG4gICAqIFJldHVybnMgYW4gb2JqZWN0IHdpdGggYW4gJ2FjdGlvbicgYW5kIG90aGVyIGFjdGlvbi1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBUaGVyZSBhcmUgdGhyZWUgb3V0Y29tZXMgd2hlbiBjYWxsaW5nIHRoaXMgZnVuY3Rpb24uIEZpcnN0IGlzIGEgc3VjY2Vzc2Z1bFxuICAgKiBjb25uZWN0aW9uIGF0dGVtcHQsIHdoZW4gcHVzaGVyOmNvbm5lY3Rpb25fZXN0YWJsaXNoZWQgaXMgcmVjZWl2ZWQsIHdoaWNoXG4gICAqIHJlc3VsdHMgaW4gYSAnY29ubmVjdGVkJyBhY3Rpb24gd2l0aCBhbiAnaWQnIHByb3BlcnR5LiBXaGVuIHBhc3NlZCBhXG4gICAqIHB1c2hlcjplcnJvciBldmVudCwgaXQgcmV0dXJucyBhIHJlc3VsdCB3aXRoIGFjdGlvbiBhcHByb3ByaWF0ZSB0byB0aGVcbiAgICogY2xvc2UgY29kZSBhbmQgYW4gZXJyb3IuIE90aGVyd2lzZSwgaXQgcmFpc2VzIGFuIGV4Y2VwdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAgICogQHJlc3VsdCBPYmplY3RcbiAgICovXG4gIHByb2Nlc3NIYW5kc2hha2U6IGZ1bmN0aW9uKG1lc3NhZ2VFdmVudDogTWVzc2FnZUV2ZW50KTogQWN0aW9uIHtcbiAgICB2YXIgbWVzc2FnZSA9IFByb3RvY29sLmRlY29kZU1lc3NhZ2UobWVzc2FnZUV2ZW50KTtcblxuICAgIGlmIChtZXNzYWdlLmV2ZW50ID09PSAncHVzaGVyOmNvbm5lY3Rpb25fZXN0YWJsaXNoZWQnKSB7XG4gICAgICBpZiAoIW1lc3NhZ2UuZGF0YS5hY3Rpdml0eV90aW1lb3V0KSB7XG4gICAgICAgIHRocm93ICdObyBhY3Rpdml0eSB0aW1lb3V0IHNwZWNpZmllZCBpbiBoYW5kc2hha2UnO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYWN0aW9uOiAnY29ubmVjdGVkJyxcbiAgICAgICAgaWQ6IG1lc3NhZ2UuZGF0YS5zb2NrZXRfaWQsXG4gICAgICAgIGFjdGl2aXR5VGltZW91dDogbWVzc2FnZS5kYXRhLmFjdGl2aXR5X3RpbWVvdXQgKiAxMDAwXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS5ldmVudCA9PT0gJ3B1c2hlcjplcnJvcicpIHtcbiAgICAgIC8vIEZyb20gcHJvdG9jb2wgNiBjbG9zZSBjb2RlcyBhcmUgc2VudCBvbmx5IG9uY2UsIHNvIHRoaXMgb25seVxuICAgICAgLy8gaGFwcGVucyB3aGVuIGNvbm5lY3Rpb24gZG9lcyBub3Qgc3VwcG9ydCBjbG9zZSBjb2Rlc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYWN0aW9uOiB0aGlzLmdldENsb3NlQWN0aW9uKG1lc3NhZ2UuZGF0YSksXG4gICAgICAgIGVycm9yOiB0aGlzLmdldENsb3NlRXJyb3IobWVzc2FnZS5kYXRhKVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgJ0ludmFsaWQgaGFuZHNoYWtlJztcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIERpc3BhdGNoZXMgdGhlIGNsb3NlIGV2ZW50IGFuZCByZXR1cm5zIGFuIGFwcHJvcHJpYXRlIGFjdGlvbiBuYW1lLlxuICAgKlxuICAgKiBTZWU6XG4gICAqIDEuIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViU29ja2V0cy9XZWJTb2NrZXRzX3JlZmVyZW5jZS9DbG9zZUV2ZW50XG4gICAqIDIuIGh0dHA6Ly9wdXNoZXIuY29tL2RvY3MvcHVzaGVyX3Byb3RvY29sXG4gICAqXG4gICAqIEBwYXJhbSAge0Nsb3NlRXZlbnR9IGNsb3NlRXZlbnRcbiAgICogQHJldHVybiB7U3RyaW5nfSBjbG9zZSBhY3Rpb24gbmFtZVxuICAgKi9cbiAgZ2V0Q2xvc2VBY3Rpb246IGZ1bmN0aW9uKGNsb3NlRXZlbnQpOiBzdHJpbmcge1xuICAgIGlmIChjbG9zZUV2ZW50LmNvZGUgPCA0MDAwKSB7XG4gICAgICAvLyBpZ25vcmUgMTAwMCBDTE9TRV9OT1JNQUwsIDEwMDEgQ0xPU0VfR09JTkdfQVdBWSxcbiAgICAgIC8vICAgICAgICAxMDA1IENMT1NFX05PX1NUQVRVUywgMTAwNiBDTE9TRV9BQk5PUk1BTFxuICAgICAgLy8gaWdub3JlIDEwMDcuLi4zOTk5XG4gICAgICAvLyBoYW5kbGUgMTAwMiBDTE9TRV9QUk9UT0NPTF9FUlJPUiwgMTAwMyBDTE9TRV9VTlNVUFBPUlRFRCxcbiAgICAgIC8vICAgICAgICAxMDA0IENMT1NFX1RPT19MQVJHRVxuICAgICAgaWYgKGNsb3NlRXZlbnQuY29kZSA+PSAxMDAyICYmIGNsb3NlRXZlbnQuY29kZSA8PSAxMDA0KSB7XG4gICAgICAgIHJldHVybiAnYmFja29mZic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNsb3NlRXZlbnQuY29kZSA9PT0gNDAwMCkge1xuICAgICAgcmV0dXJuICd0bHNfb25seSc7XG4gICAgfSBlbHNlIGlmIChjbG9zZUV2ZW50LmNvZGUgPCA0MTAwKSB7XG4gICAgICByZXR1cm4gJ3JlZnVzZWQnO1xuICAgIH0gZWxzZSBpZiAoY2xvc2VFdmVudC5jb2RlIDwgNDIwMCkge1xuICAgICAgcmV0dXJuICdiYWNrb2ZmJztcbiAgICB9IGVsc2UgaWYgKGNsb3NlRXZlbnQuY29kZSA8IDQzMDApIHtcbiAgICAgIHJldHVybiAncmV0cnknO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB1bmtub3duIGVycm9yXG4gICAgICByZXR1cm4gJ3JlZnVzZWQnO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBlcnJvciBvciBudWxsIGJhc2luZyBvbiB0aGUgY2xvc2UgZXZlbnQuXG4gICAqXG4gICAqIE51bGwgaXMgcmV0dXJuZWQgd2hlbiBjb25uZWN0aW9uIHdhcyBjbG9zZWQgY2xlYW5seS4gT3RoZXJ3aXNlLCBhbiBvYmplY3RcbiAgICogd2l0aCBlcnJvciBkZXRhaWxzIGlzIHJldHVybmVkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtDbG9zZUV2ZW50fSBjbG9zZUV2ZW50XG4gICAqIEByZXR1cm4ge09iamVjdH0gZXJyb3Igb2JqZWN0XG4gICAqL1xuICBnZXRDbG9zZUVycm9yOiBmdW5jdGlvbihjbG9zZUV2ZW50KTogYW55IHtcbiAgICBpZiAoY2xvc2VFdmVudC5jb2RlICE9PSAxMDAwICYmIGNsb3NlRXZlbnQuY29kZSAhPT0gMTAwMSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ1B1c2hlckVycm9yJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGNvZGU6IGNsb3NlRXZlbnQuY29kZSxcbiAgICAgICAgICBtZXNzYWdlOiBjbG9zZUV2ZW50LnJlYXNvbiB8fCBjbG9zZUV2ZW50Lm1lc3NhZ2VcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQcm90b2NvbDtcbiIsICJpbXBvcnQgKiBhcyBDb2xsZWN0aW9ucyBmcm9tICcuLi91dGlscy9jb2xsZWN0aW9ucyc7XG5pbXBvcnQgeyBkZWZhdWx0IGFzIEV2ZW50c0Rpc3BhdGNoZXIgfSBmcm9tICcuLi9ldmVudHMvZGlzcGF0Y2hlcic7XG5pbXBvcnQgUHJvdG9jb2wgZnJvbSAnLi9wcm90b2NvbC9wcm90b2NvbCc7XG5pbXBvcnQgeyBQdXNoZXJFdmVudCB9IGZyb20gJy4vcHJvdG9jb2wvbWVzc2FnZS10eXBlcyc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL2xvZ2dlcic7XG5pbXBvcnQgVHJhbnNwb3J0Q29ubmVjdGlvbiBmcm9tICcuLi90cmFuc3BvcnRzL3RyYW5zcG9ydF9jb25uZWN0aW9uJztcbmltcG9ydCBTb2NrZXQgZnJvbSAnLi4vc29ja2V0Jztcbi8qKlxuICogUHJvdmlkZXMgUHVzaGVyIHByb3RvY29sIGludGVyZmFjZSBmb3IgdHJhbnNwb3J0cy5cbiAqXG4gKiBFbWl0cyBmb2xsb3dpbmcgZXZlbnRzOlxuICogLSBtZXNzYWdlIC0gb24gcmVjZWl2ZWQgbWVzc2FnZXNcbiAqIC0gcGluZyAtIG9uIHBpbmcgcmVxdWVzdHNcbiAqIC0gcG9uZyAtIG9uIHBvbmcgcmVzcG9uc2VzXG4gKiAtIGVycm9yIC0gd2hlbiB0aGUgdHJhbnNwb3J0IGVtaXRzIGFuIGVycm9yXG4gKiAtIGNsb3NlZCAtIGFmdGVyIGNsb3NpbmcgdGhlIHRyYW5zcG9ydFxuICpcbiAqIEl0IGFsc28gZW1pdHMgbW9yZSBldmVudHMgd2hlbiBjb25uZWN0aW9uIGNsb3NlcyB3aXRoIGEgY29kZS5cbiAqIFNlZSBQcm90b2NvbC5nZXRDbG9zZUFjdGlvbiB0byBnZXQgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZFxuICogQHBhcmFtIHtBYnN0cmFjdFRyYW5zcG9ydH0gdHJhbnNwb3J0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbm5lY3Rpb24gZXh0ZW5kcyBFdmVudHNEaXNwYXRjaGVyIGltcGxlbWVudHMgU29ja2V0IHtcbiAgaWQ6IHN0cmluZztcbiAgdHJhbnNwb3J0OiBUcmFuc3BvcnRDb25uZWN0aW9uO1xuICBhY3Rpdml0eVRpbWVvdXQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCB0cmFuc3BvcnQ6IFRyYW5zcG9ydENvbm5lY3Rpb24pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLnRyYW5zcG9ydCA9IHRyYW5zcG9ydDtcbiAgICB0aGlzLmFjdGl2aXR5VGltZW91dCA9IHRyYW5zcG9ydC5hY3Rpdml0eVRpbWVvdXQ7XG4gICAgdGhpcy5iaW5kTGlzdGVuZXJzKCk7XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIHVzZWQgdHJhbnNwb3J0IGhhbmRsZXMgYWN0aXZpdHkgY2hlY2tzIGJ5IGl0c2VsZlxuICAgKlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiBhY3Rpdml0eSBjaGVja3MgYXJlIGhhbmRsZWQgYnkgdGhlIHRyYW5zcG9ydFxuICAgKi9cbiAgaGFuZGxlc0FjdGl2aXR5Q2hlY2tzKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5oYW5kbGVzQWN0aXZpdHlDaGVja3MoKTtcbiAgfVxuXG4gIC8qKiBTZW5kcyByYXcgZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGFcbiAgICovXG4gIHNlbmQoZGF0YTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LnNlbmQoZGF0YSk7XG4gIH1cblxuICAvKiogU2VuZHMgYW4gZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbY2hhbm5lbF1cbiAgICogQHJldHVybnMge0Jvb2xlYW59IHdoZXRoZXIgbWVzc2FnZSB3YXMgc2VudCBvciBub3RcbiAgICovXG4gIHNlbmRfZXZlbnQobmFtZTogc3RyaW5nLCBkYXRhOiBhbnksIGNoYW5uZWw/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICB2YXIgZXZlbnQ6IFB1c2hlckV2ZW50ID0geyBldmVudDogbmFtZSwgZGF0YTogZGF0YSB9O1xuICAgIGlmIChjaGFubmVsKSB7XG4gICAgICBldmVudC5jaGFubmVsID0gY2hhbm5lbDtcbiAgICB9XG4gICAgTG9nZ2VyLmRlYnVnKCdFdmVudCBzZW50JywgZXZlbnQpO1xuICAgIHJldHVybiB0aGlzLnNlbmQoUHJvdG9jb2wuZW5jb2RlTWVzc2FnZShldmVudCkpO1xuICB9XG5cbiAgLyoqIFNlbmRzIGEgcGluZyBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEJhc2luZyBvbiB0aGUgdW5kZXJseWluZyB0cmFuc3BvcnQsIGl0IG1pZ2h0IHNlbmQgZWl0aGVyIHRyYW5zcG9ydCdzXG4gICAqIHByb3RvY29sLXNwZWNpZmljIHBpbmcgb3IgcHVzaGVyOnBpbmcgZXZlbnQuXG4gICAqL1xuICBwaW5nKCkge1xuICAgIGlmICh0aGlzLnRyYW5zcG9ydC5zdXBwb3J0c1BpbmcoKSkge1xuICAgICAgdGhpcy50cmFuc3BvcnQucGluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbmRfZXZlbnQoJ3B1c2hlcjpwaW5nJywge30pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIGNvbm5lY3Rpb24uICovXG4gIGNsb3NlKCkge1xuICAgIHRoaXMudHJhbnNwb3J0LmNsb3NlKCk7XG4gIH1cblxuICBwcml2YXRlIGJpbmRMaXN0ZW5lcnMoKSB7XG4gICAgdmFyIGxpc3RlbmVycyA9IHtcbiAgICAgIG1lc3NhZ2U6IChtZXNzYWdlRXZlbnQ6IE1lc3NhZ2VFdmVudCkgPT4ge1xuICAgICAgICB2YXIgcHVzaGVyRXZlbnQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcHVzaGVyRXZlbnQgPSBQcm90b2NvbC5kZWNvZGVNZXNzYWdlKG1lc3NhZ2VFdmVudCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywge1xuICAgICAgICAgICAgdHlwZTogJ01lc3NhZ2VQYXJzZUVycm9yJyxcbiAgICAgICAgICAgIGVycm9yOiBlLFxuICAgICAgICAgICAgZGF0YTogbWVzc2FnZUV2ZW50LmRhdGFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwdXNoZXJFdmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgTG9nZ2VyLmRlYnVnKCdFdmVudCByZWNkJywgcHVzaGVyRXZlbnQpO1xuXG4gICAgICAgICAgc3dpdGNoIChwdXNoZXJFdmVudC5ldmVudCkge1xuICAgICAgICAgICAgY2FzZSAncHVzaGVyOmVycm9yJzpcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUHVzaGVyRXJyb3InLFxuICAgICAgICAgICAgICAgIGRhdGE6IHB1c2hlckV2ZW50LmRhdGFcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncHVzaGVyOnBpbmcnOlxuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3BpbmcnKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdwdXNoZXI6cG9uZyc6XG4gICAgICAgICAgICAgIHRoaXMuZW1pdCgncG9uZycpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5lbWl0KCdtZXNzYWdlJywgcHVzaGVyRXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYWN0aXZpdHk6ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCdhY3Rpdml0eScpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBlcnJvciA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnJvcik7XG4gICAgICB9LFxuICAgICAgY2xvc2VkOiBjbG9zZUV2ZW50ID0+IHtcbiAgICAgICAgdW5iaW5kTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgaWYgKGNsb3NlRXZlbnQgJiYgY2xvc2VFdmVudC5jb2RlKSB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVDbG9zZUV2ZW50KGNsb3NlRXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmFuc3BvcnQgPSBudWxsO1xuICAgICAgICB0aGlzLmVtaXQoJ2Nsb3NlZCcpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgdW5iaW5kTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgQ29sbGVjdGlvbnMub2JqZWN0QXBwbHkobGlzdGVuZXJzLCAobGlzdGVuZXIsIGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMudHJhbnNwb3J0LnVuYmluZChldmVudCwgbGlzdGVuZXIpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIENvbGxlY3Rpb25zLm9iamVjdEFwcGx5KGxpc3RlbmVycywgKGxpc3RlbmVyLCBldmVudCkgPT4ge1xuICAgICAgdGhpcy50cmFuc3BvcnQuYmluZChldmVudCwgbGlzdGVuZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVDbG9zZUV2ZW50KGNsb3NlRXZlbnQ6IGFueSkge1xuICAgIHZhciBhY3Rpb24gPSBQcm90b2NvbC5nZXRDbG9zZUFjdGlvbihjbG9zZUV2ZW50KTtcbiAgICB2YXIgZXJyb3IgPSBQcm90b2NvbC5nZXRDbG9zZUVycm9yKGNsb3NlRXZlbnQpO1xuICAgIGlmIChlcnJvcikge1xuICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yKTtcbiAgICB9XG4gICAgaWYgKGFjdGlvbikge1xuICAgICAgdGhpcy5lbWl0KGFjdGlvbiwgeyBhY3Rpb246IGFjdGlvbiwgZXJyb3I6IGVycm9yIH0pO1xuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCBVdGlsIGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0ICogYXMgQ29sbGVjdGlvbnMgZnJvbSAnLi4vLi4vdXRpbHMvY29sbGVjdGlvbnMnO1xuaW1wb3J0IFByb3RvY29sIGZyb20gJy4uL3Byb3RvY29sL3Byb3RvY29sJztcbmltcG9ydCBDb25uZWN0aW9uIGZyb20gJy4uL2Nvbm5lY3Rpb24nO1xuaW1wb3J0IFRyYW5zcG9ydENvbm5lY3Rpb24gZnJvbSAnLi4vLi4vdHJhbnNwb3J0cy90cmFuc3BvcnRfY29ubmVjdGlvbic7XG5pbXBvcnQgSGFuZHNoYWtlUGF5bG9hZCBmcm9tICcuL2hhbmRzaGFrZV9wYXlsb2FkJztcblxuLyoqXG4gKiBIYW5kbGVzIFB1c2hlciBwcm90b2NvbCBoYW5kc2hha2VzIGZvciB0cmFuc3BvcnRzLlxuICpcbiAqIENhbGxzIGJhY2sgd2l0aCBhIHJlc3VsdCBvYmplY3QgYWZ0ZXIgaGFuZHNoYWtlIGlzIGNvbXBsZXRlZC4gUmVzdWx0c1xuICogYWx3YXlzIGhhdmUgdHdvIGZpZWxkczpcbiAqIC0gYWN0aW9uIC0gc3RyaW5nIGRlc2NyaWJpbmcgYWN0aW9uIHRvIGJlIHRha2VuIGFmdGVyIHRoZSBoYW5kc2hha2VcbiAqIC0gdHJhbnNwb3J0IC0gdGhlIHRyYW5zcG9ydCBvYmplY3QgcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3RvclxuICpcbiAqIERpZmZlcmVudCBhY3Rpb25zIGNhbiBzZXQgZGlmZmVyZW50IGFkZGl0aW9uYWwgcHJvcGVydGllcyBvbiB0aGUgcmVzdWx0LlxuICogSW4gdGhlIGNhc2Ugb2YgJ2Nvbm5lY3RlZCcgYWN0aW9uLCB0aGVyZSB3aWxsIGJlIGEgJ2Nvbm5lY3Rpb24nIHByb3BlcnR5XG4gKiBjb250YWluaW5nIGEgQ29ubmVjdGlvbiBvYmplY3QgZm9yIHRoZSB0cmFuc3BvcnQuIE90aGVyIGFjdGlvbnMgc2hvdWxkXG4gKiBjYXJyeSBhbiAnZXJyb3InIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7QWJzdHJhY3RUcmFuc3BvcnR9IHRyYW5zcG9ydFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGFuZHNoYWtlIHtcbiAgdHJhbnNwb3J0OiBUcmFuc3BvcnRDb25uZWN0aW9uO1xuICBjYWxsYmFjazogKEhhbmRzaGFrZVBheWxvYWQpID0+IHZvaWQ7XG4gIG9uTWVzc2FnZTogRnVuY3Rpb247XG4gIG9uQ2xvc2VkOiBGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB0cmFuc3BvcnQ6IFRyYW5zcG9ydENvbm5lY3Rpb24sXG4gICAgY2FsbGJhY2s6IChIYW5kc2hha2VQYXlsb2FkKSA9PiB2b2lkXG4gICkge1xuICAgIHRoaXMudHJhbnNwb3J0ID0gdHJhbnNwb3J0O1xuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB0aGlzLmJpbmRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMudW5iaW5kTGlzdGVuZXJzKCk7XG4gICAgdGhpcy50cmFuc3BvcnQuY2xvc2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgYmluZExpc3RlbmVycygpIHtcbiAgICB0aGlzLm9uTWVzc2FnZSA9IG0gPT4ge1xuICAgICAgdGhpcy51bmJpbmRMaXN0ZW5lcnMoKTtcblxuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IFByb3RvY29sLnByb2Nlc3NIYW5kc2hha2UobSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMuZmluaXNoKCdlcnJvcicsIHsgZXJyb3I6IGUgfSk7XG4gICAgICAgIHRoaXMudHJhbnNwb3J0LmNsb3NlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdC5hY3Rpb24gPT09ICdjb25uZWN0ZWQnKSB7XG4gICAgICAgIHRoaXMuZmluaXNoKCdjb25uZWN0ZWQnLCB7XG4gICAgICAgICAgY29ubmVjdGlvbjogbmV3IENvbm5lY3Rpb24ocmVzdWx0LmlkLCB0aGlzLnRyYW5zcG9ydCksXG4gICAgICAgICAgYWN0aXZpdHlUaW1lb3V0OiByZXN1bHQuYWN0aXZpdHlUaW1lb3V0XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maW5pc2gocmVzdWx0LmFjdGlvbiwgeyBlcnJvcjogcmVzdWx0LmVycm9yIH0pO1xuICAgICAgICB0aGlzLnRyYW5zcG9ydC5jbG9zZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLm9uQ2xvc2VkID0gY2xvc2VFdmVudCA9PiB7XG4gICAgICB0aGlzLnVuYmluZExpc3RlbmVycygpO1xuXG4gICAgICB2YXIgYWN0aW9uID0gUHJvdG9jb2wuZ2V0Q2xvc2VBY3Rpb24oY2xvc2VFdmVudCkgfHwgJ2JhY2tvZmYnO1xuICAgICAgdmFyIGVycm9yID0gUHJvdG9jb2wuZ2V0Q2xvc2VFcnJvcihjbG9zZUV2ZW50KTtcbiAgICAgIHRoaXMuZmluaXNoKGFjdGlvbiwgeyBlcnJvcjogZXJyb3IgfSk7XG4gICAgfTtcblxuICAgIHRoaXMudHJhbnNwb3J0LmJpbmQoJ21lc3NhZ2UnLCB0aGlzLm9uTWVzc2FnZSk7XG4gICAgdGhpcy50cmFuc3BvcnQuYmluZCgnY2xvc2VkJywgdGhpcy5vbkNsb3NlZCk7XG4gIH1cblxuICBwcml2YXRlIHVuYmluZExpc3RlbmVycygpIHtcbiAgICB0aGlzLnRyYW5zcG9ydC51bmJpbmQoJ21lc3NhZ2UnLCB0aGlzLm9uTWVzc2FnZSk7XG4gICAgdGhpcy50cmFuc3BvcnQudW5iaW5kKCdjbG9zZWQnLCB0aGlzLm9uQ2xvc2VkKTtcbiAgfVxuXG4gIHByaXZhdGUgZmluaXNoKGFjdGlvbjogc3RyaW5nLCBwYXJhbXM6IGFueSkge1xuICAgIHRoaXMuY2FsbGJhY2soXG4gICAgICBDb2xsZWN0aW9ucy5leHRlbmQoeyB0cmFuc3BvcnQ6IHRoaXMudHJhbnNwb3J0LCBhY3Rpb246IGFjdGlvbiB9LCBwYXJhbXMpXG4gICAgKTtcbiAgfVxufVxuIiwgImltcG9ydCAqIGFzIENvbGxlY3Rpb25zIGZyb20gJy4uL3V0aWxzL2NvbGxlY3Rpb25zJztcbmltcG9ydCBVdGlsIGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IGJhc2U2NGVuY29kZSBmcm9tICcuLi9iYXNlNjQnO1xuaW1wb3J0IFRpbWVsaW5lIGZyb20gJy4vdGltZWxpbmUnO1xuaW1wb3J0IFJ1bnRpbWUgZnJvbSAncnVudGltZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGltZWxpbmVTZW5kZXJPcHRpb25zIHtcbiAgaG9zdD86IHN0cmluZztcbiAgcG9ydD86IG51bWJlcjtcbiAgcGF0aD86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWxpbmVTZW5kZXIge1xuICB0aW1lbGluZTogVGltZWxpbmU7XG4gIG9wdGlvbnM6IFRpbWVsaW5lU2VuZGVyT3B0aW9ucztcbiAgaG9zdDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lOiBUaW1lbGluZSwgb3B0aW9uczogVGltZWxpbmVTZW5kZXJPcHRpb25zKSB7XG4gICAgdGhpcy50aW1lbGluZSA9IHRpbWVsaW5lO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIH1cblxuICBzZW5kKHVzZVRMUzogYm9vbGVhbiwgY2FsbGJhY2s/OiBGdW5jdGlvbikge1xuICAgIGlmICh0aGlzLnRpbWVsaW5lLmlzRW1wdHkoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudGltZWxpbmUuc2VuZChcbiAgICAgIFJ1bnRpbWUuVGltZWxpbmVUcmFuc3BvcnQuZ2V0QWdlbnQodGhpcywgdXNlVExTKSxcbiAgICAgIGNhbGxiYWNrXG4gICAgKTtcbiAgfVxufVxuIiwgImltcG9ydCB7IGRlZmF1bHQgYXMgRXZlbnRzRGlzcGF0Y2hlciB9IGZyb20gJy4uL2V2ZW50cy9kaXNwYXRjaGVyJztcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICcuLi9lcnJvcnMnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuLi9sb2dnZXInO1xuaW1wb3J0IFB1c2hlciBmcm9tICcuLi9wdXNoZXInO1xuaW1wb3J0IHsgUHVzaGVyRXZlbnQgfSBmcm9tICcuLi9jb25uZWN0aW9uL3Byb3RvY29sL21lc3NhZ2UtdHlwZXMnO1xuaW1wb3J0IE1ldGFkYXRhIGZyb20gJy4vbWV0YWRhdGEnO1xuaW1wb3J0IFVybFN0b3JlIGZyb20gJy4uL3V0aWxzL3VybF9zdG9yZSc7XG5pbXBvcnQge1xuICBDaGFubmVsQXV0aG9yaXphdGlvbkRhdGEsXG4gIENoYW5uZWxBdXRob3JpemF0aW9uQ2FsbGJhY2tcbn0gZnJvbSAnLi4vYXV0aC9vcHRpb25zJztcbmltcG9ydCB7IEhUVFBBdXRoRXJyb3IgfSBmcm9tICcuLi9lcnJvcnMnO1xuXG4vKiogUHJvdmlkZXMgYmFzZSBwdWJsaWMgY2hhbm5lbCBpbnRlcmZhY2Ugd2l0aCBhbiBldmVudCBlbWl0dGVyLlxuICpcbiAqIEVtaXRzOlxuICogLSBwdXNoZXI6c3Vic2NyaXB0aW9uX3N1Y2NlZWRlZCAtIGFmdGVyIHN1YnNjcmliaW5nIHN1Y2Nlc3NmdWxseVxuICogLSBvdGhlciBub24taW50ZXJuYWwgZXZlbnRzXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7UHVzaGVyfSBwdXNoZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbm5lbCBleHRlbmRzIEV2ZW50c0Rpc3BhdGNoZXIge1xuICBuYW1lOiBzdHJpbmc7XG4gIHB1c2hlcjogUHVzaGVyO1xuICBzdWJzY3JpYmVkOiBib29sZWFuO1xuICBzdWJzY3JpcHRpb25QZW5kaW5nOiBib29sZWFuO1xuICBzdWJzY3JpcHRpb25DYW5jZWxsZWQ6IGJvb2xlYW47XG4gIHN1YnNjcmlwdGlvbkNvdW50OiBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgcHVzaGVyOiBQdXNoZXIpIHtcbiAgICBzdXBlcihmdW5jdGlvbihldmVudCwgZGF0YSkge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdObyBjYWxsYmFja3Mgb24gJyArIG5hbWUgKyAnIGZvciAnICsgZXZlbnQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnB1c2hlciA9IHB1c2hlcjtcbiAgICB0aGlzLnN1YnNjcmliZWQgPSBmYWxzZTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvblBlbmRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbkNhbmNlbGxlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIFNraXBzIGF1dGhvcml6YXRpb24sIHNpbmNlIHB1YmxpYyBjaGFubmVscyBkb24ndCByZXF1aXJlIGl0LlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgYXV0aG9yaXplKHNvY2tldElkOiBzdHJpbmcsIGNhbGxiYWNrOiBDaGFubmVsQXV0aG9yaXphdGlvbkNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHsgYXV0aDogJycgfSk7XG4gIH1cblxuICAvKiogVHJpZ2dlcnMgYW4gZXZlbnQgKi9cbiAgdHJpZ2dlcihldmVudDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBpZiAoZXZlbnQuaW5kZXhPZignY2xpZW50LScpICE9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3JzLkJhZEV2ZW50TmFtZShcbiAgICAgICAgXCJFdmVudCAnXCIgKyBldmVudCArIFwiJyBkb2VzIG5vdCBzdGFydCB3aXRoICdjbGllbnQtJ1wiXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc3Vic2NyaWJlZCkge1xuICAgICAgdmFyIHN1ZmZpeCA9IFVybFN0b3JlLmJ1aWxkTG9nU3VmZml4KCd0cmlnZ2VyaW5nQ2xpZW50RXZlbnRzJyk7XG4gICAgICBMb2dnZXIud2FybihcbiAgICAgICAgYENsaWVudCBldmVudCB0cmlnZ2VyZWQgYmVmb3JlIGNoYW5uZWwgJ3N1YnNjcmlwdGlvbl9zdWNjZWVkZWQnIGV2ZW50IC4gJHtzdWZmaXh9YFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHVzaGVyLnNlbmRfZXZlbnQoZXZlbnQsIGRhdGEsIHRoaXMubmFtZSk7XG4gIH1cblxuICAvKiogU2lnbmFscyBkaXNjb25uZWN0aW9uIHRvIHRoZSBjaGFubmVsLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuICovXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25QZW5kaW5nID0gZmFsc2U7XG4gIH1cblxuICAvKiogSGFuZGxlcyBhIFB1c2hlckV2ZW50LiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAqXG4gICAqIEBwYXJhbSB7UHVzaGVyRXZlbnR9IGV2ZW50XG4gICAqL1xuICBoYW5kbGVFdmVudChldmVudDogUHVzaGVyRXZlbnQpIHtcbiAgICB2YXIgZXZlbnROYW1lID0gZXZlbnQuZXZlbnQ7XG4gICAgdmFyIGRhdGEgPSBldmVudC5kYXRhO1xuICAgIGlmIChldmVudE5hbWUgPT09ICdwdXNoZXJfaW50ZXJuYWw6c3Vic2NyaXB0aW9uX3N1Y2NlZWRlZCcpIHtcbiAgICAgIHRoaXMuaGFuZGxlU3Vic2NyaXB0aW9uU3VjY2VlZGVkRXZlbnQoZXZlbnQpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSAncHVzaGVyX2ludGVybmFsOnN1YnNjcmlwdGlvbl9jb3VudCcpIHtcbiAgICAgIHRoaXMuaGFuZGxlU3Vic2NyaXB0aW9uQ291bnRFdmVudChldmVudCk7XG4gICAgfSBlbHNlIGlmIChldmVudE5hbWUuaW5kZXhPZigncHVzaGVyX2ludGVybmFsOicpICE9PSAwKSB7XG4gICAgICB2YXIgbWV0YWRhdGE6IE1ldGFkYXRhID0ge307XG4gICAgICB0aGlzLmVtaXQoZXZlbnROYW1lLCBkYXRhLCBtZXRhZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU3Vic2NyaXB0aW9uU3VjY2VlZGVkRXZlbnQoZXZlbnQ6IFB1c2hlckV2ZW50KSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25QZW5kaW5nID0gZmFsc2U7XG4gICAgdGhpcy5zdWJzY3JpYmVkID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25DYW5jZWxsZWQpIHtcbiAgICAgIHRoaXMucHVzaGVyLnVuc3Vic2NyaWJlKHRoaXMubmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdCgncHVzaGVyOnN1YnNjcmlwdGlvbl9zdWNjZWVkZWQnLCBldmVudC5kYXRhKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTdWJzY3JpcHRpb25Db3VudEV2ZW50KGV2ZW50OiBQdXNoZXJFdmVudCkge1xuICAgIGlmIChldmVudC5kYXRhLnN1YnNjcmlwdGlvbl9jb3VudCkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25Db3VudCA9IGV2ZW50LmRhdGEuc3Vic2NyaXB0aW9uX2NvdW50O1xuICAgIH1cblxuICAgIHRoaXMuZW1pdCgncHVzaGVyOnN1YnNjcmlwdGlvbl9jb3VudCcsIGV2ZW50LmRhdGEpO1xuICB9XG5cbiAgLyoqIFNlbmRzIGEgc3Vic2NyaXB0aW9uIHJlcXVlc3QuIEZvciBpbnRlcm5hbCB1c2Ugb25seS4gKi9cbiAgc3Vic2NyaWJlKCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmliZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25QZW5kaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbkNhbmNlbGxlZCA9IGZhbHNlO1xuICAgIHRoaXMuYXV0aG9yaXplKFxuICAgICAgdGhpcy5wdXNoZXIuY29ubmVjdGlvbi5zb2NrZXRfaWQsXG4gICAgICAoZXJyb3I6IEVycm9yIHwgbnVsbCwgZGF0YTogQ2hhbm5lbEF1dGhvcml6YXRpb25EYXRhKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uUGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAgIC8vIFdoeSBub3QgYmluZCB0byAncHVzaGVyOnN1YnNjcmlwdGlvbl9lcnJvcicgYSBsZXZlbCB1cCwgYW5kIGxvZyB0aGVyZT9cbiAgICAgICAgICAvLyBCaW5kaW5nIHRvIHRoaXMgZXZlbnQgd291bGQgY2F1c2UgdGhlIHdhcm5pbmcgYWJvdXQgbm8gY2FsbGJhY2tzIGJlaW5nXG4gICAgICAgICAgLy8gYm91bmQgKHNlZSBjb25zdHJ1Y3RvcikgdG8gYmUgc3VwcHJlc3NlZCwgdGhhdCdzIG5vdCB3aGF0IHdlIHdhbnQuXG4gICAgICAgICAgTG9nZ2VyLmVycm9yKGVycm9yLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICAgICdwdXNoZXI6c3Vic2NyaXB0aW9uX2Vycm9yJyxcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0F1dGhFcnJvcicsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yLm1lc3NhZ2VcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZXJyb3IgaW5zdGFuY2VvZiBIVFRQQXV0aEVycm9yID8geyBzdGF0dXM6IGVycm9yLnN0YXR1cyB9IDoge31cbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucHVzaGVyLnNlbmRfZXZlbnQoJ3B1c2hlcjpzdWJzY3JpYmUnLCB7XG4gICAgICAgICAgICBhdXRoOiBkYXRhLmF1dGgsXG4gICAgICAgICAgICBjaGFubmVsX2RhdGE6IGRhdGEuY2hhbm5lbF9kYXRhLFxuICAgICAgICAgICAgY2hhbm5lbDogdGhpcy5uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgLyoqIFNlbmRzIGFuIHVuc3Vic2NyaXB0aW9uIHJlcXVlc3QuIEZvciBpbnRlcm5hbCB1c2Ugb25seS4gKi9cbiAgdW5zdWJzY3JpYmUoKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgdGhpcy5wdXNoZXIuc2VuZF9ldmVudCgncHVzaGVyOnVuc3Vic2NyaWJlJywge1xuICAgICAgY2hhbm5lbDogdGhpcy5uYW1lXG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2FuY2VscyBhbiBpbiBwcm9ncmVzcyBzdWJzY3JpcHRpb24uIEZvciBpbnRlcm5hbCB1c2Ugb25seS4gKi9cbiAgY2FuY2VsU3Vic2NyaXB0aW9uKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uQ2FuY2VsbGVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBSZWluc3RhdGVzIGFuIGluIHByb2dyZXNzIHN1YnNjcmlwaXRvbi4gRm9yIGludGVybmFsIHVzZSBvbmx5LiAqL1xuICByZWluc3RhdGVTdWJzY3JpcHRpb24oKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25DYW5jZWxsZWQgPSBmYWxzZTtcbiAgfVxufVxuIiwgImltcG9ydCBGYWN0b3J5IGZyb20gJy4uL3V0aWxzL2ZhY3RvcnknO1xuaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9jaGFubmVsJztcbmltcG9ydCB7IENoYW5uZWxBdXRob3JpemF0aW9uQ2FsbGJhY2sgfSBmcm9tICcuLi9hdXRoL29wdGlvbnMnO1xuXG4vKiogRXh0ZW5kcyBwdWJsaWMgY2hhbm5lbHMgdG8gcHJvdmlkZSBwcml2YXRlIGNoYW5uZWwgaW50ZXJmYWNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1B1c2hlcn0gcHVzaGVyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByaXZhdGVDaGFubmVsIGV4dGVuZHMgQ2hhbm5lbCB7XG4gIC8qKiBBdXRob3JpemVzIHRoZSBjb25uZWN0aW9uIHRvIHVzZSB0aGUgY2hhbm5lbC5cbiAgICpcbiAgICogQHBhcmFtICB7U3RyaW5nfSBzb2NrZXRJZFxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIGF1dGhvcml6ZShzb2NrZXRJZDogc3RyaW5nLCBjYWxsYmFjazogQ2hhbm5lbEF1dGhvcml6YXRpb25DYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLnB1c2hlci5jb25maWcuY2hhbm5lbEF1dGhvcml6ZXIoXG4gICAgICB7XG4gICAgICAgIGNoYW5uZWxOYW1lOiB0aGlzLm5hbWUsXG4gICAgICAgIHNvY2tldElkOiBzb2NrZXRJZFxuICAgICAgfSxcbiAgICAgIGNhbGxiYWNrXG4gICAgKTtcbiAgfVxufVxuIiwgImltcG9ydCAqIGFzIENvbGxlY3Rpb25zIGZyb20gJy4uL3V0aWxzL2NvbGxlY3Rpb25zJztcblxuLyoqIFJlcHJlc2VudHMgYSBjb2xsZWN0aW9uIG9mIG1lbWJlcnMgb2YgYSBwcmVzZW5jZSBjaGFubmVsLiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVtYmVycyB7XG4gIG1lbWJlcnM6IGFueTtcbiAgY291bnQ6IG51bWJlcjtcbiAgbXlJRDogYW55O1xuICBtZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIG1lbWJlcidzIGluZm8gZm9yIGdpdmVuIGlkLlxuICAgKlxuICAgKiBSZXN1bHRpbmcgb2JqZWN0IGNvbnRhaW50cyB0d28gZmllbGRzIC0gaWQgYW5kIGluZm8uXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpZFxuICAgKiBAcmV0dXJuIHtPYmplY3R9IG1lbWJlcidzIGluZm8gb3IgbnVsbFxuICAgKi9cbiAgZ2V0KGlkOiBzdHJpbmcpOiBhbnkge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5tZW1iZXJzLCBpZCkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBpZCxcbiAgICAgICAgaW5mbzogdGhpcy5tZW1iZXJzW2lkXVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqIENhbGxzIGJhY2sgZm9yIGVhY2ggbWVtYmVyIGluIHVuc3BlY2lmaWVkIG9yZGVyLlxuICAgKlxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIGVhY2goY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgQ29sbGVjdGlvbnMub2JqZWN0QXBwbHkodGhpcy5tZW1iZXJzLCAobWVtYmVyLCBpZCkgPT4ge1xuICAgICAgY2FsbGJhY2sodGhpcy5nZXQoaWQpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBpZCBmb3IgY29ubmVjdGVkIG1lbWJlci4gRm9yIGludGVybmFsIHVzZSBvbmx5LiAqL1xuICBzZXRNeUlEKGlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLm15SUQgPSBpZDtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHN1YnNjcmlwdGlvbiBkYXRhLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuICovXG4gIG9uU3Vic2NyaXB0aW9uKHN1YnNjcmlwdGlvbkRhdGE6IGFueSkge1xuICAgIHRoaXMubWVtYmVycyA9IHN1YnNjcmlwdGlvbkRhdGEucHJlc2VuY2UuaGFzaDtcbiAgICB0aGlzLmNvdW50ID0gc3Vic2NyaXB0aW9uRGF0YS5wcmVzZW5jZS5jb3VudDtcbiAgICB0aGlzLm1lID0gdGhpcy5nZXQodGhpcy5teUlEKTtcbiAgfVxuXG4gIC8qKiBBZGRzIGEgbmV3IG1lbWJlciB0byB0aGUgY29sbGVjdGlvbi4gRm9yIGludGVybmFsIHVzZSBvbmx5LiAqL1xuICBhZGRNZW1iZXIobWVtYmVyRGF0YTogYW55KSB7XG4gICAgaWYgKHRoaXMuZ2V0KG1lbWJlckRhdGEudXNlcl9pZCkgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuY291bnQrKztcbiAgICB9XG4gICAgdGhpcy5tZW1iZXJzW21lbWJlckRhdGEudXNlcl9pZF0gPSBtZW1iZXJEYXRhLnVzZXJfaW5mbztcbiAgICByZXR1cm4gdGhpcy5nZXQobWVtYmVyRGF0YS51c2VyX2lkKTtcbiAgfVxuXG4gIC8qKiBBZGRzIGEgbWVtYmVyIGZyb20gdGhlIGNvbGxlY3Rpb24uIEZvciBpbnRlcm5hbCB1c2Ugb25seS4gKi9cbiAgcmVtb3ZlTWVtYmVyKG1lbWJlckRhdGE6IGFueSkge1xuICAgIHZhciBtZW1iZXIgPSB0aGlzLmdldChtZW1iZXJEYXRhLnVzZXJfaWQpO1xuICAgIGlmIChtZW1iZXIpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLm1lbWJlcnNbbWVtYmVyRGF0YS51c2VyX2lkXTtcbiAgICAgIHRoaXMuY291bnQtLTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbWJlcjtcbiAgfVxuXG4gIC8qKiBSZXNldHMgdGhlIGNvbGxlY3Rpb24gdG8gdGhlIGluaXRpYWwgc3RhdGUuIEZvciBpbnRlcm5hbCB1c2Ugb25seS4gKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5tZW1iZXJzID0ge307XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgdGhpcy5teUlEID0gbnVsbDtcbiAgICB0aGlzLm1lID0gbnVsbDtcbiAgfVxufVxuIiwgImltcG9ydCBQcml2YXRlQ2hhbm5lbCBmcm9tICcuL3ByaXZhdGVfY2hhbm5lbCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL2xvZ2dlcic7XG5pbXBvcnQgTWVtYmVycyBmcm9tICcuL21lbWJlcnMnO1xuaW1wb3J0IFB1c2hlciBmcm9tICcuLi9wdXNoZXInO1xuaW1wb3J0IFVybFN0b3JlIGZyb20gJ2NvcmUvdXRpbHMvdXJsX3N0b3JlJztcbmltcG9ydCB7IFB1c2hlckV2ZW50IH0gZnJvbSAnLi4vY29ubmVjdGlvbi9wcm90b2NvbC9tZXNzYWdlLXR5cGVzJztcbmltcG9ydCBNZXRhZGF0YSBmcm9tICcuL21ldGFkYXRhJztcbmltcG9ydCB7IENoYW5uZWxBdXRob3JpemF0aW9uRGF0YSB9IGZyb20gJy4uL2F1dGgvb3B0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXNlbmNlQ2hhbm5lbCBleHRlbmRzIFByaXZhdGVDaGFubmVsIHtcbiAgbWVtYmVyczogTWVtYmVycztcblxuICAvKiogQWRkcyBwcmVzZW5jZSBjaGFubmVsIGZ1bmN0aW9uYWxpdHkgdG8gcHJpdmF0ZSBjaGFubmVscy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHtQdXNoZXJ9IHB1c2hlclxuICAgKi9cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBwdXNoZXI6IFB1c2hlcikge1xuICAgIHN1cGVyKG5hbWUsIHB1c2hlcik7XG4gICAgdGhpcy5tZW1iZXJzID0gbmV3IE1lbWJlcnMoKTtcbiAgfVxuXG4gIC8qKiBBdXRob3JpemVzIHRoZSBjb25uZWN0aW9uIGFzIGEgbWVtYmVyIG9mIHRoZSBjaGFubmVsLlxuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNvY2tldElkXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgYXV0aG9yaXplKHNvY2tldElkOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgIHN1cGVyLmF1dGhvcml6ZShzb2NrZXRJZCwgYXN5bmMgKGVycm9yLCBhdXRoRGF0YSkgPT4ge1xuICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICBhdXRoRGF0YSA9IGF1dGhEYXRhIGFzIENoYW5uZWxBdXRob3JpemF0aW9uRGF0YTtcbiAgICAgICAgaWYgKGF1dGhEYXRhLmNoYW5uZWxfZGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgdmFyIGNoYW5uZWxEYXRhID0gSlNPTi5wYXJzZShhdXRoRGF0YS5jaGFubmVsX2RhdGEpO1xuICAgICAgICAgIHRoaXMubWVtYmVycy5zZXRNeUlEKGNoYW5uZWxEYXRhLnVzZXJfaWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF3YWl0IHRoaXMucHVzaGVyLnVzZXIuc2lnbmluRG9uZVByb21pc2U7XG4gICAgICAgICAgaWYgKHRoaXMucHVzaGVyLnVzZXIudXNlcl9kYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSB1c2VyIGlzIHNpZ25lZCBpbiwgZ2V0IHRoZSBpZCBvZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyXG4gICAgICAgICAgICAvLyBhbmQgYWxsb3cgdGhlIHByZXNlbmNlIGF1dGhvcml6YXRpb24gdG8gY29udGludWUuXG4gICAgICAgICAgICB0aGlzLm1lbWJlcnMuc2V0TXlJRCh0aGlzLnB1c2hlci51c2VyLnVzZXJfZGF0YS5pZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBzdWZmaXggPSBVcmxTdG9yZS5idWlsZExvZ1N1ZmZpeCgnYXV0aG9yaXphdGlvbkVuZHBvaW50Jyk7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICAgIGBJbnZhbGlkIGF1dGggcmVzcG9uc2UgZm9yIGNoYW5uZWwgJyR7dGhpcy5uYW1lfScsIGAgK1xuICAgICAgICAgICAgICAgIGBleHBlY3RlZCAnY2hhbm5lbF9kYXRhJyBmaWVsZC4gJHtzdWZmaXh9LCBgICtcbiAgICAgICAgICAgICAgICBgb3IgdGhlIHVzZXIgc2hvdWxkIGJlIHNpZ25lZCBpbi5gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY2FsbGJhY2soJ0ludmFsaWQgYXV0aCByZXNwb25zZScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2FsbGJhY2soZXJyb3IsIGF1dGhEYXRhKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHByZXNlbmNlIGFuZCBzdWJzY3JpcHRpb24gZXZlbnRzLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAqXG4gICAqIEBwYXJhbSB7UHVzaGVyRXZlbnR9IGV2ZW50XG4gICAqL1xuICBoYW5kbGVFdmVudChldmVudDogUHVzaGVyRXZlbnQpIHtcbiAgICB2YXIgZXZlbnROYW1lID0gZXZlbnQuZXZlbnQ7XG4gICAgaWYgKGV2ZW50TmFtZS5pbmRleE9mKCdwdXNoZXJfaW50ZXJuYWw6JykgPT09IDApIHtcbiAgICAgIHRoaXMuaGFuZGxlSW50ZXJuYWxFdmVudChldmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBkYXRhID0gZXZlbnQuZGF0YTtcbiAgICAgIHZhciBtZXRhZGF0YTogTWV0YWRhdGEgPSB7fTtcbiAgICAgIGlmIChldmVudC51c2VyX2lkKSB7XG4gICAgICAgIG1ldGFkYXRhLnVzZXJfaWQgPSBldmVudC51c2VyX2lkO1xuICAgICAgfVxuICAgICAgdGhpcy5lbWl0KGV2ZW50TmFtZSwgZGF0YSwgbWV0YWRhdGEpO1xuICAgIH1cbiAgfVxuICBoYW5kbGVJbnRlcm5hbEV2ZW50KGV2ZW50OiBQdXNoZXJFdmVudCkge1xuICAgIHZhciBldmVudE5hbWUgPSBldmVudC5ldmVudDtcbiAgICB2YXIgZGF0YSA9IGV2ZW50LmRhdGE7XG4gICAgc3dpdGNoIChldmVudE5hbWUpIHtcbiAgICAgIGNhc2UgJ3B1c2hlcl9pbnRlcm5hbDpzdWJzY3JpcHRpb25fc3VjY2VlZGVkJzpcbiAgICAgICAgdGhpcy5oYW5kbGVTdWJzY3JpcHRpb25TdWNjZWVkZWRFdmVudChldmVudCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncHVzaGVyX2ludGVybmFsOnN1YnNjcmlwdGlvbl9jb3VudCc6XG4gICAgICAgIHRoaXMuaGFuZGxlU3Vic2NyaXB0aW9uQ291bnRFdmVudChldmVudCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncHVzaGVyX2ludGVybmFsOm1lbWJlcl9hZGRlZCc6XG4gICAgICAgIHZhciBhZGRlZE1lbWJlciA9IHRoaXMubWVtYmVycy5hZGRNZW1iZXIoZGF0YSk7XG4gICAgICAgIHRoaXMuZW1pdCgncHVzaGVyOm1lbWJlcl9hZGRlZCcsIGFkZGVkTWVtYmVyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwdXNoZXJfaW50ZXJuYWw6bWVtYmVyX3JlbW92ZWQnOlxuICAgICAgICB2YXIgcmVtb3ZlZE1lbWJlciA9IHRoaXMubWVtYmVycy5yZW1vdmVNZW1iZXIoZGF0YSk7XG4gICAgICAgIGlmIChyZW1vdmVkTWVtYmVyKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdwdXNoZXI6bWVtYmVyX3JlbW92ZWQnLCByZW1vdmVkTWVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTdWJzY3JpcHRpb25TdWNjZWVkZWRFdmVudChldmVudDogUHVzaGVyRXZlbnQpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvblBlbmRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnN1YnNjcmliZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbkNhbmNlbGxlZCkge1xuICAgICAgdGhpcy5wdXNoZXIudW5zdWJzY3JpYmUodGhpcy5uYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tZW1iZXJzLm9uU3Vic2NyaXB0aW9uKGV2ZW50LmRhdGEpO1xuICAgICAgdGhpcy5lbWl0KCdwdXNoZXI6c3Vic2NyaXB0aW9uX3N1Y2NlZWRlZCcsIHRoaXMubWVtYmVycyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJlc2V0cyB0aGUgY2hhbm5lbCBzdGF0ZSwgaW5jbHVkaW5nIG1lbWJlcnMgbWFwLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuICovXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgdGhpcy5tZW1iZXJzLnJlc2V0KCk7XG4gICAgc3VwZXIuZGlzY29ubmVjdCgpO1xuICB9XG59XG4iLCAiaW1wb3J0IFByaXZhdGVDaGFubmVsIGZyb20gJy4vcHJpdmF0ZV9jaGFubmVsJztcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICcuLi9lcnJvcnMnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuLi9sb2dnZXInO1xuaW1wb3J0IFB1c2hlciBmcm9tICcuLi9wdXNoZXInO1xuaW1wb3J0IHsgZGVjb2RlIGFzIGVuY29kZVVURjggfSBmcm9tICdAc3RhYmxlbGliL3V0ZjgnO1xuaW1wb3J0IHsgZGVjb2RlIGFzIGRlY29kZUJhc2U2NCB9IGZyb20gJ0BzdGFibGVsaWIvYmFzZTY0JztcbmltcG9ydCBEaXNwYXRjaGVyIGZyb20gJy4uL2V2ZW50cy9kaXNwYXRjaGVyJztcbmltcG9ydCB7IFB1c2hlckV2ZW50IH0gZnJvbSAnLi4vY29ubmVjdGlvbi9wcm90b2NvbC9tZXNzYWdlLXR5cGVzJztcbmltcG9ydCB7XG4gIENoYW5uZWxBdXRob3JpemF0aW9uRGF0YSxcbiAgQ2hhbm5lbEF1dGhvcml6YXRpb25DYWxsYmFja1xufSBmcm9tICcuLi9hdXRoL29wdGlvbnMnO1xuaW1wb3J0ICogYXMgbmFjbCBmcm9tICd0d2VldG5hY2wnO1xuXG4vKiogRXh0ZW5kcyBwcml2YXRlIGNoYW5uZWxzIHRvIHByb3ZpZGUgZW5jcnlwdGVkIGNoYW5uZWwgaW50ZXJmYWNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1B1c2hlcn0gcHVzaGVyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVuY3J5cHRlZENoYW5uZWwgZXh0ZW5kcyBQcml2YXRlQ2hhbm5lbCB7XG4gIGtleTogVWludDhBcnJheSA9IG51bGw7XG4gIG5hY2w6IG5hY2w7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBwdXNoZXI6IFB1c2hlciwgbmFjbDogbmFjbCkge1xuICAgIHN1cGVyKG5hbWUsIHB1c2hlcik7XG4gICAgdGhpcy5uYWNsID0gbmFjbDtcbiAgfVxuXG4gIC8qKiBBdXRob3JpemVzIHRoZSBjb25uZWN0aW9uIHRvIHVzZSB0aGUgY2hhbm5lbC5cbiAgICpcbiAgICogQHBhcmFtICB7U3RyaW5nfSBzb2NrZXRJZFxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIGF1dGhvcml6ZShzb2NrZXRJZDogc3RyaW5nLCBjYWxsYmFjazogQ2hhbm5lbEF1dGhvcml6YXRpb25DYWxsYmFjaykge1xuICAgIHN1cGVyLmF1dGhvcml6ZShcbiAgICAgIHNvY2tldElkLFxuICAgICAgKGVycm9yOiBFcnJvciB8IG51bGwsIGF1dGhEYXRhOiBDaGFubmVsQXV0aG9yaXphdGlvbkRhdGEpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIGF1dGhEYXRhKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNoYXJlZFNlY3JldCA9IGF1dGhEYXRhWydzaGFyZWRfc2VjcmV0J107XG4gICAgICAgIGlmICghc2hhcmVkU2VjcmV0KSB7XG4gICAgICAgICAgY2FsbGJhY2soXG4gICAgICAgICAgICBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBObyBzaGFyZWRfc2VjcmV0IGtleSBpbiBhdXRoIHBheWxvYWQgZm9yIGVuY3J5cHRlZCBjaGFubmVsOiAke3RoaXMubmFtZX1gXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMua2V5ID0gZGVjb2RlQmFzZTY0KHNoYXJlZFNlY3JldCk7XG4gICAgICAgIGRlbGV0ZSBhdXRoRGF0YVsnc2hhcmVkX3NlY3JldCddO1xuICAgICAgICBjYWxsYmFjayhudWxsLCBhdXRoRGF0YSk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHRyaWdnZXIoZXZlbnQ6IHN0cmluZywgZGF0YTogYW55KTogYm9vbGVhbiB7XG4gICAgdGhyb3cgbmV3IEVycm9ycy5VbnN1cHBvcnRlZEZlYXR1cmUoXG4gICAgICAnQ2xpZW50IGV2ZW50cyBhcmUgbm90IGN1cnJlbnRseSBzdXBwb3J0ZWQgZm9yIGVuY3J5cHRlZCBjaGFubmVscydcbiAgICApO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgYW4gZXZlbnQuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICpcbiAgICogQHBhcmFtIHtQdXNoZXJFdmVudH0gZXZlbnRcbiAgICovXG4gIGhhbmRsZUV2ZW50KGV2ZW50OiBQdXNoZXJFdmVudCkge1xuICAgIHZhciBldmVudE5hbWUgPSBldmVudC5ldmVudDtcbiAgICB2YXIgZGF0YSA9IGV2ZW50LmRhdGE7XG4gICAgaWYgKFxuICAgICAgZXZlbnROYW1lLmluZGV4T2YoJ3B1c2hlcl9pbnRlcm5hbDonKSA9PT0gMCB8fFxuICAgICAgZXZlbnROYW1lLmluZGV4T2YoJ3B1c2hlcjonKSA9PT0gMFxuICAgICkge1xuICAgICAgc3VwZXIuaGFuZGxlRXZlbnQoZXZlbnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmhhbmRsZUVuY3J5cHRlZEV2ZW50KGV2ZW50TmFtZSwgZGF0YSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUVuY3J5cHRlZEV2ZW50KGV2ZW50OiBzdHJpbmcsIGRhdGE6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5rZXkpIHtcbiAgICAgIExvZ2dlci5kZWJ1ZyhcbiAgICAgICAgJ1JlY2VpdmVkIGVuY3J5cHRlZCBldmVudCBiZWZvcmUga2V5IGhhcyBiZWVuIHJldHJpZXZlZCBmcm9tIHRoZSBhdXRoRW5kcG9pbnQnXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRhdGEuY2lwaGVydGV4dCB8fCAhZGF0YS5ub25jZSkge1xuICAgICAgTG9nZ2VyLmVycm9yKFxuICAgICAgICAnVW5leHBlY3RlZCBmb3JtYXQgZm9yIGVuY3J5cHRlZCBldmVudCwgZXhwZWN0ZWQgb2JqZWN0IHdpdGggYGNpcGhlcnRleHRgIGFuZCBgbm9uY2VgIGZpZWxkcywgZ290OiAnICtcbiAgICAgICAgICBkYXRhXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgY2lwaGVyVGV4dCA9IGRlY29kZUJhc2U2NChkYXRhLmNpcGhlcnRleHQpO1xuICAgIGlmIChjaXBoZXJUZXh0Lmxlbmd0aCA8IHRoaXMubmFjbC5zZWNyZXRib3gub3ZlcmhlYWRMZW5ndGgpIHtcbiAgICAgIExvZ2dlci5lcnJvcihcbiAgICAgICAgYEV4cGVjdGVkIGVuY3J5cHRlZCBldmVudCBjaXBoZXJ0ZXh0IGxlbmd0aCB0byBiZSAke3RoaXMubmFjbC5zZWNyZXRib3gub3ZlcmhlYWRMZW5ndGh9LCBnb3Q6ICR7Y2lwaGVyVGV4dC5sZW5ndGh9YFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IG5vbmNlID0gZGVjb2RlQmFzZTY0KGRhdGEubm9uY2UpO1xuICAgIGlmIChub25jZS5sZW5ndGggPCB0aGlzLm5hY2wuc2VjcmV0Ym94Lm5vbmNlTGVuZ3RoKSB7XG4gICAgICBMb2dnZXIuZXJyb3IoXG4gICAgICAgIGBFeHBlY3RlZCBlbmNyeXB0ZWQgZXZlbnQgbm9uY2UgbGVuZ3RoIHRvIGJlICR7dGhpcy5uYWNsLnNlY3JldGJveC5ub25jZUxlbmd0aH0sIGdvdDogJHtub25jZS5sZW5ndGh9YFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgYnl0ZXMgPSB0aGlzLm5hY2wuc2VjcmV0Ym94Lm9wZW4oY2lwaGVyVGV4dCwgbm9uY2UsIHRoaXMua2V5KTtcbiAgICBpZiAoYnl0ZXMgPT09IG51bGwpIHtcbiAgICAgIExvZ2dlci5kZWJ1ZyhcbiAgICAgICAgJ0ZhaWxlZCB0byBkZWNyeXB0IGFuIGV2ZW50LCBwcm9iYWJseSBiZWNhdXNlIGl0IHdhcyBlbmNyeXB0ZWQgd2l0aCBhIGRpZmZlcmVudCBrZXkuIEZldGNoaW5nIGEgbmV3IGtleSBmcm9tIHRoZSBhdXRoRW5kcG9pbnQuLi4nXG4gICAgICApO1xuICAgICAgLy8gVHJ5IGEgc2luZ2xlIHRpbWUgdG8gcmV0cmlldmUgYSBuZXcgYXV0aCBrZXkgYW5kIGRlY3J5cHQgdGhlIGV2ZW50IHdpdGggaXRcbiAgICAgIC8vIElmIHRoaXMgZmFpbHMsIGEgbmV3IGtleSB3aWxsIGJlIHJlcXVlc3RlZCB3aGVuIGEgbmV3IG1lc3NhZ2UgaXMgcmVjZWl2ZWRcbiAgICAgIHRoaXMuYXV0aG9yaXplKHRoaXMucHVzaGVyLmNvbm5lY3Rpb24uc29ja2V0X2lkLCAoZXJyb3IsIGF1dGhEYXRhKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIExvZ2dlci5lcnJvcihcbiAgICAgICAgICAgIGBGYWlsZWQgdG8gbWFrZSBhIHJlcXVlc3QgdG8gdGhlIGF1dGhFbmRwb2ludDogJHthdXRoRGF0YX0uIFVuYWJsZSB0byBmZXRjaCBuZXcga2V5LCBzbyBkcm9wcGluZyBlbmNyeXB0ZWQgZXZlbnRgXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYnl0ZXMgPSB0aGlzLm5hY2wuc2VjcmV0Ym94Lm9wZW4oY2lwaGVyVGV4dCwgbm9uY2UsIHRoaXMua2V5KTtcbiAgICAgICAgaWYgKGJ5dGVzID09PSBudWxsKSB7XG4gICAgICAgICAgTG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgYEZhaWxlZCB0byBkZWNyeXB0IGV2ZW50IHdpdGggbmV3IGtleS4gRHJvcHBpbmcgZW5jcnlwdGVkIGV2ZW50YFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdChldmVudCwgdGhpcy5nZXREYXRhVG9FbWl0KGJ5dGVzKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmVtaXQoZXZlbnQsIHRoaXMuZ2V0RGF0YVRvRW1pdChieXRlcykpO1xuICB9XG5cbiAgLy8gVHJ5IGFuZCBwYXJzZSB0aGUgZGVjcnlwdGVkIGJ5dGVzIGFzIEpTT04uIElmIHdlIGNhbid0IHBhcnNlIGl0LCBqdXN0XG4gIC8vIHJldHVybiB0aGUgdXRmLTggc3RyaW5nXG4gIGdldERhdGFUb0VtaXQoYnl0ZXM6IFVpbnQ4QXJyYXkpOiBzdHJpbmcge1xuICAgIGxldCByYXcgPSBlbmNvZGVVVEY4KGJ5dGVzKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmF3KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiByYXc7XG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHsgZGVmYXVsdCBhcyBFdmVudHNEaXNwYXRjaGVyIH0gZnJvbSAnLi4vZXZlbnRzL2Rpc3BhdGNoZXInO1xuaW1wb3J0IHsgT25lT2ZmVGltZXIgYXMgVGltZXIgfSBmcm9tICcuLi91dGlscy90aW1lcnMnO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vbG9nZ2VyJztcbmltcG9ydCBIYW5kc2hha2VQYXlsb2FkIGZyb20gJy4vaGFuZHNoYWtlL2hhbmRzaGFrZV9wYXlsb2FkJztcbmltcG9ydCBDb25uZWN0aW9uIGZyb20gJy4vY29ubmVjdGlvbic7XG5pbXBvcnQgU3RyYXRlZ3kgZnJvbSAnLi4vc3RyYXRlZ2llcy9zdHJhdGVneSc7XG5pbXBvcnQgU3RyYXRlZ3lSdW5uZXIgZnJvbSAnLi4vc3RyYXRlZ2llcy9zdHJhdGVneV9ydW5uZXInO1xuaW1wb3J0ICogYXMgQ29sbGVjdGlvbnMgZnJvbSAnLi4vdXRpbHMvY29sbGVjdGlvbnMnO1xuaW1wb3J0IFRpbWVsaW5lIGZyb20gJy4uL3RpbWVsaW5lL3RpbWVsaW5lJztcbmltcG9ydCBDb25uZWN0aW9uTWFuYWdlck9wdGlvbnMgZnJvbSAnLi9jb25uZWN0aW9uX21hbmFnZXJfb3B0aW9ucyc7XG5pbXBvcnQgUnVudGltZSBmcm9tICdydW50aW1lJztcblxuaW1wb3J0IHtcbiAgRXJyb3JDYWxsYmFja3MsXG4gIEhhbmRzaGFrZUNhbGxiYWNrcyxcbiAgQ29ubmVjdGlvbkNhbGxiYWNrc1xufSBmcm9tICcuL2NhbGxiYWNrcyc7XG5pbXBvcnQgQWN0aW9uIGZyb20gJy4vcHJvdG9jb2wvYWN0aW9uJztcblxuLyoqIE1hbmFnZXMgY29ubmVjdGlvbiB0byBQdXNoZXIuXG4gKlxuICogVXNlcyBhIHN0cmF0ZWd5IChjdXJyZW50bHkgb25seSBkZWZhdWx0KSwgdGltZXJzIGFuZCBuZXR3b3JrIGF2YWlsYWJpbGl0eVxuICogaW5mbyB0byBlc3RhYmxpc2ggYSBjb25uZWN0aW9uIGFuZCBleHBvcnQgaXRzIHN0YXRlLiBJbiBjYXNlIG9mIGZhaWx1cmVzLFxuICogbWFuYWdlcyByZWNvbm5lY3Rpb24gYXR0ZW1wdHMuXG4gKlxuICogRXhwb3J0cyBzdGF0ZSBjaGFuZ2VzIGFzIGZvbGxvd2luZyBldmVudHM6XG4gKiAtIFwic3RhdGVfY2hhbmdlXCIsIHsgcHJldmlvdXM6IHAsIGN1cnJlbnQ6IHN0YXRlIH1cbiAqIC0gc3RhdGVcbiAqXG4gKiBTdGF0ZXM6XG4gKiAtIGluaXRpYWxpemVkIC0gaW5pdGlhbCBzdGF0ZSwgbmV2ZXIgdHJhbnNpdGlvbmVkIHRvXG4gKiAtIGNvbm5lY3RpbmcgLSBjb25uZWN0aW9uIGlzIGJlaW5nIGVzdGFibGlzaGVkXG4gKiAtIGNvbm5lY3RlZCAtIGNvbm5lY3Rpb24gaGFzIGJlZW4gZnVsbHkgZXN0YWJsaXNoZWRcbiAqIC0gZGlzY29ubmVjdGVkIC0gb24gcmVxdWVzdGVkIGRpc2Nvbm5lY3Rpb25cbiAqIC0gdW5hdmFpbGFibGUgLSBhZnRlciBjb25uZWN0aW9uIHRpbWVvdXQgb3Igd2hlbiB0aGVyZSdzIG5vIG5ldHdvcmtcbiAqIC0gZmFpbGVkIC0gd2hlbiB0aGUgY29ubmVjdGlvbiBzdHJhdGVneSBpcyBub3Qgc3VwcG9ydGVkXG4gKlxuICogT3B0aW9uczpcbiAqIC0gdW5hdmFpbGFibGVUaW1lb3V0IC0gdGltZSB0byB0cmFuc2l0aW9uIHRvIHVuYXZhaWxhYmxlIHN0YXRlXG4gKiAtIGFjdGl2aXR5VGltZW91dCAtIHRpbWUgYWZ0ZXIgd2hpY2ggcGluZyBtZXNzYWdlIHNob3VsZCBiZSBzZW50XG4gKiAtIHBvbmdUaW1lb3V0IC0gdGltZSBmb3IgUHVzaGVyIHRvIHJlc3BvbmQgd2l0aCBwb25nIGJlZm9yZSByZWNvbm5lY3RpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IGFwcGxpY2F0aW9uIGtleVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29ubmVjdGlvbk1hbmFnZXIgZXh0ZW5kcyBFdmVudHNEaXNwYXRjaGVyIHtcbiAga2V5OiBzdHJpbmc7XG4gIG9wdGlvbnM6IENvbm5lY3Rpb25NYW5hZ2VyT3B0aW9ucztcbiAgc3RhdGU6IHN0cmluZztcbiAgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcbiAgdXNpbmdUTFM6IGJvb2xlYW47XG4gIHRpbWVsaW5lOiBUaW1lbGluZTtcbiAgc29ja2V0X2lkOiBzdHJpbmc7XG4gIHVuYXZhaWxhYmxlVGltZXI6IFRpbWVyO1xuICBhY3Rpdml0eVRpbWVyOiBUaW1lcjtcbiAgcmV0cnlUaW1lcjogVGltZXI7XG4gIGFjdGl2aXR5VGltZW91dDogbnVtYmVyO1xuICBzdHJhdGVneTogU3RyYXRlZ3k7XG4gIHJ1bm5lcjogU3RyYXRlZ3lSdW5uZXI7XG4gIGVycm9yQ2FsbGJhY2tzOiBFcnJvckNhbGxiYWNrcztcbiAgaGFuZHNoYWtlQ2FsbGJhY2tzOiBIYW5kc2hha2VDYWxsYmFja3M7XG4gIGNvbm5lY3Rpb25DYWxsYmFja3M6IENvbm5lY3Rpb25DYWxsYmFja3M7XG5cbiAgY29uc3RydWN0b3Ioa2V5OiBzdHJpbmcsIG9wdGlvbnM6IENvbm5lY3Rpb25NYW5hZ2VyT3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zdGF0ZSA9ICdpbml0aWFsaXplZCc7XG4gICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcblxuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy50aW1lbGluZSA9IHRoaXMub3B0aW9ucy50aW1lbGluZTtcbiAgICB0aGlzLnVzaW5nVExTID0gdGhpcy5vcHRpb25zLnVzZVRMUztcblxuICAgIHRoaXMuZXJyb3JDYWxsYmFja3MgPSB0aGlzLmJ1aWxkRXJyb3JDYWxsYmFja3MoKTtcbiAgICB0aGlzLmNvbm5lY3Rpb25DYWxsYmFja3MgPSB0aGlzLmJ1aWxkQ29ubmVjdGlvbkNhbGxiYWNrcyhcbiAgICAgIHRoaXMuZXJyb3JDYWxsYmFja3NcbiAgICApO1xuICAgIHRoaXMuaGFuZHNoYWtlQ2FsbGJhY2tzID0gdGhpcy5idWlsZEhhbmRzaGFrZUNhbGxiYWNrcyh0aGlzLmVycm9yQ2FsbGJhY2tzKTtcblxuICAgIHZhciBOZXR3b3JrID0gUnVudGltZS5nZXROZXR3b3JrKCk7XG5cbiAgICBOZXR3b3JrLmJpbmQoJ29ubGluZScsICgpID0+IHtcbiAgICAgIHRoaXMudGltZWxpbmUuaW5mbyh7IG5ldGluZm86ICdvbmxpbmUnIH0pO1xuICAgICAgaWYgKHRoaXMuc3RhdGUgPT09ICdjb25uZWN0aW5nJyB8fCB0aGlzLnN0YXRlID09PSAndW5hdmFpbGFibGUnKSB7XG4gICAgICAgIHRoaXMucmV0cnlJbigwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBOZXR3b3JrLmJpbmQoJ29mZmxpbmUnLCAoKSA9PiB7XG4gICAgICB0aGlzLnRpbWVsaW5lLmluZm8oeyBuZXRpbmZvOiAnb2ZmbGluZScgfSk7XG4gICAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuc2VuZEFjdGl2aXR5Q2hlY2soKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlU3RyYXRlZ3koKTtcbiAgfVxuXG4gIC8qKiBFc3RhYmxpc2hlcyBhIGNvbm5lY3Rpb24gdG8gUHVzaGVyLlxuICAgKlxuICAgKiBEb2VzIG5vdGhpbmcgd2hlbiBjb25uZWN0aW9uIGlzIGFscmVhZHkgZXN0YWJsaXNoZWQuIFNlZSB0b3AtbGV2ZWwgZG9jXG4gICAqIHRvIGZpbmQgZXZlbnRzIGVtaXR0ZWQgb24gY29ubmVjdGlvbiBhdHRlbXB0cy5cbiAgICovXG4gIGNvbm5lY3QoKSB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbiB8fCB0aGlzLnJ1bm5lcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc3RyYXRlZ3kuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgdGhpcy51cGRhdGVTdGF0ZSgnZmFpbGVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudXBkYXRlU3RhdGUoJ2Nvbm5lY3RpbmcnKTtcbiAgICB0aGlzLnN0YXJ0Q29ubmVjdGluZygpO1xuICAgIHRoaXMuc2V0VW5hdmFpbGFibGVUaW1lcigpO1xuICB9XG5cbiAgLyoqIFNlbmRzIHJhdyBkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YVxuICAgKi9cbiAgc2VuZChkYXRhKSB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5zZW5kKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNlbmRzIGFuIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NoYW5uZWxdXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSB3aGV0aGVyIG1lc3NhZ2Ugd2FzIHNlbnQgb3Igbm90XG4gICAqL1xuICBzZW5kX2V2ZW50KG5hbWU6IHN0cmluZywgZGF0YTogYW55LCBjaGFubmVsPzogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5zZW5kX2V2ZW50KG5hbWUsIGRhdGEsIGNoYW5uZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgY29ubmVjdGlvbi4gKi9cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLmRpc2Nvbm5lY3RJbnRlcm5hbGx5KCk7XG4gICAgdGhpcy51cGRhdGVTdGF0ZSgnZGlzY29ubmVjdGVkJyk7XG4gIH1cblxuICBpc1VzaW5nVExTKCkge1xuICAgIHJldHVybiB0aGlzLnVzaW5nVExTO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydENvbm5lY3RpbmcoKSB7XG4gICAgdmFyIGNhbGxiYWNrID0gKGVycm9yLCBoYW5kc2hha2UpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICB0aGlzLnJ1bm5lciA9IHRoaXMuc3RyYXRlZ3kuY29ubmVjdCgwLCBjYWxsYmFjayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaGFuZHNoYWtlLmFjdGlvbiA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCB7XG4gICAgICAgICAgICB0eXBlOiAnSGFuZHNoYWtlRXJyb3InLFxuICAgICAgICAgICAgZXJyb3I6IGhhbmRzaGFrZS5lcnJvclxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMudGltZWxpbmUuZXJyb3IoeyBoYW5kc2hha2VFcnJvcjogaGFuZHNoYWtlLmVycm9yIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuYWJvcnRDb25uZWN0aW5nKCk7IC8vIHdlIGRvbid0IHN1cHBvcnQgc3dpdGNoaW5nIGNvbm5lY3Rpb25zIHlldFxuICAgICAgICAgIHRoaXMuaGFuZHNoYWtlQ2FsbGJhY2tzW2hhbmRzaGFrZS5hY3Rpb25dKGhhbmRzaGFrZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMucnVubmVyID0gdGhpcy5zdHJhdGVneS5jb25uZWN0KDAsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHByaXZhdGUgYWJvcnRDb25uZWN0aW5nKCkge1xuICAgIGlmICh0aGlzLnJ1bm5lcikge1xuICAgICAgdGhpcy5ydW5uZXIuYWJvcnQoKTtcbiAgICAgIHRoaXMucnVubmVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRpc2Nvbm5lY3RJbnRlcm5hbGx5KCkge1xuICAgIHRoaXMuYWJvcnRDb25uZWN0aW5nKCk7XG4gICAgdGhpcy5jbGVhclJldHJ5VGltZXIoKTtcbiAgICB0aGlzLmNsZWFyVW5hdmFpbGFibGVUaW1lcigpO1xuICAgIGlmICh0aGlzLmNvbm5lY3Rpb24pIHtcbiAgICAgIHZhciBjb25uZWN0aW9uID0gdGhpcy5hYmFuZG9uQ29ubmVjdGlvbigpO1xuICAgICAgY29ubmVjdGlvbi5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlU3RyYXRlZ3koKSB7XG4gICAgdGhpcy5zdHJhdGVneSA9IHRoaXMub3B0aW9ucy5nZXRTdHJhdGVneSh7XG4gICAgICBrZXk6IHRoaXMua2V5LFxuICAgICAgdGltZWxpbmU6IHRoaXMudGltZWxpbmUsXG4gICAgICB1c2VUTFM6IHRoaXMudXNpbmdUTFNcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmV0cnlJbihkZWxheSkge1xuICAgIHRoaXMudGltZWxpbmUuaW5mbyh7IGFjdGlvbjogJ3JldHJ5JywgZGVsYXk6IGRlbGF5IH0pO1xuICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgIHRoaXMuZW1pdCgnY29ubmVjdGluZ19pbicsIE1hdGgucm91bmQoZGVsYXkgLyAxMDAwKSk7XG4gICAgfVxuICAgIHRoaXMucmV0cnlUaW1lciA9IG5ldyBUaW1lcihkZWxheSB8fCAwLCAoKSA9PiB7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3RJbnRlcm5hbGx5KCk7XG4gICAgICB0aGlzLmNvbm5lY3QoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJSZXRyeVRpbWVyKCkge1xuICAgIGlmICh0aGlzLnJldHJ5VGltZXIpIHtcbiAgICAgIHRoaXMucmV0cnlUaW1lci5lbnN1cmVBYm9ydGVkKCk7XG4gICAgICB0aGlzLnJldHJ5VGltZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0VW5hdmFpbGFibGVUaW1lcigpIHtcbiAgICB0aGlzLnVuYXZhaWxhYmxlVGltZXIgPSBuZXcgVGltZXIodGhpcy5vcHRpb25zLnVuYXZhaWxhYmxlVGltZW91dCwgKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTdGF0ZSgndW5hdmFpbGFibGUnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJVbmF2YWlsYWJsZVRpbWVyKCkge1xuICAgIGlmICh0aGlzLnVuYXZhaWxhYmxlVGltZXIpIHtcbiAgICAgIHRoaXMudW5hdmFpbGFibGVUaW1lci5lbnN1cmVBYm9ydGVkKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZW5kQWN0aXZpdHlDaGVjaygpIHtcbiAgICB0aGlzLnN0b3BBY3Rpdml0eUNoZWNrKCk7XG4gICAgdGhpcy5jb25uZWN0aW9uLnBpbmcoKTtcbiAgICAvLyB3YWl0IGZvciBwb25nIHJlc3BvbnNlXG4gICAgdGhpcy5hY3Rpdml0eVRpbWVyID0gbmV3IFRpbWVyKHRoaXMub3B0aW9ucy5wb25nVGltZW91dCwgKCkgPT4ge1xuICAgICAgdGhpcy50aW1lbGluZS5lcnJvcih7IHBvbmdfdGltZWRfb3V0OiB0aGlzLm9wdGlvbnMucG9uZ1RpbWVvdXQgfSk7XG4gICAgICB0aGlzLnJldHJ5SW4oMCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlc2V0QWN0aXZpdHlDaGVjaygpIHtcbiAgICB0aGlzLnN0b3BBY3Rpdml0eUNoZWNrKCk7XG4gICAgLy8gc2VuZCBwaW5nIGFmdGVyIGluYWN0aXZpdHlcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uICYmICF0aGlzLmNvbm5lY3Rpb24uaGFuZGxlc0FjdGl2aXR5Q2hlY2tzKCkpIHtcbiAgICAgIHRoaXMuYWN0aXZpdHlUaW1lciA9IG5ldyBUaW1lcih0aGlzLmFjdGl2aXR5VGltZW91dCwgKCkgPT4ge1xuICAgICAgICB0aGlzLnNlbmRBY3Rpdml0eUNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0b3BBY3Rpdml0eUNoZWNrKCkge1xuICAgIGlmICh0aGlzLmFjdGl2aXR5VGltZXIpIHtcbiAgICAgIHRoaXMuYWN0aXZpdHlUaW1lci5lbnN1cmVBYm9ydGVkKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBidWlsZENvbm5lY3Rpb25DYWxsYmFja3MoXG4gICAgZXJyb3JDYWxsYmFja3M6IEVycm9yQ2FsbGJhY2tzXG4gICk6IENvbm5lY3Rpb25DYWxsYmFja3Mge1xuICAgIHJldHVybiBDb2xsZWN0aW9ucy5leHRlbmQ8Q29ubmVjdGlvbkNhbGxiYWNrcz4oe30sIGVycm9yQ2FsbGJhY2tzLCB7XG4gICAgICBtZXNzYWdlOiBtZXNzYWdlID0+IHtcbiAgICAgICAgLy8gaW5jbHVkZXMgcG9uZyBtZXNzYWdlcyBmcm9tIHNlcnZlclxuICAgICAgICB0aGlzLnJlc2V0QWN0aXZpdHlDaGVjaygpO1xuICAgICAgICB0aGlzLmVtaXQoJ21lc3NhZ2UnLCBtZXNzYWdlKTtcbiAgICAgIH0sXG4gICAgICBwaW5nOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2VuZF9ldmVudCgncHVzaGVyOnBvbmcnLCB7fSk7XG4gICAgICB9LFxuICAgICAgYWN0aXZpdHk6ICgpID0+IHtcbiAgICAgICAgdGhpcy5yZXNldEFjdGl2aXR5Q2hlY2soKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZXJyb3IgPT4ge1xuICAgICAgICAvLyBqdXN0IGVtaXQgZXJyb3IgdG8gdXNlciAtIHNvY2tldCB3aWxsIGFscmVhZHkgYmUgY2xvc2VkIGJ5IGJyb3dzZXJcbiAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yKTtcbiAgICAgIH0sXG4gICAgICBjbG9zZWQ6ICgpID0+IHtcbiAgICAgICAgdGhpcy5hYmFuZG9uQ29ubmVjdGlvbigpO1xuICAgICAgICBpZiAodGhpcy5zaG91bGRSZXRyeSgpKSB7XG4gICAgICAgICAgdGhpcy5yZXRyeUluKDEwMDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkSGFuZHNoYWtlQ2FsbGJhY2tzKFxuICAgIGVycm9yQ2FsbGJhY2tzOiBFcnJvckNhbGxiYWNrc1xuICApOiBIYW5kc2hha2VDYWxsYmFja3Mge1xuICAgIHJldHVybiBDb2xsZWN0aW9ucy5leHRlbmQ8SGFuZHNoYWtlQ2FsbGJhY2tzPih7fSwgZXJyb3JDYWxsYmFja3MsIHtcbiAgICAgIGNvbm5lY3RlZDogKGhhbmRzaGFrZTogSGFuZHNoYWtlUGF5bG9hZCkgPT4ge1xuICAgICAgICB0aGlzLmFjdGl2aXR5VGltZW91dCA9IE1hdGgubWluKFxuICAgICAgICAgIHRoaXMub3B0aW9ucy5hY3Rpdml0eVRpbWVvdXQsXG4gICAgICAgICAgaGFuZHNoYWtlLmFjdGl2aXR5VGltZW91dCxcbiAgICAgICAgICBoYW5kc2hha2UuY29ubmVjdGlvbi5hY3Rpdml0eVRpbWVvdXQgfHwgSW5maW5pdHlcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5jbGVhclVuYXZhaWxhYmxlVGltZXIoKTtcbiAgICAgICAgdGhpcy5zZXRDb25uZWN0aW9uKGhhbmRzaGFrZS5jb25uZWN0aW9uKTtcbiAgICAgICAgdGhpcy5zb2NrZXRfaWQgPSB0aGlzLmNvbm5lY3Rpb24uaWQ7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGUoJ2Nvbm5lY3RlZCcsIHsgc29ja2V0X2lkOiB0aGlzLnNvY2tldF9pZCB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRFcnJvckNhbGxiYWNrcygpOiBFcnJvckNhbGxiYWNrcyB7XG4gICAgbGV0IHdpdGhFcnJvckVtaXR0ZWQgPSBjYWxsYmFjayA9PiB7XG4gICAgICByZXR1cm4gKHJlc3VsdDogQWN0aW9uIHwgSGFuZHNoYWtlUGF5bG9hZCkgPT4ge1xuICAgICAgICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIHsgdHlwZTogJ1dlYlNvY2tldEVycm9yJywgZXJyb3I6IHJlc3VsdC5lcnJvciB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjayhyZXN1bHQpO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRsc19vbmx5OiB3aXRoRXJyb3JFbWl0dGVkKCgpID0+IHtcbiAgICAgICAgdGhpcy51c2luZ1RMUyA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlU3RyYXRlZ3koKTtcbiAgICAgICAgdGhpcy5yZXRyeUluKDApO1xuICAgICAgfSksXG4gICAgICByZWZ1c2VkOiB3aXRoRXJyb3JFbWl0dGVkKCgpID0+IHtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICB9KSxcbiAgICAgIGJhY2tvZmY6IHdpdGhFcnJvckVtaXR0ZWQoKCkgPT4ge1xuICAgICAgICB0aGlzLnJldHJ5SW4oMTAwMCk7XG4gICAgICB9KSxcbiAgICAgIHJldHJ5OiB3aXRoRXJyb3JFbWl0dGVkKCgpID0+IHtcbiAgICAgICAgdGhpcy5yZXRyeUluKDApO1xuICAgICAgfSlcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRDb25uZWN0aW9uKGNvbm5lY3Rpb24pIHtcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgIGZvciAodmFyIGV2ZW50IGluIHRoaXMuY29ubmVjdGlvbkNhbGxiYWNrcykge1xuICAgICAgdGhpcy5jb25uZWN0aW9uLmJpbmQoZXZlbnQsIHRoaXMuY29ubmVjdGlvbkNhbGxiYWNrc1tldmVudF0pO1xuICAgIH1cbiAgICB0aGlzLnJlc2V0QWN0aXZpdHlDaGVjaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBhYmFuZG9uQ29ubmVjdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuY29ubmVjdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnN0b3BBY3Rpdml0eUNoZWNrKCk7XG4gICAgZm9yICh2YXIgZXZlbnQgaW4gdGhpcy5jb25uZWN0aW9uQ2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24udW5iaW5kKGV2ZW50LCB0aGlzLmNvbm5lY3Rpb25DYWxsYmFja3NbZXZlbnRdKTtcbiAgICB9XG4gICAgdmFyIGNvbm5lY3Rpb24gPSB0aGlzLmNvbm5lY3Rpb247XG4gICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcbiAgICByZXR1cm4gY29ubmVjdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlU3RhdGUobmV3U3RhdGU6IHN0cmluZywgZGF0YT86IGFueSkge1xuICAgIHZhciBwcmV2aW91c1N0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICB0aGlzLnN0YXRlID0gbmV3U3RhdGU7XG4gICAgaWYgKHByZXZpb3VzU3RhdGUgIT09IG5ld1N0YXRlKSB7XG4gICAgICB2YXIgbmV3U3RhdGVEZXNjcmlwdGlvbiA9IG5ld1N0YXRlO1xuICAgICAgaWYgKG5ld1N0YXRlRGVzY3JpcHRpb24gPT09ICdjb25uZWN0ZWQnKSB7XG4gICAgICAgIG5ld1N0YXRlRGVzY3JpcHRpb24gKz0gJyB3aXRoIG5ldyBzb2NrZXQgSUQgJyArIGRhdGEuc29ja2V0X2lkO1xuICAgICAgfVxuICAgICAgTG9nZ2VyLmRlYnVnKFxuICAgICAgICAnU3RhdGUgY2hhbmdlZCcsXG4gICAgICAgIHByZXZpb3VzU3RhdGUgKyAnIC0+ICcgKyBuZXdTdGF0ZURlc2NyaXB0aW9uXG4gICAgICApO1xuICAgICAgdGhpcy50aW1lbGluZS5pbmZvKHsgc3RhdGU6IG5ld1N0YXRlLCBwYXJhbXM6IGRhdGEgfSk7XG4gICAgICB0aGlzLmVtaXQoJ3N0YXRlX2NoYW5nZScsIHsgcHJldmlvdXM6IHByZXZpb3VzU3RhdGUsIGN1cnJlbnQ6IG5ld1N0YXRlIH0pO1xuICAgICAgdGhpcy5lbWl0KG5ld1N0YXRlLCBkYXRhKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNob3VsZFJldHJ5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXRlID09PSAnY29ubmVjdGluZycgfHwgdGhpcy5zdGF0ZSA9PT0gJ2Nvbm5lY3RlZCc7XG4gIH1cbn1cbiIsICJpbXBvcnQgQ2hhbm5lbCBmcm9tICcuL2NoYW5uZWwnO1xuaW1wb3J0ICogYXMgQ29sbGVjdGlvbnMgZnJvbSAnLi4vdXRpbHMvY29sbGVjdGlvbnMnO1xuaW1wb3J0IENoYW5uZWxUYWJsZSBmcm9tICcuL2NoYW5uZWxfdGFibGUnO1xuaW1wb3J0IEZhY3RvcnkgZnJvbSAnLi4vdXRpbHMvZmFjdG9yeSc7XG5pbXBvcnQgUHVzaGVyIGZyb20gJy4uL3B1c2hlcic7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL2xvZ2dlcic7XG5pbXBvcnQgKiBhcyBFcnJvcnMgZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCB1cmxTdG9yZSBmcm9tICcuLi91dGlscy91cmxfc3RvcmUnO1xuXG4vKiogSGFuZGxlcyBhIGNoYW5uZWwgbWFwLiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbm5lbHMge1xuICBjaGFubmVsczogQ2hhbm5lbFRhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY2hhbm5lbHMgPSB7fTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIG9yIHJldHJpZXZlcyBhbiBleGlzdGluZyBjaGFubmVsIGJ5IGl0cyBuYW1lLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge1B1c2hlcn0gcHVzaGVyXG4gICAqIEByZXR1cm4ge0NoYW5uZWx9XG4gICAqL1xuICBhZGQobmFtZTogc3RyaW5nLCBwdXNoZXI6IFB1c2hlcikge1xuICAgIGlmICghdGhpcy5jaGFubmVsc1tuYW1lXSkge1xuICAgICAgdGhpcy5jaGFubmVsc1tuYW1lXSA9IGNyZWF0ZUNoYW5uZWwobmFtZSwgcHVzaGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNbbmFtZV07XG4gIH1cblxuICAvKiogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIGNoYW5uZWxzXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cbiAgYWxsKCk6IENoYW5uZWxbXSB7XG4gICAgcmV0dXJuIENvbGxlY3Rpb25zLnZhbHVlcyh0aGlzLmNoYW5uZWxzKTtcbiAgfVxuXG4gIC8qKiBGaW5kcyBhIGNoYW5uZWwgYnkgaXRzIG5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAqIEByZXR1cm4ge0NoYW5uZWx9IGNoYW5uZWwgb3IgbnVsbCBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAqL1xuICBmaW5kKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzW25hbWVdO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgYSBjaGFubmVsIGZyb20gdGhlIG1hcC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICovXG4gIHJlbW92ZShuYW1lOiBzdHJpbmcpIHtcbiAgICB2YXIgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHNbbmFtZV07XG4gICAgZGVsZXRlIHRoaXMuY2hhbm5lbHNbbmFtZV07XG4gICAgcmV0dXJuIGNoYW5uZWw7XG4gIH1cblxuICAvKiogUHJveGllcyBkaXNjb25uZWN0aW9uIHNpZ25hbCB0byBhbGwgY2hhbm5lbHMuICovXG4gIGRpc2Nvbm5lY3QoKSB7XG4gICAgQ29sbGVjdGlvbnMub2JqZWN0QXBwbHkodGhpcy5jaGFubmVscywgZnVuY3Rpb24oY2hhbm5lbCkge1xuICAgICAgY2hhbm5lbC5kaXNjb25uZWN0KCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2hhbm5lbChuYW1lOiBzdHJpbmcsIHB1c2hlcjogUHVzaGVyKTogQ2hhbm5lbCB7XG4gIGlmIChuYW1lLmluZGV4T2YoJ3ByaXZhdGUtZW5jcnlwdGVkLScpID09PSAwKSB7XG4gICAgaWYgKHB1c2hlci5jb25maWcubmFjbCkge1xuICAgICAgcmV0dXJuIEZhY3RvcnkuY3JlYXRlRW5jcnlwdGVkQ2hhbm5lbChuYW1lLCBwdXNoZXIsIHB1c2hlci5jb25maWcubmFjbCk7XG4gICAgfVxuICAgIGxldCBlcnJNc2cgPVxuICAgICAgJ1RyaWVkIHRvIHN1YnNjcmliZSB0byBhIHByaXZhdGUtZW5jcnlwdGVkLSBjaGFubmVsIGJ1dCBubyBuYWNsIGltcGxlbWVudGF0aW9uIGF2YWlsYWJsZSc7XG4gICAgbGV0IHN1ZmZpeCA9IHVybFN0b3JlLmJ1aWxkTG9nU3VmZml4KCdlbmNyeXB0ZWRDaGFubmVsU3VwcG9ydCcpO1xuICAgIHRocm93IG5ldyBFcnJvcnMuVW5zdXBwb3J0ZWRGZWF0dXJlKGAke2Vyck1zZ30uICR7c3VmZml4fWApO1xuICB9IGVsc2UgaWYgKG5hbWUuaW5kZXhPZigncHJpdmF0ZS0nKSA9PT0gMCkge1xuICAgIHJldHVybiBGYWN0b3J5LmNyZWF0ZVByaXZhdGVDaGFubmVsKG5hbWUsIHB1c2hlcik7XG4gIH0gZWxzZSBpZiAobmFtZS5pbmRleE9mKCdwcmVzZW5jZS0nKSA9PT0gMCkge1xuICAgIHJldHVybiBGYWN0b3J5LmNyZWF0ZVByZXNlbmNlQ2hhbm5lbChuYW1lLCBwdXNoZXIpO1xuICB9IGVsc2UgaWYgKG5hbWUuaW5kZXhPZignIycpID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9ycy5CYWRDaGFubmVsTmFtZShcbiAgICAgICdDYW5ub3QgY3JlYXRlIGEgY2hhbm5lbCB3aXRoIG5hbWUgXCInICsgbmFtZSArICdcIi4nXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gRmFjdG9yeS5jcmVhdGVDaGFubmVsKG5hbWUsIHB1c2hlcik7XG4gIH1cbn1cbiIsICJpbXBvcnQgQXNzaXN0YW50VG9UaGVUcmFuc3BvcnRNYW5hZ2VyIGZyb20gJy4uL3RyYW5zcG9ydHMvYXNzaXN0YW50X3RvX3RoZV90cmFuc3BvcnRfbWFuYWdlcic7XG5pbXBvcnQgUGluZ0RlbGF5T3B0aW9ucyBmcm9tICcuLi90cmFuc3BvcnRzL3BpbmdfZGVsYXlfb3B0aW9ucyc7XG5pbXBvcnQgVHJhbnNwb3J0IGZyb20gJy4uL3RyYW5zcG9ydHMvdHJhbnNwb3J0JztcbmltcG9ydCBUcmFuc3BvcnRNYW5hZ2VyIGZyb20gJy4uL3RyYW5zcG9ydHMvdHJhbnNwb3J0X21hbmFnZXInO1xuaW1wb3J0IEhhbmRzaGFrZSBmcm9tICcuLi9jb25uZWN0aW9uL2hhbmRzaGFrZSc7XG5pbXBvcnQgVHJhbnNwb3J0Q29ubmVjdGlvbiBmcm9tICcuLi90cmFuc3BvcnRzL3RyYW5zcG9ydF9jb25uZWN0aW9uJztcbmltcG9ydCBTb2NrZXRIb29rcyBmcm9tICcuLi9odHRwL3NvY2tldF9ob29rcyc7XG5pbXBvcnQgSFRUUFNvY2tldCBmcm9tICcuLi9odHRwL2h0dHBfc29ja2V0JztcblxuaW1wb3J0IFRpbWVsaW5lIGZyb20gJy4uL3RpbWVsaW5lL3RpbWVsaW5lJztcbmltcG9ydCB7XG4gIGRlZmF1bHQgYXMgVGltZWxpbmVTZW5kZXIsXG4gIFRpbWVsaW5lU2VuZGVyT3B0aW9uc1xufSBmcm9tICcuLi90aW1lbGluZS90aW1lbGluZV9zZW5kZXInO1xuaW1wb3J0IFByZXNlbmNlQ2hhbm5lbCBmcm9tICcuLi9jaGFubmVscy9wcmVzZW5jZV9jaGFubmVsJztcbmltcG9ydCBQcml2YXRlQ2hhbm5lbCBmcm9tICcuLi9jaGFubmVscy9wcml2YXRlX2NoYW5uZWwnO1xuaW1wb3J0IEVuY3J5cHRlZENoYW5uZWwgZnJvbSAnLi4vY2hhbm5lbHMvZW5jcnlwdGVkX2NoYW5uZWwnO1xuaW1wb3J0IENoYW5uZWwgZnJvbSAnLi4vY2hhbm5lbHMvY2hhbm5lbCc7XG5pbXBvcnQgQ29ubmVjdGlvbk1hbmFnZXIgZnJvbSAnLi4vY29ubmVjdGlvbi9jb25uZWN0aW9uX21hbmFnZXInO1xuaW1wb3J0IENvbm5lY3Rpb25NYW5hZ2VyT3B0aW9ucyBmcm9tICcuLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb25fbWFuYWdlcl9vcHRpb25zJztcbmltcG9ydCBBamF4IGZyb20gJy4uL2h0dHAvYWpheCc7XG5pbXBvcnQgQ2hhbm5lbHMgZnJvbSAnLi4vY2hhbm5lbHMvY2hhbm5lbHMnO1xuaW1wb3J0IFB1c2hlciBmcm9tICcuLi9wdXNoZXInO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCAqIGFzIG5hY2wgZnJvbSAndHdlZXRuYWNsJztcblxudmFyIEZhY3RvcnkgPSB7XG4gIGNyZWF0ZUNoYW5uZWxzKCk6IENoYW5uZWxzIHtcbiAgICByZXR1cm4gbmV3IENoYW5uZWxzKCk7XG4gIH0sXG5cbiAgY3JlYXRlQ29ubmVjdGlvbk1hbmFnZXIoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgb3B0aW9uczogQ29ubmVjdGlvbk1hbmFnZXJPcHRpb25zXG4gICk6IENvbm5lY3Rpb25NYW5hZ2VyIHtcbiAgICByZXR1cm4gbmV3IENvbm5lY3Rpb25NYW5hZ2VyKGtleSwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgY3JlYXRlQ2hhbm5lbChuYW1lOiBzdHJpbmcsIHB1c2hlcjogUHVzaGVyKTogQ2hhbm5lbCB7XG4gICAgcmV0dXJuIG5ldyBDaGFubmVsKG5hbWUsIHB1c2hlcik7XG4gIH0sXG5cbiAgY3JlYXRlUHJpdmF0ZUNoYW5uZWwobmFtZTogc3RyaW5nLCBwdXNoZXI6IFB1c2hlcik6IFByaXZhdGVDaGFubmVsIHtcbiAgICByZXR1cm4gbmV3IFByaXZhdGVDaGFubmVsKG5hbWUsIHB1c2hlcik7XG4gIH0sXG5cbiAgY3JlYXRlUHJlc2VuY2VDaGFubmVsKG5hbWU6IHN0cmluZywgcHVzaGVyOiBQdXNoZXIpOiBQcmVzZW5jZUNoYW5uZWwge1xuICAgIHJldHVybiBuZXcgUHJlc2VuY2VDaGFubmVsKG5hbWUsIHB1c2hlcik7XG4gIH0sXG5cbiAgY3JlYXRlRW5jcnlwdGVkQ2hhbm5lbChcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgcHVzaGVyOiBQdXNoZXIsXG4gICAgbmFjbDogbmFjbFxuICApOiBFbmNyeXB0ZWRDaGFubmVsIHtcbiAgICByZXR1cm4gbmV3IEVuY3J5cHRlZENoYW5uZWwobmFtZSwgcHVzaGVyLCBuYWNsKTtcbiAgfSxcblxuICBjcmVhdGVUaW1lbGluZVNlbmRlcih0aW1lbGluZTogVGltZWxpbmUsIG9wdGlvbnM6IFRpbWVsaW5lU2VuZGVyT3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgVGltZWxpbmVTZW5kZXIodGltZWxpbmUsIG9wdGlvbnMpO1xuICB9LFxuXG4gIGNyZWF0ZUhhbmRzaGFrZShcbiAgICB0cmFuc3BvcnQ6IFRyYW5zcG9ydENvbm5lY3Rpb24sXG4gICAgY2FsbGJhY2s6IChIYW5kc2hha2VQYXlsb2FkKSA9PiB2b2lkXG4gICk6IEhhbmRzaGFrZSB7XG4gICAgcmV0dXJuIG5ldyBIYW5kc2hha2UodHJhbnNwb3J0LCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgY3JlYXRlQXNzaXN0YW50VG9UaGVUcmFuc3BvcnRNYW5hZ2VyKFxuICAgIG1hbmFnZXI6IFRyYW5zcG9ydE1hbmFnZXIsXG4gICAgdHJhbnNwb3J0OiBUcmFuc3BvcnQsXG4gICAgb3B0aW9uczogUGluZ0RlbGF5T3B0aW9uc1xuICApOiBBc3Npc3RhbnRUb1RoZVRyYW5zcG9ydE1hbmFnZXIge1xuICAgIHJldHVybiBuZXcgQXNzaXN0YW50VG9UaGVUcmFuc3BvcnRNYW5hZ2VyKG1hbmFnZXIsIHRyYW5zcG9ydCwgb3B0aW9ucyk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEZhY3Rvcnk7XG4iLCAiaW1wb3J0IEFzc2lzdGFudFRvVGhlVHJhbnNwb3J0TWFuYWdlciBmcm9tICcuL2Fzc2lzdGFudF90b190aGVfdHJhbnNwb3J0X21hbmFnZXInO1xuaW1wb3J0IFRyYW5zcG9ydCBmcm9tICcuL3RyYW5zcG9ydCc7XG5pbXBvcnQgUGluZ0RlbGF5T3B0aW9ucyBmcm9tICcuL3BpbmdfZGVsYXlfb3B0aW9ucyc7XG5pbXBvcnQgRmFjdG9yeSBmcm9tICcuLi91dGlscy9mYWN0b3J5JztcblxuZXhwb3J0IGludGVyZmFjZSBUcmFuc3BvcnRNYW5hZ2VyT3B0aW9ucyBleHRlbmRzIFBpbmdEZWxheU9wdGlvbnMge1xuICBsaXZlcz86IG51bWJlcjtcbn1cblxuLyoqIEtlZXBzIHRyYWNrIG9mIHRoZSBudW1iZXIgb2YgbGl2ZXMgbGVmdCBmb3IgYSB0cmFuc3BvcnQuXG4gKlxuICogSW4gdGhlIGJlZ2lubmluZyBvZiBhIHNlc3Npb24sIHRyYW5zcG9ydHMgbWF5IGJlIGFzc2lnbmVkIGEgbnVtYmVyIG9mXG4gKiBsaXZlcy4gV2hlbiBhbiBBc3Npc3RhbnRUb1RoZVRyYW5zcG9ydE1hbmFnZXIgaW5zdGFuY2UgcmVwb3J0cyBhIHRyYW5zcG9ydFxuICogY29ubmVjdGlvbiBjbG9zZWQgdW5jbGVhbmx5LCB0aGUgdHJhbnNwb3J0IGxvc2VzIGEgbGlmZS4gV2hlbiB0aGUgbnVtYmVyXG4gKiBvZiBsaXZlcyBkcm9wcyB0byB6ZXJvLCB0aGUgdHJhbnNwb3J0IGdldHMgZGlzYWJsZWQgYnkgaXRzIG1hbmFnZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhbnNwb3J0TWFuYWdlciB7XG4gIG9wdGlvbnM6IFRyYW5zcG9ydE1hbmFnZXJPcHRpb25zO1xuICBsaXZlc0xlZnQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBUcmFuc3BvcnRNYW5hZ2VyT3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5saXZlc0xlZnQgPSB0aGlzLm9wdGlvbnMubGl2ZXMgfHwgSW5maW5pdHk7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIGFzc2lzdGFudCBmb3IgdGhlIHRyYW5zcG9ydC5cbiAgICpcbiAgICogQHBhcmFtIHtUcmFuc3BvcnR9IHRyYW5zcG9ydFxuICAgKiBAcmV0dXJucyB7QXNzaXN0YW50VG9UaGVUcmFuc3BvcnRNYW5hZ2VyfVxuICAgKi9cbiAgZ2V0QXNzaXN0YW50KHRyYW5zcG9ydDogVHJhbnNwb3J0KTogQXNzaXN0YW50VG9UaGVUcmFuc3BvcnRNYW5hZ2VyIHtcbiAgICByZXR1cm4gRmFjdG9yeS5jcmVhdGVBc3Npc3RhbnRUb1RoZVRyYW5zcG9ydE1hbmFnZXIodGhpcywgdHJhbnNwb3J0LCB7XG4gICAgICBtaW5QaW5nRGVsYXk6IHRoaXMub3B0aW9ucy5taW5QaW5nRGVsYXksXG4gICAgICBtYXhQaW5nRGVsYXk6IHRoaXMub3B0aW9ucy5tYXhQaW5nRGVsYXlcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHRyYW5zcG9ydCBoYXMgYW55IGxpdmVzIGxlZnQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgaXNBbGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5saXZlc0xlZnQgPiAwO1xuICB9XG5cbiAgLyoqIFRha2VzIG9uZSBsaWZlIGZyb20gdGhlIHRyYW5zcG9ydC4gKi9cbiAgcmVwb3J0RGVhdGgoKSB7XG4gICAgdGhpcy5saXZlc0xlZnQgLT0gMTtcbiAgfVxufVxuIiwgImltcG9ydCAqIGFzIENvbGxlY3Rpb25zIGZyb20gJy4uL3V0aWxzL2NvbGxlY3Rpb25zJztcbmltcG9ydCBVdGlsIGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHsgT25lT2ZmVGltZXIgYXMgVGltZXIgfSBmcm9tICcuLi91dGlscy90aW1lcnMnO1xuaW1wb3J0IFN0cmF0ZWd5IGZyb20gJy4vc3RyYXRlZ3knO1xuaW1wb3J0IFN0cmF0ZWd5T3B0aW9ucyBmcm9tICcuL3N0cmF0ZWd5X29wdGlvbnMnO1xuXG4vKiogTG9vcHMgdGhyb3VnaCBzdHJhdGVnaWVzIHdpdGggb3B0aW9uYWwgdGltZW91dHMuXG4gKlxuICogT3B0aW9uczpcbiAqIC0gbG9vcCAtIHdoZXRoZXIgaXQgc2hvdWxkIGxvb3AgdGhyb3VnaCB0aGUgc3Vic3RyYXRlZ3kgbGlzdFxuICogLSB0aW1lb3V0IC0gaW5pdGlhbCB0aW1lb3V0IGZvciBhIHNpbmdsZSBzdWJzdHJhdGVneVxuICogLSB0aW1lb3V0TGltaXQgLSBtYXhpbXVtIHRpbWVvdXRcbiAqXG4gKiBAcGFyYW0ge1N0cmF0ZWd5W119IHN0cmF0ZWdpZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcXVlbnRpYWxTdHJhdGVneSBpbXBsZW1lbnRzIFN0cmF0ZWd5IHtcbiAgc3RyYXRlZ2llczogU3RyYXRlZ3lbXTtcbiAgbG9vcDogYm9vbGVhbjtcbiAgZmFpbEZhc3Q6IGJvb2xlYW47XG4gIHRpbWVvdXQ6IG51bWJlcjtcbiAgdGltZW91dExpbWl0OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3Ioc3RyYXRlZ2llczogU3RyYXRlZ3lbXSwgb3B0aW9uczogU3RyYXRlZ3lPcHRpb25zKSB7XG4gICAgdGhpcy5zdHJhdGVnaWVzID0gc3RyYXRlZ2llcztcbiAgICB0aGlzLmxvb3AgPSBCb29sZWFuKG9wdGlvbnMubG9vcCk7XG4gICAgdGhpcy5mYWlsRmFzdCA9IEJvb2xlYW4ob3B0aW9ucy5mYWlsRmFzdCk7XG4gICAgdGhpcy50aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0O1xuICAgIHRoaXMudGltZW91dExpbWl0ID0gb3B0aW9ucy50aW1lb3V0TGltaXQ7XG4gIH1cblxuICBpc1N1cHBvcnRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gQ29sbGVjdGlvbnMuYW55KHRoaXMuc3RyYXRlZ2llcywgVXRpbC5tZXRob2QoJ2lzU3VwcG9ydGVkJykpO1xuICB9XG5cbiAgY29ubmVjdChtaW5Qcmlvcml0eTogbnVtYmVyLCBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICB2YXIgc3RyYXRlZ2llcyA9IHRoaXMuc3RyYXRlZ2llcztcbiAgICB2YXIgY3VycmVudCA9IDA7XG4gICAgdmFyIHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQ7XG4gICAgdmFyIHJ1bm5lciA9IG51bGw7XG5cbiAgICB2YXIgdHJ5TmV4dFN0cmF0ZWd5ID0gKGVycm9yLCBoYW5kc2hha2UpID0+IHtcbiAgICAgIGlmIChoYW5kc2hha2UpIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgaGFuZHNoYWtlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50ICsgMTtcbiAgICAgICAgaWYgKHRoaXMubG9vcCkge1xuICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50ICUgc3RyYXRlZ2llcy5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudCA8IHN0cmF0ZWdpZXMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSB0aW1lb3V0ICogMjtcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVvdXRMaW1pdCkge1xuICAgICAgICAgICAgICB0aW1lb3V0ID0gTWF0aC5taW4odGltZW91dCwgdGhpcy50aW1lb3V0TGltaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBydW5uZXIgPSB0aGlzLnRyeVN0cmF0ZWd5KFxuICAgICAgICAgICAgc3RyYXRlZ2llc1tjdXJyZW50XSxcbiAgICAgICAgICAgIG1pblByaW9yaXR5LFxuICAgICAgICAgICAgeyB0aW1lb3V0LCBmYWlsRmFzdDogdGhpcy5mYWlsRmFzdCB9LFxuICAgICAgICAgICAgdHJ5TmV4dFN0cmF0ZWd5XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBydW5uZXIgPSB0aGlzLnRyeVN0cmF0ZWd5KFxuICAgICAgc3RyYXRlZ2llc1tjdXJyZW50XSxcbiAgICAgIG1pblByaW9yaXR5LFxuICAgICAgeyB0aW1lb3V0OiB0aW1lb3V0LCBmYWlsRmFzdDogdGhpcy5mYWlsRmFzdCB9LFxuICAgICAgdHJ5TmV4dFN0cmF0ZWd5XG4gICAgKTtcblxuICAgIHJldHVybiB7XG4gICAgICBhYm9ydDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJ1bm5lci5hYm9ydCgpO1xuICAgICAgfSxcbiAgICAgIGZvcmNlTWluUHJpb3JpdHk6IGZ1bmN0aW9uKHApIHtcbiAgICAgICAgbWluUHJpb3JpdHkgPSBwO1xuICAgICAgICBpZiAocnVubmVyKSB7XG4gICAgICAgICAgcnVubmVyLmZvcmNlTWluUHJpb3JpdHkocCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSB0cnlTdHJhdGVneShcbiAgICBzdHJhdGVneTogU3RyYXRlZ3ksXG4gICAgbWluUHJpb3JpdHk6IG51bWJlcixcbiAgICBvcHRpb25zOiBTdHJhdGVneU9wdGlvbnMsXG4gICAgY2FsbGJhY2s6IEZ1bmN0aW9uXG4gICkge1xuICAgIHZhciB0aW1lciA9IG51bGw7XG4gICAgdmFyIHJ1bm5lciA9IG51bGw7XG5cbiAgICBpZiAob3B0aW9ucy50aW1lb3V0ID4gMCkge1xuICAgICAgdGltZXIgPSBuZXcgVGltZXIob3B0aW9ucy50aW1lb3V0LCBmdW5jdGlvbigpIHtcbiAgICAgICAgcnVubmVyLmFib3J0KCk7XG4gICAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcnVubmVyID0gc3RyYXRlZ3kuY29ubmVjdChtaW5Qcmlvcml0eSwgZnVuY3Rpb24oZXJyb3IsIGhhbmRzaGFrZSkge1xuICAgICAgaWYgKGVycm9yICYmIHRpbWVyICYmIHRpbWVyLmlzUnVubmluZygpICYmICFvcHRpb25zLmZhaWxGYXN0KSB7XG4gICAgICAgIC8vIGFkdmFuY2UgdG8gdGhlIG5leHQgc3RyYXRlZ3kgYWZ0ZXIgdGhlIHRpbWVvdXRcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRpbWVyKSB7XG4gICAgICAgIHRpbWVyLmVuc3VyZUFib3J0ZWQoKTtcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrKGVycm9yLCBoYW5kc2hha2UpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFib3J0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRpbWVyKSB7XG4gICAgICAgICAgdGltZXIuZW5zdXJlQWJvcnRlZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJ1bm5lci5hYm9ydCgpO1xuICAgICAgfSxcbiAgICAgIGZvcmNlTWluUHJpb3JpdHk6IGZ1bmN0aW9uKHApIHtcbiAgICAgICAgcnVubmVyLmZvcmNlTWluUHJpb3JpdHkocCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuIiwgImltcG9ydCAqIGFzIENvbGxlY3Rpb25zIGZyb20gJy4uL3V0aWxzL2NvbGxlY3Rpb25zJztcbmltcG9ydCBVdGlsIGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IFN0cmF0ZWd5IGZyb20gJy4vc3RyYXRlZ3knO1xuXG4vKiogTGF1bmNoZXMgYWxsIHN1YnN0cmF0ZWdpZXMgYW5kIGVtaXRzIHByaW9yaXRpemVkIGNvbm5lY3RlZCB0cmFuc3BvcnRzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHN0cmF0ZWdpZXNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmVzdENvbm5lY3RlZEV2ZXJTdHJhdGVneSBpbXBsZW1lbnRzIFN0cmF0ZWd5IHtcbiAgc3RyYXRlZ2llczogU3RyYXRlZ3lbXTtcblxuICBjb25zdHJ1Y3RvcihzdHJhdGVnaWVzOiBTdHJhdGVneVtdKSB7XG4gICAgdGhpcy5zdHJhdGVnaWVzID0gc3RyYXRlZ2llcztcbiAgfVxuXG4gIGlzU3VwcG9ydGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBDb2xsZWN0aW9ucy5hbnkodGhpcy5zdHJhdGVnaWVzLCBVdGlsLm1ldGhvZCgnaXNTdXBwb3J0ZWQnKSk7XG4gIH1cblxuICBjb25uZWN0KG1pblByaW9yaXR5OiBudW1iZXIsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgIHJldHVybiBjb25uZWN0KHRoaXMuc3RyYXRlZ2llcywgbWluUHJpb3JpdHksIGZ1bmN0aW9uKGksIHJ1bm5lcnMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihlcnJvciwgaGFuZHNoYWtlKSB7XG4gICAgICAgIHJ1bm5lcnNbaV0uZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgaWYgKGFsbFJ1bm5lcnNGYWlsZWQocnVubmVycykpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgQ29sbGVjdGlvbnMuYXBwbHkocnVubmVycywgZnVuY3Rpb24ocnVubmVyKSB7XG4gICAgICAgICAgcnVubmVyLmZvcmNlTWluUHJpb3JpdHkoaGFuZHNoYWtlLnRyYW5zcG9ydC5wcmlvcml0eSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjYWxsYmFjayhudWxsLCBoYW5kc2hha2UpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKiogQ29ubmVjdHMgdG8gYWxsIHN0cmF0ZWdpZXMgaW4gcGFyYWxsZWwuXG4gKlxuICogQ2FsbGJhY2sgYnVpbGRlciBzaG91bGQgYmUgYSBmdW5jdGlvbiB0aGF0IHRha2VzIHR3byBhcmd1bWVudHM6IGluZGV4XG4gKiBhbmQgYSBsaXN0IG9mIHJ1bm5lcnMuIEl0IHNob3VsZCByZXR1cm4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHdpbGwgYmVcbiAqIHBhc3NlZCB0byB0aGUgc3Vic3RyYXRlZ3kgd2l0aCBnaXZlbiBpbmRleC4gUnVubmVycyBjYW4gYmUgYWJvcnRlZCB1c2luZ1xuICogYWJvcnRSdW5uZXIocykgZnVuY3Rpb25zIGZyb20gdGhpcyBjbGFzcy5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gc3RyYXRlZ2llc1xuICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrQnVpbGRlclxuICogQHJldHVybiB7T2JqZWN0fSBzdHJhdGVneSBydW5uZXJcbiAqL1xuZnVuY3Rpb24gY29ubmVjdChcbiAgc3RyYXRlZ2llczogU3RyYXRlZ3lbXSxcbiAgbWluUHJpb3JpdHk6IG51bWJlcixcbiAgY2FsbGJhY2tCdWlsZGVyOiBGdW5jdGlvblxuKSB7XG4gIHZhciBydW5uZXJzID0gQ29sbGVjdGlvbnMubWFwKHN0cmF0ZWdpZXMsIGZ1bmN0aW9uKHN0cmF0ZWd5LCBpLCBfLCBycykge1xuICAgIHJldHVybiBzdHJhdGVneS5jb25uZWN0KG1pblByaW9yaXR5LCBjYWxsYmFja0J1aWxkZXIoaSwgcnMpKTtcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgYWJvcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgQ29sbGVjdGlvbnMuYXBwbHkocnVubmVycywgYWJvcnRSdW5uZXIpO1xuICAgIH0sXG4gICAgZm9yY2VNaW5Qcmlvcml0eTogZnVuY3Rpb24ocCkge1xuICAgICAgQ29sbGVjdGlvbnMuYXBwbHkocnVubmVycywgZnVuY3Rpb24ocnVubmVyKSB7XG4gICAgICAgIHJ1bm5lci5mb3JjZU1pblByaW9yaXR5KHApO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBhbGxSdW5uZXJzRmFpbGVkKHJ1bm5lcnMpOiBib29sZWFuIHtcbiAgcmV0dXJuIENvbGxlY3Rpb25zLmFsbChydW5uZXJzLCBmdW5jdGlvbihydW5uZXIpIHtcbiAgICByZXR1cm4gQm9vbGVhbihydW5uZXIuZXJyb3IpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWJvcnRSdW5uZXIocnVubmVyKSB7XG4gIGlmICghcnVubmVyLmVycm9yICYmICFydW5uZXIuYWJvcnRlZCkge1xuICAgIHJ1bm5lci5hYm9ydCgpO1xuICAgIHJ1bm5lci5hYm9ydGVkID0gdHJ1ZTtcbiAgfVxufVxuIiwgImltcG9ydCBVdGlsIGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IFJ1bnRpbWUgZnJvbSAncnVudGltZSc7XG5pbXBvcnQgU3RyYXRlZ3kgZnJvbSAnLi9zdHJhdGVneSc7XG5pbXBvcnQgU2VxdWVudGlhbFN0cmF0ZWd5IGZyb20gJy4vc2VxdWVudGlhbF9zdHJhdGVneSc7XG5pbXBvcnQgU3RyYXRlZ3lPcHRpb25zIGZyb20gJy4vc3RyYXRlZ3lfb3B0aW9ucyc7XG5pbXBvcnQgVHJhbnNwb3J0U3RyYXRlZ3kgZnJvbSAnLi90cmFuc3BvcnRfc3RyYXRlZ3knO1xuaW1wb3J0IFRpbWVsaW5lIGZyb20gJy4uL3RpbWVsaW5lL3RpbWVsaW5lJztcbmltcG9ydCAqIGFzIENvbGxlY3Rpb25zIGZyb20gJy4uL3V0aWxzL2NvbGxlY3Rpb25zJztcblxuZXhwb3J0IGludGVyZmFjZSBUcmFuc3BvcnRTdHJhdGVneURpY3Rpb25hcnkge1xuICBba2V5OiBzdHJpbmddOiBUcmFuc3BvcnRTdHJhdGVneTtcbn1cblxuLyoqIENhY2hlcyBsYXN0IHN1Y2Nlc3NmdWwgdHJhbnNwb3J0IGFuZCB1c2VzIGl0IGZvciBmb2xsb3dpbmcgYXR0ZW1wdHMuXG4gKlxuICogQHBhcmFtIHtTdHJhdGVneX0gc3RyYXRlZ3lcbiAqIEBwYXJhbSB7T2JqZWN0fSB0cmFuc3BvcnRzXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWNoZWRTdHJhdGVneSBpbXBsZW1lbnRzIFN0cmF0ZWd5IHtcbiAgc3RyYXRlZ3k6IFN0cmF0ZWd5O1xuICB0cmFuc3BvcnRzOiBUcmFuc3BvcnRTdHJhdGVneURpY3Rpb25hcnk7XG4gIHR0bDogbnVtYmVyO1xuICB1c2luZ1RMUzogYm9vbGVhbjtcbiAgdGltZWxpbmU6IFRpbWVsaW5lO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHN0cmF0ZWd5OiBTdHJhdGVneSxcbiAgICB0cmFuc3BvcnRzOiBUcmFuc3BvcnRTdHJhdGVneURpY3Rpb25hcnksXG4gICAgb3B0aW9uczogU3RyYXRlZ3lPcHRpb25zXG4gICkge1xuICAgIHRoaXMuc3RyYXRlZ3kgPSBzdHJhdGVneTtcbiAgICB0aGlzLnRyYW5zcG9ydHMgPSB0cmFuc3BvcnRzO1xuICAgIHRoaXMudHRsID0gb3B0aW9ucy50dGwgfHwgMTgwMCAqIDEwMDA7XG4gICAgdGhpcy51c2luZ1RMUyA9IG9wdGlvbnMudXNlVExTO1xuICAgIHRoaXMudGltZWxpbmUgPSBvcHRpb25zLnRpbWVsaW5lO1xuICB9XG5cbiAgaXNTdXBwb3J0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RyYXRlZ3kuaXNTdXBwb3J0ZWQoKTtcbiAgfVxuXG4gIGNvbm5lY3QobWluUHJpb3JpdHk6IG51bWJlciwgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgdmFyIHVzaW5nVExTID0gdGhpcy51c2luZ1RMUztcbiAgICB2YXIgaW5mbyA9IGZldGNoVHJhbnNwb3J0Q2FjaGUodXNpbmdUTFMpO1xuXG4gICAgdmFyIHN0cmF0ZWdpZXMgPSBbdGhpcy5zdHJhdGVneV07XG4gICAgaWYgKGluZm8gJiYgaW5mby50aW1lc3RhbXAgKyB0aGlzLnR0bCA+PSBVdGlsLm5vdygpKSB7XG4gICAgICB2YXIgdHJhbnNwb3J0ID0gdGhpcy50cmFuc3BvcnRzW2luZm8udHJhbnNwb3J0XTtcbiAgICAgIGlmICh0cmFuc3BvcnQpIHtcbiAgICAgICAgdGhpcy50aW1lbGluZS5pbmZvKHtcbiAgICAgICAgICBjYWNoZWQ6IHRydWUsXG4gICAgICAgICAgdHJhbnNwb3J0OiBpbmZvLnRyYW5zcG9ydCxcbiAgICAgICAgICBsYXRlbmN5OiBpbmZvLmxhdGVuY3lcbiAgICAgICAgfSk7XG4gICAgICAgIHN0cmF0ZWdpZXMucHVzaChcbiAgICAgICAgICBuZXcgU2VxdWVudGlhbFN0cmF0ZWd5KFt0cmFuc3BvcnRdLCB7XG4gICAgICAgICAgICB0aW1lb3V0OiBpbmZvLmxhdGVuY3kgKiAyICsgMTAwMCxcbiAgICAgICAgICAgIGZhaWxGYXN0OiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3RhcnRUaW1lc3RhbXAgPSBVdGlsLm5vdygpO1xuICAgIHZhciBydW5uZXIgPSBzdHJhdGVnaWVzXG4gICAgICAucG9wKClcbiAgICAgIC5jb25uZWN0KG1pblByaW9yaXR5LCBmdW5jdGlvbiBjYihlcnJvciwgaGFuZHNoYWtlKSB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGZsdXNoVHJhbnNwb3J0Q2FjaGUodXNpbmdUTFMpO1xuICAgICAgICAgIGlmIChzdHJhdGVnaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHN0YXJ0VGltZXN0YW1wID0gVXRpbC5ub3coKTtcbiAgICAgICAgICAgIHJ1bm5lciA9IHN0cmF0ZWdpZXMucG9wKCkuY29ubmVjdChtaW5Qcmlvcml0eSwgY2IpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0b3JlVHJhbnNwb3J0Q2FjaGUoXG4gICAgICAgICAgICB1c2luZ1RMUyxcbiAgICAgICAgICAgIGhhbmRzaGFrZS50cmFuc3BvcnQubmFtZSxcbiAgICAgICAgICAgIFV0aWwubm93KCkgLSBzdGFydFRpbWVzdGFtcFxuICAgICAgICAgICk7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgaGFuZHNoYWtlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWJvcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBydW5uZXIuYWJvcnQoKTtcbiAgICAgIH0sXG4gICAgICBmb3JjZU1pblByaW9yaXR5OiBmdW5jdGlvbihwKSB7XG4gICAgICAgIG1pblByaW9yaXR5ID0gcDtcbiAgICAgICAgaWYgKHJ1bm5lcikge1xuICAgICAgICAgIHJ1bm5lci5mb3JjZU1pblByaW9yaXR5KHApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUcmFuc3BvcnRDYWNoZUtleSh1c2luZ1RMUzogYm9vbGVhbik6IHN0cmluZyB7XG4gIHJldHVybiAncHVzaGVyVHJhbnNwb3J0JyArICh1c2luZ1RMUyA/ICdUTFMnIDogJ05vblRMUycpO1xufVxuXG5mdW5jdGlvbiBmZXRjaFRyYW5zcG9ydENhY2hlKHVzaW5nVExTOiBib29sZWFuKTogYW55IHtcbiAgdmFyIHN0b3JhZ2UgPSBSdW50aW1lLmdldExvY2FsU3RvcmFnZSgpO1xuICBpZiAoc3RvcmFnZSkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgc2VyaWFsaXplZENhY2hlID0gc3RvcmFnZVtnZXRUcmFuc3BvcnRDYWNoZUtleSh1c2luZ1RMUyldO1xuICAgICAgaWYgKHNlcmlhbGl6ZWRDYWNoZSkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShzZXJpYWxpemVkQ2FjaGUpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGZsdXNoVHJhbnNwb3J0Q2FjaGUodXNpbmdUTFMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gc3RvcmVUcmFuc3BvcnRDYWNoZShcbiAgdXNpbmdUTFM6IGJvb2xlYW4sXG4gIHRyYW5zcG9ydDogVHJhbnNwb3J0U3RyYXRlZ3ksXG4gIGxhdGVuY3k6IG51bWJlclxuKSB7XG4gIHZhciBzdG9yYWdlID0gUnVudGltZS5nZXRMb2NhbFN0b3JhZ2UoKTtcbiAgaWYgKHN0b3JhZ2UpIHtcbiAgICB0cnkge1xuICAgICAgc3RvcmFnZVtnZXRUcmFuc3BvcnRDYWNoZUtleSh1c2luZ1RMUyldID0gQ29sbGVjdGlvbnMuc2FmZUpTT05TdHJpbmdpZnkoe1xuICAgICAgICB0aW1lc3RhbXA6IFV0aWwubm93KCksXG4gICAgICAgIHRyYW5zcG9ydDogdHJhbnNwb3J0LFxuICAgICAgICBsYXRlbmN5OiBsYXRlbmN5XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBjYXRjaCBvdmVyIHF1b3RhIGV4Y2VwdGlvbnMgcmFpc2VkIGJ5IGxvY2FsU3RvcmFnZVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmbHVzaFRyYW5zcG9ydENhY2hlKHVzaW5nVExTOiBib29sZWFuKSB7XG4gIHZhciBzdG9yYWdlID0gUnVudGltZS5nZXRMb2NhbFN0b3JhZ2UoKTtcbiAgaWYgKHN0b3JhZ2UpIHtcbiAgICB0cnkge1xuICAgICAgZGVsZXRlIHN0b3JhZ2VbZ2V0VHJhbnNwb3J0Q2FjaGVLZXkodXNpbmdUTFMpXTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBjYXRjaCBleGNlcHRpb25zIHJhaXNlZCBieSBsb2NhbFN0b3JhZ2VcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBPbmVPZmZUaW1lciBhcyBUaW1lciB9IGZyb20gJy4uL3V0aWxzL3RpbWVycyc7XG5pbXBvcnQgU3RyYXRlZ3kgZnJvbSAnLi9zdHJhdGVneSc7XG5pbXBvcnQgU3RyYXRlZ3lPcHRpb25zIGZyb20gJy4vc3RyYXRlZ3lfb3B0aW9ucyc7XG5cbi8qKiBSdW5zIHN1YnN0cmF0ZWd5IGFmdGVyIHNwZWNpZmllZCBkZWxheS5cbiAqXG4gKiBPcHRpb25zOlxuICogLSBkZWxheSAtIHRpbWUgaW4gbWlsaXNlY29uZHMgdG8gZGVsYXkgdGhlIHN1YnN0cmF0ZWd5IGF0dGVtcHRcbiAqXG4gKiBAcGFyYW0ge1N0cmF0ZWd5fSBzdHJhdGVneVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVsYXllZFN0cmF0ZWd5IGltcGxlbWVudHMgU3RyYXRlZ3kge1xuICBzdHJhdGVneTogU3RyYXRlZ3k7XG4gIG9wdGlvbnM6IHsgZGVsYXk6IG51bWJlciB9O1xuXG4gIGNvbnN0cnVjdG9yKHN0cmF0ZWd5OiBTdHJhdGVneSwgeyBkZWxheTogbnVtYmVyIH0pIHtcbiAgICB0aGlzLnN0cmF0ZWd5ID0gc3RyYXRlZ3k7XG4gICAgdGhpcy5vcHRpb25zID0geyBkZWxheTogbnVtYmVyIH07XG4gIH1cblxuICBpc1N1cHBvcnRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdHJhdGVneS5pc1N1cHBvcnRlZCgpO1xuICB9XG5cbiAgY29ubmVjdChtaW5Qcmlvcml0eTogbnVtYmVyLCBjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICB2YXIgc3RyYXRlZ3kgPSB0aGlzLnN0cmF0ZWd5O1xuICAgIHZhciBydW5uZXI7XG4gICAgdmFyIHRpbWVyID0gbmV3IFRpbWVyKHRoaXMub3B0aW9ucy5kZWxheSwgZnVuY3Rpb24oKSB7XG4gICAgICBydW5uZXIgPSBzdHJhdGVneS5jb25uZWN0KG1pblByaW9yaXR5LCBjYWxsYmFjayk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWJvcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lci5lbnN1cmVBYm9ydGVkKCk7XG4gICAgICAgIGlmIChydW5uZXIpIHtcbiAgICAgICAgICBydW5uZXIuYWJvcnQoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZvcmNlTWluUHJpb3JpdHk6IGZ1bmN0aW9uKHApIHtcbiAgICAgICAgbWluUHJpb3JpdHkgPSBwO1xuICAgICAgICBpZiAocnVubmVyKSB7XG4gICAgICAgICAgcnVubmVyLmZvcmNlTWluUHJpb3JpdHkocCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iLCAiaW1wb3J0IFN0cmF0ZWd5IGZyb20gJy4vc3RyYXRlZ3knO1xuaW1wb3J0IFN0cmF0ZWd5UnVubmVyIGZyb20gJy4vc3RyYXRlZ3lfcnVubmVyJztcblxuLyoqIFByb3hpZXMgbWV0aG9kIGNhbGxzIHRvIG9uZSBvZiBzdWJzdHJhdGVnaWVzIGJhc2luZyBvbiB0aGUgdGVzdCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0ZXN0XG4gKiBAcGFyYW0ge1N0cmF0ZWd5fSB0cnVlQnJhbmNoIHN0cmF0ZWd5IHVzZWQgd2hlbiB0ZXN0IHJldHVybnMgdHJ1ZVxuICogQHBhcmFtIHtTdHJhdGVneX0gZmFsc2VCcmFuY2ggc3RyYXRlZ3kgdXNlZCB3aGVuIHRlc3QgcmV0dXJucyBmYWxzZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJZlN0cmF0ZWd5IGltcGxlbWVudHMgU3RyYXRlZ3kge1xuICB0ZXN0OiAoKSA9PiBib29sZWFuO1xuICB0cnVlQnJhbmNoOiBTdHJhdGVneTtcbiAgZmFsc2VCcmFuY2g6IFN0cmF0ZWd5O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHRlc3Q6ICgpID0+IGJvb2xlYW4sXG4gICAgdHJ1ZUJyYW5jaDogU3RyYXRlZ3ksXG4gICAgZmFsc2VCcmFuY2g6IFN0cmF0ZWd5XG4gICkge1xuICAgIHRoaXMudGVzdCA9IHRlc3Q7XG4gICAgdGhpcy50cnVlQnJhbmNoID0gdHJ1ZUJyYW5jaDtcbiAgICB0aGlzLmZhbHNlQnJhbmNoID0gZmFsc2VCcmFuY2g7XG4gIH1cblxuICBpc1N1cHBvcnRlZCgpOiBib29sZWFuIHtcbiAgICB2YXIgYnJhbmNoID0gdGhpcy50ZXN0KCkgPyB0aGlzLnRydWVCcmFuY2ggOiB0aGlzLmZhbHNlQnJhbmNoO1xuICAgIHJldHVybiBicmFuY2guaXNTdXBwb3J0ZWQoKTtcbiAgfVxuXG4gIGNvbm5lY3QobWluUHJpb3JpdHk6IG51bWJlciwgY2FsbGJhY2s6IEZ1bmN0aW9uKTogU3RyYXRlZ3lSdW5uZXIge1xuICAgIHZhciBicmFuY2ggPSB0aGlzLnRlc3QoKSA/IHRoaXMudHJ1ZUJyYW5jaCA6IHRoaXMuZmFsc2VCcmFuY2g7XG4gICAgcmV0dXJuIGJyYW5jaC5jb25uZWN0KG1pblByaW9yaXR5LCBjYWxsYmFjayk7XG4gIH1cbn1cbiIsICJpbXBvcnQgU3RyYXRlZ3kgZnJvbSAnLi9zdHJhdGVneSc7XG5pbXBvcnQgU3RyYXRlZ3lSdW5uZXIgZnJvbSAnLi9zdHJhdGVneV9ydW5uZXInO1xuXG4vKiogTGF1bmNoZXMgdGhlIHN1YnN0cmF0ZWd5IGFuZCB0ZXJtaW5hdGVzIG9uIHRoZSBmaXJzdCBvcGVuIGNvbm5lY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJhdGVneX0gc3RyYXRlZ3lcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlyc3RDb25uZWN0ZWRTdHJhdGVneSBpbXBsZW1lbnRzIFN0cmF0ZWd5IHtcbiAgc3RyYXRlZ3k6IFN0cmF0ZWd5O1xuXG4gIGNvbnN0cnVjdG9yKHN0cmF0ZWd5OiBTdHJhdGVneSkge1xuICAgIHRoaXMuc3RyYXRlZ3kgPSBzdHJhdGVneTtcbiAgfVxuXG4gIGlzU3VwcG9ydGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0cmF0ZWd5LmlzU3VwcG9ydGVkKCk7XG4gIH1cblxuICBjb25uZWN0KG1pblByaW9yaXR5OiBudW1iZXIsIGNhbGxiYWNrOiBGdW5jdGlvbik6IFN0cmF0ZWd5UnVubmVyIHtcbiAgICB2YXIgcnVubmVyID0gdGhpcy5zdHJhdGVneS5jb25uZWN0KG1pblByaW9yaXR5LCBmdW5jdGlvbihlcnJvciwgaGFuZHNoYWtlKSB7XG4gICAgICBpZiAoaGFuZHNoYWtlKSB7XG4gICAgICAgIHJ1bm5lci5hYm9ydCgpO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2soZXJyb3IsIGhhbmRzaGFrZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJ1bm5lcjtcbiAgfVxufVxuIiwgImltcG9ydCAqIGFzIENvbGxlY3Rpb25zIGZyb20gJ2NvcmUvdXRpbHMvY29sbGVjdGlvbnMnO1xuaW1wb3J0IFRyYW5zcG9ydE1hbmFnZXIgZnJvbSAnY29yZS90cmFuc3BvcnRzL3RyYW5zcG9ydF9tYW5hZ2VyJztcbmltcG9ydCBTdHJhdGVneSBmcm9tICdjb3JlL3N0cmF0ZWdpZXMvc3RyYXRlZ3knO1xuaW1wb3J0IFN0cmF0ZWd5T3B0aW9ucyBmcm9tICdjb3JlL3N0cmF0ZWdpZXMvc3RyYXRlZ3lfb3B0aW9ucyc7XG5pbXBvcnQgU2VxdWVudGlhbFN0cmF0ZWd5IGZyb20gJ2NvcmUvc3RyYXRlZ2llcy9zZXF1ZW50aWFsX3N0cmF0ZWd5JztcbmltcG9ydCBCZXN0Q29ubmVjdGVkRXZlclN0cmF0ZWd5IGZyb20gJ2NvcmUvc3RyYXRlZ2llcy9iZXN0X2Nvbm5lY3RlZF9ldmVyX3N0cmF0ZWd5JztcbmltcG9ydCBDYWNoZWRTdHJhdGVneSwge1xuICBUcmFuc3BvcnRTdHJhdGVneURpY3Rpb25hcnlcbn0gZnJvbSAnY29yZS9zdHJhdGVnaWVzL2NhY2hlZF9zdHJhdGVneSc7XG5pbXBvcnQgRGVsYXllZFN0cmF0ZWd5IGZyb20gJ2NvcmUvc3RyYXRlZ2llcy9kZWxheWVkX3N0cmF0ZWd5JztcbmltcG9ydCBJZlN0cmF0ZWd5IGZyb20gJ2NvcmUvc3RyYXRlZ2llcy9pZl9zdHJhdGVneSc7XG5pbXBvcnQgRmlyc3RDb25uZWN0ZWRTdHJhdGVneSBmcm9tICdjb3JlL3N0cmF0ZWdpZXMvZmlyc3RfY29ubmVjdGVkX3N0cmF0ZWd5JztcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJ2NvcmUvY29uZmlnJztcblxuZnVuY3Rpb24gdGVzdFN1cHBvcnRzU3RyYXRlZ3koc3RyYXRlZ3k6IFN0cmF0ZWd5KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3RyYXRlZ3kuaXNTdXBwb3J0ZWQoKTtcbiAgfTtcbn1cblxudmFyIGdldERlZmF1bHRTdHJhdGVneSA9IGZ1bmN0aW9uKFxuICBjb25maWc6IENvbmZpZyxcbiAgYmFzZU9wdGlvbnM6IFN0cmF0ZWd5T3B0aW9ucyxcbiAgZGVmaW5lVHJhbnNwb3J0OiBGdW5jdGlvblxuKTogU3RyYXRlZ3kge1xuICB2YXIgZGVmaW5lZFRyYW5zcG9ydHMgPSA8VHJhbnNwb3J0U3RyYXRlZ3lEaWN0aW9uYXJ5Pnt9O1xuXG4gIGZ1bmN0aW9uIGRlZmluZVRyYW5zcG9ydFN0cmF0ZWd5KFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgcHJpb3JpdHk6IG51bWJlcixcbiAgICBvcHRpb25zOiBTdHJhdGVneU9wdGlvbnMsXG4gICAgbWFuYWdlcj86IFRyYW5zcG9ydE1hbmFnZXJcbiAgKSB7XG4gICAgdmFyIHRyYW5zcG9ydCA9IGRlZmluZVRyYW5zcG9ydChcbiAgICAgIGNvbmZpZyxcbiAgICAgIG5hbWUsXG4gICAgICB0eXBlLFxuICAgICAgcHJpb3JpdHksXG4gICAgICBvcHRpb25zLFxuICAgICAgbWFuYWdlclxuICAgICk7XG5cbiAgICBkZWZpbmVkVHJhbnNwb3J0c1tuYW1lXSA9IHRyYW5zcG9ydDtcblxuICAgIHJldHVybiB0cmFuc3BvcnQ7XG4gIH1cblxuICB2YXIgd3Nfb3B0aW9uczogU3RyYXRlZ3lPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgYmFzZU9wdGlvbnMsIHtcbiAgICBob3N0Tm9uVExTOiBjb25maWcud3NIb3N0ICsgJzonICsgY29uZmlnLndzUG9ydCxcbiAgICBob3N0VExTOiBjb25maWcud3NIb3N0ICsgJzonICsgY29uZmlnLndzc1BvcnQsXG4gICAgaHR0cFBhdGg6IGNvbmZpZy53c1BhdGhcbiAgfSk7XG4gIHZhciB3c3Nfb3B0aW9uczogU3RyYXRlZ3lPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgd3Nfb3B0aW9ucywge1xuICAgIHVzZVRMUzogdHJ1ZVxuICB9KTtcbiAgdmFyIHNvY2tqc19vcHRpb25zOiBTdHJhdGVneU9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBiYXNlT3B0aW9ucywge1xuICAgIGhvc3ROb25UTFM6IGNvbmZpZy5odHRwSG9zdCArICc6JyArIGNvbmZpZy5odHRwUG9ydCxcbiAgICBob3N0VExTOiBjb25maWcuaHR0cEhvc3QgKyAnOicgKyBjb25maWcuaHR0cHNQb3J0LFxuICAgIGh0dHBQYXRoOiBjb25maWcuaHR0cFBhdGhcbiAgfSk7XG5cbiAgdmFyIHRpbWVvdXRzID0ge1xuICAgIGxvb3A6IHRydWUsXG4gICAgdGltZW91dDogMTUwMDAsXG4gICAgdGltZW91dExpbWl0OiA2MDAwMFxuICB9O1xuXG4gIHZhciB3c19tYW5hZ2VyID0gbmV3IFRyYW5zcG9ydE1hbmFnZXIoe1xuICAgIGxpdmVzOiAyLFxuICAgIG1pblBpbmdEZWxheTogMTAwMDAsXG4gICAgbWF4UGluZ0RlbGF5OiBjb25maWcuYWN0aXZpdHlUaW1lb3V0XG4gIH0pO1xuICB2YXIgc3RyZWFtaW5nX21hbmFnZXIgPSBuZXcgVHJhbnNwb3J0TWFuYWdlcih7XG4gICAgbGl2ZXM6IDIsXG4gICAgbWluUGluZ0RlbGF5OiAxMDAwMCxcbiAgICBtYXhQaW5nRGVsYXk6IGNvbmZpZy5hY3Rpdml0eVRpbWVvdXRcbiAgfSk7XG5cbiAgdmFyIHdzX3RyYW5zcG9ydCA9IGRlZmluZVRyYW5zcG9ydFN0cmF0ZWd5KFxuICAgICd3cycsXG4gICAgJ3dzJyxcbiAgICAzLFxuICAgIHdzX29wdGlvbnMsXG4gICAgd3NfbWFuYWdlclxuICApO1xuICB2YXIgd3NzX3RyYW5zcG9ydCA9IGRlZmluZVRyYW5zcG9ydFN0cmF0ZWd5KFxuICAgICd3c3MnLFxuICAgICd3cycsXG4gICAgMyxcbiAgICB3c3Nfb3B0aW9ucyxcbiAgICB3c19tYW5hZ2VyXG4gICk7XG4gIHZhciBzb2NranNfdHJhbnNwb3J0ID0gZGVmaW5lVHJhbnNwb3J0U3RyYXRlZ3koXG4gICAgJ3NvY2tqcycsXG4gICAgJ3NvY2tqcycsXG4gICAgMSxcbiAgICBzb2NranNfb3B0aW9uc1xuICApO1xuICB2YXIgeGhyX3N0cmVhbWluZ190cmFuc3BvcnQgPSBkZWZpbmVUcmFuc3BvcnRTdHJhdGVneShcbiAgICAneGhyX3N0cmVhbWluZycsXG4gICAgJ3hocl9zdHJlYW1pbmcnLFxuICAgIDEsXG4gICAgc29ja2pzX29wdGlvbnMsXG4gICAgc3RyZWFtaW5nX21hbmFnZXJcbiAgKTtcbiAgdmFyIHhkcl9zdHJlYW1pbmdfdHJhbnNwb3J0ID0gZGVmaW5lVHJhbnNwb3J0U3RyYXRlZ3koXG4gICAgJ3hkcl9zdHJlYW1pbmcnLFxuICAgICd4ZHJfc3RyZWFtaW5nJyxcbiAgICAxLFxuICAgIHNvY2tqc19vcHRpb25zLFxuICAgIHN0cmVhbWluZ19tYW5hZ2VyXG4gICk7XG4gIHZhciB4aHJfcG9sbGluZ190cmFuc3BvcnQgPSBkZWZpbmVUcmFuc3BvcnRTdHJhdGVneShcbiAgICAneGhyX3BvbGxpbmcnLFxuICAgICd4aHJfcG9sbGluZycsXG4gICAgMSxcbiAgICBzb2NranNfb3B0aW9uc1xuICApO1xuICB2YXIgeGRyX3BvbGxpbmdfdHJhbnNwb3J0ID0gZGVmaW5lVHJhbnNwb3J0U3RyYXRlZ3koXG4gICAgJ3hkcl9wb2xsaW5nJyxcbiAgICAneGRyX3BvbGxpbmcnLFxuICAgIDEsXG4gICAgc29ja2pzX29wdGlvbnNcbiAgKTtcblxuICB2YXIgd3NfbG9vcCA9IG5ldyBTZXF1ZW50aWFsU3RyYXRlZ3koW3dzX3RyYW5zcG9ydF0sIHRpbWVvdXRzKTtcbiAgdmFyIHdzc19sb29wID0gbmV3IFNlcXVlbnRpYWxTdHJhdGVneShbd3NzX3RyYW5zcG9ydF0sIHRpbWVvdXRzKTtcbiAgdmFyIHNvY2tqc19sb29wID0gbmV3IFNlcXVlbnRpYWxTdHJhdGVneShbc29ja2pzX3RyYW5zcG9ydF0sIHRpbWVvdXRzKTtcbiAgdmFyIHN0cmVhbWluZ19sb29wID0gbmV3IFNlcXVlbnRpYWxTdHJhdGVneShcbiAgICBbXG4gICAgICBuZXcgSWZTdHJhdGVneShcbiAgICAgICAgdGVzdFN1cHBvcnRzU3RyYXRlZ3koeGhyX3N0cmVhbWluZ190cmFuc3BvcnQpLFxuICAgICAgICB4aHJfc3RyZWFtaW5nX3RyYW5zcG9ydCxcbiAgICAgICAgeGRyX3N0cmVhbWluZ190cmFuc3BvcnRcbiAgICAgIClcbiAgICBdLFxuICAgIHRpbWVvdXRzXG4gICk7XG4gIHZhciBwb2xsaW5nX2xvb3AgPSBuZXcgU2VxdWVudGlhbFN0cmF0ZWd5KFxuICAgIFtcbiAgICAgIG5ldyBJZlN0cmF0ZWd5KFxuICAgICAgICB0ZXN0U3VwcG9ydHNTdHJhdGVneSh4aHJfcG9sbGluZ190cmFuc3BvcnQpLFxuICAgICAgICB4aHJfcG9sbGluZ190cmFuc3BvcnQsXG4gICAgICAgIHhkcl9wb2xsaW5nX3RyYW5zcG9ydFxuICAgICAgKVxuICAgIF0sXG4gICAgdGltZW91dHNcbiAgKTtcblxuICB2YXIgaHR0cF9sb29wID0gbmV3IFNlcXVlbnRpYWxTdHJhdGVneShcbiAgICBbXG4gICAgICBuZXcgSWZTdHJhdGVneShcbiAgICAgICAgdGVzdFN1cHBvcnRzU3RyYXRlZ3koc3RyZWFtaW5nX2xvb3ApLFxuICAgICAgICBuZXcgQmVzdENvbm5lY3RlZEV2ZXJTdHJhdGVneShbXG4gICAgICAgICAgc3RyZWFtaW5nX2xvb3AsXG4gICAgICAgICAgbmV3IERlbGF5ZWRTdHJhdGVneShwb2xsaW5nX2xvb3AsIHsgZGVsYXk6IDQwMDAgfSlcbiAgICAgICAgXSksXG4gICAgICAgIHBvbGxpbmdfbG9vcFxuICAgICAgKVxuICAgIF0sXG4gICAgdGltZW91dHNcbiAgKTtcblxuICB2YXIgaHR0cF9mYWxsYmFja19sb29wID0gbmV3IElmU3RyYXRlZ3koXG4gICAgdGVzdFN1cHBvcnRzU3RyYXRlZ3koaHR0cF9sb29wKSxcbiAgICBodHRwX2xvb3AsXG4gICAgc29ja2pzX2xvb3BcbiAgKTtcblxuICB2YXIgd3NTdHJhdGVneTtcbiAgaWYgKGJhc2VPcHRpb25zLnVzZVRMUykge1xuICAgIHdzU3RyYXRlZ3kgPSBuZXcgQmVzdENvbm5lY3RlZEV2ZXJTdHJhdGVneShbXG4gICAgICB3c19sb29wLFxuICAgICAgbmV3IERlbGF5ZWRTdHJhdGVneShodHRwX2ZhbGxiYWNrX2xvb3AsIHsgZGVsYXk6IDIwMDAgfSlcbiAgICBdKTtcbiAgfSBlbHNlIHtcbiAgICB3c1N0cmF0ZWd5ID0gbmV3IEJlc3RDb25uZWN0ZWRFdmVyU3RyYXRlZ3koW1xuICAgICAgd3NfbG9vcCxcbiAgICAgIG5ldyBEZWxheWVkU3RyYXRlZ3kod3NzX2xvb3AsIHsgZGVsYXk6IDIwMDAgfSksXG4gICAgICBuZXcgRGVsYXllZFN0cmF0ZWd5KGh0dHBfZmFsbGJhY2tfbG9vcCwgeyBkZWxheTogNTAwMCB9KVxuICAgIF0pO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBDYWNoZWRTdHJhdGVneShcbiAgICBuZXcgRmlyc3RDb25uZWN0ZWRTdHJhdGVneShcbiAgICAgIG5ldyBJZlN0cmF0ZWd5KFxuICAgICAgICB0ZXN0U3VwcG9ydHNTdHJhdGVneSh3c190cmFuc3BvcnQpLFxuICAgICAgICB3c1N0cmF0ZWd5LFxuICAgICAgICBodHRwX2ZhbGxiYWNrX2xvb3BcbiAgICAgIClcbiAgICApLFxuICAgIGRlZmluZWRUcmFuc3BvcnRzLFxuICAgIHtcbiAgICAgIHR0bDogMTgwMDAwMCxcbiAgICAgIHRpbWVsaW5lOiBiYXNlT3B0aW9ucy50aW1lbGluZSxcbiAgICAgIHVzZVRMUzogYmFzZU9wdGlvbnMudXNlVExTXG4gICAgfVxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGVmYXVsdFN0cmF0ZWd5O1xuIiwgImltcG9ydCB7IERlcGVuZGVuY2llcyB9IGZyb20gJy4uL2RvbS9kZXBlbmRlbmNpZXMnO1xuXG4vKiogSW5pdGlhbGl6ZXMgdGhlIHRyYW5zcG9ydC5cbiAqXG4gKiBGZXRjaGVzIHJlc291cmNlcyBpZiBuZWVkZWQgYW5kIHRoZW4gdHJhbnNpdGlvbnMgdG8gaW5pdGlhbGl6ZWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi50aW1lbGluZS5pbmZvKFxuICAgIHNlbGYuYnVpbGRUaW1lbGluZU1lc3NhZ2Uoe1xuICAgICAgdHJhbnNwb3J0OiBzZWxmLm5hbWUgKyAoc2VsZi5vcHRpb25zLnVzZVRMUyA/ICdzJyA6ICcnKVxuICAgIH0pXG4gICk7XG5cbiAgaWYgKHNlbGYuaG9va3MuaXNJbml0aWFsaXplZCgpKSB7XG4gICAgc2VsZi5jaGFuZ2VTdGF0ZSgnaW5pdGlhbGl6ZWQnKTtcbiAgfSBlbHNlIGlmIChzZWxmLmhvb2tzLmZpbGUpIHtcbiAgICBzZWxmLmNoYW5nZVN0YXRlKCdpbml0aWFsaXppbmcnKTtcbiAgICBEZXBlbmRlbmNpZXMubG9hZChcbiAgICAgIHNlbGYuaG9va3MuZmlsZSxcbiAgICAgIHsgdXNlVExTOiBzZWxmLm9wdGlvbnMudXNlVExTIH0sXG4gICAgICBmdW5jdGlvbihlcnJvciwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHNlbGYuaG9va3MuaXNJbml0aWFsaXplZCgpKSB7XG4gICAgICAgICAgc2VsZi5jaGFuZ2VTdGF0ZSgnaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgICBjYWxsYmFjayh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHNlbGYub25FcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYub25DbG9zZSgpO1xuICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5vbkNsb3NlKCk7XG4gIH1cbn1cbiIsICJpbXBvcnQgSFRUUFJlcXVlc3QgZnJvbSAnY29yZS9odHRwL2h0dHBfcmVxdWVzdCc7XG5pbXBvcnQgUmVxdWVzdEhvb2tzIGZyb20gJ2NvcmUvaHR0cC9yZXF1ZXN0X2hvb2tzJztcbmltcG9ydCBBamF4IGZyb20gJ2NvcmUvaHR0cC9hamF4JztcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICdjb3JlL2Vycm9ycyc7XG5cbnZhciBob29rczogUmVxdWVzdEhvb2tzID0ge1xuICBnZXRSZXF1ZXN0OiBmdW5jdGlvbihzb2NrZXQ6IEhUVFBSZXF1ZXN0KTogQWpheCB7XG4gICAgdmFyIHhkciA9IG5ldyAoPGFueT53aW5kb3cpLlhEb21haW5SZXF1ZXN0KCk7XG4gICAgeGRyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgc29ja2V0LmVtaXQoJ2Vycm9yJywgbmV3IEVycm9ycy5SZXF1ZXN0VGltZWRPdXQoKSk7XG4gICAgICBzb2NrZXQuY2xvc2UoKTtcbiAgICB9O1xuICAgIHhkci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xuICAgICAgc29ja2V0LmVtaXQoJ2Vycm9yJywgZSk7XG4gICAgICBzb2NrZXQuY2xvc2UoKTtcbiAgICB9O1xuICAgIHhkci5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoeGRyLnJlc3BvbnNlVGV4dCAmJiB4ZHIucmVzcG9uc2VUZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgc29ja2V0Lm9uQ2h1bmsoMjAwLCB4ZHIucmVzcG9uc2VUZXh0KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHhkci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh4ZHIucmVzcG9uc2VUZXh0ICYmIHhkci5yZXNwb25zZVRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICBzb2NrZXQub25DaHVuaygyMDAsIHhkci5yZXNwb25zZVRleHQpO1xuICAgICAgfVxuICAgICAgc29ja2V0LmVtaXQoJ2ZpbmlzaGVkJywgMjAwKTtcbiAgICAgIHNvY2tldC5jbG9zZSgpO1xuICAgIH07XG4gICAgcmV0dXJuIHhkcjtcbiAgfSxcbiAgYWJvcnRSZXF1ZXN0OiBmdW5jdGlvbih4ZHI6IEFqYXgpIHtcbiAgICB4ZHIub250aW1lb3V0ID0geGRyLm9uZXJyb3IgPSB4ZHIub25wcm9ncmVzcyA9IHhkci5vbmxvYWQgPSBudWxsO1xuICAgIHhkci5hYm9ydCgpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBob29rcztcbiIsICJpbXBvcnQgUnVudGltZSBmcm9tICdydW50aW1lJztcbmltcG9ydCBSZXF1ZXN0SG9va3MgZnJvbSAnLi9yZXF1ZXN0X2hvb2tzJztcbmltcG9ydCBBamF4IGZyb20gJy4vYWpheCc7XG5pbXBvcnQgeyBkZWZhdWx0IGFzIEV2ZW50c0Rpc3BhdGNoZXIgfSBmcm9tICcuLi9ldmVudHMvZGlzcGF0Y2hlcic7XG5cbmNvbnN0IE1BWF9CVUZGRVJfTEVOR1RIID0gMjU2ICogMTAyNDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSFRUUFJlcXVlc3QgZXh0ZW5kcyBFdmVudHNEaXNwYXRjaGVyIHtcbiAgaG9va3M6IFJlcXVlc3RIb29rcztcbiAgbWV0aG9kOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICBwb3NpdGlvbjogbnVtYmVyO1xuICB4aHI6IEFqYXg7XG4gIHVubG9hZGVyOiBGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihob29rczogUmVxdWVzdEhvb2tzLCBtZXRob2Q6IHN0cmluZywgdXJsOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuaG9va3MgPSBob29rcztcbiAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgICB0aGlzLnVybCA9IHVybDtcbiAgfVxuXG4gIHN0YXJ0KHBheWxvYWQ/OiBhbnkpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gMDtcbiAgICB0aGlzLnhociA9IHRoaXMuaG9va3MuZ2V0UmVxdWVzdCh0aGlzKTtcblxuICAgIHRoaXMudW5sb2FkZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfTtcbiAgICBSdW50aW1lLmFkZFVubG9hZExpc3RlbmVyKHRoaXMudW5sb2FkZXIpO1xuXG4gICAgdGhpcy54aHIub3Blbih0aGlzLm1ldGhvZCwgdGhpcy51cmwsIHRydWUpO1xuXG4gICAgaWYgKHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIpIHtcbiAgICAgIHRoaXMueGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7IC8vIFJlYWN0TmF0aXZlIGRvZXNuJ3Qgc2V0IHRoaXMgaGVhZGVyIGJ5IGRlZmF1bHQuXG4gICAgfVxuICAgIHRoaXMueGhyLnNlbmQocGF5bG9hZCk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBpZiAodGhpcy51bmxvYWRlcikge1xuICAgICAgUnVudGltZS5yZW1vdmVVbmxvYWRMaXN0ZW5lcih0aGlzLnVubG9hZGVyKTtcbiAgICAgIHRoaXMudW5sb2FkZXIgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy54aHIpIHtcbiAgICAgIHRoaXMuaG9va3MuYWJvcnRSZXF1ZXN0KHRoaXMueGhyKTtcbiAgICAgIHRoaXMueGhyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBvbkNodW5rKHN0YXR1czogbnVtYmVyLCBkYXRhOiBhbnkpIHtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIGNodW5rID0gdGhpcy5hZHZhbmNlQnVmZmVyKGRhdGEpO1xuICAgICAgaWYgKGNodW5rKSB7XG4gICAgICAgIHRoaXMuZW1pdCgnY2h1bmsnLCB7IHN0YXR1czogc3RhdHVzLCBkYXRhOiBjaHVuayB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5pc0J1ZmZlclRvb0xvbmcoZGF0YSkpIHtcbiAgICAgIHRoaXMuZW1pdCgnYnVmZmVyX3Rvb19sb25nJyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhZHZhbmNlQnVmZmVyKGJ1ZmZlcjogYW55W10pOiBhbnkge1xuICAgIHZhciB1bnJlYWREYXRhID0gYnVmZmVyLnNsaWNlKHRoaXMucG9zaXRpb24pO1xuICAgIHZhciBlbmRPZkxpbmVQb3NpdGlvbiA9IHVucmVhZERhdGEuaW5kZXhPZignXFxuJyk7XG5cbiAgICBpZiAoZW5kT2ZMaW5lUG9zaXRpb24gIT09IC0xKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uICs9IGVuZE9mTGluZVBvc2l0aW9uICsgMTtcbiAgICAgIHJldHVybiB1bnJlYWREYXRhLnNsaWNlKDAsIGVuZE9mTGluZVBvc2l0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2h1bmsgaXMgbm90IGZpbmlzaGVkIHlldCwgZG9uJ3QgbW92ZSB0aGUgYnVmZmVyIHBvaW50ZXJcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNCdWZmZXJUb29Mb25nKGJ1ZmZlcjogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24gPT09IGJ1ZmZlci5sZW5ndGggJiYgYnVmZmVyLmxlbmd0aCA+IE1BWF9CVUZGRVJfTEVOR1RIO1xuICB9XG59XG4iLCAiZW51bSBTdGF0ZSB7XG4gIENPTk5FQ1RJTkcgPSAwLFxuICBPUEVOID0gMSxcbiAgQ0xPU0VEID0gM1xufVxuXG5leHBvcnQgZGVmYXVsdCBTdGF0ZTtcbiIsICJpbXBvcnQgVVJMTG9jYXRpb24gZnJvbSAnLi91cmxfbG9jYXRpb24nO1xuaW1wb3J0IFN0YXRlIGZyb20gJy4vc3RhdGUnO1xuaW1wb3J0IFNvY2tldCBmcm9tICcuLi9zb2NrZXQnO1xuaW1wb3J0IFNvY2tldEhvb2tzIGZyb20gJy4vc29ja2V0X2hvb2tzJztcbmltcG9ydCBVdGlsIGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IEFqYXggZnJvbSAnLi9hamF4JztcbmltcG9ydCBIVFRQUmVxdWVzdCBmcm9tICcuL2h0dHBfcmVxdWVzdCc7XG5pbXBvcnQgUnVudGltZSBmcm9tICdydW50aW1lJztcblxudmFyIGF1dG9JbmNyZW1lbnQgPSAxO1xuXG5jbGFzcyBIVFRQU29ja2V0IGltcGxlbWVudHMgU29ja2V0IHtcbiAgaG9va3M6IFNvY2tldEhvb2tzO1xuICBzZXNzaW9uOiBzdHJpbmc7XG4gIGxvY2F0aW9uOiBVUkxMb2NhdGlvbjtcbiAgcmVhZHlTdGF0ZTogU3RhdGU7XG4gIHN0cmVhbTogSFRUUFJlcXVlc3Q7XG5cbiAgb25vcGVuOiAoKSA9PiB2b2lkO1xuICBvbmVycm9yOiAoZXJyb3I6IGFueSkgPT4gdm9pZDtcbiAgb25jbG9zZTogKGNsb3NlRXZlbnQ6IGFueSkgPT4gdm9pZDtcbiAgb25tZXNzYWdlOiAobWVzc2FnZTogYW55KSA9PiB2b2lkO1xuICBvbmFjdGl2aXR5OiAoKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKGhvb2tzOiBTb2NrZXRIb29rcywgdXJsOiBzdHJpbmcpIHtcbiAgICB0aGlzLmhvb2tzID0gaG9va3M7XG4gICAgdGhpcy5zZXNzaW9uID0gcmFuZG9tTnVtYmVyKDEwMDApICsgJy8nICsgcmFuZG9tU3RyaW5nKDgpO1xuICAgIHRoaXMubG9jYXRpb24gPSBnZXRMb2NhdGlvbih1cmwpO1xuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFN0YXRlLkNPTk5FQ1RJTkc7XG4gICAgdGhpcy5vcGVuU3RyZWFtKCk7XG4gIH1cblxuICBzZW5kKHBheWxvYWQ6IGFueSkge1xuICAgIHJldHVybiB0aGlzLnNlbmRSYXcoSlNPTi5zdHJpbmdpZnkoW3BheWxvYWRdKSk7XG4gIH1cblxuICBwaW5nKCkge1xuICAgIHRoaXMuaG9va3Muc2VuZEhlYXJ0YmVhdCh0aGlzKTtcbiAgfVxuXG4gIGNsb3NlKGNvZGU6IGFueSwgcmVhc29uOiBhbnkpIHtcbiAgICB0aGlzLm9uQ2xvc2UoY29kZSwgcmVhc29uLCB0cnVlKTtcbiAgfVxuXG4gIC8qKiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkgKi9cbiAgc2VuZFJhdyhwYXlsb2FkOiBhbnkpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSBTdGF0ZS5PUEVOKSB7XG4gICAgICB0cnkge1xuICAgICAgICBSdW50aW1lLmNyZWF0ZVNvY2tldFJlcXVlc3QoXG4gICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgIGdldFVuaXF1ZVVSTChnZXRTZW5kVVJMKHRoaXMubG9jYXRpb24sIHRoaXMuc2Vzc2lvbikpXG4gICAgICAgICkuc3RhcnQocGF5bG9hZCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKiogRm9yIGludGVybmFsIHVzZSBvbmx5ICovXG4gIHJlY29ubmVjdCgpIHtcbiAgICB0aGlzLmNsb3NlU3RyZWFtKCk7XG4gICAgdGhpcy5vcGVuU3RyZWFtKCk7XG4gIH1cblxuICAvKiogRm9yIGludGVybmFsIHVzZSBvbmx5ICovXG4gIG9uQ2xvc2UoY29kZSwgcmVhc29uLCB3YXNDbGVhbikge1xuICAgIHRoaXMuY2xvc2VTdHJlYW0oKTtcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTdGF0ZS5DTE9TRUQ7XG4gICAgaWYgKHRoaXMub25jbG9zZSkge1xuICAgICAgdGhpcy5vbmNsb3NlKHtcbiAgICAgICAgY29kZTogY29kZSxcbiAgICAgICAgcmVhc29uOiByZWFzb24sXG4gICAgICAgIHdhc0NsZWFuOiB3YXNDbGVhblxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbkNodW5rKGNodW5rKSB7XG4gICAgaWYgKGNodW5rLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IFN0YXRlLk9QRU4pIHtcbiAgICAgIHRoaXMub25BY3Rpdml0eSgpO1xuICAgIH1cblxuICAgIHZhciBwYXlsb2FkO1xuICAgIHZhciB0eXBlID0gY2h1bmsuZGF0YS5zbGljZSgwLCAxKTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ28nOlxuICAgICAgICBwYXlsb2FkID0gSlNPTi5wYXJzZShjaHVuay5kYXRhLnNsaWNlKDEpIHx8ICd7fScpO1xuICAgICAgICB0aGlzLm9uT3BlbihwYXlsb2FkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhJzpcbiAgICAgICAgcGF5bG9hZCA9IEpTT04ucGFyc2UoY2h1bmsuZGF0YS5zbGljZSgxKSB8fCAnW10nKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXlsb2FkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5vbkV2ZW50KHBheWxvYWRbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbSc6XG4gICAgICAgIHBheWxvYWQgPSBKU09OLnBhcnNlKGNodW5rLmRhdGEuc2xpY2UoMSkgfHwgJ251bGwnKTtcbiAgICAgICAgdGhpcy5vbkV2ZW50KHBheWxvYWQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2gnOlxuICAgICAgICB0aGlzLmhvb2tzLm9uSGVhcnRiZWF0KHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2MnOlxuICAgICAgICBwYXlsb2FkID0gSlNPTi5wYXJzZShjaHVuay5kYXRhLnNsaWNlKDEpIHx8ICdbXScpO1xuICAgICAgICB0aGlzLm9uQ2xvc2UocGF5bG9hZFswXSwgcGF5bG9hZFsxXSwgdHJ1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25PcGVuKG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSBTdGF0ZS5DT05ORUNUSU5HKSB7XG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmhvc3RuYW1lKSB7XG4gICAgICAgIHRoaXMubG9jYXRpb24uYmFzZSA9IHJlcGxhY2VIb3N0KHRoaXMubG9jYXRpb24uYmFzZSwgb3B0aW9ucy5ob3N0bmFtZSk7XG4gICAgICB9XG4gICAgICB0aGlzLnJlYWR5U3RhdGUgPSBTdGF0ZS5PUEVOO1xuXG4gICAgICBpZiAodGhpcy5vbm9wZW4pIHtcbiAgICAgICAgdGhpcy5vbm9wZW4oKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbkNsb3NlKDEwMDYsICdTZXJ2ZXIgbG9zdCBzZXNzaW9uJywgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbkV2ZW50KGV2ZW50KSB7XG4gICAgaWYgKHRoaXMucmVhZHlTdGF0ZSA9PT0gU3RhdGUuT1BFTiAmJiB0aGlzLm9ubWVzc2FnZSkge1xuICAgICAgdGhpcy5vbm1lc3NhZ2UoeyBkYXRhOiBldmVudCB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uQWN0aXZpdHkoKSB7XG4gICAgaWYgKHRoaXMub25hY3Rpdml0eSkge1xuICAgICAgdGhpcy5vbmFjdGl2aXR5KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbkVycm9yKGVycm9yKSB7XG4gICAgaWYgKHRoaXMub25lcnJvcikge1xuICAgICAgdGhpcy5vbmVycm9yKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9wZW5TdHJlYW0oKSB7XG4gICAgdGhpcy5zdHJlYW0gPSBSdW50aW1lLmNyZWF0ZVNvY2tldFJlcXVlc3QoXG4gICAgICAnUE9TVCcsXG4gICAgICBnZXRVbmlxdWVVUkwodGhpcy5ob29rcy5nZXRSZWNlaXZlVVJMKHRoaXMubG9jYXRpb24sIHRoaXMuc2Vzc2lvbikpXG4gICAgKTtcblxuICAgIHRoaXMuc3RyZWFtLmJpbmQoJ2NodW5rJywgY2h1bmsgPT4ge1xuICAgICAgdGhpcy5vbkNodW5rKGNodW5rKTtcbiAgICB9KTtcbiAgICB0aGlzLnN0cmVhbS5iaW5kKCdmaW5pc2hlZCcsIHN0YXR1cyA9PiB7XG4gICAgICB0aGlzLmhvb2tzLm9uRmluaXNoZWQodGhpcywgc3RhdHVzKTtcbiAgICB9KTtcbiAgICB0aGlzLnN0cmVhbS5iaW5kKCdidWZmZXJfdG9vX2xvbmcnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlY29ubmVjdCgpO1xuICAgIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc3RyZWFtLnN0YXJ0KCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIFV0aWwuZGVmZXIoKCkgPT4ge1xuICAgICAgICB0aGlzLm9uRXJyb3IoZXJyb3IpO1xuICAgICAgICB0aGlzLm9uQ2xvc2UoMTAwNiwgJ0NvdWxkIG5vdCBzdGFydCBzdHJlYW1pbmcnLCBmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsb3NlU3RyZWFtKCkge1xuICAgIGlmICh0aGlzLnN0cmVhbSkge1xuICAgICAgdGhpcy5zdHJlYW0udW5iaW5kX2FsbCgpO1xuICAgICAgdGhpcy5zdHJlYW0uY2xvc2UoKTtcbiAgICAgIHRoaXMuc3RyZWFtID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0TG9jYXRpb24odXJsKTogVVJMTG9jYXRpb24ge1xuICB2YXIgcGFydHMgPSAvKFteXFw/XSopXFwvKihcXD8/LiopLy5leGVjKHVybCk7XG4gIHJldHVybiB7XG4gICAgYmFzZTogcGFydHNbMV0sXG4gICAgcXVlcnlTdHJpbmc6IHBhcnRzWzJdXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFNlbmRVUkwodXJsOiBVUkxMb2NhdGlvbiwgc2Vzc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHVybC5iYXNlICsgJy8nICsgc2Vzc2lvbiArICcveGhyX3NlbmQnO1xufVxuXG5mdW5jdGlvbiBnZXRVbmlxdWVVUkwodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICB2YXIgc2VwYXJhdG9yID0gdXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJic7XG4gIHJldHVybiB1cmwgKyBzZXBhcmF0b3IgKyAndD0nICsgK25ldyBEYXRlKCkgKyAnJm49JyArIGF1dG9JbmNyZW1lbnQrKztcbn1cblxuZnVuY3Rpb24gcmVwbGFjZUhvc3QodXJsOiBzdHJpbmcsIGhvc3RuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICB2YXIgdXJsUGFydHMgPSAvKGh0dHBzPzpcXC9cXC8pKFteXFwvOl0rKSgoXFwvfDopPy4qKS8uZXhlYyh1cmwpO1xuICByZXR1cm4gdXJsUGFydHNbMV0gKyBob3N0bmFtZSArIHVybFBhcnRzWzNdO1xufVxuXG5mdW5jdGlvbiByYW5kb21OdW1iZXIobWF4OiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gUnVudGltZS5yYW5kb21JbnQobWF4KTtcbn1cblxuZnVuY3Rpb24gcmFuZG9tU3RyaW5nKGxlbmd0aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICByZXN1bHQucHVzaChyYW5kb21OdW1iZXIoMzIpLnRvU3RyaW5nKDMyKSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBIVFRQU29ja2V0O1xuIiwgImltcG9ydCBTb2NrZXRIb29rcyBmcm9tICcuL3NvY2tldF9ob29rcyc7XG5pbXBvcnQgSFRUUFNvY2tldCBmcm9tICcuL2h0dHBfc29ja2V0JztcblxudmFyIGhvb2tzOiBTb2NrZXRIb29rcyA9IHtcbiAgZ2V0UmVjZWl2ZVVSTDogZnVuY3Rpb24odXJsLCBzZXNzaW9uKSB7XG4gICAgcmV0dXJuIHVybC5iYXNlICsgJy8nICsgc2Vzc2lvbiArICcveGhyX3N0cmVhbWluZycgKyB1cmwucXVlcnlTdHJpbmc7XG4gIH0sXG4gIG9uSGVhcnRiZWF0OiBmdW5jdGlvbihzb2NrZXQpIHtcbiAgICBzb2NrZXQuc2VuZFJhdygnW10nKTtcbiAgfSxcbiAgc2VuZEhlYXJ0YmVhdDogZnVuY3Rpb24oc29ja2V0KSB7XG4gICAgc29ja2V0LnNlbmRSYXcoJ1tdJyk7XG4gIH0sXG4gIG9uRmluaXNoZWQ6IGZ1bmN0aW9uKHNvY2tldCwgc3RhdHVzKSB7XG4gICAgc29ja2V0Lm9uQ2xvc2UoMTAwNiwgJ0Nvbm5lY3Rpb24gaW50ZXJydXB0ZWQgKCcgKyBzdGF0dXMgKyAnKScsIGZhbHNlKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgaG9va3M7XG4iLCAiaW1wb3J0IFNvY2tldEhvb2tzIGZyb20gJy4vc29ja2V0X2hvb2tzJztcbmltcG9ydCBVUkxMb2NhdGlvbiBmcm9tICcuL3VybF9sb2NhdGlvbic7XG5pbXBvcnQgSFRUUFNvY2tldCBmcm9tICcuL2h0dHBfc29ja2V0JztcblxudmFyIGhvb2tzOiBTb2NrZXRIb29rcyA9IHtcbiAgZ2V0UmVjZWl2ZVVSTDogZnVuY3Rpb24odXJsOiBVUkxMb2NhdGlvbiwgc2Vzc2lvbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdXJsLmJhc2UgKyAnLycgKyBzZXNzaW9uICsgJy94aHInICsgdXJsLnF1ZXJ5U3RyaW5nO1xuICB9LFxuICBvbkhlYXJ0YmVhdDogZnVuY3Rpb24oKSB7XG4gICAgLy8gbmV4dCBIVFRQIHJlcXVlc3Qgd2lsbCByZXNldCBzZXJ2ZXIncyBhY3Rpdml0eSB0aW1lclxuICB9LFxuICBzZW5kSGVhcnRiZWF0OiBmdW5jdGlvbihzb2NrZXQpIHtcbiAgICBzb2NrZXQuc2VuZFJhdygnW10nKTtcbiAgfSxcbiAgb25GaW5pc2hlZDogZnVuY3Rpb24oc29ja2V0LCBzdGF0dXMpIHtcbiAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcbiAgICAgIHNvY2tldC5yZWNvbm5lY3QoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc29ja2V0Lm9uQ2xvc2UoMTAwNiwgJ0Nvbm5lY3Rpb24gaW50ZXJydXB0ZWQgKCcgKyBzdGF0dXMgKyAnKScsIGZhbHNlKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGhvb2tzO1xuIiwgImltcG9ydCBIVFRQUmVxdWVzdCBmcm9tICdjb3JlL2h0dHAvaHR0cF9yZXF1ZXN0JztcbmltcG9ydCBSZXF1ZXN0SG9va3MgZnJvbSAnY29yZS9odHRwL3JlcXVlc3RfaG9va3MnO1xuaW1wb3J0IEFqYXggZnJvbSAnY29yZS9odHRwL2FqYXgnO1xuaW1wb3J0IFJ1bnRpbWUgZnJvbSAncnVudGltZSc7XG5cbnZhciBob29rczogUmVxdWVzdEhvb2tzID0ge1xuICBnZXRSZXF1ZXN0OiBmdW5jdGlvbihzb2NrZXQ6IEhUVFBSZXF1ZXN0KTogQWpheCB7XG4gICAgdmFyIENvbnN0cnVjdG9yID0gUnVudGltZS5nZXRYSFJBUEkoKTtcbiAgICB2YXIgeGhyID0gbmV3IENvbnN0cnVjdG9yKCk7XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICBzd2l0Y2ggKHhoci5yZWFkeVN0YXRlKSB7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBpZiAoeGhyLnJlc3BvbnNlVGV4dCAmJiB4aHIucmVzcG9uc2VUZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNvY2tldC5vbkNodW5rKHhoci5zdGF0dXMsIHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIC8vIHRoaXMgaGFwcGVucyBvbmx5IG9uIGVycm9ycywgbmV2ZXIgYWZ0ZXIgY2FsbGluZyBjbG9zZVxuICAgICAgICAgIGlmICh4aHIucmVzcG9uc2VUZXh0ICYmIHhoci5yZXNwb25zZVRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc29ja2V0Lm9uQ2h1bmsoeGhyLnN0YXR1cywgeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNvY2tldC5lbWl0KCdmaW5pc2hlZCcsIHhoci5zdGF0dXMpO1xuICAgICAgICAgIHNvY2tldC5jbG9zZSgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHhocjtcbiAgfSxcbiAgYWJvcnRSZXF1ZXN0OiBmdW5jdGlvbih4aHI6IEFqYXgpIHtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICB4aHIuYWJvcnQoKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgaG9va3M7XG4iLCAiaW1wb3J0IEhUVFBSZXF1ZXN0IGZyb20gJ2NvcmUvaHR0cC9odHRwX3JlcXVlc3QnO1xuaW1wb3J0IEhUVFBTb2NrZXQgZnJvbSAnY29yZS9odHRwL2h0dHBfc29ja2V0JztcbmltcG9ydCBTb2NrZXRIb29rcyBmcm9tICdjb3JlL2h0dHAvc29ja2V0X2hvb2tzJztcbmltcG9ydCBSZXF1ZXN0SG9va3MgZnJvbSAnY29yZS9odHRwL3JlcXVlc3RfaG9va3MnO1xuaW1wb3J0IHN0cmVhbWluZ0hvb2tzIGZyb20gJ2NvcmUvaHR0cC9odHRwX3N0cmVhbWluZ19zb2NrZXQnO1xuaW1wb3J0IHBvbGxpbmdIb29rcyBmcm9tICdjb3JlL2h0dHAvaHR0cF9wb2xsaW5nX3NvY2tldCc7XG5pbXBvcnQgeGhySG9va3MgZnJvbSAnLi9odHRwX3hocl9yZXF1ZXN0JztcbmltcG9ydCBIVFRQRmFjdG9yeSBmcm9tICdjb3JlL2h0dHAvaHR0cF9mYWN0b3J5JztcblxudmFyIEhUVFA6IEhUVFBGYWN0b3J5ID0ge1xuICBjcmVhdGVTdHJlYW1pbmdTb2NrZXQodXJsOiBzdHJpbmcpOiBIVFRQU29ja2V0IHtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVTb2NrZXQoc3RyZWFtaW5nSG9va3MsIHVybCk7XG4gIH0sXG5cbiAgY3JlYXRlUG9sbGluZ1NvY2tldCh1cmw6IHN0cmluZyk6IEhUVFBTb2NrZXQge1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZVNvY2tldChwb2xsaW5nSG9va3MsIHVybCk7XG4gIH0sXG5cbiAgY3JlYXRlU29ja2V0KGhvb2tzOiBTb2NrZXRIb29rcywgdXJsOiBzdHJpbmcpOiBIVFRQU29ja2V0IHtcbiAgICByZXR1cm4gbmV3IEhUVFBTb2NrZXQoaG9va3MsIHVybCk7XG4gIH0sXG5cbiAgY3JlYXRlWEhSKG1ldGhvZDogc3RyaW5nLCB1cmw6IHN0cmluZyk6IEhUVFBSZXF1ZXN0IHtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGVSZXF1ZXN0KHhockhvb2tzLCBtZXRob2QsIHVybCk7XG4gIH0sXG5cbiAgY3JlYXRlUmVxdWVzdChob29rczogUmVxdWVzdEhvb2tzLCBtZXRob2Q6IHN0cmluZywgdXJsOiBzdHJpbmcpOiBIVFRQUmVxdWVzdCB7XG4gICAgcmV0dXJuIG5ldyBIVFRQUmVxdWVzdChob29rcywgbWV0aG9kLCB1cmwpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBIVFRQO1xuIiwgImltcG9ydCB4ZHJIb29rcyBmcm9tICcuL2h0dHBfeGRvbWFpbl9yZXF1ZXN0JztcbmltcG9ydCBIVFRQIGZyb20gJ2lzb21vcnBoaWMvaHR0cC9odHRwJztcblxuSFRUUC5jcmVhdGVYRFIgPSBmdW5jdGlvbihtZXRob2QsIHVybCkge1xuICByZXR1cm4gdGhpcy5jcmVhdGVSZXF1ZXN0KHhkckhvb2tzLCBtZXRob2QsIHVybCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBIVFRQO1xuIiwgImltcG9ydCBCcm93c2VyIGZyb20gJy4vYnJvd3Nlcic7XG5pbXBvcnQgeyBEZXBlbmRlbmNpZXMsIERlcGVuZGVuY2llc1JlY2VpdmVycyB9IGZyb20gJy4vZG9tL2RlcGVuZGVuY2llcyc7XG5pbXBvcnQgeyBBdXRoVHJhbnNwb3J0LCBBdXRoVHJhbnNwb3J0cyB9IGZyb20gJ2NvcmUvYXV0aC9hdXRoX3RyYW5zcG9ydHMnO1xuaW1wb3J0IHhockF1dGggZnJvbSAnaXNvbW9ycGhpYy9hdXRoL3hocl9hdXRoJztcbmltcG9ydCBqc29ucEF1dGggZnJvbSAnLi9hdXRoL2pzb25wX2F1dGgnO1xuaW1wb3J0IFRpbWVsaW5lVHJhbnNwb3J0IGZyb20gJ2NvcmUvdGltZWxpbmUvdGltZWxpbmVfdHJhbnNwb3J0JztcbmltcG9ydCBUaW1lbGluZVNlbmRlciBmcm9tICdjb3JlL3RpbWVsaW5lL3RpbWVsaW5lX3NlbmRlcic7XG5pbXBvcnQgU2NyaXB0UmVxdWVzdCBmcm9tICcuL2RvbS9zY3JpcHRfcmVxdWVzdCc7XG5pbXBvcnQgSlNPTlBSZXF1ZXN0IGZyb20gJy4vZG9tL2pzb25wX3JlcXVlc3QnO1xuaW1wb3J0ICogYXMgQ29sbGVjdGlvbnMgZnJvbSAnY29yZS91dGlscy9jb2xsZWN0aW9ucyc7XG5pbXBvcnQgeyBTY3JpcHRSZWNlaXZlcnMgfSBmcm9tICcuL2RvbS9zY3JpcHRfcmVjZWl2ZXJfZmFjdG9yeSc7XG5pbXBvcnQganNvbnBUaW1lbGluZSBmcm9tICcuL3RpbWVsaW5lL2pzb25wX3RpbWVsaW5lJztcbmltcG9ydCBUcmFuc3BvcnRzIGZyb20gJy4vdHJhbnNwb3J0cy90cmFuc3BvcnRzJztcbmltcG9ydCBBamF4IGZyb20gJ2NvcmUvaHR0cC9hamF4JztcbmltcG9ydCB7IE5ldHdvcmsgfSBmcm9tICcuL25ldF9pbmZvJztcbmltcG9ydCBnZXREZWZhdWx0U3RyYXRlZ3kgZnJvbSAnLi9kZWZhdWx0X3N0cmF0ZWd5JztcbmltcG9ydCB0cmFuc3BvcnRDb25uZWN0aW9uSW5pdGlhbGl6ZXIgZnJvbSAnLi90cmFuc3BvcnRzL3RyYW5zcG9ydF9jb25uZWN0aW9uX2luaXRpYWxpemVyJztcbmltcG9ydCBIVFRQRmFjdG9yeSBmcm9tICcuL2h0dHAvaHR0cCc7XG5pbXBvcnQgSFRUUFJlcXVlc3QgZnJvbSAnY29yZS9odHRwL2h0dHBfcmVxdWVzdCc7XG5cbnZhciBSdW50aW1lOiBCcm93c2VyID0ge1xuICAvLyBmb3IganNvbnAgYXV0aFxuICBuZXh0QXV0aENhbGxiYWNrSUQ6IDEsXG4gIGF1dGhfY2FsbGJhY2tzOiB7fSxcbiAgU2NyaXB0UmVjZWl2ZXJzLFxuICBEZXBlbmRlbmNpZXNSZWNlaXZlcnMsXG4gIGdldERlZmF1bHRTdHJhdGVneSxcbiAgVHJhbnNwb3J0cyxcbiAgdHJhbnNwb3J0Q29ubmVjdGlvbkluaXRpYWxpemVyLFxuICBIVFRQRmFjdG9yeSxcblxuICBUaW1lbGluZVRyYW5zcG9ydDoganNvbnBUaW1lbGluZSxcblxuICBnZXRYSFJBUEkoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5YTUxIdHRwUmVxdWVzdDtcbiAgfSxcblxuICBnZXRXZWJTb2NrZXRBUEkoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5XZWJTb2NrZXQgfHwgd2luZG93Lk1veldlYlNvY2tldDtcbiAgfSxcblxuICBzZXR1cChQdXNoZXJDbGFzcyk6IHZvaWQge1xuICAgICg8YW55PndpbmRvdykuUHVzaGVyID0gUHVzaGVyQ2xhc3M7IC8vIEpTT05wIHJlcXVpcmVzIFB1c2hlciB0byBiZSBpbiB0aGUgZ2xvYmFsIHNjb3BlLlxuICAgIHZhciBpbml0aWFsaXplT25Eb2N1bWVudEJvZHkgPSAoKSA9PiB7XG4gICAgICB0aGlzLm9uRG9jdW1lbnRCb2R5KFB1c2hlckNsYXNzLnJlYWR5KTtcbiAgICB9O1xuICAgIGlmICghKDxhbnk+d2luZG93KS5KU09OKSB7XG4gICAgICBEZXBlbmRlbmNpZXMubG9hZCgnanNvbjInLCB7fSwgaW5pdGlhbGl6ZU9uRG9jdW1lbnRCb2R5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5pdGlhbGl6ZU9uRG9jdW1lbnRCb2R5KCk7XG4gICAgfVxuICB9LFxuXG4gIGdldERvY3VtZW50KCk6IERvY3VtZW50IHtcbiAgICByZXR1cm4gZG9jdW1lbnQ7XG4gIH0sXG5cbiAgZ2V0UHJvdG9jb2woKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXREb2N1bWVudCgpLmxvY2F0aW9uLnByb3RvY29sO1xuICB9LFxuXG4gIGdldEF1dGhvcml6ZXJzKCk6IEF1dGhUcmFuc3BvcnRzIHtcbiAgICByZXR1cm4geyBhamF4OiB4aHJBdXRoLCBqc29ucDoganNvbnBBdXRoIH07XG4gIH0sXG5cbiAgb25Eb2N1bWVudEJvZHkoY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgaWYgKGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm9uRG9jdW1lbnRCb2R5KGNhbGxiYWNrKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfSxcblxuICBjcmVhdGVKU09OUFJlcXVlc3QodXJsOiBzdHJpbmcsIGRhdGE6IGFueSk6IEpTT05QUmVxdWVzdCB7XG4gICAgcmV0dXJuIG5ldyBKU09OUFJlcXVlc3QodXJsLCBkYXRhKTtcbiAgfSxcblxuICBjcmVhdGVTY3JpcHRSZXF1ZXN0KHNyYzogc3RyaW5nKTogU2NyaXB0UmVxdWVzdCB7XG4gICAgcmV0dXJuIG5ldyBTY3JpcHRSZXF1ZXN0KHNyYyk7XG4gIH0sXG5cbiAgZ2V0TG9jYWxTdG9yYWdlKCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSxcblxuICBjcmVhdGVYSFIoKTogQWpheCB7XG4gICAgaWYgKHRoaXMuZ2V0WEhSQVBJKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU1pY3Jvc29mdFhIUigpO1xuICAgIH1cbiAgfSxcblxuICBjcmVhdGVYTUxIdHRwUmVxdWVzdCgpOiBBamF4IHtcbiAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzLmdldFhIUkFQSSgpO1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoKTtcbiAgfSxcblxuICBjcmVhdGVNaWNyb3NvZnRYSFIoKTogQWpheCB7XG4gICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICB9LFxuXG4gIGdldE5ldHdvcmsoKSB7XG4gICAgcmV0dXJuIE5ldHdvcms7XG4gIH0sXG5cbiAgY3JlYXRlV2ViU29ja2V0KHVybDogc3RyaW5nKTogYW55IHtcbiAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzLmdldFdlYlNvY2tldEFQSSgpO1xuICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IodXJsKTtcbiAgfSxcblxuICBjcmVhdGVTb2NrZXRSZXF1ZXN0KG1ldGhvZDogc3RyaW5nLCB1cmw6IHN0cmluZyk6IEhUVFBSZXF1ZXN0IHtcbiAgICBpZiAodGhpcy5pc1hIUlN1cHBvcnRlZCgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5IVFRQRmFjdG9yeS5jcmVhdGVYSFIobWV0aG9kLCB1cmwpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1hEUlN1cHBvcnRlZCh1cmwuaW5kZXhPZignaHR0cHM6JykgPT09IDApKSB7XG4gICAgICByZXR1cm4gdGhpcy5IVFRQRmFjdG9yeS5jcmVhdGVYRFIobWV0aG9kLCB1cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyAnQ3Jvc3Mtb3JpZ2luIEhUVFAgcmVxdWVzdHMgYXJlIG5vdCBzdXBwb3J0ZWQnO1xuICAgIH1cbiAgfSxcblxuICBpc1hIUlN1cHBvcnRlZCgpOiBib29sZWFuIHtcbiAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzLmdldFhIUkFQSSgpO1xuICAgIHJldHVybiAoXG4gICAgICBCb29sZWFuKENvbnN0cnVjdG9yKSAmJiBuZXcgQ29uc3RydWN0b3IoKS53aXRoQ3JlZGVudGlhbHMgIT09IHVuZGVmaW5lZFxuICAgICk7XG4gIH0sXG5cbiAgaXNYRFJTdXBwb3J0ZWQodXNlVExTPzogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIHZhciBwcm90b2NvbCA9IHVzZVRMUyA/ICdodHRwczonIDogJ2h0dHA6JztcbiAgICB2YXIgZG9jdW1lbnRQcm90b2NvbCA9IHRoaXMuZ2V0UHJvdG9jb2woKTtcbiAgICByZXR1cm4gKFxuICAgICAgQm9vbGVhbig8YW55PndpbmRvd1snWERvbWFpblJlcXVlc3QnXSkgJiYgZG9jdW1lbnRQcm90b2NvbCA9PT0gcHJvdG9jb2xcbiAgICApO1xuICB9LFxuXG4gIGFkZFVubG9hZExpc3RlbmVyKGxpc3RlbmVyOiBhbnkpIHtcbiAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3VubG9hZCcsIGxpc3RlbmVyLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmICh3aW5kb3cuYXR0YWNoRXZlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgd2luZG93LmF0dGFjaEV2ZW50KCdvbnVubG9hZCcsIGxpc3RlbmVyKTtcbiAgICB9XG4gIH0sXG5cbiAgcmVtb3ZlVW5sb2FkTGlzdGVuZXIobGlzdGVuZXI6IGFueSkge1xuICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndW5sb2FkJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5kZXRhY2hFdmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB3aW5kb3cuZGV0YWNoRXZlbnQoJ29udW5sb2FkJywgbGlzdGVuZXIpO1xuICAgIH1cbiAgfSxcblxuICByYW5kb21JbnQobWF4OiBudW1iZXIpOiBudW1iZXIge1xuICAgIC8qKlxuICAgICAqIFJldHVybiB2YWx1ZXMgaW4gdGhlIHJhbmdlIG9mIFswLCAxW1xuICAgICAqL1xuICAgIGNvbnN0IHJhbmRvbSA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY3J5cHRvID0gd2luZG93LmNyeXB0byB8fCB3aW5kb3dbJ21zQ3J5cHRvJ107XG4gICAgICBjb25zdCByYW5kb20gPSBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50MzJBcnJheSgxKSlbMF07XG5cbiAgICAgIHJldHVybiByYW5kb20gLyAyICoqIDMyO1xuICAgIH07XG5cbiAgICByZXR1cm4gTWF0aC5mbG9vcihyYW5kb20oKSAqIG1heCk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJ1bnRpbWU7XG4iLCAiZW51bSBUaW1lbGluZUxldmVsIHtcbiAgRVJST1IgPSAzLFxuICBJTkZPID0gNixcbiAgREVCVUcgPSA3XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVsaW5lTGV2ZWw7XG4iLCAiaW1wb3J0ICogYXMgQ29sbGVjdGlvbnMgZnJvbSAnLi4vdXRpbHMvY29sbGVjdGlvbnMnO1xuaW1wb3J0IFV0aWwgZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQgeyBkZWZhdWx0IGFzIExldmVsIH0gZnJvbSAnLi9sZXZlbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGltZWxpbmVPcHRpb25zIHtcbiAgbGV2ZWw/OiBMZXZlbDtcbiAgbGltaXQ/OiBudW1iZXI7XG4gIHZlcnNpb24/OiBzdHJpbmc7XG4gIGNsdXN0ZXI/OiBzdHJpbmc7XG4gIGZlYXR1cmVzPzogc3RyaW5nW107XG4gIHBhcmFtcz86IGFueTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWxpbmUge1xuICBrZXk6IHN0cmluZztcbiAgc2Vzc2lvbjogbnVtYmVyO1xuICBldmVudHM6IGFueVtdO1xuICBvcHRpb25zOiBUaW1lbGluZU9wdGlvbnM7XG4gIHNlbnQ6IG51bWJlcjtcbiAgdW5pcXVlSUQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihrZXk6IHN0cmluZywgc2Vzc2lvbjogbnVtYmVyLCBvcHRpb25zOiBUaW1lbGluZU9wdGlvbnMpIHtcbiAgICB0aGlzLmtleSA9IGtleTtcbiAgICB0aGlzLnNlc3Npb24gPSBzZXNzaW9uO1xuICAgIHRoaXMuZXZlbnRzID0gW107XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnNlbnQgPSAwO1xuICAgIHRoaXMudW5pcXVlSUQgPSAwO1xuICB9XG5cbiAgbG9nKGxldmVsLCBldmVudCkge1xuICAgIGlmIChsZXZlbCA8PSB0aGlzLm9wdGlvbnMubGV2ZWwpIHtcbiAgICAgIHRoaXMuZXZlbnRzLnB1c2goXG4gICAgICAgIENvbGxlY3Rpb25zLmV4dGVuZCh7fSwgZXZlbnQsIHsgdGltZXN0YW1wOiBVdGlsLm5vdygpIH0pXG4gICAgICApO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5saW1pdCAmJiB0aGlzLmV2ZW50cy5sZW5ndGggPiB0aGlzLm9wdGlvbnMubGltaXQpIHtcbiAgICAgICAgdGhpcy5ldmVudHMuc2hpZnQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBlcnJvcihldmVudCkge1xuICAgIHRoaXMubG9nKExldmVsLkVSUk9SLCBldmVudCk7XG4gIH1cblxuICBpbmZvKGV2ZW50KSB7XG4gICAgdGhpcy5sb2coTGV2ZWwuSU5GTywgZXZlbnQpO1xuICB9XG5cbiAgZGVidWcoZXZlbnQpIHtcbiAgICB0aGlzLmxvZyhMZXZlbC5ERUJVRywgZXZlbnQpO1xuICB9XG5cbiAgaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgc2VuZChzZW5kZm4sIGNhbGxiYWNrKSB7XG4gICAgdmFyIGRhdGEgPSBDb2xsZWN0aW9ucy5leHRlbmQoXG4gICAgICB7XG4gICAgICAgIHNlc3Npb246IHRoaXMuc2Vzc2lvbixcbiAgICAgICAgYnVuZGxlOiB0aGlzLnNlbnQgKyAxLFxuICAgICAgICBrZXk6IHRoaXMua2V5LFxuICAgICAgICBsaWI6ICdqcycsXG4gICAgICAgIHZlcnNpb246IHRoaXMub3B0aW9ucy52ZXJzaW9uLFxuICAgICAgICBjbHVzdGVyOiB0aGlzLm9wdGlvbnMuY2x1c3RlcixcbiAgICAgICAgZmVhdHVyZXM6IHRoaXMub3B0aW9ucy5mZWF0dXJlcyxcbiAgICAgICAgdGltZWxpbmU6IHRoaXMuZXZlbnRzXG4gICAgICB9LFxuICAgICAgdGhpcy5vcHRpb25zLnBhcmFtc1xuICAgICk7XG5cbiAgICB0aGlzLmV2ZW50cyA9IFtdO1xuICAgIHNlbmRmbihkYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICB0aGlzLnNlbnQrKztcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZ2VuZXJhdGVVbmlxdWVJRCgpOiBudW1iZXIge1xuICAgIHRoaXMudW5pcXVlSUQrKztcbiAgICByZXR1cm4gdGhpcy51bmlxdWVJRDtcbiAgfVxufVxuIiwgImltcG9ydCBGYWN0b3J5IGZyb20gJy4uL3V0aWxzL2ZhY3RvcnknO1xuaW1wb3J0IFV0aWwgZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQgKiBhcyBFcnJvcnMgZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCAqIGFzIENvbGxlY3Rpb25zIGZyb20gJy4uL3V0aWxzL2NvbGxlY3Rpb25zJztcbmltcG9ydCBTdHJhdGVneSBmcm9tICcuL3N0cmF0ZWd5JztcbmltcG9ydCBUcmFuc3BvcnQgZnJvbSAnLi4vdHJhbnNwb3J0cy90cmFuc3BvcnQnO1xuaW1wb3J0IFN0cmF0ZWd5T3B0aW9ucyBmcm9tICcuL3N0cmF0ZWd5X29wdGlvbnMnO1xuaW1wb3J0IEhhbmRzaGFrZSBmcm9tICcuLi9jb25uZWN0aW9uL2hhbmRzaGFrZSc7XG5cbi8qKiBQcm92aWRlcyBhIHN0cmF0ZWd5IGludGVyZmFjZSBmb3IgdHJhbnNwb3J0cy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtOdW1iZXJ9IHByaW9yaXR5XG4gKiBAcGFyYW0ge0NsYXNzfSB0cmFuc3BvcnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYW5zcG9ydFN0cmF0ZWd5IGltcGxlbWVudHMgU3RyYXRlZ3kge1xuICBuYW1lOiBzdHJpbmc7XG4gIHByaW9yaXR5OiBudW1iZXI7XG4gIHRyYW5zcG9ydDogVHJhbnNwb3J0O1xuICBvcHRpb25zOiBTdHJhdGVneU9wdGlvbnM7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHByaW9yaXR5OiBudW1iZXIsXG4gICAgdHJhbnNwb3J0OiBUcmFuc3BvcnQsXG4gICAgb3B0aW9uczogU3RyYXRlZ3lPcHRpb25zXG4gICkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5wcmlvcml0eSA9IHByaW9yaXR5O1xuICAgIHRoaXMudHJhbnNwb3J0ID0gdHJhbnNwb3J0O1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIHRoZSB0cmFuc3BvcnQgaXMgc3VwcG9ydGVkIGluIHRoZSBicm93c2VyLlxuICAgKlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICovXG4gIGlzU3VwcG9ydGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5pc1N1cHBvcnRlZCh7XG4gICAgICB1c2VUTFM6IHRoaXMub3B0aW9ucy51c2VUTFNcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBMYXVuY2hlcyBhIGNvbm5lY3Rpb24gYXR0ZW1wdCBhbmQgcmV0dXJucyBhIHN0cmF0ZWd5IHJ1bm5lci5cbiAgICpcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEByZXR1cm4ge09iamVjdH0gc3RyYXRlZ3kgcnVubmVyXG4gICAqL1xuICBjb25uZWN0KG1pblByaW9yaXR5OiBudW1iZXIsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgIGlmICghdGhpcy5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICByZXR1cm4gZmFpbEF0dGVtcHQobmV3IEVycm9ycy5VbnN1cHBvcnRlZFN0cmF0ZWd5KCksIGNhbGxiYWNrKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJpb3JpdHkgPCBtaW5Qcmlvcml0eSkge1xuICAgICAgcmV0dXJuIGZhaWxBdHRlbXB0KG5ldyBFcnJvcnMuVHJhbnNwb3J0UHJpb3JpdHlUb29Mb3coKSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHZhciBjb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB2YXIgdHJhbnNwb3J0ID0gdGhpcy50cmFuc3BvcnQuY3JlYXRlQ29ubmVjdGlvbihcbiAgICAgIHRoaXMubmFtZSxcbiAgICAgIHRoaXMucHJpb3JpdHksXG4gICAgICB0aGlzLm9wdGlvbnMua2V5LFxuICAgICAgdGhpcy5vcHRpb25zXG4gICAgKTtcbiAgICB2YXIgaGFuZHNoYWtlID0gbnVsbDtcblxuICAgIHZhciBvbkluaXRpYWxpemVkID0gZnVuY3Rpb24oKSB7XG4gICAgICB0cmFuc3BvcnQudW5iaW5kKCdpbml0aWFsaXplZCcsIG9uSW5pdGlhbGl6ZWQpO1xuICAgICAgdHJhbnNwb3J0LmNvbm5lY3QoKTtcbiAgICB9O1xuICAgIHZhciBvbk9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgIGhhbmRzaGFrZSA9IEZhY3RvcnkuY3JlYXRlSGFuZHNoYWtlKHRyYW5zcG9ydCwgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIGNvbm5lY3RlZCA9IHRydWU7XG4gICAgICAgIHVuYmluZExpc3RlbmVycygpO1xuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB2YXIgb25FcnJvciA9IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICB1bmJpbmRMaXN0ZW5lcnMoKTtcbiAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICB9O1xuICAgIHZhciBvbkNsb3NlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdW5iaW5kTGlzdGVuZXJzKCk7XG4gICAgICB2YXIgc2VyaWFsaXplZFRyYW5zcG9ydDtcblxuICAgICAgLy8gVGhlIHJlYXNvbiBmb3IgdGhpcyB0cnkvY2F0Y2ggYmxvY2sgaXMgdGhhdCBvbiBSZWFjdCBOYXRpdmVcbiAgICAgIC8vIHRoZSBXZWJTb2NrZXQgb2JqZWN0IGlzIGNpcmN1bGFyLiBUaGVyZWZvcmUgdHJhbnNwb3J0LnNvY2tldCB3aWxsXG4gICAgICAvLyB0aHJvdyBlcnJvcnMgdXBvbiBzdHJpbmdpZmljYXRpb24uIENvbGxlY3Rpb25zLnNhZmVKU09OU3RyaW5naWZ5XG4gICAgICAvLyBkaXNjYXJkcyBjaXJjdWxhciByZWZlcmVuY2VzIHdoZW4gc2VyaWFsaXppbmcuXG4gICAgICBzZXJpYWxpemVkVHJhbnNwb3J0ID0gQ29sbGVjdGlvbnMuc2FmZUpTT05TdHJpbmdpZnkodHJhbnNwb3J0KTtcbiAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcnMuVHJhbnNwb3J0Q2xvc2VkKHNlcmlhbGl6ZWRUcmFuc3BvcnQpKTtcbiAgICB9O1xuXG4gICAgdmFyIHVuYmluZExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdHJhbnNwb3J0LnVuYmluZCgnaW5pdGlhbGl6ZWQnLCBvbkluaXRpYWxpemVkKTtcbiAgICAgIHRyYW5zcG9ydC51bmJpbmQoJ29wZW4nLCBvbk9wZW4pO1xuICAgICAgdHJhbnNwb3J0LnVuYmluZCgnZXJyb3InLCBvbkVycm9yKTtcbiAgICAgIHRyYW5zcG9ydC51bmJpbmQoJ2Nsb3NlZCcsIG9uQ2xvc2VkKTtcbiAgICB9O1xuXG4gICAgdHJhbnNwb3J0LmJpbmQoJ2luaXRpYWxpemVkJywgb25Jbml0aWFsaXplZCk7XG4gICAgdHJhbnNwb3J0LmJpbmQoJ29wZW4nLCBvbk9wZW4pO1xuICAgIHRyYW5zcG9ydC5iaW5kKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgIHRyYW5zcG9ydC5iaW5kKCdjbG9zZWQnLCBvbkNsb3NlZCk7XG5cbiAgICAvLyBjb25uZWN0IHdpbGwgYmUgY2FsbGVkIGF1dG9tYXRpY2FsbHkgYWZ0ZXIgaW5pdGlhbGl6YXRpb25cbiAgICB0cmFuc3BvcnQuaW5pdGlhbGl6ZSgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFib3J0OiAoKSA9PiB7XG4gICAgICAgIGlmIChjb25uZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdW5iaW5kTGlzdGVuZXJzKCk7XG4gICAgICAgIGlmIChoYW5kc2hha2UpIHtcbiAgICAgICAgICBoYW5kc2hha2UuY2xvc2UoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cmFuc3BvcnQuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZvcmNlTWluUHJpb3JpdHk6IHAgPT4ge1xuICAgICAgICBpZiAoY29ubmVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByaW9yaXR5IDwgcCkge1xuICAgICAgICAgIGlmIChoYW5kc2hha2UpIHtcbiAgICAgICAgICAgIGhhbmRzaGFrZS5jbG9zZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmFuc3BvcnQuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGZhaWxBdHRlbXB0KGVycm9yOiBFcnJvciwgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gIFV0aWwuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgY2FsbGJhY2soZXJyb3IpO1xuICB9KTtcbiAgcmV0dXJuIHtcbiAgICBhYm9ydDogZnVuY3Rpb24oKSB7fSxcbiAgICBmb3JjZU1pblByaW9yaXR5OiBmdW5jdGlvbigpIHt9XG4gIH07XG59XG4iLCAiaW1wb3J0ICogYXMgQ29sbGVjdGlvbnMgZnJvbSAnLi4vdXRpbHMvY29sbGVjdGlvbnMnO1xuaW1wb3J0IFV0aWwgZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQgVHJhbnNwb3J0TWFuYWdlciBmcm9tICcuLi90cmFuc3BvcnRzL3RyYW5zcG9ydF9tYW5hZ2VyJztcbmltcG9ydCAqIGFzIEVycm9ycyBmcm9tICcuLi9lcnJvcnMnO1xuaW1wb3J0IFN0cmF0ZWd5IGZyb20gJy4vc3RyYXRlZ3knO1xuaW1wb3J0IFRyYW5zcG9ydFN0cmF0ZWd5IGZyb20gJy4vdHJhbnNwb3J0X3N0cmF0ZWd5JztcbmltcG9ydCBTdHJhdGVneU9wdGlvbnMgZnJvbSAnLi4vc3RyYXRlZ2llcy9zdHJhdGVneV9vcHRpb25zJztcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgUnVudGltZSBmcm9tICdydW50aW1lJztcblxuY29uc3QgeyBUcmFuc3BvcnRzIH0gPSBSdW50aW1lO1xuXG5leHBvcnQgdmFyIGRlZmluZVRyYW5zcG9ydCA9IGZ1bmN0aW9uKFxuICBjb25maWc6IENvbmZpZyxcbiAgbmFtZTogc3RyaW5nLFxuICB0eXBlOiBzdHJpbmcsXG4gIHByaW9yaXR5OiBudW1iZXIsXG4gIG9wdGlvbnM6IFN0cmF0ZWd5T3B0aW9ucyxcbiAgbWFuYWdlcj86IFRyYW5zcG9ydE1hbmFnZXJcbik6IFN0cmF0ZWd5IHtcbiAgdmFyIHRyYW5zcG9ydENsYXNzID0gVHJhbnNwb3J0c1t0eXBlXTtcbiAgaWYgKCF0cmFuc3BvcnRDbGFzcykge1xuICAgIHRocm93IG5ldyBFcnJvcnMuVW5zdXBwb3J0ZWRUcmFuc3BvcnQodHlwZSk7XG4gIH1cblxuICB2YXIgZW5hYmxlZCA9XG4gICAgKCFjb25maWcuZW5hYmxlZFRyYW5zcG9ydHMgfHxcbiAgICAgIENvbGxlY3Rpb25zLmFycmF5SW5kZXhPZihjb25maWcuZW5hYmxlZFRyYW5zcG9ydHMsIG5hbWUpICE9PSAtMSkgJiZcbiAgICAoIWNvbmZpZy5kaXNhYmxlZFRyYW5zcG9ydHMgfHxcbiAgICAgIENvbGxlY3Rpb25zLmFycmF5SW5kZXhPZihjb25maWcuZGlzYWJsZWRUcmFuc3BvcnRzLCBuYW1lKSA9PT0gLTEpO1xuXG4gIHZhciB0cmFuc3BvcnQ7XG4gIGlmIChlbmFibGVkKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7IGlnbm9yZU51bGxPcmlnaW46IGNvbmZpZy5pZ25vcmVOdWxsT3JpZ2luIH0sXG4gICAgICBvcHRpb25zXG4gICAgKTtcblxuICAgIHRyYW5zcG9ydCA9IG5ldyBUcmFuc3BvcnRTdHJhdGVneShcbiAgICAgIG5hbWUsXG4gICAgICBwcmlvcml0eSxcbiAgICAgIG1hbmFnZXIgPyBtYW5hZ2VyLmdldEFzc2lzdGFudCh0cmFuc3BvcnRDbGFzcykgOiB0cmFuc3BvcnRDbGFzcyxcbiAgICAgIG9wdGlvbnNcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIHRyYW5zcG9ydCA9IFVuc3VwcG9ydGVkU3RyYXRlZ3k7XG4gIH1cblxuICByZXR1cm4gdHJhbnNwb3J0O1xufTtcblxudmFyIFVuc3VwcG9ydGVkU3RyYXRlZ3k6IFN0cmF0ZWd5ID0ge1xuICBpc1N1cHBvcnRlZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBjb25uZWN0OiBmdW5jdGlvbihfLCBjYWxsYmFjaykge1xuICAgIHZhciBkZWZlcnJlZCA9IFV0aWwuZGVmZXIoZnVuY3Rpb24oKSB7XG4gICAgICBjYWxsYmFjayhuZXcgRXJyb3JzLlVuc3VwcG9ydGVkU3RyYXRlZ3koKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFib3J0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgZGVmZXJyZWQuZW5zdXJlQWJvcnRlZCgpO1xuICAgICAgfSxcbiAgICAgIGZvcmNlTWluUHJpb3JpdHk6IGZ1bmN0aW9uKCkge31cbiAgICB9O1xuICB9XG59O1xuIiwgImltcG9ydCB7XG4gIFVzZXJBdXRoZW50aWNhdGlvbkNhbGxiYWNrLFxuICBJbnRlcm5hbEF1dGhPcHRpb25zLFxuICBVc2VyQXV0aGVudGljYXRpb25IYW5kbGVyLFxuICBVc2VyQXV0aGVudGljYXRpb25SZXF1ZXN0UGFyYW1zLFxuICBBdXRoUmVxdWVzdFR5cGVcbn0gZnJvbSAnLi9vcHRpb25zJztcblxuaW1wb3J0IFJ1bnRpbWUgZnJvbSAncnVudGltZSc7XG5cbmNvbnN0IGNvbXBvc2VDaGFubmVsUXVlcnkgPSAoXG4gIHBhcmFtczogVXNlckF1dGhlbnRpY2F0aW9uUmVxdWVzdFBhcmFtcyxcbiAgYXV0aE9wdGlvbnM6IEludGVybmFsQXV0aE9wdGlvbnNcbikgPT4ge1xuICB2YXIgcXVlcnkgPSAnc29ja2V0X2lkPScgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1zLnNvY2tldElkKTtcblxuICBmb3IgKHZhciBrZXkgaW4gYXV0aE9wdGlvbnMucGFyYW1zKSB7XG4gICAgcXVlcnkgKz1cbiAgICAgICcmJyArXG4gICAgICBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArXG4gICAgICAnPScgK1xuICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KGF1dGhPcHRpb25zLnBhcmFtc1trZXldKTtcbiAgfVxuXG4gIGlmIChhdXRoT3B0aW9ucy5wYXJhbXNQcm92aWRlciAhPSBudWxsKSB7XG4gICAgbGV0IGR5bmFtaWNQYXJhbXMgPSBhdXRoT3B0aW9ucy5wYXJhbXNQcm92aWRlcigpO1xuICAgIGZvciAodmFyIGtleSBpbiBkeW5hbWljUGFyYW1zKSB7XG4gICAgICBxdWVyeSArPVxuICAgICAgICAnJicgK1xuICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArXG4gICAgICAgICc9JyArXG4gICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChkeW5hbWljUGFyYW1zW2tleV0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBxdWVyeTtcbn07XG5cbmNvbnN0IFVzZXJBdXRoZW50aWNhdG9yID0gKFxuICBhdXRoT3B0aW9uczogSW50ZXJuYWxBdXRoT3B0aW9uc1xuKTogVXNlckF1dGhlbnRpY2F0aW9uSGFuZGxlciA9PiB7XG4gIGlmICh0eXBlb2YgUnVudGltZS5nZXRBdXRob3JpemVycygpW2F1dGhPcHRpb25zLnRyYW5zcG9ydF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgYCcke2F1dGhPcHRpb25zLnRyYW5zcG9ydH0nIGlzIG5vdCBhIHJlY29nbml6ZWQgYXV0aCB0cmFuc3BvcnRgO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICBwYXJhbXM6IFVzZXJBdXRoZW50aWNhdGlvblJlcXVlc3RQYXJhbXMsXG4gICAgY2FsbGJhY2s6IFVzZXJBdXRoZW50aWNhdGlvbkNhbGxiYWNrXG4gICkgPT4ge1xuICAgIGNvbnN0IHF1ZXJ5ID0gY29tcG9zZUNoYW5uZWxRdWVyeShwYXJhbXMsIGF1dGhPcHRpb25zKTtcblxuICAgIFJ1bnRpbWUuZ2V0QXV0aG9yaXplcnMoKVthdXRoT3B0aW9ucy50cmFuc3BvcnRdKFxuICAgICAgUnVudGltZSxcbiAgICAgIHF1ZXJ5LFxuICAgICAgYXV0aE9wdGlvbnMsXG4gICAgICBBdXRoUmVxdWVzdFR5cGUuVXNlckF1dGhlbnRpY2F0aW9uLFxuICAgICAgY2FsbGJhY2tcbiAgICApO1xuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgVXNlckF1dGhlbnRpY2F0b3I7XG4iLCAiaW1wb3J0IHtcbiAgQXV0aFJlcXVlc3RUeXBlLFxuICBJbnRlcm5hbEF1dGhPcHRpb25zLFxuICBDaGFubmVsQXV0aG9yaXphdGlvbkhhbmRsZXIsXG4gIENoYW5uZWxBdXRob3JpemF0aW9uUmVxdWVzdFBhcmFtcyxcbiAgQ2hhbm5lbEF1dGhvcml6YXRpb25DYWxsYmFja1xufSBmcm9tICcuL29wdGlvbnMnO1xuXG5pbXBvcnQgUnVudGltZSBmcm9tICdydW50aW1lJztcblxuY29uc3QgY29tcG9zZUNoYW5uZWxRdWVyeSA9IChcbiAgcGFyYW1zOiBDaGFubmVsQXV0aG9yaXphdGlvblJlcXVlc3RQYXJhbXMsXG4gIGF1dGhPcHRpb25zOiBJbnRlcm5hbEF1dGhPcHRpb25zXG4pID0+IHtcbiAgdmFyIHF1ZXJ5ID0gJ3NvY2tldF9pZD0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtcy5zb2NrZXRJZCk7XG5cbiAgcXVlcnkgKz0gJyZjaGFubmVsX25hbWU9JyArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbXMuY2hhbm5lbE5hbWUpO1xuXG4gIGZvciAodmFyIGtleSBpbiBhdXRoT3B0aW9ucy5wYXJhbXMpIHtcbiAgICBxdWVyeSArPVxuICAgICAgJyYnICtcbiAgICAgIGVuY29kZVVSSUNvbXBvbmVudChrZXkpICtcbiAgICAgICc9JyArXG4gICAgICBlbmNvZGVVUklDb21wb25lbnQoYXV0aE9wdGlvbnMucGFyYW1zW2tleV0pO1xuICB9XG5cbiAgaWYgKGF1dGhPcHRpb25zLnBhcmFtc1Byb3ZpZGVyICE9IG51bGwpIHtcbiAgICBsZXQgZHluYW1pY1BhcmFtcyA9IGF1dGhPcHRpb25zLnBhcmFtc1Byb3ZpZGVyKCk7XG4gICAgZm9yICh2YXIga2V5IGluIGR5bmFtaWNQYXJhbXMpIHtcbiAgICAgIHF1ZXJ5ICs9XG4gICAgICAgICcmJyArXG4gICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChrZXkpICtcbiAgICAgICAgJz0nICtcbiAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KGR5bmFtaWNQYXJhbXNba2V5XSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHF1ZXJ5O1xufTtcblxuY29uc3QgQ2hhbm5lbEF1dGhvcml6ZXIgPSAoXG4gIGF1dGhPcHRpb25zOiBJbnRlcm5hbEF1dGhPcHRpb25zXG4pOiBDaGFubmVsQXV0aG9yaXphdGlvbkhhbmRsZXIgPT4ge1xuICBpZiAodHlwZW9mIFJ1bnRpbWUuZ2V0QXV0aG9yaXplcnMoKVthdXRoT3B0aW9ucy50cmFuc3BvcnRdID09PSAndW5kZWZpbmVkJykge1xuICAgIHRocm93IGAnJHthdXRoT3B0aW9ucy50cmFuc3BvcnR9JyBpcyBub3QgYSByZWNvZ25pemVkIGF1dGggdHJhbnNwb3J0YDtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgcGFyYW1zOiBDaGFubmVsQXV0aG9yaXphdGlvblJlcXVlc3RQYXJhbXMsXG4gICAgY2FsbGJhY2s6IENoYW5uZWxBdXRob3JpemF0aW9uQ2FsbGJhY2tcbiAgKSA9PiB7XG4gICAgY29uc3QgcXVlcnkgPSBjb21wb3NlQ2hhbm5lbFF1ZXJ5KHBhcmFtcywgYXV0aE9wdGlvbnMpO1xuXG4gICAgUnVudGltZS5nZXRBdXRob3JpemVycygpW2F1dGhPcHRpb25zLnRyYW5zcG9ydF0oXG4gICAgICBSdW50aW1lLFxuICAgICAgcXVlcnksXG4gICAgICBhdXRoT3B0aW9ucyxcbiAgICAgIEF1dGhSZXF1ZXN0VHlwZS5DaGFubmVsQXV0aG9yaXphdGlvbixcbiAgICAgIGNhbGxiYWNrXG4gICAgKTtcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IENoYW5uZWxBdXRob3JpemVyO1xuIiwgImltcG9ydCBDaGFubmVsIGZyb20gJy4uL2NoYW5uZWxzL2NoYW5uZWwnO1xuaW1wb3J0IHtcbiAgQ2hhbm5lbEF1dGhvcml6YXRpb25DYWxsYmFjayxcbiAgQ2hhbm5lbEF1dGhvcml6YXRpb25IYW5kbGVyLFxuICBDaGFubmVsQXV0aG9yaXphdGlvblJlcXVlc3RQYXJhbXMsXG4gIEludGVybmFsQXV0aE9wdGlvbnNcbn0gZnJvbSAnLi9vcHRpb25zJztcblxuZXhwb3J0IGludGVyZmFjZSBEZXByZWNhdGVkQ2hhbm5lbEF1dGhvcml6ZXIge1xuICBhdXRob3JpemUoc29ja2V0SWQ6IHN0cmluZywgY2FsbGJhY2s6IENoYW5uZWxBdXRob3JpemF0aW9uQ2FsbGJhY2spOiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENoYW5uZWxBdXRob3JpemVyR2VuZXJhdG9yIHtcbiAgKFxuICAgIGNoYW5uZWw6IENoYW5uZWwsXG4gICAgb3B0aW9uczogRGVwcmVjYXRlZEF1dGhvcml6ZXJPcHRpb25zXG4gICk6IERlcHJlY2F0ZWRDaGFubmVsQXV0aG9yaXplcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEZXByZWNhdGVkQXV0aE9wdGlvbnMge1xuICBwYXJhbXM/OiBhbnk7XG4gIGhlYWRlcnM/OiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVwcmVjYXRlZEF1dGhvcml6ZXJPcHRpb25zIHtcbiAgYXV0aFRyYW5zcG9ydDogJ2FqYXgnIHwgJ2pzb25wJztcbiAgYXV0aEVuZHBvaW50OiBzdHJpbmc7XG4gIGF1dGg/OiBEZXByZWNhdGVkQXV0aE9wdGlvbnM7XG59XG5cbmV4cG9ydCBjb25zdCBDaGFubmVsQXV0aG9yaXplclByb3h5ID0gKFxuICBwdXNoZXIsXG4gIGF1dGhPcHRpb25zOiBJbnRlcm5hbEF1dGhPcHRpb25zLFxuICBjaGFubmVsQXV0aG9yaXplckdlbmVyYXRvcjogQ2hhbm5lbEF1dGhvcml6ZXJHZW5lcmF0b3Jcbik6IENoYW5uZWxBdXRob3JpemF0aW9uSGFuZGxlciA9PiB7XG4gIGNvbnN0IGRlcHJlY2F0ZWRBdXRob3JpemVyT3B0aW9uczogRGVwcmVjYXRlZEF1dGhvcml6ZXJPcHRpb25zID0ge1xuICAgIGF1dGhUcmFuc3BvcnQ6IGF1dGhPcHRpb25zLnRyYW5zcG9ydCxcbiAgICBhdXRoRW5kcG9pbnQ6IGF1dGhPcHRpb25zLmVuZHBvaW50LFxuICAgIGF1dGg6IHtcbiAgICAgIHBhcmFtczogYXV0aE9wdGlvbnMucGFyYW1zLFxuICAgICAgaGVhZGVyczogYXV0aE9wdGlvbnMuaGVhZGVyc1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIChcbiAgICBwYXJhbXM6IENoYW5uZWxBdXRob3JpemF0aW9uUmVxdWVzdFBhcmFtcyxcbiAgICBjYWxsYmFjazogQ2hhbm5lbEF1dGhvcml6YXRpb25DYWxsYmFja1xuICApID0+IHtcbiAgICBjb25zdCBjaGFubmVsID0gcHVzaGVyLmNoYW5uZWwocGFyYW1zLmNoYW5uZWxOYW1lKTtcbiAgICAvLyBUaGlzIGxpbmUgY3JlYXRlcyBhIG5ldyBjaGFubmVsIGF1dGhvcml6ZXIgZXZlcnkgdGltZS5cbiAgICAvLyBJbiB0aGUgcGFzdCwgdGhpcyB3YXMgb25seSBkb25lIG9uY2UgcGVyIGNoYW5uZWwgYW5kIHJldXNlZC5cbiAgICAvLyBXZSBjYW4gZG8gdGhhdCBhZ2FpbiBpZiB3ZSB3YW50IHRvIGtlZXAgdGhpcyBiZWhhdmlvciBpbnRhY3QuXG4gICAgY29uc3QgY2hhbm5lbEF1dGhvcml6ZXI6IERlcHJlY2F0ZWRDaGFubmVsQXV0aG9yaXplciA9IGNoYW5uZWxBdXRob3JpemVyR2VuZXJhdG9yKFxuICAgICAgY2hhbm5lbCxcbiAgICAgIGRlcHJlY2F0ZWRBdXRob3JpemVyT3B0aW9uc1xuICAgICk7XG4gICAgY2hhbm5lbEF1dGhvcml6ZXIuYXV0aG9yaXplKHBhcmFtcy5zb2NrZXRJZCwgY2FsbGJhY2spO1xuICB9O1xufTtcbiIsICJpbXBvcnQgeyBPcHRpb25zIH0gZnJvbSAnLi9vcHRpb25zJztcbmltcG9ydCBEZWZhdWx0cyBmcm9tICcuL2RlZmF1bHRzJztcbmltcG9ydCB7XG4gIENoYW5uZWxBdXRob3JpemF0aW9uSGFuZGxlcixcbiAgVXNlckF1dGhlbnRpY2F0aW9uSGFuZGxlcixcbiAgQ2hhbm5lbEF1dGhvcml6YXRpb25PcHRpb25zXG59IGZyb20gJy4vYXV0aC9vcHRpb25zJztcbmltcG9ydCBVc2VyQXV0aGVudGljYXRvciBmcm9tICcuL2F1dGgvdXNlcl9hdXRoZW50aWNhdG9yJztcbmltcG9ydCBDaGFubmVsQXV0aG9yaXplciBmcm9tICcuL2F1dGgvY2hhbm5lbF9hdXRob3JpemVyJztcbmltcG9ydCB7IENoYW5uZWxBdXRob3JpemVyUHJveHkgfSBmcm9tICcuL2F1dGgvZGVwcmVjYXRlZF9jaGFubmVsX2F1dGhvcml6ZXInO1xuaW1wb3J0IFJ1bnRpbWUgZnJvbSAncnVudGltZSc7XG5pbXBvcnQgKiBhcyBuYWNsIGZyb20gJ3R3ZWV0bmFjbCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcblxuZXhwb3J0IHR5cGUgQXV0aFRyYW5zcG9ydCA9ICdhamF4JyB8ICdqc29ucCc7XG5leHBvcnQgdHlwZSBUcmFuc3BvcnQgPVxuICB8ICd3cydcbiAgfCAnd3NzJ1xuICB8ICd4aHJfc3RyZWFtaW5nJ1xuICB8ICd4aHJfcG9sbGluZydcbiAgfCAnc29ja2pzJztcblxuZXhwb3J0IGludGVyZmFjZSBDb25maWcge1xuICAvLyB0aGVzZSBhcmUgYWxsICdyZXF1aXJlZCcgY29uZmlnIHBhcmFtZXRlcnMsIGl0J3Mgbm90IG5lY2Vzc2FyeSBmb3IgdGhlIHVzZXJcbiAgLy8gdG8gc2V0IHRoZW0sIGJ1dCB0aGV5IGhhdmUgY29uZmlndXJlZCBkZWZhdWx0cy5cbiAgYWN0aXZpdHlUaW1lb3V0OiBudW1iZXI7XG4gIGVuYWJsZVN0YXRzOiBib29sZWFuO1xuICBodHRwSG9zdDogc3RyaW5nO1xuICBodHRwUGF0aDogc3RyaW5nO1xuICBodHRwUG9ydDogbnVtYmVyO1xuICBodHRwc1BvcnQ6IG51bWJlcjtcbiAgcG9uZ1RpbWVvdXQ6IG51bWJlcjtcbiAgc3RhdHNIb3N0OiBzdHJpbmc7XG4gIHVuYXZhaWxhYmxlVGltZW91dDogbnVtYmVyO1xuICB1c2VUTFM6IGJvb2xlYW47XG4gIHdzSG9zdDogc3RyaW5nO1xuICB3c1BhdGg6IHN0cmluZztcbiAgd3NQb3J0OiBudW1iZXI7XG4gIHdzc1BvcnQ6IG51bWJlcjtcbiAgdXNlckF1dGhlbnRpY2F0b3I6IFVzZXJBdXRoZW50aWNhdGlvbkhhbmRsZXI7XG4gIGNoYW5uZWxBdXRob3JpemVyOiBDaGFubmVsQXV0aG9yaXphdGlvbkhhbmRsZXI7XG5cbiAgLy8gdGhlc2UgYXJlIGFsbCBvcHRpb25hbCBwYXJhbWV0ZXJzIG9yIG92ZXJycmlkZXMuIFRoZSBjdXN0b21lciBjYW4gc2V0IHRoZXNlXG4gIC8vIGJ1dCBpdCdzIG5vdCBzdHJpY3RseSBuZWNlc3NhcnlcbiAgZm9yY2VUTFM/OiBib29sZWFuO1xuICBjbHVzdGVyPzogc3RyaW5nO1xuICBkaXNhYmxlZFRyYW5zcG9ydHM/OiBUcmFuc3BvcnRbXTtcbiAgZW5hYmxlZFRyYW5zcG9ydHM/OiBUcmFuc3BvcnRbXTtcbiAgaWdub3JlTnVsbE9yaWdpbj86IGJvb2xlYW47XG4gIG5hY2w/OiBuYWNsO1xuICB0aW1lbGluZVBhcmFtcz86IGFueTtcbn1cblxuLy8gZ2V0Q29uZmlnIG1haW5seSBzZXRzIHRoZSBkZWZhdWx0cyBmb3IgdGhlIG9wdGlvbnMgdGhhdCBhcmUgbm90IHByb3ZpZGVkXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZmlnKG9wdHM6IE9wdGlvbnMsIHB1c2hlcik6IENvbmZpZyB7XG4gIGxldCBjb25maWc6IENvbmZpZyA9IHtcbiAgICBhY3Rpdml0eVRpbWVvdXQ6IG9wdHMuYWN0aXZpdHlUaW1lb3V0IHx8IERlZmF1bHRzLmFjdGl2aXR5VGltZW91dCxcbiAgICBjbHVzdGVyOiBvcHRzLmNsdXN0ZXIgfHwgRGVmYXVsdHMuY2x1c3RlcixcbiAgICBodHRwUGF0aDogb3B0cy5odHRwUGF0aCB8fCBEZWZhdWx0cy5odHRwUGF0aCxcbiAgICBodHRwUG9ydDogb3B0cy5odHRwUG9ydCB8fCBEZWZhdWx0cy5odHRwUG9ydCxcbiAgICBodHRwc1BvcnQ6IG9wdHMuaHR0cHNQb3J0IHx8IERlZmF1bHRzLmh0dHBzUG9ydCxcbiAgICBwb25nVGltZW91dDogb3B0cy5wb25nVGltZW91dCB8fCBEZWZhdWx0cy5wb25nVGltZW91dCxcbiAgICBzdGF0c0hvc3Q6IG9wdHMuc3RhdHNIb3N0IHx8IERlZmF1bHRzLnN0YXRzX2hvc3QsXG4gICAgdW5hdmFpbGFibGVUaW1lb3V0OiBvcHRzLnVuYXZhaWxhYmxlVGltZW91dCB8fCBEZWZhdWx0cy51bmF2YWlsYWJsZVRpbWVvdXQsXG4gICAgd3NQYXRoOiBvcHRzLndzUGF0aCB8fCBEZWZhdWx0cy53c1BhdGgsXG4gICAgd3NQb3J0OiBvcHRzLndzUG9ydCB8fCBEZWZhdWx0cy53c1BvcnQsXG4gICAgd3NzUG9ydDogb3B0cy53c3NQb3J0IHx8IERlZmF1bHRzLndzc1BvcnQsXG5cbiAgICBlbmFibGVTdGF0czogZ2V0RW5hYmxlU3RhdHNDb25maWcob3B0cyksXG4gICAgaHR0cEhvc3Q6IGdldEh0dHBIb3N0KG9wdHMpLFxuICAgIHVzZVRMUzogc2hvdWxkVXNlVExTKG9wdHMpLFxuICAgIHdzSG9zdDogZ2V0V2Vic29ja2V0SG9zdChvcHRzKSxcblxuICAgIHVzZXJBdXRoZW50aWNhdG9yOiBidWlsZFVzZXJBdXRoZW50aWNhdG9yKG9wdHMpLFxuICAgIGNoYW5uZWxBdXRob3JpemVyOiBidWlsZENoYW5uZWxBdXRob3JpemVyKG9wdHMsIHB1c2hlcilcbiAgfTtcblxuICBpZiAoJ2Rpc2FibGVkVHJhbnNwb3J0cycgaW4gb3B0cylcbiAgICBjb25maWcuZGlzYWJsZWRUcmFuc3BvcnRzID0gb3B0cy5kaXNhYmxlZFRyYW5zcG9ydHM7XG4gIGlmICgnZW5hYmxlZFRyYW5zcG9ydHMnIGluIG9wdHMpXG4gICAgY29uZmlnLmVuYWJsZWRUcmFuc3BvcnRzID0gb3B0cy5lbmFibGVkVHJhbnNwb3J0cztcbiAgaWYgKCdpZ25vcmVOdWxsT3JpZ2luJyBpbiBvcHRzKVxuICAgIGNvbmZpZy5pZ25vcmVOdWxsT3JpZ2luID0gb3B0cy5pZ25vcmVOdWxsT3JpZ2luO1xuICBpZiAoJ3RpbWVsaW5lUGFyYW1zJyBpbiBvcHRzKSBjb25maWcudGltZWxpbmVQYXJhbXMgPSBvcHRzLnRpbWVsaW5lUGFyYW1zO1xuICBpZiAoJ25hY2wnIGluIG9wdHMpIHtcbiAgICBjb25maWcubmFjbCA9IG9wdHMubmFjbDtcbiAgfVxuXG4gIHJldHVybiBjb25maWc7XG59XG5cbmZ1bmN0aW9uIGdldEh0dHBIb3N0KG9wdHM6IE9wdGlvbnMpOiBzdHJpbmcge1xuICBpZiAob3B0cy5odHRwSG9zdCkge1xuICAgIHJldHVybiBvcHRzLmh0dHBIb3N0O1xuICB9XG4gIGlmIChvcHRzLmNsdXN0ZXIpIHtcbiAgICByZXR1cm4gYHNvY2tqcy0ke29wdHMuY2x1c3Rlcn0ucHVzaGVyLmNvbWA7XG4gIH1cbiAgcmV0dXJuIERlZmF1bHRzLmh0dHBIb3N0O1xufVxuXG5mdW5jdGlvbiBnZXRXZWJzb2NrZXRIb3N0KG9wdHM6IE9wdGlvbnMpOiBzdHJpbmcge1xuICBpZiAob3B0cy53c0hvc3QpIHtcbiAgICByZXR1cm4gb3B0cy53c0hvc3Q7XG4gIH1cbiAgaWYgKG9wdHMuY2x1c3Rlcikge1xuICAgIHJldHVybiBnZXRXZWJzb2NrZXRIb3N0RnJvbUNsdXN0ZXIob3B0cy5jbHVzdGVyKTtcbiAgfVxuICByZXR1cm4gZ2V0V2Vic29ja2V0SG9zdEZyb21DbHVzdGVyKERlZmF1bHRzLmNsdXN0ZXIpO1xufVxuXG5mdW5jdGlvbiBnZXRXZWJzb2NrZXRIb3N0RnJvbUNsdXN0ZXIoY2x1c3Rlcjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGB3cy0ke2NsdXN0ZXJ9LnB1c2hlci5jb21gO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VUTFMob3B0czogT3B0aW9ucyk6IGJvb2xlYW4ge1xuICBpZiAoUnVudGltZS5nZXRQcm90b2NvbCgpID09PSAnaHR0cHM6Jykge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKG9wdHMuZm9yY2VUTFMgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBpZiBlbmFibGVTdGF0cyBpcyBzZXQgdGFrZSB0aGUgdmFsdWVcbi8vIGlmIGRpc2FibGVTdGF0cyBpcyBzZXQgdGFrZSB0aGUgaW52ZXJzZVxuLy8gb3RoZXJ3aXNlIGRlZmF1bHQgdG8gZmFsc2VcbmZ1bmN0aW9uIGdldEVuYWJsZVN0YXRzQ29uZmlnKG9wdHM6IE9wdGlvbnMpOiBib29sZWFuIHtcbiAgaWYgKCdlbmFibGVTdGF0cycgaW4gb3B0cykge1xuICAgIHJldHVybiBvcHRzLmVuYWJsZVN0YXRzO1xuICB9XG4gIGlmICgnZGlzYWJsZVN0YXRzJyBpbiBvcHRzKSB7XG4gICAgcmV0dXJuICFvcHRzLmRpc2FibGVTdGF0cztcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkVXNlckF1dGhlbnRpY2F0b3Iob3B0czogT3B0aW9ucyk6IFVzZXJBdXRoZW50aWNhdGlvbkhhbmRsZXIge1xuICBjb25zdCB1c2VyQXV0aGVudGljYXRpb24gPSB7XG4gICAgLi4uRGVmYXVsdHMudXNlckF1dGhlbnRpY2F0aW9uLFxuICAgIC4uLm9wdHMudXNlckF1dGhlbnRpY2F0aW9uXG4gIH07XG4gIGlmIChcbiAgICAnY3VzdG9tSGFuZGxlcicgaW4gdXNlckF1dGhlbnRpY2F0aW9uICYmXG4gICAgdXNlckF1dGhlbnRpY2F0aW9uWydjdXN0b21IYW5kbGVyJ10gIT0gbnVsbFxuICApIHtcbiAgICByZXR1cm4gdXNlckF1dGhlbnRpY2F0aW9uWydjdXN0b21IYW5kbGVyJ107XG4gIH1cblxuICByZXR1cm4gVXNlckF1dGhlbnRpY2F0b3IodXNlckF1dGhlbnRpY2F0aW9uKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRDaGFubmVsQXV0aChvcHRzOiBPcHRpb25zLCBwdXNoZXIpOiBDaGFubmVsQXV0aG9yaXphdGlvbk9wdGlvbnMge1xuICBsZXQgY2hhbm5lbEF1dGhvcml6YXRpb246IENoYW5uZWxBdXRob3JpemF0aW9uT3B0aW9ucztcbiAgaWYgKCdjaGFubmVsQXV0aG9yaXphdGlvbicgaW4gb3B0cykge1xuICAgIGNoYW5uZWxBdXRob3JpemF0aW9uID0ge1xuICAgICAgLi4uRGVmYXVsdHMuY2hhbm5lbEF1dGhvcml6YXRpb24sXG4gICAgICAuLi5vcHRzLmNoYW5uZWxBdXRob3JpemF0aW9uXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBjaGFubmVsQXV0aG9yaXphdGlvbiA9IHtcbiAgICAgIHRyYW5zcG9ydDogb3B0cy5hdXRoVHJhbnNwb3J0IHx8IERlZmF1bHRzLmF1dGhUcmFuc3BvcnQsXG4gICAgICBlbmRwb2ludDogb3B0cy5hdXRoRW5kcG9pbnQgfHwgRGVmYXVsdHMuYXV0aEVuZHBvaW50XG4gICAgfTtcbiAgICBpZiAoJ2F1dGgnIGluIG9wdHMpIHtcbiAgICAgIGlmICgncGFyYW1zJyBpbiBvcHRzLmF1dGgpIGNoYW5uZWxBdXRob3JpemF0aW9uLnBhcmFtcyA9IG9wdHMuYXV0aC5wYXJhbXM7XG4gICAgICBpZiAoJ2hlYWRlcnMnIGluIG9wdHMuYXV0aClcbiAgICAgICAgY2hhbm5lbEF1dGhvcml6YXRpb24uaGVhZGVycyA9IG9wdHMuYXV0aC5oZWFkZXJzO1xuICAgIH1cbiAgICBpZiAoJ2F1dGhvcml6ZXInIGluIG9wdHMpXG4gICAgICBjaGFubmVsQXV0aG9yaXphdGlvbi5jdXN0b21IYW5kbGVyID0gQ2hhbm5lbEF1dGhvcml6ZXJQcm94eShcbiAgICAgICAgcHVzaGVyLFxuICAgICAgICBjaGFubmVsQXV0aG9yaXphdGlvbixcbiAgICAgICAgb3B0cy5hdXRob3JpemVyXG4gICAgICApO1xuICB9XG4gIHJldHVybiBjaGFubmVsQXV0aG9yaXphdGlvbjtcbn1cblxuZnVuY3Rpb24gYnVpbGRDaGFubmVsQXV0aG9yaXplcihcbiAgb3B0czogT3B0aW9ucyxcbiAgcHVzaGVyXG4pOiBDaGFubmVsQXV0aG9yaXphdGlvbkhhbmRsZXIge1xuICBjb25zdCBjaGFubmVsQXV0aG9yaXphdGlvbiA9IGJ1aWxkQ2hhbm5lbEF1dGgob3B0cywgcHVzaGVyKTtcbiAgaWYgKFxuICAgICdjdXN0b21IYW5kbGVyJyBpbiBjaGFubmVsQXV0aG9yaXphdGlvbiAmJlxuICAgIGNoYW5uZWxBdXRob3JpemF0aW9uWydjdXN0b21IYW5kbGVyJ10gIT0gbnVsbFxuICApIHtcbiAgICByZXR1cm4gY2hhbm5lbEF1dGhvcml6YXRpb25bJ2N1c3RvbUhhbmRsZXInXTtcbiAgfVxuXG4gIHJldHVybiBDaGFubmVsQXV0aG9yaXplcihjaGFubmVsQXV0aG9yaXphdGlvbik7XG59XG4iLCAiaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgUHVzaGVyIGZyb20gJy4vcHVzaGVyJztcbmltcG9ydCBFdmVudHNEaXNwYXRjaGVyIGZyb20gJy4vZXZlbnRzL2Rpc3BhdGNoZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXRjaGxpc3RGYWNhZGUgZXh0ZW5kcyBFdmVudHNEaXNwYXRjaGVyIHtcbiAgcHJpdmF0ZSBwdXNoZXI6IFB1c2hlcjtcblxuICBwdWJsaWMgY29uc3RydWN0b3IocHVzaGVyOiBQdXNoZXIpIHtcbiAgICBzdXBlcihmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgIExvZ2dlci5kZWJ1ZyhgTm8gY2FsbGJhY2tzIG9uIHdhdGNobGlzdCBldmVudHMgZm9yICR7ZXZlbnROYW1lfWApO1xuICAgIH0pO1xuXG4gICAgdGhpcy5wdXNoZXIgPSBwdXNoZXI7XG4gICAgdGhpcy5iaW5kV2F0Y2hsaXN0SW50ZXJuYWxFdmVudCgpO1xuICB9XG5cbiAgaGFuZGxlRXZlbnQocHVzaGVyRXZlbnQpIHtcbiAgICBwdXNoZXJFdmVudC5kYXRhLmV2ZW50cy5mb3JFYWNoKHdhdGNobGlzdEV2ZW50ID0+IHtcbiAgICAgIHRoaXMuZW1pdCh3YXRjaGxpc3RFdmVudC5uYW1lLCB3YXRjaGxpc3RFdmVudCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGJpbmRXYXRjaGxpc3RJbnRlcm5hbEV2ZW50KCkge1xuICAgIHRoaXMucHVzaGVyLmNvbm5lY3Rpb24uYmluZCgnbWVzc2FnZScsIHB1c2hlckV2ZW50ID0+IHtcbiAgICAgIHZhciBldmVudE5hbWUgPSBwdXNoZXJFdmVudC5ldmVudDtcbiAgICAgIGlmIChldmVudE5hbWUgPT09ICdwdXNoZXJfaW50ZXJuYWw6d2F0Y2hsaXN0X2V2ZW50cycpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVFdmVudChwdXNoZXJFdmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsICJmdW5jdGlvbiBmbGF0UHJvbWlzZSgpIHtcbiAgbGV0IHJlc29sdmUsIHJlamVjdDtcbiAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgIHJlc29sdmUgPSByZXM7XG4gICAgcmVqZWN0ID0gcmVqO1xuICB9KTtcbiAgcmV0dXJuIHsgcHJvbWlzZSwgcmVzb2x2ZSwgcmVqZWN0IH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZsYXRQcm9taXNlO1xuIiwgImltcG9ydCBQdXNoZXIgZnJvbSAnLi9wdXNoZXInO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQge1xuICBVc2VyQXV0aGVudGljYXRpb25EYXRhLFxuICBVc2VyQXV0aGVudGljYXRpb25DYWxsYmFja1xufSBmcm9tICcuL2F1dGgvb3B0aW9ucyc7XG5pbXBvcnQgQ2hhbm5lbCBmcm9tICcuL2NoYW5uZWxzL2NoYW5uZWwnO1xuaW1wb3J0IFdhdGNobGlzdEZhY2FkZSBmcm9tICcuL3dhdGNobGlzdCc7XG5pbXBvcnQgRXZlbnRzRGlzcGF0Y2hlciBmcm9tICcuL2V2ZW50cy9kaXNwYXRjaGVyJztcbmltcG9ydCBmbGF0UHJvbWlzZSBmcm9tICcuL3V0aWxzL2ZsYXRfcHJvbWlzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVzZXJGYWNhZGUgZXh0ZW5kcyBFdmVudHNEaXNwYXRjaGVyIHtcbiAgcHVzaGVyOiBQdXNoZXI7XG4gIHNpZ25pbl9yZXF1ZXN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgdXNlcl9kYXRhOiBhbnkgPSBudWxsO1xuICBzZXJ2ZXJUb1VzZXJDaGFubmVsOiBDaGFubmVsID0gbnVsbDtcbiAgc2lnbmluRG9uZVByb21pc2U6IFByb21pc2U8YW55PiA9IG51bGw7XG4gIHdhdGNobGlzdDogV2F0Y2hsaXN0RmFjYWRlO1xuICBwcml2YXRlIF9zaWduaW5Eb25lUmVzb2x2ZTogRnVuY3Rpb24gPSBudWxsO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihwdXNoZXI6IFB1c2hlcikge1xuICAgIHN1cGVyKGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgICAgTG9nZ2VyLmRlYnVnKCdObyBjYWxsYmFja3Mgb24gdXNlciBmb3IgJyArIGV2ZW50TmFtZSk7XG4gICAgfSk7XG4gICAgdGhpcy5wdXNoZXIgPSBwdXNoZXI7XG4gICAgdGhpcy5wdXNoZXIuY29ubmVjdGlvbi5iaW5kKCdzdGF0ZV9jaGFuZ2UnLCAoeyBwcmV2aW91cywgY3VycmVudCB9KSA9PiB7XG4gICAgICBpZiAocHJldmlvdXMgIT09ICdjb25uZWN0ZWQnICYmIGN1cnJlbnQgPT09ICdjb25uZWN0ZWQnKSB7XG4gICAgICAgIHRoaXMuX3NpZ25pbigpO1xuICAgICAgfVxuICAgICAgaWYgKHByZXZpb3VzID09PSAnY29ubmVjdGVkJyAmJiBjdXJyZW50ICE9PSAnY29ubmVjdGVkJykge1xuICAgICAgICB0aGlzLl9jbGVhbnVwKCk7XG4gICAgICAgIHRoaXMuX25ld1NpZ25pblByb21pc2VJZk5lZWRlZCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy53YXRjaGxpc3QgPSBuZXcgV2F0Y2hsaXN0RmFjYWRlKHB1c2hlcik7XG5cbiAgICB0aGlzLnB1c2hlci5jb25uZWN0aW9uLmJpbmQoJ21lc3NhZ2UnLCBldmVudCA9PiB7XG4gICAgICB2YXIgZXZlbnROYW1lID0gZXZlbnQuZXZlbnQ7XG4gICAgICBpZiAoZXZlbnROYW1lID09PSAncHVzaGVyOnNpZ25pbl9zdWNjZXNzJykge1xuICAgICAgICB0aGlzLl9vblNpZ25pblN1Y2Nlc3MoZXZlbnQuZGF0YSk7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuc2VydmVyVG9Vc2VyQ2hhbm5lbCAmJlxuICAgICAgICB0aGlzLnNlcnZlclRvVXNlckNoYW5uZWwubmFtZSA9PT0gZXZlbnQuY2hhbm5lbFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuc2VydmVyVG9Vc2VyQ2hhbm5lbC5oYW5kbGVFdmVudChldmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc2lnbmluKCkge1xuICAgIGlmICh0aGlzLnNpZ25pbl9yZXF1ZXN0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNpZ25pbl9yZXF1ZXN0ZWQgPSB0cnVlO1xuICAgIHRoaXMuX3NpZ25pbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2lnbmluKCkge1xuICAgIGlmICghdGhpcy5zaWduaW5fcmVxdWVzdGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbmV3U2lnbmluUHJvbWlzZUlmTmVlZGVkKCk7XG5cbiAgICBpZiAodGhpcy5wdXNoZXIuY29ubmVjdGlvbi5zdGF0ZSAhPT0gJ2Nvbm5lY3RlZCcpIHtcbiAgICAgIC8vIFNpZ25pbiB3aWxsIGJlIGF0dGVtcHRlZCB3aGVuIHRoZSBjb25uZWN0aW9uIGlzIGNvbm5lY3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHVzaGVyLmNvbmZpZy51c2VyQXV0aGVudGljYXRvcihcbiAgICAgIHtcbiAgICAgICAgc29ja2V0SWQ6IHRoaXMucHVzaGVyLmNvbm5lY3Rpb24uc29ja2V0X2lkXG4gICAgICB9LFxuICAgICAgdGhpcy5fb25BdXRob3JpemVcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfb25BdXRob3JpemU6IFVzZXJBdXRoZW50aWNhdGlvbkNhbGxiYWNrID0gKFxuICAgIGVycixcbiAgICBhdXRoRGF0YTogVXNlckF1dGhlbnRpY2F0aW9uRGF0YVxuICApID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBMb2dnZXIud2FybihgRXJyb3IgZHVyaW5nIHNpZ25pbjogJHtlcnJ9YCk7XG4gICAgICB0aGlzLl9jbGVhbnVwKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wdXNoZXIuc2VuZF9ldmVudCgncHVzaGVyOnNpZ25pbicsIHtcbiAgICAgIGF1dGg6IGF1dGhEYXRhLmF1dGgsXG4gICAgICB1c2VyX2RhdGE6IGF1dGhEYXRhLnVzZXJfZGF0YVxuICAgIH0pO1xuXG4gICAgLy8gTGF0ZXIgd2hlbiB3ZSBnZXQgcHVzaGVyOnNpbmdpbl9zdWNjZXNzIGV2ZW50LCB0aGUgdXNlciB3aWxsIGJlIG1hcmtlZCBhcyBzaWduZWQgaW5cbiAgfTtcblxuICBwcml2YXRlIF9vblNpZ25pblN1Y2Nlc3MoZGF0YTogYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMudXNlcl9kYXRhID0gSlNPTi5wYXJzZShkYXRhLnVzZXJfZGF0YSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgTG9nZ2VyLmVycm9yKGBGYWlsZWQgcGFyc2luZyB1c2VyIGRhdGEgYWZ0ZXIgc2lnbmluOiAke2RhdGEudXNlcl9kYXRhfWApO1xuICAgICAgdGhpcy5fY2xlYW51cCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy51c2VyX2RhdGEuaWQgIT09ICdzdHJpbmcnIHx8IHRoaXMudXNlcl9kYXRhLmlkID09PSAnJykge1xuICAgICAgTG9nZ2VyLmVycm9yKFxuICAgICAgICBgdXNlcl9kYXRhIGRvZXNuJ3QgY29udGFpbiBhbiBpZC4gdXNlcl9kYXRhOiAke3RoaXMudXNlcl9kYXRhfWBcbiAgICAgICk7XG4gICAgICB0aGlzLl9jbGVhbnVwKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gU2lnbmluIHN1Y2NlZWRlZFxuICAgIHRoaXMuX3NpZ25pbkRvbmVSZXNvbHZlKCk7XG4gICAgdGhpcy5fc3Vic2NyaWJlQ2hhbm5lbHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3N1YnNjcmliZUNoYW5uZWxzKCkge1xuICAgIGNvbnN0IGVuc3VyZV9zdWJzY3JpYmVkID0gY2hhbm5lbCA9PiB7XG4gICAgICBpZiAoY2hhbm5lbC5zdWJzY3JpcHRpb25QZW5kaW5nICYmIGNoYW5uZWwuc3Vic2NyaXB0aW9uQ2FuY2VsbGVkKSB7XG4gICAgICAgIGNoYW5uZWwucmVpbnN0YXRlU3Vic2NyaXB0aW9uKCk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAhY2hhbm5lbC5zdWJzY3JpcHRpb25QZW5kaW5nICYmXG4gICAgICAgIHRoaXMucHVzaGVyLmNvbm5lY3Rpb24uc3RhdGUgPT09ICdjb25uZWN0ZWQnXG4gICAgICApIHtcbiAgICAgICAgY2hhbm5lbC5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5zZXJ2ZXJUb1VzZXJDaGFubmVsID0gbmV3IENoYW5uZWwoXG4gICAgICBgI3NlcnZlci10by11c2VyLSR7dGhpcy51c2VyX2RhdGEuaWR9YCxcbiAgICAgIHRoaXMucHVzaGVyXG4gICAgKTtcbiAgICB0aGlzLnNlcnZlclRvVXNlckNoYW5uZWwuYmluZF9nbG9iYWwoKGV2ZW50TmFtZSwgZGF0YSkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBldmVudE5hbWUuaW5kZXhPZigncHVzaGVyX2ludGVybmFsOicpID09PSAwIHx8XG4gICAgICAgIGV2ZW50TmFtZS5pbmRleE9mKCdwdXNoZXI6JykgPT09IDBcbiAgICAgICkge1xuICAgICAgICAvLyBpZ25vcmUgaW50ZXJuYWwgZXZlbnRzXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdChldmVudE5hbWUsIGRhdGEpO1xuICAgIH0pO1xuICAgIGVuc3VyZV9zdWJzY3JpYmVkKHRoaXMuc2VydmVyVG9Vc2VyQ2hhbm5lbCk7XG4gIH1cblxuICBwcml2YXRlIF9jbGVhbnVwKCkge1xuICAgIHRoaXMudXNlcl9kYXRhID0gbnVsbDtcbiAgICBpZiAodGhpcy5zZXJ2ZXJUb1VzZXJDaGFubmVsKSB7XG4gICAgICB0aGlzLnNlcnZlclRvVXNlckNoYW5uZWwudW5iaW5kX2FsbCgpO1xuICAgICAgdGhpcy5zZXJ2ZXJUb1VzZXJDaGFubmVsLmRpc2Nvbm5lY3QoKTtcbiAgICAgIHRoaXMuc2VydmVyVG9Vc2VyQ2hhbm5lbCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2lnbmluX3JlcXVlc3RlZCkge1xuICAgICAgLy8gSWYgc2lnbmluIGlzIGluIHByb2dyZXNzIGFuZCBjbGVhbnVwIGlzIGNhbGxlZCxcbiAgICAgIC8vIE1hcmsgdGhlIGN1cnJlbnQgc2lnbmluIHByb2Nlc3MgYXMgZG9uZS5cbiAgICAgIHRoaXMuX3NpZ25pbkRvbmVSZXNvbHZlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfbmV3U2lnbmluUHJvbWlzZUlmTmVlZGVkKCkge1xuICAgIGlmICghdGhpcy5zaWduaW5fcmVxdWVzdGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSBwcm9taXNlIGFuZCBpdCBpcyBub3QgcmVzb2x2ZWQsIHJldHVybiB3aXRob3V0IGNyZWF0aW5nIGEgbmV3IG9uZS5cbiAgICBpZiAodGhpcy5zaWduaW5Eb25lUHJvbWlzZSAmJiAhKHRoaXMuc2lnbmluRG9uZVByb21pc2UgYXMgYW55KS5kb25lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhpcyBwcm9taXNlIGlzIG5ldmVyIHJlamVjdGVkLlxuICAgIC8vIEl0IGdldHMgcmVzb2x2ZWQgd2hlbiB0aGUgc2lnbmluIHByb2Nlc3MgaXMgZG9uZSB3aGV0aGVyIGl0IGZhaWxlZCBvciBzdWNjZWVkZWRcbiAgICBjb25zdCB7IHByb21pc2UsIHJlc29sdmUsIHJlamVjdDogXyB9ID0gZmxhdFByb21pc2UoKTtcbiAgICAocHJvbWlzZSBhcyBhbnkpLmRvbmUgPSBmYWxzZTtcbiAgICBjb25zdCBzZXREb25lID0gKCkgPT4ge1xuICAgICAgKHByb21pc2UgYXMgYW55KS5kb25lID0gdHJ1ZTtcbiAgICB9O1xuICAgIHByb21pc2UudGhlbihzZXREb25lKS5jYXRjaChzZXREb25lKTtcbiAgICB0aGlzLnNpZ25pbkRvbmVQcm9taXNlID0gcHJvbWlzZTtcbiAgICB0aGlzLl9zaWduaW5Eb25lUmVzb2x2ZSA9IHJlc29sdmU7XG4gIH1cbn1cbiIsICJpbXBvcnQgQWJzdHJhY3RSdW50aW1lIGZyb20gJy4uL3J1bnRpbWVzL2ludGVyZmFjZSc7XG5pbXBvcnQgUnVudGltZSBmcm9tICdydW50aW1lJztcbmltcG9ydCBVdGlsIGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgKiBhcyBDb2xsZWN0aW9ucyBmcm9tICcuL3V0aWxzL2NvbGxlY3Rpb25zJztcbmltcG9ydCBDaGFubmVscyBmcm9tICcuL2NoYW5uZWxzL2NoYW5uZWxzJztcbmltcG9ydCBDaGFubmVsIGZyb20gJy4vY2hhbm5lbHMvY2hhbm5lbCc7XG5pbXBvcnQgeyBkZWZhdWx0IGFzIEV2ZW50c0Rpc3BhdGNoZXIgfSBmcm9tICcuL2V2ZW50cy9kaXNwYXRjaGVyJztcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuL3RpbWVsaW5lL3RpbWVsaW5lJztcbmltcG9ydCBUaW1lbGluZVNlbmRlciBmcm9tICcuL3RpbWVsaW5lL3RpbWVsaW5lX3NlbmRlcic7XG5pbXBvcnQgVGltZWxpbmVMZXZlbCBmcm9tICcuL3RpbWVsaW5lL2xldmVsJztcbmltcG9ydCB7IGRlZmluZVRyYW5zcG9ydCB9IGZyb20gJy4vc3RyYXRlZ2llcy9zdHJhdGVneV9idWlsZGVyJztcbmltcG9ydCBDb25uZWN0aW9uTWFuYWdlciBmcm9tICcuL2Nvbm5lY3Rpb24vY29ubmVjdGlvbl9tYW5hZ2VyJztcbmltcG9ydCBDb25uZWN0aW9uTWFuYWdlck9wdGlvbnMgZnJvbSAnLi9jb25uZWN0aW9uL2Nvbm5lY3Rpb25fbWFuYWdlcl9vcHRpb25zJztcbmltcG9ydCB7IFBlcmlvZGljVGltZXIgfSBmcm9tICcuL3V0aWxzL3RpbWVycyc7XG5pbXBvcnQgRGVmYXVsdHMgZnJvbSAnLi9kZWZhdWx0cyc7XG5pbXBvcnQgKiBhcyBEZWZhdWx0Q29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IEZhY3RvcnkgZnJvbSAnLi91dGlscy9mYWN0b3J5JztcbmltcG9ydCBVcmxTdG9yZSBmcm9tICdjb3JlL3V0aWxzL3VybF9zdG9yZSc7XG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSAnLi9vcHRpb25zJztcbmltcG9ydCB7IENvbmZpZywgZ2V0Q29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IFN0cmF0ZWd5T3B0aW9ucyBmcm9tICcuL3N0cmF0ZWdpZXMvc3RyYXRlZ3lfb3B0aW9ucyc7XG5pbXBvcnQgVXNlckZhY2FkZSBmcm9tICcuL3VzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQdXNoZXIge1xuICAvKiAgU1RBVElDIFBST1BFUlRJRVMgKi9cbiAgc3RhdGljIGluc3RhbmNlczogUHVzaGVyW10gPSBbXTtcbiAgc3RhdGljIGlzUmVhZHk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgc3RhdGljIGxvZ1RvQ29uc29sZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8vIGZvciBqc29ucFxuICBzdGF0aWMgUnVudGltZTogQWJzdHJhY3RSdW50aW1lID0gUnVudGltZTtcbiAgc3RhdGljIFNjcmlwdFJlY2VpdmVyczogYW55ID0gKDxhbnk+UnVudGltZSkuU2NyaXB0UmVjZWl2ZXJzO1xuICBzdGF0aWMgRGVwZW5kZW5jaWVzUmVjZWl2ZXJzOiBhbnkgPSAoPGFueT5SdW50aW1lKS5EZXBlbmRlbmNpZXNSZWNlaXZlcnM7XG4gIHN0YXRpYyBhdXRoX2NhbGxiYWNrczogYW55ID0gKDxhbnk+UnVudGltZSkuYXV0aF9jYWxsYmFja3M7XG5cbiAgc3RhdGljIHJlYWR5KCkge1xuICAgIFB1c2hlci5pc1JlYWR5ID0gdHJ1ZTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IFB1c2hlci5pbnN0YW5jZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBQdXNoZXIuaW5zdGFuY2VzW2ldLmNvbm5lY3QoKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbG9nOiAobWVzc2FnZTogYW55KSA9PiB2b2lkO1xuXG4gIHByaXZhdGUgc3RhdGljIGdldENsaWVudEZlYXR1cmVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gQ29sbGVjdGlvbnMua2V5cyhcbiAgICAgIENvbGxlY3Rpb25zLmZpbHRlck9iamVjdCh7IHdzOiBSdW50aW1lLlRyYW5zcG9ydHMud3MgfSwgZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gdC5pc1N1cHBvcnRlZCh7fSk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICAvKiBJTlNUQU5DRSBQUk9QRVJUSUVTICovXG4gIGtleTogc3RyaW5nO1xuICBjb25maWc6IENvbmZpZztcbiAgY2hhbm5lbHM6IENoYW5uZWxzO1xuICBnbG9iYWxfZW1pdHRlcjogRXZlbnRzRGlzcGF0Y2hlcjtcbiAgc2Vzc2lvbklEOiBudW1iZXI7XG4gIHRpbWVsaW5lOiBUaW1lbGluZTtcbiAgdGltZWxpbmVTZW5kZXI6IFRpbWVsaW5lU2VuZGVyO1xuICBjb25uZWN0aW9uOiBDb25uZWN0aW9uTWFuYWdlcjtcbiAgdGltZWxpbmVTZW5kZXJUaW1lcjogUGVyaW9kaWNUaW1lcjtcbiAgdXNlcjogVXNlckZhY2FkZTtcbiAgY29uc3RydWN0b3IoYXBwX2tleTogc3RyaW5nLCBvcHRpb25zPzogT3B0aW9ucykge1xuICAgIGNoZWNrQXBwS2V5KGFwcF9rZXkpO1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmICghb3B0aW9ucy5jbHVzdGVyICYmICEob3B0aW9ucy53c0hvc3QgfHwgb3B0aW9ucy5odHRwSG9zdCkpIHtcbiAgICAgIGxldCBzdWZmaXggPSBVcmxTdG9yZS5idWlsZExvZ1N1ZmZpeCgnamF2YXNjcmlwdFF1aWNrU3RhcnQnKTtcbiAgICAgIExvZ2dlci53YXJuKFxuICAgICAgICBgWW91IHNob3VsZCBhbHdheXMgc3BlY2lmeSBhIGNsdXN0ZXIgd2hlbiBjb25uZWN0aW5nLiAke3N1ZmZpeH1gXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoJ2Rpc2FibGVTdGF0cycgaW4gb3B0aW9ucykge1xuICAgICAgTG9nZ2VyLndhcm4oXG4gICAgICAgICdUaGUgZGlzYWJsZVN0YXRzIG9wdGlvbiBpcyBkZXByZWNhdGVkIGluIGZhdm9yIG9mIGVuYWJsZVN0YXRzJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmtleSA9IGFwcF9rZXk7XG4gICAgdGhpcy5jb25maWcgPSBnZXRDb25maWcob3B0aW9ucywgdGhpcyk7XG5cbiAgICB0aGlzLmNoYW5uZWxzID0gRmFjdG9yeS5jcmVhdGVDaGFubmVscygpO1xuICAgIHRoaXMuZ2xvYmFsX2VtaXR0ZXIgPSBuZXcgRXZlbnRzRGlzcGF0Y2hlcigpO1xuICAgIHRoaXMuc2Vzc2lvbklEID0gUnVudGltZS5yYW5kb21JbnQoMTAwMDAwMDAwMCk7XG5cbiAgICB0aGlzLnRpbWVsaW5lID0gbmV3IFRpbWVsaW5lKHRoaXMua2V5LCB0aGlzLnNlc3Npb25JRCwge1xuICAgICAgY2x1c3RlcjogdGhpcy5jb25maWcuY2x1c3RlcixcbiAgICAgIGZlYXR1cmVzOiBQdXNoZXIuZ2V0Q2xpZW50RmVhdHVyZXMoKSxcbiAgICAgIHBhcmFtczogdGhpcy5jb25maWcudGltZWxpbmVQYXJhbXMgfHwge30sXG4gICAgICBsaW1pdDogNTAsXG4gICAgICBsZXZlbDogVGltZWxpbmVMZXZlbC5JTkZPLFxuICAgICAgdmVyc2lvbjogRGVmYXVsdHMuVkVSU0lPTlxuICAgIH0pO1xuICAgIGlmICh0aGlzLmNvbmZpZy5lbmFibGVTdGF0cykge1xuICAgICAgdGhpcy50aW1lbGluZVNlbmRlciA9IEZhY3RvcnkuY3JlYXRlVGltZWxpbmVTZW5kZXIodGhpcy50aW1lbGluZSwge1xuICAgICAgICBob3N0OiB0aGlzLmNvbmZpZy5zdGF0c0hvc3QsXG4gICAgICAgIHBhdGg6ICcvdGltZWxpbmUvdjIvJyArIFJ1bnRpbWUuVGltZWxpbmVUcmFuc3BvcnQubmFtZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIGdldFN0cmF0ZWd5ID0gKG9wdGlvbnM6IFN0cmF0ZWd5T3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIFJ1bnRpbWUuZ2V0RGVmYXVsdFN0cmF0ZWd5KHRoaXMuY29uZmlnLCBvcHRpb25zLCBkZWZpbmVUcmFuc3BvcnQpO1xuICAgIH07XG5cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBGYWN0b3J5LmNyZWF0ZUNvbm5lY3Rpb25NYW5hZ2VyKHRoaXMua2V5LCB7XG4gICAgICBnZXRTdHJhdGVneTogZ2V0U3RyYXRlZ3ksXG4gICAgICB0aW1lbGluZTogdGhpcy50aW1lbGluZSxcbiAgICAgIGFjdGl2aXR5VGltZW91dDogdGhpcy5jb25maWcuYWN0aXZpdHlUaW1lb3V0LFxuICAgICAgcG9uZ1RpbWVvdXQ6IHRoaXMuY29uZmlnLnBvbmdUaW1lb3V0LFxuICAgICAgdW5hdmFpbGFibGVUaW1lb3V0OiB0aGlzLmNvbmZpZy51bmF2YWlsYWJsZVRpbWVvdXQsXG4gICAgICB1c2VUTFM6IEJvb2xlYW4odGhpcy5jb25maWcudXNlVExTKVxuICAgIH0pO1xuXG4gICAgdGhpcy5jb25uZWN0aW9uLmJpbmQoJ2Nvbm5lY3RlZCcsICgpID0+IHtcbiAgICAgIHRoaXMuc3Vic2NyaWJlQWxsKCk7XG4gICAgICBpZiAodGhpcy50aW1lbGluZVNlbmRlcikge1xuICAgICAgICB0aGlzLnRpbWVsaW5lU2VuZGVyLnNlbmQodGhpcy5jb25uZWN0aW9uLmlzVXNpbmdUTFMoKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbm5lY3Rpb24uYmluZCgnbWVzc2FnZScsIGV2ZW50ID0+IHtcbiAgICAgIHZhciBldmVudE5hbWUgPSBldmVudC5ldmVudDtcbiAgICAgIHZhciBpbnRlcm5hbCA9IGV2ZW50TmFtZS5pbmRleE9mKCdwdXNoZXJfaW50ZXJuYWw6JykgPT09IDA7XG4gICAgICBpZiAoZXZlbnQuY2hhbm5lbCkge1xuICAgICAgICB2YXIgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbChldmVudC5jaGFubmVsKTtcbiAgICAgICAgaWYgKGNoYW5uZWwpIHtcbiAgICAgICAgICBjaGFubmVsLmhhbmRsZUV2ZW50KGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRW1pdCBnbG9iYWxseSBbZGVwcmVjYXRlZF1cbiAgICAgIGlmICghaW50ZXJuYWwpIHtcbiAgICAgICAgdGhpcy5nbG9iYWxfZW1pdHRlci5lbWl0KGV2ZW50LmV2ZW50LCBldmVudC5kYXRhKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmNvbm5lY3Rpb24uYmluZCgnY29ubmVjdGluZycsICgpID0+IHtcbiAgICAgIHRoaXMuY2hhbm5lbHMuZGlzY29ubmVjdCgpO1xuICAgIH0pO1xuICAgIHRoaXMuY29ubmVjdGlvbi5iaW5kKCdkaXNjb25uZWN0ZWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmNoYW5uZWxzLmRpc2Nvbm5lY3QoKTtcbiAgICB9KTtcbiAgICB0aGlzLmNvbm5lY3Rpb24uYmluZCgnZXJyb3InLCBlcnIgPT4ge1xuICAgICAgTG9nZ2VyLndhcm4oZXJyKTtcbiAgICB9KTtcblxuICAgIFB1c2hlci5pbnN0YW5jZXMucHVzaCh0aGlzKTtcbiAgICB0aGlzLnRpbWVsaW5lLmluZm8oeyBpbnN0YW5jZXM6IFB1c2hlci5pbnN0YW5jZXMubGVuZ3RoIH0pO1xuXG4gICAgdGhpcy51c2VyID0gbmV3IFVzZXJGYWNhZGUodGhpcyk7XG5cbiAgICBpZiAoUHVzaGVyLmlzUmVhZHkpIHtcbiAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIGNoYW5uZWwobmFtZTogc3RyaW5nKTogQ2hhbm5lbCB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHMuZmluZChuYW1lKTtcbiAgfVxuXG4gIGFsbENoYW5uZWxzKCk6IENoYW5uZWxbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHMuYWxsKCk7XG4gIH1cblxuICBjb25uZWN0KCkge1xuICAgIHRoaXMuY29ubmVjdGlvbi5jb25uZWN0KCk7XG5cbiAgICBpZiAodGhpcy50aW1lbGluZVNlbmRlcikge1xuICAgICAgaWYgKCF0aGlzLnRpbWVsaW5lU2VuZGVyVGltZXIpIHtcbiAgICAgICAgdmFyIHVzaW5nVExTID0gdGhpcy5jb25uZWN0aW9uLmlzVXNpbmdUTFMoKTtcbiAgICAgICAgdmFyIHRpbWVsaW5lU2VuZGVyID0gdGhpcy50aW1lbGluZVNlbmRlcjtcbiAgICAgICAgdGhpcy50aW1lbGluZVNlbmRlclRpbWVyID0gbmV3IFBlcmlvZGljVGltZXIoNjAwMDAsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVsaW5lU2VuZGVyLnNlbmQodXNpbmdUTFMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMuY29ubmVjdGlvbi5kaXNjb25uZWN0KCk7XG5cbiAgICBpZiAodGhpcy50aW1lbGluZVNlbmRlclRpbWVyKSB7XG4gICAgICB0aGlzLnRpbWVsaW5lU2VuZGVyVGltZXIuZW5zdXJlQWJvcnRlZCgpO1xuICAgICAgdGhpcy50aW1lbGluZVNlbmRlclRpbWVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBiaW5kKGV2ZW50X25hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBjb250ZXh0PzogYW55KTogUHVzaGVyIHtcbiAgICB0aGlzLmdsb2JhbF9lbWl0dGVyLmJpbmQoZXZlbnRfbmFtZSwgY2FsbGJhY2ssIGNvbnRleHQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdW5iaW5kKGV2ZW50X25hbWU/OiBzdHJpbmcsIGNhbGxiYWNrPzogRnVuY3Rpb24sIGNvbnRleHQ/OiBhbnkpOiBQdXNoZXIge1xuICAgIHRoaXMuZ2xvYmFsX2VtaXR0ZXIudW5iaW5kKGV2ZW50X25hbWUsIGNhbGxiYWNrLCBjb250ZXh0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGJpbmRfZ2xvYmFsKGNhbGxiYWNrOiBGdW5jdGlvbik6IFB1c2hlciB7XG4gICAgdGhpcy5nbG9iYWxfZW1pdHRlci5iaW5kX2dsb2JhbChjYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1bmJpbmRfZ2xvYmFsKGNhbGxiYWNrPzogRnVuY3Rpb24pOiBQdXNoZXIge1xuICAgIHRoaXMuZ2xvYmFsX2VtaXR0ZXIudW5iaW5kX2dsb2JhbChjYWxsYmFjayk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1bmJpbmRfYWxsKGNhbGxiYWNrPzogRnVuY3Rpb24pOiBQdXNoZXIge1xuICAgIHRoaXMuZ2xvYmFsX2VtaXR0ZXIudW5iaW5kX2FsbCgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3Vic2NyaWJlQWxsKCkge1xuICAgIHZhciBjaGFubmVsTmFtZTtcbiAgICBmb3IgKGNoYW5uZWxOYW1lIGluIHRoaXMuY2hhbm5lbHMuY2hhbm5lbHMpIHtcbiAgICAgIGlmICh0aGlzLmNoYW5uZWxzLmNoYW5uZWxzLmhhc093blByb3BlcnR5KGNoYW5uZWxOYW1lKSkge1xuICAgICAgICB0aGlzLnN1YnNjcmliZShjaGFubmVsTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3Vic2NyaWJlKGNoYW5uZWxfbmFtZTogc3RyaW5nKSB7XG4gICAgdmFyIGNoYW5uZWwgPSB0aGlzLmNoYW5uZWxzLmFkZChjaGFubmVsX25hbWUsIHRoaXMpO1xuICAgIGlmIChjaGFubmVsLnN1YnNjcmlwdGlvblBlbmRpbmcgJiYgY2hhbm5lbC5zdWJzY3JpcHRpb25DYW5jZWxsZWQpIHtcbiAgICAgIGNoYW5uZWwucmVpbnN0YXRlU3Vic2NyaXB0aW9uKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICFjaGFubmVsLnN1YnNjcmlwdGlvblBlbmRpbmcgJiZcbiAgICAgIHRoaXMuY29ubmVjdGlvbi5zdGF0ZSA9PT0gJ2Nvbm5lY3RlZCdcbiAgICApIHtcbiAgICAgIGNoYW5uZWwuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHJldHVybiBjaGFubmVsO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoY2hhbm5lbF9uYW1lOiBzdHJpbmcpIHtcbiAgICB2YXIgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHMuZmluZChjaGFubmVsX25hbWUpO1xuICAgIGlmIChjaGFubmVsICYmIGNoYW5uZWwuc3Vic2NyaXB0aW9uUGVuZGluZykge1xuICAgICAgY2hhbm5lbC5jYW5jZWxTdWJzY3JpcHRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHMucmVtb3ZlKGNoYW5uZWxfbmFtZSk7XG4gICAgICBpZiAoY2hhbm5lbCAmJiBjaGFubmVsLnN1YnNjcmliZWQpIHtcbiAgICAgICAgY2hhbm5lbC51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNlbmRfZXZlbnQoZXZlbnRfbmFtZTogc3RyaW5nLCBkYXRhOiBhbnksIGNoYW5uZWw/OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnNlbmRfZXZlbnQoZXZlbnRfbmFtZSwgZGF0YSwgY2hhbm5lbCk7XG4gIH1cblxuICBzaG91bGRVc2VUTFMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLnVzZVRMUztcbiAgfVxuXG4gIHNpZ25pbigpIHtcbiAgICB0aGlzLnVzZXIuc2lnbmluKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tBcHBLZXkoa2V5KSB7XG4gIGlmIChrZXkgPT09IG51bGwgfHwga2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyAnWW91IG11c3QgcGFzcyB5b3VyIGFwcCBrZXkgd2hlbiB5b3UgaW5zdGFudGlhdGUgUHVzaGVyLic7XG4gIH1cbn1cblxuUnVudGltZS5zZXR1cChQdXNoZXIpO1xuIiwgImZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gIFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjtcblxuICByZXR1cm4gX3R5cGVvZiA9IFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIFwic3ltYm9sXCIgPT0gdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA/IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgfSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICB9LCBfdHlwZW9mKG9iaik7XG59XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb25zdHJ1Y3RvciwgXCJwcm90b3R5cGVcIiwge1xuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9KTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuXG5mdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdWJDbGFzcywgXCJwcm90b3R5cGVcIiwge1xuICAgIHdyaXRhYmxlOiBmYWxzZVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7XG59XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gIF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTtcbiAgfTtcbiAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTtcbn1cblxuZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgby5fX3Byb3RvX18gPSBwO1xuICAgIHJldHVybiBvO1xuICB9O1xuXG4gIHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7XG59XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTtcbiAgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTtcbiAgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTtcblxuICB0cnkge1xuICAgIEJvb2xlYW4ucHJvdG90eXBlLnZhbHVlT2YuY2FsbChSZWZsZWN0LmNvbnN0cnVjdChCb29sZWFuLCBbXSwgZnVuY3Rpb24gKCkge30pKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHtcbiAgaWYgKHNlbGYgPT09IHZvaWQgMCkge1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBzZWxmO1xufVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7XG4gIGlmIChjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgIHJldHVybiBjYWxsO1xuICB9IGVsc2UgaWYgKGNhbGwgIT09IHZvaWQgMCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJEZXJpdmVkIGNvbnN0cnVjdG9ycyBtYXkgb25seSByZXR1cm4gb2JqZWN0IG9yIHVuZGVmaW5lZFwiKTtcbiAgfVxuXG4gIHJldHVybiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpO1xufVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkge1xuICB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTtcblxuICByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7XG4gICAgdmFyIFN1cGVyID0gX2dldFByb3RvdHlwZU9mKERlcml2ZWQpLFxuICAgICAgICByZXN1bHQ7XG5cbiAgICBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkge1xuICAgICAgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjtcblxuICAgICAgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTtcbiAgfTtcbn1cblxuLyoqXHJcbiAqIFRoaXMgY2xhc3MgcmVwcmVzZW50cyBhIGJhc2ljIGNoYW5uZWwuXHJcbiAqL1xudmFyIENoYW5uZWwgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDaGFubmVsKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDaGFubmVsKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhDaGFubmVsLCBbe1xuICAgIGtleTogXCJsaXN0ZW5Gb3JXaGlzcGVyXCIsXG4gICAgdmFsdWU6XG4gICAgLyoqXHJcbiAgICAgKiBMaXN0ZW4gZm9yIGEgd2hpc3BlciBldmVudCBvbiB0aGUgY2hhbm5lbCBpbnN0YW5jZS5cclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxpc3RlbkZvcldoaXNwZXIoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy5saXN0ZW4oJy5jbGllbnQtJyArIGV2ZW50LCBjYWxsYmFjayk7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuIGZvciBhbiBldmVudCBvbiB0aGUgY2hhbm5lbCBpbnN0YW5jZS5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwibm90aWZpY2F0aW9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG5vdGlmaWNhdGlvbihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMubGlzdGVuKCcuSWxsdW1pbmF0ZVxcXFxOb3RpZmljYXRpb25zXFxcXEV2ZW50c1xcXFxCcm9hZGNhc3ROb3RpZmljYXRpb25DcmVhdGVkJywgY2FsbGJhY2spO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIFN0b3AgbGlzdGVuaW5nIGZvciBhIHdoaXNwZXIgZXZlbnQgb24gdGhlIGNoYW5uZWwgaW5zdGFuY2UuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInN0b3BMaXN0ZW5pbmdGb3JXaGlzcGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3BMaXN0ZW5pbmdGb3JXaGlzcGVyKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcExpc3RlbmluZygnLmNsaWVudC0nICsgZXZlbnQsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ2hhbm5lbDtcbn0oKTtcblxuLyoqXHJcbiAqIEV2ZW50IG5hbWUgZm9ybWF0dGVyXHJcbiAqL1xudmFyIEV2ZW50Rm9ybWF0dGVyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgbmV3IGNsYXNzIGluc3RhbmNlLlxyXG4gICAqL1xuICBmdW5jdGlvbiBFdmVudEZvcm1hdHRlcihuYW1lc3BhY2UpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRXZlbnRGb3JtYXR0ZXIpO1xuXG4gICAgdGhpcy5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7IC8vXG4gIH1cbiAgLyoqXHJcbiAgICogRm9ybWF0IHRoZSBnaXZlbiBldmVudCBuYW1lLlxyXG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKEV2ZW50Rm9ybWF0dGVyLCBbe1xuICAgIGtleTogXCJmb3JtYXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZm9ybWF0KGV2ZW50KSB7XG4gICAgICBpZiAoWycuJywgJ1xcXFwnXS5pbmNsdWRlcyhldmVudC5jaGFyQXQoMCkpKSB7XG4gICAgICAgIHJldHVybiBldmVudC5zdWJzdHJpbmcoMSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubmFtZXNwYWNlKSB7XG4gICAgICAgIGV2ZW50ID0gdGhpcy5uYW1lc3BhY2UgKyAnLicgKyBldmVudDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGV2ZW50LnJlcGxhY2UoL1xcLi9nLCAnXFxcXCcpO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgZXZlbnQgbmFtZXNwYWNlLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJzZXROYW1lc3BhY2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0TmFtZXNwYWNlKHZhbHVlKSB7XG4gICAgICB0aGlzLm5hbWVzcGFjZSA9IHZhbHVlO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBFdmVudEZvcm1hdHRlcjtcbn0oKTtcblxuZnVuY3Rpb24gaXNDb25zdHJ1Y3RvcihvYmopIHtcbiAgdHJ5IHtcbiAgICBuZXcgb2JqKCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChlcnIubWVzc2FnZS5pbmNsdWRlcygnaXMgbm90IGEgY29uc3RydWN0b3InKSkgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxyXG4gKiBUaGlzIGNsYXNzIHJlcHJlc2VudHMgYSBQdXNoZXIgY2hhbm5lbC5cclxuICovXG5cbnZhciBQdXNoZXJDaGFubmVsID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfQ2hhbm5lbCkge1xuICBfaW5oZXJpdHMoUHVzaGVyQ2hhbm5lbCwgX0NoYW5uZWwpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoUHVzaGVyQ2hhbm5lbCk7XG5cbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgbmV3IGNsYXNzIGluc3RhbmNlLlxyXG4gICAqL1xuICBmdW5jdGlvbiBQdXNoZXJDaGFubmVsKHB1c2hlciwgbmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQdXNoZXJDaGFubmVsKTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgX3RoaXMubmFtZSA9IG5hbWU7XG4gICAgX3RoaXMucHVzaGVyID0gcHVzaGVyO1xuICAgIF90aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIF90aGlzLmV2ZW50Rm9ybWF0dGVyID0gbmV3IEV2ZW50Rm9ybWF0dGVyKF90aGlzLm9wdGlvbnMubmFtZXNwYWNlKTtcblxuICAgIF90aGlzLnN1YnNjcmliZSgpO1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG4gIC8qKlxyXG4gICAqIFN1YnNjcmliZSB0byBhIFB1c2hlciBjaGFubmVsLlxyXG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKFB1c2hlckNoYW5uZWwsIFt7XG4gICAga2V5OiBcInN1YnNjcmliZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdWJzY3JpYmUoKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMucHVzaGVyLnN1YnNjcmliZSh0aGlzLm5hbWUpO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIFVuc3Vic2NyaWJlIGZyb20gYSBQdXNoZXIgY2hhbm5lbC5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwidW5zdWJzY3JpYmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdW5zdWJzY3JpYmUoKSB7XG4gICAgICB0aGlzLnB1c2hlci51bnN1YnNjcmliZSh0aGlzLm5hbWUpO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIExpc3RlbiBmb3IgYW4gZXZlbnQgb24gdGhlIGNoYW5uZWwgaW5zdGFuY2UuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImxpc3RlblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsaXN0ZW4oZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLm9uKHRoaXMuZXZlbnRGb3JtYXR0ZXIuZm9ybWF0KGV2ZW50KSwgY2FsbGJhY2spO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuIGZvciBhbGwgZXZlbnRzIG9uIHRoZSBjaGFubmVsIGluc3RhbmNlLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJsaXN0ZW5Ub0FsbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsaXN0ZW5Ub0FsbChjYWxsYmFjaykge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLmJpbmRfZ2xvYmFsKGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xuICAgICAgICBpZiAoZXZlbnQuc3RhcnRzV2l0aCgncHVzaGVyOicpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5hbWVzcGFjZSA9IF90aGlzMi5vcHRpb25zLm5hbWVzcGFjZS5yZXBsYWNlKC9cXC4vZywgJ1xcXFwnKTtcblxuICAgICAgICB2YXIgZm9ybWF0dGVkRXZlbnQgPSBldmVudC5zdGFydHNXaXRoKG5hbWVzcGFjZSkgPyBldmVudC5zdWJzdHJpbmcobmFtZXNwYWNlLmxlbmd0aCArIDEpIDogJy4nICsgZXZlbnQ7XG4gICAgICAgIGNhbGxiYWNrKGZvcm1hdHRlZEV2ZW50LCBkYXRhKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogU3RvcCBsaXN0ZW5pbmcgZm9yIGFuIGV2ZW50IG9uIHRoZSBjaGFubmVsIGluc3RhbmNlLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJzdG9wTGlzdGVuaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3BMaXN0ZW5pbmcoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5iaW5kKHRoaXMuZXZlbnRGb3JtYXR0ZXIuZm9ybWF0KGV2ZW50KSwgY2FsbGJhY2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5iaW5kKHRoaXMuZXZlbnRGb3JtYXR0ZXIuZm9ybWF0KGV2ZW50KSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIFN0b3AgbGlzdGVuaW5nIGZvciBhbGwgZXZlbnRzIG9uIHRoZSBjaGFubmVsIGluc3RhbmNlLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJzdG9wTGlzdGVuaW5nVG9BbGxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcExpc3RlbmluZ1RvQWxsKGNhbGxiYWNrKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5iaW5kX2dsb2JhbChjYWxsYmFjayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bmJpbmRfZ2xvYmFsKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIGEgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIGFueXRpbWUgYSBzdWJzY3JpcHRpb24gc3VjY2VlZHMuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInN1YnNjcmliZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3Vic2NyaWJlZChjYWxsYmFjaykge1xuICAgICAgdGhpcy5vbigncHVzaGVyOnN1YnNjcmlwdGlvbl9zdWNjZWVkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIGEgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIGFueXRpbWUgYSBzdWJzY3JpcHRpb24gZXJyb3Igb2NjdXJzLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJlcnJvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlcnJvcihjYWxsYmFjaykge1xuICAgICAgdGhpcy5vbigncHVzaGVyOnN1YnNjcmlwdGlvbl9lcnJvcicsIGZ1bmN0aW9uIChzdGF0dXMpIHtcbiAgICAgICAgY2FsbGJhY2soc3RhdHVzKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogQmluZCBhIGNoYW5uZWwgdG8gYW4gZXZlbnQuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIm9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24uYmluZChldmVudCwgY2FsbGJhY2spO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFB1c2hlckNoYW5uZWw7XG59KENoYW5uZWwpO1xuXG4vKipcclxuICogVGhpcyBjbGFzcyByZXByZXNlbnRzIGEgUHVzaGVyIHByaXZhdGUgY2hhbm5lbC5cclxuICovXG5cbnZhciBQdXNoZXJQcml2YXRlQ2hhbm5lbCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX1B1c2hlckNoYW5uZWwpIHtcbiAgX2luaGVyaXRzKFB1c2hlclByaXZhdGVDaGFubmVsLCBfUHVzaGVyQ2hhbm5lbCk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihQdXNoZXJQcml2YXRlQ2hhbm5lbCk7XG5cbiAgZnVuY3Rpb24gUHVzaGVyUHJpdmF0ZUNoYW5uZWwoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFB1c2hlclByaXZhdGVDaGFubmVsKTtcblxuICAgIHJldHVybiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhQdXNoZXJQcml2YXRlQ2hhbm5lbCwgW3tcbiAgICBrZXk6IFwid2hpc3BlclwiLFxuICAgIHZhbHVlOlxuICAgIC8qKlxyXG4gICAgICogU2VuZCBhIHdoaXNwZXIgZXZlbnQgdG8gb3RoZXIgY2xpZW50cyBpbiB0aGUgY2hhbm5lbC5cclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHdoaXNwZXIoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgICB0aGlzLnB1c2hlci5jaGFubmVscy5jaGFubmVsc1t0aGlzLm5hbWVdLnRyaWdnZXIoXCJjbGllbnQtXCIuY29uY2F0KGV2ZW50TmFtZSksIGRhdGEpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFB1c2hlclByaXZhdGVDaGFubmVsO1xufShQdXNoZXJDaGFubmVsKTtcblxuLyoqXHJcbiAqIFRoaXMgY2xhc3MgcmVwcmVzZW50cyBhIFB1c2hlciBwcml2YXRlIGNoYW5uZWwuXHJcbiAqL1xuXG52YXIgUHVzaGVyRW5jcnlwdGVkUHJpdmF0ZUNoYW5uZWwgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9QdXNoZXJDaGFubmVsKSB7XG4gIF9pbmhlcml0cyhQdXNoZXJFbmNyeXB0ZWRQcml2YXRlQ2hhbm5lbCwgX1B1c2hlckNoYW5uZWwpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoUHVzaGVyRW5jcnlwdGVkUHJpdmF0ZUNoYW5uZWwpO1xuXG4gIGZ1bmN0aW9uIFB1c2hlckVuY3J5cHRlZFByaXZhdGVDaGFubmVsKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQdXNoZXJFbmNyeXB0ZWRQcml2YXRlQ2hhbm5lbCk7XG5cbiAgICByZXR1cm4gX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUHVzaGVyRW5jcnlwdGVkUHJpdmF0ZUNoYW5uZWwsIFt7XG4gICAga2V5OiBcIndoaXNwZXJcIixcbiAgICB2YWx1ZTpcbiAgICAvKipcclxuICAgICAqIFNlbmQgYSB3aGlzcGVyIGV2ZW50IHRvIG90aGVyIGNsaWVudHMgaW4gdGhlIGNoYW5uZWwuXHJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB3aGlzcGVyKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgICAgdGhpcy5wdXNoZXIuY2hhbm5lbHMuY2hhbm5lbHNbdGhpcy5uYW1lXS50cmlnZ2VyKFwiY2xpZW50LVwiLmNvbmNhdChldmVudE5hbWUpLCBkYXRhKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBQdXNoZXJFbmNyeXB0ZWRQcml2YXRlQ2hhbm5lbDtcbn0oUHVzaGVyQ2hhbm5lbCk7XG5cbi8qKlxyXG4gKiBUaGlzIGNsYXNzIHJlcHJlc2VudHMgYSBQdXNoZXIgcHJlc2VuY2UgY2hhbm5lbC5cclxuICovXG5cbnZhciBQdXNoZXJQcmVzZW5jZUNoYW5uZWwgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9QdXNoZXJQcml2YXRlQ2hhbm5lbCkge1xuICBfaW5oZXJpdHMoUHVzaGVyUHJlc2VuY2VDaGFubmVsLCBfUHVzaGVyUHJpdmF0ZUNoYW5uZWwpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoUHVzaGVyUHJlc2VuY2VDaGFubmVsKTtcblxuICBmdW5jdGlvbiBQdXNoZXJQcmVzZW5jZUNoYW5uZWwoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFB1c2hlclByZXNlbmNlQ2hhbm5lbCk7XG5cbiAgICByZXR1cm4gX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoUHVzaGVyUHJlc2VuY2VDaGFubmVsLCBbe1xuICAgIGtleTogXCJoZXJlXCIsXG4gICAgdmFsdWU6XG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlciBhIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCBhbnl0aW1lIHRoZSBtZW1iZXIgbGlzdCBjaGFuZ2VzLlxyXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGVyZShjYWxsYmFjaykge1xuICAgICAgdGhpcy5vbigncHVzaGVyOnN1YnNjcmlwdGlvbl9zdWNjZWVkZWQnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBjYWxsYmFjayhPYmplY3Qua2V5cyhkYXRhLm1lbWJlcnMpLm1hcChmdW5jdGlvbiAoaykge1xuICAgICAgICAgIHJldHVybiBkYXRhLm1lbWJlcnNba107XG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuIGZvciBzb21lb25lIGpvaW5pbmcgdGhlIGNoYW5uZWwuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImpvaW5pbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gam9pbmluZyhjYWxsYmFjaykge1xuICAgICAgdGhpcy5vbigncHVzaGVyOm1lbWJlcl9hZGRlZCcsIGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICAgICAgY2FsbGJhY2sobWVtYmVyLmluZm8pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBTZW5kIGEgd2hpc3BlciBldmVudCB0byBvdGhlciBjbGllbnRzIGluIHRoZSBjaGFubmVsLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJ3aGlzcGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHdoaXNwZXIoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgICB0aGlzLnB1c2hlci5jaGFubmVscy5jaGFubmVsc1t0aGlzLm5hbWVdLnRyaWdnZXIoXCJjbGllbnQtXCIuY29uY2F0KGV2ZW50TmFtZSksIGRhdGEpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuIGZvciBzb21lb25lIGxlYXZpbmcgdGhlIGNoYW5uZWwuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImxlYXZpbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGVhdmluZyhjYWxsYmFjaykge1xuICAgICAgdGhpcy5vbigncHVzaGVyOm1lbWJlcl9yZW1vdmVkJywgZnVuY3Rpb24gKG1lbWJlcikge1xuICAgICAgICBjYWxsYmFjayhtZW1iZXIuaW5mbyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBQdXNoZXJQcmVzZW5jZUNoYW5uZWw7XG59KFB1c2hlclByaXZhdGVDaGFubmVsKTtcblxuLyoqXHJcbiAqIFRoaXMgY2xhc3MgcmVwcmVzZW50cyBhIFNvY2tldC5pbyBjaGFubmVsLlxyXG4gKi9cblxudmFyIFNvY2tldElvQ2hhbm5lbCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX0NoYW5uZWwpIHtcbiAgX2luaGVyaXRzKFNvY2tldElvQ2hhbm5lbCwgX0NoYW5uZWwpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoU29ja2V0SW9DaGFubmVsKTtcblxuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgY2xhc3MgaW5zdGFuY2UuXHJcbiAgICovXG4gIGZ1bmN0aW9uIFNvY2tldElvQ2hhbm5lbChzb2NrZXQsIG5hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU29ja2V0SW9DaGFubmVsKTtcblxuICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZXZlbnQgY2FsbGJhY2tzIGFwcGxpZWQgdG8gdGhlIHNvY2tldC5cclxuICAgICAqL1xuXG4gICAgX3RoaXMuZXZlbnRzID0ge307XG4gICAgLyoqXHJcbiAgICAgKiBVc2VyIHN1cHBsaWVkIGNhbGxiYWNrcyBmb3IgZXZlbnRzIG9uIHRoaXMgY2hhbm5lbC5cclxuICAgICAqL1xuXG4gICAgX3RoaXMubGlzdGVuZXJzID0ge307XG4gICAgX3RoaXMubmFtZSA9IG5hbWU7XG4gICAgX3RoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgIF90aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIF90aGlzLmV2ZW50Rm9ybWF0dGVyID0gbmV3IEV2ZW50Rm9ybWF0dGVyKF90aGlzLm9wdGlvbnMubmFtZXNwYWNlKTtcblxuICAgIF90aGlzLnN1YnNjcmliZSgpO1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG4gIC8qKlxyXG4gICAqIFN1YnNjcmliZSB0byBhIFNvY2tldC5pbyBjaGFubmVsLlxyXG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKFNvY2tldElvQ2hhbm5lbCwgW3tcbiAgICBrZXk6IFwic3Vic2NyaWJlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN1YnNjcmliZSgpIHtcbiAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ3N1YnNjcmliZScsIHtcbiAgICAgICAgY2hhbm5lbDogdGhpcy5uYW1lLFxuICAgICAgICBhdXRoOiB0aGlzLm9wdGlvbnMuYXV0aCB8fCB7fVxuICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogVW5zdWJzY3JpYmUgZnJvbSBjaGFubmVsIGFuZCB1YmluZCBldmVudCBjYWxsYmFja3MuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInVuc3Vic2NyaWJlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVuc3Vic2NyaWJlKCkge1xuICAgICAgdGhpcy51bmJpbmQoKTtcbiAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ3Vuc3Vic2NyaWJlJywge1xuICAgICAgICBjaGFubmVsOiB0aGlzLm5hbWUsXG4gICAgICAgIGF1dGg6IHRoaXMub3B0aW9ucy5hdXRoIHx8IHt9XG4gICAgICB9KTtcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBMaXN0ZW4gZm9yIGFuIGV2ZW50IG9uIHRoZSBjaGFubmVsIGluc3RhbmNlLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJsaXN0ZW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGlzdGVuKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgdGhpcy5vbih0aGlzLmV2ZW50Rm9ybWF0dGVyLmZvcm1hdChldmVudCksIGNhbGxiYWNrKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIFN0b3AgbGlzdGVuaW5nIGZvciBhbiBldmVudCBvbiB0aGUgY2hhbm5lbCBpbnN0YW5jZS5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwic3RvcExpc3RlbmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wTGlzdGVuaW5nKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgdGhpcy51bmJpbmRFdmVudCh0aGlzLmV2ZW50Rm9ybWF0dGVyLmZvcm1hdChldmVudCksIGNhbGxiYWNrKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIGEgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIGFueXRpbWUgYSBzdWJzY3JpcHRpb24gc3VjY2VlZHMuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInN1YnNjcmliZWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3Vic2NyaWJlZChjYWxsYmFjaykge1xuICAgICAgdGhpcy5vbignY29ubmVjdCcsIGZ1bmN0aW9uIChzb2NrZXQpIHtcbiAgICAgICAgY2FsbGJhY2soc29ja2V0KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgYW55dGltZSBhbiBlcnJvciBvY2N1cnMuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImVycm9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVycm9yKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBCaW5kIHRoZSBjaGFubmVsJ3Mgc29ja2V0IHRvIGFuIGV2ZW50IGFuZCBzdG9yZSB0aGUgY2FsbGJhY2suXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIm9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50XSA9IHRoaXMubGlzdGVuZXJzW2V2ZW50XSB8fCBbXTtcblxuICAgICAgaWYgKCF0aGlzLmV2ZW50c1tldmVudF0pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnRdID0gZnVuY3Rpb24gKGNoYW5uZWwsIGRhdGEpIHtcbiAgICAgICAgICBpZiAoX3RoaXMyLm5hbWUgPT09IGNoYW5uZWwgJiYgX3RoaXMyLmxpc3RlbmVyc1tldmVudF0pIHtcbiAgICAgICAgICAgIF90aGlzMi5saXN0ZW5lcnNbZXZlbnRdLmZvckVhY2goZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNvY2tldC5vbihldmVudCwgdGhpcy5ldmVudHNbZXZlbnRdKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5saXN0ZW5lcnNbZXZlbnRdLnB1c2goY2FsbGJhY2spO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kIHRoZSBjaGFubmVsJ3Mgc29ja2V0IGZyb20gYWxsIHN0b3JlZCBldmVudCBjYWxsYmFja3MuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInVuYmluZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1bmJpbmQoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgT2JqZWN0LmtleXModGhpcy5ldmVudHMpLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIF90aGlzMy51bmJpbmRFdmVudChldmVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBVbmJpbmQgdGhlIGxpc3RlbmVycyBmb3IgdGhlIGdpdmVuIGV2ZW50LlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJ1bmJpbmRFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1bmJpbmRFdmVudChldmVudCwgY2FsbGJhY2spIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50XSA9IHRoaXMubGlzdGVuZXJzW2V2ZW50XSB8fCBbXTtcblxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50XSA9IHRoaXMubGlzdGVuZXJzW2V2ZW50XS5maWx0ZXIoZnVuY3Rpb24gKGNiKSB7XG4gICAgICAgICAgcmV0dXJuIGNiICE9PSBjYWxsYmFjaztcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghY2FsbGJhY2sgfHwgdGhpcy5saXN0ZW5lcnNbZXZlbnRdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnRdKSB7XG4gICAgICAgICAgdGhpcy5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIHRoaXMuZXZlbnRzW2V2ZW50XSk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzW2V2ZW50XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSB0aGlzLmxpc3RlbmVyc1tldmVudF07XG4gICAgICB9XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFNvY2tldElvQ2hhbm5lbDtcbn0oQ2hhbm5lbCk7XG5cbi8qKlxyXG4gKiBUaGlzIGNsYXNzIHJlcHJlc2VudHMgYSBTb2NrZXQuaW8gcHJpdmF0ZSBjaGFubmVsLlxyXG4gKi9cblxudmFyIFNvY2tldElvUHJpdmF0ZUNoYW5uZWwgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9Tb2NrZXRJb0NoYW5uZWwpIHtcbiAgX2luaGVyaXRzKFNvY2tldElvUHJpdmF0ZUNoYW5uZWwsIF9Tb2NrZXRJb0NoYW5uZWwpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoU29ja2V0SW9Qcml2YXRlQ2hhbm5lbCk7XG5cbiAgZnVuY3Rpb24gU29ja2V0SW9Qcml2YXRlQ2hhbm5lbCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU29ja2V0SW9Qcml2YXRlQ2hhbm5lbCk7XG5cbiAgICByZXR1cm4gX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoU29ja2V0SW9Qcml2YXRlQ2hhbm5lbCwgW3tcbiAgICBrZXk6IFwid2hpc3BlclwiLFxuICAgIHZhbHVlOlxuICAgIC8qKlxyXG4gICAgICogU2VuZCBhIHdoaXNwZXIgZXZlbnQgdG8gb3RoZXIgY2xpZW50cyBpbiB0aGUgY2hhbm5lbC5cclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHdoaXNwZXIoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgICB0aGlzLnNvY2tldC5lbWl0KCdjbGllbnQgZXZlbnQnLCB7XG4gICAgICAgIGNoYW5uZWw6IHRoaXMubmFtZSxcbiAgICAgICAgZXZlbnQ6IFwiY2xpZW50LVwiLmNvbmNhdChldmVudE5hbWUpLFxuICAgICAgICBkYXRhOiBkYXRhXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTb2NrZXRJb1ByaXZhdGVDaGFubmVsO1xufShTb2NrZXRJb0NoYW5uZWwpO1xuXG4vKipcclxuICogVGhpcyBjbGFzcyByZXByZXNlbnRzIGEgU29ja2V0LmlvIHByZXNlbmNlIGNoYW5uZWwuXHJcbiAqL1xuXG52YXIgU29ja2V0SW9QcmVzZW5jZUNoYW5uZWwgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9Tb2NrZXRJb1ByaXZhdGVDaGFubikge1xuICBfaW5oZXJpdHMoU29ja2V0SW9QcmVzZW5jZUNoYW5uZWwsIF9Tb2NrZXRJb1ByaXZhdGVDaGFubik7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihTb2NrZXRJb1ByZXNlbmNlQ2hhbm5lbCk7XG5cbiAgZnVuY3Rpb24gU29ja2V0SW9QcmVzZW5jZUNoYW5uZWwoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNvY2tldElvUHJlc2VuY2VDaGFubmVsKTtcblxuICAgIHJldHVybiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhTb2NrZXRJb1ByZXNlbmNlQ2hhbm5lbCwgW3tcbiAgICBrZXk6IFwiaGVyZVwiLFxuICAgIHZhbHVlOlxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgYW55dGltZSB0aGUgbWVtYmVyIGxpc3QgY2hhbmdlcy5cclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhlcmUoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMub24oJ3ByZXNlbmNlOnN1YnNjcmliZWQnLCBmdW5jdGlvbiAobWVtYmVycykge1xuICAgICAgICBjYWxsYmFjayhtZW1iZXJzLm1hcChmdW5jdGlvbiAobSkge1xuICAgICAgICAgIHJldHVybiBtLnVzZXJfaW5mbztcbiAgICAgICAgfSkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBMaXN0ZW4gZm9yIHNvbWVvbmUgam9pbmluZyB0aGUgY2hhbm5lbC5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiam9pbmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBqb2luaW5nKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLm9uKCdwcmVzZW5jZTpqb2luaW5nJywgZnVuY3Rpb24gKG1lbWJlcikge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2sobWVtYmVyLnVzZXJfaW5mbyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIFNlbmQgYSB3aGlzcGVyIGV2ZW50IHRvIG90aGVyIGNsaWVudHMgaW4gdGhlIGNoYW5uZWwuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIndoaXNwZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gd2hpc3BlcihldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ2NsaWVudCBldmVudCcsIHtcbiAgICAgICAgY2hhbm5lbDogdGhpcy5uYW1lLFxuICAgICAgICBldmVudDogXCJjbGllbnQtXCIuY29uY2F0KGV2ZW50TmFtZSksXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuIGZvciBzb21lb25lIGxlYXZpbmcgdGhlIGNoYW5uZWwuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImxlYXZpbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGVhdmluZyhjYWxsYmFjaykge1xuICAgICAgdGhpcy5vbigncHJlc2VuY2U6bGVhdmluZycsIGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG1lbWJlci51c2VyX2luZm8pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU29ja2V0SW9QcmVzZW5jZUNoYW5uZWw7XG59KFNvY2tldElvUHJpdmF0ZUNoYW5uZWwpO1xuXG4vKipcclxuICogVGhpcyBjbGFzcyByZXByZXNlbnRzIGEgbnVsbCBjaGFubmVsLlxyXG4gKi9cblxudmFyIE51bGxDaGFubmVsID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfQ2hhbm5lbCkge1xuICBfaW5oZXJpdHMoTnVsbENoYW5uZWwsIF9DaGFubmVsKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKE51bGxDaGFubmVsKTtcblxuICBmdW5jdGlvbiBOdWxsQ2hhbm5lbCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTnVsbENoYW5uZWwpO1xuXG4gICAgcmV0dXJuIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE51bGxDaGFubmVsLCBbe1xuICAgIGtleTogXCJzdWJzY3JpYmVcIixcbiAgICB2YWx1ZTpcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSB0byBhIGNoYW5uZWwuXHJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzdWJzY3JpYmUoKSB7Ly9cbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBVbnN1YnNjcmliZSBmcm9tIGEgY2hhbm5lbC5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwidW5zdWJzY3JpYmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdW5zdWJzY3JpYmUoKSB7Ly9cbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBMaXN0ZW4gZm9yIGFuIGV2ZW50IG9uIHRoZSBjaGFubmVsIGluc3RhbmNlLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJsaXN0ZW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGlzdGVuKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuIGZvciBhbGwgZXZlbnRzIG9uIHRoZSBjaGFubmVsIGluc3RhbmNlLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJsaXN0ZW5Ub0FsbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsaXN0ZW5Ub0FsbChjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogU3RvcCBsaXN0ZW5pbmcgZm9yIGFuIGV2ZW50IG9uIHRoZSBjaGFubmVsIGluc3RhbmNlLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJzdG9wTGlzdGVuaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3BMaXN0ZW5pbmcoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlciBhIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCBhbnl0aW1lIGEgc3Vic2NyaXB0aW9uIHN1Y2NlZWRzLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJzdWJzY3JpYmVkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN1YnNjcmliZWQoY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIGEgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIGFueXRpbWUgYW4gZXJyb3Igb2NjdXJzLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJlcnJvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlcnJvcihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogQmluZCBhIGNoYW5uZWwgdG8gYW4gZXZlbnQuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIm9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uKGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE51bGxDaGFubmVsO1xufShDaGFubmVsKTtcblxuLyoqXHJcbiAqIFRoaXMgY2xhc3MgcmVwcmVzZW50cyBhIG51bGwgcHJpdmF0ZSBjaGFubmVsLlxyXG4gKi9cblxudmFyIE51bGxQcml2YXRlQ2hhbm5lbCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX051bGxDaGFubmVsKSB7XG4gIF9pbmhlcml0cyhOdWxsUHJpdmF0ZUNoYW5uZWwsIF9OdWxsQ2hhbm5lbCk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihOdWxsUHJpdmF0ZUNoYW5uZWwpO1xuXG4gIGZ1bmN0aW9uIE51bGxQcml2YXRlQ2hhbm5lbCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTnVsbFByaXZhdGVDaGFubmVsKTtcblxuICAgIHJldHVybiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhOdWxsUHJpdmF0ZUNoYW5uZWwsIFt7XG4gICAga2V5OiBcIndoaXNwZXJcIixcbiAgICB2YWx1ZTpcbiAgICAvKipcclxuICAgICAqIFNlbmQgYSB3aGlzcGVyIGV2ZW50IHRvIG90aGVyIGNsaWVudHMgaW4gdGhlIGNoYW5uZWwuXHJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB3aGlzcGVyKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE51bGxQcml2YXRlQ2hhbm5lbDtcbn0oTnVsbENoYW5uZWwpO1xuXG4vKipcclxuICogVGhpcyBjbGFzcyByZXByZXNlbnRzIGEgbnVsbCBwcml2YXRlIGNoYW5uZWwuXHJcbiAqL1xuXG52YXIgTnVsbEVuY3J5cHRlZFByaXZhdGVDaGFubmVsID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfTnVsbENoYW5uZWwpIHtcbiAgX2luaGVyaXRzKE51bGxFbmNyeXB0ZWRQcml2YXRlQ2hhbm5lbCwgX051bGxDaGFubmVsKTtcblxuICB2YXIgX3N1cGVyID0gX2NyZWF0ZVN1cGVyKE51bGxFbmNyeXB0ZWRQcml2YXRlQ2hhbm5lbCk7XG5cbiAgZnVuY3Rpb24gTnVsbEVuY3J5cHRlZFByaXZhdGVDaGFubmVsKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBOdWxsRW5jcnlwdGVkUHJpdmF0ZUNoYW5uZWwpO1xuXG4gICAgcmV0dXJuIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE51bGxFbmNyeXB0ZWRQcml2YXRlQ2hhbm5lbCwgW3tcbiAgICBrZXk6IFwid2hpc3BlclwiLFxuICAgIHZhbHVlOlxuICAgIC8qKlxyXG4gICAgICogU2VuZCBhIHdoaXNwZXIgZXZlbnQgdG8gb3RoZXIgY2xpZW50cyBpbiB0aGUgY2hhbm5lbC5cclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHdoaXNwZXIoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gTnVsbEVuY3J5cHRlZFByaXZhdGVDaGFubmVsO1xufShOdWxsQ2hhbm5lbCk7XG5cbi8qKlxyXG4gKiBUaGlzIGNsYXNzIHJlcHJlc2VudHMgYSBudWxsIHByZXNlbmNlIGNoYW5uZWwuXHJcbiAqL1xuXG52YXIgTnVsbFByZXNlbmNlQ2hhbm5lbCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX051bGxQcml2YXRlQ2hhbm5lbCkge1xuICBfaW5oZXJpdHMoTnVsbFByZXNlbmNlQ2hhbm5lbCwgX051bGxQcml2YXRlQ2hhbm5lbCk7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihOdWxsUHJlc2VuY2VDaGFubmVsKTtcblxuICBmdW5jdGlvbiBOdWxsUHJlc2VuY2VDaGFubmVsKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBOdWxsUHJlc2VuY2VDaGFubmVsKTtcblxuICAgIHJldHVybiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhOdWxsUHJlc2VuY2VDaGFubmVsLCBbe1xuICAgIGtleTogXCJoZXJlXCIsXG4gICAgdmFsdWU6XG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlciBhIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCBhbnl0aW1lIHRoZSBtZW1iZXIgbGlzdCBjaGFuZ2VzLlxyXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGVyZShjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuIGZvciBzb21lb25lIGpvaW5pbmcgdGhlIGNoYW5uZWwuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImpvaW5pbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gam9pbmluZyhjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogU2VuZCBhIHdoaXNwZXIgZXZlbnQgdG8gb3RoZXIgY2xpZW50cyBpbiB0aGUgY2hhbm5lbC5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwid2hpc3BlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3aGlzcGVyKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuIGZvciBzb21lb25lIGxlYXZpbmcgdGhlIGNoYW5uZWwuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImxlYXZpbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGVhdmluZyhjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE51bGxQcmVzZW5jZUNoYW5uZWw7XG59KE51bGxQcml2YXRlQ2hhbm5lbCk7XG5cbnZhciBDb25uZWN0b3IgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgY2xhc3MgaW5zdGFuY2UuXHJcbiAgICovXG4gIGZ1bmN0aW9uIENvbm5lY3RvcihvcHRpb25zKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENvbm5lY3Rvcik7XG5cbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgY29ubmVjdG9yIG9wdGlvbnMuXHJcbiAgICAgKi9cbiAgICB0aGlzLl9kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGF1dGg6IHtcbiAgICAgICAgaGVhZGVyczoge31cbiAgICAgIH0sXG4gICAgICBhdXRoRW5kcG9pbnQ6ICcvYnJvYWRjYXN0aW5nL2F1dGgnLFxuICAgICAgdXNlckF1dGhlbnRpY2F0aW9uOiB7XG4gICAgICAgIGVuZHBvaW50OiAnL2Jyb2FkY2FzdGluZy91c2VyLWF1dGgnLFxuICAgICAgICBoZWFkZXJzOiB7fVxuICAgICAgfSxcbiAgICAgIGJyb2FkY2FzdGVyOiAncHVzaGVyJyxcbiAgICAgIGNzcmZUb2tlbjogbnVsbCxcbiAgICAgIGJlYXJlclRva2VuOiBudWxsLFxuICAgICAgaG9zdDogbnVsbCxcbiAgICAgIGtleTogbnVsbCxcbiAgICAgIG5hbWVzcGFjZTogJ0FwcC5FdmVudHMnXG4gICAgfTtcbiAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgdGhpcy5jb25uZWN0KCk7XG4gIH1cbiAgLyoqXHJcbiAgICogTWVyZ2UgdGhlIGN1c3RvbSBvcHRpb25zIHdpdGggdGhlIGRlZmF1bHRzLlxyXG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKENvbm5lY3RvciwgW3tcbiAgICBrZXk6IFwic2V0T3B0aW9uc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF9leHRlbmRzKHRoaXMuX2RlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICAgIHZhciB0b2tlbiA9IHRoaXMuY3NyZlRva2VuKCk7XG5cbiAgICAgIGlmICh0b2tlbikge1xuICAgICAgICB0aGlzLm9wdGlvbnMuYXV0aC5oZWFkZXJzWydYLUNTUkYtVE9LRU4nXSA9IHRva2VuO1xuICAgICAgICB0aGlzLm9wdGlvbnMudXNlckF1dGhlbnRpY2F0aW9uLmhlYWRlcnNbJ1gtQ1NSRi1UT0tFTiddID0gdG9rZW47XG4gICAgICB9XG5cbiAgICAgIHRva2VuID0gdGhpcy5vcHRpb25zLmJlYXJlclRva2VuO1xuXG4gICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmF1dGguaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgdG9rZW47XG4gICAgICAgIHRoaXMub3B0aW9ucy51c2VyQXV0aGVudGljYXRpb24uaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gJ0JlYXJlciAnICsgdG9rZW47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIEV4dHJhY3QgdGhlIENTUkYgdG9rZW4gZnJvbSB0aGUgcGFnZS5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiY3NyZlRva2VuXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNzcmZUb2tlbigpIHtcbiAgICAgIHZhciBzZWxlY3RvcjtcblxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvd1snTGFyYXZlbCddICYmIHdpbmRvd1snTGFyYXZlbCddLmNzcmZUb2tlbikge1xuICAgICAgICByZXR1cm4gd2luZG93WydMYXJhdmVsJ10uY3NyZlRva2VuO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuY3NyZlRva2VuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY3NyZlRva2VuO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yID09PSAnZnVuY3Rpb24nICYmIChzZWxlY3RvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1cImNzcmYtdG9rZW5cIl0nKSkpIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yLmdldEF0dHJpYnV0ZSgnY29udGVudCcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ29ubmVjdG9yO1xufSgpO1xuXG4vKipcclxuICogVGhpcyBjbGFzcyBjcmVhdGVzIGEgY29ubmVjdG9yIHRvIFB1c2hlci5cclxuICovXG5cbnZhciBQdXNoZXJDb25uZWN0b3IgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9Db25uZWN0b3IpIHtcbiAgX2luaGVyaXRzKFB1c2hlckNvbm5lY3RvciwgX0Nvbm5lY3Rvcik7XG5cbiAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihQdXNoZXJDb25uZWN0b3IpO1xuXG4gIGZ1bmN0aW9uIFB1c2hlckNvbm5lY3RvcigpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUHVzaGVyQ29ubmVjdG9yKTtcblxuICAgIF90aGlzID0gX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgLyoqXHJcbiAgICAgKiBBbGwgb2YgdGhlIHN1YnNjcmliZWQgY2hhbm5lbCBuYW1lcy5cclxuICAgICAqL1xuXG4gICAgX3RoaXMuY2hhbm5lbHMgPSB7fTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgZnJlc2ggUHVzaGVyIGNvbm5lY3Rpb24uXHJcbiAgICovXG5cblxuICBfY3JlYXRlQ2xhc3MoUHVzaGVyQ29ubmVjdG9yLCBbe1xuICAgIGtleTogXCJjb25uZWN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbm5lY3QoKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5jbGllbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMucHVzaGVyID0gdGhpcy5vcHRpb25zLmNsaWVudDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLlB1c2hlcikge1xuICAgICAgICB0aGlzLnB1c2hlciA9IG5ldyB0aGlzLm9wdGlvbnMuUHVzaGVyKHRoaXMub3B0aW9ucy5rZXksIHRoaXMub3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnB1c2hlciA9IG5ldyBQdXNoZXIodGhpcy5vcHRpb25zLmtleSwgdGhpcy5vcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBTaWduIGluIHRoZSB1c2VyIHZpYSBQdXNoZXIgdXNlciBhdXRoZW50aWNhdGlvbiAoaHR0cHM6Ly9wdXNoZXIuY29tL2RvY3MvY2hhbm5lbHMvdXNpbmdfY2hhbm5lbHMvdXNlci1hdXRoZW50aWNhdGlvbi8pLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJzaWduaW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2lnbmluKCkge1xuICAgICAgdGhpcy5wdXNoZXIuc2lnbmluKCk7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuIGZvciBhbiBldmVudCBvbiBhIGNoYW5uZWwgaW5zdGFuY2UuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImxpc3RlblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsaXN0ZW4obmFtZSwgZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFubmVsKG5hbWUpLmxpc3RlbihldmVudCwgY2FsbGJhY2spO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIEdldCBhIGNoYW5uZWwgaW5zdGFuY2UgYnkgbmFtZS5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiY2hhbm5lbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjaGFubmVsKG5hbWUpIHtcbiAgICAgIGlmICghdGhpcy5jaGFubmVsc1tuYW1lXSkge1xuICAgICAgICB0aGlzLmNoYW5uZWxzW25hbWVdID0gbmV3IFB1c2hlckNoYW5uZWwodGhpcy5wdXNoZXIsIG5hbWUsIHRoaXMub3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNoYW5uZWxzW25hbWVdO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIEdldCBhIHByaXZhdGUgY2hhbm5lbCBpbnN0YW5jZSBieSBuYW1lLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJwcml2YXRlQ2hhbm5lbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcml2YXRlQ2hhbm5lbChuYW1lKSB7XG4gICAgICBpZiAoIXRoaXMuY2hhbm5lbHNbJ3ByaXZhdGUtJyArIG5hbWVdKSB7XG4gICAgICAgIHRoaXMuY2hhbm5lbHNbJ3ByaXZhdGUtJyArIG5hbWVdID0gbmV3IFB1c2hlclByaXZhdGVDaGFubmVsKHRoaXMucHVzaGVyLCAncHJpdmF0ZS0nICsgbmFtZSwgdGhpcy5vcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNbJ3ByaXZhdGUtJyArIG5hbWVdO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIEdldCBhIHByaXZhdGUgZW5jcnlwdGVkIGNoYW5uZWwgaW5zdGFuY2UgYnkgbmFtZS5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZW5jcnlwdGVkUHJpdmF0ZUNoYW5uZWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5jcnlwdGVkUHJpdmF0ZUNoYW5uZWwobmFtZSkge1xuICAgICAgaWYgKCF0aGlzLmNoYW5uZWxzWydwcml2YXRlLWVuY3J5cHRlZC0nICsgbmFtZV0pIHtcbiAgICAgICAgdGhpcy5jaGFubmVsc1sncHJpdmF0ZS1lbmNyeXB0ZWQtJyArIG5hbWVdID0gbmV3IFB1c2hlckVuY3J5cHRlZFByaXZhdGVDaGFubmVsKHRoaXMucHVzaGVyLCAncHJpdmF0ZS1lbmNyeXB0ZWQtJyArIG5hbWUsIHRoaXMub3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNoYW5uZWxzWydwcml2YXRlLWVuY3J5cHRlZC0nICsgbmFtZV07XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgcHJlc2VuY2UgY2hhbm5lbCBpbnN0YW5jZSBieSBuYW1lLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJwcmVzZW5jZUNoYW5uZWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJlc2VuY2VDaGFubmVsKG5hbWUpIHtcbiAgICAgIGlmICghdGhpcy5jaGFubmVsc1sncHJlc2VuY2UtJyArIG5hbWVdKSB7XG4gICAgICAgIHRoaXMuY2hhbm5lbHNbJ3ByZXNlbmNlLScgKyBuYW1lXSA9IG5ldyBQdXNoZXJQcmVzZW5jZUNoYW5uZWwodGhpcy5wdXNoZXIsICdwcmVzZW5jZS0nICsgbmFtZSwgdGhpcy5vcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNbJ3ByZXNlbmNlLScgKyBuYW1lXTtcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBMZWF2ZSB0aGUgZ2l2ZW4gY2hhbm5lbCwgYXMgd2VsbCBhcyBpdHMgcHJpdmF0ZSBhbmQgcHJlc2VuY2UgdmFyaWFudHMuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImxlYXZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxlYXZlKG5hbWUpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgY2hhbm5lbHMgPSBbbmFtZSwgJ3ByaXZhdGUtJyArIG5hbWUsICdwcml2YXRlLWVuY3J5cHRlZC0nICsgbmFtZSwgJ3ByZXNlbmNlLScgKyBuYW1lXTtcbiAgICAgIGNoYW5uZWxzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUsIGluZGV4KSB7XG4gICAgICAgIF90aGlzMi5sZWF2ZUNoYW5uZWwobmFtZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBMZWF2ZSB0aGUgZ2l2ZW4gY2hhbm5lbC5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwibGVhdmVDaGFubmVsXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxlYXZlQ2hhbm5lbChuYW1lKSB7XG4gICAgICBpZiAodGhpcy5jaGFubmVsc1tuYW1lXSkge1xuICAgICAgICB0aGlzLmNoYW5uZWxzW25hbWVdLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmNoYW5uZWxzW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgc29ja2V0IElEIGZvciB0aGUgY29ubmVjdGlvbi5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwic29ja2V0SWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc29ja2V0SWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXNoZXIuY29ubmVjdGlvbi5zb2NrZXRfaWQ7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogRGlzY29ubmVjdCBQdXNoZXIgY29ubmVjdGlvbi5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzY29ubmVjdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNjb25uZWN0KCkge1xuICAgICAgdGhpcy5wdXNoZXIuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBQdXNoZXJDb25uZWN0b3I7XG59KENvbm5lY3Rvcik7XG5cbi8qKlxyXG4gKiBUaGlzIGNsYXNzIGNyZWF0ZXMgYSBjb25ubmVjdG9yIHRvIGEgU29ja2V0LmlvIHNlcnZlci5cclxuICovXG5cbnZhciBTb2NrZXRJb0Nvbm5lY3RvciA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoX0Nvbm5lY3Rvcikge1xuICBfaW5oZXJpdHMoU29ja2V0SW9Db25uZWN0b3IsIF9Db25uZWN0b3IpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoU29ja2V0SW9Db25uZWN0b3IpO1xuXG4gIGZ1bmN0aW9uIFNvY2tldElvQ29ubmVjdG9yKCkge1xuICAgIHZhciBfdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTb2NrZXRJb0Nvbm5lY3Rvcik7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIC8qKlxyXG4gICAgICogQWxsIG9mIHRoZSBzdWJzY3JpYmVkIGNoYW5uZWwgbmFtZXMuXHJcbiAgICAgKi9cblxuICAgIF90aGlzLmNoYW5uZWxzID0ge307XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIGZyZXNoIFNvY2tldC5pbyBjb25uZWN0aW9uLlxyXG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKFNvY2tldElvQ29ubmVjdG9yLCBbe1xuICAgIGtleTogXCJjb25uZWN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbm5lY3QoKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgdmFyIGlvID0gdGhpcy5nZXRTb2NrZXRJTygpO1xuICAgICAgdGhpcy5zb2NrZXQgPSBpbyh0aGlzLm9wdGlvbnMuaG9zdCwgdGhpcy5vcHRpb25zKTtcbiAgICAgIHRoaXMuc29ja2V0Lm9uKCdyZWNvbm5lY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIE9iamVjdC52YWx1ZXMoX3RoaXMyLmNoYW5uZWxzKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGFubmVsKSB7XG4gICAgICAgICAgY2hhbm5lbC5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGlzLnNvY2tldDtcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBHZXQgc29ja2V0LmlvIG1vZHVsZSBmcm9tIGdsb2JhbCBzY29wZSBvciBvcHRpb25zLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJnZXRTb2NrZXRJT1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTb2NrZXRJTygpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmNsaWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jbGllbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaW8gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBpbztcbiAgICAgIH1cblxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTb2NrZXQuaW8gY2xpZW50IG5vdCBmb3VuZC4gU2hvdWxkIGJlIGdsb2JhbGx5IGF2YWlsYWJsZSBvciBwYXNzZWQgdmlhIG9wdGlvbnMuY2xpZW50Jyk7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuIGZvciBhbiBldmVudCBvbiBhIGNoYW5uZWwgaW5zdGFuY2UuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImxpc3RlblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsaXN0ZW4obmFtZSwgZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGFubmVsKG5hbWUpLmxpc3RlbihldmVudCwgY2FsbGJhY2spO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIEdldCBhIGNoYW5uZWwgaW5zdGFuY2UgYnkgbmFtZS5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiY2hhbm5lbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjaGFubmVsKG5hbWUpIHtcbiAgICAgIGlmICghdGhpcy5jaGFubmVsc1tuYW1lXSkge1xuICAgICAgICB0aGlzLmNoYW5uZWxzW25hbWVdID0gbmV3IFNvY2tldElvQ2hhbm5lbCh0aGlzLnNvY2tldCwgbmFtZSwgdGhpcy5vcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNbbmFtZV07XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgcHJpdmF0ZSBjaGFubmVsIGluc3RhbmNlIGJ5IG5hbWUuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInByaXZhdGVDaGFubmVsXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByaXZhdGVDaGFubmVsKG5hbWUpIHtcbiAgICAgIGlmICghdGhpcy5jaGFubmVsc1sncHJpdmF0ZS0nICsgbmFtZV0pIHtcbiAgICAgICAgdGhpcy5jaGFubmVsc1sncHJpdmF0ZS0nICsgbmFtZV0gPSBuZXcgU29ja2V0SW9Qcml2YXRlQ2hhbm5lbCh0aGlzLnNvY2tldCwgJ3ByaXZhdGUtJyArIG5hbWUsIHRoaXMub3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNoYW5uZWxzWydwcml2YXRlLScgKyBuYW1lXTtcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYSBwcmVzZW5jZSBjaGFubmVsIGluc3RhbmNlIGJ5IG5hbWUuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInByZXNlbmNlQ2hhbm5lbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcmVzZW5jZUNoYW5uZWwobmFtZSkge1xuICAgICAgaWYgKCF0aGlzLmNoYW5uZWxzWydwcmVzZW5jZS0nICsgbmFtZV0pIHtcbiAgICAgICAgdGhpcy5jaGFubmVsc1sncHJlc2VuY2UtJyArIG5hbWVdID0gbmV3IFNvY2tldElvUHJlc2VuY2VDaGFubmVsKHRoaXMuc29ja2V0LCAncHJlc2VuY2UtJyArIG5hbWUsIHRoaXMub3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNoYW5uZWxzWydwcmVzZW5jZS0nICsgbmFtZV07XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGVhdmUgdGhlIGdpdmVuIGNoYW5uZWwsIGFzIHdlbGwgYXMgaXRzIHByaXZhdGUgYW5kIHByZXNlbmNlIHZhcmlhbnRzLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJsZWF2ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsZWF2ZShuYW1lKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIGNoYW5uZWxzID0gW25hbWUsICdwcml2YXRlLScgKyBuYW1lLCAncHJlc2VuY2UtJyArIG5hbWVdO1xuICAgICAgY2hhbm5lbHMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICBfdGhpczMubGVhdmVDaGFubmVsKG5hbWUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGVhdmUgdGhlIGdpdmVuIGNoYW5uZWwuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImxlYXZlQ2hhbm5lbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsZWF2ZUNoYW5uZWwobmFtZSkge1xuICAgICAgaWYgKHRoaXMuY2hhbm5lbHNbbmFtZV0pIHtcbiAgICAgICAgdGhpcy5jaGFubmVsc1tuYW1lXS51bnN1YnNjcmliZSgpO1xuICAgICAgICBkZWxldGUgdGhpcy5jaGFubmVsc1tuYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHNvY2tldCBJRCBmb3IgdGhlIGNvbm5lY3Rpb24uXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInNvY2tldElkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNvY2tldElkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc29ja2V0LmlkO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIERpc2Nvbm5lY3QgU29ja2V0aW8gY29ubmVjdGlvbi5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzY29ubmVjdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNjb25uZWN0KCkge1xuICAgICAgdGhpcy5zb2NrZXQuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTb2NrZXRJb0Nvbm5lY3Rvcjtcbn0oQ29ubmVjdG9yKTtcblxuLyoqXHJcbiAqIFRoaXMgY2xhc3MgY3JlYXRlcyBhIG51bGwgY29ubmVjdG9yLlxyXG4gKi9cblxudmFyIE51bGxDb25uZWN0b3IgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9Db25uZWN0b3IpIHtcbiAgX2luaGVyaXRzKE51bGxDb25uZWN0b3IsIF9Db25uZWN0b3IpO1xuXG4gIHZhciBfc3VwZXIgPSBfY3JlYXRlU3VwZXIoTnVsbENvbm5lY3Rvcik7XG5cbiAgZnVuY3Rpb24gTnVsbENvbm5lY3RvcigpIHtcbiAgICB2YXIgX3RoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTnVsbENvbm5lY3Rvcik7XG5cbiAgICBfdGhpcyA9IF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIC8qKlxyXG4gICAgICogQWxsIG9mIHRoZSBzdWJzY3JpYmVkIGNoYW5uZWwgbmFtZXMuXHJcbiAgICAgKi9cblxuICAgIF90aGlzLmNoYW5uZWxzID0ge307XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIGZyZXNoIGNvbm5lY3Rpb24uXHJcbiAgICovXG5cblxuICBfY3JlYXRlQ2xhc3MoTnVsbENvbm5lY3RvciwgW3tcbiAgICBrZXk6IFwiY29ubmVjdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb25uZWN0KCkgey8vXG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuIGZvciBhbiBldmVudCBvbiBhIGNoYW5uZWwgaW5zdGFuY2UuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImxpc3RlblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsaXN0ZW4obmFtZSwgZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gbmV3IE51bGxDaGFubmVsKCk7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgY2hhbm5lbCBpbnN0YW5jZSBieSBuYW1lLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJjaGFubmVsXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5uZWwobmFtZSkge1xuICAgICAgcmV0dXJuIG5ldyBOdWxsQ2hhbm5lbCgpO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIEdldCBhIHByaXZhdGUgY2hhbm5lbCBpbnN0YW5jZSBieSBuYW1lLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJwcml2YXRlQ2hhbm5lbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcml2YXRlQ2hhbm5lbChuYW1lKSB7XG4gICAgICByZXR1cm4gbmV3IE51bGxQcml2YXRlQ2hhbm5lbCgpO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIEdldCBhIHByaXZhdGUgZW5jcnlwdGVkIGNoYW5uZWwgaW5zdGFuY2UgYnkgbmFtZS5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZW5jcnlwdGVkUHJpdmF0ZUNoYW5uZWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5jcnlwdGVkUHJpdmF0ZUNoYW5uZWwobmFtZSkge1xuICAgICAgcmV0dXJuIG5ldyBOdWxsRW5jcnlwdGVkUHJpdmF0ZUNoYW5uZWwoKTtcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYSBwcmVzZW5jZSBjaGFubmVsIGluc3RhbmNlIGJ5IG5hbWUuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInByZXNlbmNlQ2hhbm5lbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcmVzZW5jZUNoYW5uZWwobmFtZSkge1xuICAgICAgcmV0dXJuIG5ldyBOdWxsUHJlc2VuY2VDaGFubmVsKCk7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGVhdmUgdGhlIGdpdmVuIGNoYW5uZWwsIGFzIHdlbGwgYXMgaXRzIHByaXZhdGUgYW5kIHByZXNlbmNlIHZhcmlhbnRzLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJsZWF2ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsZWF2ZShuYW1lKSB7Ly9cbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBMZWF2ZSB0aGUgZ2l2ZW4gY2hhbm5lbC5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwibGVhdmVDaGFubmVsXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxlYXZlQ2hhbm5lbChuYW1lKSB7Ly9cbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHNvY2tldCBJRCBmb3IgdGhlIGNvbm5lY3Rpb24uXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInNvY2tldElkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNvY2tldElkKCkge1xuICAgICAgcmV0dXJuICdmYWtlLXNvY2tldC1pZCc7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogRGlzY29ubmVjdCB0aGUgY29ubmVjdGlvbi5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzY29ubmVjdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNjb25uZWN0KCkgey8vXG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE51bGxDb25uZWN0b3I7XG59KENvbm5lY3Rvcik7XG5cbi8qKlxyXG4gKiBUaGlzIGNsYXNzIGlzIHRoZSBwcmltYXJ5IEFQSSBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBicm9hZGNhc3RpbmcuXHJcbiAqL1xuXG52YXIgRWNobyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIG5ldyBjbGFzcyBpbnN0YW5jZS5cclxuICAgKi9cbiAgZnVuY3Rpb24gRWNobyhvcHRpb25zKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEVjaG8pO1xuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmNvbm5lY3QoKTtcblxuICAgIGlmICghdGhpcy5vcHRpb25zLndpdGhvdXRJbnRlcmNlcHRvcnMpIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJJbnRlcmNlcHRvcnMoKTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogR2V0IGEgY2hhbm5lbCBpbnN0YW5jZSBieSBuYW1lLlxyXG4gICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKEVjaG8sIFt7XG4gICAga2V5OiBcImNoYW5uZWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2hhbm5lbChfY2hhbm5lbCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdG9yLmNoYW5uZWwoX2NoYW5uZWwpO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIG5ldyBjb25uZWN0aW9uLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJjb25uZWN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbm5lY3QoKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmJyb2FkY2FzdGVyID09ICdyZXZlcmInKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yID0gbmV3IFB1c2hlckNvbm5lY3RvcihfZXh0ZW5kcyhfZXh0ZW5kcyh7fSwgdGhpcy5vcHRpb25zKSwge1xuICAgICAgICAgIGNsdXN0ZXI6ICcnXG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmJyb2FkY2FzdGVyID09ICdwdXNoZXInKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yID0gbmV3IFB1c2hlckNvbm5lY3Rvcih0aGlzLm9wdGlvbnMpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuYnJvYWRjYXN0ZXIgPT0gJ3NvY2tldC5pbycpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IgPSBuZXcgU29ja2V0SW9Db25uZWN0b3IodGhpcy5vcHRpb25zKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmJyb2FkY2FzdGVyID09ICdudWxsJykge1xuICAgICAgICB0aGlzLmNvbm5lY3RvciA9IG5ldyBOdWxsQ29ubmVjdG9yKHRoaXMub3B0aW9ucyk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuYnJvYWRjYXN0ZXIgPT0gJ2Z1bmN0aW9uJyAmJiBpc0NvbnN0cnVjdG9yKHRoaXMub3B0aW9ucy5icm9hZGNhc3RlcikpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IgPSBuZXcgdGhpcy5vcHRpb25zLmJyb2FkY2FzdGVyKHRoaXMub3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCcm9hZGNhc3RlciBcIi5jb25jYXQoX3R5cGVvZih0aGlzLm9wdGlvbnMuYnJvYWRjYXN0ZXIpLCBcIiBcIikuY29uY2F0KHRoaXMub3B0aW9ucy5icm9hZGNhc3RlciwgXCIgaXMgbm90IHN1cHBvcnRlZC5cIikpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcclxuICAgICAqIERpc2Nvbm5lY3QgZnJvbSB0aGUgRWNobyBzZXJ2ZXIuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImRpc2Nvbm5lY3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzY29ubmVjdCgpIHtcbiAgICAgIHRoaXMuY29ubmVjdG9yLmRpc2Nvbm5lY3QoKTtcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYSBwcmVzZW5jZSBjaGFubmVsIGluc3RhbmNlIGJ5IG5hbWUuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImpvaW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gam9pbihjaGFubmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0b3IucHJlc2VuY2VDaGFubmVsKGNoYW5uZWwpO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIExlYXZlIHRoZSBnaXZlbiBjaGFubmVsLCBhcyB3ZWxsIGFzIGl0cyBwcml2YXRlIGFuZCBwcmVzZW5jZSB2YXJpYW50cy5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwibGVhdmVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbGVhdmUoY2hhbm5lbCkge1xuICAgICAgdGhpcy5jb25uZWN0b3IubGVhdmUoY2hhbm5lbCk7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogTGVhdmUgdGhlIGdpdmVuIGNoYW5uZWwuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImxlYXZlQ2hhbm5lbFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsZWF2ZUNoYW5uZWwoY2hhbm5lbCkge1xuICAgICAgdGhpcy5jb25uZWN0b3IubGVhdmVDaGFubmVsKGNoYW5uZWwpO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIExlYXZlIGFsbCBjaGFubmVscy5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwibGVhdmVBbGxDaGFubmVsc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsZWF2ZUFsbENoYW5uZWxzKCkge1xuICAgICAgZm9yICh2YXIgY2hhbm5lbCBpbiB0aGlzLmNvbm5lY3Rvci5jaGFubmVscykge1xuICAgICAgICB0aGlzLmxlYXZlQ2hhbm5lbChjaGFubmVsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBMaXN0ZW4gZm9yIGFuIGV2ZW50IG9uIGEgY2hhbm5lbCBpbnN0YW5jZS5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwibGlzdGVuXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxpc3RlbihjaGFubmVsLCBldmVudCwgY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rvci5saXN0ZW4oY2hhbm5lbCwgZXZlbnQsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYSBwcml2YXRlIGNoYW5uZWwgaW5zdGFuY2UgYnkgbmFtZS5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwicHJpdmF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfcHJpdmF0ZShjaGFubmVsKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0b3IucHJpdmF0ZUNoYW5uZWwoY2hhbm5lbCk7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgcHJpdmF0ZSBlbmNyeXB0ZWQgY2hhbm5lbCBpbnN0YW5jZSBieSBuYW1lLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJlbmNyeXB0ZWRQcml2YXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVuY3J5cHRlZFByaXZhdGUoY2hhbm5lbCkge1xuICAgICAgaWYgKHRoaXMuY29ubmVjdG9yIGluc3RhbmNlb2YgU29ja2V0SW9Db25uZWN0b3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQnJvYWRjYXN0ZXIgXCIuY29uY2F0KF90eXBlb2YodGhpcy5vcHRpb25zLmJyb2FkY2FzdGVyKSwgXCIgXCIpLmNvbmNhdCh0aGlzLm9wdGlvbnMuYnJvYWRjYXN0ZXIsIFwiIGRvZXMgbm90IHN1cHBvcnQgZW5jcnlwdGVkIHByaXZhdGUgY2hhbm5lbHMuXCIpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdG9yLmVuY3J5cHRlZFByaXZhdGVDaGFubmVsKGNoYW5uZWwpO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgU29ja2V0IElEIGZvciB0aGUgY29ubmVjdGlvbi5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwic29ja2V0SWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc29ja2V0SWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0b3Iuc29ja2V0SWQoKTtcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlciAzcmQgcGFydHkgcmVxdWVzdCBpbnRlcmNlcHRpb3JzLiBUaGVzZSBhcmUgdXNlZCB0byBhdXRvbWF0aWNhbGx5XHJcbiAgICAgKiBzZW5kIGEgY29ubmVjdGlvbnMgc29ja2V0IGlkIHRvIGEgTGFyYXZlbCBhcHAgd2l0aCBhIFgtU29ja2V0LUlkIGhlYWRlci5cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwicmVnaXN0ZXJJbnRlcmNlcHRvcnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVnaXN0ZXJJbnRlcmNlcHRvcnMoKSB7XG4gICAgICBpZiAodHlwZW9mIFZ1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiBWdWUuaHR0cCkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyVnVlUmVxdWVzdEludGVyY2VwdG9yKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgYXhpb3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlckF4aW9zUmVxdWVzdEludGVyY2VwdG9yKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgalF1ZXJ5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJqUXVlcnlBamF4U2V0dXAoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCh0eXBlb2YgVHVyYm8gPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihUdXJibykpID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyVHVyYm9SZXF1ZXN0SW50ZXJjZXB0b3IoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlciBhIFZ1ZSBIVFRQIGludGVyY2VwdG9yIHRvIGFkZCB0aGUgWC1Tb2NrZXQtSUQgaGVhZGVyLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJyZWdpc3RlclZ1ZVJlcXVlc3RJbnRlcmNlcHRvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWdpc3RlclZ1ZVJlcXVlc3RJbnRlcmNlcHRvcigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIFZ1ZS5odHRwLmludGVyY2VwdG9ycy5wdXNoKGZ1bmN0aW9uIChyZXF1ZXN0LCBuZXh0KSB7XG4gICAgICAgIGlmIChfdGhpcy5zb2NrZXRJZCgpKSB7XG4gICAgICAgICAgcmVxdWVzdC5oZWFkZXJzLnNldCgnWC1Tb2NrZXQtSUQnLCBfdGhpcy5zb2NrZXRJZCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIGFuIEF4aW9zIEhUVFAgaW50ZXJjZXB0b3IgdG8gYWRkIHRoZSBYLVNvY2tldC1JRCBoZWFkZXIuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInJlZ2lzdGVyQXhpb3NSZXF1ZXN0SW50ZXJjZXB0b3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVnaXN0ZXJBeGlvc1JlcXVlc3RJbnRlcmNlcHRvcigpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICBheGlvcy5pbnRlcmNlcHRvcnMucmVxdWVzdC51c2UoZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICBpZiAoX3RoaXMyLnNvY2tldElkKCkpIHtcbiAgICAgICAgICBjb25maWcuaGVhZGVyc1snWC1Tb2NrZXQtSWQnXSA9IF90aGlzMi5zb2NrZXRJZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIGpRdWVyeSBBamF4UHJlZmlsdGVyIHRvIGFkZCB0aGUgWC1Tb2NrZXQtSUQgaGVhZGVyLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJyZWdpc3RlcmpRdWVyeUFqYXhTZXR1cFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWdpc3RlcmpRdWVyeUFqYXhTZXR1cCgpIHtcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICBpZiAodHlwZW9mIGpRdWVyeS5hamF4ICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGpRdWVyeS5hamF4UHJlZmlsdGVyKGZ1bmN0aW9uIChvcHRpb25zLCBvcmlnaW5hbE9wdGlvbnMsIHhocikge1xuICAgICAgICAgIGlmIChfdGhpczMuc29ja2V0SWQoKSkge1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtU29ja2V0LUlkJywgX3RoaXMzLnNvY2tldElkKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgdGhlIFR1cmJvIFJlcXVlc3QgaW50ZXJjZXB0b3IgdG8gYWRkIHRoZSBYLVNvY2tldC1JRCBoZWFkZXIuXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInJlZ2lzdGVyVHVyYm9SZXF1ZXN0SW50ZXJjZXB0b3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVnaXN0ZXJUdXJib1JlcXVlc3RJbnRlcmNlcHRvcigpIHtcbiAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0dXJibzpiZWZvcmUtZmV0Y2gtcmVxdWVzdCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5kZXRhaWwuZmV0Y2hPcHRpb25zLmhlYWRlcnNbJ1gtU29ja2V0LUlkJ10gPSBfdGhpczQuc29ja2V0SWQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBFY2hvO1xufSgpO1xuXG5leHBvcnQgeyBDaGFubmVsLCBDb25uZWN0b3IsIEV2ZW50Rm9ybWF0dGVyLCBFY2hvIGFzIGRlZmF1bHQgfTtcbiIsICJpbXBvcnQgRWNobyBmcm9tICdsYXJhdmVsLWVjaG8nXG5pbXBvcnQgUHVzaGVyIGZyb20gJ3B1c2hlci1qcy9kaXN0L3dlYi9wdXNoZXInXG5cbndpbmRvdy5FY2hvRmFjdG9yeSA9IEVjaG9cbndpbmRvdy5QdXNoZXIgPSBQdXNoZXJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQUEsU0FBQSxpQ0FBQSxNQUFBLFNBQUE7QUFDQSxZQUFBLE9BQUEsWUFBQSxZQUFBLE9BQUEsV0FBQTtBQUNBLGlCQUFBLFVBQUEsUUFBQTtpQkFDQSxPQUFBLFdBQUEsY0FBQSxPQUFBO0FBQ0EsaUJBQUEsQ0FBQSxHQUFBLE9BQUE7aUJBQ0EsT0FBQSxZQUFBO0FBQ0Esa0JBQUEsUUFBQSxJQUFBLFFBQUE7O0FBRUEsZUFBQSxRQUFBLElBQUEsUUFBQTtNQUNBLEdBQUMsUUFBQSxXQUFBO0FBQ0Q7O1VBQUEsU0FBQSxTQUFBO0FDVEEsZ0JBQUEsbUJBQUEsQ0FBQTtBQUdBLHFCQUFBLG9CQUFBLFVBQUE7QUFHQSxrQkFBQSxpQkFBQSxRQUFBLEdBQUE7QUFDQSx1QkFBQSxpQkFBQSxRQUFBLEVBQUE7Y0FDQTtBQUVBLGtCQUFBQSxVQUFBLGlCQUFBLFFBQUEsSUFBQTs7Z0JBQ0EsR0FBQTs7Z0JBQ0EsR0FBQTs7Z0JBQ0EsU0FBQSxDQUFBOztjQUNBO0FBR0Esc0JBQUEsUUFBQSxFQUFBLEtB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QUN2RSxnQkFBTSxPQUFPLGFBQWEsUUFBUSxhQUFhLElBQUksT0FBTyxTQUFTO0FBQUEsUUFDckUsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGLENBQUMsQ0FBQztBQUVGLFdBQU9BO0FBQUEsRUFDVCxFQUFFOzs7QUNyckRGLHNCQUFtQjtBQUVuQixTQUFPLGNBQWM7QUFDckIsU0FBTyxTQUFTLGNBQUFDOyIsCiAgIm5hbWVzIjogWyJtb2R1bGUiLCAiZXhwb3J0cyIsICJrZXkiLCAiQ29kZXIiLCAiVVJMU2FmZUNvZGVyIiwgIlNjcmlwdFJlY2VpdmVyRmFjdG9yeSIsICJwcmVmaXgiLCAiQXV0aFJlcXVlc3RUeXBlIiwgIkJhZEV2ZW50TmFtZSIsICJCYWRDaGFubmVsTmFtZSIsICJSZXF1ZXN0VGltZWRPdXQiLCAiVHJhbnNwb3J0UHJpb3JpdHlUb29Mb3ciLCAiVHJhbnNwb3J0Q2xvc2VkIiwgIlVuc3VwcG9ydGVkRmVhdHVyZSIsICJVbnN1cHBvcnRlZFRyYW5zcG9ydCIsICJVbnN1cHBvcnRlZFN0cmF0ZWd5IiwgIkhUVFBBdXRoRXJyb3IiLCAiVGltZXIiLCAiT25lT2ZmVGltZXIiLCAiUGVyaW9kaWNUaW1lciIsICJsIiwgImtleXMiLCAidmFsdWVzIiwgImRvY3VtZW50IiwgIlNjcmlwdFJlcXVlc3QiLCAic3RhdGUiLCAiTmV0SW5mbyIsICJDaGFubmVsIiwgIlByaXZhdGVDaGFubmVsIiwgInRyYW5zcG9ydHMiLCAiSWZTdHJhdGVneSIsICJGaXJzdENvbm5lY3RlZFN0cmF0ZWd5IiwgIlN0YXRlIiwgInJhbmRvbSIsICJUaW1lbGluZUxldmVsIiwgIlB1c2hlciIsICJvcHRpb25zIiwgIm9iaiIsICJfZ2V0UHJvdG90eXBlT2YiLCAibyIsICJfc2V0UHJvdG90eXBlT2YiLCAicCIsICJDaGFubmVsIiwgIkV2ZW50Rm9ybWF0dGVyIiwgIlB1c2hlckNoYW5uZWwiLCAiUHVzaGVyUHJpdmF0ZUNoYW5uZWwiLCAiUHVzaGVyRW5jcnlwdGVkUHJpdmF0ZUNoYW5uZWwiLCAiUHVzaGVyUHJlc2VuY2VDaGFubmVsIiwgIlNvY2tldElvQ2hhbm5lbCIsICJTb2NrZXRJb1ByaXZhdGVDaGFubmVsIiwgIlNvY2tldElvUHJlc2VuY2VDaGFubmVsIiwgIk51bGxDaGFubmVsIiwgIk51bGxQcml2YXRlQ2hhbm5lbCIsICJOdWxsRW5jcnlwdGVkUHJpdmF0ZUNoYW5uZWwiLCAiTnVsbFByZXNlbmNlQ2hhbm5lbCIsICJDb25uZWN0b3IiLCAiUHVzaGVyQ29ubmVjdG9yIiwgIm5hbWUiLCAiU29ja2V0SW9Db25uZWN0b3IiLCAiaW8iLCAiTnVsbENvbm5lY3RvciIsICJFY2hvIiwgIlB1c2hlciJdCn0K

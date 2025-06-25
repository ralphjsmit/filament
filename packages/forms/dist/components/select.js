// node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var min = Math.min;
var max = Math.max;
var round = Math.round;
var createCoords = (v) => ({
  x: v,
  y: v
});
var oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
var oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}

// node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
var computePosition = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
var flip = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements2 = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides2 = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements2[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every((d) => d.overflows[0] > 0 && getSideAxis(d.placement) === initialSideAxis)) {
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
var offset = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
var shift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};

// node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isTopLayer(element) {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element.matches(selector);
    } catch (e) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;
  return ["transform", "translate", "scale", "rotate", "perspective"].some((value) => css[value] ? css[value] !== "none" : false) || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}

// node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
  const css = getComputedStyle(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
var noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 : (
    // RTL <body> scrollbar.
    getWindowScrollBarX(documentElement, htmlRect)
  ));
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
var getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle(element).direction === "rtl";
}
var platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
var offset2 = offset;
var shift2 = shift;
var flip2 = flip;
var computePosition2 = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

// packages/forms/resources/js/components/select.js
function blank(value) {
  return value === null || value === void 0 || value === "" || typeof value === "string" && value.trim() === "";
}
function filled(value) {
  return !blank(value);
}
function selectFormComponent({
  canSelectPlaceholder,
  isHtmlAllowed,
  getOptionLabelUsing,
  getOptionLabelsUsing,
  getOptionsUsing,
  getSearchResultsUsing,
  initialOptionLabel,
  initialOptionLabels,
  initialState,
  isAutofocused,
  isDisabled,
  isMultiple,
  isSearchable,
  hasDynamicOptions,
  hasDynamicSearchResults,
  livewireId,
  loadingMessage,
  maxItems,
  maxItemsMessage,
  noSearchResultsMessage,
  options,
  optionsLimit,
  placeholder,
  position,
  searchDebounce,
  searchingMessage,
  searchPrompt,
  searchableOptionFields,
  state,
  statePath
}) {
  return {
    state,
    select: null,
    init() {
      this.select = new CustomSelect({
        element: this.$refs.select,
        options,
        placeholder,
        state: this.state,
        canSelectPlaceholder,
        initialOptionLabel,
        initialOptionLabels,
        initialState,
        isHtmlAllowed,
        isAutofocused,
        isDisabled,
        isMultiple,
        isSearchable,
        getOptionLabelUsing,
        getOptionLabelsUsing,
        getOptionsUsing,
        getSearchResultsUsing,
        hasDynamicOptions,
        hasDynamicSearchResults,
        searchPrompt,
        searchDebounce,
        loadingMessage,
        searchingMessage,
        noSearchResultsMessage,
        maxItems,
        maxItemsMessage,
        optionsLimit,
        position,
        searchableOptionFields,
        livewireId,
        statePath,
        onStateChange: (newState) => {
          this.state = newState;
        }
      });
      this.$watch("state", (newState) => {
        if (this.select && this.select.state !== newState) {
          this.select.state = newState;
          this.select.updateSelectedDisplay();
          this.select.renderOptions();
        }
      });
    },
    destroy() {
      if (this.select) {
        this.select.destroy();
        this.select = null;
      }
    }
  };
}
var CustomSelect = class {
  constructor({
    element,
    options,
    placeholder,
    state,
    canSelectPlaceholder = true,
    initialOptionLabel = null,
    initialOptionLabels = null,
    initialState = null,
    isHtmlAllowed = false,
    isAutofocused = false,
    isDisabled = false,
    isMultiple = false,
    isSearchable = false,
    getOptionLabelUsing = null,
    getOptionLabelsUsing = null,
    getOptionsUsing = null,
    getSearchResultsUsing = null,
    hasDynamicOptions = false,
    hasDynamicSearchResults = true,
    searchPrompt = "Search...",
    searchDebounce = 1e3,
    loadingMessage = "Loading...",
    searchingMessage = "Searching...",
    noSearchResultsMessage = "No results found",
    maxItems = null,
    maxItemsMessage = "Maximum number of items selected",
    optionsLimit = null,
    position = null,
    searchableOptionFields = ["label"],
    livewireId = null,
    statePath = null,
    onStateChange = () => {
    }
  }) {
    this.element = element;
    this.options = options;
    this.originalOptions = JSON.parse(JSON.stringify(options));
    this.placeholder = placeholder;
    this.state = state;
    this.canSelectPlaceholder = canSelectPlaceholder;
    this.initialOptionLabel = initialOptionLabel;
    this.initialOptionLabels = initialOptionLabels;
    this.initialState = initialState;
    this.isHtmlAllowed = isHtmlAllowed;
    this.isAutofocused = isAutofocused;
    this.isDisabled = isDisabled;
    this.isMultiple = isMultiple;
    this.isSearchable = isSearchable;
    this.getOptionLabelUsing = getOptionLabelUsing;
    this.getOptionLabelsUsing = getOptionLabelsUsing;
    this.getOptionsUsing = getOptionsUsing;
    this.getSearchResultsUsing = getSearchResultsUsing;
    this.hasDynamicOptions = hasDynamicOptions;
    this.hasDynamicSearchResults = hasDynamicSearchResults;
    this.searchPrompt = searchPrompt;
    this.searchDebounce = searchDebounce;
    this.loadingMessage = loadingMessage;
    this.searchingMessage = searchingMessage;
    this.noSearchResultsMessage = noSearchResultsMessage;
    this.maxItems = maxItems;
    this.maxItemsMessage = maxItemsMessage;
    this.optionsLimit = optionsLimit;
    this.position = position;
    this.searchableOptionFields = Array.isArray(searchableOptionFields) ? searchableOptionFields : ["label"];
    this.livewireId = livewireId;
    this.statePath = statePath;
    this.onStateChange = onStateChange;
    this.labelRepository = {};
    this.isOpen = false;
    this.selectedIndex = -1;
    this.searchQuery = "";
    this.searchTimeout = null;
    this.render();
    this.setUpEventListeners();
    if (this.isAutofocused) {
      this.selectButton.focus();
    }
  }
  // Helper method to populate the label repository from options
  populateLabelRepositoryFromOptions(options) {
    if (!options || !Array.isArray(options)) {
      return;
    }
    for (const option of options) {
      if (option.options && Array.isArray(option.options)) {
        this.populateLabelRepositoryFromOptions(option.options);
      } else if (option.value !== void 0 && option.label !== void 0) {
        this.labelRepository[option.value] = option.label;
      }
    }
  }
  render() {
    this.populateLabelRepositoryFromOptions(this.options);
    this.container = document.createElement("div");
    this.container.className = "fi-fo-select-ctn";
    this.container.setAttribute("aria-haspopup", "listbox");
    this.selectButton = document.createElement("button");
    this.selectButton.className = "fi-fo-select-btn";
    this.selectButton.type = "button";
    this.selectButton.setAttribute("aria-expanded", "false");
    this.selectedDisplay = document.createElement("div");
    this.selectedDisplay.className = "fi-fo-select-value-ctn";
    this.updateSelectedDisplay();
    this.selectButton.appendChild(this.selectedDisplay);
    this.dropdown = document.createElement("div");
    this.dropdown.className = "fi-dropdown-panel fi-scrollable";
    this.dropdown.setAttribute("role", "listbox");
    this.dropdown.setAttribute("tabindex", "-1");
    this.dropdown.style.display = "none";
    this.dropdownId = `fi-fo-select-dropdown-${Math.random().toString(36).substring(2, 11)}`;
    this.dropdown.id = this.dropdownId;
    if (this.isMultiple) {
      this.dropdown.setAttribute("aria-multiselectable", "true");
    }
    if (this.isSearchable) {
      this.searchContainer = document.createElement("div");
      this.searchContainer.className = "fi-fo-select-search-ctn";
      this.searchInput = document.createElement("input");
      this.searchInput.className = "fi-input";
      this.searchInput.type = "text";
      this.searchInput.placeholder = this.searchPrompt;
      this.searchInput.setAttribute("aria-label", "Search");
      this.searchContainer.appendChild(this.searchInput);
      this.dropdown.appendChild(this.searchContainer);
      this.searchInput.addEventListener("input", (event) => {
        if (this.isDisabled) {
          return;
        }
        this.handleSearch(event);
      });
      this.searchInput.addEventListener("keydown", (event) => {
        if (this.isDisabled) {
          return;
        }
        if (event.key === "Tab") {
          event.preventDefault();
          const options = this.getVisibleOptions();
          if (options.length === 0) return;
          if (event.shiftKey) {
            this.selectedIndex = options.length - 1;
          } else {
            this.selectedIndex = 0;
          }
          options.forEach((option) => {
            option.classList.remove("fi-selected");
          });
          options[this.selectedIndex].classList.add("fi-selected");
          options[this.selectedIndex].focus();
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          event.stopPropagation();
          const options = this.getVisibleOptions();
          if (options.length === 0) return;
          this.selectedIndex = -1;
          this.searchInput.blur();
          this.focusNextOption();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          event.stopPropagation();
          const options = this.getVisibleOptions();
          if (options.length === 0) return;
          this.selectedIndex = options.length - 1;
          this.searchInput.blur();
          options[this.selectedIndex].classList.add("fi-selected");
          options[this.selectedIndex].focus();
          if (options[this.selectedIndex].id) {
            this.dropdown.setAttribute(
              "aria-activedescendant",
              options[this.selectedIndex].id
            );
          }
          this.scrollOptionIntoView(options[this.selectedIndex]);
        }
      });
    }
    this.optionsList = document.createElement("ul");
    this.renderOptions();
    this.container.appendChild(this.selectButton);
    this.container.appendChild(this.dropdown);
    this.element.appendChild(this.container);
    this.applyDisabledState();
  }
  renderOptions() {
    this.optionsList.innerHTML = "";
    let totalRenderedCount = 0;
    let optionsToRender = this.options;
    let optionsCount = 0;
    let hasGroupedOptions = false;
    this.options.forEach((option) => {
      if (option.options && Array.isArray(option.options)) {
        optionsCount += option.options.length;
        hasGroupedOptions = true;
      } else {
        optionsCount++;
      }
    });
    if (hasGroupedOptions) {
      this.optionsList.className = "fi-fo-select-options-ctn";
    } else if (optionsCount > 0) {
      this.optionsList.className = "fi-dropdown-list";
    }
    let ungroupedList = hasGroupedOptions ? null : this.optionsList;
    let renderedCount = 0;
    for (const option of optionsToRender) {
      if (this.optionsLimit && renderedCount >= this.optionsLimit) {
        break;
      }
      if (option.options && Array.isArray(option.options)) {
        let groupOptions = option.options;
        if (this.isMultiple && Array.isArray(this.state) && this.state.length > 0) {
          groupOptions = option.options.filter(
            (groupOption) => !this.state.includes(groupOption.value)
          );
        }
        if (groupOptions.length > 0) {
          if (this.optionsLimit) {
            const remainingSlots = this.optionsLimit - renderedCount;
            if (remainingSlots < groupOptions.length) {
              groupOptions = groupOptions.slice(0, remainingSlots);
            }
          }
          this.renderOptionGroup(option.label, groupOptions);
          renderedCount += groupOptions.length;
          totalRenderedCount += groupOptions.length;
        }
      } else {
        if (this.isMultiple && Array.isArray(this.state) && this.state.includes(option.value)) {
          continue;
        }
        if (!ungroupedList && hasGroupedOptions) {
          ungroupedList = document.createElement("ul");
          ungroupedList.className = "fi-dropdown-list";
          this.optionsList.appendChild(ungroupedList);
        }
        const optionElement = this.createOptionElement(
          option.value,
          option
        );
        ungroupedList.appendChild(optionElement);
        renderedCount++;
        totalRenderedCount++;
      }
    }
    if (totalRenderedCount === 0) {
      if (this.searchQuery) {
        this.showNoResultsMessage();
      } else if (this.isMultiple && this.isOpen && !this.isSearchable) {
        this.closeDropdown();
      }
      if (this.optionsList.parentNode === this.dropdown) {
        this.dropdown.removeChild(this.optionsList);
      }
    } else {
      this.hideLoadingState();
      if (this.optionsList.parentNode !== this.dropdown) {
        this.dropdown.appendChild(this.optionsList);
      }
    }
  }
  renderOptionGroup(label, options) {
    if (options.length === 0) {
      return;
    }
    const optionGroup = document.createElement("li");
    optionGroup.className = "fi-fo-select-option-group";
    const optionGroupLabel = document.createElement("div");
    optionGroupLabel.className = "fi-dropdown-header";
    optionGroupLabel.textContent = label;
    const groupOptionsList = document.createElement("ul");
    groupOptionsList.className = "fi-dropdown-list";
    options.forEach((option) => {
      const optionElement = this.createOptionElement(option.value, option);
      groupOptionsList.appendChild(optionElement);
    });
    optionGroup.appendChild(optionGroupLabel);
    optionGroup.appendChild(groupOptionsList);
    this.optionsList.appendChild(optionGroup);
  }
  createOptionElement(value, label) {
    let optionValue = value;
    let optionLabel = label;
    let isDisabled = false;
    if (typeof label === "object" && label !== null && "label" in label && "value" in label) {
      optionValue = label.value;
      optionLabel = label.label;
      isDisabled = label.isDisabled || false;
    }
    const option = document.createElement("li");
    option.className = "fi-dropdown-list-item fi-fo-select-option";
    if (isDisabled) {
      option.classList.add("fi-disabled");
    }
    const optionId = `fi-fo-select-option-${Math.random().toString(36).substring(2, 11)}`;
    option.id = optionId;
    option.setAttribute("role", "option");
    option.setAttribute("data-value", optionValue);
    option.setAttribute("tabindex", "0");
    if (isDisabled) {
      option.setAttribute("aria-disabled", "true");
    }
    if (this.isHtmlAllowed && typeof optionLabel === "string") {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = optionLabel;
      const plainText = tempDiv.textContent || tempDiv.innerText || optionLabel;
      option.setAttribute("aria-label", plainText);
    }
    const isSelected = this.isMultiple ? Array.isArray(this.state) && this.state.includes(optionValue) : this.state === optionValue;
    option.setAttribute("aria-selected", isSelected ? "true" : "false");
    if (isSelected) {
      option.classList.add("fi-selected");
    }
    if (this.isHtmlAllowed) {
      const labelSpan = document.createElement("span");
      labelSpan.innerHTML = optionLabel;
      option.appendChild(labelSpan);
    } else {
      option.appendChild(document.createTextNode(optionLabel));
    }
    if (!isDisabled) {
      option.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.selectOption(optionValue);
        if (this.isMultiple) {
          if (this.isSearchable && this.searchInput) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          } else {
            setTimeout(() => {
              option.focus();
            }, 0);
          }
        }
      });
    }
    return option;
  }
  async updateSelectedDisplay() {
    this.selectedDisplay.innerHTML = "";
    if (this.isMultiple) {
      if (!Array.isArray(this.state) || this.state.length === 0) {
        this.selectedDisplay.textContent = this.placeholder || "Select options";
        return;
      }
      let selectedLabels = await this.getLabelsForMultipleSelection();
      this.addBadgesForSelectedOptions(selectedLabels);
      if (this.isOpen) {
        this.positionDropdown();
      }
      return;
    }
    if (this.state === null || this.state === "") {
      this.selectedDisplay.textContent = this.placeholder || "Select an option";
      return;
    }
    const selectedLabel = await this.getLabelForSingleSelection();
    this.addSingleSelectionDisplay(selectedLabel);
  }
  // Helper method to get labels for multiple selection
  async getLabelsForMultipleSelection() {
    let selectedLabels = this.getSelectedOptionLabels();
    const missingValues = [];
    if (Array.isArray(this.state)) {
      for (const value of this.state) {
        if (filled(this.labelRepository[value])) {
          continue;
        }
        if (filled(selectedLabels[value])) {
          this.labelRepository[value] = selectedLabels[value];
          continue;
        }
        missingValues.push(value);
      }
    }
    if (missingValues.length > 0 && filled(this.initialOptionLabels) && JSON.stringify(this.state) === JSON.stringify(this.initialState)) {
      if (Array.isArray(this.initialOptionLabels)) {
        for (const initialOption of this.initialOptionLabels) {
          if (filled(initialOption) && initialOption.value !== void 0 && initialOption.label !== void 0 && missingValues.includes(initialOption.value)) {
            this.labelRepository[initialOption.value] = initialOption.label;
          }
        }
      }
    } else if (missingValues.length > 0 && this.getOptionLabelsUsing) {
      try {
        const fetchedOptionsArray = await this.getOptionLabelsUsing();
        for (const option of fetchedOptionsArray) {
          if (filled(option) && option.value !== void 0 && option.label !== void 0) {
            this.labelRepository[option.value] = option.label;
          }
        }
      } catch (error) {
        console.error("Error fetching option labels:", error);
      }
    }
    const result = [];
    if (Array.isArray(this.state)) {
      for (const value of this.state) {
        if (filled(this.labelRepository[value])) {
          result.push(this.labelRepository[value]);
        } else if (filled(selectedLabels[value])) {
          result.push(selectedLabels[value]);
        } else {
          result.push(value);
        }
      }
    }
    return result;
  }
  // Helper method to create a badge element
  createBadgeElement(value, label) {
    const badge = document.createElement("span");
    badge.className = "fi-badge fi-size-md fi-color fi-color-primary fi-text-color-600 dark:fi-text-color-200";
    if (filled(value)) {
      badge.setAttribute("data-value", value);
    }
    const labelContainer = document.createElement("span");
    labelContainer.className = "fi-badge-label-ctn";
    const labelElement = document.createElement("span");
    labelElement.className = "fi-badge-label";
    if (this.isHtmlAllowed) {
      labelElement.innerHTML = label;
    } else {
      labelElement.textContent = label;
    }
    labelContainer.appendChild(labelElement);
    badge.appendChild(labelContainer);
    const removeButton = this.createRemoveButton(value, label);
    badge.appendChild(removeButton);
    return badge;
  }
  // Helper method to create a remove button
  createRemoveButton(value, label) {
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "fi-badge-delete-btn";
    removeButton.innerHTML = '<svg class="fi-icon fi-size-xs" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon"><path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z"></path></svg>';
    removeButton.setAttribute(
      "aria-label",
      "Remove " + (this.isHtmlAllowed ? label.replace(/<[^>]*>/g, "") : label)
    );
    removeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (filled(value)) {
        this.selectOption(value);
      }
    });
    removeButton.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        if (filled(value)) {
          this.selectOption(value);
        }
      }
    });
    return removeButton;
  }
  // Helper method to add badges for selected options
  addBadgesForSelectedOptions(selectedLabels) {
    const badgesContainer = document.createElement("div");
    badgesContainer.className = "fi-fo-select-value-badges-ctn";
    selectedLabels.forEach((label, index) => {
      const value = Array.isArray(this.state) ? this.state[index] : null;
      const badge = this.createBadgeElement(value, label);
      badgesContainer.appendChild(badge);
    });
    this.selectedDisplay.appendChild(badgesContainer);
  }
  // Helper method to get label for single selection
  async getLabelForSingleSelection() {
    let selectedLabel = this.labelRepository[this.state];
    if (blank(selectedLabel)) {
      selectedLabel = this.getSelectedOptionLabel(this.state);
    }
    if (blank(selectedLabel) && filled(this.initialOptionLabel) && this.state === this.initialState) {
      selectedLabel = this.initialOptionLabel;
      if (filled(this.state)) {
        this.labelRepository[this.state] = selectedLabel;
      }
    } else if (blank(selectedLabel) && this.getOptionLabelUsing) {
      try {
        selectedLabel = await this.getOptionLabelUsing();
        if (filled(selectedLabel) && filled(this.state)) {
          this.labelRepository[this.state] = selectedLabel;
        }
      } catch (error) {
        console.error("Error fetching option label:", error);
        selectedLabel = this.state;
      }
    } else if (blank(selectedLabel)) {
      selectedLabel = this.state;
    }
    return selectedLabel;
  }
  // Helper method to add single selection display
  addSingleSelectionDisplay(selectedLabel) {
    const labelContainer = document.createElement("span");
    labelContainer.className = "fi-fo-select-value-label";
    if (this.isHtmlAllowed) {
      labelContainer.innerHTML = selectedLabel;
    } else {
      labelContainer.textContent = selectedLabel;
    }
    this.selectedDisplay.appendChild(labelContainer);
    if (!this.canSelectPlaceholder) {
      return;
    }
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "fi-fo-select-value-remove-btn";
    removeButton.innerHTML = '<svg class="fi-icon fi-size-sm" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>';
    removeButton.setAttribute("aria-label", "Clear selection");
    removeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.selectOption("");
    });
    removeButton.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        this.selectOption("");
      }
    });
    this.selectedDisplay.appendChild(removeButton);
  }
  getSelectedOptionLabel(value) {
    if (filled(this.labelRepository[value])) {
      return this.labelRepository[value];
    }
    let selectedLabel = "";
    for (const option of this.options) {
      if (option.options && Array.isArray(option.options)) {
        for (const groupOption of option.options) {
          if (groupOption.value === value) {
            selectedLabel = groupOption.label;
            this.labelRepository[value] = selectedLabel;
            break;
          }
        }
      } else if (option.value === value) {
        selectedLabel = option.label;
        this.labelRepository[value] = selectedLabel;
        break;
      }
    }
    return selectedLabel;
  }
  setUpEventListeners() {
    this.buttonClickListener = () => {
      this.toggleDropdown();
    };
    this.documentClickListener = (event) => {
      if (!this.container.contains(event.target) && this.isOpen) {
        this.closeDropdown();
      }
    };
    this.buttonKeydownListener = (event) => {
      if (this.isDisabled) {
        return;
      }
      this.handleSelectButtonKeydown(event);
    };
    this.dropdownKeydownListener = (event) => {
      if (this.isDisabled) {
        return;
      }
      if (this.isSearchable && document.activeElement === this.searchInput && !["Tab", "Escape"].includes(event.key)) {
        return;
      }
      this.handleDropdownKeydown(event);
    };
    this.selectButton.addEventListener("click", this.buttonClickListener);
    document.addEventListener("click", this.documentClickListener);
    this.selectButton.addEventListener(
      "keydown",
      this.buttonKeydownListener
    );
    this.dropdown.addEventListener("keydown", this.dropdownKeydownListener);
    if (!this.isMultiple && this.livewireId && this.statePath && this.getOptionLabelUsing) {
      this.refreshOptionLabelListener = async (event) => {
        if (event.detail.livewireId === this.livewireId && event.detail.statePath === this.statePath) {
          if (filled(this.state)) {
            try {
              delete this.labelRepository[this.state];
              const newLabel = await this.getOptionLabelUsing();
              if (filled(newLabel)) {
                this.labelRepository[this.state] = newLabel;
              }
              const labelContainer = this.selectedDisplay.querySelector(
                ".fi-fo-select-value-label"
              );
              if (filled(labelContainer)) {
                if (this.isHtmlAllowed) {
                  labelContainer.innerHTML = newLabel;
                } else {
                  labelContainer.textContent = newLabel;
                }
              }
              this.updateOptionLabelInList(this.state, newLabel);
            } catch (error) {
              console.error(
                "Error refreshing option label:",
                error
              );
            }
          }
        }
      };
      window.addEventListener(
        "filament-forms::select.refreshSelectedOptionLabel",
        this.refreshOptionLabelListener
      );
    }
  }
  // Helper method to update an option's label in the options list
  updateOptionLabelInList(value, newLabel) {
    this.labelRepository[value] = newLabel;
    const options = this.getVisibleOptions();
    for (const option of options) {
      if (option.getAttribute("data-value") === String(value)) {
        option.innerHTML = "";
        if (this.isHtmlAllowed) {
          const labelSpan = document.createElement("span");
          labelSpan.innerHTML = newLabel;
          option.appendChild(labelSpan);
        } else {
          option.appendChild(document.createTextNode(newLabel));
        }
        break;
      }
    }
    for (const option of this.options) {
      if (option.options && Array.isArray(option.options)) {
        for (const groupOption of option.options) {
          if (groupOption.value === value) {
            groupOption.label = newLabel;
            break;
          }
        }
      } else if (option.value === value) {
        option.label = newLabel;
        break;
      }
    }
    for (const option of this.originalOptions) {
      if (option.options && Array.isArray(option.options)) {
        for (const groupOption of option.options) {
          if (groupOption.value === value) {
            groupOption.label = newLabel;
            break;
          }
        }
      } else if (option.value === value) {
        option.label = newLabel;
        break;
      }
    }
  }
  // Handle keyboard events for the select button
  handleSelectButtonKeydown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        event.stopPropagation();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.focusNextOption();
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        event.stopPropagation();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.focusPreviousOption();
        }
        break;
      case " ":
        event.preventDefault();
        if (this.isOpen) {
          if (this.selectedIndex >= 0) {
            const focusedOption = this.getVisibleOptions()[this.selectedIndex];
            if (focusedOption) {
              focusedOption.click();
            }
          }
        } else {
          this.openDropdown();
        }
        break;
      case "Enter":
        break;
      case "Escape":
        if (this.isOpen) {
          event.preventDefault();
          this.closeDropdown();
        }
        break;
      case "Tab":
        if (this.isOpen) {
          this.closeDropdown();
        }
        break;
    }
  }
  // Handle keyboard events within the dropdown
  handleDropdownKeydown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        event.stopPropagation();
        this.focusNextOption();
        break;
      case "ArrowUp":
        event.preventDefault();
        event.stopPropagation();
        this.focusPreviousOption();
        break;
      case " ":
        event.preventDefault();
        if (this.selectedIndex >= 0) {
          const focusedOption = this.getVisibleOptions()[this.selectedIndex];
          if (focusedOption) {
            focusedOption.click();
          }
        }
        break;
      case "Enter":
        event.preventDefault();
        if (this.selectedIndex >= 0) {
          const focusedOption = this.getVisibleOptions()[this.selectedIndex];
          if (focusedOption) {
            focusedOption.click();
          }
        } else {
          const form = this.element.closest("form");
          if (form) {
            form.submit();
          }
        }
        break;
      case "Escape":
        event.preventDefault();
        this.closeDropdown();
        this.selectButton.focus();
        break;
      case "Tab":
        this.closeDropdown();
        break;
    }
  }
  toggleDropdown() {
    if (this.isDisabled) {
      return;
    }
    if (this.isOpen) {
      this.closeDropdown();
      return;
    }
    if (this.isMultiple && !this.isSearchable && !this.hasAvailableOptions()) {
      return;
    }
    this.openDropdown();
  }
  // Helper method to check if there are any available options
  hasAvailableOptions() {
    for (const option of this.options) {
      if (option.options && Array.isArray(option.options)) {
        for (const groupOption of option.options) {
          if (!Array.isArray(this.state) || !this.state.includes(groupOption.value)) {
            return true;
          }
        }
      } else if (!Array.isArray(this.state) || !this.state.includes(option.value)) {
        return true;
      }
    }
    return false;
  }
  async openDropdown() {
    this.dropdown.style.display = "block";
    this.dropdown.style.opacity = "0";
    const isInModal = this.selectButton.closest(".fi-modal") !== null;
    this.dropdown.style.position = isInModal ? "absolute" : "fixed";
    this.dropdown.style.width = `${this.selectButton.offsetWidth}px`;
    this.selectButton.setAttribute("aria-expanded", "true");
    this.isOpen = true;
    this.positionDropdown();
    if (!this.resizeListener) {
      this.resizeListener = () => {
        this.dropdown.style.width = `${this.selectButton.offsetWidth}px`;
        this.positionDropdown();
      };
      window.addEventListener("resize", this.resizeListener);
    }
    if (!this.scrollListener) {
      this.scrollListener = () => this.positionDropdown();
      window.addEventListener("scroll", this.scrollListener, true);
    }
    this.dropdown.style.opacity = "1";
    if (this.hasDynamicOptions && this.getOptionsUsing) {
      this.showLoadingState(false);
      try {
        const fetchedOptions = await this.getOptionsUsing();
        this.options = fetchedOptions;
        this.originalOptions = JSON.parse(
          JSON.stringify(fetchedOptions)
        );
        this.populateLabelRepositoryFromOptions(fetchedOptions);
        this.renderOptions();
      } catch (error) {
        console.error("Error fetching options:", error);
        this.hideLoadingState();
      }
    }
    this.hideLoadingState();
    if (this.isSearchable && this.searchInput) {
      this.searchInput.value = "";
      this.searchInput.focus();
      this.searchQuery = "";
      this.options = JSON.parse(JSON.stringify(this.originalOptions));
      this.renderOptions();
    } else {
      this.selectedIndex = -1;
      const options = this.getVisibleOptions();
      if (this.isMultiple) {
        if (Array.isArray(this.state) && this.state.length > 0) {
          for (let i = 0; i < options.length; i++) {
            if (this.state.includes(
              options[i].getAttribute("data-value")
            )) {
              this.selectedIndex = i;
              break;
            }
          }
        }
      } else {
        for (let i = 0; i < options.length; i++) {
          if (options[i].getAttribute("data-value") === this.state) {
            this.selectedIndex = i;
            break;
          }
        }
      }
      if (this.selectedIndex === -1 && options.length > 0) {
        this.selectedIndex = 0;
      }
      if (this.selectedIndex >= 0) {
        options[this.selectedIndex].classList.add("fi-selected");
        options[this.selectedIndex].focus();
      }
    }
  }
  positionDropdown() {
    const placement = this.position === "top" ? "top-start" : "bottom-start";
    const middleware = [
      offset2(4),
      // Add some space between button and dropdown
      shift2({ padding: 5 })
      // Keep within viewport with some padding
    ];
    if (this.position !== "top" && this.position !== "bottom") {
      middleware.push(flip2());
    }
    const isInModal = this.selectButton.closest(".fi-modal") !== null;
    computePosition2(this.selectButton, this.dropdown, {
      placement,
      middleware,
      strategy: isInModal ? "absolute" : "fixed"
    }).then(({ x, y }) => {
      Object.assign(this.dropdown.style, {
        left: `${x}px`,
        top: `${y}px`
      });
    });
  }
  closeDropdown() {
    this.dropdown.style.display = "none";
    this.selectButton.setAttribute("aria-expanded", "false");
    this.isOpen = false;
    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
      this.resizeListener = null;
    }
    if (this.scrollListener) {
      window.removeEventListener("scroll", this.scrollListener, true);
      this.scrollListener = null;
    }
    const options = this.getVisibleOptions();
    options.forEach((option) => {
      option.classList.remove("fi-selected");
    });
  }
  focusNextOption() {
    const options = this.getVisibleOptions();
    if (options.length === 0) return;
    if (this.selectedIndex >= 0 && this.selectedIndex < options.length) {
      options[this.selectedIndex].classList.remove("fi-selected");
    }
    if (this.selectedIndex === options.length - 1 && this.isSearchable && this.searchInput) {
      this.selectedIndex = -1;
      this.searchInput.focus();
      this.dropdown.removeAttribute("aria-activedescendant");
      return;
    }
    this.selectedIndex = (this.selectedIndex + 1) % options.length;
    options[this.selectedIndex].classList.add("fi-selected");
    options[this.selectedIndex].focus();
    if (options[this.selectedIndex].id) {
      this.dropdown.setAttribute(
        "aria-activedescendant",
        options[this.selectedIndex].id
      );
    }
    this.scrollOptionIntoView(options[this.selectedIndex]);
  }
  focusPreviousOption() {
    const options = this.getVisibleOptions();
    if (options.length === 0) return;
    if (this.selectedIndex >= 0 && this.selectedIndex < options.length) {
      options[this.selectedIndex].classList.remove("fi-selected");
    }
    if ((this.selectedIndex === 0 || this.selectedIndex === -1) && this.isSearchable && this.searchInput) {
      this.selectedIndex = -1;
      this.searchInput.focus();
      this.dropdown.removeAttribute("aria-activedescendant");
      return;
    }
    this.selectedIndex = (this.selectedIndex - 1 + options.length) % options.length;
    options[this.selectedIndex].classList.add("fi-selected");
    options[this.selectedIndex].focus();
    if (options[this.selectedIndex].id) {
      this.dropdown.setAttribute(
        "aria-activedescendant",
        options[this.selectedIndex].id
      );
    }
    this.scrollOptionIntoView(options[this.selectedIndex]);
  }
  scrollOptionIntoView(option) {
    if (!option) return;
    const dropdownRect = this.dropdown.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();
    if (optionRect.bottom > dropdownRect.bottom) {
      this.dropdown.scrollTop += optionRect.bottom - dropdownRect.bottom;
    } else if (optionRect.top < dropdownRect.top) {
      this.dropdown.scrollTop -= dropdownRect.top - optionRect.top;
    }
  }
  getVisibleOptions() {
    let ungroupedOptions = [];
    if (this.optionsList.classList.contains("fi-dropdown-list")) {
      ungroupedOptions = Array.from(
        this.optionsList.querySelectorAll(':scope > li[role="option"]')
      );
    } else {
      ungroupedOptions = Array.from(
        this.optionsList.querySelectorAll(
          ':scope > ul.fi-dropdown-list > li[role="option"]'
        )
      );
    }
    const groupOptions = Array.from(
      this.optionsList.querySelectorAll(
        'li.fi-fo-select-option-group > ul > li[role="option"]'
      )
    );
    return [...ungroupedOptions, ...groupOptions];
  }
  getSelectedOptionLabels() {
    if (!Array.isArray(this.state) || this.state.length === 0) {
      return {};
    }
    const labels = {};
    for (const value of this.state) {
      let found = false;
      for (const option of this.options) {
        if (option.options && Array.isArray(option.options)) {
          for (const groupOption of option.options) {
            if (groupOption.value === value) {
              labels[value] = groupOption.label;
              found = true;
              break;
            }
          }
          if (found) break;
        } else if (option.value === value) {
          labels[value] = option.label;
          found = true;
          break;
        }
      }
    }
    return labels;
  }
  handleSearch(event) {
    const query = event.target.value.trim().toLowerCase();
    this.searchQuery = query;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (query === "") {
      this.options = JSON.parse(JSON.stringify(this.originalOptions));
      this.renderOptions();
      return;
    }
    if (!this.getSearchResultsUsing || typeof this.getSearchResultsUsing !== "function" || !this.hasDynamicSearchResults) {
      this.filterOptions(query);
      return;
    }
    this.searchTimeout = setTimeout(async () => {
      try {
        this.showLoadingState(true);
        const results = await this.getSearchResultsUsing(query);
        this.options = results;
        this.populateLabelRepositoryFromOptions(results);
        this.hideLoadingState();
        this.renderOptions();
        if (this.isOpen) {
          this.positionDropdown();
        }
        if (this.options.length === 0) {
          this.showNoResultsMessage();
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        this.hideLoadingState();
        this.options = JSON.parse(JSON.stringify(this.originalOptions));
        this.renderOptions();
      }
    }, this.searchDebounce);
  }
  showLoadingState(isSearching = false) {
    if (this.optionsList.parentNode === this.dropdown) {
      this.optionsList.innerHTML = "";
    }
    this.hideLoadingState();
    const loadingItem = document.createElement("div");
    loadingItem.className = "fi-fo-select-message";
    loadingItem.textContent = isSearching ? this.searchingMessage : this.loadingMessage;
    this.dropdown.appendChild(loadingItem);
  }
  hideLoadingState() {
    const loadingItem = this.dropdown.querySelector(".fi-fo-select-message");
    if (loadingItem) {
      loadingItem.remove();
    }
  }
  showNoResultsMessage() {
    if (this.optionsList.parentNode === this.dropdown && this.optionsList.children.length > 0) {
      this.optionsList.innerHTML = "";
    }
    this.hideLoadingState();
    const noResultsItem = document.createElement("div");
    noResultsItem.className = "fi-fo-select-message";
    noResultsItem.textContent = this.noSearchResultsMessage;
    this.dropdown.appendChild(noResultsItem);
  }
  filterOptions(query) {
    const searchInLabel = this.searchableOptionFields.includes("label");
    const searchInValue = this.searchableOptionFields.includes("value");
    const filteredOptions = [];
    for (const option of this.originalOptions) {
      if (option.options && Array.isArray(option.options)) {
        const filteredGroupOptions = option.options.filter(
          (groupOption) => {
            return searchInLabel && groupOption.label.toLowerCase().includes(query) || searchInValue && String(groupOption.value).toLowerCase().includes(query);
          }
        );
        if (filteredGroupOptions.length > 0) {
          filteredOptions.push({
            label: option.label,
            options: filteredGroupOptions
          });
        }
      } else if (searchInLabel && option.label.toLowerCase().includes(query) || searchInValue && String(option.value).toLowerCase().includes(query)) {
        filteredOptions.push(option);
      }
    }
    this.options = filteredOptions;
    this.renderOptions();
    if (this.options.length === 0) {
      this.showNoResultsMessage();
    }
    if (this.isOpen) {
      this.positionDropdown();
    }
  }
  selectOption(value) {
    if (this.isDisabled) {
      return;
    }
    if (!this.isMultiple) {
      this.state = value;
      this.updateSelectedDisplay();
      this.renderOptions();
      this.closeDropdown();
      this.selectButton.focus();
      this.onStateChange(this.state);
      return;
    }
    let newState = Array.isArray(this.state) ? [...this.state] : [];
    if (newState.includes(value)) {
      const badgeToRemove = this.selectedDisplay.querySelector(
        `[data-value="${value}"]`
      );
      if (filled(badgeToRemove)) {
        const badgesContainer = badgeToRemove.parentElement;
        if (filled(badgesContainer) && badgesContainer.children.length === 1) {
          newState = newState.filter((v) => v !== value);
          this.state = newState;
          this.updateSelectedDisplay();
        } else {
          badgeToRemove.remove();
          newState = newState.filter((v) => v !== value);
          this.state = newState;
        }
      } else {
        newState = newState.filter((v) => v !== value);
        this.state = newState;
        this.updateSelectedDisplay();
      }
      this.renderOptions();
      if (this.isOpen) {
        this.positionDropdown();
      }
      this.maintainFocusInMultipleMode();
      this.onStateChange(this.state);
      return;
    }
    if (this.maxItems && newState.length >= this.maxItems) {
      if (this.maxItemsMessage) {
        alert(this.maxItemsMessage);
      }
      return;
    }
    newState.push(value);
    this.state = newState;
    const existingBadgesContainer = this.selectedDisplay.querySelector(
      ".fi-fo-select-value-badges-ctn"
    );
    if (blank(existingBadgesContainer)) {
      this.updateSelectedDisplay();
    } else {
      this.addSingleBadge(value, existingBadgesContainer);
    }
    this.renderOptions();
    if (this.isOpen) {
      this.positionDropdown();
    }
    this.maintainFocusInMultipleMode();
    this.onStateChange(this.state);
  }
  // Helper method to add a single badge for a value
  async addSingleBadge(value, badgesContainer) {
    let label = this.labelRepository[value];
    if (blank(label)) {
      label = this.getSelectedOptionLabel(value);
      if (filled(label)) {
        this.labelRepository[value] = label;
      }
    }
    if (blank(label) && this.getOptionLabelsUsing) {
      try {
        const fetchedOptionsArray = await this.getOptionLabelsUsing();
        for (const option of fetchedOptionsArray) {
          if (filled(option) && option.value === value && option.label !== void 0) {
            label = option.label;
            this.labelRepository[value] = label;
            break;
          }
        }
      } catch (error) {
        console.error("Error fetching option label:", error);
      }
    }
    if (blank(label)) {
      label = value;
    }
    const badge = this.createBadgeElement(value, label);
    badgesContainer.appendChild(badge);
  }
  // Helper method to maintain focus in multiple selection mode
  maintainFocusInMultipleMode() {
    if (this.isSearchable && this.searchInput) {
      this.searchInput.focus();
      return;
    }
    const options = this.getVisibleOptions();
    if (options.length === 0) {
      return;
    }
    this.selectedIndex = -1;
    if (Array.isArray(this.state) && this.state.length > 0) {
      for (let i = 0; i < options.length; i++) {
        if (this.state.includes(options[i].getAttribute("data-value"))) {
          this.selectedIndex = i;
          break;
        }
      }
    }
    if (this.selectedIndex === -1) {
      this.selectedIndex = 0;
    }
    options[this.selectedIndex].classList.add("fi-selected");
    options[this.selectedIndex].focus();
  }
  disable() {
    if (this.isDisabled) return;
    this.isDisabled = true;
    this.applyDisabledState();
    if (this.isOpen) {
      this.closeDropdown();
    }
  }
  enable() {
    if (!this.isDisabled) return;
    this.isDisabled = false;
    this.applyDisabledState();
  }
  applyDisabledState() {
    if (this.isDisabled) {
      this.selectButton.setAttribute("disabled", "disabled");
      this.selectButton.setAttribute("aria-disabled", "true");
      this.selectButton.classList.add("fi-disabled");
      if (this.isMultiple) {
        const removeButtons = this.container.querySelectorAll(
          ".fi-fo-select-badge-remove"
        );
        removeButtons.forEach((button) => {
          button.setAttribute("disabled", "disabled");
          button.classList.add("fi-disabled");
        });
      }
      if (!this.isMultiple && this.canSelectPlaceholder) {
        const removeButton = this.container.querySelector(
          ".fi-fo-select-value-remove-btn"
        );
        if (removeButton) {
          removeButton.setAttribute("disabled", "disabled");
          removeButton.classList.add("fi-disabled");
        }
      }
      if (this.isSearchable && this.searchInput) {
        this.searchInput.setAttribute("disabled", "disabled");
        this.searchInput.classList.add("fi-disabled");
      }
    } else {
      this.selectButton.removeAttribute("disabled");
      this.selectButton.removeAttribute("aria-disabled");
      this.selectButton.classList.remove("fi-disabled");
      if (this.isMultiple) {
        const removeButtons = this.container.querySelectorAll(
          ".fi-fo-select-badge-remove"
        );
        removeButtons.forEach((button) => {
          button.removeAttribute("disabled");
          button.classList.remove("fi-disabled");
        });
      }
      if (!this.isMultiple && this.canSelectPlaceholder) {
        const removeButton = this.container.querySelector(
          ".fi-fo-select-value-remove-btn"
        );
        if (removeButton) {
          removeButton.removeAttribute("disabled");
          removeButton.classList.add("fi-disabled");
        }
      }
      if (this.isSearchable && this.searchInput) {
        this.searchInput.removeAttribute("disabled");
        this.searchInput.classList.remove("fi-disabled");
      }
    }
  }
  destroy() {
    if (this.selectButton && this.buttonClickListener) {
      this.selectButton.removeEventListener(
        "click",
        this.buttonClickListener
      );
    }
    if (this.documentClickListener) {
      document.removeEventListener("click", this.documentClickListener);
    }
    if (this.selectButton && this.buttonKeydownListener) {
      this.selectButton.removeEventListener(
        "keydown",
        this.buttonKeydownListener
      );
    }
    if (this.dropdown && this.dropdownKeydownListener) {
      this.dropdown.removeEventListener(
        "keydown",
        this.dropdownKeydownListener
      );
    }
    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
      this.resizeListener = null;
    }
    if (this.scrollListener) {
      window.removeEventListener("scroll", this.scrollListener, true);
      this.scrollListener = null;
    }
    if (this.refreshOptionLabelListener) {
      window.removeEventListener(
        "filament-forms::select.refreshSelectedOptionLabel",
        this.refreshOptionLabelListener
      );
    }
    if (this.isOpen) {
      this.closeDropdown();
    }
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
  }
};
export {
  selectFormComponent as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BmbG9hdGluZy11aS91dGlscy9kaXN0L2Zsb2F0aW5nLXVpLnV0aWxzLm1qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGZsb2F0aW5nLXVpL2NvcmUvZGlzdC9mbG9hdGluZy11aS5jb3JlLm1qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGZsb2F0aW5nLXVpL3V0aWxzL2Rpc3QvZmxvYXRpbmctdWkudXRpbHMuZG9tLm1qcyIsICIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGZsb2F0aW5nLXVpL2RvbS9kaXN0L2Zsb2F0aW5nLXVpLmRvbS5tanMiLCAiLi4vLi4vcmVzb3VyY2VzL2pzL2NvbXBvbmVudHMvc2VsZWN0LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKipcbiAqIEN1c3RvbSBwb3NpdGlvbmluZyByZWZlcmVuY2UgZWxlbWVudC5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy92aXJ0dWFsLWVsZW1lbnRzXG4gKi9cblxuY29uc3Qgc2lkZXMgPSBbJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddO1xuY29uc3QgYWxpZ25tZW50cyA9IFsnc3RhcnQnLCAnZW5kJ107XG5jb25zdCBwbGFjZW1lbnRzID0gLyojX19QVVJFX18qL3NpZGVzLnJlZHVjZSgoYWNjLCBzaWRlKSA9PiBhY2MuY29uY2F0KHNpZGUsIHNpZGUgKyBcIi1cIiArIGFsaWdubWVudHNbMF0sIHNpZGUgKyBcIi1cIiArIGFsaWdubWVudHNbMV0pLCBbXSk7XG5jb25zdCBtaW4gPSBNYXRoLm1pbjtcbmNvbnN0IG1heCA9IE1hdGgubWF4O1xuY29uc3Qgcm91bmQgPSBNYXRoLnJvdW5kO1xuY29uc3QgZmxvb3IgPSBNYXRoLmZsb29yO1xuY29uc3QgY3JlYXRlQ29vcmRzID0gdiA9PiAoe1xuICB4OiB2LFxuICB5OiB2XG59KTtcbmNvbnN0IG9wcG9zaXRlU2lkZU1hcCA9IHtcbiAgbGVmdDogJ3JpZ2h0JyxcbiAgcmlnaHQ6ICdsZWZ0JyxcbiAgYm90dG9tOiAndG9wJyxcbiAgdG9wOiAnYm90dG9tJ1xufTtcbmNvbnN0IG9wcG9zaXRlQWxpZ25tZW50TWFwID0ge1xuICBzdGFydDogJ2VuZCcsXG4gIGVuZDogJ3N0YXJ0J1xufTtcbmZ1bmN0aW9uIGNsYW1wKHN0YXJ0LCB2YWx1ZSwgZW5kKSB7XG4gIHJldHVybiBtYXgoc3RhcnQsIG1pbih2YWx1ZSwgZW5kKSk7XG59XG5mdW5jdGlvbiBldmFsdWF0ZSh2YWx1ZSwgcGFyYW0pIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IHZhbHVlKHBhcmFtKSA6IHZhbHVlO1xufVxuZnVuY3Rpb24gZ2V0U2lkZShwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xufVxuZnVuY3Rpb24gZ2V0QWxpZ25tZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnNwbGl0KCctJylbMV07XG59XG5mdW5jdGlvbiBnZXRPcHBvc2l0ZUF4aXMoYXhpcykge1xuICByZXR1cm4gYXhpcyA9PT0gJ3gnID8gJ3knIDogJ3gnO1xufVxuZnVuY3Rpb24gZ2V0QXhpc0xlbmd0aChheGlzKSB7XG4gIHJldHVybiBheGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG59XG5mdW5jdGlvbiBnZXRTaWRlQXhpcyhwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIFsndG9wJywgJ2JvdHRvbSddLmluY2x1ZGVzKGdldFNpZGUocGxhY2VtZW50KSkgPyAneScgOiAneCc7XG59XG5mdW5jdGlvbiBnZXRBbGlnbm1lbnRBeGlzKHBsYWNlbWVudCkge1xuICByZXR1cm4gZ2V0T3Bwb3NpdGVBeGlzKGdldFNpZGVBeGlzKHBsYWNlbWVudCkpO1xufVxuZnVuY3Rpb24gZ2V0QWxpZ25tZW50U2lkZXMocGxhY2VtZW50LCByZWN0cywgcnRsKSB7XG4gIGlmIChydGwgPT09IHZvaWQgMCkge1xuICAgIHJ0bCA9IGZhbHNlO1xuICB9XG4gIGNvbnN0IGFsaWdubWVudCA9IGdldEFsaWdubWVudChwbGFjZW1lbnQpO1xuICBjb25zdCBhbGlnbm1lbnRBeGlzID0gZ2V0QWxpZ25tZW50QXhpcyhwbGFjZW1lbnQpO1xuICBjb25zdCBsZW5ndGggPSBnZXRBeGlzTGVuZ3RoKGFsaWdubWVudEF4aXMpO1xuICBsZXQgbWFpbkFsaWdubWVudFNpZGUgPSBhbGlnbm1lbnRBeGlzID09PSAneCcgPyBhbGlnbm1lbnQgPT09IChydGwgPyAnZW5kJyA6ICdzdGFydCcpID8gJ3JpZ2h0JyA6ICdsZWZ0JyA6IGFsaWdubWVudCA9PT0gJ3N0YXJ0JyA/ICdib3R0b20nIDogJ3RvcCc7XG4gIGlmIChyZWN0cy5yZWZlcmVuY2VbbGVuZ3RoXSA+IHJlY3RzLmZsb2F0aW5nW2xlbmd0aF0pIHtcbiAgICBtYWluQWxpZ25tZW50U2lkZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KG1haW5BbGlnbm1lbnRTaWRlKTtcbiAgfVxuICByZXR1cm4gW21haW5BbGlnbm1lbnRTaWRlLCBnZXRPcHBvc2l0ZVBsYWNlbWVudChtYWluQWxpZ25tZW50U2lkZSldO1xufVxuZnVuY3Rpb24gZ2V0RXhwYW5kZWRQbGFjZW1lbnRzKHBsYWNlbWVudCkge1xuICBjb25zdCBvcHBvc2l0ZVBsYWNlbWVudCA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XG4gIHJldHVybiBbZ2V0T3Bwb3NpdGVBbGlnbm1lbnRQbGFjZW1lbnQocGxhY2VtZW50KSwgb3Bwb3NpdGVQbGFjZW1lbnQsIGdldE9wcG9zaXRlQWxpZ25tZW50UGxhY2VtZW50KG9wcG9zaXRlUGxhY2VtZW50KV07XG59XG5mdW5jdGlvbiBnZXRPcHBvc2l0ZUFsaWdubWVudFBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5yZXBsYWNlKC9zdGFydHxlbmQvZywgYWxpZ25tZW50ID0+IG9wcG9zaXRlQWxpZ25tZW50TWFwW2FsaWdubWVudF0pO1xufVxuZnVuY3Rpb24gZ2V0U2lkZUxpc3Qoc2lkZSwgaXNTdGFydCwgcnRsKSB7XG4gIGNvbnN0IGxyID0gWydsZWZ0JywgJ3JpZ2h0J107XG4gIGNvbnN0IHJsID0gWydyaWdodCcsICdsZWZ0J107XG4gIGNvbnN0IHRiID0gWyd0b3AnLCAnYm90dG9tJ107XG4gIGNvbnN0IGJ0ID0gWydib3R0b20nLCAndG9wJ107XG4gIHN3aXRjaCAoc2lkZSkge1xuICAgIGNhc2UgJ3RvcCc6XG4gICAgY2FzZSAnYm90dG9tJzpcbiAgICAgIGlmIChydGwpIHJldHVybiBpc1N0YXJ0ID8gcmwgOiBscjtcbiAgICAgIHJldHVybiBpc1N0YXJ0ID8gbHIgOiBybDtcbiAgICBjYXNlICdsZWZ0JzpcbiAgICBjYXNlICdyaWdodCc6XG4gICAgICByZXR1cm4gaXNTdGFydCA/IHRiIDogYnQ7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBbXTtcbiAgfVxufVxuZnVuY3Rpb24gZ2V0T3Bwb3NpdGVBeGlzUGxhY2VtZW50cyhwbGFjZW1lbnQsIGZsaXBBbGlnbm1lbnQsIGRpcmVjdGlvbiwgcnRsKSB7XG4gIGNvbnN0IGFsaWdubWVudCA9IGdldEFsaWdubWVudChwbGFjZW1lbnQpO1xuICBsZXQgbGlzdCA9IGdldFNpZGVMaXN0KGdldFNpZGUocGxhY2VtZW50KSwgZGlyZWN0aW9uID09PSAnc3RhcnQnLCBydGwpO1xuICBpZiAoYWxpZ25tZW50KSB7XG4gICAgbGlzdCA9IGxpc3QubWFwKHNpZGUgPT4gc2lkZSArIFwiLVwiICsgYWxpZ25tZW50KTtcbiAgICBpZiAoZmxpcEFsaWdubWVudCkge1xuICAgICAgbGlzdCA9IGxpc3QuY29uY2F0KGxpc3QubWFwKGdldE9wcG9zaXRlQWxpZ25tZW50UGxhY2VtZW50KSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBsaXN0O1xufVxuZnVuY3Rpb24gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KSB7XG4gIHJldHVybiBwbGFjZW1lbnQucmVwbGFjZSgvbGVmdHxyaWdodHxib3R0b218dG9wL2csIHNpZGUgPT4gb3Bwb3NpdGVTaWRlTWFwW3NpZGVdKTtcbn1cbmZ1bmN0aW9uIGV4cGFuZFBhZGRpbmdPYmplY3QocGFkZGluZykge1xuICByZXR1cm4ge1xuICAgIHRvcDogMCxcbiAgICByaWdodDogMCxcbiAgICBib3R0b206IDAsXG4gICAgbGVmdDogMCxcbiAgICAuLi5wYWRkaW5nXG4gIH07XG59XG5mdW5jdGlvbiBnZXRQYWRkaW5nT2JqZWN0KHBhZGRpbmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBwYWRkaW5nICE9PSAnbnVtYmVyJyA/IGV4cGFuZFBhZGRpbmdPYmplY3QocGFkZGluZykgOiB7XG4gICAgdG9wOiBwYWRkaW5nLFxuICAgIHJpZ2h0OiBwYWRkaW5nLFxuICAgIGJvdHRvbTogcGFkZGluZyxcbiAgICBsZWZ0OiBwYWRkaW5nXG4gIH07XG59XG5mdW5jdGlvbiByZWN0VG9DbGllbnRSZWN0KHJlY3QpIHtcbiAgY29uc3Qge1xuICAgIHgsXG4gICAgeSxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHRcbiAgfSA9IHJlY3Q7XG4gIHJldHVybiB7XG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIHRvcDogeSxcbiAgICBsZWZ0OiB4LFxuICAgIHJpZ2h0OiB4ICsgd2lkdGgsXG4gICAgYm90dG9tOiB5ICsgaGVpZ2h0LFxuICAgIHgsXG4gICAgeVxuICB9O1xufVxuXG5leHBvcnQgeyBhbGlnbm1lbnRzLCBjbGFtcCwgY3JlYXRlQ29vcmRzLCBldmFsdWF0ZSwgZXhwYW5kUGFkZGluZ09iamVjdCwgZmxvb3IsIGdldEFsaWdubWVudCwgZ2V0QWxpZ25tZW50QXhpcywgZ2V0QWxpZ25tZW50U2lkZXMsIGdldEF4aXNMZW5ndGgsIGdldEV4cGFuZGVkUGxhY2VtZW50cywgZ2V0T3Bwb3NpdGVBbGlnbm1lbnRQbGFjZW1lbnQsIGdldE9wcG9zaXRlQXhpcywgZ2V0T3Bwb3NpdGVBeGlzUGxhY2VtZW50cywgZ2V0T3Bwb3NpdGVQbGFjZW1lbnQsIGdldFBhZGRpbmdPYmplY3QsIGdldFNpZGUsIGdldFNpZGVBeGlzLCBtYXgsIG1pbiwgcGxhY2VtZW50cywgcmVjdFRvQ2xpZW50UmVjdCwgcm91bmQsIHNpZGVzIH07XG4iLCAiaW1wb3J0IHsgZ2V0U2lkZUF4aXMsIGdldEFsaWdubWVudEF4aXMsIGdldEF4aXNMZW5ndGgsIGdldFNpZGUsIGdldEFsaWdubWVudCwgZXZhbHVhdGUsIGdldFBhZGRpbmdPYmplY3QsIHJlY3RUb0NsaWVudFJlY3QsIG1pbiwgY2xhbXAsIHBsYWNlbWVudHMsIGdldEFsaWdubWVudFNpZGVzLCBnZXRPcHBvc2l0ZUFsaWdubWVudFBsYWNlbWVudCwgZ2V0T3Bwb3NpdGVQbGFjZW1lbnQsIGdldEV4cGFuZGVkUGxhY2VtZW50cywgZ2V0T3Bwb3NpdGVBeGlzUGxhY2VtZW50cywgc2lkZXMsIG1heCwgZ2V0T3Bwb3NpdGVBeGlzIH0gZnJvbSAnQGZsb2F0aW5nLXVpL3V0aWxzJztcbmV4cG9ydCB7IHJlY3RUb0NsaWVudFJlY3QgfSBmcm9tICdAZmxvYXRpbmctdWkvdXRpbHMnO1xuXG5mdW5jdGlvbiBjb21wdXRlQ29vcmRzRnJvbVBsYWNlbWVudChfcmVmLCBwbGFjZW1lbnQsIHJ0bCkge1xuICBsZXQge1xuICAgIHJlZmVyZW5jZSxcbiAgICBmbG9hdGluZ1xuICB9ID0gX3JlZjtcbiAgY29uc3Qgc2lkZUF4aXMgPSBnZXRTaWRlQXhpcyhwbGFjZW1lbnQpO1xuICBjb25zdCBhbGlnbm1lbnRBeGlzID0gZ2V0QWxpZ25tZW50QXhpcyhwbGFjZW1lbnQpO1xuICBjb25zdCBhbGlnbkxlbmd0aCA9IGdldEF4aXNMZW5ndGgoYWxpZ25tZW50QXhpcyk7XG4gIGNvbnN0IHNpZGUgPSBnZXRTaWRlKHBsYWNlbWVudCk7XG4gIGNvbnN0IGlzVmVydGljYWwgPSBzaWRlQXhpcyA9PT0gJ3knO1xuICBjb25zdCBjb21tb25YID0gcmVmZXJlbmNlLnggKyByZWZlcmVuY2Uud2lkdGggLyAyIC0gZmxvYXRpbmcud2lkdGggLyAyO1xuICBjb25zdCBjb21tb25ZID0gcmVmZXJlbmNlLnkgKyByZWZlcmVuY2UuaGVpZ2h0IC8gMiAtIGZsb2F0aW5nLmhlaWdodCAvIDI7XG4gIGNvbnN0IGNvbW1vbkFsaWduID0gcmVmZXJlbmNlW2FsaWduTGVuZ3RoXSAvIDIgLSBmbG9hdGluZ1thbGlnbkxlbmd0aF0gLyAyO1xuICBsZXQgY29vcmRzO1xuICBzd2l0Y2ggKHNpZGUpIHtcbiAgICBjYXNlICd0b3AnOlxuICAgICAgY29vcmRzID0ge1xuICAgICAgICB4OiBjb21tb25YLFxuICAgICAgICB5OiByZWZlcmVuY2UueSAtIGZsb2F0aW5nLmhlaWdodFxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICBjb29yZHMgPSB7XG4gICAgICAgIHg6IGNvbW1vblgsXG4gICAgICAgIHk6IHJlZmVyZW5jZS55ICsgcmVmZXJlbmNlLmhlaWdodFxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgIGNvb3JkcyA9IHtcbiAgICAgICAgeDogcmVmZXJlbmNlLnggKyByZWZlcmVuY2Uud2lkdGgsXG4gICAgICAgIHk6IGNvbW1vbllcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdsZWZ0JzpcbiAgICAgIGNvb3JkcyA9IHtcbiAgICAgICAgeDogcmVmZXJlbmNlLnggLSBmbG9hdGluZy53aWR0aCxcbiAgICAgICAgeTogY29tbW9uWVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBjb29yZHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54LFxuICAgICAgICB5OiByZWZlcmVuY2UueVxuICAgICAgfTtcbiAgfVxuICBzd2l0Y2ggKGdldEFsaWdubWVudChwbGFjZW1lbnQpKSB7XG4gICAgY2FzZSAnc3RhcnQnOlxuICAgICAgY29vcmRzW2FsaWdubWVudEF4aXNdIC09IGNvbW1vbkFsaWduICogKHJ0bCAmJiBpc1ZlcnRpY2FsID8gLTEgOiAxKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2VuZCc6XG4gICAgICBjb29yZHNbYWxpZ25tZW50QXhpc10gKz0gY29tbW9uQWxpZ24gKiAocnRsICYmIGlzVmVydGljYWwgPyAtMSA6IDEpO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIGNvb3Jkcztcbn1cblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgYHhgIGFuZCBgeWAgY29vcmRpbmF0ZXMgdGhhdCB3aWxsIHBsYWNlIHRoZSBmbG9hdGluZyBlbGVtZW50XG4gKiBuZXh0IHRvIGEgZ2l2ZW4gcmVmZXJlbmNlIGVsZW1lbnQuXG4gKlxuICogVGhpcyBleHBvcnQgZG9lcyBub3QgaGF2ZSBhbnkgYHBsYXRmb3JtYCBpbnRlcmZhY2UgbG9naWMuIFlvdSB3aWxsIG5lZWQgdG9cbiAqIHdyaXRlIG9uZSBmb3IgdGhlIHBsYXRmb3JtIHlvdSBhcmUgdXNpbmcgRmxvYXRpbmcgVUkgd2l0aC5cbiAqL1xuY29uc3QgY29tcHV0ZVBvc2l0aW9uID0gYXN5bmMgKHJlZmVyZW5jZSwgZmxvYXRpbmcsIGNvbmZpZykgPT4ge1xuICBjb25zdCB7XG4gICAgcGxhY2VtZW50ID0gJ2JvdHRvbScsXG4gICAgc3RyYXRlZ3kgPSAnYWJzb2x1dGUnLFxuICAgIG1pZGRsZXdhcmUgPSBbXSxcbiAgICBwbGF0Zm9ybVxuICB9ID0gY29uZmlnO1xuICBjb25zdCB2YWxpZE1pZGRsZXdhcmUgPSBtaWRkbGV3YXJlLmZpbHRlcihCb29sZWFuKTtcbiAgY29uc3QgcnRsID0gYXdhaXQgKHBsYXRmb3JtLmlzUlRMID09IG51bGwgPyB2b2lkIDAgOiBwbGF0Zm9ybS5pc1JUTChmbG9hdGluZykpO1xuICBsZXQgcmVjdHMgPSBhd2FpdCBwbGF0Zm9ybS5nZXRFbGVtZW50UmVjdHMoe1xuICAgIHJlZmVyZW5jZSxcbiAgICBmbG9hdGluZyxcbiAgICBzdHJhdGVneVxuICB9KTtcbiAgbGV0IHtcbiAgICB4LFxuICAgIHlcbiAgfSA9IGNvbXB1dGVDb29yZHNGcm9tUGxhY2VtZW50KHJlY3RzLCBwbGFjZW1lbnQsIHJ0bCk7XG4gIGxldCBzdGF0ZWZ1bFBsYWNlbWVudCA9IHBsYWNlbWVudDtcbiAgbGV0IG1pZGRsZXdhcmVEYXRhID0ge307XG4gIGxldCByZXNldENvdW50ID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWxpZE1pZGRsZXdhcmUubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB7XG4gICAgICBuYW1lLFxuICAgICAgZm5cbiAgICB9ID0gdmFsaWRNaWRkbGV3YXJlW2ldO1xuICAgIGNvbnN0IHtcbiAgICAgIHg6IG5leHRYLFxuICAgICAgeTogbmV4dFksXG4gICAgICBkYXRhLFxuICAgICAgcmVzZXRcbiAgICB9ID0gYXdhaXQgZm4oe1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgICBpbml0aWFsUGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgICBwbGFjZW1lbnQ6IHN0YXRlZnVsUGxhY2VtZW50LFxuICAgICAgc3RyYXRlZ3ksXG4gICAgICBtaWRkbGV3YXJlRGF0YSxcbiAgICAgIHJlY3RzLFxuICAgICAgcGxhdGZvcm0sXG4gICAgICBlbGVtZW50czoge1xuICAgICAgICByZWZlcmVuY2UsXG4gICAgICAgIGZsb2F0aW5nXG4gICAgICB9XG4gICAgfSk7XG4gICAgeCA9IG5leHRYICE9IG51bGwgPyBuZXh0WCA6IHg7XG4gICAgeSA9IG5leHRZICE9IG51bGwgPyBuZXh0WSA6IHk7XG4gICAgbWlkZGxld2FyZURhdGEgPSB7XG4gICAgICAuLi5taWRkbGV3YXJlRGF0YSxcbiAgICAgIFtuYW1lXToge1xuICAgICAgICAuLi5taWRkbGV3YXJlRGF0YVtuYW1lXSxcbiAgICAgICAgLi4uZGF0YVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHJlc2V0ICYmIHJlc2V0Q291bnQgPD0gNTApIHtcbiAgICAgIHJlc2V0Q291bnQrKztcbiAgICAgIGlmICh0eXBlb2YgcmVzZXQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmIChyZXNldC5wbGFjZW1lbnQpIHtcbiAgICAgICAgICBzdGF0ZWZ1bFBsYWNlbWVudCA9IHJlc2V0LnBsYWNlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzZXQucmVjdHMpIHtcbiAgICAgICAgICByZWN0cyA9IHJlc2V0LnJlY3RzID09PSB0cnVlID8gYXdhaXQgcGxhdGZvcm0uZ2V0RWxlbWVudFJlY3RzKHtcbiAgICAgICAgICAgIHJlZmVyZW5jZSxcbiAgICAgICAgICAgIGZsb2F0aW5nLFxuICAgICAgICAgICAgc3RyYXRlZ3lcbiAgICAgICAgICB9KSA6IHJlc2V0LnJlY3RzO1xuICAgICAgICB9XG4gICAgICAgICh7XG4gICAgICAgICAgeCxcbiAgICAgICAgICB5XG4gICAgICAgIH0gPSBjb21wdXRlQ29vcmRzRnJvbVBsYWNlbWVudChyZWN0cywgc3RhdGVmdWxQbGFjZW1lbnQsIHJ0bCkpO1xuICAgICAgfVxuICAgICAgaSA9IC0xO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIHgsXG4gICAgeSxcbiAgICBwbGFjZW1lbnQ6IHN0YXRlZnVsUGxhY2VtZW50LFxuICAgIHN0cmF0ZWd5LFxuICAgIG1pZGRsZXdhcmVEYXRhXG4gIH07XG59O1xuXG4vKipcbiAqIFJlc29sdmVzIHdpdGggYW4gb2JqZWN0IG9mIG92ZXJmbG93IHNpZGUgb2Zmc2V0cyB0aGF0IGRldGVybWluZSBob3cgbXVjaCB0aGVcbiAqIGVsZW1lbnQgaXMgb3ZlcmZsb3dpbmcgYSBnaXZlbiBjbGlwcGluZyBib3VuZGFyeSBvbiBlYWNoIHNpZGUuXG4gKiAtIHBvc2l0aXZlID0gb3ZlcmZsb3dpbmcgdGhlIGJvdW5kYXJ5IGJ5IHRoYXQgbnVtYmVyIG9mIHBpeGVsc1xuICogLSBuZWdhdGl2ZSA9IGhvdyBtYW55IHBpeGVscyBsZWZ0IGJlZm9yZSBpdCB3aWxsIG92ZXJmbG93XG4gKiAtIDAgPSBsaWVzIGZsdXNoIHdpdGggdGhlIGJvdW5kYXJ5XG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3MvZGV0ZWN0T3ZlcmZsb3dcbiAqL1xuYXN5bmMgZnVuY3Rpb24gZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIG9wdGlvbnMpIHtcbiAgdmFyIF9hd2FpdCRwbGF0Zm9ybSRpc0VsZTtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBjb25zdCB7XG4gICAgeCxcbiAgICB5LFxuICAgIHBsYXRmb3JtLFxuICAgIHJlY3RzLFxuICAgIGVsZW1lbnRzLFxuICAgIHN0cmF0ZWd5XG4gIH0gPSBzdGF0ZTtcbiAgY29uc3Qge1xuICAgIGJvdW5kYXJ5ID0gJ2NsaXBwaW5nQW5jZXN0b3JzJyxcbiAgICByb290Qm91bmRhcnkgPSAndmlld3BvcnQnLFxuICAgIGVsZW1lbnRDb250ZXh0ID0gJ2Zsb2F0aW5nJyxcbiAgICBhbHRCb3VuZGFyeSA9IGZhbHNlLFxuICAgIHBhZGRpbmcgPSAwXG4gIH0gPSBldmFsdWF0ZShvcHRpb25zLCBzdGF0ZSk7XG4gIGNvbnN0IHBhZGRpbmdPYmplY3QgPSBnZXRQYWRkaW5nT2JqZWN0KHBhZGRpbmcpO1xuICBjb25zdCBhbHRDb250ZXh0ID0gZWxlbWVudENvbnRleHQgPT09ICdmbG9hdGluZycgPyAncmVmZXJlbmNlJyA6ICdmbG9hdGluZyc7XG4gIGNvbnN0IGVsZW1lbnQgPSBlbGVtZW50c1thbHRCb3VuZGFyeSA/IGFsdENvbnRleHQgOiBlbGVtZW50Q29udGV4dF07XG4gIGNvbnN0IGNsaXBwaW5nQ2xpZW50UmVjdCA9IHJlY3RUb0NsaWVudFJlY3QoYXdhaXQgcGxhdGZvcm0uZ2V0Q2xpcHBpbmdSZWN0KHtcbiAgICBlbGVtZW50OiAoKF9hd2FpdCRwbGF0Zm9ybSRpc0VsZSA9IGF3YWl0IChwbGF0Zm9ybS5pc0VsZW1lbnQgPT0gbnVsbCA/IHZvaWQgMCA6IHBsYXRmb3JtLmlzRWxlbWVudChlbGVtZW50KSkpICE9IG51bGwgPyBfYXdhaXQkcGxhdGZvcm0kaXNFbGUgOiB0cnVlKSA/IGVsZW1lbnQgOiBlbGVtZW50LmNvbnRleHRFbGVtZW50IHx8IChhd2FpdCAocGxhdGZvcm0uZ2V0RG9jdW1lbnRFbGVtZW50ID09IG51bGwgPyB2b2lkIDAgOiBwbGF0Zm9ybS5nZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudHMuZmxvYXRpbmcpKSksXG4gICAgYm91bmRhcnksXG4gICAgcm9vdEJvdW5kYXJ5LFxuICAgIHN0cmF0ZWd5XG4gIH0pKTtcbiAgY29uc3QgcmVjdCA9IGVsZW1lbnRDb250ZXh0ID09PSAnZmxvYXRpbmcnID8ge1xuICAgIHgsXG4gICAgeSxcbiAgICB3aWR0aDogcmVjdHMuZmxvYXRpbmcud2lkdGgsXG4gICAgaGVpZ2h0OiByZWN0cy5mbG9hdGluZy5oZWlnaHRcbiAgfSA6IHJlY3RzLnJlZmVyZW5jZTtcbiAgY29uc3Qgb2Zmc2V0UGFyZW50ID0gYXdhaXQgKHBsYXRmb3JtLmdldE9mZnNldFBhcmVudCA9PSBudWxsID8gdm9pZCAwIDogcGxhdGZvcm0uZ2V0T2Zmc2V0UGFyZW50KGVsZW1lbnRzLmZsb2F0aW5nKSk7XG4gIGNvbnN0IG9mZnNldFNjYWxlID0gKGF3YWl0IChwbGF0Zm9ybS5pc0VsZW1lbnQgPT0gbnVsbCA/IHZvaWQgMCA6IHBsYXRmb3JtLmlzRWxlbWVudChvZmZzZXRQYXJlbnQpKSkgPyAoYXdhaXQgKHBsYXRmb3JtLmdldFNjYWxlID09IG51bGwgPyB2b2lkIDAgOiBwbGF0Zm9ybS5nZXRTY2FsZShvZmZzZXRQYXJlbnQpKSkgfHwge1xuICAgIHg6IDEsXG4gICAgeTogMVxuICB9IDoge1xuICAgIHg6IDEsXG4gICAgeTogMVxuICB9O1xuICBjb25zdCBlbGVtZW50Q2xpZW50UmVjdCA9IHJlY3RUb0NsaWVudFJlY3QocGxhdGZvcm0uY29udmVydE9mZnNldFBhcmVudFJlbGF0aXZlUmVjdFRvVmlld3BvcnRSZWxhdGl2ZVJlY3QgPyBhd2FpdCBwbGF0Zm9ybS5jb252ZXJ0T2Zmc2V0UGFyZW50UmVsYXRpdmVSZWN0VG9WaWV3cG9ydFJlbGF0aXZlUmVjdCh7XG4gICAgZWxlbWVudHMsXG4gICAgcmVjdCxcbiAgICBvZmZzZXRQYXJlbnQsXG4gICAgc3RyYXRlZ3lcbiAgfSkgOiByZWN0KTtcbiAgcmV0dXJuIHtcbiAgICB0b3A6IChjbGlwcGluZ0NsaWVudFJlY3QudG9wIC0gZWxlbWVudENsaWVudFJlY3QudG9wICsgcGFkZGluZ09iamVjdC50b3ApIC8gb2Zmc2V0U2NhbGUueSxcbiAgICBib3R0b206IChlbGVtZW50Q2xpZW50UmVjdC5ib3R0b20gLSBjbGlwcGluZ0NsaWVudFJlY3QuYm90dG9tICsgcGFkZGluZ09iamVjdC5ib3R0b20pIC8gb2Zmc2V0U2NhbGUueSxcbiAgICBsZWZ0OiAoY2xpcHBpbmdDbGllbnRSZWN0LmxlZnQgLSBlbGVtZW50Q2xpZW50UmVjdC5sZWZ0ICsgcGFkZGluZ09iamVjdC5sZWZ0KSAvIG9mZnNldFNjYWxlLngsXG4gICAgcmlnaHQ6IChlbGVtZW50Q2xpZW50UmVjdC5yaWdodCAtIGNsaXBwaW5nQ2xpZW50UmVjdC5yaWdodCArIHBhZGRpbmdPYmplY3QucmlnaHQpIC8gb2Zmc2V0U2NhbGUueFxuICB9O1xufVxuXG4vKipcbiAqIFByb3ZpZGVzIGRhdGEgdG8gcG9zaXRpb24gYW4gaW5uZXIgZWxlbWVudCBvZiB0aGUgZmxvYXRpbmcgZWxlbWVudCBzbyB0aGF0IGl0XG4gKiBhcHBlYXJzIGNlbnRlcmVkIHRvIHRoZSByZWZlcmVuY2UgZWxlbWVudC5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy9hcnJvd1xuICovXG5jb25zdCBhcnJvdyA9IG9wdGlvbnMgPT4gKHtcbiAgbmFtZTogJ2Fycm93JyxcbiAgb3B0aW9ucyxcbiAgYXN5bmMgZm4oc3RhdGUpIHtcbiAgICBjb25zdCB7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIHBsYWNlbWVudCxcbiAgICAgIHJlY3RzLFxuICAgICAgcGxhdGZvcm0sXG4gICAgICBlbGVtZW50cyxcbiAgICAgIG1pZGRsZXdhcmVEYXRhXG4gICAgfSA9IHN0YXRlO1xuICAgIC8vIFNpbmNlIGBlbGVtZW50YCBpcyByZXF1aXJlZCwgd2UgZG9uJ3QgUGFydGlhbDw+IHRoZSB0eXBlLlxuICAgIGNvbnN0IHtcbiAgICAgIGVsZW1lbnQsXG4gICAgICBwYWRkaW5nID0gMFxuICAgIH0gPSBldmFsdWF0ZShvcHRpb25zLCBzdGF0ZSkgfHwge307XG4gICAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBjb25zdCBwYWRkaW5nT2JqZWN0ID0gZ2V0UGFkZGluZ09iamVjdChwYWRkaW5nKTtcbiAgICBjb25zdCBjb29yZHMgPSB7XG4gICAgICB4LFxuICAgICAgeVxuICAgIH07XG4gICAgY29uc3QgYXhpcyA9IGdldEFsaWdubWVudEF4aXMocGxhY2VtZW50KTtcbiAgICBjb25zdCBsZW5ndGggPSBnZXRBeGlzTGVuZ3RoKGF4aXMpO1xuICAgIGNvbnN0IGFycm93RGltZW5zaW9ucyA9IGF3YWl0IHBsYXRmb3JtLmdldERpbWVuc2lvbnMoZWxlbWVudCk7XG4gICAgY29uc3QgaXNZQXhpcyA9IGF4aXMgPT09ICd5JztcbiAgICBjb25zdCBtaW5Qcm9wID0gaXNZQXhpcyA/ICd0b3AnIDogJ2xlZnQnO1xuICAgIGNvbnN0IG1heFByb3AgPSBpc1lBeGlzID8gJ2JvdHRvbScgOiAncmlnaHQnO1xuICAgIGNvbnN0IGNsaWVudFByb3AgPSBpc1lBeGlzID8gJ2NsaWVudEhlaWdodCcgOiAnY2xpZW50V2lkdGgnO1xuICAgIGNvbnN0IGVuZERpZmYgPSByZWN0cy5yZWZlcmVuY2VbbGVuZ3RoXSArIHJlY3RzLnJlZmVyZW5jZVtheGlzXSAtIGNvb3Jkc1theGlzXSAtIHJlY3RzLmZsb2F0aW5nW2xlbmd0aF07XG4gICAgY29uc3Qgc3RhcnREaWZmID0gY29vcmRzW2F4aXNdIC0gcmVjdHMucmVmZXJlbmNlW2F4aXNdO1xuICAgIGNvbnN0IGFycm93T2Zmc2V0UGFyZW50ID0gYXdhaXQgKHBsYXRmb3JtLmdldE9mZnNldFBhcmVudCA9PSBudWxsID8gdm9pZCAwIDogcGxhdGZvcm0uZ2V0T2Zmc2V0UGFyZW50KGVsZW1lbnQpKTtcbiAgICBsZXQgY2xpZW50U2l6ZSA9IGFycm93T2Zmc2V0UGFyZW50ID8gYXJyb3dPZmZzZXRQYXJlbnRbY2xpZW50UHJvcF0gOiAwO1xuXG4gICAgLy8gRE9NIHBsYXRmb3JtIGNhbiByZXR1cm4gYHdpbmRvd2AgYXMgdGhlIGBvZmZzZXRQYXJlbnRgLlxuICAgIGlmICghY2xpZW50U2l6ZSB8fCAhKGF3YWl0IChwbGF0Zm9ybS5pc0VsZW1lbnQgPT0gbnVsbCA/IHZvaWQgMCA6IHBsYXRmb3JtLmlzRWxlbWVudChhcnJvd09mZnNldFBhcmVudCkpKSkge1xuICAgICAgY2xpZW50U2l6ZSA9IGVsZW1lbnRzLmZsb2F0aW5nW2NsaWVudFByb3BdIHx8IHJlY3RzLmZsb2F0aW5nW2xlbmd0aF07XG4gICAgfVxuICAgIGNvbnN0IGNlbnRlclRvUmVmZXJlbmNlID0gZW5kRGlmZiAvIDIgLSBzdGFydERpZmYgLyAyO1xuXG4gICAgLy8gSWYgdGhlIHBhZGRpbmcgaXMgbGFyZ2UgZW5vdWdoIHRoYXQgaXQgY2F1c2VzIHRoZSBhcnJvdyB0byBubyBsb25nZXIgYmVcbiAgICAvLyBjZW50ZXJlZCwgbW9kaWZ5IHRoZSBwYWRkaW5nIHNvIHRoYXQgaXQgaXMgY2VudGVyZWQuXG4gICAgY29uc3QgbGFyZ2VzdFBvc3NpYmxlUGFkZGluZyA9IGNsaWVudFNpemUgLyAyIC0gYXJyb3dEaW1lbnNpb25zW2xlbmd0aF0gLyAyIC0gMTtcbiAgICBjb25zdCBtaW5QYWRkaW5nID0gbWluKHBhZGRpbmdPYmplY3RbbWluUHJvcF0sIGxhcmdlc3RQb3NzaWJsZVBhZGRpbmcpO1xuICAgIGNvbnN0IG1heFBhZGRpbmcgPSBtaW4ocGFkZGluZ09iamVjdFttYXhQcm9wXSwgbGFyZ2VzdFBvc3NpYmxlUGFkZGluZyk7XG5cbiAgICAvLyBNYWtlIHN1cmUgdGhlIGFycm93IGRvZXNuJ3Qgb3ZlcmZsb3cgdGhlIGZsb2F0aW5nIGVsZW1lbnQgaWYgdGhlIGNlbnRlclxuICAgIC8vIHBvaW50IGlzIG91dHNpZGUgdGhlIGZsb2F0aW5nIGVsZW1lbnQncyBib3VuZHMuXG4gICAgY29uc3QgbWluJDEgPSBtaW5QYWRkaW5nO1xuICAgIGNvbnN0IG1heCA9IGNsaWVudFNpemUgLSBhcnJvd0RpbWVuc2lvbnNbbGVuZ3RoXSAtIG1heFBhZGRpbmc7XG4gICAgY29uc3QgY2VudGVyID0gY2xpZW50U2l6ZSAvIDIgLSBhcnJvd0RpbWVuc2lvbnNbbGVuZ3RoXSAvIDIgKyBjZW50ZXJUb1JlZmVyZW5jZTtcbiAgICBjb25zdCBvZmZzZXQgPSBjbGFtcChtaW4kMSwgY2VudGVyLCBtYXgpO1xuXG4gICAgLy8gSWYgdGhlIHJlZmVyZW5jZSBpcyBzbWFsbCBlbm91Z2ggdGhhdCB0aGUgYXJyb3cncyBwYWRkaW5nIGNhdXNlcyBpdCB0b1xuICAgIC8vIHRvIHBvaW50IHRvIG5vdGhpbmcgZm9yIGFuIGFsaWduZWQgcGxhY2VtZW50LCBhZGp1c3QgdGhlIG9mZnNldCBvZiB0aGVcbiAgICAvLyBmbG9hdGluZyBlbGVtZW50IGl0c2VsZi4gVG8gZW5zdXJlIGBzaGlmdCgpYCBjb250aW51ZXMgdG8gdGFrZSBhY3Rpb24sXG4gICAgLy8gYSBzaW5nbGUgcmVzZXQgaXMgcGVyZm9ybWVkIHdoZW4gdGhpcyBpcyB0cnVlLlxuICAgIGNvbnN0IHNob3VsZEFkZE9mZnNldCA9ICFtaWRkbGV3YXJlRGF0YS5hcnJvdyAmJiBnZXRBbGlnbm1lbnQocGxhY2VtZW50KSAhPSBudWxsICYmIGNlbnRlciAhPT0gb2Zmc2V0ICYmIHJlY3RzLnJlZmVyZW5jZVtsZW5ndGhdIC8gMiAtIChjZW50ZXIgPCBtaW4kMSA/IG1pblBhZGRpbmcgOiBtYXhQYWRkaW5nKSAtIGFycm93RGltZW5zaW9uc1tsZW5ndGhdIC8gMiA8IDA7XG4gICAgY29uc3QgYWxpZ25tZW50T2Zmc2V0ID0gc2hvdWxkQWRkT2Zmc2V0ID8gY2VudGVyIDwgbWluJDEgPyBjZW50ZXIgLSBtaW4kMSA6IGNlbnRlciAtIG1heCA6IDA7XG4gICAgcmV0dXJuIHtcbiAgICAgIFtheGlzXTogY29vcmRzW2F4aXNdICsgYWxpZ25tZW50T2Zmc2V0LFxuICAgICAgZGF0YToge1xuICAgICAgICBbYXhpc106IG9mZnNldCxcbiAgICAgICAgY2VudGVyT2Zmc2V0OiBjZW50ZXIgLSBvZmZzZXQgLSBhbGlnbm1lbnRPZmZzZXQsXG4gICAgICAgIC4uLihzaG91bGRBZGRPZmZzZXQgJiYge1xuICAgICAgICAgIGFsaWdubWVudE9mZnNldFxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIHJlc2V0OiBzaG91bGRBZGRPZmZzZXRcbiAgICB9O1xuICB9XG59KTtcblxuZnVuY3Rpb24gZ2V0UGxhY2VtZW50TGlzdChhbGlnbm1lbnQsIGF1dG9BbGlnbm1lbnQsIGFsbG93ZWRQbGFjZW1lbnRzKSB7XG4gIGNvbnN0IGFsbG93ZWRQbGFjZW1lbnRzU29ydGVkQnlBbGlnbm1lbnQgPSBhbGlnbm1lbnQgPyBbLi4uYWxsb3dlZFBsYWNlbWVudHMuZmlsdGVyKHBsYWNlbWVudCA9PiBnZXRBbGlnbm1lbnQocGxhY2VtZW50KSA9PT0gYWxpZ25tZW50KSwgLi4uYWxsb3dlZFBsYWNlbWVudHMuZmlsdGVyKHBsYWNlbWVudCA9PiBnZXRBbGlnbm1lbnQocGxhY2VtZW50KSAhPT0gYWxpZ25tZW50KV0gOiBhbGxvd2VkUGxhY2VtZW50cy5maWx0ZXIocGxhY2VtZW50ID0+IGdldFNpZGUocGxhY2VtZW50KSA9PT0gcGxhY2VtZW50KTtcbiAgcmV0dXJuIGFsbG93ZWRQbGFjZW1lbnRzU29ydGVkQnlBbGlnbm1lbnQuZmlsdGVyKHBsYWNlbWVudCA9PiB7XG4gICAgaWYgKGFsaWdubWVudCkge1xuICAgICAgcmV0dXJuIGdldEFsaWdubWVudChwbGFjZW1lbnQpID09PSBhbGlnbm1lbnQgfHwgKGF1dG9BbGlnbm1lbnQgPyBnZXRPcHBvc2l0ZUFsaWdubWVudFBsYWNlbWVudChwbGFjZW1lbnQpICE9PSBwbGFjZW1lbnQgOiBmYWxzZSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cbi8qKlxuICogT3B0aW1pemVzIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBmbG9hdGluZyBlbGVtZW50IGJ5IGNob29zaW5nIHRoZSBwbGFjZW1lbnRcbiAqIHRoYXQgaGFzIHRoZSBtb3N0IHNwYWNlIGF2YWlsYWJsZSBhdXRvbWF0aWNhbGx5LCB3aXRob3V0IG5lZWRpbmcgdG8gc3BlY2lmeSBhXG4gKiBwcmVmZXJyZWQgcGxhY2VtZW50LiBBbHRlcm5hdGl2ZSB0byBgZmxpcGAuXG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3MvYXV0b1BsYWNlbWVudFxuICovXG5jb25zdCBhdXRvUGxhY2VtZW50ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdhdXRvUGxhY2VtZW50JyxcbiAgICBvcHRpb25zLFxuICAgIGFzeW5jIGZuKHN0YXRlKSB7XG4gICAgICB2YXIgX21pZGRsZXdhcmVEYXRhJGF1dG9QLCBfbWlkZGxld2FyZURhdGEkYXV0b1AyLCBfcGxhY2VtZW50c1RoYXRGaXRPbkU7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHJlY3RzLFxuICAgICAgICBtaWRkbGV3YXJlRGF0YSxcbiAgICAgICAgcGxhY2VtZW50LFxuICAgICAgICBwbGF0Zm9ybSxcbiAgICAgICAgZWxlbWVudHNcbiAgICAgIH0gPSBzdGF0ZTtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgY3Jvc3NBeGlzID0gZmFsc2UsXG4gICAgICAgIGFsaWdubWVudCxcbiAgICAgICAgYWxsb3dlZFBsYWNlbWVudHMgPSBwbGFjZW1lbnRzLFxuICAgICAgICBhdXRvQWxpZ25tZW50ID0gdHJ1ZSxcbiAgICAgICAgLi4uZGV0ZWN0T3ZlcmZsb3dPcHRpb25zXG4gICAgICB9ID0gZXZhbHVhdGUob3B0aW9ucywgc3RhdGUpO1xuICAgICAgY29uc3QgcGxhY2VtZW50cyQxID0gYWxpZ25tZW50ICE9PSB1bmRlZmluZWQgfHwgYWxsb3dlZFBsYWNlbWVudHMgPT09IHBsYWNlbWVudHMgPyBnZXRQbGFjZW1lbnRMaXN0KGFsaWdubWVudCB8fCBudWxsLCBhdXRvQWxpZ25tZW50LCBhbGxvd2VkUGxhY2VtZW50cykgOiBhbGxvd2VkUGxhY2VtZW50cztcbiAgICAgIGNvbnN0IG92ZXJmbG93ID0gYXdhaXQgZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIGRldGVjdE92ZXJmbG93T3B0aW9ucyk7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSAoKF9taWRkbGV3YXJlRGF0YSRhdXRvUCA9IG1pZGRsZXdhcmVEYXRhLmF1dG9QbGFjZW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfbWlkZGxld2FyZURhdGEkYXV0b1AuaW5kZXgpIHx8IDA7XG4gICAgICBjb25zdCBjdXJyZW50UGxhY2VtZW50ID0gcGxhY2VtZW50cyQxW2N1cnJlbnRJbmRleF07XG4gICAgICBpZiAoY3VycmVudFBsYWNlbWVudCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFsaWdubWVudFNpZGVzID0gZ2V0QWxpZ25tZW50U2lkZXMoY3VycmVudFBsYWNlbWVudCwgcmVjdHMsIGF3YWl0IChwbGF0Zm9ybS5pc1JUTCA9PSBudWxsID8gdm9pZCAwIDogcGxhdGZvcm0uaXNSVEwoZWxlbWVudHMuZmxvYXRpbmcpKSk7XG5cbiAgICAgIC8vIE1ha2UgYGNvbXB1dGVDb29yZHNgIHN0YXJ0IGZyb20gdGhlIHJpZ2h0IHBsYWNlLlxuICAgICAgaWYgKHBsYWNlbWVudCAhPT0gY3VycmVudFBsYWNlbWVudCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlc2V0OiB7XG4gICAgICAgICAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudHMkMVswXVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGN1cnJlbnRPdmVyZmxvd3MgPSBbb3ZlcmZsb3dbZ2V0U2lkZShjdXJyZW50UGxhY2VtZW50KV0sIG92ZXJmbG93W2FsaWdubWVudFNpZGVzWzBdXSwgb3ZlcmZsb3dbYWxpZ25tZW50U2lkZXNbMV1dXTtcbiAgICAgIGNvbnN0IGFsbE92ZXJmbG93cyA9IFsuLi4oKChfbWlkZGxld2FyZURhdGEkYXV0b1AyID0gbWlkZGxld2FyZURhdGEuYXV0b1BsYWNlbWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9taWRkbGV3YXJlRGF0YSRhdXRvUDIub3ZlcmZsb3dzKSB8fCBbXSksIHtcbiAgICAgICAgcGxhY2VtZW50OiBjdXJyZW50UGxhY2VtZW50LFxuICAgICAgICBvdmVyZmxvd3M6IGN1cnJlbnRPdmVyZmxvd3NcbiAgICAgIH1dO1xuICAgICAgY29uc3QgbmV4dFBsYWNlbWVudCA9IHBsYWNlbWVudHMkMVtjdXJyZW50SW5kZXggKyAxXTtcblxuICAgICAgLy8gVGhlcmUgYXJlIG1vcmUgcGxhY2VtZW50cyB0byBjaGVjay5cbiAgICAgIGlmIChuZXh0UGxhY2VtZW50KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaW5kZXg6IGN1cnJlbnRJbmRleCArIDEsXG4gICAgICAgICAgICBvdmVyZmxvd3M6IGFsbE92ZXJmbG93c1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXQ6IHtcbiAgICAgICAgICAgIHBsYWNlbWVudDogbmV4dFBsYWNlbWVudFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBsYWNlbWVudHNTb3J0ZWRCeU1vc3RTcGFjZSA9IGFsbE92ZXJmbG93cy5tYXAoZCA9PiB7XG4gICAgICAgIGNvbnN0IGFsaWdubWVudCA9IGdldEFsaWdubWVudChkLnBsYWNlbWVudCk7XG4gICAgICAgIHJldHVybiBbZC5wbGFjZW1lbnQsIGFsaWdubWVudCAmJiBjcm9zc0F4aXMgP1xuICAgICAgICAvLyBDaGVjayBhbG9uZyB0aGUgbWFpbkF4aXMgYW5kIG1haW4gY3Jvc3NBeGlzIHNpZGUuXG4gICAgICAgIGQub3ZlcmZsb3dzLnNsaWNlKDAsIDIpLnJlZHVjZSgoYWNjLCB2KSA9PiBhY2MgKyB2LCAwKSA6XG4gICAgICAgIC8vIENoZWNrIG9ubHkgdGhlIG1haW5BeGlzLlxuICAgICAgICBkLm92ZXJmbG93c1swXSwgZC5vdmVyZmxvd3NdO1xuICAgICAgfSkuc29ydCgoYSwgYikgPT4gYVsxXSAtIGJbMV0pO1xuICAgICAgY29uc3QgcGxhY2VtZW50c1RoYXRGaXRPbkVhY2hTaWRlID0gcGxhY2VtZW50c1NvcnRlZEJ5TW9zdFNwYWNlLmZpbHRlcihkID0+IGRbMl0uc2xpY2UoMCxcbiAgICAgIC8vIEFsaWduZWQgcGxhY2VtZW50cyBzaG91bGQgbm90IGNoZWNrIHRoZWlyIG9wcG9zaXRlIGNyb3NzQXhpc1xuICAgICAgLy8gc2lkZS5cbiAgICAgIGdldEFsaWdubWVudChkWzBdKSA/IDIgOiAzKS5ldmVyeSh2ID0+IHYgPD0gMCkpO1xuICAgICAgY29uc3QgcmVzZXRQbGFjZW1lbnQgPSAoKF9wbGFjZW1lbnRzVGhhdEZpdE9uRSA9IHBsYWNlbWVudHNUaGF0Rml0T25FYWNoU2lkZVswXSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9wbGFjZW1lbnRzVGhhdEZpdE9uRVswXSkgfHwgcGxhY2VtZW50c1NvcnRlZEJ5TW9zdFNwYWNlWzBdWzBdO1xuICAgICAgaWYgKHJlc2V0UGxhY2VtZW50ICE9PSBwbGFjZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpbmRleDogY3VycmVudEluZGV4ICsgMSxcbiAgICAgICAgICAgIG92ZXJmbG93czogYWxsT3ZlcmZsb3dzXG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNldDoge1xuICAgICAgICAgICAgcGxhY2VtZW50OiByZXNldFBsYWNlbWVudFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG59O1xuXG4vKipcbiAqIE9wdGltaXplcyB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgZmxvYXRpbmcgZWxlbWVudCBieSBmbGlwcGluZyB0aGUgYHBsYWNlbWVudGBcbiAqIGluIG9yZGVyIHRvIGtlZXAgaXQgaW4gdmlldyB3aGVuIHRoZSBwcmVmZXJyZWQgcGxhY2VtZW50KHMpIHdpbGwgb3ZlcmZsb3cgdGhlXG4gKiBjbGlwcGluZyBib3VuZGFyeS4gQWx0ZXJuYXRpdmUgdG8gYGF1dG9QbGFjZW1lbnRgLlxuICogQHNlZSBodHRwczovL2Zsb2F0aW5nLXVpLmNvbS9kb2NzL2ZsaXBcbiAqL1xuY29uc3QgZmxpcCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnZmxpcCcsXG4gICAgb3B0aW9ucyxcbiAgICBhc3luYyBmbihzdGF0ZSkge1xuICAgICAgdmFyIF9taWRkbGV3YXJlRGF0YSRhcnJvdywgX21pZGRsZXdhcmVEYXRhJGZsaXA7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHBsYWNlbWVudCxcbiAgICAgICAgbWlkZGxld2FyZURhdGEsXG4gICAgICAgIHJlY3RzLFxuICAgICAgICBpbml0aWFsUGxhY2VtZW50LFxuICAgICAgICBwbGF0Zm9ybSxcbiAgICAgICAgZWxlbWVudHNcbiAgICAgIH0gPSBzdGF0ZTtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgbWFpbkF4aXM6IGNoZWNrTWFpbkF4aXMgPSB0cnVlLFxuICAgICAgICBjcm9zc0F4aXM6IGNoZWNrQ3Jvc3NBeGlzID0gdHJ1ZSxcbiAgICAgICAgZmFsbGJhY2tQbGFjZW1lbnRzOiBzcGVjaWZpZWRGYWxsYmFja1BsYWNlbWVudHMsXG4gICAgICAgIGZhbGxiYWNrU3RyYXRlZ3kgPSAnYmVzdEZpdCcsXG4gICAgICAgIGZhbGxiYWNrQXhpc1NpZGVEaXJlY3Rpb24gPSAnbm9uZScsXG4gICAgICAgIGZsaXBBbGlnbm1lbnQgPSB0cnVlLFxuICAgICAgICAuLi5kZXRlY3RPdmVyZmxvd09wdGlvbnNcbiAgICAgIH0gPSBldmFsdWF0ZShvcHRpb25zLCBzdGF0ZSk7XG5cbiAgICAgIC8vIElmIGEgcmVzZXQgYnkgdGhlIGFycm93IHdhcyBjYXVzZWQgZHVlIHRvIGFuIGFsaWdubWVudCBvZmZzZXQgYmVpbmdcbiAgICAgIC8vIGFkZGVkLCB3ZSBzaG91bGQgc2tpcCBhbnkgbG9naWMgbm93IHNpbmNlIGBmbGlwKClgIGhhcyBhbHJlYWR5IGRvbmUgaXRzXG4gICAgICAvLyB3b3JrLlxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2Zsb2F0aW5nLXVpL2Zsb2F0aW5nLXVpL2lzc3Vlcy8yNTQ5I2lzc3VlY29tbWVudC0xNzE5NjAxNjQzXG4gICAgICBpZiAoKF9taWRkbGV3YXJlRGF0YSRhcnJvdyA9IG1pZGRsZXdhcmVEYXRhLmFycm93KSAhPSBudWxsICYmIF9taWRkbGV3YXJlRGF0YSRhcnJvdy5hbGlnbm1lbnRPZmZzZXQpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuICAgICAgY29uc3Qgc2lkZSA9IGdldFNpZGUocGxhY2VtZW50KTtcbiAgICAgIGNvbnN0IGluaXRpYWxTaWRlQXhpcyA9IGdldFNpZGVBeGlzKGluaXRpYWxQbGFjZW1lbnQpO1xuICAgICAgY29uc3QgaXNCYXNlUGxhY2VtZW50ID0gZ2V0U2lkZShpbml0aWFsUGxhY2VtZW50KSA9PT0gaW5pdGlhbFBsYWNlbWVudDtcbiAgICAgIGNvbnN0IHJ0bCA9IGF3YWl0IChwbGF0Zm9ybS5pc1JUTCA9PSBudWxsID8gdm9pZCAwIDogcGxhdGZvcm0uaXNSVEwoZWxlbWVudHMuZmxvYXRpbmcpKTtcbiAgICAgIGNvbnN0IGZhbGxiYWNrUGxhY2VtZW50cyA9IHNwZWNpZmllZEZhbGxiYWNrUGxhY2VtZW50cyB8fCAoaXNCYXNlUGxhY2VtZW50IHx8ICFmbGlwQWxpZ25tZW50ID8gW2dldE9wcG9zaXRlUGxhY2VtZW50KGluaXRpYWxQbGFjZW1lbnQpXSA6IGdldEV4cGFuZGVkUGxhY2VtZW50cyhpbml0aWFsUGxhY2VtZW50KSk7XG4gICAgICBjb25zdCBoYXNGYWxsYmFja0F4aXNTaWRlRGlyZWN0aW9uID0gZmFsbGJhY2tBeGlzU2lkZURpcmVjdGlvbiAhPT0gJ25vbmUnO1xuICAgICAgaWYgKCFzcGVjaWZpZWRGYWxsYmFja1BsYWNlbWVudHMgJiYgaGFzRmFsbGJhY2tBeGlzU2lkZURpcmVjdGlvbikge1xuICAgICAgICBmYWxsYmFja1BsYWNlbWVudHMucHVzaCguLi5nZXRPcHBvc2l0ZUF4aXNQbGFjZW1lbnRzKGluaXRpYWxQbGFjZW1lbnQsIGZsaXBBbGlnbm1lbnQsIGZhbGxiYWNrQXhpc1NpZGVEaXJlY3Rpb24sIHJ0bCkpO1xuICAgICAgfVxuICAgICAgY29uc3QgcGxhY2VtZW50cyA9IFtpbml0aWFsUGxhY2VtZW50LCAuLi5mYWxsYmFja1BsYWNlbWVudHNdO1xuICAgICAgY29uc3Qgb3ZlcmZsb3cgPSBhd2FpdCBkZXRlY3RPdmVyZmxvdyhzdGF0ZSwgZGV0ZWN0T3ZlcmZsb3dPcHRpb25zKTtcbiAgICAgIGNvbnN0IG92ZXJmbG93cyA9IFtdO1xuICAgICAgbGV0IG92ZXJmbG93c0RhdGEgPSAoKF9taWRkbGV3YXJlRGF0YSRmbGlwID0gbWlkZGxld2FyZURhdGEuZmxpcCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9taWRkbGV3YXJlRGF0YSRmbGlwLm92ZXJmbG93cykgfHwgW107XG4gICAgICBpZiAoY2hlY2tNYWluQXhpcykge1xuICAgICAgICBvdmVyZmxvd3MucHVzaChvdmVyZmxvd1tzaWRlXSk7XG4gICAgICB9XG4gICAgICBpZiAoY2hlY2tDcm9zc0F4aXMpIHtcbiAgICAgICAgY29uc3Qgc2lkZXMgPSBnZXRBbGlnbm1lbnRTaWRlcyhwbGFjZW1lbnQsIHJlY3RzLCBydGwpO1xuICAgICAgICBvdmVyZmxvd3MucHVzaChvdmVyZmxvd1tzaWRlc1swXV0sIG92ZXJmbG93W3NpZGVzWzFdXSk7XG4gICAgICB9XG4gICAgICBvdmVyZmxvd3NEYXRhID0gWy4uLm92ZXJmbG93c0RhdGEsIHtcbiAgICAgICAgcGxhY2VtZW50LFxuICAgICAgICBvdmVyZmxvd3NcbiAgICAgIH1dO1xuXG4gICAgICAvLyBPbmUgb3IgbW9yZSBzaWRlcyBpcyBvdmVyZmxvd2luZy5cbiAgICAgIGlmICghb3ZlcmZsb3dzLmV2ZXJ5KHNpZGUgPT4gc2lkZSA8PSAwKSkge1xuICAgICAgICB2YXIgX21pZGRsZXdhcmVEYXRhJGZsaXAyLCBfb3ZlcmZsb3dzRGF0YSRmaWx0ZXI7XG4gICAgICAgIGNvbnN0IG5leHRJbmRleCA9ICgoKF9taWRkbGV3YXJlRGF0YSRmbGlwMiA9IG1pZGRsZXdhcmVEYXRhLmZsaXApID09IG51bGwgPyB2b2lkIDAgOiBfbWlkZGxld2FyZURhdGEkZmxpcDIuaW5kZXgpIHx8IDApICsgMTtcbiAgICAgICAgY29uc3QgbmV4dFBsYWNlbWVudCA9IHBsYWNlbWVudHNbbmV4dEluZGV4XTtcbiAgICAgICAgaWYgKG5leHRQbGFjZW1lbnQpIHtcbiAgICAgICAgICBjb25zdCBpZ25vcmVDcm9zc0F4aXNPdmVyZmxvdyA9IGNoZWNrQ3Jvc3NBeGlzID09PSAnYWxpZ25tZW50JyA/IGluaXRpYWxTaWRlQXhpcyAhPT0gZ2V0U2lkZUF4aXMobmV4dFBsYWNlbWVudCkgOiBmYWxzZTtcbiAgICAgICAgICBpZiAoIWlnbm9yZUNyb3NzQXhpc092ZXJmbG93IHx8XG4gICAgICAgICAgLy8gV2UgbGVhdmUgdGhlIGN1cnJlbnQgbWFpbiBheGlzIG9ubHkgaWYgZXZlcnkgcGxhY2VtZW50IG9uIHRoYXQgYXhpc1xuICAgICAgICAgIC8vIG92ZXJmbG93cyB0aGUgbWFpbiBheGlzLlxuICAgICAgICAgIG92ZXJmbG93c0RhdGEuZXZlcnkoZCA9PiBkLm92ZXJmbG93c1swXSA+IDAgJiYgZ2V0U2lkZUF4aXMoZC5wbGFjZW1lbnQpID09PSBpbml0aWFsU2lkZUF4aXMpKSB7XG4gICAgICAgICAgICAvLyBUcnkgbmV4dCBwbGFjZW1lbnQgYW5kIHJlLXJ1biB0aGUgbGlmZWN5Y2xlLlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGluZGV4OiBuZXh0SW5kZXgsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3dzOiBvdmVyZmxvd3NEYXRhXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlc2V0OiB7XG4gICAgICAgICAgICAgICAgcGxhY2VtZW50OiBuZXh0UGxhY2VtZW50XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmlyc3QsIGZpbmQgdGhlIGNhbmRpZGF0ZXMgdGhhdCBmaXQgb24gdGhlIG1haW5BeGlzIHNpZGUgb2Ygb3ZlcmZsb3csXG4gICAgICAgIC8vIHRoZW4gZmluZCB0aGUgcGxhY2VtZW50IHRoYXQgZml0cyB0aGUgYmVzdCBvbiB0aGUgbWFpbiBjcm9zc0F4aXMgc2lkZS5cbiAgICAgICAgbGV0IHJlc2V0UGxhY2VtZW50ID0gKF9vdmVyZmxvd3NEYXRhJGZpbHRlciA9IG92ZXJmbG93c0RhdGEuZmlsdGVyKGQgPT4gZC5vdmVyZmxvd3NbMF0gPD0gMCkuc29ydCgoYSwgYikgPT4gYS5vdmVyZmxvd3NbMV0gLSBiLm92ZXJmbG93c1sxXSlbMF0pID09IG51bGwgPyB2b2lkIDAgOiBfb3ZlcmZsb3dzRGF0YSRmaWx0ZXIucGxhY2VtZW50O1xuXG4gICAgICAgIC8vIE90aGVyd2lzZSBmYWxsYmFjay5cbiAgICAgICAgaWYgKCFyZXNldFBsYWNlbWVudCkge1xuICAgICAgICAgIHN3aXRjaCAoZmFsbGJhY2tTdHJhdGVneSkge1xuICAgICAgICAgICAgY2FzZSAnYmVzdEZpdCc6XG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgX292ZXJmbG93c0RhdGEkZmlsdGVyMjtcbiAgICAgICAgICAgICAgICBjb25zdCBwbGFjZW1lbnQgPSAoX292ZXJmbG93c0RhdGEkZmlsdGVyMiA9IG92ZXJmbG93c0RhdGEuZmlsdGVyKGQgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGhhc0ZhbGxiYWNrQXhpc1NpZGVEaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNpZGVBeGlzID0gZ2V0U2lkZUF4aXMoZC5wbGFjZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudFNpZGVBeGlzID09PSBpbml0aWFsU2lkZUF4aXMgfHxcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgYmlhcyB0byB0aGUgYHlgIHNpZGUgYXhpcyBkdWUgdG8gaG9yaXpvbnRhbFxuICAgICAgICAgICAgICAgICAgICAvLyByZWFkaW5nIGRpcmVjdGlvbnMgZmF2b3JpbmcgZ3JlYXRlciB3aWR0aC5cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFNpZGVBeGlzID09PSAneSc7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KS5tYXAoZCA9PiBbZC5wbGFjZW1lbnQsIGQub3ZlcmZsb3dzLmZpbHRlcihvdmVyZmxvdyA9PiBvdmVyZmxvdyA+IDApLnJlZHVjZSgoYWNjLCBvdmVyZmxvdykgPT4gYWNjICsgb3ZlcmZsb3csIDApXSkuc29ydCgoYSwgYikgPT4gYVsxXSAtIGJbMV0pWzBdKSA9PSBudWxsID8gdm9pZCAwIDogX292ZXJmbG93c0RhdGEkZmlsdGVyMlswXTtcbiAgICAgICAgICAgICAgICBpZiAocGxhY2VtZW50KSB7XG4gICAgICAgICAgICAgICAgICByZXNldFBsYWNlbWVudCA9IHBsYWNlbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ2luaXRpYWxQbGFjZW1lbnQnOlxuICAgICAgICAgICAgICByZXNldFBsYWNlbWVudCA9IGluaXRpYWxQbGFjZW1lbnQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocGxhY2VtZW50ICE9PSByZXNldFBsYWNlbWVudCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXNldDoge1xuICAgICAgICAgICAgICBwbGFjZW1lbnQ6IHJlc2V0UGxhY2VtZW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbn07XG5cbmZ1bmN0aW9uIGdldFNpZGVPZmZzZXRzKG92ZXJmbG93LCByZWN0KSB7XG4gIHJldHVybiB7XG4gICAgdG9wOiBvdmVyZmxvdy50b3AgLSByZWN0LmhlaWdodCxcbiAgICByaWdodDogb3ZlcmZsb3cucmlnaHQgLSByZWN0LndpZHRoLFxuICAgIGJvdHRvbTogb3ZlcmZsb3cuYm90dG9tIC0gcmVjdC5oZWlnaHQsXG4gICAgbGVmdDogb3ZlcmZsb3cubGVmdCAtIHJlY3Qud2lkdGhcbiAgfTtcbn1cbmZ1bmN0aW9uIGlzQW55U2lkZUZ1bGx5Q2xpcHBlZChvdmVyZmxvdykge1xuICByZXR1cm4gc2lkZXMuc29tZShzaWRlID0+IG92ZXJmbG93W3NpZGVdID49IDApO1xufVxuLyoqXG4gKiBQcm92aWRlcyBkYXRhIHRvIGhpZGUgdGhlIGZsb2F0aW5nIGVsZW1lbnQgaW4gYXBwbGljYWJsZSBzaXR1YXRpb25zLCBzdWNoIGFzXG4gKiB3aGVuIGl0IGlzIG5vdCBpbiB0aGUgc2FtZSBjbGlwcGluZyBjb250ZXh0IGFzIHRoZSByZWZlcmVuY2UgZWxlbWVudC5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy9oaWRlXG4gKi9cbmNvbnN0IGhpZGUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2hpZGUnLFxuICAgIG9wdGlvbnMsXG4gICAgYXN5bmMgZm4oc3RhdGUpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgcmVjdHNcbiAgICAgIH0gPSBzdGF0ZTtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgc3RyYXRlZ3kgPSAncmVmZXJlbmNlSGlkZGVuJyxcbiAgICAgICAgLi4uZGV0ZWN0T3ZlcmZsb3dPcHRpb25zXG4gICAgICB9ID0gZXZhbHVhdGUob3B0aW9ucywgc3RhdGUpO1xuICAgICAgc3dpdGNoIChzdHJhdGVneSkge1xuICAgICAgICBjYXNlICdyZWZlcmVuY2VIaWRkZW4nOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IG92ZXJmbG93ID0gYXdhaXQgZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICAgICAgICAgICAgLi4uZGV0ZWN0T3ZlcmZsb3dPcHRpb25zLFxuICAgICAgICAgICAgICBlbGVtZW50Q29udGV4dDogJ3JlZmVyZW5jZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0cyA9IGdldFNpZGVPZmZzZXRzKG92ZXJmbG93LCByZWN0cy5yZWZlcmVuY2UpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHJlZmVyZW5jZUhpZGRlbk9mZnNldHM6IG9mZnNldHMsXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlSGlkZGVuOiBpc0FueVNpZGVGdWxseUNsaXBwZWQob2Zmc2V0cylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2VzY2FwZWQnOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IG92ZXJmbG93ID0gYXdhaXQgZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIHtcbiAgICAgICAgICAgICAgLi4uZGV0ZWN0T3ZlcmZsb3dPcHRpb25zLFxuICAgICAgICAgICAgICBhbHRCb3VuZGFyeTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBvZmZzZXRzID0gZ2V0U2lkZU9mZnNldHMob3ZlcmZsb3csIHJlY3RzLmZsb2F0aW5nKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBlc2NhcGVkT2Zmc2V0czogb2Zmc2V0cyxcbiAgICAgICAgICAgICAgICBlc2NhcGVkOiBpc0FueVNpZGVGdWxseUNsaXBwZWQob2Zmc2V0cylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59O1xuXG5mdW5jdGlvbiBnZXRCb3VuZGluZ1JlY3QocmVjdHMpIHtcbiAgY29uc3QgbWluWCA9IG1pbiguLi5yZWN0cy5tYXAocmVjdCA9PiByZWN0LmxlZnQpKTtcbiAgY29uc3QgbWluWSA9IG1pbiguLi5yZWN0cy5tYXAocmVjdCA9PiByZWN0LnRvcCkpO1xuICBjb25zdCBtYXhYID0gbWF4KC4uLnJlY3RzLm1hcChyZWN0ID0+IHJlY3QucmlnaHQpKTtcbiAgY29uc3QgbWF4WSA9IG1heCguLi5yZWN0cy5tYXAocmVjdCA9PiByZWN0LmJvdHRvbSkpO1xuICByZXR1cm4ge1xuICAgIHg6IG1pblgsXG4gICAgeTogbWluWSxcbiAgICB3aWR0aDogbWF4WCAtIG1pblgsXG4gICAgaGVpZ2h0OiBtYXhZIC0gbWluWVxuICB9O1xufVxuZnVuY3Rpb24gZ2V0UmVjdHNCeUxpbmUocmVjdHMpIHtcbiAgY29uc3Qgc29ydGVkUmVjdHMgPSByZWN0cy5zbGljZSgpLnNvcnQoKGEsIGIpID0+IGEueSAtIGIueSk7XG4gIGNvbnN0IGdyb3VwcyA9IFtdO1xuICBsZXQgcHJldlJlY3QgPSBudWxsO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNvcnRlZFJlY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcmVjdCA9IHNvcnRlZFJlY3RzW2ldO1xuICAgIGlmICghcHJldlJlY3QgfHwgcmVjdC55IC0gcHJldlJlY3QueSA+IHByZXZSZWN0LmhlaWdodCAvIDIpIHtcbiAgICAgIGdyb3Vwcy5wdXNoKFtyZWN0XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdyb3Vwc1tncm91cHMubGVuZ3RoIC0gMV0ucHVzaChyZWN0KTtcbiAgICB9XG4gICAgcHJldlJlY3QgPSByZWN0O1xuICB9XG4gIHJldHVybiBncm91cHMubWFwKHJlY3QgPT4gcmVjdFRvQ2xpZW50UmVjdChnZXRCb3VuZGluZ1JlY3QocmVjdCkpKTtcbn1cbi8qKlxuICogUHJvdmlkZXMgaW1wcm92ZWQgcG9zaXRpb25pbmcgZm9yIGlubGluZSByZWZlcmVuY2UgZWxlbWVudHMgdGhhdCBjYW4gc3BhblxuICogb3ZlciBtdWx0aXBsZSBsaW5lcywgc3VjaCBhcyBoeXBlcmxpbmtzIG9yIHJhbmdlIHNlbGVjdGlvbnMuXG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3MvaW5saW5lXG4gKi9cbmNvbnN0IGlubGluZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnaW5saW5lJyxcbiAgICBvcHRpb25zLFxuICAgIGFzeW5jIGZuKHN0YXRlKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHBsYWNlbWVudCxcbiAgICAgICAgZWxlbWVudHMsXG4gICAgICAgIHJlY3RzLFxuICAgICAgICBwbGF0Zm9ybSxcbiAgICAgICAgc3RyYXRlZ3lcbiAgICAgIH0gPSBzdGF0ZTtcbiAgICAgIC8vIEEgTW91c2VFdmVudCdzIGNsaWVudHtYLFl9IGNvb3JkcyBjYW4gYmUgdXAgdG8gMiBwaXhlbHMgb2ZmIGFcbiAgICAgIC8vIENsaWVudFJlY3QncyBib3VuZHMsIGRlc3BpdGUgdGhlIGV2ZW50IGxpc3RlbmVyIGJlaW5nIHRyaWdnZXJlZC4gQVxuICAgICAgLy8gcGFkZGluZyBvZiAyIHNlZW1zIHRvIGhhbmRsZSB0aGlzIGlzc3VlLlxuICAgICAgY29uc3Qge1xuICAgICAgICBwYWRkaW5nID0gMixcbiAgICAgICAgeCxcbiAgICAgICAgeVxuICAgICAgfSA9IGV2YWx1YXRlKG9wdGlvbnMsIHN0YXRlKTtcbiAgICAgIGNvbnN0IG5hdGl2ZUNsaWVudFJlY3RzID0gQXJyYXkuZnJvbSgoYXdhaXQgKHBsYXRmb3JtLmdldENsaWVudFJlY3RzID09IG51bGwgPyB2b2lkIDAgOiBwbGF0Zm9ybS5nZXRDbGllbnRSZWN0cyhlbGVtZW50cy5yZWZlcmVuY2UpKSkgfHwgW10pO1xuICAgICAgY29uc3QgY2xpZW50UmVjdHMgPSBnZXRSZWN0c0J5TGluZShuYXRpdmVDbGllbnRSZWN0cyk7XG4gICAgICBjb25zdCBmYWxsYmFjayA9IHJlY3RUb0NsaWVudFJlY3QoZ2V0Qm91bmRpbmdSZWN0KG5hdGl2ZUNsaWVudFJlY3RzKSk7XG4gICAgICBjb25zdCBwYWRkaW5nT2JqZWN0ID0gZ2V0UGFkZGluZ09iamVjdChwYWRkaW5nKTtcbiAgICAgIGZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHtcbiAgICAgICAgLy8gVGhlcmUgYXJlIHR3byByZWN0cyBhbmQgdGhleSBhcmUgZGlzam9pbmVkLlxuICAgICAgICBpZiAoY2xpZW50UmVjdHMubGVuZ3RoID09PSAyICYmIGNsaWVudFJlY3RzWzBdLmxlZnQgPiBjbGllbnRSZWN0c1sxXS5yaWdodCAmJiB4ICE9IG51bGwgJiYgeSAhPSBudWxsKSB7XG4gICAgICAgICAgLy8gRmluZCB0aGUgZmlyc3QgcmVjdCBpbiB3aGljaCB0aGUgcG9pbnQgaXMgZnVsbHkgaW5zaWRlLlxuICAgICAgICAgIHJldHVybiBjbGllbnRSZWN0cy5maW5kKHJlY3QgPT4geCA+IHJlY3QubGVmdCAtIHBhZGRpbmdPYmplY3QubGVmdCAmJiB4IDwgcmVjdC5yaWdodCArIHBhZGRpbmdPYmplY3QucmlnaHQgJiYgeSA+IHJlY3QudG9wIC0gcGFkZGluZ09iamVjdC50b3AgJiYgeSA8IHJlY3QuYm90dG9tICsgcGFkZGluZ09iamVjdC5ib3R0b20pIHx8IGZhbGxiYWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlcmUgYXJlIDIgb3IgbW9yZSBjb25uZWN0ZWQgcmVjdHMuXG4gICAgICAgIGlmIChjbGllbnRSZWN0cy5sZW5ndGggPj0gMikge1xuICAgICAgICAgIGlmIChnZXRTaWRlQXhpcyhwbGFjZW1lbnQpID09PSAneScpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0UmVjdCA9IGNsaWVudFJlY3RzWzBdO1xuICAgICAgICAgICAgY29uc3QgbGFzdFJlY3QgPSBjbGllbnRSZWN0c1tjbGllbnRSZWN0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGNvbnN0IGlzVG9wID0gZ2V0U2lkZShwbGFjZW1lbnQpID09PSAndG9wJztcbiAgICAgICAgICAgIGNvbnN0IHRvcCA9IGZpcnN0UmVjdC50b3A7XG4gICAgICAgICAgICBjb25zdCBib3R0b20gPSBsYXN0UmVjdC5ib3R0b207XG4gICAgICAgICAgICBjb25zdCBsZWZ0ID0gaXNUb3AgPyBmaXJzdFJlY3QubGVmdCA6IGxhc3RSZWN0LmxlZnQ7XG4gICAgICAgICAgICBjb25zdCByaWdodCA9IGlzVG9wID8gZmlyc3RSZWN0LnJpZ2h0IDogbGFzdFJlY3QucmlnaHQ7XG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IHJpZ2h0IC0gbGVmdDtcbiAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IGJvdHRvbSAtIHRvcDtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHRvcCxcbiAgICAgICAgICAgICAgYm90dG9tLFxuICAgICAgICAgICAgICBsZWZ0LFxuICAgICAgICAgICAgICByaWdodCxcbiAgICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICAgICAgeDogbGVmdCxcbiAgICAgICAgICAgICAgeTogdG9wXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBpc0xlZnRTaWRlID0gZ2V0U2lkZShwbGFjZW1lbnQpID09PSAnbGVmdCc7XG4gICAgICAgICAgY29uc3QgbWF4UmlnaHQgPSBtYXgoLi4uY2xpZW50UmVjdHMubWFwKHJlY3QgPT4gcmVjdC5yaWdodCkpO1xuICAgICAgICAgIGNvbnN0IG1pbkxlZnQgPSBtaW4oLi4uY2xpZW50UmVjdHMubWFwKHJlY3QgPT4gcmVjdC5sZWZ0KSk7XG4gICAgICAgICAgY29uc3QgbWVhc3VyZVJlY3RzID0gY2xpZW50UmVjdHMuZmlsdGVyKHJlY3QgPT4gaXNMZWZ0U2lkZSA/IHJlY3QubGVmdCA9PT0gbWluTGVmdCA6IHJlY3QucmlnaHQgPT09IG1heFJpZ2h0KTtcbiAgICAgICAgICBjb25zdCB0b3AgPSBtZWFzdXJlUmVjdHNbMF0udG9wO1xuICAgICAgICAgIGNvbnN0IGJvdHRvbSA9IG1lYXN1cmVSZWN0c1ttZWFzdXJlUmVjdHMubGVuZ3RoIC0gMV0uYm90dG9tO1xuICAgICAgICAgIGNvbnN0IGxlZnQgPSBtaW5MZWZ0O1xuICAgICAgICAgIGNvbnN0IHJpZ2h0ID0gbWF4UmlnaHQ7XG4gICAgICAgICAgY29uc3Qgd2lkdGggPSByaWdodCAtIGxlZnQ7XG4gICAgICAgICAgY29uc3QgaGVpZ2h0ID0gYm90dG9tIC0gdG9wO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3AsXG4gICAgICAgICAgICBib3R0b20sXG4gICAgICAgICAgICBsZWZ0LFxuICAgICAgICAgICAgcmlnaHQsXG4gICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICAgIHg6IGxlZnQsXG4gICAgICAgICAgICB5OiB0b3BcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxsYmFjaztcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlc2V0UmVjdHMgPSBhd2FpdCBwbGF0Zm9ybS5nZXRFbGVtZW50UmVjdHMoe1xuICAgICAgICByZWZlcmVuY2U6IHtcbiAgICAgICAgICBnZXRCb3VuZGluZ0NsaWVudFJlY3RcbiAgICAgICAgfSxcbiAgICAgICAgZmxvYXRpbmc6IGVsZW1lbnRzLmZsb2F0aW5nLFxuICAgICAgICBzdHJhdGVneVxuICAgICAgfSk7XG4gICAgICBpZiAocmVjdHMucmVmZXJlbmNlLnggIT09IHJlc2V0UmVjdHMucmVmZXJlbmNlLnggfHwgcmVjdHMucmVmZXJlbmNlLnkgIT09IHJlc2V0UmVjdHMucmVmZXJlbmNlLnkgfHwgcmVjdHMucmVmZXJlbmNlLndpZHRoICE9PSByZXNldFJlY3RzLnJlZmVyZW5jZS53aWR0aCB8fCByZWN0cy5yZWZlcmVuY2UuaGVpZ2h0ICE9PSByZXNldFJlY3RzLnJlZmVyZW5jZS5oZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZXNldDoge1xuICAgICAgICAgICAgcmVjdHM6IHJlc2V0UmVjdHNcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xufTtcblxuLy8gRm9yIHR5cGUgYmFja3dhcmRzLWNvbXBhdGliaWxpdHksIHRoZSBgT2Zmc2V0T3B0aW9uc2AgdHlwZSB3YXMgYWxzb1xuLy8gRGVyaXZhYmxlLlxuXG5hc3luYyBmdW5jdGlvbiBjb252ZXJ0VmFsdWVUb0Nvb3JkcyhzdGF0ZSwgb3B0aW9ucykge1xuICBjb25zdCB7XG4gICAgcGxhY2VtZW50LFxuICAgIHBsYXRmb3JtLFxuICAgIGVsZW1lbnRzXG4gIH0gPSBzdGF0ZTtcbiAgY29uc3QgcnRsID0gYXdhaXQgKHBsYXRmb3JtLmlzUlRMID09IG51bGwgPyB2b2lkIDAgOiBwbGF0Zm9ybS5pc1JUTChlbGVtZW50cy5mbG9hdGluZykpO1xuICBjb25zdCBzaWRlID0gZ2V0U2lkZShwbGFjZW1lbnQpO1xuICBjb25zdCBhbGlnbm1lbnQgPSBnZXRBbGlnbm1lbnQocGxhY2VtZW50KTtcbiAgY29uc3QgaXNWZXJ0aWNhbCA9IGdldFNpZGVBeGlzKHBsYWNlbWVudCkgPT09ICd5JztcbiAgY29uc3QgbWFpbkF4aXNNdWx0aSA9IFsnbGVmdCcsICd0b3AnXS5pbmNsdWRlcyhzaWRlKSA/IC0xIDogMTtcbiAgY29uc3QgY3Jvc3NBeGlzTXVsdGkgPSBydGwgJiYgaXNWZXJ0aWNhbCA/IC0xIDogMTtcbiAgY29uc3QgcmF3VmFsdWUgPSBldmFsdWF0ZShvcHRpb25zLCBzdGF0ZSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdFxuICBsZXQge1xuICAgIG1haW5BeGlzLFxuICAgIGNyb3NzQXhpcyxcbiAgICBhbGlnbm1lbnRBeGlzXG4gIH0gPSB0eXBlb2YgcmF3VmFsdWUgPT09ICdudW1iZXInID8ge1xuICAgIG1haW5BeGlzOiByYXdWYWx1ZSxcbiAgICBjcm9zc0F4aXM6IDAsXG4gICAgYWxpZ25tZW50QXhpczogbnVsbFxuICB9IDoge1xuICAgIG1haW5BeGlzOiByYXdWYWx1ZS5tYWluQXhpcyB8fCAwLFxuICAgIGNyb3NzQXhpczogcmF3VmFsdWUuY3Jvc3NBeGlzIHx8IDAsXG4gICAgYWxpZ25tZW50QXhpczogcmF3VmFsdWUuYWxpZ25tZW50QXhpc1xuICB9O1xuICBpZiAoYWxpZ25tZW50ICYmIHR5cGVvZiBhbGlnbm1lbnRBeGlzID09PSAnbnVtYmVyJykge1xuICAgIGNyb3NzQXhpcyA9IGFsaWdubWVudCA9PT0gJ2VuZCcgPyBhbGlnbm1lbnRBeGlzICogLTEgOiBhbGlnbm1lbnRBeGlzO1xuICB9XG4gIHJldHVybiBpc1ZlcnRpY2FsID8ge1xuICAgIHg6IGNyb3NzQXhpcyAqIGNyb3NzQXhpc011bHRpLFxuICAgIHk6IG1haW5BeGlzICogbWFpbkF4aXNNdWx0aVxuICB9IDoge1xuICAgIHg6IG1haW5BeGlzICogbWFpbkF4aXNNdWx0aSxcbiAgICB5OiBjcm9zc0F4aXMgKiBjcm9zc0F4aXNNdWx0aVxuICB9O1xufVxuXG4vKipcbiAqIE1vZGlmaWVzIHRoZSBwbGFjZW1lbnQgYnkgdHJhbnNsYXRpbmcgdGhlIGZsb2F0aW5nIGVsZW1lbnQgYWxvbmcgdGhlXG4gKiBzcGVjaWZpZWQgYXhlcy5cbiAqIEEgbnVtYmVyIChzaG9ydGhhbmQgZm9yIGBtYWluQXhpc2Agb3IgZGlzdGFuY2UpLCBvciBhbiBheGVzIGNvbmZpZ3VyYXRpb25cbiAqIG9iamVjdCBtYXkgYmUgcGFzc2VkLlxuICogQHNlZSBodHRwczovL2Zsb2F0aW5nLXVpLmNvbS9kb2NzL29mZnNldFxuICovXG5jb25zdCBvZmZzZXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IDA7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnb2Zmc2V0JyxcbiAgICBvcHRpb25zLFxuICAgIGFzeW5jIGZuKHN0YXRlKSB7XG4gICAgICB2YXIgX21pZGRsZXdhcmVEYXRhJG9mZnNlLCBfbWlkZGxld2FyZURhdGEkYXJyb3c7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHBsYWNlbWVudCxcbiAgICAgICAgbWlkZGxld2FyZURhdGFcbiAgICAgIH0gPSBzdGF0ZTtcbiAgICAgIGNvbnN0IGRpZmZDb29yZHMgPSBhd2FpdCBjb252ZXJ0VmFsdWVUb0Nvb3JkcyhzdGF0ZSwgb3B0aW9ucyk7XG5cbiAgICAgIC8vIElmIHRoZSBwbGFjZW1lbnQgaXMgdGhlIHNhbWUgYW5kIHRoZSBhcnJvdyBjYXVzZWQgYW4gYWxpZ25tZW50IG9mZnNldFxuICAgICAgLy8gdGhlbiB3ZSBkb24ndCBuZWVkIHRvIGNoYW5nZSB0aGUgcG9zaXRpb25pbmcgY29vcmRpbmF0ZXMuXG4gICAgICBpZiAocGxhY2VtZW50ID09PSAoKF9taWRkbGV3YXJlRGF0YSRvZmZzZSA9IG1pZGRsZXdhcmVEYXRhLm9mZnNldCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9taWRkbGV3YXJlRGF0YSRvZmZzZS5wbGFjZW1lbnQpICYmIChfbWlkZGxld2FyZURhdGEkYXJyb3cgPSBtaWRkbGV3YXJlRGF0YS5hcnJvdykgIT0gbnVsbCAmJiBfbWlkZGxld2FyZURhdGEkYXJyb3cuYWxpZ25tZW50T2Zmc2V0KSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHg6IHggKyBkaWZmQ29vcmRzLngsXG4gICAgICAgIHk6IHkgKyBkaWZmQ29vcmRzLnksXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAuLi5kaWZmQ29vcmRzLFxuICAgICAgICAgIHBsYWNlbWVudFxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn07XG5cbi8qKlxuICogT3B0aW1pemVzIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBmbG9hdGluZyBlbGVtZW50IGJ5IHNoaWZ0aW5nIGl0IGluIG9yZGVyIHRvXG4gKiBrZWVwIGl0IGluIHZpZXcgd2hlbiBpdCB3aWxsIG92ZXJmbG93IHRoZSBjbGlwcGluZyBib3VuZGFyeS5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy9zaGlmdFxuICovXG5jb25zdCBzaGlmdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnc2hpZnQnLFxuICAgIG9wdGlvbnMsXG4gICAgYXN5bmMgZm4oc3RhdGUpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgeCxcbiAgICAgICAgeSxcbiAgICAgICAgcGxhY2VtZW50XG4gICAgICB9ID0gc3RhdGU7XG4gICAgICBjb25zdCB7XG4gICAgICAgIG1haW5BeGlzOiBjaGVja01haW5BeGlzID0gdHJ1ZSxcbiAgICAgICAgY3Jvc3NBeGlzOiBjaGVja0Nyb3NzQXhpcyA9IGZhbHNlLFxuICAgICAgICBsaW1pdGVyID0ge1xuICAgICAgICAgIGZuOiBfcmVmID0+IHtcbiAgICAgICAgICAgIGxldCB7XG4gICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgIHlcbiAgICAgICAgICAgIH0gPSBfcmVmO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgeVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC4uLmRldGVjdE92ZXJmbG93T3B0aW9uc1xuICAgICAgfSA9IGV2YWx1YXRlKG9wdGlvbnMsIHN0YXRlKTtcbiAgICAgIGNvbnN0IGNvb3JkcyA9IHtcbiAgICAgICAgeCxcbiAgICAgICAgeVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG92ZXJmbG93ID0gYXdhaXQgZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIGRldGVjdE92ZXJmbG93T3B0aW9ucyk7XG4gICAgICBjb25zdCBjcm9zc0F4aXMgPSBnZXRTaWRlQXhpcyhnZXRTaWRlKHBsYWNlbWVudCkpO1xuICAgICAgY29uc3QgbWFpbkF4aXMgPSBnZXRPcHBvc2l0ZUF4aXMoY3Jvc3NBeGlzKTtcbiAgICAgIGxldCBtYWluQXhpc0Nvb3JkID0gY29vcmRzW21haW5BeGlzXTtcbiAgICAgIGxldCBjcm9zc0F4aXNDb29yZCA9IGNvb3Jkc1tjcm9zc0F4aXNdO1xuICAgICAgaWYgKGNoZWNrTWFpbkF4aXMpIHtcbiAgICAgICAgY29uc3QgbWluU2lkZSA9IG1haW5BeGlzID09PSAneScgPyAndG9wJyA6ICdsZWZ0JztcbiAgICAgICAgY29uc3QgbWF4U2lkZSA9IG1haW5BeGlzID09PSAneScgPyAnYm90dG9tJyA6ICdyaWdodCc7XG4gICAgICAgIGNvbnN0IG1pbiA9IG1haW5BeGlzQ29vcmQgKyBvdmVyZmxvd1ttaW5TaWRlXTtcbiAgICAgICAgY29uc3QgbWF4ID0gbWFpbkF4aXNDb29yZCAtIG92ZXJmbG93W21heFNpZGVdO1xuICAgICAgICBtYWluQXhpc0Nvb3JkID0gY2xhbXAobWluLCBtYWluQXhpc0Nvb3JkLCBtYXgpO1xuICAgICAgfVxuICAgICAgaWYgKGNoZWNrQ3Jvc3NBeGlzKSB7XG4gICAgICAgIGNvbnN0IG1pblNpZGUgPSBjcm9zc0F4aXMgPT09ICd5JyA/ICd0b3AnIDogJ2xlZnQnO1xuICAgICAgICBjb25zdCBtYXhTaWRlID0gY3Jvc3NBeGlzID09PSAneScgPyAnYm90dG9tJyA6ICdyaWdodCc7XG4gICAgICAgIGNvbnN0IG1pbiA9IGNyb3NzQXhpc0Nvb3JkICsgb3ZlcmZsb3dbbWluU2lkZV07XG4gICAgICAgIGNvbnN0IG1heCA9IGNyb3NzQXhpc0Nvb3JkIC0gb3ZlcmZsb3dbbWF4U2lkZV07XG4gICAgICAgIGNyb3NzQXhpc0Nvb3JkID0gY2xhbXAobWluLCBjcm9zc0F4aXNDb29yZCwgbWF4KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGxpbWl0ZWRDb29yZHMgPSBsaW1pdGVyLmZuKHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIFttYWluQXhpc106IG1haW5BeGlzQ29vcmQsXG4gICAgICAgIFtjcm9zc0F4aXNdOiBjcm9zc0F4aXNDb29yZFxuICAgICAgfSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5saW1pdGVkQ29vcmRzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgeDogbGltaXRlZENvb3Jkcy54IC0geCxcbiAgICAgICAgICB5OiBsaW1pdGVkQ29vcmRzLnkgLSB5LFxuICAgICAgICAgIGVuYWJsZWQ6IHtcbiAgICAgICAgICAgIFttYWluQXhpc106IGNoZWNrTWFpbkF4aXMsXG4gICAgICAgICAgICBbY3Jvc3NBeGlzXTogY2hlY2tDcm9zc0F4aXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xufTtcbi8qKlxuICogQnVpbHQtaW4gYGxpbWl0ZXJgIHRoYXQgd2lsbCBzdG9wIGBzaGlmdCgpYCBhdCBhIGNlcnRhaW4gcG9pbnQuXG4gKi9cbmNvbnN0IGxpbWl0U2hpZnQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIHJldHVybiB7XG4gICAgb3B0aW9ucyxcbiAgICBmbihzdGF0ZSkge1xuICAgICAgY29uc3Qge1xuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICBwbGFjZW1lbnQsXG4gICAgICAgIHJlY3RzLFxuICAgICAgICBtaWRkbGV3YXJlRGF0YVxuICAgICAgfSA9IHN0YXRlO1xuICAgICAgY29uc3Qge1xuICAgICAgICBvZmZzZXQgPSAwLFxuICAgICAgICBtYWluQXhpczogY2hlY2tNYWluQXhpcyA9IHRydWUsXG4gICAgICAgIGNyb3NzQXhpczogY2hlY2tDcm9zc0F4aXMgPSB0cnVlXG4gICAgICB9ID0gZXZhbHVhdGUob3B0aW9ucywgc3RhdGUpO1xuICAgICAgY29uc3QgY29vcmRzID0ge1xuICAgICAgICB4LFxuICAgICAgICB5XG4gICAgICB9O1xuICAgICAgY29uc3QgY3Jvc3NBeGlzID0gZ2V0U2lkZUF4aXMocGxhY2VtZW50KTtcbiAgICAgIGNvbnN0IG1haW5BeGlzID0gZ2V0T3Bwb3NpdGVBeGlzKGNyb3NzQXhpcyk7XG4gICAgICBsZXQgbWFpbkF4aXNDb29yZCA9IGNvb3Jkc1ttYWluQXhpc107XG4gICAgICBsZXQgY3Jvc3NBeGlzQ29vcmQgPSBjb29yZHNbY3Jvc3NBeGlzXTtcbiAgICAgIGNvbnN0IHJhd09mZnNldCA9IGV2YWx1YXRlKG9mZnNldCwgc3RhdGUpO1xuICAgICAgY29uc3QgY29tcHV0ZWRPZmZzZXQgPSB0eXBlb2YgcmF3T2Zmc2V0ID09PSAnbnVtYmVyJyA/IHtcbiAgICAgICAgbWFpbkF4aXM6IHJhd09mZnNldCxcbiAgICAgICAgY3Jvc3NBeGlzOiAwXG4gICAgICB9IDoge1xuICAgICAgICBtYWluQXhpczogMCxcbiAgICAgICAgY3Jvc3NBeGlzOiAwLFxuICAgICAgICAuLi5yYXdPZmZzZXRcbiAgICAgIH07XG4gICAgICBpZiAoY2hlY2tNYWluQXhpcykge1xuICAgICAgICBjb25zdCBsZW4gPSBtYWluQXhpcyA9PT0gJ3knID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuICAgICAgICBjb25zdCBsaW1pdE1pbiA9IHJlY3RzLnJlZmVyZW5jZVttYWluQXhpc10gLSByZWN0cy5mbG9hdGluZ1tsZW5dICsgY29tcHV0ZWRPZmZzZXQubWFpbkF4aXM7XG4gICAgICAgIGNvbnN0IGxpbWl0TWF4ID0gcmVjdHMucmVmZXJlbmNlW21haW5BeGlzXSArIHJlY3RzLnJlZmVyZW5jZVtsZW5dIC0gY29tcHV0ZWRPZmZzZXQubWFpbkF4aXM7XG4gICAgICAgIGlmIChtYWluQXhpc0Nvb3JkIDwgbGltaXRNaW4pIHtcbiAgICAgICAgICBtYWluQXhpc0Nvb3JkID0gbGltaXRNaW47XG4gICAgICAgIH0gZWxzZSBpZiAobWFpbkF4aXNDb29yZCA+IGxpbWl0TWF4KSB7XG4gICAgICAgICAgbWFpbkF4aXNDb29yZCA9IGxpbWl0TWF4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoY2hlY2tDcm9zc0F4aXMpIHtcbiAgICAgICAgdmFyIF9taWRkbGV3YXJlRGF0YSRvZmZzZSwgX21pZGRsZXdhcmVEYXRhJG9mZnNlMjtcbiAgICAgICAgY29uc3QgbGVuID0gbWFpbkF4aXMgPT09ICd5JyA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcbiAgICAgICAgY29uc3QgaXNPcmlnaW5TaWRlID0gWyd0b3AnLCAnbGVmdCddLmluY2x1ZGVzKGdldFNpZGUocGxhY2VtZW50KSk7XG4gICAgICAgIGNvbnN0IGxpbWl0TWluID0gcmVjdHMucmVmZXJlbmNlW2Nyb3NzQXhpc10gLSByZWN0cy5mbG9hdGluZ1tsZW5dICsgKGlzT3JpZ2luU2lkZSA/ICgoX21pZGRsZXdhcmVEYXRhJG9mZnNlID0gbWlkZGxld2FyZURhdGEub2Zmc2V0KSA9PSBudWxsID8gdm9pZCAwIDogX21pZGRsZXdhcmVEYXRhJG9mZnNlW2Nyb3NzQXhpc10pIHx8IDAgOiAwKSArIChpc09yaWdpblNpZGUgPyAwIDogY29tcHV0ZWRPZmZzZXQuY3Jvc3NBeGlzKTtcbiAgICAgICAgY29uc3QgbGltaXRNYXggPSByZWN0cy5yZWZlcmVuY2VbY3Jvc3NBeGlzXSArIHJlY3RzLnJlZmVyZW5jZVtsZW5dICsgKGlzT3JpZ2luU2lkZSA/IDAgOiAoKF9taWRkbGV3YXJlRGF0YSRvZmZzZTIgPSBtaWRkbGV3YXJlRGF0YS5vZmZzZXQpID09IG51bGwgPyB2b2lkIDAgOiBfbWlkZGxld2FyZURhdGEkb2Zmc2UyW2Nyb3NzQXhpc10pIHx8IDApIC0gKGlzT3JpZ2luU2lkZSA/IGNvbXB1dGVkT2Zmc2V0LmNyb3NzQXhpcyA6IDApO1xuICAgICAgICBpZiAoY3Jvc3NBeGlzQ29vcmQgPCBsaW1pdE1pbikge1xuICAgICAgICAgIGNyb3NzQXhpc0Nvb3JkID0gbGltaXRNaW47XG4gICAgICAgIH0gZWxzZSBpZiAoY3Jvc3NBeGlzQ29vcmQgPiBsaW1pdE1heCkge1xuICAgICAgICAgIGNyb3NzQXhpc0Nvb3JkID0gbGltaXRNYXg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIFttYWluQXhpc106IG1haW5BeGlzQ29vcmQsXG4gICAgICAgIFtjcm9zc0F4aXNdOiBjcm9zc0F4aXNDb29yZFxuICAgICAgfTtcbiAgICB9XG4gIH07XG59O1xuXG4vKipcbiAqIFByb3ZpZGVzIGRhdGEgdGhhdCBhbGxvd3MgeW91IHRvIGNoYW5nZSB0aGUgc2l6ZSBvZiB0aGUgZmxvYXRpbmcgZWxlbWVudCBcdTIwMTRcbiAqIGZvciBpbnN0YW5jZSwgcHJldmVudCBpdCBmcm9tIG92ZXJmbG93aW5nIHRoZSBjbGlwcGluZyBib3VuZGFyeSBvciBtYXRjaCB0aGVcbiAqIHdpZHRoIG9mIHRoZSByZWZlcmVuY2UgZWxlbWVudC5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy9zaXplXG4gKi9cbmNvbnN0IHNpemUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3NpemUnLFxuICAgIG9wdGlvbnMsXG4gICAgYXN5bmMgZm4oc3RhdGUpIHtcbiAgICAgIHZhciBfc3RhdGUkbWlkZGxld2FyZURhdGEsIF9zdGF0ZSRtaWRkbGV3YXJlRGF0YTI7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHBsYWNlbWVudCxcbiAgICAgICAgcmVjdHMsXG4gICAgICAgIHBsYXRmb3JtLFxuICAgICAgICBlbGVtZW50c1xuICAgICAgfSA9IHN0YXRlO1xuICAgICAgY29uc3Qge1xuICAgICAgICBhcHBseSA9ICgpID0+IHt9LFxuICAgICAgICAuLi5kZXRlY3RPdmVyZmxvd09wdGlvbnNcbiAgICAgIH0gPSBldmFsdWF0ZShvcHRpb25zLCBzdGF0ZSk7XG4gICAgICBjb25zdCBvdmVyZmxvdyA9IGF3YWl0IGRldGVjdE92ZXJmbG93KHN0YXRlLCBkZXRlY3RPdmVyZmxvd09wdGlvbnMpO1xuICAgICAgY29uc3Qgc2lkZSA9IGdldFNpZGUocGxhY2VtZW50KTtcbiAgICAgIGNvbnN0IGFsaWdubWVudCA9IGdldEFsaWdubWVudChwbGFjZW1lbnQpO1xuICAgICAgY29uc3QgaXNZQXhpcyA9IGdldFNpZGVBeGlzKHBsYWNlbWVudCkgPT09ICd5JztcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodFxuICAgICAgfSA9IHJlY3RzLmZsb2F0aW5nO1xuICAgICAgbGV0IGhlaWdodFNpZGU7XG4gICAgICBsZXQgd2lkdGhTaWRlO1xuICAgICAgaWYgKHNpZGUgPT09ICd0b3AnIHx8IHNpZGUgPT09ICdib3R0b20nKSB7XG4gICAgICAgIGhlaWdodFNpZGUgPSBzaWRlO1xuICAgICAgICB3aWR0aFNpZGUgPSBhbGlnbm1lbnQgPT09ICgoYXdhaXQgKHBsYXRmb3JtLmlzUlRMID09IG51bGwgPyB2b2lkIDAgOiBwbGF0Zm9ybS5pc1JUTChlbGVtZW50cy5mbG9hdGluZykpKSA/ICdzdGFydCcgOiAnZW5kJykgPyAnbGVmdCcgOiAncmlnaHQnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2lkdGhTaWRlID0gc2lkZTtcbiAgICAgICAgaGVpZ2h0U2lkZSA9IGFsaWdubWVudCA9PT0gJ2VuZCcgPyAndG9wJyA6ICdib3R0b20nO1xuICAgICAgfVxuICAgICAgY29uc3QgbWF4aW11bUNsaXBwaW5nSGVpZ2h0ID0gaGVpZ2h0IC0gb3ZlcmZsb3cudG9wIC0gb3ZlcmZsb3cuYm90dG9tO1xuICAgICAgY29uc3QgbWF4aW11bUNsaXBwaW5nV2lkdGggPSB3aWR0aCAtIG92ZXJmbG93LmxlZnQgLSBvdmVyZmxvdy5yaWdodDtcbiAgICAgIGNvbnN0IG92ZXJmbG93QXZhaWxhYmxlSGVpZ2h0ID0gbWluKGhlaWdodCAtIG92ZXJmbG93W2hlaWdodFNpZGVdLCBtYXhpbXVtQ2xpcHBpbmdIZWlnaHQpO1xuICAgICAgY29uc3Qgb3ZlcmZsb3dBdmFpbGFibGVXaWR0aCA9IG1pbih3aWR0aCAtIG92ZXJmbG93W3dpZHRoU2lkZV0sIG1heGltdW1DbGlwcGluZ1dpZHRoKTtcbiAgICAgIGNvbnN0IG5vU2hpZnQgPSAhc3RhdGUubWlkZGxld2FyZURhdGEuc2hpZnQ7XG4gICAgICBsZXQgYXZhaWxhYmxlSGVpZ2h0ID0gb3ZlcmZsb3dBdmFpbGFibGVIZWlnaHQ7XG4gICAgICBsZXQgYXZhaWxhYmxlV2lkdGggPSBvdmVyZmxvd0F2YWlsYWJsZVdpZHRoO1xuICAgICAgaWYgKChfc3RhdGUkbWlkZGxld2FyZURhdGEgPSBzdGF0ZS5taWRkbGV3YXJlRGF0YS5zaGlmdCkgIT0gbnVsbCAmJiBfc3RhdGUkbWlkZGxld2FyZURhdGEuZW5hYmxlZC54KSB7XG4gICAgICAgIGF2YWlsYWJsZVdpZHRoID0gbWF4aW11bUNsaXBwaW5nV2lkdGg7XG4gICAgICB9XG4gICAgICBpZiAoKF9zdGF0ZSRtaWRkbGV3YXJlRGF0YTIgPSBzdGF0ZS5taWRkbGV3YXJlRGF0YS5zaGlmdCkgIT0gbnVsbCAmJiBfc3RhdGUkbWlkZGxld2FyZURhdGEyLmVuYWJsZWQueSkge1xuICAgICAgICBhdmFpbGFibGVIZWlnaHQgPSBtYXhpbXVtQ2xpcHBpbmdIZWlnaHQ7XG4gICAgICB9XG4gICAgICBpZiAobm9TaGlmdCAmJiAhYWxpZ25tZW50KSB7XG4gICAgICAgIGNvbnN0IHhNaW4gPSBtYXgob3ZlcmZsb3cubGVmdCwgMCk7XG4gICAgICAgIGNvbnN0IHhNYXggPSBtYXgob3ZlcmZsb3cucmlnaHQsIDApO1xuICAgICAgICBjb25zdCB5TWluID0gbWF4KG92ZXJmbG93LnRvcCwgMCk7XG4gICAgICAgIGNvbnN0IHlNYXggPSBtYXgob3ZlcmZsb3cuYm90dG9tLCAwKTtcbiAgICAgICAgaWYgKGlzWUF4aXMpIHtcbiAgICAgICAgICBhdmFpbGFibGVXaWR0aCA9IHdpZHRoIC0gMiAqICh4TWluICE9PSAwIHx8IHhNYXggIT09IDAgPyB4TWluICsgeE1heCA6IG1heChvdmVyZmxvdy5sZWZ0LCBvdmVyZmxvdy5yaWdodCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF2YWlsYWJsZUhlaWdodCA9IGhlaWdodCAtIDIgKiAoeU1pbiAhPT0gMCB8fCB5TWF4ICE9PSAwID8geU1pbiArIHlNYXggOiBtYXgob3ZlcmZsb3cudG9wLCBvdmVyZmxvdy5ib3R0b20pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYXdhaXQgYXBwbHkoe1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgYXZhaWxhYmxlV2lkdGgsXG4gICAgICAgIGF2YWlsYWJsZUhlaWdodFxuICAgICAgfSk7XG4gICAgICBjb25zdCBuZXh0RGltZW5zaW9ucyA9IGF3YWl0IHBsYXRmb3JtLmdldERpbWVuc2lvbnMoZWxlbWVudHMuZmxvYXRpbmcpO1xuICAgICAgaWYgKHdpZHRoICE9PSBuZXh0RGltZW5zaW9ucy53aWR0aCB8fCBoZWlnaHQgIT09IG5leHREaW1lbnNpb25zLmhlaWdodCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlc2V0OiB7XG4gICAgICAgICAgICByZWN0czogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnQgeyBhcnJvdywgYXV0b1BsYWNlbWVudCwgY29tcHV0ZVBvc2l0aW9uLCBkZXRlY3RPdmVyZmxvdywgZmxpcCwgaGlkZSwgaW5saW5lLCBsaW1pdFNoaWZ0LCBvZmZzZXQsIHNoaWZ0LCBzaXplIH07XG4iLCAiZnVuY3Rpb24gaGFzV2luZG93KCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG59XG5mdW5jdGlvbiBnZXROb2RlTmFtZShub2RlKSB7XG4gIGlmIChpc05vZGUobm9kZSkpIHtcbiAgICByZXR1cm4gKG5vZGUubm9kZU5hbWUgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gIH1cbiAgLy8gTW9ja2VkIG5vZGVzIGluIHRlc3RpbmcgZW52aXJvbm1lbnRzIG1heSBub3QgYmUgaW5zdGFuY2VzIG9mIE5vZGUuIEJ5XG4gIC8vIHJldHVybmluZyBgI2RvY3VtZW50YCBhbiBpbmZpbml0ZSBsb29wIHdvbid0IG9jY3VyLlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmxvYXRpbmctdWkvZmxvYXRpbmctdWkvaXNzdWVzLzIzMTdcbiAgcmV0dXJuICcjZG9jdW1lbnQnO1xufVxuZnVuY3Rpb24gZ2V0V2luZG93KG5vZGUpIHtcbiAgdmFyIF9ub2RlJG93bmVyRG9jdW1lbnQ7XG4gIHJldHVybiAobm9kZSA9PSBudWxsIHx8IChfbm9kZSRvd25lckRvY3VtZW50ID0gbm9kZS5vd25lckRvY3VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX25vZGUkb3duZXJEb2N1bWVudC5kZWZhdWx0VmlldykgfHwgd2luZG93O1xufVxuZnVuY3Rpb24gZ2V0RG9jdW1lbnRFbGVtZW50KG5vZGUpIHtcbiAgdmFyIF9yZWY7XG4gIHJldHVybiAoX3JlZiA9IChpc05vZGUobm9kZSkgPyBub2RlLm93bmVyRG9jdW1lbnQgOiBub2RlLmRvY3VtZW50KSB8fCB3aW5kb3cuZG9jdW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfcmVmLmRvY3VtZW50RWxlbWVudDtcbn1cbmZ1bmN0aW9uIGlzTm9kZSh2YWx1ZSkge1xuICBpZiAoIWhhc1dpbmRvdygpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIE5vZGUgfHwgdmFsdWUgaW5zdGFuY2VvZiBnZXRXaW5kb3codmFsdWUpLk5vZGU7XG59XG5mdW5jdGlvbiBpc0VsZW1lbnQodmFsdWUpIHtcbiAgaWYgKCFoYXNXaW5kb3coKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBFbGVtZW50IHx8IHZhbHVlIGluc3RhbmNlb2YgZ2V0V2luZG93KHZhbHVlKS5FbGVtZW50O1xufVxuZnVuY3Rpb24gaXNIVE1MRWxlbWVudCh2YWx1ZSkge1xuICBpZiAoIWhhc1dpbmRvdygpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8IHZhbHVlIGluc3RhbmNlb2YgZ2V0V2luZG93KHZhbHVlKS5IVE1MRWxlbWVudDtcbn1cbmZ1bmN0aW9uIGlzU2hhZG93Um9vdCh2YWx1ZSkge1xuICBpZiAoIWhhc1dpbmRvdygpIHx8IHR5cGVvZiBTaGFkb3dSb290ID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBTaGFkb3dSb290IHx8IHZhbHVlIGluc3RhbmNlb2YgZ2V0V2luZG93KHZhbHVlKS5TaGFkb3dSb290O1xufVxuZnVuY3Rpb24gaXNPdmVyZmxvd0VsZW1lbnQoZWxlbWVudCkge1xuICBjb25zdCB7XG4gICAgb3ZlcmZsb3csXG4gICAgb3ZlcmZsb3dYLFxuICAgIG92ZXJmbG93WSxcbiAgICBkaXNwbGF5XG4gIH0gPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICByZXR1cm4gL2F1dG98c2Nyb2xsfG92ZXJsYXl8aGlkZGVufGNsaXAvLnRlc3Qob3ZlcmZsb3cgKyBvdmVyZmxvd1kgKyBvdmVyZmxvd1gpICYmICFbJ2lubGluZScsICdjb250ZW50cyddLmluY2x1ZGVzKGRpc3BsYXkpO1xufVxuZnVuY3Rpb24gaXNUYWJsZUVsZW1lbnQoZWxlbWVudCkge1xuICByZXR1cm4gWyd0YWJsZScsICd0ZCcsICd0aCddLmluY2x1ZGVzKGdldE5vZGVOYW1lKGVsZW1lbnQpKTtcbn1cbmZ1bmN0aW9uIGlzVG9wTGF5ZXIoZWxlbWVudCkge1xuICByZXR1cm4gWyc6cG9wb3Zlci1vcGVuJywgJzptb2RhbCddLnNvbWUoc2VsZWN0b3IgPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIGlzQ29udGFpbmluZ0Jsb2NrKGVsZW1lbnRPckNzcykge1xuICBjb25zdCB3ZWJraXQgPSBpc1dlYktpdCgpO1xuICBjb25zdCBjc3MgPSBpc0VsZW1lbnQoZWxlbWVudE9yQ3NzKSA/IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudE9yQ3NzKSA6IGVsZW1lbnRPckNzcztcblxuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvQ29udGFpbmluZ19ibG9jayNpZGVudGlmeWluZ190aGVfY29udGFpbmluZ19ibG9ja1xuICAvLyBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXRyYW5zZm9ybXMtMi8jaW5kaXZpZHVhbC10cmFuc2Zvcm1zXG4gIHJldHVybiBbJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUnLCAnc2NhbGUnLCAncm90YXRlJywgJ3BlcnNwZWN0aXZlJ10uc29tZSh2YWx1ZSA9PiBjc3NbdmFsdWVdID8gY3NzW3ZhbHVlXSAhPT0gJ25vbmUnIDogZmFsc2UpIHx8IChjc3MuY29udGFpbmVyVHlwZSA/IGNzcy5jb250YWluZXJUeXBlICE9PSAnbm9ybWFsJyA6IGZhbHNlKSB8fCAhd2Via2l0ICYmIChjc3MuYmFja2Ryb3BGaWx0ZXIgPyBjc3MuYmFja2Ryb3BGaWx0ZXIgIT09ICdub25lJyA6IGZhbHNlKSB8fCAhd2Via2l0ICYmIChjc3MuZmlsdGVyID8gY3NzLmZpbHRlciAhPT0gJ25vbmUnIDogZmFsc2UpIHx8IFsndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZScsICdzY2FsZScsICdyb3RhdGUnLCAncGVyc3BlY3RpdmUnLCAnZmlsdGVyJ10uc29tZSh2YWx1ZSA9PiAoY3NzLndpbGxDaGFuZ2UgfHwgJycpLmluY2x1ZGVzKHZhbHVlKSkgfHwgWydwYWludCcsICdsYXlvdXQnLCAnc3RyaWN0JywgJ2NvbnRlbnQnXS5zb21lKHZhbHVlID0+IChjc3MuY29udGFpbiB8fCAnJykuaW5jbHVkZXModmFsdWUpKTtcbn1cbmZ1bmN0aW9uIGdldENvbnRhaW5pbmdCbG9jayhlbGVtZW50KSB7XG4gIGxldCBjdXJyZW50Tm9kZSA9IGdldFBhcmVudE5vZGUoZWxlbWVudCk7XG4gIHdoaWxlIChpc0hUTUxFbGVtZW50KGN1cnJlbnROb2RlKSAmJiAhaXNMYXN0VHJhdmVyc2FibGVOb2RlKGN1cnJlbnROb2RlKSkge1xuICAgIGlmIChpc0NvbnRhaW5pbmdCbG9jayhjdXJyZW50Tm9kZSkpIHtcbiAgICAgIHJldHVybiBjdXJyZW50Tm9kZTtcbiAgICB9IGVsc2UgaWYgKGlzVG9wTGF5ZXIoY3VycmVudE5vZGUpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY3VycmVudE5vZGUgPSBnZXRQYXJlbnROb2RlKGN1cnJlbnROb2RlKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIGlzV2ViS2l0KCkge1xuICBpZiAodHlwZW9mIENTUyA9PT0gJ3VuZGVmaW5lZCcgfHwgIUNTUy5zdXBwb3J0cykgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gQ1NTLnN1cHBvcnRzKCctd2Via2l0LWJhY2tkcm9wLWZpbHRlcicsICdub25lJyk7XG59XG5mdW5jdGlvbiBpc0xhc3RUcmF2ZXJzYWJsZU5vZGUobm9kZSkge1xuICByZXR1cm4gWydodG1sJywgJ2JvZHknLCAnI2RvY3VtZW50J10uaW5jbHVkZXMoZ2V0Tm9kZU5hbWUobm9kZSkpO1xufVxuZnVuY3Rpb24gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSB7XG4gIHJldHVybiBnZXRXaW5kb3coZWxlbWVudCkuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbn1cbmZ1bmN0aW9uIGdldE5vZGVTY3JvbGwoZWxlbWVudCkge1xuICBpZiAoaXNFbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjcm9sbExlZnQ6IGVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgIHNjcm9sbFRvcDogZWxlbWVudC5zY3JvbGxUb3BcbiAgICB9O1xuICB9XG4gIHJldHVybiB7XG4gICAgc2Nyb2xsTGVmdDogZWxlbWVudC5zY3JvbGxYLFxuICAgIHNjcm9sbFRvcDogZWxlbWVudC5zY3JvbGxZXG4gIH07XG59XG5mdW5jdGlvbiBnZXRQYXJlbnROb2RlKG5vZGUpIHtcbiAgaWYgKGdldE5vZGVOYW1lKG5vZGUpID09PSAnaHRtbCcpIHtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICBjb25zdCByZXN1bHQgPVxuICAvLyBTdGVwIGludG8gdGhlIHNoYWRvdyBET00gb2YgdGhlIHBhcmVudCBvZiBhIHNsb3R0ZWQgbm9kZS5cbiAgbm9kZS5hc3NpZ25lZFNsb3QgfHxcbiAgLy8gRE9NIEVsZW1lbnQgZGV0ZWN0ZWQuXG4gIG5vZGUucGFyZW50Tm9kZSB8fFxuICAvLyBTaGFkb3dSb290IGRldGVjdGVkLlxuICBpc1NoYWRvd1Jvb3Qobm9kZSkgJiYgbm9kZS5ob3N0IHx8XG4gIC8vIEZhbGxiYWNrLlxuICBnZXREb2N1bWVudEVsZW1lbnQobm9kZSk7XG4gIHJldHVybiBpc1NoYWRvd1Jvb3QocmVzdWx0KSA/IHJlc3VsdC5ob3N0IDogcmVzdWx0O1xufVxuZnVuY3Rpb24gZ2V0TmVhcmVzdE92ZXJmbG93QW5jZXN0b3Iobm9kZSkge1xuICBjb25zdCBwYXJlbnROb2RlID0gZ2V0UGFyZW50Tm9kZShub2RlKTtcbiAgaWYgKGlzTGFzdFRyYXZlcnNhYmxlTm9kZShwYXJlbnROb2RlKSkge1xuICAgIHJldHVybiBub2RlLm93bmVyRG9jdW1lbnQgPyBub2RlLm93bmVyRG9jdW1lbnQuYm9keSA6IG5vZGUuYm9keTtcbiAgfVxuICBpZiAoaXNIVE1MRWxlbWVudChwYXJlbnROb2RlKSAmJiBpc092ZXJmbG93RWxlbWVudChwYXJlbnROb2RlKSkge1xuICAgIHJldHVybiBwYXJlbnROb2RlO1xuICB9XG4gIHJldHVybiBnZXROZWFyZXN0T3ZlcmZsb3dBbmNlc3RvcihwYXJlbnROb2RlKTtcbn1cbmZ1bmN0aW9uIGdldE92ZXJmbG93QW5jZXN0b3JzKG5vZGUsIGxpc3QsIHRyYXZlcnNlSWZyYW1lcykge1xuICB2YXIgX25vZGUkb3duZXJEb2N1bWVudDI7XG4gIGlmIChsaXN0ID09PSB2b2lkIDApIHtcbiAgICBsaXN0ID0gW107XG4gIH1cbiAgaWYgKHRyYXZlcnNlSWZyYW1lcyA9PT0gdm9pZCAwKSB7XG4gICAgdHJhdmVyc2VJZnJhbWVzID0gdHJ1ZTtcbiAgfVxuICBjb25zdCBzY3JvbGxhYmxlQW5jZXN0b3IgPSBnZXROZWFyZXN0T3ZlcmZsb3dBbmNlc3Rvcihub2RlKTtcbiAgY29uc3QgaXNCb2R5ID0gc2Nyb2xsYWJsZUFuY2VzdG9yID09PSAoKF9ub2RlJG93bmVyRG9jdW1lbnQyID0gbm9kZS5vd25lckRvY3VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX25vZGUkb3duZXJEb2N1bWVudDIuYm9keSk7XG4gIGNvbnN0IHdpbiA9IGdldFdpbmRvdyhzY3JvbGxhYmxlQW5jZXN0b3IpO1xuICBpZiAoaXNCb2R5KSB7XG4gICAgY29uc3QgZnJhbWVFbGVtZW50ID0gZ2V0RnJhbWVFbGVtZW50KHdpbik7XG4gICAgcmV0dXJuIGxpc3QuY29uY2F0KHdpbiwgd2luLnZpc3VhbFZpZXdwb3J0IHx8IFtdLCBpc092ZXJmbG93RWxlbWVudChzY3JvbGxhYmxlQW5jZXN0b3IpID8gc2Nyb2xsYWJsZUFuY2VzdG9yIDogW10sIGZyYW1lRWxlbWVudCAmJiB0cmF2ZXJzZUlmcmFtZXMgPyBnZXRPdmVyZmxvd0FuY2VzdG9ycyhmcmFtZUVsZW1lbnQpIDogW10pO1xuICB9XG4gIHJldHVybiBsaXN0LmNvbmNhdChzY3JvbGxhYmxlQW5jZXN0b3IsIGdldE92ZXJmbG93QW5jZXN0b3JzKHNjcm9sbGFibGVBbmNlc3RvciwgW10sIHRyYXZlcnNlSWZyYW1lcykpO1xufVxuZnVuY3Rpb24gZ2V0RnJhbWVFbGVtZW50KHdpbikge1xuICByZXR1cm4gd2luLnBhcmVudCAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2Yod2luLnBhcmVudCkgPyB3aW4uZnJhbWVFbGVtZW50IDogbnVsbDtcbn1cblxuZXhwb3J0IHsgZ2V0Q29tcHV0ZWRTdHlsZSwgZ2V0Q29udGFpbmluZ0Jsb2NrLCBnZXREb2N1bWVudEVsZW1lbnQsIGdldEZyYW1lRWxlbWVudCwgZ2V0TmVhcmVzdE92ZXJmbG93QW5jZXN0b3IsIGdldE5vZGVOYW1lLCBnZXROb2RlU2Nyb2xsLCBnZXRPdmVyZmxvd0FuY2VzdG9ycywgZ2V0UGFyZW50Tm9kZSwgZ2V0V2luZG93LCBpc0NvbnRhaW5pbmdCbG9jaywgaXNFbGVtZW50LCBpc0hUTUxFbGVtZW50LCBpc0xhc3RUcmF2ZXJzYWJsZU5vZGUsIGlzTm9kZSwgaXNPdmVyZmxvd0VsZW1lbnQsIGlzU2hhZG93Um9vdCwgaXNUYWJsZUVsZW1lbnQsIGlzVG9wTGF5ZXIsIGlzV2ViS2l0IH07XG4iLCAiaW1wb3J0IHsgcmVjdFRvQ2xpZW50UmVjdCwgYXJyb3cgYXMgYXJyb3ckMSwgYXV0b1BsYWNlbWVudCBhcyBhdXRvUGxhY2VtZW50JDEsIGRldGVjdE92ZXJmbG93IGFzIGRldGVjdE92ZXJmbG93JDEsIGZsaXAgYXMgZmxpcCQxLCBoaWRlIGFzIGhpZGUkMSwgaW5saW5lIGFzIGlubGluZSQxLCBsaW1pdFNoaWZ0IGFzIGxpbWl0U2hpZnQkMSwgb2Zmc2V0IGFzIG9mZnNldCQxLCBzaGlmdCBhcyBzaGlmdCQxLCBzaXplIGFzIHNpemUkMSwgY29tcHV0ZVBvc2l0aW9uIGFzIGNvbXB1dGVQb3NpdGlvbiQxIH0gZnJvbSAnQGZsb2F0aW5nLXVpL2NvcmUnO1xuaW1wb3J0IHsgcm91bmQsIGNyZWF0ZUNvb3JkcywgbWF4LCBtaW4sIGZsb29yIH0gZnJvbSAnQGZsb2F0aW5nLXVpL3V0aWxzJztcbmltcG9ydCB7IGdldENvbXB1dGVkU3R5bGUsIGlzSFRNTEVsZW1lbnQsIGlzRWxlbWVudCwgZ2V0V2luZG93LCBpc1dlYktpdCwgZ2V0RnJhbWVFbGVtZW50LCBnZXROb2RlU2Nyb2xsLCBnZXREb2N1bWVudEVsZW1lbnQsIGlzVG9wTGF5ZXIsIGdldE5vZGVOYW1lLCBpc092ZXJmbG93RWxlbWVudCwgZ2V0T3ZlcmZsb3dBbmNlc3RvcnMsIGdldFBhcmVudE5vZGUsIGlzTGFzdFRyYXZlcnNhYmxlTm9kZSwgaXNDb250YWluaW5nQmxvY2ssIGlzVGFibGVFbGVtZW50LCBnZXRDb250YWluaW5nQmxvY2sgfSBmcm9tICdAZmxvYXRpbmctdWkvdXRpbHMvZG9tJztcbmV4cG9ydCB7IGdldE92ZXJmbG93QW5jZXN0b3JzIH0gZnJvbSAnQGZsb2F0aW5nLXVpL3V0aWxzL2RvbSc7XG5cbmZ1bmN0aW9uIGdldENzc0RpbWVuc2lvbnMoZWxlbWVudCkge1xuICBjb25zdCBjc3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICAvLyBJbiB0ZXN0aW5nIGVudmlyb25tZW50cywgdGhlIGB3aWR0aGAgYW5kIGBoZWlnaHRgIHByb3BlcnRpZXMgYXJlIGVtcHR5XG4gIC8vIHN0cmluZ3MgZm9yIFNWRyBlbGVtZW50cywgcmV0dXJuaW5nIE5hTi4gRmFsbGJhY2sgdG8gYDBgIGluIHRoaXMgY2FzZS5cbiAgbGV0IHdpZHRoID0gcGFyc2VGbG9hdChjc3Mud2lkdGgpIHx8IDA7XG4gIGxldCBoZWlnaHQgPSBwYXJzZUZsb2F0KGNzcy5oZWlnaHQpIHx8IDA7XG4gIGNvbnN0IGhhc09mZnNldCA9IGlzSFRNTEVsZW1lbnQoZWxlbWVudCk7XG4gIGNvbnN0IG9mZnNldFdpZHRoID0gaGFzT2Zmc2V0ID8gZWxlbWVudC5vZmZzZXRXaWR0aCA6IHdpZHRoO1xuICBjb25zdCBvZmZzZXRIZWlnaHQgPSBoYXNPZmZzZXQgPyBlbGVtZW50Lm9mZnNldEhlaWdodCA6IGhlaWdodDtcbiAgY29uc3Qgc2hvdWxkRmFsbGJhY2sgPSByb3VuZCh3aWR0aCkgIT09IG9mZnNldFdpZHRoIHx8IHJvdW5kKGhlaWdodCkgIT09IG9mZnNldEhlaWdodDtcbiAgaWYgKHNob3VsZEZhbGxiYWNrKSB7XG4gICAgd2lkdGggPSBvZmZzZXRXaWR0aDtcbiAgICBoZWlnaHQgPSBvZmZzZXRIZWlnaHQ7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgJDogc2hvdWxkRmFsbGJhY2tcbiAgfTtcbn1cblxuZnVuY3Rpb24gdW53cmFwRWxlbWVudChlbGVtZW50KSB7XG4gIHJldHVybiAhaXNFbGVtZW50KGVsZW1lbnQpID8gZWxlbWVudC5jb250ZXh0RWxlbWVudCA6IGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGdldFNjYWxlKGVsZW1lbnQpIHtcbiAgY29uc3QgZG9tRWxlbWVudCA9IHVud3JhcEVsZW1lbnQoZWxlbWVudCk7XG4gIGlmICghaXNIVE1MRWxlbWVudChkb21FbGVtZW50KSkge1xuICAgIHJldHVybiBjcmVhdGVDb29yZHMoMSk7XG4gIH1cbiAgY29uc3QgcmVjdCA9IGRvbUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgJFxuICB9ID0gZ2V0Q3NzRGltZW5zaW9ucyhkb21FbGVtZW50KTtcbiAgbGV0IHggPSAoJCA/IHJvdW5kKHJlY3Qud2lkdGgpIDogcmVjdC53aWR0aCkgLyB3aWR0aDtcbiAgbGV0IHkgPSAoJCA/IHJvdW5kKHJlY3QuaGVpZ2h0KSA6IHJlY3QuaGVpZ2h0KSAvIGhlaWdodDtcblxuICAvLyAwLCBOYU4sIG9yIEluZmluaXR5IHNob3VsZCBhbHdheXMgZmFsbGJhY2sgdG8gMS5cblxuICBpZiAoIXggfHwgIU51bWJlci5pc0Zpbml0ZSh4KSkge1xuICAgIHggPSAxO1xuICB9XG4gIGlmICgheSB8fCAhTnVtYmVyLmlzRmluaXRlKHkpKSB7XG4gICAgeSA9IDE7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB4LFxuICAgIHlcbiAgfTtcbn1cblxuY29uc3Qgbm9PZmZzZXRzID0gLyojX19QVVJFX18qL2NyZWF0ZUNvb3JkcygwKTtcbmZ1bmN0aW9uIGdldFZpc3VhbE9mZnNldHMoZWxlbWVudCkge1xuICBjb25zdCB3aW4gPSBnZXRXaW5kb3coZWxlbWVudCk7XG4gIGlmICghaXNXZWJLaXQoKSB8fCAhd2luLnZpc3VhbFZpZXdwb3J0KSB7XG4gICAgcmV0dXJuIG5vT2Zmc2V0cztcbiAgfVxuICByZXR1cm4ge1xuICAgIHg6IHdpbi52aXN1YWxWaWV3cG9ydC5vZmZzZXRMZWZ0LFxuICAgIHk6IHdpbi52aXN1YWxWaWV3cG9ydC5vZmZzZXRUb3BcbiAgfTtcbn1cbmZ1bmN0aW9uIHNob3VsZEFkZFZpc3VhbE9mZnNldHMoZWxlbWVudCwgaXNGaXhlZCwgZmxvYXRpbmdPZmZzZXRQYXJlbnQpIHtcbiAgaWYgKGlzRml4ZWQgPT09IHZvaWQgMCkge1xuICAgIGlzRml4ZWQgPSBmYWxzZTtcbiAgfVxuICBpZiAoIWZsb2F0aW5nT2Zmc2V0UGFyZW50IHx8IGlzRml4ZWQgJiYgZmxvYXRpbmdPZmZzZXRQYXJlbnQgIT09IGdldFdpbmRvdyhlbGVtZW50KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gaXNGaXhlZDtcbn1cblxuZnVuY3Rpb24gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQsIGluY2x1ZGVTY2FsZSwgaXNGaXhlZFN0cmF0ZWd5LCBvZmZzZXRQYXJlbnQpIHtcbiAgaWYgKGluY2x1ZGVTY2FsZSA9PT0gdm9pZCAwKSB7XG4gICAgaW5jbHVkZVNjYWxlID0gZmFsc2U7XG4gIH1cbiAgaWYgKGlzRml4ZWRTdHJhdGVneSA9PT0gdm9pZCAwKSB7XG4gICAgaXNGaXhlZFN0cmF0ZWd5ID0gZmFsc2U7XG4gIH1cbiAgY29uc3QgY2xpZW50UmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IGRvbUVsZW1lbnQgPSB1bndyYXBFbGVtZW50KGVsZW1lbnQpO1xuICBsZXQgc2NhbGUgPSBjcmVhdGVDb29yZHMoMSk7XG4gIGlmIChpbmNsdWRlU2NhbGUpIHtcbiAgICBpZiAob2Zmc2V0UGFyZW50KSB7XG4gICAgICBpZiAoaXNFbGVtZW50KG9mZnNldFBhcmVudCkpIHtcbiAgICAgICAgc2NhbGUgPSBnZXRTY2FsZShvZmZzZXRQYXJlbnQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzY2FsZSA9IGdldFNjYWxlKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuICBjb25zdCB2aXN1YWxPZmZzZXRzID0gc2hvdWxkQWRkVmlzdWFsT2Zmc2V0cyhkb21FbGVtZW50LCBpc0ZpeGVkU3RyYXRlZ3ksIG9mZnNldFBhcmVudCkgPyBnZXRWaXN1YWxPZmZzZXRzKGRvbUVsZW1lbnQpIDogY3JlYXRlQ29vcmRzKDApO1xuICBsZXQgeCA9IChjbGllbnRSZWN0LmxlZnQgKyB2aXN1YWxPZmZzZXRzLngpIC8gc2NhbGUueDtcbiAgbGV0IHkgPSAoY2xpZW50UmVjdC50b3AgKyB2aXN1YWxPZmZzZXRzLnkpIC8gc2NhbGUueTtcbiAgbGV0IHdpZHRoID0gY2xpZW50UmVjdC53aWR0aCAvIHNjYWxlLng7XG4gIGxldCBoZWlnaHQgPSBjbGllbnRSZWN0LmhlaWdodCAvIHNjYWxlLnk7XG4gIGlmIChkb21FbGVtZW50KSB7XG4gICAgY29uc3Qgd2luID0gZ2V0V2luZG93KGRvbUVsZW1lbnQpO1xuICAgIGNvbnN0IG9mZnNldFdpbiA9IG9mZnNldFBhcmVudCAmJiBpc0VsZW1lbnQob2Zmc2V0UGFyZW50KSA/IGdldFdpbmRvdyhvZmZzZXRQYXJlbnQpIDogb2Zmc2V0UGFyZW50O1xuICAgIGxldCBjdXJyZW50V2luID0gd2luO1xuICAgIGxldCBjdXJyZW50SUZyYW1lID0gZ2V0RnJhbWVFbGVtZW50KGN1cnJlbnRXaW4pO1xuICAgIHdoaWxlIChjdXJyZW50SUZyYW1lICYmIG9mZnNldFBhcmVudCAmJiBvZmZzZXRXaW4gIT09IGN1cnJlbnRXaW4pIHtcbiAgICAgIGNvbnN0IGlmcmFtZVNjYWxlID0gZ2V0U2NhbGUoY3VycmVudElGcmFtZSk7XG4gICAgICBjb25zdCBpZnJhbWVSZWN0ID0gY3VycmVudElGcmFtZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IGNzcyA9IGdldENvbXB1dGVkU3R5bGUoY3VycmVudElGcmFtZSk7XG4gICAgICBjb25zdCBsZWZ0ID0gaWZyYW1lUmVjdC5sZWZ0ICsgKGN1cnJlbnRJRnJhbWUuY2xpZW50TGVmdCArIHBhcnNlRmxvYXQoY3NzLnBhZGRpbmdMZWZ0KSkgKiBpZnJhbWVTY2FsZS54O1xuICAgICAgY29uc3QgdG9wID0gaWZyYW1lUmVjdC50b3AgKyAoY3VycmVudElGcmFtZS5jbGllbnRUb3AgKyBwYXJzZUZsb2F0KGNzcy5wYWRkaW5nVG9wKSkgKiBpZnJhbWVTY2FsZS55O1xuICAgICAgeCAqPSBpZnJhbWVTY2FsZS54O1xuICAgICAgeSAqPSBpZnJhbWVTY2FsZS55O1xuICAgICAgd2lkdGggKj0gaWZyYW1lU2NhbGUueDtcbiAgICAgIGhlaWdodCAqPSBpZnJhbWVTY2FsZS55O1xuICAgICAgeCArPSBsZWZ0O1xuICAgICAgeSArPSB0b3A7XG4gICAgICBjdXJyZW50V2luID0gZ2V0V2luZG93KGN1cnJlbnRJRnJhbWUpO1xuICAgICAgY3VycmVudElGcmFtZSA9IGdldEZyYW1lRWxlbWVudChjdXJyZW50V2luKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlY3RUb0NsaWVudFJlY3Qoe1xuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICB4LFxuICAgIHlcbiAgfSk7XG59XG5cbi8vIElmIDxodG1sPiBoYXMgYSBDU1Mgd2lkdGggZ3JlYXRlciB0aGFuIHRoZSB2aWV3cG9ydCwgdGhlbiB0aGlzIHdpbGwgYmVcbi8vIGluY29ycmVjdCBmb3IgUlRMLlxuZnVuY3Rpb24gZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50LCByZWN0KSB7XG4gIGNvbnN0IGxlZnRTY3JvbGwgPSBnZXROb2RlU2Nyb2xsKGVsZW1lbnQpLnNjcm9sbExlZnQ7XG4gIGlmICghcmVjdCkge1xuICAgIHJldHVybiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpKS5sZWZ0ICsgbGVmdFNjcm9sbDtcbiAgfVxuICByZXR1cm4gcmVjdC5sZWZ0ICsgbGVmdFNjcm9sbDtcbn1cblxuZnVuY3Rpb24gZ2V0SFRNTE9mZnNldChkb2N1bWVudEVsZW1lbnQsIHNjcm9sbCwgaWdub3JlU2Nyb2xsYmFyWCkge1xuICBpZiAoaWdub3JlU2Nyb2xsYmFyWCA9PT0gdm9pZCAwKSB7XG4gICAgaWdub3JlU2Nyb2xsYmFyWCA9IGZhbHNlO1xuICB9XG4gIGNvbnN0IGh0bWxSZWN0ID0gZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB4ID0gaHRtbFJlY3QubGVmdCArIHNjcm9sbC5zY3JvbGxMZWZ0IC0gKGlnbm9yZVNjcm9sbGJhclggPyAwIDpcbiAgLy8gUlRMIDxib2R5PiBzY3JvbGxiYXIuXG4gIGdldFdpbmRvd1Njcm9sbEJhclgoZG9jdW1lbnRFbGVtZW50LCBodG1sUmVjdCkpO1xuICBjb25zdCB5ID0gaHRtbFJlY3QudG9wICsgc2Nyb2xsLnNjcm9sbFRvcDtcbiAgcmV0dXJuIHtcbiAgICB4LFxuICAgIHlcbiAgfTtcbn1cblxuZnVuY3Rpb24gY29udmVydE9mZnNldFBhcmVudFJlbGF0aXZlUmVjdFRvVmlld3BvcnRSZWxhdGl2ZVJlY3QoX3JlZikge1xuICBsZXQge1xuICAgIGVsZW1lbnRzLFxuICAgIHJlY3QsXG4gICAgb2Zmc2V0UGFyZW50LFxuICAgIHN0cmF0ZWd5XG4gIH0gPSBfcmVmO1xuICBjb25zdCBpc0ZpeGVkID0gc3RyYXRlZ3kgPT09ICdmaXhlZCc7XG4gIGNvbnN0IGRvY3VtZW50RWxlbWVudCA9IGdldERvY3VtZW50RWxlbWVudChvZmZzZXRQYXJlbnQpO1xuICBjb25zdCB0b3BMYXllciA9IGVsZW1lbnRzID8gaXNUb3BMYXllcihlbGVtZW50cy5mbG9hdGluZykgOiBmYWxzZTtcbiAgaWYgKG9mZnNldFBhcmVudCA9PT0gZG9jdW1lbnRFbGVtZW50IHx8IHRvcExheWVyICYmIGlzRml4ZWQpIHtcbiAgICByZXR1cm4gcmVjdDtcbiAgfVxuICBsZXQgc2Nyb2xsID0ge1xuICAgIHNjcm9sbExlZnQ6IDAsXG4gICAgc2Nyb2xsVG9wOiAwXG4gIH07XG4gIGxldCBzY2FsZSA9IGNyZWF0ZUNvb3JkcygxKTtcbiAgY29uc3Qgb2Zmc2V0cyA9IGNyZWF0ZUNvb3JkcygwKTtcbiAgY29uc3QgaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgPSBpc0hUTUxFbGVtZW50KG9mZnNldFBhcmVudCk7XG4gIGlmIChpc09mZnNldFBhcmVudEFuRWxlbWVudCB8fCAhaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgJiYgIWlzRml4ZWQpIHtcbiAgICBpZiAoZ2V0Tm9kZU5hbWUob2Zmc2V0UGFyZW50KSAhPT0gJ2JvZHknIHx8IGlzT3ZlcmZsb3dFbGVtZW50KGRvY3VtZW50RWxlbWVudCkpIHtcbiAgICAgIHNjcm9sbCA9IGdldE5vZGVTY3JvbGwob2Zmc2V0UGFyZW50KTtcbiAgICB9XG4gICAgaWYgKGlzSFRNTEVsZW1lbnQob2Zmc2V0UGFyZW50KSkge1xuICAgICAgY29uc3Qgb2Zmc2V0UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChvZmZzZXRQYXJlbnQpO1xuICAgICAgc2NhbGUgPSBnZXRTY2FsZShvZmZzZXRQYXJlbnQpO1xuICAgICAgb2Zmc2V0cy54ID0gb2Zmc2V0UmVjdC54ICsgb2Zmc2V0UGFyZW50LmNsaWVudExlZnQ7XG4gICAgICBvZmZzZXRzLnkgPSBvZmZzZXRSZWN0LnkgKyBvZmZzZXRQYXJlbnQuY2xpZW50VG9wO1xuICAgIH1cbiAgfVxuICBjb25zdCBodG1sT2Zmc2V0ID0gZG9jdW1lbnRFbGVtZW50ICYmICFpc09mZnNldFBhcmVudEFuRWxlbWVudCAmJiAhaXNGaXhlZCA/IGdldEhUTUxPZmZzZXQoZG9jdW1lbnRFbGVtZW50LCBzY3JvbGwsIHRydWUpIDogY3JlYXRlQ29vcmRzKDApO1xuICByZXR1cm4ge1xuICAgIHdpZHRoOiByZWN0LndpZHRoICogc2NhbGUueCxcbiAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0ICogc2NhbGUueSxcbiAgICB4OiByZWN0LnggKiBzY2FsZS54IC0gc2Nyb2xsLnNjcm9sbExlZnQgKiBzY2FsZS54ICsgb2Zmc2V0cy54ICsgaHRtbE9mZnNldC54LFxuICAgIHk6IHJlY3QueSAqIHNjYWxlLnkgLSBzY3JvbGwuc2Nyb2xsVG9wICogc2NhbGUueSArIG9mZnNldHMueSArIGh0bWxPZmZzZXQueVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRDbGllbnRSZWN0cyhlbGVtZW50KSB7XG4gIHJldHVybiBBcnJheS5mcm9tKGVsZW1lbnQuZ2V0Q2xpZW50UmVjdHMoKSk7XG59XG5cbi8vIEdldHMgdGhlIGVudGlyZSBzaXplIG9mIHRoZSBzY3JvbGxhYmxlIGRvY3VtZW50IGFyZWEsIGV2ZW4gZXh0ZW5kaW5nIG91dHNpZGVcbi8vIG9mIHRoZSBgPGh0bWw+YCBhbmQgYDxib2R5PmAgcmVjdCBib3VuZHMgaWYgaG9yaXpvbnRhbGx5IHNjcm9sbGFibGUuXG5mdW5jdGlvbiBnZXREb2N1bWVudFJlY3QoZWxlbWVudCkge1xuICBjb25zdCBodG1sID0gZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpO1xuICBjb25zdCBzY3JvbGwgPSBnZXROb2RlU2Nyb2xsKGVsZW1lbnQpO1xuICBjb25zdCBib2R5ID0gZWxlbWVudC5vd25lckRvY3VtZW50LmJvZHk7XG4gIGNvbnN0IHdpZHRoID0gbWF4KGh0bWwuc2Nyb2xsV2lkdGgsIGh0bWwuY2xpZW50V2lkdGgsIGJvZHkuc2Nyb2xsV2lkdGgsIGJvZHkuY2xpZW50V2lkdGgpO1xuICBjb25zdCBoZWlnaHQgPSBtYXgoaHRtbC5zY3JvbGxIZWlnaHQsIGh0bWwuY2xpZW50SGVpZ2h0LCBib2R5LnNjcm9sbEhlaWdodCwgYm9keS5jbGllbnRIZWlnaHQpO1xuICBsZXQgeCA9IC1zY3JvbGwuc2Nyb2xsTGVmdCArIGdldFdpbmRvd1Njcm9sbEJhclgoZWxlbWVudCk7XG4gIGNvbnN0IHkgPSAtc2Nyb2xsLnNjcm9sbFRvcDtcbiAgaWYgKGdldENvbXB1dGVkU3R5bGUoYm9keSkuZGlyZWN0aW9uID09PSAncnRsJykge1xuICAgIHggKz0gbWF4KGh0bWwuY2xpZW50V2lkdGgsIGJvZHkuY2xpZW50V2lkdGgpIC0gd2lkdGg7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgeCxcbiAgICB5XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFZpZXdwb3J0UmVjdChlbGVtZW50LCBzdHJhdGVneSkge1xuICBjb25zdCB3aW4gPSBnZXRXaW5kb3coZWxlbWVudCk7XG4gIGNvbnN0IGh0bWwgPSBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCk7XG4gIGNvbnN0IHZpc3VhbFZpZXdwb3J0ID0gd2luLnZpc3VhbFZpZXdwb3J0O1xuICBsZXQgd2lkdGggPSBodG1sLmNsaWVudFdpZHRoO1xuICBsZXQgaGVpZ2h0ID0gaHRtbC5jbGllbnRIZWlnaHQ7XG4gIGxldCB4ID0gMDtcbiAgbGV0IHkgPSAwO1xuICBpZiAodmlzdWFsVmlld3BvcnQpIHtcbiAgICB3aWR0aCA9IHZpc3VhbFZpZXdwb3J0LndpZHRoO1xuICAgIGhlaWdodCA9IHZpc3VhbFZpZXdwb3J0LmhlaWdodDtcbiAgICBjb25zdCB2aXN1YWxWaWV3cG9ydEJhc2VkID0gaXNXZWJLaXQoKTtcbiAgICBpZiAoIXZpc3VhbFZpZXdwb3J0QmFzZWQgfHwgdmlzdWFsVmlld3BvcnRCYXNlZCAmJiBzdHJhdGVneSA9PT0gJ2ZpeGVkJykge1xuICAgICAgeCA9IHZpc3VhbFZpZXdwb3J0Lm9mZnNldExlZnQ7XG4gICAgICB5ID0gdmlzdWFsVmlld3BvcnQub2Zmc2V0VG9wO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICB4LFxuICAgIHlcbiAgfTtcbn1cblxuLy8gUmV0dXJucyB0aGUgaW5uZXIgY2xpZW50IHJlY3QsIHN1YnRyYWN0aW5nIHNjcm9sbGJhcnMgaWYgcHJlc2VudC5cbmZ1bmN0aW9uIGdldElubmVyQm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQsIHN0cmF0ZWd5KSB7XG4gIGNvbnN0IGNsaWVudFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCwgdHJ1ZSwgc3RyYXRlZ3kgPT09ICdmaXhlZCcpO1xuICBjb25zdCB0b3AgPSBjbGllbnRSZWN0LnRvcCArIGVsZW1lbnQuY2xpZW50VG9wO1xuICBjb25zdCBsZWZ0ID0gY2xpZW50UmVjdC5sZWZ0ICsgZWxlbWVudC5jbGllbnRMZWZ0O1xuICBjb25zdCBzY2FsZSA9IGlzSFRNTEVsZW1lbnQoZWxlbWVudCkgPyBnZXRTY2FsZShlbGVtZW50KSA6IGNyZWF0ZUNvb3JkcygxKTtcbiAgY29uc3Qgd2lkdGggPSBlbGVtZW50LmNsaWVudFdpZHRoICogc2NhbGUueDtcbiAgY29uc3QgaGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQgKiBzY2FsZS55O1xuICBjb25zdCB4ID0gbGVmdCAqIHNjYWxlLng7XG4gIGNvbnN0IHkgPSB0b3AgKiBzY2FsZS55O1xuICByZXR1cm4ge1xuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICB4LFxuICAgIHlcbiAgfTtcbn1cbmZ1bmN0aW9uIGdldENsaWVudFJlY3RGcm9tQ2xpcHBpbmdBbmNlc3RvcihlbGVtZW50LCBjbGlwcGluZ0FuY2VzdG9yLCBzdHJhdGVneSkge1xuICBsZXQgcmVjdDtcbiAgaWYgKGNsaXBwaW5nQW5jZXN0b3IgPT09ICd2aWV3cG9ydCcpIHtcbiAgICByZWN0ID0gZ2V0Vmlld3BvcnRSZWN0KGVsZW1lbnQsIHN0cmF0ZWd5KTtcbiAgfSBlbHNlIGlmIChjbGlwcGluZ0FuY2VzdG9yID09PSAnZG9jdW1lbnQnKSB7XG4gICAgcmVjdCA9IGdldERvY3VtZW50UmVjdChnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkpO1xuICB9IGVsc2UgaWYgKGlzRWxlbWVudChjbGlwcGluZ0FuY2VzdG9yKSkge1xuICAgIHJlY3QgPSBnZXRJbm5lckJvdW5kaW5nQ2xpZW50UmVjdChjbGlwcGluZ0FuY2VzdG9yLCBzdHJhdGVneSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdmlzdWFsT2Zmc2V0cyA9IGdldFZpc3VhbE9mZnNldHMoZWxlbWVudCk7XG4gICAgcmVjdCA9IHtcbiAgICAgIHg6IGNsaXBwaW5nQW5jZXN0b3IueCAtIHZpc3VhbE9mZnNldHMueCxcbiAgICAgIHk6IGNsaXBwaW5nQW5jZXN0b3IueSAtIHZpc3VhbE9mZnNldHMueSxcbiAgICAgIHdpZHRoOiBjbGlwcGluZ0FuY2VzdG9yLndpZHRoLFxuICAgICAgaGVpZ2h0OiBjbGlwcGluZ0FuY2VzdG9yLmhlaWdodFxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHJlY3RUb0NsaWVudFJlY3QocmVjdCk7XG59XG5mdW5jdGlvbiBoYXNGaXhlZFBvc2l0aW9uQW5jZXN0b3IoZWxlbWVudCwgc3RvcE5vZGUpIHtcbiAgY29uc3QgcGFyZW50Tm9kZSA9IGdldFBhcmVudE5vZGUoZWxlbWVudCk7XG4gIGlmIChwYXJlbnROb2RlID09PSBzdG9wTm9kZSB8fCAhaXNFbGVtZW50KHBhcmVudE5vZGUpIHx8IGlzTGFzdFRyYXZlcnNhYmxlTm9kZShwYXJlbnROb2RlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gZ2V0Q29tcHV0ZWRTdHlsZShwYXJlbnROb2RlKS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJyB8fCBoYXNGaXhlZFBvc2l0aW9uQW5jZXN0b3IocGFyZW50Tm9kZSwgc3RvcE5vZGUpO1xufVxuXG4vLyBBIFwiY2xpcHBpbmcgYW5jZXN0b3JcIiBpcyBhbiBgb3ZlcmZsb3dgIGVsZW1lbnQgd2l0aCB0aGUgY2hhcmFjdGVyaXN0aWMgb2Zcbi8vIGNsaXBwaW5nIChvciBoaWRpbmcpIGNoaWxkIGVsZW1lbnRzLiBUaGlzIHJldHVybnMgYWxsIGNsaXBwaW5nIGFuY2VzdG9yc1xuLy8gb2YgdGhlIGdpdmVuIGVsZW1lbnQgdXAgdGhlIHRyZWUuXG5mdW5jdGlvbiBnZXRDbGlwcGluZ0VsZW1lbnRBbmNlc3RvcnMoZWxlbWVudCwgY2FjaGUpIHtcbiAgY29uc3QgY2FjaGVkUmVzdWx0ID0gY2FjaGUuZ2V0KGVsZW1lbnQpO1xuICBpZiAoY2FjaGVkUmVzdWx0KSB7XG4gICAgcmV0dXJuIGNhY2hlZFJlc3VsdDtcbiAgfVxuICBsZXQgcmVzdWx0ID0gZ2V0T3ZlcmZsb3dBbmNlc3RvcnMoZWxlbWVudCwgW10sIGZhbHNlKS5maWx0ZXIoZWwgPT4gaXNFbGVtZW50KGVsKSAmJiBnZXROb2RlTmFtZShlbCkgIT09ICdib2R5Jyk7XG4gIGxldCBjdXJyZW50Q29udGFpbmluZ0Jsb2NrQ29tcHV0ZWRTdHlsZSA9IG51bGw7XG4gIGNvbnN0IGVsZW1lbnRJc0ZpeGVkID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJztcbiAgbGV0IGN1cnJlbnROb2RlID0gZWxlbWVudElzRml4ZWQgPyBnZXRQYXJlbnROb2RlKGVsZW1lbnQpIDogZWxlbWVudDtcblxuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvQ29udGFpbmluZ19ibG9jayNpZGVudGlmeWluZ190aGVfY29udGFpbmluZ19ibG9ja1xuICB3aGlsZSAoaXNFbGVtZW50KGN1cnJlbnROb2RlKSAmJiAhaXNMYXN0VHJhdmVyc2FibGVOb2RlKGN1cnJlbnROb2RlKSkge1xuICAgIGNvbnN0IGNvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGN1cnJlbnROb2RlKTtcbiAgICBjb25zdCBjdXJyZW50Tm9kZUlzQ29udGFpbmluZyA9IGlzQ29udGFpbmluZ0Jsb2NrKGN1cnJlbnROb2RlKTtcbiAgICBpZiAoIWN1cnJlbnROb2RlSXNDb250YWluaW5nICYmIGNvbXB1dGVkU3R5bGUucG9zaXRpb24gPT09ICdmaXhlZCcpIHtcbiAgICAgIGN1cnJlbnRDb250YWluaW5nQmxvY2tDb21wdXRlZFN0eWxlID0gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc2hvdWxkRHJvcEN1cnJlbnROb2RlID0gZWxlbWVudElzRml4ZWQgPyAhY3VycmVudE5vZGVJc0NvbnRhaW5pbmcgJiYgIWN1cnJlbnRDb250YWluaW5nQmxvY2tDb21wdXRlZFN0eWxlIDogIWN1cnJlbnROb2RlSXNDb250YWluaW5nICYmIGNvbXB1dGVkU3R5bGUucG9zaXRpb24gPT09ICdzdGF0aWMnICYmICEhY3VycmVudENvbnRhaW5pbmdCbG9ja0NvbXB1dGVkU3R5bGUgJiYgWydhYnNvbHV0ZScsICdmaXhlZCddLmluY2x1ZGVzKGN1cnJlbnRDb250YWluaW5nQmxvY2tDb21wdXRlZFN0eWxlLnBvc2l0aW9uKSB8fCBpc092ZXJmbG93RWxlbWVudChjdXJyZW50Tm9kZSkgJiYgIWN1cnJlbnROb2RlSXNDb250YWluaW5nICYmIGhhc0ZpeGVkUG9zaXRpb25BbmNlc3RvcihlbGVtZW50LCBjdXJyZW50Tm9kZSk7XG4gICAgaWYgKHNob3VsZERyb3BDdXJyZW50Tm9kZSkge1xuICAgICAgLy8gRHJvcCBub24tY29udGFpbmluZyBibG9ja3MuXG4gICAgICByZXN1bHQgPSByZXN1bHQuZmlsdGVyKGFuY2VzdG9yID0+IGFuY2VzdG9yICE9PSBjdXJyZW50Tm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlY29yZCBsYXN0IGNvbnRhaW5pbmcgYmxvY2sgZm9yIG5leHQgaXRlcmF0aW9uLlxuICAgICAgY3VycmVudENvbnRhaW5pbmdCbG9ja0NvbXB1dGVkU3R5bGUgPSBjb21wdXRlZFN0eWxlO1xuICAgIH1cbiAgICBjdXJyZW50Tm9kZSA9IGdldFBhcmVudE5vZGUoY3VycmVudE5vZGUpO1xuICB9XG4gIGNhY2hlLnNldChlbGVtZW50LCByZXN1bHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vLyBHZXRzIHRoZSBtYXhpbXVtIGFyZWEgdGhhdCB0aGUgZWxlbWVudCBpcyB2aXNpYmxlIGluIGR1ZSB0byBhbnkgbnVtYmVyIG9mXG4vLyBjbGlwcGluZyBhbmNlc3RvcnMuXG5mdW5jdGlvbiBnZXRDbGlwcGluZ1JlY3QoX3JlZikge1xuICBsZXQge1xuICAgIGVsZW1lbnQsXG4gICAgYm91bmRhcnksXG4gICAgcm9vdEJvdW5kYXJ5LFxuICAgIHN0cmF0ZWd5XG4gIH0gPSBfcmVmO1xuICBjb25zdCBlbGVtZW50Q2xpcHBpbmdBbmNlc3RvcnMgPSBib3VuZGFyeSA9PT0gJ2NsaXBwaW5nQW5jZXN0b3JzJyA/IGlzVG9wTGF5ZXIoZWxlbWVudCkgPyBbXSA6IGdldENsaXBwaW5nRWxlbWVudEFuY2VzdG9ycyhlbGVtZW50LCB0aGlzLl9jKSA6IFtdLmNvbmNhdChib3VuZGFyeSk7XG4gIGNvbnN0IGNsaXBwaW5nQW5jZXN0b3JzID0gWy4uLmVsZW1lbnRDbGlwcGluZ0FuY2VzdG9ycywgcm9vdEJvdW5kYXJ5XTtcbiAgY29uc3QgZmlyc3RDbGlwcGluZ0FuY2VzdG9yID0gY2xpcHBpbmdBbmNlc3RvcnNbMF07XG4gIGNvbnN0IGNsaXBwaW5nUmVjdCA9IGNsaXBwaW5nQW5jZXN0b3JzLnJlZHVjZSgoYWNjUmVjdCwgY2xpcHBpbmdBbmNlc3RvcikgPT4ge1xuICAgIGNvbnN0IHJlY3QgPSBnZXRDbGllbnRSZWN0RnJvbUNsaXBwaW5nQW5jZXN0b3IoZWxlbWVudCwgY2xpcHBpbmdBbmNlc3Rvciwgc3RyYXRlZ3kpO1xuICAgIGFjY1JlY3QudG9wID0gbWF4KHJlY3QudG9wLCBhY2NSZWN0LnRvcCk7XG4gICAgYWNjUmVjdC5yaWdodCA9IG1pbihyZWN0LnJpZ2h0LCBhY2NSZWN0LnJpZ2h0KTtcbiAgICBhY2NSZWN0LmJvdHRvbSA9IG1pbihyZWN0LmJvdHRvbSwgYWNjUmVjdC5ib3R0b20pO1xuICAgIGFjY1JlY3QubGVmdCA9IG1heChyZWN0LmxlZnQsIGFjY1JlY3QubGVmdCk7XG4gICAgcmV0dXJuIGFjY1JlY3Q7XG4gIH0sIGdldENsaWVudFJlY3RGcm9tQ2xpcHBpbmdBbmNlc3RvcihlbGVtZW50LCBmaXJzdENsaXBwaW5nQW5jZXN0b3IsIHN0cmF0ZWd5KSk7XG4gIHJldHVybiB7XG4gICAgd2lkdGg6IGNsaXBwaW5nUmVjdC5yaWdodCAtIGNsaXBwaW5nUmVjdC5sZWZ0LFxuICAgIGhlaWdodDogY2xpcHBpbmdSZWN0LmJvdHRvbSAtIGNsaXBwaW5nUmVjdC50b3AsXG4gICAgeDogY2xpcHBpbmdSZWN0LmxlZnQsXG4gICAgeTogY2xpcHBpbmdSZWN0LnRvcFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXREaW1lbnNpb25zKGVsZW1lbnQpIHtcbiAgY29uc3Qge1xuICAgIHdpZHRoLFxuICAgIGhlaWdodFxuICB9ID0gZ2V0Q3NzRGltZW5zaW9ucyhlbGVtZW50KTtcbiAgcmV0dXJuIHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHRcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVjdFJlbGF0aXZlVG9PZmZzZXRQYXJlbnQoZWxlbWVudCwgb2Zmc2V0UGFyZW50LCBzdHJhdGVneSkge1xuICBjb25zdCBpc09mZnNldFBhcmVudEFuRWxlbWVudCA9IGlzSFRNTEVsZW1lbnQob2Zmc2V0UGFyZW50KTtcbiAgY29uc3QgZG9jdW1lbnRFbGVtZW50ID0gZ2V0RG9jdW1lbnRFbGVtZW50KG9mZnNldFBhcmVudCk7XG4gIGNvbnN0IGlzRml4ZWQgPSBzdHJhdGVneSA9PT0gJ2ZpeGVkJztcbiAgY29uc3QgcmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50LCB0cnVlLCBpc0ZpeGVkLCBvZmZzZXRQYXJlbnQpO1xuICBsZXQgc2Nyb2xsID0ge1xuICAgIHNjcm9sbExlZnQ6IDAsXG4gICAgc2Nyb2xsVG9wOiAwXG4gIH07XG4gIGNvbnN0IG9mZnNldHMgPSBjcmVhdGVDb29yZHMoMCk7XG5cbiAgLy8gSWYgdGhlIDxib2R5PiBzY3JvbGxiYXIgYXBwZWFycyBvbiB0aGUgbGVmdCAoZS5nLiBSVEwgc3lzdGVtcykuIFVzZVxuICAvLyBGaXJlZm94IHdpdGggbGF5b3V0LnNjcm9sbGJhci5zaWRlID0gMyBpbiBhYm91dDpjb25maWcgdG8gdGVzdCB0aGlzLlxuICBmdW5jdGlvbiBzZXRMZWZ0UlRMU2Nyb2xsYmFyT2Zmc2V0KCkge1xuICAgIG9mZnNldHMueCA9IGdldFdpbmRvd1Njcm9sbEJhclgoZG9jdW1lbnRFbGVtZW50KTtcbiAgfVxuICBpZiAoaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgfHwgIWlzT2Zmc2V0UGFyZW50QW5FbGVtZW50ICYmICFpc0ZpeGVkKSB7XG4gICAgaWYgKGdldE5vZGVOYW1lKG9mZnNldFBhcmVudCkgIT09ICdib2R5JyB8fCBpc092ZXJmbG93RWxlbWVudChkb2N1bWVudEVsZW1lbnQpKSB7XG4gICAgICBzY3JvbGwgPSBnZXROb2RlU2Nyb2xsKG9mZnNldFBhcmVudCk7XG4gICAgfVxuICAgIGlmIChpc09mZnNldFBhcmVudEFuRWxlbWVudCkge1xuICAgICAgY29uc3Qgb2Zmc2V0UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChvZmZzZXRQYXJlbnQsIHRydWUsIGlzRml4ZWQsIG9mZnNldFBhcmVudCk7XG4gICAgICBvZmZzZXRzLnggPSBvZmZzZXRSZWN0LnggKyBvZmZzZXRQYXJlbnQuY2xpZW50TGVmdDtcbiAgICAgIG9mZnNldHMueSA9IG9mZnNldFJlY3QueSArIG9mZnNldFBhcmVudC5jbGllbnRUb3A7XG4gICAgfSBlbHNlIGlmIChkb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgIHNldExlZnRSVExTY3JvbGxiYXJPZmZzZXQoKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzRml4ZWQgJiYgIWlzT2Zmc2V0UGFyZW50QW5FbGVtZW50ICYmIGRvY3VtZW50RWxlbWVudCkge1xuICAgIHNldExlZnRSVExTY3JvbGxiYXJPZmZzZXQoKTtcbiAgfVxuICBjb25zdCBodG1sT2Zmc2V0ID0gZG9jdW1lbnRFbGVtZW50ICYmICFpc09mZnNldFBhcmVudEFuRWxlbWVudCAmJiAhaXNGaXhlZCA/IGdldEhUTUxPZmZzZXQoZG9jdW1lbnRFbGVtZW50LCBzY3JvbGwpIDogY3JlYXRlQ29vcmRzKDApO1xuICBjb25zdCB4ID0gcmVjdC5sZWZ0ICsgc2Nyb2xsLnNjcm9sbExlZnQgLSBvZmZzZXRzLnggLSBodG1sT2Zmc2V0Lng7XG4gIGNvbnN0IHkgPSByZWN0LnRvcCArIHNjcm9sbC5zY3JvbGxUb3AgLSBvZmZzZXRzLnkgLSBodG1sT2Zmc2V0Lnk7XG4gIHJldHVybiB7XG4gICAgeCxcbiAgICB5LFxuICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgIGhlaWdodDogcmVjdC5oZWlnaHRcbiAgfTtcbn1cblxuZnVuY3Rpb24gaXNTdGF0aWNQb3NpdGlvbmVkKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkucG9zaXRpb24gPT09ICdzdGF0aWMnO1xufVxuXG5mdW5jdGlvbiBnZXRUcnVlT2Zmc2V0UGFyZW50KGVsZW1lbnQsIHBvbHlmaWxsKSB7XG4gIGlmICghaXNIVE1MRWxlbWVudChlbGVtZW50KSB8fCBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKHBvbHlmaWxsKSB7XG4gICAgcmV0dXJuIHBvbHlmaWxsKGVsZW1lbnQpO1xuICB9XG4gIGxldCByYXdPZmZzZXRQYXJlbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcblxuICAvLyBGaXJlZm94IHJldHVybnMgdGhlIDxodG1sPiBlbGVtZW50IGFzIHRoZSBvZmZzZXRQYXJlbnQgaWYgaXQncyBub24tc3RhdGljLFxuICAvLyB3aGlsZSBDaHJvbWUgYW5kIFNhZmFyaSByZXR1cm4gdGhlIDxib2R5PiBlbGVtZW50LiBUaGUgPGJvZHk+IGVsZW1lbnQgbXVzdFxuICAvLyBiZSB1c2VkIHRvIHBlcmZvcm0gdGhlIGNvcnJlY3QgY2FsY3VsYXRpb25zIGV2ZW4gaWYgdGhlIDxodG1sPiBlbGVtZW50IGlzXG4gIC8vIG5vbi1zdGF0aWMuXG4gIGlmIChnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkgPT09IHJhd09mZnNldFBhcmVudCkge1xuICAgIHJhd09mZnNldFBhcmVudCA9IHJhd09mZnNldFBhcmVudC5vd25lckRvY3VtZW50LmJvZHk7XG4gIH1cbiAgcmV0dXJuIHJhd09mZnNldFBhcmVudDtcbn1cblxuLy8gR2V0cyB0aGUgY2xvc2VzdCBhbmNlc3RvciBwb3NpdGlvbmVkIGVsZW1lbnQuIEhhbmRsZXMgc29tZSBlZGdlIGNhc2VzLFxuLy8gc3VjaCBhcyB0YWJsZSBhbmNlc3RvcnMgYW5kIGNyb3NzIGJyb3dzZXIgYnVncy5cbmZ1bmN0aW9uIGdldE9mZnNldFBhcmVudChlbGVtZW50LCBwb2x5ZmlsbCkge1xuICBjb25zdCB3aW4gPSBnZXRXaW5kb3coZWxlbWVudCk7XG4gIGlmIChpc1RvcExheWVyKGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIHdpbjtcbiAgfVxuICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICBsZXQgc3ZnT2Zmc2V0UGFyZW50ID0gZ2V0UGFyZW50Tm9kZShlbGVtZW50KTtcbiAgICB3aGlsZSAoc3ZnT2Zmc2V0UGFyZW50ICYmICFpc0xhc3RUcmF2ZXJzYWJsZU5vZGUoc3ZnT2Zmc2V0UGFyZW50KSkge1xuICAgICAgaWYgKGlzRWxlbWVudChzdmdPZmZzZXRQYXJlbnQpICYmICFpc1N0YXRpY1Bvc2l0aW9uZWQoc3ZnT2Zmc2V0UGFyZW50KSkge1xuICAgICAgICByZXR1cm4gc3ZnT2Zmc2V0UGFyZW50O1xuICAgICAgfVxuICAgICAgc3ZnT2Zmc2V0UGFyZW50ID0gZ2V0UGFyZW50Tm9kZShzdmdPZmZzZXRQYXJlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gd2luO1xuICB9XG4gIGxldCBvZmZzZXRQYXJlbnQgPSBnZXRUcnVlT2Zmc2V0UGFyZW50KGVsZW1lbnQsIHBvbHlmaWxsKTtcbiAgd2hpbGUgKG9mZnNldFBhcmVudCAmJiBpc1RhYmxlRWxlbWVudChvZmZzZXRQYXJlbnQpICYmIGlzU3RhdGljUG9zaXRpb25lZChvZmZzZXRQYXJlbnQpKSB7XG4gICAgb2Zmc2V0UGFyZW50ID0gZ2V0VHJ1ZU9mZnNldFBhcmVudChvZmZzZXRQYXJlbnQsIHBvbHlmaWxsKTtcbiAgfVxuICBpZiAob2Zmc2V0UGFyZW50ICYmIGlzTGFzdFRyYXZlcnNhYmxlTm9kZShvZmZzZXRQYXJlbnQpICYmIGlzU3RhdGljUG9zaXRpb25lZChvZmZzZXRQYXJlbnQpICYmICFpc0NvbnRhaW5pbmdCbG9jayhvZmZzZXRQYXJlbnQpKSB7XG4gICAgcmV0dXJuIHdpbjtcbiAgfVxuICByZXR1cm4gb2Zmc2V0UGFyZW50IHx8IGdldENvbnRhaW5pbmdCbG9jayhlbGVtZW50KSB8fCB3aW47XG59XG5cbmNvbnN0IGdldEVsZW1lbnRSZWN0cyA9IGFzeW5jIGZ1bmN0aW9uIChkYXRhKSB7XG4gIGNvbnN0IGdldE9mZnNldFBhcmVudEZuID0gdGhpcy5nZXRPZmZzZXRQYXJlbnQgfHwgZ2V0T2Zmc2V0UGFyZW50O1xuICBjb25zdCBnZXREaW1lbnNpb25zRm4gPSB0aGlzLmdldERpbWVuc2lvbnM7XG4gIGNvbnN0IGZsb2F0aW5nRGltZW5zaW9ucyA9IGF3YWl0IGdldERpbWVuc2lvbnNGbihkYXRhLmZsb2F0aW5nKTtcbiAgcmV0dXJuIHtcbiAgICByZWZlcmVuY2U6IGdldFJlY3RSZWxhdGl2ZVRvT2Zmc2V0UGFyZW50KGRhdGEucmVmZXJlbmNlLCBhd2FpdCBnZXRPZmZzZXRQYXJlbnRGbihkYXRhLmZsb2F0aW5nKSwgZGF0YS5zdHJhdGVneSksXG4gICAgZmxvYXRpbmc6IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwLFxuICAgICAgd2lkdGg6IGZsb2F0aW5nRGltZW5zaW9ucy53aWR0aCxcbiAgICAgIGhlaWdodDogZmxvYXRpbmdEaW1lbnNpb25zLmhlaWdodFxuICAgIH1cbiAgfTtcbn07XG5cbmZ1bmN0aW9uIGlzUlRMKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZGlyZWN0aW9uID09PSAncnRsJztcbn1cblxuY29uc3QgcGxhdGZvcm0gPSB7XG4gIGNvbnZlcnRPZmZzZXRQYXJlbnRSZWxhdGl2ZVJlY3RUb1ZpZXdwb3J0UmVsYXRpdmVSZWN0LFxuICBnZXREb2N1bWVudEVsZW1lbnQsXG4gIGdldENsaXBwaW5nUmVjdCxcbiAgZ2V0T2Zmc2V0UGFyZW50LFxuICBnZXRFbGVtZW50UmVjdHMsXG4gIGdldENsaWVudFJlY3RzLFxuICBnZXREaW1lbnNpb25zLFxuICBnZXRTY2FsZSxcbiAgaXNFbGVtZW50LFxuICBpc1JUTFxufTtcblxuZnVuY3Rpb24gcmVjdHNBcmVFcXVhbChhLCBiKSB7XG4gIHJldHVybiBhLnggPT09IGIueCAmJiBhLnkgPT09IGIueSAmJiBhLndpZHRoID09PSBiLndpZHRoICYmIGEuaGVpZ2h0ID09PSBiLmhlaWdodDtcbn1cblxuLy8gaHR0cHM6Ly9zYW10aG9yLmF1LzIwMjEvb2JzZXJ2aW5nLWRvbS9cbmZ1bmN0aW9uIG9ic2VydmVNb3ZlKGVsZW1lbnQsIG9uTW92ZSkge1xuICBsZXQgaW8gPSBudWxsO1xuICBsZXQgdGltZW91dElkO1xuICBjb25zdCByb290ID0gZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpO1xuICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgIHZhciBfaW87XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgKF9pbyA9IGlvKSA9PSBudWxsIHx8IF9pby5kaXNjb25uZWN0KCk7XG4gICAgaW8gPSBudWxsO1xuICB9XG4gIGZ1bmN0aW9uIHJlZnJlc2goc2tpcCwgdGhyZXNob2xkKSB7XG4gICAgaWYgKHNraXAgPT09IHZvaWQgMCkge1xuICAgICAgc2tpcCA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGhyZXNob2xkID09PSB2b2lkIDApIHtcbiAgICAgIHRocmVzaG9sZCA9IDE7XG4gICAgfVxuICAgIGNsZWFudXAoKTtcbiAgICBjb25zdCBlbGVtZW50UmVjdEZvclJvb3RNYXJnaW4gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHtcbiAgICAgIGxlZnQsXG4gICAgICB0b3AsXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodFxuICAgIH0gPSBlbGVtZW50UmVjdEZvclJvb3RNYXJnaW47XG4gICAgaWYgKCFza2lwKSB7XG4gICAgICBvbk1vdmUoKTtcbiAgICB9XG4gICAgaWYgKCF3aWR0aCB8fCAhaGVpZ2h0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGluc2V0VG9wID0gZmxvb3IodG9wKTtcbiAgICBjb25zdCBpbnNldFJpZ2h0ID0gZmxvb3Iocm9vdC5jbGllbnRXaWR0aCAtIChsZWZ0ICsgd2lkdGgpKTtcbiAgICBjb25zdCBpbnNldEJvdHRvbSA9IGZsb29yKHJvb3QuY2xpZW50SGVpZ2h0IC0gKHRvcCArIGhlaWdodCkpO1xuICAgIGNvbnN0IGluc2V0TGVmdCA9IGZsb29yKGxlZnQpO1xuICAgIGNvbnN0IHJvb3RNYXJnaW4gPSAtaW5zZXRUb3AgKyBcInB4IFwiICsgLWluc2V0UmlnaHQgKyBcInB4IFwiICsgLWluc2V0Qm90dG9tICsgXCJweCBcIiArIC1pbnNldExlZnQgKyBcInB4XCI7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIHJvb3RNYXJnaW4sXG4gICAgICB0aHJlc2hvbGQ6IG1heCgwLCBtaW4oMSwgdGhyZXNob2xkKSkgfHwgMVxuICAgIH07XG4gICAgbGV0IGlzRmlyc3RVcGRhdGUgPSB0cnVlO1xuICAgIGZ1bmN0aW9uIGhhbmRsZU9ic2VydmUoZW50cmllcykge1xuICAgICAgY29uc3QgcmF0aW8gPSBlbnRyaWVzWzBdLmludGVyc2VjdGlvblJhdGlvO1xuICAgICAgaWYgKHJhdGlvICE9PSB0aHJlc2hvbGQpIHtcbiAgICAgICAgaWYgKCFpc0ZpcnN0VXBkYXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHJlZnJlc2goKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJhdGlvKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIHJlZmVyZW5jZSBpcyBjbGlwcGVkLCB0aGUgcmF0aW8gaXMgMC4gVGhyb3R0bGUgdGhlIHJlZnJlc2hcbiAgICAgICAgICAvLyB0byBwcmV2ZW50IGFuIGluZmluaXRlIGxvb3Agb2YgdXBkYXRlcy5cbiAgICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHJlZnJlc2goZmFsc2UsIDFlLTcpO1xuICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZnJlc2goZmFsc2UsIHJhdGlvKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJhdGlvID09PSAxICYmICFyZWN0c0FyZUVxdWFsKGVsZW1lbnRSZWN0Rm9yUm9vdE1hcmdpbiwgZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSkpIHtcbiAgICAgICAgLy8gSXQncyBwb3NzaWJsZSB0aGF0IGV2ZW4gdGhvdWdoIHRoZSByYXRpbyBpcyByZXBvcnRlZCBhcyAxLCB0aGVcbiAgICAgICAgLy8gZWxlbWVudCBpcyBub3QgYWN0dWFsbHkgZnVsbHkgd2l0aGluIHRoZSBJbnRlcnNlY3Rpb25PYnNlcnZlcidzIHJvb3RcbiAgICAgICAgLy8gYXJlYSBhbnltb3JlLiBUaGlzIGNhbiBoYXBwZW4gdW5kZXIgcGVyZm9ybWFuY2UgY29uc3RyYWludHMuIFRoaXMgbWF5XG4gICAgICAgIC8vIGJlIGEgYnVnIGluIHRoZSBicm93c2VyJ3MgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24uIFRvXG4gICAgICAgIC8vIHdvcmsgYXJvdW5kIHRoaXMsIHdlIGNvbXBhcmUgdGhlIGVsZW1lbnQncyBib3VuZGluZyByZWN0IG5vdyB3aXRoXG4gICAgICAgIC8vIHdoYXQgaXQgd2FzIGF0IHRoZSB0aW1lIHdlIGNyZWF0ZWQgdGhlIEludGVyc2VjdGlvbk9ic2VydmVyLiBJZiB0aGV5XG4gICAgICAgIC8vIGFyZSBub3QgZXF1YWwgdGhlbiB0aGUgZWxlbWVudCBtb3ZlZCwgc28gd2UgcmVmcmVzaC5cbiAgICAgICAgcmVmcmVzaCgpO1xuICAgICAgfVxuICAgICAgaXNGaXJzdFVwZGF0ZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIE9sZGVyIGJyb3dzZXJzIGRvbid0IHN1cHBvcnQgYSBgZG9jdW1lbnRgIGFzIHRoZSByb290IGFuZCB3aWxsIHRocm93IGFuXG4gICAgLy8gZXJyb3IuXG4gICAgdHJ5IHtcbiAgICAgIGlvID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGhhbmRsZU9ic2VydmUsIHtcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgLy8gSGFuZGxlIDxpZnJhbWU+c1xuICAgICAgICByb290OiByb290Lm93bmVyRG9jdW1lbnRcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKF9lKSB7XG4gICAgICBpbyA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihoYW5kbGVPYnNlcnZlLCBvcHRpb25zKTtcbiAgICB9XG4gICAgaW8ub2JzZXJ2ZShlbGVtZW50KTtcbiAgfVxuICByZWZyZXNoKHRydWUpO1xuICByZXR1cm4gY2xlYW51cDtcbn1cblxuLyoqXG4gKiBBdXRvbWF0aWNhbGx5IHVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBmbG9hdGluZyBlbGVtZW50IHdoZW4gbmVjZXNzYXJ5LlxuICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIHdoZW4gdGhlIGZsb2F0aW5nIGVsZW1lbnQgaXMgbW91bnRlZCBvbiB0aGUgRE9NIG9yXG4gKiB2aXNpYmxlIG9uIHRoZSBzY3JlZW4uXG4gKiBAcmV0dXJucyBjbGVhbnVwIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGludm9rZWQgd2hlbiB0aGUgZmxvYXRpbmcgZWxlbWVudCBpc1xuICogcmVtb3ZlZCBmcm9tIHRoZSBET00gb3IgaGlkZGVuIGZyb20gdGhlIHNjcmVlbi5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy9hdXRvVXBkYXRlXG4gKi9cbmZ1bmN0aW9uIGF1dG9VcGRhdGUocmVmZXJlbmNlLCBmbG9hdGluZywgdXBkYXRlLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgY29uc3Qge1xuICAgIGFuY2VzdG9yU2Nyb2xsID0gdHJ1ZSxcbiAgICBhbmNlc3RvclJlc2l6ZSA9IHRydWUsXG4gICAgZWxlbWVudFJlc2l6ZSA9IHR5cGVvZiBSZXNpemVPYnNlcnZlciA9PT0gJ2Z1bmN0aW9uJyxcbiAgICBsYXlvdXRTaGlmdCA9IHR5cGVvZiBJbnRlcnNlY3Rpb25PYnNlcnZlciA9PT0gJ2Z1bmN0aW9uJyxcbiAgICBhbmltYXRpb25GcmFtZSA9IGZhbHNlXG4gIH0gPSBvcHRpb25zO1xuICBjb25zdCByZWZlcmVuY2VFbCA9IHVud3JhcEVsZW1lbnQocmVmZXJlbmNlKTtcbiAgY29uc3QgYW5jZXN0b3JzID0gYW5jZXN0b3JTY3JvbGwgfHwgYW5jZXN0b3JSZXNpemUgPyBbLi4uKHJlZmVyZW5jZUVsID8gZ2V0T3ZlcmZsb3dBbmNlc3RvcnMocmVmZXJlbmNlRWwpIDogW10pLCAuLi5nZXRPdmVyZmxvd0FuY2VzdG9ycyhmbG9hdGluZyldIDogW107XG4gIGFuY2VzdG9ycy5mb3JFYWNoKGFuY2VzdG9yID0+IHtcbiAgICBhbmNlc3RvclNjcm9sbCAmJiBhbmNlc3Rvci5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGUsIHtcbiAgICAgIHBhc3NpdmU6IHRydWVcbiAgICB9KTtcbiAgICBhbmNlc3RvclJlc2l6ZSAmJiBhbmNlc3Rvci5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGUpO1xuICB9KTtcbiAgY29uc3QgY2xlYW51cElvID0gcmVmZXJlbmNlRWwgJiYgbGF5b3V0U2hpZnQgPyBvYnNlcnZlTW92ZShyZWZlcmVuY2VFbCwgdXBkYXRlKSA6IG51bGw7XG4gIGxldCByZW9ic2VydmVGcmFtZSA9IC0xO1xuICBsZXQgcmVzaXplT2JzZXJ2ZXIgPSBudWxsO1xuICBpZiAoZWxlbWVudFJlc2l6ZSkge1xuICAgIHJlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKF9yZWYgPT4ge1xuICAgICAgbGV0IFtmaXJzdEVudHJ5XSA9IF9yZWY7XG4gICAgICBpZiAoZmlyc3RFbnRyeSAmJiBmaXJzdEVudHJ5LnRhcmdldCA9PT0gcmVmZXJlbmNlRWwgJiYgcmVzaXplT2JzZXJ2ZXIpIHtcbiAgICAgICAgLy8gUHJldmVudCB1cGRhdGUgbG9vcHMgd2hlbiB1c2luZyB0aGUgYHNpemVgIG1pZGRsZXdhcmUuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mbG9hdGluZy11aS9mbG9hdGluZy11aS9pc3N1ZXMvMTc0MFxuICAgICAgICByZXNpemVPYnNlcnZlci51bm9ic2VydmUoZmxvYXRpbmcpO1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShyZW9ic2VydmVGcmFtZSk7XG4gICAgICAgIHJlb2JzZXJ2ZUZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICB2YXIgX3Jlc2l6ZU9ic2VydmVyO1xuICAgICAgICAgIChfcmVzaXplT2JzZXJ2ZXIgPSByZXNpemVPYnNlcnZlcikgPT0gbnVsbCB8fCBfcmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZShmbG9hdGluZyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdXBkYXRlKCk7XG4gICAgfSk7XG4gICAgaWYgKHJlZmVyZW5jZUVsICYmICFhbmltYXRpb25GcmFtZSkge1xuICAgICAgcmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZShyZWZlcmVuY2VFbCk7XG4gICAgfVxuICAgIHJlc2l6ZU9ic2VydmVyLm9ic2VydmUoZmxvYXRpbmcpO1xuICB9XG4gIGxldCBmcmFtZUlkO1xuICBsZXQgcHJldlJlZlJlY3QgPSBhbmltYXRpb25GcmFtZSA/IGdldEJvdW5kaW5nQ2xpZW50UmVjdChyZWZlcmVuY2UpIDogbnVsbDtcbiAgaWYgKGFuaW1hdGlvbkZyYW1lKSB7XG4gICAgZnJhbWVMb29wKCk7XG4gIH1cbiAgZnVuY3Rpb24gZnJhbWVMb29wKCkge1xuICAgIGNvbnN0IG5leHRSZWZSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KHJlZmVyZW5jZSk7XG4gICAgaWYgKHByZXZSZWZSZWN0ICYmICFyZWN0c0FyZUVxdWFsKHByZXZSZWZSZWN0LCBuZXh0UmVmUmVjdCkpIHtcbiAgICAgIHVwZGF0ZSgpO1xuICAgIH1cbiAgICBwcmV2UmVmUmVjdCA9IG5leHRSZWZSZWN0O1xuICAgIGZyYW1lSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnJhbWVMb29wKTtcbiAgfVxuICB1cGRhdGUoKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICB2YXIgX3Jlc2l6ZU9ic2VydmVyMjtcbiAgICBhbmNlc3RvcnMuZm9yRWFjaChhbmNlc3RvciA9PiB7XG4gICAgICBhbmNlc3RvclNjcm9sbCAmJiBhbmNlc3Rvci5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB1cGRhdGUpO1xuICAgICAgYW5jZXN0b3JSZXNpemUgJiYgYW5jZXN0b3IucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdXBkYXRlKTtcbiAgICB9KTtcbiAgICBjbGVhbnVwSW8gPT0gbnVsbCB8fCBjbGVhbnVwSW8oKTtcbiAgICAoX3Jlc2l6ZU9ic2VydmVyMiA9IHJlc2l6ZU9ic2VydmVyKSA9PSBudWxsIHx8IF9yZXNpemVPYnNlcnZlcjIuZGlzY29ubmVjdCgpO1xuICAgIHJlc2l6ZU9ic2VydmVyID0gbnVsbDtcbiAgICBpZiAoYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGZyYW1lSWQpO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBSZXNvbHZlcyB3aXRoIGFuIG9iamVjdCBvZiBvdmVyZmxvdyBzaWRlIG9mZnNldHMgdGhhdCBkZXRlcm1pbmUgaG93IG11Y2ggdGhlXG4gKiBlbGVtZW50IGlzIG92ZXJmbG93aW5nIGEgZ2l2ZW4gY2xpcHBpbmcgYm91bmRhcnkgb24gZWFjaCBzaWRlLlxuICogLSBwb3NpdGl2ZSA9IG92ZXJmbG93aW5nIHRoZSBib3VuZGFyeSBieSB0aGF0IG51bWJlciBvZiBwaXhlbHNcbiAqIC0gbmVnYXRpdmUgPSBob3cgbWFueSBwaXhlbHMgbGVmdCBiZWZvcmUgaXQgd2lsbCBvdmVyZmxvd1xuICogLSAwID0gbGllcyBmbHVzaCB3aXRoIHRoZSBib3VuZGFyeVxuICogQHNlZSBodHRwczovL2Zsb2F0aW5nLXVpLmNvbS9kb2NzL2RldGVjdE92ZXJmbG93XG4gKi9cbmNvbnN0IGRldGVjdE92ZXJmbG93ID0gZGV0ZWN0T3ZlcmZsb3ckMTtcblxuLyoqXG4gKiBNb2RpZmllcyB0aGUgcGxhY2VtZW50IGJ5IHRyYW5zbGF0aW5nIHRoZSBmbG9hdGluZyBlbGVtZW50IGFsb25nIHRoZVxuICogc3BlY2lmaWVkIGF4ZXMuXG4gKiBBIG51bWJlciAoc2hvcnRoYW5kIGZvciBgbWFpbkF4aXNgIG9yIGRpc3RhbmNlKSwgb3IgYW4gYXhlcyBjb25maWd1cmF0aW9uXG4gKiBvYmplY3QgbWF5IGJlIHBhc3NlZC5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy9vZmZzZXRcbiAqL1xuY29uc3Qgb2Zmc2V0ID0gb2Zmc2V0JDE7XG5cbi8qKlxuICogT3B0aW1pemVzIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBmbG9hdGluZyBlbGVtZW50IGJ5IGNob29zaW5nIHRoZSBwbGFjZW1lbnRcbiAqIHRoYXQgaGFzIHRoZSBtb3N0IHNwYWNlIGF2YWlsYWJsZSBhdXRvbWF0aWNhbGx5LCB3aXRob3V0IG5lZWRpbmcgdG8gc3BlY2lmeSBhXG4gKiBwcmVmZXJyZWQgcGxhY2VtZW50LiBBbHRlcm5hdGl2ZSB0byBgZmxpcGAuXG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3MvYXV0b1BsYWNlbWVudFxuICovXG5jb25zdCBhdXRvUGxhY2VtZW50ID0gYXV0b1BsYWNlbWVudCQxO1xuXG4vKipcbiAqIE9wdGltaXplcyB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgZmxvYXRpbmcgZWxlbWVudCBieSBzaGlmdGluZyBpdCBpbiBvcmRlciB0b1xuICoga2VlcCBpdCBpbiB2aWV3IHdoZW4gaXQgd2lsbCBvdmVyZmxvdyB0aGUgY2xpcHBpbmcgYm91bmRhcnkuXG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3Mvc2hpZnRcbiAqL1xuY29uc3Qgc2hpZnQgPSBzaGlmdCQxO1xuXG4vKipcbiAqIE9wdGltaXplcyB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgZmxvYXRpbmcgZWxlbWVudCBieSBmbGlwcGluZyB0aGUgYHBsYWNlbWVudGBcbiAqIGluIG9yZGVyIHRvIGtlZXAgaXQgaW4gdmlldyB3aGVuIHRoZSBwcmVmZXJyZWQgcGxhY2VtZW50KHMpIHdpbGwgb3ZlcmZsb3cgdGhlXG4gKiBjbGlwcGluZyBib3VuZGFyeS4gQWx0ZXJuYXRpdmUgdG8gYGF1dG9QbGFjZW1lbnRgLlxuICogQHNlZSBodHRwczovL2Zsb2F0aW5nLXVpLmNvbS9kb2NzL2ZsaXBcbiAqL1xuY29uc3QgZmxpcCA9IGZsaXAkMTtcblxuLyoqXG4gKiBQcm92aWRlcyBkYXRhIHRoYXQgYWxsb3dzIHlvdSB0byBjaGFuZ2UgdGhlIHNpemUgb2YgdGhlIGZsb2F0aW5nIGVsZW1lbnQgXHUyMDE0XG4gKiBmb3IgaW5zdGFuY2UsIHByZXZlbnQgaXQgZnJvbSBvdmVyZmxvd2luZyB0aGUgY2xpcHBpbmcgYm91bmRhcnkgb3IgbWF0Y2ggdGhlXG4gKiB3aWR0aCBvZiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQuXG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3Mvc2l6ZVxuICovXG5jb25zdCBzaXplID0gc2l6ZSQxO1xuXG4vKipcbiAqIFByb3ZpZGVzIGRhdGEgdG8gaGlkZSB0aGUgZmxvYXRpbmcgZWxlbWVudCBpbiBhcHBsaWNhYmxlIHNpdHVhdGlvbnMsIHN1Y2ggYXNcbiAqIHdoZW4gaXQgaXMgbm90IGluIHRoZSBzYW1lIGNsaXBwaW5nIGNvbnRleHQgYXMgdGhlIHJlZmVyZW5jZSBlbGVtZW50LlxuICogQHNlZSBodHRwczovL2Zsb2F0aW5nLXVpLmNvbS9kb2NzL2hpZGVcbiAqL1xuY29uc3QgaGlkZSA9IGhpZGUkMTtcblxuLyoqXG4gKiBQcm92aWRlcyBkYXRhIHRvIHBvc2l0aW9uIGFuIGlubmVyIGVsZW1lbnQgb2YgdGhlIGZsb2F0aW5nIGVsZW1lbnQgc28gdGhhdCBpdFxuICogYXBwZWFycyBjZW50ZXJlZCB0byB0aGUgcmVmZXJlbmNlIGVsZW1lbnQuXG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3MvYXJyb3dcbiAqL1xuY29uc3QgYXJyb3cgPSBhcnJvdyQxO1xuXG4vKipcbiAqIFByb3ZpZGVzIGltcHJvdmVkIHBvc2l0aW9uaW5nIGZvciBpbmxpbmUgcmVmZXJlbmNlIGVsZW1lbnRzIHRoYXQgY2FuIHNwYW5cbiAqIG92ZXIgbXVsdGlwbGUgbGluZXMsIHN1Y2ggYXMgaHlwZXJsaW5rcyBvciByYW5nZSBzZWxlY3Rpb25zLlxuICogQHNlZSBodHRwczovL2Zsb2F0aW5nLXVpLmNvbS9kb2NzL2lubGluZVxuICovXG5jb25zdCBpbmxpbmUgPSBpbmxpbmUkMTtcblxuLyoqXG4gKiBCdWlsdC1pbiBgbGltaXRlcmAgdGhhdCB3aWxsIHN0b3AgYHNoaWZ0KClgIGF0IGEgY2VydGFpbiBwb2ludC5cbiAqL1xuY29uc3QgbGltaXRTaGlmdCA9IGxpbWl0U2hpZnQkMTtcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgYHhgIGFuZCBgeWAgY29vcmRpbmF0ZXMgdGhhdCB3aWxsIHBsYWNlIHRoZSBmbG9hdGluZyBlbGVtZW50XG4gKiBuZXh0IHRvIGEgZ2l2ZW4gcmVmZXJlbmNlIGVsZW1lbnQuXG4gKi9cbmNvbnN0IGNvbXB1dGVQb3NpdGlvbiA9IChyZWZlcmVuY2UsIGZsb2F0aW5nLCBvcHRpb25zKSA9PiB7XG4gIC8vIFRoaXMgY2FjaGVzIHRoZSBleHBlbnNpdmUgYGdldENsaXBwaW5nRWxlbWVudEFuY2VzdG9yc2AgZnVuY3Rpb24gc28gdGhhdFxuICAvLyBtdWx0aXBsZSBsaWZlY3ljbGUgcmVzZXRzIHJlLXVzZSB0aGUgc2FtZSByZXN1bHQuIEl0IG9ubHkgbGl2ZXMgZm9yIGFcbiAgLy8gc2luZ2xlIGNhbGwuIElmIG90aGVyIGZ1bmN0aW9ucyBiZWNvbWUgZXhwZW5zaXZlLCB3ZSBjYW4gYWRkIHRoZW0gYXMgd2VsbC5cbiAgY29uc3QgY2FjaGUgPSBuZXcgTWFwKCk7XG4gIGNvbnN0IG1lcmdlZE9wdGlvbnMgPSB7XG4gICAgcGxhdGZvcm0sXG4gICAgLi4ub3B0aW9uc1xuICB9O1xuICBjb25zdCBwbGF0Zm9ybVdpdGhDYWNoZSA9IHtcbiAgICAuLi5tZXJnZWRPcHRpb25zLnBsYXRmb3JtLFxuICAgIF9jOiBjYWNoZVxuICB9O1xuICByZXR1cm4gY29tcHV0ZVBvc2l0aW9uJDEocmVmZXJlbmNlLCBmbG9hdGluZywge1xuICAgIC4uLm1lcmdlZE9wdGlvbnMsXG4gICAgcGxhdGZvcm06IHBsYXRmb3JtV2l0aENhY2hlXG4gIH0pO1xufTtcblxuZXhwb3J0IHsgYXJyb3csIGF1dG9QbGFjZW1lbnQsIGF1dG9VcGRhdGUsIGNvbXB1dGVQb3NpdGlvbiwgZGV0ZWN0T3ZlcmZsb3csIGZsaXAsIGhpZGUsIGlubGluZSwgbGltaXRTaGlmdCwgb2Zmc2V0LCBwbGF0Zm9ybSwgc2hpZnQsIHNpemUgfTtcbiIsICJpbXBvcnQgeyBjb21wdXRlUG9zaXRpb24sIGZsaXAsIHNoaWZ0LCBvZmZzZXQgfSBmcm9tICdAZmxvYXRpbmctdWkvZG9tJ1xuXG4vLyBIZWxwZXIgZnVuY3Rpb24gdG8gY2hlY2sgaWYgYSB2YWx1ZSBpcyBudWxsLCB1bmRlZmluZWQsIG9yIGFuIGVtcHR5IHN0cmluZ1xuZnVuY3Rpb24gYmxhbmsodmFsdWUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICB2YWx1ZSA9PT0gbnVsbCB8fFxuICAgICAgICB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIHZhbHVlID09PSAnJyB8fFxuICAgICAgICAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkgPT09ICcnKVxuICAgIClcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIGEgdmFsdWUgaXMgbm90IG51bGwsIG5vdCB1bmRlZmluZWQsIGFuZCBub3QgYW4gZW1wdHkgc3RyaW5nXG5mdW5jdGlvbiBmaWxsZWQodmFsdWUpIHtcbiAgICByZXR1cm4gIWJsYW5rKHZhbHVlKVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZWxlY3RGb3JtQ29tcG9uZW50KHtcbiAgICBjYW5TZWxlY3RQbGFjZWhvbGRlcixcbiAgICBpc0h0bWxBbGxvd2VkLFxuICAgIGdldE9wdGlvbkxhYmVsVXNpbmcsXG4gICAgZ2V0T3B0aW9uTGFiZWxzVXNpbmcsXG4gICAgZ2V0T3B0aW9uc1VzaW5nLFxuICAgIGdldFNlYXJjaFJlc3VsdHNVc2luZyxcbiAgICBpbml0aWFsT3B0aW9uTGFiZWwsXG4gICAgaW5pdGlhbE9wdGlvbkxhYmVscyxcbiAgICBpbml0aWFsU3RhdGUsXG4gICAgaXNBdXRvZm9jdXNlZCxcbiAgICBpc0Rpc2FibGVkLFxuICAgIGlzTXVsdGlwbGUsXG4gICAgaXNTZWFyY2hhYmxlLFxuICAgIGhhc0R5bmFtaWNPcHRpb25zLFxuICAgIGhhc0R5bmFtaWNTZWFyY2hSZXN1bHRzLFxuICAgIGxpdmV3aXJlSWQsXG4gICAgbG9hZGluZ01lc3NhZ2UsXG4gICAgbWF4SXRlbXMsXG4gICAgbWF4SXRlbXNNZXNzYWdlLFxuICAgIG5vU2VhcmNoUmVzdWx0c01lc3NhZ2UsXG4gICAgb3B0aW9ucyxcbiAgICBvcHRpb25zTGltaXQsXG4gICAgcGxhY2Vob2xkZXIsXG4gICAgcG9zaXRpb24sXG4gICAgc2VhcmNoRGVib3VuY2UsXG4gICAgc2VhcmNoaW5nTWVzc2FnZSxcbiAgICBzZWFyY2hQcm9tcHQsXG4gICAgc2VhcmNoYWJsZU9wdGlvbkZpZWxkcyxcbiAgICBzdGF0ZSxcbiAgICBzdGF0ZVBhdGgsXG59KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIHNlbGVjdDogbnVsbCxcblxuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3QgPSBuZXcgQ3VzdG9tU2VsZWN0KHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRyZWZzLnNlbGVjdCxcbiAgICAgICAgICAgICAgICBvcHRpb25zLFxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgIHN0YXRlOiB0aGlzLnN0YXRlLFxuICAgICAgICAgICAgICAgIGNhblNlbGVjdFBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgICAgIGluaXRpYWxPcHRpb25MYWJlbCxcbiAgICAgICAgICAgICAgICBpbml0aWFsT3B0aW9uTGFiZWxzLFxuICAgICAgICAgICAgICAgIGluaXRpYWxTdGF0ZSxcbiAgICAgICAgICAgICAgICBpc0h0bWxBbGxvd2VkLFxuICAgICAgICAgICAgICAgIGlzQXV0b2ZvY3VzZWQsXG4gICAgICAgICAgICAgICAgaXNEaXNhYmxlZCxcbiAgICAgICAgICAgICAgICBpc011bHRpcGxlLFxuICAgICAgICAgICAgICAgIGlzU2VhcmNoYWJsZSxcbiAgICAgICAgICAgICAgICBnZXRPcHRpb25MYWJlbFVzaW5nLFxuICAgICAgICAgICAgICAgIGdldE9wdGlvbkxhYmVsc1VzaW5nLFxuICAgICAgICAgICAgICAgIGdldE9wdGlvbnNVc2luZyxcbiAgICAgICAgICAgICAgICBnZXRTZWFyY2hSZXN1bHRzVXNpbmcsXG4gICAgICAgICAgICAgICAgaGFzRHluYW1pY09wdGlvbnMsXG4gICAgICAgICAgICAgICAgaGFzRHluYW1pY1NlYXJjaFJlc3VsdHMsXG4gICAgICAgICAgICAgICAgc2VhcmNoUHJvbXB0LFxuICAgICAgICAgICAgICAgIHNlYXJjaERlYm91bmNlLFxuICAgICAgICAgICAgICAgIGxvYWRpbmdNZXNzYWdlLFxuICAgICAgICAgICAgICAgIHNlYXJjaGluZ01lc3NhZ2UsXG4gICAgICAgICAgICAgICAgbm9TZWFyY2hSZXN1bHRzTWVzc2FnZSxcbiAgICAgICAgICAgICAgICBtYXhJdGVtcyxcbiAgICAgICAgICAgICAgICBtYXhJdGVtc01lc3NhZ2UsXG4gICAgICAgICAgICAgICAgb3B0aW9uc0xpbWl0LFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLFxuICAgICAgICAgICAgICAgIHNlYXJjaGFibGVPcHRpb25GaWVsZHMsXG4gICAgICAgICAgICAgICAgbGl2ZXdpcmVJZCxcbiAgICAgICAgICAgICAgICBzdGF0ZVBhdGgsXG4gICAgICAgICAgICAgICAgb25TdGF0ZUNoYW5nZTogKG5ld1N0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBuZXdTdGF0ZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0aGlzLiR3YXRjaCgnc3RhdGUnLCAobmV3U3RhdGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3QgJiYgdGhpcy5zZWxlY3Quc3RhdGUgIT09IG5ld1N0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0LnN0YXRlID0gbmV3U3RhdGVcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3QudXBkYXRlU2VsZWN0ZWREaXNwbGF5KClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3QucmVuZGVyT3B0aW9ucygpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3QuZGVzdHJveSgpXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3QgPSBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfVxufVxuXG5jbGFzcyBDdXN0b21TZWxlY3Qge1xuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAgZWxlbWVudCxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgcGxhY2Vob2xkZXIsXG4gICAgICAgIHN0YXRlLFxuICAgICAgICBjYW5TZWxlY3RQbGFjZWhvbGRlciA9IHRydWUsXG4gICAgICAgIGluaXRpYWxPcHRpb25MYWJlbCA9IG51bGwsXG4gICAgICAgIGluaXRpYWxPcHRpb25MYWJlbHMgPSBudWxsLFxuICAgICAgICBpbml0aWFsU3RhdGUgPSBudWxsLFxuICAgICAgICBpc0h0bWxBbGxvd2VkID0gZmFsc2UsXG4gICAgICAgIGlzQXV0b2ZvY3VzZWQgPSBmYWxzZSxcbiAgICAgICAgaXNEaXNhYmxlZCA9IGZhbHNlLFxuICAgICAgICBpc011bHRpcGxlID0gZmFsc2UsXG4gICAgICAgIGlzU2VhcmNoYWJsZSA9IGZhbHNlLFxuICAgICAgICBnZXRPcHRpb25MYWJlbFVzaW5nID0gbnVsbCxcbiAgICAgICAgZ2V0T3B0aW9uTGFiZWxzVXNpbmcgPSBudWxsLFxuICAgICAgICBnZXRPcHRpb25zVXNpbmcgPSBudWxsLFxuICAgICAgICBnZXRTZWFyY2hSZXN1bHRzVXNpbmcgPSBudWxsLFxuICAgICAgICBoYXNEeW5hbWljT3B0aW9ucyA9IGZhbHNlLFxuICAgICAgICBoYXNEeW5hbWljU2VhcmNoUmVzdWx0cyA9IHRydWUsXG4gICAgICAgIHNlYXJjaFByb21wdCA9ICdTZWFyY2guLi4nLFxuICAgICAgICBzZWFyY2hEZWJvdW5jZSA9IDEwMDAsXG4gICAgICAgIGxvYWRpbmdNZXNzYWdlID0gJ0xvYWRpbmcuLi4nLFxuICAgICAgICBzZWFyY2hpbmdNZXNzYWdlID0gJ1NlYXJjaGluZy4uLicsXG4gICAgICAgIG5vU2VhcmNoUmVzdWx0c01lc3NhZ2UgPSAnTm8gcmVzdWx0cyBmb3VuZCcsXG4gICAgICAgIG1heEl0ZW1zID0gbnVsbCxcbiAgICAgICAgbWF4SXRlbXNNZXNzYWdlID0gJ01heGltdW0gbnVtYmVyIG9mIGl0ZW1zIHNlbGVjdGVkJyxcbiAgICAgICAgb3B0aW9uc0xpbWl0ID0gbnVsbCxcbiAgICAgICAgcG9zaXRpb24gPSBudWxsLFxuICAgICAgICBzZWFyY2hhYmxlT3B0aW9uRmllbGRzID0gWydsYWJlbCddLFxuICAgICAgICBsaXZld2lyZUlkID0gbnVsbCxcbiAgICAgICAgc3RhdGVQYXRoID0gbnVsbCxcbiAgICAgICAgb25TdGF0ZUNoYW5nZSA9ICgpID0+IHt9LFxuICAgIH0pIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgICAgIHRoaXMub3JpZ2luYWxPcHRpb25zID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvcHRpb25zKSkgLy8gS2VlcCBhIGNvcHkgb2Ygb3JpZ2luYWwgb3B0aW9uc1xuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlXG4gICAgICAgIHRoaXMuY2FuU2VsZWN0UGxhY2Vob2xkZXIgPSBjYW5TZWxlY3RQbGFjZWhvbGRlclxuICAgICAgICB0aGlzLmluaXRpYWxPcHRpb25MYWJlbCA9IGluaXRpYWxPcHRpb25MYWJlbFxuICAgICAgICB0aGlzLmluaXRpYWxPcHRpb25MYWJlbHMgPSBpbml0aWFsT3B0aW9uTGFiZWxzXG4gICAgICAgIHRoaXMuaW5pdGlhbFN0YXRlID0gaW5pdGlhbFN0YXRlXG4gICAgICAgIHRoaXMuaXNIdG1sQWxsb3dlZCA9IGlzSHRtbEFsbG93ZWRcbiAgICAgICAgdGhpcy5pc0F1dG9mb2N1c2VkID0gaXNBdXRvZm9jdXNlZFxuICAgICAgICB0aGlzLmlzRGlzYWJsZWQgPSBpc0Rpc2FibGVkXG4gICAgICAgIHRoaXMuaXNNdWx0aXBsZSA9IGlzTXVsdGlwbGVcbiAgICAgICAgdGhpcy5pc1NlYXJjaGFibGUgPSBpc1NlYXJjaGFibGVcbiAgICAgICAgdGhpcy5nZXRPcHRpb25MYWJlbFVzaW5nID0gZ2V0T3B0aW9uTGFiZWxVc2luZ1xuICAgICAgICB0aGlzLmdldE9wdGlvbkxhYmVsc1VzaW5nID0gZ2V0T3B0aW9uTGFiZWxzVXNpbmdcbiAgICAgICAgdGhpcy5nZXRPcHRpb25zVXNpbmcgPSBnZXRPcHRpb25zVXNpbmdcbiAgICAgICAgdGhpcy5nZXRTZWFyY2hSZXN1bHRzVXNpbmcgPSBnZXRTZWFyY2hSZXN1bHRzVXNpbmdcbiAgICAgICAgdGhpcy5oYXNEeW5hbWljT3B0aW9ucyA9IGhhc0R5bmFtaWNPcHRpb25zXG4gICAgICAgIHRoaXMuaGFzRHluYW1pY1NlYXJjaFJlc3VsdHMgPSBoYXNEeW5hbWljU2VhcmNoUmVzdWx0c1xuICAgICAgICB0aGlzLnNlYXJjaFByb21wdCA9IHNlYXJjaFByb21wdFxuICAgICAgICB0aGlzLnNlYXJjaERlYm91bmNlID0gc2VhcmNoRGVib3VuY2VcbiAgICAgICAgdGhpcy5sb2FkaW5nTWVzc2FnZSA9IGxvYWRpbmdNZXNzYWdlXG4gICAgICAgIHRoaXMuc2VhcmNoaW5nTWVzc2FnZSA9IHNlYXJjaGluZ01lc3NhZ2VcbiAgICAgICAgdGhpcy5ub1NlYXJjaFJlc3VsdHNNZXNzYWdlID0gbm9TZWFyY2hSZXN1bHRzTWVzc2FnZVxuICAgICAgICB0aGlzLm1heEl0ZW1zID0gbWF4SXRlbXNcbiAgICAgICAgdGhpcy5tYXhJdGVtc01lc3NhZ2UgPSBtYXhJdGVtc01lc3NhZ2VcbiAgICAgICAgdGhpcy5vcHRpb25zTGltaXQgPSBvcHRpb25zTGltaXRcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uXG4gICAgICAgIHRoaXMuc2VhcmNoYWJsZU9wdGlvbkZpZWxkcyA9IEFycmF5LmlzQXJyYXkoc2VhcmNoYWJsZU9wdGlvbkZpZWxkcylcbiAgICAgICAgICAgID8gc2VhcmNoYWJsZU9wdGlvbkZpZWxkc1xuICAgICAgICAgICAgOiBbJ2xhYmVsJ11cbiAgICAgICAgdGhpcy5saXZld2lyZUlkID0gbGl2ZXdpcmVJZFxuICAgICAgICB0aGlzLnN0YXRlUGF0aCA9IHN0YXRlUGF0aFxuICAgICAgICB0aGlzLm9uU3RhdGVDaGFuZ2UgPSBvblN0YXRlQ2hhbmdlXG5cbiAgICAgICAgLy8gQ2VudHJhbCByZXBvc2l0b3J5IGZvciBvcHRpb24gbGFiZWxzXG4gICAgICAgIHRoaXMubGFiZWxSZXBvc2l0b3J5ID0ge31cblxuICAgICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xXG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSAnJ1xuICAgICAgICB0aGlzLnNlYXJjaFRpbWVvdXQgPSBudWxsXG5cbiAgICAgICAgdGhpcy5yZW5kZXIoKVxuICAgICAgICB0aGlzLnNldFVwRXZlbnRMaXN0ZW5lcnMoKVxuXG4gICAgICAgIGlmICh0aGlzLmlzQXV0b2ZvY3VzZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0QnV0dG9uLmZvY3VzKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhlbHBlciBtZXRob2QgdG8gcG9wdWxhdGUgdGhlIGxhYmVsIHJlcG9zaXRvcnkgZnJvbSBvcHRpb25zXG4gICAgcG9wdWxhdGVMYWJlbFJlcG9zaXRvcnlGcm9tT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucyB8fCAhQXJyYXkuaXNBcnJheShvcHRpb25zKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9uLm9wdGlvbnMgJiYgQXJyYXkuaXNBcnJheShvcHRpb24ub3B0aW9ucykpIHtcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgb3B0aW9uIGdyb3Vwc1xuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVMYWJlbFJlcG9zaXRvcnlGcm9tT3B0aW9ucyhvcHRpb24ub3B0aW9ucylcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgb3B0aW9uLnZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICAgICBvcHRpb24ubGFiZWwgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIGxhYmVsIGluIHRoZSByZXBvc2l0b3J5XG4gICAgICAgICAgICAgICAgdGhpcy5sYWJlbFJlcG9zaXRvcnlbb3B0aW9uLnZhbHVlXSA9IG9wdGlvbi5sYWJlbFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICAvLyBQb3B1bGF0ZSB0aGUgbGFiZWwgcmVwb3NpdG9yeSBmcm9tIGluaXRpYWwgb3B0aW9uc1xuICAgICAgICB0aGlzLnBvcHVsYXRlTGFiZWxSZXBvc2l0b3J5RnJvbU9wdGlvbnModGhpcy5vcHRpb25zKVxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWFpbiBjb250YWluZXJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgPSAnZmktZm8tc2VsZWN0LWN0bidcbiAgICAgICAgdGhpcy5jb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhhc3BvcHVwJywgJ2xpc3Rib3gnKVxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgYnV0dG9uIHRoYXQgdG9nZ2xlcyB0aGUgZHJvcGRvd25cbiAgICAgICAgdGhpcy5zZWxlY3RCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxuICAgICAgICB0aGlzLnNlbGVjdEJ1dHRvbi5jbGFzc05hbWUgPSAnZmktZm8tc2VsZWN0LWJ0bidcbiAgICAgICAgdGhpcy5zZWxlY3RCdXR0b24udHlwZSA9ICdidXR0b24nXG4gICAgICAgIHRoaXMuc2VsZWN0QnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpXG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBzZWxlY3RlZCB2YWx1ZSBkaXNwbGF5XG4gICAgICAgIHRoaXMuc2VsZWN0ZWREaXNwbGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgdGhpcy5zZWxlY3RlZERpc3BsYXkuY2xhc3NOYW1lID0gJ2ZpLWZvLXNlbGVjdC12YWx1ZS1jdG4nXG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBzZWxlY3RlZCBkaXNwbGF5IGJhc2VkIG9uIGN1cnJlbnQgc3RhdGVcbiAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZERpc3BsYXkoKVxuXG4gICAgICAgIHRoaXMuc2VsZWN0QnV0dG9uLmFwcGVuZENoaWxkKHRoaXMuc2VsZWN0ZWREaXNwbGF5KVxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgZHJvcGRvd25cbiAgICAgICAgdGhpcy5kcm9wZG93biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIHRoaXMuZHJvcGRvd24uY2xhc3NOYW1lID0gJ2ZpLWRyb3Bkb3duLXBhbmVsIGZpLXNjcm9sbGFibGUnXG4gICAgICAgIHRoaXMuZHJvcGRvd24uc2V0QXR0cmlidXRlKCdyb2xlJywgJ2xpc3Rib3gnKVxuICAgICAgICB0aGlzLmRyb3Bkb3duLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKVxuICAgICAgICB0aGlzLmRyb3Bkb3duLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcblxuICAgICAgICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBJRCBmb3IgdGhlIGRyb3Bkb3duXG4gICAgICAgIHRoaXMuZHJvcGRvd25JZCA9IGBmaS1mby1zZWxlY3QtZHJvcGRvd24tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTEpfWBcbiAgICAgICAgdGhpcy5kcm9wZG93bi5pZCA9IHRoaXMuZHJvcGRvd25JZFxuXG4gICAgICAgIC8vIFNldCBhcmlhLW11bHRpc2VsZWN0YWJsZSBmb3IgbXVsdGktc2VsZWN0XG4gICAgICAgIGlmICh0aGlzLmlzTXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd24uc2V0QXR0cmlidXRlKCdhcmlhLW11bHRpc2VsZWN0YWJsZScsICd0cnVlJylcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBzZWFyY2ggaW5wdXQgaWYgc2VhcmNoYWJsZVxuICAgICAgICBpZiAodGhpcy5pc1NlYXJjaGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdmaS1mby1zZWxlY3Qtc2VhcmNoLWN0bidcblxuICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JylcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQuY2xhc3NOYW1lID0gJ2ZpLWlucHV0J1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC50eXBlID0gJ3RleHQnXG4gICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0LnBsYWNlaG9sZGVyID0gdGhpcy5zZWFyY2hQcm9tcHRcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ1NlYXJjaCcpXG5cbiAgICAgICAgICAgIHRoaXMuc2VhcmNoQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuc2VhcmNoSW5wdXQpXG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duLmFwcGVuZENoaWxkKHRoaXMuc2VhcmNoQ29udGFpbmVyKVxuXG4gICAgICAgICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJzIGZvciBzZWFyY2ggaW5wdXRcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgc2VsZWN0IGlzIGRpc2FibGVkLCBkb24ndCBoYW5kbGUgaW5wdXQgZXZlbnRzXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNEaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlYXJjaChldmVudClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSBUYWIsIEFycm93IFVwLCBhbmQgQXJyb3cgRG93biBpbiBzZWFyY2ggaW5wdXRcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBzZWxlY3QgaXMgZGlzYWJsZWQsIGRvbid0IGhhbmRsZSBrZXlib2FyZCBldmVudHNcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdUYWInKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5nZXRWaXNpYmxlT3B0aW9ucygpXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgU2hpZnQrVGFiLCBmb2N1cyB0aGUgbGFzdCBvcHRpb24sIG90aGVyd2lzZSBmb2N1cyB0aGUgZmlyc3Qgb3B0aW9uXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gb3B0aW9ucy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAwXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgZm9jdXMgZnJvbSBhbnkgcHJldmlvdXNseSBmb2N1c2VkIG9wdGlvblxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmZvckVhY2goKG9wdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpLXNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW3RoaXMuc2VsZWN0ZWRJbmRleF0uY2xhc3NMaXN0LmFkZCgnZmktc2VsZWN0ZWQnKVxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW3RoaXMuc2VsZWN0ZWRJbmRleF0uZm9jdXMoKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSAnQXJyb3dEb3duJykge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpIC8vIFByZXZlbnQgcGFnZSBzY3JvbGxpbmdcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5nZXRWaXNpYmxlT3B0aW9ucygpXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVzZXQgc2VsZWN0ZWRJbmRleCB0byAtMSB0byBlbnN1cmUgd2UgZm9jdXMgdGhlIGZpcnN0IG9wdGlvblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMVxuICAgICAgICAgICAgICAgICAgICAvLyBCbHVyIHRoZSBzZWFyY2ggaW5wdXQgdG8gYWxsb3cgYXJyb3cga2V5IG5hdmlnYXRpb24gYmV0d2VlbiBvcHRpb25zXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQuYmx1cigpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNOZXh0T3B0aW9uKClcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gJ0Fycm93VXAnKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCkgLy8gUHJldmVudCBwYWdlIHNjcm9sbGluZ1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmdldFZpc2libGVPcHRpb25zKClcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgc2VsZWN0ZWRJbmRleCB0byB0aGUgbGFzdCBvcHRpb25cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gb3B0aW9ucy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgICAgIC8vIEJsdXIgdGhlIHNlYXJjaCBpbnB1dCB0byBhbGxvdyBhcnJvdyBrZXkgbmF2aWdhdGlvbiBiZXR3ZWVuIG9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5ibHVyKClcblxuICAgICAgICAgICAgICAgICAgICAvLyBGb2N1cyB0aGUgbGFzdCBvcHRpb24gZGlyZWN0bHlcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1t0aGlzLnNlbGVjdGVkSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2ZpLXNlbGVjdGVkJylcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1t0aGlzLnNlbGVjdGVkSW5kZXhdLmZvY3VzKClcblxuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgYXJpYS1hY3RpdmVkZXNjZW5kYW50IHRvIHRoZSBJRCBvZiB0aGUgZm9jdXNlZCBvcHRpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNbdGhpcy5zZWxlY3RlZEluZGV4XS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1t0aGlzLnNlbGVjdGVkSW5kZXhdLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxPcHRpb25JbnRvVmlldyhvcHRpb25zW3RoaXMuc2VsZWN0ZWRJbmRleF0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgb3B0aW9ucyBsaXN0XG4gICAgICAgIHRoaXMub3B0aW9uc0xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpXG5cbiAgICAgICAgLy8gUmVuZGVyIG9wdGlvbnNcbiAgICAgICAgdGhpcy5yZW5kZXJPcHRpb25zKClcblxuICAgICAgICAvLyBBcHBlbmQgZXZlcnl0aGluZyB0byB0aGUgY29udGFpbmVyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuc2VsZWN0QnV0dG9uKVxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmRyb3Bkb3duKVxuXG4gICAgICAgIC8vIEFwcGVuZCB0aGUgY29udGFpbmVyIHRvIHRoZSBlbGVtZW50XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcilcblxuICAgICAgICAvLyBBcHBseSBkaXNhYmxlZCBzdGF0ZSBpZiBuZWVkZWRcbiAgICAgICAgdGhpcy5hcHBseURpc2FibGVkU3RhdGUoKVxuICAgIH1cblxuICAgIHJlbmRlck9wdGlvbnMoKSB7XG4gICAgICAgIHRoaXMub3B0aW9uc0xpc3QuaW5uZXJIVE1MID0gJydcblxuICAgICAgICAvLyBQbGFjZWhvbGRlciBvcHRpb24gcmVtb3ZlZCBhcyB0aGVyZSBhcmUgWCBidXR0b25zIGluIHRoZSBtYWluIHBhcnRcblxuICAgICAgICAvLyBQcm9jZXNzIGFuZCBhZGQgb3B0aW9uc1xuICAgICAgICBsZXQgdG90YWxSZW5kZXJlZENvdW50ID0gMFxuXG4gICAgICAgIC8vIEFwcGx5IG9wdGlvbnMgbGltaXQgaWYgc3BlY2lmaWVkXG4gICAgICAgIGxldCBvcHRpb25zVG9SZW5kZXIgPSB0aGlzLm9wdGlvbnNcbiAgICAgICAgbGV0IG9wdGlvbnNDb3VudCA9IDBcblxuICAgICAgICAvLyBDaGVjayBpZiB3ZSBoYXZlIGFueSBncm91cGVkIG9wdGlvbnNcbiAgICAgICAgbGV0IGhhc0dyb3VwZWRPcHRpb25zID0gZmFsc2VcblxuICAgICAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgICBpZiAob3B0aW9uLm9wdGlvbnMgJiYgQXJyYXkuaXNBcnJheShvcHRpb24ub3B0aW9ucykpIHtcbiAgICAgICAgICAgICAgICAvLyBDb3VudCBvcHRpb25zIGluIGdyb3Vwc1xuICAgICAgICAgICAgICAgIG9wdGlvbnNDb3VudCArPSBvcHRpb24ub3B0aW9ucy5sZW5ndGhcbiAgICAgICAgICAgICAgICBoYXNHcm91cGVkT3B0aW9ucyA9IHRydWVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQ291bnQgcmVndWxhciBvcHRpb25zXG4gICAgICAgICAgICAgICAgb3B0aW9uc0NvdW50KytcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAvLyBTZXQgdGhlIGFwcHJvcHJpYXRlIGNsYXNzIGJhc2VkIG9uIHdoZXRoZXIgd2UgaGF2ZSBncm91cGVkIG9wdGlvbnNcbiAgICAgICAgaWYgKGhhc0dyb3VwZWRPcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNMaXN0LmNsYXNzTmFtZSA9ICdmaS1mby1zZWxlY3Qtb3B0aW9ucy1jdG4nXG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9uc0NvdW50ID4gMCkge1xuICAgICAgICAgICAgLy8gT25seSBzZXQgZmktZHJvcGRvd24tbGlzdCBjbGFzcyBpZiB0aGVyZSBhcmUgb3B0aW9ucyB0byByZW5kZXJcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0xpc3QuY2xhc3NOYW1lID0gJ2ZpLWRyb3Bkb3duLWxpc3QnXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgYSBsaXN0IGZvciB1bmdyb3VwZWQgb3B0aW9ucyBvbmx5IGlmIHdlIGhhdmUgZ3JvdXBlZCBvcHRpb25zXG4gICAgICAgIGxldCB1bmdyb3VwZWRMaXN0ID0gaGFzR3JvdXBlZE9wdGlvbnMgPyBudWxsIDogdGhpcy5vcHRpb25zTGlzdFxuXG4gICAgICAgIC8vIFJlbmRlciBvcHRpb25zIHdpdGggbGltaXQgaW4gbWluZFxuICAgICAgICBsZXQgcmVuZGVyZWRDb3VudCA9IDBcblxuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBvcHRpb25zVG9SZW5kZXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnNMaW1pdCAmJiByZW5kZXJlZENvdW50ID49IHRoaXMub3B0aW9uc0xpbWl0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbi5vcHRpb25zICYmIEFycmF5LmlzQXJyYXkob3B0aW9uLm9wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBvcHRpb24gZ3JvdXBcbiAgICAgICAgICAgICAgICAvLyBJZiBpbiBtdWx0aXBsZSBtb2RlLCBmaWx0ZXIgb3V0IHNlbGVjdGVkIG9wdGlvbnMgZnJvbSB0aGUgZ3JvdXBcbiAgICAgICAgICAgICAgICBsZXQgZ3JvdXBPcHRpb25zID0gb3B0aW9uLm9wdGlvbnNcblxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc011bHRpcGxlICYmXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmlzQXJyYXkodGhpcy5zdGF0ZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwT3B0aW9ucyA9IG9wdGlvbi5vcHRpb25zLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIChncm91cE9wdGlvbikgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhdGhpcy5zdGF0ZS5pbmNsdWRlcyhncm91cE9wdGlvbi52YWx1ZSksXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBPcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQXBwbHkgbGltaXQgdG8gZ3JvdXAgb3B0aW9ucyBpZiBuZWVkZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9uc0xpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZW1haW5pbmdTbG90cyA9IHRoaXMub3B0aW9uc0xpbWl0IC0gcmVuZGVyZWRDb3VudFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbWFpbmluZ1Nsb3RzIDwgZ3JvdXBPcHRpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwT3B0aW9ucyA9IGdyb3VwT3B0aW9ucy5zbGljZSgwLCByZW1haW5pbmdTbG90cylcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyT3B0aW9uR3JvdXAob3B0aW9uLmxhYmVsLCBncm91cE9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVkQ291bnQgKz0gZ3JvdXBPcHRpb25zLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICB0b3RhbFJlbmRlcmVkQ291bnQgKz0gZ3JvdXBPcHRpb25zLmxlbmd0aFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIHJlZ3VsYXIgb3B0aW9uXG4gICAgICAgICAgICAgICAgLy8gSWYgaW4gbXVsdGlwbGUgbW9kZSwgc2tpcCBhbHJlYWR5IHNlbGVjdGVkIG9wdGlvbnNcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNNdWx0aXBsZSAmJlxuICAgICAgICAgICAgICAgICAgICBBcnJheS5pc0FycmF5KHRoaXMuc3RhdGUpICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaW5jbHVkZXMob3B0aW9uLnZhbHVlKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSB1bmdyb3VwZWQgbGlzdCBpZiBpdCBkb2Vzbid0IGV4aXN0IHlldCBhbmQgd2UgaGF2ZSBncm91cGVkIG9wdGlvbnNcbiAgICAgICAgICAgICAgICBpZiAoIXVuZ3JvdXBlZExpc3QgJiYgaGFzR3JvdXBlZE9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIGFueSB1bmdyb3VwZWQgb3B0aW9ucyB0byByZW5kZXJcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Uga25vdyB0aGVyZSdzIGF0IGxlYXN0IG9uZSAodGhlIGN1cnJlbnQgb3B0aW9uKSwgc28gY3JlYXRlIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgICAgIHVuZ3JvdXBlZExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpXG4gICAgICAgICAgICAgICAgICAgIHVuZ3JvdXBlZExpc3QuY2xhc3NOYW1lID0gJ2ZpLWRyb3Bkb3duLWxpc3QnXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uc0xpc3QuYXBwZW5kQ2hpbGQodW5ncm91cGVkTGlzdClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25FbGVtZW50ID0gdGhpcy5jcmVhdGVPcHRpb25FbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICBvcHRpb24udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbixcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgdW5ncm91cGVkTGlzdC5hcHBlbmRDaGlsZChvcHRpb25FbGVtZW50KVxuICAgICAgICAgICAgICAgIHJlbmRlcmVkQ291bnQrK1xuICAgICAgICAgICAgICAgIHRvdGFsUmVuZGVyZWRDb3VudCsrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBubyBvcHRpb25zIHdlcmUgcmVuZGVyZWRcbiAgICAgICAgaWYgKHRvdGFsUmVuZGVyZWRDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBhIHNlYXJjaCBxdWVyeSwgc2hvdyBcIk5vIHJlc3VsdHNcIiBtZXNzYWdlXG4gICAgICAgICAgICBpZiAodGhpcy5zZWFyY2hRdWVyeSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd05vUmVzdWx0c01lc3NhZ2UoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgaW4gbXVsdGlwbGUgbW9kZSBhbmQgbm8gc2VhcmNoIHF1ZXJ5LCBoaWRlIHRoZSBkcm9wZG93blxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pc011bHRpcGxlICYmIHRoaXMuaXNPcGVuICYmICF0aGlzLmlzU2VhcmNoYWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VEcm9wZG93bigpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgb3B0aW9ucyBsaXN0IGZyb20gdGhlIERPTSBpZiBpdCdzIGFscmVhZHkgdGhlcmVcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnNMaXN0LnBhcmVudE5vZGUgPT09IHRoaXMuZHJvcGRvd24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3Bkb3duLnJlbW92ZUNoaWxkKHRoaXMub3B0aW9uc0xpc3QpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBIaWRlIGFueSBleGlzdGluZyBtZXNzYWdlcyAobGlrZSBcIk5vIHJlc3VsdHNcIilcbiAgICAgICAgICAgIHRoaXMuaGlkZUxvYWRpbmdTdGF0ZSgpXG5cbiAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgb3B0aW9ucyBsaXN0IHRvIHRoZSBkcm9wZG93biBpZiBpdCdzIG5vdCBhbHJlYWR5IHRoZXJlXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zTGlzdC5wYXJlbnROb2RlICE9PSB0aGlzLmRyb3Bkb3duKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5hcHBlbmRDaGlsZCh0aGlzLm9wdGlvbnNMaXN0KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyT3B0aW9uR3JvdXAobGFiZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgLy8gRG9uJ3QgcmVuZGVyIGlmIHRoZXJlIGFyZSBubyBvcHRpb25zXG4gICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcHRpb25Hcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgICAgICAgb3B0aW9uR3JvdXAuY2xhc3NOYW1lID0gJ2ZpLWZvLXNlbGVjdC1vcHRpb24tZ3JvdXAnXG5cbiAgICAgICAgY29uc3Qgb3B0aW9uR3JvdXBMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIG9wdGlvbkdyb3VwTGFiZWwuY2xhc3NOYW1lID0gJ2ZpLWRyb3Bkb3duLWhlYWRlcidcbiAgICAgICAgb3B0aW9uR3JvdXBMYWJlbC50ZXh0Q29udGVudCA9IGxhYmVsXG5cbiAgICAgICAgY29uc3QgZ3JvdXBPcHRpb25zTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJylcbiAgICAgICAgZ3JvdXBPcHRpb25zTGlzdC5jbGFzc05hbWUgPSAnZmktZHJvcGRvd24tbGlzdCdcblxuICAgICAgICBvcHRpb25zLmZvckVhY2goKG9wdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9uRWxlbWVudCA9IHRoaXMuY3JlYXRlT3B0aW9uRWxlbWVudChvcHRpb24udmFsdWUsIG9wdGlvbilcbiAgICAgICAgICAgIGdyb3VwT3B0aW9uc0xpc3QuYXBwZW5kQ2hpbGQob3B0aW9uRWxlbWVudClcbiAgICAgICAgfSlcblxuICAgICAgICBvcHRpb25Hcm91cC5hcHBlbmRDaGlsZChvcHRpb25Hcm91cExhYmVsKVxuICAgICAgICBvcHRpb25Hcm91cC5hcHBlbmRDaGlsZChncm91cE9wdGlvbnNMaXN0KVxuICAgICAgICB0aGlzLm9wdGlvbnNMaXN0LmFwcGVuZENoaWxkKG9wdGlvbkdyb3VwKVxuICAgIH1cblxuICAgIGNyZWF0ZU9wdGlvbkVsZW1lbnQodmFsdWUsIGxhYmVsKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgYW4gb2JqZWN0IHdpdGggbGFiZWwsIHZhbHVlLCBhbmQgaXNEaXNhYmxlZCBwcm9wZXJ0aWVzXG4gICAgICAgIGxldCBvcHRpb25WYWx1ZSA9IHZhbHVlXG4gICAgICAgIGxldCBvcHRpb25MYWJlbCA9IGxhYmVsXG4gICAgICAgIGxldCBpc0Rpc2FibGVkID0gZmFsc2VcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgbGFiZWwgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICBsYWJlbCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgJ2xhYmVsJyBpbiBsYWJlbCAmJlxuICAgICAgICAgICAgJ3ZhbHVlJyBpbiBsYWJlbFxuICAgICAgICApIHtcbiAgICAgICAgICAgIG9wdGlvblZhbHVlID0gbGFiZWwudmFsdWVcbiAgICAgICAgICAgIG9wdGlvbkxhYmVsID0gbGFiZWwubGFiZWxcbiAgICAgICAgICAgIGlzRGlzYWJsZWQgPSBsYWJlbC5pc0Rpc2FibGVkIHx8IGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgICAgIG9wdGlvbi5jbGFzc05hbWUgPSAnZmktZHJvcGRvd24tbGlzdC1pdGVtIGZpLWZvLXNlbGVjdC1vcHRpb24nXG5cbiAgICAgICAgaWYgKGlzRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIG9wdGlvbi5jbGFzc0xpc3QuYWRkKCdmaS1kaXNhYmxlZCcpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBJRCBmb3IgdGhlIG9wdGlvblxuICAgICAgICBjb25zdCBvcHRpb25JZCA9IGBmaS1mby1zZWxlY3Qtb3B0aW9uLSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDExKX1gXG4gICAgICAgIG9wdGlvbi5pZCA9IG9wdGlvbklkXG5cbiAgICAgICAgb3B0aW9uLnNldEF0dHJpYnV0ZSgncm9sZScsICdvcHRpb24nKVxuICAgICAgICBvcHRpb24uc2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJywgb3B0aW9uVmFsdWUpXG4gICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKSAvLyBNYWtlIHRoZSBvcHRpb24gZm9jdXNhYmxlXG5cbiAgICAgICAgaWYgKGlzRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdG9yZSB0aGUgcGxhaW4gdGV4dCB2ZXJzaW9uIG9mIHRoZSBsYWJlbCBmb3IgYXJpYS1sYWJlbCBpZiBIVE1MIGlzIGFsbG93ZWRcbiAgICAgICAgaWYgKHRoaXMuaXNIdG1sQWxsb3dlZCAmJiB0eXBlb2Ygb3B0aW9uTGFiZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSB0ZW1wb3JhcnkgZGl2IHRvIGV4dHJhY3QgdGV4dCBjb250ZW50IGZyb20gSFRNTFxuICAgICAgICAgICAgY29uc3QgdGVtcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgICB0ZW1wRGl2LmlubmVySFRNTCA9IG9wdGlvbkxhYmVsXG4gICAgICAgICAgICBjb25zdCBwbGFpblRleHQgPVxuICAgICAgICAgICAgICAgIHRlbXBEaXYudGV4dENvbnRlbnQgfHwgdGVtcERpdi5pbm5lclRleHQgfHwgb3B0aW9uTGFiZWxcbiAgICAgICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBwbGFpblRleHQpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiB0aGlzIG9wdGlvbiBpcyBzZWxlY3RlZFxuICAgICAgICBjb25zdCBpc1NlbGVjdGVkID0gdGhpcy5pc011bHRpcGxlXG4gICAgICAgICAgICA/IEFycmF5LmlzQXJyYXkodGhpcy5zdGF0ZSkgJiYgdGhpcy5zdGF0ZS5pbmNsdWRlcyhvcHRpb25WYWx1ZSlcbiAgICAgICAgICAgIDogdGhpcy5zdGF0ZSA9PT0gb3B0aW9uVmFsdWVcblxuICAgICAgICBvcHRpb24uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgaXNTZWxlY3RlZCA/ICd0cnVlJyA6ICdmYWxzZScpXG5cbiAgICAgICAgaWYgKGlzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIG9wdGlvbi5jbGFzc0xpc3QuYWRkKCdmaS1zZWxlY3RlZCcpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBIYW5kbGUgSFRNTCBjb250ZW50IGlmIGFsbG93ZWRcbiAgICAgICAgaWYgKHRoaXMuaXNIdG1sQWxsb3dlZCkge1xuICAgICAgICAgICAgY29uc3QgbGFiZWxTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICAgICAgICBsYWJlbFNwYW4uaW5uZXJIVE1MID0gb3B0aW9uTGFiZWxcbiAgICAgICAgICAgIG9wdGlvbi5hcHBlbmRDaGlsZChsYWJlbFNwYW4pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcHRpb24uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUob3B0aW9uTGFiZWwpKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIGNsaWNrIGV2ZW50IG9ubHkgaWYgbm90IGRpc2FibGVkXG4gICAgICAgIGlmICghaXNEaXNhYmxlZCkge1xuICAgICAgICAgICAgb3B0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RPcHRpb24ob3B0aW9uVmFsdWUpXG5cbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IHRoZSBkcm9wZG93biBmcm9tIGxvc2luZyBmb2N1c1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzTXVsdGlwbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIG11bHRpcGxlIHNlbGVjdGlvbiwgbWFpbnRhaW4gZm9jdXMgd2l0aGluIHRoZSBkcm9wZG93blxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NlYXJjaGFibGUgJiYgdGhpcy5zZWFyY2hJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5mb2N1cygpXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAwKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2VlcCBmb2N1cyBvbiB0aGUgb3B0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb24uZm9jdXMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3B0aW9uXG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlU2VsZWN0ZWREaXNwbGF5KCkge1xuICAgICAgICAvLyBDbGVhciB0aGUgY3VycmVudCBjb250ZW50XG4gICAgICAgIHRoaXMuc2VsZWN0ZWREaXNwbGF5LmlubmVySFRNTCA9ICcnXG5cbiAgICAgICAgLy8gSGFuZGxlIG11bHRpcGxlIHNlbGVjdGlvblxuICAgICAgICBpZiAodGhpcy5pc011bHRpcGxlKSB7XG4gICAgICAgICAgICAvLyBJZiBubyBpdGVtcyBzZWxlY3RlZCwgc2hvdyBwbGFjZWhvbGRlclxuICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuc3RhdGUpIHx8IHRoaXMuc3RhdGUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERpc3BsYXkudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYWNlaG9sZGVyIHx8ICdTZWxlY3Qgb3B0aW9ucydcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRm9yIG11bHRpcGxlIHNlbGVjdGlvbiwgZ2V0IGxhYmVscyBmb3Igc2VsZWN0ZWQgb3B0aW9uc1xuICAgICAgICAgICAgbGV0IHNlbGVjdGVkTGFiZWxzID0gYXdhaXQgdGhpcy5nZXRMYWJlbHNGb3JNdWx0aXBsZVNlbGVjdGlvbigpXG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBhbmQgYWRkIGJhZGdlcyBmb3Igc2VsZWN0ZWQgb3B0aW9uc1xuICAgICAgICAgICAgdGhpcy5hZGRCYWRnZXNGb3JTZWxlY3RlZE9wdGlvbnMoc2VsZWN0ZWRMYWJlbHMpXG5cbiAgICAgICAgICAgIC8vIFJlZXZhbHVhdGUgZHJvcGRvd24gcG9zaXRpb24gYWZ0ZXIgYmFkZ2VzIGFyZSBhZGRlZFxuICAgICAgICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbkRyb3Bkb3duKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGFuZGxlIHNpbmdsZSBzZWxlY3Rpb25cblxuICAgICAgICAvLyBJZiBubyB2YWx1ZSBzZWxlY3RlZCwgc2hvdyBwbGFjZWhvbGRlclxuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gbnVsbCB8fCB0aGlzLnN0YXRlID09PSAnJykge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERpc3BsYXkudGV4dENvbnRlbnQgPVxuICAgICAgICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXIgfHwgJ1NlbGVjdCBhbiBvcHRpb24nXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdldCBsYWJlbCBmb3IgdGhlIHNlbGVjdGVkIHZhbHVlXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkTGFiZWwgPSBhd2FpdCB0aGlzLmdldExhYmVsRm9yU2luZ2xlU2VsZWN0aW9uKClcblxuICAgICAgICAvLyBBZGQgdGhlIGxhYmVsIGFuZCByZW1vdmUgYnV0dG9uXG4gICAgICAgIHRoaXMuYWRkU2luZ2xlU2VsZWN0aW9uRGlzcGxheShzZWxlY3RlZExhYmVsKVxuICAgIH1cblxuICAgIC8vIEhlbHBlciBtZXRob2QgdG8gZ2V0IGxhYmVscyBmb3IgbXVsdGlwbGUgc2VsZWN0aW9uXG4gICAgYXN5bmMgZ2V0TGFiZWxzRm9yTXVsdGlwbGVTZWxlY3Rpb24oKSB7XG4gICAgICAgIGxldCBzZWxlY3RlZExhYmVscyA9IHRoaXMuZ2V0U2VsZWN0ZWRPcHRpb25MYWJlbHMoKVxuXG4gICAgICAgIC8vIENoZWNrIGZvciB2YWx1ZXMgdGhhdCBhcmUgbm90IGluIHRoZSByZXBvc2l0b3J5IG9yIG9wdGlvbnNcbiAgICAgICAgY29uc3QgbWlzc2luZ1ZhbHVlcyA9IFtdXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuc3RhdGUpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHRoaXMuc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB3ZSBoYXZlIHRoZSBsYWJlbCBpbiB0aGUgcmVwb3NpdG9yeVxuICAgICAgICAgICAgICAgIGlmIChmaWxsZWQodGhpcy5sYWJlbFJlcG9zaXRvcnlbdmFsdWVdKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHdlIGhhdmUgdGhlIGxhYmVsIGluIHRoZSBvcHRpb25zXG4gICAgICAgICAgICAgICAgaWYgKGZpbGxlZChzZWxlY3RlZExhYmVsc1t2YWx1ZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN0b3JlIHRoZSBsYWJlbCBpbiB0aGUgcmVwb3NpdG9yeVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhYmVsUmVwb3NpdG9yeVt2YWx1ZV0gPSBzZWxlY3RlZExhYmVsc1t2YWx1ZV1cbiAgICAgICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBJZiBub3QgZm91bmQsIGFkZCB0byBtaXNzaW5nIHZhbHVlc1xuICAgICAgICAgICAgICAgIG1pc3NpbmdWYWx1ZXMucHVzaCh2YWx1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlIGhhdmUgbWlzc2luZyB2YWx1ZXMgYW5kIGN1cnJlbnQgc3RhdGUgbWF0Y2hlcyBpbml0aWFsU3RhdGUsIHVzZSBpbml0aWFsT3B0aW9uTGFiZWxzXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIG1pc3NpbmdWYWx1ZXMubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgZmlsbGVkKHRoaXMuaW5pdGlhbE9wdGlvbkxhYmVscykgJiZcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUpID09PSBKU09OLnN0cmluZ2lmeSh0aGlzLmluaXRpYWxTdGF0ZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBVc2UgaW5pdGlhbE9wdGlvbkxhYmVscyBhbmQgc3RvcmUgdGhlbSBpbiB0aGUgcmVwb3NpdG9yeVxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5pbml0aWFsT3B0aW9uTGFiZWxzKSkge1xuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxPcHRpb25MYWJlbHMgaXMgYW4gYXJyYXkgb2Ygb2JqZWN0cyB3aXRoIGxhYmVsIGFuZCB2YWx1ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpbml0aWFsT3B0aW9uIG9mIHRoaXMuaW5pdGlhbE9wdGlvbkxhYmVscykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsZWQoaW5pdGlhbE9wdGlvbikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxPcHRpb24udmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbE9wdGlvbi5sYWJlbCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBtaXNzaW5nVmFsdWVzLmluY2x1ZGVzKGluaXRpYWxPcHRpb24udmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIGxhYmVsIGluIHRoZSByZXBvc2l0b3J5XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhYmVsUmVwb3NpdG9yeVtpbml0aWFsT3B0aW9uLnZhbHVlXSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbE9wdGlvbi5sYWJlbFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIHdlIHN0aWxsIGhhdmUgbWlzc2luZyB2YWx1ZXMgYW5kIGdldE9wdGlvbkxhYmVsc1VzaW5nIGlzIGF2YWlsYWJsZSwgZmV0Y2ggdGhlbVxuICAgICAgICBlbHNlIGlmIChtaXNzaW5nVmFsdWVzLmxlbmd0aCA+IDAgJiYgdGhpcy5nZXRPcHRpb25MYWJlbHNVc2luZykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBGZXRjaCBsYWJlbHMgZm9yIG1pc3NpbmcgdmFsdWVzIC0gcmV0dXJucyBhcnJheSBvZiB7bGFiZWwsIHZhbHVlfSBvYmplY3RzXG4gICAgICAgICAgICAgICAgY29uc3QgZmV0Y2hlZE9wdGlvbnNBcnJheSA9IGF3YWl0IHRoaXMuZ2V0T3B0aW9uTGFiZWxzVXNpbmcoKVxuXG4gICAgICAgICAgICAgICAgLy8gU3RvcmUgZmV0Y2hlZCBsYWJlbHMgaW4gdGhlIHJlcG9zaXRvcnlcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBmZXRjaGVkT3B0aW9uc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxlZChvcHRpb24pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb24udmFsdWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uLmxhYmVsICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhYmVsUmVwb3NpdG9yeVtvcHRpb24udmFsdWVdID0gb3B0aW9uLmxhYmVsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIG9wdGlvbiBsYWJlbHM6JywgZXJyb3IpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgYSByZXN1bHQgYXJyYXkgd2l0aCBhbGwgbGFiZWxzIGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoaXMuc3RhdGVcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW11cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zdGF0ZSkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdGhpcy5zdGF0ZSkge1xuICAgICAgICAgICAgICAgIC8vIEZpcnN0IGNoZWNrIGlmIHdlIGhhdmUgYSBsYWJlbCBpbiB0aGUgcmVwb3NpdG9yeVxuICAgICAgICAgICAgICAgIGlmIChmaWxsZWQodGhpcy5sYWJlbFJlcG9zaXRvcnlbdmFsdWVdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmxhYmVsUmVwb3NpdG9yeVt2YWx1ZV0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFRoZW4gY2hlY2sgaWYgd2UgaGF2ZSBhIGxhYmVsIGZyb20gb3B0aW9uc1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGZpbGxlZChzZWxlY3RlZExhYmVsc1t2YWx1ZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHNlbGVjdGVkTGFiZWxzW3ZhbHVlXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgbm8gbGFiZWwgaXMgZm91bmQsIHVzZSB0aGUgdmFsdWUgYXMgZmFsbGJhY2tcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIC8vIEhlbHBlciBtZXRob2QgdG8gY3JlYXRlIGEgYmFkZ2UgZWxlbWVudFxuICAgIGNyZWF0ZUJhZGdlRWxlbWVudCh2YWx1ZSwgbGFiZWwpIHtcbiAgICAgICAgY29uc3QgYmFkZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgYmFkZ2UuY2xhc3NOYW1lID1cbiAgICAgICAgICAgICdmaS1iYWRnZSBmaS1zaXplLW1kIGZpLWNvbG9yIGZpLWNvbG9yLXByaW1hcnkgZmktdGV4dC1jb2xvci02MDAgZGFyazpmaS10ZXh0LWNvbG9yLTIwMCdcblxuICAgICAgICAvLyBBZGQgYSBkYXRhIGF0dHJpYnV0ZSB0byBpZGVudGlmeSB0aGlzIGJhZGdlIGJ5IGl0cyB2YWx1ZVxuICAgICAgICBpZiAoZmlsbGVkKHZhbHVlKSkge1xuICAgICAgICAgICAgYmFkZ2Uuc2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJywgdmFsdWUpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgYSBjb250YWluZXIgZm9yIHRoZSBsYWJlbCB0ZXh0XG4gICAgICAgIGNvbnN0IGxhYmVsQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICAgIGxhYmVsQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdmaS1iYWRnZS1sYWJlbC1jdG4nXG5cbiAgICAgICAgLy8gQ3JlYXRlIGFuIGVsZW1lbnQgZm9yIHRoZSBsYWJlbCB0ZXh0XG4gICAgICAgIGNvbnN0IGxhYmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgICBsYWJlbEVsZW1lbnQuY2xhc3NOYW1lID0gJ2ZpLWJhZGdlLWxhYmVsJ1xuXG4gICAgICAgIGlmICh0aGlzLmlzSHRtbEFsbG93ZWQpIHtcbiAgICAgICAgICAgIGxhYmVsRWxlbWVudC5pbm5lckhUTUwgPSBsYWJlbFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGFiZWxFbGVtZW50LnRleHRDb250ZW50ID0gbGFiZWxcbiAgICAgICAgfVxuXG4gICAgICAgIGxhYmVsQ29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsRWxlbWVudClcbiAgICAgICAgYmFkZ2UuYXBwZW5kQ2hpbGQobGFiZWxDb250YWluZXIpXG5cbiAgICAgICAgLy8gQWRkIGEgY3Jvc3MgYnV0dG9uIHRvIHJlbW92ZSB0aGUgc2VsZWN0aW9uXG4gICAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IHRoaXMuY3JlYXRlUmVtb3ZlQnV0dG9uKHZhbHVlLCBsYWJlbClcbiAgICAgICAgYmFkZ2UuYXBwZW5kQ2hpbGQocmVtb3ZlQnV0dG9uKVxuXG4gICAgICAgIHJldHVybiBiYWRnZVxuICAgIH1cblxuICAgIC8vIEhlbHBlciBtZXRob2QgdG8gY3JlYXRlIGEgcmVtb3ZlIGJ1dHRvblxuICAgIGNyZWF0ZVJlbW92ZUJ1dHRvbih2YWx1ZSwgbGFiZWwpIHtcbiAgICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbiAgICAgICAgcmVtb3ZlQnV0dG9uLnR5cGUgPSAnYnV0dG9uJ1xuICAgICAgICByZW1vdmVCdXR0b24uY2xhc3NOYW1lID0gJ2ZpLWJhZGdlLWRlbGV0ZS1idG4nXG4gICAgICAgIHJlbW92ZUJ1dHRvbi5pbm5lckhUTUwgPVxuICAgICAgICAgICAgJzxzdmcgY2xhc3M9XCJmaS1pY29uIGZpLXNpemUteHNcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAxNiAxNlwiIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBhcmlhLWhpZGRlbj1cInRydWVcIiBkYXRhLXNsb3Q9XCJpY29uXCI+PHBhdGggZD1cIk01LjI4IDQuMjJhLjc1Ljc1IDAgMCAwLTEuMDYgMS4wNkw2Ljk0IDhsLTIuNzIgMi43MmEuNzUuNzUgMCAxIDAgMS4wNiAxLjA2TDggOS4wNmwyLjcyIDIuNzJhLjc1Ljc1IDAgMSAwIDEuMDYtMS4wNkw5LjA2IDhsMi43Mi0yLjcyYS43NS43NSAwIDAgMC0xLjA2LTEuMDZMOCA2Ljk0IDUuMjggNC4yMlpcIj48L3BhdGg+PC9zdmc+J1xuICAgICAgICByZW1vdmVCdXR0b24uc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgJ2FyaWEtbGFiZWwnLFxuICAgICAgICAgICAgJ1JlbW92ZSAnICtcbiAgICAgICAgICAgICAgICAodGhpcy5pc0h0bWxBbGxvd2VkID8gbGFiZWwucmVwbGFjZSgvPFtePl0qPi9nLCAnJykgOiBsYWJlbCksXG4gICAgICAgIClcblxuICAgICAgICByZW1vdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpIC8vIFByZXZlbnQgZHJvcGRvd24gZnJvbSB0b2dnbGluZ1xuICAgICAgICAgICAgaWYgKGZpbGxlZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdE9wdGlvbih2YWx1ZSkgLy8gVGhpcyB3aWxsIHJlbW92ZSB0aGUgdmFsdWUgc2luY2UgaXQncyBhbHJlYWR5IHNlbGVjdGVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWRkIGtleWRvd24gZXZlbnQgbGlzdGVuZXIgdG8gaGFuZGxlIHNwYWNlIGtleVxuICAgICAgICByZW1vdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJyAnIHx8IGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKSAvLyBQcmV2ZW50IGV2ZW50IGZyb20gYnViYmxpbmcgdXAgdG8gc2VsZWN0QnV0dG9uXG4gICAgICAgICAgICAgICAgaWYgKGZpbGxlZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RPcHRpb24odmFsdWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiByZW1vdmVCdXR0b25cbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgbWV0aG9kIHRvIGFkZCBiYWRnZXMgZm9yIHNlbGVjdGVkIG9wdGlvbnNcbiAgICBhZGRCYWRnZXNGb3JTZWxlY3RlZE9wdGlvbnMoc2VsZWN0ZWRMYWJlbHMpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgY29udGFpbmVyIGZvciB0aGUgYmFkZ2VzXG4gICAgICAgIGNvbnN0IGJhZGdlc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGJhZGdlc0NvbnRhaW5lci5jbGFzc05hbWUgPSAnZmktZm8tc2VsZWN0LXZhbHVlLWJhZGdlcy1jdG4nXG5cbiAgICAgICAgLy8gQWRkIGJhZGdlcyBmb3IgZWFjaCBzZWxlY3RlZCBvcHRpb25cbiAgICAgICAgc2VsZWN0ZWRMYWJlbHMuZm9yRWFjaCgobGFiZWwsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IEFycmF5LmlzQXJyYXkodGhpcy5zdGF0ZSkgPyB0aGlzLnN0YXRlW2luZGV4XSA6IG51bGxcbiAgICAgICAgICAgIGNvbnN0IGJhZGdlID0gdGhpcy5jcmVhdGVCYWRnZUVsZW1lbnQodmFsdWUsIGxhYmVsKVxuICAgICAgICAgICAgYmFkZ2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKGJhZGdlKVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWREaXNwbGF5LmFwcGVuZENoaWxkKGJhZGdlc0NvbnRhaW5lcilcbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgbWV0aG9kIHRvIGdldCBsYWJlbCBmb3Igc2luZ2xlIHNlbGVjdGlvblxuICAgIGFzeW5jIGdldExhYmVsRm9yU2luZ2xlU2VsZWN0aW9uKCkge1xuICAgICAgICAvLyBGaXJzdCBjaGVjayBpZiB3ZSBoYXZlIHRoZSBsYWJlbCBpbiB0aGUgcmVwb3NpdG9yeVxuICAgICAgICBsZXQgc2VsZWN0ZWRMYWJlbCA9IHRoaXMubGFiZWxSZXBvc2l0b3J5W3RoaXMuc3RhdGVdXG5cbiAgICAgICAgLy8gSWYgbm90IGluIHJlcG9zaXRvcnksIHRyeSB0byBmaW5kIGl0IGluIHRoZSBvcHRpb25zXG4gICAgICAgIGlmIChibGFuayhzZWxlY3RlZExhYmVsKSkge1xuICAgICAgICAgICAgc2VsZWN0ZWRMYWJlbCA9IHRoaXMuZ2V0U2VsZWN0ZWRPcHRpb25MYWJlbCh0aGlzLnN0YXRlKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbGFiZWwgbm90IGZvdW5kIGFuZCBjdXJyZW50IHN0YXRlIG1hdGNoZXMgaW5pdGlhbFN0YXRlLCB1c2UgaW5pdGlhbE9wdGlvbkxhYmVsXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGJsYW5rKHNlbGVjdGVkTGFiZWwpICYmXG4gICAgICAgICAgICBmaWxsZWQodGhpcy5pbml0aWFsT3B0aW9uTGFiZWwpICYmXG4gICAgICAgICAgICB0aGlzLnN0YXRlID09PSB0aGlzLmluaXRpYWxTdGF0ZVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHNlbGVjdGVkTGFiZWwgPSB0aGlzLmluaXRpYWxPcHRpb25MYWJlbFxuXG4gICAgICAgICAgICAvLyBTdG9yZSB0aGUgbGFiZWwgaW4gdGhlIHJlcG9zaXRvcnkgZm9yIGZ1dHVyZSB1c2VcbiAgICAgICAgICAgIGlmIChmaWxsZWQodGhpcy5zdGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhYmVsUmVwb3NpdG9yeVt0aGlzLnN0YXRlXSA9IHNlbGVjdGVkTGFiZWxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBsYWJlbCBzdGlsbCBub3QgZm91bmQgYW5kIGdldE9wdGlvbkxhYmVsVXNpbmcgaXMgYXZhaWxhYmxlLCBmZXRjaCBpdFxuICAgICAgICBlbHNlIGlmIChibGFuayhzZWxlY3RlZExhYmVsKSAmJiB0aGlzLmdldE9wdGlvbkxhYmVsVXNpbmcpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRMYWJlbCA9IGF3YWl0IHRoaXMuZ2V0T3B0aW9uTGFiZWxVc2luZygpXG5cbiAgICAgICAgICAgICAgICAvLyBTdG9yZSB0aGUgZmV0Y2hlZCBsYWJlbCBpbiB0aGUgcmVwb3NpdG9yeVxuICAgICAgICAgICAgICAgIGlmIChmaWxsZWQoc2VsZWN0ZWRMYWJlbCkgJiYgZmlsbGVkKHRoaXMuc3RhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFiZWxSZXBvc2l0b3J5W3RoaXMuc3RhdGVdID0gc2VsZWN0ZWRMYWJlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgb3B0aW9uIGxhYmVsOicsIGVycm9yKVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkTGFiZWwgPSB0aGlzLnN0YXRlIC8vIEZhbGxiYWNrIHRvIHVzaW5nIHRoZSB2YWx1ZSBhcyB0aGUgbGFiZWxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChibGFuayhzZWxlY3RlZExhYmVsKSkge1xuICAgICAgICAgICAgLy8gSWYgc3RpbGwgbm8gbGFiZWwgYW5kIG5vIGdldE9wdGlvbkxhYmVsVXNpbmcsIHVzZSB0aGUgdmFsdWUgYXMgdGhlIGxhYmVsXG4gICAgICAgICAgICBzZWxlY3RlZExhYmVsID0gdGhpcy5zdGF0ZVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkTGFiZWxcbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgbWV0aG9kIHRvIGFkZCBzaW5nbGUgc2VsZWN0aW9uIGRpc3BsYXlcbiAgICBhZGRTaW5nbGVTZWxlY3Rpb25EaXNwbGF5KHNlbGVjdGVkTGFiZWwpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgY29udGFpbmVyIGZvciB0aGUgbGFiZWxcbiAgICAgICAgY29uc3QgbGFiZWxDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgbGFiZWxDb250YWluZXIuY2xhc3NOYW1lID0gJ2ZpLWZvLXNlbGVjdC12YWx1ZS1sYWJlbCdcblxuICAgICAgICBpZiAodGhpcy5pc0h0bWxBbGxvd2VkKSB7XG4gICAgICAgICAgICBsYWJlbENvbnRhaW5lci5pbm5lckhUTUwgPSBzZWxlY3RlZExhYmVsXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYWJlbENvbnRhaW5lci50ZXh0Q29udGVudCA9IHNlbGVjdGVkTGFiZWxcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWREaXNwbGF5LmFwcGVuZENoaWxkKGxhYmVsQ29udGFpbmVyKVxuXG4gICAgICAgIC8vIEFkZCBhIGNyb3NzIGJ1dHRvbiB0byBjbGVhciB0aGUgc2VsZWN0aW9uIGlmIGNhblNlbGVjdFBsYWNlaG9sZGVyIGlzIHRydWVcbiAgICAgICAgaWYgKCF0aGlzLmNhblNlbGVjdFBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG4gICAgICAgIHJlbW92ZUJ1dHRvbi50eXBlID0gJ2J1dHRvbidcbiAgICAgICAgcmVtb3ZlQnV0dG9uLmNsYXNzTmFtZSA9ICdmaS1mby1zZWxlY3QtdmFsdWUtcmVtb3ZlLWJ0bidcbiAgICAgICAgcmVtb3ZlQnV0dG9uLmlubmVySFRNTCA9XG4gICAgICAgICAgICAnPHN2ZyBjbGFzcz1cImZpLWljb24gZmktc2l6ZS1zbVwiIHZpZXdCb3g9XCIwIDAgMjAgMjBcIiBmaWxsPVwiY3VycmVudENvbG9yXCI+PHBhdGggZmlsbC1ydWxlPVwiZXZlbm9kZFwiIGQ9XCJNNC4yOTMgNC4yOTNhMSAxIDAgMDExLjQxNCAwTDEwIDguNTg2bDQuMjkzLTQuMjkzYTEgMSAwIDExMS40MTQgMS40MTRMMTEuNDE0IDEwbDQuMjkzIDQuMjkzYTEgMSAwIDAxLTEuNDE0IDEuNDE0TDEwIDExLjQxNGwtNC4yOTMgNC4yOTNhMSAxIDAgMDEtMS40MTQtMS40MTRMOC41ODYgMTAgNC4yOTMgNS43MDdhMSAxIDAgMDEwLTEuNDE0elwiIGNsaXAtcnVsZT1cImV2ZW5vZGRcIiAvPjwvc3ZnPidcbiAgICAgICAgcmVtb3ZlQnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdDbGVhciBzZWxlY3Rpb24nKVxuXG4gICAgICAgIHJlbW92ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCkgLy8gUHJldmVudCBkcm9wZG93biBmcm9tIHRvZ2dsaW5nXG4gICAgICAgICAgICB0aGlzLnNlbGVjdE9wdGlvbignJykgLy8gU2VsZWN0IGVtcHR5IHZhbHVlIHRvIGNsZWFyXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWRkIGtleWRvd24gZXZlbnQgbGlzdGVuZXIgdG8gaGFuZGxlIHNwYWNlIGtleVxuICAgICAgICByZW1vdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJyAnIHx8IGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKSAvLyBQcmV2ZW50IGV2ZW50IGZyb20gYnViYmxpbmcgdXAgdG8gc2VsZWN0QnV0dG9uXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RPcHRpb24oJycpIC8vIFNlbGVjdCBlbXB0eSB2YWx1ZSB0byBjbGVhclxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWREaXNwbGF5LmFwcGVuZENoaWxkKHJlbW92ZUJ1dHRvbilcbiAgICB9XG5cbiAgICBnZXRTZWxlY3RlZE9wdGlvbkxhYmVsKHZhbHVlKSB7XG4gICAgICAgIC8vIEZpcnN0IGNoZWNrIGlmIHdlIGhhdmUgdGhlIGxhYmVsIGluIHRoZSByZXBvc2l0b3J5XG4gICAgICAgIGlmIChmaWxsZWQodGhpcy5sYWJlbFJlcG9zaXRvcnlbdmFsdWVdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFiZWxSZXBvc2l0b3J5W3ZhbHVlXVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbm90IGluIHJlcG9zaXRvcnksIHNlYXJjaCBpbiBvcHRpb25zXG4gICAgICAgIGxldCBzZWxlY3RlZExhYmVsID0gJydcblxuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb24ub3B0aW9ucyAmJiBBcnJheS5pc0FycmF5KG9wdGlvbi5vcHRpb25zKSkge1xuICAgICAgICAgICAgICAgIC8vIFNlYXJjaCBpbiBvcHRpb24gZ3JvdXBcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGdyb3VwT3B0aW9uIG9mIG9wdGlvbi5vcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChncm91cE9wdGlvbi52YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkTGFiZWwgPSBncm91cE9wdGlvbi5sYWJlbFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIGxhYmVsIGluIHRoZSByZXBvc2l0b3J5IGZvciBmdXR1cmUgdXNlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhYmVsUmVwb3NpdG9yeVt2YWx1ZV0gPSBzZWxlY3RlZExhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb24udmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRMYWJlbCA9IG9wdGlvbi5sYWJlbFxuICAgICAgICAgICAgICAgIC8vIFN0b3JlIHRoZSBsYWJlbCBpbiB0aGUgcmVwb3NpdG9yeSBmb3IgZnV0dXJlIHVzZVxuICAgICAgICAgICAgICAgIHRoaXMubGFiZWxSZXBvc2l0b3J5W3ZhbHVlXSA9IHNlbGVjdGVkTGFiZWxcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkTGFiZWxcbiAgICB9XG5cbiAgICBzZXRVcEV2ZW50TGlzdGVuZXJzKCkge1xuICAgICAgICAvLyBTdG9yZSBldmVudCBsaXN0ZW5lciByZWZlcmVuY2VzIGZvciBsYXRlciBjbGVhbnVwXG4gICAgICAgIHRoaXMuYnV0dG9uQ2xpY2tMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlRHJvcGRvd24oKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jb250YWluZXIuY29udGFpbnMoZXZlbnQudGFyZ2V0KSAmJiB0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VEcm9wZG93bigpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJ1dHRvbktleWRvd25MaXN0ZW5lciA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgLy8gSWYgdGhlIHNlbGVjdCBpcyBkaXNhYmxlZCwgZG9uJ3QgaGFuZGxlIGtleWJvYXJkIGV2ZW50c1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNEaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmhhbmRsZVNlbGVjdEJ1dHRvbktleWRvd24oZXZlbnQpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyb3Bkb3duS2V5ZG93bkxpc3RlbmVyID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgc2VsZWN0IGlzIGRpc2FibGVkLCBkb24ndCBoYW5kbGUga2V5Ym9hcmQgZXZlbnRzXG4gICAgICAgICAgICBpZiAodGhpcy5pc0Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNraXAgbmF2aWdhdGlvbiBpZiBzZWFyY2ggaW5wdXQgaXMgZm9jdXNlZCBhbmQgaXQncyBub3QgVGFiIG9yIEVzY2FwZVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMuaXNTZWFyY2hhYmxlICYmXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5zZWFyY2hJbnB1dCAmJlxuICAgICAgICAgICAgICAgICFbJ1RhYicsICdFc2NhcGUnXS5pbmNsdWRlcyhldmVudC5rZXkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5oYW5kbGVEcm9wZG93bktleWRvd24oZXZlbnQpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBUb2dnbGUgZHJvcGRvd24gd2hlbiBidXR0b24gaXMgY2xpY2tlZFxuICAgICAgICB0aGlzLnNlbGVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYnV0dG9uQ2xpY2tMaXN0ZW5lcilcblxuICAgICAgICAvLyBDbG9zZSBkcm9wZG93biB3aGVuIGNsaWNraW5nIG91dHNpZGVcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcilcblxuICAgICAgICAvLyBLZXlib2FyZCBuYXZpZ2F0aW9uIGZvciB0aGUgc2VsZWN0IGJ1dHRvblxuICAgICAgICB0aGlzLnNlbGVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgJ2tleWRvd24nLFxuICAgICAgICAgICAgdGhpcy5idXR0b25LZXlkb3duTGlzdGVuZXIsXG4gICAgICAgIClcblxuICAgICAgICAvLyBLZXlib2FyZCBuYXZpZ2F0aW9uIHdpdGhpbiBkcm9wZG93blxuICAgICAgICB0aGlzLmRyb3Bkb3duLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmRyb3Bkb3duS2V5ZG93bkxpc3RlbmVyKVxuXG4gICAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgcmVmcmVzaGluZyBzZWxlY3RlZCBvcHRpb24gbGFiZWxzIChvbmx5IGZvciBub24tbXVsdGlwbGUgc2VsZWN0cylcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXRoaXMuaXNNdWx0aXBsZSAmJlxuICAgICAgICAgICAgdGhpcy5saXZld2lyZUlkICYmXG4gICAgICAgICAgICB0aGlzLnN0YXRlUGF0aCAmJlxuICAgICAgICAgICAgdGhpcy5nZXRPcHRpb25MYWJlbFVzaW5nXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoT3B0aW9uTGFiZWxMaXN0ZW5lciA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBldmVudCBpcyBmb3IgdGhpcyBzZWxlY3RcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LmRldGFpbC5saXZld2lyZUlkID09PSB0aGlzLmxpdmV3aXJlSWQgJiZcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuZGV0YWlsLnN0YXRlUGF0aCA9PT0gdGhpcy5zdGF0ZVBhdGhcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVmcmVzaCB0aGUgc2VsZWN0ZWQgb3B0aW9uIGxhYmVsXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxsZWQodGhpcy5zdGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2xlYXIgdGhlIGxhYmVsIGZyb20gdGhlIHJlcG9zaXRvcnkgc28gaXQgY2FuIGJlIGZldGNoZWQgYWdhaW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5sYWJlbFJlcG9zaXRvcnlbdGhpcy5zdGF0ZV1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgbmV3IGxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3TGFiZWwgPSBhd2FpdCB0aGlzLmdldE9wdGlvbkxhYmVsVXNpbmcoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIG5ldyBsYWJlbCBpbiB0aGUgcmVwb3NpdG9yeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWxsZWQobmV3TGFiZWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFiZWxSZXBvc2l0b3J5W3RoaXMuc3RhdGVdID0gbmV3TGFiZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGRpc3BsYXllZCBsYWJlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsQ29udGFpbmVyID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZERpc3BsYXkucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcuZmktZm8tc2VsZWN0LXZhbHVlLWxhYmVsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWxsZWQobGFiZWxDb250YWluZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSHRtbEFsbG93ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsQ29udGFpbmVyLmlubmVySFRNTCA9IG5ld0xhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbENvbnRhaW5lci50ZXh0Q29udGVudCA9IG5ld0xhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGxhYmVsIGluIHRoZSBvcHRpb25zIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU9wdGlvbkxhYmVsSW5MaXN0KHRoaXMuc3RhdGUsIG5ld0xhYmVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRXJyb3IgcmVmcmVzaGluZyBvcHRpb24gbGFiZWw6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAnZmlsYW1lbnQtZm9ybXM6OnNlbGVjdC5yZWZyZXNoU2VsZWN0ZWRPcHRpb25MYWJlbCcsXG4gICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoT3B0aW9uTGFiZWxMaXN0ZW5lcixcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhlbHBlciBtZXRob2QgdG8gdXBkYXRlIGFuIG9wdGlvbidzIGxhYmVsIGluIHRoZSBvcHRpb25zIGxpc3RcbiAgICB1cGRhdGVPcHRpb25MYWJlbEluTGlzdCh2YWx1ZSwgbmV3TGFiZWwpIHtcbiAgICAgICAgLy8gVXBkYXRlIHRoZSBsYWJlbCBpbiB0aGUgcmVwb3NpdG9yeVxuICAgICAgICB0aGlzLmxhYmVsUmVwb3NpdG9yeVt2YWx1ZV0gPSBuZXdMYWJlbFxuXG4gICAgICAgIC8vIEZpbmQgdGhlIG9wdGlvbiBpbiB0aGUgbGlzdFxuICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5nZXRWaXNpYmxlT3B0aW9ucygpXG4gICAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb24uZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJykgPT09IFN0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBDbGVhciB0aGUgb3B0aW9uIGNvbnRlbnRcbiAgICAgICAgICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gJydcblxuICAgICAgICAgICAgICAgIC8vIEFkZCB0aGUgbmV3IGxhYmVsXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNIdG1sQWxsb3dlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYWJlbFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxTcGFuLmlubmVySFRNTCA9IG5ld0xhYmVsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbi5hcHBlbmRDaGlsZChsYWJlbFNwYW4pXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5ld0xhYmVsKSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWxzbyB1cGRhdGUgdGhlIG9wdGlvbiBpbiB0aGUgb3JpZ2luYWwgb3B0aW9ucyBhcnJheVxuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb24ub3B0aW9ucyAmJiBBcnJheS5pc0FycmF5KG9wdGlvbi5vcHRpb25zKSkge1xuICAgICAgICAgICAgICAgIC8vIFNlYXJjaCBpbiBvcHRpb24gZ3JvdXBcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGdyb3VwT3B0aW9uIG9mIG9wdGlvbi5vcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChncm91cE9wdGlvbi52YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwT3B0aW9uLmxhYmVsID0gbmV3TGFiZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbi52YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBvcHRpb24ubGFiZWwgPSBuZXdMYWJlbFxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGRhdGUgdGhlIG9yaWdpbmFsIG9wdGlvbnMgYXMgd2VsbFxuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiB0aGlzLm9yaWdpbmFsT3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbi5vcHRpb25zICYmIEFycmF5LmlzQXJyYXkob3B0aW9uLm9wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgLy8gU2VhcmNoIGluIG9wdGlvbiBncm91cFxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZ3JvdXBPcHRpb24gb2Ygb3B0aW9uLm9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyb3VwT3B0aW9uLnZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBPcHRpb24ubGFiZWwgPSBuZXdMYWJlbFxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9uLnZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIG9wdGlvbi5sYWJlbCA9IG5ld0xhYmVsXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhhbmRsZSBrZXlib2FyZCBldmVudHMgZm9yIHRoZSBzZWxlY3QgYnV0dG9uXG4gICAgaGFuZGxlU2VsZWN0QnV0dG9uS2V5ZG93bihldmVudCkge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCkgLy8gUHJldmVudCBwYWdlIHNjcm9sbGluZ1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRHJvcGRvd24oKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNOZXh0T3B0aW9uKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKSAvLyBQcmV2ZW50IHBhZ2Ugc2Nyb2xsaW5nXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5Ecm9wZG93bigpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb2N1c1ByZXZpb3VzT3B0aW9uKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb2N1c2VkT3B0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFZpc2libGVPcHRpb25zKClbdGhpcy5zZWxlY3RlZEluZGV4XVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvY3VzZWRPcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2N1c2VkT3B0aW9uLmNsaWNrKClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3BlbkRyb3Bkb3duKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ0VudGVyJzpcbiAgICAgICAgICAgICAgICAvLyBEbyBub3RoaW5nIGZvciBFbnRlciBrZXksIGFsbG93IGl0IHRvIHN1Ym1pdCB0aGUgZm9ybVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdFc2NhcGUnOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VEcm9wZG93bigpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdUYWInOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRHJvcGRvd24oKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIGtleWJvYXJkIGV2ZW50cyB3aXRoaW4gdGhlIGRyb3Bkb3duXG4gICAgaGFuZGxlRHJvcGRvd25LZXlkb3duKGV2ZW50KSB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKSAvLyBQcmV2ZW50IHBhZ2Ugc2Nyb2xsaW5nXG4gICAgICAgICAgICAgICAgdGhpcy5mb2N1c05leHRPcHRpb24oKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCkgLy8gUHJldmVudCBwYWdlIHNjcm9sbGluZ1xuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNQcmV2aW91c09wdGlvbigpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9jdXNlZE9wdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFZpc2libGVPcHRpb25zKClbdGhpcy5zZWxlY3RlZEluZGV4XVxuICAgICAgICAgICAgICAgICAgICBpZiAoZm9jdXNlZE9wdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNlZE9wdGlvbi5jbGljaygpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ0VudGVyJzpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvY3VzZWRPcHRpb24gPVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRWaXNpYmxlT3B0aW9ucygpW3RoaXMuc2VsZWN0ZWRJbmRleF1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvY3VzZWRPcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzZWRPcHRpb24uY2xpY2soKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgbm8gb3B0aW9uIGlzIGZvY3VzZWQsIHN1Ym1pdCB0aGUgZm9ybVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtID0gdGhpcy5lbGVtZW50LmNsb3Nlc3QoJ2Zvcm0nKVxuICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5zdWJtaXQoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdFc2NhcGUnOlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRHJvcGRvd24oKVxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0QnV0dG9uLmZvY3VzKClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAnVGFiJzpcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRHJvcGRvd24oKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGVEcm9wZG93bigpIHtcbiAgICAgICAgLy8gSWYgdGhlIHNlbGVjdCBpcyBkaXNhYmxlZCwgZG9uJ3QgYWxsb3cgdG9nZ2xpbmcgdGhlIGRyb3Bkb3duXG4gICAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgZHJvcGRvd24gaXMgYWxyZWFkeSBvcGVuLCBjbG9zZSBpdCBhbmQgZXhpdFxuICAgICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VEcm9wZG93bigpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEluIG11bHRpcGxlIHNlbGVjdGlvbiBtb2RlIHdpdGggbm8gc2VhcmNoLCBjaGVjayBpZiB0aGVyZSBhcmUgYW55IGF2YWlsYWJsZSBvcHRpb25zXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuaXNNdWx0aXBsZSAmJlxuICAgICAgICAgICAgIXRoaXMuaXNTZWFyY2hhYmxlICYmXG4gICAgICAgICAgICAhdGhpcy5oYXNBdmFpbGFibGVPcHRpb25zKClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gLy8gTm8gYXZhaWxhYmxlIG9wdGlvbnMsIGRvbid0IG9wZW4gZHJvcGRvd25cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9wZW4gdGhlIGRyb3Bkb3duXG4gICAgICAgIHRoaXMub3BlbkRyb3Bkb3duKClcbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgbWV0aG9kIHRvIGNoZWNrIGlmIHRoZXJlIGFyZSBhbnkgYXZhaWxhYmxlIG9wdGlvbnNcbiAgICBoYXNBdmFpbGFibGVPcHRpb25zKCkge1xuICAgICAgICAvLyBGb3IgbXVsdGlwbGUgc2VsZWN0aW9uLCB3ZSBuZWVkIHRvIGNoZWNrIGlmIHRoZXJlIGFyZSBhbnkgb3B0aW9ucyB0aGF0IGFyZW4ndCBhbHJlYWR5IHNlbGVjdGVkXG5cbiAgICAgICAgZm9yIChjb25zdCBvcHRpb24gb2YgdGhpcy5vcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9uLm9wdGlvbnMgJiYgQXJyYXkuaXNBcnJheShvcHRpb24ub3B0aW9ucykpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGFuIG9wdGlvbiBncm91cFxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZ3JvdXBPcHRpb24gb2Ygb3B0aW9uLm9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgIUFycmF5LmlzQXJyYXkodGhpcy5zdGF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLnN0YXRlLmluY2x1ZGVzKGdyb3VwT3B0aW9uLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlIC8vIEF0IGxlYXN0IG9uZSBvcHRpb24gaXMgYXZhaWxhYmxlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICFBcnJheS5pc0FycmF5KHRoaXMuc3RhdGUpIHx8XG4gICAgICAgICAgICAgICAgIXRoaXMuc3RhdGUuaW5jbHVkZXMob3B0aW9uLnZhbHVlKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWUgLy8gQXQgbGVhc3Qgb25lIG9wdGlvbiBpcyBhdmFpbGFibGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vIGF2YWlsYWJsZSBvcHRpb25zIGZvdW5kXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGFzeW5jIG9wZW5Ecm9wZG93bigpIHtcbiAgICAgICAgLy8gTWFrZSBkcm9wZG93biB2aXNpYmxlIGJ1dCB3aXRoIHBvc2l0aW9uIGZpeGVkIChvciBhYnNvbHV0ZSBpbiBtb2RhbHMpIGFuZCBvcGFjaXR5IDAgZm9yIG1lYXN1cmVtZW50XG4gICAgICAgIHRoaXMuZHJvcGRvd24uc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgICAgICAgdGhpcy5kcm9wZG93bi5zdHlsZS5vcGFjaXR5ID0gJzAnXG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHNlbGVjdCBpcyBpbnNpZGUgYSBtb2RhbFxuICAgICAgICBjb25zdCBpc0luTW9kYWwgPSB0aGlzLnNlbGVjdEJ1dHRvbi5jbG9zZXN0KCcuZmktbW9kYWwnKSAhPT0gbnVsbFxuICAgICAgICB0aGlzLmRyb3Bkb3duLnN0eWxlLnBvc2l0aW9uID0gaXNJbk1vZGFsID8gJ2Fic29sdXRlJyA6ICdmaXhlZCdcbiAgICAgICAgLy8gU2V0IHdpZHRoIGltbWVkaWF0ZWx5IHRvIG1hdGNoIHRoZSBzZWxlY3QgYnV0dG9uXG4gICAgICAgIHRoaXMuZHJvcGRvd24uc3R5bGUud2lkdGggPSBgJHt0aGlzLnNlbGVjdEJ1dHRvbi5vZmZzZXRXaWR0aH1weGBcbiAgICAgICAgdGhpcy5zZWxlY3RCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKVxuICAgICAgICB0aGlzLmlzT3BlbiA9IHRydWVcblxuICAgICAgICAvLyBQb3NpdGlvbiB0aGUgZHJvcGRvd24gdXNpbmcgRmxvYXRpbmcgVUlcbiAgICAgICAgdGhpcy5wb3NpdGlvbkRyb3Bkb3duKClcblxuICAgICAgICAvLyBBZGQgcmVzaXplIGxpc3RlbmVyIHRvIHVwZGF0ZSB3aWR0aCBhbmQgcG9zaXRpb24gd2hlbiB3aW5kb3cgaXMgcmVzaXplZFxuICAgICAgICBpZiAoIXRoaXMucmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMucmVzaXplTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHdpZHRoIHRvIG1hdGNoIHRoZSBzZWxlY3QgYnV0dG9uXG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5zdHlsZS53aWR0aCA9IGAke3RoaXMuc2VsZWN0QnV0dG9uLm9mZnNldFdpZHRofXB4YFxuICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb25Ecm9wZG93bigpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemVMaXN0ZW5lcilcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBzY3JvbGwgbGlzdGVuZXIgdG8gdXBkYXRlIHBvc2l0aW9uIHdoZW4gcGFnZSBpcyBzY3JvbGxlZFxuICAgICAgICBpZiAoIXRoaXMuc2Nyb2xsTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsTGlzdGVuZXIgPSAoKSA9PiB0aGlzLnBvc2l0aW9uRHJvcGRvd24oKVxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuc2Nyb2xsTGlzdGVuZXIsIHRydWUpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIGRyb3Bkb3duIHZpc2libGVcbiAgICAgICAgdGhpcy5kcm9wZG93bi5zdHlsZS5vcGFjaXR5ID0gJzEnXG5cbiAgICAgICAgLy8gSWYgaGFzRHluYW1pY09wdGlvbnMgaXMgdHJ1ZSwgZmV0Y2ggb3B0aW9uc1xuICAgICAgICBpZiAodGhpcy5oYXNEeW5hbWljT3B0aW9ucyAmJiB0aGlzLmdldE9wdGlvbnNVc2luZykge1xuICAgICAgICAgICAgLy8gU2hvdyBsb2FkaW5nIG1lc3NhZ2VcbiAgICAgICAgICAgIHRoaXMuc2hvd0xvYWRpbmdTdGF0ZShmYWxzZSlcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBGZXRjaCBvcHRpb25zXG4gICAgICAgICAgICAgICAgY29uc3QgZmV0Y2hlZE9wdGlvbnMgPSBhd2FpdCB0aGlzLmdldE9wdGlvbnNVc2luZygpXG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgb3B0aW9uc1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IGZldGNoZWRPcHRpb25zXG4gICAgICAgICAgICAgICAgdGhpcy5vcmlnaW5hbE9wdGlvbnMgPSBKU09OLnBhcnNlKFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShmZXRjaGVkT3B0aW9ucyksXG4gICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAgICAgLy8gUG9wdWxhdGUgdGhlIGxhYmVsIHJlcG9zaXRvcnkgd2l0aCB0aGUgZmV0Y2hlZCBvcHRpb25zXG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZUxhYmVsUmVwb3NpdG9yeUZyb21PcHRpb25zKGZldGNoZWRPcHRpb25zKVxuXG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyIG9wdGlvbnNcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlck9wdGlvbnMoKVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBvcHRpb25zOicsIGVycm9yKVxuXG4gICAgICAgICAgICAgICAgLy8gSGlkZSBsb2FkaW5nIHN0YXRlXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlTG9hZGluZ1N0YXRlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhpZGUgYW55IGV4aXN0aW5nIG1lc3NhZ2VzIChsaWtlIFwiTm8gcmVzdWx0c1wiKVxuICAgICAgICB0aGlzLmhpZGVMb2FkaW5nU3RhdGUoKVxuXG4gICAgICAgIC8vIElmIHNlYXJjaGFibGUsIGZvY3VzIHRoZSBzZWFyY2ggaW5wdXRcbiAgICAgICAgaWYgKHRoaXMuaXNTZWFyY2hhYmxlICYmIHRoaXMuc2VhcmNoSW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQudmFsdWUgPSAnJ1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5mb2N1cygpXG5cbiAgICAgICAgICAgIC8vIEFsd2F5cyByZXNldCBzZWFyY2ggcXVlcnkgYW5kIG9wdGlvbnMgd2hlbiByZW9wZW5pbmdcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSAnJ1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLm9yaWdpbmFsT3B0aW9ucykpXG4gICAgICAgICAgICB0aGlzLnJlbmRlck9wdGlvbnMoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRm9jdXMgdGhlIGZpcnN0IG9wdGlvbiBvciB0aGUgc2VsZWN0ZWQgb3B0aW9uXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMVxuXG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBpbmRleCBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9uXG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5nZXRWaXNpYmxlT3B0aW9ucygpXG4gICAgICAgICAgICBpZiAodGhpcy5pc011bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zdGF0ZSkgJiYgdGhpcy5zdGF0ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLXZhbHVlJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uc1tpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKSA9PT0gdGhpcy5zdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgbm8gb3B0aW9uIGlzIHNlbGVjdGVkLCBmb2N1cyB0aGUgZmlyc3Qgb3B0aW9uXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4ID09PSAtMSAmJiBvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZvY3VzIHRoZSBzZWxlY3RlZCBvcHRpb25cbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnNbdGhpcy5zZWxlY3RlZEluZGV4XS5jbGFzc0xpc3QuYWRkKCdmaS1zZWxlY3RlZCcpXG4gICAgICAgICAgICAgICAgb3B0aW9uc1t0aGlzLnNlbGVjdGVkSW5kZXhdLmZvY3VzKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBvc2l0aW9uRHJvcGRvd24oKSB7XG4gICAgICAgIGNvbnN0IHBsYWNlbWVudCA9IHRoaXMucG9zaXRpb24gPT09ICd0b3AnID8gJ3RvcC1zdGFydCcgOiAnYm90dG9tLXN0YXJ0J1xuICAgICAgICBjb25zdCBtaWRkbGV3YXJlID0gW1xuICAgICAgICAgICAgb2Zmc2V0KDQpLCAvLyBBZGQgc29tZSBzcGFjZSBiZXR3ZWVuIGJ1dHRvbiBhbmQgZHJvcGRvd25cbiAgICAgICAgICAgIHNoaWZ0KHsgcGFkZGluZzogNSB9KSwgLy8gS2VlcCB3aXRoaW4gdmlld3BvcnQgd2l0aCBzb21lIHBhZGRpbmdcbiAgICAgICAgXVxuXG4gICAgICAgIC8vIE9ubHkgdXNlIGZsaXAgbWlkZGxld2FyZSBpZiBwb3NpdGlvbiBpcyBub3QgZXhwbGljaXRseSBzZXQgdG8gJ3RvcCcgb3IgJ2JvdHRvbSdcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24gIT09ICd0b3AnICYmIHRoaXMucG9zaXRpb24gIT09ICdib3R0b20nKSB7XG4gICAgICAgICAgICBtaWRkbGV3YXJlLnB1c2goZmxpcCgpKSAvLyBGbGlwIHRvIHRvcCBpZiBub3QgZW5vdWdoIHNwYWNlIGF0IGJvdHRvbVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHNlbGVjdCBpcyBpbnNpZGUgYSBtb2RhbFxuICAgICAgICBjb25zdCBpc0luTW9kYWwgPSB0aGlzLnNlbGVjdEJ1dHRvbi5jbG9zZXN0KCcuZmktbW9kYWwnKSAhPT0gbnVsbFxuXG4gICAgICAgIGNvbXB1dGVQb3NpdGlvbih0aGlzLnNlbGVjdEJ1dHRvbiwgdGhpcy5kcm9wZG93biwge1xuICAgICAgICAgICAgcGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgICAgICAgICBtaWRkbGV3YXJlOiBtaWRkbGV3YXJlLFxuICAgICAgICAgICAgc3RyYXRlZ3k6IGlzSW5Nb2RhbCA/ICdhYnNvbHV0ZScgOiAnZml4ZWQnLFxuICAgICAgICB9KS50aGVuKCh7IHgsIHkgfSkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmRyb3Bkb3duLnN0eWxlLCB7XG4gICAgICAgICAgICAgICAgbGVmdDogYCR7eH1weGAsXG4gICAgICAgICAgICAgICAgdG9wOiBgJHt5fXB4YCxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY2xvc2VEcm9wZG93bigpIHtcbiAgICAgICAgdGhpcy5kcm9wZG93bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgIHRoaXMuc2VsZWN0QnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpXG4gICAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2VcblxuICAgICAgICAvLyBSZW1vdmUgcmVzaXplIGxpc3RlbmVyXG4gICAgICAgIGlmICh0aGlzLnJlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemVMaXN0ZW5lcilcbiAgICAgICAgICAgIHRoaXMucmVzaXplTGlzdGVuZXIgPSBudWxsXG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgc2Nyb2xsIGxpc3RlbmVyXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbExpc3RlbmVyKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5zY3JvbGxMaXN0ZW5lciwgdHJ1ZSlcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsTGlzdGVuZXIgPSBudWxsXG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgZm9jdXMgZnJvbSBhbGwgb3B0aW9uc1xuICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5nZXRWaXNpYmxlT3B0aW9ucygpXG4gICAgICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgICBvcHRpb24uY2xhc3NMaXN0LnJlbW92ZSgnZmktc2VsZWN0ZWQnKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZvY3VzTmV4dE9wdGlvbigpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuZ2V0VmlzaWJsZU9wdGlvbnMoKVxuICAgICAgICBpZiAob3B0aW9ucy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gICAgICAgIC8vIFJlbW92ZSBmb2N1cyBmcm9tIGN1cnJlbnQgb3B0aW9uXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPj0gMCAmJiB0aGlzLnNlbGVjdGVkSW5kZXggPCBvcHRpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgb3B0aW9uc1t0aGlzLnNlbGVjdGVkSW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpLXNlbGVjdGVkJylcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlJ3JlIGF0IHRoZSBsYXN0IG9wdGlvbiBhbmQgc2VhcmNoIGlucHV0IGlzIGF2YWlsYWJsZSwgZm9jdXMgdGhlIHNlYXJjaCBpbnB1dFxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPT09IG9wdGlvbnMubGVuZ3RoIC0gMSAmJlxuICAgICAgICAgICAgdGhpcy5pc1NlYXJjaGFibGUgJiZcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMVxuICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5mb2N1cygpXG4gICAgICAgICAgICAvLyBDbGVhciBhcmlhLWFjdGl2ZWRlc2NlbmRhbnQgd2hlbiBmb2N1cyBtb3ZlcyB0byBzZWFyY2ggaW5wdXRcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd24ucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBGb2N1cyBuZXh0IG9wdGlvbiAod3JhcCBhcm91bmQgdG8gdGhlIGZpcnN0IG9wdGlvbiBpZiBhdCB0aGUgZW5kKVxuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAodGhpcy5zZWxlY3RlZEluZGV4ICsgMSkgJSBvcHRpb25zLmxlbmd0aFxuICAgICAgICBvcHRpb25zW3RoaXMuc2VsZWN0ZWRJbmRleF0uY2xhc3NMaXN0LmFkZCgnZmktc2VsZWN0ZWQnKVxuICAgICAgICBvcHRpb25zW3RoaXMuc2VsZWN0ZWRJbmRleF0uZm9jdXMoKVxuXG4gICAgICAgIC8vIFNldCBhcmlhLWFjdGl2ZWRlc2NlbmRhbnQgdG8gdGhlIElEIG9mIHRoZSBmb2N1c2VkIG9wdGlvblxuICAgICAgICBpZiAob3B0aW9uc1t0aGlzLnNlbGVjdGVkSW5kZXhdLmlkKSB7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgICAgICAnYXJpYS1hY3RpdmVkZXNjZW5kYW50JyxcbiAgICAgICAgICAgICAgICBvcHRpb25zW3RoaXMuc2VsZWN0ZWRJbmRleF0uaWQsXG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNjcm9sbE9wdGlvbkludG9WaWV3KG9wdGlvbnNbdGhpcy5zZWxlY3RlZEluZGV4XSlcbiAgICB9XG5cbiAgICBmb2N1c1ByZXZpb3VzT3B0aW9uKCkge1xuICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5nZXRWaXNpYmxlT3B0aW9ucygpXG4gICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgICAgICAgLy8gUmVtb3ZlIGZvY3VzIGZyb20gY3VycmVudCBvcHRpb25cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA+PSAwICYmIHRoaXMuc2VsZWN0ZWRJbmRleCA8IG9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBvcHRpb25zW3RoaXMuc2VsZWN0ZWRJbmRleF0uY2xhc3NMaXN0LnJlbW92ZSgnZmktc2VsZWN0ZWQnKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2UncmUgYXQgdGhlIGZpcnN0IG9wdGlvbiBvciBoYXZlbid0IHNlbGVjdGVkIGFuIG9wdGlvbiB5ZXQsIGZvY3VzIHRoZSBzZWFyY2ggaW5wdXQgaWYgYXZhaWxhYmxlXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICh0aGlzLnNlbGVjdGVkSW5kZXggPT09IDAgfHwgdGhpcy5zZWxlY3RlZEluZGV4ID09PSAtMSkgJiZcbiAgICAgICAgICAgIHRoaXMuaXNTZWFyY2hhYmxlICYmXG4gICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0XG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTFcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQuZm9jdXMoKVxuICAgICAgICAgICAgLy8gQ2xlYXIgYXJpYS1hY3RpdmVkZXNjZW5kYW50IHdoZW4gZm9jdXMgbW92ZXMgdG8gc2VhcmNoIGlucHV0XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1hY3RpdmVkZXNjZW5kYW50JylcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRm9jdXMgcHJldmlvdXMgb3B0aW9uICh3cmFwIGFyb3VuZCB0byB0aGUgbGFzdCBvcHRpb24gaWYgYXQgdGhlIGJlZ2lubmluZylcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID1cbiAgICAgICAgICAgICh0aGlzLnNlbGVjdGVkSW5kZXggLSAxICsgb3B0aW9ucy5sZW5ndGgpICUgb3B0aW9ucy5sZW5ndGhcbiAgICAgICAgb3B0aW9uc1t0aGlzLnNlbGVjdGVkSW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2ZpLXNlbGVjdGVkJylcbiAgICAgICAgb3B0aW9uc1t0aGlzLnNlbGVjdGVkSW5kZXhdLmZvY3VzKClcblxuICAgICAgICAvLyBTZXQgYXJpYS1hY3RpdmVkZXNjZW5kYW50IHRvIHRoZSBJRCBvZiB0aGUgZm9jdXNlZCBvcHRpb25cbiAgICAgICAgaWYgKG9wdGlvbnNbdGhpcy5zZWxlY3RlZEluZGV4XS5pZCkge1xuICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsXG4gICAgICAgICAgICAgICAgb3B0aW9uc1t0aGlzLnNlbGVjdGVkSW5kZXhdLmlkLFxuICAgICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY3JvbGxPcHRpb25JbnRvVmlldyhvcHRpb25zW3RoaXMuc2VsZWN0ZWRJbmRleF0pXG4gICAgfVxuXG4gICAgc2Nyb2xsT3B0aW9uSW50b1ZpZXcob3B0aW9uKSB7XG4gICAgICAgIGlmICghb3B0aW9uKSByZXR1cm5cblxuICAgICAgICBjb25zdCBkcm9wZG93blJlY3QgPSB0aGlzLmRyb3Bkb3duLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGNvbnN0IG9wdGlvblJlY3QgPSBvcHRpb24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgICBpZiAob3B0aW9uUmVjdC5ib3R0b20gPiBkcm9wZG93blJlY3QuYm90dG9tKSB7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duLnNjcm9sbFRvcCArPSBvcHRpb25SZWN0LmJvdHRvbSAtIGRyb3Bkb3duUmVjdC5ib3R0b21cbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25SZWN0LnRvcCA8IGRyb3Bkb3duUmVjdC50b3ApIHtcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd24uc2Nyb2xsVG9wIC09IGRyb3Bkb3duUmVjdC50b3AgLSBvcHRpb25SZWN0LnRvcFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0VmlzaWJsZU9wdGlvbnMoKSB7XG4gICAgICAgIGxldCB1bmdyb3VwZWRPcHRpb25zID0gW11cblxuICAgICAgICAvLyBDaGVjayBpZiBvcHRpb25zTGlzdCBpdHNlbGYgaGFzIHRoZSBmaS1kcm9wZG93bi1saXN0IGNsYXNzIChubyBncm91cGVkIG9wdGlvbnMgY2FzZSlcbiAgICAgICAgaWYgKHRoaXMub3B0aW9uc0xpc3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaS1kcm9wZG93bi1saXN0JykpIHtcbiAgICAgICAgICAgIC8vIEdldCBkaXJlY3QgY2hpbGQgb3B0aW9ucyB3aGVuIHRoZXJlIGFyZSBubyBncm91cHNcbiAgICAgICAgICAgIHVuZ3JvdXBlZE9wdGlvbnMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uc0xpc3QucXVlcnlTZWxlY3RvckFsbCgnOnNjb3BlID4gbGlbcm9sZT1cIm9wdGlvblwiXScpLFxuICAgICAgICAgICAgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gR2V0IG9wdGlvbnMgZnJvbSBuZXN0ZWQgdW5ncm91cGVkIGxpc3Qgd2hlbiB0aGVyZSBhcmUgZ3JvdXBzXG4gICAgICAgICAgICB1bmdyb3VwZWRPcHRpb25zID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnNMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgICAgICAgICc6c2NvcGUgPiB1bC5maS1kcm9wZG93bi1saXN0ID4gbGlbcm9sZT1cIm9wdGlvblwiXScsXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdldCBhbGwgb3B0aW9uIGVsZW1lbnRzIHRoYXQgYXJlIGluIG9wdGlvbiBncm91cHNcbiAgICAgICAgY29uc3QgZ3JvdXBPcHRpb25zID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0xpc3QucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgICAgICAnbGkuZmktZm8tc2VsZWN0LW9wdGlvbi1ncm91cCA+IHVsID4gbGlbcm9sZT1cIm9wdGlvblwiXScsXG4gICAgICAgICAgICApLFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQ29tYmluZSBhbmQgcmV0dXJuIGFsbCBvcHRpb25zXG4gICAgICAgIHJldHVybiBbLi4udW5ncm91cGVkT3B0aW9ucywgLi4uZ3JvdXBPcHRpb25zXVxuICAgIH1cblxuICAgIGdldFNlbGVjdGVkT3B0aW9uTGFiZWxzKCkge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5zdGF0ZSkgfHwgdGhpcy5zdGF0ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB7fVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGFiZWxzID0ge31cblxuICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHRoaXMuc3RhdGUpIHtcbiAgICAgICAgICAgIC8vIFNlYXJjaCBpbiBmbGF0IG9wdGlvbnNcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uLm9wdGlvbnMgJiYgQXJyYXkuaXNBcnJheShvcHRpb24ub3B0aW9ucykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2VhcmNoIGluIG9wdGlvbiBncm91cFxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGdyb3VwT3B0aW9uIG9mIG9wdGlvbi5vcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ3JvdXBPcHRpb24udmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxzW3ZhbHVlXSA9IGdyb3VwT3B0aW9uLmxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQpIGJyZWFrXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb24udmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsc1t2YWx1ZV0gPSBvcHRpb24ubGFiZWxcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBub3QgZm91bmQsIGRvbid0IGFkZCBhIGZhbGxiYWNrXG4gICAgICAgICAgICAvLyBUaGlzIGFsbG93cyB0aGUgY2FsbGVyIHRvIGtub3cgd2hpY2ggbGFiZWxzIGFyZSBtaXNzaW5nXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGFiZWxzXG4gICAgfVxuXG4gICAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gZXZlbnQudGFyZ2V0LnZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIHRoaXMuc2VhcmNoUXVlcnkgPSBxdWVyeVxuXG4gICAgICAgIC8vIENsZWFyIGFueSBleGlzdGluZyB0aW1lb3V0XG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNlYXJjaFRpbWVvdXQpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBxdWVyeSBpcyBlbXB0eSwgcmVzdG9yZSBvcmlnaW5hbCBvcHRpb25zIGFuZCBleGl0IGVhcmx5XG4gICAgICAgIGlmIChxdWVyeSA9PT0gJycpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5vcmlnaW5hbE9wdGlvbnMpKVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJPcHRpb25zKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBkeW5hbWljIHNlYXJjaCByZXN1bHRzIG9yIG5vIHNlYXJjaCBmdW5jdGlvbiwgZmlsdGVyIGxvY2FsbHkgYW5kIGV4aXQgZWFybHlcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXRoaXMuZ2V0U2VhcmNoUmVzdWx0c1VzaW5nIHx8XG4gICAgICAgICAgICB0eXBlb2YgdGhpcy5nZXRTZWFyY2hSZXN1bHRzVXNpbmcgIT09ICdmdW5jdGlvbicgfHxcbiAgICAgICAgICAgICF0aGlzLmhhc0R5bmFtaWNTZWFyY2hSZXN1bHRzXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5maWx0ZXJPcHRpb25zKHF1ZXJ5KVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBIYW5kbGUgc2VydmVyLXNpZGUgc2VhcmNoIHdpdGggZGVib3VuY2VcbiAgICAgICAgdGhpcy5zZWFyY2hUaW1lb3V0ID0gc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIFNob3cgc2VhcmNoaW5nIHN0YXRlXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TG9hZGluZ1N0YXRlKHRydWUpXG5cbiAgICAgICAgICAgICAgICAvLyBHZXQgc2VhcmNoIHJlc3VsdHMgZnJvbSBiYWNrZW5kXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHRoaXMuZ2V0U2VhcmNoUmVzdWx0c1VzaW5nKHF1ZXJ5KVxuXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIG9wdGlvbnMgd2l0aCBzZWFyY2ggcmVzdWx0c1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IHJlc3VsdHNcblxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgbGFiZWwgcmVwb3NpdG9yeSB3aXRoIHRoZSBzZWFyY2ggcmVzdWx0c1xuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVMYWJlbFJlcG9zaXRvcnlGcm9tT3B0aW9ucyhyZXN1bHRzKVxuXG4gICAgICAgICAgICAgICAgLy8gSGlkZSBsb2FkaW5nIHN0YXRlIGFuZCByZW5kZXIgb3B0aW9uc1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUxvYWRpbmdTdGF0ZSgpXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJPcHRpb25zKClcblxuICAgICAgICAgICAgICAgIC8vIFJlZXZhbHVhdGUgZHJvcGRvd24gcG9zaXRpb24gYWZ0ZXIgc2VhcmNoIHJlc3VsdHMgYXJlIHVwZGF0ZWRcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3NpdGlvbkRyb3Bkb3duKClcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBJZiBubyByZXN1bHRzIGZvdW5kLCBzaG93IFwiTm8gcmVzdWx0c1wiIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dOb1Jlc3VsdHNNZXNzYWdlKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIHNlYXJjaCByZXN1bHRzOicsIGVycm9yKVxuXG4gICAgICAgICAgICAgICAgLy8gSGlkZSBsb2FkaW5nIHN0YXRlIGFuZCByZXN0b3JlIG9yaWdpbmFsIG9wdGlvbnNcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVMb2FkaW5nU3RhdGUoKVxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5vcmlnaW5hbE9wdGlvbnMpKVxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyT3B0aW9ucygpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMuc2VhcmNoRGVib3VuY2UpXG4gICAgfVxuXG4gICAgc2hvd0xvYWRpbmdTdGF0ZShpc1NlYXJjaGluZyA9IGZhbHNlKSB7XG4gICAgICAgIC8vIENsZWFyIG9wdGlvbnMgbGlzdCBpZiBpdCdzIGluIHRoZSBET01cbiAgICAgICAgaWYgKHRoaXMub3B0aW9uc0xpc3QucGFyZW50Tm9kZSA9PT0gdGhpcy5kcm9wZG93bikge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zTGlzdC5pbm5lckhUTUwgPSAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIGFueSBleGlzdGluZyBtZXNzYWdlXG4gICAgICAgIHRoaXMuaGlkZUxvYWRpbmdTdGF0ZSgpXG5cbiAgICAgICAgLy8gQWRkIGxvYWRpbmcgbWVzc2FnZVxuICAgICAgICBjb25zdCBsb2FkaW5nSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGxvYWRpbmdJdGVtLmNsYXNzTmFtZSA9ICdmaS1mby1zZWxlY3QtbWVzc2FnZSdcbiAgICAgICAgbG9hZGluZ0l0ZW0udGV4dENvbnRlbnQgPSBpc1NlYXJjaGluZ1xuICAgICAgICAgICAgPyB0aGlzLnNlYXJjaGluZ01lc3NhZ2VcbiAgICAgICAgICAgIDogdGhpcy5sb2FkaW5nTWVzc2FnZVxuICAgICAgICB0aGlzLmRyb3Bkb3duLmFwcGVuZENoaWxkKGxvYWRpbmdJdGVtKVxuICAgIH1cblxuICAgIGhpZGVMb2FkaW5nU3RhdGUoKSB7XG4gICAgICAgIC8vIFJlbW92ZSBsb2FkaW5nIG1lc3NhZ2VcbiAgICAgICAgY29uc3QgbG9hZGluZ0l0ZW0gPSB0aGlzLmRyb3Bkb3duLnF1ZXJ5U2VsZWN0b3IoJy5maS1mby1zZWxlY3QtbWVzc2FnZScpXG4gICAgICAgIGlmIChsb2FkaW5nSXRlbSkge1xuICAgICAgICAgICAgbG9hZGluZ0l0ZW0ucmVtb3ZlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3dOb1Jlc3VsdHNNZXNzYWdlKCkge1xuICAgICAgICAvLyBDbGVhciBvcHRpb25zIGxpc3QgaWYgaXQncyBpbiB0aGUgRE9NIGFuZCBub3QgYWxyZWFkeSBlbXB0eVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNMaXN0LnBhcmVudE5vZGUgPT09IHRoaXMuZHJvcGRvd24gJiZcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0xpc3QuY2hpbGRyZW4ubGVuZ3RoID4gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0xpc3QuaW5uZXJIVE1MID0gJydcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBhbnkgZXhpc3RpbmcgbWVzc2FnZVxuICAgICAgICB0aGlzLmhpZGVMb2FkaW5nU3RhdGUoKVxuXG4gICAgICAgIC8vIEFkZCBcIk5vIHJlc3VsdHNcIiBtZXNzYWdlXG4gICAgICAgIGNvbnN0IG5vUmVzdWx0c0l0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBub1Jlc3VsdHNJdGVtLmNsYXNzTmFtZSA9ICdmaS1mby1zZWxlY3QtbWVzc2FnZSdcbiAgICAgICAgbm9SZXN1bHRzSXRlbS50ZXh0Q29udGVudCA9IHRoaXMubm9TZWFyY2hSZXN1bHRzTWVzc2FnZVxuICAgICAgICB0aGlzLmRyb3Bkb3duLmFwcGVuZENoaWxkKG5vUmVzdWx0c0l0ZW0pXG4gICAgfVxuXG4gICAgZmlsdGVyT3B0aW9ucyhxdWVyeSkge1xuICAgICAgICBjb25zdCBzZWFyY2hJbkxhYmVsID0gdGhpcy5zZWFyY2hhYmxlT3B0aW9uRmllbGRzLmluY2x1ZGVzKCdsYWJlbCcpXG4gICAgICAgIGNvbnN0IHNlYXJjaEluVmFsdWUgPSB0aGlzLnNlYXJjaGFibGVPcHRpb25GaWVsZHMuaW5jbHVkZXMoJ3ZhbHVlJylcblxuICAgICAgICBjb25zdCBmaWx0ZXJlZE9wdGlvbnMgPSBbXVxuXG4gICAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIHRoaXMub3JpZ2luYWxPcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9uLm9wdGlvbnMgJiYgQXJyYXkuaXNBcnJheShvcHRpb24ub3B0aW9ucykpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGFuIG9wdGlvbiBncm91cFxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkR3JvdXBPcHRpb25zID0gb3B0aW9uLm9wdGlvbnMuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAoZ3JvdXBPcHRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBvcHRpb24gbWF0Y2hlcyB0aGUgc2VhcmNoIHF1ZXJ5IGluIGFueSBvZiB0aGUgc3BlY2lmaWVkIGZpZWxkc1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoc2VhcmNoSW5MYWJlbCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cE9wdGlvbi5sYWJlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5pbmNsdWRlcyhxdWVyeSkpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlYXJjaEluVmFsdWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nKGdyb3VwT3B0aW9uLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5pbmNsdWRlcyhxdWVyeSkpXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlcmVkR3JvdXBPcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRPcHRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IG9wdGlvbi5sYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IGZpbHRlcmVkR3JvdXBPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgKHNlYXJjaEluTGFiZWwgJiYgb3B0aW9uLmxhYmVsLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnkpKSB8fFxuICAgICAgICAgICAgICAgIChzZWFyY2hJblZhbHVlICYmXG4gICAgICAgICAgICAgICAgICAgIFN0cmluZyhvcHRpb24udmFsdWUpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnkpKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIHJlZ3VsYXIgb3B0aW9uXG4gICAgICAgICAgICAgICAgZmlsdGVyZWRPcHRpb25zLnB1c2gob3B0aW9uKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0gZmlsdGVyZWRPcHRpb25zXG5cbiAgICAgICAgLy8gUmVuZGVyIGZpbHRlcmVkIG9wdGlvbnNcbiAgICAgICAgdGhpcy5yZW5kZXJPcHRpb25zKClcblxuICAgICAgICAvLyBJZiBubyBvcHRpb25zIGZvdW5kLCBzaG93IFwiTm8gcmVzdWx0c1wiIG1lc3NhZ2VcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd05vUmVzdWx0c01lc3NhZ2UoKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVldmFsdWF0ZSBkcm9wZG93biBwb3NpdGlvbiBhZnRlciBzZWFyY2ggcmVzdWx0cyBhcmUgdXBkYXRlZFxuICAgICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb25Ecm9wZG93bigpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxlY3RPcHRpb24odmFsdWUpIHtcbiAgICAgICAgLy8gSWYgdGhlIHNlbGVjdCBpcyBkaXNhYmxlZCwgZG9uJ3QgYWxsb3cgc2VsZWN0aW9uXG4gICAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzTXVsdGlwbGUpIHtcbiAgICAgICAgICAgIC8vIEZvciBzaW5nbGUgc2VsZWN0aW9uIC0gc2ltcGxlciBjYXNlLCBoYW5kbGUgZmlyc3RcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB2YWx1ZVxuICAgICAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZERpc3BsYXkoKVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJPcHRpb25zKClcbiAgICAgICAgICAgIHRoaXMuY2xvc2VEcm9wZG93bigpXG4gICAgICAgICAgICB0aGlzLnNlbGVjdEJ1dHRvbi5mb2N1cygpXG4gICAgICAgICAgICB0aGlzLm9uU3RhdGVDaGFuZ2UodGhpcy5zdGF0ZSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRm9yIG11bHRpcGxlIHNlbGVjdGlvblxuICAgICAgICBsZXQgbmV3U3RhdGUgPSBBcnJheS5pc0FycmF5KHRoaXMuc3RhdGUpID8gWy4uLnRoaXMuc3RhdGVdIDogW11cblxuICAgICAgICAvLyBJZiBhbHJlYWR5IHNlbGVjdGVkLCByZW1vdmUgdGhlIHZhbHVlXG4gICAgICAgIGlmIChuZXdTdGF0ZS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIEZpbmQgYW5kIHJlbW92ZSB0aGUgYmFkZ2UgZGlyZWN0bHkgZnJvbSB0aGUgRE9NXG4gICAgICAgICAgICBjb25zdCBiYWRnZVRvUmVtb3ZlID0gdGhpcy5zZWxlY3RlZERpc3BsYXkucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICBgW2RhdGEtdmFsdWU9XCIke3ZhbHVlfVwiXWAsXG4gICAgICAgICAgICApXG4gICAgICAgICAgICBpZiAoZmlsbGVkKGJhZGdlVG9SZW1vdmUpKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBpcyB0aGUgbGFzdCBiYWRnZVxuICAgICAgICAgICAgICAgIGNvbnN0IGJhZGdlc0NvbnRhaW5lciA9IGJhZGdlVG9SZW1vdmUucGFyZW50RWxlbWVudFxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgZmlsbGVkKGJhZGdlc0NvbnRhaW5lcikgJiZcbiAgICAgICAgICAgICAgICAgICAgYmFkZ2VzQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBsYXN0IGJhZGdlLCB3ZSBuZWVkIHRvIHVwZGF0ZSB0aGUgZGlzcGxheSB0byBzaG93IHRoZSBwbGFjZWhvbGRlclxuICAgICAgICAgICAgICAgICAgICBuZXdTdGF0ZSA9IG5ld1N0YXRlLmZpbHRlcigodikgPT4gdiAhPT0gdmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBuZXdTdGF0ZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkRGlzcGxheSgpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBqdXN0IHJlbW92ZSB0aGlzIGJhZGdlXG4gICAgICAgICAgICAgICAgICAgIGJhZGdlVG9SZW1vdmUucmVtb3ZlKClcblxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHN0YXRlXG4gICAgICAgICAgICAgICAgICAgIG5ld1N0YXRlID0gbmV3U3RhdGUuZmlsdGVyKCh2KSA9PiB2ICE9PSB2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IG5ld1N0YXRlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBjb3VsZG4ndCBmaW5kIHRoZSBiYWRnZSwgZmFsbCBiYWNrIHRvIGZ1bGwgdXBkYXRlXG4gICAgICAgICAgICAgICAgbmV3U3RhdGUgPSBuZXdTdGF0ZS5maWx0ZXIoKHYpID0+IHYgIT09IHZhbHVlKVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBuZXdTdGF0ZVxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0ZWREaXNwbGF5KClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZW5kZXJPcHRpb25zKClcblxuICAgICAgICAgICAgLy8gUmVldmFsdWF0ZSBkcm9wZG93biBwb3NpdGlvbiBhZnRlciBvcHRpb25zIGFyZSByZW1vdmVkXG4gICAgICAgICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvc2l0aW9uRHJvcGRvd24oKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm1haW50YWluRm9jdXNJbk11bHRpcGxlTW9kZSgpXG4gICAgICAgICAgICB0aGlzLm9uU3RhdGVDaGFuZ2UodGhpcy5zdGF0ZSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgbWF4SXRlbXMgbGltaXQgaGFzIGJlZW4gcmVhY2hlZFxuICAgICAgICBpZiAodGhpcy5tYXhJdGVtcyAmJiBuZXdTdGF0ZS5sZW5ndGggPj0gdGhpcy5tYXhJdGVtcykge1xuICAgICAgICAgICAgLy8gU2hvdyBhIG1lc3NhZ2Ugb3IgYWxlcnQgYWJvdXQgcmVhY2hpbmcgdGhlIGxpbWl0XG4gICAgICAgICAgICBpZiAodGhpcy5tYXhJdGVtc01lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICBhbGVydCh0aGlzLm1heEl0ZW1zTWVzc2FnZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAvLyBEb24ndCBhZGQgbW9yZSBpdGVtc1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHRoZSBuZXcgdmFsdWVcbiAgICAgICAgbmV3U3RhdGUucHVzaCh2YWx1ZSlcbiAgICAgICAgdGhpcy5zdGF0ZSA9IG5ld1N0YXRlXG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgd2UgYWxyZWFkeSBoYXZlIGEgYmFkZ2VzIGNvbnRhaW5lclxuICAgICAgICBjb25zdCBleGlzdGluZ0JhZGdlc0NvbnRhaW5lciA9IHRoaXMuc2VsZWN0ZWREaXNwbGF5LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAnLmZpLWZvLXNlbGVjdC12YWx1ZS1iYWRnZXMtY3RuJyxcbiAgICAgICAgKVxuXG4gICAgICAgIGlmIChibGFuayhleGlzdGluZ0JhZGdlc0NvbnRhaW5lcikpIHtcbiAgICAgICAgICAgIC8vIElmIG5vIGJhZGdlcyBjb250YWluZXIgZXhpc3RzLCB3ZSBuZWVkIHRvIGRvIGEgZnVsbCB1cGRhdGVcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0ZWREaXNwbGF5KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwganVzdCBhZGQgYSBuZXcgYmFkZ2UgdG8gdGhlIGV4aXN0aW5nIGNvbnRhaW5lclxuICAgICAgICAgICAgdGhpcy5hZGRTaW5nbGVCYWRnZSh2YWx1ZSwgZXhpc3RpbmdCYWRnZXNDb250YWluZXIpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbmRlck9wdGlvbnMoKVxuXG4gICAgICAgIC8vIFJlZXZhbHVhdGUgZHJvcGRvd24gcG9zaXRpb24gYWZ0ZXIgb3B0aW9ucyBhcmUgYWRkZWRcbiAgICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uRHJvcGRvd24oKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tYWludGFpbkZvY3VzSW5NdWx0aXBsZU1vZGUoKVxuICAgICAgICB0aGlzLm9uU3RhdGVDaGFuZ2UodGhpcy5zdGF0ZSlcbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgbWV0aG9kIHRvIGFkZCBhIHNpbmdsZSBiYWRnZSBmb3IgYSB2YWx1ZVxuICAgIGFzeW5jIGFkZFNpbmdsZUJhZGdlKHZhbHVlLCBiYWRnZXNDb250YWluZXIpIHtcbiAgICAgICAgLy8gRmlyc3QgY2hlY2sgaWYgd2UgaGF2ZSB0aGUgbGFiZWwgaW4gdGhlIHJlcG9zaXRvcnlcbiAgICAgICAgbGV0IGxhYmVsID0gdGhpcy5sYWJlbFJlcG9zaXRvcnlbdmFsdWVdXG5cbiAgICAgICAgLy8gSWYgbm90IGluIHJlcG9zaXRvcnksIHRyeSB0byBmaW5kIGl0IGluIHRoZSBvcHRpb25zXG4gICAgICAgIGlmIChibGFuayhsYWJlbCkpIHtcbiAgICAgICAgICAgIGxhYmVsID0gdGhpcy5nZXRTZWxlY3RlZE9wdGlvbkxhYmVsKHZhbHVlKVxuXG4gICAgICAgICAgICAvLyBJZiBmb3VuZCBpbiBvcHRpb25zLCBzdG9yZSBpdCBpbiB0aGUgcmVwb3NpdG9yeVxuICAgICAgICAgICAgaWYgKGZpbGxlZChsYWJlbCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhYmVsUmVwb3NpdG9yeVt2YWx1ZV0gPSBsYWJlbFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbGFiZWwgbm90IGZvdW5kIGFuZCBnZXRPcHRpb25MYWJlbHNVc2luZyBpcyBhdmFpbGFibGUsIGZldGNoIGl0XG4gICAgICAgIGlmIChibGFuayhsYWJlbCkgJiYgdGhpcy5nZXRPcHRpb25MYWJlbHNVc2luZykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBGZXRjaCBsYWJlbHMgZm9yIHRoaXMgdmFsdWUgLSByZXR1cm5zIGFycmF5IG9mIHtsYWJlbCwgdmFsdWV9IG9iamVjdHNcbiAgICAgICAgICAgICAgICBjb25zdCBmZXRjaGVkT3B0aW9uc0FycmF5ID0gYXdhaXQgdGhpcy5nZXRPcHRpb25MYWJlbHNVc2luZygpXG5cbiAgICAgICAgICAgICAgICAvLyBGaW5kIHRoZSBtYXRjaGluZyBvcHRpb25cbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBmZXRjaGVkT3B0aW9uc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxlZChvcHRpb24pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb24udmFsdWUgPT09IHZhbHVlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb24ubGFiZWwgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsID0gb3B0aW9uLmxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTdG9yZSB0aGUgZmV0Y2hlZCBsYWJlbCBpbiB0aGUgcmVwb3NpdG9yeVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYWJlbFJlcG9zaXRvcnlbdmFsdWVdID0gbGFiZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIG9wdGlvbiBsYWJlbDonLCBlcnJvcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHN0aWxsIG5vIGxhYmVsLCB1c2UgdGhlIHZhbHVlIGFzIGZhbGxiYWNrXG4gICAgICAgIGlmIChibGFuayhsYWJlbCkpIHtcbiAgICAgICAgICAgIGxhYmVsID0gdmFsdWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSBhbmQgYWRkIHRoZSBiYWRnZVxuICAgICAgICBjb25zdCBiYWRnZSA9IHRoaXMuY3JlYXRlQmFkZ2VFbGVtZW50KHZhbHVlLCBsYWJlbClcbiAgICAgICAgYmFkZ2VzQ29udGFpbmVyLmFwcGVuZENoaWxkKGJhZGdlKVxuICAgIH1cblxuICAgIC8vIEhlbHBlciBtZXRob2QgdG8gbWFpbnRhaW4gZm9jdXMgaW4gbXVsdGlwbGUgc2VsZWN0aW9uIG1vZGVcbiAgICBtYWludGFpbkZvY3VzSW5NdWx0aXBsZU1vZGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU2VhcmNoYWJsZSAmJiB0aGlzLnNlYXJjaElucHV0KSB7XG4gICAgICAgICAgICAvLyBJZiBzZWFyY2hhYmxlLCBmb2N1cyB0aGUgc2VhcmNoIGlucHV0XG4gICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0LmZvY3VzKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBmb2N1cyB0aGUgZmlyc3Qgb3B0aW9uIG9yIHRoZSBzZWxlY3RlZCBvcHRpb25cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuZ2V0VmlzaWJsZU9wdGlvbnMoKVxuICAgICAgICBpZiAob3B0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmluZCB0aGUgaW5kZXggb2YgdGhlIHNlbGVjdGVkIG9wdGlvblxuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnN0YXRlKSAmJiB0aGlzLnN0YXRlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbmNsdWRlcyhvcHRpb25zW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbm8gb3B0aW9uIGlzIHNlbGVjdGVkLCBmb2N1cyB0aGUgZmlyc3Qgb3B0aW9uXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAwXG4gICAgICAgIH1cblxuICAgICAgICAvLyBGb2N1cyB0aGUgc2VsZWN0ZWQgb3B0aW9uXG4gICAgICAgIG9wdGlvbnNbdGhpcy5zZWxlY3RlZEluZGV4XS5jbGFzc0xpc3QuYWRkKCdmaS1zZWxlY3RlZCcpXG4gICAgICAgIG9wdGlvbnNbdGhpcy5zZWxlY3RlZEluZGV4XS5mb2N1cygpXG4gICAgfVxuXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEaXNhYmxlZCkgcmV0dXJuIC8vIEFscmVhZHkgZGlzYWJsZWRcblxuICAgICAgICB0aGlzLmlzRGlzYWJsZWQgPSB0cnVlXG4gICAgICAgIHRoaXMuYXBwbHlEaXNhYmxlZFN0YXRlKClcblxuICAgICAgICAvLyBDbG9zZSBkcm9wZG93biBpZiBpdCdzIG9wZW5cbiAgICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlRHJvcGRvd24oKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZW5hYmxlKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNEaXNhYmxlZCkgcmV0dXJuIC8vIEFscmVhZHkgZW5hYmxlZFxuXG4gICAgICAgIHRoaXMuaXNEaXNhYmxlZCA9IGZhbHNlXG4gICAgICAgIHRoaXMuYXBwbHlEaXNhYmxlZFN0YXRlKClcbiAgICB9XG5cbiAgICBhcHBseURpc2FibGVkU3RhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIC8vIEFkZCBkaXNhYmxlZCBhdHRyaWJ1dGUgYW5kIGNsYXNzIHRvIHRoZSBzZWxlY3QgYnV0dG9uXG4gICAgICAgICAgICB0aGlzLnNlbGVjdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJylcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0QnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsICd0cnVlJylcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ZpLWRpc2FibGVkJylcblxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIHJlbW92ZSBidXR0b25zIGluIG11bHRpcGxlIG1vZGUsIGRpc2FibGUgdGhlbVxuICAgICAgICAgICAgaWYgKHRoaXMuaXNNdWx0aXBsZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbnMgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgICAgICAnLmZpLWZvLXNlbGVjdC1iYWRnZS1yZW1vdmUnLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICByZW1vdmVCdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdmaS1kaXNhYmxlZCcpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBhIHJlbW92ZSBidXR0b24gaW4gc2luZ2xlIG1vZGUsIGRpc2FibGUgaXRcbiAgICAgICAgICAgIGlmICghdGhpcy5pc011bHRpcGxlICYmIHRoaXMuY2FuU2VsZWN0UGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZW1vdmVCdXR0b24gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgICAgICAnLmZpLWZvLXNlbGVjdC12YWx1ZS1yZW1vdmUtYnRuJyxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgaWYgKHJlbW92ZUJ1dHRvbikge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVCdXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdmaS1kaXNhYmxlZCcpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSdzIGEgc2VhcmNoIGlucHV0LCBkaXNhYmxlIGl0XG4gICAgICAgICAgICBpZiAodGhpcy5pc1NlYXJjaGFibGUgJiYgdGhpcy5zZWFyY2hJbnB1dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpXG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5jbGFzc0xpc3QuYWRkKCdmaS1kaXNhYmxlZCcpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgZGlzYWJsZWQgYXR0cmlidXRlIGFuZCBjbGFzcyBmcm9tIHRoZSBzZWxlY3QgYnV0dG9uXG4gICAgICAgICAgICB0aGlzLnNlbGVjdEJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0QnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcpXG4gICAgICAgICAgICB0aGlzLnNlbGVjdEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdmaS1kaXNhYmxlZCcpXG5cbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSByZW1vdmUgYnV0dG9ucyBpbiBtdWx0aXBsZSBtb2RlLCBlbmFibGUgdGhlbVxuICAgICAgICAgICAgaWYgKHRoaXMuaXNNdWx0aXBsZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbnMgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgICAgICAnLmZpLWZvLXNlbGVjdC1iYWRnZS1yZW1vdmUnLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICByZW1vdmVCdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBidXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdmaS1kaXNhYmxlZCcpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBhIHJlbW92ZSBidXR0b24gaW4gc2luZ2xlIG1vZGUsIGVuYWJsZSBpdFxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzTXVsdGlwbGUgJiYgdGhpcy5jYW5TZWxlY3RQbGFjZWhvbGRlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAgICAgICAgICcuZmktZm8tc2VsZWN0LXZhbHVlLXJlbW92ZS1idG4nLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBpZiAocmVtb3ZlQnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2ZpLWRpc2FibGVkJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHRoZXJlJ3MgYSBzZWFyY2ggaW5wdXQsIGVuYWJsZSBpdFxuICAgICAgICAgICAgaWYgKHRoaXMuaXNTZWFyY2hhYmxlICYmIHRoaXMuc2VhcmNoSW5wdXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0LnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKVxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnZmktZGlzYWJsZWQnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgLy8gUmVtb3ZlIGJ1dHRvbiBjbGljayBldmVudCBsaXN0ZW5lclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RCdXR0b24gJiYgdGhpcy5idXR0b25DbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICdjbGljaycsXG4gICAgICAgICAgICAgICAgdGhpcy5idXR0b25DbGlja0xpc3RlbmVyLFxuICAgICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIGRvY3VtZW50IGNsaWNrIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcilcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBidXR0b24ga2V5ZG93biBldmVudCBsaXN0ZW5lclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RCdXR0b24gJiYgdGhpcy5idXR0b25LZXlkb3duTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgJ2tleWRvd24nLFxuICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uS2V5ZG93bkxpc3RlbmVyLFxuICAgICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIGRyb3Bkb3duIGtleWRvd24gZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgaWYgKHRoaXMuZHJvcGRvd24gJiYgdGhpcy5kcm9wZG93bktleWRvd25MaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kcm9wZG93bi5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICdrZXlkb3duJyxcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3Bkb3duS2V5ZG93bkxpc3RlbmVyLFxuICAgICAgICAgICAgKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIHJlc2l6ZSBldmVudCBsaXN0ZW5lciBpZiBpdCBleGlzdHNcbiAgICAgICAgaWYgKHRoaXMucmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZUxpc3RlbmVyKVxuICAgICAgICAgICAgdGhpcy5yZXNpemVMaXN0ZW5lciA9IG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBzY3JvbGwgZXZlbnQgbGlzdGVuZXIgaWYgaXQgZXhpc3RzXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbExpc3RlbmVyKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5zY3JvbGxMaXN0ZW5lciwgdHJ1ZSlcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsTGlzdGVuZXIgPSBudWxsXG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgdGhlIGV2ZW50IGxpc3RlbmVyIGZvciByZWZyZXNoaW5nIHNlbGVjdGVkIG9wdGlvbiBsYWJlbHMgaWYgaXQgd2FzIGFkZGVkXG4gICAgICAgIGlmICh0aGlzLnJlZnJlc2hPcHRpb25MYWJlbExpc3RlbmVyKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAnZmlsYW1lbnQtZm9ybXM6OnNlbGVjdC5yZWZyZXNoU2VsZWN0ZWRPcHRpb25MYWJlbCcsXG4gICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoT3B0aW9uTGFiZWxMaXN0ZW5lcixcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENsb3NlIGRyb3Bkb3duIGlmIGl0J3Mgb3BlblxuICAgICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VEcm9wZG93bigpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbGVhciBhbnkgcGVuZGluZyBzZWFyY2ggdGltZW91dFxuICAgICAgICBpZiAodGhpcy5zZWFyY2hUaW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zZWFyY2hUaW1lb3V0KVxuICAgICAgICAgICAgdGhpcy5zZWFyY2hUaW1lb3V0ID0gbnVsbFxuICAgICAgICB9XG4gICAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQVFBLElBQU0sTUFBTSxLQUFLO0FBQ2pCLElBQU0sTUFBTSxLQUFLO0FBQ2pCLElBQU0sUUFBUSxLQUFLO0FBRW5CLElBQU0sZUFBZSxRQUFNO0FBQUEsRUFDekIsR0FBRztBQUFBLEVBQ0gsR0FBRztBQUNMO0FBQ0EsSUFBTSxrQkFBa0I7QUFBQSxFQUN0QixNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsRUFDUCxRQUFRO0FBQUEsRUFDUixLQUFLO0FBQ1A7QUFDQSxJQUFNLHVCQUF1QjtBQUFBLEVBQzNCLE9BQU87QUFBQSxFQUNQLEtBQUs7QUFDUDtBQUNBLFNBQVMsTUFBTSxPQUFPLE9BQU8sS0FBSztBQUNoQyxTQUFPLElBQUksT0FBTyxJQUFJLE9BQU8sR0FBRyxDQUFDO0FBQ25DO0FBQ0EsU0FBUyxTQUFTLE9BQU8sT0FBTztBQUM5QixTQUFPLE9BQU8sVUFBVSxhQUFhLE1BQU0sS0FBSyxJQUFJO0FBQ3REO0FBQ0EsU0FBUyxRQUFRLFdBQVc7QUFDMUIsU0FBTyxVQUFVLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDL0I7QUFDQSxTQUFTLGFBQWEsV0FBVztBQUMvQixTQUFPLFVBQVUsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUMvQjtBQUNBLFNBQVMsZ0JBQWdCLE1BQU07QUFDN0IsU0FBTyxTQUFTLE1BQU0sTUFBTTtBQUM5QjtBQUNBLFNBQVMsY0FBYyxNQUFNO0FBQzNCLFNBQU8sU0FBUyxNQUFNLFdBQVc7QUFDbkM7QUFDQSxTQUFTLFlBQVksV0FBVztBQUM5QixTQUFPLENBQUMsT0FBTyxRQUFRLEVBQUUsU0FBUyxRQUFRLFNBQVMsQ0FBQyxJQUFJLE1BQU07QUFDaEU7QUFDQSxTQUFTLGlCQUFpQixXQUFXO0FBQ25DLFNBQU8sZ0JBQWdCLFlBQVksU0FBUyxDQUFDO0FBQy9DO0FBQ0EsU0FB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QkFBTyxVQUFVLE9BQU8sYUFBYTtBQUFBLFFBQ3pDLENBQUM7QUFBQSxNQUNMO0FBR0EsVUFBSSxDQUFDLEtBQUssY0FBYyxLQUFLLHNCQUFzQjtBQUMvQyxjQUFNLGVBQWUsS0FBSyxVQUFVO0FBQUEsVUFDaEM7QUFBQSxRQUNKO0FBQ0EsWUFBSSxjQUFjO0FBQ2QsdUJBQWEsZ0JBQWdCLFVBQVU7QUFDdkMsdUJBQWEsVUFBVSxJQUFJLGFBQWE7QUFBQSxRQUM1QztBQUFBLE1BQ0o7QUFHQSxVQUFJLEtBQUssZ0JBQWdCLEtBQUssYUFBYTtBQUN2QyxhQUFLLFlBQVksZ0JBQWdCLFVBQVU7QUFDM0MsYUFBSyxZQUFZLFVBQVUsT0FBTyxhQUFhO0FBQUEsTUFDbkQ7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBLEVBRUEsVUFBVTtBQUVOLFFBQUksS0FBSyxnQkFBZ0IsS0FBSyxxQkFBcUI7QUFDL0MsV0FBSyxhQUFhO0FBQUEsUUFDZDtBQUFBLFFBQ0EsS0FBSztBQUFBLE1BQ1Q7QUFBQSxJQUNKO0FBR0EsUUFBSSxLQUFLLHVCQUF1QjtBQUM1QixlQUFTLG9CQUFvQixTQUFTLEtBQUsscUJBQXFCO0FBQUEsSUFDcEU7QUFHQSxRQUFJLEtBQUssZ0JBQWdCLEtBQUssdUJBQXVCO0FBQ2pELFdBQUssYUFBYTtBQUFBLFFBQ2Q7QUFBQSxRQUNBLEtBQUs7QUFBQSxNQUNUO0FBQUEsSUFDSjtBQUdBLFFBQUksS0FBSyxZQUFZLEtBQUsseUJBQXlCO0FBQy9DLFdBQUssU0FBUztBQUFBLFFBQ1Y7QUFBQSxRQUNBLEtBQUs7QUFBQSxNQUNUO0FBQUEsSUFDSjtBQUdBLFFBQUksS0FBSyxnQkFBZ0I7QUFDckIsYUFBTyxvQkFBb0IsVUFBVSxLQUFLLGNBQWM7QUFDeEQsV0FBSyxpQkFBaUI7QUFBQSxJQUMxQjtBQUdBLFFBQUksS0FBSyxnQkFBZ0I7QUFDckIsYUFBTyxvQkFBb0IsVUFBVSxLQUFLLGdCQUFnQixJQUFJO0FBQzlELFdBQUssaUJBQWlCO0FBQUEsSUFDMUI7QUFHQSxRQUFJLEtBQUssNEJBQTRCO0FBQ2pDLGFBQU87QUFBQSxRQUNIO0FBQUEsUUFDQSxLQUFLO0FBQUEsTUFDVDtBQUFBLElBQ0o7QUFHQSxRQUFJLEtBQUssUUFBUTtBQUNiLFdBQUssY0FBYztBQUFBLElBQ3ZCO0FBR0EsUUFBSSxLQUFLLGVBQWU7QUFDcEIsbUJBQWEsS0FBSyxhQUFhO0FBQy9CLFdBQUssZ0JBQWdCO0FBQUEsSUFDekI7QUFBQSxFQUNKO0FBQ0o7IiwKICAibmFtZXMiOiBbInBsYXRmb3JtIiwgInBsYXRmb3JtIiwgInBsYWNlbWVudHMiLCAic2lkZXMiLCAic2lkZSIsICJwbGFjZW1lbnQiLCAib3ZlcmZsb3ciLCAicGxhdGZvcm0iLCAieCIsICJ5IiwgIm1pbiIsICJtYXgiLCAib2Zmc2V0IiwgInNoaWZ0IiwgImZsaXAiLCAiY29tcHV0ZVBvc2l0aW9uIiwgIm9mZnNldCIsICJzaGlmdCIsICJmbGlwIiwgImNvbXB1dGVQb3NpdGlvbiJdCn0K

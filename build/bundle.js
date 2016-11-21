/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _config = __webpack_require__(1);

	var _config2 = _interopRequireDefault(_config);

	var _canvas_util = __webpack_require__(2);

	var _canvas_util2 = _interopRequireDefault(_canvas_util);

	var _obstacle = __webpack_require__(3);

	var _obstacle2 = _interopRequireDefault(_obstacle);

	var _spawner = __webpack_require__(6);

	var _spawner2 = _interopRequireDefault(_spawner);

	var _util = __webpack_require__(9);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(11);

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var state = {
	  spawner: null,
	  obstacles: [],
	  drones: []
	};

	var obstaclesLookup = void 0;
	var allowedMoves = void 0;

	function generateMoveMap() {
	  allowedMoves = {};
	  for (var x = 0; x <= _config2.default.w; x += 1) {
	    allowedMoves[x] = {};
	    for (var y = 0; y <= _config2.default.h; y += 1) {
	      allowedMoves[x][y] = {
	        up: true,
	        right: true,
	        down: true,
	        left: true
	      };
	    }
	  }
	}

	function generateObstacles(count) {
	  var obstacles = [];

	  obstaclesLookup = {};

	  for (var i = 0; i < count; i += 1) {
	    var newObstacle = (0, _obstacle2.default)(_util2.default.randCoord(_config2.default));

	    obstacles.push(newObstacle);

	    if (!Object.hasOwnProperty.call(obstaclesLookup, newObstacle.x)) {
	      obstaclesLookup[newObstacle.x] = {};
	    }

	    obstaclesLookup[newObstacle.x][newObstacle.y] = newObstacle;
	  }

	  return obstacles;
	}

	function generateDrones() {
	  while (state.drones.length < _config2.default.droneCount) {
	    state.drones.push(state.spawner.spawn());
	  }

	  return state.drones;
	}

	function render() {
	  _canvas_util2.default.blurClear(ctx);

	  state.obstacles.forEach(function (obj) {
	    obj.draw(ctx, _config2.default);
	  });

	  state.drones.forEach(function (obj) {
	    obj.draw(ctx, _config2.default);
	  });

	  state.spawner.draw(ctx, _config2.default);
	}

	function startSimulation() {
	  requestAnimationFrame(simulate);
	}

	function simulate() {
	  if (state.drones.length === 0) {
	    state.drones = generateDrones();
	  }

	  var needsCleanup = false;
	  state.drones.forEach(function (drone) {
	    if (!drone.direction || drone.x < _config2.default.scale || drone.y < _config2.default.scale || drone.x >= _config2.default.w - _config2.default.scale || drone.y >= _config2.default.h - _config2.default.scale || Math.round(Math.random() * 15) === 5) {
	      drone.pickDirection();
	    }

	    if (!allowedMoves[drone.x][drone.y][drone.direction]) {
	      drone.pickDirection();
	      return;
	    }

	    var previousX = drone.x;
	    var previousY = drone.y;

	    drone.move[drone.direction](drone, _config2.default);

	    if (!drone.isFree(obstaclesLookup)) {
	      allowedMoves[previousX][previousY][drone.direction] = false;
	      drone.setDestroyed();
	      needsCleanup = true;
	    }
	  });

	  if (needsCleanup) {
	    state.drones = state.drones.filter(function (drone) {
	      return !drone.destroyed;
	    });
	  }

	  render();
	  requestAnimationFrame(simulate);
	}

	_config2.default.h = Math.floor(document.body.clientHeight); // / config.scale);
	_config2.default.w = Math.floor(document.body.clientWidth); // / config.scale);

	_canvas_util2.default.setCanvasSize(ctx, _config2.default);
	_canvas_util2.default.fillBackground(ctx, 'rgba(22, 31, 40,1)');

	var obstacleCount = Math.floor(_config2.default.w * _config2.default.h / (_config2.default.scale * _config2.default.scale) * _config2.default.obstacleDensity);

	state.spawner = (0, _spawner2.default)(_util2.default.randCoord(_config2.default));

	state.obstacles = generateObstacles(obstacleCount);

	generateMoveMap();

	startSimulation();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  h: 0,
	  w: 0,
	  obstacleDensity: 0.3,
	  droneCount: 10,
	  scale: 8
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  clear: function clear(ctx) {
	    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	  },
	  blurClear: function blurClear(ctx) {
	    var originalColour = ctx.fillStyle;
	    ctx.fillStyle = 'rgba(22, 31, 40,0.05)';
	    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	    ctx.fillStyle = originalColour;
	  },
	  setCanvasSize: function setCanvasSize(ctx, _ref) {
	    var w = _ref.w,
	        h = _ref.h;

	    ctx.canvas.width = w;
	    ctx.canvas.height = h;
	  },
	  fillBackground: function fillBackground(ctx, color) {
	    var originalColour = ctx.fillStyle;
	    ctx.fillStyle = color;
	    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	    ctx.stroke();
	    ctx.fillStyle = originalColour;
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _stampit = __webpack_require__(4);

	var _stampit2 = _interopRequireDefault(_stampit);

	var _particle = __webpack_require__(5);

	var _particle2 = _interopRequireDefault(_particle);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = (0, _stampit2.default)().compose(_particle2.default).props({
	  type: 'obstacle',
	  color: '#d35400'
	});

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', { value: true });

	function isObject(obj) {
	  var type = typeof obj;
	  return !!obj && (type === 'object' || type === 'function');
	}

	function isFunction(obj) {
	  return typeof obj === 'function';
	}

	var concat = Array.prototype.concat;
	var extractFunctions = function () {
	  var fns = concat.apply([], arguments).filter(isFunction);
	  return fns.length === 0 ? undefined : fns;
	};

	function isPlainObject(value) {
	  return !!value && typeof value === 'object' &&
	    Object.getPrototypeOf(value) === Object.prototype;
	}

	/**
	 * The 'src' argument plays the command role.
	 * The returned values is always of the same type as the 'src'.
	 * @param dst
	 * @param src
	 * @returns {*}
	 */
	function mergeOne(dst, src) {
	  if (src === undefined) { return dst; }

	  // According to specification arrays must be concatenated.
	  // Also, the '.concat' creates a new array instance. Overrides the 'dst'.
	  if (Array.isArray(src)) { return (Array.isArray(dst) ? dst : []).concat(src); }

	  // Now deal with non plain 'src' object. 'src' overrides 'dst'
	  // Note that functions are also assigned! We do not deep merge functions.
	  if (!isPlainObject(src)) { return src; }

	  // See if 'dst' is allowed to be mutated. If not - it's overridden with a new plain object.
	  var returnValue = isObject(dst) ? dst : {};

	  var keys = Object.keys(src);
	  for (var i = 0; i < keys.length; i += 1) {
	    var key = keys[i];

	    var srcValue = src[key];
	    // Do not merge properties with the 'undefined' value.
	    if (srcValue !== undefined) {
	      var dstValue = returnValue[key];
	      // Recursive calls to mergeOne() must allow only plain objects or arrays in dst
	      var newDst = isPlainObject(dstValue) || Array.isArray(srcValue) ? dstValue : {};

	      // deep merge each property. Recursion!
	      returnValue[key] = mergeOne(newDst, srcValue);
	    }
	  }

	  return returnValue;
	}

	var merge = function (dst) {
	  var srcs = [], len = arguments.length - 1;
	  while ( len-- > 0 ) srcs[ len ] = arguments[ len + 1 ];

	  return srcs.reduce(mergeOne, dst);
	};

	var assign$1 = Object.assign;

	/**
	 * Converts stampit extended descriptor to a standard one.
	 * @param [methods]
	 * @param [properties]
	 * @param [props]
	 * @param [refs]
	 * @param [initializers]
	 * @param [init]
	 * @param [deepProperties]
	 * @param [deepProps]
	 * @param [propertyDescriptors]
	 * @param [staticProperties]
	 * @param [statics]
	 * @param [staticDeepProperties]
	 * @param [deepStatics]
	 * @param [staticPropertyDescriptors]
	 * @param [configuration]
	 * @param [conf]
	 * @param [deepConfiguration]
	 * @param [deepConf]
	 * @returns {Descriptor}
	 */
	var standardiseDescriptor = function (ref) {
	  if ( ref === void 0 ) ref = {};
	  var methods = ref.methods;
	  var properties = ref.properties;
	  var props = ref.props;
	  var refs = ref.refs;
	  var initializers = ref.initializers;
	  var init = ref.init;
	  var deepProperties = ref.deepProperties;
	  var deepProps = ref.deepProps;
	  var propertyDescriptors = ref.propertyDescriptors;
	  var staticProperties = ref.staticProperties;
	  var statics = ref.statics;
	  var staticDeepProperties = ref.staticDeepProperties;
	  var deepStatics = ref.deepStatics;
	  var staticPropertyDescriptors = ref.staticPropertyDescriptors;
	  var configuration = ref.configuration;
	  var conf = ref.conf;
	  var deepConfiguration = ref.deepConfiguration;
	  var deepConf = ref.deepConf;

	  var p = isObject(props) || isObject(refs) || isObject(properties) ?
	    assign$1({}, props, refs, properties) : undefined;

	  var dp = isObject(deepProps) ? merge({}, deepProps) : undefined;
	  dp = isObject(deepProperties) ? merge(dp, deepProperties) : dp;

	  var sp = isObject(statics) || isObject(staticProperties) ?
	    assign$1({}, statics, staticProperties) : undefined;

	  var dsp = isObject(deepStatics) ? merge({}, deepStatics) : undefined;
	  dsp = isObject(staticDeepProperties) ? merge(dsp, staticDeepProperties) : dsp;

	  var c = isObject(conf) || isObject(configuration) ?
	    assign$1({}, conf, configuration) : undefined;

	  var dc = isObject(deepConf) ? merge({}, deepConf) : undefined;
	  dc = isObject(deepConfiguration) ? merge(dc, deepConfiguration) : dc;

	  return {
	    methods: methods,
	    properties: p,
	    initializers: extractFunctions(init, initializers),
	    deepProperties: dp,
	    staticProperties: sp,
	    staticDeepProperties: dsp,
	    propertyDescriptors: propertyDescriptors,
	    staticPropertyDescriptors: staticPropertyDescriptors,
	    configuration: c,
	    deepConfiguration: dc
	  };
	};

	var assign$2 = Object.assign;

	/**
	 * Creates new factory instance.
	 * @param {Descriptor} descriptor The information about the object the factory will be creating.
	 * @returns {Function} The new factory function.
	 */
	function createFactory(descriptor) {
	  return function Stamp(options) {
	    var args = [], len = arguments.length - 1;
	    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

	    // Next line was optimized for most JS VMs. Please, be careful here!
	    var obj = Object.create(descriptor.methods || null);

	    merge(obj, descriptor.deepProperties);
	    assign$2(obj, descriptor.properties);
	    Object.defineProperties(obj, descriptor.propertyDescriptors || {});

	    if (!descriptor.initializers || descriptor.initializers.length === 0) { return obj; }

	    if (options === undefined) { options = {}; }
	    return descriptor.initializers.filter(isFunction).reduce(function (resultingObj, initializer) {
	      var returnedValue = initializer.call(resultingObj, options,
	        {instance: resultingObj, stamp: Stamp, args: [options].concat(args)});
	      return returnedValue === undefined ? resultingObj : returnedValue;
	    }, obj);
	  };
	}

	/**
	 * Returns a new stamp given a descriptor and a compose function implementation.
	 * @param {Descriptor} [descriptor={}] The information about the object the stamp will be creating.
	 * @param {Compose} composeFunction The "compose" function implementation.
	 * @returns {Stamp}
	 */
	function createStamp(descriptor, composeFunction) {
	  var Stamp = createFactory(descriptor);

	  merge(Stamp, descriptor.staticDeepProperties);
	  assign$2(Stamp, descriptor.staticProperties);
	  Object.defineProperties(Stamp, descriptor.staticPropertyDescriptors || {});

	  var composeImplementation = isFunction(Stamp.compose) ? Stamp.compose : composeFunction;
	  Stamp.compose = function _compose() {
	    var args = [], len = arguments.length;
	    while ( len-- ) args[ len ] = arguments[ len ];

	    return composeImplementation.apply(this, args);
	  };
	  assign$2(Stamp.compose, descriptor);

	  return Stamp;
	}

	/**
	 * Mutates the dstDescriptor by merging the srcComposable data into it.
	 * @param {Descriptor} dstDescriptor The descriptor object to merge into.
	 * @param {Composable} [srcComposable] The composable
	 * (either descriptor or stamp) to merge data form.
	 * @returns {Descriptor} Returns the dstDescriptor argument.
	 */
	function mergeComposable(dstDescriptor, srcComposable) {
	  var srcDescriptor = (srcComposable && srcComposable.compose) || srcComposable;
	  if (!isObject(srcDescriptor)) { return dstDescriptor; }

	  var combineProperty = function (propName, action) {
	    if (!isObject(srcDescriptor[propName])) { return; }
	    if (!isObject(dstDescriptor[propName])) { dstDescriptor[propName] = {}; }
	    action(dstDescriptor[propName], srcDescriptor[propName]);
	  };

	  combineProperty('methods', assign$2);
	  combineProperty('properties', assign$2);
	  combineProperty('deepProperties', merge);
	  combineProperty('propertyDescriptors', assign$2);
	  combineProperty('staticProperties', assign$2);
	  combineProperty('staticDeepProperties', merge);
	  combineProperty('staticPropertyDescriptors', assign$2);
	  combineProperty('configuration', assign$2);
	  combineProperty('deepConfiguration', merge);
	  if (Array.isArray(srcDescriptor.initializers)) {
	    dstDescriptor.initializers = srcDescriptor.initializers.reduce(function (result, init) {
	      if (isFunction(init) && result.indexOf(init) < 0) {
	        result.push(init);
	      }
	      return result;
	    }, Array.isArray(dstDescriptor.initializers) ? dstDescriptor.initializers : []);
	  }

	  return dstDescriptor;
	}

	/**
	 * Given the list of composables (stamp descriptors and stamps) returns
	 * a new stamp (composable factory function).
	 * @typedef {Function} Compose
	 * @param {...(Composable)} [composables] The list of composables.
	 * @returns {Stamp} A new stamp (aka composable factory function)
	 */
	function compose() {
	  var composables = [], len = arguments.length;
	  while ( len-- ) composables[ len ] = arguments[ len ];

	  var descriptor = [this]
	    .concat(composables)
	    .filter(isObject)
	    .reduce(mergeComposable, {});
	  return createStamp(descriptor, compose);
	}


	/**
	 * The Stamp Descriptor
	 * @typedef {Function|Object} Descriptor
	 * @returns {Stamp} A new stamp based on this Stamp
	 * @property {Object} [methods] Methods or other data used as object instances' prototype
	 * @property {Array<Function>} [initializers] List of initializers called for each object instance
	 * @property {Object} [properties] Shallow assigned properties of object instances
	 * @property {Object} [deepProperties] Deeply merged properties of object instances
	 * @property {Object} [staticProperties] Shallow assigned properties of Stamps
	 * @property {Object} [staticDeepProperties] Deeply merged properties of Stamps
	 * @property {Object} [configuration] Shallow assigned properties of Stamp arbitrary metadata
	 * @property {Object} [deepConfiguration] Deeply merged properties of Stamp arbitrary metadata
	 * @property {Object} [propertyDescriptors] ES5 Property Descriptors applied to object instances
	 * @property {Object} [staticPropertyDescriptors] ES5 Property Descriptors applied to Stamps
	 */

	/**
	 * The Stamp factory function
	 * @typedef {Function} Stamp
	 * @returns {*} Instantiated object
	 * @property {Descriptor} compose - The Stamp descriptor and composition function
	 */

	/**
	 * A composable object - stamp or descriptor
	 * @typedef {Stamp|Descriptor} Composable
	 */

	/**
	 * Returns true if argument is a stamp.
	 * @param {*} obj
	 * @returns {Boolean}
	 */
	function isStamp(obj) {
	  return isFunction(obj) && isFunction(obj.compose);
	}

	var assign = Object.assign;

	function createUtilityFunction(propName, action) {
	  return function composeUtil() {
	    var i = arguments.length, argsArray = Array(i);
	    while ( i-- ) argsArray[i] = arguments[i];

	    var descriptor = {};
	    descriptor[propName] = action.apply(void 0, [ {} ].concat( argsArray ));
	    return ((this && this.compose) || stampit).call(this, descriptor);
	  };
	}

	var methods = createUtilityFunction('methods', assign);

	var properties = createUtilityFunction('properties', assign);
	function initializers() {
	  var args = [], len = arguments.length;
	  while ( len-- ) args[ len ] = arguments[ len ];

	  return ((this && this.compose) || stampit).call(this, {
	    initializers: extractFunctions.apply(void 0, args)
	  });
	}
	var deepProperties = createUtilityFunction('deepProperties', merge);
	var staticProperties = createUtilityFunction('staticProperties', assign);
	var staticDeepProperties = createUtilityFunction('staticDeepProperties', merge);
	var configuration = createUtilityFunction('configuration', assign);
	var deepConfiguration = createUtilityFunction('deepConfiguration', merge);
	var propertyDescriptors = createUtilityFunction('propertyDescriptors', assign);

	var staticPropertyDescriptors = createUtilityFunction('staticPropertyDescriptors', assign);

	var allUtilities = {
	  methods: methods,

	  properties: properties,
	  refs: properties,
	  props: properties,

	  initializers: initializers,
	  init: initializers,

	  deepProperties: deepProperties,
	  deepProps: deepProperties,

	  staticProperties: staticProperties,
	  statics: staticProperties,

	  staticDeepProperties: staticDeepProperties,
	  deepStatics: staticDeepProperties,

	  configuration: configuration,
	  conf: configuration,

	  deepConfiguration: deepConfiguration,
	  deepConf: deepConfiguration,

	  propertyDescriptors: propertyDescriptors,

	  staticPropertyDescriptors: staticPropertyDescriptors
	};

	/**
	 * Infected stamp. Used as a storage of the infection metadata
	 * @type {Function}
	 * @return {Stamp}
	 */
	var baseStampit = compose(
	  {staticProperties: allUtilities},
	  {
	    staticProperties: {
	      create: function create() {
	        var args = [], len = arguments.length;
	        while ( len-- ) args[ len ] = arguments[ len ];

	        return this.apply(void 0, args);
	      },
	      compose: stampit // infecting
	    }
	  }
	);

	/**
	 * Infected compose
	 * @param {...(Composable)} [args] The list of composables.
	 * @return {Stamp}
	 */
	function stampit() {
	  var args = [], len = arguments.length;
	  while ( len-- ) args[ len ] = arguments[ len ];

	  args = args.filter(isObject)
	    .map(function (arg) { return isStamp(arg) ? arg : standardiseDescriptor(arg); });

	  // Calling the standard pure compose function here.
	  return compose.apply(this || baseStampit, args);
	}

	var exportedCompose = stampit.bind(); // bind to 'undefined'
	stampit.compose = exportedCompose;

	// Setting up the shortcut functions
	var stampit$1 = assign(stampit, allUtilities);

	exports.methods = methods;
	exports.properties = properties;
	exports.refs = properties;
	exports.props = properties;
	exports.initializers = initializers;
	exports.init = initializers;
	exports.deepProperties = deepProperties;
	exports.deepProps = deepProperties;
	exports.staticProperties = staticProperties;
	exports.statics = staticProperties;
	exports.staticDeepProperties = staticDeepProperties;
	exports.deepStatics = staticDeepProperties;
	exports.configuration = configuration;
	exports.conf = configuration;
	exports.deepConfiguration = deepConfiguration;
	exports.deepConf = deepConfiguration;
	exports.propertyDescriptors = propertyDescriptors;
	exports.staticPropertyDescriptors = staticPropertyDescriptors;
	exports.compose = exportedCompose;
	exports['default'] = stampit$1;
	module.exports = exports['default'];
	//# sourceMappingURL=stampit.full.js.map


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _stampit = __webpack_require__(4);

	var _stampit2 = _interopRequireDefault(_stampit);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = (0, _stampit2.default)().props({
	  x: 0,
	  y: 0,
	  type: 'particle',
	  color: '#000',
	  destroyed: false
	}).methods({
	  setDestroyed: function setDestroyed() {
	    this.destroyed = true;
	  },
	  draw: function draw(ctx, config) {
	    ctx.fillStyle = this.color;
	    ctx.fillRect(this.x, this.y, config.scale, config.scale);
	    ctx.stroke();
	  }
	}).init(function (_ref) {
	  var x = _ref.x,
	      y = _ref.y,
	      color = _ref.color;

	  this.x = x || this.x;
	  this.y = y || this.y;
	  this.color = color || this.color;
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _stampit = __webpack_require__(4);

	var _stampit2 = _interopRequireDefault(_stampit);

	var _particle = __webpack_require__(5);

	var _particle2 = _interopRequireDefault(_particle);

	var _drone = __webpack_require__(7);

	var _drone2 = _interopRequireDefault(_drone);

	var _util = __webpack_require__(9);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = (0, _stampit2.default)().compose(_particle2.default).methods({
	  spawn: function spawn() {
	    return (0, _drone2.default)({
	      x: this.x,
	      y: this.y,
	      color: _util2.default.randomColor()
	    });
	  }
	}).props({
	  type: 'spawner',
	  color: '#FFFFFF'
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _stampit = __webpack_require__(4);

	var _stampit2 = _interopRequireDefault(_stampit);

	var _particle = __webpack_require__(5);

	var _particle2 = _interopRequireDefault(_particle);

	var _movement = __webpack_require__(8);

	var _movement2 = _interopRequireDefault(_movement);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = (0, _stampit2.default)().compose(_particle2.default, _movement2.default).props({ type: 'drone' });

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _stampit = __webpack_require__(4);

	var _stampit2 = _interopRequireDefault(_stampit);

	var _util = __webpack_require__(9);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = (0, _stampit2.default)().props({
	  moves: ['up', 'right', 'down', 'left'],
	  direction: false
	}).methods({
	  pickDirection: function pickDirection() {
	    this.direction = _util2.default.arrayRand(this.moves);
	  },
	  isFree: function isFree(lookup) {
	    if (!Object.hasOwnProperty.call(lookup, this.x)) {
	      return true;
	    }

	    if (!Object.hasOwnProperty.call(lookup[this.x], this.y)) {
	      return true;
	    }

	    return false;
	  },

	  move: {
	    left: function left(obj, config) {
	      if (obj.x >= config.scale) {
	        obj.x -= config.scale;
	      }
	    },
	    up: function up(obj, config) {
	      if (obj.y >= config.scale) {
	        obj.y -= config.scale;
	      }
	    },
	    right: function right(obj, config) {
	      if (obj.x <= config.w - config.scale) {
	        obj.x += config.scale;
	      }
	    },
	    down: function down(obj, config) {
	      if (obj.y <= config.h - config.scale) {
	        obj.y += config.scale;
	      }
	    }
	  }
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _randomcolor = __webpack_require__(10);

	var _randomcolor2 = _interopRequireDefault(_randomcolor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = {
	  randomColor: function randomColor() {
	    return (0, _randomcolor2.default)({
	      luminosity: 'bright'
	    });
	  },
	  randCoord: function randCoord(_ref) {
	    var w = _ref.w,
	        h = _ref.h,
	        scale = _ref.scale;

	    return {
	      x: Math.floor(Math.random() * (w / scale)) * scale,
	      y: Math.floor(Math.random() * (h / scale)) * scale
	    };
	  },
	  arrayRand: function arrayRand(arr) {
	    var index = Math.floor(Math.random() * arr.length);
	    return arr[index];
	  }
	}; /* eslint-disable no-param-reassign*/

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// randomColor by David Merfield under the CC0 license
	// https://github.com/davidmerfield/randomColor/

	;(function(root, factory) {

	  // Support AMD
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	  // Support CommonJS
	  } else if (typeof exports === 'object') {
	    var randomColor = factory();

	    // Support NodeJS & Component, which allow module.exports to be a function
	    if (typeof module === 'object' && module && module.exports) {
	      exports = module.exports = randomColor;
	    }

	    // Support CommonJS 1.1.1 spec
	    exports.randomColor = randomColor;

	  // Support vanilla script loading
	  } else {
	    root.randomColor = factory();
	  }

	}(this, function() {

	  // Seed to get repeatable colors
	  var seed = null;

	  // Shared color dictionary
	  var colorDictionary = {};

	  // Populate the color dictionary
	  loadColorBounds();

	  var randomColor = function (options) {

	    options = options || {};

	    // Check if there is a seed and ensure it's an
	    // integer. Otherwise, reset the seed value.
	    if (options.seed && options.seed === parseInt(options.seed, 10)) {
	      seed = options.seed;

	    // A string was passed as a seed
	    } else if (typeof options.seed === 'string') {
	      seed = stringToInteger(options.seed);

	    // Something was passed as a seed but it wasn't an integer or string
	    } else if (options.seed !== undefined && options.seed !== null) {
	      throw new TypeError('The seed value must be an integer or string');

	    // No seed, reset the value outside.
	    } else {
	      seed = null;
	    }

	    var H,S,B;

	    // Check if we need to generate multiple colors
	    if (options.count !== null && options.count !== undefined) {

	      var totalColors = options.count,
	          colors = [];

	      options.count = null;

	      while (totalColors > colors.length) {

	        // Since we're generating multiple colors,
	        // incremement the seed. Otherwise we'd just
	        // generate the same color each time...
	        if (seed && options.seed) options.seed += 1;

	        colors.push(randomColor(options));
	      }

	      options.count = totalColors;

	      return colors;
	    }

	    // First we pick a hue (H)
	    H = pickHue(options);

	    // Then use H to determine saturation (S)
	    S = pickSaturation(H, options);

	    // Then use S and H to determine brightness (B).
	    B = pickBrightness(H, S, options);

	    // Then we return the HSB color in the desired format
	    return setFormat([H,S,B], options);
	  };

	  function pickHue (options) {

	    var hueRange = getHueRange(options.hue),
	        hue = randomWithin(hueRange);

	    // Instead of storing red as two seperate ranges,
	    // we group them, using negative numbers
	    if (hue < 0) {hue = 360 + hue;}

	    return hue;

	  }

	  function pickSaturation (hue, options) {

	    if (options.luminosity === 'random') {
	      return randomWithin([0,100]);
	    }

	    if (options.hue === 'monochrome') {
	      return 0;
	    }

	    var saturationRange = getSaturationRange(hue);

	    var sMin = saturationRange[0],
	        sMax = saturationRange[1];

	    switch (options.luminosity) {

	      case 'bright':
	        sMin = 55;
	        break;

	      case 'dark':
	        sMin = sMax - 10;
	        break;

	      case 'light':
	        sMax = 55;
	        break;
	   }

	    return randomWithin([sMin, sMax]);

	  }

	  function pickBrightness (H, S, options) {

	    var bMin = getMinimumBrightness(H, S),
	        bMax = 100;

	    switch (options.luminosity) {

	      case 'dark':
	        bMax = bMin + 20;
	        break;

	      case 'light':
	        bMin = (bMax + bMin)/2;
	        break;

	      case 'random':
	        bMin = 0;
	        bMax = 100;
	        break;
	    }

	    return randomWithin([bMin, bMax]);
	  }

	  function setFormat (hsv, options) {

	    switch (options.format) {

	      case 'hsvArray':
	        return hsv;

	      case 'hslArray':
	        return HSVtoHSL(hsv);

	      case 'hsl':
	        var hsl = HSVtoHSL(hsv);
	        return 'hsl('+hsl[0]+', '+hsl[1]+'%, '+hsl[2]+'%)';

	      case 'hsla':
	        var hslColor = HSVtoHSL(hsv);
	        return 'hsla('+hslColor[0]+', '+hslColor[1]+'%, '+hslColor[2]+'%, ' + Math.random() + ')';

	      case 'rgbArray':
	        return HSVtoRGB(hsv);

	      case 'rgb':
	        var rgb = HSVtoRGB(hsv);
	        return 'rgb(' + rgb.join(', ') + ')';

	      case 'rgba':
	        var rgbColor = HSVtoRGB(hsv);
	        return 'rgba(' + rgbColor.join(', ') + ', ' + Math.random() + ')';

	      default:
	        return HSVtoHex(hsv);
	    }

	  }

	  function getMinimumBrightness(H, S) {

	    var lowerBounds = getColorInfo(H).lowerBounds;

	    for (var i = 0; i < lowerBounds.length - 1; i++) {

	      var s1 = lowerBounds[i][0],
	          v1 = lowerBounds[i][1];

	      var s2 = lowerBounds[i+1][0],
	          v2 = lowerBounds[i+1][1];

	      if (S >= s1 && S <= s2) {

	         var m = (v2 - v1)/(s2 - s1),
	             b = v1 - m*s1;

	         return m*S + b;
	      }

	    }

	    return 0;
	  }

	  function getHueRange (colorInput) {

	    if (typeof parseInt(colorInput) === 'number') {

	      var number = parseInt(colorInput);

	      if (number < 360 && number > 0) {
	        return [number, number];
	      }

	    }

	    if (typeof colorInput === 'string') {

	      if (colorDictionary[colorInput]) {
	        var color = colorDictionary[colorInput];
	        if (color.hueRange) {return color.hueRange;}
	      }
	    }

	    return [0,360];

	  }

	  function getSaturationRange (hue) {
	    return getColorInfo(hue).saturationRange;
	  }

	  function getColorInfo (hue) {

	    // Maps red colors to make picking hue easier
	    if (hue >= 334 && hue <= 360) {
	      hue-= 360;
	    }

	    for (var colorName in colorDictionary) {
	       var color = colorDictionary[colorName];
	       if (color.hueRange &&
	           hue >= color.hueRange[0] &&
	           hue <= color.hueRange[1]) {
	          return colorDictionary[colorName];
	       }
	    } return 'Color not found';
	  }

	  function randomWithin (range) {
	    if (seed === null) {
	      return Math.floor(range[0] + Math.random()*(range[1] + 1 - range[0]));
	    } else {
	      //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
	      var max = range[1] || 1;
	      var min = range[0] || 0;
	      seed = (seed * 9301 + 49297) % 233280;
	      var rnd = seed / 233280.0;
	      return Math.floor(min + rnd * (max - min));
	    }
	  }

	  function HSVtoHex (hsv){

	    var rgb = HSVtoRGB(hsv);

	    function componentToHex(c) {
	        var hex = c.toString(16);
	        return hex.length == 1 ? '0' + hex : hex;
	    }

	    var hex = '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);

	    return hex;

	  }

	  function defineColor (name, hueRange, lowerBounds) {

	    var sMin = lowerBounds[0][0],
	        sMax = lowerBounds[lowerBounds.length - 1][0],

	        bMin = lowerBounds[lowerBounds.length - 1][1],
	        bMax = lowerBounds[0][1];

	    colorDictionary[name] = {
	      hueRange: hueRange,
	      lowerBounds: lowerBounds,
	      saturationRange: [sMin, sMax],
	      brightnessRange: [bMin, bMax]
	    };

	  }

	  function loadColorBounds () {

	    defineColor(
	      'monochrome',
	      null,
	      [[0,0],[100,0]]
	    );

	    defineColor(
	      'red',
	      [-26,18],
	      [[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]]
	    );

	    defineColor(
	      'orange',
	      [19,46],
	      [[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]]
	    );

	    defineColor(
	      'yellow',
	      [47,62],
	      [[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]]
	    );

	    defineColor(
	      'green',
	      [63,178],
	      [[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]]
	    );

	    defineColor(
	      'blue',
	      [179, 257],
	      [[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]]
	    );

	    defineColor(
	      'purple',
	      [258, 282],
	      [[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]]
	    );

	    defineColor(
	      'pink',
	      [283, 334],
	      [[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]]
	    );

	  }

	  function HSVtoRGB (hsv) {

	    // this doesn't work for the values of 0 and 360
	    // here's the hacky fix
	    var h = hsv[0];
	    if (h === 0) {h = 1;}
	    if (h === 360) {h = 359;}

	    // Rebase the h,s,v values
	    h = h/360;
	    var s = hsv[1]/100,
	        v = hsv[2]/100;

	    var h_i = Math.floor(h*6),
	      f = h * 6 - h_i,
	      p = v * (1 - s),
	      q = v * (1 - f*s),
	      t = v * (1 - (1 - f)*s),
	      r = 256,
	      g = 256,
	      b = 256;

	    switch(h_i) {
	      case 0: r = v; g = t; b = p;  break;
	      case 1: r = q; g = v; b = p;  break;
	      case 2: r = p; g = v; b = t;  break;
	      case 3: r = p; g = q; b = v;  break;
	      case 4: r = t; g = p; b = v;  break;
	      case 5: r = v; g = p; b = q;  break;
	    }

	    var result = [Math.floor(r*255), Math.floor(g*255), Math.floor(b*255)];
	    return result;
	  }

	  function HSVtoHSL (hsv) {
	    var h = hsv[0],
	      s = hsv[1]/100,
	      v = hsv[2]/100,
	      k = (2-s)*v;

	    return [
	      h,
	      Math.round(s*v / (k<1 ? k : 2-k) * 10000) / 100,
	      k/2 * 100
	    ];
	  }

	  function stringToInteger (string) {
	    var total = 0
	    for (var i = 0; i !== string.length; i++) {
	      if (total >= Number.MAX_SAFE_INTEGER) break;
	      total += string.charCodeAt(i)
	    }
	    return total
	  }

	  return randomColor;
	}));


/***/ },
/* 11 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
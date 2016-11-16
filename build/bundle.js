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

	__webpack_require__(10);

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var state = {
	  obstacles: []
	};

	var started = false;
	var spawner = void 0;
	var obstaclesLookup = void 0;
	var drones = [];
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
	  while (drones.length < _config2.default.droneCount) {
	    drones.push(spawner.spawn());
	  }

	  return drones;
	}

	function render() {
	  _canvas_util2.default.blurClear(ctx);

	  state.obstacles.forEach(function (obj) {
	    obj.draw(ctx, _config2.default);
	  });

	  drones.forEach(function (obj) {
	    obj.draw(ctx, _config2.default);
	  });

	  spawner.draw(ctx, _config2.default);
	}

	function startSimulation() {
	  requestAnimationFrame(simulate);
	}

	function simulate() {
	  if (drones.length === 0) {
	    drones = generateDrones();
	  }

	  var needsCleanup = false;
	  drones.forEach(function (drone) {
	    if (!drone.direction || drone.x < 1 || drone.y < 1 || drone.x >= _config2.default.w || drone.y >= _config2.default.h) {
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
	    drones = drones.filter(function (drone) {
	      return !drone.destroyed;
	    });
	  }

	  render();
	  requestAnimationFrame(simulate);
	}

	_config2.default.h = Math.floor(document.body.clientHeight); // / config.scale);
	_config2.default.w = Math.floor(document.body.clientWidth); // / config.scale);

	canvas.width = _config2.default.w;
	canvas.height = _config2.default.h;

	var obstacleCount = Math.floor(_config2.default.w * _config2.default.h / (_config2.default.scale * _config2.default.scale) * _config2.default.obstacleDensity);

	spawner = (0, _spawner2.default)(_util2.default.randCoord(_config2.default));

	state.obstacles = generateObstacles(obstacleCount);

	generateMoveMap();

	if (!started) {
	  startSimulation();
	}

	started = true;

	// var gui = new dat.GUI({
	//     autoPlace: false
	// });

	// var customContainer = document.getElementById('gui');
	// customContainer.appendChild(gui.domElement);

	// gui.add(config, 'addTarget');
	// gui.add(config, 'removeTarget');
	// gui.add(config, 'moreLines');
	// gui.add(config, 'lessLines');
	// gui.add(config, 'lineWidth').min(1).step(1);
	// gui.add(config, 'movingLines');
	// gui.add(config, 'movingTargets');

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
	  h: 0,
	  w: 0,
	  obstacleDensity: 0.15,
	  droneCount: 15,
	  scale: 7
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
	    // this.clear(ctx);
	    ctx.fillStyle = 'rgba(0,0,0,0.05)';
	    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
	  color: '#FF0000'
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
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  randomColor: function (_randomColor) {
	    function randomColor() {
	      return _randomColor.apply(this, arguments);
	    }

	    randomColor.toString = function () {
	      return _randomColor.toString();
	    };

	    return randomColor;
	  }(function () {
	    // let letters = '0123456789ABCDEF'.split('');
	    // let color = '#';
	    // for (var i = 0; i < 6; i++) {
	    //     color += letters[Math.floor(Math.random() * 16)];
	    // }
	    // return color;
	    return randomColor({
	      luminosity: 'bright'
	    });
	  }),
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
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
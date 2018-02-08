'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gallery = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.modulo = modulo;
exports.clamp = clamp;
exports.applyTransform = applyTransform;

var _swipedetector = require('swipedetector');

var _eventer = require('./eventer');

var _eventer2 = _interopRequireDefault(_eventer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function modulo(p, q) {
  // A modulo function which actually returns a value with the sign of the
  // divisor.
  var remainder = p % q;
  if (q > 0) return (remainder + q) % q;else return (remainder - q) % q;
}

function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

function applyTransform(element, transform) {
  element.style.webkitTransform = element.style.MozTransform = element.style.msTransform = element.style.OTransform = element.style.transform = transform;
}

var Gallery = exports.Gallery = function (_Eventer) {
  _inherits(Gallery, _Eventer);

  function Gallery(element, options) {
    _classCallCheck(this, Gallery);

    var _this = _possibleConstructorReturn(this, (Gallery.__proto__ || Object.getPrototypeOf(Gallery)).call(this));

    _this.element = element;
    _this.slider = _this.element.querySelector('[data-slider]');
    _this.slides = Array.from(_this.element.querySelectorAll('[data-slide]'));
    _this.thumbsContainer = _this.element.querySelector('[data-thumbs]');
    _this.playPause = _this.element.querySelector('[data-playpause]');

    _this.options = Object.assign({
      interval: 5000,
      autoPlay: true,
      createThumbs: true
    }, options);

    _this._current = null;
    _this._interval = null;

    _this._setWidthsAndPositions();

    _this.element.dataset.hideControls = _this.slides.length <= 1;

    _this.options.createThumbs && _this._createThumbs();

    _this.thumbs = Array.from(_this.element.querySelectorAll('[data-thumb]'));

    _this._setEventListeners();

    _this.reveal(0);

    _this.autoPlay = _this.options.autoPlay;
    return _this;
  }

  _createClass(Gallery, [{
    key: 'move',
    value: function move(direction) {
      this.autoPlay = false;
      this.reveal(this._current + direction);
    }
  }, {
    key: 'reveal',
    value: function reveal(index) {
      this.thumbs[this._current] && this.thumbs[this._current].removeAttribute('data-current');
      this._current = modulo(index, this.slides.length);
      this.emitEvent('reveal', [this._current]);
      applyTransform(this.slider, 'translate3d(-' + this.width * this._current + 'px, 0, 0)');
      this.thumbs[this._current] && this.thumbs[this._current].setAttribute('data-current', '');
    }
  }, {
    key: '_setWidthsAndPositions',
    value: function _setWidthsAndPositions() {
      var _this2 = this;

      this.width = parseFloat(getComputedStyle(this.element).getPropertyValue('width'));
      this.slider.style.width = this.width * this.slides.length + 'px';
      this.slides.forEach(function (slide) {
        slide.style.width = _this2.width + 'px';
      });
    }
  }, {
    key: '_setEventListeners',
    value: function _setEventListeners() {
      var _this3 = this;

      this.thumbs.forEach(function (thumb, index) {
        thumb.addEventListener('click', function (e) {
          e.preventDefault();
          _this3.autoPlay = false;
          _this3.reveal(index);
        });
      });

      // add 'click' to left and right arrow
      Array.from(this.element.querySelectorAll('[data-go]')).forEach(function (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          _this3.autoPlay = false;
          _this3.reveal(_this3._current + parseInt(e.currentTarget.dataset.go, 10));
        });
      });

      this.playPause && this.playPause.addEventListener('click', function (e) {
        e.preventDefault();
        _this3.autoPlay = !_this3.autoPlay;
      });

      var events = new _swipedetector.SwipeDetector(this.element).emitter;
      events.on('left', function () {
        _this3.autoPlay = false;
        _this3.reveal(_this3._current + 1);
      });
      events.on('right', function () {
        _this3.autoPlay = false;
        _this3.reveal(_this3._current - 1);
      });

      window.addEventListener('resize', function () {
        _this3._setWidthsAndPositions();
        _this3.reveal(_this3._current);
      });
    }
  }, {
    key: '_createThumbs',
    value: function _createThumbs() {
      var _this4 = this;

      if (this.thumbsContainer) {
        if (this.slides.length > 1) {
          this.slides.forEach(function () {
            var a = document.createElement('a');
            a.setAttribute('href', '');
            a.setAttribute('data-thumb', '');
            _this4.thumbsContainer.appendChild(a);
          });
        }
      } else {
        console.warn('bliss-gallery: no element with [data-thumbs] found.');
      }
    }
  }, {
    key: 'autoPlay',
    get: function get() {
      return this._interval != null;
    },
    set: function set(enable) {
      var _this5 = this;

      if (enable) {
        this.element.dataset.playing = true;
        if (!this._interval) {
          this._interval = setInterval(function () {
            return _this5.reveal(_this5._current + 1);
          }, this.options.interval);
        }
      } else {
        this.element.dataset.playing = false;
        if (this._interval) {
          clearInterval(this._interval);
          this._interval = null;
        }
      }
    }
  }]);

  return Gallery;
}(_eventer2.default);
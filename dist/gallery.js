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

var _events = require('events');

var _imagesloaded = require('imagesloaded');

var _imagesloaded2 = _interopRequireDefault(_imagesloaded);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var Gallery = exports.Gallery = function () {
  function Gallery(element, options) {
    var _this = this;

    _classCallCheck(this, Gallery);

    this._eventEmitter = new _events.EventEmitter();

    // element contains all gallery items (slider & controls)
    this.element = element;
    // sliderContainer only contains slider with slides
    this.sliderContainer = this.element.querySelector('[data-slider-container]');
    this.slider = this.element.querySelector('[data-slider]');
    this.slides = Array.from(this.element.querySelectorAll('[data-slide]'));
    this.thumbsContainer = this.element.querySelector('[data-thumbs]');
    this.playPause = this.element.querySelector('[data-playpause]');

    this.options = Object.assign({
      interval: 5000,
      autoPlay: true,
      createThumbs: true,
      visibleSlides: 1
    }, options);

    this._current = null;
    this._interval = null;

    this.element.dataset.hideControls = this.slides.length <= 1;

    this.options.createThumbs && this._createThumbs();

    this.thumbs = Array.from(this.element.querySelectorAll('[data-thumb]'));
    this._setEventListeners();

    (0, _imagesloaded2.default)(this.slides, { background: true }, function () {
      _this.element.dataset.imagesLoaded = true;
      _this._setWidthsAndPositions();
      _this.reveal(0);
      _this.autoPlay = _this.options.autoPlay;
    });
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
      var _this2 = this;

      this.thumbs[this._current] && this.thumbs[this._current].removeAttribute('data-current');
      this._current = modulo(index, this.slides.length - Math.floor(this.options.visibleSlides) + 1);
      this._eventEmitter.emit('reveal', this._current);

      var offset = this.width * this._current / this.options.visibleSlides - this.centeringOffset;

      applyTransform(this.slider, 'translate3d(' + -offset + 'px, 0, 0)');
      this.thumbs[this._current] && this.thumbs[this._current].setAttribute('data-current', '');

      this.slides.forEach(function (slide, index) {
        if (index < _this2._current || index >= _this2._current + _this2.options.visibleSlides) slide.dataset.slidePosition = -1;else slide.dataset.slidePosition = index - _this2._current;
      });
    }
  }, {
    key: '_setWidthsAndPositions',
    value: function _setWidthsAndPositions() {
      var _this3 = this;

      this.width = parseFloat(getComputedStyle(this.sliderContainer || this.element).getPropertyValue('width'));
      this.slider.style.width = this.width * this.slides.length + 'px';
      this.slides.forEach(function (slide) {
        slide.style.width = _this3.width / _this3.options.visibleSlides + 'px';
      });

      this.centeringOffset = 0.5 * this.width * (1 - Math.floor(this.options.visibleSlides) / this.options.visibleSlides);
    }
  }, {
    key: '_setEventListeners',
    value: function _setEventListeners() {
      var _this4 = this;

      this.thumbs.forEach(function (thumb, index) {
        thumb.addEventListener('click', function (e) {
          e.preventDefault();
          _this4.autoPlay = false;
          _this4.reveal(index);
        });
      });

      // add 'click' to left and right arrow
      Array.from(this.element.querySelectorAll('[data-go]')).forEach(function (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          _this4.autoPlay = false;
          _this4.reveal(_this4._current + parseInt(e.currentTarget.dataset.go, 10));
        });
      });

      this.playPause && this.playPause.addEventListener('click', function (e) {
        e.preventDefault();
        _this4.autoPlay = !_this4.autoPlay;
      });

      var events = new _swipedetector.SwipeDetector(this.element).emitter;
      events.on('left', function () {
        _this4.autoPlay = false;
        _this4.reveal(_this4._current + 1);
      });
      events.on('right', function () {
        _this4.autoPlay = false;
        _this4.reveal(_this4._current - 1);
      });

      window.addEventListener('resize', function () {
        _this4._setWidthsAndPositions();
        _this4.reveal(_this4._current);
      });
    }
  }, {
    key: '_createThumbs',
    value: function _createThumbs() {
      var _this5 = this;

      if (this.thumbsContainer) {
        if (this.slides.length > 1) {
          this.slides.forEach(function () {
            var a = document.createElement('a');
            a.setAttribute('href', '');
            a.setAttribute('data-thumb', '');
            _this5.thumbsContainer.appendChild(a);
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
      var _this6 = this;

      if (enable) {
        this.element.dataset.playing = true;
        if (!this._interval) {
          this._interval = setInterval(function () {
            return _this6.reveal(_this6._current + 1);
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
  }, {
    key: 'emitter',
    get: function get() {
      return this._eventEmitter;
    }
  }]);

  return Gallery;
}();
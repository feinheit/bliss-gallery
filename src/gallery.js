import {SwipeDetector} from 'swipedetector'
import {EventEmitter} from 'events';
import imagesLoaded from 'imagesloaded';

export function modulo(p, q) {
  // A modulo function which actually returns a value with the sign of the
  // divisor.
  let remainder = p % q;
  if (q > 0) return (remainder + q) % q;
  else return (remainder - q) % q;
}

export function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

export function applyTransform(element, transform) {
  element.style.webkitTransform =
  element.style.MozTransform =
  element.style.msTransform =
  element.style.OTransform =
  element.style.transform = transform;
}

export class Gallery {
  constructor(element, options) {
    this._eventEmitter = new EventEmitter()

    // element contains all gallery items (slider & controls)
    this.element = element;
    // sliderContainer only contains slider with slides
    this.sliderContainer = this.element.querySelector('[data-slider-container]');
    this.slider = this.element.querySelector('[data-slider]');
    this.slides = Array.from(this.element.querySelectorAll('[data-slide]'));
    this.thumbsContainer = this.element.querySelector('[data-thumbs]');
    this.playPause = this.element.querySelector('[data-playpause]');

    this.options = Object.assign(
      {
        interval: 5000,
        autoPlay: true,
        createThumbs: true,
        visibleSlides: 1,
      },
      options
    );

    this._current = null;
    this._interval = null;

    this.element.dataset.hideControls = (this.slides.length <= 1);

    this.options.createThumbs && this._createThumbs();

    this.thumbs = Array.from(this.element.querySelectorAll('[data-thumb]'));
    this._setEventListeners();

    imagesLoaded(this.slides, {background: true}, () => {
      this.element.dataset.imagesLoaded = true;
      this._setWidthsAndPositions();
      this.reveal(0);
      this.autoPlay = this.options.autoPlay;
    })
  }

  move(direction) {
    this.autoPlay = false;
    this.reveal(this._current + direction);
  }

  get autoPlay() {
    return (this._interval != null);
  }

  set autoPlay(enable) {
    if (enable) {
      this.element.dataset.playing = true;
      if (!this._interval) {
        this._interval = setInterval(
          () => this.reveal(this._current + 1),
          this.options.interval);
      }
    } else {
      this.element.dataset.playing = false;
      if(this._interval) {
       clearInterval(this._interval);
       this._interval = null;
     }
    }
  }

  get emitter() {
    return this._eventEmitter;
  }

  reveal(index) {
    this.thumbs[this._current] && this.thumbs[this._current].removeAttribute('data-current');
    this._current = modulo(index, this.slides.length - Math.floor(this.options.visibleSlides) + 1);
    this._eventEmitter.emit('reveal', this._current)

    let offset = (this.width * this._current / this.options.visibleSlides - this.centeringOffset)

    applyTransform(this.slider, `translate3d(${-offset}px, 0, 0)`);
    this.thumbs[this._current] && this.thumbs[this._current].setAttribute('data-current', '');

    this.slides.forEach((slide, index) => {
      if (index < this._current || index >= this._current + this.options.visibleSlides)
        slide.dataset.slidePosition = -1
      else
        slide.dataset.slidePosition = index - this._current
    })
  }

  _setWidthsAndPositions() {
    this.width = parseFloat(getComputedStyle(this.sliderContainer || this.element).getPropertyValue('width'));
    this.slider.style.width = `${this.width * this.slides.length}px`;
    this.slides.forEach(slide => {
      slide.style.width = `${this.width / this.options.visibleSlides}px`;
    });

    this.centeringOffset = 0.5 * this.width * (1 - Math.floor(this.options.visibleSlides) / this.options.visibleSlides)
  }

  _setEventListeners() {
    this.thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        this.autoPlay = false;
        this.reveal(index);
      });
    });

    // add 'click' to left and right arrow
    Array.from(this.element.querySelectorAll('[data-go]')).forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.autoPlay = false;
        this.reveal(this._current + parseInt(e.currentTarget.dataset.go, 10));
      });
    })

    this.playPause && this.playPause.addEventListener('click', (e) => {
      e.preventDefault();
      this.autoPlay = !this.autoPlay;
    });

    let events = new SwipeDetector(this.element).emitter;
    events.on('left', () => {
      this.autoPlay = false;
      this.reveal(this._current + 1);
    });
    events.on('right', () => {
      this.autoPlay = false;
      this.reveal(this._current - 1);
    });

    window.addEventListener('resize', () => {
      this._setWidthsAndPositions();
      this.reveal(this._current);
    });
  }

  _createThumbs() {
    if (this.thumbsContainer) {
      if (this.slides.length > 1) {
        this.slides.forEach(() => {
          let a = document.createElement('a');
          a.setAttribute('href', '');
          a.setAttribute('data-thumb', '');
          this.thumbsContainer.appendChild(a);
        });
      }
    } else {
      console.warn('bliss-gallery: no element with [data-thumbs] found.');
    }

  }
}

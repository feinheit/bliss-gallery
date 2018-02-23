==============
Gallery script
==============

Once upon a time built using Bliss, hence the name. Bliss is not used anymore though.

Example Usage
-------------

HTML::

    <div class="my-cool-slideshow">
        <div data-slider-container>
            <div data-slider>
                <figure data-slide>
                    <img src="image1.jpg" />
                    <figcaption>Image 1</figcaption>
                </figure>
                <figure data-slide>
                    <img src="image2.jpg" />
                    <figcaption>Image 2</figcaption>
                </figure>
            </div>
        </div>
        <a href="" data-go="-1" title="Previous">Previous</a>
        <a href="" data-go="1" title="Next">Next</a>
        <div class="slideshow__thumbs" data-thumbs></div>
    </div>

CSS::

    [data-slider-container] {
        overflow: hidden;
    }

    [data-slider] {
        display: flex;
    }

    [data-slide] {
        flex-shrink: 0;
    }

JS::

    import {Gallery} from 'bliss-gallery'

    const myGallery = new Gallery($('.my-cool-slideshow'), {
        interval: 5000,
        autoPlay: true,
        createThumbs: true,
        visibleSlides: 1,
    })

    // how to listen for the reveal event
    myGallery.emitter.addListener('reveal', slideIndex => console.info('revealed slide ' + slideIndex))

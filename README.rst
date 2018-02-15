==============
Gallery script
==============

Once upon a time built using Bliss, hence the name. Bliss is not used anymore though.


Usage::

    import {Gallery} from 'bliss-gallery'

    const myGallery = new Gallery(element, {
        interval: 5000,
        autoPlay: true,
        createThumbs: true,
        visibleSlides: 1,
    })

    // how to listen for the reveal event
    myGallery.emitter.addListener('reveal', slideIndex => console.info('revealed slide ' + slideIndex))

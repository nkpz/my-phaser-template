/*
 * gameAssets.js
 * ============================================================================
 *
 * Phaser 2.0.6 included a new asset loading system, which consists of parsing
 * a custom JSON file format, created either using a generator of sorts or
 * writing it mannually, declaring all asset dependencies needed by the game,
 * or parts of it.
 *
 * Here, we take advantage of this feature, leaving many of the `game.load.XXX`
 * calls out of the source code, making for leaner classes and shorter asset
 * loading routines.
 *
 * The main idea is that you have each asset pack declared as an array of
 * objects identified by a key under the hash object below. Each array will
 * contain a series of objects, containing type and properties of each asset.
 *
 * A sample `assetPack.js` comes with Phaser, included in the Phaser package,
 * under `bower_components/phaser/resources/` directory. Use that for a more
 * complete reference.
 *
 * Below, our example asset pack includes two sections:
 *
 * - One for the boot assets, including graphics used by the Preloader sprite;
 * - Another for the game main graphical assets, used throughout the game.
 */


export default {

  // - Boot Assets ------------------------------------------------------------

  'boot': [

    {
      'key': 'splash-screen',
      'type': 'image',
      'url': 'images/splash-screen.png'
    },

    {
      'key': 'progress-bar',
      'type': 'spritesheet',
      'frameWidth': 352,
      'frameHeight': 32,
      'frameMax': 2,
      'margin': 8,
      'spacing': 8,
      'url': 'images/progress-bar.png'
    }

  ],


  // - Game section -----------------------------------------------------------

  'game': [

    {
      'key': 'buttons',
      'type': 'atlasJSONHash',
      'atlasURL': 'atlases/buttons.json',
      'textureURL': 'images/buttons.png'
    },

    {
      'key': 'credits',
      'type': 'image',
      'url': 'images/credits.png'
    },

    {
      'key': 'levels',
      'type': 'atlasJSONHash',
      'atlasURL': 'atlases/levels.json',
      'textureURL': 'images/levels.png'
    },

    {
      'key': 'phaser',
      'type': 'image',
      'url': 'images/phaser.png'
    },

    {
      'key': 'title',
      'type': 'image',
      'url': 'images/title.png'
    }

  ]

};

/*
 * Preload state
 * ============================================================================
 *
 * This state takes care of displaying your fancy preloader screen and
 * loading the main game assets and data.
 */


// Again, we'll need the asset data to load the remaining game assets,
// including graphics, music and sound effects.
import assets from '../data/assets';

// Then, to make matters easier, I prepared a SplashScreen prefab, which only
// purpose is displaying the decorated, loading screen with the charging
// progress bar, telling at which rate our assets have been loaded. Hopefully,
// that will last long enough so our preloader will just blink on the screen ;)
import SplashScreen from '../objects/SplashScreen';


export default class Preload extends Phaser.State {

  init () {
    // In this example, we depend on WebAudio for playing sounds effects. So,
    // here, we take all sound effects key names that need to be decoded before
    // they can be played in the game.
    this.soundsToDecode = this.getSoundsToDecode();

    // Also, this helper flag is used to hold the state manager until all
    // assets have been preloaded.
    this.assetsReady = false;
  }

  preload () {
    this.showSplashScreen();

    // Load all remaining audio and graphical assets.
    this.loadGraphicalAssets();
    this.loadAudioAssets();
  }

  create () {
    this.assetsReady = true;
  }

  update () {
    // Now, we wait until all sound effects have been decoded into memory,
    // then skip to the Menu screen.
    if (this.assetsReady && this.allSoundsDecoded) {
      this.state.start('Menu');
    }
  }

  // --------------------------------------------------------------------------

  showSplashScreen () {
    let splashScreen = new SplashScreen(this.game);

    this.load.setPreloadSprite(splashScreen.progressFiller);
  }

  getSoundsToDecode () {
    // If WebAudio is supported in the device, take all files key names to
    // decode.
    if ('sounds' in assets && this.webAudioSupported) {
      return assets['sounds'].map(({ key }) => key);
    }

    return [];
  }

  loadGraphicalAssets () {
    // Another `load#pack` call to load our game assets.
    this.load.pack('game', null, assets);
  }

  loadAudioAssets () {
    // Here, we tell Phaser that, if there's WebAudio support, to load all
    // sound effects and dequeue each decoded audio key name from the list we
    // took earlier.
    if ('sounds' in assets && this.webAudioSupported) {
      this.load.pack('sounds', null, assets);
      this.sound.onSoundDecode.add(this.dequeueDecodedSound, this);
    }
  }

  dequeueDecodedSound (key) {
    // Take out the key name of the last decoded sound effect from our list.
    var position = this.soundsToDecode.indexOf(key);

    if (position > -1) {
      this.soundsToDecode.splice(position, 1);
    }
  }

  // --------------------------------------------------------------------------

  // Do we have WebAudio available?
  get webAudioSupported () {
    return this.game.device.webAudio;
  }

  // Are we done decoding sounds?
  get allSoundsDecoded () {
    return this.soundsToDecode.length === 0;
  }

}

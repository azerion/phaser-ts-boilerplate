Orange Games Boilerplate
========================

Yet another Phaser Boilerplate, but instead of showing a working toolchain, this is all about fixing bugs, working around browser issues, analytics and advertising. This is the core of every HTML5 Orange Game :)

Due to this boilerplate having no focus on the toolchain, we also asume in this readme that you have some basic knowledge about [grunt](https://gruntjs.com/), [npm](https://www.npmjs.com/) and [TypeScript](https://www.typescriptlang.org/)

Getting Started
---------------

So the first thing you'd want to is too clone this game repo and start changing some ID's around in the Constants.ts file.
We have some base ID's setup for [google analytics](https://accounts.google.com), [game analytics](http://www.gameanalytics.com/) and [GameDistribution ads](http://gamedistribution.com/)

### Development
During development itself you only need to run 1 command, namely:
```
PC@OG:~/Projects/GameName$ grunt dev
```

First it will run typescript, then start a server and open the watch task.
This will make sure that every time a Typescript and/or Asset file has changed, it wil update the development directory (_build/dev).

A webserver is also started on your local machine on port 8080. You can point your browser to http://localhost:8080, check out your game, and grunt will refresh your browser every time a change has been made.

### Production
For production builds there are two commands, one that compiles and minifies all the code and assets, and one for writing a version number.
```
PC@OG:~/Projects/GameName$ grunt dist
Running "clean:dist" (clean) task
>> 4 paths cleaned.

Running "copy:dist" (copy) task
Created 1 directories, copied 21 files

Running "typescript:dist" (typescript) task
File /home/person/Projects/GameName/_build/dist/gameName-1.0.2.js created.
js: 1 file, map: 0 files, declaration: 0 files (2300ms)

Running "uglify:dist" (uglify) task
>> 1 file created.

Running "clean:temp" (clean) task
>> 1 path cleaned.

Running "htmlbuild:dist" (htmlbuild) task
>> File _build/dist/index.html created !

Done, without errors.
```

So here we're gonna create the version of the current build, first and foremost it will help with cachebusting when uploading a new game, but it will also write some external packages to an array that allows us loading them from a cdn.
Currently it will only add @orange-games namespaced packages to the array, but you can change it in the gruntFile to include any pacakge you want.

For the moment we use jsdelivr to load the packages.
```
PC@OG:~/Projects/GameName$ grunt writeVersion --buildNumber=test
Running "writeVersion" task

Done, without errors.
```


## Development

It's time to start developing!
Keep the following guidelines in mind when developing a game.

Configuration
=============

So in order to set up the correct analytics and ads you need to make some accounts at:
- [google analytics](https://support.google.com/analytics/answer/1008015?hl=en)
- [game analytics](http://www.gameanalytics.com/docs/faq)
- [GameDistribution ads](http://gamedistribution.com/api/)

Then get the id's you're given and you can put them in the Constants.


Code
====

### Game logic

In the ts/Backend folder goes all the logic of the game. This is logic without any front-end or animations linked to it. The idea is that this logic can be copied 1 on 1 to the backend server so that when the game is on the portal, this backend server knows exactly whats going on in the game.
This makes online integration a lot easier for the game.
```
./ts/Backend
```


### Game States

Any class that extends a Phaser.State should be located in the ts/States folder, also don't forget to register the new state in app.ts :)
```javascript
//Here we load all the states, but they shouldn't start automaticly
this.state.add(Boot.Name, Boot, false);
this.state.add(Fabrique.SplashScreen.Preloader.Name, Fabrique.SplashScreen.Preloader, false);
this.state.add(Menu.Name, Menu, false);
this.state.add(Gameplay.Name, Gameplay, false);
```
All these files are placed here.

```
./ts/States
```

### Data

Configs, asset names etc. go into
```
./ts/Data
```

### Objects

Sometimes, in-game objects are a bit bigger than just a Phaser.Sprite or Phaser.Image.
In those cases, we create separate classes for them that extend any of the default Phaser objects (like Phaser.Sprite or Phaser.Button) and place them in the ts/Objecst folder.
```
./ts/Data/Objects
```

### Fabrique

The ts/Fabrique contains a set of files, that will mostly be re-used utils for other games like a FadeToColor state, and stuff that is needed in order for the TypeScript compiler to find all the references.
Like Fabrique.IState or Fabrique.IGame

Assets
======

### Images
First, add the images to this folder:

```
./assets/images
```
Then implement them in code as so:

```javascript
class Images {
 //All the separate images needed in the game
 public static Background: string = 'background';
}
```

Next you need to add the static image reference to the preloadList as well, so the game knows this image has to be loaded.
```javascript
class Images {
//All the seperate images needed in the game
public static Background: string = 'background';

public static preloadList: string[] = [
    Images.Background,
];
}
```

Now the game will automatically load the background image, and all you have to do is use the static reference to add it to the game:
```javascript
game.add.image(
    100,                // x position
    100,                // y position
    Images.Background   // Loaded image reference
);
```

### Sound

This should be located in
```
./assets/sound
```

The adding and handling of sound is the same as those of images, but the added requirement for audio is that every audio file needs an mp3, ogg and m4a version. This is due to cross-browser support.


### Fonts

Fonts require files to be in 2 places. 
First of all we need a css file that defines a font-face in the css folder
```
./assets/css/yourFontFace.css
```

Then the font files themselves should be place in
```
./assets/fonts
```

WebFonts require a definition in css, apart from any woff/ttf/eot files, thats why fonts are located into folders.
Ideally every font has woff, eot, svg AND ttf files to make sure it works in every major browser.

Once that's done you can add the font to the fontloader, which is located in app.ts.

```typescript
//Load the fonts
WebFont.load(<WebFont.Config>{
 custom: <WebFont.Custom>{
     families: ['Century Gothic'],
     urls: [
         'assets/css/CenturyGothic.css'
     ]
 }
});
```
In the above example there is only one font specified, but this can be extended with an infinite amount of fonts.

The WebFont.load will be implemented along with update function which will check if fonts have been loaded.
 And if so, the function will update the text to use the loaded fonts.


### Atlasses

This should be located in
```
./assets/atlas
```
Atlases are images that contain multiple assets in a game. Every atlas image has a corresponding JSON file that tells the Phaser framework where in the atlas each image is located, and what the image's original size should be.

Our atlases are generated with TexturePacker, and we store the .tps config file also in assets/atlas folder.

Other than that atlases are treated and loaded the same as images and audio.

Notable games
=============

We have over 100 games made with this boilerplate, here are some of our best titles:

[![Game](http://publisher.orangegames.com/images/icons/twisted-city.png)][game1]
[![Game](http://publisher.orangegames.com/images/icons/olli-ball.png)][game2]
[![Game](http://publisher.orangegames.com/images/icons/bubble-burst.png)][game3]
[![Game](http://publisher.orangegames.com/images/icons/fun-game-play-mahjong.png)][game4]
[![Game](http://publisher.orangegames.com/images/icons/jewel-burst.png)][game5]
[![Game](http://publisher.orangegames.com/images/icons/euro-football-kick-2016.png)][game6]

Credits
=======
[CSS loader](https://projects.lukehaas.me/css-loaders/) by [@lukehaas](https://twitter.com/lukehaas)

Handy Sources / Links
=====================
Here you find a list of libraries used by the games in general. They link to the lib's respective docs

- [phaser-cachebuster](https://github.com/orange-games/phaser-cachebuster) A Phaser plugin that allows for assets to be cachebusted by queryparameters
- [phaser-ads](https://github.com/orange-games/phaser-ads) A Phaser plugin for providing nice ads integration in your phaser.io game
- [phaser-spine](https://github.com/orange-games/phaser-spine) A plugin for Phaser that adds Spine support
- [phaser-i18next](https://github.com/orange-games/phaser-i18next) Phaser plugin for translations using i18next
- [phaser-web-workers](https://github.com/orange-games/phaser-web-workers) A simple Phaser plugin that allows you to easily integrate Web Workers in your game
- [phaser-super-storage](https://github.com/orange-games/phaser-super-storage) A cross platform pluggable storage plugin for Phaser.
- [webfontloader](https://github.com/typekit/webfontloader) A library that allows for 'good' loading of multiple fonts
- [phaser-nineslice](https://github.com/orange-games/phaser-nineslice) A plugin that adds 9 slice scaling support
- [phaser-input](https://github.com/orange-games/phaser-input) An input library that works on canvas and WebGL. Also has mobile support.

[game1]: http://html5.GameDistribution.com/6984522dd6714dd8b92b5285c6bc0ceb/
[game2]: http://html5.GameDistribution.com/5720633fecd545a188471d3ce7a7bbeb/
[game3]: http://html5.GameDistribution.com/405c00612981466cbc5d9dcef4214811/
[game4]: http://html5.GameDistribution.com/4b4ac998ef6c43958f82bb3a9819d2f3/
[game5]: http://html5.GameDistribution.com/49258a0e497c42b5b5d87887f24d27a6/
[game6]: http://html5.GameDistribution.com/b23deb025996424da64cf8f8cf986fd8/
HTML5 Game Boilerplate
=======================

This is a boilerplate for HTML5 games, it can be used to develop new games or prototypes. Simply make a copy of this in gitlab to start working!

Getting Started
---------------

First you want to create a new Game repo in gitlab. This should be done in the team-toast group/namespace found [here](https://gitlab.ds.orangegames.com/team-toast/).

If you're too lazy to figure out how, you can go [here](https://gitlab.ds.orangegames.com/projects/new?namespace_id=15#).

Give the project the name you want, and now tell Gitlab you'd like to Import a project from *any repo by url*.

You'll want to give the repo URL of this boilerplate repo, which is:
* git@gitlab.ds.orangegames.com:quartz/boilerplate.git

And you're done! At least for the gitlab part :P

### Development
During development itself you only need to run 1 command, namely:
```
PC@OG:~/Projects/GameName$ grunt dev
```

First it will run typescript, then start a server and open the watch task.
This will make sure that every time a Typescript and/or Asset file has changed, it wil update the development directory (_build/dev).

A webserver is also started on your local machine on port 8080. You can point your browser to http://localhost:8080, check out your game, and grunt will refresh your browser every time a change has been made.

### Production
For production builds there are two commands, one that compiles and minifies all the code and assets, and one for writing a version number. This is used for cachebusting.
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
PC@OG:~/Projects/GameName$ grunt writeVersion --buildNumber=test
Running "writeVersion" task

Done, without errors.

```

Development
------------

It's time to start developing!
Keep the following guidelines in mind when developing a game.

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
this.state.add(Fabrique.PreSplash.Name, Fabrique.PreSplash, false);
this.state.add(Fabrique.FunnyGamesSplash.Name, Fabrique.FunnyGamesSplash, false);
this.state.add(GamePlay.Name, GamePlay, false);
```
All these files are placed here.

```
./ts/States
```

### Data

Translations, configs, asset names etc. go into
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

The ts/Fabrique contains a set of files, that will mostly be re-used utils for other games like RandomInRange function or a FadeToColor state, and stuff that is needed in order for the TypeScript compiler to find all the references.
Like Fabrique.State or Fabrique.Game


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

Once that's done you can add the font to the fontloader, which is located in app.ts

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


### Atlasses

This should be located in
```
./assets/atlas
```
Atlases are images that contain multiple assets in a game. Every atlas image has a corresponding JSON file that tells the Phaser framework where in the atlas each image is located, and what the image's original size should be.

Our atlases are generated with TexturePacker, and we store the .tps config file also in assets/atlas folder.

Other than that atlases are treated and loaded the same as images and audio.
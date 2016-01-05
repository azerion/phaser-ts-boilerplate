Gembly Game Boilerplate
=======================

This is a boilerplate for Gembly HTML5 games, it can be used to develop new games or prototypes. Simply make a copy of this in gitlab to start working!

Getting Started
---------------

First you want to create a new Game repo in gitlab. This should be done in the team-toast group/namespace found [here](https://gitlab.ds.orangegames.com/team-toast/).

If you're too lazy to figure out how, you can go [here](https://gitlab.ds.orangegames.com/projects/new?namespace_id=15#).

Give the project the name you want, and now tell Gitlab you'd like to Import a project from *any repo by url*.

You'll want to give the repo URL of this boilerplate repo, which is:
* git@gitlab.ds.orangegames.com:quartz/boilerplate.git

And you're done! At least for the gitlab part :P

### Local Machine

Now you can move on to create a fresh checkout, so check out the repo you just created in a place where you'd like to see it.
```
zale@Zelda:~/your/path/to/games$ git clone git@gitlab.ds.orangegames.com:team-toast/my-awesome-new-game.git
```

Now I'm gonna assume you've got Node, NPM and Grunt running, if not you probably don't work at Orange Games and don't give a shit.

Go into your fresh directory, run npm install and start working in your favorite IDE with the **grunt dev** job running!

```
zale@Zelda:~/your/path/to/games$ cd my-awesome-new-game/
zale@Zelda:~/your/path/to/games/my-awesome-new-game$ grunt dev
Running "typescript:dev" (typescript) task
File _build/dev/game.min.js created.
js: 1 file, map: 0 files, declaration: 1 file (2156ms)

Running "connect:server" (connect) task
Started connect web server on http://localhost:8080

Running "watch" task
Waiting...

```

point your browser to the given URL and start testing!

Files and Folders
-----------------

### Code

Game states go into

```
./ts/States
```

backend logic should end up in
```
./ts/Backend
```

Translations, configs, asset names etc. go into
```
./ts/Data
```

Anything else you come up with comes in
```
./ts/Data/Objects
```

### Assets
Images should go into
```
./assets/images
```

audio should be located in
```
./assets/audio
```

Fonts require files to be in 2 places. 
First of all we need a css file that defines a font-face in the css folder
```
./assets/css/yourFontFace.css
```

Then the font files themselfs should be place in
```
./assets/fonts
```
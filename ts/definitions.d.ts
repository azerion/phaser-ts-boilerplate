//We load all references in here, so everything is still nicely contained in the ts folder
//This way we keep the vendor folder exclusive to stuff that we can't get trough npm
/// <reference path='../node_modules/phaser/typescript/pixi.d.ts'/>
/// <reference path='../node_modules/phaser/typescript/phaser.d.ts'/>
/// <reference path='../node_modules/@orange-games/phaser-spine/build/phaser-spine.d.ts'/>
/// <reference path='../node_modules/@orange-games/phaser-ads/build/phaser-ads.d.ts'/>
/// <reference path='../node_modules/@orange-games/phaser-cachebuster/build/phaser-cachebuster.d.ts'/>
/// <reference path='../node_modules/@orange-games/phaser-super-storage/build/phaser-super-storage.d.ts'/>
/// <reference path='../node_modules/@orange-games/splash/build/splash.d.ts'/>

declare var version: string;
declare var libs: string[];

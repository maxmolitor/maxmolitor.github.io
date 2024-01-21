Epochal
=======

Experimental implementation of the Objective C / Cocos2D Epochal App

https://itunes.apple.com/de/app/epochal/id496222635?mt=8

Structure
---------

app:EpochalApp
	allData: Array of structs from var/data.js
	stage:PIXI.Container
		scene:LabeledGraphics Container
				[Thumbnail Sprite 1, Thumbnail Sprite 2, ...]
		timebar:Timebar (see timeline.js)
		scatters:ScatterContainer (see lib/pixi/scatter.js)
	views: Array of Views/Layouts

Views (Overview, Timeline, ...) draw into app.scene, app.timebar and
arrange the thumbnbail sprites on the scene


Support of outdated Browsers
----------------------------

This apps shows how older browsers like Firefox 45.8 can be supported.
Instead of using the most current ECMA 2016 script we use BabelJS to
transpile the code in ECMA 2015.

Requirements:

Go to root of iwmbrowser, e.g.:

	cd projects/iwmbrowser

Install node requirements locally:

	npm install --save-dev babel-cli babel-preset-es2016 babel-preset-stage-0

Go to app folder

	cd apps/epochal

Run the bin/release.py script to transpile the sources into special dist
folders.

Open babel.html in Firefox 45.8




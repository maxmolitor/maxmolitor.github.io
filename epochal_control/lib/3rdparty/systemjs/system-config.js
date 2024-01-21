SystemJS.config({
	baseURL: '../../',
	map: {
		"plugin-babel": "lib/3rdparty/systemjs/plugin-babel.js",
		"systemjs-babel-build": "lib/3rdparty/systemjs/systemjs-babel-browser.js",
		"3rdparty": "lib/3rdparty/3rdparty.js",
		/* Don't know why these should be mapped?!? */
		"d3-selection": "lib/3rdparty/d3/d3.js",
		"d3-transition": "lib/3rdparty/d3/d3.js",
		"TweenLite": "lib/3rdparty/greensock/src/uncompressed/TweenLite.js",
		"CustomEase": "lib/3rdparty/greensock/src/uncompressed/easing/CustomEase.js",
		"CSSPlugin": "lib/3rdparty/greensock/src/uncompressed/plugins/CSSPlugin.js"
	},
	transpiler: "plugin-babel",
	meta: {
		"*.js": {
			authorization: true,
			babelOptions: {
				es2015: false
			}
		}
	}
})
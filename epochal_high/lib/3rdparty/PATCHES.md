# Patches

A listing of all manual changes of 3rdparty files.

## PIXI.js

+ Ensure that a minimal compressed texture example is working and apply changes to deepzoom.js~~ => Patched in pixi.js (Line 5794).     + Changed:

    ```javascript
    if (status === STATUS_NONE && text.length > 0)) {`
    ```
    to
    ```javascript
    if (status === STATUS_NONE && (text.length > 0 || xhr.responseURL.endsWith
    ('.dds'))) {                  // PATCH: Kupke, 07.08.2017`
    ```
+ Loading SVG Textures from filesystem
    + Problem: In PIXI 4.7.0 the XHTTP Request of PIXI, when loading an SVG from the filesystem returned an error message and prevented the svg from being displayed.
    + Solution: Just suppress the error when on local filesystem.
    + Location: *BaseTexture.prototype._loadSvgSourceUsingXhr*

    ```javascript
        if(window.location.protocol !== "file:"){ // This condition was added.
            if (svgXhr.readyState !== svgXhr.DONE || svgXhr.status !== 200) {
                throw new Error('Failed to load SVG using XHR.');
            }
        }
    ```
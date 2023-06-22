(function () {
  'use strict';

  /* globals WebKitPoint */

  /** Returns an id that is guaranteed to be unique within the livetime of the
   * application
   * @return {string}
   */
  let _idGenerator = 0;
  function getId() {
      return 'id' + _idGenerator++
  }

  /** Static methods to compute 2D points with x and y coordinates.
   */
  class Points {
      static length(a) {
          return Math.sqrt(a.x * a.x + a.y * a.y)
      }

      static normalize(p) {
          let len = this.length(p);
          return this.multiplyScalar(p, 1 / len)
      }

      static mean(a, b) {
          return {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
      }

      static subtract(a, b) {
          return {x: a.x - b.x, y: a.y - b.y}
      }

      static multiply(a, b) {
          return {x: a.x * b.x, y: a.y * b.y}
      }

      static multiplyScalar(a, b) {
          return {x: a.x * b, y: a.y * b}
      }

      static add(a, b) {
          return {x: a.x + b.x, y: a.y + b.y}
      }

      static negate(p) {
          return {x: -p.x, y: -p.y}
      }

      static angle(p1, p2) {
          return Math.atan2(p1.y - p2.y, p1.x - p2.x)
      }

      static arc(p, alpha, radius) {
          return {
              x: p.x + radius * Math.cos(alpha),
              y: p.y + radius * Math.sin(alpha)
          }
      }

      static distance(a, b) {
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          return Math.sqrt(dx * dx + dy * dy)
      }

      static fromPageToNode(element, p) {
          //    if (window.webkitConvertPointFromPageToNode) {
          //             return window.webkitConvertPointFromPageToNode(element,
          //                                                     new WebKitPoint(p.x, p.y))
          //         }
          return window.convertPointFromPageToNode(element, p.x, p.y)
      }

      static fromNodeToPage(element, p) {
          //  if (window.webkitConvertPointFromNodeToPage) {
          //             return window.webkitConvertPointFromNodeToPage(element,
          //                                                     new WebKitPoint(p.x, p.y))
          //         }
          return window.convertPointFromNodeToPage(element, p.x, p.y)
      }
  }

  /** Static methods to compute angles.
   */
  class Angle {
      static normalize(angle) {
          let twoPI = Math.PI * 2.0;
          while (angle > Math.PI) {
              angle -= twoPI;
          }
          while (angle < -Math.PI) {
              angle += twoPI;
          }
          return angle
      }

      static normalizeDegree(angle) {
          let full = 360.0;
          while (angle > 180.0) {
              angle -= full;
          }
          while (angle < -180.0) {
              angle += full;
          }
          return angle
      }

      static diff(a, b) {
          return Angle.normalize(Math.atan2(Math.sin(a - b), Math.cos(a - b)))
      }

      static degree2radian(degree) {
          return Math.PI * degree / 180.0
      }

      static radian2degree(rad) {
          return 180.0 / Math.PI * rad
      }
  }

  class Elements$1 {
      static setStyle(element, styles) {
          for (let key in styles) {
              element.style[key] = styles[key];
          }
      }

      static addClass(element, cssClass) {
          element.classList.add(cssClass);
      }

      static removeClass(element, cssClass) {
          element.classList.remove(cssClass);
      }

      static toggleClass(element, cssClass) {
          element.classList.toggle(cssClass);
      }

      static hasClass(element, cssClass) {
          return element.classList.contains(cssClass)
      }
  }

  class MapProxy {
      /* This class is needed if we want to use the interaction classes
      in Firefox 45.8 and modern Browsers.

      A workaround for https://github.com/babel/babel/issues/2334
    */
      constructor() {
          this.map = new Map();
      }

      get size() {
          return this.map.size
      }

      get(key) {
          return this.map.get(key)
      }

      set(key, value) {
          return this.map.set(key, value)
      }

      delete(key) {
          return this.map.delete(key)
      }

      clear() {
          return this.map.clear()
      }

      has(key) {
          return this.map.has(key)
      }

      keys() {
          return this.map.keys()
      }

      values() {
          return this.map.values()
      }

      entries() {
          return this.map.entries()
      }

      forEach(func) {
          this.map.forEach(func);
      }
  }

  /* Based om https://gist.github.com/cwleonard/e124d63238bda7a3cbfa */
  class Polygon {
      /*
       *  This is the Polygon constructor. All points are center-relative.
       */
      constructor(center) {
          this.points = new Array();
          this.center = center;
      }

      /*
       *  Point x and y values should be relative to the center.
       */
      addPoint(p) {
          this.points.push(p);
      }

      /*
       *  Point x and y values should be absolute coordinates.
       */
      addAbsolutePoint(p) {
          this.points.push({x: p.x - this.center.x, y: p.y - this.center.y});
      }

      /*
       * Returns the number of sides. Equal to the number of vertices.
       */
      getNumberOfSides() {
          return this.points.length
      }

      /*
       * rotate the polygon by a number of radians
       */
      rotate(rads) {
          for (let i = 0; i < this.points.length; i++) {
              let x = this.points[i].x;
              let y = this.points[i].y;
              this.points[i].x = Math.cos(rads) * x - Math.sin(rads) * y;
              this.points[i].y = Math.sin(rads) * x + Math.cos(rads) * y;
          }
      }

      /*
       *  The draw function takes as a parameter a Context object from
       *  a Canvas element and draws the polygon on it.
       */
      draw(context, {lineWidth = 2, stroke = '#000000', fill = null} = {}) {
          context.beginPath();
          context.moveTo(
              this.points[0].x + this.center.x,
              this.points[0].y + this.center.y
          );
          for (let i = 1; i < this.points.length; i++) {
              context.lineTo(
                  this.points[i].x + this.center.x,
                  this.points[i].y + this.center.y
              );
          }
          context.closePath();
          context.lineWidth = lineWidth;
          if (stroke) {
              context.strokeStyle = stroke;
              context.stroke();
          }
          if (fill) {
              context.fillStyle = fill;
              context.fill();
          }
      }

      absolutePoints() {
          let result = new Array();
          for (let p of this.points) {
              result.push(Points.add(p, this.center));
          }
          return result
      }

      flatAbsolutePoints() {
          let result = new Array();
          for (let p of this.points) {
              let a = Points.add(p, this.center);
              result.push(a.x);
              result.push(a.y);
          }
          return result
      }

      /*
       *  This function returns true if the given point is inside the polygon,
       *  and false otherwise.
       */
      containsPoint(pnt) {
          let nvert = this.points.length;
          let testx = pnt.x;
          let testy = pnt.y;

          let vertx = new Array();
          for (let q = 0; q < this.points.length; q++) {
              vertx.push(this.points[q].x + this.center.x);
          }

          let verty = new Array();
          for (let w = 0; w < this.points.length; w++) {
              verty.push(this.points[w].y + this.center.y);
          }

          let i,
              j = 0;
          let c = false;
          for (i = 0, j = nvert - 1; i < nvert; j = i++) {
              if (
                  verty[i] > testy != verty[j] > testy &&
                  testx <
                      (vertx[j] - vertx[i]) *
                          (testy - verty[i]) /
                          (verty[j] - verty[i]) +
                          vertx[i]
              )
                  c = !c;
          }
          return c
      }

      multiplyScalar(scale) {
          let center = Points.multiplyScalar(this.center, scale);
          let clone = new Polygon(center);
          for (let p of this.points) {
              clone.addPoint(Points.multiplyScalar(p, scale));
          }
          return clone
      }

      /*
       *  To detect intersection with another Polygon object, this
       *  function uses the Separating Axis Theorem. It returns false
       *  if there is no intersection, or an object if there is. The object
       *  contains 2 fields, overlap and axis. Moving the polygon by overlap
       *  on axis will get the polygons out of intersection.
       */
      intersectsWith(other) {
          let axis = {x: 0, y: 0};
          let tmp, minA, maxA, minB, maxB;
          let side, i;
          let smallest = null;
          let overlap = 99999999;

          /* test polygon A's sides */
          for (side = 0; side < this.getNumberOfSides(); side++) {
              /* get the axis that we will project onto */
              if (side == 0) {
                  axis.x =
                      this.points[this.getNumberOfSides() - 1].y -
                      this.points[0].y;
                  axis.y =
                      this.points[0].x -
                      this.points[this.getNumberOfSides() - 1].x;
              } else {
                  axis.x = this.points[side - 1].y - this.points[side].y;
                  axis.y = this.points[side].x - this.points[side - 1].x;
              }

              /* normalize the axis */
              tmp = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
              axis.x /= tmp;
              axis.y /= tmp;

              /* project polygon A onto axis to determine the min/max */
              minA = maxA = this.points[0].x * axis.x + this.points[0].y * axis.y;
              for (i = 1; i < this.getNumberOfSides(); i++) {
                  tmp = this.points[i].x * axis.x + this.points[i].y * axis.y;
                  if (tmp > maxA) maxA = tmp;
                  else if (tmp < minA) minA = tmp;
              }
              /* correct for offset */
              tmp = this.center.x * axis.x + this.center.y * axis.y;
              minA += tmp;
              maxA += tmp;

              /* project polygon B onto axis to determine the min/max */
              minB = maxB =
                  other.points[0].x * axis.x + other.points[0].y * axis.y;
              for (i = 1; i < other.getNumberOfSides(); i++) {
                  tmp = other.points[i].x * axis.x + other.points[i].y * axis.y;
                  if (tmp > maxB) maxB = tmp;
                  else if (tmp < minB) minB = tmp;
              }
              /* correct for offset */
              tmp = other.center.x * axis.x + other.center.y * axis.y;
              minB += tmp;
              maxB += tmp;

              /* test if lines intersect, if not, return false */
              if (maxA < minB || minA > maxB) {
                  return false
              } else {
                  let o = maxA > maxB ? maxB - minA : maxA - minB;
                  if (o < overlap) {
                      overlap = o;
                      smallest = {x: axis.x, y: axis.y};
                  }
              }
          }

          /* test polygon B's sides */
          for (side = 0; side < other.getNumberOfSides(); side++) {
              /* get the axis that we will project onto */
              if (side == 0) {
                  axis.x =
                      other.points[other.getNumberOfSides() - 1].y -
                      other.points[0].y;
                  axis.y =
                      other.points[0].x -
                      other.points[other.getNumberOfSides() - 1].x;
              } else {
                  axis.x = other.points[side - 1].y - other.points[side].y;
                  axis.y = other.points[side].x - other.points[side - 1].x;
              }

              /* normalize the axis */
              tmp = Math.sqrt(axis.x * axis.x + axis.y * axis.y);
              axis.x /= tmp;
              axis.y /= tmp;

              /* project polygon A onto axis to determine the min/max */
              minA = maxA = this.points[0].x * axis.x + this.points[0].y * axis.y;
              for (i = 1; i < this.getNumberOfSides(); i++) {
                  tmp = this.points[i].x * axis.x + this.points[i].y * axis.y;
                  if (tmp > maxA) maxA = tmp;
                  else if (tmp < minA) minA = tmp;
              }
              /* correct for offset */
              tmp = this.center.x * axis.x + this.center.y * axis.y;
              minA += tmp;
              maxA += tmp;

              /* project polygon B onto axis to determine the min/max */
              minB = maxB =
                  other.points[0].x * axis.x + other.points[0].y * axis.y;
              for (i = 1; i < other.getNumberOfSides(); i++) {
                  tmp = other.points[i].x * axis.x + other.points[i].y * axis.y;
                  if (tmp > maxB) maxB = tmp;
                  else if (tmp < minB) minB = tmp;
              }
              /* correct for offset */
              tmp = other.center.x * axis.x + other.center.y * axis.y;
              minB += tmp;
              maxB += tmp;

              /* test if lines intersect, if not, return false */
              if (maxA < minB || minA > maxB) {
                  return false
              } else {
                  let o = maxA > maxB ? maxB - minA : maxA - minB;
                  if (o < overlap) {
                      overlap = o;
                      smallest = {x: axis.x, y: axis.y};
                  }
              }
          }
          return {overlap: overlap + 0.001, axis: smallest}
      }

      static fromPoints(points) {
          let min = {x: Number.MAX_VALUE, y: Number.MAX_VALUE};
          let max = {x: Number.MIN_VALUE, y: Number.MIN_VALUE};
          for (let p of points) {
              min.x = Math.min(p.x, min.x);
              max.x = Math.max(p.x, max.x);
              min.y = Math.min(p.y, min.y);
              max.y = Math.max(p.y, max.y);
          }
          let center = Points.mean(min, max);
          let polygon = new Polygon(center);
          for (let p of points) {
              polygon.addAbsolutePoint(p);
          }
          return polygon
      }
  }

  class Events {

      static stop(event) {
          event.preventDefault();
          event.stopPropagation();
      }

      static extractPoint(event) {
          switch(event.constructor.name) {
              case 'TouchEvent':
                  for (let i=0; i<event.targetTouches.length; i++) {
                      let t = event.targetTouches[i];
                      return {x: t.clientX, y: t.clientY}
                  }
                  break
              default:
                  return {x: event.clientX, y: event.clientY}
          }
      }

      static isMouseDown(event) {
          // Attempts to clone the which attribute of events failed in WebKit. May
          // be this is a bug or a security feature. Workaround: we introduce
          // a mouseDownSubstitute attribute that can be assigned to cloned
          // events after instantiation.
          if (Reflect.has(event, 'mouseDownSubstitute'))
              return event.mouseDownSubstitute
          return event.buttons || event.which
      }

      static extractTouches(targets) {
          let touches = [];
          for (let i=0; i<targets.length; i++) {
              let t = targets[i];
              touches.push({
                  targetSelector: this.selector(t.target),
                  identifier: t.identifier,
                  screenX: t.screenX,
                  screenY: t.screenY,
                  clientX: t.clientX,
                  clientY: t.clientY,
                  pageX: t.pageX,
                  pageY: t.pageY
              });
          }
          return touches
      }

      static createTouchList(targets) {
          let touches = [];
          for (let i=0; i<targets.length; i++) {
              let t = targets[i];
              let touchTarget = document.elementFromPoint(t.pageX, t.pageY);
              let touch = new Touch(undefined, touchTarget, t.identifier,
                                      t.pageX, t.pageY, t.screenX, t.screenY);
              touches.push(touch);
          }
          return new TouchList(...touches)
      }

      static extractEvent(timestamp, event) {
          let targetSelector = this.selector(event.target);
          let infos = { type: event.type,
              time: timestamp,
              constructor: event.constructor,
              data: {
                  targetSelector: targetSelector,
                  view: event.view,
                  mouseDownSubstitute: event.buttons || event.which, // which cannot be cloned directly
                  bubbles: event.bubbles,
                  cancelable: event.cancelable,
                  screenX: event.screenX,
                  screenY: event.screenY,
                  clientX: event.clientX,
                  clientY: event.clientY,
                  layerX: event.layerX,
                  layerY: event.layerY,
                  pageX: event.pageX,
                  pageY: event.pageY,
                  ctrlKey: event.ctrlKey,
                  altKey: event.altKey,
                  shiftKey: event.shiftKey,
                  metaKey: event.metaKey}
          };
          if (event.type.startsWith('touch')) {
              // On Safari-WebKit the TouchEvent has layerX, layerY coordinates
              let data = infos.data;
              data.targetTouches = this.extractTouches(event.targetTouches);
              data.changedTouches = this.extractTouches(event.changedTouches);
              data.touches = this.extractTouches(event.touches);
          }
          if (Events.debug) {
              Events.extracted.push(this.toLine(event));
          }
          return infos
      }

      static cloneEvent(type, constructor, data) {
          if (type.startsWith('touch')) {
              // We need to find target from layerX, layerY
              //var target = document.querySelector(data.targetSelector)
              // elementFromPoint(data.layerX, data.layerY)
              //data.target = target
              data.targetTouches = this.createTouchList(data.targetTouches);
              data.changedTouches = this.createTouchList(data.changedTouches);
              data.touches = this.createTouchList(data.touches);
          }
          // We need to find target from pageX, pageY which are only
          // available after construction. They seem to getter items.

          let clone = Reflect.construct(constructor, [type, data]);
          clone.mouseDownSubstitute = data.mouseDownSubstitute;
          return clone
      }

      static simulateEvent(type, constructor, data) {
          data.target = document.querySelector(data.targetSelector);
          let clone = this.cloneEvent(type, constructor, data);
          if (data.target != null) {
              data.target.dispatchEvent(clone);
          }
          if (Events.debug) {
              Events.simulated.push(this.toLine(clone));
          }
      }

      static toLine(event) {
          return `${event.type} #${event.target.id} ${event.clientX} ${event.clientY}`
          let result = event.type;
          let selector = this.selector(event.target);
          result += ' selector: ' + selector;
          if (event.target != document.querySelector(selector))
              console.log('Cannot resolve', selector);
          let keys = ['layerX', 'layerY', 'pageX', 'pageY', 'clientX', 'clientY'];
          for(let key of keys) {
              try {
                  result += ' ' + key + ':' + event[key];
              }
              catch(e) {
                  console.log('Invalid key: ' + key);
              }
          }
          return result
      }

      static compareExtractedWithSimulated() {
          if (this.extracted.length != this.simulated.length) {
              alert('Unequal length of extracted [' + this.extracted.length +
                      '] and simulated events [' + this.simulated.length + '].');
          }
          else {
              for(let i=0; i<this.extracted.length; i++) {
                  var extracted = this.extracted[i];
                  var simulated = this.simulated[i];
                  if (extracted != simulated) {
                      console.log('Events differ:' + extracted + '|' + simulated);
                  }
              }
          }
      }

      static selector(context) {
          return OptimalSelect.select(context)
      }

      static reset() {
          this.extracted = [];
          this.simulated = [];
      }

      static resetSimulated() {
          this.simulated = [];
      }

      static showExtractedEvents(event) {
          if (!event.shiftKey) {
              return
          }
          if (this.popup == null) {
              let element = document.createElement('div');
              Elements.setStyle(element, { position: 'absolute',
                  width: '480px',
                  height: '640px',
                  overflow: 'auto',
                  backgroundColor: 'lightgray'});
              document.body.appendChild(element);
              this.popup = element;
          }
          this.popup.innerHTML = '';
          for(let line of this.extracted) {
              let div = document.createElement('div');
              div.innerHTML = line;
              this.popup.appendChild(div);
          }
          let div = document.createElement('div');
          div.innerHTML = '------------ Simulated -----------';
          this.popup.appendChild(div);
          for(let line of this.simulated) {
              let div = document.createElement('div');
              div.innerHTML = line;
              this.popup.appendChild(div);
          }
          Elements.setStyle(this.popup,
                  { left: event.clientX + 'px', top: event.clientY + 'px'} );
      }
  }

  Events.popup = null;

  Events.debug = true;
  Events.extracted = [];
  Events.simulated = [];

  // In order to test this interface implementation run jsc interface.js

  class Interface {
      // Abstract interface that should be extended in interface subclasses.
      // By convention all interfaces should start with an upper 'I'

      static implementationError(klass) {
          let interfaceKeys = Reflect.ownKeys(this.prototype);
          let classKeys = Reflect.ownKeys(klass.prototype);
          for(let key of interfaceKeys) {
              let interfaceDesc = this.prototype[key];
              let classDesc = klass.prototype[key];
              if (typeof(classDesc) == 'undefined')
                  return 'Missing ' + key
          }
          return null
      }

      static implementedBy(klass) {
          // In the first step only checks whether the methods of this
          // interface are all implemented by the given class
          let error = this.implementationError(klass);
          return error == null
      }

          // TODO: Specify optional methods
  //     static optionalMethods() {
  //         return [this.onMouseWheel]
  //     }
  }

  /** Interaction patterns

      See interaction.html for explanation
  */

  class IInteractionTarget extends Interface {
      capture(event) {
          return typeof true
      }

      onStart(event, interaction) {}
      onMove(event, interaction) {}
      onEnd(event, interaction) {}

      onMouseWheel(event) {}
  }

  class IInteractionMapperTarget extends Interface {
      capture(event) {
          return typeof true
      }

      findTarget(event, local, global) {
          return IInteractionTarget
      }
  }

  class PointMap extends MapProxy {
      // Collects touch points, mouse coordinates, etc. as key value pairs.
      // Keys are pointer and touch ids, the special "mouse" key.
      // Values are points, i.e. all objects with numeric x and y properties.
      constructor(points = {}) {
          super();
          for (let key in points) {
              this.set(key, points[key]);
          }
      }

      toString() {
          let points = [];
          for (let key of this.keys()) {
              let value = this.get(key);
              points.push(`${key}:{x:${value.x}, y:${value.y}}`);
          }
          let attrs = points.join(', ');
          return `[PointMap ${attrs}]`
      }

      clone() {
          let result = new PointMap();
          for (let key of this.keys()) {
              let value = this.get(key);
              result.set(key, {x: value.x, y: value.y});
          }
          return result
      }

      farthests() {
          if (this.size == 0) {
              return null
          }
          let pairs = [];
          for (let p of this.values()) {
              for (let q of this.values()) {
                  pairs.push([p, q]);
              }
          }
          let sorted = pairs.sort((a, b) => {
              return Points.distance(b[0], b[1]) - Points.distance(a[0], a[1])
          });
          return sorted[0]
      }

      mean() {
          if (this.size == 0) {
              return null
          }
          let x = 0.0,
              y = 0.0;
          for (let p of this.values()) {
              x += p.x;
              y += p.y;
          }
          return {x: x / this.size, y: y / this.size}
      }
  }

  class InteractionDelta {
      constructor(x, y, zoom, rotate, about) {
          this.x = x;
          this.y = y;
          this.zoom = zoom;
          this.rotate = rotate;
          this.about = about;
      }

      toString() {
          let values = [];
          for (let key of Object.keys(this)) {
              let value = this[key];
              if (key == 'about') {
                  values.push(`${key}:{x:${value.x}, y:${value.y}}`);
              } else {
                  values.push(`${key}:${value}`);
              }
          }
          let attrs = values.join(', ');
          return `[InteractionDelta ${attrs}]`
      }
  }

  class InteractionPoints {
      constructor(parent = null) {
          this.parent = parent;
          this.current = new PointMap();
          this.previous = new PointMap();
          this.start = new PointMap();
          this.ended = new PointMap();
          this.timestamps = new Map();
      }

      moved(key) {
          let current = this.current.get(key);
          let previous = this.previous.get(key);
          return Points.subtract(current, previous)
      }

      move() {
          let current = this.current.mean();
          let previous = this.previous.mean();
          return Points.subtract(current, previous)
      }

      delta() {
          var current = [];
          var previous = [];
          for (let key of this.current.keys()) {
              let c = this.current.get(key);
              if (this.previous.has(key)) {
                  let p = this.previous.get(key);
                  current.push(c);
                  previous.push(p);
              }
          }
          if (current.length >= 2) {
              if (current.length > 2) {
                  current = this.current.farthests();
                  previous = this.previous.farthests();
              }
              let c1 = current[0];
              let c2 = current[1];

              let p1 = previous[0];
              let p2 = previous[1];

              let cm = Points.mean(c1, c2);
              let pm = Points.mean(p1, p2);

              let delta = Points.subtract(cm, pm);
              let zoom = 1.0;
              let distance1 = Points.distance(p1, p2);
              let distance2 = Points.distance(c1, c2);
              if (distance1 != 0 && distance2 != 0) {
                  zoom = distance2 / distance1;
              }
              let angle1 = Points.angle(c2, c1);
              let angle2 = Points.angle(p2, p1);
              let alpha = Angle.diff(angle1, angle2);
              return new InteractionDelta(delta.x, delta.y, zoom, alpha, cm)
          } else if (current.length == 1) {
              let delta = Points.subtract(current[0], previous[0]);
              return new InteractionDelta(delta.x, delta.y, 1.0, 0.0, current[0])
          }
          return null
      }

      update(key, point) {
          // Returns true iff the key is new
          this.current.set(key, point);
          if (!this.start.has(key)) {
              this.start.set(key, point);
              this.previous.set(key, point);
              this.timestamps.set(key, performance.now());
              return true
          }
          return false
      }

      updatePrevious() {
          for (let key of this.current.keys()) {
              this.previous.set(key, this.current.get(key));
          }
      }

      stop(key, point) {
          if (this.current.has(key)) {
              this.current.delete(key);
              this.previous.delete(key);
              this.ended.set(key, point);
          }
      }

      finish(key, point) {
          this.current.delete(key);
          this.previous.delete(key);
          this.start.delete(key);
          this.timestamps.delete(key);
          this.ended.delete(key);
      }

      isFinished() {
          return this.current.size == 0
      }

      isNoLongerTwoFinger() {
          return this.previous.size > 1 && this.current.size < 2
      }

      isTap(key) {
          return this.parent.isTap(key)
      }

      isLongPress(key) {
          return this.parent.isLongPress(key)
      }
  }

  class Interaction extends InteractionPoints {
      constructor(tapDistance = 10, longPressTime = 500.0) {
          super();
          this.tapDistance = tapDistance;
          this.longPressTime = longPressTime;
          this.targets = new Map();
          this.subInteractions = new Map(); // target:Object : InteractionPoints
      }

      stop(key, point) {
          super.stop(key, point);
          for (let points of this.subInteractions.values()) {
              points.stop(key, point);
          }
      }

      addTarget(key, target) {
          this.targets.set(key, target);
          this.subInteractions.set(target, new InteractionPoints(this));
      }

      removeTarget(key) {
          let target = this.targets.get(key);
          this.targets.delete(key);
          // Only remove target if no keys are refering to the target
          let remove = true;
          for (let t of this.targets.values()) {
              if (target === t) {
                  remove = false;
              }
          }
          if (remove) {
              this.subInteractions.delete(target);
          }
      }

      finish(key, point) {
          super.finish(key, point);
          this.removeTarget(key);
      }

      mapInteraction(points, aspects, mappingFunc) {
          // Map centrally registered points to target interactions
          // Returns an array of [target, updated subInteraction] pairs
          let result = new Map();
          for (let key in points) {
              if (this.targets.has(key)) {
                  let target = this.targets.get(key);
                  if (this.subInteractions.has(target)) {
                      let interaction = this.subInteractions.get(target);
                      for (let aspect of aspects) {
                          let pointMap = this[aspect];
                          let point = pointMap.get(key);
                          let mapped = mappingFunc(point);
                          interaction[aspect].set(key, mapped);
                      }
                      result.set(target, interaction);
                  }
              }
          }
          return result
      }

      isTap(key) {
          let ended = this.ended.get(key);
          let start = this.start.get(key);
          if (
              start &&
              ended &&
              Points.distance(ended, start) < this.tapDistance
          ) {
              let t1 = this.timestamps.get(key);
              let tookLong = performance.now() > t1 + this.longPressTime;
              if (tookLong) {
                  return false
              }
              return true
          }
          return false
      }

      isAnyTap() {
          for (let key of this.ended.keys()) {
              if (this.isTap(key)) return true
          }
          return false
      }

      isLongPress(key) {
          let ended = this.ended.get(key);
          let start = this.start.get(key);
          if (
              start &&
              ended &&
              Points.distance(ended, start) < this.tapDistance
          ) {
              let t1 = this.timestamps.get(key);
              let tookLong = performance.now() > t1 + this.longPressTime;
              if (tookLong) {
                  return true
              }
              return false
          }
          return false
      }

      isAnyLongPress() {
          for (let key of this.ended.keys()) {
              if (this.isLongPress(key)) return true
          }
          return false
      }

      isStylus(key) {
          return key === 'stylus'
      }
  }

  class InteractionDelegate {
      // Long press: http://stackoverflow.com/questions/1930895/how-long-is-the-event-onlongpress-in-the-android
      // Stylus support: https://w3c.github.io/touch-events/

      constructor(
          element,
          target,
          {mouseWheelElement = null, debug = false} = {}
      ) {
          this.debug = debug;
          this.interaction = new Interaction();
          this.element = element;
          this.mouseWheelElement = mouseWheelElement || element;
          this.target = target;
          this.setupInteraction();
      }

      setupInteraction() {
          if (this.debug) {
              let error = this.targetInterface.implementationError(
                  this.target.constructor
              );
              if (error != null) {
                  throw new Error('Expected IInteractionTarget: ' + error)
              }
          }
          this.setupTouchInteraction();
          this.setupMouseWheelInteraction();
      }

      get targetInterface() {
          return IInteractionTarget
      }

      setupTouchInteraction() {
          let element = this.element;
          let useCapture = true;
          if (window.PointerEvent) {
              if (this.debug) console.log('Pointer API' + window.PointerEvent);
              element.addEventListener(
                  'pointerdown',
                  e => {
                      if (this.debug) console.log('pointerdown', e.pointerId);
                      if (this.capture(e)) {
                          element.setPointerCapture(e.pointerId);
                          this.onStart(e);
                      }
                  },
                  useCapture
              );
              element.addEventListener(
                  'pointermove',
                  e => {
                      if (this.debug) console.log('pointermove', e.pointerId);
                      if (
                          e.pointerType == 'touch' ||
                          (e.pointerType == 'mouse' && Events.isMouseDown(e))
                      ) {
                          // this.capture(e) &&
                          if (this.debug)
                              console.log('pointermove captured', e.pointerId);
                          this.onMove(e);
                      }
                  },
                  useCapture
              );
              element.addEventListener(
                  'pointerup',
                  e => {
                      if (this.debug) console.log('pointerup');
                      this.onEnd(e);
                      element.releasePointerCapture(e.pointerId);
                  },
                  useCapture
              );
              element.addEventListener(
                  'pointercancel',
                  e => {
                      if (this.debug) console.log('pointercancel');
                      this.onEnd(e);
                      element.releasePointerCapture(e.pointerId);
                  },
                  useCapture
              );
              element.addEventListener(
                  'pointerleave',
                  e => {
                      if (this.debug) console.log('pointerleave');
                      if (e.target == element) this.onEnd(e);
                  },
                  useCapture
              );
          } else if (window.TouchEvent) {
              if (this.debug) console.log('Touch API');
              element.addEventListener(
                  'touchstart',
                  e => {
                      if (this.debug)
                          console.log('touchstart', this.touchPoints(e));
                      if (this.capture(e)) {
                          for (let touch of e.changedTouches) {
                              this.onStart(touch);
                          }
                      }
                  },
                  useCapture
              );
              element.addEventListener(
                  'touchmove',
                  e => {
                      if (this.debug)
                          console.log('touchmove', this.touchPoints(e), e);
                      for (let touch of e.changedTouches) {
                          this.onMove(touch);
                      }
                      for (let touch of e.targetTouches) {
                          this.onMove(touch);
                      }
                  },
                  useCapture
              );
              element.addEventListener(
                  'touchend',
                  e => {
                      if (this.debug) console.log('touchend', this.touchPoints(e));
                      for (let touch of e.changedTouches) {
                          this.onEnd(touch);
                      }
                  },
                  useCapture
              );
              element.addEventListener(
                  'touchcancel',
                  e => {
                      if (this.debug)
                          console.log(
                              'touchcancel',
                              e.targetTouches.length,
                              e.changedTouches.length
                          );
                      for (let touch of e.changedTouches) {
                          this.onEnd(touch);
                      }
                  },
                  useCapture
              );
          } else {
              if (this.debug) console.log('Mouse API');

              element.addEventListener(
                  'mousedown',
                  e => {
                      if (this.debug) console.log('mousedown', e);
                      if (this.capture(e)) this.onStart(e);
                  },
                  useCapture
              );
              element.addEventListener(
                  'mousemove',
                  e => {
                      // Dow we only use move events if the mouse is down?
                      // HOver effects have to be implemented by other means
                      // && Events.isMouseDown(e))

                      if (Events.isMouseDown(e))
                          if (this.debug)
                              // this.capture(e) &&
                              console.log('mousemove', e);
                      this.onMove(e);
                  },
                  useCapture
              );
              element.addEventListener(
                  'mouseup',
                  e => {
                      if (this.debug) console.log('mouseup', e);
                      this.onEnd(e);
                  },
                  true
              );
              element.addEventListener(
                  'mouseout',
                  e => {
                      if (e.target == element) this.onEnd(e);
                  },
                  useCapture
              );
          }
      }

      touchPoints(event) {
          let result = [];
          for (let touch of event.changedTouches) {
              result.push(this.extractPoint(touch));
          }
          return result
      }

      setupMouseWheelInteraction() {
          this.mouseWheelElement.addEventListener(
              'mousewheel',
              this.onMouseWheel.bind(this),
              true
          );
          this.mouseWheelElement.addEventListener(
              'DOMMouseScroll',
              this.onMouseWheel.bind(this),
              true
          );
      }

      onMouseWheel(event) {
          if (this.capture(event) && this.target.onMouseWheel) {
              this.target.onMouseWheel(event);
          }
      }

      onStart(event) {
          let extracted = this.extractPoint(event);
          this.updateInteraction(event, extracted);
          this.target.onStart(event, this.interaction);
      }

      onMove(event) {
          let extracted = this.extractPoint(event, 'all');
          this.updateInteraction(event, extracted);
          this.target.onMove(event, this.interaction);
          this.interaction.updatePrevious();
      }

      onEnd(event) {
          let extracted = this.extractPoint(event, 'changedTouches');
          this.endInteraction(event, extracted);
          this.target.onEnd(event, this.interaction);
          this.finishInteraction(event, extracted);
      }

      capture(event) {
          let captured = this.target.capture(event);
          return captured
      }

      getPosition(event) {
          return {x: event.clientX, y: event.clientY}
      }

      extractPoint(event, touchEventKey = 'all') {
          // 'targetTouches'
          let result = {};
          switch (event.constructor.name) {
              case 'MouseEvent':
                  let buttons = event.buttons || event.which;
                  if (buttons) result['mouse'] = this.getPosition(event);
                  break
              case 'PointerEvent':
                  result[event.pointerId.toString()] = this.getPosition(event);
                  break
              case 'Touch':
                  let id =
                      event.touchType === 'stylus'
                          ? 'stylus'
                          : event.identifier.toString();
                  result[id] = this.getPosition(event);
                  break
              //             case 'TouchEvent':
              //                 // Needs to be observed: Perhaps changedTouches are all we need. If so
              //                 // we can remove the touchEventKey default parameter
              //                 if (touchEventKey == 'all') {
              //                     for(let t of event.targetTouches) {
              //                         result[t.identifier.toString()] = this.getPosition(t)
              //                     }
              //                     for(let t of event.changedTouches) {
              //                         result[t.identifier.toString()] = this.getPosition(t)
              //                     }
              //                 }
              //                 else {
              //                     for(let t of event.changedTouches) {
              //                         result[t.identifier.toString()] = this.getPosition(t)
              //                     }
              //                 }
              //                 break
              default:
                  break
          }
          return result
      }

      interactionStarted(event, key, point) {
          // Callback: can be overwritten
      }

      interactionEnded(event, key, point) {
          // Callback: can be overwritten
      }

      interactionFinished(event, key, point) {}

      updateInteraction(event, extracted) {
          for (let key in extracted) {
              let point = extracted[key];
              if (this.interaction.update(key, point)) {
                  this.interactionStarted(event, key, point);
              }
          }
      }

      endInteraction(event, ended) {
          for (let key in ended) {
              let point = ended[key];
              this.interaction.stop(key, point);
              this.interactionEnded(event, key, point);
          }
      }

      finishInteraction(event, ended) {
          for (let key in ended) {
              let point = ended[key];
              this.interaction.finish(key, point);
              this.interactionFinished(event, key, point);
          }
      }
  }

  class InteractionMapper extends InteractionDelegate {
      /* A special InteractionDelegate that maps events to specific parts of
      the interaction target. The InteractionTarget must implement a findTarget
      method that returns an object implementing the IInteractionTarget interface.

      If the InteractionTarget also implements a mapPositionToPoint method this
      is used to map the points to the local coordinate space of the the target.

      This makes it easier to lookup elements and relate events to local
      positions.
      */

      constructor(
          element,
          target,
          {tapDistance = 10, longPressTime = 500.0, mouseWheelElement = null} = {}
      ) {
          super(element, target, {tapDistance, longPressTime, mouseWheelElement});
      }

      get targetInterface() {
          return IInteractionMapperTarget
      }

      mapPositionToPoint(point) {
          if (this.target.mapPositionToPoint) {
              return this.target.mapPositionToPoint(point)
          }
          return point
      }

      interactionStarted(event, key, point) {
          if (this.target.findTarget) {
              let local = this.mapPositionToPoint(point);
              let found = this.target.findTarget(event, local, point);
              if (found != null) {
                  this.interaction.addTarget(key, found);
              }
          }
      }

      onMouseWheel(event) {
          if (this.capture(event)) {
              if (this.target.findTarget) {
                  let point = this.getPosition(event);
                  let local = this.mapPositionToPoint(point);
                  let found = this.target.findTarget(event, local, point);
                  if (found != null && found.onMouseWheel) {
                      found.onMouseWheel(event);
                      return
                  }
              }
              if (this.target.onMouseWheel) {
                  this.target.onMouseWheel(event);
              }
          }
      }

      onStart(event) {
          let extracted = this.extractPoint(event);
          this.updateInteraction(event, extracted);
          let mapped = this.interaction.mapInteraction(
              extracted,
              ['current', 'start'],
              this.mapPositionToPoint.bind(this)
          );
          for (let [target, interaction] of mapped.entries()) {
              target.onStart(event, interaction);
          }
      }

      onMove(event) {
          let extracted = this.extractPoint(event, 'all');

          this.updateInteraction(event, extracted);
          let mapped = this.interaction.mapInteraction(
              extracted,
              ['current', 'previous'],
              this.mapPositionToPoint.bind(this)
          );
          for (let [target, interaction] of mapped.entries()) {
              target.onMove(event, interaction);
              interaction.updatePrevious();
          }
          this.interaction.updatePrevious();
      }

      onEnd(event) {
          let extracted = this.extractPoint(event, 'changedTouches');
          this.endInteraction(event, extracted);
          let mapped = this.interaction.mapInteraction(
              extracted,
              ['ended'],
              this.mapPositionToPoint.bind(this)
          );
          for (let [target, interaction] of mapped.entries()) {
              target.onEnd(event, interaction);
          }
          this.finishInteraction(event, extracted);
      }
  }

  window.InteractionMapper = InteractionMapper;

  /** Report capabilities with guaranteed values.
   */
  class Capabilities {

      /** Returns the browser userAgent.
      @return {string}
      */
      static get userAgent() {
          return navigator.userAgent || 'Unknown Agent'
      }

      /** Tests whether the app is running on a mobile device.
      Implemented as a readonly attribute.
      @return {boolean}
      */
      static get isMobile() {
          return (/Mobi/.test(navigator.userAgent))
      }

      /** Tests whether the app is running on a iOS device.
      Implemented as a readonly attribute.
      @return {boolean}
      */
      static get isIOS() {
          return (/iPad|iPhone|iPod/.test(navigator.userAgent)) && !window.MSStream
      }

       /** Tests whether the app is running in a Safari environment.
      See https://stackoverflow.com/questions/7944460/detect-safari-browser
      Implemented as a readonly attribute.
      @return {boolean}
      */
      static get isSafari() {
          return navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
                 navigator.userAgent && !navigator.userAgent.match('CriOS')
      }


      /** Returns the display resolution. Necessary for retina displays.
      @return {number}
      */
      static get devicePixelRatio() {
          return window.devicePixelRatio || 1
      }

      /** Returns true if the device is a multi-touch table. This method is currently not universal usable and not sure!
      @return {boolean}
      */
      static get isMultiTouchTable() {
          return Capabilities.devicePixelRatio > 2 && Capabilities.isMobile === false && /Windows/i.test(Capabilities.userAgent)
      }

      /** Returns true if mouse events are supported
      @return {boolean}
      */
      static supportsMouseEvents() {
          return typeof(window.MouseEvent) != 'undefined'
      }

      /** Returns true if touch events are supported
      @return {boolean}
      */
      static supportsTouchEvents() {
          return typeof(window.TouchEvent) != 'undefined'
      }

      /** Returns true if pointer events are supported
      @return {boolean}
      */
      static supportsPointerEvents() {
          return typeof(window.PointerEvent) != 'undefined'
      }

      /** Returns true if DOM templates are supported
      @return {boolean}
      */
      static supportsTemplate() {
          return 'content' in document.createElement('template');
      }
  }

  /** Basic tests for Capabilities.
   */
  class CapabilitiesTests {

      static testConfirm() {
          let bool = confirm('Please confirm');
          document.getElementById('demo').innerHTML = (bool) ? 'Confirmed' : 'Not confirmed';
      }

      static testPrompt() {
          let person = prompt('Please enter your name', 'Harry Potter');
          if (person != null) {
              demo.innerHTML =
              'Hello ' + person + '! How are you today?';
          }
      }

      static testUserAgent() {
          let agent = 'User-agent: ' + Capabilities.userAgent;
          user_agent.innerHTML = agent;
      }

      static testDevicePixelRatio() {
          let value = 'Device Pixel Ratio: ' + Capabilities.devicePixelRatio;
          device_pixel_ratio.innerHTML = value;
      }

      static testMultiTouchTable() {
          let value = 'Is the device a multi-touch table? ' + Capabilities.isMultiTouchTable;
          multi_touch_table.innerHTML = value;
      }

      static testSupportedEvents() {
          let events = [];
          if (Capabilities.supportsMouseEvents()) {
              events.push('MouseEvents');
          }
          if (Capabilities.supportsTouchEvents()) {
              events.push('TouchEvents');
          }
          if (Capabilities.supportsPointerEvents()) {
              events.push('PointerEvents');
          }
          supported_events.innerHTML = 'Supported Events: ' + events.join(', ');
      }

      static testAll() {
          this.testUserAgent();
          this.testDevicePixelRatio();
          this.testMultiTouchTable();
          this.testSupportedEvents();
      }
  }

  /* Optional global variables, needed in DocTests. */
  window.Capabilities = Capabilities;
  window.CapabilitiesTests = CapabilitiesTests;

  /**
   * A base class for scatter specific events.
   *
   * @constructor
   * @param {name} String - The name of the event
   * @param {target} Object - The target of the event
   */
  class BaseEvent {
      constructor(name, target) {
          this.name = name;
          this.target = target;
      }
  }

  // Event types
  const START = 'onStart';
  const UPDATE = 'onUpdate';
  const END = 'onEnd';
  const ZOOM = 'onZoom';

  /**
   * A scatter event that describes how the scatter has changed.
   *
   * @constructor
   * @param {target} Object - The target scatter of the event
   * @param {optional} Object - Optional parameter
   */
  class ScatterEvent extends BaseEvent {
      constructor(
          target,
          {
              translate = {x: 0, y: 0},
              scale = null,
              rotate = 0,
              about = null,
              fast = false,
              type = null
          } = {}
      ) {
          super('scatterTransformed', {target: target});
          this.translate = translate;
          this.scale = scale;
          this.rotate = rotate;
          this.about = about;
          this.fast = fast;
          this.type = type;
      }

      toString() {
          return (
              "Event('scatterTransformed', scale: " +
              this.scale +
              ' about: ' +
              this.about.x +
              ', ' +
              this.about.y +
              ')'
          )
      }
  }

  /**
   * A scatter resize event that describes how the scatter has changed.
   *
   * @constructor
   * @param {target} Object - The target scatter of the event
   * @param {optional} Object - Optional parameter
   */
  class ResizeEvent extends BaseEvent {
      constructor(target, {width = 0, height = 0} = {}) {
          super('scatterResized', {width: width, height: height});
          this.width = width;
          this.height = height;
      }

      toString() {
          return (
              'Event(scatterResized width: ' +
              this.width +
              'height: ' +
              this.height +
              ')'
          )
      }
  }

  /**
   * A abstract base class that implements the throwable behavior of a scatter
   * object.
   *
   * @constructor
   */
  class Throwable {
      constructor({
          movableX = true,
          movableY = true,
          throwVisibility = 44,
          throwDamping = 0.95,
          autoThrow = true
      } = {}) {
          this.movableX = movableX;
          this.movableY = movableY;
          this.throwVisibility = throwVisibility;
          this.throwDamping = throwDamping;
          this.autoThrow = autoThrow;
          this.velocities = [];
          this.velocity = null;
          this.timestamp = null;
      }

      observeVelocity() {
          this.lastframe = performance.now();
      }

      addVelocity(delta, buffer = 5) {
          let t = performance.now();
          let dt = t - this.lastframe;
          this.lastframe = t;
          let velocity = {t: t, dt: dt, dx: delta.x, dy: delta.y};
          this.velocities.push(velocity);
          while (this.velocities.length > buffer) {
              this.velocities.shift();
          }
      }

      meanVelocity(milliseconds = 30) {
          this.addVelocity({x: 0, y: 0});
          let sum = {x: 0, y: 0};
          let count = 0;
          let t = 0;
          for (let i = this.velocities.length - 1; i > 0; i--) {
              let v = this.velocities[i];
              t += v.dt;
              let nv = {x: v.dx / v.dt, y: v.dy / v.dt};
              sum = Points.add(sum, nv);
              count += 1;
              if (t > milliseconds) {
                  break
              }
          }
          if (count === 0) return sum // empty vector
          return Points.multiplyScalar(sum, 1 / count)
      }

      killAnimation() {
          this.velocity = null;
          this.velocities = [];
      }

      startThrow() {
          this.velocity = this.meanVelocity();
          if (this.velocity != null) {
              // Call next velocity to ansure that specializations
              // that use keepOnStage are called
              this.velocity = this.nextVelocity(this.velocity);
              if (this.autoThrow) this.animateThrow(performance.now());
          } else {
              this.onDragComplete();
          }
      }

      animateThrow(time) {
          if (this.velocity != null) {
              let t = performance.now();
              let dt = t - this.lastframe;
              this.lastframe = t;
              // console.log("animateThrow", dt)
              let next = this.nextVelocity(this.velocity);
              let prevLength = Points.length(this.velocity);
              let nextLength = Points.length(next);
              if (nextLength > prevLength) {
                  let factor = nextLength / prevLength;
                  next = Points.multiplyScalar(next, 1 / factor);
                  console.log('Prevent acceleration', factor, this.velocity, next);
              }
              this.velocity = next;
              let d = Points.multiplyScalar(this.velocity, dt);
              this._move(d);
              this.onDragUpdate(d);
              if (dt == 0 || this.needsAnimation()) {
                  requestAnimationFrame(this.animateThrow.bind(this));
                  return
              } else {
                  if (this.isOutside()) {
                      requestAnimationFrame(this.animateThrow.bind(this));
                  }
              }
          }
          this.onDragComplete();
      }

      needsAnimation() {
          return Points.length(this.velocity) > 0.01
      }

      nextVelocity(velocity) {
          // Must be overwritten: computes the changed velocity. Implement
          // damping, collison detection, etc. here
          return Points.multiplyScalar(velocity, this.throwDamping)
      }

      _move(delta) {}

      onDragComplete() {}

      onDragUpdate(delta) {}
  }

  class AbstractScatter extends Throwable {
      constructor({
          minScale = 0.1,
          maxScale = 1.0,
          startScale = 1.0,
          autoBringToFront = true,
          autoThrow = true,
          translatable = true,
          scalable = true,
          rotatable = true,
          resizable = false,
          movableX = true,
          movableY = true,
          throwVisibility = 44,
          throwDamping = 0.95,
          overdoScaling = 1,
          mouseZoomFactor = 1.1,
          rotationDegrees = null,
          rotation = null,
          onTransform = null
      } = {}) {
          if (rotationDegrees != null && rotation != null) {
              throw new Error('Use rotationDegrees or rotation but not both')
          } else if (rotation != null) {
              rotationDegrees = Angle.radian2degree(rotation);
          } else if (rotationDegrees == null) {
              rotationDegrees = 0;
          }
          super({
              movableX,
              movableY,
              throwVisibility,
              throwDamping,
              autoThrow
          });
          this.startRotationDegrees = rotationDegrees;
          this.startScale = startScale; // Needed to reset object
          this.minScale = minScale;
          this.maxScale = maxScale;
          this.overdoScaling = overdoScaling;
          this.translatable = translatable;
          this.scalable = scalable;
          this.rotatable = rotatable;
          this.resizable = resizable;
          this.mouseZoomFactor = mouseZoomFactor;
          this.autoBringToFront = autoBringToFront;
          this.dragging = false;
          this.onTransform = onTransform != null ? [onTransform] : null;
      }

      addTransformEventCallback(callback) {
          if (this.onTransform == null) {
              this.onTransform = [];
          }
          this.onTransform.push(callback);
      }

      startGesture(interaction) {
          this.bringToFront();
          this.killAnimation();
          this.observeVelocity();
          return true
      }

      gesture(interaction) {
          let delta = interaction.delta();
          if (delta != null) {
              this.addVelocity(delta);
              this.transform(delta, delta.zoom, delta.rotate, delta.about);
              if (delta.zoom != 1) this.interactionAnchor = delta.about;
          }
      }

      get polygon() {
          let w2 = this.width * this.scale / 2;
          let h2 = this.height * this.scale / 2;
          let center = this.center;
          let polygon = new Polygon(center);
          polygon.addPoint({x: -w2, y: -h2});
          polygon.addPoint({x: w2, y: -h2});
          polygon.addPoint({x: w2, y: h2});
          polygon.addPoint({x: -w2, y: h2});
          polygon.rotate(this.rotation);
          return polygon
      }

      isOutside() {
          let stagePolygon = this.containerPolygon;
          let polygon = this.polygon;
          let result = stagePolygon.intersectsWith(polygon);
          return result === false || result.overlap < this.throwVisibility
      }

      recenter() {
          // Return a small vector that guarantees that the scatter is moving
          // towards the center of the stage
          let center = this.center;
          let target = this.container.center;
          let delta = Points.subtract(target, center);
          return Points.normalize(delta)
      }

      nextVelocity(velocity) {
          return this.keepOnStage(velocity)
      }

      bouncing() {
          // Implements the bouncing behavior of the scatter. Moves the scatter
          // to the center of the stage if the scatter is outside the stage or
          // not within the limits of the throwVisibility.

          let stagePolygon = this.containerPolygon;
          let polygon = this.polygon;
          let result = stagePolygon.intersectsWith(polygon);
          if (result === false || result.overlap < this.throwVisibility) {
              let cv = this.recenter();
              let recentered = false;
              while (result === false || result.overlap < this.throwVisibility) {
                  polygon.center.x += cv.x;
                  polygon.center.y += cv.y;
                  this._move(cv);
                  result = stagePolygon.intersectsWith(polygon);
                  recentered = true;
              }
              return recentered
          }
          return false
      }

      keepOnStage(velocity, collision = 0.5) {
          let stagePolygon = this.containerPolygon;
          if (!stagePolygon) return
          let polygon = this.polygon;
          let bounced = this.bouncing();
          if (bounced) {
              let stage = this.containerBounds;
              let x = this.center.x;
              let y = this.center.y;
              let dx = this.movableX ? velocity.x : 0;
              let dy = this.movableY ? velocity.y : 0;
              let factor = this.throwDamping;
              // if (recentered) {
              if (x < 0) {
                  dx = -dx;
                  factor = collision;
              }
              if (x > stage.width) {
                  dx = -dx;
                  factor = collision;
              }
              if (y < 0) {
                  dy = -dy;
                  factor = collision;
              }
              if (y > stage.height) {
                  dy = -dy;
                  factor = collision;
              }
              // }
              return Points.multiplyScalar({x: dx, y: dy}, factor)
          }
          return super.nextVelocity(velocity)
      }

      endGesture(interaction) {
          //this.startThrow()
      }

      rotateDegrees(degrees, anchor) {
          let rad = Angle.degree2radian(degrees);
          this.rotate(rad, anchor);
      }

      rotate(rad, anchor) {
          this.transform({x: 0, y: 0}, 1.0, rad, anchor);
      }

      move(d, {animate = 0} = {}) {
          if (this.translatable) {
              if (animate > 0) {
                  let startPos = this.position;
                  TweenLite.to(this, animate, {
                      x: '+=' + d.x,
                      y: '+=' + d.y,
                      /* scale: scale, uo: not defined, why was this here? */
                      onUpdate: e => {
                          let p = this.position;
                          let dx = p.x - startPos.x;
                          let dy = p.x - startPos.y;
                          this.onMoved(dx, dy);
                      }
                  });
              } else {
                  this._move(d);
                  this.onMoved(d.x, d.y);
              }
          }
      }

      moveTo(p, {animate = 0} = {}) {
          let c = this.origin;
          let delta = Points.subtract(p, c);
          this.move(delta, {animate: animate});
      }

      centerAt(p, {animate = 0} = {}) {
          let c = this.center;
          let delta = Points.subtract(p, c);
          this.move(delta, {animate: animate});
      }

      zoom(
          scale,
          {
              animate = 0,
              about = null,
              delay = 0,
              x = null,
              y = null,
              onComplete = null
          } = {}
      ) {
          let anchor = about || this.center;
          if (scale != this.scale) {
              if (animate > 0) {
                  TweenLite.to(this, animate, {
                      scale: scale,
                      delay: delay,
                      onComplete: onComplete,
                      onUpdate: this.onZoomed.bind(this)
                  });
              } else {
                  this.scale = scale;
                  this.onZoomed(anchor);
              }
          }
      }

      _move(delta) {
          this.x += this.movableX ? delta.x : 0;
          this.y += this.movableX ? delta.y : 0;
      }

      transform(translate, zoom, rotate, anchor) {
          let delta = {
              x: this.movableX ? translate.x : 0,
              y: this.movableY ? translate.y : 0
          };
          if (this.resizable) var vzoom = zoom;
          if (!this.translatable) delta = {x: 0, y: 0};
          if (!this.rotatable) rotate = 0;
          if (!this.scalable) zoom = 1.0;
          if (zoom == 1.0 && rotate == 0) {
              this._move(delta);
              if (this.onTransform != null) {
                  let event = new ScatterEvent(this, {
                      translate: delta,
                      scale: this.scale,
                      rotate: 0,
                      about: anchor,
                      fast: false,
                      type: UPDATE
                  });
                  this.onTransform.forEach(function(f) {
                      f(event);
                  });
              }
              return
          }
          let origin = this.rotationOrigin;
          let beta = Points.angle(origin, anchor);
          let distance = Points.distance(origin, anchor);
          let newScale = this.scale * zoom;

          let minScale = this.minScale / this.overdoScaling;
          let maxScale = this.maxScale * this.overdoScaling;
          if (newScale < minScale) {
              newScale = minScale;
              zoom = newScale / this.scale;
          }
          if (newScale > maxScale) {
              newScale = maxScale;
              zoom = newScale / this.scale;
          }

          let newOrigin = Points.arc(anchor, beta + rotate, distance * zoom);
          let extra = Points.subtract(newOrigin, origin);
          let offset = Points.subtract(anchor, origin);
          this._move(offset);
          this.scale = newScale;
          this.rotation += rotate;
          offset = Points.negate(offset);
          offset = Points.add(offset, extra);
          offset = Points.add(offset, translate);
          this._move(offset);

          if (this.onTransform != null) {
              let event = new ScatterEvent(this, {
                  translate: delta,
                  scale: newScale,
                  rotate: rotate,
                  about: anchor
              });
              this.onTransform.forEach(function(f) {
                  f(event);
              });
          }
          if (this.resizable) {
              this.resizeAfterTransform(vzoom);
          }
      }

      resizeAfterTransform(zoom) {
          // Overwrite this in subclasses.
      }

      validScale(scale) {
          scale = Math.max(scale, this.minScale);
          scale = Math.min(scale, this.maxScale);
          return scale
      }

      animateZoomBounce(dt = 1) {
          if (this.zoomAnchor != null) {
              let zoom = 1;
              let amount = Math.min(0.01, 0.3 * dt / 100000.0);
              if (this.scale < this.minScale) zoom = 1 + amount;
              if (this.scale > this.maxScale) zoom = 1 - amount;
              if (zoom != 1) {
                  this.transform({x: 0, y: 0}, zoom, 0, this.zoomAnchor);
                  requestAnimationFrame(dt => {
                      this.animateZoomBounce(dt);
                  });
                  return
              }
              this.zoomAnchor = null;
          }
      }

      checkScaling(about, delay = 0) {
          this.zoomAnchor = about;
          clearTimeout(this.animateZoomBounce.bind(this));
          setTimeout(this.animateZoomBounce.bind(this), delay);
      }

      onMouseWheel(event) {
          if (event.claimedByScatter) {
              if (event.claimedByScatter != this) return
          }
          this.killAnimation();
          this.targetScale = null;
          let direction = event.detail < 0 || event.wheelDelta > 0;
          let globalPoint = {x: event.clientX, y: event.clientY};
          let centerPoint = this.mapPositionToContainerPoint(globalPoint);
          if (event.shiftKey) {
              let degrees = direction ? 5 : -5;
              let rad = Angle.degree2radian(degrees);
              return this.transform({x: 0, y: 0}, 1.0, rad, centerPoint)
          }
          const zoomFactor = this.mouseZoomFactor;
          let zoom = direction ? zoomFactor : 1 / zoomFactor;
          this.transform({x: 0, y: 0}, zoom, 0, centerPoint);
          this.checkScaling(centerPoint, 200);

          if (this.onTransform != null) {
              let event = new ScatterEvent(this, {
                  translate: {x: 0, y: 0},
                  scale: this.scale,
                  rotate: 0,
                  about: null,
                  fast: false,
                  type: ZOOM
              });
              this.onTransform.forEach(function(f) {
                  f(event);
              });
          }
      }

      onStart(event, interaction) {
          if (this.startGesture(interaction)) {
              this.dragging = true;
              this.interactionAnchor = null;
          }
          if (this.onTransform != null) {
              let event = new ScatterEvent(this, {
                  translate: {x: 0, y: 0},
                  scale: this.scale,
                  rotate: 0,
                  about: null,
                  fast: false,
                  type: START
              });
              this.onTransform.forEach(function(f) {
                  f(event);
              });
          }
      }

      onMove(event, interaction) {
          if (this.dragging) {
              this.gesture(interaction);
          }
      }

      onEnd(event, interaction) {
          if (interaction.isFinished()) {
              this.endGesture(interaction);
              this.dragging = false;
              for (let key of interaction.ended.keys()) {
                  if (interaction.isTap(key)) {
                      let point = interaction.ended.get(key);
                      this.onTap(event, interaction, point);
                  }
              }
              if (this.onTransform != null) {
                  let event = new ScatterEvent(this, {
                      translate: {x: 0, y: 0},
                      scale: this.scale,
                      rotate: 0,
                      about: null,
                      fast: false,
                      type: END
                  });
                  this.onTransform.forEach(function(f) {
                      f(event);
                  });
              }
          }
          let about = this.interactionAnchor;
          if (about != null) {
              this.checkScaling(about, 100);
          }
      }

      onTap(event, interaction, point) {}

      onDragUpdate(delta) {
          if (this.onTransform != null) {
              let event = new ScatterEvent(this, {
                  fast: true,
                  translate: delta,
                  scale: this.scale,
                  about: this.currentAbout,
                  type: null
              });
              this.onTransform.forEach(function(f) {
                  f(event);
              });
          }
      }

      onDragComplete() {
          if (this.onTransform) {
              let event = new ScatterEvent(this, {
                  scale: this.scale,
                  about: this.currentAbout,
                  fast: false,
                  type: null
              });
              this.onTransform.forEach(function(f) {
                  f(event);
              });
          }
      }

      onMoved(dx, dy, about) {
          if (this.onTransform != null) {
              let event = new ScatterEvent(this, {
                  translate: {x: dx, y: dy},
                  about: about,
                  fast: true,
                  type: null
              });
              this.onTransform.forEach(function(f) {
                  f(event);
              });
          }
      }

      onZoomed(about) {
          if (this.onTransform != null) {
              let event = new ScatterEvent(this, {
                  scale: this.scale,
                  about: about,
                  fast: false,
                  type: null
              });
              this.onTransform.forEach(function(f) {
                  f(event);
              });
          }
      }
  }

  /** A container for scatter objects, which uses a single InteractionMapper
   * for all children. This reduces the number of registered event handlers
   * and covers the common use case that multiple objects are scattered
   * on the same level.
   */
  class DOMScatterContainer {
      /**
       * @constructor
       * @param {DOM node} element - DOM element that receives events
       * @param {Bool} stopEvents -  Whether events should be stopped or propagated
       * @param {Bool} claimEvents - Whether events should be marked as claimed
       *                             if findTarget return as non-null value.
       * @param {Bool} touchAction - CSS to set touch action style, needed to prevent
       *                              pointer cancel events. Use null if the
       *                              the touch action should not be set.
       */
      constructor(
          element,
          {stopEvents = 'auto', claimEvents = true, touchAction = 'none'} = {}
      ) {
          this.element = element;
          if (stopEvents === 'auto') {
              if (Capabilities.isSafari) {
                  document.addEventListener(
                      'touchmove',
                      event => this.preventPinch(event),
                      false
                  );
                  stopEvents = false;
              } else {
                  stopEvents = true;
              }
          }
          this.stopEvents = stopEvents;
          this.claimEvents = claimEvents;
          if (touchAction !== null) {
              Elements$1.setStyle(element, {touchAction});
          }
          this.scatter = new Map();
          this.delegate = new InteractionMapper(element, this, {
              mouseWheelElement: window
          });

          if (typeof debugCanvas !== 'undefined') {
              requestAnimationFrame(dt => {
                  this.showTouches(dt);
              });
          }
      }

      showTouches(dt) {
          let resolution = window.devicePixelRatio;
          let canvas = debugCanvas;
          let current = this.delegate.interaction.current;
          let context = canvas.getContext('2d');
          let radius = 20 * resolution;
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = 'rgba(0, 0, 0, 0.3)';
          context.lineWidth = 2;
          context.strokeStyle = '#003300';
          for (let [key, point] of current.entries()) {
              let local = point;
              context.beginPath();
              context.arc(
                  local.x * resolution,
                  local.y * resolution,
                  radius,
                  0,
                  2 * Math.PI,
                  false
              );
              context.fill();
              context.stroke();
          }
          requestAnimationFrame(dt => {
              this.showTouches(dt);
          });
      }

      preventPinch(event) {
          event = event.originalEvent || event;
          if (event.scale !== 1) {
              event.preventDefault();
          }
      }

      add(scatter) {
          this.scatter.set(scatter.element, scatter);
      }

      capture(event) {
          if (event.target == this.element && this.stopEvents) Events.stop(event);
          return true
      }

      mapPositionToPoint(point) {
          return Points.fromPageToNode(this.element, point)
      }

      isDescendant(parent, child, clickable = false) {
          if (parent == child) return true
          let node = child.parentNode;
          while (node != null) {
              if (!clickable && node.onclick) {
                  return false
              }
              if (node == parent) {
                  return true
              }
              node = node.parentNode;
          }
          return false
      }

      findTarget(event, local, global) {
          /*** Note that elementFromPoint works with clientX, clientY, not pageX, pageY
          The important point is that event should not be used, since the TouchEvent
          points are hidden in sub objects.
          ***/
          let found = document.elementFromPoint(global.x, global.y);
          for (let target of this.scatter.values()) {
              if (this.isDescendant(target.element, found)) {
                  if (this.stopEvents) Events.stop(event);
                  if (this.claimEvents) event.claimedByScatter = target;
                  return target
              }
          }
          return null
      }

      get center() {
          let r = this.bounds;
          let w2 = r.width / 2;
          let h2 = r.height / 2;
          return {x: w2, y: h2}
      }

      get bounds() {
          return this.element.getBoundingClientRect()
      }

      get polygon() {
          let r = this.bounds;
          let w2 = r.width / 2;
          let h2 = r.height / 2;
          let center = {x: w2, y: h2};
          let polygon = new Polygon(center);
          polygon.addPoint({x: -w2, y: -h2});
          polygon.addPoint({x: w2, y: -h2});
          polygon.addPoint({x: w2, y: h2});
          polygon.addPoint({x: -w2, y: h2});
          return polygon
      }
  }

  let zIndex = 1000;

  class DOMScatter extends AbstractScatter {
      constructor(
          element,
          container,
          {
              startScale = 1.0,
              minScale = 0.1,
              maxScale = 1.0,
              overdoScaling = 1.5,
              autoBringToFront = true,
              translatable = true,
              scalable = true,
              rotatable = true,
              movableX = true,
              movableY = true,
              rotationDegrees = null,
              rotation = null,
              onTransform = null,
              transformOrigin = 'center center',
              // extras which are in part needed
              x = 0,
              y = 0,
              width = null,
              height = null,
              resizable = false,
              simulateClick = false,
              verbose = true,
              onResize = null,
              touchAction = 'none',
              throwVisibility = 44,
              throwDamping = 0.95,
              autoThrow = true
          } = {}
      ) {
          super({
              minScale,
              maxScale,
              startScale,
              overdoScaling,
              autoBringToFront,
              translatable,
              scalable,
              rotatable,
              movableX,
              movableY,
              resizable,
              rotationDegrees,
              rotation,
              onTransform,
              throwVisibility,
              throwDamping,
              autoThrow
          });
          if (container == null || width == null || height == null) {
              throw new Error('Invalid value: null')
          }
          this.element = element;
          this.x = x;
          this.y = y;
          this.meanX = x;
          this.meanY = y;
          this.width = width;
          this.height = height;
          this.throwVisibility = Math.min(width, height, throwVisibility);
          this.container = container;
          this.simulateClick = simulateClick;
          this.scale = startScale;
          this.rotationDegrees = this.startRotationDegrees;
          this.transformOrigin = transformOrigin;
          this.initialValues = {
              x: x,
              y: y,
              width: width,
              height: height,
              scale: startScale,
              rotation: this.startRotationDegrees,
              transformOrigin: transformOrigin
          };
          // For tweenlite we need initial values in _gsTransform
          TweenLite.set(element, this.initialValues);
          this.onResize = onResize;
          this.verbose = verbose;
          if (touchAction !== null) {
              Elements$1.setStyle(element, {touchAction});
          }
          container.add(this);
      }

      /** Returns geometry data as object. **/
      getState() {
          return {
              scale: this.scale,
              x: this.x,
              y: this.y,
              rotation: this.rotation
          }
      }

      get rotationOrigin() {
          return this.center
      }

      get x() {
          return this._x
      }

      get y() {
          return this._y
      }

      set x(value) {
          this._x = value;
          TweenLite.set(this.element, {x: value});
      }

      set y(value) {
          this._y = value;
          TweenLite.set(this.element, {y: value});
      }

      get position() {
          let transform = this.element._gsTransform;
          let x = transform.x;
          let y = transform.y;
          return {x, y}
      }

      get origin() {
          let p = this.fromNodeToPage(0, 0);
          return Points.fromPageToNode(this.container.element, p)
      }

      get bounds() {
          let stage = this.container.element.getBoundingClientRect();
          let rect = this.element.getBoundingClientRect();
          return {
              top: rect.top - stage.top,
              left: rect.left - stage.left,
              width: rect.width,
              height: rect.height
          }
      }

      get center() {
          let r = this.bounds;
          let w2 = r.width / 2;
          let h2 = r.height / 2;
          if (this.resizable) {
              w2 *= this.scale;
              h2 *= this.scale;
          }
          var x = r.left + w2;
          var y = r.top + h2;
          return {x, y}
      }

      set rotation(radians) {
          let rad = radians; // Angle.normalize(radians)
          let degrees = Angle.radian2degree(rad);
          TweenLite.set(this.element, {rotation: degrees});
          this._rotation = rad;
      }

      set rotationDegrees(degrees) {
          let deg = degrees; // Angle.normalizeDegree(degrees)
          TweenLite.set(this.element, {rotation: deg});
          this._rotation = Angle.degree2radian(deg);
      }

      get rotation() {
          return this._rotation
      }

      get rotationDegrees() {
          return this._rotation
      }

      set scale(scale) {
          TweenLite.set(this.element, {
              scale: scale,
              transformOrigin: this.transformOrigin
          });
          this._scale = scale;
      }

      get scale() {
          return this._scale
      }

      get containerBounds() {
          return this.container.bounds
      }

      get containerPolygon() {
          return this.container.polygon
      }

      mapPositionToContainerPoint(point) {
          return this.container.mapPositionToPoint(point)
      }

      capture(event) {
          return true
      }

      reset() {
          TweenLite.set(this.element, this.initialValues);
      }

      hide() {
          TweenLite.to(this.element, 0.1, {
              display: 'none',
              onComplete: e => {
                  this.element.parentNode.removeChild(this.element);
              }
          });
      }

      show() {
          TweenLite.set(this.element, {display: 'block'});
      }

      showAt(p, rotationDegrees) {
          TweenLite.set(this.element, {
              display: 'block',
              x: p.x,
              y: p.y,
              rotation: rotationDegrees,
              transformOrigin: this.transformOrigin
          });
      }

      bringToFront() {
          // this.element.parentNode.appendChild(this.element)
          // uo: On Chome and Electon appendChild leads to flicker
          TweenLite.set(this.element, {zIndex: zIndex++});
      }

      toggleVideo(element) {
          if (element.paused) {
              element.play();
          } else {
              element.pause();
          }
      }

      onTap(event, interaction, point) {
          if (this.simulateClick) {
              let p = Points.fromPageToNode(this.element, point);
              let iframe = this.element.querySelector('iframe');
              if (iframe) {
                  let doc = iframe.contentWindow.document;
                  let element = doc.elementFromPoint(p.x, p.y);
                  if (element == null) {
                      return
                  }
                  switch (element.tagName) {
                      case 'VIDEO':
                          console.log(element.currentSrc);
                          if (PopupMenu) {
                              PopupMenu.open(
                                  {
                                      Fullscreen: () =>
                                          window.open(element.currentSrc),
                                      Play: () => element.play()
                                  },
                                  {x, y}
                              );
                          } else {
                              this.toggleVideo(element);
                          }
                          break
                      default:
                          element.click();
                  }
              }
          }
      }

      isDescendant(parent, child) {
          let node = child.parentNode;
          while (node != null) {
              if (node == parent) {
                  return true
              }
              node = node.parentNode;
          }
          return false
      }

      fromPageToNode(x, y) {
          return Points.fromPageToNode(this.element, {x, y})
      }

      fromNodeToPage(x, y) {
          return Points.fromNodeToPage(this.element, {x, y})
      }

      _move(delta) {
          // UO: We need to keep TweenLite's _gsTransform and the private
          // _x and _y attributes aligned
          let x = this.element._gsTransform.x;
          let y = this.element._gsTransform.y;
          if (this.movableX) {
              x += delta.x;
          }
          if (this.movableY) {
              y += delta.y;
          }
          this._x = x;
          this._y = y;
          TweenLite.set(this.element, {x: x, y: y});
      }

      resizeAfterTransform(zoom) {
          let w = this.width * this.scale;
          let h = this.height * this.scale;
          TweenLite.set(this.element, {width: w, height: h});
          if (this.onResize) {
              let event = new ResizeEvent(this, {width: w, height: h});
              this.onResize(event);
          }
      }
  }

  class CardLoader {
      constructor(
          src,
          {
              x = 0,
              y = 0,
              width = 1000,
              height = 800,
              maxWidth = null,
              maxHeight = null,
              scale = 1,
              minScale = 0.5,
              maxScale = 1.5,
              rotation = 0
          } = {}
      ) {
          this.src = src;
          this.x = x;
          this.y = y;
          this.scale = scale;
          this.rotation = 0;
          this.maxScale = maxScale;
          this.minScale = minScale;
          this.wantedWidth = width;
          this.wantedHeight = height;
          this.maxWidth = maxWidth != null ? maxWidth : window.innerWidth;
          this.maxHeight = maxHeight != null ? maxHeight : window.innerHeight;
          this.addedNode = null;
      }

      unload() {
          if (this.addedNode) {
              this.addedNode.remove();
              this.addedNode = null;
          }
      }
  }

  class ImageLoader extends CardLoader {
      load(domNode) {
          return new Promise((resolve, reject) => {
              let isImage = domNode instanceof HTMLImageElement;
              let image = isImage ? domNode : document.createElement('img');
              image.onload = e => {
                  if (!isImage) {
                      domNode.appendChild(image);
                      this.addedNode = image;
                  }
                  this.wantedWidth = image.naturalWidth;
                  this.wantedHeight = image.naturalHeight;

                  let scaleW = this.maxWidth / image.naturalWidth;
                  let scaleH = this.maxHeight / image.naturalHeight;
                  this.scale = Math.min(this.maxScale, Math.min(scaleW, scaleH));
                  image.setAttribute('draggable', false);
                  image.width = image.naturalWidth;
                  image.height = image.naturalHeight;
                  resolve(this);
              };
              image.onerror = e => {
                  reject(this);
              };
              image.src = this.src;
          })
      }
  }

  class DOMFlip {
      constructor(
          domScatterContainer,
          flipTemplate,
          frontLoader,
          backLoader,
          {
              autoLoad = false,
              center = null,
              preloadBack = false,
              translatable = true,
              scalable = true,
              rotatable = true,
              onFront = null,
              onBack = null,
              onClose = null,
              onUpdate = null,
              onRemoved = null
          } = {}
      ) {
          this.domScatterContainer = domScatterContainer;
          this.id = getId();
          this.flipTemplate = flipTemplate;
          this.frontLoader = frontLoader;
          this.backLoader = backLoader;
          this.translatable = translatable;
          this.scalable = scalable;
          this.rotatable = rotatable;
          this.onFrontFlipped = onFront;
          this.onBackFlipped = onBack;
          this.onClose = onClose;
          this.onRemoved = onRemoved;
          this.onUpdate = onUpdate;
          this.center = center;
          this.preloadBack = preloadBack;
          if (autoLoad) {
              this.load();
          }
      }

      load() {
          return new Promise((resolve, reject) => {
              let t = this.flipTemplate;
              let dom = this.domScatterContainer.element;
              let wrapper = t.content.querySelector('.flipWrapper');
              wrapper.id = this.id;
              let clone = document.importNode(t.content, true);
              dom.appendChild(clone);
              // We cannot use the document fragment itself because it
              // is not part of the main dom tree. After the appendChild
              // call we can access the new dom element by id
              this.cardWrapper = dom.querySelector('#' + this.id);
              let front = this.cardWrapper.querySelector('.front');
              this.frontLoader.load(front).then(loader => {
                  this.frontLoaded(loader).then(resolve);
              });
          })
      }

      frontLoaded(loader) {
          return new Promise((resolve, reject) => {
              let scatter = new DOMScatter(
                  this.cardWrapper,
                  this.domScatterContainer,
                  {
                      x: loader.x,
                      y: loader.y,
                      startScale: loader.scale,
                      scale: loader.scale,
                      maxScale: loader.maxScale,
                      minScale: loader.minScale,
                      width: loader.wantedWidth,
                      height: loader.wantedHeight,
                      rotation: loader.rotation,
                      translatable: this.translatable,
                      scalable: this.scalable,
                      rotatable: this.rotatable
                  }
              );
              if (this.center) {
                  scatter.centerAt(this.center);
              }

              let flippable = new DOMFlippable(this.cardWrapper, scatter, this);
              let back = this.cardWrapper.querySelector('.back');

              if (this.preloadBack) {
                  this.backLoader.load(back).then(loader => {
                      this.setupFlippable(flippable, loader);
                  });
              }
              this.flippable = flippable;
              resolve(this);
          })
      }

      centerAt(p) {
          this.center = p;
          this.flippable.centerAt(p);
      }

      zoom(scale) {
          this.flippable.zoom(scale);
      }

      setupFlippable(flippable, loader) {
          flippable.wantedWidth = loader.wantedWidth;
          flippable.wantedHeight = loader.wantedHeight;
          flippable.wantedScale = loader.scale;
          flippable.minScale = loader.minScale;
          flippable.maxScale = loader.maxScale;
          flippable.scaleButtons();
      }

      start({duration = 1.0, targetCenter = null} = {}) {
          console.log('DOMFlip.start', targetCenter);
          if (this.preloadBack) this.flippable.start({duration, targetCenter});
          else {
              let back = this.cardWrapper.querySelector('.back');
              let flippable = this.flippable;
              this.backLoader.load(back).then(loader => {
                  this.setupFlippable(flippable, loader);
                  flippable.start({duration, targetCenter});
              });
          }
      }

      fadeOutAndRemove() {
          TweenLite.to(this.cardWrapper, 0.2, {
              opacity: 0,
              onComplete: () => {
                  this.cardWrapper.remove();
              }
          });
      }

      closed() {
          if (!this.preloadBack) {
              this.backLoader.unload();
          }
      }
  }

  class DOMFlippable {
      constructor(element, scatter, flip) {
          // Set log to console.log or a custom log function
          // define data structures to store our touchpoints in

          this.element = element;
          this.flip = flip;
          this.card = element.querySelector('.flipCard');
          this.front = element.querySelector('.front');
          this.back = element.querySelector('.back');
          this.flipped = false;
          this.scatter = scatter;
          this.onFrontFlipped = flip.onFrontFlipped;
          this.onBackFlipped = flip.onBackFlipped;
          this.onClose = flip.onClose;
          this.onRemoved = flip.onRemoved;
          this.onUpdate = flip.onUpdate;
          scatter.addTransformEventCallback(this.scatterTransformed.bind(this));
          console.log('lib.DOMFlippable', 5000);
          TweenLite.set(this.element, {perspective: 5000});
          TweenLite.set(this.card, {transformStyle: 'preserve-3d'});
          TweenLite.set(this.back, {rotationY: -180});
          TweenLite.set([this.back, this.front], {backfaceVisibility: 'hidden', perspective: 5000});
          TweenLite.set(this.front, {visibility: 'visible'});
          this.infoBtn = element.querySelector('.infoBtn');
          this.backBtn = element.querySelector('.backBtn');
          this.closeBtn = element.querySelector('.closeBtn');
          /* Buttons are not guaranteed to exist. */
          if (this.infoBtn) {
              this.infoBtn.onclick = () => {
                  this.flip.start();
              };
              this.show(this.infoBtn);
          }
          if (this.backBtn) {
              this.backBtn.onclick = () => {
                  this.start();
              };
          }
          if (this.closeBtn) {
              this.closeBtn.onclick = () => {
                  this.close();
              };
              this.show(this.closeBtn);
          }
          this.scaleButtons();
          this.bringToFront();
      }

      close() {
          this.hide(this.infoBtn);
          this.hide(this.closeBtn);
          if (this.onClose) {
              this.onClose(this);
              this.flip.closed();
          } else {
              this.scatter.zoom(0.1, {
                  animate: 0.5,
                  onComplete: () => {
                      this.element.remove();
                      this.flip.closed();
                      if (this.onRemoved) {
                          this.onRemoved.call(this);
                      }
                  }
              });
          }
      }

      showFront() {
          TweenLite.set(this.front, {visibility: 'visible'});
      }

      centerAt(p) {
          this.scatter.centerAt(p);
      }

      zoom(scale) {
          this.scatter.zoom(scale);
      }

      get buttonScale() {
          let iscale = 1.0;
          if (this.scatter != null) {
              iscale = 1.0 / this.scatter.scale;
          }
          return iscale
      }

      scaleButtons() {
          TweenLite.set([this.infoBtn, this.backBtn, this.closeBtn], {
              scale: this.buttonScale
          });
      }

      bringToFront() {
          this.scatter.bringToFront();
          TweenLite.set(this.element, {zIndex: DOMFlippable.zIndex++});
      }

      clickInfo() {
          this.bringToFront();
          this.infoBtn.click();
      }

      scatterTransformed(event) {
          this.scaleButtons();
      }

      targetRotation(alpha) {
          let ortho = 90;
          let rest = alpha % ortho;
          let delta = 0.0;
          if (rest > ortho / 2.0) {
              delta = ortho - rest;
          } else {
              delta = -rest;
          }
          return delta
      }

      infoValues(info) {
          let startX = this.element._gsTransform.x;
          let startY = this.element._gsTransform.y;
          let startAngle = this.element._gsTransform.rotation;
          let startScale = this.element._gsTransform.scaleX;
          let w = this.element.style.width;
          let h = this.element.style.height;
          console.log(info, startX, startY, startAngle, startScale, w, h);
      }

      show(element) {
          if (element) {
              TweenLite.set(element, {visibility: 'visible', display: 'initial'});
          }
      }

      hide(element) {
          if (element) {
              TweenLite.set(element, {visibility: 'hidden', display: 'none'});
          }
      }

      start({duration = 1.0, targetCenter = null} = {}) {
          this.bringToFront();
          if (!this.flipped) {
              this.startX = this.element._gsTransform.x;
              this.startY = this.element._gsTransform.y;
              this.startAngle = this.element._gsTransform.rotation;
              this.startScale = this.element._gsTransform.scaleX;
              this.startWidth = this.element.style.width;
              this.startHeight = this.element.style.height;
              this.scatterStartWidth = this.scatter.width;
              this.scatterStartHeight = this.scatter.height;
              this.show(this.back);
              this.hide(this.infoBtn);
              this.hide(this.closeBtn);
          } else {
              this.show(this.front);
              this.hide(this.backBtn);
          }
          let {scalable, translatable, rotatable} = this.scatter;
          this.saved = {scalable, translatable, rotatable};
          this.scatter.scalable = false;
          this.scatter.translatable = false;
          this.scatter.rotatable = false;

          this.flipped = !this.flipped;
          let targetY = this.flipped ? 180 : 0;
          let targetZ = this.flipped
              ? this.startAngle + this.targetRotation(this.startAngle)
              : this.startAngle;
          let targetScale = this.flipped ? this.wantedScale : this.startScale;
          let w = this.flipped ? this.wantedWidth : this.startWidth;
          let h = this.flipped ? this.wantedHeight : this.startHeight;
          let dw = this.wantedWidth - this.scatter.width;
          let dh = this.wantedHeight - this.scatter.height;

          let xx =
              targetCenter != null ? targetCenter.x - w / 2 : this.startX - dw / 2;
          let yy =
              targetCenter != null ? targetCenter.y - h / 2 : this.startY - dh / 2;
          let x = this.flipped ? xx : this.startX;
          let y = this.flipped ? yy : this.startY;

          //console.log("DOMFlippable.start", this.flipped, targetCenter, x, y, this.saved)
          // targetZ = Angle.normalizeDegree(targetZ)
          let onUpdate = this.onUpdate !== null ? () => this.onUpdate(this) : null;
          TweenLite.to(this.card, duration, {
              rotationY: targetY + 0.1,
              transformOrigin: '50% 50%',
              onUpdate,
              onComplete: e => {
                  if (this.flipped) {
                      //this.hide(this.front)
                      this.show(this.backBtn);
                      if (this.onFrontFlipped) {
                          this.onFrontFlipped(this);
                      }
                  } else {
                      //this.hide(this.back)
                      if (this.onBackFlipped == null) {
                          this.show(this.infoBtn);
                          this.show(this.closeBtn);
                      } else {
                          this.onBackFlipped(this);
                      }
                      this.flip.closed();
                  }
                  this.scatter.scale = targetScale;
                  this.scaleButtons();
                  this.scatter.rotationDegrees = targetZ;
                  this.scatter.width = this.flipped ? w : this.scatterStartWidth;
                  this.scatter.height = this.flipped ? h : this.scatterStartHeight;

                  let {scalable, translatable, rotatable} = this.saved;
                  this.scatter.scalable = scalable;
                  this.scatter.translatable = translatable;
                  this.scatter.rotatable = rotatable;

                  this.bringToFront();
              },
              force3D: true
          });

          TweenLite.to(this.element, duration / 2, {
              scale: targetScale,
              rotationZ: targetZ  + 0.1,
              transformOrigin: '50% 50%',
              width: w,
              height: h,
              x: x,
              y: y,
              onComplete: e => {
                  if (this.flipped) {
                      this.hide(this.front);
                  } else {
                      this.hide(this.back);
                  }
              }
          });
      }
  }

  DOMFlippable.zIndex = 0;

  /** A Popup that shows text labels, images, or html
   */
  class Popup {
      /**
      * The constructor.
      * @constructor
      * @param {DOM Element} parent - The DOM parent element.
      * @param {Object} content - A dict object with type strings (text, img, html) as keys
      *                            and corresponding values.
      * @param {string} fontSize - Describes the font size as CSS value
      * @param {string} fontFamily - Describes the font family as CSS value
      * @param {number || string} padding - Describes the padding as CSS value
      * @param {number || string} notchSize - Describes the size of the notch (callout) as CSS value
      * @param {string} backgroundColor  - The color of the background as CSS value
      * @param {string} normalColor  - The color of textitems as CSS value
      * @param {boolean} autoClose  - Autoclose the Popup on tap
      */
      constructor({parent = null,
                      content = null,
                      fontSize='1em',
                      fontFamily='Arial',
                      padding=16,
                      notchSize=10,
                      switchPos=false,
                      maxWidth=800,
                      backgroundColor='#EEE',
                      normalColor='#444',
                      notchPosition='bottomLeft',
                      autoClose=true} = {}) {
          this.padding = padding;
          this.notchPosition = notchPosition;
          this.notchSize = notchSize;
          this.switchPos = switchPos;
          this.fontSize = fontSize;
          this.fontFamily = fontFamily;
          this.maxWidth = maxWidth;
          this.normalColor = normalColor;
          this.backgroundColor = backgroundColor;
          this.autoClose = autoClose;
          this.parent = parent || document.body;
          if (content) {
              this.show(content);
          }
      }

      /** Setup menu with a dictionary of content types and contents.
       * @param {Object} content - A dict object with type strings (text, img, html) as keys
      *                            and corresponding values.
       * @return {Popup} this
       */
      setup(content) {
          this.content = content;
          this.items = {};
          this.element = document.createElement('div');
          Elements$1.addClass(this.element, 'unselectable');
          this.notch = document.createElement('div');
          Elements$1.setStyle(this.notch, this.notchStyle());
          for(let key in content) {
              switch(key) {
                  case 'text':
                      let text = document.createElement('span');
                      this.element.appendChild(text);
                      text.innerHTML = content[key];
                      Elements$1.setStyle(text, {color: this.normalColor});
                      Elements$1.addClass(text, 'unselectable');
                      Elements$1.addClass(text, 'PopupContent');
                      break
                  case 'img':
                      alert("img to be implemented");
                      break
                  case 'html':
                      let div = document.createElement('div');
                      this.element.appendChild(div);
                      div.innerHTML = content[key];
                      Elements$1.addClass(div, 'PopupContent');
                      break
                  default:
                      alert("Unexpected content type: " + key);
                      break
              }
          }
          this.element.appendChild(this.notch);
          this.parent.appendChild(this.element);
          Elements$1.setStyle(this.element, this.defaultStyle());
          console.log("Popup.setup", this.defaultStyle());
          this.layout();
          return this
      }

      /** Layout the menu items
       */
      layout() {

      }

      /** Close and remove the Popup from the DOM tree.
      */
      close() {
          this.parent.removeChild(this.element);
          if (Popup.openPopup == this) {
              Popup.openPopup = null;
          }
      }

      /** Shows the Popup with the given commands at the specified point.
       * @param {Object} content - A dict object with type strings (text, img, html) as keys
       *                            and corresponding values.
       * @param {Point} point - The position as x, y coordinates {px}.
       * @return {Popup} this
      */
      showAt(content, point) {
          this.show(content);
          this.placeAt(point);
          return this
      }

      placeAt(point) {
          let x = point.x;
          let y = point.y;
          let rect = this.element.getBoundingClientRect();
          let h = rect.bottom-rect.top;
          /* TODO: Implement different notchPositions */
          switch(this.notchPosition) {
              case "bottomLeft":
                  x -= this.padding;
                  x -= this.notchSize;
                  y -= (this.notchSize+h);
                  Elements$1.setStyle(this.element,
                       { left: x + 'px', top: y + 'px'} );
                  break

              case "topLeft":
                  x -= this.padding;
                  x -= this.notchSize;
                  y += this.notchSize;
                  Elements$1.setStyle(this.element,
                      { left: x + 'px', top: y + 'px'} );
                  break
              default:
                  Elements$1.setStyle(this.element,
                      { left: x + 'px', top: y + 'px'} );
                  break
          }
      }

      /** Shows the Popup with the given commands at the current position.
       * @param {Object} content - A dict object with type strings (text, img, html) as keys
       *                            and corresponding values.
       * @return {Popup} this
       */
      show(content) {
          this.setup(content);
          return this
      }

      /** Configuration object. Return default styles as CSS values.
      */
      defaultStyle() {
          let padding = this.padding;
          return {
              borderRadius: Math.round(this.padding / 2) + 'px',
              backgroundColor: this.backgroundColor,
              padding: this.padding + 'px',
              maxWidth: this.maxWidth + 'px',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)',
              position: 'absolute',
              fontFamily : this.fontFamily,
              fontSize: this.fontSize,
              stroke: 'black',
              fill : 'white'}
      }

      /** Configuration object. Return notch styles as CSS values.
      */
      notchStyle() {
          switch(this.notchPosition) {
              case "bottomLeft":
                  return {
                      width: 0,
                      height: 0,
                      boxShadow: '0 12px 15px rgba(0, 0, 0, 0.1)',
                      bottom: -this.notchSize + 'px', // '-10px',
                      position: 'absolute',
                      borderTop: this.notchSize + 'px solid ' + this.backgroundColor,
                      borderRight: this.notchSize + 'px solid transparent',
                      borderLeft: this.notchSize + 'px solid transparent',
                      borderBottom: 0
                  }
              case "topLeft":
                  return {
                      width: 0,
                      height: 0,
                      top: -this.notchSize + 'px',
                      position: 'absolute',
                      borderBottom: this.notchSize + 'px solid ' + this.backgroundColor,
                      borderRight: this.notchSize + 'px solid transparent',
                      borderLeft: this.notchSize + 'px solid transparent',
                      borderTop: 0
                  }
              default:
                  return {
                      width: 0,
                      height: 0,
                      boxShadow: '0 12px 15px rgba(0, 0, 0, 0.1)',
                      bottom: -this.notchSize + 'px', // '-10px',
                      position: 'absolute',
                      borderTop: this.notchSize + 'px solid ' + this.backgroundColor,
                      borderRight: this.notchSize + 'px solid transparent',
                      borderLeft: this.notchSize + 'px solid transparent',
                      borderBottom: 0
                  }
          }
      }

      /** Convenient static methods to show and reuse a Popup implemented
       * as a class variable.
       * @param {Object} content - A dict object with type strings (text, img, html) as keys
       *                            and corresponding values.
       * @param {Point} point - The position as x, y coordinates {px}.
       * @param {boolean} autoClose - Autoclose the menu after selecting an item.
       */
      static open(content, point, {parent = null,
                      fontSize='1em',
                      fontFamily='Arial',
                      padding=16,
                      notchSize=10,
                      switchPos=false,
                      maxWidth=800,
                      backgroundColor='#EEE',
                      normalColor='#444',
                      autoClose=true} = {}) {
          if (Popup.openPopup) {
              this.closePopup();
              return
          }
          if (parent !== null) {
              point = convertPointFromPageToNode(parent, point.x, point.y);
          }
          let notchPosition = 'bottomLeft';
          if (point.y < 50) {
              if(switchPos)notchPosition = 'topLeft';
          }
          let popup = new Popup({parent, fontSize, padding, notchSize, switchPos,
                                  maxWidth, backgroundColor, normalColor,
                                  notchPosition, autoClose});
          popup.showAt(content, point);
          Popup.openPopup = popup;
          /*if (autoClose) {
              window.addEventListener('mousedown', (e) => this.closePopup(e), true)
              window.addEventListener('touchstart', (e) => this.closePopup(e), true)
              window.addEventListener('pointerdown', (e) => this.closePopup(e), true)
          }*/
          Popup.closeEventListener = (e) => { if (this.eventOutside(e))
                                                          this.closePopup(e);};
          if (autoClose) {
              window.addEventListener('mousedown', Popup.closeEventListener, true);
              window.addEventListener('touchstart', Popup.closeEventListener, true);
              window.addEventListener('pointerdown', Popup.closeEventListener, true);
          }
      }

      static eventOutside(e) {
          return !Elements$1.hasClass(e.target, 'PopupContent')
      }

      /** Convenient static methods to close the Popup implemented
       * as a class variable.
       */
      static closePopup(e) {
          if (Popup.openPopup) {
              Popup.openPopup.close();
          }
      }
  }

  /* Class variable */
  Popup.openPopup = null;

  /*** Base parser for loading EyeVisit-style XML. Converts the XML into
   * an internal JSON format that in turn is converted into a HTML 5 representation
   * of EyeVisit cards.
   *
   * Defines the base API for processing the XML.
  ***/

  class XMLParser {

    constructor(path) {
      this.path = path;
      let basePath = this.removeLastSegment(this.path);
      this.basePath = this.removeLastSegment(basePath);
    }

    removeLastSegment(path) {
      let to = path.lastIndexOf('/');
      return path.substring(0, to)
    }

    extractLastSegment(path) {
      let to = path.lastIndexOf('/');
      return path.substring(to + 1, path.length)
    }

    /*** Loads the XML from the given path. ***/
    loadXML() {
      return new Promise((resolve, reject) => {
        $.ajax({
          type: "GET",
          url: this.path,
          dataType: "xml",
          success: (xml) => {
            resolve(xml);
          },
          error: (e) => {
            console.warn("Error loading " + this.path, e);
            reject();
          }
        });
      })
    }

    /*** Entry point, loads and parses the XML. Returns a promise that
      completes if all sub objects are loaded and converted into a single
      DOM tree and to add.***/
    loadParseAndCreateDOM() {
      return new Promise((resolve, reject) => {
          this.loadXML().then((xml) => {
              this.parseXML(xml).then((json) => {
                  let domTree = this.createDOM(json);
                  resolve(domTree);
              }).catch((reason) => {
                  console.warn("parseXML failed", reason);
                  reject(reason);
              });
          }).catch((reason) => {
              console.warn("loadXML failed", reason);
              reject(reason);
          });
      })
    }

    loadAndParseXML() {
      return new Promise((resolve, reject) => {
        this.loadXML().then((xml) => {
          this.parseXML(xml).then((json) => {
               resolve(json);
          }).catch((reason) => {
              console.warn("parseXML in loadAndParseXML failed", reason);
              reject(reason);
          });
        }).catch((reason) => {
              console.warn("loadXML in loadAndParseXML failed", reason);
              reject(reason);
        });
      })
    }

    /*** Parse the received XML into a JSON structure. Returns a promise. ***/
    parseXML(xmldat) {
      console.warn("Needs to be overwritten");
    }

    /*** Create DOM nodes from JSON structure. Returns a promise. ***/
    createDOM(json) {
      console.warn("Needs to be overwritten");
    }
  }

  class XMLIndexParser extends XMLParser {

    constructor(path, { width= window.innerWidth,
                        height= window.innerHeight,
                        assetsPath= '../../var/eyevisit/cards/',
                        colors = { artist:'#b0c6b2',
                                   thema:'#c3c0d1',
                                   details:'#dec1b2',
                                   leben_des_kunstwerks: '#e1dea7',
                                   komposition: '#bebebe',
                                   licht_und_farbe: '#90a2ab',
                                   extra_info: '#c8d9d7',
                                   extra: '#c8d9d7',
                                   extrainfo: '#c8d9d7',
                                   artwork: '#e1dea7',
                                   technik: '#d9b3bd'
                                }
                       } = {}) {
      super(path);
      this.width = width;
      this.height = height;
      this.assetsPath = assetsPath;
      this.colors = colors;
    }

    parseXML(xmldat) {
      return new Promise((resolve, reject) => {
        let indexdat = {
          cards: [],
          cardsources: []
        };
        let data = $(xmldat).find('data');
        for (let key of['thumbnail',
          'artist',
          'title',
          'misc',
          'description',
          'year',
          'nr',
          'annotation']) {
          indexdat[key] = data.find(key).html();
        }
        let promises = [];
        data.find('card').each((i, card) => {
          let src = $(card).attr('src');
          indexdat.cardsources.push(src);
          let parser = new XMLCardParser(this.basePath + '/' + src);
          let subCard = parser.loadAndParseXML().then((json) => {
            indexdat.cards.push(json);
          });
          promises.push(subCard);
        });
        Promise.all(promises).then((result) => {
          resolve(indexdat);
        });
      })
    }

    createDOM(tree) {

      let targetnode = document.createElement('div');
      $(targetnode).attr('id', tree.nr);

      let clone = $("#BACK").html();
      $(targetnode).append(clone);
      clone = $(targetnode).children().last();

      $($(clone).find('header img')).attr('src', this.assetsPath + tree.thumbnail);
      $($(clone).find('.artist')).append(tree.artist);
      $($(clone).find('.title')).append(tree.title);
      $($(clone).find('.misc')).append(tree.misc);
      $($(clone).find('.description')).append(tree.description);

      if (tree.annotation != null) {
        $($(clone)).find('.annotation').append(tree.annotation);
      }

      for (var i = 0; i < tree.cards.length; i++) {
        let id = tree.cardsources[i].match(/[^/]*$/, '')[0].replace('.xml', '');
        let cardclone = $("#CARD").html();
        $(clone).find('main').append(cardclone);
        cardclone = $(clone).find('main').children().last();
        cardclone.attr('id', id);
        this.createCardDOM(tree.cards[i], cardclone);
      }

      this.setupIndex(targetnode);
      return targetnode
    }

    createCardDOM(tree, targetnode) {

      if (tree.template == 2) {
        targetnode.find('#leftcol').addClass('wide');
        targetnode.find('#rightcol').addClass('narrow');
      }

      let colct = 2;

      if (tree.template == 3) {
        targetnode.find('.wrapper').append("<div id='bottomcol'></div>");
        // set leftcol/rightcol height
        // set bottom col styles
        colct = 3;
      }

      targetnode.find('.titlebar').append('<p>' + tree.header + '</p>');
      targetnode.find('.titlebar').css({'background': this.colors[tree.type]});
      targetnode.find('.preview').append('<p>' + tree.preview + '</p>');
      for (var index = 1; index < colct+1; index++) {

        let targetcol = targetnode.find('.wrapper').children()[index];
        let sourcecol = targetnode.find('.wrapper').children()[index].id;
        //console.log(sourcecol)

        while (tree[sourcecol].length > 0) {

          let node = tree[sourcecol].pop();

          if (node.type == "text") {
            let clone = $("#TEXT").html();
            $(targetcol).append(clone).find(".text").last().append(node.html);
          }

          if (node.type == "singleimage") {

            let clone = $("#SINGLEIMAGE").html();
            $(targetcol).append(clone);
            clone = $(targetcol).children().last();

            /*let ratio = this.getRatio(this.assetsPath + node.source)
            let h = (node.maxheight / 670) * this.height
            let w = h * ratio*/

            /*$(clone).css({
              'height': h,
              'width': w
            })*/

            let curMainImg = $($(clone).children('.mainimg'));
            let curFigure = $(clone);

            curMainImg.on('load', this.mainImgLoaded.bind(this, curFigure, node) );/* function(){
              console.log("LOADED", clone, curMainImg.width(), curMainImg.height() )
              console.log(curMainImg.get().naturalWidth, curFigure.get().naturalWidth)
            })*/

            $($(clone).children('.mainimg')).attr('src', this.assetsPath + node.source);
            $(clone).attr('id', node.id);
            $($(clone).children('.zoomicon')).attr('id', node.iconid);

            $(clone).children('figcaption.cap').append(node.cap); // uo: already replaced in parseXML .replace("&lt;", "<").replace("&gt;", ">")
            $(clone).children('figcaption.zoomcap').append(node.zoomcap);
          }

          if (node.type == "video") {

            let targetsrc = node.source.replace('f4v', 'mp4');

            let clone = $("#VIDEO").html();
            $(targetcol).append(clone);
            clone = $(targetcol).children().last();

            $(clone).css({
              'max-height': (node.maxheight / 670) * this.height
            });
            $($(clone).children('video').children('source')).attr('src', this.assetsPath + targetsrc);

            $(clone).attr('id', node.id);
            $($(clone).children('.zoomicon')).attr('id', node.iconid);
            $(clone).children('figcaption.cap').append(node.cap); // uo: already replaced in parseXML .replace("&lt;", "<").replace("&gt;", ">"))
            $(clone).children('figcaption.zoomcap').append(node.zoomcap);

            $(clone).append(node);
          }

          if (node.type == "space") {
            $(targetcol).append($("#SPACE").html());
            let clone = $(targetcol).children().last();
            $(clone).css({height: node.height});
          }

          if (node.type == "groupimage") {

            let clone = $("#GROUPIMAGE").html();
            $(targetcol).append(clone);
            clone = $(targetcol).children().last();

            $(clone).css({
              'height': (node.maxheight / 670) * this.height
            });

            let len = Object.keys(node.figures).length;
            if(len > 2){
              let diff = len - 2;
              while(diff > 0){
                let gr_figure = $("#GROUPIMAGE_FIGURE").html();
                $(clone).append(gr_figure);
                diff -= 1;
              }
            }

            for (let j = 0; j < len; j++) {
              let figure = $($(clone).children('figure')[j]);
              figure.children('.mainimghalf').attr('src', this.assetsPath + node.figures[j+1].source);
              figure.attr('id', node.figures[j+1].id);
              figure.children('.zoomicon').attr('id', node.figures[j+1].iconid);

              figure.children('figcaption.cap').append(node.figures[j+1].cap);
              figure.children('figcaption.zoomcap').append(node.figures[j+1].zoomcap);
            }
          }
        }
      }

      targetnode.find('a').each(function() {
          let value = tree.tooltipdata[$(this).attr('data-target')];
          $(this).attr('data-tooltip', value);
      });

    }

    mainImgLoaded(fig, node){
      //layout which depends on the actual main img size goes here
      let curMainImg = $(fig.children('.mainimg'));
      let ratio = curMainImg.width() / curMainImg.height();

      // show image highlights
      let highlights = node.highlights;
      node = "";

      while (highlights.length > 0) {
        let highlight = highlights.pop();

        //change height of the highlight according to ratio of the corresponding main img
        let tmpStyle1 = highlight.style.split("height:");
        let tmpStyle2 = tmpStyle1[1].split("%;width:");
        let newStyle = tmpStyle1[0] + "height:" + parseFloat(tmpStyle2[0]) * ratio + "%;width:" + tmpStyle2[1];
        highlight.style = newStyle;

        node += "<a id='" + highlight.id.replace(/\./g, "_") + "' class='detail' href='#' data-target='" + highlight.target + "' data-radius = '" + highlight.radius + "' style='" + highlight.style + "' ></a>";
        //console.log('highlight with radius: ', highlight.radius, highlight.target, highlight.style)
      }

      //fig.children('mainimgContainer').append(node)
      fig.append(node);
    }

    completed(domNode) {
      /*** Called after the domNode has been added.

      At this point we can register a click handler for the
      flip wrapper which allows us to add a popup that can extend over the back
      and front card bounds. Note that popups have to be closed on click events
      outside the popups.

      TODO: On mobile devices we have to
      stay within the card bounds. That's much more complicated.
      ***/
      let wrapper = $(domNode).closest('.flipWrapper');
      wrapper.on('click', (e) => {

          let domContainer = wrapper[0];
          if (domContainer.popup) {
              domContainer.popup.close();
              domContainer.popup = null;
          }
          this.removeZoomable();
          this.removeImageHighlight();
          let target = $(e.target);
          let tooltip = target.attr('data-tooltip');
          if (tooltip) {
              let globalPos = { x: e.pageX, y: e.pageY };
              let localPos = Points.fromPageToNode(domContainer, globalPos);

              let popup = new Popup({ parent: domContainer, backgroundColor:'#222'});
             // localPos.y = this.height - localPos.y
              popup.showAt({html: tooltip}, localPos);
              domContainer.popup = popup;

              /*if(target.attr('class') == 'detail'){
                this.currentHighlight = target
                this.openImageHighlight();
                console.log('open image highlight with id:', target.attr('id'))
              }*/

              if(target.attr('imagehighlightid')){
                //console.log(target.attr('imagehighlightid'))
                //console.log((target.attr('id') + "Detail").replace(/\./g, "_"))
                let detailId = (target.attr('id') + "Detail").replace(/\./g, "_");
                this.currentHighlight = document.getElementById(detailId);
                this.openImageHighlight();
                console.log('open image highlight with id:', target.attr('id'), target);
              }

              //console.log('tooltip found:',target, target.attr('data-tooltip'), target.scale, this.currentHighlight)

          }
          let zoomable = target.closest('.zoomable');
          if (zoomable.length > 0 && !tooltip) {
              // let wrapper = $(e.target).closest('.flipWrapper')
  //             let div = wrapper.find('.ZoomedFigure')
  //             if (div.length > 0) {
  //                 this.closeZoomable(wrapper, div)
  //                 return
  //             }

            if(target.attr('class') == 'detail'){
              let globalPos = { x: e.pageX, y: e.pageY };
              let localPos = Points.fromPageToNode(domContainer, globalPos);

              let searchId = target.attr('id').split('Detail');
              let tooltipElement = document.getElementById(searchId[0]);
              let tooltip = tooltipElement.attributes.getNamedItem('data-tooltip').value;

              let popup = new Popup({ parent: domContainer, backgroundColor:'#222'});
              localPos.y = this.height - localPos.y;
              popup.showAt({html: tooltip}, localPos);
              domContainer.popup = popup;

              this.currentHighlight = target;
              this.openImageHighlight();
              console.log('open image highlight with id:', target.attr('id'), target);
            }
            else {
              this.openZoomable(wrapper, zoomable);
            }
          }
      });
      this.domNode = domNode;

      let highlights = document.getElementsByClassName('detail');
      for (let i = 0; i < highlights.length; i++){
        //console.log(highlights[i])
        let highlight = highlights[i];
        let parent = highlight.parentNode;
        for (let j = 0; j < parent.childNodes.length; j++){
          if(parent.childNodes[j].className == 'mainimg'){
            //console.log("mainimg found")
            let mainimg = parent.childNodes[j];
            //console.log(mainimg.naturalWidth, mainimg.width)
          }
        }
      }

    }

    openImageHighlight() {
      /*
      TweenMax.to(this.currentHighlight, 0.4, {
                scale: 1.15,
                ease: Back.easeOut,
                alpha: 1,
                onComplete: () => {
                  //...
              }})
              */
      TweenMax.set(this.currentHighlight, {
        scale: 1.25,
        alpha: 1,
        onComplete: () => {
          //...
      }});
    }

    removeImageHighlight(){
      if(this.currentHighlight){
        //TweenMax.to(this.currentHighlight, 0.4, {scale: 1})
        TweenMax.set(this.currentHighlight, {scale: 1});
        this.currentHighlight = null;
      }

    }

    closeZoomable(wrapper, div, zoomable, pos, scale, duration=0.4) {
      //console.log("closeZoomable")
      this.zoomableTweenInProgress = true;
      if (zoomable.length > 0) {
          TweenMax.to(zoomable[0], duration, {
            autoAlpha: 1,
            onComplete: () => {
              //console.log("tween finished")
          }});
      }
      TweenMax.to(div[0], duration, {
          scale: scale,
          x: pos.x,
          y: pos.y,
          onComplete: () => {
              //console.log("closeZoomable tween finished")
              div.remove();
              let icon = wrapper.find('.ZoomedIcon');
              icon.remove();
              this.zoomableTweenInProgress = false;
          }});
    }

    removeZoomable(animated=false) {
        //console.log("checking for open zoomables (animated?: " + animated + " )")
         let wrapper = $(this.domNode).closest('.flipWrapper');
         let div = wrapper.find('.ZoomedFigure');
         if (div.length > 0) {
          if (animated) {
                let zoomable = div[0].zoomable;
                let zoomablePos = div[0].zoomablePos;
                let zoomableScale = div[0].zoomableScale;
                if (zoomable) {
                    this.closeZoomable(wrapper, div, zoomable, zoomablePos, zoomableScale, 0.1);
                }
          }
          else {
            //cleanup is not necessary if zoomable tween is in progress
            if(!this.zoomableTweenInProgress){
              let zoomable = div[0].zoomable;
              if(zoomable.length > 0){
                zoomable[0].style.visibility = "visible";
                zoomable[0].style.opacity = 1;
              }
              let icon = wrapper.find('.ZoomedIcon');
              div.remove();
              icon.remove();
            }
          }
        }
    }

    openZoomable(wrapper, zoomable) {
      console.log("openZoomable",wrapper,zoomable);
      wrapper.append('<div class="ZoomedFigure" style="display:hidden;"><figure></figure></div>');
      let div = wrapper.find('.ZoomedFigure');

      let figure = div.find('figure');
      let img = zoomable.find('.mainimg');
      if (img.length == 0) {
          img = zoomable.find('.mainimghalf');
      }
      figure.append('<img src="' + img.attr('src') + '">');
      let zoomCap = zoomable.find('.zoomcap');
      let zoomCapClone = zoomCap.clone();
      figure.append(zoomCapClone);
      zoomCapClone.show();

      let zoomIcon = zoomable.find('.zoomicon');
      console.log(this.assetsPath);
      wrapper.append('<img class="zoomicon ZoomedIcon" src="'+this.iconsPath+'/close.svg">');

      let globalIconPos = Points.fromNodeToPage(zoomIcon[0], { x: 0, y: 0});
      let localIconPos = Points.fromPageToNode(wrapper[0], globalIconPos);

      let globalFigurePos = Points.fromNodeToPage(zoomable[0], { x: 0, y: 0});
      let localFigurePos = Points.fromPageToNode(wrapper[0], globalFigurePos);
      let relativeIconPos = Points.fromPageToNode(zoomable[0], globalIconPos);

      let currentWidth = relativeIconPos.x;
      let currentHeight = relativeIconPos.y;
      let width = img[0].naturalWidth - 16;
      let height = img[0].naturalHeight - 16;
      let scale = (currentWidth / width) * 1.1;

      div[0].zoomable = zoomable;
      div[0].zoomablePos = localFigurePos;
      div[0].zoomableScale = scale;

      let icon = wrapper.find('.ZoomedIcon');
      icon.on('click', (e) => {
          this.closeZoomable(wrapper, div, zoomable, localFigurePos, scale);
      });
      div.show();
      TweenMax.set(icon[0], { x: localIconPos.x, y: localIconPos.y });
      TweenMax.set(div[0], {  x:localFigurePos.x,
                              y:localFigurePos.y,
                              scale: scale,
                              transformOrigin: "top left"});

      TweenMax.to(zoomable[0], 0.4, { autoAlpha: 0});
      TweenMax.to(div[0], 0.4, { scale: 1,
                                      x: "-=" + (width - currentWidth),
                                      y: "-=" + (height - currentHeight)});
    }

    get iconsPath(){
      return "icons"
    }

    getRatio(source) {
      let dummy = document.createElement("IMG");
      dummy.setAttribute("src", source);

      dummy.onload = function(){
        console.log("get ratio - on dummy loaded:",source,dummy.width, dummy.height);
      };

      let ratio = dummy.naturalWidth / dummy.naturalHeight;
      console.log("get ratio - dummy width:",source, ratio, dummy.width, dummy.height, dummy);
      return ratio
    }

    setupIndex(indexnode, useGreenSock=true) {
      let duration = 300;
      let that = this;
      $(indexnode).find('.card').each(function() {
        $(this).on('click', function(event) {
          if ($(this).attr("expanded") == "true") {
            $(this).attr("expanded", "false");
            $(this).css('flex-grow', '0');
          }
          that.removeZoomable(true);

          let cardbox = $(this).parent();
          let indexbox = $(this).parents('.mainview');

          let el = $(this)[0];
          let st = window.getComputedStyle(el, null);
          let tr = st.getPropertyValue('transform');
          let angle = 0;
          if (tr !== "none") {
            let values = tr.split('(')[1].split(')')[0].split(',');
            let a = values[0];
            let b = values[1];
            angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
          }

          let target = $(this).clone();
          let root = $(this);

          $(target).attr('id', 'overlay');
          $($(target).find('.cardicon')).attr('src', that.iconsPath + '/close.svg');
          $(target).find('.titlebar').css({height: '8%'});
          console.log("Expand");
          if (useGreenSock) {

              let indexWidth = indexnode.getBoundingClientRect().width;
              let indexHeight = indexnode.getBoundingClientRect().height;
              let rootWidth = root[0].getBoundingClientRect().width;
              let rootHeight = root[0].getBoundingClientRect().height;
              let scale = (useGreenSock) ? rootWidth / indexWidth : 1;

              let globalOrigin = Points.fromNodeToPage(root[0], {x:0, y:0});
              let localOrigin = Points.fromPageToNode(indexbox[0], globalOrigin);

              TweenMax.set(target[0], { css: {
                   position: 'absolute',
                   width: '97.5%',
                   height: '86.5%',
                   margin: 0,
                   zIndex: 101
              }});
              TweenMax.set(root[0], { alpha: 0});
              TweenMax.set(target[0], {
                    x: localOrigin.x,
                    y: localOrigin.y,
                    scale: scale,
                    transformOrigin: '0% 0%',
                    rotation: angle,
              });

              $(target).prependTo(indexbox);

              TweenMax.to(target[0], 0.2, {
                  x: indexWidth * 0.02,
                  y: 0,
                  scale: 1,
                  rotation: 0
              });
              let preview = $(target).find('.preview');
              TweenMax.to(preview[0], 0.5, { autoAlpha: 0 });

              $(target).find('.cardicon').on('click', (event) => {

                  that.removeZoomable(true);
                  TweenMax.set(root[0], { autoAlpha: 1 });
                  TweenMax.to(target[0], 0.2, {
                      x: localOrigin.x,
                      y: localOrigin.y,
                      scale: scale,
                      rotation: angle,
                      onComplete: () => {
                          TweenMax.to(target[0], 0.4,
                              { delay: 0.2,
                                alpha: 0,
                                onComplete:
                                  () => {
                                      target[0].remove();}
                              });
                      }
                  });

                 // TweenMax.to(preview[0], 0.2, { alpha: 1 })
              });

          }
          else {
              $(target).find('.cardicon').on('click', function(event) {
                $(target).fadeOut(duration, function() {
                  $(target).remove();
                });
              });

              $(target).css({
                'position': 'absolute',
                'top': root.offset().top,
                'left': root.offset().left,
                'margin': 0,
                'z-index': '101'
              });
              $(target).prependTo(indexbox);

              $(target).animate({
                  top: '5%',
                  left: '2%',
                  width: '96%',
                  height: '90%',
                  margin: '0'
                  }, duration);
              $(target).find('.preview').fadeOut(700);

              $({deg: 0}).animate({
                  deg: angle
                  }, {
                  duration: duration,
                  step: function(now) {
                      $(target).css({transform: 'rotate(0deg)'});
                  }
              });
          }

        // this.setupZoomables($(target)) ??? is this this the this i want to this ???

          });
      });
  }

    setupZoomables(cardnode) {
      $(cardnode).find('figure.zoomable').each(function() {
        // zoomfun()
      });
    }
  }

  class XMLCardParser extends XMLParser {

      parseXML(xmldat) {
          return new Promise((resolve, reject) => {

              let template = $($(xmldat).find('content')).attr('template');
              let targetdat;

              if(template==3){
                targetdat = {
                  'leftcol': {},
                  'rightcol': {},
                  'bottomcol': {}
                };
              } else {
                targetdat = {
                  'leftcol': {},
                  'rightcol': {}
                };
              }


              targetdat.template = template;
              targetdat.type = $($(xmldat).find('card')).attr('type').replace(/\s/g, '_');
              let header = $(xmldat).find("h1");
              if (header.length > 0) {
                  let title = this.preserveTags(header[0].innerHTML);
                  targetdat.header = title;
              }

              let preview = $(xmldat).find("preview");
              let previewText = preview.find("text");
              if (previewText.length > 0) {
                  preview = this.preserveTags(previewText[0].innerHTML);
              }
              else {
                  let previewImage = preview.find("img");
                  if (previewImage.length > 0) {
                      let image = $(previewImage[0]);
                      let src = image.attr('src');
                      image.attr('src', this.createLinkURL(src));
                      preview = previewImage[0].outerHTML;
                  }
              }

              targetdat.preview = preview;
              targetdat.tooltipdata = {};
              let cols = $(xmldat).find("column");
              let keydat = Object.keys(targetdat);
              let imgindex = 0,
                  plaintext = '';

              for (let index = 0; index < cols.length; index++) {
                  let sourcecol = $(cols[index]).children();
                  targetdat[keydat[index]] = {};
                  let newnodes = [];
                 for (let i = 0; i < sourcecol.length; i++) {
                      let type = sourcecol[i].nodeName;
                      let html = sourcecol[i].innerHTML;
                      let nodes = "";
                      let node = {};
                      // content type: PREVIEW, TEXT, VIDEO, GROUPIMAGE, SINGLEIMAGE, GLOSS_LINK, DETAIL_LINK, DETAIL_ZOOM, SPACE
                      if (type == "text") {
                          html = this.replaceCDATA(html);
                          html = html.replace(/-([a-z]) /gi, "$1");
                          // UO: The following line is in conflict with URL like tete-a-tete.xml
                          html = html.replace(/-([a-z])/gi, "$1");
                          nodes = $.parseHTML(html);
                          node.type = 'text';
                          node.html = '';
                          for (let j = 0; j < nodes.length; j++) {
                              if (nodes[j].nodeName == "P") {
                                  let links = nodes[j].getElementsByTagName('a');
                                  for (let k = 0; k < links.length; k++) {
                                      let ref = this.createLinkURL(links[k].href);
                                      $(links[k]).attr('data-target', ref);
                                      targetdat.tooltipdata[ref] = "";
                                      links[k].href = "#";
                                      let linktype = "";
                                      if (links[k].href.indexOf("glossar") != -1) {
                                          linktype = "glossLink";
                                      } else if (links[k].hasAttribute("imagehighlightid")) {
                                          linktype = "detailLink";
                                          links[k].id = $(links[k]).attr('imagehighlightid').replace(/\./g, "_");
                                      } else {
                                          linktype = "glossLink";
                                      }
                                      $(links[k]).attr("class", linktype);
                                      /*** UO: This crashed on Firefox 48. Seems to be unnecessary.
                                       nodes[j].getElementsByTagName("a")[k] = links[k]
                                         ***/
                                  }
                              node.html += '<p> ' + nodes[j].innerHTML + ' </p>';
                              //UO: Enable the following line to remove all links from P tags
                             // node.html += '<p> ' + nodes[j].innerText + ' </p>'
                              plaintext += nodes[j].innerText;
                              } else if (nodes[j].nodeName == "H2") {
                                  node.html += '<h2> ' + nodes[j].innerHTML + ' </h2>';
                                  plaintext += nodes[j].innerText;
                              }
                          }
                      }

                      if (type == "img") {

                          imgindex = imgindex + 1;

                          if ($(sourcecol[i]).attr('src').indexOf(".f4v") >= 0) {

                            node.type = 'video';
                            node.maxheight = $(sourcecol[i]).attr('maxHeight') + 'px';
                            node.source = $(sourcecol[i]).attr('src').replace('f4v', 'mp4');
                            node.id = 'zoomable' + imgindex;
                            node.iconid = 'zoom' + imgindex;
                            node.cap = this.caption(sourcecol[i]);
                            node.zoomcap = this.zoomCaption(sourcecol[i]);

                          } else {

                            node.type = 'singleimage';
                            node.maxheight = $(sourcecol[i]).attr('maxHeight') + 'px';
                            node.source = $(sourcecol[i]).attr('src');
                            node.id = 'zoomable' + imgindex;
                            node.iconid = 'zoom' + imgindex;
                            node.cap = this.caption(sourcecol[i]);
                            node.zoomcap = this.zoomCaption(sourcecol[i]);

                            //walk throungh highlights
                            nodes = $.parseHTML(html);
                            let highlights = [];

                            for (let j = 0; j < nodes.length; j++) {

                              if (nodes[j].nodeName == "HIGHLIGHT") {
                                console.log('parsing highlight');

                                let ref = this.createLinkURL($(nodes[j]).attr('href'));

                                targetdat.tooltipdata[ref] = "";

                                let subnode = {};

                                subnode.id = ($(nodes[j]).attr('id') + "Detail").replace(/\./g, "_");
                                subnode.src = $(nodes[j]).attr('id').replace(".jpg", "").replace(/.h\d+/, "").replace(".", "/") + ".jpg";

                                let style = "";
                                style = style + "left:" + $(nodes[j]).attr('x') * 100 + "%;";
                                style = style + "top:" + $(nodes[j]).attr('y') * 100 + "%;";
                                style = style + "height:" + $(nodes[j]).attr('radius') * 200 + "%;";
                                style = style + "width:" + $(nodes[j]).attr('radius') * 200 + "%;";
                                /*style = style + "position:" + "relative;"
                                style = style + "left:" + $(nodes[j]).attr('x') + ";"
                                style = style + "top:" + $(nodes[j]).attr('y') + ";"
                                style = style + "height:" + $(nodes[j]).attr('radius') * 180 + "%;"
                                style = style + "width:" + $(nodes[j]).attr('radius') * 180 + "%;"*/

                                style = style + "background-image:url(" + ref.replace("xml", "jpg") + ");";

                                subnode.style = style;
                                subnode.target = ref;
                                subnode.radius = $(nodes[j]).attr('radius');

                                console.log(subnode.src,subnode.target);

                                highlights.push(subnode);

                              }
                            }
                            node.highlights = highlights.reverse();
                          }
                        }

                      if (type == "space" & i == 0) {
                          node.type = 'space';
                          node.height = $(sourcecol[i]).attr('height') + "px";
                      }

                      if (type == "imggroup") {

                          node.type = 'groupimage';
                          node.maxheight = $(sourcecol[i]).attr('maxHeight') + 'px';
                          node.figures = {};

                          for(let j = 0; j < $(sourcecol[i]).children('img').length; j++){

                            imgindex += 1;
                            let srcimg = $(sourcecol[i]).children('img')[j];

                            node.figures[j+1] = {};
                            node.figures[j+1].source = $(srcimg).attr('src');
                            node.figures[j+1].id = 'zoomable' + imgindex;
                            node.figures[j+1].iconid = 'zoom' + imgindex;
                            node.figures[j+1].cap = this.caption(srcimg);
                            node.figures[j+1].zoomcap = this.zoomCaption(srcimg);

                          }
                      }
                      newnodes.push(node);
                  }
                  targetdat[keydat[index]] = newnodes.reverse();
              }
              targetdat.plaintext = plaintext;
              let tooltipRefs = Object.keys(targetdat.tooltipdata);
              //console.log(tooltipRefs)
              let linkpromises = [];
              for (let i of tooltipRefs) {
                  let url = i;
                  let parser = new XMLParser(url);
                  let promise = parser.loadXML().then((xml) => {
                      let img = $(xml).find('img');
                      for(let i=0; i<img.length; i++) {
                          let src = $(img[i]).attr('src');
                          $(img[i]).attr('src', this.createLinkURL(src));
                      }
                      let linkdat = $(xml).find('content').html();
                      linkdat = this.replaceCDATA(linkdat);
                      linkdat = this.replaceText(linkdat);
                      targetdat.tooltipdata[url] = linkdat;
                  }).catch((error) =>{
                    console.error("Could not load XML at: " + url, error);
                  });
                  linkpromises.push(promise);
              }

              Promise.all(linkpromises).then((input) => {
                  resolve(targetdat);
              });
          })
      }

      replaceText(html) {
          return html.replace(/<\/text>/g, "")
              .replace(/<text>/g, "")
              .replace(/\t/g, "")
              .replace(/"/g, "'")
              .replace(/\n/g, '')
              .replace(/\r/g, '')
      }

      replaceCDATA(html) {
        if(html)
          return html.replace(/<\!\[CDATA\[/g, "").replace(/]]>/g, "")
          else{
            console.error("Could not replace CDATA at '"+this.path+"': " + html);
            return "CDATA-ERROR"
          }
      }

      replaceEscapedAngleBrackets(html) {
          return html.replace(/\t/g, "").replace(/&lt;/, "<").replace(/&gt;/, ">")
      }

      preserveTags(html) {
          return this.replaceEscapedAngleBrackets(html)
      }

      caption(element) {
          try {
              return this.replaceEscapedAngleBrackets($(element).attr('caption'))
          } catch(e) {
              return "Missing Caption"
          }
      }

      zoomCaption(element) {
          try {
              return this.replaceEscapedAngleBrackets($(element).attr('zoomCaption'))
          } catch(e) {
              return "Missing ZoomCaption"
          }
      }

      /* Converts absolute URLs in href attributes created by the DOM builder
          into correct src url. */
      createLinkURL(href) {
          let last = this.extractLastSegment(href);
          let rest = this.removeLastSegment(href);
          let first = this.extractLastSegment(rest);
          return this.basePath + '/' + first + '/' + last
      }

  }

  class XMLCardLoader extends CardLoader {

      constructor(src, {x=0, y=0,
                          width=1400, height=1200, maxWidth=null, maxHeight=null,
                          scale=1, minScale=0.25, maxScale=2, rotation=0} = {}) {
          super(src, {x, y, width, height, maxWidth, maxHeight,
                      scale, minScale, maxScale, rotation});
          this.xmlParser = new XMLIndexParser(this.src, {width: width, height: height});
      }

      load(domNode) {
          console.log("domNode", domNode);
          return new Promise((resolve, reject) => {
              this.xmlParser.loadParseAndCreateDOM().then((domTree) => {
                  domNode.appendChild(domTree);
          //         let scaleW = this.maxWidth / this.wantedWidth
  //                 let scaleH = this.maxHeight / this.wantedHeight
  //                 this.scale = Math.min(this.maxScale, Math.min(scaleW, scaleH))

                  this.scale = 1 / (window.devicePixelRatio || 1);
                  let w = this.wantedWidth;
                  let h = this.wantedHeight;
                  $(domNode).css({ 'width': w,
                                      'maxWidth': w,
                                      'minWidth': w,
                                      'height': h});
                  this.addedNode = domTree;
                  this.xmlParser.completed(domNode);
                  resolve(this);
              }).catch((reason) => {
                  console.warn("loadParseAndCreateDOM error", reason);
                  reject(reason);
              });
          })
      }
  }

  let data = [];
  let existing = [41, 1, 3, 19, 69, 20, 24, 27, 28, 29, 31];

  function pad(num, size) {
      var s = num+"";
      while (s.length < size) s = "0" + s;
      return s;
  }

  function setupData() {
      let dir = "../../var/eyevisit/cards/";
      for(let i=0; i<3; i++) {
          let cardIndex = existing[i];
          let key = pad(cardIndex, 3);
          let img = dir + key + "/" + key + ".jpg";
          let xml = dir + key + "/" + key + ".xml";
          data.push({front: img,
                      back: xml});
      }
  }

  function run() {
      setupData();
      let scatterContainer = new DOMScatterContainer(main);
      if (Capabilities.supportsTemplate()) {
          data.forEach((d) => {
              let flip = new DOMFlip(scatterContainer,
                              flipTemplate,
                              new ImageLoader(d.front, { minScale: 0.1, maxScale: 3, maxWidth: main.clientWidth / 4}),
                              new XMLCardLoader(d.back)); // ImageLoader(d.back)) //
              flip.load().then((flip) => {
                  let bounds = flip.flippable.scatter.bounds;
                  let w = bounds.width;
                  let h = bounds.height;
                  let x = w/2 + Math.random()*(main.clientWidth - w);
                  let y = h/2 + Math.random()*(main.clientHeight - h);
                  let angle = 0; //Math.random()*360
                  flip.flippable.scatter.rotationDegrees = angle;
                  flip.centerAt({x, y});
              });
          });
      }
      else {
          alert("Templates not supported, use Edge, Chrome, Safari or Firefox.");
      }
  }

  run();

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvdXRpbHMuanMiLCIuLi8uLi8uLi9saWIvZXZlbnRzLmpzIiwiLi4vLi4vLi4vbGliL2ludGVyZmFjZS5qcyIsIi4uLy4uLy4uL2xpYi9pbnRlcmFjdGlvbi5qcyIsIi4uLy4uLy4uL2xpYi9jYXBhYmlsaXRpZXMuanMiLCIuLi8uLi8uLi9saWIvc2NhdHRlci5qcyIsIi4uLy4uLy4uL2xpYi9mbGlwcGFibGUuanMiLCIuLi8uLi8uLi9saWIvcG9wdXAuanMiLCJ4bWxwYXJzZXIuanMiLCJ4bWxjYXJkbG9hZGVyLmpzIiwibWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWxzIFdlYktpdFBvaW50ICovXG5cbi8qKiBUZXN0cyB3aGV0aGVyIGFuIG9iamVjdCBpcyBlbXB0eVxuICogQHBhcmFtIHtPYmplY3R9IG9iaiAtIHRoZSBvYmplY3QgdG8gYmUgdGVzdGVkXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eShvYmopIHtcbiAgICAvLyA+IGlzRW1wdHkoe30pXG4gICAgLy8gdHJ1ZVxuICAgIGZvciAobGV0IGkgaW4gb2JqKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxufVxuXG4vKiogUmV0dXJucyBhIHVuaXZlcnNhbCB1bmlxdWUgaWRcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqIFNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvY3JlYXRlLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0LzIxOTYzMTM2IzIxOTYzMTM2XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1dWlkKCkge1xuICAgIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGMgPT4ge1xuICAgICAgICBsZXQgciA9IChNYXRoLnJhbmRvbSgpICogMTYpIHwgMCxcbiAgICAgICAgICAgIHYgPSBjID09ICd4JyA/IHIgOiAociAmIDB4MykgfCAweDhcbiAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpXG4gICAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxlcnAoc3RhcnQsIHN0b3AsIGFtdCkge1xuICAgIHJldHVybiBhbXQgKiAoc3RvcCAtIHN0YXJ0KSArIHN0YXJ0XG59XG5cbi8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3Rcbi8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3Jcbi8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbi8vIFRha2VuIGZyb206IGh0dHBzOi8vZGF2aWR3YWxzaC5uYW1lL2Vzc2VudGlhbC1qYXZhc2NyaXB0LWZ1bmN0aW9uc1xuZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIGxldCB0aW1lb3V0XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgY29udGV4dCA9IHRoaXMsXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzXG4gICAgICAgIGxldCBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGxcbiAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXRcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpXG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KVxuICAgICAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKVxuICAgIH1cbn1cblxuLyoqIFJldHVybnMgYW4gaWQgdGhhdCBpcyBndWFyYW50ZWVkIHRvIGJlIHVuaXF1ZSB3aXRoaW4gdGhlIGxpdmV0aW1lIG9mIHRoZVxuICogYXBwbGljYXRpb25cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubGV0IF9pZEdlbmVyYXRvciA9IDBcbmV4cG9ydCBmdW5jdGlvbiBnZXRJZCgpIHtcbiAgICByZXR1cm4gJ2lkJyArIF9pZEdlbmVyYXRvcisrXG59XG5cbmV4cG9ydCBjbGFzcyBEYXRlcyB7XG4gICAgc3RhdGljIGNyZWF0ZShmdWxsWWVhciwgbW9udGgsIGRheSkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoZnVsbFllYXIsIG1vbnRoLCBkYXkpKVxuICAgIH1cblxuICAgIHN0YXRpYyBkYXlzSW5Nb250aChkYXRlKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSArIDEsIDApLmdldERhdGUoKVxuICAgIH1cblxuICAgIHN0YXRpYyBuZXh0WWVhcihkYXRlLCBvZmZzZXQgPSAxKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZShkYXRlLmdldEZ1bGxZZWFyKCkgKyBvZmZzZXQsIDAsIDEpXG4gICAgfVxuXG4gICAgc3RhdGljIG5leHRNb250aChkYXRlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSArIDEsIDEpXG4gICAgfVxuXG4gICAgc3RhdGljIG5leHREYXkoZGF0ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGUoXG4gICAgICAgICAgICBkYXRlLmdldEZ1bGxZZWFyKCksXG4gICAgICAgICAgICBkYXRlLmdldE1vbnRoKCksXG4gICAgICAgICAgICBkYXRlLmdldERhdGUoKSArIDFcbiAgICAgICAgKVxuICAgIH1cblxuICAgIHN0YXRpYyBuZXh0SG91cihkYXRlKSB7XG4gICAgICAgIC8vIFNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNTA3MjAvYWRkaW5nLWhvdXJzLXRvLWphdmFzY3JpcHQtZGF0ZS1vYmplY3RcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpICsgNjAgKiA2MCAqIDEwMDApXG4gICAgfVxuXG4gICAgc3RhdGljIG5leHRNaW51dGUoZGF0ZSkge1xuICAgICAgICAvLyBTZWUgYWJvdmVcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpICsgNjAgKiAxMDAwKVxuICAgIH1cblxuICAgIHN0YXRpYyBuZXh0U2Vjb25kKGRhdGUpIHtcbiAgICAgICAgLy8gU2VlIGFib3ZlXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSArIDEwMDApXG4gICAgfVxuXG4gICAgc3RhdGljIG5leHRNaWxsaXNlY29uZChkYXRlKSB7XG4gICAgICAgIC8vIFNlZSBhYm92ZVxuICAgICAgICByZXR1cm4gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkgKyAxKVxuICAgIH1cblxuICAgIHN0YXRpYyAqaXRlclllYXJzKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgbGV0IGRhdGUgPSB0aGlzLmNyZWF0ZShzdGFydC5nZXRGdWxsWWVhcigpLCAwLCAxKVxuICAgICAgICB3aGlsZSAoZGF0ZSA8PSBlbmQpIHtcbiAgICAgICAgICAgIHlpZWxkIGRhdGVcbiAgICAgICAgICAgIGRhdGUgPSB0aGlzLm5leHRZZWFyKGRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgeWllbGQgZGF0ZVxuICAgIH1cblxuICAgIHN0YXRpYyAqaXRlck1vbnRocyh5ZWFyLCBsaW1pdCA9IDEyKSB7XG4gICAgICAgIGxldCBtb250aCA9IDBcbiAgICAgICAgd2hpbGUgKG1vbnRoIDwgbGltaXQpIHtcbiAgICAgICAgICAgIGxldCBkYXRlID0gdGhpcy5jcmVhdGUoeWVhci5nZXRGdWxsWWVhcigpLCBtb250aCwgMSlcbiAgICAgICAgICAgIHlpZWxkIGRhdGVcbiAgICAgICAgICAgIG1vbnRoICs9IDFcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyAqaXRlck1vbnRoc09mWWVhcnMoeWVhcnMpIHtcbiAgICAgICAgZm9yIChsZXQgeWVhciBvZiB5ZWFycykge1xuICAgICAgICAgICAgZm9yIChsZXQgbW9udGggb2YgdGhpcy5pdGVyTW9udGhzKHllYXIpKSB7XG4gICAgICAgICAgICAgICAgeWllbGQgbW9udGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyAqaXRlckRheXMobW9udGgpIHtcbiAgICAgICAgbGV0IGRheSA9IDFcbiAgICAgICAgbGV0IGxpbWl0ID0gRGF0ZXMuZGF5c0luTW9udGgobW9udGgpXG4gICAgICAgIHdoaWxlIChkYXkgPD0gbGltaXQpIHtcbiAgICAgICAgICAgIGxldCBkYXRlID0gdGhpcy5jcmVhdGUobW9udGguZ2V0RnVsbFllYXIoKSwgbW9udGguZ2V0TW9udGgoKSwgZGF5KVxuICAgICAgICAgICAgeWllbGQgZGF0ZVxuICAgICAgICAgICAgZGF5ICs9IDFcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyAqaXRlckRheXNPZk1vbnRocyhtb250aHMpIHtcbiAgICAgICAgZm9yIChsZXQgbW9udGggb2YgbW9udGhzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBkYXkgb2YgdGhpcy5pdGVyRGF5cyhtb250aCkpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCBkYXlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbi8qIENvbG9yIGNvbnZlcnNpb24gZnVuY3Rpb25zICovXG5cbmV4cG9ydCBjbGFzcyBDb2xvcnMge1xuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTYyMzgzOC9yZ2ItdG8taGV4LWFuZC1oZXgtdG8tcmdiXG5cbiAgICBzdGF0aWMgcmdiMm51bShyZWQsIGdyZWVuLCBibHVlKSB7XG4gICAgICAgIGxldCByZ2IgPSBibHVlIHwgKGdyZWVuIDw8IDgpIHwgKHJlZCA8PCAxNilcbiAgICAgICAgcmV0dXJuIDB4MDAwMDAwICsgcmdiXG4gICAgfVxuXG4gICAgc3RhdGljIHJnYjJoZXgocmVkLCBncmVlbiwgYmx1ZSkge1xuICAgICAgICBsZXQgcmdiID0gYmx1ZSB8IChncmVlbiA8PCA4KSB8IChyZWQgPDwgMTYpXG4gICAgICAgIHJldHVybiAnIycgKyAoMHgxMDAwMDAwICsgcmdiKS50b1N0cmluZygxNikuc2xpY2UoMSlcbiAgICB9XG5cbiAgICBzdGF0aWMgaGV4MnJnYihoZXgpIHtcbiAgICAgICAgLy8gbG9uZyB2ZXJzaW9uXG4gICAgICAgIGxldCByID0gaGV4Lm1hdGNoKC9eIyhbMC05YS1mXXsyfSkoWzAtOWEtZl17Mn0pKFswLTlhLWZdezJ9KSQvaSlcbiAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgIHJldHVybiByLnNsaWNlKDEsIDQpLm1hcCh4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoeCwgMTYpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIC8vIHNob3J0IHZlcnNpb25cbiAgICAgICAgciA9IGhleC5tYXRjaCgvXiMoWzAtOWEtZl0pKFswLTlhLWZdKShbMC05YS1mXSkkL2kpXG4gICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICByZXR1cm4gci5zbGljZSgxLCA0KS5tYXAoeCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDB4MTEgKiBwYXJzZUludCh4LCAxNilcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBzdGF0aWMgcmdiKHIsIGcsIGIpIHtcbiAgICAgICAgcmV0dXJuIHtyLCBnLCBifVxuICAgIH1cblxuICAgIHN0YXRpYyBsZXJwKHJnYjEsIHJnYjIsIGFtb3VudCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcjogTWF0aC5yb3VuZChsZXJwKHJnYjEuciwgcmdiMi5yLCBhbW91bnQpKSxcbiAgICAgICAgICAgIGc6IE1hdGgucm91bmQobGVycChyZ2IxLmcsIHJnYjIuZywgYW1vdW50KSksXG4gICAgICAgICAgICBiOiBNYXRoLnJvdW5kKGxlcnAocmdiMS5iLCByZ2IyLmIsIGFtb3VudCkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IHZpb2xldCgpIHtcbiAgICAgICAgcmV0dXJuIENvbG9ycy5yZ2IybnVtKDg5LCAzNCwgMTMxKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgc3RlZWxibHVlKCkge1xuICAgICAgICByZXR1cm4gQ29sb3JzLnJnYjJudW0oMCwgMTMwLCAxNjQpXG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBvY2hyZSgpIHtcbiAgICAgICAgcmV0dXJuIENvbG9ycy5yZ2IybnVtKDE4MSwgMTU3LCAwKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgdHVycXVvaXNlKCkge1xuICAgICAgICByZXR1cm4gQ29sb3JzLnJnYjJudW0oMzQsIDE2NCwgMTMxKVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgZW1pbmVuY2UoKSB7XG4gICAgICAgIHJldHVybiBDb2xvcnMucmdiMm51bSgxNTAsIDYwLCAxMzQpXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ3ljbGUgZXh0ZW5kcyBBcnJheSB7XG4gICAgY29uc3RydWN0b3IoLi4uaXRlbXMpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICAgICAgICB0aGlzLnB1c2goaXRlbSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluZGV4ID0gMFxuICAgIH1cblxuICAgIG5leHQoKSB7XG4gICAgICAgIGlmICh0aGlzLmluZGV4ID09IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4ID0gMFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzW3RoaXMuaW5kZXgrK11cbiAgICB9XG5cbiAgICBjdXJyZW50KCkge1xuICAgICAgICBpZiAodGhpcy5pbmRleCA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXggPSAwXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXNbdGhpcy5pbmRleF1cbiAgICB9XG59XG5cbi8qKiBTdGF0aWMgbWV0aG9kcyB0byBjb21wdXRlIDJEIHBvaW50cyB3aXRoIHggYW5kIHkgY29vcmRpbmF0ZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBQb2ludHMge1xuICAgIHN0YXRpYyBsZW5ndGgoYSkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGEueCAqIGEueCArIGEueSAqIGEueSlcbiAgICB9XG5cbiAgICBzdGF0aWMgbm9ybWFsaXplKHApIHtcbiAgICAgICAgbGV0IGxlbiA9IHRoaXMubGVuZ3RoKHApXG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5U2NhbGFyKHAsIDEgLyBsZW4pXG4gICAgfVxuXG4gICAgc3RhdGljIG1lYW4oYSwgYikge1xuICAgICAgICByZXR1cm4ge3g6IChhLnggKyBiLngpIC8gMiwgeTogKGEueSArIGIueSkgLyAyfVxuICAgIH1cblxuICAgIHN0YXRpYyBzdWJ0cmFjdChhLCBiKSB7XG4gICAgICAgIHJldHVybiB7eDogYS54IC0gYi54LCB5OiBhLnkgLSBiLnl9XG4gICAgfVxuXG4gICAgc3RhdGljIG11bHRpcGx5KGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIHt4OiBhLnggKiBiLngsIHk6IGEueSAqIGIueX1cbiAgICB9XG5cbiAgICBzdGF0aWMgbXVsdGlwbHlTY2FsYXIoYSwgYikge1xuICAgICAgICByZXR1cm4ge3g6IGEueCAqIGIsIHk6IGEueSAqIGJ9XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZChhLCBiKSB7XG4gICAgICAgIHJldHVybiB7eDogYS54ICsgYi54LCB5OiBhLnkgKyBiLnl9XG4gICAgfVxuXG4gICAgc3RhdGljIG5lZ2F0ZShwKSB7XG4gICAgICAgIHJldHVybiB7eDogLXAueCwgeTogLXAueX1cbiAgICB9XG5cbiAgICBzdGF0aWMgYW5nbGUocDEsIHAyKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHAxLnkgLSBwMi55LCBwMS54IC0gcDIueClcbiAgICB9XG5cbiAgICBzdGF0aWMgYXJjKHAsIGFscGhhLCByYWRpdXMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHAueCArIHJhZGl1cyAqIE1hdGguY29zKGFscGhhKSxcbiAgICAgICAgICAgIHk6IHAueSArIHJhZGl1cyAqIE1hdGguc2luKGFscGhhKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGRpc3RhbmNlKGEsIGIpIHtcbiAgICAgICAgbGV0IGR4ID0gYS54IC0gYi54XG4gICAgICAgIGxldCBkeSA9IGEueSAtIGIueVxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KVxuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tUGFnZVRvTm9kZShlbGVtZW50LCBwKSB7XG4gICAgICAgIC8vICAgIGlmICh3aW5kb3cud2Via2l0Q29udmVydFBvaW50RnJvbVBhZ2VUb05vZGUpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy53ZWJraXRDb252ZXJ0UG9pbnRGcm9tUGFnZVRvTm9kZShlbGVtZW50LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFdlYktpdFBvaW50KHAueCwgcC55KSlcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIHJldHVybiB3aW5kb3cuY29udmVydFBvaW50RnJvbVBhZ2VUb05vZGUoZWxlbWVudCwgcC54LCBwLnkpXG4gICAgfVxuXG4gICAgc3RhdGljIGZyb21Ob2RlVG9QYWdlKGVsZW1lbnQsIHApIHtcbiAgICAgICAgLy8gIGlmICh3aW5kb3cud2Via2l0Q29udmVydFBvaW50RnJvbU5vZGVUb1BhZ2UpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy53ZWJraXRDb252ZXJ0UG9pbnRGcm9tTm9kZVRvUGFnZShlbGVtZW50LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFdlYktpdFBvaW50KHAueCwgcC55KSlcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIHJldHVybiB3aW5kb3cuY29udmVydFBvaW50RnJvbU5vZGVUb1BhZ2UoZWxlbWVudCwgcC54LCBwLnkpXG4gICAgfVxufVxuXG4vKiogU3RhdGljIG1ldGhvZHMgdG8gY29tcHV0ZSBhbmdsZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBBbmdsZSB7XG4gICAgc3RhdGljIG5vcm1hbGl6ZShhbmdsZSkge1xuICAgICAgICBsZXQgdHdvUEkgPSBNYXRoLlBJICogMi4wXG4gICAgICAgIHdoaWxlIChhbmdsZSA+IE1hdGguUEkpIHtcbiAgICAgICAgICAgIGFuZ2xlIC09IHR3b1BJXG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGFuZ2xlIDwgLU1hdGguUEkpIHtcbiAgICAgICAgICAgIGFuZ2xlICs9IHR3b1BJXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuZ2xlXG4gICAgfVxuXG4gICAgc3RhdGljIG5vcm1hbGl6ZURlZ3JlZShhbmdsZSkge1xuICAgICAgICBsZXQgZnVsbCA9IDM2MC4wXG4gICAgICAgIHdoaWxlIChhbmdsZSA+IDE4MC4wKSB7XG4gICAgICAgICAgICBhbmdsZSAtPSBmdWxsXG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGFuZ2xlIDwgLTE4MC4wKSB7XG4gICAgICAgICAgICBhbmdsZSArPSBmdWxsXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuZ2xlXG4gICAgfVxuXG4gICAgc3RhdGljIGRpZmYoYSwgYikge1xuICAgICAgICByZXR1cm4gQW5nbGUubm9ybWFsaXplKE1hdGguYXRhbjIoTWF0aC5zaW4oYSAtIGIpLCBNYXRoLmNvcyhhIC0gYikpKVxuICAgIH1cblxuICAgIHN0YXRpYyBkZWdyZWUycmFkaWFuKGRlZ3JlZSkge1xuICAgICAgICByZXR1cm4gTWF0aC5QSSAqIGRlZ3JlZSAvIDE4MC4wXG4gICAgfVxuXG4gICAgc3RhdGljIHJhZGlhbjJkZWdyZWUocmFkKSB7XG4gICAgICAgIHJldHVybiAxODAuMCAvIE1hdGguUEkgKiByYWRcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50cyB7XG4gICAgc3RhdGljIHNldFN0eWxlKGVsZW1lbnQsIHN0eWxlcykge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gc3R5bGVzKSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlW2tleV0gPSBzdHlsZXNba2V5XVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFkZENsYXNzKGVsZW1lbnQsIGNzc0NsYXNzKSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjc3NDbGFzcylcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVtb3ZlQ2xhc3MoZWxlbWVudCwgY3NzQ2xhc3MpIHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNzc0NsYXNzKVxuICAgIH1cblxuICAgIHN0YXRpYyB0b2dnbGVDbGFzcyhlbGVtZW50LCBjc3NDbGFzcykge1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoY3NzQ2xhc3MpXG4gICAgfVxuXG4gICAgc3RhdGljIGhhc0NsYXNzKGVsZW1lbnQsIGNzc0NsYXNzKSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhjc3NDbGFzcylcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNYXBQcm94eSB7XG4gICAgLyogVGhpcyBjbGFzcyBpcyBuZWVkZWQgaWYgd2Ugd2FudCB0byB1c2UgdGhlIGludGVyYWN0aW9uIGNsYXNzZXNcbiAgICBpbiBGaXJlZm94IDQ1LjggYW5kIG1vZGVybiBCcm93c2Vycy5cblxuICAgIEEgd29ya2Fyb3VuZCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsL2lzc3Vlcy8yMzM0XG4gICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubWFwID0gbmV3IE1hcCgpXG4gICAgfVxuXG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5zaXplXG4gICAgfVxuXG4gICAgZ2V0KGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KGtleSlcbiAgICB9XG5cbiAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuc2V0KGtleSwgdmFsdWUpXG4gICAgfVxuXG4gICAgZGVsZXRlKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuZGVsZXRlKGtleSlcbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLmNsZWFyKClcbiAgICB9XG5cbiAgICBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5oYXMoa2V5KVxuICAgIH1cblxuICAgIGtleXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5rZXlzKClcbiAgICB9XG5cbiAgICB2YWx1ZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC52YWx1ZXMoKVxuICAgIH1cblxuICAgIGVudHJpZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5lbnRyaWVzKClcbiAgICB9XG5cbiAgICBmb3JFYWNoKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5tYXAuZm9yRWFjaChmdW5jKVxuICAgIH1cbn1cblxuLyogQmFzZWQgb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vY3dsZW9uYXJkL2UxMjRkNjMyMzhiZGE3YTNjYmZhICovXG5leHBvcnQgY2xhc3MgUG9seWdvbiB7XG4gICAgLypcbiAgICAgKiAgVGhpcyBpcyB0aGUgUG9seWdvbiBjb25zdHJ1Y3Rvci4gQWxsIHBvaW50cyBhcmUgY2VudGVyLXJlbGF0aXZlLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNlbnRlcikge1xuICAgICAgICB0aGlzLnBvaW50cyA9IG5ldyBBcnJheSgpXG4gICAgICAgIHRoaXMuY2VudGVyID0gY2VudGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiAgUG9pbnQgeCBhbmQgeSB2YWx1ZXMgc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBjZW50ZXIuXG4gICAgICovXG4gICAgYWRkUG9pbnQocCkge1xuICAgICAgICB0aGlzLnBvaW50cy5wdXNoKHApXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiAgUG9pbnQgeCBhbmQgeSB2YWx1ZXMgc2hvdWxkIGJlIGFic29sdXRlIGNvb3JkaW5hdGVzLlxuICAgICAqL1xuICAgIGFkZEFic29sdXRlUG9pbnQocCkge1xuICAgICAgICB0aGlzLnBvaW50cy5wdXNoKHt4OiBwLnggLSB0aGlzLmNlbnRlci54LCB5OiBwLnkgLSB0aGlzLmNlbnRlci55fSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBzaWRlcy4gRXF1YWwgdG8gdGhlIG51bWJlciBvZiB2ZXJ0aWNlcy5cbiAgICAgKi9cbiAgICBnZXROdW1iZXJPZlNpZGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb2ludHMubGVuZ3RoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiByb3RhdGUgdGhlIHBvbHlnb24gYnkgYSBudW1iZXIgb2YgcmFkaWFuc1xuICAgICAqL1xuICAgIHJvdGF0ZShyYWRzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB4ID0gdGhpcy5wb2ludHNbaV0ueFxuICAgICAgICAgICAgbGV0IHkgPSB0aGlzLnBvaW50c1tpXS55XG4gICAgICAgICAgICB0aGlzLnBvaW50c1tpXS54ID0gTWF0aC5jb3MocmFkcykgKiB4IC0gTWF0aC5zaW4ocmFkcykgKiB5XG4gICAgICAgICAgICB0aGlzLnBvaW50c1tpXS55ID0gTWF0aC5zaW4ocmFkcykgKiB4ICsgTWF0aC5jb3MocmFkcykgKiB5XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgICAqICBUaGUgZHJhdyBmdW5jdGlvbiB0YWtlcyBhcyBhIHBhcmFtZXRlciBhIENvbnRleHQgb2JqZWN0IGZyb21cbiAgICAgKiAgYSBDYW52YXMgZWxlbWVudCBhbmQgZHJhd3MgdGhlIHBvbHlnb24gb24gaXQuXG4gICAgICovXG4gICAgZHJhdyhjb250ZXh0LCB7bGluZVdpZHRoID0gMiwgc3Ryb2tlID0gJyMwMDAwMDAnLCBmaWxsID0gbnVsbH0gPSB7fSkge1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpXG4gICAgICAgIGNvbnRleHQubW92ZVRvKFxuICAgICAgICAgICAgdGhpcy5wb2ludHNbMF0ueCArIHRoaXMuY2VudGVyLngsXG4gICAgICAgICAgICB0aGlzLnBvaW50c1swXS55ICsgdGhpcy5jZW50ZXIueVxuICAgICAgICApXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5wb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKFxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzW2ldLnggKyB0aGlzLmNlbnRlci54LFxuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzW2ldLnkgKyB0aGlzLmNlbnRlci55XG4gICAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKVxuICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxuICAgICAgICBpZiAoc3Ryb2tlKSB7XG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gc3Ryb2tlXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbGwpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZmlsbFxuICAgICAgICAgICAgY29udGV4dC5maWxsKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFic29sdXRlUG9pbnRzKCkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gbmV3IEFycmF5KClcbiAgICAgICAgZm9yIChsZXQgcCBvZiB0aGlzLnBvaW50cykge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goUG9pbnRzLmFkZChwLCB0aGlzLmNlbnRlcikpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIGZsYXRBYnNvbHV0ZVBvaW50cygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBBcnJheSgpXG4gICAgICAgIGZvciAobGV0IHAgb2YgdGhpcy5wb2ludHMpIHtcbiAgICAgICAgICAgIGxldCBhID0gUG9pbnRzLmFkZChwLCB0aGlzLmNlbnRlcilcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGEueClcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGEueSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiAgVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIHBvaW50IGlzIGluc2lkZSB0aGUgcG9seWdvbixcbiAgICAgKiAgYW5kIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBjb250YWluc1BvaW50KHBudCkge1xuICAgICAgICBsZXQgbnZlcnQgPSB0aGlzLnBvaW50cy5sZW5ndGhcbiAgICAgICAgbGV0IHRlc3R4ID0gcG50LnhcbiAgICAgICAgbGV0IHRlc3R5ID0gcG50LnlcblxuICAgICAgICBsZXQgdmVydHggPSBuZXcgQXJyYXkoKVxuICAgICAgICBmb3IgKGxldCBxID0gMDsgcSA8IHRoaXMucG9pbnRzLmxlbmd0aDsgcSsrKSB7XG4gICAgICAgICAgICB2ZXJ0eC5wdXNoKHRoaXMucG9pbnRzW3FdLnggKyB0aGlzLmNlbnRlci54KVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZlcnR5ID0gbmV3IEFycmF5KClcbiAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCB0aGlzLnBvaW50cy5sZW5ndGg7IHcrKykge1xuICAgICAgICAgICAgdmVydHkucHVzaCh0aGlzLnBvaW50c1t3XS55ICsgdGhpcy5jZW50ZXIueSlcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpLFxuICAgICAgICAgICAgaiA9IDBcbiAgICAgICAgbGV0IGMgPSBmYWxzZVxuICAgICAgICBmb3IgKGkgPSAwLCBqID0gbnZlcnQgLSAxOyBpIDwgbnZlcnQ7IGogPSBpKyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB2ZXJ0eVtpXSA+IHRlc3R5ICE9IHZlcnR5W2pdID4gdGVzdHkgJiZcbiAgICAgICAgICAgICAgICB0ZXN0eCA8XG4gICAgICAgICAgICAgICAgICAgICh2ZXJ0eFtqXSAtIHZlcnR4W2ldKSAqXG4gICAgICAgICAgICAgICAgICAgICAgICAodGVzdHkgLSB2ZXJ0eVtpXSkgL1xuICAgICAgICAgICAgICAgICAgICAgICAgKHZlcnR5W2pdIC0gdmVydHlbaV0pICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnR4W2ldXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgYyA9ICFjXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNcbiAgICB9XG5cbiAgICBtdWx0aXBseVNjYWxhcihzY2FsZSkge1xuICAgICAgICBsZXQgY2VudGVyID0gUG9pbnRzLm11bHRpcGx5U2NhbGFyKHRoaXMuY2VudGVyLCBzY2FsZSlcbiAgICAgICAgbGV0IGNsb25lID0gbmV3IFBvbHlnb24oY2VudGVyKVxuICAgICAgICBmb3IgKGxldCBwIG9mIHRoaXMucG9pbnRzKSB7XG4gICAgICAgICAgICBjbG9uZS5hZGRQb2ludChQb2ludHMubXVsdGlwbHlTY2FsYXIocCwgc2NhbGUpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbG9uZVxuICAgIH1cblxuICAgIC8qXG4gICAgICogIFRvIGRldGVjdCBpbnRlcnNlY3Rpb24gd2l0aCBhbm90aGVyIFBvbHlnb24gb2JqZWN0LCB0aGlzXG4gICAgICogIGZ1bmN0aW9uIHVzZXMgdGhlIFNlcGFyYXRpbmcgQXhpcyBUaGVvcmVtLiBJdCByZXR1cm5zIGZhbHNlXG4gICAgICogIGlmIHRoZXJlIGlzIG5vIGludGVyc2VjdGlvbiwgb3IgYW4gb2JqZWN0IGlmIHRoZXJlIGlzLiBUaGUgb2JqZWN0XG4gICAgICogIGNvbnRhaW5zIDIgZmllbGRzLCBvdmVybGFwIGFuZCBheGlzLiBNb3ZpbmcgdGhlIHBvbHlnb24gYnkgb3ZlcmxhcFxuICAgICAqICBvbiBheGlzIHdpbGwgZ2V0IHRoZSBwb2x5Z29ucyBvdXQgb2YgaW50ZXJzZWN0aW9uLlxuICAgICAqL1xuICAgIGludGVyc2VjdHNXaXRoKG90aGVyKSB7XG4gICAgICAgIGxldCBheGlzID0ge3g6IDAsIHk6IDB9XG4gICAgICAgIGxldCB0bXAsIG1pbkEsIG1heEEsIG1pbkIsIG1heEJcbiAgICAgICAgbGV0IHNpZGUsIGlcbiAgICAgICAgbGV0IHNtYWxsZXN0ID0gbnVsbFxuICAgICAgICBsZXQgb3ZlcmxhcCA9IDk5OTk5OTk5XG5cbiAgICAgICAgLyogdGVzdCBwb2x5Z29uIEEncyBzaWRlcyAqL1xuICAgICAgICBmb3IgKHNpZGUgPSAwOyBzaWRlIDwgdGhpcy5nZXROdW1iZXJPZlNpZGVzKCk7IHNpZGUrKykge1xuICAgICAgICAgICAgLyogZ2V0IHRoZSBheGlzIHRoYXQgd2Ugd2lsbCBwcm9qZWN0IG9udG8gKi9cbiAgICAgICAgICAgIGlmIChzaWRlID09IDApIHtcbiAgICAgICAgICAgICAgICBheGlzLnggPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50c1t0aGlzLmdldE51bWJlck9mU2lkZXMoKSAtIDFdLnkgLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvaW50c1swXS55XG4gICAgICAgICAgICAgICAgYXhpcy55ID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludHNbMF0ueCAtXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzW3RoaXMuZ2V0TnVtYmVyT2ZTaWRlcygpIC0gMV0ueFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBheGlzLnggPSB0aGlzLnBvaW50c1tzaWRlIC0gMV0ueSAtIHRoaXMucG9pbnRzW3NpZGVdLnlcbiAgICAgICAgICAgICAgICBheGlzLnkgPSB0aGlzLnBvaW50c1tzaWRlXS54IC0gdGhpcy5wb2ludHNbc2lkZSAtIDFdLnhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogbm9ybWFsaXplIHRoZSBheGlzICovXG4gICAgICAgICAgICB0bXAgPSBNYXRoLnNxcnQoYXhpcy54ICogYXhpcy54ICsgYXhpcy55ICogYXhpcy55KVxuICAgICAgICAgICAgYXhpcy54IC89IHRtcFxuICAgICAgICAgICAgYXhpcy55IC89IHRtcFxuXG4gICAgICAgICAgICAvKiBwcm9qZWN0IHBvbHlnb24gQSBvbnRvIGF4aXMgdG8gZGV0ZXJtaW5lIHRoZSBtaW4vbWF4ICovXG4gICAgICAgICAgICBtaW5BID0gbWF4QSA9IHRoaXMucG9pbnRzWzBdLnggKiBheGlzLnggKyB0aGlzLnBvaW50c1swXS55ICogYXhpcy55XG4gICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgdGhpcy5nZXROdW1iZXJPZlNpZGVzKCk7IGkrKykge1xuICAgICAgICAgICAgICAgIHRtcCA9IHRoaXMucG9pbnRzW2ldLnggKiBheGlzLnggKyB0aGlzLnBvaW50c1tpXS55ICogYXhpcy55XG4gICAgICAgICAgICAgICAgaWYgKHRtcCA+IG1heEEpIG1heEEgPSB0bXBcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0bXAgPCBtaW5BKSBtaW5BID0gdG1wXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBjb3JyZWN0IGZvciBvZmZzZXQgKi9cbiAgICAgICAgICAgIHRtcCA9IHRoaXMuY2VudGVyLnggKiBheGlzLnggKyB0aGlzLmNlbnRlci55ICogYXhpcy55XG4gICAgICAgICAgICBtaW5BICs9IHRtcFxuICAgICAgICAgICAgbWF4QSArPSB0bXBcblxuICAgICAgICAgICAgLyogcHJvamVjdCBwb2x5Z29uIEIgb250byBheGlzIHRvIGRldGVybWluZSB0aGUgbWluL21heCAqL1xuICAgICAgICAgICAgbWluQiA9IG1heEIgPVxuICAgICAgICAgICAgICAgIG90aGVyLnBvaW50c1swXS54ICogYXhpcy54ICsgb3RoZXIucG9pbnRzWzBdLnkgKiBheGlzLnlcbiAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPCBvdGhlci5nZXROdW1iZXJPZlNpZGVzKCk7IGkrKykge1xuICAgICAgICAgICAgICAgIHRtcCA9IG90aGVyLnBvaW50c1tpXS54ICogYXhpcy54ICsgb3RoZXIucG9pbnRzW2ldLnkgKiBheGlzLnlcbiAgICAgICAgICAgICAgICBpZiAodG1wID4gbWF4QikgbWF4QiA9IHRtcFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRtcCA8IG1pbkIpIG1pbkIgPSB0bXBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIGNvcnJlY3QgZm9yIG9mZnNldCAqL1xuICAgICAgICAgICAgdG1wID0gb3RoZXIuY2VudGVyLnggKiBheGlzLnggKyBvdGhlci5jZW50ZXIueSAqIGF4aXMueVxuICAgICAgICAgICAgbWluQiArPSB0bXBcbiAgICAgICAgICAgIG1heEIgKz0gdG1wXG5cbiAgICAgICAgICAgIC8qIHRlc3QgaWYgbGluZXMgaW50ZXJzZWN0LCBpZiBub3QsIHJldHVybiBmYWxzZSAqL1xuICAgICAgICAgICAgaWYgKG1heEEgPCBtaW5CIHx8IG1pbkEgPiBtYXhCKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBvID0gbWF4QSA+IG1heEIgPyBtYXhCIC0gbWluQSA6IG1heEEgLSBtaW5CXG4gICAgICAgICAgICAgICAgaWYgKG8gPCBvdmVybGFwKSB7XG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXAgPSBvXG4gICAgICAgICAgICAgICAgICAgIHNtYWxsZXN0ID0ge3g6IGF4aXMueCwgeTogYXhpcy55fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIHRlc3QgcG9seWdvbiBCJ3Mgc2lkZXMgKi9cbiAgICAgICAgZm9yIChzaWRlID0gMDsgc2lkZSA8IG90aGVyLmdldE51bWJlck9mU2lkZXMoKTsgc2lkZSsrKSB7XG4gICAgICAgICAgICAvKiBnZXQgdGhlIGF4aXMgdGhhdCB3ZSB3aWxsIHByb2plY3Qgb250byAqL1xuICAgICAgICAgICAgaWYgKHNpZGUgPT0gMCkge1xuICAgICAgICAgICAgICAgIGF4aXMueCA9XG4gICAgICAgICAgICAgICAgICAgIG90aGVyLnBvaW50c1tvdGhlci5nZXROdW1iZXJPZlNpZGVzKCkgLSAxXS55IC1cbiAgICAgICAgICAgICAgICAgICAgb3RoZXIucG9pbnRzWzBdLnlcbiAgICAgICAgICAgICAgICBheGlzLnkgPVxuICAgICAgICAgICAgICAgICAgICBvdGhlci5wb2ludHNbMF0ueCAtXG4gICAgICAgICAgICAgICAgICAgIG90aGVyLnBvaW50c1tvdGhlci5nZXROdW1iZXJPZlNpZGVzKCkgLSAxXS54XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF4aXMueCA9IG90aGVyLnBvaW50c1tzaWRlIC0gMV0ueSAtIG90aGVyLnBvaW50c1tzaWRlXS55XG4gICAgICAgICAgICAgICAgYXhpcy55ID0gb3RoZXIucG9pbnRzW3NpZGVdLnggLSBvdGhlci5wb2ludHNbc2lkZSAtIDFdLnhcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogbm9ybWFsaXplIHRoZSBheGlzICovXG4gICAgICAgICAgICB0bXAgPSBNYXRoLnNxcnQoYXhpcy54ICogYXhpcy54ICsgYXhpcy55ICogYXhpcy55KVxuICAgICAgICAgICAgYXhpcy54IC89IHRtcFxuICAgICAgICAgICAgYXhpcy55IC89IHRtcFxuXG4gICAgICAgICAgICAvKiBwcm9qZWN0IHBvbHlnb24gQSBvbnRvIGF4aXMgdG8gZGV0ZXJtaW5lIHRoZSBtaW4vbWF4ICovXG4gICAgICAgICAgICBtaW5BID0gbWF4QSA9IHRoaXMucG9pbnRzWzBdLnggKiBheGlzLnggKyB0aGlzLnBvaW50c1swXS55ICogYXhpcy55XG4gICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgdGhpcy5nZXROdW1iZXJPZlNpZGVzKCk7IGkrKykge1xuICAgICAgICAgICAgICAgIHRtcCA9IHRoaXMucG9pbnRzW2ldLnggKiBheGlzLnggKyB0aGlzLnBvaW50c1tpXS55ICogYXhpcy55XG4gICAgICAgICAgICAgICAgaWYgKHRtcCA+IG1heEEpIG1heEEgPSB0bXBcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0bXAgPCBtaW5BKSBtaW5BID0gdG1wXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBjb3JyZWN0IGZvciBvZmZzZXQgKi9cbiAgICAgICAgICAgIHRtcCA9IHRoaXMuY2VudGVyLnggKiBheGlzLnggKyB0aGlzLmNlbnRlci55ICogYXhpcy55XG4gICAgICAgICAgICBtaW5BICs9IHRtcFxuICAgICAgICAgICAgbWF4QSArPSB0bXBcblxuICAgICAgICAgICAgLyogcHJvamVjdCBwb2x5Z29uIEIgb250byBheGlzIHRvIGRldGVybWluZSB0aGUgbWluL21heCAqL1xuICAgICAgICAgICAgbWluQiA9IG1heEIgPVxuICAgICAgICAgICAgICAgIG90aGVyLnBvaW50c1swXS54ICogYXhpcy54ICsgb3RoZXIucG9pbnRzWzBdLnkgKiBheGlzLnlcbiAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPCBvdGhlci5nZXROdW1iZXJPZlNpZGVzKCk7IGkrKykge1xuICAgICAgICAgICAgICAgIHRtcCA9IG90aGVyLnBvaW50c1tpXS54ICogYXhpcy54ICsgb3RoZXIucG9pbnRzW2ldLnkgKiBheGlzLnlcbiAgICAgICAgICAgICAgICBpZiAodG1wID4gbWF4QikgbWF4QiA9IHRtcFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRtcCA8IG1pbkIpIG1pbkIgPSB0bXBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIGNvcnJlY3QgZm9yIG9mZnNldCAqL1xuICAgICAgICAgICAgdG1wID0gb3RoZXIuY2VudGVyLnggKiBheGlzLnggKyBvdGhlci5jZW50ZXIueSAqIGF4aXMueVxuICAgICAgICAgICAgbWluQiArPSB0bXBcbiAgICAgICAgICAgIG1heEIgKz0gdG1wXG5cbiAgICAgICAgICAgIC8qIHRlc3QgaWYgbGluZXMgaW50ZXJzZWN0LCBpZiBub3QsIHJldHVybiBmYWxzZSAqL1xuICAgICAgICAgICAgaWYgKG1heEEgPCBtaW5CIHx8IG1pbkEgPiBtYXhCKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBvID0gbWF4QSA+IG1heEIgPyBtYXhCIC0gbWluQSA6IG1heEEgLSBtaW5CXG4gICAgICAgICAgICAgICAgaWYgKG8gPCBvdmVybGFwKSB7XG4gICAgICAgICAgICAgICAgICAgIG92ZXJsYXAgPSBvXG4gICAgICAgICAgICAgICAgICAgIHNtYWxsZXN0ID0ge3g6IGF4aXMueCwgeTogYXhpcy55fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge292ZXJsYXA6IG92ZXJsYXAgKyAwLjAwMSwgYXhpczogc21hbGxlc3R9XG4gICAgfVxuXG4gICAgc3RhdGljIGZyb21Qb2ludHMocG9pbnRzKSB7XG4gICAgICAgIGxldCBtaW4gPSB7eDogTnVtYmVyLk1BWF9WQUxVRSwgeTogTnVtYmVyLk1BWF9WQUxVRX1cbiAgICAgICAgbGV0IG1heCA9IHt4OiBOdW1iZXIuTUlOX1ZBTFVFLCB5OiBOdW1iZXIuTUlOX1ZBTFVFfVxuICAgICAgICBmb3IgKGxldCBwIG9mIHBvaW50cykge1xuICAgICAgICAgICAgbWluLnggPSBNYXRoLm1pbihwLngsIG1pbi54KVxuICAgICAgICAgICAgbWF4LnggPSBNYXRoLm1heChwLngsIG1heC54KVxuICAgICAgICAgICAgbWluLnkgPSBNYXRoLm1pbihwLnksIG1pbi55KVxuICAgICAgICAgICAgbWF4LnkgPSBNYXRoLm1heChwLnksIG1heC55KVxuICAgICAgICB9XG4gICAgICAgIGxldCBjZW50ZXIgPSBQb2ludHMubWVhbihtaW4sIG1heClcbiAgICAgICAgbGV0IHBvbHlnb24gPSBuZXcgUG9seWdvbihjZW50ZXIpXG4gICAgICAgIGZvciAobGV0IHAgb2YgcG9pbnRzKSB7XG4gICAgICAgICAgICBwb2x5Z29uLmFkZEFic29sdXRlUG9pbnQocClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9seWdvblxuICAgIH1cbn1cbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRzIHtcblxuICAgIHN0YXRpYyBzdG9wKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB9XG5cbiAgICBzdGF0aWMgZXh0cmFjdFBvaW50KGV2ZW50KSB7XG4gICAgICAgIHN3aXRjaChldmVudC5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICAgICAgICBjYXNlICdUb3VjaEV2ZW50JzpcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpPTA7IGk8ZXZlbnQudGFyZ2V0VG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdCA9IGV2ZW50LnRhcmdldFRvdWNoZXNbaV1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHt4OiB0LmNsaWVudFgsIHk6IHQuY2xpZW50WX1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHt4OiBldmVudC5jbGllbnRYLCB5OiBldmVudC5jbGllbnRZfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGlzTW91c2VEb3duKGV2ZW50KSB7XG4gICAgICAgIC8vIEF0dGVtcHRzIHRvIGNsb25lIHRoZSB3aGljaCBhdHRyaWJ1dGUgb2YgZXZlbnRzIGZhaWxlZCBpbiBXZWJLaXQuIE1heVxuICAgICAgICAvLyBiZSB0aGlzIGlzIGEgYnVnIG9yIGEgc2VjdXJpdHkgZmVhdHVyZS4gV29ya2Fyb3VuZDogd2UgaW50cm9kdWNlXG4gICAgICAgIC8vIGEgbW91c2VEb3duU3Vic3RpdHV0ZSBhdHRyaWJ1dGUgdGhhdCBjYW4gYmUgYXNzaWduZWQgdG8gY2xvbmVkXG4gICAgICAgIC8vIGV2ZW50cyBhZnRlciBpbnN0YW50aWF0aW9uLlxuICAgICAgICBpZiAoUmVmbGVjdC5oYXMoZXZlbnQsICdtb3VzZURvd25TdWJzdGl0dXRlJykpXG4gICAgICAgICAgICByZXR1cm4gZXZlbnQubW91c2VEb3duU3Vic3RpdHV0ZVxuICAgICAgICByZXR1cm4gZXZlbnQuYnV0dG9ucyB8fCBldmVudC53aGljaFxuICAgIH1cblxuICAgIHN0YXRpYyBleHRyYWN0VG91Y2hlcyh0YXJnZXRzKSB7XG4gICAgICAgIGxldCB0b3VjaGVzID0gW11cbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPHRhcmdldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB0ID0gdGFyZ2V0c1tpXVxuICAgICAgICAgICAgdG91Y2hlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0YXJnZXRTZWxlY3RvcjogdGhpcy5zZWxlY3Rvcih0LnRhcmdldCksXG4gICAgICAgICAgICAgICAgaWRlbnRpZmllcjogdC5pZGVudGlmaWVyLFxuICAgICAgICAgICAgICAgIHNjcmVlblg6IHQuc2NyZWVuWCxcbiAgICAgICAgICAgICAgICBzY3JlZW5ZOiB0LnNjcmVlblksXG4gICAgICAgICAgICAgICAgY2xpZW50WDogdC5jbGllbnRYLFxuICAgICAgICAgICAgICAgIGNsaWVudFk6IHQuY2xpZW50WSxcbiAgICAgICAgICAgICAgICBwYWdlWDogdC5wYWdlWCxcbiAgICAgICAgICAgICAgICBwYWdlWTogdC5wYWdlWVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG91Y2hlc1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVUb3VjaExpc3QodGFyZ2V0cykge1xuICAgICAgICBsZXQgdG91Y2hlcyA9IFtdXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTx0YXJnZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdCA9IHRhcmdldHNbaV1cbiAgICAgICAgICAgIGxldCB0b3VjaFRhcmdldCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQodC5wYWdlWCwgdC5wYWdlWSlcbiAgICAgICAgICAgIGxldCB0b3VjaCA9IG5ldyBUb3VjaCh1bmRlZmluZWQsIHRvdWNoVGFyZ2V0LCB0LmlkZW50aWZpZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0LnBhZ2VYLCB0LnBhZ2VZLCB0LnNjcmVlblgsIHQuc2NyZWVuWSlcbiAgICAgICAgICAgIHRvdWNoZXMucHVzaCh0b3VjaClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFRvdWNoTGlzdCguLi50b3VjaGVzKVxuICAgIH1cblxuICAgIHN0YXRpYyBleHRyYWN0RXZlbnQodGltZXN0YW1wLCBldmVudCkge1xuICAgICAgICBsZXQgdGFyZ2V0U2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yKGV2ZW50LnRhcmdldClcbiAgICAgICAgbGV0IGluZm9zID0geyB0eXBlOiBldmVudC50eXBlLFxuICAgICAgICAgICAgdGltZTogdGltZXN0YW1wLFxuICAgICAgICAgICAgY29uc3RydWN0b3I6IGV2ZW50LmNvbnN0cnVjdG9yLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHRhcmdldFNlbGVjdG9yOiB0YXJnZXRTZWxlY3RvcixcbiAgICAgICAgICAgICAgICB2aWV3OiBldmVudC52aWV3LFxuICAgICAgICAgICAgICAgIG1vdXNlRG93blN1YnN0aXR1dGU6IGV2ZW50LmJ1dHRvbnMgfHwgZXZlbnQud2hpY2gsIC8vIHdoaWNoIGNhbm5vdCBiZSBjbG9uZWQgZGlyZWN0bHlcbiAgICAgICAgICAgICAgICBidWJibGVzOiBldmVudC5idWJibGVzLFxuICAgICAgICAgICAgICAgIGNhbmNlbGFibGU6IGV2ZW50LmNhbmNlbGFibGUsXG4gICAgICAgICAgICAgICAgc2NyZWVuWDogZXZlbnQuc2NyZWVuWCxcbiAgICAgICAgICAgICAgICBzY3JlZW5ZOiBldmVudC5zY3JlZW5ZLFxuICAgICAgICAgICAgICAgIGNsaWVudFg6IGV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICAgICAgY2xpZW50WTogZXZlbnQuY2xpZW50WSxcbiAgICAgICAgICAgICAgICBsYXllclg6IGV2ZW50LmxheWVyWCxcbiAgICAgICAgICAgICAgICBsYXllclk6IGV2ZW50LmxheWVyWSxcbiAgICAgICAgICAgICAgICBwYWdlWDogZXZlbnQucGFnZVgsXG4gICAgICAgICAgICAgICAgcGFnZVk6IGV2ZW50LnBhZ2VZLFxuICAgICAgICAgICAgICAgIGN0cmxLZXk6IGV2ZW50LmN0cmxLZXksXG4gICAgICAgICAgICAgICAgYWx0S2V5OiBldmVudC5hbHRLZXksXG4gICAgICAgICAgICAgICAgc2hpZnRLZXk6IGV2ZW50LnNoaWZ0S2V5LFxuICAgICAgICAgICAgICAgIG1ldGFLZXk6IGV2ZW50Lm1ldGFLZXl9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LnR5cGUuc3RhcnRzV2l0aCgndG91Y2gnKSkge1xuICAgICAgICAgICAgLy8gT24gU2FmYXJpLVdlYktpdCB0aGUgVG91Y2hFdmVudCBoYXMgbGF5ZXJYLCBsYXllclkgY29vcmRpbmF0ZXNcbiAgICAgICAgICAgIGxldCBkYXRhID0gaW5mb3MuZGF0YVxuICAgICAgICAgICAgZGF0YS50YXJnZXRUb3VjaGVzID0gdGhpcy5leHRyYWN0VG91Y2hlcyhldmVudC50YXJnZXRUb3VjaGVzKVxuICAgICAgICAgICAgZGF0YS5jaGFuZ2VkVG91Y2hlcyA9IHRoaXMuZXh0cmFjdFRvdWNoZXMoZXZlbnQuY2hhbmdlZFRvdWNoZXMpXG4gICAgICAgICAgICBkYXRhLnRvdWNoZXMgPSB0aGlzLmV4dHJhY3RUb3VjaGVzKGV2ZW50LnRvdWNoZXMpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKEV2ZW50cy5kZWJ1Zykge1xuICAgICAgICAgICAgRXZlbnRzLmV4dHJhY3RlZC5wdXNoKHRoaXMudG9MaW5lKGV2ZW50KSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5mb3NcbiAgICB9XG5cbiAgICBzdGF0aWMgY2xvbmVFdmVudCh0eXBlLCBjb25zdHJ1Y3RvciwgZGF0YSkge1xuICAgICAgICBpZiAodHlwZS5zdGFydHNXaXRoKCd0b3VjaCcpKSB7XG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIGZpbmQgdGFyZ2V0IGZyb20gbGF5ZXJYLCBsYXllcllcbiAgICAgICAgICAgIC8vdmFyIHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZGF0YS50YXJnZXRTZWxlY3RvcilcbiAgICAgICAgICAgIC8vIGVsZW1lbnRGcm9tUG9pbnQoZGF0YS5sYXllclgsIGRhdGEubGF5ZXJZKVxuICAgICAgICAgICAgLy9kYXRhLnRhcmdldCA9IHRhcmdldFxuICAgICAgICAgICAgZGF0YS50YXJnZXRUb3VjaGVzID0gdGhpcy5jcmVhdGVUb3VjaExpc3QoZGF0YS50YXJnZXRUb3VjaGVzKVxuICAgICAgICAgICAgZGF0YS5jaGFuZ2VkVG91Y2hlcyA9IHRoaXMuY3JlYXRlVG91Y2hMaXN0KGRhdGEuY2hhbmdlZFRvdWNoZXMpXG4gICAgICAgICAgICBkYXRhLnRvdWNoZXMgPSB0aGlzLmNyZWF0ZVRvdWNoTGlzdChkYXRhLnRvdWNoZXMpXG4gICAgICAgIH1cbiAgICAgICAgLy8gV2UgbmVlZCB0byBmaW5kIHRhcmdldCBmcm9tIHBhZ2VYLCBwYWdlWSB3aGljaCBhcmUgb25seVxuICAgICAgICAvLyBhdmFpbGFibGUgYWZ0ZXIgY29uc3RydWN0aW9uLiBUaGV5IHNlZW0gdG8gZ2V0dGVyIGl0ZW1zLlxuXG4gICAgICAgIGxldCBjbG9uZSA9IFJlZmxlY3QuY29uc3RydWN0KGNvbnN0cnVjdG9yLCBbdHlwZSwgZGF0YV0pXG4gICAgICAgIGNsb25lLm1vdXNlRG93blN1YnN0aXR1dGUgPSBkYXRhLm1vdXNlRG93blN1YnN0aXR1dGVcbiAgICAgICAgcmV0dXJuIGNsb25lXG4gICAgfVxuXG4gICAgc3RhdGljIHNpbXVsYXRlRXZlbnQodHlwZSwgY29uc3RydWN0b3IsIGRhdGEpIHtcbiAgICAgICAgZGF0YS50YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGRhdGEudGFyZ2V0U2VsZWN0b3IpXG4gICAgICAgIGxldCBjbG9uZSA9IHRoaXMuY2xvbmVFdmVudCh0eXBlLCBjb25zdHJ1Y3RvciwgZGF0YSlcbiAgICAgICAgaWYgKGRhdGEudGFyZ2V0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRhdGEudGFyZ2V0LmRpc3BhdGNoRXZlbnQoY2xvbmUpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKEV2ZW50cy5kZWJ1Zykge1xuICAgICAgICAgICAgRXZlbnRzLnNpbXVsYXRlZC5wdXNoKHRoaXMudG9MaW5lKGNsb25lKSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyB0b0xpbmUoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIGAke2V2ZW50LnR5cGV9ICMke2V2ZW50LnRhcmdldC5pZH0gJHtldmVudC5jbGllbnRYfSAke2V2ZW50LmNsaWVudFl9YFxuICAgICAgICBsZXQgcmVzdWx0ID0gZXZlbnQudHlwZVxuICAgICAgICBsZXQgc2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yKGV2ZW50LnRhcmdldClcbiAgICAgICAgcmVzdWx0ICs9ICcgc2VsZWN0b3I6ICcgKyBzZWxlY3RvclxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ICE9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0Nhbm5vdCByZXNvbHZlJywgc2VsZWN0b3IpXG4gICAgICAgIGxldCBrZXlzID0gWydsYXllclgnLCAnbGF5ZXJZJywgJ3BhZ2VYJywgJ3BhZ2VZJywgJ2NsaWVudFgnLCAnY2xpZW50WSddXG4gICAgICAgIGZvcihsZXQga2V5IG9mIGtleXMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9ICcgJyArIGtleSArICc6JyArIGV2ZW50W2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSW52YWxpZCBrZXk6ICcgKyBrZXkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIHN0YXRpYyBjb21wYXJlRXh0cmFjdGVkV2l0aFNpbXVsYXRlZCgpIHtcbiAgICAgICAgdmFyIGRpZmZzID0gMFxuICAgICAgICBpZiAodGhpcy5leHRyYWN0ZWQubGVuZ3RoICE9IHRoaXMuc2ltdWxhdGVkLmxlbmd0aCkge1xuICAgICAgICAgICAgYWxlcnQoJ1VuZXF1YWwgbGVuZ3RoIG9mIGV4dHJhY3RlZCBbJyArIHRoaXMuZXh0cmFjdGVkLmxlbmd0aCArXG4gICAgICAgICAgICAgICAgICAgICddIGFuZCBzaW11bGF0ZWQgZXZlbnRzIFsnICsgdGhpcy5zaW11bGF0ZWQubGVuZ3RoICsgJ10uJylcbiAgICAgICAgICAgIGRpZmZzICs9IDFcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMuZXh0cmFjdGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV4dHJhY3RlZCA9IHRoaXMuZXh0cmFjdGVkW2ldXG4gICAgICAgICAgICAgICAgdmFyIHNpbXVsYXRlZCA9IHRoaXMuc2ltdWxhdGVkW2ldXG4gICAgICAgICAgICAgICAgaWYgKGV4dHJhY3RlZCAhPSBzaW11bGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0V2ZW50cyBkaWZmZXI6JyArIGV4dHJhY3RlZCArICd8JyArIHNpbXVsYXRlZClcbiAgICAgICAgICAgICAgICAgICAgZGlmZnMgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBzZWxlY3Rvcihjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBPcHRpbWFsU2VsZWN0LnNlbGVjdChjb250ZXh0KVxuICAgIH1cblxuICAgIHN0YXRpYyByZXNldCgpIHtcbiAgICAgICAgdGhpcy5leHRyYWN0ZWQgPSBbXVxuICAgICAgICB0aGlzLnNpbXVsYXRlZCA9IFtdXG4gICAgfVxuXG4gICAgc3RhdGljIHJlc2V0U2ltdWxhdGVkKCkge1xuICAgICAgICB0aGlzLnNpbXVsYXRlZCA9IFtdXG4gICAgfVxuXG4gICAgc3RhdGljIHNob3dFeHRyYWN0ZWRFdmVudHMoZXZlbnQpIHtcbiAgICAgICAgaWYgKCFldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucG9wdXAgPT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICAgRWxlbWVudHMuc2V0U3R5bGUoZWxlbWVudCwgeyBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQ4MHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICc2NDBweCcsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdhdXRvJyxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdsaWdodGdyYXknfSlcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudClcbiAgICAgICAgICAgIHRoaXMucG9wdXAgPSBlbGVtZW50XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb3B1cC5pbm5lckhUTUwgPSAnJ1xuICAgICAgICBmb3IobGV0IGxpbmUgb2YgdGhpcy5leHRyYWN0ZWQpIHtcbiAgICAgICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGxpbmVcbiAgICAgICAgICAgIHRoaXMucG9wdXAuYXBwZW5kQ2hpbGQoZGl2KVxuICAgICAgICB9XG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBkaXYuaW5uZXJIVE1MID0gJy0tLS0tLS0tLS0tLSBTaW11bGF0ZWQgLS0tLS0tLS0tLS0nXG4gICAgICAgIHRoaXMucG9wdXAuYXBwZW5kQ2hpbGQoZGl2KVxuICAgICAgICBmb3IobGV0IGxpbmUgb2YgdGhpcy5zaW11bGF0ZWQpIHtcbiAgICAgICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGxpbmVcbiAgICAgICAgICAgIHRoaXMucG9wdXAuYXBwZW5kQ2hpbGQoZGl2KVxuICAgICAgICB9XG4gICAgICAgIEVsZW1lbnRzLnNldFN0eWxlKHRoaXMucG9wdXAsXG4gICAgICAgICAgICAgICAgeyBsZWZ0OiBldmVudC5jbGllbnRYICsgJ3B4JywgdG9wOiBldmVudC5jbGllbnRZICsgJ3B4J30gKVxuICAgIH1cbn1cblxuRXZlbnRzLnBvcHVwID0gbnVsbFxuXG5FdmVudHMuZGVidWcgPSB0cnVlXG5FdmVudHMuZXh0cmFjdGVkID0gW11cbkV2ZW50cy5zaW11bGF0ZWQgPSBbXVxuXG5leHBvcnQgY2xhc3MgRXZlbnRSZWNvcmRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5yZWNvcmRpbmcgPSBbXVxuICAgICAgICB0aGlzLnJlY29yZGVkID0gW11cbiAgICAgICAgdGhpcy5zdGVwID0gMFxuICAgIH1cblxuICAgIHJlY29yZChldmVudCkge1xuICAgICAgICBsZXQgbGVuZ3RoID0gdGhpcy5yZWNvcmRpbmcubGVuZ3RoXG4gICAgICAgIGlmIChsZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBldmVudC50aW1lU3RhbXBcbiAgICAgICAgICAgIEV2ZW50cy5yZXNldCgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgIFx0bGV0IGxhc3QgPSB0aGlzLnJlY29yZGluZ1tsZW5ndGggLSAxXVxuICAgICAgICBcdGlmIChldmVudC50aW1lU3RhbXAgPCBsYXN0LnRpbWUpIHtcbiAgICAgICAgXHRcdGNvbnNvbGUubG9nKCd3YXJuaW5nOiB3cm9uZyB0ZW1wb3JhbCBvcmRlcicpXG4gICAgICAgIFx0fVxuICAgICAgICB9XG4gICAgICAgIGxldCB0ID0gZXZlbnQudGltZVN0YW1wIC0gdGhpcy5zdGFydFRpbWVcbiAgICAgICAgdGhpcy5yZWNvcmRpbmcucHVzaChFdmVudHMuZXh0cmFjdEV2ZW50KHQsIGV2ZW50KSlcbiAgICB9XG5cbiAgICBzdG9wUmVjb3JkaW5nKCkge1xuICAgICAgICB0aGlzLnJlY29yZGVkID0gdGhpcy5yZWNvcmRpbmdcbiAgICAgICAgdGhpcy5yZWNvcmRpbmcgPSBbXVxuICAgICAgICBjb25zb2xlLmxvZygnUmVjb3JkZWQgJyArIHRoaXMucmVjb3JkZWQubGVuZ3RoICsgJyBldmVudHMnKVxuICAgIH1cblxuICAgIHN0YXJ0UmVwbGF5KHdoaWxlQ29uZGl0aW9uPW51bGwsIG9uQ29tcGxldGU9bnVsbCkge1xuICAgICAgICB0aGlzLnN0ZXAgPSAwXG4gICAgICAgIEV2ZW50cy5yZXNldFNpbXVsYXRlZCgpXG4gICAgICAgIHRoaXMucmVwbGF5KHdoaWxlQ29uZGl0aW9uLCBvbkNvbXBsZXRlKVxuICAgIH1cblxuICAgIHJlcGxheSh3aGlsZUNvbmRpdGlvbj1udWxsLCBvbkNvbXBsZXRlPW51bGwpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RlcCA8IHRoaXMucmVjb3JkZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIge3R5cGUsIHRpbWUsIGNvbnN0cnVjdG9yLCBkYXRhfSA9IHRoaXMucmVjb3JkZWRbdGhpcy5zdGVwXVxuICAgICAgICAgICAgRXZlbnRzLnNpbXVsYXRlRXZlbnQodHlwZSwgY29uc3RydWN0b3IsIGRhdGEpXG4gICAgICAgICAgICB0aGlzLnN0ZXAgKz0gMVxuICAgICAgICAgICAgbGV0IGR0ID0gMFxuICAgICAgICAgICAgaWYgKHRoaXMuc3RlcCA8IHRoaXMucmVjb3JkZWQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHQgPSB0aGlzLnJlY29yZGVkW3RoaXMuc3RlcF1cbiAgICAgICAgICAgICAgICBkdCA9IG5leHQudGltZSAtIHRpbWVcbiAgICAgICAgICAgICAgICBpZiAoZHQgPCAwKSB7XG4gICAgICAgICAgICAgICAgXHRjb25zb2xlLmxvZygnd2FybmluZzogd3JvbmcgdGVtcG9yYWwgb3JkZXInKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh3aGlsZUNvbmRpdGlvbiA9PSBudWxsIHx8IHdoaWxlQ29uZGl0aW9uKCkpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVwbGF5KHdoaWxlQ29uZGl0aW9uLCBvbkNvbXBsZXRlKSwgTWF0aC5yb3VuZChkdCkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgIFx0Y29uc29sZS5sb2coJ1BsYXllZCAnICsgdGhpcy5zdGVwICsgJyBldmVudHMnICsgb25Db21wbGV0ZSlcbiAgICAgICAgXHRpZiAob25Db21wbGV0ZSAhPSBudWxsKSB7XG4gICAgICAgIFx0ICAgIG9uQ29tcGxldGUoKVxuICAgICAgICBcdH1cbiAgICAgICAgICAgLy8gRXZlbnRzLmNvbXBhcmVFeHRyYWN0ZWRXaXRoU2ltdWxhdGVkKClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIiwiLy8gSW4gb3JkZXIgdG8gdGVzdCB0aGlzIGludGVyZmFjZSBpbXBsZW1lbnRhdGlvbiBydW4ganNjIGludGVyZmFjZS5qc1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnRlcmZhY2Uge1xuICAgIC8vIEFic3RyYWN0IGludGVyZmFjZSB0aGF0IHNob3VsZCBiZSBleHRlbmRlZCBpbiBpbnRlcmZhY2Ugc3ViY2xhc3Nlcy5cbiAgICAvLyBCeSBjb252ZW50aW9uIGFsbCBpbnRlcmZhY2VzIHNob3VsZCBzdGFydCB3aXRoIGFuIHVwcGVyICdJJ1xuXG4gICAgc3RhdGljIGltcGxlbWVudGF0aW9uRXJyb3Ioa2xhc3MpIHtcbiAgICAgICAgbGV0IGludGVyZmFjZUtleXMgPSBSZWZsZWN0Lm93bktleXModGhpcy5wcm90b3R5cGUpXG4gICAgICAgIGxldCBjbGFzc0tleXMgPSBSZWZsZWN0Lm93bktleXMoa2xhc3MucHJvdG90eXBlKVxuICAgICAgICBmb3IobGV0IGtleSBvZiBpbnRlcmZhY2VLZXlzKSB7XG4gICAgICAgICAgICBsZXQgaW50ZXJmYWNlRGVzYyA9IHRoaXMucHJvdG90eXBlW2tleV1cbiAgICAgICAgICAgIGxldCBjbGFzc0Rlc2MgPSBrbGFzcy5wcm90b3R5cGVba2V5XVxuICAgICAgICAgICAgaWYgKHR5cGVvZihjbGFzc0Rlc2MpID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICAgIHJldHVybiAnTWlzc2luZyAnICsga2V5XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBzdGF0aWMgaW1wbGVtZW50ZWRCeShrbGFzcykge1xuICAgICAgICAvLyBJbiB0aGUgZmlyc3Qgc3RlcCBvbmx5IGNoZWNrcyB3aGV0aGVyIHRoZSBtZXRob2RzIG9mIHRoaXNcbiAgICAgICAgLy8gaW50ZXJmYWNlIGFyZSBhbGwgaW1wbGVtZW50ZWQgYnkgdGhlIGdpdmVuIGNsYXNzXG4gICAgICAgIGxldCBlcnJvciA9IHRoaXMuaW1wbGVtZW50YXRpb25FcnJvcihrbGFzcylcbiAgICAgICAgcmV0dXJuIGVycm9yID09IG51bGxcbiAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogU3BlY2lmeSBvcHRpb25hbCBtZXRob2RzXG4vLyAgICAgc3RhdGljIG9wdGlvbmFsTWV0aG9kcygpIHtcbi8vICAgICAgICAgcmV0dXJuIFt0aGlzLm9uTW91c2VXaGVlbF1cbi8vICAgICB9XG59XG4iLCJpbXBvcnQgSW50ZXJmYWNlIGZyb20gJy4vaW50ZXJmYWNlLmpzJ1xuaW1wb3J0IHtQb2ludHMsIEFuZ2xlLCBNYXBQcm94eX0gZnJvbSAnLi91dGlscy5qcydcbmltcG9ydCBFdmVudHMgZnJvbSAnLi9ldmVudHMuanMnXG5cbi8qKiBJbnRlcmFjdGlvbiBwYXR0ZXJuc1xuXG4gICAgU2VlIGludGVyYWN0aW9uLmh0bWwgZm9yIGV4cGxhbmF0aW9uXG4qL1xuXG5leHBvcnQgY2xhc3MgSUludGVyYWN0aW9uVGFyZ2V0IGV4dGVuZHMgSW50ZXJmYWNlIHtcbiAgICBjYXB0dXJlKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdHJ1ZVxuICAgIH1cblxuICAgIG9uU3RhcnQoZXZlbnQsIGludGVyYWN0aW9uKSB7fVxuICAgIG9uTW92ZShldmVudCwgaW50ZXJhY3Rpb24pIHt9XG4gICAgb25FbmQoZXZlbnQsIGludGVyYWN0aW9uKSB7fVxuXG4gICAgb25Nb3VzZVdoZWVsKGV2ZW50KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgSUludGVyYWN0aW9uTWFwcGVyVGFyZ2V0IGV4dGVuZHMgSW50ZXJmYWNlIHtcbiAgICBjYXB0dXJlKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdHJ1ZVxuICAgIH1cblxuICAgIGZpbmRUYXJnZXQoZXZlbnQsIGxvY2FsLCBnbG9iYWwpIHtcbiAgICAgICAgcmV0dXJuIElJbnRlcmFjdGlvblRhcmdldFxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBvaW50TWFwIGV4dGVuZHMgTWFwUHJveHkge1xuICAgIC8vIENvbGxlY3RzIHRvdWNoIHBvaW50cywgbW91c2UgY29vcmRpbmF0ZXMsIGV0Yy4gYXMga2V5IHZhbHVlIHBhaXJzLlxuICAgIC8vIEtleXMgYXJlIHBvaW50ZXIgYW5kIHRvdWNoIGlkcywgdGhlIHNwZWNpYWwgXCJtb3VzZVwiIGtleS5cbiAgICAvLyBWYWx1ZXMgYXJlIHBvaW50cywgaS5lLiBhbGwgb2JqZWN0cyB3aXRoIG51bWVyaWMgeCBhbmQgeSBwcm9wZXJ0aWVzLlxuICAgIGNvbnN0cnVjdG9yKHBvaW50cyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHBvaW50cykge1xuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCBwb2ludHNba2V5XSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBsZXQgcG9pbnRzID0gW11cbiAgICAgICAgZm9yIChsZXQga2V5IG9mIHRoaXMua2V5cygpKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmdldChrZXkpXG4gICAgICAgICAgICBwb2ludHMucHVzaChgJHtrZXl9Ont4OiR7dmFsdWUueH0sIHk6JHt2YWx1ZS55fX1gKVxuICAgICAgICB9XG4gICAgICAgIGxldCBhdHRycyA9IHBvaW50cy5qb2luKCcsICcpXG4gICAgICAgIHJldHVybiBgW1BvaW50TWFwICR7YXR0cnN9XWBcbiAgICB9XG5cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBQb2ludE1hcCgpXG4gICAgICAgIGZvciAobGV0IGtleSBvZiB0aGlzLmtleXMoKSkge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5nZXQoa2V5KVxuICAgICAgICAgICAgcmVzdWx0LnNldChrZXksIHt4OiB2YWx1ZS54LCB5OiB2YWx1ZS55fSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgZmFydGhlc3RzKCkge1xuICAgICAgICBpZiAodGhpcy5zaXplID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHBhaXJzID0gW11cbiAgICAgICAgZm9yIChsZXQgcCBvZiB0aGlzLnZhbHVlcygpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBxIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgICAgICBwYWlycy5wdXNoKFtwLCBxXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgc29ydGVkID0gcGFpcnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFBvaW50cy5kaXN0YW5jZShiWzBdLCBiWzFdKSAtIFBvaW50cy5kaXN0YW5jZShhWzBdLCBhWzFdKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gc29ydGVkWzBdXG4gICAgfVxuXG4gICAgbWVhbigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2l6ZSA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgICAgIGxldCB4ID0gMC4wLFxuICAgICAgICAgICAgeSA9IDAuMFxuICAgICAgICBmb3IgKGxldCBwIG9mIHRoaXMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIHggKz0gcC54XG4gICAgICAgICAgICB5ICs9IHAueVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7eDogeCAvIHRoaXMuc2l6ZSwgeTogeSAvIHRoaXMuc2l6ZX1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnRlcmFjdGlvbkRlbHRhIHtcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCB6b29tLCByb3RhdGUsIGFib3V0KSB7XG4gICAgICAgIHRoaXMueCA9IHhcbiAgICAgICAgdGhpcy55ID0geVxuICAgICAgICB0aGlzLnpvb20gPSB6b29tXG4gICAgICAgIHRoaXMucm90YXRlID0gcm90YXRlXG4gICAgICAgIHRoaXMuYWJvdXQgPSBhYm91dFxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBsZXQgdmFsdWVzID0gW11cbiAgICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMpKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzW2tleV1cbiAgICAgICAgICAgIGlmIChrZXkgPT0gJ2Fib3V0Jykge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKGAke2tleX06e3g6JHt2YWx1ZS54fSwgeToke3ZhbHVlLnl9fWApXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKGAke2tleX06JHt2YWx1ZX1gKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBhdHRycyA9IHZhbHVlcy5qb2luKCcsICcpXG4gICAgICAgIHJldHVybiBgW0ludGVyYWN0aW9uRGVsdGEgJHthdHRyc31dYFxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEludGVyYWN0aW9uUG9pbnRzIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQgPSBudWxsKSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50XG4gICAgICAgIHRoaXMuY3VycmVudCA9IG5ldyBQb2ludE1hcCgpXG4gICAgICAgIHRoaXMucHJldmlvdXMgPSBuZXcgUG9pbnRNYXAoKVxuICAgICAgICB0aGlzLnN0YXJ0ID0gbmV3IFBvaW50TWFwKClcbiAgICAgICAgdGhpcy5lbmRlZCA9IG5ldyBQb2ludE1hcCgpXG4gICAgICAgIHRoaXMudGltZXN0YW1wcyA9IG5ldyBNYXAoKVxuICAgIH1cblxuICAgIG1vdmVkKGtleSkge1xuICAgICAgICBsZXQgY3VycmVudCA9IHRoaXMuY3VycmVudC5nZXQoa2V5KVxuICAgICAgICBsZXQgcHJldmlvdXMgPSB0aGlzLnByZXZpb3VzLmdldChrZXkpXG4gICAgICAgIHJldHVybiBQb2ludHMuc3VidHJhY3QoY3VycmVudCwgcHJldmlvdXMpXG4gICAgfVxuXG4gICAgbW92ZSgpIHtcbiAgICAgICAgbGV0IGN1cnJlbnQgPSB0aGlzLmN1cnJlbnQubWVhbigpXG4gICAgICAgIGxldCBwcmV2aW91cyA9IHRoaXMucHJldmlvdXMubWVhbigpXG4gICAgICAgIHJldHVybiBQb2ludHMuc3VidHJhY3QoY3VycmVudCwgcHJldmlvdXMpXG4gICAgfVxuXG4gICAgZGVsdGEoKSB7XG4gICAgICAgIHZhciBjdXJyZW50ID0gW11cbiAgICAgICAgdmFyIHByZXZpb3VzID0gW11cbiAgICAgICAgZm9yIChsZXQga2V5IG9mIHRoaXMuY3VycmVudC5rZXlzKCkpIHtcbiAgICAgICAgICAgIGxldCBjID0gdGhpcy5jdXJyZW50LmdldChrZXkpXG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2aW91cy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBwID0gdGhpcy5wcmV2aW91cy5nZXQoa2V5KVxuICAgICAgICAgICAgICAgIGN1cnJlbnQucHVzaChjKVxuICAgICAgICAgICAgICAgIHByZXZpb3VzLnB1c2gocClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudC5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnQubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgICAgIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnQuZmFydGhlc3RzKClcbiAgICAgICAgICAgICAgICBwcmV2aW91cyA9IHRoaXMucHJldmlvdXMuZmFydGhlc3RzKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBjMSA9IGN1cnJlbnRbMF1cbiAgICAgICAgICAgIGxldCBjMiA9IGN1cnJlbnRbMV1cblxuICAgICAgICAgICAgbGV0IHAxID0gcHJldmlvdXNbMF1cbiAgICAgICAgICAgIGxldCBwMiA9IHByZXZpb3VzWzFdXG5cbiAgICAgICAgICAgIGxldCBjbSA9IFBvaW50cy5tZWFuKGMxLCBjMilcbiAgICAgICAgICAgIGxldCBwbSA9IFBvaW50cy5tZWFuKHAxLCBwMilcblxuICAgICAgICAgICAgbGV0IGRlbHRhID0gUG9pbnRzLnN1YnRyYWN0KGNtLCBwbSlcbiAgICAgICAgICAgIGxldCB6b29tID0gMS4wXG4gICAgICAgICAgICBsZXQgZGlzdGFuY2UxID0gUG9pbnRzLmRpc3RhbmNlKHAxLCBwMilcbiAgICAgICAgICAgIGxldCBkaXN0YW5jZTIgPSBQb2ludHMuZGlzdGFuY2UoYzEsIGMyKVxuICAgICAgICAgICAgaWYgKGRpc3RhbmNlMSAhPSAwICYmIGRpc3RhbmNlMiAhPSAwKSB7XG4gICAgICAgICAgICAgICAgem9vbSA9IGRpc3RhbmNlMiAvIGRpc3RhbmNlMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGFuZ2xlMSA9IFBvaW50cy5hbmdsZShjMiwgYzEpXG4gICAgICAgICAgICBsZXQgYW5nbGUyID0gUG9pbnRzLmFuZ2xlKHAyLCBwMSlcbiAgICAgICAgICAgIGxldCBhbHBoYSA9IEFuZ2xlLmRpZmYoYW5nbGUxLCBhbmdsZTIpXG4gICAgICAgICAgICByZXR1cm4gbmV3IEludGVyYWN0aW9uRGVsdGEoZGVsdGEueCwgZGVsdGEueSwgem9vbSwgYWxwaGEsIGNtKVxuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGxldCBkZWx0YSA9IFBvaW50cy5zdWJ0cmFjdChjdXJyZW50WzBdLCBwcmV2aW91c1swXSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgSW50ZXJhY3Rpb25EZWx0YShkZWx0YS54LCBkZWx0YS55LCAxLjAsIDAuMCwgY3VycmVudFswXSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIHVwZGF0ZShrZXksIHBvaW50KSB7XG4gICAgICAgIC8vIFJldHVybnMgdHJ1ZSBpZmYgdGhlIGtleSBpcyBuZXdcbiAgICAgICAgdGhpcy5jdXJyZW50LnNldChrZXksIHBvaW50KVxuICAgICAgICBpZiAoIXRoaXMuc3RhcnQuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQuc2V0KGtleSwgcG9pbnQpXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzLnNldChrZXksIHBvaW50KVxuICAgICAgICAgICAgdGhpcy50aW1lc3RhbXBzLnNldChrZXksIHBlcmZvcm1hbmNlLm5vdygpKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICB1cGRhdGVQcmV2aW91cygpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIHRoaXMuY3VycmVudC5rZXlzKCkpIHtcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXMuc2V0KGtleSwgdGhpcy5jdXJyZW50LmdldChrZXkpKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RvcChrZXksIHBvaW50KSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnQuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5kZWxldGUoa2V5KVxuICAgICAgICAgICAgdGhpcy5wcmV2aW91cy5kZWxldGUoa2V5KVxuICAgICAgICAgICAgdGhpcy5lbmRlZC5zZXQoa2V5LCBwb2ludClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmlzaChrZXksIHBvaW50KSB7XG4gICAgICAgIHRoaXMuY3VycmVudC5kZWxldGUoa2V5KVxuICAgICAgICB0aGlzLnByZXZpb3VzLmRlbGV0ZShrZXkpXG4gICAgICAgIHRoaXMuc3RhcnQuZGVsZXRlKGtleSlcbiAgICAgICAgdGhpcy50aW1lc3RhbXBzLmRlbGV0ZShrZXkpXG4gICAgICAgIHRoaXMuZW5kZWQuZGVsZXRlKGtleSlcbiAgICB9XG5cbiAgICBpc0ZpbmlzaGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50LnNpemUgPT0gMFxuICAgIH1cblxuICAgIGlzTm9Mb25nZXJUd29GaW5nZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZXZpb3VzLnNpemUgPiAxICYmIHRoaXMuY3VycmVudC5zaXplIDwgMlxuICAgIH1cblxuICAgIGlzVGFwKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuaXNUYXAoa2V5KVxuICAgIH1cblxuICAgIGlzTG9uZ1ByZXNzKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuaXNMb25nUHJlc3Moa2V5KVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEludGVyYWN0aW9uIGV4dGVuZHMgSW50ZXJhY3Rpb25Qb2ludHMge1xuICAgIGNvbnN0cnVjdG9yKHRhcERpc3RhbmNlID0gMTAsIGxvbmdQcmVzc1RpbWUgPSA1MDAuMCkge1xuICAgICAgICBzdXBlcigpXG4gICAgICAgIHRoaXMudGFwRGlzdGFuY2UgPSB0YXBEaXN0YW5jZVxuICAgICAgICB0aGlzLmxvbmdQcmVzc1RpbWUgPSBsb25nUHJlc3NUaW1lXG4gICAgICAgIHRoaXMudGFyZ2V0cyA9IG5ldyBNYXAoKVxuICAgICAgICB0aGlzLnN1YkludGVyYWN0aW9ucyA9IG5ldyBNYXAoKSAvLyB0YXJnZXQ6T2JqZWN0IDogSW50ZXJhY3Rpb25Qb2ludHNcbiAgICB9XG5cbiAgICBzdG9wKGtleSwgcG9pbnQpIHtcbiAgICAgICAgc3VwZXIuc3RvcChrZXksIHBvaW50KVxuICAgICAgICBmb3IgKGxldCBwb2ludHMgb2YgdGhpcy5zdWJJbnRlcmFjdGlvbnMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIHBvaW50cy5zdG9wKGtleSwgcG9pbnQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRUYXJnZXQoa2V5LCB0YXJnZXQpIHtcbiAgICAgICAgdGhpcy50YXJnZXRzLnNldChrZXksIHRhcmdldClcbiAgICAgICAgdGhpcy5zdWJJbnRlcmFjdGlvbnMuc2V0KHRhcmdldCwgbmV3IEludGVyYWN0aW9uUG9pbnRzKHRoaXMpKVxuICAgIH1cblxuICAgIHJlbW92ZVRhcmdldChrZXkpIHtcbiAgICAgICAgbGV0IHRhcmdldCA9IHRoaXMudGFyZ2V0cy5nZXQoa2V5KVxuICAgICAgICB0aGlzLnRhcmdldHMuZGVsZXRlKGtleSlcbiAgICAgICAgLy8gT25seSByZW1vdmUgdGFyZ2V0IGlmIG5vIGtleXMgYXJlIHJlZmVyaW5nIHRvIHRoZSB0YXJnZXRcbiAgICAgICAgbGV0IHJlbW92ZSA9IHRydWVcbiAgICAgICAgZm9yIChsZXQgdCBvZiB0aGlzLnRhcmdldHMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IHQpIHtcbiAgICAgICAgICAgICAgICByZW1vdmUgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZW1vdmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3ViSW50ZXJhY3Rpb25zLmRlbGV0ZSh0YXJnZXQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5pc2goa2V5LCBwb2ludCkge1xuICAgICAgICBzdXBlci5maW5pc2goa2V5LCBwb2ludClcbiAgICAgICAgdGhpcy5yZW1vdmVUYXJnZXQoa2V5KVxuICAgIH1cblxuICAgIG1hcEludGVyYWN0aW9uKHBvaW50cywgYXNwZWN0cywgbWFwcGluZ0Z1bmMpIHtcbiAgICAgICAgLy8gTWFwIGNlbnRyYWxseSByZWdpc3RlcmVkIHBvaW50cyB0byB0YXJnZXQgaW50ZXJhY3Rpb25zXG4gICAgICAgIC8vIFJldHVybnMgYW4gYXJyYXkgb2YgW3RhcmdldCwgdXBkYXRlZCBzdWJJbnRlcmFjdGlvbl0gcGFpcnNcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBNYXAoKVxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gcG9pbnRzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy50YXJnZXRzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldCA9IHRoaXMudGFyZ2V0cy5nZXQoa2V5KVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN1YkludGVyYWN0aW9ucy5oYXModGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW50ZXJhY3Rpb24gPSB0aGlzLnN1YkludGVyYWN0aW9ucy5nZXQodGFyZ2V0KVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBhc3BlY3Qgb2YgYXNwZWN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvaW50TWFwID0gdGhpc1thc3BlY3RdXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9pbnQgPSBwb2ludE1hcC5nZXQoa2V5KVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1hcHBlZCA9IG1hcHBpbmdGdW5jKHBvaW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJhY3Rpb25bYXNwZWN0XS5zZXQoa2V5LCBtYXBwZWQpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnNldCh0YXJnZXQsIGludGVyYWN0aW9uKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgfVxuXG4gICAgaXNUYXAoa2V5KSB7XG4gICAgICAgIGxldCBlbmRlZCA9IHRoaXMuZW5kZWQuZ2V0KGtleSlcbiAgICAgICAgbGV0IHN0YXJ0ID0gdGhpcy5zdGFydC5nZXQoa2V5KVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBzdGFydCAmJlxuICAgICAgICAgICAgZW5kZWQgJiZcbiAgICAgICAgICAgIFBvaW50cy5kaXN0YW5jZShlbmRlZCwgc3RhcnQpIDwgdGhpcy50YXBEaXN0YW5jZVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCB0MSA9IHRoaXMudGltZXN0YW1wcy5nZXQoa2V5KVxuICAgICAgICAgICAgbGV0IHRvb2tMb25nID0gcGVyZm9ybWFuY2Uubm93KCkgPiB0MSArIHRoaXMubG9uZ1ByZXNzVGltZVxuICAgICAgICAgICAgaWYgKHRvb2tMb25nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlzQW55VGFwKCkge1xuICAgICAgICBmb3IgKGxldCBrZXkgb2YgdGhpcy5lbmRlZC5rZXlzKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVGFwKGtleSkpIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgaXNMb25nUHJlc3Moa2V5KSB7XG4gICAgICAgIGxldCBlbmRlZCA9IHRoaXMuZW5kZWQuZ2V0KGtleSlcbiAgICAgICAgbGV0IHN0YXJ0ID0gdGhpcy5zdGFydC5nZXQoa2V5KVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICBzdGFydCAmJlxuICAgICAgICAgICAgZW5kZWQgJiZcbiAgICAgICAgICAgIFBvaW50cy5kaXN0YW5jZShlbmRlZCwgc3RhcnQpIDwgdGhpcy50YXBEaXN0YW5jZVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCB0MSA9IHRoaXMudGltZXN0YW1wcy5nZXQoa2V5KVxuICAgICAgICAgICAgbGV0IHRvb2tMb25nID0gcGVyZm9ybWFuY2Uubm93KCkgPiB0MSArIHRoaXMubG9uZ1ByZXNzVGltZVxuICAgICAgICAgICAgaWYgKHRvb2tMb25nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlzQW55TG9uZ1ByZXNzKCkge1xuICAgICAgICBmb3IgKGxldCBrZXkgb2YgdGhpcy5lbmRlZC5rZXlzKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9uZ1ByZXNzKGtleSkpIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgaXNTdHlsdXMoa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkgPT09ICdzdHlsdXMnXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW50ZXJhY3Rpb25EZWxlZ2F0ZSB7XG4gICAgLy8gTG9uZyBwcmVzczogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xOTMwODk1L2hvdy1sb25nLWlzLXRoZS1ldmVudC1vbmxvbmdwcmVzcy1pbi10aGUtYW5kcm9pZFxuICAgIC8vIFN0eWx1cyBzdXBwb3J0OiBodHRwczovL3czYy5naXRodWIuaW8vdG91Y2gtZXZlbnRzL1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGVsZW1lbnQsXG4gICAgICAgIHRhcmdldCxcbiAgICAgICAge21vdXNlV2hlZWxFbGVtZW50ID0gbnVsbCwgZGVidWcgPSBmYWxzZX0gPSB7fVxuICAgICkge1xuICAgICAgICB0aGlzLmRlYnVnID0gZGVidWdcbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbiA9IG5ldyBJbnRlcmFjdGlvbigpXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICAgICAgdGhpcy5tb3VzZVdoZWVsRWxlbWVudCA9IG1vdXNlV2hlZWxFbGVtZW50IHx8IGVsZW1lbnRcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXRcbiAgICAgICAgdGhpcy5zZXR1cEludGVyYWN0aW9uKClcbiAgICB9XG5cbiAgICBzZXR1cEludGVyYWN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgbGV0IGVycm9yID0gdGhpcy50YXJnZXRJbnRlcmZhY2UuaW1wbGVtZW50YXRpb25FcnJvcihcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5jb25zdHJ1Y3RvclxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIElJbnRlcmFjdGlvblRhcmdldDogJyArIGVycm9yKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0dXBUb3VjaEludGVyYWN0aW9uKClcbiAgICAgICAgdGhpcy5zZXR1cE1vdXNlV2hlZWxJbnRlcmFjdGlvbigpXG4gICAgfVxuXG4gICAgZ2V0IHRhcmdldEludGVyZmFjZSgpIHtcbiAgICAgICAgcmV0dXJuIElJbnRlcmFjdGlvblRhcmdldFxuICAgIH1cblxuICAgIHNldHVwVG91Y2hJbnRlcmFjdGlvbigpIHtcbiAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnRcbiAgICAgICAgbGV0IHVzZUNhcHR1cmUgPSB0cnVlXG4gICAgICAgIGlmICh3aW5kb3cuUG9pbnRlckV2ZW50KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kZWJ1ZykgY29uc29sZS5sb2coJ1BvaW50ZXIgQVBJJyArIHdpbmRvdy5Qb2ludGVyRXZlbnQpXG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgJ3BvaW50ZXJkb3duJyxcbiAgICAgICAgICAgICAgICBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVidWcpIGNvbnNvbGUubG9nKCdwb2ludGVyZG93bicsIGUucG9pbnRlcklkKVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jYXB0dXJlKGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldFBvaW50ZXJDYXB0dXJlKGUucG9pbnRlcklkKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN0YXJ0KGUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZUNhcHR1cmVcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAncG9pbnRlcm1vdmUnLFxuICAgICAgICAgICAgICAgIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWJ1ZykgY29uc29sZS5sb2coJ3BvaW50ZXJtb3ZlJywgZS5wb2ludGVySWQpXG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucG9pbnRlclR5cGUgPT0gJ3RvdWNoJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKGUucG9pbnRlclR5cGUgPT0gJ21vdXNlJyAmJiBFdmVudHMuaXNNb3VzZURvd24oZSkpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5jYXB0dXJlKGUpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWJ1ZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncG9pbnRlcm1vdmUgY2FwdHVyZWQnLCBlLnBvaW50ZXJJZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Nb3ZlKGUpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZUNhcHR1cmVcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAncG9pbnRlcnVwJyxcbiAgICAgICAgICAgICAgICBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVidWcpIGNvbnNvbGUubG9nKCdwb2ludGVydXAnKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRW5kKGUpXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucmVsZWFzZVBvaW50ZXJDYXB0dXJlKGUucG9pbnRlcklkKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXNlQ2FwdHVyZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICdwb2ludGVyY2FuY2VsJyxcbiAgICAgICAgICAgICAgICBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVidWcpIGNvbnNvbGUubG9nKCdwb2ludGVyY2FuY2VsJylcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVuZChlKVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbGVhc2VQb2ludGVyQ2FwdHVyZShlLnBvaW50ZXJJZClcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZUNhcHR1cmVcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAncG9pbnRlcmxlYXZlJyxcbiAgICAgICAgICAgICAgICBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVidWcpIGNvbnNvbGUubG9nKCdwb2ludGVybGVhdmUnKVxuICAgICAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgPT0gZWxlbWVudCkgdGhpcy5vbkVuZChlKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXNlQ2FwdHVyZVxuICAgICAgICAgICAgKVxuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5Ub3VjaEV2ZW50KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kZWJ1ZykgY29uc29sZS5sb2coJ1RvdWNoIEFQSScpXG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgJ3RvdWNoc3RhcnQnLFxuICAgICAgICAgICAgICAgIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWJ1ZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0b3VjaHN0YXJ0JywgdGhpcy50b3VjaFBvaW50cyhlKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FwdHVyZShlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdG91Y2ggb2YgZS5jaGFuZ2VkVG91Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25TdGFydCh0b3VjaClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXNlQ2FwdHVyZVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICd0b3VjaG1vdmUnLFxuICAgICAgICAgICAgICAgIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWJ1ZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0b3VjaG1vdmUnLCB0aGlzLnRvdWNoUG9pbnRzKGUpLCBlKVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB0b3VjaCBvZiBlLmNoYW5nZWRUb3VjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTW92ZSh0b3VjaClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB0b3VjaCBvZiBlLnRhcmdldFRvdWNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25Nb3ZlKHRvdWNoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1c2VDYXB0dXJlXG4gICAgICAgICAgICApXG4gICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgJ3RvdWNoZW5kJyxcbiAgICAgICAgICAgICAgICBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVidWcpIGNvbnNvbGUubG9nKCd0b3VjaGVuZCcsIHRoaXMudG91Y2hQb2ludHMoZSkpXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHRvdWNoIG9mIGUuY2hhbmdlZFRvdWNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25FbmQodG91Y2gpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZUNhcHR1cmVcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAndG91Y2hjYW5jZWwnLFxuICAgICAgICAgICAgICAgIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWJ1ZylcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0b3VjaGNhbmNlbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS50YXJnZXRUb3VjaGVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLmNoYW5nZWRUb3VjaGVzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB0b3VjaCBvZiBlLmNoYW5nZWRUb3VjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRW5kKHRvdWNoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB1c2VDYXB0dXJlXG4gICAgICAgICAgICApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kZWJ1ZykgY29uc29sZS5sb2coJ01vdXNlIEFQSScpXG5cbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAnbW91c2Vkb3duJyxcbiAgICAgICAgICAgICAgICBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVidWcpIGNvbnNvbGUubG9nKCdtb3VzZWRvd24nLCBlKVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jYXB0dXJlKGUpKSB0aGlzLm9uU3RhcnQoZSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZUNhcHR1cmVcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAnbW91c2Vtb3ZlJyxcbiAgICAgICAgICAgICAgICBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRG93IHdlIG9ubHkgdXNlIG1vdmUgZXZlbnRzIGlmIHRoZSBtb3VzZSBpcyBkb3duP1xuICAgICAgICAgICAgICAgICAgICAvLyBIT3ZlciBlZmZlY3RzIGhhdmUgdG8gYmUgaW1wbGVtZW50ZWQgYnkgb3RoZXIgbWVhbnNcbiAgICAgICAgICAgICAgICAgICAgLy8gJiYgRXZlbnRzLmlzTW91c2VEb3duKGUpKVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChFdmVudHMuaXNNb3VzZURvd24oZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWJ1ZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmNhcHR1cmUoZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbW91c2Vtb3ZlJywgZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vdmUoZSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVzZUNhcHR1cmVcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAnbW91c2V1cCcsXG4gICAgICAgICAgICAgICAgZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYnVnKSBjb25zb2xlLmxvZygnbW91c2V1cCcsIGUpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25FbmQoZSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAnbW91c2VvdXQnLFxuICAgICAgICAgICAgICAgIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQgPT0gZWxlbWVudCkgdGhpcy5vbkVuZChlKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXNlQ2FwdHVyZVxuICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG91Y2hQb2ludHMoZXZlbnQpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdXG4gICAgICAgIGZvciAobGV0IHRvdWNoIG9mIGV2ZW50LmNoYW5nZWRUb3VjaGVzKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmV4dHJhY3RQb2ludCh0b3VjaCkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIHNldHVwTW91c2VXaGVlbEludGVyYWN0aW9uKCkge1xuICAgICAgICB0aGlzLm1vdXNlV2hlZWxFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAnbW91c2V3aGVlbCcsXG4gICAgICAgICAgICB0aGlzLm9uTW91c2VXaGVlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdHJ1ZVxuICAgICAgICApXG4gICAgICAgIHRoaXMubW91c2VXaGVlbEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICdET01Nb3VzZVNjcm9sbCcsXG4gICAgICAgICAgICB0aGlzLm9uTW91c2VXaGVlbC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdHJ1ZVxuICAgICAgICApXG4gICAgfVxuXG4gICAgb25Nb3VzZVdoZWVsKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmNhcHR1cmUoZXZlbnQpICYmIHRoaXMudGFyZ2V0Lm9uTW91c2VXaGVlbCkge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQub25Nb3VzZVdoZWVsKGV2ZW50KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9jb25zb2xlLndhcm4oJ1RhcmdldCBoYXMgbm8gb25Nb3VzZVdoZWVsIGNhbGxiYWNrJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uU3RhcnQoZXZlbnQpIHtcbiAgICAgICAgbGV0IGV4dHJhY3RlZCA9IHRoaXMuZXh0cmFjdFBvaW50KGV2ZW50KVxuICAgICAgICB0aGlzLnVwZGF0ZUludGVyYWN0aW9uKGV2ZW50LCBleHRyYWN0ZWQpXG4gICAgICAgIHRoaXMudGFyZ2V0Lm9uU3RhcnQoZXZlbnQsIHRoaXMuaW50ZXJhY3Rpb24pXG4gICAgfVxuXG4gICAgb25Nb3ZlKGV2ZW50KSB7XG4gICAgICAgIGxldCBleHRyYWN0ZWQgPSB0aGlzLmV4dHJhY3RQb2ludChldmVudCwgJ2FsbCcpXG4gICAgICAgIHRoaXMudXBkYXRlSW50ZXJhY3Rpb24oZXZlbnQsIGV4dHJhY3RlZClcbiAgICAgICAgdGhpcy50YXJnZXQub25Nb3ZlKGV2ZW50LCB0aGlzLmludGVyYWN0aW9uKVxuICAgICAgICB0aGlzLmludGVyYWN0aW9uLnVwZGF0ZVByZXZpb3VzKClcbiAgICB9XG5cbiAgICBvbkVuZChldmVudCkge1xuICAgICAgICBsZXQgZXh0cmFjdGVkID0gdGhpcy5leHRyYWN0UG9pbnQoZXZlbnQsICdjaGFuZ2VkVG91Y2hlcycpXG4gICAgICAgIHRoaXMuZW5kSW50ZXJhY3Rpb24oZXZlbnQsIGV4dHJhY3RlZClcbiAgICAgICAgdGhpcy50YXJnZXQub25FbmQoZXZlbnQsIHRoaXMuaW50ZXJhY3Rpb24pXG4gICAgICAgIHRoaXMuZmluaXNoSW50ZXJhY3Rpb24oZXZlbnQsIGV4dHJhY3RlZClcbiAgICB9XG5cbiAgICBjYXB0dXJlKGV2ZW50KSB7XG4gICAgICAgIGxldCBjYXB0dXJlZCA9IHRoaXMudGFyZ2V0LmNhcHR1cmUoZXZlbnQpXG4gICAgICAgIHJldHVybiBjYXB0dXJlZFxuICAgIH1cblxuICAgIGdldFBvc2l0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiB7eDogZXZlbnQuY2xpZW50WCwgeTogZXZlbnQuY2xpZW50WX1cbiAgICB9XG5cbiAgICBleHRyYWN0UG9pbnQoZXZlbnQsIHRvdWNoRXZlbnRLZXkgPSAnYWxsJykge1xuICAgICAgICAvLyAndGFyZ2V0VG91Y2hlcydcbiAgICAgICAgbGV0IHJlc3VsdCA9IHt9XG4gICAgICAgIHN3aXRjaCAoZXZlbnQuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnTW91c2VFdmVudCc6XG4gICAgICAgICAgICAgICAgbGV0IGJ1dHRvbnMgPSBldmVudC5idXR0b25zIHx8IGV2ZW50LndoaWNoXG4gICAgICAgICAgICAgICAgaWYgKGJ1dHRvbnMpIHJlc3VsdFsnbW91c2UnXSA9IHRoaXMuZ2V0UG9zaXRpb24oZXZlbnQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ1BvaW50ZXJFdmVudCc6XG4gICAgICAgICAgICAgICAgcmVzdWx0W2V2ZW50LnBvaW50ZXJJZC50b1N0cmluZygpXSA9IHRoaXMuZ2V0UG9zaXRpb24oZXZlbnQpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ1RvdWNoJzpcbiAgICAgICAgICAgICAgICBsZXQgaWQgPVxuICAgICAgICAgICAgICAgICAgICBldmVudC50b3VjaFR5cGUgPT09ICdzdHlsdXMnXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdzdHlsdXMnXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGV2ZW50LmlkZW50aWZpZXIudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgIHJlc3VsdFtpZF0gPSB0aGlzLmdldFBvc2l0aW9uKGV2ZW50KVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBjYXNlICdUb3VjaEV2ZW50JzpcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAvLyBOZWVkcyB0byBiZSBvYnNlcnZlZDogUGVyaGFwcyBjaGFuZ2VkVG91Y2hlcyBhcmUgYWxsIHdlIG5lZWQuIElmIHNvXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy8gd2UgY2FuIHJlbW92ZSB0aGUgdG91Y2hFdmVudEtleSBkZWZhdWx0IHBhcmFtZXRlclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGlmICh0b3VjaEV2ZW50S2V5ID09ICdhbGwnKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgdCBvZiBldmVudC50YXJnZXRUb3VjaGVzKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbdC5pZGVudGlmaWVyLnRvU3RyaW5nKCldID0gdGhpcy5nZXRQb3NpdGlvbih0KVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgdCBvZiBldmVudC5jaGFuZ2VkVG91Y2hlcykge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3QuaWRlbnRpZmllci50b1N0cmluZygpXSA9IHRoaXMuZ2V0UG9zaXRpb24odClcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCB0IG9mIGV2ZW50LmNoYW5nZWRUb3VjaGVzKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbdC5pZGVudGlmaWVyLnRvU3RyaW5nKCldID0gdGhpcy5nZXRQb3NpdGlvbih0KVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cblxuICAgIGludGVyYWN0aW9uU3RhcnRlZChldmVudCwga2V5LCBwb2ludCkge1xuICAgICAgICAvLyBDYWxsYmFjazogY2FuIGJlIG92ZXJ3cml0dGVuXG4gICAgfVxuXG4gICAgaW50ZXJhY3Rpb25FbmRlZChldmVudCwga2V5LCBwb2ludCkge1xuICAgICAgICAvLyBDYWxsYmFjazogY2FuIGJlIG92ZXJ3cml0dGVuXG4gICAgfVxuXG4gICAgaW50ZXJhY3Rpb25GaW5pc2hlZChldmVudCwga2V5LCBwb2ludCkge31cblxuICAgIHVwZGF0ZUludGVyYWN0aW9uKGV2ZW50LCBleHRyYWN0ZWQpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGV4dHJhY3RlZCkge1xuICAgICAgICAgICAgbGV0IHBvaW50ID0gZXh0cmFjdGVkW2tleV1cbiAgICAgICAgICAgIGlmICh0aGlzLmludGVyYWN0aW9uLnVwZGF0ZShrZXksIHBvaW50KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJhY3Rpb25TdGFydGVkKGV2ZW50LCBrZXksIHBvaW50KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZW5kSW50ZXJhY3Rpb24oZXZlbnQsIGVuZGVkKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBlbmRlZCkge1xuICAgICAgICAgICAgbGV0IHBvaW50ID0gZW5kZWRba2V5XVxuICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGlvbi5zdG9wKGtleSwgcG9pbnQpXG4gICAgICAgICAgICB0aGlzLmludGVyYWN0aW9uRW5kZWQoZXZlbnQsIGtleSwgcG9pbnQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5pc2hJbnRlcmFjdGlvbihldmVudCwgZW5kZWQpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGVuZGVkKSB7XG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBlbmRlZFtrZXldXG4gICAgICAgICAgICB0aGlzLmludGVyYWN0aW9uLmZpbmlzaChrZXksIHBvaW50KVxuICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGlvbkZpbmlzaGVkKGV2ZW50LCBrZXksIHBvaW50KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW50ZXJhY3Rpb25NYXBwZXIgZXh0ZW5kcyBJbnRlcmFjdGlvbkRlbGVnYXRlIHtcbiAgICAvKiBBIHNwZWNpYWwgSW50ZXJhY3Rpb25EZWxlZ2F0ZSB0aGF0IG1hcHMgZXZlbnRzIHRvIHNwZWNpZmljIHBhcnRzIG9mXG4gICAgdGhlIGludGVyYWN0aW9uIHRhcmdldC4gVGhlIEludGVyYWN0aW9uVGFyZ2V0IG11c3QgaW1wbGVtZW50IGEgZmluZFRhcmdldFxuICAgIG1ldGhvZCB0aGF0IHJldHVybnMgYW4gb2JqZWN0IGltcGxlbWVudGluZyB0aGUgSUludGVyYWN0aW9uVGFyZ2V0IGludGVyZmFjZS5cblxuICAgIElmIHRoZSBJbnRlcmFjdGlvblRhcmdldCBhbHNvIGltcGxlbWVudHMgYSBtYXBQb3NpdGlvblRvUG9pbnQgbWV0aG9kIHRoaXNcbiAgICBpcyB1c2VkIHRvIG1hcCB0aGUgcG9pbnRzIHRvIHRoZSBsb2NhbCBjb29yZGluYXRlIHNwYWNlIG9mIHRoZSB0aGUgdGFyZ2V0LlxuXG4gICAgVGhpcyBtYWtlcyBpdCBlYXNpZXIgdG8gbG9va3VwIGVsZW1lbnRzIGFuZCByZWxhdGUgZXZlbnRzIHRvIGxvY2FsXG4gICAgcG9zaXRpb25zLlxuICAgICovXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgZWxlbWVudCxcbiAgICAgICAgdGFyZ2V0LFxuICAgICAgICB7dGFwRGlzdGFuY2UgPSAxMCwgbG9uZ1ByZXNzVGltZSA9IDUwMC4wLCBtb3VzZVdoZWVsRWxlbWVudCA9IG51bGx9ID0ge31cbiAgICApIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCwgdGFyZ2V0LCB7dGFwRGlzdGFuY2UsIGxvbmdQcmVzc1RpbWUsIG1vdXNlV2hlZWxFbGVtZW50fSlcbiAgICB9XG5cbiAgICBnZXQgdGFyZ2V0SW50ZXJmYWNlKCkge1xuICAgICAgICByZXR1cm4gSUludGVyYWN0aW9uTWFwcGVyVGFyZ2V0XG4gICAgfVxuXG4gICAgbWFwUG9zaXRpb25Ub1BvaW50KHBvaW50KSB7XG4gICAgICAgIGlmICh0aGlzLnRhcmdldC5tYXBQb3NpdGlvblRvUG9pbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhcmdldC5tYXBQb3NpdGlvblRvUG9pbnQocG9pbnQpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvaW50XG4gICAgfVxuXG4gICAgaW50ZXJhY3Rpb25TdGFydGVkKGV2ZW50LCBrZXksIHBvaW50KSB7XG4gICAgICAgIGlmICh0aGlzLnRhcmdldC5maW5kVGFyZ2V0KSB7XG4gICAgICAgICAgICBsZXQgbG9jYWwgPSB0aGlzLm1hcFBvc2l0aW9uVG9Qb2ludChwb2ludClcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IHRoaXMudGFyZ2V0LmZpbmRUYXJnZXQoZXZlbnQsIGxvY2FsLCBwb2ludClcbiAgICAgICAgICAgIGlmIChmb3VuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGlvbi5hZGRUYXJnZXQoa2V5LCBmb3VuZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW91c2VXaGVlbChldmVudCkge1xuICAgICAgICBpZiAodGhpcy5jYXB0dXJlKGV2ZW50KSkge1xuICAgICAgICAgICAgaWYgKHRoaXMudGFyZ2V0LmZpbmRUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICBsZXQgcG9pbnQgPSB0aGlzLmdldFBvc2l0aW9uKGV2ZW50KVxuICAgICAgICAgICAgICAgIGxldCBsb2NhbCA9IHRoaXMubWFwUG9zaXRpb25Ub1BvaW50KHBvaW50KVxuICAgICAgICAgICAgICAgIGxldCBmb3VuZCA9IHRoaXMudGFyZ2V0LmZpbmRUYXJnZXQoZXZlbnQsIGxvY2FsLCBwb2ludClcbiAgICAgICAgICAgICAgICBpZiAoZm91bmQgIT0gbnVsbCAmJiBmb3VuZC5vbk1vdXNlV2hlZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQub25Nb3VzZVdoZWVsKGV2ZW50KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy50YXJnZXQub25Nb3VzZVdoZWVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQub25Nb3VzZVdoZWVsKGV2ZW50KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUud2FybignVGFyZ2V0IGhhcyBubyBvbk1vdXNlV2hlZWwgY2FsbGJhY2snLCB0aGlzLnRhcmdldClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uU3RhcnQoZXZlbnQpIHtcbiAgICAgICAgbGV0IGV4dHJhY3RlZCA9IHRoaXMuZXh0cmFjdFBvaW50KGV2ZW50KVxuICAgICAgICB0aGlzLnVwZGF0ZUludGVyYWN0aW9uKGV2ZW50LCBleHRyYWN0ZWQpXG4gICAgICAgIGxldCBtYXBwZWQgPSB0aGlzLmludGVyYWN0aW9uLm1hcEludGVyYWN0aW9uKFxuICAgICAgICAgICAgZXh0cmFjdGVkLFxuICAgICAgICAgICAgWydjdXJyZW50JywgJ3N0YXJ0J10sXG4gICAgICAgICAgICB0aGlzLm1hcFBvc2l0aW9uVG9Qb2ludC5iaW5kKHRoaXMpXG4gICAgICAgIClcbiAgICAgICAgZm9yIChsZXQgW3RhcmdldCwgaW50ZXJhY3Rpb25dIG9mIG1hcHBlZC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIHRhcmdldC5vblN0YXJ0KGV2ZW50LCBpbnRlcmFjdGlvbilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW92ZShldmVudCkge1xuICAgICAgICBsZXQgZXh0cmFjdGVkID0gdGhpcy5leHRyYWN0UG9pbnQoZXZlbnQsICdhbGwnKVxuXG4gICAgICAgIHRoaXMudXBkYXRlSW50ZXJhY3Rpb24oZXZlbnQsIGV4dHJhY3RlZClcbiAgICAgICAgbGV0IG1hcHBlZCA9IHRoaXMuaW50ZXJhY3Rpb24ubWFwSW50ZXJhY3Rpb24oXG4gICAgICAgICAgICBleHRyYWN0ZWQsXG4gICAgICAgICAgICBbJ2N1cnJlbnQnLCAncHJldmlvdXMnXSxcbiAgICAgICAgICAgIHRoaXMubWFwUG9zaXRpb25Ub1BvaW50LmJpbmQodGhpcylcbiAgICAgICAgKVxuICAgICAgICBmb3IgKGxldCBbdGFyZ2V0LCBpbnRlcmFjdGlvbl0gb2YgbWFwcGVkLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgdGFyZ2V0Lm9uTW92ZShldmVudCwgaW50ZXJhY3Rpb24pXG4gICAgICAgICAgICBpbnRlcmFjdGlvbi51cGRhdGVQcmV2aW91cygpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnRlcmFjdGlvbi51cGRhdGVQcmV2aW91cygpXG4gICAgfVxuXG4gICAgb25FbmQoZXZlbnQpIHtcbiAgICAgICAgbGV0IGV4dHJhY3RlZCA9IHRoaXMuZXh0cmFjdFBvaW50KGV2ZW50LCAnY2hhbmdlZFRvdWNoZXMnKVxuICAgICAgICB0aGlzLmVuZEludGVyYWN0aW9uKGV2ZW50LCBleHRyYWN0ZWQpXG4gICAgICAgIGxldCBtYXBwZWQgPSB0aGlzLmludGVyYWN0aW9uLm1hcEludGVyYWN0aW9uKFxuICAgICAgICAgICAgZXh0cmFjdGVkLFxuICAgICAgICAgICAgWydlbmRlZCddLFxuICAgICAgICAgICAgdGhpcy5tYXBQb3NpdGlvblRvUG9pbnQuYmluZCh0aGlzKVxuICAgICAgICApXG4gICAgICAgIGZvciAobGV0IFt0YXJnZXQsIGludGVyYWN0aW9uXSBvZiBtYXBwZWQuZW50cmllcygpKSB7XG4gICAgICAgICAgICB0YXJnZXQub25FbmQoZXZlbnQsIGludGVyYWN0aW9uKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmluaXNoSW50ZXJhY3Rpb24oZXZlbnQsIGV4dHJhY3RlZClcbiAgICB9XG59XG5cbndpbmRvdy5JbnRlcmFjdGlvbk1hcHBlciA9IEludGVyYWN0aW9uTWFwcGVyXG4iLCIvKiogUmVwb3J0IGNhcGFiaWxpdGllcyB3aXRoIGd1YXJhbnRlZWQgdmFsdWVzLlxuICovXG5leHBvcnQgY2xhc3MgQ2FwYWJpbGl0aWVzIHtcblxuICAgIC8qKiBSZXR1cm5zIHRoZSBicm93c2VyIHVzZXJBZ2VudC5cbiAgICBAcmV0dXJuIHtzdHJpbmd9XG4gICAgKi9cbiAgICBzdGF0aWMgZ2V0IHVzZXJBZ2VudCgpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQgfHwgJ1Vua25vd24gQWdlbnQnXG4gICAgfVxuXG4gICAgLyoqIFRlc3RzIHdoZXRoZXIgdGhlIGFwcCBpcyBydW5uaW5nIG9uIGEgbW9iaWxlIGRldmljZS5cbiAgICBJbXBsZW1lbnRlZCBhcyBhIHJlYWRvbmx5IGF0dHJpYnV0ZS5cbiAgICBAcmV0dXJuIHtib29sZWFufVxuICAgICovXG4gICAgc3RhdGljIGdldCBpc01vYmlsZSgpIHtcbiAgICAgICAgcmV0dXJuICgvTW9iaS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSlcbiAgICB9XG5cbiAgICAvKiogVGVzdHMgd2hldGhlciB0aGUgYXBwIGlzIHJ1bm5pbmcgb24gYSBpT1MgZGV2aWNlLlxuICAgIEltcGxlbWVudGVkIGFzIGEgcmVhZG9ubHkgYXR0cmlidXRlLlxuICAgIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgKi9cbiAgICBzdGF0aWMgZ2V0IGlzSU9TKCkge1xuICAgICAgICByZXR1cm4gKC9pUGFkfGlQaG9uZXxpUG9kLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSAmJiAhd2luZG93Lk1TU3RyZWFtXG4gICAgfVxuXG4gICAgIC8qKiBUZXN0cyB3aGV0aGVyIHRoZSBhcHAgaXMgcnVubmluZyBpbiBhIFNhZmFyaSBlbnZpcm9ubWVudC5cbiAgICBTZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzk0NDQ2MC9kZXRlY3Qtc2FmYXJpLWJyb3dzZXJcbiAgICBJbXBsZW1lbnRlZCBhcyBhIHJlYWRvbmx5IGF0dHJpYnV0ZS5cbiAgICBAcmV0dXJuIHtib29sZWFufVxuICAgICovXG4gICAgc3RhdGljIGdldCBpc1NhZmFyaSgpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci52ZW5kb3IgJiYgbmF2aWdhdG9yLnZlbmRvci5pbmRleE9mKCdBcHBsZScpID4gLTEgJiZcbiAgICAgICAgICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goJ0NyaU9TJylcbiAgICB9XG5cblxuICAgIC8qKiBSZXR1cm5zIHRoZSBkaXNwbGF5IHJlc29sdXRpb24uIE5lY2Vzc2FyeSBmb3IgcmV0aW5hIGRpc3BsYXlzLlxuICAgIEByZXR1cm4ge251bWJlcn1cbiAgICAqL1xuICAgIHN0YXRpYyBnZXQgZGV2aWNlUGl4ZWxSYXRpbygpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDFcbiAgICB9XG5cbiAgICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSBkZXZpY2UgaXMgYSBtdWx0aS10b3VjaCB0YWJsZS4gVGhpcyBtZXRob2QgaXMgY3VycmVudGx5IG5vdCB1bml2ZXJzYWwgdXNhYmxlIGFuZCBub3Qgc3VyZSFcbiAgICBAcmV0dXJuIHtib29sZWFufVxuICAgICovXG4gICAgc3RhdGljIGdldCBpc011bHRpVG91Y2hUYWJsZSgpIHtcbiAgICAgICAgcmV0dXJuIENhcGFiaWxpdGllcy5kZXZpY2VQaXhlbFJhdGlvID4gMiAmJiBDYXBhYmlsaXRpZXMuaXNNb2JpbGUgPT09IGZhbHNlICYmIC9XaW5kb3dzL2kudGVzdChDYXBhYmlsaXRpZXMudXNlckFnZW50KVxuICAgIH1cblxuICAgIC8qKiBSZXR1cm5zIHRydWUgaWYgbW91c2UgZXZlbnRzIGFyZSBzdXBwb3J0ZWRcbiAgICBAcmV0dXJuIHtib29sZWFufVxuICAgICovXG4gICAgc3RhdGljIHN1cHBvcnRzTW91c2VFdmVudHMoKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2Yod2luZG93Lk1vdXNlRXZlbnQpICE9ICd1bmRlZmluZWQnXG4gICAgfVxuXG4gICAgLyoqIFJldHVybnMgdHJ1ZSBpZiB0b3VjaCBldmVudHMgYXJlIHN1cHBvcnRlZFxuICAgIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgKi9cbiAgICBzdGF0aWMgc3VwcG9ydHNUb3VjaEV2ZW50cygpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZih3aW5kb3cuVG91Y2hFdmVudCkgIT0gJ3VuZGVmaW5lZCdcbiAgICB9XG5cbiAgICAvKiogUmV0dXJucyB0cnVlIGlmIHBvaW50ZXIgZXZlbnRzIGFyZSBzdXBwb3J0ZWRcbiAgICBAcmV0dXJuIHtib29sZWFufVxuICAgICovXG4gICAgc3RhdGljIHN1cHBvcnRzUG9pbnRlckV2ZW50cygpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZih3aW5kb3cuUG9pbnRlckV2ZW50KSAhPSAndW5kZWZpbmVkJ1xuICAgIH1cblxuICAgIC8qKiBSZXR1cm5zIHRydWUgaWYgRE9NIHRlbXBsYXRlcyBhcmUgc3VwcG9ydGVkXG4gICAgQHJldHVybiB7Ym9vbGVhbn1cbiAgICAqL1xuICAgIHN0YXRpYyBzdXBwb3J0c1RlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gJ2NvbnRlbnQnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgfVxufVxuXG4vKiogQmFzaWMgdGVzdHMgZm9yIENhcGFiaWxpdGllcy5cbiAqL1xuZXhwb3J0IGNsYXNzIENhcGFiaWxpdGllc1Rlc3RzIHtcblxuICAgIHN0YXRpYyB0ZXN0Q29uZmlybSgpIHtcbiAgICAgICAgbGV0IGJvb2wgPSBjb25maXJtKCdQbGVhc2UgY29uZmlybScpXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZW1vJykuaW5uZXJIVE1MID0gKGJvb2wpID8gJ0NvbmZpcm1lZCcgOiAnTm90IGNvbmZpcm1lZCdcbiAgICB9XG5cbiAgICBzdGF0aWMgdGVzdFByb21wdCgpIHtcbiAgICAgICAgbGV0IHBlcnNvbiA9IHByb21wdCgnUGxlYXNlIGVudGVyIHlvdXIgbmFtZScsICdIYXJyeSBQb3R0ZXInKVxuICAgICAgICBpZiAocGVyc29uICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRlbW8uaW5uZXJIVE1MID1cbiAgICAgICAgICAgICdIZWxsbyAnICsgcGVyc29uICsgJyEgSG93IGFyZSB5b3UgdG9kYXk/J1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHRlc3RVc2VyQWdlbnQoKSB7XG4gICAgICAgIGxldCBhZ2VudCA9ICdVc2VyLWFnZW50OiAnICsgQ2FwYWJpbGl0aWVzLnVzZXJBZ2VudFxuICAgICAgICB1c2VyX2FnZW50LmlubmVySFRNTCA9IGFnZW50XG4gICAgfVxuXG4gICAgc3RhdGljIHRlc3REZXZpY2VQaXhlbFJhdGlvKCkge1xuICAgICAgICBsZXQgdmFsdWUgPSAnRGV2aWNlIFBpeGVsIFJhdGlvOiAnICsgQ2FwYWJpbGl0aWVzLmRldmljZVBpeGVsUmF0aW9cbiAgICAgICAgZGV2aWNlX3BpeGVsX3JhdGlvLmlubmVySFRNTCA9IHZhbHVlXG4gICAgfVxuXG4gICAgc3RhdGljIHRlc3RNdWx0aVRvdWNoVGFibGUoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICdJcyB0aGUgZGV2aWNlIGEgbXVsdGktdG91Y2ggdGFibGU/ICcgKyBDYXBhYmlsaXRpZXMuaXNNdWx0aVRvdWNoVGFibGVcbiAgICAgICAgbXVsdGlfdG91Y2hfdGFibGUuaW5uZXJIVE1MID0gdmFsdWVcbiAgICB9XG5cbiAgICBzdGF0aWMgdGVzdFN1cHBvcnRlZEV2ZW50cygpIHtcbiAgICAgICAgbGV0IGV2ZW50cyA9IFtdXG4gICAgICAgIGlmIChDYXBhYmlsaXRpZXMuc3VwcG9ydHNNb3VzZUV2ZW50cygpKSB7XG4gICAgICAgICAgICBldmVudHMucHVzaCgnTW91c2VFdmVudHMnKVxuICAgICAgICB9XG4gICAgICAgIGlmIChDYXBhYmlsaXRpZXMuc3VwcG9ydHNUb3VjaEV2ZW50cygpKSB7XG4gICAgICAgICAgICBldmVudHMucHVzaCgnVG91Y2hFdmVudHMnKVxuICAgICAgICB9XG4gICAgICAgIGlmIChDYXBhYmlsaXRpZXMuc3VwcG9ydHNQb2ludGVyRXZlbnRzKCkpIHtcbiAgICAgICAgICAgIGV2ZW50cy5wdXNoKCdQb2ludGVyRXZlbnRzJylcbiAgICAgICAgfVxuICAgICAgICBzdXBwb3J0ZWRfZXZlbnRzLmlubmVySFRNTCA9ICdTdXBwb3J0ZWQgRXZlbnRzOiAnICsgZXZlbnRzLmpvaW4oJywgJylcbiAgICB9XG5cbiAgICBzdGF0aWMgdGVzdEFsbCgpIHtcbiAgICAgICAgdGhpcy50ZXN0VXNlckFnZW50KClcbiAgICAgICAgdGhpcy50ZXN0RGV2aWNlUGl4ZWxSYXRpbygpXG4gICAgICAgIHRoaXMudGVzdE11bHRpVG91Y2hUYWJsZSgpXG4gICAgICAgIHRoaXMudGVzdFN1cHBvcnRlZEV2ZW50cygpXG4gICAgfVxufVxuXG4vKiBPcHRpb25hbCBnbG9iYWwgdmFyaWFibGVzLCBuZWVkZWQgaW4gRG9jVGVzdHMuICovXG53aW5kb3cuQ2FwYWJpbGl0aWVzID0gQ2FwYWJpbGl0aWVzXG53aW5kb3cuQ2FwYWJpbGl0aWVzVGVzdHMgPSBDYXBhYmlsaXRpZXNUZXN0c1xuIiwiaW1wb3J0IHtQb2ludHMsIFBvbHlnb24sIEFuZ2xlLCBFbGVtZW50c30gZnJvbSAnLi91dGlscy5qcydcbmltcG9ydCBFdmVudHMgZnJvbSAnLi9ldmVudHMuanMnXG5pbXBvcnQge0ludGVyYWN0aW9uTWFwcGVyfSBmcm9tICcuL2ludGVyYWN0aW9uLmpzJ1xuaW1wb3J0IHtDYXBhYmlsaXRpZXN9IGZyb20gJy4vY2FwYWJpbGl0aWVzLmpzJ1xuXG4vKipcbiAqIEEgYmFzZSBjbGFzcyBmb3Igc2NhdHRlciBzcGVjaWZpYyBldmVudHMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge25hbWV9IFN0cmluZyAtIFRoZSBuYW1lIG9mIHRoZSBldmVudFxuICogQHBhcmFtIHt0YXJnZXR9IE9iamVjdCAtIFRoZSB0YXJnZXQgb2YgdGhlIGV2ZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlRXZlbnQge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHRhcmdldCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0XG4gICAgfVxufVxuXG4vLyBFdmVudCB0eXBlc1xuY29uc3QgU1RBUlQgPSAnb25TdGFydCdcbmNvbnN0IFVQREFURSA9ICdvblVwZGF0ZSdcbmNvbnN0IEVORCA9ICdvbkVuZCdcbmNvbnN0IFpPT00gPSAnb25ab29tJ1xuY29uc3QgTU9WRSA9ICdvbk1vdmUnXG5cbi8qKlxuICogQSBzY2F0dGVyIGV2ZW50IHRoYXQgZGVzY3JpYmVzIGhvdyB0aGUgc2NhdHRlciBoYXMgY2hhbmdlZC5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7dGFyZ2V0fSBPYmplY3QgLSBUaGUgdGFyZ2V0IHNjYXR0ZXIgb2YgdGhlIGV2ZW50XG4gKiBAcGFyYW0ge29wdGlvbmFsfSBPYmplY3QgLSBPcHRpb25hbCBwYXJhbWV0ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFNjYXR0ZXJFdmVudCBleHRlbmRzIEJhc2VFdmVudCB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHRhcmdldCxcbiAgICAgICAge1xuICAgICAgICAgICAgdHJhbnNsYXRlID0ge3g6IDAsIHk6IDB9LFxuICAgICAgICAgICAgc2NhbGUgPSBudWxsLFxuICAgICAgICAgICAgcm90YXRlID0gMCxcbiAgICAgICAgICAgIGFib3V0ID0gbnVsbCxcbiAgICAgICAgICAgIGZhc3QgPSBmYWxzZSxcbiAgICAgICAgICAgIHR5cGUgPSBudWxsXG4gICAgICAgIH0gPSB7fVxuICAgICkge1xuICAgICAgICBzdXBlcignc2NhdHRlclRyYW5zZm9ybWVkJywge3RhcmdldDogdGFyZ2V0fSlcbiAgICAgICAgdGhpcy50cmFuc2xhdGUgPSB0cmFuc2xhdGVcbiAgICAgICAgdGhpcy5zY2FsZSA9IHNjYWxlXG4gICAgICAgIHRoaXMucm90YXRlID0gcm90YXRlXG4gICAgICAgIHRoaXMuYWJvdXQgPSBhYm91dFxuICAgICAgICB0aGlzLmZhc3QgPSBmYXN0XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGVcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFwiRXZlbnQoJ3NjYXR0ZXJUcmFuc2Zvcm1lZCcsIHNjYWxlOiBcIiArXG4gICAgICAgICAgICB0aGlzLnNjYWxlICtcbiAgICAgICAgICAgICcgYWJvdXQ6ICcgK1xuICAgICAgICAgICAgdGhpcy5hYm91dC54ICtcbiAgICAgICAgICAgICcsICcgK1xuICAgICAgICAgICAgdGhpcy5hYm91dC55ICtcbiAgICAgICAgICAgICcpJ1xuICAgICAgICApXG4gICAgfVxufVxuXG4vKipcbiAqIEEgc2NhdHRlciByZXNpemUgZXZlbnQgdGhhdCBkZXNjcmliZXMgaG93IHRoZSBzY2F0dGVyIGhhcyBjaGFuZ2VkLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHt0YXJnZXR9IE9iamVjdCAtIFRoZSB0YXJnZXQgc2NhdHRlciBvZiB0aGUgZXZlbnRcbiAqIEBwYXJhbSB7b3B0aW9uYWx9IE9iamVjdCAtIE9wdGlvbmFsIHBhcmFtZXRlclxuICovXG5leHBvcnQgY2xhc3MgUmVzaXplRXZlbnQgZXh0ZW5kcyBCYXNlRXZlbnQge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCwge3dpZHRoID0gMCwgaGVpZ2h0ID0gMH0gPSB7fSkge1xuICAgICAgICBzdXBlcignc2NhdHRlclJlc2l6ZWQnLCB7d2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodH0pXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgJ0V2ZW50KHNjYXR0ZXJSZXNpemVkIHdpZHRoOiAnICtcbiAgICAgICAgICAgIHRoaXMud2lkdGggK1xuICAgICAgICAgICAgJ2hlaWdodDogJyArXG4gICAgICAgICAgICB0aGlzLmhlaWdodCArXG4gICAgICAgICAgICAnKSdcbiAgICAgICAgKVxuICAgIH1cbn1cblxuLyoqXG4gKiBBIGFic3RyYWN0IGJhc2UgY2xhc3MgdGhhdCBpbXBsZW1lbnRzIHRoZSB0aHJvd2FibGUgYmVoYXZpb3Igb2YgYSBzY2F0dGVyXG4gKiBvYmplY3QuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIFRocm93YWJsZSB7XG4gICAgY29uc3RydWN0b3Ioe1xuICAgICAgICBtb3ZhYmxlWCA9IHRydWUsXG4gICAgICAgIG1vdmFibGVZID0gdHJ1ZSxcbiAgICAgICAgdGhyb3dWaXNpYmlsaXR5ID0gNDQsXG4gICAgICAgIHRocm93RGFtcGluZyA9IDAuOTUsXG4gICAgICAgIGF1dG9UaHJvdyA9IHRydWVcbiAgICB9ID0ge30pIHtcbiAgICAgICAgdGhpcy5tb3ZhYmxlWCA9IG1vdmFibGVYXG4gICAgICAgIHRoaXMubW92YWJsZVkgPSBtb3ZhYmxlWVxuICAgICAgICB0aGlzLnRocm93VmlzaWJpbGl0eSA9IHRocm93VmlzaWJpbGl0eVxuICAgICAgICB0aGlzLnRocm93RGFtcGluZyA9IHRocm93RGFtcGluZ1xuICAgICAgICB0aGlzLmF1dG9UaHJvdyA9IGF1dG9UaHJvd1xuICAgICAgICB0aGlzLnZlbG9jaXRpZXMgPSBbXVxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbnVsbFxuICAgICAgICB0aGlzLnRpbWVzdGFtcCA9IG51bGxcbiAgICB9XG5cbiAgICBvYnNlcnZlVmVsb2NpdHkoKSB7XG4gICAgICAgIHRoaXMubGFzdGZyYW1lID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICB9XG5cbiAgICBhZGRWZWxvY2l0eShkZWx0YSwgYnVmZmVyID0gNSkge1xuICAgICAgICBsZXQgdCA9IHBlcmZvcm1hbmNlLm5vdygpXG4gICAgICAgIGxldCBkdCA9IHQgLSB0aGlzLmxhc3RmcmFtZVxuICAgICAgICB0aGlzLmxhc3RmcmFtZSA9IHRcbiAgICAgICAgbGV0IHZlbG9jaXR5ID0ge3Q6IHQsIGR0OiBkdCwgZHg6IGRlbHRhLngsIGR5OiBkZWx0YS55fVxuICAgICAgICB0aGlzLnZlbG9jaXRpZXMucHVzaCh2ZWxvY2l0eSlcbiAgICAgICAgd2hpbGUgKHRoaXMudmVsb2NpdGllcy5sZW5ndGggPiBidWZmZXIpIHtcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdGllcy5zaGlmdCgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZWFuVmVsb2NpdHkobWlsbGlzZWNvbmRzID0gMzApIHtcbiAgICAgICAgdGhpcy5hZGRWZWxvY2l0eSh7eDogMCwgeTogMH0pXG4gICAgICAgIGxldCBzdW0gPSB7eDogMCwgeTogMH1cbiAgICAgICAgbGV0IGNvdW50ID0gMFxuICAgICAgICBsZXQgdCA9IDBcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMudmVsb2NpdGllcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgICAgICBsZXQgdiA9IHRoaXMudmVsb2NpdGllc1tpXVxuICAgICAgICAgICAgdCArPSB2LmR0XG4gICAgICAgICAgICBsZXQgbnYgPSB7eDogdi5keCAvIHYuZHQsIHk6IHYuZHkgLyB2LmR0fVxuICAgICAgICAgICAgc3VtID0gUG9pbnRzLmFkZChzdW0sIG52KVxuICAgICAgICAgICAgY291bnQgKz0gMVxuICAgICAgICAgICAgaWYgKHQgPiBtaWxsaXNlY29uZHMpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjb3VudCA9PT0gMCkgcmV0dXJuIHN1bSAvLyBlbXB0eSB2ZWN0b3JcbiAgICAgICAgcmV0dXJuIFBvaW50cy5tdWx0aXBseVNjYWxhcihzdW0sIDEgLyBjb3VudClcbiAgICB9XG5cbiAgICBraWxsQW5pbWF0aW9uKCkge1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbnVsbFxuICAgICAgICB0aGlzLnZlbG9jaXRpZXMgPSBbXVxuICAgIH1cblxuICAgIHN0YXJ0VGhyb3coKSB7XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSB0aGlzLm1lYW5WZWxvY2l0eSgpXG4gICAgICAgIGlmICh0aGlzLnZlbG9jaXR5ICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIENhbGwgbmV4dCB2ZWxvY2l0eSB0byBhbnN1cmUgdGhhdCBzcGVjaWFsaXphdGlvbnNcbiAgICAgICAgICAgIC8vIHRoYXQgdXNlIGtlZXBPblN0YWdlIGFyZSBjYWxsZWRcbiAgICAgICAgICAgIHRoaXMudmVsb2NpdHkgPSB0aGlzLm5leHRWZWxvY2l0eSh0aGlzLnZlbG9jaXR5KVxuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b1Rocm93KSB0aGlzLmFuaW1hdGVUaHJvdyhwZXJmb3JtYW5jZS5ub3coKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub25EcmFnQ29tcGxldGUoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5pbWF0ZVRocm93KHRpbWUpIHtcbiAgICAgICAgaWYgKHRoaXMudmVsb2NpdHkgIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IHQgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgICAgICAgICAgbGV0IGR0ID0gdCAtIHRoaXMubGFzdGZyYW1lXG4gICAgICAgICAgICB0aGlzLmxhc3RmcmFtZSA9IHRcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYW5pbWF0ZVRocm93XCIsIGR0KVxuICAgICAgICAgICAgbGV0IG5leHQgPSB0aGlzLm5leHRWZWxvY2l0eSh0aGlzLnZlbG9jaXR5KVxuICAgICAgICAgICAgbGV0IHByZXZMZW5ndGggPSBQb2ludHMubGVuZ3RoKHRoaXMudmVsb2NpdHkpXG4gICAgICAgICAgICBsZXQgbmV4dExlbmd0aCA9IFBvaW50cy5sZW5ndGgobmV4dClcbiAgICAgICAgICAgIGlmIChuZXh0TGVuZ3RoID4gcHJldkxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxldCBmYWN0b3IgPSBuZXh0TGVuZ3RoIC8gcHJldkxlbmd0aFxuICAgICAgICAgICAgICAgIG5leHQgPSBQb2ludHMubXVsdGlwbHlTY2FsYXIobmV4dCwgMSAvIGZhY3RvcilcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUHJldmVudCBhY2NlbGVyYXRpb24nLCBmYWN0b3IsIHRoaXMudmVsb2NpdHksIG5leHQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV4dFxuICAgICAgICAgICAgbGV0IGQgPSBQb2ludHMubXVsdGlwbHlTY2FsYXIodGhpcy52ZWxvY2l0eSwgZHQpXG4gICAgICAgICAgICB0aGlzLl9tb3ZlKGQpXG4gICAgICAgICAgICB0aGlzLm9uRHJhZ1VwZGF0ZShkKVxuICAgICAgICAgICAgaWYgKGR0ID09IDAgfHwgdGhpcy5uZWVkc0FuaW1hdGlvbigpKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0ZVRocm93LmJpbmQodGhpcykpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0c2lkZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGVUaHJvdy5iaW5kKHRoaXMpKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uRHJhZ0NvbXBsZXRlKClcbiAgICB9XG5cbiAgICBuZWVkc0FuaW1hdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFBvaW50cy5sZW5ndGgodGhpcy52ZWxvY2l0eSkgPiAwLjAxXG4gICAgfVxuXG4gICAgbmV4dFZlbG9jaXR5KHZlbG9jaXR5KSB7XG4gICAgICAgIC8vIE11c3QgYmUgb3ZlcndyaXR0ZW46IGNvbXB1dGVzIHRoZSBjaGFuZ2VkIHZlbG9jaXR5LiBJbXBsZW1lbnRcbiAgICAgICAgLy8gZGFtcGluZywgY29sbGlzb24gZGV0ZWN0aW9uLCBldGMuIGhlcmVcbiAgICAgICAgcmV0dXJuIFBvaW50cy5tdWx0aXBseVNjYWxhcih2ZWxvY2l0eSwgdGhpcy50aHJvd0RhbXBpbmcpXG4gICAgfVxuXG4gICAgX21vdmUoZGVsdGEpIHt9XG5cbiAgICBvbkRyYWdDb21wbGV0ZSgpIHt9XG5cbiAgICBvbkRyYWdVcGRhdGUoZGVsdGEpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBBYnN0cmFjdFNjYXR0ZXIgZXh0ZW5kcyBUaHJvd2FibGUge1xuICAgIGNvbnN0cnVjdG9yKHtcbiAgICAgICAgbWluU2NhbGUgPSAwLjEsXG4gICAgICAgIG1heFNjYWxlID0gMS4wLFxuICAgICAgICBzdGFydFNjYWxlID0gMS4wLFxuICAgICAgICBhdXRvQnJpbmdUb0Zyb250ID0gdHJ1ZSxcbiAgICAgICAgYXV0b1Rocm93ID0gdHJ1ZSxcbiAgICAgICAgdHJhbnNsYXRhYmxlID0gdHJ1ZSxcbiAgICAgICAgc2NhbGFibGUgPSB0cnVlLFxuICAgICAgICByb3RhdGFibGUgPSB0cnVlLFxuICAgICAgICByZXNpemFibGUgPSBmYWxzZSxcbiAgICAgICAgbW92YWJsZVggPSB0cnVlLFxuICAgICAgICBtb3ZhYmxlWSA9IHRydWUsXG4gICAgICAgIHRocm93VmlzaWJpbGl0eSA9IDQ0LFxuICAgICAgICB0aHJvd0RhbXBpbmcgPSAwLjk1LFxuICAgICAgICBvdmVyZG9TY2FsaW5nID0gMSxcbiAgICAgICAgbW91c2Vab29tRmFjdG9yID0gMS4xLFxuICAgICAgICByb3RhdGlvbkRlZ3JlZXMgPSBudWxsLFxuICAgICAgICByb3RhdGlvbiA9IG51bGwsXG4gICAgICAgIG9uVHJhbnNmb3JtID0gbnVsbFxuICAgIH0gPSB7fSkge1xuICAgICAgICBpZiAocm90YXRpb25EZWdyZWVzICE9IG51bGwgJiYgcm90YXRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVc2Ugcm90YXRpb25EZWdyZWVzIG9yIHJvdGF0aW9uIGJ1dCBub3QgYm90aCcpXG4gICAgICAgIH0gZWxzZSBpZiAocm90YXRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICAgcm90YXRpb25EZWdyZWVzID0gQW5nbGUucmFkaWFuMmRlZ3JlZShyb3RhdGlvbilcbiAgICAgICAgfSBlbHNlIGlmIChyb3RhdGlvbkRlZ3JlZXMgPT0gbnVsbCkge1xuICAgICAgICAgICAgcm90YXRpb25EZWdyZWVzID0gMFxuICAgICAgICB9XG4gICAgICAgIHN1cGVyKHtcbiAgICAgICAgICAgIG1vdmFibGVYLFxuICAgICAgICAgICAgbW92YWJsZVksXG4gICAgICAgICAgICB0aHJvd1Zpc2liaWxpdHksXG4gICAgICAgICAgICB0aHJvd0RhbXBpbmcsXG4gICAgICAgICAgICBhdXRvVGhyb3dcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5zdGFydFJvdGF0aW9uRGVncmVlcyA9IHJvdGF0aW9uRGVncmVlc1xuICAgICAgICB0aGlzLnN0YXJ0U2NhbGUgPSBzdGFydFNjYWxlIC8vIE5lZWRlZCB0byByZXNldCBvYmplY3RcbiAgICAgICAgdGhpcy5taW5TY2FsZSA9IG1pblNjYWxlXG4gICAgICAgIHRoaXMubWF4U2NhbGUgPSBtYXhTY2FsZVxuICAgICAgICB0aGlzLm92ZXJkb1NjYWxpbmcgPSBvdmVyZG9TY2FsaW5nXG4gICAgICAgIHRoaXMudHJhbnNsYXRhYmxlID0gdHJhbnNsYXRhYmxlXG4gICAgICAgIHRoaXMuc2NhbGFibGUgPSBzY2FsYWJsZVxuICAgICAgICB0aGlzLnJvdGF0YWJsZSA9IHJvdGF0YWJsZVxuICAgICAgICB0aGlzLnJlc2l6YWJsZSA9IHJlc2l6YWJsZVxuICAgICAgICB0aGlzLm1vdXNlWm9vbUZhY3RvciA9IG1vdXNlWm9vbUZhY3RvclxuICAgICAgICB0aGlzLmF1dG9CcmluZ1RvRnJvbnQgPSBhdXRvQnJpbmdUb0Zyb250XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLm9uVHJhbnNmb3JtID0gb25UcmFuc2Zvcm0gIT0gbnVsbCA/IFtvblRyYW5zZm9ybV0gOiBudWxsXG4gICAgfVxuXG4gICAgYWRkVHJhbnNmb3JtRXZlbnRDYWxsYmFjayhjYWxsYmFjaykge1xuICAgICAgICBpZiAodGhpcy5vblRyYW5zZm9ybSA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLm9uVHJhbnNmb3JtID0gW11cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uVHJhbnNmb3JtLnB1c2goY2FsbGJhY2spXG4gICAgfVxuXG4gICAgc3RhcnRHZXN0dXJlKGludGVyYWN0aW9uKSB7XG4gICAgICAgIHRoaXMuYnJpbmdUb0Zyb250KClcbiAgICAgICAgdGhpcy5raWxsQW5pbWF0aW9uKClcbiAgICAgICAgdGhpcy5vYnNlcnZlVmVsb2NpdHkoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGdlc3R1cmUoaW50ZXJhY3Rpb24pIHtcbiAgICAgICAgbGV0IGRlbHRhID0gaW50ZXJhY3Rpb24uZGVsdGEoKVxuICAgICAgICBpZiAoZGVsdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5hZGRWZWxvY2l0eShkZWx0YSlcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtKGRlbHRhLCBkZWx0YS56b29tLCBkZWx0YS5yb3RhdGUsIGRlbHRhLmFib3V0KVxuICAgICAgICAgICAgaWYgKGRlbHRhLnpvb20gIT0gMSkgdGhpcy5pbnRlcmFjdGlvbkFuY2hvciA9IGRlbHRhLmFib3V0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgcG9seWdvbigpIHtcbiAgICAgICAgbGV0IHcyID0gdGhpcy53aWR0aCAqIHRoaXMuc2NhbGUgLyAyXG4gICAgICAgIGxldCBoMiA9IHRoaXMuaGVpZ2h0ICogdGhpcy5zY2FsZSAvIDJcbiAgICAgICAgbGV0IGNlbnRlciA9IHRoaXMuY2VudGVyXG4gICAgICAgIGxldCBwb2x5Z29uID0gbmV3IFBvbHlnb24oY2VudGVyKVxuICAgICAgICBwb2x5Z29uLmFkZFBvaW50KHt4OiAtdzIsIHk6IC1oMn0pXG4gICAgICAgIHBvbHlnb24uYWRkUG9pbnQoe3g6IHcyLCB5OiAtaDJ9KVxuICAgICAgICBwb2x5Z29uLmFkZFBvaW50KHt4OiB3MiwgeTogaDJ9KVxuICAgICAgICBwb2x5Z29uLmFkZFBvaW50KHt4OiAtdzIsIHk6IGgyfSlcbiAgICAgICAgcG9seWdvbi5yb3RhdGUodGhpcy5yb3RhdGlvbilcbiAgICAgICAgcmV0dXJuIHBvbHlnb25cbiAgICB9XG5cbiAgICBpc091dHNpZGUoKSB7XG4gICAgICAgIGxldCBzdGFnZVBvbHlnb24gPSB0aGlzLmNvbnRhaW5lclBvbHlnb25cbiAgICAgICAgbGV0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25cbiAgICAgICAgbGV0IHJlc3VsdCA9IHN0YWdlUG9seWdvbi5pbnRlcnNlY3RzV2l0aChwb2x5Z29uKVxuICAgICAgICByZXR1cm4gcmVzdWx0ID09PSBmYWxzZSB8fCByZXN1bHQub3ZlcmxhcCA8IHRoaXMudGhyb3dWaXNpYmlsaXR5XG4gICAgfVxuXG4gICAgcmVjZW50ZXIoKSB7XG4gICAgICAgIC8vIFJldHVybiBhIHNtYWxsIHZlY3RvciB0aGF0IGd1YXJhbnRlZXMgdGhhdCB0aGUgc2NhdHRlciBpcyBtb3ZpbmdcbiAgICAgICAgLy8gdG93YXJkcyB0aGUgY2VudGVyIG9mIHRoZSBzdGFnZVxuICAgICAgICBsZXQgY2VudGVyID0gdGhpcy5jZW50ZXJcbiAgICAgICAgbGV0IHRhcmdldCA9IHRoaXMuY29udGFpbmVyLmNlbnRlclxuICAgICAgICBsZXQgZGVsdGEgPSBQb2ludHMuc3VidHJhY3QodGFyZ2V0LCBjZW50ZXIpXG4gICAgICAgIHJldHVybiBQb2ludHMubm9ybWFsaXplKGRlbHRhKVxuICAgIH1cblxuICAgIG5leHRWZWxvY2l0eSh2ZWxvY2l0eSkge1xuICAgICAgICByZXR1cm4gdGhpcy5rZWVwT25TdGFnZSh2ZWxvY2l0eSlcbiAgICB9XG5cbiAgICBib3VuY2luZygpIHtcbiAgICAgICAgLy8gSW1wbGVtZW50cyB0aGUgYm91bmNpbmcgYmVoYXZpb3Igb2YgdGhlIHNjYXR0ZXIuIE1vdmVzIHRoZSBzY2F0dGVyXG4gICAgICAgIC8vIHRvIHRoZSBjZW50ZXIgb2YgdGhlIHN0YWdlIGlmIHRoZSBzY2F0dGVyIGlzIG91dHNpZGUgdGhlIHN0YWdlIG9yXG4gICAgICAgIC8vIG5vdCB3aXRoaW4gdGhlIGxpbWl0cyBvZiB0aGUgdGhyb3dWaXNpYmlsaXR5LlxuXG4gICAgICAgIGxldCBzdGFnZVBvbHlnb24gPSB0aGlzLmNvbnRhaW5lclBvbHlnb25cbiAgICAgICAgbGV0IHBvbHlnb24gPSB0aGlzLnBvbHlnb25cbiAgICAgICAgbGV0IHJlc3VsdCA9IHN0YWdlUG9seWdvbi5pbnRlcnNlY3RzV2l0aChwb2x5Z29uKVxuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSB8fCByZXN1bHQub3ZlcmxhcCA8IHRoaXMudGhyb3dWaXNpYmlsaXR5KSB7XG4gICAgICAgICAgICBsZXQgY3YgPSB0aGlzLnJlY2VudGVyKClcbiAgICAgICAgICAgIGxldCByZWNlbnRlcmVkID0gZmFsc2VcbiAgICAgICAgICAgIHdoaWxlIChyZXN1bHQgPT09IGZhbHNlIHx8IHJlc3VsdC5vdmVybGFwIDwgdGhpcy50aHJvd1Zpc2liaWxpdHkpIHtcbiAgICAgICAgICAgICAgICBwb2x5Z29uLmNlbnRlci54ICs9IGN2LnhcbiAgICAgICAgICAgICAgICBwb2x5Z29uLmNlbnRlci55ICs9IGN2LnlcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3ZlKGN2KVxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHN0YWdlUG9seWdvbi5pbnRlcnNlY3RzV2l0aChwb2x5Z29uKVxuICAgICAgICAgICAgICAgIHJlY2VudGVyZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVjZW50ZXJlZFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGtlZXBPblN0YWdlKHZlbG9jaXR5LCBjb2xsaXNpb24gPSAwLjUpIHtcbiAgICAgICAgbGV0IHN0YWdlUG9seWdvbiA9IHRoaXMuY29udGFpbmVyUG9seWdvblxuICAgICAgICBpZiAoIXN0YWdlUG9seWdvbikgcmV0dXJuXG4gICAgICAgIGxldCBwb2x5Z29uID0gdGhpcy5wb2x5Z29uXG4gICAgICAgIGxldCBib3VuY2VkID0gdGhpcy5ib3VuY2luZygpXG4gICAgICAgIGlmIChib3VuY2VkKSB7XG4gICAgICAgICAgICBsZXQgc3RhZ2UgPSB0aGlzLmNvbnRhaW5lckJvdW5kc1xuICAgICAgICAgICAgbGV0IHggPSB0aGlzLmNlbnRlci54XG4gICAgICAgICAgICBsZXQgeSA9IHRoaXMuY2VudGVyLnlcbiAgICAgICAgICAgIGxldCBkeCA9IHRoaXMubW92YWJsZVggPyB2ZWxvY2l0eS54IDogMFxuICAgICAgICAgICAgbGV0IGR5ID0gdGhpcy5tb3ZhYmxlWSA/IHZlbG9jaXR5LnkgOiAwXG4gICAgICAgICAgICBsZXQgZmFjdG9yID0gdGhpcy50aHJvd0RhbXBpbmdcbiAgICAgICAgICAgIC8vIGlmIChyZWNlbnRlcmVkKSB7XG4gICAgICAgICAgICBpZiAoeCA8IDApIHtcbiAgICAgICAgICAgICAgICBkeCA9IC1keFxuICAgICAgICAgICAgICAgIGZhY3RvciA9IGNvbGxpc2lvblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHggPiBzdGFnZS53aWR0aCkge1xuICAgICAgICAgICAgICAgIGR4ID0gLWR4XG4gICAgICAgICAgICAgICAgZmFjdG9yID0gY29sbGlzaW9uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoeSA8IDApIHtcbiAgICAgICAgICAgICAgICBkeSA9IC1keVxuICAgICAgICAgICAgICAgIGZhY3RvciA9IGNvbGxpc2lvblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHkgPiBzdGFnZS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBkeSA9IC1keVxuICAgICAgICAgICAgICAgIGZhY3RvciA9IGNvbGxpc2lvblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgcmV0dXJuIFBvaW50cy5tdWx0aXBseVNjYWxhcih7eDogZHgsIHk6IGR5fSwgZmFjdG9yKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5uZXh0VmVsb2NpdHkodmVsb2NpdHkpXG4gICAgfVxuXG4gICAgZW5kR2VzdHVyZShpbnRlcmFjdGlvbikge1xuICAgICAgICAvL3RoaXMuc3RhcnRUaHJvdygpXG4gICAgfVxuXG4gICAgcm90YXRlRGVncmVlcyhkZWdyZWVzLCBhbmNob3IpIHtcbiAgICAgICAgbGV0IHJhZCA9IEFuZ2xlLmRlZ3JlZTJyYWRpYW4oZGVncmVlcylcbiAgICAgICAgdGhpcy5yb3RhdGUocmFkLCBhbmNob3IpXG4gICAgfVxuXG4gICAgcm90YXRlKHJhZCwgYW5jaG9yKSB7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtKHt4OiAwLCB5OiAwfSwgMS4wLCByYWQsIGFuY2hvcilcbiAgICB9XG5cbiAgICBtb3ZlKGQsIHthbmltYXRlID0gMH0gPSB7fSkge1xuICAgICAgICBpZiAodGhpcy50cmFuc2xhdGFibGUpIHtcbiAgICAgICAgICAgIGlmIChhbmltYXRlID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBzdGFydFBvcyA9IHRoaXMucG9zaXRpb25cbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8odGhpcywgYW5pbWF0ZSwge1xuICAgICAgICAgICAgICAgICAgICB4OiAnKz0nICsgZC54LFxuICAgICAgICAgICAgICAgICAgICB5OiAnKz0nICsgZC55LFxuICAgICAgICAgICAgICAgICAgICAvKiBzY2FsZTogc2NhbGUsIHVvOiBub3QgZGVmaW5lZCwgd2h5IHdhcyB0aGlzIGhlcmU/ICovXG4gICAgICAgICAgICAgICAgICAgIG9uVXBkYXRlOiBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwID0gdGhpcy5wb3NpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGR4ID0gcC54IC0gc3RhcnRQb3MueFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGR5ID0gcC54IC0gc3RhcnRQb3MueVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vdmVkKGR4LCBkeSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vdmUoZClcbiAgICAgICAgICAgICAgICB0aGlzLm9uTW92ZWQoZC54LCBkLnkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlVG8ocCwge2FuaW1hdGUgPSAwfSA9IHt9KSB7XG4gICAgICAgIGxldCBjID0gdGhpcy5vcmlnaW5cbiAgICAgICAgbGV0IGRlbHRhID0gUG9pbnRzLnN1YnRyYWN0KHAsIGMpXG4gICAgICAgIHRoaXMubW92ZShkZWx0YSwge2FuaW1hdGU6IGFuaW1hdGV9KVxuICAgIH1cblxuICAgIGNlbnRlckF0KHAsIHthbmltYXRlID0gMH0gPSB7fSkge1xuICAgICAgICBsZXQgYyA9IHRoaXMuY2VudGVyXG4gICAgICAgIGxldCBkZWx0YSA9IFBvaW50cy5zdWJ0cmFjdChwLCBjKVxuICAgICAgICB0aGlzLm1vdmUoZGVsdGEsIHthbmltYXRlOiBhbmltYXRlfSlcbiAgICB9XG5cbiAgICB6b29tKFxuICAgICAgICBzY2FsZSxcbiAgICAgICAge1xuICAgICAgICAgICAgYW5pbWF0ZSA9IDAsXG4gICAgICAgICAgICBhYm91dCA9IG51bGwsXG4gICAgICAgICAgICBkZWxheSA9IDAsXG4gICAgICAgICAgICB4ID0gbnVsbCxcbiAgICAgICAgICAgIHkgPSBudWxsLFxuICAgICAgICAgICAgb25Db21wbGV0ZSA9IG51bGxcbiAgICAgICAgfSA9IHt9XG4gICAgKSB7XG4gICAgICAgIGxldCBhbmNob3IgPSBhYm91dCB8fCB0aGlzLmNlbnRlclxuICAgICAgICBpZiAoc2NhbGUgIT0gdGhpcy5zY2FsZSkge1xuICAgICAgICAgICAgaWYgKGFuaW1hdGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMsIGFuaW1hdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6IHNjYWxlLFxuICAgICAgICAgICAgICAgICAgICBkZWxheTogZGVsYXksXG4gICAgICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IG9uQ29tcGxldGUsXG4gICAgICAgICAgICAgICAgICAgIG9uVXBkYXRlOiB0aGlzLm9uWm9vbWVkLmJpbmQodGhpcylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjYWxlID0gc2NhbGVcbiAgICAgICAgICAgICAgICB0aGlzLm9uWm9vbWVkKGFuY2hvcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9tb3ZlKGRlbHRhKSB7XG4gICAgICAgIHRoaXMueCArPSB0aGlzLm1vdmFibGVYID8gZGVsdGEueCA6IDBcbiAgICAgICAgdGhpcy55ICs9IHRoaXMubW92YWJsZVggPyBkZWx0YS55IDogMFxuICAgIH1cblxuICAgIHRyYW5zZm9ybSh0cmFuc2xhdGUsIHpvb20sIHJvdGF0ZSwgYW5jaG9yKSB7XG4gICAgICAgIGxldCBkZWx0YSA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMubW92YWJsZVggPyB0cmFuc2xhdGUueCA6IDAsXG4gICAgICAgICAgICB5OiB0aGlzLm1vdmFibGVZID8gdHJhbnNsYXRlLnkgOiAwXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVzaXphYmxlKSB2YXIgdnpvb20gPSB6b29tXG4gICAgICAgIGlmICghdGhpcy50cmFuc2xhdGFibGUpIGRlbHRhID0ge3g6IDAsIHk6IDB9XG4gICAgICAgIGlmICghdGhpcy5yb3RhdGFibGUpIHJvdGF0ZSA9IDBcbiAgICAgICAgaWYgKCF0aGlzLnNjYWxhYmxlKSB6b29tID0gMS4wXG4gICAgICAgIGlmICh6b29tID09IDEuMCAmJiByb3RhdGUgPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fbW92ZShkZWx0YSlcbiAgICAgICAgICAgIGlmICh0aGlzLm9uVHJhbnNmb3JtICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXZlbnQgPSBuZXcgU2NhdHRlckV2ZW50KHRoaXMsIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlOiBkZWx0YSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0ZTogMCxcbiAgICAgICAgICAgICAgICAgICAgYWJvdXQ6IGFuY2hvcixcbiAgICAgICAgICAgICAgICAgICAgZmFzdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFVQREFURVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgdGhpcy5vblRyYW5zZm9ybS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgICAgICAgICAgZihldmVudClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9yaWdpbiA9IHRoaXMucm90YXRpb25PcmlnaW5cbiAgICAgICAgbGV0IGJldGEgPSBQb2ludHMuYW5nbGUob3JpZ2luLCBhbmNob3IpXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IFBvaW50cy5kaXN0YW5jZShvcmlnaW4sIGFuY2hvcilcbiAgICAgICAgbGV0IG5ld1NjYWxlID0gdGhpcy5zY2FsZSAqIHpvb21cblxuICAgICAgICBsZXQgbWluU2NhbGUgPSB0aGlzLm1pblNjYWxlIC8gdGhpcy5vdmVyZG9TY2FsaW5nXG4gICAgICAgIGxldCBtYXhTY2FsZSA9IHRoaXMubWF4U2NhbGUgKiB0aGlzLm92ZXJkb1NjYWxpbmdcbiAgICAgICAgaWYgKG5ld1NjYWxlIDwgbWluU2NhbGUpIHtcbiAgICAgICAgICAgIG5ld1NjYWxlID0gbWluU2NhbGVcbiAgICAgICAgICAgIHpvb20gPSBuZXdTY2FsZSAvIHRoaXMuc2NhbGVcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV3U2NhbGUgPiBtYXhTY2FsZSkge1xuICAgICAgICAgICAgbmV3U2NhbGUgPSBtYXhTY2FsZVxuICAgICAgICAgICAgem9vbSA9IG5ld1NjYWxlIC8gdGhpcy5zY2FsZVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5ld09yaWdpbiA9IFBvaW50cy5hcmMoYW5jaG9yLCBiZXRhICsgcm90YXRlLCBkaXN0YW5jZSAqIHpvb20pXG4gICAgICAgIGxldCBleHRyYSA9IFBvaW50cy5zdWJ0cmFjdChuZXdPcmlnaW4sIG9yaWdpbilcbiAgICAgICAgbGV0IG9mZnNldCA9IFBvaW50cy5zdWJ0cmFjdChhbmNob3IsIG9yaWdpbilcbiAgICAgICAgdGhpcy5fbW92ZShvZmZzZXQpXG4gICAgICAgIHRoaXMuc2NhbGUgPSBuZXdTY2FsZVxuICAgICAgICB0aGlzLnJvdGF0aW9uICs9IHJvdGF0ZVxuICAgICAgICBvZmZzZXQgPSBQb2ludHMubmVnYXRlKG9mZnNldClcbiAgICAgICAgb2Zmc2V0ID0gUG9pbnRzLmFkZChvZmZzZXQsIGV4dHJhKVxuICAgICAgICBvZmZzZXQgPSBQb2ludHMuYWRkKG9mZnNldCwgdHJhbnNsYXRlKVxuICAgICAgICB0aGlzLl9tb3ZlKG9mZnNldClcblxuICAgICAgICBpZiAodGhpcy5vblRyYW5zZm9ybSAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgZXZlbnQgPSBuZXcgU2NhdHRlckV2ZW50KHRoaXMsIHtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGU6IGRlbHRhLFxuICAgICAgICAgICAgICAgIHNjYWxlOiBuZXdTY2FsZSxcbiAgICAgICAgICAgICAgICByb3RhdGU6IHJvdGF0ZSxcbiAgICAgICAgICAgICAgICBhYm91dDogYW5jaG9yXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5vblRyYW5zZm9ybS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgICAgICBmKGV2ZW50KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yZXNpemFibGUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzaXplQWZ0ZXJUcmFuc2Zvcm0odnpvb20pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNpemVBZnRlclRyYW5zZm9ybSh6b29tKSB7XG4gICAgICAgIC8vIE92ZXJ3cml0ZSB0aGlzIGluIHN1YmNsYXNzZXMuXG4gICAgfVxuXG4gICAgdmFsaWRTY2FsZShzY2FsZSkge1xuICAgICAgICBzY2FsZSA9IE1hdGgubWF4KHNjYWxlLCB0aGlzLm1pblNjYWxlKVxuICAgICAgICBzY2FsZSA9IE1hdGgubWluKHNjYWxlLCB0aGlzLm1heFNjYWxlKVxuICAgICAgICByZXR1cm4gc2NhbGVcbiAgICB9XG5cbiAgICBhbmltYXRlWm9vbUJvdW5jZShkdCA9IDEpIHtcbiAgICAgICAgaWYgKHRoaXMuem9vbUFuY2hvciAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgem9vbSA9IDFcbiAgICAgICAgICAgIGxldCBhbW91bnQgPSBNYXRoLm1pbigwLjAxLCAwLjMgKiBkdCAvIDEwMDAwMC4wKVxuICAgICAgICAgICAgaWYgKHRoaXMuc2NhbGUgPCB0aGlzLm1pblNjYWxlKSB6b29tID0gMSArIGFtb3VudFxuICAgICAgICAgICAgaWYgKHRoaXMuc2NhbGUgPiB0aGlzLm1heFNjYWxlKSB6b29tID0gMSAtIGFtb3VudFxuICAgICAgICAgICAgaWYgKHpvb20gIT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtKHt4OiAwLCB5OiAwfSwgem9vbSwgMCwgdGhpcy56b29tQW5jaG9yKVxuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShkdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZVpvb21Cb3VuY2UoZHQpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuem9vbUFuY2hvciA9IG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrU2NhbGluZyhhYm91dCwgZGVsYXkgPSAwKSB7XG4gICAgICAgIHRoaXMuem9vbUFuY2hvciA9IGFib3V0XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmFuaW1hdGVab29tQm91bmNlLmJpbmQodGhpcykpXG4gICAgICAgIHNldFRpbWVvdXQodGhpcy5hbmltYXRlWm9vbUJvdW5jZS5iaW5kKHRoaXMpLCBkZWxheSlcbiAgICB9XG5cbiAgICBvbk1vdXNlV2hlZWwoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmNsYWltZWRCeVNjYXR0ZXIpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5jbGFpbWVkQnlTY2F0dGVyICE9IHRoaXMpIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHRoaXMua2lsbEFuaW1hdGlvbigpXG4gICAgICAgIHRoaXMudGFyZ2V0U2NhbGUgPSBudWxsXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBldmVudC5kZXRhaWwgPCAwIHx8IGV2ZW50LndoZWVsRGVsdGEgPiAwXG4gICAgICAgIGxldCBnbG9iYWxQb2ludCA9IHt4OiBldmVudC5jbGllbnRYLCB5OiBldmVudC5jbGllbnRZfVxuICAgICAgICBsZXQgY2VudGVyUG9pbnQgPSB0aGlzLm1hcFBvc2l0aW9uVG9Db250YWluZXJQb2ludChnbG9iYWxQb2ludClcbiAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBsZXQgZGVncmVlcyA9IGRpcmVjdGlvbiA/IDUgOiAtNVxuICAgICAgICAgICAgbGV0IHJhZCA9IEFuZ2xlLmRlZ3JlZTJyYWRpYW4oZGVncmVlcylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybSh7eDogMCwgeTogMH0sIDEuMCwgcmFkLCBjZW50ZXJQb2ludClcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB6b29tRmFjdG9yID0gdGhpcy5tb3VzZVpvb21GYWN0b3JcbiAgICAgICAgbGV0IHpvb20gPSBkaXJlY3Rpb24gPyB6b29tRmFjdG9yIDogMSAvIHpvb21GYWN0b3JcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oe3g6IDAsIHk6IDB9LCB6b29tLCAwLCBjZW50ZXJQb2ludClcbiAgICAgICAgdGhpcy5jaGVja1NjYWxpbmcoY2VudGVyUG9pbnQsIDIwMClcblxuICAgICAgICBpZiAodGhpcy5vblRyYW5zZm9ybSAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgZXZlbnQgPSBuZXcgU2NhdHRlckV2ZW50KHRoaXMsIHtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGU6IHt4OiAwLCB5OiAwfSxcbiAgICAgICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICAgICAgICByb3RhdGU6IDAsXG4gICAgICAgICAgICAgICAgYWJvdXQ6IG51bGwsXG4gICAgICAgICAgICAgICAgZmFzdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdHlwZTogWk9PTVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMub25UcmFuc2Zvcm0uZm9yRWFjaChmdW5jdGlvbihmKSB7XG4gICAgICAgICAgICAgICAgZihldmVudClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblN0YXJ0KGV2ZW50LCBpbnRlcmFjdGlvbikge1xuICAgICAgICBpZiAodGhpcy5zdGFydEdlc3R1cmUoaW50ZXJhY3Rpb24pKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZVxuICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGlvbkFuY2hvciA9IG51bGxcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vblRyYW5zZm9ybSAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgZXZlbnQgPSBuZXcgU2NhdHRlckV2ZW50KHRoaXMsIHtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGU6IHt4OiAwLCB5OiAwfSxcbiAgICAgICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICAgICAgICByb3RhdGU6IDAsXG4gICAgICAgICAgICAgICAgYWJvdXQ6IG51bGwsXG4gICAgICAgICAgICAgICAgZmFzdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdHlwZTogU1RBUlRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLm9uVHJhbnNmb3JtLmZvckVhY2goZnVuY3Rpb24oZikge1xuICAgICAgICAgICAgICAgIGYoZXZlbnQpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Nb3ZlKGV2ZW50LCBpbnRlcmFjdGlvbikge1xuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xuICAgICAgICAgICAgdGhpcy5nZXN0dXJlKGludGVyYWN0aW9uKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25FbmQoZXZlbnQsIGludGVyYWN0aW9uKSB7XG4gICAgICAgIGlmIChpbnRlcmFjdGlvbi5pc0ZpbmlzaGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kR2VzdHVyZShpbnRlcmFjdGlvbilcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZVxuICAgICAgICAgICAgZm9yIChsZXQga2V5IG9mIGludGVyYWN0aW9uLmVuZGVkLmtleXMoKSkge1xuICAgICAgICAgICAgICAgIGlmIChpbnRlcmFjdGlvbi5pc1RhcChrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwb2ludCA9IGludGVyYWN0aW9uLmVuZGVkLmdldChrZXkpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25UYXAoZXZlbnQsIGludGVyYWN0aW9uLCBwb2ludClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5vblRyYW5zZm9ybSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IGV2ZW50ID0gbmV3IFNjYXR0ZXJFdmVudCh0aGlzLCB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZToge3g6IDAsIHk6IDB9LFxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgcm90YXRlOiAwLFxuICAgICAgICAgICAgICAgICAgICBhYm91dDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgZmFzdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IEVORFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgdGhpcy5vblRyYW5zZm9ybS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgICAgICAgICAgZihldmVudClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBhYm91dCA9IHRoaXMuaW50ZXJhY3Rpb25BbmNob3JcbiAgICAgICAgaWYgKGFib3V0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTY2FsaW5nKGFib3V0LCAxMDApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRhcChldmVudCwgaW50ZXJhY3Rpb24sIHBvaW50KSB7fVxuXG4gICAgb25EcmFnVXBkYXRlKGRlbHRhKSB7XG4gICAgICAgIGlmICh0aGlzLm9uVHJhbnNmb3JtICE9IG51bGwpIHtcbiAgICAgICAgICAgIGxldCBldmVudCA9IG5ldyBTY2F0dGVyRXZlbnQodGhpcywge1xuICAgICAgICAgICAgICAgIGZhc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlOiBkZWx0YSxcbiAgICAgICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZSxcbiAgICAgICAgICAgICAgICBhYm91dDogdGhpcy5jdXJyZW50QWJvdXQsXG4gICAgICAgICAgICAgICAgdHlwZTogbnVsbFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMub25UcmFuc2Zvcm0uZm9yRWFjaChmdW5jdGlvbihmKSB7XG4gICAgICAgICAgICAgICAgZihldmVudClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkRyYWdDb21wbGV0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMub25UcmFuc2Zvcm0pIHtcbiAgICAgICAgICAgIGxldCBldmVudCA9IG5ldyBTY2F0dGVyRXZlbnQodGhpcywge1xuICAgICAgICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLFxuICAgICAgICAgICAgICAgIGFib3V0OiB0aGlzLmN1cnJlbnRBYm91dCxcbiAgICAgICAgICAgICAgICBmYXN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBudWxsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5vblRyYW5zZm9ybS5mb3JFYWNoKGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgICAgICBmKGV2ZW50KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uTW92ZWQoZHgsIGR5LCBhYm91dCkge1xuICAgICAgICBpZiAodGhpcy5vblRyYW5zZm9ybSAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgZXZlbnQgPSBuZXcgU2NhdHRlckV2ZW50KHRoaXMsIHtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGU6IHt4OiBkeCwgeTogZHl9LFxuICAgICAgICAgICAgICAgIGFib3V0OiBhYm91dCxcbiAgICAgICAgICAgICAgICBmYXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHR5cGU6IG51bGxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLm9uVHJhbnNmb3JtLmZvckVhY2goZnVuY3Rpb24oZikge1xuICAgICAgICAgICAgICAgIGYoZXZlbnQpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25ab29tZWQoYWJvdXQpIHtcbiAgICAgICAgaWYgKHRoaXMub25UcmFuc2Zvcm0gIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IGV2ZW50ID0gbmV3IFNjYXR0ZXJFdmVudCh0aGlzLCB7XG4gICAgICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgICAgICAgYWJvdXQ6IGFib3V0LFxuICAgICAgICAgICAgICAgIGZhc3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHR5cGU6IG51bGxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLm9uVHJhbnNmb3JtLmZvckVhY2goZnVuY3Rpb24oZikge1xuICAgICAgICAgICAgICAgIGYoZXZlbnQpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKiogQSBjb250YWluZXIgZm9yIHNjYXR0ZXIgb2JqZWN0cywgd2hpY2ggdXNlcyBhIHNpbmdsZSBJbnRlcmFjdGlvbk1hcHBlclxuICogZm9yIGFsbCBjaGlsZHJlbi4gVGhpcyByZWR1Y2VzIHRoZSBudW1iZXIgb2YgcmVnaXN0ZXJlZCBldmVudCBoYW5kbGVyc1xuICogYW5kIGNvdmVycyB0aGUgY29tbW9uIHVzZSBjYXNlIHRoYXQgbXVsdGlwbGUgb2JqZWN0cyBhcmUgc2NhdHRlcmVkXG4gKiBvbiB0aGUgc2FtZSBsZXZlbC5cbiAqL1xuZXhwb3J0IGNsYXNzIERPTVNjYXR0ZXJDb250YWluZXIge1xuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7RE9NIG5vZGV9IGVsZW1lbnQgLSBET00gZWxlbWVudCB0aGF0IHJlY2VpdmVzIGV2ZW50c1xuICAgICAqIEBwYXJhbSB7Qm9vbH0gc3RvcEV2ZW50cyAtICBXaGV0aGVyIGV2ZW50cyBzaG91bGQgYmUgc3RvcHBlZCBvciBwcm9wYWdhdGVkXG4gICAgICogQHBhcmFtIHtCb29sfSBjbGFpbUV2ZW50cyAtIFdoZXRoZXIgZXZlbnRzIHNob3VsZCBiZSBtYXJrZWQgYXMgY2xhaW1lZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBmaW5kVGFyZ2V0IHJldHVybiBhcyBub24tbnVsbCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge0Jvb2x9IHRvdWNoQWN0aW9uIC0gQ1NTIHRvIHNldCB0b3VjaCBhY3Rpb24gc3R5bGUsIG5lZWRlZCB0byBwcmV2ZW50XG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVyIGNhbmNlbCBldmVudHMuIFVzZSBudWxsIGlmIHRoZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHRvdWNoIGFjdGlvbiBzaG91bGQgbm90IGJlIHNldC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgZWxlbWVudCxcbiAgICAgICAge3N0b3BFdmVudHMgPSAnYXV0bycsIGNsYWltRXZlbnRzID0gdHJ1ZSwgdG91Y2hBY3Rpb24gPSAnbm9uZSd9ID0ge31cbiAgICApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICAgICAgICBpZiAoc3RvcEV2ZW50cyA9PT0gJ2F1dG8nKSB7XG4gICAgICAgICAgICBpZiAoQ2FwYWJpbGl0aWVzLmlzU2FmYXJpKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgJ3RvdWNobW92ZScsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50ID0+IHRoaXMucHJldmVudFBpbmNoKGV2ZW50KSxcbiAgICAgICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgc3RvcEV2ZW50cyA9IGZhbHNlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0b3BFdmVudHMgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdG9wRXZlbnRzID0gc3RvcEV2ZW50c1xuICAgICAgICB0aGlzLmNsYWltRXZlbnRzID0gY2xhaW1FdmVudHNcbiAgICAgICAgaWYgKHRvdWNoQWN0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICBFbGVtZW50cy5zZXRTdHlsZShlbGVtZW50LCB7dG91Y2hBY3Rpb259KVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NhdHRlciA9IG5ldyBNYXAoKVxuICAgICAgICB0aGlzLmRlbGVnYXRlID0gbmV3IEludGVyYWN0aW9uTWFwcGVyKGVsZW1lbnQsIHRoaXMsIHtcbiAgICAgICAgICAgIG1vdXNlV2hlZWxFbGVtZW50OiB3aW5kb3dcbiAgICAgICAgfSlcblxuICAgICAgICBpZiAodHlwZW9mIGRlYnVnQ2FudmFzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGR0ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dUb3VjaGVzKGR0KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3dUb3VjaGVzKGR0KSB7XG4gICAgICAgIGxldCByZXNvbHV0aW9uID0gd2luZG93LmRldmljZVBpeGVsUmF0aW9cbiAgICAgICAgbGV0IGNhbnZhcyA9IGRlYnVnQ2FudmFzXG4gICAgICAgIGxldCBjdXJyZW50ID0gdGhpcy5kZWxlZ2F0ZS5pbnRlcmFjdGlvbi5jdXJyZW50XG4gICAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgICAgICAgbGV0IHJhZGl1cyA9IDIwICogcmVzb2x1dGlvblxuICAgICAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC4zKSdcbiAgICAgICAgY29udGV4dC5saW5lV2lkdGggPSAyXG4gICAgICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzAwMzMwMCdcbiAgICAgICAgZm9yIChsZXQgW2tleSwgcG9pbnRdIG9mIGN1cnJlbnQuZW50cmllcygpKSB7XG4gICAgICAgICAgICBsZXQgbG9jYWwgPSBwb2ludFxuICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKVxuICAgICAgICAgICAgY29udGV4dC5hcmMoXG4gICAgICAgICAgICAgICAgbG9jYWwueCAqIHJlc29sdXRpb24sXG4gICAgICAgICAgICAgICAgbG9jYWwueSAqIHJlc29sdXRpb24sXG4gICAgICAgICAgICAgICAgcmFkaXVzLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgMiAqIE1hdGguUEksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpXG4gICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpXG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGR0ID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2hvd1RvdWNoZXMoZHQpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcHJldmVudFBpbmNoKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50ID0gZXZlbnQub3JpZ2luYWxFdmVudCB8fCBldmVudFxuICAgICAgICBpZiAoZXZlbnQuc2NhbGUgIT09IDEpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZChzY2F0dGVyKSB7XG4gICAgICAgIHRoaXMuc2NhdHRlci5zZXQoc2NhdHRlci5lbGVtZW50LCBzY2F0dGVyKVxuICAgIH1cblxuICAgIGNhcHR1cmUoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PSB0aGlzLmVsZW1lbnQgJiYgdGhpcy5zdG9wRXZlbnRzKSBFdmVudHMuc3RvcChldmVudClcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBtYXBQb3NpdGlvblRvUG9pbnQocG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIFBvaW50cy5mcm9tUGFnZVRvTm9kZSh0aGlzLmVsZW1lbnQsIHBvaW50KVxuICAgIH1cblxuICAgIGlzRGVzY2VuZGFudChwYXJlbnQsIGNoaWxkLCBjbGlja2FibGUgPSBmYWxzZSkge1xuICAgICAgICBpZiAocGFyZW50ID09IGNoaWxkKSByZXR1cm4gdHJ1ZVxuICAgICAgICBsZXQgbm9kZSA9IGNoaWxkLnBhcmVudE5vZGVcbiAgICAgICAgd2hpbGUgKG5vZGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKCFjbGlja2FibGUgJiYgbm9kZS5vbmNsaWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZSA9PSBwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGZpbmRUYXJnZXQoZXZlbnQsIGxvY2FsLCBnbG9iYWwpIHtcbiAgICAgICAgLyoqKiBOb3RlIHRoYXQgZWxlbWVudEZyb21Qb2ludCB3b3JrcyB3aXRoIGNsaWVudFgsIGNsaWVudFksIG5vdCBwYWdlWCwgcGFnZVlcbiAgICAgICAgVGhlIGltcG9ydGFudCBwb2ludCBpcyB0aGF0IGV2ZW50IHNob3VsZCBub3QgYmUgdXNlZCwgc2luY2UgdGhlIFRvdWNoRXZlbnRcbiAgICAgICAgcG9pbnRzIGFyZSBoaWRkZW4gaW4gc3ViIG9iamVjdHMuXG4gICAgICAgICoqKi9cbiAgICAgICAgbGV0IGZvdW5kID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChnbG9iYWwueCwgZ2xvYmFsLnkpXG4gICAgICAgIGZvciAobGV0IHRhcmdldCBvZiB0aGlzLnNjYXR0ZXIudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRGVzY2VuZGFudCh0YXJnZXQuZWxlbWVudCwgZm91bmQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RvcEV2ZW50cykgRXZlbnRzLnN0b3AoZXZlbnQpXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xhaW1FdmVudHMpIGV2ZW50LmNsYWltZWRCeVNjYXR0ZXIgPSB0YXJnZXRcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBnZXQgY2VudGVyKCkge1xuICAgICAgICBsZXQgciA9IHRoaXMuYm91bmRzXG4gICAgICAgIGxldCB3MiA9IHIud2lkdGggLyAyXG4gICAgICAgIGxldCBoMiA9IHIuaGVpZ2h0IC8gMlxuICAgICAgICByZXR1cm4ge3g6IHcyLCB5OiBoMn1cbiAgICB9XG5cbiAgICBnZXQgYm91bmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgfVxuXG4gICAgZ2V0IHBvbHlnb24oKSB7XG4gICAgICAgIGxldCByID0gdGhpcy5ib3VuZHNcbiAgICAgICAgbGV0IHcyID0gci53aWR0aCAvIDJcbiAgICAgICAgbGV0IGgyID0gci5oZWlnaHQgLyAyXG4gICAgICAgIGxldCBjZW50ZXIgPSB7eDogdzIsIHk6IGgyfVxuICAgICAgICBsZXQgcG9seWdvbiA9IG5ldyBQb2x5Z29uKGNlbnRlcilcbiAgICAgICAgcG9seWdvbi5hZGRQb2ludCh7eDogLXcyLCB5OiAtaDJ9KVxuICAgICAgICBwb2x5Z29uLmFkZFBvaW50KHt4OiB3MiwgeTogLWgyfSlcbiAgICAgICAgcG9seWdvbi5hZGRQb2ludCh7eDogdzIsIHk6IGgyfSlcbiAgICAgICAgcG9seWdvbi5hZGRQb2ludCh7eDogLXcyLCB5OiBoMn0pXG4gICAgICAgIHJldHVybiBwb2x5Z29uXG4gICAgfVxufVxuXG5sZXQgekluZGV4ID0gMTAwMFxuXG5leHBvcnQgY2xhc3MgRE9NU2NhdHRlciBleHRlbmRzIEFic3RyYWN0U2NhdHRlciB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGVsZW1lbnQsXG4gICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAge1xuICAgICAgICAgICAgc3RhcnRTY2FsZSA9IDEuMCxcbiAgICAgICAgICAgIG1pblNjYWxlID0gMC4xLFxuICAgICAgICAgICAgbWF4U2NhbGUgPSAxLjAsXG4gICAgICAgICAgICBvdmVyZG9TY2FsaW5nID0gMS41LFxuICAgICAgICAgICAgYXV0b0JyaW5nVG9Gcm9udCA9IHRydWUsXG4gICAgICAgICAgICB0cmFuc2xhdGFibGUgPSB0cnVlLFxuICAgICAgICAgICAgc2NhbGFibGUgPSB0cnVlLFxuICAgICAgICAgICAgcm90YXRhYmxlID0gdHJ1ZSxcbiAgICAgICAgICAgIG1vdmFibGVYID0gdHJ1ZSxcbiAgICAgICAgICAgIG1vdmFibGVZID0gdHJ1ZSxcbiAgICAgICAgICAgIHJvdGF0aW9uRGVncmVlcyA9IG51bGwsXG4gICAgICAgICAgICByb3RhdGlvbiA9IG51bGwsXG4gICAgICAgICAgICBvblRyYW5zZm9ybSA9IG51bGwsXG4gICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW4gPSAnY2VudGVyIGNlbnRlcicsXG4gICAgICAgICAgICAvLyBleHRyYXMgd2hpY2ggYXJlIGluIHBhcnQgbmVlZGVkXG4gICAgICAgICAgICB4ID0gMCxcbiAgICAgICAgICAgIHkgPSAwLFxuICAgICAgICAgICAgd2lkdGggPSBudWxsLFxuICAgICAgICAgICAgaGVpZ2h0ID0gbnVsbCxcbiAgICAgICAgICAgIHJlc2l6YWJsZSA9IGZhbHNlLFxuICAgICAgICAgICAgc2ltdWxhdGVDbGljayA9IGZhbHNlLFxuICAgICAgICAgICAgdmVyYm9zZSA9IHRydWUsXG4gICAgICAgICAgICBvblJlc2l6ZSA9IG51bGwsXG4gICAgICAgICAgICB0b3VjaEFjdGlvbiA9ICdub25lJyxcbiAgICAgICAgICAgIHRocm93VmlzaWJpbGl0eSA9IDQ0LFxuICAgICAgICAgICAgdGhyb3dEYW1waW5nID0gMC45NSxcbiAgICAgICAgICAgIGF1dG9UaHJvdyA9IHRydWVcbiAgICAgICAgfSA9IHt9XG4gICAgKSB7XG4gICAgICAgIHN1cGVyKHtcbiAgICAgICAgICAgIG1pblNjYWxlLFxuICAgICAgICAgICAgbWF4U2NhbGUsXG4gICAgICAgICAgICBzdGFydFNjYWxlLFxuICAgICAgICAgICAgb3ZlcmRvU2NhbGluZyxcbiAgICAgICAgICAgIGF1dG9CcmluZ1RvRnJvbnQsXG4gICAgICAgICAgICB0cmFuc2xhdGFibGUsXG4gICAgICAgICAgICBzY2FsYWJsZSxcbiAgICAgICAgICAgIHJvdGF0YWJsZSxcbiAgICAgICAgICAgIG1vdmFibGVYLFxuICAgICAgICAgICAgbW92YWJsZVksXG4gICAgICAgICAgICByZXNpemFibGUsXG4gICAgICAgICAgICByb3RhdGlvbkRlZ3JlZXMsXG4gICAgICAgICAgICByb3RhdGlvbixcbiAgICAgICAgICAgIG9uVHJhbnNmb3JtLFxuICAgICAgICAgICAgdGhyb3dWaXNpYmlsaXR5LFxuICAgICAgICAgICAgdGhyb3dEYW1waW5nLFxuICAgICAgICAgICAgYXV0b1Rocm93XG4gICAgICAgIH0pXG4gICAgICAgIGlmIChjb250YWluZXIgPT0gbnVsbCB8fCB3aWR0aCA9PSBudWxsIHx8IGhlaWdodCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdmFsdWU6IG51bGwnKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICAgICAgdGhpcy54ID0geFxuICAgICAgICB0aGlzLnkgPSB5XG4gICAgICAgIHRoaXMubWVhblggPSB4XG4gICAgICAgIHRoaXMubWVhblkgPSB5XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICAgICAgICB0aGlzLnRocm93VmlzaWJpbGl0eSA9IE1hdGgubWluKHdpZHRoLCBoZWlnaHQsIHRocm93VmlzaWJpbGl0eSlcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXJcbiAgICAgICAgdGhpcy5zaW11bGF0ZUNsaWNrID0gc2ltdWxhdGVDbGlja1xuICAgICAgICB0aGlzLnNjYWxlID0gc3RhcnRTY2FsZVxuICAgICAgICB0aGlzLnJvdGF0aW9uRGVncmVlcyA9IHRoaXMuc3RhcnRSb3RhdGlvbkRlZ3JlZXNcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1PcmlnaW4gPSB0cmFuc2Zvcm1PcmlnaW5cbiAgICAgICAgdGhpcy5pbml0aWFsVmFsdWVzID0ge1xuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHksXG4gICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgIHNjYWxlOiBzdGFydFNjYWxlLFxuICAgICAgICAgICAgcm90YXRpb246IHRoaXMuc3RhcnRSb3RhdGlvbkRlZ3JlZXMsXG4gICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46IHRyYW5zZm9ybU9yaWdpblxuICAgICAgICB9XG4gICAgICAgIC8vIEZvciB0d2VlbmxpdGUgd2UgbmVlZCBpbml0aWFsIHZhbHVlcyBpbiBfZ3NUcmFuc2Zvcm1cbiAgICAgICAgVHdlZW5MaXRlLnNldChlbGVtZW50LCB0aGlzLmluaXRpYWxWYWx1ZXMpXG4gICAgICAgIHRoaXMub25SZXNpemUgPSBvblJlc2l6ZVxuICAgICAgICB0aGlzLnZlcmJvc2UgPSB2ZXJib3NlXG4gICAgICAgIGlmICh0b3VjaEFjdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgRWxlbWVudHMuc2V0U3R5bGUoZWxlbWVudCwge3RvdWNoQWN0aW9ufSlcbiAgICAgICAgfVxuICAgICAgICBjb250YWluZXIuYWRkKHRoaXMpXG4gICAgfVxuXG4gICAgLyoqIFJldHVybnMgZ2VvbWV0cnkgZGF0YSBhcyBvYmplY3QuICoqL1xuICAgIGdldFN0YXRlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUsXG4gICAgICAgICAgICB4OiB0aGlzLngsXG4gICAgICAgICAgICB5OiB0aGlzLnksXG4gICAgICAgICAgICByb3RhdGlvbjogdGhpcy5yb3RhdGlvblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IHJvdGF0aW9uT3JpZ2luKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jZW50ZXJcbiAgICB9XG5cbiAgICBnZXQgeCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3hcbiAgICB9XG5cbiAgICBnZXQgeSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3lcbiAgICB9XG5cbiAgICBzZXQgeCh2YWx1ZSkge1xuICAgICAgICB0aGlzLl94ID0gdmFsdWVcbiAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLmVsZW1lbnQsIHt4OiB2YWx1ZX0pXG4gICAgfVxuXG4gICAgc2V0IHkodmFsdWUpIHtcbiAgICAgICAgdGhpcy5feSA9IHZhbHVlXG4gICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy5lbGVtZW50LCB7eTogdmFsdWV9KVxuICAgIH1cblxuICAgIGdldCBwb3NpdGlvbigpIHtcbiAgICAgICAgbGV0IHRyYW5zZm9ybSA9IHRoaXMuZWxlbWVudC5fZ3NUcmFuc2Zvcm1cbiAgICAgICAgbGV0IHggPSB0cmFuc2Zvcm0ueFxuICAgICAgICBsZXQgeSA9IHRyYW5zZm9ybS55XG4gICAgICAgIHJldHVybiB7eCwgeX1cbiAgICB9XG5cbiAgICBnZXQgb3JpZ2luKCkge1xuICAgICAgICBsZXQgcCA9IHRoaXMuZnJvbU5vZGVUb1BhZ2UoMCwgMClcbiAgICAgICAgcmV0dXJuIFBvaW50cy5mcm9tUGFnZVRvTm9kZSh0aGlzLmNvbnRhaW5lci5lbGVtZW50LCBwKVxuICAgIH1cblxuICAgIGdldCBib3VuZHMoKSB7XG4gICAgICAgIGxldCBzdGFnZSA9IHRoaXMuY29udGFpbmVyLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgbGV0IHJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogcmVjdC50b3AgLSBzdGFnZS50b3AsXG4gICAgICAgICAgICBsZWZ0OiByZWN0LmxlZnQgLSBzdGFnZS5sZWZ0LFxuICAgICAgICAgICAgd2lkdGg6IHJlY3Qud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgY2VudGVyKCkge1xuICAgICAgICBsZXQgciA9IHRoaXMuYm91bmRzXG4gICAgICAgIGxldCB3MiA9IHIud2lkdGggLyAyXG4gICAgICAgIGxldCBoMiA9IHIuaGVpZ2h0IC8gMlxuICAgICAgICBpZiAodGhpcy5yZXNpemFibGUpIHtcbiAgICAgICAgICAgIHcyICo9IHRoaXMuc2NhbGVcbiAgICAgICAgICAgIGgyICo9IHRoaXMuc2NhbGVcbiAgICAgICAgfVxuICAgICAgICB2YXIgeCA9IHIubGVmdCArIHcyXG4gICAgICAgIHZhciB5ID0gci50b3AgKyBoMlxuICAgICAgICByZXR1cm4ge3gsIHl9XG4gICAgfVxuXG4gICAgc2V0IHJvdGF0aW9uKHJhZGlhbnMpIHtcbiAgICAgICAgbGV0IHJhZCA9IHJhZGlhbnMgLy8gQW5nbGUubm9ybWFsaXplKHJhZGlhbnMpXG4gICAgICAgIGxldCBkZWdyZWVzID0gQW5nbGUucmFkaWFuMmRlZ3JlZShyYWQpXG4gICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy5lbGVtZW50LCB7cm90YXRpb246IGRlZ3JlZXN9KVxuICAgICAgICB0aGlzLl9yb3RhdGlvbiA9IHJhZFxuICAgIH1cblxuICAgIHNldCByb3RhdGlvbkRlZ3JlZXMoZGVncmVlcykge1xuICAgICAgICBsZXQgZGVnID0gZGVncmVlcyAvLyBBbmdsZS5ub3JtYWxpemVEZWdyZWUoZGVncmVlcylcbiAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLmVsZW1lbnQsIHtyb3RhdGlvbjogZGVnfSlcbiAgICAgICAgdGhpcy5fcm90YXRpb24gPSBBbmdsZS5kZWdyZWUycmFkaWFuKGRlZylcbiAgICB9XG5cbiAgICBnZXQgcm90YXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb3RhdGlvblxuICAgIH1cblxuICAgIGdldCByb3RhdGlvbkRlZ3JlZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb3RhdGlvblxuICAgIH1cblxuICAgIHNldCBzY2FsZShzY2FsZSkge1xuICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuZWxlbWVudCwge1xuICAgICAgICAgICAgc2NhbGU6IHNjYWxlLFxuICAgICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiB0aGlzLnRyYW5zZm9ybU9yaWdpblxuICAgICAgICB9KVxuICAgICAgICB0aGlzLl9zY2FsZSA9IHNjYWxlXG4gICAgfVxuXG4gICAgZ2V0IHNjYWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVcbiAgICB9XG5cbiAgICBnZXQgY29udGFpbmVyQm91bmRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250YWluZXIuYm91bmRzXG4gICAgfVxuXG4gICAgZ2V0IGNvbnRhaW5lclBvbHlnb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5wb2x5Z29uXG4gICAgfVxuXG4gICAgbWFwUG9zaXRpb25Ub0NvbnRhaW5lclBvaW50KHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5tYXBQb3NpdGlvblRvUG9pbnQocG9pbnQpXG4gICAgfVxuXG4gICAgY2FwdHVyZShldmVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuZWxlbWVudCwgdGhpcy5pbml0aWFsVmFsdWVzKVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLmVsZW1lbnQsIDAuMSwge1xuICAgICAgICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgICAgICAgb25Db21wbGV0ZTogZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy5lbGVtZW50LCB7ZGlzcGxheTogJ2Jsb2NrJ30pXG4gICAgfVxuXG4gICAgc2hvd0F0KHAsIHJvdGF0aW9uRGVncmVlcykge1xuICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuZWxlbWVudCwge1xuICAgICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICAgICAgICAgIHg6IHAueCxcbiAgICAgICAgICAgIHk6IHAueSxcbiAgICAgICAgICAgIHJvdGF0aW9uOiByb3RhdGlvbkRlZ3JlZXMsXG4gICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46IHRoaXMudHJhbnNmb3JtT3JpZ2luXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYnJpbmdUb0Zyb250KCkge1xuICAgICAgICAvLyB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpXG4gICAgICAgIC8vIHVvOiBPbiBDaG9tZSBhbmQgRWxlY3RvbiBhcHBlbmRDaGlsZCBsZWFkcyB0byBmbGlja2VyXG4gICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy5lbGVtZW50LCB7ekluZGV4OiB6SW5kZXgrK30pXG4gICAgfVxuXG4gICAgdG9nZ2xlVmlkZW8oZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudC5wYXVzZWQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQucGxheSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50LnBhdXNlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uVGFwKGV2ZW50LCBpbnRlcmFjdGlvbiwgcG9pbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuc2ltdWxhdGVDbGljaykge1xuICAgICAgICAgICAgbGV0IHAgPSBQb2ludHMuZnJvbVBhZ2VUb05vZGUodGhpcy5lbGVtZW50LCBwb2ludClcbiAgICAgICAgICAgIGxldCBpZnJhbWUgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignaWZyYW1lJylcbiAgICAgICAgICAgIGlmIChpZnJhbWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgZG9jID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnRcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IGRvYy5lbGVtZW50RnJvbVBvaW50KHAueCwgcC55KVxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN3aXRjaCAoZWxlbWVudC50YWdOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1ZJREVPJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnQuY3VycmVudFNyYylcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChQb3B1cE1lbnUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBQb3B1cE1lbnUub3BlbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRnVsbHNjcmVlbjogKCkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3BlbihlbGVtZW50LmN1cnJlbnRTcmMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGxheTogKCkgPT4gZWxlbWVudC5wbGF5KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3gsIHl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZVZpZGVvKGVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGljaygpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNEZXNjZW5kYW50KHBhcmVudCwgY2hpbGQpIHtcbiAgICAgICAgbGV0IG5vZGUgPSBjaGlsZC5wYXJlbnROb2RlXG4gICAgICAgIHdoaWxlIChub2RlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChub2RlID09IHBhcmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgZnJvbVBhZ2VUb05vZGUoeCwgeSkge1xuICAgICAgICByZXR1cm4gUG9pbnRzLmZyb21QYWdlVG9Ob2RlKHRoaXMuZWxlbWVudCwge3gsIHl9KVxuICAgIH1cblxuICAgIGZyb21Ob2RlVG9QYWdlKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIFBvaW50cy5mcm9tTm9kZVRvUGFnZSh0aGlzLmVsZW1lbnQsIHt4LCB5fSlcbiAgICB9XG5cbiAgICBfbW92ZShkZWx0YSkge1xuICAgICAgICAvLyBVTzogV2UgbmVlZCB0byBrZWVwIFR3ZWVuTGl0ZSdzIF9nc1RyYW5zZm9ybSBhbmQgdGhlIHByaXZhdGVcbiAgICAgICAgLy8gX3ggYW5kIF95IGF0dHJpYnV0ZXMgYWxpZ25lZFxuICAgICAgICBsZXQgeCA9IHRoaXMuZWxlbWVudC5fZ3NUcmFuc2Zvcm0ueFxuICAgICAgICBsZXQgeSA9IHRoaXMuZWxlbWVudC5fZ3NUcmFuc2Zvcm0ueVxuICAgICAgICBpZiAodGhpcy5tb3ZhYmxlWCkge1xuICAgICAgICAgICAgeCArPSBkZWx0YS54XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubW92YWJsZVkpIHtcbiAgICAgICAgICAgIHkgKz0gZGVsdGEueVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3ggPSB4XG4gICAgICAgIHRoaXMuX3kgPSB5XG4gICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy5lbGVtZW50LCB7eDogeCwgeTogeX0pXG4gICAgfVxuXG4gICAgcmVzaXplQWZ0ZXJUcmFuc2Zvcm0oem9vbSkge1xuICAgICAgICBsZXQgdyA9IHRoaXMud2lkdGggKiB0aGlzLnNjYWxlXG4gICAgICAgIGxldCBoID0gdGhpcy5oZWlnaHQgKiB0aGlzLnNjYWxlXG4gICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy5lbGVtZW50LCB7d2lkdGg6IHcsIGhlaWdodDogaH0pXG4gICAgICAgIGlmICh0aGlzLm9uUmVzaXplKSB7XG4gICAgICAgICAgICBsZXQgZXZlbnQgPSBuZXcgUmVzaXplRXZlbnQodGhpcywge3dpZHRoOiB3LCBoZWlnaHQ6IGh9KVxuICAgICAgICAgICAgdGhpcy5vblJlc2l6ZShldmVudClcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7Z2V0SWR9IGZyb20gJy4vdXRpbHMuanMnXG5pbXBvcnQge0RPTVNjYXR0ZXJ9IGZyb20gJy4vc2NhdHRlci5qcydcblxuZXhwb3J0IGNsYXNzIENhcmRMb2FkZXIge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBzcmMsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHggPSAwLFxuICAgICAgICAgICAgeSA9IDAsXG4gICAgICAgICAgICB3aWR0aCA9IDEwMDAsXG4gICAgICAgICAgICBoZWlnaHQgPSA4MDAsXG4gICAgICAgICAgICBtYXhXaWR0aCA9IG51bGwsXG4gICAgICAgICAgICBtYXhIZWlnaHQgPSBudWxsLFxuICAgICAgICAgICAgc2NhbGUgPSAxLFxuICAgICAgICAgICAgbWluU2NhbGUgPSAwLjUsXG4gICAgICAgICAgICBtYXhTY2FsZSA9IDEuNSxcbiAgICAgICAgICAgIHJvdGF0aW9uID0gMFxuICAgICAgICB9ID0ge31cbiAgICApIHtcbiAgICAgICAgdGhpcy5zcmMgPSBzcmNcbiAgICAgICAgdGhpcy54ID0geFxuICAgICAgICB0aGlzLnkgPSB5XG4gICAgICAgIHRoaXMuc2NhbGUgPSBzY2FsZVxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gMFxuICAgICAgICB0aGlzLm1heFNjYWxlID0gbWF4U2NhbGVcbiAgICAgICAgdGhpcy5taW5TY2FsZSA9IG1pblNjYWxlXG4gICAgICAgIHRoaXMud2FudGVkV2lkdGggPSB3aWR0aFxuICAgICAgICB0aGlzLndhbnRlZEhlaWdodCA9IGhlaWdodFxuICAgICAgICB0aGlzLm1heFdpZHRoID0gbWF4V2lkdGggIT0gbnVsbCA/IG1heFdpZHRoIDogd2luZG93LmlubmVyV2lkdGhcbiAgICAgICAgdGhpcy5tYXhIZWlnaHQgPSBtYXhIZWlnaHQgIT0gbnVsbCA/IG1heEhlaWdodCA6IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICB0aGlzLmFkZGVkTm9kZSA9IG51bGxcbiAgICB9XG5cbiAgICB1bmxvYWQoKSB7XG4gICAgICAgIGlmICh0aGlzLmFkZGVkTm9kZSkge1xuICAgICAgICAgICAgdGhpcy5hZGRlZE5vZGUucmVtb3ZlKClcbiAgICAgICAgICAgIHRoaXMuYWRkZWROb2RlID0gbnVsbFxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUERGTG9hZGVyIGV4dGVuZHMgQ2FyZExvYWRlciB7XG4gICAgY29uc3RydWN0b3Ioc3JjLCB7d2lkdGggPSAxNjQwLCBoZWlnaHQgPSA4MDAsIHNjYWxlID0gMX0gPSB7fSkge1xuICAgICAgICBzdXBlcihzcmMsIHt3aWR0aCwgaGVpZ2h0LCBzY2FsZX0pXG4gICAgICAgIGlmICh0eXBlb2YgUERGSlMgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGFsZXJ0KCdQREYuanMgbmVlZGVkJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvYWQoZG9tTm9kZSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgUERGSlMuZ2V0RG9jdW1lbnQodGhpcy5zcmMpLnRoZW4ocGRmID0+IHtcbiAgICAgICAgICAgICAgICBwZGYuZ2V0UGFnZSgxKS50aGVuKHBhZ2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2NhbGUgPSB0aGlzLnNjYWxlICogYXBwLnJlbmRlcmVyLnJlc29sdXRpb25cbiAgICAgICAgICAgICAgICAgICAgbGV0IGludlNjYWxlID0gMSAvIHNjYWxlXG4gICAgICAgICAgICAgICAgICAgIGxldCB2aWV3cG9ydCA9IHBhZ2UuZ2V0Vmlld3BvcnQoc2NhbGUpXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUHJlcGFyZSBjYW52YXMgdXNpbmcgUERGIHBhZ2UgZGltZW5zaW9ucy5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHZpZXdwb3J0LmhlaWdodFxuICAgICAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSB2aWV3cG9ydC53aWR0aFxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbmRlciBQREYgcGFnZSBpbnRvIGNhbnZhcyBjb250ZXh0LlxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVuZGVyQ29udGV4dCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbnZhc0NvbnRleHQ6IGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3cG9ydDogdmlld3BvcnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYWdlLnJlbmRlcihyZW5kZXJDb250ZXh0KVxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmFwcGVuZENoaWxkKGNhbnZhcylcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53YW50ZWRXaWR0aCA9IGNhbnZhcy53aWR0aFxuICAgICAgICAgICAgICAgICAgICB0aGlzLndhbnRlZEhlaWdodCA9IGNhbnZhcy5oZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2FsZSA9IGludlNjYWxlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkZWROb2RlID0gY2FudmFzXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcylcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbWFnZUxvYWRlciBleHRlbmRzIENhcmRMb2FkZXIge1xuICAgIGxvYWQoZG9tTm9kZSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IGlzSW1hZ2UgPSBkb21Ob2RlIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudFxuICAgICAgICAgICAgbGV0IGltYWdlID0gaXNJbWFnZSA/IGRvbU5vZGUgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0ltYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuYXBwZW5kQ2hpbGQoaW1hZ2UpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkZWROb2RlID0gaW1hZ2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy53YW50ZWRXaWR0aCA9IGltYWdlLm5hdHVyYWxXaWR0aFxuICAgICAgICAgICAgICAgIHRoaXMud2FudGVkSGVpZ2h0ID0gaW1hZ2UubmF0dXJhbEhlaWdodFxuXG4gICAgICAgICAgICAgICAgbGV0IHNjYWxlVyA9IHRoaXMubWF4V2lkdGggLyBpbWFnZS5uYXR1cmFsV2lkdGhcbiAgICAgICAgICAgICAgICBsZXQgc2NhbGVIID0gdGhpcy5tYXhIZWlnaHQgLyBpbWFnZS5uYXR1cmFsSGVpZ2h0XG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZSA9IE1hdGgubWluKHRoaXMubWF4U2NhbGUsIE1hdGgubWluKHNjYWxlVywgc2NhbGVIKSlcbiAgICAgICAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsIGZhbHNlKVxuICAgICAgICAgICAgICAgIGltYWdlLndpZHRoID0gaW1hZ2UubmF0dXJhbFdpZHRoXG4gICAgICAgICAgICAgICAgaW1hZ2UuaGVpZ2h0ID0gaW1hZ2UubmF0dXJhbEhlaWdodFxuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGltYWdlLm9uZXJyb3IgPSBlID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QodGhpcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGltYWdlLnNyYyA9IHRoaXMuc3JjXG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRnJhbWVMb2FkZXIgZXh0ZW5kcyBDYXJkTG9hZGVyIHtcbiAgICBsb2FkKGRvbU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKVxuICAgICAgICAgICAgaWZyYW1lLmZyYW1lQm9yZGVyID0gMFxuICAgICAgICAgICAgaWZyYW1lLnN0eWxlLnNjcm9sbGluZyA9IGZhbHNlXG4gICAgICAgICAgICBpZnJhbWUud2lkdGggPSB0aGlzLndhbnRlZFdpZHRoXG4gICAgICAgICAgICBpZnJhbWUuaGVpZ2h0ID0gdGhpcy53YW50ZWRIZWlnaHRcbiAgICAgICAgICAgIGRvbU5vZGUuYXBwZW5kQ2hpbGQoaWZyYW1lKVxuICAgICAgICAgICAgdGhpcy5hZGRlZE5vZGUgPSBpZnJhbWVcbiAgICAgICAgICAgIGlmcmFtZS5vbmxvYWQgPSBlID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZnJhbWUub25lcnJvciA9IGUgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdCh0aGlzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWZyYW1lLnNyYyA9IHRoaXMuc3JjXG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRE9NRmxpcCB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGRvbVNjYXR0ZXJDb250YWluZXIsXG4gICAgICAgIGZsaXBUZW1wbGF0ZSxcbiAgICAgICAgZnJvbnRMb2FkZXIsXG4gICAgICAgIGJhY2tMb2FkZXIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGF1dG9Mb2FkID0gZmFsc2UsXG4gICAgICAgICAgICBjZW50ZXIgPSBudWxsLFxuICAgICAgICAgICAgcHJlbG9hZEJhY2sgPSBmYWxzZSxcbiAgICAgICAgICAgIHRyYW5zbGF0YWJsZSA9IHRydWUsXG4gICAgICAgICAgICBzY2FsYWJsZSA9IHRydWUsXG4gICAgICAgICAgICByb3RhdGFibGUgPSB0cnVlLFxuICAgICAgICAgICAgb25Gcm9udCA9IG51bGwsXG4gICAgICAgICAgICBvbkJhY2sgPSBudWxsLFxuICAgICAgICAgICAgb25DbG9zZSA9IG51bGwsXG4gICAgICAgICAgICBvblVwZGF0ZSA9IG51bGwsXG4gICAgICAgICAgICBvblJlbW92ZWQgPSBudWxsXG4gICAgICAgIH0gPSB7fVxuICAgICkge1xuICAgICAgICB0aGlzLmRvbVNjYXR0ZXJDb250YWluZXIgPSBkb21TY2F0dGVyQ29udGFpbmVyXG4gICAgICAgIHRoaXMuaWQgPSBnZXRJZCgpXG4gICAgICAgIHRoaXMuZmxpcFRlbXBsYXRlID0gZmxpcFRlbXBsYXRlXG4gICAgICAgIHRoaXMuZnJvbnRMb2FkZXIgPSBmcm9udExvYWRlclxuICAgICAgICB0aGlzLmJhY2tMb2FkZXIgPSBiYWNrTG9hZGVyXG4gICAgICAgIHRoaXMudHJhbnNsYXRhYmxlID0gdHJhbnNsYXRhYmxlXG4gICAgICAgIHRoaXMuc2NhbGFibGUgPSBzY2FsYWJsZVxuICAgICAgICB0aGlzLnJvdGF0YWJsZSA9IHJvdGF0YWJsZVxuICAgICAgICB0aGlzLm9uRnJvbnRGbGlwcGVkID0gb25Gcm9udFxuICAgICAgICB0aGlzLm9uQmFja0ZsaXBwZWQgPSBvbkJhY2tcbiAgICAgICAgdGhpcy5vbkNsb3NlID0gb25DbG9zZVxuICAgICAgICB0aGlzLm9uUmVtb3ZlZCA9IG9uUmVtb3ZlZFxuICAgICAgICB0aGlzLm9uVXBkYXRlID0gb25VcGRhdGVcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBjZW50ZXJcbiAgICAgICAgdGhpcy5wcmVsb2FkQmFjayA9IHByZWxvYWRCYWNrXG4gICAgICAgIGlmIChhdXRvTG9hZCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvYWQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgdCA9IHRoaXMuZmxpcFRlbXBsYXRlXG4gICAgICAgICAgICBsZXQgZG9tID0gdGhpcy5kb21TY2F0dGVyQ29udGFpbmVyLmVsZW1lbnRcbiAgICAgICAgICAgIGxldCB3cmFwcGVyID0gdC5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5mbGlwV3JhcHBlcicpXG4gICAgICAgICAgICB3cmFwcGVyLmlkID0gdGhpcy5pZFxuICAgICAgICAgICAgbGV0IGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0LmNvbnRlbnQsIHRydWUpXG4gICAgICAgICAgICBkb20uYXBwZW5kQ2hpbGQoY2xvbmUpXG4gICAgICAgICAgICAvLyBXZSBjYW5ub3QgdXNlIHRoZSBkb2N1bWVudCBmcmFnbWVudCBpdHNlbGYgYmVjYXVzZSBpdFxuICAgICAgICAgICAgLy8gaXMgbm90IHBhcnQgb2YgdGhlIG1haW4gZG9tIHRyZWUuIEFmdGVyIHRoZSBhcHBlbmRDaGlsZFxuICAgICAgICAgICAgLy8gY2FsbCB3ZSBjYW4gYWNjZXNzIHRoZSBuZXcgZG9tIGVsZW1lbnQgYnkgaWRcbiAgICAgICAgICAgIHRoaXMuY2FyZFdyYXBwZXIgPSBkb20ucXVlcnlTZWxlY3RvcignIycgKyB0aGlzLmlkKVxuICAgICAgICAgICAgbGV0IGZyb250ID0gdGhpcy5jYXJkV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuZnJvbnQnKVxuICAgICAgICAgICAgdGhpcy5mcm9udExvYWRlci5sb2FkKGZyb250KS50aGVuKGxvYWRlciA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mcm9udExvYWRlZChsb2FkZXIpLnRoZW4ocmVzb2x2ZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnJvbnRMb2FkZWQobG9hZGVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgc2NhdHRlciA9IG5ldyBET01TY2F0dGVyKFxuICAgICAgICAgICAgICAgIHRoaXMuY2FyZFdyYXBwZXIsXG4gICAgICAgICAgICAgICAgdGhpcy5kb21TY2F0dGVyQ29udGFpbmVyLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgeDogbG9hZGVyLngsXG4gICAgICAgICAgICAgICAgICAgIHk6IGxvYWRlci55LFxuICAgICAgICAgICAgICAgICAgICBzdGFydFNjYWxlOiBsb2FkZXIuc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlOiBsb2FkZXIuc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIG1heFNjYWxlOiBsb2FkZXIubWF4U2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIG1pblNjYWxlOiBsb2FkZXIubWluU2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBsb2FkZXIud2FudGVkV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogbG9hZGVyLndhbnRlZEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgcm90YXRpb246IGxvYWRlci5yb3RhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRhYmxlOiB0aGlzLnRyYW5zbGF0YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGFibGU6IHRoaXMuc2NhbGFibGUsXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0YWJsZTogdGhpcy5yb3RhdGFibGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApXG4gICAgICAgICAgICBpZiAodGhpcy5jZW50ZXIpIHtcbiAgICAgICAgICAgICAgICBzY2F0dGVyLmNlbnRlckF0KHRoaXMuY2VudGVyKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZmxpcHBhYmxlID0gbmV3IERPTUZsaXBwYWJsZSh0aGlzLmNhcmRXcmFwcGVyLCBzY2F0dGVyLCB0aGlzKVxuICAgICAgICAgICAgbGV0IGJhY2sgPSB0aGlzLmNhcmRXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5iYWNrJylcblxuICAgICAgICAgICAgaWYgKHRoaXMucHJlbG9hZEJhY2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2tMb2FkZXIubG9hZChiYWNrKS50aGVuKGxvYWRlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dXBGbGlwcGFibGUoZmxpcHBhYmxlLCBsb2FkZXIpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmxpcHBhYmxlID0gZmxpcHBhYmxlXG4gICAgICAgICAgICByZXNvbHZlKHRoaXMpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgY2VudGVyQXQocCkge1xuICAgICAgICB0aGlzLmNlbnRlciA9IHBcbiAgICAgICAgdGhpcy5mbGlwcGFibGUuY2VudGVyQXQocClcbiAgICB9XG5cbiAgICB6b29tKHNjYWxlKSB7XG4gICAgICAgIHRoaXMuZmxpcHBhYmxlLnpvb20oc2NhbGUpXG4gICAgfVxuXG4gICAgc2V0dXBGbGlwcGFibGUoZmxpcHBhYmxlLCBsb2FkZXIpIHtcbiAgICAgICAgZmxpcHBhYmxlLndhbnRlZFdpZHRoID0gbG9hZGVyLndhbnRlZFdpZHRoXG4gICAgICAgIGZsaXBwYWJsZS53YW50ZWRIZWlnaHQgPSBsb2FkZXIud2FudGVkSGVpZ2h0XG4gICAgICAgIGZsaXBwYWJsZS53YW50ZWRTY2FsZSA9IGxvYWRlci5zY2FsZVxuICAgICAgICBmbGlwcGFibGUubWluU2NhbGUgPSBsb2FkZXIubWluU2NhbGVcbiAgICAgICAgZmxpcHBhYmxlLm1heFNjYWxlID0gbG9hZGVyLm1heFNjYWxlXG4gICAgICAgIGZsaXBwYWJsZS5zY2FsZUJ1dHRvbnMoKVxuICAgIH1cblxuICAgIHN0YXJ0KHtkdXJhdGlvbiA9IDEuMCwgdGFyZ2V0Q2VudGVyID0gbnVsbH0gPSB7fSkge1xuICAgICAgICBjb25zb2xlLmxvZygnRE9NRmxpcC5zdGFydCcsIHRhcmdldENlbnRlcilcbiAgICAgICAgaWYgKHRoaXMucHJlbG9hZEJhY2spIHRoaXMuZmxpcHBhYmxlLnN0YXJ0KHtkdXJhdGlvbiwgdGFyZ2V0Q2VudGVyfSlcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgYmFjayA9IHRoaXMuY2FyZFdyYXBwZXIucXVlcnlTZWxlY3RvcignLmJhY2snKVxuICAgICAgICAgICAgbGV0IGZsaXBwYWJsZSA9IHRoaXMuZmxpcHBhYmxlXG4gICAgICAgICAgICB0aGlzLmJhY2tMb2FkZXIubG9hZChiYWNrKS50aGVuKGxvYWRlciA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cEZsaXBwYWJsZShmbGlwcGFibGUsIGxvYWRlcilcbiAgICAgICAgICAgICAgICBmbGlwcGFibGUuc3RhcnQoe2R1cmF0aW9uLCB0YXJnZXRDZW50ZXJ9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZhZGVPdXRBbmRSZW1vdmUoKSB7XG4gICAgICAgIFR3ZWVuTGl0ZS50byh0aGlzLmNhcmRXcmFwcGVyLCAwLjIsIHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXJkV3JhcHBlci5yZW1vdmUoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGNsb3NlZCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByZWxvYWRCYWNrKSB7XG4gICAgICAgICAgICB0aGlzLmJhY2tMb2FkZXIudW5sb2FkKClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIERPTUZsaXBwYWJsZSB7XG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgc2NhdHRlciwgZmxpcCkge1xuICAgICAgICAvLyBTZXQgbG9nIHRvIGNvbnNvbGUubG9nIG9yIGEgY3VzdG9tIGxvZyBmdW5jdGlvblxuICAgICAgICAvLyBkZWZpbmUgZGF0YSBzdHJ1Y3R1cmVzIHRvIHN0b3JlIG91ciB0b3VjaHBvaW50cyBpblxuXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICAgICAgdGhpcy5mbGlwID0gZmxpcFxuICAgICAgICB0aGlzLmNhcmQgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mbGlwQ2FyZCcpXG4gICAgICAgIHRoaXMuZnJvbnQgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mcm9udCcpXG4gICAgICAgIHRoaXMuYmFjayA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJhY2snKVxuICAgICAgICB0aGlzLmZsaXBwZWQgPSBmYWxzZVxuICAgICAgICB0aGlzLnNjYXR0ZXIgPSBzY2F0dGVyXG4gICAgICAgIHRoaXMub25Gcm9udEZsaXBwZWQgPSBmbGlwLm9uRnJvbnRGbGlwcGVkXG4gICAgICAgIHRoaXMub25CYWNrRmxpcHBlZCA9IGZsaXAub25CYWNrRmxpcHBlZFxuICAgICAgICB0aGlzLm9uQ2xvc2UgPSBmbGlwLm9uQ2xvc2VcbiAgICAgICAgdGhpcy5vblJlbW92ZWQgPSBmbGlwLm9uUmVtb3ZlZFxuICAgICAgICB0aGlzLm9uVXBkYXRlID0gZmxpcC5vblVwZGF0ZVxuICAgICAgICBzY2F0dGVyLmFkZFRyYW5zZm9ybUV2ZW50Q2FsbGJhY2sodGhpcy5zY2F0dGVyVHJhbnNmb3JtZWQuYmluZCh0aGlzKSlcbiAgICAgICAgY29uc29sZS5sb2coJ2xpYi5ET01GbGlwcGFibGUnLCA1MDAwKVxuICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuZWxlbWVudCwge3BlcnNwZWN0aXZlOiA1MDAwfSlcbiAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLmNhcmQsIHt0cmFuc2Zvcm1TdHlsZTogJ3ByZXNlcnZlLTNkJ30pXG4gICAgICAgIFR3ZWVuTGl0ZS5zZXQodGhpcy5iYWNrLCB7cm90YXRpb25ZOiAtMTgwfSlcbiAgICAgICAgVHdlZW5MaXRlLnNldChbdGhpcy5iYWNrLCB0aGlzLmZyb250XSwge2JhY2tmYWNlVmlzaWJpbGl0eTogJ2hpZGRlbicsIHBlcnNwZWN0aXZlOiA1MDAwfSlcbiAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLmZyb250LCB7dmlzaWJpbGl0eTogJ3Zpc2libGUnfSlcbiAgICAgICAgdGhpcy5pbmZvQnRuID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuaW5mb0J0bicpXG4gICAgICAgIHRoaXMuYmFja0J0biA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJhY2tCdG4nKVxuICAgICAgICB0aGlzLmNsb3NlQnRuID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY2xvc2VCdG4nKVxuICAgICAgICAvKiBCdXR0b25zIGFyZSBub3QgZ3VhcmFudGVlZCB0byBleGlzdC4gKi9cbiAgICAgICAgaWYgKHRoaXMuaW5mb0J0bikge1xuICAgICAgICAgICAgdGhpcy5pbmZvQnRuLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mbGlwLnN0YXJ0KClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLmluZm9CdG4pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYmFja0J0bikge1xuICAgICAgICAgICAgdGhpcy5iYWNrQnRuLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2xvc2VCdG4pIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VCdG4ub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLmNsb3NlQnRuKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NhbGVCdXR0b25zKClcbiAgICAgICAgdGhpcy5icmluZ1RvRnJvbnQoKVxuICAgIH1cblxuICAgIGNsb3NlKCkge1xuICAgICAgICB0aGlzLmhpZGUodGhpcy5pbmZvQnRuKVxuICAgICAgICB0aGlzLmhpZGUodGhpcy5jbG9zZUJ0bilcbiAgICAgICAgaWYgKHRoaXMub25DbG9zZSkge1xuICAgICAgICAgICAgdGhpcy5vbkNsb3NlKHRoaXMpXG4gICAgICAgICAgICB0aGlzLmZsaXAuY2xvc2VkKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2NhdHRlci56b29tKDAuMSwge1xuICAgICAgICAgICAgICAgIGFuaW1hdGU6IDAuNSxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmUoKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsaXAuY2xvc2VkKClcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub25SZW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uUmVtb3ZlZC5jYWxsKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvd0Zyb250KCkge1xuICAgICAgICBUd2VlbkxpdGUuc2V0KHRoaXMuZnJvbnQsIHt2aXNpYmlsaXR5OiAndmlzaWJsZSd9KVxuICAgIH1cblxuICAgIGNlbnRlckF0KHApIHtcbiAgICAgICAgdGhpcy5zY2F0dGVyLmNlbnRlckF0KHApXG4gICAgfVxuXG4gICAgem9vbShzY2FsZSkge1xuICAgICAgICB0aGlzLnNjYXR0ZXIuem9vbShzY2FsZSlcbiAgICB9XG5cbiAgICBnZXQgYnV0dG9uU2NhbGUoKSB7XG4gICAgICAgIGxldCBpc2NhbGUgPSAxLjBcbiAgICAgICAgaWYgKHRoaXMuc2NhdHRlciAhPSBudWxsKSB7XG4gICAgICAgICAgICBpc2NhbGUgPSAxLjAgLyB0aGlzLnNjYXR0ZXIuc2NhbGVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNjYWxlXG4gICAgfVxuXG4gICAgc2NhbGVCdXR0b25zKCkge1xuICAgICAgICBUd2VlbkxpdGUuc2V0KFt0aGlzLmluZm9CdG4sIHRoaXMuYmFja0J0biwgdGhpcy5jbG9zZUJ0bl0sIHtcbiAgICAgICAgICAgIHNjYWxlOiB0aGlzLmJ1dHRvblNjYWxlXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYnJpbmdUb0Zyb250KCkge1xuICAgICAgICB0aGlzLnNjYXR0ZXIuYnJpbmdUb0Zyb250KClcbiAgICAgICAgVHdlZW5MaXRlLnNldCh0aGlzLmVsZW1lbnQsIHt6SW5kZXg6IERPTUZsaXBwYWJsZS56SW5kZXgrK30pXG4gICAgfVxuXG4gICAgY2xpY2tJbmZvKCkge1xuICAgICAgICB0aGlzLmJyaW5nVG9Gcm9udCgpXG4gICAgICAgIHRoaXMuaW5mb0J0bi5jbGljaygpXG4gICAgfVxuXG4gICAgc2NhdHRlclRyYW5zZm9ybWVkKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2NhbGVCdXR0b25zKClcbiAgICB9XG5cbiAgICB0YXJnZXRSb3RhdGlvbihhbHBoYSkge1xuICAgICAgICBsZXQgb3J0aG8gPSA5MFxuICAgICAgICBsZXQgcmVzdCA9IGFscGhhICUgb3J0aG9cbiAgICAgICAgbGV0IGRlbHRhID0gMC4wXG4gICAgICAgIGlmIChyZXN0ID4gb3J0aG8gLyAyLjApIHtcbiAgICAgICAgICAgIGRlbHRhID0gb3J0aG8gLSByZXN0XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWx0YSA9IC1yZXN0XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlbHRhXG4gICAgfVxuXG4gICAgaW5mb1ZhbHVlcyhpbmZvKSB7XG4gICAgICAgIGxldCBzdGFydFggPSB0aGlzLmVsZW1lbnQuX2dzVHJhbnNmb3JtLnhcbiAgICAgICAgbGV0IHN0YXJ0WSA9IHRoaXMuZWxlbWVudC5fZ3NUcmFuc2Zvcm0ueVxuICAgICAgICBsZXQgc3RhcnRBbmdsZSA9IHRoaXMuZWxlbWVudC5fZ3NUcmFuc2Zvcm0ucm90YXRpb25cbiAgICAgICAgbGV0IHN0YXJ0U2NhbGUgPSB0aGlzLmVsZW1lbnQuX2dzVHJhbnNmb3JtLnNjYWxlWFxuICAgICAgICBsZXQgdyA9IHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aFxuICAgICAgICBsZXQgaCA9IHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHRcbiAgICAgICAgY29uc29sZS5sb2coaW5mbywgc3RhcnRYLCBzdGFydFksIHN0YXJ0QW5nbGUsIHN0YXJ0U2NhbGUsIHcsIGgpXG4gICAgfVxuXG4gICAgc2hvdyhlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICBUd2VlbkxpdGUuc2V0KGVsZW1lbnQsIHt2aXNpYmlsaXR5OiAndmlzaWJsZScsIGRpc3BsYXk6ICdpbml0aWFsJ30pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoaWRlKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5zZXQoZWxlbWVudCwge3Zpc2liaWxpdHk6ICdoaWRkZW4nLCBkaXNwbGF5OiAnbm9uZSd9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhcnQoe2R1cmF0aW9uID0gMS4wLCB0YXJnZXRDZW50ZXIgPSBudWxsfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuYnJpbmdUb0Zyb250KClcbiAgICAgICAgaWYgKCF0aGlzLmZsaXBwZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRYID0gdGhpcy5lbGVtZW50Ll9nc1RyYW5zZm9ybS54XG4gICAgICAgICAgICB0aGlzLnN0YXJ0WSA9IHRoaXMuZWxlbWVudC5fZ3NUcmFuc2Zvcm0ueVxuICAgICAgICAgICAgdGhpcy5zdGFydEFuZ2xlID0gdGhpcy5lbGVtZW50Ll9nc1RyYW5zZm9ybS5yb3RhdGlvblxuICAgICAgICAgICAgdGhpcy5zdGFydFNjYWxlID0gdGhpcy5lbGVtZW50Ll9nc1RyYW5zZm9ybS5zY2FsZVhcbiAgICAgICAgICAgIHRoaXMuc3RhcnRXaWR0aCA9IHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aFxuICAgICAgICAgICAgdGhpcy5zdGFydEhlaWdodCA9IHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHRcbiAgICAgICAgICAgIHRoaXMuc2NhdHRlclN0YXJ0V2lkdGggPSB0aGlzLnNjYXR0ZXIud2lkdGhcbiAgICAgICAgICAgIHRoaXMuc2NhdHRlclN0YXJ0SGVpZ2h0ID0gdGhpcy5zY2F0dGVyLmhlaWdodFxuICAgICAgICAgICAgdGhpcy5zaG93KHRoaXMuYmFjaylcbiAgICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLmluZm9CdG4pXG4gICAgICAgICAgICB0aGlzLmhpZGUodGhpcy5jbG9zZUJ0bilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLmZyb250KVxuICAgICAgICAgICAgdGhpcy5oaWRlKHRoaXMuYmFja0J0bilcbiAgICAgICAgfVxuICAgICAgICBsZXQge3NjYWxhYmxlLCB0cmFuc2xhdGFibGUsIHJvdGF0YWJsZX0gPSB0aGlzLnNjYXR0ZXJcbiAgICAgICAgdGhpcy5zYXZlZCA9IHtzY2FsYWJsZSwgdHJhbnNsYXRhYmxlLCByb3RhdGFibGV9XG4gICAgICAgIHRoaXMuc2NhdHRlci5zY2FsYWJsZSA9IGZhbHNlXG4gICAgICAgIHRoaXMuc2NhdHRlci50cmFuc2xhdGFibGUgPSBmYWxzZVxuICAgICAgICB0aGlzLnNjYXR0ZXIucm90YXRhYmxlID0gZmFsc2VcblxuICAgICAgICB0aGlzLmZsaXBwZWQgPSAhdGhpcy5mbGlwcGVkXG4gICAgICAgIGxldCB0YXJnZXRZID0gdGhpcy5mbGlwcGVkID8gMTgwIDogMFxuICAgICAgICBsZXQgdGFyZ2V0WiA9IHRoaXMuZmxpcHBlZFxuICAgICAgICAgICAgPyB0aGlzLnN0YXJ0QW5nbGUgKyB0aGlzLnRhcmdldFJvdGF0aW9uKHRoaXMuc3RhcnRBbmdsZSlcbiAgICAgICAgICAgIDogdGhpcy5zdGFydEFuZ2xlXG4gICAgICAgIGxldCB0YXJnZXRTY2FsZSA9IHRoaXMuZmxpcHBlZCA/IHRoaXMud2FudGVkU2NhbGUgOiB0aGlzLnN0YXJ0U2NhbGVcbiAgICAgICAgbGV0IHcgPSB0aGlzLmZsaXBwZWQgPyB0aGlzLndhbnRlZFdpZHRoIDogdGhpcy5zdGFydFdpZHRoXG4gICAgICAgIGxldCBoID0gdGhpcy5mbGlwcGVkID8gdGhpcy53YW50ZWRIZWlnaHQgOiB0aGlzLnN0YXJ0SGVpZ2h0XG4gICAgICAgIGxldCBkdyA9IHRoaXMud2FudGVkV2lkdGggLSB0aGlzLnNjYXR0ZXIud2lkdGhcbiAgICAgICAgbGV0IGRoID0gdGhpcy53YW50ZWRIZWlnaHQgLSB0aGlzLnNjYXR0ZXIuaGVpZ2h0XG5cbiAgICAgICAgbGV0IHh4ID1cbiAgICAgICAgICAgIHRhcmdldENlbnRlciAhPSBudWxsID8gdGFyZ2V0Q2VudGVyLnggLSB3IC8gMiA6IHRoaXMuc3RhcnRYIC0gZHcgLyAyXG4gICAgICAgIGxldCB5eSA9XG4gICAgICAgICAgICB0YXJnZXRDZW50ZXIgIT0gbnVsbCA/IHRhcmdldENlbnRlci55IC0gaCAvIDIgOiB0aGlzLnN0YXJ0WSAtIGRoIC8gMlxuICAgICAgICBsZXQgeCA9IHRoaXMuZmxpcHBlZCA/IHh4IDogdGhpcy5zdGFydFhcbiAgICAgICAgbGV0IHkgPSB0aGlzLmZsaXBwZWQgPyB5eSA6IHRoaXMuc3RhcnRZXG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkRPTUZsaXBwYWJsZS5zdGFydFwiLCB0aGlzLmZsaXBwZWQsIHRhcmdldENlbnRlciwgeCwgeSwgdGhpcy5zYXZlZClcbiAgICAgICAgLy8gdGFyZ2V0WiA9IEFuZ2xlLm5vcm1hbGl6ZURlZ3JlZSh0YXJnZXRaKVxuICAgICAgICBsZXQgb25VcGRhdGUgPSB0aGlzLm9uVXBkYXRlICE9PSBudWxsID8gKCkgPT4gdGhpcy5vblVwZGF0ZSh0aGlzKSA6IG51bGxcbiAgICAgICAgVHdlZW5MaXRlLnRvKHRoaXMuY2FyZCwgZHVyYXRpb24sIHtcbiAgICAgICAgICAgIHJvdGF0aW9uWTogdGFyZ2V0WSArIDAuMSxcbiAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJzUwJSA1MCUnLFxuICAgICAgICAgICAgb25VcGRhdGUsXG4gICAgICAgICAgICBvbkNvbXBsZXRlOiBlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mbGlwcGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5oaWRlKHRoaXMuZnJvbnQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLmJhY2tCdG4pXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uRnJvbnRGbGlwcGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRnJvbnRGbGlwcGVkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuaGlkZSh0aGlzLmJhY2spXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uQmFja0ZsaXBwZWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93KHRoaXMuaW5mb0J0bilcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvdyh0aGlzLmNsb3NlQnRuKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkJhY2tGbGlwcGVkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbGlwLmNsb3NlZCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2NhdHRlci5zY2FsZSA9IHRhcmdldFNjYWxlXG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZUJ1dHRvbnMoKVxuICAgICAgICAgICAgICAgIHRoaXMuc2NhdHRlci5yb3RhdGlvbkRlZ3JlZXMgPSB0YXJnZXRaXG4gICAgICAgICAgICAgICAgdGhpcy5zY2F0dGVyLndpZHRoID0gdGhpcy5mbGlwcGVkID8gdyA6IHRoaXMuc2NhdHRlclN0YXJ0V2lkdGhcbiAgICAgICAgICAgICAgICB0aGlzLnNjYXR0ZXIuaGVpZ2h0ID0gdGhpcy5mbGlwcGVkID8gaCA6IHRoaXMuc2NhdHRlclN0YXJ0SGVpZ2h0XG5cbiAgICAgICAgICAgICAgICBsZXQge3NjYWxhYmxlLCB0cmFuc2xhdGFibGUsIHJvdGF0YWJsZX0gPSB0aGlzLnNhdmVkXG4gICAgICAgICAgICAgICAgdGhpcy5zY2F0dGVyLnNjYWxhYmxlID0gc2NhbGFibGVcbiAgICAgICAgICAgICAgICB0aGlzLnNjYXR0ZXIudHJhbnNsYXRhYmxlID0gdHJhbnNsYXRhYmxlXG4gICAgICAgICAgICAgICAgdGhpcy5zY2F0dGVyLnJvdGF0YWJsZSA9IHJvdGF0YWJsZVxuXG4gICAgICAgICAgICAgICAgdGhpcy5icmluZ1RvRnJvbnQoKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZvcmNlM0Q6IHRydWVcbiAgICAgICAgfSlcblxuICAgICAgICBUd2VlbkxpdGUudG8odGhpcy5lbGVtZW50LCBkdXJhdGlvbiAvIDIsIHtcbiAgICAgICAgICAgIHNjYWxlOiB0YXJnZXRTY2FsZSxcbiAgICAgICAgICAgIHJvdGF0aW9uWjogdGFyZ2V0WiAgKyAwLjEsXG4gICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICc1MCUgNTAlJyxcbiAgICAgICAgICAgIHdpZHRoOiB3LFxuICAgICAgICAgICAgaGVpZ2h0OiBoLFxuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHksXG4gICAgICAgICAgICBvbkNvbXBsZXRlOiBlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mbGlwcGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLmZyb250KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLmJhY2spXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuRE9NRmxpcHBhYmxlLnpJbmRleCA9IDBcbiIsImltcG9ydCB7RWxlbWVudHN9IGZyb20gXCIuL3V0aWxzLmpzXCJcblxuLyoqIEEgUG9wdXAgdGhhdCBzaG93cyB0ZXh0IGxhYmVscywgaW1hZ2VzLCBvciBodG1sXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvcHVwIHtcbiAgICAvKipcbiAgICAqIFRoZSBjb25zdHJ1Y3Rvci5cbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICogQHBhcmFtIHtET00gRWxlbWVudH0gcGFyZW50IC0gVGhlIERPTSBwYXJlbnQgZWxlbWVudC5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gQSBkaWN0IG9iamVjdCB3aXRoIHR5cGUgc3RyaW5ncyAodGV4dCwgaW1nLCBodG1sKSBhcyBrZXlzXG4gICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gZm9udFNpemUgLSBEZXNjcmliZXMgdGhlIGZvbnQgc2l6ZSBhcyBDU1MgdmFsdWVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBmb250RmFtaWx5IC0gRGVzY3JpYmVzIHRoZSBmb250IGZhbWlseSBhcyBDU1MgdmFsdWVcbiAgICAqIEBwYXJhbSB7bnVtYmVyIHx8IHN0cmluZ30gcGFkZGluZyAtIERlc2NyaWJlcyB0aGUgcGFkZGluZyBhcyBDU1MgdmFsdWVcbiAgICAqIEBwYXJhbSB7bnVtYmVyIHx8IHN0cmluZ30gbm90Y2hTaXplIC0gRGVzY3JpYmVzIHRoZSBzaXplIG9mIHRoZSBub3RjaCAoY2FsbG91dCkgYXMgQ1NTIHZhbHVlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gYmFja2dyb3VuZENvbG9yICAtIFRoZSBjb2xvciBvZiB0aGUgYmFja2dyb3VuZCBhcyBDU1MgdmFsdWVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBub3JtYWxDb2xvciAgLSBUaGUgY29sb3Igb2YgdGV4dGl0ZW1zIGFzIENTUyB2YWx1ZVxuICAgICogQHBhcmFtIHtib29sZWFufSBhdXRvQ2xvc2UgIC0gQXV0b2Nsb3NlIHRoZSBQb3B1cCBvbiB0YXBcbiAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHtwYXJlbnQgPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU9JzFlbScsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk9J0FyaWFsJyxcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZz0xNixcbiAgICAgICAgICAgICAgICAgICAgbm90Y2hTaXplPTEwLFxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2hQb3M9ZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG1heFdpZHRoPTgwMCxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yPScjRUVFJyxcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsQ29sb3I9JyM0NDQnLFxuICAgICAgICAgICAgICAgICAgICBub3RjaFBvc2l0aW9uPSdib3R0b21MZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgYXV0b0Nsb3NlPXRydWV9ID0ge30pIHtcbiAgICAgICAgdGhpcy5wYWRkaW5nID0gcGFkZGluZ1xuICAgICAgICB0aGlzLm5vdGNoUG9zaXRpb24gPSBub3RjaFBvc2l0aW9uXG4gICAgICAgIHRoaXMubm90Y2hTaXplID0gbm90Y2hTaXplXG4gICAgICAgIHRoaXMuc3dpdGNoUG9zID0gc3dpdGNoUG9zXG4gICAgICAgIHRoaXMuZm9udFNpemUgPSBmb250U2l6ZVxuICAgICAgICB0aGlzLmZvbnRGYW1pbHkgPSBmb250RmFtaWx5XG4gICAgICAgIHRoaXMubWF4V2lkdGggPSBtYXhXaWR0aFxuICAgICAgICB0aGlzLm5vcm1hbENvbG9yID0gbm9ybWFsQ29sb3JcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kQ29sb3IgPSBiYWNrZ3JvdW5kQ29sb3JcbiAgICAgICAgdGhpcy5hdXRvQ2xvc2UgPSBhdXRvQ2xvc2VcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQgfHwgZG9jdW1lbnQuYm9keVxuICAgICAgICBpZiAoY29udGVudCkge1xuICAgICAgICAgICAgdGhpcy5zaG93KGNvbnRlbnQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogU2V0dXAgbWVudSB3aXRoIGEgZGljdGlvbmFyeSBvZiBjb250ZW50IHR5cGVzIGFuZCBjb250ZW50cy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudCAtIEEgZGljdCBvYmplY3Qgd2l0aCB0eXBlIHN0cmluZ3MgKHRleHQsIGltZywgaHRtbCkgYXMga2V5c1xuICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICAgICAqIEByZXR1cm4ge1BvcHVwfSB0aGlzXG4gICAgICovXG4gICAgc2V0dXAoY29udGVudCkge1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50XG4gICAgICAgIHRoaXMuaXRlbXMgPSB7fVxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICBFbGVtZW50cy5hZGRDbGFzcyh0aGlzLmVsZW1lbnQsICd1bnNlbGVjdGFibGUnKVxuICAgICAgICB0aGlzLm5vdGNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgRWxlbWVudHMuc2V0U3R5bGUodGhpcy5ub3RjaCwgdGhpcy5ub3RjaFN0eWxlKCkpXG4gICAgICAgIGZvcihsZXQga2V5IGluIGNvbnRlbnQpIHtcbiAgICAgICAgICAgIHN3aXRjaChrZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRleHQpXG4gICAgICAgICAgICAgICAgICAgIHRleHQuaW5uZXJIVE1MID0gY29udGVudFtrZXldXG4gICAgICAgICAgICAgICAgICAgIEVsZW1lbnRzLnNldFN0eWxlKHRleHQsIHtjb2xvcjogdGhpcy5ub3JtYWxDb2xvcn0pXG4gICAgICAgICAgICAgICAgICAgIEVsZW1lbnRzLmFkZENsYXNzKHRleHQsICd1bnNlbGVjdGFibGUnKVxuICAgICAgICAgICAgICAgICAgICBFbGVtZW50cy5hZGRDbGFzcyh0ZXh0LCAnUG9wdXBDb250ZW50JylcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlICdpbWcnOlxuICAgICAgICAgICAgICAgICAgICBhbGVydChcImltZyB0byBiZSBpbXBsZW1lbnRlZFwiKVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgICAgICAgICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGRpdilcbiAgICAgICAgICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGNvbnRlbnRba2V5XVxuICAgICAgICAgICAgICAgICAgICBFbGVtZW50cy5hZGRDbGFzcyhkaXYsICdQb3B1cENvbnRlbnQnKVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiVW5leHBlY3RlZCBjb250ZW50IHR5cGU6IFwiICsga2V5KVxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm5vdGNoKVxuICAgICAgICB0aGlzLnBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpXG4gICAgICAgIEVsZW1lbnRzLnNldFN0eWxlKHRoaXMuZWxlbWVudCwgdGhpcy5kZWZhdWx0U3R5bGUoKSlcbiAgICAgICAgY29uc29sZS5sb2coXCJQb3B1cC5zZXR1cFwiLCB0aGlzLmRlZmF1bHRTdHlsZSgpKVxuICAgICAgICB0aGlzLmxheW91dCgpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqIExheW91dCB0aGUgbWVudSBpdGVtc1xuICAgICAqL1xuICAgIGxheW91dCgpIHtcblxuICAgIH1cblxuICAgIC8qKiBDbG9zZSBhbmQgcmVtb3ZlIHRoZSBQb3B1cCBmcm9tIHRoZSBET00gdHJlZS5cbiAgICAqL1xuICAgIGNsb3NlKCkge1xuICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gICAgICAgIGlmIChQb3B1cC5vcGVuUG9wdXAgPT0gdGhpcykge1xuICAgICAgICAgICAgUG9wdXAub3BlblBvcHVwID0gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIFNob3dzIHRoZSBQb3B1cCB3aXRoIHRoZSBnaXZlbiBjb21tYW5kcyBhdCB0aGUgc3BlY2lmaWVkIHBvaW50LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gQSBkaWN0IG9iamVjdCB3aXRoIHR5cGUgc3RyaW5ncyAodGV4dCwgaW1nLCBodG1sKSBhcyBrZXlzXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7UG9pbnR9IHBvaW50IC0gVGhlIHBvc2l0aW9uIGFzIHgsIHkgY29vcmRpbmF0ZXMge3B4fS5cbiAgICAgKiBAcmV0dXJuIHtQb3B1cH0gdGhpc1xuICAgICovXG4gICAgc2hvd0F0KGNvbnRlbnQsIHBvaW50KSB7XG4gICAgICAgIHRoaXMuc2hvdyhjb250ZW50KVxuICAgICAgICB0aGlzLnBsYWNlQXQocG9pbnQpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgcGxhY2VBdChwb2ludCkge1xuICAgICAgICBsZXQgeCA9IHBvaW50LnhcbiAgICAgICAgbGV0IHkgPSBwb2ludC55XG4gICAgICAgIGxldCByZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICAgIGxldCBoID0gcmVjdC5ib3R0b20tcmVjdC50b3BcbiAgICAgICAgLyogVE9ETzogSW1wbGVtZW50IGRpZmZlcmVudCBub3RjaFBvc2l0aW9ucyAqL1xuICAgICAgICBzd2l0Y2godGhpcy5ub3RjaFBvc2l0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIFwiYm90dG9tTGVmdFwiOlxuICAgICAgICAgICAgICAgIHggLT0gdGhpcy5wYWRkaW5nXG4gICAgICAgICAgICAgICAgeCAtPSB0aGlzLm5vdGNoU2l6ZVxuICAgICAgICAgICAgICAgIHkgLT0gKHRoaXMubm90Y2hTaXplK2gpO1xuICAgICAgICAgICAgICAgIEVsZW1lbnRzLnNldFN0eWxlKHRoaXMuZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgIHsgbGVmdDogeCArICdweCcsIHRvcDogeSArICdweCd9IClcbiAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgICBjYXNlIFwidG9wTGVmdFwiOlxuICAgICAgICAgICAgICAgIHggLT0gdGhpcy5wYWRkaW5nXG4gICAgICAgICAgICAgICAgeCAtPSB0aGlzLm5vdGNoU2l6ZVxuICAgICAgICAgICAgICAgIHkgKz0gdGhpcy5ub3RjaFNpemVcbiAgICAgICAgICAgICAgICBFbGVtZW50cy5zZXRTdHlsZSh0aGlzLmVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIHsgbGVmdDogeCArICdweCcsIHRvcDogeSArICdweCd9IClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBFbGVtZW50cy5zZXRTdHlsZSh0aGlzLmVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIHsgbGVmdDogeCArICdweCcsIHRvcDogeSArICdweCd9IClcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIFNob3dzIHRoZSBQb3B1cCB3aXRoIHRoZSBnaXZlbiBjb21tYW5kcyBhdCB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudCAtIEEgZGljdCBvYmplY3Qgd2l0aCB0eXBlIHN0cmluZ3MgKHRleHQsIGltZywgaHRtbCkgYXMga2V5c1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgICAgKiBAcmV0dXJuIHtQb3B1cH0gdGhpc1xuICAgICAqL1xuICAgIHNob3coY29udGVudCkge1xuICAgICAgICB0aGlzLnNldHVwKGNvbnRlbnQpXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgLyoqIENvbmZpZ3VyYXRpb24gb2JqZWN0LiBSZXR1cm4gZGVmYXVsdCBzdHlsZXMgYXMgQ1NTIHZhbHVlcy5cbiAgICAqL1xuICAgIGRlZmF1bHRTdHlsZSgpIHtcbiAgICAgICAgbGV0IHBhZGRpbmcgPSB0aGlzLnBhZGRpbmdcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogTWF0aC5yb3VuZCh0aGlzLnBhZGRpbmcgLyAyKSArICdweCcsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuYmFja2dyb3VuZENvbG9yLFxuICAgICAgICAgICAgcGFkZGluZzogdGhpcy5wYWRkaW5nICsgJ3B4JyxcbiAgICAgICAgICAgIG1heFdpZHRoOiB0aGlzLm1heFdpZHRoICsgJ3B4JyxcbiAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMTBweCAxNXB4IHJnYmEoMCwgMCwgMCwgMC4zKScsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGZvbnRGYW1pbHkgOiB0aGlzLmZvbnRGYW1pbHksXG4gICAgICAgICAgICBmb250U2l6ZTogdGhpcy5mb250U2l6ZSxcbiAgICAgICAgICAgIHN0cm9rZTogJ2JsYWNrJyxcbiAgICAgICAgICAgIGZpbGwgOiAnd2hpdGUnfVxuICAgIH1cblxuICAgIC8qKiBDb25maWd1cmF0aW9uIG9iamVjdC4gUmV0dXJuIG5vdGNoIHN0eWxlcyBhcyBDU1MgdmFsdWVzLlxuICAgICovXG4gICAgbm90Y2hTdHlsZSgpIHtcbiAgICAgICAgc3dpdGNoKHRoaXMubm90Y2hQb3NpdGlvbikge1xuICAgICAgICAgICAgY2FzZSBcImJvdHRvbUxlZnRcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDEycHggMTVweCByZ2JhKDAsIDAsIDAsIDAuMSknLFxuICAgICAgICAgICAgICAgICAgICBib3R0b206IC10aGlzLm5vdGNoU2l6ZSArICdweCcsIC8vICctMTBweCcsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJUb3A6IHRoaXMubm90Y2hTaXplICsgJ3B4IHNvbGlkICcgKyB0aGlzLmJhY2tncm91bmRDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmlnaHQ6IHRoaXMubm90Y2hTaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyTGVmdDogdGhpcy5ub3RjaFNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206IDBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIFwidG9wTGVmdFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogLXRoaXMubm90Y2hTaXplICsgJ3B4JyxcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogdGhpcy5ub3RjaFNpemUgKyAncHggc29saWQgJyArIHRoaXMuYmFja2dyb3VuZENvbG9yLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJSaWdodDogdGhpcy5ub3RjaFNpemUgKyAncHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJMZWZ0OiB0aGlzLm5vdGNoU2l6ZSArICdweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclRvcDogMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCAxMnB4IDE1cHggcmdiYSgwLCAwLCAwLCAwLjEpJyxcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiAtdGhpcy5ub3RjaFNpemUgKyAncHgnLCAvLyAnLTEwcHgnLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyVG9wOiB0aGlzLm5vdGNoU2l6ZSArICdweCBzb2xpZCAnICsgdGhpcy5iYWNrZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiB0aGlzLm5vdGNoU2l6ZSArICdweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlckxlZnQ6IHRoaXMubm90Y2hTaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiAwXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIENvbnZlbmllbnQgc3RhdGljIG1ldGhvZHMgdG8gc2hvdyBhbmQgcmV1c2UgYSBQb3B1cCBpbXBsZW1lbnRlZFxuICAgICAqIGFzIGEgY2xhc3MgdmFyaWFibGUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnQgLSBBIGRpY3Qgb2JqZWN0IHdpdGggdHlwZSBzdHJpbmdzICh0ZXh0LCBpbWcsIGh0bWwpIGFzIGtleXNcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHtQb2ludH0gcG9pbnQgLSBUaGUgcG9zaXRpb24gYXMgeCwgeSBjb29yZGluYXRlcyB7cHh9LlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYXV0b0Nsb3NlIC0gQXV0b2Nsb3NlIHRoZSBtZW51IGFmdGVyIHNlbGVjdGluZyBhbiBpdGVtLlxuICAgICAqL1xuICAgIHN0YXRpYyBvcGVuKGNvbnRlbnQsIHBvaW50LCB7cGFyZW50ID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU9JzFlbScsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk9J0FyaWFsJyxcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZz0xNixcbiAgICAgICAgICAgICAgICAgICAgbm90Y2hTaXplPTEwLFxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2hQb3M9ZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG1heFdpZHRoPTgwMCxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yPScjRUVFJyxcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsQ29sb3I9JyM0NDQnLFxuICAgICAgICAgICAgICAgICAgICBhdXRvQ2xvc2U9dHJ1ZX0gPSB7fSkge1xuICAgICAgICBpZiAoUG9wdXAub3BlblBvcHVwKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlUG9wdXAoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcG9pbnQgPSBjb252ZXJ0UG9pbnRGcm9tUGFnZVRvTm9kZShwYXJlbnQsIHBvaW50LngsIHBvaW50LnkpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG5vdGNoUG9zaXRpb24gPSAnYm90dG9tTGVmdCdcbiAgICAgICAgaWYgKHBvaW50LnkgPCA1MCkge1xuICAgICAgICAgICAgaWYoc3dpdGNoUG9zKW5vdGNoUG9zaXRpb24gPSAndG9wTGVmdCdcbiAgICAgICAgfVxuICAgICAgICBsZXQgcG9wdXAgPSBuZXcgUG9wdXAoe3BhcmVudCwgZm9udFNpemUsIHBhZGRpbmcsIG5vdGNoU2l6ZSwgc3dpdGNoUG9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhXaWR0aCwgYmFja2dyb3VuZENvbG9yLCBub3JtYWxDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90Y2hQb3NpdGlvbiwgYXV0b0Nsb3NlfSlcbiAgICAgICAgcG9wdXAuc2hvd0F0KGNvbnRlbnQsIHBvaW50KVxuICAgICAgICBQb3B1cC5vcGVuUG9wdXAgPSBwb3B1cFxuICAgICAgICAvKmlmIChhdXRvQ2xvc2UpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZSkgPT4gdGhpcy5jbG9zZVBvcHVwKGUpLCB0cnVlKVxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZSkgPT4gdGhpcy5jbG9zZVBvcHVwKGUpLCB0cnVlKVxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgKGUpID0+IHRoaXMuY2xvc2VQb3B1cChlKSwgdHJ1ZSlcbiAgICAgICAgfSovXG4gICAgICAgIFBvcHVwLmNsb3NlRXZlbnRMaXN0ZW5lciA9IChlKSA9PiB7IGlmICh0aGlzLmV2ZW50T3V0c2lkZShlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZVBvcHVwKGUpO307XG4gICAgICAgIGlmIChhdXRvQ2xvc2UpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBQb3B1cC5jbG9zZUV2ZW50TGlzdGVuZXIsIHRydWUpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBQb3B1cC5jbG9zZUV2ZW50TGlzdGVuZXIsIHRydWUpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgUG9wdXAuY2xvc2VFdmVudExpc3RlbmVyLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBldmVudE91dHNpZGUoZSkge1xuICAgICAgICByZXR1cm4gIUVsZW1lbnRzLmhhc0NsYXNzKGUudGFyZ2V0LCAnUG9wdXBDb250ZW50JylcbiAgICB9XG5cbiAgICAvKiogQ29udmVuaWVudCBzdGF0aWMgbWV0aG9kcyB0byBjbG9zZSB0aGUgUG9wdXAgaW1wbGVtZW50ZWRcbiAgICAgKiBhcyBhIGNsYXNzIHZhcmlhYmxlLlxuICAgICAqL1xuICAgIHN0YXRpYyBjbG9zZVBvcHVwKGUpIHtcbiAgICAgICAgaWYgKFBvcHVwLm9wZW5Qb3B1cCkge1xuICAgICAgICAgICAgUG9wdXAub3BlblBvcHVwLmNsb3NlKClcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyogQ2xhc3MgdmFyaWFibGUgKi9cblBvcHVwLm9wZW5Qb3B1cCA9IG51bGxcbiIsImltcG9ydCB7UG9pbnRzfSBmcm9tICcuLi8uLi8uLi9saWIvdXRpbHMuanMnXG5pbXBvcnQgUG9wdXAgZnJvbSAnLi4vLi4vLi4vbGliL3BvcHVwLmpzJ1xuXG4vKioqIEJhc2UgcGFyc2VyIGZvciBsb2FkaW5nIEV5ZVZpc2l0LXN0eWxlIFhNTC4gQ29udmVydHMgdGhlIFhNTCBpbnRvXG4gKiBhbiBpbnRlcm5hbCBKU09OIGZvcm1hdCB0aGF0IGluIHR1cm4gaXMgY29udmVydGVkIGludG8gYSBIVE1MIDUgcmVwcmVzZW50YXRpb25cbiAqIG9mIEV5ZVZpc2l0IGNhcmRzLlxuICpcbiAqIERlZmluZXMgdGhlIGJhc2UgQVBJIGZvciBwcm9jZXNzaW5nIHRoZSBYTUwuXG4qKiovXG5cbmNsYXNzIFhNTFBhcnNlciB7XG5cbiAgY29uc3RydWN0b3IocGF0aCkge1xuICAgIHRoaXMucGF0aCA9IHBhdGhcbiAgICBsZXQgYmFzZVBhdGggPSB0aGlzLnJlbW92ZUxhc3RTZWdtZW50KHRoaXMucGF0aClcbiAgICB0aGlzLmJhc2VQYXRoID0gdGhpcy5yZW1vdmVMYXN0U2VnbWVudChiYXNlUGF0aClcbiAgfVxuXG4gIHJlbW92ZUxhc3RTZWdtZW50KHBhdGgpIHtcbiAgICBsZXQgdG8gPSBwYXRoLmxhc3RJbmRleE9mKCcvJylcbiAgICByZXR1cm4gcGF0aC5zdWJzdHJpbmcoMCwgdG8pXG4gIH1cblxuICBleHRyYWN0TGFzdFNlZ21lbnQocGF0aCkge1xuICAgIGxldCB0byA9IHBhdGgubGFzdEluZGV4T2YoJy8nKVxuICAgIHJldHVybiBwYXRoLnN1YnN0cmluZyh0byArIDEsIHBhdGgubGVuZ3RoKVxuICB9XG5cbiAgLyoqKiBMb2FkcyB0aGUgWE1MIGZyb20gdGhlIGdpdmVuIHBhdGguICoqKi9cbiAgbG9hZFhNTCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgdXJsOiB0aGlzLnBhdGgsXG4gICAgICAgIGRhdGFUeXBlOiBcInhtbFwiLFxuICAgICAgICBzdWNjZXNzOiAoeG1sKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh4bWwpXG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiAoZSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIkVycm9yIGxvYWRpbmcgXCIgKyB0aGlzLnBhdGgsIGUpXG4gICAgICAgICAgcmVqZWN0KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLyoqKiBFbnRyeSBwb2ludCwgbG9hZHMgYW5kIHBhcnNlcyB0aGUgWE1MLiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gICAgY29tcGxldGVzIGlmIGFsbCBzdWIgb2JqZWN0cyBhcmUgbG9hZGVkIGFuZCBjb252ZXJ0ZWQgaW50byBhIHNpbmdsZVxuICAgIERPTSB0cmVlIGFuZCB0byBhZGQuKioqL1xuICBsb2FkUGFyc2VBbmRDcmVhdGVET00oKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdGhpcy5sb2FkWE1MKCkudGhlbigoeG1sKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlWE1MKHhtbCkudGhlbigoanNvbikgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkb21UcmVlID0gdGhpcy5jcmVhdGVET00oanNvbilcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRvbVRyZWUpXG4gICAgICAgICAgICB9KS5jYXRjaCgocmVhc29uKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwicGFyc2VYTUwgZmFpbGVkXCIsIHJlYXNvbilcbiAgICAgICAgICAgICAgICByZWplY3QocmVhc29uKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSkuY2F0Y2goKHJlYXNvbikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwibG9hZFhNTCBmYWlsZWRcIiwgcmVhc29uKVxuICAgICAgICAgICAgcmVqZWN0KHJlYXNvbilcbiAgICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgbG9hZEFuZFBhcnNlWE1MKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmxvYWRYTUwoKS50aGVuKCh4bWwpID0+IHtcbiAgICAgICAgdGhpcy5wYXJzZVhNTCh4bWwpLnRoZW4oKGpzb24pID0+IHtcbiAgICAgICAgICAgICByZXNvbHZlKGpzb24pXG4gICAgICAgIH0pLmNhdGNoKChyZWFzb24pID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcInBhcnNlWE1MIGluIGxvYWRBbmRQYXJzZVhNTCBmYWlsZWRcIiwgcmVhc29uKVxuICAgICAgICAgICAgcmVqZWN0KHJlYXNvbilcbiAgICAgICAgfSlcbiAgICAgIH0pLmNhdGNoKChyZWFzb24pID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcImxvYWRYTUwgaW4gbG9hZEFuZFBhcnNlWE1MIGZhaWxlZFwiLCByZWFzb24pXG4gICAgICAgICAgICByZWplY3QocmVhc29uKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLyoqKiBQYXJzZSB0aGUgcmVjZWl2ZWQgWE1MIGludG8gYSBKU09OIHN0cnVjdHVyZS4gUmV0dXJucyBhIHByb21pc2UuICoqKi9cbiAgcGFyc2VYTUwoeG1sZGF0KSB7XG4gICAgY29uc29sZS53YXJuKFwiTmVlZHMgdG8gYmUgb3ZlcndyaXR0ZW5cIilcbiAgfVxuXG4gIC8qKiogQ3JlYXRlIERPTSBub2RlcyBmcm9tIEpTT04gc3RydWN0dXJlLiBSZXR1cm5zIGEgcHJvbWlzZS4gKioqL1xuICBjcmVhdGVET00oanNvbikge1xuICAgIGNvbnNvbGUud2FybihcIk5lZWRzIHRvIGJlIG92ZXJ3cml0dGVuXCIpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFhNTEluZGV4UGFyc2VyIGV4dGVuZHMgWE1MUGFyc2VyIHtcblxuICBjb25zdHJ1Y3RvcihwYXRoLCB7IHdpZHRoPSB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICBhc3NldHNQYXRoPSAnLi4vLi4vdmFyL2V5ZXZpc2l0L2NhcmRzLycsXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3JzID0geyBhcnRpc3Q6JyNiMGM2YjInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWE6JyNjM2MwZDEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsczonI2RlYzFiMicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWJlbl9kZXNfa3Vuc3R3ZXJrczogJyNlMWRlYTcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga29tcG9zaXRpb246ICcjYmViZWJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpY2h0X3VuZF9mYXJiZTogJyM5MGEyYWInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFfaW5mbzogJyNjOGQ5ZDcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmE6ICcjYzhkOWQ3JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhaW5mbzogJyNjOGQ5ZDcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJ0d29yazogJyNlMWRlYTcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVjaG5pazogJyNkOWIzYmQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICB9ID0ge30pIHtcbiAgICBzdXBlcihwYXRoKVxuICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgdGhpcy5hc3NldHNQYXRoID0gYXNzZXRzUGF0aFxuICAgIHRoaXMuY29sb3JzID0gY29sb3JzXG4gIH1cblxuICBwYXJzZVhNTCh4bWxkYXQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IGluZGV4ZGF0ID0ge1xuICAgICAgICBjYXJkczogW10sXG4gICAgICAgIGNhcmRzb3VyY2VzOiBbXVxuICAgICAgfVxuICAgICAgbGV0IGRhdGEgPSAkKHhtbGRhdCkuZmluZCgnZGF0YScpXG4gICAgICBmb3IgKGxldCBrZXkgb2ZbJ3RodW1ibmFpbCcsXG4gICAgICAgICdhcnRpc3QnLFxuICAgICAgICAndGl0bGUnLFxuICAgICAgICAnbWlzYycsXG4gICAgICAgICdkZXNjcmlwdGlvbicsXG4gICAgICAgICd5ZWFyJyxcbiAgICAgICAgJ25yJyxcbiAgICAgICAgJ2Fubm90YXRpb24nXSkge1xuICAgICAgICBpbmRleGRhdFtrZXldID0gZGF0YS5maW5kKGtleSkuaHRtbCgpXG4gICAgICB9XG4gICAgICBsZXQgcHJvbWlzZXMgPSBbXVxuICAgICAgZGF0YS5maW5kKCdjYXJkJykuZWFjaCgoaSwgY2FyZCkgPT4ge1xuICAgICAgICBsZXQgc3JjID0gJChjYXJkKS5hdHRyKCdzcmMnKVxuICAgICAgICBpbmRleGRhdC5jYXJkc291cmNlcy5wdXNoKHNyYylcbiAgICAgICAgbGV0IHBhcnNlciA9IG5ldyBYTUxDYXJkUGFyc2VyKHRoaXMuYmFzZVBhdGggKyAnLycgKyBzcmMpXG4gICAgICAgIGxldCBzdWJDYXJkID0gcGFyc2VyLmxvYWRBbmRQYXJzZVhNTCgpLnRoZW4oKGpzb24pID0+IHtcbiAgICAgICAgICBpbmRleGRhdC5jYXJkcy5wdXNoKGpzb24pXG4gICAgICAgIH0pXG4gICAgICAgIHByb21pc2VzLnB1c2goc3ViQ2FyZClcbiAgICAgIH0pXG4gICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIHJlc29sdmUoaW5kZXhkYXQpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBjcmVhdGVET00odHJlZSkge1xuXG4gICAgbGV0IHRhcmdldG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICQodGFyZ2V0bm9kZSkuYXR0cignaWQnLCB0cmVlLm5yKVxuXG4gICAgbGV0IGNsb25lID0gJChcIiNCQUNLXCIpLmh0bWwoKVxuICAgICQodGFyZ2V0bm9kZSkuYXBwZW5kKGNsb25lKVxuICAgIGNsb25lID0gJCh0YXJnZXRub2RlKS5jaGlsZHJlbigpLmxhc3QoKVxuXG4gICAgJCgkKGNsb25lKS5maW5kKCdoZWFkZXIgaW1nJykpLmF0dHIoJ3NyYycsIHRoaXMuYXNzZXRzUGF0aCArIHRyZWUudGh1bWJuYWlsKVxuICAgICQoJChjbG9uZSkuZmluZCgnLmFydGlzdCcpKS5hcHBlbmQodHJlZS5hcnRpc3QpXG4gICAgJCgkKGNsb25lKS5maW5kKCcudGl0bGUnKSkuYXBwZW5kKHRyZWUudGl0bGUpXG4gICAgJCgkKGNsb25lKS5maW5kKCcubWlzYycpKS5hcHBlbmQodHJlZS5taXNjKVxuICAgICQoJChjbG9uZSkuZmluZCgnLmRlc2NyaXB0aW9uJykpLmFwcGVuZCh0cmVlLmRlc2NyaXB0aW9uKVxuXG4gICAgaWYgKHRyZWUuYW5ub3RhdGlvbiAhPSBudWxsKSB7XG4gICAgICAkKCQoY2xvbmUpKS5maW5kKCcuYW5ub3RhdGlvbicpLmFwcGVuZCh0cmVlLmFubm90YXRpb24pXG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmVlLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgaWQgPSB0cmVlLmNhcmRzb3VyY2VzW2ldLm1hdGNoKC9bXi9dKiQvLCAnJylbMF0ucmVwbGFjZSgnLnhtbCcsICcnKVxuICAgICAgbGV0IGNhcmRjbG9uZSA9ICQoXCIjQ0FSRFwiKS5odG1sKClcbiAgICAgICQoY2xvbmUpLmZpbmQoJ21haW4nKS5hcHBlbmQoY2FyZGNsb25lKVxuICAgICAgY2FyZGNsb25lID0gJChjbG9uZSkuZmluZCgnbWFpbicpLmNoaWxkcmVuKCkubGFzdCgpXG4gICAgICBjYXJkY2xvbmUuYXR0cignaWQnLCBpZClcbiAgICAgIHRoaXMuY3JlYXRlQ2FyZERPTSh0cmVlLmNhcmRzW2ldLCBjYXJkY2xvbmUpXG4gICAgfVxuXG4gICAgdGhpcy5zZXR1cEluZGV4KHRhcmdldG5vZGUpXG4gICAgcmV0dXJuIHRhcmdldG5vZGVcbiAgfVxuXG4gIGNyZWF0ZUNhcmRET00odHJlZSwgdGFyZ2V0bm9kZSkge1xuXG4gICAgaWYgKHRyZWUudGVtcGxhdGUgPT0gMikge1xuICAgICAgdGFyZ2V0bm9kZS5maW5kKCcjbGVmdGNvbCcpLmFkZENsYXNzKCd3aWRlJylcbiAgICAgIHRhcmdldG5vZGUuZmluZCgnI3JpZ2h0Y29sJykuYWRkQ2xhc3MoJ25hcnJvdycpXG4gICAgfVxuXG4gICAgbGV0IGNvbGN0ID0gMlxuXG4gICAgaWYgKHRyZWUudGVtcGxhdGUgPT0gMykge1xuICAgICAgdGFyZ2V0bm9kZS5maW5kKCcud3JhcHBlcicpLmFwcGVuZChcIjxkaXYgaWQ9J2JvdHRvbWNvbCc+PC9kaXY+XCIpXG4gICAgICAvLyBzZXQgbGVmdGNvbC9yaWdodGNvbCBoZWlnaHRcbiAgICAgIC8vIHNldCBib3R0b20gY29sIHN0eWxlc1xuICAgICAgY29sY3QgPSAzXG4gICAgfVxuXG4gICAgdGFyZ2V0bm9kZS5maW5kKCcudGl0bGViYXInKS5hcHBlbmQoJzxwPicgKyB0cmVlLmhlYWRlciArICc8L3A+JylcbiAgICB0YXJnZXRub2RlLmZpbmQoJy50aXRsZWJhcicpLmNzcyh7J2JhY2tncm91bmQnOiB0aGlzLmNvbG9yc1t0cmVlLnR5cGVdfSlcbiAgICB0YXJnZXRub2RlLmZpbmQoJy5wcmV2aWV3JykuYXBwZW5kKCc8cD4nICsgdHJlZS5wcmV2aWV3ICsgJzwvcD4nKVxuICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBjb2xjdCsxOyBpbmRleCsrKSB7XG5cbiAgICAgIGxldCB0YXJnZXRjb2wgPSB0YXJnZXRub2RlLmZpbmQoJy53cmFwcGVyJykuY2hpbGRyZW4oKVtpbmRleF1cbiAgICAgIGxldCBzb3VyY2Vjb2wgPSB0YXJnZXRub2RlLmZpbmQoJy53cmFwcGVyJykuY2hpbGRyZW4oKVtpbmRleF0uaWRcbiAgICAgIC8vY29uc29sZS5sb2coc291cmNlY29sKVxuXG4gICAgICB3aGlsZSAodHJlZVtzb3VyY2Vjb2xdLmxlbmd0aCA+IDApIHtcblxuICAgICAgICBsZXQgbm9kZSA9IHRyZWVbc291cmNlY29sXS5wb3AoKVxuXG4gICAgICAgIGlmIChub2RlLnR5cGUgPT0gXCJ0ZXh0XCIpIHtcbiAgICAgICAgICBsZXQgY2xvbmUgPSAkKFwiI1RFWFRcIikuaHRtbCgpXG4gICAgICAgICAgJCh0YXJnZXRjb2wpLmFwcGVuZChjbG9uZSkuZmluZChcIi50ZXh0XCIpLmxhc3QoKS5hcHBlbmQobm9kZS5odG1sKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PSBcInNpbmdsZWltYWdlXCIpIHtcblxuICAgICAgICAgIGxldCBjbG9uZSA9ICQoXCIjU0lOR0xFSU1BR0VcIikuaHRtbCgpXG4gICAgICAgICAgJCh0YXJnZXRjb2wpLmFwcGVuZChjbG9uZSlcbiAgICAgICAgICBjbG9uZSA9ICQodGFyZ2V0Y29sKS5jaGlsZHJlbigpLmxhc3QoKVxuXG4gICAgICAgICAgLypsZXQgcmF0aW8gPSB0aGlzLmdldFJhdGlvKHRoaXMuYXNzZXRzUGF0aCArIG5vZGUuc291cmNlKVxuICAgICAgICAgIGxldCBoID0gKG5vZGUubWF4aGVpZ2h0IC8gNjcwKSAqIHRoaXMuaGVpZ2h0XG4gICAgICAgICAgbGV0IHcgPSBoICogcmF0aW8qL1xuXG4gICAgICAgICAgLyokKGNsb25lKS5jc3Moe1xuICAgICAgICAgICAgJ2hlaWdodCc6IGgsXG4gICAgICAgICAgICAnd2lkdGgnOiB3XG4gICAgICAgICAgfSkqL1xuXG4gICAgICAgICAgbGV0IGN1ck1haW5JbWcgPSAkKCQoY2xvbmUpLmNoaWxkcmVuKCcubWFpbmltZycpKVxuICAgICAgICAgIGxldCBjdXJGaWd1cmUgPSAkKGNsb25lKVxuXG4gICAgICAgICAgY3VyTWFpbkltZy5vbignbG9hZCcsIHRoaXMubWFpbkltZ0xvYWRlZC5iaW5kKHRoaXMsIGN1ckZpZ3VyZSwgbm9kZSkgKS8qIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxPQURFRFwiLCBjbG9uZSwgY3VyTWFpbkltZy53aWR0aCgpLCBjdXJNYWluSW1nLmhlaWdodCgpIClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGN1ck1haW5JbWcuZ2V0KCkubmF0dXJhbFdpZHRoLCBjdXJGaWd1cmUuZ2V0KCkubmF0dXJhbFdpZHRoKVxuICAgICAgICAgIH0pKi9cblxuICAgICAgICAgICQoJChjbG9uZSkuY2hpbGRyZW4oJy5tYWluaW1nJykpLmF0dHIoJ3NyYycsIHRoaXMuYXNzZXRzUGF0aCArIG5vZGUuc291cmNlKVxuICAgICAgICAgICQoY2xvbmUpLmF0dHIoJ2lkJywgbm9kZS5pZClcbiAgICAgICAgICAkKCQoY2xvbmUpLmNoaWxkcmVuKCcuem9vbWljb24nKSkuYXR0cignaWQnLCBub2RlLmljb25pZClcblxuICAgICAgICAgICQoY2xvbmUpLmNoaWxkcmVuKCdmaWdjYXB0aW9uLmNhcCcpLmFwcGVuZChub2RlLmNhcCkgLy8gdW86IGFscmVhZHkgcmVwbGFjZWQgaW4gcGFyc2VYTUwgLnJlcGxhY2UoXCImbHQ7XCIsIFwiPFwiKS5yZXBsYWNlKFwiJmd0O1wiLCBcIj5cIilcbiAgICAgICAgICAkKGNsb25lKS5jaGlsZHJlbignZmlnY2FwdGlvbi56b29tY2FwJykuYXBwZW5kKG5vZGUuem9vbWNhcClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub2RlLnR5cGUgPT0gXCJ2aWRlb1wiKSB7XG5cbiAgICAgICAgICBsZXQgdGFyZ2V0c3JjID0gbm9kZS5zb3VyY2UucmVwbGFjZSgnZjR2JywgJ21wNCcpXG5cbiAgICAgICAgICBsZXQgY2xvbmUgPSAkKFwiI1ZJREVPXCIpLmh0bWwoKVxuICAgICAgICAgICQodGFyZ2V0Y29sKS5hcHBlbmQoY2xvbmUpXG4gICAgICAgICAgY2xvbmUgPSAkKHRhcmdldGNvbCkuY2hpbGRyZW4oKS5sYXN0KClcblxuICAgICAgICAgICQoY2xvbmUpLmNzcyh7XG4gICAgICAgICAgICAnbWF4LWhlaWdodCc6IChub2RlLm1heGhlaWdodCAvIDY3MCkgKiB0aGlzLmhlaWdodFxuICAgICAgICAgIH0pXG4gICAgICAgICAgJCgkKGNsb25lKS5jaGlsZHJlbigndmlkZW8nKS5jaGlsZHJlbignc291cmNlJykpLmF0dHIoJ3NyYycsIHRoaXMuYXNzZXRzUGF0aCArIHRhcmdldHNyYylcblxuICAgICAgICAgICQoY2xvbmUpLmF0dHIoJ2lkJywgbm9kZS5pZClcbiAgICAgICAgICAkKCQoY2xvbmUpLmNoaWxkcmVuKCcuem9vbWljb24nKSkuYXR0cignaWQnLCBub2RlLmljb25pZClcbiAgICAgICAgICAkKGNsb25lKS5jaGlsZHJlbignZmlnY2FwdGlvbi5jYXAnKS5hcHBlbmQobm9kZS5jYXApIC8vIHVvOiBhbHJlYWR5IHJlcGxhY2VkIGluIHBhcnNlWE1MIC5yZXBsYWNlKFwiJmx0O1wiLCBcIjxcIikucmVwbGFjZShcIiZndDtcIiwgXCI+XCIpKVxuICAgICAgICAgICQoY2xvbmUpLmNoaWxkcmVuKCdmaWdjYXB0aW9uLnpvb21jYXAnKS5hcHBlbmQobm9kZS56b29tY2FwKVxuXG4gICAgICAgICAgJChjbG9uZSkuYXBwZW5kKG5vZGUpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAobm9kZS50eXBlID09IFwic3BhY2VcIikge1xuICAgICAgICAgICQodGFyZ2V0Y29sKS5hcHBlbmQoJChcIiNTUEFDRVwiKS5odG1sKCkpXG4gICAgICAgICAgbGV0IGNsb25lID0gJCh0YXJnZXRjb2wpLmNoaWxkcmVuKCkubGFzdCgpXG4gICAgICAgICAgJChjbG9uZSkuY3NzKHtoZWlnaHQ6IG5vZGUuaGVpZ2h0fSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub2RlLnR5cGUgPT0gXCJncm91cGltYWdlXCIpIHtcblxuICAgICAgICAgIGxldCBjbG9uZSA9ICQoXCIjR1JPVVBJTUFHRVwiKS5odG1sKClcbiAgICAgICAgICAkKHRhcmdldGNvbCkuYXBwZW5kKGNsb25lKVxuICAgICAgICAgIGNsb25lID0gJCh0YXJnZXRjb2wpLmNoaWxkcmVuKCkubGFzdCgpXG5cbiAgICAgICAgICAkKGNsb25lKS5jc3Moe1xuICAgICAgICAgICAgJ2hlaWdodCc6IChub2RlLm1heGhlaWdodCAvIDY3MCkgKiB0aGlzLmhlaWdodFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICBsZXQgbGVuID0gT2JqZWN0LmtleXMobm9kZS5maWd1cmVzKS5sZW5ndGhcbiAgICAgICAgICBpZihsZW4gPiAyKXtcbiAgICAgICAgICAgIGxldCBkaWZmID0gbGVuIC0gMlxuICAgICAgICAgICAgd2hpbGUoZGlmZiA+IDApe1xuICAgICAgICAgICAgICBsZXQgZ3JfZmlndXJlID0gJChcIiNHUk9VUElNQUdFX0ZJR1VSRVwiKS5odG1sKClcbiAgICAgICAgICAgICAgJChjbG9uZSkuYXBwZW5kKGdyX2ZpZ3VyZSlcbiAgICAgICAgICAgICAgZGlmZiAtPSAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgbGV0IGZpZ3VyZSA9ICQoJChjbG9uZSkuY2hpbGRyZW4oJ2ZpZ3VyZScpW2pdKVxuICAgICAgICAgICAgZmlndXJlLmNoaWxkcmVuKCcubWFpbmltZ2hhbGYnKS5hdHRyKCdzcmMnLCB0aGlzLmFzc2V0c1BhdGggKyBub2RlLmZpZ3VyZXNbaisxXS5zb3VyY2UpXG4gICAgICAgICAgICBmaWd1cmUuYXR0cignaWQnLCBub2RlLmZpZ3VyZXNbaisxXS5pZClcbiAgICAgICAgICAgIGZpZ3VyZS5jaGlsZHJlbignLnpvb21pY29uJykuYXR0cignaWQnLCBub2RlLmZpZ3VyZXNbaisxXS5pY29uaWQpXG5cbiAgICAgICAgICAgIGZpZ3VyZS5jaGlsZHJlbignZmlnY2FwdGlvbi5jYXAnKS5hcHBlbmQobm9kZS5maWd1cmVzW2orMV0uY2FwKVxuICAgICAgICAgICAgZmlndXJlLmNoaWxkcmVuKCdmaWdjYXB0aW9uLnpvb21jYXAnKS5hcHBlbmQobm9kZS5maWd1cmVzW2orMV0uem9vbWNhcClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0YXJnZXRub2RlLmZpbmQoJ2EnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdmFsdWUgPSB0cmVlLnRvb2x0aXBkYXRhWyQodGhpcykuYXR0cignZGF0YS10YXJnZXQnKV1cbiAgICAgICAgJCh0aGlzKS5hdHRyKCdkYXRhLXRvb2x0aXAnLCB2YWx1ZSlcbiAgICB9KVxuXG4gIH1cblxuICBtYWluSW1nTG9hZGVkKGZpZywgbm9kZSl7XG4gICAgLy9sYXlvdXQgd2hpY2ggZGVwZW5kcyBvbiB0aGUgYWN0dWFsIG1haW4gaW1nIHNpemUgZ29lcyBoZXJlXG4gICAgbGV0IGN1ck1haW5JbWcgPSAkKGZpZy5jaGlsZHJlbignLm1haW5pbWcnKSlcbiAgICBsZXQgcmF0aW8gPSBjdXJNYWluSW1nLndpZHRoKCkgLyBjdXJNYWluSW1nLmhlaWdodCgpXG5cbiAgICAvLyBzaG93IGltYWdlIGhpZ2hsaWdodHNcbiAgICBsZXQgaGlnaGxpZ2h0cyA9IG5vZGUuaGlnaGxpZ2h0c1xuICAgIG5vZGUgPSBcIlwiXG5cbiAgICB3aGlsZSAoaGlnaGxpZ2h0cy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgaGlnaGxpZ2h0ID0gaGlnaGxpZ2h0cy5wb3AoKVxuXG4gICAgICAvL2NoYW5nZSBoZWlnaHQgb2YgdGhlIGhpZ2hsaWdodCBhY2NvcmRpbmcgdG8gcmF0aW8gb2YgdGhlIGNvcnJlc3BvbmRpbmcgbWFpbiBpbWdcbiAgICAgIGxldCB0bXBTdHlsZTEgPSBoaWdobGlnaHQuc3R5bGUuc3BsaXQoXCJoZWlnaHQ6XCIpXG4gICAgICBsZXQgdG1wU3R5bGUyID0gdG1wU3R5bGUxWzFdLnNwbGl0KFwiJTt3aWR0aDpcIilcbiAgICAgIGxldCBuZXdTdHlsZSA9IHRtcFN0eWxlMVswXSArIFwiaGVpZ2h0OlwiICsgcGFyc2VGbG9hdCh0bXBTdHlsZTJbMF0pICogcmF0aW8gKyBcIiU7d2lkdGg6XCIgKyB0bXBTdHlsZTJbMV1cbiAgICAgIGhpZ2hsaWdodC5zdHlsZSA9IG5ld1N0eWxlXG5cbiAgICAgIG5vZGUgKz0gXCI8YSBpZD0nXCIgKyBoaWdobGlnaHQuaWQucmVwbGFjZSgvXFwuL2csIFwiX1wiKSArIFwiJyBjbGFzcz0nZGV0YWlsJyBocmVmPScjJyBkYXRhLXRhcmdldD0nXCIgKyBoaWdobGlnaHQudGFyZ2V0ICsgXCInIGRhdGEtcmFkaXVzID0gJ1wiICsgaGlnaGxpZ2h0LnJhZGl1cyArIFwiJyBzdHlsZT0nXCIgKyBoaWdobGlnaHQuc3R5bGUgKyBcIicgPjwvYT5cIlxuICAgICAgLy9jb25zb2xlLmxvZygnaGlnaGxpZ2h0IHdpdGggcmFkaXVzOiAnLCBoaWdobGlnaHQucmFkaXVzLCBoaWdobGlnaHQudGFyZ2V0LCBoaWdobGlnaHQuc3R5bGUpXG4gICAgfVxuXG4gICAgLy9maWcuY2hpbGRyZW4oJ21haW5pbWdDb250YWluZXInKS5hcHBlbmQobm9kZSlcbiAgICBmaWcuYXBwZW5kKG5vZGUpXG4gIH1cblxuICBjb21wbGV0ZWQoZG9tTm9kZSkge1xuICAgIC8qKiogQ2FsbGVkIGFmdGVyIHRoZSBkb21Ob2RlIGhhcyBiZWVuIGFkZGVkLlxuXG4gICAgQXQgdGhpcyBwb2ludCB3ZSBjYW4gcmVnaXN0ZXIgYSBjbGljayBoYW5kbGVyIGZvciB0aGVcbiAgICBmbGlwIHdyYXBwZXIgd2hpY2ggYWxsb3dzIHVzIHRvIGFkZCBhIHBvcHVwIHRoYXQgY2FuIGV4dGVuZCBvdmVyIHRoZSBiYWNrXG4gICAgYW5kIGZyb250IGNhcmQgYm91bmRzLiBOb3RlIHRoYXQgcG9wdXBzIGhhdmUgdG8gYmUgY2xvc2VkIG9uIGNsaWNrIGV2ZW50c1xuICAgIG91dHNpZGUgdGhlIHBvcHVwcy5cblxuICAgIFRPRE86IE9uIG1vYmlsZSBkZXZpY2VzIHdlIGhhdmUgdG9cbiAgICBzdGF5IHdpdGhpbiB0aGUgY2FyZCBib3VuZHMuIFRoYXQncyBtdWNoIG1vcmUgY29tcGxpY2F0ZWQuXG4gICAgKioqL1xuICAgIGxldCB3cmFwcGVyID0gJChkb21Ob2RlKS5jbG9zZXN0KCcuZmxpcFdyYXBwZXInKVxuICAgIHdyYXBwZXIub24oJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgICBsZXQgZG9tQ29udGFpbmVyID0gd3JhcHBlclswXVxuICAgICAgICBpZiAoZG9tQ29udGFpbmVyLnBvcHVwKSB7XG4gICAgICAgICAgICBkb21Db250YWluZXIucG9wdXAuY2xvc2UoKVxuICAgICAgICAgICAgZG9tQ29udGFpbmVyLnBvcHVwID0gbnVsbFxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlWm9vbWFibGUoKVxuICAgICAgICB0aGlzLnJlbW92ZUltYWdlSGlnaGxpZ2h0KClcbiAgICAgICAgbGV0IHRhcmdldCA9ICQoZS50YXJnZXQpXG4gICAgICAgIGxldCB0b29sdGlwID0gdGFyZ2V0LmF0dHIoJ2RhdGEtdG9vbHRpcCcpXG4gICAgICAgIGlmICh0b29sdGlwKSB7XG4gICAgICAgICAgICBsZXQgZ2xvYmFsUG9zID0geyB4OiBlLnBhZ2VYLCB5OiBlLnBhZ2VZIH1cbiAgICAgICAgICAgIGxldCBsb2NhbFBvcyA9IFBvaW50cy5mcm9tUGFnZVRvTm9kZShkb21Db250YWluZXIsIGdsb2JhbFBvcylcblxuICAgICAgICAgICAgbGV0IHBvcHVwID0gbmV3IFBvcHVwKHsgcGFyZW50OiBkb21Db250YWluZXIsIGJhY2tncm91bmRDb2xvcjonIzIyMid9KVxuICAgICAgICAgICAvLyBsb2NhbFBvcy55ID0gdGhpcy5oZWlnaHQgLSBsb2NhbFBvcy55XG4gICAgICAgICAgICBwb3B1cC5zaG93QXQoe2h0bWw6IHRvb2x0aXB9LCBsb2NhbFBvcylcbiAgICAgICAgICAgIGRvbUNvbnRhaW5lci5wb3B1cCA9IHBvcHVwXG5cbiAgICAgICAgICAgIC8qaWYodGFyZ2V0LmF0dHIoJ2NsYXNzJykgPT0gJ2RldGFpbCcpe1xuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRIaWdobGlnaHQgPSB0YXJnZXRcbiAgICAgICAgICAgICAgdGhpcy5vcGVuSW1hZ2VIaWdobGlnaHQoKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ29wZW4gaW1hZ2UgaGlnaGxpZ2h0IHdpdGggaWQ6JywgdGFyZ2V0LmF0dHIoJ2lkJykpXG4gICAgICAgICAgICB9Ki9cblxuICAgICAgICAgICAgaWYodGFyZ2V0LmF0dHIoJ2ltYWdlaGlnaGxpZ2h0aWQnKSl7XG4gICAgICAgICAgICAgIC8vY29uc29sZS5sb2codGFyZ2V0LmF0dHIoJ2ltYWdlaGlnaGxpZ2h0aWQnKSlcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygodGFyZ2V0LmF0dHIoJ2lkJykgKyBcIkRldGFpbFwiKS5yZXBsYWNlKC9cXC4vZywgXCJfXCIpKVxuICAgICAgICAgICAgICBsZXQgZGV0YWlsSWQgPSAodGFyZ2V0LmF0dHIoJ2lkJykgKyBcIkRldGFpbFwiKS5yZXBsYWNlKC9cXC4vZywgXCJfXCIpXG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudEhpZ2hsaWdodCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRldGFpbElkKVxuICAgICAgICAgICAgICB0aGlzLm9wZW5JbWFnZUhpZ2hsaWdodCgpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb3BlbiBpbWFnZSBoaWdobGlnaHQgd2l0aCBpZDonLCB0YXJnZXQuYXR0cignaWQnKSwgdGFyZ2V0KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCd0b29sdGlwIGZvdW5kOicsdGFyZ2V0LCB0YXJnZXQuYXR0cignZGF0YS10b29sdGlwJyksIHRhcmdldC5zY2FsZSwgdGhpcy5jdXJyZW50SGlnaGxpZ2h0KVxuXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHpvb21hYmxlID0gdGFyZ2V0LmNsb3Nlc3QoJy56b29tYWJsZScpXG4gICAgICAgIGlmICh6b29tYWJsZS5sZW5ndGggPiAwICYmICF0b29sdGlwKSB7XG4gICAgICAgICAgICAvLyBsZXQgd3JhcHBlciA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5mbGlwV3JhcHBlcicpXG4vLyAgICAgICAgICAgICBsZXQgZGl2ID0gd3JhcHBlci5maW5kKCcuWm9vbWVkRmlndXJlJylcbi8vICAgICAgICAgICAgIGlmIChkaXYubGVuZ3RoID4gMCkge1xuLy8gICAgICAgICAgICAgICAgIHRoaXMuY2xvc2Vab29tYWJsZSh3cmFwcGVyLCBkaXYpXG4vLyAgICAgICAgICAgICAgICAgcmV0dXJuXG4vLyAgICAgICAgICAgICB9XG5cbiAgICAgICAgICBpZih0YXJnZXQuYXR0cignY2xhc3MnKSA9PSAnZGV0YWlsJyl7XG4gICAgICAgICAgICBsZXQgZ2xvYmFsUG9zID0geyB4OiBlLnBhZ2VYLCB5OiBlLnBhZ2VZIH1cbiAgICAgICAgICAgIGxldCBsb2NhbFBvcyA9IFBvaW50cy5mcm9tUGFnZVRvTm9kZShkb21Db250YWluZXIsIGdsb2JhbFBvcylcblxuICAgICAgICAgICAgbGV0IHNlYXJjaElkID0gdGFyZ2V0LmF0dHIoJ2lkJykuc3BsaXQoJ0RldGFpbCcpXG4gICAgICAgICAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWFyY2hJZFswXSlcbiAgICAgICAgICAgIGxldCB0b29sdGlwID0gdG9vbHRpcEVsZW1lbnQuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oJ2RhdGEtdG9vbHRpcCcpLnZhbHVlXG5cbiAgICAgICAgICAgIGxldCBwb3B1cCA9IG5ldyBQb3B1cCh7IHBhcmVudDogZG9tQ29udGFpbmVyLCBiYWNrZ3JvdW5kQ29sb3I6JyMyMjInfSlcbiAgICAgICAgICAgIGxvY2FsUG9zLnkgPSB0aGlzLmhlaWdodCAtIGxvY2FsUG9zLnlcbiAgICAgICAgICAgIHBvcHVwLnNob3dBdCh7aHRtbDogdG9vbHRpcH0sIGxvY2FsUG9zKVxuICAgICAgICAgICAgZG9tQ29udGFpbmVyLnBvcHVwID0gcG9wdXBcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50SGlnaGxpZ2h0ID0gdGFyZ2V0XG4gICAgICAgICAgICB0aGlzLm9wZW5JbWFnZUhpZ2hsaWdodCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ29wZW4gaW1hZ2UgaGlnaGxpZ2h0IHdpdGggaWQ6JywgdGFyZ2V0LmF0dHIoJ2lkJyksIHRhcmdldClcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9wZW5ab29tYWJsZSh3cmFwcGVyLCB6b29tYWJsZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMuZG9tTm9kZSA9IGRvbU5vZGVcblxuICAgIGxldCBoaWdobGlnaHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGV0YWlsJylcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhpZ2hsaWdodHMubGVuZ3RoOyBpKyspe1xuICAgICAgLy9jb25zb2xlLmxvZyhoaWdobGlnaHRzW2ldKVxuICAgICAgbGV0IGhpZ2hsaWdodCA9IGhpZ2hsaWdodHNbaV1cbiAgICAgIGxldCBwYXJlbnQgPSBoaWdobGlnaHQucGFyZW50Tm9kZVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwYXJlbnQuY2hpbGROb2Rlcy5sZW5ndGg7IGorKyl7XG4gICAgICAgIGlmKHBhcmVudC5jaGlsZE5vZGVzW2pdLmNsYXNzTmFtZSA9PSAnbWFpbmltZycpe1xuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJtYWluaW1nIGZvdW5kXCIpXG4gICAgICAgICAgbGV0IG1haW5pbWcgPSBwYXJlbnQuY2hpbGROb2Rlc1tqXVxuICAgICAgICAgIC8vY29uc29sZS5sb2cobWFpbmltZy5uYXR1cmFsV2lkdGgsIG1haW5pbWcud2lkdGgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIG9wZW5JbWFnZUhpZ2hsaWdodCgpIHtcbiAgICAvKlxuICAgIFR3ZWVuTWF4LnRvKHRoaXMuY3VycmVudEhpZ2hsaWdodCwgMC40LCB7XG4gICAgICAgICAgICAgIHNjYWxlOiAxLjE1LFxuICAgICAgICAgICAgICBlYXNlOiBCYWNrLmVhc2VPdXQsXG4gICAgICAgICAgICAgIGFscGhhOiAxLFxuICAgICAgICAgICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8uLi5cbiAgICAgICAgICAgIH19KVxuICAgICAgICAgICAgKi9cbiAgICBUd2Vlbk1heC5zZXQodGhpcy5jdXJyZW50SGlnaGxpZ2h0LCB7XG4gICAgICBzY2FsZTogMS4yNSxcbiAgICAgIGFscGhhOiAxLFxuICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAvLy4uLlxuICAgIH19KVxuICB9XG5cbiAgcmVtb3ZlSW1hZ2VIaWdobGlnaHQoKXtcbiAgICBpZih0aGlzLmN1cnJlbnRIaWdobGlnaHQpe1xuICAgICAgLy9Ud2Vlbk1heC50byh0aGlzLmN1cnJlbnRIaWdobGlnaHQsIDAuNCwge3NjYWxlOiAxfSlcbiAgICAgIFR3ZWVuTWF4LnNldCh0aGlzLmN1cnJlbnRIaWdobGlnaHQsIHtzY2FsZTogMX0pXG4gICAgICB0aGlzLmN1cnJlbnRIaWdobGlnaHQgPSBudWxsXG4gICAgfVxuXG4gIH1cblxuICBjbG9zZVpvb21hYmxlKHdyYXBwZXIsIGRpdiwgem9vbWFibGUsIHBvcywgc2NhbGUsIGR1cmF0aW9uPTAuNCkge1xuICAgIC8vY29uc29sZS5sb2coXCJjbG9zZVpvb21hYmxlXCIpXG4gICAgdGhpcy56b29tYWJsZVR3ZWVuSW5Qcm9ncmVzcyA9IHRydWVcbiAgICBpZiAoem9vbWFibGUubGVuZ3RoID4gMCkge1xuICAgICAgICBUd2Vlbk1heC50byh6b29tYWJsZVswXSwgZHVyYXRpb24sIHtcbiAgICAgICAgICBhdXRvQWxwaGE6IDEsXG4gICAgICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInR3ZWVuIGZpbmlzaGVkXCIpXG4gICAgICAgIH19KVxuICAgIH1cbiAgICBUd2Vlbk1heC50byhkaXZbMF0sIGR1cmF0aW9uLCB7XG4gICAgICAgIHNjYWxlOiBzY2FsZSxcbiAgICAgICAgeDogcG9zLngsXG4gICAgICAgIHk6IHBvcy55LFxuICAgICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY2xvc2Vab29tYWJsZSB0d2VlbiBmaW5pc2hlZFwiKVxuICAgICAgICAgICAgZGl2LnJlbW92ZSgpXG4gICAgICAgICAgICBsZXQgaWNvbiA9IHdyYXBwZXIuZmluZCgnLlpvb21lZEljb24nKVxuICAgICAgICAgICAgaWNvbi5yZW1vdmUoKVxuICAgICAgICAgICAgdGhpcy56b29tYWJsZVR3ZWVuSW5Qcm9ncmVzcyA9IGZhbHNlXG4gICAgICAgIH19KVxuICB9XG5cbiAgcmVtb3ZlWm9vbWFibGUoYW5pbWF0ZWQ9ZmFsc2UpIHtcbiAgICAgIC8vY29uc29sZS5sb2coXCJjaGVja2luZyBmb3Igb3BlbiB6b29tYWJsZXMgKGFuaW1hdGVkPzogXCIgKyBhbmltYXRlZCArIFwiIClcIilcbiAgICAgICBsZXQgd3JhcHBlciA9ICQodGhpcy5kb21Ob2RlKS5jbG9zZXN0KCcuZmxpcFdyYXBwZXInKVxuICAgICAgIGxldCBkaXYgPSB3cmFwcGVyLmZpbmQoJy5ab29tZWRGaWd1cmUnKVxuICAgICAgIGlmIChkaXYubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoYW5pbWF0ZWQpIHtcbiAgICAgICAgICAgICAgbGV0IHpvb21hYmxlID0gZGl2WzBdLnpvb21hYmxlXG4gICAgICAgICAgICAgIGxldCB6b29tYWJsZVBvcyA9IGRpdlswXS56b29tYWJsZVBvc1xuICAgICAgICAgICAgICBsZXQgem9vbWFibGVTY2FsZSA9IGRpdlswXS56b29tYWJsZVNjYWxlXG4gICAgICAgICAgICAgIGlmICh6b29tYWJsZSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZVpvb21hYmxlKHdyYXBwZXIsIGRpdiwgem9vbWFibGUsIHpvb21hYmxlUG9zLCB6b29tYWJsZVNjYWxlLCAwLjEpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvL2NsZWFudXAgaXMgbm90IG5lY2Vzc2FyeSBpZiB6b29tYWJsZSB0d2VlbiBpcyBpbiBwcm9ncmVzc1xuICAgICAgICAgIGlmKCF0aGlzLnpvb21hYmxlVHdlZW5JblByb2dyZXNzKXtcbiAgICAgICAgICAgIGxldCB6b29tYWJsZSA9IGRpdlswXS56b29tYWJsZVxuICAgICAgICAgICAgaWYoem9vbWFibGUubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgIHpvb21hYmxlWzBdLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIlxuICAgICAgICAgICAgICB6b29tYWJsZVswXS5zdHlsZS5vcGFjaXR5ID0gMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGljb24gPSB3cmFwcGVyLmZpbmQoJy5ab29tZWRJY29uJylcbiAgICAgICAgICAgIGRpdi5yZW1vdmUoKVxuICAgICAgICAgICAgaWNvbi5yZW1vdmUoKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICB9XG5cbiAgb3Blblpvb21hYmxlKHdyYXBwZXIsIHpvb21hYmxlKSB7XG4gICAgY29uc29sZS5sb2coXCJvcGVuWm9vbWFibGVcIix3cmFwcGVyLHpvb21hYmxlKVxuICAgIHdyYXBwZXIuYXBwZW5kKCc8ZGl2IGNsYXNzPVwiWm9vbWVkRmlndXJlXCIgc3R5bGU9XCJkaXNwbGF5OmhpZGRlbjtcIj48ZmlndXJlPjwvZmlndXJlPjwvZGl2PicpXG4gICAgbGV0IGRpdiA9IHdyYXBwZXIuZmluZCgnLlpvb21lZEZpZ3VyZScpXG5cbiAgICBsZXQgZmlndXJlID0gZGl2LmZpbmQoJ2ZpZ3VyZScpXG4gICAgbGV0IGltZyA9IHpvb21hYmxlLmZpbmQoJy5tYWluaW1nJylcbiAgICBpZiAoaW1nLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGltZyA9IHpvb21hYmxlLmZpbmQoJy5tYWluaW1naGFsZicpXG4gICAgfVxuICAgIGZpZ3VyZS5hcHBlbmQoJzxpbWcgc3JjPVwiJyArIGltZy5hdHRyKCdzcmMnKSArICdcIj4nKVxuICAgIGxldCB6b29tQ2FwID0gem9vbWFibGUuZmluZCgnLnpvb21jYXAnKVxuICAgIGxldCB6b29tQ2FwQ2xvbmUgPSB6b29tQ2FwLmNsb25lKClcbiAgICBmaWd1cmUuYXBwZW5kKHpvb21DYXBDbG9uZSlcbiAgICB6b29tQ2FwQ2xvbmUuc2hvdygpXG5cbiAgICBsZXQgem9vbUljb24gPSB6b29tYWJsZS5maW5kKCcuem9vbWljb24nKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuYXNzZXRzUGF0aClcbiAgICB3cmFwcGVyLmFwcGVuZCgnPGltZyBjbGFzcz1cInpvb21pY29uIFpvb21lZEljb25cIiBzcmM9XCInK3RoaXMuaWNvbnNQYXRoKycvY2xvc2Uuc3ZnXCI+JylcblxuICAgIGxldCBnbG9iYWxJY29uUG9zID0gUG9pbnRzLmZyb21Ob2RlVG9QYWdlKHpvb21JY29uWzBdLCB7IHg6IDAsIHk6IDB9KVxuICAgIGxldCBsb2NhbEljb25Qb3MgPSBQb2ludHMuZnJvbVBhZ2VUb05vZGUod3JhcHBlclswXSwgZ2xvYmFsSWNvblBvcylcblxuICAgIGxldCBnbG9iYWxGaWd1cmVQb3MgPSBQb2ludHMuZnJvbU5vZGVUb1BhZ2Uoem9vbWFibGVbMF0sIHsgeDogMCwgeTogMH0pXG4gICAgbGV0IGxvY2FsRmlndXJlUG9zID0gUG9pbnRzLmZyb21QYWdlVG9Ob2RlKHdyYXBwZXJbMF0sIGdsb2JhbEZpZ3VyZVBvcylcbiAgICBsZXQgcmVsYXRpdmVJY29uUG9zID0gUG9pbnRzLmZyb21QYWdlVG9Ob2RlKHpvb21hYmxlWzBdLCBnbG9iYWxJY29uUG9zKVxuXG4gICAgbGV0IGN1cnJlbnRXaWR0aCA9IHJlbGF0aXZlSWNvblBvcy54XG4gICAgbGV0IGN1cnJlbnRIZWlnaHQgPSByZWxhdGl2ZUljb25Qb3MueVxuICAgIGxldCB3aWR0aCA9IGltZ1swXS5uYXR1cmFsV2lkdGggLSAxNlxuICAgIGxldCBoZWlnaHQgPSBpbWdbMF0ubmF0dXJhbEhlaWdodCAtIDE2XG4gICAgbGV0IHNjYWxlID0gKGN1cnJlbnRXaWR0aCAvIHdpZHRoKSAqIDEuMVxuXG4gICAgZGl2WzBdLnpvb21hYmxlID0gem9vbWFibGVcbiAgICBkaXZbMF0uem9vbWFibGVQb3MgPSBsb2NhbEZpZ3VyZVBvc1xuICAgIGRpdlswXS56b29tYWJsZVNjYWxlID0gc2NhbGVcblxuICAgIGxldCBpY29uID0gd3JhcHBlci5maW5kKCcuWm9vbWVkSWNvbicpXG4gICAgaWNvbi5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICB0aGlzLmNsb3NlWm9vbWFibGUod3JhcHBlciwgZGl2LCB6b29tYWJsZSwgbG9jYWxGaWd1cmVQb3MsIHNjYWxlKVxuICAgIH0pXG4gICAgZGl2LnNob3coKVxuICAgIFR3ZWVuTWF4LnNldChpY29uWzBdLCB7IHg6IGxvY2FsSWNvblBvcy54LCB5OiBsb2NhbEljb25Qb3MueSB9KVxuICAgIFR3ZWVuTWF4LnNldChkaXZbMF0sIHsgIHg6bG9jYWxGaWd1cmVQb3MueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OmxvY2FsRmlndXJlUG9zLnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IHNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogXCJ0b3AgbGVmdFwifSlcblxuICAgIFR3ZWVuTWF4LnRvKHpvb21hYmxlWzBdLCAwLjQsIHsgYXV0b0FscGhhOiAwfSlcbiAgICBUd2Vlbk1heC50byhkaXZbMF0sIDAuNCwgeyBzY2FsZTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IFwiLT1cIiArICh3aWR0aCAtIGN1cnJlbnRXaWR0aCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBcIi09XCIgKyAoaGVpZ2h0IC0gY3VycmVudEhlaWdodCl9KVxuICB9XG5cbiAgZ2V0IGljb25zUGF0aCgpe1xuICAgIHJldHVybiBcImljb25zXCJcbiAgfVxuXG4gIGdldFJhdGlvKHNvdXJjZSkge1xuICAgIGxldCBkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJJTUdcIilcbiAgICBkdW1teS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgc291cmNlKVxuXG4gICAgZHVtbXkub25sb2FkID0gZnVuY3Rpb24oKXtcbiAgICAgIGNvbnNvbGUubG9nKFwiZ2V0IHJhdGlvIC0gb24gZHVtbXkgbG9hZGVkOlwiLHNvdXJjZSxkdW1teS53aWR0aCwgZHVtbXkuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBsZXQgcmF0aW8gPSBkdW1teS5uYXR1cmFsV2lkdGggLyBkdW1teS5uYXR1cmFsSGVpZ2h0XG4gICAgY29uc29sZS5sb2coXCJnZXQgcmF0aW8gLSBkdW1teSB3aWR0aDpcIixzb3VyY2UsIHJhdGlvLCBkdW1teS53aWR0aCwgZHVtbXkuaGVpZ2h0LCBkdW1teSlcbiAgICByZXR1cm4gcmF0aW9cbiAgfVxuXG4gIHNldHVwSW5kZXgoaW5kZXhub2RlLCB1c2VHcmVlblNvY2s9dHJ1ZSkge1xuICAgIGxldCBkdXJhdGlvbiA9IDMwMFxuICAgIGxldCB0aGF0ID0gdGhpc1xuICAgICQoaW5kZXhub2RlKS5maW5kKCcuY2FyZCcpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAkKHRoaXMpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJleHBhbmRlZFwiKSA9PSBcInRydWVcIikge1xuICAgICAgICAgICQodGhpcykuYXR0cihcImV4cGFuZGVkXCIsIFwiZmFsc2VcIilcbiAgICAgICAgICAkKHRoaXMpLmNzcygnZmxleC1ncm93JywgJzAnKVxuICAgICAgICB9XG4gICAgICAgIHRoYXQucmVtb3ZlWm9vbWFibGUodHJ1ZSlcblxuICAgICAgICBsZXQgY2FyZGJveCA9ICQodGhpcykucGFyZW50KClcbiAgICAgICAgbGV0IGluZGV4Ym94ID0gJCh0aGlzKS5wYXJlbnRzKCcubWFpbnZpZXcnKVxuXG4gICAgICAgIGxldCBlbCA9ICQodGhpcylbMF07XG4gICAgICAgIGxldCBzdCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsLCBudWxsKVxuICAgICAgICBsZXQgdHIgPSBzdC5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2Zvcm0nKVxuICAgICAgICBsZXQgYW5nbGUgPSAwXG4gICAgICAgIGlmICh0ciAhPT0gXCJub25lXCIpIHtcbiAgICAgICAgICBsZXQgdmFsdWVzID0gdHIuc3BsaXQoJygnKVsxXS5zcGxpdCgnKScpWzBdLnNwbGl0KCcsJylcbiAgICAgICAgICBsZXQgYSA9IHZhbHVlc1swXVxuICAgICAgICAgIGxldCBiID0gdmFsdWVzWzFdXG4gICAgICAgICAgYW5nbGUgPSBNYXRoLnJvdW5kKE1hdGguYXRhbjIoYiwgYSkgKiAoMTgwIC8gTWF0aC5QSSkpXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdGFyZ2V0ID0gJCh0aGlzKS5jbG9uZSgpXG4gICAgICAgIGxldCByb290ID0gJCh0aGlzKVxuXG4gICAgICAgICQodGFyZ2V0KS5hdHRyKCdpZCcsICdvdmVybGF5JylcbiAgICAgICAgJCgkKHRhcmdldCkuZmluZCgnLmNhcmRpY29uJykpLmF0dHIoJ3NyYycsIHRoYXQuaWNvbnNQYXRoICsgJy9jbG9zZS5zdmcnKVxuICAgICAgICAkKHRhcmdldCkuZmluZCgnLnRpdGxlYmFyJykuY3NzKHtoZWlnaHQ6ICc4JSd9KVxuICAgICAgICBjb25zb2xlLmxvZyhcIkV4cGFuZFwiKVxuICAgICAgICBpZiAodXNlR3JlZW5Tb2NrKSB7XG5cbiAgICAgICAgICAgIGxldCBpbmRleFdpZHRoID0gaW5kZXhub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXG4gICAgICAgICAgICBsZXQgaW5kZXhIZWlnaHQgPSBpbmRleG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0XG4gICAgICAgICAgICBsZXQgcm9vdFdpZHRoID0gcm9vdFswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxuICAgICAgICAgICAgbGV0IHJvb3RIZWlnaHQgPSByb290WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxuICAgICAgICAgICAgbGV0IHNjYWxlID0gKHVzZUdyZWVuU29jaykgPyByb290V2lkdGggLyBpbmRleFdpZHRoIDogMVxuXG4gICAgICAgICAgICBsZXQgZ2xvYmFsT3JpZ2luID0gUG9pbnRzLmZyb21Ob2RlVG9QYWdlKHJvb3RbMF0sIHt4OjAsIHk6MH0pXG4gICAgICAgICAgICBsZXQgbG9jYWxPcmlnaW4gPSBQb2ludHMuZnJvbVBhZ2VUb05vZGUoaW5kZXhib3hbMF0sIGdsb2JhbE9yaWdpbilcblxuICAgICAgICAgICAgVHdlZW5NYXguc2V0KHRhcmdldFswXSwgeyBjc3M6IHtcbiAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgIHdpZHRoOiAnOTcuNSUnLFxuICAgICAgICAgICAgICAgICBoZWlnaHQ6ICc4Ni41JScsXG4gICAgICAgICAgICAgICAgIG1hcmdpbjogMCxcbiAgICAgICAgICAgICAgICAgekluZGV4OiAxMDFcbiAgICAgICAgICAgIH19KVxuICAgICAgICAgICAgVHdlZW5NYXguc2V0KHJvb3RbMF0sIHsgYWxwaGE6IDB9KVxuICAgICAgICAgICAgVHdlZW5NYXguc2V0KHRhcmdldFswXSwge1xuICAgICAgICAgICAgICAgICAgeDogbG9jYWxPcmlnaW4ueCxcbiAgICAgICAgICAgICAgICAgIHk6IGxvY2FsT3JpZ2luLnksXG4gICAgICAgICAgICAgICAgICBzY2FsZTogc2NhbGUsXG4gICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICcwJSAwJScsXG4gICAgICAgICAgICAgICAgICByb3RhdGlvbjogYW5nbGUsXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAkKHRhcmdldCkucHJlcGVuZFRvKGluZGV4Ym94KVxuXG4gICAgICAgICAgICBUd2Vlbk1heC50byh0YXJnZXRbMF0sIDAuMiwge1xuICAgICAgICAgICAgICAgIHg6IGluZGV4V2lkdGggKiAwLjAyLFxuICAgICAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICAgICAgc2NhbGU6IDEsXG4gICAgICAgICAgICAgICAgcm90YXRpb246IDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBsZXQgcHJldmlldyA9ICQodGFyZ2V0KS5maW5kKCcucHJldmlldycpXG4gICAgICAgICAgICBUd2Vlbk1heC50byhwcmV2aWV3WzBdLCAwLjUsIHsgYXV0b0FscGhhOiAwIH0pXG5cbiAgICAgICAgICAgICQodGFyZ2V0KS5maW5kKCcuY2FyZGljb24nKS5vbignY2xpY2snLCAoZXZlbnQpID0+IHtcblxuICAgICAgICAgICAgICAgIHRoYXQucmVtb3ZlWm9vbWFibGUodHJ1ZSlcbiAgICAgICAgICAgICAgICBUd2Vlbk1heC5zZXQocm9vdFswXSwgeyBhdXRvQWxwaGE6IDEgfSlcbiAgICAgICAgICAgICAgICBUd2Vlbk1heC50byh0YXJnZXRbMF0sIDAuMiwge1xuICAgICAgICAgICAgICAgICAgICB4OiBsb2NhbE9yaWdpbi54LFxuICAgICAgICAgICAgICAgICAgICB5OiBsb2NhbE9yaWdpbi55LFxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogc2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0aW9uOiBhbmdsZSxcbiAgICAgICAgICAgICAgICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgVHdlZW5NYXgudG8odGFyZ2V0WzBdLCAwLjQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBkZWxheTogMC4yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGE6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbMF0ucmVtb3ZlKCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgIC8vIFR3ZWVuTWF4LnRvKHByZXZpZXdbMF0sIDAuMiwgeyBhbHBoYTogMSB9KVxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJCh0YXJnZXQpLmZpbmQoJy5jYXJkaWNvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICQodGFyZ2V0KS5mYWRlT3V0KGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKHRhcmdldCkucmVtb3ZlKClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICQodGFyZ2V0KS5jc3Moe1xuICAgICAgICAgICAgICAncG9zaXRpb24nOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAndG9wJzogcm9vdC5vZmZzZXQoKS50b3AsXG4gICAgICAgICAgICAgICdsZWZ0Jzogcm9vdC5vZmZzZXQoKS5sZWZ0LFxuICAgICAgICAgICAgICAnbWFyZ2luJzogMCxcbiAgICAgICAgICAgICAgJ3otaW5kZXgnOiAnMTAxJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICQodGFyZ2V0KS5wcmVwZW5kVG8oaW5kZXhib3gpXG5cbiAgICAgICAgICAgICQodGFyZ2V0KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICB0b3A6ICc1JScsXG4gICAgICAgICAgICAgICAgbGVmdDogJzIlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzk2JScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnOTAlJyxcbiAgICAgICAgICAgICAgICBtYXJnaW46ICcwJ1xuICAgICAgICAgICAgICAgIH0sIGR1cmF0aW9uKVxuICAgICAgICAgICAgJCh0YXJnZXQpLmZpbmQoJy5wcmV2aWV3JykuZmFkZU91dCg3MDApXG5cbiAgICAgICAgICAgICQoe2RlZzogMH0pLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIGRlZzogYW5nbGVcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIHN0ZXA6IGZ1bmN0aW9uKG5vdykge1xuICAgICAgICAgICAgICAgICAgICAkKHRhcmdldCkuY3NzKHt0cmFuc2Zvcm06ICdyb3RhdGUoMGRlZyknfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgIC8vIHRoaXMuc2V0dXBab29tYWJsZXMoJCh0YXJnZXQpKSA/Pz8gaXMgdGhpcyB0aGlzIHRoZSB0aGlzIGkgd2FudCB0byB0aGlzID8/P1xuXG4gICAgICAgIH0pXG4gICAgfSlcbn1cblxuICBzZXR1cFpvb21hYmxlcyhjYXJkbm9kZSkge1xuICAgICQoY2FyZG5vZGUpLmZpbmQoJ2ZpZ3VyZS56b29tYWJsZScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAvLyB6b29tZnVuKClcbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBYTUxDYXJkUGFyc2VyIGV4dGVuZHMgWE1MUGFyc2VyIHtcblxuICAgIHBhcnNlWE1MKHhtbGRhdCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGUgPSAkKCQoeG1sZGF0KS5maW5kKCdjb250ZW50JykpLmF0dHIoJ3RlbXBsYXRlJylcbiAgICAgICAgICAgIGxldCB0YXJnZXRkYXRcblxuICAgICAgICAgICAgaWYodGVtcGxhdGU9PTMpe1xuICAgICAgICAgICAgICB0YXJnZXRkYXQgPSB7XG4gICAgICAgICAgICAgICAgJ2xlZnRjb2wnOiB7fSxcbiAgICAgICAgICAgICAgICAncmlnaHRjb2wnOiB7fSxcbiAgICAgICAgICAgICAgICAnYm90dG9tY29sJzoge31cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0ZGF0ID0ge1xuICAgICAgICAgICAgICAgICdsZWZ0Y29sJzoge30sXG4gICAgICAgICAgICAgICAgJ3JpZ2h0Y29sJzoge31cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHRhcmdldGRhdC50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgICAgICAgICB0YXJnZXRkYXQudHlwZSA9ICQoJCh4bWxkYXQpLmZpbmQoJ2NhcmQnKSkuYXR0cigndHlwZScpLnJlcGxhY2UoL1xccy9nLCAnXycpXG4gICAgICAgICAgICBsZXQgaGVhZGVyID0gJCh4bWxkYXQpLmZpbmQoXCJoMVwiKVxuICAgICAgICAgICAgaWYgKGhlYWRlci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRpdGxlID0gdGhpcy5wcmVzZXJ2ZVRhZ3MoaGVhZGVyWzBdLmlubmVySFRNTClcbiAgICAgICAgICAgICAgICB0YXJnZXRkYXQuaGVhZGVyID0gdGl0bGVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHByZXZpZXcgPSAkKHhtbGRhdCkuZmluZChcInByZXZpZXdcIilcbiAgICAgICAgICAgIGxldCBwcmV2aWV3VGV4dCA9IHByZXZpZXcuZmluZChcInRleHRcIilcbiAgICAgICAgICAgIGlmIChwcmV2aWV3VGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcHJldmlldyA9IHRoaXMucHJlc2VydmVUYWdzKHByZXZpZXdUZXh0WzBdLmlubmVySFRNTClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBwcmV2aWV3SW1hZ2UgPSBwcmV2aWV3LmZpbmQoXCJpbWdcIilcbiAgICAgICAgICAgICAgICBpZiAocHJldmlld0ltYWdlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGltYWdlID0gJChwcmV2aWV3SW1hZ2VbMF0pXG4gICAgICAgICAgICAgICAgICAgIGxldCBzcmMgPSBpbWFnZS5hdHRyKCdzcmMnKVxuICAgICAgICAgICAgICAgICAgICBpbWFnZS5hdHRyKCdzcmMnLCB0aGlzLmNyZWF0ZUxpbmtVUkwoc3JjKSlcbiAgICAgICAgICAgICAgICAgICAgcHJldmlldyA9IHByZXZpZXdJbWFnZVswXS5vdXRlckhUTUxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhcmdldGRhdC5wcmV2aWV3ID0gcHJldmlld1xuICAgICAgICAgICAgdGFyZ2V0ZGF0LnRvb2x0aXBkYXRhID0ge31cbiAgICAgICAgICAgIGxldCBjb2xzID0gJCh4bWxkYXQpLmZpbmQoXCJjb2x1bW5cIilcbiAgICAgICAgICAgIGxldCBrZXlkYXQgPSBPYmplY3Qua2V5cyh0YXJnZXRkYXQpXG4gICAgICAgICAgICBsZXQgaW1naW5kZXggPSAwLFxuICAgICAgICAgICAgICAgIHBsYWludGV4dCA9ICcnLFxuICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAgaHRtbCxcbiAgICAgICAgICAgICAgICBub2RlcyxcbiAgICAgICAgICAgICAgICBsaW5rZGF0XG5cbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjb2xzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGxldCBzb3VyY2Vjb2wgPSAkKGNvbHNbaW5kZXhdKS5jaGlsZHJlbigpXG4gICAgICAgICAgICAgICAgdGFyZ2V0ZGF0W2tleWRhdFtpbmRleF1dID0ge31cbiAgICAgICAgICAgICAgICBsZXQgbmV3bm9kZXMgPSBbXVxuICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3VyY2Vjb2wubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBzb3VyY2Vjb2xbaV0ubm9kZU5hbWVcbiAgICAgICAgICAgICAgICAgICAgbGV0IGh0bWwgPSBzb3VyY2Vjb2xbaV0uaW5uZXJIVE1MXG4gICAgICAgICAgICAgICAgICAgIGxldCBub2RlcyA9IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSB7fVxuICAgICAgICAgICAgICAgICAgICAvLyBjb250ZW50IHR5cGU6IFBSRVZJRVcsIFRFWFQsIFZJREVPLCBHUk9VUElNQUdFLCBTSU5HTEVJTUFHRSwgR0xPU1NfTElOSywgREVUQUlMX0xJTkssIERFVEFJTF9aT09NLCBTUEFDRVxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSBcInRleHRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCA9IHRoaXMucmVwbGFjZUNEQVRBKGh0bWwpXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKC8tKFthLXpdKSAvZ2ksIFwiJDFcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVPOiBUaGUgZm9sbG93aW5nIGxpbmUgaXMgaW4gY29uZmxpY3Qgd2l0aCBVUkwgbGlrZSB0ZXRlLWEtdGV0ZS54bWxcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoLy0oW2Etel0pL2dpLCBcIiQxXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlcyA9ICQucGFyc2VIVE1MKGh0bWwpXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnR5cGUgPSAndGV4dCdcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuaHRtbCA9ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGVzW2pdLm5vZGVOYW1lID09IFwiUFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsaW5rcyA9IG5vZGVzW2pdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBsaW5rcy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlZiA9IHRoaXMuY3JlYXRlTGlua1VSTChsaW5rc1trXS5ocmVmKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChsaW5rc1trXSkuYXR0cignZGF0YS10YXJnZXQnLCByZWYpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRkYXQudG9vbHRpcGRhdGFbcmVmXSA9IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmtzW2tdLmhyZWYgPSBcIiNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmt0eXBlID0gXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmtzW2tdLmhyZWYuaW5kZXhPZihcImdsb3NzYXJcIikgIT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rdHlwZSA9IFwiZ2xvc3NMaW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGlua3Nba10uaGFzQXR0cmlidXRlKFwiaW1hZ2VoaWdobGlnaHRpZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmt0eXBlID0gXCJkZXRhaWxMaW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5rc1trXS5pZCA9ICQobGlua3Nba10pLmF0dHIoJ2ltYWdlaGlnaGxpZ2h0aWQnKS5yZXBsYWNlKC9cXC4vZywgXCJfXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmt0eXBlID0gXCJnbG9zc0xpbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChsaW5rc1trXSkuYXR0cihcImNsYXNzXCIsIGxpbmt0eXBlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKiBVTzogVGhpcyBjcmFzaGVkIG9uIEZpcmVmb3ggNDguIFNlZW1zIHRvIGJlIHVubmVjZXNzYXJ5LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVzW2pdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKVtrXSA9IGxpbmtzW2tdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKiovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmh0bWwgKz0gJzxwPiAnICsgbm9kZXNbal0uaW5uZXJIVE1MICsgJyA8L3A+J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVU86IEVuYWJsZSB0aGUgZm9sbG93aW5nIGxpbmUgdG8gcmVtb3ZlIGFsbCBsaW5rcyBmcm9tIFAgdGFnc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm9kZS5odG1sICs9ICc8cD4gJyArIG5vZGVzW2pdLmlubmVyVGV4dCArICcgPC9wPidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFpbnRleHQgKz0gbm9kZXNbal0uaW5uZXJUZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChub2Rlc1tqXS5ub2RlTmFtZSA9PSBcIkgyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5odG1sICs9ICc8aDI+ICcgKyBub2Rlc1tqXS5pbm5lckhUTUwgKyAnIDwvaDI+J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFpbnRleHQgKz0gbm9kZXNbal0uaW5uZXJUZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT0gXCJpbWdcIikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWdpbmRleCA9IGltZ2luZGV4ICsgMVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld2h0bWwgPSBcIlwiXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHNvdXJjZWNvbFtpXSkuYXR0cignc3JjJykuaW5kZXhPZihcIi5mNHZcIikgPj0gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUudHlwZSA9ICd2aWRlbydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5tYXhoZWlnaHQgPSAkKHNvdXJjZWNvbFtpXSkuYXR0cignbWF4SGVpZ2h0JykgKyAncHgnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuc291cmNlID0gJChzb3VyY2Vjb2xbaV0pLmF0dHIoJ3NyYycpLnJlcGxhY2UoJ2Y0dicsICdtcDQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmlkID0gJ3pvb21hYmxlJyArIGltZ2luZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuaWNvbmlkID0gJ3pvb20nICsgaW1naW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jYXAgPSB0aGlzLmNhcHRpb24oc291cmNlY29sW2ldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnpvb21jYXAgPSB0aGlzLnpvb21DYXB0aW9uKHNvdXJjZWNvbFtpXSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnR5cGUgPSAnc2luZ2xlaW1hZ2UnXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUubWF4aGVpZ2h0ID0gJChzb3VyY2Vjb2xbaV0pLmF0dHIoJ21heEhlaWdodCcpICsgJ3B4J1xuICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnNvdXJjZSA9ICQoc291cmNlY29sW2ldKS5hdHRyKCdzcmMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmlkID0gJ3pvb21hYmxlJyArIGltZ2luZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuaWNvbmlkID0gJ3pvb20nICsgaW1naW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jYXAgPSB0aGlzLmNhcHRpb24oc291cmNlY29sW2ldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLnpvb21jYXAgPSB0aGlzLnpvb21DYXB0aW9uKHNvdXJjZWNvbFtpXSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAvL3dhbGsgdGhyb3VuZ2ggaGlnaGxpZ2h0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlcyA9ICQucGFyc2VIVE1MKGh0bWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBoaWdobGlnaHRzID0gW11cblxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5vZGVzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZXNbal0ubm9kZU5hbWUgPT0gXCJISUdITElHSFRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3BhcnNpbmcgaGlnaGxpZ2h0JylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlZiA9IHRoaXMuY3JlYXRlTGlua1VSTCgkKG5vZGVzW2pdKS5hdHRyKCdocmVmJykpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldGRhdC50b29sdGlwZGF0YVtyZWZdID0gXCJcIlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3Vibm9kZSA9IHt9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Ym5vZGUuaWQgPSAoJChub2Rlc1tqXSkuYXR0cignaWQnKSArIFwiRGV0YWlsXCIpLnJlcGxhY2UoL1xcLi9nLCBcIl9cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Ym5vZGUuc3JjID0gJChub2Rlc1tqXSkuYXR0cignaWQnKS5yZXBsYWNlKFwiLmpwZ1wiLCBcIlwiKS5yZXBsYWNlKC8uaFxcZCsvLCBcIlwiKS5yZXBsYWNlKFwiLlwiLCBcIi9cIikgKyBcIi5qcGdcIlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGUgPSBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSA9IHN0eWxlICsgXCJsZWZ0OlwiICsgJChub2Rlc1tqXSkuYXR0cigneCcpICogMTAwICsgXCIlO1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSA9IHN0eWxlICsgXCJ0b3A6XCIgKyAkKG5vZGVzW2pdKS5hdHRyKCd5JykgKiAxMDAgKyBcIiU7XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlID0gc3R5bGUgKyBcImhlaWdodDpcIiArICQobm9kZXNbal0pLmF0dHIoJ3JhZGl1cycpICogMjAwICsgXCIlO1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSA9IHN0eWxlICsgXCJ3aWR0aDpcIiArICQobm9kZXNbal0pLmF0dHIoJ3JhZGl1cycpICogMjAwICsgXCIlO1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKnN0eWxlID0gc3R5bGUgKyBcInBvc2l0aW9uOlwiICsgXCJyZWxhdGl2ZTtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGUgPSBzdHlsZSArIFwibGVmdDpcIiArICQobm9kZXNbal0pLmF0dHIoJ3gnKSArIFwiO1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSA9IHN0eWxlICsgXCJ0b3A6XCIgKyAkKG5vZGVzW2pdKS5hdHRyKCd5JykgKyBcIjtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGUgPSBzdHlsZSArIFwiaGVpZ2h0OlwiICsgJChub2Rlc1tqXSkuYXR0cigncmFkaXVzJykgKiAxODAgKyBcIiU7XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlID0gc3R5bGUgKyBcIndpZHRoOlwiICsgJChub2Rlc1tqXSkuYXR0cigncmFkaXVzJykgKiAxODAgKyBcIiU7XCIqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZSA9IHN0eWxlICsgXCJiYWNrZ3JvdW5kLWltYWdlOnVybChcIiArIHJlZi5yZXBsYWNlKFwieG1sXCIsIFwianBnXCIpICsgXCIpO1wiXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Ym5vZGUuc3R5bGUgPSBzdHlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vibm9kZS50YXJnZXQgPSByZWZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Ym5vZGUucmFkaXVzID0gJChub2Rlc1tqXSkuYXR0cigncmFkaXVzJylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3Vibm9kZS5zcmMsc3Vibm9kZS50YXJnZXQpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodHMucHVzaChzdWJub2RlKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuaGlnaGxpZ2h0cyA9IGhpZ2hsaWdodHMucmV2ZXJzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09IFwic3BhY2VcIiAmIGkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS50eXBlID0gJ3NwYWNlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5oZWlnaHQgPSAkKHNvdXJjZWNvbFtpXSkuYXR0cignaGVpZ2h0JykgKyBcInB4XCJcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09IFwiaW1nZ3JvdXBcIikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnR5cGUgPSAnZ3JvdXBpbWFnZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUubWF4aGVpZ2h0ID0gJChzb3VyY2Vjb2xbaV0pLmF0dHIoJ21heEhlaWdodCcpICsgJ3B4J1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5maWd1cmVzID0ge31cblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8ICQoc291cmNlY29sW2ldKS5jaGlsZHJlbignaW1nJykubGVuZ3RoOyBqKyspe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGltZ2luZGV4ICs9IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNyY2ltZyA9ICQoc291cmNlY29sW2ldKS5jaGlsZHJlbignaW1nJylbal1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmZpZ3VyZXNbaisxXSA9IHt9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZmlndXJlc1tqKzFdLnNvdXJjZSA9ICQoc3JjaW1nKS5hdHRyKCdzcmMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmZpZ3VyZXNbaisxXS5pZCA9ICd6b29tYWJsZScgKyBpbWdpbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmZpZ3VyZXNbaisxXS5pY29uaWQgPSAnem9vbScgKyBpbWdpbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmZpZ3VyZXNbaisxXS5jYXAgPSB0aGlzLmNhcHRpb24oc3JjaW1nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmZpZ3VyZXNbaisxXS56b29tY2FwID0gdGhpcy56b29tQ2FwdGlvbihzcmNpbWcpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuZXdub2Rlcy5wdXNoKG5vZGUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRhcmdldGRhdFtrZXlkYXRbaW5kZXhdXSA9IG5ld25vZGVzLnJldmVyc2UoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFyZ2V0ZGF0LnBsYWludGV4dCA9IHBsYWludGV4dFxuICAgICAgICAgICAgbGV0IHRvb2x0aXBSZWZzID0gT2JqZWN0LmtleXModGFyZ2V0ZGF0LnRvb2x0aXBkYXRhKVxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b29sdGlwUmVmcylcbiAgICAgICAgICAgIGxldCBsaW5rcHJvbWlzZXMgPSBbXVxuICAgICAgICAgICAgZm9yIChsZXQgaSBvZiB0b29sdGlwUmVmcykge1xuICAgICAgICAgICAgICAgIGxldCB1cmwgPSBpXG4gICAgICAgICAgICAgICAgbGV0IHBhcnNlciA9IG5ldyBYTUxQYXJzZXIodXJsKVxuICAgICAgICAgICAgICAgIGxldCBwcm9taXNlID0gcGFyc2VyLmxvYWRYTUwoKS50aGVuKCh4bWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGltZyA9ICQoeG1sKS5maW5kKCdpbWcnKVxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDsgaTxpbWcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzcmMgPSAkKGltZ1tpXSkuYXR0cignc3JjJylcbiAgICAgICAgICAgICAgICAgICAgICAgICQoaW1nW2ldKS5hdHRyKCdzcmMnLCB0aGlzLmNyZWF0ZUxpbmtVUkwoc3JjKSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgbGlua2RhdCA9ICQoeG1sKS5maW5kKCdjb250ZW50JykuaHRtbCgpXG4gICAgICAgICAgICAgICAgICAgIGxpbmtkYXQgPSB0aGlzLnJlcGxhY2VDREFUQShsaW5rZGF0KVxuICAgICAgICAgICAgICAgICAgICBsaW5rZGF0ID0gdGhpcy5yZXBsYWNlVGV4dChsaW5rZGF0KVxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRkYXQudG9vbHRpcGRhdGFbdXJsXSA9IGxpbmtkYXRcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+e1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBsb2FkIFhNTCBhdDogXCIgKyB1cmwsIGVycm9yKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgbGlua3Byb21pc2VzLnB1c2gocHJvbWlzZSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgUHJvbWlzZS5hbGwobGlua3Byb21pc2VzKS50aGVuKChpbnB1dCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodGFyZ2V0ZGF0KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICByZXBsYWNlVGV4dChodG1sKSB7XG4gICAgICAgIHJldHVybiBodG1sLnJlcGxhY2UoLzxcXC90ZXh0Pi9nLCBcIlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzx0ZXh0Pi9nLCBcIlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcdC9nLCBcIlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csIFwiJ1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHIvZywgJycpXG4gICAgfVxuXG4gICAgcmVwbGFjZUNEQVRBKGh0bWwpIHtcbiAgICAgIGlmKGh0bWwpXG4gICAgICAgIHJldHVybiBodG1sLnJlcGxhY2UoLzxcXCFcXFtDREFUQVxcWy9nLCBcIlwiKS5yZXBsYWNlKC9dXT4vZywgXCJcIilcbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IHJlcGxhY2UgQ0RBVEEgYXQgJ1wiK3RoaXMucGF0aCtcIic6IFwiICsgaHRtbClcbiAgICAgICAgICByZXR1cm4gXCJDREFUQS1FUlJPUlwiXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXBsYWNlRXNjYXBlZEFuZ2xlQnJhY2tldHMoaHRtbCkge1xuICAgICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKC9cXHQvZywgXCJcIikucmVwbGFjZSgvJmx0Oy8sIFwiPFwiKS5yZXBsYWNlKC8mZ3Q7LywgXCI+XCIpXG4gICAgfVxuXG4gICAgcHJlc2VydmVUYWdzKGh0bWwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZUVzY2FwZWRBbmdsZUJyYWNrZXRzKGh0bWwpXG4gICAgfVxuXG4gICAgY2FwdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlRXNjYXBlZEFuZ2xlQnJhY2tldHMoJChlbGVtZW50KS5hdHRyKCdjYXB0aW9uJykpXG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiTWlzc2luZyBDYXB0aW9uXCJcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHpvb21DYXB0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VFc2NhcGVkQW5nbGVCcmFja2V0cygkKGVsZW1lbnQpLmF0dHIoJ3pvb21DYXB0aW9uJykpXG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiTWlzc2luZyBab29tQ2FwdGlvblwiXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiBDb252ZXJ0cyBhYnNvbHV0ZSBVUkxzIGluIGhyZWYgYXR0cmlidXRlcyBjcmVhdGVkIGJ5IHRoZSBET00gYnVpbGRlclxuICAgICAgICBpbnRvIGNvcnJlY3Qgc3JjIHVybC4gKi9cbiAgICBjcmVhdGVMaW5rVVJMKGhyZWYpIHtcbiAgICAgICAgbGV0IGxhc3QgPSB0aGlzLmV4dHJhY3RMYXN0U2VnbWVudChocmVmKVxuICAgICAgICBsZXQgcmVzdCA9IHRoaXMucmVtb3ZlTGFzdFNlZ21lbnQoaHJlZilcbiAgICAgICAgbGV0IGZpcnN0ID0gdGhpcy5leHRyYWN0TGFzdFNlZ21lbnQocmVzdClcbiAgICAgICAgcmV0dXJuIHRoaXMuYmFzZVBhdGggKyAnLycgKyBmaXJzdCArICcvJyArIGxhc3RcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7Q2FyZExvYWRlcn0gZnJvbSAnLi4vLi4vLi4vbGliL2ZsaXBwYWJsZS5qcydcbmltcG9ydCB7WE1MSW5kZXhQYXJzZXIsIFhNTENhcmRQYXJzZXJ9IGZyb20gJy4veG1scGFyc2VyLmpzJ1xuXG5leHBvcnQgY2xhc3MgWE1MQ2FyZExvYWRlciBleHRlbmRzIENhcmRMb2FkZXIge1xuXG4gICAgY29uc3RydWN0b3Ioc3JjLCB7eD0wLCB5PTAsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aD0xNDAwLCBoZWlnaHQ9MTIwMCwgbWF4V2lkdGg9bnVsbCwgbWF4SGVpZ2h0PW51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZT0xLCBtaW5TY2FsZT0wLjI1LCBtYXhTY2FsZT0yLCByb3RhdGlvbj0wfSA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHNyYywge3gsIHksIHdpZHRoLCBoZWlnaHQsIG1heFdpZHRoLCBtYXhIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlLCBtaW5TY2FsZSwgbWF4U2NhbGUsIHJvdGF0aW9ufSlcbiAgICAgICAgdGhpcy54bWxQYXJzZXIgPSBuZXcgWE1MSW5kZXhQYXJzZXIodGhpcy5zcmMsIHt3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0fSlcbiAgICB9XG5cbiAgICBsb2FkKGRvbU5vZGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJkb21Ob2RlXCIsIGRvbU5vZGUpXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnhtbFBhcnNlci5sb2FkUGFyc2VBbmRDcmVhdGVET00oKS50aGVuKChkb21UcmVlKSA9PiB7XG4gICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZChkb21UcmVlKVxuICAgICAgICAvLyAgICAgICAgIGxldCBzY2FsZVcgPSB0aGlzLm1heFdpZHRoIC8gdGhpcy53YW50ZWRXaWR0aFxuLy8gICAgICAgICAgICAgICAgIGxldCBzY2FsZUggPSB0aGlzLm1heEhlaWdodCAvIHRoaXMud2FudGVkSGVpZ2h0XG4vLyAgICAgICAgICAgICAgICAgdGhpcy5zY2FsZSA9IE1hdGgubWluKHRoaXMubWF4U2NhbGUsIE1hdGgubWluKHNjYWxlVywgc2NhbGVIKSlcblxuICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgPSAxIC8gKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEpXG4gICAgICAgICAgICAgICAgbGV0IHcgPSB0aGlzLndhbnRlZFdpZHRoXG4gICAgICAgICAgICAgICAgbGV0IGggPSB0aGlzLndhbnRlZEhlaWdodFxuICAgICAgICAgICAgICAgICQoZG9tTm9kZSkuY3NzKHsgJ3dpZHRoJzogdyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdtYXhXaWR0aCc6IHcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbWluV2lkdGgnOiB3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCc6IGh9KVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkZWROb2RlID0gZG9tVHJlZVxuICAgICAgICAgICAgICAgIHRoaXMueG1sUGFyc2VyLmNvbXBsZXRlZChkb21Ob2RlKVxuICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcylcbiAgICAgICAgICAgIH0pLmNhdGNoKChyZWFzb24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJsb2FkUGFyc2VBbmRDcmVhdGVET00gZXJyb3JcIiwgcmVhc29uKVxuICAgICAgICAgICAgICAgIHJlamVjdChyZWFzb24pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cbn1cbiIsImltcG9ydCB7WE1MQ2FyZExvYWRlcn0gZnJvbSBcIi4veG1sY2FyZGxvYWRlci5qc1wiXG5pbXBvcnQge0RPTVNjYXR0ZXJDb250YWluZXJ9IGZyb20gXCIuLi8uLi8uLi9saWIvc2NhdHRlci5qc1wiXG5pbXBvcnQge0RPTUZsaXAsIEltYWdlTG9hZGVyfSBmcm9tIFwiLi4vLi4vLi4vbGliL2ZsaXBwYWJsZS5qc1wiXG5pbXBvcnQge0NhcGFiaWxpdGllc30gZnJvbSBcIi4uLy4uLy4uL2xpYi9jYXBhYmlsaXRpZXMuanNcIlxuXG5sZXQgZGF0YSA9IFtdXG5sZXQgZXhpc3RpbmcgPSBbNDEsIDEsIDMsIDE5LCA2OSwgMjAsIDI0LCAyNywgMjgsIDI5LCAzMV1cblxuZnVuY3Rpb24gcGFkKG51bSwgc2l6ZSkge1xuICAgIHZhciBzID0gbnVtK1wiXCI7XG4gICAgd2hpbGUgKHMubGVuZ3RoIDwgc2l6ZSkgcyA9IFwiMFwiICsgcztcbiAgICByZXR1cm4gcztcbn1cblxuZnVuY3Rpb24gc2V0dXBEYXRhKCkge1xuICAgIGxldCBkaXIgPSBcIi4uLy4uL3Zhci9leWV2aXNpdC9jYXJkcy9cIlxuICAgIGZvcihsZXQgaT0wOyBpPDM7IGkrKykge1xuICAgICAgICBsZXQgY2FyZEluZGV4ID0gZXhpc3RpbmdbaV1cbiAgICAgICAgbGV0IGtleSA9IHBhZChjYXJkSW5kZXgsIDMpXG4gICAgICAgIGxldCBpbWcgPSBkaXIgKyBrZXkgKyBcIi9cIiArIGtleSArIFwiLmpwZ1wiXG4gICAgICAgIGxldCB4bWwgPSBkaXIgKyBrZXkgKyBcIi9cIiArIGtleSArIFwiLnhtbFwiXG4gICAgICAgIGRhdGEucHVzaCh7ZnJvbnQ6IGltZyxcbiAgICAgICAgICAgICAgICAgICAgYmFjazogeG1sfSlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJ1bigpIHtcbiAgICBzZXR1cERhdGEoKVxuICAgIGxldCBzY2F0dGVyQ29udGFpbmVyID0gbmV3IERPTVNjYXR0ZXJDb250YWluZXIobWFpbilcbiAgICBpZiAoQ2FwYWJpbGl0aWVzLnN1cHBvcnRzVGVtcGxhdGUoKSkge1xuICAgICAgICBkYXRhLmZvckVhY2goKGQpID0+IHtcbiAgICAgICAgICAgIGxldCBmbGlwID0gbmV3IERPTUZsaXAoc2NhdHRlckNvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGlwVGVtcGxhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEltYWdlTG9hZGVyKGQuZnJvbnQsIHsgbWluU2NhbGU6IDAuMSwgbWF4U2NhbGU6IDMsIG1heFdpZHRoOiBtYWluLmNsaWVudFdpZHRoIC8gNH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBYTUxDYXJkTG9hZGVyKGQuYmFjaykpIC8vIEltYWdlTG9hZGVyKGQuYmFjaykpIC8vXG4gICAgICAgICAgICBmbGlwLmxvYWQoKS50aGVuKChmbGlwKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGJvdW5kcyA9IGZsaXAuZmxpcHBhYmxlLnNjYXR0ZXIuYm91bmRzXG4gICAgICAgICAgICAgICAgbGV0IHcgPSBib3VuZHMud2lkdGhcbiAgICAgICAgICAgICAgICBsZXQgaCA9IGJvdW5kcy5oZWlnaHRcbiAgICAgICAgICAgICAgICBsZXQgeCA9IHcvMiArIE1hdGgucmFuZG9tKCkqKG1haW4uY2xpZW50V2lkdGggLSB3KVxuICAgICAgICAgICAgICAgIGxldCB5ID0gaC8yICsgTWF0aC5yYW5kb20oKSoobWFpbi5jbGllbnRIZWlnaHQgLSBoKVxuICAgICAgICAgICAgICAgIGxldCBhbmdsZSA9IDAgLy9NYXRoLnJhbmRvbSgpKjM2MFxuICAgICAgICAgICAgICAgIGZsaXAuZmxpcHBhYmxlLnNjYXR0ZXIucm90YXRpb25EZWdyZWVzID0gYW5nbGVcbiAgICAgICAgICAgICAgICBmbGlwLmNlbnRlckF0KHt4LCB5fSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBhbGVydChcIlRlbXBsYXRlcyBub3Qgc3VwcG9ydGVkLCB1c2UgRWRnZSwgQ2hyb21lLCBTYWZhcmkgb3IgRmlyZWZveC5cIilcbiAgICB9XG59XG5cbnJ1bigpXG4iXSwibmFtZXMiOlsiRWxlbWVudHMiXSwibWFwcGluZ3MiOiI7OztFQUFBO0FBQ0EsQUFrREE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLElBQUksWUFBWSxHQUFHLEVBQUM7QUFD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LEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUM7RUFDL0QsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUM7RUFDdEMsUUFBUSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRTtFQUNoRCxZQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFFO0VBQ25DLFNBQVM7RUFDVCxLQUFLOztFQUVMLElBQUksWUFBWSxDQUFDLFlBQVksR0FBRyxFQUFFLEVBQUU7RUFDcEMsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUM7RUFDdEMsUUFBUSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztFQUM5QixRQUFRLElBQUksS0FBSyxHQUFHLEVBQUM7RUFDckIsUUFBUSxJQUFJLENBQUMsR0FBRyxFQUFDO0VBQ2pCLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtFQUM3RCxZQUFZLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFDO0VBQ3RDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFFO0VBQ3JCLFlBQVksSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUM7RUFDckQsWUFBWSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcs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SUFBSSxJQUFJLEtBQUssR0FBRyxFQUFDOztFQUVqQixJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLEVBQUU7RUFDNUIsTUFBTSxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyw0QkFBNEIsRUFBQztFQUN0RTtFQUNBO0VBQ0EsTUFBTSxLQUFLLEdBQUcsRUFBQztFQUNmLEtBQUs7O0VBRUwsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUM7RUFDckUsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDO0VBQzVFLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxFQUFDO0VBQ3JFLElBQUksS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7O0VBRWxELE1BQU0sSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUM7RUFDbkUsTUFBTSxJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUU7RUFDdEU7O0VBRUEsTUFBTSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOztFQUV6QyxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLEdBQUU7O0VBRXhDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRTtFQUNqQyxVQUFVLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUU7RUFDdkMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQztFQUMzRSxTQUFTOztFQUVULFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLGFBQWEsRUFBRTs7RUFFeEMsVUFBVSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxHQUFFO0VBQzlDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUM7RUFDcEMsVUFBVSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksR0FBRTs7RUFFaEQ7RUFDQTtFQUNBOztFQUVBO0VBQ0E7RUFDQTtFQUNBOztFQUVBLFVBQVUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUM7RUFDM0QsVUFBVSxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFDOztFQUVsQyxVQUFVLFVBQVUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUU7RUFDaEY7RUFDQTtFQUNBOztFQUVBLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFD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QUFRLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUM1QixRQUFRLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFDO0VBQ2xELFFBQVEsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBQztFQUNqRCxRQUFRLElBQUksS0FBSyxHQUFHLEVBQUM7RUFDckIsUUFBUSxJQUFJLEVBQUUsS0FBSyxNQUFNLEVBQUU7RUFDM0IsVUFBVSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFDO0VBQ2hFLFVBQVUsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBQztFQUMzQixVQUFVLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEVBQUM7RUFDM0IsVUFBVSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFDO0VBQ2hFLFNBQVM7O0VBRVQsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFFO0VBQ3BDLFFBQVEsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBQzs7RUFFMUIsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUM7RUFDdkMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FB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

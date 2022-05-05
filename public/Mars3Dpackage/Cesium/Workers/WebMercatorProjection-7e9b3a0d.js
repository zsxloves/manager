define(["exports","./Matrix2-d1511f33","./when-229515d6","./RuntimeError-8f3d96ee","./ComponentDatatype-5f63ec93"],(function(t,e,i,o,a){"use strict";function n(t){this._ellipsoid=i.defaultValue(t,e.Ellipsoid.WGS84),this._semimajorAxis=this._ellipsoid.maximumRadius,this._oneOverSemimajorAxis=1/this._semimajorAxis}Object.defineProperties(n.prototype,{ellipsoid:{get:function(){return this._ellipsoid}}}),n.mercatorAngleToGeodeticLatitude=function(t){return a.CesiumMath.PI_OVER_TWO-2*Math.atan(Math.exp(-t))},n.geodeticLatitudeToMercatorAngle=function(t){t>n.MaximumLatitude?t=n.MaximumLatitude:t<-n.MaximumLatitude&&(t=-n.MaximumLatitude);const e=Math.sin(t);return.5*Math.log((1+e)/(1-e))},n.MaximumLatitude=n.mercatorAngleToGeodeticLatitude(Math.PI),n.prototype.project=function(t,o){const a=this._semimajorAxis,r=t.longitude*a,u=n.geodeticLatitudeToMercatorAngle(t.latitude)*a,d=t.height;return i.defined(o)?(o.x=r,o.y=u,o.z=d,o):new e.Cartesian3(r,u,d)},n.prototype.unproject=function(t,o){const a=this._oneOverSemimajorAxis,r=t.x*a,u=n.mercatorAngleToGeodeticLatitude(t.y*a),d=t.z;return i.defined(o)?(o.longitude=r,o.latitude=u,o.height=d,o):new e.Cartographic(r,u,d)},t.WebMercatorProjection=n}));

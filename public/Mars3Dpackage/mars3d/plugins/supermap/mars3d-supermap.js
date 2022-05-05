/*!
 * Mars3D平台插件,结合supermap超图库使用的功能插件
 * 版本信息：v3.2.2, hash值: a2625420aa5d083d1298
 * 编译日期：2022-02-19 13:41:38
 * 版权所有：Copyright by 火星科技 http://mars3d.cn
 * 
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("mars3d")):"function"==typeof define&&define.amd?define("mars3dSupermap",["mars3d"],t):"object"==typeof exports?exports.mars3dSupermap=t(require("mars3d")):e.mars3dSupermap=t(e.mars3d)}(window,(function(e){return function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=12)}([function(t,r){t.exports=e},function(e,t){function r(t){return e.exports=r=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},e.exports.__esModule=!0,e.exports.default=e.exports,r(t)}e.exports=r,e.exports.__esModule=!0,e.exports.default=e.exports},function(e,t){e.exports=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},e.exports.__esModule=!0,e.exports.default=e.exports},function(e,t){function r(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}e.exports=function(e,t,o){return t&&r(e.prototype,t),o&&r(e,o),Object.defineProperty(e,"prototype",{writable:!1}),e},e.exports.__esModule=!0,e.exports.default=e.exports},function(e,t,r){var o=r(8);e.exports=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");Object.defineProperty(e,"prototype",{value:Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),writable:!1}),t&&o(e,t)},e.exports.__esModule=!0,e.exports.default=e.exports},function(e,t,r){var o=r(9).default,n=r(10);e.exports=function(e,t){if(t&&("object"===o(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return n(e)},e.exports.__esModule=!0,e.exports.default=e.exports},function(e,t,r){var o=r(11);function n(){return"undefined"!=typeof Reflect&&Reflect.get?(e.exports=n=Reflect.get,e.exports.__esModule=!0,e.exports.default=e.exports):(e.exports=n=function(e,t,r){var n=o(e,t);if(n){var i=Object.getOwnPropertyDescriptor(n,t);return i.get?i.get.call(arguments.length<3?e:r):i.value}},e.exports.__esModule=!0,e.exports.default=e.exports),n.apply(this,arguments)}e.exports=n,e.exports.__esModule=!0,e.exports.default=e.exports},function(e,t){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e},e.exports.__esModule=!0,e.exports.default=e.exports},function(e,t){function r(t,o){return e.exports=r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},e.exports.__esModule=!0,e.exports.default=e.exports,r(t,o)}e.exports=r,e.exports.__esModule=!0,e.exports.default=e.exports},function(e,t){function r(t){return e.exports=r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e.exports.__esModule=!0,e.exports.default=e.exports,r(t)}e.exports=r,e.exports.__esModule=!0,e.exports.default=e.exports},function(e,t){e.exports=function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e},e.exports.__esModule=!0,e.exports.default=e.exports},function(e,t,r){var o=r(1);e.exports=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=o(e)););return e},e.exports.__esModule=!0,e.exports.default=e.exports},function(e,t,r){"use strict";r.r(t),r.d(t,"S3MLayer",(function(){return v})),r.d(t,"SmImgLayer",(function(){return g})),r.d(t,"SmMvtLayer",(function(){return L}));var o=r(2),n=r.n(o),i=r(3),a=r.n(i),s=r(4),u=r.n(s),l=r(5),p=r.n(l),c=r(1),f=r.n(c),y=r(0);function d(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,o=f()(e);if(t){var n=f()(this).constructor;r=Reflect.construct(o,arguments,n)}else r=o.apply(this,arguments);return p()(this,r)}}var h=y.Cesium,v=function(e){u()(r,e);var t=d(r);function r(){return n()(this,r),t.apply(this,arguments)}return a()(r,[{key:"layer",get:function(){return this._layerArr}},{key:"s3mOptions",get:function(){return this.options.s3mOptions},set:function(e){for(var t in e){var r=e[t];this.options.s3mOptions[t]=r,"transparentBackColor"==t?r=h.Color.fromCssColorString(r):"transparentBackColorTolerance"==t&&(r=Number(r));for(var o=0;o<this._layerArr.length;o++){var n=this._layerArr[o];null!=n&&(n[t]=r)}}}},{key:"_mountedHook",value:function(){var e,t=this;e=this.options.layername?this._map.scene.addS3MTilesLayerByScp(this.options.url,{name:this.options.layername,autoSetVie:this.options.flyTo,cullEnabled:this.options.cullEnabled}):this._map.scene.open(this.options.url,this.options.sceneName,{autoSetVie:this.options.flyTo}),h.when(e,(function(e){Array.isArray(e)?t._layerArr=e:t._layerArr=[e];for(var r=0;r<t._layerArr.length;r++){var o,n,i=t._layerArr[r];if(null!=i){if(i.isS3M=!0,t.options.s3mOptions)for(var a in t.options.s3mOptions){var s=t.options.s3mOptions[a];i[a]="transparentBackColor"==a?h.Color.fromCssColorString(s):"transparentBackColorTolerance"==a?Number(s):t.options.s3mOptions[a]}null!==(o=t.options)&&void 0!==o&&null!==(n=o.position)&&void 0!==n&&n.alt&&(i.style3D.bottomAltitude=t.options.position.alt,i.refresh())}}if(t.options.flyTo&&t.flyToByAnimationEnd(),t.options.dataUrl)for(var u=0;u<t._layerArr.length;u++){var l=t._layerArr[u];l.setQueryParameter({url:t.options.dataUrl,dataSourceName:l.name.split("@")[1],dataSetName:l.name.split("@")[0],isMerge:!0}),l.selectEnabled=!0}}),(function(e){t.showError("渲染时发生错误，已停止渲染。",e)}))}},{key:"_addedHook",value:function(){for(var e in this._layerArr)this._layerArr[e].visible=!0,this._layerArr[e].show=!0}},{key:"_removedHook",value:function(){if(this._layerArr)for(var e in this._layerArr)this._layerArr[e].visible=!1,this._layerArr[e].show=!1}},{key:"setOpacity",value:function(e){if(this._layerArr)for(var t=0;t<this._layerArr.length;t++){var r=this._layerArr[t];null!=r&&(r.style3D.fillForeColor.alpha=e)}}},{key:"flyTo",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.options.center?this._map.setCameraView(this.options.center,e):this.options.extent&&this._map.flyToExtent(this.options.extent,e)}}]),r}(y.layer.BaseLayer);y.layer.S3MLayer=v,y.LayerUtil.register("supermap_s3m",v);var m=r(6),_=r.n(m);function x(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,o=f()(e);if(t){var n=f()(this).constructor;r=Reflect.construct(o,arguments,n)}else r=o.apply(this,arguments);return p()(this,r)}}var b=y.Cesium,g=function(e){u()(r,e);var t=x(r);function r(){return n()(this,r),t.apply(this,arguments)}return a()(r,[{key:"_createImageryProvider",value:function(e){return O(e)}},{key:"_addedHook",value:function(){_()(f()(r.prototype),"_addedHook",this).call(this),b.defined(this.options.transparentBackColor)&&(this._imageryLayer.transparentBackColor=y.Util.getCesiumColor(this.options.transparentBackColor),this._imageryLayer.transparentBackColorTolerance=this.options.transparentBackColorTolerance)}}]),r}(y.layer.BaseTileLayer);function O(e){return(e=y.LayerUtil.converOptions(e)).url instanceof b.Resource&&(e.url=e.url.url),b.defined(e.transparentBackColor)&&(delete e.transparentBackColor,delete e.transparentBackColorTolerance),new b.SuperMapImageryProvider(e)}g.createImageryProvider=O,y.layer.SmImgLayer=g;y.LayerUtil.register("supermap_img",g),y.LayerUtil.registerImageryProvider("supermap_img",O);var k=r(7),w=r.n(k);function P(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function S(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?P(Object(r),!0).forEach((function(t){w()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):P(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function j(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,o=f()(e);if(t){var n=f()(this).constructor;r=Reflect.construct(o,arguments,n)}else r=o.apply(this,arguments);return p()(this,r)}}var C=y.Cesium,L=function(e){u()(r,e);var t=j(r);function r(){return n()(this,r),t.apply(this,arguments)}return a()(r,[{key:"layer",get:function(){return this._mvtLayer}},{key:"_mountedHook",value:function(){var e=this;this._mvtLayer=this._map.scene.addVectorTilesMap(this.options);var t=this._mvtLayer.readyPromise;C.when(t,(function(e){}),(function(t){e.showError("渲染时发生错误，已停止渲染。",t)}));var r=this._map.scene,o=new C.ScreenSpaceEventHandler(r.canvas);o.setInputAction((function(t){if(e.show){var o=y.PointUtil.getCurrentMousePosition(r,t.position);e._mvtLayer.queryRenderedFeatures([o],{}).reduce((function(r,n){var i=n.feature.properties;if(i){var a=y.Util.getPopupForConfig(e.options,i),s={data:i,event:t};e._map.openPopup(o,a,s)}}),["in","$id"])}}),C.ScreenSpaceEventType.LEFT_CLICK),this.handler=o}},{key:"_addedHook",value:function(){this._mvtLayer.show=!0}},{key:"_removedHook",value:function(){this._mvtLayer&&(this._mvtLayer.show=!1)}},{key:"setOpacity",value:function(e){this._mvtLayer&&(this._mvtLayer.alpha=parseFloat(e))}},{key:"flyTo",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.options.center?this._map.setCameraView(this.options.center,e):this.options.extent?this._map.flyToExtent(this.options.extent,e):this._mvtLayer&&this._map.camera.flyTo(S(S({},e),{},{destination:this._mvtLayer.rectangle}))}}]),r}(y.layer.BaseLayer);y.layer.SmMvtLayer=L,y.LayerUtil.register("supermap_mvt",L)}])}));
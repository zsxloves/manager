define(["exports","./arrayRemoveDuplicates-47b233f1","./Cartesian2-40b13f31","./when-7b580518","./Math-87254c13","./PolylinePipeline-ff2b6881"],function(e,P,A,C,w,m){"use strict";var i={};var b=new A.Cartographic,M=new A.Cartographic;function E(e,i,t,r){var a=(i=P.arrayRemoveDuplicates(i,A.Cartesian3.equalsEpsilon)).length;if(!(a<2)){var n=C.defined(r),o=C.defined(t),l=new Array(a),s=new Array(a),h=new Array(a),g=i[0];l[0]=g;var p=e.cartesianToCartographic(g,b);o&&(p.height=t[0]),s[0]=p.height,h[0]=n?r[0]:0;for(var u,c,v=s[0]===h[0],y=1,d=1;d<a;++d){var f=i[d],m=e.cartesianToCartographic(f,M);o&&(m.height=t[d]),v=v&&0===m.height,u=p,c=m,w.CesiumMath.equalsEpsilon(u.latitude,c.latitude,w.CesiumMath.EPSILON10)&&w.CesiumMath.equalsEpsilon(u.longitude,c.longitude,w.CesiumMath.EPSILON10)?p.height<m.height&&(s[y-1]=m.height):(l[y]=f,s[y]=m.height,h[y]=n?r[d]:0,v=v&&s[y]===h[y],A.Cartographic.clone(m,p),++y)}if(!(v||y<2))return l.length=y,s.length=y,h.length=y,{positions:l,topHeights:s,bottomHeights:h}}}var F=new Array(2),H=new Array(2),L={positions:void 0,height:void 0,granularity:void 0,ellipsoid:void 0};i.computePositions=function(e,i,t,r,a,n){var o=E(e,i,t,r);if(C.defined(o)){i=o.positions,t=o.topHeights,r=o.bottomHeights;var l=i.length,o=l-2,s=w.CesiumMath.chordLength(a,e.maximumRadius),h=L;if(h.minDistance=s,h.ellipsoid=e,n){for(var g=0,p=0;p<l-1;p++)g+=m.PolylinePipeline.numberOfPoints(i[p],i[p+1],s)+1;var u=new Float64Array(3*g),c=new Float64Array(3*g),v=F,y=H;h.positions=v,h.height=y;var d=0;for(p=0;p<l-1;p++){v[0]=i[p],v[1]=i[p+1],y[0]=t[p],y[1]=t[p+1];var f=m.PolylinePipeline.generateArc(h);u.set(f,d),y[0]=r[p],y[1]=r[p+1],c.set(m.PolylinePipeline.generateArc(h),d),d+=f.length}}else h.positions=i,h.height=t,u=new Float64Array(m.PolylinePipeline.generateArc(h)),h.height=r,c=new Float64Array(m.PolylinePipeline.generateArc(h));return{bottomPositions:c,topPositions:u,numCorners:o}}},e.WallGeometryLibrary=i});

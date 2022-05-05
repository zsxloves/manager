/*
         添加扩散效果扫描线
         viewer
         cartographicCenter 扫描中心
         radius  半径 米
         scanColor 扫描颜色
         duration 持续时间 毫秒
       */
const Circle3WaveType = 'Circle3Scan';
// mars3d.MaterialUtil.register(Circle3WaveType, {
//   fabric: {
//     uniforms: {
//       color: new Cesium.Color(0.0, 1.0, 0.0, 0.4),
//       startAngle: 0.0,
//       endAngle: 90.0,
//       speed: 10,
//       count: 1,
//       gradient: 0.01,
//     },
//     source: `
//              #define M_PI 3.1415926535897932384626433832795
//              czm_material czm_getMaterial(czm_materialInput materialInput){
//               czm_material material = czm_getDefaultMaterial(materialInput);
//                material.diffuse = 1.2*color.rgb;
//                vec2 st = materialInput.st;
//                vec3 str = materialInput.str;
//                float dis = distance(st, vec2(0.5, 0.5));
//                float per = fract(speed*czm_frameNumber/1000.0);
//                float current_radians = atan(st.y-0.5, st.x-0.5);
//                float startNum=.0 - startAngle*M_PI/180.0;
//                float endNum=.0 - endAngle*M_PI/180.0;
//                if (abs(str.z) > 0.001) {
//                  discard;
//                }
//                 if (dis > 0.5) {
//                   discard;
//                  } else {
//                    float perDis = 0.5 / count;
//                    float disNum;
//                    float bl = .0;
//                    for (int i = 0; i <= 999; i++) {
//                      if (float(i) <= count) {
//                        disNum = perDis * float(i) - dis + per / count;
//                        if (disNum > 0.0) {
//                          if (disNum < perDis) {
//                            bl = 1.0 - disNum / perDis;
//                          }else if (disNum - perDis < perDis) {
//                            bl = 1.0 - abs(1.0 - disNum / perDis);
//                          }

//                          if(current_radians >endNum  && current_radians <startNum ){
//                            material.alpha = pow(bl, gradient)*0.3;
//                          }else{
//                            material.alpha = .0;
//                          }

//                           }
//                          }
//                        }
//                        return material;
//                      }

//                    }`,
//   },
//   translucent: true,
// });
export default function addCircleScanPostStage(position, radius, startAngle, endAngle, rotation) {
  return new mars3d.graphic.CirclePrimitive({
    name: '扇形雷达',
    position: new mars3d.LatLngPoint(position[0], position[1], position[2]),
    style: {
      rotationDegree: rotation || 0,
      radius,
      material: mars3d.MaterialUtil.createMaterial(Circle3WaveType, {
        color: new Cesium.Color(0.0, 1.0, 0.0, 0.4),
        speed: 10,
        startAngle,
        endAngle,
        count: 3,
        gradient: 0.1,
      }),
    },
    attr: { remark: '示例8' },
    allowDrillPick: true,
  });
}

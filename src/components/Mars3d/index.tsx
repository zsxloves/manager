import React, { useEffect, useState } from 'react';
import styles from './style.less';
import { useModel } from 'umi';
import $ from 'jquery';
declare interface Proptype {
  lnglat: (e: any, views?: any) => void;
  // obtainLayer: (state: boolean, graphicLayers: any) => void;
  other?: string;
  pointInit?: {
    lng: string | undefined;
    lat: string | undefined;
    alt: string | undefined;
    heading?: string | undefined;
    pitch?: string | undefined;
  };
  depthTestAgainstTerrain?: boolean;
  flyHome?: number;
  line?: string; //判断视域
  views?: any; //视域
  position?: string;
}
let map: any = null;
const Mars3d: React.FC<Proptype> = (props) => {
  //初始化地图
  const { lnglat, flyHome, pointInit, line, views, other, position, depthTestAgainstTerrain } =
    props;
  const { setInitialState } = useModel('@@initialState');
  const [centerView, setCenterView] = useState(null);
  const initMars3d = (mapOptions: any) => {
    const newmapOptions = mars3d.Util.merge(mapOptions, {
      scene: {
        center: mapOptions.scene.center,
        // {
        //   alt: 1994,
        //   heading: 0,
        //   lat: 30.215913,
        //   lng: 120.224862,
        //   pitch: -45,
        // }, //以后做接口配置
        sceneMode: 3,
        fxaa: true, // 不开启抗锯齿，编辑时界面会闪烁
        globe: {
          depthTestAgainstTerrain: depthTestAgainstTerrain || false, // 不加无法投射到地形上
        },
      },
    });
    //创建三维地球场景
    map = new mars3d.Map('cesiumContainer', newmapOptions);
    map.on(mars3d.EventType.renderError, function () {
      window.location.reload();
    });
    setInitialState((s: any) => ({ ...s, map: map }));
    setCenterView(map.getCameraView());
    const tucengdian = new mars3d.layer.GraphicLayer(); //新建图层
    map.addLayer(tucengdian); //把图层绑定到map地图上

    // 获取坐标
    $('.mars3d-mousedownview').hide();
    if (line) {
      if (views) {
        const graphic = new mars3d.graphic.PolylineEntity({
          positions: views,
          style: {
            color: '#ff0000',
            width: 3,
            closure: true,
            clampToGround: true,
          },
        });
        bindLayerContextMenu(graphic);
        tucengdian.addGraphic(graphic);
      } else {
        tucengdian.startDraw({
          type: 'polyline',
          style: {
            color: '#ff0000',
            width: 3,
            closure: true,
            clampToGround: true,
          },
          success: (graphic: any) => {
            bindLayerContextMenu(graphic);
            const geojson = graphic.toGeoJSON();
            lnglat(1, geojson.geometry.coordinates);
          },
        });
      }
    } else {
      if (!other) return;
      map.on(mars3d.EventType.click, function (event: any) {
        const cartesian = event.cartesian;
        const point = mars3d.LngLatPoint.fromCartesian(cartesian);
        point.format(); // 经度、纬度、高度
        if (lnglat) {
          tucengdian.clear();
          const { lng, lat } = point;
          const graphic = new mars3d.graphic.PointEntity({
            //PointEntity 像素点对象
            position: [lng, lat], //坐标
            style: {
              //样式
              color: 'pink', //颜色
              pixelSize: 10, //大小
              outline: true, //是否边框
              outlineColor: '#fff', //边框颜色
              clampToGround: true,
              outlineWidth: 2, //边框大小
            },
          });
          tucengdian.addGraphic(graphic); //把刚刚创建的像素点添加到图层上
          if (position) {
            map.flyToPoint(point);
          }
          lnglat(point.format());
        }
      });
      if (pointInit?.lat) {
        tucengdian.clear();
        const { lng, lat, alt } = pointInit;
        const graphic = new mars3d.graphic.PointEntity({
          position: localStorage.getItem('centerPosition') || new mars3d.LngLatPoint(lng, lat), //坐标
          style: {
            color: 'pink', //颜色
            pixelSize: 10, //大小
            outline: true, //是否边框
            outlineColor: '#fff', //边框颜色
            outlineWidth: 2, //边框大小
            clampToGround: true,
          },
        });
        tucengdian.addGraphic(graphic);
        if (pointInit.pitch) {
          map.centerAt(pointInit);
        } else {
          map.flyToPoint(new mars3d.LngLatPoint(lng, lat, alt), {
            heading: 0,
            pitch: -45,
          });
        }
      }
    }
    function bindLayerContextMenu(graphicLayer: any) {
      graphicLayer.bindContextMenu([
        {
          text: '开始编辑对象',
          iconCls: 'fa fa-edit',
          show: function (e: any) {
            const graphic = e.graphic;
            if (!graphic || !graphic.startEditing) {
              return false;
            }
            return !graphic.isEditing;
          },
          callback: function (e: any) {
            // obtainLayer(true, graphicLayer)
            const graphic = e.graphic;
            if (!graphic) {
              return false;
            }
            if (graphic) {
              graphicLayer.startEditing(graphic);
            }
            console.log('开始', graphic);
          },
        },
        {
          text: '停止编辑对象',
          iconCls: 'fa fa-edit',
          show: function (e: any) {
            const graphic = e.graphic;
            if (!graphic) {
              return false;
            }
            return graphic.isEditing;
          },
          callback: function (e: any) {
            // obtainLayer(false, graphicLayer)
            const graphic = e.graphic;
            if (!graphic) {
              return false;
            }
            if (graphic) {
              graphicLayer.stopEditing(graphic);
              const geojson = graphic.toGeoJSON();
              lnglat(1, geojson.geometry.coordinates);
            }
            console.log('停止', graphic);
          },
        },
        {
          text: '删除对象',
          iconCls: 'fa fa-trash-o',
          show: (event: any) => {
            const graphic = event.graphic;
            if (!graphic || graphic.isDestroy) {
              return false;
            } else {
              return true;
            }
          },
          callback: function (e: any) {
            const graphic = e.graphic;
            if (!graphic) {
              return;
            }
            tucengdian.removeGraphic(graphic);
            lnglat(1, []);
            tucengdian.startDraw({
              type: 'polyline',
              style: {
                color: '#ff0000',
                width: 3,
                closure: true,
                clampToGround: true,
              },
              success: (graphics: any) => {
                bindLayerContextMenu(graphics);
                const geojson = graphics.toGeoJSON();
                lnglat(1, geojson.geometry.coordinates);
              },
            });
          },
        },
      ]);
    }
  };

  useEffect(() => {
    const mapUrl = '/config/config.json';
    mars3d.Resource.fetchJson({ url: mapUrl }).then((data: any) => {
      initMars3d(data.map3d); // 构建地图
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (flyHome && map) {
      map.centerAt(centerView);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyHome]);
  useEffect(() => {
    if (map) {
      map.setSceneOptions({
        globe: {
          depthTestAgainstTerrain: depthTestAgainstTerrain, // 不加无法投射到地形上
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depthTestAgainstTerrain]);
  return (
    <div style={{ height: '100%' }}>
      <div id="cesiumContainer" className={styles.cesiumContainer} />
    </div>
  );
};

export default Mars3d;

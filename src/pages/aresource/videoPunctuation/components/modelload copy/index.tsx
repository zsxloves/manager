import React, { useState, useEffect, useImperativeHandle } from 'react';
import { TreeSelect } from 'antd';
import { getModelLayer } from '../../../../../services/prepar';
import jsonloop from 'jsonloop';
const defaultSeperator = '.';
const cJSON = jsonloop(defaultSeperator);
export interface SelectModelProps {
  setModelTreeData: (data: any) => void;
  modelTreeData: any;
  map: any;
}
interface RefTypes {
  clear: () => void;
  loadmodel: (entity: any, callBack: (e: any) => void) => void;
}
let threeLayerSp: any = null;
const Modelload = React.forwardRef<RefTypes, SelectModelProps>((props, ref) => {
  const { modelTreeData, setModelTreeData, map } = props;
  const [treeDatas, setTreeDatas] = useState<any[]>([]); //场馆

  useEffect(() => {
    const param = {
      layerTypeList: [
        'c5f73532-ccee-4191-85bf-3df894dd7dd2',
        // 'e285ed67-f265-45e4-b39e-9b82e6ece8dd',
      ],
      // parentId: 'YYSG',
      parentId: '20',
    };
    getModelLayer(param).then((res: any) => {
      const datas = res.result.result;
      if (datas) {
        setTreeDatas(datas);
      }
    });
  }, []);
  // 模型加载
  const loadmodel = (entity: any, callBack: (e: any) => void) => {
    let rotax = 0;
    let rotay = 0;
    let rotaz = 0;

    if (entity instanceof Array || (entity instanceof Object && Object.keys(entity).length === 0))
      return;
    if (entity?.offset?.pitch) {
      rotax = parseInt(entity.offset.pitch);
    } else {
      rotax = 0;
    }
    if (entity?.offset?.roll) {
      rotay = parseInt(entity.offset.roll);
    } else {
      rotay = 0;
    }
    if (entity?.offset?.heading) {
      rotaz = parseInt(entity.offset.heading);
    } else {
      rotaz = 0;
    }
    const eventTarget = new mars3d.BaseClass();
    const param = {
      name: entity.name,
      type: entity.type,
      url: entity.url,
      maximumScreenSpaceError: 8, // 【重要】数值加大，能让最终成像变模糊
      maximumMemoryUsage: 1024, // 【重要】内存分配变小有利于倾斜摄影数据回收，提升性能体验
      center: map.getCameraView(),
      position: entity.offset
        ? { lng: entity?.offset?.x, lat: entity?.offset?.y, alt: entity?.offset?.z }
        : {},
      rotation: { x: rotax, y: rotay, z: rotaz },
      show: true,
    };
    threeLayerSp = new mars3d.layer.TilesetLayer({
      flyTo: true,
      ...param,
    });
    map.addLayer(threeLayerSp);
    // 加载完成事件
    threeLayerSp.on(mars3d.EventType.load, function (event: any) {
      const data = event.tileset;
      eventTarget.fire('tiles3dLayerLoad', { data, threeLayerSp });
      callBack(event);
    });
  };
  const changeModelTree = (value: any, node: any) => {
    if (node.children) {
      return;
    } else {
      setModelTreeData(node);
      map.removeLayer(threeLayerSp);
      loadmodel(cJSON.parse(node.data.entity), function () {});
    }
  };
  // 父组件调用loadmodel
  const clear = () => {
    if (threeLayerSp) map.removeLayer(threeLayerSp);
  };
  useImperativeHandle(ref, () => ({
    clear,
    loadmodel,
  }));
  return (
    <TreeSelect
             fieldNames={{ label: 'title', value: 'key', children: 'children' }}
      style={{ width: '100%' }}
      value={modelTreeData?.length > 0 ? modelTreeData : null}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeDatas}
      placeholder="请选择场馆"
      treeDefaultExpandAll
      onSelect={changeModelTree}
      treeNodeFilterProp="title"
      showSearch
    />
  );
});
export default Modelload;

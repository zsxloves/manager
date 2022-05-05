import React, { useState, useEffect, useImperativeHandle } from 'react';
import { TreeSelect, message } from 'antd';
import { getModelLayer } from '../../../../../services/prepar';
import jsonloop from 'jsonloop';
const defaultSeperator = '.';
const cJSON = jsonloop(defaultSeperator);
export interface SelectModelProps {
  setModelTreeData: (data: any) => void;
  clearSelect: () => void;
  modelTreeData: any;
  map: any;
}
interface RefTypes {
  clear: () => void;
  loadmodel: (entity: any, callBack: () => void) => void;
}
let threeLayerSp: any = null;
const Modelload = React.forwardRef<RefTypes, SelectModelProps>((props, ref) => {
  const { modelTreeData, setModelTreeData, clearSelect, map } = props;
  const [treeDatas, setTreeDatas] = useState<any[]>([]); //场馆

  useEffect(() => {
    const param = {
      layerTypeList: ['c5f73532-ccee-4191-85bf-3df894dd7dd2'],
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
  const loadmodel = (entity: any, callBack?: (e: any) => void) => {
    const eventTarget = new mars3d.BaseClass();
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
    try {
      threeLayerSp = new mars3d.LayerUtil.create({
        ...entity,
        center: map.getCameraView(),
        position: entity.position
          ? entity.position
          : entity.offset
          ? { lng: entity?.offset?.x, lat: entity?.offset?.y, alt: entity?.offset?.z }
          : {},
        rotation: entity.rotation ? entity.rotation : { x: rotax, y: rotay, z: rotaz },
        show: true,
      });
    } catch (e: any) {
      console.log(e);
      message.error('后台数据配置错误');
    }
    map.addLayer(threeLayerSp);
    threeLayerSp.on(mars3d.EventType.load, function (event: any) {
      const data = event.tileset;
      eventTarget.fire('tiles3dLayerLoad', { data, threeLayerSp });
      callBack!(event);
    });
  };
  const changeModelTree = (value: any, node: any) => {
    if (node.children) {
      return;
    } else {
      setModelTreeData(node);
      map.removeLayer(threeLayerSp);
      const res = cJSON.parse(node.data.entity || '{}');
      // 瓦片图层
      loadmodel(res);
    }
  };
  // 父组件调用loadmodel
  const clear = () => {
    if (threeLayerSp) map.removeLayer(threeLayerSp);
  };

  const treeSelectClear = (value: any, label: any) => {
    if (!value && label?.length === 0) {
      clearSelect();
      clear();
    }
  };

  useImperativeHandle(ref, () => ({
    clear,
    loadmodel,
  }));
  return (
    <TreeSelect
             fieldNames={{ label: 'title', value: 'key', children: 'children' }}
      allowClear
      style={{ width: '100%' }}
      value={modelTreeData?.title}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeDatas}
      placeholder="请选择场馆"
      treeDefaultExpandAll
      onSelect={changeModelTree}
      onChange={treeSelectClear}
      treeNodeFilterProp="title"
      showSearch
    />
  );
});
export default Modelload;

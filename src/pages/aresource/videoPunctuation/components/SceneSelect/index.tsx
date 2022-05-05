import React from 'react';
import { message, Select } from 'antd';
import useGetScene from '@/hooks/useGetScene';
import { sceneDetail } from '@/services/sceneManage/index';

interface IProps {
  obtainViews: (views: [], position: any, value: any) => void;
}

const SceneSelect: React.FC<IProps> = ({ obtainViews }) => {
  const { Option } = Select;
  const sceneObj = useGetScene();

  const handleChange = (value: any, a: any) => {
    console.log('select', value, a);
    sceneDetail({ id: value })
      .then((res) => {
        console.log(res);
        let views = null;
        let position = null;
        if (res.result.detail?.views) {
          views = JSON.parse(res.result.detail?.views); //获取场景视域
          views[views.length] = views[0];
        }
        if (res.result.detail?.centerPosition) {
          position = JSON.parse(res.result.detail?.centerPosition); //中心点
        }
        obtainViews(views, position, value);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  return (
    <Select size="large" placeholder="选择场景" onChange={handleChange} style={{ width: 200 }}>
      {sceneObj.list.map((v: any) => {
        return (
          <Option value={v.id} key={v.id} label={v.name}>
            {v.name}
          </Option>
        );
      })}
    </Select>
  );
};

export default SceneSelect;

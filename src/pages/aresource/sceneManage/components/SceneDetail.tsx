import React, { useEffect, useState } from 'react';
import { Descriptions, Drawer, message, Tabs } from 'antd';
import { sceneDetail } from '@/services/sceneManage/index';
import { formatJson } from '@/utils/utilsJS';

export interface DetailPer {
  scenueId: string;
  sceneDetailV: boolean;
  cancelDetail: () => void;
}

type senceType = {
  name?: string;
  organizationName?: string;
  gymName?: string;
  centerPosition?: string;
  views?: string;
  entity?: any;
  updateTime?: string;
  inserterId?: string;
  insertTime?: string;
  inserterName?: string;
  updaterName?: string;
  updaterId?: string;
  title?: string;
  indexConfigUrl?: string;
  code?: string;
};

const SceneDetail: React.FC<DetailPer> = ({ scenueId, sceneDetailV, cancelDetail }) => {
  const [info, setInfo] = useState<senceType>({});
  const [type, setType] = useState<boolean>(false);
  useEffect(() => {
    if (sceneDetailV) {
      sceneDetail({ id: scenueId })
        .then((res) => {
          if (res.code === 200) {
            const data = res?.result?.detail;
            if (data.gymList.length > 0) {
              data.gymName = '';
              for (let i = 0; i < data.gymList.length; i++) {
                data.gymName += data.gymList[i].name;
                if (i < data.gymList.length - 1) {
                  data.gymName += ' | ';
                }
              }
            }
            setInfo(data);
            setType(true);
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenueId]);

  const callback = () => {
    message.error('解析失败');
  };

  return (
    <Drawer
      width={1000}
      title="场景详情"
      visible={sceneDetailV}
      onClose={() => {
        cancelDetail();
        setInfo({});
      }}
      closable={true}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="基础信息" key="1">
          {type && (
            <Descriptions
              column={2}
              labelStyle={{
                width: '100px',
                justifyContent: 'right',
                marginRight: '16px',
                color: '#666666',
              }}
              contentStyle={{
                fontWeight: 'bold',
                color: '#000000',
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              <Descriptions.Item label="场景名称" span={2}>
                {info.name}
              </Descriptions.Item>
              <Descriptions.Item label="场景标题" span={2}>
                {info.title}
              </Descriptions.Item>
              <Descriptions.Item label="编码" span={2}>
                {info.code}
              </Descriptions.Item>
              <Descriptions.Item label="所属组织机构" span={2}>
                {info.organizationName}
              </Descriptions.Item>
              <Descriptions.Item label="关联场馆" span={2}>
                {info.gymName}
              </Descriptions.Item>
              <Descriptions.Item label="插入人">{info.inserterName}</Descriptions.Item>
              <Descriptions.Item label="插入人时间">{info.insertTime}</Descriptions.Item>
              <Descriptions.Item label="更新人">{info.updaterName}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{info.updateTime}</Descriptions.Item>
              <Descriptions.Item span={2} label="中心点">
                <pre>{formatJson(info.centerPosition, callback)}</pre>
              </Descriptions.Item>
              <Descriptions.Item span={2} label="大屏配置">
                <pre>{formatJson(info.indexConfigUrl, callback)}</pre>
              </Descriptions.Item>
              <Descriptions.Item span={2} label="views视域">
                <pre>{formatJson(info.views, callback)}</pre>
              </Descriptions.Item>
              <Descriptions.Item span={2} label="配置详细json">
                <pre>{formatJson(info.entity, callback)}</pre>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Drawer>
  );
};

export default SceneDetail;

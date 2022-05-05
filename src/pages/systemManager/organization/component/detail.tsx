import React, { useEffect, useState } from 'react';
import { message, Descriptions } from 'antd';
import { DrawerForm } from '@ant-design/pro-form';
import { detail } from '@/services/organizationApi';
export interface BaseConfirmProps {
  onCancel: (flag?: boolean) => void;
  detailModalVisible: boolean;
  id: string;
}

const Add: React.FC<BaseConfirmProps> = (props) => {
  const [baseForm, setBaseForm] = useState<any>({});
  const { onCancel: handleCancel, detailModalVisible, id } = props;
  const getDetail = () => {
    detail({ id })
      .then((res) => {
        if (res.code === 200) {
          const info = res.result.detail || {};
          setBaseForm(info);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  useEffect(() => {
    if (id) {
      getDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <DrawerForm
      title="详情"
      width={1000}
      visible={detailModalVisible}
      drawerProps={{
        footerStyle: {
          display: 'none',
        },
        bodyStyle: {
          padding: '24px',
        },
        footer: false,
        forceRender: true,
        destroyOnClose: true,
        maskClosable: true,
        onClose: () => {
          handleCancel(false);
        },
      }}
      submitter={false}
    >
      <Descriptions
        title=""
        layout="horizontal"
        column={2}
        labelStyle={{
          width: '120px',
          alignItems: 'center',
          justifyContent: 'right',
          color: '#666666',
        }}
        contentStyle={{ fontWeight: 'bold', color: '#000000' }}
      >
        <Descriptions.Item label="代码">{baseForm.code}</Descriptions.Item>
        <Descriptions.Item label="组织名称">{baseForm.name}</Descriptions.Item>
        <Descriptions.Item label="父级组织机构">{baseForm.parentName}</Descriptions.Item>
        <Descriptions.Item label="经度">{baseForm.lon}</Descriptions.Item>
        <Descriptions.Item label="纬度">{baseForm.lat}</Descriptions.Item>
        <Descriptions.Item label="插入时间">{baseForm.insertTime}</Descriptions.Item>
        <Descriptions.Item label="插入人">{baseForm.inserterName}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{baseForm.updateTime}</Descriptions.Item>
        <Descriptions.Item label="更新人">{baseForm.updaterName}</Descriptions.Item>
        <Descriptions.Item label="辖区范围类别" span={2}>
          {baseForm.geoType}
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          {baseForm.remark}
        </Descriptions.Item>
        <Descriptions.Item label="辖区经纬度点级" span={2}>
          <div style={{ maxHeight: '400px', overflow: 'auto' }}>{baseForm.geoJson}</div>
        </Descriptions.Item>
      </Descriptions>
      ,
    </DrawerForm>
  );
};

export default Add;

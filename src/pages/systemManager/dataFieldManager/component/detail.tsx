import React, { useEffect, useState } from 'react';
import { Modal, message, Descriptions } from 'antd';
import { powerDetail } from '@/services/authorityManager';
export interface BaseConfirmProps {
  onCancel: (flag?: boolean) => void;
  detailModalVisible: boolean;
  id: string;
}

const Add: React.FC<BaseConfirmProps> = (props) => {
  const [baseForm, setBaseForm] = useState<any>({});
  const { onCancel: handleCancel, detailModalVisible, id } = props;
  const getDetail = () => {
    powerDetail({ id })
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
    <Modal
      width={1000}
      bodyStyle={{ padding: '40px' }}
      destroyOnClose
      title="详情"
      maskClosable={false}
      visible={detailModalVisible}
      footer={null}
      onCancel={() => {
        handleCancel(false);
      }}
    >
      <Descriptions title="" layout="horizontal" column={2}>
        <Descriptions.Item label="插入时间">{baseForm.insertTime}</Descriptions.Item>
        <Descriptions.Item label="插入人">{baseForm.inserterName}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{baseForm.updateTime}</Descriptions.Item>
        <Descriptions.Item label="更新人">{baseForm.updaterName}</Descriptions.Item>
        <Descriptions.Item label="代码">{baseForm.code}</Descriptions.Item>
        <Descriptions.Item label="名称">{baseForm.name}</Descriptions.Item>
        <Descriptions.Item label="父级权限" span={2}>
          {baseForm.parentName}
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          {baseForm.remark}
        </Descriptions.Item>
      </Descriptions>
      ,
    </Modal>
  );
};

export default Add;

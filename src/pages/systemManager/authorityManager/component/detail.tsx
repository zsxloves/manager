import React, { useEffect, useState } from 'react';
import { message, Descriptions } from 'antd';
import { DrawerForm } from '@ant-design/pro-form';
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
          width: '80px',
          alignItems: 'center',
          justifyContent: 'right',
          color: '#666666',
        }}
        contentStyle={{ fontWeight: 'bold', color: '#000000' }}
      >
        <Descriptions.Item label="名称">{baseForm.name}</Descriptions.Item>
        <Descriptions.Item label="权限值">{baseForm.code}</Descriptions.Item>
        <Descriptions.Item label="权限分类">
          {baseForm.type === 'fun' ? '功能' : '菜单'}
        </Descriptions.Item>
        <Descriptions.Item label="父级权限">{baseForm.parentName}</Descriptions.Item>
        <Descriptions.Item label="插入时间">{baseForm.insertTime}</Descriptions.Item>
        <Descriptions.Item label="插入人">{baseForm.inserterName}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{baseForm.updateTime}</Descriptions.Item>
        <Descriptions.Item label="更新人">{baseForm.updaterName}</Descriptions.Item>
        <Descriptions.Item label="权限地址" span={2}>
          {baseForm.redirectUrl}
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          {baseForm.remark}
        </Descriptions.Item>
      </Descriptions>
    </DrawerForm>
  );
};

export default Add;

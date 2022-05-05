import React, { useEffect, useState, useRef } from 'react';
import ProForm, { ProFormText, ProFormDateTimePicker, ProFormSelect } from '@ant-design/pro-form';
import { Button, Row, Col, message, Modal } from 'antd';
import { save, editcar, getactList } from '../../../../services/car';
import styles from './index.less';
declare interface Props {
  edit?: any;
  showAdd: boolean;
  change: () => void;
  reload: () => void;
}
import { formatDate } from '@/utils/utilsJS';
const AddUnit: React.FC<Props> = (props: any) => {
  const { showAdd, change, edit, reload } = props;
  const formRef: any = useRef(null);
  const [flag, setFlag] = useState<boolean>(showAdd); //所属活动列表
  const [editId] = useState<string>(edit?.id);
  const [actList, setActList] = useState<
    {
      value: string;
      label: string;
    }[]
  >(); //活动列表

  //判断新增删除
  const isEdit = !!edit;
  useEffect(() => {
    // 活动列表
    const queryObject = {
      page: 0,
      size: 10000000,
    };
    getactList({ queryObject }).then((res) => {
      const data = res.result.page.content;
      const de =
        data &&
        data.map((item: Record<string, unknown>) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      setActList(de);
    });
    if (isEdit) {
      formRef.current.setFieldsValue(edit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveFun = (params: any) => {
    if (editId) {
      params.id = editId;
      const mange = { ...edit, ...params };
      mange.startTime = formatDate(params.startTime);
      mange.expectTime = formatDate(params.expectTime);
      mange.returnTime = formatDate(params.returnTime);
      editcar(mange)
        .then((res: any) => {
          if (res.code === 200) {
            message.success(res.message);
            reload();
            change();
            setFlag(false);
          } else {
            message.error(res.message || res);
          }
        })
        .catch((err: any) => {
          message.error(err.message || err);
        });
    } else {
      params.startTime = formatDate(params.startTime);
      params.expectTime = formatDate(params.expectTime);
      params.returnTime = formatDate(params.returnTime);
      save(params)
        .then((res: any) => {
          if (res.code === 200) {
            message.success(res.message);
            reload();
            change();
            setFlag(false);
          } else {
            message.error(res.message || res);
          }
        })
        .catch((err: any) => {
          message.error(err.message || err);
        });
    }
  };
  // 取消
  const cancelFun = (): void => {
    change();
    setFlag(false);
  };
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            cancelFun();
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            formRef.current.validateFields().then((val: any) => {
              saveFun(val);
            });
          }}
        >
          保存
        </Button>
      </>
    );
  };
  return (
    <Modal
      maskClosable={false}
      visible={flag}
      width={1000}
      onCancel={cancelFun}
      footer={renderFooter()}
      className={styles.addmodel}
      title={editId ? '编辑班车' : '新增班车'}
    >
      <ProForm
        formRef={formRef}
        layout="horizontal" //label和输入框一行
        labelCol={{ style: { width: 140 } }}
        submitter={false}
      >
        <Row>
          {/* 班车名称 */}
          <Col span={11}>
            <ProFormText
              // placeholder={'请输入班车名称'}
              name="name"
              label="班车名称"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 40, autoComplete: 'off' }}
              rules={[
                { required: true, message: '请输入班车名称' },
                {
                  min: 1,
                  max: 40,
                  message: '赛事名称长度在1~40之间',
                },
              ]}
            />
          </Col>
          {/* 到达场馆 */}
          <Col span={11}>
            <ProFormText
              // placeholder={'请输入到达场馆'}
              name="tame"
              label="到达场馆"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 40, autoComplete: 'off' }}
              rules={[
                // { required: true, message: '请输入队伍名称' },
                {
                  min: 1,
                  max: 40,
                  message: '到达场馆长度在1~40之间',
                },
              ]}
            />
          </Col>
          {/* 所属活动 */}
          <Col span={11}>
            <ProFormSelect
              showSearch
              // placeholder={'请选择所属活动'}
              name="activityId"
              label="所属活动"
              options={actList}
              // rules={[{ required: true, message: '请选择状态' }]}
            />
          </Col>
          {/* 发车时间 */}
          <Col span={11}>
            <ProFormDateTimePicker
              // placeholder={'请选择发车时间'}
              name="startTime"
              label="发车时间"
              rules={[{ required: true, message: '请选择发车时间' }]}
            />
          </Col>
          {/* 预计到达时间 */}
          <Col span={11}>
            <ProFormDateTimePicker
              // placeholder={'请选择预计到达时间'}
              name="expectTime"
              label="预计到达时间"
              rules={[{ required: true, message: '请输入预计到达时间' }]}
            />
          </Col>
          {/* 预计返回时间 */}
          <Col span={11}>
            <ProFormDateTimePicker
              // placeholder={'请选择预计返回时间'}
              name="returnTime"
              label="预计返回时间"
              rules={[{ required: true, message: '请输入预计返回时间' }]}
            />
          </Col>
          {/* GPScode */}
          <Col span={11}>
            <ProFormText name="deviceId" label="GPS编码" />
          </Col>
          {/* 视频code */}
          <Col span={11}>
            <ProFormText name="videoId" label="视频编码" />
          </Col>
        </Row>
      </ProForm>
    </Modal>
  );
};
export default AddUnit;

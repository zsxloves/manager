import React, { useEffect, useState, useRef } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Button, Row, Col, message, Form, Modal, Input } from 'antd';
import { save, editkakou } from '../../../../services/station';
import { AimOutlined } from '@ant-design/icons';
import Map from '@/components/Map'; //引入地图
import styles from './index.less';
import { getBit } from '@/utils/utilsJS';
declare interface Props {
  edit?: any;
  showAdd: boolean;
  change: () => void;
  reload: () => void;
}
const AddUnit: React.FC<Props> = (props: any) => {
  const { showAdd, change, edit, reload } = props;
  const formRef: any = useRef(null);
  const [flag, setFlag] = useState<boolean>(showAdd); //所属活动列表
  const [editId] = useState<string>(edit?.id);
  //地图
  const [isShowMap, setShowMap] = useState<boolean>(false);
  const [mapValues, setMapValues] = useState<any>({});
  const [point, setPoint] = useState<any>(
    props.formData ? [props.formData.lon, props.formData.lat] : [],
  );
  //判断新增删除
  const isEdit = !!edit;
  useEffect(() => {
    if (isEdit) {
      formRef.current.setFieldsValue(edit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveFun = (params: any) => {
    if (editId) {
      params.id = editId;
      const mange = { ...edit, ...params };
      editkakou(mange)
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
      const mange = { ...params };
      save(mange)
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
    setFlag(false);
    change();
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
      title={editId ? '编辑卡口' : '新增卡口'}
    >
      <ProForm
        formRef={formRef}
        layout="horizontal" //label和输入框一行
        labelCol={{ style: { width: 140 } }}
        submitter={false}
      >
        <Row>
          {/* 卡口名称 */}
          <Col span={11}>
            <ProFormText
              name="name"
              label="卡口名称"
              getValueFromEvent={(e) => e.target.value.trim()}
              // placeholder={'请输入卡口名称'}
              rules={[
                { required: true, message: '请输入卡口名称' },
                {
                  min: 1,
                  max: 20,
                  message: '卡口名称长度在1~20之间',
                },
              ]}
            />
          </Col>
          {/* 朝向 */}
          <Col span={11} offset={1}>
            <ProFormText
              name="directions"
              label="朝向"
              getValueFromEvent={(e) => e.target.value.trim()}
              // placeholder={'请输入朝向'}
              rules={[
                { required: true, message: '请输入朝向' },
                {
                  min: 1,
                  max: 40,
                  message: '朝向长度在1~40之间',
                },
              ]}
            />
          </Col>
          {/* 通道ID */}
          <Col span={11}>
            <ProFormText
              // placeholder={'请输入通道ID'}
              name="devChnId"
              label="通道ID"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                // { required: true, message: '请输入组别信息' },
                {
                  min: 1,
                  max: 40,
                  message: '通道ID长度在1~40之间',
                },
              ]}
            />
          </Col>
          {/* 经度 */}
          <Col span={11} offset={1}>
            <Form.Item
              name="lon"
              label="经度:"
              rules={[
                { required: true, message: '请输入经度' },
                () => ({
                  validator(_, value) {
                    const reg = /(^[+]?(0|([1-9])){1,3}$)|(^[0-9]{1,3}[.]{1}[0-9]{1,9}$)/g;
                    if ((Number(value) > 0 && Number(value) < 180 && reg.test(value)) || !value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('经度范围在0~180之间，且最多保留9位小数'));
                  },
                }),
              ]}
            >
              <Input
                maxLength={13}
                placeholder="请输入"
                autoComplete="off"
                suffix={
                  <AimOutlined
                    style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                    onClick={() => {
                      const obj = formRef.current.getFieldValue();
                      if (obj.lon && obj.lat) {
                        setPoint({ lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) });
                        const pointNew: any = { lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) };
                        setMapValues(pointNew);
                      } else {
                        setMapValues(point);
                      }
                      setShowMap(true);
                    }}
                  />
                }
              />
            </Form.Item>
          </Col>
          {/* 纬度 */}
          <Col span={11}>
            <Form.Item
              name="lat"
              label="纬度:"
              rules={[
                { required: true, message: '请输入纬度' },
                () => ({
                  validator(_, value) {
                    const reg = /(^[+]?(0|([1-9])){1,2}$)|(^[0-9]{1,2}[.]{1}[0-9]{1,9}$)/g;
                    if ((Number(value) > 0 && Number(value) < 90 && reg.test(value)) || !value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('纬度范围在0~90之间，且最多保留9位小数'));
                  },
                }),
              ]}
            >
              <Input
                maxLength={12}
                placeholder="请输入"
                autoComplete="off"
                suffix={
                  <AimOutlined
                    style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                    onClick={() => {
                      const obj = formRef.current.getFieldValue();
                      if (obj.lon && obj.lat) {
                        setPoint({ lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) });
                        const pointNew: any = { lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) };
                        setMapValues(pointNew);
                      } else {
                        setMapValues(point);
                      }
                      setShowMap(true);
                    }}
                  />
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </ProForm>
      {isShowMap && (
        <Map
          onSubmit={(val) => {
            formRef.current.setFieldsValue({ lon: val.lon, lat: val.lat, height: val.alt });
            setShowMap(false);
          }}
          onCancel={() => {
            setShowMap(false);
          }}
          isShowMap={isShowMap}
          values={mapValues}
        />
      )}
    </Modal>
  );
};
export default AddUnit;

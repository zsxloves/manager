import React, { useEffect, useState } from 'react';
import { Row, Col, message, Form, Input, Modal, Select, Button } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import Map from '@/components/Map';
import { updateEarly, earlyIdetail } from '@/services/securityResources';
import { getDictfindAll } from '@/services/systemManager';
import { lon, lat, alt, getBit } from '@/utils/utilsJS';
import useActIds from '../../../../hooks/useActIds';

export interface FormInfos {
  title: string;
  eqId: string;
  equipVisible: boolean;
  cancelModal: () => void;
  heavyLoad: () => void;
}

const UpdateEquip: React.FC<FormInfos> = ({
  title,
  eqId,
  equipVisible,
  cancelModal,
  heavyLoad,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [earlyFl, setEarlyFl] = useState<{ label: string; value: string }[]>([]); //设备分类
  const [isShowMap, setShowMap] = useState<boolean>(false);
  const [mapValues, setMapValues] = useState<any>({});
  const [init, setInit] = useState<any>();
  const useActIdsRes = useActIds();
  const [point, setPoint] = useState<any>({
    lon: '',
    lat: '',
    alt: '',
  });

  const filters = (data: any) => {
    const info = data.result.result;
    if (info.length > 0) {
      for (let i = 0; i < info.length; i++) {
        info[i].label = info[i].name;
        info[i].value = info[i].id;
      }
    }
    return info;
  };

  const detailInfo = () => {
    earlyIdetail({ id: eqId })
      .then((res) => {
        setInit(res.result.detail);
        res.result.detail.lon = getBit(res.result.detail?.lon, 10);
        res.result.detail.lat = getBit(res.result.detail?.lat, 10);
        form.setFieldsValue(res.result.detail);
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  //初始化
  const initFun = () => {
    //字典库--设备分类查询
    getDictfindAll({ parentId: '95389895-59d1-4004-8429-b079d66a48bd' })
      .then((res) => {
        const data = filters(res);
        setEarlyFl(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  useEffect(() => {
    initFun();
    if (title === 'edit') {
      detailInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = (params: any) => {
    updateEarly({ data: { ...params } })
      .then((res) => {
        if (res.code === 200) {
          message.success(res.message);
          cancelModal();
          heavyLoad();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  const hideModal = async () => {
    const data = await form.validateFields();
    if (title === 'edit') {
      data.id = eqId;
      data.sortIndex = init.sortIndex;
    }
    add(data);
  };
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            cancelModal();
          }}
        >
          取消
        </Button>
        <Button type="primary" onClick={() => hideModal()}>
          保存
        </Button>
      </>
    );
  };
  return (
    <>
      <Modal
        title={title === 'add' ? '新增设备' : '编辑设备'}
        visible={equipVisible}
        centered={true}
        width={1000}
        onCancel={cancelModal}
        footer={renderFooter()}
        destroyOnClose={true}
        maskClosable={false}
      >
        <Form layout="horizontal" labelCol={{ style: { width: 140 } }} requiredMark form={form}>
          <Row>
            <Col span={11}>
              <Form.Item
                name="name"
                label="设备名称"
                getValueFromEvent={(e) => e.target.value.trim()}
                rules={[
                  { required: true, message: '请输入设备名称' },
                  {
                    pattern: /^(a-z|A-Z|0-9)*[^$%^&*;:,<>?()\""\']{1,20}$/,
                    message: '设备名称由1-20个中、英、数或特殊符号组成',
                  },
                ]}
              >
                <Input autoComplete="off" maxLength={20} allowClear={true} placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                name="activityId"
                label="所属活动"
                rules={[{ required: true, message: '请选择所属活动' }]}
              >
                <Select
                  showSearch
                  // mode="multiple"
                  placeholder="请选择"
                  allowClear
                  maxTagCount={2}
                  maxTagTextLength={3}
                  optionFilterProp="label"
                  loading={useActIdsRes.loading}
                >
                  {useActIdsRes.list.map((v: any) => {
                    return (
                      <Option key={v.id} value={v.id} label={v.name}>
                        {v.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                name="category"
                label="设备分类"
                rules={[{ required: true, message: '请选择设备分类' }]}
              >
                <Select options={earlyFl} placeholder="请选择" />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                name="code"
                label="设备编码"
                getValueFromEvent={(e) => e.target.value.trim()}
                rules={[
                  {
                    pattern: /^[A-Za-z0-9]{1,36}$/,
                    message: '设备编码由1-36个英文或数字组成',
                  },
                ]}
              >
                <Input autoComplete="off" maxLength={36} allowClear={true} placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                name="lon"
                label="经度"
                getValueFromEvent={(e) => e.target.value.trim()}
                rules={[
                  {
                    pattern: lon,
                    message: '经度范围在0~180之间，且最多保留9位小数',
                  },
                ]}
              >
                <Input
                  placeholder="请输入"
                  autoComplete="off"
                  allowClear={true}
                  suffix={
                    <AimOutlined
                      style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                      onClick={() => {
                        const obj = form.getFieldValue([]);
                        if (obj.lon && obj.lat) {
                          setPoint({ lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) });
                          const pointNew: any = {
                            lon: getBit(obj.lon, 7),
                            lat: getBit(obj.lat, 7),
                          };
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
            <Col span={11}>
              <Form.Item
                name="lat"
                label="纬度"
                getValueFromEvent={(e) => e.target.value.trim()}
                rules={[
                  {
                    pattern: lat,
                    message: '纬度范围在0~90之间，且最多保留9位小数',
                  },
                ]}
              >
                <Input
                  placeholder="请输入"
                  autoComplete="off"
                  allowClear={true}
                  suffix={
                    <AimOutlined
                      style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                      onClick={() => {
                        const obj = form.getFieldValue([]);
                        if (obj.lon && obj.lat) {
                          setPoint({ lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) });
                          const pointNew: any = {
                            lon: getBit(obj.lon, 7),
                            lat: getBit(obj.lat, 7),
                          };
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
          <Row>
            <Col span={11}>
              <Form.Item
                name="height"
                label="高度"
                getValueFromEvent={(e) => e.target.value.trim()}
                rules={[
                  {
                    pattern: alt,
                    message: '整数最多九位且小数最多两位',
                  },
                ]}
              >
                <Input
                  placeholder="请输入"
                  autoComplete="off"
                  allowClear={true}
                  suffix={
                    <AimOutlined
                      style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                      onClick={() => {
                        const obj = form.getFieldValue([]);
                        if (obj.lon && obj.lat) {
                          setPoint({ lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) });
                          const pointNew: any = {
                            lon: getBit(obj.lon, 7),
                            lat: getBit(obj.lat, 7),
                          };
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
        </Form>
        {isShowMap && (
          <Map
            onSubmit={(val) => {
              setPoint(val.point);
              form.setFieldsValue({ lon: val.lon, lat: val.lat, height: val.alt });
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
    </>
  );
};
export default UpdateEquip;

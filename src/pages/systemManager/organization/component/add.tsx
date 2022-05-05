/* eslint-disable react/self-closing-comp */
import React, { useEffect, useState } from 'react';
import { Modal, Button, message, Form, Row, Col, Input, TreeSelect } from 'antd';
import { updateData, queryOrgTree } from '@/services/organizationApi';
import Map from '@/components/Map';
import { AimOutlined } from '@ant-design/icons';
import { isJSON } from '@/utils/utilsJS';
import Editor from '@/components/wangEditor/editor';
export interface BaseConfirmProps {
  onCancel: (flag?: boolean) => void;
  onSubmit: (list?: any) => void;
  addModalVisible: boolean;
  title: string;
  areaId: string;
  formData: any;
  [key: string]: any;
}
const Add: React.FC<BaseConfirmProps> = (props) => {
  const {
    onSubmit: handleConfirm,
    onCancel: handleCancel,
    addModalVisible,
    title,
    areaId,
    formData,
  } = props;
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState<any>();
  const [isShowMap, setShowMap] = useState<boolean>(false);
  const [mapValues, setMapValues] = useState<any>({});
  const [point, setPoint] = useState<any>({
    lon: '',
    lat: '',
    alt: '',
  });
  const handleEnsure = async () => {
    const fieldsValue = await form.validateFields();
    const newAreaId = title === '编辑' ? formData.areaId : areaId;
    const editTxt = fieldsValue.geoJson;
    if (editTxt && !isJSON(editTxt) && editTxt.length > 0) {
      message.error('辖区经纬度点级需要一个json格式的字符串');
      return;
    }
    updateData({ data: { ...formData, ...fieldsValue, areaId: newAreaId } })
      .then((res) => {
        if (res.code === 200) {
          message.success(res.message);
          handleConfirm();
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  const onChange = (val: any) => {
    console.log('val:', val);
  };
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            handleCancel(false);
          }}
        >
          取消
        </Button>
        <Button type="primary" onClick={() => handleEnsure()}>
          保存
        </Button>
      </>
    );
  };
  useEffect(() => {
    queryOrgTree({ areaId, extensionIdList: formData.id ? [formData.id] : [] }).then((res: any) => {
      if (res.code === 200) {
        setTreeData(res.data);
        if (formData) {
          form.setFieldsValue(formData);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <Modal
      width={1000}
      bodyStyle={{ padding: '40px 0' }}
      destroyOnClose
      title={title}
      maskClosable={false}
      visible={addModalVisible}
      footer={renderFooter()}
      onCancel={() => {
        handleCancel(false);
      }}
    >
      <Form form={form} style={{ paddingRight: 60 }} labelCol={{ style: { width: 140 } }}>
        <Row>
          <Col span={11} className="styTs_zzdm">
            <div style={{ position: 'absolute', left: '140px', bottom: '1px', color: '#f5af12' }}>
              派出所代码后面预留两位
            </div>
            <Form.Item
              name="code"
              label="代码:"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[{ required: true, message: '请输入代码' }]}
            >
              <Input maxLength={36} placeholder="请输入" autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="name"
              label="组织名称:"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[{ required: true, message: '请输入组织名称' }]}
            >
              <Input maxLength={20} placeholder="请输入" autoComplete="off" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="lon"
              label="经度:"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '请输入经度' },
                () => ({
                  validator(_, value) {
                    const reg = /(^[+]?(0|([1-9])){1,3}$)|(^[0-9]{1,3}[.]{1}[0-9]{1,9}$)/g;
                    if ((Number(value) > 0 && Number(value) < 180 && reg.test(value)) || !value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('经度范围为0-180度,小数位最多保留9位'));
                  },
                }),
              ]}
            >
              <Input
                maxLength={32}
                placeholder="请输入"
                autoComplete="off"
                suffix={
                  <AimOutlined
                    style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                    onClick={() => {
                      const obj = form.getFieldValue([]);
                      if (obj.lon && obj.lat) {
                        setPoint({ lon: obj.lon, lat: obj.lat });
                        const pointNew: any = { lon: obj.lon, lat: obj.lat };
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
          <Col span={11} offset={2}>
            <Form.Item
              name="lat"
              label="纬度:"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '请输入纬度' },
                () => ({
                  validator(_, value) {
                    const reg = /(^[+]?(0|([1-9])){1,2}$)|(^[0-9]{1,2}[.]{1}[0-9]{1,9}$)/g;
                    if ((Number(value) > 0 && Number(value) < 90 && reg.test(value)) || !value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('范围为0-90度,小数位最多保留9位'));
                  },
                }),
              ]}
            >
              <Input
                maxLength={32}
                placeholder="请输入"
                autoComplete="off"
                suffix={
                  <AimOutlined
                    style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                    onClick={() => {
                      const obj = form.getFieldValue([]);
                      if (obj.lon && obj.lat) {
                        setPoint({ lon: obj.lon, lat: obj.lat });
                        const pointNew: any = { lon: obj.lon, lat: obj.lat };
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
              name="geoType"
              label="辖区范围类别:"
              getValueFromEvent={(e) => e.target.value.trim()}
            >
              <Input maxLength={20} placeholder="请输入" autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            {/* {!formData?.id && ( */}
            <Form.Item name="parentId" label="父级组织机构:">
              <TreeSelect
             fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                showSearch
                treeNodeFilterProp="title"
                treeDefaultExpandAll
                treeData={treeData}
                onChange={onChange}
                placeholder="请选择"
                allowClear
              />
            </Form.Item>
            {/* )} */}
            {/* {!!formData?.id && (
              <Form.Item name="parentName" label="父级组织机构:">
                <Input autoComplete="off" disabled />
              </Form.Item>
            )} */}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="remark" label="备注:">
              <Input.TextArea
                rows={2}
                maxLength={400}
                autoSize={{ minRows: 3, maxRows: 2 }}
                placeholder="请输入"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="geoJson" label="辖区经纬度点级:">
              <Editor
                content={formData.geoJson}
                onChange={(geoJson) => {
                  form.setFieldsValue({ geoJson });
                }}
                checkJson={true}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {isShowMap && (
        <Map
          onSubmit={(val) => {
            setPoint(val.point);
            form.setFieldsValue({ lon: val.lon, lat: val.lat });
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

export default Add;

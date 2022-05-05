import React, { useEffect, useState } from 'react';
import { Row, Col, message, TreeSelect, Form, Input, Modal, Select, Button } from 'antd';
import { getPersonList, editDeviceInfo, addDeviceInfo } from '@/services/securityResources';
import { getOrganizationrTree, getDictfindAll } from '@/services/systemManager';
// import DebounceSelect from '@/components/DebounceSelect';
import type { SelectProps } from 'antd/es/select';
import type { DataNode } from 'antd/lib/tree';

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  fetchOptions: (value: string) => Promise<any>;
  name?: string;
  debounceTimeout?: number;
}
// interface UserValue {
//   label: string;
//   value: string;
// }
export interface FormInfos {
  title: string;
  equipId: string;
  equipVisible: boolean;
  equipInfo: any; //单个数据
  cancelModal: () => void;
  heavyLoad: () => void;
}

const UpdateEquip: React.FC<FormInfos> = ({
  title,
  equipId,
  equipVisible,
  equipInfo,
  cancelModal,
  heavyLoad,
}) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [organizationId, setOrganizationId] = useState<DataNode[]>([]); //所属机构
  const [personData, setPersonData] = useState<{ label: string; value: string }[]>([]);
  const [equipType, setEquipType] = useState<{ label: string; value: string }[]>();
  const [orgT, setOrgT] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const [values, setValues] = React.useState<UserValue[]>([]);

  const initPerson = (orgid?: string) => {
    getPersonList({
      queryObject: {
        page: 0,
        size: 99999,
        ascending: false,
        organizationId: orgid || null,
        propertyName: 'sortIndex',
        posTypeList: [
          'd6697b08-8afe-47d3-8b1b-99fa39ac3555',
          'e7961c17-f52b-4893-9cd2-30fc63042b56',
          '3c1dad35-8c26-4d6a-b530-db5178a253a9',
          '3f1a1562-7d53-415e-a585-9c45f2c42400',
        ],
      },
    })
      .then((res) => {
        const data = res?.result?.page?.content;
        if (res.code === 200 && data?.length > 0) {
          for (let i = 0; i < data.length; i++) {
            data[i].label = data[i].name;
            data[i].value = data[i].id;
          }
          setPersonData(data);
        } else {
          setPersonData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err.message);
      });
  };

  //初始化
  const initFun = () => {
    // 组织表
    getOrganizationrTree({})
      .then((res) => {
        if (res.data) {
          setOrganizationId(res.data);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
    //字典库--装备类别查询
    getDictfindAll({ parentId: '0ed83001-5830-425a-a3a5-85b6691d67fd' })
      .then((res) => {
        const data = res?.result?.result;
        for (let i = 0; i < data?.length; i++) {
          data[i].label = data[i].name;
          data[i].value = data[i].id;
        }
        setEquipType(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  useEffect(() => {
    initFun();
    if (title == 'edit') {
      const data = equipInfo?.personInfoList;
      if (data.length > 0) {
        equipInfo.personIdList = data[0].id;
      }
      if (equipInfo?.organizationId) {
        setLoading(true);
        initPerson(equipInfo?.organizationId);
        setOrgT(true);
      }
      form.setFieldsValue(equipInfo);
    } else {
      setLoading(true);
      initPerson();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = (params: any) => {
    const newParams = params;
    addDeviceInfo({ ...newParams })
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
  const edit = (params: any) => {
    params.id = equipId;
    const mange = { ...equipInfo, ...params };
    delete mange.personInfoList;
    // if(!mange.personIdList) {
    //   mange.relatedPersonName = null;
    // }
    if (mange.personIdList === undefined) {
      mange.personIdList = '';
      delete mange.relatedPersonName;
    }
    editDeviceInfo({ ...mange })
      .then((res) => {
        if (res.code === 200) {
          message.success(res.message);
          cancelModal();
          heavyLoad();
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  const hideModal = async () => {
    const data = await form.validateFields();
    // if (
    //   data?.personIdList !== undefined &&
    //   data?.personIdList?.length > 0 &&
    //   data?.personIdList !== null
    // ) {
    //   for (let i = 0; i < data?.personIdList?.length; i++) {
    //     data.personIdList[i] = data.personIdList[i].value;
    //   }
    // }

    if (title == 'edit') {
      edit(data);
    } else {
      add(data);
    }
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
        title={title == 'add' ? '新增装备' : '编辑装备'}
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
                label="装备名称"
                getValueFromEvent={(e) => e.target.value.trim()}
                rules={[{ required: true, message: '请输入装备名称' }]}
              >
                <Input maxLength={20} autoComplete="off" allowClear={true} placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                label="所属组织"
                name="organizationId"
                rules={[{ required: true, message: '请选择所属组织' }]}
              >
                <TreeSelect
             fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                  showSearch
                  filterTreeNode={true}
                  treeNodeFilterProp="title"
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择"
                  allowClear
                  treeDefaultExpandAll
                  treeData={organizationId}
                  onChange={(e) => {
                    if (e) {
                      form.setFieldsValue({ personIdList: null });
                      setLoading(true);
                      setOrgT(true);
                      initPerson(String(e));
                    } else {
                      setLoading(true);
                      setOrgT(false);
                      initPerson();
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                name="type"
                label="装备类别"
                rules={[{ required: true, message: '请选择装备类别' }]}
              >
                <Select options={equipType} placeholder="请选择" />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                name="deviceId"
                label="GPSID"
                getValueFromEvent={(e) => e.target.value.trim()}
                rules={[
                  {
                    pattern: /^[A-Za-z0-9]{1,40}$/,
                    message: 'GPSID由1-40个数字或英文组成',
                  },
                ]}
              >
                <Input autoComplete="off" maxLength={40} allowClear={true} placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                name="company"
                label="品牌单位"
                getValueFromEvent={(e) => e.target.value.trim()}
              >
                <Input maxLength={40} autoComplete="off" allowClear={true} placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                name="vedioId"
                label="视频ID"
                getValueFromEvent={(e) => e.target.value.trim()}
                rules={[
                  {
                    pattern: /^[A-Za-z0-9]{1,40}$/,
                    message: '视频ID由1-40个数字或英文组成',
                  },
                ]}
              >
                <Input autoComplete="off" maxLength={40} allowClear={true} placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          {orgT && (
            <Row>
              <Col span={11}>
                <Form.Item name="personIdList" label="关联人员">
                  <Select
                    loading={loading}
                    showSearch
                    placeholder="请选择"
                    optionFilterProp="label"
                    options={personData}
                    allowClear={true}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row>
            <Col span={22}>
              <Form.Item name="remark" label="备注">
                <TextArea
                  maxLength={400}
                  autoSize={{ minRows: 3, maxRows: 2 }}
                  placeholder="请输入"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default UpdateEquip;

import React, { useEffect, useState } from 'react';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Row, Col, message, Form, Modal, Button, TreeSelect } from 'antd'; //TreeSelect,
// import TreeSelect from 'react-do-tree-select';
import {
  saveRolerInfo,
  editRolerInfo,
  getPowerTree,
  getRolerInfo,
  getRolePower,
} from '@/services/systemManager';

export interface PropsInfo {
  roleId: string;
  rolerVisble: boolean;
  rolerType: string;
  onhandler: () => void;
  loading: () => void;
}

export interface roleItem {
  checked: string;
  id: string;
  key?: string;
  name: string;
  parentId: string;
}
export interface ProjectDepartList {
  value: string;
  label: string;
}

const AddPerson: React.FC<PropsInfo> = (props: any) => {
  const { roleId, rolerVisble, rolerType, onhandler, loading } = props;

  //const [roleId] = useState<string>(props.location?.query?.roleId); //角色id
  const [powerTree, setPowerTree] = useState<ProjectDepartList[]>([]); //所属权限树
  const [roleInfo, setRoleInfo] = useState<Record<string, unknown>>({}); //角色查询数据
  const [powerIds, setPowerIds] = useState<string[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    // 查询权限表
    getPowerTree({})
      .then((res) => {
        setPowerTree(res.result.result);
      })
      .catch((err) => {
        message.error(err.message || err);
      });
    // //获取编辑角色信息
    if (rolerType == 'edit') {
      getRolerInfo({ id: roleId, page: 0, size: 1 })
        .then((res) => {
          form.setFieldsValue(res.result.detail);
          setRoleInfo(res.result.detail);
        })
        .catch((err) => {
          message.error(err.message || err);
        });
      //查询角色关联权限
      getRolePower({
        queryObject: {
          page: 0,
          size: 10000,
          roleId,
        },
      })
        .then((res) => {
          const data = res.result.page.content;
          if (data) {
            const powerInfo = data
              .map((item: any) => {
                return item.powerId;
              })
              .filter((item: string) => {
                return item.length > 20;
              });
            setPowerIds(powerInfo);
            form.setFieldsValue({ power: powerInfo });
          }
        })
        .catch((err) => {
          message.error(err.message || err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //添加
  const add = (params: any) => {
    const update = form.getFieldsValue(true);
    const data = { ...params };
    data.powerIdList = update.power;
    saveRolerInfo(data)
      .then((res) => {
        if (res.code === 200) {
          message.success('新增成功');
          loading();
          onhandler();
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };

  // 编辑
  const edit = (params: any) => {
    const update = form.getFieldsValue(true);
    const data = { ...params, id: roleId };
    data.powerIdList = update.power;
    const merge = { ...roleInfo, ...data };
    editRolerInfo({ data: merge })
      .then((res) => {
        if (res.code === 200) {
          message.success('编辑成功');
          loading();
          onhandler();
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };

  const onOk = () => {
    form.validateFields().then((val: any) => {
      if (rolerType == 'edit') {
        //编辑
        edit(val);
      } else {
        //新增
        add(val);
      }
    });
  };
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            onhandler();
          }}
        >
          取消
        </Button>
        <Button type="primary" onClick={() => onOk()}>
          保存
        </Button>
      </>
    );
  };
  return (
    <Modal
      title={rolerType == 'add' ? '新增角色' : '编辑角色'}
      visible={rolerVisble}
      centered={true}
      width={1000}
      onCancel={onhandler}
      footer={renderFooter()}
      destroyOnClose={true}
      maskClosable={false}
    >
      <Form layout="horizontal" labelCol={{ style: { width: 140 } }} requiredMark form={form}>
        <Row>
          <Col span={11}>
            <ProFormText
              name="name"
              label="角色名称"
              fieldProps={{ maxLength: 20, autoComplete: 'off' }}
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[{ required: true, message: '请输入角色名称' }]}
            />
          </Col>
          <Col span={11}>
            <Form.Item
              label="拥有权限"
              name="power"
              rules={[{ required: true, message: '请选择拥有权限' }]}
            >
              {powerTree.length > 0 && (
                <TreeSelect
             fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                  showSearch
                  value={powerIds}
                  placeholder="请选择"
                  treeCheckable={true}
                  maxTagCount={2}
                  allowClear
                  treeDefaultExpandAll
                  filterTreeNode={true}
                  treeCheckStrictly={true}
                  treeNodeFilterProp="title"
                  showCheckedStrategy={TreeSelect.SHOW_ALL}
                  treeData={powerTree}
                  onChange={(value: any) => {
                    const ids = value.map((val: any) => {
                      return val.value;
                    });
                    setPowerIds(ids);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={11}>
            <ProFormText
              name="code"
              label="编码"
              fieldProps={{ maxLength: 36, autoComplete: 'off' }}
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '请输入编码' },
                {
                  pattern: /^[A-Za-z0-9]{1,36}$/,
                  message: '编码由1-36个数字或英文组成',
                },
              ]}
            />
          </Col>
          <Col span={22}>
            <ProFormTextArea
              name="remark"
              label="备注"
              fieldProps={{ maxLength: 400, autoSize: { minRows: 3, maxRows: 2 } }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default AddPerson;

import React, { useEffect, useState } from 'react';
//
import { Modal, Form, Row, Col, Input, Select, Button, message, TreeSelect } from 'antd';
//
import { addLayer, getLayerTree } from '../../../../services/Layer/index';
import Editor from '@/components/wangEditor/editor';
import { isJSON } from '@/utils/utilsJS';
import { useGetDictionaryByCode } from '@/hooks/useAllOrg';
export interface Props {
  show: boolean;
  id?: string;
  onConfirm: any;
  onCancel: any;
  item: any;
  updateType?: string;
  active?: string;
}

export type TTpye = {
  value: string;
  label: string;
}[];

const AddLayer: React.FC<Props> = (props) => {
  // const [typeList, setTypeList] = useState<TTpye>();
  const [parentList, setParentList] = useState<any[]>([]);
  const typeObj = useGetDictionaryByCode('5bc85734-0e00-4c0e-8aed-67cbc8cd39e4'); // layerType
  const { show, onCancel, onConfirm, item, updateType } = props;
  const [form] = Form.useForm();

  // function setList(res: any, cb: any) {
  //   const list = res.result.page.content;
  //   let l: any[] = list?.map((v: any) => {
  //     return {
  //       label: v.name,
  //       value: v.id,
  //     };
  //   });
  //   if (item.id) {
  //     preDelete(item.id).then((resu) => {
  //       if (resu.result.page.content) {
  //         l = l.filter((v) => {
  //           if (resu.result.page.content.find((cv: any) => cv.id == v.value)) {
  //             return false;
  //           } else {
  //             return true;
  //           }
  //         });
  //       }
  //       cb(l);
  //     });
  //   } else {
  //     cb(l);
  //   }
  // }
  async function submit() {
    const result = await form.validateFields();
    if (!isJSON(result.entity)) {
      message.error('json字符串格式不正确');
      return;
    }
    addLayer({ data: { ...result, id: item.id, sortIndex: item.sortIndex } })
      .then((res) => {
        if (res.code == 200) {
          message.success('操作成功');
          onConfirm();
          form.resetFields();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  }

  function getTrueParent(list: any[]) {
    for (let index = 0; index < list.length; index++) {
      const v = list[index];
      if (v.key == item.id) {
        list.splice(index, 1);
      }
      if (v.children) {
        getTrueParent(v.children);
      }
    }
    return list;
  }

  useEffect(() => {
    // 父级图层
    getLayerTree().then((res) => {
      // console.log()
      setParentList(getTrueParent(res.result.result));
    });
    form.setFieldsValue(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            onCancel();
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            submit();
          }}
        >
          保存
        </Button>
      </>
    );
  };
  const { Option } = Select;
  return (
    <Modal
      width={1000}
      bodyStyle={{ padding: '40px 0' }}
      destroyOnClose
      title={updateType === 'add' ? '新增图层' : '编辑图层'}
      maskClosable={false}
      visible={show}
      footer={renderFooter()}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form form={form} style={{ paddingRight: 60 }} labelCol={{ style: { width: 140 } }}>
        <Row>
          <Col span={11}>
            <Form.Item
              name="name"
              label="图层名称"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input maxLength={100} placeholder="请输入" autoComplete="off" allowClear />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item name="parentId" label="父级图层">
              {/* <Select
                allowClear
                placeholder={'请选择'}
                onSelect={(key: string) => {
                  form.setFieldsValue({
                    parentId: key,
                  });
                }}
              >
                {parentList
                  .filter((v) => v.key !== item.id)
                  ?.map((item1: any) => (
                    <Option key={item1.key} value={item1.key}>
                      {item1.title}
                    </Option>
                  ))}
              </Select> */}
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
                treeData={parentList}
                // loading={orgObj.loading}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="layerType"
              label="图层类型"
              rules={[{ required: true, message: '请输入图层类型' }]}
            >
              <Select
                allowClear
                placeholder={'请选择'}
                onSelect={(key: string) => {
                  form.setFieldsValue({
                    layerType: key,
                  });
                }}
                loading={typeObj.loading}
              >
                {typeObj?.list?.map((v: any) => {
                  return (
                    <Option key={v.id} value={v.id}>
                      {v.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              name="entity"
              label="配置详细json"
              rules={[
                { required: true, message: '请输入配置详细json' },
                { min: 1, max: 999999 },
              ]}
            >
              <Editor
                content={item.entity}
                onChange={(entity) => {
                  form.setFieldsValue({ entity });
                }}
                checkJson={true}
              />
              {/* <Input maxLength={200} placeholder="请输入" autoComplete="off" /> */}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
AddLayer.defaultProps = {
  id: '',
};
export default AddLayer;

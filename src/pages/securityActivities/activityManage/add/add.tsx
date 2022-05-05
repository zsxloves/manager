import React, { useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Props } from '@/pages/aresource/layer/components/AddLayer';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  message,
  DatePicker,
  TreeSelect,
} from 'antd';
import { chinese, Phone } from '@/utils/utilsJS';
import useGetOrg from '@/hooks/useAllOrg';
import useGetScene from '@/hooks/useGetScene';
import moment from 'moment';
import { addActive } from '../../../../services/activeManager/index';
import './add.less';
const AddActive: React.FC<Props> = (props) => {
  const sceneObj = useGetScene();
  const orgObj = useGetOrg();
  const { show, onCancel, onConfirm, item, active } = props;
  const [form] = Form.useForm();

  async function submit() {
    const result = await form.validateFields();
    result.gymIds = [result.gymIds];
    // hh:mm:ss
    result.startTime = moment(result.startTime).format('YYYY-MM-DD hh:mm:ss');
    result.endTime = moment(result.endTime).format('YYYY-MM-DD hh:mm:ss');
    if (new Date(result.endtime) > new Date(result.starttime)) {
      message.error('开始时间需早于结束时间');
      return;
    }
    addActive({ data: { ...result, id: item.id, sortIndex: item.sortIndex } })
      .then(() => {
        message.success('操作成功');
        onConfirm();
        form.resetFields();
      })
      .catch((res) => {
        message.error(res.message);
      });
  }
  useEffect(() => {
    if (Object.keys(item).length > 0) {
      item.startTime = moment(item.startTime);
      item.endTime = moment(item.endTime);
      if (item.arGymVOS.length > 0) {
        item.gymIds = item.arGymVOS[0].id;
      }
    }

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
  function disableStart(current: any) {
    const endTime = form.getFieldsValue(['endTime']).endTime;
    if (endTime) {
      return !(current.unix() < endTime.unix());
    } else {
      return false;
    }
  }
  function disableEnd(current: any) {
    const startTime = form.getFieldsValue(['startTime']).startTime;
    if (startTime) {
      return !(current.unix() > startTime.unix());
    } else {
      return false;
    }
  }
  return (
    <Modal
      width={1000}
      bodyStyle={{ padding: '40px 0' }}
      destroyOnClose
      title={active === 'add' ? '活动新增' : '活动编辑'}
      maskClosable={false}
      visible={show}
      footer={renderFooter()}
      onCancel={() => {
        onCancel();
      }}
      className="active-add"
    >
      <Form
        form={form}
        style={{ paddingRight: 60 }}
        labelCol={{ style: { width: 140 } }}
        autoComplete="off"
      >
        <Row>
          <Col span={11}>
            <Form.Item
              name="name"
              label="活动名称"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input maxLength={40} placeholder="请输入" autoComplete="off" allowClear={true} />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="startTime"
              label="开始时间"
              rules={[{ required: true, message: '请选择开始时间' }]}
            >
              <DatePicker
                showTime
                placeholder={'请选择'}
                format="YYYY-MM-DD hh:mm:ss"
                size="middle"
                mode="date"
                disabledDate={disableStart}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="endTime"
              label="结束时间"
              rules={[{ required: true, message: '请选择结束时间' }]}
            >
              <DatePicker
                showTime
                placeholder={'请选择'}
                format="YYYY-MM-DD hh:mm:ss"
                size="middle"
                mode="date"
                disabledDate={disableEnd}
              />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="contractor"
              label="承办单位"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '请输入承办单位' },
                {
                  min: 1,
                  max: 40,
                },
              ]}
            >
              <Input placeholder="请输入" maxLength={40} autoComplete="off" allowClear={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="contact"
              label="活动联系人"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '请输入活动联系人' },
                {
                  pattern: chinese,
                  message: '仅支持中文',
                },
              ]}
            >
              <Input placeholder="请输入" maxLength={40} autoComplete="off" allowClear={true} />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="contactPhone"
              label="联系方式"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '请输入联系方式' },
                {
                  pattern: Phone,
                  message: '联系方式格式不正确',
                },
              ]}
            >
              <Input placeholder="请输入" maxLength={11} autoComplete="off" allowClear={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="department"
              label="所属组织"
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
                treeData={orgObj.list}
                loading={orgObj.loading}
              />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="gymIds"
              label="关联场景"
              rules={[{ required: true, message: '请选择关联场景' }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                loading={sceneObj.loading}
                placeholder="请选择"
                allowClear={true}
              >
                {sceneObj.list.map((v: any) => {
                  return (
                    <Option value={v.id} key={v.id} label={v.name}>
                      {v.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddActive;

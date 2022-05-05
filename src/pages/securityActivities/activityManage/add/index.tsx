import { history, useLocation } from 'umi';
import { useEffect, useState, useRef } from 'react';
import ProForm, { ProFormText, ProFormSelect, ProFormDatePicker } from '@ant-design/pro-form';
import { Button, Row, Col, message, Form, TreeSelect } from 'antd';
import moment from 'moment';
import styles from './index.less';
import useGetOrg from '@/hooks/useAllOrg';

import {
  getInfoById,
  getTypeList,
  getContractorList,
  addActive,
} from '../../../../services/activeManager/index';
import { PageContainer } from '@ant-design/pro-layout';

type TTpye = {
  value: string;
  label: string;
}[];

function ActiveAdd() {
  const [item, setItem] = useState<any>({});
  const [typeList, setTypeList] = useState<TTpye>();
  const [conList, setConlist] = useState<TTpye>();
  const formRef: any = useRef(null);
  const route: any = useLocation<any>();
  const { id, detail } = route?.query;
  const orgObj = useGetOrg();

  function setList(res: any, cb: any) {
    const list = res.result.page.content;
    cb(
      list.map((v: any) => {
        return {
          label: v.name,
          value: v.id,
        };
      }),
    );
  }
  function submit() {
    formRef.current.validateFields().then((val: any) => {
      const data = {
        ...val,
        startTime: moment(val.startTime).format('YYYY-MM-DD hh:mm:ss'),
        endTime: moment(val.endTime).format('YYYY-MM-DD hh:mm:ss'),
        // contractor: val.contractor.join(','),
      };
      if (item && item.id) {
        data.id = item.id;
      }
      addActive({
        data,
      }).then((res) => {
        if (res.code === 200) {
          message.success('操作成功');
          setTimeout(() => {
            history.goBack();
          }, 1500);
        } else {
          message.error(res.message);
        }
      });
    });
  }
  useEffect(() => {
    // 活动类型
    getTypeList().then((res: any) => {
      setList(res, setTypeList);
    });
    // 关联场馆
    getContractorList().then((res) => {
      setList(res, setConlist);
    });
    if (id) {
      // 获取当前活动详情
      getInfoById(id).then((res) => {
        const detailC = res.result.detail;
        detailC.gymIds = detailC.arGymVOS?.map((v: any) => v?.id);
        formRef.current.setFieldsValue(detailC);
        setItem(res.result.detail);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProForm
        formRef={formRef}
        className={styles.PageContainer}
        labelAlign="right"
        layout="horizontal"
        labelCol={{ style: { width: 140 } }}
        size="large"
        submitter={{
          render: () => {
            return [
              <Button
                key="cancel"
                onClick={() => {
                  history.goBack();
                }}
              >
                返回
              </Button>,
              <Button
                key="next1"
                type="primary"
                onClick={() => {
                  submit();
                }}
                disabled={detail}
              >
                提交
              </Button>,
            ];
          },
        }}
      >
        <Row>
          <Form.Item className={styles.headerText}>{detail ? '活动详情' : '新增活动'}</Form.Item>
        </Row>
        <Row>
          <Col span={23}>
            <Row>
              <Col span={11}>
                <ProFormText
                  name="name"
                  label="活动名称"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  disabled={detail}
                  rules={[
                    { required: true, message: '请输入活动名称' },
                    {
                      min: 1,
                      max: 40,
                    },
                  ]}
                />
              </Col>
              <Col span={11}>
                <ProFormDatePicker
                  width="xl"
                  name="startTime"
                  label="开始时间"
                  rules={[{ required: true, message: '请选择开始时间' }]}
                  getValueFromEvent={(e) => e}
                  disabled={detail}
                  fieldProps={{ format: 'YYYY-MM-DD' }}
                />
              </Col>
              <Col span={11}>
                <ProFormDatePicker
                  width="xl"
                  name="endTime"
                  label="结束时间"
                  rules={[{ required: true, message: '请选择结束时间' }]}
                  getValueFromEvent={(e) => e}
                  disabled={detail}
                  fieldProps={{ format: 'YYYY-MM-DD' }}
                />
              </Col>
              <Col span={11}>
                <ProFormText
                  name="contractor"
                  label="承办单位"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  disabled={detail}
                  rules={[
                    { required: true, message: '请输入承办单位' },
                    {
                      min: 1,
                      max: 40,
                    },
                  ]}
                />
              </Col>
              <Col span={11}>
                <ProFormSelect
                  options={typeList}
                  name="type"
                  label="活动类型"
                  getValueFromEvent={(e) => {
                    return e;
                  }}
                  disabled={detail}
                  rules={[{ required: true, message: '请选择活动类型' }]}
                />
              </Col>
              <Col span={11}>
                <ProFormText
                  name="contact"
                  label="活动联系人"
                  disabled={detail}
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    { required: true, message: '请输入活动联系人' },
                    {
                      pattern: /^.{1,40}$/,
                      message: '活动联系人由1-40个字符构成',
                    },
                  ]}
                />
              </Col>
              <Col span={11}>
                <Form.Item label="所属组织" name="department" rules={[{ required: true }]}>
                  <TreeSelect
             fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                    showSearch
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
              <Col span={11}>
                <ProFormSelect
                  options={conList}
                  mode="multiple"
                  name="gymIds"
                  label="关联场馆"
                  disabled={detail}
                  rules={[{ required: true, message: '请选择关联场馆' }]}
                />

                {/* <Form.Item label="关联场馆" name="contractor" rules={[{ required: true }]}>
                  <TreeSelect
             fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                    showSearch
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择"
                    allowClear
                    treeDefaultExpandAll
                    treeData={orgObj.list}
                    loading={orgObj.loading}
                  />
                </Form.Item> */}
              </Col>
            </Row>
          </Col>
        </Row>
      </ProForm>
    </PageContainer>
  );
}

export default ActiveAdd;

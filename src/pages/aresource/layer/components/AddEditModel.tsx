import { history, useLocation } from 'umi';
import { useEffect, useState, useRef } from 'react';
import ProForm, { ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Row, Col, message, Form } from 'antd';
import styles from '../../../securityActivities/activityManage/add/index.less';

import {
  getInfoById,
  getTypeList,
  getParentList,
  addLayer,
} from '../../../../services/Layer/index';

type TTpye = {
  value: string;
  label: string;
}[];

function Layer() {
  const [item, setItem] = useState<any>({});
  const [typeList, setTypeList] = useState<TTpye>();
  const [parentList, setParentList] = useState<TTpye>();
  // const [conList, setConlist] = useState<TTpye>();
  const formRef: any = useRef(null);
  const route: any = useLocation<any>();
  const { id, detail } = route?.query;

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
      };
      if (item && item.id) {
        data.id = item.id;
      }
      data.sortIndex = item.sortIndex;
      addLayer({
        data,
      }).then((res) => {
        if (res.code == 200) {
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
    // 图层类型
    getTypeList().then((res: any) => {
      setList(res, setTypeList);
    });
    // 父级图层
    getParentList().then((res) => {
      setList(res, setParentList);
    });
    if (id) {
      // 获取当前活动详情
      getInfoById(id).then((res) => {
        const detailC = res.result.detail;
        formRef.current.setFieldsValue(detailC);
        setItem(detailC);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
        <Form.Item className={styles.headerText}>{detail ? '图层详情' : '编辑图层'}</Form.Item>
      </Row>
      <Row>
        <Col span={23} offset={1}>
          <Row>
            <Col span={11}>
              <ProFormText
                name="code"
                label="代码"
                disabled={!!detail}
                getValueFromEvent={(e) => e.target.value.trim()}
                fieldProps={{
                  autoComplete: 'off',
                  defaultValue: item.code,
                }}
                rules={[
                  { required: true, message: '请输入代码' },
                  {
                    pattern: /^[0-9A-Za-z]{1,40}$/,
                    message: '字母、数字组成的1-40位字符',
                  },
                ]}
              />
            </Col>
            <Col span={11} offset={1}>
              <ProFormText
                name="name"
                label="图层名称"
                getValueFromEvent={(e) => e.target.value.trim()}
                disabled={detail}
                rules={[
                  { required: true, message: '请输入图层名称' },
                  {
                    min: 1,
                    max: 40,
                  },
                ]}
              />
            </Col>
            <Col span={11}>
              <ProFormSelect
                options={parentList}
                name="parentId"
                label="父级图层"
                disabled={detail}
              />
            </Col>
            <Col span={11} offset={1}>
              <ProFormSelect
                options={typeList}
                name="layerType"
                label="图层类型"
                disabled={detail}
                rules={[{ required: true, message: '请选择图层类型' }]}
              />
            </Col>
            <Col span={24}>
              <ProFormTextArea
                wrapperCol={{ span: 23 }}
                name="entity"
                label="配置详细json"
                disabled={detail}
                fieldProps={{ maxLength: 200, autoSize: { minRows: 3, maxRows: 20 } }}
                rules={[
                  {
                    min: 1,
                    max: 9999,
                  },
                  { required: true },
                ]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </ProForm>
  );
}

export default Layer;

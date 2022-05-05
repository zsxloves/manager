import React, { useEffect, useState, useRef } from 'react';
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import { Button, Row, Col, message, Modal } from 'antd';
import { getState } from '@/services/match';
import { getTicketUpdate } from '@/services/ticket';
import { formatDate, onlyNumber } from '@/utils/utilsJS';
import styles from './index.less';
declare interface Props {
  edit?: any;
  showAdd: boolean;
  change: () => void;
  reload: () => void;
}
const AddUnit: React.FC<Props> = (props: any) => {
  const { showAdd, change, edit, reload } = props;
  const formRef: any = useRef(null);
  const [stateList, setstateList] = useState<
    {
      value: string;
      label: string;
    }[]
  >(); //上报区域
  const [flag, setFlag] = useState<boolean>(showAdd); //弹框展示隐藏
  const [editId] = useState<string>(edit?.id);

  //判断新增删除
  const isEdit = !!edit;

  const fil = (children: any) => {
    if (children && Array.isArray(children)) {
      children.filter((info: any) => {
        info.value = info.key;
        if (info.children && Array.isArray(info.children)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          fil(info.children);
        }
      });
    }
  };

  const initFunc = () => {
    // 获取上报区域
    const queryObject = {
      page: 0,
      size: 10000000,
      parentId: '2de698d1-1882-47c6-8cf4-7705bed9d85f',
    };
    getState({ queryObject })
      .then((res) => {
        const data = res.result.page.content;
        const de =
          data &&
          data.map((item: Record<string, unknown>) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
        setstateList(de);
      })
      .catch((err) => {
        message.error(err || err.message);
      });
  };

  useEffect(() => {
    initFunc();
    if (isEdit) {
      // queryRW(editId);
      //判断是否为编辑 是 则通过userid请求单个数据 放入对象中 通过initialValues设置初始值来首次渲染
      console.log(edit);
      formRef.current.setFieldsValue(edit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveFun = (params: any) => {
    if (editId) {
      params.id = editId;
      const mange = { ...edit, ...params };
      if (mange?.reportTime) {
        mange.reportTime = formatDate(mange?.reportTime);
      } else {
        mange.reportTime = '';
      }
      console.log(mange, '编辑');
      getTicketUpdate({ data: mange })
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
      if (mange?.reportTime) {
        mange.reportTime = formatDate(mange?.reportTime);
      } else {
        mange.reportTime = '';
      }

      console.log(mange, '新增');
      getTicketUpdate({ data: mange })
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
              console.log(val);
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
      title={editId ? '编辑票务' : '新增票务'}
    >
      <ProForm
        formRef={formRef}
        layout="horizontal" //label和输入框一行
        labelCol={{ style: { width: 140 } }}
        submitter={false}
      >
        <Row>
          <Col span={11}>
            <ProFormText
              name="num"
              label="已售门票"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 9, autoComplete: 'off' }}
              rules={[
                {
                  pattern: onlyNumber,
                  message: '已售门票为正整数',
                },
              ]}
            />
          </Col>
          <Col span={11}>
            <ProFormText
              name="addNum"
              label="入园人数"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 9, autoComplete: 'off' }}
              rules={[
                {
                  pattern: onlyNumber,
                  message: '入园人数为正整数',
                },
              ]}
            />
          </Col>
          {/* 上报区域 */}
          <Col span={11}>
            <ProFormSelect showSearch name="reportArea" label="上报区域" options={stateList} />
          </Col>
          {/* 上报时间 */}
          <Col span={11}>
            <ProFormDateTimePicker name="reportTime" label="上报时间" />
          </Col>
          {/* 备注 */}
          <Col span={22}>
            <ProFormTextArea
              wrapperCol={{ span: 23 }}
              name="remark"
              label="备注"
              fieldProps={{ maxLength: 400, autoSize: { minRows: 3, maxRows: 2 } }}
            />
          </Col>
        </Row>
      </ProForm>
    </Modal>
  );
};
export default AddUnit;

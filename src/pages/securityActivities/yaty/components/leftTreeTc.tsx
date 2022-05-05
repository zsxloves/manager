import React, { useEffect, useRef, useState } from 'react';
import { useImperativeHandle } from 'react';
import { Modal, Button, message } from 'antd';
import style from './style.less';
import ProForm, { ProFormText, ProFormDatePicker, ProFormSelect } from '@ant-design/pro-form';
import { addYa, updateYa, getPageData } from './../service';
import type { ProFormInstance } from '@ant-design/pro-form';
interface Props {
  title: string;
  yaId: string;
  cancelModel: Function;
  obj: object;
  zdArr: any;
}
interface RefTypes {
  setFormValue: Function;
  setModelShow: Function;
}
const LeftTreeTc = React.forwardRef<RefTypes, Props>((newProps, ref) => {
  // const fors = {
  //     labelCol: { span: 4 },
  //     wrapperCol: { span: 14 },
  //   }
  const formRefs = useRef<ProFormInstance>();
  const [newOptions, setNewOptions] = useState<any>([]);
  const setFormValue = (obj: any) => {
    formRefs?.current?.setFieldsValue(obj);
  };
  const [showLeftTc, setShowLeftTc] = useState<boolean>(false);
  const setModelShow = () => {
    setShowLeftTc(true);
  };
  const cancelModal = () => {
    setShowLeftTc(false);
  };
  useEffect(() => {
    const newObj: any = newProps.obj;
    newObj.startTime = newObj?.startTime?.substring(0, 10);
    setFormValue(newObj);
  }, [newProps.obj]);
  //将子组件的方法 暴露给父组件
  useImperativeHandle(ref, () => ({
    setFormValue,
    setModelShow,
  }));
  useEffect(() => {
    const param = {
      queryObject: {
        page: 0,
        size: 9999,
      },
    };
    getPageData(param).then((res: any) => {
      const arr = res.result.page.content.map((item: any) => {
        const paramNow = {
          value: item.id,
          label: item.name,
        };
        return paramNow;
      });
      setNewOptions(arr);
    });
  }, []);
  return (
    <>
      <div>
        {showLeftTc && (
          <Modal
            title={newProps.title}
            width={1000}
            visible={true}
            onCancel={() => {
              cancelModal();
            }}
            footer={null}
          >
            <ProForm
              formRef={formRefs}
              className={style.yatyModel}
              layout="horizontal"
              labelCol={{ style: { width: 140 } }}
              wrapperCol={{ style: { width: 200 } }}
              onFinish={async (values) => {
                const params = {
                  address: values?.address || '',
                  head: values?.head || '',
                  unit: values?.unit || '',
                  type: values?.type || '',
                  task: values?.task || '',
                  views: values?.views || '',
                  startTime: values?.startTime + ' 00:00:00' || '',
                  id: values?.id || '',
                  activityId: values?.activityId || '',
                };
                if (newProps.yaId) {
                  params.id = newProps.yaId;
                  updateYa(params).then((res: any) => {
                    if (res.success) {
                      message.success(res.message);
                    }
                    cancelModal();
                    newProps.cancelModel();
                  });
                } else {
                  addYa(params).then((res: any) => {
                    if (res.success) {
                      message.success(res.message);
                    }
                    cancelModal();
                    newProps.cancelModel();
                  });
                }
              }}
              submitter={{
                // 配置按钮的属性
                resetButtonProps: {
                  style: {
                    // 隐藏重置按钮
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  style: {
                    // 隐藏重置按钮
                    display: 'none',
                  },
                },
                render: (props, doms) => {
                  return [
                    ...doms,
                    <Button
                      htmlType="button"
                      onClick={() => {
                        cancelModal();
                      }}
                      key="cancel"
                    >
                      取消
                    </Button>,
                    <Button
                      type="primary"
                      htmlType="button"
                      onClick={() => props.form?.submit?.()}
                      key="sure"
                    >
                      保存
                    </Button>,
                  ];
                },
              }}
            >
              <ProForm.Group>
                <ProFormText
                  name="task"
                  width="md"
                  label="任务"
                  placeholder="请输入任务"
                  rules={[
                    { required: true, message: '请输入任务' },
                    { min: 1, max: 40 },
                  ]}
                />
                <ProFormSelect
                  options={newProps.zdArr}
                  name="type"
                  label="类型"
                  width="md"
                  rules={[{ required: true, message: '请选择类型' }]}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormSelect
                  options={newOptions}
                  name="activityId"
                  label="活动"
                  width="md"
                  rules={[{ required: true, message: '请选择活动' }]}
                />
                <ProFormText
                  width="md"
                  name="address"
                  label="运行地点"
                  placeholder="请输入运行地点"
                  rules={[{ min: 1, max: 40 }]}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText
                  width="md"
                  name="unit"
                  label="责任单位"
                  placeholder="请输入责任单位"
                  rules={[{ min: 1, max: 40 }]}
                />
                <ProFormText width="md" name="head" label="责任人" placeholder="请输入责任人" />
                {/*  name="date" */}
              </ProForm.Group>
              <ProForm.Group>
                <ProFormDatePicker
                  name="startTime"
                  label="选择时间"
                  placeholder="请选择时间"
                  rules={[{ required: true, message: '请选择时间' }]}
                  width="md"
                />
              </ProForm.Group>
              <ProFormText
                name="view"
                label="视域JSON"
                placeholder="请输入视域JSON"
                rules={[{ min: 1, max: 400 }]}
              />
            </ProForm>
          </Modal>
        )}
      </div>
    </>
  );
});
export default LeftTreeTc;

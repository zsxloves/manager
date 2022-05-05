import React, { useEffect, useState, useRef } from 'react';
import { history } from 'umi';
import ProForm, { ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Row, Col, message, TreeSelect, Form } from 'antd';
import type { DataNode } from 'antd/lib/tree';
import { PageContainer } from '@ant-design/pro-layout';
import UploadImage from '@/components/uploadImage/index';
import {
  getUserInfo,
  saveUserInfo,
  editUserInfo,
  getRolerList,
  getOrganizationrTree,
} from '@/services/systemManager';
import { uploadFile, getAttachmentList } from '@/services/systemManager';
import md5 from 'js-md5';
import styles from './index.less';

const AddPerson: React.FC = (props: any) => {
  const formRef: any = useRef(null);
  const imgId: any = useRef(null);
  const [form] = Form.useForm();
  const [userId] = useState<string>(props.location?.query?.userId);
  const [loading, setLoading] = useState<boolean>(false); //loading
  const [userInfo, setUserInfo] = useState<Record<string, unknown>>({}); //用户查询数据
  const [organizationId, setOrganizationId] = useState<DataNode[]>([]); //所属机构
  const [fileList, setFileList] = useState<any[]>([]); //图标
  // const [fileObj, setFileObj] = useState<any>({});
  const [rolerList, setRolerList] = useState<
    {
      value: string;
      label: string;
    }[]
  >(); //所属角色

  //判断新增删除
  const isEdit = !!props.location?.query?.userId;

  function preSubmitUpload(file: any) {
    setLoading(true);
    if (!file) {
      imgId.current = '';
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append('file', file?.originFileObj);
    formData.append('name', file?.name);
    uploadFile(formData)
      .then((res) => res.json())
      .then((res: any) => {
        if (res.code === 200) {
          imgId.current = res.data.id;
          form.setFieldsValue({ file: res.data?.fileUrl });
          setLoading(false);
        } else {
          message.error(res.message);
          setLoading(false);
        }
      });
  }

  const getAttachId = (data: any) => {
    getAttachmentList({ id: data.avatarId })
      .then((res) => {
        const info = res.data.rows[0];
        if (data.avatarId && info.minioFileUrl) {
          setFileList([{ url: info.minioFileUrl }]);
        }
        data.file = info.minioFileUrl;
        formRef.current.setFieldsValue({ ...data, password: null });
        setUserInfo(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  //初始化
  const initFun = () => {
    //获取角色表
    const queryObject = { page: 0, size: 10000000 };
    getRolerList({ queryObject }).then((res) => {
      const data = res.result.page.content;
      const de =
        data &&
        data.map((item: Record<string, unknown>) => {
          return {
            ...item,
            value: item.id,
            label: item.name,
          };
        });
      setRolerList(de);
    });
    // 组织表
    getOrganizationrTree({}).then((res) => {
      if (res.data) {
        setOrganizationId(res.data);
      }
    });
  };

  useEffect(() => {
    initFun();
    if (isEdit) {
      //判断是否为编辑 是 则通过userid请求单个数据 放入对象中 通过initialValues设置初始值来首次渲染
      getUserInfo({ id: userId, page: 0, size: 1 })
        .then((res) => {
          const info = res.result.detail;
          getAttachId(info);
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = (params: any) => {
    const newParams = params;
    if (!newParams?.password) params.password = md5('111111');
    saveUserInfo({
      ...newParams,
      avatarId: imgId.current ? imgId.current : null,
    })
      .then((res) => {
        if (res.code === 200) {
          message.success(res.message);
          setUserInfo({});
          setRolerList([]);
          history.push(
            `/systemManager/personManagement?page=${
              parseInt(props.location?.query?.page) + 1
            }&size=${props.location?.query?.size}`,
          );
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  const edit = (params: any) => {
    params.id = userId;
    const mange = {
      ...userInfo,
      ...params,
      avatarId: imgId.current ? imgId.current : null,
    };
    editUserInfo({ data: mange })
      .then((res) => {
        if (res.code === 200) {
          message.success(res.message);
          setUserInfo({});
          setRolerList([]);
          history.push(
            `/systemManager/personManagement?page=${
              parseInt(props.location?.query?.page) + 1
            }&size=${props.location?.query?.size}`,
          );
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  // 取消
  const cancelFun = (): void => {
    history.push(
      `/systemManager/personManagement?page=${parseInt(props.location?.query?.page) + 1}&size=${
        props.location?.query?.size
      }`,
    );
  };

  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProForm
        formRef={formRef}
        className={styles.PageContainer}
        layout="horizontal"
        colon={true}
        labelCol={{ style: { width: 140 } }}
        submitter={{
          render: () => {
            return [
              <Button key="cancel" onClick={() => cancelFun()}>
                取消
              </Button>,
              <Button
                key="next1"
                type="primary"
                loading={loading}
                onClick={() => {
                  formRef.current.validateFields().then((val: any) => {
                    const params = { ...val };
                    if (val.password) {
                      params.password = md5(val.password);
                    }

                    if (isEdit) {
                      edit(params);
                    } else {
                      add(params);
                    }
                  });
                }}
              >
                保存
              </Button>,
            ];
          },
        }}
      >
        <Row>
          <Form.Item className={styles.headerText}>{userId ? '编辑用户' : '新增用户'}</Form.Item>
        </Row>
        <Row>
          <Col span={23} offset={1}>
            <Row>
              <Col span={7}>
                <ProFormText
                  name="name"
                  label="用户名称"
                  disabled={!!userId}
                  getValueFromEvent={(e: { target: { value: string } }) => e.target.value.trim()}
                  fieldProps={{
                    autoComplete: 'off',
                    maxLength: 20,
                  }}
                  rules={[{ required: true, message: '请输入用户名称' }]}
                />
              </Col>
              <Col span={7}>
                <ProFormText.Password
                  name="password"
                  label="登录密码"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  placeholder={userId ? '未输入则使用旧密码' : '未输入则默认登录密码为：111111'}
                  key={Math.random()}
                  fieldProps={{
                    maxLength: 20,
                    autoComplete: 'new-password',
                    onBlur: () => {
                      return false;
                    },
                  }}
                  rules={[
                    // {
                    //   required: userId ? false : true,
                    //   message: '请输入登录密码',
                    // },
                    {
                      pattern:
                        /^[0-9A-Za-z`~!@#$^&%_+*()=|{}':;',\\.<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？-]{1,20}$/,
                      message: '登录密码由英文、数字或特殊符号组成的1-20位字符',
                    },
                  ]}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="mobilePhone"
                  label="手机号"
                  fieldProps={{ maxLength: 11 }}
                  getValueFromEvent={(e: { target: { value: string } }) => e.target.value.trim()}
                  rules={[
                    { required: true, message: '请输入手机号' },
                    {
                      // pattern: Phone,
                      pattern:
                        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
                      message: '请输入正确的手机号',
                    },
                  ]}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="idCardCode"
                  label="身份证号"
                  fieldProps={{ maxLength: 18 }}
                  getValueFromEvent={(e: { target: { value: string } }) => e.target.value.trim()}
                  rules={[
                    {
                      pattern:
                        /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
                      message: '身份证格式不正确',
                    },
                  ]}
                />
              </Col>
              <Col span={7}>
                <ProFormSelect
                  name="enable"
                  label="状态"
                  fieldProps={{
                    showSearch: true,
                    // filterTreeNode: true,
                    // treeNodeFilterProp: "title"
                  }}
                  options={[
                    {
                      value: '0',
                      label: '禁用',
                    },
                    {
                      value: '1',
                      label: '启用',
                    },
                  ]}
                  rules={[{ required: true, message: '请选择状态' }]}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="code"
                  label="编码"
                  fieldProps={{ maxLength: 36 }}
                  getValueFromEvent={(e: { target: { value: string } }) => e.target.value.trim()}
                  rules={[
                    { required: true, message: '请输入编码' },
                    {
                      pattern: /^[A-Za-z0-9]{1,36}$/,
                      message: '编码由1-36个英文或数字构成',
                    },
                  ]}
                />
              </Col>
              <Col span={7}>
                <ProFormSelect
                  options={rolerList}
                  name="roleId"
                  label="所属角色"
                  rules={[{ required: true, message: '请选择所属角色' }]}
                  fieldProps={{
                    showSearch: true,
                    // filterTreeNode: true,
                    // treeNodeFilterProp: "title"
                  }}
                />
              </Col>
              <Col span={7}>
                <Form.Item
                  label="所属组织机构"
                  name="organizationId"
                  rules={[{ required: true, message: '请选择所属组织机构' }]}
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
                  />
                </Form.Item>
              </Col>
              <Col span={21}>
                <ProFormTextArea
                  wrapperCol={{ span: 23 }}
                  name="remark"
                  label="备注"
                  fieldProps={{ maxLength: 400, autoSize: { minRows: 3, maxRows: 5 } }}
                />
              </Col>
              <Col span={7} className={styles.iconimg}>
                <Form.Item
                  label="用户头像"
                  name="file"
                  // rules={[{ required: true, message: '请上传用户头像' }]}
                >
                  <UploadImage
                    fileList={fileList}
                    onChange={(res: any) => {
                      // form.setFieldsValue({ file: res[0] })
                      if (res?.length > 0) {
                        setFileList(res);
                        preSubmitUpload(res[0]);
                      } else {
                        imgId.current = '';
                        setFileList([]);
                      }
                    }}
                    limit={4 * 1204 * 1024}
                    maxCount={2}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </ProForm>
    </PageContainer>
  );
};
export default AddPerson;

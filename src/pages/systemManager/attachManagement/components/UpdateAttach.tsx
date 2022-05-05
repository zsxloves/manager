import React, { useEffect, useState } from 'react';
import { Row, Col, message, TreeSelect, Form, Modal, Input, Select, Button, Upload } from 'antd';
import { getOrganizationrTree, getUserList, uploadFile } from '@/services/systemManager';
import TextArea from 'antd/lib/input/TextArea';
import { PlusOutlined } from '@ant-design/icons';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { DataNode } from 'antd/lib/tree';
import styles from './upload.less';

export interface ITable {
  treeId: string;
  updateVisble: boolean;
  // update: any;
  cancelModal: () => void;
  heavyLoad: () => void;
}
export interface TableListItem {
  id: string;
  name?: string;
  description?: string;
}

const AttachOpera: React.FC<ITable> = ({
  treeId,
  updateVisble,
  // update,
  cancelModal,
  heavyLoad,
}) => {
  // const formRef: any = useRef(null);
  const [form] = Form.useForm();
  const [organizationId, setOrganizationId] = useState<DataNode[]>([]); //组织
  const [personData, setPersonData] = useState<{ label: string; value: string }[]>();
  // const [uploadType, setUploadType] = useState<boolean>(false);
  const [uploadInfo, setUploadInfo] = useState<any>(); //存放上传文件
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<any>();
  const [previewTitle, setPreviewTitle] = useState<string>('');

  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  //初始化
  const initFun = () => {
    // 组织表
    getOrganizationrTree({})
      .then((res) => {
        setOrganizationId(res.data);
      })
      .catch((err) => {
        message.error(err.message);
      });
    getUserList({ queryObject: { page: 0, size: 999 } })
      .then((res) => {
        const data = res.result.page.content;
        for (let i = 0; i < data.length; i++) {
          data[i].label = data[i].name;
          data[i].value = data[i].id;
        }
        setPersonData(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  useEffect(() => {
    initFun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = (params: any) => {
    uploadFile(params)
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          message.success(res.message);
          cancelModal();
          heavyLoad();
          setUploadInfo(null);
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  const hideModal = () => {
    if (uploadInfo) {
      form.setFieldsValue({
        wenjian: 'asf',
      });
    }
    form.validateFields().then((values) => {
      uploadInfo.append('name', values.name);
      uploadInfo.append('parentId', treeId);
      uploadInfo.append('title', values.title);
      uploadInfo.append('organizationId', values.organizationId);
      uploadInfo.append('userId', values.userId ? values.userId : '');
      uploadInfo.append('remark', values.remark ? values.remark : '');
      add(uploadInfo);
    });
  };
  const uploads = (file: any) => {
    const myform = new FormData();
    const newName = file.name;
    const renameReportFile = new Blob([file]);
    myform.append('file', renameReportFile, newName);
    setUploadInfo(myform);
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            cancelModal();
            setUploadInfo(null);
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
        title="上传附件"
        visible={updateVisble}
        centered={true}
        width={1000}
        onCancel={cancelModal}
        footer={renderFooter()}
        destroyOnClose={true}
        maskClosable={false}
        className={styles.ass}
      >
        <Form
          layout="horizontal"
          className={styles.fo}
          labelCol={{ style: { width: 140 } }}
          requiredMark
          form={form}
        >
          <Row>
            <Col span={11}>
              <Form.Item
                name="name"
                label="附件名称"
                getValueFromEvent={(e) => e.target.value.trim()}
                rules={[{ required: true }]}
              >
                <Input maxLength={20} autoComplete="off" allowClear={true} placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="关联组织机构" name="organizationId">
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
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item name="userId" label="关联用户">
                <Select
                  showSearch
                  optionFilterProp="label"
                  options={personData}
                  placeholder="请选择"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={22}>
              <Form.Item name="remark" label="备注">
                <TextArea
                  maxLength={400}
                  placeholder="请输入"
                  autoSize={{ minRows: 3, maxRows: 2 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                name="wenjian"
                label="上传文件"
                rules={[{ required: true, message: '请上传文件' }]}
              >
                <Upload
                  listType="picture-card"
                  className={styles.upload}
                  maxCount={1}
                  onPreview={handlePreview}
                  beforeUpload={(file) => {
                    if (file.size > 4 * 1204 * 1024) {
                      message.error('文件过大，请重新选择');
                      return Upload.LIST_IGNORE;
                    }
                    return false;
                  }}
                  onChange={(files) => {
                    if (files.fileList.length > 0) {
                      uploads(files.file);
                    } else {
                      setUploadInfo(null);
                      form.setFieldsValue({ wenjian: null });
                    }
                  }}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          {previewVisible && (
            <Modal
              visible={previewVisible}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img alt="example" style={{ width: '100%', height: '100%' }} src={previewImage} />
            </Modal>
          )}
        </Form>
      </Modal>
    </>
  );
};
export default AttachOpera;

import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Row, Col, Input, Select, Button, message, Tabs } from 'antd';
import { addIcon, updateIcon } from '@/services/iconManage';
import UploadImage from '@/components/uploadImage/index';
import Editor from '@/components/wangEditor/editor';
import { uploadFile } from '@/services/systemManager';
import './index.less';
import { useGetDictionaryByCode } from '@/hooks/useAllOrg';
import EditTable from './table';
import { isJSON } from '@/utils/utilsJS';
interface Props {
  iType: string;
  show: boolean;
  id?: string;
  onConfirm: any;
  onCancel: any;
  item: any;
}
const AddLayer: React.FC<Props> = (props) => {
  const iconType = useGetDictionaryByCode('1cdf43bb-b265-4eef-95a7-d3d6e66d9c03'); // iconType 1cdf43bb-b265-4eef-95a7-d3d6e66d9c03
  const editType = useGetDictionaryByCode('32ce79de-0eba-4c99-823c-faa4d76b786e'); // editType 32ce79de-0eba-4c99-823c-faa4d76b786e
  const levelObj = useGetDictionaryByCode('13ba9732-5cac-42ee-b1ba-9c8f4f7f34b8'); // iconLevel 13ba9732-5cac-42ee-b1ba-9c8f4f7f34b8
  const imaL: any = useRef(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [tableList, steTableList] = useState<any[]>([]);
  const { iType, show, onCancel, onConfirm, item } = props;
  const [form] = Form.useForm();

  function preSubmitUpload(files: any[]) {
    imaL.current = files.length;
    const pList: any[] = [];
    setLoading(true);
    files.forEach((v) => {
      if (!v.status) {
        v.status = 'uploading';
        const p = new Promise((reslove) => {
          const formData = new FormData();
          formData.append('file', v.originFileObj);
          formData.append('name', v.name);
          uploadFile(formData)
            .then((res) => res.json())
            .then((res) => {
              reslove(res);
              if (res.code === 200) {
                v.status = 'success';
              } else {
                v.status = 'error';
              }
            })
            .catch((err) => {
              message.error(err.message);
            });
        });
        pList.push(p);
      }
    });
    Promise.all(pList).then((res) => {
      const attachmentIdList: any[] = [];
      res.forEach((v, i) => {
        if (v.code === 200) {
          const info: any = {
            minioFileUrl: v.data.minioFileUrl,
            code: Number(tableList[tableList.length - 1]?.code || 0) + i + 1,
          };
          if (iType === 'add') {
            info.id = v.data.id;
          } else {
            info.attachmentId = v.data.id;
          }
          attachmentIdList.push(info);

          setLoading(false);
        }
        if (imaL.current === i + 1) {
          message.success('????????????');
        }
      });
      steTableList([...tableList, ...attachmentIdList]);
    });
  }

  async function submit() {
    if (tableList.length === 0) {
      form.setFieldsValue({ file: [] });
    }
    const result = await form.validateFields();
    if (!isJSON(result.style)) {
      message.error('json????????????????????????');
      return;
    }
    setLoading(true);
    if (item.id) {
      // ??????
      updateIcon({
        ...result,
        file: tableList,
        childrenList: tableList.map((v) => ({ ...v })),
        id: item.id,
      })
        .then(() => {
          message.success('????????????');
          onConfirm();
          form.resetFields();
        })
        .catch((res) => {
          setLoading(false);
          message.error(res.message);
        });
    } else {
      // ??????
      addIcon({ ...result, childrenList: tableList.map((v) => ({ ...v, attachmentId: v.id })) })
        .then(() => {
          message.success('????????????');
          onConfirm();
          form.resetFields();
        })
        .catch((res) => {
          setLoading(false);
          message.error(res.message);
        });
    }
  }
  useEffect(() => {
    item.file = item.childrenList;
    if (item.childrenList) {
      // setFileList(item.childrenList.map((v: any) => ({ url: v.minioFileUrl })));
      steTableList(item.childrenList);
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
          ??????
        </Button>
        <Button
          type="primary"
          onClick={() => {
            submit();
          }}
          loading={loading}
        >
          ??????
        </Button>
      </>
    );
  };
  const { Option } = Select;
  const renderForm = () => {
    return (
      <Form form={form} style={{ paddingRight: 60 }} labelCol={{ style: { width: 140 } }}>
        <Row>
          <Col span={11}>
            <Form.Item
              name="title"
              label="????????????"
              rules={[{ required: true, message: '?????????????????????' }]}
            >
              <Input maxLength={40} placeholder="?????????" autoComplete="off" allowClear />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="level"
              label="??????"
              rules={[
                { required: true, message: '???????????????' },
                {
                  pattern: /\d{1,40}/,
                  message: '?????????????????????',
                },
              ]}
            >
              <Select
                allowClear
                placeholder={'?????????'}
                onSelect={(key: string) => {
                  form.setFieldsValue({
                    layerType: key,
                  });
                }}
                loading={levelObj.loading}
              >
                {levelObj?.list?.map((v: any) => {
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
          <Col span={11}>
            <Form.Item
              name="type"
              label="????????????"
              rules={[{ required: true, message: '?????????????????????' }]}
            >
              <Select
                allowClear
                placeholder={'?????????'}
                onSelect={(key: string) => {
                  form.setFieldsValue({
                    layerType: key,
                  });
                }}
                loading={editType.loading}
              >
                {iconType?.list?.map((v: any) => {
                  return (
                    <Option key={v.id} value={v.id}>
                      {v.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="edittype"
              label="????????????"
              rules={[{ required: true, message: '?????????????????????' }]}
            >
              <Select
                allowClear
                placeholder={'?????????'}
                onSelect={(key: string) => {
                  form.setFieldsValue({
                    layerType: key,
                  });
                }}
                loading={editType.loading}
              >
                {editType?.list?.map((v: any) => {
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
              label="??????json"
              name="style"
              rules={[
                {
                  required: true,
                  message: '???????????????json',
                },
              ]}
            >
              <Editor
                content={item.style}
                onChange={(style) => {
                  form.setFieldsValue({ style });
                }}
                checkJson={true}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} className="icon-add-img">
            <Form.Item
              label="????????????"
              rules={[{ required: true, message: '???????????????' }]}
              name="file"
            >
              <UploadImage
                imgLength={tableList.length}
                visble={true}
                fileList={fileList}
                onChange={(res: any) => {
                  form.setFieldsValue({ file: res });
                  preSubmitUpload(res);
                  setFileList(res);
                }}
                limit={4 * 1204 * 1024}
                maxCount={101}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <Modal
      width={1000}
      // bodyStyle={{ padding: '0' }}
      destroyOnClose
      title={iType === 'add' ? '????????????' : '????????????'}
      maskClosable={false}
      visible={show}
      footer={renderFooter()}
      onCancel={() => {
        onCancel();
      }}
      className="icon-add"
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="????????????" key="1">
          {renderForm()}
        </Tabs.TabPane>
        <Tabs.TabPane tab="????????????" key="2">
          <EditTable
            dataSource={tableList}
            onChange={(list) => {
              setFileList(list);
              steTableList(list);
            }}
          />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};
AddLayer.defaultProps = {
  id: '',
};
export default AddLayer;

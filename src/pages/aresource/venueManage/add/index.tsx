import React, { useEffect, useState, useRef } from 'react';
import { Form, Row, Col, Button, message, Switch, Tabs, Upload, Modal } from 'antd';
import { alt, chinese, Phones, lon, lat, getBit } from '@/utils/utilsJS';
import { history, useLocation } from 'umi';
import ProTable from '@ant-design/pro-table';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import InputSuffix from '@/components/InputSuffix/index';
import Map from '@/components/Map';
// import UploadImage from '@/components/fileUpload';
import { uploadFile } from '@/services/systemManager';
import { addVenue, detailVenue, CXIcons } from '../../../../services/venue/index';
import styles from './add.less';
import AddTable from './addTable';
import { ArrowDownOutlined, ArrowUpOutlined, PlusOutlined } from '@ant-design/icons';

type TableListItem = {
  id: string;
  [key: string]: any;
  lat?: number | string;
  lon?: number | string;
};

const AddVenue: React.FC = () => {
  const [form] = Form.useForm();
  const formRef: any = useRef(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [mapValues, setMapValues] = useState<any>({});
  const [showVTable, setShowV] = useState<boolean>(false);
  const [selectVList, setSelectVList] = useState<TableListItem[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]); //图标
  const [fileId, setFileId] = useState<string[]>([]);
  const [item, setItem] = useState<any>();
  const [ids, setIds] = useState<string[]>([]);
  const actionRef = useRef<ActionType>();
  const route: any = useLocation<any>();
  const [director, setDirector] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<any>();
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { id, current, pageSize } = route?.query;

  const swapItems = (arr: any, index1: any, index2: any) => {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    setSelectVList([...arr]);
    actionRef.current?.reloadAndRest!();
  };
  const upData = (arr: any, index: any) => {
    if (arr.length > 1 && index !== 0) {
      // newArr = swapItems(arr, index, index - 1)
      swapItems(arr, index, index - 1);
    } else {
      message.warning('已到顶部');
    }
  };
  const downData = (arr: any, index: any) => {
    if (arr.length > 1 && index !== arr.length - 1) {
      // newArr = swapItems(this.arr, index, index + 1)
      swapItems(arr, index, index + 1);
    } else {
      message.warning('已到底部');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const CXIcon = (ids: any) => {
    if (ids?.length === 0) return;
    CXIcons({ idList: ids })
      .then((res: any) => {
        const info = res.data.rows;
        if (info.length > 0) {
          const icon: any = [];
          info.map((items: any) => {
            icon.push({
              id: items.id,
              name: items.name,
              url: items.minioFileUrl,
            });
          });
          setFileList(icon);
        }
      })
      .catch((err: any) => {
        message.error(err.message);
      });
  };

  //查询详情
  const detailVene = (detailId: any) => {
    detailVenue({ id: detailId })
      .then((res) => {
        const info = res.result.detail;
        const data = info.arLayermanagerVOS;
        setSelectVList(data);
        if (info.hasSecurityOrganization === '1') {
          setDirector(true);
        } else if (info.hasSecurityOrganization === '0') {
          setDirector(false);
        }
        const ListId: string[] = [];
        if (data?.length > 0) {
          for (let i = 0; i < data?.length; i++) {
            ListId[i] = data[i].id;
          }
        }
        setIds(ListId);
        const idList: any = [];
        if (info?.placeUrl1) idList.push(info.placeUrl1);
        if (info?.placeUrl2) idList.push(info.placeUrl2);
        if (info?.placeUrl3) idList.push(info.placeUrl3);
        info.lon = getBit(info?.lon, 10);
        info.lat = getBit(info?.lat, 10);
        setFileId(idList);
        CXIcon(idList);
        setItem(info);
        formRef.current.setFieldsValue(info);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  useEffect(() => {
    if (id) {
      detailVene(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = (idss: string[]) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const newList = selectVList.filter((item) => {
      return !idss.includes(item.id);
    });
    setSelectVList(newList as any);
    setIds(
      newList.map((iter) => {
        return iter?.id;
      }) as any,
    );
  };

  async function submit() {
    formRef.current.validateFields().then((data: any) => {
      // const list = selectVList;
      // if (list.length === 1) {
      //   list[0].isDefult = '1';
      // }
      data.arLayermanagerVOS = selectVList;
      if (id) {
        data.id = item.id;
        data.sortIndex = item.sortIndex;
      }
      if (fileId?.length > 0) {
        for (let i = 0; i < fileId?.length; i++) {
          data['placeUrl' + (i + 1)] = fileId[i];
        }
      }

      addVenue({ data })
        .then((res) => {
          if (res.code === 200) {
            message.success('操作成功');
            form.resetFields();
            setFileList([]);
            setFileId([]);
            history.push(`/aresource/venueManage?page=${parseInt(current)}&size=${pageSize}`);
          } else {
            message.error(res.message);
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    });
  }

  function preSubmitUpload(data: any) {
    setLoading(true);
    if (data.file?.status === 'removed') {
      const all = fileList.filter((res) => {
        return res.uid != data.file?.uid;
      });
      setFileList(all);
      const allId = fileId.filter((res) => {
        return res != data.file?.id;
      });
      setFileId(allId);
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append('file', data?.file);
    formData.append('name', data?.file?.name);
    uploadFile(formData)
      .then((err) => err.json())
      .then((res: any) => {
        const DX = {
          id: res?.data?.id,
          name: res?.data?.name,
          url: res?.data?.minioFileUrl,
        };
        setFileId([...fileId, res?.data?.id]);
        setFileList([...fileList, DX]);
        setLoading(false);
      });
  }
  // const { Option } = Select;  selectVList
  const btnSwitch = (e: boolean, record: any) => {
    const a = selectVList.findIndex((dev: any) => {
      return dev.id === record.id;
    });
    if (e) {
      //打开
      selectVList[a].isDefult = '1';
    } else {
      //关闭
      selectVList[a].isDefult = '0';
    }
  };
  function clickMapIcon() {
    const obj = formRef.current.getFieldValue();
    console.log(obj);
    setMapValues({
      lon: getBit(obj.lon, 7),
      lat: getBit(obj.lat, 7),
    });
    setShowMap(true);
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const renderForm = () => {
    return (
      <Col span={23} offset={1}>
        <Row>
          <Col span={7}>
            <ProFormText
              name="name"
              label="场馆名称"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 40, autoComplete: 'off', placeholder: '请输入' }}
              rules={[{ required: true, message: '请输入场馆名称' }]}
            />
          </Col>
          <Col span={7}>
            <ProFormText
              name="realAddress"
              label="场馆实际地址"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 40, autoComplete: 'off', placeholder: '请输入' }}
              rules={[{ required: true, message: '请输入场馆实际地址' }]}
            />
          </Col>
          <Col span={7}>
            <ProFormText
              name="gymPerson"
              label="场馆负责人"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 40, autoComplete: 'off', placeholder: '请输入' }}
              rules={[
                { required: true, message: '请输入场馆负责人' },
                { pattern: chinese, message: '场馆负责人为1-40个中文字符' },
              ]}
            />
          </Col>
        </Row>
        <Row>
          <Col span={7}>
            <ProFormText
              name="phoneNumber"
              label="场馆负责人联系方式"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 11, autoComplete: 'off', placeholder: '请输入' }}
              rules={[
                { required: true, message: '请输入场馆负责人联系方式' },
                {
                  pattern: Phones,
                  message: '场馆负责人联系方式为固话或者手机号',
                },
              ]}
            />
          </Col>
          <Col span={7}>
            <ProFormText
              name="code"
              label="场馆编码"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 20, autoComplete: 'off', placeholder: '请输入' }}
              rules={[
                { required: true, message: '请输入场馆编码' },
                {
                  pattern: /^[A-Za-z0-9]{1,20}$/,
                  message: '场馆编码由1-20个英文或数字组成',
                },
              ]}
            />
          </Col>
          <Col span={7}>
            <ProFormText
              name="address"
              label="场馆登记地址"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 40, autoComplete: 'off', placeholder: '请输入' }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={7}>
            <ProFormText
              name="lon"
              label="经度"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{
                suffix: InputSuffix(clickMapIcon),
                autoComplete: 'off',
                placeholder: '请输入',
              }}
              rules={[{ pattern: lon, message: '经度范围在0~180之间，且最多保留9位小数' }]}
            />
          </Col>
          <Col span={7}>
            <ProFormText
              name="lat"
              label="纬度"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{
                suffix: InputSuffix(clickMapIcon),
                autoComplete: 'off',
                placeholder: '请输入',
              }}
              rules={[
                {
                  pattern: lat,
                  message: '纬度范围在0~90之间，且最多保留9位小数',
                },
              ]}
            />
          </Col>
          <Col span={7}>
            <ProFormText
              name="height"
              label="高度"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{
                suffix: InputSuffix(clickMapIcon),
                autoComplete: 'off',
                defaultValue: 0,
                placeholder: '请输入',
              }}
              rules={[
                {
                  pattern: alt,
                  message: '整数最多九位且小数最多两位',
                },
              ]}
            />
          </Col>
        </Row>
        <Row>
          <Col span={7}>
            <ProFormText
              name="zoomCode"
              label="行政区划代码"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 20, autoComplete: 'off', placeholder: '请输入' }}
              rules={[
                {
                  pattern: /^[A-Za-z0-9]{1,20}$/,
                  message: '场馆编码由1-20个英文或数字组成',
                },
              ]}
            />
          </Col>
          <Col span={7}>
            <ProFormText
              name="psoname"
              label="所属公安机关"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 20, autoComplete: 'off', placeholder: '请输入' }}
            />
          </Col>
          <Col span={7}>
            <ProFormText
              name="districtPolice"
              label="监督民警"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 20, autoComplete: 'off', placeholder: '请输入' }}
              rules={[{ pattern: chinese, message: '监督民警为1-20个中文字符' }]}
            />
          </Col>
        </Row>
        <Row>
          <Col span={7}>
            <ProFormText
              name="districtPoliceTel"
              label="监督民警联系方式"
              getValueFromEvent={(e) => e.target.value.trim()}
              fieldProps={{ maxLength: 11, autoComplete: 'off', placeholder: '请输入' }}
              rules={[
                {
                  pattern: Phones,
                  message: '监督民警联系方式为固话或者手机号',
                },
              ]}
            />
          </Col>
          <Col span={7}>
            <ProFormSelect
              name="hasSecurityOrganization"
              label="是否有保卫机构"
              options={[
                { label: '是', value: '1' },
                { label: '否', value: '0' },
              ]}
              fieldProps={{
                placeholder: '请选择',
                onSelect(info) {
                  if (info === '1') {
                    setDirector(true);
                  } else if (info === '0') {
                    setDirector(false);
                  }
                  // const fields = formRef.current.getFieldValue();
                  // formRef.current.resetFields();
                  // formRef.current.setFieldsValue({ ...fields, hasSecurityOrganization: info });
                },
              }}
            />
          </Col>
          {director && (
            <Col span={7}>
              <ProFormText
                name="securityOrganizationName"
                label="保卫机构名称"
                getValueFromEvent={(e) => e.target.value.trim()}
                fieldProps={{ maxLength: 40, autoComplete: 'off', placeholder: '请输入' }}
              />
            </Col>
          )}
        </Row>
        {director && (
          <Row>
            <Col span={7}>
              <ProFormText
                name="directorName"
                label="保卫机构负责人"
                getValueFromEvent={(e) => e.target.value.trim()}
                fieldProps={{ maxLength: 40, autoComplete: 'off', placeholder: '请输入' }}
                rules={[{ pattern: chinese, message: '保卫机构负责人为1-40个中文字符' }]}
              />
            </Col>
            <Col span={7}>
              <ProFormText
                name="directorIdTel"
                label="保卫机构负责人联系方式"
                getValueFromEvent={(e) => e.target.value.trim()}
                fieldProps={{ maxLength: 11, autoComplete: 'off', placeholder: '请输入' }}
                rules={[
                  {
                    pattern: Phones,
                    message: '保卫机构负责人联系方式为固话或者手机号',
                  },
                ]}
              />
            </Col>
          </Row>
        )}
        <Row>
          <Col span={23} className={styles.iconimg}>
            <Form.Item label="场馆图片" name="file">
              <Upload
                listType="picture-card"
                fileList={fileList}
                accept="image/*"
                beforeUpload={(file) => {
                  if (file.size > 4 * 1024 * 1024) {
                    message.error('文件过大，请重新选择');
                    return Upload.LIST_IGNORE;
                  }
                  return false;
                }}
                maxCount={3}
                onPreview={handlePreview}
                onChange={(obj: any) => {
                  preSubmitUpload(obj);
                }}
              >
                {fileList.length >= 3 ? null : uploadButton}
              </Upload>
              {previewVisible && (
                <Modal
                  visible={previewVisible}
                  title={previewTitle}
                  footer={null}
                  onCancel={() => setPreviewVisible(false)}
                >
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Col>
    );
  };

  const layerTable = () => {
    return (
      <ProTable
        rowKey="id"
        className={styles.Tables}
        tableAlertRender={false}
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            onClick={() => {
              setShowV(true);
            }}
          >
            新增
          </Button>,
          <Button
            key="button"
            onClick={() => {
              if (selectedRowKeys.length === 0) {
                message.warning('请至少选择一条数据');
                return;
              }
              remove(selectedRowKeys);
            }}
          >
            批量删除
          </Button>,
        ]}
        actionRef={actionRef}
        dataSource={selectVList}
        rowSelection={{
          onChange: (keys) => {
            setSelectedRowKeys(keys);
          },
        }}
        pagination={{
          responsive: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        columns={[
          {
            title: '序号',
            dataIndex: 'index',
            render: (_, record, index) => index + 1,
            width: 50,
            search: false,
          },
          {
            title: '图层名称',
            dataIndex: 'name',
            width: 300,
            ellipsis: true,
          },
          {
            title: '是否默认',
            width: 100,
            render: (_, record) => (
              <Switch
                className={styles.switchSize}
                size="small"
                defaultChecked={record?.isDefult == '0' ? false : true}
                onClick={(e) => btnSwitch(e, record)}
              />
            ),
          },
          {
            title: '操作',
            width: 100,
            render: (_, record) => [
              <a
                key="up"
                onClick={() => {
                  const up = selectVList.findIndex((items: any) => {
                    return items.id === record.id;
                  });
                  upData(selectVList, up);
                }}
              >
                <ArrowUpOutlined />
              </a>,
              <a
                key="low"
                onClick={() => {
                  const down = selectVList.findIndex((items: any) => {
                    return items.id === record.id;
                  });
                  downData(selectVList, down);
                }}
              >
                <ArrowDownOutlined />
              </a>,
              <a
                target="_blank"
                rel="noopener noreferrer"
                key="view"
                onClick={() => {
                  remove([record?.id]);
                  // actionRef.current?.reloadAndRest!();
                }}
              >
                删除
              </a>,
            ],
          },
        ]}
        options={false}
        search={false}
      />
    );
  };

  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProForm
        formRef={formRef}
        className={styles.PageContainer}
        labelAlign="right"
        layout="horizontal"
        labelCol={{ style: { width: 170 } }}
        size="large"
        submitter={{
          render: () => {
            return [
              <Button
                key="cancel"
                onClick={() => {
                  setFileList([]);
                  setFileId([]);
                  history.push(`/aresource/venueManage?page=${parseInt(current)}&size=${pageSize}`);
                }}
              >
                取消
              </Button>,
              <Button
                key="next1"
                type="primary"
                loading={loading}
                onClick={() => {
                  submit();
                }}
              >
                保存
              </Button>,
            ];
          },
        }}
      >
        <Row>
          <Form.Item className={styles.headerText}>{!id ? '场馆新增' : '场馆编辑'}</Form.Item>
        </Row>
        <Tabs defaultActiveKey="1" style={{ height: '725px' }}>
          <Tabs.TabPane tab="基础信息" key="1">
            {renderForm()}
          </Tabs.TabPane>
          <Tabs.TabPane tab="图层列表" key="2">
            {layerTable()}
          </Tabs.TabPane>
        </Tabs>
        {showMap && (
          <Map
            onSubmit={(val: any) => {
              const data: any = {
                lon: val.lon,
                lat: val.lat,
                height: val.alt,
              };
              if (val.address) {
                data.address = val.address;
              }
              formRef.current.setFieldsValue(data);
              setShowMap(false);
            }}
            onCancel={() => {
              setShowMap(false);
            }}
            isShowMap={showMap}
            values={mapValues}
          />
        )}
        {showVTable && (
          <AddTable
            selectVList={selectVList}
            ids={ids}
            show={showVTable}
            onCancel={() => {
              setShowV(false);
            }}
            onConfirm={(idss: any, data: any) => {
              const hash = {};
              const info = data.reduce(function (items: any, next: any) {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                hash[next.id] ? '' : (hash[next.id] = true && items.push(next));
                return items;
              }, []);

              if (data?.length > 0) {
                data.map((num: any) => {
                  if (!ids.includes(num.id)) {
                    num.isDefult = '0';
                  }
                });
              }
              const dataId = data.map((items: any) => items.id);
              setSelectVList(info);
              setIds(dataId);
              setShowV(false);
            }}
          />
        )}
      </ProForm>
    </PageContainer>
  );
};
AddVenue.defaultProps = {
  id: '',
};
export default AddVenue;

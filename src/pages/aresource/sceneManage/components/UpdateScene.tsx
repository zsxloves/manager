import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, TreeSelect, Tabs } from 'antd';
import { getOrganizationrTree } from '@/services/systemManager';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { DataNode } from 'antd/lib/tree';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { updateScene } from '@/services/sceneManage/index';
import Editor from '@/components/wangEditor/editor';
import Map from '@/components/Map';
// import { getContractorList } from '@/services/guestManager/index';
import VenueTable from './VenueTable';
import { isJSON } from '@/utils/utilsJS';
import styles from './index.less';
import { AimOutlined } from '@ant-design/icons';

export interface IPropsUpdate {
  scenue: Record<string, any>;
  modalType: string;
  updateType: boolean;
  cancel: () => void;
  heavyLoads: () => void;
}
type TableListItem = {
  id: string;
  [key: string]: any;
  lat: number | string;
  lon: number | string;
};
// let editor: any = null;
const UpdateScenes: React.FC<IPropsUpdate> = ({
  scenue,
  modalType,
  updateType,
  cancel,
  heavyLoads,
}) => {
  const [form] = Form.useForm();
  const [organizationId, setOrganizationId] = useState<DataNode[]>(); //组织树
  // const [venueInfo, setVenueInfo] = useState<{ label: string; value: string }[]>();
  const [venueVisible, setVenueVisible] = useState<boolean>(false); //选择场馆弹框
  const [info, setInfo] = useState<TableListItem[]>([]); //表格场馆信息
  const [idInfo, setIdInfo] = useState<string[]>([]); //表格场馆id信息
  const [editInfo, setEditInfo] = useState<Record<string, any>>({});
  const [type, setType] = useState<boolean>(true);
  const [isShowMap, setShowMap] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [mapValues, setMapValues] = useState<any>({});
  const [viewsEditer, setViewEditer] = useState<boolean>(false);
  const [views, setViews] = useState<any>({});
  // const [pointA, setPointA] = useState<any>({
  //   lon: '',
  //   lat: '',
  //   alt: '',
  // });

  const params = { type };

  // 重新加载table
  // const heavyLoad = () => {
  //   setType(!type);
  // };
  useEffect(() => {
    // 组织表
    getOrganizationrTree({})
      .then((res) => {
        if (res.data) {
          setOrganizationId(res.data);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
    if (modalType == 'edit') {
      form.setFieldsValue(scenue);
      setEditInfo(scenue);
      setInfo(scenue.gymList);
      setIdInfo(scenue.gymIdList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenue]);

  useEffect(() => {
    setType(!type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);
  //删除
  const handleRemoveOne = (data: any) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        if (data.length > 0) {
          for (let j = 0; j < data.length; j++) {
            const a = info?.findIndex((item) => {
              return item.id === data[j];
            });
            const b = idInfo?.findIndex((item) => {
              return item === data[j];
            });
            const newInfo = info.splice(a, 1);
            const news = info.filter((item: any) => {
              return item != newInfo;
            });
            const newIdInfo = idInfo.splice(b, 1);
            const newb = idInfo.filter((item: any) => {
              return item != newIdInfo;
            });
            setInfo(news);
            setIdInfo(newb);
          }
        }
      },
    });
  };

  const add = (param: any) => {
    updateScene({ data: param })
      .then((res) => {
        if (res.code === 200) {
          message.success('新增成功');
          cancel();
          heavyLoads();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  const edit = (param: any) => {
    param.id = (editInfo as Record<string, unknown>).id;
    param.sortIndex = editInfo.sortIndex;
    param.screenConfig = editInfo?.screenConfig;
    updateScene({ data: param })
      .then((res) => {
        if (res.code === 200) {
          message.success('编辑成功');
          cancel();
          heavyLoads();
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };

  const handleOk = async () => {
    const fieldsValue = await form.validateFields();
    fieldsValue.gymIdList = info?.map((res) => {
      return res.id;
    });
    if (fieldsValue.centerPosition && !isJSON(fieldsValue.centerPosition)) {
      message.error('position中心点格式不正确');
      return;
    }
    if (fieldsValue.entity && !isJSON(fieldsValue.entity)) {
      message.error('配置详细json格式不正确');
      return;
    }
    if (fieldsValue.views && !isJSON(fieldsValue.views)) {
      message.error('views视域格式不正确');
      return;
    }
    if (fieldsValue.indexConfigUrl && !isJSON(fieldsValue.indexConfigUrl)) {
      message.error('大屏配置格式不正确');
      return;
    }
    if (modalType == 'add') {
      add(fieldsValue);
    } else {
      edit(fieldsValue);
    }
  };
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            cancel();
          }}
        >
          取消
        </Button>
        <Button type="primary" onClick={() => handleOk()}>
          保存
        </Button>
      </>
    );
  };

  const columns: ProColumns<TableListItem>[] = [
    // {
    //   title: '代码',
    //   dataIndex: 'code',
    //   ellipsis: true,
    //   search: false,
    //   width: 100,
    // },
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      hideInSearch: true,
      width: 50,
      render: (_, record, index) => index + 1,
    },
    {
      title: '场馆名称',
      dataIndex: 'name',
      search: false,
      ellipsis: true,
    },
    {
      title: '场馆地址',
      dataIndex: 'address',
      search: false,
      ellipsis: true,
    },
    {
      title: '经纬度',
      key: 'lonLat',
      search: false,
      ellipsis: true,
      render: (text, record) => {
        return `${record.lon || ''}${record.lon ? ',' : ''}${record.lat || ''}`;
      },
    },
    {
      title: '场馆负责人',
      dataIndex: 'gymPerson',
      hideInSearch: true,
      ellipsis: true,
      search: false,
    },
    {
      title: '联系方式',
      ellipsis: true,
      search: false,
      dataIndex: 'phoneNumber',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInSetting: true,
      render: (_, record) => [
        <a
          key="del"
          onClick={() => {
            handleRemoveOne([record.id]);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const renderForm = () => {
    return (
      <Form form={form} labelCol={{ style: { width: 140 } }} className={styles.formTable}>
        <Row>
          <Col span={11}>
            <Form.Item
              name="name"
              label="场景名称"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[{ required: true }]}
            >
              <Input autoComplete="off" maxLength={40} allowClear={true} placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item name="organizationId" label="组织机构" rules={[{ required: true }]}>
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
            <Form.Item
              name="title"
              label="场景标题"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[{ required: true, message: '请输入场景标题' }]}
            >
              <Input autoComplete="off" maxLength={20} allowClear={true} placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="code"
              label="编码"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                {
                  required: true,
                  message: '请输入编码',
                },
                {
                  pattern: /^[A-Za-z0-9]{1,36}$/,
                  message: '编码由1-36个数字或英文组成',
                },
              ]}
            >
              <Input autoComplete="off" allowClear={true} placeholder="请输入" maxLength={36} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="centerPosition"
              getValueFromEvent={(e) => e.target.value.trim()}
              label="position中心点"
            >
              <Input
                placeholder="请输入"
                autoComplete="off"
                allowClear={true}
                suffix={
                  <AimOutlined
                    style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                    onClick={() => {
                      const obj = form.getFieldValue([]);
                      if (obj?.centerPosition) {
                        let a = JSON.parse(obj.centerPosition);
                        a = { ...a, lon: a?.lng };
                        setMapValues(a);
                      }
                      setShowMap(true);
                    }}
                  />
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <Form.Item label="大屏配置" name="indexConfigUrl">
              <Editor
                key="DPConfig"
                content={editInfo.indexConfigUrl}
                custom={'indexConfigUrl'}
                onChange={(style) => {
                  form.setFieldsValue({ indexConfigUrl: style });
                }}
                checkJson={true}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <Form.Item label="views视域" name="views">
              <Editor
                key="views"
                content={editInfo.views}
                onChange={(style) => {
                  const a = JSON.parse(style);
                  let b: any = [];
                  if (a?.length > 0) {
                    b = a.map((item: any) => {
                      const d: any = [];
                      const x = item.x;
                      const y = item.y;
                      d[0] = x;
                      d[1] = y;
                      d[2] = 0;
                      return d;
                    });
                    setViews(b);
                  }
                }}
                checkJson={true}
                custom={'EditorBtn'}
                EditorBtn={() => {
                  if (modalType == 'add') {
                    setViews(null);
                    setViewEditer(true);
                  } else {
                    const obj = form.getFieldValue([]);
                    const a = JSON.parse(obj.views);
                    if (a?.length > 0) {
                      let b: any = [];
                      b = a.map((item: any) => {
                        const d: any = [];
                        const x = item.x;
                        const y = item.y;
                        d[0] = x;
                        d[1] = y;
                        d[2] = 0;
                        return d;
                      });
                      setViews(b);
                      setViewEditer(true);
                    } else {
                      setViews(null);
                      setViewEditer(true);
                    }
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={22}>
            <Form.Item label="配置详细json" name="entity">
              <Editor
                key="entity"
                content={editInfo.entity}
                onChange={(style) => {
                  form.setFieldsValue({ entity: style });
                }}
                checkJson={true}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row />
        {venueVisible && (
          <VenueTable
            data={idInfo as string[]}
            info={info as any}
            isModalVisible={venueVisible}
            handleCancel={() => {
              setVenueVisible(false);
            }}
            getValue={(datas: any) => {
              const hash = {};
              const data = datas.reduce(function (item: any, next: any) {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                hash[next.id] ? '' : (hash[next.id] = true && item.push(next));
                return item;
              }, []);
              const id = data.map((item: any) => item.id);
              setInfo(data);
              setIdInfo(id);
            }}
          />
        )}
        {isShowMap && (
          <Map
            onSubmit={(_, sj) => {
              form.setFieldsValue({
                centerPosition: `{"alt": ${sj.alt},"heading": ${sj.heading}, "lat": ${sj.lat}, "lng": ${sj.lng}, "pitch": ${sj.pitch}}`,
              });
              setShowMap(false);
            }}
            onCancel={() => {
              setShowMap(false);
            }}
            isShowMap={isShowMap}
            values={mapValues}
            position="position"
          />
        )}
        {viewsEditer && (
          <Map
            onSubmit={(val, sj, view) => {
              const a: any = [];
              for (let i = 0; i < view.length; i++) {
                const x = view[i][0];
                const y = view[i][1];
                a[i] = { x, y };
              }
              setEditInfo({ ...editInfo, views: JSON.stringify(a) });
              setViewEditer(false);
            }}
            onCancel={() => {
              setViewEditer(false);
            }}
            isShowMap={viewsEditer}
            values={views}
            line="line"
          />
        )}
      </Form>
    );
  };

  return (
    <Modal
      width={1000}
      className={styles.md}
      bodyStyle={{ overflowY: 'auto' }}
      destroyOnClose
      title={modalType == 'add' ? '新增场景' : '编辑场景'}
      maskClosable={false}
      visible={updateType}
      onCancel={cancel}
      footer={renderFooter()}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="基础信息" key="1">
          {renderForm()}
        </Tabs.TabPane>
        <Tabs.TabPane tab="场馆列表" key="2">
          <ProTable<TableListItem>
            params={params}
            columns={columns}
            tableAlertRender={false}
            dataSource={info}
            className={styles.tables}
            rowKey="id"
            options={false}
            pagination={{
              responsive: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              defaultPageSize: 10,
            }}
            search={false}
            dateFormatter="string"
            rowSelection={{
              onChange: (keys) => {
                setSelectedRowKeys(keys);
              },
            }}
            toolBarRender={() => [
              <Button
                type="primary"
                key="primary"
                size="small"
                onClick={() => {
                  setVenueVisible(true);
                }}
              >
                新增
              </Button>,
              <Button
                key="button"
                size="small"
                onClick={() => {
                  if (selectedRowKeys.length === 0) {
                    message.warning('请至少选择一条数据');
                    return;
                  }
                  handleRemoveOne(selectedRowKeys);
                }}
              >
                批量删除
              </Button>,
            ]}
          />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default UpdateScenes;

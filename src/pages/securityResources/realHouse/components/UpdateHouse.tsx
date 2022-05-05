import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Tag, TreeSelect } from 'antd';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { getAreaTree } from '@/services/systemManager';
import { addHouse, editHouse, houseDetail } from '@/services/securityResources';
import { setTreeData, lon, lat, alt, getBit } from '@/utils/utilsJS';
import Map from '@/components/Map';
import PersonTable from './PersonTable';
import styles from './index.less';
import { AimOutlined } from '@ant-design/icons';

export interface IPropsUpdate {
  houseId: string;
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
const UpdateScenes: React.FC<IPropsUpdate> = ({
  houseId,
  modalType,
  updateType,
  cancel,
  heavyLoads,
}) => {
  const [form] = Form.useForm();
  const [regionId, setRegionId] = useState<any>([]); //区域树
  const [venueVisible, setVenueVisible] = useState<boolean>(false); //选择场馆弹框
  const [info, setInfo] = useState<TableListItem[]>([]); //表格人员信息
  const [idInfo, setIdInfo] = useState<string[]>([]); //表格人员id信息
  const [initPersonId, setInitPersonId] = useState<string[]>([]); //表格人员初始化id信息
  const [isShowMap, setShowMap] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [mapValues, setMapValues] = useState<any>({});
  const [point, setPoint] = useState<any>({
    lon: '',
    lat: '',
    alt: '',
  });
  const [type, setType] = useState<boolean>(true);

  const params = { type };

  useEffect(() => {
    // 区域表
    getAreaTree({})
      .then((res) => {
        if (res.data) {
          const data = setTreeData(res.data);
          setRegionId(data);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });

    if (modalType == 'edit') {
      houseDetail({ id: houseId })
        .then((res) => {
          const data = res.data;
          if (data?.personInfoVOList.length > 0) {
            const listId: string[] = [];
            data?.personInfoVOList.map((item: any) => {
              listId.push(item.id);
            });
            setIdInfo(listId);
            setInitPersonId(JSON.parse(JSON.stringify(listId)));
          }
          data.lon = getBit(data?.lon, 10);
          data.lat = getBit(data?.lat, 10);
          setInfo(data.personInfoVOList);
          form.setFieldsValue(data);
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setType(!type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);
  //比较是否添加新人员
  const compare = (ids: string[]): boolean => {
    return ids.toString() == initPersonId.toString();
  };

  const add = (param: any) => {
    addHouse(param)
      .then((res) => {
        if (res.code === 200) {
          message.success('新增成功');
          cancel();
          heavyLoads();
          setInfo([]);
          setIdInfo([]);
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  const edit = (param: any) => {
    param.id = houseId;
    editHouse(param)
      .then((res) => {
        if (res.code === 200) {
          message.success('编辑成功');
          cancel();
          heavyLoads();
          setInfo([]);
          setIdInfo([]);
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  //删除
  const handleRemoveOne = (data: any) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        let news: React.SetStateAction<TableListItem[]> = [];
        let newb: React.SetStateAction<string[]> = [];
        for (let i = 0; i < data.length; i++) {
          const a = info?.findIndex((item) => {
            return item.id === data[i];
          });
          const b = idInfo?.findIndex((item) => {
            return item === data[i];
          });
          const newInfo = info.splice(a, 1);
          news = info.filter((item: any) => {
            return item != newInfo;
          });
          const newIdInfo = idInfo.splice(b, 1);
          newb = idInfo.filter((item: any) => {
            return item != newIdInfo;
          });
        }
        setInfo(news);
        setIdInfo(newb);
        setSelectedRowKeys([]);
      },
    });
  };
  const handleOk = async () => {
    const fieldsValue = await form.validateFields();
    fieldsValue.personIdList = idInfo;
    const a: boolean = compare(fieldsValue.personIdList);
    if (!a) {
      fieldsValue.isChangePerson = '1';
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
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      hideInSearch: true,
      width: 50,
      render: (_, record, index) => index + 1,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
        rules: [
          {
            pattern: /^(a-z|A-Z|0-9)*[^$%^&*;:,<>?()\""\']{1,20}$/,
            message: '姓名由1-20个字符组成',
          },
        ],
      },
    },
    {
      title: '标签',
      dataIndex: 'posTypeName',
      search: false,
      width: 90,
      valueEnum: {
        民警: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        辅警: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        保安: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        交警: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        普通人员: {
          text: <Tag color="#87d068">普通人员</Tag>,
        },
        重点人员: {
          text: <Tag color="#f50">重点人员</Tag>,
        },
      },
    },
    {
      title: '性别',
      dataIndex: 'genderName',
      width: 100,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '人员类别',
      dataIndex: 'personTypeName',
      width: 100,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '职业类别',
      dataIndex: 'posTypeName',
      width: 100,
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '身份证号',
      dataIndex: 'idCardCode',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '关联组织机构',
      dataIndex: 'orgName',
      hideInSearch: true,
      ellipsis: true,
    },
  ];

  return (
    <Modal
      width={1000}
      bodyStyle={{ padding: '40px 0' }}
      destroyOnClose
      title={modalType == 'add' ? '新增房屋' : '编辑房屋'}
      maskClosable={false}
      visible={updateType}
      onCancel={cancel}
      footer={renderFooter()}
    >
      <Form form={form} labelCol={{ style: { width: 140 } }} className={styles.formTable}>
        <Row>
          <Col span={11}>
            <Form.Item
              name="pcsmc"
              label="派出所名称"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '请输入派出所名称' },
                {
                  pattern:
                    /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/,
                  message: '派出所名称仅支持中文',
                },
              ]}
            >
              <Input autoComplete="off" maxLength={40} allowClear={true} placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="pcsdm"
              label="派出所代码"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '请输入派出所代码' },
                {
                  pattern: /^[A-Za-z0-9]{1,36}$/,
                  message: '派出所代码由1-36个数字或英文组成',
                },
              ]}
            >
              <Input autoComplete="off" maxLength={36} allowClear={true} placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="address"
              label="标准地址"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[{ required: true, message: '请输入标准地址' }]}
            >
              <Input autoComplete="off" maxLength={40} allowClear={true} placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="areaId"
              label="区域"
              rules={[{ required: true, message: '请选择区域' }]}
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
                treeData={regionId}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={11}>
            <Form.Item
              name="lon"
              label="经度"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '请输入经度' },
                {
                  pattern: lon,
                  message: '经度范围在0~180之间，且最多保留9位小数',
                },
              ]}
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
                      if (obj.lon && obj.lat) {
                        setPoint({ lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) });
                        const pointNew: any = { lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) };
                        setMapValues(pointNew);
                      } else {
                        setMapValues(point);
                      }
                      setShowMap(true);
                    }}
                  />
                }
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="lat"
              label="纬度"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '请输入纬度' },
                {
                  pattern: lat,
                  message: '纬度范围在0~90之间，且最多保留9位小数',
                },
              ]}
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
                      if (obj.lon && obj.lat) {
                        setPoint({ lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) });
                        const pointNew: any = { lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) };
                        setMapValues(pointNew);
                      } else {
                        setMapValues(point);
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
          <Col span={11}>
            <Form.Item
              name="height"
              label="高度"
              getValueFromEvent={(e) => e.target.value.trim()}
              rules={[
                { required: true, message: '请输入高度' },
                {
                  pattern: alt,
                  message: '整数最多九位且小数最多两位',
                },
              ]}
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
                      if (obj.lon && obj.lat) {
                        setPoint({ lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) });
                        const pointNew: any = { lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) };
                        setMapValues(pointNew);
                      } else {
                        setMapValues(point);
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
          <ProTable<TableListItem>
            params={params}
            columns={columns}
            tableAlertRender={false}
            request={() => {
              return Promise.resolve({
                data: info,
                success: true,
              });
            }}
            rowKey="id"
            options={false}
            pagination={{
              responsive: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              defaultPageSize: 10,
            }}
            rowSelection={{
              onChange: (keys) => {
                setSelectedRowKeys(keys);
              },
            }}
            search={false}
            dateFormatter="string"
            toolBarRender={() => [
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  setVenueVisible(true);
                }}
              >
                新增人员
              </Button>,
              <Button
                key="button"
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
        </Row>
        {venueVisible && (
          <PersonTable
            data={idInfo as string[]} //数据id
            info={info as any} //所有数据信息
            isModalVisible={venueVisible}
            handleCancel={() => {
              setVenueVisible(false);
            }}
            getValue={(datas: any, dataId: string[]) => {
              const hash = {};
              const data = datas.reduce(function (item: any, next: any) {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                hash[next.id] ? '' : (hash[next.id] = true && item.push(next));
                return item;
              }, []);
              const id = data.map((item: any) => item.id);
              setInfo(data);
              setIdInfo(id);
              console.log(data, id, dataId);
              setVenueVisible(false);
            }}
          />
        )}
        {isShowMap && (
          <Map
            onSubmit={(val) => {
              setPoint(val.point);
              form.setFieldsValue({ lon: val.lon, lat: val.lat, height: val.alt });
              setShowMap(false);
            }}
            onCancel={() => {
              setShowMap(false);
            }}
            isShowMap={isShowMap}
            values={mapValues}
          />
        )}
      </Form>
    </Modal>
  );
};

export default UpdateScenes;

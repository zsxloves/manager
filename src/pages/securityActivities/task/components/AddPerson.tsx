import { Button, message, Modal, Select, DatePicker, Row } from 'antd';
const { RangePicker } = DatePicker;
import { getkeyPerson, equitbyorg } from '@/services/prepar';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import styles from './index.less';
import { formatDate } from '@/utils/utilsJS';
import { addByTask, giveTime } from '../../../../services/task';
import moment from 'moment';
import React, { useState, useRef, useEffect } from 'react';
export interface SelectModelProps {
  typeflag?: string;
  modelShow: boolean;
  save: (e: any[] | undefined) => void;
  cancel: () => void;
  organizationId?: string;
  recordself: any;
  selectedList?: any;
}
export interface TableListItem {
  index: string;
  id: string;
  markList: [];
  startTime: any;
  endTime: any;
}
const SelectModel: React.FC<SelectModelProps> = (props) => {
  const modelform = useRef<ActionType>();
  const { modelShow, typeflag, save, cancel, organizationId, recordself } = props;
  const [selectList, setSelectList] = useState<any[]>([]); //多选的数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]); //多选id
  const [equiptree, setEquiptree] = useState<any[]>(); //装备数据
  const [addPerson, setAddPerson] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(true);
  const [day, setDay] = useState<any>();
  const [giveData, setGiveData] = useState<any>();

  const [columns, setColumns] = useState<ProColumns<TableListItem>[]>(); //弹框列
  const getData = () => {
    //获取派发
    giveTime({
      type: 2,
      taskId: recordself?.id,
    })
      .then((res) => {
        const data = res.data.rows?.map((item: any, index: any) => {
          item.index = index;
          return item;
        });
        setGiveData(data);
        setLoad(false);
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  useEffect(() => {
    //获取装备
    equitbyorg({
      noPerson: 1,
      page: 0,
      size: 9999999,
    })
      .then((res) => {
        const equip = res.data.rows;
        const equiptr =
          equip &&
          equip.map((item: Record<string, unknown>) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
        setEquiptree(equiptr);
        getData();
      })
      .catch((err) => {
        message.error(err.message || err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const column: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      ellipsis: true,
      valueType: 'index',
    },
    {
      title: '姓名',
      width: '100px',
      dataIndex: 'personName',
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      search: false,
      ellipsis: true,
    },
    {
      title: '类型',
      width: '80px',
      dataIndex: 'posTypeName',
      search: false,
      ellipsis: true,
    },
    {
      title: '装备',
      dataIndex: 'gpsIdList',
      render: (gpsId, record: any) => {
        return (
          <>
            <Select
              style={{ width: '200px' }}
              optionFilterProp="label"
              showSearch
              defaultValue={record?.gpsIdList || []}
              mode="multiple"
              options={equiptree}
              placeholder="添加装备"
              maxTagCount={1}
              onChange={(val: any) => {
                giveData?.map((item: any) => {
                  if (item.id === record.id) {
                    item.gpsIdList = val;
                  }
                });
              }}
            />
          </>
        );
      },
      search: false,
    },
    {
      title: '起始时间',
      width: 350,
      dataIndex: 'timeRange',
      search: false,
      render: (endTime: any, record: any) => {
        return (
          <>
            <RangePicker
              defaultValue={[moment(record.startTime), moment(record.endTime)]}
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              onOk={(e: any) => {
                console.log(formatDate(e[0]), formatDate(e[1]));
                record.startTime = formatDate(e[0]);
                record.endTime = formatDate(e[1]);
              }}
              disabledDate={(current: any) => {
                return (
                  current > moment(recordself.endTime.slice(0, 10) + ' 23:59:59') ||
                  current < moment(recordself.startTime.slice(0, 10) + ' 00:00:00')
                );
              }}
            />
          </>
        );
      },
    },
    {
      title: '删除',
      dataIndex: 'endTime',
      width: 60,
      search: false,
      render: (endTime: any, record) => {
        return (
          <a
            onClick={() => {
              const data = giveData.filter((item: any) => item.index !== record.index);
              data.map((item: any, index: any) => {
                item.index = index;
                return item;
              });
              setGiveData(data);
            }}
          >
            删除
          </a>
        );
      },
    },
  ];
  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            setDay('');
            getData();
            cancel();
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            //筛选人员id
            const idArry: any[] = [];
            giveData.map((item: any) => {
              idArry.push(item.personId);
            });
            const newidArry = [...new Set(idArry)];
            //人员id分类
            const nameArry: any[][] = [];
            newidArry.map((item) => {
              const personArray = giveData.filter((itemm: any, index: any) => {
                if (item === itemm.personId) {
                  itemm.index = index;
                  return itemm;
                }
              });
              nameArry.push(personArray);
            });
            // 时间段校验
            nameArry.map((item) => {
              item.map((itemm, index) => {
                item.map((itt, ittex) => {
                  if (ittex > index) {
                    if (itemm.startTime > itt.endTime || itt.startTime > itemm.endTime) {
                      giveData[itemm.index].sure = true;
                    } else {
                      giveData[itemm.index].sure = false;
                      itemm.sure = false;
                      message.error(
                        '第' + (itemm.index + 1) + '行与第' + (itt.index + 1) + '行重叠',
                      );
                    }
                  }
                });
              });
            });
            // 提交数据
            if (giveData.findIndex((target: any) => target.sure === false) == -1) {
              const data = giveData?.map((iter: any, index: any) => {
                if (
                  iter.gpsIdList === null ||
                  (typeof iter.gpsIdList !== 'string' && iter.gpsIdList?.length === 0)
                ) {
                  message.error('第' + (index + 1) + '行设备不能为空');
                  return;
                }
                return {
                  endTime: iter.endTime,
                  startTime: iter.startTime,
                  gpsIdList: iter.gpsIdList,
                  taskId: recordself.id,
                  personId: iter.personId,
                };
              });
              if (data.length === 0) message.error('派发人员不能为空');
              addByTask({ personGpsdeviceVOList: data, taskId: recordself.id })
                .then((res) => {
                  if (res.code === 200) {
                    save(giveData);
                    setSelectList([]);
                    cancel();
                  }
                })
                .catch((err) => {
                  console.log(err.message || err);
                });
            } else {
              console.log('验证不通过');
            }
          }}
        >
          保存
        </Button>
      </>
    );
  };
  return (
    <>
      <Modal
        footer={renderFooter()}
        className={styles.page}
        width={1200}
        title={typeflag}
        visible={modelShow}
        maskClosable={false}
        onCancel={() => {
          setDay('');
          getData();
          cancel();
        }}
      >
        <Row>
          <DatePicker
            disabledDate={(current) => {
              return (
                current > moment(recordself.endTime.slice(0, 10) + ' 23:59:59') ||
                current < moment(recordself.startTime.slice(0, 10) + ' 00:00:00')
              );
            }}
            style={{ width: '200px' }}
            format="YYYY-MM-DD"
            value={day}
            onChange={(e) => {
              setDay(e);
            }}
          />
          <Button
            type="primary"
            style={{ width: '100px', marginLeft: '10px' }}
            onClick={() => {
              if (day) {
                setAddPerson(true);
              } else {
                message.warning('请选择时间');
              }
            }}
          >
            选择人员
          </Button>
        </Row>
        <ProTable<TableListItem>
          loading={load}
          scroll={{ x: '100%', y: 430 }}
          tableAlertRender={false}
          actionRef={modelform}
          columns={column}
          options={false}
          search={false}
          pagination={false}
          rowKey="id"
          dataSource={giveData}
        />
      </Modal>
      {addPerson && (
        <Modal
          key={String(recordself)}
          className={styles.page}
          width={1050}
          title={typeflag}
          maskClosable={false}
          visible={addPerson}
          onOk={() => {
            const data = selectList?.map((item) => {
              return {
                ...item,
                personName: item.name,
                gpsIdList: item.gpsId,
                personId: item.id,
              };
            });
            const dataresult = giveData.concat(data);
            dataresult.map((item: any, index: any) => {
              item.index = index;
              return index;
            });
            setGiveData(dataresult);
            setSelectList([]);
            setSelectedRowKeys([]);
            setAddPerson(false);
          }}
          onCancel={() => {
            setSelectList([]);
            setSelectedRowKeys([]);
            setAddPerson(false);
          }}
        >
          <ProTable<TableListItem>
            scroll={{ x: '100%', y: 400 }}
            tableAlertRender={false}
            columns={columns}
            rowSelection={{
              selectedRowKeys,
              onSelect: (record, selected) => {
                const keyArr: any[] = [record.id];
                if (selected) {
                  setSelectedRowKeys([...new Set(selectedRowKeys.concat(keyArr))]);
                  setSelectList([...new Set(selectList.concat(record))]);
                } else {
                  const keys: string[] = selectedRowKeys.filter((val: string) => {
                    return val !== String(record.id);
                  });
                  const Rows: TableListItem[] = selectList.filter((val: any) => {
                    return val.id !== String(record.id);
                  });
                  setSelectedRowKeys(keys);
                  setSelectList(Rows);
                }
              },
              onSelectAll: (selected, rows, changeRows) => {
                console.log(selected, rows, changeRows);
                if (selected) {
                  const pageAllKeys: string[] = rows.map((a: any) => {
                    return a?.id;
                  });
                  const pageAllRows: TableListItem[] = rows.filter((a: any) => {
                    if (a !== undefined) {
                      return a;
                    }
                  });
                  setSelectedRowKeys([...new Set(selectedRowKeys.concat(pageAllKeys))]);
                  setSelectList([...new Set(selectList.concat(pageAllRows))]);
                } else {
                  const pageAllKeys: string[] = changeRows.map((a: any) => {
                    return a.id;
                  });
                  const keys: string[] = selectedRowKeys.filter((val: string) => {
                    return !pageAllKeys.includes(val);
                  });
                  const Rows: TableListItem[] = selectList.filter((vals: any) => {
                    return !pageAllKeys.includes(vals.id);
                  });
                  console.log(pageAllKeys, 'ROw', keys, Rows);
                  setSelectedRowKeys(keys);
                  setSelectList(Rows);
                }
              },
            }}
            onRow={(record: any) => {
              return {
                onClick: () => {
                  const keyArr: any[] = [record.id];
                  if (selectedRowKeys.includes(record.id)) {
                    const keys: string[] = selectedRowKeys.filter((val: string) => {
                      return val !== record.id;
                    });
                    const Rows: TableListItem[] = selectList.filter((val: any) => {
                      return val.id !== String(record.id);
                    });
                    setSelectedRowKeys(keys);
                    setSelectList(Rows);
                  } else {
                    setSelectedRowKeys([...new Set(selectedRowKeys.concat(keyArr))]);
                    setSelectList([...new Set(selectList.concat(record))]);
                  }
                },
              };
            }}
            options={false}
            search={{
              labelWidth: 100,
              span: 10,
              collapsed: false,
              collapseRender: () => false,
              optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
            }}
            pagination={false}
            rowKey="id"
            request={async (params: any) => {
              const res = await getkeyPerson({
                queryObject: {
                  ...params,
                  posTypeList: [
                    'd6697b08-8afe-47d3-8b1b-99fa39ac3555',
                    'e7961c17-f52b-4893-9cd2-30fc63042b56',
                    '3c1dad35-8c26-4d6a-b530-db5178a253a9',
                    '3f1a1562-7d53-415e-a585-9c45f2c42400',
                  ],
                  organizationId,
                  page: 0,
                  size: 999999,
                  ascending: false,
                  pageSize: 10,
                  propertyName: 'sortIndex',
                  sortOrder: 'desc',
                  flag: 1,
                  type: true,
                },
              });
              if (res.code !== 200) {
                message.error(res.message);
              }
              const data =
                res.result?.page?.content?.map((item: any) => {
                  item.startTime = formatDate(day).split(' ')[0] + ' 08:00:00';
                  item.endTime = formatDate(day).split(' ')[0] + ' 18:00:00';
                  return item;
                }) || [];

              const colu: ProColumns<TableListItem>[] = [
                {
                  title: '姓名',
                  width: '100px',
                  dataIndex: 'name',
                  render: (name: any) => {
                    return name;
                  },
                },
                {
                  title: '手机号',
                  dataIndex: 'phoneNumber',
                  render: (phoneNumber: any) => {
                    return phoneNumber;
                  },
                  search: false,
                },
                {
                  title: '类型',
                  width: '100px',
                  dataIndex: 'posTypeName',
                  search: false,
                },
              ];
              setColumns(colu);

              return {
                data,
                success: res.code === 200 ? true : false,
              };
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default SelectModel;

import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  getList,
  deleteSlef,
  move,
  editIcon,
  solutionDetail,
  editTask,
} from '../../../services/task';
import DetailUnit from './components/Detail';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useAccess, Access } from 'umi';
import SelectModel from './components/AddPerson';
import Add from './components/Add';
import { getToken } from '@/utils/auth';
type TableListItem = {
  name: string;
  id: string;
  solutionId: string;
  organizationId: string;
};
type Itable = {
  location: any;
};
const TableList: React.FC<Itable> = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<any>({});
  const [showDeatail, setShowDeatail] = useState<boolean>(false);
  const [type, setType] = useState<boolean>(true);
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();
  const params = { type };
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [modelShow, setModelShow] = useState<boolean>(false); // 派发按钮
  const [givsFlag, setGivsFlag] = useState<boolean>(false); // 派发按钮
  const [organizationId, setOrganizationId] = useState<string>(); // 组织id

  const [solutionId, setSolutionId] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [lon, setLon] = useState<string>('');
  const [lat, setLat] = useState<string>('');
  const [solutionPersonList, setSolutionPersonList] = useState<any[]>([]);
  const [giveData, setGiveData] = useState<any>();
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>();
  const [recordself, setRecord] = useState<any>();
  //导出
  const [exportParams, setExportParams] = useState<any>(); //查询人员列表存放所有
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]); //多选存放选择人员

  type ExportExcel = {
    titleName: string;
    columnName: string;
  };
  const exportExcelColumns: ExportExcel[] = [
    {
      titleName: '任务名称',
      columnName: 'name',
    },
    {
      titleName: '所属组织',
      columnName: 'orgName',
    },
    {
      titleName: '任务状态',
      columnName: 'status',
    },
    {
      titleName: '关联活动',
      columnName: 'activityName',
    },
    {
      titleName: '开始时间',
      columnName: 'startTime',
    },
    {
      titleName: '结束时间',
      columnName: 'endTime',
    },
  ];
  const download = (url: string, name: string) => {
    const aLink = document.createElement('a');
    document.body.appendChild(aLink);
    aLink.style.display = 'none';
    aLink.href = url;
    aLink.setAttribute('download', name);
    aLink.click();
    document.body.removeChild(aLink);
  };
  const exportFile = (url: any, param: any, name: any) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getToken(),
      },
      body: JSON.stringify(param),
    })
      .then((res) => res.blob())
      .then((data) => {
        const href = window.URL.createObjectURL(data);
        download(href, name);
      });
  };
  const toExport = (rows: any) => {
    if (rows.length > 0) {
      exportFile(
        '/api/arTask/exportExcel',
        {
          dataList: rows,
          exportExcelInfos: exportExcelColumns,
          fileName: '岗位任务',
        },
        '岗位任务.xlsx',
      );
    } else {
      // message.error('请选择需要导出的数据');
      exportFile(
        '/api/arTask/exportExcel',
        {
          dataList: exportParams,
          exportExcelInfos: exportExcelColumns,
          fileName: '岗位任务',
        },
        '岗位任务.xlsx',
      );
    }
  };

  const handleRemove = async (ids: string[]) => {
    if (!ids) return;
    try {
      const deleteInfo = await deleteSlef(ids);
      if (deleteInfo.code === 200) {
        setSelectedRowKeys([]);
        setType(!type);
      }
    } catch (error: any) {
      message.error(error.message);
      return;
    }
  };
  const handleRemoveOne = async (ids: string[]) => {
    Modal.confirm({
      title: '是否确认删除？',
      onOk: () => {
        handleRemove(ids);
      },
    });
  };
  useEffect(() => {
    solutionDetail({ id: solutionId })
      .then((res: any) => {
        setLon(res.data.lon);
        setLat(res.data.lat);
        setGiveData(res?.data);
        setSolutionPersonList(res?.data?.solutionPersonList);
        setGivsFlag(true);
      })
      .catch((err: any) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDeatail, modelShow]);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 80,
      ellipsis: true,
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      hideInSearch: false,
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '所属组织',
      ellipsis: true,
      hideInSearch: true,
      dataIndex: 'orgName',
    },
    {
      title: '任务状态',
      hideInSearch: true,
      ellipsis: true,
      dataIndex: 'status',
      render: (_, res: any) => {
        return res.status === '0' ? '未派发' : '已派发';
      },
    },
    {
      title: '关联活动',
      hideInSearch: true,
      ellipsis: true,
      dataIndex: 'activityName',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '结束时间',
      hideInSearch: true,
      ellipsis: true,
      dataIndex: 'endTime',
    },
    {
      title: '操作',
      width: 250,
      dataIndex: 'option',
      valueType: 'option',
      hideInSetting: true,
      fixed: 'right',
      render: (_, record) => [
        <a
          title="上移"
          key="up"
          type="link"
          onClick={() => {
            const datas = {
              queryObject: {
                pageNumber: current,
                pageSize: pageSize,
                sortColumn: 'sortIndex',
                sortOrder: 'desc',
              },
              updateModel: {
                data: {
                  id: record.id,
                  isUp: true,
                },
              },
            };
            move(datas)
              .then((res) => {
                if (res.code === 200) {
                  setType(!type);
                }
              })
              .catch((res) => {
                message.warning(res.message);
              });
          }}
        >
          <ArrowUpOutlined />
        </a>,
        <a
          title="下移"
          key="down"
          type="link"
          onClick={() => {
            const datas = {
              queryObject: {
                pageNumber: current,
                pageSize: pageSize,
                sortColumn: 'sortIndex',
                sortOrder: 'desc',
              },
              updateModel: {
                data: {
                  id: record.id,
                  isUp: false,
                },
              },
            };
            move(datas)
              .then((res) => {
                if (res.code === 200) {
                  setType(!type);
                } else {
                  message.warning(res.message);
                }
              })
              .catch((res) => {
                message.warning(res.message);
              });
          }}
        >
          <ArrowDownOutlined />
        </a>,
        <a
          key="detail"
          onClick={() => {
            setRecord(record);
            setSolutionId(record?.solutionId);
            setShowDeatail(true);
            setRow(record);
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('taskEdit')} key="taskEdit">
          <a
            key="edit"
            onClick={() => {
              setEditData(record);
              setShowAdd(true);
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('taskGive')} key="taskGive">
          <a
            key="edit"
            onClick={() => {
              setRecord(record);
              setOrganizationId(record.organizationId);
              setId(record.id);
              setSolutionId(record?.solutionId);
              setModelShow(true);
            }}
          >
            派发
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('taskDelete')} key="taskDelete">
          <a
            key="del"
            onClick={() => {
              handleRemoveOne([record.id]);
            }}
          >
            删除
          </a>
        </Access>,
      ],
    },
  ];
  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProTable<TableListItem>
        params={params}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        tableRender={(_props, dom) => {
          return dom;
        }}
        actionRef={actionRef}
        tableAlertRender={false}
        options={{
          density: false,
          fullScreen: undefined,
          reload: undefined,
          setting: false,
        }}
        rowKey="id"
        pagination={{
          responsive: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        search={{
          labelWidth: 100,
          span: 5,
          layout: 'horizontal',
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
        }}
        toolBarRender={() => [
          <Access accessible={access.btnHasAuthority('stationDelete')} key="stationDelete">
            <Button
              style={{ float: 'left' }}
              onClick={() => {
                if (selectedRowKeys.length > 0) {
                  handleRemoveOne(selectedRowKeys);
                } else {
                  message.error('请至少选择一条数据');
                }
              }}
            >
              批量删除
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('tasktExport')} key="tasktExport">
            <Button
              onClick={() => {
                toExport(selectedRowsState);
              }}
            >
              导出
            </Button>
          </Access>,
        ]}
        request={async (paramss) => {
          const res = await getList({
            ...paramss,
            pageNumber: paramss.current as number,
            pageSize: paramss.pageSize,
            sortColumn: 'sortIndex',
            sortOrder: 'desc',
          });
          setCurrent((paramss.current as number) - 1);
          setPageSize((paramss.pageSize as number) - 1);
          setExportParams(res.data.rows);
          if (res.code === 200) {
          } else {
            message.error(res.message);
          }
          return {
            data: res.data.rows,
            success: res.code === 200 ? true : false,
            total: res.data.totalCount,
          };
        }}
        rowSelection={{
          fixed: true,
          selectedRowKeys,
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
            setSelectedRowKeys(_);
          },
        }}
        columns={columns}
      />
      {showDeatail && giveData !== undefined && (
        <DetailUnit
          giveData={giveData}
          onCancel={() => {
            setShowDeatail(false);
          }}
          modalVisible={showDeatail}
          info={row}
          title={'任务详情'}
          recordself={recordself}
        />
      )}
      {/* 派发 */}
      {givsFlag && (
        <SelectModel
          recordself={recordself}
          key={recordself?.id}
          organizationId={organizationId}
          typeflag="派发人员"
          modelShow={modelShow}
          cancel={() => {
            setModelShow(false);
          }}
          selectedList={solutionPersonList.map((item) => item.personId)}
          save={(e: any) => {
            let value: any;
            if (e.length > 0) {
              value = e.map((item: any) => {
                return item.personId;
              });
              let data = [...new Set(value)];
              data = data.map((item: any) => {
                return { personId: item };
              });

              editIcon({
                solutionPersonList: data || [],
                id: solutionId,
                lon,
                lat,
              })
                .then((result: any) => {
                  if (result.code == 200) {
                    editTask({ id, status: 1 })
                      .then((res) => {
                        if (res.code == 200) {
                          message.success('派发成功');
                          actionRef.current?.reload();
                        }
                      })
                      .catch((err: any) => {
                        console.log(err);
                      });
                  }
                })
                .catch((err: any) => {
                  message.error(err.message);
                });
            }
          }}
        />
      )}
      {/* 编辑 */}
      {showAdd && (
        <Add
          showAdd={true}
          editData={editData}
          change={() => {
            setShowAdd(false);
          }}
          reload={() => {
            actionRef?.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};

export default TableList;

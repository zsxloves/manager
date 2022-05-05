import React, { useState, useRef } from 'react';
import { Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getmatchList, deleteSlef, move } from '../../../services/station';
import DetailUnit from './components/DetailUnit';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useAccess, Access } from 'umi';
import Addpage from './components/Add';
import { getToken } from '@/utils/auth';
import ImportPerson from './components/ImportPerson'; //导入
import { getBit } from '@/utils/utilsJS';
type TableListItem = {
  name: string;
  id: string;
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
  const [edit, setEdit] = useState<any>();
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [exportParams, setExportParams] = useState<any>(); //查询人员列表存放所有
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]); //多选存放选择人员
  const [importVisible, setImportVisible] = useState<boolean>(false); //导入状态
  const download = (url: string, name: string) => {
    const aLink = document.createElement('a');
    document.body.appendChild(aLink);
    aLink.style.display = 'none';
    aLink.href = url;
    aLink.setAttribute('download', name);
    aLink.click();
    document.body.removeChild(aLink);
  };
  // 导出
  type ExportExcel = {
    titleName: string;
    columnName: string;
  };
  const exportExcelColumns: ExportExcel[] = [
    {
      titleName: '卡口名称',
      columnName: 'name',
    },
    {
      titleName: '朝向',
      columnName: 'directions',
    },
    {
      titleName: '通道ID',
      columnName: 'devChnId',
    },
    {
      titleName: '经度',
      columnName: 'lon',
    },
    {
      titleName: '纬度',
      columnName: 'lat',
    },
  ];
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
  //导出
  const toExport = (rows: any) => {
    if (rows.length > 0) {
      exportFile(
        '/api/arVias/exportExcel',
        {
          dataList: rows,
          exportExcelInfos: exportExcelColumns,
          fileName: '卡口',
        },
        '卡口.xlsx',
      );
    } else {
      // message.error('请选择需要导出的数据');
      exportFile(
        '/api/arVias/exportExcel',
        {
          dataList: exportParams,
          exportExcelInfos: exportExcelColumns,
          fileName: '卡口',
        },
        '卡口.xlsx',
      );
    }
  };
  // 批量删除
  const handleRemove = async (ids: string[]) => {
    if (!ids) return;
    try {
      const deleteInfo = await deleteSlef(ids);
      console.log('删除', deleteInfo);
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
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 80,
      ellipsis: true,
    },
    {
      title: '卡口名称',
      dataIndex: 'name',
      hideInSearch: false,
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '朝向',
      dataIndex: 'directions',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '通道ID',
      hideInSearch: true,
      ellipsis: true,
      dataIndex: 'devChnId',
    },
    {
      title: '经度',
      ellipsis: true,
      hideInSearch: true,
      dataIndex: 'lon',
    },
    {
      title: '纬度',
      hideInSearch: true,
      ellipsis: true,
      dataIndex: 'lat',
    },
    {
      title: '操作',
      width: 200,
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
            setShowDeatail(true);
            setRow(record);
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('stationEdit')} key="stationEdit">
          <a
            key="edit"
            onClick={() => {
              setEdit(record);
              setShowAdd(true);
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('stationDelete')} key="stationDelete">
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
        scroll={{ x: '100%', y: 'auto' }}
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
          <Access accessible={access.btnHasAuthority('stationsAdd')} key="stationsAdd">
            <Button
              type="primary"
              onClick={() => {
                setEdit('');
                setShowAdd(true);
              }}
            >
              新增
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('stationImport')} key="stationImport">
            <Button
              onClick={() => {
                setImportVisible(true);
              }}
            >
              导入
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('stationExport')} key="stationExport">
            <Button
              onClick={() => {
                toExport(selectedRowsState);
              }}
            >
              导出
            </Button>
          </Access>,
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
        ]}
        request={async (paramss) => {
          const res = await getmatchList({
            ...paramss,
            pageNumber: (paramss.current as number) - 1,
            pageSize: paramss.pageSize,
            sortColumn: 'sortIndex',
            sortOrder: 'desc',
          });
          setCurrent((paramss.current as number) - 1);
          setPageSize(paramss.pageSize as number);
          setExportParams(res?.data?.rows);
          if (res.data.rows?.length > 0) {
            res.data.rows.map((item: any) => {
              item.lon = getBit(item?.lon, 10);
              item.lat = getBit(item?.lat, 10);
            });
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
      {showDeatail && (
        <DetailUnit
          onCancel={() => {
            setShowDeatail(false);
          }}
          modalVisible={showDeatail}
          info={row}
          title={'卡口详情'}
        />
      )}
      {/* 新增 */}
      {showAdd && (
        <Addpage
          showAdd={true}
          edit={edit}
          change={() => {
            setShowAdd(false);
          }}
          reload={() => {
            actionRef?.current?.reload();
          }}
        />
      )}
      {/* 导入 */}
      {importVisible && (
        <ImportPerson
          importVisible={importVisible}
          onSub={() => {
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
          ok={() => {
            setImportVisible(false);
          }}
        />
      )}
    </PageContainer>
  );
};

export default TableList;

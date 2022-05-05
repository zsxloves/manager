import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { getHouse, batchDeleteHouse, moveHouse } from '@/services/securityResources';
import { getToken } from '@/utils/auth';
import { calcPageNo, getBit } from '@/utils/utilsJS';
import Upload from '@/components/Upload';
import UpdateHouse from './components/UpdateHouse';
import RealDetail from './components/RealDetail';
import { useAccess, Access } from 'umi';

type TableListItem = {
  [key: string]: any;
  id: string;
};

type ExportExcel = {
  titleName: string;
  columnName: string;
};

const RealHouse: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [updateType, setUpdateType] = useState<boolean>(false); //更新状态
  const [modalType, setModalType] = useState<string>(); //弹框类型
  const [detailId, setDetailId] = useState<string>();
  const [detailType, setDetailType] = useState<boolean>(false);
  const [houseId, setHouseId] = useState<string>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [importName, setName] = useState<string>();
  const [iportUrl, setUrl] = useState<string>();
  const [selectedRowsState, setSelectedRowsState] = useState<any>([]); //导出所有数据
  const [equipAllInfo, setEquipAllInfo] = useState<any>(); //整页数据
  const [equipUpload, setEquipUpload] = useState<boolean>(false); //导入状态
  const [type, setType] = useState<boolean>(true);
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();
  const [totle, setTotle] = useState<number>();
  const access = useAccess();
  const params = { type };
  //房屋
  const exportPersonExcelInfos: { columnName: string }[] = [
    { columnName: 'address' },
    { columnName: 'pcsmc' },
    { columnName: 'pcsdm' },
    { columnName: 'areaName' },
    { columnName: 'lon' },
    { columnName: 'lat' },
    { columnName: 'height' },
  ];
  const exportExcelColumns: ExportExcel[] = [
    {
      titleName: '派出所名称',
      columnName: 'pcsmc',
    },
    {
      titleName: '派出所代码',
      columnName: 'pcsdm',
    },
    {
      titleName: '所属区域',
      columnName: 'areaName',
    },
    {
      titleName: '标准地址',
      columnName: 'address',
    },
    {
      titleName: '经度',
      columnName: 'lon',
    },
    {
      titleName: '纬度',
      columnName: 'lat',
    },
    {
      titleName: '高度',
      columnName: 'height',
    },
  ];

  // 重新加载table
  const heavyLoad = () => {
    setType(!type);
  };

  /**
   * 删除字典
   *
   * @param ids
   */
  const handleRemove = async (ids: string[]) => {
    if (!ids) return true;
    try {
      const deleteInfo = await batchDeleteHouse(ids);
      if (deleteInfo.code === 200) {
        message.success('删除成功！');
        setSelectedRowKeys([]);
        setSelectedRowsState([]);
        const delPage = calcPageNo(totle, current, pageSize, ids.length);
        actionRef.current?.setPageInfo!({ current: delPage, pageSize });
        heavyLoad();
      }
      return true;
    } catch (error: any) {
      message.error(error.message);
      return false;
    }
  };

  const handleRemoveOne = async (ids: string[]) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        handleRemove(ids);
      },
    });
  };

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
  //导出
  const toExport = (rows: any) => {
    if (rows.length > 0) {
      exportFile(
        '/api/arHouse/exportExcel',
        {
          dataList: rows,
          exportExcelInfos: exportExcelColumns,
          fileName: '房屋管理表',
        },
        '房屋管理表.xlsx',
      );
    } else {
      exportFile(
        '/api/arHouse/exportExcel',
        {
          dataList: equipAllInfo,
          exportExcelInfos: exportExcelColumns,
          fileName: '房屋管理表',
        },
        '房屋管理表.xlsx',
      );
    }
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
      title: '派出所名称',
      dataIndex: 'pcsmc',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '派出所代码',
      dataIndex: 'pcsdm',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '标准地址',
      dataIndex: 'address',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '区域名称',
      dataIndex: 'areaName',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '经度',
      dataIndex: 'lon',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '纬度',
      dataIndex: 'lat',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '高度',
      dataIndex: 'height',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 230,
      dataIndex: 'option',
      valueType: 'option',
      hideInSetting: true,
      render: (_, record) => [
        <a
          key="up"
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
            moveHouse(datas)
              .then((res) => {
                if (res.code === 200) {
                  setType(!type);
                } else {
                  message.warning(res.message);
                }
              })
              .catch((err) => {
                message.warning(err.message || err);
              });
          }}
        >
          <ArrowUpOutlined />
        </a>,
        <a
          key="down"
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
            moveHouse(datas)
              .then((res) => {
                if (res.code === 200) {
                  setType(!type);
                } else {
                  message.warning(res.message);
                }
              })
              .catch((err) => {
                message.warning(err.message || err);
              });
          }}
        >
          <ArrowDownOutlined />
        </a>,
        <a
          key="detail"
          onClick={() => {
            setDetailId(record.id);
            setDetailType(true);
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('realHouseEdit')} key="realHouseEdit">
          <a
            key="edit"
            onClick={() => {
              setHouseId(record.id);
              setUpdateType(true);
              setModalType('edit');
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('realHouseDel')} key="realHouseDel">
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
    <>
      <PageContainer title={false} breadcrumb={undefined}>
        <ProTable<TableListItem>
          params={params}
          form={{ ignoreRules: false }}
          scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
          tableRender={(_props, dom) => {
            return dom;
          }}
          actionRef={actionRef}
          tableAlertRender={false}
          options={false}
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
            searchText: '查询',
            optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
          }}
          rowSelection={{
            fixed: true,
            selectedRowKeys,
            onChange: (_, selectedRows) => {
              setSelectedRowsState(selectedRows);
              setSelectedRowKeys(_);
            },
          }}
          toolBarRender={() => [
            <Access accessible={access.btnHasAuthority('realHouseAdd')} key="realHouseAdd">
              <Button
                type="primary"
                onClick={() => {
                  setUpdateType(true);
                  setModalType('add');
                }}
              >
                新增
              </Button>
              ,
            </Access>,
            <Access
              accessible={access.btnHasAuthority('equipManageImport')}
              key="equipManageImport"
            >
              <Button
                key="button"
                onClick={() => {
                  setEquipUpload(true);
                  setUrl('/api/arHouse/importExcel');
                  // setIsUpload(true);
                  setName('房屋导入');
                }}
              >
                导入
              </Button>
            </Access>,
            <Access
              accessible={access.btnHasAuthority('equipManageExport')}
              key="equipManageExport"
            >
              <Button
                key="button"
                onClick={() => {
                  if (!equipAllInfo?.length) {
                    message.warning('导出数据为空');
                    return;
                  }
                  toExport(selectedRowsState);
                }}
              >
                导出
              </Button>
            </Access>,
            <Access accessible={access.btnHasAuthority('realHouseDel')} key="realHouseDel">
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
              </Button>
            </Access>,
          ]}
          request={async (paramss) => {
            const { data, code } = await getHouse({
              // ...paramss,
              address: paramss.address,
              pageNumber: paramss.current,
              pageSize: paramss.pageSize,
              sortColumn: 'sortIndex',
              sortOrder: 'desc',
            });
            setCurrent(paramss.current);
            setPageSize(paramss.pageSize);
            setTotle(data.totalCount);
            // setExportParams(res.result.page.content);
            const list = data.rows || [];
            if (list?.length > 0) {
              list.map((item: any) => {
                item.lon = getBit(item?.lon, 10);
                item.lat = getBit(item?.lat, 10);
              });
            }
            setEquipAllInfo(list);
            return {
              data: list,
              success: code === 200 ? true : false,
              total: data.totalCount,
            };
          }}
          columns={columns}
        />
        {updateType && (
          <UpdateHouse
            houseId={houseId as string}
            modalType={modalType as string}
            updateType={updateType}
            heavyLoads={heavyLoad}
            cancel={() => {
              setUpdateType(false);
              setHouseId('');
            }}
          />
        )}
        {equipUpload && (
          <Upload
            title={importName as string}
            updateModalVisible={equipUpload}
            url={iportUrl as string}
            exportExcelHeaderInfos={exportPersonExcelInfos as { columnName: string }[]}
            onSubmit={() => {
              if (actionRef.current) {
                actionRef.current.reload();
              }
              setEquipUpload(false);
            }}
            onCancel={() => {
              setEquipUpload(false);
            }}
            showTemplate={true}
            downloadTemplate={() => {
              const a = document.createElement('a');
              a.href = '/excel/房屋管理模板.xlsx';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          />
        )}
        <RealDetail
          persId={detailId as string}
          detailVisible={detailType}
          cancelDetail={() => {
            setDetailId('');
            setDetailType(false);
          }}
        />
      </PageContainer>
    </>
  );
};

export default RealHouse;

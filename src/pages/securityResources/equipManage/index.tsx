import React, { useState, useRef } from 'react';
import { Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getDeviceList, deleteDevice, moveDevice } from '@/services/securityResources';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { getToken } from '@/utils/auth';
import { calcPageNo } from '@/utils/utilsJS';
import Upload from '@/components/Upload';
import DetailEquip from './components/DetailEquip';
import UpdateEquip from './components/UpdateEquip';
import { useAccess, Access } from 'umi';

type TableListItem = {
  id: string;
  key?: number;
  name: string;
  code: string;
  remark: string;
  value: string;
  fatherDictz?: string;
  personInfoList?: string[];
};
type ExportExcel = {
  titleName: string;
  columnName: string;
};

const EquipManage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [checkEquip, setCheckEquip] = useState<boolean>(false); //装备详情
  const [updateTitle, setUpdateTitle] = useState<string>(); //新增编辑类型
  const [add, setAdd] = useState<boolean>(false); //新增编辑
  const [selectedRowsState, setSelectedRowsState] = useState<any>([]); //导出所有数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [equipAllInfo, setEquipAllInfo] = useState<any>(); //整页数据
  const [equipUpload, setEquipUpload] = useState<boolean>(false); //导入状态
  const [importName, setName] = useState<string>();
  const [iportUrl, setUrl] = useState<string>();
  const [eqId, setEqId] = useState<string>();
  // eslint-disable-next-line @typescript-eslint/ban-types
  const [equipInfo, setEquipInfo] = useState<{}>();
  const [type, setType] = useState<boolean>(true);
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();
  const [totle, setTotle] = useState<number>();
  const access = useAccess();
  const params = { type };

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
      const deleteInfo = await deleteDevice(ids);
      if (deleteInfo.code === 200) {
        setSelectedRowKeys([]);
        setSelectedRowsState([]);
        message.success(deleteInfo.message);
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
  //装备
  const exportPersonExcelInfos: { columnName: string }[] = [
    { columnName: 'name' },
    { columnName: 'typeName' },
    { columnName: 'idCardCode' },
    { columnName: 'organizationName' },
    { columnName: 'company' },
    { columnName: 'deviceId' },
    { columnName: 'vedioId' },
    { columnName: 'remark' },
  ];

  const exportExcelColumns: ExportExcel[] = [
    {
      titleName: '装备名称',
      columnName: 'name',
    },
    {
      titleName: '装备类别',
      columnName: 'typeName',
    },
    {
      titleName: '所属组织',
      columnName: 'organizationName',
    },
    {
      titleName: '关联人员',
      columnName: 'relatedPersonName',
    },
    {
      titleName: '品牌单位',
      columnName: 'company',
    },
    {
      titleName: 'GPSID',
      columnName: 'deviceId',
    },
    {
      titleName: '视频ID',
      columnName: 'vedioId',
    },
    {
      titleName: '备注',
      columnName: 'remark',
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
  //导出
  const toExport = (rows: any) => {
    if (rows.length > 0) {
      exportFile(
        '/api/tArGpsDevice/exportExcel',
        {
          dataList: rows,
          exportExcelInfos: exportExcelColumns,
          fileName: '装备管理表',
        },
        '装备管理表.xlsx',
      );
    } else {
      exportFile(
        '/api/tArGpsDevice/exportExcel',
        {
          dataList: equipAllInfo,
          exportExcelInfos: exportExcelColumns,
          fileName: '装备管理表',
        },
        '装备管理表.xlsx',
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
      title: '装备名称',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '装备类别',
      dataIndex: 'typeName',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '关联人员',
      dataIndex: 'relatedPersonName',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '品牌单位',
      dataIndex: 'company',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: 'GPSID',
      dataIndex: 'deviceId',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '视频ID',
      dataIndex: 'vedioId',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '操作',
      width: 260,
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
            moveDevice(datas)
              .then((res) => {
                if (res.code === 200) {
                  heavyLoad();
                } else {
                  message.warning(res.message);
                }
              })
              .catch((err) => {
                message.warning(err.message);
              });
          }}
        >
          <ArrowUpOutlined />
        </a>,
        <a
          key="low"
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
            moveDevice(datas)
              .then((res) => {
                if (res.code === 200) {
                  heavyLoad();
                } else {
                  message.warning(res.message);
                }
              })
              .catch((err) => {
                message.warning(err.message);
              });
          }}
        >
          <ArrowDownOutlined />
        </a>,
        <a
          key="detail"
          onClick={() => {
            setEqId(record.id);
            setEquipInfo(record);
            setCheckEquip(true);
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('equipManageEdit')} key="equipManageEdit">
          <a
            key="edit"
            onClick={() => {
              setAdd(true);
              setEqId(record.id);
              setEquipInfo(record);
              setUpdateTitle('edit');
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('equipManageDel')} key="equipManageDel">
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
        form={{ ignoreRules: false }}
        params={params}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        tableRender={(_props, dom) => {
          return dom;
        }}
        actionRef={actionRef}
        tableAlertRender={false}
        options={false}
        rowKey="id"
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
        pagination={{
          responsive: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        toolBarRender={() => [
          <Access accessible={access.btnHasAuthority('equipManageAdd')} key="equipManageAdd">
            <Button
              type="primary"
              onClick={() => {
                setAdd(true);
                setUpdateTitle('add');
              }}
            >
              新增
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('equipManageImport')} key="equipManageImport">
            <Button
              key="button"
              onClick={() => {
                setEquipUpload(true);
                setUrl('/api/tArGpsDevice/importExcel');
                // setIsUpload(true);
                setName('装备导入');
              }}
            >
              导入
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('equipManageExport')} key="equipManageExport">
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
          <Access accessible={access.btnHasAuthority('equipManageDel')} key="equipManageDel">
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
          const res = await getDeviceList({
            ...paramss,
            pageNumber: paramss.current,
            pageSize: paramss.pageSize,
            sortColumn: 'sortIndex',
            sortOrder: 'desc',
          });
          const data = res.data.rows;
          setCurrent(paramss.current);
          setPageSize(paramss.pageSize);
          setEquipAllInfo(data);
          setTotle(res.data.totalCount);
          for (let i = 0; i < data.length; i++) {
            data[i].relatedPersonName = '';
            if (data[i].personInfoList.length != 0) {
              for (let j = 0; j < data[i].personInfoList.length; j++) {
                data[i].relatedPersonName += data[i].personInfoList[j].name;
                if (j < data[i].personInfoList.length - 1) {
                  data[i].relatedPersonName += ',';
                }
              }
            }
          }
          return {
            data,
            success: res.success,
            total: res.data.totalCount,
          };
        }}
        columns={columns}
      />
      {add && (
        <UpdateEquip
          title={updateTitle as string}
          equipVisible={add}
          equipId={eqId as string}
          // eslint-disable-next-line @typescript-eslint/ban-types
          equipInfo={equipInfo as {}}
          heavyLoad={heavyLoad}
          cancelModal={() => {
            setAdd(false);
            setEqId('');
            setEquipInfo({});
          }}
        />
      )}
      <DetailEquip
        title={'装备详情'}
        equipInfo={equipInfo as Record<string, unknown>}
        checkEquip={checkEquip}
        onCancel={() => {
          setCheckEquip(false);
        }}
      />
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
            a.href = '/excel/装备管理模板.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        />
      )}
    </PageContainer>
  );
};

export default EquipManage;

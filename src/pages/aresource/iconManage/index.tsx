import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal, Image } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useAccess, Access } from 'umi';
import Detail from '@/pages/securityActivities/activityManage/detail/detail';
import { getTableData, move, deleteIcon, getInfoById } from '@/services/iconManage';
import AddIcon from './components/add';
import { calcPageNo } from '@/utils/utilsJS';
import style from '../../securityActivities/activityManage/index.less';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

type TableListItem = {
  id: string;
  [key: string]: any;
  lat: number | string;
  lon: number | string;
};
const IconManage: React.FC<Props> = () => {
  const actionRef = useRef<ActionType>();
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [totle, setTotle] = useState<number>();
  const [showAdd, setShow] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [iconType, setIconType] = useState<string>('');
  const [item, setItem] = useState<any>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const access = useAccess();
  const [type, setType] = useState<boolean>(true);
  const params = { type };

  const handleRemoveOne = async (ids: string[]) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        deleteIcon(ids).then((res) => {
          if (res.code === 200) {
            message.success('删除成功！');
            setSelectedRowKeys([]);
            const delPage = calcPageNo(totle, current, pageSize, ids.length);
            actionRef.current?.setPageInfo!({ current: delPage, pageSize });
            setType(!type);
          } else {
            message.warning(res.message);
          }
        });
      },
    });
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (_, record, index) => index + 1,
      width: 100,
      search: false,
    },
    {
      title: '图标名称',
      dataIndex: 'title',
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
        rules: [
          {
            min: 1,
            max: 20,
          },
        ],
      },
    },
    {
      title: '级别',
      dataIndex: 'levelName',
      ellipsis: true,
      search: false,
    },
    // {
    //   title: '数量',
    //   dataIndex: 'num',
    //   ellipsis: true,
    //   search: false,
    // },
    {
      title: '图标类型',
      dataIndex: 'typeName',
      ellipsis: true,
      search: false,
    },
    {
      title: '编辑类型',
      dataIndex: 'edittypeName',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      search: false,
      width: 300,
      render: (text, record) => [
        <ArrowUpOutlined
          className={style['activity-arrow']}
          onClick={() => {
            moveItem(record, true);
          }}
        />,
        <ArrowDownOutlined
          className={style['activity-arrow']}
          onClick={() => {
            moveItem(record, false);
          }}
        />,
        <a
          target="_blank"
          rel="noopener noreferrer"
          key="view"
          onClick={() => {
            getInfoById(record.id)
              .then((res) => {
                setShowDetail(true);
                setItem(res.data);
              })
              .catch((res) => {
                message.warning(res.message);
              });
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('iconManageEdit')} key="iconManageEdit">
          <a
            key="editable"
            onClick={() => {
              getInfoById(record.id)
                .then((res) => {
                  setShow(true);
                  setItem(res.data);
                  setIconType('edit');
                })
                .catch((res) => {
                  message.warning(res.message);
                });
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('iconManageDel')} key="iconManageDel">
          <a
            target="_blank"
            rel="noopener noreferrer"
            key="view"
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

  const detailColumn: ProColumns<TableListItem>[] = [
    {
      title: '图标',
      render: (text, record) => {
        return <Image width={40} height={40} src={record.minioFileUrl} />;
      },
    },
    {
      title: '编号',
      dataIndex: 'code',
    },
  ];

  function moveItem(item1: TableListItem, isUp: boolean) {
    move(current, pageSize, item1.id, isUp)
      .then(() => {
        setType(!type);
      })
      .catch((res) => {
        message.warning(res.message);
      });
  }

  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProTable<TableListItem>
        params={params}
        columns={columns}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        actionRef={actionRef}
        rowKey="id"
        tableAlertRender={false}
        pagination={{
          responsive: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        request={async (paramss) => {
          const res = await getTableData({
            title: paramss.title,
            pageNumber: paramss.current,
            pageSize: paramss.pageSize,
            sortColumn: 'sortIndex',
            sortOrder: 'desc',
          });
          const { rows } = res.data;
          setCurrent(paramss.current as number);
          setPageSize(paramss.pageSize as number);
          setTotle(res.data.totalCount);
          return {
            data: rows,
            success: res.code === 200 ? true : false,
            total: res.data.totalCount,
          };
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
          onChange: (keys) => {
            setSelectedRowKeys(keys);
          },
        }}
        dateFormatter="string"
        options={false}
        toolBarRender={() => [
          <Access accessible={access.btnHasAuthority('iconManageAdd')} key="iconManageAdd">
            <Button
              key="button"
              type="primary"
              onClick={() => {
                setShow(true);
                setIconType('add');
                setItem({});
              }}
            >
              新增
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('iconManageDel')} key="iconManageDel">
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
      />
      <Detail
        show={showDetail}
        baseInfo={item}
        detailTabTow="图标图片"
        detailColumn={detailColumn}
        json="样式json"
        detailData={item?.childrenList?.sort((a: any, b: any) => a.code - b.code)}
        config={[
          { label: '图标名称', index: 'title' },
          { label: '级别', index: 'levelName' },
          { label: '图标类型', index: 'typeName' },
          { label: '编辑类型', index: 'edittypeName', span: 2 },
          { label: '插入人', index: 'inserterName' },
          { label: '插入时间', index: 'insertTime' },
          { label: '更新人', index: 'updaterName' },
          { label: '更新时间', index: 'updateTime' },
          { label: '样式json', index: 'style', span: 2 },
        ]}
        onClose={() => {
          setShowDetail(false);
        }}
        title="图标详情"
      />
      {showAdd && (
        // eslint-disable-next-line react/self-closing-comp
        <AddIcon
          iType={iconType}
          show={showAdd}
          onCancel={() => {
            setShow(false);
          }}
          onConfirm={() => {
            setShow(false);
            setItem({});
            setType(!type);
          }}
          item={item}
        ></AddIcon>
      )}
    </PageContainer>
  );
};

export default IconManage;

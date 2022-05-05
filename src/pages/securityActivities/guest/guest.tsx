import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

import {
  getTableData,
  move,
  getInfoById,
  batchDeleteguest,
} from '../../../services/guestManager/index';
import style from '../activityManage/index.less';
import Detail from '../activityManage/detail/detail';
import AddGuest from './components/add';
import { calcPageNo } from '@/utils/utilsJS';
import { useAccess, Access } from 'umi';

type TableListItem = {
  id: string;
  [key: string]: any;
  lat: number | string;
  lon: number | string;
  ascending: boolean;
  page?: number;
  size?: number;
};
interface Props {
  id?: string;
}

const Guest: React.FC<Props> = () => {
  const actionRef = useRef<ActionType>();
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [totle, setTotle] = useState<number>();
  const [guestType, setGuesType] = useState<string>('');
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [item, setItem] = useState<any>({});
  const [type, setType] = useState<boolean>(true);
  const params = { type };
  const access = useAccess();

  const handleRemoveOne = async (ids: string[]) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        batchDeleteguest(ids).then((res) => {
          if (res.code === 200) {
            message.success('删除成功！');
            setSelectedRowKeys([]);
            const delPage = calcPageNo(totle, (current as number) + 1, pageSize, ids.length);
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
      title: '嘉宾姓名',
      dataIndex: 'name',
      ellipsis: true,
      width: '200px',
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '所属活动',
      dataIndex: 'orgName',
      search: false,
      ellipsis: true,
      width: '400px',
      render: (text, record) => {
        return record?.arActivityVOS?.map((v: any) => v.name).join(',');
      },
    },
    {
      title: '职业',
      dataIndex: 'job',
      ellipsis: true,
      search: false,
    },
    {
      title: '嘉宾类型',
      dataIndex: 'typeName',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      search: false,
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
            // getInfoById(record.id).then((res) => {
            //   if (res.code == 200) {
            //     const data = res.result.detail;
            //     setShowDetail(true);
            //     data.actNames = data?.arActivityVOS?.map((v: any) => v.name);
            //     setItem(data);
            //   } else {
            //     message.error(res.message);
            //   }
            // });
            const data = record;
            data.actNames = data?.arActivityVOS?.map((v: any) => v.name + ' | ');
            setShowDetail(true);
            setItem({ ...data });
          }}
        >
          详情
        </a>,
        <Access accessible={access.btnHasAuthority('guestManageEdit')} key="guestManageEdit">
          <a
            key="editable"
            onClick={() => {
              getInfoById(record.id)
                .then((res) => {
                  if (res.code === 200) {
                    setGuesType('edit');
                    setShowAdd(true);
                    setItem(res.result.detail);
                  } else {
                    message.error(res.message);
                  }
                })
                .catch((err) => {
                  message.error(err.message);
                });
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('guestManageDel')} key="guestManageDel">
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
  function moveItem(item1: TableListItem, isUp: boolean) {
    move(current, pageSize, item1.id, isUp)
      .then((res) => {
        if (res.code === 200) {
          setType(!type);
        }
      })
      .catch((err) => {
        message.warning(err.message);
      });
  }

  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProTable<TableListItem>
        columns={columns}
        params={params}
        scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
        actionRef={actionRef}
        tableAlertRender={false}
        rowKey="id"
        pagination={{
          responsive: true,
          showQuickJumper: true,
          // eslint-disable-next-line @typescript-eslint/no-shadow
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
        }}
        request={async (paramss) => {
          const res = await getTableData({
            queryObject: {
              page: (paramss.current as number) - 1,
              size: paramss.pageSize,
              name: paramss.name,
            },
          });
          const { result } = res;
          // setExportParams(result.page.content);
          setCurrent((paramss.current as number) - 1);
          setPageSize(paramss.pageSize as number);
          setTotle(result.page.totalElements);
          return {
            data: result.page.content,
            success: res.code === 200 ? true : false,
            total: result.page.totalElements,
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
          <Access accessible={access.btnHasAuthority('guestManageAdd')} key="guestManageAdd">
            <Button
              type="primary"
              onClick={() => {
                setShowAdd(true);
                setGuesType('add');
              }}
            >
              新增
            </Button>
          </Access>,
          <Access accessible={access.btnHasAuthority('guestManageDel')} key="guestManageDel">
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
      {showAdd && (
        <AddGuest
          guestType={guestType}
          show={showAdd}
          onCancel={() => {
            setShowAdd(false);
            setGuesType('');
            setItem({});
          }}
          onConfirm={() => {
            setShowAdd(false);
            setType(!type);
            // actionRef.current?.setPageInfo({ current: 1 });
          }}
          item={item}
        />
      )}
      <Detail
        show={showDetail}
        baseInfo={item}
        config={[
          { label: '嘉宾名称', index: 'name' },
          { label: '嘉宾类型', index: 'typeName' },
          { label: '代码', index: 'code' },
          { label: '职业', index: 'job' },
          { label: '内容', index: 'content' },
          { label: '日期', index: 'enterTime' },
          { label: '所属活动', index: 'actNames', span: 2 },
          { label: '插入人', index: 'inserterName' },
          { label: '插入时间', index: 'insertTime' },
          { label: '更新人', index: 'updaterName' },
          { label: '更新时间', index: 'updateTime' },
        ]}
        onClose={() => {
          setShowDetail(false);
          setItem({});
        }}
        title="嘉宾详情"
      />
    </PageContainer>
  );
};

export default Guest;

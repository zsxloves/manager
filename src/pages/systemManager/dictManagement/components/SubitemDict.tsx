import React, { useRef, useState } from 'react';
import { Button, Col, message, Modal, Row } from 'antd';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getDictList, batchDeleteDict } from '../../../../services/systemManager';
import DictSubUpdate from './DictSubUpdate';
import { calcPageNo } from '@/utils/utilsJS';
import styles from './index.less';
import { PageContainer } from '@ant-design/pro-layout';

type TableListItem = {
  id: string;
  key?: number;
  name: string;
  code: string;
  remark: string;
  value: string;
  fatherDictz?: string;
};
export interface IDictSub {
  checkDictSub: boolean;
  dictSubInfo: Record<string, unknown>;
  hideModal: () => void;
}
const SubItemDict: React.FC<IDictSub> = ({ dictSubInfo, checkDictSub, hideModal }) => {
  const actionRef = useRef<ActionType>();
  const [dictSubVisible, setDictSubVisible] = useState<boolean>(false);
  const [subInfo, setSubInfo] = useState<Record<string, unknown>>(); //点击当前子字典数据
  const [subType, setSubType] = useState<string>('subAdd'); //子字典类型
  const [subTableHeavy, setSubTableHeavy] = useState<boolean>(true); //table重载
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();
  const [totle, setTotle] = useState<number>();
  const params = { subTableHeavy };
  const Heavy = () => {
    setSubTableHeavy(!subTableHeavy);
  };

  /**
   * 删除字典
   *
   * @param ids
   */
  const handleRemove = async (ids: string[]) => {
    if (!ids) return true;
    try {
      const deleteInfo = await batchDeleteDict(ids);
      if (deleteInfo.code === 200) {
        message.success('删除成功！');
        setSelectedRowKeys([]);
        setSubTableHeavy(!subTableHeavy);
        const delPage = calcPageNo(totle, (current as number) + 1, pageSize, ids.length);
        actionRef.current?.setPageInfo!({ current: delPage, pageSize });
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

  const cancelModal = () => {
    setDictSubVisible(false);
    setSubType('subAdd');
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
      title: '子项名称',
      dataIndex: 'name',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '子项编码',
      dataIndex: 'code',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '字典描述',
      dataIndex: 'remark',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '显示顺序',
      dataIndex: 'sortIndex',
      hideInSearch: true,
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            setSubInfo(record);
            setDictSubVisible(true);
            setSubType('subEdit');
          }}
        >
          编辑
        </a>,
        <a
          target="_blank"
          rel="noopener noreferrer"
          key="view"
          onClick={() => {
            handleRemoveOne([record.id]);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <>
      <Modal
        title="字典子项"
        visible={checkDictSub}
        onOk={hideModal}
        onCancel={hideModal}
        okText="确认"
        cancelText=""
        centered={true}
        width={900}
        destroyOnClose={true}
        maskClosable={false}
        wrapClassName={styles.dictSub}
      >
        <PageContainer title={false} breadcrumb={undefined}>
          <Row>
            <Col span={18}>
              <p>字典名称：{dictSubInfo.name}</p>
              <p>字典描述：{dictSubInfo.remark}</p>
            </Col>
          </Row>
          <ProTable<TableListItem>
            params={params}
            columns={columns}
            scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
            actionRef={actionRef}
            options={false}
            tableAlertRender={false}
            request={async (paramss) => {
              const data = await getDictList({
                queryObject: {
                  page: (paramss.current as number) - 1,
                  size: paramss.pageSize,
                  parentId: dictSubInfo.id,
                  propertyName: 'sortIndex',
                  ascending: 'true',
                },
              });
              setCurrent((paramss.current as number) - 1);
              setPageSize(paramss.pageSize);
              setTotle(data.result.page.totalElements);
              return {
                data: data.result.page.content,
                success: data.code === 200 ? true : false,
                total: data.result.page.totalElements,
              };
            }}
            rowKey="id"
            search={false}
            pagination={{
              responsive: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              defaultPageSize: 10,
            }}
            rowSelection={{
              fixed: true,
              selectedRowKeys,
              onChange: (Keys) => {
                setSelectedRowKeys(Keys);
              },
            }}
            dateFormatter="string"
            toolBarRender={() => [
              <Button
                key="button"
                type="primary"
                onClick={() => {
                  setDictSubVisible(true);
                }}
              >
                新建
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
        </PageContainer>
      </Modal>
      {dictSubVisible && (
        <DictSubUpdate
          dictSubVisible={dictSubVisible}
          subInfo={subInfo as Record<string, unknown>}
          subType={subType}
          cancelModal={cancelModal}
          Heavy={Heavy}
          dictSubInfo={dictSubInfo}
        />
      )}
    </>
  );
};

export default SubItemDict;

import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Modal, Button, Tree, message } from 'antd';
import { DeploymentUnitOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Form, Input, Select } from 'antd';
import {
  getAllClassificationData,
  editClassificationData,
  deleteClassificationData,
  getAllClassificationTree,
} from '@/services/systemManager';
import { PageContainer } from '@ant-design/pro-layout';
import AddClassification from './components/AddClassification';
import { setTreeData, calcPageNo } from '@/utils/utilsJS';
import { useAccess, Access } from 'umi';
import styles from './index.less';
import TextArea from 'antd/lib/input/TextArea';

type TableListItem = {
  code: string;
  id: string;
  name: string;
  status: string;
  description: string;
};

type TreeDatas = {
  key: string;
  code: string;
  id: string;
  title: string;
  parentId: string;
};

const FlManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();
  const [totle, setTotle] = useState<number>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [info, setInfo] = useState<Record<string, unknown>>({}); // 单个分类信息
  const [treeInfo, setTreeInfo] = useState<TreeDatas[]>([]); //所有分类数据
  const [showbg, setTc] = useState<boolean>(false); //修改分类弹框 状态
  const [updateType, setUpdateType] = useState<string>();
  const [visibleClass, setVisibleClass] = useState<boolean>(false); //新增状态
  const [editInfo, setEditInfo] = useState<any>(); //编辑信息
  const [ids, setIds] = useState<string>(); //点击存放分类id
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const [tableHeavy, setTableHeavy] = useState<boolean>(true); //table重载
  const access = useAccess();
  const params = { tableHeavy };

  const init = (): void => {
    form.setFieldsValue({
      name: info.name,
      code: info.code,
      status: info.status,
      description: info.description,
    });
  };

  const leftTree = (): void => {
    //获取左侧所有分类树
    getAllClassificationTree({}).then((res) => {
      const tree = setTreeData(res.data);
      if (tree) {
        setTreeInfo([tree[0]]); //分类所有树
        init();
      }
    });
  };

  /**
   * 删除字典
   *
   * @param ids
   */
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleRemove = async (ids: any, idLength: number) => {
    if (!ids) return true;
    try {
      const deleteInfo = await deleteClassificationData({ ids });
      if (deleteInfo.code === 200) {
        message.success(deleteInfo.message);
        leftTree();
        setSelectedRowKeys([]);
        setTableHeavy(!tableHeavy);
        const delPage = calcPageNo(totle, current, pageSize, idLength);
        actionRef.current?.setPageInfo!({ current: delPage, pageSize });
      }
      return true;
    } catch (error: any) {
      message.error(error.message);
      return false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleRemoveOne = async (ids: string, idLength: number) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        handleRemove(ids, idLength);
      },
    });
  };

  useEffect(() => {
    //获取左侧所有分类树
    getAllClassificationTree({}).then((res) => {
      const tree = setTreeData(res.data);
      if (tree) {
        setTreeInfo([tree[0]]); //分类所有树
        setInfo({ ...tree[0] }); //单个分类数据
        init();
        setIds(tree[0].id); //首次传入根节点id
        setExpandedKeys([tree[0].key]);
        // setAutoExpandParent(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  //点击展开收缩
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    // setAutoExpandParent(false);
  };
  //点击单个节点
  const onSelect = (selectedKeysValue: React.Key[], infos: any) => {
    setIds(infos.node.id); //点击存放节点id
    setTableHeavy(!tableHeavy); //table重载
    setInfo(infos.node); //单个分类数据
    setSelectedKeys(selectedKeysValue);
  };

  // 弹窗展示
  const showTc = () => {
    init();
    setTc(true);
  };
  //修改分类--弹框
  const handleOk = () => {
    form.validateFields().then((val: any) => {
      editClassificationData({
        ...val,
        parentId: info.parentId,
        id: info.id,
      }).then((respon) => {
        if (respon.success) {
          getAllClassificationTree({}).then((res) => {
            const tree = setTreeData(res.data);
            if (tree) {
              setTreeInfo([tree[0]]); //分类所有树
              setInfo({ ...info, ...val });
              init();
              setIds(tree[0].id); //首次传入根节点id
            }
          });
          message.success(respon.message);
          setTc(false);
        } else {
          message.error(respon.message);
        }
      });
    });
  };

  const handleCancel = () => {
    setTc(false);
  };
  const addhandleCancel = () => {
    setVisibleClass(false);
    setEditInfo('');
    setUpdateType('');
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      hideInSearch: true,
      editable: false,
      width: 50,
      render: (_, record, index) => index + 1,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      filters: true,
      onFilter: true,
      ellipsis: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '分类编码',
      dataIndex: 'code',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '父级分类',
      dataIndex: 'parentName',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '分类启用状态',
      dataIndex: 'status',
      hideInSearch: true,
      valueEnum: {
        '1': { text: '启用', status: 'Success' },
        '0': { text: '未启用', status: 'Error' },
      },
    },
    {
      title: '备注',
      dataIndex: 'description',
      search: false,
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => [
        <Access accessible={access.btnHasAuthority('flManagementEdit')} key="flManagementEdit">
          <a
            key="editable"
            onClick={() => {
              setUpdateType('edit');
              setEditInfo(record);
              setVisibleClass(true);
            }}
          >
            编辑
          </a>
        </Access>,
        <Access accessible={access.btnHasAuthority('flManagementDel')} key="flManagementDel">
          <a
            target="_blank"
            rel="noopener noreferrer"
            key="view"
            onClick={() => {
              handleRemoveOne(record.id, 1);
            }}
          >
            删除
          </a>
        </Access>,
      ],
    },
  ];

  const renderFooter = () => {
    return (
      <>
        <Button
          onClick={() => {
            handleCancel();
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

  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <Row className={styles.overall}>
        <Col span={4} className={styles.colSty}>
          <div className={styles.leftOrganize}>
            {treeInfo.length > 0 && (
              <Tree
                blockNode
                showLine={{
                  showLeafIcon: false,
                }}
                showIcon={true}
                icon={<DeploymentUnitOutlined />}
                autoExpandParent={true}
                defaultExpandAll={true}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                treeData={treeInfo}
              />
            )}
          </div>
        </Col>
        <Col span={20} className={styles.colSty}>
          <div className={styles.rightOrganize}>
            <Row className={styles.rightTop}>
              <Col>
                <Access
                  accessible={access.btnHasAuthority('flManagementEdit')}
                  key="flManagementEdit"
                >
                  <Button
                    key="button"
                    ghost
                    type="primary"
                    onClick={showTc}
                    style={{ float: 'right' }}
                  >
                    修改当前分类
                  </Button>
                </Access>
              </Col>
            </Row>
            <ProTable<TableListItem>
              params={params}
              form={{ ignoreRules: false }}
              scroll={pageSize === 10 ? {} : { x: '100%', y: 'auto' }}
              className={styles.tables}
              columns={columns}
              actionRef={actionRef}
              options={false}
              tableAlertRender={false}
              search={{
                labelWidth: 100,
                span: 5,
                searchText: '查询',
                optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
              }}
              request={async (paramss) => {
                const data = await getAllClassificationData({
                  ...paramss,
                  pageNumber: paramss.current as number,
                  pageSize: paramss.pageSize,
                  parentId: ids || '71a6fd591dc64c229e93b83a118b5cb4',
                });

                setCurrent(paramss.current as number);
                setPageSize(paramss.pageSize);
                setTotle(data.data.count);
                return {
                  data: data.data.cfList,
                  success: data.success,
                  total: data.data.count,
                };
              }}
              rowKey="id"
              pagination={{
                pageSize: 10,
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
                <Access
                  accessible={access.btnHasAuthority('flManagementAdd')}
                  key="flManagementAdd"
                >
                  <Button
                    key="button"
                    type="primary"
                    onClick={() => {
                      setUpdateType('add');
                      setVisibleClass(true);
                    }}
                  >
                    新建
                  </Button>
                </Access>,
                <Access
                  accessible={access.btnHasAuthority('flManagementDel')}
                  key="flManagementDel"
                >
                  <Button
                    key="button"
                    onClick={() => {
                      if (selectedRowKeys.length === 0) {
                        message.warning('请至少选择一条数据');
                        return;
                      }
                      let id: string = '';
                      for (let i = 0; i < selectedRowKeys.length; i++) {
                        id += selectedRowKeys[i];
                        if (i < selectedRowKeys.length - 1) {
                          id += ',';
                        }
                      }
                      handleRemoveOne(id, selectedRowKeys.length);
                    }}
                  >
                    批量删除
                  </Button>
                </Access>,
              ]}
            />
          </div>
        </Col>
      </Row>
      {showbg && (
        <Modal
          width={1000}
          title="修改当前分类"
          visible={showbg}
          maskClosable={false}
          onCancel={handleCancel}
          footer={renderFooter()}
        >
          <Form
            form={form}
            className={styles.formStyle}
            name="control-hooks"
            layout="horizontal"
            labelCol={{ style: { width: 140 } }}
          >
            <Row>
              <Col span={11}>
                <Form.Item
                  name="name"
                  label="分类名称"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[{ required: true, message: '请输入分类名称' }]}
                >
                  <Input autoComplete="off" placeholder="请输入" maxLength={20} allowClear={true} />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name="code"
                  label="分类编码"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    { required: true, message: '请输入分类编码' },
                    {
                      pattern: /^[A-Za-z0-9]{1,36}$/,
                      message: '分类编码由1-36个英文或数字构成',
                    },
                  ]}
                >
                  <Input autoComplete="off" placeholder="请输入" maxLength={36} allowClear={true} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item name="status" label="启用状态" rules={[{ required: true }]}>
                  <Select placeholder="请选择" allowClear>
                    <Option value="1">启用</Option>
                    <Option value="0">未启用</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={22}>
                <Form.Item name="description" label="备注">
                  <TextArea
                    maxLength={400}
                    placeholder="请输入"
                    autoSize={{ minRows: 3, maxRows: 2 }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
      {visibleClass && (
        <AddClassification
          addInfo={info}
          updateType={updateType as string}
          editInfo={editInfo}
          leftTree={() => {
            leftTree();
            setTableHeavy(!tableHeavy);
          }}
          visibleClass={visibleClass}
          addhandleCancel={addhandleCancel}
        />
      )}
    </PageContainer>
  );
};

export default FlManagement;

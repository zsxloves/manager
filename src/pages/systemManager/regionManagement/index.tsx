import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Modal, Button, Tree, message } from 'antd';
import { DeploymentUnitOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Form, Input } from 'antd';
import {
  getAreaTree,
  editAreaData,
  getAreaNoList,
  deleteRegionData,
} from '@/services/systemManager';
import AddRegion from './components/AddRegion';
import { setTreeData } from '@/utils/utilsJS';
import { PageContainer } from '@ant-design/pro-layout';
import { useAccess, Access } from 'umi';
import { calcPageNo } from '@/utils/utilsJS';
import styles from './index.less';
import TextArea from 'antd/lib/input/TextArea';

type TableListItem = {
  code: string;
  id: string;
  name: string;
  description: string;
};

// type TreeDatas = {
//   key: string;
//   code: string;
//   id: string;
//   title: string;
//   parentId: string;
// };

const RegionManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [current, setCurrent] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();
  const [totle, setTotle] = useState<number>();
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [ids, setIds] = useState<string>(); //点击存放分类区域id
  const [treeInfo, setTreeInfo] = useState<any>([]); //所有分类数据
  const [info, setInfo] = useState<Record<string, any>>({}); // 单个分类信息
  const [showbg, setTc] = useState<boolean>(false); //修改分类弹框 状态
  const [regionType, setRegionType] = useState<string>(); //更新状态add || edit
  const [regionData, setRegionData] = useState<any>(); //编辑信息
  const [visibleClass, setVisibleClass] = useState<boolean>(false); //新增状态
  const [tableHeavy, setTableHeavy] = useState<boolean>(true); //table重载
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); //多选
  const access = useAccess();
  const params = { tableHeavy };

  const init = (): void => {
    form.setFieldsValue({
      name: info.name,
      code: info.code,
      description: info.description,
    });
  };

  const leftTree = (): void => {
    //获取左侧所有分类树
    getAreaTree({}).then((res) => {
      const tree = setTreeData(res.data);
      if (tree) {
        setTreeInfo(tree); //区域所有树
        setTableHeavy(!tableHeavy);
        init();
      }
    });
  };

  useEffect(() => {
    //获取左侧所有分类树

    getAreaTree({}).then((res) => {
      const tree = setTreeData(res.data);
      if (tree) {
        setTreeInfo(tree); //分类所有树
        //setInfo({ ...tree[0] }); //单个分类数据
        init();
        //setIds(tree[0].id); //首次传入根节点id
        setExpandedKeys([tree[0].key]);
        //setSelectedKeys([tree[0].key])
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    init();
    setTableHeavy(!tableHeavy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  /**
   * 删除字典
   *
   * @param ids
   */
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleRemove = async (ids: any) => {
    if (!ids) return true;
    try {
      const deleteInfo = await deleteRegionData({ ids });
      if (deleteInfo.code === 200) {
        message.success(deleteInfo.message);
        setTableHeavy(!tableHeavy);
        leftTree();
        setSelectedRowKeys([]);
        const delPage = calcPageNo(totle, current, pageSize, ids.length);
        actionRef.current?.setPageInfo!({ current: delPage, pageSize });
      }
      return true;
    } catch (error: any) {
      message.error(error.message);
      return false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleRemoveOne = async (ids: any) => {
    Modal.confirm({
      title: '是否确认删除该条信息？',
      onOk: () => {
        handleRemove(ids);
      },
    });
  };
  //点击展开收缩
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };
  //点击单个节点
  const onSelect = (selectedKeysValue: React.Key[], infos: any) => {
    setIds(selectedKeysValue[0] as any); //点击存放节点id
    if (infos.selected) {
      setInfo(infos.node); //单个分类数据
    } else {
      setInfo({});
    }
    //setTableHeavy(!tableHeavy); //table重载
    setSelectedKeys(selectedKeysValue);
  };

  //修改区域--弹框
  const handleOk = () => {
    form.validateFields().then((val: any) => {
      editAreaData({
        ...val,
        parentId: info.parentId,
        id: info.id,
      })
        .then((respon) => {
          if (respon.success) {
            getAreaTree({}).then((res) => {
              const tree = setTreeData(res.data);
              if (tree) {
                setTreeInfo(tree); //区域所有树
                setInfo({ ...info, ...val });
                init();
                setIds(info.id); //传入根节点id
                setSelectedKeys(info.id);
              }
            });
            setTc(false);
            message.success(respon.message);
          } else {
            message.error(respon.message);
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    });
  };

  const addhandleCancel = () => {
    setVisibleClass(false);
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
      title: '区域名称',
      dataIndex: 'name',
      filters: true,
      ellipsis: true,
      onFilter: true,
      formItemProps: {
        getValueFromEvent: (e) => e.target.value.trim(),
      },
    },
    {
      title: '区域编码',
      dataIndex: 'code',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '父级区域',
      dataIndex: 'parentName',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => [
        <Access
          accessible={access.btnHasAuthority('regionManagementEdit')}
          key="regionManagementEdit"
        >
          <a
            key="editable"
            onClick={() => {
              setRegionType('edit');
              setRegionData(record);
              setVisibleClass(true);
            }}
          >
            编辑
          </a>
        </Access>,
        <Access
          accessible={access.btnHasAuthority('regionManagementDel')}
          key="regionManagementDel"
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
            key="view"
            onClick={() => {
              handleRemoveOne(record.id);
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
            setTc(false);
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
                  accessible={access.btnHasAuthority('regionManagementEdit')}
                  key="regionManagementEdit"
                >
                  <Button
                    key="button"
                    type="primary"
                    ghost
                    style={{ float: 'right' }}
                    onClick={() => {
                      if (info.id) {
                        setTc(true);
                        init();
                      } else {
                        message.warning('请选择修改区域节点');
                      }
                    }}
                  >
                    修改当前区域
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
              rowSelection={{
                fixed: true,
                selectedRowKeys,
                onChange: (keys) => {
                  setSelectedRowKeys(keys);
                },
              }}
              request={async (paramss) => {
                const data = await getAreaNoList({
                  ...paramss,
                  pageNumber: paramss.current as number,
                  pageSize: paramss.pageSize,
                  id: ids,
                  sortColumn: 'modify_time',
                  sortOrder: 'desc',
                });
                // setCurrent((paramss.current as number));
                setCurrent(paramss.current as number);
                setPageSize(paramss.pageSize);
                setTotle(data.data.totalNum);
                return {
                  data: data.data.list,
                  success: data.success,
                  total: data.data.totalNum,
                };
              }}
              rowKey="id"
              pagination={{
                pageSize: 10,
              }}
              dateFormatter="string"
              toolBarRender={() => [
                <Access
                  accessible={access.btnHasAuthority('regionManagementAdd')}
                  key="regionManagementAdd"
                >
                  <Button
                    key="button"
                    type="primary"
                    onClick={() => {
                      setRegionType('add');
                      setVisibleClass(true);
                    }}
                  >
                    新建
                  </Button>
                </Access>,
                <Access
                  accessible={access.btnHasAuthority('regionManagementDel')}
                  key="regionManagementDel"
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
                      handleRemoveOne(id);
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
          title="修改区域"
          visible={showbg}
          onCancel={() => setTc(false)}
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
                  label="区域名称"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[{ required: true, message: '请输入区域名称' }]}
                >
                  <Input autoComplete="off" placeholder="请输入" maxLength={20} allowClear={true} />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name="code"
                  label="区域编码"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    { required: true, message: '请输入区域编码' },
                    {
                      pattern: /^[A-Za-z0-9]{1,36}$/,
                      message: '区域编码由1-36个英文或数字构成',
                    },
                  ]}
                >
                  <Input autoComplete="off" placeholder="请输入" maxLength={36} allowClear={true} />
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
        <AddRegion
          addInfo={info}
          regionType={regionType as string}
          regionData={regionData}
          leftTree={() => {
            leftTree();
            actionRef.current?.setPageInfo!({ current: 1, pageSize });
          }}
          visibleClass={visibleClass}
          addhandleCancel={addhandleCancel}
        />
      )}
    </PageContainer>
  );
};

export default RegionManagement;

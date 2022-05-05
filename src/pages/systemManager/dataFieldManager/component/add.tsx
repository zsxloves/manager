import React, { useEffect, useState, useRef } from 'react';
// import { history } from 'umi';
import { StepsForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import { Button, message, Row, Col, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import SelectPerson from '@/components/selectPerson';
import SelectScene from '@/components/selectScene';
import TransferSelect from '@/components/TransferSelect';
import styles from './index.less';
import {
  regionIsRepeat,
  saveRegionAll,
  editRegionAll,
  getAreaByRegionId,
  getOrgByRegionId,
  getUserByRegionId,
  getSceneByRegionId,
  queryAllClassificationByRegionId,
} from '@/services/dataFileManager';
// import $ from 'jquery';

export interface BaseConfirmProps {
  onCancel: (flag?: boolean) => void;
  onSubmit: (list?: any) => void;
  onUpdate: () => void;
  addModalVisible: boolean;
  title: string;
  parentId: string;
  rowData: any;
  [key: string]: any;
}

export interface TableListItem {
  id?: string;
  name?: string;
  personName?: string;
  customerName?: string;
  type?: string;
  [key: string]: any;
}
// 场景选择表头
const columnsCJ: ProColumns<TableListItem>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    hideInSearch: true,
    width: 50,
    render: (_, record, index) => index + 1,
  },
  {
    title: '场景名称',
    dataIndex: 'name',
    hideInSearch: true,
    valueType: 'text',
    ellipsis: true,
  },
  {
    title: '所属组织机构',
    dataIndex: 'organizationName',
    hideInSearch: true,
    ellipsis: true,
    valueType: 'text',
  },
];
// 人员选择表头
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
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
    ellipsis: true,
  },
  // {
  //   title: '编码',
  //   dataIndex: 'code',
  //   hideInSearch: true,
  //   valueType: 'text',
  //   ellipsis: true,
  // },
  {
    title: '联系方式',
    dataIndex: 'mobilePhone',
    hideInSearch: true,
    valueType: 'text',
    ellipsis: true,
  },
];
const AddRegion: React.FC<BaseConfirmProps> = (props: any) => {
  const {
    onSubmit: handleConfirm,
    onCancel: handleCancel,
    onUpdate: handleUpdate,
    addModalVisible,
    title,
    rowData,
    parentId,
  } = props;
  const actionRef = useRef<any>();
  const actionRefScene = useRef<any>();
  const [selectedPerson, setSelectedPerson] = useState<any>([]);
  const [selectedScene, setSelectedScene] = useState<any>([]);
  const [selectPersonVisible, setSelectPersonVisible] = useState(false);
  const [selectSceneVisible, setSelectSceneVisible] = useState(false);
  const [personList, setPersonList] = useState<TableListItem[]>([]);
  const [sceneList, setSceneList] = useState<TableListItem[]>([]);
  // const [formValues, setFormValues] = useState<any>({});
  const [regionId, setRegionId] = useState<string>(rowData.id);
  // const [step, setStep] = useState<number>();
  const [areaList, setAreaList] = useState<any[]>([]); // 区域列表
  const [deptList, setDeptList] = useState<any[]>([]); // 组织列表
  const [classificationList, setClassificationList] = useState<any[]>([]); // 分类列表
  const [areaIdList, setAreaIdList] = useState<string[]>([]); // 已选区域id
  const [deptIdList, setDeptIdList] = useState<string[]>([]); // 已选组织id
  const [classificationIdList, setClassificationIdList] = useState<string[]>([]); // 已选分类id
  const [isFirstScene, setIsFirstScene] = useState(true);
  const [isFirstPerson, setIsFirstPerson] = useState(true);

  const formRef: any = useRef(null);

  // 删除选中人员
  const deletePerson = async (rows: string[]) => {
    const currentRow: TableListItem[] = [];
    if (rows.length === 0) {
      message.error('请至少选择一条数据');
    }
    personList.forEach((item: any) => {
      if (!rows.includes(item.id)) {
        currentRow.push(item);
      }
    });
    setPersonList(currentRow);
    if (actionRef.current) {
      actionRef.current.clearSelected();
    }
  };
  // 删除选择的场景
  const deleteScene = async (rows: string[]) => {
    const currentRow: TableListItem[] = [];
    if (rows.length === 0) {
      message.error('请至少选择一条数据');
    }
    sceneList.forEach((item: any) => {
      if (!rows.includes(item.id)) {
        currentRow.push(item);
      }
    });
    setSceneList(currentRow);
    if (actionRefScene.current) {
      actionRefScene.current.clearSelected();
    }
  };
  // 取消
  const cancelFun = (): void => {
    handleCancel();
  };
  // 根据数据域ID查区域
  const getAreaByRegionIdFun = (rId: string) => {
    getAreaByRegionId({ regionId: rId })
      .then((res: any) => {
        if (res.code === 200) {
          setAreaList(res?.data || []);
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err: any) => {
        message.error(err.message || err);
      });
  };
  // 根据数据域ID查组织
  const getDeptByRegionIdFun = (rId: string) => {
    getOrgByRegionId({ regionList: [rId] })
      .then((res: any) => {
        if (res.code === 200) {
          let hasChecked = '0';
          const list: any[] =
            res?.data.map((item: any) => {
              if (item.checked === '1') {
                hasChecked = '1';
              }
              if (!item.parentId) {
                item.parentId = '1';
              }
              return item;
            }) || [];

          list.push({
            name: '根节点',
            code: 'gen',
            parentId: '0',
            checked: hasChecked,
            id: '1',
          });
          setDeptList(list);
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err: any) => {
        message.error(err.message || err);
      });
  };
  // 根据数据域ID查分类
  const getClassificationByRegionIdFun = (rId: string) => {
    queryAllClassificationByRegionId({ regionId: rId })
      .then((res: any) => {
        if (res.code === 200) {
          setClassificationList(res?.data || []);
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err: any) => {
        message.error(err.message || err);
      });
  };
  // 根据数据域查询场景
  const getSceneByRegionIdFun = (rId: string) => {
    if (!isFirstScene) {
      return;
    }
    getSceneByRegionId({ regionIdList: [rId] })
      .then(async (res: any) => {
        if (res.code === 200) {
          setSceneList(res?.data || []);
          setIsFirstScene(false);
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err: any) => {
        message.error(err.message || err);
      });
  };
  // 根据数据域ID查人员
  const getPersonByRegionIdFun = (rId: string) => {
    if (!isFirstPerson) {
      return;
    }
    getUserByRegionId({ regionIdList: [rId] })
      .then(async (res: any) => {
        if (res.code === 200) {
          setPersonList(res?.data || []);
          setIsFirstPerson(false);
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err: any) => {
        message.error(err.message || err);
      });
  };
  // 新增
  const add = (params: any, step: number) => {
    const newParams = { ...params };
    saveRegionAll(newParams)
      .then((res: any) => {
        if (res.code === 200) {
          message.success('新增成功');
          setRegionId(res.data);
          console.log('step:', step);
          if (step === 0) {
            handleUpdate();
            getAreaByRegionIdFun(res.data);
          } else if (step === 1) {
            getDeptByRegionIdFun(res.data);
          } else if (step === 2) {
            getClassificationByRegionIdFun(res.data);
          } else if (step === 3) {
            getPersonByRegionIdFun(res.data);
          } else if (step === 4) {
            getPersonByRegionIdFun(res.data);
          } else {
            handleConfirm();
          }
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err: any) => {
        message.error(err.message || err);
      });
  };
  // 编辑
  const edit = (params: any, step: number) => {
    const newParams = { ...params };
    editRegionAll(newParams)
      .then((res: any) => {
        if (res.code === 200) {
          message.success('编辑成功');
          if (step === 0) {
            handleUpdate();
            getAreaByRegionIdFun(rowData.id || regionId);
          } else if (step === 1) {
            getDeptByRegionIdFun(rowData.id || regionId);
          } else if (step === 2) {
            getClassificationByRegionIdFun(rowData.id || regionId);
          } else if (step === 3) {
            getSceneByRegionIdFun(rowData.id || regionId);
          } else if (step === 4) {
            getPersonByRegionIdFun(rowData.id || regionId);
          } else {
            handleConfirm();
          }
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err: any) => {
        message.error(err.message || err);
      });
  };
  // 提交
  const submitFun = async () => {
    const newParams = {
      flag: '2',
      sysRegion: { id: regionId },
      userIdList: personList.map((item) => {
        return item.id;
      }),
    };
    // if (title==='新增') {
    //   add(newParams, 4)
    // }else{
    // }
    edit(newParams, 5);
  };
  useEffect(() => {
    if (rowData) {
      formRef.current.setFieldsValue(rowData);
    }
    // $('.ant-form').attr('title', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const renderFooter = () => {
  //   return (
  //     <>
  //       <Button
  //         onClick={() => {
  //           handleCancel(false);
  //         }}
  //       >
  //         取消
  //       </Button>
  //       <Button type="primary" onClick={() => handleConfirm()}>
  //         确定
  //       </Button>
  //     </>
  //   );
  // };
  return (
    <Modal
      width={1000}
      bodyStyle={{ padding: '40px 20px' }}
      destroyOnClose
      title={title}
      className="StepsFormSty"
      maskClosable={false}
      visible={addModalVisible}
      footer={false}
      onCancel={() => {
        handleCancel(false);
      }}
    >
      <StepsForm<{
        name: string;
      }>
        onFinish={async () => {
          submitFun();
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        submitter={{
          render: (item) => {
            if (item.step === 0) {
              return [
                <Button key="cancel" onClick={() => cancelFun()}>
                  取消
                </Button>,
                <Button
                  key="next1"
                  type="primary"
                  onClick={() => {
                    console.log(item);
                    item.onSubmit?.();
                    formRef.current.validateFields().then((val: any) => {
                      const params: any = {
                        sysRegion: {
                          code: val.code.trim(),
                          name: val.name.trim(),
                        },
                      };
                      if (regionId) {
                        params.sysRegion.id = regionId;
                      }
                      if (title === '新增' && !regionId) {
                        regionIsRepeat(params)
                          .then((res: any) => {
                            if (res.code === 200) {
                              item.onSubmit?.();
                              add({ flag: '0', sysRegion: { ...val, parentId } }, item.step);
                            } else {
                              message.error(res.message || res);
                            }
                          })
                          .catch((err: any) => {
                            message.error(err.message || err);
                          });
                      } else {
                        item.onSubmit?.();
                        edit({ flag: '0', sysRegion: { id: regionId, ...val } }, item.step);
                      }
                    });
                  }}
                >
                  下一步
                </Button>,
              ];
            }

            if (item.step === 1 || item.step === 2 || item.step === 3 || item.step === 4) {
              return [
                <Button key="cancel" onClick={() => cancelFun()}>
                  取消
                </Button>,
                <Button key="pre" onClick={() => item.onPre?.()}>
                  上一步
                </Button>,
                <Button
                  key="gotoNext1"
                  type="primary"
                  onClick={() => {
                    item.onSubmit?.();
                    switch (item.step) {
                      case 1: {
                        // if (title==='新增') {
                        //   add({ flag: '3', sysRegion: {id:regionId},areaIdList }, item.step);
                        // } else {
                        // }
                        edit({ flag: '3', sysRegion: { id: regionId }, areaIdList }, item.step);
                        break;
                      }
                      case 2: {
                        // if (title==='新增') {
                        //   add({ flag: '1', sysRegion: {id:regionId},orgIdList:deptIdList }, item.step);
                        // } else {
                        // }
                        edit(
                          { flag: '1', sysRegion: { id: regionId }, orgIdList: deptIdList },
                          item.step,
                        );
                        break;
                      }
                      case 3: {
                        // if (title==='新增') {
                        //   add({ flag: '4', sysRegion: {id:regionId},classificationIdList }, item.step);
                        // } else {
                        // }
                        edit(
                          { flag: '4', sysRegion: { id: regionId }, classificationIdList },
                          item.step,
                        );
                        break;
                      }
                      case 4: {
                        const sceneIdList = sceneList.map((val) => {
                          return val.id;
                        });
                        edit({ flag: '5', sysRegion: { id: regionId }, sceneIdList }, item.step);
                        break;
                      }
                      default:
                        break;
                    }
                  }}
                >
                  下一步
                </Button>,
              ];
            }
            return [
              <Button key="cancel3" onClick={() => cancelFun()}>
                取消
              </Button>,
              <Button key="gotoper" onClick={() => item.onPre?.()}>
                上一步
              </Button>,
              <Button key="sub" type="primary" onClick={() => item.onSubmit?.()}>
                保存
              </Button>,
            ];
          },
        }}
      >
        <StepsForm.StepForm<{
          name: string;
        }>
          name="base"
          title="基本信息"
          style={{ height: '50vh' }}
          layout="horizontal"
          autoComplete="off"
          formRef={formRef}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          // initialValues={defaultForm}
          onFinish={async () => {
            return true;
          }}
        >
          <div style={{ marginBottom: '30px', height: '50vh' }}>
            <Row>
              <Col span={20} offset={1}>
                <ProFormText
                  name="code"
                  label="编码"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ maxLength: 30 }}
                  rules={[{ required: true, message: '请输入数据域编码' }, { whitespace: true }]}
                />
              </Col>
              <Col span={20} offset={1}>
                <ProFormText
                  name="name"
                  label="数据域名称"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ maxLength: 30 }}
                  rules={[{ required: true, message: '请输入数据域名称' }, { whitespace: true }]}
                />
              </Col>
              <Col span={20} offset={1} className={styles.textareaLabelWidth}>
                <ProFormTextArea
                  name="description"
                  label="备注"
                  fieldProps={{ maxLength: 400, autoSize: { minRows: 3, maxRows: 2 } }}
                />
              </Col>
            </Row>
          </div>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="area" title="区域选择">
          <Row style={{ height: '100%' }} className={styles.rowSty}>
            <Col style={{ height: '100%' }}>
              {areaList.length > 0 && (
                <TransferSelect
                  onSubmit={async (value) => {
                    console.log('values:', value);
                    const lis = value.map((item: any) => {
                      return item.id;
                    });
                    setAreaIdList(lis);
                  }}
                  treeList={areaList}
                />
              )}
            </Col>
          </Row>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="dept" title="组织选择">
          <Row style={{ height: '100%' }} className={styles.rowSty}>
            <Col style={{ height: '100%' }}>
              {deptList.length > 0 && (
                <TransferSelect
                  onSubmit={async (value) => {
                    setDeptIdList(
                      value.map((item: any) => {
                        return item.id;
                      }),
                    );
                  }}
                  treeList={deptList}
                />
              )}
            </Col>
          </Row>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="classification" title="分类选择">
          <Row style={{ height: '100%' }} className={styles.rowSty}>
            <Col style={{ height: '100%' }}>
              {classificationList.length > 0 && (
                <TransferSelect
                  onSubmit={async (value) => {
                    console.log('values:', value);
                    setClassificationIdList(
                      value.map((item: any) => {
                        return item.id;
                      }),
                    );
                  }}
                  treeList={classificationList}
                />
              )}
            </Col>
          </Row>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="screen" title="场景选择">
          <ProTable<TableListItem>
            scroll={{ x: '100%', y: '320px' }}
            actionRef={actionRefScene}
            rowKey="id"
            search={false}
            tableAlertRender={false}
            options={false}
            toolBarRender={() => [
              <Button
                type="primary"
                onClick={() => {
                  setSelectSceneVisible(true);
                }}
              >
                新增
              </Button>,
              <Button
                onClick={() => {
                  deleteScene(selectedScene);
                }}
              >
                批量删除
              </Button>,
            ]}
            pagination={{
              responsive: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              defaultPageSize: 10,
            }}
            dataSource={sceneList}
            columns={columnsCJ}
            rowSelection={{
              // selectedRowKeys:selectedScene,
              onChange: (selectedRowKeys) => {
                setSelectedScene(selectedRowKeys);
              },
            }}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="用户选择">
          <ProTable<TableListItem>
            scroll={{ x: '100%', y: '320px' }}
            actionRef={actionRef}
            rowKey="id"
            search={false}
            tableAlertRender={false}
            options={false}
            toolBarRender={() => [
              <Button
                type="primary"
                onClick={() => {
                  setSelectPersonVisible(true);
                }}
              >
                新增
              </Button>,
              <Button
                onClick={() => {
                  deletePerson(selectedPerson);
                }}
              >
                批量删除
              </Button>,
            ]}
            pagination={{
              responsive: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              defaultPageSize: 10,
            }}
            dataSource={personList}
            columns={columns}
            rowSelection={{
              // selectedRowKeys:selectedPerson,
              onChange: (selectedRowKeys) => {
                setSelectedPerson(selectedRowKeys);
              },
            }}
          />
        </StepsForm.StepForm>
      </StepsForm>
      {/* 选择场景 */}
      {selectSceneVisible && (
        <SelectScene
          onSubmit={async (value) => {
            const newList = JSON.parse(JSON.stringify(sceneList));
            await value.forEach((item: any) => {
              if (
                sceneList.every((val: any) => {
                  return val.id !== item.id;
                })
              ) {
                newList.push(item);
              }
            });
            console.log('newList：', newList);
            setSceneList(newList);
            setSelectSceneVisible(false);
          }}
          onCancel={() => {
            setSelectSceneVisible(false);
          }}
          selectVisible={selectSceneVisible}
          selectKeys={
            sceneList.map((item: any) => {
              return item.id;
            }) || []
          }
        />
      )}
      {/* 选择人员 */}
      {selectPersonVisible && (
        <SelectPerson
          onSubmit={async (value) => {
            const newList = JSON.parse(JSON.stringify(personList));
            await value.forEach((item: any) => {
              if (
                personList.every((val: any) => {
                  return val.id !== item.id;
                })
              ) {
                newList.push(item);
              }
            });
            setPersonList(newList);
            setSelectPersonVisible(false);
          }}
          onCancel={() => {
            setSelectPersonVisible(false);
          }}
          selectPersonVisible={selectPersonVisible}
          selectKeys={
            personList.map((item: any) => {
              return item.id;
            }) || []
          }
        />
      )}
    </Modal>
  );
};
export default AddRegion;

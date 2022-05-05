import React, { useEffect, useState, useRef } from 'react';
import { history } from 'umi';
import ProForm, {
  ProFormText,
  ProFormTextArea,
  ProFormDatePicker,
  ProFormSelect,
  ProFormDateTimeRangePicker,
} from '@ant-design/pro-form';
import { AimOutlined } from '@ant-design/icons';
import { Button, Row, Col, message, TreeSelect, Form } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { DataNode } from 'antd/lib/tree';
import { personDetail, addPersonInfo, editPersonInfo } from '@/services/securityResources';
import { getOrganizationrTree, getDictfindAll } from '@/services/systemManager';
import Map from '@/components/Map';
import moment from 'moment';
import { formatDate, lon, lat, onlyNumber, getBit, Phones } from '@/utils/utilsJS';
import styles from './index.less';

type Person = {
  arObservepersonVO: Record<string, unknown>;
  personInfoVO: Record<string, unknown>;
  hotelId: string;
};

const UpdatePerson: React.FC = (props: any) => {
  const formRef: any = useRef(null);
  // const current: any = useRef(props.location?.query?.page);
  // const pageSize: any = useRef(props.location?.query?.size);
  const [personId] = useState<string>(props.location?.query?.personId);
  const [personInfo, setPersonInfo] = useState<Person>(); //人员详情查询数据
  const [organizationId, setOrganizationId] = useState<DataNode[]>([]); //所属机构
  const [personType, setPersonType] = useState<string[]>([]); //人员类别
  const [posType, setPosType] = useState<string[]>([]); //职业类别
  const [sex, setSex] = useState<string[]>([]); //性别类别
  const [culture, setCulture] = useState<string[]>([]); //文化程度
  const [political, setPolitical] = useState<string[]>([]); //政治面貌
  const [marriage, setMarriage] = useState<string[]>([]); //婚姻状况
  const [keyPersonB, setKeyPersonB] = useState<boolean>(false); //重点人员
  const [lodgePos, setLodgePos] = useState<boolean>(false); //住店人员
  const [orName, setOrName] = useState<string>();
  const [type, setType] = useState<boolean>(true); //true--普通人员  false-民警辅警保安交警
  //经纬度useState
  const [isShowMap, setShowMap] = useState<boolean>(false);
  const [mapValues, setMapValues] = useState<any>({});
  const [point, setPoint] = useState<any>({
    lon: '',
    lat: '',
    alt: '',
  });

  //判断新增编辑
  const isEdit = !!props.location?.query?.personId;

  const filters = (data: any) => {
    const info = data.result.result;
    if (info.length > 0) {
      for (let i = 0; i < info.length; i++) {
        info[i].label = info[i].name;
        info[i].value = info[i].id;
      }
    }
    return info;
  };
  //初始化
  const initFun = () => {
    // 组织表
    getOrganizationrTree({})
      .then((res) => {
        if (res.data) {
          setOrganizationId(res.data);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
    //字典库--性别类别查询
    getDictfindAll({ parentId: 'b635531b-b527-4d9c-95e0-5cbe09e32f87' })
      .then((res) => {
        const data = filters(res);
        setSex(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
    //字典库--人员类别查询
    getDictfindAll({ parentId: '7d6b39b2-9a3f-42a6-a38e-6ba950c29dab' })
      .then((res) => {
        const data = filters(res);
        setPersonType(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
    //字典库--类别查询
    getDictfindAll({ parentId: 'ccdf1602-38b2-4987-886c-944ac533b891' })
      .then((res) => {
        const data = filters(res);
        setPosType(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
    //字典库--文化程度查询
    getDictfindAll({ parentId: '042269b4-1a8a-4006-a70b-42cfb823ce60' })
      .then((res) => {
        const data = filters(res);
        setCulture(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
    //字典库--政治面貌查询
    getDictfindAll({ parentId: 'acf543c2-7baa-4c9b-b190-4ddb205510da' })
      .then((res) => {
        const data = filters(res);
        setPolitical(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
    //字典库--婚姻状况查询
    getDictfindAll({ parentId: '8173d29b-6d55-4498-b0d4-5d865c518ab4' })
      .then((res) => {
        const data = filters(res);
        setMarriage(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  const decideKey = (name: string) => {
    if (name === '重点人员') {
      //重点人员
      setKeyPersonB(true);
      setType(true);
      setLodgePos(false);
    } else if (name === '普通人员') {
      //普通人员
      setType(true);
      setKeyPersonB(false);
      setLodgePos(false);
    } else if (name === '住店人员') {
      //住店人员
      setLodgePos(true);
      setKeyPersonB(false);
    } else {
      //民警辅警交警保安
      setType(false);
      setKeyPersonB(false);
      setLodgePos(false);
    }
  };

  useEffect(() => {
    initFun();
    if (isEdit) {
      //判断是否为编辑 是 则通过userid请求单个数据 放入对象中 通过initialValues设置初始值来首次渲染
      personDetail({ id: personId })
        .then((res) => {
          const a = {
            ...res.data.personInfoVO,
            ...res.data.arObservepersonVO,
            phoneNumber: res.data.personInfoVO.phoneNumber,
            standardAddress: res.data.personInfoVO.standardAddress,
            nativeAddress: res.data.personInfoVO.nativeAddress,
            posType: res.data.personInfoVO.posType,
            posTypeName: res.data.personInfoVO.posTypeName,
            personTypeName: res.data.personInfoVO.personTypeName,
            personType: res.data.personInfoVO.personType,
            idCardCode: res.data.personInfoVO.idCardCode,
            organizationId: res.data.personInfoVO.organizationId,
          };
          a.lon = getBit(a?.lon, 10);
          a.lat = getBit(a?.lat, 10);
          if (!Array.isArray(a.compoion) && a.compoion?.length > 0) {
            a.compoion = a.compoion.split(',');
          }
          if (res.data.personInfoVO?.enterTime && res.data.personInfoVO?.leaveTime) {
            a.timeRange = [];
            a.timeRange[0] = moment(res.data.personInfoVO.enterTime);
            a.timeRange[1] = moment(res.data.personInfoVO.leaveTime);
          }
          setOrName(res.data.personInfoVO?.orgName);
          formRef.current.setFieldsValue(a);
          decideKey(a.posTypeName);
          setPersonInfo(res.data);
        })
        .catch((err) => {
          message.error(err.message);
        });
    } else {
      formRef.current.setFieldsValue({ posType: '462c74e5-0776-43fe-9b7c-9feffab1d525' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = (params: any) => {
    const time = formatDate(params?.controlTime);
    if (params?.timeRange && params?.timeRange?.length > 0) {
      const startTime = params?.timeRange[0];
      const endTime = params?.timeRange[1];
      params.startTime = formatDate(startTime);
      params.endTime = formatDate(endTime);
    }
    if (new Date(params.startTime) > new Date(params.endTime)) {
      message.error('开始时间需早于结束时间');
      return;
    }
    let newCompoion = '';
    if (params.compoion?.length > 0) {
      newCompoion = '';
      for (let i = 0; i < params.compoion?.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        newCompoion += params.compoion[i];
        if (i < params.compoion?.length - 1) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          newCompoion += ',';
        }
      }
    }
    if (newCompoion?.length >= 200) {
      message.warning('同住人字段超过200字符，请调整字段大小');
      return;
    }
    const data = {
      arObservepersonVO: {
        controlTime: params.controlTime ? time : undefined,
        caseType: params.caseType,
        code: params.code,
        controlInfo: params.controlInfo,
        controlLevel: params.controlLevel,
        name: params.name,
        remark: params.remark,
        idCardCode: params.idCardCode,
        lon: params.lon,
        lat: params.lat,
        personClass: params.personClass,
        controlName: params.controlName,
        controlPhone: params.controlPhone,
      },
      arPersonHotelStaff: {
        compoion: newCompoion,
        enterTime: params.startTime,
        leaveTime: params.endTime,
        companionNumber: params.companionNumber,
        departureAdress: params.departureAdress,
      },
      personInfoVO: {
        ...params,
        orgName: orName,
        controlTime: params.controlTime ? time : undefined,
      },
    };
    delete data.personInfoVO.compoion;
    addPersonInfo(data)
      .then((res) => {
        if (res.code === 200) {
          message.success(res.message);
          history.push(
            `/securityResources/personManage?page=${
              parseInt(props.location?.query?.page) + 1
            }&size=${props.location?.query?.size}&defaultValue=${
              props.location?.query?.defaultValue
            }`,
          );
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message || err);
      });
  };
  const edit = (params: any) => {
    const time = formatDate(params?.controlTime);
    if (params?.timeRange && params?.timeRange?.length > 0) {
      const startTime = params?.timeRange[0];
      const endTime = params?.timeRange[1];
      params.startTime = formatDate(startTime);
      params.endTime = formatDate(endTime);
    }
    if (new Date(params.startTime) > new Date(params.endTime)) {
      message.error('开始时间需早于结束时间');
      return;
    }
    const { arObservepersonVO, personInfoVO } = personInfo as Person;
    let newCompoion = '';
    if (params.compoion?.length > 0 && Array.isArray(params.compoion)) {
      newCompoion = '';
      for (let i = 0; i < params.compoion?.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        newCompoion += params.compoion[i];
        if (i < params.compoion?.length - 1) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          newCompoion += ',';
        }
      }
    } else {
      newCompoion = params.compoion;
    }
    if (newCompoion?.length >= 200) {
      message.warning('同住人字段过长，请调整字段大小');
      return;
    }
    const data = {
      arObservepersonVO: {
        ...arObservepersonVO,
        controlTime: params.controlTime ? time : undefined,
        caseType: params.caseType,
        code: params.code,
        controlInfo: params.controlInfo,
        controlLevel: params.controlLevel,
        name: params.name,
        remark: params.remark,
        idCardCode: params.idCardCode,
        lon: params.lon,
        lat: params.lat,
        personClass: params.personClass,
        controlName: params.controlName,
        controlPhone: params.controlPhone,
      },
      arPersonHotelStaff: {
        // ...personInfoVO,
        id: personInfo?.personInfoVO?.hotelId || '',
        personId: personId,
        compoion: newCompoion,
        enterTime: params.startTime,
        leaveTime: params.endTime,
        companionNumber: params.companionNumber,
        departureAdress: params.departureAdress,
      },
      personInfoVO: {
        ...personInfoVO,
        ...params,
        orgName: orName,
        controlTime: params.controlTime ? time : undefined,
      },
    };
    delete data.personInfoVO.idDeleted;
    delete data.personInfoVO.compoion;
    editPersonInfo(data)
      .then((res) => {
        if (res.code === 200) {
          message.success(res.message);
          history.push(
            `/securityResources/personManage?page=${
              parseInt(props.location?.query?.page) + 1
            }&size=${props.location?.query?.size}&defaultValue=${
              props.location?.query?.defaultValue
            }`,
          );
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  // 取消
  const cancelFun = (): void => {
    history.push(
      `/securityResources/personManage?page=${parseInt(props.location?.query?.page) + 1}&size=${
        props.location?.query?.size
      }&defaultValue=${props.location?.query?.defaultValue}`,
    );
  };
  function disableStart(current: any) {
    const endTime = formRef.current.getFieldsValue().endTime;
    if (endTime) {
      return !(current.unix() < endTime.unix());
    } else {
      return false;
    }
  }

  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProForm
        formRef={formRef}
        className={styles.PageContainer}
        layout="horizontal"
        colon={true}
        labelCol={{ style: { width: 140 } }}
        // labelAlign="right"
        submitter={{
          render: () => {
            return [
              <Button key="cancel" onClick={() => cancelFun()}>
                取消
              </Button>,
              <Button
                key="next1"
                type="primary"
                onClick={() => {
                  formRef.current.validateFields().then((val: any) => {
                    if (isEdit) {
                      edit(val);
                    } else {
                      add(val);
                    }
                  });
                }}
              >
                保存
              </Button>,
            ];
          },
        }}
      >
        <Row>
          <Form.Item className={styles.headerText}>{personId ? '编辑人员' : '新增人员'}</Form.Item>
        </Row>
        <Row>
          <Col span={24}>
            <Row>
              <Col span={7}>
                <ProFormText
                  name="name"
                  label="姓名"
                  fieldProps={{ maxLength: 40, autoComplete: 'off' }}
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    { required: true, message: '请输入姓名' },
                    {
                      pattern:
                        /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/,
                      message: '姓名仅支持中文',
                    },
                  ]}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="ethnicity"
                  label="民族"
                  fieldProps={{ maxLength: 40, autoComplete: 'off' }}
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    {
                      pattern:
                        /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/,
                      message: '民族仅支持中文',
                    },
                  ]}
                />
              </Col>
              <Col span={7} offset={1}>
                <ProFormText
                  name="alias"
                  label="曾用名"
                  fieldProps={{ maxLength: 40, autoComplete: 'off' }}
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    {
                      pattern:
                        /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/,
                      message: '曾用名仅支持中文',
                    },
                  ]}
                />
              </Col>
              <Col span={7}>
                <ProFormSelect name="gender" label="性别" options={sex} />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="idCardCode"
                  label="身份证号"
                  fieldProps={{ maxLength: 18, autoComplete: 'off' }}
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    {
                      required: type ? true : false,
                      message: '请输入身份证号',
                    },
                    {
                      pattern:
                        /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
                      message: '身份证号格式不正确',
                    },
                  ]}
                />
              </Col>
              <Col span={7} offset={1}>
                <ProFormSelect
                  name="posType"
                  label="类别"
                  rules={[{ required: true }]}
                  options={posType}
                  fieldProps={{
                    onSelect(_, info) {
                      decideKey(info.name);
                      const fields = formRef.current.getFieldValue();
                      formRef.current.resetFields();
                      formRef.current.setFieldsValue({ ...fields, posType: info.id });
                    },
                  }}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="phoneNumber"
                  label="手机号"
                  fieldProps={{ maxLength: 11, autoComplete: 'off' }}
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    {
                      required: type ? false : true,
                      message: '请输入手机号',
                    },
                    {
                      pattern:
                        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
                      message: '手机号格式不正确',
                    },
                  ]}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="standardAddress"
                  label="标准地址"
                  fieldProps={{ maxLength: 200, autoComplete: 'off' }}
                  getValueFromEvent={(e) => e.target.value.trim()}
                  // rules={[
                  //   { required: true, message: '请输入标准地址' },
                  // ]}
                />
              </Col>
              <Col span={7} offset={1}>
                <ProFormText
                  name="nativeAddress"
                  label="户籍地址"
                  fieldProps={{ maxLength: 200, autoComplete: 'off' }}
                  getValueFromEvent={(e) => e.target.value.trim()}
                />
              </Col>
              <Col span={7}>
                <ProFormSelect name="education" label="文化程度" options={culture} />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="health"
                  label="健康状况"
                  fieldProps={{ maxLength: 40, autoComplete: 'off' }}
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    {
                      pattern:
                        /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/,
                      message: '健康状况仅支持中文',
                    },
                  ]}
                />
              </Col>
              <Col span={7} offset={1}>
                <ProFormSelect name="marriage" label="婚姻状况" options={marriage} />
              </Col>
              <Col span={7}>
                <ProFormSelect name="partyAffiliation" label="政治面貌" options={political} />
              </Col>
              <Col span={7}>
                <ProFormSelect
                  name="personType"
                  label="人员类别"
                  rules={[{ required: type === true ? true : false }]}
                  options={personType}
                />
              </Col>
              <Col span={7} offset={1}>
                <Form.Item
                  label="关联组织机构"
                  name="organizationId"
                  rules={[{ required: type === false ? true : false }]}
                >
                  <TreeSelect
             fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                    showSearch
                    filterTreeNode={true}
                    treeNodeFilterProp="title"
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择"
                    allowClear
                    treeDefaultExpandAll
                    treeData={organizationId}
                    onSelect={(_, e) => {
                      setOrName(e.title as string);
                    }}
                  />
                </Form.Item>
              </Col>
              {/* 重点人员字段 */}
              {keyPersonB && (
                <>
                  <Col span={7}>
                    <ProFormText
                      name="personClass"
                      label="重点分类"
                      fieldProps={{ maxLength: 40, autoComplete: 'off' }}
                      getValueFromEvent={(e) => e.target.value.trim()}
                      rules={[{ required: true, message: '重点分类' }]}
                    />
                  </Col>
                  <Col span={7}>
                    <ProFormText
                      name="controlLevel"
                      label="管控分级"
                      fieldProps={{ maxLength: 40, autoComplete: 'off' }}
                      getValueFromEvent={(e) => e.target.value.trim()}
                      rules={[{ required: true, message: '请输入管控分级' }]}
                    />
                  </Col>
                  <Col span={7} offset={1}>
                    <ProFormText
                      name="controlInfo"
                      label="布控情况"
                      fieldProps={{ maxLength: 40, autoComplete: 'off' }}
                      getValueFromEvent={(e) => e.target.value.trim()}
                      rules={[{ required: true, message: '请输入布控情况' }]}
                    />
                  </Col>
                  <Col span={7}>
                    <ProFormText
                      name="caseType"
                      label="案件类别"
                      fieldProps={{ maxLength: 40, autoComplete: 'off' }}
                      getValueFromEvent={(e) => e.target.value.trim()}
                      rules={[{ required: true, message: '请输入案件类别' }]}
                    />
                  </Col>
                  <Col span={7}>
                    <ProFormDatePicker
                      width={511}
                      name="controlTime"
                      label="最后管控时间"
                      // rules={[{ required: true, message: '请选择管控时间' }]}
                      fieldProps={{
                        showTime: true,
                        format: 'YYYY-MM-DD hh:mm:ss',
                      }}
                    />
                  </Col>
                  <Col span={7} offset={1}>
                    <ProFormText
                      name="lon"
                      label="经度"
                      getValueFromEvent={(e) => e.target.value.trim()}
                      fieldProps={{
                        autoComplete: 'off',
                        suffix: (
                          <AimOutlined
                            style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                            onClick={() => {
                              const obj = formRef.current.getFieldValue([]);
                              if (obj.lon && obj.lat) {
                                setPoint({ lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) });
                                const pointNew: any = {
                                  lon: getBit(obj.lon, 7),
                                  lat: getBit(obj.lat, 7),
                                };
                                setMapValues(pointNew);
                              } else {
                                setMapValues(point);
                              }
                              setShowMap(true);
                            }}
                          />
                        ),
                      }}
                      rules={[
                        { required: true, message: '请输入经度' },
                        {
                          pattern: lon,
                          message: '经度范围在0~180之间，且最多保留9位小数',
                        },
                      ]}
                    />
                  </Col>
                  <Col span={7}>
                    <ProFormText
                      name="lat"
                      label="纬度"
                      fieldProps={{
                        autoComplete: 'off',
                        suffix: (
                          <AimOutlined
                            style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                            onClick={() => {
                              const obj = formRef.current.getFieldValue();
                              if (obj.lon && obj.lat) {
                                setPoint({ lon: getBit(obj.lon, 7), lat: getBit(obj.lat, 7) });
                                const pointNew: any = {
                                  lon: getBit(obj.lon, 7),
                                  lat: getBit(obj.lat, 7),
                                };
                                setMapValues(pointNew);
                              } else {
                                setMapValues(point);
                              }
                              setShowMap(true);
                            }}
                          />
                        ),
                      }}
                      getValueFromEvent={(e) => e.target.value.trim()}
                      rules={[
                        { required: true, message: '请输入纬度' },
                        {
                          pattern: lat,
                          message: '纬度范围在0~90之间，且最多保留9位小数',
                        },
                      ]}
                    />
                  </Col>
                  <Col span={7}>
                    <ProFormText
                      name="controlName"
                      label="管控民警"
                      getValueFromEvent={(e) => e.target.value.trim()}
                      fieldProps={{ maxLength: 40, autoComplete: 'off' }}
                      rules={[
                        {
                          pattern:
                            /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/,
                          message: '管控民警仅支持中文',
                        },
                      ]}
                    />
                  </Col>
                  <Col span={7} offset={1}>
                    <ProFormText
                      name="controlPhone"
                      label="管控民警联系方式"
                      getValueFromEvent={(e) => e.target.value.trim()}
                      fieldProps={{ maxLength: 11, autoComplete: 'off' }}
                      rules={[
                        {
                          pattern: Phones,
                          message: '管控民警联系方式格式不正确',
                        },
                      ]}
                    />
                  </Col>
                </>
              )}
              {/* 住店人员字段 */}
              {lodgePos && (
                <>
                  <Col span={7}>
                    <ProFormSelect
                      name="compoion"
                      label="同住人 "
                      placeholder="请输入"
                      fieldProps={{
                        mode: 'tags',
                        tokenSeparators: [','],
                        maxTagTextLength: 4,
                        maxTagCount: 2,
                      }}
                    />
                  </Col>
                  <Col span={7}>
                    <ProFormText
                      name="companionNumber"
                      label="同住人数量"
                      getValueFromEvent={(e) => e.target.value.trim()}
                      fieldProps={{ maxLength: 8, autoComplete: 'off' }}
                      rules={[
                        {
                          pattern: onlyNumber,
                          message: '同住人数量为正整数',
                        },
                      ]}
                    />
                  </Col>
                  <Col span={7} offset={1}>
                    <ProFormText
                      name="departureAdress"
                      label="出发地点"
                      fieldProps={{ maxLength: 200, autoComplete: 'off' }}
                      getValueFromEvent={(e) => e.target.value.trim()}
                      rules={[{ required: true, message: '请输入出发地点' }]}
                    />
                  </Col>
                  {/* 起始时间 */}
                  <Col span={7}>
                    <ProFormDateTimeRangePicker
                      name="timeRange"
                      label="起始时间"
                      rules={[{ required: true, message: '请选择起始时间' }]}
                      fieldProps={{
                        disabledDate: disableStart,
                      }}
                    />
                  </Col>
                </>
              )}
              <Col span={22}>
                <ProFormTextArea
                  wrapperCol={{ span: 24 }}
                  name="remark"
                  label="备注"
                  fieldProps={{ maxLength: 400, autoSize: { minRows: 3, maxRows: 2 } }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        {isShowMap && (
          <Map
            onSubmit={(val) => {
              setPoint(val.point);
              formRef.current.setFieldsValue({ lon: val.lon, lat: val.lat });
              setShowMap(false);
            }}
            onCancel={() => {
              setShowMap(false);
            }}
            isShowMap={isShowMap}
            values={mapValues}
          />
        )}
      </ProForm>
    </PageContainer>
  );
};
export default UpdatePerson;

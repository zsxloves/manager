import React, { useEffect, useState, useRef } from 'react';
import ProForm, { ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Row, Col, message, Form, Input, TreeSelect, Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import { getUnitInfo, saveUnit, getState, org } from '@/services/keyUnit';
import styles from './index.less';
import { AimOutlined } from '@ant-design/icons';
import Map from '@/components/Map'; //引入地图
import { chinese, onlyNumber, alt } from '@/utils/utilsJS';

const AddUnit: React.FC = (props: any) => {
  const formRef: any = useRef(null);
  const unit: any = useRef(null); //采集类型
  const defaultTabs: any = useRef(null); //默认tabs
  const { TabPane } = Tabs;
  const [userId] = useState<string>(props.location?.query?.userId);
  const [userInfo, setUserInfo] = useState<Record<string, unknown>>({}); //用户查询数据
  const [isShowMap, setShowMap] = useState<boolean>(false); //地图
  const [mapValues, setMapValues] = useState<any>({});
  const [enumType, setEnumType] = useState<number>(0);
  const [SCTabs, setScTabs] = useState<string>(''); //编辑首次tab
  //const [currentTab, setCurrentTab] = useState<string>("");//当前选中tab
  const [point, setPoint] = useState<any>(
    props.formData ? [props.formData.lon, props.formData.lat] : [],
  );
  const [stateList, setstateList] = useState<
    {
      value: string;
      label: string;
    }[]
  >(); //公司状态
  const [keyType, setKeyType] = useState<
    {
      value: string;
      label: string;
    }[]
  >(); //单位类型
  const [orgList, setorgList] = useState<
    {
      value: string;
      label: string;
    }[]
  >(); //组织机构

  const isEdit = !!props.location?.query?.userId; //判断新增删除

  const initFunc = () => {
    //公司状态
    const queryObject = {
      page: 0,
      size: 10000000,
      parentId: '98ef16d6-2c87-4072-91f1-dc37a4a8331c',
    };
    getState({ queryObject }).then((res) => {
      const data = res.result.page.content;
      const de =
        data &&
        data.map((item: Record<string, unknown>) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      setstateList(de);
    });
    //单位类型
    getState({
      queryObject: {
        page: 0,
        size: 10000000,
        parentId: 'a54f464e-81bb-4a19-9178-7e6730a15a85',
      },
    }).then((res) => {
      const data = res.result.page.content;
      const de =
        data &&
        data.map((item: Record<string, unknown>) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      setKeyType(de);
    });
    //采集类型
    const querycjlx = {
      page: 0,
      size: 10000000,
      parentId: '34d7861c-5b01-447a-aa33-34d71e581a76',
    };
    getState({ queryObject: querycjlx }).then((res) => {
      const data = res.result.page?.content;
      if (data?.length > 0) unit.current = data;
    });
    //组织机构
    org({}).then((res) => {
      setorgList(res.data);
    });
  };
  useEffect(() => {
    if (isEdit) {
      const EDITENUM = {
        0: 'zddw', //重点单位
        //1: 'zddwmcb', //重点单位名册表
        2: 'gdcjb', //工地采集表
        3: 'jclkcjb', //交叉路口采集表
        4: 'gjcz', //公交车站
        5: 'skq', //上跨桥
        6: 'hdqlgj', //涵洞桥梁高架
        7: 'zgd', //制高点
      };
      //判断是否为编辑 是 则通过userid请求单个数据 放入对象中 通过initialValues设置初始值来首次渲染
      getUnitInfo({ id: userId, page: 0, size: 1 })
        .then((res) => {
          const date = res.result?.detail || {};
          defaultTabs.current = EDITENUM[date.dataType];
          setEnumType(date?.dataType);
          setScTabs(EDITENUM[date.dataType]);
          setUserInfo(date);
          formRef.current.setFieldsValue(date);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    initFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUnit = (params: any) => {
    params.dataType = enumType;
    if (userId) params.id = userId;
    // if(currentTab === SCTabs){}
    // const mange = { ...userInfo, ...params };
    saveUnit({ data: params })
      .then((res: any) => {
        if (res.code === 200) {
          message.success(res.message);
          history.push(
            `/securityResources/keyUnit?page=${parseInt(props.location?.query?.page) + 1}&size=${
              props.location?.query?.size
            }`,
          );
        } else {
          message.error(res.message || res);
        }
      })
      .catch((err: any) => {
        message.error(err.message || err);
      });
  };
  // 取消
  const cancelFun = (): void => {
    history.push(
      `/securityResources/keyUnit?page=${parseInt(props.location?.query?.page) + 1}&size=${
        props.location?.query?.size
      }`,
    );
    defaultTabs.current = null;
  };

  const callback = (key: any) => {
    const ENUM = {
      zddw: 0, //重点单位
      //zddwmcb: 1, //重点单位名册表
      gdcjb: 2, //工地采集表
      jclkcjb: 3, //交叉路口采集表
      gjcz: 4, //公交车站
      skq: 5, //上跨桥
      hdqlgj: 6, //涵洞桥梁高架
      zgd: 7, //制高点
    };
    // setCurrentTab(key);
    defaultTabs.current = key; //切换
    setEnumType(ENUM[key]); //枚举 接口传递
    formRef.current?.resetFields();
    if (userId && SCTabs === key) {
      formRef.current.setFieldsValue(userInfo);
    }
  };
  //重点单位
  const zddw = () => {
    return (
      <Row>
        {/* 单位名称 */}
        <Col span={7}>
          <ProFormText
            name="name"
            label="单位名称"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
            rules={[{ required: true, message: '请输入单位名称' }]}
          />
        </Col>
        {/* 联系人 */}
        <Col span={7} offset={1}>
          <ProFormText
            name="contacts"
            label="联系人"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
            rules={[{ required: true }, { pattern: chinese, message: '请输入中文' }]}
          />
        </Col>
        {/* 联系电话 */}
        <Col span={7} offset={1}>
          <ProFormText
            name="contactNo"
            label="联系电话"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 11, autoComplete: 'off' }}
            rules={[
              { required: true, message: '请输入联系电话' },
              {
                pattern: /^((\d{11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8}))$/,
                message: '请输入正确的联系电话',
              },
            ]}
          />
        </Col>
        {/* 标准地址 */}
        <Col span={7}>
          <ProFormText
            name="standardAddress"
            label="标准地址"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 255, autoComplete: 'off' }}
            rules={[
              { required: true, message: '请输入标准地址' },
              {
                message: '标准地址长度在1~255之间',
              },
            ]}
          />
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            label="上报单位"
            name="organizationId"
            rules={[{ required: true, message: '请选择上报单位' }]}
          >
            <TreeSelect
              fieldNames={{ label: 'title', value: 'key', children: 'children' }}
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              treeData={orgList}
              treeNodeFilterProp="title"
              showSearch
            />
          </Form.Item>
        </Col>
        {/* 经度 */}
        <Col span={7} offset={1}>
          <Form.Item
            name="lon"
            label="经度:"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入经度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,3}$)|(^[0-9]{1,3}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 180 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('经度范围在0~180之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={32}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        {/* 纬度 */}
        <Col span={7}>
          <Form.Item
            name="lat"
            getValueFromEvent={(e) => e.target.value.trim()}
            label="纬度:"
            rules={[
              // { required: true, message: '请输入纬度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,2}$)|(^[0-9]{1,2}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 90 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('纬度范围在0~90之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={12}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        {/* 高度 */}
        <Col span={7} offset={1}>
          <Form.Item
            name="height"
            label="高度"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入高度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,9}$)|(^[0-9]{1,9}[.]{1}[0-9]{1,2}$)/g;
                  if (reg.test(value) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('整数最多九位且小数最多两位'));
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        {/* 简称 */}
        <Col span={7} offset={1}>
          <ProFormText
            name="abbreviation"
            getValueFromEvent={(e) => e.target.value.trim()}
            label="简称"
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
          />
        </Col>
        {/* 法人 */}
        <Col span={7}>
          <ProFormText
            name="corporation"
            getValueFromEvent={(e) => e.target.value.trim()}
            label="法人"
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
            rules={[
              // { required: true, message: '请输入法人' },
              { pattern: chinese, message: '请输入中文' },
            ]}
          />
        </Col>
        {/* 公司状态 */}
        <Col span={7} offset={1}>
          <ProFormSelect
            showSearch
            name="status"
            label="公司状态"
            options={stateList}
            // rules={[{ required: true, message: '请选择状态' }]}
          />
        </Col>
        {/* 社会统一信用代码 */}
        <Col span={7} offset={1}>
          <ProFormText
            name="uscc"
            label="社会统一信用代码"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
            rules={[
              // { required: true, message: '请输入社会统一信用代码' },
              { message: '社会统一信用代码长度在1~40之间' },
              { pattern: /^[0-9a-zA-Z]*$/, message: '请输入英文或数字' },
            ]}
          />
        </Col>

        {/* 安保联系人 */}
        <Col span={7}>
          <ProFormText
            name="securityContacts"
            label="安保联系人"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
            rules={[
              // { required: true, message: '请输入安保联系人' },
              { pattern: chinese, message: '请输入中文' },
            ]}
          />
        </Col>
        {/* 安保联系电话 */}
        <Col span={7} offset={1}>
          <ProFormText
            name="securityContactno"
            label="安保联系电话"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 11, autoComplete: 'off' }}
            rules={[
              // { required: true, message: '请输入安保联系电话' },
              {
                pattern: /^((\d{11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8}))$/,
                message: '请输入正确的安保联系电话',
              },
            ]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormSelect showSearch name="unitType" label="单位类型" options={keyType} />
        </Col>
        <Col span={7}>
          <ProFormText
            name="dangerName"
            label="存放危险物品名称"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="num"
            label="数量"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="measures"
            label="控制措施"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7}>
          <ProFormText
            name="road"
            label="涉及路名"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 64, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="area"
            label="片区"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 64, autoComplete: 'off' }}
          />
        </Col>
      </Row>
    );
  };
  //制高点
  const zgd = () => {
    return (
      <Row>
        <Col span={7}>
          <ProFormText
            name="standardAddress"
            label="岗位位置"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 255, autoComplete: 'off' }}
            rules={[
              { required: true, message: '请输入标准地址' },
              {
                message: '标准地址长度在1~255之间',
              },
            ]}
          />
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            name="lon"
            label="经度:"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入经度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,3}$)|(^[0-9]{1,3}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 180 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('经度范围在0~180之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={32}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        {/* 纬度 */}
        <Col span={7} offset={1}>
          <Form.Item
            name="lat"
            getValueFromEvent={(e) => e.target.value.trim()}
            label="纬度:"
            rules={[
              // { required: true, message: '请输入纬度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,2}$)|(^[0-9]{1,2}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 90 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('纬度范围在0~90之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={12}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item
            name="height"
            label="高度"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入高度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,9}$)|(^[0-9]{1,9}[.]{1}[0-9]{1,2}$)/g;
                  if (reg.test(value) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('整数最多九位且小数最多两位'));
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            label="辖区所"
            name="organizationId"
            rules={[{ required: true, message: '请选择辖区所' }]}
          >
            <TreeSelect
              fieldNames={{ label: 'title', value: 'key', children: 'children' }}
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              treeData={orgList}
              treeNodeFilterProp="title"
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="area"
            label="片区"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 64, autoComplete: 'off' }}
          />
        </Col>
        <Col span={23}>
          <ProFormTextArea
            wrapperCol={{ span: 23 }}
            name="distence"
            label="距离"
            fieldProps={{ maxLength: 255, autoSize: { minRows: 3, maxRows: 2 } }}
          />
        </Col>
        <Col span={23}>
          <ProFormTextArea
            wrapperCol={{ span: 23 }}
            name="distenceType"
            label="距离类型"
            fieldProps={{ maxLength: 255, autoSize: { minRows: 3, maxRows: 2 } }}
          />
        </Col>
      </Row>
    );
  };
  //重点单位名册表
  // const zddwmcb = () => {
  //   return (
  //     <Row>
  //       {/* 单位名称 */}
  //       <Col span={7}>
  //         <ProFormText
  //           name="name"
  //           label="单位名称"
  //           getValueFromEvent={(e) => e.target.value.trim()}
  //           fieldProps={{ maxLength: 255, autoComplete: 'off' }}
  //           rules={[{ required: true, message: '请输入单位名称' }]}
  //         />
  //       </Col>
  //       {/* 联系人 */}
  //       <Col span={7} offset={1}>
  //         <ProFormText
  //           name="contacts"
  //           label="负责人"
  //           getValueFromEvent={(e) => e.target.value.trim()}
  //           fieldProps={{ maxLength: 40, autoComplete: 'off' }}
  //           rules={[{ required: true }, { pattern: chinese, message: '请输入中文' }]}
  //         />
  //       </Col>
  //       {/* 联系电话 */}
  //       <Col span={7} offset={1}>
  //         <ProFormText
  //           name="contactNo"
  //           label="手机号码"
  //           getValueFromEvent={(e) => e.target.value.trim()}
  //           fieldProps={{ maxLength: 11, autoComplete: 'off' }}
  //           rules={[
  //             { required: true, message: '请输入手机号码' },
  //             {
  //               pattern: /^((\d{11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8}))$/,
  //               message: '请输入正确的手机号码',
  //             },
  //           ]}
  //         />
  //       </Col>
  //       {/* 组织机构 */}
  //       <Col span={7}>
  //         <Form.Item
  //           label="上报单位"
  //           name="organizationId"
  //           rules={[{ required: true, message: '请选择上报单位' }]}
  //         >
  //           <TreeSelect
  //  fieldNames={{ label: 'title', value: 'key', children: 'children' }}
  //             style={{ width: '100%' }}
  //             dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
  //             placeholder="请选择"
  //             allowClear
  //             treeDefaultExpandAll
  //             treeData={orgList}
  //             treeNodeFilterProp="title"
  //             showSearch
  //           />
  //         </Form.Item>
  //       </Col>
  //       <Col span={7} offset={1}>
  //         <ProFormText
  //           name="dangerName"
  //           label="存放危险物品名称"
  //           getValueFromEvent={(e) => e.target.value.trim()}
  //           fieldProps={{ maxLength: 40, autoComplete: 'off' }}
  //         />
  //       </Col>
  //       <Col span={7} offset={1}>
  //         <ProFormText
  //           name="type"
  //           label="类别"
  //           getValueFromEvent={(e) => e.target.value.trim()}
  //           fieldProps={{ maxLength: 40, autoComplete: 'off' }}
  //           rules={[{ required: true, message: '请输入类别' }]}
  //         />
  //       </Col>
  //       <Col span={7}>
  //         <ProFormText
  //           name="num"
  //           label="数量"
  //           getValueFromEvent={(e) => e.target.value.trim()}
  //           fieldProps={{ maxLength: 40, autoComplete: 'off' }}
  //         />
  //       </Col>
  //       <Col span={7} offset={1}>
  //         <ProFormText
  //           name="measures"
  //           label="控制措施"
  //           getValueFromEvent={(e) => e.target.value.trim()}
  //           fieldProps={{ maxLength: 40, autoComplete: 'off' }}
  //         />
  //       </Col>

  //       <Col span={7} offset={1}>
  //         <ProFormText
  //           name="road"
  //           label="涉及路名"
  //           getValueFromEvent={(e) => e.target.value.trim()}
  //           fieldProps={{ maxLength: 40, autoComplete: 'off' }}
  //         />
  //       </Col>
  //       <Col span={7}>
  //         <ProFormText
  //           name="area"
  //           label="片区"
  //           getValueFromEvent={(e) => e.target.value.trim()}
  //           fieldProps={{ maxLength: 40, autoComplete: 'off' }}
  //         />
  //       </Col>
  //       {/* 备注 */}
  //       <Col span={23}>
  //         <ProFormTextArea
  //           wrapperCol={{ span: 23 }}
  //           name="remark"
  //           label="备注"
  //           fieldProps={{ maxLength: 400, autoSize: { minRows: 3, maxRows: 2 } }}
  //         />
  //       </Col>
  //     </Row>
  //   );
  // };

  //工地采集表
  const gdcjb = () => {
    return (
      <Row>
        <Col span={7}>
          <ProFormText
            name="name"
            label="工地名称"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
            rules={[{ required: true, message: '请输入工地名称' }]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="contacts"
            label="负责人"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
            rules={[{ required: true }, { pattern: chinese, message: '请输入中文' }]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="contactNo"
            label="联系方式"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 11, autoComplete: 'off' }}
            rules={[
              { required: true, message: '请输入联系方式' },
              {
                pattern: /^((\d{11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8}))$/,
                message: '请输入正确的联系方式',
              },
            ]}
          />
        </Col>
        <Col span={7}>
          <Form.Item
            label="上报单位"
            name="organizationId"
            rules={[{ required: true, message: '请选择上报单位' }]}
          >
            <TreeSelect
              fieldNames={{ label: 'title', value: 'key', children: 'children' }}
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              treeData={orgList}
              treeNodeFilterProp="title"
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="standardAddress"
            label="地址"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 255, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="roadNum"
            label="道路出入口数"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 9, autoComplete: 'off' }}
            rules={[
              {
                pattern: onlyNumber,
                message: '道路出入口数为正整数',
              },
            ]}
          />
        </Col>
        <Col span={7}>
          <ProFormText
            name="checkNum"
            label="出入口排查道路数"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 9, autoComplete: 'off' }}
            rules={[
              {
                pattern: onlyNumber,
                message: '出入口面向排查道路数为正整数',
              },
            ]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="unit"
            label="隶属单位"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="securityContacts"
            label="属地派出所负责人"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
            rules={[{ pattern: chinese, message: '请输入中文' }]}
          />
        </Col>
        <Col span={7}>
          <ProFormText
            name="securityContactno"
            label="属地派出所联系方式"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 11, autoComplete: 'off' }}
            rules={[
              {
                pattern: /^((\d{11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8}))$/,
                message: '请输入正确的属地派出所联系方式',
              },
            ]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="road"
            label="涉及路名"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 64, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="area"
            label="片区"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 64, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7}>
          <Form.Item
            name="lon"
            label="经度:"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入经度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,3}$)|(^[0-9]{1,3}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 180 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('经度范围在0~180之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={32}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        {/* 纬度 */}
        <Col span={7} offset={1}>
          <Form.Item
            name="lat"
            getValueFromEvent={(e) => e.target.value.trim()}
            label="纬度:"
            rules={[
              // { required: true, message: '请输入纬度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,2}$)|(^[0-9]{1,2}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 90 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('纬度范围在0~90之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={12}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            name="height"
            label="高度"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入高度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,9}$)|(^[0-9]{1,9}[.]{1}[0-9]{1,2}$)/g;
                  if (reg.test(value) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('整数最多九位且小数最多两位'));
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        <Col span={23}>
          <ProFormTextArea
            wrapperCol={{ span: 23 }}
            name="remark"
            label="备注"
            fieldProps={{ maxLength: 400, autoSize: { minRows: 3, maxRows: 2 } }}
          />
        </Col>
      </Row>
    );
  };
  //交叉路口
  const jclkcj = () => {
    return (
      <Row>
        <Col span={7}>
          <ProFormText
            name="name"
            label="交叉道路名称"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
            rules={[{ required: true, message: '请输入交叉道路名称' }]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormSelect
            name="type"
            label="类别"
            rules={[{ required: true, message: '请选择类别' }]}
            fieldProps={{
              showSearch: true,
            }}
            options={[
              { label: '小区出入口', value: '小区出入口' },
              { label: '主干道出口', value: '主干道出口' },
              { label: '小路出口', value: '小路出口' },
              { label: '单位出入口', value: '单位出入口' },
            ]}
          />
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            label="上报单位"
            name="organizationId"
            rules={[{ required: true, message: '请选择上报单位' }]}
          >
            <TreeSelect
              fieldNames={{ label: 'title', value: 'key', children: 'children' }}
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              treeData={orgList}
              treeNodeFilterProp="title"
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item
            name="lon"
            label="经度:"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入经度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,3}$)|(^[0-9]{1,3}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 180 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('经度范围在0~180之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={32}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        {/* 纬度 */}
        <Col span={7} offset={1}>
          <Form.Item
            name="lat"
            getValueFromEvent={(e) => e.target.value.trim()}
            label="纬度:"
            rules={[
              // { required: true, message: '请输入纬度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,2}$)|(^[0-9]{1,2}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 90 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('纬度范围在0~90之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={12}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            name="height"
            label="高度"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入高度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,9}$)|(^[0-9]{1,9}[.]{1}[0-9]{1,2}$)/g;
                  if (reg.test(value) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('整数最多九位且小数最多两位'));
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        <Col span={7}>
          <ProFormText
            name="roadNum"
            label="双向几车道"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 9, autoComplete: 'off' }}
            rules={[
              {
                pattern: onlyNumber,
                message: '双向几车道为正整数',
              },
            ]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormSelect
            name="isLight"
            label="是否有红绿灯"
            fieldProps={{
              showSearch: true,
            }}
            options={[
              { label: '是', value: '是' },
              { label: '否', value: '否' },
            ]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormSelect
            name="isLimit"
            label="道路中间是否有隔离"
            fieldProps={{
              showSearch: true,
            }}
            options={[
              { label: '是', value: '是' },
              { label: '否', value: '否' },
            ]}
          />
        </Col>
        <Col span={7}>
          <ProFormSelect
            name="isCarLimit"
            label="与非机动车是否隔离"
            fieldProps={{
              showSearch: true,
            }}
            options={[
              { label: '是', value: '是' },
              { label: '否', value: '否' },
            ]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormSelect
            name="isLine"
            label="是否有斑马线"
            fieldProps={{
              showSearch: true,
            }}
            options={[
              { label: '是', value: '是' },
              { label: '否', value: '否' },
            ]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="standardAddress"
            label="具体位置"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 255, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7}>
          <ProFormText
            name="road"
            label="涉及路名"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 64, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="area"
            label="片区"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 64, autoComplete: 'off' }}
          />
        </Col>
        <Col span={23}>
          <ProFormTextArea
            wrapperCol={{ span: 23 }}
            name="remark"
            label="备注"
            fieldProps={{ maxLength: 400, autoSize: { minRows: 3, maxRows: 2 } }}
          />
        </Col>
      </Row>
    );
  };
  //公交站
  const gjz = () => {
    return (
      <Row>
        <Col span={7}>
          <ProFormText
            name="name"
            label="公交车站名称"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
            rules={[{ required: true, message: '请输入公交车站名称' }]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="standardAddress"
            label="具体地址"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 255, autoComplete: 'off' }}
            rules={[{ required: true, message: '请输入具体地址' }]}
          />
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            label="上报单位"
            name="organizationId"
            rules={[{ required: true, message: '请选择上报单位' }]}
          >
            <TreeSelect
              fieldNames={{ label: 'title', value: 'key', children: 'children' }}
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              treeData={orgList}
              treeNodeFilterProp="title"
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item
            name="lon"
            label="经度:"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入经度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,3}$)|(^[0-9]{1,3}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 180 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('经度范围在0~180之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={32}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        {/* 纬度 */}
        <Col span={7} offset={1}>
          <Form.Item
            name="lat"
            getValueFromEvent={(e) => e.target.value.trim()}
            label="纬度:"
            rules={[
              // { required: true, message: '请输入纬度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,2}$)|(^[0-9]{1,2}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 90 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('纬度范围在0~90之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={12}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            name="height"
            label="高度"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入高度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,9}$)|(^[0-9]{1,9}[.]{1}[0-9]{1,2}$)/g;
                  if (reg.test(value) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('整数最多九位且小数最多两位'));
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        <Col span={7}>
          <ProFormText
            name="storeAddress"
            label="位置方向"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="line"
            label="具体线路"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="road"
            label="涉及路名"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 64, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7}>
          <ProFormText
            name="area"
            label="片区"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 64, autoComplete: 'off' }}
          />
        </Col>
      </Row>
    );
  };
  //上跨桥
  const skq = () => {
    return (
      <Row>
        <Col span={7}>
          <ProFormText
            name="name"
            label="名称"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
            rules={[{ required: true, message: '请输入名称' }]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="standardAddress"
            label="位置"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 255, autoComplete: 'off' }}
            rules={[{ required: true, message: '请输入位置' }]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormSelect
            name="type"
            label="类别"
            rules={[{ required: true, message: '请选择类别' }]}
            fieldProps={{
              showSearch: true,
            }}
            options={[
              { label: '铁路上跨', value: '铁路上跨' },
              { label: '公路上跨', value: '公路上跨' },
            ]}
          />
        </Col>
        <Col span={7}>
          <ProFormText
            name="length"
            label="长度"
            tooltip="单位：米"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 8, autoComplete: 'off' }}
            rules={[{ pattern: alt, message: '整数最多八位且小数最多两位' }]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="width"
            label="宽度"
            tooltip="单位：米"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 8, autoComplete: 'off' }}
            rules={[{ pattern: alt, message: '整数最多八位且小数最多两位' }]}
          />
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            name="lon"
            label="经度:"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入经度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,3}$)|(^[0-9]{1,3}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 180 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('经度范围在0~180之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={32}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        {/* 纬度 */}
        <Col span={7}>
          <Form.Item
            name="lat"
            getValueFromEvent={(e) => e.target.value.trim()}
            label="纬度:"
            rules={[
              // { required: true, message: '请输入纬度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,2}$)|(^[0-9]{1,2}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 90 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('纬度范围在0~90之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={12}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            name="height"
            label="高度"
            tooltip="单位：米"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入高度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,9}$)|(^[0-9]{1,9}[.]{1}[0-9]{1,2}$)/g;
                  if (reg.test(value) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('整数最多九位且小数最多两位'));
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        {/* <Col span={7} offset={1}>
          <ProFormText
            name="height"
            label="高度"
            
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 9, autoComplete: 'off' }}
            rules={[{ pattern: alt, message: '整数最多九位且小数最多两位' }]}
          />
        </Col> */}
        <Col span={7} offset={1}>
          <ProFormText
            name="area"
            label="片区"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 64, autoComplete: 'off' }}
          />
        </Col>
        <Col span={23}>
          <ProFormTextArea
            wrapperCol={{ span: 23 }}
            name="remark"
            label="备注"
            fieldProps={{ maxLength: 400, autoSize: { minRows: 3, maxRows: 2 } }}
          />
        </Col>
      </Row>
    );
  };
  //涵洞桥梁高架
  const hdqlgj = () => {
    return (
      <Row>
        <Col span={7}>
          <ProFormText
            name="name"
            label="名称"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 40, autoComplete: 'off' }}
            rules={[{ required: true, message: '请输入名称' }]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="standardAddress"
            label="位置"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 255, autoComplete: 'off' }}
            rules={[{ required: true, message: '请输入位置' }]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormSelect
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
            fieldProps={{
              showSearch: true,
            }}
            options={[
              { label: '涵洞', value: '涵洞' },
              { label: '桥梁', value: '桥梁' },
              { label: '高架', value: '高架' },
            ]}
          />
        </Col>
        <Col span={7}>
          <Form.Item
            label="上报单位"
            name="organizationId"
            rules={[{ required: true, message: '请选择上报单位' }]}
          >
            <TreeSelect
              fieldNames={{ label: 'title', value: 'key', children: 'children' }}
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              treeData={orgList}
              treeNodeFilterProp="title"
              showSearch
            />
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="length"
            label="长度"
            tooltip="单位：米"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 8, autoComplete: 'off' }}
            rules={[{ pattern: alt, message: '整数最多八位且小数最多两位' }]}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="width"
            label="宽度"
            tooltip="单位：米"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 8, autoComplete: 'off' }}
            rules={[{ pattern: alt, message: '整数最多八位且小数最多两位' }]}
          />
        </Col>
        <Col span={7}>
          <Form.Item
            name="lon"
            label="经度:"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入经度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,3}$)|(^[0-9]{1,3}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 180 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('经度范围在0~180之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={32}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        {/* 纬度 */}
        <Col span={7} offset={1}>
          <Form.Item
            name="lat"
            getValueFromEvent={(e) => e.target.value.trim()}
            label="纬度:"
            rules={[
              // { required: true, message: '请输入纬度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,2}$)|(^[0-9]{1,2}[.]{1}[0-9]{1,9}$)/g;
                  if ((Number(value) > 0 && Number(value) < 90 && reg.test(value)) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('纬度范围在0~90之间，且最多保留9位小数'));
                },
              }),
            ]}
          >
            <Input
              maxLength={12}
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item
            name="height"
            label="高度"
            tooltip="单位：米"
            getValueFromEvent={(e) => e.target.value.trim()}
            rules={[
              // { required: true, message: '请输入高度' },
              () => ({
                validator(_, value) {
                  const reg = /(^[+]?(0|([1-9])){1,9}$)|(^[0-9]{1,9}[.]{1}[0-9]{1,2}$)/g;
                  if (reg.test(value) || !value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('整数最多九位且小数最多两位'));
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入"
              autoComplete="off"
              suffix={
                <AimOutlined
                  style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
                  onClick={() => {
                    const obj = formRef.current.getFieldValue();
                    if (obj.lon && obj.lat) {
                      setPoint({ lon: obj.lon, lat: obj.lat });
                      const pointNew: any = { lon: obj.lon, lat: obj.lat };
                      setMapValues(pointNew);
                    } else {
                      setMapValues(point);
                    }
                    setShowMap(true);
                  }}
                />
              }
            />
          </Form.Item>
        </Col>
        <Col span={7}>
          <ProFormText
            name="road"
            label="涉及路名"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 64, autoComplete: 'off' }}
          />
        </Col>
        <Col span={7} offset={1}>
          <ProFormText
            name="area"
            label="片区"
            getValueFromEvent={(e) => e.target.value.trim()}
            fieldProps={{ maxLength: 64, autoComplete: 'off' }}
          />
        </Col>
        <Col span={23}>
          <ProFormTextArea
            wrapperCol={{ span: 23 }}
            name="remark"
            label="备注"
            fieldProps={{ maxLength: 400, autoSize: { minRows: 3, maxRows: 2 } }}
          />
        </Col>
      </Row>
    );
  };
  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProForm
        formRef={formRef}
        className={styles.PageContainer}
        layout="horizontal" //label和输入框一行
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
                    updateUnit(val);
                  });
                }}
              >
                保存
              </Button>,
            ];
          },
        }}
        labelCol={{ style: { width: 140 } }}
      >
        <Row>
          <Form.Item className={styles.headerText}>
            {userId ? '编辑基础信息' : '新增基础信息'}
          </Form.Item>
        </Row>
        <Tabs
          className={styles.Tab}
          activeKey={defaultTabs.current || 'zddw'}
          destroyInactiveTabPane={true}
          onChange={callback}
        >
          {unit.current?.map((item: any) => {
            return (
              <TabPane tab={item?.name} key={item?.code}>
                <div className="xbox mr20">
                  {item.code === 'zddw' ? (
                    zddw()
                  ) : item.code === 'zgd' ? (
                    zgd()
                  ) : item.code === 'gdcjb' ? (
                    gdcjb()
                  ) : item.code === 'jclkcjb' ? (
                    jclkcj()
                  ) : item.code === 'gjcz' ? (
                    gjz()
                  ) : item.code === 'skq' ? (
                    skq()
                  ) : item.code === 'hdqlgj' ? (
                    hdqlgj()
                  ) : (
                    <></>
                  )}
                </div>
              </TabPane>
            );
          })}
        </Tabs>
      </ProForm>
      {isShowMap && (
        <Map
          onSubmit={(val) => {
            setPoint(val.point);
            formRef.current.setFieldsValue({ lon: val.lon, lat: val.lat, height: val.alt });
            setShowMap(false);
          }}
          onCancel={() => {
            setShowMap(false);
          }}
          isShowMap={isShowMap}
          values={mapValues}
        />
      )}
    </PageContainer>
  );
};
export default AddUnit;

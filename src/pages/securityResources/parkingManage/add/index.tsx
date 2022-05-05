import { history, useLocation } from 'umi';
import { useEffect, useState, useRef } from 'react';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { Button, Row, Col, message, Form } from 'antd';
import { getInfoById, addParking } from '../../../../services/parking';
import { getTableData as getGym } from '@/services/venue/index';
import InputSuffix from '@/components/InputSuffix/index';
import Map from '@/components/Map';
import { PageContainer } from '@ant-design/pro-layout';
import { lon, lat, alt, Phones, onlyNumber, fixed2, getBit } from '@/utils/utilsJS';
import styles from '@/pages/securityActivities/activityManage/add/index.less';

type TTpye = {
  value: string;
  label: string;
}[];

function ParkingAdd() {
  const [item, setItem] = useState<any>({});
  const [ggymlList, setGymList] = useState<TTpye>();
  const [typeList, setTypeList] = useState<any[]>();
  const [showMap, setShowMap] = useState<boolean>(false);
  const [mapValues, setMapValues] = useState<any>({});
  // const [current] = useState<number>(props.location?.query?.current);
  // const [pageSize] = useState<number>(props.location?.query?.pageSize);
  const formRef: any = useRef(null);
  const route: any = useLocation<any>();
  const { id, detail, current, pageSize } = route?.query;

  function submit() {
    formRef.current.validateFields().then((val: any) => {
      const data = {
        ...val,
      };
      if (item && item.id) {
        data.id = item.id;
        data.sortIndex = item.sortIndex;
      }
      addParking({
        data,
      })
        .then(() => {
          message.success('操作成功');
          history.push(
            `/securityResources/parkingManage?page=${parseInt(current)}&size=${pageSize}`,
          );
        })
        .catch((res) => {
          message.error(res.message);
        });
    });
  }
  useEffect(() => {
    // 类型
    setTypeList([
      { label: 'G类贵宾车辆', value: 'G类贵宾车辆' },
      { label: 'TA类运动员班车', value: 'TA类运动员班车' },
      { label: 'TF类技术官员班车', value: 'TF类技术官员班车' },
      { label: 'M类媒体车辆', value: 'M类媒体车辆' },
      { label: 'V类场馆保障与服务', value: 'V类场馆保障与服务' },
      { label: 'S类安保车辆', value: 'S类安保车辆' },
    ]);
    // 场馆
    getGym({ page: 0, size: 2 ** 10 }).then((res) => {
      if (res.code === 200 && res.result.page.content) {
        const result: any[] = res.result.page.content;
        setGymList(
          result.map((v: any) => {
            return {
              label: v.name,
              value: v.id,
            };
          }),
        );
      }
    });
    if (id) {
      // 获取当前活动详情
      getInfoById(id).then((res) => {
        const detailC = res.result.detail;
        detailC.lon = getBit(detailC?.lon, 10);
        detailC.lat = getBit(detailC?.lat, 10);
        formRef.current.setFieldsValue(detailC);
        setItem(res.result.detail);
      });
    }
  }, []);

  function clickMapIcon() {
    const obj = formRef.current.getFieldsValue(true);
    setMapValues({
      lon: getBit(obj.lon, 7),
      lat: getBit(obj.lat, 7),
    });
    setShowMap(true);
  }

  return (
    <PageContainer title={false} breadcrumb={undefined}>
      <ProForm
        formRef={formRef}
        className={styles.PageContainer}
        labelAlign="right"
        layout="horizontal"
        labelCol={{ style: { width: 140 } }}
        size="large"
        submitter={{
          render: () => {
            return [
              <Button
                key="cancel"
                onClick={() => {
                  history.push(
                    `/securityResources/parkingManage?page=${parseInt(current)}&size=${pageSize}`,
                  );
                }}
              >
                取消
              </Button>,
              <Button
                key="next1"
                type="primary"
                onClick={() => {
                  submit();
                }}
              >
                保存
              </Button>,
            ];
          },
        }}
      >
        <Row>
          <Form.Item className={styles.headerText}>
            {detail ? '修改停车场' : '新增停车场'}
          </Form.Item>
        </Row>
        <Row>
          <Col span={23} offset={1}>
            <Row>
              <Col span={7}>
                <ProFormText
                  name="name"
                  label="停车场名称"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ maxLength: 20, autoComplete: 'off' }}
                  rules={[{ required: true, message: '请输入停车场名称' }]}
                />
              </Col>
              <Col span={7}>
                <ProFormSelect
                  options={typeList}
                  name="type"
                  label="停车场类别"
                  rules={[{ required: true, message: '请选择停车场类别' }]}
                />
              </Col>
              <Col span={7}>
                <ProFormSelect
                  options={ggymlList}
                  name="gymId"
                  label="所属场馆"
                  fieldProps={{
                    showSearch: true,
                  }}
                  rules={[{ required: true, message: '请选择所属场馆' }]}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="gymLevel"
                  label="场馆层级"
                  placeholder="请输入"
                  fieldProps={{ maxLength: 20, autoComplete: 'off' }}
                  rules={[
                    {
                      required: true,
                      message: '请输入场馆层级',
                    },
                  ]}
                  getValueFromEvent={(e) => e.target.value.trim()}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="no"
                  label="停车场编号"
                  fieldProps={{ maxLength: 36, autoComplete: 'off' }}
                  rules={[
                    {
                      required: true,
                      message: '请输入停车场编号',
                    },
                    {
                      pattern: /^[A-Za-z0-9]{1,36}$/,
                      message: '停车场编号由1-36个英文或数字构成',
                    },
                  ]}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="total"
                  label="停车位总量"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ maxLength: 20, autoComplete: 'off' }}
                  rules={[
                    {
                      pattern: onlyNumber,
                      message: '停车位总量为正整数',
                    },
                  ]}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="saturation"
                  label="停车场饱和度"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    {
                      pattern: fixed2,
                      message: '停车场饱和度为正整数，若为小数请保留两位',
                    },
                  ]}
                  fieldProps={{
                    suffix: '%',
                    maxLength: 20,
                    autoComplete: 'off',
                  }}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="site"
                  label="停车场位置"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ maxLength: 40, autoComplete: 'off' }}
                  // fieldProps={{
                  //   suffix: InputSuffix(clickMapIcon),
                  // }}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="lon"
                  label="经度"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    {
                      pattern: lon,
                      message: '经度范围在0~180之间，且最多保留9位小数',
                    },
                  ]}
                  fieldProps={{
                    suffix: InputSuffix(clickMapIcon),
                    autoComplete: 'off',
                  }}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="lat"
                  label="纬度"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    {
                      pattern: lat,
                      message: '纬度范围在0~90之间，且最多保留9位小数',
                    },
                  ]}
                  fieldProps={{
                    suffix: InputSuffix(clickMapIcon),
                    autoComplete: 'off',
                  }}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="height"
                  label="高度"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    {
                      pattern: alt,
                      message: '整数最多九位且小数最多两位',
                    },
                  ]}
                  fieldProps={{
                    suffix: InputSuffix(clickMapIcon),
                    defaultValue: 0,
                  }}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="status"
                  label="使用状态"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ maxLength: 20, autoComplete: 'off' }}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="src"
                  label="信息标识地址"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ maxLength: 100, autoComplete: 'off' }}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="enterNumber"
                  label="停车场出入口数量"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ maxLength: 9, autoComplete: 'off' }}
                  rules={[
                    {
                      pattern: /^\d{1,}$/,
                      message: '停车场出入口数量为整数',
                    },
                  ]}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="personName"
                  label="负责人姓名"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ autoComplete: 'off' }}
                  rules={[
                    {
                      pattern: /^(?:[\u4e00-\u9fa5·]{1,40})$/,
                      message: '负责人姓名为1-40个中文字符',
                    },
                  ]}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="idCard"
                  label="负责人身份证号"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ maxLength: 18, autoComplete: 'off' }}
                  rules={[
                    {
                      pattern:
                        /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
                      message: '负责人身份证号格式不正确',
                    },
                  ]}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="phoneNumber"
                  label="负责人联系电话"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ maxLength: 11, autoComplete: 'off' }}
                  rules={[
                    {
                      pattern: Phones,
                      message: '负责人联系电话为固话或手机号',
                    },
                  ]}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="zoneCode"
                  label="所属区域编码"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ autoComplete: 'off' }}
                  rules={[
                    {
                      pattern: /^[A-Za-z0-9]{1,20}$/,
                      message: '所属区域编码由1-20个英文或数字构成',
                    },
                  ]}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </ProForm>
      {showMap && (
        <Map
          onSubmit={(val: any) => {
            const data: any = {
              lon: val.lon,
              lat: val.lat,
              height: val.alt,
            };
            if (val.address) {
              data.site = val.address;
            }
            formRef.current.setFieldsValue(data);
            setShowMap(false);
          }}
          onCancel={() => {
            setShowMap(false);
          }}
          isShowMap={showMap}
          values={mapValues}
        />
      )}
    </PageContainer>
  );
}

export default ParkingAdd;

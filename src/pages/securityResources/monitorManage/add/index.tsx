import { history, useLocation } from 'umi';
import { useEffect, useState, useRef } from 'react';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { Button, Row, Col, message, Form, TreeSelect } from 'antd';
import styles from '@/pages/securityActivities/activityManage/add/index.less';
import './index.less';
import { addMonitor, getInfoById, updateMonitor } from '@/services/monitor';
import InputSuffix from '@/components/InputSuffix/index';
import Map from '@/components/Map';
import { PageContainer } from '@ant-design/pro-layout';
import useAllOrg from '@/hooks/useAllOrg';
import { useIconType } from '@/hooks/useIconType';
import useLayer from '@/hooks/useLayer';
import { lon, lat, url, alt, getBit } from '@/utils/utilsJS';

function ParkingAdd() {
  const [item, setItem] = useState<any>({});
  const [showMap, setShowMap] = useState<boolean>(false);
  const [mapValues, setMapValues] = useState<any>({});
  const dTypeObj = useIconType('f7c64514-a7ce-46d2-addc-0ad343b165b9');
  const inDoor = useIconType('9bffc490-1da9-4d7e-9fd5-570b1f640491');
  const formRef: any = useRef(null);
  const layerObj = useLayer();
  const [submitLoaidng, setSubmitLoaidng] = useState<boolean>(false);
  const route: any = useLocation<any>();
  const { id, page, size } = route?.query;

  const orgObj = useAllOrg();

  function submit() {
    formRef.current.validateFields().then((val: any) => {
      setSubmitLoaidng(true);
      const data = {
        ...val,
      };
      if (item && item.id) {
        data.id = item.id;
      }

      data.height = data.height || 0;
      if (data.id) {
        if (data.inDoor === undefined) {
          data.inDoor = '';
        }
        if (data.layerId === undefined) {
          data.layerId = '';
        }
        updateMonitor(data)
          .then((res) => {
            setSubmitLoaidng(false);
            if (res.code === 200) {
              message.success('操作成功');
              history.push(`/securityResources/monitorManage?page=${parseInt(page)}&size=${size}`);
            }
          })
          .catch((res) => {
            setSubmitLoaidng(false);
            message.error(res.message);
          });
      } else {
        addMonitor(data)
          .then((res) => {
            setSubmitLoaidng(false);
            if (res.code === 200) {
              message.success('操作成功');
              history.push(`/securityResources/monitorManage?page=${parseInt(page)}&size=${size}`);
            }
          })
          .catch((res) => {
            setSubmitLoaidng(false);
            message.error(res.message);
          });
      }
    });
  }
  useEffect(() => {
    if (id) {
      // 获取当前活动详情
      getInfoById(id)
        .then((res) => {
          const detailC = res.data.rows[0];
          if (detailC?.inDoor?.length === 0) {
            detailC.inDoor = null;
          }
          detailC.lon = getBit(detailC?.lon, 10);
          detailC.lat = getBit(detailC?.lat, 10);
          formRef.current.setFieldsValue(detailC);
          setItem(detailC);
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <PageContainer title={false} breadcrumb={undefined} className="monitor-add">
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
                    `/securityResources/monitorManage?page=${parseInt(page)}&size=${size}`,
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
                loading={submitLoaidng}
              >
                保存
              </Button>,
            ];
          },
        }}
      >
        <Row>
          <Form.Item className={styles.headerText}>{id ? '编辑监控' : '新增监控'}</Form.Item>
        </Row>
        <Row>
          <Col span={23} offset={1}>
            <Row>
              <Col span={7}>
                <ProFormText
                  name="videoId"
                  label="视频id"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[{ required: true, message: '请输入视频id' }]}
                  fieldProps={{ maxLength: 40, autoComplete: 'off' }}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="videoName"
                  label="视频名称"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[{ required: true, message: '请输入视频名称' }]}
                  fieldProps={{ maxLength: 40, autoComplete: 'off' }}
                />
              </Col>
              <Col span={7} offset={1}>
                <ProFormText
                  name="videoUrl"
                  label="视频URL地址"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[
                    { required: true, message: '请输入视频URL地址' },
                    { pattern: url, message: 'URL格式不正确' },
                  ]}
                  fieldProps={{ maxLength: 400 }}
                />
              </Col>
              <Col span={7}>
                <ProFormSelect
                  options={dTypeObj.list?.map((v) => ({ label: v.name, value: v.id }))}
                  name="videoType"
                  label="视频类别"
                  rules={[{ required: true, message: '请选择视频类别' }]}
                  fieldProps={{ loading: dTypeObj.loading }}
                />
              </Col>
              <Col span={7}>
                <ProFormSelect
                  name="hasMarker"
                  label="是否融合"
                  options={[
                    { label: '是', value: '1' },
                    { label: '否', value: '0' },
                  ]}
                  fieldProps={{
                    showSearch: true,
                  }}
                  rules={[{ required: true, message: '请选择' }]}
                />
              </Col>
              <Col span={7} offset={1}>
                <ProFormSelect
                  name="isDamage"
                  label="是否损坏"
                  fieldProps={{
                    showSearch: true,
                  }}
                  options={[
                    { label: '是', value: '1' },
                    { label: '否', value: '0' },
                  ]}
                  rules={[{ required: true, message: '请选择' }]}
                />
              </Col>

              <Col span={7}>
                <Form.Item
                  name="organizationId"
                  label="所属组织架构"
                  rules={[{ required: true, message: '请选择' }]}
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
                    treeData={orgObj.list}
                    loading={orgObj.loading}
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <ProFormSelect
                  name="cameraType"
                  label="摄像头类型"
                  request={async () => [
                    { label: '枪机', value: '1' },
                    { label: '球机', value: '2' },
                    { label: '半球机', value: '3' },
                    { label: '带云台半球', value: '4' },
                  ]}
                  placeholder="请选择"
                  rules={[{ required: true, message: '请选择摄像头类型' }]}
                />
              </Col>
              <Col span={7} offset={1}>
                <ProFormText
                  name="position"
                  label="视频位置"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{
                    maxLength: 400,
                    autoComplete: 'off',
                  }}
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
                  }}
                />
              </Col>
              <Col span={7} offset={1}>
                <ProFormText
                  name="height"
                  label="高度"
                  placeholder="请输入"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[{ pattern: alt, message: '整数最多九位且小数最多两位' }]}
                  fieldProps={{
                    suffix: InputSuffix(clickMapIcon),
                  }}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="level"
                  label="显示级别"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  rules={[{ min: 1, max: 40 }]}
                  fieldProps={{
                    maxLength: 40,
                    autoComplete: 'off',
                  }}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="views"
                  label="视口信息"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ maxLength: 400, autoComplete: 'off' }}
                />
              </Col>
              <Col span={7} offset={1}>
                <ProFormSelect
                  name="inDoor"
                  label="室内室外"
                  placeholder="请选择"
                  options={inDoor.list?.map((v) => ({ label: v.name, value: v.id }))}
                />
              </Col>
              <Col span={7}>
                <ProFormText
                  name="floor"
                  label="楼层"
                  getValueFromEvent={(e) => e.target.value.trim()}
                  fieldProps={{ maxLength: 9 }}
                  rules={[{ pattern: /^\d+$/, message: '只支持纯数字' }]}
                />
              </Col>
              <Col span={7}>
                <ProFormSelect
                  name="layerId"
                  label="关联图层"
                  placeholder="请选择"
                  fieldProps={{
                    showSearch: true,
                    // treeNodeFilterProp: 'label',
                  }}
                  options={layerObj.list.map((v) => ({ label: v.name, value: v.id }))}
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

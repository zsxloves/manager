import React from 'react';
import { Descriptions, Drawer, message, Tabs, Image } from 'antd';
import styles from '../../../systemManager/personManagement/components/./index.less';
import { formatJson } from '@/utils/utilsJS';
import ProTable from '@ant-design/pro-table';
interface Props {
  show: boolean;
  baseInfo: any;
  title?: string;
  onClose: any;
  config: configItem[];
  detailTabTow?: string;
  detailColumn?: any;
  detailData?: any;
  json?: string;
  width?: string;
  imgUrl?: string;
  imgName?: string;
  imageUrl?: any;
}
type configItem = {
  label: string;
  index?: string;
  render?: (param: any) => any;
  span?: number;
};
const Detail: React.FC<Props> = (props) => {
  const {
    show,
    baseInfo,
    title,
    onClose,
    config,
    detailTabTow,
    detailColumn,
    detailData,
    json,
    width,
    imgUrl,
    imgName,
    imageUrl,
  } = props;

  const callback = () => {
    message.error('解析失败');
  };
  return (
    <Drawer
      width={1000}
      title={title}
      visible={show}
      onClose={() => {
        onClose();
      }}
      closable={true}
    >
      {show && (
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="基础信息" key="1">
            <Descriptions
              // title="基础信息"
              column={2}
              labelStyle={{
                width: width ? width : '150px',
                justifyContent: 'right',
                marginRight: '16px',
                color: '#666666',
              }}
              contentStyle={{
                fontWeight: 'bold',
                color: '#000000',
                maxHeight: '300px',
                overflowY: 'auto',
              }}
              className={styles.layout}
            >
              {config?.map((v: configItem) => {
                return (
                  <Descriptions.Item label={v.label} key={v.label} span={v.span || 1}>
                    {v.label === json ? (
                      <pre>
                        {formatJson(
                          v.render ? v.render(baseInfo) : baseInfo[v.index || ''],
                          callback,
                        )}
                      </pre>
                    ) : v.render ? (
                      v.render(baseInfo)
                    ) : (
                      baseInfo[v.index || '']
                    )}
                  </Descriptions.Item>
                );
              })}
              {imgUrl && (
                <Descriptions.Item label={imgName} key={imgName} span={2}>
                  {imageUrl?.map((v: any) => {
                    return (
                      <Image src={v} style={{ marginRight: '15px' }} width="110px" height="110px" />
                    );
                  })}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Tabs.TabPane>
          {detailColumn && (
            <Tabs.TabPane tab={detailTabTow} key="2">
              <ProTable
                tableStyle={{ padding: '0' }}
                search={false}
                options={false}
                pagination={false}
                dataSource={detailData}
                columns={detailColumn}
              />
            </Tabs.TabPane>
          )}
        </Tabs>
      )}
    </Drawer>
  );
};

Detail.defaultProps = {
  baseInfo: {},
  title: '详情',
  config: [],
};
export default Detail;

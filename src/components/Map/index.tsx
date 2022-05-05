import React, { useState } from 'react';
import { Modal, Descriptions, Button } from 'antd';
import { useModel } from 'umi';
import styles from './index.less';
import { getBit } from '@/utils/utilsJS';
import Mars3D from '@/components/Mars3d';
import { HomeOutlined } from '@ant-design/icons';

export interface mapItem {
  lon: string;
  lat: string;
  alt?: string;
  heading?: string;
  pitch?: string;
  lng?: string;
}
export interface BaseConfirmProps {
  onCancel: (flag?: boolean) => void;
  onSubmit: (list?: any, visual?: any, views?: any) => void;
  isShowMap: boolean;
  values: mapItem;
  line?: string; //判断视域
  position?: string;
}

//  let graphicLayer: any = null;

const Map: React.FC<BaseConfirmProps> = (props) => {
  const {
    onSubmit: handleConfirm,
    onCancel: handleCancel,
    isShowMap,
    values,
    line,
    position,
  } = props;
  const [point, setPoint] = useState<any>(values);
  const { initialState } = useModel('@@initialState');
  const [views, setViews] = useState<any>(line ? values : null);
  const [flyHome, setFlyHome] = useState<number>();
  // const [type, setType] = useState<boolean>(false);
  return (
    <Modal
      width={1000}
      title="地图选点"
      className={styles.modal2}
      maskClosable={false}
      visible={isShowMap}
      onOk={() => {
        if (point.lat) {
          if (point.hasOwnProperty('pitch')) {
            localStorage.setItem('centerPosition', initialState?.map.getCenter());
          }
          handleConfirm(point, initialState?.map.getCameraView(), views);
        }
        if (line) {
          // if(type) {
          //   message.warning("请先停止编辑对象")
          //   // graphicLayer.stopEditing(graphicLayer);
          //   return;
          // }
          handleConfirm(point, initialState?.map.getCameraView(), views);
        }
      }}
      onCancel={() => {
        // console.log(type,'views');
        handleCancel();
      }}
    >
      <div>
        <div className={styles.mapSearch}>
          <Descriptions
            title=""
            layout="horizontal"
            column={3}
            labelStyle={{
              width: '80px',
              alignItems: 'center',
              justifyContent: 'right',
              color: '#666666',
            }}
            contentStyle={{ fontWeight: 'bold', color: '#000000' }}
          >
            <Descriptions.Item label="经度">{point?.lon}</Descriptions.Item>
            <Descriptions.Item label="纬度">{point?.lat}</Descriptions.Item>
            <Descriptions.Item label="">
              <Button
                title="回到原点"
                type="primary"
                ghost
                shape="round"
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: '6px',
                }}
                icon={<HomeOutlined />}
                onClick={() => {
                  setFlyHome(new Date().getTime());
                }}
              />
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      <div className={styles.marsBox}>
        <Mars3D
          other={'other'}
          lnglat={(value, view) => {
            const newPoint = {
              lon: getBit(value.lng),
              lat: getBit(value.lat),
              alt: value.alt,
            };
            console.log(value, '经纬度', newPoint);
            setPoint(newPoint);
            setViews(view);
          }}
          // obtainLayer={(T: boolean, graphic: any) => {
          //   setType(T);
          //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
          //   // graphicLayer = graphic;
          //   console.log('graphic',graphic)
          // }}
          pointInit={{
            lng: values?.lon || values?.lng,
            lat: values?.lat,
            alt: values?.alt,
            heading: values?.heading,
            pitch: values?.pitch,
          }}
          flyHome={flyHome}
          views={views}
          line={line}
          position={position}
        />
      </div>
      <div style={{ height: '10px' }} />
    </Modal>
  );
};

export default Map;

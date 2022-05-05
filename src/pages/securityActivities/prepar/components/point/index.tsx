import React, { useState, useEffect, useImperativeHandle } from 'react';
import {
  Form,
  Input,
  Button,
  message,
  InputNumber,
  Upload,
  Slider,
  Radio,
  Space,
  Select,
  Modal,
  AutoComplete,
} from 'antd';
import { ProFormText } from '@ant-design/pro-form';
import { Table } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { queryVideo } from '../../../../../services/prepar';
const { Option } = Select;
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import style from './style.less';
import { getToken } from '@/utils/auth';
import type { StyleOptions } from '../../data';
import SelectModel from '../model';
import jsonloop from 'jsonloop';
import { formatPolygon } from '@/utils/utilsJS';
const defaultSeperator = '.';
const cJSON = jsonloop(defaultSeperator);
declare interface Props {
  policeFlag?: any;
  info?: any;
  currentsViews?: any;
  typeLabel?: string;
  icTitle?: string;
  jsonstyle: any;
  editFlag: boolean;
  msg: any[]; //坐标
  changeItem: (
    val: any,
    solutionPersonList: any,
    solutionDeviceList: any,
    solutionVedioList: any,
  ) => void;
  flypositon: () => void;
  deleteItem: (graphic: any, editFlag: any) => void;
  editPoint: (val: any, lnglatList: any) => void;
  graphic: any;
  solutionList?: any;
  videoRander: (graphic: any) => void;
}
export interface TableListItem {
  markList: [];
}
interface RefTypes {
  changes: () => void;
  videoChange: (value: any) => void;
  changeDiffHeight: (value: any) => void;
  changeMsg: (value: any) => void;
}
const Point = React.forwardRef<RefTypes, Props>((props, ref) => {
  const {
    policeFlag,
    info,
    changeItem,
    flypositon,
    deleteItem,
    editPoint,
    graphic,
    editFlag,
    solutionList,
    jsonstyle,
    icTitle,
    typeLabel,
    currentsViews,
  } = props;

  const type = graphic?.options?.type;
  const circle1 = graphic?.options?.name;
  const [styleinfo, setStyleinfo] = useState<boolean>(true); //样式信息伸展
  const [pointinfo, setPointinfo] = useState<boolean>(true); //标点信息伸展
  const [lnglatList, setLnglatList] = useState<boolean>(false); //坐标列表伸展
  const [modelShow, setModelShow] = useState<boolean>(false); //弹框伸展
  const [police, setPolice] = useState<boolean>(policeFlag); //警务标记

  const [msg, setMsg] = useState<any[]>(props?.msg || []); //坐标
  const [color, setColor] = useState<any>(jsonstyle?.color); //颜色
  const [outlineColor, setOutlineColor] = useState<any>(jsonstyle?.outlineColor); //颜色
  const [oddColor, setOddColor] = useState<any>(jsonstyle?.oddColor); //颜色

  const [form] = Form.useForm();
  const linetype: any[] = [
    {
      name: 'materialType',
      code: 'line',
      label: '线型',
      type: 'select',
      defval: '',
      data: [
        {
          label: '流动线',
          value: 'LineFlow',
          impact: [
            'color',
            'width',
            'clampToGround',
            'opacity',
            'closure',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
            'zIndex',
          ],
        },
        {
          label: '实线',
          value: 'Color',
          impact: [
            'color',
            'opacity',
            'width',
            'closure',
            'clampToGround',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
            'zIndex',
          ],
        },
        {
          label: '虚线',
          value: 'PolylineDash',
          impact: [
            'dashLength',
            'color',
            'opacity',
            'width',
            'closure',
            'clampToGround',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
            'zIndex',
          ],
        },
        {
          label: '衬色线',
          value: 'PolylineOutline',
          impact: [
            'outlineColor',
            'outlineWidth',
            'color',
            'opacity',
            'width',
            'closure',
            'clampToGround',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
            'zIndex',
          ],
        },
        {
          label: '光晕',
          value: 'PolylineGlow',
          impact: [
            'glowPower',
            'color',
            'opacity',
            'width',
            'closure',
            'clampToGround',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
            'zIndex',
            'taperPower',
          ],
        },
        {
          label: '箭头',
          value: 'PolylineArrow',
          impact: [
            'color',
            'opacity',
            'width',
            'closure',
            'clampToGround',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
            'zIndex',
          ],
        },
        {
          label: 'OD线',
          value: 'ODLine',
          impact: [
            'speed',
            'color',
            'opacity',
            'width',
            'closure',
            'clampToGround',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
            'zIndex',
          ],
        },
        {
          label: '闪烁线',
          value: 'LineFlicker',
          impact: [
            'speed',
            'color',
            'opacity',
            'width',
            'closure',
            'clampToGround',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
            'zIndex',
          ],
        },
        {
          label: '轨迹线',
          value: 'LineTrail',
          impact: [
            'speed',
            'color',
            'opacity',
            'width',
            'closure',
            'clampToGround',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
            'zIndex',
          ],
        },
      ],
    },
    {
      name: 'materialType',
      code: 'wall',
      label: '填充类型',
      type: 'select',
      defval: '',
      data: [
        {
          label: '流动效果',
          value: 'LineFlow',
          impact: [
            'color',
            'opacity',
            'diffHeight',
            'closure',
            'outline',
            'outlineColor',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
          ],
        },
        {
          label: '纯色',
          value: 'Color',
          impact: [
            'color',
            'opacity',
            'diffHeight',
            'closure',
            'outline',
            'outlineColor',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
          ],
        },
        {
          label: '走马灯',
          value: 'WallScroll',
          impact: [
            'color',
            'opacity',
            'diffHeight',
            'closure',
            'outline',
            'outlineColor',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
          ],
        },
        {
          label: '文本',
          value: 'Text',
          impact: [
            'color',
            'opacity',
            'diffHeight',
            'closure',
            'text',
            'font_family',
            'font_size',
            'font_weight',
            'font_style',
            'stroke',
            'strokeColor',
            'strokeWidth',
            'backgroundColor',
            'padding',
            'outline',
            'outlineColor',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
          ],
        },
        {
          label: '网格',
          value: 'Grid',
          impact: [
            'color',
            'opacity',
            'diffHeight',
            'closure',
            'outline',
            'outlineColor',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
          ],
        },
        {
          label: '条纹',
          value: 'Stripe',
          impact: [
            'oddColor',
            'evenColor',
            'diffHeight',
            'closure',
            'outline',
            'outlineColor',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
          ],
        },
        {
          label: '棋盘',
          value: 'Checkerboard',
          impact: [
            'oddColor',
            'evenColor',
            'diffHeight',
            'closure',
            'outline',
            'outlineColor',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
          ],
        },
      ],
    },
    {
      name: 'materialType',
      code: 'polygon',
      label: '填充类型',
      type: 'select',
      defval: '',
      data: [
        {
          label: '纯色',
          value: 'Color',
          impact: [
            'color',
            'opacity',
            'outline',
            'outlineColor',
            'outlineWidth',
            'outlineOpacity',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
            'clampToGround',
            'z-index',
          ],
        },
        {
          label: '网格',
          value: 'Grid',
          impact: [
            'color',
            'opacity',
            'outline',
            'outlineColor',
            'outlineWidth',
            'outlineOpacity',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
            'clampToGround',
            'z-index',
          ],
        },
        {
          label: '条纹',
          value: 'Stripe',
          impact: [
            'color',
            'opacity',
            'outline',
            'outlineColor',
            'outlineWidth',
            'outlineOpacity',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
            'clampToGround',
            'z-index',
          ],
        },
        {
          label: '棋盘',
          value: 'Checkerboard',
          impact: [
            'color',
            'opacity',
            'outline',
            'outlineColor',
            'outlineWidth',
            'outlineOpacity',
            'distanceDisplayCondition',
            'distanceDisplayCondition_far',
            'distanceDisplayCondition_near',
            'clampToGround',
            'z-index',
          ],
        },
      ],
    },
    {
      name: 'diffHeight',
      label: '墙高',
      type: 'number',
      step: 1,
    },
    {
      name: 'color',
      label: '颜色',
      type: 'color',
    },
    {
      name: 'oddColor',
      label: '颜色',
      type: 'color',
    },
    {
      name: 'outlineColor',
      isImpact: true,
      label: '衬色颜色',
      type: 'color',
    },
    {
      name: 'taperPower',
      label: '间缩',
      type: 'slider',
      min: 0.01,
      max: 1,
      step: 0.01,
    },
    {
      name: 'opacity',
      label: '透明度',
      type: 'slider',
      min: 0.01,
      max: 1,
      step: 0.01,
    },
    {
      name: 'closure',
      label: '是否闭合',
      type: 'radio',
    },
    {
      name: 'text',
      label: '文本',
      type: 'text',
    },
    {
      name: 'font_family',
      label: '字体',
      type: 'select',
      val: [
        {
          value: '微软雅黑',
          label: '微软雅黑',
        },
        {
          value: '黑体',
          label: '黑体',
        },
        {
          value: '宋体',
          label: '宋体',
        },
        {
          value: '楷体',
          label: '楷体',
        },
        {
          value: '隶书',
          label: '隶书',
        },
      ],
    },
    {
      name: 'font_size',
      label: '字体大小',
      type: 'number',
    },
    {
      name: 'font_weight',
      label: '是否加粗',
      type: 'radio',
    },
    {
      name: 'font_style',
      label: '是否斜体',
      type: 'radio',
    },
    {
      name: 'stroke',
      label: '是否描边',
      type: 'radio',
    },
    {
      name: 'strokeColor',
      label: '描边颜色',
      type: 'color',
    },
    {
      name: 'strokeWidth',
      label: '描边宽度',
      type: 'number',
    },
    {
      name: 'backgroundColor',
      label: '画布颜色',
      type: 'color',
    },
    {
      name: 'padding',
      label: '内边距',
      type: 'number',
    },
    {
      name: 'dashLength',
      isImpact: true,
      label: '虚线间长',
      type: 'number',
      step: 1,
    },
    {
      name: 'z-index',
      isImpact: true,
      label: '层级',
      type: 'number',
      step: 1,
    },
    {
      name: 'outline',
      label: '是否边框',
      type: 'radio',
    },
    {
      name: 'hasShadows',
      label: '是否阴影',
      type: 'radio',
    },
    {
      name: 'outlineWidth',
      isImpact: true,
      label: '衬色宽度',
      type: 'number',
      step: 1,
    },
    {
      name: 'glowPower',
      isImpact: true,
      label: '高亮强度',
      type: 'number',
      step: 0.01,
    },
    {
      name: 'image',
      isImpact: true,
      label: '图片',
      type: 'label',
    },
    {
      name: 'speed',
      isImpact: true,
      label: '速度',
      type: 'number',
      step: 1,
    },
    {
      name: 'repeat',
      isImpact: true,
      label: '数量',
      type: 'number',
      step: 1,
    },
    {
      name: 'outlineOpacity',
      label: '边框透明度',
      type: 'slider',
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      name: 'width',
      label: '线宽',
      type: 'number',
      step: 1,
    },
    {
      name: 'clampToGround',
      label: '是否贴地',
      type: 'radio',
    },
    {
      name: 'distanceDisplayCondition',
      label: '是否按视距显示',
      type: 'radio',
    },
    {
      name: 'distanceDisplayCondition_far',
      isImpact: true,
      label: '最大距离',
      type: 'number',
      step: 1,
    },
    {
      name: 'distanceDisplayCondition_near',
      isImpact: true,
      label: '最小距离',
      type: 'number',
      step: 1,
    },
    {
      name: 'zIndex',
      label: '层级顺序',
      type: 'number',
      step: 1,
    },
  ];
  const div: any[] = [
    {
      name: 'offsetX',
      label: '横向',
      type: 'number',
      step: 1,
    },
    {
      name: 'offsetY',
      label: '纵向',
      type: 'number',
      step: 1,
    },
    {
      name: 'clampToGround',
      label: '是否贴地',
      type: 'radio',
    },
    {
      name: 'scaleByDistance',
      label: '是否按视距缩放',
      type: 'radio',
    },
    {
      name: 'scaleByDistance_far',
      label: '上限',
      type: 'number',
      step: 1,
    },
    {
      name: 'scaleByDistance_farValue',
      label: '比例值',
      type: 'number',
      step: 1,
    },
    {
      name: 'distanceDisplayCondition_far',
      label: '下限',
      type: 'number',
      step: 1,
    },
    {
      name: 'distanceDisplayCondition_near',
      label: '比例值',
      type: 'number',
      step: 1,
    },
    {
      name: 'distanceDisplayCondition',
      label: '是否按视距显示',
      type: 'radio',
    },
    {
      name: 'distanceDisplayCondition_far',
      label: '最大距离',
      type: 'number',
      step: 1,
    },
    {
      name: 'distanceDisplayCondition_near',
      label: '最小距离',
      type: 'number',
      step: 1,
    },
  ];
  const [list, setList] = useState<any[]>([]); //多选
  const [selectedData, setSelectedData] = useState<any[]>([]); //多选
  const [solutionPersonList, setPersonList] = useState<any[]>(
    solutionList?.solutionPersonList || [],
  ); //多选人员
  const [solutionDeviceList, setDeviceList] = useState<any[]>(
    solutionList?.solutionDeviceList || [],
  ); //多选设备
  const [solutionVedioList, setVedioList] = useState<any[]>(solutionList?.solutionVedioList || []); //多选监控
  const [typeList, setTypeList] = useState<any[] | undefined>(linetype[0]?.data[0]?.impact); //画线类型
  const [walltypeList, setWalltypeList] = useState<any[] | undefined>(linetype[1]?.data[0]?.impact); //画墙类型
  const [polygontypeList, setPolygontypeList] = useState<any[] | undefined>(
    linetype[2]?.data[0]?.impact,
  ); //画面类型
  // 右键保存标点
  const changes = () => {
    changeItem(form, solutionPersonList, solutionDeviceList, solutionVedioList);
  };
  const videoChange = (value: any) => {
    const data = solutionVedioList.map((item) => {
      return item.id;
    });
    if (data.includes(value.id)) {
      message.warning('该监控已选择');
    } else {
      setVedioList(solutionVedioList.concat(value));
    }
  };
  const changeDiffHeight = (diffHeight: any) => {
    form.setFieldsValue({ wall: { diffHeight } });
  };
  const changeMsg = (value: any) => {
    setMsg([value]);
  };
  useImperativeHandle(ref, () => ({
    changes,
    videoChange,
    changeDiffHeight,
    changeMsg,
  }));

  const [typeflag, setTypeflag] = useState(''); // 设备 人 视频类型标志
  const change = () => {
    editPoint(form, msg.length === 1 ? msg[0] : msg);
  };
  // 上传图标
  const [imgLoad, setImgload] = useState<boolean>(false); //属性
  const [imageUrl, setImageUrl] = useState<string>(''); //上传图片
  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (infos: any) => {
    if (infos.file.status === 'uploading') {
      setImgload(true);
      return;
    }
    if (infos.file.status === 'done') {
      getBase64(infos.file.originFileObj, (q: string) => {
        setImageUrl(q);
        form.setFieldsValue({ billboard: { image: infos.file.response.data.minioFileUrl } });
        change();
        setImgload(false);
      });
    }
  };
  const UploadButton = () => (
    <div>
      {imgLoad ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  //rgb-->16进制
  const colorRGBtoHex = (colors: any) => {
    if (/^rgb\(/.test(colors)) {
      const rgb = colors.split(',');
      const r = parseInt(rgb[0].split('(')[1]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2].split(')')[0]);
      const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      return hex;
    } else {
      return colors;
    }
  };
  useEffect(() => {
    console.log(police);
    let formValue: StyleOptions = {};
    let data;
    let self;
    let name;
    let code;
    let mjNum;
    let fjNum;
    let jjNum;
    let xfNum;
    let baNum;
    if (editFlag) {
      setColor(colorRGBtoHex(graphic?.options?.style?.color));
      setOutlineColor(colorRGBtoHex(graphic?.options?.style?.outlineColor));
      setOddColor(colorRGBtoHex(graphic?.options?.style?.oddColor));
      // 坐标赋值
      if (graphic?.options?.position) {
        setMsg(graphic?.options?.position || []);
      } else {
        setMsg([graphic?.options?.positions] || []);
      }
      try {
        data = graphic?.options?.attr?.data;
        const entity = cJSON.parse(data?.entity || '{}');
        self = entity?.info?.self || [];
        name = entity?.info?.name || '';
        code = entity?.info?.code || '';
        mjNum = entity?.info?.mjNum || '';
        fjNum = entity?.info?.fjNum || '';
        jjNum = entity?.info?.jjNum || '';
        xfNum = entity?.info?.xfNum || '';
        baNum = entity?.info?.baNum || '';
      } catch (err) {
        console.log('err', err);
        message.error('JSON格式不正确');
        return;
      }
      switch (type) {
        case 'polyline':
          setTypeList(
            linetype[0]?.data?.filter((iter: any) => {
              return graphic?.options?.style?.materialType === iter.value;
            })[0]?.impact,
          );
          break;
        case 'wall':
          setWalltypeList(
            linetype[1]?.data?.filter((iter: any) => {
              return graphic?.options?.style?.materialType === iter.value;
            })[0]?.impact,
          );
          break;
        case 'polygon':
          setPolygontypeList(
            linetype[2]?.data?.filter((iter: any) => {
              return graphic?.options?.style?.materialType === iter.value;
            })[0]?.impact,
          );
          break;
        default:
          break;
      }
      // 将rgb-->16进制
      graphic.options.style.color = colorRGBtoHex(graphic?.options?.style?.color);
      // 判断警务标志
      setPolice(graphic?.options?.attr?.data?.iconLevel === '422260ba-5c8b-11ec-8bb3-0242ac110002');
    }
    formValue = {
      div: {
        horizontalOrigin: 1,
        verticalOrigin: 1,
        offsetX: 1,
        offsetY: 1,
        scaleByDistance: true,
        scaleByDistance_far: 50000,
        scaleByDistance_farValue: 0.1,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 3000,
        distanceDisplayCondition_near: 1,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        clampToGround: true,
      },
      billboard: {
        image: imageUrl,
        opacity: 1,
        scale: 0.4,
        rotationDegree: 1,
        scaleByDistance: true,
        scaleByDistance_far: 50000,
        scaleByDistance_farValue: 0.1,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 3000,
        distanceDisplayCondition_near: 1,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        clampToGround: true,
        visibleDepth: false, //是否指定 false置顶 true你不置顶
        width: 96,
        height: 96,
      },
      polyline: {
        zIndex: jsonstyle?.zIndex || 1,
        color: jsonstyle?.color || '#ff8833',
        width: jsonstyle?.width || 10,
        clampToGround: JSON.parse(jsonstyle?.clampToGround || '{}') || false,
        outline: jsonstyle?.outline || false,
        opacity: jsonstyle?.opacity || 1,
        closure: jsonstyle?.closure || false,
        distanceDisplayCondition: jsonstyle?.distanceDisplayCondition || false,
        distanceDisplayCondition_far: jsonstyle?.distanceDisplayCondition_far || 3000,
        distanceDisplayCondition_near: jsonstyle?.distanceDisplayCondition_near || 1,
        outlineWidth: jsonstyle?.outlineWidth || 3,
        speed: jsonstyle?.speed || 10,
        materialType: jsonstyle?.materialType || 'LineFlow',
      },
      polygon: {
        fill: jsonstyle?.fill || true,
        color: jsonstyle?.color || '#ffffff',
        clampToGround: jsonstyle?.clampToGround || true,
        opacity: jsonstyle?.opacity || 1,
        outline: jsonstyle?.outline || false,
        outlineColor: jsonstyle?.outlineColor || '#000000',
        outlineWidth: jsonstyle?.outlineWidth || 0,
        outlineOpacity: jsonstyle?.outlineOpacity || 1,
        distanceDisplayCondition: jsonstyle?.distanceDisplayCondition || true,
        distanceDisplayCondition_far: jsonstyle?.distanceDisplayCondition_far || 10000,
        distanceDisplayCondition_near: jsonstyle?.distanceDisplayCondition_near || 1,
      },
      label: {
        text: '文字',
        color: '#ffffff',
        font_family: '微软雅黑',
        font_size: 30,
        font_weight: 'normal', //bold
        font_style: 'normal', //italic
        opacity: 1,
        outline: true,
        outlineColor: '#000000',
        outlineWidth: 3,
        background: true,
        backgroundColor: '#000000',
        backgroundOpacity: 0.5,
        scaleByDistance: true,
        scaleByDistance_far: 50000,
        scaleByDistance_farValue: 0.1,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 10000,
        distanceDisplayCondition_near: 1,
        clampToGround: true,
      },
      textstyle: {
        text: '',
        color: '#ffffff',
        font_family: '微软雅黑',
        font_size: 30,
        font_weight: 'normal ',
        font_style: 'normal',
        opacity: 1,
        outline: true,
        outlineColor: '#000000',
        outlineWidth: 3,
        background: true,
        backgroundColor: '#000000',
        backgroundOpacity: 0.5,
        scaleByDistance: true,
        scaleByDistance_far: 50000,
        scaleByDistance_farValue: 0.1,
        scaleByDistance_near: 1000,
        scaleByDistance_nearValue: 1,
        distanceDisplayCondition: true,
        distanceDisplayCondition_far: 10000,
        distanceDisplayCondition_near: 1,
        pixelOffsetX: 2,
        pixelOffsetY: -30,
        backgroundPadding: 10,
      },
      wall: {
        color: jsonstyle?.color || '#bdf700',
        outline: false,
        opacity: 1,
        closure: false,
        distanceDisplayCondition: false,
        distanceDisplayCondition_far: 3000,
        distanceDisplayCondition_near: 1,
        materialType: 'LineFlow',
        outlineColor: '',
        diffHeight: 100,
        padding: 1,
        backgroundColor: '',
        strokeWidth: 1,
        strokeColor: '',
        stroke: false,
        font_style: false,
        font_weight: false,
        font_size: '',
        font_family: '微软雅黑',
        text: 'undefined',
        oddColor: 'white',
        evenColor: 'black',
      },
      circle1: {
        startAngle: 40,
        endAngle: 80,
        radius: 0,
        rotationDegree: 0,
      },
    };
    let startAngle;
    let endAngle;
    if (graphic?.options?.style?.material?.options?.materialType === 'Circle3Scan') {
      startAngle = graphic?.options?.style?.material?.options?.startAngle;
      endAngle = graphic?.options?.style?.material?.options?.endAngle;
    }
    form.setFieldsValue({
      div: { ...formValue?.div, ...graphic?.options?.style },
      billboard: {
        ...formValue.billboard,
        label: { ...formValue?.textstyle },
        ...graphic?.options?.style,
      },
      polyline: { ...formValue?.polyline, ...graphic?.options?.style },
      polygon: { ...formValue?.polygon, ...graphic?.options?.style },
      label: { ...formValue?.label, ...graphic?.options?.style },
      wall: { ...formValue?.wall, ...graphic?.options?.style },
      circle1: { ...formValue?.circle1, ...graphic?.options?.style, startAngle, endAngle },
      type: graphic?.type,
      self: self,
      name: name || icTitle,
      mjNum: mjNum || 0,
      fjNum: fjNum || 0,
      jjNum: jjNum || 0,
      xfNum: xfNum || 0,
      baNum: baNum || 0,
      code: code,
      divname: '上午赛事',
      image: editFlag
        ? graphic?.options?.style?.image
        : jsonstyle?.image || '/img/prepar/lineClr2.png',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphic]);
  useEffect(() => {
    setStyleinfo(false);
    change();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const columnsperson = [
    {
      title: '姓名',
      dataIndex: 'personName',
      key: 'personName',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
  ];
  const columndevice = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '设备编码',
      dataIndex: 'deviceCode',
      key: 'deviceCode',
      ellipsis: true,
      width: 200,
    },
  ];
  const columnvedio = [
    {
      title: '视频名称',
      dataIndex: 'videoName',
      key: 'videoName',
    },
    {
      title: '视频类型',
      dataIndex: 'videoTypeName',
      key: 'videoTypeName',
    },
  ];
  const columnvediokey = [
    {
      title: '视频名称',
      dataIndex: 'videoName',
      key: 'videoName',
    },
    {
      title: '视频类型',
      dataIndex: 'videoTypeName',
      key: 'videoTypeName',
    },
    {
      title: '调整顺序',
      dataIndex: 'videoTypeName',
      key: 'videoTypeName',
      render: (_: any, record: any) => {
        let index: any = '';
        solutionVedioList.some((item: any, indexcur: any) => {
          if (item.id === record.id) {
            index = indexcur;
            return true;
          } else {
            return false;
          }
        });
        return (
          <>
            <a
              onClick={() => {
                if (index === 0) message.warning('此项为第一个');
                else {
                  const newArr = JSON.parse(JSON.stringify(solutionVedioList));
                  const arr = newArr[index];
                  newArr[index] = newArr[index - 1];
                  newArr[index - 1] = arr;
                  setVedioList(newArr);
                }
              }}
            >
              <ArrowUpOutlined />
            </a>
            <a
              onClick={() => {
                if (index === solutionVedioList.length - 1) message.warning('此项为最后一个');
                else {
                  const newArr = JSON.parse(JSON.stringify(solutionVedioList));
                  const arr = newArr[index];
                  newArr[index] = newArr[index + 1];
                  newArr[index + 1] = arr;
                  setVedioList(newArr);
                }
              }}
            >
              <ArrowDownOutlined />
            </a>
          </>
        );
      },
    },
    {
      title: '删除',
      dataIndex: 'endTime',
      width: 60,
      search: false,
      render: (endTime: any, record: any) => {
        return (
          <a
            onClick={() => {
              const data = solutionVedioList.filter((item: any) => item.id !== record.id);
              setVedioList(data);
            }}
          >
            删除
          </a>
        );
      },
    },
  ];

  return (
    <>
      <Form
        className={style.form}
        labelCol={{ style: { width: '110px' } }}
        form={form}
        // key={graphic?.id}
        autoComplete="false"
      >
        <div className={style.lnglist}>
          <div>
            {lnglatList ? (
              <span
                onClick={() => {
                  setLnglatList(!lnglatList);
                }}
              >
                -
              </span>
            ) : (
              <span
                onClick={() => {
                  setLnglatList(!lnglatList);
                }}
              >
                +
              </span>
            )}
          </div>
          坐标列表
          <span>
            <Button style={{ marginLeft: '250px' }} onClick={flypositon}>
              定位
            </Button>
          </span>
        </div>
        {lnglatList && (
          <div style={{ padding: '10px' }}>
            {msg[0] instanceof Array ? (
              <>
                {msg[0]?.map((item: any) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <table>
                      <tbody>
                        <tr>
                          <td>经度:</td>
                          <td>
                            <input
                              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                              type="number"
                              defaultValue={item[0]}
                              onChange={(e) => {
                                item[0] = Number((e.target as any).value);
                                change();
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>纬度:</td>
                          <td>
                            <input
                              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                              type="number"
                              defaultValue={item[1]}
                              onChange={(e) => {
                                item[1] = Number((e.target as any).value);
                                change();
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>高度:</td>
                          <td>
                            <input
                              style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                              type="number"
                              defaultValue={item[2]}
                              onChange={(e) => {
                                item[2] = Number((e.target as any).value);
                                change();
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  );
                })}
              </>
            ) : (
              <>
                <table>
                  <tbody>
                    <tr>
                      <td>经度:</td>
                      <td>
                        <input
                          style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                          type="number"
                          value={msg[0]}
                          onChange={(e) => {
                            setMsg([Number((e.target as any).value), msg[1], msg[2]]);
                            change();
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>纬度:</td>
                      <td>
                        <input
                          style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                          type="number"
                          value={msg[1]}
                          onChange={(e) => {
                            setMsg([msg[0], Number((e.target as any).value), msg[2]]);
                            change();
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>高度:</td>
                      <td>
                        <input
                          style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                          type="number"
                          value={msg[2]}
                          onChange={(e) => {
                            setMsg([msg[0], msg[1], Number((e.target as any).value)]);
                            change();
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
        <div className={style.lnglist}>
          {styleinfo ? (
            <div
              className={style.add}
              onClick={() => {
                setStyleinfo(!styleinfo);
              }}
            >
              -
            </div>
          ) : (
            <div
              className={style.add}
              onClick={() => {
                setStyleinfo(!styleinfo);
              }}
            >
              +
            </div>
          )}
          样式信息
        </div>
        {styleinfo && (
          <div style={{ padding: '10px' }} className={style.formitem}>
            <ProFormText
              name="code"
              label="编码"
              placeholder="请输入编码"
              getValueFromEvent={(e) => e.target.value.trim()}
            />
            {type === 'billboard' && (
              <>
                <Form.Item name={['billboard', 'image']} label="图片">
                  <Input disabled />
                </Form.Item>
                <Form.Item name={['billboard', 'opacity']} label="透明度:">
                  <Slider step={0.1} min={0} max={1} style={{ width: '200px' }} onChange={change} />
                </Form.Item>
                <Form.Item name={['billboard', 'scale']} label="大小比例:">
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item name={['billboard', 'width']} label="宽度:">
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item name={['billboard', 'height']} label="高度:">
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item name={['billboard', 'rotationDegree']} label="旋转角度:">
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item name={['billboard', 'scaleByDistance']} label="是否按视距缩放:">
                  <Radio.Group value={['billboard', 'scaleByDistance']} onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name={['billboard', 'scaleByDistance_far']} label="上限:">
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item name={['billboard', 'scaleByDistance_farValue']} label="比例值:">
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item name={['billboard', 'scaleByDistance_near']} label="下限:">
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item name={['billboard', 'scaleByDistance_nearValue']} label="比例值:">
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item name={['billboard', 'distanceDisplayCondition']} label="是否按视距显示:">
                  <Radio.Group onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name={['billboard', 'distanceDisplayCondition_far']} label="最大距离:">
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item name={['billboard', 'distanceDisplayCondition_near']} label="最小距离:">
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item name={['billboard', 'clampToGround']} label="是否贴地:">
                  <Radio.Group onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name={['billboard', 'visibleDepth']} label="是否被遮挡:">
                  <Radio.Group onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="层级:" name={['billboard', 'zIndex']}>
                  <InputNumber min={1} onChange={change} />
                </Form.Item>
                {/* 标记内容 */}
                <Form.Item label="内容:" name={['billboard', 'label', 'text']}>
                  <Input onChange={change} />
                </Form.Item>
                <Form.Item label="字体:" name={['billboard', 'label', 'font_family']}>
                  <AutoComplete
                    dataSource={['微软雅黑', '黑体', '楷体', '隶书', '宋体']}
                    children={<Input type="text" onChange={change} />}
                    onChange={change}
                  />
                </Form.Item>
                <Form.Item label="字体大小:" name={['billboard', 'label', 'font_size']}>
                  <InputNumber min={1} onChange={change} />
                </Form.Item>
                <Form.Item name={['billboard', 'label', 'font_weight']} label="是否加粗:">
                  <Radio.Group onChange={change}>
                    <Radio value="bold">是</Radio>
                    <Radio value="normal">否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name={['billboard', 'label', 'font_style']} label="是否斜体:">
                  <Radio.Group onChange={change}>
                    <Radio value="italic">是</Radio>
                    <Radio value="normal">否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="颜色:" name={['billboard', 'label', 'color']}>
                  <input
                    value={''}
                    type="color"
                    onChange={(e) => {
                      form.setFieldsValue({ polyline: { color: e.target.value } });
                      change();
                    }}
                  />
                </Form.Item>
                <Form.Item label="透明度:" name={['billboard', 'label', 'opacity']}>
                  <Slider step={0.1} min={0} max={1} style={{ width: '200px' }} onChange={change} />
                </Form.Item>
                <Form.Item label="是否衬色:" name={['billboard', 'label', 'outline']}>
                  <Radio.Group onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="衬色颜色:" name={['billboard', 'label', 'outlineColor']}>
                  <input
                    value={''}
                    type="color"
                    onChange={(e) => {
                      form.setFieldsValue({
                        billboard: { label: { outlineColor: e.target.value } },
                      });
                      change();
                    }}
                  />
                </Form.Item>
                <Form.Item label="衬色透明度:" name={['billboard', 'label', 'outlineOpacity']}>
                  <Slider step={0.1} min={0} max={1} style={{ width: '200px' }} onChange={change} />
                </Form.Item>
                <Form.Item label="衬色宽度:" name={['billboard', 'label', 'outlineWidth']}>
                  <Input onChange={change} />
                </Form.Item>
                <Form.Item label="是否背景:" name={['billboard', 'label', 'background']}>
                  <Radio.Group onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="背景颜色:" name={['billboard', 'label', 'backgroundColor']}>
                  <input
                    value={''}
                    type="color"
                    onChange={(e) => {
                      form.setFieldsValue({
                        billboard: { label: { backgroundColor: e.target.value } },
                      });
                      change();
                    }}
                  />
                </Form.Item>
                <Form.Item label="背景透明度:" name={['billboard', 'label', 'backgroundOpacity']}>
                  <Slider step={0.1} min={0} max={1} style={{ width: '200px' }} onChange={change} />
                </Form.Item>
                <Form.Item label="背景内边距:" name={['billboard', 'label', 'backgroundPadding']}>
                  <InputNumber step={1} onChange={change} />
                </Form.Item>
                <Form.Item label="横向偏移像素:" name={['billboard', 'label', 'pixelOffsetX']}>
                  <InputNumber step={1} onChange={change} />
                </Form.Item>
                <Form.Item label="纵向偏移像素:" name={['billboard', 'label', 'pixelOffsetY']}>
                  <InputNumber step={1} onChange={change} />
                </Form.Item>
                <Form.Item label="是否按视距缩放:" name={['billboard', 'label', 'scaleByDistance']}>
                  <Radio.Group onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                {true && (
                  <>
                    <Form.Item name={['billboard', 'scaleByDistance_far']} label="上限:">
                      <InputNumber onChange={change} />
                    </Form.Item>
                    <Form.Item name={['billboard', 'scaleByDistance_farValue']} label="比例值:">
                      <InputNumber onChange={change} />
                    </Form.Item>
                    <Form.Item name={['billboard', 'scaleByDistance_near']} label="下限:">
                      <InputNumber onChange={change} />
                    </Form.Item>
                    <Form.Item name={['billboard', 'scaleByDistance_nearValue']} label="比例值:">
                      <InputNumber onChange={change} />
                    </Form.Item>
                  </>
                )}
                <Form.Item name={['label', 'distanceDisplayCondition']} label="是否按视距显示:">
                  <Radio.Group onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name={['billboard', 'distanceDisplayCondition_far']} label="最大距离:">
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item name={['billboard', 'distanceDisplayCondition_near']} label="最小距离:">
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item label="是否贴地:" name={['billboard', 'label', 'clampToGround']}>
                  <Radio.Group onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="是否被遮挡:" name={['billboard', 'label', 'visibleDepth']}>
                  <Radio.Group onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <div>| 上传图标</div>
                <Upload
                  name="file"
                  listType="picture-card"
                  showUploadList={false}
                  action="/api/systemAttachment/uploadFile"
                  method="post"
                  headers={{
                    Authorization: getToken(),
                  }}
                  data={{
                    name: 'aaa',
                  }}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                  ) : (
                    <UploadButton />
                  )}
                </Upload>
              </>
            )}
            {type === 'polyline' && (
              <>
                <Form.Item label="类型:" name="type">
                  <Input disabled />
                </Form.Item>
                <Form.Item label={'流线样式'} name={'image'}>
                  <Select
                    showSearch
                    style={{ width: 120 }}
                    onChange={(val) => {
                      console.log(val);
                      change();
                    }}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8]?.map((items: any) => {
                      return (
                        <Option
                          key={items}
                          value={
                            items === 0 ? '/img/prepar/lineClr2.png' : `/img/lineFlow/${items}.png`
                          }
                        >
                          {items === 0 ? '默认路线' : `流线样式${items}`}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                {linetype.map((item) => {
                  return (
                    <div key={item.name}>
                      {item.code === 'line' && (
                        <Form.Item label={item.label} name={['polyline', item.name]}>
                          <Select
                            showSearch
                            defaultValue={'LineFlow'}
                            style={{ width: 120 }}
                            onChange={(val) => {
                              change();
                              setTypeList(
                                linetype[0]?.data?.filter((iter: any) => {
                                  return val === iter.value;
                                })[0].impact,
                              );
                            }}
                          >
                            {linetype[0]?.data?.map((items: any) => {
                              return (
                                <Option key={items.value} value={items.value}>
                                  {items.label}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      )}
                    </div>
                  );
                })}
                {typeList &&
                  typeList.length > 0 &&
                  linetype.map((item) => {
                    return (
                      typeList.includes(item.name) && (
                        <>
                          {item.type === 'color' && item.name === 'color' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Input
                                value={color || '#ff0000'}
                                type="color"
                                onChange={(e) => {
                                  form.setFieldsValue({ polyline: { color: e.target.value } });
                                  setColor([e.target.value]);
                                  change();
                                }}
                              />
                              <Input
                                style={{ width: '30px !important' }}
                                value={color || '#ff0000'}
                                type="text"
                                onChange={(e) => {
                                  const val = e.target.value.trim();
                                  form.setFieldsValue({ polyline: { color: val } });
                                  setColor([val]);
                                  change();
                                }}
                              />
                            </Form.Item>
                          )}
                          {item.type === 'color' && item.name === 'outlineColor' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Input
                                value={outlineColor || '#000000'}
                                type="color"
                                onChange={(e) => {
                                  form.setFieldsValue({
                                    polyline: { outlineColor: e.target.value },
                                  });
                                  setOutlineColor([e.target.value]);
                                  change();
                                }}
                              />
                              <Input
                                style={{ width: '30px !important' }}
                                value={outlineColor || '#000000'}
                                type="text"
                                onChange={(e) => {
                                  const val = e.target.value.trim();
                                  form.setFieldsValue({ polyline: { outlineColor: val } });
                                  setOutlineColor([val]);
                                  change();
                                }}
                              />
                            </Form.Item>
                          )}
                          {item.type === 'color' && item.name === 'oddColor' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Input
                                value={oddColor || '#000000'}
                                type="color"
                                onChange={(e) => {
                                  form.setFieldsValue({ polyline: { oddColor: e.target.value } });
                                  setOddColor([e.target.value]);
                                  change();
                                }}
                              />
                              <Input
                                style={{ width: '30px !important' }}
                                value={color || '#000000'}
                                type="text"
                                onChange={(e) => {
                                  const val = e.target.value.trim();
                                  form.setFieldsValue({ polyline: { color: val } });
                                  setOddColor([val]);
                                  change();
                                }}
                              />
                            </Form.Item>
                          )}
                          {item.type === 'number' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <InputNumber min={0.1} onChange={change} step={item.step} />
                            </Form.Item>
                          )}
                          {item.type === 'radio' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Radio.Group onChange={change}>
                                <Radio value={true}>是</Radio>
                                <Radio value={false}>否</Radio>
                              </Radio.Group>
                            </Form.Item>
                          )}
                          {item.type === 'slider' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Slider
                                min={item.min}
                                max={item.max}
                                step={item.step}
                                style={{ width: '200px' }}
                                onChange={change}
                              />
                            </Form.Item>
                          )}
                          {item.type === 'label' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <input />
                            </Form.Item>
                          )}
                        </>
                      )
                    );
                  })}
              </>
            )}
            {type === 'polygon' && (
              <>
                <Form.Item label="类型:" name="type">
                  <Input disabled />
                </Form.Item>
                {linetype.map((item) => {
                  return (
                    <div key={item.name}>
                      {item.code === 'polygon' && (
                        <Form.Item label={item.label} name={['polygon', item.name]}>
                          <Select
                            showSearch
                            defaultValue={'Color'}
                            style={{ width: 120 }}
                            onChange={(val) => {
                              change();
                              setPolygontypeList(
                                linetype[2]?.data?.filter((iter: any) => {
                                  return val === iter.value;
                                })[0].impact,
                              );
                            }}
                          >
                            {linetype[2]?.data?.map((items: any) => {
                              return (
                                <Option key={items.value} value={items.value}>
                                  {items.label}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      )}
                    </div>
                  );
                })}
                {polygontypeList &&
                  polygontypeList.length > 0 &&
                  linetype.map((item) => {
                    return (
                      polygontypeList.includes(item.name) && (
                        <>
                          {item.type === 'color' && item.name === 'color' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Input
                                value={color || '#ffffff'}
                                type="color"
                                onChange={(e) => {
                                  form.setFieldsValue({ polygon: { color: e.target.value } });
                                  setColor([e.target.value]);
                                  change();
                                }}
                              />
                              <Input
                                style={{ width: '30px !important' }}
                                value={color || '#ffffff'}
                                type="text"
                                onChange={(e) => {
                                  const val = e.target.value.trim();
                                  form.setFieldsValue({ polygon: { color: val } });
                                  setColor([val]);
                                  change();
                                }}
                              />
                            </Form.Item>
                          )}
                          {item.type === 'color' && item.name === 'outlineColor' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Input
                                value={outlineColor || '#000000'}
                                type="color"
                                onChange={(e) => {
                                  form.setFieldsValue({
                                    polygon: { outlineColor: e.target.value },
                                  });
                                  setOutlineColor([e.target.value]);
                                  change();
                                }}
                              />
                              <Input
                                style={{ width: '30px !important' }}
                                value={outlineColor || '#000000'}
                                type="text"
                                onChange={(e) => {
                                  const val = e.target.value.trim();
                                  form.setFieldsValue({ polyline: { outlineColor: val } });
                                  setOutlineColor([val]);
                                  change();
                                }}
                              />
                            </Form.Item>
                          )}
                          {item.type === 'color' && item.name === 'oddColor' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Input
                                value={oddColor || '#000000'}
                                type="color"
                                onChange={(e) => {
                                  form.setFieldsValue({ polygon: { oddColor: e.target.value } });
                                  setOddColor([e.target.value]);
                                  change();
                                }}
                              />
                              <Input
                                style={{ width: '30px !important' }}
                                value={color || '#000000'}
                                type="text"
                                onChange={(e) => {
                                  const val = e.target.value.trim();
                                  form.setFieldsValue({ polyline: { color: val } });
                                  setOddColor([val]);
                                  change();
                                }}
                              />
                            </Form.Item>
                          )}
                          {item.type === 'number' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <InputNumber min={0.1} onChange={change} step={item.step} />
                            </Form.Item>
                          )}
                          {item.type === 'radio' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Radio.Group onChange={change}>
                                <Radio value={true}>是</Radio>
                                <Radio value={false}>否</Radio>
                              </Radio.Group>
                            </Form.Item>
                          )}
                          {item.type === 'slider' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Slider
                                min={item.min}
                                max={item.max}
                                step={item.step}
                                style={{ width: '200px' }}
                                onChange={change}
                              />
                            </Form.Item>
                          )}
                          {item.type === 'label' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <input />
                            </Form.Item>
                          )}
                          {item.type === 'text' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Input onChange={change} />
                            </Form.Item>
                          )}
                          {item.type === 'select' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Select
                                optionFilterProp="label"
                                showSearch
                                options={item.val}
                                onChange={change}
                              />
                            </Form.Item>
                          )}
                        </>
                      )
                    );
                  })}
              </>
            )}
            {type === 'wall' && (
              <>
                <Form.Item label="类型:" name="type">
                  <Input disabled />
                </Form.Item>
                {linetype.map((item) => {
                  return (
                    <div key={item.name}>
                      {item.code === 'wall' && (
                        <Form.Item label={item.label} name={[type, item.name]}>
                          <Select
                            showSearch
                            defaultValue={'LineFlow'}
                            style={{ width: 120 }}
                            onChange={(val) => {
                              change();
                              setWalltypeList(
                                linetype[1]?.data?.filter((iter: any) => {
                                  return val === iter.value;
                                })[0].impact,
                              );
                            }}
                          >
                            {linetype[1]?.data?.map((items: any) => {
                              return (
                                <Option key={items.value} value={items.value}>
                                  {items.label}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      )}
                    </div>
                  );
                })}
                {walltypeList &&
                  walltypeList.length > 0 &&
                  linetype.map((item) => {
                    return (
                      walltypeList.includes(item.name) && (
                        <>
                          {item.type === 'number' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <InputNumber min={0.1} onChange={change} step={item.step} />
                            </Form.Item>
                          )}
                          {item.type === 'radio' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Radio.Group onChange={change}>
                                <Radio value={true}>是</Radio>
                                <Radio value={false}>否</Radio>
                              </Radio.Group>
                            </Form.Item>
                          )}
                          {item.type === 'slider' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Slider
                                min={item.min}
                                max={item.max}
                                step={item.step}
                                style={{ width: '200px' }}
                                onChange={change}
                              />
                            </Form.Item>
                          )}
                          {item.type === 'color' && item.name === 'color' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Input
                                value={color || '#bdf700'}
                                type="color"
                                onChange={(e) => {
                                  form.setFieldsValue({ wall: { color: e.target.value } });
                                  setColor([e.target.value]);
                                  change();
                                }}
                              />
                              <Input
                                style={{ width: '30px !important' }}
                                value={color || '#bdf700'}
                                type="text"
                                onChange={(e) => {
                                  const val = e.target.value.trim();
                                  form.setFieldsValue({ wall: { color: val } });
                                  setColor([val]);
                                  change();
                                }}
                              />
                            </Form.Item>
                          )}
                          {item.type === 'color' && item.name === 'outlineColor' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Input
                                value={outlineColor || '#000000'}
                                type="color"
                                onChange={(e) => {
                                  form.setFieldsValue({ wall: { outlineColor: e.target.value } });
                                  setOutlineColor([e.target.value]);
                                  change();
                                }}
                              />
                              <Input
                                style={{ width: '30px !important' }}
                                value={outlineColor || '#000000'}
                                type="text"
                                onChange={(e) => {
                                  const val = e.target.value.trim();
                                  form.setFieldsValue({ wall: { outlineColor: val } });
                                  setOutlineColor([val]);
                                  change();
                                }}
                              />
                            </Form.Item>
                          )}
                          {item.type === 'color' && item.name === 'oddColor' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Input
                                value={outlineColor || '#000000'}
                                type="color"
                                onChange={(e) => {
                                  form.setFieldsValue({ wall: { oddColor: e.target.value } });
                                  setOddColor([e.target.value]);
                                  change();
                                }}
                              />
                              <Input
                                style={{ width: '30px !important' }}
                                value={outlineColor || '#000000'}
                                type="text"
                                onChange={(e) => {
                                  const val = e.target.value.trim();
                                  form.setFieldsValue({ wall: { color: val } });
                                  setOddColor([val]);
                                  change();
                                }}
                              />
                            </Form.Item>
                          )}
                          {item.type === 'label' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <input />
                            </Form.Item>
                          )}
                          {item.type === 'text' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Input onChange={change} />
                            </Form.Item>
                          )}
                          {item.type === 'select' && (
                            <Form.Item label={item.label} name={[type, item.name]}>
                              <Select
                                optionFilterProp="label"
                                showSearch
                                options={item.val}
                                onChange={change}
                              />
                            </Form.Item>
                          )}
                        </>
                      )
                    );
                  })}
              </>
            )}
            {type === 'label' && (
              <>
                <Form.Item label="类型:" name="type">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="内容:" name={[type, 'text']}>
                  <Input onChange={change} />
                </Form.Item>
                <Form.Item label="颜色:" name={[type, 'color']}>
                  <input
                    value={''}
                    type="color"
                    onChange={(e) => {
                      form.setFieldsValue({ polyline: { color: e.target.value } });
                      change();
                    }}
                  />
                </Form.Item>
                <Form.Item label="透明度:" name={[type, 'opacity']}>
                  <Slider step={0.1} min={0} max={1} style={{ width: '200px' }} onChange={change} />
                </Form.Item>
                <Form.Item label="字体:" name={[type, 'font_family']}>
                  <AutoComplete
                    dataSource={['微软雅黑', '黑体', '楷体', '隶书', '宋体']}
                    children={<Input type="text" onChange={change} />}
                    onChange={change}
                  />
                </Form.Item>
                <Form.Item label="字体大小:" name={[type, 'font_size']}>
                  <InputNumber min={1} onChange={change} />
                </Form.Item>
                <Form.Item label="是否衬色:" name={[type, 'outline']}>
                  <Radio.Group onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="衬色颜色:" name={[type, 'outlineColor']}>
                  <input
                    value={''}
                    type="color"
                    onChange={(e) => {
                      form.setFieldsValue({ polygon: { outlineColor: e.target.value } });
                      change();
                    }}
                  />
                </Form.Item>
                <Form.Item label="衬色宽度:" name={[type, 'outlineWidth']}>
                  <InputNumber min={1} onChange={change} />
                </Form.Item>
                <Form.Item label="是否背景:" name={[type, 'background']}>
                  <Radio.Group onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="背景颜色:" name={[type, 'backgroundColor']}>
                  <input
                    value={''}
                    type="color"
                    onChange={(e) => {
                      form.setFieldsValue({ label: { backgroundColor: e.target.value } });
                      change();
                    }}
                  />
                </Form.Item>
                <Form.Item label="背景透明度:" name={[type, 'backgroundOpacity']}>
                  <Slider step={0.1} min={0} max={1} style={{ width: '200px' }} onChange={change} />
                </Form.Item>
                <Form.Item label="是否加粗:" name={[type, 'font_weight']}>
                  <Radio.Group onChange={change}>
                    <Radio value="bold">是</Radio>
                    <Radio value="normal">否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="是否斜体:" name={[type, 'font_style']}>
                  <Radio.Group onChange={change}>
                    <Radio value="italic">是</Radio>
                    <Radio value="normal">否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="是否贴地:" name={[type, 'clampToGround']}>
                  <Radio.Group onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="层级:" name={[type, 'zIndex']}>
                  <InputNumber min={1} onChange={change} />
                </Form.Item>
                <Form.Item label="是否按视距缩放:" name={[type, 'scaleByDistance']}>
                  <Radio.Group value={[type, 'scaleByDistance']}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="上限:" name={[type, 'scaleByDistance_far']}>
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item label="比例值:" name={[type, 'scaleByDistance_farValue']}>
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item label="下限:" name={[type, 'scaleByDistance_near']}>
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item label="比例值:" name={[type, 'scaleByDistance_nearValue']}>
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item label="是否按视距显示:" name={[type, 'distanceDisplayCondition']}>
                  <Radio.Group onChange={change}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="最大距离:" name={[type, 'distanceDisplayCondition_far']}>
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item label="最小距离:" name={[type, 'distanceDisplayCondition_near']}>
                  <InputNumber onChange={change} />
                </Form.Item>
              </>
            )}
            {type === 'div' && (
              <>
                <Form.Item label="类型:" name="type">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="标题:" name="divname">
                  <Input onChange={change} />
                </Form.Item>
                {div.map((item) => {
                  return (
                    <div key={item.name}>
                      {item.type === 'number' && (
                        <Form.Item label={item.label} name={['div', item.name]}>
                          <InputNumber
                            min={item.min}
                            max={item.max}
                            onChange={change}
                            step={item.step}
                          />
                        </Form.Item>
                      )}
                      {item.type === 'radio' && (
                        <Form.Item label={item.label} name={['div', item.name]}>
                          <Radio.Group onChange={change}>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                          </Radio.Group>
                        </Form.Item>
                      )}
                      {item.type === 'slider' && (
                        <Form.Item label={item.label} name={['div', item.name]}>
                          <Slider
                            min={item.min}
                            max={item.max}
                            step={item.step}
                            style={{ width: '200px' }}
                            onChange={change}
                          />
                        </Form.Item>
                      )}
                      {item.type === 'color' && (
                        <Form.Item label={item.label} name={['div', item.name]}>
                          <input
                            value={'yellow'}
                            type="color"
                            onChange={(e) => {
                              form.setFieldsValue({ polyline: { color: e.target.value } });
                              change();
                            }}
                          />
                        </Form.Item>
                      )}
                      {item.type === 'label' && (
                        <Form.Item label={item.label} name={['div', item.name]}>
                          <input />
                        </Form.Item>
                      )}
                    </div>
                  );
                })}
              </>
            )}
            {circle1 === '扇形雷达' && (
              <>
                <Form.Item label="开始角度" name={['circle1', 'startAngle']}>
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item label="结束角度" name={['circle1', 'endAngle']}>
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item label="半径" name={['circle1', 'radius']}>
                  <InputNumber onChange={change} />
                </Form.Item>
                <Form.Item label="旋转角度" name={['circle1', 'rotationDegree']}>
                  <InputNumber onChange={change} />
                </Form.Item>
              </>
            )}
          </div>
        )}
        <div className={style.lnglist}>
          {pointinfo ? (
            <div
              onClick={() => {
                setPointinfo(!pointinfo);
              }}
            >
              -
            </div>
          ) : (
            <div
              onClick={() => {
                setPointinfo(!pointinfo);
              }}
            >
              +
            </div>
          )}
          标记信息
        </div>
        {pointinfo && (
          <div className={style.uploadstyle}>
            <Form.List name="self">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 2 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'first']}
                        rules={[{ required: true, message: '请输入字段名' }]}
                        style={{ width: '100px' }}
                      >
                        <Input placeholder="字段名" />
                      </Form.Item>
                      :
                      <Form.Item
                        {...restField}
                        name={[name, 'last']}
                        rules={[{ required: true, message: '请输入值' }]}
                        style={{ width: '246px' }}
                      >
                        <Input placeholder="值" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      新增字段
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <ProFormText
              placeholder="请输入标题"
              name="name"
              label="标题"
              labelCol={{ style: { width: '80px' } }}
              fieldProps={{
                maxLength: 200,
              }}
              getValueFromEvent={(e) => e.target.value.trim()}
            />
            {true && (
              <>
                <ProFormText
                  placeholder="请输入民警数量"
                  name="mjNum"
                  label="民警数量"
                  labelCol={{ style: { width: '80px' } }}
                  fieldProps={{
                    maxLength: 200,
                  }}
                  getValueFromEvent={(e) => e.target.value.trim()}
                />
                <ProFormText
                  placeholder="请输入辅警数量"
                  name="fjNum"
                  label="辅警数量"
                  labelCol={{ style: { width: '80px' } }}
                  fieldProps={{
                    maxLength: 200,
                  }}
                  getValueFromEvent={(e) => e.target.value.trim()}
                />
                <ProFormText
                  placeholder="请输入保安数量"
                  name="baNum"
                  label="保安数量"
                  labelCol={{ style: { width: '80px' } }}
                  fieldProps={{
                    maxLength: 200,
                  }}
                  getValueFromEvent={(e) => e.target.value.trim()}
                />
                <ProFormText
                  placeholder="请输入交警数量"
                  name="jjNum"
                  label="交警数量"
                  labelCol={{ style: { width: '80px' } }}
                  fieldProps={{
                    maxLength: 200,
                  }}
                  getValueFromEvent={(e) => e.target.value.trim()}
                />
                <ProFormText
                  placeholder="请输入消防数量"
                  name="xfNum"
                  label="消防数量"
                  labelCol={{ style: { width: '80px' } }}
                  fieldProps={{
                    maxLength: 200,
                  }}
                  getValueFromEvent={(e) => e.target.value.trim()}
                />
              </>
            )}
            {typeLabel !== '重点区域' ? (
              <>
                <div>
                  <span style={{ marginRight: '10px' }}>岗点人员:</span>
                  <Button
                    type="primary"
                    onClick={() => {
                      setSelectedData(solutionPersonList);
                      setList(solutionPersonList.map((item) => item.personId));
                      setTypeflag('选择人员');
                      setModelShow(true);
                    }}
                  >
                    选择人员
                  </Button>
                  {solutionPersonList?.length > 0 && (
                    <Table
                      style={{ marginTop: '10px' }}
                      dataSource={solutionPersonList}
                      columns={columnsperson}
                      pagination={false}
                    />
                  )}
                </div>
                <div>
                  <span style={{ marginRight: '10px' }}>新增设备:</span>
                  <Button
                    type="primary"
                    onClick={() => {
                      setSelectedData(solutionDeviceList);
                      setList(solutionDeviceList.map((item) => item.deviceId));
                      setTypeflag('选择设备');
                      setModelShow(true);
                    }}
                  >
                    选择设备
                  </Button>
                  {solutionDeviceList?.length > 0 && (
                    <Table
                      style={{ marginTop: '10px' }}
                      dataSource={solutionDeviceList}
                      columns={columndevice}
                      pagination={false}
                    />
                  )}
                </div>
                <div>
                  <span style={{ marginRight: '10px' }}>选择视频:</span>
                  <Button
                    type="primary"
                    onClick={() => {
                      setSelectedData(solutionVedioList);
                      setList(solutionVedioList.map((item) => item.vedioID));
                      setTypeflag('选择视频');
                      setModelShow(true);
                    }}
                  >
                    选择视频
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      let polygon: any = [];
                      try {
                        const currentsViewsArr = JSON.parse(currentsViews);
                        polygon = formatPolygon(currentsViewsArr) || null;
                      } catch (e) {
                        console.log(e);
                      }

                      const params = {
                        polygon,
                        pageNumber: 1,
                        pageSize: 9999,
                      };
                      queryVideo(params)
                        .then((res: any) => {
                          if (res.code === 200) {
                            const videoList = res?.data?.rows || [];
                            props.videoRander(videoList);
                          }
                        })
                        .catch((err: any) => {
                          message.error(err.message || err);
                        });
                    }}
                  >
                    显示监控
                  </Button>
                  {solutionVedioList?.length > 0 && (
                    <Table
                      style={{ marginTop: '10px' }}
                      dataSource={solutionVedioList}
                      columns={columnvedio}
                      pagination={false}
                      key="rowid"
                    />
                  )}
                </div>
              </>
            ) : (
              <div>
                <span style={{ marginRight: '10px' }}>选择视频:</span>
                <Button
                  type="primary"
                  onClick={() => {
                    setSelectedData(solutionVedioList);
                    setList(solutionVedioList.map((item) => item.vedioID));
                    setTypeflag('选择视频');
                    setModelShow(true);
                  }}
                >
                  选择视频
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    let polygon: any = [];
                    try {
                      const currentsViewsArr = JSON.parse(currentsViews);
                      polygon = formatPolygon(currentsViewsArr) || null;
                    } catch (e) {
                      console.log(e);
                    }

                    const params = {
                      polygon,
                      pageNumber: 1,
                      pageSize: 9999,
                    };
                    queryVideo(params)
                      .then((res: any) => {
                        if (res.code === 200) {
                          const videoList = res?.data?.rows || [];
                          props.videoRander(videoList);
                        }
                      })
                      .catch((err: any) => {
                        message.error(err.message || err);
                      });
                  }}
                >
                  显示监控
                </Button>
                {solutionVedioList?.length > 0 && (
                  <Table
                    style={{ marginTop: '10px' }}
                    dataSource={solutionVedioList}
                    columns={columnvediokey}
                    pagination={false}
                  />
                )}
              </div>
            )}
          </div>
        )}
        <div className={style.save}>
          <Button
            style={{ marginRight: '15px' }}
            type="primary"
            onClick={() => {
              changeItem(form, solutionPersonList, solutionDeviceList, solutionVedioList);
            }}
          >
            保存
          </Button>
          <Button
            style={{ marginLeft: '15px' }}
            type="primary"
            onClick={() => {
              setPersonList([]);
              setDeviceList([]);
              setVedioList([]);
              if (editFlag) {
                deleteItem(graphic, editFlag);
              } else {
                Modal.confirm({
                  title: '删除标点',
                  content: '确定删除改标点',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => {
                    deleteItem(graphic, editFlag);
                  },
                });
              }
            }}
          >
            删除
          </Button>
        </div>
      </Form>
      {modelShow && (
        <SelectModel
          info={info}
          key={typeflag}
          selectedData={selectedData}
          selectedList={list}
          modelShow={modelShow}
          typeflag={typeflag}
          cancel={() => {
            setModelShow(false);
          }}
          save={(e: any) => {
            let value;
            if (typeflag === '选择人员' && e.length > 0) {
              value = e.map((item: any) => {
                item.personName = item.name || item.personName;
                return item;
              });
              setPersonList(value || []);
            } else if (typeflag === '选择设备') {
              value = e.map((item: any) => {
                item.deviceName = item.name || item.videoName;
                item.deviceCode = item.code;
                return item;
              });
              setDeviceList(value || []);
            } else if (typeflag === '选择视频') {
              value = e.map((item: any) => {
                item.videoName = item.name || item.videoName;
                return item;
              });
              setVedioList(value || []);
            }
          }}
        />
      )}
    </>
  );
});
export default Point;

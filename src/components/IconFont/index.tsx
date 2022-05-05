import { createFromIconfontCN } from '@ant-design/icons';
import defaultSettings from '../../../config/defaultSettings';

const iconfongUrl = require('./iconfont');

const IconFont = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl || iconfongUrl,
});
export default IconFont;

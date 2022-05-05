import { AimOutlined } from '@ant-design/icons';
/**
 *
 * @param cb 回调函数 绑定在组件上
 * @returns
 */
function render(cb: any): any {
  return (
    <AimOutlined
      style={{ fontSize: '14px', verticalAlign: 'bottom', cursor: 'pointer' }}
      onClick={cb}
    ></AimOutlined>
  );
}
export default render;

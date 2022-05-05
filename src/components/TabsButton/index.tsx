import React from 'react';
import { Radio } from 'antd';
import { useAccess, Access } from 'umi';
import styles from './index.less';

type TabsI = {
  size: any;
  loading: boolean;
  defaultValue: any;
  columns: any;
  onClick: (value: any) => void;
};

const Tabs: React.FC<TabsI> = ({ size, loading, defaultValue, columns, onClick }) => {
  const access = useAccess();

  return (
    <>
      <Radio.Group
        size={size}
        disabled={loading}
        className={styles.Tabs}
        defaultValue={defaultValue}
        onChange={(e) => onClick(e.target.value)}
      >
        {columns &&
          columns.map((item: any) => {
            return (
              <Access accessible={access.btnHasAuthority(item.access)} key={item.access}>
                <Radio.Button value={item.value}>{item.content}</Radio.Button>
              </Access>
            );
          })}
      </Radio.Group>
    </>
  );
};

export default Tabs;

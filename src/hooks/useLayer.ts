import { useEffect, useState } from 'react';
import { getTableData } from '@/services/Layer/index';
import { message } from 'antd';
export default function () {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    getTableData({ page: 0, size: 2 ** 10 })
      .then((res) => {
        setList(res.result.page.content);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err.message);
      });
  }, []);
  return { list, loading };
}

import { getTableData } from '../services/activeManager/index';
import { useState, useEffect } from 'react';
function useActIds() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    getTableData({
      page: 0,
      size: 2 ** 10,
    }).then((res) => {
      setLoading(false);
      setList(res.result.page.content);
    });
  }, []);
  return { list, loading };
}
export default useActIds;

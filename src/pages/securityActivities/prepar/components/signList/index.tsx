import React, { useState, useRef, useEffect } from 'react';
import style from './style.less';
import { Button, message, Modal, TreeSelect } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getToken } from '@/utils/auth';
import Import from '../Import'; //导入
interface Props {
  copyFlag?: boolean;
  copySolutionFun: (val: any, msg: any) => void;
  deleteIconFun: (val?: any) => void;
  planID: string;
  markList: any[];
  activityId: string;
  refresh: (val?: any, callback?: string) => void;
  treeData: any[];
  map: any;
  importUrl: string;
  exportUrl: string;
}
export interface TableListItem {
  id?: string;
  name?: string | null;
  markList: [];
}
// 导出json
const download = (url: string, name: string) => {
  const aLink = document.createElement('a');
  document.body.appendChild(aLink);
  aLink.style.display = 'none';
  aLink.href = url;
  aLink.setAttribute('download', name);
  aLink.click();
  document.body.removeChild(aLink);
};
const exportFile = (url: any, param: any, name: any) => {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken(),
    },
    body: JSON.stringify(param),
  })
    .then((res) => res.blob())
    .then((data) => {
      const href = window.URL.createObjectURL(data);
      download(href, name);
    });
};

const SignList: React.FC<Props> = (props) => {
  const {
    planID,
    markList,
    refresh,
    activityId,
    treeData,
    deleteIconFun,
    copySolutionFun,
    map,
    importUrl,
    exportUrl,
  } = props;
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]); //多选
  const [importVisible, setImportVisible] = useState<boolean>(false); //导入状态
  const [copyFlag, setCopyFlag] = useState<boolean>(false);
  const keys = useRef('');
  const form = useRef<ActionType>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '图标',
      dataIndex: 'minioFileUrl',
      render: (imgurl: any) => {
        return <img style={{ width: '40px', height: '40px' }} src={imgurl} />;
      },
    },
    {
      title: '标题',
      align: 'center',
      dataIndex: 'iconTitle',
      render: (title: any, re) => {
        return re.name || title;
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 100,
      render: (id: any, e: any) => {
        return (
          <a
            onClick={() => {
              Modal.confirm({
                title: '删除标点',
                content: '确定删除改标点',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                  deleteIconFun([e.iconLayerId || e.id]);
                },
              });
            }}
          >
            删除
          </a>
        );
      },
    },
  ];
  useEffect(() => {
    form.current?.reloadAndRest!();
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planID, activityId]);
  // 弹框
  const [value, setValue] = useState(undefined);
  return (
    <>
      <ProTable<TableListItem>
        tableAlertRender={false}
        actionRef={form}
        className={style.markbox}
        columns={columns}
        rowSelection={{
          fixed: true,
          onChange: (_, item) => {
            setSelectedRows(item);
          },
        }}
        dataSource={markList}
        options={{
          density: false,
          fullScreen: undefined,
          reload: undefined,
          setting: false,
        }}
        search={false}
        rowKey="id"
        toolbar={{
          multipleLine: true,
          search: {
            onSearch: (val) => {
              keys.current = val;
              refresh(val);
            },
          },
          actions: [
            <>
              <Button
                key="show"
                onClick={() => {
                  const data = selectedRowsState.map((item) => item.iconLayerId || item.id);
                  if (data.length > 0) {
                    deleteIconFun(data);
                  } else {
                    message.error('请选择删除数据');
                  }
                }}
              >
                批量删除
              </Button>
              <Button
                key="show"
                onClick={() => {
                  refresh(undefined, 'import');
                }}
              >
                更新序列
              </Button>
              <Button
                key="show"
                onClick={() => {
                  if (selectedRowsState.length < 1) {
                    message.warning('请选择标记');
                    return;
                  }
                  setCopyFlag(true);
                }}
              >
                复制
              </Button>
              <Button
                key="show"
                onClick={() => {
                  setImportVisible(true);
                }}
              >
                导入
              </Button>
              <Button
                key="show"
                onClick={() => {
                  if (selectedRowsState.length < 1) {
                    message.warning('请选择标记');
                    return;
                  }
                  exportFile(
                    exportUrl,
                    {
                      dataList: selectedRowsState,
                      fileName: '图标',
                    },
                    '图标.json',
                  );
                }}
              >
                导出
              </Button>
            </>,
          ],
        }}
        pagination={false}
        onRow={(record: any) => {
          return {
            onClick: () => {
              const res = JSON.parse(record?.entity)?.GeoJSON?.geometry;
              const position = res?.coordinates;
              let lng;
              let lat;
              if (position[0] instanceof Array) {
                if (res?.type === 'Polygon') {
                  lat = position[0][0][1] - 0.015;
                  lng = position[0][0][0] + 0.0047;
                } else {
                  lat = position[0][1] - 0.015;
                  lng = position[0][0] + 0.0047;
                }
              } else {
                lat = position[1] - 0.015;
                lng = position[0] + 0.0047;
              }
              map.centerAt({
                lat,
                lng,
                alt: 1500,
                heading: 360,
                pitch: -45,
              });
            },
          };
        }}
      />
      {/* 导入 */}
      {importVisible && (
        <Import
          importUrl={importUrl}
          planID={planID}
          importVisible={importVisible}
          onSub={() => {
            if (form.current) {
              form.current?.reloadAndRest!();
            }
          }}
          ok={() => {
            refresh(undefined, 'import');
            setImportVisible(false);
          }}
        />
      )}
      {/* 弹框 */}
      {copyFlag && (
        <Modal
          maskClosable={false}
          className={style.copy}
          title="复制方案"
          visible={true}
          onOk={() => {
            const solutionIdList = selectedRowsState.map((item) => {
              return item.id;
            });
            copySolutionFun(value, solutionIdList);
            setCopyFlag(false);
          }}
          onCancel={() => {
            setCopyFlag(false);
          }}
        >
          <div>
            复制方案至:
            <TreeSelect
             fieldNames={{ label: 'title', value: 'key', children: 'children' }}
              treeData={treeData[0]?.children}
              showSearch
              style={{ width: '300px' }}
              value={value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              onChange={(val: any) => {
                setValue(val);
              }}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default SignList;

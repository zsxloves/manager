/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Transfer, Tree } from 'antd';
import { setTreeData } from '@/utils/utilsJS';
// import styles from './index.less';

export interface BaseConfirmProps {
  onSubmit: (list?: any) => void;
  treeList: any[];
}
export interface typeItem {
  checked: string;
  id: string;
  key?: string;
  name: string;
  parentId: string;
  title?: string;
  [key: string]: any;
}
const TransferSelect: React.FC<BaseConfirmProps> = (props: any) => {
  const { onSubmit: handleConfirm, treeList } = props;
  const [roleList, setRoleList] = useState<any>([]);
  const [roleListTree, setRoleListTree] = useState<any>([]);
  const [leftCheckNode, setLeftCheckNode] = useState<any>([]);
  const [checkedKeysLeft, setCheckedKeysLeft] = useState<React.Key[]>([]);
  const [leftHalfCheckedKeys, setLeftHalfCheckedKeys] = useState<any>();

  const [checkedRoleList, setCheckedRoleList] = useState<any>([]);
  const [checkedRoleListTree, setCheckedRoleListTree] = useState<any>([]);
  const [rightCheckNode, setRightCheckNode] = useState<any>([]);
  const [checkedKeysRight, setCheckedKeysRight] = useState<React.Key[]>([]);
  const [rightHalfCheckedKeys, setRightHalfCheckedKeys] = useState<any>();

  const handleEnsure = async (list: typeItem[]) => {
    handleConfirm(list);
  };
  const initFun = () => {
    const checkList: typeItem[] = [];
    const List: typeItem[] = [];
    treeList.forEach((val: typeItem) => {
      if (val.checked === '1') {
        checkList.push({ ...val, key: val.id, title: val.name });
      } else {
        List.push({ ...val, key: val.id, title: val.name });
      }
    });
    const setParentNode = (item: typeItem) => {
      if (
        List.every((val: typeItem) => {
          return item.parentId !== val.id && item.parentId !== '0';
        })
      ) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < checkList.length; i++) {
          const checkItem = checkList[i];
          if (checkItem.id === item.parentId) {
            List.push(checkItem);
            if (checkItem.parentId === '0') {
              return;
            }
            setParentNode(checkItem);
            break;
          }
        }
        checkList.forEach((checkItem: typeItem) => {
          if (checkItem.id === item.parentId) {
            List.push(checkItem);
          }
        });
      }
    };
    List.forEach((item: typeItem) => {
      setParentNode(item);
    });
    const newList = [...new Set(List)];
    const newCheckList = [...new Set(checkList)];

    setRoleList(newList);
    console.log('ssss:', setTreeData(newList));
    setRoleListTree(setTreeData(newList));

    setCheckedRoleList(newCheckList);
    setCheckedRoleListTree(setTreeData(newCheckList));

    handleEnsure(newCheckList);
  };
  useEffect(() => {
    initFun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 获取半选状态节点
  const getHalfSelectNode = (list: string[], type: string) => {
    const nodeArr: any = [];
    const listArr = type === 'left' ? roleList : checkedRoleList;
    listArr.forEach((item: any) => {
      if (list.includes(item.id)) {
        nodeArr.push(item);
      }
    });
    return nodeArr;
  };
  const isChecked = (selectedKeys: any, eventKey: any) => selectedKeys.indexOf(eventKey) !== -1;
  return (
    <Transfer
      dataSource={roleList}
      listStyle={{
        height: '50vh',
        minWidth: '350px',
      }}
      className="tree-transfer"
      render={(item) => item.name}
      showSelectAll={false}
      titles={['未选权限', '已选权限']}
      selectAllLabels={[
        () => {
          return `共${roleList.length}项`;
        },
        () => {
          return `共${checkedRoleList.length}项`;
        },
      ]}
      onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => {
        // console.log('sssssssssss:',sourceSelectedKeys, targetSelectedKeys)
      }}
      onChange={async (targetK, direction): Promise<void> => {
        if (direction === 'right') {
          const newLeftList: any = [];
          await roleList.forEach((item: any) => {
            if (
              leftCheckNode.every((val: any) => {
                return val.id !== item.id;
              })
            ) {
              newLeftList.push(item);
            }
          });
          const halfNode = await getHalfSelectNode(leftHalfCheckedKeys, 'left');
          setRoleList(newLeftList);
          setRoleListTree(setTreeData(newLeftList));

          const newRightList = checkedRoleList;
          await leftCheckNode.forEach((item: any) => {
            if (
              newRightList.every((val: any) => {
                return val.id !== item.id;
              })
            ) {
              newRightList.push(item);
            }
          });
          await halfNode.forEach((item: any) => {
            if (
              newRightList.every((val: any) => {
                return val.id !== item.id;
              })
            ) {
              newRightList.push(item);
            }
          });
          setCheckedRoleList(newRightList);
          setCheckedRoleListTree(setTreeData(newRightList));
          setCheckedKeysRight([]);
          handleEnsure(newRightList);
        }
        if (direction === 'left') {
          const newRightList: any = [];
          await checkedRoleList.forEach((item: any) => {
            if (
              rightCheckNode.every((val: any) => {
                return val.id !== item.id;
              })
            ) {
              newRightList.push(item);
            }
          });
          const halfNode = await getHalfSelectNode(rightHalfCheckedKeys, 'right');
          setCheckedRoleList(newRightList);
          setCheckedRoleListTree(setTreeData(newRightList));

          const newLeftList = roleList;
          await rightCheckNode.forEach((item: any) => {
            if (
              newLeftList.every((val: any) => {
                return val.id !== item.id;
              })
            ) {
              newLeftList.push(item);
            }
          });
          await halfNode.forEach((item: any) => {
            if (
              newLeftList.every((val: any) => {
                return val.id !== item.id;
              })
            ) {
              newLeftList.push(item);
            }
          });
          setRoleList(newLeftList);
          setRoleListTree(setTreeData(newLeftList));

          setCheckedKeysLeft([]);
          handleEnsure(newRightList);
        }
      }}
    >
      {/* // eslint-disable-next-line consistent-return */}
      {({ direction, onItemSelect }): any => {
        if (direction === 'left') {
          return roleListTree.length > 0 ? (
            <Tree
              blockNode
              checkable
              defaultExpandAll
              checkedKeys={checkedKeysLeft}
              treeData={roleListTree}
              titleRender={(item: any) => item.name}
              onCheck={(_: any, { checkedNodes, node: { key }, halfCheckedKeys }) => {
                // console.log("onCheck:",_,checkedNodes,key,halfCheckedKeys)
                setLeftHalfCheckedKeys(halfCheckedKeys);
                setLeftCheckNode(checkedNodes);
                setCheckedKeysLeft(_);
                // console.log('checkedKeys:',checkedKeysLeft ,key)
                onItemSelect(key.toString(), !isChecked(checkedKeysLeft, key));
              }}
              // onSelect={(_, { node: { key },selectedNodes }) => {
              //   setLeftCheckNode(selectedNodes)
              //   onItemSelect(key.toString(), !isChecked(checkedKeys, key));
              // }}
            />
          ) : null;
        }
        if (direction === 'right') {
          return checkedRoleListTree.length > 0 ? (
            <Tree
              blockNode
              checkable
              defaultExpandAll={true}
              autoExpandParent={true}
              checkedKeys={checkedKeysRight}
              treeData={checkedRoleListTree}
              titleRender={(item: any) => item.name}
              onCheck={(_: any, { checkedNodes, node: { key }, halfCheckedKeys }) => {
                // console.log("onCheckRight:",_,checkedNodes,key,halfCheckedKeys)
                setRightHalfCheckedKeys(halfCheckedKeys);
                setRightCheckNode(checkedNodes);
                // console.log('checkedKeysRight:',checkedKeysRight,key)
                setCheckedKeysRight(_);
                onItemSelect(key.toString(), !isChecked(checkedKeysRight, key));
              }}
              // onSelect={(_, { node: { key } }) => {
              //   // console.log("onSelect:",node)
              //   onItemSelect(key.toString(), !isChecked(checkedKeys, key));
              // }}
            />
          ) : null;
        }
      }}
    </Transfer>
  );
};
export default TransferSelect;

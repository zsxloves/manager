import React, { useEffect, useRef } from 'react';
import E from 'wangeditor';
import { formatJson, isJSON } from '@/utils/utilsJS';
import { message } from 'antd';
interface Props {
  onChange: (newHtml: string) => void;
  custom?: string;
  EditorBtn?: () => void;
  placholder?: string;
  content: string;
  checkJson?: boolean;
  id?: string;
}

const Editor: React.FC<Props> = (props) => {
  const { onChange, placholder, content, checkJson, id, custom, EditorBtn } = props;
  const editor: any = useRef();
  const EElem = React.createRef<HTMLDivElement>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E;
  const callback = () => {
    message.error('解析失败');
  };
  //配置详细json
  class CheckJson extends BtnMenu {
    text: any;
    json: any;
    constructor(supper: any) {
      // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
      // ${custom}
      const $elem = E.$(
        `<div class="w-e-menu"  data-title="JSON处理" style="width: 46px; position: absolute; top: 0; left: 210px" >
            <button key="${id}" style="border: none;background: #FFF; cursor: pointer; width: 100%; height: 100%">格式化</button>
          </div>
         `,
      );
      super($elem, supper);
      this.text = supper.txt.text();
      this.json = supper.txt.getJSON();
    }

    // 菜单点击事件
    clickHandler() {
      // 做任何你想做的事情
      // 可参考【常用 API】文档，来操作编辑器

      const json = this.editor.txt.text();
      let newJSON;
      try {
        newJSON = formatJson(json, callback);
      } catch (e) {
        message.error('解析失败');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      newJSON ? this.editor.txt.html('<pre>' + newJSON + '<pre/>') : null;
    }

    // 菜单是否被激活（如果不需要，这个函数可以空着）
    // 1. 激活是什么？光标放在一段加粗、下划线的文本时，菜单栏里的 B 和 U 被激活，如下图
    // 2. 什么时候执行这个函数？每次编辑器区域的选区变化（如鼠标操作、键盘操作等），都会触发各个菜单的 tryChangeActive 函数，重新计算菜单的激活状态
    tryChangeActive() {
      // 激活菜单
      // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
      // 2. this.this.isActive === true
      // this.active();
      // // 取消激活菜单
      // // 1. 菜单 DOM 节点会删掉 .w-e-active
      // // 2. this.this.isActive === false
      // this.unActive()
    }
  }
  //视域
  class AlertMenu extends BtnMenu {
    text: any;
    json: any;
    constructor(supper: any) {
      // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
      // ${custom}
      const $elem = E.$(
        `<div class="w-e-menu"  data-title="选择视域" style="width: 46px; position: absolute; top: 0; left: 260px" >
            <button  style="border: none;background: #FFF; cursor: pointer; width: 100%; height: 100%">视域</button>
          </div>
         `,
      );
      super($elem, supper);
      this.text = supper.txt.text();
      this.json = supper.txt.getJSON();
    }

    // 菜单点击事件
    clickHandler() {
      // 做任何你想做的事情
      // 可参考【常用 API】文档，来操作编辑器
      (EditorBtn as any)();
    }

    // 菜单是否被激活（如果不需要，这个函数可以空着）
    // 1. 激活是什么？光标放在一段加粗、下划线的文本时，菜单栏里的 B 和 U 被激活，如下图
    // 2. 什么时候执行这个函数？每次编辑器区域的选区变化（如鼠标操作、键盘操作等），都会触发各个菜单的 tryChangeActive 函数，重新计算菜单的激活状态
    tryChangeActive() {
      // 激活菜单
      // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
      // 2. this.this.isActive === true
      // this.active();
      // // 取消激活菜单
      // // 1. 菜单 DOM 节点会删掉 .w-e-active
      // // 2. this.this.isActive === false
      // this.unActive()
    }
  }
  //大屏配置
  class DPConfig extends BtnMenu {
    text: any;
    json: any;
    constructor(supper: any) {
      // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
      // ${custom}
      const $elem = E.$(
        `<div class="w-e-menu"  data-title="JSON处理" style="width: 46px; position: absolute; top: 0; left: 210px" >
            <button key="${id}" style="border: none;background: #FFF; cursor: pointer; width: 100%; height: 100%">格式化</button>
          </div>
         `,
      );
      super($elem, supper);
      this.text = supper.txt.text();
      this.json = supper.txt.getJSON();
    }

    // 菜单点击事件
    clickHandler() {
      // 做任何你想做的事情
      // 可参考【常用 API】文档，来操作编辑器

      const json = this.editor.txt.text();
      let newJSON;
      try {
        newJSON = formatJson(json, callback);
      } catch (e) {
        message.error('解析失败');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      newJSON ? this.editor.txt.html('<pre>' + newJSON + '<pre/>') : null;
    }

    // 菜单是否被激活（如果不需要，这个函数可以空着）
    // 1. 激活是什么？光标放在一段加粗、下划线的文本时，菜单栏里的 B 和 U 被激活，如下图
    // 2. 什么时候执行这个函数？每次编辑器区域的选区变化（如鼠标操作、键盘操作等），都会触发各个菜单的 tryChangeActive 函数，重新计算菜单的激活状态
    tryChangeActive() {
      // 激活菜单
      // 1. 菜单 DOM 节点会增加一个 .w-e-active 的 css class
      // 2. this.this.isActive === true
      // this.active();
      // // 取消激活菜单
      // // 1. 菜单 DOM 节点会删掉 .w-e-active
      // // 2. this.this.isActive === false
      // this.unActive()
    }
  }

  E.registerMenu('checkJson', CheckJson);
  useEffect(() => {
    editor.current = new E(EElem.current);
    editor.current.config.height = 200;
    editor.current.config.placeholder = placholder;
    editor.current.config.menus = ['indent', 'code', 'undo', 'redo', 'checkJson'];

    editor.current.config.onchange = function (html: string) {
      const text: string = editor.current.txt.text();
      if (checkJson) {
        onChange(text);
      } else {
        onChange(html);
      }
    };
    //视域
    const menuKey2 = 'alertMenuKey';
    //大屏配置
    const menuKey3 = 'dpConfig';
    if (custom === 'EditorBtn') {
      editor.current.menus.extend(menuKey2, AlertMenu);
      editor.current.config.menus.push(menuKey2);
    } else if (custom === 'indexConfigUrl') {
      editor.current.menus.extend(menuKey3, DPConfig);
      editor.current.config.menus.push(menuKey3);
    }

    editor.current.create();
  }, [EElem.current]);

  useEffect(() => {
    // editor.txt.text(content);
    if (!content || !isJSON(content)) return;
    editor.current.txt.html('<pre>' + formatJson(content, callback) + '<pre/>');
  }, [content]);

  return <div id={id || 'jsonEditor'} ref={EElem} style={{ width: '100%' }} />;
};
Editor.defaultProps = {
  placholder: '请输入JSON格式字符串',
  checkJson: false,
};

export default Editor;

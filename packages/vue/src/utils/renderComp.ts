import { createVNode, render, Component } from 'vue';

export function renderComp (component: Component, props?: any) {
  const div = document.createElement('div');
  const options = Object.assign({ onClose () {
    document.body.removeChild(div);
  } }, props || {});
  const vnode = createVNode(component, options);
  document.body.appendChild(div);
  render(vnode, div);
};
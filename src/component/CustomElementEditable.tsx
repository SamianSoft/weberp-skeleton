import React, { useEffect, forwardRef, createRef } from 'react';

const replaceCaret = (el: HTMLElement) => {
  // Place the caret at the end of the element
  const target = document.createTextNode('');
  el.appendChild(target);
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el;
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    const sel = window.getSelection();
    if (sel !== null) {
      const range = document.createRange();
      range.setStart(target, target.nodeValue.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    if (el instanceof HTMLElement) el.focus();
  }
};
// type DivProps = React.ComponentPropsWithoutRef<'div'>;
/**
 * A simple component for an html element with editable contents.
 */
const CustomElementEditable = forwardRef((props: Props, ref: React.Ref<HTMLDivElement>) => {
  let lastHtml: string = props.html;
  const element: any = typeof ref === 'function' ? { current: null } : createRef<HTMLDivElement>();

  const getEl = () => (ref && typeof ref !== 'function' ? ref : element).current;

  const { html, ...rest } = props;
  useEffect(() => {
    const el = getEl();
    if (!el) return;

    // Perhaps React (whose VDOM gets outdated because we often prevent
    // rerendering) did not update the DOM. So we update it manually now.
    if (props.html !== el.innerHTML) {
      el.innerHTML = lastHtml = props.html;
    }
    replaceCaret(el);
    keyListener(el);
  }, []);
  const keyListener = el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        el.blur();
      }
    });
  };
  const emitChange = (originalEvt: React.SyntheticEvent<any>) => {
    const el = getEl();
    if (!el) return;

    const html = el.innerHTML;
    if (props.onChange && html !== lastHtml) {
      // Clone event with Object.assign to avoid
      // "Cannot assign to read only property 'target' of object"
      const evt = Object.assign({}, originalEvt, {
        target: {
          value: html,
        },
      });
      props.onChange(evt);
    }
    lastHtml = html;
  };

  /**
   * Select text in `div` when focus.
   * @function handleFocus
   * @param {HTMLEvent} event
   * @returns {void}
   */
  const handleFocus = (event): void => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(event.target);
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return React.createElement(
    'div',
    {
      ...props,
      ref: ref || element,
      onInput: emitChange,
      onBlur: props.onBlur || emitChange,
      onKeyUp: emitChange,
      onKeyDown: props.onKeyDown || emitChange,
      onFocus: handleFocus,
      contentEditable: !props.disabled,
      dangerouslySetInnerHTML: { __html: html },
    },
    props.children,
  );
});

export type CustomElementEditableType = React.SyntheticEvent<any, Event> & {
  target: { value: string };
};
type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;
type DivProps = Modify<
  JSX.IntrinsicElements['div'],
  { onChange: (event: CustomElementEditableType) => void }
>;

export interface Props extends DivProps {
  html: string;
  disabled?: boolean;
  className?: string;
  style?: object;
  innerRef?: React.RefObject<HTMLElement> | Function;
}

export default CustomElementEditable;

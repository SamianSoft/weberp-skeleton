import lodashIsEqual from 'lodash/isEqual';

export const isCtrlEnterPressed = event =>
  event && (event.key === 'Enter' || event.key === '\n') && event.ctrlKey === true;

export const isEnterPressed = event => event && (event.key === 'Enter' || event.key === '\n');

export const isDownPressed = event => event && event.key === 'ArrowDown';

export const isUpPressed = event => event && event.key === 'ArrowUp';

export const isEscapePressed = event =>
  event && (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27);

export const isObjectsDifferent = (values, record) => !lodashIsEqual(values, record);

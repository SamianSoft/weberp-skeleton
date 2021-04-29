import {
  isCtrlEnterPressed,
  isEnterPressed,
  isDownPressed,
  isUpPressed,
  isEscapePressed,
  isObjectsDifferent,
} from '../../helper/FormHelper';

describe('Which key is pressed?', () => {
  test('The `ctrl` key is pressed and `True` returns', () => {
    const key = isCtrlEnterPressed({ key: 'Enter', ctrlKey: true });
    expect(key).toBe(true);
  });

  test('The `enter` key is pressed and `True` returns', () => {
    const key = isEnterPressed({ key: 'Enter' });
    expect(key).toBe(true);
  });

  test('The `arrowDown` key is pressed and `True` returns', () => {
    const key = isDownPressed({ key: 'ArrowDown' });
    expect(key).toBe(true);
  });

  test('The `arrowUp` key is pressed and `True` returns', () => {
    const key = isUpPressed({ key: 'ArrowUp' });
    expect(key).toBe(true);
  });

  test('The `escape` key is pressed and `True` returns', () => {
    const key = isEscapePressed({ key: 'Escape', keyCode: 27 });
    expect(key).toBe(true);
  });

  test('The input of a different object and returns `False`', () => {
    const key = isObjectsDifferent({ a: 1 }, { a: 1 });
    expect(key).toBe(false);
  });
});

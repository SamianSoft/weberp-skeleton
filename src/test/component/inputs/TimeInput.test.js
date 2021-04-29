import React from 'react';
import { mount } from 'enzyme';

import { findInputfield } from '../../testUtils';
import DynamicInput from '../../../container/DynamicInput';
import NewSubmittableForm from '../../../component/NewSubmittableForm';
import TestContext from '../../TestContext';

/**
 * Create a component.
 * @function setupTimeInput
 * @param {object} dynamicInputProps
 * @param {object} newSubmittableFormProps
 * @returns {ReactWrapper}
 */
const setupTimeInput = (dynamicInputProps = {}, newSubmittableFormProps = {}) => {
  const defualtNewSubmittableFormProps = {
    record: {
      testfield: null,
    },
  };

  return mount(
    <TestContext>
      <NewSubmittableForm {...defualtNewSubmittableFormProps} {...newSubmittableFormProps}>
        <DynamicInput {...dynamicInputProps} />
      </NewSubmittableForm>
    </TestContext>,
  );
};

const dynamicInputProps = {
  source: 'testfield',
  field: {
    caption: 'timeTest',
    dataType: { erp: 'time', sql: 'time', simple: 'time', id: 41, defaultOperator: 'Between' },
    defaultValue: null,
    disabled: false,
    format: 'G18',
    hidden: false,
    id: 50711,
    maxLength: null,
    minValue: null,
    moduleName: 'webtest',
    name: 'timetest',
    parentField: null,
    relatedName: 'timetest',
    required: false,
    uiEnable: null,
    uiVisible: null,
    values: null,
  },
};

describe('checking time input render', () => {
  test('`DynamicInput` renders time input without error', () => {
    const wrapper = setupTimeInput(dynamicInputProps);
    const TimeInputComponent = findInputfield(wrapper, 'testfield');

    expect(TimeInputComponent.length).toBe(1);
  });
});

describe('checking time input onChange', () => {
  test('when prev value is null', () => {
    const wrapper = setupTimeInput(dynamicInputProps);
    const TimeInputComponent = findInputfield(wrapper, 'testfield');

    // mock on change
    const mockEvent = {
      target: {
        value: '1',
        selectionEnd: 1,
      },
    };
    TimeInputComponent.simulate('change', mockEvent);

    // update
    const reRenderedTimeInputComponent = findInputfield(wrapper, 'testfield');

    expect(reRenderedTimeInputComponent.props().value).toEqual('10:00');
  });

  test('when has prev value', () => {
    const wrapper = setupTimeInput(dynamicInputProps);
    const TimeInputComponent = findInputfield(wrapper, 'testfield');

    // mock on change
    const mockEvent = {
      target: {
        value: '12:00',
        selectionEnd: 2,
      },
    };
    TimeInputComponent.simulate('change', mockEvent);

    // update
    const reRenderedTimeInputComponent = findInputfield(wrapper, 'testfield');

    expect(reRenderedTimeInputComponent.props().value).toEqual('12:00');
  });

  test('when press backSpace', () => {
    const wrapper = setupTimeInput(dynamicInputProps);
    const TimeInputComponent = findInputfield(wrapper, 'testfield');

    // mock on change
    const mockEvent = {
      target: {
        value: '1:00', // because user press backSpace after colon and onchange function should handle it
        selectionEnd: 3,
      },
    };
    TimeInputComponent.simulate('change', mockEvent);

    // update
    const reRenderedTimeInputComponent = findInputfield(wrapper, 'testfield');

    expect(reRenderedTimeInputComponent.props().value).toEqual('10:00');
  });

  test('input should ignore NaN character', () => {
    const wrapper = setupTimeInput(dynamicInputProps);
    const TimeInputComponent = findInputfield(wrapper, 'testfield');

    // mock on change
    const mockEvent = {
      target: {
        value: '10A:00', // because entered a character and prev value in this position have not been deleted yet
        selectionEnd: 2,
      },
    };
    TimeInputComponent.simulate('change', mockEvent);

    // update
    const reRenderedTimeInputComponent = findInputfield(wrapper, 'testfield');

    expect(reRenderedTimeInputComponent.props().value).toEqual('10:00');
  });

  test('input should clear to default value', () => {
    const wrapper = setupTimeInput(dynamicInputProps);
    const TimeInputComponent = findInputfield(wrapper, 'testfield');

    // mock on change
    const mockEvent = {
      target: {
        value: '',
      },
    };
    TimeInputComponent.simulate('change', mockEvent);

    // update
    const reRenderedTimeInputComponent = findInputfield(wrapper, 'testfield');

    expect(reRenderedTimeInputComponent.props().value).toEqual('00:00');
  });
});

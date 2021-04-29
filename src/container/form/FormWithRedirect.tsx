import React from 'react';
import { useRef, useCallback, useMemo } from 'react';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useInitializeFormWithRecord, useWarnWhenUnsavedChanges, FormContext } from 'ra-core';
import lodashGet from 'lodash/get';

import getFormInitialValues from './getFormInitialValues';

interface FormWithRedirectInterface {
  debug: undefined;
  defaultValue?: any;
  decorators: undefined;
  destroyOnUnregister: undefined;
  form: undefined;
  initialValues: object;
  initialValuesEqual: undefined;
  keepDirtyOnReinitialize: boolean;
  mutators: any;
  saving: boolean;
  subscription: object;
  validate: undefined;
  validateOnBlur: undefined;
  version?: number;
  warnWhenUnsavedChanges?: boolean;
  editedFormData: object;
  resetEditedData: Function;
  changeFormValue: Function;
  customFormLevelValidation: Function;
  record: object;
  render: Function;
  save: Function;
  redirect: string | object | boolean; //TODO: redirect should be juuuuuuuuuust string.
}

/**
 * Wrapper around react-final-form's Form to handle redirection on submit,
 * legacy defaultValue prop, and array inputs.
 *
 * Requires a render function, just like react-final-form
 *
 * @example
 *
 * const SimpleForm = props => (
 *    <FormWithRedirect
 *        {...props}
 *        render={formProps => <SimpleFormView {...formProps} />}
 *    />
 * );
 *
 * @typedef {Object} Props the props you can use (other props are injected by Create or Edit)
 * @prop {Object} initialValues
 * @prop {Function} validate
 * @prop {Function} save
 * @prop {boolean} submitOnEnter
 * @prop {string} redirect
 *
 * @param {Prop} props
 */

function FormWithRedirect({
  debug,
  decorators,
  defaultValue,
  destroyOnUnregister,
  form,
  initialValues,
  initialValuesEqual,
  keepDirtyOnReinitialize = true,
  mutators = arrayMutators as any,
  record,
  render,
  save,
  saving,
  subscription = defaultSubscription,
  validate,
  validateOnBlur,
  version,
  warnWhenUnsavedChanges,
  customFormLevelValidation,
  editedFormData,
  changeFormValue,
  ...props
}: FormWithRedirectInterface) {
  const redirect = useRef(props.redirect);
  const onSave = useRef(save);

  // We don't use state here for two reasons:
  // 1. There no way to execute code only after the state has been updated
  // 2. We don't want the form to rerender when redirect is changed
  const setRedirect = newRedirect => {
    redirect.current = newRedirect;
  };

  /**
   * A form can have several Save buttons. In case the user clicks on
   * a Save button with a custom onSave handler, then on a second Save button
   * without custom onSave handler, the user expects the default save
   * handler (the one of the Form) to be called.
   * That's why the SaveButton onClick calls setOnSave() with no parameters
   * if it has no custom onSave, and why this function forces a default to
   * save.
   */
  const setOnSave = useCallback(
    newOnSave => {
      typeof newOnSave === 'function' ? (onSave.current = newOnSave) : (onSave.current = save);
    },
    [save],
  );

  const formContextValue: any = useMemo(() => ({ setOnSave }), [setOnSave]);

  const finalInitialValues = getFormInitialValues(initialValues, defaultValue, record);

  /**
   * this function should handle form submit and form level validation.
   * when user click on 'save' or 'saveAndNew' button , form call this function with form data.
   * it may have some parameters like 'isSaveAndNew' depend on where it has been used.
   * @function submit
   * @param {object|null} values form data
   * @param {object|null} params parameters
   * @param {object|null} customParams extra parameters (like 'isSaveAndNew')
   * @returns {void}
   */
  const submit = (values, params = {}, customParams = {}) => {
    customFormLevelValidation(values, false, changeFormValue).then(resault => {
      if (resault === true) {
        const { redirect, resetEditedData } = props;
        const finalRedirect = lodashGet(redirect, 'current', redirect ? redirect : false);

        const finallCustomParams: { resetEditedData?: Function } = customParams;
        if (typeof resetEditedData === 'function') {
          finallCustomParams.resetEditedData = props.resetEditedData;
        }
        onSave.current(editedFormData, finalRedirect, finallCustomParams);
      }
    });
  };

  return (
    <FormContext.Provider value={formContextValue}>
      <Form
        key={version} // support for refresh button
        debug={debug}
        decorators={decorators}
        destroyOnUnregister={destroyOnUnregister}
        form={form}
        initialValues={finalInitialValues}
        initialValuesEqual={initialValuesEqual}
        keepDirtyOnReinitialize={keepDirtyOnReinitialize}
        mutators={mutators} // necessary for ArrayInput
        onSubmit={submit}
        subscription={subscription} // don't redraw entire form each time one field changes
        validate={validate}
        validateOnBlur={validateOnBlur}
      >
        {formProps => (
          <FormView
            {...props}
            {...formProps}
            record={record}
            setRedirect={setRedirect}
            saving={formProps.submitting || saving}
            render={render}
            save={save}
            warnWhenUnsavedChanges={warnWhenUnsavedChanges}
            customSubmit={submit}
          />
        )}
      </Form>
    </FormContext.Provider>
  );
}

const defaultSubscription = {
  submitting: true,
  pristine: true,
  valid: true,
  invalid: true,
};

const FormView = ({ render, warnWhenUnsavedChanges, ...props }) => {
  // if record changes (after a getOne success or a refresh), the form must be updated
  useInitializeFormWithRecord(props.record);
  useWarnWhenUnsavedChanges(warnWhenUnsavedChanges);

  const { redirect, setRedirect, handleSubmit } = props;

  /**
   * We want to let developers define the redirection target from inside the form,
   * e.g. in a <SaveButton redirect="list" />.
   * This callback does two things: handle submit, and change the redirection target.
   * The actual redirection is done in save(), passed by the main controller.
   *
   * If the redirection target doesn't depend on the button clicked, it's a
   * better option to define it directly on the Form component. In that case,
   * using handleSubmit() instead of handleSubmitWithRedirect is fine.
   *
   * @example
   *
   * <Button onClick={() => handleSubmitWithRedirect('edit')}>
   *     Save and edit
   * </Button>
   */
  const handleSubmitWithRedirect = useCallback(
    (redirectTo = redirect) => {
      setRedirect(redirectTo);
      handleSubmit();
    },
    [setRedirect, redirect, handleSubmit],
  );

  return render({
    ...props,
    handleSubmitWithRedirect,
  });
};

export default FormWithRedirect;

import React, {
  FC,
  Children,
  CSSProperties,
  FormEvent,
  ReactElement,
  cloneElement,
  useEffect,
  useState,
  useCallback,
  useRef,
  memo,
} from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FormInput, Toolbar, CardContentInner } from 'react-admin';
import { FormSpy } from 'react-final-form';
import lodashGet from 'lodash/get';

import FormWithRedirect from '../container/form/FormWithRedirect';
import SubmittableFormInputRefHOC from '../container/SubmittableFormInputRefHOC';
import SubmittableFormDefaultValueHOC from '../container/SubmittableFormDefaultValueHOC';
import validationHOC from '../container/HOC/validationHOC';

import { isObjectsDifferent } from '../helper/FormHelper';
import { areTowObjectsEqual, isEmptyObject } from '../helper/DataHelper';

interface FormValues {
  [key: string]: any;
}

interface NewSubmittableFormProps {
  style: CSSProperties;
  record?: FormValues;
  setRedirect: (newRedirect: string) => void;
  save: (data: FormValues) => void;
  basePath?: string;
  children: ReactElement[];
  className?: string;
  handleSubmit: (event: FormEvent) => void;
  handleSubmitWithRedirect: (redirectTo?: string) => void;
  invalid?: boolean;
  margin?: string;
  pristine?: boolean;
  redirect?: string;
  resource?: string;
  form: any;
  saving?: boolean;
  submitOnEnter?: boolean;
  toolbar?: ReactElement;
  undoable?: boolean;
  variant?: string;
  getInputRef: (fieldName: string, ref: HTMLInputElement) => void;
  addToIgnoreFocusOnInit: (fieldName: string) => void;
  getRelationRef: (relationName: string, ref: HTMLInputElement) => void;
  updateDefaultValue: (name: string, value: any, skipIfNotExists: boolean) => void;
  initialValues: FormValues;
  onFormChange;
  focusOnNextInput: (currentName: string, submitFormCallback?: Function) => void;
  focusOnFirstInput: () => void;
  focusOnFirstInputAfterSubmit: () => void;
  allowSaveOnUnchangedForm: boolean;
  isDefaultMode: boolean;
  validationErrors: object[];
  customSubmit: Function;
  editedFormData: object;
  updateEditedFormData: Function;
  handleChangeFormValue: { current: Function };
}

const formSpySubscription = {
  values: true,
  valid: true,
};

const emptyFunc = () => {};

const NewSubmittableFormView: FC<NewSubmittableFormProps> = ({
  basePath,
  children,
  className,
  handleSubmit,
  handleSubmitWithRedirect,
  invalid,
  margin,
  pristine,
  redirect,
  resource,
  form, // form is in control of everything related to react-final-form
  saving,
  submitOnEnter,
  toolbar,
  undoable,
  variant,
  getInputRef = emptyFunc,
  addToIgnoreFocusOnInit = emptyFunc,
  getRelationRef = emptyFunc,
  updateDefaultValue = emptyFunc,
  onFormChange,
  focusOnNextInput = emptyFunc,
  focusOnFirstInput = emptyFunc,
  focusOnFirstInputAfterSubmit = emptyFunc,
  allowSaveOnUnchangedForm = false,
  record,
  isDefaultMode = true,
  validationErrors,
  initialValues,
  customSubmit,
  editedFormData,
  updateEditedFormData,
  handleChangeFormValue,
  ...rest
}) => {
  const formData: FormValues = form.getState().values;
  const [isFocusedOnce, setIsFocusedOnce] = useState<boolean>(false);
  const [isFormModified, setIsFormModified] = useState<boolean>(allowSaveOnUnchangedForm);

  // component did mount
  useEffect(() => {
    handleChangeFormValue.current = changeFormValue;
    setTimeout(() => {
      focusOnFirstInput();
      setIsFocusedOnce(true);
    }, 1000);
  }, []);

  // here is when saving is done and we need to focus on first input
  useEffect(() => {
    if (!isFocusedOnce || saving !== false) {
      return;
    }
    focusOnFirstInputAfterSubmit();
  }, [saving]);

  const triggerFormSubmit = useCallback(() => {
    handleSubmitWithRedirect(redirect);
  }, []);

  /**
   * Change `formData`.
   * @function changeFormValue
   * @param {string} target
   * @param {any} value
   * @param {boolean} allowChangeEdited
   * @returns {void}
   */
  const changeFormValue = useCallback(
    (target: string, value: any, allowChangeEdited = true) => {
      form.change(target, value);

      updateDefaultValue(target, value, false); // to prevent reset data if tab changed or component re rendred

      if (allowChangeEdited) {
        updateEditedFormData(target, value);
      }
    },
    [form],
  );

  const addToRelationArray = useCallback(
    (source: string, row: object) => {
      form.mutators.push(source, row);
    },
    [form],
  );

  const handleFocusOnNextInput = useCallback(
    (name: string) => {
      // if it's last input in form, will use the callback
      focusOnNextInput(name, () => {
        handleSubmitWithRedirect(redirect);
      });
    },
    [focusOnNextInput],
  );

  const handleFormSpyChange = useCallback(
    ({ values, valid }) => {
      onFormChange({ data: values, valid, form });

      // don't check after form is modified!
      if (!isFormModified) {
        setIsFormModified(isObjectsDifferent(values, record));
      }
    },
    [onFormChange, isFormModified, setIsFormModified],
  );

  return (
    <div className={classnames('simple-form', className)} {...sanitizeRestProps(rest as any)}>
      {!isDefaultMode &&
        toolbar &&
        React.cloneElement(toolbar, {
          basePath,
          handleSubmitWithRedirect,
          handleSubmit,
          invalid,
          pristine,
          record,
          formData,
          redirect,
          resource,
          saving,
          submitOnEnter,
          undoable,
          isFormModified,
          editedFormData,
          customSubmit,
        })}
      {onFormChange && (
        <FormSpy subscription={formSpySubscription} onChange={handleFormSpyChange} />
      )}
      <CardContentInner className="fieldContainer">
        {Children.map(children, input => {
          const FormInputComponent = (
            <FormInput
              basePath={basePath}
              input={input}
              record={record}
              formData={formData}
              resource={resource}
              variant={lodashGet(input, ['props', 'variant']) || variant}
              margin={lodashGet(input, ['props', 'margin']) || margin}
              getInputRef={getInputRef}
              addToIgnoreFocusOnInit={addToIgnoreFocusOnInit}
              getRelationRef={getRelationRef}
              focusOnNextInput={handleFocusOnNextInput}
              triggerFormSubmit={triggerFormSubmit}
              updateDefaultValue={updateDefaultValue}
              changeFormValue={changeFormValue}
              addToRelationArray={addToRelationArray}
            />
          );
          return input
            ? cloneElement(FormInputComponent, { validationErrors, initialValues })
            : null;
        })}
      </CardContentInner>
      {isDefaultMode &&
        toolbar &&
        React.cloneElement(toolbar, {
          basePath,
          handleSubmitWithRedirect,
          handleSubmit,
          invalid,
          pristine,
          record,
          formData,
          redirect,
          resource,
          saving,
          submitOnEnter,
          undoable,
          isFormModified,
          customSubmit,
          editedFormData,
        })}
    </div>
  );
};

NewSubmittableFormView.defaultProps = {
  submitOnEnter: false,
  toolbar: <Toolbar />,
};

const sanitizeRestProps = ({
  anyTouched,
  array,
  asyncBlurFields,
  asyncValidate,
  asyncValidating,
  autofill,
  blur,
  change,
  clearAsyncError,
  clearFields,
  clearSubmit,
  clearSubmitErrors,
  destroy,
  dirty,
  dirtyFields,
  dirtyFieldsSinceLastSubmit,
  dirtySinceLastSubmit,
  dispatch,
  form,
  handleSubmit,
  hasSubmitErrors,
  hasValidationErrors,
  initialize,
  initialized,
  initialValues,
  pristine,
  pure,
  redirect,
  reset,
  resetSection,
  save,
  setRedirect,
  submit,
  submitError,
  submitErrors,
  submitAsSideEffect,
  submitFailed,
  submitSucceeded,
  submitting,
  touch,
  translate,
  triggerSubmit,
  undoable,
  untouch,
  valid,
  validate,
  validating,
  _reduxForm,
  ...props
}) => props;

const NewSubmittableForm = props => {
  const { formData, validateAll, initialValues, prevFormData, overrideParams } = props;

  const editedFormData = useRef(
    overrideParams && !isEmptyObject(overrideParams) ? overrideParams : {},
  );

  const handleChangeFormValue = useRef(() => {});

  /**
   * it will receive a key and a value and add or update this key to the editedFormData object
   * @function updateEditedFormData
   * @param {string} name
   * @param {string|number|object|Array} value
   * @returns {void}
   */
  const updateEditedFormData = (
    name: string,
    value: string | number | object | Array<any>,
  ): void => {
    editedFormData.current[name] = value;
  };

  /**
   * it will reset edited data to default values
   * @function resetEditedData
   * @returns {void}
   */
  const resetEditedData = () => {
    editedFormData.current = overrideParams && !isEmptyObject(overrideParams) ? overrideParams : {};
  };

  return (
    <FormWithRedirect
      {...props}
      subscription={formSpySubscription}
      validate={
        areTowObjectsEqual(formData, prevFormData)
          ? undefined
          : () => validateAll(formData, true, handleChangeFormValue.current)
      }
      customFormLevelValidation={validateAll}
      editedFormData={editedFormData.current}
      resetEditedData={resetEditedData}
      changeFormValue={handleChangeFormValue.current}
      render={formProps => (
        <NewSubmittableFormView
          {...formProps}
          handleChangeFormValue={handleChangeFormValue}
          initialValues={initialValues}
          updateEditedFormData={updateEditedFormData}
          editedFormData={editedFormData.current}
        />
      )}
    />
  );
};

NewSubmittableForm.propTypes = {
  children: PropTypes.node,
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]), // @deprecated
  initialValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  record: PropTypes.object,
  redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.func]),
  save: PropTypes.func,
  saving: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  submitOnEnter: PropTypes.bool,
  undoable: PropTypes.bool,
  validate: PropTypes.func,
  version: PropTypes.number,
  onFormChange: PropTypes.func,
};

export default compose(
  SubmittableFormInputRefHOC,
  SubmittableFormDefaultValueHOC,
  validationHOC,
)(memo(NewSubmittableForm));

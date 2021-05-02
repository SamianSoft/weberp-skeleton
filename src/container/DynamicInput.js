/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import lodashGet from 'lodash/get';
import lodashFind from 'lodash/find';
import lodashIsEqual from 'lodash/isEqual';
import classNames from 'classnames';
import lodashDebounce from 'lodash/debounce';
import { useLocale } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

import TextInput from '../component/input/TextInput';
import {
  isEnterPressed,
  isCtrlEnterPressed,
  isDownPressed,
  isUpPressed,
} from '../helper/FormHelper';

import { BOOLEAN_FIELD, DATE_FIELD } from '../helper/InputHelper';
import { getTypeByField } from '../helper/NewInputHelper';
import { isEmpty, isEmptyObject, clone } from '../helper/DataHelper';
import { getDropDownListFromState } from '../helper/MetaHelper';
import AutocompleteInput from '../component/input/AutocompleteInput';

const useStyles = makeStyles(theme => ({
  inputStyle: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    '& input': {
      padding: 13,
      lineHeight: 0,
    },
    '& label': {
      transform: 'scale(1) translate(14px, 16px)',
      fontSize: 13,
    },
    '& div': {
      fontSize: 13,
      height: '100%',
    },
    margin: 0,
    [theme.breakpoints.down('md')]: {
      '& label': {
        transform: 'scale(1) translate(14px, 12px)',
      },
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
      '& input': {
        padding: 7,
        lineHeight: 0,
      },
      '& label': {
        transform: 'scale(1) translate(14px, 10px)',
        fontSize: 10,
      },
      '& div': {
        fontSize: 10,
      },
    },
  },

  longInputStyle: {
    width: '100%',
    height: '100%',
    '& > div': {
      padding: 13,
    },
  },

  longTextInputStyleNoLabel: {
    borderRadius: 4,
    width: '100%',
    height: '100%',
    '& > div': {
      padding: 10,
    },
  },

  booleanStyle: {
    height: '100%',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: '0 3px',
    margin: 0,
    width: '100%',
    '& label': {
      height: '100%',
      margin: 0,
      '& span': {
        fontSize: 13,
      },
    },
    '&[data-focus=false]:hover': {
      border: `1px solid`,
    },
    '&[data-focus=true]': {
      border: `1px solid ${theme.palette.primary.main}`,
      boxShadow: `inset 0px 0px 0px 1px ${theme.palette.primary.main}`,
    },
    '&[data-blur=true]': {
      boxShadow: 'none',
      border: '1px solid rgba(0, 0, 0, 0.23)',
    },
    position: 'relative',
  },

  inputStyleNoLabel: {
    borderRadius: 4,
    width: '100%',
    height: '100%',
    '&[data-disabled-for-style=true]': {
      backgroundColor: theme.palette.grey[300],
    },
    '& input': {
      padding: 10,
      lineHeight: 0,
    },
  },

  inputStylePuzzleForm: {
    margin: '7px 3px 0',
    '&[data-disabled-for-style=true]': {
      backgroundColor: theme.palette.grey[300],
    },
  },
}));

const TRIGGER_SUBMIT_DEBOUNCE = 200;
const defaultGlobalParameters = {};

const DynamicInput = props => {
  const [myRef, setMyRef] = useState(null);

  const {
    dispatch, // get it out
    changeFormValue,
    addToRelationArray,
    field,
    source,
    resource,
    filterMode,
    disableDropdownQuickCreate,
    disableDropdownSearchPopup,
    defaultOperator,
    onlyEqualCondition,
    getInputRef, // get it out
    triggerFormSubmit,
    noLabel,
    label,
    focusOnNextInput,
    updateDefaultValue, // get it out
    addToIgnoreFocusOnInit, // get it out
    getRelationRef, // it should be used by "RelationFormIterator"
    recordPath,
    inputInPuzzleForm,
    inputInQuickCreateDialog,
    globalParameters,
    alwaysOn,
    allowEmpty,
    changeFocusOnAnotherRow,
    relationResource,
    relationSource,
    relationInfo,
    metaData,
    relationPath,
    formData,
    dropdownState,
    findDropdownData,
    validationErrors,
    initialValues,
    viewVersion,
    clearValidationErrorForThisField,
    isCreateMode,
    version,
    updateEditedFormData,
    additionalProps,
    ...rest
  } = props;

  const locale = useLocale();
  const classes = useStyles();

  const [uiVisibled, setUiVisibled] = useState(true);
  const [uiEnabled, setUiEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedDropDownValue, setRelatedDropDownValue] = useState({});
  const [prevInitialValues, setPrevInitialValues] = useState(initialValues);
  const [prevVersion, setPrevVersion] = useState(0);

  useEffect(() => {
    // for handle initial values
    const { name } = field;
    const computedVersion = version ? version : viewVersion;
    const tabChangeCondition =
      prevVersion !== computedVersion &&
      prevInitialValues[name] === null &&
      initialValues[name] === null;

    if (inputInPuzzleForm || inputInQuickCreateDialog || (isCreateMode && computedVersion)) {
      if (!lodashIsEqual(prevInitialValues, initialValues) || tabChangeCondition) {
        changeFormValue(
          name,
          !isEmptyObject(initialValues) && !isEmpty(initialValues[name])
            ? initialValues[name]
            : getTypeByField(field) === BOOLEAN_FIELD
            ? false
            : null,
          getTypeByField(field) === DATE_FIELD ? true : false,
        );
        setPrevInitialValues(initialValues);
      }
      setPrevVersion(computedVersion);
    }
  }, [initialValues, version]);

  // component did mount
  useEffect(() => {
    const {
      defaultValue,
      name,
      keepFocusAfterSubmit,
      keepValueAfterSubmit,
      globalParameter,
    } = field;

    if (!isEmpty(globalParameter)) {
      updateDefaultValue(name, globalParameters[globalParameter.toLowerCase()]);
    }

    if (!isEmpty(defaultValue) || keepValueAfterSubmit) {
      const isBoolean = getTypeByField(field) === BOOLEAN_FIELD;

      // because boolean fields default value is '1' or '0' in field object !
      // this variable below turn the value to true or false if it was BOOLEAN_FIELD.
      let adoptedDefaultValue = defaultValue;

      if (isBoolean && defaultValue == '0') {
        adoptedDefaultValue = false;
      } else if (isBoolean && defaultValue == '1') {
        adoptedDefaultValue = true;
      } else {
        // if it wasn't a BOOLEAN_FIELD
        adoptedDefaultValue = defaultValue;
      }

      updateDefaultValue(
        name,
        initialValues && (initialValues[name] || initialValues[name] === false)
          ? initialValues[name]
          : adoptedDefaultValue,
      );
    }

    if (!keepFocusAfterSubmit && typeof addToIgnoreFocusOnInit === 'function') {
      addToIgnoreFocusOnInit(name);
    }
  }, []);

  useEffect(() => {
    if (field.uiEnable) getRelatedDropdownValue('uiEnable');
    if (field.uiVisible) getRelatedDropdownValue('uiVisible');
  }, [formData, dropdownState]);

  useEffect(() => {
    if (field.uiEnable || field.uiVisible) checkUi();
  }, [formData, relatedDropDownValue, dropdownState]);

  /**
   * check `field` and run `javascriptUiEnable` and `javascriptUiVisible` beased on `formData` and `relatedDropDownValue` and then ran `setUiVisibled` or `setUiEnabled`
   * @returns {void}
   */
  const checkUi = useCallback(() => {
    const { uiVisible, uiEnable, javaScriptUiVisible, javaScriptUiEnable } = field;

    if (uiVisible && uiVisible.length && javaScriptUiVisible) {
      if (javaScriptUiVisible.indexOf('return') !== -1) {
        if (field.uiVisible[0][1] !== '' && relatedDropDownValue) {
          try {
            const execute = new Function('relatedDropDownValue', `${javaScriptUiVisible}`);
            setUiVisibled(execute(clone(relatedDropDownValue)));
          } catch (error) {
            console.log('javaScriptUiVisible error on %s', field.name, error);
          }
        } else if (field.uiVisible[0][1] === '' && formData && !isEmptyObject(formData)) {
          try {
            const execute = new Function('formData', `${javaScriptUiVisible}`);
            setUiVisibled(execute(clone(formData)));
          } catch (error) {
            console.log('javaScriptUiVisible error on %s', field.name, error);
          }
        }
      }
    }

    if (uiEnable && uiEnable.length && javaScriptUiEnable) {
      if (javaScriptUiEnable.indexOf('return') !== -1) {
        if (field.uiEnable[0][1] !== '' && relatedDropDownValue) {
          try {
            const execute = new Function('relatedDropDownValue', `${javaScriptUiEnable}`);
            setUiEnabled(execute(clone(relatedDropDownValue)));
          } catch (error) {
            console.log('javaScriptUiEnable error on %s', field.name, error);
          }
        } else if (field.uiEnable[0][1] === '' && formData && !isEmptyObject(formData)) {
          try {
            const execute = new Function('formData', `${javaScriptUiEnable}`);
            setUiEnabled(!!execute(clone(formData)));
          } catch (error) {
            console.log('javaScriptUiEnable error on %s', field.name, error);
          }
        }
      }
    }
  }, [field, formData, relatedDropDownValue]);

  /**
   * check field and get dropdown data from redux state
   * @param {String} uiCheckType
   * @returns {void}
   */
  const getRelatedDropdownValue = useCallback(
    uiCheckType => {
      if (!isLoading && dropdownState === undefined && isEmptyObject(relatedDropDownValue)) {
        // Fetch dropdwon data
        const fieldName = field[uiCheckType][0][0];
        const dropdownMeta = lodashFind(metaData.fields, { name: fieldName }).dropdown;
        setIsLoading(true);
      } else {
        // Use dropdwon data which is availabe in Redux State
        setIsLoading(false);
        const fieldName = field[uiCheckType][0][0];
        const dropName = field[uiCheckType][0][1];
        const selectedDropColId = formData[fieldName] !== null ? +formData[fieldName] : null;
        if (selectedDropColId !== null) {
          const dropdownSelectedCol = lodashFind(dropdownState, {
            id: selectedDropColId,
          });

          if (dropdownSelectedCol) {
            setRelatedDropDownValue({ [dropName]: dropdownSelectedCol[dropName] });
          }
        } else {
          setRelatedDropDownValue({});
        }
      }
    },
    [dropdownState, formData],
  );

  const triggerSubmit = lodashDebounce(() => {
    const { triggerFormSubmit } = props;

    if (typeof triggerFormSubmit === 'function') {
      triggerFormSubmit();
    } else {
      console.log('triggerFormSubmit is not defined, so can not trigger submit');
    }
  }, TRIGGER_SUBMIT_DEBOUNCE);

  const triggerGoToNext = () => {
    const { focusOnNextInput, field } = props;

    if (typeof focusOnNextInput === 'function') {
      focusOnNextInput(field.name);
    }
  };

  const triggerChangeFocusOnAnotherRow = isMoveToNext => {
    const { changeFocusOnAnotherRow, field } = props;

    if (typeof changeFocusOnAnotherRow === 'function') {
      changeFocusOnAnotherRow(field.name, isMoveToNext);
    }
  };

  const handleKeyDown = event => {
    // if form is submitted
    if (isCtrlEnterPressed(event)) {
      event.preventDefault();
      event.stopPropagation();

      triggerSubmit();
    }
    // if wants to go to next element
    else if (isEnterPressed(event)) {
      event.preventDefault();
      event.stopPropagation();

      triggerGoToNext();
    } else if (isDownPressed(event)) {
      event.preventDefault();
      event.stopPropagation();

      triggerChangeFocusOnAnotherRow(true);
    } else if (isUpPressed(event)) {
      event.preventDefault();
      event.stopPropagation();

      triggerChangeFocusOnAnotherRow(false);
    }
  };

  /**
   * this function will recive a new value and also extract the name of field from props
   * then handle the form change value and update form value , default value and editted foem data.
   * @function internalOnChange
   * @param {string|number|object|Array} value
   * @param {string|number|object|Array} previousValue
   * @param {string} fieldName
   * @returns {void}
   */
  const internalOnChange = (value, previousValue, fieldName) => {
    const { keepValueAfterSubmit, name } = field;
    let tempValue = value;

    // eslint-disable-next-line no-prototype-builtins
    if (value && typeof value === 'object' && value.hasOwnProperty('nativeEvent')) {
      tempValue = value.target.checked; // only BooleanInput
    }

    // if value should be kept when form is reset, keep value in default value
    if (keepValueAfterSubmit) {
      updateDefaultValue(name, tempValue);
    }

    if (typeof changeFormValue === 'function') {
      changeFormValue(name, tempValue);
    }

    // for validation in relation
    if (typeof clearValidationErrorForThisField === 'function') {
      clearValidationErrorForThisField(name);
    }
  };

  const isFocusable = () => {
    const { field, disabled } = props;
    return !disabled && !field.readOnly && !field.disabled && uiEnabled;
  };

  const getDynamicInputRef = ref => {
    const { field, getInputRef = () => {} } = props;

    setMyRef(ref);

    if (isFocusable()) {
      getInputRef(field.name, ref, resource);
    }
  };

  const handleClick = () => {
    if (myRef && typeof myRef.select === 'function') {
      myRef.select();
    }
  };

  const isInputFocusable = isFocusable();
  let customError = null;
  // TODO refactor to seprate function
  if (validationErrors && validationErrors.length) {
    const selectedError = validationErrors.filter(err => err.id === field.id);
    if (selectedError && selectedError.length) {
      customError = selectedError[0].message;
    }
  }

  const inputProps = {
    'data-test-field-name': field.name,
    'data-test-max-value': field.maxValue,
    'data-test-min-value': field.minValue,
    'data-test-max-length': field.maxLength ? field.maxLength : 'dosent_matter',
    'data-test-field-type': getTypeByField(field),
    'data-test-field-hidden': field.hidden ? field.hidden : null,
    field,
    formData,
    source,
    resource,
    label: !noLabel ? label || lodashGet(field, ['translatedCaption', locale], field.caption) : '',
    // required: field.required, // validation will handle required
    disabled: !isInputFocusable,
    options: {
      inputProps: {
        disabled: !isInputFocusable,
      },
      inputRef: getDynamicInputRef,
      onKeyDown: isInputFocusable ? handleKeyDown : undefined,
    },
    onChange: internalOnChange,
    visibleClass: uiVisibled && !field.hidden ? '' : 'displayNone',
    customError: customError,
    viewVersion,
  };

  if (field.widthPercent) {
    inputProps.style = { width: `${field.widthPercent}%` };
  }

  let inputComponent;

  switch (getTypeByField(field)) {
    case 'multiselect': {
      inputComponent = (
        <AutocompleteInput field={field} {...rest} {...inputProps} onClick={handleClick} />
      );
      break;
    }
    default:
      inputComponent = (
        <TextInput
          {...rest}
          {...inputProps}
          className={classNames(
            classes.inputStyle,
            inputInPuzzleForm
              ? classes.inputStylePuzzleForm
              : noLabel
              ? classes.inputStyleNoLabel
              : null,
          )}
          onClick={handleClick}
        />
      );
  }

  return inputComponent;
};

DynamicInput.defaultProps = {
  updateDefaultValue: () => {},
  addToIgnoreFocusOnInit: () => {},
};

DynamicInput.propTypes = {
  field: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired, // must be defined
  triggerFormSubmit: PropTypes.func,
  changeFormValue: PropTypes.func,
  filterMode: PropTypes.bool,
  disableDropdownQuickCreate: PropTypes.bool,
  disableDropdownSearchPopup: PropTypes.bool,
  noLabel: PropTypes.bool,
  inputInPuzzleForm: PropTypes.bool,
  defaultOperator: PropTypes.any,
  onlyEqualCondition: PropTypes.any,
  getRelationRef: PropTypes.func,
  updateDefaultValue: PropTypes.func,
  addToIgnoreFocusOnInit: PropTypes.func,
  focusOnNextInput: PropTypes.func,
  changeFocusOnAnotherRow: PropTypes.func,
  relationResource: PropTypes.string,
  label: PropTypes.string,
  validationErrors: PropTypes.object,
  initialValues: PropTypes.object,
  clearValidationErrorForThisField: PropTypes.func,
  additionalProps: PropTypes.object,
};

const mapStateToProps = (state, props) => {
  const extraProps = {
    globalParameters: lodashGet(state, 'profile.globalParameters', defaultGlobalParameters),
    dropdownState: {},
    viewVersion: state.admin.ui.viewVersion,
  };

  const { field, metaData } = props;
  if (
    field.uiVisible &&
    field.uiVisible &&
    field.uiVisible.length &&
    field.uiVisible[0].length === 3 &&
    field.uiVisible[0][1] !== ''
  ) {
    extraProps.dropdownState = getDropDownListFromState(field, 'uiVisible', state, metaData);
  } else if (
    field.uiEnable &&
    field.uiEnable &&
    field.uiEnable.length &&
    field.uiEnable[0].length === 3 &&
    field.uiEnable[0][1] !== ''
  ) {
    extraProps.dropdownState = getDropDownListFromState(field, 'uiEnable', state, metaData);
  }
  return extraProps;
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DynamicInput);

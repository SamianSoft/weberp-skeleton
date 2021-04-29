import React, { FC, useState, useEffect, useRef } from 'react';
import { showNotification, useTranslate, useLocale } from 'react-admin';
import { connect } from 'react-redux';
import { areTowObjectsEqual, isEmptyObject } from '../../helper/DataHelper';
import { ValidationErrors } from '../../helper/Types';
import { checkFieldValidation, handleApiErrors } from '../../helper/ValidationHelper';

interface UnConnectedValidationInterface {
  showNotification: Function;
  fromQuickCreateDialog: boolean;
  metaData: object;
  resource: string;
  relationResource: string;
  apiError: object;
  setApiError: Function;
  disableValidationErrorNotification: boolean;
  [x: string]: any;
}
interface HandleError {
  id: number;
  type: string;
  validValue?: number | string | null;
  tabTitle: string;
  tabId: number | string;
}

const UnConnectedValidation: FC<UnConnectedValidationInterface> = props => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors[]>([]);
  const prevFormData = useRef();

  const {
    component: ChildComponent,
    validationFieldList = [],
    showNotification,
    fromQuickCreateDialog,
    metaData,
    resource,
    relationResource,
    apiError,
    setApiError,
    disableValidationErrorNotification,
  } = props;

  const translate = useTranslate();
  const locale = useLocale();

  useEffect(() => {
    if (apiError && !isEmptyObject(apiError) && apiError !== null) {
      // it will trigger when api returns an error in validation
      apiErrorHandler(apiError);
    }
  }, [apiError]);

  /**
   * this function will call from useEffect in every change in apiError prop.
   * it includes an object with api response and request id.
   * it wil call the handleApiErrors function to handle the errors and set state main error state.
   * @function apiErrorHandler
   * @param {Object | null} apiError
   * @returns {void}
   */
  const apiErrorHandler = apiError => {
    const cumputedValidationErrors = handleApiErrors(
      metaData,
      validationFieldList,
      apiError,
      showNotification,
      translate,
      locale,
    );

    // fill the state with new Errors
    setValidationErrors(
      cumputedValidationErrors.preparedValidationErrors
        ? cumputedValidationErrors.preparedValidationErrors
        : [],
    );

    // reset the Api error state for prevent show errors when user reOpen this page
    setApiError(null);
  };

  /**
   *  this function receive an array of errors and separate them by their types to make right message showing to user and also
   *  check if error is for an specefic field or not and setState validationErrors with new array of errors.
   *  @function handleErrors
   *  @param {Array | null} errors an array of errors or empty array if no error.
   *  @param {number | string} speceficFieldId id of specefic item to handle validation should apply on one field of all fields.
   *  @returns {Array | null} preparedValidatingErrors or null if no error.
   */
  const handleErrors = (
    errors: HandleError[],
    speceficFieldId: number | string,
  ): ValidationErrors[] | null => {
    const preparedValidatingErrors: ValidationErrors[] = [];
    const speceficField = !!speceficFieldId;

    if (errors && errors.length) {
      errors.forEach(error => {
        const { id, type, validValue, tabTitle, tabId } = error;

        // to make right error message.
        switch (type) {
          // TODO: id , tabTitle , tabID should not repeat
          case 'required':
            preparedValidatingErrors.push({
              id: id,
              message: translate('ra.validation.required'),
              tabTitle: tabTitle,
              tabId: tabId,
            });
            break;

          case 'maxLength':
            preparedValidatingErrors.push({
              id: id,
              message: translate('ra.validation.maxLength', { max: validValue }),
              tabTitle: tabTitle,
              tabId: tabId,
            });
            break;

          case 'minValue':
            preparedValidatingErrors.push({
              id: id,
              message: translate('ra.validation.minValue', { min: validValue }),
              tabTitle: tabTitle,
              tabId: tabId,
            });
            break;

          case 'maxValue':
            preparedValidatingErrors.push({
              id: id,
              message: translate('ra.validation.maxValue', { max: validValue }),
              tabTitle: tabTitle,
              tabId: tabId,
            });
            break;

          case 'NaN':
            preparedValidatingErrors.push({
              id: id,
              message: translate('ra.validation.number'),
              tabTitle: tabTitle,
              tabId: tabId,
            });
            break;

          case 'async':
            preparedValidatingErrors.push({
              id: id,
              message: String(validValue),
              tabTitle: tabTitle,
              tabId: tabId,
            });
            break;

          case 'url':
            preparedValidatingErrors.push({
              id: id,
              message: translate('ra.validation.correctUrl'),
              tabTitle: tabTitle,
              tabId: tabId,
            });
            break;

          default:
            console.log('unknown validation error');
            break;
        }
      });

      if (speceficField) {
        const newError =
          preparedValidatingErrors && preparedValidatingErrors[0]
            ? preparedValidatingErrors[0] // because in this setuation always has only one error in it.
            : null;

        if (newError) {
          const allPrevErrors = validationErrors;

          // check if error exist in validationErrors state or not
          const isExist =
            allPrevErrors.length > 0
              ? allPrevErrors.filter(err => err.id === newError.id).length > 0
              : false;

          if (isExist) {
            // should only change error message and update state.
            allPrevErrors.forEach(err => {
              if (err.id === newError.id) {
                err.message = newError.message;
              }
            });

            setValidationErrors(allPrevErrors);
          } else {
            // add new error to validationErrors state.
            allPrevErrors.push(newError);
            setValidationErrors(allPrevErrors);
          }
        }
      } else {
        // set all new errors to validationErrors state when it wasn't limited to an specefic field.
        setValidationErrors(preparedValidatingErrors);
      }

      return preparedValidatingErrors;
    } else {
      if (speceficField) {
        // should remove the field error from validationErrors state.
        const newValidationErrorList =
          validationErrors && validationErrors.length
            ? validationErrors.filter(err => err.id !== speceficFieldId)
            : [];
        setValidationErrors(newValidationErrorList);

        return null;
      } else {
        return null;
      }
    }
  };

  /**
   *  this function receive two objects with an only one or zero diffrent value and compare them to retun name of key of
   *  the value has been changed in second object .
   *  @function findDiffrentKeyFromTowObject
   *  @param {Object | null} formData prev form data
   *  @param {Object | null} prevFormData next form data
   *  @returns {string | undefined} diffrent key
   */
  const findDiffrentKeyFromTowObject = (formData, prevFormData) => {
    let diffrentKey;

    if (!areTowObjectsEqual(prevFormData, formData)) {
      const prevKeys = isEmptyObject(prevFormData) ? [] : Object.keys(prevFormData);
      const newKeys = isEmptyObject(formData) ? [] : Object.keys(formData);

      // if first object was empty
      if ((!prevKeys || prevKeys.length < 1) && newKeys && newKeys.length > 0) {
        diffrentKey = newKeys[0];
      } else if (prevKeys.length !== newKeys.length) {
        // if second object has new key
        newKeys.forEach(newKey => {
          if (!prevKeys.includes(newKey)) {
            diffrentKey = newKey;
          }
        });
      } else {
        // if keys was equal but values was diffrent
        newKeys.forEach(newKey => {
          if (prevFormData[newKey] !== formData[newKey]) {
            diffrentKey = newKey;
          }
        });
      }
    }
    return diffrentKey;
  };

  /**
   *  this function will receve tow objects of form data. compair them to find new key that has been changed.
   *  call the validate function with form data. make a correct message for notification.
   *  show notification if need and returns the resault of validation.
   *  @function validateAll
   *  @param {Object | null} values prev form data
   *  @param {Boolean | undefined} singleFieldValidation next form data
   *  @returns {Promise | Boolean} validation conclusion was ok or not
   */
  const validateAll = (values, singleFieldValidation, changeFormValue) => {
    let speceficField;

    if (singleFieldValidation) {
      speceficField = findDiffrentKeyFromTowObject(values, prevFormData.current);
      prevFormData.current = values;
    } else {
      speceficField = 'submit';
    }

    if (validationFieldList && validationFieldList.length) {
      return checkFieldValidation(
        values,
        speceficField === 'submit'
          ? validationFieldList
          : validationFieldList.filter(field => field.name === speceficField),
        handleErrors,
        speceficField !== 'submit',
        locale,
        metaData,
        resource,
        relationResource,
        changeFormValue,
      )
        .then(result => {
          if (result && result.length) {
            const allTabTitles = Array.from(
              result.map(err =>
                err['tabTitle'] ? err['tabTitle'] : translate('customValidation.unknownTab'),
              ),
            );
            const distinctTabTitles: any = [];

            // for prevent repeat a tab title in notification (toast).
            allTabTitles.forEach(tabTitle => {
              if (!distinctTabTitles.includes(tabTitle)) {
                distinctTabTitles.push(tabTitle);
              }
            });

            const tabNamesWithError = distinctTabTitles.join(
              ' ' + translate('customValidation.seprator') + ' ',
            );

            // notification action dispaches only when this function called from form send button.
            if (!singleFieldValidation && !disableValidationErrorNotification) {
              showNotification(
                translate('customValidation.validationErrorOnTab', { tabName: tabNamesWithError }),
                'error',
                {
                  forceSnackbar: true,
                  fromQuickCreateDialog: fromQuickCreateDialog, // to render notification in <portal/> with id: customSnackContainer
                },
              );
            }
            return singleFieldValidation ? 'Error' : false;
          } else {
            return true;
          }
        })
        .catch(error => {
          console.log('checkFieldValidation error: ', error);
          return true;
        });
    } else {
      return Promise.resolve(true);
    }
  };

  return (
    <ChildComponent
      {...props}
      validateAll={validateAll}
      prevFormData={prevFormData.current}
      validationErrors={validationErrors}
    />
  );
};

const mapDispatchToProps = {
  showNotification,
};

const ConnectedValidation = connect(null, mapDispatchToProps)(UnConnectedValidation);

export default validationHOC => props => (
  <ConnectedValidation {...props} component={validationHOC} />
);

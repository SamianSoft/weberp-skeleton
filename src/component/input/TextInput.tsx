import React, { FC, SyntheticEvent } from 'react';
import { TextField, makeStyles, Theme } from '@material-ui/core';
import { useInput, useTranslate } from 'react-admin';
import lodashGet from 'lodash/get';

import sanitizeRestProps from './sanitizeRestProps';
import { convertDigitsToEnglish } from '../../helper/NumberHelper';
import { FieldType } from '../../helper/Types';

interface InputProps {
  onBlur: Function;
  onFocus: Function;
  onChange: Function;
}

interface MetaProps {
  touched: boolean;
  error: string;
}

interface TextInputInterface {
  className: string;
  input: InputProps;
  label: string;
  meta: MetaProps;
  name: string;
  onBlur: Function;
  onChange: Function;
  onFocus: Function;
  options: object;
  resource: string;
  source: string;
  step: string | number;
  validate: Function | Function[];
  formName: string;
  textAlign: string;
  basePath: string;
  record: object;
  disabled: boolean;
  allowEmpty: boolean;
  field: FieldType;
  visibleClass: string;
  customError?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  input: {
    '&[disabled]': {
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.grey[700],
    },
  },

  disabled: {
    backgroundColor: theme.palette.grey[300],
  },

  error: {
    '& + p': {
      position: 'absolute',
      right: 0,
    },
  },
}));

const TextInput: FC<TextInputInterface> = props => {
  const {
    className,
    basePath,
    record,
    allowEmpty, // just get it out
    disabled,
    options = {},
    visibleClass,
    field,
    customError,
    ...rest
  } = props;
  const classes = useStyles();
  const translate = useTranslate();

  const {
    input: { name, onChange, onBlur, onFocus, value },
    meta: { touched, error },
  } = useInput(props);

  const handleBlur = (event: SyntheticEvent) => {
    onBlur(event);
    props.onBlur(event);
  };

  const handleFocus = (event: SyntheticEvent) => {
    onFocus(event);
    props.onFocus(event);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = convertDigitsToEnglish(event.target.value);

    onChange(userInput);
    props.onChange(userInput);
  };

  const hasError = !!(touched && error);

  return (
    <TextField
      {...sanitizeRestProps(rest as any)}
      {...options}
      value={value}
      name={name}
      error={!!customError || hasError}
      helperText={
        customError
          ? customError
          : hasError
          ? translate(lodashGet(error, 'message', error))
          : undefined
      }
      required={field.required}
      margin="normal"
      className={`${visibleClass} ${className}`}
      variant="outlined"
      InputProps={{
        classes: {
          error: classes.error,
          input: classes.input,
          disabled: classes.disabled,
        },
      }}
      inputProps={{
        'data-test-input-name': props.source,
        'data-test-input-field-priority': field.priority,
        maxLength: field.maxLength,
      }}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onChange={handleChange}
      disabled={disabled}
      data-test="inputContainerTextField"
      data-test-has-error={!!customError || hasError}
    />
  );
};

TextInput.defaultProps = {
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {},
  options: {},
};

export default TextInput;

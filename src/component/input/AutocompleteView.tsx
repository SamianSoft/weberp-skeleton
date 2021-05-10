/* eslint-disable no-use-before-define */
import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonBase, IconButton, Tooltip, Typography } from '@material-ui/core';
import { FieldType } from '../../helper/Types';
import InputLabelComponent from './InputLabelComponent';
import ClearIcon from '@material-ui/icons/Clear';
import { themeParams } from '../../core/themeProvider';
const useStyles = makeStyles(theme => ({
  rootDropdown: {
    width: '100%',
    position: 'relative',
    height: '100%',
  },
  rootTooltip: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid' + theme.palette.secondary.main,
    color: theme.palette.common.black,
  },
  search: {
    width: '100%',
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    border: '1px solid ' + themeParams.palette.primary.appPrimaryDividerColor,
    borderRadius: 4,
    padding: 2,
  },
  rootPopup: {
    borderRadius: '4px 4px 0 0 !important',
    borderBottom: 'none',
  },
  rootAuto: {
    flex: 'auto',
    "& .MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root']": {
      paddingRight: '0 !important',
    },
  },
  inputRoot: {},
  label: {
    display: 'block',
  },
  input: {
    width: 200,
  },
  button: {
    padding: '1px 8px',
    margin: '0 6px',
    borderRadius: 20,
    background: '#e0e0e0',
    pointerEvents: 'none',
    '&:hove': {
      background: '#90A3B5',
    },
  },
  clearIcon: {
    color: theme.palette.common.white,
    width: 16,
    height: 16,
    fill: 'currentColor',
    background: '#666666',
    borderRadius: '50%',
    marginLeft: '5px',
    pointerEvents: 'auto',
  },
  rootTags: {
    display: 'flex',
  },
  padding: {
    padding: 0,
  },
  paddingInput: {
    padding: 8,
  },
}));
interface InputProps {
  onBlur: Function;
  onFocus: Function;
  onChange: Function;
}

interface MetaProps {
  touched: boolean;
  error: string;
}

interface AutocompleteInputInterface {
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
  limitTag: number;
  disabled: boolean;
  allowEmpty: boolean;
  field: FieldType;
  visibleClass: string;
  customError?: string;
  keyValue?: string;
}

const AutocompleteView: FC<AutocompleteInputInterface> = props => {
  const { field, limitTag = 2, disabled = false, keyValue = 'title', ...rest } = props;
  const classes = useStyles();

  return (
    <InputLabelComponent label={rest.label}>
      <div className={classes.rootDropdown}>
        <div className={`${classes.root}`}>
          <div className={classes.rootTags}>
            {field.defaultValue.length
              ? field.defaultValue.slice(0, limitTag).map((item, index) => (
                  <ButtonBase
                    disabled={disabled}
                    component="div"
                    classes={{ root: classes.button }}
                  >
                    <Typography>{item[keyValue]}</Typography>
                    <IconButton className={classes.padding} disabled={true}>
                      <ClearIcon className={classes.clearIcon} />
                    </IconButton>
                  </ButtonBase>
                ))
              : null}
          </div>
          {field.defaultValue.slice(limitTag).length ? (
            <Tooltip
              classes={{ tooltip: classes.rootTooltip }}
              title={
                <>
                  {field.defaultValue.slice(limitTag).map(item => (
                    <p data-test-input-name="popover-more-test">{item[keyValue]}</p>
                  ))}
                </>
              }
            >
              <p data-test-input-name="mouse-over-more-test" style={{ margin: 0 }}>
                ...
              </p>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </InputLabelComponent>
  );
};

export default AutocompleteView;

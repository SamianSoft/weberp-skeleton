/* eslint-disable no-use-before-define */
import React, { FC, useEffect, useState, createRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonBase, Tooltip, Typography } from '@material-ui/core';
import { FieldType } from '../../helper/Types';
import InputLabelComponent from './InputLabelComponent';
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
    height: '100%',
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
    cursor: 'pointer',
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
interface SelectOptionsInterface {
  selectedOptions: object[];
}

const AutocompleteView: FC<AutocompleteInputInterface> = props => {
  const { field, limitTag = 12, disabled = false, keyValue = 'title', ...rest } = props;
  const [state, setState] = useState<SelectOptionsInterface>({ selectedOptions: [] });
  useEffect(() => {
    setState({ selectedOptions: field.defaultValue || [] });
  }, []);
  const classes = useStyles();
  const [isMore, setIsMore] = useState(false);
  const [limitCount, setLimitCount] = useState(0);
  const refTags = createRef<HTMLInputElement>();
  const refRoot = createRef<HTMLInputElement>();

  useEffect(() => {
    setLimitCount(limitTag);
  }, [limitTag]);

  useEffect(() => {
    if (refTags.current && refRoot.current) {
      const tagsWidth = refTags.current.offsetWidth;
      const rootWidth = refRoot.current.offsetWidth;
      const division = tagsWidth / rootWidth;
      setIsMore(division * 100 >= 75);
    }
  }, [refTags, refRoot]);
  useEffect(() => {
    if (isMore) {
      setLimitCount(field.defaultValue.length);
    } else {
      setLimitCount(limitTag);
    }
  }, [isMore]);

  return (
    <InputLabelComponent label={rest.label}>
      <div className={classes.rootDropdown} ref={refRoot}>
        <div className={`${classes.root}`}>
          <div className={classes.rootTags} ref={refTags}>
            {field.defaultValue.length
              ? field.defaultValue.slice(0, limitCount).map((item, index) => (
                  <ButtonBase
                    disabled={disabled}
                    component="div"
                    classes={{ root: classes.button }}
                  >
                    <Typography>{item[keyValue]}</Typography>
                  </ButtonBase>
                ))
              : null}
          </div>
          {(isMore || field.defaultValue.length >= limitCount) &&
          state.selectedOptions.slice(limitCount).length ? (
            <Tooltip
              classes={{ tooltip: classes.rootTooltip }}
              title={
                <>
                  {state.selectedOptions.slice(limitCount).map(item => (
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

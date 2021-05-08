/* eslint-disable no-use-before-define */
import React, {
  FC,
  ReactNode,
  memo,
  useEffect,
  useRef,
  useState,
  createRef,
  SyntheticEvent,
} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {
  Button,
  ButtonBase,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { FieldType } from '../../helper/Types';
import InputLabelComponent from './InputLabelComponent';
import { useTranslate } from 'react-admin';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import SearchIcon from '@material-ui/icons/Search';
const useStyles = makeStyles(theme => ({
  rootDropdown: {
    width: '100%',
    position: 'relative',
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
    justifyContent: 'space-between',
    width: '100%',
    border: '1px solid black',
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
  listbox: {
    width: '100%',
    margin: 0,
    padding: 8,
    border: '1px solid ' + theme.palette.common.black,
    zIndex: 1,
    borderTop: 'none',
    position: 'absolute',
    borderRadius: '0 0 4px 4px !important',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
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
  drop: {
    pointerEvents: 'auto',
    cursor: 'pointer',
  },
  ulBox: {
    listStyleType: 'none',
    overflow: 'auto',
    maxHeight: 200,
    padding: 0,
    '& li[data-focus="true"]': {
      backgroundColor: theme.palette.primary.light,
      color: 'white',
      cursor: 'pointer',
    },
    '& li:active': {
      backgroundColor: theme.palette.primary.light,
      color: 'white',
    },
  },
}));
const icon = <CheckBoxOutlineBlankIcon style={{ borderRadius: 4 }} fontSize="small" />;
const checkedIcon = (
  <div style={{ backgroundColor: '#90A3B5', width: 16, height: 16, borderRadius: 4 }} />
);

const useFocus = () => {
  const htmlElRef = useRef<HTMLInputElement>(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};
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

const AutocompleteInput: FC<AutocompleteInputInterface> = props => {
  const { field, limitTag = 5, disabled = false, keyValue = 'title', ...rest } = props;
  const [state, setState] = useState<SelectOptionsInterface>({ selectedOptions: [] });
  useEffect(() => {
    setState({ selectedOptions: field.defaultValue || [] });
  }, []);
  const classes = useStyles();
  const [isMore, setIsMore] = useState(false);
  const [limitCount, setLimitCount] = useState(1);
  const htmlElRef = createRef<HTMLInputElement>();
  const refSelectedButton = createRef<HTMLInputElement>();
  const refRoot = createRef<HTMLInputElement>();
  const translate = useTranslate();

  const {
    getRootProps,
    popupOpen,
    getInputProps,
    getOptionProps,
    groupedOptions,
    value,
    getClearProps,
    getTagProps,
    getPopupIndicatorProps,
    getListboxProps,
  } = useAutocomplete({
    id: 'use-autocomplete-demo',
    options: field.dropdown.columns,
    value: state.selectedOptions,
    getOptionLabel: option => option[keyValue],
    onChange: (e, newValue) => {
      setState({ selectedOptions: [...newValue] });
      rest.onChange(newValue);
    },
    multiple: true,
    disableCloseOnSelect: true,
  });
  console.log(
    '🚀 ~ file: AutocompleteInput.tsx ~ line 274 ~ handleOnClickPopup ~ getPopupIndicatorProps',
    getInputProps(),
  );

  useEffect(() => {
    if (refSelectedButton.current && refRoot.current) {
      const tagsWidth = refSelectedButton.current.offsetWidth;
      const rootWidth = refRoot.current.offsetWidth;
      const division = tagsWidth / rootWidth;
      setIsMore(division * 100 >= 80);
    }
  }, [refSelectedButton, refRoot]);
  useEffect(() => {
    if (isMore) {
      setLimitCount(value.length);
    } else {
      setLimitCount(limitTag);
    }
  }, [isMore]);
  const handleOnClick = () => {
    setTimeout(() => {
      if (htmlElRef.current) {
        htmlElRef.current.focus();
      }
    }, 50);
  };
  const handleOnClickPopup = (event: SyntheticEvent) => () => {
    getPopupIndicatorProps()['onClick']();
  };

  return (
    <InputLabelComponent label={rest.label}>
      <div className={classes.rootDropdown} ref={refRoot}>
        <div
          className={`${classes.root} ${popupOpen ? classes.rootPopup : ''}`}
          {...getRootProps()}
        >
          <div style={{ display: 'flex' }} ref={refSelectedButton}>
            {value.length
              ? value.slice(0, limitCount).map((item, index) => (
                  <ButtonBase component="div" classes={{ root: classes.button }}>
                    <Typography>{item[keyValue]}</Typography>
                    <ClearIcon
                      onClick={getTagProps({ index })['onDelete']}
                      className={classes.clearIcon}
                    />
                  </ButtonBase>
                ))
              : null}
          </div>
          {isMore && (
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
          )}
          <InputBase
            fullWidth
            inputProps={{
              ...getInputProps(),
              value: '',
              onClick: handleOnClick,
              onFocus: handleOnClick,
              onBlur: () => {},
            }}
          />
          {value.length ? <ClearIcon {...getClearProps()} className={classes.clearIcon} /> : null}
          {!popupOpen ? (
            <ArrowDropDownIcon onClick={e => handleOnClickPopup(e)} className={classes.drop} />
          ) : (
            <ArrowDropUpIcon onClick={e => handleOnClickPopup(e)} className={classes.drop} />
          )}
        </div>
        {popupOpen ? (
          <Paper elevation={3} variant="outlined" className={classes.listbox}>
            <TextField
              inputProps={{ style: { padding: 8 }, ...getInputProps(), ref: htmlElRef }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
              // placeholder={translate('form.search')}
              variant="outlined"
            />
            <ul className={classes.ulBox} {...getListboxProps()}>
              {groupedOptions.length ? (
                groupedOptions.map((option, index) => {
                  return (
                    <li {...getOptionProps({ option, index })}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 2 }}
                        checked={
                          value.find(item => item[keyValue] === option[keyValue]) ? true : false
                        }
                      />
                      {option[keyValue]}
                    </li>
                  );
                })
              ) : (
                <Typography>{translate('form.noOption')}</Typography>
              )}
            </ul>
          </Paper>
        ) : null}
      </div>
    </InputLabelComponent>
  );
};

export default memo(AutocompleteInput);

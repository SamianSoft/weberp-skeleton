/* eslint-disable no-use-before-define */
import {
  ButtonBase,
  Checkbox,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import lodashDebounce from 'lodash/debounce';
import React, { createRef, FC, useEffect, useState } from 'react';
import { useTranslate } from 'react-admin';
import { connect } from 'react-redux';
import { triggerDropdownFetchData } from '../../helper/DropdownHelper';
import { FieldType } from '../../helper/Types';
import { findOneAction } from '../../redux/dropdown/action';
import InputLabelComponent from './InputLabelComponent';

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
    zIndex: 100,
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
const icon = <CheckBoxOutlineBlankIcon style={{ borderRadius: 4 }} fontSize="small" />;
const checkedIcon = (
  <div style={{ backgroundColor: '#90A3B5', width: 16, height: 16, borderRadius: 4 }} />
);
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
  dropdownFetched: object;
}
interface SelectOptionsInterface {
  selectedOptions: object[];
}

const AutocompleteInput: FC<AutocompleteInputInterface> = props => {
  const { field, limitTag = 12, disabled = false, dropdownFetched, ...rest } = props;
  const [state, setState] = useState<SelectOptionsInterface>({ selectedOptions: [] });
  useEffect(() => {
    triggerDropdownFetchData({ dropdownMeta: field.dropdown, ...rest }, '', {});
    setState({ selectedOptions: field.defaultValue || [] });
  }, []);
  const classes = useStyles();
  const [isMore, setIsMore] = useState(false);
  const [limitCount, setLimitCount] = useState(0);
  const refTags = createRef<HTMLInputElement>();
  const refRoot = createRef<HTMLInputElement>();
  const translate = useTranslate();

  useEffect(() => {
    setLimitCount(limitTag);
  }, [limitTag]);

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
    options: Object.values(dropdownFetched)[0] || [],
    filterOptions: options => options,
    value: state.selectedOptions,
    getOptionLabel: option => option[field.dropdown.displayMember],
    onChange: (e, newValue) => {
      setState({ selectedOptions: [...newValue] });
      rest.onChange(newValue);
    },
    multiple: true,
    disableCloseOnSelect: true,
  });

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
      setLimitCount(value.length);
    } else {
      setLimitCount(limitTag);
    }
  }, [isMore]);
  const handleOnClick = () => {
    handleOnClickPopup();
  };
  const handleOnClickPopup = () => {
    getPopupIndicatorProps()['onClick']();
  };
  const handleChangeSearch = lodashDebounce((event: React.ChangeEvent<HTMLInputElement>) => {
    triggerDropdownFetchData(
      { dropdownMeta: field.dropdown, ...rest },
      getInputProps()['value'],
      {},
    );
  }, 200);

  return (
    <InputLabelComponent label={rest.label}>
      <div className={classes.rootDropdown} ref={refRoot}>
        <div
          className={`${classes.root} ${popupOpen ? classes.rootPopup : ''}`}
          {...getRootProps()}
        >
          <div className={classes.rootTags} ref={refTags}>
            {value.length
              ? value.slice(0, limitCount).map((item, index) => (
                  <ButtonBase
                    disabled={disabled}
                    component="div"
                    classes={{ root: classes.button }}
                  >
                    <Typography>{item[field.dropdown.displayMember]}</Typography>
                    <IconButton
                      className={classes.padding}
                      onClick={getTagProps({ index })['onDelete']}
                      disabled={disabled}
                    >
                      <ClearIcon className={classes.clearIcon} />
                    </IconButton>
                  </ButtonBase>
                ))
              : null}
          </div>
          {(isMore || value.length >= limitCount) &&
          state.selectedOptions.slice(limitCount).length ? (
            <Tooltip
              classes={{ tooltip: classes.rootTooltip }}
              title={
                <>
                  {state.selectedOptions.slice(limitCount).map(item => (
                    <p data-test-input-name="popover-more-test">
                      {item[field.dropdown.displayMember]}
                    </p>
                  ))}
                </>
              }
            >
              <p data-test-input-name="mouse-over-more-test" style={{ margin: 0 }}>
                ...
              </p>
            </Tooltip>
          ) : null}
          <InputBase
            fullWidth
            inputProps={{
              ...getInputProps(),
              placeholder: value.length ? '' : translate('form.multiPlaceHolder'),
              value: '',
              onClick: handleOnClick,
              onBlur: () => {},
              disabled: disabled,
              className: classes.paddingInput,
            }}
          />
          {/* {value.length ? (
            <IconButton
              {...getClearProps()}
              disabled={disabled}
            >
              <ClearIcon className={classes.clearIcon} />
            </IconButton>
          ) : null} */}
          {!popupOpen ? (
            <IconButton
              onClick={handleOnClickPopup}
              className={classes.padding}
              disabled={disabled}
              data-test-input-name="auto-complete-input"
            >
              <ArrowDropDownIcon className={classes.drop} />
            </IconButton>
          ) : (
            <IconButton
              onClick={handleOnClickPopup}
              className={classes.padding}
              disabled={disabled}
            >
              <ArrowDropUpIcon className={classes.drop} />
            </IconButton>
          )}
        </div>
        {popupOpen ? (
          <Paper elevation={3} variant="outlined" className={classes.listbox}>
            <TextField
              data-test-input-name="auto-complete-input-box"
              onChange={handleChangeSearch}
              inputProps={{
                className: classes.paddingInput,
                ...getInputProps(),
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
              autoFocus
              disabled={disabled}
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
                        checked={
                          value.find(
                            item =>
                              item[field.dropdown.displayMember] ===
                              option[field.dropdown.displayMember],
                          )
                            ? true
                            : false
                        }
                      />
                      {option[field.dropdown.displayMember]}
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
const mapStateToProps = (state: { dropdown: object }) => ({
  dropdownFetched: state.dropdown,
});

const mapDispatchToProps = {
  findDropdownData: findOneAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AutocompleteInput);

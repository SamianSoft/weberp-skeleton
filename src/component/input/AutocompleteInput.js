/* eslint-disable no-use-before-define */
import React, { memo, useEffect, useRef, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, createStyles, Theme, fade } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {
  Button,
  Checkbox,
  InputAdornment,
  InputBase,
  InputLabel,
  Paper,
  Tooltip,
} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import SearchIcon from '@material-ui/icons/Search';
const useStyles = makeStyles(theme => ({
  rootDropdown: {
    width: '100%',
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
  },
  rootAuto: {
    width: '100%',
    "& .MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root']": {
      paddingRight: '0 !important',
    },
  },
  inputRoot: {},
}));
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};

function AutocompleteInput(props) {
  const { field, limitTag = 1, disabled = false, ...rest } = props;
  const [state, setState] = useState({ selectedOptions: [] });
  useEffect(() => {
    setState({ selectedOptions: field.defaultValue || [] });
  }, []);
  const classes = useStyles();
  const [inputRef, setInputFocus] = useFocus();

  return (
    <div className={classes.root}>
      <InputLabel>{rest.label}</InputLabel>
      &nbsp;
      <Autocomplete
        disabled={disabled}
        className={classes.rootAuto}
        classes={{ inputRoot: classes.inputRoot }}
        data-test-input-name="auto-complete-input"
        multiple
        getLimitTagsText={e => (
          <Tooltip
            classes={{ tooltip: classes.rootTooltip }}
            title={
              <>
                {state.selectedOptions.slice(limitTag).map(item => (
                  <p data-test-input-name="popover-more-test">{item.title}</p>
                ))}
              </>
            }
          >
            <p data-test-input-name="mouse-over-more-test" style={{ margin: 0 }}>
              ...
            </p>
          </Tooltip>
        )}
        limitTags={limitTag}
        id="multiple-limit-tags"
        disableCloseOnSelect
        value={state.selectedOptions}
        onChange={(e, newValue) => {
          setState(prev => {
            return { selectedOptions: [...newValue] };
          });
        }}
        // PaperComponent={props => (
        //   <Paper elevation={3} variant="outlined" className={classes.rootDropdown}>
        //     <div className={classes.search}>
        //       <TextField
        //         ref={inputRef}
        //         InputProps={{
        //           endAdornment: (
        //             <InputAdornment position="start">
        //               <SearchIcon />
        //             </InputAdornment>
        //           ),
        //         }}
        //         placeholder="Search…"
        //         variant="outlined"
        //         margin="normal"
        //       />
        //       <div>{props.children}</div>
        //     </div>
        //   </Paper>
        // )}
        options={field.dropdown.columns}
        size="small"
        render
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 2 }}
              checked={selected}
            />
            {option.title}
          </React.Fragment>
        )}
        defaultChecked={state.selectedOptions}
        getOptionLabel={option => option.title}
        noOptionsText={'ایتم وجود ندارد'}
        renderInput={params => (
          <TextField
            {...params}
            {...rest}
            InputLabelProps={{ style: { display: 'none' }, shrink: false }}
            variant="outlined"
            fullWidth
            disabled
          />
        )}
      />
    </div>
  );
}

export default memo(AutocompleteInput);

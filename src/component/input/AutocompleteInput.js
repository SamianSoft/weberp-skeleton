/* eslint-disable no-use-before-define */
import React, { memo, useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Checkbox, Paper, Tooltip } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(3),
      },
    },
    rootPaper: {
      border: '1px solid red',
    },
  }),
);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const CustomPaper = props => {
  const classes = useStyles();

  return <div>{props.children}</div>;
};

function AutocompleteInput(props) {
  const { field, onClick, ...rest } = props;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Autocomplete
        onClickCapture={onClick}
        multiple
        limitTags={1}
        id="multiple-limit-tags"
        disableCloseOnSelect
        PaperComponent={CustomPaper}
        options={field.dropdown.columns}
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
        getOptionLabel={option => option.title}
        noOptionsText={'ایتم وجود ندارد'}
        renderInput={params => (
          <TextField {...params} {...rest} variant="outlined" margin="normal" fullWidth />
        )}
      />
    </div>
  );
}

export default memo(AutocompleteInput);

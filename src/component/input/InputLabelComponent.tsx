import { InputLabel, makeStyles, Theme } from '@material-ui/core';
import React, { FC, ReactNode } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  inputLabel: {
    fontSize: theme.typography.subtitle2.fontSize,
    maxWidth: '28px',
    margin: '0 53px 0px 16px',
  },
}));

interface InputLabelPropsInterface {
  children: ReactNode;
  label: string;
}
const InputLabelComponent: FC<InputLabelPropsInterface> = ({ children, label }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <InputLabel className={classes.inputLabel}>{label}</InputLabel>
      {children}
    </div>
  );
};

export default InputLabelComponent;

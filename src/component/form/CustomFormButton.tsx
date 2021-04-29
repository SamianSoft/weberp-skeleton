import React, { FC } from 'react';
import { Button, makeStyles, Icon } from '@material-ui/core';

type Variant = 'contained' | 'text' | 'outlined';

interface CustomFormButtonPropsInterface {
  id: string;
  onClick: Function;
  disabled: boolean;
  variant: Variant;
  label: string;
  icon?: string;
}

const useStyles = makeStyles(() => ({
  dumbButton: {
    margin: '0 5px',
  },

  saveIconButton: {
    margin: '0 5px',
  },
}));

const SaveIconButton = ({ className, icon }) => (
  <Icon className={className} fontSize="small">
    {icon}
  </Icon>
);

const CustomFormButton: FC<CustomFormButtonPropsInterface> = props => {
  const { id, onClick, disabled, variant = 'contained', label, icon = 'save' } = props;

  const classes = useStyles();

  /**
   * Submit and redirect to specified page
   * @function handleClick
   * @returns {void}
   */
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (): void => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      variant={variant}
      id={id}
      color="primary"
      onClick={handleClick}
      disabled={disabled}
      className={classes.dumbButton}
    >
      <SaveIconButton className={classes.saveIconButton} icon={icon} />
      {label}
    </Button>
  );
};

export default CustomFormButton;

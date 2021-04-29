import React, { FC } from 'react';
import BackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import { useTheme } from '@material-ui/core';
import useWidth from './useWidth';

interface AppBarBackButtonProps {
  isTodoTaskItemSidebarOpen: boolean;
  closeTodoTaskItemSidebar: Function;
}

const AppBarBackButton: FC<AppBarBackButtonProps> = props => {
  const { isTodoTaskItemSidebarOpen, closeTodoTaskItemSidebar } = props;
  const theme = useTheme();
  const width = useWidth();

  const handleClick = () => {
    if (
      isTodoTaskItemSidebarOpen &&
      theme.breakpoints.width(width) <= theme.breakpoints.width('sm')
    ) {
      closeTodoTaskItemSidebar();
    } else {
      return window.history.back();
    }
  };

  return (
    <IconButton onClick={handleClick} color="inherit" data-test="container">
      <BackIcon />
    </IconButton>
  );
};

const mapStateToProps = state => ({
  isTodoTaskItemSidebarOpen: false,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AppBarBackButton);

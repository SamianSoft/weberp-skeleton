import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Snackbar,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tooltip,
  ClickAwayListener,
} from '@material-ui/core';
import { withStyles, createStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import classNames from 'classnames';
import { translate, undo, complete, userLogout as userLogoutAction } from 'react-admin';
import { createPortal } from 'react-dom';

import { hideNotification } from '../redux/notification/action';
import { getNotification } from '../redux/notification/reducer';
import { isEmptyObject } from '../helper/DataHelper';

const styles = theme =>
  createStyles({
    confirm: {
      backgroundColor: theme.palette.background.default,
    },

    warning: {
      color: theme.palette.warning.contrastText,
      backgroundColor: theme.palette.warning.main,
      '&:hover': {
        backgroundColor: theme.palette.warning.dark,
      },
      zIndex: 5000,
    },

    error: {
      color: theme.palette.error.contrastText,
      backgroundColor: theme.palette.error.light,
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
      },
      zIndex: 5000,
    },

    undo: {
      color: theme.palette.primary.light,
    },

    requestId: {
      textAlign: 'center',
      fontSize: '0.7em',
      borderTop: `1px solid ${theme.palette.divider}`,
      lineHeight: 2,
      cursor: 'pointer',
    },
  });

const Notification = props => {
  const {
    undo,
    complete,
    classes,
    className,
    type,
    translate,
    notification = {},
    autoHideDuration,
    hideNotification,
    userLogout,
    ...rest
  } = props;

  const {
    warning,
    error,
    confirm,
    undo: undoClass, // Rename classes.undo to undoClass in this scope to avoid name conflicts
    ...snackbarClasses
  } = classes;

  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [requestId, setrequestId] = useState('');
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { fromQuickCreateDialog, forceSnackbar } = notification;

  /**
   * Change `tooltipOpen` state to false
   * @function handleTooltipOpen
   * @returns {void}
   */
  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  /**
   * Change `tooltipOpen` state to true
   * @function handleTooltipOpen
   * @returns {void}
   */
  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  const shouldConfirm =
    notification &&
    (notification.type === 'error' || notification.type === 'warning') &&
    (!forceSnackbar || forceSnackbar !== true);
    
  useEffect(() => {
    setIsOpenSnackbar(!!notification);
    if (shouldConfirm && String(notification.message).includes('^')) {
      const msgArr = notification.message.split('^');
      setMessage(msgArr[0]);
      setrequestId(msgArr[1]);
    } else {
      setMessage(notification ? notification.message : '');
    }
  }, [notification]);

  const handleRequestClose = () => {
    if (isOpenSnackbar) {
      setIsOpenSnackbar(false);
    }
  };

  const handleExited = () => {
    if (notification && notification.logout) {
      userLogout();
    }
    if (notification && notification.undoable) {
      complete();
    }
    hideNotification();
  };

  /**
   * Copy Request Id to Clipboard
   * @function copyToClupboard
   * @returns {void}
   */
  const copyToClupboard = () => {
    navigator.clipboard
      .writeText(requestId)
      .then(() => {
        console.log('copied');
        handleTooltipOpen();
      })
      .catch(() => {
        console.log('failed');
      });
  };

  if (shouldConfirm) {
    return (
      <Dialog open={true} data-test-notification-dialog>
        <DialogContent>
          <DialogContentText data-test-notification="content">
            {translate(message, notification.messageArgs)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            className={classes[notification.type]}
            onClick={handleExited}
            data-test-notification="confirm"
          >
            {translate('ra.action.confirm')}
          </Button>
        </DialogActions>
        {requestId !== '' && (
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={tooltipOpen}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={translate('general.copied')}
            >
              <div className={classes.requestId} onClick={copyToClupboard}>
                {translate('general.requestId')}: <span>{requestId}</span>
              </div>
            </Tooltip>
          </ClickAwayListener>
        )}
      </Dialog>
    );
  }

  // hold CustomSnackbar in a variable to prevent rewrite it three times!
  const CustomSnackbar = (
    <Snackbar
      open={isOpenSnackbar}
      message={
        notification &&
        notification.message &&
        translate(notification.message, notification.messageArgs)
      }
      autoHideDuration={(notification && notification.autoHideDuration) || autoHideDuration}
      disableWindowBlurListener={notification && notification.undoable}
      onExited={handleExited}
      onClose={handleRequestClose}
      ContentProps={{
        className: classNames(classes[(notification && notification.type) || type], className),
      }}
      action={
        notification && notification.undoable ? (
          <Button color="primary" className={undoClass} size="small" onClick={undo}>
            {translate('ra.action.undo')}
          </Button>
        ) : null
      }
      classes={snackbarClasses}
      {...rest}
    />
  );

  if (notification && !isEmptyObject(notification) && notification !== []) {
    if (fromQuickCreateDialog === true) {
      const SnackbarContainer =
        typeof document !== 'undefined' ? document.getElementById('customSnackContainer') : null;

      if (!SnackbarContainer) {
        return CustomSnackbar;
      } else {
        return createPortal(CustomSnackbar, SnackbarContainer);
      }
    } else {
      return CustomSnackbar;
    }
  } else {
    return null;
  }
};

Notification.propTypes = {
  complete: PropTypes.func,
  classes: PropTypes.object,
  className: PropTypes.string,
  notification: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
    autoHideDuration: PropTypes.number,
    messageArgs: PropTypes.object,
  }),
  type: PropTypes.string,
  hideNotification: PropTypes.func.isRequired,
  autoHideDuration: PropTypes.number,
  translate: PropTypes.func.isRequired,
  undo: PropTypes.func,
};

Notification.defaultProps = {
  type: 'info',
  autoHideDuration: 4000,
};

const mapStateToProps = state => ({
  notification: getNotification(state),
});

const mapDispatchToProps = {
  complete,
  hideNotification,
  undo,
  userLogout: userLogoutAction,
};

export default compose(
  translate,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(Notification);

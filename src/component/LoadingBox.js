import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import classNames from 'classnames';

const styles = theme => ({
  circularProgress: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },

  absolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 1,
    backgroundColor: '#ffffffdb',
  },
});

const LoadingBox = ({ classes, absolute, size = 50 }) => (
  <div className={classNames(classes.circularProgress, absolute ? classes.absolute : null)}>
    <CircularProgress color="secondary" size={size} />
  </div>
);

LoadingBox.propTypes = {
  classes: PropTypes.object,
  absolute: PropTypes.bool,
  size: PropTypes.number,
};

export default withStyles(styles)(LoadingBox);

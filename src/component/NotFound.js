import React, { PureComponent } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { withStyles, Button, Icon, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { translate, Responsive } from 'react-admin';

import notFoundIconSvg from '../images/notFound.svg';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      height: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      height: '100vh',
      marginTop: '-3em',
    },
  },

  notFoundIcon: {
    marginBottom: 30,
    [theme.breakpoints.up('md')]: {
      fontSize: '15em',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '8em',
    },
  },

  message: {
    textAlign: 'center',
    opacity: 0.5,
    margin: '0 1em',
  },

  title: {
    marginBottom: 30,
  },

  toolbar: {
    textAlign: 'center',
    marginTop: '2em',
  },

  notFoundSvg: {
    backgroundImage: `url(${notFoundIconSvg})`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    height: 200,
    width: 200,
    margin: '20px auto',
    backgroundSize: 'contain',
  },
});

function goBack() {
  window.history.back();
}

class NotFound extends PureComponent {
  render() {
    const { classes, title, translate, className, notFoundIcon, ...rest } = this.props;

    return (
      <div className={classNames(classes.container, className)} {...rest}>
        <div className={classes.message}>
          {notFoundIcon ? (
            <Icon className={classes.notFoundIcon}>{notFoundIcon}</Icon>
          ) : (
            <div className={classes.notFoundSvg}></div>
          )}
          {title ? (
            <Responsive
              small={
                <Typography variant="h6" className={classes.title}>
                  {title}
                </Typography>
              }
              medium={
                <Typography variant="h5" className={classes.title}>
                  {title}
                </Typography>
              }
            />
          ) : (
            <Typography variant="h3">{translate('ra.page.not_found')}</Typography>
          )}
        </div>
        <div className={classes.toolbar}>
          <Button variant="contained" color="primary" onClick={goBack}>
            {translate('ra.action.back')}
          </Button>
        </div>
      </div>
    );
  }
}

NotFound.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  title: PropTypes.string,
  translate: PropTypes.func.isRequired,
  notFoundIcon: PropTypes.string,
};

export default compose(translate, withStyles(styles, { withTheme: true }))(NotFound);

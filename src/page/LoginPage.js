import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import { Notification, LoginForm } from 'react-admin';
import { Typography } from '@material-ui/core';

import LanguageContainer from '../container/LanguageContainer';
import appVersion from '../core/version';

const styles = theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    height: '1px',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },

  card: {
    minWidth: 300,
    paddingBottom: 12,
  },

  avatar: {
    margin: '1em',
    display: 'flex',
    justifyContent: 'center',
  },

  icon: {
    backgroundColor: theme.palette.secondary[500],
  },

  versionContainer: {
    textAlign: 'center',
  },
});

const sanitizeRestProps = ({
  array,
  backgroundImage,
  classes,
  className,
  location,
  staticContext,
  theme,
  title,
  ...rest
}) => rest;

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.theme = createMuiTheme(props.theme);
    this.containerRef = React.createRef();
    this.backgroundImageLoaded = false;
  }

  updateBackgroundImage = (lastTry = false) => {
    if (!this.backgroundImageLoaded && this.containerRef.current) {
      const { backgroundImage } = this.props;
      this.containerRef.current.style.backgroundImage = `url(${backgroundImage})`;
      this.backgroundImageLoaded = true;
    }

    if (lastTry) {
      this.backgroundImageLoaded = true;
    }
  };

  // Load background image asynchronously to speed up time to interactive
  lazyLoadBackgroundImage() {
    const { backgroundImage } = this.props;

    if (backgroundImage) {
      const img = new Image();
      img.onload = this.updateBackgroundImage;
      img.src = backgroundImage;
    }
  }

  componentDidMount() {
    this.lazyLoadBackgroundImage();
  }

  componentDidUpdate() {
    if (!this.backgroundImageLoaded) {
      this.lazyLoadBackgroundImage(true);
    }
  }

  render() {
    const { classes, className, ...rest } = this.props;

    return (
      <MuiThemeProvider theme={this.theme}>
        <div
          className={classNames(classes.main, className)}
          {...sanitizeRestProps(rest)}
          ref={this.containerRef}
        >
          <Card className={classes.card}>
            <div className={classes.avatar}>
              <Avatar className={classes.icon}>
                <LockIcon />
              </Avatar>
            </div>
            <LoginForm />
            <LanguageContainer />
            <div className={classes.versionContainer}>
              <Typography gutterBottom color="textSecondary" variant="caption">
                v-{appVersion}
              </Typography>
            </div>
          </Card>
          <Notification />
        </div>
      </MuiThemeProvider>
    );
  }
}

LoginPage.propTypes = {
  authProvider: PropTypes.func,
  backgroundImage: PropTypes.string,
  classes: PropTypes.object,
  className: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  previousRoute: PropTypes.string,
};

LoginPage.defaultProps = {
  backgroundImage: '',
};

export default withStyles(styles)(LoginPage);

import React, { useState, useEffect } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { useLocale, setSidebarVisibility, LoadingIndicator } from 'react-admin';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import grey from '@material-ui/core/colors/grey';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';

import Notification from './Notification';
import Menu from './Menu';
import {
  CONFIG_DRAWER_MENU_IS_OPEN,
  CONFIG_IS_BOTTOM_MENU_ENABLED,
  DRAWER_WIDTH,
  getValue,
  setValue,
  HEADER_HEIGHT_XS,
  HEADER_HEIGHT,
} from '../core/configProvider';
import MetaResourceRegisterer from '../container/MetaResourceRegisterer';
import AppBarBackButton from './AppBarBackButton';
import useWidth from './useWidth';
import { themeParams } from '../core/themeProvider';

const drawerWidth = getValue(DRAWER_WIDTH);
const headerHeightXs = getValue(HEADER_HEIGHT_XS);
const headerHeight = getValue(HEADER_HEIGHT);

const styles = theme => ({
  root: {
    backgroundColor: themeParams.palette.primary.appPrimaryBackgroundColor,
    position: 'fixed',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    display: 'flex',
  },

  container: {
    display: 'flex',
    flexGrow: 1,
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },

  drawer: {
    [theme.breakpoints.up('sm')]: {
      flexShrink: 0,
      flexGrow: 0,
      flexBasis: drawerWidth,
    },
  },

  drawerClose: {
    display: 'none',
  },

  appBarRight: {
    [theme.breakpoints.up('sm')]: {
      marginRight: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    },
    boxShadow: 'none',
  },

  appBarLeft: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    },
    boxShadow: 'none',
  },

  menuButton: {
    padding: 2,
  },

  toolbar: {
    minHeight: headerHeight,
    [theme.breakpoints.down('xs')]: {
      minHeight: headerHeightXs,
      maxHeight: headerHeightXs,
    },
  },

  drawerPaper: {
    width: drawerWidth,
    backgroundColor: grey[50],
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
    overflow: 'auto',
  },

  menuContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },

  mainHeader: {
    minHeight: 50,
    maxHeight: 50,
    paddingRight: 16,
    paddingLeft: 16,
    [theme.breakpoints.down('xs')]: {
      minHeight: 40,
      maxHeight: 40,
    },
    '& > button': {
      padding: 5,
      width: 'auto',
      height: 'auto',
    },
  },

  appBarTitle: {
    flexGrow: 1,
    padding: '0 10px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 10,
    },
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },

  loading: {
    margin: 8,
  },
});

const AppLayout = props => {
  const { theme, children, classes, dashboard, logout } = props;
  const locale = useLocale();
  const width = useWidth();
  const [isMenuOpen, setIsMenuOpen] = useState(!!getValue(CONFIG_DRAWER_MENU_IS_OPEN));
  const hasDashboard = !!dashboard;
  const isBottomMenuEnabled = getValue(CONFIG_IS_BOTTOM_MENU_ENABLED);

  useEffect(() => {
    props.setSidebarVisibility(true);
  }, []);

  useEffect(() => {
    if (width === 'xs') {
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(true);
    }
  }, [width]);

  const toggleMenuDrawer = () => {
    setValue(CONFIG_DRAWER_MENU_IS_OPEN, !isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const appBarClasses = (theme, classes) => {
    if (!isMenuOpen) {
      return null;
    }

    return theme.direction === 'rtl' ? classes.appBarRight : classes.appBarLeft;
  };

  const drawer = (
    <div className={classes.menuContainer}>
      <Divider />
      <Hidden smUp implementation="js">
        <Menu
          logout={logout}
          hasDashboard={hasDashboard}
          locale={locale}
          onSelect={toggleMenuDrawer}
        />
      </Hidden>
      <Hidden xsDown implementation="js">
        <Menu logout={logout} hasDashboard={hasDashboard} locale={locale} />
      </Hidden>
    </div>
  );

  return (
    <MuiThemeProvider theme={theme}>
      <Helmet>
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Helmet>

      <div className={classes.root}>
        <MetaResourceRegisterer />
        <CssBaseline />
        <AppBar position="fixed" className={appBarClasses(theme, classes)}>
          <Toolbar className={classes.mainHeader}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={toggleMenuDrawer}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <div color="inherit" className={classes.appBarTitle} id="react-admin-title" />
            <div color="inherit" id="reactAdminHeaderButtonContainer" />
            <AppBarBackButton />
            {width !== 'xs' && (
              <LoadingIndicator data-test-loading-bar className={classes.loading} />
            )}
            {width !== 'xs' ? logout : null}
          </Toolbar>
        </AppBar>
        <div className={classes.container}>
          <nav className={isMenuOpen ? classes.drawer : classes.drawerClose}>
            <Hidden smUp implementation="js">
              <Drawer
                container={props.container}
                variant="temporary"
                anchor="left"
                open={isMenuOpen}
                onClose={toggleMenuDrawer}
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                anchor="left"
                classes={{
                  paper: isMenuOpen ? classes.drawerPaper : classes.drawerClose,
                }}
                variant="permanent"
                open={isMenuOpen}
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {children}
          </main>
        </div>
        <Notification />
      </div>
    </MuiThemeProvider>
  );
};

AppLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  dashboard: PropTypes.any.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setSidebarVisibility: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  isLoading: state.admin.loading > 0,
});

const mapDispatchToProps = {
  setSidebarVisibility,
};

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps, mapDispatchToProps),
)(AppLayout);

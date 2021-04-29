import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import lodashSortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { useTranslate, useLocale, userLogout as userLogoutAction } from 'react-admin';
import CircularProgress from '@material-ui/core/CircularProgress';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import grey from '@material-ui/core/colors/grey';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import appVersion from '../core/version';
import { clone } from '../helper/DataHelper';
import { useTheme } from '@material-ui/core';
import useWidth from './useWidth';

const useStyles = makeStyles(theme => ({
  maincontainer: {
    height: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },

  spinner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2),
  },

  innerparent: {
    position: 'relative',
    width: '100%',
    flexGrow: 1,
    height: 1,
  },

  menulist: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    overflowY: 'auto',
    height: '100%',
  },

  menulistLiContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    lineHeight: 3.6,
    '&:hover': {
      backgroundColor: grey[200],
    },
    cursor: 'pointer',
  },

  menuIcon: {
    marginRight: theme.spacing(1.5),
    marginLeft: theme.spacing(1.5),
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 20,
  },

  linkTitle: {
    cursor: 'pointer',
    color: 'rgba(0, 0, 0, 0.87)',
    textDecoration: 'none',
    paddingLeft: '0.5em',
    paddingRight: '0.2em',
    flexGrow: 1,
    fontSize: 10,
    fontWeight: '400',
  },

  childrenIcon: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 20,
  },

  subMenu: {
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: grey[50],
    position: 'absolute',
    top: 0,
    left: 44,
    right: 0,
    bottom: 0,
  },

  appVersion: {
    fontSize: 11,
    textAlign: 'center',
    padding: 10,
    color: 'rgba(0, 0, 0, 0.54)',
  },

  menucart: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    transition: 'all 300ms ease-in-out',
  },
}));

const Menu = props => {
  const { menuArray, menuIsLoading, menuIsLoadedOnce, findAllMenu, onSelect, userLogout } = props;

  const [menuList, setMenuList] = useState(null);

  const translate = useTranslate();
  const classes = useStyles(props);
  const theme = useTheme();
  const width = useWidth();

  const prepareMenu = useCallback((sortedList, parentId = null) => {
    const result = sortedList.filter(menu => menu.parentId === parentId);

    for (const i in result) {
      result[i].children = prepareMenu(sortedList, result[i].id);

      // const okChild = result[i].children.find(child => {
      //   return !!((child.moduleName && child.moduleTableName) || child.reportId || child.url);
      // }); // child has link
      // result[i].isOk = !!(
      //   (result[i].moduleName && result.moduleTableName) ||
      //   okChild
      // ); // has link or at-least one ok child

      result[i].isOk = true;
    }

    return result;
  }, []);

  if (menuIsLoading) {
    return (
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    );
  }

  if (!menuIsLoading && !menuList) {
    return <div className={classes.spinner}>{translate('menu.menuNotFound')}</div>;
  }

  const ForwardArrow = theme.direction === 'rtl' ? KeyboardArrowLeft : KeyboardArrowRight;

  return (
    <div className={classes.maincontainer}>
      <div className={classes.innerparent}></div>

      <Typography className={classes.appVersion}>v-{appVersion}</Typography>
    </div>
  );
};

Menu.propTypes = {
  findAllMenu: PropTypes.func.isRequired,
  menuIsLoading: PropTypes.bool.isRequired,
  menuIsLoadedOnce: PropTypes.bool.isRequired,
  menuArray: PropTypes.array,
  onSelect: PropTypes.func,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch, { redirectTo }) => ({
  userLogout: () => dispatch(userLogoutAction(redirectTo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);

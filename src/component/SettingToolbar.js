import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { TopToolbar, translate } from 'react-admin';
import { withStyles, Tooltip, IconButton, Icon } from '@material-ui/core';
import { connect } from 'react-redux';

import { toggleDevExGroupingAction, toggleDevExTopFilterAction } from '../redux/listPage/action';

const styles = theme => ({
  IconButton: {
    padding: 7,
    margin: '0 5px',
    [theme.breakpoints.down('sm')]: {
      padding: '10px 10px',
      margin: 0,
    },
  },

  settingToolbar: {
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
});

const SettingToolbar = ({
  translate,
  classes,
  currentSort,
  filterValues,
  resource,
  total,
  isFilterEnable,
  isGroupingEnable,
  locale,
  metaData,
  toggleDevExTopFilter,
  toggleDevExGrouping,
  isColumnChoiceEnable,
  setFilters,
  fields,
}) => {
  if (!resource || !metaData) {
    return <div />;
  }

  return (
    <TopToolbar className={classes.settingToolbar}>
      {isFilterEnable && !!setFilters && (
        <Tooltip title={translate('grid.columnFilters')}>
          <IconButton color="primary" className={classes.IconButton} onClick={toggleDevExTopFilter}>
            <Icon fontSize="small">filter_list</Icon>
          </IconButton>
        </Tooltip>
      )}

      {isGroupingEnable && !!setFilters && (
        <Tooltip title={translate('grid.grouping')}>
          <IconButton
            color="primary"
            className={classes.IconButton}
            onClick={toggleDevExGrouping}
            id="grouping_button"
          >
            <Icon fontSize="small">view_compact</Icon>
          </IconButton>
        </Tooltip>
      )}
    </TopToolbar>
  );
};

SettingToolbar.propTypes = {
  locale: PropTypes.string.isRequired,
  metaData: PropTypes.object,
  resource: PropTypes.string.isRequired,
  isFilterEnable: PropTypes.bool,
  isGroupingEnable: PropTypes.bool,
  isColumnChoiceEnable: PropTypes.bool,
};

const mapDispatchToProps = {
  toggleDevExTopFilter: toggleDevExTopFilterAction,
  toggleDevExGrouping: toggleDevExGroupingAction,
};

export default compose(
  translate,
  withStyles(styles, { withTheme: true }),
  connect(null, mapDispatchToProps),
)(SettingToolbar);

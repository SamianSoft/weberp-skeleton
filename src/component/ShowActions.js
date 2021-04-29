import React from 'react';
import PropTypes from 'prop-types';
import { EditButton } from 'react-admin';
import { withStyles, CardActions } from '@material-ui/core';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { getProcessLines, isRecordEditable } from '../helper/MetaHelper';

const styles = theme => ({
  cardActionStyle: {
    justifyContent: 'flex-end',
    backgroundColor: theme.palette.primary.appSecondaryBackgroundColor,
  },

  iconButton: {
    padding: 5,
    margin: '0 6px',
  },
});

const ShowActions = ({
  classes,
  locale,
  basePath,
  data: record,
  metaData,
  resource,
  hasEdit,
  customRefresh,
  ...rest
}) => {
  const processLineList = getProcessLines(
    metaData,
    record.__processuniqueid,
    record.positionid,
    record.stateid,
  );
  const isEditEnabled = hasEdit && isRecordEditable(metaData, record);

  const processLineNamesTest =
    processLineList && processLineList.length
      ? Array.from(processLineList.map(x => x.title)).join(',')
      : '';


  return (
    <CardActions className={classes.cardActionStyle} data-test-process-lines={processLineNamesTest}>
      <EditButton
        basePath={basePath}
        record={record}
        disabled={!isEditEnabled}
        id="editActionButton"
      />
    </CardActions>
  );
};

ShowActions.defaultProps = {
  hasEdit: true,
};

ShowActions.propTypes = {
  record: PropTypes.object,
  metaData: PropTypes.object.isRequired,
  resource: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
  hasEdit: PropTypes.bool.isRequired,
};

const mapDispatchTopProps = {
};

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(null, mapDispatchTopProps),
)(ShowActions);

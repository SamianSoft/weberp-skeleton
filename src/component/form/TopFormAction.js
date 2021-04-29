import React, { memo } from 'react';
import { TopToolbar, ShowButton } from 'react-admin';
import { withStyles } from '@material-ui/core';


const styles = theme => ({
  iconButton: {
    padding: 5,
    margin: '0 6px',
  },

  topToolbar: {
    padding: 8,
    justifyContent: 'flex-end',
    backgroundColor: theme.palette.primary.appSecondaryBackgroundColor,
  },
});

const TopFormAction = ({ basePath, data, classes }) => {
  return (
    <TopToolbar className={classes.topToolbar}>
      {data && !!data.id && <ShowButton basePath={basePath} record={data} />}
    </TopToolbar>
  );
};

export default memo(withStyles(styles, { withTheme: true })(TopFormAction));

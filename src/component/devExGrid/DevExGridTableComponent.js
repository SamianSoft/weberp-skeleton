import React from 'react';
import { Table } from '@devexpress/dx-react-grid-material-ui';
import { withStyles } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
  tableStriped: {
    cursor: 'pointer',
    '& thead': {
      backgroundColor: grey[50],
      '& tr': {
        height: 40,
      },
      '& > th': {
        borderBottom: '4px double rgba(224, 224, 224, 1)',
        '& > span': {
          fontSize: 10,
        },
      },
    },
    '& tbody tr': {
      height: 40,
      '& > td': {
        whiteSpace: 'unset',
        '& > span': {
          fontSize: 11,
        },
      },
    },
    '& tbody tr:hover': {
      backgroundColor: grey[50],
    },
    '& tfoot tr': {
      height: 40,
      '& > td': {
        '& > span': {
          fontSize: 11,
        },
      },
    },

    [theme.breakpoints.down('sm')]: {
      '& thead': {
        '& tr': {
          height: 30,
        },
        '& th': {
          padding: 0,
        },
      },
      '& tbody': {
        '& tr': {
          height: 30,
        },
        '& td': {
          padding: 0,
        },
      },
      '& tfoot': {
        '& tr': {
          height: 30,
        },
        '& td': {
          padding: 0,
        },
      },
    },
  },
});

const DevExGridTableComponent = ({ classes, ...restProps }) => (
  <Table.Table {...restProps} className={classes.tableStriped} />
);

export default withStyles(styles, { name: 'TableComponent' })(DevExGridTableComponent);

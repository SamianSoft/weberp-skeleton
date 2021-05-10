import { AppBar, Grid, Icon, makeStyles } from '@material-ui/core';
import React, { FC } from 'react';
import { useTranslate, Button as ReactAdminButton } from 'react-admin';
import { linkToRecord } from 'ra-core';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

const useStyles = makeStyles(theme => ({
  container: {
    padding: '8px 16px',
  },
  buttonLink: {
    color: 'white',
  },
}));
interface RelationActionInterface {
  list: object[];
  basePath: object;
  record: object;
  isType: string;
}


const RelationActionButtonsComponent: FC<RelationActionInterface> = props => {
  const { list, basePath, record, isType, ...rest } = props;
  const classes = useStyles();
  /**
   * useful to prevent click bubbling in a datagrid with rowClick
   * @function stopPropagations
   * @param {event}
   * @returns {void}
   */
  const stopPropagation = event => event.stopPropagation();
  const translate = useTranslate();
  return ReactDOM.createPortal(
    <Grid
      container
      className={classes.container}
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      {list.map(item => (
        <Grid item>
          <ReactAdminButton
            className={classes.buttonLink}
            component={Link}
            to={`${linkToRecord(basePath, record && record['id'], isType)}?scrollTo=${item['id']}`}
            onClick={stopPropagation}
            label={item['title']}
            {...rest}
          ></ReactAdminButton>
        </Grid>
      ))}
    </Grid>,
    document.getElementById('app-bar-portal'),
  );
};

export default RelationActionButtonsComponent;

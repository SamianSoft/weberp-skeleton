import React, { FC } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import LoadingBox from '../LoadingBox';
import { RelationLoadingType } from './RelationTypes';

const useStyles = makeStyles(() => ({
  circularProgressContainer: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    padding: 15,
  },
}));

const RelationLoading: FC<RelationLoadingType> = props => {
  const { title, element } = props;

  const classes = useStyles(props);

  return (
    <div ref={element} className={classes.circularProgressContainer}>
      <Typography variant="body2">{title}</Typography>
      <LoadingBox />
    </div>
  );
};

export default RelationLoading;

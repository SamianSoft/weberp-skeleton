import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { object } from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  AccordionDetails: { borderTop: '1px solid black' },
}));

export default function AccordionComponent({ summary, children, customSummaryClass }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          classes={{ content: customSummaryClass }}
        >
          {summary}
        </AccordionSummary>
        <AccordionDetails className={classes.AccordionDetails}>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}

AccordionComponent.defaultProps = {
  customSummaryClass: {},
};

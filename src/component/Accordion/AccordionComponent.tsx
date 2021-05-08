import React, { FC, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

interface AccordionComponentPropsInterface {
  summary: ReactNode;
  children: ReactNode;
  customSummaryClass: string;
}

const AccordionComponent: FC<AccordionComponentPropsInterface> = ({
  summary,
  children,
  customSummaryClass,
}) => {
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
};

AccordionComponent.defaultProps = {
  customSummaryClass: '',
};

export default AccordionComponent;

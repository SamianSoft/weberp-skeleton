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
  content: { maxHeight: '45px !important', minHeight: '45px !important' },
  topRounded: { borderRadius: '4px 4px 0 0' },
  bottomRounded: { borderRadius: '0 0 4px 4px' },
}));

interface AccordionComponentPropsInterface {
  summary: ReactNode;
  children: ReactNode;
  customSummaryClass: string;
  index: number;
}

const AccordionComponent: FC<AccordionComponentPropsInterface> = ({
  summary,
  children,
  customSummaryClass,
  index,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion
        classes={{ root: index % 2 === 0 ? classes.topRounded : classes.bottomRounded }}
        square
        defaultExpanded={true}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          classes={{ content: `${customSummaryClass}`, root: ` ${classes.content}` }}
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

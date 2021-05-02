import React, { Children, cloneElement, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, makeStyles } from '@material-ui/core';

const dummyFunction = () => {};

const useStyles = makeStyles(theme => ({
  validationError: {
    color: theme.palette.error.main,
  },
  selected: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.secondary.main + '12',
  },
}));

const TabParent = props => {
  const {
    children,
    className,
    onChange = dummyFunction,
    defaultTabIndex,
    validationErrors, // this prop should pass to childrens because we need this in dynamic input.
    initialValues, // this prop should pass to childrens because we need this in dynamic input.
    ...rest
  } = props;

  const [selectedTab, setSelectedTab] = useState(0);
  const [isCheckedForSelectedTab, setIsCheckedForSelectedTab] = useState(false);
  const [tabsWithError, setTabsWithError] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (defaultTabIndex && children[defaultTabIndex]) {
      setSelectedTab(defaultTabIndex);
      setIsCheckedForSelectedTab(true);
      return;
    }

    let isFound = false;
    Children.forEach(children, (child, index) => {
      if (!child) {
        return;
      }

      if (!isFound) {
        isFound = true;
        setSelectedTab(index);
      }
    });
    setIsCheckedForSelectedTab(true);
  }, []);

  useEffect(() => {
    // extract tab ids that have errors to make them red color when they are mapping
    const errors =
      validationErrors && validationErrors.length
        ? Array.from(validationErrors.map(err => err['tabId']))
        : [];
    setTabsWithError(errors);
  }, [validationErrors]);

  const changeSelectedRequest = index => {
    if (selectedTab !== index) {
      setSelectedTab(index);
    }
  };

  const showCloned = (child, props) => {
    if (!child) {
      return <div />;
    }

    return cloneElement(child, props);
  };

  const onTabClick = (tab, index) => event => {
    changeSelectedRequest(index);
    onChange(tab, index);
    if (typeof tab.props.onClick === 'function') {
      tab.props.onClick(event);
    }
  };

  if (Children.count(children) < 1 || !isCheckedForSelectedTab) {
    return <div />;
  }

  return (
    <div className={className}>
      <Tabs value={selectedTab} variant="scrollable" scrollButtons="on">
        {Children.map(children, (tab, index) => {
          if (!tab) {
            return null;
          }
          const isDirtyTab = tabsWithError.includes(+tab.key);

          return (
            <Tab
              data-test-key={tab.key}
              key={tab.key + index}
              label={tab.props.label}
              onClick={onTabClick(tab, index)}
              value={index}
              classes={{ selected: classes.selected }}
              className={isDirtyTab ? classes.validationError : null}
              data-test-has-error={isDirtyTab}
            />
          );
        })}
      </Tabs>
      {Array.isArray(children)
        ? showCloned(children[selectedTab], { initialValues, validationErrors, ...rest })
        : showCloned(children, { initialValues, validationErrors, ...rest })}
    </div>
  );
};

TabParent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onChange: PropTypes.func,
};

export default TabParent;

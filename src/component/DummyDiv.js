import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';

const DummyDiv = ({ className, children, ...rest }) => (
  <div className={className} data-test="dummyDiv">
    {Children.map(children, child => (child ? cloneElement(child, rest) : null))}
  </div>
);

DummyDiv.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default DummyDiv;

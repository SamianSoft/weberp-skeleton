import { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';

// onClick don't set on Children because called on the TabParent
const TabChild = ({ children, onClick, label, ...rest }) =>
  Children.map(children, child => {
    return child ? cloneElement(child, rest) : null;
  });

TabChild.propTypes = {
  label: PropTypes.any.isRequired,
  children: PropTypes.any.isRequired,
  onClick: PropTypes.func,
};

export default TabChild;

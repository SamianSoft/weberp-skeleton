import PropTypes from 'prop-types';

const DummyFunctionComponent = ({ children, ...props }) => children(props);

DummyFunctionComponent.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DummyFunctionComponent;

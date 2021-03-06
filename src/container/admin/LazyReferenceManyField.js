import React, { Fragment, cloneElement } from 'react';
import PropTypes from 'prop-types';
import ReferenceManyFieldController from './ReferenceManyFieldController';

export const ReferenceManyFieldView = ({
  children,
  className,
  currentSort,
  data,
  ids,
  loadedOnce,
  page,
  showPagination,
  isCompactMode = false,
  perPage,
  reference,
  referenceBasePath,
  setPage,
  setPerPage,
  setSort,
  total,
}) => (
  <Fragment>
    {cloneElement(children, {
      className,
      resource: reference,
      ids,
      loadedOnce,
      data,
      basePath: referenceBasePath,
      currentSort,
      setSort,
      total,
    })}
  </Fragment>
);

ReferenceManyFieldView.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  currentSort: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.string,
  }),
  data: PropTypes.object,
  ids: PropTypes.array,
  loadedOnce: PropTypes.bool,
  pagination: PropTypes.element,
  reference: PropTypes.string,
  referenceBasePath: PropTypes.string,
  setSort: PropTypes.func,
};

/**
 * Render related records to the current one.
 *
 * You must define the fields to be passed to the iterator component as children.
 *
 * @example Display all the comments of the current post as a datagrid
 * <LazyReferenceManyField reference="comments" target="post_id">
 *     <Datagrid>
 *         <TextField source="id" />
 *         <TextField source="body" />
 *         <DateField source="created_at" />
 *         <EditButton />
 *     </Datagrid>
 * </LazyReferenceManyField>
 *
 * @example Display all the books by the current author, only the title
 * <LazyReferenceManyField reference="books" target="author_id">
 *     <SingleFieldList>
 *         <ChipField source="title" />
 *     </SingleFieldList>
 * </LazyReferenceManyField>
 *
 * By default, restricts the possible values to 25. You can extend this limit
 * by setting the `perPage` prop.
 *
 * @example
 * <LazyReferenceManyField perPage={10} reference="comments" target="post_id">
 *    ...
 * </LazyReferenceManyField>
 *
 * By default, orders the possible values by id desc. You can change this order
 * by setting the `sort` prop (an object with `field` and `order` properties).
 *
 * @example
 * <LazyReferenceManyField sort={{ field: 'created_at', order: 'DESC' }} reference="comments" target="post_id">
 *    ...
 * </LazyReferenceManyField>
 *
 * Also, you can filter the query used to populate the possible values. Use the
 * `filter` prop for that.
 *
 * @example
 * <LazyReferenceManyField filter={{ is_published: true }} reference="comments" target="post_id">
 *    ...
 * </LazyReferenceManyField>
 */
export const LazyReferenceManyField = ({ children, ...props }) => {
  if (React.Children.count(children) !== 1) {
    throw new Error('<LazyReferenceManyField> only accepts a single child (like <Datagrid>)');
  }

  return (
    <ReferenceManyFieldController {...props}>
      {controllerProps => (
        <ReferenceManyFieldView {...props} {...{ children, ...controllerProps }} />
      )}
    </ReferenceManyFieldController>
  );
};

LazyReferenceManyField.propTypes = {
  addLabel: PropTypes.bool,
  basePath: PropTypes.string,
  children: PropTypes.element.isRequired,
  classes: PropTypes.object,
  className: PropTypes.string,
  filter: PropTypes.object,
  label: PropTypes.string,
  perPage: PropTypes.number,
  record: PropTypes.object,
  reference: PropTypes.string.isRequired,
  resource: PropTypes.string,
  sortBy: PropTypes.string,
  source: PropTypes.string.isRequired,
  sort: PropTypes.shape({
    field: PropTypes.string,
    order: PropTypes.string,
  }),
  target: PropTypes.string.isRequired,
  initialData: PropTypes.array,
  initialCount: PropTypes.number,
};

LazyReferenceManyField.defaultProps = {
  filter: {},
  perPage: 10,
  sort: { field: 'id', order: 'DESC' },
  source: 'id',
  addLabel: true,
};

export default LazyReferenceManyField;

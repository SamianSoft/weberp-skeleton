import React, { Component } from 'react';
import { connect } from 'react-redux';
import lodashIsEqual from 'lodash/isEqual';
import { crudGetManyReference as crudGetManyReferenceAction } from 'react-admin';

import { getIds, getReferences, getTotal, nameRelatedTo } from './oneToMany';

const SORT_ASC = 'ASC';
const SORT_DESC = 'DESC';

class ReferenceManyFieldController extends Component {
  constructor(params) {
    super(params);

    this.state = {
      sort: this.props.sort,
      page: 1,
      perPage: this.props.perPage,
      hasInitData: typeof this.props.initialCount !== 'undefined',
    };
  }

  // // NOTE: because we already have initial data, no need to fetch on component mount
  // componentDidMount() {
  //   if (!this.state.hasInitData) {
  //     this.fetchReferences();
  //   }
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.record.id !== nextProps.record.id ||
      !lodashIsEqual(this.props.filter, nextProps.filter)
    ) {
      this.fetchReferences(nextProps);
    }

    if (!lodashIsEqual(this.props.sort, nextProps.sort)) {
      this.setState({ sort: nextProps.sort }, this.fetchReferences);
    }
  }

  setSort = field => {
    const order =
      this.state.sort.field === field && this.state.sort.order === SORT_ASC ? SORT_DESC : SORT_ASC;
    this.setState({ sort: { field, order } }, this.fetchReferences);
  };

  setPage = page => this.setState({ page }, this.fetchReferences);

  setPerPage = perPage => this.setState({ perPage }, this.fetchReferences);

  fetchReferences({ reference, record, resource, target, filter, source } = this.props) {
    const { crudGetManyReference } = this.props;
    const { page, perPage, sort } = this.state;
    const relatedTo = nameRelatedTo(reference, record[source], resource, target, filter);

    crudGetManyReference(
      reference,
      target,
      record[source],
      relatedTo,
      { page, perPage },
      sort,
      filter,
      source,
    );
  }

  render() {
    const {
      resource,
      reference,
      data,
      ids,
      children,
      basePath,
      total,
      initialData,
      initialCount,
    } = this.props;

    const { page, perPage, hasInitData } = this.state;

    const referenceBasePath = basePath.replace(resource, reference);
    const mustUseInitData = page === 1 && hasInitData;

    const preparedData = {};
    if (mustUseInitData) {
      for (const row of initialData) {
        preparedData[row.id] = row;
      }
    }

    return children({
      currentSort: this.state.sort,
      data: mustUseInitData ? preparedData : data,
      ids: mustUseInitData ? initialData.map(row => row.id) : ids,
      loadedOnce: hasInitData || typeof ids !== 'undefined',
      page,
      perPage,
      referenceBasePath,
      setPage: this.setPage,
      setPerPage: this.setPerPage,
      setSort: this.setSort,
      total: mustUseInitData ? initialCount : total,
    });
  }
}

ReferenceManyFieldController.defaultProps = {
  filter: {},
  perPage: 10,
  sort: { field: 'id', order: 'DESC' },
  source: 'id',
};

function mapStateToProps(state, props) {
  const relatedTo = nameRelatedTo(
    props.reference,
    props.record[props.source],
    props.resource,
    props.target,
    props.filter,
  );

  return {
    data: getReferences(state, props.reference, relatedTo),
    ids: getIds(state, relatedTo),
    total: getTotal(state, relatedTo),
  };
}

const mapDispatchToProps = {
  crudGetManyReference: crudGetManyReferenceAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceManyFieldController);

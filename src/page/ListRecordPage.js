import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import withWidth from '@material-ui/core/withWidth/withWidth';
import { withStyles } from '@material-ui/core';
import lodashGet from 'lodash/get';

import DynamicList from '../container/DynamicList';
import { getNoteInfo, hasNote, hasReportEditable } from '../helper/MetaHelper';
import { closeNoteStreamAction } from '../redux/listPage/action';
import LoadingBox from '../component/LoadingBox';
import { NewMetaContext } from '../container/NewMetaContext';
import CheckResourceReady from '../container/CheckResourceReady';

const ListRecordPage = props => {
  const {
    staticContext,
    classes,
    showNoteStream,
    closeNoteStream,
    showDevExtremeTopFilter,
    showDevExtremeGrouping,
    resource,
    updateReport,
    theme,
    width,
    ...rest
  } = props;

  const { getMeta } = useContext(NewMetaContext);
  const metaData = getMeta(resource);

  if (!metaData) {
    return <LoadingBox />;
  }

  const isReport = resource.indexOf('report') === 0;
  const isReportEditable = hasReportEditable(metaData);

  const resourceHasNoteStream = hasNote(metaData);
  if (resourceHasNoteStream) {
    // trigger to get meta
    const noteRelation = getNoteInfo(metaData);
    getMeta(`${noteRelation.moduleName}/${noteRelation.moduleTableName}`);
  }

  const isSlideOpen = () => {
    return resourceHasNoteStream && showNoteStream;
  };

  const isOnMobile = theme.breakpoints.width(width) < theme.breakpoints.width('md');
  const closeSlideIfOpen = () => {
    if (isSlideOpen()) {
      closeNoteStream();
    }
  };

  const hasCreate = lodashGet(metaData, ['config', 'allowAdd'], true);
  const hasEdit = lodashGet(metaData, ['config', 'allowEdit'], true);
  const hasDelete = lodashGet(metaData, ['config', 'allowDelete'], true);

  return (
    <CheckResourceReady resourceName={resource}>
      <DynamicList
        {...rest}
        resource={resource}
        metaData={metaData}
        hasList={true}
        hasCreate={!isReport && hasCreate}
        hasEdit={!isReport && hasEdit}
        hasShow={!isReport}
        hasDelete={!isReport && hasDelete}
        enableSelection={true}
        basePath={`/${resource}`}
        slideComponent={null}
        isSlideOpen={isSlideOpen()}
        onRootClick={isOnMobile ? closeSlideIfOpen : undefined}
        isTopFilterOpen={showDevExtremeTopFilter}
        isGroupingOpen={showDevExtremeGrouping}
        quickEditRowCallback={isReportEditable ? updateReport : null}
        data-test-is-slide-open={isSlideOpen()}
      />
    </CheckResourceReady>
  );
};

ListRecordPage.propTypes = {
  resource: PropTypes.string.isRequired,
  updateReport: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { match }) => {
  const { moduleName, moduleTableName } = match.params;
  const resource = `${moduleName}/${moduleTableName}`;

  return {
    resource: resource.toLowerCase(),
    showNoteStream: state.listPage.showNoteStream,
    showDevExtremeTopFilter: state.listPage.showDevExtremeTopFilter,
    showDevExtremeGrouping: state.listPage.showDevExtremeGrouping,
  };
};

const mapDispatchToProps = {
  closeNoteStream: closeNoteStreamAction,
};

export default compose(
  withWidth(),
  withStyles({}, { withTheme: true }),
  connect(mapStateToProps, mapDispatchToProps),
)(ListRecordPage);

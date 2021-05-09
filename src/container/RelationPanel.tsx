import React, { useState, useRef, useEffect, useMemo, FC } from 'react';
import compose from 'recompose/compose';
import { makeStyles } from '@material-ui/core';
import lodashGet from 'lodash/get';
import { useHistory } from 'react-router-dom';
import { getParamFromUrl } from '../helper/UrlHelper';
import SettingHOC, { GET_SETTING, GET_SETTING_FOR_USER } from './SettingHOC';
import TableRelation from '../component/relation/TableRelation';
import DynamicRelation from '../component/relation/DynamicRelation';
import { RelationPanelType } from '../component/relation/RelationTypes';

export const KEY_SCROLL_TO = 'scrollTo';
const initialRelationData = {
  TotalCount: 0,
  Data: [],
};

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: 40,
    display: 'flex',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },

  expansionPanel: {
    boxShadow: 'none',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },

  expansionPanelSummary: {
    padding: 0,
  },
  icon: {
    padding: 0,
  },
}));

const RelationPanel: FC<RelationPanelType> = props => {
  const {
    relationPath,
    relationMetaData,
    parentResource,
    parentRecord,
    locale,
    relation,
    isSettingReady,
    location,
    parentProcessUniqueId,
    parentPositionId,
    parentStateId,
    relationResource,
    match,
    childFieldName,
  } = props;

  const { moduleTableTitle, translatedTitle, title, id: relationId, reportId } = relation;
  const isReport = !!reportId;
  const history = useHistory();
  const classes = useStyles(props);
  const element = useRef<HTMLDivElement>(null);

  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(!isReport);
  const [isPreviouslyOpened, setIsPreviouslyOpened] = useState<boolean>(!isReport);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [relationData, setRelationData] = useState(initialRelationData);

  /**
   * Prepare relation title based on meta and locale
   * @constant {string} relationTitle
   */
  const relationTitle = useMemo(
    () => lodashGet(translatedTitle, locale, moduleTableTitle || title),
    [translatedTitle, locale, moduleTableTitle],
  );

  /**
   * Expand or Collapse relation panel
   * @function toggleOpenPanel
   * @returns {void}
   */
  const toggleOpenPanel = (): void => {
    setIsPanelOpen(!isPanelOpen);
    setIsPreviouslyOpened(true);
  };

  /**
   * Hnadle grid row selection
   * @function handleOnSelect
   * @param {number} gridIds
   * @returns {void}
   */
  const handleOnSelect = (gridIds: number[]): void => {
    setSelectedIds(gridIds);
  };

  /**
   * Scroll to specified relation based  on URL
   */
  useEffect(() => {
    const scrollToTarget = getParamFromUrl(location.search, KEY_SCROLL_TO);
    if (childFieldName === scrollToTarget && element && element.current) {
      element.current.scrollIntoView();
      history.replace({
        search: '',
      });
    }
  }, [location]);

  useEffect(() => {
    if (parentRecord[relationPath] && parentRecord[relationPath].Data) {
      setRelationData(parentRecord[relationPath]);
    }
  }, [parentRecord]);

  // if (!parentRecord || !relationMetaData || !isSettingReady) {
  //   return <RelationLoading title={relationTitle} element={element} />;
  // }
  const parentInfo = {
    parentResource,
    parentProcessUniqueId,
    parentPositionId,
    parentStateId,
  };

  const dynamicRelation = (
    <DynamicRelation
      {...props}
      parentInfo={parentInfo}
      selectedIds={selectedIds}
      relationData={relationData}
      handleOnSelect={handleOnSelect}
    />
  );

  return (
    <div className={classes.container} ref={element} data-test-relation-name={relationResource}>
      <TableRelation
        {...props}
        parentInfo={parentInfo}
        relationTitle={relationTitle}
        selectedIds={selectedIds}
        isPreviouslyOpened={isPreviouslyOpened}
        dynamicRelation={dynamicRelation}
        relationData={relationData}
      />
    </div>
  );
};

export default compose(SettingHOC([GET_SETTING, GET_SETTING_FOR_USER]))(RelationPanel);

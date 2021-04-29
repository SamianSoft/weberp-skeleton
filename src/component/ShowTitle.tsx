import React, { FC, useMemo } from 'react';
import { useTranslate, useLocale, Identifier } from 'react-admin';
import lodashGet from 'lodash/get';

import { isEmpty, isEmptyObject } from '../helper/DataHelper';

import {
  getProcessInfo,
  getProcessTaskInfo,
  getTitleFieldNames,
  getTranslatedName,
} from '../helper/MetaHelper';

interface ShowTitlePropsInterFace {
  metaData: object;
  record: {
    id: Identifier;
    __positionid_value: string;
    __stateid_value: string;
    __processuniqueid: string;
    positionid: number;
    stateid: number;
  };
}

const ShowTitle: FC<ShowTitlePropsInterFace> = props => {
  const { metaData, record } = props;
  const translate = useTranslate();
  const locale = useLocale();

  /**
   * run `getProcessInfo`
   * @function processInfo
   * @returns {Object}
   */
  const processInfo = useMemo(() => {
    return getProcessInfo(metaData, lodashGet(record, '__processuniqueid'));
  }, [metaData, record]);

  /**
   * run `getProcessTaskInfo`
   * @function processTaskInfo
   * @returns {Object}
   */
  const processTaskInfo = useMemo(() => {
    return getProcessTaskInfo(
      metaData,
      lodashGet(record, '__processuniqueid'),
      lodashGet(record, 'positionid'),
      lodashGet(record, 'stateid'),
    );
  }, [metaData, record]);

  /**
   * create title name base on table name
   * @function prepareRecordName
   * @returns {String}
   */
  const prepareRecordName = useMemo(() => {
    let recordName = '';

    if (record && !isEmpty(record.id)) {
      recordName = `#${record.id}`;
    } else {
      recordName = translate('ra.page.create', {
        name: getTranslatedName(metaData, locale),
      });
    }

    const titleFieldList = getTitleFieldNames(metaData);
    if (titleFieldList && titleFieldList.length && !isEmptyObject(record)) {
      recordName = '';
      titleFieldList.forEach(fieldName => {
        if (!record[fieldName]) {
          return;
        }
        recordName += record[fieldName] + ' ';
      });
    }

    return recordName;
  }, [metaData, record]);

  /**
   * create process title
   * @function prepareTitleParts
   * @returns {َArray}
   */
  const prepareTitleParts = useMemo(() => {
    const titleParts: string[] = [];

    if (!isEmptyObject(processInfo)) {
      titleParts.push(
        translate('process.name') +
          ' : ' +
          lodashGet(processInfo, ['translatedTitle', locale], lodashGet(processInfo, 'title')),
      );
    }

    if (!isEmptyObject(processTaskInfo)) {
      titleParts.push(
        lodashGet(
          processTaskInfo,
          ['translatedTitle', locale],
          lodashGet(processTaskInfo, 'title'),
        ),
      );
    }

    if (record && record.__positionid_value) {
      titleParts.push(record.__positionid_value);
    }

    if (record && record.__stateid_value) {
      titleParts.push(record.__stateid_value);
    }

    return titleParts;
  }, [processInfo, processTaskInfo, record]);

  return (
    <div style={{ display: 'flex' }} data-test="titleHeader">
      <div>{prepareRecordName}</div>
      <div style={{ margin: '0 16px' }}>{prepareTitleParts.join(' / ')}</div>
    </div>
  );
};

export default ShowTitle;

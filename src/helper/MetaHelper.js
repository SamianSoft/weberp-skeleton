import lodashFind from 'lodash/find';
import lodashGet from 'lodash/get';
import lodashFilter from 'lodash/filter';
import lodashDiffBy from 'lodash/differenceBy';

import { clone, mergeAndClone, isEmptyObject, isEmpty } from './DataHelper';
import moment from 'moment-jalaali';
import { SERVER_DATE_FORMAT } from '../core/configProvider';

const mockField = {
  dataType: { erp: 'string', sql: 'varchar(max)', simple: 'string' },
  disabled: null,
  hidden: null,
  required: null,
  id: null,
};

export function getFormDefaultValue(list, globalParams) {
  if (!list || isEmptyObject(list)) {
    return null;
  }

  const data = {};

  list.forEach(field => {
    const name = field.name;
    // don't set defaults for process fields, they always must be set from server
    if (name === 'stateid' || name === 'positionid') {
      return;
    }

    const erpType = lodashGet(field, 'dataType.erp');
    const simpleType = lodashGet(field, 'dataType.simple');
    const defaultValue = lodashGet(field, 'defaultValue', null);
    const fieldGlobalParam = lodashGet(field, 'defaultValueGlobalParameter');

    if (erpType === 'computed' || erpType === 'searchDialog' || erpType === 'tag') {
      data[name] = defaultValue;
    } else if (erpType === 'dropdown' && field.dropdown) {
      data[name] = fieldGlobalParam ? lodashGet(globalParams, fieldGlobalParam) : defaultValue;
    } else if (simpleType === 'datetime' || simpleType === 'date') {
      data[name] = lodashGet(field, 'required')
        ? moment()
            .locale('en')
            .format(SERVER_DATE_FORMAT)
        : null;
    } else if (simpleType === 'boolean') {
      data[name] = field.defaultValue ? !!field.defaultValue : false;
    } else {
      data[name] = defaultValue;
    }
  });

  return data;
}

export function getTreeParentFieldName(list) {
  if (!list || isEmptyObject(list)) {
    return null;
  }
  if (list.config.treeParentField) {
    return list.fields[list.config.treeParentField].name;
  }
  return null;
}

/**
 * By default, we should first 5 cols to increase page render and remove null/undefined items
 * @param {object} list metaData
 * @param {boolean} filterFirstFive show first five columns?
 * @returns {array} filtered column list
 */
export function getGridColumns(list, filterFirstFive = false) {
  if (!list || isEmptyObject(list) || !isEmpty(list.error)) {
    return null;
  }
  const columns = [];
  // in report grids
  if (list.reportId) {
    list.columns.forEach((column, index) => {
      if (filterFirstFive && index < 5) {
        // show first five item
        mockField.id = column.relatedName;
        const tempColumn = mergeAndClone(column, mockField);
        tempColumn.relatedName = `${tempColumn.relatedName}`;
        columns.push(tempColumn);
      } else if (!filterFirstFive) {
        mockField.id = column.relatedName;
        const tempColumn = mergeAndClone(column, mockField);
        tempColumn.relatedName = `${tempColumn.relatedName}`;
        columns.push(tempColumn);
      }
    });
  } else {
    // in normal table grids
    list.gridColumns.forEach((fieldId, index) => {
      if (typeof list.fields[fieldId] === 'undefined') {
        console.log(`fieldId ${fieldId} is not in fields!`);
        columns.push(null);
      }
      if (filterFirstFive && index < 5) {
        // show first five item
        columns.push(list.fields[fieldId]);
      } else if (!filterFirstFive) {
        columns.push(list.fields[fieldId]);
      }
    });
  }
  return columns;
}

export function getFields(list) {
  if (!list || isEmptyObject(list)) {
    return null;
  }

  // in report grids
  if (list.reportId) {
    console.log('getFields in report');
    return null;
  }
  const primaryField = getPrimaryField(list);

  const clonedFields = clone(list.fields);
  clonedFields[primaryField.id].disabled = true;

  // in normal table grids
  return clonedFields;
}

export function getFilterColumns(list) {
  if (!list || isEmptyObject(list)) {
    return null;
  }

  // in report grids
  if (list.reportId) {
    return list.parameters.map(parameter => ({
      ...parameter.field,
      name: parameter.key, // this should be string
      id: parameter.key, // this should be string
      defaultOperator: parameter.defaultOperator,
      onlyEqualCondition: parameter.onlyEqualCondition,
    }));
  }

  // in normal table grids
  return list.filterColumns.map(fieldId => {
    if (typeof list.fields[fieldId] === 'undefined') {
      console.log(`fieldId ${fieldId} is not in fields!`);
      return null;
    }

    return list.fields[fieldId];
  });
}

export function getFieldsById(list, fieldList) {
  const tempFields = [];
  if (!list || isEmptyObject(list)) {
    return tempFields;
  }

  if (list.reportId) {
    fieldList.forEach(relatedName => {
      const column = lodashFind(list.columns, ['relatedName', relatedName]);
      if (typeof column !== 'undefined') {
        mockField.id = column.relatedName;
        const tempColumn = mergeAndClone(column, mockField);
        tempColumn.relatedName = `${tempColumn.relatedName}`;
        tempFields.push(tempColumn);
      } else {
        console.log(`fieldName ${relatedName} is not in columns!`);
      }
    });
  } else {
    fieldList.forEach(id => {
      if (typeof list.fields[id] !== 'undefined') {
        tempFields.push(list.fields[id]);
      } else {
        console.log(`fieldId ${id} is not in fields!`);
      }
    });
  }

  return tempFields;
}

export function getTitleFieldNames(list) {
  if (!list || !list.captionColumns || !list.captionColumns.length) {
    return [];
  }

  // in normal table grids
  return list.captionColumns.map(fieldId => {
    if (typeof list.fields[fieldId] === 'undefined') {
      console.log(`fieldId ${fieldId} is not in fields!`);
      return null;
    }

    return list.fields[fieldId].name;
  });
}

export function getPermanentFilterFieldNames(list) {
  if (!list) {
    return [];
  }

  const titleFields = getTitleFieldNames(list);

  const reportFilterList = [];
  // if (list.parameters) {
  //   list.parameters.
  // }

  return [...titleFields, ...reportFilterList];
}

export function getTranslatedName(list, locale) {
  if (!list || isEmptyObject(list) || !locale) {
    return null;
  }

  const translatedTitleLocale = lodashGet(
    list,
    ['translatedTitle', locale],
    lodashGet(list, 'title'),
  );

  if (translatedTitleLocale) {
    return translatedTitleLocale;
  }

  // prettier-ignore
  const translatedCaptionLocale = lodashGet(list, ['config', 'translatedCaption', locale], lodashGet(list, ['config', 'caption']));
  if (translatedCaptionLocale) {
    return translatedCaptionLocale;
  }

  return lodashGet(list, ['config', 'caption'], lodashGet(list, ['config', 'title']));
}

export function getShowSummaryColumnList(list) {
  if (!list || !list.quickColumns) {
    return null;
  }

  return list.quickColumns.map(fieldId => {
    if (typeof list.fields[fieldId] === 'undefined') {
      console.log(`fieldId ${fieldId} is not in fields!`);
      return null;
    }

    return list.fields[fieldId];
  });
}

/**
 * `getMaxMinOfRow` finds the last row-index and checks row-span and returns max of rows.
 * @function getMaxMinOfRow
 * @param {Array} fieldsLayout
 * @returns {Number}
 */
export const getMaxMinOfRow = fieldsLayout => {
  return fieldsLayout.reduce((acc, { rowIndex, rowSpan }) => {
    if (rowIndex >= acc) {
      acc = rowIndex;
      if (rowSpan) {
        acc = acc + rowSpan - 1;
      }
    }

    return acc;
  }, 0);
};

/**
 * This function creates an empty layout according to `maxRow`, and `columnCount`.
 * @function createEmptyLayout
 * @param {Number} maxRow
 * @param {Number} columnCount
 * @returns {Array}
 */
export const createEmptyLayout = (maxRow, columnCount) => {
  const preparedEmptyArray = [];

  for (let i = 0; i <= maxRow; i++) {
    preparedEmptyArray[i] = new Array(columnCount).fill('empty');
  }

  return preparedEmptyArray;
};

/**
 * `createLayout` with using `rowIndex`, `columnIndex`, `rowSpan` and `colSpan` make a layout for the form .
 * @function createLayout
 * @param {Array} fieldsLayout
 * @param {Number} columnCount
 * @param {Object} fieldSet
 * @returns {Array}
 */
export const createLayout = (fieldsLayout, columnCount, fieldSet) => {
  if (!fieldsLayout || !fieldsLayout.length || !fieldSet || isEmptyObject(fieldSet)) {
    return [];
  }

  const maxRow = getMaxMinOfRow(fieldsLayout);
  const preparedGroup = clone(createEmptyLayout(maxRow, columnCount));

  fieldsLayout.forEach(item => {
    const { fieldId, rowIndex, columnIndex, rowSpan = 0, colSpan = 0 } = item;
    fieldSet[fieldId] = { ...fieldSet[fieldId], colSpan, rowSpan };

    if (rowSpan > 1) {
      for (let i = 0; i < rowSpan; i++) {
        if (colSpan > 1) {
          for (let j = columnIndex; j < columnIndex + colSpan; j++) {
            preparedGroup[rowIndex + i][j] = null;
          }
        } else {
          preparedGroup[rowIndex + i][columnIndex] = null;
        }
      }
    } else if (colSpan > 1) {
      for (let j = columnIndex; j < columnIndex + colSpan; j++) {
        preparedGroup[rowIndex][j] = null;
      }
    } else {
      preparedGroup[rowIndex][columnIndex] = null;
    }

    preparedGroup[rowIndex].splice(columnIndex, 1, fieldSet[fieldId]);
  });

  return preparedGroup;
};

export function prepareGroups(
  list,
  defaultColumnCount,
  processUniqueId = null,
  positionId = null,
  stateId = null,
  quickMode = false,
  disabledFields = null,
) {
  const groups = getGroups(list, quickMode);

  const preparedList = [];
  for (const groupId in groups) {
    const group = groups[groupId];
    const fieldSet = getGroupFieldsFromFieldsList(
      list,
      group.fields,
      processUniqueId,
      positionId,
      stateId,
      disabledFields,
    );
    const createdLayout = createLayout(
      group.fieldsLayout,
      group.columnCount || defaultColumnCount,
      fieldSet,
    );

    preparedList.push({
      id: parseInt(groupId, 10),
      translatedTitle: group.translatedTitle, // always use translated strings
      columnCount: group.columnCount || defaultColumnCount,
      layout: createdLayout,
    });
  }

  return preparedList;
}

export function getGroupFieldsFromFieldsList(
  list,
  groupFields,
  processUniqueId = null,
  positionId = null,
  stateid = null,
  disabledFields = null,
) {
  const fieldSet = {};

  groupFields.forEach(fieldId => {
    if (typeof list.fields[fieldId] === 'undefined') {
      console.log(`fieldId ${fieldId} is not in fields!`);
      return null;
    }
    fieldSet[fieldId] = list.fields[fieldId];
  });

  // if a process is available, try to get custom field properties
  if (processUniqueId && list.processes) {
    const processInfo = lodashFind(list.processes, { uniqueId: processUniqueId });
    if (processInfo) {
      let taskInfo = null;

      if (positionId && stateid) {
        taskInfo = lodashFind(processInfo.tasks, {
          positionId: parseInt(positionId),
          stateId: parseInt(stateid),
        });

        if (!taskInfo) {
          // throw new Error(
          //   `unable to find task with position "${positionid}" and state "${stateid}" in process "${processuniqueid}"`,
          // );
          console.error(
            `unable to find task with position "${positionId}" and state "${stateid}" in process "${processUniqueId}"`,
          );
        }
      } else {
        console.log('going with default task of process');
        taskInfo = processInfo.firstTask;
      }

      if (taskInfo) {
        Object.keys(taskInfo.fields).forEach(fieldId => {
          if (typeof list.fields[fieldId] === 'undefined') {
            console.log(`fieldId ${fieldId} is not in fields!`);
            return null;
          }

          // combine and override field properties
          fieldSet[fieldId] = {
            ...list.fields[fieldId],
            ...taskInfo.fields[fieldId],
          };
        });

        Object.keys(list.fields).forEach(fieldId => {
          if (typeof taskInfo.fields[fieldId] === 'undefined' && fieldSet[fieldId]) {
            fieldSet[fieldId].disabled = true;
          }
        });
      }
    }
  }

  if (disabledFields && !isEmptyObject(disabledFields)) {
    Object.keys(disabledFields).forEach(fieldId => {
      if (fieldSet[fieldId]) {
        fieldSet[fieldId].disabled = true;
      }
    });
  }

  return fieldSet;
}

export function getAllFieldList(list) {
  if (!list || isEmptyObject(list)) {
    return null;
  }
  const primaryField = getPrimaryField(list);

  return Object.keys(list.fields).map(fieldId => {
    if (typeof list.fields[fieldId] === 'undefined') {
      console.log(`fieldId ${fieldId} is not in fields!`);
      return null;
    }

    if (primaryField && fieldId == primaryField.id) {
      list.fields[fieldId].disabled = true;
    }

    return list.fields[fieldId];
  });
}
/**
 * Return relations list
 * @param {object} list Metadata
 * @param {object} record Record
 * @returns {undefined | Array} array of relations
 */
export function getRelationList(list, record) {
  if (!list || isEmptyObject(list)) {
    return null;
  }

  return removeHiddenRelations(list, record, list.relations, 'deactiveSubpanels');
}

/**
 * Remove relations which have isHidden:true in current process task
 * @param {object} list Metadata
 * @param {object} record Record
 * @param {object[]} relations Relations array
 * @param {string} field the field which should be checked: deactiveReports/deactiveSubpanel
 * @returns {Array} array of relations/filteredRelations
 */
export function removeHiddenRelations(list, record, relations, field) {
  const { processuniqueid, positionid, stateid } = record;
  const currentProcess = getProcessInfo(list, processuniqueid);
  const currentTask = getProcessTaskInfo(list, processuniqueid, positionid, stateid);
  const hiddenRelations = findHiddenRelations(currentTask, field);

  if (!currentProcess || !currentTask || !hiddenRelations) {
    return relations;
  }

  return filteredRelations(relations, hiddenRelations, field);
}

/**
 * Returns a list of hidden relations
 * @param {object} task Current Task
 * @param {string} field deactiveReports/deactiveSubpanel
 * @returns {undefined|Array} If there is not a deactiveReports/deactiveSubpanel field returns undefiend, else returns  an array of relations to be removed
 */
export function findHiddenRelations(task, field) {
  if (!task || !task[field] || !task[field].length) {
    return;
  }

  return task[field].filter(item => {
    if (field === 'deactiveReports') {
      item.id = item.reportId;
    }
    if (item.isHidden) {
      return item;
    }
  });
}

/**
 * Remove hidden relations from relations array
 * @param {object[]} relations list of all relations from metadata
 * @param {*} hiddenRelations list of relatiosn which should be removed
 * @returns {Array} An array of filtered relations
 */
export function filteredRelations(relations, hiddenRelations, field) {
  return lodashDiffBy(relations, hiddenRelations, sub => {
    if (field === 'deactiveReports') {
      return sub.id;
    }
    return sub.moduleName && sub.moduleTableName;
  });
}

/**
 * Return report relations list for a record
 * @param {object} list Metadata
 * @param {object} record Record
 */
export function getSingleRecordReportRelationList(list, record) {
  if (!list || isEmptyObject(list)) {
    return null;
  }

  const relationReportList = [];
  if (list.reports.length) {
    list.reports.forEach(report => {
      if (report.related === 'SingleRecord') {
        relationReportList.push(report);
      }
    });
  }

  return removeHiddenRelations(list, record, relationReportList, 'deactiveReports');
}

export function getReportInfo(list, reportId) {
  if (!list || !list.reports || !list.reports.length || isEmptyObject(list)) {
    return null;
  }

  return lodashFind(list.reports, { id: reportId });
}

export function isModuleTable(list) {
  if (!list || isEmptyObject(list)) {
    return false;
  }

  return !list.reportId;
}

export function hasNote(list) {
  return !!lodashGet(list, ['config', 'hasNote']);
}

export function hasReportEditable(list) {
  return !!lodashGet(list, 'editable');
}

export function getNoteInfo(list) {
  const note = lodashGet(list, ['config', 'hasNote']);
  if (note && note.moduleName && note.moduleTableName) {
    return note;
  }

  return null;
}

export function getGroups(list, quickMode = false) {
  let tempGroupList = lodashGet(list, ['groups']);
  if (quickMode && list.quickGroups && !isEmptyObject(list.quickGroups)) {
    tempGroupList = lodashGet(list, ['quickGroups']);
  }

  return tempGroupList;
}

export function getTabs(list, quickMode = false) {
  let tempTabPages = lodashGet(list, ['tabPages']);
  if (quickMode && list.quickTabPages && list.quickTabPages.length) {
    tempTabPages = lodashGet(list, ['quickTabPages']);
  }
  return tempTabPages;
}

export function getColumnCount(list) {
  return lodashGet(list, ['config', 'columnCount']);
}

/**
 * check meta and return relation list with relationFieldName
 * @param {Object} list
 * @returns {Object}
 */
export function getRelationsInForm(list) {
  if (!list || isEmptyObject(list)) {
    return null;
  }

  const relationList = [];

  list.relations.forEach(relation => {
    relationList.push({
      ...relation,
      relationFieldName: `${relation.moduleName}/${relation.moduleTableName}`,
    });
  });

  return relationList;
}

export function getFileInfo(list) {
  const fileInfo = lodashGet(list, ['config', 'hasFile']);

  if (fileInfo && fileInfo.moduleName && fileInfo.moduleTableName) {
    return fileInfo;
  }
  return null;
}

export function getProcessList(list) {
  if (!list || isEmptyObject(list)) {
    return null;
  }

  if (!list.processes || !list.processes.length) {
    return null;
  }

  return list.processes;
}

export function getProcessLines(list, processuniqueid, positionid, stateid) {
  if (
    isEmptyObject(list) ||
    !list ||
    !list.processes ||
    !list.processes.length ||
    !processuniqueid ||
    !positionid ||
    !stateid
  ) {
    return null;
  }

  const taskInfo = getProcessTaskInfo(list, processuniqueid, positionid, stateid);
  if (!taskInfo) {
    return null;
  }

  return taskInfo.lines;
}

export function getProcessTaskInfo(list, processuniqueid, positionid, stateid) {
  const processInfo = getProcessInfo(list, processuniqueid);
  if (!processInfo) {
    return null;
  }

  return lodashFind(processInfo.tasks, {
    positionId: parseInt(positionid),
    stateId: parseInt(stateid),
  });
}

export function getProcessInfo(list, processuniqueid) {
  if (
    isEmptyObject(list) ||
    !list ||
    !list.processes ||
    !list.processes.length ||
    !processuniqueid
  ) {
    return null;
  }

  return lodashFind(list.processes, { uniqueId: processuniqueid });
}

export function getServices(list) {
  if (!list || isEmptyObject(list) || !list.actions || !list.actions.length) {
    return null;
  }

  return list.actions;
}

export function getServerValidationFieldList(list) {
  if (!list || isEmptyObject(list)) {
    return null;
  }

  // validationActions
  return Object.keys(list.validationActions).map(fieldId => {
    if (typeof list.fields[fieldId] === 'undefined') {
      console.log(`fieldId ${fieldId} is not in fields!`);
      return null;
    }

    return {
      service: list.validationActions[fieldId],
      field: list.fields[fieldId],
    };
  });
}

export function getAsyncValidationInfoForField(meta, fieldId) {
  if (!meta || !fieldId) {
    return undefined;
  }

  return lodashGet(meta, ['validationActions', fieldId, '0']);
}

export function getTabList({
  list,
  defaultColumnCount,
  processuniqueid = null,
  positionid = null,
  stateid = null,
  quickMode = false,
  disabledFields = null,
}) {
  const tabList = getTabs(list, quickMode);

  const allGroupList = prepareGroups(
    list,
    defaultColumnCount,
    processuniqueid,
    positionid,
    stateid,
    quickMode,
    disabledFields,
  );

  return tabList.map(tab => {
    const groupList =
      quickMode && tab.quickGroups && tab.quickGroups.length
        ? tab.quickGroups.map(groupId => lodashFind(allGroupList, { id: parseInt(groupId, 10) }))
        : tab.groups.map(groupId => lodashFind(allGroupList, { id: parseInt(groupId, 10) }));

    return {
      ...tab,
      id: parseInt(tab.name, 10),
      groupList,
      resource: `${tab.moduleName}/${tab.tableName}`,
    };
  });
}

export function getOneToOneRelationList(list) {
  if (!list || !list.oneToOneRelations || !list.oneToOneRelations.length) {
    return [];
  }

  const tabList = [];
  list.oneToOneRelations.forEach(oneToOneTab => {
    for (const tab of oneToOneTab['tabPages']) {
      tabList.push({
        ...tab,
        isOneToOne: true,
      });
    }
  });
  return tabList;
}

export function mergeTabDataWithSetting(
  list,
  processList,
  defaultTabList,
  storedTabList,
  tableRelationList = [],
  reportRelationList = [],
  fileRelation = [],
  noteRelation = [],
) {
  const fields = getFields(list);

  // work on a copy of original data

  // t = tab index
  // g = group index
  // l = layoutRow index
  // f = field index
  const clonedTabList = processList
    ? clone(defaultTabList)
    : storedTabList
    ? clone(storedTabList)
    : clone(defaultTabList);

  for (const t in clonedTabList) {
    for (const g in clonedTabList[t].groupList) {
      for (const l in clonedTabList[t].groupList[g].layout) {
        for (const f in clonedTabList[t].groupList[g].layout[l]) {
          const clonedField = clonedTabList[t].groupList[g].layout[l][f];
          // if this position has no field in it
          if (!clonedField) {
            continue;
          }

          const originalField = fields[clonedField.id];
          if (!originalField) {
            console.log(`id ${clonedField.id} not found in original fields`);
            clonedTabList[t].groupList[g].layout[l][f] =
              clonedField === 'empty' ? clonedField : null;
            continue;
          }

          // push the tab title and tab id to each field of each grouplist
          clonedTabList[t].groupList[g].layout[l][f]['tabTitle'] = clonedTabList[t]['title'];
          clonedTabList[t].groupList[g].layout[l][f]['tabId'] = clonedTabList[t]['id'];
          clonedTabList[t].groupList[g].layout[l][f]['translatedTabTitle'] =
            clonedTabList[t]['translatedTitle'];

          clonedTabList[t].groupList[g].layout[l][f] = mergeAndClone(originalField, clonedField);
        }
      }
    }

    clonedTabList[t].tableRelationList = tableRelationList;
    clonedTabList[t].reportRelationList = reportRelationList;
    clonedTabList[t].fileRelation = fileRelation;
    clonedTabList[t].noteRelation = noteRelation;
  }

  return clonedTabList;
}

export function getPrimaryField(list) {
  if (!list || !list.fields || !list.config) {
    return null;
  }

  // config.primaryField contains id of pk
  const pkId = list.config.primaryField;
  return list.fields[pkId];
}

export function isRecordEditable(list, record) {
  if (isEmptyObject(record)) {
    return false;
  }

  if (typeof record.iseditable !== 'undefined' && !record.iseditable) {
    return false;
  }

  const processTaskInfo = getProcessTaskInfo(
    list,
    record.__processuniqueid,
    record.positionid,
    record.stateid,
  );

  return !(processTaskInfo && !processTaskInfo.allowEdit);
}

export function getReportChildren(list, locale) {
  if (list && list.childs && list.childs.length) {
    return list.childs.map(({ reportId /*, title */ }) => ({
      title: null, // make it read from child metaData
      childResource: `report/${reportId}`,
    }));
  }

  if (list && list.tabsColumns) {
    const parentId = list.id;
    const parentName = getTranslatedName(list, locale);

    return Object.keys(list.tabsColumns).map((tab, index) => ({
      title: `${parentName} - ${index + 1}`, // don't let it
      childResource: `report/${parentId}/${index}`,
    }));
  }

  return [];
}

export function isReportExecutable(list) {
  return !!lodashGet(list, 'executable');
}

export function getGroupingColumns(fieldList) {
  if (!fieldList || !Array.isArray(fieldList)) {
    return [];
  }

  return fieldList
    .filter(field => (field ? !!field.groupingPriority : false))
    .sort((a, b) => a.groupingPriority - b.groupingPriority);
}

export function getDefaultSort(meta) {
  if (!meta || isEmptyObject(meta)) {
    return undefined;
  }

  const { config, reportId, columns, fields, gridColumns } = meta;

  if (reportId) {
    const columnFound = columns.find(column => column.sortType);
    if (columnFound) {
      return {
        field: `${columnFound.relatedName}`,
        order: columnFound.sortType,
      };
    } else if (columns[0]) {
      // because reports must get a sort, give back first column that we have
      return {
        field: `${columns[0].relatedName}`,
        order: 'DESC',
      };
    }
  } else if (config && !isEmptyObject(config.sort)) {
    return {
      field: config.sort.fieldName,
      order: config.sort.type,
    };
  } else {
    return {
      field: lodashGet(lodashGet(fields, lodashGet(gridColumns, ['0'])), 'relatedName'),
      order: 'DESC',
    };
  }

  return undefined;
}

export function isSingleRecordTable(list) {
  return !!lodashGet(list, 'config.hasOneRow');
}

export function getIsRowReOrderEnabled(list) {
  if (!list || isEmptyObject(list)) {
    return null;
  }
  return !!lodashGet(list, 'config.sort.allowChangingRowOrder');
}

export function getFieldByName(list, fieldName) {
  if (!list || isEmptyObject(list)) {
    return null;
  }

  return lodashFind(list.fields, { name: fieldName });
}

export function getDefaultReportSort(meta, reportId) {
  if (!meta && !reportId) {
    return undefined;
  }

  const report = lodashFind(meta.reports, { id: reportId });

  if (report) {
    const columnFound = report.columns.find(column => column.sortType);
    if (columnFound) {
      return {
        field: `${columnFound.relatedName}`,
        order: columnFound.sortType,
      };
    } else if (report.columns[0]) {
      return {
        field: `${report.columns[0].relatedName}`,
        order: 'DESC',
      };
    }
  }

  return undefined;
}

export function prepareReportFilter(meta, record) {
  if ((isEmptyObject(meta) || !meta) && (isEmptyObject(record) || !record)) {
    return undefined;
  }

  return meta.parameters.map(parameter => {
    return [
      parameter.key,
      parameter.onlyEqualCondition
        ? 'equal'
        : parameter.defaultOperator === 'Empty'
        ? 'equal'
        : parameter.defaultOperator,
      record[parameter.field.name],
    ];
  });
}

export function getRelationPermissionFromProcessTask(meta, record, moduleName, moduleTableName) {
  if (!meta || !record || !moduleName || !moduleTableName) {
    return null;
  }

  const processTaskInfo = getProcessTaskInfo(
    meta,
    record.__processuniqueid,
    record.positionid,
    record.stateid,
  );

  if (!processTaskInfo) {
    return null;
  }

  return lodashFind(processTaskInfo.deactiveSubpanels, { moduleName, moduleTableName });
}

export function isRelationCreateEnabled(meta, record, moduleName, moduleTableName) {
  const relInfo = getRelationPermissionFromProcessTask(meta, record, moduleName, moduleTableName);

  if (relInfo) {
    return !relInfo.disableAdd;
  } else {
    return null;
  }
}

export function isRelationEditEnabled(meta, record, moduleName, moduleTableName) {
  const relInfo = getRelationPermissionFromProcessTask(meta, record, moduleName, moduleTableName);
  if (relInfo) {
    return !relInfo.disableEdit;
  } else {
    return null;
  }
}

export function isRelationDeleteEnabled(meta, record, moduleName, moduleTableName) {
  const relInfo = getRelationPermissionFromProcessTask(meta, record, moduleName, moduleTableName);

  if (relInfo) {
    return !relInfo.disableDelete;
  } else {
    return null;
  }
}

export function getRelationDisabledFields(meta, record, moduleName, moduleTableName) {
  const relInfo = getRelationPermissionFromProcessTask(meta, record, moduleName, moduleTableName);
  if (!relInfo || !relInfo.deActiveFields || !relInfo.deActiveFields.length) {
    return null;
  }

  const result = {};
  for (const fieldId of relInfo.deActiveFields) {
    result[fieldId] = true;
  }

  return result;
}

/**
 * it will return dropdown list from state
 * @function getDropDownListFromState
 * @param {object} field
 * @param {string} type
 * @param {object} state
 * @param {object} metaData
 * @returns {Array | null}
 */
export function getDropDownListFromState(field, type, state, metaData) {
  const fieldName = field[type][0][0];
  const dropId = lodashGet(
    lodashFind(metaData.fields, { name: fieldName }),
    ['dropdown', 'id'],
    null,
  );
  return lodashGet(state, [`dropdown`, dropId], null);
}

export function fieldFileList(fields) {
  if (!fields || isEmptyObject(fields)) {
    return undefined;
  }

  const list = [];
  Object.values(fields).map(field => {
    if (field.dataType.simple === 'file') {
      list.push(field);
    }
  });

  return list;
}

export function prepareShiftProcess(metaData, uniqueId) {
  if (!metaData) {
    return null;
  }

  const process = getProcessInfo(metaData, uniqueId);
  if (!process || !process.tasks || !process.tasks.length) {
    return null;
  }

  return lodashFilter(process.tasks, 'isTransferable');
}

/**
 * check `allowDelete` in config.
 * @function isTreeHasDelete
 * @param {Object} meta
 * @returns {Boolean}
 */
export function isTreeHasDelete(meta) {
  return lodashGet(meta, ['config', 'allowDelete'], false);
}

/**
 * extract all of fields from a custom group list
 * @param {Object} GroupList
 * @returns {Array} fields
 */
export function extractAllFieldsFromCustomGroupList(GroupList) {
  const fields = [];

  if (GroupList && GroupList.length) {
    GroupList.forEach(group => {
      group.groupList.forEach(groupList => {
        groupList.layout.forEach(layout => {
          layout.forEach(field => {
            if (field) {
              fields.push(field);
            }
          });
        });
      });
    });
  }

  return fields;
}

/**
 * Check add, edit and delete relation permission.
 * @function checkPermission
 * @param {boolean | null} permissionType
 * @param {object} relationMetaData
 * @param {string} relationPermissionType
 * @returns {boolean}
 */
export const checkPermission = (permissionType, relationMetaData, relationPermissionType) => {
  if (permissionType !== null) {
    return permissionType;
  }

  if (!isEmptyObject(relationMetaData)) {
    return lodashGet(relationMetaData, ['config', relationPermissionType]);
  }

  return true;
};

/**
 * Prepare add, edit, delete and disabled field for relation.
 * @function preparedRelationPermission
 * @param {object} metaData
 * @param {object} record
 * @param {object} relation
 * @param {object} relationMetaData
 * @returns {object} permission
 */
export const preparedRelationPermission = (metaData, record, relation, relationMetaData) => {
  if (isEmptyObject(relation)) {
    return {
      hasCreate: true,
      hasEdit: true,
      hasDelete: true,
      disabledFieldList: null,
    };
  }

  const createEnabled = isRelationCreateEnabled(
    metaData,
    record,
    relation.moduleName,
    relation.moduleTableName,
  );

  const editEnabled = isRelationEditEnabled(
    metaData,
    record,
    relation.moduleName,
    relation.moduleTableName,
  );

  const deleteEnabled = isRelationDeleteEnabled(
    metaData,
    record,
    relation.moduleName,
    relation.moduleTableName,
  );

  const permission = {
    hasCreate: checkPermission(createEnabled, relationMetaData, 'allowAdd'),
    hasEdit: checkPermission(editEnabled, relationMetaData, 'allowEdit'),
    hasDelete: checkPermission(deleteEnabled, relationMetaData, 'allowDelete'),
    disabledFieldList: getRelationDisabledFields(
      metaData,
      record,
      relation.moduleName,
      relation.moduleTableName,
    ),
  };

  return permission;
};

/**
 * Get name for `parameter` from `field`.
 * @function getParameterName
 * @param {Object} field
 * @returns {String}
 */
export const getParameterName = field => {
  return lodashGet(
    field,
    'relatedParameterName',
    lodashGet(field, 'relatedName', lodashGet(field, 'name')),
  );
};

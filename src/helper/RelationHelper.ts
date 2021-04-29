import { RelationMetaType } from '../component/relation/RelationTypes';
import { getFieldsById, getGridColumns, getPrimaryField } from './MetaHelper';
import { clone } from './DataHelper';

/**
 * Prepare relation grid columns
 * @function getFieldsForDisplay
 * @param {number[] | null} defaultSelected default columns
 * @param {number[] | null} userSelected user selected columns in setting
 * @param {object} relationMetaData
 * @param {number[] | null} disabledFieldList disabled columns
 * @returns {object[]}
 */
export const getFieldsForDisplay = (
  defaultSelected: number[] | null,
  userSelected: number[] | null,
  relationMetaData: RelationMetaType,
  disabledFieldList?: { [x: number]: boolean } | null,
): object[] => {
  let fieldList;
  const gridColumns = getGridColumns(relationMetaData);

  // if user has selected column order
  if (userSelected && userSelected.length) {
    fieldList = getFieldsById(relationMetaData, userSelected);
  }
  // or admin as selected default order
  else if (defaultSelected && defaultSelected.length) {
    fieldList = getFieldsById(relationMetaData, defaultSelected);
  } else if (relationMetaData.reportId) {
    fieldList = gridColumns;
  }
  // else show all columns
  else {
    const primaryField = getPrimaryField(relationMetaData);
    let allFields = gridColumns;
    // in relations, we don't need to show primary field
    if (primaryField) {
      allFields =
        gridColumns && gridColumns.length
          ? gridColumns.filter(field => field.id !== primaryField.id)
          : [];
      fieldList = [...allFields];
    }
  }

  if (!disabledFieldList) {
    return fieldList;
  }

  if (fieldList && fieldList.length) {
    return clone(fieldList).map(field => {
      if (disabledFieldList[field.id]) {
        field.disabled = true;
      }

      return field;
    });
  }

  return [];
};

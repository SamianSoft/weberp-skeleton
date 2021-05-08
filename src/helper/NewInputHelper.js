export const getTypeByField = field => {
  return field.dataType ? field.dataType.erp : '';
};

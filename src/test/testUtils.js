/**
 * Return node(s) with the given data-test attribute.
 * @param {ShalloeWrapper} wrapper - Enzyme shallow wrapper to search within.
 * @param {string} value - Value of data-test attribute for search.
 * @returns {ShalloeWrapper}
 */
export const findByTestAttr = (wrapper, value) => {
  return wrapper.find(`[data-test="${value}"]`);
};

/**
 * Return node(s) with the given data-test attribute.
 * @param {Wrapper} wrapper - Enzyme shallow wrapper to search within.
 * @param {string} value - Value of data-test attribute for search.
 * @returns {Wrapper}
 */
export const findInputfield = (wrapper, value) => {
  return wrapper.find(`[data-test-input-name="${value}"]`);
};

/**
 * Return node(s) with the given data-test attribute.
 * @function findByTestVarName
 * @param {Wrapper} wrapper - Enzyme shallow wrapper to search within.
 * @param {string} value - Value of data-test attribute for search.
 * @param {string} attribute
 * @returns {Wrapper}
 */
export const findByTestVarName = (wrapper, attribute, value) => {
  return wrapper.find(`[data-test-${attribute}="${value}"]`);
};

/**
 * Returns a tree that has 3 levels and finds the third level
 * @function selectingLevelUntilThree
 * @param {wrapper} wrapper - Enzyme shallow wrapper to search within.
 * @returns {treeLevelThreeComponent}
 */
export const selectingLevelUntilThree = wrapper => {
  //-- Original order and purchase / parent --
  const treeParentComponent = findByTestVarName(wrapper, 'menu-id', '28993');
  treeParentComponent.simulate('click');

  //-- Order and buy / first level --
  const treeLevelOneComponent = wrapper.find('[data-test-sub-menu-id="28994"] div');
  treeLevelOneComponent.simulate('click');

  //-- Warehousing / second level --
  const treeLevelTwoComponent = wrapper.find('[data-test-sub-menu-id="29094"] div');
  treeLevelTwoComponent.simulate('click');

  //-- Distribution / Third Level --
  const treeLevelThreeComponent = wrapper.find('[data-test-sub-menu-id="29363"] a');

  return treeLevelThreeComponent;
};

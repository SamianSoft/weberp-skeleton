import React, { Component } from 'react';
import { getFirstItemFromObject } from '../helper/DataHelper';

class SubmittableFormInputRefHOC extends Component {
  fieldRefList = {};
  relationRefList = {};
  ignoreFocusOnInitList = [];

  getInputRef = (fieldName, ref, resource) => {
    if (!this.resource) {
      this.resource = resource;
    } else {
      if (this.resource !== resource) {
        this.fieldRefList = {};
        this.resource = resource;
      }
    }
    this.fieldRefList[fieldName] = ref;
  };

  getRelationRef = (relation, ref) => {
    this.relationRefList[relation] = ref;
  };

  addToIgnoreFocusOnInit = fieldName => {
    this.ignoreFocusOnInitList.push(fieldName);
  };

  save = (data, params = {}) => {
    this.props.save(data, {
      ...params,
      relationRefList: this.relationRefList,
    });
  };

  focusOnNextInput = (currentName, submitFormCallback) => {
    if (!this.fieldRefList) {
      console.log('fieldRefList is empty, so can not focus on next input');
      return;
    }

    const fieldNameList = Object.keys(this.fieldRefList);
    const indexOfCurrentField = fieldNameList.indexOf(currentName);

    if (indexOfCurrentField === -1) {
      console.log('current field is not in fieldRefList', {
        currentName,
        fieldRefList: this.fieldRefList,
      });
      return;
    }

    const nextFieldName = fieldNameList[indexOfCurrentField + 1];
    // if next is not available, because on last field, we submit the form
    if (!nextFieldName) {
      submitFormCallback();
      return;
    }

    this.focusOnInput(this.fieldRefList[nextFieldName]);
  };

  focusOnInput = inputElement => {
    if (inputElement && inputElement.focus) {
      inputElement.focus();
      if (typeof inputElement.select === 'function') {
        inputElement.select();
      }
    } else if (inputElement && inputElement.input && inputElement.input.focus) {
      if (typeof inputElement.input.focus === 'function') {
        inputElement.input.focus();
      }
    }
  };

  focusOnFirstInput = () => {
    const firstInput = getFirstItemFromObject(this.fieldRefList);
    this.focusOnInput(firstInput);
  };

  focusOnFirstInputAfterSubmit = () => {
    // destruct array to get first item
    const [fieldName] = Object.keys(this.fieldRefList).filter(
      // name of field is not in ignored list
      name => this.ignoreFocusOnInitList.indexOf(name) === -1,
    );

    if (fieldName) {
      this.focusOnInput(this.fieldRefList[fieldName]);
    }
  };

  render() {
    const { component: ChildComponent, ...rest } = this.props;

    return (
      <ChildComponent
        {...rest}
        getInputRef={this.getInputRef}
        addToIgnoreFocusOnInit={this.addToIgnoreFocusOnInit}
        getRelationRef={this.getRelationRef}
        save={this.save}
        focusOnNextInput={this.focusOnNextInput}
        focusOnFirstInput={this.focusOnFirstInput}
        focusOnFirstInputAfterSubmit={this.focusOnFirstInputAfterSubmit}
      />
    );
  }
}

export default HocComponent => props => (
  <SubmittableFormInputRefHOC {...props} component={HocComponent} />
);

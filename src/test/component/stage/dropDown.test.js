import React from 'react';
import { mount, shallow, render } from 'enzyme';
import DropDownComponent from '../../../component/Stage/DropDown';


describe('StageComponent', () => {
    it('should render correctly with no props', () => {
      const component = shallow(<DropDownComponent />);
    
      expect(component).toMatchSnapshot();
    });

    it('should render stage items correctly with given data', () => {
        const testData = [
            {
                key: 'test1',
                title: 'test1',
                priority: 1,
                tickWhenPass: true,
                color: '#FDFDFD',
            },
            {
                key: 'test2',
                title: 'test2',
                priority: 2,
                tickWhenPass: false,
                color: '#000',
            },
            {
                key: 'test3',
                title: 'test3',
                priority: 3,
                tickWhenPass: true,
                color: 'green',
            },
        ];
        const component = shallow(<DropDownComponent data={testData} />);
        expect(component).toMatchSnapshot();
      });
  });
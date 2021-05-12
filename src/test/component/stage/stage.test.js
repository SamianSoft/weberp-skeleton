import React from 'react';
import { mount, shallow, render } from 'enzyme';
import StageComponent from '../../../component/Stage';
import fa from '../../../core/i18n/fa';

describe('StageComponent', () => {
    it('should render correctly with no props', () => {
      const component = shallow(<StageComponent />);
    
      expect(component).toMatchSnapshot();
    });

    it('should render correctly with given direction', () => {
        const sampleDirectins = ['ltr', 'rtl'];
        sampleDirectins.map(dir => shallow(<StageComponent direction={dir} />))
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
        const component = shallow(<StageComponent data={testData} />);
        expect(component).toMatchSnapshot();
      });


      it('should render stage items correctly with given data and given active item', () => {
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

        const activeItem = {
          key: 'test1',
          title: 'test1',
          priority: 1,
          tickWhenPass: true,
          color: '#FDFDFD',
        };
        const component = shallow(<StageComponent data={testData} activeItem={activeItem} />);
        expect(component).toMatchSnapshot();
      });
  });
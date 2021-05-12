import { isActive, isPassed } from '../../helper/StageHelper';


describe('Which stage is item?', () => {
    test('active', () => {
      const key= 'test1';
      const activeItem = {
          key: 'test1',
          title: 'test1',
          prioirty: 2,
          tickWhenPass: false
      }
      const check = isActive(key, activeItem);
      expect(check).toBe(true);
    });
  
    test('not active', () => {
        const key= 'test1';
        const activeItem = {
            key: 'test2',
            title: 'test2',
            prioirty: 2,
            tickWhenPass: false
        }
        const check = isPassed(key, activeItem);
        expect(check).toBe(false);
      });

      test('passed', () => {
        const item = {
          key: 'test1',
          title: 'test1',
          priority: 1,
          tickWhenPass: true,
        };
        const activeItem = {
            key: 'test3',
            title: 'test3',
            priority: 2,
            tickWhenPass: true
        }
        const check = isPassed(item, activeItem);
        expect(check).toBe(true);
      });
    
      test('not passed', () => {
        const item = {
            key: 'test1',
            title: 'test1',
            priority: 2,
            tickWhenPass: true,
          };
          const activeItem = {
              key: 'test2',
              title: 'test2',
              priority: 1,
              tickWhenPass: true
          }
          const check = isActive(item, activeItem);
          expect(check).toBe(false);
        });  
        test('not passed when tickWhenPass is false', () => {
            const item = {
                key: 'test1',
                title: 'test1',
                priority: 2,
                tickWhenPass: false,
              };
              const activeItem = {
                  key: 'test2',
                  title: 'test2',
                  priority: 4,
                  tickWhenPass: true
              }
              const check = isActive(item, activeItem);
              expect(check).toBe(false);
            });     

  });
  
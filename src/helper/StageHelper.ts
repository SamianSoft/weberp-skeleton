import { STAGE } from '../component/Stage/types';
/**
 * function recieves key and active-item-key then check if they are === or not
 * @param key
 * @param activeItem 
 * @returns {boolean}
 */
export const isActive = (key: string, activeItem: any) => activeItem && key === activeItem.key;

/**
 * function recieves key and active-item-key then check their priority to define that item should be passed or not
 * @param item 
 * @param activeItem 
 * @returns {boolean}
 */
export const isPassed = (item: STAGE, activeItem: any): any => {
  if (activeItem) {
    if (item.priority < activeItem.priority) {
      return item.priority <= activeItem.priority && item.tickWhenPass;
    } else if (item.priority === activeItem.priority) {
      return item.priority <= activeItem.priority;
    }
  }
};


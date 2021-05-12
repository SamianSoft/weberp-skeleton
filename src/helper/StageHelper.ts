import { STAGE } from '../component/Stage/types';

export const isActive = (key: string, activeItem: any) => activeItem && key === activeItem.key;
export const isPassed = (item: STAGE, activeItem: any) =>
  activeItem && item.priority <= activeItem.priority && item.tickWhenPass;


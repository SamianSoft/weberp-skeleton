export type STAGE = {
    key: string;
    title: string;
    priority: number;
    tickWhenPass: boolean;
    color: string;
  };
  
  export interface StageProps {
    data: STAGE[];
    direction?: string;
    onItemClick: any;
    activeItem?: STAGE;
    containerWidth?: string;
  }


  export interface DropDownProps {
    data: STAGE[];
    isOpen: boolean;
    isActive: any;
    onSearchHandler: any;
    onArrowClick: any;
    onItemClick: any;
    direction?: string;
  }
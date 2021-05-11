import React, { FC, useRef, useState } from 'react';
import { ArrowDownIcon } from './assets/icons/ArrowDown';
import { DoneIcon } from './assets/icons/Done';
import {
  DateContainer,
  DateEdit,
  DateSection,
  Item,
  ItemsContainer,
  ItemsSection,
  Scroll,
  Wrapper,
} from './stage-styles';
import DropDown from './DropDown';
import { CloseIcon } from './assets/icons/CloseIcon';
import moment from 'moment';
import { STAGE, StageProps } from './types';



const Stage: FC<StageProps> = ({ data, direction, onItemClick, activeItem, containerWidth }) => {
  const [dropDownData, setDropDownData] = useState<STAGE[]>(data);
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [isEdit, setisEdit] = useState<boolean>(false);
  const [date, setDate] = useState<any>(null);
  const [newDate, setNewDate] = useState<any>(null);
  const ref = useRef<HTMLInputElement>(null);

  //method
  const scroll = (scrollOffset: any) => {
    if (ref && ref.current) ref.current.scrollLeft += scrollOffset;
  };

  const isActive = (key: any) => activeItem && key === activeItem.key;
  const isPassed = (item: any) =>
    activeItem && item.priority <= activeItem.priority && item.tickWhenPass;

  const onStageClickHandler = (item: any) => {
    if (isOpen && isActive(item.key)) {
      return;
    } else onItemClick(item);
    isOpen && setisOpen(false);
  };

  const onSearchHandler = (e: any) => {
    const query = e.target.value;
    const filteredData = data.filter((item: any) => item.title.search(query) != -1);
    setDropDownData(filteredData);
  };

  const onSetNewDate = () => {
    newDate && setDate(newDate);
    setisEdit(false);
  }



  return (
    <Wrapper dir={direction} width={containerWidth}>
      <ItemsSection>
        <ItemsContainer ref={ref}>
          {data && data
            .sort((a: any, b: any) => a.priority - b.priority)
            .map((item: any) => (
              <Item
                onClick={() => onStageClickHandler(item)}
                color={item.color ? item.color : 'red'}
                dir={direction}
                className={isActive(item.key) ? 'active' : isPassed(item) ? 'passed' : ''}
              >
                {isPassed(item) && <DoneIcon width={14} color="#fff" />}
                <span style={{ textAlign: 'end', fontSize: '14px' }}>{item.title}</span>
                {isActive(item.key) && (
                  <DropDown
                    direction={direction}
                    data={dropDownData}
                    isOpen={isOpen}
                    isActive={isActive}
                    onSearchHandler={onSearchHandler}
                    onArrowClick={() => {
                      setisOpen(!isOpen);
                    }}
                    onItemClick={onStageClickHandler}
                  />
                )}
              </Item>
            ))}
        </ItemsContainer>

        <Scroll>
          <button
            onClick={() => scroll(1000)}
            style={{
              fontSize: '25px',
              cursor: 'pointer',
              marginLeft: '.5rem',
              background: 'transparent',
              border: 'none',
            }}
          >
            {`<`}
          </button>
          <button
            onClick={() => scroll(-1000)}
            style={{
              fontSize: '25px',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
            }}
          >{`>`}</button>
        </Scroll>
      </ItemsSection>
      <DateSection>
        <DateContainer>Sep,16, 2021</DateContainer>
        {isEdit ? (
          <DateEdit>
            <div
              onClick={onSetNewDate}
              style={{
                background: 'green',
                padding: '4px 6px',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            >
              <DoneIcon width={9} color="#fff" />
            </div>
            <div
              onClick={() => setisEdit(false)}
              style={{
                background: 'red',
                padding: '4px 6px',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            >
              <CloseIcon width={9} color="#fff" />
            </div>
            <input onChange={(e: any) => setNewDate(e.target.value)} type="date" />
          </DateEdit>
        ) : (
          <div
            style={{
              width: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ cursor: 'pointer' }} onClick={() => setisEdit(true)}>
              <ArrowDownIcon />
            </div>
            <DateContainer>
              {date ? moment(date).format('MMMM, Do, YYYY') : 'Sep,18, 2021'}
            </DateContainer>
          </div>
        )}
      </DateSection>
    </Wrapper>
  );
};

export default Stage;

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
import { isActive, isPassed } from '../../helper/StageHelper';

const Stage: FC<StageProps> = ({ data, direction, onItemClick, activeItem, containerWidth }) => {
  const [dropDownData, setDropDownData] = useState<STAGE[]>(data);
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [isEdit, setisEdit] = useState<boolean>(false);
  const [date, setDate] = useState<any>(null);
  const [newDate, setNewDate] = useState<any>(null);
  const ref = useRef<HTMLInputElement>(null);

 
  const onScroll = (scrollOffset: number) => {
    if (ref && ref.current) ref.current.scrollLeft += scrollOffset;
  };

  const onStageClickHandler = (item: any) => {
    if (isOpen && isActive(item.key, activeItem)) {
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
  };

  return (
    <Wrapper dir={direction} width={containerWidth}>
      <ItemsSection>
        <ItemsContainer ref={ref}>
          {data &&
            data
              .sort((a: any, b: any) => a.priority - b.priority)
              .map((item: any) => (
                <Item
                  onClick={() => onStageClickHandler(item)}
                  color={item.color ? item.color : '#D3D3D3'}
                  dir={direction}
                  className={
                    isActive(item.key, activeItem)
                      ? 'active'
                      : isPassed(item, activeItem)
                      ? 'passed'
                      : ''
                  }
                >
                  {isPassed(item, activeItem) && <DoneIcon width={14} color="#fff" />}
                  <span style={{ textAlign: 'end', fontSize: '14px' }}>{item.title}</span>
                  {isActive(item.key, activeItem) && (
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
            onClick={() => onScroll(1000)}
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
            onClick={() => onScroll(-1000)}
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

import React, { FC } from "react";
import TetherComponent from "react-tether";
import { Input, List } from "semantic-ui-react";
import { ArrowDownIcon } from "./assets/icons/ArrowDown";
import { DropDownWrapper } from "./stage-styles";
import { DropDownProps, STAGE } from "./types";




const DropDown: FC<DropDownProps> = ({
  data,
  isOpen,
  isActive,
  onSearchHandler,
  onArrowClick,
  onItemClick,
  direction
}) => {
  return (
    <TetherComponent
      attachment="top center"
      constraints={[
        {
          to: "window",
          attachment: "together",
        },
      ]}
      renderTarget={(inputRef: any) => (
        <div style={{ padding: "5px" }} ref={inputRef} onClick={onArrowClick}>
          <ArrowDownIcon />
        </div>
      )}
      renderElement={(inputReff: any) =>
        isOpen && (
          <DropDownWrapper dir={direction} ref={inputReff}>
            <Input
              icon="search"
              placeholder="Search..."
              onChange={onSearchHandler}
            />
            <hr></hr>
            <div
              style={{ padding: "1rem", maxHeight: "12rem", overflow: "auto" }}
            >
              <List link>
                {data && data
                  .sort((a: any, b: any) => a.priority - b.priority)
                  .map((option: STAGE) => (
                    <div
                      style={{
                        cursor: "pointer",
                        padding: ".3rem 0",
                      }}
                    >
                      <List.Item
                        active={isActive(option.key)}
                        onClick={() => onItemClick(option)}
                        key={option.key}
                        as="a"
                      >
                        {option.title}
                      </List.Item>
                    </div>
                  ))}
              </List>
            </div>
          </DropDownWrapper>
        )
      }
    />
  );
};

export default DropDown;

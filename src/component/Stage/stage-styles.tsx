import styled, { css } from "styled-components";

export const Wrapper = styled.div<any>`
  direction: ${(props) => props.dir};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  width: ${props => props.width  ? props.width : 'auto'};
  padding: 0 20px;
  min-height: 150px;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: rgba(234, 234, 238, 0.4) 0px 7px 29px 0px;
`;

export const ItemsSection = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  background-color: transparent;
  width: 98%;
  height: auto;
  padding: 5px;
`;

export const ItemsContainer = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  background-color: transparent;
  width: 91%;
  // height: 15rem;
  overflow-x: auto;
  overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 25px;
  min-width: 235px;
  width: auto;
  height: 40px;
  font-size: 20px;
  text-align: center;
  position: relative;
  color: #000;
  background: lightgray;
  margin-right: .6rem;
  cursor: pointer;
  &.active{
    background-color: #1D83FD;
    color: #fff;
    &:after {
      ${(props) =>
        props.dir === "rtl"
          ? css`
              content: "";
              position: absolute;
              left: -20px;
              bottom: 0;
              width: 0;
              height: 0;
              border-right: 20px solid #1d83fd;
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              z-index: 2;
            `
          : css`
              content: "";
              position: absolute;
              left: 0;
              bottom: 0;
              width: 0;
              height: 0;
              border-left: 20px solid white;
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              z-index: 1;
            `}
    }

    &:before {
      ${(props) =>
        props.dir === "rtl"
          ? css`
              content: "";
              position: absolute;
              right: 0;
              bottom: 0;
              width: 0;
              height: 0;
              border-right: 20px solid white;
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              z-index: 1;
            `
          : css`
              content: "";
              position: absolute;
              right: -20px;
              bottom: 0;
              width: 0;
              height: 0;
              border-left: 20px solid #1d83fd;
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              z-index: 2;
            `}
     } 

     &:first-child{
      &:before {
        ${(props) =>
          props.dir === "rtl"
            ? css`
                content: "";
                position: absolute;
                right: 0;
                bottom: 0;
                width: 0;
                height: 0;
                border-right: 20px solid #1d83fd;
                border-top: 20px solid transparent;
                border-bottom: 20px solid transparent;
                z-index: 1;
              `
            : css`
                content: "";
                position: absolute;
                right: -20px;
                bottom: 0;
                width: 0;
                height: 0;
                border-left: 20px solid #1d83fd;
                border-top: 20px solid transparent;
                border-bottom: 20px solid transparent;
                z-index: 2;
              `}
      }
    }
  
    &:first-child{
      &:after {
        ${(props) =>
          props.dir === "rtl"
            ? css``
            : css`
                content: "";
                position: absolute;
                right: -20px;
                bottom: 0;
                width: 0;
                height: 0;
                border-left: 20px solid #1d83fd;
                border-top: 20px solid transparent;
                border-bottom: 20px solid transparent;
                z-index: 2;
              `}
      }
    }
  


  }


  &.passed{
    background-color: ${(props) => props.color};
    color: #fff;
    &:after {
      ${(props) =>
        props.dir === "rtl"
          ? css`
              content: "";
              position: absolute;
              left: -20px;
              bottom: 0;
              width: 0;
              height: 0;
              border-right: 20px solid ${props.color};
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              z-index: 2;
            `
          : css`
              content: "";
              position: absolute;
              left: 0;
              bottom: 0;
              width: 0;
              height: 0;
              border-left: 20px solid white;
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              z-index: 1;
            `}
    }

    &:before {
      ${(props) =>
        props.dir === "rtl"
          ? css`
              content: "";
              position: absolute;
              right: 0;
              bottom: 0;
              width: 0;
              height: 0;
              border-right: 20px solid white;
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              z-index: 1;
            `
          : css`
              content: "";
              position: absolute;
              right: -20px;
              bottom: 0;
              width: 0;
              height: 0;
              border-left: 20px solid ${props.color};
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              z-index: 2;
            `}
     } 

     &:first-child{
      &:before {
        ${(props) =>
          props.dir === "rtl"
            ? css`
                content: "";
                position: absolute;
                right: 0;
                bottom: 0;
                width: 0;
                height: 0;
                border-right: 20px solid ${props.color};
                border-top: 20px solid transparent;
                border-bottom: 20px solid transparent;
                z-index: 1;
              `
            : css`
                content: "";
                position: absolute;
                right: -20px;
                bottom: 0;
                width: 0;
                height: 0;
                border-left: 20px solid ${props.color};
                border-top: 20px solid transparent;
                border-bottom: 20px solid transparent;
                z-index: 2;
              `}
      }
    }
  
    &:first-child{
      &:after {
        ${(props) =>
          props.dir === "rtl"
            ? css``
            : css`
                content: "";
                position: absolute;
                right: -20px;
                bottom: 0;
                width: 0;
                height: 0;
                border-left: 20px solid ${props.color};
                border-top: 20px solid transparent;
                border-bottom: 20px solid transparent;
                z-index: 2;
              `}
      }
    }
  


  }
  &:after {
    ${(props) =>
      props.dir === "rtl"
        ? css`
            content: "";
            position: absolute;
            left: -20px;
            bottom: 0;
            width: 0;
            height: 0;
            border-right: 20px solid lightgray;
            border-top: 20px solid transparent;
            border-bottom: 20px solid transparent;
            z-index: 2;
          `
        : css`
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 0;
            height: 0;
            border-left: 20px solid white;
            border-top: 20px solid transparent;
            border-bottom: 20px solid transparent;
            z-index: 1;
          `}
    
    }
  }

 &:before {
  ${(props) =>
    props.dir === "rtl"
      ? css`
          content: "";
          position: absolute;
          right: 0;
          bottom: 0;
          width: 0;
          height: 0;
          border-right: 20px solid white;
          border-top: 20px solid transparent;
          border-bottom: 20px solid transparent;
          z-index: 1;
        `
      : css`
          content: "";
          position: absolute;
          right: -20px;
          bottom: 0;
          width: 0;
          height: 0;
          border-left: 20px solid lightgray;
          border-top: 20px solid transparent;
          border-bottom: 20px solid transparent;
          z-index: 2;
        `}
 } 

  &:first-child{
    &:before {
      ${(props) =>
        props.dir === "rtl"
          ? css`
              content: "";
              position: absolute;
              right: 0;
              bottom: 0;
              width: 0;
              height: 0;
              border-right: 20px solid lightgray;
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              z-index: 1;
            `
          : css`
              content: "";
              position: absolute;
              right: -20px;
              bottom: 0;
              width: 0;
              height: 0;
              border-left: 20px solid lightgray;
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              z-index: 2;
            `}
    }
  }

  &:first-child{
    &:after {
      ${(props) =>
        props.dir === "rtl"
          ? css``
          : css`
              content: "";
              position: absolute;
              right: -20px;
              bottom: 0;
              width: 0;
              height: 0;
              border-left: 20px solid lightgray;
              border-top: 20px solid transparent;
              border-bottom: 20px solid transparent;
              z-index: 2;
            `}
    }
  }

 

  
`;

export const DateSection = styled.div`
  display: flex;
  margin: 1.5rem 0;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  width: 98%;
  height: auto;
  padding: 5px;
  color: #000;
`;


export const DateContainer = styled.div`
  font-size: 15px;
`
export const DateEdit = styled.div`
  width: 220px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`

export const Scroll = styled.div`
  color: #000;
  display: flex;
  align-items: center;
  margin-top: 1rem;
  justify-content: space-between;
`;


export const DropDownWrapper = styled.div<any>`
  direction: ${(props) => props.dir};
  margin-top: 1rem;
  background: #fff;
  padding: 1.2rem;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

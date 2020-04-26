import styled from "styled-components";
import { Modal } from "antd-mobile";
import { theme } from "../../constants/theme";

const { royalBlue } = theme.colors;
const { darkGray } = theme.global.colors;

export default styled(Modal)`
  font-family: ${theme.typography.font.family.display};
  width: 47rem;

  .title {
    font-weight: bold;
    margin: 2rem 3rem 2rem;
  }

  .rectangle {
    width: 41rem;
    height: 5rem;
    display: inline-flex;
    background: #f3f4fe;
    border: 0.05rem solid ${royalBlue};
    box-sizing: border-box;
    border-radius: 0.3rem;
    div {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: ${royalBlue};
      border-right: 0.05rem solid ${royalBlue};
      &:hover,
      &:active,
      &:focus {
        background-color: ${royalBlue};
        color: #fff;
      }
      &:last-child {
        border-right: none !important;
      }
    }
  }

  .scale-text {
    font-weight: 500;
    font-size: 1.1rem;
    color: ${darkGray};
    width: 41rem;
    display: inline-flex;
    margin-bottom: 2rem;
  }

  .spacer {
    visibility: hidden;
    flex-grow: 1;
  }
`;

import React from "react";
import styled from "styled-components";

import SubmitButton from "./SubmitButton";
import { theme, mq } from "../../constants/theme";
const { colors } = theme;
const { selago, royalBlue } = colors;

const StyledFeedbackModalButton = styled(SubmitButton)`
  @media screen and (min-width: 1024px) {
    width: 13vw;
    margin-top: 1rem;
    margin-bottom: -0.5rem;
  }
  width: 90%;
  margin-top: 3rem;
  margin-bottom: 1rem;
  background-color: ${selago};
  border: none;
  span {
    color: ${royalBlue};
  }
`;

const FeedbackModalButton = (props) => {
  const { title, onClick } = props;

  return (
    <StyledFeedbackModalButton onClick={onClick}>
      {title}
    </StyledFeedbackModalButton>
  );
};

export default FeedbackModalButton;

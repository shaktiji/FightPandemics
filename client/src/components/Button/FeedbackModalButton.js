import React from "react";
import styled from "styled-components";

import SubmitButton from "./SubmitButton";
import { theme, mq } from "../../constants/theme";
const { colors } = theme;
const { selago, royalBlue } = colors;

const FeedbackModalButton = styled(SubmitButton)`
  width: 13vw;
  margin-top: 1rem;
  background-color: ${selago};
  border: none;
  font-weight: bold;
  span {
    color: ${royalBlue};
  }
`;

export default (props) => {
  const { title } = props;

  return <FeedbackModalButton title={title} />;
};

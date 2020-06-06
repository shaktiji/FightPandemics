import React from "react";
import { Radio } from "antd";
import styled from "styled-components";
import { theme } from "constants/theme";
const { royalBlue, black } = theme.colors;
const { medium } = theme.typography.size;
const { display } = theme.typography.font.family;

const StyledRadioGroup = styled(Radio.Group)`
  width: 100%;
  margin-top: 0.5rem;
  text-align: left;
  .ant-radio-wrapper {
    justify-content: space-between;
    padding: ${(props) => props.padding};
    white-space: break-spaces;
    margin-left: -1.5rem;


    span.ant-radio + * {
      font-family: ${display};
      font-size: ${medium};
      color: ${black};
      letter-spacing: 0;
    }
    .ant-radio-inner {
      border-color: ${royalBlue};
      border-width: 0.2rem;
      width: 2.5rem;
      height: 2.5rem;
      &::after {
        background-color: ${royalBlue};
        top: 0.2rem;
        left: 0.2rem;
      }
    }
  }
`;

const RadioGroup = ({
  options,
  onChange,
  value,
  defaultValue,
  flex,
  padding,
}) => {
  return (
    <StyledRadioGroup
      size="large"
      flex={flex}
      padding={padding}
      onChange={onChange}
      value={value}
      defaultValue={defaultValue}
    >
      {options.map((option, index) => (
        <Radio value={option.stateKey} key={index}>
          {option.value}
        </Radio>
      ))}
    </StyledRadioGroup>
  );
};

export default RadioGroup;

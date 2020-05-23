import React from "react";
import { useForm, Controller } from "react-hook-form";
import { connect } from "react-redux";
import Checkbox from "components/Input/Checkbox";
import SubmitButton from "components/Button/SubmitButton";
import styled from "styled-components";
import { getInitials } from "utils/userInfo";
import FormInput from "components/Input/FormInput";
import ProfilePic from "components/Picture/ProfilePic";
import { Link } from "react-router-dom";
import UnderLineDescription from "components/Input/UnderlineDescription";
import {
  EditLayout,
  TitlePictureWrapper,
  FillEmptySpace,
  CustomLink,
  CustomForm,
  CustomHeading,
  ChangePicButton,
  CustomSubmitButton,
  OptionDiv,
  FormLayout,
} from "../components/EditProfile/EditComponents";
import { mq } from "constants/theme";
const Label = styled.label`
  color: ${(props) => props.inputColor || "#425AF2"};
  padding-left: ${(props) => props.paddingLeft || ""};
  margin-top: ${(props) => props.marginTop || "1.5rem"};
  font-size: ${(props) => props.size || ""};
  font-weight: ${(props) => props.weight || ""};
`;

function EditAccount(props) {
  // dummy data props,context, redux etc

  const {
    firstName,
    lastName,
    email,
    country,
    neighborhood,
    shareInfoStatus,
    volunteerStatus,
    donateStatus,
    medicalHelpStatus,
    otherHelpStatus,
    traveling,
    displayNeighborhood,
  } = props.user;
  const { register, handleSubmit, control, errors } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // make a put/patch request to backend to update users Account information
  };

  const userInfo = {
    // label name, variable name, value
    "E mail": ["email", email],
    "* Name": ["name", firstName + " " + lastName],
    "* Country": ["country", country],
    "* Neighborhood": [
      "neighborhood",
      neighborhood,
      "If you do not know your neighborhood, type in zip code or address to find it",
    ],
  };

  const helpSection = {
    Volunteer: ["volunteer", volunteerStatus],
    Donate: ["donate", donateStatus],
    "Share Information": ["shareInfo", shareInfoStatus],
  };

  const needHelpSection = {
    "Medical Help": [
      "medicalHelp",
      medicalHelpStatus,
      "I have symptoms of COVID-19",
    ],
    "Other Help": [
      "otherHelp",
      otherHelpStatus,
      "I need assistance getting groceries, medicine, etc.",
    ],
  };

  const renderHelp = () => {
    return Object.entries(helpSection).map(([key, value]) => {
      return (
        <div key={key} style={{ margin: "1rem 0" }}>
          <Controller
            as={<Checkbox />}
            defaultValue={value[1]}
            name={value[0]}
            control={control}
            onChange={([event]) => event.target.checked}
          >
            <Label inputColor="#000000">{key}</Label>
          </Controller>
        </div>
      );
    });
  };

  const renderNeedHelp = () => {
    return Object.entries(needHelpSection).map(([key, value]) => {
      return (
        <div
          key={key}
          style={{
            margin: "1rem 0",
            marginBottom: "-1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Controller
            as={Checkbox}
            defaultValue={value[1]}
            name={value[0]}
            control={control}
            onChange={([event]) => event.target.checked}
          >
            <Label inputColor="black">{key}</Label>
            <UnderLineDescription marginLeft="3rem">
              {value[2]}
            </UnderLineDescription>
          </Controller>
        </div>
      );
    });
  };

  const renderFormInputs = () => {
    return Object.entries(userInfo).map(([key, value]) => {
      return (
        <div
          key={key}
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "2rem",
          }}
        >
          <FormInput
            inputTitle={key}
            name={value[0]}
            defaultValue={value[1]}
            reference={register({ required: true })}
            error={!!errors[value[0]]}
          />
          <UnderLineDescription marginTop={"-1.5rem"}>
            {value[2] || null}
          </UnderLineDescription>
        </div>
      );
    });
  };

  const renderNeighborhoodCheckBoxes = () => {
    return (
      <>
        <div
          style={{
            margin: "0.5rem 0",
            marginTop: "-1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Controller
            as={Checkbox}
            defaultValue={traveling}
            name={"traveling"}
            control={control}
            onChange={([event]) => event.target.checked}
          >
            <Label inputColor="#646464">I am traveling</Label>
          </Controller>
        </div>
        <div
          style={{
            margin: "0.5rem 0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Controller
            as={Checkbox}
            defaultValue={displayNeighborhood}
            name="displayNeighborhood"
            control={control}
            onChange={([event]) => event.target.checked}
          >
            <Label inputColor="#646464">Don't show my neighborhood</Label>
          </Controller>
        </div>
      </>
    );
  };
  const ProfilePicWrapper = styled.div`
    display: none;
    @media screen and (min-width: ${mq.tablet.narrow.minWidth}) {
      display: flex;
      flex-direction: column;
      margin-top: 1.3rem;
    }
  `;

  return (
    <EditLayout>
      <TitlePictureWrapper>
        <CustomHeading level={4} className="h4">
          Account Information
        </CustomHeading>
        <FillEmptySpace />
        <ProfilePicWrapper>
          <ProfilePic
            resolution={"7680px"}
            noPic={true}
            initials={getInitials(firstName, lastName)}
          />
          <ChangePicButton>Change</ChangePicButton>
        </ProfilePicWrapper>
      </TitlePictureWrapper>
      <FormLayout>
        <OptionDiv>
          <CustomLink isSelected>
            <Link to="/edit-account">Account Information</Link>
          </CustomLink>
          <CustomLink>
            <Link to="/edit-profile">Profile Information</Link>
          </CustomLink>
        </OptionDiv>
        <CustomForm style={{ display: "flex", flexDirection: "column" }}>
          {renderFormInputs()}
          {renderNeighborhoodCheckBoxes()}
          <Label>I want to</Label>
          {renderHelp()}
          <Label>I need</Label>
          {renderNeedHelp()}
          <CustomSubmitButton primary="true" onClick={handleSubmit(onSubmit)}>
            Save Changes
          </CustomSubmitButton>
          <div
            style={{ display: "flex", marginTop: "1rem", marginBottom: "3rem" }}
          >
            <Controller
              as={<Checkbox color="#646465" />}
              defaultValue={false}
              name={"policy"}
              control={control}
              onChange={([event]) => event.target.checked}
            ></Controller>
            <Label
              size="1rem"
              weight="bolder"
              marginTop="0"
              paddingLeft="10px"
              inputColor="#646464"
            >
              By signing up, I agree to Fight Pandemics, Terms of Services and
              Privacy Policy.
            </Label>
          </div>
        </CustomForm>
      </FormLayout>
    </EditLayout>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(EditAccount);

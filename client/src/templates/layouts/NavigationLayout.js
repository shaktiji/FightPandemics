import { Button, Drawer, List } from "antd-mobile";
import React, { useState, useReducer } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import MobileTabs from "./MobileTabs";
import CookieAlert from "components/CookieAlert";
import Footnote from "components/Footnote";
import Header from "components/Header";
import Main from "./Main";
import FeedbackSubmitButton from "components/Button/FeedbackModalButton";
import RatingModal from "components/Feedback/RatingModal";
import TextFeedbackModal from "components/Feedback/TextFeedbackModal";
import RadioModal from "components/Feedback/RadioModal";
import ThanksModal from "components/Feedback/ThanksModal";
import Logo from "components/Logo";
import logo from "assets/logo.svg";
import RadioGroup from "components/Feedback/RadioGroup";
import withLabel from "components/Input/with-label";
import StyledInput from "components/Feedback/StyledTextInput";
import {
  TOGGLE_STATE,
  SET_VALUE,
  FEEDBACK_FORM_SUBMIT,
  FEEDBACK_FORM_SUBMIT_ERROR,
} from "hooks/actions/feedbackActions";
import {
  feedbackReducer,
  feedbackFormReducer,
  initialState,
} from "hooks/reducers/feedbackReducers";
import { Alert } from "antd";
import { ORANGE_RED, WHITE, ROYAL_BLUE, TROPICAL_BLUE } from "constants/colors";
import axios from "axios";

const drawerStyles = {
  position: "relative",
  overflow: "hidden",
  WebkitOverflowScrolling: "touch",
};

const sidebarStyle = {
  background: `${ROYAL_BLUE}`,
};

const NavList = styled(List)`
  width: 63vw !important;
  @media screen and (min-width: 1024px) {
    width: 20vw !important;
  }
  & .am-list-body {
    background: unset;
    border-width: 0 !important;
    position: absolute;
    top: 35vh;
    width: 100%;
    transform: translateY(-50%);
    & div:not(:last-child) {
      & .am-list-line {
        border-bottom: 0;
      }
    }
    &::after {
      height: 0px !important;
    }

    &::before {
      height: 0px !important;
    }
  }
`;

const NavItem = styled(List.Item).attrs((props) => ({
  onClick: props.onClick || (() => props.history.push(props.link)),
}))`
  background: unset;
  padding-left: 24px;
  & .am-list-line {
    border-bottom: 0;
    &:after {
      height: 0 !important;
    }
    & .am-list-content {
      color: ${WHITE};
      cursor: pointer;
      font-family: "Poppins", sans-serif;
      font-size: ${(props) => (props.size === "small" ? "2rem" : "2.4rem")};
      font-weight: ${(props) => (props.size === "small" ? "400" : "600")};
      line-height: 6rem;
      padding: 0;
      margin: ${(props) =>
    typeof props.margin != undefined ? props.margin : "inherit"};
    }
  }

  &.am-list-item-active {
    background: ${TROPICAL_BLUE};
  }
`;

const CloseNav = styled(Button).attrs((props) => ({
  inline: true,
  icon: "cross",
  size: "lg",
}))`
  background: unset;
  border-width: 0 !important;
  border-radius: 0;
  color: ${WHITE};
  cursor: pointer;
  font-size: 2rem;
  position: absolute;
  top: 4px;
  right: 0.4rem;
  z-index: 300;

  &.am-button-active {
    background: none;
    color: ${WHITE};
  }
  &::before {
    display: none;
  }

  .am-icon {
    stroke-width: 2px;
    stroke: ${WHITE};
  }
`;

const ErrorAlert = styled(Alert)`
  background-color: ${ORANGE_RED};
  .ant-alert-message {
    color: ${WHITE};
  }
`;

const NavigationLayout = (props) => {
  const { mobiletabs, tabIndex, isAuthenticated } = props;

  const history = useHistory();

  const [drawerOpened, setDrawerOpened] = useState(false);

  const [feedbackState, feedbackDispatch] = useReducer(
    feedbackReducer,
    initialState.feedbackReducer,
  );

  const [feedbackFormState, feedbackFormDispatch] = useReducer(
    feedbackFormReducer,
    initialState.feedbackFormReducer,
  );

  const {
    ratingModal,
    textFeedbackModal,
    radioModal,
    thanksModal,
    rating,
    mostValuableFeature,
    whatWouldChange,
    generalFeedback,
    age,
    covidImpact,
  } = feedbackState;

  const dispatchAction = (type, key, value) => {
    feedbackDispatch({ type, key, value });
  };

  const toggleDrawer = () => {
    setDrawerOpened(!drawerOpened);
  };

  const toggleModal = (modalName) => {
    dispatchAction(TOGGLE_STATE, modalName);
  };

  const closeRatingModal = (ratingValue) => {
    if (drawerOpened) {
      toggleDrawer();
    }
    dispatchAction(SET_VALUE, "rating", ratingValue);
    toggleModal("ratingModal");
    toggleModal("textFeedbackModal");
  };

  const closeTextFeedbackModal = () => {
    toggleModal("textFeedbackModal");
    toggleModal("radioModal");
  };

  const closeRadioModal = () => {
    submitFeedbackForm();
    toggleModal("thanksModal");
    toggleModal("radioModal");
  };

  const submitFeedbackForm = async () => {
    feedbackFormDispatch({ type: FEEDBACK_FORM_SUBMIT });
    try {
      await axios.post("/api/feedback", {
        rating: rating,
        age: age,
        userId: 5,
        covidImpact: covidImpact,
        generalFeedback: generalFeedback,
        mostValuableFeature: mostValuableFeature,
        whatWouldChange: whatWouldChange,
      });
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      feedbackFormDispatch({
        type: FEEDBACK_FORM_SUBMIT_ERROR,
        error: `Could not submit feedback, reason: ${message}`,
      });
    }
  };

  const renderThanksModal = () => {
    return (
      <ThanksModal
        onClose={() => dispatchAction(TOGGLE_STATE, "thanksModal")}
        visible={thanksModal}
        transparent
      >
        <h2 className="title">Thank you!</h2>
        <p>
          Your input means a lot and helps us help you and others during and
          after the COVID-19 pandemic.
        </p>
        <Logo src={logo} alt="Fight Pandemics logo" />
      </ThanksModal>
    );
  };

  const renderRadioModal = () => {
    const inputLabelsText = [
      {
        stateKey: "age",
        label: "What is your age?",
      },
    ];

    const radioButtonOptions = [
      {
        stateKey: "covidImpact",
        value: "I go to work/school normally",
      },
      {
        stateKey: "covidImpact",
        value: "I am healthy but in a stay-at-home quarantine",
      },
      {
        stateKey: "covidImpact",
        value: "I have mild symptoms but haven't been tested",
      },
      {
        stateKey: "covidImpact",
        value: "I am diagnosed with Covid-19",
      },
    ];

    const RadioGroupWithLabel = withLabel(() => (
      <RadioGroup
        onChange={true}
        options={radioButtonOptions}
        value={true}
        padding="1rem 1rem"
      ></RadioGroup>
    ));

    return (
      <RadioModal
        maskClosable={true}
        closable={true}
        visible={radioModal}
        onClose={() => closeRadioModal()}
        transparent
      >
        <h2 className="title">We are almost done!</h2>
        {inputLabelsText.map((label, index) => (
          <>
            <StyledInput
              key={index}
              label={label.label}
              value={label.stateKey}
              onChange={dispatchAction}
            ></StyledInput>
            <RadioGroupWithLabel label={"How has COVID-19 impacted you?"} />
          </>
        ))}
        <FeedbackSubmitButton
          title="Submit Feedback"
          onClick={closeRadioModal}

        ></FeedbackSubmitButton>
      </RadioModal>
    );
  };

  const renderTextFeedbackModal = () => {
    const inputLabelsText = [
      {
        stateKey: "mostValuableFeature",
        label: "Which features are the most valuable to you?",
      },
      {
        stateKey: "whatWouldChange",
        label:
          "If you could change one thing about FightPandemics, what would it be?",
      },
      { stateKey: "generalFeedback", label: "Any other feedback for us?" },
    ];

    return (
      <TextFeedbackModal
        afterClose={() => closeTextFeedbackModal}
        maskClosable={true}
        closable={true}
        visible={textFeedbackModal}
        onClose={() => closeTextFeedbackModal()}
        transparent
      >
        <h2 className="title">
          Thank you for being an early user of FightPandemics!
        </h2>
        {inputLabelsText.map((label, index) => (
          <StyledInput
            key={index}
            label={label.label}
            value={label.stateKey}
            onChange={dispatchAction}
          ></StyledInput>
        ))}
        <FeedbackSubmitButton
          title="Next"
          onClick={closeTextFeedbackModal}
        ></FeedbackSubmitButton>
      </TextFeedbackModal>
    );
  };

  const renderRatingModal = () => {
    const ratingScale = ["1", "2", "3", "4", "5"];

    return (
      <RatingModal
        maskClosable={true}
        closable={false}
        visible={ratingModal}
        transparent
      >
        <h3 className="title">How well does FightPandemics meet your needs?</h3>
        <div className="rectangle">
          {ratingScale.map((rating, index) => (
            <div key={index} onClick={() => closeRatingModal(rating)}>
              {rating}
            </div>
          ))}
        </div>
        <div className="scale-text">
          <div>Poorly</div>
          <div className="spacer"></div>
          <div>Very well</div>
        </div>
      </RatingModal>
    );
  };

  const drawerMenu = () => (
    <>
      <NavList>
        {isAuthenticated ? (
          <>
            <NavItem>
              <Link to="/profile">Profile</Link>
            </NavItem>
          </>
        ) : (
            <>
              <NavItem history={history} link="/auth/login">
                Login / Register
            </NavItem>
            </>
          )}
        <NavItem history={history} link="/about">
          About Us
        </NavItem>
        <NavItem history={history} link="/privacy">
          Data Privacy
        </NavItem>
        <NavItem
          size={"small"}
          margin={"8rem 0 0"}
          onClick={() => dispatchAction(TOGGLE_STATE, "ratingModal")}
        >
          Feedback
        </NavItem>
      </NavList>
      {drawerOpened && <CloseNav onClick={toggleDrawer} />}
    </>
  );

  const renderNavigationBar = () => {
    return (
      <div>
        <Drawer
          style={{
            minHeight: document.documentElement.clientHeight,
            ...drawerStyles,
          }}
          enableDragHandle
          open={drawerOpened}
          onOpenChange={toggleDrawer}
          position="right"
          sidebar={drawerMenu()}
          sidebarStyle={sidebarStyle}
          className="app-drawer"
        >
          <Header
            onMenuClick={toggleDrawer}
            isAuthenticated={isAuthenticated}
            onFeedbackIconClick={() =>
              dispatchAction(TOGGLE_STATE, "ratingModal")
            }
          />
          {mobiletabs ? (
            <MobileTabs tabIndex={tabIndex} childComponent={props.children} />
          ) : null}
          <Main>
            <props.component {...props} />
            {renderRatingModal()}
            {renderTextFeedbackModal()}
            {renderRadioModal()}
            {renderThanksModal()}
            {feedbackFormState.error && (
              <ErrorAlert
                message={feedbackFormState.error}
                type="error"
                closable={true}
              />
            )}
          </Main>
          <Footnote />
          <CookieAlert />
        </Drawer>
      </div>
    );
  };

  return <>{renderNavigationBar()}</>;
};

export default NavigationLayout;

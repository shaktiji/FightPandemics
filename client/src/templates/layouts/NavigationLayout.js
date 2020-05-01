import { Button, Drawer, List } from "antd-mobile";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";

import Header from "components/Header";
import Footnote from "components/Footnote";
import CookieAlert from "components/CookieAlert";
import Main from "./Main";
import MobileTabs from "./MobileTabs";
import { theme } from "constants/theme";

import Footnote from "~/components/Footnote";
import Header from "~/components/Header";
import FeedbackSubmitButton from "../../components/Button/FeedbackModalButton";
import RatingModal from "../../components/Feedback/RatingModal";
import TextFeedbackModal from "../../components/Feedback/TextFeedbackModal";
import withLabel from "../../components/Input/with-label";
import StyledInput from "../../components/StepWizard/StyledTextInput";
import { theme } from "../../constants/theme";
import Main from "./Main";

const { royalBlue, tropicalBlue, white } = theme.colors;

const drawerStyles = {
  position: "relative",
  overflow: "hidden",
  WebkitOverflowScrolling: "touch",
};

const sidebarStyle = {
  background: `${royalBlue}`,
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
      color: ${white};
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
    background: ${tropicalBlue};
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
  color: ${white};
  cursor: pointer;
  font-size: 2rem;
  position: absolute;
  top: 4px;
  right: 0.4rem;
  z-index: 300;

  &.am-button-active {
    background: none;
    color: ${white};
  }
  &::before {
    display: none;
  }

  .am-icon {
    stroke-width: 2px;
    stroke: ${white};
  }
`;

const NavigationLayout = (props) => {
  const { mobiletabs, tabIndex, isAuthenticated } = props;

  const history = useHistory();

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [modal, setModal] = useState([
    { ratingModal: false },
    { textFeedbackModal: false },
  ]);
  const [rating, setRating] = useState(null);

  const toggleDrawer = () => {
    setDrawerOpened(!drawerOpened);
  };

  const closeRatingModal = (rating) => {
    if (drawerOpened) {
      toggleDrawer();
    }

    setModal({ ratingModal: false });

    if (modal.ratingModal) {
      setRating(rating);
      setModal({ textFeedbackModal: true });
    }
  };

  const closeTextFeedbackModal = () => {
    setModal({ ratitextFeedbackModalngModal: false });
  };

  const renderTextFeedbackModal = () => {
    const inputLabelsText = [
      "Which features are the most valuable to you?",
      "If you could change one thing about FightPandemics, what would it be?",
      "Any other feedback for us?",
    ];

    const InputWithLabel = withLabel(() => <StyledInput></StyledInput>);

    return (
      <TextFeedbackModal
        afterClose={() => closeTextFeedbackModal}
        maskClosable={true}
        closable={true}
        visible={modal.textFeedbackModal}
        onClose={() => closeTextFeedbackModal()}
        transparent
      >
        <h2 className="title">
          Thank you for being an early user of FightPandemics!
        </h2>
        {inputLabelsText.map((labelText, index) => (
          <InputWithLabel key={index} label={labelText}></InputWithLabel>
        ))}
        <FeedbackSubmitButton title="Next"></FeedbackSubmitButton>
      </TextFeedbackModal>
    );
  };

  const renderRatingModal = () => {
    const ratingScale = ["1", "2", "3", "4", "5"];

    return (
      <RatingModal
        afterClose={false}
        maskClosable={true}
        closable={false}
        visible={modal.ratingModal}
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
          onClick={() => setModal({ ratingModal: true })}
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
          />
          {mobiletabs ? (
            <MobileTabs tabIndex={tabIndex} childComponent={props.children} />
          ) : null}
          <Main>
            <props.component {...props} />
            {renderRatingModal()}
            {renderTextFeedbackModal()}
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

import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";
import JobPost from "./JobPost/JobPost";

import Profile from "./Profile/Profile";
import ProfileContact from "./Profile/ProfileContact";
import ProfileEditIntro from "./Profile/ProfileEditIntro";
//Aniket Edits
import Connections from "./Connections/Connections";
import Jobs from "./CardDrawer/Carddrawer";

const Main = () => (
  <BrowserRouter>
    <div>
      {/* <Switch> */}
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/jobpost" component={JobPost} />
      <Route path="/profile" component={Profile} />
      <Route path="/profile/contact-information" component={ProfileContact} />
      <Route path="/profile/edit-intro" component={ProfileEditIntro} />
      {/* Aniket Edits */}
      <Route path="/connections" exact component={Connections} />
      <Route path="/jobs" exact component={Jobs} />
      {/* </Switch> */}
    </div>
  </BrowserRouter>
);

export default Main;

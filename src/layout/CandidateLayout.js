import React from "react";
import Navbar from "components/Navbar";
 import Sidebar from "components/Sidebar";
import { Redirect, useLocation } from "react-router-dom";
import useWindowSize from "components/UseWindowSize";
import NewTopHeader from './../components/Navbar/newTopHeader';

export function CandidateLayout(props) {
    return (
      <div className="row p-0 m-0">
        <React.Fragment>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0 m-0 bg-light">
          <>
                <NewTopHeader />
                <div className="p-0 m-0 w-100">{props.children}</div>
              </>
          </div>
        </React.Fragment>
      </div>
    );
}

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import RightSidebar from "./RightSidebar";

const MainLayout = ({ currentUser, currentProfile, onLogout }) => {
  return (
    <>
      <Header
        currentUser={currentUser}
        currentProfile={currentProfile}
        onLogout={onLogout}
      />
      <div className="container-fluid p-0">
        <div className="row g-0 justify-content-center">
          <main className="col-12 col-lg-6 col-xl-5 main-content">
            <Outlet />
          </main>
          <RightSidebar currentProfile={currentProfile} />
        </div>
      </div>
    </>
  );
};

export default MainLayout;

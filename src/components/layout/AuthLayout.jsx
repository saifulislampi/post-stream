import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-md-6 col-lg-5 mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
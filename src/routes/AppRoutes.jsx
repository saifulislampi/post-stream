import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import { publicRoutes, protectedRoutes, specialRoutes } from "./routeConfig";

const AppRoutes = ({ currentUser, currentProfile, onLogout, onLogin, onProfileUpdate, feedRefreshCount }) => {
  // Props mapping function to dynamically assign props to components
  const getPropsForComponent = (route) => {
    const routeName = route.name;

    // Common props by component type
    const propsByComponent = {
      Timeline: { currentUser, currentProfile, feedRefreshCount },
      PostPage: { currentProfile },
      ProfilePage: { currentProfile, onProfileUpdate },
      ExplorePage: { currentProfile, onProfileUpdate },
      HashtagPage: { currentProfile, onProfileUpdate },
      AuthLogin: { onLogin },
    };

    return propsByComponent[routeName] || {};
  };

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        element={
          <UnauthenticatedRoute>
            <AuthLayout />
          </UnauthenticatedRoute>
        }
      >
        {publicRoutes.map((route) => {
          const Component = route.component;
          const componentProps = getPropsForComponent(route);

          return (
            <Route
              key={route.path}
              path={route.path}
              element={<Component {...componentProps} />}
            />
          );
        })}
      </Route>

      {/* Protected App Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout
              currentUser={currentUser}
              currentProfile={currentProfile}
              onLogout={onLogout}
            />
          </ProtectedRoute>
        }
      >
        {protectedRoutes.map((route) => {
          const Component = route.component;
          const componentProps = getPropsForComponent(route);

          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.name === 'Timeline' ?
                  <Component key={componentProps.feedRefreshCount} {...componentProps} /> :
                  <Component {...componentProps} />
              }
            />
          );
        })}
      </Route>

      {/* Special Routes (redirects, etc) */}
      {specialRoutes.map((route) => {
        if (route.redirect) {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<Navigate to={route.redirect} replace />}
            />
          );
        }
        return null;
      })}

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default AppRoutes;

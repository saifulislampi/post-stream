import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import UnauthenticatedRoute from '../components/auth/UnauthenticatedRoute';
import { publicRoutes, protectedRoutes, specialRoutes } from './routeConfig';

const AppRoutes = ({ currentUser, currentProfile, onLogout, onLogin, onAddPost, posts }) => {
  // Props mapping function to dynamically assign props to components
  const getPropsForComponent = (component) => {
    const componentName = component.name;
    
    // Common props by component type
    const propsByComponent = {
      'Timeline': { posts, onAdd: onAddPost, currentUser, currentProfile },
      'PostPage': { currentProfile },
      'ProfilePage': { currentProfile },
      'ExplorePage': { currentProfile },
      'AuthLogin': { onLogin },
    };
    
    return propsByComponent[componentName] || {};
  };
  
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={
        <UnauthenticatedRoute>
          <AuthLayout />
        </UnauthenticatedRoute>
      }>
        {publicRoutes.map(route => {
          const Component = route.component;
          const componentProps = getPropsForComponent(Component);
          
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
      <Route element={
        <ProtectedRoute>
          <MainLayout 
            currentUser={currentUser}
            currentProfile={currentProfile}
            onLogout={onLogout}
          />
        </ProtectedRoute>
      }>
        {protectedRoutes.map(route => {
          const Component = route.component;
          const componentProps = getPropsForComponent(Component);
          
          return (
            <Route 
              key={route.path}
              path={route.path} 
              element={<Component {...componentProps} />} 
            />
          );
        })}
      </Route>

      {/* Special Routes (redirects, etc) */}
      {specialRoutes.map(route => {
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
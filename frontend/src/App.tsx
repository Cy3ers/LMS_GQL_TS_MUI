// ./App.tsx

import React from "react";
import { createBrowserRouter, RouterProvider, RouteObject, Navigate, Outlet } from "react-router-dom";
import LoginContainer from "./containers/LoginContainer";
import DashboardContainer from "./containers/DashboardContainer";
import PrivateRoute from "./PrivateRoute";
import { isAuthenticated } from "./auth";
import AddTask from "./components/AddTask";
import UserListContainer from "./containers/UserListContainer";
import ToastProvider from "./contexts/ToastContext";
import { ErrorBoundary } from "react-error-boundary";
import { RenderError } from "./components/errors/ErrorBoundaryComponent";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo/apollo";
import ThemeContextProvider from "./contexts/theme";

const App: React.FC = () => {
  const routes: RouteObject[] = [
    {
      path: "login",
      element: <LoginContainer />
    },
    {
      path: "dashboard",
      element: (
        <PrivateRoute>
          <Outlet />
        </PrivateRoute>
      ),
      children: [
        {
          path: "",
          element: <DashboardContainer />
        },
        {
          path: "task",
          element: <AddTask />
        },
        {
          path: "user",
          element: <UserListContainer />
        }
      ]
    },
    {
      path: "/",
      element: isAuthenticated() ? <Navigate to='/dashboard' /> : <Navigate to='/login' />
    }
  ];

  const router = createBrowserRouter(routes);

  return (
    <ApolloProvider client={client}>
      <ThemeContextProvider>
        <div className='App'>
          <ErrorBoundary
            FallbackComponent={RenderError}
            onError={() => console.log("Some error caught!!")}
          >
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </ErrorBoundary>
        </div>
      </ThemeContextProvider>
    </ApolloProvider>
  );
};

export default App;

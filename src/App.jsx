import { Suspense, useContext, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

import PageTitle from "./components/PageTitle";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import HomePage from "./pages/HomePage";

import { AuthContext } from "./components/context/AuthContext";
import SessionExpired from "./pages/Authentication/SessionExpired";
import Loader from "./components/styles/Loader";
import AdminRoutes from "./pages/Admin/AdminRoutes";
import StudentRoutes from "./pages/Student/StudentRoutes";
import { Toaster } from "react-hot-toast";

// import FormElements from "./pages/Sundoganan/Form/FormElements"
// import FormLayout from "./pages/Sundoganan/Form/FormLayout";

function App() {
  // const {pathname} = useLocation();

  const { sessionExpired, user } = useContext(AuthContext);
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [pathname]);

  return (
    <>
      {sessionExpired && <SessionExpired />}
      <Toaster />
      <Suspense fallback={<Loader />}>
        {user === null && <DefaultRoute />}

        {user?.role === "Admin" && <AdminRoutes />}
        {user?.role === "User" && <StudentRoutes />}
      </Suspense>
    </>
  );
}

const DefaultRoute = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Home Page oten - MIS" />
            <HomePage />
          </>
        }
      />

      <Route
        path="/auth/signin"
        element={
          <>
            <PageTitle title="Signin | MIS - Benedicto College" />
            <SignIn />
          </>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <>
            <PageTitle title="Signup | MIS - Benedicto College" />
            <SignUp />
          </>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;

import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";
import Loader from "../components/styles/Loader";
import { BsJustify } from "react-icons/bs";


const HomePage = () => {
  const currentpath = useLocation().pathname;
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(currentpath);
      setRedirecting(true);
    }
  }, [user, navigate, currentpath]);

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-success-400 text-4x1 font-semibold">
      {redirecting ? (
        <RedirectPage />
      ) : (
        <div>
          <h1 className="text-black">Grading System Tertiary</h1>
          <Link to="/auth/signin" className="text-red-600 btn btn-primary hover:underline">
            Click Here!
          </Link>
        </div>
      )}
    </main>
  );
};

const RedirectPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-2xl font-semibold text-black dark:text-white">
        You are already logged in. Redirecting...
      </h3>
    </div>
  );
};

export default HomePage;

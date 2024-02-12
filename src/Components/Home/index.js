import { Navigate, NavLink } from "react-router-dom";
import { useState } from "react";
import Navbar from "../Navbar";
import Cookies from "js-cookie";
import "./index.css";

const Home = () => {
  const [isclick, setClick] = useState(false);
  const token = Cookies.get("jwt_toke");
  if (isclick) {
    return <Navigate to="/signup" />;
  }
  if (token !== undefined) {
    return <Navigate to="/loginhome" />;
  }

  return (
    <div>
      <Navbar />
      <div className="home-bg">
        <p>For Indian Users Only</p>
        <h1>
          Start Posting anonymously <br />
          where no one will judge.
        </h1>
        <p>Welcome to stronger discussion forum</p>
        <button
          className="create-acc-but"
          onClick={() => {
            setClick(true);
          }}
        >
          Create your Account
        </button>
        <p>
          Already have an account?{" "}
          <NavLink className="login-link" to="/login">
            login
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Home;

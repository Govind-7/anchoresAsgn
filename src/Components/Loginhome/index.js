import Cookeis from "js-cookie";
import { Navigate, NavLink } from "react-router-dom";
import Navbar from "../Navbar";

const LoginHome = () => {
  const token = Cookeis.get("jwt_toke");
  console.log(token);
  if (token === undefined) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Navbar />
      <h2>
        Account created <br /> successfullY{" "}
      </h2>
      <button>
        <NavLink to="/posts">Create Your Fist Post</NavLink>
      </button>
    </div>
  );
};

export default LoginHome;

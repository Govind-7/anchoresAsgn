import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./Components/Home";
// import Navbar from "./Components/Navbar";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Loginhome from "./Components/Loginhome";
import Posts from "./Components/Posts";
import "./App.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    { path: "/signup", element: <Signup /> },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/loginhome",
      element: <Loginhome />,
    },
    {
      path: "/posts",
      element: <Posts />,
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

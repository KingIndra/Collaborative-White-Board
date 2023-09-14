import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./App.css"
import SignIn from "./screens/SignIn.jsx"
import SignUp from "./screens/SignUp.jsx"
import Routing from "./screens/Routing.jsx";
import Home from "./screens/Home";
import Room from "./screens/Room";
// import Lobby from "./components/Lobby"

const router = () => createBrowserRouter([
  {
    path: "/",
    element: <Routing />,
  },
  {
    path: "signin",
    element: <SignIn />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "lobby",
    element: <Home />,
  },
  {
    path: "room/:room_id",
    element: <Room />,
  },
]);

export default function App() {
  return <>
    <RouterProvider router={router()} />
  </>
}
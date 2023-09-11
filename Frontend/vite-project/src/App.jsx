import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./App.css"
import SignIn from "./components/SignIn.jsx"
import SignUp from "./components/SignUp.jsx"
import Lobby from "./components/Lobby"
import Canvas from "./components/Canvas"
import Routing from "./components/Routing";


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
    element: <Lobby />,
  },
  {
    path: "room/:room_id",
    element: <Canvas />,
  },
]);

export default function App() {
  return <>
    <RouterProvider router={router()} />
  </>
}
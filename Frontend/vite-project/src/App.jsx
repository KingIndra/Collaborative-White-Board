import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

import "./App.css"
import SignIn from "./screens/SignIn.jsx"
import SignUp from "./screens/SignUp.jsx"
import Routing from "./screens/Routing.jsx"
import Home from "./screens/Home"
import Room from "./screens/Room"
import VideoChat from "./webrtc/VideoChat"


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
  {
    path: "rtc/join",
    element: <VideoChat />,
  },
]);

export default function App() {
  return <>
    <RouterProvider router={router()} />
  </>
}
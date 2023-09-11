import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Link from '@mui/material/Link';

export default function Routing() 
{
    const navigate = useNavigate();
    const userLogged = useRef(false);

    if(userLogged.current) {
        navigate('/lobby')
    } else {
        navigate('/signin')
    }

    return <>
        <h1>HOME</h1>
    </>
}
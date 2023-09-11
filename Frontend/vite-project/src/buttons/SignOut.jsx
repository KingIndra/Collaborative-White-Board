import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

export default function SignOut() 
{
    const navigate = useNavigate()

    const logout = () => {
        localStorage.clear()
        navigate("/signin")
    }
    
    return <>
        <IconButton id="signout-button" onClick={logout} aria-label="delete" size="meduim">
          <LogoutIcon fontSize="inherit" />
        </IconButton>
    </>
}
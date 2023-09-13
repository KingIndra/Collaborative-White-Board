import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Chat from './Chat';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ChatDialog() 
{
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const toggleDialog = () => {
    setOpen(open => !open)
  }

  return (
    <div id="chat-dialog-div">
      <Button id='chat-dialog-btn' variant="contained" onClick={toggleDialog}>
        Chat
      </Button>
      <Dialog
        id="chat-dialog"
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Chat/>
      </Dialog>
    </div>
  )
}
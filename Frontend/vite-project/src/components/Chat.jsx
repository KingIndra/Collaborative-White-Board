import React, { useState, useEffect, useContext, useRef } from "react"
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  Paper,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"

import { RoomContext } from "../screens/Room"

function useForceUpdate(){
  const [value, setValue] = useState(0)
  return () => setValue(value => value + 1)
}

export default function Chat() 
{
  const forceUpdate = useForceUpdate()
  const {chatSocket, room_name} = useContext(RoomContext)

  const [messages, setMessages] = React.useState([])
  const [input, setInput] = React.useState("")
  const scrollRef = useRef(null)

  useEffect(() => {
    axios.post("chat/room/get_messages/", {
      "room_name": "Draw_" + room_name
    })
    .then(({data}) => {
      setMessages(data)
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    })
    .catch((err) => {
      alert("Error")
    })
  }, [])
  
  useEffect(() => {
    chatSocket.onopen = (e) => {
      console.log('open', e)
    }
    chatSocket.onmessage = ({data}) => {
      data = JSON.parse(data)
      setMessages(messages => {
        const message = {
          id: Math.floor(Math.random()*1000000 + 1), 
          text: data.text, 
          sender: "bot",
          user: data.user,
        }
        return [...messages, message]
      })
      setInput("")
      forceUpdate()
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    }
    chatSocket.onclose = (e) => {
      console.log('closed', e)
    }
    chatSocket.onerror = (e) => {
      console.log('failed', e)
    }
  }, [])

  const handleSend = () => {
    if (input.trim() !== "") {
      chatSocket.send(JSON.stringify({"message":input}))
    }
  }

  const handleInputChange = (event) => {
    setInput(event.target.value)
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.200",
      }}
    >
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={scrollRef}>
          <br />
          <br />
          <br />
        </div>
      </Box>
      <Box sx={{ p: 2, backgroundColor: "background.default" }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <TextField
              size="small"
              fullWidth
              placeholder="Type a message"
              variant="outlined"
              value={input}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSend}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

const Message = ({ message }) => {

  const {username} = useContext(RoomContext)
  const isNotMe = message.user !== username

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isNotMe ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isNotMe ? "row" : "row-reverse",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ bgcolor: isNotMe ? "primary.main" : "secondary.main" }}>
          {message.user[0]}
        </Avatar>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            ml: isNotMe ? 1 : 0,
            mr: isNotMe ? 0 : 1,
            backgroundColor: isNotMe ? "primary.light" : "secondary.light",
            borderRadius: isNotMe ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
          }}
        >
          <Typography variant="body1">{message.text}</Typography>
        </Paper>
      </Box>
    </Box>
  )
}
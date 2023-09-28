import React, { useRef, useState, useEffect, useContext } from "react"
import "../styles/canvas.css"

import { RoomContext } from "../screens/Room"


export default function Canvas() 
{
  const {username, room_name, drawSocket} = useContext(RoomContext)

  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#3B3B3B")
  const [size, setSize] = useState("3")
  const canvasRef = useRef(null)
  const ctx = useRef(null)
  const timeout = useRef(null)
  const [cursor, setCursor] = useState("default")

  useEffect(() => {
    const canvas = canvasRef.current
    ctx.current = canvas.getContext("2d")

    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    axios.post("chat/room/get_canvas/", {
      "room_name": "Draw_" + room_name
    })
    .then(({data}) => {
      if(data.image) {
        updateImage(data.image)
      }
    })
    .catch((err) => {
      alert("Error")
    })
  }, [ctx])

  useEffect(() => {
    drawSocket.onopen = (e) => {
      console.log('open', e)
    }
    drawSocket.onmessage = ({data}) => {
      updateImage(JSON.parse(data))
    }
    drawSocket.onclose = (e) => {
      console.log('closed', e)
    }
    drawSocket.onerror = (e) => {
      console.log('failed', e)
    }
  }, [])

  const updateImage = (data) => {
    const image = new Image()
    ctx.current = canvasRef.current.getContext("2d")

    image.onload = function () {
      ctx.current.drawImage(image, 0, 0)
      setIsDrawing(false)
    }
    image.src = data
  }

  const startPosition = ({ nativeEvent }) => {
    setIsDrawing(true)
    draw(nativeEvent)
  }

  const finishedPosition = () => {
    setIsDrawing(false)
    ctx.current.beginPath()
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return
    }
    const canvas = canvasRef.current
    ctx.current = canvas.getContext("2d")
    ctx.current.lineWidth = size
    ctx.current.lineCap = "round"
    ctx.current.strokeStyle = color

    ctx.current.lineTo(nativeEvent.clientX, nativeEvent.clientY)
    ctx.current.stroke()
    ctx.current.beginPath()
    ctx.current.moveTo(nativeEvent.clientX, nativeEvent.clientY)

    sendCanvas()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)

    sendCanvas()
  }

  const sendCanvas = () => {
    if (timeout.current !== undefined) {
      clearTimeout(timeout.current)
    }
    timeout.current = setTimeout(function () {
      const data = {"message": canvasRef.current.toDataURL("image/png")}
      drawSocket.send(JSON.stringify(data))
    }, 1000)
  }

  const getPen = () => {
    setCursor("default")
    setSize("3")
    setColor("#3B3B3B")
  }

  const eraseCanvas = () => {
    setCursor("grab")
    setSize("20")
    setColor("#FFFFFF")
  }

  return (
    <>
      <h3 id="username-canvas">hello! {username}</h3>
      <div className="canvas-btn">
        <button onClick={getPen} className="btn-width">
          Pencil
        </button>
        <div className="btn-width">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div>
          <select
            className="btn-width"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option>  1 </option> <option>  3 </option> <option>  5 </option>
            <option> 10 </option> <option> 15 </option> <option> 20 </option>
            <option> 25 </option> <option> 30 </option> <option> 50 </option>
          </select>
        </div>
        <button onClick={clearCanvas} className="btn-width">
          Clear
        </button>
        <div>
          <button onClick={eraseCanvas} className="btn-width">
            Erase
          </button>
        </div>
      </div>
      <canvas
       style={{ cursor: cursor }}
        onMouseDown={startPosition}
        onMouseUp={finishedPosition}
        onMouseMove={draw}
        ref={canvasRef}
        className="cursor"
      />
    </>
  )
}
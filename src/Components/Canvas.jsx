import React, { useEffect, useRef, useState } from 'react'

const Canvas = () => {

    const [isDrawing, setIsDrawing] = useState(false)
    const [color, setColor] = useState("#3B3B3B")
    const [size, setSize] = useState("3")
    const canvasRef = useRef(null)
    const ctx = useRef(null)
    const timeout = useRef(null)
    const [cursor, setCursor] = useState("default")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(()=>{
            const canvas = canvasRef.current
            ctx.current = canvas.getContext("2d")
            canvas.height = window.innerHeight - 10
            canvas.width = window.innerWidth
            const canvasimg = localStorage.getItem("canvasimg")
            if(canvasimg) {
                var image = new Image()
                ctx.current = canvas.getContext("2d")
                image.onload = function () {
                    ctx.current.drawImage(image, 0, 0)
                    setIsDrawing(false)
                }
                image.src = canvasimg
            }
            setLoading(false)
        },1500)
    }, [ctx])

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

        if (timeout.current !== undefined) clearTimeout(timeout.current)
        timeout.current = setTimeout(function () {
            var base64ImageData = canvas.toDataURL("image/png")
            localStorage.setItem("canvasimg", base64ImageData)
        }, 400)
    }
    
    const clearCanvas = () => {
        localStorage.removeItem("canvasimg")
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        context.fillStyle = "black"
        context.fillRect(0, 0, canvas.width, canvas.height)

        if (timeout.current !== undefined) clearTimeout(timeout.current)
        timeout.current = setTimeout(function () {
            var base64ImageData = canvas.toDataURL("image/png")
            localStorage.setItem("canvasimg", base64ImageData)
        }, 400)
    }
    
    const getPen = () => {
        setCursor("default")
        setSize("3")
        setColor("#3B3B3B")
    }
    
    const eraseCanvas = () => {
        setCursor("grab")
        setSize("20")
        setColor("#000000")

        if (!isDrawing) {
            return
        }
    }

    return (
        <div className='flex justify-center w-screen text-white'>
            {loading && <div className='whitespace-nowrap absolute top-1/2 left-1/2 text-lg font-mono animate-pulse translate-x-[-50%] translate-y-[-50%]'>
                WELCOME TO BLACK BOARD
            </div>}
            <div className="absolute bottom-5 px-2 p-1 flex justify-between items-center border-2 border-gray-700 rounded-2xl">
                <div className='mr-5'>
                    <button onClick={getPen} className='active:text-red-700 active:transition-all active:scale-150'><i className='fa fa-pen'></i></button>
                </div>

                <div className='active:text-red-700 active:transition-all active:scale-150'>
                    <label className="fa fa-fill cursor-pointer" htmlFor='color'>
                        <input type="color" className='hidden' id='color' value={color} onChange={(e) => setColor(e.target.value)} />
                    </label>
                </div>

                <div className='mx-5 bg-black'>
                    <select className="w-14 bg-black cursor-pointer rounded-xl outline-none border-2 border-gray-500" value={size} onChange={(e) => setSize(e.target.value)} >
                        <option> 1 </option>
                        <option> 3 </option>
                        <option> 5 </option>
                        <option> 10 </option>
                        <option> 15 </option>
                        <option> 20 </option>
                        <option> 25 </option>
                        <option> 30 </option>
                    </select>
                </div>

                <div className='mr-5 active:text-red-700 active:transition-all active:scale-150'>
                    <button onClick={clearCanvas} className="fa fa-rotate-left"></button>
                </div>

                <div className=' active:text-red-700 active:transition-all active:scale-150'>
                    <button onClick={eraseCanvas} className="fa fa-eraser"></button>
                </div>
            </div>
            <canvas style={{ cursor: cursor , width: "auto", height: "auto"}} onMouseDown={startPosition} onTouchStart={startPosition} onMouseUp={finishedPosition} onTouchEnd={finishedPosition} onMouseMove={draw} onTouchMove={draw} ref={canvasRef} />
        </div>
      )
}

export default Canvas

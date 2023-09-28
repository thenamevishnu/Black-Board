import { BrowserRouter, Route, Routes } from "react-router-dom"
import CanvasPage from "./Pages/CanvasPage"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<CanvasPage/>} />
            </Routes>
        </BrowserRouter>
    )  
}

export default App

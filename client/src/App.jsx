import { Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import Sigin from "./Pages/Sigin"
import Signup from "./Pages/Signup"
import NotFound from "./Pages/NotFound"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Sigin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

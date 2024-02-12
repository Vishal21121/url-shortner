import { Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import Sigin from "./Pages/Sigin"
import Signup from "./Pages/Signup"
import NotFound from "./Pages/NotFound"
import PrivateRoute from "./components/PrivateRoute"
import PublicRoute from "./components/PublicRoute"

function App() {

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/signin" element={<PublicRoute><Sigin /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

import { Routes,Route } from "react-router-dom";
import Navbar from "./components/Navbar"
import Home from "./pages/Home";
import Button from './components/Button'

function App() {

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-4">
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </>
  );
}

export default App

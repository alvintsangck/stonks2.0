import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import DefaultContainer from "./components/DefaultContainer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<DefaultContainer />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

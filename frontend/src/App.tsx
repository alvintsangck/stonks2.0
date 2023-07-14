import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/login/Login";
import DefaultContainer from "./routes/DefaultContainer";

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

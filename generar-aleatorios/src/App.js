import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MetodoLineal from "./pages/MetodoLineal";
import MetodoMultiplicativo from "./pages/MetodoMultiplicativo";
import Cursor from "./components/Cursor";

function App() {
  return (
    <Router>
      <Cursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lineal" element={<MetodoLineal />} />
        <Route path="/multiplicativo" element={<MetodoMultiplicativo />} />
      </Routes>
    </Router>
  );
}

export default App;
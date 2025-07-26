import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import UserMain from "./pages/user/UserMain";
// import { generateCircleChart } from "./features/reports/chartGenerators/generateCircleChart";

const App: React.FC = () => {
  return (
    <div style={{ margin: "0 auto" }}>
      {/* {<div dangerouslySetInnerHTML={{ __html: generateCircleChart({ status: "Surviving", statusColor: "#F5E6A3" }) }} />} */}
      <Routes>
        <Route path="/user/*" element={<UserMain />} />
        <Route path="*" element={<Navigate to="/user" />} />
      </Routes>
    </div>
  );
};

export default App;

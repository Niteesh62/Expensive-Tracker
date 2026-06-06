import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Sidebar from "./Components/Sidebar/Sidebar";
import MainLayout from "./Components/Layouts/MainLayout";
import Home from "./Components/Home/Home";
import Expenses from "./Components/Expenses/Expenses";
import Trips from "./Components/Trips/Trips";
import Approvals from "./Components/Approvals/Approvals";
import Settings from "./Components/Settings/Settings";
import Support from "./Components/Support/Support";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
       <Route element={<MainLayout />}>

          <Route path="/home" element={<Home />} />
           <Route path="/expenses" element={<Expenses />} />
           <Route path="/Trips" element={<Trips />} />
            <Route path="/Approvals" element={<Approvals />} />
            <Route path="/Settings" element={<Settings />} />  
             <Route path="/Support" element={<Support />} />  

         
        </Route>


       <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
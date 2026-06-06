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
import ErrorPage401 from "./Components/Errors/ErrorPage401";
import ErrorPage403 from "./Components/Errors/ErrorPage403";
import ErrorPage404 from "./Components/Errors/ErrorPage404";


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
                    {/* Error Pages */}
            <Route path="/401" element={<ErrorPage401 />} />
            <Route path="/403" element={<ErrorPage403 />} />
            <Route path="/404" element={<ErrorPage404 />} />
            
            {/* Catch-all for undefined routes */}
            <Route path="*" element={<ErrorPage404 />} />


       <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
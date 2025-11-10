import { createBrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./routes/Dashboard";
import Signin from "./components/Signin";
import Signup from "./components/Signup";

export const router = createBrowserRouter([{
    path : "/" ,
    element:<Signin />
},
{
    path : "/signup" ,
    element:<Signup />
}
, {
    path:"/dashboard",
    element:(
        <>
            <Header />
            <Dashboard />
        </>
    )
}])
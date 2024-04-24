import { AddressForm } from "./component/address-form/address";
import { AdminLogin } from "./component/admin-Login/adminLogin";
import { Footer } from "./component/footer/footer";
import { Main } from "./component/main/main";
import { Navbar } from "./component/navbar/navbar";
import { Register } from "./component/register/register";
import { Userlogin } from "./component/user-Login/userLogin";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { UserInfo } from "./component/user-details/user-details";
import { Modall } from "./component/modal/modal";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <Main />
              <Footer />
            </>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Userlogin />} />
          <Route path="/admin-login" element={<AdminLogin />}></Route>
          <Route path="/user-info" element={
            <>
              <Navbar />
              <UserInfo />
            </>
          } />
  
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;

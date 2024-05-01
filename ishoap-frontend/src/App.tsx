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
import { Product } from "./component/Product/Product";
import { SingleProduct } from "./component/singleProduct/singleproduct";
import { RateProduct } from "./component/Rate_product/rateProduct";




function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Navbar /><Main /><Footer /></>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Userlogin />} />
          <Route path="/admin-login" element={<AdminLogin />}></Route>
          <Route path="/user-info" element={<> <Navbar /> <UserInfo /></>} />
          <Route path="/product" element={<><Navbar /> <Product /> <Footer/></>} />
          <Route path="/product/:id" element={<><Navbar/><SingleProduct/></>} />
          <Route path="/rate-product/:id" element={<><Navbar/> <RateProduct/></>} />
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;

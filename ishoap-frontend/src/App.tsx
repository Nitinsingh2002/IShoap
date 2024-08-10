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
import { CartPage } from "./component/CartPage/cartPage";
import { VendorRegistration } from "./component/vendorRegistrationLogin/vendorRegistraion";
import { VendorLogin } from "./component/vendorRegistrationLogin/vendorLogin";
import { VendorAddProduct } from "./component/vendorDashBoard/vendoAddProduct";
import { VendorNavbar } from "./component/vendorDashBoard/vendor.navbar";
import { VendorOpertion } from "./component/vendorOperation/vendorOperation";
import { VendorDetails } from "./component/vendorOperation/vendorDetails";
import { VendorUpdateDetails } from "./component/vendorOperation/vendorUpdateDetails";
import { VendorSidebar } from "./component/vendorOperation/VendorSideBar";
import { VendorProduct } from "./component/vendorDashBoard/vendorProducts";
import { AdminNavbar } from "./component/Admin-operation/AdminNavbar";
import { AdminDashboard } from "./component/Admin-operation/AdminDashboar";
import { AdminAddProduct } from "./component/Admin-operation/Admin-add-product";
import { AdminAllProductList } from "./component/Admin-operation/Admin-all-product-list";
import { AdminUpdateProduct } from "./component/Admin-operation/admin-update-product";
import { VendorList } from "./component/Admin-operation/ListOfAllVendor";
import { UserList } from "./component/Admin-operation/listodAlluser";
import { CategoryList } from "./component/Admin-operation/listOfAllCategory";
import { AddCategory } from "./component/Admin-operation/add-category";
import { UpdateCategory } from "./component/Admin-operation/Admin-update-category";
import { PendingProduct } from "./component/Admin-operation/PendingProduct";
import { SinglePendingProduct } from "./component/Admin-operation/single-product";
import { Test } from "./component/test";
import { ListOfAddress } from "./component/OrderComponent/ListOfAddress";
import { AdForm } from "./component/OrderComponent/adressForm";





function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Navbar /><Main /><Footer /></>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Userlogin />} />
          <Route path="/admin/login" element={<AdminLogin />}></Route>
          <Route path="/user-info" element={<> <Navbar /> <UserInfo /></>} />
          <Route path="/product" element={<><Navbar /> <Product /> <Footer /></>} />
          <Route path="/product/:id" element={<><Navbar /><SingleProduct /></>} />
          <Route path="/rate-product/:id" element={<><Navbar /> <RateProduct /></>} />
          <Route path="/cart" element={<><Navbar /><CartPage /></>} />
          <Route path="/vendor/registration" element={<><VendorRegistration /></>} ></Route>
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/order/address" element={<><Navbar/><ListOfAddress /></>} />
          <Route path= "/order/add-address" element ={<><Navbar/> <AdForm/></>}/>


          <Route path="/vendor" element={<VendorNavbar />}>
            <Route index element={<VendorProduct />} />
            <Route path="/vendor" element={<VendorOpertion />}>
              <Route path="details" element={<VendorDetails></VendorDetails>} />
              <Route path="update-details" element={<VendorUpdateDetails />} />
              <Route path="add-product" element={<VendorAddProduct />} />
            </Route>
          </Route>


          {/* admin routes start from here */}
          <Route path="/admin" element={<><AdminNavbar /><AdminDashboard /></>}>
            <Route index element={<AdminAllProductList />} />
            <Route path="all-product" element={<AdminAllProductList />} />
            <Route path="add-product" element={<AdminAddProduct />} />
            <Route path="update-product/:id" element={<AdminUpdateProduct />} />
            <Route path="all-vendor" element={<VendorList />} />
            <Route path="all-user" element={<UserList />} />
            <Route path="all-category" element={<CategoryList />} />
            <Route path="add-category" element={<AddCategory />} />
            <Route path="update-category/:id" element={<UpdateCategory />} />
            <Route path="pending-product" element={<PendingProduct />} />
          </Route>
          <Route path="admin/pending-product/:id" element={<><Navbar /><SinglePendingProduct /></>} />



        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

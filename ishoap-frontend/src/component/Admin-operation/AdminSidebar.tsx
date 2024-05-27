import { useState, useEffect } from "react"
import { AdminDetails } from "../../contract/AdminDetailcontract";
import { useFetchApi } from "../../Custom-Hooks/useFetchApi"
import { useCookies } from "react-cookie";
import { jwtDecode } from 'jwt-decode';
import { NavLink, useLocation, useNavigate } from "react-router-dom";


export function AdminSidebar() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [decodedToken, setDecodedToken] = useState<AdminDetails>();
    const [showSidebar, setShowSidebar] = useState<boolean>(false);

    const fetchDataFromApi = useFetchApi();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {

        if (!token) {
            navigate("/admin-login")
        } else {
            const decode: any = jwtDecode(token);
            setDecodedToken(decode);
        }
    }, [token])

    return (
        <>
            <div className="sidebar">

                <div className="responsive-user-info" onClick={() => setShowSidebar(!showSidebar)}>
                    {
                        showSidebar ? (<i className="bi bi-x-circle"></i>) : <i className="bi bi-border-width"></i>
                    }

                </div>


                <div className="gretting">
                    <p>Hello,</p>
                    <h5>{decodedToken?.name}</h5>
                </div>

                <div className={showSidebar ? "active-sidebar" : "user-info-sidebarr"}>
                    <div className="account-details">
                        <h5>
                            <span className="bi bi-person-fill me-2 text-primary fs-3">
                            </span>Admin Operation
                        </h5>

                        <p className={location.pathname === "/admin/all-product" || location.pathname === "/admin" ? "active" : ""}>
                            <NavLink to="/admin/all-product"
                                style={{ textDecoration: 'none', color: 'inherit' }}>
                                All Product
                            </NavLink>
                        </p>

                        <p className={location.pathname === "/admin/add-product" ? "active" : ""}>
                            <NavLink to="/admin/add-product"
                                style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}>
                                Add Product
                            </NavLink>
                        </p>


                        <p className={location.pathname === "/vendor/pending-product/" ? "active" : ""}>
                            <NavLink to="/admin/pending-product"
                                style={{ textDecoration: 'none', color: 'inherit' }}>
                                Pending Product
                            </NavLink>
                        </p>


                        <p className={location.pathname === "/admin/all-vendor" ? "active" : ""}>
                            <NavLink to="/admin/all-vendor"
                                style={{ textDecoration: 'none', color: 'inherit' }}>
                                All Vendor
                            </NavLink>
                        </p>


                        <p className={location.pathname === "/admin/all-user" ? "active" : ""}>
                            <NavLink to="/admin/all-user"
                                style={{ textDecoration: 'none', color: 'inherit' }}>
                                All User
                            </NavLink>
                        </p>


                        <p className={location.pathname === "/admin/all-category" ? "active" : ""}>
                            <NavLink to="/admin/all-category"
                                style={{ textDecoration: 'none', color: 'inherit' }}>
                                All Category
                            </NavLink>
                        </p>


                        <p className={location.pathname === "/admin/add-category" ? "active" : ""}>
                            <NavLink to="/admin/add-category"
                                style={{ textDecoration: 'none', color: 'inherit' }}>
                                Add Category
                            </NavLink>
                        </p>


                    </div>
                </div>

            </div>
        </>
    )
}
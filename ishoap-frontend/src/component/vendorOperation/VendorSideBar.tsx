import { NavLink, useLocation } from 'react-router-dom';

import { useEffect, useState } from "react"
import { useFetchApi } from "../../Custom-Hooks/useFetchApi"
import { useCookies } from "react-cookie";
import { VendorDetails as vendorContract } from '../../contract/vendorDetailsContract';
import { toast } from "react-toastify";
import './vendor.css'

export function VendorSidebar() {

    const fetchDataFromApi = useFetchApi();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];
    const [vendorData, setVenorData] = useState<vendorContract>();

    const location = useLocation();


    const [showSidebar, setShowSidebar] = useState<boolean>(false);

    const LoadVendorDetails = async () => {
        const result = await fetchDataFromApi({
            url: 'http://localhost:8000/vendor/get-vendor-details',
            method: 'GET',
            token: token
        })


        if (result.error) {
            toast.error(result.error, {
                autoClose: 1000
            })
        } else {
            setVenorData(result.response);
        }
    }

    useEffect(() => {
        LoadVendorDetails();
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
                    <h5>{vendorData?.name}</h5>
                </div>

                <div className={showSidebar ? "active-sidebar" : "user-info-sidebarr"}>
                    <div className="account-details">
                        <h5> <span className="bi bi-person-fill me-2 text-primary fs-3"></span>vendor details</h5>
                        <p className={location.pathname === "/vendor/details" ? "active" : ""}><NavLink to="/vendor/details" style={{ textDecoration: 'none', color: 'inherit' }}>Profile information</NavLink>
                        </p>
                        <p className={location.pathname === "/vendor/update-details" ? "active" : ""}><NavLink to="/vendor/update-details" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Update Profile</NavLink>
                        </p>
                        <p className={location.pathname === "/vendor/add-product" ? "active" : ""}>
                            <NavLink to="/vendor/add-product" style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}>
                                Add Product
                            </NavLink>
                        </p>
                    </div>
                </div>

            </div>
        </>
    )
}
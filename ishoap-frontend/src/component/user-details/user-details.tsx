import { useState, useEffect } from "react"
import { useFetchApi } from "../../Custom-Hooks/useFetchApi"
import { UserDetails } from '../../contract/userDetailsContract'
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './user-details.css'
import { PersonalInfo } from "../personal-information/personalInfo";
import { ShowAllAddress } from "../show-address/show-address";
import { AddressForm } from '../address-form/address'



export function UserInfo() {


    const navigate = useNavigate();
    const [cookies] = useCookies(['token']);
    const token = cookies['token']
    const fetchDataFromApi = useFetchApi();
    const [userData, setUserData] = useState<UserDetails>(
        {
            name: {
                firstName: "",
                lastName: ""
            },
            id: "",
            email: "",
            mobile: "",
            gender: "",
            dateOfBirth: new Date()
        }
    );

    const [showPersonalInfo, setShowPersonalInfo] = useState<boolean>(true);
    const [showadress, setShowAddress] = useState<boolean>(false);
    const [showAddAddress, setShowAddAddress] = useState<boolean>(false);
    const [showSidebar, setShowSidebar] = useState<boolean>(false);

    async function loadApi(): Promise<void> {
        const result = await fetchDataFromApi({
            url: 'http://localhost:8000/user/fetchUserDetails',
            method: 'GET',
            token: token
        })

        if (result.error) {
            toast.error(result.error);
        } else {
            setUserData(result.response);
        }
    }


    function handleProfileInfo(): void {
        setShowAddress(false)
        setShowAddAddress(false)
        setShowPersonalInfo(true)

    }
    function handleAddress(): void {
        setShowAddress(true)
        setShowAddAddress(false)
        setShowPersonalInfo(false)
    }
    function handleAddaddress(): void {
        setShowAddress(false)
        setShowAddAddress(true)
        setShowPersonalInfo(false)
    }

    function handleAddressSubmitted(): void {
        setShowAddress(true);
        setShowAddAddress(false);
        setShowPersonalInfo(false);
    }

    useEffect(() => {
        if (!token) {
            navigate("/login")
            return;
        }
        loadApi();
    }, [token])


    return (
        <>
            <div className="user-info">

                <div className="userInfo-parent">


                    <div className="responsive-user-info" onClick={() => setShowSidebar(!showSidebar)}>
                        {
                            showSidebar ? (<i className="bi bi-x-circle"></i>) : <i className="bi bi-border-width"></i>
                        }

                    </div>


                    <div className={showSidebar ? "active-sidebar" : "user-info-sidebar"}>
                        <div className="gretting">
                            <p>Hello,</p>
                            <h5>{userData?.name.firstName} {userData?.name.lastName}</h5>
                        </div>

                        <div className="account-details">
                            <h5> <span className="bi bi-person-fill me-2 text-primary fs-3"></span>Account details</h5>
                            <p className={showPersonalInfo ? "active" : ""} onClick={handleProfileInfo}>Profile information</p>
                            <p className={showadress ? "active" : ""} onClick={handleAddress}>Address</p>
                            <p className={showAddAddress ? "active" : ""} onClick={handleAddaddress}>Add address</p>

                        </div>
                    </div>




                    <div className="user-info-container">
                        {
                            showPersonalInfo && (
                                <div className="personal-information">
                                    <PersonalInfo userData={userData} />
                                </div>
                            )
                        }

                        <div className="address-list">
                            {
                                showadress && <ShowAllAddress token={token} handleAddaddress={handleAddaddress} />
                            }
                        </div>

                        <div className="add-address">
                            {showAddAddress && <AddressForm onAddressSubmitted={handleAddressSubmitted} />}
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

import Divider from '@mui/material/Divider';
import { useFetchApi } from '../../Custom-Hooks/useFetchApi';
import { useEffect, useState } from 'react';
import { ShowAddressContract } from "../../contract/showAddressComntract"
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import './showaddress.css'
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { UpdateAddress } from '../Update-address/update-address';
import { Modall } from '../modal/modal';
import { string } from 'yup';
import axios from 'axios';
import { AddressContract } from '../../contract/addressContract'


export function ShowAllAddress({ token, handleAddaddress }: { token: any, handleAddaddress: () => void }) {

    const navigate = useNavigate();
    const fetchDataFromApi = useFetchApi()
    const [userAddress, setUserAddress] = useState<AddressContract[]>();

    const [ShowAllAddress, setShowAllAdress] = useState<boolean>(true)
    const [showupdateAddress, setShowUpdateAddress] = useState<boolean>(false)
    const [currentAddress, setCurrentAddress] = useState<ShowAddressContract | null>(null);


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    async function LoadAddress(): Promise<void> {
        const result = await fetchDataFromApi({
            url: "http://localhost:8000/user/get-address",
            method: "GET",
            token: token
        })

        if (result.error) {
            toast.error(result.error)
        } else {
            setUserAddress(result.response)
        }
    }

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDeleteMenu = (id: string) => {
        setShow(true);
        handleMenuClose();
    }


    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (address: ShowAddressContract): void => {
        console.log("address", address)
        setCurrentAddress(address)
        handleUpdateAddress();
        handleMenuClose();
     

    }

    const handleUpdateAddress = () => {
        setShowAllAdress(false)
        setShowUpdateAddress(true)
    }

    const cancelHandleUpdate = (): void => {
        setShowAllAdress(true)
        setShowUpdateAddress(false)
        setCurrentAddress(null);
        LoadAddress();
    }

    const handleDelete = async (id: string): Promise<void> => {
        console.log("api call function call", id)
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/user/remove-address/${id}`,
            method: 'delete',
            token: token
        })

        if (result.error) {
            toast.error(result.error, {
                autoClose: 1000
            });
        } else {
            toast.success(result.response, {
                autoClose: 1000
            })
        }
        LoadAddress();
    }

    useEffect(() => {
        if (!token) {
            navigate("/login")
        } else {
            LoadAddress();
        }

    }, [])

    console.log(currentAddress);

    return (
        <>
            <ToastContainer />
            {

                ShowAllAddress && <div className="show-all-address">
                    <h5>Your all saved address</h5>
                    <hr className='w-100' />

                    <Button variant="contained" className='add-address-btn' onClick={handleAddaddress}>
                        <div>Add Address</div>
                        <div className='bi bi-plus-lg'> </div>
                    </Button>

                    {
                        userAddress?.map((a, index) => (

                            <div className='single-address' key={index}>
                                <div className='button-container'>

                                    <span className='class="bi bi-three-dots-vertical'
                                        onClick={handleMenuOpen}>
                                    </span>

                                    <Menu
                                        id="demo-positioned-menu"
                                        aria-labelledby="demo-positioned-button"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleMenuClose}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                    >
                                        <MenuItem onClick={() => handleMenuClick(a)}
                                            className='update MenuItem'
                                        >
                                            Update
                                        </MenuItem>

                                        <MenuItem onClick={() => a._id && handleDeleteMenu(a._id)} className='delete MenuItem'>Delete</MenuItem>
                                    </Menu>

                                    {show && <Modall show={show}
                                        handleClose={handleClose}
                                        handleShow={handleShow}
                                        handleDelete={() => handleDelete(a._id)}
                                        id={a._id}
                                    />}
                                </div>
                                <div className='name-mobile-container'>
                                    <span>{a.name}</span>
                                    <span>{a.mobile}</span>
                                </div>
                                <div className='all-container'>
                                    <span >{a.street},</span>
                                    <span > {a.city},</span>
                                    <span > {a.state},</span>
                                    <span > {a.country},</span>
                                    <span > - {a.postalCode}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }

            {
                showupdateAddress && <UpdateAddress cancelHandleUpdate={cancelHandleUpdate} currentAddress={currentAddress} />
            }
        </>
    )
}
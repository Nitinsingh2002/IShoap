import { useEffect, useState } from "react"
import { useFetchApi } from "../../Custom-Hooks/useFetchApi"
import { VendorDetails } from '../../contract/vendorDetailsContract'
import { useCookies } from "react-cookie"
import Loadingcomponent from "../Loading/Loading"
import { useNavigate } from "react-router-dom"
import './admin-vendor.css';
import { UserDetails } from '../../contract/userDetailsContract';


export const UserList = () => {
    const [allUser, setAllUser] = useState<UserDetails[]>()
    const fetchDataFromApi = useFetchApi()
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];
    const [loading, setLoading] = useState(true);
    const [error, setErro] = useState<string | null>(null)
    const navigate = useNavigate();

    const LoadAllUserDetails = async () => {
        setLoading(true)
        const result = await fetchDataFromApi({
            url: "http://localhost:8000/user/all-users",
            method: 'get',
            token: token
        })

        if (result.error) {
            setErro(result.error)
        } else {
            setAllUser(result.response);
        }
        setLoading(false);
    }


    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
        } else {
            LoadAllUserDetails()
        }
    }, [token])


    return (
        <>

            {
                loading ? (
                    <div className="text-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                        <Loadingcomponent />
                    </div>
                ) : error ? (
                    <div className="text-center product-not-found-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                        <h2 className="product-not-found-message" style={{ color: '#ff6347', fontSize: '2rem', fontWeight: 'bold', margin: '20px 0' }}>Vendor details not found</h2>
                        <p style={{ color: '#555', fontSize: '1rem' }}>{error}</p>
                    </div>
                ) : (
                    <div>
                        <h5 className='fs-4'>All vendors</h5>
                        <hr />
                        {
                            allUser?.map((single) => (
                                <div key={single._id} className="admin-all-vendor">
                                    <div>
                                    <h6 className="pra">Name : <span>{single.name.firstName}{" "}{single.name.lastName}</span></h6>
                                    <p className="pra">Email : <span>{single.email}</span></p>
                                    <p className="pra">contact number :{single.mobile}</p>
                                    <p className="pra">Gender : {single.gender}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </>
    )
}
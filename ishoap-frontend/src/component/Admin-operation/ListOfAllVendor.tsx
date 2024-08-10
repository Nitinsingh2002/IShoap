import { useEffect, useState } from "react"
import { useFetchApi } from "../../Custom-Hooks/useFetchApi"
import { VendorDetails } from '../../contract/vendorDetailsContract'
import { useCookies } from "react-cookie"
import Loadingcomponent from "../Loading/Loading"
import { useNavigate } from "react-router-dom"
import './admin-vendor.css';


export const VendorList = () => {
    const [allVendor, setallVendor] = useState<VendorDetails[]>()
    const fetchDataFromApi = useFetchApi()
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];
    const [loading, setLoading] = useState(true);
    const [error, setErro] = useState<string | null>(null)
    const navigate = useNavigate();

    const LoadAllVendorDetails = async () => {
        setLoading(true)
        const result = await fetchDataFromApi({
            url: "http://localhost:8000/vendor/get-vendor",
            method: 'get',
            token: token
        })

        if (result.error) {
            setErro(result.error)
        } else {
            setallVendor(result.response);
        }
        setLoading(false);
    }


    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
        } else {
            LoadAllVendorDetails()
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
                            allVendor?.map((single) => (
                                <div  key={single._id}   className="admin-all-vendor">
                                  <div>
                                  <h6 className="pra">Name : <span>{single.name}</span></h6>
                                   <p className="pra">Email : <span>{single.email}</span></p>
                                   <p className="pra">contact number: {single.mobile}</p>
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
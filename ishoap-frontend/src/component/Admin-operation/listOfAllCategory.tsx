import { useEffect, useState } from "react"
import { useFetchApi } from "../../Custom-Hooks/useFetchApi"
import { useCookies } from "react-cookie"
import Loadingcomponent from "../Loading/Loading"
import { Link, useNavigate } from "react-router-dom"
import './admin-vendor.css';
import { Button } from "@mui/material"

interface LoadInterfaceContract {
    _id: string,
    name: string,
    products?: string[] // Make products optional
}

export const CategoryList = () => {
    const [allCategory, setAllCategory] = useState<LoadInterfaceContract[]>()
    const fetchDataFromApi = useFetchApi()
    const [cookies] = useCookies(['token']);
    const token = cookies['token'];
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate();

    const LoadAllCategory = async () => {
        setLoading(true);
        const result = await fetchDataFromApi({
            url: "http://localhost:8000/category/get",
            method: 'get',
            token: token
        })

        if (result.error) {
            setError(result.error)
        } else {
            setAllCategory(result.response);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
        } else {
            LoadAllCategory()
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
                        <h5 className='fs-4'>All Category</h5>
                        <hr />
                        {
                            allCategory?.map((single) => (
                                <div key={single._id} className="admin-all-vendor">
                                    <div>
                                        <h6 className="pra">Name : <span>{single.name}</span></h6>
                                        <p className="pra">Total products : <span>{single.products ? single.products.length : 0}</span></p>
                                    </div>
                                    <div>
                                        <Link to={`/admin/update-category/${single._id}`}>
                                        <Button variant="outlined" size="small">Update</Button>
                                        </Link>
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

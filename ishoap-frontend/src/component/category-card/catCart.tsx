import { useEffect, useState } from "react"
import { useFetchApi } from "../../Custom-Hooks/useFetchApi"
import { useCookies } from "react-cookie"
import { CategoryData } from '../../contract/categorydataContract'
import { toast } from "react-toastify"
import { Link, useNavigate, NavLink } from "react-router-dom"
import './catcart.css'


export function CatCard({ id }: { id: string }) {
    const fetchDataFromApi = useFetchApi()
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token']
    const navigate = useNavigate();
    const [categoryData, setCategorydata] = useState<CategoryData>();

    const loadCategoryData = async () => {
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/category/get-category-products/${id}`,
            method: 'GET',
            token: token
        })

        if (result.error) {
            toast.error(result.error)
        } else {
            setCategorydata(result.response);
        }
    }
    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
        loadCategoryData();
    }, [token])


  console.log("category data ",categoryData);

    return (
        <>
            <h4 className="cat-name">{categoryData?.name}</h4>
            <div className="cat-card-container">
                {
                    categoryData?.products.map((product) => (
                        <>

                            <div className="card1" key={product._id}>
                                <Link to={`/product/${product._id}`} className="cat-link">
                                    <div className="card-image1">
                                        <img src={`http://localhost:8000/images/${product.image[0]}`} />
                                    </div>
                                    <div className="card-para1">{product.name}</div>
                                </Link>
                            </div>

                        </>
                    ))

                }
            </div>
        </>
    )
}
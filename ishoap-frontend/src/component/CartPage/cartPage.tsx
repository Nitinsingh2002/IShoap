import { useEffect, useState } from "react";
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { CartDetails } from '../../contract/cartContract';
import './cartpage.css'
import { Button } from "@mui/material";

export const CartPage = () => {
    const fetchDataFromApi = useFetchApi();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [cartData, setCartData] = useState<CartDetails[]>([]);
    const token = cookies['token'];
    const [finalPrice, setFinalPrice] = useState<number>();
    const [qunatity, setQunatity] = useState<number>(0)
    const [showQuantityButton, setShowQuantityButton] = useState<number | null>(null);
    const [cartUpdated, setCartUpdated] = useState<boolean>(false);


    const loadCartData = async () => {
        console.log("api called");
        const result = await fetchDataFromApi({
            url: "http://localhost:8000/cart/get",
            token: token,
            method: 'GET'
        });

        if (result.error) {
            toast.error("Something went wrong in fetching cart list", {
                autoClose: 1000
            });
        } else {
            setCartData(result.response);
            calculateFinalPrice();
        }

    };

    const calculateFinalPrice = () => {
        let sum = 0;
        for (const product of cartData) {
            sum = sum + product.totalPrice
        }
        setFinalPrice(sum);
    }

    const cartUpdate = async (id: string) => {
    
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/cart/update/${id}`,
            method: 'PUT',
            token: token,
            data: { quantity: qunatity }
        })

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Cart updated sucessfully");
            setCartUpdated(true);
        }
    }

    const handleUpdate = (qty: number, index: number) => {
        setQunatity(qty)
        setShowQuantityButton(index);
    }

    const handleplusClick = (index: number) => {
        if (qunatity < 5) {
            setQunatity(qunatity + 1);
        }
    }

    const handleminusclick = (index: number) => {
        if (1 < qunatity) {
            setQunatity(qunatity - 1);
        }
    }

    const handlesave = (id: string) => {
        cartUpdate(id);
        setShowQuantityButton(null)
    }






    useEffect(() => {
        loadCartData();
    }, [finalPrice,cartUpdated]);



    return (
        <div className="table-container">
            <ToastContainer />

            <table className="table-cart">
                <thead className="cart-table-head">
                    <tr style={{ borderBottom: '1px solid gray' }} className="mb-2">
                        <th className="cart-table-head">Preview</th>
                        <th className="cart-table-head">Product name</th>
                        <th className="cart-table-head">Price</th>
                        <th className="cart-table-head">Quantity</th>
                        <th className="cart-table-head">Total Price</th>
                        <th className="cart-table-head">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cartData.map((item, index) => (
                        <tr key={index}>
                            <td className="cart-table-data cart-table-image"> <img src={`http://localhost:8000/images/${item.productId.image[0]}`} /></td>
                            <td className="cart-table-data">{item.productId.name}</td>
                            <td className="cart-table-data">{item.productId.price}</td>
                            <td className="cart-table-data" >
                                {showQuantityButton === index ? (
                                    <>
                                        <button onClick={() => handleplusClick(index)} className="bi bi-plus-circle-fill plusButton">  </button>
                                        {qunatity}
                                        <button onClick={() => handleminusclick(index)} className="plusButton bi bi-dash-circle-fill">  </button>

                                    </>
                                ) : (
                                    <>{item.quantity}</>
                                )}
                            </td>
                            <td className="cart-table-data">{item.totalPrice}</td>
                            <td className="cart-table-data">

                                {
                                    showQuantityButton === index ?
                                        (<Button variant="contained" size='small' className="me-2 " onClick={() => handlesave(item._id)}> Save</Button>)
                                        :
                                        (<Button variant="outlined" size="small" className="me-2 " onClick={() => handleUpdate(item.quantity, index)}>Update</Button>)
                                }


                                <Button variant="outlined" size="small" color="error">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>


                <tfoot>
                    <tr >
                        <td className="table-fotter-  text-end fw-bold" colSpan={5}>Total ammount: {finalPrice?.toLocaleString('en-In', { style: 'currency', currency: 'INR' })}</td>
                        <td className="text-end table-fotter-">
                            <Button className="btn btn-primary me-5 " variant="contained">Buy now</Button>
                        </td>
                    </tr>
                </tfoot>

            </table>
        </div>
    );
};

import axios from 'axios';

import './main2.css'
import { useState, useEffect } from 'react'
import { IProduct } from '../../contract/productContract';
import { Link } from 'react-router-dom';

export function Main2() {
    const [product, setProduct] = useState<IProduct[]>([{
        _id: '',
        name: '',
        description: '',
        price: 0,
        stock: 0,
        rating: { rate: 0, count: 0 },
        image: [],
        vendorId: '',
        categoryId: {
            name: ''
        }
    }]);



    function LoadProduct(): void {
        axios.get('http://localhost:8000/product/get-allproducts').
            then((res) => setProduct(res.data))
    }


    useEffect(() => {
        LoadProduct()
    }, [])

    console.log(product);
    return (
        <div className="mainPart2">
            <div className='main2-paragraph'>
                <p className='main2p1'>CHECK NOW!</p>
                <p className='main2p2'>Our Feature Services</p>
            </div>


            <div className='animation'>
                {
                    product.slice(0, 3).map((item, index) => (
                        <div className='product-container' key={index}>
                            <Link to={`/product/${item._id}`}  style={{textDecoration:'none' , color:'inherit'}}>
                                <div className='product-image'>
                                    <img src={`http://localhost:8000/images/${item.image[3]}`} alt={item.name} />
                                </div>

                                <div className='product-details'>
                                    <span>{item.name}</span>
                                    <span className='price'>{item.price}</span>
                                </div>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
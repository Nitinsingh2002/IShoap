
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { Carosuel } from '../carousel/carousel';
import { CatCard } from '../category-card/catCart';
import './product.css'

export function Product() {

    const [cookies] = useCookies(['token']);
    const token = cookies['token']


    return (
        <>
            <ToastContainer />

            <div className='carousel'>
                <Carosuel />
            </div>

            <div className='smartphone-category'>
                <CatCard id={"661633a7d29d284665496eba"} />
            </div>

            <div className='mensfashion-category smartphone-category'>
                <CatCard id={"662d318a9d3f66a8218f3cf4"} />
            </div>
            <div className='womenfashion-category smartphone-category'>
                <CatCard id={"662d319c9d3f66a8218f3cf7"} />
            </div>
            <div className='electronics-category smartphone-category'>
                <CatCard id={"661633ebd29d284665496ec3"} />
            </div>
            <div className='sport-category smartphone-category'>
                <CatCard id={"661633e0d29d284665496ec0"} />
            </div>
        </>
    )
}
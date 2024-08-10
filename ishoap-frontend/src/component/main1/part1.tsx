
import './part1.css'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';


export function MainPartOne() {
    return (
        <div className="parent-part1">
            <div className="writing-div">
                <p className='welcome'>WECOME TO</p>
                <p className='name'>Ishoap</p>
                <p className='web-description'>Ishop offers a seamless shopping experience
                    with a diverse range of products. From fashion to electronics and everyday
                    items, find what you need easily. Join us
                    for convenient and satisfying shopping today and let us be your one-stop destination
                    for all your shopping needs.
                </p>
              <Link to={"/product"}> <Button variant="contained" size="medium">SHOAP NOW</Button></Link>
            </div>


            <div className="image-div">
                <div >
                    <div className='image-bg'></div>
                </div>

                <div className='part1Image'>
                    <img src="/images/hero.jpg" alt="familyimage" />
                </div>
            </div>
        </div>
    )
}
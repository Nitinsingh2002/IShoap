import { useNavigate } from 'react-router-dom';
import './navbar.css';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from '../../contract/DecodedTokenContract'
import { Link } from 'react-router-dom';


export function Navbar() {

    let navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token']
    const [decodedToken, setDecodedToken] = useState<DecodedToken>()


    const [menu, setMenu] = useState<boolean>(false);
    function handleClick(): void {
        setMenu(!menu)
    }

    const handleLogout = (): void => {
        removeCookie('token');
    }

    useEffect(() => {

        if (!token) {
            navigate("/login")
        } else {

            const decode: any = jwtDecode(token);
            setDecodedToken(decode);
        }
    }, [token])

    return (
        <>
            <nav>
                <div className='Brand'>
                    <h2>Ishoap</h2>
                </div>

                <div className={menu ? 'navbar-details showMenu' : 'navbar-details'}>
                    <div className='detail' ><i className="bi bi-house-door-fill"></i>Home</div>
                    <Link to="/user-info" className='user-info-nav'>
                        <div className='detail ' ><i className="bi bi-person-circle"></i>
                            {decodedToken ? decodedToken.name.firstName : "User"}
                        </div>
                    </Link>
                    <div className='detail'><i className="bi bi-speaker-fill"></i>Products</div>
                    <div className='detail'><i className="bi bi-basket-fill"></i>cart</div>
                    <div className='detail' onClick={handleLogout}><i className="bi bi-box-arrow-in-right"></i>Logout</div>
                </div>

                <div className='lastnavdiv' onClick={handleClick}>
                    {
                        menu ?
                            (<div className='icons'><i className="bi bi-x-circle-fill"></i></div>)
                            :
                            (<div className='icons'><i className="bi bi-list"></i></div>)
                    }
                </div>
            </nav>
        </>
    )
}




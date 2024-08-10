import { useNavigate } from 'react-router-dom';
import './navbar.css';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from '../../contract/DecodedTokenContract'
import { Link } from 'react-router-dom';


export function Navbar() {

    let navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token','role']);
    const token = cookies['token']
    


    const [decodedToken, setDecodedToken] = useState<DecodedToken>()


    const [menu, setMenu] = useState<boolean>(false);

    function handleClick(): void {
        setMenu(!menu)
    }

    const handleOffMenu =()=>{
        setMenu(false);
      }

    const handleLogout = (): void => {
        removeCookie('token');
        removeCookie('role')
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
                    <h2><Link style={{ textDecoration: "none" }} to={"/"}>Ishoap</Link></h2>
                </div>

                <div className={menu ? 'navbar-details showMenu' : 'navbar-details'}>
                    <Link to="/" className='user-info-nav' onClick={handleOffMenu}>
                        <div className='detail' ><i className="bi bi-house-door-fill" ></i>Home</div>
                    </Link>
                    <Link to="/user-info" className='user-info-nav' onClick={handleOffMenu}>
                        <div className='detail ' ><i className="bi bi-person-circle"></i>
                            {decodedToken ? decodedToken.name.firstName : "User"}
                        </div>
                    </Link>
                    <Link to="/product" className='user-info-nav' onClick={handleOffMenu}>
                        <div className='detail'><i className="bi bi-speaker-fill" ></i>Products</div>
                    </Link>
                    <Link to='/cart' className='user-info-nav' onClick={handleOffMenu}>
                        <div className='detail'><i className="bi bi-basket-fill"></i>cart</div>
                    </Link>
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




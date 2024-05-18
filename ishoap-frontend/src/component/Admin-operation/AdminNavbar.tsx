

import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { AdminDetails } from '../../contract/AdminDetailcontract';
import { jwtDecode } from 'jwt-decode';



export function AdminNavbar() {

    let navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token']
    const [decodedToken, setDecodedToken] = useState<AdminDetails>()

    const [menu, setMenu] = useState<boolean>(false);
    function handleClick(): void {
        setMenu(!menu)
    }

    const handleLogout = (): void => {
        removeCookie('token');
        navigate('/admin-login');
    }



    useEffect(() => {

        if (!token) {
            navigate("/admin-login")
        } else {
            const decode: any = jwtDecode(token);
            setDecodedToken(decode);
        }
    }, [token])

    return (
        <>

            <nav>
                <div className='Brand'>
                    <h2><Link style={{ textDecoration: "none" }} to={"/admin"}>Ishoap</Link></h2>
                </div>

                <div className={menu ? 'navbar-details showMenu' : 'navbar-details'}>
                    <Link to="/admin" className='user-info-nav'>
                        <div className='detail' ><i className="bi bi-house-door-fill"></i>Home</div>
                    </Link>
                    <Link to="/admin" className='user-info-nav'>
                        <div className='detail ' ><i className="bi bi-person-circle"></i>
                            {decodedToken ? decodedToken.name : "User"}
                        </div>
                    </Link>
                    <Link to="/admin" className='user-info-nav'>
                        <div className='detail'><i className="bi bi-speaker-fill"></i> Add Product</div>
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
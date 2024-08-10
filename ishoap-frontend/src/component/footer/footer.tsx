
import './fotter.css'
import { Link } from 'react-router-dom'

export function Footer() {
    return (
        <div className="footer-parent">
            <div className='div1'>
                <p>Nitin kumar singh</p>
                <p className='xp'>hello welcome to Ishoap</p>
                <p className='xp'>shoap your favourite products...</p>
            </div>
            <div className='div2'>
                <p>Follow us</p>
                <div className='footer-icons'>
                    <a className='a' href="https://github.com/Nitinsingh2002" target="_blank" rel="noopener noreferrer">     <div><i className="bi bi-github"></i></div> </a>
                    <a className='a' href="https://www.linkedin.com/in/nitin-kumar-singh-4883a7202/" target="_blank" rel="noopener noreferrer">   <div><i className="bi bi-linkedin"></i></div> </a>
                    <a className='a' href="https://twitter.com/NitinKu98875352" target="_blank" rel="noopener noreferrer">  <div><i className="bi bi-twitter-x"></i></div></a>

                </div>
            </div>
            <div className='div3'>
                <p>call us</p>
                <p>+91 7462070700</p>
            </div>
        </div>

    )
}
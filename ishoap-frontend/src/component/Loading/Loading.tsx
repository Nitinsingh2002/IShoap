import Spinner from 'react-bootstrap/Spinner';
import './Loading.css'



function Loadingcomponent() {
    return <Spinner animation="grow" variant="info" className='loadingsize' />;
}

export default Loadingcomponent;
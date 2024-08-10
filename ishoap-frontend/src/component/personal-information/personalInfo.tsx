import { UserDetails } from '../../contract/userDetailsContract'
import './personalIngo.css'




export function PersonalInfo({ userData }: { userData: UserDetails }) {

    return (
        <div>
            <h5>Personal information</h5>
            <div className="name-info">
                <input type="text" name="firstName" value={userData.name.firstName} className='me-4 input'  readOnly />
                <input type="text" name="lastName" value={userData.name.lastName} className='input'  readOnly/>
            </div>

            <div className='personal-email'>
                <h6>Email Address</h6>
                <input type="text" name="email" value={userData.email} className='input' readOnly />
            </div>

            <div className='personal-email'>
                <h6>Mobile Number</h6>
                <input type="text" name="mobile" value={userData.mobile} className='input' readOnly />
            </div>

            <div className='personal-email'>
                <h6>Gender</h6>
                <input type="text" name="gender" value={userData.gender} className='input' readOnly />
            </div>
        </div>
    )
}


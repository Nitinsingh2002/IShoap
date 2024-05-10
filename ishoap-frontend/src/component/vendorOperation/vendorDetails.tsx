import { useEffect, useState } from "react"
import { useFetchApi } from "../../Custom-Hooks/useFetchApi"
import { useCookies } from "react-cookie";
import { VendorDetails as vendorContract } from '../../contract/vendorDetailsContract';
import { toast } from "react-toastify";


export function VendorDetails() {
    const fetchDataFromApi = useFetchApi();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];
    const [vendorData, setVenorData] = useState<vendorContract>();

    const LoadVendorDetails = async () => {
        const result = await fetchDataFromApi({
            url: 'http://localhost:8000/vendor/get-vendor-details',
            method: 'GET',
            token: token
        })


        if (result.error) {
            toast.error(result.error, {
                autoClose: 1000
            })
        } else {
            setVenorData(result.response);
        }
    }

    useEffect(() => {
        LoadVendorDetails();
    }, [token])

    console.log(vendorData)

    return (
        <>
            <div>
                <h5  className="fs-4">Vendor information</h5>
                <hr />

                <div className="personal-email">
                    <h6>Name</h6>
                    <input type="text" value={vendorData?.name} className=' input' readOnly />
                </div>

                <div className='personal-email'>
                    <h6>Email Address</h6>
                    <input type="text" name="email" value={vendorData?.email} className='input' readOnly />
                </div>

                <div className='personal-email'>
                    <h6>Mobile Number</h6>
                    <input type="text" name="mobile" value={vendorData?.mobile} className='input' readOnly />
                </div>
            </div>
        </>
    )
}
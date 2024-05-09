import { Link } from 'react-router-dom';

export function VendorSidebar() {
    return (
        <>
            <div className="sidebar">
                <ul>
                    <li><Link to="/vendor/update-details">Update Vendor Details</Link></li>
                    <li><Link to="/vendor/add-product">Add Product</Link></li>
                    <li><Link to="/vendor/details">Vendor Details</Link></li>
                </ul>
            </div>
        </>
    )
}
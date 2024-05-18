import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";


export function AdminDashboard() {
    return (
        <>
            <div className='voarent'>
                <div className='vendor-full-page'>

                    <div className='side-bar'>
                        <AdminSidebar />
                    </div>


                    <div className='vendor-content'>
                        <Outlet />
                    </div>

                </div>
            </div>
        </>
    )
}
import { Outlet } from 'react-router-dom';
import { VendorSidebar } from './VendorSideBar';
import './vendor.css';
import { useState } from 'react';





export function VendorOpertion() {


    return (
        <>
            <div className='voarent'>
                <div className='vendor-full-page'>

                    <div className='side-bar'>
                        <VendorSidebar />
                    </div>


                    <div className='vendor-content'>
                        <Outlet />
                    </div>

                </div>
            </div>
        </>
    )
}

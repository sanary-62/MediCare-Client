import React from 'react';
import logo from '../../../assets/Logo.png'

const MediCareLogo = () => {
    return (
        <div className='flex gap-1'>
            <img src={logo} alt="Logo" className='h-12 w-12' />
            <p className='text-green-800 font-semibold mt-5 text-lg'>MediCare</p>
        </div>
    );
};

export default MediCareLogo;
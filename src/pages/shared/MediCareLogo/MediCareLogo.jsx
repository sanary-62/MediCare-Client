import React from 'react';
import logo from '../../../assets/Logo.png'

const MediCareLogo = () => {
    return (
        <div className='flex'>
            <img src={logo} alt="Logo" className='h-16 w-16' />
            <p className='text-sky-600 font-semibold mt-5 text-lg'>MediCare</p>
        </div>
    );
};

export default MediCareLogo;
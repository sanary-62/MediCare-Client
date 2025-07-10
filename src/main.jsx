import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router";
import { router } from './router/router';
import AuthProvider from './contexts/AuthContext/AuthProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='max-w-11/12 mx-auto'>
       <AuthProvider>
        <RouterProvider router={router} />
       </AuthProvider>
    </div>
  </StrictMode>,
)

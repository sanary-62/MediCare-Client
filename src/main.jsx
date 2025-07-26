

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router";
import { router } from './router/router';
import AuthProvider from './contexts/AuthContext/AuthProvider';

// ✅ Import React Query Client
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ Wrap your app in QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <div className='max-w-11/12 mx-auto'>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </div>
    </QueryClientProvider>
  </StrictMode>,
)

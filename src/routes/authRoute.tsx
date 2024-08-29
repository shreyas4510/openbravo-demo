import { Navigate } from 'react-router-dom';
import Navbar from '../component/navbar';
import Sidebar from '../component/sidebar';

function AuthRoutes() {
    const token = localStorage.getItem('token');
    return token ? (
        <>
            <Navbar />
            <Sidebar />
        </>
    ) : (
        <Navigate to="/" replace />
    );
}

export default AuthRoutes;

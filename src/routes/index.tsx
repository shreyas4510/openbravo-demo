import { Routes as Switch, Route, BrowserRouter, Navigate } from 'react-router-dom';
import AuthRoutes from './authRoute';
import PublicRoutes from './publicRoute';
import Warehouse from '../pages/warehourse';
import Login from '../pages/login';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" element={<PublicRoutes />}>
                    <Route path="" element={<Login />} />
                </Route>
                <Route path="/" element={<AuthRoutes />}>
                    <Route path="warehouse" element={<Warehouse />} />
                </Route>
                <Route path="/404" element={<>Not Found</>} />
                <Route path="*" element={<Navigate to="/404" />} />
            </Switch>
        </BrowserRouter>
    );
}

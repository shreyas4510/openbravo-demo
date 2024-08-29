import { Nav } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

export default function () {
    return (
        <>
            <div
                id="sidebar-collapse"
                className={`d-none d-md-block sidebar-view`}
            >
                <Nav defaultActiveKey="/home" className="flex-column">
                    <Nav.Link className="sidebar-item text-white text-center">Warehouse</Nav.Link>
                </Nav>
            </div>
            <div className='d-flex flex-column h-100 main-component pb-5' style={{ overflow: 'scroll' }}>
                <Outlet />
            </div>
        </>
    );
};
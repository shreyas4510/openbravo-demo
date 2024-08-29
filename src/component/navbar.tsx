import { Navbar, Nav } from 'react-bootstrap';
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

export default function() {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <Navbar
            className="navbar-view px-5 text-white d-flex"
            expand="lg"
            fixed="top"
        >
            <Navbar.Brand className="text-white">OpenBravo</Navbar.Brand>
            <Navbar.Toggle className="bg-white" aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto mt-3 mt-md-0">
                    <Nav.Link
                        className="d-none d-md-block text-white"
                        onClick={handleLogout}
                    >
                        <FiLogOut size={25} color="white" />
                    </Nav.Link>
                    <Nav.Link className="d-block d-md-none text-white px-3 py-2 navbar-item">Warehouse</Nav.Link>
                    <Nav.Link
                        className="d-block d-md-none text-white px-3 py-2 navbar-item"
                        onClick={handleLogout}
                    >Logout</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar >
    );
};

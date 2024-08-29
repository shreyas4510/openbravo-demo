import { Button, Card, CardBody, Form } from 'react-bootstrap';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from "../assets/images/logo.png";
import "../assets/styles/auth.css";

interface FormValues {
    username: string;
    password: string;
}

export default function Login() {
    const [formValues, setFormValues] = useState<FormValues>({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const username = process.env.REACT_APP_USERNAME;
        const password = process.env.REACT_APP_PASSWORD;
        if (
            formValues.username === username &&
            formValues.password === password
        ) {
            localStorage.setItem('token', process.env.REACT_APP_TOKEN as string);
            navigate('/warehouse');
        } else {
            toast.error('Invalid credentials! Please try again.')
        }
    };

    return (
        <div className='d-flex h-100 main-container'>
            <Card className='login-form mx-4 mx-md-auto my-auto shadow border-0'>
                <CardBody className='d-flex flex-column'>
                    <img src={Logo} className='mx-auto my-5' height={80} />
                    <Form onSubmit={handleSubmit} className='d-flex flex-column'>
                        <Form.Group controlId="formBasicUsername" className='my-2'>
                            <Form.Label className='fw-bold'>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                value={formValues.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className='my-2'>
                            <Form.Label className='fw-bold'>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={formValues.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            className='mx-auto my-4 custom-button shadow border-0 px-4 py-2'
                        >
                            Login
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}
import { ToastContainer } from 'react-toastify';
import './App.css';
import Routes from './routes';

export default function () {
  return (
    <>
      <Routes />
      <ToastContainer />
    </>
  )
}

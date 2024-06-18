import React from 'react';
import { useRouteError } from 'react-router-dom';
import './ErrorPage.css'; // Importing custom CSS for additional styling
import { MdOutlineErrorOutline } from "react-icons/md";


function ErrorPage() {
  let routingError = useRouteError();
  console.log(routingError);

  return (
    <div className="error-container d-flex align-items-center justify-content-center vh-100 bg-dark text-light">
      <div className="text-center p-5 shadow-lg rounded bg-light">
      <MdOutlineErrorOutline  className='text-danger fs-1'/>
        <h1 className="display-4 text-danger">{routingError.status}</h1>
        <p className="text-danger">{routingError.data}</p>
      </div>
    </div>
  );
}

export default ErrorPage;
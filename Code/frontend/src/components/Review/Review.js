import React , {useState,useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Review.css';
import { useSelector } from 'react-redux';


function Review() {
    const { currentUser } = useSelector(state => state.facultyAdminLoginReducer);
    const { state } = useLocation();

  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCertificate = async () => {
    setIsDownloading(true);
    try {
      const filename = 'rev-'+state.revId+'.jpeg'; // Assuming a certificate filename property exists
      const response = await axios.get(`http://localhost:4000/file-api/get-certificate/${filename}`, {
        responseType: 'blob', // Specify blob for image download
      });

      const blob = new Blob([response.data], { type: 'image/jpeg' }); // Set correct MIME type
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.click();

      window.URL.revokeObjectURL(url); // Clean up temporary URL
    } catch (error) {
    alert('no certificate found')
      console.error('Error downloading certificate:', error);
      // Handle download errors gracefully, e.g., display an error message to the user
    } finally {
      setIsDownloading(false);
    }
  };

    return (
        <div>
            <div className='w-50 m-5 p-3 mx-auto shadow rounded-3 rev-dash'>
                <h4 className='rounded-3 text-center p-2 title-review'>{state.title}</h4>
                <p> <b>Roles</b> :</p>
                <ul>{state.roles.map((role)=>(
                    <li>{role}</li>
                ))}</ul>
                <p><b>Start date</b> : {state.startDate}</p>
                <p><b>End date</b> : {state.endDate}</p>
                <p><b>Organized by</b> : {state.organizedBy}</p>
                <button className="btn btn-primary" disabled={isDownloading} onClick={downloadCertificate}>
              {isDownloading ? 'Downloading...' : 'Download Certificate'}
            </button>
            </div>
        </div>
    )
}

export default Review
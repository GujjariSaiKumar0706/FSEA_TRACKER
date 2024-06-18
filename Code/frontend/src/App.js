import './App.css';
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import RootLayout from './components/RootLayout/RootLayout';
import AllFaculty from './components/AllFaculty/AllFaculty';
import AllReviewfac from './components/AllReviewfac/AllReviewfac';
import AllSDPfac from './components/AllSDPfac/AllSDPfac';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import Register from './components/Register/Register';
import Review from './components/Review/Review';
import SDP from './components/SDP/SDP';
import TableReview from './components/TableReview/TableReview';
import TableSDP from './components/TableSDP/TableSDP';
import UploadRev from './components/UploadRev/UploadRev';
import UploadSDP from './components/UploadSDP/UploadSDP';
import ManagePassword from './components/ManagePassword/ManagePassword';
import ErrorPage from './components/ErrorPage/ErrorPage';
function App() {
  let router = createBrowserRouter([
    {
      path:'',
      element:<RootLayout/>,
      errorElement:<ErrorPage/>,
      children:[
          // {
          // path:'',
          // element:<RootLayout/>//after login is done remove home, if user is already  logged in goto Dashboard/view all faculty or else goto login
          // },
          {
            path:'login',
            element:<Login/>
          },
          {
            path:'new-user',
            element:<Register/>
          },
          {
            path:'faculty',
            children:[
              {
                path:'',
                element:<Dashboard/>
              },
              {
                path:'profile',
                element:<Profile/> //mainly for change password (something like setting)
              },
              {
                path:'profile/manage-password',
                element:<ManagePassword/>
              },
              {
                path: 'upload-new-sdp',
                element:<UploadSDP/>
              },
              {
                path:'upload-new-review',
                element:<UploadRev/>
              },
              {
                path: 'view-all-sdp',
                element:<AllSDPfac/>
              },
              {
                path:'view-all-review',
                element:<AllReviewfac/>
              },
              {
                path: 'view-sdp/:sdpId',
                element:<SDP/>
              },
              {
                path:'view-review/:reviewId',
                element:<Review/>
              }
            ]
          },
          {
            path:'/admin', // directly send to view all faculty while writing the login part
            children:[
                {
                  path:'all-faculty',
                  element:<AllFaculty/>
                },
                {
                  path:'profile',
                  element:<Profile/> //mainly for change password (something like setting)
                },
                {
                  path:'profile/manage-password',
                  element:<ManagePassword/>
                },
                {
                  path:'view-all-sdp',
                  element:<TableSDP/>
                },
                {
                  path:'view-all-review',
                  element:<TableReview/>
                },
                {
                  path:'view-faculty-sdp/:facultyId',
                  element:<AllSDPfac/>
                },
                {
                  path:'view-faculty-review/:facultyId',
                  element:<AllReviewfac/>
                },
                {
                  path:'view-faculty-sdp/:facultyId/:sdpId',
                  element:<SDP/>
                },
                {
                  path:'view-faculty-review/:facultyId/:reviewId',
                  element:<Review/>
                }

            ]
          }
      ]
    }
]);
  return (
    <div>
        <RouterProvider router={router}/>
    </div>
  );
}

export default App;

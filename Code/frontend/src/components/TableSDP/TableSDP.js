import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';
import { FaArrowUp, FaArrowDown, FaCircle, FaDownload, FaFilter ,FaTimes} from 'react-icons/fa';
import './TableSDP.css';

function TableSDP() {
  const token = localStorage.getItem('token');
  const axiosWithToken = axios.create({
    headers:{Authorization:`Bearer ${token}`}
})
  const [allSDP, setAllSDP] = useState([]);
  const [facultyData, setFacultyData] = useState({});
  const [errFetch, setErrF] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({
    sno: true,
    title: true,
    topic: true,
    startDate: true,
    endDate: true,
    organizedBy: true,
    facultyName: true,
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [showFilters, setShowFilters] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  useEffect(() => {
    getAllSDP();
    getFacultyData();
  }, []);

  async function getAllSDP() {
    try {
      let res = await axiosWithToken.get('http://localhost:4000/admin-api/get-sdp-records');
      if (res.data.message === 'Records Found') {
        setAllSDP(res.data.payload);
        setErrF('');
      } else {
        setErrF(res.data.message);
      }
    } catch (error) {
      setErrF('Error fetching data');
    }
  }

  async function getFacultyData() {
    try {
      let res = await axiosWithToken.get('http://localhost:4000/admin-api/get-all-faculty-records');
      if (res.data.message === 'all faculty data found') {
        const facultyMap = res.data.payload.reduce((map, faculty) => {
          map[faculty.facultyId] = faculty.username;
          return map;
        }, {});
        setFacultyData(facultyMap);
      } else {
        setErrF(res.data.message);
      }
    } catch (error) {
      setErrF('Error fetching faculty data');
    }
  }

  const handleColumnChange = (event) => {
    const { name, checked } = event.target;
    setSelectedColumns((prevColumns) => ({
      ...prevColumns,
      [name]: checked,
    }));
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = null;
      }
    }
    setSortConfig({ key, direction });
  };

  const handleFilterDateChange = (event) => {
    const { name, value } = event.target;
    if (name === 'filterStartDate') {
      setFilterStartDate(value);
    } else if (name === 'filterEndDate') {
      setFilterEndDate(value);
    }
  };


  const filteredSDP = React.useMemo(() => {
    return allSDP.filter((sdp) => {
      const sdpStartDate = new Date(sdp.startDate);
      const sdpEndDate = new Date(sdp.endDate);
      const filterStart = filterStartDate ? new Date(filterStartDate) : null;
      const filterEnd = filterEndDate ? new Date(filterEndDate) : null;

      return (!filterStart || sdpStartDate >= filterStart) && (!filterEnd || sdpEndDate <= filterEnd);
    });
  }, [allSDP, filterStartDate, filterEndDate]);

  const sortedSDP = React.useMemo(() => {
    let sortableItems = [...filteredSDP];
    if (sortConfig.key !== null && sortConfig.direction !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredSDP, sortConfig]);

  const sdpWithFacultyNames = sortedSDP.map(sdp => ({
    ...sdp,
    facultyName: facultyData[sdp.facultyId] || 'Unknown',
  }));

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getFullYear()); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  }
  const generateCSV = () => {
    const headers = ['S.No', 'Faculty Name', 'Title', 'Topic', 'Start Date', 'End Date', 'Organized By'];
    const rows = sdpWithFacultyNames.map((sdp, index) => [
      index + 1,
      sdp.facultyName,
      sdp.title,
      sdp.topic,
      sdp.startDate,
      sdp.endDate,
      sdp.organizedBy,
    ]);

    let csvContent = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'sdp_records.csv');
  };

  
  return (
    <div className="container mt-4">
        <div className="m-3 p-3 d-block text-center">
                <h3><strong>Resource Person Data</strong></h3>
            </div>
      <div className="d-flex justify-content-between mb-3">
        <button className="btn filbut" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? <div><FaTimes/><span> </span>Hide Filters</div> : <div><FaFilter/><span> </span>Show Filters</div>}
        </button>
        <button className="btn filbut" onClick={generateCSV}>
          <FaDownload/><span> </span>Download CSV
        </button>
      </div>
      {showFilters && (
        <div className="mb-3 w-60">
          {Object.keys(selectedColumns).map((col) => (
            <div className="form-check form-check-inline" key={col}>
              <input
                className="form-check-input"
                type="checkbox"
                name={col}
                checked={selectedColumns[col]}
                onChange={handleColumnChange}
              />
              <label className="form-check-label">{col}</label>
            </div>
          ))}
          <div className="form-group w-40">
            <label htmlFor="filterStartDate">Start Date:</label>
            <input
              type="date"
              className="form-control w-40 datebar"
              id="filterStartDate"
              name="filterStartDate"
              value={filterStartDate}
              onChange={handleFilterDateChange}
            />
          </div>
          <div className="form-group w-40">
            <label htmlFor="filterEndDate">End Date:</label>
            <input
              type="date"
              className="form-control w-40 datebar"
              id="filterEndDate"
              name="filterEndDate"
              value={filterEndDate}
              onChange={handleFilterDateChange}
            />
          </div>
        </div>
      )}
      {errFetch && <div className="alert alert-danger">{errFetch}</div>}
      <div className="table-responsive text-center">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              {selectedColumns.sno && <th>S.No</th>}
              {selectedColumns.facultyName && (
                <th onClick={() => handleSort('facultyName')}>
                  Faculty Name {sortConfig.key === 'facultyName' && (sortConfig.direction === 'ascending' ? <FaArrowUp/> :sortConfig.direction ==='descending' ? <FaArrowDown/> : <FaArrowUp className="transparent-arrow"/> )}
                  {sortConfig.key !== 'facultyName' && (
                        <FaArrowUp className="transparent-arrow" />
                )}
                </th>
              )}
              {selectedColumns.title && (
                <th onClick={() => handleSort('title')}>
                  Title {sortConfig.key === 'title' && (sortConfig.direction === 'ascending' ? <FaArrowUp/> : sortConfig.direction ==='descending' ? <FaArrowDown/> : <FaArrowUp className="transparent-arrow"/>)}
                  {sortConfig.key !== 'title' && (
                        <FaArrowUp className="transparent-arrow" />
                )}
                </th>
              )}
              {selectedColumns.topic && (
                <th onClick={() => handleSort('topic')}>
                  Topic {sortConfig.key === 'topic' && (sortConfig.direction === 'ascending' ? <FaArrowUp/> : sortConfig.direction ==='descending' ? <FaArrowDown/> : <FaArrowUp className="transparent-arrow"/>)}
                  {sortConfig.key !== 'topic' && (
                        <FaArrowUp className="transparent-arrow" />
                )}
                </th>
              )}
              {selectedColumns.startDate && (
                <th onClick={() => handleSort('startDate')}>
                  Start Date {sortConfig.key === 'startDate' && (sortConfig.direction === 'ascending' ? <FaArrowUp/> :  sortConfig.direction ==='descending' ? <FaArrowDown/> : <FaArrowUp className="transparent-arrow"/> )}
                  {sortConfig.key !== 'startDate' && (
                        <FaArrowUp className="transparent-arrow" />
                )}
                </th>
              )}
              {selectedColumns.endDate && (
                <th onClick={() => handleSort('endDate')}>
                  End Date {sortConfig.key === 'endDate' && (sortConfig.direction === 'ascending' ? <FaArrowUp/> : sortConfig.direction === 'descending' ? <FaArrowDown/> : <FaArrowUp className="transparent-arrow"/>)}
                  {sortConfig.key !== 'endDate' && (
                        <FaArrowUp className="transparent-arrow" />
                )}
                </th>
              )}
              {selectedColumns.organizedBy && (
                <th onClick={() => handleSort('organizedBy')}>
                  Organized By {sortConfig.key === 'organizedBy' && (sortConfig.direction === 'ascending' ? <FaArrowUp/> : sortConfig.direction ==='descending' ? <FaArrowDown/> : <FaArrowUp className="transparent-arrow"/>)}
                  {sortConfig.key !== 'organizedBy' && (
                        <FaArrowUp className="transparent-arrow" />
                )}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sdpWithFacultyNames.map((sdp, index) => (
              <tr key={index}>
                {selectedColumns.sno && <td>{index + 1}</td>}
                {selectedColumns.facultyName && <td>{sdp.facultyName}</td>}
                {selectedColumns.title && <td>{sdp.title}</td>}
                {selectedColumns.topic && <td>{sdp.topic}</td>}
                {selectedColumns.startDate && <td>{formatDate(sdp.startDate)}</td>}
                {selectedColumns.endDate && <td>{formatDate(sdp.endDate)}</td>}
                {selectedColumns.organizedBy && <td>{sdp.organizedBy}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableSDP;

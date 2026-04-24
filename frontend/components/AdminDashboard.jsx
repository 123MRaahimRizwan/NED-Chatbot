// frontend/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [files, setFiles] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);


  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/files");
      console.log("📁 Fetched files:", res.data); // ← Add this
      // console.log(res.last_modified)
      setFiles(res.data);
    } catch (err) {
      console.error("❌ Error fetching files:", err);
      setFiles([]); // Fallback to empty list on error
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!fileToUpload) return;

    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const res = await axios.post("http://localhost:5000/admin/upload", formData);
      alert(res.data.message); // ✅ Optional: Show popup
      setFileToUpload(null);   // Reset input
      fetchFiles();            // Refresh file list
    } catch (err) {
      alert("Upload failed: " + err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (filename) => {
    try {
      const res = await axios.post("http://localhost:5000/admin/delete", { filename });
      alert(res.data.message);
      fetchFiles();
    } catch (error) {
      alert("Deletion failed: " + error.response?.data?.error || error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      localStorage.removeItem("isAdmin");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 px-4 sm:px-6 lg:px-8 pb-12 relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl min-[550px]:text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-[12px] min-[550px]:text-[15px] sm:text-md text-gray-400">Manage your university documents and resources</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] min-[650px]:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 min-[650px]:h-6 min-[650px]:w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>

        {/* {stats && (
          <div className="flex flex-nowrap gap-4 overflow-x-auto pb-4 mb-12 snap-x">
            <div className="group relative bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm border border-gray-700/50 flex-shrink-0 w-64 snap-start">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-gray-100 text-sm font-medium uppercase tracking-wider">Total PDFs</h3>
                </div>
                <p className="text-white text-2xl font-bold">{stats.total_pdfs}</p>
              </div>
            </div>
            <div className="group relative bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm border border-gray-700/50 flex-shrink-0 w-64 snap-start">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-500/10 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-100 text-sm font-medium uppercase tracking-wider">Total Chunks</h3>
                </div>
                <p className="text-white text-2xl font-bold">{stats.total_chunks}</p>
              </div>
            </div>
            <div className="group relative bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm border border-gray-700/50 flex-shrink-0 w-64 snap-start">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-green-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-500/10 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                      <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                      <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-100 text-sm font-medium uppercase tracking-wider">Total Embeddings</h3>
                </div>
                <p className="text-white text-2xl font-bold">{stats.total_embeddings}</p>
              </div>
            </div>
            <div className="group relative bg-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm border border-gray-700/50 flex-shrink-0 w-64 snap-start">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-yellow-500/10 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-gray-100 text-sm font-medium uppercase tracking-wider">Last Ingestion</h3>
                </div>
                <p className="text-white text-2xl font-bold">{stats.last_ingestion_time}</p>
              </div>
            </div>
          </div>
        )} */}

        <div className="w-[350px] bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700/50 min-[450px]:w-[400px] min-[550px]:w-[500px] min-[600px]:w-[550px] min-[650px]:w-[600px] min-[768px]:w-[700px] min-[900px]:w-[850px] min-[1024px]:w-[950px] min-[1120px]:w-[1050px] min-[1280px]:w-[1100px] min-[1400px]:w-[1200px] min-[1500px]:w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 min-[450px]:h-5 min-[450px]:w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl text-white font-bold min-[650px]:text-[25px]">Upload New File</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
            <label className="flex-1">
              <div className="relative group">
                <input
                  type="file"
                  onChange={(e) => setFileToUpload(e.target.files[0])}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gradient-to-r file:from-blue-600 file:to-blue-700
                    file:text-white
                    hover:file:from-blue-700 hover:file:to-blue-800
                    cursor-pointer transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                />
              </div>
            </label>
            <button
              onClick={handleUpload}
              disabled={!fileToUpload}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition duration-150 ease-in-out flex items-center justify-center gap-3 shadow-sm hover:shadow-lg min-w-[120px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Upload
            </button>
          </div>
        </div>

        <div className="w-[350px] bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-700/50 min-[450px]:w-[400px] min-[550px]:w-[500px] min-[600px]:w-[550px] min-[650px]:w-[600px] min-[768px]:w-[700px] min-[900px]:w-[850px] min-[1024px]:w-[950px] min-[1120px]:w-[1050px] min-[1280px]:w-[1100px] min-[1400px]:w-[1200px] min-[1500px]:w-full">
          <div className="px-8 py-6 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/10 p-3 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3  min-[450px]:h-5 min-[450px]:w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <h2 className="text-xl text-white font-bold min-[650px]:text-[25px]">Uploaded Files</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Filename</th>
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Updated</th>
                  <th className="px-8 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {files.map((f, i) => {
                  const date = new Date(f.last_modified);
                  const formattedDateTime = date.toLocaleDateString("en-GB") + " " + date.toLocaleTimeString("en-GB");
                  return (
                    <tr key={i} className="group transition-colors even:bg-gray-800/30 odd:bg-transparent hover:bg-gray-700/50">
                      <td className="px-8 py-5 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-wrap text-gray-300 font-medium min-[550px]:text-[15px]">{f.filename}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-400">{formattedDateTime}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(f.filename)}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

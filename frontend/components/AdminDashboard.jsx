import React, { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, UploadCloud, FileText, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [files, setFiles] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/files");
      setFiles(res.data);
    } catch (err) {
      console.error("❌ Error fetching files:", err);
      setFiles([]);
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
      alert(res.data.message);
      setFileToUpload(null);
      fetchFiles();
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (filename) => {
    try {
      const res = await axios.post("http://localhost:5000/admin/delete", { filename });
      alert(res.data.message);
      fetchFiles();
    } catch (error) {
      alert("Deletion failed: " + (error.response?.data?.error || error.message));
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
    <div className="min-h-screen bg-[#0f0f0f] text-[#e6e6e6] font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/" className="text-[#a3a3a3] hover:text-[#e6e6e6] transition-colors" title="Back to Chat">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
            </div>
            <p className="text-sm text-[#a3a3a3] ml-8">Manage your university documents and knowledge base</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-sm transition-colors text-[#e6e6e6]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Upload Section */}
        <div className="bg-[#171717] border border-[#2a2a2a] rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <UploadCloud className="text-[#d97757]" size={24} />
            <h2 className="text-xl font-medium">Upload Document</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <input
              type="file"
              onChange={(e) => setFileToUpload(e.target.files[0])}
              className="flex-1 block w-full text-sm text-[#a3a3a3]
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-xl file:border-0
                file:text-sm file:font-medium
                file:bg-[#2a2a2a] file:text-[#e6e6e6]
                hover:file:bg-[#3a3a3a]
                cursor-pointer transition-all duration-200
                focus:outline-none"
            />
            <button
              onClick={handleUpload}
              disabled={!fileToUpload}
              className="bg-[#e6e6e6] text-[#0f0f0f] hover:bg-[#ffffff] disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 rounded-xl text-sm font-medium transition-colors sm:w-auto w-full"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Files List */}
        <div className="bg-[#171717] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <FileText className="text-[#d97757]" size={24} />
              <h2 className="text-xl font-medium">Knowledge Base Files</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1f1f1f] text-xs uppercase tracking-wider text-[#a3a3a3]">
                  <th className="px-6 sm:px-8 py-4 font-medium">Filename</th>
                  <th className="px-6 sm:px-8 py-4 font-medium">Last Updated</th>
                  <th className="px-6 sm:px-8 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {files.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-[#666666] text-sm">
                      No files uploaded yet.
                    </td>
                  </tr>
                ) : (
                  files.map((f, i) => {
                    const date = new Date(f.last_modified);
                    const formattedDateTime = date.toLocaleDateString("en-GB") + " " + date.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });
                    
                    return (
                      <tr key={i} className="hover:bg-[#1f1f1f] transition-colors">
                        <td className="px-6 sm:px-8 py-4 whitespace-nowrap text-sm font-medium text-[#e6e6e6]">
                          {f.filename}
                        </td>
                        <td className="px-6 sm:px-8 py-4 whitespace-nowrap text-sm text-[#a3a3a3]">
                          {formattedDateTime}
                        </td>
                        <td className="px-6 sm:px-8 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDelete(f.filename)}
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

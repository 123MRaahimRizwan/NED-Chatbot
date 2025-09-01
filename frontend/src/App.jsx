// import React from 'react'
// import './App.css'
// import ChatForm from '../components/ChatForm'
// import Navbar from '../components/Navbar'
// import Sidebar from '../components/Sidebar'
// import AdminDashboard from '../components/AdminDashboard'

// function App() {

//   return (
//     <>
//       <Navbar />
//       <div className="flex">
//         <Sidebar />
//         <div className="flex-1 ml-0 transition-all duration-300">
//           <ChatForm />
//         </div>
//       </div>
//     </>
//   )
// }

// export default App


// src/App.jsx
// import React from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// import './App.css'
// import ChatForm from '../components/ChatForm'
// import Navbar from '../components/Navbar'
// import Sidebar from '../components/Sidebar'
// import AdminDashboard from '../components/AdminDashboard'



// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <div className="flex">
//         <Sidebar />
//         <div className="flex-1 ml-0 transition-all duration-300">
//           <Routes>
//             <Route path="/" element={<ChatForm />} />
//             <Route path="/admin" element={<AdminDashboard />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   )
// }

// export default App


// import React, { useEffect, useState } from 'react'
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import axios from 'axios'

// import './App.css'
// import ChatForm from '../components/ChatForm'
// import Navbar from '../components/Navbar'
// import Sidebar from '../components/Sidebar'
// import AdminDashboard from '../components/AdminDashboard'
// import Login from '../components/Login'

// function App() {
//   const [authenticated, setAuthenticated] = useState(null)

//   useEffect(() => {
//     axios
//       .get('/check-auth', { withCredentials: true })
//       .then((res) => {
//         setAuthenticated(res.data.authenticated === true || res.data.authenticated === "true")
//       })
//       .catch(() => setAuthenticated(false))
//   }, [])

//   const handleLogin = () => setAuthenticated(true)

//   const ProtectedRoute = ({ children }) => {
//     if (authenticated === null) return <div>Loading...</div>
//     return authenticated ? children : <Navigate to="/login" />
//   }

//   return (
//     <Router>
//       <Navbar />
//       <div className="flex">
//         <Sidebar />
//         <div className="flex-1 ml-0 transition-all duration-300">
//           <Routes>
//             <Route path="/" element={<ChatForm />} />
//             <Route
//               path="/admin"
//               element={
//                 <ProtectedRoute>
//                   <AdminDashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="/login" element={<Login onLogin={handleLogin} />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   )
// }

// export default App


import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

import './App.css'
import ChatForm from '../components/ChatForm'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import AdminDashboard from '../components/AdminDashboard'
import Login from '../components/Login' // create a simple login component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:5000/check-auth', {
        withCredentials: true
      })
      setIsAuthenticated(res.data.authenticated)
    } catch (err) {
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Still checking auth
  if (isAuthenticated === null) {
    return (
      <div className="overflow-hidden min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-0 transition-all duration-300">
          <Routes>
            <Route path="/" element={<ChatForm />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route
              path="/admin"
              element={
                isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App

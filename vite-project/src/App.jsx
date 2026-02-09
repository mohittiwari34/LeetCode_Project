import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Homepage from './pages/homepage';
import Signup from './pages/signin';
import Login from './pages/login';
import { Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { checkauth } from './authslice';
import Profile from './pages/profile';
import { useEffect } from 'react';
import ProblemPage from './pages/problemPage';
import AdminPanel from './pages/adminPanel';
import AdminUpload from './component/AdminUpload';
import AdminVideo from './component/adminVideo';
import AdminDelete from './component/adminDelete';
//import Admin
import Admin from './pages/Admin';
import TopicsPage from './pages/TopicsPage';
import TagProblemsPage from './pages/TagProblemsPage';
import LandingPage from './pages/LandingPage';
import './App.css'


function App() {
  const dispatch = useDispatch();

  const { isauthicated, user, loading } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(checkauth());
  }, [dispatch])
  return (
    <>
      <Routes>
        <Route path="/" element={isauthicated ? <Homepage></Homepage> : <LandingPage />}></Route>
        <Route path="/signup" element={isauthicated ? <Navigate to="/" /> : <Signup></Signup>}></Route>
        <Route path="/login" element={isauthicated ? <Navigate to="/" /> : <Login></Login>}></Route>
        <Route path="/problem/:problemId" element={<ProblemPage></ProblemPage>}></Route>
        <Route path="/admin/create" element={isauthicated && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />}></Route>
        <Route path="/admin/delete" element={isauthicated && user.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />}></Route>
        <Route path="/admin/video" element={isauthicated && user.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />}></Route>
        <Route path="/admin" element={isauthicated ? <Admin></Admin> : <Navigate to="/" />}></Route>
        <Route path="/admin/upload/:problemId" element={isauthicated && user.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />}></Route>
        <Route path="/profile" element={<Profile></Profile>}></Route>
        <Route path="/problems" element={<TopicsPage />}></Route>
        <Route path="/problems/:tag" element={<TagProblemsPage />}></Route>

      </Routes>
    </>
  )
}

export default App

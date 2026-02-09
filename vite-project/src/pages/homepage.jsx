import { useEffect, useState } from "react"
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../Utils/axiosClient";
import { logoutUser } from "../authslice";
import ProfilePhotoUpload from "../component/profilephoto";
import Login from "./googleLogin";
import PremiumButton from "../component/premiumButton";
import { Search, Filter, CheckCircle, Clock, Tag } from "lucide-react";

function Homepage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const ITEMS_PER_PAGE = 10;
    const [currentpage, setCurrentPage] = useState(1);

    //console.log(user);
    const [photo, setPhoto] = useState(null);
    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [filters, setFilters] = useState({
        difficulty: 'all',
        tag: 'all',
        status: 'all'
    });
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const { data } = await axiosClient.get('/problem/getAllProblem');

                setProblems(data);
            }
            catch (error) {
                console.log("Error fetching problems:", error);
            }
        };

        const fetchSolveProblems = async () => {
            try {
                const { data } = await axiosClient.get('/problem/problemSolvedByUser');
                //console.log("Solved problems data:", data);
                setSolvedProblems(data.problemSolved || []);
                setPhoto(data.profilePhoto);
            }
            catch (error) {
                console.log("Error fetching solved problems:", error);
            }
        }
        fetchProblems();
        if (user) {
            fetchSolveProblems();
        }
    }, [user]);

    const handleLogout = () => {
        dispatch(logoutUser());
        setSolvedProblems([]);
    };

    const filteredProblems = problems.filter(problem => {
        const difficultyMatch = filters.difficulty === 'all' ||
            problem.difficulty?.toLowerCase() === filters.difficulty?.toLowerCase();

        const tagMatch = filters.tag === "all" ||
            problem.tags?.toLowerCase() === filters.tag?.toLowerCase();

        const isProblemSolved = solvedProblems.some(sp =>
            sp._id === problem._id ||
            sp.id === problem._id ||
            sp.problemId === problem._id
        );

        const statusMatch = filters.status === 'all' ||
            (filters.status === 'solved' && isProblemSolved) ||
            (filters.status === 'unsolved' && !isProblemSolved);

        return difficultyMatch && tagMatch && statusMatch;
    });

    const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
    const paginatedProblem = filteredProblems.slice(
        (currentpage - 1) * ITEMS_PER_PAGE,
        currentpage * ITEMS_PER_PAGE
    );

    return (
        <div className="min-h-screen bg-base-200 font-sans">
            {/* Navbar */}
            {/* Navbar */}
            <nav className="navbar bg-base-100/80 backdrop-blur-md fixed top-0 left-0 w-full z-50 px-4 md:px-8 border-b border-base-300">
                <div className="flex-1 flex items-center gap-6">
                    <NavLink to="/" className="btn btn-ghost text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:bg-transparent">
                        LeetCode 2.0
                    </NavLink>
                    <div className="hidden md:flex gap-1">
                        <NavLink to="/" className={({ isActive }) => `btn btn-sm btn-ghost ${isActive ? 'bg-base-200' : ''}`}>
                            Home
                        </NavLink>
                        <NavLink to="/problems" className={({ isActive }) => `btn btn-sm btn-ghost ${isActive ? 'bg-base-200' : ''}`}>
                            Problems
                        </NavLink>
                    </div>
                </div>
                <div className="flex-none flex items-center gap-2 md:gap-4 pr-2">
                    <div className="hidden md:block">
                        <PremiumButton />
                    </div>
                    <div className="md:hidden">
                        {/* Mobile simplified premium button if possible or just show icon - but PremiumButton component has text. 
                            I'll just keep it for now as fixing w-full might solve the cut-off. 
                            The cut-off is likely due to missing width. 
                        */}
                        <PremiumButton />
                    </div>

                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring ring-primary ring-offset-base-100 ring-offset-2 hover:scale-105 transition-transform">
                            <div className="w-10 rounded-full">
                                <img src={photo || `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=random`} alt="profile" />
                            </div>
                        </label>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
                            <li className="menu-title px-4 py-2 border-b border-base-200 mb-2 font-bold text-primary">Hi, {user?.firstName}</li>
                            <li><NavLink to="/profile" className="py-3">Profile</NavLink></li>
                            <li><button onClick={() => document.getElementById('upload_photo_modal').showModal()} className="py-3">Change Photo</button></li>
                            {user?.role === 'admin' && <li><NavLink to="/admin" className="py-3">Admin Dashboard</NavLink></li>}
                            <div className="divider my-1"></div>
                            <li><button onClick={handleLogout} className="text-error font-medium py-3">Logout</button></li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-24 pb-12 px-4 bg-gradient-to-br from-base-200 to-base-300">
                <div className="container mx-auto text-center max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                        Master <span className="text-primary">Algorithms</span>
                    </h1>
                    <p className="text-lg opacity-70 mb-8 max-w-2xl mx-auto">
                        Elevate your coding skills with our curated collection of challenges. Track your progress, earn streaks, and prepare for your dream job.
                    </p>

                    {/* Filters Bar */}
                    <div className="flex flex-wrap gap-4 justify-center bg-base-100 p-4 rounded-2xl shadow-lg border border-base-300 max-w-4xl mx-auto">
                        <div className="join">
                            <select
                                className="select select-bordered join-item focus:outline-none"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="all">Status: All</option>
                                <option value="solved">Solved</option>
                                <option value="unsolved">Unsolved</option>
                            </select>

                            <select
                                className="select select-bordered join-item focus:outline-none"
                                value={filters.difficulty}
                                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                            >
                                <option value="all">Difficulty: Any</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>

                            <select
                                className="select select-bordered join-item focus:outline-none"
                                value={filters.tag}
                                onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                            >
                                <option value="all">Tags: All</option>
                                <option value="Array">Array</option>
                                <option value="Linked List">Linked List</option>
                                <option value="Graph">Graph</option>
                                <option value="DP">DP</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto p-4 md:px-8 pb-20">

                <div className="flex justify-between items-center mb-6">
                    <div className="text-sm font-medium opacity-60">
                        Showing {filteredProblems.length} problems
                    </div>
                </div>

                {/* Problem Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProblem.length > 0 ? (
                        paginatedProblem.map(problem => {
                            const isSolved = solvedProblems.some(sp => sp._id === problem._id || sp.id === problem._id || sp.problemId === problem._id);

                            return (
                                <NavLink
                                    to={`/problem/${problem._id}`}
                                    key={problem._id}
                                    className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 border border-base-200 group overflow-hidden"
                                >
                                    <div className="card-body p-6">
                                        <div className="flex justify-between items-start">
                                            <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)} badge-sm mb-2`}>
                                                {problem.difficulty}
                                            </div>
                                            {isSolved && (
                                                <div className="tooltip" data-tip="Solved">
                                                    <CheckCircle size={20} className="text-success" />
                                                </div>
                                            )}
                                        </div>

                                        <h2 className="card-title text-lg group-hover:text-primary transition-colors mb-2">
                                            {problem.title}
                                        </h2>

                                        <div className="flex flex-wrap gap-2 mt-auto pt-4">
                                            <div className="badge badge-ghost gap-1 text-xs">
                                                <Tag size={10} /> {problem.tags}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Hover Progress Bar Effect */}
                                    <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-500"></div>
                                </NavLink>
                            )
                        })
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <div className="mx-auto w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-4">
                                <Search size={40} className="opacity-20" />
                            </div>
                            <h3 className="text-xl font-bold opacity-50">No problems found</h3>
                            <p className="opacity-40">Try adjusting your filters</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredProblems.length > 0 && (
                    <div className="flex justify-center mt-12">
                        <div className="join shadow">
                            <button
                                className="join-item btn"
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                disabled={currentpage === 1}
                            >
                                «
                            </button>
                            <button className="join-item btn no-animation">
                                Page {currentpage} of {totalPages}
                            </button>
                            <button
                                className="join-item btn"
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentpage === totalPages || totalPages === 0}
                            >
                                »
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Upload Photo Modal */}
            <dialog id="upload_photo_modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mb-4">Update Profile Photo</h3>
                    <ProfilePhotoUpload onSuccess={(url) => {
                        setPhoto(url);
                        document.getElementById('upload_photo_modal').close();
                    }} />
                </div>
            </dialog>
        </div>
    )
}

const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
        case 'easy': return 'badge-success badge-outline';
        case 'medium': return 'badge-warning badge-outline';
        case 'hard': return 'badge-error badge-outline';
        default: return 'badge-neutral badge-outline';
    }
}

export default Homepage;
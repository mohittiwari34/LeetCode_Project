import { useEffect,useState } from "react"
import {NavLink} from "react-router";
import { useDispatch,useSelector } from "react-redux";
import axiosClient from "../Utils/axiosClient";
import { logoutUser } from "../authslice";
import ProfilePhotoUpload from "../component/profilephoto";
import Login from "./googleLogin";



function Homepage(){
    const dispatch=useDispatch();
    const {user}=useSelector((state)=>state.auth);
    console.log(user);
    const[photo,setPhoto]=useState(null);
    const[problems,setProblems]=useState([]);
    const[solvedProblems,setSolvedProblems]=useState([]);
    const[filters,setFilters]=useState({
        difficulty:'all',
        tag:'all',
        status:'all'
    });

    useEffect(()=>{
        const fetchProblems=async()=>{
            try{
            const {data}=await axiosClient.get('/problem/getAllProblem');
            
            setProblems(data);
            }
            catch(error){
                console.log("Error fetching problems:",error);
            }
        };

        const fetchSolveProblems=async()=>{
            try{
                const {data}=await axiosClient.get('/problem/problemSolvedByUser');
                console.log(data);
                setSolvedProblems(data.problemSolved);
                setPhoto(data.profilePhoto);
            }
            catch(error){
                console.log("Eroor fetching problems:",error);
            }
        }
        fetchProblems();
        if(user){
            fetchSolveProblems();
        }
    },[user]);
    const handleLogout=()=>{
        dispatch(logoutUser());
        setSolvedProblems([]);
    };
    console.log(photo);
    const filteredProblems=problems.filter(problem=>{
        const difficultyMatch=filters.difficulty==='all'|| problem.difficulty===filters.difficulty;
        const tagMatch=filters.tag=="all" || problem.tags===filters.tag;
        const statusMatch=filters.status==='all'||solvedProblems.some(sp=>sp.id===problem._id);
        return difficultyMatch&&tagMatch&&statusMatch;
    })



    return(
        <div>
            <nav className="navbar bg-base-100 shadow-lg px-4 flex items-center justify-between">
                <div>
                    <NavLink to="/" className="btn btn-ghost text-xl">Leetcode</NavLink>
                </div>
                <div>
                <div className="dropdown dropdown-end">
                
                 <label tabIndex={0} className="cursor-pointer">
                   <img
                     src={photo || "/default-avatar.png"}
                     alt="profile"
                     className="w-9 h-9 rounded-full object-cover ring ring-primary ring-offset-base-100 ring-offset-2"
                   />
                                </label>
               
                 <ul
                   tabIndex={0}
                   className="dropdown-content mt-3 z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                 >
                   <li className="pointer-events-auto">
                     <ProfilePhotoUpload />
                   </li>
                 </ul>
               </div>

                
                <div>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="btn btn-ghost">
                            {user?.firstName}
                        </div>
                        <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li><button onClick={handleLogout}>Logout</button></li>
                            {user.role=='admin' &&<li><NavLink to="/admin">Admin</NavLink></li>}
                        </ul>
                    </div>
                </div>
                </div>
                
            </nav>
            {/* Main Content */}
            <div className="container mx-auto p-4">
                <div className="flex flex-wrap gap-4 mb-6">
                    {/* New status Filter */}
                    <select className="select select-bordered"
                    value={filters.status}
                    onChange={(e)=>setFilters({...filters,status:e.target.value})}

                    
                    >
                        <option value="all">All Problems</option>
                        <option value="solved">Solved problems</option>

                    </select>
                    <select className="select select-bordered"
                    value={filters.difficulty}
                    onChange={(e)=>setFilters({...filters,difficulty:e.target.value})}

                    
                    >
                        <option value="all">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>

                    </select>
                    <select className="select select-bordered"
                    value={filters.tag}
                    onChange={(e)=>setFilters({...filters,tag: e.target.value})}>
                        <option >All Tags</option>
                        <option>Array</option>
                        <option>Linked List</option>
                        <option>Graph</option>
                        <option>DP</option>
                    </select>
                </div>
                {/* problem list */}
                <div>
                    {filteredProblems.map(problem=>(
                        <div key={problem._id}>
                            <div> 
                                <div>
                                    <h2>
                                        <NavLink to={`/problem/${problem._id}`} className="hover:text-primary">{problem.title}</NavLink>
                                    </h2>
                                    {
                                        solvedProblems.some(sp=>sp._id===problem._id)&&(
                                            <div>Solved</div>
                                        )
                                    }
                                </div>
                                <div className="flex gap-2">
                                <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>{problem.difficulty}</div>
                                
                                <div className="badge badge-info">
                                    {problem.tags}
                                </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}
const getDifficultyBadgeColor=(difficulty)=>{
    switch(difficulty.toLowerCase()){
        case 'easy':return 'badge-success';
        case 'medium':return 'badge-warning';
        case 'hard':return 'badge-error';
        default: return 'badge-neutral'


    }
}

export default Homepage
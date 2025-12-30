import {useState,useEffect} from 'react';
import axiosClient from '../Utils/axiosClient';

const SubmissionHistory=({problemId})=>{
    const [submission,setsubmission]=useState([]);
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState(null);
    const[selectedSubmission,setSelectedSubmission]=useState(null);

    useEffect(()=>{
        const fetchSubmissions=async()=>{
            try{
                setLoading(true);
                console.log("submiiision histtory id going on ");
                const response=await axiosClient.get(`/problem/submittedProblem/${problemId}`);
                setsubmission(response.data);
                console.log(response.data);
                console.log("in submission history");
                setError(null);

            }
            catch(err){
                setError("Failed to fetch submission history");
                console.error(err);
            }
            finally{
                setLoading(false);
            }
        }
        fetchSubmissions();
    },[problemId]);
    const getStatusColor=(status)=>{
        switch(status){
            case 'accepted':return 'badge-success';
            case 'wrong':return 'badge-error';
            case 'error':return 'badge-info';
            case 'pending':return 'badge-info';
            default:return 'badge-natural';
        }
    };
    const formatMemory =(memory)=>{
        if(memory<1024) return `${memory} KB`;
        return `${(memory/1024).toFixed(2)} MB`;
    } 
    const formatDate=(dateString)=>{
        return new Date(dateString).toLocaleString();
    };
    if(loading){
        return (
            <div className="flex justify-center shadow-lg my-4">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }
    if(error){
        return(
            <div className="alert alert-error shadow-lg my-4">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            </div>
        )
    }

    return(
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Submission History</h2>
            {submission.length===0?(
                <div className='alert alert-info shadow-lg'>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>No submissions found for this problem</span>        
                    </div>
                </div>
            ):(
                <>
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Language</th>
                                <th>Status</th>
                                <th>Runtime</th>
                                <th>Memory</th>
                                <th>TestCases</th>
                                <th>Submiited</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                submission.map((sub,index)=>(
                                    <tr  key={sub._id}>
                                        <td>{index+1}</td>
                                        <td className="font-mono">{sub.language}</td>
                                        <td>
                                            <span className={`badge ${getStatusColor(sub.status)}`}>
                                                {sub.status.charAt(0).toUpperCase()+sub.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className='font-mono'>{sub.runtime}sec</td>
                                        <td className="font-mono">{formatMemory(sub.memory)}</td>
                                        <td className="font-mono">{sub.testCasesPassed}/{sub.testCasesTotal}</td>
                                        <td>{formatDate(sub.createdAt)}</td>
                                        <td><button className='btn btn-s btn-outline'>Code</button></td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <p>Showing {submission.length} submission</p>

                
                
                </>
            )}
            {/* Code view Model */}
            {
                selectedSubmission &&(
                    <div>
                        <div>
                            <h3>Submission detail: {selectedSubmission.language}</h3>
                            <div>
                                <div>
                                    <span>{selectedSubmission.status}</span>
                                    <span>Runtime: {selectedSubmission.memory}</span>
                                    <span>Memory:{formatMemory(selectedSubmission.memory)}</span>
                                    <span className="badge badge-outline">Passed</span>
                                </div>
                                {selectedSubmission.errorMessage&&(
                                    <div>
                                        <div><span>{selectedSubmission.errorMessage}</span></div>
                                    </div>
                                )}
                            </div>
                            <pre><code>{selectedSubmission.code}</code></pre>
                            <div><button className="btn" onClick={()=>settselectedSubmission(null)}>Close</button></div>
                        </div>
                    </div>
                )
            }
            

















        </div>
    )
}
export default SubmissionHistory;
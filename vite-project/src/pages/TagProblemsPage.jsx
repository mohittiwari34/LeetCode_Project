import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router';
import axiosClient from '../Utils/axiosClient';
import { ChevronLeft, Tag, CheckCircle, Search, Filter } from 'lucide-react';
import { useSelector } from 'react-redux';

const TagProblemsPage = () => {
    const { tag } = useParams();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all problems (since no backend filtering endpoint exists yet as per knowledge)
                // Filter client side
                const problemsRes = await axiosClient.get('/problem/getAllProblem');
                const allProblems = problemsRes.data;

                // Filter by tag (case insensitive)
                const filtered = allProblems.filter(p =>
                    p.tags?.toLowerCase() === tag?.toLowerCase()
                );
                setProblems(filtered);

                // Fetch user solved status
                if (user) {
                    const solvedRes = await axiosClient.get('/problem/problemSolvedByUser');
                    setSolvedProblems(solvedRes.data.problemSolved || []);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tag, user]);

    const getDifficultyBadgeColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'badge-success badge-outline';
            case 'medium': return 'badge-warning badge-outline';
            case 'hard': return 'badge-error badge-outline';
            default: return 'badge-neutral badge-outline';
        }
    };

    return (
        <div className="min-h-screen bg-base-200 font-sans pt-20 px-4 md:px-8 pb-10">
            <div className="container mx-auto max-w-6xl">

                {/* Header */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <NavLink to="/problems" className="btn btn-circle btn-ghost">
                        <ChevronLeft size={24} />
                    </NavLink>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                            <span className="text-primary">{tag}</span> Problems
                        </h1>
                        <p className="opacity-60 mt-1">
                            {problems.length} {problems.length === 1 ? 'problem' : 'problems'} found
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <>
                        {problems.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {problems.map(problem => {
                                    const isSolved = solvedProblems.some(sp => sp._id === problem._id || sp.id === problem._id || sp.problemId === problem._id);

                                    return (
                                        <NavLink
                                            to={`/problem/${problem._id}`}
                                            key={problem._id}
                                            className="card bg-base-100 shadow-sm hover:shadow-lg transition-all duration-300 border border-base-200 group"
                                        >
                                            <div className="card-body p-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)} badge-sm`}>
                                                        {problem.difficulty}
                                                    </div>
                                                    {isSolved && <CheckCircle size={18} className="text-success" />}
                                                </div>

                                                <h3 className="card-title text-base group-hover:text-primary transition-colors">
                                                    {problem.title}
                                                </h3>

                                                <div className="mt-4 flex items-center gap-2 text-xs opacity-50">
                                                    <Tag size={12} /> {problem.tags}
                                                </div>
                                            </div>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-base-100 rounded-2xl border border-base-200 border-dashed">
                                <Filter size={48} className="mx-auto mb-4 opacity-20" />
                                <h3 className="text-xl font-bold opacity-60">No problems found</h3>
                                <p className="opacity-40">There are no problems with the tag "{tag}" yet.</p>
                                <NavLink to="/problems" className="btn btn-primary btn-sm mt-6">
                                    Browse other topics
                                </NavLink>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TagProblemsPage;

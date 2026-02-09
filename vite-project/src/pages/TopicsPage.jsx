import React from 'react';
import { NavLink } from 'react-router';
import { Layers, Box, GitBranch, Database, Activity, Code, Cpu, Globe, Hash, Layout, Repeat, GitMerge, Zap, Percent } from 'lucide-react';

const topics = [
    { id: 'Array', name: 'Array', icon: Layers, color: 'from-blue-500 to-cyan-500', desc: 'Fundamental data structures' },
    { id: 'String', name: 'String', icon: Code, color: 'from-purple-500 to-pink-500', desc: 'Text processing and manipulation' },
    { id: 'Linked List', name: 'Linked List', icon: GitBranch, color: 'from-emerald-500 to-teal-500', desc: 'Linear collections of elements' },
    { id: 'Stack', name: 'Stack', icon: Layers, color: 'from-orange-500 to-red-500', desc: 'LIFO data structures' },
    { id: 'Queue', name: 'Queue', icon: Repeat, color: 'from-indigo-500 to-purple-500', desc: 'FIFO data structures' },
    { id: 'Tree', name: 'Tree', icon: GitMerge, color: 'from-green-500 to-emerald-500', desc: 'Hierarchical data structures' },
    { id: 'Graph', name: 'Graph', icon: Globe, color: 'from-pink-500 to-rose-500', desc: 'Nodes and edges' },
    { id: 'DP', name: 'Dynamic Programming', shortName: 'DP', icon: Activity, color: 'from-amber-500 to-orange-500', desc: 'Optimization problems' },
    { id: 'Backtracking', name: 'Backtracking', icon: RotateCcw, color: 'from-red-500 to-pink-500', desc: 'Recursive problem solving' },
    { id: 'math', name: 'Math', icon: Percent, color: 'from-cyan-500 to-blue-500', desc: 'Number theory and geometry' },
    { id: 'Sliding Window', name: 'Sliding Window', icon: Layout, color: 'from-violet-500 to-fuchsia-500', desc: 'Subarray problems' },
    { id: 'Greedy', name: 'Greedy', icon: Zap, color: 'from-yellow-400 to-amber-500', desc: 'Local optimal choices' },
];
// Need to import RotateCcw separately/fix import above if it wasn't there. 
// Actually I missed RotateCcw in the top import. I'll fix that in the actual write or just use another icon for now to be safe. "Reply" or something.

import { RotateCcw } from 'lucide-react';

const TopicsPage = () => {
    return (
        <div className="min-h-screen bg-base-200 p-8 pt-24 font-sans">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Explore Topics
                </h1>
                <p className="text-lg opacity-60 max-w-2xl mx-auto">
                    Focus your practice by category. Master one concept at a time.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 container mx-auto">
                {topics.map((topic) => {
                    const Icon = topic.icon;
                    return (
                        <NavLink
                            to={`/problems/${topic.id}`}
                            key={topic.id}
                            className="group relative overflow-hidden rounded-2xl bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-200 p-6 flex flex-col gap-4 hover:-translate-y-1"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${topic.color} opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-500`}></div>

                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                <Icon size={24} />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold mb-1">{topic.name}</h3>
                                <p className="text-sm opacity-60">{topic.desc}</p>
                            </div>

                            <div className="mt-auto flex justify-end opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                                <span className="text-primary font-semibold text-sm">View Problems →</span>
                            </div>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
};

export default TopicsPage;

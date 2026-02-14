import React from 'react';
import { NavLink } from 'react-router';
import { Code2, Zap, Trophy, Users, ArrowRight, CheckCircle } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-base-100 font-sans text-base-content flex flex-col">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200">
                <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <NavLink to="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-primary">
                        <Code2 className="w-6 h-6 md:w-8 md:h-8" />
                        CodeForge
                    </NavLink>
                    <div className="flex items-center gap-2 md:gap-4">
                        <NavLink to="/login" className="btn btn-ghost btn-sm">
                            Log In
                        </NavLink>
                        <NavLink to="/signup" className="btn btn-primary btn-sm">
                            Sign Up
                        </NavLink>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 flex-1 flex items-center bg-gradient-to-br from-base-100 via-base-200 to-base-300">
                <div className="container mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-left duration-700 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight">
                            Master Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Coding Skills
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl opacity-70 max-w-lg leading-relaxed mx-auto md:mx-0">
                            The ultimate platform to practice algorithms, track your progress, and prepare for technical interviews. Join thousands of developers today.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <NavLink to="/signup" className="btn btn-primary btn-md md:btn-lg shadow-xl shadow-primary/20 group">
                                Get Started
                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                            </NavLink>
                            <NavLink to="/problems" className="btn btn-outline btn-md md:btn-lg">
                                Explore Problems
                            </NavLink>
                        </div>
                        <div className="flex items-center gap-4 md:gap-6 pt-4 text-sm font-medium opacity-60 justify-center md:justify-start">
                            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-success" /> 500+ Questions</span>
                            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-success" /> Active Community</span>
                        </div>
                    </div>

                    <div className="relative animate-in slide-in-from-right duration-700 hidden md:block">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl rounded-full opacity-50"></div>
                        <div className="relative bg-[#1e1e1e] rounded-2xl shadow-2xl border border-[#333] p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="space-y-3 font-mono text-sm">
                                <div className="flex gap-2">
                                    <span className="text-pink-400">const</span>
                                    <span className="text-blue-300">solveProblem</span>
                                    <span className="text-white">=</span>
                                    <span className="text-yellow-300">async</span>
                                    <span className="text-white">()</span>
                                    <span className="text-white">{`=>`}</span>
                                    <span className="text-white">{`{`}</span>
                                </div>
                                <div className="pl-4 text-gray-400">// Practice daily to master algorithms</div>
                                <div className="pl-4 flex gap-2">
                                    <span className="text-pink-400">await</span>
                                    <span className="text-green-300">levelUpSkills</span>
                                    <span className="text-white">();</span>
                                </div>
                                <div className="pl-4 flex gap-2">
                                    <span className="text-pink-400">return</span>
                                    <span className="text-orange-300">"Dream Job"</span>
                                    <span className="text-white">;</span>
                                </div>
                                <div className="text-white">{`}`}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="py-16 md:py-24 bg-base-100 relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
                        <p className="opacity-60 max-w-2xl mx-auto">Everything you need to excel in your coding journey, built by developers for developers.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            {
                                icon: Code2,
                                title: "Curated Problems",
                                desc: "High-quality questions categorized by topic and difficulty to streamline your learning.",
                                color: "text-blue-500",
                                bg: "bg-blue-500/10"
                            },
                            {
                                icon: Zap,
                                title: "Daily Streaks",
                                desc: "Build a coding habit with our streak tracking system. Consistency is key!",
                                color: "text-amber-500",
                                bg: "bg-amber-500/10"
                            },
                            {
                                icon: Trophy,
                                title: "Compete & Win",
                                desc: "Join contests (coming soon), track your rank, and challenge friends.",
                                color: "text-purple-500",
                                bg: "bg-purple-500/10"
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-6 md:p-8 rounded-2xl bg-base-200/50 hover:bg-base-200 transition-colors border border-base-300">
                                <div className={`w-14 h-14 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="opacity-70 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-primary text-primary-content">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to start coding?</h2>
                    <p className="text-lg opacity-90 mb-10 max-w-xl mx-auto">Join our community helping code the future. Sign up for free today.</p>
                    <NavLink to="/signup" className="btn btn-lg bg-white text-primary hover:bg-gray-100 border-none">
                        Create Free Account
                    </NavLink>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="footer footer-center py-10 px-4 bg-base-300 text-base-content rounded">
                <nav className="grid grid-flow-col gap-4">
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Jobs</a>
                    <a className="link link-hover">Press kit</a>
                </nav>
                <aside>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved by CodeForge</p>
                </aside>
            </footer>
        </div>
    );
};

export default LandingPage;

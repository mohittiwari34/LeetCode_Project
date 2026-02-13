import { useForm } from "react-hook-form"
import { z } from 'zod';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useState } from "react";
import { registerUser } from "../authslice";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const signupSchema = z.object({
    firstName: z.string().min(3, "Name must be at least 3 characters"),
    emailId: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

function Signup() {
    const [showpassword, setshowpassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isauthicated, loading, error } = useSelector((state) => state.auth);

    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(signupSchema) });
    useEffect(() => {
        if (isauthicated) {
            navigate('/');
        }
    }, [isauthicated, navigate]);

    const onSubmit = (data) => {
        dispatch(registerUser(data));
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-base-200 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
            </div>

            <div className="card w-full max-w-md bg-base-100/70 backdrop-blur-lg shadow-2xl border border-white/20 z-10 animate-in fade-in zoom-in duration-500">
                <div className="card-body p-6 md:p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2">Create Account</h1>
                        <p className="text-base-content/60">Join thousands of developers improving their skills</p>
                    </div>

                    {/* Error Message Display */}
                    {error && (
                        <div className="alert alert-error shadow-sm mb-4 p-3 rounded-lg text-sm animate-in shake">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{error.message || "An error occurred during signup"}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* First Name Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">First Name</span>
                            </label>
                            <label className={`input input-bordered flex items-center gap-2 ${errors.firstName ? 'input-error' : ''}`}>
                                <User size={18} className="opacity-50" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="grow"
                                    {...register('firstName')}
                                    disabled={loading}
                                />
                            </label>
                            {errors.firstName && (
                                <div className="text-error text-xs mt-1 ml-1">{errors.firstName.message}</div>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <label className={`input input-bordered flex items-center gap-2 ${errors.emailId ? 'input-error' : ''}`}>
                                <Mail size={18} className="opacity-50" />
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="grow"
                                    {...register('emailId')}
                                    disabled={loading}
                                />
                            </label>
                            {errors.emailId && (
                                <div className="text-error text-xs mt-1 ml-1">{errors.emailId.message}</div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <label className={`input input-bordered flex items-center gap-2 ${errors.password ? 'input-error' : ''}`}>
                                <Lock size={18} className="opacity-50" />
                                <input
                                    type={showpassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="grow"
                                    {...register('password')}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="btn btn-circle btn-ghost btn-xs opacity-70"
                                    onClick={() => setshowpassword(!showpassword)}
                                    disabled={loading}
                                >
                                    {showpassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </label>
                            {errors.password && (
                                <div className="text-error text-xs mt-1 ml-1">{errors.password.message}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary w-full shadow-lg shadow-primary/30"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin mr-2" />
                                        Creating Account...
                                    </>
                                ) : 'Create Account'}
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center pt-4">
                            <span className="text-sm opacity-70">
                                Already have an account?{' '}
                                <NavLink
                                    to="/login"
                                    className="link link-primary font-bold hover:underline"
                                >
                                    Sign In
                                </NavLink>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup
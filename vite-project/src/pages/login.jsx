import { useForm } from "react-hook-form"
import { z } from 'zod';
import { loginuser } from "../authslice";
import { useNavigate, NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Login1 from "./googleLogin";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
    emailId: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(loginSchema) });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = (data) => {
        dispatch(loginuser(data));
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-base-200 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
            </div>

            <div className="card w-full max-w-md bg-base-100/70 backdrop-blur-lg shadow-2xl border border-white/20 z-10 animate-in fade-in zoom-in duration-500">
                <div className="card-body p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-base-content/60">Enter your credentials to access your account</p>
                    </div>

                    {/* Error Message Display */}
                    {error && (
                        <div className="alert alert-error shadow-sm mb-4 p-3 rounded-lg text-sm animate-in shake">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{error.message || "Invalid email or password"}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <label className={`input input-bordered flex items-center gap-2 ${errors.emailId ? 'input-error' : ''}`}>
                                <Mail size={18} className="opacity-50" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="grow"
                                    {...register('emailId')}
                                    disabled={loading}
                                />
                            </label>
                            {errors.emailId && (
                                <div className="text-error text-xs mt-1 ml-1">
                                    {errors.emailId.message}
                                </div>
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
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="grow"
                                    {...register('password')}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="btn btn-circle btn-ghost btn-xs opacity-70"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </label>

                            {/* Forgot Password Link - moved close to password for better UX */}
                            <div className="text-right mt-1">
                                <NavLink
                                    to="/forgot-password"
                                    className="link link-hover text-xs opacity-60 hover:opacity-100"
                                >
                                    Forgot password?
                                </NavLink>
                            </div>

                            {errors.password && (
                                <div className="text-error text-xs mt-1 ml-1">
                                    {errors.password.message}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary w-full shadow-lg shadow-primary/30"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin mr-2" />
                                        Signing In...
                                    </>
                                ) : 'Sign In'}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="divider text-xs opacity-50 my-4">OR</div>

                        {/* Google Login */}
                        <div className="form-control">
                            <Login1 />
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center pt-2">
                            <span className="text-sm opacity-70">
                                New here?{' '}
                                <NavLink
                                    to="/signup"
                                    className="link link-primary font-bold hover:underline"
                                >
                                    Create Account
                                </NavLink>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
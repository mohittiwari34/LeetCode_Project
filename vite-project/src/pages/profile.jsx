import { useSelector } from "react-redux";
import { Mail, User, Code, Shield, Flame, Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axiosClient from "../Utils/axiosClient";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [calendarData, setCalendarData] = useState({});
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosClient.get("/user/stats");
        setCalendarData(response.data.calendar || {});
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Fallback for profile photo if empty
  const avatarUrl =
    user.profilePhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.firstName
    )}&background=random`;

  // Helper to generate last 365 days for calendar
  const getDaysArray = () => {
    const days = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  };
  const days = getDaysArray();

  const getContributionColor = (count) => {
    if (!count) return "bg-base-300";
    if (count === 1) return "bg-green-300";
    if (count <= 3) return "bg-green-500";
    return "bg-green-700";
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8 flex items-center justify-center font-sans">
      <div className="card w-full max-w-5xl bg-base-100 shadow-2xl overflow-hidden rounded-3xl border border-white/20 animate-in fade-in zoom-in duration-700">

        {/* Decorative Header Background */}
        <div className="h-48 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        <div className="px-6 md:px-10 pb-8 relative">
          {/* Profile Avatar - Overlapping the Header */}
          <div className="-mt-20 mb-6 flex justify-between items-end">
            <div className="avatar ring-4 ring-base-100 ring-offset-base-100 rounded-full bg-base-100 p-1 shadow-2xl">
              <div className="w-32 rounded-full overflow-hidden md:w-40 transition-transform duration-300 hover:scale-105">
                <img src={avatarUrl} alt="Profile" className="object-cover" />
              </div>
            </div>
            <div className="mb-2 hidden md:block">
              <span className="badge badge-primary badge-lg gap-2 text-white shadow-lg p-4 font-semibold tracking-wide">
                <Shield size={16} />
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column: User Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                    {user.firstName.trim()}
                  </h1>
                  <span className="badge badge-outline md:hidden font-medium">{user.role}</span>
                </div>

                <p className="text-base-content/70 flex items-center gap-2 text-lg font-medium">
                  <Mail size={18} className="text-primary" />
                  {user.emailId}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="badge badge-ghost gap-1 text-xs uppercase tracking-widest opacity-70">
                    <User size={12} /> ID: {user._id.slice(-6)}
                  </span>
                </div>
              </div>

              {/* Right Column: Key Stats */}
              <div className="flex-none w-full md:w-[480px]">
                <div className="stats stats-vertical lg:stats-horizontal shadow-lg w-full bg-base-100 border border-base-200 overflow-hidden">
                  <div className="stat transition-colors hover:bg-base-200/50">
                    <div className="stat-figure text-primary/20">
                      <Code size={48} strokeWidth={1.5} />
                    </div>
                    <div className="stat-title font-medium text-base-content/60">Problems Solved</div>
                    <div className="stat-value text-primary">
                      {user.problemSolved ? user.problemSolved.length : 0}
                    </div>
                    <div className="stat-desc text-success font-medium">Top 20% in activity</div>
                  </div>

                  <div className="stat transition-colors hover:bg-base-200/50">
                    <div className="stat-figure text-orange-500/20">
                      <Flame size={48} strokeWidth={1.5} />
                    </div>
                    <div className="stat-title font-medium text-base-content/60">Current Streak</div>
                    <div className="stat-value text-orange-500">
                      {user.currentStreak || 0}
                    </div>
                    <div className="stat-desc text-orange-400 font-medium">Best: {user.longestStreak || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Contribution Calendar */}
            <div className="w-full animate-in slide-in-from-bottom-4 duration-1000 delay-100">
              <div className="card bg-base-100 border border-base-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                    <CalendarIcon size={20} />
                  </div>
                  Submission Activity <span className="text-sm font-normal opacity-50 ml-auto">Last 365 Days</span>
                </h3>

                {/* Heatmap Grid */}
                <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                  <div className="flex text-xs text-base-content/40 mb-2 font-medium" style={{ minWidth: "max-content" }}>
                    {Array.from({ length: 53 }).map((_, weekIndex) => {
                      const dayOfYearIndex = weekIndex * 7;
                      if (dayOfYearIndex >= days.length) return <div key={weekIndex} className="w-3 mx-[2px]"></div>;
                      const d = new Date(days[dayOfYearIndex]);
                      const dayOfMonth = d.getDate();
                      const showMonth = dayOfMonth <= 7;
                      return (
                        <div key={weekIndex} className="w-3 mx-[2px] overflow-visible relative h-4">
                          {showMonth && (
                            <span className="absolute top-0 left-0">
                              {d.toLocaleString('default', { month: 'short' })}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-1" style={{ minWidth: "max-content" }}>
                    {Array.from({ length: 53 }).map((_, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                          const dayOfYearIndex = weekIndex * 7 + dayIndex;
                          if (dayOfYearIndex >= days.length) return null;
                          const d = days[dayOfYearIndex];
                          if (!d) return null;
                          const count = calendarData[d] || 0;
                          return (
                            <div
                              key={d}
                              className={`tooltip w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125 hover:z-10 cursor-pointer ${getContributionColor(count)}`}
                              data-tip={`${count} submissions on ${d}`}
                            ></div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 text-xs text-base-content/50 justify-end font-medium">
                  <span className="mr-1">Less</span>
                  <div className="w-3 h-3 rounded-sm bg-base-300"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-300"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-700"></div>
                  <span className="ml-1">More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

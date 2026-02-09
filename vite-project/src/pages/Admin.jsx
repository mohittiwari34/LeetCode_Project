import React, { useState } from 'react';
import { Edit, Trash2, Home, RefreshCw, Zap, Video, Plus, LayoutDashboard, Settings } from 'lucide-react';
import { NavLink } from 'react-router';

function Admin() {
    const adminOptions = [
        {
            id: 'create',
            title: 'Create Problem',
            description: 'Add a new coding problem to the platform with test cases.',
            icon: Plus,
            color: 'text-success',
            bgColor: 'bg-success/10',
            borderColor: 'hover:border-success',
            route: '/admin/create'
        },
        {
            id: 'update',
            title: 'Update Problem',
            description: 'Edit existing problems, modify descriptions or difficulty.',
            icon: Edit,
            color: 'text-warning',
            bgColor: 'bg-warning/10',
            borderColor: 'hover:border-warning',
            route: '/admin/update'
        },
        {
            id: 'delete',
            title: 'Delete Problem',
            description: 'Remove outdated or incorrect problems from the platform.',
            icon: Trash2,
            color: 'text-error',
            bgColor: 'bg-error/10',
            borderColor: 'hover:border-error',
            route: '/admin/delete'
        },
        {
            id: 'video',
            title: 'Manage Videos',
            description: 'Upload and delete video solutions for problems.',
            icon: Video,
            color: 'text-info',
            bgColor: 'bg-info/10',
            borderColor: 'hover:border-info',
            route: '/admin/video'
        }
    ];

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-base-100 rounded-2xl shadow-lg mb-4">
                        <LayoutDashboard className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
                        Admin Dashboard
                    </h1>
                    <p className="text-lg opacity-60 text-base-content max-w-2xl mx-auto">
                        Manage your platform's content efficiently. Create challenges, update definitions, and maintain video solutions.
                    </p>
                </div>

                {/* Admin Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
                    {adminOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                            <NavLink
                                key={option.id}
                                to={option.route}
                                className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent ${option.borderColor} group overflow-hidden`}
                            >
                                <div className="card-body flex flex-row items-center gap-6 p-8">
                                    <div className={`p-4 rounded-2xl ${option.bgColor} ${option.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent size={32} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="card-title text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            {option.title}
                                        </h2>
                                        <p className="text-base-content/70">
                                            {option.description}
                                        </p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2">
                                        <Zap size={24} className="text-primary/50" />
                                    </div>
                                </div>
                            </NavLink>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Admin;
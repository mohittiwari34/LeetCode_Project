import React,{useState} from 'react';
import {Edit,Trash2,Home,RefreshCw,Zap,Video, Plus, BadgeCent} from 'lucide-react';
import { NavLink } from 'react-router';

function Admin(){
    const [selectedOption,setSelectedOption]=useState(null);
    const adminOptions=[
        {
            id:'create',
            title: 'create Problem',
            description:'Add a new coding problem to the platform',
            icon: Plus,
            color:'btn-success',
            bgColor:'bg-success/10',
            route:'/admin/create'
        },
        {
            id:'update',
            title: 'Update Problem',
            description:'Edit Existing problems and their details',
            icon: Edit,
            color:'btn-warning',
            bgColor:'bg-warning/10',
            route:'/admin/update'

        },
        {
            id:'delete',
            title: 'delete Problem',
            description:'Remove Problems from the platform',
            icon: Trash2,
            color:'btn-error',
            bgColor:'bg-error/10',
            route:'/admin/delete'
        },
        {
            id:'video',
            title: 'video Problem',
            description:'Upoad and Delete videos',
            icon: Video,
            color:'btn-success',
            bgColor:'bg-success/10',
            route:'/admin/video'
        }
    ];
    return(
        <div>
            <div>
                {/* Header */}
                <div>
                    <h1>Admin Panel</h1>
                    <p>Manage coding problems on your platform</p>
                </div>

                {/* Admin Options Grid */}
                <div>
                    <div>
                        {adminOptions.map((option)=>{
                            const IconComponent=option.icon;
                            return(
                                <idv>
                                    <div className="card-body items-center text-center p-8">
                                        <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
                                            <IconComponent size={32} className="text-base-content"/>
                                        </div>
                                        {/* Title */}
                                        <h2>{option.title}</h2>
                                        {/* Description */}
                                        <p>{option.description}</p>
                                        {/* Action Button */}
                                        <div>
                                            <div>
                                                <NavLink to={option.route} className={`btn-${option.color} btn-wide`}>{option.title}</NavLink>

                                            </div>
                                        </div>
                                    </div>
                                </idv>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Admin;
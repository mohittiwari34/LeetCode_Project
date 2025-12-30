import {useParams} from 'react-router';
import React,{useState} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../Utils/axiosClient';

function AdminUpload(){
    const {problemId}=useParams();
    const[uploading,setUploading]=useState(false);
    const[uploadProgress,setUploadProgress]=useState(0);
    const[uploadedVideo,setUploadedVideo]=useState(null);

    const {
        register,
        handleSubmit,
        watch,
        formState:{errors},
        reset,
        setError,
        clearErrors

    }=useForm();

    const selectedFile=watch('videoFile')?.[0];
    //upload video to Cloudinary

    const onSubmit=async(data)=>{
        const file=data.videoFile[0];

        setUploading(true);
        setUploadProgress(0);
        clearErrors();

        try{
            //Step 1: Get upload signature from Backend
            console.log(problemId);

            const signatureResponse=await axiosClient.get(`/video/create/${problemId}`);
            console.log(signatureResponse);
            const {signature,timestamp,public_id,api_key,cloud_name,upload_url}=signatureResponse.data;
            console.log(signature);
            console.log(timestamp);
            console.log(public_id);
            console.log(upload_url);
            console.log(cloud_name);
            console.log(api_key);

            //step2:Create FormData for Cloudinary Upload
            const formData=new FormData();
            formData.append('file',file);
            formData.append('signature',signature);
            formData.append('timestamp',timestamp);
            formData.append('public_id',public_id);
            formData.append('api_key',api_key);

            //Step 3: Upload directly to cloudinary
            const uploadResponse=await axios.post(upload_url,formData,{
                headers:{
                    'Content-Type':'multipart/form-data',

                },
                onUploadProgress: (ProgressEvent)=>{
                    const progress=Math.round((ProgressEvent.loaded*100)/ProgressEvent.total);
                    setUploadProgress(progress);
                }
                
                
            });

            const cloudinaryResult=uploadResponse.data;
            console.log(cloudinaryResult.public_id);
             console.log(cloudinaryResult.secure_url);
             console.log(cloudinaryResult.duration);
            //Step 4: Save the metaDATA to backend
            const metadataResponse=await axiosClient.post('video/save',{
                problemId:problemId,
                cloudinaryPublicId:cloudinaryResult.public_id,
                secureUrl:cloudinaryResult.secure_url,
                duration:cloudinaryResult.duration,
            });
            console.log(metadataResponse);
            setUploadedVideo(metadataResponse.data.videoSolution);
            console.log(uploadedVideo.id);
            reset(); //Reset form after succesful upload






        }
        catch(err){
            console.log('Upload error:',err);
            setError('root',{
                type:'manual',
                message:err.response?.data?.message || 'upload failed.please try again.'

            });


        }
        finally{
            setUploading(false);
            setUploadProgress(0);
        }
    };
    //format File size

    const formatFileSize=(bytes)=>{
        if(bytes===0) return '0 Bytes';
        const k=1024;
        const size=['Bytes','KB','MB','GB'];
        const i=Math.floor(Math.log(bytes)/Math.log(k));
        return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+size[i];

    };
    //Format duration

    const formatDuration=(seconds)=>{
        const mins=Math.floor(seconds/60);
        const secs=Math.floor(seconds%60);
        return `${mins}:${secs.toString().padStart(2,'0')}`;
    }
    return(
        <div className="max-w-md mx-auto p-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Upload Video</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        {/* File Input */}
                        <div className="form-control w-full">
                            <label  className="label">
                                <span className="label-text">Choose video file</span>
                            </label>
                            <input
                            type="file"
                            accept="video/*"
                            {...register('videoFile',{
                                required:'please select a video file',
                                validate:{
                                    isVideo:(files)=>{
                                        if(!files||!files[0]) return true;
                                        const file=files[0];
                                        const maxSize=100*1024*1024;//100MB
                                        return file.size<=maxSize || 'File size must less than 100MB';

                                    }
                                }
                            })}
                            className={`file-input file-input-bordered w-full ${errors.videoFile?'file-input-error':''}`}
                            disabled={uploading}
                            />
                            {errors.videoFile &&(
                                <label className='label'>
                                    <span className="label-text-alt text-error">{errors.videoFile.message}</span>
                                </label>
                            )}

                        </div>
                        {/* Selected File Info */}
                        {selectedFile&&(
                            <div>
                                <div>
                                    <h3 className="font-bold">Selected File:</h3>
                                    <p className="text-sm">{selectedFile.name}</p>
                                    <p className="text-sm">Size: {formatFileSize(selectedFile.size)}</p>

                                </div>
                            </div>
                        )}
                        {/* Upload Progress */}
                        {uploading &&(
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Uploading</span>
                                    <span>{uploadProgress}</span>
                                </div>
                                <progress className="flex justify-between text-sm" value={uploadProgress} max="100">
                                           
                                </progress>

                            </div>
                            
                        )}
                        {/* Error Message */}
                        {errors.root && (
                            <div className="alert alert-error">
                                <span>{errors.root.message}</span>
                            </div>
                        )}

                        {uploadedVideo &&(
                            <div className="alert alert-success">
                                <div>
                                    <h3 className="font-bold">Upload Succesful</h3>
                                    <p className="text-sm">Duration:{formatDuration(uploadedVideo.duration)}</p>
                                    <p className="text-sm">Uploaded:{new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>

                                </div>
                            </div>
                        )}
                        

                        {/* Upload Button */}
                        <div className="card-actions justify-end">
                            <button type="submit" disabled={uploading} className={`btn btn-primary ${uploading ?'loading':''}`}>
                                {uploading ?'uploading':'upload video'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default AdminUpload;
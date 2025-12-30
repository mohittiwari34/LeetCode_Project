import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosClient from "../Utils/axiosClient";

function ProfilePhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const selectedFile = watch("photo")?.[0];

  const onSubmit = async (data) => {
    const file = data.photo?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // 1️⃣ get signature
      const signRes = await axiosClient.get("/profile/create-signature");
      const { signature, timestamp, public_id, api_key, upload_url } =
        signRes.data;

      // 2️⃣ upload to cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("public_id", public_id);
      formData.append("api_key", api_key);

      const uploadRes = await axios.post(upload_url, formData, {
        onUploadProgress: (e) => {
          setUploadProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      // 3️⃣ save in DB
      await axiosClient.post("/profile/save-photo", {
        secureUrl: uploadRes.data.secure_url,
        publicId: uploadRes.data.public_id,
      });

      reset();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        id="photo"
        hidden
        {...register("photo", {
          required: "Please select an image",
          validate: {
            size: (files) =>
              files[0]?.size <= 5 * 1024 * 1024 || "Max size 5MB",
          },
        })}
      />

      {/* Upload Button */}
      <label
        htmlFor="photo"
        className="btn btn-sm btn-outline w-full cursor-pointer"
      >
        📷 Choose Photo
      </label>

      {/* Error */}
      {errors.photo && (
        <p className="text-error text-xs">{errors.photo.message}</p>
      )}

      {/* Preview */}
      {selectedFile && (
        <div className="flex flex-col items-center gap-2">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
              />
            </div>
          </div>
          <p className="text-xs opacity-70 truncate">
            {selectedFile.name}
          </p>
        </div>
      )}

      {/* Progress */}
      {uploading && (
        <progress
          className="progress progress-primary w-full"
          value={uploadProgress}
          max="100"
        />
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={uploading || !selectedFile}
        className="btn btn-sm btn-primary w-full"
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>
    </form>
  );
}

export default ProfilePhotoUpload;

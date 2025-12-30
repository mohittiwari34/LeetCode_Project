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
      // 1️⃣ Get signature from backend
      const signRes = await axiosClient.get("/profile/create-signature");

      const {
        signature,
        timestamp,
        public_id,
        api_key,
        upload_url,
      } = signRes.data;

      // 2️⃣ Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("public_id", public_id);
      formData.append("api_key", api_key);

      const uploadRes = await axios.post(upload_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) => {
          setUploadProgress(
            Math.round((e.loaded * 100) / e.total)
          );
        },
      });

      // 3️⃣ Save image info in backend DB
      await axiosClient.post("/profile/save-photo", {
        secureUrl: uploadRes.data.secure_url,
        publicId: uploadRes.data.public_id,
      });
      console.log(uploadRes.data.secure_url);

      reset();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="file"
        accept="image/*"
        {...register("photo", {
          required: "Please select an image",
          validate: {
            size: (files) =>
              files[0]?.size <= 5 * 1024 * 1024 ||
              "Max size 5MB",
          },
        })}
      />

      {errors.photo && <p>{errors.photo.message}</p>}

      {selectedFile && (
        <>
          <p>{selectedFile.name}</p>
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="preview"
            width={120}
          />
        </>
      )}

      {uploading && (
        <progress value={uploadProgress} max="100" />
      )}

      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>
    </form>
  );
}

export default ProfilePhotoUpload;

import axios from 'axios';

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append('file', file.base64);
  formData.append('upload_preset', 'unsigned_chat');
  formData.append('folder', 'chat_uploads');
  formData.append('resource_type', 'auto');
  formData.append('flags', 'attachment'); // 🔥 FORCE DOWNLOAD

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    formData
  );

  return res.data;
};

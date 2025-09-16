'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User } from "../types/user";
import Logo from "../components/body/Logo";
import Modal from "../styles/Modal";

export default function VideoUploadForm() {
  const router = useRouter();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_ON_BACKEND;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resUser = await axios.get(`${API}/auth/me`, { withCredentials: true });
        if (!resUser.data) router.replace("/");
        else setUser(resUser.data);
      } catch {
        router.replace("/");
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else setVideoPreviewUrl(null);
  }, [videoFile]);

  useEffect(() => {
    if (previewFile) {
      const url = URL.createObjectURL(previewFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else setImagePreviewUrl(null);
  }, [previewFile]);

  const showModal = (message: string) => {
    setModalMessage(message);
    setIsModalOpen(true);
    setTimeout(() => setIsModalOpen(false), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !videoName) {
      showModal("Видео и название обязательны!");
      return;
    }

    const formData = new FormData();
    formData.append("file", videoFile);
    if (previewFile) formData.append("filePreview", previewFile);
    formData.append("videoName", videoName);
    formData.append("videoDescription", videoDescription);

    try {
      setLoading(true);
      await axios.post(`${API}/video/video-upload`, formData, { withCredentials: true });

      showModal("Видео успешно загружено!");

      setVideoFile(null);
      setPreviewFile(null);
      setVideoName("");
      setVideoDescription("");
    } catch (error) {
      console.error(error);
      showModal("Ошибка загрузки! Посмотри консоль для деталей.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-6 text-center text-white text-lg">Загрузка...</div>;

  return (
    <>
      <Logo />
      <div className="max-w-5xl h-150 mx-auto p-8 bg-gray-900 rounded-3xl shadow-2xl text-white">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-400 text-center">
          Загрузка видео
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Название видео"
              value={videoName}
              onChange={(e) => setVideoName(e.target.value)}
              className="w-full p-3 outline-none rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-400 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              required
            />
            <textarea
              placeholder="Описание видео"
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-800 outline-none border border-gray-700 placeholder-gray-400 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none h-80"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white w-50 cursor-pointer font-bold py-3 px-10 rounded-xl shadow-lg transition disabled:opacity-50 mt-5"
            >
              {loading ? "Загрузка..." : "Загрузить"}
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div>
              <label className="font-semibold text-white mb-2 block">Выберите видео:</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="text-gray-200 w-full"
              />
              {videoPreviewUrl && (
                <video
                  src={videoPreviewUrl}
                  controls
                  className="mt-2 w-80 max-h-50 rounded-xl shadow-lg"
                />
              )}
            </div>

            <div>
              <label className="font-semibold text-white mb-2 block">Превью:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPreviewFile(e.target.files?.[0] || null)}
                className="text-gray-200 w-full"
              />
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Превью"
                  className="mt-2 w-50 h-32 rounded-xl object-contain shadow-md"
                />
              )}
            </div>
          </div>
        </form>
      </div>

      {modalMessage && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="text-center text-white font-bold text-[16px]">
            {modalMessage}
          </div>
        </Modal>
      )}
    </>
  );
}
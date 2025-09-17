"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Video } from "@/app/types/video"
import Header from "../body/Header"

interface VideoListProps {
  initialVideos?: Video[]
}

export default function VideoList({ initialVideos = [] }: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const router = useRouter()
  const API = process.env.NEXT_PUBLIC_API_ON_BACKEND
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!initialVideos || initialVideos.length === 0) {
      fetch(`${API}/video/videos`, { credentials: "include" })
        .then(res => res.json())
        .then(data => setVideos(shuffleArray(data)))
        .catch(err => console.error(err))
    }
  }, [])

  useEffect(() => {
    if (initialVideos && initialVideos.length > 0) {
      setVideos(initialVideos)
    }
  }, [initialVideos])

  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  function timeAgo(dateString: string) {
    const now = new Date()
    const past = new Date(dateString)
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (diff < 60) return `${diff} секунд назад`
    if (diff < 3600) return `${Math.floor(diff / 60)} минут назад`
    if (diff < 86400) return `${Math.floor(diff / 3600)} часов назад`
    if (diff < 604800) return `${Math.floor(diff / 86400)} дней назад`
    if (diff < 2592000) return `${Math.floor(diff / 604800)} недель назад`
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} месяцев назад`
    return `${Math.floor(diff / 31536000)} лет назад`
  }

  if (!videos.length) return (
    <div>
      <Header />
      <div role="status" className="flex justify-center items-center mt-60">
        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )

  return (
    <>
      <Header />

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) =>
          <div key={`${video.id}`} className="space-y-2 cursor-pointer text-white">
            <div className="relative w-full pb-[56.25%] bg-black rounded overflow-hidden">
              <img
                src={video.videoPreview}
                onClick={() => router.push(`/video/${encodeURIComponent(video.videoName)}`)}
                alt={video.videoName}
                className="absolute top-0 left-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex items-start gap-3">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={video.ownerAvatar || "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"}
                alt={video.ownerUsername || "Avatar"}
                onClick={() => router.push(`/profile/${video.ownerUsername}`)}
              />
              <div className="flex flex-col">
                <h2 className="text-[16px] font-bold text-white line-clamp-2">
                  {video.videoName}
                </h2>
                <p
                  className="text-[14px] text-gray-400 hover:text-gray-300"
                  onClick={() => router.push(`/profile/${video.ownerUsername}`)}
                >
                  {video.ownerUsername || "Автор неизвестен"}
                </p>
                <p className="text-xs text-gray-400">
                  Вышел: {timeAgo(video.created_at)}
                </p>
              </div>
            </div>
          </div>
        )
        }
      </div>
    </>
  )
}

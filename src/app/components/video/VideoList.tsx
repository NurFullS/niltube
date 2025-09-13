"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState, useRef } from "react"
import { Video } from "@/app/types/video"
import Header from "../body/Header"

export default function VideoList() {
  const [videos, setVideos] = useState<Video[]>([])
  const router = useRouter()
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})

  useEffect(() => {
    fetch("http://localhost:8080/video/videos", { credentials: "include" })
      .then(res => res.json())
      .then(data => setVideos(shuffleArray(data)))
      .catch(err => console.error(err))
  }, [])

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

  if (!videos.length) return <p className="p-4 text-white">Нет видео</p>

  return (
    <>
      <Header />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map(video => (
          <div key={video.id} className="space-y-2 cursor-pointer text-white">
            <div
              className="relative w-full pb-[56.25%] bg-black rounded overflow-hidden"
              onClick={() => router.push(`/video/${video.id}`)}
            >
              <img
                src={video.videoPreview}
                alt={video.videoName}
                className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 hover:opacity-0"
              />
              <video
                ref={el => {
                  videoRefs.current[video.id] = el
                }}
                src={video.videoUrl}
                className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                muted
                loop
                preload="metadata"
                onMouseEnter={() => videoRefs.current[video.id]?.play()}
                onMouseLeave={() => {
                  const v = videoRefs.current[video.id]
                  if (v) {
                    v.pause()
                    v.currentTime = 0
                  }
                }}
              />

            </div>

            {/* Информация о видео */}
            <div className="flex items-start gap-3">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={video.ownerAvatar || 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'}
                alt={video.ownerUsername || 'Avatar'}
              />
              <div className="flex flex-col">
                <h2 className="text-[16px] font-bold text-white line-clamp-2">{video.videoName}</h2>
                <p className="text-[14px] text-gray-400">{video.ownerUsername}</p>
                <p className="text-xs text-gray-400">Вышел: {timeAgo(video.created_at)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

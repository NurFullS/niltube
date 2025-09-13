"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Video } from "@/app/types/video"
import Header from "../body/Header"

export default function VideoList() {
  const [videos, setVideos] = useState<Video[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch("http://localhost:8080/video/videos", {
      credentials: "include"
    })
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

  if (!videos.length) return <p className="p-4">Нет видео</p>

  return (
    <>
      <Header />
      <div className="flex justify-between gap-10 p-4 flex-wrap">
        {videos.map(video => (
          <div key={video.id} className="space-y-2 p-2 rounded shadow-sm cursor-pointer text-white">

            <div
              className="relative w-[300px] h-48 bg-black rounded overflow-hidden cursor-pointer"
              onClick={() => router.push(`/video/${video.id}`)}
            >
              <img
                src={video.videoPreview}
                alt={video.videoName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex">
              <img className="w-10 mt-1 h-10 rounded-2xl object-cover" src={video.ownerAvatar || 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'} alt="" />
              <div className="ml-3">
                <h2 className="text-lg font-bold">{video.videoName}</h2>
                <p className="text-[16px] text-gray-400 mb-1">{video.ownerUsername}</p>
                <p className="text-xs text-gray-400">Вышел: {timeAgo(video.created_at)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

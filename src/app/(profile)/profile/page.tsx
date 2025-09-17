'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Logo from '@/app/components/body/Logo'
import { Video } from '@/app/types/video'
import { useRouter } from 'next/navigation'
import { Trash, Settings } from 'lucide-react'

type User = {
  id: number
  username: string
  email: string
  avatar: string | null
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [openSettingsId, setOpenSettingsId] = useState<number | null>(null)
  const router = useRouter()
  const API = process.env.NEXT_PUBLIC_API_ON_BACKEND

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await axios.get(`${API}/auth/me`, { withCredentials: true })
        if (!resUser.data) return router.push('/')
        setUser(resUser.data)

        const resVideos = await axios.get(`${API}/video/user/${resUser.data.username}`, { withCredentials: true })
        setVideos(resVideos.data)
      } catch (err) {
        console.error(err)
        router.push('/')
      }
    }
    fetchData()
  }, [API, router])

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API}/video/delete-video/${id}`, { withCredentials: true })
      setVideos(videos.filter(v => v.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const timeAgo = (dateString: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000)
    if (diff < 60) return `${diff} сек. назад`
    if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч. назад`
    if (diff < 604800) return `${Math.floor(diff / 86400)} дн. назад`
    if (diff < 2592000) return `${Math.floor(diff / 604800)} нед. назад`
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} мес. назад`
    return `${Math.floor(diff / 31536000)} лет назад`
  }

  if (!user) return <div className="p-6 text-center">Загрузка...</div>

  return (
    <div>
      <Logo />

      <div className="mt-8 max-w-4xl p-5 flex flex-col md:flex-row border-b-2 ml-5 rounded border-blue-600">
        <img
          className="w-28 h-28 rounded-full border-2 border-blue-400 object-cover"
          src={user.avatar || 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'}
          alt="avatar"
        />
        <div className="ml-5 flex flex-col justify-center">
          <p className="text-3xl font-bold text-blue-400">@{user.username}</p>
          <p className="text-blue-400 text-[16px] mt-1">{user.email}</p>
          <p className="text-gray-500 text-[16px] mt-1">https://niltube.com/profile/{user.username}</p>
        </div>
      </div>

      <div>
        <p className='text-2xl text-blue-400 font-bold p-4'>Ваши видео:</p>

        {videos.length === 0 ? (
          <h1 className="text-center text-gray-400 mt-10">У вас пока что нет видео</h1>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map(video => (
              <div key={video.id} className="space-y-2 text-white relative">
                <div className="relative w-full pb-[56.25%] bg-black rounded overflow-hidden">
                  <img
                    src={video.videoPreview}
                    onClick={() => router.push(`/video/${encodeURIComponent(video.videoName)}`)}
                    alt={video.videoName}
                    className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
                    loading="lazy"
                  />
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div>
                    <h2 className="text-[16px] font-bold line-clamp-2 max-w-70">{video.videoName}</h2>
                    <p className="text-xs text-gray-400">Вышел: {timeAgo(video.created_at)}</p>
                  </div>

                  <div className="flex gap-2 p-2 mt-5">
                    <Trash
                      color="red"
                      className="cursor-pointer"
                      onClick={() => handleDelete(video.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

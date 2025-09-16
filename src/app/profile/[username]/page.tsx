'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Logo from '@/app/components/body/Logo'
import { Video } from '@/app/types/video'
import { useRouter, useParams } from 'next/navigation'

type User = {
  id: number
  username: string
  email: string
  avatar: string | null
}

export default function UserProfile() {
  const params = useParams()
  const username = params?.username
  const [user, setUser] = useState<User | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const API = process.env.NEXT_PUBLIC_API_ON_BACKEND

  useEffect(() => {
    if (!username) return
    setLoading(true)

    const fetchUserAndVideos = async () => {
      try {
        const [resUser, resVideos] = await Promise.all([
          axios.get(`${API}/auth/users/${username}`),
          axios.get(`${API}/video/user/${username}`)
        ])
        setUser(resUser.data)
        setVideos(resVideos.data)
      } catch (err) {
        console.error(err)
        setUser(null)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndVideos()
  }, [username])

  const timeAgo = (dateString: string) => {
    const now = Date.now()
    const past = new Date(dateString).getTime()
    const diff = Math.floor((now - past) / 1000)

    if (diff < 60) return `${diff} секунд назад`
    if (diff < 3600) return `${Math.floor(diff / 60)} минут назад`
    if (diff < 86400) return `${Math.floor(diff / 3600)} часов назад`
    if (diff < 604800) return `${Math.floor(diff / 86400)} дней назад`
    if (diff < 2592000) return `${Math.floor(diff / 604800)} недель назад`
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} месяцев назад`
    return `${Math.floor(diff / 31536000)} лет назад`
  }

  if (!username) return <div className="p-6 text-center text-gray-500">Неверный пользователь</div>
  if (loading) return <div className="p-6 text-center text-blue-400">Загрузка...</div>
  if (!user) return <div className="p-6 text-center text-gray-500">Пользователь не найден</div>

  return (
    <div>
      <Logo />

      <div className="mt-8 w-full max-w-4xl p-5 flex flex-col md:flex-row border-b-2 rounded-[2px] ml-5 border-blue-600">
        <img
          className="w-28 h-28 rounded-full border-4 border-blue-400 object-cover"
          src={user.avatar || 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'}
          alt="avatar"
        />
        <div className="md:ml-6 md:mt-1 text-center md:text-left">
          <p className="text-3xl font-bold text-blue-400">@{user.username}</p>
          <p className="text-blue-400 text-[16px] mt-1">{user.email}</p>
          <p className="text-gray-500 text-[14px] mt-2">
            https://niltube.com/profile/{user.username}
          </p>
        </div>
      </div>

      <div>
        <p className="text-2xl text-blue-400 font-bold p-4">Видео пользователя:</p>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div key={video.id} className="space-y-2 cursor-pointer text-white">
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
                  <div className="flex flex-col">
                    <h2 className="text-[16px] font-bold text-white line-clamp-2">
                      {video.videoName}
                    </h2>
                    <p className="text-xs text-gray-400">
                      Вышел: {timeAgo(video.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              У этого пользователя пока нет видео
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

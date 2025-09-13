'use client'

import React, { useState, useEffect, ChangeEvent } from 'react'
import axios from 'axios'
import Logo from '../components/body/Logo'

type User = {
  id: number
  username: string
  email: string
  avatar: string | null
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Загрузка текущего пользователя
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:8080/auth/me', {
          withCredentials: true,
        })
        if (res.data) {
          setUser(res.data)
        } else {
          // если не авторизован — редирект на главную
          window.location.href = '/'
        }
      } catch (error) {
        console.error(error)
        window.location.href = '/'
      }
    }
    fetchUser()
  }, [])

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const handleUploadAvatar = async () => {
    if (!avatarFile) return
    const formData = new FormData()
    formData.append('file', avatarFile)

    try {
      setLoading(true)
      const res = await axios.post('http://localhost:8080/auth/upload-avatar', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (user) {
        setUser({ ...user, avatar: res.data })
        setMessage('Аватар обновлен!')
      }
    } catch (error) {
      console.error(error)
      setMessage('Ошибка при загрузке аватара.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="p-6 text-center">Загрузка...</div>

  return (
    <>
      <Logo />
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">Профиль</h2>
        {message && <p className="text-center text-blue-500 mb-4">{message}</p>}
        <div className="flex flex-col items-center gap-4">
          <img
            src={avatarFile ? URL.createObjectURL(avatarFile) : user.avatar || 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'}
            alt="Аватар"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          <button
            onClick={handleUploadAvatar}
            disabled={loading || !avatarFile}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : 'Сменить аватар'}
          </button>
        </div>

        <div className="mt-6">
          <p><strong>Имя:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>
    </>
  )
}

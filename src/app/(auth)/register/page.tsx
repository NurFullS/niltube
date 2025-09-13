'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (username.length < 3) return setMessage('Имя минимум 3 символа')
    if (!validateEmail(email)) return setMessage('Неверный email')
    if (password.length < 6) return setMessage('Пароль минимум 6 символов')

    try {
      setLoading(true)
      const res = await axios.post('http://localhost:8080/auth/register', {
        username,
        email,
        password,
      })
      setMessage('Пользователь зарегистрирован: ' + res.data.username)
      setUsername('')
      setEmail('')
      setPassword('')
      setTimeout(() => router.replace('/login'), 1500)
    } catch (err: any) {
      setMessage('Ошибка: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Регистрация
        </h1>

        <div>
          <label className="block text-gray-700 mb-1">Имя</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 outline-none"
          />
        </div>

        <div className="relative">
          <label className="block text-gray-700 mb-1">Пароль</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg outline-none border border-gray-300"
          />
          <span
            className="absolute right-3 top-11 cursor-pointer text-gray-500 hover:text-blue-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {message && (
          <div
            className={`font-medium ${message.startsWith('Пользователь') ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer font-bold py-3 rounded-lg transition"
        >
          {loading ? '⏳ Регистрация...' : 'Зарегистрироваться'}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Уже есть аккаунт?{' '}
          <span
            onClick={() => router.push('/login')}
            className="text-blue-500 font-semibold hover:underline cursor-pointer"
          >
            Войти
          </span>
        </p>
      </form>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(
        'http://localhost:8080/auth/login',
        { email, password },
        { withCredentials: true }
      )
      setEmail('')
      setPassword('')
      setMessage('Добро пожаловать, ' + res.data.username)
      setTimeout(() => router.replace('/'), 1000)
    } catch (err: any) {
      setMessage('Ошибка: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-5"
      >
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Вход
        </h1>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 outline-none"
          />
        </div>

        {/* Пароль */}
        <div className="relative">
          <label className="block text-gray-700 mb-1">Пароль</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-gray-300 outline-none"
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
            className={`font-medium ${
              message.startsWith('Добро') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 cursor-pointer rounded-lg transition"
        >
          {loading ? 'Входим...' : 'Войти'}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Нет аккаунта?{' '}
          <span
            onClick={() => router.push('/register')}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Зарегистрироваться
          </span>
        </p>
      </form>
    </div>
  )
}

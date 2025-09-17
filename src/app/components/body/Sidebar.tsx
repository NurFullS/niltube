'use client'

import React from 'react';
import axios from "axios";
import { Settings, PersonStanding, Circle, LogOut, Home } from "lucide-react";
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_ON_BACKEND;

const Sidebar = () => {

    const router = useRouter()

  const handleLogout = async () => {
    try {
      await axios.get(`${API}/auth/logout`);
      router.replace('/login')
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  return (
    <div className="w-60 p-4 bg-gray-600 rounded-lg shadow-md flex flex-col">
      <div className="space-y-4">
        <MenuItem icon={<Home size={24} />} label="Главная" onClick={() => router.push('/')} />
        <MenuItem icon={<PersonStanding size={24} />} label="Профиль" onClick={() => router.push('/profile')} />
        <MenuItem icon={<Settings size={24} />} label="Настройки" onClick={() => router.push('/settings')} />
        <MenuItem icon={<Circle size={24} />} label="Сменить аккаунт" onClick={() => router.push('/login')} />
      </div>

      <div className="mt-auto">
        <MenuItem icon={<LogOut size={24} color="red" />} label="Выйти" onClick={handleLogout} textColor="red-600"/>
      </div>
    </div>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  textColor?: string;
}

const MenuItem = ({ icon, label, onClick, textColor = "blue-400" }: MenuItemProps) => (
  <div
    className={`flex items-center gap-2 p-2 rounded hover:bg-gray-800 cursor-pointer`}
    onClick={onClick}
  >
    <div className={`text-${textColor}`}>{icon}</div>
    <p className={`text-${textColor} font-semibold text-lg`}>{label}</p>
  </div>
);

export default Sidebar;

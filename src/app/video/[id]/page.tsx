"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import CustomVideoPlayer from "@/app/components/video/CustomPleer"
import { Video } from "@/app/types/video"
import VideoToVideo from "@/app/components/video/VideoToVideo"
import Header from "@/app/components/body/Header"

export default function VideoPage() {
    const params = useParams()
    const id = params.id
    const [video, setVideo] = useState<Video | null>(null)

    useEffect(() => {
        fetch(`http://localhost:8080/video/${id}`, { credentials: "include" })
            .then(res => res.json())
            .then(data => setVideo(data))
            .catch(err => console.error(err))
    }, [id])

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

    if (!video) return <p className="p-4">Загрузка...</p>

    return (
        <>
            <div className="h-full flex p-1 bg-black">
                <h1 className="text-blue-400 flex"><p className="font-bold">NilTube</p>ㅤ-ㅤ{video.videoName}</h1>
            </div>
            <Header />
            <div className="flex">
                <div className="p-4 space-y-4">
                    <div>
                        <CustomVideoPlayer src={video.videoUrl} />
                    </div>

                    <div className="ml-5 mt-2">
                        <p className="text-white font-bold mb-3">{video.videoName}</p>
                        <div className="flex gap-3">
                            <img src={video.ownerAvatar || 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'} alt="Avatar" className="w-10 h-10 rounded-[50%] object-cover" />
                            <div className="">
                                <p className="text-white text-[16px] mt-2 mb-5">
                                    {video.ownerUsername}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-white text-xs">Вышел: {timeAgo(video.created_at)}</p>
                            <p className="text-white mt-3 w-100">{video.videoDescription}</p>
                        </div>
                    </div>
                </div>
                <VideoToVideo />
            </div>
        </>
    )
}

'use client'

import React, { useEffect, useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"

type Props = {
  src: string
  poster?: string
}

export default function CustomVideoPlayer({ src, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) video.pause()
    else video.play()
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !isFinite(video.duration) || video.duration === 0) return

    const current = video.currentTime
    const percent = (current / video.duration) * 100
    setProgress(percent)
    setCurrentTime(current)
    setDuration(video.duration)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video || !isFinite(video.duration) || video.duration === 0) return

    const value = Number(e.target.value)
    video.currentTime = (value / 100) * video.duration
    setProgress(value)
  }

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current?.parentElement
    if (!videoContainer) return

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(err => console.log(err))
    } else {
      document.exitFullscreen().catch(err => console.log(err))
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60).toString().padStart(2, "0")
    return `${minutes}:${seconds}`
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        togglePlay()
      }
      if (e.code === "KeyF") {
        e.preventDefault()
        toggleFullscreen()
      }
      if (e.code === "KeyM") {
        e.preventDefault()
        toggleMute()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPlaying, isMuted])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      if (isFinite(video.duration)) setDuration(video.duration)
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata)
  }, [])

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-black rounded-lg overflow-hidden shadow-lg">
      <div className="relative w-220 pb-[56.25%] bg-black">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="absolute top-0 left-0 w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlay}
          onEnded={() => {
            setProgress(0)
            setCurrentTime(0)
            setIsPlaying(false)
          }}
        />

        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 accent-blue-500 cursor-pointer"
          />

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <button onClick={togglePlay} className="hover:text-blue-400">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button onClick={toggleMute} className="hover:text-blue-400">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <span className="text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <button onClick={toggleFullscreen} className="hover:text-blue-400">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from "react"
import { YT } from "../../assets/icons/YT"
import "./YouTubePlayer.scss"

interface YouTubePlayerProps {
  videoUrl: string
  title: string
  YTPreview?: string
}

export const YouTubePlayer = ({
  videoUrl,
  title,
  YTPreview,
}: YouTubePlayerProps) => {
  const [isPlayed, setIsPlayed] = useState(false)
  const [videoId] = useState(videoUrl.split("youtu.be/")[1]?.split("?")[0])

  if (!videoId) {
    return <div>Ошибка: неверная ссылка на видео</div>
  }

  const handlePlayClick = () => {
    setIsPlayed(true)
  }

  return (
    <div className="youtube-player-wrapper">
      {/* Кастомный превью-оверлей */}
      {!isPlayed && videoUrl && YTPreview ? (
        <div className="youtube-preview-overlay" onClick={handlePlayClick}>
          <img
            src={YTPreview}
            alt="Превью видео"
            className="youtube-preview-img"
          />
          <div className="play-button">
            <YT />
          </div>
        </div>
      ) : (
        ""
      )}

      {/* iframe — всегда загружен, но скрыт за оверлеем до клика */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?si=kdixMruqvqRGPp0a${isPlayed ? "&autoplay=1" : ""}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="youtube-player-frame"
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: "10px",
        }}
      />
    </div>
  )
}

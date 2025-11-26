import { useState } from "react"
import "./YouTubePlayer.scss"

interface YouTubePlayerProps {
  videoId: string
  title: string
  YT: string
}

export const YouTubePlayer = ({ videoId, title, YT }: YouTubePlayerProps) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="youtube-player-wrapper">
      {/* Fallback-изображение — всегда видимо, пока не загрузился iframe */}
      {!isLoaded && (
        <img
          src={YT}
          alt="Видео недоступно"
          onError={() => console.warn("Fallback image failed to load")}
        />
      )}

      {/* iframe — появляется при загрузке */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?si=kdixMruqvqRGPp0a`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
        style={{
          display: isLoaded ? "block" : "none",
          borderRadius: "44px",
        }}
        className="youtube-player-frame"
      />
    </div>
  )
}

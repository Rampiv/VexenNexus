export const TitleBackground = () => {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#120D1F" />
          <stop offset="50%" stopColor="#8300CF" />
          <stop offset="100%" stopColor="#120D1F" />
        </linearGradient>

        <linearGradient id="fadeMask" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="20%" stopColor="white" stopOpacity="1" />
          <stop offset="80%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        <mask id="softEdgesMask">
          <rect width="100%" height="100%" fill="url(#fadeMask)" />
        </mask>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(#headerGradient)"
        mask="url(#softEdgesMask)"
      />
    </svg>
  )
}

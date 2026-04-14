import "./Loader.scss"

interface Prop {
  width: string
  height: string
}

export const Loader = ({ width, height }: Prop) => {
  return (
    <div className="loader-container">
      <svg
      className="loader"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
    </div>
  )
}

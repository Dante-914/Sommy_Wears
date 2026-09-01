export default function Spinner({ size = 40, color = '#ffd700' }) {
  return (
    <div className="spinner-wrapper">
      <div 
        className="spinner" 
        style={{ 
          width: size, 
          height: size,
          borderColor: `${color} transparent ${color} transparent`
        }}
      />
    </div>
  )
}
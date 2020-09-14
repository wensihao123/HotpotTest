import React from 'react'
import pot from '../../assets/img/hotpot.png'

interface SushiIconProps {
  size?: number
  v1?: boolean
  v2?: boolean
  v3?: boolean
}

const SushiIcon: React.FC<SushiIconProps> = ({ size = 36, v1, v2, v3 }) => (
  <span
    role="img"
    style={{
      width: size,
      height: size,
      filter: v1 ? 'saturate(0.5)' : undefined,
    }}
  >
    <img
      alt="pot"
      src={pot}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  </span>
)

export default SushiIcon

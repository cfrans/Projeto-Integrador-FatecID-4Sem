import { useCallback } from 'react'

export function useSpotlight() {
  const ref = useCallback((node) => {
    if (!node) return

    const handleMove = (e) => {
      const rect = node.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      node.style.setProperty('--x', `${x}px`)
      node.style.setProperty('--y', `${y}px`)
    }

    const handleEnter = () => node.classList.add('spotlight-active')
    const handleLeave = () => node.classList.remove('spotlight-active')

    node.addEventListener('mousemove', handleMove)
    node.addEventListener('mouseenter', handleEnter)
    node.addEventListener('mouseleave', handleLeave)

    return () => {
      node.removeEventListener('mousemove', handleMove)
      node.removeEventListener('mouseenter', handleEnter)
      node.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return ref
}
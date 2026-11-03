'use client'

import { SmallDogMascot } from '@/components/ui'

export default function PetVisual({ user, furColor = '#efc88f', className = '' }) {
  if (user?.petPhoto) {
    return (
      <img
        className={`pet-visual-photo ${className}`}
        src={user.petPhoto}
        alt={user.petName || 'Mascota'}
      />
    )
  }
  return <SmallDogMascot furColor={furColor} className={className} />
}

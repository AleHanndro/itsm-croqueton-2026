'use client'

import { useCommunity } from '@/context/app-context'

const avatarColorFields = [
  {
    key: 'furColor',
    label: 'Pelaje del avatar',
    colors: [
      ['Miel', '#d98a4e'],
      ['Crema', '#efc88f'],
      ['Chocolate', '#805238'],
      ['Gris', '#8b929b']
    ]
  },
  {
    key: 'shirtColor',
    label: 'Camiseta / ropa',
    colors: [
      ['Coral', '#ef6547'],
      ['Mostaza', '#e7b62d'],
      ['Turquesa', '#72bbba'],
      ['Azul', '#647fa1']
    ]
  },
  {
    key: 'shortsColor',
    label: 'Shorts / detalle',
    colors: [
      ['Mezclilla', '#647fa1'],
      ['Coral', '#ef6547'],
      ['Oliva', '#77845b'],
      ['Crema', '#e3d6bf']
    ]
  },
  {
    key: 'shoesColor',
    label: 'Tenis',
    colors: [
      ['Crema', '#fff8df'],
      ['Turquesa', '#72bbba'],
      ['Coral', '#ef6547']
    ]
  },
  {
    key: 'glassesColor',
    label: 'Gafas',
    colors: [
      ['Azul oscuro', '#202436'],
      ['Coral', '#ef6547'],
      ['Azul', '#4f83bd']
    ]
  }
]
const petColorOptions = [
  ['Crema', '#efc88f'],
  ['Miel', '#d98a4e'],
  ['Gris', '#8b929b']
]
const outfitOptions = [
  ['shirt', 'Camiseta y shorts'],
  ['dress', 'Vestido'],
  ['overalls', 'Overol']
]
const hairOptions = [
  ['none', 'Sin cabello'],
  ['short', 'Corto'],
  ['long', 'Largo']
]

export default function AvatarPetEditor() {
  const { avatarConfig, updateAvatar, petFurColor, updatePet } = useCommunity()
  return (
    <div className="avatar-pet-editor">
      <fieldset className="avatar-pet-editor-group">
        <legend className="avatar-pet-editor-group-title">Ropa</legend>
        <div className="admin-avatar-option-row">
          {outfitOptions.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`admin-avatar-option ${avatarConfig.outfit === value ? 'is-active' : ''}`}
              aria-pressed={avatarConfig.outfit === value}
              onClick={() => updateAvatar({ outfit: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="avatar-pet-editor-group">
        <legend className="avatar-pet-editor-group-title">Cabello</legend>
        <div className="admin-avatar-option-row">
          {hairOptions.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`admin-avatar-option ${avatarConfig.hair === value ? 'is-active' : ''}`}
              aria-pressed={avatarConfig.hair === value}
              onClick={() => updateAvatar({ hair: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {avatarColorFields.map((field) => (
        <fieldset key={field.key} className="avatar-pet-editor-group">
          <legend className="avatar-pet-editor-group-title">{field.label}</legend>
          <div className="admin-color-row">
            {field.colors.map(([label, color]) => (
              <button
                key={color}
                type="button"
                className={`admin-color-swatch ${avatarConfig[field.key] === color ? 'is-active' : ''}`}
                aria-pressed={avatarConfig[field.key] === color}
                aria-label={label}
                onClick={() => updateAvatar({ [field.key]: color })}
              >
                <span style={{ background: color }} />
                {label}
              </button>
            ))}
          </div>
        </fieldset>
      ))}

      <fieldset className="avatar-pet-editor-group">
        <legend className="avatar-pet-editor-group-title">Pelaje de la mascota</legend>
        <div className="admin-color-row">
          {petColorOptions.map(([label, color]) => (
            <button
              key={color}
              type="button"
              className={`admin-color-swatch ${petFurColor === color ? 'is-active' : ''}`}
              aria-pressed={petFurColor === color}
              aria-label={label}
              onClick={() => updatePet(color)}
            >
              <span style={{ background: color }} />
              {label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

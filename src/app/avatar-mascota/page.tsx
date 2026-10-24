'use client'

import { useState } from 'react'

import { SmallDogMascot } from '@/assets/icons/small-dog-mascot'
import {
  LanguageToggle,
  ThemeToggle,
  PawColorButton,
  SiteNavigation,
  CareAvatar
} from '@/components/ui'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

export default function AvatarStudio() {
  const { language } = useLanguage()
  const { petFurColor, updatePet } = useCommunity()
  const [furColor, setFurColor] = useState('#d98a4e')
  const [shirtColor, setShirtColor] = useState('#ef6547')
  const [shortsColor, setShortsColor] = useState('#647fa1')
  const [shoesColor, setShoesColor] = useState('#fff8df')
  const [glassesColor, setGlassesColor] = useState('#202436')
  const [outfit, setOutfit] = useState('shirt')
  const [hair, setHair] = useState('none')

  const isEnglish = language === 'en'

  return (
    <main className="avatar-studio">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />

      <section className="studio-intro">
        <div className="container">
          <span className="eyebrow">{isEnglish ? 'Avatar & pet' : 'Avatar y mascota'}</span>
          <h1>
            {isEnglish ? 'Build your' : 'Arma tu equipo'}
            <br />
            <span>{isEnglish ? 'animal team.' : 'animal.'}</span>
          </h1>
          <p>
            {isEnglish
              ? "Create a full-body anthropomorphic dog, change every piece of its look and pair it with Chispita. Everything is drawn in Croquet\xF3n's 2D style."
              : 'Crea un perro antropom\xF3rfico de cuerpo completo, cambia cada pieza de su look y acomp\xE1\xF1alo con Chispita. Todo est\xE1 dibujado en el estilo 2D de Croquet\xF3n.'}
          </p>
        </div>
      </section>

      <section className="studio-workspace" aria-label="Personalizador de avatar y mascota">
        <div className="studio-grid container">
          <div className="studio-preview">
            <div className="avatar-stage">
              <span className="care-label">
                {isEnglish ? 'Your caretaker avatar' : 'Tu avatar cuidador'}
              </span>
              <CareAvatar
                furColor={furColor}
                shirtColor={shirtColor}
                shortsColor={shortsColor}
                shoesColor={shoesColor}
                glassesColor={glassesColor}
                outfit={outfit}
                hair={hair}
              />
              <div className="avatar-id">
                <strong>{isEnglish ? 'Agent Paws' : 'Agente Lomito'}</strong>
                <span>
                  {isEnglish ? 'Editable from paws to ears' : 'Look editable de pies a orejas'}
                </span>
              </div>
            </div>
            <div className="studio-mascot-card">
              <SmallDogMascot furColor={petFurColor} className="kibble-mascot" />
              <div>
                <span>{isEnglish ? 'Pet' : 'Mascota'}</span>
                <strong>Chispita</strong>
              </div>
            </div>
          </div>

          <div className="studio-controls">
            <span className="chapter">
              {isEnglish ? 'Customize with no fuss' : 'Personaliza sin complicaciones'}
            </span>
            <h2>
              {isEnglish ? 'Make it' : 'Hazlo muy'}
              <br />
              {isEnglish ? 'yours.' : 'tuyo.'}
            </h2>

            <fieldset>
              <legend>{isEnglish ? 'Outfit type' : 'Tipo de ropa'}</legend>
              <div className="option-list">
                {[
                  ['shirt', isEnglish ? 'T-shirt and shorts' : 'Camiseta y shorts'],
                  ['dress', isEnglish ? 'Dress' : 'Vestido'],
                  ['overalls', isEnglish ? 'Overalls' : 'Overol']
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={outfit === value}
                    onClick={() => setOutfit(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>{isEnglish ? 'Hair' : 'Cabello'}</legend>
              <div className="option-list">
                {[
                  ['none', isEnglish ? 'No hair' : 'Sin cabello'],
                  ['short', isEnglish ? 'Short' : 'Corto'],
                  ['long', isEnglish ? 'Long' : 'Largo']
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={hair === value}
                    onClick={() => setHair(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>{isEnglish ? 'Fur color' : 'Color de pelaje'}</legend>
              <div className="swatch-list">
                {[
                  [isEnglish ? 'Honey' : 'Miel', '#d98a4e'],
                  [isEnglish ? 'Cream' : 'Crema', '#efc88f'],
                  ['Chocolate', '#805238'],
                  [isEnglish ? 'Gray' : 'Gris', '#8b929b']
                ].map(([label, color]) => (
                  <PawColorButton
                    key={color}
                    color={color}
                    label={label}
                    selected={furColor === color}
                    onClick={() => setFurColor(color)}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>
                {outfit === 'dress'
                  ? isEnglish
                    ? 'Dress'
                    : 'Vestido'
                  : outfit === 'overalls'
                    ? isEnglish
                      ? 'Overalls'
                      : 'Overol'
                    : isEnglish
                      ? 'T-shirt'
                      : 'Camiseta'}
              </legend>
              <div className="swatch-list">
                {[
                  ['Coral', '#ef6547'],
                  [isEnglish ? 'Mustard' : 'Mostaza', '#e7b62d'],
                  [isEnglish ? 'Turquoise' : 'Turquesa', '#72bbba'],
                  [isEnglish ? 'Blue' : 'Azul', '#647fa1']
                ].map(([label, color]) => (
                  <PawColorButton
                    key={color}
                    color={color}
                    label={label}
                    selected={shirtColor === color}
                    onClick={() => setShirtColor(color)}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>
                {outfit === 'dress'
                  ? isEnglish
                    ? 'Dress detail'
                    : 'Detalle del vestido'
                  : outfit === 'overalls'
                    ? isEnglish
                      ? 'Inner T-shirt'
                      : 'Camiseta interior'
                    : 'Shorts'}
              </legend>
              <div className="swatch-list">
                {[
                  [isEnglish ? 'Denim' : 'Mezclilla', '#647fa1'],
                  ['Coral', '#ef6547'],
                  [isEnglish ? 'Olive' : 'Oliva', '#77845b'],
                  [isEnglish ? 'Cream' : 'Crema', '#e3d6bf']
                ].map(([label, color]) => (
                  <PawColorButton
                    key={color}
                    color={color}
                    label={label}
                    selected={shortsColor === color}
                    onClick={() => setShortsColor(color)}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>{isEnglish ? 'Sneakers' : 'Tenis'}</legend>
              <div className="swatch-list">
                {[
                  ['#fff8df', isEnglish ? 'Cream' : 'Crema'],
                  ['#72bbba', isEnglish ? 'Turquoise' : 'Turquesa'],
                  ['#ef6547', 'Coral']
                ].map(([color, label]) => (
                  <PawColorButton
                    key={color}
                    color={color}
                    label={label}
                    selected={shoesColor === color}
                    onClick={() => setShoesColor(color)}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>{isEnglish ? 'Glasses' : 'Gafas'}</legend>
              <div className="swatch-list">
                {[
                  ['#202436', isEnglish ? 'Dark blue' : 'Azul oscuro'],
                  ['#ef6547', 'Coral'],
                  ['#4f83bd', isEnglish ? 'Blue' : 'Azul']
                ].map(([color, label]) => (
                  <PawColorButton
                    key={color}
                    color={color}
                    label={label}
                    selected={glassesColor === color}
                    onClick={() => setGlassesColor(color)}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>{isEnglish ? "Chispita's fur" : 'Pelaje de Chispita'}</legend>
              <div className="swatch-list">
                {[
                  ['#efc88f', isEnglish ? 'Cream' : 'Crema'],
                  ['#d98a4e', isEnglish ? 'Honey' : 'Miel'],
                  ['#8b929b', isEnglish ? 'Gray' : 'Gris']
                ].map(([color, label]) => (
                  <PawColorButton
                    key={color}
                    color={color}
                    label={label}
                    selected={petFurColor === color}
                    onClick={() => updatePet(color)}
                  />
                ))}
              </div>
            </fieldset>
            <p className="studio-note" aria-live="polite">
              {isEnglish
                ? 'Changes apply instantly. Zero forms, zero fleas.'
                : 'Los cambios se aplican al instante. Cero formularios, cero pulgas.'}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

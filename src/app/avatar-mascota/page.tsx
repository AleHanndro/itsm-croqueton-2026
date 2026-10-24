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
    <main className="min-h-screen bg-surface-page-mint text-foreground">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />

      <section className="bg-surface-bar pt-18.75 pb-17.5 phone:py-13.75">
        <div className="relative z-2 mx-auto w-[min(1240px,calc(100%-96px))] tablet:w-[min(100%-36px,680px)] phone:w-[min(100%-28px,680px)] laptop:w-[min(100%-48px,1040px)]">
          <span className="mb-5 inline-flex items-center gap-2.25 text-small leading-tight font-black tracking-[0.16em] uppercase before:h-1 before:w-3.75 before:rounded-pill before:bg-current before:content-['']">
            {isEnglish ? 'Avatar & pet' : 'Avatar y mascota'}
          </span>
          <h1 className="mt-2.5 mb-6.25 text-[clamp(66px,7.5vw,112px)] leading-[0.84] font-extrabold phone:text-[clamp(50px,16vw,60px)]">
            {isEnglish ? 'Build your' : 'Arma tu equipo'}
            <br />
            <span className="text-accent">{isEnglish ? 'animal team.' : 'animal.'}</span>
          </h1>
          <p className="mb-0 max-w-170 text-body leading-loose font-extrabold phone:text-base">
            {isEnglish
              ? "Create a full-body anthropomorphic dog, change every piece of its look and pair it with Chispita. Everything is drawn in Croquet\xF3n's 2D style."
              : 'Crea un perro antropom\xF3rfico de cuerpo completo, cambia cada pieza de su look y acomp\xE1\xF1alo con Chispita. Todo est\xE1 dibujado en el estilo 2D de Croquet\xF3n.'}
          </p>
        </div>
      </section>

      <section
        className="relative pt-25 pb-30 before:absolute before:inset-0 before:bg-[radial-gradient(var(--secondary)_2px,transparent_2px)] before:bg-size-[32px_32px] before:opacity-(--studio-dots-opacity) before:content-[''] phone:pt-17.5 phone:pb-22.5"
        aria-label="Personalizador de avatar y mascota"
      >
        <div className="relative z-2 mx-auto grid w-[min(1240px,calc(100%-96px))] grid-cols-[1fr_0.85fr] items-start gap-22.5 tablet:w-[min(100%-36px,680px)] tablet:grid-cols-[1fr] phone:w-[min(100%-28px,680px)] phone:gap-15 laptop:w-[min(100%-48px,1040px)]">
          <div className="sticky top-33.5 grid grid-cols-[1fr_200px] items-end gap-5 tablet:relative tablet:top-0 tablet:mx-auto tablet:max-w-170 phone:grid-cols-[1fr]">
            <div className="relative grid h-190 place-items-center before:absolute before:top-27.5 before:size-125 before:rounded-circle before:bg-brand before:shadow-[12px_14px_0_var(--ink-faint)] before:content-[''] phone:h-172.5 phone:before:top-41.25 phone:before:size-[min(92vw,320px)]">
              <span className="absolute top-17.5 left-0.75 z-4 -rotate-5 rounded-lg border-3 border-ink bg-accent px-3.75 py-2.5 font-heading text-[14px] font-black text-white shadow-[5px_5px_0_var(--ink)] phone:left-0">
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
              <div className="absolute right-0 -bottom-2.5 z-5 w-55 rotate-2 rounded-card-sm border-3 border-ink bg-card px-4.25 py-3.25 shadow-pop phone:w-51.25">
                <strong className="block font-heading text-[20px]">
                  {isEnglish ? 'Agent Paws' : 'Agente Lomito'}
                </strong>
                <span className="block text-caption font-extrabold">
                  {isEnglish ? 'Editable from paws to ears' : 'Look editable de pies a orejas'}
                </span>
              </div>
            </div>
            <div className="relative min-h-82.5 rotate-2 rounded-[110px_110px_25px_25px] border-4 border-ink bg-surface-warm px-5 pt-62.5 pb-5.5 text-center text-ink shadow-card phone:mt-11.25 phone:w-[min(240px,78vw)] phone:justify-self-center">
              <SmallDogMascot
                furColor={petFurColor}
                className="absolute top-1.25 left-1/2 w-46.25 -translate-x-1/2"
              />
              <div className="relative z-2">
                <span className="mx-auto mb-1.75 block w-max rounded-pill bg-ink px-2.5 py-1.25 text-caption font-black tracking-[0.12em] text-card uppercase">
                  {isEnglish ? 'Pet' : 'Mascota'}
                </span>
                <strong className="mt-0.75 block font-heading text-[28px]">Chispita</strong>
              </div>
            </div>
          </div>

          <div className="relative rounded-[30px] border-4 border-ink bg-card p-9.5 text-ink shadow-[10px_11px_0_var(--ink)] tablet:mx-auto tablet:max-w-170 phone:px-4.5 phone:py-6.25">
            <span className="mb-6.25 inline-flex items-center text-small leading-tight font-black tracking-[0.16em] text-accent uppercase">
              {isEnglish ? 'Customize with no fuss' : 'Personaliza sin complicaciones'}
            </span>
            <h2 className="mb-8.75 min-[541px]:text-[clamp(50px,4.6vw,70px)]">
              {isEnglish ? 'Make it' : 'Hazlo muy'}
              <br />
              {isEnglish ? 'yours.' : 'tuyo.'}
            </h2>

            <fieldset className="border-t-2 border-dashed border-divider py-6">
              <legend className="pr-2.5 font-heading text-[18px] font-black">
                {isEnglish ? 'Outfit type' : 'Tipo de ropa'}
              </legend>
              <div className="flex flex-wrap gap-2.25">
                {[
                  ['shirt', isEnglish ? 'T-shirt and shorts' : 'Camiseta y shorts'],
                  ['dress', isEnglish ? 'Dress' : 'Vestido'],
                  ['overalls', isEnglish ? 'Overalls' : 'Overol']
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className="relative rounded-pill border-2 border-ink bg-white px-3.75 py-2.5 font-black text-ink shadow-[0_4px_0_var(--divider)]! transition-[transform,box-shadow] duration-180 ease-[ease] hover:transform-[translateY(-2px)] hover:shadow-[0_6px_0_#8d846f]! active:transform-[translateY(2px)] active:shadow-none! aria-pressed:bg-ink aria-pressed:pr-9.25 aria-pressed:text-card aria-pressed:shadow-[0_4px_0_var(--brand)]! aria-pressed:after:absolute aria-pressed:after:top-1/2 aria-pressed:after:right-2.5 aria-pressed:after:grid aria-pressed:after:size-4.75 aria-pressed:after:-translate-y-1/2 aria-pressed:after:place-items-center aria-pressed:after:rounded-circle aria-pressed:after:bg-brand aria-pressed:after:text-[12px] aria-pressed:after:text-ink aria-pressed:after:content-['✓']"
                    aria-pressed={outfit === value}
                    onClick={() => setOutfit(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="border-t-2 border-dashed border-divider py-6">
              <legend className="pr-2.5 font-heading text-[18px] font-black">
                {isEnglish ? 'Hair' : 'Cabello'}
              </legend>
              <div className="flex flex-wrap gap-2.25">
                {[
                  ['none', isEnglish ? 'No hair' : 'Sin cabello'],
                  ['short', isEnglish ? 'Short' : 'Corto'],
                  ['long', isEnglish ? 'Long' : 'Largo']
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className="relative rounded-pill border-2 border-ink bg-white px-3.75 py-2.5 font-black text-ink shadow-[0_4px_0_var(--divider)]! transition-[transform,box-shadow] duration-180 ease-[ease] hover:transform-[translateY(-2px)] hover:shadow-[0_6px_0_#8d846f]! active:transform-[translateY(2px)] active:shadow-none! aria-pressed:bg-ink aria-pressed:pr-9.25 aria-pressed:text-card aria-pressed:shadow-[0_4px_0_var(--brand)]! aria-pressed:after:absolute aria-pressed:after:top-1/2 aria-pressed:after:right-2.5 aria-pressed:after:grid aria-pressed:after:size-4.75 aria-pressed:after:-translate-y-1/2 aria-pressed:after:place-items-center aria-pressed:after:rounded-circle aria-pressed:after:bg-brand aria-pressed:after:text-[12px] aria-pressed:after:text-ink aria-pressed:after:content-['✓']"
                    aria-pressed={hair === value}
                    onClick={() => setHair(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="border-t-2 border-dashed border-divider py-6">
              <legend className="pr-2.5 font-heading text-[18px] font-black">
                {isEnglish ? 'Fur color' : 'Color de pelaje'}
              </legend>
              <div className="grid grid-cols-[repeat(4,1fr)] gap-2.25 phone:grid-cols-[repeat(2,1fr)]">
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

            <fieldset className="border-t-2 border-dashed border-divider py-6">
              <legend className="pr-2.5 font-heading text-[18px] font-black">
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
              <div className="grid grid-cols-[repeat(4,1fr)] gap-2.25 phone:grid-cols-[repeat(2,1fr)]">
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

            <fieldset className="border-t-2 border-dashed border-divider py-6">
              <legend className="pr-2.5 font-heading text-[18px] font-black">
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
              <div className="grid grid-cols-[repeat(4,1fr)] gap-2.25 phone:grid-cols-[repeat(2,1fr)]">
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

            <fieldset className="border-t-2 border-dashed border-divider py-6">
              <legend className="pr-2.5 font-heading text-[18px] font-black">
                {isEnglish ? 'Sneakers' : 'Tenis'}
              </legend>
              <div className="grid grid-cols-[repeat(4,1fr)] gap-2.25 phone:grid-cols-[repeat(2,1fr)]">
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

            <fieldset className="border-t-2 border-dashed border-divider py-6">
              <legend className="pr-2.5 font-heading text-[18px] font-black">
                {isEnglish ? 'Glasses' : 'Gafas'}
              </legend>
              <div className="grid grid-cols-[repeat(4,1fr)] gap-2.25 phone:grid-cols-[repeat(2,1fr)]">
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

            <fieldset className="border-t-2 border-dashed border-divider py-6">
              <legend className="pr-2.5 font-heading text-[18px] font-black">
                {isEnglish ? "Chispita's fur" : 'Pelaje de Chispita'}
              </legend>
              <div className="grid grid-cols-[repeat(4,1fr)] gap-2.25 phone:grid-cols-[repeat(2,1fr)]">
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
            <p
              className="mt-4.5 rounded-xl bg-[#e7eee7] px-3.75 py-3.25 text-[12px] font-extrabold"
              aria-live="polite"
            >
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

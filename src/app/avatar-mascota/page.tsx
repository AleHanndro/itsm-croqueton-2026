'use client'

import { useState } from 'react'

import { SmallDogMascot } from '@/assets/icons/small-dog-mascot'
import {
  ColorSwatchGroup,
  CustomizerFieldset,
  TogglePillGroup
} from '@/components/customizer-controls'
import { PageHero } from '@/components/page-hero'
import { PageShell } from '@/components/page-shell'
import { CareAvatar } from '@/components/ui'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
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
    <PageShell surface="mint">
      <PageHero
        surface="bar"
        spacing="studio"
        eyebrow={isEnglish ? 'Avatar & pet' : 'Avatar y mascota'}
        title={isEnglish ? 'Build your' : 'Arma tu equipo'}
        accentTitle={isEnglish ? 'animal team.' : 'animal.'}
        titleClassName="mt-2.5 mb-6.25 text-[clamp(66px,7.5vw,112px)] leading-[0.84] phone:text-[clamp(50px,16vw,60px)]"
        description={
          isEnglish
            ? "Create a full-body anthropomorphic dog, change every piece of its look and pair it with Chispita. Everything is drawn in Croquet\xF3n's 2D style."
            : 'Crea un perro antropom\xF3rfico de cuerpo completo, cambia cada pieza de su look y acomp\xE1\xF1alo con Chispita. Todo est\xE1 dibujado en el estilo 2D de Croquet\xF3n.'
        }
        descriptionClassName="mb-0 max-w-170 phone:text-base"
      />

      <section
        className="relative pt-25 pb-30 before:absolute before:inset-0 before:bg-[radial-gradient(var(--secondary)_2px,transparent_2px)] before:bg-size-[32px_32px] before:opacity-(--studio-dots-opacity) before:content-[''] phone:pt-17.5 phone:pb-22.5"
        aria-label="Personalizador de avatar y mascota"
      >
        <Container className="grid grid-cols-[1fr_0.85fr] items-start gap-22.5 tablet:grid-cols-[1fr] phone:gap-15">
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
            <Eyebrow variant="section" tone="accent">
              {isEnglish ? 'Customize with no fuss' : 'Personaliza sin complicaciones'}
            </Eyebrow>
            <h2 className="mb-8.75 min-[541px]:text-[clamp(50px,4.6vw,70px)]">
              {isEnglish ? 'Make it' : 'Hazlo muy'}
              <br />
              {isEnglish ? 'yours.' : 'tuyo.'}
            </h2>

            <CustomizerFieldset legend={isEnglish ? 'Outfit type' : 'Tipo de ropa'}>
              <TogglePillGroup
                value={outfit}
                onValueChange={setOutfit}
                options={[
                  { value: 'shirt', label: isEnglish ? 'T-shirt and shorts' : 'Camiseta y shorts' },
                  { value: 'dress', label: isEnglish ? 'Dress' : 'Vestido' },
                  { value: 'overalls', label: isEnglish ? 'Overalls' : 'Overol' }
                ]}
              />
            </CustomizerFieldset>

            <CustomizerFieldset legend={isEnglish ? 'Hair' : 'Cabello'}>
              <TogglePillGroup
                value={hair}
                onValueChange={setHair}
                options={[
                  { value: 'none', label: isEnglish ? 'No hair' : 'Sin cabello' },
                  { value: 'short', label: isEnglish ? 'Short' : 'Corto' },
                  { value: 'long', label: isEnglish ? 'Long' : 'Largo' }
                ]}
              />
            </CustomizerFieldset>

            <CustomizerFieldset legend={isEnglish ? 'Fur color' : 'Color de pelaje'}>
              <ColorSwatchGroup
                value={furColor}
                onValueChange={setFurColor}
                options={[
                  { label: isEnglish ? 'Honey' : 'Miel', color: '#d98a4e' },
                  { label: isEnglish ? 'Cream' : 'Crema', color: '#efc88f' },
                  { label: 'Chocolate', color: '#805238' },
                  { label: isEnglish ? 'Gray' : 'Gris', color: '#8b929b' }
                ]}
              />
            </CustomizerFieldset>

            <CustomizerFieldset
              legend={
                outfit === 'dress'
                  ? isEnglish
                    ? 'Dress'
                    : 'Vestido'
                  : outfit === 'overalls'
                    ? isEnglish
                      ? 'Overalls'
                      : 'Overol'
                    : isEnglish
                      ? 'T-shirt'
                      : 'Camiseta'
              }
            >
              <ColorSwatchGroup
                value={shirtColor}
                onValueChange={setShirtColor}
                options={[
                  { label: 'Coral', color: '#ef6547' },
                  { label: isEnglish ? 'Mustard' : 'Mostaza', color: '#e7b62d' },
                  { label: isEnglish ? 'Turquoise' : 'Turquesa', color: '#72bbba' },
                  { label: isEnglish ? 'Blue' : 'Azul', color: '#647fa1' }
                ]}
              />
            </CustomizerFieldset>

            <CustomizerFieldset
              legend={
                outfit === 'dress'
                  ? isEnglish
                    ? 'Dress detail'
                    : 'Detalle del vestido'
                  : outfit === 'overalls'
                    ? isEnglish
                      ? 'Inner T-shirt'
                      : 'Camiseta interior'
                    : 'Shorts'
              }
            >
              <ColorSwatchGroup
                value={shortsColor}
                onValueChange={setShortsColor}
                options={[
                  { label: isEnglish ? 'Denim' : 'Mezclilla', color: '#647fa1' },
                  { label: 'Coral', color: '#ef6547' },
                  { label: isEnglish ? 'Olive' : 'Oliva', color: '#77845b' },
                  { label: isEnglish ? 'Cream' : 'Crema', color: '#e3d6bf' }
                ]}
              />
            </CustomizerFieldset>

            <CustomizerFieldset legend={isEnglish ? 'Sneakers' : 'Tenis'}>
              <ColorSwatchGroup
                value={shoesColor}
                onValueChange={setShoesColor}
                options={[
                  { color: '#fff8df', label: isEnglish ? 'Cream' : 'Crema' },
                  { color: '#72bbba', label: isEnglish ? 'Turquoise' : 'Turquesa' },
                  { color: '#ef6547', label: 'Coral' }
                ]}
              />
            </CustomizerFieldset>

            <CustomizerFieldset legend={isEnglish ? 'Glasses' : 'Gafas'}>
              <ColorSwatchGroup
                value={glassesColor}
                onValueChange={setGlassesColor}
                options={[
                  { color: '#202436', label: isEnglish ? 'Dark blue' : 'Azul oscuro' },
                  { color: '#ef6547', label: 'Coral' },
                  { color: '#4f83bd', label: isEnglish ? 'Blue' : 'Azul' }
                ]}
              />
            </CustomizerFieldset>

            <CustomizerFieldset legend={isEnglish ? "Chispita's fur" : 'Pelaje de Chispita'}>
              <ColorSwatchGroup
                value={petFurColor}
                onValueChange={updatePet}
                options={[
                  { color: '#efc88f', label: isEnglish ? 'Cream' : 'Crema' },
                  { color: '#d98a4e', label: isEnglish ? 'Honey' : 'Miel' },
                  { color: '#8b929b', label: isEnglish ? 'Gray' : 'Gris' }
                ]}
              />
            </CustomizerFieldset>
            <p
              className="mt-4.5 rounded-xl bg-[#e7eee7] px-3.75 py-3.25 text-[12px] font-extrabold"
              aria-live="polite"
            >
              {isEnglish
                ? 'Changes apply instantly. Zero forms, zero fleas.'
                : 'Los cambios se aplican al instante. Cero formularios, cero pulgas.'}
            </p>
          </div>
        </Container>
      </section>
    </PageShell>
  )
}

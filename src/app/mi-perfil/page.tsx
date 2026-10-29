'use client'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useState } from 'react'

import { Paw } from '@/assets/icons/paw'
import { SmallDogMascot } from '@/assets/icons/small-dog-mascot'
import CommunityNavigation from '@/components/community-navigation'
import { PostCard } from '@/components/post-card'
import { LanguageToggle, ThemeToggle, CareAvatar } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Eyebrow } from '@/components/ui/eyebrow'
import { useNavigate } from '@/lib/navigation'
import { useCommunity } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

export default function ProfilePage() {
  const { language } = useLanguage()
  const { user, posts, petFurColor, updateProfile, updatePassword, signOut } = useCommunity()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name ?? '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  if (!user) redirect('/guaubook')

  const isEnglish = language === 'en'
  const userPosts = posts.filter((post) => post.author === user.name)

  return (
    <main className="min-h-screen bg-surface-page-mint text-foreground">
      <LanguageToggle />
      <ThemeToggle />
      <CommunityNavigation />
      <Container as="section" className="pt-16.5 pb-27.5 phone:pt-10.5">
        <div className="grid grid-cols-[170px_1fr_auto] items-center gap-7 rounded-3xl border-4 border-ink bg-card p-6.25 shadow-card tablet:grid-cols-[140px_1fr] phone:grid-cols-[1fr] phone:p-4.75">
          <div className="h-41.25 overflow-hidden rounded-card-sm bg-brand phone:size-33.75 [&_.care-avatar]:-mt-10.5 [&_.care-avatar]:h-63.75 [&_.care-avatar]:w-full">
            <CareAvatar
              furColor="#d98a4e"
              shirtColor="#ef6547"
              shortsColor="#647fa1"
              shoesColor="#fff8df"
              glassesColor="#202436"
            />
          </div>
          <div>
            <Eyebrow>{isEnglish ? 'My profile' : 'Mi perfil'}</Eyebrow>
            <h1 className="mt-2.75 mb-5 text-[clamp(64px,7vw,104px)] leading-display">
              {user.name}
            </h1>
            <p className="m-0 font-extrabold opacity-65">{user.email}</p>
          </div>
          <div className="grid justify-items-center font-black tablet:col-span-full tablet:grid-cols-[auto_1fr] tablet:justify-start tablet:gap-2.5 phone:col-auto">
            <SmallDogMascot
              furColor={petFurColor}
              className="h-32.5 w-28.75 tablet:h-21.25 tablet:w-18.75"
            />
            <span>{isEnglish ? 'Pet' : 'Mascota'} · Chispita</span>
          </div>
        </div>
        <div className="mt-13 grid grid-cols-[minmax(300px,0.72fr)_minmax(0,1fr)] items-start gap-13.75 tablet:grid-cols-[1fr] tablet:gap-8.75 phone:mt-8.75">
          <section className="grid gap-6 rounded-3xl border-4 border-ink bg-card p-6.75 shadow-card phone:p-4.75">
            <h2 className="m-0 min-[541px]:text-[42px]">
              {isEnglish ? 'Your settings' : 'Tus ajustes'}
            </h2>
            <form
              className="grid gap-3"
              onSubmit={(event) => {
                event.preventDefault()
                updateProfile(name)
                setMessage(isEnglish ? 'Profile updated.' : 'Perfil actualizado.')
              }}
            >
              <label className="grid gap-1.75 text-[12px] font-black tracking-label uppercase">
                {isEnglish ? 'Name' : 'Nombre'}
                <input
                  className="min-h-13 w-full resize-none rounded-control border-3 border-ink bg-white p-3.5 font-bold text-ink"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <Button type="submit">{isEnglish ? 'Edit profile' : 'Editar perfil'}</Button>
            </form>
            <form
              className="grid gap-3"
              onSubmit={(event) => {
                event.preventDefault()
                if (password.length >= 6) {
                  updatePassword(password)
                  setPassword('')
                  setMessage(isEnglish ? 'Password changed.' : 'Contrase\xF1a actualizada.')
                }
              }}
            >
              <label className="grid gap-1.75 text-[12px] font-black tracking-label uppercase">
                {isEnglish ? 'New password' : 'Nueva contrase\xF1a'}
                <input
                  type="password"
                  className="min-h-13 w-full resize-none rounded-control border-3 border-ink bg-white p-3.5 font-bold text-ink"
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              <Button variant="underline" type="submit" className="text-ink">
                {isEnglish ? 'Change password' : 'Cambiar contrase\xF1a'}
              </Button>
            </form>
            <Button
              variant="underline"
              className="text-left text-accent-deep"
              onClick={() => {
                signOut()
                navigate('/')
              }}
            >
              {isEnglish ? 'Sign out' : 'Cerrar sesi\xF3n'}
            </Button>
            <small aria-live="polite" className="font-extrabold">
              {message}
            </small>
          </section>
          <section>
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="m-0 min-[541px]:text-[42px]">
                {isEnglish ? 'Your posts' : 'Tus publicaciones'}
              </h2>
              <Link href="/guaubook" className="font-black underline">
                {isEnglish ? 'Go to GuauBook' : 'Ir a GuauBook'}
              </Link>
            </div>
            {userPosts.length ? (
              <div className="grid gap-5">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="grid min-h-55 place-items-center rounded-3xl border-3 border-dashed border-secondary text-center font-black [&_svg]:w-14.5 [&_svg]:text-secondary">
                <Paw />
                <p>
                  {isEnglish
                    ? 'Your first post will appear here.'
                    : 'Tu primera publicaci\xF3n aparecer\xE1 aqu\xED.'}
                </p>
              </div>
            )}
          </section>
        </div>
      </Container>
    </main>
  )
}

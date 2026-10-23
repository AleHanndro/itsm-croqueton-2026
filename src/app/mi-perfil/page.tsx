'use client'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useState } from 'react'

import CommunityNavigation from '@/components/community-navigation'
import { PostCard } from '@/components/post-card'
import { LanguageToggle, ThemeToggle, Paw, CareAvatar, SmallDogMascot } from '@/components/ui'
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
    <main className="community-page">
      <LanguageToggle />
      <ThemeToggle />
      <CommunityNavigation />
      <section className="profile-page container">
        <div className="profile-card">
          <div className="profile-avatar">
            <CareAvatar
              furColor="#d98a4e"
              shirtColor="#ef6547"
              shortsColor="#647fa1"
              shoesColor="#fff8df"
              glassesColor="#202436"
            />
          </div>
          <div>
            <span className="eyebrow">{isEnglish ? 'My profile' : 'Mi perfil'}</span>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
          <div className="profile-pet">
            <SmallDogMascot furColor={petFurColor} />
            <span>{isEnglish ? 'Pet' : 'Mascota'} · Chispita</span>
          </div>
        </div>
        <div className="profile-grid">
          <section className="profile-settings">
            <h2>{isEnglish ? 'Your settings' : 'Tus ajustes'}</h2>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                updateProfile(name)
                setMessage(isEnglish ? 'Profile updated.' : 'Perfil actualizado.')
              }}
            >
              <label>
                {isEnglish ? 'Name' : 'Nombre'}
                <input value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <button className="button button-dark" type="submit">
                {isEnglish ? 'Edit profile' : 'Editar perfil'}
              </button>
            </form>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                if (password.length >= 6) {
                  updatePassword(password)
                  setPassword('')
                  setMessage(isEnglish ? 'Password changed.' : 'Contrase\xF1a actualizada.')
                }
              }}
            >
              <label>
                {isEnglish ? 'New password' : 'Nueva contrase\xF1a'}
                <input
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              <button className="profile-text-action" type="submit">
                {isEnglish ? 'Change password' : 'Cambiar contrase\xF1a'}
              </button>
            </form>
            <button
              className="profile-logout"
              type="button"
              onClick={() => {
                signOut()
                navigate('/')
              }}
            >
              {isEnglish ? 'Sign out' : 'Cerrar sesi\xF3n'}
            </button>
            <small aria-live="polite">{message}</small>
          </section>
          <section>
            <div className="profile-post-heading">
              <h2>{isEnglish ? 'Your posts' : 'Tus publicaciones'}</h2>
              <Link href="/guaubook">{isEnglish ? 'Go to GuauBook' : 'Ir a GuauBook'}</Link>
            </div>
            {userPosts.length ? (
              <div className="post-feed">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="empty-posts">
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
      </section>
    </main>
  )
}

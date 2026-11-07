'use client'

import { cn } from 'cn'
import { Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'

import { Paw } from '@/assets/icons/paw'
import { UserAvatar } from '@/components/user-visuals'
import {
  formatPostDate,
  isPostOwnedBy,
  profileForComment,
  profileForPost,
  profilePath
} from '@/lib/community'
import { assessPostRelevance } from '@/lib/content'
import { useNavigate } from '@/lib/navigation'
import { useCommunity, type CommunityPost } from '@/providers/community-provider'
import { useLanguage } from '@/providers/language-provider'

export function PostCard({ post }: { post: CommunityPost }) {
  const { language } = useLanguage()
  const { user, profiles, follows, editPost, deletePost, toggleLike, addComment, toggleFollow } =
    useCommunity()
  const navigate = useNavigate()
  const [comment, setComment] = useState('')
  const [editedBody, setEditedBody] = useState(post.body)
  const [editNotice, setEditNotice] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const commentInputRef = useRef<HTMLInputElement>(null)

  const isEnglish = language === 'en'
  const author = profileForPost(post, profiles)
  const authorName = author?.name ?? post.author
  const authorHref = author
    ? author.email === user?.email
      ? '/mi-perfil'
      : profilePath(author.username)
    : null
  const hasLiked = !!user && post.likedBy.includes(user.email)
  const isOwner = !!user && isPostOwnedBy(post, user.email)
  const isBlocked = !!user && user.accountStatus !== 'active'
  const canFollow = !!user && !!author && author.email !== user.email
  const isFollowingAuthor =
    !!user &&
    !!author &&
    author.email !== user.email &&
    (follows[user.email] ?? []).includes(author.email)

  function saveEdit() {
    const nextBody = editedBody.trim()

    if (!nextBody) {
      setEditNotice(
        isEnglish ? 'The post cannot be empty.' : 'La publicación no puede quedar vacía.'
      )
      return
    }

    if (assessPostRelevance(nextBody, !!post.image) !== 'approved') {
      setEditNotice(
        isEnglish
          ? 'Add a clear reference to pets, adoption, animal health or care before saving.'
          : 'Añade una referencia clara a mascotas, adopción, salud o cuidado animal antes de guardar.'
      )
      return
    }

    editPost(post.id, nextBody)
    setEditNotice('')
    setIsEditing(false)
  }

  const authorMeta = (
    <span className="min-w-0">
      <strong className="block truncate font-heading text-[20px]">{authorName}</strong>
      <span className="flex flex-wrap items-center gap-1.5">
        {author && <small className="block font-extrabold opacity-55">@{author.username}</small>}
        <small className="block font-extrabold opacity-55">
          {author ? '· ' : ''}
          {formatPostDate(post, language, { includeTime: true })}
        </small>
      </span>
    </span>
  )

  return (
    <article className="rounded-3xl border-4 border-ink bg-card p-5.5 shadow-card phone:p-4.75">
      <div className="flex items-start justify-between gap-3.75">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          {author && authorHref ? (
            <Link
              href={authorHref}
              className="flex min-w-0 items-center gap-3 text-left"
              aria-label={
                isEnglish ? `Open ${authorName}'s profile` : `Abrir el perfil de ${authorName}`
              }
            >
              <UserAvatar
                user={author}
                className="size-11.25 flex-none shadow-[2px_2px_0_var(--ink-faint)]"
              />
              {authorMeta}
            </Link>
          ) : (
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-11.25 flex-none place-items-center rounded-circle border-3 border-ink bg-brand [&_svg]:w-6.25">
                <Paw />
              </span>
              {authorMeta}
            </div>
          )}
          {canFollow && author && (
            <button
              type="button"
              className={cn(
                'rounded-pill border-2 border-ink px-2 py-0.5 text-micro font-black [transition:background_0.2s_ease]',
                isFollowingAuthor ? 'bg-brand text-ink' : 'bg-surface-warm text-ink hover:bg-brand'
              )}
              onClick={() => toggleFollow(author.email)}
              aria-pressed={isFollowingAuthor}
            >
              {isFollowingAuthor
                ? isEnglish
                  ? 'Following'
                  : 'Siguiendo'
                : isEnglish
                  ? 'Follow'
                  : 'Seguir'}
            </button>
          )}
        </div>
        {isOwner && !isBlocked && (
          <div className="flex flex-wrap justify-end gap-1.75">
            {isConfirmingDelete ? (
              <>
                <button
                  type="button"
                  className="rounded-pill border-2 border-ink bg-accent px-2.25 py-1.5 text-caption font-black text-white"
                  onClick={() => deletePost(post.id)}
                >
                  {isEnglish ? 'Confirm' : 'Confirmar'}
                </button>
                <button
                  type="button"
                  className="rounded-pill border-2 border-ink bg-surface-warm px-2.25 py-1.5 text-caption font-black text-ink"
                  onClick={() => setIsConfirmingDelete(false)}
                >
                  {isEnglish ? 'Cancel' : 'Cancelar'}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="rounded-pill border-2 border-ink bg-surface-warm px-2.25 py-1.5 text-caption font-black text-ink"
                  onClick={() => {
                    setEditedBody(post.body)
                    setEditNotice('')
                    setIsEditing(true)
                  }}
                >
                  {isEnglish ? 'Edit' : 'Editar'}
                </button>
                <button
                  type="button"
                  className="rounded-pill border-2 border-ink bg-accent px-2.25 py-1.5 text-caption font-black text-white"
                  onClick={() => setIsConfirmingDelete(true)}
                >
                  {isEnglish ? 'Delete' : 'Eliminar'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="my-4.5 grid gap-2.5">
          <textarea
            value={editedBody}
            className="min-h-28.75 w-full resize-y rounded-field border-3 border-ink bg-white p-3.25 leading-normal font-bold text-ink"
            onChange={(event) => setEditedBody(event.target.value)}
            aria-label={isEnglish ? 'Edit post' : 'Editar publicación'}
          />
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="relative inline-flex min-h-10 items-center justify-center gap-3.5 rounded-full border-3 border-current bg-ink px-4.25 font-black text-white shadow-[0_7px_0_var(--button-drop)] [transition:transform_0.2s_ease,box-shadow_0.2s_ease] after:inline-grid after:size-7.5 after:flex-none after:place-items-center after:rounded-circle after:bg-white/18 after:text-lg after:leading-none after:content-['→'] after:[transition:transform_0.2s_ease] hover:transform-[translateY(-3px)_rotate(-1deg)] hover:after:transform-[translateX(3px)] active:transform-[translateY(4px)] active:shadow-none!"
              onClick={saveEdit}
            >
              {isEnglish ? 'Save' : 'Guardar'}
            </button>
            <button
              type="button"
              className="rounded-pill border-2 border-ink bg-surface-warm px-2.25 py-1.5 text-caption font-black text-ink"
              onClick={() => {
                setIsEditing(false)
                setEditedBody(post.body)
                setEditNotice('')
              }}
            >
              {isEnglish ? 'Cancel' : 'Cancelar'}
            </button>
          </div>
          <small aria-live="polite" className="min-h-4.25 font-extrabold text-[#9e3b28]">
            {editNotice}
          </small>
        </div>
      ) : (
        post.body && (
          <p className="mt-4.5 mb-4.5 leading-copy font-bold whitespace-pre-wrap">{post.body}</p>
        )
      )}
      {post.image && (
        <img
          src={post.image}
          alt={isEnglish ? `Photo shared by ${authorName}` : `Foto compartida por ${authorName}`}
          loading="lazy"
          decoding="async"
          className="block max-h-90 w-full rounded-control object-cover"
        />
      )}
      <div className="mt-4.5 flex flex-wrap items-center gap-3.5 border-t-2 border-dashed border-divider pt-3.5 text-small font-black">
        <button
          type="button"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-pill border-2 border-ink px-2.75 py-1.75 font-black disabled:cursor-not-allowed disabled:opacity-55',
            hasLiked ? 'bg-accent text-white' : 'bg-surface-warm text-ink'
          )}
          disabled={isBlocked}
          onClick={() => {
            if (isBlocked) return
            if (user) toggleLike(post.id)
            else navigate('/iniciar-sesion')
          }}
          aria-pressed={hasLiked}
        >
          <Heart className={cn('size-4', hasLiked && 'fill-current')} />
          {isEnglish ? 'Like' : 'Me gusta'} <span>{post.likedBy.length}</span>
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-pill border-2 border-ink bg-surface-warm px-2.75 py-1.75 font-black text-ink disabled:cursor-not-allowed disabled:opacity-55"
          disabled={isBlocked}
          onClick={() => {
            if (isBlocked) return
            if (user) commentInputRef.current?.focus()
            else navigate('/iniciar-sesion')
          }}
        >
          <MessageCircle className="size-4" />
          {isEnglish ? 'Comment' : 'Comentar'}
          <span>{post.comments.length}</span>
        </button>
        {author && authorHref && (
          <Link
            href={authorHref}
            className="ml-auto inline-flex items-center gap-1.5 rounded-pill border-2 border-ink bg-card px-2.75 py-1.75 font-black text-ink transition hover:bg-brand"
          >
            {isEnglish ? 'View profile' : 'Ver perfil'}
          </Link>
        )}
      </div>
      {post.comments.length > 0 && (
        <div className="mt-3.75 grid gap-2">
          {post.comments.map((item) => {
            const commentAuthor = profileForComment(item, profiles)
            const commentHref = commentAuthor
              ? commentAuthor.email === user?.email
                ? '/mi-perfil'
                : profilePath(commentAuthor.username)
              : null

            return (
              <div
                key={item.id}
                className="m-0 flex items-start gap-2 rounded-chip bg-surface-chip px-2.75 py-2.25 text-small font-bold"
              >
                {commentAuthor && commentHref ? (
                  <Link
                    href={commentHref}
                    className="inline-flex items-center gap-1.5"
                    aria-label={
                      isEnglish
                        ? `Open ${commentAuthor.name}'s profile`
                        : `Abrir el perfil de ${commentAuthor.name}`
                    }
                  >
                    <UserAvatar user={commentAuthor} className="size-7 flex-none border-2" />
                    <strong className="font-heading text-[16px]">{item.author}</strong>
                  </Link>
                ) : (
                  <strong className="font-heading text-[16px]">{item.author}</strong>
                )}
                <span>{item.body}</span>
              </div>
            )
          })}
        </div>
      )}
      {user && !isBlocked ? (
        <form
          className="mt-3.5 flex gap-2.25"
          onSubmit={(event) => {
            event.preventDefault()
            if (comment.trim()) {
              addComment(post.id, comment.trim())
              setComment('')
            }
          }}
        >
          <input
            ref={commentInputRef}
            className="min-h-10 min-w-0 flex-1 rounded-pill border-2 border-ink bg-white px-3 font-bold text-ink"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={isEnglish ? 'Write a comment…' : 'Escribe un comentario…'}
          />
          <button
            type="submit"
            className="rounded-pill border-0 bg-ink px-3.5 font-black text-white"
          >
            {isEnglish ? 'Comment' : 'Comentar'}
          </button>
        </form>
      ) : (
        <p className="mt-3.75 text-small font-extrabold">
          {isEnglish ? 'Like this story or want to reply? ' : '¿Te gustó o quieres responder? '}
          <Link href="/iniciar-sesion" className="underline">
            {isEnglish ? 'Join the pack' : 'Únete a la manada'}
          </Link>
          .
        </p>
      )}
    </article>
  )
}

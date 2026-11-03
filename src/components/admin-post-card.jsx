'use client'

import { useState } from 'react'

import { Paw } from '@/components/ui'
import { useCommunity } from '@/context/app-context'

export default function AdminPostCard({ post, allowManage = false }) {
  const { user, editPost, deletePost, toggleFollow, follows } = useCommunity()
  const likedBy = post.likedBy ?? []
  const comments = post.comments ?? []
  const [isEditing, setIsEditing] = useState(false)
  const [editedBody, setEditedBody] = useState(post.body ?? '')
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [message, setMessage] = useState('')
  const isOwner =
    !!user && (post.authorEmail ? post.authorEmail === user.email : post.author === user.name)
  const isFollowing = !!user && !!post.authorEmail && (follows?.[user.email] || []).includes(post.authorEmail)
  const canManage = allowManage && isOwner

  function saveEdit() {
    const nextBody = editedBody.trim()
    if (!nextBody) {
      setMessage('La publicación no puede quedar vacía.')
      return
    }
    editPost(post.id, nextBody)
    setMessage('')
    setIsEditing(false)
  }

  return (
    <article className="admin-guaubook-post">
      <div className="admin-guaubook-post-head">
        <span className="post-avatar">
          <Paw />
        </span>
        <div>
          <strong>{post.author}</strong>
          <small>{post.createdAt}</small>
        </div>
        {user && post.authorEmail && post.authorEmail !== user.email && (
          <button type="button" className="admin-follow-button" onClick={() => toggleFollow(post.authorEmail)}>
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
        )}
        <span>
          {likedBy.length} me encanta · {comments.length} comentarios
        </span>
      </div>

      {canManage && (
        <div className="admin-post-manage">
          {isConfirmingDelete ? (
            <>
              <span>¿Eliminar esta publicación?</span>
              <button type="button" className="is-danger" onClick={() => deletePost(post.id)}>
                Sí, eliminar
              </button>
              <button type="button" onClick={() => setIsConfirmingDelete(false)}>
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditedBody(post.body ?? '')
                  setMessage('')
                  setIsEditing(true)
                }}
              >
                Editar
              </button>
              <button
                type="button"
                className="is-danger"
                onClick={() => setIsConfirmingDelete(true)}
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      )}

      {isEditing ? (
        <div className="post-editor">
          <textarea
            value={editedBody}
            onChange={(event) => setEditedBody(event.target.value)}
            aria-label="Editar publicación"
          />
          <div>
            <button type="button" className="button button-dark" onClick={saveEdit}>
              Guardar
            </button>
            <button
              type="button"
              className="post-editor-cancel"
              onClick={() => {
                setIsEditing(false)
                setEditedBody(post.body ?? '')
                setMessage('')
              }}
            >
              Cancelar
            </button>
          </div>
          <small aria-live="polite">{message}</small>
        </div>
      ) : (
        post.body && <p>{post.body}</p>
      )}

      {post.image && <img src={post.image} alt="" />}

      {comments.length > 0 && (
        <div className="admin-guaubook-comments">
          {comments.map((comment) => (
            <p key={comment.id}>
              <strong>{comment.author}</strong>
              {comment.body}
            </p>
          ))}
        </div>
      )}
    </article>
  )
}

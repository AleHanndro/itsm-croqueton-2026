"use client";

import { useEffect, useRef, useState } from "react";

import { useLanguage, useTheme, useCommunity } from "@/context/app-context";
import Link, { useLocation, useNavigate } from "@/lib/navigation";
import { LanguageToggle, MayaTranslationNotice, ThemeToggle, Dog, Bowl, Cloud, Paw, PawColorButton, Logo, SiteNavigation, ArrowDown, StoryImage, MoodPollCard, MemePlaceholder, CareAvatar, SmallDogMascot } from "@/components/ui";
function PostCard({ post }) {
  const { language } = useLanguage();
  const { user, editPost, deletePost, toggleLike, addComment } = useCommunity();
  const navigate = useNavigate();
  const isEnglish = language === "en";
  const [comment, setComment] = useState("");
  const [editedBody, setEditedBody] = useState(post.body);
  const [editNotice, setEditNotice] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const commentInputRef = useRef(null);
  const hasLiked = !!user && post.likedBy.includes(user.email);
  const isOwner = !!user && (post.authorEmail ? post.authorEmail === user.email : post.author === user.name);
  function saveEdit() {
    const nextBody = editedBody.trim();
    if (!nextBody) {
      setEditNotice(isEnglish ? "The post cannot be empty." : "La publicaci\xF3n no puede quedar vac\xEDa.");
      return;
    }
    if (assessPostRelevance(nextBody, !!post.image) !== "approved") {
      setEditNotice(isEnglish ? "Add a clear reference to pets, adoption, animal health or care before saving." : "A\xF1ade una referencia clara a mascotas, adopci\xF3n, salud o cuidado animal antes de guardar.");
      return;
    }
    editPost(post.id, nextBody);
    setEditNotice("");
    setIsEditing(false);
  }
  return <article className="post-card">
      <div className="post-header">
        <div className="post-author"><span className="post-avatar"><Paw /></span><div><strong>{post.author}</strong><small>{post.createdAt}</small></div></div>
        {isOwner && <div className="post-owner-actions">
          {isConfirmingDelete ? <>
            <button type="button" className="is-danger" onClick={() => deletePost(post.id)}>{isEnglish ? "Confirm" : "Confirmar"}</button>
            <button type="button" onClick={() => setIsConfirmingDelete(false)}>{isEnglish ? "Cancel" : "Cancelar"}</button>
          </> : <>
            <button type="button" onClick={() => {
    setEditedBody(post.body);
    setEditNotice("");
    setIsEditing(true);
  }}>{isEnglish ? "Edit" : "Editar"}</button>
            <button type="button" className="is-danger" onClick={() => setIsConfirmingDelete(true)}>{isEnglish ? "Delete" : "Eliminar"}</button>
          </>}
        </div>}
      </div>
      {isEditing ? <div className="post-editor">
        <textarea value={editedBody} onChange={(event) => setEditedBody(event.target.value)} aria-label={isEnglish ? "Edit post" : "Editar publicaci\xF3n"} />
        <div>
          <button type="button" className="button button-dark" onClick={saveEdit}>{isEnglish ? "Save" : "Guardar"}</button>
          <button type="button" className="post-editor-cancel" onClick={() => {
    setIsEditing(false);
    setEditedBody(post.body);
    setEditNotice("");
  }}>{isEnglish ? "Cancel" : "Cancelar"}</button>
        </div>
        <small aria-live="polite">{editNotice}</small>
      </div> : <p>{post.body}</p>}
      {post.image && <img src={post.image} alt="" />}
      <div className="post-actions">
        <button type="button" className={hasLiked ? "is-liked" : ""} onClick={() => user ? toggleLike(post.id) : navigate("/iniciar-sesion")} aria-pressed={hasLiked}>
          {isEnglish ? "Love" : "Me encanta"} <span>{post.likedBy.length || ""}</span>
        </button>
        <button type="button" onClick={() => user ? commentInputRef.current?.focus() : navigate("/iniciar-sesion")}>
          {isEnglish ? "Comment" : "Comentar"}
        </button>
        <span>{post.comments.length ? `${post.comments.length} ${isEnglish ? "comments" : "comentarios"}` : ""}</span>
      </div>
      {post.comments.length > 0 && <div className="post-comments">{post.comments.map((item) => <p key={item.id}><strong>{item.author}</strong>{item.body}</p>)}</div>}
      {user ? <form className="comment-form" onSubmit={(event) => {
    event.preventDefault();
    if (comment.trim()) {
      addComment(post.id, comment.trim());
      setComment("");
    }
  }}><input ref={commentInputRef} value={comment} onChange={(event) => setComment(event.target.value)} placeholder={isEnglish ? "Write a comment\u2026" : "Escribe un comentario\u2026"} /><button type="submit">{isEnglish ? "Comment" : "Comentar"}</button></form> : <p className="post-login-note">{isEnglish ? "Love this story or want to reply? " : "\xBFTe encant\xF3 o quieres responder? "}<Link to="/iniciar-sesion">{isEnglish ? "Join the pack" : "\xDAnete a la manada"}</Link>.</p>}
    </article>;
}
export default PostCard;

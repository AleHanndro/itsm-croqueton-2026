"use client";

import { useState } from "react";

import { Paw } from "@/components/ui";
import { useCommunity } from "@/context/app-context";
import Link from "@/lib/navigation";
import AdminIcon from "@/components/admin-icon";

function AdminCommunityPage() {
  const { posts, postReviewRequests, approvePostReview, rejectPostReview, adminDeletePost } = useCommunity();
  const [deletingPostId, setDeletingPostId] = useState(null);
  return <section className="admin-main" id="comunidad">
      <div className="admin-welcome">
        <div><span className="eyebrow">Comunidad</span><h1>Modera y gestiona.</h1><p>Revisa el contenido pendiente y administra las publicaciones de GuauBook.</p></div>
        <div className="admin-status"><span /><div><strong>{postReviewRequests.length ? `${postReviewRequests.length} por revisar` : "Todo al día"}</strong><small>Cola de moderación de la comunidad</small></div></div>
      </div>

      <div className="admin-grid">
        <section className="admin-panel admin-review-panel" id="moderacion">
          <div className="admin-panel-heading"><div><span className="chapter">Cola de trabajo</span><h2>Moderación</h2><p>Contenido que necesita una decisión antes de publicarse.</p></div><span className="admin-count">{postReviewRequests.length}</span></div>
          {postReviewRequests.length ? <div className="admin-review-list">{postReviewRequests.map((request) => <article key={request.id} className="admin-review-item">
              <div className="admin-review-meta"><div className="admin-review-avatar"><Paw /></div><div><strong>{request.author}</strong><small>Enviado el {new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(new Date(request.requestedAt))}</small></div><span>Pendiente</span></div>
              <p>{request.body || "Publicación con contenido visual pendiente de revisión."}</p>
              {request.image && <img className="admin-review-image" src={request.image} alt={`Publicación de ${request.author}`} />}
              <div className="admin-review-actions"><button type="button" className="admin-approve" onClick={() => approvePostReview(request.id)}>Aprobar publicación</button><button type="button" onClick={() => rejectPostReview(request.id)}>Descartar</button></div>
            </article>)}</div> : <div className="admin-empty"><span><AdminIcon type="review" /></span><strong>La cola está al día</strong><p>No hay solicitudes pendientes. Aquí aparecerá el contenido que necesite revisión.</p></div>}
        </section>

        <aside className="admin-panel admin-activity">
          <div className="admin-panel-heading"><div><span className="chapter">Actividad reciente</span><h2>Comunidad</h2><p>Últimas publicaciones en GuauBook.</p></div></div>
          {posts.length ? <div className="admin-post-list">{posts.slice(0, 5).map((post) => <article key={post.id}>
              <span className="post-avatar"><Paw /></span>
              <div>
                <strong>{post.author}</strong>
                <small>{post.createdAt}</small>
                <p>{post.body || "Publicación con imagen"}</p>
                {post.image && <img className="admin-post-thumb" src={post.image} alt={`Publicación de ${post.author}`} />}
                <small>{post.likedBy?.length || 0} me encanta · {post.comments?.length || 0} comentarios</small>
              </div>
              {deletingPostId === post.id ? <div className="admin-delete-confirm"><span>¿Eliminar?</span><button type="button" onClick={() => {
    adminDeletePost(post.id);
    setDeletingPostId(null);
  }}>Sí</button><button type="button" onClick={() => setDeletingPostId(null)}>No</button></div> : <button type="button" onClick={() => setDeletingPostId(post.id)} aria-label={`Eliminar publicación de ${post.author}`}>Eliminar</button>}
            </article>)}</div> : <div className="admin-empty compact"><Paw /><strong>Aún no hay publicaciones</strong><p>La actividad de GuauBook aparecerá aquí.</p></div>}
          <Link className="admin-view-all" to="/admin/guaubook">Ver GuauBook <span>→</span></Link>
        </aside>
      </div>
    </section>;
}
export default AdminCommunityPage;

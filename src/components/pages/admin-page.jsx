"use client";

import { useCommunity } from "@/context/app-context";
import Link from "@/lib/navigation";
import AdminIcon from "@/components/admin-icon";

function AdminPage() {
  const { posts, postReviewRequests, joinApplications, accountCount, donationYears, adminLogs } = useCommunity();
  const pendingApplications = joinApplications.filter((item) => item.status === "pending").length;
  const totalReactions = posts.reduce((total, post) => total + post.likedBy.length + post.comments.length, 0);
  const totalDonations = donationYears.reduce((total, item) => total + item.donations.length, 0);
  const totalKibbleKg = donationYears.reduce((total, item) => total + item.donations.reduce((subtotal, donation) => subtotal + (donation.kibbleUnit === "g" ? Number(donation.kibbleAmount) / 1000 : Number(donation.kibbleAmount)), 0), 0);
  return <section className="admin-main" id="resumen">
      <div className="admin-welcome">
        <div><span className="eyebrow">Resumen general</span><h1>Buenos días, admin.</h1><p>Revisa la actividad de la comunidad y atiende lo importante desde un solo lugar.</p></div>
        <div className="admin-status"><span /><div><strong>Cuenta protegida</strong><small>Sesión activa como administrador</small></div></div>
      </div>

      {postReviewRequests.length > 0 && <Link className="admin-priority" to="/admin/comunidad"><span className="admin-priority-icon"><AdminIcon type="review" /></span><div><strong>Tienes {postReviewRequests.length} {postReviewRequests.length === 1 ? "publicación pendiente" : "publicaciones pendientes"} de moderación</strong><small>Revisa la foto y el texto antes de aprobarlas.</small></div><span className="admin-priority-action">Revisar ahora →</span></Link>}

      {pendingApplications > 0 && <Link className="admin-priority" to="/admin/solicitudes"><span className="admin-priority-icon"><AdminIcon type="users" /></span><div><strong>Tienes {pendingApplications} {pendingApplications === 1 ? "solicitud de unirse pendiente" : "solicitudes de unirse pendientes"}</strong><small>Acepta o rechaza a quienes quieren unirse a la manada.</small></div><span className="admin-priority-action">Ver solicitudes →</span></Link>}

      <section className="admin-stats" aria-label="Resumen de la comunidad">
        <article><span className="admin-stat-icon coral"><AdminIcon type="posts" /></span><div><small>Publicaciones</small><strong>{posts.length}</strong><span>contenido publicado</span></div></article>
        <article><span className="admin-stat-icon yellow"><AdminIcon type="review" /></span><div><small>Por revisar</small><strong>{postReviewRequests.length}</strong><span>{postReviewRequests.length ? "requieren atención" : "todo al día"}</span></div></article>
        <article><span className="admin-stat-icon blue"><AdminIcon type="users" /></span><div><small>Miembros</small><strong>{accountCount}</strong><span>cuentas registradas</span></div></article>
        <article><span className="admin-stat-icon green"><AdminIcon type="heart" /></span><div><small>Interacciones</small><strong>{totalReactions}</strong><span>reacciones totales</span></div></article>
      </section>

      <div className="admin-grid admin-shortcuts">
        <Link className="admin-panel admin-shortcut" to="/admin/comunidad">
          <span className="admin-shortcut-icon yellow"><AdminIcon type="posts" /></span>
          <div><span className="chapter">Comunidad</span><strong>{posts.length} publicaciones</strong><p>{postReviewRequests.length ? `${postReviewRequests.length} ${postReviewRequests.length === 1 ? "solicitud pendiente" : "solicitudes pendientes"} de revisión.` : "Todo revisado y al día."}</p></div>
          <span className="admin-shortcut-arrow">→</span>
        </Link>
        <Link className="admin-panel admin-shortcut" to="/admin/donaciones">
          <span className="admin-shortcut-icon green"><AdminIcon type="donation" /></span>
          <div><span className="chapter">Donaciones</span><strong>{totalDonations} {totalDonations === 1 ? "registro" : "registros"}</strong><p>{totalKibbleKg.toLocaleString("es-MX", { maximumFractionDigits: 2 })} kg de croquetas acumulados.</p></div>
          <span className="admin-shortcut-arrow">→</span>
        </Link>
        <Link className="admin-panel admin-shortcut" to="/admin/solicitudes">
          <span className="admin-shortcut-icon blue"><AdminIcon type="review" /></span>
          <div><span className="chapter">Solicitudes</span><strong>{pendingApplications} {pendingApplications === 1 ? "pendiente" : "pendientes"}</strong><p>Formularios de Unirme por revisar.</p></div>
          <span className="admin-shortcut-arrow">→</span>
        </Link>
        <Link className="admin-panel admin-shortcut" to="/admin/administradores">
          <span className="admin-shortcut-icon coral"><AdminIcon type="users" /></span>
          <div><span className="chapter">Equipo</span><strong>Administradores</strong><p>Crea y gestiona accesos al panel.</p></div>
          <span className="admin-shortcut-arrow">→</span>
        </Link>
        <Link className="admin-panel admin-shortcut" to="/admin/bitacora">
          <span className="admin-shortcut-icon blue"><AdminIcon type="clock" /></span>
          <div><span className="chapter">Auditoría</span><strong>{adminLogs.length} {adminLogs.length === 1 ? "movimiento" : "movimientos"}</strong><p>Consulta qué han hecho los administradores.</p></div>
          <span className="admin-shortcut-arrow">→</span>
        </Link>
      </div>
    </section>;
}
export default AdminPage;

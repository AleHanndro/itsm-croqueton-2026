"use client";

import { Paw } from "@/components/ui";
import { useCommunity } from "@/context/app-context";
import AdminIcon from "@/components/admin-icon";

function formatDate(value) {
  return new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value)
  );
}

function AdminApplicationsPage() {
  const { joinApplications, approveJoinApplication, rejectJoinApplication } = useCommunity();
  const pending = joinApplications.filter((item) => item.status === "pending");
  const resolved = joinApplications.filter((item) => item.status !== "pending");

  return (
    <section className="admin-main" id="solicitudes">
      <div className="admin-welcome">
        <div>
          <span className="eyebrow">Solicitudes</span>
          <h1>Únete a la manada.</h1>
          <p>Revisa las solicitudes de voluntariado y decide quién se une al equipo.</p>
        </div>
        <div className="admin-status">
          <span />
          <div>
            <strong>
              {pending.length} {pending.length === 1 ? "pendiente" : "pendientes"}
            </strong>
            <small>Solicitudes recibidas desde el formulario de Unirme</small>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        <section className="admin-panel admin-review-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="chapter">Por revisar</span>
              <h2>Solicitudes pendientes</h2>
              <p>Aprueba o rechaza cada solicitud de la comunidad.</p>
            </div>
            <span className="admin-count">{pending.length}</span>
          </div>
          {pending.length ? (
            <div className="admin-review-list">
              {pending.map((application) => (
                <article key={application.id} className="admin-review-item">
                  <div className="admin-review-meta">
                    <div className="admin-review-avatar">
                      <Paw />
                    </div>
                    <div>
                      <strong>{application.name}</strong>
                      <small>
                        {application.email} · {formatDate(application.createdAt)}
                      </small>
                    </div>
                    <span>Pendiente</span>
                  </div>
                  <p>{application.motivation}</p>
                  <dl className="admin-application-details">
                    <div>
                      <dt>Edad</dt>
                      <dd>{application.age} años</dd>
                    </div>
                    <div>
                      <dt>Disponibilidad</dt>
                      <dd>{application.hasAvailability ? "Sí" : "No"}</dd>
                    </div>
                    <div>
                      <dt>Compromiso</dt>
                      <dd>{application.acceptsCommitment ? "Aceptado" : "No"}</dd>
                    </div>
                  </dl>
                  <div className="admin-review-actions">
                    <button
                      type="button"
                      className="admin-approve"
                      onClick={() => approveJoinApplication(application.id)}
                    >
                      Aceptar solicitud
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectJoinApplication(application.id)}
                    >
                      Rechazar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty">
              <span>
                <AdminIcon type="review" />
              </span>
              <strong>Sin solicitudes pendientes</strong>
              <p>
                Cuando alguien envíe el formulario de Unirme, su solicitud aparecerá aquí.
              </p>
            </div>
          )}
        </section>

        <aside className="admin-panel admin-activity">
          <div className="admin-panel-heading">
            <div>
              <span className="chapter">Historial</span>
              <h2>Revisadas</h2>
              <p>Solicitudes aceptadas o rechazadas.</p>
            </div>
          </div>
          {resolved.length ? (
            <div className="admin-application-list">
              {resolved.map((application) => (
                <article key={application.id}>
                  <span className="post-avatar">
                    <Paw />
                  </span>
                  <div>
                    <strong>{application.name}</strong>
                    <small>
                      {application.email} · {formatDate(application.createdAt)}
                    </small>
                    <span className={`admin-application-status is-${application.status}`}>
                      {application.status === "approved" ? "Aceptada" : "Rechazada"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty compact">
              <Paw />
              <strong>Aún no hay historial</strong>
              <p>Las solicitudes revisadas aparecerán aquí.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default AdminApplicationsPage;

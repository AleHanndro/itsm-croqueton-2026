"use client";

import { useState } from "react";

import AdminIcon from "@/components/admin-icon";
import { useCommunity } from "@/context/app-context";

const LOG_TYPES = {
  "post-approved": { label: "Publicación aprobada", category: "posts", icon: "posts" },
  "post-rejected": { label: "Publicación rechazada", category: "posts", icon: "posts" },
  "post-deleted": { label: "Publicación eliminada", category: "posts", icon: "posts" },
  "application-approved": { label: "Solicitud aprobada", category: "applications", icon: "users" },
  "application-rejected": { label: "Solicitud rechazada", category: "applications", icon: "users" },
  "donation-year-added": { label: "Año de donaciones agregado", category: "donations", icon: "donation" },
  "donation-added": { label: "Donación registrada", category: "donations", icon: "donation" },
  "donation-deleted": { label: "Donación eliminada", category: "donations", icon: "donation" },
  "admin-created": { label: "Administrador creado", category: "admins", icon: "users" },
  "admin-removed": { label: "Acceso retirado", category: "admins", icon: "users" }
};

const FILTERS = [
  { id: "all", label: "Todas las acciones" },
  { id: "posts", label: "Publicaciones" },
  { id: "applications", label: "Solicitudes" },
  { id: "donations", label: "Donaciones" },
  { id: "admins", label: "Equipo" }
];

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short"
});

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Fecha desconocida" : dateFormatter.format(date);
}

export default function AdminLogsPage() {
  const { adminLogs } = useCommunity();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim().toLowerCase();
  const visibleLogs = adminLogs.filter((log) => {
    const meta = LOG_TYPES[log.type];
    if (filter !== "all" && meta?.category !== filter) return false;
    if (!normalizedSearch) return true;
    return [meta?.label, log.detail, log.actor, log.actorEmail]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);
  });

  const countByCategory = (category) => {
    if (category === "all") return adminLogs.length;
    return adminLogs.filter((log) => LOG_TYPES[log.type]?.category === category).length;
  };

  return (
    <section className="admin-main" id="bitacora">
      <div className="admin-welcome">
        <div>
          <span className="eyebrow">Auditoría</span>
          <h1>Bitácora.</h1>
          <p>
            Registro de las acciones realizadas por los administradores: aprobaciones,
            rechazos, eliminaciones y cambios del equipo.
          </p>
        </div>
        <div className="admin-status">
          <span />
          <div>
            <strong>
              {adminLogs.length} {adminLogs.length === 1 ? "movimiento" : "movimientos"}
            </strong>
            <small>Solo visible para administradores</small>
          </div>
        </div>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <span className="chapter">Historial</span>
            <h2>Movimientos recientes</h2>
            <p>Se conservan los últimos 250 registros de actividad administrativa.</p>
          </div>
          <span className="admin-count">{visibleLogs.length}</span>
        </div>

        <div className="admin-log-toolbar">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por administrador, acción o detalle..."
            aria-label="Buscar en la bitácora"
          />
          <label className="admin-log-select">
            <span>Filtrar</span>
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              {FILTERS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} ({countByCategory(item.id)})
                </option>
              ))}
            </select>
          </label>
          <span className="admin-log-count">
            {visibleLogs.length} de {adminLogs.length}
          </span>
        </div>

        <div className="admin-log-list">
          {visibleLogs.length === 0 ? (
            <div className="admin-empty compact">
              <AdminIcon type="clock" />
              <strong>{adminLogs.length ? "Sin resultados" : "Aún no hay movimientos"}</strong>
              <p>
                {adminLogs.length
                  ? "Prueba con otra búsqueda o cambia el filtro."
                  : "Las acciones de los administradores aparecerán aquí automáticamente."}
              </p>
            </div>
          ) : (
            visibleLogs.map((log) => {
              const meta = LOG_TYPES[log.type] || {
                label: "Movimiento administrativo",
                category: "admins",
                icon: "clock"
              };
              return (
                <article className="admin-log-item" key={log.id}>
                  <span className={`admin-log-icon is-${meta.category}`}>
                    <AdminIcon type={meta.icon} />
                  </span>
                  <div>
                    <strong>{meta.label}</strong>
                    <p>{log.detail}</p>
                    <small>
                      {log.actor || "Administrador"} · {formatDate(log.createdAt)}
                    </small>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </section>
  );
}

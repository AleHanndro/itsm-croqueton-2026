"use client";

import { useState } from "react";

import { Paw } from "@/components/ui";
import { useCommunity } from "@/context/app-context";

const emptyDraft = { name: "", email: "", password: "" };

function AdminAdminsPage() {
  const { admins, profiles, user, createAdmin, removeAdmin } = useCommunity();
  const [draft, setDraft] = useState(emptyDraft);
  const [message, setMessage] = useState({ type: "", text: "" });

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const result = createAdmin({
      name: draft.name,
      email: draft.email,
      password: draft.password
    });
    if (!result?.ok) {
      setMessage({ type: "error", text: result?.error || "No se pudo crear el administrador." });
      return;
    }
    setDraft(emptyDraft);
    setMessage({ type: "success", text: "Administrador creado correctamente." });
  }

  function handleRemove(email) {
    const result = removeAdmin(email);
    setMessage(
      result?.ok
        ? { type: "success", text: "Acceso de administrador retirado." }
        : { type: "error", text: result?.error || "No se pudo retirar el acceso." }
    );
  }

  return (
    <section className="admin-main" id="administradores">
      <div className="admin-welcome">
        <div>
          <span className="eyebrow">Equipo</span>
          <h1>Administradores.</h1>
          <p>Crea nuevas cuentas de administración y revisa quién puede gestionar la comunidad.</p>
        </div>
        <div className="admin-status">
          <span />
          <div>
            <strong>
              {admins.length} {admins.length === 1 ? "administrador" : "administradores"}
            </strong>
            <small>Acceso completo al panel</small>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="chapter">Nuevo acceso</span>
              <h2>Crear administrador</h2>
              <p>La cuenta tendrá acceso a moderación, solicitudes y donaciones.</p>
            </div>
            <span className="admin-count">+</span>
          </div>
          <form className="admin-donation-form" onSubmit={submit}>
            <div className="admin-form-grid">
              <label>
                <span>Nombre</span>
                <input
                  value={draft.name}
                  onChange={(event) => updateDraft("name", event.target.value)}
                  required
                  maxLength={60}
                  placeholder="Nombre del administrador"
                />
              </label>
              <label>
                <span>Correo electrónico</span>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(event) => updateDraft("email", event.target.value)}
                  required
                  placeholder="admin@croqueton.mx"
                />
              </label>
              <label>
                <span>Contraseña</span>
                <input
                  type="password"
                  value={draft.password}
                  onChange={(event) => updateDraft("password", event.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                />
              </label>
            </div>
            <div className="admin-form-actions">
              <button className="admin-approve" type="submit">
                Crear administrador
              </button>
            </div>
            {message.text && (
              <small
                className={`admin-settings-message ${message.type === "error" ? "is-error" : "is-success"}`}
                role="status"
              >
                {message.text}
              </small>
            )}
          </form>
        </section>

        <aside className="admin-panel admin-activity">
          <div className="admin-panel-heading">
            <div>
              <span className="chapter">Equipo actual</span>
              <h2>Administradores</h2>
              <p>Personas con acceso al panel.</p>
            </div>
            <span className="admin-count">{admins.length}</span>
          </div>
          <div className="admin-post-list">
            {admins.map((email) => {
              const profile = profiles[email];
              const isMain = email === "admin@croqueton.mx";
              const isSelf = email === user?.email;
              return (
                <article key={email}>
                  <span className="post-avatar">
                    <Paw />
                  </span>
                  <div>
                    <strong>{profile?.name || email.split("@")[0]}</strong>
                    <small>{email}</small>
                    <small>{isMain ? "Administrador principal" : isSelf ? "Tú" : "Administrador"}</small>
                  </div>
                  {!isMain && !isSelf && (
                    <button type="button" onClick={() => handleRemove(email)}>
                      Quitar acceso
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default AdminAdminsPage;

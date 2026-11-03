/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

import { LanguageToggle, ThemeToggle, Paw } from "@/components/ui";
import { useCommunity } from "@/context/app-context";
import Link, { useLocation, useNavigate } from "@/lib/navigation";
import CommunityNavigation from "@/components/community-navigation";
import AdminIcon from "@/components/admin-icon";

const adminNav = [
  { href: "/admin", label: "Resumen", icon: "heart" },
  { href: "/admin/comunidad", label: "Comunidad", icon: "posts", badge: "moderation" },
  { href: "/admin/solicitudes", label: "Solicitudes", icon: "review", badge: "applications" },
  { href: "/admin/donaciones", label: "Donaciones", icon: "donation" },
  { href: "/admin/administradores", label: "Administradores", icon: "users" },
  { href: "/admin/bitacora", label: "Bitácora", icon: "clock" },
  { href: "/admin/generaciones", label: "Generaciones", icon: "posts" },
  { href: "/admin/guaubook", label: "Ver GuauBook", icon: "users" }
];

export default function AdminShell({ children }) {
  const { user, postReviewRequests, joinApplications, isAdmin, signOut } = useCommunity();
  const pendingApplications = joinApplications.filter((item) => item.status === "pending").length;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long" }).format(new Date()));
  }, []);
  if (!isAdmin) {
    return <main className="community-page"><CommunityNavigation /><section className="admin-access container"><Paw /><span className="eyebrow">Acceso restringido</span><h1>Panel de administración</h1><p>Ingresa como administrador para gestionar la comunidad.</p><Link className="button button-dark" to="/login">Iniciar sesión</Link></section></main>;
  }
  return <main className="admin-page">
      <LanguageToggle /><ThemeToggle />
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <Link to="/" className="logo admin-brand" aria-label="Croquetón"><span className="logo-mark"><Paw /></span><span>Croquetón</span></Link>
          <div className="admin-role">Administrador</div>
          <nav className="admin-menu" aria-label="Navegación del panel">
            {adminNav.map((item) => <Link key={item.href} to={item.href} className={pathname === item.href ? "is-active" : ""}>
                <AdminIcon type={item.icon} /><span>{item.label}</span>
                {item.badge === "moderation" && postReviewRequests.length > 0 && <strong>{postReviewRequests.length}</strong>}
                {item.badge === "applications" && pendingApplications > 0 && <strong>{pendingApplications}</strong>}
              </Link>)}
          </nav>
          <div className="admin-account">
            <span className="admin-avatar">A</span>
            <div><strong>Admin Croquetón</strong><small>{user.email}</small></div>
          </div>
          <button className="admin-signout" type="button" onClick={() => {
    signOut();
    navigate("/");
  }}>Cerrar sesión</button>
        </aside>

        <div className="admin-workspace">
          <header className="admin-topbar">
            <div><span>Panel de administración</span><small>{today}</small></div>
          </header>
          {children}
        </div>
      </div>
    </main>;
}

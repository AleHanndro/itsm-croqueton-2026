/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

import { LanguageToggle, ThemeToggle, Paw } from "@/components/ui";
import { useCommunity } from "@/context/app-context";
import Link, { useLocation, useNavigate } from "@/lib/navigation";
import CommunityNavigation from "@/components/community-navigation";
import AdminIcon from "@/components/admin-icon";

const userNav = [
  { href: "/mi-panel", label: "Mi panel", icon: "user" },
  { href: "/mi-panel#mis-publicaciones", label: "Mis publicaciones", icon: "posts" },
  { href: "/mi-panel/avatar", label: "Mi avatar", icon: "edit" },
  { href: "/mi-panel/guaubook", label: "Ver GuauBook", icon: "users" }
];

function initials(name) {
  return String(name || "")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UserShell({ children }) {
  const { user, signOut } = useCommunity();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long" }).format(new Date()));
  }, []);
  if (!user) {
    return <main className="community-page"><CommunityNavigation /><section className="admin-access container"><Paw /><span className="eyebrow">Acceso restringido</span><h1>Mi panel</h1><p>Inicia sesión para ver tus publicaciones y personalizar tu avatar.</p><Link className="button button-dark" to="/login">Iniciar sesión</Link></section></main>;
  }
  return <main className="admin-page">
      <LanguageToggle /><ThemeToggle />
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <Link to="/" className="logo admin-brand" aria-label="Croquetón"><span className="logo-mark"><Paw /></span><span>Croquetón</span></Link>
          <div className="admin-role">Mi cuenta</div>
          <nav className="admin-menu" aria-label="Navegación de mi panel">
            {userNav.map((item) => <Link key={item.href} to={item.href} className={pathname === item.href ? "is-active" : ""}>
                <AdminIcon type={item.icon} /><span>{item.label}</span>
              </Link>)}
          </nav>
          <div className="admin-account">
            <span className="admin-avatar">{initials(user.name)}</span>
            <div><strong>{user.name}</strong><small>{user.email}</small></div>
          </div>
          <button className="admin-signout" type="button" onClick={() => {
    signOut();
    navigate("/");
  }}>Cerrar sesión</button>
        </aside>

        <div className="admin-workspace">
          <header className="admin-topbar">
            <div><span>Mi panel</span><small>{today}</small></div>
          </header>
          {children}
        </div>
      </div>
    </main>;
}

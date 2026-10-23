"use client";

import { useEffect, useRef, useState } from "react";

import { useLanguage, useTheme, useCommunity } from "@/context/app-context";
import Link, { useLocation, useNavigate } from "@/lib/navigation";
import { Paw } from "@/components/ui";
function CommunityNavigation() {
  const { language } = useLanguage();
  const { user, signOut } = useCommunity();
  const navigate = useNavigate();
  const isEnglish = language === "en";
  return <>
      <header className="community-header">
        <div className="container community-nav">
          <Link to="/" className="logo" aria-label="Croquetón">
            <span className="logo-mark"><Paw /></span><span>Croquetón</span>
          </Link>
          <nav aria-label={isEnglish ? "Community navigation" : "Navegaci\xF3n de la comunidad"}>
            <Link to="/guaubook">{isEnglish ? "GuauBook" : "GuauBook"}</Link>
            <Link to="/mi-perfil">{isEnglish ? "My profile" : "Mi perfil"}</Link>
            <Link to="/avatar-mascota">{isEnglish ? "Avatar & pet" : "Avatar y mascota"}</Link>
          </nav>
          {user && <button className="community-logout" type="button" onClick={() => {
    signOut();
    navigate("/");
  }}>{isEnglish ? "Sign out" : "Cerrar sesi\xF3n"}</button>}
        </div>
      </header>
      <div className="community-nav-spacer" aria-hidden="true" />
    </>;
}
export default CommunityNavigation;

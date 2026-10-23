"use client";

import { useEffect, useRef, useState } from "react";

import { LanguageToggle, MayaTranslationNotice, ThemeToggle, Dog, Bowl, Cloud, Paw, PawColorButton, Logo, SiteNavigation, ArrowDown, StoryImage, MoodPollCard, MemePlaceholder, CareAvatar, SmallDogMascot } from "@/components/ui";
import { chapterOneImage, chapterTwoImage, chapterThreeImage, chapterFourImage, chapterFiveImage, chapterSixImage, goalImage, errorDogImage, rejectedApplicationImage, heroDogImage, donationMemeImage, chooseFoodImage, eventDeliveryImage, checkDateImage, packAccessDogImage, recruitmentDogImage, packGenerationImage } from "@/lib/images";
import { dogFacts, dogFactsEn, normalizePostText, assessPostRelevance } from "@/lib/content";
import { useLanguage, useTheme, useCommunity } from "@/context/app-context";
import Link, { useLocation, useNavigate } from "@/lib/navigation";
function LoginPage() {
  const { language } = useLanguage();
  const { signIn, createAccount } = useCommunity();
  const isEnglish = language === "en";
  const navigate = useNavigate();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const requestAccess = (event) => {
    event.preventDefault();
    if (signIn(email, password)) {
      setLoginFailed(false);
      setLoginMessage("");
      navigate(email.trim().toLowerCase() === "admin@croqueton.mx" ? "/admin" : "/guaubook");
      return;
    }
    setLoginFailed(true);
    setLoginMessage(isEnglish ? "Wrong password. The dog has already started laughing." : "Contrase\xF1a incorrecta. El perrito ya empez\xF3 a re\xEDrse.");
  };
  const requestAccount = (event) => {
    event.preventDefault();
    if (email.includes("@") && password.length >= 6 && createAccount(email, password)) {
      navigate("/mi-perfil");
      return;
    }
    setLoginFailed(true);
    setLoginMessage(isEnglish ? "Use an unused email and a password with at least 6 characters." : "Usa un correo que no exista y una contrase\xF1a de al menos 6 caracteres.");
  };
  return <main className="login-page">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-heading-row">
          <figure className="login-pack-image"><img src={packAccessDogImage} alt={isEnglish ? "Puppy dressed for the pack" : "Cachorro vestido para la manada"} /></figure>
          <div>
            <span className="chapter">{isEnglish ? "Pack access" : "Acceso de la manada"}</span>
            <h1 id="login-title">{isCreatingAccount ? isEnglish ? "Create your" : "Crea tu" : isEnglish ? "Welcome" : "Bienvenido"}<br /><span>{isCreatingAccount ? isEnglish ? "account." : "cuenta." : isEnglish ? "back." : "de vuelta."}</span></h1>
          </div>
        </div>
        <p>{isCreatingAccount ? isEnglish ? "Join GuauBook, customize your profile and share moments with the pack." : "\xDAnete a GuauBook, personaliza tu perfil y comparte momentos con la manada." : isEnglish ? "Enter to see what the Croquet\xF3n pack is sharing." : "Entra para ver lo que comparte la manada Croquet\xF3n."}</p>
        <form className="login-form" onSubmit={isCreatingAccount ? requestAccount : requestAccess}>
          <label>
            <span>{isEnglish ? "Email" : "Correo electr\xF3nico"}</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="tu@correo.com" />
          </label>
          <label>
            <span>{isEnglish ? "Password" : "Contrase\xF1a"}</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isCreatingAccount ? "new-password" : "current-password"} minLength={isCreatingAccount ? 6 : void 0} placeholder="••••••••" />
          </label>
          <button className="button button-dark" type="submit">{isCreatingAccount ? isEnglish ? "Create my account" : "Crear mi cuenta" : isEnglish ? "Sign in" : "Iniciar sesi\xF3n"}</button>
          {!isCreatingAccount && <small className="login-demo-hint">{isEnglish ? "Demo: admin@croqueton.mx \xB7 croqueton2026" : "Demo: admin@croqueton.mx \xB7 croqueton2026"}</small>}
          <button className="login-create-account" type="button" onClick={() => {
    setIsCreatingAccount((current) => !current);
    setLoginFailed(false);
    setLoginMessage("");
  }}>{isCreatingAccount ? isEnglish ? "I already have an account" : "Ya tengo una cuenta" : isEnglish ? "Create my account" : "Crear mi cuenta"}</button>
          <small aria-live="polite">{loginMessage || (isCreatingAccount ? isEnglish ? "Your password must have at least 6 characters." : "Tu contrase\xF1a debe tener al menos 6 caracteres." : isEnglish ? "Use your email and password to continue." : "Usa tu correo y contrase\xF1a para continuar.")}</small>
        </form>
        {loginFailed && <figure className="login-error-meme">
            <img src={errorDogImage} alt={isEnglish ? "Puppy laughing at the wrong password" : "Perrito ri\xE9ndose por la contrase\xF1a incorrecta"} />
            <figcaption>{isEnglish ? "Nice try, human." : "Buen intento, humano."}</figcaption>
          </figure>}
      </section>
    </main>;
}
export default LoginPage;

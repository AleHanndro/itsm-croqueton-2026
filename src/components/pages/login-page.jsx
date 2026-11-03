"use client";

import { useState } from "react";

import { LanguageToggle, ThemeToggle, Paw, SiteNavigation } from "@/components/ui";
import { errorDogImage, packAccessDogImage } from "@/lib/images";
import { useLanguage, useCommunity } from "@/context/app-context";
import { useNavigate } from "@/lib/navigation";

function LoginPage() {
  const { language } = useLanguage();
  const { signIn, createAccount, admins } = useCommunity();
  const isEnglish = language === "en";
  const navigate = useNavigate();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const requestAccess = (event) => {
    event.preventDefault();
    if (isCreatingAccount) {
      if (email.includes("@") && password.length >= 6 && createAccount(email, password, remember)) {
        setLoginFailed(false);
        setLoginMessage("");
        navigate("/mi-panel");
        return;
      }
      setLoginFailed(true);
      setLoginMessage(isEnglish ? "Use an unused email and a password with at least 6 characters." : "Usa un correo que no exista y una contrase\xF1a de al menos 6 caracteres.");
      return;
    }
    if (signIn(email, password, remember)) {
      setLoginFailed(false);
      setLoginMessage("");
      navigate(admins.includes(email.trim().toLowerCase()) ? "/admin" : "/mi-panel");
      return;
    }
    setLoginFailed(true);
    setLoginMessage(isEnglish ? "Wrong email or password. The dog has already started laughing." : "Correo o contrase\xF1a incorrectos. El perrito ya empez\xF3 a re\xEDrse.");
  };
  const toggleMode = () => {
    setIsCreatingAccount((current) => !current);
    setLoginFailed(false);
    setLoginMessage("");
  };
  const chapter = isCreatingAccount ? isEnglish ? "New account" : "Nueva cuenta" : isEnglish ? "Account access" : "Acceso a tu cuenta";
  const description = isCreatingAccount ? isEnglish ? "Join GuauBook, customize your profile and share moments with the pack." : "\xDAnete a GuauBook, personaliza tu perfil y comparte momentos con la manada." : isEnglish ? "Sign in to access your panel, publish and comment on GuauBook. Admins use this same login." : "Entra para acceder a tu panel, publicar y comentar en GuauBook. Los administradores usan este mismo login.";
  const submitLabel = isCreatingAccount ? isEnglish ? "Create my account" : "Crear mi cuenta" : isEnglish ? "Sign in" : "Iniciar sesi\xF3n";
  const defaultMessage = isCreatingAccount ? isEnglish ? "Your password must have at least 6 characters." : "Tu contrase\xF1a debe tener al menos 6 caracteres." : isEnglish ? "Use your email and password to continue." : "Usa tu correo y contrase\xF1a para continuar.";
  return <main className="login-page">
      <LanguageToggle />
      <ThemeToggle />
      <SiteNavigation />
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-heading-row">
          <figure className="login-pack-image"><img src={packAccessDogImage} alt={isEnglish ? "Puppy dressed for the pack" : "Cachorro vestido para la manada"} /></figure>
          <div>
            <span className="chapter">{chapter}</span>
            <h1 id="login-title">{isCreatingAccount ? isEnglish ? "Sign up" : "Reg\xEDstrate" : "Login"}<span>.</span></h1>
          </div>
        </div>
        <p>{description}</p>
        <form className="login-form" onSubmit={requestAccess}>
          <label>
            <span>{isEnglish ? "Email" : "Correo electr\xF3nico"}</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="tu@correo.com" required />
          </label>
          <label>
            <span>{isEnglish ? "Password" : "Contrase\xF1a"}</span>
            <div className="login-password-field">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isCreatingAccount ? "new-password" : "current-password"} placeholder="••••••••" required />
              <button type="button" className="login-password-toggle" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? isEnglish ? "Hide password" : "Ocultar contrase\xF1a" : isEnglish ? "Show password" : "Mostrar contrase\xF1a"} aria-pressed={showPassword} title={showPassword ? isEnglish ? "Hide password" : "Ocultar contrase\xF1a" : isEnglish ? "Show password" : "Mostrar contrase\xF1a"}>
                {showPassword ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.5 10.5 0 0112 5c5 0 9 4.5 9 7a9.3 9.3 0 01-2.2 3.5M6.3 6.3A11 11 0 003 12c0 2.5 4 7 9 7a9.7 9.7 0 004.2-.9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12c0-2.5 4-7 9-7s9 4.5 9 7-4 7-9 7-9-4.5-9-7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" /></svg>}
              </button>
            </div>
          </label>
          <div className="login-options">
            <button type="button" className={`login-remember ${remember ? "is-on" : ""}`} role="switch" aria-checked={remember} onClick={() => setRemember((current) => !current)}>
              <span className="login-remember-track"><span /></span>
              <span>{isEnglish ? "Remember me" : "Recordarme"}</span>
            </button>
          </div>
          <button className="button button-dark login-submit" type="submit"><Paw />{submitLabel}</button>
          <button className="login-create-account" type="button" onClick={toggleMode}>{isCreatingAccount ? isEnglish ? "I already have an account" : "Ya tengo una cuenta" : isEnglish ? "Create my account" : "Crear mi cuenta"}</button>
          <small aria-live="polite">{loginMessage || defaultMessage}</small>
        </form>
        {loginFailed && <figure className="login-error-meme">
            <img src={errorDogImage} alt={isEnglish ? "Puppy laughing at the wrong password" : "Perrito ri\xE9ndose por la contrase\xF1a incorrecta"} />
            <figcaption>{isEnglish ? "Nice try, human." : "Buen intento, humano."}</figcaption>
          </figure>}
      </section>
    </main>;
}
export default LoginPage;

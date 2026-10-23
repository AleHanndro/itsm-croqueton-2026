/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext({ language: "es", setLanguage: () => void 0 });
const ThemeContext = createContext({ theme: "light", setTheme: () => void 0 });
const CommunityContext = createContext(null);
function useLanguage() {
  return useContext(LanguageContext);
}
function useTheme() {
  return useContext(ThemeContext);
}
function useCommunity() {
  const community = useContext(CommunityContext);
  if (!community) throw new Error("Community provider is missing");
  return community;
}

function AppProviders({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [language, setLanguage] = useState("es");
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState({ "admin@croqueton.mx": "croqueton2026" });
  const [petFurColor, setPetFurColor] = useState("#efc88f");
  const [posts, setPosts] = useState([]);
  const [postReviewRequests, setPostReviewRequests] = useState([]);

  useEffect(() => {
    const savedLanguage = readStorage("croqueton-language");
    if (savedLanguage === "en" || savedLanguage === "maya" || savedLanguage === "es") setLanguage(savedLanguage);

    const savedTheme = readStorage("croqueton-theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");

    const savedUser = readStorage("croqueton-user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedAccounts = readStorage("croqueton-accounts");
    if (savedAccounts) setAccounts((current) => ({ ...current, ...JSON.parse(savedAccounts) }));

    const savedPetFurColor = readStorage("croqueton-pet-color");
    if (savedPetFurColor) setPetFurColor(savedPetFurColor);

    const savedPosts = readStorage("croqueton-posts");
    if (savedPosts) setPosts(JSON.parse(savedPosts));

    const savedRequests = readStorage("croqueton-post-review-requests");
    if (savedRequests) setPostReviewRequests(JSON.parse(savedRequests));

    setIsHydrated(true);
  }, []);
  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem("croqueton-language", language);
    document.documentElement.lang = language === "maya" ? "yua" : language;
  }, [language, isHydrated]);
  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem("croqueton-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme, isHydrated]);
  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem("croqueton-user", JSON.stringify(user));
  }, [user, isHydrated]);
  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem("croqueton-accounts", JSON.stringify(accounts));
  }, [accounts, isHydrated]);
  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem("croqueton-pet-color", petFurColor);
  }, [petFurColor, isHydrated]);
  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem("croqueton-posts", JSON.stringify(posts));
  }, [posts, isHydrated]);
  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem("croqueton-post-review-requests", JSON.stringify(postReviewRequests));
  }, [postReviewRequests, isHydrated]);
  const community = {
    user,
    petFurColor,
    posts,
    postReviewRequests,
    accountCount: Object.keys(accounts).length,
    signIn: (email, nextPassword) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (accounts[normalizedEmail] !== nextPassword) return false;
      setUser({ email: normalizedEmail, name: normalizedEmail.split("@")[0].replace(/[._-]/g, " ") || "Croquet\xF3n" });
      return true;
    },
    createAccount: (email, nextPassword) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (accounts[normalizedEmail] || nextPassword.length < 6) return false;
      setAccounts((current) => ({ ...current, [normalizedEmail]: nextPassword }));
      setUser({ email: normalizedEmail, name: normalizedEmail.split("@")[0].replace(/[._-]/g, " ") || "Croquet\xF3n" });
      return true;
    },
    signOut: () => setUser(null),
    updateProfile: (name) => {
      const nextName = name.trim();
      if (!nextName || !user) return;
      setPosts((current) => current.map((post) => {
        const isOwner = post.authorEmail ? post.authorEmail === user.email : post.author === user.name;
        return isOwner ? { ...post, author: nextName, authorEmail: user.email } : post;
      }));
      setUser((current) => current ? { ...current, name: nextName } : current);
    },
    updatePassword: (nextPassword) => {
      if (user) setAccounts((current) => ({ ...current, [user.email]: nextPassword }));
    },
    updatePet: setPetFurColor,
    addPost: (body, image) => setPosts((current) => user ? [{ id: crypto.randomUUID(), author: user.name, authorEmail: user.email, body, image, createdAt: new Intl.DateTimeFormat(language === "en" ? "en" : "es", { dateStyle: "medium" }).format(/* @__PURE__ */ new Date()), likedBy: [], comments: [] }, ...current] : current),
    requestPostReview: (body) => {
      if (!user) return;
      setPostReviewRequests((current) => [...current, { id: crypto.randomUUID(), author: user.name, body, requestedAt: (/* @__PURE__ */ new Date()).toISOString() }]);
    },
    approvePostReview: (requestId) => {
      if (user?.email !== "admin@croqueton.mx") return;
      const request = postReviewRequests.find((item) => item.id === requestId);
      if (!request) return;
      setPosts((current) => [{ id: crypto.randomUUID(), author: request.author, body: request.body, createdAt: new Intl.DateTimeFormat(language === "en" ? "en" : "es", { dateStyle: "medium" }).format(/* @__PURE__ */ new Date()), likedBy: [], comments: [] }, ...current]);
      setPostReviewRequests((current) => current.filter((item) => item.id !== requestId));
    },
    rejectPostReview: (requestId) => {
      if (user?.email === "admin@croqueton.mx") setPostReviewRequests((current) => current.filter((item) => item.id !== requestId));
    },
    adminDeletePost: (postId) => {
      if (user?.email === "admin@croqueton.mx") setPosts((current) => current.filter((post) => post.id !== postId));
    },
    editPost: (postId, body) => {
      if (!user) return;
      setPosts((current) => current.map((post) => {
        const isOwner = post.authorEmail ? post.authorEmail === user.email : post.author === user.name;
        return post.id === postId && isOwner ? { ...post, body } : post;
      }));
    },
    deletePost: (postId) => {
      if (!user) return;
      setPosts((current) => current.filter((post) => {
        const isOwner = post.authorEmail ? post.authorEmail === user.email : post.author === user.name;
        return post.id !== postId || !isOwner;
      }));
    },
    toggleLike: (postId) => {
      if (!user) return;
      setPosts((current) => current.map((post) => post.id !== postId ? post : { ...post, likedBy: post.likedBy.includes(user.email) ? post.likedBy.filter((email) => email !== user.email) : [...post.likedBy, user.email] }));
    },
    addComment: (postId, body) => {
      if (!user) return;
      setPosts((current) => current.map((post) => post.id !== postId ? post : { ...post, comments: [...post.comments, { id: crypto.randomUUID(), author: user.name, body }] }));
    }
  };
  return <LanguageContext.Provider value={{ language, setLanguage }}>
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <CommunityContext.Provider value={community}>{children}</CommunityContext.Provider>
    </ThemeContext.Provider>
  </LanguageContext.Provider>;
}

function readStorage(key) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

export { LanguageContext, ThemeContext, CommunityContext, useLanguage, useTheme, useCommunity };
export default AppProviders;

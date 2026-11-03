"use client";

import GuaubookProfilePanel from "@/components/guaubook-profile-panel";
import { useCommunity } from "@/context/app-context";
import { useNavigate } from "@/lib/navigation";

function UserPanelPage() {
  const { user, posts, profiles, follows } = useCommunity();
  const navigate = useNavigate();
  if (!user) return null;
  const myPosts = posts.filter((post) =>
    post.authorEmail ? post.authorEmail === user.email : post.author === user.name
  );
  const followingEmails = follows?.[user.email] || [];
  const followingList = followingEmails
    .map((email) => profiles[email])
    .filter(Boolean)
    .map((profile) => ({ name: profile.name, handle: `@${profile.username}` }));
  const followersList = Object.entries(follows || {})
    .filter(([, list]) => Array.isArray(list) && list.includes(user.email))
    .map(([email]) => profiles[email])
    .filter(Boolean)
    .map((profile) => ({ name: profile.name, handle: `@${profile.username}` }));
  return <section className="admin-main" id="mi-panel">
      <div className="admin-welcome">
        <div>
          <span className="eyebrow">Mi panel</span>
          <h1>Hola, {user.name}.</h1>
          <p>Aquí están tus publicaciones y la personalización de tu avatar.</p>
        </div>
        <div className="admin-status">
          <span />
          <div>
            <strong>{myPosts.length} {myPosts.length === 1 ? "publicación" : "publicaciones"}</strong>
            <small>Tu actividad en GuauBook</small>
          </div>
        </div>
      </div>
      <GuaubookProfilePanel user={user} myPosts={myPosts} followers={followersList} following={followingList} onPublish={() => navigate("/mi-panel/guaubook")} />
    </section>;
}
export default UserPanelPage;

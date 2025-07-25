import Timeline from "../pages/Timeline";
import PostPage from "../pages/PostPage";
import ProfilePage from "../pages/ProfilePage";
import ExplorePage from "../pages/ExplorePage";
import HashtagPage from "../pages/HashtagPage";
import AuthModule from "../components/auth/AuthModule";
import AuthLogin from "../components/auth/AuthLogin";
import AuthRegister from "../components/auth/AuthRegister";
import AuthForgotPassword from "../components/auth/AuthForgotPassword";

export const publicRoutes = [
  {
    path: "/auth",
    component: AuthModule,
    name: "AuthModule",
  },
  {
    path: "/login",
    component: AuthLogin,
    name: "AuthLogin",
  },
  {
    path: "/register",
    component: AuthRegister,
    name: "AuthRegister",
  },
  {
    path: "/forgot-password",
    component: AuthForgotPassword,
    name: "AuthForgotPassword",
  },
];

export const protectedRoutes = [
  {
    path: "/",
    component: Timeline,
    name: "Timeline",
  },
  {
    path: "/post/:id",
    component: PostPage,
    name: "PostPage",
  },
  {
    path: "/profile/:profileId",
    component: ProfilePage,
    name: "ProfilePage",
  },
  {
    path: "/hashtag/:tag",
    component: HashtagPage,
    name: "HashtagPage",
  },
  {
    path: "/explore",
    component: ExplorePage,
    name: "ExplorePage",
  },
];

// For special routes like redirects
export const specialRoutes = [
  {
    path: "/user/:userId",
    redirect: (location) => {
      const userId = location.pathname.split("/").pop();
      return `/profile/${userId}`;
    },
  },
];

import Timeline from "../pages/Timeline";
import PostPage from "../pages/PostPage";
import ProfilePage from "../pages/ProfilePage";
import ExplorePage from "../pages/ExplorePage";
import AuthModule from "../components/auth/AuthModule";
import AuthLogin from "../components/auth/AuthLogin";
import AuthRegister from "../components/auth/AuthRegister";

export const publicRoutes = [
  {
    path: "/auth",
    component: AuthModule,
  },
  {
    path: "/login",
    component: AuthLogin, // We'll handle props separately
  },
  {
    path: "/register",
    component: AuthRegister,
  },
];

export const protectedRoutes = [
  {
    path: "/",
    component: Timeline,
  },
  {
    path: "/post/:id",
    component: PostPage,
  },
  {
    path: "/profile/:profileId",
    component: ProfilePage,
  },
  {
    path: "/explore",
    component: ExplorePage,
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

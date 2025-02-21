import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import RequireAuth from "@/store/modules/RequireAuth";
import Articles from "@/pages/Articles/Articles";
import ArticleDetails from "@/pages/Articles/ArticleDetails";
import Register from "@/pages/Register";
import Profiles from "@/pages/Profile";
import ManageArticles from "@/pages/Articles/ArticleManage";
import Category from "@/pages/Category";
import Hero from "@/pages/Hero";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Hero />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route element={<RequireAuth />}>
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:documentId" element={<ArticleDetails />} />
            <Route path="/articles/manage" element={<ManageArticles />} />
            <Route path="/profile" element={<Profiles />} />
            <Route path="/category" element={<Category />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

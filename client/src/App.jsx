import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/public/Home';
import AuthorProfile from './pages/public/authors/AuthorProfile';
import ArticleListing from './pages/public/articles/ArticleListing';
import ArticleDetail from './pages/public/articles/ArticleDetail';
import CategoryPage from './pages/public/categories/CategoryPage';
import NewsletterPage from './pages/public/newsletter/NewsletterPage';
import Services from './pages/public/services/Incorporation';
import Contact from './pages/public/Contact';
import Dashboard from './pages/admin/Dashboard';
import ArticlesManager from './pages/admin/ArticlesManager';
import ArticleEditor from './pages/admin/ArticleEditor';
import CategoriesManager from './pages/admin/CategoriesManager';
import Analytics from './pages/admin/Analytics';
import UsersManager from './pages/admin/UsersManager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Application Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="articles" element={<ArticleListing />} />
          <Route path="article/:slug" element={<ArticleDetail />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="author/:id" element={<AuthorProfile />} />
          <Route path="newsletter" element={<NewsletterPage />} />
          <Route path="services/:serviceId" element={<Services />} />
          <Route path="services" element={<Navigate to="/services/incorporation" replace />} />
          <Route path="incorporation" element={<Navigate to="/services/incorporation" replace />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Standalone Public Routes */}
        <Route path="/login" element={<Navigate to="/?login=true" replace />} />
        <Route path="/admin/login" element={<Navigate to="/?login=true" replace />} />

        {/* Secure Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<ArticlesManager />} />
          <Route path="articles/new" element={<ArticleEditor />} />
          <Route path="articles/edit/:id" element={<ArticleEditor />} />
          <Route path="categories" element={<CategoriesManager />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="users" element={<UsersManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

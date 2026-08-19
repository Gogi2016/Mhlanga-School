import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import AdmissionsBanner from './components/AdmissionsBanner';
import AdminRoute from './components/AdminRoute';

import Home from '@/pages/Home';
import Gallery from '@/pages/Gallery';
import AdmissionsPage from '@/pages/AdmissionsPage';
import TrackApplication from '@/pages/TrackApplication';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router basename="/Mhlanga-School">
        <ScrollToTop />
        <AdmissionsBanner />

        <div style={{ paddingTop: 'var(--announcement-height, 0px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/track-application" element={<TrackApplication />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </Router>

      <Toaster />
    </QueryClientProvider>
  )
}

export default App
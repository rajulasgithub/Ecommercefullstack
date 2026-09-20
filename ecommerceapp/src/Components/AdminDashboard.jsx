import React, { useState, useEffect, useCallback } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Header from './Header';
import SEO from './SEO';
import Viewproduct from './Viewproduct';
import Vieworders from './Vieworders';
import './AdminDashboard.css';
import './Style.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Stats State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalDeletedProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentUsers: [],
    recentSellers: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Users State
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);

  // Sellers State
  const [sellers, setSellers] = useState([]);
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [sellerSearch, setSellerSearch] = useState('');
  const [deleteSellerTarget, setDeleteSellerTarget] = useState(null);

  const [deleting, setDeleting] = useState(false);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/auth/admin-stats');
      if (res.data && res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch All Users
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/auth/view');
      if (res.data && res.data.success) {
        setUsers(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('Failed to load user records.');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Fetch All Sellers / Companies
  const fetchSellers = useCallback(async () => {
    setLoadingSellers(true);
    try {
      const res = await api.get('/auth/viewcompany');
      if (res.data && res.data.success) {
        setSellers(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch sellers:', err);
      toast.error('Failed to load merchant records.');
    } finally {
      setLoadingSellers(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'sellers') {
      fetchSellers();
    }
  }, [activeTab, fetchUsers, fetchSellers]);

  // Handle Delete User
  const confirmDeleteUser = async () => {
    if (!deleteUserTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/auth/delete/${deleteUserTarget._id}`);
      toast.success(`User ${deleteUserTarget.firstName} deleted successfully.`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteUserTarget._id));
      setDeleteUserTarget(null);
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeleting(false);
    }
  };

  // Handle Delete Seller / Company
  const confirmDeleteSeller = async () => {
    if (!deleteSellerTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/auth/deletecompany/${deleteSellerTarget._id}`);
      toast.success(`Merchant ${deleteSellerTarget.companyName} deleted successfully.`);
      setSellers((prev) => prev.filter((s) => s._id !== deleteSellerTarget._id));
      setDeleteSellerTarget(null);
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete merchant.');
    } finally {
      setDeleting(false);
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const term = userSearch.toLowerCase().trim();
    if (!term) return true;
    const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const email = u.loginId?.email?.toLowerCase() || '';
    const phone = u.number || '';
    return name.includes(term) || email.includes(term) || phone.includes(term);
  });

  // Filtered Sellers List
  const filteredSellers = sellers.filter((s) => {
    const term = sellerSearch.toLowerCase().trim();
    if (!term) return true;
    const company = (s.companyName || '').toLowerCase();
    const email = s.loginId?.email?.toLowerCase() || '';
    const gst = (s.gstNumber || '').toLowerCase();
    const reg = (s.regNumber || '').toLowerCase();
    return company.includes(term) || email.includes(term) || gst.includes(term) || reg.includes(term);
  });

  return (
    <div className="page-container d-flex flex-column" style={{ minHeight: '100vh' }}>
      <SEO title="Admin Dashboard" noindex={true} />
      <Header />

      <div className="admin-dashboard-container flex-grow-1">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <div>
            <div className="admin-sidebar-brand">
              <span className="admin-sidebar-icon">👑</span>
              <div>
                <div className="admin-sidebar-title">Admin Control</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Platform Operations</div>
              </div>
            </div>

            <nav className="admin-nav-menu">
              <button
                type="button"
                className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <span>📊</span> System Overview
              </button>

              <button
                type="button"
                className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <span>👥</span> Customers
                <span className="admin-nav-badge">{stats.totalUsers}</span>
              </button>

              <button
                type="button"
                className={`admin-nav-item ${activeTab === 'sellers' ? 'active' : ''}`}
                onClick={() => setActiveTab('sellers')}
              >
                <span>🏬</span> Merchants / Sellers
                <span className="admin-nav-badge">{stats.totalSellers}</span>
              </button>

              <button
                type="button"
                className={`admin-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
                onClick={() => setActiveTab('catalog')}
              >
                <span>📦</span> Product Catalog
                <span className="admin-nav-badge">{stats.totalProducts}</span>
              </button>

              <button
                type="button"
                className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <span>🛒</span> All System Orders
                <span className="admin-nav-badge">{stats.totalOrders}</span>
              </button>
            </nav>
          </div>

          <div className="pt-3 border-top border-secondary-subtle" style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Role: <strong style={{ color: '#f59e0b' }}>Administrator</strong>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="admin-main-content">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div className="admin-page-header">
                <div className="admin-header-title">
                  <h1>Platform Overview & Analytics</h1>
                  <p>Real-time metrics, platform revenue, and live customer activity</p>
                </div>
                <Button className="btn-glass-primary size-sm" onClick={fetchStats}>
                  🔄 Refresh Metrics
                </Button>
              </div>

              {loadingStats ? (
                <div className="text-center py-5">
                  <Spinner animation="border" style={{ color: '#a5b4fc' }} />
                  <p className="mt-2 text-secondary">Loading statistics...</p>
                </div>
              ) : (
                <>
                  {/* KPI Stat Cards */}
                  <Row className="g-4 mb-4">
                    <Col xs={12} sm={6} lg={3}>
                      <div className="stat-card">
                        <div className="stat-header">
                          <span className="stat-label">Total Revenue</span>
                          <div className="stat-icon-wrapper stat-icon-emerald">💰</div>
                        </div>
                        <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
                        <div className="stat-trend stat-trend-up">
                          <span>↑ Live Order Sales</span>
                        </div>
                      </div>
                    </Col>

                    <Col xs={12} sm={6} lg={3}>
                      <div className="stat-card">
                        <div className="stat-header">
                          <span className="stat-label">Registered Customers</span>
                          <div className="stat-icon-wrapper stat-icon-indigo">👤</div>
                        </div>
                        <div className="stat-value">{stats.totalUsers}</div>
                        <div className="stat-trend stat-trend-up">
                          <span>↑ Platform Accounts</span>
                        </div>
                      </div>
                    </Col>

                    <Col xs={12} sm={6} lg={3}>
                      <div className="stat-card">
                        <div className="stat-header">
                          <span className="stat-label">Verified Sellers</span>
                          <div className="stat-icon-wrapper stat-icon-purple">🏬</div>
                        </div>
                        <div className="stat-value">{stats.totalSellers}</div>
                        <div className="stat-trend stat-trend-up">
                          <span>↑ Merchant Network</span>
                        </div>
                      </div>
                    </Col>

                    <Col xs={12} sm={6} lg={3}>
                      <div className="stat-card">
                        <div className="stat-header">
                          <span className="stat-label">Total Listings</span>
                          <div className="stat-icon-wrapper stat-icon-amber">📦</div>
                        </div>
                        <div className="stat-value">{stats.totalProducts}</div>
                        <div className="stat-trend stat-trend-neutral">
                          <span>{stats.totalDeletedProducts} Soft Deleted</span>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Quick Shortcuts & Recent Feeds */}
                  <Row className="g-4">
                    <Col xs={12} lg={6}>
                      <div className="glass-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                            🆕 Recently Joined Customers
                          </h3>
                          <Button className="btn-glass-secondary size-sm" onClick={() => setActiveTab('users')}>
                            View All →
                          </Button>
                        </div>

                        {stats.recentUsers.length === 0 ? (
                          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No recent customer signups.</p>
                        ) : (
                          <div className="d-flex flex-column gap-3">
                            {stats.recentUsers.map((u) => (
                              <div key={u._id} className="d-flex align-items-center justify-content-between p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <div className="admin-user-cell">
                                  <div className="admin-user-avatar">
                                    {(u.firstName || 'U')[0]}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{u.firstName} {u.lastName}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{u.loginId?.email || 'N/A'}</div>
                                  </div>
                                </div>
                                <span className="status-pill delivered" style={{ fontSize: '0.75rem' }}>Customer</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Col>

                    <Col xs={12} lg={6}>
                      <div className="glass-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                            🏬 Recently Registered Merchants
                          </h3>
                          <Button className="btn-glass-secondary size-sm" onClick={() => setActiveTab('sellers')}>
                            View All →
                          </Button>
                        </div>

                        {stats.recentSellers.length === 0 ? (
                          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No recent merchant registrations.</p>
                        ) : (
                          <div className="d-flex flex-column gap-3">
                            {stats.recentSellers.map((s) => (
                              <div key={s._id} className="d-flex align-items-center justify-content-between p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <div className="admin-user-cell">
                                  <div className="admin-user-avatar" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d' }}>
                                    {(s.companyName || 'M')[0]}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{s.companyName}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>GSTIN: {s.gstNumber || 'N/A'}</div>
                                  </div>
                                </div>
                                <span className="status-pill processing" style={{ fontSize: '0.75rem' }}>Merchant</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div>
              <div className="admin-page-header">
                <div className="admin-header-title">
                  <h2>Customer Account Management</h2>
                  <p>Inspect registered buyer accounts, contact info, and profile status</p>
                </div>
                <div style={{ width: '280px' }}>
                  <Form.Control
                    type="text"
                    placeholder="🔍 Search users by name/email/phone..."
                    className="glass-input"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
              </div>

              {loadingUsers ? (
                <div className="text-center py-5">
                  <Spinner animation="border" style={{ color: '#a5b4fc' }} />
                  <p className="mt-2 text-secondary">Loading customer records...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="glass-card text-center py-5">
                  <h4>No Users Found</h4>
                  <p style={{ color: '#94a3b8' }}>Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Email Address</th>
                        <th>Phone</th>
                        <th>Location</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u._id}>
                          <td>
                            <div className="admin-user-cell">
                              {u.image ? (
                                <img src={u.image} alt={u.firstName} className="admin-user-avatar" />
                              ) : (
                                <div className="admin-user-avatar">{(u.firstName || 'U')[0]}</div>
                              )}
                              <div>
                                <div style={{ fontWeight: 600, color: '#ffffff' }}>{u.firstName} {u.lastName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Gender: {u.gender || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td>{u.loginId?.email || 'N/A'}</td>
                          <td>{u.number || 'N/A'}</td>
                          <td>{u.place ? `${u.place}, ${u.district}, ${u.state}` : 'N/A'}</td>
                          <td>
                            <span className="status-pill delivered" style={{ fontSize: '0.75rem' }}>Customer</span>
                          </td>
                          <td>
                            <button className="btn-admin-delete" onClick={() => setDeleteUserTarget(u)}>
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SELLER MANAGEMENT */}
          {activeTab === 'sellers' && (
            <div>
              <div className="admin-page-header">
                <div className="admin-header-title">
                  <h2>Merchant / Seller Management</h2>
                  <p>Oversee registered seller accounts, business GSTINs, and company profiles</p>
                </div>
                <div style={{ width: '280px' }}>
                  <Form.Control
                    type="text"
                    placeholder="🔍 Search sellers by company/GST/email..."
                    className="glass-input"
                    value={sellerSearch}
                    onChange={(e) => setSellerSearch(e.target.value)}
                  />
                </div>
              </div>

              {loadingSellers ? (
                <div className="text-center py-5">
                  <Spinner animation="border" style={{ color: '#a5b4fc' }} />
                  <p className="mt-2 text-secondary">Loading merchant records...</p>
                </div>
              ) : filteredSellers.length === 0 ? (
                <div className="glass-card text-center py-5">
                  <h4>No Merchants Found</h4>
                  <p style={{ color: '#94a3b8' }}>Try adjusting your search query.</p>
                </div>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Company Name</th>
                        <th>Email Address</th>
                        <th>Contact Phone</th>
                        <th>Reg / GST Number</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSellers.map((s) => (
                        <tr key={s._id}>
                          <td>
                            <div className="admin-user-cell">
                              {s.image ? (
                                <img src={s.image} alt={s.companyName} className="admin-user-avatar" />
                              ) : (
                                <div className="admin-user-avatar" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d' }}>
                                  {(s.companyName || 'M')[0]}
                                </div>
                              )}
                              <div>
                                <div style={{ fontWeight: 600, color: '#ffffff' }}>{s.companyName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>Verified Merchant</div>
                              </div>
                            </div>
                          </td>
                          <td>{s.loginId?.email || 'N/A'}</td>
                          <td>{s.contactNumber || 'N/A'}</td>
                          <td>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fcd34d' }}>GST: {s.gstNumber || 'N/A'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Reg: {s.regNumber || 'N/A'}</div>
                          </td>
                          <td>{s.district ? `${s.district}, ${s.state} (${s.pincode})` : 'N/A'}</td>
                          <td>
                            <button className="btn-admin-delete" onClick={() => setDeleteSellerTarget(s)}>
                              🗑️ Delete Merchant
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PRODUCT CATALOG MODERATION */}
          {activeTab === 'catalog' && (
            <div>
              <div className="admin-page-header">
                <div className="admin-header-title">
                  <h2>Product Catalog Moderation</h2>
                  <p>View, edit, or remove product listings across all platform merchants</p>
                </div>
              </div>
              <Viewproduct />
            </div>
          )}

          {/* TAB 5: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div>
              <div className="admin-page-header">
                <div className="admin-header-title">
                  <h2>System-Wide Orders Management</h2>
                  <p>Track customer purchases and update order dispatch status across all sellers</p>
                </div>
              </div>
              <Vieworders hideHeader={true} />
            </div>
          )}
        </main>
      </div>

      {/* Delete User Confirmation Modal */}
      <Modal show={!!deleteUserTarget} onHide={() => setDeleteUserTarget(null)} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ color: '#ffffff', fontWeight: 700 }}>Confirm Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>
            Are you sure you want to delete account for customer <strong style={{ color: '#ffffff' }}>{deleteUserTarget?.firstName} {deleteUserTarget?.lastName}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3">
          <Button className="btn-glass-secondary" onClick={() => setDeleteUserTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button className="btn-glass-danger" onClick={confirmDeleteUser} disabled={deleting}>
            {deleting ? <Spinner animation="border" size="sm" /> : 'Yes, Delete Customer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Seller Confirmation Modal */}
      <Modal show={!!deleteSellerTarget} onHide={() => setDeleteSellerTarget(null)} centered contentClassName="glass-modal">
        <Modal.Header closeButton className="glass-modal-header">
          <Modal.Title style={{ color: '#ffffff', fontWeight: 700 }}>Confirm Delete Merchant</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>
            Are you sure you want to delete seller account <strong style={{ color: '#ffffff' }}>{deleteSellerTarget?.companyName}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3">
          <Button className="btn-glass-secondary" onClick={() => setDeleteSellerTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button className="btn-glass-danger" onClick={confirmDeleteSeller} disabled={deleting}>
            {deleting ? <Spinner animation="border" size="sm" /> : 'Yes, Delete Merchant'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

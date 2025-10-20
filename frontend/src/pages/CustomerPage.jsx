import { useState, useEffect } from 'react';
import { Card, Typography, Button, Avatar, Spin, message, Input, Form, App as AntdApp } from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  InboxOutlined
} from '@ant-design/icons';
import Navbar from '../components/Navbar';
import { ConfirmModal } from '../components/modals';
import { updateUser, getTransaksiByUser, deleteTransaksi } from '../services/api';
import './../styles/CustomerPage.css';

const { Title, Text } = Typography;

const CustomerPage = ({ currentUser, setCurrentUser }) => {
  const { modal } = AntdApp.useApp();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [transaksiList, setTransaksiList] = useState([]);
  const [form] = Form.useForm();
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    open: false,
    transaksi: null,
  });
  // Result modal state removed; using AntD App context modals

  // Load data transaksi saat component mount
  useEffect(() => {
    loadTransaksi();
  }, [currentUser]);

  const loadTransaksi = async () => {
    try {
      setLoading(true);
      const data = await getTransaksiByUser(currentUser.id);
      setTransaksiList(data);
    } catch (error) {
      message.error('Gagal memuat riwayat transaksi');
      console.error('Load transaksi error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Profile
  const handleEditClick = () => {
    setEditMode(true);
    form.setFieldsValue({
      nama: currentUser.nama,
      nomorHP: currentUser.nomorHP,
      alamat: currentUser.alamat
    });
  };

  const handleSaveProfile = async (values) => {
    try {
      // 1. Update user data
      const updatedUser = await updateUser(currentUser.id, values);
      setCurrentUser(updatedUser);
      
      // 2. Close edit mode first to avoid form unmount conflicts
      setEditMode(false);

      // 3. Use AntD static modal for reliability
      modal.success({
        title: 'Profil Berhasil Diperbarui! ✅',
        content: 'Data profil Anda telah berhasil disimpan dan diperbarui.',
        centered: true,
        okText: 'OK, Mengerti',
        icon: <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />,
      });
    } catch (error) {
      console.error('❌ Update profile error:', error);
      // Close edit mode
      setEditMode(false);

      // Show error modal using static method
      modal.error({
        title: 'Gagal Memperbarui Profil! ❌',
        content: 'Terjadi kesalahan saat menyimpan data profil. Silakan coba lagi.',
        centered: true,
        okText: 'OK, Mengerti',
        icon: <CloseCircleOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    form.resetFields();
  };

  // Handle Delete Transaksi
  const handleDeleteTransaksi = (transaksi) => {
    setDeleteModalConfig({
      open: true,
      transaksi: transaksi,
    });
  };

  const confirmDeleteTransaksi = async () => {
    try {
      await deleteTransaksi(deleteModalConfig.transaksi.id);
      setTransaksiList(transaksiList.filter(t => t.id !== deleteModalConfig.transaksi.id));
      
      // Close confirmation modal
      setDeleteModalConfig({ open: false, transaksi: null });

      // Show success modal using static method
      modal.success({
        title: 'Transaksi Berhasil Dihapus! ✅',
        content: `Riwayat transaksi "${deleteModalConfig.transaksi.namaPaket}" telah dihapus dari daftar Anda.`,
        centered: true,
        okText: 'OK, Mengerti',
        icon: <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />,
      });
    } catch (error) {
      console.error('Delete transaksi error:', error);
      
      // Close confirmation modal
      setDeleteModalConfig({ open: false, transaksi: null });

      // Show error modal using static method
      modal.error({
        title: 'Gagal Menghapus Transaksi! ❌',
        content: 'Terjadi kesalahan saat menghapus transaksi. Silakan coba lagi.',
        centered: true,
        okText: 'OK, Mengerti',
        icon: <CloseCircleOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />,
      });
    }
  };

  const cancelDeleteTransaksi = () => {
    setDeleteModalConfig({ open: false, transaksi: null });
  };

  // No result modal close handler needed

  // Format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Hitung total pengeluaran
  const totalPengeluaran = transaksiList.reduce((sum, t) => sum + t.harga, 0);

  return (
    <>
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

      <div className="customer-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <div>
              <Title level={2} className="header-title">
                Dashboard Customer
              </Title>
              <Text className="header-subtitle">
                Kelola profil dan riwayat transaksi Anda
              </Text>
            </div>

            {/* Statistics */}
            <div className="header-stats">
              <div className="stat-box">
                <span className="stat-label">Saldo Tersedia</span>
                <span className="stat-value">
                  Rp {currentUser?.saldo?.toLocaleString('id-ID') || 0}
                </span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Total Transaksi</span>
                <span className="stat-value">{transaksiList.length}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Total Pengeluaran</span>
                <span className="stat-value">
                  Rp {totalPengeluaran.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Profile Card */}
          <Card className="profile-card">
            {/* Profile Header */}
            <div className="profile-header">
              <div className="profile-avatar-container">
                <Avatar
                  icon={<UserOutlined />}
                  className="profile-avatar"
                />
              </div>
              <Title level={4} className="profile-name">
                {currentUser?.nama}
              </Title>
              <Text className="profile-email">{currentUser?.email}</Text>
            </div>

            {/* Profile Body */}
            <div className="profile-body">
              {!editMode ? (
                <>
                  {/* View Mode */}
                  <div className="profile-info-item">
                    <div className="profile-icon">
                      <UserOutlined />
                    </div>
                    <div className="profile-info-content">
                      <span className="profile-info-label">Nama Lengkap</span>
                      <span className="profile-info-value">{currentUser?.nama}</span>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="profile-icon">
                      <PhoneOutlined />
                    </div>
                    <div className="profile-info-content">
                      <span className="profile-info-label">Nomor HP</span>
                      <span className="profile-info-value">{currentUser?.nomorHP}</span>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="profile-icon">
                      <EnvironmentOutlined />
                    </div>
                    <div className="profile-info-content">
                      <span className="profile-info-label">Alamat</span>
                      <span className="profile-info-value">{currentUser?.alamat}</span>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="profile-icon">
                      <WalletOutlined />
                    </div>
                    <div className="profile-info-content">
                      <span className="profile-info-label">Saldo</span>
                      <span className="profile-info-value">
                        Rp {currentUser?.saldo?.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Edit Mode */}
                  <Form form={form} onFinish={handleSaveProfile} layout="vertical" className="edit-form">
                    <Form.Item
                      name="nama"
                      label={<span className="form-label">Nama Lengkap</span>}
                      rules={[{ required: true, message: 'Nama wajib diisi!' }]}
                    >
                      <Input className="form-input" prefix={<UserOutlined />} />
                    </Form.Item>

                    <Form.Item
                      name="nomorHP"
                      label={<span className="form-label">Nomor HP</span>}
                      rules={[{ required: true, message: 'Nomor HP wajib diisi!' }]}
                    >
                      <Input className="form-input" prefix={<PhoneOutlined />} />
                    </Form.Item>

                    <Form.Item
                      name="alamat"
                      label={<span className="form-label">Alamat</span>}
                      rules={[{ required: true, message: 'Alamat wajib diisi!' }]}
                    >
                      <Input.TextArea
                        className="form-input"
                        rows={3}
                        style={{ resize: 'none' }}
                      />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                      <div className="profile-actions">
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          htmlType="submit"
                          className="btn-save"
                        >
                          Simpan
                        </Button>
                        <Button
                          icon={<CloseOutlined />}
                          onClick={handleCancelEdit}
                          className="btn-cancel"
                        >
                          Batal
                        </Button>
                      </div>
                    </Form.Item>
                  </Form>
                </>
              )}
            </div>

            {/* Profile Actions */}
            <div className="profile-actions">
              {!editMode && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEditClick}
                  className="btn-edit"
                  block
                >
                  Edit Profil
                </Button>
              )}
            </div>
          </Card>

          {/* Transaction History Card */}
          <Card className="history-card">
            {/* History Header */}
            <div className="history-header">
              <Title level={4} className="history-title">
                Riwayat Transaksi
              </Title>
              <span className="history-badge">{transaksiList.length} Transaksi</span>
            </div>

            {/* History Body */}
            <div className="history-body">
              {loading ? (
                <div className="loading-container">
                  <div style={{ textAlign: 'center' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 12, color: '#8c8c8c' }}>Memuat data transaksi...</div>
                  </div>
                </div>
              ) : transaksiList.length === 0 ? (
                <div className="empty-state">
                  <InboxOutlined className="empty-icon" />
                  <Title level={5} className="empty-title">
                    Belum Ada Transaksi
                  </Title>
                  <Text className="empty-desc">
                    Mulai beli paket data untuk melihat riwayat transaksi Anda
                  </Text>
                </div>
              ) : (
                transaksiList.map((transaksi) => (
                  <div key={transaksi.id} className="transaction-item">
                    {/* Transaction Header */}
                    <div className="transaction-header">
                      <div className="transaction-main">
                        <div className="transaction-name">{transaksi.namaPaket}</div>
                        <div className="transaction-date">
                          <CalendarOutlined /> {formatDate(transaksi.tanggal)}
                        </div>
                      </div>
                      <div className="transaction-price">
                        Rp {transaksi.harga.toLocaleString('id-ID')}
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="transaction-details">
                      <div className="transaction-detail-item">
                        <ShoppingCartOutlined />
                        <span>{transaksi.kuota}</span>
                      </div>
                      <div className="transaction-detail-item">
                        <PhoneOutlined />
                        <span>{transaksi.nomorHP}</span>
                      </div>
                    </div>

                    {/* Transaction Actions */}
                    <div className="transaction-actions">
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteTransaksi(transaksi)}
                        className="btn-delete"
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalConfig.open}
        title="Konfirmasi Hapus Transaksi"
        content="Apakah Anda yakin ingin menghapus transaksi ini?"
        onOk={confirmDeleteTransaksi}
        onCancel={cancelDeleteTransaksi}
        okText="Ya, Hapus"
        cancelText="Batal"
        danger={true}
        getContainer={() => document.body}
        zIndex={10000}
      >
        {deleteModalConfig.transaksi && (
          <div style={{ 
            background: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '8px',
            textAlign: 'left',
            marginTop: '16px'
          }}>
            <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '15px' }}>
              {deleteModalConfig.transaksi.namaPaket}
            </Text>
            <Text type="secondary" style={{ display: 'block', fontSize: '13px' }}>
              Kuota: {deleteModalConfig.transaksi.kuota}
            </Text>
            <Text type="secondary" style={{ display: 'block', fontSize: '13px' }}>
              Harga: Rp {deleteModalConfig.transaksi.harga.toLocaleString('id-ID')}
            </Text>
          </div>
        )}
      </ConfirmModal>
    </>
  );
};

export default CustomerPage;
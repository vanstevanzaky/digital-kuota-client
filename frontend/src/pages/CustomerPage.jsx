import { useState, useEffect } from 'react';
import { Card, Typography, Button, Avatar, Spin, message, Input, Form, App as AntdApp, InputNumber, Modal } from 'antd';
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
  InboxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined  // ✨ NEW ICON
} from '@ant-design/icons';
import Navbar from '../components/Navbar';
import { ConfirmModal } from '../components/modals';
import { updateUser, getTransaksiByUser, deleteTransaksi, updateSaldo } from '../services/api';
import './../styles/CustomerPage.css';

const { Title, Text } = Typography;

const CustomerPage = ({ currentUser, setCurrentUser }) => {
  const { modal } = AntdApp.useApp();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [transaksiList, setTransaksiList] = useState([]);
  const [form] = Form.useForm();
  const [topUpForm] = Form.useForm();  // ✨ NEW FORM
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    open: false,
    transaksi: null,
  });
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);  // ✨ NEW STATE
  const [topUpLoading, setTopUpLoading] = useState(false);  // ✨ NEW STATE

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

  // ✨ NEW: Handle Top Up
  const handleTopUpClick = () => {
    topUpForm.resetFields();
    setTopUpModalVisible(true);
  };

  const handleTopUpSubmit = async (values) => {
    try {
      setTopUpLoading(true);
      
      // Update saldo
      const newSaldo = currentUser.saldo + values.nominal;
      const updatedUser = await updateSaldo(currentUser.id, newSaldo);
      
      // Update current user
      setCurrentUser(updatedUser);
      
      // Close modal
      setTopUpModalVisible(false);
      setTopUpLoading(false);
      
      // Show success modal
      modal.success({
        title: 'Top Up Berhasil! 🎉',
        content: (
          <div>
            <p style={{ marginBottom: 16 }}>
              <strong>Saldo Anda telah berhasil ditambahkan!</strong>
            </p>
            <div style={{ background: '#f6ffed', padding: 12, borderRadius: 8, border: '1px solid #b7eb8f' }}>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">Nominal Top Up:</Text>{' '}
                <Text strong style={{ color: '#52c41a' }}>
                  Rp {values.nominal.toLocaleString('id-ID')}
                </Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">Saldo Sebelumnya:</Text>{' '}
                <Text strong>Rp {currentUser.saldo.toLocaleString('id-ID')}</Text>
              </div>
              <div>
                <Text type="secondary">Saldo Saat Ini:</Text>{' '}
                <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                  Rp {newSaldo.toLocaleString('id-ID')}
                </Text>
              </div>
            </div>
            <p style={{ marginTop: 16, marginBottom: 0 }}>
              Saldo siap digunakan untuk pembelian paket data! 💳
            </p>
          </div>
        ),
        okText: 'OK, Mengerti',
        centered: true,
        icon: <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />,
      });
    } catch (error) {
      console.error('Top up error:', error);
      setTopUpLoading(false);
      
      modal.error({
        title: 'Top Up Gagal! ❌',
        content: 'Terjadi kesalahan saat melakukan top up. Silakan coba lagi.',
        okText: 'OK, Mengerti',
        centered: true,
        icon: <CloseCircleOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />,
      });
    }
  };

  const handleTopUpCancel = () => {
    setTopUpModalVisible(false);
    topUpForm.resetFields();
  };

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
              {!editMode ? (
                <>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEditClick}
                    className="btn-edit"
                    style={{ flex: 1 }}
                  >
                    Edit Profil
                  </Button>
                  <Button
                    type="primary"
                    icon={<DollarOutlined />}
                    onClick={handleTopUpClick}
                    className="btn-topup"
                    style={{ 
                      flex: 1,
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      borderColor: 'transparent'
                    }}
                  >
                    Top Up
                  </Button>
                </>
              ) : null}
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

      {/* ✨ NEW: Top Up Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarOutlined style={{ color: '#10B981', fontSize: 20 }} />
            <span>Top Up Saldo</span>
          </div>
        }
        open={topUpModalVisible}
        onCancel={handleTopUpCancel}
        footer={null}
        centered
        width={450}
      >
        <Form
          form={topUpForm}
          onFinish={handleTopUpSubmit}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          {/* Current Balance Info */}
          <div style={{ 
            background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
            border: '2px solid #b7eb8f'
          }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
              Saldo Saat Ini:
            </Text>
            <Text strong style={{ fontSize: 24, color: '#10B981' }}>
              Rp {currentUser?.saldo?.toLocaleString('id-ID') || 0}
            </Text>
          </div>

          {/* Nominal Input */}
          <Form.Item
            name="nominal"
            label={<span style={{ fontWeight: 600 }}>Nominal Top Up</span>}
            rules={[
              { required: true, message: 'Nominal wajib diisi!' },
              { 
                type: 'number', 
                min: 10000, 
                message: 'Minimal top up Rp 10.000!' 
              },
              { 
                type: 'number', 
                max: 10000000, 
                message: 'Maksimal top up Rp 10.000.000!' 
              }
            ]}
          >
            <InputNumber
              style={{ width: '100%', height: 50 }}
              formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={value => value.replace(/Rp\s?|(\.*)/g, '')}
              placeholder="Masukkan nominal (min. Rp 10.000)"
              prefix={<WalletOutlined style={{ color: '#10B981' }} />}
            />
          </Form.Item>

          {/* Quick Amount Buttons */}
          <div style={{ marginBottom: 20 }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
              Pilih Nominal Cepat:
            </Text>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[50000, 100000, 200000, 500000, 1000000].map((amount) => (
                <Button
                  key={amount}
                  size="small"
                  onClick={() => topUpForm.setFieldsValue({ nominal: amount })}
                  style={{ 
                    borderRadius: 20,
                    borderColor: '#10B981',
                    color: '#10B981'
                  }}
                >
                  {amount >= 1000000 ? `${amount / 1000000}jt` : `${amount / 1000}k`}
                </Button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div style={{ 
            background: '#e6f7ff',
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
            border: '1px solid #91d5ff'
          }}>
            <Text style={{ fontSize: 12, color: '#0958d9' }}>
              💡 <strong>Info:</strong> Top up minimal Rp 10.000 dan maksimal Rp 10.000.000 per transaksi.
            </Text>
          </div>

          {/* Submit Button */}
          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button
                onClick={handleTopUpCancel}
                style={{ flex: 1, height: 44 }}
              >
                Batal
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={topUpLoading}
                style={{ 
                  flex: 2,
                  height: 44,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderColor: 'transparent',
                  fontWeight: 600
                }}
                icon={<DollarOutlined />}
              >
                {topUpLoading ? 'Memproses...' : 'Top Up Sekarang'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

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
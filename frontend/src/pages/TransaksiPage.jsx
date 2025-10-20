import { useState, useEffect } from 'react';
import { Card, Typography, Input, Tag, Spin, message, Modal, Button, App as AntdApp } from 'antd';
import {
  SearchOutlined,
  WifiOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  TagsOutlined,
  InboxOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import Navbar from '../components/Navbar';
import { getAllPaket, createTransaksi, updateSaldo } from '../services/api';
import './../styles/TransaksiPage.css';

const { Title, Text } = Typography;

const TransaksiPage = ({ currentUser, setCurrentUser }) => {
  const { modal } = AntdApp.useApp();
  const [loading, setLoading] = useState(true);
  const [paketList, setPaketList] = useState([]);
  const [filteredPaket, setFilteredPaket] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaket, setSelectedPaket] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  // Kategori yang tersedia
  const kategoriList = ['semua', 'harian', 'mingguan', 'bulanan', 'unlimited', 'gaming', 'streaming'];

  const kategoriColors = {
    harian: '#1890ff',
    mingguan: '#52c41a',
    bulanan: '#722ed1',
    unlimited: '#faad14',
    gaming: '#f5222d',
    streaming: '#eb2f96'
  };

  // Load paket data saat component mount
  useEffect(() => {
    loadPaket();
  }, []);

  // Filter paket berdasarkan kategori dan search
  useEffect(() => {
    filterPaket();
  }, [selectedKategori, searchTerm, paketList]);

  const loadPaket = async () => {
    try {
      setLoading(true);
      const data = await getAllPaket();
      setPaketList(data);
    } catch (error) {
      message.error('Gagal memuat data paket');
      console.error('Load paket error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPaket = () => {
    let filtered = [...paketList];

    // Filter by kategori
    if (selectedKategori !== 'semua') {
      filtered = filtered.filter(paket => paket.kategori === selectedKategori);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(paket =>
        paket.namaPaket.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paket.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPaket(filtered);
  };

  const handleKategoriClick = (kategori) => {
    setSelectedKategori(kategori);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBeliClick = (paket) => {
    setSelectedPaket(paket);
    setModalVisible(true);
  };

  const handleKonfirmasiPembelian = async () => {
    // Validasi saldo
    if (currentUser.saldo < selectedPaket.harga) {
      // Show failure modal
      modal.error({
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            <span>Pembelian Gagal</span>
          </div>
        ),
        content: (
          <div>
            <p style={{ marginBottom: 16 }}>
              <strong>Saldo Anda tidak mencukupi untuk membeli paket ini!</strong>
            </p>
            <div style={{ background: '#fff1f0', padding: 12, borderRadius: 8, border: '1px solid #ffa39e' }}>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">Paket:</Text> <Text strong>{selectedPaket.namaPaket}</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">Harga:</Text>{' '}
                <Text strong style={{ color: '#ff4d4f' }}>
                  Rp {selectedPaket.harga.toLocaleString('id-ID')}
                </Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">Saldo Anda:</Text>{' '}
                <Text strong>Rp {currentUser.saldo.toLocaleString('id-ID')}</Text>
              </div>
              <div>
                <Text type="secondary">Kekurangan:</Text>{' '}
                <Text strong style={{ color: '#ff4d4f' }}>
                  Rp {(selectedPaket.harga - currentUser.saldo).toLocaleString('id-ID')}
                </Text>
              </div>
            </div>
            <p style={{ marginTop: 16, marginBottom: 0 }}>
              Silakan top-up saldo Anda terlebih dahulu untuk melanjutkan pembelian.
            </p>
          </div>
        ),
        okText: 'Mengerti',
        okButtonProps: {
          style: { background: '#ff4d4f', borderColor: '#ff4d4f' }
        }
      });
      setModalVisible(false);
      setSelectedPaket(null);
      return;
    }

    try {
      setPurchasing(true);

      // 1. Buat transaksi baru
      const transaksiData = {
        userId: currentUser.id,
        paketId: selectedPaket.id,
        namaPaket: selectedPaket.namaPaket,
        kuota: selectedPaket.kuota,
        harga: selectedPaket.harga,
        tanggal: new Date().toISOString(),
        status: 'success',
        nomorHP: currentUser.nomorHP
      };

      await createTransaksi(transaksiData);

      // 2. Update saldo user
      const newSaldo = currentUser.saldo - selectedPaket.harga;
      const updatedUser = await updateSaldo(currentUser.id, newSaldo);

      // 3. Update state user
      setCurrentUser(updatedUser);

      // 4. Tutup modal konfirmasi
      setModalVisible(false);

      // 5. Tampilkan modal sukses
      modal.success({
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <span>Pembelian Berhasil!</span>
          </div>
        ),
        content: (
          <div>
            <p style={{ marginBottom: 16 }}>
              <strong>Selamat! Paket data Anda telah berhasil dibeli. 🎉</strong>
            </p>
            <div style={{ background: '#f6ffed', padding: 12, borderRadius: 8, border: '1px solid #b7eb8f' }}>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">Paket:</Text> <Text strong>{selectedPaket.namaPaket}</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">Kuota:</Text> <Text strong>{selectedPaket.kuota}</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">Masa Aktif:</Text> <Text strong>{selectedPaket.masa_aktif}</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">Harga:</Text>{' '}
                <Text strong style={{ color: '#52c41a' }}>
                  Rp {selectedPaket.harga.toLocaleString('id-ID')}
                </Text>
              </div>
              <div>
                <Text type="secondary">Saldo Tersisa:</Text>{' '}
                <Text strong>Rp {newSaldo.toLocaleString('id-ID')}</Text>
              </div>
            </div>
            <p style={{ marginTop: 16, marginBottom: 0 }}>
              Paket akan otomatis aktif dan dapat digunakan segera. Terima kasih telah berbelanja! 😊
            </p>
          </div>
        ),
        okText: 'Kembali ke Dashboard',
        okButtonProps: {
          style: { background: '#52c41a', borderColor: '#52c41a' }
        }
      });

      setSelectedPaket(null);

    } catch (error) {
      // Show error modal for system errors
      modal.error({
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            <span>Terjadi Kesalahan</span>
          </div>
        ),
        content: (
          <div>
            <p>
              Maaf, terjadi kesalahan saat memproses pembelian Anda. Silakan coba lagi atau hubungi customer service jika masalah berlanjut.
            </p>
            <p style={{ marginTop: 12, marginBottom: 0, fontSize: 12, color: '#8c8c8c' }}>
              Error: {error.message || 'Unknown error'}
            </p>
          </div>
        ),
        okText: 'Tutup'
      });
      console.error('Purchase error:', error);
    } finally {
      setPurchasing(false);
    }
  };

  const handleCancelPembelian = () => {
    setModalVisible(false);
    setSelectedPaket(null);
  };

  // Hitung statistik
  const totalPaket = paketList.length;
  const paketTermurah = paketList.length > 0 ? Math.min(...paketList.map(p => p.harga)) : 0;
  const paketTermahal = paketList.length > 0 ? Math.max(...paketList.map(p => p.harga)) : 0;

  return (
    <>
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

      <div className="transaksi-container">
        {/* Page Header */}
        <div className="transaksi-header">
          <div className="transaksi-header-content">
            <div>
              <Title level={2} className="transaksi-header-title">
                Beli Paket Data
              </Title>
              <Text className="transaksi-header-subtitle">
                Pilih paket data terbaik sesuai kebutuhan Anda
              </Text>
            </div>

            {/* Saldo Info */}
            <div className="saldo-info">
              <span className="saldo-label">Saldo Tersedia</span>
              <span className="saldo-value">
                Rp {currentUser?.saldo?.toLocaleString('id-ID') || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-card-transaksi">
            <div className="stat-icon-wrapper" style={{ background: '#1890ff15', color: '#1890ff' }}>
              <TagsOutlined />
            </div>
            <div className="stat-info">
              <span className="stat-card-label">Total Paket</span>
              <span className="stat-card-value">{totalPaket}</span>
            </div>
          </div>

          <div className="stat-card-transaksi">
            <div className="stat-icon-wrapper" style={{ background: '#52c41a15', color: '#52c41a' }}>
              <WalletOutlined />
            </div>
            <div className="stat-info">
              <span className="stat-card-label">Termurah</span>
              <span className="stat-card-value">Rp {paketTermurah.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="stat-card-transaksi">
            <div className="stat-icon-wrapper" style={{ background: '#722ed115', color: '#722ed1' }}>
              <WalletOutlined />
            </div>
            <div className="stat-info">
              <span className="stat-card-label">Termahal</span>
              <span className="stat-card-value">Rp {paketTermahal.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-header">
            <Title level={5} className="filter-title">
              Filter & Pencarian
            </Title>
            <Input
              placeholder="Cari paket..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
              allowClear
            />
          </div>

          {/* Kategori Filters */}
          <div className="kategori-filters">
            {kategoriList.map((kategori) => (
              <Tag
                key={kategori}
                color={kategori === 'semua' ? 'default' : kategoriColors[kategori]}
                className={`kategori-tag ${selectedKategori === kategori ? 'active' : ''}`}
                onClick={() => handleKategoriClick(kategori)}
              >
                {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
              </Tag>
            ))}
          </div>
        </div>

        {/* Paket Grid */}
        {loading ? (
          <div className="loading-container-transaksi">
            <Spin size="large" tip="Memuat paket data..." />
          </div>
        ) : filteredPaket.length === 0 ? (
          <div className="empty-state-transaksi">
            <InboxOutlined className="empty-icon-transaksi" />
            <Title level={4} className="empty-title-transaksi">
              Tidak Ada Paket Ditemukan
            </Title>
            <Text className="empty-desc-transaksi">
              Coba ubah filter atau kata kunci pencarian
            </Text>
          </div>
        ) : (
          <div className="paket-grid">
            {filteredPaket.map((paket) => (
              <div key={paket.id} className="paket-card">
                {/* Card Header */}
                <div className="paket-card-header">
                  <Tag
                    color={kategoriColors[paket.kategori]}
                    className="paket-kategori"
                  >
                    {paket.kategori}
                  </Tag>
                  <Title level={5} className="paket-name">
                    {paket.namaPaket}
                  </Title>
                </div>

                {/* Card Body */}
                <div className="paket-card-body">
                  {/* Kuota */}
                  <div className="paket-info-row">
                    <div className="paket-info-icon">
                      <WifiOutlined />
                    </div>
                    <Text className="paket-info-text">{paket.kuota}</Text>
                  </div>

                  {/* Masa Aktif */}
                  <div className="paket-info-row">
                    <div className="paket-info-icon">
                      <ClockCircleOutlined />
                    </div>
                    <Text className="paket-info-text">{paket.masa_aktif}</Text>
                  </div>

                  {/* Deskripsi */}
                  <Text className="paket-deskripsi">
                    {paket.deskripsi}
                  </Text>

                  {/* Footer */}
                  <div className="paket-card-footer">
                    <div className="paket-price-section">
                      <span className="paket-price-label">Harga</span>
                      <span className="paket-price">
                        Rp {paket.harga.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleBeliClick(paket)}
                      className="btn-beli"
                    >
                      Beli
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Konfirmasi Pembelian */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingCartOutlined style={{ color: '#667eea' }} />
              <span>Konfirmasi Pembelian</span>
            </div>
          }
          open={modalVisible}
          onOk={handleKonfirmasiPembelian}
          onCancel={handleCancelPembelian}
          okText="Beli Sekarang"
          cancelText="Batal"
          confirmLoading={purchasing}
          className="modal-konfirmasi"
          okButtonProps={{
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderColor: 'transparent'
            }
          }}
        >
          {selectedPaket && (
            <>
              <div className="modal-paket-info">
                <div className="modal-info-row">
                  <span className="modal-info-label">Paket:</span>
                  <span className="modal-info-value">{selectedPaket.namaPaket}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-info-label">Kuota:</span>
                  <span className="modal-info-value">{selectedPaket.kuota}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-info-label">Masa Aktif:</span>
                  <span className="modal-info-value">{selectedPaket.masa_aktif}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-info-label">Harga:</span>
                  <span className="modal-info-value modal-price-highlight">
                    Rp {selectedPaket.harga.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-info-label">Saldo Saat Ini:</span>
                  <span className="modal-info-value">
                    Rp {currentUser?.saldo?.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-info-label">Saldo Setelah Pembelian:</span>
                  <span className="modal-info-value" style={{ 
                    color: (currentUser?.saldo - selectedPaket.harga) < 0 ? '#f5222d' : '#52c41a' 
                  }}>
                    Rp {(currentUser?.saldo - selectedPaket.harga).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {currentUser?.saldo < selectedPaket.harga && (
                <div className="modal-warning">
                  <WarningOutlined className="modal-warning-icon" />
                  <Text className="modal-warning-text">
                    <strong>Saldo tidak mencukupi!</strong> Silakan top-up saldo terlebih dahulu.
                  </Text>
                </div>
              )}
            </>
          )}
        </Modal>
      </div>
    </>
  );
};

export default TransaksiPage;
import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Drawer, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  WalletOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { ConfirmModal } from './modals';
import './../styles/Navbar.css';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const showLogoutConfirm = () => {
    setLogoutModalVisible(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
    setDrawerVisible(false);
    setLogoutModalVisible(false);
  };

  const handleCancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const menuItems = [
    {
      key: '/customer',
      icon: <UserOutlined />,
      label: 'Dashboard',
      onClick: () => {
        navigate('/customer');
        setDrawerVisible(false);
      }
    },
    {
      key: '/transaksi',
      icon: <ShoppingCartOutlined />,
      label: 'Beli Paket',
      onClick: () => {
        navigate('/transaksi');
        setDrawerVisible(false);
      }
    }
  ];

  const userMenuItems = [
    {
      key: 'saldo',
      icon: <WalletOutlined />,
      label: `Saldo: Rp ${currentUser?.saldo?.toLocaleString('id-ID') || 0}`,
      disabled: true
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: showLogoutConfirm,
      danger: true
    }
  ];

  const mobileMenuItems = [
    ...menuItems,
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: showLogoutConfirm,
      danger: true
    }
  ];

  return (
    <Header className="navbar-header">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => navigate('/customer')}>
        <ShoppingOutlined className="navbar-logo-icon" />
        <span className="navbar-logo-text">Digital Kuota</span>
      </div>

      {/* Desktop Menu Navigation */}
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="navbar-menu"
      />

      {/* Mobile Menu Button */}
      <button 
        className="navbar-mobile-menu-btn"
        onClick={() => setDrawerVisible(true)}
      >
        <MenuOutlined />
      </button>

      {/* User Info - Desktop */}
      <Dropdown 
        menu={{ items: userMenuItems, className: 'user-dropdown-menu' }} 
        placement="bottomRight"
        trigger={['click']}
      >
        <div className="navbar-user">
          <Avatar 
            icon={<UserOutlined />} 
            className="navbar-user-avatar"
          />
          <span className="navbar-user-name">
            {currentUser?.nama || 'User'}
          </span>
        </div>
      </Dropdown>

      {/* Mobile Drawer */}
      <Drawer
        title={null}
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={280}
        className="mobile-drawer"
        styles={{ 
          body: { padding: 0 }
        }}
      >
        {/* User Info in Drawer */}
        <div className="mobile-user-info">
          <Avatar 
            icon={<UserOutlined />} 
            className="mobile-user-avatar"
          />
          <div className="mobile-user-details">
            <div className="mobile-user-name">
              {currentUser?.nama || 'User'}
            </div>
            <div className="mobile-user-saldo">
              Saldo: Rp {currentUser?.saldo?.toLocaleString('id-ID') || 0}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={mobileMenuItems}
          className="mobile-menu"
        />
      </Drawer>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        open={logoutModalVisible}
        title="Konfirmasi Logout"
        content="Apakah Anda yakin ingin keluar dari akun Anda?"
        onOk={handleLogout}
        onCancel={handleCancelLogout}
        okText="Ya, Logout"
        cancelText="Batal"
        danger={true}
      >
        <Text type="secondary" style={{ fontSize: '13px' }}>
          Anda harus login kembali untuk mengakses halaman ini.
        </Text>
      </ConfirmModal>
    </Header>
  );
};

export default Navbar;
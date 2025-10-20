import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, ShoppingOutlined, ThunderboltOutlined, SafetyOutlined, RocketOutlined, CheckCircleFilled } from '@ant-design/icons';
import { loginUser } from '../services/api';
import { SuccessModal, ErrorModal } from '../components/modals';
import './../styles/LoginPage.css';

const { Title, Text } = Typography;

const LoginPage = ({ setCurrentUser }) => {
    const [loading, setLoading] = useState(false);
    const [hoveredFeature, setHoveredFeature] = useState(null);
    const [modalConfig, setModalConfig] = useState({
        open: false,
        type: '', // 'success' or 'error'
        title: '',
        content: '',
    });
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const user = await loginUser(values.email, values.password);
            if (user) {
                // Set loading to false first
                setLoading(false);
                // Show modal immediately with user data stored
                setModalConfig({
                    open: true,
                    type: 'success',
                    title: 'Login Berhasil! 🎉',
                    content: `Selamat datang kembali, ${user.nama}! Anda akan diarahkan ke halaman customer.`,
                    userData: user, // Store user data in modal config
                });
            } else {
                setLoading(false);
                setModalConfig({
                    open: true,
                    type: 'error',
                    title: 'Login Gagal! ❌',
                    content: 'Email atau password yang Anda masukkan salah. Silakan coba lagi.',
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoading(false);
            setModalConfig({
                open: true,
                type: 'error',
                title: 'Terjadi Kesalahan! ⚠️',
                content: 'Terjadi kesalahan saat melakukan login. Silakan coba beberapa saat lagi.',
            });
        }
    };

    const handleModalClose = () => {
        const isSuccess = modalConfig.type === 'success';
        setModalConfig({ ...modalConfig, open: false });
        
        // If login was successful, set user and navigate
        if (isSuccess && modalConfig.userData) {
            setCurrentUser(modalConfig.userData);
            setTimeout(() => {
                navigate('/customer');
            }, 300);
        }
    };

    const features = [
        {
            icon: <ThunderboltOutlined />,
            title: 'Transaksi Cepat',
            desc: 'Proses instan & real-time',
            color: '#667eea'
        },
        {
            icon: <SafetyOutlined />,
            title: 'Aman Terpercaya',
            desc: 'Data terenkripsi dengan baik',
            color: '#10B981'
        },
        {
            icon: <RocketOutlined />,
            title: 'Mudah Digunakan',
            desc: 'Interface intuitif & modern',
            color: '#F59E0B'
        }
    ];

    return (
        <div className="login-container">
            <div className="bg-circle-1" />
            <div className="bg-circle-2" />

            <div className="login-content">
                <div className="login-wrapper">
                    {/* Left Side - Branding */}
                    <div className="branding-section">
                        <div>
                            <div className="logo-container">
                                <ShoppingOutlined className="logo-icon" />
                            </div>

                            <Title level={1} className="brand-title">
                                Digital Kuota
                            </Title>
                            <Text className="brand-subtitle">
                                Platform pembelian paket data internet terpercaya dengan harga terbaik
                            </Text>
                        </div>

                        {/* Quick Stats */}
                        <div className="stats-container">
                            {[
                                { value: '500+', label: 'Happy Customers' },
                                { value: '1000+', label: 'Transactions' },
                                { value: '24/7', label: 'Support' }
                            ].map((stat, idx) => (
                                <div className="stat-card" key={idx}>
                                    <Title level={3} className="stat-value">
                                        {stat.value}
                                    </Title>
                                    <Text className="stat-label">
                                        {stat.label}
                                    </Text>
                                </div>
                            ))}
                        </div>

                        {/* Features */}
                        <div className="features-container">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="feature-item"
                                    style={{
                                        background: hoveredFeature === index
                                            ? 'rgba(255, 255, 255, 0.2)'
                                            : 'rgba(255, 255, 255, 0.12)',
                                    }}
                                    onMouseEnter={() => setHoveredFeature(index)}
                                    onMouseLeave={() => setHoveredFeature(null)}
                                >
                                    <div
                                        className="feature-icon"
                                        style={{
                                            transform: hoveredFeature === index ? 'scale(1.1)' : 'scale(1)',
                                        }}
                                    >
                                        {feature.icon}
                                    </div>
                                    <div className="feature-content">
                                        <Text strong className="feature-title">
                                            {feature.title}
                                        </Text>
                                        <Text className="feature-desc">
                                            {feature.desc}
                                        </Text>
                                    </div>
                                    <CheckCircleFilled className="feature-check" />
                                </div>
                            ))}
                        </div>

                        {/* Trust Badge */}
                        <div className="trust-badge">
                            <Text className="trust-text">
                                💡 <strong>Tip:</strong> Gunakan paket data sesuai kebutuhan Anda. Hemat lebih banyak dengan paket bulanan!
                            </Text>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <Card
                        className="login-card"
                        style={{
                            boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
                            borderRadius: '22px',
                            border: 'none',
                            background: 'white',
                        }}
                        styles={{ body: { padding: '2.25vh 2vw' } }}
                    >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            {/* Header */}
                            <div className="card-header">
                                <div className="card-logo-container">
                                    <ShoppingOutlined className="card-logo-icon" />
                                    <div className="card-badge">
                                        <CheckCircleFilled className="card-badge-icon" />
                                    </div>
                                </div>
                                <Title level={2} className="card-title">
                                    Selamat Datang
                                </Title>
                                <Text type="secondary" className="card-subtitle">
                                    Masuk ke akun Anda untuk melanjutkan
                                </Text>
                            </div>

                            <Divider style={{ margin: '1vh 0' }} />

                            {/* Form Login */}
                            <Form
                                name="login"
                                onFinish={onFinish}
                                layout="vertical"
                                size="large"
                            >
                                <Form.Item
                                    name="email"
                                    label={<span className="form-label">Email</span>}
                                    rules={[
                                        { required: true, message: 'Email wajib diisi!' },
                                        { type: 'email', message: 'Format email tidak valid!' }
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined style={{ color: '#667eea' }} />}
                                        placeholder="customer@test.com"
                                        className="form-input"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label={<span className="form-label">Password</span>}
                                    rules={[{ required: true, message: 'Password wajib diisi!' }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined style={{ color: '#667eea' }} />}
                                        placeholder="Masukkan password Anda"
                                        className="form-input"
                                    />
                                </Form.Item>

                                <Form.Item style={{ marginBottom: 0, marginTop: '1.5vh' }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        loading={loading}
                                        className="form-button"
                                    >
                                        {loading ? 'Loading...' : 'Masuk Sekarang'}
                                    </Button>
                                </Form.Item>
                            </Form>

                            <Divider style={{ margin: '0.5vh 0' }}>
                                <Text type="secondary" style={{ fontSize: 'clamp(9px, 0.6875vw, 11px)' }}>Demo Account</Text>
                            </Divider>

                            {/* Demo Credentials */}
                            <div className="demo-box">
                                <Text strong className="demo-title">
                                    🔐 Gunakan Akun Demo
                                </Text>
                                <Text type="secondary" className="demo-text">
                                    <strong>Email:</strong> customer@test.com
                                </Text>
                                <Text type="secondary" className="demo-text">
                                    <strong>Password:</strong> password123
                                </Text>
                            </div>
                        </Space>
                    </Card>
                </div>
            </div>

            {/* Success/Error Modal */}
            {modalConfig.type === 'success' ? (
                <SuccessModal
                    open={modalConfig.open}
                    title={modalConfig.title}
                    content={modalConfig.content}
                    onOk={handleModalClose}
                    onCancel={handleModalClose}
                />
            ) : (
                <ErrorModal
                    open={modalConfig.open}
                    title={modalConfig.title}
                    content={modalConfig.content}
                    onOk={handleModalClose}
                    onCancel={handleModalClose}
                />
            )}
        </div>
    );
};

export default LoginPage;
import { Modal, Typography } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * Error Modal - Reusable component for error notifications
 * @param {boolean} open - Modal visibility state
 * @param {string} title - Modal title
 * @param {string} content - Modal content/message
 * @param {function} onOk - Callback when OK button clicked
 * @param {function} onCancel - Callback when Cancel/Close clicked
 * @param {string} okText - Text for OK button (default: "Coba Lagi")
 */
const ErrorModal = ({ 
  open, 
  title = 'Terjadi Kesalahan! ❌', 
  content, 
  onOk, 
  onCancel,
  okText = 'Coba Lagi',
  ...props 
}) => {
  return (
    <Modal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <button
          key="ok"
          onClick={onOk}
          style={{
            background: '#EF4444',
            borderColor: '#EF4444',
            color: 'white',
            padding: '8px 24px',
            borderRadius: '8px',
            border: '1px solid',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#DC2626';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#EF4444';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          {okText}
        </button>
      ]}
      centered
      styles={{
        body: { 
          padding: '24px',
          textAlign: 'center'
        }
      }}
      {...props}
    >
      <div style={{ textAlign: 'center' }}>
        <CloseCircleOutlined 
          style={{ 
            fontSize: '64px', 
            color: '#EF4444',
            marginBottom: '16px'
          }} 
        />
        <Title level={3} style={{ marginBottom: '8px', marginTop: '16px' }}>
          {title}
        </Title>
        <Text type="secondary" style={{ fontSize: '15px' }}>
          {content}
        </Text>
      </div>
    </Modal>
  );
};

export default ErrorModal;

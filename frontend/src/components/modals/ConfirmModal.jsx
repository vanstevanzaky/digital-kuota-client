import { Modal, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * Confirm Modal - Reusable component for confirmation dialogs
 * @param {boolean} open - Modal visibility state
 * @param {string} title - Modal title
 * @param {string} content - Modal content/message
 * @param {ReactNode} children - Additional content (for detailed info)
 * @param {function} onOk - Callback when OK button clicked
 * @param {function} onCancel - Callback when Cancel button clicked
 * @param {string} okText - Text for OK button (default: "Ya, Lanjutkan")
 * @param {string} cancelText - Text for Cancel button (default: "Batal")
 * @param {boolean} danger - Whether this is a dangerous action (default: false)
 */
const ConfirmModal = ({ 
  open, 
  title = 'Konfirmasi', 
  content, 
  children,
  onOk, 
  onCancel,
  okText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  danger = false,
  ...props 
}) => {
  return (
    <Modal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      centered
      width={450}
      okButtonProps={{
        danger: danger,
        style: {
          background: danger ? '#ff4d4f' : '#667eea',
          borderColor: danger ? '#ff4d4f' : '#667eea',
        }
      }}
      styles={{
        body: { 
          padding: '24px',
          textAlign: 'center'
        }
      }}
      {...props}
    >
      <div style={{ textAlign: 'center' }}>
        <ExclamationCircleOutlined 
          style={{ 
            fontSize: '64px', 
            color: danger ? '#ff4d4f' : '#faad14',
            marginBottom: '16px'
          }} 
        />
        <Title level={3} style={{ marginBottom: '8px', marginTop: '16px' }}>
          {title}
        </Title>
        <Text type="secondary" style={{ fontSize: '15px', display: 'block', marginBottom: children ? '16px' : '0' }}>
          {content}
        </Text>
        {children}
      </div>
    </Modal>
  );
};

export default ConfirmModal;

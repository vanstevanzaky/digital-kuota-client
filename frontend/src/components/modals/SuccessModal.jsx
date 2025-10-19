import { Modal, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * Success Modal - Reusable component for success notifications
 * @param {boolean} open - Modal visibility state
 * @param {string} title - Modal title
 * @param {string} content - Modal content/message
 * @param {function} onOk - Callback when OK button clicked
 * @param {function} onCancel - Callback when Cancel/Close clicked
 * @param {string} okText - Text for OK button (default: "OK, Mengerti")
 */
const SuccessModal = ({ 
  open, 
  title = 'Berhasil! 🎉', 
  content, 
  onOk, 
  onCancel,
  okText = 'OK, Mengerti',
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
            background: '#10B981',
            borderColor: '#10B981',
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
            e.target.style.background = '#059669';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#10B981';
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
        <CheckCircleOutlined 
          style={{ 
            fontSize: '64px', 
            color: '#10B981',
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

export default SuccessModal;

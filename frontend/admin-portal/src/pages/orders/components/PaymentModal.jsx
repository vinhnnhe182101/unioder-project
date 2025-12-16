import { useState } from 'react';
import { Modal, Form, Radio, InputNumber, Button, message, Result, Image, Typography, Space, Input } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import paymentService from '../../../services/paymentService.js';

const { Text } = Typography;

const PaymentModal = ({ open, onCancel, order }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState(null); // Lưu URL ảnh QR
    const [currentPaymentId, setCurrentPaymentId] = useState(null); // Lưu ID thanh toán đang xử lý
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const queryClient = useQueryClient();
    const [form] = Form.useForm();

    // Mutation 1: Tạo thanh toán
    const createPaymentMutation = useMutation({
        mutationFn: (data) => paymentService.createPayment(order.orderId, data),
        onSuccess: (res) => {
            console.log('Payment response:', res);
            const responseData = res.data || res;

            console.log('Payment data:', responseData);
            console.log('Status:', responseData.status);
            console.log('Method:', responseData.method);
            console.log('QR URL:', responseData.qrUrl);
            if (responseData.method === 'BANK_TRANSFER' && responseData.qrUrl) {
                console.log('Setting QR URL:', responseData.qrUrl);
                setQrCodeUrl(responseData.qrUrl);
                setCurrentPaymentId(responseData.paymentId);
                message.info('Vui lòng quét mã QR để thanh toán');
            }
            // Sau đó mới kiểm tra SUCCEEDED
            else if (responseData.status === 'SUCCEEDED') {
                message.success('Thanh toán thành công!');
                setPaymentSuccess(true);
                queryClient.invalidateQueries(['orders']);
            }
            // Nếu là PENDING nhưng không phải BANK_TRANSFER
            else if (responseData.status === 'PENDING') {
                message.info('Thanh toán đang chờ xử lý...');
            }
        },
        onError: (err) => message.error('Lỗi tạo thanh toán: ' + err.message)
    });

    // Mutation 2: Xác nhận đã nhận tiền (Cho QR)
    const confirmPaymentMutation = useMutation({
        mutationFn: (paymentId) => paymentService.confirmPayment(paymentId),
        onSuccess: () => {
            message.success('Xác nhận đã nhận tiền!');
            setPaymentSuccess(true);
            queryClient.invalidateQueries(['orders']);
        },
        onError: (err) => message.error('Lỗi xác nhận: ' + err.message)
    });

    const handleCreatePayment = (values) => {
        createPaymentMutation.mutate({
            method: values.method,
            amount: values.amount,
            note: values.note
        });
    };

    const handleConfirmTransfer = () => {
        if (currentPaymentId) {
            confirmPaymentMutation.mutate(currentPaymentId);
        }
    };

    const handleClose = () => {
        // Reset state khi đóng
        setQrCodeUrl(null);
        setPaymentSuccess(false);
        setCurrentPaymentId(null);
        form.resetFields();
        onCancel();
    };

    // Giao diện khi thanh toán xong
    if (paymentSuccess) {
        return (
            <Modal open={open} onCancel={handleClose} footer={null} centered>
                <Result
                    status="success"
                    title="Thanh toán hoàn tất!"
                    subTitle={`Đơn hàng #${order?.orderNumber} đã được thanh toán.`}
                    extra={[
                        <Button type="primary" key="close" onClick={handleClose}>
                            Đóng
                        </Button>,
                        <Button key="print">In hóa đơn</Button>
                    ]}
                />
            </Modal>
        );
    }

    return (
        <Modal
            title={`Thanh toán đơn hàng #${order?.orderNumber}`}
            open={open}
            onCancel={handleClose}
            footer={null}
            width={qrCodeUrl ? 400 : 500} // Thu nhỏ modal nếu hiện QR
        >
            {/* Trường hợp 1: Đang hiển thị mã QR để quét */}
            {qrCodeUrl ? (
                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">Khách hàng quét mã VietQR bên dưới:</Text>
                    <div style={{ margin: '16px 0', border: '1px solid #eee', padding: 8, borderRadius: 8 }}>
                        {/* [TRẢ LỜI CÂU HỎI CỦA BẠN] Hiển thị ảnh từ URL backend trả về */}
                        <Image
                            src={qrCodeUrl}
                            width={250}
                            preview={false} // Không cần click phóng to
                            placeholder={<div style={{height: 250, display:'flex', alignItems:'center', justifyContent:'center'}}>Đang tải QR...</div>}
                        />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order?.totalAmount)}
                        </Text>
                    </div>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Button
                            type="primary"
                            block
                            size="large"
                            loading={confirmPaymentMutation.isPending}
                            onClick={handleConfirmTransfer}
                        >
                            Xác nhận Đã Nhận Tiền
                        </Button>
                        <Button block onClick={() => setQrCodeUrl(null)}>Quay lại chọn phương thức</Button>
                    </Space>
                </div>
            ) : (
                /* Trường hợp 2: Form chọn phương thức thanh toán */
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreatePayment}
                    initialValues={{
                        method: 'CASH',
                        amount: order?.totalAmount
                    }}
                >
                    <Form.Item name="amount" label="Số tiền thanh toán">
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            addonAfter="₫"
                        />
                    </Form.Item>

                    <Form.Item name="method" label="Phương thức">
                        <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
                            <Radio.Button value="CASH" style={{ width: '50%', textAlign: 'center' }}>Tiền mặt</Radio.Button>
                            <Radio.Button value="BANK_TRANSFER" style={{ width: '50%', textAlign: 'center' }}>Chuyển khoản (QR)</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item name="note" label="Ghi chú">
                        <Input.TextArea rows={2} placeholder="VD: Khách đưa 500k..." />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block size="large" loading={createPaymentMutation.isPending}>
                        Xác nhận Thanh toán
                    </Button>
                </Form>
            )}
        </Modal>
    );
};

export default PaymentModal;
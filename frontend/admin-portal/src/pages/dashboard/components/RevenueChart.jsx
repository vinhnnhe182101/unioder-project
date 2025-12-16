import { useState } from 'react';
import { Column } from '@ant-design/plots'; // Cần cài thư viện này: npm install @ant-design/plots
import { Card, DatePicker, Radio, Empty, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import reportService from '../../../services/reportService'; // Đảm bảo đường dẫn đúng
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const RevenueChart = () => {
    const [type, setType] = useState('DAY');
    // Mặc định lấy 7 ngày gần nhất
    const [dateRange, setDateRange] = useState([dayjs().subtract(6, 'd'), dayjs()]);

    // Fetch dữ liệu từ API
    const { data: revenueData, isLoading } = useQuery({
        queryKey: ['revenue', type, dateRange],
        queryFn: async () => {
            if (!dateRange || !dateRange[0] || !dateRange[1]) return [];
            try {
                const res = await reportService.getRevenue(
                    type,
                    dateRange[0].format('YYYY-MM-DD'),
                    dateRange[1].format('YYYY-MM-DD')
                );
                return res;
            } catch (error) {
                console.error("Lỗi tải báo cáo doanh thu:", error);
                return [];
            }
        },
        enabled: !!dateRange, // Chỉ gọi khi có range
    });

    // Cấu hình biểu đồ cột
    const config = {
        data: revenueData || [],
        xField: 'timePoint',
        yField: 'totalRevenue',
        label: {
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        meta: {
            timePoint: { alias: 'Thời gian' },
            totalRevenue: {
                alias: 'Doanh thu',
                formatter: (v) => `${new Intl.NumberFormat('vi-VN').format(v)}đ`
            },
        },
        tooltip: {
            formatter: (datum) => {
                return { name: 'Doanh thu', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(datum.totalRevenue) };
            },
        },
        color: '#1890ff',
    };

    return (
        <Card
            title="Biểu đồ Doanh thu"
            extra={
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Radio.Group value={type} onChange={e => setType(e.target.value)} size="small">
                        <Radio.Button value="DAY">Ngày</Radio.Button>
                        <Radio.Button value="MONTH">Tháng</Radio.Button>
                    </Radio.Group>
                    <RangePicker
                        value={dateRange}
                        onChange={val => setDateRange(val)}
                        allowClear={false}
                        size="small"
                        style={{ width: 240 }}
                    />
                </div>
            }
        >
            {isLoading ? (
                <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin tip="Đang tải dữ liệu..." />
                </div>
            ) : (revenueData && revenueData.length > 0) ? (
                <Column {...config} height={300} />
            ) : (
                <Empty description="Chưa có dữ liệu doanh thu trong khoảng thời gian này" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </Card>
    );
};

export default RevenueChart;
import axiosClient from '../config/axiosConfig';

const BASE_URL = '/restaurants';

const staffService = {
    // Lấy danh sách nhân viên theo nhà hàng
    getStaffList: (restaurantId) => {
        return axiosClient.get(`${BASE_URL}/${restaurantId}/staff`);
    },

    // Thêm nhân viên mới bằng Email và Vai trò
    addStaff: (restaurantId, email, roleName) => {
        return axiosClient.post(
            `${BASE_URL}/${restaurantId}/staff`,
            null,
            {
                params: { email, roleName }
            }
        );
    },

    // Xóa nhân viên khỏi nhà hàng
    removeStaff: (restaurantId, userId, roleName) => {
        return axiosClient.delete(
            `${BASE_URL}/${restaurantId}/staff/${userId}`,
            {
                params: { roleName }
            }
        );
    }
};

export default staffService;

// Script đăng nhập admin để có thể cập nhật biểu tượng danh mục
const adminLogin = async () => {
  try {
    const loginResponse = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    if (loginResponse.ok) {
      const userData = await loginResponse.json();
      console.log('✓ Đăng nhập thành công:', userData);
      return userData;
    } else {
      console.error('✗ Đăng nhập thất bại');
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    return null;
  }
};

adminLogin();
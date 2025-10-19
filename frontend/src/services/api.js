import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// ============ AUTH API ============
export const loginUser = async (email, password) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params: { email, password }
    });
    return response.data[0] || null; // Return user pertama atau null
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

// ============ USER/CUSTOMER API ============
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

// ============ PAKET DATA API ============
export const getAllPaket = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paketData`);
    return response.data;
  } catch (error) {
    console.error('Get paket error:', error);
    throw error;
  }
};

export const getPaketById = async (paketId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paketData/${paketId}`);
    return response.data;
  } catch (error) {
    console.error('Get paket by id error:', error);
    throw error;
  }
};

// ============ TRANSAKSI API ============
export const createTransaksi = async (transaksiData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/transaksi`, transaksiData);
    return response.data;
  } catch (error) {
    console.error('Create transaksi error:', error);
    throw error;
  }
};

export const getTransaksiByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transaksi`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Get transaksi error:', error);
    throw error;
  }
};

export const deleteTransaksi = async (transaksiId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/transaksi/${transaksiId}`);
    return response.data;
  } catch (error) {
    console.error('Delete transaksi error:', error);
    throw error;
  }
};

// ============ HELPER: Update Saldo User ============
export const updateSaldo = async (userId, newSaldo) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/users/${userId}`, {
      saldo: newSaldo
    });
    return response.data;
  } catch (error) {
    console.error('Update saldo error:', error);
    throw error;
  }
};
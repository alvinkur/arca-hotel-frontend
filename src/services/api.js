import axios from 'axios';

<<<<<<< HEAD
const API_BASE = '';
const API_TIMEOUT = 10000;

const api = axios.create({
  baseURL: API_BASE,
  timeout: API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// ── JWT Token Management ─────────────────────────────────────

const TOKEN_KEY = 'jwt_token';

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = () => {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (stored && !api.defaults.headers.common['Authorization']) {
    api.defaults.headers.common['Authorization'] = `Bearer ${stored}`;
  }
  return stored;
};

export const clearAuth = () => {
  setAuthToken(null);
  localStorage.removeItem('currentUser');
};

// Restore token on module load on client-side only
if (typeof window !== 'undefined') {
  getAuthToken();
}

// ── Response interceptor: handle 401 globally ────────────────

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      // Only redirect if not already on a public page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Weather (kept from original — no auth needed) ────────────

export const getLombokWeather = async () => {
  const res = await axios.get(
    'https://api.open-meteo.com/v1/forecast?latitude=-8.65&longitude=116.32&current_weather=true'
  );
  return res.data.current_weather;
};

// ── Auth Endpoints (public) ──────────────────────────────────

export const register = async (name, email, password, phoneNumber) => {
  const res = await api.post('/api/register', {
    name,
    email,
    password,
    phone_number: phoneNumber,
  });
  return res.data; // { id_customer, name, email, phone_number }
};

export const login = async (email, password, role) => {
  const res = await api.post('/api/login', { email, password, role });
  return res.data; // { token, user: { id, name, email, role } }
};

// ── Room Endpoints (auth required) ───────────────────────────

export const getRooms = async () => {
  const res = await api.get('/api/rooms');
  return res.data; // [{ id_room, room_number, id_room_type, availability, room_type }]
};

export const getRoom = async (id) => {
  const res = await api.get(`/api/rooms/${id}`);
  return res.data;
};

export const getRoomTypes = async () => {
  const res = await api.get('/api/room-types');
  return res.data; // [{ id_room_type, name, price, description }]
};

export const updateRoomType = async (id, data) => {
  const res = await api.put(`/api/room-types/${id}`, data);
  return res.data;
};

// ── Booking Endpoints (auth required) ────────────────────────

export const getBookings = async () => {
  const res = await api.get('/api/bookings');
  return res.data; // [{ id_booking, id_customer, id_room, date_in, date_out, total_payment, status_payment }]
};

export const getBooking = async (id) => {
  const res = await api.get(`/api/bookings/${id}`);
  return res.data;
};

export const createBooking = async (data) => {
  const res = await api.post('/api/bookings', {
    id_customer: data.id_customer,
    id_room: data.id_room,
    date_in: data.date_in,
    date_out: data.date_out,
    total_payment: data.total_payment,
    status_payment: data.status_payment || 'pending',
  });
  return res.data;
};

export const updateBooking = async (id, data) => {
  const res = await api.put(`/api/bookings/${id}`, data);
  return res.data;
};

export const deleteBooking = async (id) => {
  const res = await api.delete(`/api/bookings/${id}`);
  return res.data;
};

// ── Payment Endpoints (auth required) ────────────────────────

export const getPayments = async () => {
  const res = await api.get('/api/payments');
  return res.data;
};

export const createPayment = async (data) => {
  const res = await api.post('/api/payments', {
    id_booking: data.id_booking,
    total_payment: data.total_payment,
    method: data.method,
    date: data.date || new Date().toISOString(),
    status: data.status || 'paid',
  });
  return res.data;
};

export const updatePayment = async (id, data) => {
  const res = await api.put(`/api/payments/${id}`, data);
  return res.data;
};

// ── AI Endpoints (public) ────────────────────────────────────

export const recommendRoom = async (message) => {
  const res = await api.post('/ai-recommend', { message });
  return res.data.reply;
};

export const travelPlan = async (idBooking, message) => {
  const res = await api.post('/ai-travel-plan', {
    id_booking: idBooking,
    message: message || '',
  });
  if (!res.data.reply) throw new Error(res.data.error || 'Gagal mendapatkan rekomendasi');
  return res.data.reply;
};

// ── Customer/Staff/Owner (for admin dashboards) ──────────────

export const getCustomers = async () => {
  const res = await api.get('/api/customers');
  return res.data;
=======
// Buat instance Axios dengan konfigurasi dasar (HTTPS)
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // URL dummy public untuk demo POST request
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout 10 detik
});

/**
 * Mengirim data pemesanan kamar (POST HTTPS Request)
 * @param {Object} bookingData - Data dari form pemesanan
 * @returns {Promise<Object>} data respon dari server
 */
export const submitBooking = async (bookingData) => {
  try {
    // Melakukan POST ke endpoint dummy
    const response = await api.post('/posts', {
      title: `Booking oleh ${bookingData.guestName} untuk ${bookingData.roomType}`,
      body: JSON.stringify(bookingData),
      userId: 1,
    });
    return response.data;
  } catch (error) {
    console.error('Gagal mengirim pemesanan via Axios:', error);
    throw error;
  }
};

/**
 * Mengambil cuaca Lombok secara langsung (GET HTTPS Request)
 * Menggunakan API Cuaca Terbuka (Open-Meteo) tanpa perlu API Key
 * @returns {Promise<Object>} data cuaca saat ini
 */
export const getLombokWeather = async () => {
  try {
    // GET request ke API cuaca Lombok (Lombok coordinates: Lat -8.65, Lon 116.32)
    const response = await axios.get(
      'https://api.open-meteo.com/v1/forecast?latitude=-8.65&longitude=116.32&current_weather=true'
    );
    return response.data.current_weather;
  } catch (error) {
    console.error('Gagal mengambil data cuaca Lombok via Axios:', error);
    throw error;
  }
>>>>>>> upstream/main
};

export default api;


//PROD
export const API_BASE_URL = 'https://talariafitsbackend.uk.r.appspot.com';

//DEV
//export const API_BASE_URL = 'http://172.20.4.50:5020';

export const API_ENDPOINTS = {
    login: `${API_BASE_URL}/user/login`,
    signup: `${API_BASE_URL}/user/signup`,
    userInfo: `${API_BASE_URL}/user/info`,
    forgotPassword: `${API_BASE_URL}/user/forgot-password`,
    verifyCode: `${API_BASE_URL}/user/verify-code`,
verifyAccount: `${API_BASE_URL}/user/verify-account`,
    changePassword: `${API_BASE_URL}/user/change-password`,
    googleLogin: `${API_BASE_URL}/user/google-login`,
    fbLogin: `${API_BASE_URL}/user/fb-login`,
} as const; 
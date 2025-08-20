export const ENV_VARIABLES = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    DATABASE_URL: process.env.DATABASE_URL || '',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
} as const;


export const ROUTES = {
    DASHBOARD: '/',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_OTP: '/auth/verify-otp',
    },

    TRANSACTIONS: {
        INDEX: '/transactions',
        CREATE: '/transactions/create',
        VIEW: (id: string) => `/transactions/${id}`,
    },
    COMMISSIONS: {
        INDEX: '/commissions',
        CREATE: '/commissions/create',
        EDIT: (id: string) => `/commissions/edit/${id}`,
        VIEW: (id: string) => `/commissions/view/${id}`,
    },
    MERCHANTS: {
        INDEX: '/merchants',
        CREATE: '/merchants/create',
        EDIT: (id: string) => `/merchants/edit/${id}`,
        VIEW: (id: string) => `/merchants/view/${id}`,
        ONBOARDING: {
            MERCHANT_DETAILS: '/merchants/onboarding/merchant-details',
            SETTLEMENT_DETAILS: '/merchants/onboarding/settlement-details',
            USER_DETAILS: '/merchants/onboarding/user-details',
            BANK_DETAILS: '/merchants/onboarding/bank-details',
            OVA_DETAILS: '/merchants/onboarding/ova-details',
        },
    },
    SUB_MERCHANTS: {
        INDEX: '/sub-merchants',
        CREATE: '/sub-merchants/create',
        EDIT: (id: string) => `/sub-merchants/edit/${id}`,
        VIEW: (id: string) => `/sub-merchants/view/${id}`,
    },
    API_KEYS: {
        INDEX: '/api-keys',
        CREATE: '/api-keys/create',
        EDIT: (id: string) => `/api-keys/edit/${id}`,
        VIEW: (id: string) => `/api-keys/view/${id}`,
    },
    USERS: {
        INDEX: '/users',
        CREATE: '/users/create',
        EDIT: (id: string) => `/users/edit/${id}`,
        VIEW: (id: string) => `/users/view/${id}`,
    },

    PARTNER_BANKS: {
        INDEX: '/partner-banks',
        CREATE: '/partner-banks/create',
        EDIT: (id: string) => `/partner-banks/edit/${id}`,
        VIEW: (id: string) => `/partner-banks/view/${id}`,
        ONBOARDING: {
            BASIC_DETAILS: '/partner-banks/onboarding/basic-details',
            COMMISSION_DETAILS: '/partner-banks/onboarding/commission-details',
            SETTLEMENT_DETAILS: '/partner-banks/onboarding/settlement-details',
            CONFIGURATION: '/partner-banks/onboarding/configuration',
        },
    },
    DEVICES: {
        INDEX: '/devices',
        CREATE: '/devices/create',
        EDIT: (id: string) => `/devices/edit/${id}`,
        VIEW: (id: string) => `/devices/view/${id}`,
    },
    SETTINGS: {
        INDEX: '/settings',
        PROFILE: '/settings/profile',
    },
    HELP: "/help",
    
    SETTLEMENTS: {
        INDEX: '/settlements',
        CREATE: '/settlements/create',
        EDIT: (id: string) => `/settlements/edit/${id}`,
        VIEW: (id: string) => `/settlements/view/${id}`,
    },
    TELCOS: {
        INDEX: '/telcos',
        CREATE: '/telcos/create',
        EDIT: (id: string) => `/telcos/edit/${id}`,
        VIEW: (id: string) => `/telcos/view/${id}`,
    },
    CASHOUT: {
        INDEX: '/cashout',
    },
    REMITTANCE: {
        INDEX: '/remittance',
    },
    SP_TRANSFERS: {
        INDEX: '/sp-transfers',
    },

} as const;
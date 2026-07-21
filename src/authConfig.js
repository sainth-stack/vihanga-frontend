import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: "870aa9bf-3c1b-49ff-b74a-90f843025992",
        authority: "https://login.microsoftonline.com/bchaneelkumarhotmail.onmicrosoft.com",
        redirectUri: "/dashboard",
        postLogoutRedirectUri: "/login",
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
};

const pca = new PublicClientApplication(msalConfig);

export async function loginWithMicrosoft() {
    const loginRequest = {
        scopes: ['user.read'],
    };

    try {
        const loginResponse = await pca.loginPopup(loginRequest);
        console.log('Login success', loginResponse);
        return loginResponse;
        // Handle successful login (e.g., fetch user details)
    } catch (error) {
        console.error('Login error', error);
    }
}

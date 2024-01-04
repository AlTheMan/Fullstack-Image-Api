const fetch = require('node-fetch');

export async function getKeycloakToken() {
    const tokenEndpoint = 'https://keycloak-dev.vm-app.cloud.cbh.kth.se/realms/journalrealm/protocol/openid-connect/token';
    const clientId = 'testclient2';
    const username = 'test@mail.com';
    const password = '1234';

    const params = new URLSearchParams();
    params.append('grant_type', 'password'); // Or 'client_credentials'
    params.append('client_id', clientId);
    params.append('username', username); // For 'password' grant type
    params.append('password', password); // For 'password' grant type

    try {
        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.access_token; // The token you need
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
}

getKeycloakToken().then(token => {
    console.log('Token:', token);
});

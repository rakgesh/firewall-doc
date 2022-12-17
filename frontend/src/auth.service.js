import createAuth0Client from "@auth0/auth0-spa-js";
import { user, isAuthenticated, jwt_token } from "./store";
import config from "./auth.config";

let auth0Client;

async function createClient() {
  auth0Client = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId
  });
}

async function loginWithPopup() {
  try {
    await createClient();
    await auth0Client.loginWithPopup();
    user.set(await auth0Client.getUser());
    const claims = await auth0Client.getIdTokenClaims();
    const id_token = await claims.__raw;
    jwt_token.set(id_token);
    console.log(id_token);
    isAuthenticated.set(true);
  } catch (e) {
    console.error(e);
  } 
}

function logout() {
  return auth0Client.logout();
}

const auth = {
  createClient,
  loginWithPopup,
  logout
};

export default auth;
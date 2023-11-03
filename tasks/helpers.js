import fetch from "node-fetch";
import { getSecret } from "@dashkite/dolores/secrets";
import { confidential } from "panda-confidential";
import getGOBOClient from "../src/index.js";

const Confidential = confidential();

const random = async function ( config = {} ) {
  const { length = 16, encoding = "base36" } = config

  return Confidential.convert({ from: "bytes", to: encoding }, 
    await Confidential.randomBytes(length) );
};

const getFlag = function ( name, config ) {
  const value = config.args[ name ];
  if ( value == null ) {
    throw new Error( `command flag \"${ name }\" is not set.` );
  }
  return value;
};

const getToken = async function () {
  const response = await fetch(
    "https://auth.gobo.social/oauth/token", {
    method: "POST",
    headers: { 
      "content-type": "application/json"
    },
    body: JSON.stringify({ 
      grant_type: "password",
      username: await getSecret("gobo-client-login-test/email"),
      password: await getSecret("gobo-client-login-test/password"),
      audience: "https://gobo.social/api",
      scope: "admin general",
      client_id: await getSecret("gobo-client-login-test/client-id"),
      client_secret: await getSecret("gobo-client-login-test/client-secret") 
    })
  });
  
  const { access_token } = await response.json();
  return access_token;
};

const getGOBO = async function (config) {
  if ( config.gobo == null ) {
    throw new Error( "There is no GOBO config specified for this environment" );
  }

  const token = await getToken();  

  return await getGOBOClient({ ...config.gobo, token, fetch });
};

export {
  getFlag,
  getGOBO,
  random
}
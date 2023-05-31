import FS from "node:fs/promises";
import Path from "node:path";
import fetch from "node-fetch";
import YAML from "js-yaml";
import AJV from "ajv"
import assert from "./assert.js";
import amen from "@dashkite/amen";
import { confidential } from "panda-confidential";
import getGOBOClient from "../src/index.js";

const { test } = amen;
const Confidential = confidential();
const ajv = new AJV();


const getConfiguration = async function ( environment ) {
  const file = await FS.readFile( "test/configurations.yaml", "utf8" );
  const configurations = YAML.load( file );
  const configuration = configurations[ environment ];
  if ( configuration == null ) {
    throw new Error( `unable to find configuration for ${ environment }` );
  }
  return configuration;
};

const getGOBO = async function () {
  const environment = process.env.environment;
  if ( environment == null ) {
    throw new Error( "target environment is undefined" );
  }

  const configuration = await getConfiguration( environment );
  if ( configuration.gobo == null ) {
    throw new Error( "There is no GOBO configuration specified for this environment" );
  }

  return await getGOBOClient({ ...configuration.gobo, fetch });
};


const targets = (function () {
  const _targets = process.env.targets?.split( /\s+/ ) ?? [ "core" ]
  if ( !_targets.includes( "core" ) ) {
    _targets.push( "core" );
  }
  return _targets;
})();


const doesMatch = function ( name ) {
  for ( const target of targets ) {
    if ( target.startsWith(name) ) {
      return true;
    }
  }
  return false;
};

const target = function ( name, value ) {
  if ( targets.includes("all") ) {
    return value;
  } else if ( doesMatch(name) ) {
    return value;
  } else {
    return null;
  }
};

const random = async function ( config = {} ) {
  const { length = 16, encoding = "base36" } = config

  return Confidential.convert({ from: "bytes", to: encoding }, 
    await Confidential.randomBytes(length) );
};

const now = function () {
  return ( new Date ).toISOString();
}

const _test = function ( name, value ) {
  if ( Array.isArray(value) ) {
    return test( name, value );
  } else {
    return test({ description: name, wait: false }, value );
  }
};

const fail = async function ( status, f ) {
  try {
    response = await f();
  } catch (error) {
    if ( status !== error.status ) {
      console.log({ expected: status, actual: error.status });
    }
    assert.equal( status, error.status);
    return;
  }

  console.log({ expected: status, actual: response?.status });
  throw new Error( "response did not throw as expected" );
};


const conforms = function ( resources ) {
  return async function(name, method, json ) {

    const schema = resources[name]?.methods[method]?.response.schema;

    if ( schema == null ) {
      throw new Error(`the response resource ${name} ${method} is undefined`);
    }
    if (json == null) {
      throw new Error("404 response from API (null)");
    }

    let isValid;

    try {
      isValid = ajv.validate(schema, json);
    } catch (error) {
      console.error(error);
      throw error;
    }

    if (!isValid) {
      console.log(json);
      console.log(JSON.stringify(ajv.errors, null, 2));
      throw new Error("This resource does not conform to the specified schema.");
    }
  };
};

const partialEqual = function ( A, B, list ) {
  for ( const item of list ) {
    assert.equal( A[item], B[item] );
  }
}




export {
  getGOBO,
  target,
  random,
  now,
  _test as test,
  assert,
  fail,
  conforms,
  partialEqual
}

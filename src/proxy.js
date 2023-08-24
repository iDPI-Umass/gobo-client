import { parseTemplate } from 'url-template';
import * as Text from "@dashkite/joy/text";
import r from "./request-helpers.js";


const setToken = function ( options ) {
  return function ( token ) {
    options.token = token;
  };
};

const setProfile = function ( options ) {
  return function ( profile ) {
    options.profile = profile;
  };
};

const assemble = function ( resources, options ) {
  return new Proxy( {}, {
    get: function ( target, name ) {
      name = Text.underscored(Text.uncase(name));

      if ( name === "then" ) {
        return;
      } else if ( name === "spec") {
        return resources;
      } else if ( name === "set_token" ) {
        return setToken( options );
      } else if ( name === "set_profile" ) {
        return setProfile( options );
      } else if ( name === "id" ) {
        return options.profile?.id;
      } else if ( resources[ name ] == null ) {
        throw new Error( `resource [ ${ name } ] is not defined` );
      } else {
        const resource = resources[ name ];
        const context = { ...options, resource, name };
        return createResource( context );
      }
    }
  });
};


const createResource = function ( context ) {
  return new Proxy( {}, {
    get: function ( target, name ) {
      if ( name === "path" ) {
        return ( parameters ) => buildPath( context, parameters );
      } else if ( name === "url" ) {
        return ( parameters ) => buildURL( context, parameters );
      } else if ( context.resource.methods[ name ] != null ) {
        return createMethod( context, name );
      } else {
        let message = `HTTP method [ ${name.toLocaleUpperCase()} ] is not `
        message += `defined for resource [ ${context.name} ]`;
        throw new Error( message );
      }
    }
  });
};

const buildPath = function ( context, parameters={} ) {
  return parseTemplate( context.resource.template ).expand( parameters );
}

const buildURL = function ( context, parameters ) {
  const path = buildPath( context, parameters );
  return context.base + path;
}

const createMethod = function ( context, name ) {
  const issue = async function ( input={}, options={} ) {
    const { request, response } = context.resource.methods[name];
    
    let url = null;
    if ( ["get", "put", "delete"].includes(name) ) {
      url = buildURL( context, input );
    } else if ( ["post", "patch"] ) {
      url = buildURL( context, input.parameters );
    } else {
      throw new Error (`not prepared for method ${name}`);
    }
    
    const defaultHeaders = {};
    if ( request.type != null && request.type !== "multipart/form-data" ) {
      defaultHeaders[ "Content-Type" ] = request.type;
    }
    if ( response.type != null ) {
      defaultHeaders[ "Accept" ] = response.type;
    }

    let content = null;
    if ( ["post", "patch"].includes(name) ) {
      content = input.content;
    } else if ( ["put"].includes(name) ) {
      content = input;
    }

    const sublime = r.createSublime([
      r.fetch( context.fetch ),
      r.url( url ),
      r.method( name ),
      r.headers( context.headers ),
      r.headers( defaultHeaders ),
      r.headers( options.headers ),
      r.content( content ),
      r.token( context.token )
    ]);

    await sublime.issue();
    await sublime.success( response.status );

    const responseType = sublime.response.headers.get("Content-Type");

    if ( responseType === "application/json" ) {
      return await sublime.json();
    } else {
      return await sublime.text();
    }
  }

  return issue;
}





export {
  assemble
}
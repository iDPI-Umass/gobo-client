import { parseTemplate } from 'url-template';
import r from "./request-helpers.js";

const assemble = function ( resources, options ) {
  return new Proxy( {}, {
    get: function ( target, name ) {
      if ( name === "then" ) {
        return;
      } else if ( name === "spec") {
        return resources;
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
        return ( input, options ) => buildPath( context, input, options );
      } else if ( name === "url" ) {
        return ( input, options ) => buildURL( context, input, options );
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

const buildPath = function ( context, input, options={} ) {
  const parameters = Object.assign( {}, input, options.parameters );
  return parseTemplate( context.resource.template ).expand( parameters );
}

const buildURL = function ( context, input, options={} ) {
  const path = buildPath( context, input, options );
  return context.base + path;
}

const createMethod = function ( context, name ) {
  const issue = async function ( input, options={} ) {
    const { request, response } = context.resource.methods[name];
    const url = buildURL( context, input, options );

    const defaultHeaders = {};
    if ( request.type != null ) {
      defaultHeaders[ "Content-Type" ] = request.type;
    }
    if ( response.type != null ) {
      defaultHeaders[ "Accept" ] = response.type;
    }

    let content = null;
    if ( ["put", "post"].includes(name) ) {
      content = options.content ?? input;
    }


    const sublime = r.createSublime([
      r.fetch( context.fetch ),
      r.url( url ),
      r.method( name ),
      r.headers( context.headers ),
      r.headers( defaultHeaders ),
      r.headers( options.headers ),
      r.content( content )
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
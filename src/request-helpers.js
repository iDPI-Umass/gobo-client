import * as Fn from "@dashkite/joy/function";
import { Sublime } from "./sublime.js";

const lift = function ( f ) {
  return Fn.curry( Fn.rtee( f ));
}


const h = {};

h.fetch = lift( function( fetch, context ) {
  context.fetch = fetch;
});

h.base = lift( function( base, context ) {
  context.base = base;
});

h.url = lift( function( url, context ) {
  context.url = url;
});

h.method = lift( function( method, context ) {
  context.method = method;
});

h.content = lift( function( content, context ) {
  context.content = content;
});

h.headers = lift( function( headers, context ) {
  context.headers ??= {};
  Object.assign( context.headers, headers );
});

h.token = lift( function(token, context) {
  if ( token == null ) {
    return;
  }
  context.headers ??= {};
  Object.assign( context.headers, {
    Authorization: `Bearer ${ token }`
  });
});

h.key = lift( function(key, context) {
  if ( key == null ) {
    return;
  }
  context.headers ??= {};
  Object.assign( context.headers, {
    Authorization: `GoboKey ${ key }`
  });
});

h.debug = lift( function( debug, context ) {
  context.debug = debug;
});

h.createSublime = function( fx ) {
  return Sublime.create( fx );
};

export default h;
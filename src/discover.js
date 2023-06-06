import r from "./request-helpers.js";

const discover = async function ( options ) {
  const sublime = r.createSublime([
    r.fetch( options.fetch ),
    r.url( options.base ),
    r.method( "get" ),
    r.headers( options.headers )
  ]);

  await sublime.issue();
  await sublime.success( 200 );
  return await sublime.json();
};

export default discover
import discover from "./discover.js";
import * as proxy from "./proxy.js";


const GOBOClient = async function ( options ) {
  if ( options == null ) {
    throw new Error( "no configuration specified for GOBOClient" );
  }

  if ( options.base == null ) {
    throw new Error( "Base URL for GOBO API must be specified" );
  }

  if ( options.base.endsWith("/") ) {
    options.base = options.base.slice( 0, -1 );
  }

  if (typeof window === "undefined") {
    if ( options.fetch == null ) {
      throw new Error( "window.fetch is not available and no replacement is specified." );
    }
  }

  const { resources } = await discover( options );
  return proxy.assemble( resources, options );
}

export default GOBOClient
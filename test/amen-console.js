import chalk from "chalk";

const print = function ([description, result], indent="") {
  if ( Array.isArray(result) ) {
    console.error( indent, chalk.blue(description) );
    const output = [];
    for ( const r of result ) {
      output.push( print( r, ( indent + "  " ) ) );
    }
  
  } else {
    let second = null;
    if ( result != null ) {
      if ( result === true ) {
        second = chalk.green( description );
      } else if ( result.message != null && result.message !== "" ) {
        console.error(result.stack);
        second = chalk.red( `${description} (${result.message})` );
      } else {
        second = chalk.red( description );
      }
    } else {
      second = chalk.yellow( description );
    }

    console.error( indent, second ); 
  }
}

export default print
import amen from "@dashkite/amen";
import print from "./amen-console.js";
import * as h from "./helpers.js";

const { success } = amen;


import * as person from "./person/index.js";


(async function () {
  const $ = {
    h: h,
    gobo: await h.getGOBO(),
  };

  $.conforms = h.conforms( $.gobo.spec );


  print( await h.test( "GOBO Client", [
    await h.test( "CRUD", [
      await h.test( "Person", await person.crud( $ ) )
    ])

  ]));

  
  process.exit( success );
})();
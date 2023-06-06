import amen from "@dashkite/amen";
import print from "./amen-console.js";
import * as h from "./helpers.js";

const { success } = amen;

import * as link from "./link/index.js";
import * as identity from "./identity/index.js";
import * as person from "./person/index.js";
import * as registration from "./registration/index.js";
import * as mastodonClient from "./mastodon-client/index.js";
import * as filter from "./filter/index.js";
import * as source from "./source/index.js";
import * as post from "./post/index.js";


(async function () {
  const $ = {
    h: h,
    gobo: await h.getGOBO(),
  };

  $.conforms = h.conforms( $.gobo.spec );


  print( await h.test( "GOBO Client", [
    await h.test( "Authentication", [
      await h.test( "Me", await person.me( $ ) )
    ]),

    await h.test( "CRUD", [
      await h.test( "Link", await link.crud( $ ) ),
      await h.test( "Person", await person.crud( $ ) ),
      await h.test( "Identity", await identity.crud( $ ) ),
      await h.test( "Registration", await registration.crud( $ ) ),
      await h.test( "Mastodon Client", await mastodonClient.crud( $ ) ),
      await h.test( "Filter", await filter.crud( $ ) ),
      await h.test( "Source", await source.crud( $ ) ),
      await h.test( "Post", await post.crud( $ ) )
    ])

  ]));

  
  process.exit( success );
})();
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
import * as action from "./action/index.js";
import * as workerAction from "./worker-action/index.js";
import * as task from "./task/index.js";
import * as feed from "./feed/index.js";
import * as store from "./store/index.js";
import * as image from "./image/index.js";
import * as goboKey from "./gobo-key/index.js";


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
      await h.test( "Post", await post.crud( $ ) ),
      await h.test( "Task", await task.crud( $ ) ),
      await h.test( "Gobo Key", await goboKey.crud( $ ) ),
    ]),

    await h.test( "Actions", [
      await h.test( "Onboard Identity", await action.onboardIdentity( $ ) ),
      await h.test( "Identity Sources", await workerAction.pullIdentitySources( $ ) ),
    ]),

    await h.test( "Tasks", [
      await h.test( "Basic Pipeline Submissions", await task.basic( $ ) )
    ]),

    await h.test( "Person Resources", [
      await h.test( "Store", await store.person( $ ) ),
      await h.test( "Identity", await identity.person( $ ) ),
      await h.test( "Filter", await filter.person( $ ) ),
      await h.test( "Feeds", await feed.person( $ ) ),
      await h.test( "Draft Images", await image.person( $ ) )
    ])

  ]));

  
  if ( success === true ) {
    process.exit( 0 );
  } else {
    process.exit( 1 );
  }
})();
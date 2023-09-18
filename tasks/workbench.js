import FS from "node:fs/promises";
import FormData from "form-data";
import { getGOBO } from "./helpers.js";

const BLUESKY_URL = "https://bsky.app"
const REDDIT_URL = "https://www.reddit.com"


const run = async function ( config ) {
  const taskName = config.args.task;
  if ( taskName == null ) {
    throw new Error("must specify 'task' for workbench to run");
  }

  const task = tasks[taskName];
  if ( task == null ) {
    throw new Error(`task ${taskName} is not defined`);
  }

  await task( config );
};



const tasks = {
  blueskyWorkbench: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "bluesky",
      name: "workbench",
      details: { url: config.args.url }
    }});
  },

  blueskyReadSources: async function (config) {
    const gobo = await getGOBO(config);
  
    await gobo.tasks.post({ content: {
      queue: "bluesky",
      name: "read sources",
      details: {}
    }});
  },

  blueskyResetFeeds: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "bluesky",
      name: "clear all last retrieved",
      details: {}
    }});
  },

  blueskyResetFeed: async function (config) {
    if ( config.args.url == null ) {
      throw new Error("must specify argument 'url' to target source");
    }

    const { url } = config.args;
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "bluesky",
      name: "clear last retrieved",
      details: { url }
    }});
  },

  blueskyHardReset: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "bluesky",
      name: "hard reset posts",
      details: {}
    }});
  },

  blueskyCreatePost: async function (config) {
    const gobo = await getGOBO(config);
    const person = await gobo.me.get();
    const identities = await gobo.personIdentities.get({
      person_id: person.id
    });

    const identity = identities.find( i => i.base_url === BLUESKY_URL );
    if ( identity == null ) {
      throw new Error("unable to find bluesky identity to run test");
    }

    await gobo.personPosts.post({ 
      parameters: {
        person_id: person.id
      },
      content: {
        post: {
          content: "This is a test post from GOBO."
        },
        targets: [{
          identity: identity.id,
          metadata: {}
        }]
    }});
  },

  blueskyMediaPost: async function (config) {
    const gobo = await getGOBO(config);
    const person = await gobo.me.get();

    const form = new FormData();
    const file = await FS.readFile( "test/image/test.jpg" );
    form.append("image", file, { filename: "canyon" });
    form.append("name", "starry canyon");
    form.append("alt", "This is a starry canyon");

    const draft = await gobo.personDraftImages.post({
      parameters: { person_id: person.id },
      content: form,
    }, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`
      }
    });

    const identities = await gobo.personIdentities.get({
      person_id: person.id
    });

    const identity = identities.find( i => i.base_url === BLUESKY_URL );
    if ( identity == null ) {
      throw new Error("unable to find bluesky identity to run test");
    }

    await gobo.personPosts.post({ 
      parameters: {
        person_id: person.id
      },
      content: {
        post: {
          content: "This is a test post from GOBO.",
          attachments: [ draft.id ]
        },
        targets: [{
          identity: identity.id,
          metadata: {}
        }]
    }});
  },

  blueskyRefreshSessions: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "bluesky",
      name: "refresh sessions",
      details: {}
    }});
  },

  blueskyBootstrapSessions: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "bluesky",
      name: "bootstrap sessions",
      details: {}
    }});
  },


  mastodonIdentityFollowFanout: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "mastodon",
      name: "identity follow fanout",
      details: {}
    }});
  },

  mastodonPullSources: async function (config) {
    const gobo = await getGOBO(config);

    if ( config.args.id == null ) {
      throw new Error("must specify argument 'id' to target identity");
    }
    const id = Number( config.args.id );

    const identity = await gobo.identity.get({ id });
    if ( identity == null ) {
      throw new Error("unable to find identity");
    }

    await gobo.tasks.post({ content: {
      queue: "mastodon",
      name: "pull sources",
      details: { identity }
    }});
  },

  mastodonReadSources: async function (config) {
    const gobo = await getGOBO(config);
  
    await gobo.tasks.post({ content: {
      queue: "mastodon",
      name: "read sources",
      details: {}
    }});
  },

  mastodonResetFeed: async function (config) {
    if ( config.args.url == null ) {
      throw new Error("must specify argument 'url' to target source");
    }

    const { url } = config.args;
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "mastodon",
      name: "clear last retrieved",
      details: { url }
    }});
  },

  mastodonResetFeeds: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "mastodon",
      name: "clear all last retrieved",
      details: {}
    }});
  },

  mastodonHardReset: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "mastodon",
      name: "hard reset posts",
      details: {}
    }});
  },

  mastodonCreatePost: async function (config) {
    const gobo = await getGOBO(config);
    const person = await gobo.me.get();
    const identities = await gobo.personIdentities.get({
      person_id: person.id
    });

    const identity = identities.find( i => ! [BLUESKY_URL, REDDIT_URL].includes(i.base_url) );
    if ( identity == null ) {
      throw new Error("unable to find mastodon identity to run test");
    }

    await gobo.personPosts.post({ 
      parameters: {
        person_id: person.id
      },
      content: {
        post: {
          content: "This is a test post from GOBO."
        },
        targets: [{
          identity: identity.id,
          metadata: {}
        }]
    }});
  },

  mastodonMediaPost: async function (config) {
    const gobo = await getGOBO(config);
    const person = await gobo.me.get();

    const form = new FormData();
    const file = await FS.readFile( "test/image/test.jpg" );
    form.append("image", file, { filename: "canyon" });
    form.append("name", "starry canyon");
    form.append("alt", "This is a starry canyon");

    const draft = await gobo.personDraftImages.post({
      parameters: { person_id: person.id },
      content: form,
    }, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`
      }
    });

    const identities = await gobo.personIdentities.get({
      person_id: person.id
    });

    const identity = identities.find( i => ! [BLUESKY_URL, REDDIT_URL].includes(i.base_url) );
    if ( identity == null ) {
      throw new Error("unable to find mastodon identity to run test");
    }

    await gobo.personPosts.post({ 
      parameters: {
        person_id: person.id
      },
      content: {
        post: {
          content: "This is a test post from GOBO.",
          attachments: [ draft.id ]
        },
        targets: [{
          identity: identity.id,
          metadata: {}
        }]
    }});
  },


  redditReadSources: async function (config) {
    const gobo = await getGOBO(config);
  
    await gobo.tasks.post({ content: {
      queue: "reddit",
      name: "read sources",
      details: {}
    }});
  },

  redditResetFeeds: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "reddit",
      name: "clear all last retrieved",
      details: {}
    }});
  },

  redditResetFeed: async function (config) {
    if ( config.args.url == null ) {
      throw new Error("must specify argument 'url' to target source");
    }

    const { url } = config.args;
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "reddit",
      name: "clear last retrieved",
      details: { url }
    }});
  },

  redditHardReset: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "reddit",
      name: "hard reset posts",
      details: {}
    }});
  },

  redditCreatePost: async function (config) {
    const gobo = await getGOBO(config);
    const person = await gobo.me.get();
    const identities = await gobo.personIdentities.get({
      person_id: person.id
    });

    const identity = identities.find( i => i.base_url === REDDIT_URL );
    if ( identity == null ) {
      throw new Error("unable to find mastodon identity to run test");
    }

    await gobo.personPosts.post({ 
      parameters: {
        person_id: person.id
      },
      content: {
        post: {
          title: "GOBO Test",
          content: "This is a test post from GOBO."
        },
        targets: [{
          identity: identity.id,
          metadata: {
            subreddit: "gobotest"
          }
        }]
    }});
  },

  redditMediaPost: async function (config) {
    const gobo = await getGOBO(config);
    const person = await gobo.me.get();

    let form = new FormData();
    let file = await FS.readFile( "test/image/test.jpg" );
    form.append("image", file, { filename: "canyon" });
    form.append("name", "starry canyon");
    form.append("alt", "This is a starry canyon");

    const draft = await gobo.personDraftImages.post({
      parameters: { person_id: person.id },
      content: form,
    }, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`
      }
    });

    // form = new FormData();
    // file = await FS.readFile( "test/image/test.jpg" );
    // form.append("image", file, { filename: "canyon" });
    // form.append("name", "starry canyon");
    // form.append("alt", "This is a starry canyon");

    // const draft2 = await gobo.personDraftImages.post({
    //   parameters: { person_id: person.id },
    //   content: form,
    // }, {
    //   headers: {
    //     "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`
    //   }
    // });



    const identities = await gobo.personIdentities.get({
      person_id: person.id
    });

    const identity = identities.find( i => i.base_url === REDDIT_URL );
    if ( identity == null ) {
      throw new Error("unable to find mastodon identity to run test");
    }

    await gobo.personPosts.post({ 
      parameters: {
        person_id: person.id
      },
      content: {
        post: {
          title: "GOBO Test",
          content: "This is a test post from GOBO.",
          attachments: [ draft.id ]
          // attachments: [ draft.id, draft2.id ]
        },
        targets: [{
          identity: identity.id,
          metadata: {
            subreddit: "gobotest"
          }
        }]
    }});
  },


  redditOnboardIdentity: async function (config) {
    const gobo = await getGOBO(config);
    const result = await gobo.actionOnboardIdentityStart.post({ content: {
      base_url: "https://www.reddit.com"
    }});

    console.log(result);
  },

  redditOnboardIdentityFinish: async function (config) {
    const gobo = await getGOBO(config);
    const result = await gobo.actionOnboardIdentityCallback.post({ content: {
      base_url: "https://www.reddit.com",
      state: "",
      code: ""
    }});
      
    console.log(result);
  },

  escapeTitles: async function (config) {
    const gobo = await getGOBO(config);
  
    await gobo.tasks.post({ content: {
      queue: "database",
      name: "escape titles",
      details: {}
    }});
  },

  cleanFollows: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "database",
      name: "clean follows",
      details: {}
    }});
  },



  allIdentityFollowFanout: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "bluesky",
      name: "identity follow fanout",
      details: {}
    }});

    await gobo.tasks.post({ content: {
      queue: "reddit",
      name: "identity follow fanout",
      details: {}
    }});

    await gobo.tasks.post({ content: {
      queue: "mastodon",
      name: "identity follow fanout",
      details: {}
    }});
  },

  allReadSources: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "bluesky",
      name: "read sources",
      details: {}
    }});

    await gobo.tasks.post({ content: {
      queue: "reddit",
      name: "read sources",
      details: {}
    }});

    await gobo.tasks.post({ content: {
      queue: "mastodon",
      name: "read sources",
      details: {}
    }});
  },

  allResetFeeds: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "bluesky",
      name: "clear all last retrieved",
      details: {}
    }});

    await gobo.tasks.post({ content: {
      queue: "mastodon",
      name: "clear all last retrieved",
      details: {}
    }});

    await gobo.tasks.post({ content: {
      queue: "reddit",
      name: "clear all last retrieved",
      details: {}
    }});
  },


  databaseWorkbench: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "database",
      name: "workbench",
      details: {}
    }});
  },






  // bluesky text post test: 87367
  // bluesky identity: 201
  // mastodon text post: 87375
  // mastodon identity: 109
  // reddit text post: 87377
  // reddit identity: 61

  testAddPostEdge: async function (config) {
    const gobo = await getGOBO(config);
    const person = await gobo.me.get();
    const edge = await gobo.person_post_edges.post({
      parameters: { person_id: person.id },
      content: {
        identity: 61,
        post: 87377,
        name: "upvote"
      }
    });

    console.log(edge);
  },

  testRemovePostEdge: async function (config) {
    const gobo = await getGOBO(config);
    const person = await gobo.me.get();
    await gobo.person_post_edge.delete({
      person_id: person.id,
      id: 7
    });
  },


  testBlueskyQuote: async function (config) {
    const gobo = await getGOBO(config);
    const person = await gobo.me.get();

    const identities = await gobo.personIdentities.get({
      person_id: person.id
    });
  
    const identity = identities.find( i => i.base_url === BLUESKY_URL );
    if ( identity == null ) {
      throw new Error("unable to find bluesky identity to run test");
    }

    const postGraph = await gobo.postGraph.get({ id: 87367 });
    const quote = postGraph.posts.find( p => p.id === postGraph.feed[0] );
      
    await gobo.personPosts.post({ 
      parameters: {
        person_id: person.id
      },
      content: {
        post: {
          content: "This is a test quote post from GOBO."
        },
        targets: [{
          identity: identity.id,
          metadata: { quote }
        }]
    }});
  },


  testBlueskyReply: async function (config) {
    const gobo = await getGOBO(config);
    const person = await gobo.me.get();

    const identities = await gobo.personIdentities.get({
      person_id: person.id
    });
  
    const identity = identities.find( i => i.base_url === BLUESKY_URL );
    if ( identity == null ) {
      throw new Error("unable to find bluesky identity to run test");
    }

    const postGraph = await gobo.postGraph.get({ id: 87367 });
    const reply = postGraph.posts.find( p => p.id === postGraph.feed[0] );
      
    await gobo.personPosts.post({ 
      parameters: {
        person_id: person.id
      },
      content: {
        post: {
          content: "This is a test reply post from GOBO."
        },
        targets: [{
          identity: identity.id,
          metadata: { reply }
        }]
    }});
  },


  testMastodonReply: async function (config) {
    const gobo = await getGOBO(config);
    const person = await gobo.me.get();

    const identities = await gobo.personIdentities.get({
      person_id: person.id
    });
  
    const identity = identities.find( i => ! [BLUESKY_URL, REDDIT_URL].includes(i.base_url) );
    if ( identity == null ) {
      throw new Error("unable to find mastodon identity to run test");
    }

    const postGraph = await gobo.postGraph.get({ id: 87375 });
    const reply = postGraph.posts.find( p => p.id === postGraph.feed[0] );
      
    await gobo.personPosts.post({ 
      parameters: {
        person_id: person.id
      },
      content: {
        post: {
          content: "This is a test reply post from GOBO."
        },
        targets: [{
          identity: identity.id,
          metadata: { reply }
        }]
    }});
  },



  testRedditReply: async function (config) {
    const gobo = await getGOBO(config);
    const person = await gobo.me.get();

    const identities = await gobo.personIdentities.get({
      person_id: person.id
    });
  
    const identity = identities.find( i => i.base_url === REDDIT_URL );
    if ( identity == null ) {
      throw new Error("unable to find bluesky identity to run test");
    }

    const postGraph = await gobo.postGraph.get({ id: 87377 });
    const reply = postGraph.posts.find( p => p.id === postGraph.feed[0] );
      
    await gobo.personPosts.post({ 
      parameters: {
        person_id: person.id
      },
      content: {
        post: {
          content: "This is a test reply post from GOBO."
        },
        targets: [{
          identity: identity.id,
          metadata: { reply }
        }]
    }});
  },


  storeDelete: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.personStore.delete({
      person_id: 3,
      name: "welcome"
    });
  },



};



export {
  run
}


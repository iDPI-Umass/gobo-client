import FS from "node:fs/promises";
import FormData from "form-data";
import { getGOBO, random } from "./helpers.js";

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

  customAction: async function (config) {
    const gobo = await getGOBO(config);
    const platform = config.args.platform ?? "all";
  
    await gobo.tasks.post({ content: {
      queue: "default",
      name: "workbench",
      details: {}
    }});
  },

  pullSources: async function (config) {
    const gobo = await getGOBO(config);
    const platform = config.args.platform ?? "all";
  
    await gobo.tasks.post({ content: {
      queue: "default",
      name: "pull sources fanout",
      details: { platform }
    }});
  },

  pullPosts: async function (config) {
    const gobo = await getGOBO(config);
    const platform = config.args.platform ?? "all";
  
    await gobo.tasks.post({ content: {
      queue: "default",
      name: "pull posts fanout",
      details: { platform }
    }});
  },

  hardReset: async function (config) {
    const gobo = await getGOBO(config);
    const platform = config.args.platform ?? "all";
  
    await gobo.tasks.post({ content: {
      queue: "default",
      name: "hard reset",
      details: { platform }
    }});
  },

  clearPosts: async function (config) {
    const gobo = await getGOBO(config);
    const platform = config.args.platform ?? "all";
  
    await gobo.tasks.post({ content: {
      queue: "default",
      name: "clear posts",
      details: { platform }
    }});
  },

  clearLastRetrieved: async function (config) {
    const gobo = await getGOBO(config);
    const platform = config.args.platform ?? "all";
  
    await gobo.tasks.post({ content: {
      queue: "default",
      name: "clear last retrieved",
      details: { platform }
    }});
  },


  pruneResources: async function (config) {
    const gobo = await getGOBO(config);
  
    await gobo.tasks.post({ content: {
      queue: "default",
      name: "prune resources",
      details: {}
    }});
  },

  onboardIdentity: async function (config) {
    const gobo = await getGOBO(config);
    const identity = await gobo.identity.get({ id: config.args.id });
  
    await gobo.tasks.post({ content: {
      queue: "default",
      priority: 1,
      name: "flow - onboard sources",
      details: { identity }
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
      queue: "default",
      name: "bluesky cycle sessions",
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

  bootstrapPlatformLabels: async function (config) {
    const gobo = await getGOBO(config);

    await gobo.tasks.post({ content: {
      queue: "default",
      name: "bootstrap platform labels",
      details: {}
    }});
  },

  listPeople: async function ( config ) {
    const gobo = await getGOBO( config );
    const people = await gobo.people.get({ per_page: 100 });
    console.log(people);
  },

  listIdentities: async function ( config ) {
    const gobo = await getGOBO( config );
    const identities = await gobo.identities.get({ per_page: 200 });
    console.log(identities);
  },

  createKey: async function ( config ) {
    const gobo = await getGOBO( config );
    const person_id = Number(config.args.person_id );

    const key = await gobo.goboKeys.post({ content: {
      person_id,
      key: await random({ length: 32 })
    }});
    console.log(key);
  },

};



export {
  run
}


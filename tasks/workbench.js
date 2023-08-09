import { getGOBO } from "./helpers.js";

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



};



export {
  run
}


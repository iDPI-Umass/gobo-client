import { getGOBO } from "./helpers.js";

// const run = async function (config) {
//   const gobo = await getGOBO(config);
//   const result = await gobo.actionWorkbench.post({ content: {
//     profile_url: "https://twitter.com/davidgobo1"
//   }});

//   console.log(result);
// };


// const run = async function (config) {
//   const gobo = await getGOBO(config);
//   const result = await gobo.actionPullIdentitySources.post({ content: {
//     profile_url: "https://twitter.com/davidgobo1"
//   }});
  
//   console.log(result);
// };


// const run = async function (config) {
//   const gobo = await getGOBO(config);
//   const result = await gobo.actionWorkbench.post({ content: {
//     profile_url: "https://www.reddit.com/user/davidgobo"
//   }});

//   console.log(result);
// };


// const run = async function (config) {
//   const gobo = await getGOBO(config);
//   const result = await gobo.actionPullIdentitySources.post({ content: {
//     profile_url: "https://www.reddit.com/user/davidgobo"
//   }});
  
//   console.log(result);
// };


// const run = async function (config) {
//   const gobo = await getGOBO(config);
//   const result = await gobo.actionPullIdentitySources.post({ content: {
//     profile_url: "https://mastodon.social/@davidgobo"
//   }});
  
//   console.log(result);
// };

const run = async function (config) {
  const gobo = await getGOBO(config);
  const identity = await gobo.identity.get({id: 61})

  const result = await gobo.tasks.post({ content: {
    queue: "database",
    name: "workbench",
    details: {}
  }});

  console.log(result);
};



export {
  run
}

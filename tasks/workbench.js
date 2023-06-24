import { getGOBO } from "./helpers.js";

const run = async function (config) {
  const gobo = await getGOBO(config);
  const result = await gobo.actionWorkbench.post({ content: {
    profile_url: "https://twitter.com/davidgobo1"
  }});

  console.log(result);
};


// const run = async function (config) {
//   const gobo = await getGOBO(config);
//   const result = await gobo.actionPullIdentitySources.post({ content: {
//     profile_url: "https://twitter.com/davidgobo1"
//   }});
  
//   console.log(result);
// };


export {
  run
}


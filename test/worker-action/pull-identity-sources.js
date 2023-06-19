const pullIdentitySources = async function ( $ ) {
  const { h } = $;
  let link;

  return [

    await h.test( "twitter identity", h.target( "action-pull-identity-sources", async () => {
      const result = await $.gobo.actionPullIdentitySources.post({ content: {
        profile_url: "https://twitter.com/davidgobo1"
      }});
      
      $.conforms( "action_pull_identity_sources", "post", result );
    })),

  ];
};

export { pullIdentitySources }
const onboardIdentity = async function ( $ ) {
  const { h } = $;
  let link;

  return [

    // await h.test( "twitter redirect", h.target( "action-onboard-identity", async () => {
    //   const result = await $.gobo.actionOnboardIdentityStart.post({ content: {
    //     base_url: "https://twitter.com"
    //   }});
      
    //   // console.log(result);

    //   $.conforms( "action_onboard_identity_start", "post", result );
    //   h.assert(result.redirect_url.startsWith("https://api.twitter.com/oauth/authorize?"));
    // })),

    // await h.test( "twitter callback", h.target( "action-onboard-identity", async () => {
    //   const result = await $.gobo.actionOnboardIdentityCallback.post({ content: {
    //     base_url: "https://twitter.com",
    //     oauth_token: "",
    //     oauth_verifier: ""
    //   }});
      
    //   console.log(result);

    //   $.conforms( "action_onboard_identity_callback", "post", result );
    // })),

    await h.test( "reddit redirect", h.target( "action-onboard-identity", async () => {
      const result = await $.gobo.actionOnboardIdentityStart.post({ content: {
        base_url: "https://www.reddit.com"
      }});
      
      // console.log(result);

      $.conforms( "action_onboard_identity_start", "post", result );
      h.assert(result.redirect_url.startsWith("https://www.reddit.com/api/v1/authorize?"));
    })),

    // await h.test( "reddit callback", h.target( "action-onboard-identity", async () => {
    //   const result = await $.gobo.actionOnboardIdentityCallback.post({ content: {
    //     base_url: "https://www.reddit.com",
    //     state: "",
    //     code: ""
    //   }});
      
    //   console.log(result);

    //   $.conforms( "action_onboard_identity_callback", "post", result );
    // })),

    await h.test( "mastodon redirect", h.target( "action-onboard-identity", async () => {
      const result = await $.gobo.actionOnboardIdentityStart.post({ content: {
        base_url: "https://mastodon.social"
      }});
      
      // console.log(result);

      $.conforms( "action_onboard_identity_start", "post", result );
      h.assert(result.redirect_url.startsWith("https://mastodon.social/oauth/authorize?"));
    })),

    // await h.test( "mastodon callback", h.target( "action-onboard-identity", async () => {
    //   const result = await $.gobo.actionOnboardIdentityCallback.post({ content: {
    //     base_url: "https://mastodon.social",
    //     state: "",
    //     code: ""
    //   }});
      
    //   console.log(result);

    //   $.conforms( "action_onboard_identity_callback", "post", result );
    // })),

  ];
};

export { onboardIdentity }
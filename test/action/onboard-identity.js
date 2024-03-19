const onboardIdentity = async function ( $ ) {
  const { h } = $;
  let link;
  let state;

  return [

    await h.test( "bluesky redirect", h.target( "action-onboard-identity", async () => {
      const result = await $.gobo.actionOnboardIdentityStart.post({ content: {
        platform: "bluesky",
        base_url: "https://bsky.app"
      }});
      
      // console.log(result);

      $.conforms( "action_onboard_identity_start", "post", result );
      h.assert( result.state != null );
      state = result.state;
    })),

    // await h.test( "twitter callback", h.target( "action-onboard-identity", async () => {
    //   const result = await $.gobo.actionOnboardIdentityCallback.post({ content: {
    //     platform: "bluesky",
    //     base_url: "https://bsky.app",
    //     bluesky_login: "",
    //     bluesky_secret: "",
    //     state: state
    //   }});
      
    //   console.log(result);

    //   $.conforms( "action_onboard_identity_callback", "post", result );
    // })),

    await h.test( "reddit redirect", h.target( "action-onboard-identity", async () => {
      const result = await $.gobo.actionOnboardIdentityStart.post({ content: {
        platform: "reddit",
        base_url: "https://www.reddit.com"
      }});
      
      // console.log(result);

      $.conforms( "action_onboard_identity_start", "post", result );
      h.assert(result.redirect_url.startsWith("https://www.reddit.com/api/v1/authorize?"));
    })),

    // await h.test( "reddit callback", h.target( "action-onboard-identity", async () => {
    //   const result = await $.gobo.actionOnboardIdentityCallback.post({ content: {
    //     platform: "reddit",
    //     base_url: "https://www.reddit.com",
    //     state: "",
    //     code: ""
    //   }});
      
    //   console.log(result);

    //   $.conforms( "action_onboard_identity_callback", "post", result );
    // })),

    await h.test( "mastodon redirect", h.target( "action-onboard-identity", async () => {
      const result = await $.gobo.actionOnboardIdentityStart.post({ content: {
        platform: "mastodon",
        base_url: "https://mastodon.social"
      }});
      
      // console.log(result);

      $.conforms( "action_onboard_identity_start", "post", result );
      h.assert(result.redirect_url.startsWith("https://mastodon.social/oauth/authorize?"));
    })),

    // await h.test( "mastodon callback", h.target( "action-onboard-identity", async () => {
    //   const result = await $.gobo.actionOnboardIdentityCallback.post({ content: {
    //     platform: "mastodon",
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
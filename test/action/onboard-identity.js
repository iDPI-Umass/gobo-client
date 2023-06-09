const onboardIdentity = async function ( $ ) {
  const { h } = $;
  let link;

  return [

    await h.test( "twitter redirect", h.target( "action-onboard-identity", async () => {
      const result = await $.gobo.actionOnboardIdentityStart.post({ content: {
        base_url: "https://twitter.com"
      }});
      
      console.log(result);

      $.conforms( "action_onboard_identity_start", "post", result );
      h.assert(result.redirect_url.startsWith("https://api.twitter.com/oauth/authorize?oauth_token="));
    })),

    // await h.test( "twitter callback", h.target( "action-onboard-identity", async () => {
    //   const result = await $.gobo.actionOnboardIdentityCallback.post({ content: {
    //     base_url: "https://twitter.com",
    //     oauth_token: "",
    //     oauth_verifier: ""
    //   }});
      
    //   console.log(result);

    //   $.conforms( "action_onboard_identity_callback", "post", result );
    // })),

  ];
};

export { onboardIdentity }
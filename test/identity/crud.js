const crud = async function ( $ ) {
  const { h } = $;
  let identity;

  return [

    await h.test( "create identity", h.target( "identity-crud", async () => {
      identity = await $.gobo.identities.post({ content: {
        person_id: 1,
        platform: "bluesky",
        base_url: "https://bsky.app",
        profile_url: await h.random(),
        profile_image: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
        username: `davidgobo${ await h.random() }`,
        name: "David Test",
        oauth_token: await h.random(),
        oauth_token_secret: await h.random()
      }});

      $.conforms( "identities", "post", identity );
    })),

    await h.test( "conflict protection", h.target( "identity-crud", async () => {
      await h.fail( 409, async function () {
        return await $.gobo.identities.post({ content: {
          person_id: 1,
          platform: "bluesky",
          base_url: "https://bsky.app",
          profile_url: identity.profile_url,
          profile_image: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
          username: `davidgobo${ await h.random() }`,
          name: "David Test",
          oauth_token: await h.random(),
          oauth_token_secret: await h.random()
        }});
      });
    })),

    await h.test( "list identities", h.target( "identity-crud", async () => {
      const identities = await $.gobo.identities.get();
      $.conforms( "identities", "get", identities );
    })),  

    await h.test( "get identity", h.target( "identity-crud", async () => {
      const _identity = await $.gobo.identity.get(identity);
      h.assert.deepEqual( identity, _identity );
    })),

    await h.test( "update identity", h.target( "identity-crud", async () => {
      const _identity = { ...identity };
      _identity.name = "David Test Edited";
      
      identity = await $.gobo.identity.put( _identity );

      h.partialEqual( _identity, identity, [
        "id",
        "person_id",
        "base_url",
        "profile_url",
        "profile_image",
        "username",
        "name",
        "oauth_token",
        "oauth_token_secret",
        "created"
      ]);
     
      h.assert( _identity.updated < identity.updated );
    })),

    await h.test( "delete identity", h.target( "identity-crud", async () => {
      await $.gobo.identity.delete( identity );
      await h.fail( 404, async function () {
        await $.gobo.identity.get( identity )
      });
    })),
  
  ];
};

export { crud }
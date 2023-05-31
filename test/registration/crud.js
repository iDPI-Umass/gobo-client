const crud = async function ( $ ) {
  const { h } = $;
  let registration;

  return [

    await h.test( "create registration", h.target( "registration-crud", async () => {
      registration = await $.gobo.registrations.post({
        person_id: 1,
        base_url: "https://twitter.com",
        oauth_token: await h.random(),
        oauth_token_secret: await h.random(),
        saved_state: "current state",
        request_time: h.now()
      });

      $.conforms( "registrations", "post", registration );
    })),

    await h.test( "list registrations", h.target( "registration-crud", async () => {
      const registrations = await $.gobo.registrations.get();
      $.conforms( "registrations", "get", registrations );
    })),  

    await h.test( "get registration", h.target( "registration-crud", async () => {
      const _registration = await $.gobo.registration.get(registration);
      h.assert.deepEqual( registration, _registration );
    })),

    await h.test( "update registration", h.target( "registration-crud", async () => {
      const _registration = { ...registration };
      _registration.saved_state = "current state edited";
      
      registration = await $.gobo.registration.put( _registration );

      h.partialEqual( _registration, registration, [
        "id",
        "person_id",
        "base_url",
        "oauth_token",
        "oauth_token_secret",
        "saved_state",
        "request_time",
        "created"
      ]);
     
      h.assert( _registration.updated < registration.updated );
    })),

    await h.test( "delete registration", h.target( "registration-crud", async () => {
      await $.gobo.registration.delete( registration );
      await h.fail( 404, async function () {
        await $.gobo.registration.get( registration )
      });
    })),
  
  ];
};

export { crud }
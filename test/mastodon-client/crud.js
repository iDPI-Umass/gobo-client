const crud = async function ( $ ) {
  const { h } = $;
  let client;

  return [

    await h.test( "create mastodon client", h.target( "mastodon-client-crud", async () => {
      client = await $.gobo.mastodonClients.post({ content: {
        base_url: await h.random(),
        client_id: await h.random(),
        client_secret: await h.random(),
      }});

      $.conforms( "mastodon_clients", "post", client );
    })),

    await h.test( "conflict protection", h.target( "mastodon-client-crud", async () => {
      await h.fail( 409, async function () {
        return await $.gobo.mastodonClients.post({ content: {
          base_url: client.base_url,
          client_id: await h.random(),
          client_secret: await h.random(),
        }});
      });
    })),

    await h.test( "list mastodonclients", h.target( "mastodon-client-crud", async () => {
      const clients = await $.gobo.mastodonClients.get();
      $.conforms( "mastodon_clients", "get", clients );
    })),  

    await h.test( "get mastodon client", h.target( "mastodon-client-crud", async () => {
      const _client = await $.gobo.mastodonClient.get(client);
      h.assert.deepEqual( client, _client );
    })),

    await h.test( "update mastodon client", h.target( "mastodon-client-crud", async () => {
      const _client = { ...client };
      _client.client_id = `${client.client_id} edited`;
      
      client = await $.gobo.mastodonClient.put( _client );

      h.partialEqual( _client, client, [
        "id",
        "base_url",
        "client_id",
        "client_secret",
        "created"
      ]);
     
      h.assert( _client.updated < client.updated );
    })),

    await h.test( "delete mastodon client", h.target( "mastodon-client-crud", async () => {
      await $.gobo.mastodonClient.delete( client );
      await h.fail( 404, async function () {
        await $.gobo.mastodonClient.get( client )
      });
    })),
  
  ];
};

export { crud }
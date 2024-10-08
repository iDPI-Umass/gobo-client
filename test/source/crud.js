const crud = async function ( $ ) {
  const { h } = $;
  let source;

  return [

    await h.test( "create source", h.target( "source-crud", async () => {
      source = await $.gobo.sources.post({ content: {
        platform_id: await h.random(),
        platform: "bluesky",
        base_url: "https://bsky.app",
        url: await h.random(),
        username: await h.random(),
        name: "David Test",
        icon_url: await h.random(),
        active: false
      }});

      $.conforms( "sources", "post", source );
    })),

    await h.test( "conflict protection", h.target( "source-crud", async () => {
      await h.fail( 409, async function () {
        return await $.gobo.sources.post({
          content: {
            platform_id: await h.random(),
            platform: "bluesky",
            base_url: "https://bsky.app",
            url: source.url,
            username: await h.random(),
            name: "David Test",
            icon_url: await h.random(),
            active: false
          }
        });
      });
    })),

    await h.test( "list sources", h.target( "source-crud", async () => {
      const sources = await $.gobo.sources.get();
      $.conforms( "sources", "get", sources );
    })),  

    await h.test( "get source", h.target( "source-crud", async () => {
      const _source = await $.gobo.source.get(source);
      h.assert.deepEqual( source, _source );
    })),

    await h.test( "update source", h.target( "source-crud", async () => {
      const _source = { ...source };
      _source.name = "David Test Edited";
      
      source = await $.gobo.source.put( _source );

      h.partialEqual( _source, source, [
        "id",
        "platform_id",
        "base_url",
        "url",
        "username",
        "name",
        "icon_url",
        "active",
        "created"
      ]);

      h.assert( _source.updated < source.updated );
    })),

    await h.test( "delete source", h.target( "source-crud", async () => {
      await $.gobo.source.delete( source );
      await h.fail( 404, async function () {
        await $.gobo.source.get( source )
      });
    })),
  
  ];
};

export { crud }
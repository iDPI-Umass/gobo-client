const crud = async function ( $ ) {
  const { h } = $;
  let lens;

  return [

    await h.test( "create lens", h.target( "lens-crud", async () => {
      lens = await $.gobo.lenses.post({ content: {
        person_id: 1,
        category: "block",
        configuration: {
          type: "keyword",
          value: "example phrase"
        }
      }});

      $.conforms( "lenses", "post", lens );
    })),

    await h.test( "list lenses", h.target( "lens-crud", async () => {
      const lenses = await $.gobo.lenses.get();
      $.conforms( "lenses", "get", lenses );
    })),  

    await h.test( "get lens", h.target( "lens-crud", async () => {
      const _lens = await $.gobo.lens.get(lens);
      h.assert.deepEqual( lens, _lens );
    })),

    await h.test( "update lens", h.target( "lens-crud", async () => {
      const _lens = { ...lens };
      _lens.configuration.vlaue = "example phrase edited";
      
      lens = await $.gobo.lens.put( _lens );

      h.partialEqual( _lens, lens, [
        "id",
        "category",
        "configuration",
        "created"
      ]);

      h.assert( _lens.updated < lens.updated );
    })),

    await h.test( "delete lens", h.target( "lens-crud", async () => {
      await $.gobo.lens.delete( lens );
      await h.fail( 404, async function () {
        await $.gobo.lens.get( lens )
      });
    })),
  
  ];
};

export { crud }
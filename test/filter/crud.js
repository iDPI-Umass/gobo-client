const crud = async function ( $ ) {
  const { h } = $;
  let filter;

  return [

    await h.test( "create filter", h.target( "filter-crud", async () => {
      filter = await $.gobo.filters.post({ content: {
        person_id: 1,
        category: "keyword",
        word: "word to filter"
      }});

      $.conforms( "filters", "post", filter );
    })),

    await h.test( "list filters", h.target( "filter-crud", async () => {
      const filters = await $.gobo.filters.get();
      $.conforms( "filters", "get", filters );
    })),  

    await h.test( "get filter", h.target( "filter-crud", async () => {
      const _filter = await $.gobo.filter.get(filter);
      h.assert.deepEqual( filter, _filter );
    })),

    await h.test( "update filter", h.target( "filter-crud", async () => {
      const _filter = { ...filter };
      _filter.word = "edited word to filter";
      
      filter = await $.gobo.filter.put( _filter );

      h.partialEqual( _filter, filter, [
        "id",
        "category",
        "word",
        "created"
      ]);

      h.assert( _filter.updated < filter.updated );
    })),

    await h.test( "delete filter", h.target( "filter-crud", async () => {
      await $.gobo.filter.delete( filter );
      await h.fail( 404, async function () {
        await $.gobo.filter.get( filter )
      });
    })),
  
  ];
};

export { crud }
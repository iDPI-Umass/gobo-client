const crud = async function ( $ ) {
  const { h } = $;
  let link;

  return [

    await h.test( "create link", h.target( "link-crud", async () => {
      link = await $.gobo.links.post({
        origin_type: "A",
        origin_id: 1,
        target_type: "B",
        target_id: 1,
        name: "test-edge"
      });

      $.conforms( "links", "post", link );
    })),

    await h.test( "list links", h.target( "link-crud", async () => {
      const links = await $.gobo.links.get();
      $.conforms( "links", "get", links );
    })),  

    await h.test( "get link", h.target( "link-crud", async () => {
      const _link = await $.gobo.link.get( link );
      h.assert.deepEqual( link, _link );
    })),

    await h.test( "update link", h.target( "link-crud", async () => {
      const _link = { ...link };
      _link.name = "test-edge-edited";
      
      link = await $.gobo.link.put( _link );

      h.assert( _link.id === link.id );
      h.assert( _link.origin_type == link.origin_type);
      h.assert( _link.origin_id == link.origin_id);
      h.assert( _link.target_type == link.target_type);
      h.assert( _link.target_id == link.target_id);
      h.assert( _link.name === link.name );
      h.assert( _link.created === link.created );
      h.assert( _link.updated < link.updated );
    })),

    await h.test( "delete link", h.target( "link-crud", async () => {
      await $.gobo.link.delete( link );
      await h.fail( 404, async function () {
        await $.gobo.link.get( link )
      });
    })),
  
  ];
};

export { crud }
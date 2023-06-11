const resource = async function ( $ ) {
  const { h } = $;

  return [

    await h.test( "list identities", h.target( "identity-resource", async () => {
      const person = await $.gobo.me.get();
      const identities = await $.gobo.resources.get({
        id: person.id,
        resource_type: "identities"
      });

      $.conforms( "resources", "get", identities );
      h.assert( identities.length === 3 );
    })),  

  ];
};

export { resource }
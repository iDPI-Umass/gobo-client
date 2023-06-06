const me = async function ( $ ) {
  const { h } = $;
  let person;

  return [

    await h.test( "get me", h.target( "person-me", async () => {
      person = await $.gobo.me.get();

      $.conforms( "me", "get", person );
    })),

    await h.test( "update person", h.target( "person-crud", async () => {
      const _person = { ...person };
      _person.name = "David Harper Edited";
      
      person = await $.gobo.person.put( _person );

      h.partialEqual( _person, person, [
        "id",
        "name",
        "authority_id",
        "created"
      ]);

      h.assert( _person.updated < person.updated );
    }))
  
  ];
};

export { me }
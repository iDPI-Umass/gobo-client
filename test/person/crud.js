const crud = async function ( $ ) {
  const { h } = $;
  let person;

  return [

    await h.test( "create person", h.target( "person-crud", async () => {
      person = await $.gobo.people.post({
        name: "David Test", 
      });

      $.conforms( "people", "post", person );
    })),

    await h.test( "list people", h.target( "person-crud", async () => {
      const people = await $.gobo.people.get();
      $.conforms( "people", "get", people );
    })),  

    await h.test( "get person", h.target( "person-crud", async () => {
      const _person = await $.gobo.person.get( person );
      h.assert.deepEqual( person, _person );
    })),

    await h.test( "update person", h.target( "person-crud", async () => {
      const _person = { ...person };
      _person.name = "David Test Edited";
      
      person = await $.gobo.person.put( _person );

      h.assert( _person.id === person.id );
      h.assert( _person.name === person.name );
      h.assert( _person.created === person.created );
      h.assert( _person.updated < person.updated );
    })),

    await h.test( "delete person", h.target( "person-crud", async () => {
      await $.gobo.person.delete( person );
      await h.fail( 404, async function () {
        await $.gobo.person.get( person )
      });
    })),
  
  ];
};

export { crud }
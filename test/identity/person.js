const testGroup = async function ( $ ) {
  const { h } = $;
  const person = await $.gobo.me.get();


  return [

    await h.test( "list identities", h.target( "identity-person", async () => {
      const identities = await $.gobo.personIdentities.get({
        person_id: person.id
      });

      $.conforms( "person_identities", "get", identities );
      h.assert( identities.length === 3 );
    })),  

  ];
};

export { testGroup as person }
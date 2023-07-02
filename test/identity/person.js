const testGroup = async function ( $ ) {
  const { h } = $;
  let person, identities;


  return [

    await h.test( "list identities", h.target( "identity-person", async () => {
      person = await $.gobo.me.get();
      identities = await $.gobo.personIdentities.get({
        person_id: person.id
      });

      $.conforms( "person_identities", "get", identities );
      h.assert( identities.length === 3 );
    })), 
    
    await h.test( "set active status", h.target( "identity-person", async () => {
      let identity = await $.gobo.personIdentity.post({
        content: { active: false },
        parameters: identities[0]
      });

      $.conforms( "person_identity", "post", identity );
      h.assert( identity.active === false );

      identity = await $.gobo.personIdentity.post({
        content: { active: true },
        parameters: identities[0]
      });

      h.assert( identity.active === true );  
    })), 

  ];
};

export { testGroup as person }
const crud = async function ( $ ) {
  const { h } = $;
  let person, key;

  return [

    await h.test( "create gobo key", h.target( "gobo-key-crud", async () => {
      person = await $.gobo.me.get();
      key = await $.gobo.goboKeys.post({ content: {
        person_id: person.id,
        key: await h.random({ length: 32 })
      }});

      $.conforms( "gobo_keys", "post", key );
    })),

    await h.test( "list gobo keys", h.target( "gobo-key-crud", async () => {
      const keys = await $.gobo.goboKeys.get();
      $.conforms( "gobo_keys", "get", keys );
    })),  

    await h.test( "get gobo key", h.target( "gobo-key-crud", async () => {
      const _key = await $.gobo.goboKey.get(key);
      h.assert.deepEqual( key, _key );
    })),

    await h.test( "use gobo key", h.target( "gobo-key-crud", async () => {
      const client = await h.getGOBO({ key: key.key });
      const _person = await client.me.get();
      h.assert.deepEqual( person, _person );
      const identities = await client.personIdentities.get({ person_id: person.id });      $.conforms( "person_identities", "get", identities );
      await h.fail( 401, async function () {
        await client.personIdentities.get({ person_id: person.id + 1 });
      });
    })),

    await h.test( "update gobo key", h.target( "gobo-key-crud", async () => {
      const _key = { ...key };
      _key.key = `${key.key} edited`;
      
      key = await $.gobo.goboKey.put( _key );

      h.partialEqual( _key, key, [
        "id",
        "person_id",
        "key",
        "created"
      ]);
     
      h.assert( _key.updated < key.updated );
    })),

    await h.test( "delete gobo key", h.target( "gobo-key-crud", async () => {
      await $.gobo.goboKey.delete( key );
      await h.fail( 404, async function () {
        await $.gobo.goboKey.get( key );
      });
    })),
  
  ];
};

export { crud }
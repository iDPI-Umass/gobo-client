const testGroup = async function ( $ ) {
  const { h } = $;
  let person, store;

  return [

    await h.test( "update store", h.target( "store-person", async () => {
      person = await $.gobo.me.get();
      store = await $.gobo.person_store.put({
        person_id: person.id,
        name: "feed",
        content: {}
      });

      h.assert.equal( person.id, store.person_id );
    })),
    
    await h.test( "delete store", h.target( "store-person", async () => {
      const _store = await $.gobo.person_store.get({
        person_id: person.id,
        name: "feed"
      });

      h.assert.deepEqual( store, _store );
    })), 

  ];
};

export { testGroup as person }
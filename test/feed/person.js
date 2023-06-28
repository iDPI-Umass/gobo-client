import * as Value from "@dashkite/joy/value";

const testGroup = async function ( $ ) {
  const { h } = $;
  const person = await $.gobo.me.get();
  const identities = await $.gobo.personIdentities.get({
    person_id: person.id
  });
  let feed;
  let start;

  return [

    await h.test( "chronological feed", h.target( "feed-person", async () => {
      feed = await $.gobo.personIdentityFeed.get({
        person_id: person.id,
        id: identities[0].id
      });

      $.conforms( "person_identity_feed", "get", feed );
      h.assert.equal( 25, feed.feed.length );
    })),  

    await h.test( "paginate chronological feed", h.target( "feed-person", async () => {
      const page2 = await $.gobo.personIdentityFeed.get({
        person_id: person.id,
        id: identities[0].id,
        start: feed.next
      });

      $.conforms( "person_identity_feed", "get", feed );
      h.assert.equal( 25, page2.feed.length );
      for ( const id of page2.feed ) {
        h.assert(!feed.feed.includes(id));
      }
    })),

  ];
};

export { testGroup as person }
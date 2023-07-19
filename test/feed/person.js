import * as Value from "@dashkite/joy/value";

const testGroup = async function ( $ ) {
  const { h } = $;
  let person, identities, feed;
 

  return [

    await h.test( "chronological feed", h.target( "feed-person", async () => {
      person = await $.gobo.me.get();
      identities = await $.gobo.personIdentities.get({
        person_id: person.id
      });

      feed = await $.gobo.personIdentityFeed.get({
        person_id: person.id,
        id: identities[0].id
      });

      $.conforms( "person_identity_feed", "get", feed );
      h.assert.equal( 25, feed.feed.length );
    })), 
    
    await h.test( "single post graph", h.target( "feed-person", async () => {
      const result = await $.gobo.postGraph.get({ id: feed.feed[0] });

      $.conforms( "post_graph", "get", result );
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
import * as Value from "@dashkite/joy/value";

const testGroup = async function ( $ ) {
  const { h } = $;
  const person = await $.gobo.me.get();
  let fullFeed;

  return [

    await h.test( "chronological feed", h.target( "feed-person", async () => {
      fullFeed = await $.gobo.personFeed.get({
        person_id: person.id,
      });

      $.conforms( "person_feed", "get", fullFeed );
      h.assert.equal( 25, fullFeed.length );
    })),  

    await h.test( "paginate chronological feed", h.target( "feed-person", async () => {
      const feed = await $.gobo.personFeed.get({
        person_id: person.id,
        view: "full",
        page: 2,
        per_page: 25
      });

      $.conforms( "person_feed", "get", feed );
      h.assert.equal( 25, feed.length );
      const _fullFeed = fullFeed.map( post => post.id );
      const _feed = feed.map( post => post.id );
      for ( const id of _feed ) {
        h.assert(!_fullFeed.includes(id));
      }
    })),

  ];
};

export { testGroup as person }
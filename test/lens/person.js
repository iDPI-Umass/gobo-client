import * as Value from "@dashkite/joy/value";

const testGroup = async function ( $ ) {
  const { h } = $;
  const person = await $.gobo.me.get();
  let lens = null;

  return [

    await h.test( "add lenses", h.target( "lens-person", async () => {
      lens = await $.gobo.personLenses.post({
        parameters: {
          person_id: person.id
        },
        content: {
          person_id: person.id,
          category: "block",
          configuration: {
            type: "keyword",
            value: "example phrase"
          }
        }
      });

      $.conforms( "person_lenses", "post", lens );
    })),  

    await h.test( "list lenses", h.target( "lens-person", async () => {
      const lenses = await $.gobo.personLenses.get({
        person_id: person.id
      });

      $.conforms( "person_lenses", "get", lenses );
      h.assert( lenses.length > 0 );
    })),

    await h.test( "update lens", h.target( "lens-person", async () => {
      const _lens = Value.clone(lens);
      _lens.configuration.value = "example phrase edited";
      
      lens = await $.gobo.person_lens.put( _lens );

      h.partialEqual( _lens, lens, [
        "id",
        "category",
        "configuration",
        "created"
      ]);

      h.assert( _lens.updated < lens.updated );
    })),
    
    await h.test( "delete lens", h.target( "lens-person", async () => {
      await $.gobo.person_lens.delete({
        person_id: person.id,
        id: lens.id
      });

      await h.fail( 404, async function () {
        await $.gobo.lens.get( lens );
      });
    })), 

  ];
};

export { testGroup as person }
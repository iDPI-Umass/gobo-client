import * as Value from "@dashkite/joy/value";

const testGroup = async function ( $ ) {
  const { h } = $;
  let person, filter;

  return [

    await h.test( "add filters", h.target( "filter-person", async () => {
      person = await $.gobo.me.get();
      filter = await $.gobo.personFilters.post({
        parameters: {
          person_id: person.id
        },
        content: {
          person_id: person.id,
          category: "block keyword",
          active: true,
          configuration: {
            value: "example phrase"
          }
        }
      });

      $.conforms( "person_filters", "post", filter );
    })),  

    await h.test( "list filters", h.target( "filter-person", async () => {
      const filters = await $.gobo.personFilters.get({
        person_id: person.id
      });

      $.conforms( "person_filters", "get", filters );
      h.assert( filters.length > 0 );
    })),

    await h.test( "update filter", h.target( "filter-person", async () => {
      const _filter = Value.clone(filter);
      _filter.configuration.value = "example phrase edited";
      
      filter = await $.gobo.person_filter.put( _filter );

      h.partialEqual( _filter, filter, [
        "id",
        "category",
        "active",
        "configuration",
        "created"
      ]);

      h.assert( _filter.updated < filter.updated );
    })),
    
    await h.test( "delete filter", h.target( "filter-person", async () => {
      await $.gobo.person_filter.delete({
        person_id: person.id,
        id: filter.id
      });

      await h.fail( 404, async function () {
        await $.gobo.filter.get( filter );
      });
    })), 

  ];
};

export { testGroup as person }
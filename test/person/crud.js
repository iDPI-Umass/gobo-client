const crud = async function ( $ ) {
  const { h } = $;

  return [

    await h.test( "create person", h.target( "person-crud", async () => {
      const result = await $.gobo.people.post({
        name: "David Test", 
      });

      console.log(result);
    }))    
  
  ];
};

export { crud }
import FS from "node:fs/promises";
import FormData from "form-data";


const testGroup = async function ( $ ) {
  const { h } = $;
  let person, draft;
 

  return [

    await h.test( "upload draft image", h.target( "draft-image", async () => {
      person = await $.gobo.me.get();
      
      const form = new FormData();
      const file = await FS.readFile( "test/image/test.jpg" );
      form.append("image", file, { filename: "canyon" });
      form.append("name", "starry canyon");
      form.append("alt", "This is a starry canyon");

      draft = await $.gobo.personDraftImages.post({
        parameters: { person_id: person.id },
        content: form,
      }, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`
        }
      });

      console.log(draft);

      $.conforms( "person_draft_images", "post", draft );
    })), 
    
    await h.test( "delete draft image", h.target( "draft-image", async () => {
      await $.gobo.personDraftImage.delete({ 
        person_id: person.id,
        id: draft.id
      });

      await h.fail( 404, async function () {
        await $.gobo.personDraftImage.delete({ 
          person_id: person.id,
          id: draft.id
        });
      });
    })),

  ];
};

export { testGroup as person }
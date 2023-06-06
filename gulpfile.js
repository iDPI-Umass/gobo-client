import * as Task from "./tasks/index.js";


const checkSecrets = async function () {
  const config = await Task.Environment.check();
  await Task.Secret.check( config );
};

const putSecret = async function () {
  const config = await Task.Environment.check();
  await Task.Secret.put( config );
};

const putSecrets = async function () {
  const config = await Task.Environment.check();
  await Task.Secret.putAll( config );
}

const getSecret = async function () {
  const config = await Task.Environment.check();
  await Task.Secret.get( config );
};

const removeSecret = async function () {
  const config = await Task.Environment.check();
  await Task.Secret.remove( config );
};






export {
  checkSecrets,
  putSecret,
  putSecrets,
  getSecret,
  removeSecret
}
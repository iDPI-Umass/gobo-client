import * as _ from "@dashkite/joy";

const throws = function (f) {
  try {
    f()
  } catch (error) {
    return true;
  }
  return false;
};

const rejects = async function (f) {
  try {
    await f();
  } catch (error) {
    return true;
  }
  return false;
}

const px = {
  equal: _.eq,
  notEqual: _.negate(_.eq),
  deepEqual: _.equal,
  notDeepEqual: _.negate(_.equal),
  throws: throws,
  doesNotThrow: _.negate(throws)
};

const qx = {
  rejects: rejects,
  doesNotReject: async function (f) {
    return !(await rejects(f));
  }
};

  

const assert = function (x, why = "assertion failed") {
  if (x === true) {
    return true;
  } else {
    throw new Error(why);
  }
}

for (const name in px) {
  const f = px[name];
  (function(name, f) {
    return assert[name] = _.curry(_.arity(f.length, function(...ax) {
      return assert(_.apply(f, ax), `assertion ${name} failed`);
    }));
  })(name, f);
}

for (const name in qx) {
  const f = qx[name];
  (function(name, f) {
    return assert[name] = _.curry(_.arity(f.length, async function(...ax) {
      return assert((await _.apply(f, ax)), `assertion ${name} failed`);
    }));
  })(name, f);
}

export default assert
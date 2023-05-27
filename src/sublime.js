import * as Fn from "@dashkite/joy/function";
import * as Meta from "@dashkite/joy/metaclass";
import * as Type from "@dashkite/joy/type";

const createObject = function () {
  return {};
};


class SublimeError extends Error {
  constructor( response, message ) {
    super( message )
    this.response = response;
    this.status = response.status;
  }
}


class Sublime {
  static create ( fx ) {
    const f = Fn.pipe([
      createObject,
      ...fx
    ]);

    const _ = f();
    return Object.assign( (new Sublime), { _ } );
  }

  async issue () {
    if ( this.debug >= 2 ) {
      console.log( this._ );
    }
    if ( this.debug >= 1 ) {
      console.log( this.method, this.url );
    }

    
    let fetch;
    if (typeof window === "undefined") {
      fetch = this.fetch;
    } else {
      fetch = window.fetch;
    }
  
    return this.response = await fetch( this.url, {
      mode: "cors",
      redirect: "follow",
      method: this.method,
      headers: this.headers,
      body: this.body
    });
  }

  success ( status ) {
    if ( this.response.status !== status ) {
      throw new SublimeError( this.response, `
        sublime: unexpected response status
        ${ this.method } ${ this.url }
        responded with status ${ this.response.status }
      `);
    }
  }
  
  isNotFound () {
    return this.response.status === 404;
  }

  async json () {
    return this.response.json()
  }

}


Meta.mixin(Sublime.prototype, [
  Meta.getters({
    debug: function () {
      return this._.debug;
    },
    fetch: function () {
      return this._.fetch;
    },
    method: function () {
      return this._.method.toUpperCase();
    },
    url: function () {
      return this._.url;
    },
    headers: function () {
      return this._.headers;
    },
    body: function () {
      if ( this._body == null ) {
        if ( Type.isObject(this._.content) ) {
          this._body = JSON.stringify( this._.content );
        } else {
          this._body = this._.content;
        }
      }

      return this._body;
    }
  })
]);
  

export {
  Sublime,
  SublimeError
}
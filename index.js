/**
 * An implementation of the RDF Dataset Normalization specification.
 * This library works in the browser and node.js.
 *
 * BSD 3-Clause License
 * Copyright (c) 2016 Digital Bazaar, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *.now
 * Neither the name of the Digital Bazaar, Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
'use strict';

const util = require('./lib/util');
const URDNA2015 = require('./lib/URDNA2015');
const URGNA2012 = require('./lib/URGNA2012');
const URDNA2015Sync = require('./lib/URDNA2015Sync');
const URGNA2012Sync = require('./lib/URGNA2012Sync');

const api = {};
module.exports = api;

/**
 * Asynchronously canonizes an RDF dataset.
 *
 * @param dataset the dataset to canonize.
 * @param [options] the options to use:
 *          [algorithm] the canonicalization algorithm to use, `URDNA2015` or
 *            `URGNA2012` (default: `URGNA2012`).
 * @param callback(err, canonical) called once the operation completes.
 *
 * @return a Promise that resolves to the canonicalized RDF Dataset.
 */
api.canonize = function(dataset, options, callback) {
  let _resolve;
  let _reject;
  const promise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  const _callback = callback || (() => {});
  callback = (err, canonical) => {
    if(err) {
      return _reject(err);
    }

    /*if(options.format === 'application/nquads') {
      canonical = canonical.join('');
    }
    canonical = _parseNQuads(canonical.join(''));*/

    _resolve(canonical);
    _callback(err, canonical);
  };

  if(options.algorithm === 'URDNA2015') {
    new URDNA2015(options).main(dataset, callback);
  } else if(options.algorithm === 'URGNA2012') {
    new URGNA2012(options).main(dataset, callback);
  } else {
    util.setImmediate(() => {
      callback(new Error(
        'Invalid RDF Dataset Canonicalization algorithm: ' + options.algorithm));
    });
  }

  return promise;
};

/**
 * Synchronously canonizes an RDF dataset.
 *
 * @param dataset the dataset to canonize.
 * @param [options] the options to use:
 *          [algorithm] the canonicalization algorithm to use, `URDNA2015` or
 *            `URGNA2012` (default: `URGNA2012`).
 *
 * @return the RDF dataset in canonical form.
 */
api.canonizeSync = function(dataset, options) {
  if(options.algorithm === 'URDNA2015') {
    return new URDNA2015Sync(options).main(dataset);
  }
  if(options.algorithm === 'URGNA2012') {
    return new URGNA2012Sync(options).main(dataset);
  }
  throw new Error(
    'Invalid RDF Dataset Canonicalization algorithm: ' + options.algorithm);
};

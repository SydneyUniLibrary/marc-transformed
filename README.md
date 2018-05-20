# marc-transformed

Read, manipulate and write [MARC](https://www.loc.gov/marc/) records using NodeJS streams.


## Compatibility 

* NodeJS v10 or later
* TypeScript 2.8 or later



## Examples


### Converting a MARC file into text format

This example creates a text (MarcEdit-compatible) file from the records in a MARC file in transmission (aka binary)
format. No changes are made to the fields and subfields in the records.

```typescript
import fs from 'fs'
import { transformFrom, transformTo } from '@sydneyunilibrary/marc-transformed'

const inputFilename = 'input.mrc'
const outputFilename = 'output.mrk8'

console.log('Converting', inputFilename, 'to', outputFilename)
fs.pipeline(
  fs.createReadStream(inputFilename),
  transformFrom('marc'),
  transformTo('text'),
  fs.createWriteStream(outputFilename),
  err => {
    if (err) {
      console.error(err)
    } else {
      console.log('Done')
    }
  }
)
```


### Template for altering records

This is some boiler-plate that you can use if you want to read in a file of records, work on each record in some way,
and then write them out to a different file.

Note that this technique only works if you are working on one record at a time.

```typescript
import fs from 'fs'
import { transformFrom, transformTo, transformRecord, Record } from '@sydneyunilibrary/marc-transformed'

const inputFilename = 'input.mrc'
const inputFormat = 'marc' // or 'json' or 'xml' or 'text'
const outputFilename = 'output.mrc'
const outputFormat = 'marc' // or 'json' or 'xml' or 'text'

function transformFunction(record: Record): Record | null | undefined {
  api.md
  // TODO: Return the record if you want to include it in the output file, 
  //       return null or undefined if you want to filter it out,
  //       or throw an Error if you want abort the program. 
  return record 
}

console.log('Transforming records in', inputFilename, 'into', outputFilename)
fs.pipeline(
  fs.createReadStream(inputFilename),
  transformFrom(inputFormat),
  transformRecord(transformFunction),
  transformTo(outputFormat),
  fs.createWriteStream(outputFilename),
  err => {
    if (err) {
      console.error(err)
    } else {
      console.log('Done')
    }
  }
)
``` 



## Further documentation

`marc-transformed` has 2 major parts to its API.

* [Transform API](docs/transform-api.md) - An API transforming to and from streams of bytes and streams of `Record` objects.
* [Record API](docs/record-api.md) - An API for creating, query and editing MARC records and fields.

Additionally:

* [Frequently asked questions](docs/faq.md)
* [Examples](docs/examples.md)

If you not using `marc-transformed` but are hacking at the code for `marc-transformed` itself:

* [Internal API](docs/internal-api.md)  



## Copyright

Copyright (c) 2018 The University of Sydney Library



## License

[2-Clause BSD](https://opensource.org/licenses/BSD-2-Clause) 
See the LICENSE file for details.



## Prior works

While no code was actually copied from any other project, some of the ideas and
APIs of this project were in part derived from or inspired by the following
projects.

All due acknowledgement and thanks to the contributors of these projects.

* [pymarc](https://github.com/edsu/pymarc)
Copyright (c) 2005-2016 Gabriel Farrell, Mark Matienzo, Geoffrey Spear, Ed Summers

* [marcjs](https://github.com/fredericd/marcjs)
Copyright (c) 2013-2016 Frédéric Demians Licensed under the MIT license.

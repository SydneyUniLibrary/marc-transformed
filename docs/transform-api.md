# Transform API

The primary purpose of `marc-transformed` is to transform streams of bytes into streams of `Record` objects and to
transform streams of `Record` objects into streams of bytes.

How a MARC records looks as a stream of bytes depends on the transform format. `marc-transform` supports the following
transport formats. 

| Transport format | Transforming from | Transforming to |
| --- | --- | --- |
| [ISO 2609 MARC transmission format](http://www.loc.gov/marc/specifications/) (1) | `transformFrom('marc')` | `transformTo('marc') ` |
| [MARCXML](https://www.loc.gov/standards/marcxml/) | `transformFrom('xml')` | `transformTo('xml')` |
| [MARC in JSON](https://github.com/marc4j/marc4j/wiki/MARC-in-JSON-Description) | `transformFrom('json')` | `transformTo('json')` |
| [Text](https://www.loc.gov/marc/makrbrkr.html) (2) | `transformFrom('text')` | `transformTo('text')` |

(1) Transmission format is also sometimes called binary format. `marc-transformed` only supports Unicode records, and not MARC-8.

(2) The text format is compatible with [MarcEdit](http://marcedit.reeset.net/). 



## transformFrom(transportFormat: string, options?: any): stream.Transform

Returns a `stream.Transform` that transforms a stream of bytes in a given transport format into a stream of records.

The writable (input) side of the transform expects Buffers of bytes. The readable (output) side of the transform will be
in object mode and will emit `data` events containing a `Record` object.

If the transform is unable to decode a records from the given transport format, it will emit an `error` event.

The transform may internally buffer some of the input data. You may need to close the source readable before the
transform emits the last record.

**NOTE** The transforms are stateful and cannot be reused. Call `transformForm` each time you need one.



## transformTo(transportFormat: string, options?: any): stream.Transform

Returns a `stream.Transform` that transforms a stream of records into a stream of bytes in a given transport format.

The writable (input) side of the transform will be in object mode and expects `Record` objects. The readable (output)
side of the transform is not in object mode and will emit `data` events containing a Buffer of bytes.

The transform may emit multiple Buffers for a single record.

If the transform is unable to encode a record into the given transport format, it will emit an `error` event.
This may be after the transform has already emitted some `data` events for the record. 

**NOTE** The transforms are stateful and cannot be reused. Call `transformTo` each time you need one.



## transformRecord(transformFunction: TransformRecordFunction): stream.Transform

Returns a `stream.Transform` that applies the given transform function to each record in the stream.

Typically `transformRecord` is put between a `transformFrom` and a `transformTo` in a stream pipeline.

The given transformFunction take a single Record parameter and operates on the record somehow.

If `transformFunction` returns a record (not necessarily the same record object it was given), the transform will emit a
`data` event containing the record.

If `transformFunction` returns `null` or `undefined`, then the transform will not emit any `data` event and move onto
the next record in the stream.

If `transformFunction` throws an `Error`, the transform will emit an `error` event containing that error.

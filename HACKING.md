## Hacking at marc-transformed

If you are not hacking at `marc-transformed` itself but are just using the library, this is not the documentation you
need (hopefully). Head over to the [API](API.md) for the documentation you need.

These are some notes on `marc-transformed` and documentation on some internal APIs, in case some poor sole needs to
maintain this code. 

 


## DataElement

A `DataElement` represents the data stored in a control field or a subfield of a data field. It exists to store Unicode
or MARC-8 data, and to convert between Unicode and MARC-8 as necessary, but only as necessary. MARC-8 data will not be
converted to Unicode unless you try to read the data element. Similarly Unicode data will not be converted to MARC-8
unless to try to write a MARC-8 `Record`.

The effect of this is that MARC-8 data will safely round-trip if you don't access it. For example, if you only delete
whole records, control fields or subfields of a data field; and you source from and sink into MARC transmission
format.


### static fromUnicode(data: String | Buffer): DataElement

Creates a new Unicode data element from the given data.

If you give the data as a Buffer, it will be decoded as a UTF-8.

The unicode property of the resulting data element will have the (decoded) Unicode data.


### static fromMarc8(data: Buffer): DataElement

Creates a new MARC-8 data element from the given data.

The marc8 property of the resulting data element will the MARC-8 data.


### get/set unicode: string

Reads or writes the data in the element as Unicode.

**TODO** On get, convert MARC-8 data into Unicode.


### get/set marc8: Buffer

Reads or writes the data in the element as MARC-8.

**TODO** On get, convert Unicode data into MARC-8.

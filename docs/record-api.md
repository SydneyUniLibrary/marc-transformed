# Record API

The Record API allows you to create, query and edit MARC records and their fields. To read or write records, use the
the [Transform API](transform-api.md).

![Class diagram for the Record API](record-api-classes.svg)

NOTE: This is a simplification of reality. If you trying to hack at `marc-transformed` see the [internal API](internal-api.md).



## [Record](record-api-record.md)

| Constructors                                   | Properties                             | Methods                                     |
| ---------------------------------------------- | -------------------------------------- | ------------------------------------------- |
| [Record.from](record-api-record.md#recordfrom) | [leader](record-api-record.md#leader)  | [add](record-api-record.md#add)             |
|                                                | [fields](record-api-record.md#fields)  | [delete](record-api-record.md#delete)       |
|                                                | [id](record-api-record.md#id)          | [each](record-api-record.md#each)           |
|                                                | [type](record-api-record.md#type)      | [findFirst](record-api-record.md#findfirst) | 
|                                                |                                        | [hasAll](record-api-record.md#hasall)       |
|                                                |                                        | [hasAny](record-api-record.md#hasany)       |
|                                                |                                        | [sort](record-api-record.md#sort)           |



## [ControlField](record-api-control-field.md)

| Constructors                                                      | Properties                               | Methods                                        |
| ----------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------- |
| [ControlField.from](record-api-control-field.md#controlfieldfrom) | [tag](record-api-control-field.md#tag)   | [matches](record-api-control-field.md#matches) |
|                                                                   | [data](record-api-control-field.md#data) |                                                |



## [DataField](record-api-data-field.md)

| Constructors                                             | Properties                                                | Methods                                         |
| -------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------- |
| [DataField.from](record-api-data-field.md#datafieldfrom) | [tag](record-api-data-field.md#tag)                       | [append](record-api-data-field.md#append)       |
|                                                          | [indicators](record-api-data-field.md#indicators)         | [delete](record-api-data-field.md#delete)       |
|                                                          | [subfields](record-api-data-field.md#subfields)           | [each](record-api-data-field.md#each)           |
|                                                          |                                                           | [findFirst](record-api-data-field.md#findfirst) | 
|                                                          | [*subfieldCodes*](record-api-data-field.md#subfieldcodes) | [hasAll](record-api-data-field.md#hasall)       |
|                                                          | [*value*](record-api-data-field.md#value)                 | [hasAny](record-api-data-field.md#hasany)       |
|                                                          |                                                           | [matches](record-api-data-field.md#matches)     |
|                                                          |                                                           | [pick](record-api-data-field.md#pick)           |
|                                                          |                                                           | [prepend](record-api-data-field.md#prepend)     |
|                                                          |                                                           | [push](record-api-data-field.md#push)           |
|                                                          |                                                           | [unshift](record-api-data-field.md#unshift)     |



## [Subfield](record-api-subfield.md)

| Constructors                                         | Properties                          | Methods                                   |
| ---------------------------------------------------- | ----------------------------------- | ----------------------------------------- |
| [Subfield.from](record-api-subfield.md#subfieldfrom) | [code](record-api-subfield.md#code) | [matches](record-api-subfield.md#matches) |
|                                                      | [data](record-api-subfield.md#data) |                                           |



## Additional documentation

* [Record and field values](record-api-values.md)

* [Field criteria](record-api-field-criteria.md)

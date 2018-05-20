# Frequently asked questions

### 1. Why is it called marc-transformed? What's so transformative?

To be honest, there's nothing ground breaking about this project.
The `-transformed` part of the name comes from the idea of basing the library around 
[stream.Transform](https://nodejs.org/dist/latest-v10.x/docs/api/stream.html#stream_class_stream_transform).
It's a bit of a play on the practice of naming a library `-as-promised` when the library's API is based on Promises.

The idea is that instead using a reader to read from a MARC file or using a writer to write to a MARC file,
you instead transform a file into a stream of MARC records or you transform a
stream of MARC records into a file.

The flexibility of this approach is that you can source/read from or sink/write to any stream, not just files.
And you can freely add any other transforms before or after the MARC transforms.


---
'@stacks/connect': patch
---

Strip unserializable function values from parameters passed into the request function. This previously caused errors during JSON serialization in some providers.

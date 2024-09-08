import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Nextjs API route to handle file upload request
// Process incoming request according to defined router config in core.ts
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

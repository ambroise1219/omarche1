import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export des routes pour Next.js App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

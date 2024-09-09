import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

// generate useUploadThing hook using exisiting router definition
export const { useUploadThing } = generateReactHelpers<OurFileRouter>();

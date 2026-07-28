import { ImageResponse } from "next/og";

import { KarsilaSocialImage } from "@/components/brand/KarsilaSocialImage";

export const alt =
  "Karsila — private airport transfers with trusted local drivers";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<KarsilaSocialImage />, size);
}

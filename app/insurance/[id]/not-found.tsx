import type { Metadata } from "next";

import NotFoundPanel from "@/app/components/NotFoundPanel";

export const metadata: Metadata = { title: "Product not found" };

export default function ProductNotFound() {
  return (
    <NotFoundPanel
      title="Product not found"
      description="There is no product with that ID in this dataset. It holds a selection from IRDAI's database, not every product listed there."
      links={[
        { href: "/insurance", label: "Back to all products" },
        { href: "/", label: "Go to the home page" },
      ]}
    />
  );
}

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";

type SanityImageSource = Parameters<
  ReturnType<typeof imageUrlBuilder>["image"]
>[0];

export const sanityClient = createClient({
  projectId: "dsd0xuwd",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export type Wine = {
  _id: string;
  name: string;
  description?: string;
  image?: SanityImageSource;
  order?: number;
};

export type HomePage = {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
  bannerImage?: SanityImageSource;
  catalogEyebrow?: string;
  catalogTitle?: string;
};

export type AboutPage = {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  body?: PortableTextBlock[];
  asideTitle?: string;
  asideBody?: string;
};

export type ContactPage = {
  eyebrow?: string;
  title?: string;
  addressLines?: string[];
  openingHours?: { _key: string; days?: string; hours?: string }[];
  phone?: string;
  email?: string;
};

export const wineListQuery = `*[_type == "wine"] | order(order asc, name asc){
  _id, name, description, image, order
}`;

export const wineByIdQuery = `*[_type == "wine" && _id == $id][0]{
  _id, name, description, image, order
}`;

export const homePageQuery = `*[_type == "homePage"][0]{
  eyebrow, title, titleAccent, description, bannerImage, catalogEyebrow, catalogTitle
}`;

export const aboutPageQuery = `*[_type == "aboutPage"][0]{
  eyebrow, title, titleAccent, body, asideTitle, asideBody
}`;

export const contactPageQuery = `*[_type == "contactPage"][0]{
  eyebrow, title, addressLines, openingHours, phone, email
}`;

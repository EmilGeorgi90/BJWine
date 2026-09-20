import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";

type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0];

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
  category?: WineCategory;
};

export type WineCategory = {
  _id: string;
  name: string;
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

export type TastingContentSection = {
  _key: string;
  _type: "tastingContentSection";
  eyebrow?: string;
  title: string;
  body?: PortableTextBlock[];
  image?: SanityImageSource;
};

export type TastingPracticalSection = {
  _key: string;
  _type: "tastingPracticalSection";
  eyebrow?: string;
  title: string;
  intro?: string;
  items?: { _key: string; label: string; value: string }[];
};

export type TastingContactSection = {
  _key: string;
  _type: "tastingContactSection";
  title: string;
  body?: string;
  buttonText: string;
};

export type TastingPage = {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  introduction?: string;
  heroImage?: SanityImageSource;
  sections?: (TastingContentSection | TastingPracticalSection | TastingContactSection)[];
};

export const wineListQuery = `*[_type == "wine"] | order(order asc, name asc){
  _id, name, description, image, order,
  "category": category->{_id, name, order}
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

export const wineCategoriesQuery = `*[_type == "wineCategory"] | order(order asc, name asc){
  _id, name, order
}`;

export const tastingPageQuery = `*[_type == "tastingPage"][0]{
  eyebrow,
  title,
  titleAccent,
  introduction,
  heroImage,
  sections[]{
    _key,
    _type,
    eyebrow,
    title,
    body,
    image,
    intro,
    items[]{_key, label, value},
    buttonText
  }
}`;

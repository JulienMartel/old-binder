import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { NextSeo } from "next-seo";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Binder</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Seo />

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}

const Seo = () => (
  <NextSeo
    title="binder"
    description="find your next favorite book"
    canonical="https://jubag.dev" // change this
    openGraph={{
      url: "https://jubag.dev", // change this
      title: "binder",
      description: "find your next favorite book",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 628,
          alt: "binder",
        },
      ],
      siteName: "binder",
    }}
    twitter={{
      handle: "@cc4888",
      site: "@cc4888",
      cardType: "summary_large_image",
    }}
  />
);

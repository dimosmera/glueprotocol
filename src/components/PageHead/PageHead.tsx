import Head from "next/head";

const img = "https://www.glueprotocol.com/glue-social.png";
const description = "Instantly convert and send value";

const PageHead = () => {
  const titleMetaTag = `Glue Protocol - ${description}`;
  const descriptionMetaTag = `${description} with glueprotocol.com`;

  return (
    <Head>
      <title>{titleMetaTag}</title>
      <meta name="description" content={descriptionMetaTag} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content="@dimos851" />

      <meta name="twitter:title" content={titleMetaTag} />
      <meta name="og:title" content={titleMetaTag} />

      <meta property="twitter:image" content={img} />
      <meta property="og:image" content={img} />

      <meta name="twitter:card" content="summary_large_image" />

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
};

export default PageHead;

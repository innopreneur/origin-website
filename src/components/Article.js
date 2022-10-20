import Moment from "react-moment";

import Layout from "./strapi/layout";
import Seo from "./strapi/seo";

import { Typography } from "@originprotocol/origin-storybook";

import Image from "next/image";
import Link from "next/link";
import Media from "./strapi/blocks/Media";
import Quote from "./strapi/blocks/Quote";
import RichText from "./strapi/blocks/RichText";
import styles from "styles/Article.module.css";

const getBlockComponent = ({ __component, ...rest }, index) => {
  let Block;

  switch (__component) {
    case "shared.rich-text":
      Block = RichText;
      break;
    case "shared.media":
      Block = Media;
      break;
    case "shared.quote":
      Block = Quote;
      break;
  }
  return Block ? <Block key={`index-${index}`} {...rest} /> : null;
};

const BlockManager = ({ blocks }) => {
  return <div>{blocks.map(getBlockComponent)}</div>;
};

BlockManager.defaultProps = {
  blocks: [],
};

const Article = ({ article, navLinks }) => {
  const imageUrl = article.cover?.url;

  const seo = {
    metaTitle: article.title,
    metaDescription: article.description,
    shareImage: article.cover,
    article: true,
  };

  return (
    <Layout navLinks={navLinks}>
      <Seo seo={seo} />
      <div
        className="pb-20 px-6"
        style={{
          backgroundColor: "#F6F8FE",
        }}
      >
        <div className="max-w-screen-xl mx-auto">
          <Typography.Link className="flex space-x-2">
            <Image
              src="/images/left-arrow.svg"
              width="10"
              height="7"
              className="ml-2"
              alt="left arrow"
            />
            <Link href="/company" className="ml-3">
              Back to home page
            </Link>
          </Typography.Link>
        </div>
        <div className="mb-6 mt-2 max-w-screen-xl mx-auto">
          <Typography.H3 as="h1">{article.title}</Typography.H3>
        </div>
        <div className="max-w-screen-xl mx-auto bg-white rounded-2xl pb-10">
          {imageUrl && (
            <div
              id="banner"
              className="bg-cover flex justify-center items-center m-0 h-96 w-full rounded-tl-2xl rounded-tr-2xl relative overflow-hidden"
              data-src={imageUrl}
              data-srcset={imageUrl}
            >
              <Image
                src={imageUrl}
                alt={article.cover?.alternativeText}
                layout='fill'
                objectFit='cover'
                priority
              />
            </div>
          )}
          <div className="pt-6 md:pt-12">
            <div className={`py-6 pl-6 pr-6 md:px-28 ${styles.article}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: article.body,
                }}
              />
              <hr className="my-6" />
              <div className="flex items-center">
                <div>
                  {article.author.avatar && (
                    <Image
                      src={article.author.avatar.url}
                      alt={article.author.avatar.alternativeText}
                      style={{
                        position: "static",
                        borderRadius: "20%",
                        height: 60,
                      }}
                      width="64px"
                      height="64px"
                    />
                  )}
                </div>
                <div className="ml-4">
                  <p>
                    By {article.author.name}
                  </p>
                  <p>
                    <Moment format="MMM Do YYYY">{article.published_at}</Moment>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Article;

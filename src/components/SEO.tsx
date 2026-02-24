import { Helmet } from 'react-helmet-async';
import { toAbsoluteUrl } from '../config';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SEO = ({
  title,
  description = "AyurVita - Your trusted partner in healthcare.",
  image = "/og-image.png",
  url = typeof window !== 'undefined' ? window.location.href : undefined
}: SEOProps) => {
  const siteTitle = "AyurVita";
  const absoluteImage = toAbsoluteUrl(image);
  const absoluteUrl = url ? (url.startsWith('http') ? url : toAbsoluteUrl(url)) : toAbsoluteUrl('/');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={absoluteUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
    </Helmet>
  );
};

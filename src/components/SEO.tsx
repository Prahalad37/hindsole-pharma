import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
}

export const SEO = ({
    title,
    description = "Hindsole Pharma - Your trusted partner in healthcare.",
    image = "/og-image.jpg",
    url = window.location.href
}: SEOProps) => {
    const siteTitle = "Hindsole Pharma";

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{`${title} | ${siteTitle}`}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

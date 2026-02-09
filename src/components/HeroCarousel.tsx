import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HeroCarousel.css';

interface HeroSlide {
    id: number;
    image: string;
    mobileImage?: string;
    alt: string;
}

const heroSlides: HeroSlide[] = [
    {
        id: 2,
        image: '/hero-slides/slide2-desktop.jpg',
        mobileImage: '/hero-slides/slide2-mobile.jpg',
        alt: 'Diabvita - Diabetes Care'
    },
    {
        id: 3,
        image: '/hero-slides/slide3-desktop.jpg',
        mobileImage: '/hero-slides/slide3-mobile.jpg',
        alt: 'Gynevita - Women Wellness'
    },
    {
        id: 4,
        image: '/hero-slides/slide4-desktop.jpg',
        mobileImage: '/hero-slides/slide4-mobile.jpg',
        alt: 'Immunity Booster Collection'
    },
    {
        id: 5,
        image: '/hero-slides/slide5-desktop.jpg',
        mobileImage: '/hero-slides/slide5-mobile.jpg',
        alt: 'Digestive Health Solutions'
    }
];

const HeroCarousel: React.FC = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: false,
        arrows: false,
        fade: false,
        cssEase: 'ease-in-out',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    fade: false,
                    speed: 600
                }
            }
        ]
    };

    return (
        <div className="hero-carousel-wrapper">
            <Slider {...settings}>
                {heroSlides.map((slide) => (
                    <div key={slide.id} className="hero-slide">
                        <picture>
                            {slide.mobileImage && (
                                <source media="(max-width: 768px)" srcSet={slide.mobileImage} />
                            )}
                            <img
                                src={slide.image}
                                alt={slide.alt}
                                className="hero-slide-image"
                                loading={slide.id === 1 ? 'eager' : 'lazy'}
                            />
                        </picture>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HeroCarousel;

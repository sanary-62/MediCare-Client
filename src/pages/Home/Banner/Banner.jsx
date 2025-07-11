import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerImg1 from "../../../assets/Banner-1.jpg";
import bannerImg2 from "../../../assets/Banner-2.jpg";
import bannerImg3 from "../../../assets/Banner-3.jpg";
import { Carousel } from "react-responsive-carousel";

const Banner = () => {
  return (
    <Carousel className="mt-5"
      autoPlay={true}
      infiniteLoop={true}
      interval={3000}
      showThumbs={false}
      showStatus={false}
      showIndicators={true}
    >
      <div>
        <img src={bannerImg1} />
      </div>
      <div>
        <img src={bannerImg2} />
      </div>
      <div>
        <img src={bannerImg3} />
      </div>
    </Carousel>
  );
};

export default Banner;

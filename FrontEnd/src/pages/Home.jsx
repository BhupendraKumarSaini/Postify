import React, { memo } from "react";
import SEO from "../components/SEO";
import Hero from "../components/Hero";
import TrendingStories from "../components/TrendingStories";
import Categories from "../components/Categories";
import WhyChoosePostify from "../components/WhyChoosePostify";
import CallToAction from "../components/CallToAction";

const Home = () => {
  return (
    <>
      <SEO
        title="Write. Publish. Inspire."
        description="Postify is a modern blogging platform for creators and developers. Write, publish and grow your audience."
      />

      <Hero />
      <TrendingStories />
      <Categories />
      <WhyChoosePostify />
      <CallToAction />
    </>
  );
};

export default memo(Home);

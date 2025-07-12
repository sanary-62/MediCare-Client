import React from 'react';
import Banner from '../Banner/Banner';
import PopularCamps from '../PopularCamps/PopularCamps'
import Feedback from '../Feedback/Feedback';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <PopularCamps></PopularCamps>
            <Feedback></Feedback>
        </div>
    );
};

export default Home;
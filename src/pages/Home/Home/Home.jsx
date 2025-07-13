import React from 'react';
import Banner from '../Banner/Banner';
import PopularCamps from '../PopularCamps/PopularCamps'
import Feedback from '../Feedback/Feedback';
import UpcomingCamps from '../UpcomingCamps/UpcomingCamps';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <PopularCamps></PopularCamps>
            <UpcomingCamps></UpcomingCamps>
            <Feedback></Feedback>
        </div>
    );
};

export default Home;
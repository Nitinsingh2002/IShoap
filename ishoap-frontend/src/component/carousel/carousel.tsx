import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import './caro.css';

export function Carosuel() {
    return (
        <div className="carousel-wrapper" >
            <Carousel
                showThumbs={false}
                autoPlay={true}
                transitionTime={3}
                infiniteLoop={true}
                showStatus={false}
                className="poster"
            >
                <div className="posterImage">
                    <img src="/images/img2cut3.jpg" alt="first1" />
                </div>
                <div className="posterImage">
                    <img src="/images/img3cut2.png" alt="second2" />
                </div>
                <div className="posterImage">
                    <img src="/images/inmg1cut1.jpg" alt="third3" />
                </div>
                <div className="posterImage">
                    <img src="/images/img4cut4.jpg" alt="fourth3" />
                </div>
            </Carousel>
        </div>
    );
}

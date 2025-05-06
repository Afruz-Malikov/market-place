import { ReactElement } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import styles from './slider.module.scss';
import './swipercustom.css';
interface SliderProps {
  options: ReactElement[];
}

function Slider({ options }: SliderProps) {
  return (
    <div className={styles.slider}>
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        className={styles.swiper}
      >
        {options.map((option, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            {option}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Slider;

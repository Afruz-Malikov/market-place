import style from './infocard.module.scss';
import { ReactElement } from 'react';

interface infoCardProps {
  icon: ReactElement;
  title: string;
  text: string;
}
function InfoCard({ icon, title, text }: infoCardProps) {
  return (
    <div className={style.card}>
      <div className={style.icon}>{icon}</div>
      <div className={style.info}>
        <h3>{title}:</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default InfoCard;

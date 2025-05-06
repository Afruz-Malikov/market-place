import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './notfound.module.scss';
import Button from '../../components/UI/Button/Button';
import Text from '../../components/UI/Text/Text';
import Title from '../../components/UI/Title/Title';
import Container from '../../components/UI/Container/Container';

function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <Container className={styles.container}>
      <Title className={styles.title}>{t('not_found.title')}</Title>
      <Text className={styles.message}>{t('not_found.message')}</Text>
      <Button onClick={handleBackHome} className={styles.button}>
        {t('not_found.button')}
      </Button>
    </Container>
  );
}

export default NotFound;

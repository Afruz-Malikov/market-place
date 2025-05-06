import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.scss';
import Button from '../../components/UI/Button/Button';
import Text from '../../components/UI/Text/Text';
import Title from '../../components/UI/Title/Title';
import Container from '../../components/UI/Container/Container';

function NotFound() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <Container className={styles.container}>
      <Title className={styles.title}>Страница не найдена</Title>
      <Text className={styles.message}>
        Возможно, вы ввели неправильный адрес.
      </Text>
      <Button onClick={handleBackHome} className={styles.button}>
        На главную
      </Button>
    </Container>
  );
}

export default NotFound;

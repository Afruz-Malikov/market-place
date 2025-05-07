import { useNavigate, useParams } from 'react-router-dom';

export function useCustomNavigate() {
  const navigate = useNavigate();
  const { shopId } = useParams();

  return (to: string, options = {}) => {
    if (!shopId) return;

    const path = to.startsWith('/')
      ? `/shop/${shopId}${to}`
      : `/shop/${shopId}/${to}`;

    navigate(path, options);
  };
}

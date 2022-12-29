import { FC } from 'react';

import ImageLogo from '../../images/image-logo.svg';

import styles from './Logo.module.scss';

const Logo: FC = () => {
  return (
    <div className={styles.container}>
      <img src={ImageLogo} alt="Urbipedia" height="24" width="110" />
    </div>
  );
};

export default Logo;

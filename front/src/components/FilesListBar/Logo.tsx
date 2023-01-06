import { FC } from 'react';

import ImageLogo from '../../images/image-logo.svg';

import styles from './Logo.module.scss';

const Logo: FC = () => {
  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        height="24"
        width="110"
        src={ImageLogo}
        alt="Urbipedia"
      />
    </div>
  );
};

export default Logo;

import { FC } from 'react';

import ImageLogo from '../../images/image-logo.svg';

const Logo: FC = () => {
  return (
    <div>
      <img src={ImageLogo} alt="Urbipedia" height="24" width="110" />
    </div>
  );
};

export default Logo;

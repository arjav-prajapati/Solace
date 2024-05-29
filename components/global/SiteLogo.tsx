import siteLogo from '/assets/images/logo/site-logo.png' 

import { FC } from 'react';

interface Props {
    className?: string;
}

const SiteLogo: FC<Props> = () => {
    return (
        <>
            <img
                className="w-80"
                src={siteLogo}
                alt="logo"
            />
        </>
    );
};

export default SiteLogo
import { useState, useEffect } from "react";

const maxLargeMobileWidth = 800;
const maxSmallMobileWidth = 520;

export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        typeId: 0,
        typeName: 'PC'
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        function handleResize() {
            const width = window.innerWidth;
            const typeId = width > maxLargeMobileWidth
                ? 0
                : (width > maxSmallMobileWidth ? 1 : 2);
            const typeName = typeId == 0
                ? 'PC'
                : (typeId == 1 ? 'LG-MOBILE' : 'SM-MOBILE');

            setWindowSize({ width, typeId, typeName });
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

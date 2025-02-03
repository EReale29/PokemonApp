import React from 'react';
import Link from 'next/link';

interface NavItemProps {
    href: string;
    children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ href, children }) => (
    <li className="nav-item">
        <Link href={href} className="nav-link">
            {children}
        </Link>
    </li>
);

export default NavItem;
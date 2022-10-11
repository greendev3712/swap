import Link from 'next/link';
import Logo from '../assets/FullLogo.svg';
import LINKS from '../constants/menu';

export default function Footer() {
    return (
        <footer className="px-4 sm:px-10 w-full z-10">
            <div className="w-full h-[140px] flex items-center px-5 sm:px-14 bg-[#242424] rounded-[32px]">
                <div className="flex-grow">
                    <Logo className="h-16" />
                </div>
                <div>
                    {LINKS.map((link) => (
                        <Link key={link.id} href={link.url}>
                            <a className="text-md text-white uppercase underline underline-offset-8 underline-color decoration-[#90E040] mr-4">
                                {link.title}
                            </a>
                        </Link>
                    ))}
                </div>
            </div>
            <p className="uppercase text-[#646464] ml-5 sm:ml-14">Yourlife. 2022</p>
        </footer>
    )
}
import * as React from "react";
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { Menu, X } from 'lucide-react';
import heroImg from '../../assets/image.png';

const menuItems = [
    { name: 'Features', to: '#' },
    { name: 'Testimonials', to: '#' },
    { name: 'Discover', to: '#' },
    { name: 'About', to: '#' },
];

export const HeroSection = () => {
    const [menuState, setMenuState] = React.useState(false);
    return (
        <div>
            <header>
                <nav
                    data-state={menuState && 'active'}
                    className="fixed z-20 w-full border-b border-double border-black bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
                    <div className="m-auto max-w-5xl px-6">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                            <div className="flex w-full text-black justify-between lg:w-auto">
                                <Link
                                    to="/"
                                    aria-label="home"
                                    className="flex items-center gap-2">
                                    <Logo />
                                </Link>

                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState === true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                    <Menu className="m-auto h-6 w-6 transition-all duration-200 group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0" />
                                    <X className="absolute inset-0 m-auto h-6 w-6 -rotate-180 scale-0 opacity-0 transition-all duration-200 group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100" />
                                </button>
                            </div>

                            <div className="group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end gap-y-8 rounded-3xl border bg-white p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:gap-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:bg-zinc-900 dark:shadow-none lg:dark:bg-transparent">
                                <div className="lg:pr-4">
                                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    to={item.to}
                                                    className="text-gray-700 hover:text-black dark:hover:text-white block transition-colors duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                                    <Button
                                        asChild
                                        size="sm"
                                        className="bg-black text-white hover:bg-zinc-900 border-none">
                                        <Link to="/login">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="bg-black text-white hover:bg-zinc-900 border-none">
                                        <Link to="/signup">
                                            <span>Signup</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-[80rem] -translate-y-87.5 absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>

                <section className="overflow-hidden bg-white dark:bg-transparent">
                    <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-24">
                        <div className="relative z-10 mx-auto max-w-2xl text-center">
                         
                            <h1 className="text-balance text-4xl  text-black font-semibold md:text-4xl lg:text-5xl">Stream It ,Say It & Share It.</h1>
                            <p className="mx-auto my-8 max-w-2xl text-black text-xl">Join communities you care about. Chat with like-minded people. Powered by blazing-fast Stream Chat and Video Calls.</p>

                            <Button
                                asChild
                                size="lg"
                                className="bg-black text-white hover:bg-zinc-900 border-none">
                                <Link to="/home">
                                    <span className="btn-label">Start Networking</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mx-auto -mt-16 max-w-7xl [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]">
                        <div className="[perspective:1200px] [mask-image:linear-gradient(to_right,black_50%,transparent_100%)] -mr-16 pl-16 lg:-mr-56 lg:pl-56">
                            <div className="[transform:rotateX(20deg);]">
                                <div className="lg:h-[44rem] relative skew-x-[.36rad]">
                                    <img
                                        className="rounded-[--radius] z-[2] relative border dark:hidden"
                                        src={heroImg}
                                        alt="Tailark hero section"
                                        width={2880}
                                        height={2074}
                                    />
                                    <img
                                        className="rounded-[--radius] z-[2] relative hidden border dark:block"
                                        src="https://tailark.com/_next/image?url=%2Fdark-card.webp&w=3840&q=75"
                                        alt="Tailark hero section"
                                        width={2880}
                                        height={2074}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="relative z-10 bg-white py-16 dark:bg-zinc-900">
                    <div className="m-auto max-w-5xl px-6">
                        <h2 className="text-center text-lg text-black font-medium">Your favorite companies are our partners.</h2>
                        <div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                alt="Nvidia Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/column.svg"
                                alt="Column Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/github.svg"
                                alt="GitHub Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nike.svg"
                                alt="Nike Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/laravel.svg"
                                alt="Laravel Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-7 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/lilly.svg"
                                alt="Lilly Logo"
                                height="28"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                alt="Lemon Squeezy Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-6 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/openai.svg"
                                alt="OpenAI Logo"
                                height="24"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/tailwindcss.svg"
                                alt="Tailwind CSS Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/vercel.svg"
                                alt="Vercel Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/zapier.svg"
                                alt="Zapier Logo"
                                height="20"
                                width="auto"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export const Logo = ({ className }) => {
    return (
        <img
            src="https://media.streamify.io/streamify_logo_black_28f2ebf349.svg"
            alt="Streamify Logo"
            className={className}
            style={{ height: '32px', width: 'auto' }}
        />
    );
}; 
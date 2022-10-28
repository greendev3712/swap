import Search from '../assets/search.svg'
import Cross from '../assets/cross.svg';
import Link from "next/link";
import EventDate from "./EventDate";
import Event from "./Event";

export default function EventsModal({ onClose }) {
    return (
        <div className="fixed w-screen h-screen bg-[#242424] top-0 left-0 bg-opacity-50 z-10 flex justify-end">
            <button
                className="hidden md:flex w-10 h-10 bg-[#f2f3f5] rounded-full justify-center items-center mr-8 mt-20"
                onClick={onClose}
            >
                <Cross className="w-5 h-5 stroke-[#242424]" />
            </button>
            <div className="max-w-2xl w-full h-screen bg-[#F2F3F5] opacity-100 shrink-0 pt-10 md:pt-20 px-10 overflow-y-auto">
                <button
                    className="flex md:hidden w-10 h-10 ml-auto bg-[#f2f3f5] rounded-full justify-center items-center mb-8"
                    onClick={onClose}
                >
                    <Cross className="w-5 h-5 stroke-[#242424]" />
                </button>
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-5xl uppercase font-bold">Events</h2>
                    <Link href="/">
                        <a className="uppercase underline underline-offset-8 underline-color decoration-[#d9d9db] text-[#737373]">
                            Read all
                        </a>
                    </Link>
                </div>
                <div className="relative h-14 mb-8">
                    <input className="bg-[#dedede] bg-opacity-50 pl-4 border-none focus:focus-visible:outline-none appearance-none w-full h-full rounded-lg" type="text" placeholder="Find a notice"/>
                    <Search className="absolute right-4 top-[50%] -translate-y-1/2" />
                </div>
                <div className="flex justify-between mb-10">
                    <span>1 new notice</span>
                    <span>Total notifications 2</span>
                </div>
                <div className="mb-8">
                    <EventDate date={new Date()} />
                    <Event
                        date={new Date()}
                        title="Headline"
                        content="On the other hand, the scope and place of staff training contributes to the preparation and implementation of new proposals. Comrades!"
                        status="new"
                        isHot
                    />
                    <Event
                        date={new Date()}
                        title="Headline"
                        content="On the other hand, the scope and place of staff training contributes to the preparation and implementation of new proposals. Comrades!"
                    />
                    <Event
                        date={new Date()}
                        title="Headline"
                        content="On the other hand, the scope and place of staff training contributes to the preparation and implementation of new proposals. Comrades!"
                        status="new"
                    />
                </div>
                <div className="mb-8">
                    <EventDate date={new Date()} />
                    <Event
                        date={new Date()}
                        title="Headline"
                        content="On the other hand, the scope and place of staff training contributes to the preparation and implementation of new proposals. Comrades!"
                        status="new"
                        isHot
                    />
                    <Event
                        date={new Date()}
                        title="Headline"
                        content="On the other hand, the scope and place of staff training contributes to the preparation and implementation of new proposals. Comrades!"
                    />
                    <Event
                        date={new Date()}
                        title="Headline"
                        content="On the other hand, the scope and place of staff training contributes to the preparation and implementation of new proposals. Comrades!"
                        status="new"
                    />
                </div>
            </div>
        </div>
    )
}
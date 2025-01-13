import Navbar from "../components/Navbar";
import { Intro1Icon, Intro2Icon, Intro3Icon, Intro4Icon, Intro5Icon } from "../img/BnApi";


export default function IntroPage() {

    return (
        <div className="min-h-screen">
            <Navbar showMenu={false} />
            <div className="pt-24 text-[#FFA41C] font-semibold mb-10 text-base max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-center text-white text-2xl main-font">How to get API Key?</h1>
                <p  className="text-center text-white mb-4 ">Follow the steps below to get your API Key</p>
                <p>Step 1: Click on the "API Management" button</p>
                <img className="mx-auto md:w-[50%] w-[100%] mt-3 mb-6" src={Intro1Icon} alt="Intro1Icon" />
                <p>Step 2: Click on the "Create API" button</p>
                <img className="mx-auto w-[80%] mb-6" src={Intro2Icon} alt="Intro1Icon" />
                <p>Step 3: Copy the system generated API Key</p>
                <img className="mx-auto w-[80%] mb-6" src={Intro3Icon} alt="Intro1Icon" />
                <p>Step 4: Label your API Key</p>
                <img className="mx-auto w-[80%] mb-6" src={Intro4Icon} alt="Intro1Icon" />
                <p>Step 5: Copy your API Key and Secret Key</p>
                <img className="mx-auto w-[80%] mb-6" src={Intro5Icon} alt="Intro1Icon" />


            </div>
        </div>
    );


}
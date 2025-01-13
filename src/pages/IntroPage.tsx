import Navbar from "../components/Navbar";
import { Intro1Icon, Intro2Icon, Intro3Icon, Intro4Icon, Intro5Icon } from "../img/BnApi";


export default function IntroPage() {

    return (
        <div className="min-h-screen">
            <Navbar showMenu={false} />
            <div className="pt-24 text-[#FFA41C] font-semibold mb-10 text-base max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-center text-white text-2xl main-font">How to Get Your API Key</h1>
                <p className="text-center text-white mb-4">Follow these steps to obtain your API Key</p>
                <p>Step 1: Navigate to "API Management" in your Binance account</p>
                <img className="mx-auto md:w-[50%] w-[100%] mt-3 mb-6" src={Intro1Icon} alt="API Management navigation" />
                <p>Step 2: Select "Create New API Key"</p>
                <img className="mx-auto w-[80%] mb-6" src={Intro2Icon} alt="Create API button" />
                <p>Step 3: Save the "System generated" API Key</p>
                <img className="mx-auto w-[80%] mb-6" src={Intro3Icon} alt="Generated API Key" />
                <p>Step 4: Give your API Key a descriptive label</p>
                <img className="mx-auto w-[80%] mb-6" src={Intro4Icon} alt="API Key labeling" />
                <p>Step 5: Store your API Key and Secret Key securely</p>
                <img className="mx-auto w-[80%] mb-6" src={Intro5Icon} alt="API and Secret Keys" />
            </div>
        </div>
    );


}
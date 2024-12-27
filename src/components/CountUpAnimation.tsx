import CountUp from "react-countup";


export const CountUpAnimation = ({ end, prefix = '', suffix = '' }: { end: number; prefix?: string; suffix?: string }) => {
    return (
        <div className="text-3xl md:text-4xl font-bold text-[#FFA41C]">
            <CountUp end={end} prefix={prefix} suffix={suffix} duration={2.5} />
        </div>
    );
};
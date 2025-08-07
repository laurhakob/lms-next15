import {ReactNode} from "react";
import {DottedSeparator} from "@/components/dotted-separator";

export default function DashboardLayout({children}: { children: ReactNode }) {
    return (
        <div>
            <DottedSeparator/>
            {children}
        </div>
    );
}
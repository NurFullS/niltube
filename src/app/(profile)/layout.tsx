import Sidebar from "../components/body/Sidebar";


export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="profile-layout flex gap-6 p-4">
            <div className="flex-1">{children}</div>
            <Sidebar />
        </div>
    );
}

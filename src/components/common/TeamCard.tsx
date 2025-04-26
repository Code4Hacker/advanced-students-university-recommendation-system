import React from 'react'
interface Order {
    image: string;
    name: string;
    role: string;
    card?: boolean
}
const TeamCard: React.FC<Order> = ({ image, name, role, card }) => {
    return (
        <div className={`flex items-center gap-3 mb-2 ${card?"bg-white shadow-2xl p-4 rounded-2xl":""}`}>
            <div className="w-10 h-10 overflow-hidden rounded-full">
                <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                />
            </div>
            <div>
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {name}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {role}
                </span>
            </div>
        </div>
    )
}
export default TeamCard;
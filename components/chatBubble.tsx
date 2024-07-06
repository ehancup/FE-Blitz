import { StoreChat, UserChat } from "@/lib/chat/interface"
import { formatHour } from "@/utils/date.utils"

interface UserBubbleInterface {
    data: UserChat
}

interface StoreBubbleInterface {
    data: StoreChat
}

export const UserBubble = ({data} : UserBubbleInterface) => {
    return data.sender == 'seller' ? (
        <div className="self-start rounded-r-xl rounded-bl-xl border border-gray-200 p-2 w-fit items-end gap-2 flex flex-row max-w-96">
            <p className=" text-sm text-gray-400">{formatHour(data.created_at)}</p>
            <p className="">{data.message}</p>
            
        </div>
    ) : (
        <div className="self-end rounded-l-xl rounded-br-xl bg-gray-100 p-2 w-fit flex flex-row items-end gap-2 max-w-96">
            <p className="">{data.message}</p>
            <p className=" text-sm text-gray-400">{formatHour(data.created_at)}</p>
        </div>
    )
}
export const StoreBubble = ({data} : StoreBubbleInterface) => {
    return data.sender == 'user' ? (
        <div className="self-start rounded-r-xl rounded-bl-xl border border-gray-200 p-2 w-fit items-end gap-2 flex flex-row max-w-96">
            <p className=" text-sm text-gray-400">{formatHour(data.created_at)}</p>
            <p className="">{data.message}</p>
            
        </div>
    ) : (
        <div className="self-end rounded-l-xl rounded-br-xl bg-gray-100 p-2 w-fit flex flex-row items-end gap-2 max-w-96">
            <p className="">{data.message}</p>
            <p className=" text-sm text-gray-400">{formatHour(data.created_at)}</p>
        </div>
    )
}
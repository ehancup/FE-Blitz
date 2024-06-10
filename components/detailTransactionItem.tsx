import { OrderDetailResponse } from "@/lib/order/interface";
import { formatRupiah } from "./productCart";
import { useRouter } from "next/navigation";

interface DetailTransactionProps {
    item: OrderDetailResponse
}

const DetailTransactionItem = ({item} : DetailTransactionProps) => {
    const router = useRouter()
    return (
        <div className="px-3 pb-3 pt-6 border border-base-200 rounded-lg flex flex-row items-start gap-2">
            <div className="w-14 h-14 rounded-md overflow-hidden" style={{
            backgroundImage: `url(${item.product.image?.[0].image})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}></div>
          <div className="flex-1 flex flex-col">
            <h1 className="line-clamp-3 text-ellipsis font-bold text-sm">{item.product_name}</h1>
            <p className="text-xs text-gray-400">{item.quantity} x Rp{formatRupiah(item.product_price)},-</p>
          </div>
          <div className="w-32 flex flex-col items-end">
            <h1 className="text-sm">Total Price</h1>
            <p className="text-xs font-bold">Rp{formatRupiah(item.total_amount)}</p>
            <button className="btn btn-neutral btn-xs btn-outline mt-5" onClick={() => router.push(`/product/detail/${item.product_id}`)}>See Product</button>
          </div>
        </div>
    )
}

export default DetailTransactionItem
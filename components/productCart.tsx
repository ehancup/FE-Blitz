import useWishlistModule from "@/lib/wishlist";
import {
  ShoppingBagIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface CardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  store: string;
}

export function formatRupiah(number: number): string {
  return number.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

const ProductCard = ({ image, name, price, store, id }: CardProps) => {
  const router = useRouter()
  const { useCreateWishlist } = useWishlistModule();
  const { mutate, isPending } = useCreateWishlist();
  return (
    <div className="w-full flex flex-col rounded-lg  shadow-md">
      <div
        className="w-full aspect-square rounded-lg overflow-hidden"
        onClick={() => router.push(`/product/detail/${id}`)}
        style={{
          backgroundImage: `url(${image?.replace('localhost:5002', process.env.IP as string)})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      ></div>
      <div className="flex flex-col justify-between flex-1">
        <div className="px-2 py-1 bg-base-100 cursor-pointer" onClick={() => router.push(`/product/detail/${id}`)}>
          <h1 className="text-sm font-normal line-clamp-2 text-ellipsis">
            {name}
          </h1>
          <p className="text-sm font-bold mt-">Rp{formatRupiah(price)}</p>
          <p className="flex flex-row items-center gap-1 mt-2">
            <ShoppingBagIcon className="h-4" />
            <span className="text-xs text-neutral-content">{store}</span>
          </p>
        </div>
        <div className=" dropdown dropdown-right dropdown-end w-full flex flex-row justify-end px-1 pb-1">
          <button tabIndex={0} className="btn btn-circle btn-xs btn-ghost ">
            <EllipsisHorizontalIcon className="h-3" />
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu menu-xs p-2 shadow bg-base-200 rounded-box w-36"
          >
            <li onClick={() => mutate(id)}>
              <a>
                {isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Add to wishlist"
                )}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

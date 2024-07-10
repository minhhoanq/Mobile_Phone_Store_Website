import withBaseComponent from "hocs/withBaseComponent";
import React, { memo } from "react";
import { renderStarFromNumber, formatMoney } from "ultils/helpers";
import path from "ultils/path";

const ProductCard = ({
    originalPrice,
    totalRatings,
    name,
    slug,
    image,
    pid,
    navigate,
    category,
}) => {
    return (
        <div
            onClick={(e) =>
                navigate(
                    `/${category?.toLowerCase() | "smartphones"}/${pid}/${slug}`
                )
            }
            className="col-span-1 cursor-pointer"
        >
            <div className="flex w-full border">
                <img
                    src={
                        // image |
                        `https://cdn2.cellphones.com.vn/358x/media/catalog/product/g/a/galaxy-s24-ultra-den-1_1_3.png`
                    }
                    alt="products"
                    className="w-[120px] object-contain p-4"
                />
                <div className="flex flex-col mt-[15px] items-start gap-1 w-full text-xs">
                    <span className="line-clamp-1 capitalize text-sm">
                        {name?.toLowerCase()}
                    </span>
                    <span className="flex h-4">
                        {renderStarFromNumber(totalRatings, 14)?.map(
                            (el, index) => (
                                <span key={index}>{el}</span>
                            )
                        )}
                    </span>
                    <span>{`${formatMoney(originalPrice)} VNĐ`}</span>
                </div>
            </div>
        </div>
    );
};

export default withBaseComponent(memo(ProductCard));

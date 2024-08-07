import React, { memo, Fragment, useState } from "react";
import logo from "assets/logo.png";
import { memberSidebar } from "ultils/contants";
import { NavLink, Link } from "react-router-dom";
import clsx from "clsx";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";
import { useSelector } from "react-redux";
import { TbArrowForwardUp } from "react-icons/tb";

const activedStyle =
    "px-4 py-2 flex items-center gap-2  bg-blue-400 text-gray-100";
const notActivedStyle = "px-4 py-2 flex items-center gap-2  hover:bg-blue-50";

const MemberSidebar = () => {
    const [actived, setActived] = useState([]);
    const { current } = useSelector((state) => state.user);
    const handleShowTabs = (tabID) => {
        if (actived.some((el) => el === tabID))
            setActived((prev) => prev.filter((el) => el !== tabID));
        else setActived((prev) => [...prev, tabID]);
    };

    return (
        <div className=" bg-white max-h-screen py-4 w-[250px] flex-none border-r border-r-blue-200">
            <Link
                to={"/"}
                className="flex flex-col justify-center items-center p-4 gap-2"
            >
                <img
                    src={logo}
                    alt="logo"
                    className="w-[200px] object-contain"
                />
            </Link>
            <div>
                {memberSidebar.map((el, idx) => (
                    <Fragment key={idx}>
                        {el.type === "SINGLE" && (
                            <NavLink
                                to={el.path}
                                className={({ isActive }) =>
                                    clsx(
                                        isActive && activedStyle,
                                        !isActive && notActivedStyle
                                    )
                                }
                            >
                                <span>{el.icon}</span>
                                <span>{el.text}</span>
                            </NavLink>
                        )}
                        {el.type === "PARENT" && (
                            <div
                                onClick={() => handleShowTabs(+el.id)}
                                className="flex flex-col"
                            >
                                <div className="flex items-center justify-between px-4 py-2 hover:bg-red-100 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span>{el.icon}</span>
                                        <span>{el.text}</span>
                                    </div>
                                    {actived.some((id) => id === el.id) ? (
                                        <AiOutlineCaretRight />
                                    ) : (
                                        <AiOutlineCaretDown />
                                    )}
                                </div>
                                {actived.some((id) => +id === +el.id) && (
                                    <div className="flex flex-col">
                                        {el.submenu.map((item) => (
                                            <NavLink
                                                key={el.text}
                                                to={item.path}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className={({ isActive }) =>
                                                    clsx(
                                                        isActive &&
                                                            activedStyle,
                                                        !isActive &&
                                                            notActivedStyle,
                                                        "pl-16"
                                                    )
                                                }
                                            >
                                                {item.text}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </Fragment>
                ))}
                <NavLink to={"/"} className={clsx(notActivedStyle)}>
                    <TbArrowForwardUp size={18} />
                    Trang chủ
                </NavLink>
            </div>
        </div>
    );
};

export default memo(MemberSidebar);

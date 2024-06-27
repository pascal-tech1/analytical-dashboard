import { useEffect, useRef, useState } from "react";

import {
	MdDarkMode,
	MdLightMode,
	MdOutlineArrowDropDown,
	MdOutlineArrowDropUp,
} from "react-icons/md";

import { GrSystem } from "react-icons/gr";
import useDarkMode from "../customHooks/useDarkMode";

const Theme = () => {
	const isSystemInDakMode = useDarkMode();
	const defaultTheme = localStorage.getItem("theme")
		? localStorage.getItem("theme")
		: "system";

	const [theme, setTheme] = useState(defaultTheme);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef();
	const iconRef = useRef();

	const filters = ["light", "dark", "system"];
	const handleSelected = (theme) => {
		setTheme(theme);
		setIsDropdownOpen(!isDropdownOpen);
		if (theme !== "system") {
			localStorage.theme = theme;
			document.documentElement.classList.toggle("dark", theme === "dark");
		} else {
			localStorage.removeItem("theme");
			if (isSystemInDakMode) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}
	};

	const ThemeIcon = ({ theme }) => {
		if (theme === "system") {
			return <GrSystem />;
		} else if (theme === "dark") {
			return <MdDarkMode />;
		} else return <MdLightMode />;
	};
	useEffect(() => {
		const handleClick = (event) => {
			if (
				(dropdownRef.current &&
					dropdownRef.current.contains(event.target)) ||
				(iconRef?.current && iconRef?.current.contains(event.target))
			) {
				// Click occurred inside the div
			} else {
				// Click occurred outside the div
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("click", handleClick);

		return () => {
			// Cleanup: Remove event listener when component unmounts
			document.removeEventListener("click", handleClick);
		};
	}, [dropdownRef, iconRef]);

	return (
		<div className=" relative z-50 w-20  ">
			<button
				ref={iconRef}
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
				className=" focus:border-gray-100  dark:focus:border-gray-400 flex gap-2 items-center border px-2 py-[0.2rem] rounded-lg dark:border-gray-700 "
			>
				<ThemeIcon theme={theme} />
				{theme}
				{isDropdownOpen ? (
					<MdOutlineArrowDropDown className=" text-center" />
				) : (
					<MdOutlineArrowDropUp className=" text-center" />
				)}
			</button>

			<div
				ref={dropdownRef}
				className={` ${
					isDropdownOpen ? "absolute" : "hidden"
				}  top-10 border dark:border-gray-700 bg-gray-100 dark:bg-lightdark -left-2 py-4 px-3 rounded-md drop-shadow-md`}
			>
				{filters.map((SelectTheme) => {
					return (
						<button
						key={SelectTheme}
							onClick={() => handleSelected(SelectTheme)}
							className={`${
								theme === SelectTheme && " text-blue-500"
							} flex  items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-700 py-1 px-2 rounded-lg`}
						>
							<ThemeIcon theme={SelectTheme} />
							{SelectTheme}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default Theme;

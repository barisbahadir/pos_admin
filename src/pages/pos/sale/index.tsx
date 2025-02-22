import { useState } from "react";
import { Card, Row, Col, Button, InputNumber, Collapse, Typography } from "antd";
import { CreditCardOutlined, DeleteOutlined, ShoppingCartOutlined, TagOutlined } from "@ant-design/icons";
import { ThemeMode } from "#/enum";
import { useSettings } from "@/store/settingStore";
import "./sale.css";
import { useTranslation } from "react-i18next";

const names = [
	"All Items",
	"Breakfast",
	"Lunch Lunch",
	"Dinner",
	"Drinks",
	"All Items Items",
	"Lunch Drinks",
	"Dinner All",
	"Items Drinks",
	"Items All",
	"Breakfast Drinks",
];

export default function SalePage() {
	const { t } = useTranslation();
	const { themeMode } = useSettings();
	const backgroundColor = themeMode === ThemeMode.Light ? "rgb(244, 246, 248)" : "rgba(145, 158, 171, 0.12)";

	const [cart, setCart] = useState<
		Array<{
			id: number;
			name: string;
			price: number;
			barcode: string;
			quantity: number;
			discount: number;
		}>
	>([]);
	const [activeCategory, setActiveCategory] = useState(names[0]);

	const generateProducts = (count: number) => {
		const products = [];

		for (let i = 1; i <= count; i++) {
			const product = {
				id: Math.random() * 30 + 10,
				name: `${activeCategory} ${names[i % names.length]}`, // Randomize product names
				price: Number.parseFloat((Math.random() * 30 + 10).toFixed(2)), // Random price between 10 and 40
				barcode: `${i}`,
				image:
					i % 5 !== 0
						? ""
						: "data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjExRTNEQjgzNjk2RDExRTg4MjY3RTAyRTJBNkYwNjQ0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjExRTNEQjg0Njk2RDExRTg4MjY3RTAyRTJBNkYwNjQ0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTFFM0RCODE2OTZEMTFFODgyNjdFMDJFMkE2RjA2NDQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTFFM0RCODI2OTZEMTFFODgyNjdFMDJFMkE2RjA2NDQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYGCAsMCgoLCgoMEAwMDAwMDBAMDg8QDw4MExMUFBMTHBsbGxwfHx8fHx8fHx8fAQcHBw0MDRgQEBgaFREVGh8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx//wAARCAFaAaoDAREAAhEBAxEB/8QAkgABAAEFAQEAAAAAAAAAAAAAAAUDBAYHCAECAQEAAAAAAAAAAAAAAAAAAAAAEAABAwMCAQUJCgsEBwkAAAAAAQIDEQQFEgYhMUETFAdRgdEiMtKUVRZhcZFCk7MVFzcYoVJicqIjdIS0NgixgtNFweGSU3NUNcIzQ8MkRHWFRxEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHj3sYxz3uRrGoqucvBEROKqoGr8/wBvWCsLx9vjbJ+TbGul06SJDGtPxVVr1X4AIz7xcXqB3pSf4IHqf1FQc+Bd6Un+EB6n9RVrz4J6e9cov/lge/eJtPUcnpDf8MB94m09RyekN/wwKtt/UNi3yo24w80US8r2StkVP7uln9oGy8BuDFZ7HMyGMmSa3fwXmc1ycrXN5lAkQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSuZ229vLO5rnNiar3NYmpyo1K0RE5VA1+7t12Y1ytcy6a5q0VFioqKnfA8+vfZX4t18n/AKwMs2ruvH7mx77/AB7JW2zZFiR0rdOpyIirT3OIE0Brrtv3JJi9rtsLd6suMm/olVFoqRN4v+HggHO4AAAAAAAGzewncT7LccuIkevV8ixVY3mSaNKovfbVAOgAMf3bvbE7WiglyUc7o51VrXxMV7UVPxl5EAxn699lfi3Xyf8ArA+4O3HZ880cEUd0+WVyMY1IuKuctETlA2E1aoi0pXmUD0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGod9djeXzm5bnJ46e2gt7hGqsb9TV1olHKqNRU4gQH3f90/8AO2nwv80DdG1sFFgsBZYqNUXq0aNe9PjPXi93fcoEqBz529ZJ9xu2Gy49HZW7URF5NUi6lVO9QDWoAAAAAAAF9gsnJiszZZGPyrWZkvDnRq8U76Add207Li3injWrJWNexfcclUAsNy4huYwV7jVRmq5icxivSrUcqeKveUDSn3f90/8AO2nwv80Cf2R2LZPD7ktcnlLiCa3tVWRkcepVWRE8XlROReIG3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaJ7U+0Ld2N3pe43H37rW0tGxJGyNESvSQskcrlVFqtXqBiC9p+/F/zif9HwAPrO3364n+FPAA+s7ffrif4U8AD6zt9+uJ/hTwAQWVy+Ry1669yM7rm6eiI6V/KqNSicgFoAAAAAAAAAnIt87viiZFHl7lkcbUaxqSLRETgiIB9e3u8/XN18ooD293n65uvlFAe3u8/XN18ooEzszem7Lrd2Gt7jLXMsEt5AyWN0iq1zXSIioqdxUA6WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADmbtj+0fLfu/8ADRAYWAAAAAACb2/svcuffTGWMksfIs7k0RJ773cAM/xf9PmWkRr8nkordF8uKFqyOT+8ulAJb7vGLp/1eev/AA2eECwyX9PV01quxuVbIqJwZPGrVVfzmqtAME3D2b7vwKLJeWLn26ctxB+sZ36cU76AYyAAAAAACd2F/O2C/brf5xAOsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0L2obC3blN8ZG/sMdJcWk6QrFKxW0XRAxjuVfxmqBiv1Xb89UTfC3wgPqv356om/R8IHidmG/F/wAnm/R8IHv1Xb89UTfC3wgep2Xb8qifREvH3W+EDY2w+xGC203+50bPPyx49q1jb/xHJ5S+4nADbUEEMETYYI2xRMSjI2IjWoidxEA+wAADxzUcitclUXgqLyKBrnfXY3iM0x95h2sx+T4uVqJSGVfymp5K+6gGp7nsn37BMsS4t8lPjxuY5q+8qKBSXsw34n+UTfo+EDz6sN9+p5v0fCA+rDffqeb9HwgPqw336nm/R8IEzs7s73pZ7rxF3c4uWK3t7uGSaR2lEaxr0Vy8vcA6MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADVu9e2W725ua8w0eNjuGWvRUmdIrVd0kTZORE5tdAIP7w996ni+Vd4AH3h771PF8q7wAPvD33qeL5V3gAfeHvvU8XyrvABs3Y24cnuHBsyt9ZtsmzuVbaNrlcro04a1qicq8gGQgAKF5f2VlCs15PHbxJyvkcjU4e+BA/WTsTVp+mrav5y0+GgE5Y5LH38KTWVzHcxKlUfE5HJx94C5AAWGevb+xxF1eWFsl5dQMWRlsrtOtG8VRFovGnIBqRf6h7lFouFaipyp0y+aB594i49TM+WXzQH3iLj1Mz5ZfNAfeIuPUzPll80C/wAB26T5XOWGMXEtiS9uI4FkSVVVvSORtaaeaoG3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5l7Y/tHy37v/DRAYYAAASe2MM/NZ+xxjP8A3MrWPVOZlauX/ZRQOtbW2gtbaK2gajIYWJHGxOCI1qURAKoGNb83tZbTwy3cqJLdyqrLO2rTW+nKv5LecDmvcG5s1n7113lLl0z1XxWVpGxO4xvIiARYEhhc/l8JeMu8Zcvt5mrVdK+K73HN5FQDpDs635bbsxSyORIslbUbeW6clV5Ht/JcBloADl/tS283CbyvYYm6ba5VLm3TmRsnFUT3nVAxIAAAndhfztgv263+cQDrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOZe2P7R8t+7/wANEBhgAABsfsIs45t5PndxW2t3uZ77qN/0gdDAAObu2jNy5Hek9srqwY5qQRMTkRaanr8KgYGAAAZh2T5uXFb2sNLlSG8d1advMrZOCfA6gHToADSv9Q1kxJsReo3xnNlhe73EVHIn4VA04AAATuwv52wX7db/ADiAdYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzL2x/aPlv3f8AhogMMAAANndgMrW7qu41VKyWq0T81yKBv8ABy52o2clrvzLtf/4s3TN5vFkRHIBioAABP7BtZbneeHiiSrutRuX3mLqX8CAdXAANPf1Dzolph4KcXSSvr7iIif6QNJgAAE7sL+dsF+3W/wA4gHWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcy9sf2j5b93/AIaIDDAAADJ+zTNtw+88ddPXTDI/oJl7jZfF/tUDqYABqjtv2NPkbaPcGPiWS4tGaL2NqVc6JOKPRE5dPP7gGiQAADdXYbseeFztzX8Ss1tWPHsclFVF8qXj3eRANxgAOeO3PNsvt3Nsonao8dEkbqLw6R/jO+DgBrkAAAndhfztgv263+cQDrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOZe2P7R8t+7/w0QGGAAABFVFRUWipyKB012Wbyj3HtyJs0iLk7JEiu2fGVESjZKdxyfhAzMAqIqUXii8qAa53Z2KbfzE8l5j5Fxl3Ique1iaoXOXn0cNPeAwt39Pu4+n0pkLVYf8AeePWn5tAMu2t2G4LGTMusrMuTnYtWwq3TAip3W8Vd3wNlta1jUa1Ea1qUa1OCIicyAegQm8d0Wm2sDcZOdUV7U020S8skqp4rfD7gHKd9eXF7eT3lw7XPcPdJI5edzlqoFEAAAndhfztgv263+cQDrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOZe2P7R8t+7/w0QGGAAAACW2xubJ7cy0WSx76SM4SRr5EjF5WOTuKB0ts7fGF3TYJPZSIy6YidZs3L+sjX3udvuoBkIAAAAARm4dx4jb+Off5OdIomouhnx3u/FY3nUDmrfe+cjuzKLcTVisoats7StUY3ur3XLzqBjQAAAAndhfztgv263+cQDrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOZe2P7R8t+7/AMNEBhgAAAAAXGPyN/jrtl3YzvtrmNasljVWuT4ANr7Y7fbmFjYNwWnWKcOt29Gv/vMXgveoBsDG9q2xL9iObk2QO4VZcIsapX30oBNJunbSt1JlLVWrxr0zPCBF5DtN2NYtVZctC9UWishrI6vvNRQMF3F2/wBukbosBZOfIvBLm54NT3UjTivfUDUuc3DmM5eLd5S6fczL5OpfFanca1ODU94COAAAAACd2F/O2C/brf5xAOsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5l7Y/tHy37v/AAsQGGAAAAAAAAAAAAAAAAAAABO7C/nbBft1v84gHWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARl5tfbN9cvur3EWV1cyU6Sea3ikkdpRGpVzmqq0REQCh7FbN9Q470SDzAHsVs31DjvRIPMAexWzfUOO9Eg8wB7FbN9Q470SDzAHsVs31DjvRIPMAexWzfUOO9Eg8wB7FbN9Q470SDzAHsVs31DjvRIPMAexWzfUOO9Eg8wB7FbN9Q470SDzAHsVs31DjvRIPMAexWzfUOO9Eg8wB7FbN9Q470SDzAHsVs31DjvRIPMAexWzfUOO9Eg8wB7FbN9Q470SDzAHsVs31DjvRIPMAqQbR2pbzxzwYWwhnicj4pY7WFr2uatUc1yNqiovOBLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDN1b5ydrm4tt7ax7cnnXx9NOkjtMMEfCiyLVvd7qcqd2gFjYb43njdwWOJ3diYIYsm7o7S+sFc6NH8Eo9FdJwq5K8UpygZBuTcd5h8lj2Ky1Zi7hJet3l1cxW/Rua2saNbI9iv1Lw4ItALjbmYvrvb8eTzMUFhK5HvkSOaOWFsbXLpf0rXOZRW8eUC8hzmFmldFDkLaSVsfTujZNG5yRf7xURa6fyuQD4sdw4C/nW3scnaXc7eLooJ45HpTlq1rlUCpf5nD45WJkL63s1lWkaXErItS/k61SoEB2i7wu9sbcZlrGKK5e+eOJEkqrFa9rnak0qn4oF9c5bLx7vtMXGy1XFzWyyzPdK1LpJEV/BkWpHKzxW8dPdAnQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWNtfWu3u2LLuzErbeHNW0TrC7lXSxVYjG9Gr14JxYqcvMndQCw3JurduK3VYQwbotb2yyOQaxuOgit3SQ20kqaWvdoV3kO01rUC8xtjjcx2s7hg3FFHdSWsMbcXaXSI+NIVaiucyN9WryovfUCHxKthwvaTYY5yuwFsknUURVdGx7mya2xrzpwT8AFTG7J26nZOmQ6yzGZHI2qNnykz36FR07XpE9EVURruja3xU+HkULG0ZLt/J7elz+3se+3WaOPG5fES9DJI52lGyPSJyLNzL4zUr36AV32t/lO0LdaXWPx+RltkaxkeVldGkVqiLR8KIjqeLpVXcKVrzqBH5y2u7bsYignvIL2KPKolpLbSOlY2FWOXRqcjVq16u4AZrl/t0wn/AMU/+24A2OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAR2b27hM7bNtstZx3cTVVWI9F1NVeVWuSjm95QI/Cdn+zsJcJc43FxQ3DfJmer5Xt/NdK56t7wFbcGy9r7hex+Xx7LmWNNLJavjkRta6dcbmOp7lQLi32zgbbDPwtvZRxYuVrmSWzKojkelHalRdSqvdrUCrFgsRHiEw7bVi4xrOiS0emtmjlouqtQIjFdm2yMVftyFjio47ti6o5HPlk0u7rWyOe1qpzUQCvntibSz9y25y2OZcXDEREmRz43qiciOWNzFcie6BXvNpbcu8PDhp7CN2LgVHQ2rdTGNc2tFTQrV+MoFxLgcRLmYc1JbI7KW8SwQ3NXVbGurxaV0/HdzAX4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABiu0923ua3DuTGTwxxxYW4ZDA9mrU9HulRVfVVSv6tOQBi923t32gZjbT4Y22mOt4popm6ukcsjInKjqrpp+tXmAmmbi2++96izJ2jr3Vp6qk8ay6uSmhHaq94D6uc9g7Wd0F1kbWCdlNcUs0bHpVKpVrlRUqi1A9+m8L1XrnX7bqmro+sdNH0euldOuumvuAfV1lsVZyLHd3sFvIjFlVksrGO6NK1fRyp4vBeIGOS72lXf2M2/aJBcY3IWK3iXjHK9yqiy00OauhW/qkAnrjcW37a76ncZO0hu6onV5J42SVXk8RXI4C5uL+xtpIori4ihlnVUgZI9rXPVKVRiKqK7lTkAp2GXxWQ6TqF7BedCumXoJWS6Hdx2hVovvgUZNybdjjbJJlLRkb3rEx7p4kRZEpViKrvKTUnACr9M4fryY/r1v19yam2nSs6ZUVKoqR11Up7gHmRzeFxmj6Rv7ay6TyOsTRxave1q2oENvjdkmC2lNncckN2rXRJErlV0TmyPRtUVipXl5lAl7bMWToLHrNxDBdXsUckcDnta5yvRFoxrl1LxUCH29v7D5zPZPE2zmNXHuZHDK6RircuXpFkWJqKuprEjrVF5+YCX9otv8AXeofSdp17Vo6r08fS6q006NWqveArX+UxmOjbLkLyCziculr7iRkTVXuIr1RKgY5gN53GT3jm8K5kPUcbHFJb3MaqqvSRrXVctVbTxuYDIfpnD9U671636nq0dZ6VnRau5rrpqB92mSx15JNHaXUNxJbuRtwyKRr3RuXkR6NVdK8OcC5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANMYDa97nd8bz6tmr3D9WvW6+pSOj6XW+amvSra6dPD31Aq7XtU292gbvjv7y5yTLHFdLcXcz3LcSMSKKRfHrqqjV0t49wDEtyRNdsqxy2PxGOxGNku1WykZK+fJvc1X11TLTxG04ovJwAzntR+hL3LswGKx1pcboyenreQkY1VtoUaia3vVFo7QnDuN93SBadpO3cZt/sqtcZj3pLHFexLNOioqySuY/W9aKtK9zmQC73lg8fm+2XC4/Ix9LZvxmuWGqtR/RvuHNRVaqLTUiKBcT2NrYds+3bG0j6K1tsMsUMaKq6WM6wiJVaqvfAwrNOssttXOZjE4aws8Z1pelv7yWSfIySq9i/qVdVY9Vaq1V5K8oE9ua2hyLOyu3vUWaK6ijbcIqr46OjtdSKvL43OBLYXH2OL7a720xsDLS1lxiPfbwtRkeqsfFGJwTk5gMSwGBw9z2X7rydxaxy38N3KyC4eiK+NI2xPTo1XyeL1rTl5wLjL4XF47Zmx8nZWzIcjPd20k141KSvdInSLqfyr4yJSvJzAT24nWWX35lLLH4awucjZWrEvsjmZZHW7I9LV/VwcdOlHeU2nP3aqGLWT3u7BL9HOVUZkGtYi8ydJEtE76qBP9mzbiHeypuuJfp66sYpcLM5yLGlsjOMcSJwRyN/sd3wqbBx+BsN2b4upLWNjcRNqs+jaiPhjpcJIkNKK2rEpwAw3cEUNxsaPLY7D47FYqS7VLaVZXz5N70e5FTpV46UotWuXuL7oGdX9taZTtcxtpno2XFm3FNfYW9wiOikldVXKrXVa5fK5e4ncAobEtsZa7+3pb4tGpYxQ6Ymx+Q1a+O1tOZr6pQDGv/wb/wCx/wC2BtrbmI2ntLH28cL4bGTIpE1z55tLriZG0SnSO4uVXcjQMmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALDH4HEY68vb2ytkhusi9JL2RFcqyOarlRVqqonlryAfLNu4VmUu8q20Z1++jSG7mWrukjRGtRrmqqtpRiJyAQ0fZZsCNJ0bhoqXH/eVdK7kcjvEq9dHFPi0Aq3/ZvsnIXT7u8xbJ7mTTrldJLVdLUalaP7iIBVbsDaDcQ7DpjWJjXz9adba5KLNpRmuurV5KU5QJGXA4iXMw5qS2R2Ut4lghuauq2NdXi0rp+O7mAS4HES5mHNSWyOylvEsENzV1Wxrq8WldPx3cwEO/sz2I+8nvHYeFZ7lHpKtX6f1iKjlazVoavHlaiASC7S28v0ZWzRfob/plXPXofJ8mruPkJy15ALhuBxDcy7NJbImUfF0DrmrqrHw8WldPN3ALa22jty2xV1iYLJrMdevdJdW6OfR7no1HKqq7VxRicigfVztPb1zYWVhPZtfZ45zH2USueiRujSjVRUdVaJ3QLbMbD2jmcizJZLGR3F6xETpVV7dSN5NbWua19OTxkUD7TZG1kxdzikx7Ex13L1ie2Rz0Y6WqLq8rh5KcgF1d7bwl3LYTXFq18uLVFsJKua6KlORzVRaeKnBQLV2yNquz308uPZ9Kqqqtwjnoiq5qtVVjR3RqqtXiqtAsWdluwGLcK3DRf+p4SorpFTykd4iK6jOKfEp3OQC/zOy9sZq2trfJ2DbmOzajLZXOe17GoiJTW1zXqnDjVeIFTF7R23ip558dYR2slzG2KdY9SI5jUoiaa0TvAUvYja30L9CfR7PorpOl6rqfp11rqrq1fhAu8lt7DZLqfXrZs/UJGy2lVcmh7aUclFTuc4EiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/2Q==",
			};
			products.push(product);
		}

		return products;
	};

	const products = generateProducts(10);

	const addToCart = (product: {
		id: number;
		name: string;
		price: number;
		barcode: string;
	}) => {
		const existingItem = cart.find((item) => item.id === product.id);
		if (existingItem) {
			setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
		} else {
			setCart([...cart, { ...product, quantity: 1, discount: 0 }]);
		}
	};

	const updateItem = (id: number, field: "quantity" | "discount", value: number) => {
		setCart(cart.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
	};

	const removeItem = (id: number) => {
		setCart(cart.filter((item) => item.id !== id));
	};

	const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity - item.discount, 0);
	const tax = subtotal * 0.18;
	const total = subtotal + tax;

	return (
		<Row gutter={24} className="pr-1 pl-1">
			<Col xs={24} sm={12} md={14} lg={15} xl={17}>
				<div className="category-buttons">
					{names.map((category) => (
						<Button
							key={category}
							type={activeCategory === category ? "primary" : "default"}
							onClick={() => setActiveCategory(category)}
						>
							{category}
						</Button>
					))}
				</div>
				<div className="product-grid">
					{products.map((product) => (
						<div key={product.id} className="product-card">
							<div className="product-image-container" style={{ background: backgroundColor }}>
								{product.image ? (
									<img
										src={
											product.image.startsWith("data:image") ? product.image : `data:image/png;base64,${product.image}`
										}
										alt={product.name}
										className="product-image"
									/>
								) : (
									<div
										className="product-placeholder text-text-gray flex flex-col items-center justify-center"
										style={{ background: backgroundColor }}
									>
										<ShoppingCartOutlined className="text-3xl mb-4" />
										<p className="m-2">{product.name}</p>
									</div>
								)}
							</div>
							<div className="product-info">
								<p className="product-name text-base font-semibold text-text-secondary" title={product.name}>
									{product.name}
								</p>
								<p className="product-price text-primary">{`${product.price.toFixed(2)} TL`}</p>
							</div>
							<div className="product-hover-overlay" onClick={() => addToCart(product)}>
								<Button
									type="primary"
									icon={<ShoppingCartOutlined />}
									onClick={() => addToCart(product)}
									className="add-to-cart-button"
								>
									Sepete Ekle
								</Button>
							</div>
						</div>
					))}
				</div>
			</Col>
			<Col xs={24} sm={12} md={10} lg={9} xl={7}>
				<Card title={t("sys.sale.your_card")} className="text-center cart-container">
					<div className="cart-list">
						{cart.map((item) => {
							return (
								<div key={item.id} className="cart-item">
									<Collapse
										className="cart-item-collapse"
										items={[
											{
												key: item.id,
												label: (
													<div className="cart-item-header">
														<div className="cart-item-left">
															<p className="cart-item-quantity">{item.quantity}x</p>
															<p className="cart-item-name">{item.name}</p>
														</div>
														<p className="cart-item-price text-primary">
															{`${(item.price * item.quantity - item.discount).toFixed(2)}₺`}
														</p>
														<Button type="text" icon={<DeleteOutlined />} onClick={() => removeItem(item.id)} />
													</div>
												),
												children: (
													<div className="cart-item-details">
														{/* <Typography.Title level={5}>
                              {item.name}
                            </Typography.Title> */}

														<Row gutter={24}>
															<Col xs={12} sm={12} md={12}>
																<div>
																	<Typography.Text className="full-title">
																		{`${t("sys.sale.quantity")}:`}
																	</Typography.Text>
																	<InputNumber
																		addonBefore={t("sys.sale.count")}
																		min={1}
																		defaultValue={1}
																		style={{ width: "100%" }}
																		onChange={(val) => {
																			if (val != null) {
																				updateItem(item.id, "quantity", val);
																			}
																		}}
																	/>
																</div>
															</Col>
															<Col xs={12} sm={12} md={12}>
																<div>
																	<Typography.Text className="full-title">
																		{`${t("sys.sale.discount")}:`}
																	</Typography.Text>
																	<InputNumber
																		addonBefore="%"
																		min={0}
																		max={100}
																		defaultValue={0}
																		style={{ width: "100%" }}
																		onChange={(val) => {
																			if (val != null) {
																				updateItem(item.id, "discount", val);
																			}
																		}}
																	/>
																</div>
															</Col>
														</Row>
													</div>
												),
											},
										]}
									/>
								</div>
							);
						})}
					</div>
					<div className="cart-summary">
						<div className="summary-row">
							<span>{t("sys.sale.subtotal")}</span>
							<span>{`${subtotal.toFixed(2)} TL`}</span>
						</div>
						<div className="summary-row">
							<span>{t("sys.sale.tax")}</span>
							<span>{`${tax.toFixed(2)} TL`}</span>
						</div>
						<div className="summary-row total">
							<span>{t("sys.sale.total")}</span>
							<span>{`${total.toFixed(2)} TL`}</span>
						</div>
					</div>
					<div className="cart-actions">
						<Button type="primary" block className="pay-cash" icon={<TagOutlined />}>
							{t("sys.sale.pay_cash")}
						</Button>
						<Button type="default" block className="pay-card" icon={<CreditCardOutlined />}>
							{t("sys.sale.pay_card")}
						</Button>
					</div>
				</Card>
			</Col>
		</Row>
	);
}

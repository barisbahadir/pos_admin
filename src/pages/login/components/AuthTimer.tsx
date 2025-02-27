import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function AuthTimer({ initialTime = 5 * 60, autoRestart = false }) {
	// 5 dakika = 300 saniye
	const { t } = useTranslation();

	const [timeLeft, setTimeLeft] = useState(initialTime);
	const [isBlinking, setIsBlinking] = useState(false);

	// Geri sayımı başlat
	useEffect(() => {
		if (timeLeft === 0) {
			if (autoRestart) {
				setTimeLeft(initialTime); // Süreyi baştan başlat
			}
			return;
		}

		const interval = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(interval); // Temizleme
	}, [timeLeft, initialTime, autoRestart]);

	// Her saniyede saniye kısmını yanıp söndür
	useEffect(() => {
		if (timeLeft % 2 === 0) {
			setIsBlinking(true);
		} else {
			setIsBlinking(false);
		}
	}, [timeLeft]);

	// Dakika ve saniyeyi ayır
	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;

	return (
		<div>
			<span>
				{`${t("sys.login.remaining_time")}: `}
				{/* {minutes < 10 ? "0" + minutes : minutes} */}
				{/* {seconds < 10 ? "0" + seconds : seconds} */}
			</span>
			<span
				style={{
					fontWeight: "bold",
					color: isBlinking ? "red" : "black", // Yanıp sönen efekt
					transition: "color 0.5s",
				}}
			>
				{minutes < 10 ? `0${minutes}` : minutes}
				{`:${seconds < 10 ? `0${seconds}` : seconds}`}
			</span>
		</div>
	);
}

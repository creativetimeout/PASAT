import React from "react";

export default function StartScreen({
	onStartPractice,
	onStartTest,
	onOpenSettings,
}) {
	return (
		<div
			className="mx-auto w-full max-w-md px-5 pt-8 pb-12 flex flex-col"
			style={{ minHeight: "100dvh" }}
		>
			<header className="flex items-center gap-5 mb-8">
				<img
					src="/pasat-icon.png"
					alt=""
					aria-hidden="true"
					className="w-32 h-32 sm:w-36 sm:h-36 rounded-[22%] shadow-[0_12px_32px_-6px_rgba(0,0,0,0.32)] dark:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.75)] ring-1 ring-black/5 dark:ring-white/10 shrink-0"
				/>
				<div className="min-w-0">
					<h1 className="text-[40px] sm:text-[44px] leading-[1.05] font-bold tracking-tight text-gray-900 dark:text-white">
						PASAT-3
					</h1>
					<p className="mt-1 text-[17px] text-gray-600 dark:text-gray-300">
						Selbsttest
					</p>
				</div>
			</header>

			<section className="rounded-ios-lg bg-white dark:bg-ios-dark-surface px-5 py-4 shadow-ios">
				<p className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-100">
					Addiere jede gehörte Zahl mit der{" "}
					<span className="font-semibold">vorherigen</span> — nicht die laufende
					Summe.
				</p>
				<div className="mt-3 rounded-ios bg-ios-fill-1 dark:bg-ios-dark-surface-2 px-4 py-3">
					<p className="text-[11px] uppercase tracking-wider font-semibold text-gray-600 dark:text-gray-300 mb-1">
						Beispiel
					</p>
					<p className="text-[15px] text-gray-900 dark:text-white font-mono">
						2, 5, 3, 8 → 7, 8, 11
					</p>
				</div>
			</section>

			<p className="mt-4 text-center text-[12px] leading-relaxed text-gray-600 dark:text-gray-400">
				Nur zur persönlichen Übung. Kein medizinisches Diagnoseinstrument.
			</p>

			<div className="mt-auto pt-8 space-y-3">
				<button
					type="button"
					onClick={onStartTest}
					className="w-full px-6 py-4 rounded-ios-lg bg-ios-blue dark:bg-ios-blue-dark text-white text-[17px] font-semibold shadow-ios active:opacity-80 transition focus:outline-none focus:ring-4 focus:ring-ios-blue/30"
				>
					Test starten
				</button>
				<button
					type="button"
					onClick={onStartPractice}
					className="w-full px-6 py-4 rounded-ios-lg bg-white dark:bg-ios-dark-surface text-ios-blue dark:text-ios-blue-dark text-[17px] font-semibold shadow-ios active:opacity-70 transition focus:outline-none focus:ring-4 focus:ring-ios-blue/20"
				>
					Übung (10 Zahlen)
				</button>
				<button
					type="button"
					onClick={onOpenSettings}
					className="w-full px-6 py-4 rounded-ios-lg bg-white dark:bg-ios-dark-surface text-ios-blue dark:text-ios-blue-dark text-[17px] font-semibold shadow-ios active:opacity-70 transition focus:outline-none focus:ring-4 focus:ring-ios-blue/20"
				>
					Einstellungen
				</button>
			</div>
		</div>
	);
}

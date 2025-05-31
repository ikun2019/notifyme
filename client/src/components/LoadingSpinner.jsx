import React from 'react';

const LoadingSpinner = () => {
	return (
		<div className="flex items-center justify-center h-screen bg-white">
			<div className="relative w-32 h-32">
				{/* 青いサークル */}
				<div className="w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>

				{/* 点滅する Loading 文字列 */}
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-blue-600 font-semibold text-sm tracking-widest animate-typing">
						Loading
					</span>
				</div>
			</div>

			{/* アニメーション用カスタムクラス */}
			<style>
				{`
          @keyframes typing {
            0% { opacity: 0.1 }
            20% { opacity: 0.3 }
            40% { opacity: 0.5 }
            60% { opacity: 0.7 }
            80% { opacity: 0.9 }
            100% { opacity: 1 }
          }
          .animate-typing {
            animation: typing 1.2s infinite ease-in-out alternate;
          }
        `}
			</style>
		</div>
	);
};

export default LoadingSpinner;

import React from "react";
import ReactLoading from "react-loading";

const LoadingIcon = () => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "column"
		}}
	>
		<ReactLoading
			type="spinningBubbles"
			color="#000"
			height={100}
			width={100}
		/>
		<div style={{ fontWeight: "bold", fontSize: 24 }}>Please wait...</div>
	</div>
);
export default LoadingIcon;

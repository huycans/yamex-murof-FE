import React from "react";
import ReactLoading from "react-loading";

const LoadingIcon = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
		}}
	>
		<ReactLoading type="balls" color="#ef7334" height={50} width={50}/>
		<div style={{ fontWeight: "bold", fontSize: 24, color: "#ef7334" }}>Please wait...</div>
	</div>
);
export default LoadingIcon;

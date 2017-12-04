import React, { Component } from "react";
import PropTypes from "prop-types";

const NavBar = () => (
	<div className="navigator">
		<a href="#">Yamex</a>
		-&gt;
		<a href="#">Forum Name</a>
		-&gt;
		<a href="#">Subforum Name</a>
		-&gt;
		<a href="#">Thread Name</a>
	</div>
);

class Thread extends Component {
	render() {
		return (
			<div>
				<NavBar />
				<div className="thread_header">
					<div className="user_avatar">
						<img src="img/square.png" alt="user_avatar" />
					</div>
					<div className="thread_header_info">
						<div className="thread_name">This is a thread_name</div>
						<div className="thread_creator">
							By <a href="#">User</a>, Member on Sept 29th 2017, 4:20PM
						</div>
					</div>
				</div>

				<div className="thread_bar">
					<button className="rep">Post Reply</button>
					<div className="search_bar">
						<input type="text" placeholder="Search thread.." name="search" />
						<button type="submit">
							<i className="fa fa-search" />
						</button>
					</div>
					<div className="no_pages search_no">
						<a href="#">1</a>
						<a href="#">2</a>
						<a href="#">3</a>
						<a href="#">11</a>
						<a href="#">&gt;</a>
						<a href="#">Last &gt;&gt;</a>
					</div>
				</div>

				<div className="thread_content">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
						tristique dui. Maecenas feugiat sem diam, et vulputate felis lacinia
						sit amet. Curabitur et varius metus. Nullam ornare vulputate tellus,
						sed finibus ligula. Sed in tellus ex. In ut bibendum sem, id
						molestie est. Nullam eget orci ac nunc consectetur facilisis.
						Vivamus molestie diam eu ipsum scelerisque venenatis. Etiam molestie
						semper dui, fermentum lobortis massa finibus sit amet. Duis ex nunc,
						posuere ac ipsum sit amet, bibendum tempus eros. Nulla blandit,
						mauris non tempus ultrices, nisl nibh auctor lacus, eget iaculis
						sapien risus quis tortor. Curabitur suscipit libero in enim
						efficitur, ac viverra enim mattis. Ut sagittis erat vel dolor
					</p>
				</div>
				<div className="rep_quickrep_tool">
					<div className="no_thank">%number% people thanks this</div>
					<button>Reply</button>
					<button>Quick Reply</button>
					<button>Thanks</button>
				</div>

				<div className="post_reply">
					<div className="user_post_rep">
						<div className="post_user">
							<a>%name%</a>
						</div>
						<div className="post_info">
							date and time | <a href="#">#number</a>
						</div>
					</div>
					<div className="post_content">
						<div className="post_user_content">
							<img src="img/square.png" alt="user_content" />

							<div className="user_title">%title membership</div>
						</div>
						<div className="post_rep_content">
							<p>
								In ut dolor odio. Praesent efficitur urna dolor, in congue diam
								hendrerit pulvinar. Integer vel ante ut ante vehicula malesuada
								id id arcu. Pellentesque consequat viverra purus. Sed ultricies
								viverra tempus. In id tellus sed sapien finibus euismod
								efficitur ut ipsum. Vestibulum finibus urna enim, fringilla
								gravida lacus luctus vitae. Proin suscipit ultrices eros, nec
								sodales ante eleifend in. Sed et luctus est. Aliquam ac maximus
								ante. Nullam ac cursus massa. Praesent tortor ligula, interdum
								at nisl non, feugiat iaculis mauris. Nullam cursus iaculis
								libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Proin lectus lorem, mattis at odio ut, sollicitudin varius quam.
								Quisque vitae nibh ut magna luctus pellentesque a ut nisl.
								Nullam id justo sem. Pellentesque in ullamcorper neque, sed
								lobortis augue. Ut congue risus mi, id pretium diam porta at.
								Pellentesque ac ligula et magna elementum pulvinar. Maecenas
								viverra dolor a dui mollis, eget gravida leo accumsan. Integer
								ut consequat felis, nec venenatis nisi. Vestibulum dignissim
								augue quam, vel porttitor dui dictum non. Aenean feugiat velit
								sed eros tincidunt eleifend. Nam a auctor sem. Phasellus vitae
								odio eleifend, vestibulum sapien ac, placerat diam. Etiam
								feugiat lectus sapien, ac lacinia diam pretium nec. Pellentesque
								et convallis est, et accumsan risus. Nullam non maximus metus.
								Nullam non justo in tellus commodo rutrum non sit amet ante.
								Fusce tincidunt ultrices nibh sit amet vulputate. Etiam ut
								vestibulum arcu. Cras consequat orci lorem, vel porta nisi
								imperdiet non. Cras non risus lacus.
							</p>
						</div>
					</div>
				</div>
				<div className="rep_quickrep_tool">
					<div className="no_thank">%number% people thanks this</div>
					<button>Reply</button>
					<button>Quick Reply</button>
					<button>Thanks</button>
				</div>
			</div>
		);
	}
}

export default Thread;

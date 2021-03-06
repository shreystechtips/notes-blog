import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import moment from "moment";
import {
	Typography,
	Grid,
	// Link as MaterialLink,
	makeStyles,
	Card,
	CardContent,
	// Paper,
} from "@material-ui/core";
import SEO from "../components/seo";
import Layout from "../components/layout";
const useStyles = makeStyles((theme) => ({
	card: {
		maxWidth: 350,
		minWidth: 300,
		maxHeight: 375,
		borderRadius: 8,
	},
	// 	backgroundColor:
	// 		theme.palette.type === "light"
	// 			? "#F3F3F7"
	// 			: "#FF0000",
	// },
	gridRoot: {
		justifyContent: "center",
		alignItems: "center",
		// textAlign: "center",
	},
}));

export default function Index(props) {
	const classes = useStyles();
	const data = useStaticQuery(pageQuery);
	const [assortedPosts, setPosts] = React.useState({});
	// const { pageContext } = props;
	// const { data } = pageContext;
	const { edges: posts } = data.allMarkdownRemark;
	React.useEffect(() => {
		var vals = {};
		const temp = posts.filter(
			(post) =>
				post.node.frontmatter.path != null &&
				post.node.frontmatter.date != null &&
				post.node.frontmatter.title != null &&
				post.node.frontmatter.path.indexOf("..") < 0 &&
				post.node.frontmatter.path.length > 0
		);
		temp.map(({ node: post }) => {
			var cut = post.frontmatter.path.split("/");
			cut = cut.slice(1);
			if (cut.length >= 2) {
				if (!vals.hasOwnProperty(cut[0])) {
					vals[cut[0]] = {};
				}
				if (!vals[cut[0]].hasOwnProperty(cut[1])) {
					vals[cut[0]][cut[1]] = [];
				}
				vals[cut[0]][cut[1]].push(post);
			}
		});
		setPosts(vals);
	}, []);

	const generatePostsBox = (outerKey, postList) => {
		const data = postList[outerKey];

		return (
			<>
				<Typography
					variant="h5"
					color="textPrimary"
					style={{ fontWeight: "bold", textAlign: "center" }}
					key={outerKey}
				>
					{outerKey.toUpperCase()}
				</Typography>
				{Object.keys(data).map((key) => (
					<Grid
						container
						direction="column"
						key={key}
						style={{
							// overflow: "hidden",
							marginBottom: 20,
							padding: 0,
						}}
					>
						<Typography variant="h6" color="textPrimary">
							{key.charAt(0).toUpperCase() + key.substring(1)}
						</Typography>
						<Grid
							container
							direction="row"
							spacing={4}
							wrap="nowrap"
							style={{
								overflowX: "auto",
								// maxWidth: data[key].length * style.card.maxWidth - 15,
								// margin: "auto",
							}}
						>
							{data[key].map((post) => (
								<Grid
									item
									className="blog-post-preview"
									key={post.frontmatter.path}
								>
									<Grid container direction="column">
										<Card
											className={classes.card}
											component={Link}
											to={post.frontmatter.path}
											style={{
												textDecoration: "none",
											}}
										>
											<CardContent>
												<Grid item>
													<Typography variant="h4">
														{post.frontmatter.title}
													</Typography>
													<Typography variant="h6">
														{moment(post.frontmatter.date).format(
															"MMMM DD, YYYY"
														)}
													</Typography>
												</Grid>
												<Grid item>
													<Typography noWrap variant="body2">
														Section {post.frontmatter.path}
													</Typography>
												</Grid>
												<Grid item>
													<Typography variant="body1">
														{post.excerpt}
													</Typography>
												</Grid>
											</CardContent>
										</Card>
									</Grid>
								</Grid>
							))}
						</Grid>
					</Grid>
				))}
			</>
		);
	};

	return (
		<Layout>
			<div className="blog-posts" style={{ margin: "auto" }}>
				<SEO title="Home" />
				<div style={{ margin: 10 }}>
					<Grid
						container
						direction="column"
						spacing={2}
						className={classes.gridRoot}
					>
						{Object.keys(assortedPosts).map((key) => {
							return generatePostsBox(key, assortedPosts);
						})}
					</Grid>
				</div>
			</div>
		</Layout>
	);
}

export const pageQuery = graphql`
	query postsQuery {
		allMarkdownRemark(
			filter: { frontmatter: { path: { ne: null }, title: { ne: null } } }
			sort: { order: DESC, fields: [frontmatter___date] }
		) {
			edges {
				node {
					excerpt(pruneLength: 100)
					frontmatter {
						date
						path
						title
					}
				}
			}
		}
	}
`;


// export const pageQuery = graphql`
//   query postsQuery {
//     allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
//       edges {
//         node {
//           excerpt(pruneLength: 100)
//           html
//           id
//           frontmatter {
//             date(formatString: "MMMM DD, YYYY")
//             path
//             title
//           }
//         }
//       }
//     }
//   }
// `

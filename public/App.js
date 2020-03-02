const contentNode = document.getElementById('contents');
const products = [];

const ProductRow = props => React.createElement(
	"tr",
	null,
	React.createElement(
		"td",
		null,
		props.product.ProductName
	),
	React.createElement(
		"td",
		null,
		"$",
		props.product.Price
	),
	React.createElement(
		"td",
		null,
		props.product.Category
	),
	React.createElement(
		"td",
		null,
		React.createElement(
			"a",
			{ href: props.product.ImageUrl, target: "_blank" },
			React.createElement(
				"u",
				null,
				"View"
			)
		)
	)
);
function ProductTable(props) {
	const productRows = props.products.map(product => React.createElement(ProductRow, { key: product.id, product: product }));
	return React.createElement(
		"table",
		{ className: "bordered-table colmn-width" },
		React.createElement(
			"thead",
			null,
			React.createElement(
				"tr",
				null,
				React.createElement(
					"th",
					null,
					"Product Name"
				),
				React.createElement(
					"th",
					null,
					"Price"
				),
				React.createElement(
					"th",
					null,
					"Category"
				),
				React.createElement(
					"th",
					null,
					"Image"
				)
			)
		),
		React.createElement(
			"tbody",
			null,
			productRows
		)
	);
}

class ProductAdd extends React.Component {
	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(e) {
		e.preventDefault();
		var form = document.forms.productAdd;
		this.props.createProduct({
			Category: form.category.value,
			Price: parseFloat(form.price.value.slice(1)),
			ProductName: form.productName.value,
			ImageUrl: form.imageUrl.value
		});
		form.category.value = "Shirts";form.price.value = "$";form.productName.value = "";form.imageUrl.value = "";
	}
	render() {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"form",
				{ name: "productAdd", onSubmit: this.handleSubmit },
				React.createElement(
					"div",
					{ className: "form-group" },
					React.createElement(
						"div",
						{ className: "col-sm-6" },
						React.createElement(
							"label",
							null,
							"Category"
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-6" },
						React.createElement(
							"label",
							null,
							"Price"
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-6" },
						React.createElement(
							"select",
							{ id: "category", className: "form-control" },
							React.createElement(
								"option",
								{ value: "Shirts", defaultValue: true },
								"Shirts"
							),
							React.createElement(
								"option",
								{ value: "Jeans" },
								"Jeans"
							),
							React.createElement(
								"option",
								{ value: "Jackets" },
								"Jackets"
							),
							React.createElement(
								"option",
								{ value: "Sweaters" },
								"Sweaters"
							),
							React.createElement(
								"option",
								{ value: "Accessories" },
								"Accessories"
							)
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-6" },
						React.createElement("input", { className: "form-control", type: "text", name: "price", defaultValue: "$" })
					)
				),
				React.createElement(
					"div",
					{ className: "form-group" },
					React.createElement(
						"div",
						{ className: "col-sm-6  top-buffer" },
						React.createElement(
							"label",
							null,
							"Product Name"
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-6  top-buffer" },
						React.createElement(
							"label",
							null,
							"Image URL"
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-6" },
						React.createElement("input", { className: "form-control", type: "text", name: "productName" })
					),
					React.createElement(
						"div",
						{ className: "col-sm-6" },
						React.createElement("input", { className: "form-control", type: "text", name: "imageUrl" })
					)
				),
				React.createElement(
					"div",
					{ className: "form-group" },
					React.createElement(
						"div",
						{ className: "col-sm-10" },
						React.createElement(
							"button",
							{ className: "btn btn-default  top-buffer" },
							"Add Product"
						)
					)
				)
			)
		);
	}
}

class ProductList extends React.Component {
	constructor() {
		super();
		this.state = { products: [] };
		this.createProduct = this.createProduct.bind(this);
	}
	componentDidMount() {
		this.loadData();
	}
	loadData() {
		const query = `query{
			productList{
				id Category ProductName Price ImageUrl
			}
		}`;

		fetch('/graphql', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query })
		}).then(response => {
			response.json().then(result => {
				this.setState({ products: result.data.productList });
			});
		}).catch(err => {
			alert("Error in sending data to server: " + err.message);
		});
	}

	createProduct(newProduct) {
		const query = `mutation productAdd($newProduct: ProductInput!) {
			productAdd(product: $newProduct) {
				id
			}
		}`;
		fetch('/graphql', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query, variables: { newProduct } })
		}).then(response => {
			this.loadData();
		}).catch(err => {
			alert("Error in sending data to server: " + err.message);
		});
	}
	render() {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"h1",
				null,
				"My Company Inventory"
			),
			React.createElement(
				"div",
				null,
				"Showing all available products."
			),
			React.createElement("hr", null),
			React.createElement(ProductTable, { products: this.state.products }),
			React.createElement(
				"div",
				{ className: "top-buffer" },
				"Add a new product to inventory"
			),
			React.createElement("hr", null),
			React.createElement(ProductAdd, { createProduct: this.createProduct })
		);
	}
}

ReactDOM.render(React.createElement(ProductList, null), contentNode);
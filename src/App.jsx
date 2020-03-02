const contentNode = document.getElementById('contents');
const products = [];

const ProductRow = (props) => (
	<tr>
		<td>{props.product.ProductName}</td>
		<td>${props.product.Price}</td>
		<td>{props.product.Category}</td>
		<td><a href={props.product.ImageUrl} target="_blank"><u>View</u></a></td>
	</tr>
)
function ProductTable(props) {
	const productRows = props.products.map(product =><ProductRow key={product.id} product={product} />);
	return (
		<table className="bordered-table colmn-width">
			<thead>
				<tr>
					<th>Product Name</th>
					<th>Price</th>
					<th>Category</th>
					<th>Image</th>
				</tr>
			</thead>
			<tbody>{productRows}</tbody>
		</table>
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
			ImageUrl: form.imageUrl.value,
		});
		form.category.value = "Shirts"; form.price.value = "$"; form.productName.value = ""; form.imageUrl.value = "";
	}
	render() {
		return (
			<div>
				<form name="productAdd" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<div className="col-sm-6">
							<label>Category</label>
						</div>
						<div className="col-sm-6">
							<label>Price</label>
						</div>
						<div className="col-sm-6">
							<select id="category" className="form-control">
								<option value="Shirts" defaultValue>Shirts</option>
								<option value="Jeans">Jeans</option>
								<option value="Jackets">Jackets</option>
								<option value="Sweaters">Sweaters</option>
								<option value="Accessories">Accessories</option>
							</select>
						</div>
						<div className="col-sm-6">
							<input className="form-control" type="text" name="price" defaultValue="$"/>
						</div>
					</div>
					<div className="form-group">
						<div className="col-sm-6  top-buffer">
							<label>Product Name</label>
						</div>
						<div className="col-sm-6  top-buffer">
							<label>Image URL</label>
						</div>
						<div className="col-sm-6">
							<input className="form-control" type="text" name="productName" />
						</div>
						<div className="col-sm-6">
							<input className="form-control" type="text" name="imageUrl" />
						</div>
					</div>
					<div className="form-group">        
					  <div className="col-sm-10">
						<button className="btn btn-default  top-buffer" >Add Product</button>
					  </div>
					</div>
				</form>
			</div>
		)
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
	loadData(){
		const query = `query{
			productList{
				id Category ProductName Price ImageUrl
			}
		}`;
		
		fetch('/graphql', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify({ query })
		}).then(response => {
			response.json().then(result => {
				this.setState({products:result.data.productList});
			})
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
			headers: { 'Content-Type': 'application/json'},
			body: JSON.stringify({ query, variables: { newProduct } })
		}).then(response=> {
			this.loadData()
		}).catch(err => {
			alert("Error in sending data to server: " + err.message);
		});
	}
	render() {
		return (
			<div>
			<h1>My Company Inventory</h1>
			<div>Showing all available products.</div>
			<hr />
			<ProductTable products={this.state.products} />
			<div className="top-buffer">Add a new product to inventory</div>
			<hr />
			<ProductAdd createProduct={this.createProduct} />
			</div>
		);
	}
}

ReactDOM.render(<ProductList />, contentNode);
// ----------------- Get Elements -----------------
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productPrice");
const productCategoryInput = document.getElementById("productCategory");
const productDescriptionInput = document.getElementById("productDescription");
const productSearch =document.getElementById("productSearch");
const tableBody = document.getElementById('tableBody');
const allProduct = document.getElementById('allProduct');
const inputs = document.getElementsByClassName('form-control');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearForm');
const updateBtn = document.getElementById('updateBtn');
const deletAll = document.getElementById('deletAll');
const emptyAlert = document.getElementById('emptyAlert');
const alertName = document.getElementById('alertName')
const alertprice = document.getElementById('alertprice')
const alertCategory = document.getElementById('alertCategory')
const alertDesc = document.getElementById('alertDesc')

// ----------------- Global Variables -----------------
let products = [];
let currentIndex = 0


//-------- Update Table After Refresh -----------
  if (localStorage.getItem('productList') == null)
  {
    products = [];
  }
  else
  {
    products = JSON.parse(localStorage.getItem('productList'));
    displayData();
  }


// ----------------------Start Events ---------------------
// ---------- Add New Product event -----
addBtn.addEventListener("click" , function(){
  if (productNameInput.value == "" || productPriceInput.value == "" || productCategoryInput.value == "" || productDescriptionInput.value == "")
  {
    emptyAlert.classList.remove('d-none')
  }
  else 
  {
    emptyAlert.classList.add('d-none')
    addProduct();
  }
})

// ------------- reset Form ---------------
clearBtn.addEventListener('click' , resetForm)

// ---------- update Data of row ------------
updateBtn.addEventListener('click', function (){
  submitUpdateData();
  displayData();
  resetForm();
})

// -------------- delete All -----------------
deletAll.addEventListener('click' , deletAllProducts)

// -------------- search ------------------------
productSearch.addEventListener('input' , function() {
  searchProduct()
})

// -------------- keyUp ----------------
addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    addBtn.classList.contains("d-none") ? updateProduct() : addProduct();
  } else if (e.key == "Escape") {
    resetForm();
  }
});

// ---------------------End Events ---------------------



// Add Product to Array Function
function addProduct()
{
  if (validName() == true && validPrice() == true && validCategory() == true && validDesc() == true)
  {
    let product =
    {
      name:productNameInput.value,
      price:productPriceInput.value,
      category:productCategoryInput.value,
      description:productDescriptionInput.value,
    }
    products.push(product);
    Swal.fire({
      icon: 'success',
      title: 'Add Product!',
      showConfirmButton: true,
      timer: 1500,
    });
    localStorage.setItem("productList" ,JSON.stringify(products));
    displayData();
    resetForm();
  }
}

//Display Products Table Function
function displayData()
{
  let newProduct ="";
  for(let i=0 ; i<products.length ; i++)
  {
    newProduct +=
    `
    <tr>
    <td> ${i+1}</td>
    <td> ${products[i].name}</td>
    <td> ${products[i].price}</td>
    <td> ${products[i].category}</td>
    <td> ${products[i].description}</td>
    <td> <button onclick="updateProduct(${i})" class='btn text-warning'><i class="fa-solid fa-pen-to-square"></i></button> <button onclick="deleteProductRow(${i})" class='btn text-danger'><i class="fa-solid fa-trash"></i></button></td>
    </tr>
    `
  }
  tableBody.innerHTML=newProduct;
  allProduct.innerHTML = products.length;
}

// reset Inputs after add Product
function resetForm()
  {
    for ( let i=0 ; i<inputs.length ; i++)
    {
      inputs[i].value = "";
      inputs[i].classList.remove("is-valid");
      inputs[i].classList.remove("is-invalid");
    }
    alertName.classList.add('d-none')
    alertprice.classList.add('d-none')
    alertCategory.classList.add('d-none')
    alertDesc.classList.add('d-none')
  }


// ------- delete Product row of Table function -----------
function deleteProductRow(deletIndex)
{

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      products.splice(deletIndex,1)
      displayData()
      localStorage.setItem("productList" ,JSON.stringify(products));
      Swal.fire("Deleted!", "Your Product has been deleted.", "success");
    }
});
}

// ---------- Edit Product info Function ------------
function updateProduct(updateIndex)
{
  currentIndex = updateIndex;

  productNameInput.value = products[updateIndex].name;
  productPriceInput.value = products[updateIndex].price;
  productCategoryInput.value = products[updateIndex].category;
  productDescriptionInput.value = products[updateIndex].description;

  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
}

// -------- Confirm update Data function -----------
function submitUpdateData()
{
  let  product =
  {
    name:productNameInput.value,
    price:productPriceInput.value,
    category:productCategoryInput.value,
    description:productDescriptionInput.value,
  }
  products[currentIndex]=product;
  localStorage.setItem("productList" ,JSON.stringify(products));
  Swal.fire({
    icon: 'success',
    title: 'Updated!',
    showConfirmButton: true,
    timer: 1500,
  });
  addBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");
}

// ------------- Delete All Data Function --------
function deletAllProducts()
{
  Swal.fire({
    title: "Delete All Products?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete all!",
}).then((result) => {
    if (result.isConfirmed) {
      products.splice(0)
      localStorage.setItem("productList" ,JSON.stringify(products));
      displayData();
      Swal.fire("Deleted!", "Your Products has been deleted.", "success");
    }
});
}

// ------------- search function ---------------
function searchProduct()
{
  let resultProduct = '';
  for ( let i=0 ; i<products.length ; i++)
  {
    
    if (products[i].name.toLowerCase().includes(productSearch.value.toLowerCase()))
    {
      var color = products[i].name.toLowerCase().replace(productSearch.value.toLowerCase(),`<span class="color">${productSearch.value.toLowerCase()}</span>`);
      resultProduct += 
      `
      <tr>
      <td> ${i+1}</td>
      <td> ${color}</td>
      <td> ${products[i].price}</td>
      <td> ${products[i].category}</td>
      <td> ${products[i].description}</td>
      <td> <button onclick="updateProduct(${i})" class='btn btn-outline-warning'>Update</button> <button onclick="deleteProductRow(${i})" class='btn btn-outline-danger'>Delete</button></td>
      </tr>
      `
    }
  }
  tableBody.innerHTML=resultProduct;
}

// ------------ rejex -----------------
productNameInput.addEventListener("input" , validName)
function validName()
{
  var regex = /^[A-Z][a-z]{3,10}[0-9]?$/
  var testValid = false;
  if(regex.test(productNameInput.value) == true)
  {
    alertName.classList.add('d-none')
    productNameInput.classList.replace('is-invalid' , 'is-valid')
    emptyAlert.classList.add('d-none')
    testValid = true;
  }
  else
  {
    productNameInput.classList.add('is-invalid')
    alertName.classList.remove('d-none')
    testValid = false;
  }
  return testValid;
}

productPriceInput.addEventListener("input" , validPrice)
function validPrice()
{
  var regex = /^(?:[1-9][0-9]{2,4}|100000)$/
  var testValid = false;
  if(regex.test(productPriceInput.value) == true)
  {
    alertprice.classList.add('d-none')
    productPriceInput.classList.replace('is-invalid' , 'is-valid')
    emptyAlert.classList.add('d-none')
    testValid = true;
  }
  else
  {
    productPriceInput.classList.add('is-invalid')
    alertprice.classList.remove('d-none')
    testValid = false;
  }
  return testValid;
}

productCategoryInput.addEventListener("input" , validCategory)
function validCategory()
{
  var regex = /^[A-Za-z\s]{5,}[0-9]*$/
  var testValid = false;
  if(regex.test(productCategoryInput.value) == true)
  {
    alertCategory.classList.add('d-none')
    productCategoryInput.classList.replace('is-invalid' , 'is-valid')
    emptyAlert.classList.add('d-none')
    testValid = true;
  }
  else
  {
    productCategoryInput.classList.add('is-invalid')
    alertCategory.classList.remove('d-none')
    testValid = false;
  }
  return testValid;
}

productDescriptionInput.addEventListener("input" , validDesc)
function validDesc()
{
  var regex = /^[A-Za-z\s]{5,}[0-9]*$/
  var testValid = false;
  if(regex.test(productDescriptionInput.value) == true)
  {
    alertDesc.classList.add('d-none')
    productDescriptionInput.classList.replace('is-invalid' , 'is-valid')
    emptyAlert.classList.add('d-none')
    testValid = true;
  }
  else
  {
    productDescriptionInput.classList.add('is-invalid')
    alertDesc.classList.remove('d-none')
    testValid = false;
  }
  return testValid;
}

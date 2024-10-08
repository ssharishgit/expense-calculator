let detailsArray = [];
const container = document.getElementById("container");
const totalAmountDiv = document.getElementById("total");
const descriptionEle = document.querySelector("#description");
const amountEle = document.querySelector("#amount");
const transactionEle = document.getElementsByName('transaction');
const allDetailsEle = document.getElementsByName('details');
const addButton = document.querySelector("#add-btn");
const editButton = document.querySelector("#edit-btn");

let dataFromlocalStorage = JSON.parse(localStorage.getItem("data")) ?? [];
let selectedIndex = 0;

let sampleArray = [
  {
    "type":"income",
    "description":"salary",
    "amount": 2000,
  },
  {
    "type":"income",
    "description":"interest",
    "amount": 400,
  },
  {
    "type":"expense",
    "description":"rent",
    "amount": 800,
  },
  {
    "type":"expense",
    "description":"gst",
    "amount": 600,
  },
];

if (dataFromlocalStorage.length !== 0){
  detailsArray = dataFromlocalStorage;
  creatDetailsList(detailsArray);
}else{
  detailsArray = sampleArray;
  localStorage.setItem("data",JSON.stringify(sampleArray));
  creatDetailsList(detailsArray);
}

function deleteDetails(event){
  let selectedId = event.target.id;
  let newArray = detailsArray.filter((element,index)=>{
    return index != selectedId;
  });
  detailsArray = newArray;
  localStorage.setItem("data",JSON.stringify(detailsArray));
  creatDetailsList(detailsArray);
}

function creatDetailsList(inputArray,specific){
  let totalAmount = 0;
  let totalIncome = 0;
  let totalExpense = 0;
  container.innerHTML = "";
  totalAmountDiv.innerHTML = "";

  // resetting to defaults
  descriptionEle.value = "";
  amountEle.value = "";
  if (specific == undefined || specific == "all"){
    transactionEle[0].checked = true;
    allDetailsEle[0].checked = true;
  }
  
  inputArray.forEach((element,index) => {
    
    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("col-span-2");
    detailsDiv.innerText = element.description;

    const typeDiv = document.createElement("div");
    typeDiv.classList.add("col-span-2");
    typeDiv.innerText = element.type;

    const amountDiv = document.createElement("div");
    amountDiv.classList.add("col-span-2");
    amountDiv.innerText = element.amount;

    const updateDiv = document.createElement("div");
    updateDiv.classList.add("col-span-2");
    const updateButton = document.createElement("button");
    // updateButton.id = index;
    updateButton.classList.add("bg-cyan-600","sm:px-3","xxs:px-1","xxs:py-1","font-medium","text-white","rounded-md","hover:bg-cyan-500");
    updateButton.innerHTML = '<i class="fa fa-pencil-square-o sm:pr-2 xxs:pr-0.5" aria-hidden="true"></i>Update';
    updateDiv.append(updateButton);
    // updateButton.addEventListener('click',populateDetails);
    updateButton.addEventListener('click',function(){
      populateDetails(index);
    });

    const deleteDiv = document.createElement("div");
    deleteDiv.classList.add("col-span-2");
    const deleteButton = document.createElement("button");
    deleteButton.id = index;
    deleteButton.classList.add("bg-red-600","sm:px-3","xxs:px-1","xxs:py-1","font-medium","text-white","rounded-md","hover:bg-red-500");
    deleteButton.addEventListener("click",deleteDetails);
    deleteButton.innerHTML = '<i class="fa fa-trash sm:pr-2 xxs:pr-0.5" aria-hidden="true"></i>Delete';
    deleteDiv.append(deleteButton);

    if (element.type == "expense"){
      totalExpense += Number(element.amount);
    }else{
      totalIncome += Number(element.amount);
    }

    if (specific == undefined || specific == "all"){
      container.append(detailsDiv,typeDiv,amountDiv,updateDiv,deleteDiv);
    }else if (specific == element.type){
      container.append(detailsDiv,typeDiv,amountDiv,updateDiv,deleteDiv);
    }
    
  });
  
  totalAmount = totalIncome - totalExpense;
  const totalIncomeEle = document.createElement("h3");
  const totalExpenseEle = document.createElement("h3");
  const totalEle = document.createElement("h3");
  totalIncomeEle.innerText = "Total Income: ₹" + totalIncome;
  totalExpenseEle.innerText = "Total Expenses: ₹" + totalExpense;
  totalEle.innerText = "Total Balance: ₹" + totalAmount;

  totalAmountDiv.append(totalIncomeEle,totalExpenseEle,totalEle);
}

function getAll(){
  let selectedType = '';
  for (let i = 0; i < allDetailsEle.length; i++) {
    if (allDetailsEle[i].checked) {
      selectedType = allDetailsEle[i].value;
      break;
    }
  }
  creatDetailsList(detailsArray,selectedType);
}

function addDetails() {

  let entryType = '';
  for (let i = 0; i < transactionEle.length; i++) {
    if (transactionEle[i].checked) {
      entryType = transactionEle[i].value;
      break;
    }
  }
  let descriptionValue = descriptionEle.value;
  let givenAmount = Number(amountEle.value);

  let detailsObj = {
    "type": entryType,
    "description": descriptionValue,
    "amount": givenAmount,
  };

  detailsArray.push(detailsObj);
  localStorage.setItem("data",JSON.stringify(detailsArray));
  creatDetailsList(detailsArray);
}

function updateDetails(){
  let entryType = '';
  for (let i = 0; i < transactionEle.length; i++) {
    if (transactionEle[i].checked) {
      entryType = transactionEle[i].value;
      break;
    }
  }
  let descriptionValue = descriptionEle.value;
  let givenAmount = Number(amountEle.value);
  let newArray = detailsArray.map((element,index)=>{
    if (index == selectedIndex){
      element.type = entryType;
      element.description = descriptionValue;
      element.amount = givenAmount;
    }
    return element

  });

  detailsArray = newArray;
  container.classList.remove("custom-disabled");
  addButton.classList.remove("hidden");
  editButton.classList.add("hidden");

  localStorage.setItem("data",JSON.stringify(detailsArray));
  creatDetailsList(detailsArray);
}

function populateDetails(givenId){
  // event.stopPropagation();
  // console.log(event.target)
  selectedIndex = givenId;

  container.classList.add("custom-disabled");
  addButton.classList.add("hidden");
  editButton.classList.remove("hidden");
  let selectedDetail = detailsArray[selectedIndex];
  if (selectedDetail.type == "income"){
    transactionEle[0].checked = true;
  }else{
    transactionEle[1].checked = true;
  }
  descriptionEle.value = selectedDetail.description;
  amountEle.value = selectedDetail.amount;
}
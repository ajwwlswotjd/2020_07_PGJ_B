const log = console.log;


window.addEventListener("load",()=>{
	$.getJSON("store.json",(e)=>{
		let list = [];
		e.forEach(x=>{
			let pd = new Product(x.id,x.photo,x.brand,x.product_name,x.price);
			list.push(pd);
		});
		let app = new App(list);
	});
});

class App {
	constructor(list){
		this.productList = list;
		this.basket = [];
		this.init();
	}

	init(){
		this.productList.forEach(x=>{
			let div = this.itemTemp(x);
			document.querySelector(".item-list").appendChild(div);
			$(div).draggable({
				cursor:"pointer",
				helper:"clone",
				appendTo:".basket",
				revert:true
			});
		});

		$(".basket").droppable({
			accept:".item",
			drop : (e,ui)=>{
				let drag = ui.draggable[0];
				let exist = this.basket.find(x=> x.id == drag.dataset.id);
				if(exist !== undefined){
					alert("이미 장바구니에 존재하는 상품입니다.");
					return;
				}
				let item = this.productList.find(x=> x.id == drag.dataset.id);
				let li = this.basketItemTemp(item);
				li.querySelectorAll(".basket-cnt > button").forEach(x=>{
					x.addEventListener("click",(c)=>{
						let num = x.dataset.num;
						item.cnt += num*1;
						if(item.cnt <= 1) item.cnt = 1;
						li.querySelector(".basket-total").innerHTML = `${(item.cnt*item.priceNum).toLocaleString()}원`;
						li.querySelector(".basket-cnt > span").innerHTML = item.cnt;
					});
				});
				li.querySelector(".basket-close").addEventListener("click",(c)=>{
					let index = -1;
					this.basket.forEach((x,idx)=>{
						if(x.id == item.id) index = idx;
					});
					log(index);
					this.basket.splice(index,1);
					log(this.basket);
					$(li).remove();
				});
				document.querySelector(".screen-right-top").prepend(li);
				this.basket.push(item);
			}
		});
	}

	itemTemp(item){
		let div = document.createElement("div");
		div.classList.add("item");
		div.dataset.id = item.id;
		div.innerHTML = `
						<div class="item-brand">
							${item.brand}
						</div>

						<img src="${item.photo}" alt="" class="item-img">
						
						<div class="item-name">
							${item.name}
						</div>
						<div class="item-price">
							${item.price}원
						</div>
		`;
		return div;
	}
	
	basketItemTemp(item){
		let li = document.createElement("li");
		li.classList.add("basket-item");
		li.innerHTML = `
				<img src="${item.photo}" alt="">
					<div class="basket-item-text">
						<p class="basket-brand">${item.brand}</p>
						<p class="basket-name">${item.name}</p>
						<p class="basket-price">${item.price}원</p>
					</div>
					<div class="basket-cnt-total">
						<div class="basket-cnt">
							<button data-num="-1">
								<i class="fa fa-minus"></i>
							</button>
							<span>${item.cnt}</span>
							<button data-num="1">
								<i class="fa fa-plus"></i>
							</button>
						</div>
						<div class="basket-total">
							${item.price}원
						</div>
					</div>
					<div class="basket-close">&times;</div>
		`;
		return li;
	}
}

class Product {
	constructor(id,photo,brand,name,price){
		this.id = id;
		this.photo = photo;
		this.brand = brand;
		this.name = name;
		this.price = price;
		this.priceNum = price.replace(/,/gi,"")*1;
		this.cnt = 1;
		this.total = this.priceNum;
	}
}

function cho(str){
	let arr = [
		"ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ",
		"ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
	];
	let result = [];
	for(let i = 0; i < str.length;i++){
		let index = Math.floor((str[i].charCodeAt()-44032)/588);
		result.push(arr[index] || str[i]);
	}
	return result.join('');
}

function match(keyword,data){
	let keywordCho = cho(keyword);
	let dataCho = cho(data);
	let index = -1;
	let result = [];

	do {

		index = dataCho.indexOf(keywordCho,(index+1));
		if(index > -1) result.push(index);

	}while(index > -1);
	return result;
}

function search(keyword,data){
	let dataCho = cho(data);
	let indexes = match(keyword,data);
	log(indexes);
	let keywordLength = keyword.length;
	let result = [];

	for(let i = 0; i < indexes.length; i++){
		let index = indexes[i];
		let flag = false;

		for(let j=0; j < keywordLength; j++){
			let keywordChar = keyword[j];
			let dataChar = (keywordChar.match(/[ㄱ-ㅎ]/) ? dataCho : data)[j+index];
			if(keywordChar != dataChar) flag = true;
		}

		if(!flag) result.push(index);
	}
	return result;
}
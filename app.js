const log = console.log;
// 디버깅용 console.log 함수를 log로 줄인다.
// 예를들면
console.log("안녕하세요"); // 이거를
log("안녕하세요"); // 이렇게 줄일 수 있다

window.addEventListener("load", () => { // 윈도우가 로딩이 되면
	$.getJSON("store.json", (json) => { // store.json을 불러오고, 다 불러오면 밑의함수 실행
		let list = []; // 빈 배열을 하나 만들고
		json.forEach(x => { // 불러온 json 마다
			let product = new Product(x.id, x.photo, x.brand, x.product_name, x.price); // 241번째 줄에 설명
			list.push(product); // 만들어놓은 배열에 상품을 넣는다.
		});
		let app = new App(list); // 다 만든 배열을 토대로 App 을 만든다.
	});
});

class App { // App
	constructor(list) { // 9번째 줄에 만든 list 를 받아서
		this.productList = list; // productList (상품 목록) 변수에 담는다.
		this.basket = []; // 장바구니 배열
		this.init(); // initialize (초기화하다) 함수를 호출시킨다.
	}

	init() {
		this.drawList(this.productList); // 165 번째 줄에서 설명
		// 처음 시작화면에는 모든 상품이 보여야하므로 모든상품 정보를 보여준다.

		this.addEvent(); // addEventListener 들을 모아놓은 함수를 호출

		$(".basket").droppable({
			// '이곳에 상품을 넣어주세요.' 이 부분에 무언가를 넣을 수 있게 하는 부분
			accept: ".item-img", // item-img 라는 클래스를 가진 아이템만 넣을 수 있도록 한다.
			drop: (e, ui) => { // 아이템을 넣었을때 실행되는 함수

				let droppedItem = ui.draggable[0];
				// 자신이 넣은 아이템이 무엇인지 가져오는 부분이다.
				// 설명하기엔 너무 길고 영양가 없어서 그냥 외우는것이 좋다.

				let exist = this.basket.find(x => x.id == droppedItem.dataset.id);
				// exist : 존재하다.
				// find : 찾다.
				// 배열에서 find 함수를 호출하면 조건에 알맞는 요소를 찾아내서 반환해준다.
				// 만약에 조건에 알맞는 요소를 찾이내지 못했으면 undefined 를 반환한다.

				if (exist !== undefined) {
				// undefined 가 아니라는것은 무언가 찾았다는거고 this.basket 에서 무언가를 찾았다는것은
				// 장바구니에 이미 담긴 상품이라는 뜻

					alert("이미 장바구니에 존재하는 상품입니다."); // 경고창을 띄워주고
					return; // 종료한다.

				}

				let item = this.productList.find(x => x.id == droppedItem.dataset.id);
				// 위에 설명한대로 find 함수를 호출해 모든 상품 리스트에서
				// 드랍된 아이템의 id 를 뽑아와, 어떤 상품을 넣었는지 알아내 변수에 담는다.

				item.cnt = 1;
				// 아이템을 넣을때는 갯수가 1개여야하므로 아이템의 갯수를 1로 만들어준다.

				item.calcTotal();
				// 아이템의 total 변수를 계산해준다.

				let li = this.basketItemTemp(item);
				// 272번째 줄에 있는 함수를 호출해서 li 하나 만들어온다.

				let inputDom = li.querySelector("input"); // li 안에있는 input 
				let totalDom = li.querySelector(".basket-total"); // li 안에있는 합계를 나타내는 dom

				inputDom.addEventListener("input",(e)=>{ // li 안에 있는 input 에 입력을 할떄마다

					let value = e.target.value; // value 를 뽑아다가
					if(value < 1) value = 1; // 1 이상만 입력 가능하게 하고
					e.target.value = value; // value 를 바꿔준다.

					item.cnt = value; // 아이템의 갯수를 바꿔주고
					item.calcTotal(); // total도 계산해주고
					totalDom.innerHTML = item.total.toLocaleString()+"원";
					// 아이템 합계 부분을 알맞게 넣어준다.
					// item.total.toLocaleString() == 숫자의 3자릿수마다 콤마(",") 를 찍어서 문자열로 반환해준다.

					// 예를 들어
					// let num = 123456789;
					// let comNum = num.toLocaleString();
					// console.log(comNum) => "123,456,789"

					this.calcTotal(); // 233번째 줄 함수 설명
					// 화면 우측 하단의 총 합계 부분을 계산한다.
				});
				
				li.querySelector(".basket-close").addEventListener("click", (c) => {
					// 상품 삭제 버튼을 누르면

					let index = this.basket.findIndex(x=> x.id == item.id);
					// 장바구니에서 아이템의 인덱스를 찾는다.

					// 배열에서 findIndex를 호출하면 조건에 맞는 index 를 찾는다.
					// 예를들어서
					// let arr = ["정재성","김규태","김태연","우예인","박인환"];
					// let index = arr.findIndex(x=> x == "우예인");
					// console.log(index) => 3

					this.basket.splice(index, 1);
					// 배열의 index 번쨰에서 1개를 지운다.
					// 배열에서 splice 함수를 호출하면 2개의 인자값을 받는다.
					// index, deleteCnt 두개를 받는데,
					// 배열의 index 번째부터 deleteCnt개 만큼 제거해준다.

					// 예를 들어
					// let arr = [0,1,2,3,4,5,6,7,8,9];
					// arr.splice(3,5);
					// 이렇게 하면 3번째부터 5개를 지우므로
					// arr 에 3,4,5,6,7 이 지워진
					// [0,1,2,8,9] 만 남게된다.

					li.remove(); // 삭제했으니까 li도 지워주고
					this.calcTotal(); // 화면 우측 하단의 총합계도 다시 계산해준다.
				});

				document.querySelector(".screen-right-top").prepend(li);
				// 화면 우측 장바구니부분에 li 를 넣어주고
				
				this.basket.push(item);
				// 장바구니 배열에 상품을 넣어준다.

				this.calcTotal();
				// 상품 넣었으니까 총합계도 계산해준다.
			}
		});
	}

	drawList(items, high = false) { // 배열을 받아서 화면애 그려주는 함수


		// high = false 설명
		// highlight 를 줄인 boolean 형태 변수로
		// high 가 true 일때는 하이라이트된 상품으로 보이도록 한다.
		// 반대로 high 가 false 일때는 하이라이팅 되지 않은 상품이 보여야한다.
		// 제일 처음에는 하이라이트가 되지 않은 모든 상품이 보여야 하므로
		// high 가 매개변수로 입력되지 않았을때를 가정하여 기본적으로 false 로 놓았다.

		document.querySelector(".item-list").innerHTML = ""; // 상품들을 다 지우고
		items.forEach(x => { // 받아온 배열에 forEach 를 돌려서
			let div = this.itemTemp(x, high); // 196번째 줄 함수. 
			// 상품리스트에 보일 div 를 꾸미고 
			document.querySelector(".item-list").appendChild(div);
			// 지워놓은 상품 리스트에다가 다시 그려준다.

			$(div).find("img").draggable({ // 이미지를 드래그가능하게 해준다.
				cursor: "pointer", // 드래그할때 커서는 포인터로
				helper: "clone", // 드래그하면 새로운 이미지가 생기고
				appendTo: ".basket", // 부모를 .basket 으로 바꿔주고
				revert: true // 원래자리로 돌아가게 한다.
			});
		});
	}

	addEvent() {
		document.querySelector("#search-input").addEventListener("input", this.searchInputHandler);
		// 화면 좌측 상단의 검색어 입력 input 에 addEvent 를 해주었다.

		document.querySelector("#buy_btn").addEventListener("click", e => $(".pc-popup").fadeIn());
		// 화면 우측 하단의 구매하기 버튼을 눌렀을때 구매 팝업을 띄워준다.

		document.querySelector("#pc-btn").addEventListener("click", this.purchaseBtnClickHandler);
		// 구매 팝업에서 구매완료 버튼을 눌렀을떄 addEventListener 를 해주었다.

		document.querySelector(".pc-close").addEventListener("click", this.purchasePopupCloseBtnClickHandler);
		// 구매 팝업 닫기버튼을 눌렀을때의 addEventListener 를 해주었다.
		document.querySelector(".ysj-close").addEventListener("click", this.receiptPopupCloseBtnClickHandler);
		// 영수증 팝업 닫기버튼을 눌렀을때의 addEventListener 를 해주었다.
	}

	receiptPopupCloseBtnClickHandler = e => { // 영수증 팝업 닫기 버튼을 눌렀을때 
		$(".ysj-popup").fadeOut(); // 영수증 팝업을 닫아주고
		this.basket = []; // 장바구니 배열도 비워주고
		document.querySelector(".screen-right-top").innerHTML = ""; // 화면상의 장바구니 부분도 비워주고
		this.calcTotal(); // 우측 하단의 총합계 부분도 업데이트 해준다.
	}

	purchaseBtnClickHandler = e => {
		// 여기가 원래 영수증을 캔버스에 출력해주는 부분인데
		// 이거 이해하고 외우기에는 시간이 너무 오래 걸리므로 패쓰!
		document.querySelector(".pc-close").click();
		$(".ysj-popup").fadeIn();
		document.querySelector(".ysj-popup .ysj-container .div-wrapper").innerHTML = "";
		let canvas = document.createElement("canvas");
		let ctx = canvas.getContext("2d");
		let height = this.basket.length * 16 + 140;
		let width = 400;
		let top = 30;
		canvas.height = height;
		canvas.width = width;
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.strokeStyle = "#333030";
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, width, height);
		ctx.font = "25px Arial";
		ctx.fillStyle = "#333030";
		ctx.fillText("구매 내역서", width / 2, top);
		top += 30;
		ctx.beginPath();
		ctx.moveTo(40, top);
		ctx.lineTo(width - 40, top);
		ctx.closePath();
		ctx.stroke();
		ctx.font = "12px Arial";
		top += 10;
		this.basket.forEach(x => {
			let text = `${x.name} | ${x.price}원 | ${x.cnt}개 | ${x.total.toLocaleString()}원`;
			ctx.fillText(text, width / 2, top);
			top += 16;
		});
		top += 6;
		ctx.beginPath();
		ctx.moveTo(40, top);
		ctx.lineTo(width - 40, top);
		ctx.closePath();
		ctx.stroke();
		top += 10;
		ctx.font = "13px Arial";
		let date = new Date();
		let today = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초`;
		ctx.fillText(today, width / 2, top);
		ctx.font = "17px Arial";
		top += 20;
		let totalText = "총 합계 : " + this.calcTotal().toLocaleString() + "원";
		ctx.fillText(totalText, width / 2, top);
		document.querySelector(".ysj-container > .div-wrapper").appendChild(canvas);
	}


	purchasePopupCloseBtnClickHandler = e => {
		$(".pc-popup").fadeOut();
		$(".pc-popup input").val("");
	}

	searchInputHandler = e => {
		let keyword = e.target.value;
		if (keyword == "") {
			this.drawList(this.productList);
			return;
		}
		let list = this.productList.filter(x=>{
			return search(keyword, x.name).length != 0 || search(keyword, x.brand).length != 0;
		});
		if (list.length == 0) {
			document.querySelector(".item-list").innerHTML = "";
			let h1 = document.createElement("h1");
			h1.innerHTML = "일치하는 상품이 없습니다.";
			h1.classList.add("no-exist");
			document.querySelector(".item-list").appendChild(h1);
			return;
		}
		this.drawList(list, true);
	}

	calcTotal() { // 화면 우측하단의 총 합계 부분을 계산해주는 함수이다.
		let total = 0; // 총 합계를 담을 변수
		this.basket.forEach(x => { // 장바구니를 돌면서
			total += x.total; // 기존에 있던 total 변수에 장바구니 아이템의 total 값을 더해준다.
		});
		document.querySelector(".purchase-total > span").innerHTML = total.toLocaleString(); 
		// 화면 우측 하단의 총 합계 부분을 바꿔주고
		return total; // 영수증 팝업에서 필요하므로 total을 반환해준다.
	}

	itemTemp(item, high = false) {
		// product 정보를 가지고 있는 item 변수와
		// 하이라이팅 될지 안될지를 정하는 high 변수를 받아서
		// 상품리스트에 보일 item div 를 만드는 함수
		let div = document.createElement("div");
		// 가상의 div 태그를 만들고
		div.classList.add("item");
		// item 이라는 클래스를 넣고
		// innerHTML로 div 를 꾸며준다

		let keyword = document.querySelector("#search-input").value;
		// 하이라이팅 함수를 호출할수도 있으므로 keyword 변수를 미리 가지고 있는다.

		div.innerHTML = `
						<div class="item-brand">
							${high ? highlight(keyword, item.brand) : item.brand}
						</div>

						<img src="${item.photo}" alt="" class="item-img">
						
						<div class="item-name">
						${high ? highlight(keyword, item.name) : item.name}
						</div>
						<div class="item-price">
							${item.price}원
						</div>
		`;

		// high ? highlight(keyword, item.brand) : item.brand
		// 삼항연산자를 이용하였다.

		// 삼항연산자란?
		// 예를 들어
		// 삼항 연산자 알아 ? 끄덕 : 절레절레

		// let bool = true;
		// console.log(bool ? "트루입니다." : "풜스입니다.");
		// 이다. 위에서는 high ? highlight(keyword, item.brand) : item.brand 라고 적었는데
		// high 가 true 로 오면 하이라이팅된 텍스트 :: highlight(keyword, item.brand) 를 보여주고
		// high 가 flase 로 오면 그냥 텍스트 :: item.brand 를 보여주기 위함이다.

		div.querySelector("img").dataset.id = item.id;
		// div 안에 만들어놓은 img에 data-id 를 불어넣어 준다.

		return div; // 다 만들고 꾸민 div 를 반환해준다.
	}

	basketItemTemp(item) {
		// 장바구니에 보여질 li 를 꾸며다가 반환하는 함수

		let li = document.createElement("li"); 
		// 가상의 li 태그를 하나 만든다.

		li.classList.add("basket-item");
		// 이 li 에 basket-item 이라는 클래스를 넣어주고

		// 대충 안쪽을 잘 지지고 볶아준다.
		li.innerHTML = ` 
				<img src="${item.photo}" alt="">
					<div class="basket-item-text">
						<p class="basket-brand">${item.brand}</p>
						<p class="basket-name">${item.name}</p>
						<p class="basket-price">${item.price}원</p>
					</div>
					<div class="basket-cnt-total">
						<div class="basket-cnt">
							<input type="number" value="${item.cnt}" min="1">
						</div>
						<div class="basket-total">${item.price}원</div>
					</div>
					<div class="basket-close">&times;</div>
		`;
		return li; // 만든 li 를 도로 갖다준다.
	}
}

class Product { // Product 라는 클래스를 만들고
	constructor(id, photo, brand, name, price) {
		// 불러온 json에 정보를 입력받아서 객체를 만들어준다.
		this.id = id;
		this.photo = photo;
		this.brand = brand;
		this.name = name;
		this.price = price;
		this.priceNum = price.split(",").join('') * 1;
		// price 는 "15,000" 과 같은 "," (컴마) 를 포함한 문자열 형태로 들어온다.
		// priceNum 은 price를 숫자형태로 추출한 값을 변수에 담았다.
		// 예를 들어 "15,000" 에서 15000만 추출하기 위해 split 함수와 join 을 이용했다.

		// split 함수를 설명하자면,
		// split 함수를 호출한 문자열을 A, split 함수에 같이 넣어준 매개변수를 B 라고 가정하면
		// 위 줄에서 A : price 
		// 위 줄에서 B : ","
		// 문자열 A를 B 기준으로 나누어 배열로 반환한다.
		// 예를들어
		// let str = "박인환:김규태:김태연:정재성"; 이 있고
		// str.split(":") 을 호출하면
		// ["박인환","김규태","김태연","정재성"]
		// 위 배열로 반환된다.

		// 다시 price.split(",") 로 돌아가서
		// price 가 "15,000,000" 이였다면
		// price.split(",") 을 했을때
		// ["15","000","000"] 으로 반환된다.

		// 이제 이 배열을 join 시키면 된다.
		// join 함수는 배열을 보기좋게 string 으로 바꿔준다.

		// 예를 들어
		// let arr = ["박인환","김규태","김태연","정재성"];
		// 이런식의 배열이 있다. 이제 여기에다가
		// arr.join('!') 을 하면
		// "박인환!김규태!김태연!정재성" 과 같은 문자열이 나온다.
		// 한가지 더 예를 들면
		// let arr = ["안진우","박지호","전제","박명재"]; 
		// let str = arr.join("@");
		// console.log(str); => "안진우@박지호@전제@박명재"
		// 와 같다.
		// 다시 price.split(",").join('') 으로 돌아가서
		// price 가 "32,500,000" 일떄
		// price.split(",") 을 하면 ["32","500","000"] 이 되고
		// 이 배열을 빈 문자열 '' 로 join 하면,
		// "32500000" 으로 나오게 된다.
		// 이제 이 "32500000" 을 Number 형태로 바꿔주기위해 *1 을 하면
		// "32,500,000" 문자열이 숫자 형태의 32500000이 된다.

		this.cnt = 1;
		// 상품의 갯수를 저장하는 cnt 변수
		this.total = this.priceNum * this.cnt;
		// 상품의 총 합계 (갯수 * 가격) 을 담는 변수
	}

	calcTotal() {
		// Calculate => 계산하다.
		// Total => 합계
		// calcTotal => 합계를 계산하는 함수
		this.total = this.cnt * this.priceNum;
	}
}

// 여기서부터는 초성검색에 사용되는 함수들 이다.
function cho(str) {
	let arr = [
		"ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
		"ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"
	];
	let result = [];
	for (let i = 0; i < str.length; i++) {
		let index = Math.floor((str[i].charCodeAt() - 44032) / 588);
		result.push(arr[index] || str[i]);
	}
	return result.join('');
}

function match(keyword, data) {
	let keywordCho = cho(keyword);
	let dataCho = cho(data);
	let index = -1;
	let result = [];

	do {

		index = dataCho.indexOf(keywordCho, (index + 1));
		if (index > -1) result.push(index);

	} while (index > -1);
	return result;
}

function search(keyword, data) {
	let dataCho = cho(data);
	let indexes = match(keyword, data);
	let keywordLength = keyword.length;
	let result = [];

	for (let i = 0; i < indexes.length; i++) {
		let index = indexes[i];
		let flag = false;

		for (let j = 0; j < keywordLength; j++) {
			let keywordChar = keyword[j];
			let dataChar = (keywordChar.match(/[ㄱ-ㅎ]/) ? dataCho : data)[j + index];
			if (keywordChar != dataChar) flag = true;
		}

		if (!flag) result.push(index);
	}
	return result;
}

function highlight(keyword, data) {
	let name = [];
	let len = keyword.length;
	let indexes = search(keyword, data);
	name.push(data.substring(0, indexes[0]));
	indexes.forEach((index, i) => {
		name.push("<mark>" + data.substring(indexes[i], indexes[i] + len) + "</mark>");
		name.push(data.substring(indexes[i] + len, indexes[i + 1]));
	});
	return name.join('');
}

// 
